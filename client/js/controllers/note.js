angular
.module('app')
.controller('NoteController', ['$scope', '$state', '$http', 'Note', function($scope, $state, $http, Note) {
	console.log('inside NoteController...');
	$scope.notes = [];
	$http.get("http://localhost:3000/query_ore_lav_utente_mese").success(function(response){
		var resList = response.results;
		var string = JSON.stringify(resList); 
		console.log('string: ' + string);
		var array = JSON.parse(string);
		console.log('array: ' + array);
		for (var i in resList) {
			console.log('year: ' + JSON.stringify(resList[i]));
			var note = new Object();
			note.content = resList[i].nomeDipendente;
			$scope.notes.push(note);
		}
		//      console.log('response: ' + response);
		 //$scope.names = response; 
		//         });
	});
}]);
