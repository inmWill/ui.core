(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('navMenuController', navMenuController);

    navMenuController.$inject = ['$scope', '$location', 'authService', 'authSession', 'AUTH_EVENTS'];

    function navMenuController($scope, $location, authService, authSession, AUTH_EVENTS) {
        var vm = this;
        vm.title = 'navMenuController';
        vm.authInfo = authSession.getUserData;

        //$scope.$watch(authSession.getUserData, function (newValue, oldValue) {
        //    if (newValue) {
        //        vm.authInfo = newValue;
        //    } 
        //});

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            vm.authInfo = authSession.getUserData();
        });

    }
})();
