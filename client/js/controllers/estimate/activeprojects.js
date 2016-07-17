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
							['$scope', '$q', 'crud', '$log', '$window', '$compile',
							function($scope, $q, crud, $log, $window, $compile) {
		var now = moment();
		var currentmonth = now.month();
		var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio',
									'Giugno','Luglio','Agosto','Settembre','Ottobre',
									'Novembre','Dicembre'];
		$scope.customers = null;

    $q.all([
		  crud.getCustomers()
		])
		.then(function(data) {
			if (data[0].length > 0) {
				insertGeneralFilters();
				var customers = data[0];
				$scope.customers = customers;
			}
		});

		function insertGeneralFilters() {
			var table = d3.select("section[id=activeprojects] div.top div.generalfilters")
										.append("table"),
				thead = table.append("thead"),
				tbody = table.append("tbody");

			var filterheaders = ['NOME PROGETTO', 'CODICE PROGETTO', 'ANNO', 'MESE'],
					filtertypes = [{id:'input1',type:'input'},
												 {id:'input2',type:'input'},
												 {id:'select1',type:'select'},
												 {id:'select2',type:'select'}];

			// append the header row
			thead.append("tr")
					.selectAll("th")
					.data(filterheaders)
					.enter()
					.append("th")
					.attr("width", 150)
					.text(function(column) {
						return column;
					});

			// append filter cells
			thead.append("tr")
					.attr('class', 'generalfiltersrow')
					.selectAll("th")
					.data(filtertypes)
					.enter()
					.append("th")
					.attr("width", 150)
					.append(function(d) {
						return document.createElement(d.type);
					})
					.attr('data-filterId', function(d){
						return d.id;
					});

			thead.select("tr.generalfiltersrow")
					.selectAll("input")
					.attr('size', 8)
					.attr('type', 'text');


					//
					// var tablefilters = table.select("tr.tablefilters")
					// 		.selectAll("input")
					// 		.attr("value", function(d, i) {
					// 			if (d == 'ANNO') {
					// 				return '2016';
					// 			}
					// 			if (d == 'MESE') {
					// 				return months[currentmonth];
					// 			}
					// 			return '';
					// 		})
					// 		.on("input", function(d, i) {
					// 			var filtereddata = filterTable(table, data, columns);
					// 			renderTable(id, table, filtereddata, columns);
					// 		});

		};

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
									setTimeout(function() {
					          getActiveProjectsByCustomerId(customerId, element, showData);
					        }, index * 1500);
								});
		});

		function getActiveProjectsByCustomerId(id, element, cb) {
			if (id != null && id > 0) {
				crud.getBudgetsCostsByCustomerId({ customerId: id, onlyActive: 'Y' })
						.then(function(datatable) {
					console.log('datatable: ' + JSON.stringify(datatable));
					cb(id, element, datatable);
				});
			}
		};

		function showData(id, element, datatable) {
			var table = insertTable(id, element);
			// render the table
			tabulate(id, table, datatable,
					['projectname', 'projectcode', 'year', 'month', 'budgetdays', 'costdays', 'costhours']);
		};

		function insertTable(id, element) {
			var table = d3.select("section[id=activeprojects] div[data-customer-id='" + id + "'] div.activeprojects")
										.append("table"),
				thead = table.append("thead"),
				tbody = table.append("tbody");

			var headers = ['NOME PROGETTO', 'CODICE PROGETTO', 'ANNO', 'MESE', 'GIORNATE PREVISTE', 'GIORNATE EROGATE', 'ORE EROGATE'],
					superheaders = ['', 'PREVENTIVO', 'CONSUNTIVO'];

			// append the superheader row
			thead.append("tr")
					.attr('class', 'tablesuperheaders')
					.selectAll("th")
					.data([
						{header: superheaders[0], colspan: 4, border: 'none'},
						{header: superheaders[1], colspan: 1, border: '1px solid black'},
						{header: superheaders[2], colspan: 2, border: '1px solid black'}
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
					.attr("width", 150)
					.text(function(column) {
						return column;
					});

			// append filter cells
			thead.append("tr")
					.attr('class', 'tablefilters')
					.selectAll("th")
					.data(headers)
					.enter()
					.append("th")
					.attr("width", 150)
					.append('input')
					.attr('size', 8)
					.attr('type', 'text');

			return table;
		};

		// The table generation function
		function tabulate(id, table, data, columns) {
			setFilters(id, table, data, columns);
			var filtereddata = filterTable(table, data, columns);
			renderTable(id, table, filtereddata, columns);
		};

		function setFilters(id, table, data, columns) {
			console.log('filters length: ' + table.select("tr.tablefilters").length);
			var tablefilters = table.select("tr.tablefilters")
					.selectAll("input")
					.attr("value", function(d, i) {
						if (d == 'ANNO') {
							return '2016';
						}
						if (d == 'MESE') {
							return months[currentmonth];
						}
						return '';
					})
					.on("input", function(d, i) {
						var filtereddata = filterTable(table, data, columns);
						renderTable(id, table, filtereddata, columns);
					});
		};

		function renderTable(id, table, data, columns) {
			var rows = table.select("tbody").selectAll("tr").data(data,
				function(d) {
					return d.id;
è				});

			// create a row for each object in the data
			var rowsEnter = rows.enter()
				.insert("tr")
				.on("click", function(d, i) {
					console.log("row number: " + i);
				});
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
				.attr("width", 150)
				.html(function(d) {
					return d.value
				});

			// var rowsUpdate = rows.attr("style", "font-family: Courier"); // sets the font style

			var rowsExit = rows.exit().remove();

			addPopover(id);
		};

		function filterTable(table, rows, columns) {
			var filtervalues = [];

			// get filter values
			var tablefilters = table.select("tr.tablefilters").selectAll("th");
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
		};

		function addPopover(id) {
			console.log('adding popover');
			var tablerows = $("section[id=activeprojects] div[data-customer-id='" + id + "']" +
												" div.activeprojects tbody tr");
			tablerows.each(function() {
				var rowcells = $(this).find("td");
				var year = rowcells.eq(2).text();
				var month = rowcells.eq(3).text();
				var projectCode = rowcells.eq(1).text();
				console.log('year: ' + year + '; month: ' + month + '; projectCode: ' + projectCode);

				var popovercontent = "<button class=\"btn btn-default\" ng-click=\"goToDettaglio" +
									"({year:" + year + ",month:'" + month + "',projectCode:'" +
									projectCode + "'});\">Dettaglio</button>";
				// var popovercontent = "<button class=\"btn btn-default\" ng-click=\"goToDettaglio({year:2016,month:" + month + ",projectCode:" + projectCode + "});\">Dettaglio</button>";
				var popovercontenttemplate = angular.element(popovercontent);
				var popovercontentFn = $compile(popovercontenttemplate);
				var popovercontentcompiled = popovercontentFn($scope);

				$(this).popover({
					trigger:	"click",
					html: true,
					content:	popovercontentcompiled
				});
			});
		};

		$scope.goToDettaglio = function(params) {
			console.log('params: ' + JSON.stringify(params, null, '\t'));
			console.log('go to giornicommessautente with year = ' +
									params.year + ', month = ' + params.month +
									', projectCode = ' + params.projectCode);

			var url = 'http://' + $window.location.host + '/#/giornicommessautente' +
					'?year=' + params.year + '&month=' + (months.indexOf(params.month)+1) +
					'&projectCode=' + params.projectCode;
	    $log.log(url);
	    $window.location.href = url;
		};

	}]);
