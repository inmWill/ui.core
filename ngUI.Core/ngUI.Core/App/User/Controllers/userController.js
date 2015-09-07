(function () {
    'use strict';

    angular
        .module('core.user')
        .controller('userController', userController);

    userController.$inject = ['$location', 'userService', '$scope', 'authSession', 'AUTH_EVENTS', '$filter', '$rootScope'];

    function userController($location, userService, $scope, authSession, AUTH_EVENTS, $filter, $rootScope) {
        /* jshint validthis:true */
        var vm = this;
        vm.message = '';
        vm.title = 'User Controller';
        activate();
        function activate() {
            userService.getActiveUser().then(function (profile) {
                authSession.saveUserData(profile);
                var spouse = $filter('filter')(profile.ClientEmployee.Dependents, { Spouse: "true" })[0];

                vm.profile = {
                    FirstName: profile.ClientEmployee.FirstName,
                    LastName: profile.ClientEmployee.LastName,
                    CompanyEmail: profile.ClientEmployee.CompanyEmail,
                    PreferredEmail: profile.ClientEmployee.PreferredEmail,
                    SSN: profile.ClientEmployee.LastSSN,
                    Street: profile.ClientEmployee.Street,
                    Unit: profile.ClientEmployee.Unit,
                    City: profile.ClientEmployee.City,
                    Region: profile.ClientEmployee.Region,
                    Postal: profile.ClientEmployee.Postal,
                    Country: profile.ClientEmployee.Country,
                    DateOfBirth: profile.ClientEmployee.DateOfBirth,
                    HomePhone: profile.ClientEmployee.HomePhone,
                    WorkPhone: profile.ClientEmployee.WorkPhone,
                    CellPhone: profile.ClientEmployee.CellPhone,
                    HipaaAuthorizationGiven: profile.ClientEmployee.HipaaAuthorizationGiven,
                    SpouseFirstName: spouse.FirstName,
                    SpouseLastName: spouse.LastName,
                    SpouseDateOfBirth: spouse.DateOfBirth,
                    SpouseCellPhone: spouse.CellPhone,
                    SpouseHomePhone: spouse.HomePhone,
                    SpouseWorkPhone: spouse.WorkPhone,
                    SpouseSSN: spouse.LastSSN
                };

                $scope.$emit(AUTH_EVENTS.profileChanged);

            });
        };

        

        vm.update = function(profile) {
            vm.working = true;
            userService.updateActiveUserProfile(profile)
                .success(function(response) {
                    vm.working = false;
                    vm.savedSuccessfully = true;
                    vm.message = 'Profile updated!';
                    //toastr.success('Profile Changes Saved!');
                    userService.getActiveUser().then(function(profile) {
                        authSession.saveUserData(profile);
                        $scope.$emit(AUTH_EVENTS.profileChanged);
                    });
                })
                .error(function(error) {
                    vm.working = false;
                    vm.savedSuccessfully = false;
                    vm.message = 'Error Updating Profile!';
                    //toastr.error('Error Updating Profile!');
                });
        };

        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };

        vm.opensp = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.openedsp = true;
        };
    }
})();
