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

	var module = angular.module("crudService",['angular-cache']);
	module.factory('crud', ['$resource', 'resourceBaseUrl', 'CacheFactory',
                function($resource, resourceBaseUrl, CacheFactory) {
    var budgetsCostsByCustomerIdsCache;
    if (!CacheFactory.get('budgetsCostsByCustomerIdsCache')) {
      budgetsCostsByCustomerIdsCache = CacheFactory('budgetsCostsByCustomerIdsCache', {
        maxAge: 4 * 60 * 1000, // 2 minutes,
        deleteOnExpire: 'aggressive'
      });
    }

    var queries = {
      GET: {
        BOTH: {
          getBudgetsCostsByCustomerIds: 'http://' + resourceBaseUrl + '/query_budgets_costs_by_customer_ids'
        },
        LOCAL: {
          getCustomersAndProjects:	'http://' + resourceBaseUrl + '/api/customers?filter[include][projects]=budgets',
          getBudgets: 'http://' + resourceBaseUrl + '/api/projects/:id?filter[include]=budgets'                                    //loc
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
        LOCAL: {
          createProject: 'http://' + resourceBaseUrl + '/api/projects/createAndIncrementId',
          createHwuser: 'http://' + resourceBaseUrl + '/api/hwuser'
        }
      }
    };

    var resources = {
      GET: {
        BOTH: {
          getBudgetsCostsByCustomerIds: $resource(queries.GET.BOTH.getBudgetsCostsByCustomerIds, null, {'query':  {method:'GET', cache: CacheFactory.get('budgetsCostsByCustomerIdsCache'), isArray:true}})
        },
        LOCAL: {
          getCustomersAndProjects:	$resource(queries.GET.LOCAL.getCustomersAndProjects, null, {'query':  {method:'GET', isArray:true}}),
          getBudgets: $resource(queries.GET.LOCAL.getBudgets, null, {'query':  {method:'GET'}})
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
        LOCAL: {
          createProject:  $resource(queries.POST.LOCAL.createProject, null, {'save': {method:'POST'}}),
          createHwuser:  $resource(queries.POST.LOCAL.createHwuser, null, {'save': {method:'POST'}})
        }
      }
    };

		var crud = {
			getCustomersAndProjects: function(){
				return resources.GET.LOCAL.getCustomersAndProjects.query().$promise;
			},
      getCustomers: function(customerParams){
				return resources.GET.EHOUR.getCustomers.query(customerParams).$promise;
			},
      getProjectsByCustomerId: function(idObj) {
        return resources.GET.EHOUR.getProjectsByCustomerId.query(idObj).$promise;
      },
      getBudgetsCostsByCustomerIds: function(params) {
        return resources.GET.BOTH.getBudgetsCostsByCustomerIds.query(params).$promise;
      },
      getBudgets: function(projectId) {
        return resources.GET.LOCAL.getBudgets.query(projectId).$promise;
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
				return resources.POST.LOCAL.createProject.save(project).$promise;
			},
      createHwuser: function(hwuser){
				return resources.POST.LOCAL.createHwuser.save(hwuser).$promise;
			}
		};

		return crud;
	}]);

})(window, window.angular);
