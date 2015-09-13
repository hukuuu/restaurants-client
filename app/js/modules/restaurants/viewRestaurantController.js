angular.module('restaurants')
    .controller('ViewRestaurantController', function($scope, $routeParams, $location, $timeout, restaurant, RestaurantsService, toaster) {

        $scope.restaurant = restaurant;

        var id = $routeParams.id,
            VIEW_MODE = 'view',
            CREATE_MODE = 'create',
            EDIT_MODE = 'edit';
        if (id) {
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
            $location.path($location.path() + path);
        }

        $scope.handleEditOrSave = function(restaurant) {
            if ($scope.mode === VIEW_MODE) {
                $scope.mode = EDIT_MODE
                $scope.editOrSave = 'Save'
            } else if ($scope.mode === EDIT_MODE) {
                console.log(restaurant);
                delete restaurant.$promise;
                delete restaurant.$resolved;
                RestaurantsService.update(restaurant)
                    .$promise
                    .then(function() {
                        toaster.pop('success', 'success', 'restaurant updated');
                        $scope.mode = VIEW_MODE;
                        $scope.editOrSave = 'Edit'
                    })
                    .catch(function(err) {
                        toaster.pop('error', 'error', err);
                    })
            }
        }

        $scope.isEditMode = function() {
            return $scope.mode === EDIT_MODE;
        }

        $scope.cancel = function() {
            $scope.mode = VIEW_MODE
            $scope.editOrSave = 'Edit'
        }

    });
