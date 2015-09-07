(function () {
    'use strict';

    angular
        .module('core.client')
        .factory('clientService', clientService);

    clientService.$inject = ['$http', 'APP_CONFIG'];

    function clientService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getAllClients: getAllClients
        };

        return service;

        function getAllClients() {
            return $http.get(serviceBase + 'api/client/getall')
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