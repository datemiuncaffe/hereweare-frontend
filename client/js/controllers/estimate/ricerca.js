angular
	.module("app")
	.controller("RicercaController", ['$scope', function($scope) {
	    $scope.day = moment();
	    
	    console.log('$scope.day: ' + $scope.day.format());
	    
	    
	    
	    $scope.selectedProject = {
	    	from: null,
	    	to: null,
	    	budgettot: null,
	    	budgets: []
	    };
	    
	    
		$scope.saveBudgets = function() {};
	    
	}]);