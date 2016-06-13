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
      .state('estimate', {
        url: '/estimate',
        views:{
          'estimateview': {
              templateUrl: 'views/estimate/estimate.html',
              controller: 'EstimateController'
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
        url: '/project?name',
        views:{
          'projectcreateview': {
              templateUrl: 'views/estimate/projectcreate.html',
              controller: 'ProjectCreateController'
           }
        }
      })
      .state('projectdetail', {
        url: '/projectdetail?customer&code',
        views:{
          'projectdetailview': {
              templateUrl: 'views/estimate/projectdetail.html',
              controller: 'ProjectDetailController'
           }
        }
      })
      .state('projectmodify', {
        url: '/projectmodify?customer&code',
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

      $urlRouterProvider.otherwise('estimate');
      
      $provide.value('resourceBaseUrl', '$resourceBaseUrl$');
  }]);