/*globals Stripe:true */

angular.module('io.modules')
.controller('BillingCtrl', ['$rootScope', '$scope', '$rest', '$session', function($rootScope, $scope, $rest, $session) {
	console.log('BillingCtrl (', $scope.$id, ')');
	
	$scope.plan = {
		id: 'beta'
	};
	$scope.stripe = {
		'number': '4242 4242 4242 4242',
		'cvc': '000',
		'exp-month': '05',
		'exp-year': '2013'
	};
	
	$scope.saveCC = function() {
		Stripe.createToken($scope.stripe, function(status, response) {
			if (response.error) {
				$rootScope.errors.stripe = response.error.message;
			} else {
				// token contains id, last4, and card type
				
				$rest.http({
						method:'post',
						url: $rest.server+'billing/customer',
						data: {'stripeToken': response.id}
					}, function(data){
						
					}
				);
			}
		});
	};
	
	$scope.checkout = function() {
		
	};
	
	$session.require_signin();
}]);