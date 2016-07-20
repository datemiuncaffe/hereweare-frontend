(function(){
  'use strict';

  angular.module('myMenuApp.controllers',['common.directives'])
    .controller('MenuController', ['$rootScope', '$log', '$state', '$timeout', '$location', 'menu',
                function ($rootScope, $log, $state, $timeout, $location, menu) {
      var vm = this;

      //functions for menu-link and menu-toggle
      vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      vm.autoFocusContent = false;
      vm.menu = menu;

      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }

    }]);
})();