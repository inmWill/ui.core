(function () {
    'use strict';

    /**
     * Core user roles and events for core.auth.
     */

    angular.module('core').constant('USER_ROLES', {
        all: '*',
        admin: 'Admin',
        registered: 'registered',
        host: 'host'
    }).constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated', 
        notAuthorized: 'auth-not-authorized',
        profileChanged: 'auth-profile-changed'
    }).constant('AUTH_CONFIG', {
        authClientId: 'coreApp',
     //   authClientId: 'coreAzureApp',
     authURIBase: 'http://localhost:51517/'
    //     authURIBase: 'http://sandcastle01:8881/'
    }).constant('APP_CONFIG', {
     serviceURIBase: 'http://localhost:51517/'
    //     serviceURIBase: 'http://sandcastle01:8881/'
    });
})();