angular.module('restaurants')
    .controller('NewRestaurantController', function($scope, $routeParams, $location, $timeout, RestaurantsService, toaster) {

        $scope.title = 'Create Restaurant'
        $scope.restaurant = {}
        $scope.editOrSave = 'Save'

        $scope.save = function(restaurant) {
            RestaurantsService.save(restaurant)
                .$promise
                .then(function() {
                    toaster.pop('success', 'success', 'restaurant saved.');
                })
                .catch(function(err) {
                    toaster.pop('error', 'error', err);
                })
        }

        $scope.cancelCreation = function () {
            var array = $location.path().split('/');
            array.pop()
            $location.path(array.join('/'))
        }
    });
