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

      var dataperemployee = groupDataPerEmployee(currentData);

      var zip = new JSZip();
      var zipfolder = zip.folder("orefatturate");

      var employees = Object.keys(dataperemployee).sort();
      console.log("employees: " + JSON.stringify(employees, null, '\t'));
      employees.forEach(function(employee){
        var currentDataCSV = getCSV(dataperemployee[employee]);
        console.log("currentDataCSV: " + JSON.stringify(currentDataCSV, null, '\n'));
        zipfolder.file(employee + ".csv", currentDataCSV);

        // var blob = new Blob([currentDataCSV], {type : 'application/json'});
        // console.log("blob: " + JSON.stringify(blob, null, '\t'));
      });
      zipfolder.generateAsync({type:"blob"})
              .then(function (blob) {
                FileSaver.saveAs(blob, 'giorniCommessaUtente.zip');
              });
    };

    function groupDataPerEmployee(currentData) {
      var dataperemployee = {};
      currentData.forEach(function(currentData){
        if (dataperemployee.hasOwnProperty(currentData.nomeDipendente)) {
          console.log("already present");
          dataperemployee[currentData.nomeDipendente].push(currentData);
        } else {
          console.log("add");
          dataperemployee[currentData.nomeDipendente] = [];
          dataperemployee[currentData.nomeDipendente].push(currentData);
        }
      });
      console.log("dataperemployee: " + JSON.stringify(dataperemployee, null, '\t'));
      return dataperemployee;
    };

    function getCSV(data) {
      data.sort(function(a, b) {
        var codiceNomeClienteA = a.codiceNomeCliente.toUpperCase(); // ignore upper and lowercase
        var codiceNomeClienteB = b.codiceNomeCliente.toUpperCase(); // ignore upper and lowercase

        if (codiceNomeClienteA < codiceNomeClienteB) {
          return -1;
        } else if (codiceNomeClienteA > codiceNomeClienteB) {
          return 1;
        } else { // equality
          var nomeProgettoA = a.nomeProgetto.toUpperCase();
          var nomeProgettoB = b.nomeProgetto.toUpperCase();
          if (nomeProgettoA < nomeProgettoB) {
            return -1;
          } else if (nomeProgettoA > nomeProgettoB) {
            return 1;
          }
          // must be equal
          return 0;
        }
      });

      var csv = "";
      csv += "Rapporto cliente\n";

      var month = data[0].mese;
      var currentmonth = moment({month:(data[0].mese - 1)});
      var datestart = currentmonth.date(1).format("D-MMM-YY");
      var dateend = currentmonth.date(currentmonth.daysInMonth()).format("D-MMM-YY");
      console.log("datestart: " + datestart + "; dateend: " + dateend);
      csv += "Data di inizio," + datestart + ",,Data di fine," + dateend + "\n";
      csv += ",,,,,\n";

      var ret = [];
      var header = ["Cliente", "Progetto", "Codice progetto", "Dipendente", "Role", "Ore"];
      ret.push('"' + header.join('","') + '"');

      for (var i = 0, len = data.length; i < len; i++) {
          var line = [];
          if (data[i].hasOwnProperty("codiceNomeCliente")) {
              line.push('"' + data[i]["codiceNomeCliente"] + '"');
          }
          if (data[i].hasOwnProperty("nomeProgetto")) {
              line.push('"' + data[i]["nomeProgetto"] + '"');
          }
          if (data[i].hasOwnProperty("codiceProgetto")) {
              line.push('"' + data[i]["codiceProgetto"] + '"');
          }
          if (data[i].hasOwnProperty("cognomeNomeDipendente")) {
              line.push('"' + data[i]["cognomeNomeDipendente"] + '"');
          }
          line.push('""');
          if (data[i].hasOwnProperty("oreMese")) {
              line.push('"' + data[i]["oreMese"] + '"');
          }
          ret.push(line.join(','));
      }

      csv += ret.join('\n');
      return csv;
    };

  }]);
