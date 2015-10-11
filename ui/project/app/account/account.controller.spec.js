/* jshint -W117, -W030 */
describe('AccountController', function() {
    var controller;
    var mockUser = mockData.getMockUser();

    beforeEach(function() {
        bard.appModule('app.account');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'accountService');
    });

    beforeEach(function () {
        sinon.stub(accountService, 'getCurrentUser').returns($q.when(mockUser));
        controller = $controller('AccountController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Account controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('user account properties', function () {
            it('should have a valid userid', function () {
                expect(controller.currentUser.UserId).to.be.above(0);
            });

            it('should have a username', function () {
                expect(controller.currentUser.UserName).to.not.be.empty;
            });

            it('should have a firstname', function () {
                expect(controller.currentUser.FirstName).to.not.be.empty;
            });

            it('should have a lastname', function () {
                expect(controller.currentUser.LastName).to.not.be.empty;
            });

            it('should have a email', function () {
                expect(controller.currentUser.Email).to.not.be.empty;
            });

            it('should have a isAuthorized', function () {
                expect(controller.currentUser.IsAuthorized).to.exist;
            });

            it('should have at least one role', function () {
                expect(controller.currentUser.Roles).to.have.length.above(0);
            });

        });

        describe('after activate', function() {
            it('should have title of "Account"', function() {
                expect(controller.title).to.equal('User Account');
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });

            it('should have a user account', function () {
                expect(controller.currentUser).to.exist;
            });

            it('should have a mock user', function () {
                expect(controller.currentUser.FirstName).to.equal('Ellen');
            });

            //it()

        });
       
    });
});
