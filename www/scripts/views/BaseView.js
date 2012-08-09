/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/9/12
 * Time: 1:58 PM
 */

define(['Backbone', 'require'],
    function (Backbone, require) {

        var BaseView = Backbone.View.extend({

            appModel:null,

            constructor:function () {
                this.appModel = require('models/appModel');
                Backbone.View.prototype.constructor.apply(this, Array.prototype.slice.call(arguments));
            }

        });

        return BaseView;
    }
);