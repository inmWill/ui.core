/* global toastr:false, moment:false */
(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('APP_CONFIG', {
            clientId: 'coreApp',
            serviceURIBase: 'http://localhost:51517/',
    //      serviceURIBase: 'http://apicore.azurewebsites.net/',
            isRegistered: true
 
        });
})();
