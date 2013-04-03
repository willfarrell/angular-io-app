(function (angular) {
angular.module('io.factory.message', [])
.factory('$message', ['$rootScope', '$http', '$routeParams', function($rootScope, $http, $routeParams) {
	console.log('MessageFactory ('+$rootScope.$id+')');
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.unread = 0;
	$scope.init = function() {
		$scope.alerts = [];
		// modal params
		$scope.to_name = "";
		$scope.compose = {};
	};
	$scope.open = function(user_ID, to_name, message) {
		$scope.init();
		// reset compose
		$scope.compose = {
			user_ID:user_ID,
			message:message||''
		};
		$scope.to_name = to_name;
		$('#messageModal').modal('show');
	};
	$scope.close = function() {
		$('#messageModal').modal('hide');
	};
	$scope.updateUnreadCount = function() {
		console.log('updateUnreadCount()');
		$http.get($rootScope.settings.server+'/message/unread')
			.success(function(data) {
				console.log('updateUnreadCount.get.success');
				//$scope.dbing[id].name = data.name;
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.unread = data;
				}
			})
			.error(function() {
				console.log('updateUnreadCount.get.error');
				//$rootScope.http_error();
			});
	};
	$scope.send = function() {
		console.log('send()');
		$http.post($rootScope.settings.server+'/message', $scope.compose)
			.success(function(data) {
				console.log('send.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.compose.message = '';
					$scope.alerts = [{'class':'success', 'label':'Message sent:', 'message':'Click to go to conversation.'}];
				}
			})
			.error(function() {
				console.log('send.get.error');
				//$rootScope.http_error();
			});
	};
	$rootScope.$watch('session.user_ID', function(value) {
	  	if (value) $scope.updateUnreadCount();
	});
	return $scope;
}]);

})(angular);
