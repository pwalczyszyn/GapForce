/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/29/12
 * Time: 12:17 PM
 */

define(['jquery', 'underscore', 'Backbone', 'text!./OpportunityInfoSubview.tpl'],
    function ($, _, Backbone, OpportunityInfoTemplate) {

        var OpportunityInfoSubview = Backbone.View.extend({

            render:function () {
                this.$el.html(_.template(OpportunityInfoTemplate, this.model.toJSON()));
                return this;
            }

        });

        return OpportunityInfoSubview;
    });