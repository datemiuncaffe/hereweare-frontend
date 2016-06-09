angular
  .module('app')
  .controller('GiorniClienteController', ['$scope', '$state', 'NgTableParams', '$resource', 'resourceBaseUrl', function($scope, 
		  $state, NgTableParams, $resource, resourceBaseUrl) {
	var ref = this;
    console.log('inside GiorniClienteController...');      
    var query = $resource('http://' + resourceBaseUrl + '/query_giorni_lav_cliente_mese');
    
    ref.tableParams = new NgTableParams({}, {
		getData : function(params) {
			console.log('params: ' + JSON.stringify(params, null, '\t'));
			console.log('params.url(): ' + JSON.stringify(params.url(), null, '\t'));
			
			// ajax request to back end
			return query.get(params.url()).$promise.then(function(data) {
				var res = [];
				if (data != null && data.giorniCliente != null && data.giorniCliente.length >0) {
					console.log('data.giorniCliente: ' + JSON.stringify(data.giorniCliente, null, '\t'));
					res = data.giorniCliente;
				}
				return res;
			});
		}
	});
  }]);