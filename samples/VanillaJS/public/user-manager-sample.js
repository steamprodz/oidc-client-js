// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('clearState').addEventListener("click", clearState, false);
document.getElementById('getUser').addEventListener("click", getUser, false);
document.getElementById('removeUser').addEventListener("click", removeUser, false);

document.getElementById('startSigninMainWindow').addEventListener("click", startSigninMainWindow, false);
document.getElementById('endSigninMainWindow').addEventListener("click", endSigninMainWindow, false);
document.getElementById('startSigninMainWindowDiffCallbackPage').addEventListener("click", startSigninMainWindowDiffCallbackPage, false);

document.getElementById('popupSignin').addEventListener("click", popupSignin, false);
document.getElementById('iframeSignin').addEventListener("click", iframeSignin, false);

document.getElementById('startSignoutMainWindow').addEventListener("click", startSignoutMainWindow, false);
document.getElementById('endSignoutMainWindow').addEventListener("click", endSignoutMainWindow, false);

document.getElementById('popupSignout').addEventListener("click", popupSignout, false);

document.getElementById('authService').addEventListener("click", authServiceTest, false);

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.WARN;

var settings = {
    authority: 'http://localhost:15000/oidc',
    client_id: 'js.tokenmanager',
    redirect_uri: 'http://localhost:15000/user-manager-sample.html',
    post_logout_redirect_uri: 'http://localhost:15000/user-manager-sample.html',
    response_type: 'id_token token',
    scope: 'openid email roles',

    grant_type: 'client_credentials',
    
    popup_redirect_uri:'http://localhost:15000/user-manager-sample-popup-signin.html',
    popup_post_logout_redirect_uri:'http://localhost:15000/user-manager-sample-popup-signout.html',
    
    silent_redirect_uri:'http://localhost:15000/user-manager-sample-silent.html',
    automaticSilentRenew:true,
    //silentRequestTimeout:10000,

    filterProtocolClaims: true,
    loadUserInfo: true
};
var mgr = new Oidc.UserManager(settings);

var settingsMetaUI = {
    authority: 'https://localhost:44344',
    client_id: 'external_api',
    scope: 'metaui_identity_admin_api',
    client_secret: 'company',

    grant_type: 'client_credentials',
    
    // popup_redirect_uri: url,
    // popup_post_logout_redirect_uri: url,
    
    silent_redirect_uri: 'https://demo.identityserver.io',
    // automaticSilentRenew:false,
    // validateSubOnSilentRenew: true,
    // //silentRequestTimeout:10000,

    // monitorAnonymousSession : true,

    // filterProtocolClaims: true,
    // loadUserInfo: true,
    // revokeAccessTokenOnSignout : true
};

///////////////////////////////
// events
///////////////////////////////
mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
    log("token expiring");
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
    mgr.signinRedirect({state:'some data'}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function endSigninMainWindow() {
    mgr.signinRedirectCallback().then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindowDiffCallbackPage() {
    mgr.signinRedirect({state:'some data', redirect_uri: 'http://localhost:15000/user-manager-sample-callback.html'}).then(function() {
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

function startSignoutMainWindow(){
    mgr.signoutRedirect({state:'some data'}).then(function(resp) {
    //mgr.signoutRedirect().then(function(resp) {
            log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

function endSignoutMainWindow(){
    mgr.signoutRedirectCallback().then(function(resp) {
        log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

function authServiceTest() {
    Oidc.IdentityAuthService.settings = settingsMetaUI;
    var service = Oidc.IdentityAuthService.instance;

    service.requestOrRenewToken()
        .then((user) => {
            log("user retrieved: ", user);

            service.getUser()
                .then((user) => {
                    log("getUser retrieved: ", user);
                })
                .catch((err) => {
                    log("exception when retrieving getUser: ", err);
                });
        })
        .catch((err) => {
            log("exception when retrieving user: ", err);
        });

    
}
