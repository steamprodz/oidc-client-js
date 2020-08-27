// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('clearState').addEventListener("click", clearState, false);
document.getElementById('getUser').addEventListener("click", getUser, false);
document.getElementById('removeUser').addEventListener("click", removeUser, false);
document.getElementById('querySessionStatus').addEventListener("click", querySessionStatus, false);

document.getElementById('startSigninMainWindow').addEventListener("click", startSigninMainWindow, false);
document.getElementById('endSigninMainWindow').addEventListener("click", endSigninMainWindow, false);
document.getElementById('startSigninMainWindowDiffCallbackPage').addEventListener("click", startSigninMainWindowDiffCallbackPage, false);

document.getElementById('popupSignin').addEventListener("click", popupSignin, false);
document.getElementById('iframeSignin').addEventListener("click", iframeSignin, false);

document.getElementById('startSignoutMainWindow').addEventListener("click", startSignoutMainWindow, false);
document.getElementById('endSignoutMainWindow').addEventListener("click", endSignoutMainWindow, false);

document.getElementById('popupSignout').addEventListener("click", popupSignout, false);

document.getElementById('clientCredentialsAuth').addEventListener("click", clientCredentialsAuth, false);
document.getElementById('testApi').addEventListener("click", testApi, false);

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
console.log("Using oidc-client version: ", Oidc.Version);

var url = window.location.origin;

var settings = {
    authority: 'https://demo.identityserver.io',
    client_id: 'm2m',
    //client_id: 'spa.short',
    redirect_uri: url + '/client-credentials-identityserver-sample.html',
    post_logout_redirect_uri: url + '/client-credentials-identityserver-sample.html',
    //response_type: 'code',
    //response_mode: 'fragment',
    //scope: 'openid profile api',
    //scope: 'openid profile email api offline_access',
    client_secret: 'secret',
    scope: 'api',

    grant_type: 'client_credentials',
    
    popup_redirect_uri: url + '/code-identityserver-sample-popup-signin.html',
    popup_post_logout_redirect_uri: url + '/code-identityserver-sample-popup-signout.html',
    
    silent_redirect_uri: url + '/code-identityserver-sample-silent.html',
    automaticSilentRenew:false,
    validateSubOnSilentRenew: true,
    //silentRequestTimeout:10000,

    monitorAnonymousSession : true,

    filterProtocolClaims: true,
    loadUserInfo: true,
    revokeAccessTokenOnSignout : true
};
var mgr = new Oidc.UserManager(settings);

///////////////////////////////
// events
///////////////////////////////
mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
    log("token expiring");

    // maybe do this code manually if automaticSilentRenew doesn't work for you
    mgr.signinSilent().then(function(user) {
        log("silent renew success", user);
    }).catch(function(e) {
        log("silent renew error", e.message);
    })
});

mgr.events.addAccessTokenExpired(function () {
    console.log("token expired");
    log("token expired");
});

mgr.events.addSilentRenewError(function (e) {
    console.log("silent renew error", e.message);
    log("silent renew error", e.message);
});

mgr.events.addUserLoaded(function (user) {
    console.log("user loaded", user);
    mgr.getUser().then(function(){
       console.log("getUser loaded user after userLoaded event fired"); 
    });
});

mgr.events.addUserUnloaded(function (e) {
    console.log("user unloaded");
});

mgr.events.addUserSignedIn(function (e) {
    log("user logged in to the token server");
});
mgr.events.addUserSignedOut(function (e) {
    log("user logged out of the token server");
});

///////////////////////////////
// functions for UI elements
///////////////////////////////
function clearState(){
    mgr.clearStaleState().then(function(){
        log("clearStateState success");
    }).catch(function(e){
        log("clearStateState error", e.message);
    });
}

function getUser() {
    mgr.getUser().then(function(user) {
        log("got user", user);
    }).catch(function(err) {
        log(err);
    });
}

function removeUser() {
    mgr.removeUser().then(function() {
        log("user removed");
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindow() {
    var someState = {message:'some data'};
    mgr.signinRedirect({state:someState, useReplaceToNavigate:true}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function endSigninMainWindow() {
    mgr.signinCallback().then(function(user) {
        log("signed in", user);
        // this is how you get the state after the login:
        var theState = user.state;
        var theMessage = theState.message;
        console.log("here's our post-login state", theMessage);
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindowDiffCallbackPage() {
    mgr.signinRedirect({state:'some data', redirect_uri: url + '/code-identityserver-sample-callback.html'}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function popupSignin() {
    mgr.signinPopup({state:'some data'}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function popupSignout() {
    mgr.signoutPopup({state:'some data'}).then(function() {
        log("signed out");
    }).catch(function(err) {
        log(err);
    });
}

function iframeSignin() {
    mgr.signinSilent({state:'some data'}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function querySessionStatus() {
    mgr.querySessionStatus().then(function(status) {
        log("user's session status", status);
    }).catch(function(err) {
        log(err);
    });
}

function startSignoutMainWindow(){
    mgr.signoutRedirect({state:'some data'}).then(function(resp) {
    //mgr.signoutRedirect().then(function(resp) {
            log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

function endSignoutMainWindow(){
    mgr.signoutCallback().then(function(resp) {
        log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

function clientCredentialsAuth() {
    mgr.signinSilent({state:'some data', grant_type: 'client_credentials'}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function testApi() {
    return mgr.getUser().then((user) => {
        if (user && user.access_token) {
            return _callApi(user.access_token);
        } else if (user) {
            // Renew token
            return mgr.signinSilent({state:'some data', grant_type: 'client_credentials'}).then((user) => {
                return this._callApi(user.access_token);
            });
        } else {
            throw new Error('user is not logged in');
        }
        });

    // mgr.signinSilent({state:'some data', grant_type: 'client_credentials'}).then(function(user) {
    //     log("signed in", user);
    // }).catch(function(err) {
    //     log(err);
    // });
}

function _callApi(token) {
    var jsonService = new Oidc.JsonService();

    return jsonService.getJson(settings.authority + "/api/test", token)
        .then((result) => {
            log("api call result", result);
        })
        .catch((result) => {
            if (result.status === 401) {
                // Renew token
                return mgr.signinSilent({state:'some data', grant_type: 'client_credentials'}).then(user => {
                    return _callApi(user.access_token);
                });
            }
            log(result);
            throw result;
        });
}
