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
									var customerId = $(this).attr("data-customer-id");
									console.log('customerId = ' + customerId);
									// if (customerId == '19') {
									// 	getActiveProjectsByCustomerId(customerId, element, tabulate);
									// }
									getActiveProjectsByCustomerId(customerId, element, tabulate);
								});
		});

		function getActiveProjectsByCustomerId(id, element, cb) {
			if (id != null && id > 0) {
				crud.getProjectsByCustomerId({ customerId: id, onlyActive: 'Y' }).then(function(activeprojects) {
					console.log('activeprojects: ' + JSON.stringify(activeprojects));
					var activeprojectspromises = [];
					activeprojects.forEach(function(activeproject){
						activeprojectspromises.push(crud.getBudgets({id:activeproject.id})
								.then(function(res){
									console.log('success res: ' + JSON.stringify(res, null, '\t'));
									return res;
								}, function(error){
									var res = {
										status: error.status,
										statusText: error.statusText
									}
									console.log('error: ' + JSON.stringify(res, null, '\t'));
									return res;
								}));
						activeprojectspromises.push(crud.getCosts({projectId:activeproject.id})
								.then(function(res){
									console.log('success res: ' + JSON.stringify(res, null, '\t'));
									return res;
								}, function(res){
									var res = {
										status: error.status,
										statusText: error.statusText
									}
									console.log('error: ' + JSON.stringify(res, null, '\t'));
									return res;
								}));
					});

					$q.all(activeprojectspromises)
						.then(function(data) {
							console.log('activeprojects: ' + JSON.stringify(activeprojects, null, '\t'));
							console.log('data: ' + JSON.stringify(data, null, '\t'));
							var activeprojectsdata = [];
							activeprojects.forEach(function(activeproject, index){
								if (data[index] != null && data[index].budgets != null) {
									activeproject.budgets = data[index].budgets;
								}
								if (data[index + 1] != null) {
									activeproject.costs = data[index + 1];
								}
								activeprojectsdata.push(activeproject);
							});
							// showData(data);
							cb(element, activeprojectsdata);
						}, function(error){
							console.log('error: ' + JSON.stringify(error, null, '\t'));
						});

				});
			}
		};

		function tabulate(element, data) {
			console.log('callback2 called with data: ' + JSON.stringify(data, null, '\t'));
			data.forEach(function(activeproject){
				element.find("div.activeprojects").append("<span>" + activeproject.name + "</span>");
			});
		};

	}]);
