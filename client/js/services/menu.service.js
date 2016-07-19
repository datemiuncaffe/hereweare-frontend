(function(){

  'use strict';

  angular.module('common.services')
    .factory('menu', [
      '$location',
      '$rootScope',
      function ($location) {

        var sections = [{
          name: 'Overview',
          type: 'link',
          state: 'overview'
        }, {
          name: 'Ricerca',
          type: 'link',
          state: 'ricerca'
        }];

        sections.push({
          name: 'Riepiloghi progetti',
          type: 'toggle',
          pages: [{
            name: 'Progetti attivi',
            type: 'link',
            state: 'activeprojects',
            icon: ''
          }, {
            name: 'Progetti interni',
            type: 'link',
            state: 'senseiprojects',
            icon: ''
          }]
        });

        sections.push({
          name: 'Riepiloghi ore',
          type: 'toggle',
          pages: [{
            name: 'Ore mese',
            type: 'link',
            state: 'oremese',
            icon: ''
          }, {
            name: 'Giorni commessa utente',
            type: 'link',
            state: 'giornicommessautente',
            icon: ''
          }, {
            name: 'Giorni',
            type: 'link',
            state: 'giorni',
            icon: ''
          }, {
            name: 'Giorni cliente',
            type: 'link',
            state: 'giornicliente',
            icon: ''
          }, {
            name: 'Giorni cliente progetto',
            type: 'link',
            state: 'giorniclienteprogetto',
            icon: ''
          }]
        });

        var self;

        return self = {
          sections: sections,

          toggleSelectSection: function (section) {
            self.openedSection = (self.openedSection === section ? null : section);
          },
          isSectionSelected: function (section) {
            return self.openedSection === section;
          },

          selectPage: function (section, page) {
            page && page.url && $location.path(page.url);
            self.currentSection = section;
            self.currentPage = page;
          }
        };

        function sortByHumanName(a, b) {
          return (a.humanName < b.humanName) ? -1 :
            (a.humanName > b.humanName) ? 1 : 0;
        }

      }])

})();
