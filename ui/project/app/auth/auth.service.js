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

        var user = {};

        var service = {
            login: login,
            logout: logout,
            refreshUserToken: refreshUserToken,
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
                    user.authorized = true;
                    user.username = credentials.username;
                    user.role = response.userRoles;
                    user.token = response.access_token;
                    user.refreshToken = response.refresh_token;
                    localStorageService.set('authorizationData', user);
                    deferred.resolve(response);
                }).error(function (err) {
                logout();
                deferred.reject(err);
            });

            return deferred.promise;

        }

        function logout() {

            localStorageService.remove('authorizationData');
            //authSession.clearUserData();
            currentUser.authorized = false;
            currentUser.username = '';
            return true;
        }

        function refreshUserToken() {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + APP_CONFIG.authClientId;

                localStorageService.remove('authorizationData');

                $http.post(baseUrl + 'token', data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (response) {
                        user.authorized = true;
                        user.username = response.userName;
                        user.role = response.userRoles;
                        user.token = response.access_token;
                        user.refreshToken = response.refresh_token;
                        localStorageService.set('authorizationData', user);
                        deferred.resolve(response);
                    }).error(function (err) {
                        logout();
                        deferred.reject(err);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function currentUser() {
            if (!user) {
                readStoredUser();
            }
            return user;
        }

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
    }
})();
