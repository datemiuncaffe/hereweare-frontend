(function(){
  'use strict';

  angular.module('login', [])
    .controller('LoginController',
        ['$rootScope', '$scope', '$location', 'crud',
        function ($rootScope, $scope, $location, crud) {

      $scope.hwuser = {
        email: 'john.doe',
        password: 'foobar'
      };
      $scope.message = '';
      $scope.register = function(){
        // create user in local mongodb
				crud.createHwuser($scope.hwuser)
          .then(function(hwuser) {
  					console.log('created hwuser: ' + JSON.stringify(hwuser));
            $scope.message = 'Welcome';
				  })
          .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
          });
      };

      $scope.status = {
        isAuthen: false
      };

      $scope.logout = function() {
        console.log("logout");
        $scope.status.isAuthen = false;
        $rootScope.globals.isAuthen = false;
        $location.path('/login');
      };

      $scope.login = function() {
        console.log("login");
        $scope.status.isAuthen = true;
        $rootScope.globals.isAuthen = true;
        $location.path('/pages/overview');
      };

    }]);

})();
