//////////////////////////////////////////////////////////////////////////////////////
//
//	Copyright 2012 Piotr Walczyszyn (http://outof.me | @pwalczyszyn)
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//
//////////////////////////////////////////////////////////////////////////////////////

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(this, function ($) {

    $(document).bind("mobileinit", function () {

        // We want to handle link clicks from Backbone
        $.mobile.linkBindingEnabled = false;

        // We will handle forms programmatically
        $.mobile.ajaxEnabled = false;

        // We don't need this as we will be doing page navigation programmatically
        $.mobile.hashListeningEnabled = false;

        // We don't need this as we will be doing page navigation programmatically
        $.mobile.pushStateEnabled = false;

        // Turning off page auto initialization, we want to control it programmatically
        $.mobile.autoInitializePage = false;

        $.extend($.mobile, {
            jqmNavigator:{

                VERSION:'1.0.0',

                /**
                 * Map of containers and views
                 */
                _containers:[],

                /**
                 * If this is not set, jqmNavigator will use body tag as default container
                 */
                defaultPageContainer:null,

                /**
                 * Pushes view to the stack.
                 *
                 * @param view {Backbone.View}
                 * @param options {*} Transition parameters can be passed like: transition, reverse, showLoadMsg or loadMsgDelay
                 */
                pushView:function jqmNavigator_pushView(view, options) {
                    var containerViews = this._getPageContainerViews(options);

                    // Pushing the view to the stack
                    containerViews.views.push(view);
                    // Appending the view to the DOM
                    containerViews.pageContainer.append(view.el);
                    // Rendering the view
                    view.render();

                    if (!$.mobile.firstPage) {
                        // Adding data-role with page value
                        view.$el.attr('data-role', 'page');
                        // First time initialization
                        if (!$.mobile.autoInitializePage) $.mobile.initializePage();
                    } else {
                        // Changing page
                        $.mobile.changePage(view.$el, $.extend({
                            role:'page',
                            changeHash:false,
                            pageContainer:containerViews.pageContainer
                        }, options));
                    }
                },

                /**
                 * Pops view from the stack.
                 *
                 * @param options {*} Transition parameters can be passed like: transition, reverse, showLoadMsg or loadMsgDelay
                 */
                popView:function jqmNavigator_popView(options) {
                    var containerViews = this._getPageContainerViews(options);
                    if (containerViews.views.length > 1) {
                        // From view ref
                        var fromView = containerViews.views.pop();
                        // To view ref
                        toView = containerViews.views[containerViews.views.length - 1];

                        fromView.$el.one('pagehide', function (event) {
                            // Detaching view from DOM
                            fromView.$el.detach();
                        });

                        // Changing to view below current one
                        $.mobile.changePage(toView.$el, $.extend({
                            role:'page',
                            reverse:true,
                            changeHash:false,
                            pageContainer:containerViews.pageContainer
                        }, options));

                    } else {
                        console.log('Can\'t pop first view, you can replace it instead!');
                    }
                },

                /**
                 * Pops views from a stack up to the first one.
                 *
                 * @param options {*} Transition parameters can be passed like: transition, reverse, showLoadMsg or loadMsgDelay
                 */
                popToFirst:function jqmNavigator_popToFirst(options) {
                    var containerViews = this._getPageContainerViews(options);
                    if (containerViews.views.length > 1) {
                        // From view ref
                        var fromView = containerViews.views[containerViews.views.length - 1],
                        // To view ref
                            toView = containerViews.views[0],
                        // Removed views
                            removedViews = containerViews.views.splice(1, containerViews.views.length - 1);

                        fromView.$el.one('pagehide', function (event) {
                            removedViews.forEach(function (item) {
                                item.$el.detach();
                            }, this);
                        });

                        // Changing to view below current one
                        $.mobile.changePage(toView.$el, $.extend({
                            role:'page',
                            reverse:true,
                            changeHash:false,
                            pageContainer:containerViews.pageContainer
                        }, options));

                    } else {
                        console.log('Can\'t pop first view, you can replace it instead!');
                    }
                },

                /**
                 * Replaces current view on the stack.
                 *
                 * @param options {*} Transition parameters can be passed like: transition, reverse, showLoadMsg or loadMsgDelay
                 */
                replaceView:function jqmNavigator_replaceView(view, options) {
                    var containerViews = this._getPageContainerViews(options);
                    if (containerViews.views.length >= 1) {
                        // From view ref
                        var fromView = containerViews.views.pop();
                        fromView.$el.one('pagehide', function (event) {
                            // Detaching view from DOM
                            fromView.$el.detach();
                        });

                        // Pushing the view to the stack
                        containerViews.views.push(view);
                        // Appending the view to the DOM
                        containerViews.pageContainer.append(view.el);
                        // Rendering the view
                        view.render();

                        // Changing page
                        $.mobile.changePage(view.$el, $.extend({
                            role:'page',
                            changeHash:false,
                            pageContainer:containerViews.pageContainer
                        }, options));
                    }
                },

                /**
                 * Replaces all views on the stack.
                 *
                 * @param options {*} Transition parameters can be passed like: transition, reverse, showLoadMsg or loadMsgDelay
                 */
                replaceAll:function jqmNavigator_replaceAll(view, options) {
                    var containerViews = this._getPageContainerViews(options);
                    if (containerViews.views.length >= 1) {
                        // From view ref
                        var fromView = containerViews.views[containerViews.views.length - 1],
                        // Removed views
                            removedViews = containerViews.views.splice(0, containerViews.views.length);

                        fromView.$el.one('pagehide', function (event) {
                            removedViews.forEach(function (item) {
                                item.$el.detach();
                            }, this);
                        });

                        // Pushing the view to the stack
                        containerViews.views.push(view);
                        // Appending the view to the DOM
                        containerViews.pageContainer.append(view.el);
                        // Rendering the view
                        view.render();

                        // Changing page
                        $.mobile.changePage(view.$el, $.extend({
                            role:'page',
                            changeHash:false,
                            pageContainer:containerViews.pageContainer
                        }, options));

                    }
                },

                _getPageContainerViews:function (options) {
                    var pageContainer = options && options.pageContainer ? options.pageContainer :
                            $.mobile.pageContainer || this.defaultPageContainer || $('body'),
                        result;

                    this._containers.some(function (item) {
                        if (item.pageContainer[0] === pageContainer[0]) {
                            result = item;
                            return true;
                        }
                    }, this);

                    if (!result) this._containers.push(result = {pageContainer:pageContainer, views:[]});

                    return result;
                },

                /**
                 * Returns an array of views for specified pageContainer. If pageContainer param is omitted it tries to
                 * return views of default container.
                 *
                 * @param pageContainer
                 * @return {*}
                 */
                getViews:function jqmNavigator_getViews(pageContainer) {
                    var views,
                        pc = pageContainer ? pageContainer[0] : ($.mobile.pageContainer ? $.mobile.pageContainer[0] : null);
                    this._containers.some(function (item) {
                        if (item.pageContainer[0] === pc) {
                            views = item.views;
                            return true;
                        }
                    }, this);
                    return views;
                }
            }
        });
    });
}));