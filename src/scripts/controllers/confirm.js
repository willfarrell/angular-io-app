//angular.module('io.controller.confirm', [])
//.controller('ConfirmCtrl', ['$scope', '$rest', '$routeParams', function($scope, $http, $routeParams) {

function ConfirmCtrl($rootScope, $scope, $rest, $routeParams, $session) {
	console.log('ConfirmCtrl (', $scope.$id, ')');
	
	$scope.hash = ($routeParams && $routeParams.action) ? $routeParams.action : ''; // /:folder/:page/:action
	$scope.status = false; // used on confirm page

	$scope.check = function(hash) {
		$rootScope.alerts = {};
		$rootScope.errors = {};
		hash = hash || $scope.hash;
		
		$rest.http({
				method:'get',
				url: $rest.server+'account/confirm_email/'+encodeURIComponent(hash)
			}, function(data){
				$session.account.email_confirm = true;
				$session.save();
				$rootScope.alerts = [{'class':'success', 'label':'Email Confirmation:', 'message':'Confirmed'}];
			});

		/*$http.get('/account/confirm_email/'+encodeURIComponent(hash))
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$session.account.email_confirm = true;
					$rootScope.saveSession();
					$rootScope.alerts = [{'class':'success', 'label':'Email Confirmation:', 'message':'Confirmed'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});*/
	};

	$scope.resend = function() {
		$rest.http({
				method:'get',
				url: $rest.server+'account/resend_confirm_email/'
			}, function(data){
				$rootScope.alerts = [{'class':'info', 'label':'Email Confirmation:', 'message':'Sent'}];
			});

		/*$http.get('/account/resend_confirm_email/')
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.alerts = [{'class':'info', 'label':'Email Confirmation:', 'message':'Sent'}];
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			});*/
	};

	if ($scope.hash) { $scope.check(); }
}
ConfirmCtrl.$inject = ['$rootScope', '$scope', '$rest', '$routeParams', '$session'];
//}]);
