angular
	.module("app")
	.controller("EstimateController", ['$scope', '$resource', '$q', 'crud', function($scope, $resource, $q, crud) {
	    $scope.day = moment();
	    $scope.isFrom = true;
	    $scope.isTo = false;
	    console.log('$scope.day: ' + $scope.day.format());

	    $scope.selectedCustomer = {
	    	projects: []
	    };

	    $scope.onCustomerChange = function(selectedCustomer) {
	    	console.log('selectedCustomer.projects: ' + selectedCustomer.projects);

				  		
	    };

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

	    $scope.getBudgets = function(budgettot, daystot, selectedfrom, selectedto) {
	    	$scope.selectedProject.budgets = [];
	    	var from = moment(selectedfrom, "D MMM YYYY");
	    	var to = moment(selectedto, "DD MMM YYYY");
	    	if (budgettot == null) {
	    		throw 'ERR: il budget totale non è stato inserito';
	    	}
	    	if (daystot == null) {
	    		throw 'ERR: i giorni totali non sono stati inseriti';
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
    	    			days: daystot,
    	    			amount: budgettot
    	    		};
	    			$scope.selectedProject.budgets.push(budgettot);
	    		} else if (to.diff(from, 'months') === 1) {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: parseFloat((daystot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2))
    	    		};
	    			$scope.selectedProject.budgets.push(budgetFrom);

	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
		    			to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: parseFloat((daystot * (to.date()/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * (to.date()/totaldays)).toFixed(2))
    	    		};
	    			$scope.selectedProject.budgets.push(budgetTo);
	    			console.log('budgets: ' + JSON.stringify($scope.selectedProject.budgets));
	    		} else {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: parseFloat((daystot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2))
    	    		};
	    			$scope.selectedProject.budgets.push(budgetFrom);

	    			for (var i = from.month() + 1; i < to.month(); i++) {
	    	    		var budget = {
	    	    			from: moment({month: i}).date() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    			    	to: moment({month: i}).daysInMonth() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    	    			month: moment.months()[i],
	    	    			days: parseFloat((daystot * (moment({month: i}).daysInMonth()/totaldays)).toFixed(2)),
	    	    			amount: parseFloat((budgettot * (moment({month: i}).daysInMonth()/totaldays)).toFixed(2))
	    	    		};
	    	    		$scope.selectedProject.budgets.push(budget);
	    	    	}

	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
			    		to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: parseFloat((daystot * (to.date()/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * (to.date()/totaldays)).toFixed(2))
    	    		};
	    			$scope.selectedProject.budgets.push(budgetTo);
	    		}
	    		for (var i in $scope.selectedProject.budgets) {
	    			console.log('budget amount: ' + $scope.selectedProject.budgets[i].amount + '; type: ' + typeof $scope.selectedProject.budgets[i].amount);
	    		}

	    	} else {
	    		throw 'data di inizio maggiore di quella finale';
	    	}
	    };

	    $scope.customers = null;
	    $scope.selectedCustomer = null;
	    $scope.selectedProject = null;

		$q
		.all([
		    crud.getCustomers()
		])
		.then(
			function(data) {
				console.log('data: ' + JSON.stringify(data));
				var customers = data[0];
				console.log('customers: ' + JSON.stringify(customers));
				$scope.customers = customers;
				$scope.selectedCustomer = customers[0];
				$scope.selectedProject = $scope.selectedCustomer.projects[0];
			});

		$scope.save = function() {
			console.log('current project: ' + JSON.stringify($scope.selectedProject));
			console.log('current project id: ' + JSON.stringify($scope.selectedProject.id));

			$q.all([
			    crud.updateProject($scope.selectedProject.id, $scope.selectedProject)
			])
			.then(function(response) {
				console.log('response: ' + response);
			});
		};

		$scope.saveBudgets = function() {
			console.log('project id: ' + JSON.stringify($scope.selectedProject.id));
			console.log('budgets: ' + JSON.stringify($scope.selectedProject.budgets));

			$q.all([
			    crud.updateBudgets({projectId: $scope.selectedProject.id, budgets: $scope.selectedProject.budgets})
			])
			.then(function(response) {
				console.log('response: ' + response);
			});
		};

	}]);
