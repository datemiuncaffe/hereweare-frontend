angular
  .module('ehourqueries')
  .controller('GiorniCommessaUtenteController',
      ['$scope', '$state', 'NgTableParams', '$resource', 'resourceBaseUrl',
       '$stateParams', 'FileSaver', 'Blob',
      function($scope, $state, NgTableParams, $resource, resourceBaseUrl,
        $stateParams, FileSaver, Blob) {
	  var ref = this;

    var now = moment();
    var currentYear = now.year();
    var currentMonth = now.month();
    console.log('inside GiorniCommessaUtenteController: year = ' + currentYear + '; month = ' + currentMonth);

    // set table filter
    var tablefilter = {
      anno: currentYear,
      mese: currentMonth,
      codiceProgetto: null
    };

    if ($stateParams.year != null && $stateParams.year.length > 0) {
			tablefilter.anno = $stateParams.year;
		}
    if ($stateParams.month != null && $stateParams.month.length > 0) {
			tablefilter.mese = $stateParams.month;
		}
    if ($stateParams.projectCode != null && $stateParams.projectCode.length > 0) {
			tablefilter.codiceProgetto = $stateParams.projectCode;
		}
    console.log('tablefilter = ' + JSON.stringify(tablefilter, null, '\t'));

    var query = $resource('http://' + resourceBaseUrl + '/query_giorni_lav_commessa_utente_mese');

    ref.tableParams = new NgTableParams({
        filter: tablefilter
      },
      {
    		getData : function(params) {
    			console.log('params: ' + JSON.stringify(params, null, '\t'));
    			console.log('params.url(): ' + JSON.stringify(params.url(), null, '\t'));

    			// ajax request to back end
    			return query.get(params.url()).$promise.then(function(data) {
    				var res = [];
    				if (data != null && data.giorniCommessaUtente != null && data.giorniCommessaUtente.length > 0) {
    					console.log('data giorni Commessa Utente: ' + JSON.stringify(data.giorniCommessaUtente, null, '\t'));
    					res = data.giorniCommessaUtente;
    				}
    				return res;
    			});
    		}
    	});

    $scope.saveAllCSV = function() {
      console.log("saving all csv ...");
      var currentData = ref.tableParams.data;
      console.log("currentData: " + JSON.stringify(currentData, null, 2));
      var blob = new Blob([JSON.stringify(currentData, null, 2)], {type : 'application/json'});
      FileSaver.saveAs(blob, 'giorniCommessaUtente.csv');
    };

  }]);
