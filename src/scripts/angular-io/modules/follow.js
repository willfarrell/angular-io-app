/*global objectLength:true, strToARGB:true */

//(function (angular) {
angular.module('io.modules')
.factory('$follow', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FollowFactory ('+$rootScope.$id+')');
	var $scope = {};
	$scope.version = '0.2.0';
	// init root follow obj - list of all profiles viewed
	$scope.init = function(company_ID, user_ID, following) {
		//console.log('init('+company_ID+','+user_ID+')');
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		following = following || false;
		$scope.db = $scope.db || {};
		$scope.db.groups = $scope.db.groups|| {};
		$scope.db.company = $scope.db.company || {};
		$scope.db.user = $scope.db.user || {};
		if (company_ID) {
			$scope.db.company[company_ID] = $scope.db.company[company_ID] || {};
			$scope.db.company[company_ID].company_ID = company_ID;
			$scope.db.company[company_ID].following = following;
			$scope.db.company[company_ID].groups = $scope.db.company[company_ID].groups || [];
		}
		if (user_ID) {
			$scope.db.user[user_ID] = $scope.db.user[user_ID]|| {};
			$scope.db.user[user_ID].user_ID = user_ID;
			$scope.db.user[user_ID].following = following;
			$scope.db.user[user_ID].groups = $scope.db.user[user_ID].groups || [];
		}
	};
	$scope.addFollow = function(company_ID, user_ID, group_ID) {
		console.log('addFollow('+company_ID+', '+user_ID+', '+group_ID+')');
		if (!company_ID && !user_ID) { return; }
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		group_ID = group_ID || 0;
		$scope.init(company_ID, user_ID, true);
		if (group_ID) {
			if (company_ID) { $scope.db.company[company_ID].groups.push(group_ID); }
			else if (user_ID) { $scope.db.user[user_ID].groups.push(group_ID); }
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
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		group_ID = group_ID || 0;
		//$scope.init(type, id);
		if (group_ID) {
			var index;
			if (user_ID) {
				index = $scope.db.user[user_ID].groups.indexOf(group_ID);
				if (index !== -1) { $scope.db.user[user_ID].groups.splice(index,1); }
				$scope.db.groups[group_ID.toString()].group_count--;
			} else if (company_ID) {
				index = $scope.db.company[company_ID].groups.indexOf(group_ID);
				if (index !== -1) { $scope.db.company[company_ID].groups.splice(index,1); }
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
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		$http.get($rootScope.settings.server+'/follow/'+company_ID+'/'+user_ID)
			.success(function(data) {
				console.log('loadFollow.get.success');
				console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.db.company[data.company_ID] = data;
					$scope.db.user[data.user_ID] = data;
					$scope.f = data;
				}
			})
			.error(function() {
				console.log('loadFollow.put.error');
				$rootScope.http_error();
			});
	};
	$scope.loadFollowType = function(type, company_ID, user_ID, query) {
		var api = 'friends';
		if (type === 'followers') {
			api = 'ers';
		} else if (type === 'following') {
			api = 'ing';
		}
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/'+api+'/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowers.get.success');
				console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							if (data[i]['company_ID']) { $scope.db.company[data[i]['company_ID']] = data[i]; }
							else if (data[i]['user_ID']) { $scope.db.user[data[i]['user_ID']] = data[i]; }
						}
					}
				}
			})
			.error(function() {
				console.log('loadFollowers.get.error');
				$rootScope.http_error();
			});
	};
	$scope.loadFollowers = function(company_ID, user_ID, query) {
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/ers/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowers.get.success');
				console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							data[i].following = (data[i].following) ? true : false;
							data[i].follower = true;
							if (data[i]['company_ID']) { $scope.db.company[data[i]['company_ID']] = data[i]; }
							else if (data[i]['user_ID']) { $scope.db.user[data[i]['user_ID']] = data[i]; }
						}
					}
				}
			})
			.error(function() {
				console.log('loadFollowers.get.error');
				$rootScope.http_error();
			});
	};

	$scope.loadFollowing = function(company_ID, user_ID, query) {
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/ing/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowing.get.success');
				console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					console.log(typeof data);
					for (var i = 0, l = data.length; i < l; i++) {
						data[i].following = (data[i].following) ? true : false;
						if (data[i]['company_ID']) { $scope.db.company[data[i]['company_ID']] = data[i]; }
						else if (data[i]['user_ID']) { $scope.db.user[data[i]['user_ID']] = data[i]; }
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
		$http.get($rootScope.settings.server+'/follow/group/')
			.success(function(data) {
				console.log('loadGroups.get.success');
				console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							$scope.db.groups[i] = data[i];
						}
					}
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
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.db.groups[data.toString()] = {
						group_name:group_name,
						group_ID:data,
						group_count:0,
						color:color
					};
					console.log($scope.db.groups);
					$scope.group_name = ''; // clear form
				}
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
				var id,index;
				if ($rootScope.checkHTTPReturn(data)) {
					delete $scope.db.groups[group_ID];
					for (id in $scope.db.company) {
						if ($scope.db.company[id].groups) {
							index = $scope.db.company[id].groups.indexOf(group_ID);
							if (index !== -1) { $scope.db.company[id].groups.splice(index,1); }
						}
					}
					for (id in $scope.db.user) {
						if ($scope.db.user[id].groups) {
							index = $scope.db.user[id].groups.indexOf(group_ID);
							if (index !== -1) { $scope.db.user[id].groups.splice(index,1); }
						}
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
		if (value) {
			$scope.loadGroups();
			$scope.init();
		}
	});
	return $scope;
}])


.controller('FollowCtrl', ['$scope', '$http', '$follow', function($scope, $http, $follow) {

//function FollowCtrl($scope, $http, $follow) {
	console.log('FollowCtrl ('+$scope.$id+')');
	// Extends $scope.follow;
	$scope.type = $scope.follow.type;
	$scope.follow_suggest = {};
	$scope.following = {};
	$scope.followers = {};
	//$scope.group_name = '';	// form
	//$scope.setFollowType = function(type) { $scope.type = type; };
	/*$scope.addFollow = function(id, group_ID) {
		$scope.follow.addFollow($scope.type, id, group_ID);
	};

	$scope.deleteFollow = function(id, group_ID) {
		$scope.follow.deleteFollow($scope.type, id, group_ID);
	};*/

	/*$scope.loadFollow = function(id) {
		$scope.follow.loadFollow($scope.type, id);
	};
	$scope.loadFollowers = function(id, query) {
		$scope.follow.loadFollow($scope.type, id, query);
	};*/
	$scope.loadFollowers = function(company_ID, user_ID, query) {
		//$scope.follow.loadFollowing($scope.type, id, query); // session user
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/ers/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowing.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					console.log(typeof data);
					for (var i = 0, l = data.length; i < l; i++) {
						data[i].follower = (data[i].follower) ? true : false;
					}
					$scope.followers = data; // for profile page
				}
			})
			.error(function() {
				console.log('loadFollowing.get.error');
				$rootScope.http_error();
			});
	};
	$scope.loadFollowing = function(company_ID, user_ID, query) {
		//$scope.follow.loadFollowing($scope.type, id, query); // session user
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/ing/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				console.log('loadFollowing.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					console.log(typeof data);
					for (var i = 0, l = data.length; i < l; i++) {
						data[i].following = (data[i].following) ? true : false;
					}
					$scope.following = data; // for profile page
				}
			})
			.error(function() {
				console.log('loadFollowing.get.error');
				$rootScope.http_error();
			});
	};
	$scope.loadSuggestions = function(ref_bool, query) {
		console.log('loadSuggestions()');
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/suggestions/'+(ref_bool ? true : false)+'/'+query)
			.success(function(data) {
				console.log('loadSuggestions.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i = 0, l = data.length; i < l; i++) {
						data[i].following = (data[i].following) ? true : false;
						$follow.init(data[i]['company_ID'], data[i]['user_ID']);
						if (data[i]['company_ID']) { $follow.db.company[data[i]['company_ID']] = data[i]; }
						else if (data[i]['user_ID']) { $follow.db.user[data[i]['user_ID']] = data[i]; }
					}
					if (objectLength(data)) { $scope.follow_suggest = data; }
					console.log($rootScope.objectLength($scope.follow_suggest));
				}
			})
			.error(function() {
				console.log('loadSuggestions.get.error');
				$rootScope.http_error();
			});
	};
	$scope.loadSearch = function(query) {
		console.log('loadSearch()');
		query = query || '';
		$http.get($rootScope.settings.server+'/follow/search/'+query)
			.success(function(data) {
				console.log('loadSearch.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i = 0, l = data.length; i < l; i++) {
						data[i].following = (data[i].following) ? true : false;
						$follow.init(data[i]['company_ID'], data[i]['user_ID']);
						if (data[i]['company_ID']) { $follow.db.company[data[i]['company_ID']] = data[i]; }
						else if (data[i]['user_ID']) { $follow.db.user[data[i]['user_ID']] = data[i]; }
					}
					if (objectLength(data)) { $scope.follow_suggest = data; }
					console.log($rootScope.objectLength($scope.follow_suggest));
				}
			})
			.error(function() {
				console.log('loadSearch.get.error');
				$rootScope.http_error();
			});
	};

	// search following and followers
	/*$scope.search = function(query) {
		$scope.search_results = [];
		// follow = 'ing' or 'ers'
		$http.get($rootScope.settings.server+'follow/search/'+follow+'/'+query+'/'+type)
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
	};*/
	$scope.loadGroups = function() {
		$scope.follow.loadGroups();
	};
	//$scope.require_signin(function(){
		$scope.loadGroups();
	//});
}]);

