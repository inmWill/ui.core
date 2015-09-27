/// <reference path="f:\projects\core\ui.core\ngui.core.tests\working\auth\auth.js" />
/// <reference path="f:\projects\core\ui.core\ngui.core.tests\working\auth\authitem.js" />




describe("Authentication Objects", function () {

    var authItem, auth;

    beforeEach(function() {
        authItem = new AuthItem("username");
        auth = new Auth(authItem);
    });

    it("should be of type Authentication", function () {
        expect(auth.authItem).toBe(authItem);
    });

    it("should have a username", function() {
        expect(auth.authItem.username).toEqual("username");
    });

});


