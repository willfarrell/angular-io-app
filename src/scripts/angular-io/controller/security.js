SecurityCtrl.$inject = ['$scope', '$http'];
function SecurityCtrl($scope, $http) {
	console.log('SecurityCtrl ('+$scope.$id+')');
	
	$scope.services = [
		{
			"id"		:"google",
			"name"		:"Google Authenticator",
			"website"	:"https://support.google.com/accounts/bin/answer.py?hl=en&answer=1066447",
			"ios"		:"https://itunes.apple.com/us/app/google-authenticator/id388497605",
			"android"	:"https://m.google.com/authenticator",
			"bb"		:"https://m.google.com/authenticator"
		}
	];
	
	$scope.security = {}
	$scope.security.totp = $rootScope.settings.security.totp;
 	
 	$scope.loadSecurity = function() {
 		console.log('loadSecurity()');
 		$http.get($scope.settings.server+'/user/security')
 			.success(function(data) {
 				console.log(data);
 				if (data != "") {
	 				$scope.security = data;
 				}
 				console.log($scope.security);
 			})
 			.error(function(){
	 			
 			});
 	};
 	
 	$scope.updateSecurity = function() {
 		console.log('updateSecurity()');
 		$http.put($scope.settings.server+'/user/security', $scope.security)
 			.success(function(data) {
	 			$rootScope.alerts = [{"class":"success", "label":"Security:", "message":"Saved"}]
 			})
 			.error(function(){
	 			
 			});
 	};
 	
	$scope.loadTOTPService = function() {
		console.log('loadTOTPService()');
		$http.get($rootScope.settings.server+"/totp/"+$scope.security.totp.service)
			.success(function(data) {
				console.log(data);
				if (data) {
					$scope.security.totp.secret = JSON.parse(data);
				}
			})
			.error(function(){
				
			});
	};
	
	$scope.checkTOTP = function($code) {
		console.log('checkTOTP('+$code+')');
		$scope.test_code_check = true;
		$http.put($rootScope.settings.server+"/totp/"+$scope.security.totp.secret+"/"+$code)
			.success(function(data) {
				console.log(data);
				$scope.test_code_return = data;
			})
			.error(function(){
				
			});
	};
	
	$scope.loadSecurity();
	$scope.require_signin();
}