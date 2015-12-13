(function() {
    'use strict';

    angular
        .module('app.account')
        .directive('currentUser', currentUser);

    currentUser.$inject = ['$window'];
    
    function currentUser() {
        // Usage:
        //     <auth></auth>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/account/current-user.html',
            controller: 'CurrentUserController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();