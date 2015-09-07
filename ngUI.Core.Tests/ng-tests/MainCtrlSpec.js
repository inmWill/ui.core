/// <reference path="f:\projects\core\ngui.core\ngui.core.tests\scripts\_references.js" />

describe('app controllers', function () {

    beforeEach(module('coreApp'));


    describe('ClientCtrl', function () {

        var scope;
        it('should have scope defined', inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
           
            $controller('ClientCtrl', { $scope: scope });
            expect(scope).toBeDefined();
        }));
    });
});