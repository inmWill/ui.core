(function () {
    'use strict';

	angular.module('app.auth').config(function ($httpProvider) {
	    $httpProvider.interceptors.push('authInterceptorService');
	});
})();

