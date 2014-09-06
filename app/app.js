'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'config',
    'restaurants',
    'food',
    'services',
    'authentication',
    'ngCookies',
    'header',
    'directives',
    'toaster',
    'loader-modal'
])
    .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'js/modules/authentication/login.html',
            controller: 'LoginController'
        })
        $routeProvider.when('/restaurants', {
            templateUrl: 'js/modules/restaurants/list.html',
            controller: 'RestaurantsController'
        })
        $routeProvider.when('/restaurants/view/:id', {
            templateUrl: 'js/modules/restaurants/view.html',
            controller: 'RestaurantController'
        })
        $routeProvider.when('/restaurants/new', {
            templateUrl: 'js/modules/restaurants/new.html',
            controller: 'RestaurantController'
        })
        $routeProvider.when('/restaurants/view/:restaurantId/food', {
            templateUrl: 'js/modules/food/list.html',
            controller: 'FoodController'
        })
        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // $httpProvider.interceptors.push('AuthenticationInterceptor');

    }])

.run(["$rootScope", "$location", "$cookieStore", "$http", "loaderModalAPI", function ($rootScope, $location, $cookieStore, $http, loaderModalAPI) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        loaderModalAPI.show()
        var area = $location.url().split('/')[1];
        if ($location.path() !== '/login' && (!$rootScope.globals || !$rootScope.globals.currentUser)) {
            $location.path('/login');
        }
    });
    $rootScope.$on('$routeChangeSuccess', function (scope, current, previous) {
        loaderModalAPI.hide();
    });
}]);

angular.module('authentication', []);
angular.module('config', []);
angular.module('directives',[]);
angular.module('food',[]);

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

angular.module('directives')
    .directive('category', function() {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<span class="label label-{{getColor(value)}}">{{value}}</span>',
            replace: true,
            link: function(scope, element, attrs, ngModel) {
                scope.$watch(attrs.ngModel,function(val) {
                    scope.value = val;
                })

                var colors = {
                    'pub': 'default',
                    'restaurant': 'danger'
                }
                scope.getColor = function(value) {
                    return colors[value] || 'default'
                }
            }
        }
    });

angular.module('config')
  .constant('baseUrl', 'http://localhost:8080/restaurants/api/')
  .constant('baseImgUrl', 'http://localhost:8080/restaurants/resources/images');

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

angular.module('food')
    .filter('price', function () {
        return function (input) {
            var str = input + '';
            if(str.indexOf('.') > -1)
                return str;
            return str + '.00';
        };
    });

angular.module('food')
    .controller('FoodController', ["$scope", "$routeParams", "baseImgUrl", "FoodServiceProvider", function ($scope, $routeParams, baseImgUrl, FoodServiceProvider) {
        var restaurantId = $routeParams.restaurantId;
        var foodService = FoodServiceProvider(restaurantId);

        $scope.baseImgUrl = baseImgUrl;
        $scope.food = foodService.query();
        window.fs = foodService;
    }]);

angular.module('food').factory('FoodServiceProvider', ["$resource", "baseUrl", function ($resource, baseUrl) {
    return function (restaurantId) {
        return $resource(baseUrl + 'restaurants/'+restaurantId+'/food/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}]);

angular.module('restaurants')
    .controller('RestaurantController', ["$scope", "$routeParams", "$location", "$timeout", "RestaurantsService", "toaster", function($scope, $routeParams, $location, $timeout, RestaurantsService, toaster) {
        var id = $routeParams.id,
            VIEW_MODE = 'view',
            CREATE_MODE = 'create',
            EDIT_MODE = 'edit';
        if (id) {
            fetch(id)
            $scope.mode = VIEW_MODE
            $scope.editOrSave = 'Edit'
        } else {
            $scope.title = 'Create Restaurant'
            $scope.restaurant = {}
            $scope.mode = CREATE_MODE
            $scope.editOrSave = 'Save'
        }

        $scope.delete = function(restaurant) {
            RestaurantsService.delete(restaurant)
                .$promise
                .then(function() {
                    toaster.pop('success', 'success', 'restaurant deleted.');
                    var p = $location.path()
                    $location.path(p.substring(0, p.indexOf('/view/')))
                })
                .catch(function(err) {
                    toaster.pop('error', 'error', err);
                })
        }

        $scope.navigate = function(path) {
            // var array = $location.path().split('/');
            // array[array.length - 2] = path
            // console.log(array.join('/'));
            // $location.path(array.join('/'))
            console.log($location.path() + path);
            $location.path($location.path() + path);
        }

        $scope.save = function(restaurant) {
            var action = restaurant.id ? 'update' : 'save'
            RestaurantsService[action](restaurant)
                .$promise
                .then(function() {
                    toaster.pop('success', 'success', 'restaurant ' + action + 'd');
                })
                .catch(function(err) {
                    toaster.pop('error', 'error', err);
                })
        }

        $scope.handleEditOrSave = function(restaurant) {
            if ($scope.mode === VIEW_MODE) {
                $scope.mode = EDIT_MODE
                $scope.editOrSave = 'Save'
            } else if ($scope.mode === EDIT_MODE) {
                RestaurantsService.update(restaurant)
                    .$promise
                    .then(function() {
                        toaster.pop('success', 'success', 'restaurant updated');
                        $scope.mode = VIEW_MODE;
                    })
                    .catch(function(err) {
                        toaster.pop('error', 'error', err);
                    })
            }
        }

        $scope.isEditMode = function() {
            return $scope.mode === EDIT_MODE;
        }
        $scope.cancelCreation = function () {
            var array = $location.path().split('/');
            array.pop()
            console.log(array.join('/'));
            $location.path(array.join('/'))
        }
        $scope.cancel = function() {
            $scope.mode = VIEW_MODE
            $scope.editOrSave = 'Edit'
        }

        function expose(prop) {
            return function(item) {
                console.log(item);
                $scope[prop] = item;
                return item;
            }
        }

        function fetch(id) {
            RestaurantsService.get({
                id: id
            })
                .$promise
                .then(expose('restaurant'))
                .then(console.log.bind(console));
        }

    }]);

angular.module('restaurants')
    .controller('RestaurantsController', ["$scope", "$location", "RestaurantsService", function($scope, $location, RestaurantsService) {
        var fetch = function() {
            $scope.restaurants = RestaurantsService.query();
        }
        fetch();
        $scope.navigate = function(path) {
            $location.path($location.path() + path);
        }
        $scope.gotRestaurants = function () {
            return $scope.restaurants.length > 0;
        }

    }])

angular.module('restaurants').factory('RestaurantsService', ["$resource", "baseUrl", function($resource, baseUrl) {
     var Restaurants = $resource(baseUrl + 'restaurants/:id', {id:'@id'}, {
        update: {
            method: 'PUT'
        }
     });

     return Restaurants;
}]);
