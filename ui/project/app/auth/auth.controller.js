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

        vm.currentUser = {};
        vm.title = 'auth';
        vm.result = '';
        getCurrentUser();
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

        function getCurrentUser() {
            vm.currentUser = authService.currentUser();
        }

        //vm.login = function () {

        //    var credentials = {
        //        username: vm.username,
        //        password: vm.password
        //    };

        //    // Use Satellizer's $auth service to login
        //    authService.login(credentials).then(function (data) {

        //        // If login is successful, redirect to the users state
        //        vm.result = "Login Successful!";
        //        //$state.go('account', {});
        //    });
        //};

        activate();

        function activate() { }
    }
})();
