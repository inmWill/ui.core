(function () {
    'use strict';

    angular
        .module('core.user')
        .controller('userActionsController', userActionsController);

    function userActionsController() {
        var vm = this;
        vm.title = 'userActionsController';

    }
})();
