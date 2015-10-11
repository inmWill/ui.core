(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize',
            'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.token',
            'ui.router', 'ui.bootstrap', 'angular-loading-bar'
        ]);
})();
