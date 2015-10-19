(function () {
	'use strict';

	/**
     * Authentication Provider for ConSova OCV module.
     */

	angular.module('app.auth').config(function ($authProvider) {
		//$authProvider.baseUrl = 'http://localhost:51517/';
		//$authProvider.loginUrl = '/token';

		$authProvider.oauth2({
		    name: 'coreApp',
		    url: '/admin',
		    clientId: 'coreApp',
		    defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
		    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
		    authorizationEndpoint: 'http://localhost:51517/token'
		});

	    // GitHub
		$authProvider.github({
		    clientId: '7ad782f6ab00b25124b0',
		    url: '/auth/github',
		    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
		    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
		    optionalUrlParams: ['scope'],
		    scope: ['user:email'],
		    scopeDelimiter: ' ',
		    type: '2.0',
		    popupOptions: { width: 1020, height: 618 }
		});

		//$authProvider.github({
		//    clientId: '7ad782f6ab00b25124b0'
		//});
	});
})();