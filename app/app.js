'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'config',
    'restaurants',
    'services',
    'authentication',
    'ngCookies',
    'header'
]).
config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'js/modules/authentication/login.html',
        controller: 'LoginController'
    })
    $routeProvider.when('/restaurants', {
        templateUrl: 'js/modules/restaurants/restaurants.html',
        controller: 'RestaurantsController'
    })
    $routeProvider.otherwise({
        redirectTo: '/'
    });

    // $httpProvider.interceptors.push('AuthenticationInterceptor');


}])

.run(["$rootScope", "$location", "$cookieStore", "$http", function ($rootScope, $location, $cookieStore, $http) {
     // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            var area = $location.url().split('/')[1];
            if ($location.path() !== '/login' && (!$rootScope.globals || !$rootScope.globals.currentUser) ) {
                $location.path('/login');
            }
        });
}]);

angular.module('authentication', []);
angular.module('config', []);
angular.module('header',[]);
angular.module('restaurants',[]);

angular.module('services',[]);
'use strict';

angular.module('services')

.factory('AuthenticationService',
    ["Base64", "$http", "$cookieStore", "$rootScope", "baseUrl", function(Base64, $http, $cookieStore, $rootScope, baseUrl) {
        var service = {};

        service.login = function(username, password) {
            return $http.post(baseUrl + 'login', {
                username: username,
                password: password
            });
        };

        service.setCredentials = function(username, password) {
            var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.clearCredentials = function() {
            delete $rootScope.globals;
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        service.getCurrentUser = function() {
            var globals = $cookieStore.get('globals'),
                cu = globals ? globals.currentUser : null;
            return cu ? cu.username : 'anonymous';
        }

        return service;
    }])

.factory('Base64', function() {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});

'use strict';

angular.module('authentication')

.controller('LoginController',

    ["$scope", "$modal", function($scope, $modal) {
        $modal.open({
            templateUrl: 'js/modules/authentication/loginModal.html',
            controller: 'LoginModalController'
        });
    }]);

angular.module('authentication')
    .controller('LoginModalController', ["$scope", "$rootScope", "$location", "$modalInstance", "AuthenticationService", function($scope, $rootScope, $location, $modalInstance, AuthenticationService) {
        // reset login status
        AuthenticationService.clearCredentials();
        $scope.login = function(username,password) {
            console.log(username,password);
            AuthenticationService.login(username, password)
                .success(function(data) {
                    console.log('success');
                    AuthenticationService.setCredentials(username, password);
                    $modalInstance.close();
                    $location.path('/');
                })
                .error(function(data) {
                    console.log(data);
                    $scope.error = data;
                    $scope.dataLoading = false;
                });
        };
    }])

angular.module('config')
  .constant('baseUrl', 'http://localhost:8080/restaurants/api/');
angular.module('header')
    .controller('HeaderController', ["$scope", "$location", "AuthenticationService", function($scope, $location, AuthenticationService) {
        console.log('obj');
        $scope.currentUser = function() {
            return AuthenticationService.getCurrentUser();
        }

        $scope.logout = function() {
            console.log('logging out');
            AuthenticationService.clearCredentials();
            $location.path('/');
        }

    }]);

angular.module('restaurants')
    .controller('RestaurantsController', ["$scope", "RestaurantsService", function($scope, RestaurantsService) {
        var fetch = function() {
            $scope.restaurants = RestaurantsService.query();
        }

        fetch();


    }])

angular.module('restaurants').factory('RestaurantsService', ["$resource", "baseUrl", function($resource, baseUrl) {
     var Restaurants = $resource(baseUrl + 'secure/restaurants/:id', {id:'@id'});

     return Restaurants;
}]);
