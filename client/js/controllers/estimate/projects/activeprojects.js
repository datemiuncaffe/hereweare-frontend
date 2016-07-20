angular
	.module("app")
	.controller("ActiveProjectsController",
							['$rootScope', '$scope', '$q', 'crud', 'hwtables',
							function($rootScope, $scope, $q, crud, hwtables) {
		$scope.customers = null;
		$scope.sectionId = "activeprojects";
		$scope.projectsContainer = "div.activeprojects";
		hwtables.sectionId = $scope.sectionId;
		hwtables.projectsContainer = $scope.projectsContainer;

    $q.all([
		  crud.getCustomers({customerGroup: 'EXT'})
		])
		.then(function(data) {
			if (data[0].length > 0) {
				hwtables.insertGeneralFilters($scope.sectionId, $scope.projectsContainer);
				var customers = data[0];
				$scope.customers = customers;
			}
		});

		$scope.$on('onRepeatLast', function(event, element, attrs){
			$(element).parent()
								.find("div.customer")
								.each(function(index) {
									var element = $(this);
									var customerId = $(this).attr("data-customer-id");
									console.log('customerId = ' + customerId);
									// if (customerId == '19' || customerId == '16') {
									// 	getActiveProjectsByCustomerId(customerId, element, showData);
									// }
									// setTimeout(function() {
					        //   getActiveProjectsByCustomerId(customerId, element, showData);
					        // }, index * 1500);
									setTimeout(function() {
										// console.log('processing customerId: ' + customerId);
										getActiveProjectsByCustomerId(customerId, element, showData);
					        }, index * 500);
								});
		});

		function getActiveProjectsByCustomerId(id, element, cb) {
			if (id != null && id > 0) {
				crud.getBudgetsCostsByCustomerId({ customerId: id, onlyActive: 'Y' })
						.then(function(datatable) {
					console.log('datatable: ' + JSON.stringify(datatable));
					element.find($scope.projectsContainer).attr("data-datatable", JSON.stringify(datatable));
					cb(id, element, datatable);
				});
			}
		};

		function showData(id, element, datatable) {
			var table = hwtables.insertTable($scope.sectionId, id, element, $scope.projectsContainer);
			// render the table
			hwtables.tabulate(id, table, datatable,
					['projectname', 'projectcode', 'year', 'month', 'budgetdays', 'costdays', 'costhours']);
		};

	}]);
