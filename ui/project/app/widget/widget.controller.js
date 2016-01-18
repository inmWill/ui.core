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
        vm.editMode = false;
        vm.editLabel = 'Edit Widgets';

        activate();

        function activate() {
            var promises = [getWidgets()];
            return $q.all(promises).then(function () {
                logger.info('Activated Widget View');
            });
        }

        function getWidgets() {
            widgetService.getWidgets()
                .then(function(widget) {
                    vm.widgets = widget;
                    logger.success('Got Widgets');
                });
        }

        vm.getbymanufacturer = function (manufacturer) {
            widgetService.getWidgetsByManufacturer(manufacturer)
                .then(function (widget) {
                    vm.widgets = widget;
                    logger.success('Got Manufacturer Widgets');
                });
        };

        vm.toggleEdit = function() {
            if (vm.editMode) {
                vm.editMode = false;
                vm.editLabel = 'Edit Widgets';
            } else {
                vm.editMode = true;
                vm.editLabel = 'Cancel Edit';
            }
        };

        vm.updateWidget = function(widget) {
            widgetService.updateWidget(widget)
                .then(function (result) {
                    logger.success('Widget Updated');
                });
        };

        vm.refresh = function() {
            activate();
        };
    }
})();
