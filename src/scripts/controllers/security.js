
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

		/*$http.get('/user/security')
			.success(function(data) {
				console.log('loadSecurity.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					if (data !== '') {
						$scope.security = data;
					}
					console.log($scope.security);
				}
			})
			.error(function(){
				console.log('loadSecurity.get.error');
			});*/
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

		/*$http.put('/user/security', $scope.security)
			.success(function(data) {
				console.log('updateSecurity.put.success');
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.alerts = [{'class':'success', 'label':'Security:', 'message':'Saved'}];
					}
				})
				.error(function(){
					console.log('updateSecurity.put.error');
				});*/
	};

	$scope.loadTOTPService = function() {
		console.log('loadTOTPService()');

		$rest.http({
				method:'get',
				url: $rest.server+'totp/'+$scope.security.totp.service
			}, function(data){
				$scope.security.totp.secret = JSON.parse(data);
			});

		/*$http.get('/totp/'+$scope.security.totp.service)
			.success(function(data) {
				console.log('loadTOTPService.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					if (data) {
						$scope.security.totp.secret = JSON.parse(data);
					}
				}
			})
			.error(function(){
				console.log('loadTOTPService.get.error');
			});*/
	};

	$scope.checkTOTP = function(code) {
		console.log('checkTOTP(', code, ')');
		$scope.test_code_check = true;

		$rest.http({
				method:'put',
				url: $rest.server+'totp/'+$scope.security.totp.secret+'/'+code
			}, function(data){
				$scope.test_code_return = data;
			});

		/*$http.put('/totp/'+$scope.security.totp.secret+'/'+code)
			.success(function(data) {
				console.log('checkTOTP.put.success');
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.test_code_return = data;
				}
			})
			.error(function(){
				console.log('checkTOTP.put.error');
			});*/
	};

	$scope.testPGP = function(email) {
		console.log('testPGP(', email, ')');

		$rest.http({
				method:'put',
				url: $rest.server+'user/pgp/',
				data: email
			});

		/*$http.put('/user/pgp/', email)
			.success(function(data) {
				console.log('testPGP.put.success');
				if ($rootScope.checkHTTPReturn(data)) {
				}
			})
			.error(function(){
				console.log('testPGP.put.error');
			});*/
	};

	$scope.loadSecurity();
	//$session.require_signin();
}
SecurityCtrl.$inject = ['$rootScope', '$scope', '$rest'];
