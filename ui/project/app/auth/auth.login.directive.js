(function() {
    'use strict';

    angular
        .module('app.auth')
        .directive('authLogin', authLogin);

    authLogin.$inject = ['$location', 'authService', 'logger'];
    /* @ngInject */
    function authLogin($location, authService, logger) {
        // Usage:
        //     <auth-login></auth-login>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            template: '<div ng-click="login()">Login</div>'
            //controller: function ($scope) {
            //    $scope.login = function () {
            //        authService.openLoginModal();
            //    };
           // }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.login = function () {
                        authService.openLoginModal();
                    };
        }
    }

})();