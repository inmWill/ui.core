(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authActiveUserController', authActiveUserController);

    authActiveUserController.$inject = ['$scope', 'USER_ROLES', 'AUTH_EVENTS', 'authService', 'userService'];

    function authActiveUserController($scope, USER_ROLES, AUTH_EVENTS, authService, userService) {
        $scope.title = 'authActiveUserController';
        $scope.currentUser = null;
        $scope.activeUserProfile = null;
        $scope.userData = authService.getUserData();

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
            userService.getActiveUser().then(function (profile) {
                $scope.activeUserProfile = profile;
            });
        };

        $scope.isAuthorized = function (profile, role) {
            return authService.isAuthorized(profile, role);
        };

        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.userData = authService.getUserData();
        });

        $scope.$on(AUTH_EVENTS.profileChanged, function () {
            $scope.userData = authService.getUserData();
        });

        $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
            $scope.userData = null;
        });





    }
})();
