(function () {
    'use strict';
    angular
        .module('core.auth')
        .factory('authInterceptorService', authInterceptorService);

    authInterceptorService.$inject = ['$q', '$injector', '$location', 'localStorageService', 'AUTH_EVENTS', '$rootScope', 'cfpLoadingBar'];

    function authInterceptorService($q, $injector, $location, localStorageService, AUTH_EVENTS, $rootScope, cfpLoadingBar) {

        var factory = {
            request: request,
            responseError: responseError
        };

        return factory;

        function request(config) {
            config.headers = config.headers || {};
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
            return config;
        };

        function responseError(rejection) {
            var deferred = $q.defer();
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                authService.refreshToken().then(function (response) {
                    retryHttpRequest(rejection.config, deferred);
                },
                function () {
                    localStorageService.remove('authorizationData');
                    localStorageService.remove('userData');
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                    $location.path('/login');
                    cfpLoadingBar.complete();
                });
            }
            else if (rejection.status === 403) {
                deferred.reject(rejection);
                $location.path('/restricted');
                cfpLoadingBar.complete();
            }
            else {
                deferred.reject(rejection);
                cfpLoadingBar.complete();
            }
            return deferred.promise;
        };

        function retryHttpRequest(config, deferred) {
            var $http;
            $http = $injector.get('$http');
            $http(config).then(function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            });
        };


    }
})();