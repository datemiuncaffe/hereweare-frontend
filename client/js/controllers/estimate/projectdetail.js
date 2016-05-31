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
	    
	    var projectRes = $resource('', null, {'query':  {method:'GET'}});
	    
	    /* loading project */
	    if ($stateParams != null && 
	    	$stateParams.code != null && $stateParams.code.length > 0 &&
	    	$stateParams.customer != null && $stateParams.customer.length > 0) {
	    	console.log('Project code: ' + $stateParams.code + '; customer: ' + decodeURI($stateParams.customer));
	    	var queryUrl = 'http://localhost:3000/api/projects?filter[include]=budgets&filter[include]=costs&filter[where][code]=' + $stateParams.code;
	    	var projectRes = $resource(queryUrl, null, {'query':  {method:'GET', isArray:true}});
	    	projectRes.query().$promise.then(function(data) {
				console.log('project: ' + JSON.stringify(data[0]));
				
				$scope.customer = JSON.parse(decodeURI($stateParams.customer));
				$scope.project = data[0];
				// render the table
				tabulate(data[0].costs, 
						["year", "month", "days"], 
						["ANNO", "MESE", "GIORNATE"]);
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