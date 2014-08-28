angular.module('header')
    .controller('HeaderController', function($scope, $location, AuthenticationService) {
        console.log('obj');
        $scope.currentUser = function() {
            return AuthenticationService.getCurrentUser();
        }

        $scope.logout = function() {
            console.log('logging out');
            AuthenticationService.clearCredentials();
            $location.path('/');
        }

    });
