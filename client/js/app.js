angular
  .module('app', [
    'lbServices',
    'hwlog-service',
    'ngResource',
    'ui.router',
    'ngTable',
    'angucomplete-alt',
    'crudService',
    'myMenuApp.controllers',
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'table.service'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$provide', function($stateProvider, $urlRouterProvider, $provide) {
      $stateProvider
      .state('activeprojects', {
        url: '/activeprojects',
        views:{
          'activeprojectsview': {
              templateUrl: 'views/estimate/activeprojects.html',
              controller: 'ActiveProjectsController'
           }
        }
      })
      .state('overview', {
        url: '/overview',
        views:{
          'overviewview': {
              templateUrl: 'views/estimate/overview.html',
              controller: 'OverviewController'
           }
        }
      })
      .state('ricerca', {
        url: '/ricerca',
        views:{
          'ricercaview': {
              templateUrl: 'views/estimate/ricerca.html',
              controller: 'RicercaController'
           }
        }
      })
      .state('projectdetail', {
        url: '/projectdetail?customerId&customerName&projectId&projectName&projectCode',
        views:{
          'projectdetailview': {
              templateUrl: 'views/estimate/projectdetail.html',
              controller: 'ProjectDetailController'
           }
        }
      })
      .state('projectmodify', {
        url: '/projectmodify?customerId&customerName&projectId&projectName&projectCode',
        views:{
          'projectmodifyview': {
              templateUrl: 'views/estimate/projectmodify.html',
              controller: 'ProjectModifyController'
           }
        }
      })
      .state('oremese', {
    		url: '/oremese',
    		views:{
    		  'oremeseview': {
    	         templateUrl: 'views/ehourqueries/oremese.html',
    	         controller: 'OreMeseController'
    		  }
    		}
      })
      .state('giornicommessautente', {
    		url: '/giornicommessautente?year&month&projectCode',
    		views:{
    		  'giornicommessautenteview': {
    	         templateUrl: 'views/ehourqueries/giornicommessautente.html',
    	         controller: 'GiorniCommessaUtenteController'
    		  }
    		}
      })
      .state('giornicommessa', {
    		url: '/giornicommessa',
    		views:{
    		  'giornicommessaview': {
    	         templateUrl: 'views/ehourqueries/giornicommessa.html',
    	         controller: 'GiorniCommessaController'
    		  }
    		}
      })
      .state('giorni', {
    		url: '/giorni',
    		views:{
    		  'giorniview': {
    	         templateUrl: 'views/ehourqueries/giorni.html',
    	         controller: 'GiorniController'
    		  }
    		}
      })
      .state('giornicliente', {
    		url: '/giornicliente',
    		views:{
    		  'giorniclienteview': {
    	         templateUrl: 'views/ehourqueries/giornicliente.html',
    	         controller: 'GiorniClienteController'
    		  }
    		}
      })
      .state('giorniclienteprogetto', {
    		url: '/giorniclienteprogetto',
    		views:{
    		  'giorniclienteprogettoview': {
    	         templateUrl: 'views/ehourqueries/giorniclienteprogetto.html',
    	         controller: 'GiorniClienteProgettoController'
    		  }
    		}
      });

      $urlRouterProvider.otherwise('overview');

      $provide.value('resourceBaseUrl', '$resourceBaseUrl$');
  }])
  //take all whitespace out of string
  .filter('nospace', function () {
    return function (value) {
      return (!value) ? '' : value.replace(/ /g, '');
    };
  })
  //replace uppercase to regular case
  .filter('humanizeDoc', function () {
    return function (doc) {
      if (!doc) return;
      if (doc.type === 'directive') {
        return doc.name.replace(/([A-Z])/g, function ($1) {
          return '-' + $1.toLowerCase();
        });
      }

      return doc.label || doc.name;
    };
  });
