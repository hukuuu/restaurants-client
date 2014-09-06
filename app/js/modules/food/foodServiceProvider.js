angular.module('food').factory('FoodServiceProvider', function ($resource, baseUrl) {
    return function (restaurantId) {
        return $resource(baseUrl + 'restaurants/'+restaurantId+'/food/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
});
