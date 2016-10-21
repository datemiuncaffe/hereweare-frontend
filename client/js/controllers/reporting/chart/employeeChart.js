angular
	.module("app")
	.controller("EmployeeChartController",
			['$scope', '$stateParams',
			 'crud', 'FileSaver', 'Blob', 'excelgen',
	    function($scope, $stateParams,
				 			 crud, FileSaver, Blob, excelgen) {
		$scope.selectedEmployee = {
			cognomeDipendente: "",
			nomeDipendente: ""
		};
		var selectedInterval = {
			number: 0,
			start: null,
			end: null,
			label: null
		};
		var projectCodes = "";

		// chart
		var chart = {
			data: {
				labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
				series: [
					[5, 2, 4, 2, 0]
				]
			},
			options: {
			  width: 1000,
			  height: 400
			},
			object: null
		};

		console.log('$stateParams: ' +
			JSON.stringify($stateParams, null, '\t'));

		if ($stateParams.cognomeDipendente != null &&
				$stateParams.cognomeDipendente.length > 0) {
			$scope.selectedEmployee.cognomeDipendente =
				$stateParams.cognomeDipendente;
		}
		if ($stateParams.nomeDipendente != null &&
				$stateParams.nomeDipendente.length > 0) {
			$scope.selectedEmployee.nomeDipendente =
				$stateParams.nomeDipendente;
		}
		if ($stateParams.startDate != null &&
				$stateParams.startDate.length > 0) {
			selectedInterval.start =
				$stateParams.startDate;
		}
		if ($stateParams.endDate != null &&
				$stateParams.endDate.length > 0) {
			selectedInterval.end =
				$stateParams.endDate;
		}
		if ($stateParams.projectCodes != null &&
				$stateParams.projectCodes.length > 0) {
			projectCodes = $stateParams.projectCodes;
		}

		search();

		function search() {
			console.log('(search) selectedEmployee: ' +
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
				crud.getReportsByUserNameAndDateIntervalAndProjects({
							firstName: $scope.selectedEmployee.nomeDipendente,
							lastName: $scope.selectedEmployee.cognomeDipendente,
							startDate: selectedInterval.start,
							endDate: selectedInterval.end,
							projectCodes: projectCodes
						}).then(function(report) {
					console.log('report: ' +
						JSON.stringify(report, null, '\t'));

					getChartLabels(chart.data.labels);
					console.log('labels: ' +
						JSON.stringify(chart.data.labels, null, '\t'));

					chart.data.object =
						new Chartist.Line('.ct-chart',
							chart.data, chart.options);

				});
			}
		};

		function getChartLabels(labels){
			var startDay = moment(selectedInterval.start, 'YYYY-MM-DD');
			var endDay = moment(selectedInterval.end, 'YYYY-MM-DD');
			var currentDay = startDay.clone();
			while (currentDay.isSameOrBefore(endDay)) {
				var currentDayLabel = currentDay.format('YYYY-MM-DD');
				labels.push(currentDayLabel);
				currentDay = currentDay.add(1, 'days');
			}
		};

	}]);
