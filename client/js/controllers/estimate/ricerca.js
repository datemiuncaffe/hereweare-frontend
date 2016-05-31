angular
	.module("app")
	.controller("RicercaController", ['$scope', '$resource', '$state', '$compile', function($scope, $resource, $state, $compile) {
	    $scope.selectedCustomer = null;
	    
	    $scope.linktoproject = "http://www.project.page";
	    
		$scope.appendName = function(str) {
			return {name: str};
		};
		
		var projectsRes = $resource('http://localhost:3000/api/customers/:id?filter[include]=projects', null, {'query':  {method:'GET'}});
		
		$scope.search = function(selectedCustomer) {			
			if (selectedCustomer != null && selectedCustomer.id != null && selectedCustomer.id > 0) {
				console.log('searching for selectedCustomer id = ' + selectedCustomer.id);
				projectsRes.query({ id: selectedCustomer.id }).$promise.then(function(data) {
					console.log('data: ' + JSON.stringify(data));
					// render the table
					tabulate(data.projects, 
							["name", "code", "budgettot", "from", "to"], 
							["NOME PROGETTO", "CODICE PROGETTO", "BUDGET COMPLESSIVO", "DATA DI INIZIO", "DATA DI FINE"]);
				});
			}			
		};		
		
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
					var projectpageurl = '<a ui-sref="projectdetail({customer: \'' + encodeURI(JSON.stringify($scope.selectedCustomer.originalObject)) + '\', code: \'' + params.code + '\'})">' + value + '</a>';
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
		    
		    return table;
		}
		 
		$scope.getLinkUrl = function(){
		  return $state.href('oremese', {someParam: $scope.selectedCustomer});
		};
		
		$scope.redirectUrl = function(){
			console.log('redirect...');
//			$location.path($scope.getLinkUrl());
			$state.go('projectcreate');
		};
		 
		 
		 
		 
		 
		
//		$scope.countrySelected9 = {name: 'Zimbabwe', code: 'ZW'};
//	    $scope.countrySelectedFn9 = function(selected) {
//	      if (selected) {
//	        $scope.countrySelected9 = selected.originalObject;
//	      } else {
//	        $scope.countrySelected9 = null;
//	      }
//	    }
//
//	    $scope.selectedCountry16 = {name: 'Russia'};
//
//	    $scope.inputChanged = function(str) {
//	      $scope.console10 = str;
//	    }
//
//	    $scope.focusState = 'None';
//	    $scope.focusIn = function() {
//	      var focusInputElem = document.getElementById('ex12_value');
//	      $scope.focusState = 'In';
//	      focusInputElem.classList.remove('small-input');
//	    }
//	    $scope.focusOut = function() {
//	      var focusInputElem = document.getElementById('ex12_value');
//	      $scope.focusState = 'Out';
//	      focusInputElem.classList.add('small-input');
//	    }
//
//	    /***
//	     * Send a broadcast to the directive in order to clear itself
//	     * if an id parameter is given only this ancucomplete is cleared
//	     * @param id
//	     */
//	    $scope.clearInput = function (id) {
//	      if (id) {
//	        $scope.$broadcast('angucomplete-alt:clearInput', id);
//	      }
//	      else{
//	        $scope.$broadcast('angucomplete-alt:clearInput');
//	      }
//	    }
//
//	    /***
//	     * Send a broadcast to the directive in order to change itself
//	     * if an id parameter is given only this ancucomplete is changed
//	     * @param id
//	     */
//	    $scope.changeInput = function (id) {
//	      if (id) {
//	        var pos = Math.floor(Math.random() * ($scope.countries.length - 1));
//	        $scope.$broadcast('angucomplete-alt:changeInput', id, $scope.countries[pos]);
//	      }
//	    }
//
//	    $scope.disableInput = true;
//
//	    $scope.requireExample8a = true;
//	    $scope.requireExample8b = true;
//						
		
	}]);