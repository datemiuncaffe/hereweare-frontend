angular
	.module("app")
	.controller("EstimateController", ['$scope', '$resource', '$q', 'crud', '$window', '$log', 'resourceBaseUrl',
																		function($scope, $resource, $q, crud, $window, $log, resourceBaseUrl) {
		$scope.customers = null;
		$scope.selectedCustomer = null;
		$scope.selectedProject = null;

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
				$scope.selectedProject = $scope.selectedCustomer.projects[0];
				loadingProject($scope.selectedProject);
			});

		/* loading project data */
 		function loadingProject(selectedProject) {
	    if (selectedProject != null &&
	    		selectedProject.code != null && selectedProject.code.length > 0) {
	    		console.log('Project code: ' + selectedProject.code);

	    		// query urls
	    		var queryBudgets = 'http://' + resourceBaseUrl + '/api/projects?filter[include]=budgets&filter[include]=costs&filter[where][code]=' + selectedProject.code;
	    		$log.log('queryBudgets: ' + queryBudgets);
	    		var budgetRes = $resource(queryBudgets, null, {'query':  {method:'GET', isArray:true}});
	    		var queryCosts = 'http://' + resourceBaseUrl + '/query_costs?projectCode=' + selectedProject.code;
	    		$log.log('queryCosts: ' + queryCosts);
	    		var costRes = $resource(queryCosts, null, {'query':  {method:'GET', isArray:true}});

	    		// perform queries
	    		$q.all([
			      budgetRes.query().$promise,
			      costRes.query().$promise
					])
					.then(
						function(data) {
							showData(data);
						});
	    }
		};

		function showData(data) {
//	    	console.log('data: ' + JSON.stringify(data, null, '\t'));
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
							var key = budget.year + '-' + zero2.pad((moment(budget.month, "MMMM").month() + 1));
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
				.selectAll("th")
				.data(headers)
				.enter()
				.append("th")
						.text(function(column) { return column; });

		// append filter cells
		thead.append("tr")
				.selectAll("th")
				.data(headers)
				.enter()
				.append("th")
				.append('input')
				.attr('size', 8)
				.attr('type', 'text')
				.on("input", function(d, i) {
					filterTable(this.value, d, i, data, columns);
				});

		// The table generation function
		function tabulate(data, columns) {
			renderTable(data, columns);
			return table;
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

		function filterTable(filtervalue, header, index, rows, columns) {
//			console.log('rows: ' + JSON.stringify(rows, null, '\t'));
//			console.log('filtervalue: ' + filtervalue + '; header: ' + header + '; index: ' + index);
			var filteredrows = [];
			var filterfield = columns[index];
			rows.forEach(function(row){
//				console.log(row[filterfield]);
//				console.log(typeof filtervalue + ' - ' + (row[filterfield] != null ? typeof row[filterfield].toString() : null));
				if (row[filterfield] != null) {
					console.log('filtervalue: ' + filtervalue + '; row[filterfield]: ' + row[filterfield]);
					var regExp = new RegExp(filtervalue, 'g');
					var res = regExp.exec(row[filterfield].toString());
//					console.log('matches: ' + JSON.stringify(res, null, '\t'));
					if (res != null && res.length > 0) {
						filteredrows.push(row);
					}
				} else if (filtervalue != null && filtervalue.length === 0) {
					console.log('filtervalue: ' + filtervalue + '; row[filterfield]: ' + row[filterfield]);
					filteredrows.push(row);
				}
			});
			console.log('filteredrows: ' + JSON.stringify(filteredrows, null, '\t'));
			renderTable(filteredrows, columns);
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

		$scope.modify = function() {
			console.log('current customer: ' + JSON.stringify($scope.selectedCustomer));
			console.log('current project: ' + JSON.stringify($scope.selectedProject));

			var url = 'http://' + $window.location.host + '/#/projectmodify?customer=' +
					encodeURI(JSON.stringify($scope.selectedCustomer)) + '&code=' + $scope.selectedProject.code;

			$log.log(url);
			$window.location.href = url;
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
