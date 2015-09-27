describe('PeopleController', function() {
    var controller;
    var people = mockData.getMockPeople();

    beforeEach(function() {
        bard.appModule('app.people');
        bard.inject("$controller", "$log", "$q", "$rootScope", "dataservice");
    });

    it("hello test", function() {
        expect("hello").to.equal("hello");
    });
})