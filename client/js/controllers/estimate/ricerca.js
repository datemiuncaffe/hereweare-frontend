angular
	.module("app")
	.controller("RicercaController", ['$scope', '$resource', '$state', '$compile', 'resourceBaseUrl', 'crud', '$q',
	                                  function($scope, $resource, $state, $compile, resourceBaseUrl, crud, $q) {
		$scope.customers = null;
		$scope.selectedCustomer = {
			projects: []
		};

		$q
		.all([
				crud.getCustomersAndProjects()
		])
		.then(
			function(data) {
//				console.log('data: ' + JSON.stringify(data));
				var customers = data[0];
//				console.log('customers: ' + JSON.stringify(customers));
				$scope.customers = customers;
				$scope.selectedCustomer = customers[0];
				$scope.search($scope.selectedCustomer);
			});

		$scope.onCustomerChange = function(selectedCustomer) {
			console.log('selectedCustomer name: ' + selectedCustomer.name);
			$scope.search(selectedCustomer);
		};

		$scope.appendName = function(str) {
			return {name: str};
		};

		var projectsRes = $resource('http://' + resourceBaseUrl + '/api/customers/:id?filter[include]=projects', null, {'query':  {method:'GET'}});

		$scope.search = function(selectedCustomer) {
			console.log('selectedCustomer: ' + JSON.stringify(selectedCustomer, null, '\t'));
			if (selectedCustomer != null && selectedCustomer.id != null && selectedCustomer.id > 0) {
				console.log('searching for selectedCustomer id = ' + selectedCustomer.id);
				projectsRes.query({ id: selectedCustomer.id }).$promise.then(function(data) {
					console.log('data: ' + JSON.stringify(data));
					// render the table
					tabulate(data.projects,
							["name", "code", "budgettot", "from", "to"]);
				});
			}
		};

		var table = d3.select("div.search_results")
									.append("table")
									.attr("style", "width:1000px; table-layout:fixed;"),
				thead = table.append("thead"),
				tbody = table.append("tbody");

		// append the header row
		thead.append("tr")
				.selectAll("th")
				.data(["NOME PROGETTO", "CODICE PROGETTO", "BUDGET COMPLESSIVO", "DATA DI INIZIO", "DATA DI FINE"])
				.enter()
				.append("th")
				.attr("style", "width:100px; word-wrap:break-word;")
				.text(function(column) { return column; });

		// The table generation function
		function tabulate(data, columns) {

			// create a row for each object in the data
			var rows = tbody.selectAll("tr").data(data,
					function(d) {
						return d.id;
					});

			// create a row for each object in the data
			var rowsEnter = rows.enter()
				.insert("tr");
//			.append("tr");

			// create a cell in each row for each column
			var cells = rowsEnter.selectAll("td")
			    .data(function(row) {
			        return columns.map(function(column) {
			            return {column: column, value: row[column]};
			        });
			    })
			    .enter()
			    .append("td")
			    .attr("style", "width:100px; word-wrap:break-word;") // sets the font style
				.html(function(d) { return d.value });

			var rowsExit = rows.exit().remove();

			addTableLinks();

		  return table;
		}

		function addTableLinks() {
			// add dynamic link to single project page
			var tablerows = angular.element(document).find("div.search_results table tbody tr");
			tablerows.each(function() {
				var params = {
					name: null,
					code: null,
					budgettot: null
				};
				var rowcells = $(this).find("td");

				rowcells.each(function(index) {
					console.log( index + ": " + $( this ).text() );
					if (index == 0) {
						params.name = $( this ).text();
					} else if (index == 1) {
						params.code = $( this ).text();
					} else if (index == 2) {
						params.budgettot = $( this ).text();
					}
				});

				console.log('params: ' + JSON.stringify(params));

				rowcells.each(function() {
					var value = $(this).text();
					// build url to single project page
//					var projectpageurl = '<a ui-sref="projectdetail({customer: \'' + encodeURI(JSON.stringify($scope.selectedCustomer.originalObject)) + '\', code: \'' + params.code + '\'})">' + value + '</a>';
					var projectpageurl = '<a ui-sref="projectdetail({customerId: \'' + $scope.selectedCustomer.id +
															'\', customerName: \'' + $scope.selectedCustomer.name +
															'\', code: \'' + params.code + '\'})">' + value + '</a>';
					console.log('projectpageurl: ' + projectpageurl);
					var projectpagetemplate = angular.element(projectpageurl);
					var projectpageFn = $compile(projectpagetemplate);
					var projectpagelink = projectpageFn($scope);
					// end build url to single project page
					$(this).empty();
					$(this).append(projectpagelink);
				});
			});
			// end add dynamic link to single project page
		}

		$scope.getLinkUrl = function(){
		  return $state.href('oremese', {someParam: $scope.selectedCustomer});
		};

		$scope.redirectUrl = function(){
			console.log('redirect...');
			$state.go('projectcreate');
		};

		$scope.$watch("selectedCustomer", function(newValue, oldValue) {
			console.log("selectedCustomer: " + JSON.stringify(oldValue, null, '\t'));
			if (newValue != null && newValue != oldValue) {
				console.log("newValue: " + JSON.stringify(newValue, null, '\t'));
				$scope.search(newValue.originalObject);
			}
		});

	}]);
