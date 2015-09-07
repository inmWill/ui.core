(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('navActiveAuditController',navActiveAuditController);

    navActiveAuditController.$inject = ['$location'];

    function navActiveAuditController($location) {
        var vm = this;
        vm.title = 'navActiveAuditController';
        vm.auditTitle = 'Demo Company Audit - (April 15, 2015 - July 31, 2015)';
        vm.showAlert = true;

    }
})();
