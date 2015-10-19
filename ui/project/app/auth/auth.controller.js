(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$state', 'authService', 'logger'];

    function AuthController($state, authService, logger) {
        /* jshint validthis:true */
        var vm = this;

        vm.credentials = {
            username: '',
            password: ''
        };

        vm.currentUser = null;
        vm.title = 'auth';
        vm.result = '';

        vm.login = function () {
            authService.login(vm.credentials)
                .then(function (token) {
                    getCurrentUser();
                    vm.result = 'Login Successful!';
                })
                .catch(function (error) {
                    vm.result = error.error_description;
                });
        };

        vm.logout = function () {
            authService.logout();
            vm.currentUser = {};
            vm.result = 'Logout Successful!';
        };

        function getCurrentUser() {
            vm.currentUser = authService.currentUser();
        }

        activate();

        function activate() {
            getCurrentUser();
        }
    }
})();
