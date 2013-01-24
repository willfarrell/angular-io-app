//angular.module('io.controller.sign', [])
//.controller('SignCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
SignCtrl.$inject = ['$scope', '$http', '$routeParams'];
function SignCtrl($scope, $http, $routeParams) {
	console.log('SignCtrl ('+$scope.$id+') '+$routeParams.action+' '+$routeParams.redirect);
	$scope.errors = {};		// form errors

	$scope.referral = $routeParams.ref;	// referral hash_(32)

	$scope.action = $routeParams.action ? $routeParams.action : 'in';

	//-- Sign Up --//
	$scope.signup = {
		//email:'',
		//password:'',
		//country_code: $scope.$locale.id.substr(3,2).toUpperCase(),
	};


	$scope.account_signup = function() {
		console.log('account_signup()');
		$scope.signup.referral = $scope.referral;

		$http.post($scope.settings.server+'account/signup', $scope.signup)
			.success(function(data) {
				console.log('account_signup.post.success');
				console.log(data);
				$scope.errors = (data.errors) ? data.errors : {};
				$rootScope.alerts = (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					//$scope.signup = {};

					$scope.action = 'in';
					$rootScope.alerts = [{'class':'success', 'label':'Account created!', 'message':'Check your email for a activation link.'}];
				}
			})
			.error(function() {
				console.log('account_signup.post.error');
				$rootScope.http_error();
			});
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

		$http.post($scope.settings.server+'account/signin',
			{
				email:		$scope.signin.email,
				password:	$scope.signin.password,
				remember:	$scope.signin.remember
				//ua:			navigator.userAgent.toLowerCase()
			})
			.success(function(data) {
				console.log('account_signin.post.success');
				console.log(data);

				$scope.errors = (data.errors) ? data.errors : {};
				$rootScope.alerts = (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					
					//data.email_confirm
					
					$rootScope.session = syncVar(data, $rootScope.session);
					$rootScope.session.save = $scope.signin.remember;
					$rootScope.saveSession();
					$scope.signin = {};	// clear form

					//$scope.signin_callbacks(); // runs all callbacks that were set by siblings
					// refresh page
					//$scope.refresh();
					console.log($routeParams.redirect);
					if ($routeParams.redirect) {
						$scope.href('#/'+$routeParams.redirect);
					} else {
						$scope.href('#/'+$rootScope.settings.dashboard);
					}
				}
			})
			.error(function() {
				console.log('account_signin.post.success');
				$rootScope.http_error();
			});
	};
	//-- End Sign In --//

	$scope.reset_password = function() {
		console.log('reset_password()');
		$http.get($scope.settings.server+'account/reset_email/'+encodeURIComponent($scope.signin.email))
			.success(function(data) {
				console.log('reset_password.get.success');
				console.log(data);
				$scope.errors = (data.errors) ? data.errors : {};
				$rootScope.alerts = (data.alerts) ? data.alerts : [];
				$rootScope.alerts = [{'class':'info', 'message':'We have sent an email to '+$scope.signin.email+' with further instructions.'}]; // replace in {{signin.email}}
			})
			.error(function() {
				console.log('reset_password.get.error');
				$rootScope.http_error();
			});
	};

	//-- Sign Out --//
	$scope.account_signout = function() {
		console.log('account_signout()');
		db.clear(); // clear localstorage
		if (objectLength($rootScope.session)) {	// prevent multiple calls
			$rootScope.resetSession();
			$http.get($scope.settings.server+'account/signout')
				.success(function(data) {
					console.log('account_signout.get.success');
					console.log(data);
					$rootScope.alerts = [{'class':'info', 'label':'Signed Out'}];
					//$rootScope.href('#/sign/in');
					console.log(objectLength($rootScope.session));
				})
				.error(function() {
					console.log('account_signout.get.error');
					$rootScope.http_error();
				});
		}
	};
	//-- End Sign Out --//
	
	if ($scope.action == 'out') {
		$scope.account_signout();
		$scope.action = 'in';
	} else {
		// redirect if already signed in
		if ($rootScope.session.user_ID) $scope.href('#/'+$rootScope.settings.dashboard);
	}
	

}
//}]);