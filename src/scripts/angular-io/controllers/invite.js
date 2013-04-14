//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

function InviteCtrl($scope) {
	console.log('InviteCtrl ('+$scope.$id+')');
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
	$scope.mailto = function(subject, message) {
		console.log(subject+', '+message);
		$rootScope.href('mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message)+'', true);
	};
	$scope.twitter = function(text, url) {
		$rootScope.href('https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+encodeURIComponent(url)+'', true);
	};
	$scope.require_signin();
}
InviteCtrl.$inject = ['$scope'];

//}]);
