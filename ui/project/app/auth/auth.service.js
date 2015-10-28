(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', '$rootScope', '$uibModal', 'exception', 'logger', 'APP_CONFIG', 'localStorageService', 'AUTH_EVENTS'];
    /* @ngInject */
    function authService($http, $q, $rootScope, $uibModal, exception, logger, APP_CONFIG, localStorageService, AUTH_EVENTS) {
        var baseUrl = APP_CONFIG.serviceURIBase;
        var isRegistered = APP_CONFIG.isRegistered;

        var user = {
            authorized: false,
            username: '',
            displayName: '',
            role: '',
            token: '',
            refreshToken: ''
        };

        var service = {
            login: login,
            logout: logout,
            refreshUserToken: refreshUserToken,
            currentUser: currentUser,
            openLoginModal: openLoginModal
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
                user.username = response.userName;
                user.displayName = response.displayName;
                user.role = response.userRoles;
                user.token = response.access_token;
                user.refreshToken = response.refresh_token;
                $rootScope.currentUser = user;
                localStorageService.set('authorizationData', user);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                deferred.resolve(response);
            }).error(function (err) {
                logout();
                deferred.reject(err);
            });

            return deferred.promise;

        }

        function logout() {

            localStorageService.remove('authorizationData');
            user.authorized = false;
            user.userName = '';
            user.displayName = '';
            user.role = [];
            user.token = '';
            user.refreshToken = '';
            $rootScope.currentUser = user;
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            return true;
        }

        function refreshUserToken() {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + APP_CONFIG.clientId;

                localStorageService.remove('authorizationData');

                $http.post(baseUrl + 'token', data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function (response) {
                    user.authorized = true;
                    user.username = response.userName;
                    user.displayName = response.displayName;
                    user.role = response.userRoles;
                    user.token = response.access_token;
                    user.refreshToken = response.refresh_token;
                    $rootScope.currentUser = user;
                    localStorageService.set('authorizationData', user);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
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
            if (!user.authorized) {
                readStoredUser();
            }
            return user;
        }
        function readStoredUser() {
            var storedUser = localStorageService.get('authorizationData');
            try {
                if (storedUser) {
                    user = storedUser;
                    $rootScope.currentUser = user;
                }
            } catch (ex) { /* Silently fail..*/ }
        }

        readStoredUser();

        function openLoginModal() {
            var instance = $uibModal.open({
                templateUrl: '/app/auth/login.html',
                controller: 'AuthLoginModalController',
                controllerAs: 'vm',
                size: 'sm'
            });

            return instance.result.then(function (credentials) {
                logger.info('On your way');
                return true;
             //   login(credentials);
            });
        }
    }
})();
