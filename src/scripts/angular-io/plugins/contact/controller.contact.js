angular.module('io.controller.contact', [])
.controller('ContactCtrl',
['$scope', '$http', '$routeParams',
function($scope, $http, $routeParams) {
	console.log('ContactCtrl ('+$scope.$id+')');
	$scope.errors = {};
	$scope.contact = {};

	$scope.sendMessage = function() {
		$scope.errors = {};

		$http.post($scope.settings.server+'contact/', $scope.contact)
			.success(function(data) {
				console.log(data);
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (data.errors) $scope.errors = data.errors;
				if (!data.alerts && !data.errors) {
					$scope.contact = {};
					$rootScope.alerts = [{'class':'success', 'label':'Message Sent'}];
				}
			});
	};

	$scope.joinNewsletter = function() {
		$scope.errors = {};
		$scope.contact.message = 'Please add me to your mailing list';

		$http.post($scope.settings.server+'contact/', $scope.contact)
			.success(function(data) {
				console.log(data);
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (data.errors) $scope.errors = data.errors;
				if (!data.alerts && !data.errors) {

					$rootScope.alerts = [{'class':'success', 'label':'Joined Newsletter'}];
				}
			});
	};

}]);