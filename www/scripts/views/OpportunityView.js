/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 2:02 PM
 */

define(['jquery', 'underscore', './BaseView', './OpportunityInfoSubview', './OpportunityContactsSubview',
        'text!./OpportunityView.tpl'],
    function ($, _, BaseView, OpportunityInfoSubview, OpportunityContactsSubview, OpportunityTemplate) {

        var OpportunityView = BaseView.extend({

            $content:null,

            infoSubview:null,

            contactsSubview:null,

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click div[data-role="navbar"] a':'navbarButton_clickHandler'
            },

            initialize:function (options) {
                this.$el.html(OpportunityTemplate);
                this.$content = this.$('div[data-role="content"]');
            },

            render:function () {
                // Creating initial subview
                this.infoSubview = new OpportunityInfoSubview({model:this.model}).render();

                // Displaying initial subview
                this.$content.html(this.infoSubview.el);

                return this;
            },

            navbarButton_clickHandler:function (event) {

                if (event.currentTarget.id == 'btnInfo') {

                    // Detaching current view
                    this.contactsSubview.$el.detach();

                    // Appending subview
                    this.$content.append(this.infoSubview.el);

                } else {

                    // Detaching current view
                    this.infoSubview.$el.detach();

                    if (!this.contactsSubview) {
                        // Creating instance of contacts subview
                        this.contactsSubview = new OpportunityContactsSubview({model:this.model});

                        // Appending subview
                        this.$content.append(this.contactsSubview.el);

                        // Rendering a subview
                        this.contactsSubview.render();

                        // Triggering jQM create function to apply jQM magic
                        this.$content.trigger('create');

                    } else {
                        // Appending subview
                        this.$content.append(this.contactsSubview.el);
                    }
                }
            },

            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            }

        });

        return OpportunityView;
    });