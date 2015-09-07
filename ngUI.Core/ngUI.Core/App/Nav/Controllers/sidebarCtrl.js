(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('sidebarController', sidebarController);

    sidebarController.$inject = ['$scope', '$location', '$cookieStore'];

    function sidebarController($scope, $location, $cookieStore) {
        var vm = this;
        vm.title = 'sidebar';
        vm.toggle = false;

        var mobileView = 992;

        $scope.getWidth = function () {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    vm.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    vm.toggle = true;
                }
            } else {
                vm.toggle = false;
            }

        });

        vm.toggleSidebar = function () {
            vm.toggle = !vm.toggle;
            $cookieStore.put('toggle', vm.toggle);
        };

        window.onresize = function () {
            $scope.$apply();
        };


    }
})();
