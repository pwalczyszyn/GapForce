/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/30/12
 * Time: 1:20 PM
 */

define(['jquery', 'underscore', 'Backbone', 'Backbone.Force', 'text!./OpportunityEventsSubview.tpl',
    'text!./OpportunityEventListItem.tpl', 'moment'],
    function ($, _, Backbone, Force, OpportunityEventsTemplate, OpportunityEventListItemTemplate, moment) {

        var OpportunityEventsSubview = Backbone.View.extend({

            sfEvents:null,

            initialize:function (options) {
                this.model.on('newEventAdded', this.model_newEventAddedHandler, this);

                // Creating contacts collection
                this.sfEvents = new (Force.Collection.extend({
                    query:'SELECT Id, Subject, Who.Name, Who.Type, DurationInMinutes, StartDateTime, EndDateTime' +
                        ', Description FROM Event WHERE WhatId = \'' + this.model.id + '\' ORDER BY StartDateTime DESC'
                }));

            },

            remove:function () {

                // Removing newEventAdded event handler
                this.model.off('newEventAdded', this.model_newEventAddedHandler);

                // Calling Backbone's original remove function
                Backbone.View.prototype.remove.call(this);

                return this;
            },

            render:function () {
                this.$el.html(OpportunityEventsTemplate);

                // Loading Event info
                this.loadEvents();

                return this;
            },

            loadEvents:function () {

                var that = this;

                // Showing loader
                $.mobile.showPageLoadingMsg(null, 'Loading Events...');

                // Fetching opportunities
                this.sfEvents.fetch({
                    success:function (collection, response) {
                        $.mobile.hidePageLoadingMsg();

                        var items = [];
                        collection.each(function (sfEvent) {
                            items.push(that.createEventListItem(sfEvent)[0]);
                        });
                        that.$('#lstEvents').html(items).listview('refresh');
                    },
                    error:function (collection, response) {
                        $.mobile.hidePageLoadingMsg();
                        navigator.notification.alert('Error loading events: ' + response.statusText, null, 'Error!');
                    }
                });
            },

            createEventListItem:function (sfEvent) {
                var dateFormat = 'MMM Do - h:mm:ss a',
                    tplData = {
                        StartDateTime:moment(sfEvent.get('StartDateTime')).format(dateFormat),
                        EndDateTime:moment(sfEvent.get('EndDateTime')).format(dateFormat),
                        Description:sfEvent.get('Description'),
                        Who:sfEvent.get('Who'),
                        DurationInMinutes:sfEvent.get('DurationInMinutes'),
                        Subject:sfEvent.get('Subject')
                    };

                return $(_.template(OpportunityEventListItemTemplate, tplData));
            },

            model_newEventAddedHandler:function (newSfEvent) {
                var $li = this.createEventListItem(newSfEvent);
                this.$('#lstEvents').prepend($li);
            }

        });

        return OpportunityEventsSubview;
    });