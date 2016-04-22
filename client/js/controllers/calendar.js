angular
	.module("app")
	.controller("CalendarController", function($scope) {
	    $scope.day = moment();
	});