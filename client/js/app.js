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
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('estimate', {
        url: '/estimate',
        views:{
          'estimateview': {
              templateUrl: 'views/estimate.html',
              controller: 'EstimateController'
           }
        }
      })
      .state('ricerca', {
        url: '/ricerca',
        views:{
          'ricercaview': {
              templateUrl: 'views/ricerca.html',
              controller: 'RicercaController'
           }
        }
      })
      .state('projectcreate', {
        url: '/project?name',
        views:{
          'projectcreateview': {
              templateUrl: 'views/projectcreate.html',
              controller: 'ProjectCreateController'
           }
        }
      })
      .state('oremese', {
		url: '/oremese',
		views:{
		  'oremeseview': {
	         templateUrl: 'views/oremese.html',
	         controller: 'OreMeseController'
		  }
		}
      })
      .state('giornicommessautente', {
		url: '/giornicommessautente',
		views:{
		  'giornicommessautenteview': {
	         templateUrl: 'views/giornicommessautente.html',
	         controller: 'GiorniCommessaUtenteController'
		  }
		}
      })
      .state('giornicommessa', {
		url: '/giornicommessa',
		views:{
		  'giornicommessaview': {
	         templateUrl: 'views/giornicommessa.html',
	         controller: 'GiorniCommessaController'
		  }
		}
      })
      .state('giorni', {
		url: '/giorni',
		views:{
		  'giorniview': {
	         templateUrl: 'views/giorni.html',
	         controller: 'GiorniController'
		  }
		}
      })
      .state('giornicliente', {
		url: '/giornicliente',
		views:{
		  'giorniclienteview': {
	         templateUrl: 'views/giornicliente.html',
	         controller: 'GiorniClienteController'
		  }
		}
      })
      .state('giorniclienteprogetto', {
		url: '/giorniclienteprogetto',
		views:{
		  'giorniclienteprogettoview': {
	         templateUrl: 'views/giorniclienteprogetto.html',
	         controller: 'GiorniClienteProgettoController'
		  }
		}
      });

    $urlRouterProvider.otherwise('estimate');
  }]);