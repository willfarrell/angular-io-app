//angular.module('io.controller.company', [])
//.controller('CompanyCtrl', ['$scope', '$http', function($scope, $http) {
function CompanyCtrl($scope, $http) {
	console.log('CompanyCtrl ('+$scope.$id+')');

	$scope.errors = {};
	$scope.toggle = {};
	$scope.company = {};
	$scope.user = {};
	$scope.users = {};
	$scope.location = {
		'primary':true,
		'country_code':$rootScope.country_code.toUpperCase()
	};
	$scope.locations = {};
	
	//-- Company --//
	$scope.loadCompany = function() {
		console.log('loadCompany');
		$http.get($scope.settings.server+'company/')
			.success(function(data) {
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.company = data;
					$scope.loadLocations();
				}
			})
			.error(function() {
				$rootScope.http_error();
			});

	};

	$scope.updateCompany = function() {
		$rootScope.alerts = [];
		
		if ($scope.company.company_ID) {	// update
			$http.put($scope.settings.server+'company/', $scope.company)
				.success(function(data) {
					console.log(data);
					$scope.errors 		= (data.errors) ? data.errors : {};
					$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$rootScope.session.company = $scope.company;
						$rootScope.saveSession();
						//$rootScope.updateSession();
						$rootScope.alerts = [{'class':'success', 'label':'Company Profile:', 'message':'Saved'}];
					}
				})
				.error(function() {
					$rootScope.http_error();
				});
		} else {	// create
			$http.post($scope.settings.server+'company/', $scope.company)
				.success(function(data) {
					console.log(data);
					$scope.errors 		= (data.errors) ? data.errors : {};
					$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.company.company_ID = data;
						$rootScope.session.company = $scope.company;
						$rootScope.saveSession();
						//$rootScope.updateSession();
						$rootScope.alerts = [{'class':'success', 'label':'Company Profile:', 'message':'Saved'}];
					}
				})
				.error(function() {
					$rootScope.http_error();
				});
		}
	};
	
	//-- Locations --//
	$scope.loadLocations = function() {
		console.log('loadLocations');
		$http.get($scope.settings.server+'location/')
			.success(function(data) {
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.locations = data;
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	
	$scope.editLocation = function(location) {
		console.log('editLocation(location)');
		console.log(location);
		if (!location) {
			location = {
				'primary':true,
				'country_code':$rootScope.country_code.toUpperCase()
			}
		}
		
		$scope.location = location;
	};
	
	$scope.updateLocation = function() {
		console.log('updateLocation');
		$rootScope.alerts = [];
		
		if ($scope.location.location_ID) {	// update
			$http.put($scope.settings.server+'location/', $scope.location)
				.success(function(data) {
					console.log('updateLocation.put.success');
					console.log(data);
					$scope.errors 		= (data.errors) ? data.errors : {};
					$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.locations[$scope.location.location_ID] = $scope.location;
						$rootScope.alerts = [{'class':'success', 'label':'Location:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateLocation.put.error');
					$rootScope.http_error();
				});
		} else {	// create
			$http.post($scope.settings.server+'location/', $scope.location)
				.success(function(data) {
					console.log('updateLocation.post.success');
					console.log(data);
					$scope.errors 		= (data.errors) ? data.errors : {};
					$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.location.location_ID = data;
						$scope.locations[$scope.location.location_ID] = $scope.location;
						$rootScope.alerts = [{'class':'success', 'label':'Location:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateLocation.post.error');
					$rootScope.http_error();
				});
		}
	};
	
	$scope.deleteLocation = function(id) {
		console.log('deleteLocation('+id+')');
		$http.delete($scope.settings.server+'location/'+id)
			.success(function(data) {
				console.log('deleteLocation.delete.success');
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					delete $scope.locations[id];
				}
			})
			.error(function() {
				console.log('deleteLocation.delete.error');
				$rootScope.http_error();
			});
	};
	
	//-- Users --//
	$scope.loadUsers = function() {

		$http.get($scope.settings.server+'company/user/').success(function(data) {
			console.log(data);
			$scope.errors.user	= (data.errors) ? data.errors : {};
			$rootScope.alerts 	= (data.alerts) ? data.alerts : [];
			if (!data.alerts && !data.errors) {
				$scope.users = data;
			}
		})
		.error(function() {
			$rootScope.http_error();
		});
	};
	
	$scope.editUser = function(user) {
		console.log('editUser(user)');
		console.log(user);
		if (!user) {
			user = {}
		}
		
		$scope.user = user;
	};
	
	//-- About Details --//
	$scope.compileMarkdown = function(text) {
		if (!text) return text;
		//var converter = new Markdown.Converter();
		var converter = new Markdown.getSanitizingConverter();
		return converter.makeHtml(text);
	};

	$scope.require_signin(function(){
		console.log('CompanyCtrl require_signin');
		console.log($rootScope.session.company);
		$scope.company = $rootScope.session.company ? $rootScope.session.company : {
			company_ID:$rootScope.session.company_ID,
			country_code:$rootScope.country_code.toUpperCase()
		};
		$scope.loadCompany();
		$scope.loadUsers();
		$scope.loadLocations();
	});
}
//}]);