//angular.module('app.controller.dashboard', [])
//.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {
function DashboardCtrl($scope, $http, $routeParams) {
	console.log('DashboardCtrl (' + $scope.$id + ')');
	//-- App Functions Here --//
	$scope.site = '';
	$scope.sites = {};
	$scope.loadSites = function() {
		$http.get($scope.settings.server+'site/').success(function(data) {
			console.log(data);
			if (data != []) $scope.sites = data;
		}).error(function() {
			$scope.http_error();
		});
	};
	$scope.addSite = function(site) {
		console.log('addSite("'+site+'")');
		var http_config = {
				method:'POST',
				url:$scope.settings.server+'site/',
				data:{
					'site': site
				}
			},
		
			callback = function(data) {
				console.log(data);
				$scope.sites[data] = site;
				$scope.site = '';
			};
		
		$http(http_config)
			.success(function(data) {
				callback(data);
			}).error(function() {
				$scope.offline.que_request(http_config, callback);
				$scope.http_error();
			});
	};
	$scope.removeSite = function(site_ID) {
		console.log('removeSite("'+site_ID+'")');
		var http_config = {
				'method': 'DELETE',
				'url': $scope.settings.server+'site/' + encodeURIComponent(site_ID)
			},
			callback = function(data) {
				delete $scope.sites[site_ID];
			};
		
		$http(http_config).success(function(data) {
			callback(data);
		}).error(function() {
			$scope.offline.que_request(http_config, callback);
			$scope.http_error();
		});
	};
	
	$scope.confirmSiteDelete = function(site_ID, site_name) {
		console.log('confirmSiteDelete("'+site_ID+'", "'+site_name+'")');
		$rootScope.modal = {
			hide:{
				header:false,
				close:false,
				footer:false
			},
			header:"Confirm",
			content:"Are you sure you want to delete "+site_name+"?",
			buttons:[
				{
					"class":"btn-primary",
					value:"Delete",
					callback:function() {
						$scope.removeSite(site_ID);
					}
				},
				{
					"class":"",
					value:"Cancel",
					callback:function() {}
				}
			]
		};
		console.log($rootScope.modal);
		$('#alertModal').modal('show');
		
	};
	
	//-- End App Functions Here --//
	$scope.require_signin(function() {
		$scope.loadSites();
	});
}
//}]);