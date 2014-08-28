angular.module('authentication')
    .controller('LoginModalController', function($scope, $rootScope, $location, $modalInstance, AuthenticationService) {
        // reset login status
        AuthenticationService.clearCredentials();
        $scope.login = function(username,password) {
            console.log(username,password);
            AuthenticationService.login(username, password)
                .success(function(data) {
                    console.log('success');
                    AuthenticationService.setCredentials(username, password);
                    $modalInstance.close();
                    $location.path('/');
                })
                .error(function(data) {
                    console.log(data);
                    $scope.error = data;
                    $scope.dataLoading = false;
                });
        };
    })
