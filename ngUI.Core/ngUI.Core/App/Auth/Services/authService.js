(function () {
    'use strict';
    angular
        .module('core.auth')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'localStorageService', 'authSession', 'USER_ROLES', 'AUTH_CONFIG', 'userService'];

    function authService($http, $q, localStorageService, authSession, USER_ROLES, AUTH_CONFIG, userService) {

        var serviceBase = AUTH_CONFIG.authURIBase;
        var useRefreshTokens = true;

        var authentication = {
            isAuth: false,
            userName: ""
        };

        var factory = {
            registerUser: registerUser,
            login: login,
            logOut: logOut,
            fillAuthData: fillAuthData,
            authentication: authentication,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getUserData: getUserData,
            refreshActiveUserData: refreshActiveUserData,
            refreshToken: refreshToken,
            checkUsername: checkUsername
        };

        return factory;

        function checkUsername(username) {
            return $http.get(serviceBase + 'api/Account/CheckUsernameAvailability?username='+ username);
        }

        function isAuthenticated() {
            return authSession.isAuth;
        };

        function refreshActiveUserData() {
            userService.getActiveUser().then(function (profile) {
                authSession.saveUserData(profile);
                return authSession.getUserData();
            });
        }


        function getUserData() {

            return authSession.getUserData();
        }


        function isAuthorized(profile, authorizedRoles) {
            if (profile != null) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                for (var i = 0; i < authorizedRoles.length; i++) {
                    if (profile.UserRoles.indexOf(authorizedRoles[i]) !== -1) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        };

        function registerUser(registration) {

            logOut();

            return $http.post(serviceBase + 'api/account/RegisterClientEmployee', registration).then(function (response) {
                return response;
            });

        };

        function login(loginData) {

            var cleanPassword = encodeURIComponent(loginData.password);

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + cleanPassword;

            if (useRefreshTokens) {
                data = data + "&client_id=" + AUTH_CONFIG.authClientId;
            }

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, refreshToken: response.refresh_token, userName: loginData.userName, roles: response.userRoles });

          //      authSession.saveUserData(loginData.userName, response.userRoles);

                authentication.isAuth = true;
                authentication.userName = loginData.userName;
                authentication.role = response.userRoles;
                deferred.resolve(response);

            }).error(function (err) {
                logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        function logOut() {

            localStorageService.remove('authorizationData');
            authSession.clearUserData();
            authentication.isAuth = false;
            authentication.userName = "";
        };

        function refreshToken() {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + AUTH_CONFIG.authClientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token });

                    deferred.resolve(response);

                }).error(function (err) {
                    logOut();
                    deferred.reject(err);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        };

        function fillAuthData() {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                authentication.isAuth = true;
                authentication.userName = authData.userName;
                authentication.roleId = authData.roleId;
            }

        };


    }

})();