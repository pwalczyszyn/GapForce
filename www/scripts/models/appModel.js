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

            var newOpp = new Opportunity({
                Name:'My new opp',
                StageName:'Prospecting',
                CloseDate:new Date()
            });
            newOpp.save(null, {
                success:function (result) {
                    console.log('create success');
                },
                error:function (result) {
                    console.log('fetch error');
                }
            });

//            var opp = new Opportunity({Id:'006E0000004sgp0'});
//            opp.fetch({
//                success:function (oppVal) {
//                    console.log('fetch success');
//
//                    oppVal.set('Amount', oppVal.get('Amount') + 1);
//
//                    oppVal.save(null, {
//                        success:function (result) {
//                            console.log('save success');
//                        },
//                        error:function (error) {
//                            console.log('save error');
//                        }
//                    });
//
//                },
//                error:function () {
//                    console.log('fetch error');
//                }
//            });
//

        }

    };

    _.extend(appModel, Backbone.Events);

    return appModel;

});