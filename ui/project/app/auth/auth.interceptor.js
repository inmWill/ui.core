(function () {
    'use strict';
    angular
        .module('app.auth')
        .factory('authInterceptorService', authInterceptorService);

    authInterceptorService.$inject = ['$q', '$injector', '$location', '$rootScope', 'localStorageService', 'cfpLoadingBar'];
    /* @ngInject */
    function authInterceptorService($q, $injector, $location, $rootScope, localStorageService, cfpLoadingBar) {

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
        }

        function responseError(rejection) {
            var deferred = $q.defer();
            cfpLoadingBar.complete();
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                authService.refreshUserToken().then(function (response) {
                    retryHttpRequest(rejection.config, deferred);
                },
                function () {
                    localStorageService.remove('authorizationData');
                    localStorageService.remove('userData');
                    $location.path('/');
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
            cfpLoadingBar.complete();
            return deferred.promise;
        }      

        function retryHttpRequest(config, deferred) {
            var $http = $injector.get('$http');
            $http(config).then(function (response) {
                deferred.resolve(response);
                cfpLoadingBar.complete();
            },
            function (response) {
                deferred.reject(response);
                cfpLoadingBar.complete();
            });
        }


    }
})();