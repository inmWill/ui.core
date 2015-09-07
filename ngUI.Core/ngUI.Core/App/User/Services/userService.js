(function () {
    'use strict';

    angular
        .module('core.user')
        .service('userService', userService);

    userService.$inject = ['$http', 'APP_CONFIG'];

    function userService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getActiveUser: getActiveUser,
            getAllUsers: getAllUsers,
            disableUserAccount: disableUserAccount,
            enableUserAccount: enableUserAccount,
            updateActiveUserProfile: updateActiveUserProfile
        };

        return service;

        function updateActiveUserProfile(profile) {
            return $http.put(serviceBase + 'api/Account/UpdateActiveUserProfile', profile);
        }

        function getActiveUser() {
            return $http.get(serviceBase + 'api/Account/GetActiveUserAccount')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded(response) {
                return response.data;
            }

            function getFailed(error) {

            }
        }

        function getAllUsers() {
            return $http.get(serviceBase + 'api/Account/GetAllUserAccounts')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded(response) {
                return response.data;
            }

            function getFailed(error) {

            }
        }

        function enableUserAccount(user) {
            return $http.put(serviceBase + 'api/Account/EnableUserAccount', user);
        }

        function disableUserAccount(user) {
            return $http.put(serviceBase + 'api/Account/DisableUserAccount', user);
        }
    }
})();