angular
  .module('app')
  .controller('OreMeseController', ['$scope', '$state', 'NgTableParams', '$resource', function($scope, 
		  $state, NgTableParams, $resource) {
	var ref = this;
	console.log('inside OreMeseController ...');      
    var query = $resource('http://localhost:3000/query_ore_lav_utente_mese');            
    
    ref.tableParams = new NgTableParams({}, {
		getData : function(params) {
			console.log('params: ' + JSON.stringify(params, null, '\t'));
			console.log('params.url(): ' + JSON.stringify(params.url(), null, '\t'));
			
			// ajax request to back end
			return query.get(params.url()).$promise.then(function(data) {
				var res = [];
				if (data != null && data.oreLav != null && data.oreLav.length > 0) {
					console.log('data ore lav: ' + JSON.stringify(data.oreLav, null, '\t'));
					res = data.oreLav;
				}
				return res;
			});
		}
	});    
  }]);