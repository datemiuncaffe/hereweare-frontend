angular
  .module('app')
  .controller('GiorniCommessaController', ['$scope', '$state', 'NgTableParams', '$resource', function($scope, 
		  $state, NgTableParams, $resource) {
	var ref = this;
    console.log('inside GiorniCommessaController...');      
    var query = $resource('http://localhost:3000/query_giorni_lav_commessa_mese');
    
    ref.tableParams = new NgTableParams({}, {
		getData : function(params) {
			console.log('params: ' + JSON.stringify(params, null, '\t'));
			console.log('params.url(): ' + JSON.stringify(params.url(), null, '\t'));
			
			// ajax request to back end
			return query.get(params.url()).$promise.then(function(data) {
				var res = [];
				if (data != null && data.giorniCommessa != null && data.giorniCommessa.length > 0) {
					console.log('data giorni Commessa: ' + JSON.stringify(data.giorniCommessa, null, '\t'));
					res = data.giorniCommessa;
				}
				return res;
			});
		}
	});    
  }]);