(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'exception', 'logger', 'APP_CONFIG', 'localStorageService'];
    /* @ngInject */
    function authService($http, $q, exception, logger, APP_CONFIG, localStorageService) {
        var baseUrl = APP_CONFIG.serviceURIBase;
        var isRegistered = APP_CONFIG.isRegistered;

        var user = null;

        function readStoredUser() {
            //Try to read in from localStorage if one exists
            var storedUser = localStorageService.get('authorizationData');
            try {
                if (storedUser) {
                    // Note: Using a simple user model here
                    user = storedUser;
                }
            } catch (ex) { /* Silently fail..*/ }
        }

        readStoredUser();

        function currentUser() {
            if (!user) {
                readStoredUser();
            }
            return user;
        }

        var service = {
            login: login,
            logOut: logOut,
            currentUser: currentUser
        };
        return service;


        function login(credentials) {

            var cleanPassword = encodeURIComponent(credentials.password);
            var data = 'grant_type=password&username=' + credentials.username + '&password=' + cleanPassword;

            if (isRegistered) {
                data = data + '&client_id=' + APP_CONFIG.clientId;
            }

            var deferred = $q.defer();
            $http.post(baseUrl + 'token', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (response) {
                     localStorageService
                         .set('authorizationData', {
                             token: response.access_token,
                             refreshToken: response.refresh_token,
                             username: credentials.username,
                             roles: response.userRoles,
                             authorized: true
                         });
                     currentUser.authorized = true;
                     currentUser.username = credentials.username;
                     currentUser.role = response.userRoles;
                     deferred.resolve(response);
            }).error(function (err) {
                logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        }

        function logOut() {

            localStorageService.remove('authorizationData');
            //authSession.clearUserData();
            currentUser.authorized = false;
            currentUser.username = '';
        }
    }
})();
