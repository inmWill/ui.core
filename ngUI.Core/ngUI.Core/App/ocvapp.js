///#source 1 1 /App/core.root.module.js
(function () {
    'use strict';
    angular.module('coreApp', [
        'core',
        'core.auth',
        'core.client',
        'core.survey',
        'core.user',
        'core.filters'
    ]);
})();
///#source 1 1 /App/Core/core.module.js
(function () {
    'use strict';

    angular.module('core', [
        // Angular modules 
        'ngAnimate',
        'ngCookies',
        'ngSanitize',

        // 3rd Party Modules
        'ui.bootstrap',
        'ui.router',
        'LocalStorageModule',
        'angular-loading-bar',
        'angularCharts',
        'angularUtils.directives.dirPagination',
        'validation.match'
        
    ]);
})();
///#source 1 1 /App/Core/constants.js
(function () {
    'use strict';

    /**
     * Core user roles and events for core.auth.
     */

    angular.module('core').constant('USER_ROLES', {
        all: '*',
        admin: 'Admin',
        registered: 'registered',
        host: 'host'
    }).constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated', 
        notAuthorized: 'auth-not-authorized',
        profileChanged: 'auth-profile-changed'
    }).constant('AUTH_CONFIG', {
        authClientId: 'coreApp',
     //   authClientId: 'coreAzureApp',
     authURIBase: 'http://localhost:51517/'
    //     authURIBase: 'http://sandcastle01:8881/'
    }).constant('APP_CONFIG', {
     serviceURIBase: 'http://localhost:51517/'
    //     serviceURIBase: 'http://sandcastle01:8881/'
    });
})();
///#source 1 1 /App/Auth/core.auth.module.js
(function () {
    'use strict';

    angular.module('core.auth', []);
})();
///#source 1 1 /App/Auth/Services/authInterceptorService.js
(function () {
    'use strict';
    angular
        .module('core.auth')
        .factory('authInterceptorService', authInterceptorService);

    authInterceptorService.$inject = ['$q', '$injector', '$location', 'localStorageService', 'AUTH_EVENTS', '$rootScope', 'cfpLoadingBar'];

    function authInterceptorService($q, $injector, $location, localStorageService, AUTH_EVENTS, $rootScope, cfpLoadingBar) {

        var factory = {
            request: request,
            responseError: responseError
        };

        return factory;

        function request(config) {
            config.headers = config.headers || {};
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
            return config;
        };

        function responseError(rejection) {
            var deferred = $q.defer();
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                authService.refreshToken().then(function (response) {
                    retryHttpRequest(rejection.config, deferred);
                },
                function () {
                    localStorageService.remove('authorizationData');
                    localStorageService.remove('userData');
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                    $location.path('/login');
                    cfpLoadingBar.complete();
                });
            }
            else if (rejection.status === 403) {
                deferred.reject(rejection);
                $location.path('/restricted');
                cfpLoadingBar.complete();
            }
            else {
                deferred.reject(rejection);
                cfpLoadingBar.complete();
            }
            return deferred.promise;
        };

        function retryHttpRequest(config, deferred) {
            var $http;
            $http = $injector.get('$http');
            $http(config).then(function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            });
        };


    }
})();
///#source 1 1 /App/Auth/Services/authService.js
(function () {
    'use strict';
    angular
        .module('core.auth')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'localStorageService', 'authSession', 'USER_ROLES', 'AUTH_CONFIG', 'userService'];

    function authService($http, $q, localStorageService, authSession, USER_ROLES, AUTH_CONFIG, userService) {

        var serviceBase = AUTH_CONFIG.authURIBase;
        var useRefreshTokens = true;

        var authentication = {
            isAuth: false,
            userName: ""
        };

        var factory = {
            registerUser: registerUser,
            login: login,
            logOut: logOut,
            fillAuthData: fillAuthData,
            authentication: authentication,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getUserData: getUserData,
            refreshActiveUserData: refreshActiveUserData,
            refreshToken: refreshToken,
            checkUsername: checkUsername
        };

        return factory;

        function checkUsername(username) {
            return $http.get(serviceBase + 'api/Account/CheckUsernameAvailability?username='+ username);
        }

        function isAuthenticated() {
            return authSession.isAuth;
        };

        function refreshActiveUserData() {
            userService.getActiveUser().then(function (profile) {
                authSession.saveUserData(profile);
                return authSession.getUserData();
            });
        }


        function getUserData() {

            return authSession.getUserData();
        }


        function isAuthorized(profile, authorizedRoles) {
            if (profile != null) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                for (var i = 0; i < authorizedRoles.length; i++) {
                    if (profile.UserRoles.indexOf(authorizedRoles[i]) !== -1) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        };

        function registerUser(registration) {

            logOut();

            return $http.post(serviceBase + 'api/account/RegisterClientEmployee', registration).then(function (response) {
                return response;
            });

        };

        function login(loginData) {

            var cleanPassword = encodeURIComponent(loginData.password);

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + cleanPassword;

            if (useRefreshTokens) {
                data = data + "&client_id=" + AUTH_CONFIG.authClientId;
            }

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, refreshToken: response.refresh_token, userName: loginData.userName, roles: response.userRoles });

          //      authSession.saveUserData(loginData.userName, response.userRoles);

                authentication.isAuth = true;
                authentication.userName = loginData.userName;
                authentication.role = response.userRoles;
                deferred.resolve(response);

            }).error(function (err) {
                logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        function logOut() {

            localStorageService.remove('authorizationData');
            authSession.clearUserData();
            authentication.isAuth = false;
            authentication.userName = "";
        };

        function refreshToken() {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + AUTH_CONFIG.authClientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token });

                    deferred.resolve(response);

                }).error(function (err) {
                    logOut();
                    deferred.reject(err);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        };

        function fillAuthData() {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                authentication.isAuth = true;
                authentication.userName = authData.userName;
                authentication.roleId = authData.roleId;
            }

        };


    }

})();
///#source 1 1 /App/Auth/Services/authSession.js
(function () {
    'use strict';

    angular
        .module('core.auth')
        .factory('authSession', authSession);

    authSession.$inject = ['localStorageService'];

    function authSession(localStorageService) {
        var service = {
            getUserData: getUserData,
            saveUserData: saveUserData,
            clearUserData: clearUserData
        };

        return service;

        function getUserData() {
            return localStorageService.get('userData');
        }

        function saveUserData(profile) {
            localStorageService.set('userData', { authorized: true, profile: profile });
        }

        function clearUserData() {
            localStorageService.remove('userData');
        }
    }
})();
///#source 1 1 /App/Auth/Controllers/authModalCtrl.js
(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authModalController', authModalController);

    authModalController.$inject = ['$modal'];

    function authModalController($modal) {
        var vmAuthModal = this;

        vmAuthModal.open = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'app/auth/templates/authModal.html',
                controller: 'authLoginController'
            });
        };

    }
})();

///#source 1 1 /App/Auth/Controllers/authLoginCtrl.js
(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authLoginController', authLoginController);

    authLoginController.$inject = ['$scope', '$rootScope', '$location', 'authService', 'AUTH_EVENTS', 'userService', 'authSession'];

    function authLoginController($scope, $rootScope, $location, authService, AUTH_EVENTS, userService, authSession) {
        var vm = this;
        vm.title = 'authLoginController';
        vm.loginData = {
            userName: "",
            password: ""
        };
        vm.message = "";

        vm.login = function () {

            authService.login(vm.loginData).then(function (user) {
                userService.getActiveUser().then(function (profile) {
                    authSession.saveUserData(profile);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $location.path('/auditdashboard');
                });
                
                
            },
                function (err) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    vm.message = err.error_description;
                });
        };

        vm.logOut = function () {
            authService.logOut();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $location.path('/login');
        };

    }
})();

///#source 1 1 /App/Auth/Controllers/authSignupCtrl.js
(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authSignupController',authSignupController);

    authSignupController.$inject = ['$location', '$timeout', 'authService'];

    function authSignupController($location, $timeout, authService) {
        var vm = this;
        vm.title = 'authSignup';

        vm.success = false;
        vm.message = "";

        //vm.registration = {
        //    Email: "",
        //    SSN: "",
        //    confirmPassword: "",
        //    DateOfBirth: "",
        //    LastName: "",
        //    Password: "",
        //};

        vm.registration = {
            Username: "",
            Email: "",
            SSN: "",
            confirmPassword: "",
            DateOfBirth: "",
            LastName: "",
            Password: "",
        };

        vm.register = function () {

            authService.registerUser(vm.registration).then(function (response) {

                vm.success = true;
                vm.message = "Your account has been registered successfully, you will be redirected to the login page in 2 seconds.";
                redirectToLogin();

            },
                function (response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    vm.message = "Failed to register user due to:" + errors.join(' ');
                });
        };

        var redirectToLogin = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/login');
            }, 2000);
        };

        vm.checkUsername = function (username) {
            vm.searchingUsername = true;
            vm.usernameExists = false;
            authService.checkUsername(username).success(function (response) {
                vm.searchingUsername = false;
            })
            .error(function (error) {
                vm.usernameExists = true;
                vm.searchingUsername = false;
            });
        }

        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };

    }
})();

///#source 1 1 /App/Auth/Controllers/authActiveUserCtrl.js
(function () {
    'use strict';

    angular
        .module('core.auth')
        .controller('authActiveUserController', authActiveUserController);

    authActiveUserController.$inject = ['$scope', 'USER_ROLES', 'AUTH_EVENTS', 'authService', 'userService'];

    function authActiveUserController($scope, USER_ROLES, AUTH_EVENTS, authService, userService) {
        $scope.title = 'authActiveUserController';
        $scope.currentUser = null;
        $scope.activeUserProfile = null;
        $scope.userData = authService.getUserData();

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
            userService.getActiveUser().then(function (profile) {
                $scope.activeUserProfile = profile;
            });
        };

        $scope.isAuthorized = function (profile, role) {
            return authService.isAuthorized(profile, role);
        };

        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.userData = authService.getUserData();
        });

        $scope.$on(AUTH_EVENTS.profileChanged, function () {
            $scope.userData = authService.getUserData();
        });

        $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
            $scope.userData = null;
        });





    }
})();

///#source 1 1 /App/Auth/authStartup.js
(function () {
    'use strict';

    /**
     * Authentication Provider for Core module.
     */

    angular.module('core.auth').run([
            'authService', function (authService) {
                authService.fillAuthData();
            }
    ]).config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });
})();
///#source 1 1 /App/Auth/Directives/authLogin.js
(function() {
    'use strict';

    angular
        .module('core.auth')
        .directive('authLogin', ['$window', authLogin]);
    
    function authLogin ($window) {
        // Usage:
        // allows users to login to the website
        // Creates:
        // login form

        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/auth/directives/authLogin.html',
            controller: 'authLoginController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/Auth/Directives/authLogout.js
(function() {
    'use strict';

    angular
        .module('core.auth')
        .directive('authLogout', ['$window', authLogout]);
    
    function authLogout ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/auth/directives/authLogout.html',
            controller: 'authLoginController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/Auth/Directives/authSignup.js
(function() {
    'use strict';

    angular
        .module('core.auth')
        .directive('authSignup', ['$window', authSignup]);
    
    function authSignup($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/auth/directives/authSignup.html',
            controller: 'authSignupController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/Client/core.client.module.js
(function () {
    'use strict';

    angular.module('core.client', []);
})();
///#source 1 1 /App/Client/Services/clientService.js
(function () {
    'use strict';

    angular
        .module('core.client')
        .factory('clientService', clientService);

    clientService.$inject = ['$http', 'APP_CONFIG'];

    function clientService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getAllClients: getAllClients
        };

        return service;

        function getAllClients() {
            return $http.get(serviceBase + 'api/client/getall')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded (response) {
                return response.data;
            }

            function getFailed(error) {
                
            }
        }


    }
})();
///#source 1 1 /App/Client/Services/clientEmployeeService.js
(function () {
    'use strict';

    angular
        .module('core.client')
        .factory('clientEmployeeService', clientEmployeeService);

    clientEmployeeService.$inject = ['$http', 'APP_CONFIG'];

    function clientEmployeeService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getAllClientEmployees: getAllClientEmployees           
        };

        return service;

        function getAllClientEmployees() {
            return $http.get(serviceBase + 'api/clientemployee/getall')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded (response) {
                return response.data;
            }

            function getFailed(error) {
                
            }
        }


    }
})();
///#source 1 1 /App/Client/Controllers/clientCtrl.js
(function () {
    'use strict';

    angular
        .module('core.client')
        .controller('clientController', clientController);

    clientController.$inject = ['clientService'];

    function clientController(clientService) {
        var client = this;
        client.allClients = [];
        client.currentPage = 1;
        client.pageSize = 10;
        activate();

        function activate() {
            return getClients().then(function () {

            });
        }

        function getClients() {
            return clientService.getAllClients()
                .then(function (data) {
                    client.allClients = data;
                    return client.allClients;
                });
        }
    }
})();

///#source 1 1 /App/Client/Controllers/clientEmployeeCtrl.js
(function () {
    'use strict';

    angular
        .module('core.client')
        .controller('clientEmployeeController', clientEmployeeController);

    clientEmployeeController.$inject = ['clientEmployeeService'];

    function clientEmployeeController(clientEmployeeService) {
        var clientEmployee = this;
        clientEmployee.allEmployees = [];
        clientEmployee.currentPage = 1;
        clientEmployee.pageSize = 50;     
        activate();

        function activate() {
            return getEmployees().then(function() {

            });
        }

        function getEmployees() {
            return clientEmployeeService.getAllClientEmployees()
                .then(function (data) {
                    clientEmployee.allEmployees = data;
                    return clientEmployee.allEmployees;
                });
        }
    }
})();

///#source 1 1 /App/User/core.user.module.js
(function () {
    'use strict';

    angular.module('core.user', []);
})();
///#source 1 1 /App/User/Services/userService.js
(function () {
    'use strict';

    angular
        .module('core.user')
        .service('userService', userService);

    userService.$inject = ['$http', 'APP_CONFIG'];

    function userService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getActiveUser: getActiveUser,
            getAllUsers: getAllUsers,
            disableUserAccount: disableUserAccount,
            enableUserAccount: enableUserAccount,
            updateActiveUserProfile: updateActiveUserProfile
        };

        return service;

        function updateActiveUserProfile(profile) {
            return $http.put(serviceBase + 'api/Account/UpdateActiveUserProfile', profile);
        }

        function getActiveUser() {
            return $http.get(serviceBase + 'api/Account/GetActiveUserAccount')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded(response) {
                return response.data;
            }

            function getFailed(error) {

            }
        }

        function getAllUsers() {
            return $http.get(serviceBase + 'api/Account/GetAllUserAccounts')
                .then(getSucceeded)
                .catch(getFailed);

            function getSucceeded(response) {
                return response.data;
            }

            function getFailed(error) {

            }
        }

        function enableUserAccount(user) {
            return $http.put(serviceBase + 'api/Account/EnableUserAccount', user);
        }

        function disableUserAccount(user) {
            return $http.put(serviceBase + 'api/Account/DisableUserAccount', user);
        }
    }
})();
///#source 1 1 /App/User/Controllers/userController.js
(function () {
    'use strict';

    angular
        .module('core.user')
        .controller('userController', userController);

    userController.$inject = ['$location', 'userService', '$scope', 'authSession', 'AUTH_EVENTS', '$filter', '$rootScope'];

    function userController($location, userService, $scope, authSession, AUTH_EVENTS, $filter, $rootScope) {
        /* jshint validthis:true */
        var vm = this;
        vm.message = '';
        vm.title = 'User Controller';
        activate();
        function activate() {
            userService.getActiveUser().then(function (profile) {
                authSession.saveUserData(profile);
                var spouse = $filter('filter')(profile.ClientEmployee.Dependents, { Spouse: "true" })[0];

                vm.profile = {
                    FirstName: profile.ClientEmployee.FirstName,
                    LastName: profile.ClientEmployee.LastName,
                    CompanyEmail: profile.ClientEmployee.CompanyEmail,
                    PreferredEmail: profile.ClientEmployee.PreferredEmail,
                    SSN: profile.ClientEmployee.LastSSN,
                    Street: profile.ClientEmployee.Street,
                    Unit: profile.ClientEmployee.Unit,
                    City: profile.ClientEmployee.City,
                    Region: profile.ClientEmployee.Region,
                    Postal: profile.ClientEmployee.Postal,
                    Country: profile.ClientEmployee.Country,
                    DateOfBirth: profile.ClientEmployee.DateOfBirth,
                    HomePhone: profile.ClientEmployee.HomePhone,
                    WorkPhone: profile.ClientEmployee.WorkPhone,
                    CellPhone: profile.ClientEmployee.CellPhone,
                    HipaaAuthorizationGiven: profile.ClientEmployee.HipaaAuthorizationGiven,
                    SpouseFirstName: spouse.FirstName,
                    SpouseLastName: spouse.LastName,
                    SpouseDateOfBirth: spouse.DateOfBirth,
                    SpouseCellPhone: spouse.CellPhone,
                    SpouseHomePhone: spouse.HomePhone,
                    SpouseWorkPhone: spouse.WorkPhone,
                    SpouseSSN: spouse.LastSSN
                };

                $scope.$emit(AUTH_EVENTS.profileChanged);

            });
        };

        

        vm.update = function(profile) {
            vm.working = true;
            userService.updateActiveUserProfile(profile)
                .success(function(response) {
                    vm.working = false;
                    vm.savedSuccessfully = true;
                    vm.message = 'Profile updated!';
                    //toastr.success('Profile Changes Saved!');
                    userService.getActiveUser().then(function(profile) {
                        authSession.saveUserData(profile);
                        $scope.$emit(AUTH_EVENTS.profileChanged);
                    });
                })
                .error(function(error) {
                    vm.working = false;
                    vm.savedSuccessfully = false;
                    vm.message = 'Error Updating Profile!';
                    //toastr.error('Error Updating Profile!');
                });
        };

        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };

        vm.opensp = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.openedsp = true;
        };
    }
})();

///#source 1 1 /App/User/Controllers/userAdminController.js
(function () {
    'use strict';

    angular
        .module('core.user')
        .controller('userAdminController', userAdminController);

    userAdminController.$inject = ['$location', 'userService', '$scope', 'authSession', 'AUTH_EVENTS', '$filter'];

    function userAdminController($location, userService, $scope, authSession, AUTH_EVENTS, $filter) {
        /* jshint validthis:true */
        var vm = this;
        vm.message = '';
        vm.title = 'User Admin Controller';
        vm.working = false;
        vm.message = "";

        vm.users = [];
        vm.currentPage = 1;
        vm.pageSize = 50;
        activate();

        function activate() {
            return getAllUsers().then(function () {

            });
        };

        function getAllUsers() {
            return userService.getAllUsers()
                .then(function (data) {
                    vm.users = data;
                    return vm.users;
                });
        };

        vm.enableUser = function (profile) {
            vm.working = true;
            userService.enableUserAccount(profile)
                .success(function (response) {
                    vm.working = false;
                    vm.message = 'User Enabled';
                    getAllUsers();
                })
                .error(function (error) {
                    vm.working = false;
                    vm.message = 'Error Enabling User!';
                });
        };

        vm.disableUser = function(profile) {
            vm.working = true;
            userService.disableUserAccount(profile)
                .success(function(response) {
                    vm.working = false;
                    vm.message = 'User Disabled';
                    getAllUsers();
                })
                .error(function(error) {
                    vm.working = false;
                    vm.message = 'Error Disabling User!';
                });
        };

    };
})();

///#source 1 1 /App/User/Directives/userActions.js
(function() {
    'use strict';

    angular
        .module('core.user')
        .directive('userActions', ['$window', userActions]);
    
    function userActions ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'App/User/Directives/userActions.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/User/Directives/userProfile.js
(function() {
    'use strict';

    angular
        .module('core.user')
        .directive('userProfile', userProfile);

    userProfile.$inject = ['$window'];
    
    function userProfile ($window) {
        // Usage:
        //     <userProfile></userProfile>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'App/User/Directives/userProfile.html',
            controller: 'userController',
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/Survey/core.survey.module.js
(function () {
    'use strict';

    angular.module('core.survey', []);
})();
///#source 1 1 /App/Survey/Services/surveyService.js
(function () {
    'use strict';

    angular
        .module('core.survey')
        .factory('surveyService', surveyService);

    surveyService.$inject = ['$http', 'APP_CONFIG'];

    function surveyService($http, APP_CONFIG) {

        var serviceBase = APP_CONFIG.serviceURIBase;

        var service = {
            getSurveyByActiveUser: getSurveyByActiveUser,
            getQuestion: getQuestion,
            saveAnswer: saveAnswer
        };

        return service;

        function getSurveyByActiveUser() {
            return $http.get(serviceBase + 'api/Survey/GetSurveyByActiveUser');
        }

        function getQuestion(questionId) {
            return $http.get(serviceBase + 'api/Question/GetMockQuestion?id=' + questionId);
        }

        function saveAnswer(answer) {
            return $http.post(serviceBase + 'api/Answer/post', answer);
        }

    }
})();
///#source 1 1 /App/Survey/Controllers/surveyController.js
(function () {
    'use strict';

    angular
        .module('core.survey')
        .controller('surveyController', surveyController);

    surveyController.$inject = ['$state', '$stateParams', 'surveyService', '$scope', '$filter'];

    function surveyController($state, $stateParams, surveyService, $scope, $filter) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'surveyController';
        vm.questionId = $stateParams.questionId;
        vm.user = $scope.userData.profile.ClientEmployee;
        vm.user.spouse = $filter('filter')(vm.user.Dependents, { Spouse: "true" })[0];
        vm.user.spouse.DependentType = "Spouse";
        vm.currentslide = '66666666';
        vm.progress = 10;
        vm.surcharge = true;
        vm.surveyState = "Initial";
        vm.survey = {};

        activate();

        function activate() {
            getActiveSurvey();
            if (vm.questionId != "") {
                return getActiveQuestion(vm.questionId).then(function() {
                    vm.surveyState = "Question";
                });
            } else {
                
            }
        };

        function getActiveSurvey() {
            surveyService.getSurveyByActiveUser()
                .success(function (data) {
                    vm.survey = data;

                })
                .error(function (error) {
                    
                });
        }

        function getActiveQuestion(questionId) {
            return surveyService.getQuestion(questionId)
                .success(function(data) {
                    vm.activeQuestion = data;
                    return vm.activeQuestion;
                })
                .error(function(error) {
                    $state.go('survey', { questionId: 1 });
                });
        }

        vm.activeQuestion = {};

        vm.startSurvey = function() {
            $state.go('survey', { questionId: 1 });
        };

        vm.submitAnswer = function (answerId, nextId, action) {
            surveyService.saveAnswer(answerId)
                .success(function (data) {
                    if (action === "") {
                        $state.go('survey', { questionId: nextId });
                    } else {
                        processAction(action);
                    }
                })
                .error(function (error) {
                    $state.go('survey', { questionId: nextId });
                });

        };

        function processAction(action) {
            switch (action) {
                case "SurveyComplete":
                    vm.surveyState = "Complete";
                    break;
                case "StartOver":
                    $state.go('survey', { questionId: 1 });
                    break;               
            }
        }

        vm.changeSlide = function(slidenum) {
            vm.currentslide = slidenum;

            vm.progress = slidenum * 12;

            if (slidenum === '99') {
                vm.surcharge = false;
                vm.progress = 90;
            }

            if (slidenum === '999') {
                vm.progress = 100;
            }

            if (slidenum === '9999') {
                vm.progress = 100;
            }

        };
    }
})();

///#source 1 1 /App/Filters/core.filters.module.js
(function () {
    'use strict';

    angular.module('core.filters', []);
})();
///#source 1 1 /App/Filters/core.parseTokens.js
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
///#source 1 1 /App/Utils/dirPagination.js
/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *
 * Credits
 * =======
 *
 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
 * for the idea on how to dynamically invoke the ng-repeat directive.
 *
 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:
 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */

(function () {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirPagination';
    var DEFAULT_ID = '__default';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    module
        .directive('dirPaginate', ['$compile', '$parse', 'paginationService', dirPaginateDirective])
        .directive('dirPaginateNoCompile', noCompileDirective)
        .directive('dirPaginationControls', ['paginationService', 'paginationTemplate', dirPaginationControlsDirective])
        .filter('itemsPerPage', ['paginationService', itemsPerPageFilter])
        .service('paginationService', paginationService)
        .provider('paginationTemplate', paginationTemplateProvider)
        .run(['$templateCache', dirPaginationControlsTemplateInstaller]);

    function dirPaginateDirective($compile, $parse, paginationService) {

        return {
            terminal: true,
            multiElement: true,
            compile: dirPaginationCompileFn
        };

        function dirPaginationCompileFn(tElement, tAttrs) {

            var expression = tAttrs.dirPaginate;
            // regex taken directly from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            var filterPattern = /\|\s*itemsPerPage\s*:[^|]*/;
            if (match[2].match(filterPattern) === null) {
                throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
            }
            var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
            var collectionGetter = $parse(itemsPerPageFilterRemoved);

            addNoCompileAttributes(tElement);

            // If any value is specified for paginationId, we register the un-evaluated expression at this stage for the benefit of any
            // dir-pagination-controls directives that may be looking for this ID.
            var rawId = tAttrs.paginationId || DEFAULT_ID;
            paginationService.registerInstance(rawId);

            return function dirPaginationLinkFn(scope, element, attrs) {

                // Now that we have access to the `scope` we can interpolate any expression given in the paginationId attribute and
                // potentially register a new ID if it evaluates to a different value than the rawId.
                var paginationId = $parse(attrs.paginationId)(scope) || attrs.paginationId || DEFAULT_ID;
                paginationService.registerInstance(paginationId);

                var repeatExpression = getRepeatExpression(expression, paginationId);
                addNgRepeatToElement(element, attrs, repeatExpression);

                removeTemporaryAttributes(element);
                var compiled = $compile(element);

                var currentPageGetter = makeCurrentPageGetterFn(scope, attrs, paginationId);
                paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);

                if (typeof attrs.totalItems !== 'undefined') {
                    paginationService.setAsyncModeTrue(paginationId);
                    scope.$watch(function () {
                        return $parse(attrs.totalItems)(scope);
                    }, function (result) {
                        if (0 <= result) {
                            paginationService.setCollectionLength(paginationId, result);
                        }
                    });
                } else {
                    scope.$watchCollection(function () {
                        return collectionGetter(scope);
                    }, function (collection) {
                        if (collection) {
                            paginationService.setCollectionLength(paginationId, collection.length);
                        }
                    });
                }

                // Delegate to the link function returned by the new compilation of the ng-repeat
                compiled(scope);
            };
        }

        /**
         * If a pagination id has been specified, we need to check that it is present as the second argument passed to
         * the itemsPerPage filter. If it is not there, we add it and return the modified expression.
         *
         * @param expression
         * @param paginationId
         * @returns {*}
         */
        function getRepeatExpression(expression, paginationId) {
            var repeatExpression,
                idDefinedInFilter = !!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);

            if (paginationId !== DEFAULT_ID && !idDefinedInFilter) {
                repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:[^|]*)/, "$1 : '" + paginationId + "'");
            } else {
                repeatExpression = expression;
            }

            return repeatExpression;
        }

        /**
         * Adds the ng-repeat directive to the element. In the case of multi-element (-start, -end) it adds the
         * appropriate multi-element ng-repeat to the first and last element in the range.
         * @param element
         * @param attrs
         * @param repeatExpression
         */
        function addNgRepeatToElement(element, attrs, repeatExpression) {
            if (element[0].hasAttribute('dir-paginate-start') || element[0].hasAttribute('data-dir-paginate-start')) {
                // using multiElement mode (dir-paginate-start, dir-paginate-end)
                attrs.$set('ngRepeatStart', repeatExpression);
                element.eq(element.length - 1).attr('ng-repeat-end', true);
            } else {
                attrs.$set('ngRepeat', repeatExpression);
            }
        }

        /**
         * Adds the dir-paginate-no-compile directive to each element in the tElement range.
         * @param tElement
         */
        function addNoCompileAttributes(tElement) {
            angular.forEach(tElement, function (el) {
                if (el.nodeType === Node.ELEMENT_NODE) {
                    angular.element(el).attr('dir-paginate-no-compile', true);
                }
            });
        }

        /**
         * Removes the variations on dir-paginate (data-, -start, -end) and the dir-paginate-no-compile directives.
         * @param element
         */
        function removeTemporaryAttributes(element) {
            angular.forEach(element, function (el) {
                if (el.nodeType === Node.ELEMENT_NODE) {
                    angular.element(el).removeAttr('dir-paginate-no-compile');
                }
            });
            element.eq(0).removeAttr('dir-paginate-start').removeAttr('dir-paginate').removeAttr('data-dir-paginate-start').removeAttr('data-dir-paginate');
            element.eq(element.length - 1).removeAttr('dir-paginate-end').removeAttr('data-dir-paginate-end');
        }

        /**
         * Creates a getter function for the current-page attribute, using the expression provided or a default value if
         * no current-page expression was specified.
         *
         * @param scope
         * @param attrs
         * @param paginationId
         * @returns {*}
         */
        function makeCurrentPageGetterFn(scope, attrs, paginationId) {
            var currentPageGetter;
            if (attrs.currentPage) {
                currentPageGetter = $parse(attrs.currentPage);
            } else {
                // if the current-page attribute was not set, we'll make our own
                var defaultCurrentPage = paginationId + '__currentPage';
                scope[defaultCurrentPage] = 1;
                currentPageGetter = $parse(defaultCurrentPage);
            }
            return currentPageGetter;
        }
    }

    /**
     * This is a helper directive that allows correct compilation when in multi-element mode (ie dir-paginate-start, dir-paginate-end).
     * It is dynamically added to all elements in the dir-paginate compile function, and it prevents further compilation of
     * any inner directives. It is then removed in the link function, and all inner directives are then manually compiled.
     */
    function noCompileDirective() {
        return {
            priority: 5000,
            terminal: true
        };
    }

    function dirPaginationControlsTemplateInstaller($templateCache) {
        $templateCache.put('angularUtils.directives.dirPagination.template', '<ul class="pagination" ng-if="1 < pages.length"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }"><a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>');
    }

    function dirPaginationControlsDirective(paginationService, paginationTemplate) {

        var numberRegex = /^\d+$/;

        return {
            restrict: 'AE',
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || paginationTemplate.getPath();
            },
            scope: {
                maxSize: '=?',
                onPageChange: '&?',
                paginationId: '=?'
            },
            link: dirPaginationControlsLinkFn
        };

        function dirPaginationControlsLinkFn(scope, element, attrs) {

            // rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has
            // not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is
            // no corresponding dir-paginate directive and wrongly throwing an exception.
            var rawId = attrs.paginationId || DEFAULT_ID;
            var paginationId = scope.paginationId || attrs.paginationId || DEFAULT_ID;

            if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {
                var idMessage = (paginationId !== DEFAULT_ID) ? ' (id: ' + paginationId + ') ' : ' ';
                throw 'pagination directive: the pagination controls' + idMessage + 'cannot be used without the corresponding pagination directive.';
            }

            if (!scope.maxSize) { scope.maxSize = 9; }
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

            var paginationRange = Math.max(scope.maxSize, 5);
            scope.pages = [];
            scope.pagination = {
                last: 1,
                current: 1
            };
            scope.range = {
                lower: 1,
                upper: 1,
                total: 1
            };

            scope.$watch(function () {
                return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
            }, function (length) {
                if (0 < length) {
                    generatePagination();
                }
            });

            scope.$watch(function () {
                return (paginationService.getItemsPerPage(paginationId));
            }, function (current, previous) {
                if (current != previous && typeof previous !== 'undefined') {
                    goToPage(scope.pagination.current);
                }
            });

            scope.$watch(function () {
                return paginationService.getCurrentPage(paginationId);
            }, function (currentPage, previousPage) {
                if (currentPage != previousPage) {
                    goToPage(currentPage);
                }
            });

            scope.setCurrent = function (num) {
                if (isValidPageNumber(num)) {
                    num = parseInt(num, 10);
                    paginationService.setCurrentPage(paginationId, num);
                }
            };

            function goToPage(num) {
                if (isValidPageNumber(num)) {
                    scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = num;
                    updateRangeValues();

                    // if a callback has been set, then call it with the page number as an argument
                    if (scope.onPageChange) {
                        scope.onPageChange({ newPageNumber: num });
                    }
                }
            }

            function generatePagination() {
                var page = parseInt(paginationService.getCurrentPage(paginationId)) || 1;

                scope.pages = generatePagesArray(page, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                scope.pagination.current = page;
                scope.pagination.last = scope.pages[scope.pages.length - 1];
                if (scope.pagination.last < scope.pagination.current) {
                    scope.setCurrent(scope.pagination.last);
                } else {
                    updateRangeValues();
                }
            }

            /**
             * This function updates the values (lower, upper, total) of the `scope.range` object, which can be used in the pagination
             * template to display the current page range, e.g. "showing 21 - 40 of 144 results";
             */
            function updateRangeValues() {
                var currentPage = paginationService.getCurrentPage(paginationId),
                    itemsPerPage = paginationService.getItemsPerPage(paginationId),
                    totalItems = paginationService.getCollectionLength(paginationId);

                scope.range.lower = (currentPage - 1) * itemsPerPage + 1;
                scope.range.upper = Math.min(currentPage * itemsPerPage, totalItems);
                scope.range.total = totalItems;
            }

            function isValidPageNumber(num) {
                return (numberRegex.test(num) && (0 < num && num <= scope.pagination.last));
            }
        }

        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}
         */
        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i++;
            }
            return pages;
        }

        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange / 2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }
    }

    /**
     * This filter slices the collection into pages based on the current page number and number of items per page.
     * @param paginationService
     * @returns {Function}
     */
    function itemsPerPageFilter(paginationService) {

        return function (collection, itemsPerPage, paginationId) {
            if (typeof (paginationId) === 'undefined') {
                paginationId = DEFAULT_ID;
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (collection instanceof Array) {
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                if (paginationService.isAsyncMode(paginationId)) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);

                return collection.slice(start, end);
            } else {
                return collection;
            }
        };
    }

    /**
     * This service allows the various parts of the module to communicate and stay in sync.
     */
    function paginationService() {

        var instances = {};
        var lastRegisteredInstance;

        this.registerInstance = function (instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };

        this.isRegistered = function (instanceId) {
            return (typeof instances[instanceId] !== 'undefined');
        };

        this.getLastInstanceId = function () {
            return lastRegisteredInstance;
        };

        this.setCurrentPageParser = function (instanceId, val, scope) {
            instances[instanceId].currentPageParser = val;
            instances[instanceId].context = scope;
        };
        this.setCurrentPage = function (instanceId, val) {
            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);
        };
        this.getCurrentPage = function (instanceId) {
            var parser = instances[instanceId].currentPageParser;
            return parser ? parser(instances[instanceId].context) : 1;
        };

        this.setItemsPerPage = function (instanceId, val) {
            instances[instanceId].itemsPerPage = val;
        };
        this.getItemsPerPage = function (instanceId) {
            return instances[instanceId].itemsPerPage;
        };

        this.setCollectionLength = function (instanceId, val) {
            instances[instanceId].collectionLength = val;
        };
        this.getCollectionLength = function (instanceId) {
            return instances[instanceId].collectionLength;
        };

        this.setAsyncModeTrue = function (instanceId) {
            instances[instanceId].asyncMode = true;
        };

        this.isAsyncMode = function (instanceId) {
            return instances[instanceId].asyncMode;
        };
    }

    /**
     * This provider allows global configuration of the template path used by the dir-pagination-controls directive.
     */
    function paginationTemplateProvider() {

        var templatePath = 'angularUtils.directives.dirPagination.template';

        this.setPath = function (path) {
            templatePath = path;
        };

        this.$get = function () {
            return {
                getPath: function () {
                    return templatePath;
                }
            };
        };
    }
})();
///#source 1 1 /App/Utils/angular-input-match.min.js
/*!
 * angular-input-match
 * Checks if one input matches another
 * @version v1.5.0
 * @link https://github.com/TheSharpieOne/angular-input-match
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */!function (a, b, c) { "use strict"; function d(a) { return { require: "?ngModel", restrict: "A", link: function (c, d, e, f) { function g() { var a = h(c); return b.isObject(a) && a.hasOwnProperty("$viewValue") && (a = a.$viewValue), a } if (!f) return void (console && console.warn && console.warn("Match validation requires ngModel to be on the element")); var h = a(e.match), i = a(e.matchCaseless); c.$watch(g, function () { f.$$parseAndValidate() }), f.$validators.match = function () { var a = g(); return i(c) && b.isString(a) && b.isString(f.$viewValue) ? f.$viewValue.toLowerCase() === a.toLowerCase() : f.$viewValue === a } } } } b.module("validation.match", []), b.module("validation.match").directive("match", d), d.$inject = ["$parse"] }(window, window.angular);
///#source 1 1 /App/Metrics/Controllers/metricsChartDataCtrl.js
(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('metricsChartDataController', metricsChartDataController);

    function metricsChartDataController() {
        var chart = this;
        chart.title = 'metricDataController';

        chart.config = {
            title: 'Responders',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        chart.data = {
            series: ['Received', 'Bounced', 'No response'],
            data: [{
                x: "January",
                y: [1003, 13, 24]
            }, {
                x: "February",
                y: [1234, 5, 12]
            }, {
                x: "March",
                y: [1567, 12, 22]
            }, {
                x: "April",
                y: [765, 11, 20]
            }]
        };

        chart.pieconfig = {
            title: 'Surcharge Status',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        chart.piedata = {
            series: ['Applies', 'N/A', 'Does Not Apply'],
            data: [{
                x: "Applies",
                y: [653, 13, 24]
            }, {
                x: "N/A",
                y: [1234, 5, 12]
            }, {
                x: "Does Not Apply",
                y: [1567, 12, 22]
            }]
        };

        chart.smallpieconfig = {
            title: 'Email Responders',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        chart.smallpiedata = {
            series: ['Received', 'Accepted', 'Bounced'],
            data: [{
                x: "Received",
                y: [5653]
            }, {
                x: "Accepted",
                y: [1234]
            }, {
                x: "Bounced",
                y: [1567]
            }]
        };

        chart.smallpieconfig2 = {
            title: 'Hipaa Status',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        chart.smallpiedata2 = {
            series: ['Read', 'Accepted', 'Read'],
            data: [{
                x: "Rejected",
                y: [432]
            }, {
                x: "Accepted",
                y: [2233]
            }, {
                x: "Read",
                y: [5956]
            }]
        };

        chart.smallpieconfig3 = {
            title: 'Surcharge Status',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        chart.smallpiedata3 = {
            series: ['Applies', 'N/A'],
            data: [{
                x: "Applies",
                y: [4323]
            },
            {
                x: "N/A",
                y: [5956]
            }]
        };

        chart.smallpieconfig4 = {
            title: 'Appeals',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };

        chart.smallpiedata4 = {
            series: ['In Appeal', 'Rejected'],
            data: [{
                x: "In Appeal",
                y: [453]
            },
            {
                x: "Rejected",
                y: [122]
            }]
        };

    }
})();

///#source 1 1 /App/Nav/Controllers/navActiveAuditCtrl.js
(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('navActiveAuditController',navActiveAuditController);

    navActiveAuditController.$inject = ['$location'];

    function navActiveAuditController($location) {
        var vm = this;
        vm.title = 'navActiveAuditController';
        vm.auditTitle = 'Demo Company Dashboard';
        vm.showAlert = true;

    }
})();

///#source 1 1 /App/Nav/Controllers/sidebarCtrl.js
(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('sidebarController', sidebarController);

    sidebarController.$inject = ['$scope', '$location', '$cookieStore'];

    function sidebarController($scope, $location, $cookieStore) {
        var vm = this;
        vm.title = 'sidebar';
        vm.toggle = false;

        var mobileView = 992;

        $scope.getWidth = function () {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    vm.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    vm.toggle = true;
                }
            } else {
                vm.toggle = false;
            }

        });

        vm.toggleSidebar = function () {
            vm.toggle = !vm.toggle;
            $cookieStore.put('toggle', vm.toggle);
        };

        window.onresize = function () {
            $scope.$apply();
        };


    }
})();

///#source 1 1 /App/Nav/Controllers/navMenuCtrl.js
(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('navMenuController', navMenuController);

    navMenuController.$inject = ['$scope', '$location', 'authService', 'authSession', 'AUTH_EVENTS'];

    function navMenuController($scope, $location, authService, authSession, AUTH_EVENTS) {
        var vm = this;
        vm.title = 'navMenuController';
        vm.authInfo = authSession.getUserData;

        //$scope.$watch(authSession.getUserData, function (newValue, oldValue) {
        //    if (newValue) {
        //        vm.authInfo = newValue;
        //    } 
        //});

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            vm.authInfo = authSession.getUserData();
        });

    }
})();

///#source 1 1 /App/Nav/Directives/navActiveAudit.js
(function() {
    'use strict';

    angular
        .module('coreApp')
        .directive('navActiveAudit', ['$window', navActiveAudit]);
    
    function navActiveAudit ($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'App/Nav/Directives/navActiveAudit.html',
            controller: 'navActiveAuditController',
            controllerAs: 'audit'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/Nav/Directives/navBtnBack.js
(function() {
    'use strict';

    angular
        .module('coreApp')
        .directive('navBtnBack', navBtnBack);

    navBtnBack.$inject = ['$window'];
    
    function navBtnBack ($window) {
        // Usage:
        //     <navBtnBack></navBtnBack>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict   : 'E',
            replace    : true,
            transclude : true,
            templateUrl: 'App/Nav/Directives/navBtnBack.html',

        };

        return directive;

        function link(scope, element, attrs) {
            scope.goBack = function () {
                $window.history.back();
            };
        }
    }

})();
///#source 1 1 /App/Nav/Directives/navMenu.js
(function() {
    'use strict';

    angular
        .module('coreApp')
        .directive('navMenu', ['$window', navMenu]);
    
    function navMenu($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'App/Nav/Directives/navMenu.html',
            controller: 'navMenuController',
            controllerAs: 'nav'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();
///#source 1 1 /App/routes.js
(function () {
    'use strict';

    /**
     * Route configuration for Core ngUI.
     * TODO: Research authorized routes in ui.router
     */

    angular.module('coreApp').config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // For unmatched routes
            $urlRouterProvider.otherwise('/login');

            // Application routes
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'Views/Login.html',
                    controller: 'authModalController as authModal'
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'Views/Home.html'
                })
               .state('signup', {
                    url: '/signup',
                    templateUrl: 'Views/Signup.html'
                })
                .state('survey', {
                    url: '/survey/:questionId',
                    templateUrl: 'Views/Survey.html',
                    controller: 'surveyController as vm'
                })
                .state('employees', {
                    url: '/employees',
                    templateUrl: 'Views/Employees.html',
                    controller: 'clientEmployeeController as clientEmployee'
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'Views/Profile.html'
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'Views/Settings.html'
                })
                .state('auditdashboard', {
                    url: '/auditdashboard',
                    templateUrl: 'Views/AuditDashboard.html',
                    controller: 'metricsChartDataController as chart'
                })
                .state('metrics', {
                    url: '/metrics',
                    templateUrl: 'Views/Metrics.html',
                    controller: 'metricsChartDataController as chart'
                })
                .state('useraccountadmin', {
                    url: '/clients',
                    templateUrl: 'Views/useraccountadmin.html',
                    controller: 'userAdminController as vm'
                })
                .state('help', {
                    url: '/help',
                    templateUrl: 'Views/Help.html'
                })
                .state('restricted', {
                    url: '/restricted',
                    templateUrl: 'Views/Restricted.html'
                })
                .state('admin', {
                    url: '/admin',
                    templateUrl: 'Views/Admin.html'
                });
        }
    ]);
})();
