/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 11:36 AM
 */

define(['jquery', 'underscore', 'Backbone', 'forcetk.ui', './OpportunityView',
        'text!./MainView.tpl', 'require'],
    function ($, _, Backbone, forcetk, OpportunityView, MainTemplate, require) {

        var MainView = Backbone.View.extend({

            events:{
                'pageshow':'this_pageshowHandler',
                'click #btnOpportunity':'btnOpportunity_clickHandler'
            },

            initialize:function (options) {
                var that = this;

                // Loading appModel inline like this allows destructing it completely with requrie.undef
                // upon user logout.
                require(['models/appModel'], function (appModel) {

                    // Setting loaded appModel
                    that.appModel = appModel;

                    // Registering handler for initialized event
                    that.appModel.on('initialized', that.appModel_initializedHandler, that);

                    var loginURL = 'https://login.salesforce.com/',
                        consumerKey = '3MVG9y6x0357HledFmmKitP_D1Kw1SW0YTpmK_.icZKxZebnHvLydZyWo9dsKWc_zYxeYzAF_RLG1pGtauqA6',
                        callbackURL = 'https://login.salesforce.com/services/oauth2/success',

                        ftkClientUI = new forcetk.ClientUI(loginURL, consumerKey, callbackURL,
                            function forceOAuthUI_successHandler(forcetkClient) { // successCallback
                                that.appModel.initialize(forcetkClient);
                            },

                            function forceOAuthUI_errorHandler(error) { // errorCallback
                                navigator.notification.alert('Login failed: ' + error.message, null, 'Error');
                            }
                        );

                    ftkClientUI.login();

                });
            },

            render:function () {
                // Rendering a view from a template
                this.$el.html(MainTemplate);
                return this;
            },

            appModel_initializedHandler:function (event) {


            },

            this_pageshowHandler:function (event) {

            },

            btnOpportunity_clickHandler:function (event) {
                require.undef('models/appModel');
                $.mobile.jqmNavigator.replaceAll(new MainView());
            }

        });

        return MainView;
    });