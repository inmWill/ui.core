(function() {
    'use strict';

    angular
        .module('app.people')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'people',
                config: {
                    url: '/people',
                    templateUrl: 'app/people/people.html',
                    controller: 'PeopleController',
                    controllerAs: 'vm',
                    title: 'people',
                    settings: {
                        requireAuth: false,
                        nav: 3,
                        content: '<i class="fa fa-user"></i> People'
                    }
                }
            },
            {
                state: 'person',
                config: {
                    url: '/person/:id',
                    template: '<div>person view</div>',
                    // controller: 'PersonController',
                    // controllerAs: 'vm',
                    title:'person'
                }
            }
        ];
    }
})();
