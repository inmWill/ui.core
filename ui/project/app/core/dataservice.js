(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger', 'APP_CONFIG'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger, APP_CONFIG) {
        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount
        };
        return service;


        function getMessageCount() { return $q.when(72); }

        function getPeople() { 
            return $http.get(serviceBase + 'api/ClientEmployee/GetPagedClients?page=1&pagesize=20')
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for getPeople')(e);
            }
        }
    }
})();
