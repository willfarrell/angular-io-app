//angular.module('io.controller.company', [])
//.controller('CompanyCtrl', ['$scope', '$http', function($scope, $http) {

function CompanyCtrl($rootScope, $scope, $rest, $routeParams, $session) {
	console.log('CompanyCtrl (', $scope.$id, ')');

	$scope.errors = {};
	$scope.toggle = {};
	$scope.company = {
		company_ID: 0
	};
	$scope.user = {};
	$scope.users = {};
	$scope.location = {
		'country_code':$rootScope.country_code
	};
	$scope.locations = {};

	//-- Company --//
	$scope.loadCompany = function(profile_ID) {
		console.log('loadCompany(', profile_ID, ')');
		profile_ID = profile_ID || 0;
		$rest.http({
				method:'get', // get,head,post,put,delete,jsonp
				url: '/company/'+profile_ID
			}, function(data){
				$scope.company = data;
				$scope.location = data.location_default_ID ? data.location : $scope.location;
				$scope.location.primary = true;
				/*if ($scope.session.company_ID == data.company_ID) {
					$scope.loadUsers();
					$scope.loadLocations();
				}*/
			});
			
		/*$http.get('/company/'+profile_ID)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.company = data;
					$scope.location = data.location_default_ID ? data.location : $scope.location;
					$scope.location.primary = true;
					//$scope.loadLocations();
					
				} else {
					$scope.errors.company	= (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				$rootScope.http_error();
			});*/

	};

	$scope.loadCompanyName = function(profile_name) {
		console.log('loadCompanyName(', profile_name, ')');
		profile_name = profile_name || '';
		$rest.http({
				method:'get', // get,head,post,put,delete,jsonp
				url: '/company/name/'+profile_name
			}, function(data){
				$scope.company = data;
				$scope.location = data.location_default_ID ? data.location : $scope.location;
				$scope.location.primary = true;
				/*if ($scope.session.company_ID == data.company_ID) {
					$scope.loadUsers();
					$scope.loadLocations();
				}*/
			});
		/*$http.get('/company/name/'+profile_name)
			.success(function(data) {
				console.log('loadCompanyName.get.success');
				if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
					$scope.company = data;
					$scope.location = data.location_default_ID ? data.location : $scope.location;
					$scope.location.primary = true;
				} else {
					$scope.errors.company	= (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('loadCompanyName.get.error');
				$rootScope.http_error();
			});*/
	};

	$scope.updateCompany = function(callback) {
		
		var success = function(company_ID) {
			$session.company = $scope.company;
			console.log($session.company, $scope.company);
			$session.save();
			//$rootScope.updateSession();
			$rootScope.alerts = [{'class':'success', 'label':'Company Profile:', 'message':'Saved'}];
			if (callback) { callback(company_ID); }
		};
		
		if ($scope.company.company_ID) {	// update
			$rest.http({
					method:'put', // get,head,post,put,delete,jsonp
					url: '/company/',
					data: $scope.company
				}, function(data){
					success($scope.company.company_ID);
				});
			/*$http.put('/company/', $scope.company)
				.success(function(data) {
					console.log(data);
					if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
						$session.company = $scope.company;
						$session.save();
						//$rootScope.updateSession();
						$rootScope.alerts = [{'class':'success', 'label':'Company Profile:', 'message':'Saved'}];
						if (callback) { callback($scope.company.company_ID); }
					} else {
						$scope.errors.company	= (data.errors) ? data.errors : {};
					}
				})
				.error(function() {
					$rootScope.http_error();
				});*/
		} else {	// create
			$rest.http({
					method:'post', // get,head,post,put,delete,jsonp
					url: '/company/',
					data: $scope.company
				}, function(data){
					$scope.company.company_ID = data;
					success(data);
				});
			/*$http.post('/company/', $scope.company)
				.success(function(data) {
					console.log(data);
					if ($rootScope.checkHTTPReturn(data, {'errors':true})) {
						$scope.company.company_ID = data;
						$session.company = $scope.company;
						$session.save();
						//$rootScope.updateSession();
						$rootScope.alerts = [{'class':'success', 'label':'Company Profile:', 'message':'Saved'}];
						if (callback) { callback(data); }
					} else {
						$scope.errors	= (data.errors) ? data.errors : {};
					}
				})
				.error(function() {
					$rootScope.http_error();
				});*/
		}
	};

	//-- Locations --//
	$scope.loadLocations = function() {
		console.log('loadLocations');
		$rest.http({
				method:'get', // get,head,post,put,delete,jsonp
				url: '/location/'
			}, function(data){
				$scope.locations = data;
				// load region data
				//var regions = [];
				for (var i in data) {
					if (data.hasOwnProperty(i)) {
						//regions.push(data[i].country_code);
						$rootScope.loadRegions(data[i].country_code);
					}
				}
				//regions = arrayUnique(regions);
				/*for (i in regions) {
					if (regions.hasOwnProperty(i)) {
						$rootScope.loadRegions(regions[i]);
					}
				}*/
			});
		/*$http.get('/location/')
			.success(function(data) {
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.locations = data;
					// load region data
					var regions = [], i;
					for (i in data) {
						if (data.hasOwnProperty(i)) {
							regions.push(data[i].country_code);
						}
					}
					regions = arrayUnique(regions);
					for (i in regions) {
						if (regions.hasOwnProperty(i)) {
							$rootScope.loadRegions(regions[i]);
						}
					}
				}
			})
			.error(function() {
				$rootScope.http_error();
			});*/
	};

	$scope.editLocation = function(location) {
		console.log('editLocation(location)');
		console.log(location);
		if (!location) {
			location = {
				'primary':($scope.locations === {}),
				'country_code':$rootScope.country_code.toUpperCase()
			};
		}
		$scope.location = location;
	};

	$scope.updateLocation = function() {
		console.log('updateLocation()');
		if (!$scope.location.location_name) { return; }
		$rootScope.alerts = [];
		
		if ($scope.location.location_ID) {	// update
			$rest.http({
					method:'put', // get,head,post,put,delete,jsonp
					url: '/location/',
					data: $scope.location
				}, function(data){
					$scope.locations[$scope.location.location_ID] = $scope.location;
					$rootScope.alerts = [{'class':'success', 'label':'Location:', 'message':'Saved'}];
				});
			/*$http.put('/location/', $scope.location)
				.success(function(data) {
					console.log('updateLocation.put.success');
					console.log(data);
					$scope.errors= (data.errors) ? data.errors : {};
					$rootScope.alerts= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.locations[$scope.location.location_ID] = $scope.location;
						$rootScope.alerts = [{'class':'success', 'label':'Location:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateLocation.put.error');
					$rootScope.http_error();
				});*/
		} else {	// create
			$rest.http({
					method:'post', // get,head,post,put,delete,jsonp
					url: '/location/',
					data: $scope.location
				}, function(data){
					$scope.location.location_ID = data;
					$scope.locations[$scope.location.location_ID] = $scope.location;
					$rootScope.alerts = [{'class':'success', 'label':'Location:', 'message':'Saved'}];
				});
			/*$http.post('/location/', $scope.location)
				.success(function(data) {
					console.log('updateLocation.post.success');
					console.log(data);
					$scope.errors= (data.errors) ? data.errors : {};
					$rootScope.alerts= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.location.location_ID = data;
						$scope.locations[$scope.location.location_ID] = $scope.location;
						$rootScope.alerts = [{'class':'success', 'label':'Location:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateLocation.post.error');
					$rootScope.http_error();
				});*/
		}
	};
	$scope.deleteLocation = function(id) {
		console.log('deleteLocation(', id, ')');
		$rest.http({
				method:'delete', // get,head,post,put,delete,jsonp
				url: '/location/'+id
			}, function(data){
				delete $scope.locations[id];
			});
		/*$http(http_config)
			.success(function(data) {
				console.log('deleteLocation.delete.success');
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					delete $scope.locations[id];
				}
			})
			.error(function() {
				console.log('deleteLocation.delete.error');
				$rootScope.http_error();
			});*/
	};
	//-- Users --//
	$scope.loadUsers = function() {
		$rest.http({
				method:'get', // get,head,post,put,delete,jsonp
				url: '/company/user/'
			}, function(data){
				$scope.users = data;
			});
		/*$http.get('/company/user/').success(function(data) {
				console.log(data);
				$scope.errors.user	= (data.errors) ? data.errors : {};
				$rootScope.alerts= (data.alerts) ? data.alerts : [];
				if (!data.alerts && !data.errors) {
					$scope.users = data;
				}
			})
			.error(function() {
				$rootScope.http_error();
			});*/
	};
	$scope.editUser = function(user) {
		console.log('editUser(user)');
		console.log(user);
		if (!user) {
			user = {
				'user_level':0			};
		}
		user.user_level = user.user_level.toString(); // for select option
		$scope.user = user;
	};
	$scope.updateUser = function() {
		console.log('updateLocation');
		$rootScope.alerts = [];
		if ($scope.user.user_ID) {	// update
			$rest.http({
					method:'put', // get,head,post,put,delete,jsonp
					url: '/company/user/',
					data: $scope.user
				}, function(data){
					$scope.users[$scope.user.user_ID] = $scope.user;
					$rootScope.alerts = [{'class':'success', 'label':'User:', 'message':'Saved'}];
				});
			/*$http.put('/company/user/', $scope.user)
				.success(function(data) {
					console.log('updateUser.put.success');
					console.log(data);
					$scope.errors= (data.errors) ? data.errors : {};
					$rootScope.alerts= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.users[$scope.user.user_ID] = $scope.user;
						$rootScope.alerts = [{'class':'success', 'label':'User:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateUser.put.error');
					$rootScope.http_error();
				});*/
		} else {	// create
			$rest.http({
					method:'post', // get,head,post,put,delete,jsonp
					url: '/company/user/',
					data: $scope.user
				}, function(data){
					$scope.user.user_ID = data;
					$scope.users[$scope.user.user_ID] = $scope.user;
					$rootScope.alerts = [{'class':'success', 'label':'User:', 'message':'Saved'}];
				});
			/*$http.post('/company/user/', $scope.user)
				.success(function(data) {
					console.log('updateUser.post.success');
					console.log(data);
					$scope.errors= (data.errors) ? data.errors : {};
					$rootScope.alerts= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.user.user_ID = data;
						$scope.users[$scope.user.user_ID] = $scope.user;
						$rootScope.alerts = [{'class':'success', 'label':'User:', 'message':'Saved'}];
					}
				})
				.error(function() {
					console.log('updateUser.post.error');
					$rootScope.http_error();
				});*/
		}
	};

	$session.require_signin(function(){
		console.log('CompanyCtrl require_signin');
		console.log($session.company);
		if ($routeParams.profile_name) {
			$scope.loadCompanyName($routeParams.profile_name);
		} else if ($routeParams.profile_ID) {
			//$routeParams.profile_ID || ($routeParams.profile_ID = 0);
			//$scope.company.company_ID = $routeParams.profile_ID;
			$scope.loadCompany($routeParams.profile_ID);
		} else {
			$scope.company = $session.company;
			$scope.loadCompany();
		}
		// load on settings page
		if ($routeParams.page) {
			$scope.loadUsers();
			$scope.loadLocations();
		}
	});
}
CompanyCtrl.$inject = ['$rootScope', '$scope', '$rest', '$routeParams', '$session'];
//}]);
