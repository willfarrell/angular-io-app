(function (angular) {
angular.module('io.factory.accessibility', [])
.factory('$accessibility', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('AccessibilityFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.css_file = "css/accessibility.min.css";
	
	$scope.settings = db.get('accessibility', {
		'accessibility':false,
		//'dyslexic':false,
		'zoom':1
	});
	
	$scope.init = function() {
		// accessibility
		if ($scope.settings.accessibility) {
			$scope.settings.accessibility = true;
			$rootScope.loadStyle($scope.css_file);
		}
		
		// zoom
		//$scope.zoom($scope.settings.zoom);
	};
	
	$scope.save = function() {
		db.set('accessibility', $scope.settings);
		console.log($scope.settings);
	};
	
	$scope.toggle = function() {
		if ($scope.settings.accessibility) {
			$scope.settings.accessibility = false;
			$rootScope.unloadStyle($scope.css_file);
		} else {
			$scope.settings.accessibility = true;
			$rootScope.loadStyle($scope.css_file);
		}
		$scope.save();
	};
	
	// settings zoom function
	$scope.zoom = function(zoom) {
		zoom || (zoom = 1);
		$scope.settings.zoom = zoom;
		
		//document.body.style.zoom = $scope.settings.zoom;
		//document.body.style.MozTransform = 'scale(' + ($scope.settings.zoom / 100) + ')';
		document.body.style['font-size'] = ($scope.settings.zoom * 100) +'%';
		
		$scope.save();
	};
	
	$scope.init();
	
	return $scope; // important
}]);

})(angular);