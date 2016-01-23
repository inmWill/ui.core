/* jshint -W117, -W030 */
describe('WidgetController', function () {
    var controller;
    var widgets = mockData.getMockWidgets();  // fake widgets array
    var initialWidgetCount = widgets.length;
    var newWidgetInputModel = mockData.getNewWidgetInputModel();
    var createdWidget = mockData.getCreatedWidget();

    beforeEach(function() {
        bard.appModule('app.widget');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'widgetService');
    });

    beforeEach(function () {
        sinon.stub(widgetService, 'get').returns($q.when(widgets));
        controller = $controller('WidgetController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Widget controller', function () {

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

            it('should not be in edit mode', function() {
                expect(controller.editMode).to.equal(false);
                expect(controller.editLabel).to.equal('Edit Widgets');
            });

            it('should not have a last created widget', function () {
                expect(controller.lastCreated).to.be.empty;
            });
        });

        describe('after clicking edit', function () {
            beforeEach(function () {
                controller.toggleEdit();
                $rootScope.$apply();
            });

            it('should be in edit mode', function() {
                expect(controller.editMode).to.equal(true);
                expect(controller.editLabel).to.equal('Cancel Edit');
            });

            it('should exit edit mode if toggle edit is clicked again.', function() {
                controller.toggleEdit();
                $rootScope.$apply();
                expect(controller.editMode).to.equal(false);
                expect(controller.editLabel).to.equal('Edit Widgets');
            });
        });

        describe('after successfully updating widget', function() {
            beforeEach(function () {
                sinon.stub(widgetService, 'put').returns($q.when(true));
                controller.toggleEdit();
                controller.updateWidget(widgets[0]);
                $rootScope.$apply();
            });

            it('should have logged "Widget Updated"', function () {
                expect($log.info.logs).to.match(/Widget Updated/);
            });

        });

        describe('after successfully adding a new widget', function () {
            beforeEach(function () {
                sinon.stub(widgetService, 'post').returns($q.when(createdWidget));
                controller.toggleEdit();
                controller.createWidget(newWidgetInputModel);
                initialWidgetCount = widgets.length;
                $rootScope.$apply();
            });

            it('should have logged "Widget Created"', function () {
                expect($log.info.logs).to.match(/Widget Created/);
            });

            it('should have a last created widget', function () {
                expect(controller.lastCreated).equal(createdWidget);
            });

            it('should add an item to the widgets array', function() {
                expect(controller.widgets.length).above(initialWidgetCount);
            });
        });

        describe('after successfully deleting a widget', function () {
            beforeEach(function () {
                sinon.stub(widgetService, 'del').returns($q.when(1));
                controller.toggleEdit();
                controller.deleteWidget(controller.widgets[1]);
                $rootScope.$apply();
            });

            it('should have logged a warning "Widget Deleted"', function () {
                expect($log.warn.logs).to.match(/Widget Deleted/);
            });

            it('should remove the item from the widgets array', function () {
                expect(controller.widgets.length).below(initialWidgetCount);
            });


        });

    });
});
