(function () {
    'use strict';

    /**
     * Authentication Provider for Core module.
     */

    angular.module('core.auth').run([
            'authService', function (authService) {
                authService.fillAuthData();
            }
    ]).config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });
})();