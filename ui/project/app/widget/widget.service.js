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
            get: get,
            post: post,
            put: put,
            del: del,
            getWidgetsByManufacturer: getWidgetsByManufacturer
    };

        return service;

        function get() {
            return $http.get(serviceBase + 'api/Widget/GetAll')
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for get')(e);
            }
        }

        function post(widget) {
            return $http.post(serviceBase + 'api/Widget/Post', widget)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for create')(e);
            }
        }

        function put(widget) {
            return $http.put(serviceBase + 'api/Widget/Put', widget)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for update')(e);
            }
        }

        function del(widget) {
            return $http.delete(serviceBase + 'api/Widget/Delete?id='+ widget.Id)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(e) {
                return exception.catcher('XHR Failed for delete')(e);
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
