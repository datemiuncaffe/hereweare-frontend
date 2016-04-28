angular
	.module("app")
	.controller("CalendarController", ['$scope', '$resource', '$q', function($scope, $resource, $q) {
	    $scope.day = moment();
	    $scope.isFrom = true;
	    $scope.isTo = false;
	    
	    $scope.selectedProject = {
	    	from: null,
	    	to: null,
	    	budgettot: null,
	    	budgets: []
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
	    
	    $scope.getBudgets = function(budgettot, from, to) {
	    	$scope.selectedProject.budgets = [];
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
	    			$scope.selectedProject.budgets.push(budgettot);
	    		} else if (to.diff(from, 'months') === 1) {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: from.daysInMonth() - from.date() + 1,
    	    			amount: budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)
    	    		};
	    			$scope.selectedProject.budgets.push(budgetFrom);
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
		    			to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: to.date(),
    	    			amount: budgettot * (to.date()/totaldays)
    	    		};	    			
	    			$scope.selectedProject.budgets.push(budgetTo);
	    			console.log('budgets: ' + JSON.stringify($scope.selectedProject.budgets));
	    		} else {
	    			var budgetFrom = {
	    				from: from.date() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
		    			to: from.daysInMonth() + ' ' + moment.months()[from.month()] + ' ' + from.year(),
    	    			month: moment.months()[from.month()],
    	    			days: from.daysInMonth() - from.date() + 1,
    	    			amount: budgettot * ((from.daysInMonth() - from.date() + 1)/totaldays)
    	    		};
	    			$scope.selectedProject.budgets.push(budgetFrom);
	    			
	    			for (var i = from.month() + 1; i < to.month(); i++) {
	    	    		var budget = {
	    	    			from: moment({month: i}).date() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    			    	to: moment({month: i}).daysInMonth() + ' ' + moment.months()[i] + ' ' + moment({month: i}).year(),
	    	    			month: moment.months()[i],
	    	    			days: moment({month: i}).daysInMonth(),
	    	    			amount: budgettot * (moment({month: i}).daysInMonth()/totaldays)
	    	    		};
	    	    		$scope.selectedProject.budgets.push(budget);
	    	    	}
	    			
	    			var budgetTo = {
	    				from: '1 ' + moment.months()[to.month()] + ' ' + to.year(),
			    		to: to.date() + ' ' + moment.months()[to.month()] + ' ' + to.year(),
    	    			month: moment.months()[to.month()],
    	    			days: to.date(),
    	    			amount: budgettot * (to.date()/totaldays)
    	    		};	    			
	    			$scope.selectedProject.budgets.push(budgetTo);
	    		}	    		
	    	} else {
	    		throw 'data di inizio maggiore di quella finale';
	    	}	    	
	    };
	    
	    var getRes = $resource('http://localhost:3000/api/projects?filter[include]=budgets', null, {'query':  {method:'GET', isArray:true}});
	    $scope.projects = null;
		$scope.selectedProject = null;
		
		$q
		.all([
		    getRes.query().$promise
		])
		.then(
			function(data) {
				console.log('data: ' + JSON.stringify(data));
				var projects = data[0];
				console.log('projects: ' + JSON.stringify(projects));
				$scope.projects = projects;
				$scope.selectedProject = projects[0];				
			});		
		
		var resources = {
			updateProject: 	$resource('http://localhost:3000/api/projects/:id', null, {'update': {method:'PUT'}}),
			updateBudgets:	$resource('http://localhost:3000/api/budgets/updateAllByProjectId', null, {'update': {method:'PUT'}})
		};
		
		$scope.save = function() {
			console.log('current project: ' + JSON.stringify($scope.selectedProject));
			console.log('current project id: ' + JSON.stringify($scope.selectedProject.id));			
			
			$q.all([
			    resources.updateProject.update({ id: $scope.selectedProject.id }, $scope.selectedProject).$promise
			])
			.then(function(response) {
				console.log('response: ' + response);
			});
		};
		
		$scope.saveBudgets = function() {
			console.log('project id: ' + JSON.stringify($scope.selectedProject.id));
			console.log('budgets: ' + JSON.stringify($scope.selectedProject.budgets));
			
			$q.all([
			    resources.updateBudgets.update({projectId: $scope.selectedProject.id, budgets: $scope.selectedProject.budgets}).$promise
			])
			.then(function(response) {
				console.log('response: ' + response);
			});
		};
	    
	}]);