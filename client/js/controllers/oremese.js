angular
  .module('app')
  .controller('OreMeseController', ['$scope', '$state', 'NgTableParams', '$resource', function($scope, 
		  $state, NgTableParams, $resource) {
    console.log('inside OreMeseController...');
      
    var query = $resource('http://localhost:3000/query_ore_lav_utente_mese');
    console.log('query' + query);
    alert('ciao');
    
    var resList = [];
    var queryData = {
    	callFun : function (){     	    
		        	return query.get().$promise.then(function(data) {    
		    			console.log('data: ' + data);
		    			
		    			
		    			//params.total(data.inlineCount); // recal. page nav controls
		    			console.log('data.results: ' + data.results);
		    			
		    			var res = [{"anno": 2016, "mese": 3, "nomeDipendente": "Viani", "oreMese": 64},
		    			               {"anno": 2016, "mese": 3, "nomeDipendente": "Terranova", "oreMese": 56}];
		    	//		return data.results;	
		    			return res;
		        	});
    	}
    };
    resList = queryData['callFun']();
    console.log('resList' + resList);
//    var resList = [{"anno": 2016, "mese": 3, "nomeDipendente": "Viani", "oreMese": 64},
//               {"anno": 2016, "mese": 3, "nomeDipendente": "Terranova", "oreMese": 56}];
//    console.log('resList' + resList);
    
    this.tableParams = new NgTableParams({}, {
    	data: resList
//		getData: function(params) {
//			console.log('params: ' + params);
//			// ajax request to query
//			return query.get().$promise.then(function(data) {
//				console.log('data: ' + data);
//					
//				
//				//params.total(data.inlineCount); // recal. page nav controls
//				console.log('data.results: ' + data.results);
//				return data.results;				
//			});
//		}
    });    
    
  }]);