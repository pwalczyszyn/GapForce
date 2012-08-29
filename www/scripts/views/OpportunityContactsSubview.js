/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/29/12
 * Time: 12:17 PM
 */

define(['jquery', 'underscore', 'Backbone', 'text!./OpportunityContactsSubview.tpl'],
    function ($, _, Backbone, OpportunityContactsTemplate) {

        var ViewClass = Backbone.View.extend({

            initialize:function (options) {

            },

            render:function () {

                return this;
            }

        });

        return ViewClass;
    });