angular
	.module('app')
	.controller('CostiController', ['$scope', '$resource', '$q', function($scope, $resource, $q) {
		console.log('inside CostiController...');
	
		var customers = [];
		$scope.isCustomerDisabled = false;
		$scope.isProjectDisabled = false;
	
		var estimates = $resource('http://localhost:3000/api/customers?filter[include][projects]=budgets', null, {'query':  {method:'GET', isArray:true}});
		
		$q
		.all([
		    estimates.query().$promise
		])
		.then(
			function(data) {
				console.log('data: ' + JSON.stringify(data));
				
				var customers = data[0];
				$scope.customers = customers;
				$scope.selectedCustomer = customers[0];
				console.log('customers: ' + JSON.stringify(customers));
				
				
			
//				var selectedShopIndex = coffeeShops
//						.map(
//								function(
//										coffeeShop) {
//									return coffeeShop.id;
//								})
//						.indexOf(
//								$scope.review.coffeeShopId);
//				$scope.selectedShop = coffeeShops[selectedShopIndex];
			});
	
		$scope.onCustomerChange = function(customer) {
			console.log('customer: ' + JSON.stringify(customer));
			var projects = customer.projects;
			$scope.projects = projects;
			$scope.selectedProject = projects[0];
		};
		
		// function getTodos() {
		// console.log('getTodos');
		// Todo
		// .find()
		// .$promise
		// .then(function(results) {
		// $scope.todos = results;
		// });
		// }
		// getTodos();
		
		$scope.save = function() {
			
			console.log('current customer: ' + JSON.stringify($scope.selectedCustomer));
			
			var estimatesSave = $resource('http://localhost:3000/api/customers?filter[include][projects]=budgets', null, {'save': {method:'POST'}});
			
			$q.all([
			    estimatesSave.save($scope.selectedCustomer).$promise
			])
			.then(function(response) {
					console.log('response: ' + response);
			});
		};
	
		//    $scope.removeTodo = function(item) {
		//      Todo
		//        .deleteById(item)
		//        .$promise
		//        .then(function() {
		//          getTodos();
		//        });
		//    };
	} ]);