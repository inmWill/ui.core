(function () {
    'use strict';

    angular
        .module('core.user')
        .controller('userAdminController', userAdminController);

    userAdminController.$inject = ['$location', 'userService', '$scope', 'authSession', 'AUTH_EVENTS', '$filter'];

    function userAdminController($location, userService, $scope, authSession, AUTH_EVENTS, $filter) {
        /* jshint validthis:true */
        var vm = this;
        vm.message = '';
        vm.title = 'User Admin Controller';
        vm.working = false;
        vm.message = "";

        vm.users = [];
        vm.currentPage = 1;
        vm.pageSize = 50;
        activate();

        function activate() {
            return getAllUsers().then(function () {

            });
        };

        function getAllUsers() {
            return userService.getAllUsers()
                .then(function (data) {
                    vm.users = data;
                    return vm.users;
                });
        };

        vm.enableUser = function (profile) {
            vm.working = true;
            userService.enableUserAccount(profile)
                .success(function (response) {
                    vm.working = false;
                    vm.message = 'User Enabled';
                    getAllUsers();
                })
                .error(function (error) {
                    vm.working = false;
                    vm.message = 'Error Enabling User!';
                });
        };

        vm.disableUser = function(profile) {
            vm.working = true;
            userService.disableUserAccount(profile)
                .success(function(response) {
                    vm.working = false;
                    vm.message = 'User Disabled';
                    getAllUsers();
                })
                .error(function(error) {
                    vm.working = false;
                    vm.message = 'Error Disabling User!';
                });
        };

    };
})();
