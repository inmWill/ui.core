module.exports = function () {
    this.userName = element(by.model('vm.loginData.userName'));
    this.password = element(by.model('vm.loginData.password'));

    this.btnLogin = element(by.id('btnLogin'));

    this.setUserName = function (userName) {
        this.userName.sendKeys(userName);
    }

    this.setPassword = function (password) {
        this.password.sendKeys(password);
    }

    this.login = function () {
        this.btnLogin.click();
    }
}
