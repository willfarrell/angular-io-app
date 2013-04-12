//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

function TemplateUrlCtrl($scope, $http, $routeParams) { // , resolveData
	console.log('TemplateUrlCtrl ('+$scope.$id+', '+$routeParams.folder+'/'+$routeParams.page+')');//, '+resolveData+')');
	var _view_ = 'view/';

	$routeParams.folder = $routeParams.folder || 'page';
	$scope.templateUrl = _view_+$routeParams.folder+'.html';

	//$rootScope.loadLocaleFile($rootScope.language, $routeParams.folder+'.'+$routeParams.page);

	$scope.page_url = _view_+encodeURIComponent($routeParams.folder)+'/'+encodeURIComponent($routeParams.page)+'.html';
	//$scope.nav_select($scope.nav_parent_id, $scope.nav_ids, 'legal');
}
TemplateUrlCtrl.$inject = ['$scope', '$http', '$routeParams']; //, 'resolveData'
//}]);
