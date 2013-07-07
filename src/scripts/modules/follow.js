/*global  */

/*

To Do:
- revisit groups
- refactor factory & php api
- follow.list refactor to be more modular + smaller
*/


//(function (angular) {
angular.module('io.modules')
.factory('$follow', ['$rootScope', '$rest', function($rootScope, $rest) {
	//console.log('FollowFactory (', $rootScope.$id, ')');
	var $scope = {
		groups:{},
		user:{},
		company:{},
		last_call:{}	// last rest call return
	};

	// init root follow obj - list of all profiles viewed
	$scope.init = function(company_ID, user_ID, following) {
		//console.log('init('+company_ID+','+user_ID+')');
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		following = following || false;
		//follower = follower || false;
		//$scope.groups = $scope.groups || {};
		//$scope.company = $scope.company || {};
		//$scope.user = $scope.user || {};
		if (company_ID) {
			$scope.company[company_ID] = $scope.company[company_ID] || {};
			$scope.company[company_ID].company_ID = company_ID;
			$scope.company[company_ID].following = following;
			$scope.company[company_ID].groups = $scope.company[company_ID].groups || [];
		}
		if (user_ID) {
			$scope.user[user_ID] = $scope.user[user_ID]|| {};
			$scope.user[user_ID].user_ID = user_ID;
			$scope.user[user_ID].following = following;
			$scope.user[user_ID].groups = $scope.user[user_ID].groups || [];
		}
	};

	$scope.add = function(company_ID, user_ID, group_ID) {
		//console.log('add(', company_ID, user_ID, group_ID, ')');
		if (!company_ID && !user_ID) { return; }
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		group_ID = group_ID || 0;
		$scope.init(company_ID, user_ID, true);
		if (group_ID) {
			if (company_ID) { $scope.company[company_ID].groups.push(group_ID); }
			else if (user_ID) { $scope.user[user_ID].groups.push(group_ID); }
		}
		//console.log($scope[type][id]);

		$rest.http({
				method:'put',
				url: $rest.server+'follow/'+company_ID+'/'+user_ID+'/'+group_ID
			}, function() {
				$scope.f.following = true;
			});

		/*$http.put('/follow/'+company_ID+'/'+user_ID+'/'+group_ID)
			.success(function(data) {
				//console.log('addFollow.put.success');
				//console.log(data);
				//$scopeing[id].name = data.name;
			})
			.error(function() {
				//console.log('addFollow.put.error');
				$rootScope.http_error();
			});*/
	};

	$scope.remove = function(company_ID, user_ID, group_ID) {
		//console.log('remove(', company_ID, user_ID, group_ID, ')');
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		group_ID = group_ID || 0;
		//$scope.init(type, id);
		if (group_ID) {
			var index;
			if (user_ID) {
				index = $scope.user[user_ID].groups.indexOf(group_ID);
				if (index !== -1) { $scope.user[user_ID].groups.splice(index,1); }
				$scope.groups[group_ID.toString()].group_count--;
			} else if (company_ID) {
				index = $scope.company[company_ID].groups.indexOf(group_ID);
				if (index !== -1) { $scope.company[company_ID].groups.splice(index,1); }
				$scope.groups[group_ID.toString()].group_count--;
			}
		} else {
			if (user_ID) {
				$scope.user[user_ID].following = false;
				$scope.user[user_ID].groups = [];
			} else if (company_ID) {
				$scope.company[company_ID].following = false;
				$scope.company[company_ID].groups = [];
			}
		}

		$rest.http({
				method:'delete',
				url: $rest.server+'follow/'+company_ID+'/'+user_ID+'/'+group_ID
			});

		/*$http({'method':'DELETE', 'url':'/follow/'+company_ID+'/'+user_ID+'/'+group_ID})
			.success(function() {
				//console.log('deleteFollow.put.success');
			})
			.error(function() {
				//console.log('deleteFollow.put.error');
				$rootScope.http_error();
			});*/
	};

	// load follow details of a user - use on profile page
	$scope.loadFollow = function(company_ID, user_ID) {
		//console.log('loadFollow(', company_ID, user_ID, ')');
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;

		$rest.http({
				method:'get',
				url: $rest.server+'follow/'+company_ID+'/'+user_ID
			}, function(data) {
				//console.log(data);
				$scope.company[data.company_ID] = data;
				$scope.user[data.user_ID] = data;
				$scope.f = data;
				//console.log($scope.f);
			});

		/*$http.get('/follow/'+company_ID+'/'+user_ID)
			.success(function(data) {
				//console.log('loadFollow.get.success');
				//console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.company[data.company_ID] = data;
					$scope.user[data.user_ID] = data;
					$scope.f = data;
				}
			})
			.error(function() {
				//console.log('loadFollow.put.error');
				$rootScope.http_error();
			});*/
	};
	
	$scope.loadFollowType = function(api, company_ID, user_ID, query) {
		api = api || 'friends';
		//var api = 'friends';
		/*if (type === 'ers') {
			api = 'ers';
		} else if (type === 'ing') {
			api = 'ing';
		}*/
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';

		$rest.http({
				method:'get',
				url: $rest.server+'follow/'+api+'/'+company_ID+'/'+user_ID+'/'+query
			}, function(data) {
				//console.log(data);
				for (var i in data) {
					if (data.hasOwnProperty(i)) {
						if (data[i]['company_ID']) { $scope.company[data[i]['company_ID']] = data[i]; }
						if (data[i]['user_ID']) { $scope.user[data[i]['user_ID']] = data[i]; }
					}
				}
				$scope.last_call = data;
				//console.log($scope);
			});

		/*$http.get('/follow/'+api+'/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				//console.log('loadFollowers.get.success');
				//console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							if (data[i]['company_ID']) { $scope.company[data[i]['company_ID']] = data[i]; }
							else if (data[i]['user_ID']) { $scope.user[data[i]['user_ID']] = data[i]; }
						}
					}
				}
			})
			.error(function() {
				//console.log('loadFollowers.get.error');
				$rootScope.http_error();
			});*/
	};

	// DELETE
	$scope.loadFollowers = function(company_ID, user_ID, query) {
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';

		$rest.http({
				method:'get',
				url: $rest.server+'follow/ers/'+company_ID+'/'+user_ID+'/'+query
			}, function(data) {
				for (var i in data) {
					if (data.hasOwnProperty(i)) {
						data[i].following = (data[i].following) ? true : false;
						data[i].follower = true;
						if (data[i]['company_ID']) { $scope.company[data[i]['company_ID']] = data[i]; }
						else if (data[i]['user_ID']) { $scope.user[data[i]['user_ID']] = data[i]; }
					}
				}
				$scope.last_call = data;
			});

		/*$http.get('/follow/ers/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				//console.log('loadFollowers.get.success');
				//console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							data[i].following = (data[i].following) ? true : false;
							data[i].follower = true;
							if (data[i]['company_ID']) { $scope.company[data[i]['company_ID']] = data[i]; }
							else if (data[i]['user_ID']) { $scope.user[data[i]['user_ID']] = data[i]; }
						}
					}
				}
			})
			.error(function() {
				//console.log('loadFollowers.get.error');
				$rootScope.http_error();
			});*/
	};

	// DELETE
	$scope.loadFollowing = function(company_ID, user_ID, query) {
		company_ID = company_ID || 0;
		user_ID = user_ID || 0;
		query = query || '';

		$rest.http({
				method:'get',
				url: $rest.server+'follow/ing/'+company_ID+'/'+user_ID+'/'+query
			}, function(data) {
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].following = (data[i].following) ? true : false;
					if (data[i]['company_ID']) { $scope.company[data[i]['company_ID']] = data[i]; }
					else if (data[i]['user_ID']) { $scope.user[data[i]['user_ID']] = data[i]; }
				}
				$scope.last_call = data;
			});

		/*$http.get('/follow/ing/'+company_ID+'/'+user_ID+'/'+query)
			.success(function(data) {
				//console.log('loadFollowing.get.success');
				//console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					//console.log(typeof data);
					for (var i = 0, l = data.length; i < l; i++) {
						data[i].following = (data[i].following) ? true : false;
						if (data[i]['company_ID']) { $scope.company[data[i]['company_ID']] = data[i]; }
						else if (data[i]['user_ID']) { $scope.user[data[i]['user_ID']] = data[i]; }
					}
				}
			})
			.error(function() {
				//console.log('loadFollowing.get.error');
				$rootScope.http_error();
			});*/
	};
	$scope.loadGroups = function() {
		//console.log('loadGroups()');

		$rest.http({
				method:'get',
				url: $rest.server+'follow/group/'
			}, function(data) {
				for (var i in data) {
					if (data.hasOwnProperty(i)) {
						$scope.groups[i] = data[i];
					}
				}
			});

		/*$http.get('/follow/group/')
			.success(function(data) {
				//console.log('loadGroups.get.success');
				//console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							$scope.groups[i] = data[i];
						}
					}
				}
			})
			.error(function() {
				//console.log('loadGroups.get.error');
				$rootScope.http_error();
			});*/
	};
	$scope.addGroup = function(group_name, company_ID, user_ID) {
		//console.log('addGroup(', group_name, company_ID, user_ID, ')');

		$rest.http({
				method:'post',
				url: $rest.server+'follow/group/',
				data: {'group_name':group_name}
			}, function(data){
				$scope.groups[data.toString()] = {
					group_name:group_name,
					group_ID:data,
					group_count:0
				};
				if (company_ID || user_ID) {
					$scope.add(company_ID, user_ID, data);
				}
				//console.log($scope.groups);
				$scope.group_name = ''; // clear form
			});

		/*$http.post('/follow/group/', {'group_name':group_name, 'color':color})
			.success(function(data) {
				//console.log('addGroup.post.success');
				//console.log(data);
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.groups[data.toString()] = {
						group_name:group_name,
						group_ID:data,
						group_count:0,
						color:color
					};
					//console.log($scope.groups);
					$scope.group_name = ''; // clear form
				}
			})
			.error(function() {
				//console.log('addGroup.post.error');
				$rootScope.http_error();
			});*/
	};

	$scope.removeGroup = function(group_ID) {
		//console.log('removeGroup(', group_ID, ')');

		$rest.http({
				method:'delete',
				url: $rest.server+'follow/group/'+group_ID
			}, function(data){
				var index;
				delete $scope.groups[group_ID];
				for (var id in $scope.company) {
					if ($scope.company[id].groups) {
						index = $scope.company[id].groups.indexOf(group_ID);
						if (index !== -1) { $scope.company[id].groups.splice(index,1); }
					}
				}
				for (id in $scope.user) {
					if ($scope.user[id].groups) {
						index = $scope.user[id].groups.indexOf(group_ID);
						if (index !== -1) { $scope.user[id].groups.splice(index,1); }
					}
				}
			});

		/*$http({'method':'DELETE', 'url':'/follow/group/'+group_ID})
			.success(function(data) {
				//console.log('removeGroup.delete.success');
				//console.log(data);
				var id,index;
				if ($rootScope.checkHTTPReturn(data)) {
					delete $scope.groups[group_ID];
					for (id in $scope.company) {
						if ($scope.company[id].groups) {
							index = $scope.company[id].groups.indexOf(group_ID);
							if (index !== -1) { $scope.company[id].groups.splice(index,1); }
						}
					}
					for (id in $scope.user) {
						if ($scope.user[id].groups) {
							index = $scope.user[id].groups.indexOf(group_ID);
							if (index !== -1) { $scope.user[id].groups.splice(index,1); }
						}
					}
				}
			})
			.error(function() {
				//console.log('removeGroup.delete.error');
				$rootScope.http_error();
			});*/
	};
	// load on signin
	$rootScope.$on('session', function(value) {
		if (value) {
			$scope.loadGroups();
			$scope.init();
		}
	});
	return $scope;
}])

.directive('followButton', ['io.config', '$follow', function(config, $follow) {
	config = config.follow;

	return {
		restrict: 'EA',
		//replace: true,
		scope: {
			userId: '@',
			companyId: '@'
		},
		templateUrl: config.tpl['button'],
		//require: 'ngModel',
		//controller: $follow,
		link: function (scope, element, attrs, controller) {
			//console.log(scope);
			/*//console.log(element);
			//console.log(attrs);
			//console.log(controller);*/

			scope.type = config.type;
			scope.follow = $follow;
			scope.$watch('user', function(value) {
				$follow.loadFollow(scope.companyId, scope.userId);
			});
		}
	};
}])

.directive('followGroups', ['io.config', '$follow', function(config, $follow) {
	config = config.follow;

	return {
		restrict: 'EA',
		//replace: true,
		scope: {
			userId: '@',
			companyId: '@'
		},
		templateUrl: config.tpl['groups'],
		//require: 'ngModel',
		//controller: $follow,
		link: function (scope, element, attrs, controller) {

			scope.type = config.type;
			scope.follow = $follow;
			scope.$watch('user', function(value) {
				$follow.loadFollow(scope.companyId, scope.userId);
			});
		}
	};
}])

.directive('follow', ['io.config', '$rest', '$follow', function(config, $rest, $follow) {
	config = config.follow;

	return {
		restrict: 'EA',
		//replace: true,
		scope: {
			userId: '@',
			companyId: '@',
			query: '@',
			placeholder: '@' // for preventing placeholder value
		},
		templateUrl: config.tpl['list'],
		//require: 'ngModel',
		controller: function($scope, $rest) {
			$scope.follow = {};
			$scope.follow.user = {};
			$scope.follow.company = {};

			$scope.load = function(api, company_ID, user_ID, query) {
				//console.log('loadType(', api, company_ID, user_ID, query, ')');
				api = api || 'friends';
				//var api = 'friends';
				/*if (type === 'ers') {
					api = 'ers';
				} else if (type === 'ing') {
					api = 'ing';
				}*/
				company_ID = company_ID || 0;
				user_ID = user_ID || 0;
				query = query || '';

				$rest.http({
						method:'get',
						url: $rest.server+'follow/'+api+'/'+company_ID+'/'+user_ID+'/'+query
					}, function(data) {
						//console.log(data);
						for (var i in data) {
							if (data.hasOwnProperty(i)) {
								if (data[i]['company_ID']) { $scope.follow.company[data[i]['company_ID']] = data[i]; }
								if (data[i]['user_ID']) { $scope.follow.user[data[i]['user_ID']] = data[i]; }
							}
						}
						//console.log($scope);
					});
			};
			
			$scope.search = function(api, query) {
				//console.log('loadType(', api, query, ')');
				api = api || 'search';
				//var api = 'friends';
				/*if (type === 'ers') {
					api = 'ers';
				} else if (type === 'ing') {
					api = 'ing';
				}*/
				query = query || '';

				$rest.http({
						method:'get',
						url: $rest.server+'follow/'+api+'/'+query
					}, function(data) {
						//console.log(data);
						$scope.follow.user = {};
						$scope.follow.company = {};
						for (var i in data) {
							if (data.hasOwnProperty(i)) {
								if (data[i]['company_ID']) { $scope.follow.company[data[i]['company_ID']] = data[i]; }
								if (data[i]['user_ID']) { $scope.follow.user[data[i]['user_ID']] = data[i]; }
							}
						}
						//console.log($scope);
					});
			};
		},
		link: function (scope, element, attrs, controller) {

			scope.type = config.type;
			scope.$watch('user', function(value) {
				//console.log(value);
				scope.api = attrs.follow;
				if (scope.query === scope.placeholder) {
					scope.query = '';
				}
				if (attrs.follow === 'search' || attrs.follow === 'suggestions') {
					scope.search(attrs.follow, scope.query);
				} else {
					scope.load(attrs.follow, scope.companyId, scope.userId, scope.query);
				}
			});
			
			scope.$watch('query', function(value) {
				//console.log(value);
				scope.api = attrs.follow;
				if (scope.query === scope.placeholder) {
					scope.query = '';
				}
				if (attrs.follow === 'search' || attrs.follow === 'suggestions') {
					scope.search(attrs.follow, scope.query);
				} else {
					scope.load(attrs.follow, scope.companyId, scope.userId, scope.query);
				}
			});
		}
	};
}]);
