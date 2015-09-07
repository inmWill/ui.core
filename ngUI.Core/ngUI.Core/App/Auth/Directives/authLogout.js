(function() {
    'use strict';

    angular
        .module('core.auth')
        .directive('authLogout', ['$window', authLogout]);
    
    function authLogout ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/auth/directives/authLogout.html',
            controller: 'authLoginController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();