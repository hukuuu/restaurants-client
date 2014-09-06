angular.module('food')
    .filter('price', function () {
        return function (input) {
            var str = input + '';
            if(str.indexOf('.') > -1)
                return str;
            return str + '.00';
        };
    });
