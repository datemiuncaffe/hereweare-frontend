angular
  .module('app', [
    'lbServices',
    'hwlog-service',
    'ngResource',
    'ui.router',
    'ngTable',
    'angucomplete-alt',
    'crudService'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$provide', function($stateProvider, $urlRouterProvider, $provide) {
      $stateProvider
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
      .state('projectcreate', {
        url: '/projectcreate',
        views:{
          'projectcreateview': {
              templateUrl: 'views/estimate/projectcreate.html',
              controller: 'ProjectCreateController'
           }
        }
      })
      .state('projectdetail', {
        url: '/projectdetail?customerId&customerName&projectId&projectName&projectCode&projectBudgettot&projectDaystot&projectFrom&projectTo',
        views:{
          'projectdetailview': {
              templateUrl: 'views/estimate/projectdetail.html',
              controller: 'ProjectDetailController'
           }
        }
      })
      .state('projectmodify', {
        url: '/projectmodify?customerId&customerName&projectId&projectName&projectCode&projectBudgettot&projectDaystot&projectFrom&projectTo',
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
		url: '/giornicommessautente',
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
  }]);
