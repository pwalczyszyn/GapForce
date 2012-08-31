/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/31/12
 * Time: 3:07 PM
 */

define(['Backbone.Force'], function (Force) {

    var Opportunity = Force.Model.extend({
        type:'Opportunity'


    });

    return Opportunity;
});