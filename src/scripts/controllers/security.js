
function SecurityCtrl($rootScope, $scope, $rest) {
	console.log('SecurityCtrl (', $scope.$id, ')');
	$scope.services = [
		{
			'id'		:'google',
			'name'		:'Google Authenticator',
			'website'	:'https://support.google.com/accounts/bin/answer.py?hl=en&answer=1066447',
			'ios'		:'https://itunes.apple.com/us/app/google-authenticator/id388497605',
			'android'	:'https://m.google.com/authenticator',
			'bb'		:'https://m.google.com/authenticator'
		}
	];
	$scope.security = {};
	//$scope.security.totp = config.security.totp;

	$scope.loadSecurity = function() {
		console.log('loadSecurity()');

		$rest.http({
				method:'get',
				url: $rest.server+'user/security'
			}, function(data){
				if (data !== '') {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							$scope.security[i] = data[i];
						}
					}
				}
			});
	};

	$scope.updateSecurity = function() {
		console.log('updateSecurity()');
		console.log($scope.security);

		$rest.http({
				method:'put',
				url: $rest.server+'user/security',
				data: $scope.security
			}, function(data){
				$rootScope.alerts = [{'class':'success', 'label':'Security:', 'message':'Saved'}];
			});
	};

	$scope.loadTOTPService = function() {
		console.log('loadTOTPService()');

		$rest.http({
				method:'get',
				url: $rest.server+'user/totp/'+$scope.security.totp.service
			}, function(data){
				$scope.security.totp.secret = JSON.parse(data);
			});
	};

	$scope.checkTOTP = function(code) {
		console.log('checkTOTP(', code, ')');
		$scope.test_code_check = true;

		$rest.http({
				method:'put',
				url: $rest.server+'user/totp/'+$scope.security.totp.secret+'/'+code
			}, function(data){
				$scope.test_code_return = data;
			});
	};

	$scope.testPGP = function(email) {
		console.log('testPGP(', email, ')');

		$rest.http({
				method:'put',
				url: $rest.server+'user/pgp/',
				data: email
			});
	};

	$scope.loadSecurity();
	//$session.require_signin();
}
SecurityCtrl.$inject = ['$rootScope', '$scope', '$rest'];
