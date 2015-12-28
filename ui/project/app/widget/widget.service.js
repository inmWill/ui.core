(function () {
    'use strict';

    angular
        .module('app.widget')
        .factory('widgetService', widgetService);

    widgetService.$inject = ['$http', 'exception', 'APP_CONFIG'];
    /* @ngInject */
    function widgetService($http, exception, APP_CONFIG) {
        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getWidgets: getWidgets,
            getWidgetsByManufacturer: getWidgetsByManufacturer
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
        function getWidgetsByManufacturer(manufacturer) {
            return $http.get(serviceBase + 'api/Widget/GetByManufacturer?whichManufacturer='+manufacturer)
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
