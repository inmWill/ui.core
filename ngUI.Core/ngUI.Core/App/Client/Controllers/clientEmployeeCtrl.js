(function () {
    'use strict';

    angular
        .module('core.client')
        .controller('clientEmployeeController', clientEmployeeController);

    clientEmployeeController.$inject = ['clientEmployeeService'];

    function clientEmployeeController(clientEmployeeService) {
        var clientEmployee = this;
        clientEmployee.allEmployees = [];
        clientEmployee.currentPage = 1;
        clientEmployee.pageSize = 50;     
        activate();

        function activate() {
            return getEmployees().then(function() {

            });
        }

        function getEmployees() {
            return clientEmployeeService.getAllClientEmployees()
                .then(function (data) {
                    clientEmployee.allEmployees = data;
                    return clientEmployee.allEmployees;
                });
        }
    }
})();
