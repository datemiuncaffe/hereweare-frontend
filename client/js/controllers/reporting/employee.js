angular
	.module("app")
	.controller("EmployeeReportingController",
			['$scope', '$resource', '$state', '$compile', 'crud', '$q',
	    function($scope, $resource, $state, $compile, crud, $q) {
		$scope.employees = null;
		$scope.selectedEmployee = {};

		$q
		.all([
				crud.getActiveEmployees()
		])
		.then(
			function(data) {
				var employees = data[0];
				console.log('employees: ' +
					JSON.stringify(employees, null, '\t'));
				$scope.employees = employees;
				$scope.selectedEmployee = employees[0];
				$scope.search($scope.selectedEmployee);
			});

		$scope.onEmployeeChange = function(selectedEmployee) {
			console.log('selectedEmployee cognome: ' +
				selectedEmployee.cognomeDipendente);
			$scope.search(selectedEmployee);
		};

		$scope.search = function(selectedEmployee) {
			console.log('selectedEmployee: ' +
				JSON.stringify(selectedEmployee, null, '\t'));
			// if (selectedCustomer != null && selectedCustomer.id != null && selectedCustomer.id > 0) {
			// 	console.log('searching for selectedCustomer id = ' + selectedCustomer.id);
			//
			// 	// query ehour
			// 	crud.getProjectsByCustomerId({ customerId: selectedCustomer.id }).then(function(projects) {
			// 		console.log('projects: ' + JSON.stringify(projects));
			//
			// 		// sorting projects
			// 		projects.sort(function(a, b) {
			// 		  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
			// 		  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
			//
			// 			if (nameA < nameB) {
			// 		    return -1;
			// 		  }
			// 		  if (nameA > nameB) {
			// 		    return 1;
			// 		  }
			// 		  // names must be equal
			// 		  return 0;
			// 		});
			// 		console.log('sorted projects: ' + JSON.stringify(projects));
			//
			// 		// render the table
			// 		tabulate(projects,
			// 				["id", "name", "code", "customerId"]);
			// 	});
			// }
		};

		var table = d3.select("form[name=employeeReportForm] " +
									"div.search_results")
									.append("table")
									.attr("style", "width:1000px; table-layout:fixed;"),
				thead = table.append("thead"),
				tbody = table.append("tbody");

		// append the header row
		thead.append("tr")
				.selectAll("th")
				.data(["DATA DEL GIORNO", "CLIENTE",
							 "PROGETTO", "CODICE PROGETTO",
						 	 "DIPENDENTE", "RUOLO",
						 	 "COMMENTO", "ORE"])
				.enter()
				.append("th")
				.attr("style", "width:100px; word-wrap:break-word;")
				.text(function(column) {
					return column;
				});

		// The table generation function
		function tabulate(data, columns) {

			// create a row for each object in the data
			var rows = tbody.selectAll("tr")
					.data(data,	function(d) {
						return d.id;
					});

			// create a row for each object in the data
			var rowsEnter = rows.enter()
				.insert("tr");

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

			//addTableLinks();

		  return table;
		}

		// add dynamic link to single project page
		// function addTableLinks() {
		// 	var tablerows = angular.element(document).find("div.search_results table tbody tr");
		// 	console.log('tablerows is array = ' + tablerows instanceof Array);
		// 	console.log('tablerows = ' + tablerows);
		// 	var rowlinks = [];
		// 	tbody.selectAll("tr").each(function(d){
		// 		var link = "projectdetail({" +
		// 							 "customerId: " + $scope.selectedCustomer.id + "," +
		// 							 "customerName: '" + $scope.selectedCustomer.name + "'," +
		// 							 "projectId: " + d.id + "," +
		// 							 "projectName: '" + d.name + "'," +
		// 							 "projectCode: '" + d.code + "'" +
		// 							 "})";
		// 		rowlinks.push(link);
		// 	});
		// 	console.log('rowlinks = ' + JSON.stringify(rowlinks));
		// 	tablerows.each(function(index) {
		// 		var rowcells = $(this).find("td");
		// 		console.log('rowcells: ' + rowcells);
		// 		rowcells.each(function() {
		// 			var value = $(this).text();
		// 			console.log('value: ' + value);
		// 			var projectpageurl = '<a ui-sref="' + rowlinks[index] + '">' + value + '</a>';
		// 			console.log('projectpageurl: ' + projectpageurl);
		// 			var projectpagetemplate = angular.element(projectpageurl);
		// 			var projectpageFn = $compile(projectpagetemplate);
		// 			var projectpagelink = projectpageFn($scope);
		// 			$(this).empty();
		// 			$(this).append(projectpagelink);
		// 		});
		// 	});
		// }
		// end add dynamic link to single project page

		// $scope.getLinkUrl = function(){
		//   return $state.href('oremese', {someParam: $scope.selectedCustomer});
		// };
		//
		// $scope.redirectUrl = function(){
		// 	console.log('redirect...');
		// 	$state.go('projectcreate');
		// };

	}]);
