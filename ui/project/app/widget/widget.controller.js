(function () {
    'use strict';

    angular
        .module('app.widget')
        .controller('WidgetController', WidgetController);

    WidgetController.$inject = ['$q', 'widgetService', 'logger'];
    /* @ngInject */
    function WidgetController($q, widgetService, logger) {
        var vm = this;
        vm.title = 'Widget';
        vm.widgets = [];

        activate();

        function activate() {
            var promises = [getWidgets()];
            return $q.all(promises).then(function () {
                logger.info('Activated Widget View.');
            });
        }

        function getWidgets() {
            widgetService.getWidgets()
                .then(function(widget) {
                    vm.widgets = widget;
                    logger.success('Got Widgets.');
                });
        }

    }
})();
