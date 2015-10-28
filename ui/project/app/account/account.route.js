(function() {
    'use strict';

    angular
        .module('app.account')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'account',
                config: {
                    url: '/account',
                    templateUrl: 'app/account/account.html',
                    controller: 'AccountController',
                    controllerAs: 'vm',
                    title: 'account',
                    settings: {
                        requireAuth: true
                    }
                }
            }
        ];
    }
})();
