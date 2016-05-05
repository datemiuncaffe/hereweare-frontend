// CommonJS package manager support
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  // Export the *name* of this Angular module
  // Sample usage:
  //
  //   import lbServices from './crudService';
  //   angular.module('app', [crudService]);
  //
  module.exports = "crudService";
}

(function(window, angular, undefined) {'use strict';

	var module = angular.module("crudService",[]);	
	module.factory('crud', ['$resource', function($resource) {		
		var resources = {
			getCustomers:	$resource('http://localhost:3000/api/customers?filter[include][projects]=budgets', null, {'query':  {method:'GET', isArray:true}}),
			updateProject: 	$resource('http://localhost:3000/api/projects/:id', null, {'update': {method:'PUT'}}),
			updateBudgets:	$resource('http://localhost:3000/api/budgets/updateAllByProjectId', null, {'update': {method:'PUT'}})
		};
		
		var crud = {
			getCustomers: function(){
				return resources.getCustomers.query().$promise;
			},
			updateProject: function(projectId, project){
				return resources.updateProject.update({ id: projectId }, project).$promise;
			},
			updateBudgets: function(data){
				return resources.updateBudgets.update(data).$promise;
			}
		};
		
		return crud;
	}]);

})(window, window.angular);