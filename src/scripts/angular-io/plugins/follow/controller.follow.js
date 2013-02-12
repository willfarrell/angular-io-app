angular.module('io.controller.follow', [])
.controller('FollowCtrl', ['$scope', '$http', function($scope, $http) {
//FollowCtrl.$inject = ['$scope', '$http'];
//function FollowCtrl($scope, $http) {
	//$scope = $scope;
	console.log('FollowCtrl ('+$scope.$id+')');
	
	// Extends $scope.follow;
	
	$scope.type = $scope.follow.type;
	
	$scope.follow_suggest = {};
	$scope.following = {};
	
	//$scope.group_name = '';	// form
	//$scope.setFollowType = function(type) { $scope.type = type; };
	
	/*$scope.addFollow = function(id, group_ID) {
		$scope.follow.addFollow($scope.type, id, group_ID);
	};

	$scope.deleteFollow = function(id, group_ID) {
		$scope.follow.deleteFollow($scope.type, id, group_ID);
	};*/

	$scope.loadFollow = function(id) {
		$scope.follow.loadFollow($scope.type, id);
	};
	
	$scope.loadFollowers = function(id, query) {
		$scope.follow.loadFollow($scope.type, id, query);
	};

	$scope.loadFollowing = function(id, query) {
		//$scope.follow.loadFollowing($scope.type, id, query); // session user
		
		id || (id = 0);
		query || (query = '');
		$http.get($rootScope.settings.server+'follow/ing/'+id+'/'+query)
			.success(function(data) {
				console.log('loadFollowing.get.success');
				console.log(data);
				console.log(typeof data);
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].following = (data[i].following) ? true : false;
					$scope.follow.db.company[data[i]['company_ID']] = data[i];
					$scope.follow.db.user[data[i]['user_ID']] = data[i];
				}
				
				$scope.following = data; // for profile page
			})
			.error(function() {
				console.log('loadFollowing.get.error');
				$rootScope.http_error();
			});
	};
	
	$scope.loadSuggestions = function() {
		console.log('loadSuggestions()');
		
		$http.get($rootScope.settings.server+'follow/suggestions/'+true)
			.success(function(data) {
				console.log('loadSuggestions.get.success');
				console.log(data);
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].following = (data[i].following) ? true : false;
					if (data[i]['company_ID']) $scope.follow.db.company[data[i]['company_ID']] = data[i];
					else if (data[i]['user_ID']) $scope.follow.db.user[data[i]['user_ID']] = data[i];
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
	};
	
	$scope.loadGroups = function() {
		$scope.follow.loadGroups();
	};
	
	
	
	
	$scope.require_signin(function(){
		$scope.loadGroups();
	});
//}
}]);