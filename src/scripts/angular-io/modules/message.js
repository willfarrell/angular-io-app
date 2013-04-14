
angular.module('io.modules')
.factory('$message', ['$rootScope', '$http', '$routeParams', function($rootScope, $http, $routeParams) {
	console.log('MessageFactory ('+$rootScope.$id+')');
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.unread = 0;
	$scope.init = function() {
		$scope.alerts = [];
		// modal params
		$scope.to_name = '';
		$scope.compose = {};
	};
	$scope.open = function(user_ID, to_name, message) {
		$scope.init();
		// reset compose
		$scope.compose = {
			user_ID:user_ID,
			message:message||''
		};
		$scope.to_name = to_name;
		//angular.element(document.querySelector('#messageModal')).modal('show');
	};
	$scope.close = function() {
		//angular.element(document.querySelector('#messageModal')).modal('hide');
	};
	$scope.updateUnreadCount = function() {
		console.log('updateUnreadCount()');
		$http.get($rootScope.settings.server+'/message/unread')
			.success(function(data) {
				console.log('updateUnreadCount.get.success');
				//$scope.dbing[id].name = data.name;
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.unread = data;
				}
			})
			.error(function() {
				console.log('updateUnreadCount.get.error');
				//$rootScope.http_error();
			});
	};
	$scope.send = function() {
		console.log('send()');
		$http.post($rootScope.settings.server+'/message', $scope.compose)
			.success(function(data) {
				console.log('send.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.compose.message = '';
					$scope.alerts = [{'class':'success', 'label':'Message sent:', 'message':'Click to go to conversation.'}];
				}
			})
			.error(function() {
				console.log('send.get.error');
				//$rootScope.http_error();
			});
	};
	$rootScope.$watch('session.user_ID', function(value) {
		if (value) { $scope.updateUnreadCount(); }
	});
	return $scope;
}])

.controller('MessageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	console.log('MessageCtrl ('+$scope.$id+')');

	$scope.to_name = '';
	$scope.compose = {};
	$scope.list = [];	// inbox
	$scope.thread = [];	// messages in conversation
	// inbox
	$scope.loadMessages = function() {
		console.log('loadMessages()');
		$http.get($rootScope.settings.server+'/message/list')
			.success(function(data) {
				console.log('loadMessages.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					//$scope.dbing[id].name = data.name;
					$scope.list = data;
				}
			})
			.error(function() {
				console.log('loadMessages.get.error');
				//$rootScope.http_error();
			});
	};
	// conversation
	$scope.loadThread = function(user_ID, to_name) {
		console.log('loadThread('+user_ID+')');
		user_ID = user_ID || 0;
		$rootScope.message.compose = {
			user_ID:user_ID
		};
		$rootScope.message.to_name = to_name;
		$http.get($rootScope.settings.server+'/message/'+user_ID)
			.success(function(data) {
				console.log('loadThread.get.success');
				//$scope.dbing[id].name = data.name;
				if ($rootScope.checkHTTPReturn(data)) {
					$rootScope.message.to_name = data.user.user_name_first+' '+data.user.user_name_last;
					$scope.thread = data.thread;
					setTimeout(function() {
						$scope.scrollBottom();
					}, 100);
					// update unread count
					$rootScope.message.updateUnreadCount();
				}
			})
			.error(function() {
				console.log('loadThread.get.error');
				//$rootScope.http_error();
			});
	};
	$scope.send = function() {
		$scope.thread.push({
			user_from_ID:$rootScope.session.user_ID,
			message:$rootScope.message.compose.message,
			timestamp:(+new Date())/1000
		});
		$rootScope.message.send();
		setTimeout(function() {
			$scope.scrollBottom();
		}, 100);
	};
	$scope.scrollBottom = function(){
		var t = document.getElementById('thread');
		t.scrollTop = t.scrollHeight;
	};
	$scope.require_signin(function() {
		$scope.loadMessages();
		if ($routeParams.user_ID) {
			$scope.loadThread($routeParams.user_ID);
		}
	});
}]);
