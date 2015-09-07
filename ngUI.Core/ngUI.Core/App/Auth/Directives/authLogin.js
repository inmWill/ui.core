(function() {
    'use strict';

    angular
        .module('core.auth')
        .directive('authLogin', ['$window', authLogin]);
    
    function authLogin ($window) {
        // Usage:
        // allows users to login to the website
        // Creates:
        // login form

        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/auth/directives/authLogin.html',
            controller: 'authLoginController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();