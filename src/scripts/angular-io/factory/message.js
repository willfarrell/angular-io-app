(function (angular) {
angular.module('io.factory.message', [])
.factory('$message', ['$rootScope', '$http', '$routeParams', function($rootScope, $http, $routeParams) {
	console.log('MessageFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.unread = 0;
	
	$scope.init = function() {
		$scope.alerts = [];
	
		// modal params
		$scope.to_name = "";
		$scope.compose = {};
		
		$scope.list = [];	// inbox
		$scope.thread = [];	// messages in conversation
	};
	
	$scope.open = function(user_ID, to_name) {
		$scope.init();
		
		// reset compose
		$scope.compose = {
			user_ID:user_ID
		};
		$scope.to_name = to_name;
		
		$('#messageModal').modal('show');
	};
	
	$scope.close = function() {
		$('#messageModal').modal('hide');
	};
	
	$scope.updateUnreadCount = function() {
		console.log('updateUnreadCount()');
		$http.get($rootScope.settings.server+'message/unread')
			.success(function(data) {
				console.log('updateUnreadCount.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				
				$scope.unread = data;
			})
			.error(function() {
				console.log('updateUnreadCount.get.error');
				//$rootScope.http_error();
			});
	};
	
	// inbox
	$scope.loadMessages = function() {
		$scope.init();
		console.log('loadMessages()');
		$http.get($rootScope.settings.server+'message/list')
			.success(function(data) {
				console.log('loadMessages.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				
				$scope.list = data;
				
				if ($routeParams.user_ID) {
					$scope.loadThread($routeParams.user_ID);
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
		user_ID || (user_ID = 0);
		
		$scope.compose = {
			user_ID:user_ID
		};
		$scope.to_name = to_name;
		
		$http.get($rootScope.settings.server+'message/'+user_ID)
			.success(function(data) {
				console.log('loadThread.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				$scope.to_name = data.user.user_name_first+' '+data.user.user_name_last;
				
				$scope.thread = data.thread;
				
				setTimeout(function() {
					$scope.scrollBottom();
				}, 100);
				
				// update unread count
				$scope.updateUnreadCount();
			})
			.error(function() {
				console.log('loadThread.get.error');
				//$rootScope.http_error();
			});
	};
	
	$scope.send = function() {
		console.log('send()');
		
		$http.post($rootScope.settings.server+'message', $scope.compose)
			.success(function(data) {
				console.log('send.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				
				
				$scope.thread.push({
					user_from_ID:$rootScope.session.user_ID,
					message:$scope.compose.message
				});
				$scope.compose.message = '';
				$scope.alerts = [{'class':'success', 'label':'Message sent:', 'message':'Click to go to conversation.'}];
			})
			.error(function() {
				console.log('send.get.error');
				//$rootScope.http_error();
			});
	};
	
	$scope.scrollBottom = function(){
		var t = document.getElementById('thread');
    	t.scrollTop = t.scrollHeight;
	};
	
	
	$rootScope.$watch('session.user_ID', function(value) {
      	if (value) $scope.updateUnreadCount();
    });
	
	return $scope;
}]);

})(angular);