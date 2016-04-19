angular
	.module('app')
	.controller('CostiController', ['$scope', '$resource', '$q', function($scope, $resource, $q) {
		console.log('inside CostiController...');
	
		$scope.estimateCost = {};
		$scope.isDisabled = false;
	
		var customers_resource = $resource('http://localhost:3000/api/Customers', null, {'query':  {method:'GET', isArray:true}});
		var projects_resource = $resource('http://localhost:3000/api/Projects', null, {'query':  {method:'GET', isArray:true}});
	
		$q
		.all([
		    customers_resource.query().$promise,
		    projects_resource.query().$promise
		])
		.then(
			function(data) {
				console.log('data: ' + JSON.stringify(data));
				var customer = data[0][0];
				var projects = data[1];				
				
				$scope.projects = projects;
				$scope.selectedProject = projects[0];
				console.log('projects: ' + projects);
			
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
	
		$scope.addProject = function() {
			console.log('add project button...');
//			$scope.review.coffeeShopId = $scope.selectedShop.id;
//			$scope.review.$save().then(function(review) {
//				$state.go('all-reviews');
//			});
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
		//
		// $scope.addTodo = function() {
		// Todo
		// .create($scope.newTodo)
		// .$promise
		// .then(function(todo) {
		//          $scope.newTodo = '';
		//          $scope.todoForm.content.$setPristine();
		//          $('.focus').focus();
		//          getTodos();
		//        });
		//    };
	
		//    $scope.removeTodo = function(item) {
		//      Todo
		//        .deleteById(item)
		//        .$promise
		//        .then(function() {
		//          getTodos();
		//        });
		//    };
	} ]);