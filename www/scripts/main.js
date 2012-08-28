/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/4/12
 * Time: 7:52 PM
 */

require.config({
    paths:{
        // RequireJS plugin
        text:'libs/require/text',
        // RequireJS plugin
        domReady:'libs/require/domReady',
        // underscore library
        underscore:'libs/underscore/underscore',
        // Backbone.js library
        Backbone:'libs/backbone/backbone',
        // jQuery
        jquery:'libs/jquery/jquery-1.7.1',
        // jQuery Mobile framework
        jqm:'libs/jquery.mobile/jquery.mobile-1.1.1',
        // jQuery Mobile plugin for Backbone views navigation
        jqmNavigator:'libs/jquery.mobile/jqmNavigator',
        // Salesforce REST API library
        forcetk:'libs/forcetk/forcetk',
        // Extension Salesforce REST API library providing OAuth UI
        'forcetk.ui':'libs/forcetk/forcetk.ui',
        // Backbone plugin for Salesforce
        'Backbone.Force':'libs/backbone/backbone.force'
    },
    shim:{
        Backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
        underscore:{
            exports:'_'
        },
        'Backbone.Force':{
            deps:['jquery', 'underscore', 'Backbone'],
            exports:'Backbone.Force'
        },
        jqm:{
            deps:['jquery', 'jqm-config'/* jQM specific config */, 'jqmNavigator']
        },
        forcetk:{
            deps:['jquery'],
            exports:'forcetk'
        }
    }
});

require(['domReady', 'views/MainView', 'models/appModel', 'jqm'],
    function (domReady, MainView) {

        // domReady is RequireJS plugin that triggers when DOM is ready
        domReady(function () {

            function onDeviceReady(desktop) {
                // Hiding splash screen when app is loaded
                if (desktop !== true)
                    cordova.exec(null, null, "SplashScreen", "hide", []);

                // Pushing MainView
                $.mobile.jqmNavigator.pushView(new MainView());
            }

            if (navigator.userAgent.match(/(iPad|iPhone|Android)/)) {
                // This is running on a device so waiting for deviceready event
                document.addEventListener("deviceready", onDeviceReady, false);
            } else {
                // Polyfill for navigator.notification features to work in browser when debugging
                navigator.notification = {alert:function (message) {
                    // Using standard alert
                    alert(message);
                }};
                // On desktop don't have to wait for anything
                onDeviceReady(true);
            }
        });
    }
);