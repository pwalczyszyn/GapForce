/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 11:36 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Backbone.Force', 'forcetk.ui', './OpportunityView', 'text!./MainView.tpl',
        './OpportunityListItem', 'require'],
    function ($, _, Backbone, Force, forcetk, OpportunityView, MainTemplate, OpportunityListItem, require) {

        var MainView = Backbone.View.extend({

            opportunitiesListItems:null,

            forcetkClient:null,

            events:{
                'pageshow':'this_pageshowHandler',
                'click li':'li_clickHandler',
                'click #btnRefresh':'btnRefresh_clickHandler',
                'click #btnLogout':'btnLogout_clickHandler'
            },

            initialize:function (options) {
                // Forcetk client ref
                this.ftkClientUI = options.ftkClientUI;

                // Initiating opps list items array
                this.opportunitiesListItems = [];

                // Creating opportunities collection
                this.opportunities = new (Force.Collection.extend({
                    query:'SELECT Id, Name, ExpectedRevenue, CloseDate, Account.Id, Account.Name, StageName, Description' +
                        ', LeadSource, (select DurationInMinutes from Events) FROM Opportunity WHERE IsClosed = false'
                }));

            },

            render:function () {
                // Rendering a view from a template
                this.$el.html(MainTemplate);

                return this;
            },

            this_pageshowHandler:function (event) {
                // Loading opportunities
                this.loadOpportunities();
            },

            loadOpportunities:function () {
                var that = this;

                $.mobile.showPageLoadingMsg(null, 'Loading...');

                // Clearing current items
                this.opportunitiesListItems.length = 0;

                // Fetching opportunities
                this.opportunities.fetch({
                    success:function (collection, response) {

                        // Looking for an opportunity with highest revenue
                        var maxRevOpportunity = collection.max(function (opp) {
                            return opp.get('ExpectedRevenue');
                        });

                        // Iterating over opportunities and creating list items
                        collection.each(function (opp) {
                            var li = new OpportunityListItem({model:opp, maxRevOpportunity:maxRevOpportunity}).render();
                            that.opportunitiesListItems.push(li);
                        }, that);

                        // Hiding page loading message
                        $.mobile.hidePageLoadingMsg();

                        // Adding list items
                        this.$('#lstOpportunities').html(_.pluck(that.opportunitiesListItems, 'el')).listview("refresh");

                    },
                    error:function (collection, response) {
                        navigator.notification.alert('Error fetching opportunities: ' + response.statusText, null, 'Error');
                    }
                });

            },

            li_clickHandler:function (event) {
                var opportunity = $(event.currentTarget).jqmData('model');
                $.mobile.jqmNavigator.pushView(new OpportunityView({model:opportunity}));
            },

            btnRefresh_clickHandler:function (event) {
                // Loading opportunities
                this.loadOpportunities();
            },

            btnLogout_clickHandler:function (event) {
                $.mobile.showPageLoadingMsg(null, 'Logout...');
                this.ftkClientUI.logout(function () {
                    $.mobile.jqmNavigator.popView();
                });
            }

        });

        return MainView;
    });