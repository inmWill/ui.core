describe('OCV Authentication', function () {
    it('should login a user', function () {
        browser.get('/Index.html#/login');

        element(by.model('vm.loginData.userName')).sendKeys('Admin');
        element(by.model('vm.loginData.password')).sendKeys('R%^YGVFT');
        element(by.id('btnLogin')).click();


        browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toMatch("/auditdashboard");
    });

    it('should logout a user', function () {
        browser.get('/Index.html#/home');

        element(by.id('lnkUserActions')).click();       
        element(by.id('lnkLogout')).click();


        browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toMatch("/login");
    });
});