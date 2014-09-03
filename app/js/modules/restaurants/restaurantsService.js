angular.module('restaurants').factory('RestaurantsService', function($resource, baseUrl) {
     var Restaurants = $resource(baseUrl + 'restaurants/:id', {id:'@id'}, {
        update: {
            method: 'PUT'
        }
     });

     return Restaurants;
});
