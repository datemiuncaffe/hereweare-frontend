angular
	.module("app")
	.controller("EmployeeReportingController",
			['$scope', '$resource', '$state', '$compile', 'crud', '$q',
	    function($scope, $resource, $state, $compile, crud, $q) {
		$scope.employees = null;
		$scope.selectedEmployee = {};

		$q
		.all([
				crud.getActiveUsers()
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

			if (selectedEmployee != null &&
					selectedEmployee.cognomeDipendente != null &&
					selectedEmployee.cognomeDipendente.length > 0) {
				console.log('searching for employee ' +
										selectedEmployee.cognomeDipendente);

				// query ehour
				crud.getReportsByUserNameAndDateInterval({
							lastName: selectedEmployee.cognomeDipendente
						}).then(function(report) {
					console.log('report: ' + JSON.stringify(report));

					// render the table
					tabulate(report,
							["data", "cliente", "progetto", "codiceProgetto",
							 "dipendente", "ruolo", "commento", "ore"]);
				});
			}
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
				.data(["DATA", "CLIENTE",
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
						return (d.data + d.cliente + d.dipendente);
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

		  return table;
		};

	}]);
