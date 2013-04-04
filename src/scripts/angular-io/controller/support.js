//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

function SupportCtrl($scope, $http, $routeParams) {
	console.log('SupportCtrl '+$routeParams.page);
	$scope.page_url = 'view/support/'+encodeURIComponent($routeParams.page)+'.html';
	//$scope.nav_select($scope.nav_parent_id, $scope.nav_ids, 'legal');
}
SupportCtrl.$inject = ['$scope', '$http', '$routeParams'];
//}]);