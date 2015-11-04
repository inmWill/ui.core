(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('CurrentUserController', CurrentUserController);

    CurrentUserController.$inject = ['$rootScope', 'AUTH_EVENTS'];
    /* @ngInject */
    function CurrentUserController($rootScope, AUTH_EVENTS) {
        var vm = this;
        vm.displayName = '';

       

        activate();

        function activate() {
            if ($rootScope.currentUser !== undefined) {
                vm.displayName = $rootScope.currentUser.displayName;
            }
        }

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            activate();
        });

        $rootScope.$on(AUTH_EVENTS.accountUpdated, function () {
            activate();
        });

        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            activate();
        });
    }
})();
