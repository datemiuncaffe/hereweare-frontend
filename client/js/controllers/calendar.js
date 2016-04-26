angular
	.module("app")
	.controller("CalendarController", function($scope) {
	    $scope.day = moment();
	    $scope.isFrom = true;
	    $scope.isTo = false;
	    $scope.dayfrom = null;
	    $scope.dayto = null;
	    
	    $scope.budgettot = null;
	    
	    $scope.getFrom = function() {
	    	$scope.isFrom = true;
	    	$scope.isTo = false;
	    	console.log('isFrom: ' + $scope.isFrom + '; isTo: ' + $scope.isTo);
	    }
	    $scope.getTo = function() {
	    	$scope.isFrom = false;
	    	$scope.isTo = true;
	    	console.log('isFrom: ' + $scope.isFrom + '; isTo: ' + $scope.isTo);
	    }
	    
	    $scope.getBudgets = function(budgettot, dayfrom, dayto) {
	    	console.log('budgettot: ' + budgettot);
	    	console.log('dayfrom: ' + dayfrom);
	    	console.log('dayto: ' + dayto);
	    	
	    }
	});