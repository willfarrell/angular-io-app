// version 0.1.0

angular.module('io.modules')
.controller('ContactCtrl', ['$rootScope', '$scope', '$rest', '$routeParams', function($rootScope, $scope, $rest, $routeParams) {
	console.log('ContactCtrl (', $scope.$id, ')');
	$scope.errors = {};
	$scope.contact = {};

	$scope.sendMessage = function() {
		$scope.errors = {};

		$rest.http({
				method:'post',
				url: '/contact/',
				data: $scope.contact
			}, function(data){
				$scope.contact = {};
				$rootScope.alerts = [{'class':'success', 'label':'Message Sent'}];
			});

		/*$http.post('/contact/', $scope.contact)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.contact = {};
					$rootScope.alerts = [{'class':'success', 'label':'Message Sent'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});*/
	};

	$scope.joinNewsletter = function() {
		$scope.errors = {};
		$scope.contact.message = 'Please add me to your mailing list';

		$rest.http({
				method:'post',
				url: '/contact/',
				data: $scope.contact
			}, function(data){
				$scope.contact = {};
				$rootScope.alerts = [{'class':'success', 'label':'Joined Newsletter'}];
			});

		/*$http.post('/contact/', $scope.contact)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$rootScope.alerts = [{'class':'success', 'label':'Joined Newsletter'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});*/
	};
}]);