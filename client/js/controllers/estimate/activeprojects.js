angular
	.module("app")
	.controller("ActiveProjectsController",
							['$scope', '$q', 'crud', '$log',
							function($scope, $q, crud, $log) {
		$scope.customers = null;

    $q
		.all([
		    crud.getCustomers()
		])
		.then(function(data) {
			var customers = data[0];
			$scope.customers = customers;
		});

	}]);
