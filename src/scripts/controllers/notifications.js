/*global syncVar:true */

//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$rest', '$routeParams', function($scope, $http, $routeParams) {

function NotificationsCtrl(config, $rootScope, $scope, $rest) {
	console.log('NotificationsCtrl (',  $scope.$id, ')');

	// notifications
	// defaults as per class.notify.php
	// email:true
	// sms:false
	if (config.notify) {
		$scope.notify = config.notify;
	} else {
		$rootScope.loadJSON(null, 'config.notify.client', 'json', function(data){
			config.notify = data;
			$scope.notify = data;
		});
	}

	$scope.loadNotifications = function() {
		$rest.http({
				method:'get',
				url: '/user/notify'
			}, function(data){
				if (data !== '') {
					// sync with defaults, allows for new defaults to be added
					$scope.notify = syncVar(data, $scope.notify); // will add system defaults
					//$scope.notify = data;
				}
			});

		/*$http.get('/user/notify')
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
			});*/
	};

	$scope.updateNotifications = function() {
		console.log($scope.notify);
		$rest.http({
				method:'get',
				url: '/user/notify',
				data: $scope.notify
			}, function(data){
				$rootScope.alerts = [{'class':'success', 'label':'Notifications:', 'message':'Saved'}];
			});

		/*$http.put('/user/notify', $scope.notify)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.alerts = [{'class':'success', 'label':'Notifications:', 'message':'Saved'}];
				}
			})
			.error(function(){
			});*/
	};

	$rootScope.session.require_signin(function() {
		$scope.loadNotifications();
	});
}
NotificationsCtrl.$inject = ['app.config', '$rootScope', '$scope', '$rest'];
//}]);
