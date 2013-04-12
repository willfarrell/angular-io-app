/*global */

// load help tooltips/popover
// <i class="icon-help" data-io-help="id"></i>
// <i class="icon-help" data-ng-click="help.l(id)"></i>
angular.module('io.factory')
.factory('$helpTooltip', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('helpTooltipFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.db = {};
	
	$scope.l = function(id) {
		$http.get($rootScope.settings.server+'/i18n/'+$rootScope.locale+'/help/'+id+'.txt')
			.success(function(data) {
				$scope.db[id] = data;
			})
			.error(function() {
				// load in request to have made
				$scope.db[id] = 'We haven\'t written any help for this yet. Would you like us too? [yes]';
			});
	};
	
	
	return $scope;
}]);
