(function () {
    'use strict';

	angular.module('app.auth').config(configAuth).run(loadSavedUser);

	configAuth.$inject = ['$httpProvider'];
    function configAuth($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }

	loadSavedUser.$inject = ['authService'];
	function loadSavedUser(authService) {
	    authService.currentUser();
	}
})();

