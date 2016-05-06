angular
	.module("app")
	.directive("calendar", function() {
	    return {
	        restrict: "E",
	        templateUrl: "templates/calendar.html",
	        scope: {
	            selected: "=",
	            from: "=",
	            to: "=",
	            selectedfrom: "=",
	            selectedto: "="
	        },
	        link: function(scope) {
	        	console.log('calendar selected: ' + scope.selected.format());
	            scope.selected = _removeTime(scope.selected || moment());
	            console.log('calendar selected: ' + scope.selected.format());
	            scope.month = scope.selected.clone();
	            console.log('calendar month: ' + scope.month.format());
	
	            var start = scope.selected.clone();
	            start.date(1);
	            console.log('calendar start: ' + start.format());
	            _removeTime(start.day(0));
	            console.log('calendar start: ' + start.format());
	            
	            _buildMonth(scope, start, scope.month);
	
	            scope.select = function(day) {
	            	console.log('from: ' + scope.from + '; to: ' + scope.to);	            		            	
	            	console.log('day.dateFormatted: ' + day.dateFormatted);
	                scope.selected = day.date;
	                if (scope.from) {
	                	console.log('from: ' + scope.from);
	                	scope.selectedfrom = day.dateFormatted;
	                }
	                if (scope.to) {
	                	console.log('to: ' + scope.to);
	                	scope.selectedto = day.dateFormatted;
	                }
	                console.log('selectedfrom: ' + scope.selectedfrom + '; selectedto: ' + scope.selectedto);
	            };
	
	            scope.next = function() {
	                var next = scope.month.clone();
	                _removeTime(next.month(next.month()+1).date(1));
	                scope.month.month(scope.month.month()+1);
	                _buildMonth(scope, next, scope.month);
	            };
	
	            scope.previous = function() {
	                var previous = scope.month.clone();
	                _removeTime(previous.month(previous.month()-1).date(1));
	                scope.month.month(scope.month.month()-1);
	                _buildMonth(scope, previous, scope.month);
	            };
	        }
	    };
	
	    function _removeTime(date) {
	        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
	    }
	
	    function _buildMonth(scope, start, month) {
	        scope.weeks = [];
	        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
	        while (!done) {
	            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
	            date.add(1, "w");
	            done = count++ > 2 && monthIndex !== date.month();
	            monthIndex = date.month();
	        }
	    }
	
	    function _buildWeek(date, month) {
	        var days = [];
	        for (var i = 0; i < 7; i++) {
	            days.push({
	                name: date.format("dd").substring(0, 1),
	                number: date.date(),
	                isCurrentMonth: date.month() === month.month(),
	                isToday: date.isSame(new Date(), "day"),
	                date: date,
	                dateFormatted: date.format("DD MMM YYYY")
	            });
	            date = date.clone();
	            date.add(1, "d");
	        }
	        return days;
	    }
	});