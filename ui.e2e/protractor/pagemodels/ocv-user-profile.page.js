module.exports = function () {
    //page elements 
    this.firstName = element(by.model('vm.profile.FirstName'));
    this.lastName = element(by.model('vm.profile.LastName'));
    this.SSN = element(by.model('vm.profile.SSN'));
    this.dateOfBirth = element(by.model('vm.profile.DateOfBirth'));
    this.companyEmail = element(by.model('vm.profile.CompanyEmail'));
    this.preferredEmail = element(by.model('vm.profile.PreferredEmail'));
   
    //setters
    this.setFirstName = function (firstName) {
        this.firstName.sendKeys(firstName);
    }

    this.setLastName = function (lastName) {
        this.lastName.sendKeys(lastName);
    }

    this.setSSN = function (ssn) {
        this.SSN.sendKeys(ssn);
    }


    this.setDateOfBirth = function (dob) {
        this.dateOfBirth.sendKeys(dob);
    }

    this.setCompanyEmail = function (companyEmail) {
        this.companyEmail.sendKeys(companyEmail);
    }

    this.setPreferredEmail = function (preferredEmail) {
        this.preferredEmail.sendKeys(preferredEmail);
    }



    //getters
    this.getFirstName = function () {
        return this.firstName.getText();
    }

    this.getLastName = function () {
        return this.lastName.getText();
    }

    this.getSSN = function () {
        return this.SSN.getText();
    }
    
    this.getDateOfBirth = function () {
        return this.dateOfBirth.getText();
    }

    this.getCompanyEmail = function () {
        return this.companyEmail.getText();
    }

    this.getPreferredEmail = function () {
        return this.preferredEmail.getText();
    }
}
