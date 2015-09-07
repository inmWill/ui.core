(function () {
    'use strict';

    angular
        .module('core.client')
        .factory('clientEmployeeService', clientEmployeeService);

    clientEmployeeService.$inject = ['$http', 'APP_CONFIG'];

    function clientEmployeeService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getAllClientEmployees: getAllClientEmployees           
        };

        return service;

        function getAllClientEmployees() {
            return $http.get(serviceBase + 'api/clientemployee/getall')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded (response) {
                return response.data;
            }

            function getFailed(error) {
                
            }
        }


    }
})();