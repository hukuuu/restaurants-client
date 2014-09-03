angular.module('restaurants')
    .controller('RestaurantController', function($scope, $routeParams, $location, $timeout, RestaurantsService, toaster) {
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
            var array = $location.path().split('/');
            array[array.length - 2] = path
            $location.path(array.join('/'))
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

    });
