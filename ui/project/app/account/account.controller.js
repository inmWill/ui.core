(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$q', '$state', 'dataservice', 'logger'];
    /* @ngInject */
    function AccountController($q, $state, dataservice, logger) {
        var vm = this;
        vm.account = {};


    }
})();
