(function() {
    'use strict';

    angular
        .module('app.auth')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'app/auth/login.html',
                    controller: 'AuthController',
                    controllerAs: 'vm',
                    title: 'Auth',
                    settings: {
                        requireAuth: false
                    }
                }
            }
        ];
    }
})();
