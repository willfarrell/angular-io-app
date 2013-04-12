angular.module('io.modules')
.controller('ContactCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	console.log('ContactCtrl ('+$scope.$id+')');
	$scope.errors = {};
	$scope.contact = {};

	$scope.sendMessage = function() {
		$scope.errors = {};

		$http.post($scope.settings.server+'/contact/', $scope.contact)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.contact = {};
					$rootScope.alerts = [{'class':'success', 'label':'Message Sent'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});
	};

	$scope.joinNewsletter = function() {
		$scope.errors = {};
		$scope.contact.message = 'Please add me to your mailing list';

		$http.post($scope.settings.server+'/contact/', $scope.contact)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$rootScope.alerts = [{'class':'success', 'label':'Joined Newsletter'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});
	};
}]);