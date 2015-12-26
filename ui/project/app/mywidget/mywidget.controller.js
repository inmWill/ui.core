(function () {
    'use strict';

    angular
        .module('app.mywidget')
        .controller('MywidgetController', MywidgetController);

    MywidgetController.$inject = ['$q', 'widgetService', 'logger'];
    /* @ngInject */
    function MywidgetController($q, widgetService, logger) {
        var vm = this;
        vm.title = 'My Widget';
        vm.mywidgets = [];

        activate();

        function activate() {
            var promises = [getWidgets()];
            return $q.all(promises).then(function () {
                logger.info('Activated My Widget View.');
            });
        }

        function getWidgets() {
            widgetService.getWidgets()
                .then(function(widget) {
                    vm.mywidgets = widget;
                    logger.success('Got My Widgets.');
                });
        }

    }
})();
