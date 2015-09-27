var LoginPage = require('./../pagemodels/ocv-auth-login.page.js')

describe('OCV User', function () {

    beforeEach(function () {
        browser.get('/Index.html#/login');

        var loginPage = new LoginPage();

        loginPage.setUserName('Admin');
        loginPage.setPassword('R%^YGVFT');
        loginPage.login();

        browser.waitForAngular();
    });

    afterEach(function () {
        element(by.id('lnkUserActions')).click();
        element(by.id('lnkLogout')).click();


        browser.waitForAngular();
    });

    it('should allow a user to access their profile', function () {

        element(by.id('lnkUserActions')).click();
        element(by.linkText('Profile')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/profile");
        
        var header = element(by.id('pageHeader')).getText();

        expect(header.getText()).toEqual('My Profile');

    });

    it('should populate the users profile', function () {
        element(by.id('lnkUserActions')).click();
        element(by.linkText('Profile')).click();

        browser.waitForAngular();

        var firstName = element(by.model('vm.profile.FirstName')).getAttribute('value');

        expect(firstName).toEqual('Admin');

        var lastName = element(by.model('vm.profile.LastName')).getAttribute('value');

        expect(lastName).toEqual('Account');

        var ssn = element(by.model('vm.profile.SSN')).getAttribute('value');

        expect(ssn).toEqual('1234');

        var dob = element(by.model('vm.profile.DateOfBirth')).getAttribute('value');

        expect(dob).toEqual('12-01-1979');

    });

    it('should allow the user to change certain fields', function () {
        element(by.id('lnkUserActions')).click();
        element(by.linkText('Profile')).click();

        browser.waitForAngular();
        element(by.model('vm.profile.PreferredEmail')).clear();
        element(by.model('vm.profile.PreferredEmail')).sendKeys('admin@company.com');

        element(by.id('btnSearch')).click();

        var success = element(by.id('statusAlert')).getText();

        expect(success.getText()).toEqual('Profile updated!');
    });


});