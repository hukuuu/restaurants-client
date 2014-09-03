angular.module('directives')
    .directive('category', function() {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<span class="label label-{{getColor(value)}}">{{value}}</span>',
            replace: true,
            link: function(scope, element, attrs, ngModel) {
                scope.$watch(attrs.ngModel,function(val) {
                    scope.value = val;
                })

                var colors = {
                    'pub': 'default',
                    'restaurant': 'danger'
                }
                scope.getColor = function(value) {
                    return colors[value] || 'default'
                }
            }
        }
    });
