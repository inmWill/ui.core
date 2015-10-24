(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('accountService', accountService);

    accountService.$inject = ['$http', '$q', 'exception', 'logger', 'APP_CONFIG'];
    /* @ngInject */
    function accountService($http, $q, exception, logger, APP_CONFIG) {
        var serviceBase = APP_CONFIG.serviceURIBase;
        var user = null;

        var service = {
            getCurrentUser: getCurrentUser,
            updateCurrentUser: updateCurrentUser
        };
        return service;



        function getCurrentUser() {
            return $http.get(serviceBase + 'api/Account/GetActiveUserAccount')
                .then(success)
                .catch(fail);
            function success(response) {
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
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for updateCurrentUser')(e);
            }

        }

    }
})();
