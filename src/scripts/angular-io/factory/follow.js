(function (angular) {
angular.module('io.factory.follow', [])
.factory('$follow', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FollowFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	
	$scope.type = $rootScope.settings.follow;
	$scope.type || ($scope.type = 'user');
	
	// init root follow obj - list of all profiles viewed
	$scope.init = function(type, id) {
		console.log('init("'+type+'", '+id+')');
		
		type || (type = 'user');
		
		$scope.db || ($scope.db = {});
		$scope.db.groups || ($scope.db.groups = {});
		$scope.db[type] || ($scope.db[type] = {});
		
		if (id) {
			$scope.db[type][id] || ($scope.db[type][id] = {});
			$scope.db[type][id].ID = id;
			$scope.db[type][id].groups || ($scope.db[type][id].groups = []);
		}
	};
	$scope.init($scope.type);
	
	$scope.addFollow = function(type, id, group_ID) {
		console.log('addFollow("'+type+'", "'+id+'", "'+group_ID+'")');
		if (!id) return;
		group_ID || (group_ID = 0);
		type || (type = $scope.type);
		
		$scope.init(type, id);
		$scope.db[type][id].following = true;
		
		if (group_ID) {
			$scope.db[type][id].groups.push(group_ID);
			//$scope.db.groups[group_ID.toString()].group_count++;
		}
		
		console.log($scope.db[type][id]);
		console.log({"follow_ID":id,"group_ID":group_ID});
		$http.put('/follow/'+type, {"follow_ID":id,"group_ID":group_ID})
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

	$scope.deleteFollow = function(type, id, group_ID) {
		console.log('deleteFollow('+type+', '+id+', '+group_ID+')');
		
		id || (id = 0);
		type || (type = $scope.type);
		group_ID || (group_ID = 0);
		
		$scope.init(type, id);
		
		if (group_ID) {
			var index = $scope.db[type][id].groups.indexOf(group_ID);
			if (index != -1) delete $scope.db[type][id].groups.splice(index,1);
			//$scope.db.groups[group_ID.toString()].group_count--;
			
			$http({'method':'DELETE', 'url':'/follow/'+type+'/'+id+'/'+group_ID})
				.success(function() {
					console.log('deleteFollow.put.success');
				})
				.error(function() {
					console.log('deleteFollow.put.error');
					$rootScope.http_error();
				});
		} else {
			$scope.db[type][id].following = false;
			$scope.db[type][id].groups = [];
			
			$http({'method':'DELETE', 'url':'/follow/'+type+'/'+id})
				.success(function() {
					console.log('deleteFollow.put.success');
				})
				.error(function() {
					console.log('deleteFollow.put.error');
					$rootScope.http_error();
				});
		}
	};

	// load follow details of a user - use on profile page
	$scope.loadFollow = function(type, id) {
		console.log('loadFollow('+type+', '+id+')');
		
		id || (id = 0);
		type || (type = $scope.type);
		//$scope.profile_ID = id;
		$http.get('/follow/'+type+'/'+id)
			.success(function(data) {
				console.log('loadFollow.get.success');
				console.log(data);
				$scope.db[type][data.ID] = data;
				$scope.f = data; // for profile button
			})
			.error(function() {
				console.log('loadFollow.put.error');
				$rootScope.http_error();
			});
	};
	
	$scope.loadFollowers = function(type, id, query) {
		type || (type = $scope.type);
		id || (id = 0);
		query || (query = '');
		$http.get('/follow/ers/'+id+'/'+query)
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

	$scope.loadFollowing = function(type, id, query) {
		type || (type = $scope.type);
		id || (id = 0);
		query || (query = '');
		$http.get('/follow/ing/'+id+'/'+query)
			.success(function(data) {
				console.log('loadFollowing.get.success');
				console.log(data);
				console.log(typeof data);
				for (var i in data) {
					if (i) {
						data[i].following = true;
						$scope.db[type][i] = data[i];
					} else {
						delete data[i];
					}
				}
			})
			.error(function() {
				console.log('loadFollowing.get.error');
				$rootScope.http_error();
			});
	};
	
	$scope.loadGroups = function() {
		console.log('loadGroups()');
		$http.get('/follow/group/')
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
	
	// load on signin
	$rootScope.$watch('session.user_ID', function(value) {
      	if (value) $scope.loadGroups();
    });
	
	return $scope;
}]);

})(angular);