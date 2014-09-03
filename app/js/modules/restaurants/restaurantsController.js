angular.module('restaurants')
    .controller('RestaurantsController', function($scope, $location, RestaurantsService) {
        var fetch = function() {
            $scope.restaurants = RestaurantsService.query();
        }
        fetch();
        $scope.navigate = function(path) {
            $location.path($location.path() + path);
        }

    })
