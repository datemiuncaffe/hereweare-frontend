(function(){
  'use strict';

  angular.module('myMenuApp.controllers',['common.directives'])
    .controller('MenuController', ['$rootScope', '$log', '$state', '$timeout', '$location', 'menu',
                function ($rootScope, $log, $state, $timeout, $location, menu) {
      var vm = this;

      //functions for menu-link and menu-toggle
      vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      vm.getData = getData;
      vm.autoFocusContent = false;
      vm.menu = menu;

      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };

      function isOpen(section) {
        return menu.isSectionSelected(section);
      };
      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      };
      function getData(section) {
        if (section.id !== undefined) {
          menu.getProjects(section);
        } else { // root
          menu.getCustomers(section);
        }
      };

    }]);
})();
