//angular.module('io.controller.confirm', [])
//.controller('ConfirmCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
ConfirmCtrl.$inject = ['$scope', '$http', '$routeParams'];
function ConfirmCtrl($scope, $http, $routeParams) {
	console.log('ConfirmCtrl ('+$scope.$id+')');
	
	$scope.errors = {};
	$scope.hash = ($routeParams && $routeParams.confirm_hash) ? $routeParams.confirm_hash : '';
	$scope.status = false; // used on confirm page
	
	$scope.check = function(hash) {
		$scope.errors = {};
		
		hash || (hash = $scope.hash);
		$http.get($scope.settings.server+'/account/confirm_email/'+encodeURIComponent(hash))
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.session.email_confirm = true;
					console.log($rootScope.session);
					$rootScope.saveSession();
					$rootScope.alerts = [{'class':'success', 'label':'Email Confirmation:', 'message':'Confirmed'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});
	};
	
	$scope.resend = function() {
		$scope.errors = {};
		$http.get($scope.settings.server+'/account/resend_confirm_email/')
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.alerts = [{'class':'info', 'label':'Email Confirmation:', 'message':'Sent'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});
	};
	
	if ($scope.hash) $scope.check();
}
//}]);
