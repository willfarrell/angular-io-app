/*global objectLength:true, syncVar:true, db:true */

//angular.module('io.controller.sign', [])
//.controller('SignCtrl', ['$scope', '$rest', '$cookies', '$routeParams', function($scope, $http, $cookies, $routeParams) {

function SignCtrl($rootScope, $scope, $cookies, $routeParams, $rest, $session) {
	console.log('SignCtrl (', $scope.$id, ')');
	$scope.page = $routeParams.page ? $routeParams.page : 'in';

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
				url: '/account/signup',
				data: $scope.signup
			}, function(data){
				$scope.signin.email = $scope.signup.email;
				$rootScope.alerts = [{'class':'success', 'label':'Account created!', 'message':'Check your email for an activation link.'}];
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
				url: '/account/signin',
				data: {
					email:		$scope.signin.email,
					password:	$scope.signin.password,
					remember:	$scope.signin.remember
					//ua:			navigator.userAgent.toLowerCase()
				}
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
						$rootScope.session = syncVar(data, $rootScope.session);
						$rootScope.account.remember = $scope.signin.remember;
						$rootScope.offline.run_request();
						console.log($rootScope.session);
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
				url: '/account/totp/'+code,
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
				console.log($rootScope.session);
				$session.save();
				$scope.signin = {};	// clear form

				//$scope.signin_callbacks(); // runs all callbacks that were set by siblings
				// refresh page
				//$scope.refresh();
				$rootScope.redirect();
			});

		/*$http.put('/account/totp/'+code)
			.success(function(data) {
				console.log('account_totp.put.success');
				if ($rootScope.checkHTTPReturn(data) && data) {
					$rootScope.session = syncVar(data, $rootScope.session);
					//if ($rootScope.session != {})
					$session.account.remember = $scope.signin.remember;
					console.log($rootScope.session);
					$rootScope.saveSession();
					$scope.signin = {};	// clear form

					//$scope.signin_callbacks(); // runs all callbacks that were set by siblings
					// refresh page
					//$scope.refresh();
					$rootScope.redirect();
				} else {
					$scope.errors.totp = 'Verification Failed';
				}
			})
			.error(function() {
				console.log('account_totp.put.success');
				$rootScope.http_error();
			});*/
	};

	//-- Sign Out --//
	$scope.account_signout = function() {
		console.log('account_signout()');
		db.clear(); // clear localstorage
		$rootScope.$emit('session', false);
		$session.reset();
		if ($session.user.user_ID) {	// prevent multiple calls
			$rest.http({
					method:'get',
					url: '/account/signout'
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
	};
	//-- End Sign Out --//
	/*if ($routeParams.confirm_hash) {
		$scope.page = 'in';
	}*/
	if ($scope.page === 'out') {
		$scope.account_signout();
	} else if ($rootScope.session.user_ID) {
		// redirect if already signed in
		$rootScope.redirect();
	}

}
SignCtrl.$inject = ['$rootScope', '$scope', '$cookies', '$routeParams', '$rest', '$session'];
//}]);
