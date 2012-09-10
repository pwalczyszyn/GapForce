/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 9/7/12
 * Time: 3:50 PM
 */

define(['jquery', 'underscore', 'Backbone', 'forcetk.ui', 'text!./LoginConfigView.tpl'],
    function ($, _, Backbone, forcetk, LoginConfigTemplate) {

        var LoginConfigView = Backbone.View.extend({

            events:{
                'click #btnSave':'btnSave_clickHandler',
                'click #btnBack':'btnBack_clickHandler'
            },

            render:function () {
                this.$el.html(LoginConfigTemplate);
                return this;
            },

            btnSave_clickHandler:function () {
                localStorage.setItem('gf_login_config', {
                    loginURL:this.$('#txtLoginURL').val(),
                    consumerKey:this.$('#txtConsumerKey').val(),
                    callbackURL:this.$('#txtCallbackURL').val()
                });
                $.mobile.jqmNavigator.popView();
            },

            btnBack_clickHandler:function () {
                $.mobile.jqmNavigator.popView();
            }

        });

        return LoginConfigView;
    });