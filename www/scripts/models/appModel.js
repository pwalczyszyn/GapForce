/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 2:10 PM
 */

define(['jquery', 'underscore', 'Backbone.Force'], function ($, _, BackboneForce) {

    var appModel = {

        // forcetk.Client instance
        client:null,

        initialize:function (forcetkClient) {

            this.client = forcetkClient;

            BackboneForce.initialize(forcetkClient);

            var Opportunity = BackboneForce.Model.extend({type:'Opportunity'});

            var opp = new Opportunity({id:'006E0000004sgp0'});
            opp.fetch({
                success:function (oppVal) {
                    console.log('fetch success');

                    oppVal.set('Amount', 235001);

                    oppVal.save(null, {
                        success:function (result) {
                            console.log('save success');
                        },
                        error:function (error) {
                            console.log('save error');
                        }
                    });

                },
                error:function () {
                    console.log('fetch error');
                }
            });

//            var headers = {};
//            headers[this.client.authzHeader] = "OAuth " + this.client.sessionId;
//            headers['X-User-Agent'] = 'salesforce-toolkit-rest-javascript/' + this.client.apiVersion;
//            $.ajaxSetup({headers:headers});


//            this.client.query("SELECT Name FROM Account LIMIT 1",
//                function (response) {
//                    $('#message').html('The first account I see is '
//                        + response.records[0].Name);
//                }
//            );

        }

    };

    _.extend(appModel, Backbone.Events);

    return appModel;

});