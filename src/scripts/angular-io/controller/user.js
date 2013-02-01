//angular.module('io.controller.user', [])
//.controller('UserCtrl',
//['$scope', '$http', '$routeParams',
//function($scope, $http, $routeParams) {
UserCtrl.$inject = ['$scope', '$http', '$routeParams'];
function UserCtrl($scope, $http, $routeParams) {
	console.log('UserCtrl ('+$scope.$id+')');
	
	$scope.errors = {
		user:{},
		email:{}
	};

	// forms
	//$scope.forms
	$scope.user = {};
	$scope.email = {};
	$scope.password = {};

	$scope.loadUser = function(profile_ID) {
		console.log('loadUser('+profile_ID+')');
		profile_ID || (profile_ID = 0);
		
		$http.get($scope.settings.server+'user/'+profile_ID)
			.success(function(data) {
				console.log('loadUser.get.success');
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.user = data;
				}
			})
			.error(function() {
				console.log('loadUser.get.error');
				$rootScope.http_error();
			});
	};
	$scope.loadUserName = function(profile_name) {
		console.log('loadUser('+profile_name+')');
		profile_name || (profile_name = '');
		
		$http.get($scope.settings.server+'user/name/'+profile_name)
			.success(function(data) {
				console.log('loadUser.get.success');
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.user = data;
				}
			})
			.error(function() {
				console.log('loadUser.get.error');
				$rootScope.http_error();
			});
	};

	$scope.updateUser = function() {
		console.log('updateUser()');
		if ($scope.user.user_ID) {	// update
			$http.put($scope.settings.server+'user/', $scope.user)
				.success(function(data) {
					console.log('updateUser.put.success');
					console.log(data);
					$scope.errors.user	= (data.errors) ? data.errors : {};
					$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$rootScope.updateSession();
						console.log($rootScope.session);
						$rootScope.alerts = [{'class':'success', 'label':'User Information:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateUser.put.error');
					$rootScope.http_error();
				});
		} else {	// create
			/*
			//$scope.user.user_ID = data;
			*/
		}

	};
	$scope.deleteUser = function() {
		if (confirm('Are you sure you want to delete your account?')) {
			$http.get($scope.settings.server+'user/delete')
				.success(function(){
					$scope.href('#/sign/out');
				})
				.error(function() {
					$rootScope.http_error();
				});
		}
	};

	$scope.check = {};
	$scope.check.user_name = function(user_name) {
		console.log('check.user_name('+user_name+')');
		
		if (user_name) {	// update
			//$scope.user.user_name = user_name.replace(/[^a-z0-9_]/, "");
			$http.get($scope.settings.server+'account/unique/'+encodeURIComponent(user_name))
				.success(function(data) {
					console.log(data);
					$scope.errors.user 	= (data.errors) ? data.errors : {};
					$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {

					}
				})
				.error(function() {
					$rootScope.http_error();
				});
		} else {
			/*
			add in positive indicator
			*/
		}

	};

	$scope.updateEmail = function() {
		$http.put($scope.settings.server+'account/email_change/', $scope.email)
			.success(function(data) {
				console.log(data);
				$scope.errors.email		= (data.errors) ? data.errors : {};
				$rootScope.alerts 		= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.email = {};
					$rootScope.alerts = [{'class':'success', 'label':'Change Email:', 'message':'Saved'}];
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};

	$scope.compileMarkdown = function(text) {
		if (!text) return text;
		//var converter = new Markdown.Converter();
		var converter = new Markdown.getSanitizingConverter();
		return converter.makeHtml(text);
	};


	$scope.require_signin(function(){
		console.log('UserCtrl require_signin');
		//$scope.user = $rootScope.session.user ? $rootScope.session.user : {};
		if ($routeParams.profile_name) {
			$scope.loadUser($routeParams.profile_name);
		} else {
			$routeParams.profile_ID || ($routeParams.profile_ID = 0);
			$scope.user = {
				'user_ID':$routeParams.profile_ID
			};
			$scope.loadUser($routeParams.profile_ID);
		}
		console.log($scope.user);
	});
}
//}]);