//angular.module('io.controller.onboard', [])
//.controller('OnboardCtrl', ['$scope', '$rest', '$routeParams', function($scope, $http, $routeParams) {

function OnboardCtrl($rootScope, $scope, $cookies, $rest, $routeParams, $session) {
	console.log('OnboardCtrl (', $scope.$id, ') ', $routeParams.page);

	if (!$routeParams.page || $routeParams.page === 'start') { $scope.href('/onboard/'+$rootScope.settings.onboard.start); }
	$scope.page_url = 'view/onboard/'+encodeURIComponent($routeParams.page)+'.html';


	$scope.BuildProgressTracker = function(page, action) {
		console.log('BuildProgressTracker(', page, action, ')');
		var elements = document.querySelector('#progress_tracker').getElementsByTagName('a');

		var after = false;	// apple after class
		for (var i = 0, l = elements.length; i < l; i++ ) {
			elements[ i ].className = '';
			elements[ i ].firstChild.innerHTML = i+1;	// badge value

			if (elements[ i ].href.indexOf('#/onboard/'+page) !== -1) {	// current page
				if (action === 'skip') {	// go to next page
					if (i+1 < l) { $scope.href(elements[ i+1 ].href); }
					else {	// onboard complete - update user_level if not done after subscribe
						$scope.done();
					}
				}
				elements[ i ].className = 'current';
				after = true;
			} else if (after) {
				elements[ i ].href = '';
				elements[ i ].className = 'after';
			}
		}
	};

	$scope.done = function(redirect) {
		$session.account.timestamp_create = 1;

		$rest.http({
				method:'get',
				url: $rest.server+'account/onboard_done'
			}, function(data){
				$session.update(function(){
					if (redirect) { $rootScope.href(redirect); }
					else { $rootScope.redirect(); }
				});
			});

		/*$http.get('/account/onboard_done')
			.success(function(data) {
				console.log('BuildProgressTracker.get.success(', data, ')');
				$session.update(function(){
					if (redirect) { $rootScope.href(redirect); }
					else { $rootScope.redirect(); }
				});
			})
			.error(function() {
				console.log('BuildProgressTracker.get.error');
				$rootScope.http_error();
			});*/
	};


	//-- Buttons --//
	$scope.button = {};
	$scope.button.skip = function() { $scope.href($scope.uri()+'/skip'); };
	//-- End Buttons --//

	$session.require_signin(function() {
		$scope.BuildProgressTracker($routeParams.page, $routeParams.action);
	});
}
OnboardCtrl.$inject = ['$rootScope', '$scope', '$cookies', '$rest', '$routeParams', '$session'];
//}]);
