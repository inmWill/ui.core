(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authModalController', authModalController);

    authModalController.$inject = ['$modal'];

    function authModalController($modal) {
        var vmAuthModal = this;

        vmAuthModal.open = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'app/auth/templates/authModal.html',
                controller: 'authLoginController'
            });
        };

    }
})();
