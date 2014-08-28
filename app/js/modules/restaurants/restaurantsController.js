angular.module('restaurants')
    .controller('RestaurantsController', function($scope, RestaurantsService) {
        var fetch = function() {
            $scope.restaurants = RestaurantsService.query();
        }

        fetch();


    })
