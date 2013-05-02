//angular.module('io.controller.password', [])
//.controller('PasswordCtrl', ['$scope', '$rest', function($scope, $http) {

function PasswordCtrl($rootScope, $scope, $session, $rest) {
	console.log('PasswordCtrl (', $scope.$id, ')');

	$scope.updatePassword = function() {
		$rest.http({
				method:'put',
				url: '/account/password_change/',
				data: $scope.password
			}, function(data){
				$scope.password = {};
				$session.account.password_timestamp = +new Date();
				$session.account.password_age = 0;
				$rootScope.alerts = [{'class':'success', 'label':'Change Password:', 'message':'Saved'}];
			});

		/*$http.put('/account/password_change/', $scope.password)
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
			});*/
	};

	$scope.resetPassword = function(email) {
		console.log('reset_password(', email, ')');

		$rest.http({
				method:'get',
				url: '/account/reset_send/'+encodeURIComponent(email)
			}, function(data){
				$rootScope.alerts = [{'class':'info', 'message':'We have sent an email to '+email+' with further instructions.'}];
			});

		/*$http.get('/account/reset_send/'+encodeURIComponent(email))
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
			});*/
	};

}
PasswordCtrl.$inject = ['$rootScope', '$scope', '$session', '$rest'];
//}]);
