angular
  .module('login', [
    //'hwlog-service',
    //'ngResource',
    'ui.router',
    //'ngMaterial',
    //'ngAria',
    'authcontroller'
  ])
  .config(['$urlRouterProvider', '$provide',
    function($urlRouterProvider, $provide) {
      //$provide.value('resourceBaseUrl', '$resourceBaseUrl$');
  }]);
