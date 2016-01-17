/* jshint -W117, -W030 */
describe('WidgetController', function () {
    var controller;
    var widgets = mockData.getMockWidgets();  // fake widgets array

    beforeEach(function() {
        bard.appModule('app.widget');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'widgetService');
    });

    beforeEach(function () {
        sinon.stub(widgetService, 'getWidgets').returns($q.when(widgets));
        controller = $controller('WidgetController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Widget controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Widget', function() {
                expect(controller.title).to.equal('Widget');
            });

            it('should have logged "Activated"', function () {
                expect($log.info.logs).to.match(/Activated/);
            });

            it('should have at least 1 widget', function () {
                expect(controller.widgets).to.have.length.above(0);
            });

            it('should have widget count of 2', function () {
                expect(controller.widgets).to.have.length(2);
            });

        });

        describe('after clicking edit', function() {
            
        });
    });
});
