angular
	.module("app")
	.controller("ProjectModifyController", ['$scope', '$resource', '$q', '$stateParams', 'crud', 'resourceBaseUrl',
	                                        function($scope, $resource, $q, $stateParams, crud, resourceBaseUrl) {
			/* entities */
	    $scope.customer = {
	    	name: null
	    };

	    $scope.project = {
	    	name: null,
	    	code: null,
	    	from: null,
	    	to: null,
	    	budgettot: null,
	    	daystot: null,
	    	customerId: null,
	    	budgets: []
	    };
	    /* end entities */

	    /* loading project */
	    if ($stateParams != null &&
	    	$stateParams.code != null && $stateParams.code.length > 0 &&
	    	$stateParams.customer != null && $stateParams.customer.length > 0) {
		    	console.log('Project code: ' + $stateParams.code + '; customer: ' + decodeURI($stateParams.customer));
		    	var queryUrl = 'http://' + resourceBaseUrl + '/api/projects?filter[include]=budgets&filter[include]=costs&filter[where][code]=' + $stateParams.code;
		    	var projectRes = $resource(queryUrl, null, {'query':  {method:'GET', isArray:true}});
		    	projectRes.query().$promise.then(function(data) {
					console.log('project: ' + JSON.stringify(data[0]));

					$scope.customer = JSON.parse(decodeURI($stateParams.customer));
					$scope.project = data[0];

				});
	    }
	    /* end loading project */

	    /* datepickers */
			var datepickerfrom = new Pikaday({
				field : document.getElementById('datepickerfrom'),
				firstDay : 1,
				minDate : new Date(2000, 0, 1),
				maxDate : new Date(2020, 12, 31),
				yearRange : [ 2000, 2020 ]
			});
			var datepickerto = new Pikaday({
				field : document.getElementById('datepickerto'),
				firstDay : 1,
				minDate : new Date(2000, 0, 1),
				maxDate : new Date(2020, 12, 31),
				yearRange : [ 2000, 2020 ]
			});
			$scope.datepickerfrom = datepickerfrom;
			$scope.datepickerto = datepickerto;
			/* end datepickers */

			var holidays = [
				{date: "XXXX-01-01",description: "capodanno"},
				{date: "XXXX-01-06",description: "epifania"},
				{date: "XXXX-04-25",description: "liberazione"},
				{date: "XXXX-05-01",description: "festa del lavoro"},
				{date: "XXXX-06-02",description: "festa della repubblica"},
				{date: "XXXX-08-15",description: "ferragosto"},
				{date: "XXXX-11-01",description: "ognissanti"},
				{date: "XXXX-11-02",description: "festa dei morti"},
				{date: "XXXX-12-08",description: "immacolata"},
				{date: "XXXX-12-25",description: "natale"},
				{date: "XXXX-12-26",description: "santo stefano"}
			];

			function isholiday(month, dayofmonth) {
				var isholiday = false;
				var zero2 = new Padder(2);
				var date = "XXXX-" + zero2.pad(month + 1) + "-" + zero2.pad(dayofmonth);
				isholiday = holidays.map(function(o) {
					return o.date;
				}).includes(date);
				console.log("date " + date + " isholiday " + isholiday);
				return isholiday;
			}

			function getBusinessDays(from, to) {
				var daystart = from.clone();
				var dayend = to.clone();

				var monthsmap = new Map();
				var weeksmap = null;
				var month = 0;
				var week = 0;
				var days = [];
				while(dayend.diff(daystart, 'days') >= 0) {
					month = daystart.month();
					console.log('month: ' + month);
					if (monthsmap.has(month)) {
						weeksmap = monthsmap.get(month);
						week = daystart.week();
						if (weeksmap.has(week)) {
							days = weeksmap.get(week);
							if (daystart.day() != 0 && daystart.day() != 6 &&
									!isholiday(month, daystart.date())) {
								days.push(daystart.date());
							}
							console.log('days: ' + days);
						} else {
							console.log('new week of month: ' + month);
							days = [];
							if (daystart.day() != 0 && daystart.day() != 6 &&
									!isholiday(month, daystart.date())) {
								days.push(daystart.date());
							}
							weeksmap.set(week, days);
							console.log('days: ' + days);
						}
					} else {
						console.log('new month');
						weeksmap = new Map();
						week = daystart.week();
						days = [];
						if (daystart.day() != 0 && daystart.day() != 6 &&
								!isholiday(month, daystart.date())) {
							days.push(daystart.date());
						}
						weeksmap.set(week, days);
						monthsmap.set(month, weeksmap);
						console.log('days: ' + days);
					}
					daystart.add(1, 'day');
				}
				console.log('monthsmap size: ' + monthsmap.size);

				return monthsmap;
			};

			function getDaysTot(monthsmap) {
				var daysTot = 0;
				var months = Array.from(monthsmap.keys());
				console.log('months: ' + months);
				months.forEach(function(month){
					var weeksmap = monthsmap.get(month);
					var weeks = Array.from(weeksmap.keys());
					weeks.forEach(function(week){
						var days = weeksmap.get(week);
						console.log('m[' + month + '-' + week + '] = ' + JSON.stringify(days));
						daysTot += days.length;
					});
				});
				return daysTot;
			}

	    $scope.getBudgets = function(budgettot, selectedfrom, selectedto) {
	    	if (budgettot == null) {
	    		throw 'ERR: il budget totale non è stato inserito';
	    	}
	    	console.log('budgettot: ' + budgettot);

	    	if (selectedfrom == null) {
	    		throw 'ERR: inserire la data iniziale';
	    	}
	    	if (selectedto == null) {
	    		throw 'ERR: inserire la data finale';
	    	}

	    	var from = moment(selectedfrom, "YYYY-MM-DD");
	    	var to = moment(selectedto, "YYYY-MM-DD");
	    	console.log('diff in months: ' + to.diff(from, 'months'));

	    	if (from.isBefore(to)) {
	    		$scope.project.budgets = [];
					var cyear = from.year();

					var bdays = getBusinessDays(from, to);
					var daystot = getDaysTot(bdays);
					$scope.project.daystot = daystot;
					console.log('daystot: ' + $scope.project.daystot);

					var months = Array.from(bdays.keys());
					months.forEach(function(cmonth){
						var weeksmap = bdays.get(cmonth);
						var weeks = Array.from(weeksmap.keys());
						var firstWeek = weeks[0];
						var lastWeek = weeks[weeks.length - 1];
						var firstDay = weeksmap.get(firstWeek)[0];
						var lastDay = null;
						if (weeksmap.get(lastWeek).length > 0) {
							lastDay = weeksmap.get(lastWeek)[weeksmap.get(lastWeek).length - 1];
						} else {
							lastDay = weeksmap.get(lastWeek - 1)[weeksmap.get(lastWeek - 1).length - 1];
						}

						var monthdays = 0;
						weeks.forEach(function(week){
							var days = weeksmap.get(week);
							monthdays += days.length;
						});

						var budget = {
	    				from: cyear + '-' + cmonth + '-' + firstDay,
	    				to: cyear + '-' + cmonth + '-' + lastDay,
	    				year: cyear,
    	    		month: moment.months()[cmonth],
							days: monthdays,
							amount: parseFloat((budgettot * (monthdays/daystot)).toFixed(2)),
    	    		projectId: $scope.project.id
    	    	};
	    			$scope.project.budgets.push(budget);
					});

	    		for (var i in $scope.project.budgets) {
	    			console.log('budget amount: ' + $scope.project.budgets[i].amount + '; type: ' + typeof $scope.project.budgets[i].amount);
	    		}

	    	} else {
	    		throw 'data di inizio maggiore di quella finale';
	    	}
	    };

	    $scope.save = function() {
				console.log('current customer: ' + JSON.stringify($scope.customer));
				console.log('updating project: ' + JSON.stringify($scope.project));

				$scope.project.customerId = $scope.customer.id;
				crud.updateProject($scope.project).then(function(updatedProject) {
					console.log('updatedProject: ' + JSON.stringify(updatedProject));
					crud.updateBudgets({projectId: $scope.project.id, budgets: $scope.project.budgets}).then(function(updatedBudgets) {
						console.log('updatedBudgets: ' + JSON.stringify(updatedBudgets));
					});
				});
			};

			function Padder(len, pad) {
				if (len === undefined) {
					len = 1;
				} else if (pad === undefined) {
					pad = '0';
				}

				var pads = '';
				while (pads.length < len) {
					pads += pad;
				}

				this.pad = function(what) {
					var s = what.toString();
					return pads.substring(0, pads.length - s.length) + s;
				};
			}

	}]);
