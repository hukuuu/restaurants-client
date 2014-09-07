angular.module('restaurants')
    .controller('RestaurantsController', function($scope, $location,restaurants, RestaurantsService) {
        // var fetch = function() {
        //     $scope.restaurants = RestaurantsService.query();
        // }
        // fetch();
        console.log(restaurants);
        $scope.restaurants = restaurants;
        $scope.navigate = function(path) {
            $location.path($location.path() + path);
        }
        $scope.gotRestaurants = function () {
            return $scope.restaurants.length > 0;
        }

    })
