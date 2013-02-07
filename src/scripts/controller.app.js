//angular.module('app.controller.root', [])
//.controller('AppCtrl',
//['$rootScope', '$scope', '$http', '$follow', '$filepicker',
//function(rootScope, $scope, $http, follow, filepicker) {
AppCtrl.$inject = ['$rootScope', '$scope', '$http', '$filepicker', '$accessibility', '$message', '$follow'];
function AppCtrl(rootScope, $scope, $http, filepicker, accessibility, message, follow) {
	console.log('AppCtrl ('+$scope.$id+')');
	
	$rootScope = rootScope; // important
	
	// scope fall back for children
	//$scope.$http = $http;
	
	// Factory init - $scope.factory = factory;
 	$rootScope.filepicker = filepicker;
 	$rootScope.accessibility = accessibility;
	$rootScope.message = message;
	$rootScope.follow = follow;
	
	
	// Events
	$scope.$on('$viewContentLoaded', function(event) {
		
		//$window._gaq.push(['_trackPageView', $location.path()]);	// ga
	});
	$scope.$on('$includeContentLoaded', function(event) {
		
	});
	
	//!-- App Root Scoope Functions --//
	
	$scope.backToTop = function() {
		console.log($('.page')[0].scrollTop);
		$('.page')[0].scrollTop = 0;
	}
}
//}]);