(function() {
    'use strict';

    angular
        .module('core.auth')
        .directive('authSignup', ['$window', authSignup]);
    
    function authSignup($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/auth/directives/authSignup.html',
            controller: 'authSignupController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();