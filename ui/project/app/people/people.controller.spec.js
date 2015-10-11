/* jshint -W117, -W030 */
describe('PeopleController', function () {
    var controller;
    var people = mockData.getMockPeople();  // fake people array

    beforeEach(function() {
        bard.appModule('app.people');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'dataservice');
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getPeople').returns($q.when(people));
        controller = $controller('PeopleController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('People controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of People', function() {
                expect(controller.title).to.equal('People');
            });

            it('should have logged "Activated"', function () {
                expect($log.info.logs).to.match(/Activated/);
            });

            it('should have at least 1 person', function () {
                expect(controller.people).to.have.length.above(0);
            });

            it('should have people count of 7', function () {
                expect(controller.people).to.have.length(7);
            });

        });
    });
});
