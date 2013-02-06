//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
SettingsCtrl.$inject = ['$scope', '$http', '$routeParams'];
function SettingsCtrl($scope, $http, $routeParams) {
 	console.log('SettingsCtrl '+$routeParams.page);
 	$scope.page_url = 'view/settings/'+encodeURIComponent($routeParams.page)+'.html';
 	//$scope.nav_select($scope.nav_parent_id, $scope.nav_ids, 'legal');
 	
 	$scope.require_signin();
}
//}]);