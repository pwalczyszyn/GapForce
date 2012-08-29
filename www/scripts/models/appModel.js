/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 2:10 PM
 */

define(['jquery', 'underscore', 'Backbone.Force'], function ($, _, Force) {

    var appModel = {

        // Salesforce opportunities
        opportunities:null,

        initialize:function (forcetkClient) {

            var that = this;

            // Initializing Backbone.Force plugin
            Force.initialize(forcetkClient);

            // Creating opportunities collection
            this.opportunities = new (Force.Collection.extend({
                query:'SELECT Id, Name, ExpectedRevenue, CloseDate, Account.Id, Account.Name, StageName, Description' +
                    ', LeadSource, (select DurationInMinutes from Events) FROM Opportunity WHERE IsClosed = false'
            }));

            // Fetching opportunities
            this.opportunities.fetch({
                success:function (collection, response) {
                    that.trigger('initialized', that);
                },
                error:function (collection, response) {
                    console.log('Error fetching opportunities: ' + response.statusText);
                }
            });

        }
    };
    _.extend(appModel, Backbone.Events);

    return appModel;

});