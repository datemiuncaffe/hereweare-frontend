angular
	.module("app")
	.controller("CalendarController", ['$scope', '$resource', '$q', function($scope, $resource, $q) {
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
	    	if (budgettot == null) {
	    		throw 'ERR: il budget totale non è stato inserito';
	    	}
	    	if (dayfrom == null) {
	    		throw 'ERR: inserire la data iniziale';
	    	}
	    	if (dayto == null) {
	    		throw 'ERR: inserire la data finale';
	    	}
	    	
	    	console.log('budgettot: ' + budgettot);
	    	console.log('diff in months: ' + dayto.diff(dayfrom, 'months'));	    	
	    	
	    	if (dayfrom.isBefore(dayto)) {
	    		var totaldays = dayto.diff(dayfrom, 'days') + 1;
	    		console.log('totaldays: ' + totaldays);
	    		if (dayto.diff(dayfrom, 'months') === 0) {
	    			var budgettot = {
	    				from: dayfrom.date() + ' ' + moment.months()[dayfrom.month()] + ' ' + dayfrom.year(),
	    				to: dayfrom.daysInMonth() + ' ' + moment.months()[dayfrom.month()] + ' ' + dayfrom.year(),
    	    			month: moment.months()[dayfrom.month()],
    	    			days: dayfrom.daysInMonth() - dayfrom.date() + 1,
    	    			amount: budgettot
    	    		};
	    			$scope.budgets.push(budgettot);
	    		} else if (dayto.diff(dayfrom, 'months') === 1) {
	    			var budgetFrom = {
	    				from: dayfrom.date() + ' ' + moment.months()[dayfrom.month()] + ' ' + dayfrom.year(),
		    			to: dayfrom.daysInMonth() + ' ' + moment.months()[dayfrom.month()] + ' ' + dayfrom.year(),
    	    			month: moment.months()[dayfrom.month()],
    	    			days: dayfrom.daysInMonth() - dayfrom.date() + 1,
    	    			amount: budgettot * ((dayfrom.daysInMonth() - dayfrom.date() + 1)/totaldays)
    	    		};
	    			$scope.budgets.push(budgetFrom);
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[dayto.month()] + ' ' + dayto.year(),
		    			to: dayto.date() + ' ' + moment.months()[dayto.month()] + ' ' + dayto.year(),
    	    			month: moment.months()[dayto.month()],
    	    			days: dayto.date(),
    	    			amount: budgettot * (dayto.date()/totaldays)
    	    		};	    			
	    			$scope.budgets.push(budgetTo);
	    			console.log('budgets: ' + JSON.stringify($scope.budgets));
	    		} else {
	    			var budgetFrom = {
	    				from: dayfrom.date() + ' ' + moment.months()[dayfrom.month()] + ' ' + dayfrom.year(),
		    			to: dayfrom.daysInMonth() + ' ' + moment.months()[dayfrom.month()] + ' ' + dayfrom.year(),
    	    			month: moment.months()[dayfrom.month()],
    	    			days: dayfrom.daysInMonth() - dayfrom.date() + 1,
    	    			amount: budgettot * ((dayfrom.daysInMonth() - dayfrom.date() + 1)/totaldays)
    	    		};
	    			$scope.budgets.push(budgetFrom);
	    			
	    			for (var i = dayfrom.month() + 1; i < dayto.month(); i++) {
	    	    		var budget = {
	    	    			from: moment({month: i}).date() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    			    	to: moment({month: i}).daysInMonth() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    	    			month: moment.months()[i],
	    	    			days: moment({month: i}).daysInMonth(),
	    	    			amount: budgettot * (moment({month: i}).daysInMonth()/totaldays)
	    	    		};
	    	    		$scope.budgets.push(budget);
	    	    	}
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[dayto.month()] + ' ' + dayto.year(),
			    		to: dayto.date() + ' ' + moment.months()[dayto.month()] + ' ' + dayto.year(),
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
	    
	    var projectsRes = $resource('http://localhost:3000/api/projects?filter[include]=budgets', null, {'query':  {method:'GET', isArray:true}});
	    $scope.projects = null;
		$scope.selectedProject = null;
		
		$q
		.all([
		    projectsRes.query().$promise
		])
		.then(
			function(data) {
				console.log('data: ' + JSON.stringify(data));
				var projects = data[0];
				console.log('projects: ' + JSON.stringify(projects));
				$scope.projects = projects;
				$scope.selectedProject = projects[0];				
			});
	    
	}]);