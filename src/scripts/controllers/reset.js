//angular.module('io.controller.reset', [])
//.controller('ResetCtrl', ['$scope', '$rest', '$routeParams', function($scope, $http, $routeParams) {

function ResetCtrl($rootScope, $scope, $rest, $routeParams) {
	console.log('ResetCtrl (', $scope.$id, ')');
	$scope.hash = ($routeParams && $routeParams.action) ? $routeParams.action : ''; // /:folder/:page/:action
	$scope.state = {
		verify:true,
		reset:false,
		signin:false
	};

	$scope.auth = {};	// verify form
	$scope.password = {
		hash:$scope.hash,
		password:''
	}; // reset form

	$scope.check = function() {
		$rest.http({
				method:'get',
				url: '/account/reset_check/'+encodeURIComponent($scope.hash)
			}, function(data){
				if (data === 'true') {
					$scope.state.reset = true;
				} else if (data) {
					$scope.state.verify = true;
					$scope.auth = data;
				} else {
				}
			});

		/*$http.get('/account/reset_check/'+encodeURIComponent($scope.hash))
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					if (data === 'true') {
						$scope.state.reset = true;
					} else if (data) {
						$scope.state.verify = true;
						$scope.auth = data;
					} else {
					}
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				$rootScope.http_error();
			});*/
	};


	$scope.verify = function() {
		$rest.http({
				method:'put',
				url: '/account/reset_verify/',
				data: {hash:$scope.hash, id:$scope.ID}
			}, function(data){
				$scope.state.verify = false;
				$scope.state.reset = true;
				$scope.auth = {};
			});

		/*$http.put('/account/reset_verify/', {hash:$scope.hash, id:$scope.ID})
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.state.verify = false;
					$scope.state.reset = true;
					$scope.auth = {};
					//$('#passwordModal').modal('show');
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				$rootScope.http_error();
			});*/
	};

	$scope.reset = function() {
		$rest.http({
				method:'put',
				url: '/account/reset_password/',
				data: $scope.password
			}, function(data){
				$scope.state.reset = false;
				$scope.state.signin = true;
				$scope.password.new_password = '';

				//window.location.href="app#/";
				$rootScope.alerts = [{'class':'success','label':'Password Saved'}];
			});

		/*$http.put('/account/reset_password/', $scope.password)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.state.reset = false;
					$scope.state.signin = true;
					$scope.password.new_password = '';

					//window.location.href="app#/";
					$rootScope.alerts = [{'class':'success','label':'Password Saved'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				$rootScope.http_error();
			});*/
	};

	if ($scope.hash) { $scope.check(); }
}
ResetCtrl.$inject = ['$rootScope', '$scope', '$rest', '$routeParams'];
//}]);
