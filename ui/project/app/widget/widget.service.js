(function () {
    'use strict';

    angular
        .module('app.widget')
        .factory('widgetService', widgetService);

    widgetService.$inject = ['$http', 'exception', 'logger', 'APP_CONFIG'];
    /* @ngInject */
    function widgetService($http, exception, logger, APP_CONFIG) {
        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getWidgets: getWidgets
        };

        return service;

        function getWidgets() {
            return $http.get(serviceBase + 'api/Widget/GetAll')
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for getWidgets')(e);
            }
        }
    }
})();
