(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authLoginController', authLoginController);

    authLoginController.$inject = ['$scope', '$rootScope', '$location', 'authService', 'AUTH_EVENTS', 'userService', 'authSession'];

    function authLoginController($scope, $rootScope, $location, authService, AUTH_EVENTS, userService, authSession) {
        var vm = this;
        vm.title = 'authLoginController';
        vm.loginData = {
            userName: "",
            password: ""
        };
        vm.message = "";

        vm.login = function () {

            authService.login(vm.loginData).then(function (user) {
                userService.getActiveUser().then(function (profile) {
                    authSession.saveUserData(profile);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $location.path('/home');
                });
                
                
            },
                function (err) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    vm.message = err.error_description;
                });
        };

        vm.logOut = function () {
            authService.logOut();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $location.path('/login');
        };

    }
})();
