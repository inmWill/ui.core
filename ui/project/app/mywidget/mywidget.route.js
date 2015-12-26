(function() {
    'use strict';

    angular
        .module('app.mywidget')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'mywidget',
                config: {
                    url: '/mywidget',
                    templateUrl: 'app/mywidget/mywidget.html',
                    controller: 'MywidgetController',
                    controllerAs: 'vm',
                    title: 'my widget',
                    settings: {
                        requireAuth: false,
                        nav: 4,
                        content: '<i class="fa fa-gear"></i> My Widget'
                    }
                }
            }
        ];
    }
})();
