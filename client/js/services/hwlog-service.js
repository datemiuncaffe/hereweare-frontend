// CommonJS package manager support
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  // Export the *name* of this Angular module
  // Sample usage:
  //
  //   import lbServices from './hwlog-service';
  //   angular.module('app', [hwlog-service]);
  //
  module.exports = "hwlog-service";
}

(function(window, angular, undefined) {'use strict';

var module = angular.module("hwlog-service",[]);

module.factory('hwlog', function() {
	var bunyan = require('bunyan');
	var log = bunyan.createLogger({
		name : 'hereweare-log',
		streams : [{
			level : 'info',
			stream : process.stdout				// log INFO and above to stdout
		},{
			level : 'info',
			path : '/home/federico/Documents/ehour/projects/hereweare-frontend/logs/hw-frontend.log'	// log INFO and above to a file
		}]
	});
	return log;
});
})(window, window.angular);