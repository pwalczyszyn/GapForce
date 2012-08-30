/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 2:02 PM
 */

define(['jquery', 'underscore', './BaseView', './OpportunityInfoSubview', './OpportunityContactsSubview',
        './OpportunityEventsSubview', 'text!./OpportunityView.tpl'],
    function ($, _, BaseView, OpportunityInfoSubview, OpportunityContactsSubview, OpportunityEventsSubview,
              OpportunityTemplate) {

        var OpportunityView = BaseView.extend({

            $content:null,

            subviews:null,

            currentView:null,

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click div[data-role="navbar"] a':'navbarButton_clickHandler'
            },

            initialize:function (options) {
                // Initilizing subviews array
                this.subviews = [];
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

                        this.showSubview('eventsSubview', OpportunityEventsSubview);
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
            },


            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            }

        });

        return OpportunityView;
    });