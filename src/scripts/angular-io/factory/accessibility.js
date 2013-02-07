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
		console.log('$accessibility.init()');
		// accessibility
		if ($scope.settings.accessibility) {
			$scope.load();
		}
		
		// zoom
		//$scope.zoom($scope.settings.zoom);
	};
	
	$scope.save = function() {
		db.set('accessibility', $scope.settings);
		console.log($scope.settings);
	};
	
	$scope.toggle = function() {
		console.log('$accessibility.toggle()');
		if ($scope.settings.accessibility) {
			$scope.settings.accessibility = false;
		} else {
			$scope.settings.accessibility = true;
		}
		$scope.load();
	};
	
	$scope.load = function() {
		console.log('$accessibility.load()');
		if ($scope.settings.accessibility) {
			$rootScope.loadStyle($scope.css_file);
		} else {
			$rootScope.unloadStyle($scope.css_file);
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
	
	$rootScope.$watch($rootScope, function() {
		$scope.init();
	});
	
	return $scope; // important
}]);

})(angular);