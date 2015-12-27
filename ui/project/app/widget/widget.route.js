(function() {
    'use strict';

    angular
        .module('app.widget')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'widget',
                config: {
                    url: '/widget',
                    templateUrl: 'app/widget/widget.html',
                    controller: 'WidgetController',
                    controllerAs: 'vm',
                    title: 'widget',
                    settings: {
                        requireAuth: false,
                        nav: 4,
                        content: '<i class="fa fa-gear"></i> Widget'
                    }
                }
            }
        ];
    }
})();
