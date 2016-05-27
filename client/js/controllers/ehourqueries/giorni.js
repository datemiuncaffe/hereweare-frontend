angular
  .module('app')
  .controller('GiorniController', ['$scope', '$state', 'NgTableParams', '$resource', function($scope, 
		  $state, NgTableParams, $resource) {
	var ref = this;
    console.log('inside GiorniController...');      
    var query = $resource('http://localhost:3000/query_giorni_lav_mese');
    var queryData = {
    	callFun : function (){     	    
        	query.get().$promise.then(function(data) {    
    			if (data!=null & data.results.length>0) {
    				console.log('data.results: ' + data.results);
	    			var res = data.results;
	    			ref.tableParams = new NgTableParams({}, {
	    				data: res
	    			});
    			}
        	});
    	}
    };
    queryData['callFun']();    
  }]);