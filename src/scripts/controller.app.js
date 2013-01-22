angular.module('io.controller.root', [])
.controller('AppCtrl',
['$rootScope', '$scope', '$http', '$follow', '$filepicker',
function(rootScope, $scope, $http, follow, filepicker) {
	
	console.log('AppCtrl ('+$scope.$id+')');
	
	$rootScope = rootScope; // important
	
	// scope fall back for children
	//$scope.$http = $http;
	
	// Factory init - $scope.factory = factory;
	$rootScope.follow = follow;
	$rootScope.filepicker = filepicker;
	
	// Events
	$scope.$on('$viewContentLoaded', function(event) {
		
		//$window._gaq.push(['_trackPageView', $location.path()]);	// ga
	});
	$scope.$on('$includeContentLoaded', function(event) {
		
	});
	
	//!-- App Root Scoope Functions --//
	
}]);