/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 2:02 PM
 */

define(['jquery', 'underscore', 'Backbone', './OpportunityInfoSubview', './OpportunityContactsSubview',
        './OpportunityEventsSubview', 'text!./OpportunityView.tpl'],
    function ($, _, Backbone, OpportunityInfoSubview, OpportunityContactsSubview, OpportunityEventsSubview,
              OpportunityTemplate) {

        var OpportunityView = Backbone.View.extend({

            $content:null,

            subviews:null,

            currentView:null,

            events:{
                'pagehide':'this_pagehideHandler',
                'click #btnBack':'btnBack_clickHandler',
                'click div[data-role="navbar"] a':'navbarButton_clickHandler'
            },

            initialize:function (options) {
                // Initilizing subviews array
                this.subviews = [];

                // Adding back button handler
//                document.addEventListener('backbutton', this.btnBack_clickHandler, false);
            },

            this_pagehideHandler:function (event) {
                // EventsSubview listens on model events that is why it needs cleanup
                var eventsSubview = this.subviews['eventsSubview'];
                if (eventsSubview) eventsSubview.remove();
            },

            render:function () {

                // Setting view
                this.$el.html(OpportunityTemplate);

                // View main content element
                this.$content = this.$('div[data-role="content"]');

                // Showing initial subview
                this.showSubview('infoSubview', OpportunityInfoSubview);

                return this;
            },

            navbarButton_clickHandler:function (event) {
                switch (event.currentTarget.id) {
                    case 'btnInfo':

                        this.showSubview('infoSubview', OpportunityInfoSubview);

                        break;
                    case 'btnContacts':

                        this.showSubview('contactsSubview', OpportunityContactsSubview);

                        break;
                    case 'btnEvents':

                        var eventsSubview = this.showSubview('eventsSubview', OpportunityEventsSubview);

                        // Refreshing jQM list, refresh can be called only when view is in the DOM
                        eventsSubview.$('#lstEvents').listview('refresh');

                        break;
                }
            },

            showSubview:function (subviewId, SubviewType) {
                var subview = this.subviews[subviewId],
                    wasInstantiated = true;

                if (this.currentSubview) this.currentSubview.$el.detach();

                if (!subview) {
                    wasInstantiated = false;
                    this.subviews[subviewId] = subview = new SubviewType({model:this.model});
                }

                this.currentSubview = subview;
                this.$content.append(subview.el);

                if (!wasInstantiated) {
                    subview.render();
                    this.$content.trigger('create');
                }

                return subview;
            },

            btnBack_clickHandler:function (event) {
                // Removing back button event handler
//                document.removeEventListener('backbutton', arguments.callee, false);

                // Popping active view
                $.mobile.jqmNavigator.popView();
            }

        });

        return OpportunityView;
    });