//angular.module('app.controller.root', [])
//.controller('AppCtrl',
//['$rootScope', '$scope', '$http', '$follow', '$filepicker',
//function(rootScope, $scope, $http, follow, filepicker) {
AppCtrl.$inject = ['$rootScope', '$scope', '$http', '$filepicker', '$accessibility', '$markdown', '$message', '$follow'];
function AppCtrl(rootScope, $scope, $http, filepicker, accessibility, markdown, message, follow) {
	console.log('AppCtrl ('+$scope.$id+')');
	
	$rootScope = rootScope; // important
	
	// scope fall back for children
	//$scope.$http = $http;
	
	// Factory init - $scope.factory = factory;
 	$rootScope.filepicker = filepicker;
 	$rootScope.accessibility = accessibility;
 	$rootScope.markdown = markdown;
	$rootScope.message = message;
	$rootScope.follow = follow;
	
	
	// Events
	$scope.$on('$viewContentLoaded', function(event) {
		
		// ga - add $window and $location to $inject if adding in
		// use $rootScope.$on('$routeChangeSuccess', ...) or angular-googleanalytics
		//$window._gaq.push(['_trackPageView', $location.path()]);	
		
	});
	$scope.$on('$includeContentLoaded', function(event) {
		
	});
	
	// referral param
	// requires $routeParams & $cookies
	//if ($routeParams.ref) $cookies.referral = $routeParams.ref;
	
	$scope.slideNavBool = -1;
	$scope.slideNav = function(value) {
		console.log(value);
		if (value == 1 || value == -1) $scope.slideNavBool = value;
		else $scope.slideNavBool *= -1;
	}
	
	//!-- App Root Scoope Functions --//
	
}
//}]);
