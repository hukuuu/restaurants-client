angular.module('food')
    .controller('FoodController', function ($scope, $routeParams, baseImgUrl, food, FoodServiceProvider) {
        var restaurantId = $routeParams.restaurantId;
        var foodService = FoodServiceProvider(restaurantId);

        $scope.baseImgUrl = baseImgUrl;
        $scope.food = foodService.query();
        window.fs = foodService;
    });
