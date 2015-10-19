(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize',
            'blocks.exception', 'blocks.logger', 'blocks.router', 'LocalStorageModule',
            'ui.router', 'ui.bootstrap', 'angular-loading-bar', 'satellizer'
        ]);
})();
