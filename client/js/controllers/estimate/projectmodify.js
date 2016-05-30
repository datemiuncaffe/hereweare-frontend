angular
	.module("app")
	.controller("ProjectModifyController", ['$scope', '$resource', '$q', '$stateParams', 'crud', function($scope, $resource, $q, $stateParams, crud) {
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
	    	daystot: null,
	    	customerId: null,
	    	budgets: []
	    };	    
	    /* end entities */
	    
	    /* loading project */
	    if ($stateParams != null && 
	    	$stateParams.code != null && $stateParams.code.length > 0 &&
	    	$stateParams.customerName != null && $stateParams.customerName.length > 0) {
	    	console.log('Project code: ' + $stateParams.code);
	    	var queryUrl = 'http://localhost:3000/api/projects?filter[include]=budgets&filter[include]=costs&filter[where][code]=' + $stateParams.code;
	    	var projectRes = $resource(queryUrl, null, {'query':  {method:'GET', isArray:true}});
	    	projectRes.query().$promise.then(function(data) {
				console.log('project: ' + JSON.stringify(data[0]));
				
				$scope.customer.name = $stateParams.customerName;
				$scope.project = data[0];
							
			});
	    }
	    /* end loading project */
	    
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
	    	$scope.project.budgets = [];
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
	    			$scope.project.budgets.push(budgettot);
	    		} else if (to.diff(from, 'months') === 1) {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: parseFloat((daystot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2))
    	    		};
	    			$scope.project.budgets.push(budgetFrom);
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
		    			to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: parseFloat((daystot * (to.date()/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * (to.date()/totaldays)).toFixed(2))
    	    		};	    			
	    			$scope.project.budgets.push(budgetTo);
	    			console.log('budgets: ' + JSON.stringify($scope.project.budgets));
	    		} else {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: parseFloat((daystot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2)),
    	    			amount: parseFloat((budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)).toFixed(2))
    	    		};
	    			$scope.project.budgets.push(budgetFrom);
	    			
	    			for (var i = from.month() + 1; i < to.month(); i++) {
	    	    		var budget = {
	    	    			from: moment({month: i}).date() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    			    	to: moment({month: i}).daysInMonth() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    	    			month: moment.months()[i],
	    	    			days: parseFloat((daystot * (moment({month: i}).daysInMonth()/totaldays)).toFixed(2)),
	    	    			amount: parseFloat((budgettot * (moment({month: i}).daysInMonth()/totaldays)).toFixed(2))
	    	    		};
	    	    		$scope.project.budgets.push(budget);
	    	    	}
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
			    		to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: parseFloat((daystot * (to.date()/totaldays)).toFixed(2)),
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
	    
	    var savecustomer = $resource('http://localhost:3000/api/customers', null, {'save': {method:'POST'}});
	    var saveproject = $resource('http://localhost:3000/api/projects', null, {'save': {method:'POST'}});
	    var savebudget = $resource('http://localhost:3000/api/budgets', null, {'save': {method:'POST', isArray:true}});
	    	    
	    $scope.save = function() {
			console.log('saving customer: ' + JSON.stringify($scope.customer));
			console.log('saving project: ' + JSON.stringify($scope.project));			
			
			if ($scope.customer.name != null) {
				savecustomer.save($scope.customer).$promise.then(function(savedcustomer) {
					console.log('savedcustomer: ' + JSON.stringify(savedcustomer));
					if (savedcustomer.id != null) {
						$scope.project.customerId = savedcustomer.id;
						saveproject.save($scope.project).$promise.then(function(savedproject) {
							console.log('savedproject: ' + JSON.stringify(savedproject));
							if (savedproject.id != null) {
								for (var i = 0; i < $scope.project.budgets.length; i++) {
									$scope.project.budgets[i].projectId = savedproject.id;									
								}
								savebudget.save($scope.project.budgets).$promise.then(function(savedbudgets) {
									console.log('savedbudgets: ' + JSON.stringify(savedbudgets));
								});
							}
						});
					}
				});
			}			
		};
			    
	}]);