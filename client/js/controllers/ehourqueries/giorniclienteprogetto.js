angular
  .module('app')
  .controller('GiorniClienteProgettoController', ['$scope', '$state', 'NgTableParams', '$resource', function($scope, 
		  $state, NgTableParams, $resource) {
	var ref = this;
    console.log('inside GiorniClienteProgettoController...');      
    var query = $resource('http://localhost:3000/query_giorni_lav_cliente_progetto_mese');
    
    ref.tableParams = new NgTableParams({}, {
		getData : function(params) {
			console.log('params: ' + JSON.stringify(params, null, '\t'));
			console.log('params.url(): ' + JSON.stringify(params.url(), null, '\t'));
			
			// ajax request to back end
			return query.get(params.url()).$promise.then(function(data) {
				var res = [];
				if (data != null && data.giorniClienteProgetto != null && data.giorniClienteProgetto.length >0) {
					console.log('data giorni cliente Progetto: ' + JSON.stringify(data.giorniClienteProgetto, null, '\t'));
					res = data.giorniClienteProgetto;
				}
				return res;
			});
		}
	});
  }]);