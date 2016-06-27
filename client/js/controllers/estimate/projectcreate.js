angular
	.module("app")
	.controller("ProjectCreateController", ['$scope', '$resource', '$q', 'crud',
	                                        function($scope, $resource, $q, crud) {
			$scope.customers = null;
			$scope.selectedCustomer = null;
			$scope.project = null;

	    $q
			.all([
			    crud.getCustomers()
			])
			.then(
				function(data) {
	//				console.log('data: ' + JSON.stringify(data));
					var customers = data[0];
	//				console.log('customers: ' + JSON.stringify(customers));
					$scope.customers = customers;
					$scope.selectedCustomer = customers[0];
				});

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

					var zero2 = new Padder(2);
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
	    				from: cyear + '-' + zero2.pad(cmonth + 1) + "-" + zero2.pad(firstDay),
	    				to: cyear + '-' + zero2.pad(cmonth + 1) + "-" + zero2.pad(lastDay),
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
				console.log('current customer: ' + JSON.stringify($scope.selectedCustomer));
				console.log('updating project: ' + JSON.stringify($scope.project));

				$scope.project.customerId = $scope.selectedCustomer.id;
				crud.createProject({project:$scope.project}).then(function(res) {
					console.log('createdProject: ' + JSON.stringify(res.createdProject));
					$scope.project.budgets.forEach(function(budget, i){
						budget.projectId = res.createdProject.id;
					});
					crud.updateBudgets({projectId: res.createdProject.id, budgets: $scope.project.budgets}).then(function(updatedBudgets) {
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
