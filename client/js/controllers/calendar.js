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
	    	console.log('diff in months: ' + dayto.diff(dayfrom, 'months'));	    	
	    	
	    	if (dayfrom.isBefore(dayto)) {
	    		var totaldays = dayto.diff(dayfrom, 'days') + 1;
	    		console.log('totaldays: ' + totaldays);
	    		if (dayto.diff(dayfrom, 'months') === 0) {
	    			var budgettot = {
    	    			month: moment.months()[dayfrom.month()],
    	    			days: dayfrom.daysInMonth() - dayfrom.date() + 1,
    	    			amount: budgettot
    	    		};
	    			$scope.budgets.push(budgettot);
	    		} else if (dayto.diff(dayfrom, 'months') === 1) {
	    			var budgetFrom = {
    	    			month: moment.months()[dayfrom.month()],
    	    			days: dayfrom.daysInMonth() - dayfrom.date() + 1,
    	    			amount: budgettot * ((dayfrom.daysInMonth() - dayfrom.date() + 1)/totaldays)
    	    		};
	    			$scope.budgets.push(budgetFrom);
	    			
	    			var budgetTo = {
    	    			month: moment.months()[dayto.month()],
    	    			days: dayto.date(),
    	    			amount: budgettot * (dayto.date()/totaldays)
    	    		};	    			
	    			$scope.budgets.push(budgetTo);
	    			console.log('budgets: ' + JSON.stringify($scope.budgets));
	    		} else {
	    			var budgetFrom = {
    	    			month: moment.months()[dayfrom.month()],
    	    			days: dayfrom.daysInMonth() - dayfrom.date() + 1,
    	    			amount: budgettot * ((dayfrom.daysInMonth() - dayfrom.date() + 1)/totaldays)
    	    		};
	    			$scope.budgets.push(budgetFrom);
	    			
	    			for (var i = dayfrom.month() + 1; i < dayto.month(); i++) {
	    	    		var budget = {
	    	    			month: moment.months()[i],
	    	    			days: moment({month: i}).daysInMonth(),
	    	    			amount: budgettot * (moment({month: i}).daysInMonth()/totaldays)
	    	    		};
	    	    		$scope.budgets.push(budget);
	    	    	}
	    			
	    			var budgetTo = {
    	    			month: moment.months()[dayto.month()],
    	    			days: dayto.date(),
    	    			amount: budgettot * (dayto.date()/totaldays)
    	    		};	    			
	    			$scope.budgets.push(budgetTo);
	    		}	    		
	    	} else {
	    		throw 'data di inizio maggiore di quella finale';
	    	}
	    	
	    };
	});