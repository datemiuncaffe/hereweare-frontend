angular
	.module('app')
	.controller('BudgetController', ['$scope', '$resource', '$q', function($scope, $resource, $q) {
		console.log('inside BudgetController...');
	
		$scope.budget = {
			month: 'GEN',
			amount: 6000,
			type: 'Y'
		};
			
		var budgetRes = $resource('http://localhost:3000/api/budgets/:id', null, {'update': {method:'PUT'}});
		
		$scope.getBudget = function() {
			$q.all([
			    budgetRes.get({ id: 2 }).$promise
			])
			.then(function(data) {
				console.log('current budget: ' + JSON.stringify(data));
				$scope.budget = data[0];
			});			
		};
		
		
		$scope.saveBudget = function() {
			console.log('current budget: ' + JSON.stringify($scope.budget));
			console.log('current budget id: ' + JSON.stringify($scope.budget.id));
			
			$q.all([
			    budgetRes.update({ id: $scope.budget.id }, $scope.budget).$promise
			])
			.then(function(response) {
					console.log('response: ' + response);
			});
		};
		
		$scope.createBudget = function() {
			console.log('current budget: ' + JSON.stringify($scope.budget));
			console.log('current budget id: ' + JSON.stringify($scope.budget.id));
			
			$q.all([
			    budgetRes.save($scope.budget).$promise
			])
			.then(function(response) {
					console.log('response: ' + response);
			});
		};
	} ]);