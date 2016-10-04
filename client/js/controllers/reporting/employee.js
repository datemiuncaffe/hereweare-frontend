angular
	.module("app")
	.controller("EmployeeReportingController",
			['$scope', '$resource', '$state', 'crud', '$q',
			 'FileSaver', 'Blob', 'excelgen',
	    function($scope, $resource, $state, crud, $q,
							 FileSaver, Blob, excelgen) {
		$scope.employees = null;
		$scope.selectedEmployee = {};
		$scope.reportIntervals = {
			weeks: [{
				number: 0,
				start: null,
				end: null,
				label: 'Seleziona la settimana'
			}],
			months: [{
				number: 0,
				start: null,
				end: null,
				label: 'Seleziona il mese'
			}],
			quarters: [{
				number: 0,
				start: null,
				end: null,
				label: 'Seleziona il trimestre'
			}]
		};
		var selectedInterval = {
			number: 0,
			start: null,
			end: null,
			label: null
		};

		var monthsNames = ['Gennaio','Febbraio','Marzo','Aprile',
						'Maggio', 'Giugno','Luglio','Agosto','Settembre',
						'Ottobre', 'Novembre','Dicembre'];
		var monthsBack = 12;
		var monthsAhead = 2;
		var now = moment();
		var startDay = now.clone().subtract(monthsBack, 'months');
		var endDay = now.clone().add(monthsAhead, 'months');
		var currentMonthIndex = 0;
		var datatoexport = {};

		$q
		.all([
				crud.getActiveUsers()
		])
		.then(
			function(data) {
				var employees = data[0];
				$scope.employees = employees;
				$scope.selectedEmployee = employees[0];
				getReportIntervals($scope.reportIntervals.weeks,
													 $scope.reportIntervals.months,
												 	 $scope.reportIntervals.quarters);
				$scope.selectedWeek = $scope.reportIntervals.weeks[0];
				$scope.selectedMonth =
					$scope.reportIntervals.months[currentMonthIndex-1];
				$scope.selectedQuarter = $scope.reportIntervals.quarters[0];

				selectedInterval.start =
					$scope.reportIntervals.months[currentMonthIndex-1].start;
				selectedInterval.end =
					$scope.reportIntervals.months[currentMonthIndex-1].end;

				$scope.search();
			});

		$scope.onEmployeeChange = function() {
			console.log('selectedEmployee: ' +
				$scope.selectedEmployee.cognomeDipendente +
				'-' + $scope.selectedEmployee.nomeDipendente);
			$scope.search();
		};

		$scope.onWeekChange = function() {
			console.log('selectedWeek: ' +
				$scope.selectedWeek.label);
			$scope.selectedMonth = $scope.reportIntervals.months[0];
			$scope.selectedQuarter = $scope.reportIntervals.quarters[0];
			selectedInterval.start = $scope.selectedWeek.start;
			selectedInterval.end = $scope.selectedWeek.end;
			$scope.search();
		};

		$scope.onMonthChange = function() {
			console.log('selectedMonth: ' +
				$scope.selectedMonth.label);
			$scope.selectedWeek = $scope.reportIntervals.weeks[0];
			$scope.selectedQuarter = $scope.reportIntervals.quarters[0];
			selectedInterval.start = $scope.selectedMonth.start;
			selectedInterval.end = $scope.selectedMonth.end;
			$scope.search();
		};

		$scope.onQuarterChange = function() {
			console.log('selectedQuarter: ' +
				$scope.selectedQuarter.label);
			$scope.selectedWeek = $scope.reportIntervals.weeks[0];
			$scope.selectedMonth = $scope.reportIntervals.months[0];
			selectedInterval.start = $scope.selectedQuarter.start;
			selectedInterval.end = $scope.selectedQuarter.end;
			$scope.search();
		};

		$scope.search = function() {
			console.log('selectedEmployee: ' +
				JSON.stringify($scope.selectedEmployee, null, '\t'));

			if ($scope.selectedEmployee != null &&
					$scope.selectedEmployee.cognomeDipendente != null &&
					$scope.selectedEmployee.cognomeDipendente.length > 0 &&
					$scope.selectedEmployee.nomeDipendente != null &&
					$scope.selectedEmployee.nomeDipendente.length > 0) {
				console.log('searching for employee ' +
										$scope.selectedEmployee.cognomeDipendente +
										'-' + $scope.selectedEmployee.nomeDipendente);

				// query ehour
				crud.getReportsByUserNameAndDateInterval({
							firstName: $scope.selectedEmployee.nomeDipendente,
							lastName: $scope.selectedEmployee.cognomeDipendente,
							startDate: selectedInterval.start,
							endDate: selectedInterval.end
						}).then(function(report) {
					console.log('report: ' +
						JSON.stringify(report, null, '\t'));

					var footerdata = [
						{
							id:	{
								cognome: $scope.selectedEmployee.cognomeDipendente,
								nome:	$scope.selectedEmployee.nomeDipendente,
								startDate: selectedInterval.start,
								endDate: selectedInterval.end
							},
							cells: [
								{value: 'TOTALE ORE:', colspan: 7},
								{value: report.oretotali, colspan: 1}
							]
						}
					];
					// render the table
					tabulate(report.inserimenti,
							["data", "cliente", "progetto", "codiceProgetto",
						 	 "dipendente", "ruolo", "commento", "ore"],
						 	footerdata);

					datatoexport.header = ["Data","Cliente","Progetto",
						"Codice progetto", "Dipendente", "Ruolo",
						"Commento", "Ore"];
					datatoexport.rows = report.inserimenti;
					datatoexport.footer = footerdata;
				});
			}
		};

		var table = d3.select("form[name=employeeReportForm] " +
									"div.search_results")
									.append("table")
									.attr("style", "table-layout:fixed;"),
				thead = table.append("thead"),
				tbody = table.append("tbody");
				tfoot = table.append("tfoot");

		// append the header row
		thead.append("tr")
				.selectAll("th")
				.data(["DATA", "CLIENTE",
							 "PROGETTO", "CODICE PROGETTO",
						 	 "DIPENDENTE", "RUOLO",
						 	 "COMMENTO", "ORE"])
				.enter()
				.append("th")
				.attr("style", "white-space: nowrap;")
				.text(function(column) {
					return column;
				});

		// The table generation function
		function tabulate(data, columns, footerdata) {

			// create a row for each object in the data
			var rows = tbody.selectAll("tr")
					.data(data,	function(d) {
						return (d.data + d.progetto +
							d.dipendente + d.ruolo);
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

			//footer
			var footerrow = tfoot.selectAll("tr")
					.data(footerdata,	function(d) {
						return (d.id.cognome + d.id.nome +
							d.id.startDate + d.id.endDate);
					});

			var footerrowEnter = footerrow.enter()
				.insert("tr");

			var footercells = footerrowEnter.selectAll("td")
			    .data(function(row) {
			      return row.cells;
			    })
			    .enter()
			    .append("td")
			    .attr("style", "word-wrap:break-word;") // sets the font style
					.attr('colspan', function(d) {
						return d.colspan;
					})
					.text(function(d) {
						return d.value;
					});

			var footerrowExit = footerrow.exit().remove();

			return table;
		};

		function getReportIntervals(reportWeeks,
							reportMonths, reportQuarters) {
			var currentDay = startDay;
			var weeks = {};
			var months = {};
			var quarters = {};
			while (currentDay.year() < endDay.year() ||
						 (currentDay.week() <= endDay.week() &&
						  currentDay.year() == endDay.year())) {
				var currentDayOfWeek = currentDay.clone();
				var numberOfWeek = currentDayOfWeek.week() + '-' +
						currentDayOfWeek.endOf('week').year();
				var startOfWeek = currentDayOfWeek.startOf('week')
						.format('YYYY-MM-DD');
				var endOfWeek = currentDayOfWeek.endOf('week')
						.format('YYYY-MM-DD');
				var labelOfWeek = currentDayOfWeek.week() + ': (' +
						startOfWeek + ' | ' + endOfWeek + ')';

				weeks[numberOfWeek] = {
					number: numberOfWeek,
					start: startOfWeek,
					end: endOfWeek,
					label: labelOfWeek
				};

				var currentDayOfMonth = currentDay.clone();
				var numberOfMonth = currentDayOfMonth.month() + '-' +
						currentDayOfMonth.endOf('month').year();
				var startOfMonth = currentDayOfMonth.startOf('month')
						.format('YYYY-MM-DD');
				var endOfMonth = currentDayOfMonth.endOf('month')
						.format('YYYY-MM-DD');
				var labelOfMonth = currentDayOfMonth.endOf('month').year() +
						'-' + monthsNames[currentDayOfMonth.month()] + ': (' +
						startOfMonth + ' | ' + endOfMonth + ')';

				if (months[numberOfMonth] == null) {
					months[numberOfMonth] = {
						number: numberOfMonth,
						start: startOfMonth,
						end: endOfMonth,
						label: labelOfMonth
					};
				}

				var currentDayOfQuarter = currentDay.clone();
				var numberOfQuarter = currentDayOfQuarter.quarter() + '-' +
						currentDayOfQuarter.endOf('quarter').year();
				var startOfQuarter = currentDayOfQuarter.startOf('quarter')
						.format('YYYY-MM-DD');
				var endOfQuarter = currentDayOfQuarter.endOf('quarter')
						.format('YYYY-MM-DD');
				var labelOfQuarter = currentDayOfQuarter.endOf('quarter').year() +
						'-' + currentDayOfQuarter.quarter() + ': (' +
						startOfQuarter + ' | ' + endOfQuarter + ')';

				if (quarters[numberOfQuarter] == null) {
					quarters[numberOfQuarter] = {
						number: numberOfQuarter,
						start: startOfQuarter,
						end: endOfQuarter,
						label: labelOfQuarter
					};
				}
				//console.log('currentDay: ' + currentDay.toString());
				currentDay = currentDay.add(1, 'weeks');
			}
			//console.log('weeks: ' + JSON.stringify(weeks, null, '\t'));
			//return weeks;
			var weeksKeys = Object.keys(weeks);
			weeksKeys.forEach(function(key) {
				reportWeeks.push(weeks[key]);
			});
			var monthsKeys = Object.keys(months);
			var currentnumberOfMonth = now.month() + '-' +
						now.endOf('month').year();
			monthsKeys.forEach(function(key) {
				if (currentnumberOfMonth == months[key].number) {
					currentMonthIndex = reportMonths.length;
					months[key].label = 'mese corrente';
				}
				reportMonths.push(months[key]);
			});
			var quartersKeys = Object.keys(quarters);
			quartersKeys.forEach(function(key) {
				reportQuarters.push(quarters[key]);
			});
		};

		/* ---- export csv/excel ---- */
		$scope.export = function() {
      console.log("export csv/excel ...");
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
      var currentDataXLS = getXLS(currentData);
      zipfolder.file(filename + ".xlsx", currentDataXLS);
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
      }

			// ore totali
			XLSdata.push([ null, null, null,
				null, null, null,
				data.footer[0].cells[0].value,
				data.footer[0].cells[1].value]);

      var ws_name = "Rendicontazione ore " + data.rows[0].dipendente;
      var wb = new excelgen.Workbook();
      console.log('wb: ' + JSON.stringify(wb, null, '\t'));
      var ws = excelgen.sheet_from_array_of_arrays(XLSdata);

      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      var wbout = XLSX.write(wb,
        {bookType:'xlsx', bookSST:true, type: 'binary'});

      return excelgen.s2ab(wbout);
    };

	}]);
