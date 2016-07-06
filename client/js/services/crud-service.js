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
        LOCAL: {
          getCustomersAndProjects:	'http://' + resourceBaseUrl + '/api/customers?filter[include][projects]=budgets',
          getCustomers: 'http://' + resourceBaseUrl + '/api/customers',
          getProject: 'http://' + resourceBaseUrl + '/api/projects',            //loc
          getProjectsByCustomerId: 'http://' + resourceBaseUrl + '/api/customers/:id?filter[include]=projects',
          getBudgets: 'http://' + resourceBaseUrl + '/api/projects'                                    //loc
        },
        EHOUR: {
          getCustomers: 'http://' + resourceBaseUrl + '/query_customers',
          getProjectsByCustomerId: 'http://' + resourceBaseUrl + '/query_projects_by_customer_id',
          getCosts: 'http://' + resourceBaseUrl + '/query_costs'
        }
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
        LOCAL: {
          getCustomersAndProjects:	$resource(queries.GET.LOCAL.getCustomersAndProjects, null, {'query':  {method:'GET', isArray:true}}),
          getCustomers:	$resource(queries.GET.LOCAL.getCustomers, null, {'query':  {method:'GET', isArray:true}}),
          getProject: $resource(queries.GET.LOCAL.getProject, null, {'query':  {method:'GET', isArray:true}}),
          getProjectsByCustomerId: $resource(queries.GET.LOCAL.getProjectsByCustomerId, null, {'query':  {method:'GET', isArray:true}}),
          getBudgets: $resource(queries.GET.LOCAL.getBudgets, null, {'query':  {method:'GET', isArray:true}})
        },
        EHOUR: {
          getCustomers:	$resource(queries.GET.EHOUR.getCustomers, null, {'query':  {method:'GET', isArray:true}}),
          getProjectsByCustomerId: $resource(queries.GET.EHOUR.getProjectsByCustomerId, null, {'query':  {method:'GET', isArray:true}}),
          getCosts: $resource(queries.GET.EHOUR.getCosts, null, {'query':  {method:'GET', isArray:true}})
        }
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
				return resources.GET.LOCAL.getCustomersAndProjects.query().$promise;
			},
      getCustomers: function(){
				return resources.GET.EHOUR.getCustomers.query().$promise;
			},
      getProject: function(projectparams) {
        return resources.GET.LOCAL.getProject.query(projectparams).$promise;
      },
      getProjectsByCustomerId: function(idObj) {
        return resources.GET.EHOUR.getProjectsByCustomerId.query(idObj).$promise;
      },
      getBudgets: function(budgetparams) {
        return resources.GET.LOCAL.getBudgets.query(budgetparams).$promise;
      },
      getCosts: function(projectCode) {
        return resources.GET.EHOUR.getCosts.query(projectCode).$promise;
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
