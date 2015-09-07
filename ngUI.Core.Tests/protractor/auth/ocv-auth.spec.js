var LoginPage = require('./../pagemodels/ocv-auth-login.page.js')

describe('OCV Authentication', function () {
    it('should login a user', function () {
        browser.get('/Index.html#/login');

        var loginPage = new LoginPage();

        loginPage.setUserName('Admin');
        loginPage.setPassword('R%^YGVFT');
        loginPage.login();

        //element(by.model('vm.loginData.userName')).sendKeys('Admin');
        //element(by.model('vm.loginData.password')).sendKeys('R%^YGVFT');
        //element(by.id('btnLogin')).click();


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