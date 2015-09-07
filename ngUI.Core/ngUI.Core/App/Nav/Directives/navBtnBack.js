(function() {
    'use strict';

    angular
        .module('coreApp')
        .directive('navBtnBack', navBtnBack);

    navBtnBack.$inject = ['$window'];
    
    function navBtnBack ($window) {
        // Usage:
        //     <navBtnBack></navBtnBack>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict   : 'E',
            replace    : true,
            transclude : true,
            templateUrl: 'App/Nav/Directives/navBtnBack.html',

        };

        return directive;

        function link(scope, element, attrs) {
            scope.goBack = function () {
                $window.history.back();
            };
        }
    }

})();