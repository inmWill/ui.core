(function () {
    'use strict';

    angular
        .module('core.auth')
        .factory('authSession', authSession);

    authSession.$inject = ['localStorageService'];

    function authSession(localStorageService) {
        var service = {
            getUserData: getUserData,
            saveUserData: saveUserData,
            clearUserData: clearUserData
        };

        return service;

        function getUserData() {
            return localStorageService.get('userData');
        }

        function saveUserData(profile) {
            localStorageService.set('userData', { authorized: true, profile: profile });
        }

        function clearUserData() {
            localStorageService.remove('userData');
        }
    }
})();