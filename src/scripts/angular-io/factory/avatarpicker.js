(function (angular) {
angular.module('io.factory.avatarpicker', [])
.factory('$avatarpicker', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('AvatarpickerFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';

	return $scope;
}]);

})(angular);