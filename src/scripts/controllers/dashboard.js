//angular.module('app.controller.dashboard', [])
//.controller('DashboardCtrl', ['$scope', '$rest', function($scope, $http) {
function DashboardCtrl(config, $rootScope, $scope, $rest, $routeParams) {
	console.log('DashboardCtrl (', $scope.$id, config,')');
	//-- App Functions Here --//

	//-- Directory Search --//
	$scope.search = {query:'',type:(config.account.company) ? 'company' : 'user'};

	$scope.loadSearch = function() {
		$rest.http({
				method:'get',
				url: '/'+$scope.search.type+'/search/'+$scope.search.query
			}, function(data){
				$scope.results = data;
			});
	};


	//-- End App Functions Here --//
	$rootScope.session.require_signin(function() {
		//$scope.loadSearch();
	});
}
DashboardCtrl.$inject = ['app.config', '$rootScope', '$scope', '$rest', '$routeParams'];
//}]);
