//angular.module('io.controller.password', [])
//.controller('PasswordCtrl', ['$scope', '$http', function($scope, $http) {

function PasswordCtrl($scope, $http) {
	console.log('PasswordCtrl ('+$scope.$id+')');
	$scope.errors = {};
	$scope.updatePassword = function() {
		$http.put($scope.settings.server+'/account/password_change/', $scope.password)
			.success(function(data) {
				console.log('updatePassword.put.success');
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.password = {};
					$rootScope.alerts = [{'class':'success', 'label':'Change Password:', 'message':'Saved'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('updatePassword.put.error');
				$rootScope.http_error();
			});
	};
	$scope.resetPassword = function(email) {
		console.log('reset_password()');
		$http.get($scope.settings.server+'/account/reset_send/'+encodeURIComponent(email))
			.success(function(data) {
				console.log('resetPassword.get.success');
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$rootScope.alerts = [{'class':'info', 'message':'We have sent an email to '+email+' with further instructions.'}]; // replace in {{signin.email}}
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('resetPassword.get.error');
				$rootScope.http_error();
			});
	};
}
PasswordCtrl.$inject = ['$scope', '$http'];
//}]);