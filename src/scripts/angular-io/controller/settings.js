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
 	$scope.notify = $rootScope.settings.notify;
 	
 	$scope.loadNotifications = function() {
 		$http.get($scope.settings.server+'/user/notify')
 			.success(function(data) {
	 			console.log(data);
	 			if (data != "") {
	 				$scope.notify = data;
	 			}
 			})
 			.error(function(){
	 			
 			});
 	};
 	
 	$scope.updateNotifications = function() {
 		console.log($scope.notify);
 		$http.put($scope.settings.server+'/user/notify', $scope.notify)
 			.success(function(data) {
	 			$rootScope.alerts = [{"class":"success", "label":"Notifications:", "message":"Saved"}]
 			})
 			.error(function(){
	 			
 			});
 	};
 	
 	$scope.loadNotifications();
 	$scope.require_signin();
}
//}]);