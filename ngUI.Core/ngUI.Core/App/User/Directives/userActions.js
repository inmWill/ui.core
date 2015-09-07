(function() {
    'use strict';

    angular
        .module('core.user')
        .directive('userActions', ['$window', userActions]);
    
    function userActions ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'App/User/Directives/userActions.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();