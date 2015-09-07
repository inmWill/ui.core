(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authSignupController',authSignupController);

    authSignupController.$inject = ['$location', '$timeout', 'authService'];

    function authSignupController($location, $timeout, authService) {
        var vm = this;
        vm.title = 'authSignup';

        vm.success = false;
        vm.message = "";

        //vm.registration = {
        //    Email: "",
        //    SSN: "",
        //    confirmPassword: "",
        //    DateOfBirth: "",
        //    LastName: "",
        //    Password: "",
        //};

        vm.registration = {
            Username: "",
            Email: "",
            SSN: "",
            confirmPassword: "",
            DateOfBirth: "",
            LastName: "",
            Password: "",
        };

        vm.register = function () {

            authService.registerUser(vm.registration).then(function (response) {

                vm.success = true;
                vm.message = "Your account has been registered successfully, you will be redirected to the login page in 2 seconds.";
                redirectToLogin();

            },
                function (response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    vm.message = "Failed to register user due to:" + errors.join(' ');
                });
        };

        var redirectToLogin = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/login');
            }, 2000);
        };

        vm.checkUsername = function (username) {
            vm.searchingUsername = true;
            vm.usernameExists = false;
            authService.checkUsername(username).success(function (response) {
                vm.searchingUsername = false;
            })
            .error(function (error) {
                vm.usernameExists = true;
                vm.searchingUsername = false;
            });
        }

        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };

    }
})();
