'use strict';

angular.module('authentication')

.controller('LoginController',

    function($scope, $modal) {
        $modal.open({
            templateUrl: 'js/modules/authentication/loginModal.html',
            controller: 'LoginModalController'
        });
    });
