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
        vm.displayImage = '../../images/Mocks/profile/anon.jpg';


        activate();

        function activate() {
            if ($rootScope.currentUser !== undefined) {
                if ($rootScope.currentUser.authorized !== false) {
                    vm.displayName = $rootScope.currentUser.displayName;
                    vm.displayImage = '../../images/Mocks/profile/2.jpg';
                }
                else {
                    vm.displayName = '';
                    vm.displayImage = '../../images/Mocks/profile/anon.jpg';
                }
            } else {
                vm.displayName = '';
                vm.displayImage = '../../images/Mocks/profile/anon.jpg';
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
