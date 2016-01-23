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
        vm.lastCreated = {};

        activate();

        function activate() {
            var promises = [getWidgets()];
            return $q.all(promises).then(function () {
                logger.info('Activated Widget View');
            });
        }

        function getWidgets() {
            widgetService.get()
                .then(function (widget) {
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

        vm.toggleEdit = function () {
            if (vm.editMode) {
                vm.editMode = false;
                vm.editLabel = 'Edit Widgets';
            } else {
                vm.editMode = true;
                vm.editLabel = 'Cancel Edit';
            }
        };

        vm.updateWidget = function (widget) {
            widgetService.put(widget)
                .then(function (result) {
                    if (result) {
                        logger.success('Widget Updated');
                    } else {
                        logger.error('Error Updating Widget');
                    }
                });
        };

        vm.createWidget = function (widget) {
            widgetService.post(widget)
                .then(function (result) {
                    vm.lastCreated = result;
                    vm.widgets.push(result);
                    logger.success('Widget Created');
                });
        };

        vm.deleteWidget = function (widget) {
            widgetService.del(widget)
                .then(function (result) {
                    if (result === 1) {                       
                        var i = vm.widgets.indexOf(widget);
                        if (i !== -1) {
                            vm.widgets.splice(i, 1);
                            logger.warning('Widget Deleted');
                        }
                    } else {
                        logger.error('Error Deleting Widget');
                    }
                });
        }

        vm.refresh = function () {
            activate();
        };
    }
})();
