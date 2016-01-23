/* jshint -W079 */
var mockData = (function () {
    return {
        getMockPeople: getMockPeople,
        getMockStates: getMockStates,
        getMockToken: getMockToken,
        getMockUser: getMockUser,
        getMockWidgets: getMockWidgets,
        getCreatedWidget: getCreatedWidget,
        getNewWidgetInputModel: getNewWidgetInputModel
    };

    function getMockUser() {
        var mockUser = {
            Username: 'Admin',
            Password: '',
            Firstname: 'firstname',
            Lastname: 'lastname',
            Email: 'email',
            Enabled: true,
            Authorized: true,
            Roles: ['Admin'],
            
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
            lastname: 'Ripley',
            authorized: true
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

    function getMockWidgets() {
        return [
            { Id: 1, Name: 'My First Widget', Description: 'A test widget', Manufacturer: 'Inmerge', ModifiedById: 1, CreatedOn: '2016-01-16', ModifiedOn: '2016-01-17', IpAddress: '192.0.0.1' },
            { Id: 2, Name: 'My Second Widget', Description: 'A test widget', Manufacturer: 'Woodsilks', ModifiedById: 1, CreatedOn: '2016-01-16', ModifiedOn: '2016-01-17', IpAddress: '192.0.0.1' }
        ];
    }

    function getCreatedWidget() {
        return {
            Id: 3,
            Name: 'My Third Widget',
            Description: 'A new test widget',
            Manufacturer: 'Radix',
            ModifiedById: 1,
            CreatedOn: '2016-01-21',
            ModifiedOn: '2016-01-21',
            IpAddress: '192.0.0.1'
        };
    }

    function getNewWidgetInputModel() {
        return {
            Name: 'My Third Widget',
            Description: 'A new test widget',
            Manufacturer: 'Radix'
        };
    }
    

})();
