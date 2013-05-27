// version 0.1.0

angular.module('io.modules')
.controller('StripeCtrl', ['$rootScope', '$scope', '$rest', '$session', function($rootScope, $scope, $rest, $session) {
	console.log('StripeCtrl (', $scope.$id, ')');
	
	$scope.cc = {};
	
	$scope.saveCC = function() {
		
	};
	
	
	$scope.checkout = function() {
		
	};
	
	$session.require_signin();
}]);