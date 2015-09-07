(function() {
    'use strict';

    angular
        .module('core.user')
        .directive('userProfile', userProfile);

    userProfile.$inject = ['$window'];
    
    function userProfile ($window) {
        // Usage:
        //     <userProfile></userProfile>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'App/User/Directives/userProfile.html',
            controller: 'userController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();