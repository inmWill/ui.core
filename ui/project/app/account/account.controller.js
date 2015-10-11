(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$q', '$state', 'accountService', 'logger'];
    /* @ngInject */
    function AccountController($q, $state, accountService, logger) {
        var vm = this;
        vm.account = {};

        vm.title = 'User Account';
        vm.currentUser = {
            UserId: 0,
            UserName: '',
            FirstName: '',
            LastName: '',
            Email: '',
            IsAuthorized: false,
            Roles: ['']
        };

        activate();

        function activate() {
            var promises = [getCurrentUser()];
            return $q.all(promises).then(function () {
                logger.info('Activated Account View');
            });
            
        }

        function getCurrentUser() {
            accountService.getCurrentUser()
                .then(function(account){
                    vm.currentUser = account;
                    logger.success('Got the user account');
                });
        }
    }
})();
