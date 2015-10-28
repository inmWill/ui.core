(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$rootScope', 'authService', 'AUTH_EVENTS'];

    function AuthController($rootScope, authService, AUTH_EVENTS) {
        /* jshint validthis:true */
        var vm = this;

        vm.credentials = {
            username: '',
            password: ''
        };


        vm.title = 'Login';
        vm.result = 'Please Login';

        vm.login = function () {
            authService.login(vm.credentials)
                .then(function (token) {
                    vm.result = 'Login Successful!';
               //     $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                })
                .catch(function (error) {
                    vm.result = error.error_description;
                });
        };
    }
})();
