angular
	.module("app")
	.controller("EstimateController", ['$scope', '$resource', '$q', 'crud', '$window', '$log',
																		function($scope, $resource, $q, crud, $window, $log) {
		$scope.customers = null;
		$scope.selectedCustomer = null;
		$scope.selectedProject = null;

    $q
		.all([
		    crud.getCustomersAndProjects()
		])
		.then(
			function(data) {
				var customers = data[0];
				$scope.customers = customers;
				$scope.selectedCustomer = customers[0];
				$scope.selectedProject = $scope.selectedCustomer.projects[0];
				loadingProject($scope.selectedProject);
			});

		/* loading project data */
 		function loadingProject(selectedProject) {
	    if (selectedProject != null &&
	    		selectedProject.code != null && selectedProject.code.length > 0) {
	    		console.log('Project code: ' + selectedProject.code);

					var budgetparams = {};
					budgetparams['filter[include]'] = 'budgets';
					budgetparams['filter[where][code]'] = selectedProject.code;

					// perform queries
	    		$q.all([
			      crud.getBudgets(budgetparams),
			      crud.getCosts({projectCode: selectedProject.code})
					])
					.then(
						function(data) {
							showData(data);
						});
	    }
		};

		function showData(data) {
			var budgets = data[0][0].budgets;
			console.log('budgets: ' + JSON.stringify(budgets, null, '\t'));
			var costs = data[1];
			console.log('costs: ' + JSON.stringify(costs, null, '\t'));

			// prepare data for table
			var datatable = [];
			if ((budgets != null && budgets.length > 0) ||
					(costs != null && costs.length > 0)) {
						var zero2 = new Padder(2);
						var map = new Map();
						budgets.forEach(function(budget){
							var value = {
								id: budget.id,
								year: budget.year,
								month: budget.month,
								budgetfrom: budget.from,
								budgetto: budget.to,
								budgetamount: budget.amount,
								budgetdays: budget.days,
								costdays: null
							};
							var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio',
							'Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
							var key = budget.year + '-' +
								zero2.pad((months.indexOf(budget.month) + 1));
							map.set(key, value);
						});
						costs.forEach(function(cost){
							var key = cost.anno + '-' + zero2.pad(cost.mese);
							var value = {};
							if (map.has(key)) {
								value = map.get(key);
								value.id += '-' + (cost.id + cost.mese);
								value.costdays = cost.giornateMese;
							} else {
								value = {
									id: '-' + (cost.id + cost.mese),
									year: cost.anno,
									month: moment.months()[cost.mese - 1],
									budgetfrom: null,
									budgetto: null,
									budgetamount: null,
									budgetdays: null,
									costdays: cost.giornateMese
								};
								map.set(key, value);
							}
						});

						var keys = Array.from(map.keys());
						console.log('keys: ' + keys);
						var firstobj = map.get(keys[0]);
						for (var field in firstobj) {
							console.log('typeof field: ' + typeof firstobj[field]);
						}
						var sortedKeys = keys.sort();
						console.log('sortedKeys: ' + sortedKeys);
						sortedKeys.forEach(function(key){
							var value = map.get(key);
							console.log('m[' + key + '] = ' + JSON.stringify(value));
							datatable.push(value);
						});
			}

			// render the table
			tabulate(datatable,
				['year', 'month', 'budgetfrom', 'budgetto', 'budgetamount', 'budgetdays', 'costdays']);

		}

		var table = d3.select("div.search_results").append("table"),
			thead = table.append("thead"),
			tbody = table.append("tbody");

		var headers = ['ANNO', 'MESE', 'DETTAGLIO \r\n DA', 'DETTAGLIO \r\n A', 'BUDGET MENSILE', 'GIORNATE PREVISTE', 'GIORNATE EROGATE'],
				superheaders = ['', '', 'PREVENTIVO', 'CONSUNTIVO'];

		// append the superheader row
		thead.append("tr")
				.attr('class', 'tablesuperheaders')
				.selectAll("th")
				.data([
					{header: superheaders[0], colspan: 1, border: 'none'},
					{header: superheaders[1], colspan: 1, border: 'none'},
					{header: superheaders[2], colspan: 4, border: '1px solid black'},
					{header: superheaders[3], colspan: 1, border: '1px solid black'}
				])
				.enter()
				.append("th")
				.attr('colspan', function(d) {
					return d.colspan;
				})
				.style('border', function(d) {
					return d.border;
				})
				.text(function(d) {
					return d.header;
				});

		// append the header row
		thead.append("tr")
				.attr('class', 'tableheaders')
				.selectAll("th")
				.data(headers)
				.enter()
				.append("th")
						.text(function(column) { return column; });

		// append filter cells
		thead.append("tr")
				.attr('class', 'tablefilters')
				.selectAll("th")
				.data(headers)
				.enter()
				.append("th")
				.append('input')
				.attr('size', 8)
				.attr('type', 'text');

		// The table generation function
		function tabulate(data, columns) {
			setFilters(data, columns);
			var filtereddata = filterTable(data, columns);
			renderTable(filtereddata, columns);
			return table;
		}

		function setFilters(data, columns) {
			var tablefilters = d3.select("tr.tablefilters")
					.selectAll("input")
					.attr("value", function(d, i) {
						if (d == 'ANNO') {
							return '2016';
						}
						return '';
					})
					.on("input", function(d, i) {
						var filtereddata = filterTable(data, columns);
						renderTable(filtereddata, columns);
					});
		}

		function renderTable(data, columns) {
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
//			    .attr("style", "font-family: Courier") // sets the font style
				.html(function(d) { return d.value });

			// var rowsUpdate = rows.attr("style", "font-family: Courier"); // sets the font style

			var rowsExit = rows.exit().remove();
		}

		function filterTable(rows, columns) {
			var filtervalues = [];

			// get filter values
			var tablefilters = d3.select("tr.tablefilters").selectAll("th");
			tablefilters.each(function(p, i) {
				var inputfilter = d3.select(this).select("input");
				filtervalues.push(inputfilter.property("value"));
			});
			console.log('filtervalues: ' + filtervalues);

			var filteredrows = [];
			rows.forEach(function(row){
				console.log('row: ' + JSON.stringify(row));

				var failures = 0;
				columns.forEach(function(column, i){
					if (row[column] != null) {
						var regExp = new RegExp(filtervalues[i], 'g');
						var res = regExp.exec(row[column].toString());
						console.log(column + '-' + row[column].toString() + '; filtervalue: ' + filtervalues[i] + '; res: ' + res);
						if (res == null) {
							failures++;
						}
					} else {
						console.log('filtervalue: ' + filtervalues[i]);
						if (filtervalues[i] != null && filtervalues[i].length > 0) {
							failures++;
						}
					}
				});

				console.log('failures = ' + failures);
				if (failures == 0) {
					filteredrows.push(row);
				}

			});
			console.log('filteredrows: ' + JSON.stringify(filteredrows, null, '\t'));
			return filteredrows;
		}

		$scope.onCustomerChange = function(selectedCustomer) {
			if (selectedCustomer != null &&
					selectedCustomer.projects != null &&
					selectedCustomer.projects.length > 0) {
						console.log('selectedCustomer.projects: ' + selectedCustomer.projects);
						$scope.selectedProject = selectedCustomer.projects[0];
						loadingProject($scope.selectedProject);
					}
	  };

		$scope.onProjectChange = function(selectedProject) {
			if (selectedProject != null) {
				loadingProject(selectedProject);
			}
		};

		function Padder(len, pad) {
			if (len === undefined) {
				len = 1;
			} else if (pad === undefined) {
				pad = '0';
			}

			var pads = '';
			while (pads.length < len) {
				pads += pad;
			}

			this.pad = function(what) {
				var s = what.toString();
				return pads.substring(0, pads.length - s.length) + s;
			};
		}

	}]);
