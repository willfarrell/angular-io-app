//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
SettingsCtrl.$inject = ['$scope', '$http', '$routeParams'];
function SettingsCtrl($scope, $http, $routeParams) {
 	console.log('SettingsCtrl '+$routeParams.page);
 	$scope.page_url = 'view/settings/'+encodeURIComponent($routeParams.page)+'.html';
 	//$scope.nav_select($scope.nav_parent_id, $scope.nav_ids, 'legal');
 	// notifications
 	// defaults as per class.notify.php
 	// email:true
 	// sms:false
 	if ($rootScope.settings.notify) {
	 	$scope.notify = $rootScope.settings.notify;
 	} else {
	 	$rootScope.loadJSON(null, 'config.notify', 'json', function(data){
		 	$rootScope.settings.notify = data;
		 	$scope.notify = data;
	 	});
 	}
 	$scope.loadNotifications = function() {
 		$http.get($scope.settings.server+'/user/notify')
 			.success(function(data) {
	 			if ($rootScope.checkHTTPReturn(data)) {
		 			if (data != "") {
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
	 				$rootScope.alerts = [{"class":"success", "label":"Notifications:", "message":"Saved"}];
	 			}
 			})
 			.error(function(){
 			});
 	};
 	$scope.require_signin(function() {
	 	$scope.loadNotifications();
 	});
}
//}]);
