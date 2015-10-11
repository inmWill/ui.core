/* jshint -W079 */
var mockData = (function () {
    return {
        getMockPeople: getMockPeople,
        getMockStates: getMockStates,
        getMockToken: getMockToken,
        getMockUser: getMockUser
    };

    function getMockUser() {
        var mockUser = {
            UserId: 1,
            UserName: 'Admin',
            FirstName: 'Ellen',
            LastName: 'Ripley',
            Email: 'eripley@weylandYutani.com',
            IsAuthorized: true,
            Roles: ['Admin']
        }
        return mockUser;
    }


    function getMockToken() {
        var mockToken = {
            expires: 'Mon, 05 Oct 2015 00:49:08 GMT',
            issued: 'Mon, 05 Oct 2015 00:19:08 GMT',
            access_token: 'TOKENSTRING',
            as: { client_id: 'coreApp' },
            expires_in: 1799,
            refresh_token: 'd9282e16e3ad4946b8de98e8ef4cd8ab',
            token_type: 'bearer',
            username: 'Admin',
            roles: 'Admin',
            firstname: 'Ellen',
            lastname: 'Ripley'
        }
        return mockToken;
    }

    function getMockStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }

    function getMockPeople() {
        return [
            { id: 1, firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
            { id: 2, firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
            { id: 3, firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
            { id: 4, firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
            { id: 5, firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
            { id: 6, firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
            { id: 7, firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
        ];
    }
})();
