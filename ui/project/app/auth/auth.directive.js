(function() {
    'use strict';

    angular
        .module('app.auth')
        .directive('authLogin', authLogin);

    authLogin.$inject = ['$window'];
    
    function authLogin() {
        // Usage:
        //     <auth></auth>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/blocks/auth/login.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();