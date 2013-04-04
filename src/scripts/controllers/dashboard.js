//angular.module('app.controller.dashboard', [])
//.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {
function DashboardCtrl($scope, $http, $routeParams) {
	console.log('DashboardCtrl (' + $scope.$id + ')');
	//-- App Functions Here --//
	//-- Directory Search --//
	$scope.search = {query:'',type:($rootScope.settings.account.company) ? 'company' : 'user'};
	$scope.loadSearch = function() {
		$http.get($scope.settings.server+'/'+$scope.search.type+'/search/'+$scope.search.query)
			.success(function(data){
				console.log(data);
				$scope.results = data;
			})
			.error(function(){
			});
	};
	//-- End App Functions Here --//
	$scope.require_signin(function() {
		//$scope.loadSearch();
	});
}
DashboardCtrl.$inject = ['$scope', '$http', '$routeParams'];
//}]);
