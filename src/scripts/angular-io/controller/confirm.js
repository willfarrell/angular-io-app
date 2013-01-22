//angular.module('io.controller.confirm', [])
//.controller('ConfirmCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
function ConfirmCtrl($scope, $http, $routeParams) {
	console.log('ConfirmCtrl ('+$scope.$id+')');
	
	$scope.errors = {};
	$scope.hash = $routeParams.hash;
	$scope.status = false; // used on confirm page
	
	$scope.check = function(hash) {
		$scope.errors = {};
		
		hash || (hash = $scope.hash);
		$http.get($scope.settings.server+'account/confirm_email/'+encodeURIComponent(hash))
			.success(function(data) {
				console.log(data);
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (data.errors) $scope.errors = data.errors;
				if (!data.alerts && !data.errors) {
					$scope.session.email_confirm = true;
					$rootScope.alerts = [{'class':'success', 'label':'Email Confirmation:', 'message':'Confirmed'}];
				}
			});
	};
	
	$scope.resend = function() {
		$scope.errors = {};
		$http.get($scope.settings.server+'account/resend_confirm_email/')
			.success(function(data) {
				console.log(data);
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (data.errors) $scope.errors = data.errors;
				if (!data.alerts && !data.errors) {
					$rootScope.alerts = [{'class':'info', 'label':'Email Confirmation:', 'message':'Sent'}];
				}
			});
	}
}
//}]);
