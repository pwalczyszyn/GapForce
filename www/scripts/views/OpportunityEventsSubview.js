/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/30/12
 * Time: 1:20 PM
 */

define(['jquery', 'underscore', 'Backbone', 'Backbone.Force', 'text!./OpportunityEventsSubview.tpl', 'moment'],
    function ($, _, Backbone, Force, OpportunityEventsTemplate, moment) {

        var OpportunityEventsSubview = Backbone.View.extend({

            events:null,

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

                // Creating contacts collection
                this.events = new (Force.Collection.extend({
                    query:'SELECT Id, Subject, Who.Name, Who.Type, DurationInMinutes, StartDateTime, EndDateTime' +
                        ', Description FROM Event WHERE WhatId = \'' + this.model.id + '\' ORDER BY StartDateTime DESC'
                }));

                // Fetching opportunities
                this.events.fetch({
                    success:function (collection, response) {
                        $.mobile.hidePageLoadingMsg();

                        var items = [];
                        collection.each(function (sfEvent) {

                            var sdt = moment(sfEvent.get('StartDateTime')),
                                edt = moment(sfEvent.get('EndDateTime')),
                                dateFormat = 'MMM Do - h:mm:ss a',
                                who = sfEvent.get('Who'),
                                desc = sfEvent.get('Description');

                            items.push($('<li><h3><strong>Duration:</strong> ' + sfEvent.get('DurationInMinutes') + ' minutes</h3>'
                                + (who ? ('<p><strong>' + who.Type + ':</strong> ' + who.Name + '</p>') : '')
                                + '<p><strong>Start:</strong> ' + sdt.format(dateFormat) + '</p>'
                                + '<p><strong>End:</strong> ' + edt.format(dateFormat) + '</p>'
                                + (desc ? ('<p><strong>Description:</strong> ' + sfEvent.get('Description') + '</p>') : '')
                                + '<span class="ui-li-aside">' + sfEvent.get('Subject') + '</span></li>')[0]);

                        });
                        that.$('#lstEvents').html(items).listview('refresh');
                    },
                    error:function (collection, response) {
                        $.mobile.hidePageLoadingMsg();
                        navigator.notification.alert('Error loading events: ' + response.statusText, null, 'Error!');
                    }
                });
            }

        });

        return OpportunityEventsSubview;
    });