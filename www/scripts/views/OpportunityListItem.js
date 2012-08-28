/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/28/12
 * Time: 2:32 PM
 */

define(['jquery', 'underscore', 'Backbone', 'text!./OpportunityListItem.tpl'],
    function ($, _, Backbone, OpportunityListItemTemplate) {

        var OpportunityListItem = Backbone.View.extend({

            tagName:'li',

            initialize:function (options) {
                this.maxRevOpportunity = options.maxRevOpportunity;
                this.$el.jqmData('oppId', this.model.get('Id'));
            },

            render:function () {
                var tplData = this.model.toJSON(),
                    events = this.model.get('Events') ? this.model.get('Events').records : null;

                tplData.MaxExpectedRevenue = this.maxRevOpportunity.get('ExpectedRevenue');
                tplData.RevenuePerHour = 1000;
                tplData.EventsDurationInHours = events ? _.reduce(events, function (mem, event) {
                    return mem + (event.DurationInMinutes / 60);
                }, 0) : 0;

                this.$el.html(_.template(OpportunityListItemTemplate, tplData));

                return this;
            }

        });

        return OpportunityListItem;
    });