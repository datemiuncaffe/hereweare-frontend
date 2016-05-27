angular
	.module("app")
	.controller("ProjectDetailController", ['$scope', '$window', '$log', '$resource', '$q', '$stateParams', 'crud', 
	                                        function($scope, $window, $log, $resource, $q, $stateParams, crud) {
	    $scope.day = moment();
	    $scope.isFrom = true;
	    $scope.isTo = false;
	    console.log('$scope.day: ' + $scope.day.format());
	    
	    /* entities */	    
	    $scope.customer = {
	    	name: null
	    };
	    
	    $scope.project = {
	    	name: null,
	    	code: null,
	    	from: null,
	    	to: null,
	    	budgettot: null,
	    	customerId: null,
	    	budgets: []
	    };	    
	    /* end entities */
	    
	    /* loading state parameters */
	    if ($stateParams != null && $stateParams.name != null && $stateParams.name.length > 0) {
	    	console.log('name parameter: ' + $stateParams.name);
	    	$scope.project.name = $stateParams.name;
	    }
	    /* end loading state parameters */
	    
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
	    
	    $scope.getBudgets = function(budgettot, selectedfrom, selectedto) {
	    	$scope.project.budgets = [];
	    	var from = moment(selectedfrom, "D MMM YYYY");
	    	var to = moment(selectedto, "DD MMM YYYY");
	    	if (budgettot == null) {
	    		throw 'ERR: il budget totale non è stato inserito';
	    	}
	    	if (from == null) {
	    		throw 'ERR: inserire la data iniziale';
	    	}
	    	if (to == null) {
	    		throw 'ERR: inserire la data finale';
	    	}
	    	
	    	console.log('budgettot: ' + budgettot);
	    	console.log('diff in months: ' + to.diff(from, 'months'));	    	
	    	
	    	if (from.isBefore(to)) {
	    		var totaldays = to.diff(from, 'days') + 1;
	    		console.log('totaldays: ' + totaldays);
	    		if (to.diff(from, 'months') === 0) {
	    			var budgettot = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
	    				to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: from.daysInMonth() - from.date() + 1,
    	    			amount: budgettot
    	    		};
	    			$scope.project.budgets.push(budgettot);
	    		} else if (to.diff(from, 'months') === 1) {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: from.daysInMonth() - from.date() + 1,
    	    			amount: parseFloat((budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2))
    	    		};
	    			$scope.project.budgets.push(budgetFrom);
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
		    			to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: to.date(),
    	    			amount: parseFloat((budgettot * (to.date()/totaldays)).toFixed(2))
    	    		};	    			
	    			$scope.project.budgets.push(budgetTo);
	    			console.log('budgets: ' + JSON.stringify($scope.project.budgets));
	    		} else {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: from.daysInMonth() - from.date() + 1,
    	    			amount: parseFloat((budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2))
    	    		};
	    			$scope.project.budgets.push(budgetFrom);
	    			
	    			for (var i = from.month() + 1; i < to.month(); i++) {
	    	    		var budget = {
	    	    			from: moment({month: i}).date() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    			    	to: moment({month: i}).daysInMonth() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    	    			month: moment.months()[i],
	    	    			days: moment({month: i}).daysInMonth(),
	    	    			amount: parseFloat((budgettot * (moment({month: i}).daysInMonth()/totaldays)).toFixed(2))
	    	    		};
	    	    		$scope.project.budgets.push(budget);
	    	    	}
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
			    		to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: to.date(),
    	    			amount: parseFloat((budgettot * (to.date()/totaldays)).toFixed(2))
    	    		};	    			
	    			$scope.project.budgets.push(budgetTo);
	    		}
	    		for (var i in $scope.project.budgets) {
	    			console.log('budget amount: ' + $scope.project.budgets[i].amount + '; type: ' + typeof $scope.project.budgets[i].amount);
	    		}	    		
	    		
	    	} else {
	    		throw 'data di inizio maggiore di quella finale';
	    	}	    	
	    };
	    	    
	    $scope.modify = function() {
			console.log('current customer: ' + JSON.stringify($scope.customer));
			console.log('current project: ' + JSON.stringify($scope.project));			
			
			console.log('changing state...');
			
			var url = 'http://' + $window.location.host + '/#/projectmodify?name=' + $scope.project.name;
	        $log.log(url);
	        $window.location.href = url;			
		};
			    
	}]);