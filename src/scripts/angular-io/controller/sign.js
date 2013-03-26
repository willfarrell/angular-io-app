//angular.module('io.controller.sign', [])
//.controller('SignCtrl', ['$scope', '$http', '$cookies', '$routeParams', function($scope, $http, $cookies, $routeParams) {
SignCtrl.$inject = ['$scope', '$http', '$cookies', '$routeParams'];
function SignCtrl($scope, $http, $cookies, $routeParams) {
	console.log('SignCtrl ('+$scope.$id+')');
	
	$scope.errors = {};		// form errors
	$scope.action = $routeParams.action ? $routeParams.action : 'in';
	console.log($scope.action);
	
	//-- Sign Up --//
	$scope.signup = {
		//email:'',
		//password:'',
		//country_code: $scope.$locale.id.substr(3,2).toUpperCase(),
	};

	$scope.totp = {
		value:'',
		timer:60
	};
	
	$scope.account_signup = function() {
		console.log('account_signup()');
		$scope.signup.referral = $cookies.referral;

		$http.post($scope.settings.server+'/account/signup', $scope.signup)
			.success(function(data) {
				console.log('account_signup.post.success');
				if ($rootScope.checkHTTPReturn(data)) {
					//$scope.signup = {};
					$scope.signin.email = $scope.signup.email;
					
					$scope.action = 'in';
					$rootScope.alerts = [{'class':'success', 'label':'Account created!', 'message':'Check your email for an activation link.'}];
				} else { // only if using local alerts and errors
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('account_signup.post.error');
				$rootScope.http_error();
			});
	};
	//-- End Sign Up --//
	
	$scope.redirect = function() {
		console.log('redirect('+$rootScope.session.user_ID+')');
		//if ($rootScope.session.user_ID) {
			var redirect = ($cookies.redirect ? $cookies.redirect : $rootScope.settings.dashboard);
			delete $cookies.redirect;
			$scope.href('/'+redirect);
		//} else {
		//	window.setTimeout(function() {
				//alert(JSON.stringify($rootScope.session));
		//		$scope.redirect();
		//	}, 100);
		//}
	};
	
	//-- Sign In --//
	$scope.signin = {
		//email:'',
		//password:'',
		remember:true
	};

	$scope.account_signin = function() {
		console.log('account_signin()');
		//redirect || (redirect = '#/');

		$http.post($scope.settings.server+'/account/signin',
			{
				email:		$scope.signin.email,
				password:	$scope.signin.password,
				remember:	$scope.signin.remember
				//ua:			navigator.userAgent.toLowerCase()
			})
			.success(function(data) {
				console.log('account_signin.post.success');
				if ($rootScope.checkHTTPReturn(data)) {
					
					if (data.totp) {
						$scope.action = 'totp';
						$scope.user_ID = data.user_ID;
					} else if (data.user_ID) {
						$rootScope.session = syncVar(data, $rootScope.session);
						$rootScope.session.save = $scope.signin.remember;
						$rootScope.offline.run_request();
						
						console.log($rootScope.session);
						$rootScope.saveSession();
						$scope.signin = {};	// clear form
	
						$scope.redirect();
					} else {
						// catch any server side errors
						$rootScope.alerts = [{'class':'error', 'label':'Internal Error', 'message':'Please notify us about it.'}];
					}
				} else { // only if using local alerts and errors
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('account_signin.post.success');
				$rootScope.http_error();
			});
	};
	//-- End Sign In --//
	
	$scope.account_totp = function(code) {
		console.log('account_totp('+code+')');
		//redirect || (redirect = '#/');

		$http.put($scope.settings.server+'/account/totp/'+code)
			.success(function(data) {
				console.log('account_totp.put.success');
				if ($rootScope.checkHTTPReturn(data) && data) {
					
					$rootScope.session = syncVar(data, $rootScope.session);
					//if ($rootScope.session != {})
					$rootScope.session.save = $scope.signin.remember;
					console.log($rootScope.session);
					$rootScope.saveSession();
					$scope.signin = {};	// clear form

					//$scope.signin_callbacks(); // runs all callbacks that were set by siblings
					// refresh page
					//$scope.refresh();
					$scope.redirect();
				} else {
					$scope.errors.totp = "Verification Failed";
				}
			})
			.error(function() {
				console.log('account_totp.put.success');
				$rootScope.http_error();
			});
	};
	
	//-- Sign Out --//
	$scope.account_signout = function() {
		console.log('account_signout()');
		db.clear(); // clear localstorage
		if (objectLength($rootScope.session)) {	// prevent multiple calls
			$rootScope.resetSession();
			$http.get($scope.settings.server+'/account/signout')
				.success(function(data) {
					console.log('account_signout.get.success');
					console.log(data);
					$rootScope.alerts = [{'class':'info', 'label':'Signed Out'}];
					$scope.action = 'in';
					//$rootScope.href('/sign/in');
					console.log(objectLength($rootScope.session));
				})
				.error(function() {
					console.log('account_signout.get.error');
					$rootScope.http_error();
				});
		}
	};
	//-- End Sign Out --//
	
	if ($routeParams.confirm_hash) {
		$scope.action = 'in';
	}
	if ($scope.action == 'out') {
		$scope.account_signout();
		$scope.action = 'in';
	} else if ($rootScope.session.user_ID) {
		// redirect if already signed in
		$scope.redirect();
	}
	

}
//}]);
