angular
  .module('ehourqueries')
  .controller('GiorniCommessaUtenteController',
      ['$scope', '$state', 'NgTableParams', '$resource', 'resourceBaseUrl',
       '$stateParams', 'FileSaver', 'Blob', 'excelgen', '$rootScope',
      function($scope, $state, NgTableParams, $resource, resourceBaseUrl,
        $stateParams, FileSaver, Blob, excelgen, $rootScope) {
	  var ref = this;

    var now = moment();
    var currentYear = now.year();
    var currentMonth = now.month();
    console.log('inside GiorniCommessaUtenteController: year = ' +
        currentYear + '; month = ' + currentMonth);

    // set table filter
    var tablefilter = {
      anno: currentYear,
      meseIn: currentMonth,
      meseFin: currentMonth
    };

    /* ---------------------------- */
    /* ---- custom table grouping ---- */
    /* ---------------------------- */

    var groupByMonth = function(item) {
      return item.mese;
    };
    groupByMonth.title = "Mese";
    groupByMonth.sortDirection = "asc";

    $scope.tableGrouping = {
      items: ["mese", "cognomeDipendente"],
      selected: ["mese"],
      toggle: function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          //list = [];
          list.push(item);
        }
      },
      exists: function(item, list) {
        return list.indexOf(item) > -1;
      },
      isIndeterminate: function() {
        return ($scope.tableGrouping.selected.length !== 0 &&
                $scope.tableGrouping.selected.length !==
                $scope.tableGrouping.items.length);
      },
      isChecked: function() {
        return $scope.tableGrouping.selected.length ===
               $scope.tableGrouping.items.length;
      },
      toggleAll: function() {
        if ($scope.tableGrouping.selected.length ===
            $scope.tableGrouping.items.length) {
          $scope.tableGrouping.selected = [];
        } else if ($scope.tableGrouping.selected.length === 0 ||
                   $scope.tableGrouping.selected.length > 0) {
          $scope.tableGrouping.selected =
            $scope.tableGrouping.items.slice(0);
        }
      },
      grouptable: function() {
        console.log('grouping by: ' +
          JSON.stringify($scope.tableGrouping.selected, null, '\t'));
        return $scope.tableGrouping.selected[0];
      }
    };

    /* ------------------------------- */
    /* ---- end custom table grouping ---- */
    /* ------------------------------- */

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
        //group: "cognomeDipendente"
        //group: $scope.tableGrouping.grouptable
      },
      {
    		getData : function(params) {
    			console.log('params: ' + JSON.stringify(params, null, '\t'));
    			console.log('params.url(): ' +
            JSON.stringify(params.url(), null, '\t'));
          console.log('params.group(): ' +
            JSON.stringify(params.group(), null, '\t'));

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
    ref.monthFilterByInterval = {
      meseIn: './../../../templates/table/filters/startMonth.html',
      meseFin: './../../../templates/table/filters/endMonth.html'
    };

    $scope.isLastPage = function() {
      return ref.tableParams.page() === $scope.totalPages();
    };

    $scope.totalPages = function(){
      return Math.ceil(ref.tableParams.total() /
        ref.tableParams.count());
    };

    $scope.sumGroupedHours = function(data, field) {
      var sum = 0;
      data.forEach(function(item){
        if (item[field] != null &&
            item[field].length > 0) {
          var dottedValue = item[field].replace(",",".");
          sum += parseFloat(dottedValue);
        }
      });
      return sum.toFixed(2);
    };
    $scope.sumTotalHours = function(groups, field) {
      var data = [];
      groups.forEach(function(group){
        if (group.data != null &&
            group.data.length > 0) {
          data = data.concat(group.data);
        }
      });
      var sum = $scope.sumGroupedHours(data, field);
      return sum;
    };

    /* ------------------- */
    /* ----- scopes ---------- */
    /* ---------------------- */
    $scope.scopeBrowser = {
      byId: '',
      selector: ''
    };
    $scope.getScopes = function() {
      var res = getScopesFromRoot($rootScope);
      //console.log('res: ' +
      //  JSON.stringify(res, null, '\t'));
      console.log('res: ' +
        JSON.stringify(res, null, '\t'));
    };
    $scope.getSingleScope = function() {
      // var elem = angular.element("section#ggcommessautente");
      // var scopeelem = elem.scope();
      // var scopeelemkeys = Object.keys(scopeelem);
      // console.log('scopeelem keys: ' +
      //   JSON.stringify(scopeelemkeys, null, '\t'));

      var selector = $scope.scopeBrowser.selector;
      console.log('selector: ' + selector);

      var table = angular
        .element(selector);
      var tableElemScope = table.scope();
      var tableElemScopeKeys = Object.keys(tableElemScope);
      console.log('tableElemScopeKeys: ' +
        JSON.stringify(tableElemScopeKeys, null, '\t'));
      console.log('id = ' + tableElemScope.$id);

      /* ------------ children -------*/
      var firstChildren = tableElemScope.$$childHead;
      console.log('firstChildren: ' + firstChildren);

      var tableChildren = getScopesFromRoot(tableElemScope);
      console.log('tableChildren: ' +
        JSON.stringify(tableChildren, null, '\t'));

      // tableChildren.forEach(function(child){
      //   console.log('child Keys: ' +
      //     JSON.stringify(Object.keys(child), null, '\t') +
      //     '; id: ' + child.$id);
      //   if (child.groupBy) {
      //     console.log('groupBy fn : ' + child.groupBy);
      //   }
      // });
      //
      // console.log('groupBy ??? : ' + $rootScope.groupBy);
      //
      // var groupRow = tableElemScope.$groupRow;
      // var groupRowKeys = Object.keys(groupRow);
      // console.log('groupRowKeys: ' +
      //   JSON.stringify(groupRowKeys, null, '\t'));
      //
      // var tableElemIsoScope = table.isolateScope();
      // if (tableElemIsoScope !== undefined) {
      //   var tableElemIsoScopeKeys = Object.keys(tableElemIsoScope);
      //   console.log('tableElemIsoScopeKeys: ' +
      //     JSON.stringify(tableElemIsoScopeKeys, null, '\t'));
      // }

    };

    function getScopesFromRoot(root) {
      var scopes = {};

      if (root != null && root.$id != null) {
        traverse(root, null);
      }

      function visit(scope, parent) {
        if (parent == null) {
          scopes.id = scope.$id;
          scopes.par = null;
          scopes.ch = [];
          return scopes;
        } else {
          var child = {
            id: scope.$id,
            par: parent.id,
            ch: []
          };
          parent.ch.push(child);
          return child;
        }
      }
      function traverse(scope, parent) {
          var child = visit(scope, parent);
          if (scope.$$nextSibling)
              traverse(scope.$$nextSibling, parent);
          if (scope.$$childHead)
              traverse(scope.$$childHead, child);
      }

      return scopes;
    }

    $scope.getSingleScopeById = function() {
      var id = $scope.scopeBrowser.byId;
      var el = getScope(id);
      console.log("el: " + el);
    };
    function getScope(id) {
      console.log("id: " + id);
      var elem;
      $('.ng-scope').each(function(){
        var s = angular.element(this).scope(),
            sid = s.$id;
        console.log('sid: ' + sid);
        if(sid == id) {
            elem = this;
            return false; // stop looking at the rest
        }
      });
      return elem;
    }
    /* ------ */

    $scope.saveCSV = function() {
      console.log("saving csv ...");
      var currentData = ref.tableParams.data;
      console.log("currentData: " + JSON.stringify(currentData, null, 2));

      var zip = new JSZip();
      var zipfolder = zip.folder("orefatturate");

      var currentGroup = Object.keys(ref.tableParams.group())[0];
      console.log("currentGroup: " +
        JSON.stringify(currentGroup, null, 2));
      var currentDataCSV = getCSV(currentData, currentGroup);
      var fileName = "reportBy" + currentGroup;

      zipfolder.file(fileName + ".csv", currentDataCSV);
      zipfolder.generateAsync({type:"blob"})
              .then(function (blob) {
                FileSaver.saveAs(blob, 'giorniCommessaUtente.zip');
              });
    };

    $scope.saveXLS = function() {
      console.log("saving excel ...");
      var currentData = ref.tableParams.data;
      console.log("currentData: " + JSON.stringify(currentData, null, 2));

      var zip = new JSZip();
      var zipfolder = zip.folder("orefatturate");

      var currentGroup = Object.keys(ref.tableParams.group())[0];
      var currentDataXLS = getXLS(currentData, currentGroup);
      var fileName = "reportBy" + currentGroup;

      zipfolder.file(fileName + ".xlsx", currentDataXLS);
      zipfolder.generateAsync({type:"blob"})
              .then(function (blob) {
                FileSaver.saveAs(blob, 'giorniCommessaUtente.zip');
              });
    };

    function getCSV(groups, groupName) {
      var csv = "";
      csv += "Ore erogate\n";
      csv += ",\n";

      groups.forEach(function(group) {
        // header
        if (groupName === "mese") {
          var month = group.value;
          var currentmonth = moment({month:(group.value - 1)});
          var datestart = currentmonth.date(1).format("D-MMM-YY");
          var dateend = currentmonth.date(currentmonth.daysInMonth()).format("D-MMM-YY");
          console.log("datestart: " + datestart + "; dateend: " + dateend);
          csv += "Data di inizio," + datestart + ",,Data di fine," + dateend + "\n";
          csv += ",,,,,\n";
        } else {
          csv += group.value + ",\n";
          csv += ",\n";
        }

        // body and sum
        var ret = [];
        var header = ["Cliente", "Progetto", "Codice progetto", "Dipendente", "Role", "Ore"];
        ret.push('"' + header.join('","') + '"');

        var groupdata = group.data;
        for (var i = 0, len = groupdata.length; i < len; i++) {
            var line = [];
            if (groupdata[i].hasOwnProperty("codiceNomeCliente")) {
              line.push('"' + groupdata[i]["codiceNomeCliente"] + '"');
            } else {
              line.push('""');
            }
            if (groupdata[i].hasOwnProperty("nomeProgetto")) {
              line.push('"' + groupdata[i]["nomeProgetto"] + '"');
            } else {
              line.push('""');
            }
            if (groupdata[i].hasOwnProperty("codiceProgetto")) {
              line.push('"' + groupdata[i]["codiceProgetto"] + '"');
            } else {
              line.push('""');
            }
            if (groupdata[i].hasOwnProperty("cognomeNomeDipendente")) {
              line.push('"' + groupdata[i]["cognomeNomeDipendente"] + '"');
            } else {
              line.push('""');
            }
            line.push('""');
            if (groupdata[i].hasOwnProperty("oreMese")) {
              line.push('"' + groupdata[i]["oreMese"] + '"');
            } else {
              line.push('""');
            }
            ret.push(line.join(','));
        }
        var linesum = ",,,," + "Totale ore," +
          $scope.sumGroupedHours(groupdata, "oreMese");
        ret.push(linesum);
        csv += ret.join('\n');
        csv += "\n";
        csv += ",,,,,,\n";
      });

      // total sum
      var linetotsum = ",,,," + "Totale complessivo ore," +
        $scope.sumTotalHours(groups, "oreMese") + ",\n";
      csv += linetotsum;

      return csv;
    };

    function getXLS(groups, groupName) {
      /* Build data for xls in form of array of arrays */
      var XLSdata = [
        ["Ore erogate"]
      ];
      var XLSoptions = [
        [null]
      ];
      XLSdata.push([null]);
      XLSoptions.push([null]);

      groups.forEach(function(group) {
        // header
        if (groupName === "mese") {
          var year = group.data[0].anno;
          var month = group.value - 1;
          var daysInMonth = new Date(year, month + 1, 0).getDate();
          console.log("year: " + year + "; month: " + month + "; daysInMonth: " + daysInMonth);
          var datestart = new Date(Date.UTC(year, month, 1));
          var dateend = new Date(Date.UTC(year, month, daysInMonth));
          console.log("datestart: " + datestart + "; dateend: " + dateend);
          XLSdata.push(["Data di inizio", datestart,
            null, "Data di fine", dateend]);
          XLSoptions.push([null, null, null, null, null]);
        } else {
          XLSdata.push([group.value]);
          XLSoptions.push([null]);
        }
        XLSdata.push([null, null, null, null, null]);
        XLSoptions.push([null, null, null, null, null]);

        // body and sum
        XLSdata.push(["Cliente", "Progetto", "Codice progetto",
          "Dipendente", "Role", "Ore"]);
        var headeropts = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "7B68EE" },
            bgColor: { rgb: "CCFFFF" }
          },
          font: {
            color: { rgb: "FFFFFF" }
          }
        };
        XLSoptions.push([headeropts, headeropts, headeropts,
          headeropts, headeropts, headeropts]);

        var groupdata = group.data;
        for (var i = 0, len = groupdata.length; i < len; i++) {
            var line = [];
            if (groupdata[i].hasOwnProperty("codiceNomeCliente")) {
              line.push(groupdata[i]["codiceNomeCliente"]);
            } else {
              line.push(null);
            }
            if (groupdata[i].hasOwnProperty("nomeProgetto")) {
              line.push(groupdata[i]["nomeProgetto"]);
            } else {
              line.push(null);
            }
            if (groupdata[i].hasOwnProperty("codiceProgetto")) {
              line.push(groupdata[i]["codiceProgetto"]);
            } else {
              line.push(null);
            }
            if (groupdata[i].hasOwnProperty("cognomeNomeDipendente")) {
              line.push(groupdata[i]["cognomeNomeDipendente"]);
            } else {
              line.push(null);
            }
            line.push(null);
            if (groupdata[i].hasOwnProperty("oreMese")) {
              line.push(groupdata[i]["oreMese"]);
            } else {
              line.push(null);
            }
            XLSdata.push(line);
            XLSoptions.push([null, null, null, null, null, null]);
        }
        XLSdata.push([null, null, null, null, "Totale ore",
          $scope.sumGroupedHours(groupdata, "oreMese")]);
        XLSoptions.push([null, null, null, null, null, null]);
        XLSdata.push([null, null, null, null, null, null]);
        XLSoptions.push([null, null, null, null, null, null]);
      });

      // total sum
      XLSdata.push([null, null, null, null, "Totale complessivo ore",
        $scope.sumTotalHours(groups, "oreMese")]);
      XLSoptions.push([null, null, null, null, null, null]);

      var ws_name = "Rendicontazione ore";
      var wb = new excelgen.Workbook();
      console.log('wb: ' + JSON.stringify(wb, null, '\t'));
      var ws = excelgen.sheet_from_array_of_arrays(XLSdata, XLSoptions);

      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      var wbout = XLSX.write(wb,
        {bookType:'xlsx', bookSST:true, type: 'binary'});

      return excelgen.s2ab(wbout);
    };

    /* ----- reader ------ */
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
