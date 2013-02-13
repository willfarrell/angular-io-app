//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
PageCtrl.$inject = ['$scope', '$http', '$routeParams'];
function PageCtrl($scope, $http, $routeParams) {
 	console.log('PageCtrl ('+$scope.$id+', '+$routeParams.page+')');
 	$scope.page_url = 'view/page/'+encodeURIComponent($routeParams.page)+'.html';
 	//$scope.nav_select($scope.nav_parent_id, $scope.nav_ids, 'legal');
}
//}]);