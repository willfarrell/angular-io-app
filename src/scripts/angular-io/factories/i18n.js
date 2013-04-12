/*global */

// <p>{{i18n.string}}
angular.module('io.factory')
.factory('$i18n', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('I18nFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.db = {};
	
	$scope.locale = '';
	
	// load configs
	if (!$rootScope.settings.i18n) {
		$rootScope.loadJSON(null, 'config.i18n', 'json', function(data){
			$rootScope.settings.i18n = data;
		});
	}
	
	// translate
	$scope.t = function() {
		
	};
	
	// localized
	$scope.l = function() {
		
	};
	
	return $scope;
}]);
