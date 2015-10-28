(function () {
    'use strict';

	angular.module('app.auth').config(function ($httpProvider) {
	    $httpProvider.interceptors.push('authInterceptorService');
	}).run(loadSavedUser);

	loadSavedUser.$inject = ['authService'];
	function loadSavedUser(authService) {
	    authService.currentUser();
	}
})();

