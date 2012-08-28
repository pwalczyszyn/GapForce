/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 11:36 AM
 */

define(['jquery', 'underscore', 'Backbone', 'forcetk.ui', './OpportunityView', 'text!./MainView.tpl',
        './OpportunityListItem', 'require'],
    function ($, _, Backbone, forcetk, OpportunityView, MainTemplate, OpportunityListItem, require) {

        var MainView = Backbone.View.extend({

            appModel:null,

            opportunitiesListItems:null,

            events:{
                'pageshow':'this_pageshowHandler',
                'click li':'li_clickHandler'
            },

            initialize:function (options) {
                var that = this;

                // Rendering a view from a template
                this.$el.html(MainTemplate);

                // Initiating opps list items array
                this.opportunitiesListItems = [];

                // Loading appModel dynamically allows destructing it with requrie.undef upon user logout.
                require(['models/appModel'], function (appModel) {

                    // Registering handler for initialized event
                    appModel.on('initialized', that.appModel_initializedHandler, that);

                    // Salesforce login URL
                    var loginURL = 'https://login.salesforce.com/',
                    // Salesforce consumer key
                        consumerKey = '3MVG9y6x0357HledFmmKitP_D1Kw1SW0YTpmK_.icZKxZebnHvLydZyWo9dsKWc_zYxeYzAF_RLG1pGtauqA6',
                    // Salesforce callback URL
                        callbackURL = 'https://login.salesforce.com/services/oauth2/success',
                    // Instantiating forcetk ClientUI
                        ftkClientUI = new forcetk.ClientUI(loginURL, consumerKey, callbackURL,
                            function forceOAuthUI_successHandler(forcetkClient) { // successCallback
                                appModel.initialize(forcetkClient);
                            },

                            function forceOAuthUI_errorHandler(error) { // errorCallback
                                navigator.notification.alert('Login failed: ' + error.message, null, 'Error');
                            }
                        );

                    // Initiating login process
                    ftkClientUI.login();
                });
            },

            this_pageshowHandler:function (event) {
                if (!this.appModel) $.mobile.showPageLoadingMsg(null, 'Loading...');
            },

            appModel_initializedHandler:function (appModel) {
                // Setting appModel
                this.appModel = appModel;

                // Looking for an opportunity with highest revenue
                var maxRevOpportunity = this.appModel.opportunities.max(function (opp) {
                    return opp.get('ExpectedRevenue');
                });

                // Iterating over opportunities and creating list items
                this.appModel.opportunities.each(function (opp) {
                    var li = new OpportunityListItem({model:opp, maxRevOpportunity:maxRevOpportunity}).render();
                    this.opportunitiesListItems.push(li);
                }, this);

                // Hiding page loading message
                $.mobile.hidePageLoadingMsg();

                // Adding list items
                this.$('#lstOpportunities').html(_.pluck(this.opportunitiesListItems, 'el')).listview("refresh");
            },

            li_clickHandler:function (event) {
                var opp = this.appModel.opportunities.get($(event.currentTarget).jqmData('oppId'));

            },

            btnLogout_clickHandler:function (event) {
                require.undef('models/appModel');
                $.mobile.jqmNavigator.replaceAll(new MainView());
            }

        });

        return MainView;
    });