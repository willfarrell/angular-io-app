//angular.module('io.controller.reset', [])
//.controller('ResetCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
ResetCtrl.$inject = ['$scope', '$http', '$routeParams'];
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
				console.log(data);
				$scope.errors = (data.errors) ? data.errors : {};
				$rootScope.alerts = (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					if (data) {
						$scope.state.verify = true;
						$scope.auth = data;
					} else {
						$scope.state.reset = true;
					}

					$('#passwordModal').modal('show');
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};


	$scope.verify = function() {
		$http.put($scope.settings.server+'/account/reset_verify/', {hash:$scope.hash, id:$scope.ID})
			.success(function(data) {
				console.log(data);
				$scope.errors = (data.errors) ? data.errors : {};
				$rootScope.alerts = (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.state.verify = false;
					$scope.state.reset = true;
					$scope.auth = {};
					//$('#passwordModal').modal('show');
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};

	$scope.reset = function() {
		$http.put($scope.settings.server+'/account/reset_password/', $scope.password)
			.success(function(data) {
				console.log(data);
				$scope.errors = (data.errors) ? data.errors : {};
				$rootScope.alerts = (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.state.reset = false;
					$scope.state.signin = true;
					$scope.password.new_password = '';

					//window.location.href="app#/";
					$rootScope.alerts = [{'class':'success','label':'Password Saved'}];
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};

	$scope.check();
}
//}]);
