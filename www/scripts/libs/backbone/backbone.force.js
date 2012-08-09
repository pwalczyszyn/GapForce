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

    Backbone.Force = {

        initialize:function (forctkClient) {
            this.client = forctkClient;
        },

        sync:function (method, model, options) {

            var client = Backbone.Force.client;

            _.extend(options, {
                async:client.asyncAjax,
                contentType:'application/json',
                dataType:'json',
                cache:false,
                processData:false,
                beforeSend:function (xhr) {
                    if (client.proxyUrl !== null) {
                        xhr.setRequestHeader('SalesforceProxy-Endpoint', options.url);
                    }
                    xhr.setRequestHeader(client.authzHeader, "OAuth " + client.sessionId);
                    xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + client.apiVersion);
                }
            });

            Backbone.sync(method, model, options)
        }
    };

    Backbone.Force.Model = Backbone.Model.extend({

        type:null,

        fields:null,

        sync:Backbone.Force.sync,

        fetch:function (options) {

            var client = Backbone.Force.client,
                fetchUrl = [client.instanceUrl , '/services/data/', client.apiVersion, '/sobjects/', this.type, '/',
                            this.id, (this.fields ? '?fields=' + this.fields.join(',') : '')].join('');

            _.extend(options, {url:fetchUrl});

            return Backbone.Model.prototype.fetch.call(this, options);
        }

    });

//    Backbone.sync = function (method, model, options) {
//        var type = methodMap[method];
//
//        // Default options, unless specified.
//        options || (options = {});
//
//        // Default JSON-request options.
//        var params = {type:type, dataType:'json'};
//
//        // Ensure that we have a URL.
//        if (!options.url) {
//            params.url = getValue(model, 'url') || urlError();
//        }
//
//        // Ensure that we have the appropriate request data.
//        if (!options.data && model && (method == 'create' || method == 'update')) {
//            params.contentType = 'application/json';
//            params.data = JSON.stringify(model.toJSON());
//        }
//
//        // For older servers, emulate JSON by encoding the request into an HTML-form.
//        if (Backbone.emulateJSON) {
//            params.contentType = 'application/x-www-form-urlencoded';
//            params.data = params.data ? {model:params.data} : {};
//        }
//
//        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
//        // And an `X-HTTP-Method-Override` header.
//        if (Backbone.emulateHTTP) {
//            if (type === 'PUT' || type === 'DELETE') {
//                if (Backbone.emulateJSON) params.data._method = type;
//                params.type = 'POST';
//                params.beforeSend = function (xhr) {
//                    xhr.setRequestHeader('X-HTTP-Method-Override', type);
//                };
//            }
//        }
//
//        // Don't process data on a non-GET request.
//        if (params.type !== 'GET' && !Backbone.emulateJSON) {
//            params.processData = false;
//        }
//
//        // Make the request, allowing the user to override any Ajax options.
//        return $.ajax(_.extend(params, options));
//    };

})();

//
//var that = this;
//var url = this.instanceUrl + '/services/data' + path;
//
//$j.ajax({
//    type: method || "GET",
//    async: this.asyncAjax,
//    url: (this.proxyUrl !== null) ? this.proxyUrl: url,
//    contentType: 'application/json',
//    cache: false,
//    processData: false,
//    data: payload,
//    success: callback,
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
//    dataType: "json",
//    beforeSend: function(xhr) {
//        if (that.proxyUrl !== null) {
//            xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
//        }
//        xhr.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
//        xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
//    }
//});