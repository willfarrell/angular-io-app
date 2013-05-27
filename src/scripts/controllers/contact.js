// version 0.1.0

angular.module('io.modules')
.controller('ContactCtrl', ['$rootScope', '$scope', '$rest', '$routeParams', function($rootScope, $scope, $rest, $routeParams) {
	console.log('ContactCtrl (', $scope.$id, ')');
	$scope.contact = {};

	$scope.sendMessage = function() {
		$rootScope.errors = {};

		$rest.http({
				method:'post',
				url: $rest.server+'contact/',
				data: $scope.contact
			}, function(data){
				$scope.contact = {};
				$rootScope.alerts = [{'class':'success', 'label':'Message Sent'}];
			});
	};

	$scope.joinNewsletter = function() {
		$rootScope.errors = {};
		$scope.contact.message = 'Please add me to your mailing list';

		$rest.http({
				method:'post',
				url: $rest.server+'contact/',
				data: $scope.contact
			}, function(data){
				$scope.contact = {};
				$rootScope.alerts = [{'class':'success', 'label':'Joined Newsletter'}];
			});
	};
}]);