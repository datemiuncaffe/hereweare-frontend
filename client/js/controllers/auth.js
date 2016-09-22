(function(){
  'use strict';

  angular.module('authcontroller', [])
    .controller('AuthController',
        ['$rootScope', '$scope', '$log', '$state', '$timeout', '$location',
        function ($rootScope, $scope, $log, $state, $timeout, $location) {

      var status = {
        isAuthen: false
      };

      $scope.logout = function() {
        console.log("logout");
      }

      $scope.login = function() {
        console.log("login");
      }

    }]);

})();
