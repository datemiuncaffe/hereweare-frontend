angular
	.module("app")
	.controller("EmployeeCostsController",
			['$scope', '$stateParams', 'crud', 'FileSaver', 'Blob', 'excelgen',
	    function($scope, $stateParams, crud, FileSaver, Blob, excelgen) {

		var datatoexport = {};

		loadEmployeeCosts();

		function loadEmployeeCosts() {
			// query redis
			crud.getEmployeeCosts({
						key: 'EHOUR_USERS',
						datatype: 'zset'
					}).then(function(data) {
				console.log('data: ' +
					JSON.stringify(data, null, '\t'));

				var footerdata = ["", "", "", "", "", ""];
				// render the table
				tabulate(data.result.EHOUR_USERS,
					["userId", "firstName", "lastName",
					 "userName", "email", "internalCost"]);

				datatoexport.header = ["USER_ID", "FIRST_NAME", "LAST_NAME",
							 "USERNAME", "EMAIL", "COSTO INTERNO"];
				datatoexport.rows = data.result.ehourUsers;
				datatoexport.footer = footerdata;
			});
		};

		var table = d3.select("form[name=employeeCostsForm] " +
									"div.employee_costs")
									.append("table")
									.attr("style", "table-layout:fixed;"),
				thead = table.append("thead"),
				tbody = table.append("tbody");
				tfoot = table.append("tfoot");

		// append the header row
		thead.append("tr")
				.selectAll("th")
				.data(["ID", "NOME", "COGNOME",
							 "USERNAME", "EMAIL", "COSTO INTERNO"])
				.enter()
				.append("th")
				.attr("style", "white-space: nowrap;")
				.text(function(column) {
					return column;
				});

		// footer
		tfoot.append("tr")
				.selectAll("td")
				.data(["", "", "", "", "", ""])
				.enter()
				.append("td")
				.attr("style", "word-wrap:break-word;") // sets the font style
				.text(function(d) {
					return d;
				});

		// The table generation function
		function tabulate(data, columns) {

			// create a row for each object in the data
			var rows = tbody.selectAll("tr")
					.data(data,	function(d) {
						return d.userId;
					});

			// create a row for each object in the data
			var rowsEnter = rows.enter()
				.insert("tr");

			// create a cell in each row for each column
			var cells = rowsEnter.selectAll("td")
			    .data(function(row) {
			        return columns.map(function(column) {
			            return {column: column, value: row[column]};
			        });
			    })
			    .enter()
			    .append("td")
			    .attr("style", "word-wrap:break-word;") // sets the font style
				.html(function(d) { return d.value });

			var rowsExit = rows.exit().remove();

			return table;
		};

		/* ---- export xls/csv ---- */
		$scope.exportXLS = function() {
      console.log("export excel ...");
      var currentData = datatoexport;
      console.log("currentData: " +
				JSON.stringify(currentData, null, 2));

      var zip = new JSZip();
      var zipfolder = zip.folder("orefatturate");
			var filename = $scope.selectedEmployee.cognomeDipendente +
				'-' + $scope.selectedEmployee.nomeDipendente;

      var currentDataXLS = getXLS(currentData);
    	console.log("currentDataXLS: " +
				JSON.stringify(currentDataXLS, null, '\n'));
      zipfolder.file(filename + ".xlsx", currentDataXLS);
			zipfolder.generateAsync({type:"blob"})
			    .then(function (blob) {
			      FileSaver.saveAs(blob, filename + '.zip');
			    });
    };

		$scope.exportCSV = function() {
      console.log("export csv ...");
      var currentData = datatoexport;
      console.log("currentData: " +
				JSON.stringify(currentData, null, 2));

      var zip = new JSZip();
      var zipfolder = zip.folder("orefatturate");
			var filename = $scope.selectedEmployee.cognomeDipendente +
				'-' + $scope.selectedEmployee.nomeDipendente;

      var currentDataCSV = getCSV(currentData);
    	console.log("currentDataCSV: " +
				JSON.stringify(currentDataCSV, null, '\n'));
      zipfolder.file(filename + ".csv", currentDataCSV);
      zipfolder.generateAsync({type:"blob"})
			    .then(function (blob) {
			      FileSaver.saveAs(blob, filename + '.zip');
			    });
    };

    function getCSV(data) {
      var csv = "";
      csv += "Rapporto dettagliato\n";

		  var datestart =
				moment(data.rows[0].data, "DD/MM/YY")
				.format("D-MMM-YY");
      var dateend =
				moment(data.rows[data.rows.length - 1].data, "DD/MM/YY")
				.format("D-MMM-YY");
      console.log("datestart: " + datestart + "; dateend: " + dateend);
      csv += "Data di inizio," + datestart + ",," +
						 "Data di fine," + dateend + "\n";
      csv += ",,,,,\n";

      var ret = [];
      var header = data.header;
      ret.push('"' + header.join('","') + '"');

      for (var i = 0, len = data.rows.length; i < len; i++) {
        var line = [];
				var keys = Object.keys(data.rows[0]);
				keys.forEach(function(key){
					if (data.rows[i][key] != null &&
							key == "data") {
						line.push('"' +
							moment(data.rows[i].data, "DD/MM/YY")
							.format("D-MMM-YY") +
							'"');
					} else if (data.rows[i][key] != null) {
						line.push('"' + data.rows[i][key] + '"');
					} else {
						line.push('""');
					}
				});
        ret.push(line.join(','));
      }

      csv += ret.join('\n') + "\n";

			// ore totali
			csv += ",,,,,," +
				data.footer[0].cells[0].value +
				"," +
				data.footer[0].cells[1].value +
				"\n";
      return csv;
    };

    function getXLS(data) {
      var datestart =
				moment(data.rows[0].data, "DD/MM/YY")
				.format("D-MMM-YY");
      var dateend =
				moment(data.rows[data.rows.length - 1].data, "DD/MM/YY")
				.format("D-MMM-YY");
      console.log("datestart: " + datestart + "; dateend: " + dateend);

      /* Build data for xls in form of array of arrays */
      var XLSdata = [
        ["Rapporto dettagliato"],
        ["Data di inizio", datestart, null, "Data di fine", dateend],
        [ null, null, null, null, null],
        data.header
      ];
			var headeropts = {
				fill: {
					patternType: "solid",
					fgColor: { rgb: "165697" },
					bgColor: { rgb: "165697" }
				},
				font: {
					color: { rgb: "FFFFFF" }
				}
			};
			var XLSoptions = [
        [null],
				[ null, null, null, null, null],
				[ null, null, null, null, null],
				Array(8).fill(headeropts)
      ];

      for (var i = 0, len = data.rows.length; i < len; i++) {
        var line = [];
				var keys = Object.keys(data.rows[0]);
				keys.forEach(function(key){
					if (data.rows[i][key] != null &&
							key == "data") {
						line.push(moment(data.rows[i].data, "DD/MM/YY")
							.format("D-MMM-YY"));
					} else if (data.rows[i][key] != null) {
						line.push(data.rows[i][key]);
					} else {
						line.push(null);
					}
				});
        XLSdata.push(line);
				XLSoptions.push(Array(keys.length).fill(null));
      }

			// ore totali
			XLSdata.push([ null, null, null,
				null, null, null,
				data.footer[0].cells[0].value,
				data.footer[0].cells[1].value]);
			XLSoptions.push(Array(8).fill(null));

      var ws_name = "Rendicontazione ore " + data.rows[0].dipendente;
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

	}]);
