(function () {
    'use strict';

    angular
        .module('core.client')
        .controller('clientController', clientController);

    clientController.$inject = ['clientService'];

    function clientController(clientService) {
        var client = this;
        client.allClients = [];
        client.currentPage = 1;
        client.pageSize = 10;
        activate();

        function activate() {
            return getClients().then(function () {

            });
        }

        function getClients() {
            return clientService.getAllClients()
                .then(function (data) {
                    client.allClients = data;
                    return client.allClients;
                });
        }
    }
})();
