//angular.module('io.controller.password', [])
//.controller('PasswordCtrl', ['$scope', '$http', function($scope, $http) {
PasswordCtrl.$inject = ['$scope', '$http'];
function PasswordCtrl($scope, $http) {
	console.log('PasswordCtrl ('+$scope.$id+')');
	
	$scope.updatePassword = function() {
		$http.put($scope.settings.server+'account/password_change/', $scope.password)
			.success(function(data) {
				console.log(data);
				$scope.errors.password	= (data.errors) ? data.errors : {};
				$rootScope.alerts 		= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.password = {};
					$rootScope.alerts = [{'class':'success', 'label':'Change Password:', 'message':'Saved'}];
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
}
//}]);