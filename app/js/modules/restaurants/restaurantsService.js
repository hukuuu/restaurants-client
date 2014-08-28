angular.module('restaurants').factory('RestaurantsService', function($resource, baseUrl) {
     var Restaurants = $resource(baseUrl + 'secure/restaurants/:id', {id:'@id'});

     return Restaurants;
});
