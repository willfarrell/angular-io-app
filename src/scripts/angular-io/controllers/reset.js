//angular.module('io.controller.reset', [])
//.controller('ResetCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

function ResetCtrl($scope, $http, $routeParams) {
	console.log('ResetCtrl ('+$scope.$id+')');
	$scope.errors = {};
	$scope.hash = $routeParams.reset_hash;
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
		$http.get($scope.settings.server+'/account/reset_check/'+encodeURIComponent($scope.hash))
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
			});
	};


	$scope.verify = function() {
		$http.put($scope.settings.server+'/account/reset_verify/', {hash:$scope.hash, id:$scope.ID})
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
			});
	};

	$scope.reset = function() {
		$http.put($scope.settings.server+'/account/reset_password/', $scope.password)
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
			});
	};

	$scope.check();
}
ResetCtrl.$inject = ['$scope', '$http', '$routeParams'];
//}]);
