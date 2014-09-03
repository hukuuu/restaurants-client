'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'config',
    'restaurants',
    'services',
    'authentication',
    'ngCookies',
    'header',
    'directives',
    'toaster',
    'loader-modal'
]).
config(function($routeProvider, $httpProvider) {
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
    $routeProvider.otherwise({
        redirectTo: '/'
    });

    // $httpProvider.interceptors.push('AuthenticationInterceptor');


})

.run(function($rootScope, $location, $cookieStore, $http, loaderModalAPI) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // redirect to login page if not logged in
        loaderModalAPI.show()
        var area = $location.url().split('/')[1];
        if ($location.path() !== '/login' && (!$rootScope.globals || !$rootScope.globals.currentUser)) {
            $location.path('/login');
        }
    });
    $rootScope.$on('$routeChangeSuccess', function(scope, current, previous) {
        loaderModalAPI.hide();
    });
});
