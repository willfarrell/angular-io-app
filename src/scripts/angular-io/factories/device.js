//(function (angular) {
angular.module('io.factories')
.factory('$device', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('deviceFactory ('+$rootScope.$id+')');
	var $scope = {};
	$scope.version = '0.1.0';
	// PhoneGap Methods Here
	return $scope;
}]);

//})(angular);