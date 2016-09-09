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
        var currentDataXLS = getXLS(dataperemployee[employee]);
        zipfolder.file(employee + ".xlsx", currentDataXLS);

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

    function getXLS(data) {
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

      var year = data[0].anno;
      var month = data[0].mese - 1;
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      console.log("year: " + year + "; month: " + month + "; daysInMonth: " + daysInMonth);
      var datestart = new Date(Date.UTC(year, month, 1));
      var dateend = new Date(Date.UTC(year, month, daysInMonth));
      console.log("datestart: " + datestart + "; dateend: " + dateend);

      /* Build data for xls in form of array of arrays */
      var XLSdata = [
        ["Rapporto cliente"],
        ["Data di inizio", datestart, null, "Data di fine", dateend],
        [ null, null, null, null, null],
        ["Cliente", "Progetto", "Codice progetto", "Dipendente", "Role", "Ore"]
      ];

      for (var i = 0, len = data.length; i < len; i++) {
          var line = [];
          if (data[i].hasOwnProperty("codiceNomeCliente")) {
              line.push(data[i]["codiceNomeCliente"]);
          }
          if (data[i].hasOwnProperty("nomeProgetto")) {
              line.push(data[i]["nomeProgetto"]);
          }
          if (data[i].hasOwnProperty("codiceProgetto")) {
              line.push(data[i]["codiceProgetto"]);
          }
          if (data[i].hasOwnProperty("cognomeNomeDipendente")) {
              line.push(data[i]["cognomeNomeDipendente"]);
          }
          line.push(null);
          if (data[i].hasOwnProperty("oreMese")) {
              line.push(data[i]["oreMese"]);
          }
          XLSdata.push(line);
      }

      var ws_name = "Rendicontazione ore";
      var wb = new Workbook();
      var ws = sheet_from_array_of_arrays(XLSdata);

      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      var wbout = XLSX.write(wb,
        {bookType:'xlsx', bookSST:true, type: 'binary'});

      //var blob = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
      //return blob;

      return s2ab(wbout);
    };

    function Workbook() {
      if(!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
    };

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

    function datenum(v, date1904) {
      if(date1904) v+=1462;
      var epoch = Date.parse(v);
      console.log("epoch: " + epoch + "1899: " + new Date(Date.UTC(1899, 11, 30)));
      console.log("diff: " + (epoch - new Date(Date.UTC(1899, 11, 30))));
      console.log("return: " + (epoch - new Date(Date.UTC(1899, 11, 30)))/(24 * 60 * 60 * 1000));
      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    };

    function sheet_from_array_of_arrays(data, opts) {
      var ws = {};
      var columnsWidths = [];
      var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
      for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
          if (range.s.r > R) range.s.r = R;
          if (range.s.c > C) range.s.c = C;
          if (range.e.r < R) range.e.r = R;
          if (range.e.c < C) range.e.c = C;
          if (columnsWidths[C] == null) {
            var prop = {wch: 2};
            columnsWidths.push(prop);
          }

          var cell = {v: data[R][C] };
          if(cell.v == null) continue;
          var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

          var cellLength = 2;
          // cell type
          if (typeof cell.v === 'number') {
            cell.t = 'n';
            cellLength = cell.v.toString().length;
          } else if (typeof cell.v === 'boolean') {
            cell.t = 'b';
          } else if (cell.v instanceof Date) {
            cell.t = 'n';
            cell.z = XLSX.SSF._table[15];
            cell.v = datenum(cell.v);
            cellLength = cell.z.length + 1;
          } else {
            cell.t = 's';
            cellLength = cell.v.length;
          }
          console.log("R: " + R + "C: " + C + "; length: " + cellLength);
          if (cellLength > columnsWidths[C].wch) {
            columnsWidths[C].wch = cellLength;
          }

          // cell style
          cell.s = {font: {bold: true}};
          // header background
          if (R == 3) {
            //cell.s.fill = {bgColor: { rgb: "#ADD8E6" }};
            cell.s.fill = {
              patternType: "solid",
              fgColor: { rgb: "7B68EE" },
              bgColor: { rgb: "CCFFFF" }
            };
            cell.s.font = {
              color: { rgb: "FFFFFF" }
            };
          }

          ws[cell_ref] = cell;
        }
      }
      if(range.s.c < 10000000) {
        ws['!ref'] = XLSX.utils.encode_range(range);
      }

      ws['!cols'] = columnsWidths;

      return ws;
    };

    var XLSreader = document.getElementById('XLSreader');

    function handleFile(e) {
    	var files = e.target.files;
    	var f = files[0];
      var reader = new FileReader();
      var name = f.name;
      reader.onload = function(e) {
        if( typeof console !== 'undefined' ) {
          console.log("onload", new Date());
        }
        var data = e.target.result;
        var wb = XLSX.read(data, {type: 'binary', cellStyles: true});
        process_wb(wb);
      };
      reader.readAsBinaryString(f);
    };

    if (XLSreader != null && XLSreader.addEventListener) {
      XLSreader.addEventListener('change', handleFile, false);
    }

    function process_wb(wb) {
    	var output = "";
      //output = JSON.stringify(to_json(wb), 2, 2);
      output = to_csv(wb);
      var wsList = wb.Sheets;
      console.log("wsList: " + JSON.stringify(wsList, null, '\t'));
      //ws['!cols']
      //console.log("columns properties: " +
      //    wsList["Rendicontazione ore"]['!cols']);

    	if(typeof console !== 'undefined') {
        console.log("output", new Date());
        console.log("output: " + output);
      }
    };

    function to_json(workbook) {
    	var result = {};
    	workbook.SheetNames.forEach(function(sheetName) {
    		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    		if(roa.length > 0){
    			result[sheetName] = roa;
    		}
    	});
    	return result;
    };

    function to_csv(workbook) {
    	var result = [];
    	workbook.SheetNames.forEach(function(sheetName) {
    		var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    		if(csv.length > 0){
    			result.push("SHEET: " + sheetName);
    			result.push("");
    			result.push(csv);
    		}
    	});
    	return result.join("\n");
    };

  }]);
