angular
  .module('app')
  .controller('GiorniClienteProgettoController', ['$scope', '$state', 'NgTableParams', '$resource', function($scope, 
		  $state, NgTableParams, $resource) {
    console.log('inside GiorniClienteProgettoController...');
      
    var query = $resource('http://localhost:3000/query_giorni_lav_cliente_progetto_mese');
    console.log('query' + query);
    this.tableParams = new NgTableParams({}, {
		getData: function(params) {
			console.log('params: ' + params);
			// ajax request to query
			return query.get().$promise.then(function(data) {
				console.log('data: ' + data);
					
				
				//params.total(data.inlineCount); // recal. page nav controls
				console.log('data.results: ' + data.results);
				return data.results;				
			});
		}
    });    
    
  }]);