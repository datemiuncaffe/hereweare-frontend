angular
	.module("app")
	.controller("RicercaController", ['$scope', function($scope) {
	    $scope.selectedCustomer = null;
	    
		$scope.appendName = function(str) {
			return {name: str};
		};
		
		
		
		
		
		
		
		$scope.search = function() {
			console.log('searching...');
		};
	    
		
		
		
		
//		$scope.countrySelected9 = {name: 'Zimbabwe', code: 'ZW'};
//	    $scope.countrySelectedFn9 = function(selected) {
//	      if (selected) {
//	        $scope.countrySelected9 = selected.originalObject;
//	      } else {
//	        $scope.countrySelected9 = null;
//	      }
//	    }
//
//	    $scope.selectedCountry16 = {name: 'Russia'};
//
//	    $scope.inputChanged = function(str) {
//	      $scope.console10 = str;
//	    }
//
//	    $scope.focusState = 'None';
//	    $scope.focusIn = function() {
//	      var focusInputElem = document.getElementById('ex12_value');
//	      $scope.focusState = 'In';
//	      focusInputElem.classList.remove('small-input');
//	    }
//	    $scope.focusOut = function() {
//	      var focusInputElem = document.getElementById('ex12_value');
//	      $scope.focusState = 'Out';
//	      focusInputElem.classList.add('small-input');
//	    }
//
//	    /***
//	     * Send a broadcast to the directive in order to clear itself
//	     * if an id parameter is given only this ancucomplete is cleared
//	     * @param id
//	     */
//	    $scope.clearInput = function (id) {
//	      if (id) {
//	        $scope.$broadcast('angucomplete-alt:clearInput', id);
//	      }
//	      else{
//	        $scope.$broadcast('angucomplete-alt:clearInput');
//	      }
//	    }
//
//	    /***
//	     * Send a broadcast to the directive in order to change itself
//	     * if an id parameter is given only this ancucomplete is changed
//	     * @param id
//	     */
//	    $scope.changeInput = function (id) {
//	      if (id) {
//	        var pos = Math.floor(Math.random() * ($scope.countries.length - 1));
//	        $scope.$broadcast('angucomplete-alt:changeInput', id, $scope.countries[pos]);
//	      }
//	    }
//
//	    $scope.disableInput = true;
//
//	    $scope.requireExample8a = true;
//	    $scope.requireExample8b = true;
//		
				
		
	}]);