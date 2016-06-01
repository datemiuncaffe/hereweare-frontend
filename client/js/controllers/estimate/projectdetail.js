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
	    
	    var projectRes = $resource('', null, {'query':  {method:'GET'}});
	    
	    /* loading project */
	    if ($stateParams != null && 
	    	$stateParams.code != null && $stateParams.code.length > 0 &&
	    	$stateParams.customer != null && $stateParams.customer.length > 0) {
	    	console.log('Project code: ' + $stateParams.code + '; customer: ' + decodeURI($stateParams.customer));
	    	var queryUrl = 'http://localhost:3000/api/projects?filter[include]=budgets&filter[include]=costs&filter[where][code]=' + $stateParams.code;
	    	$log.log('queryUrl: ' + queryUrl);
	    	var projectRes = $resource(queryUrl, null, {'query':  {method:'GET', isArray:true}});
	    	projectRes.query().$promise.then(function(data) {
				console.log('project: ' + JSON.stringify(data[0]));
				
				$scope.customer = JSON.parse(decodeURI($stateParams.customer));
				$scope.project = data[0];
				
				// prepare data for table
				var datatable = [];
				if ($scope.project != null && 
					(($scope.project.budgets != null && $scope.project.budgets.length > 0) ||
					($scope.project.costs != null && $scope.project.costs.length > 0))) {
					var zero2 = new Padder(2);					
					var map = new Map();
					$scope.project.budgets.forEach(function(budget){
						var value = {
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
					$scope.project.costs.forEach(function(cost){
						var key = cost.year + '-' + zero2.pad(cost.month);
						var value = {};
						if (map.has(key)) {
							value = map.get(key);
							value.costyear = cost.year;
							value.costmonth = moment.months()[cost.month - 1];
							value.costdays = cost.days;
						} else {
							value = {
								budgetyear: null,
								budgetmonth: null,
								budgetfrom: null,
								budgetto: null,
								budgetamount: null,
								budgetdays: null,
								costyear: cost.year,
						    	costmonth: moment.months()[cost.month - 1],
						    	costdays: cost.days
							};
							map.set(key, value);
						}
					});
					
					var keys = Array.from(map.keys());
					console.log('keys: ' + keys);
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
						['ANNO BUDGET', 'MESE BUDGET', 'DA', 'A', 'BUDGET MENSILE', 'GIORNATE PREVISTE', 'ANNO', 'MESE', 'GIORNATE']);
			});
	    }
	    /* end loading state parameters */
	    
	    // The table generation function
		function tabulate(data, columns, headers) {
			var table = d3.select("div.search_results").append("table"),
			    thead = table.append("thead"),
			    tbody = table.append("tbody");
			
			// append the header row
			thead.append("tr")
			    .selectAll("th")
			    .data(headers)
			    .enter()
			    .append("th")
			        .text(function(column) { return column; });
			
			// create a row for each object in the data
			var rows = tbody.selectAll("tr")
			    .data(data)
			    .enter()
			    .append("tr");
			
			// create a cell in each row for each column
			var cells = rows.selectAll("td")
			    .data(function(row) {
			        return columns.map(function(column) {
			            return {column: column, value: row[column]};
			        });
			    })
			    .enter()
			    .append("td")
			    .attr("style", "font-family: Courier") // sets the font style
				.html(function(d) { return d.value });
		    
			return table;
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