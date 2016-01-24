describe('Dashboard', function() {
    beforeEach(function() {
        browser.get('/');
        browser.waitForAngular();
    });

    it('should have a title of Dashboard', function() {
        expect(browser.getTitle()).toEqual('ui.core: dashboard');
    });

});