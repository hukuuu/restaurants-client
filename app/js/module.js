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
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'js/modules/authentication/login.html',
            controller: 'LoginController'
        })
        $routeProvider.when('/restaurants', {
            templateUrl: 'js/modules/restaurants/list.html',
            controller: 'RestaurantsController',
            resolve: {
                restaurants : function (RestaurantsService) {
                    return RestaurantsService.query().$promise;
                }
            }
        })
        $routeProvider.when('/restaurants/view/:id', {
            templateUrl: 'js/modules/restaurants/view.html',
            controller: 'ViewRestaurantController',
            resolve: {
                restaurant: function ($route, RestaurantsService) {
                    return RestaurantsService.get({id:$route.current.params.id}).$promise;
                }
            }
        })
        $routeProvider.when('/restaurants/new', {
            templateUrl: 'js/modules/restaurants/new.html',
            controller: 'NewRestaurantController'
        })
        $routeProvider.when('/restaurants/view/:restaurantId/food', {
            templateUrl: 'js/modules/food/list.html',
            controller: 'FoodController',
            resolve: {
                food: function ($route, FoodServiceProvider) {
                    var restaurantId = $route.current.params.restaurantId;
                    var foodService = FoodServiceProvider(restaurantId);
                    return foodService.query().$promise;
                }
            }
        })
        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // $httpProvider.interceptors.push('AuthenticationInterceptor');

    })

.run(function ($rootScope, $location, $cookieStore, $http, loaderModalAPI) {
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
});
