describe("authController", function () {

    var $controllerConstructor;
    var $scope;
    var service;
    var ctrl;
    var $q;

    var mockAuthService = {
        registerUser: function () { return true }
    }

    beforeEach(module('coreApp'));

    beforeEach(function () {
        module('coreApp');
        module({
            authService: mockAuthService
        });
    });


    beforeEach(inject(function ($controller, $rootScope, _authService_, _$q_) {
        $controllerConstructor = $controller;
        $scope = $rootScope.$new();
        mockAuthService = _authService_;
        $q = _$q_;
        ctrl = $controllerConstructor('authController', { '$scope': $scope, 'authService': mockAuthService });
    }));

    it("should have a registration object", function () {
        expect(ctrl.registration).not.toBeUndefined();
        expect(ctrl.registration.Email).not.toBeUndefined();
        expect(ctrl.registration.Password).not.toBeUndefined();
    });

    it("should have an auth service object", function () {
        expect(ctrl.authService).not.toBeUndefined();
    });

});