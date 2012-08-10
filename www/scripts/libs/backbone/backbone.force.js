/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 4:20 PM
 */

(function () {
// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace
    var _ = this._,
        Backbone = this.Backbone;

    var methodMap = {
        'create':'POST',
        'update':'PATCH',
        'delete':'DELETE',
        'read':'GET'
    };

    Backbone.Force = {

        initialize:function (forctkClient) {
            this.client = forctkClient;
        },

        sync:function (method, model, options) {
            // Setting options if were not set
            options || (options = {});

            var client = Backbone.Force.client;
            // Extending options with Salesforce specific settings
            _.extend(options, {
                cache:false,
                dataType:'json',
                processData:false,
                type:methodMap[method],
                async:client.asyncAjax,
                contentType:'application/json',
                beforeSend:function (xhr) {
                    if (client.proxyUrl !== null) {
                        xhr.setRequestHeader('SalesforceProxy-Endpoint', options.url);
                    }
                    xhr.setRequestHeader(client.authzHeader, "OAuth " + client.sessionId);
                    xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + client.apiVersion);
                }
//    error: (!this.refreshToken || retry ) ? error : function(jqXHR, textStatus, errorThrown) {
//        if (jqXHR.status === 401) {
//            that.refreshAccessToken(function(oauthResponse) {
//                    that.setSessionToken(oauthResponse.access_token, null,
//                        oauthResponse.instance_url);
//                    that.ajax(path, callback, error, method, payload, true);
//                },
//                error);
//        } else {
//            error(jqXHR, textStatus, errorThrown);
//        }
//    },
            });

            // In case of update it has to follow custom logic because Salesforce uses PATCH method and accepts only
            // changed attributes
            if (method === 'update') {

                // Getting updates
                var changes = _.clone(model.changesToUpdate) || [],
                    updates = _.pick(model.toJSON(), changes);

                // Making sure that Is attribute is not part of update
                delete updates.Id;

                // Handling error
                var error = options.error;
                options.error = function () {

                    // In case of error reverting back changes to update
                    model.changesToUpdate = _.union(model.changesToUpdate, changes);

                    // Calling original error function
                    if (error) error.apply(this, Array.prototype.slice.call(arguments));

                };

                // Clearing current changes
                model.changesToUpdate.length = 0;

                // Setting options data property with updates
                options.data = JSON.stringify(updates);
            }

            // Calling original sync function
            Backbone.sync(method, model, options)
        },

        _getServiceURL:function () {
            return this.client.instanceUrl
                + '/services/data/'
                + this.client.apiVersion;
        }
    };

    Backbone.Force.Model = Backbone.Model.extend({

        // Salesforce Id attribute
        idAttribute:'Id',

        // Type of Salesforce object e.g. Opportunity, Account...
        type:null,

        // Fields to be loaded from Salesforce in fetch function
        fields:null,

        // Array of fields to be updated with next save funciton call
        changesToUpdate:null,

        // Setting Salesforce specific sync implementation
        sync:Backbone.Force.sync,

        constructor:function (attributes, options) {

            // Setting options if it wasn't passed to the function
//            options || (options = {});
//            options.addToUpdates = false;

            this._noneUpdateableChange = true;

            // Calling Backbone's constructor function
            Backbone.Model.prototype.constructor.call(this, attributes, options);
        },

        fetch:function (options) {
            // Setting options if it wasn't passed to the function
            options || (options = {});

            // Setting flag that indicates that this is fetch change
            options.addToUpdates = false;

            // Getting fields to fetch
            var fields = this.fields ? '?fields=' + this.fields.join(',') : '';

            // Setting options url property
            _.extend(options, {
                url:(Backbone.Force._getServiceURL() + '/sobjects/' + this.type + '/' + this.id + fields)
            });

            // Calling Backbone's fetch function
            return Backbone.Model.prototype.fetch.call(this, options);
        },

        save:function (key, value, options) {
            // Getting options property
            if (_.isObject(key) || key == null) options = value;

            // Setting options if it wasn't passed to the function
            options || (options = {});

            // Setting flag that indicates that this is create change
            // So when the service returns back it will not set anything to update
            if (this.isNew()) options.addToUpdates = false;

            // Setting url option
            _.extend(options, {
                url:(Backbone.Force._getServiceURL() + '/sobjects/' + this.type + '/' + (!this.isNew() ? this.id : ''))
            });

            // Calling Backbone's save function
            return Backbone.Model.prototype.save.call(this, key, value, options);
        },

        set:function (key, value, options) {
            var attrs;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (_.isObject(key) || key == null) {
                attrs = key;
                options = value;
            } else {
                attrs = {};
                attrs[key] = value;
            }

            // If attrs are set and this is not a fetch update
            if (attrs && (!options || options.addToUpdates !== false)) {
                // Setting changesToUpdate if were not set previously
                this.changesToUpdate || (this.changesToUpdate = []);
                // Adding current updates to this.changesToUpdate
                this.changesToUpdate = _.union(this.changesToUpdate, Object.keys(attrs));
            }

            // Calling Backbone's set function
            return Backbone.Model.prototype.set.call(this, key, value, options);
        }

    });

})();
