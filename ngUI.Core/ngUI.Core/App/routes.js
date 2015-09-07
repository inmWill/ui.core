(function () {
    'use strict';

    /**
     * Route configuration for Core ngUI.
     * TODO: Research authorized routes in ui.router
     */

    angular.module('coreApp').config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // For unmatched routes
            $urlRouterProvider.otherwise('/login');

            // Application routes
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'Views/Login.html',
                    controller: 'authModalController as authModal'
                })
               .state('signup', {
                   url: '/signup',
                   templateUrl: 'Views/Signup.html'
               })
                .state('survey', {
                    url: '/survey/:questionId',
                    templateUrl: 'Views/Survey.html',
                    controller: 'surveyController as vm'
                })
                .state('employees', {
                    url: '/employees',
                    templateUrl: 'Views/Employees.html',
                    controller: 'clientEmployeeController as clientEmployee'
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'Views/Profile.html'
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'Views/Settings.html'
                })
                .state('useraccountadmin', {
                    url: '/clients',
                    templateUrl: 'Views/useraccountadmin.html',
                    controller: 'userAdminController as vm'
                })
                .state('restricted', {
                    url: '/restricted',
                    templateUrl: 'Views/Restricted.html'
                })
                .state('home', {
                url: '/home',
                templateUrl: 'Views/Home.html'
            })
        }
    ]);
})();