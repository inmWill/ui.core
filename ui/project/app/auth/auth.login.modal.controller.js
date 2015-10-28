(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthLoginModalController', AuthLoginModalController);

    AuthLoginModalController.$inject = ['$rootScope', 'authService', '$uibModalInstance', 'logger', 'AUTH_EVENTS'];

    function AuthLoginModalController($rootScope, authService, $uibModalInstance, logger, AUTH_EVENTS) {
        /* jshint validthis:true */
        var vm = this;

        vm.credentials = {
            username: '',
            password: ''
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.title = 'Login';
        vm.result = 'Please Login';

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

    }
})();
