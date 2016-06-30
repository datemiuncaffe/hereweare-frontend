// app.js
  // create angular app
  var validationApp = angular.module('validationApp', []);

  // create angular controller
  validationApp.controller('mainController', function($scope) {

    // function to submit the form after all validation has occurred
    $scope.submitForm = function(isValid) {

      $scope.submitted = true;
      alert('isValid: ' + isValid + '; $scope.submitted: ' + $scope.submitted);
      // check to make sure the form is completely valid
      if (isValid) {
        alert('our form is amazing');
      }

    };

  });
