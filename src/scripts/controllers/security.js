
function SecurityCtrl($rootScope, $scope, $rest, $http) {
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
	]; // config.totpservices.json
	
	// load in keyservers
	$scope.keyservers = [];
	$http.get('json/config.keyservers.json')
		.success(function(data){
			$scope.keyservers = data;
			$rootScope.json.keyservers = data;
		});
	
	$scope.security = {
		/*
		totp: {
			service:"google",
			secret:"shhhhh"
		},
		email: {
			keyserver:"keys.gnupg.net"
			publickey:""
		}
		*/
	};
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
				url: $rest.server+'user/totp/generate/'+$scope.security.totp.service
			}, function(data){
				$scope.security.totp.secret = JSON.parse(data);
			});
	};

	$scope.checkTOTP = function(code) {
		console.log('checkTOTP(', code, ')');
		$scope.test_code_check = true;

		$rest.http({
				method:'put',
				url: $rest.server+'user/totp/check/'+$scope.security.totp.secret+'/'+code
			}, function(data){
				$scope.test_code_return = data;
			});
	};

	$scope.testPGP = function(keyserver) {
		console.log('testPGP(',keyserver, ')');

		$rest.http({
				method:'put',
				url: $rest.server+'user/pgp/',
				data: {keyserver:keyserver}
			}, function(data) {
				if (data) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							$scope.security.email[i] = data[i];
						}
					}
				}
				$rootScope.alerts.push({
					'class':'info',
					'label':'Encrypted Email Sent:',
					'message':'Please confirm you can decrypt our encrypted test message before enabling this feature.'
				});
			});
	};

	$scope.loadSecurity();
	//$session.require_signin();
}
SecurityCtrl.$inject = ['$rootScope', '$scope', '$rest', '$http'];
