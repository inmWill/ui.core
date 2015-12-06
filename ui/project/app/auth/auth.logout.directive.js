﻿(function() {
    'use strict';

    angular
        .module('app.auth')
        .directive('authLogout', authLogout);

    authLogout.$inject = ['$location', 'authService', 'logger'];
    /* @ngInject */
    function authLogout($location, authService, logger) {
        // Usage:
        //     <auth-logout></auth-logout>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            template: '<div ng-click="logout()">Logout</div>'
            //controller: function ($scope) {
            //    $scope.logout = function () {
            //        authService.logout();
            //        logger.info('Logged Out Successfully!');
            //        $location.path('/');
            //    };
            //}
        };
        return directive;

        function link(scope, element, attrs) {
            scope.logout = function () {
                authService.logout();
                logger.info('Logged Out Successfully!');
                $location.path('/');
            };
        }
    }

})();