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
        sinon.stub(accountService, 'updateCurrentUser').returns($q.when(true));
        controller = $controller('AccountController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Account controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of "Account"', function () {
                expect(controller.title).to.equal('User Account');
            });

            it('should have logged "Activated"', function () {
                expect($log.info.logs).to.match(/Activated/);
            });

            it('should have a user account', function () {
                expect(controller.currentUser).to.exist;
            });

        describe('user account properties', function () {
            it('should have a username', function () {
                expect(controller.currentUser.Username).to.not.be.empty;
            });

            it('should have a firstname', function () {
                expect(controller.currentUser.Firstname).to.not.be.empty;
            });

            it('should have a lastname', function () {
                expect(controller.currentUser.Lastname).to.not.be.empty;
            });

            it('should have a email', function () {
                expect(controller.currentUser.Email).to.not.be.empty;
            });

            it('should be able to be enabled', function () {
                expect(controller.currentUser.Enabled).to.exist;
            });

            it('should be authorizable', function () {
                expect(controller.currentUser.Authorized).to.exist;
            });

            it('should have at least one role', function () {
                expect(controller.currentUser.Roles).to.have.length.above(0);
            });

        });

        describe('after account is updated successfully', function () {
            it('should have a success message', function () {
                controller.update(controller.currentUser);
                $rootScope.$apply();
                expect(controller.message).to.equal('Account Updated');
            });
        });

        });
       
    });
});
