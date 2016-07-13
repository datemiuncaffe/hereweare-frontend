(function(){

  'use strict';

  angular.module('project.services')
    .factory('menu', ['$rootScope', function ($location) {
      var self;

      return self = {
        getProjectsDataByCustomerId: function (section) {
          self.openedSection = (self.openedSection === section ? null : section);
        }
      };

    }])

})();
