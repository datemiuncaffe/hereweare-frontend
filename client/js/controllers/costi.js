angular
  .module('app')
  .controller('CostiController', ['$scope', 'Todo', function($scope, Todo) {      
	  console.log('inside CostiController...');
    
	  $scope.action = 'Edit';
	  $scope.coffeeShops = [];
	  $scope.selectedShop;
	  $scope.review = {};
	  $scope.isDisabled = false;
      
      $scope.todos = [];
    
    
    
    $q
    .all([
      CoffeeShop.find().$promise,
      Review.findById({ id: $stateParams.id }).$promise
    ])
    .then(function(data) {
      var coffeeShops = $scope.coffeeShops = data[0];
      $scope.review = data[1];
      $scope.selectedShop;

      var selectedShopIndex = coffeeShops
        .map(function(coffeeShop) {
          return coffeeShop.id;
        })
        .indexOf($scope.review.coffeeShopId);
      $scope.selectedShop = coffeeShops[selectedShopIndex];
    });

  $scope.submitForm = function() {
    $scope.review.coffeeShopId = $scope.selectedShop.id;
    $scope.review
      .$save()
      .then(function(review) {
        $state.go('all-reviews');
      });
  };    
    
//    function getTodos() {
//      console.log('getTodos');
//      Todo
//        .find()
//        .$promise
//        .then(function(results) {
//          $scope.todos = results;
//        });
//    }
//    getTodos();
//
//    $scope.addTodo = function() {
//      Todo
//        .create($scope.newTodo)
//        .$promise
//        .then(function(todo) {
//          $scope.newTodo = '';
//          $scope.todoForm.content.$setPristine();
//          $('.focus').focus();
//          getTodos();
//        });
//    };

//    $scope.removeTodo = function(item) {
//      Todo
//        .deleteById(item)
//        .$promise
//        .then(function() {
//          getTodos();
//        });
//    };
  }]);