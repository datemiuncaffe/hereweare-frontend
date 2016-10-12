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
    'ngCookies',
    'table.service',
    'ehourqueries',
    'auth',
    'login'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$provide',
           function($stateProvider, $urlRouterProvider, $provide) {
      $stateProvider.state('pages', {
        //abstract: true,
        url: '/pages',
        views:{
          'pagesview': {
              templateUrl: 'views/pages/pages.html'
              //controller: 'LoginController'
           }
        }
      })
      .state('pages.activeprojects', {
        url: '/activeprojects',
        views:{
          'activeprojectsview': {
              templateUrl: 'views/pages/estimate/projects/activeprojects.html',
              controller: 'ActiveProjectsController'
           }
        }
      })
      .state('pages.senseiprojects', {
        url: '/senseiprojects',
        views:{
          'senseiprojectsview': {
              templateUrl: 'views/pages/estimate/projects/senseiprojects.html',
              controller: 'SenseiProjectsController'
           }
        }
      })
      .state('pages.newprojects', {
        url: '/newprojects',
        views:{
          'newprojectsview': {
              templateUrl: 'views/pages/estimate/projects/newprojects.html',
              controller: 'NewProjectsController'
           }
        }
      })
      .state('pages.overview', {
        url: '/overview',
        views:{
          'overviewview': {
              templateUrl: 'views/pages/estimate/overview.html',
              controller: 'OverviewController'
           }
        }
      })
      .state('pages.ricerca', {
        url: '/ricerca',
        views:{
          'ricercaview': {
              templateUrl: 'views/pages/estimate/ricerca.html',
              controller: 'RicercaController'
           }
        }
      })
      .state('pages.projectdetail', {
        url: '/projectdetail?customerId&customerName&projectId&projectName&projectCode',
        views:{
          'projectdetailview': {
              templateUrl: 'views/pages/estimate/projectdetail.html',
              controller: 'ProjectDetailController'
           }
        }
      })
      .state('pages.projectmodify', {
        url: '/projectmodify?customerId&customerName&projectId&projectName&projectCode',
        views:{
          'projectmodifyview': {
              templateUrl: 'views/pages/estimate/projectmodify.html',
              controller: 'ProjectModifyController'
           }
        }
      })
      .state('pages.oremese', {
    		url: '/oremese',
    		views:{
    		  'oremeseview': {
    	         templateUrl: 'views/pages/ehour/dipendenti/oremese.html',
    	         controller: 'OreMeseController'
    		  }
    		}
      })
      .state('pages.giornicommessautente', {
    		url: '/giornicommessautente?year&month&projectCode',
    		views:{
    		  'giornicommessautenteview': {
    	         templateUrl: 'views/pages/ehour/dipendenti/giornicommessautente.html',
    	         controller: 'GiorniCommessaUtenteController'
    		  }
    		}
      })
      .state('pages.giornicommessa', {
    		url: '/giornicommessa',
    		views:{
    		  'giornicommessaview': {
    	         templateUrl: 'views/pages/ehour/commesse/giornicommessa.html',
    	         controller: 'GiorniCommessaController'
    		  }
    		}
      })
      .state('pages.giorni', {
    		url: '/giorni',
    		views:{
    		  'giorniview': {
    	         templateUrl: 'views/pages/ehour/commesse/giorni.html',
    	         controller: 'GiorniController'
    		  }
    		}
      })
      .state('pages.giornicliente', {
    		url: '/giornicliente',
    		views:{
    		  'giorniclienteview': {
    	         templateUrl: 'views/pages/ehour/commesse/giornicliente.html',
    	         controller: 'GiorniClienteController'
    		  }
    		}
      })
      .state('pages.giorniclienteprogetto', {
    		url: '/giorniclienteprogetto',
    		views:{
    		  'giorniclienteprogettoview': {
    	         templateUrl: 'views/pages/ehour/commesse/giorniclienteprogetto.html',
    	         controller: 'GiorniClienteProgettoController'
    		  }
    		}
      });

      $stateProvider.state('login', {
        url: '/login',
        views:{
          'loginview': {
              templateUrl: 'views/login/login.html',
              controller: 'LoginController'
           }
        }
      });

      //$urlRouterProvider.otherwise('pages.overview');
      $urlRouterProvider.otherwise('/pages/overview');

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
  })
  .directive('onLastRepeat', function() {
		return function(scope, element, attrs) {
			if (scope.$last) {
				setTimeout(function() {
						scope.$emit('onRepeatLast', element, attrs);
				}, 1);
			}
		};
	})
  .run(['$rootScope', '$location', '$cookieStore', '$http',
        function ($rootScope, $location, $cookieStore, $http) {
    console.log('onrun...');
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    // if ($rootScope.globals.currentUser) {
    //     $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    // }

    $rootScope.$on('$locationChangeStart',
                   function (event, next, current) {
      console.log('$locationChangeStart...');
      // redirect to login page if not logged in and trying
      // to access a restricted page
      var restrictedPage = $.inArray($location.path(),
        ['/login', '/register']) === -1;
      //var loggedIn = $rootScope.globals.currentUser;
      var loggedIn = $rootScope.globals.isAuthen;
      console.log('isAuthen: ' + loggedIn);
      if (restrictedPage && !loggedIn) {
        console.log('redirect to login');
        $location.path('/login');
          // if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
          //     $state.transitionTo(state, $match, false);
          // }
      }
    });
  }]);

angular.module('ehourqueries', ['ngFileSaver']);
