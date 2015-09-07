(function () {
    'use strict';

    angular.module('core', [
        // Angular modules 
        'ngAnimate',
        'ngCookies',
        'ngSanitize',

        // 3rd Party Modules
        'ui.bootstrap',
        'ui.router',
        'LocalStorageModule',
        'angular-loading-bar',
        'angularCharts',
        'angularUtils.directives.dirPagination',
        'validation.match'
        
    ]);
})();