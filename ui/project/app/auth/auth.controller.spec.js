/* jshint -W117, -W030 */
describe('AuthController', function () {
    var controller;
    var token = mockData.getMockToken();

    beforeEach(function () {
        bard.appModule('app.auth');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'authService', 'localStorageService');
    });

    beforeEach(function () {
        sinon.stub(authService, 'login').returns($q.when(true));
    //    sinon.stub(authService, 'currentUser').returns($q.when(token))
        controller = $controller('AuthController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Auth controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have a username', function () {
                expect(controller.credentials.username).to.exist;
            });

            it('should have a password', function () {
                expect(controller.credentials.password).to.exist;
            });

            it('should have a result message', function () {
                expect(controller.result).to.exist;
            });
        });

        describe('after successful login to core.api', function () {

            // currently broken on the api
            it('should display a success message', function () {
                controller.credentials.username = 'test';
                controller.credentials.password = 'password';
                controller.login();
                $rootScope.$apply();
                expect(controller.result).to.equal('Login Successful!');
            });

            it('should have a currentUser', function () {
                expect(controller.currentUser).to.exist;
            });

            it('should have authorization info', function () {
                expect(controller.currentUser.authorized).to.equal(true);
                expect(controller.currentUser.username).to.equal('Admin');
                expect(controller.currentUser.roles).to.have.length.above(0);
            });

        });
    });

});