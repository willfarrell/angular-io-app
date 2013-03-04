//angular.module('io.controller.page', [])
//.controller('PageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
InviteCtrl.$inject = ['$scope'];
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
		$('#alertModal').modal('show');
	};*/
	
	$scope.require_signin();
}

//}]);