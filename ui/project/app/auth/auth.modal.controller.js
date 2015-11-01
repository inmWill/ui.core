(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthModalController', AuthModalController);

    AuthModalController.$inject = ['$rootScope', 'authService', '$uibModalInstance', 'logger', 'AUTH_EVENTS'];

    function AuthModalController($rootScope, authService, $uibModalInstance, logger, AUTH_EVENTS) {
        /* jshint validthis:true */
        var vm = this;
        vm.showBlock = 1;
        vm.credentials = {
            username: '',
            password: ''
        };
        vm.UsernameAvailable = true;


        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.title = 'Login';
        vm.result = 'Authorization Required';
        //vm.passStrength = 0;

        vm.login = function (credentials) {
            authService.login(credentials)
                .then(function (token) {
                    logger.success('User logged in.');
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $uibModalInstance.close(true);
                })
                .catch(function (error) {
                    logger.warning('Login Failed.');
                    vm.result = 'Incorrect Username or Password';
                });

        };

        vm.register = function (newAccount) {
            authService.register(newAccount)
                .then(function (result) {
                    if (result) {
                        vm.credentials.username = newAccount.Username;
                        vm.credentials.password = newAccount.Password;
                        vm.login(vm.credentials);
                    }
                })
                .catch(function (error) {
                    logger.warning('Registration Failed: ' + error);
                    vm.result = 'Registration Error';
                });
        };

        vm.checkUsername = function (username) {
            if (username !== undefined) {
                authService.checkUsername(username)
                    .then(function (result) {
                        vm.UsernameAvailable = result.data;
                    })
                    .catch(function (error) {
                        logger.warning('Username Lookup Failed: ' + error);
                        vm.result = 'Username Lookup Failed';
                    });
            }
        };

    }
})();
