(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('toggleSubmenu', toggleSubmenu);

    toggleSubmenu.$inject = ['$window'];
    /* @ngInject */
    function toggleSubmenu($window) {
        // Usage:
        //     <submenu></submenu>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            element.click(function () {
                element.parent().toggleClass('toggled');
                element.parent().find('ul').stop(true, false).slideToggle(200);
            });
        }
    }

})();