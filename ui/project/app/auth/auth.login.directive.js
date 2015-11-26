(function() {
    'use strict';

    angular
        .module('app.auth')
        .directive('authLogin', authLogin);

    authLogin.$inject = ['$location', 'authService', 'logger'];
    
    function authLogin($location, authService, logger) {
        // Usage:
        //     <auth-login></auth-login>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            template: '<div ng-click="login()">Login</div>',
            controller: function ($scope, $element) {
                $scope.login = function () {
                    authService.openLoginModal();
                };
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();