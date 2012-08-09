/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 2:02 PM
 */

define(['jquery', 'underscore', './BaseView'],
    function ($, _, BaseView) {

        var OpportunityView = BaseView.extend({

            initialize:function (options) {

                console.log(this.appModel);

            },

            render:function () {

                return this;
            }

        });

        return OpportunityView;
    });