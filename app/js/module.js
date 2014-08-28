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
config(function($routeProvider, $httpProvider) {
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


})

.run(function ($rootScope, $location, $cookieStore, $http) {
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
});
