(function() {
    'use strict';

    angular
        .module('coreApp')
        .directive('navMenu', ['$window', navMenu]);
    
    function navMenu($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'App/Nav/Directives/navMenu.html',
            controller: 'navMenuController',
            controllerAs: 'nav'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();