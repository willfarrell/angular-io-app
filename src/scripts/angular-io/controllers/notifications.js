/*global syncVar:true */

//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

function NotificationsCtrl($scope, $http) {
	console.log('NotificationsCtrl ('+$scope.$id+')');

	// notifications
	// defaults as per class.notify.php
	// email:true
	// sms:false
	if ($rootScope.settings.notify) {
		$scope.notify = $rootScope.settings.notify;
	} else {
		$rootScope.loadJSON(null, 'config.notify.client', 'json', function(data){
			$rootScope.settings.notify = data;
			$scope.notify = data;
		});
	}

	$scope.loadNotifications = function() {
		$http.get($scope.settings.server+'/user/notify')
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					if (data !== '') {
						// sync with defaults, allows for new defaults to be added
						$scope.notify = syncVar(data, $scope.notify); // will add system defaults
						//$scope.notify = data;
					}
				}
			})
			.error(function(){
			});
	};

	$scope.updateNotifications = function() {
		console.log($scope.notify);
		$http.put($scope.settings.server+'/user/notify', $scope.notify)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.alerts = [{'class':'success', 'label':'Notifications:', 'message':'Saved'}];
				}
			})
			.error(function(){
			});
	};

	$scope.require_signin(function() {
		$scope.loadNotifications();
	});
}
NotificationsCtrl.$inject = ['$scope', '$http'];
//}]);
