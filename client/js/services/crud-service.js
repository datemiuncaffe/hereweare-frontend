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

    var queries = {
      GET: {
        getCustomersAndProjects:	'http://' + resourceBaseUrl + '/api/customers?filter[include][projects]=budgets',
        getCustomers: 'http://' + resourceBaseUrl + '/api/customers',
        getProject: 'http://' + resourceBaseUrl + '/api/projects?filter[include]=budgets',
        getProjectById: 'http://' + resourceBaseUrl + '/api/customers/:id?filter[include]=projects',
        getBudgets: 'http://' + resourceBaseUrl + '/api/projects',
        getCosts: 'http://' + resourceBaseUrl + '/query_costs'
      },
      PUT: {
        updateProject: 'http://' + resourceBaseUrl + '/api/projects',
        updateBudgets: 'http://' + resourceBaseUrl + '/api/budgets/updateAllByProjectId'
      },
      POST: {
        createProject: 'http://' + resourceBaseUrl + '/api/projects/createAndIncrementId'
      }
    };

    var resources = {
      GET: {
        getCustomersAndProjects:	$resource(queries.GET.getCustomersAndProjects, null, {'query':  {method:'GET', isArray:true}}),
        getCustomers:	$resource(queries.GET.getCustomers, null, {'query':  {method:'GET', isArray:true}}),
        getProject: $resource(queries.GET.getProject, null, {'query':  {method:'GET', isArray:true}}),
        getProjectById: $resource(queries.GET.getProjectById, null, {'query':  {method:'GET'}}),
        getBudgets: $resource(queries.GET.getBudgets, null, {'query':  {method:'GET', isArray:true}}),
        getCosts: $resource(queries.GET.getCosts, null, {'query':  {method:'GET', isArray:true}})
      },
      PUT: {
        updateProject: 	$resource(queries.PUT.updateProject, null, {'update': {method:'PUT'}}),
        updateBudgets:	$resource(queries.PUT.updateBudgets, null, {'update': {method:'PUT'}})
      },
      POST: {
        createProject:  $resource(queries.POST.createProject, null, {'save': {method:'POST'}})
      }
    };

		var crud = {
			getCustomersAndProjects: function(){
				return resources.GET.getCustomersAndProjects.query().$promise;
			},
      getCustomers: function(){
				return resources.GET.getCustomers.query().$promise;
			},
      getProject: function(projectparams) {
        return resources.GET.getProject.query(projectparams).$promise;
      },
      getProjectById: function(id) {
        return resources.GET.getProjectById.query(id).$promise;
      },
      getBudgets: function(budgetparams) {
        return resources.GET.getBudgets.query(budgetparams).$promise;
      },
      getCosts: function(projectCode) {
        return resources.GET.getCosts.query(projectCode).$promise;
      },
			updateProject: function(project){
				return resources.PUT.updateProject.update(project).$promise;
			},
			updateBudgets: function(data){
				return resources.PUT.updateBudgets.update(data).$promise;
			},
      createProject: function(project){
				return resources.POST.createProject.save(project).$promise;
			}
		};

		return crud;
	}]);

})(window, window.angular);
