//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$rest', '$routeParams', function($scope, $http, $routeParams) {

function InviteCtrl($rootScope, $scope, $session) {
	console.log('InviteCtrl (', $scope.$id, ')');
	/*$scope.copyAlert = function(site_url) {
		console.log('copyAlert("'+site_url+'")');
		$rootScope.modal = {
			hide:{
				header:true,
				close:false,
				footer:false
			},
			header:"",
			content:'Copy to clipboard: Ctrl+C, enter<br><input value="'+site_url+'" />',
			buttons:[
				{
					"class":"",
					value:"Close",
					callback:function() {}
				}
			]
		};
		console.log($rootScope.modal);
	};*/
	
	// window.open
	$scope.mailto = function(subject, body) {
		console.log('mailto:?subject=',subject, '&body=', body);
		$rootScope.href('mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body), true);
	};
	
	$scope.twitter = function(text, url) {
		$rootScope.href('https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+encodeURIComponent(url), true);
	};
	
	$scope.facebook = function(text, url) {
		$rootScope.href('http://www.facebook.com/sharer.php?u='+encodeURIComponent(url)+'&t='+encodeURIComponent(text), true);
	};
	
	$session.require_signin();
}
InviteCtrl.$inject = ['$rootScope', '$scope', '$session'];

//}]);
