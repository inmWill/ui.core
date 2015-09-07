(function () {
    'use strict';

    angular
        .module('core.filters')
        .filter('parseTokens', parseTokens);

    function parseTokens() {
        return function(item, user) {
            var userFullname = user.FirstName + " " + user.LastName;
            var userSpouseFullName = user.spouse.FirstName + " " + user.spouse.LastName;
            var parsedItem = "";
            if (item != null) {
                parsedItem = item.replace(/ACTIVEUSER/g, userFullname);
                parsedItem = parsedItem.replace(/USERSPOUSE/g, userSpouseFullName);
                parsedItem = parsedItem.replace(/DEPENDENTTYPE/g, user.spouse.DependentType);
            }
            return parsedItem;
        };
    }
})();