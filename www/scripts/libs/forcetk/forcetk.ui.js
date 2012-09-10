/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 8/7/12
 * Time: 4:07 PM
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['forcetk'], factory);
    } else {
        // Browser globals
        factory(root.forcetk);
    }
}(this, function (forcetk) {

    if (typeof forcetk === 'undefined') {
        forcetk = {};
    }

    /**
     * ForceAuthUI constructor
     *
     * @param loginURL string Login url, typically it is: https://login.salesforce.com/
     * @param consumerKey string Consumer Key from Setup | Develop | Remote Access
     * @param callbackURL string Callback URL from Setup | Develop | Remote Access
     * @param successCallback function Function that will be called on successful login, it accepts single argument with forcetk.Client instance
     * @param errorCallback function Function that will be called when login process fails, it accepts single argument with error object
     *
     * @constructor
     */
    forcetk.ClientUI = function (loginURL, consumerKey, callbackURL, successCallback, errorCallback) {

        if (typeof loginURL !== 'string') throw new TypeError('loginURL should be of type String');
        this.loginURL = loginURL;

        if (typeof consumerKey !== 'string') throw new TypeError('consumerKey should be of type String');
        this.consumerKey = consumerKey;

        if (typeof callbackURL !== 'string') throw new TypeError('callbackURL should be of type String');
        this.callbackURL = callbackURL;

        if (typeof successCallback !== 'function') throw new TypeError('successCallback should of type Function');
        this.successCallback = successCallback;

        if (typeof errorCallback !== 'undefined' && typeof errorCallback !== 'function')
            throw new TypeError('errorCallback should of type Function');
        this.errorCallback = errorCallback;

        // Creating forcetk.Client instance
        this.client = new forcetk.Client(consumerKey, loginURL);

    }

    forcetk.ClientUI.prototype = {

        /**
         * Starts OAuth login process.
         */
        login:function login() {

            var refreshToken = localStorage.getItem('ftkui_refresh_token');

            if (refreshToken) {
                var that = this;
                this.client.setRefreshToken(encodeURIComponent(refreshToken));
                this.client.refreshAccessToken(
                    function refreshAccessToken_successHandler(sessionToken) {

                        if (that.successCallback) {
                            that.client.setSessionToken(sessionToken.access_token, null, sessionToken.instance_url);
                            that.successCallback.call(that, that.client);
                        }
                        else
                            console.log('INFO: OAuth login successful!')

                    },
                    function refreshAccessToken_errorHandler(jqXHR, textStatus, errorThrown) {
                        that._authenticate.call(that);
                    }
                );
            } else {
                this._authenticate();
            }

        },

        logout:function logout(logoutCallback) {
            var that = this,

                refreshToken = encodeURIComponent(this.client.refreshToken),

                doSecurLogout = function () {
                    $.ajax({
                        type:'GET',
                        async:that.client.asyncAjax,
                        url:that.client.instanceUrl + '/secur/logout.jsp',
                        cache:false,
                        processData:false,
                        success:function (data, textStatus, jqXHR) {
                            if (logoutCallback) logoutCallback.call();
                        },
                        error:function (jqXHR, textStatus, errorThrown) {
                            console.log('logout error');
                            if (logoutCallback) logoutCallback.call();
                        }
                    });
                }

            localStorage.setItem('ftkui_refresh_token', null);

            $.ajax({
                type:'POST',
                url:that.client.instanceUrl + '/services/oauth2/revoke',
                cache:false,
                processData:false,
                data:'token=' + refreshToken,
                success:function (data, textStatus, jqXHR) {
                    doSecurLogout();
                },
                error:function (jqXHR, textStatus, errorThrown) {
                    doSecurLogout();
                }
            });
        },

        _authenticate:function _authenticate() {
            var that = this;

            if (typeof window.device === 'undefined') { // Most likely app is running in a desktop browser

                var winHeight = 524,
                    winWidth = 674,
                    centeredY = window.screenY + (window.outerHeight / 2 - winHeight / 2),
                    centeredX = window.screenX + (window.outerWidth / 2 - winWidth / 2);

                var loginWindow = window.open(this._getAuthorizeUrl(),
                    'Login to Salesforce', 'height=' + winHeight + ',width=' + winWidth
                        + ',toolbar=1,scrollbars=1,status=1,resizable=1,location=0,menuBar=0'
                        + ',left=' + centeredX + ',top=' + centeredY);

                if (loginWindow) {
                    // Creating an interval to detect popup window location change event
                    var interval = setInterval(function () {
                        if (loginWindow.closed) {
                            // Clearing interval if popup was closed
                            clearInterval(interval);
                        } else {
                            var loc = loginWindow.location.href;
                            if (typeof loc !== 'undefined' && loc.indexOf(that.callbackURL) == 0) {
                                loginWindow.close();
                                that._sessionCallback(loc);
                            }
                        }
                    }, 250);

                    loginWindow.focus();
                }

            } else if (window.plugins && window.plugins.childBrowser) { // This is PhoneGap/Cordova app


                var childBrowser = window.plugins.childBrowser;
                childBrowser.onLocationChange = function (loc) {
                    if (loc.indexOf(that.callbackURL) == 0) {
                        childBrowser.close();
                        that._sessionCallback(decodeURIComponent(loc));
                    }
                };
                childBrowser.showWebPage(this._getAuthorizeUrl());

            } else {
                throw new Error('Didn\'t find way to authenticate!');
            }
        },

        _getAuthorizeUrl:function _getAuthorizeUrl() {
            return this.loginURL + 'services/oauth2/authorize?display=touch'
                + '&response_type=token&client_id=' + encodeURIComponent(this.consumerKey)
                + '&redirect_uri=' + encodeURIComponent(this.callbackURL);
        },

        _sessionCallback:function sessionCallback(loc) {
            var oauthResponse = {},
                fragment = loc.split("#")[1];

            if (fragment) {
                var nvps = fragment.split('&');
                for (var nvp in nvps) {
                    var parts = nvps[nvp].split('=');
                    oauthResponse[parts[0]] = decodeURIComponent(parts[1]);
                }
            }

            if (typeof oauthResponse.access_token === 'undefined') {

                if (this.errorCallback)
                    this.errorCallback({code:0, message:'Unauthorized - no OAuth response!'});
                else
                    console.log('ERROR: No OAuth response!')

            } else {

                localStorage.setItem('ftkui_refresh_token', oauthResponse.refresh_token);

                this.client.setRefreshToken(oauthResponse.refresh_token);
                this.client.setSessionToken(oauthResponse.access_token, null, oauthResponse.instance_url);

                if (this.successCallback)
                    this.successCallback(this.client);
                else
                    console.log('INFO: OAuth login successful!')

            }
        }
    }
    ;

    return forcetk;
}))
;
