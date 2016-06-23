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
	module.factory('crud', ['$resource', 'resourceBaseUrl', function($resource, resourceBaseUrl) {
		var resources = {
			getCustomersAndProjects:	$resource('http://' + resourceBaseUrl + '/api/customers?filter[include][projects]=budgets', null, {'query':  {method:'GET', isArray:true}}),
      getCustomers:	$resource('http://' + resourceBaseUrl + '/api/customers', null, {'query':  {method:'GET', isArray:true}}),
			updateProject: 	$resource('http://' + resourceBaseUrl + '/api/projects', null, {'update': {method:'PUT'}}),
			updateBudgets:	$resource('http://' + resourceBaseUrl + '/api/budgets/updateAllByProjectId', null, {'update': {method:'PUT'}})
		};

		var crud = {
			getCustomersAndProjects: function(){
				return resources.getCustomersAndProjects.query().$promise;
			},
      getCustomers: function(){
				return resources.getCustomers.query().$promise;
			},
			updateProject: function(project){
				return resources.updateProject.update(project).$promise;
			},
			updateBudgets: function(data){
				return resources.updateBudgets.update(data).$promise;
			}
		};

		return crud;
	}]);

})(window, window.angular);
