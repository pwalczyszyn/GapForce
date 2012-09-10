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

                // Binding model object with list item element
                this.$el.jqmData('model', this.model);

                // Registering change:Events event handler
                this.model.on('change:Events', this.events_changeHadler, this);
            },

            remove:function () {

                // Removing change:Events event handler
                this.model.off('change:Events', this.events_changeHadler);

                // Calling Backbone's original remove function
                Backbone.View.prototype.remove.call(this);

                return this;
            },

            render:function () {
                var tplData = this.model.toJSON(),
                    events = this.model.get('Events') ? this.model.get('Events').records : null;

                tplData.MaxExpectedRevenue = this.maxRevOpportunity.get('ExpectedRevenue');
                tplData.RevenuePerHour = 1000;
                tplData.EventsDurationInHours = events ? _.reduce(events, function (mem, event) {
                    return mem + (event.DurationInMinutes / 60);
                }, 0) : 0;

                // Rendering list item element content based on a template
                this.$el.html(_.template(OpportunityListItemTemplate, tplData));

                return this;
            },

            events_changeHadler:function (event) {
                // Rerendering list item
                this.render();
            }

        });

        return OpportunityListItem;
    });