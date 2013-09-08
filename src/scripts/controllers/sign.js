/*global objectLength:true, syncVar:true */

//angular.module('io.controller.sign', [])
//.controller('SignCtrl', ['$scope', '$rest', '$cookies', '$routeParams', function($scope, $http, $cookies, $routeParams) {

function SignCtrl($config, $rootScope, $scope, $cookies, $routeParams, $rest, $session, $localStorage, $sessionStorage) {
	console.log('SignCtrl (', $scope.$id, ')');
	$scope.page = $routeParams.page ? $routeParams.page : 'in';
	
	$scope.config = {};
	$config.get('password', {}, function(value){ $scope.config = value; });
	
	//-- Sign Up --//
	$scope.signup = {
		//email:'',
		//password:''
		//country_code: $scope.$locale.id.substr(3,2).toUpperCase(),
	};

	$scope.totp = {
		value:'',
		timer:60
	};
	$scope.account_signup = function() {
		console.log('account_signup()');
		$scope.signup.referral = $cookies.referral;

		$rest.http({
				method:'post',
				url: $rest.server+'account/signup',
				data: $scope.signup
			}, function(data){ // sign in
				$scope.signin.email = $scope.signup.email;
				$scope.signin.password = $scope.signup.password;
				$scope.signup = {};
				$scope.account_signin();
			}, function(data){ // requires confirm
				$scope.signin.email = $scope.signup.email;
				$scope.signup = {};
			});

		/*$http.post('/account/signup', $scope.signup)
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
			});*/
	};
	//-- End Sign Up --//
	//-- Sign In --//
	$scope.signin = {
		//email:'',
		//password:'',
		remember:true
	};

	$scope.account_signin = function() {
		console.log('account_signin()');
		//redirect || (redirect = '#/');

		$rest.http({
				method:'post',
				url: $rest.server+'account/signin',
				data: $scope.signin
			}, function(data){
				if (data.totp) {
					$scope.action = 'totp';
					$scope.user_ID = data.user_ID;
				} else if (data.account) {
					$session.account = data.account;
					$session.account.remember = $scope.signin.remember;
					$session.user = data.user;
					$session.company = data.company;

					$session.save();
					$scope.signin = {};	// clear form
					$rootScope.$emit('session', true);
					$rootScope.redirect();
				} else {
					// catch any server side errors
					$rootScope.alerts = [{'class':'error', 'label':'Internal Error', 'message':'Please notify us about it.'}];
				}
			});

		/*$http.post('/account/signin',
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
						$session = syncVar(data, $session);
						$rootScope.account.remember = $scope.signin.remember;
						$rootScope.offline.run_request();
						console.log($session);
						$rootScope.saveSession();
						$scope.signin = {};	// clear form
						$rootScope.redirect();
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
			});*/
	};
	//-- End Sign In --//
	$scope.account_totp = function(code) {
		console.log('account_totp(', code, ')');
		//redirect || (redirect = '#/');

		$rest.http({
				method:'put',
				url: $rest.server+'account/totp/verify/'+code,
				data: {
					email:		$scope.signin.email,
					password:	$scope.signin.password,
					remember:	$scope.signin.remember
					//ua:			navigator.userAgent.toLowerCase()
				}
			}, function(data){
				$session.account = data.account;
				$session.account.remember = $scope.signin.remember;
				$session.user = data.user;
				$session.company = data.company;
				console.log($session);
				$session.save();
				$scope.signin = {};	// clear form

				//$scope.signin_callbacks(); // runs all callbacks that were set by siblings
				// refresh page
				//$scope.refresh();
				$rootScope.redirect();
			});
	};

	//-- Sign Out --//
	$scope.account_signout = function() {
		console.log('account_signout()');
		
		if ($session.user.user_ID) {	// prevent multiple calls
			$rest.http({
					method:'get',
					url: $rest.server+'account/signout'
				}, function(data){
					$rootScope.alerts = [{'class':'info', 'label':'Signed Out'}];
					$rootScope.href('/sign/in');
				});

			/*$http.get('/account/signout')
				.success(function(data) {
					console.log('account_signout.get.success');
					console.log(data);
					$rootScope.alerts = [{'class':'info', 'label':'Signed Out'}];
					$rootScope.href('/sign/in');
				})
				.error(function() {
					console.log('account_signout.get.error');
					$rootScope.http_error();
				});*/
		} else {
			$rootScope.href('/sign/in');
		}
		
		$localStorage.clear();
		$sessionStorage.clear();
		$rootScope.$emit('session', false);
		$session.reset();
	};
	//-- End Sign Out --//
	/*if ($routeParams.confirm_hash) {
		$scope.page = 'in';
	}*/
	if ($scope.page === 'out') {
		$scope.account_signout();
	} else if ($session.user_ID) {
		// redirect if already signed in
		$rootScope.redirect();
	}

}
SignCtrl.$inject = ['$config', '$rootScope', '$scope', '$cookies', '$routeParams', '$rest', '$session', '$localStorage', '$sessionStorage'];
//}]);
