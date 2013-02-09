//angular.module('io.controller.sign', [])
//.controller('SignCtrl', ['$scope', '$http', '$cookies', '$routeParams', function($scope, $http, $cookies, $routeParams) {
SignCtrl.$inject = ['$scope', '$http', '$cookies', '$routeParams'];
function SignCtrl($scope, $http, $cookies, $routeParams) {
	console.log('SignCtrl ('+$scope.$id+') '+$routeParams.action+' '+$routeParams.redirect);
	$scope.errors = {};		// form errors

	$scope.action = $routeParams.action ? $routeParams.action : 'in';

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
					console.log($rootScope.session);
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