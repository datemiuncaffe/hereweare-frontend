angular
	.module("app")
	.controller("ProjectDetailController", ['$scope', '$window', '$log', '$resource', '$q', '$stateParams', 
	                                        function($scope, $window, $log, $resource, $q, $stateParams) {	    
	    /* entities */	    
	    $scope.customer = {
	    	name: null
	    };
	    
	    $scope.project = {
	    	name: null,
	    	code: null,
	    	from: null,
	    	to: null,
	    	budgettot: null,
	    	daystot: null,
	    	customerId: null,
	    	budgets: []
	    };	    
	    /* end entities */
	    

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
	    
	    /* loading data */
	    if ($stateParams != null && 
	    	$stateParams.code != null && $stateParams.code.length > 0 &&
	    	$stateParams.customer != null && $stateParams.customer.length > 0) {
	    	console.log('Project code: ' + $stateParams.code + '; customer: ' + decodeURI($stateParams.customer));
	    	
	    	$scope.customer = JSON.parse(decodeURI($stateParams.customer));
	    	
	    	// query urls
	    	var queryBudgets = 'http://localhost:3000/api/projects?filter[include]=budgets&filter[include]=costs&filter[where][code]=' + $stateParams.code;
	    	$log.log('queryBudgets: ' + queryBudgets);
	    	var budgetRes = $resource(queryBudgets, null, {'query':  {method:'GET', isArray:true}});
	    	var queryCosts = 'http://localhost:3000/query_costs?projectCode=' + $stateParams.code;
	    	$log.log('queryCosts: ' + queryCosts);
	    	var costRes = $resource(queryCosts, null, {'query':  {method:'GET', isArray:true}});
	    	
	    	// perform queries
	    	$q
			.all([
			      budgetRes.query().$promise,
			      costRes.query().$promise
			])
			.then(
				function(data) {
					showData(data);					
				});
	    }
	    /* end loading data */
	    
	    function showData(data) {
//	    	console.log('data: ' + JSON.stringify(data, null, '\t'));
	    	$scope.project = data[0][0];
	    	
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
						budgetyear: budget.year,
						budgetmonth: budget.month,
						budgetfrom: budget.from,
						budgetto: budget.to,
						budgetamount: budget.amount,
						budgetdays: budget.days,
						costyear: null,
				    	costmonth: null,
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
						value.costyear = cost.anno;
						value.costmonth = moment.months()[cost.mese - 1];
						value.costdays = cost.giornateMese;
					} else {
						value = {
							id: '-' + (cost.id + cost.mese),
							budgetyear: null,
							budgetmonth: null,
							budgetfrom: null,
							budgetto: null,
							budgetamount: null,
							budgetdays: null,
							costyear: cost.anno,
					    	costmonth: moment.months()[cost.mese - 1],
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
					['budgetyear', 'budgetmonth', 'budgetfrom', 'budgetto', 'budgetamount', 'budgetdays', 'costyear', 'costmonth', 'costdays'], 
					['ANNO BUDGET', 'MESE BUDGET', 'DA', 'A', 'BUDGET MENSILE', 'GIORNATE PREVISTE', 'ANNO', 'MESE', 'GIORNATE'],
					['PREVENTIVO', 'CONSUNTIVO']);
		
	    }    
	    
	    var table = d3.select("div.search_results").append("table"),
	   		thead = table.append("thead"),
	   		tbody = table.append("tbody");
	    
	    // The table generation function
		function tabulate(data, columns, headers, superheaders) {			
			
			// append the superheader row
			thead.append("tr")
			    .selectAll("th")
			    .data(superheaders)
			    .enter()
			    .append("th")
			        .text(function(column) { return column; });
			
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
			
			var rowsUpdate = rows.attr("style", "font-family: Courier"); // sets the font style
			
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
	    	    
	    $scope.modify = function() {
			console.log('current customer: ' + JSON.stringify($scope.customer));
			console.log('current project: ' + JSON.stringify($scope.project));			
			
			console.log('changing state...');
			
			var url = 'http://' + $window.location.host + '/#/projectmodify?customer=' + encodeURI(JSON.stringify($scope.customer)) + '&code=' + $scope.project.code;
	        $log.log(url);
	        $window.location.href = url;
		};
			    
	}]);