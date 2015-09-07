(function() {
    'use strict';

    angular
        .module('coreApp')
        .directive('navActiveAudit', ['$window', navActiveAudit]);
    
    function navActiveAudit ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'App/Nav/Directives/navActiveAudit.html',
            controller: 'navActiveAuditController',
            controllerAs: 'audit'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();