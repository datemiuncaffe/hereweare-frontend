(function(){
  'use strict';

  angular.module('authcontroller', [])
    .controller('AuthController',
        ['$rootScope', '$scope', '$log', '$state', '$timeout', '$location',
        function ($rootScope, $scope, $log, $state, $timeout, $location) {

      $scope.status = {
        isAuthen: false
      };

      $scope.logout = function() {
        console.log("logout");
        $scope.status.isAuthen = false;
      }

      $scope.login = function() {
        console.log("login");
        $scope.status.isAuthen = true;
      }

    }]);

})();
