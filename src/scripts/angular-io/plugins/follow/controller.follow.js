angular.module('io.controller.follow', [])
.controller('FollowCtrl', ['$scope', '$http', function($scope, $http) {
	//$scope = $scope;
	console.log('FollowCtrl ('+$scope.$id+')');
	
	// Extends $scope.follow;
	
	$scope.type = $scope.follow.type;
	
	$scope.follow_suggest = {};

	//$scope.group_name = '';	// form
	$scope.setFollowType = function(type) { $scope.type = type; };
	
	$scope.addFollow = function(id, group_ID) {
		$scope.follow.addFollow($scope.type, id, group_ID);
	};

	$scope.deleteFollow = function(id, group_ID) {
		$scope.follow.deleteFollow($scope.type, id, group_ID);
	};

	$scope.loadFollow = function(id) {
		$scope.follow.loadFollow($scope.type, id);
	};
	
	$scope.loadFollowers = function(id, query) {
		$scope.follow.loadFollow($scope.type, id, query);
	};

	$scope.loadFollowing = function(id, query) {
		$scope.follow.loadFollowing($scope.type, id, query);
	};
	
	$scope.loadSuggestions = function(id) {
		console.log('loadSuggestions('+id+')');
		id || (id = 0);
		var type = $scope.type;
		
		$http.get('/follow/suggestions/'+type+'/'+id)
			.success(function(data) {
				console.log('loadSuggestions.get.success');
				console.log(data);
				for (var i in data) {
					if (i) {
						data[i].following = (data[i].following) ? true : false;
						$scope.follow.db[type][i] = data[i];
					} else {
						delete data[i];
					}
				}

				if (objectLength(data)) $scope.follow_suggest = data;
				console.log($rootScope.objectLength($scope.follow_suggest));
			})
			.error(function() {
				console.log('loadSuggestions.get.error');
				$rootScope.http_error();
			});
	};

	
	
	// search following and followers
	$scope.search = function(query) {
		$scope.search_results = [];
		// follow = 'ing' or 'ers'
		
		$http.get('/follow/search/'+follow+'/'+query+'/'+type)
			.success(function(data) {
				data = data.toString();
				console.log(data);
				$scope.groups[data] = {
					group_name:$scope.group_name,
					group_ID:data,
					group_count:0,
					color:color
				};
				console.log($scope.groups);
				$scope.group_name = ""; // clear form
			});
		
		if (follow == 'ing') {
			
		} else if (follow == 'ers') {
			
		}
	};
	
	$scope.loadGroups = function() {
		$scope.follow.loadGroups();
	};
	
	$scope.addGroup = function() {
		console.log('addGroup()');
		var color = strToARGB($scope.group_name).substr(0,6);
		$http.post('/follow/group/', {'group_name':$scope.group_name, 'color':color})
			.success(function(data) {
				console.log('addGroup.post.success');
				console.log(data);
				$scope.follow.db.groups[data.toString()] = {
					group_name:$scope.group_name,
					group_ID:data,
					group_count:0,
					color:color
				};
				console.log($scope.follow.db.groups);
				$scope.group_name = ""; // clear form
			})
			.error(function() {
				console.log('addGroup.post.error');
				$rootScope.http_error();
			});
	};

	$scope.removeGroup = function(group_ID) {
		console.log('removeGroup('+group_ID+')');
		$http({'method':'DELETE', 'url':'/follow/group/'+group_ID})
			.success(function(data) {
				console.log('removeGroup.delete.success');
				console.log(data);
				delete $scope.follow.db.groups[group_ID];
				for (var id in $scope.follow.db[$scope.type]) {
					if ($scope.follow.db[$scope.type][id].groups) {
						var index = $scope.follow.db[$scope.type][id].groups.indexOf(group_ID);
						if (index != -1) delete $scope.follow[$scope.type][id].groups.splice(index,1);
					}
				}
			})
			.error(function() {
				console.log('removeGroup.delete.error');
				$rootScope.http_error();
			});
	};
	
	
	$scope.require_signin(function(){
		$scope.loadGroups();
	});
}]);