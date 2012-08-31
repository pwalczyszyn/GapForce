/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/29/12
 * Time: 12:17 PM
 */

define(['jquery', 'underscore', 'Backbone', 'Backbone.Force', 'text!./OpportunityContactsSubview.tpl'],
    function ($, _, Backbone, Force, OpportunityContactsTemplate) {

        var OpportunityContactsSubview = Backbone.View.extend({

            contacts:null,

            events:{
                'click #lstContacts li':'lstContacts_clickHandler'
            },

            render:function () {
                this.$el.html(OpportunityContactsTemplate);

                // Loading contacts list
                this.loadContacts();

                return this;
            },

            loadContacts:function () {
                var that = this;

                // Showing loader
                $.mobile.showPageLoadingMsg(null, 'Loading Contacts...');

                // Creating contacts collection
                this.contacts = new (Force.Collection.extend({
                    query:'select Id, FirstName, LastName, Phone from Contact where AccountId = \''
                        + this.model.get('Account').Id + '\''
                }));
                // Fetching opportunities
                this.contacts.fetch({
                    success:function (collection, response) {
                        $.mobile.hidePageLoadingMsg();

                        var items = [],
                            prevGroup = null;

                        // Traversing over returned contacts
                        collection.each(function (contact) {
                            var firstName = contact.get('FirstName'),
                                lastName = contact.get('LastName'),
                                phone = contact.get('Phone');

                            if (!prevGroup || prevGroup !== firstName.charAt(0).toUpperCase()) {
                                prevGroup = firstName.charAt(0).toUpperCase();

                                // Adding divider item
                                items.push($('<li data-role="list-divider">' + prevGroup + '</li>')[0]);
                            }

                            // Adding contact item
                            items.push($('<li data-icon="grid"><a href="#">' + firstName + ' '
                                + lastName + ' (' + phone + ')</a></li>').jqmData('contact', contact)[0]);
//                            items.push($('<li data-icon="grid"><a href="tel:' + phone + '">' + firstName + ' '
//                                + lastName + ' (' + phone + ')</a></li>').jqmData('contact', contact)[0]);
                        });

                        // Appending contacts elements to the list, and refreshing a list to apply jQM magic
                        that.$('#lstContacts').append(items).listview('refresh');

                    },
                    error:function (collection, response) {
                        $.mobile.hidePageLoadingMsg();
                        navigator.notification.alert('Error loading contacts: ' + response.statusText, null, 'Error!');
                    }
                });

            },

            lstContacts_clickHandler:function (event) {
                var that = this,
                    contact = $(event.currentTarget).jqmData('contact');

//                // Listening for PhoneGap specific pause event, it is triggered when call is made
//                document.addEventListener("pause", function () {
//                    document.removeEventListener('pause', arguments.callee);
//
//                    var callStartTime = new Date;
//
//                    // Listening for PhoneGap specific resume event, it's triggered when user returns back to an app
//                    document.addEventListener("resume", function () {
//                        document.removeEventListener('resume', arguments.callee);
//
//                        // Calculating call duration in minutes
//                        var callEndTime = new Date,
//                            durationInMinutes = (callEndTime.getTime() - callStartTime.getTime()) / 60000;
//
//                        navigator.notification.confirm('Do you want to create new Call Event, with duration of '
//                            + durationInMinutes + ' minutes?',
//                            function (button) {
//
//                                if (button == 1) {

                var callStartTime = new Date,
                    callEndTime = new Date;

                // Defining an Event type that maps to SF Event
                var Event = Force.Model.extend({
                        type:'Event'
                    }),
                    newEvent = new Event({
                        WhoId:contact.id,
                        WhatId:that.model.id,
                        StartDateTime:callStartTime,
                        EndDateTime:callEndTime,
                        Subject:'Call'
                    });

                newEvent.save(null, {
                    success:function (model, response) {

                        console.log('New event saved!');

                        // Fetching to load rest of the event data
                        model.fetch({
                            success:function () {
                                console.log('scuccess');
                            },
                            error:function (model, response) {
                                console.log('refetching failed ' + reponse.statusText);
                            }
                        })

                    },
                    error:function (model, response) {
                        navigator.notification.alert('Error saving new event: ' + response.statusText, null, 'Error!');
                    }
                });

//                                }
//
//                            }, 'Create Salesforce Event?', "OK,Cancel");
//
//                    }, false);
//
//                }, false);
            }

        });

        return OpportunityContactsSubview;
    });