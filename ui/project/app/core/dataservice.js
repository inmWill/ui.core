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
            return $q.when([
        { id: 1, firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
        { id: 2, firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
        { id: 3, firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
        { id: 4, firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
        { id: 5, firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
        { id: 6, firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
        { id: 7, firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' },
        { id: 8, firstName: 'Aaron', lastName: 'Jinglehiemer', age: 22, location: 'Utah' }
            ]);
            //return $http.get(serviceBase + 'api/ClientEmployee/GetPagedClients?page=1&pagesize=20')
            //    .then(success)
            //    .catch(fail);
            //function success(response) {
            //    return response.data;
            //}
            //function fail(e) {
            //    return exception.catcher('XHR Failed for getPeople')(e);
            //}
        }
    }
})();
