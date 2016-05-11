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
			if (selectedCustomer != null && selectedCustomer.id != null && selectedCustomer.id.length > 0) {
				console.log('searching for selectedCustomer id = ' + selectedCustomer.id);
				projectsRes.query({ id: selectedCustomer.id }).$promise.then(function(data) {
					console.log('data: ' + JSON.stringify(data));
					// render the table
					tabulate(data.projects, ["name", "code", "budgettot"]);
				});
			}			
		};		
		
		// The table generation function
		function tabulate(data, columns) {
		    var table = d3.select("div.search_results").append("table")
		            .attr("style", "margin-left: 250px"),
		        thead = table.append("thead"),
		        tbody = table.append("tbody");

		    // append the header row
		    thead.append("tr")
		        .selectAll("th")
		        .data(columns)
		        .enter()
		        .append("th")
		            .text(function(column) { return column; });

		    // create a row for each object in the data
		    var rows = tbody.selectAll("tr")
		        .data(data)
		        .enter()
		        .append("tr");
//		        .html(function(d,i){ return "<a href=\"" + $scope.linktoproject + "\"></a>"; });
//		    	.append("a");

		    // create a cell in each row for each column
		    var cells = rows.selectAll("td")
		        .data(function(row) {
		            return columns.map(function(column) {
		                return {column: column, value: row[column]};
		            });
		        })
		        .enter()
//		        .append("a")
//		        .attr("ng-href", $scope.getLinkUrl())
//		        .attr("href", "#oremese")
//		        .attr("ui-sref", "oremese")		        
		        .append("td")
		        .attr("style", "font-family: Courier") // sets the font style
//		            .html(function(d) { return d.value; });
//		        	.html(function(d) { return "<a ng-href=\"{{getLinkUrl()}}\">" + d.value + "</a>"; });
//		    		.html(function(d) { return "<a ng-href=\"" + $scope.getLinkUrl() + "\">" + d.value + "</a>"; });
//		    		.html(function(d) { return "<a ui-sref=\"" + $scope.getLinkUrl() + "\">" + d.value + "</a>"; });
//		        	.html(function(d) { return "<a href=\"#\" ng-click=\"$event.preventDefault(); redirectUrl();\">" + d.value + "</a>"; });
//		        	.html(function(d) { return "<a href ng-click=\"$event.preventDefault(); redirectUrl();\">" + d.value + "</a>"; });
//		    	.append("a")
//		    	.attr("href", "#/")
//		    	.attr("ng-click", '$event.preventDefault(); redirectUrl();')
		    	.html(function(d) { return d.value });
		    
		      var selectedDiv = angular.element(document).find("div.search_results table tbody td");
//		      console.log("search div: " + JSON.stringify(selectedDiv.get(0)));
		      console.log("search div: " + selectedDiv.html());
		      
		      var html = '<a href ng-click="$event.preventDefault(); redirectUrl();"></a>';
		      var template = angular.element(html);
		      var linkFn = $compile(template);
		      var element = linkFn($scope);
		      selectedDiv.wrap(element);
		      
		      var html2 = '<a href ng-click="redirectUrl()">dynamic redirect</a>';
		      var template2 = angular.element(html2);
		      var linkFn2 = $compile(template2);
		      var element2 = linkFn2($scope);
		      angular.element(document).find("div.search_results").append(element2);
		    
		    return table;
		}
		 
		$scope.getLinkUrl = function(){
		  return $state.href('oremese', {someParam: $scope.selectedCustomer});
		};
		
		$scope.redirectUrl = function(){
			console.log('redirect...');
//			$location.path($scope.getLinkUrl());
			$state.go('oremese');
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