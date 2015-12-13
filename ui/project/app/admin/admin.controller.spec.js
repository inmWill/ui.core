/* jshint -W117, -W030 */
describe('AdminController', function() {
    var controller;
    var token = mockData.getMockToken();

    beforeEach(function() {
        bard.appModule('app.admin');
        bard.inject('$controller', '$q', '$log', '$rootScope', 'authService');
    });

    beforeEach(function () {
        sinon.stub(authService, 'currentUser').returns(token);
        controller = $controller('AdminController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Admin controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Admin', function() {
                expect(controller.title).to.equal('Admin');
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });
        });
    });
});
