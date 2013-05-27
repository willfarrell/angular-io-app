// version 0.1.0

angular.module('io.modules')
.factory('$message', ['$rootScope', '$rest', '$routeParams', function($rootScope, $rest, $routeParams) {
	console.log('MessageFactory (', $rootScope.$id, ')');
	var $scope = {};

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

		$rest.http({
				method:'get',
				url: $rest.server+'message/unread'
			}, function(data){
				$scope.unread = data;
			});

		/*$http.get('/message/unread')
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
			});*/
	};
	$scope.send = function() {
		console.log('send()');

		$rest.http({
				method:'post',
				url: $rest.server+'message',
				data: $scope.compose
			}, function(data){
				$scope.compose.message = '';
				$scope.alerts = [{'class':'success', 'label':'Message sent:', 'message':'Click to go to conversation.'}];
			});

		/*$http.post('/message', $scope.compose)
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
			});*/
	};
	$rootScope.$on('session', function(value) {
		if (value) { $scope.updateUnreadCount(); }
	});
	return $scope;
}])

.controller('MessageCtrl', ['$rootScope', '$scope', '$timeout', '$rest', '$routeParams', '$session', '$message', function($rootScope, $scope, $timeout, $rest, $routeParams, $session, $message) {
	console.log('MessageCtrl (', $scope.$id, ')');

	$scope.to_name = '';
	$scope.compose = {};
	$scope.list = [];	// inbox
	$scope.thread = [];	// messages in conversation
	// inbox
	$scope.loadMessages = function() {
		console.log('loadMessages()');

		$rest.http({
				method:'get',
				url: $rest.server+'message/list'
			}, function(data){
				$scope.list = data;
			});

		/*$http.get('/message/list')
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
			});*/
	};
	// conversation
	$scope.loadThread = function(user_ID, to_name) {
		console.log('loadThread(', user_ID, to_name, ')');
		user_ID = user_ID || 0;
		$rootScope.message.compose = {
			user_ID:user_ID
		};
		$rootScope.message.to_name = to_name;

		$rest.http({
				method:'get',
				url: $rest.server+'message/'+user_ID
			}, function(data){
				$rootScope.message.to_name = data.user.user_name_first+' '+data.user.user_name_last;
				$scope.thread = data.thread;
				$timeout(function() {
					$scope.scrollBottom();
				}, 0);
				// update unread count
				$message.updateUnreadCount();
			});
		/*$http.get('/message/'+user_ID)
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
			});*/
	};
	$scope.send = function() {
		$scope.thread.push({
			user_from_ID:$session.user.user_ID,
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
	$session.require_signin(function() {
		$scope.loadMessages();
		if ($routeParams.user_ID) {
			$scope.loadThread($routeParams.user_ID);
		}
	});
}]);
