//angular.module('io.controller.user', [])
//.controller('UserCtrl',
//['$scope', '$http', '$routeParams',
//function($scope, $rest, $routeParams) {

function UserCtrl($rootScope, $scope, $rest, $routeParams, $session) {
	console.log('UserCtrl (', $scope.$id, ')');
	
	// forms
	//$scope.forms
	$scope.user = {};
	$scope.email = {};
	$scope.password = {};

	$scope.loadUser = function(profile_ID) {
		console.log('loadUser(', profile_ID, ')');
		profile_ID = profile_ID || $rootScope.session.user.user_ID;

		$rest.http({
				method:'get',
				url: $rest.server+'user/'+profile_ID
			}, function(data){
				$scope.user = data;
			});
	};
	$scope.loadUserName = function(profile_name) {
		console.log('loadUserName(', profile_name, ')');
		profile_name = profile_name || $rootScope.session.user.user_username;

		$rest.http({
				method:'get',
				url: $rest.server+'user/name/'+profile_name
			}, function(data){
				$scope.user = data;
			});
	};

	$scope.updateUser = function(callback) {
		console.log('updateUser(', callback, ')');
		if ($scope.user.user_ID) {	// update
			$rest.http({
					method:'put',
					url: $rest.server+'user',
					data: $scope.user
				}, function(data){
					console.log(data);
					$session.update();
					console.log($session);
					$rootScope.alerts = [{'class':'success', 'label':'User Information:', 'message':'Saved'}];
					if (callback) { callback(); }
				});
		} else {	// create
			/*
			//$scope.user.user_ID = data;
			*/
		}

	};
	$scope.deleteUser = function() {
		if (confirm('Are you sure you want to delete your account? After clicking `OK`, this action cannot be undone.')) {
			$rest.http({
					method:'delete',
					url: $rest.server+'account'
				}, function(data){
					$scope.href('/sign/out');
				});
			/*$http.get('/user/delete')
				.success(function(data){
					if ($rootScope.checkHTTPReturn(data)) {
						$scope.href('/sign/out');
					}
				})
				.error(function() {
					$rootScope.http_error();
				});*/
		}
	};

	$scope.check = {};
	$scope.check.user_username = function(user_username) {
		console.log('check.user_username('+user_username+')');
		if (user_username) {	// update
			//$scope.user.user_username = user_username.replace(/[^a-z0-9_]/, "");

			$rest.http({
					method:'get',
					url: $rest.server+'user/unique/'+encodeURIComponent(user_username)
				}/*, function(data){
					// do nothing with return, auto handeled with errors
				}*/);
		} else {
			/*
			add in positive indicator
			*/
		}

	};

	$scope.updateEmail = function() {

		$rest.http({
				method:'put',
				url: $rest.server+'account/email_change/',
				data: $scope.email
			}, function(data){
				$scope.email = {};
				$session.update();
				$rootScope.alerts = [{'class':'success', 'label':'Change Email:', 'message':'Saved'}];
			});
	};

	$session.require_signin(function(){
		console.log('UserCtrl require_signin');
		//$scope.user = $session.user ? $session.user : {};
		if ($routeParams.profile_name) {
			$scope.loadUserName($routeParams.profile_name);
		} else if ($routeParams.profile_ID) {
			$routeParams.profile_ID = $routeParams.profile_ID || 0;
			$scope.user = {
				'user_ID':$routeParams.profile_ID
			};
			$scope.loadUser($routeParams.profile_ID);
		} else {
			//$scope.user = $session.user;
			$scope.loadUser();
		}
		console.log($scope.user);
	});
}
UserCtrl.$inject = ['$rootScope', '$scope', '$rest', '$routeParams', '$session'];
//}]);
