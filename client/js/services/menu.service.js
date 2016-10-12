(function(){
  'use strict';

  angular.module('common.services',[])
    .factory('menu', ['$location', '$rootScope',
      function ($location) {

        var sections = {
          verticalSections: [{
            name: 'Overview',
            type: 'link',
            state: 'pages.overview'
          }, {
            name: 'Ricerca',
            type: 'link',
            state: 'pages.ricerca'
          }, {
            name: 'Progetti',
            type: 'toggle',
            pages: [{
              name: 'Attivi',
              type: 'link',
              state: 'pages.activeprojects',
              icon: ''
            }, {
              name: 'Interni',
              type: 'link',
              state: 'pages.senseiprojects',
              icon: ''
            }, {
              name: 'Nuovi',
              type: 'link',
              state: 'pages.newprojects',
              icon: ''
            }]
          }, {
            name: 'Riepilogo dipendenti',
            type: 'toggle',
            pages: [{
              name: 'Ore mese',
              type: 'link',
              state: 'pages.oremese',
              icon: ''
            }, {
              name: 'GG commessa dip.',
              type: 'link',
              state: 'pages.giornicommessautente',
              icon: ''
            }]
          }, {
            name: 'Riepilogo commesse',
            type: 'toggle',
            pages: [{
              name: 'GG commessa',
              type: 'link',
              state: 'pages.giornicommessa',
              icon: ''
            }, {
              name: 'GG erogate',
              type: 'link',
              state: 'pages.giorni',
              icon: ''
            }, {
              name: 'GG cliente',
              type: 'link',
              state: 'pages.giornicliente',
              icon: ''
            }, {
              name: 'GG cliente progetto',
              type: 'link',
              state: 'pages.giorniclienteprogetto',
              icon: ''
            }]
          }],
          orizontalSections: [{
            name: 'Overview',
            type: 'link',
            state: 'pages.overview'
          }, {
            name: 'Ricerca',
            type: 'link',
            state: 'pages.ricerca'
          }, {
            name: 'Progetti',
            type: 'toggle',
            width: '400px',
            pages: [{
              name: 'Attivi',
              type: 'link',
              state: 'pages.activeprojects',
              icon: ''
            }, {
              name: 'Interni',
              type: 'link',
              state: 'pages.senseiprojects',
              icon: ''
            }, {
              name: 'Nuovi',
              type: 'link',
              state: 'pages.newprojects',
              icon: ''
            }]
          }, {
            name: 'Riepilogo dipendenti',
            type: 'toggle',
            pages: [{
              name: 'Ore mese',
              type: 'link',
              state: 'pages.oremese',
              icon: ''
            }, {
              name: 'GG commessa dip.',
              type: 'link',
              state: 'pages.giornicommessautente',
              icon: ''
            }]
          }, {
            name: 'Riepilogo commesse',
            type: 'toggle',
            pages: [{
              name: 'GG commessa',
              type: 'link',
              state: 'pages.giornicommessa',
              icon: ''
            }, {
              name: 'GG erogate',
              type: 'link',
              state: 'pages.giorni',
              icon: ''
            }, {
              name: 'GG cliente',
              type: 'link',
              state: 'pages.giornicliente',
              icon: ''
            }, {
              name: 'GG cliente progetto',
              type: 'link',
              state: 'pages.giorniclienteprogetto',
              icon: ''
            }]
          }]
        };

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

      }]);

})();
