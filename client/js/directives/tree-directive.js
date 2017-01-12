angular.module('common.directives')
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('partials/menu-tree.tmpl.html',
      '<md-button class="md-button-toggle"\n' +
      '  ng-click="toggle()"\n' +
      '  aria-controls="docs-menu-{{section.name | nospace}}"\n' +
      '  flex layout="row"\n' +
      '  aria-expanded="{{isOpen()}}">\n' +
      '  {{section.name}}\n' +
      '  <span aria-hidden="true" class=" pull-right fa fa-chevron-down md-toggle-icon"\n' +
      '  ng-class="{\'toggled\' : isOpen()}"></span>\n' +
      '</md-button>\n' +
      '<ul ng-show="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
      '  <li ng-repeat="page in section.pages">\n' +
      '    <menu-link section="page" ng-if="page.type === \'link\'"></menu-link>\n' +
      '    <menu-tree section="page" ng-if="page.type === \'tree\'"></menu-tree>\n' +
      '  </li>\n' +
      '</ul>\n' +
      '');
  }])
  .directive('menuTree', ['$timeout',
    function ($timeout ) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-tree.tmpl.html',
        link: function (scope, element) {
          var controller = element.parent().controller();

          scope.isOpen = function () {
            return controller.isOpen(scope.section);
          };
          scope.toggle = function () {
            console.log('pages: ' +
              JSON.stringify(scope.section.pages, null, '\t'));
            if (scope.section.pages.length == 0) {
              controller.getData(scope.section);
            }
            controller.toggleOpen(scope.section);
          };

          var parentNode = element[0].parentNode.parentNode.parentNode;
          if (parentNode.classList.contains('parent-list-item')) {
            var heading = parentNode.querySelector('h2');
            element[0].firstChild.setAttribute('aria-describedby', heading.id);
          }
        }
      };
  }]);
