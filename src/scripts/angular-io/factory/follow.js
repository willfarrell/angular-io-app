(function (angular) {
angular.module('io.factory.follow', [])
.factory('$follow', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FollowFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.2.0';
	
	// init root follow obj - list of all profiles viewed
	$scope.init = function(company_ID, user_ID, following) {
		console.log('init('+company_ID+','+user_ID+')');
		
		company_ID || (company_ID = 0);
		user_ID || (user_ID = 0);
		following || (following = false);
		
		$scope.db || ($scope.db = {});
		$scope.db.groups || ($scope.db.groups = {});
		$scope.db.company || ($scope.db.company = {});
		$scope.db.user || ($scope.db.user = {});
		
		if (company_ID) {
			$scope.db.company[company_ID] || ($scope.db.company[company_ID] = {});
			$scope.db.company[company_ID].company_ID = company_ID;
			$scope.db.company[company_ID].following = following;
			$scope.db.company[company_ID].groups || ($scope.db.company[company_ID].groups = []);
		} else if (user_ID) {
			$scope.db.user[user_ID] || ($scope.db.user[user_ID] = {});
			$scope.db.user[user_ID].user_ID = user_ID;
			$scope.db.user[user_ID].following = following;
			$scope.db.user[user_ID].groups || ($scope.db.user[user_ID].groups = []);
		}
	};
	$scope.init();
	
	$scope.addFollow = function(company_ID, user_ID, group_ID) {
		console.log('addFollow("'+company_ID+'", "'+user_ID+'", "'+group_ID+'")');
		if (!company_ID && !user_ID) return;
		
		company_ID || (company_ID = 0);
		user_ID || (user_ID = 0);
		group_ID || (group_ID = 0);
		
		$scope.init(company_ID, user_ID, true);
		
		if (group_ID) {
			if (company_ID) $scope.db.company[company_ID].groups.push(group_ID);
			else if (user_ID) $scope.db.user[user_ID].groups.push(group_ID);
		}
		
		//console.log($scope.db[type][id]);
		$http.put($rootScope.settings.server+'/follow/'+company_ID+'/'+user_ID+'/'+group_ID)
			.success(function(data) {
				console.log('addFollow.put.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
			})
			.error(function() {
				console.log('addFollow.put.error');
				$rootScope.http_error();
			});
	};

	$scope.deleteFollow = function(company_ID, user_ID, group_ID) {
		console.log($rootScope.settings.server+'deleteFollow('+company_ID+', '+user_ID+', '+group_ID+')');
		
		company_ID || (company_ID = 0);
		user_ID || (user_ID = 0);
		group_ID || (group_ID = 0);
		
		//$scope.init(type, id);
		
		if (group_ID) {
			if (user_ID) {
				var index = $scope.db.user[user_ID].groups.indexOf(group_ID);
				if (index != -1) delete $scope.db.user[user_ID].groups.splice(index,1);
				$scope.db.groups[group_ID.toString()].group_count--;
			} else if (company_ID) {
				var index = $scope.db.company[company_ID].groups.indexOf(group_ID);
				if (index != -1) delete $scope.db.company[company_ID].groups.splice(index,1);
				$scope.db.groups[group_ID.toString()].group_count--;
			}
			
		} else {
			if (user_ID) {
				$scope.db.user[user_ID].following = false;
				$scope.db.user[user_ID].groups = [];
			} else if (company_ID) {
				$scope.db.company[company_ID].following = false;
				$scope.db.company[company_ID].groups = [];
			}
			
			
		}
		
		$http({'method':'DELETE', 'url':$rootScope.settings.server+'/follow/'+company_ID+'/'+user_ID+'/'+group_ID})
			.success(function() {
				console.log('deleteFollow.put.success');
			})
			.error(function() {
				console.log('deleteFollow.put.error');
				$rootScope.http_error();
			});
	};

	// load follow details of a user - use on profile page
	$scope.loadFollow = function(company_ID, user_ID) {
		console.log('loadFollow('+company_ID+', '+user_ID+')');
		
		company_ID || (company_ID = 0);
		user_ID || (user_ID = 0);
		
		$http.get($rootScope.settings.server+'/follow/'+company_ID+'/'+user_ID)
			.success(function(data) {
				console.log('loadFollow.get.success');
				console.log(data);
				$scope.db.company[data.company_ID] = data;
				$scope.db.user[data.user_ID] = data;
				$scope.f = data;
			})
			.error(function() {
				console.log('loadFollow.put.error');
				$rootScope.http_error();
			});
	};
	
	$scope.loadFollowers = function(company_ID, user_ID, query) {
		
		company_ID || (company_ID = 0);
		user_ID || (user_ID = 0);
		query || (query = '');
		
		$http.get($rootScope.settings.server+'/follow/ers/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowers.get.success');
				console.log(data);
				for (var i in data) {
					if (i) {
						data[i].following = (data[i].following) ? true : false;
						data[i].follower = true;
						$scope.db[type][i] = data[i];
					} else {
						delete data[i];
					}
				}
			})
			.error(function() {
				console.log('loadFollowers.get.error');
				$rootScope.http_error();
			});
	};

	$scope.loadFollowing = function(company_ID, user_ID, query) {
		company_ID || (company_ID = 0);
		user_ID || (user_ID = 0);
		query || (query = '');
		
		$http.get($rootScope.settings.server+'/follow/ing/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowing.get.success');
				console.log(data);
				console.log(typeof data);
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].following = (data[i].following) ? true : false;
					if (data[i]['company_ID']) $scope.db.company[data[i]['company_ID']] = data[i];
					else if (data[i]['user_ID']) $scope.db.user[data[i]['user_ID']] = data[i];
				}
				
			})
			.error(function() {
				console.log('loadFollowing.get.error');
				$rootScope.http_error();
			});
	};
	
	$scope.loadGroups = function() {
		console.log('loadGroups()');
		$http.get($rootScope.settings.server+'/follow/group/')
			.success(function(data) {
				console.log('loadGroups.get.success');
				console.log(data);
				for (var i in data) {
					$scope.db.groups[i] = data[i];
				}
			})
			.error(function() {
				console.log('loadGroups.get.error');
				$rootScope.http_error();
			});
	};
	
	$scope.addGroup = function(group_name) {
		console.log('addGroup('+group_name+')');
		var color = strToARGB(group_name).substr(0,6);
		$http.post($rootScope.settings.server+'/follow/group/', {'group_name':group_name, 'color':color})
			.success(function(data) {
				console.log('addGroup.post.success');
				console.log(data);
				$scope.db.groups[data.toString()] = {
					group_name:group_name,
					group_ID:data,
					group_count:0,
					color:color
				};
				console.log($scope.db.groups);
				$scope.group_name = ""; // clear form
			})
			.error(function() {
				console.log('addGroup.post.error');
				$rootScope.http_error();
			});
	};

	$scope.removeGroup = function(group_ID) {
		console.log('removeGroup('+group_ID+')');
		$http({'method':'DELETE', 'url':$rootScope.settings.server+'/follow/group/'+group_ID})
			.success(function(data) {
				console.log('removeGroup.delete.success');
				console.log(data);
				delete $scope.db.groups[group_ID];
				for (var id in $scope.db.company) {
					if ($scope.db.company[id].groups) {
						var index = $scope.db.company[id].groups.indexOf(group_ID);
						if (index != -1) delete $scope.db.company[id].groups.splice(index,1);
					}
				}
				for (var id in $scope.db.user) {
					if ($scope.db.user[id].groups) {
						var index = $scope.db.user[id].groups.indexOf(group_ID);
						if (index != -1) delete $scope.db.user[id].groups.splice(index,1);
					}
				}
			})
			.error(function() {
				console.log('removeGroup.delete.error');
				$rootScope.http_error();
			});
	};
	
	// load on signin
	$rootScope.$watch('session.user_ID', function(value) {
      	if (value) $scope.loadGroups();
    });
	
	return $scope;
}]);

})(angular);