angular
	.module("app")
	.controller("CalendarController", function($scope) {
	    $scope.day = moment();
	    $scope.isFrom = true;
	    $scope.isTo = false;
	    $scope.dayfrom = null;
	    $scope.dayto = null;
	    
	    $scope.budgettot = null;
	    $scope.budgets = [];
	    
	    $scope.getFrom = function() {
	    	$scope.isFrom = true;
	    	$scope.isTo = false;
	    	console.log('isFrom: ' + $scope.isFrom + '; isTo: ' + $scope.isTo);
	    };
	    $scope.getTo = function() {
	    	$scope.isFrom = false;
	    	$scope.isTo = true;
	    	console.log('isFrom: ' + $scope.isFrom + '; isTo: ' + $scope.isTo);
	    };
	    
	    $scope.getBudgets = function(budgettot, dayfrom, dayto) {
	    	$scope.budgets = [];
	    	console.log('budgettot: ' + budgettot);
	    	console.log('dayfrom: ' + dayfrom);
	    	console.log('dayto: ' + dayto);
	    	console.log('dayfrom month: ' + dayfrom.month());
	    	console.log('dayto month: ' + dayto.month());
	    	for (var i = dayfrom.month(); i <= dayto.month(); i++) {
	    		console.log('month: ' + moment.months()[i]);
	    		console.log('date: ' + moment({month: i}).date());
	    		
	    		var budget = {
	    			month: moment.months()[i],
	    			days: ''
	    		};
	    		$scope.budgets.push(budget);
	    	}
	    };
	});