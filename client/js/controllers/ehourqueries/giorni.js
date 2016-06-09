angular
  .module('app')
  .controller('GiorniController', ['$scope', '$state', 'NgTableParams', '$resource', 'resourceBaseUrl', function($scope, 
		  $state, NgTableParams, $resource, resourceBaseUrl) {
	var ref = this;
	console.log('inside GiorniController...');      
	var query = $resource('http://' + resourceBaseUrl + '/query_giorni_lav_mese');
	
//    var queryData = {
//    	callFun : function (){     	    
//        	query.get().$promise.then(function(data) {    
//    			if (data!=null & data.results.length>0) {
//    				console.log('data.results: ' + data.results);
//	    			var res = data.results;
//	    			ref.tableParams = new NgTableParams({}, {
//	    				data: res
//	    			});
//    			}
//        	});
//    	}
//    };
//    queryData['callFun']();    

	ref.tableParams = new NgTableParams({}, {
		getData : function(params) {
			console.log('params: ' + JSON.stringify(params, null, '\t'));
			console.log('params.url(): ' + JSON.stringify(params.url(), null, '\t'));
			
			// ajax request to back end
			return query.get(params.url()).$promise.then(function(data) {
				var res = [];
				if (data != null && data.giorni != null && data.giorni.length >0) {
					console.log('data: ' + JSON.stringify(data, null, '\t'));
					res = data.giorni;
				}
				return res;
			});
		}
	});
    
  }]);