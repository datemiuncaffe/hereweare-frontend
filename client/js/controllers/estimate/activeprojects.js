angular
	.module("app")
	.directive('onLastRepeat', function() {
		return function(scope, element, attrs) {
			if (scope.$last) {
				setTimeout(function() {
						scope.$emit('onRepeatLast', element, attrs);
				}, 1);
			}
		};
	})
	.controller("ActiveProjectsController",
							['$scope', '$q', 'crud', '$log',
							function($scope, $q, crud, $log) {
		$scope.customers = null;

    $q.all([
		  crud.getCustomers()
		])
		.then(function(data) {
			var customers = data[0];
			$scope.customers = customers;
		});

		$scope.$on('onRepeatLast', function(event, element, attrs){
			$(element).parent()
								.find("div.customer")
								.each(function() {
									var element = $(this);
									getActiveProjects(element);
								});
		});

		function getActiveProjects(element) {
			var idcustomer = element.attr("data-customer-id");
			console.log('customerId = ' + idcustomer);
			if (idcustomer != null && idcustomer > 0) {
				crud.getProjectsByCustomerId({ customerId: idcustomer, onlyActive: 'Y' }).then(function(activeprojects) {
					console.log('activeprojects: ' + JSON.stringify(activeprojects));

					activeprojects.forEach(function(activeproject){
						element.find("div.activeprojects").append("<span>" + activeproject.name + "</span>")
					});
				});
			}
		};

	}]);
