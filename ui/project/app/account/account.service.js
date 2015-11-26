(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('accountService', accountService);

    accountService.$inject = ['$http', '$q', '$rootScope', 'exception', 'logger', 'APP_CONFIG', 'AUTH_EVENTS', 'localStorageService'];
    /* @ngInject */
    function accountService($http, $q, $rootScope, exception, logger, APP_CONFIG, AUTH_EVENTS, localStorageService) {
        var serviceBase = APP_CONFIG.serviceURIBase;
        //var user = null;

        var service = {
            getCurrentUser: getCurrentUser,
            updateCurrentUser: updateCurrentUser
        };
        return service;



        function getCurrentUser() {
            return $http.get(serviceBase + 'api/Account/GetCurrentUser')
                .then(success)
                .catch(fail);
            function success(response) {
                syncLocalUser(response.data.Firstname, response.data.Lastname);
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for getCurrentUser')(e);
            }
        }

        function updateCurrentUser(user) {
            return $http.put(serviceBase + 'api/Account/UpdateUserAccount', user)
                .then(success)
                .catch(fail);
            function success(response) {
                syncLocalUser(response.data.Firstname, response.data.Lastname);               
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for updateCurrentUser')(e);
            }

            
        }

        function syncLocalUser(first, last) {
            $rootScope.currentUser.displayName = first + ' ' + last;
            localStorageService.set('authorizationData', $rootScope.currentUser);
            $rootScope.$broadcast(AUTH_EVENTS.accountUpdated);
        }

    }
})();
