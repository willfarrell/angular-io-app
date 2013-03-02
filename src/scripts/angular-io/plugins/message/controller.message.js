//angular.module('app.controller.message', [])
//.controller('AppCtrl',
//['$rootScope', '$scope', '$http', '$follow', '$filepicker',
//function(rootScope, $scope, $http, follow, filepicker) {
MessageCtrl.$inject = ['$scope', '$http', '$routeParams'];
function MessageCtrl($scope, $http, $routeParams) {
	console.log('MessageCtrl ('+$scope.$id+')');

	$scope.to_name = "";
	$scope.compose = {};
	
	$scope.list = [];	// inbox
	$scope.thread = [];	// messages in conversation
	
	// inbox
	$scope.loadMessages = function() {
		console.log('loadMessages()');
		$http.get($rootScope.settings.server+'/message/list')
			.success(function(data) {
				console.log('loadMessages.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				
				$scope.list = data;
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
		
		$rootScope.message.compose = {
			user_ID:user_ID
		};
		$rootScope.message.to_name = to_name;
		
		$http.get($rootScope.settings.server+'/message/'+user_ID)
			.success(function(data) {
				console.log('loadThread.get.success');
				console.log(data);
				//$scope.dbing[id].name = data.name;
				$rootScope.message.to_name = data.user.user_name_first+' '+data.user.user_name_last;
				
				$scope.thread = data.thread;
				
				setTimeout(function() {
					$scope.scrollBottom();
				}, 100);
				
				// update unread count
				$rootScope.message.updateUnreadCount();
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
			timestamp:(+new Date)/1000
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
	
	$scope.loadMessages();
	if ($routeParams.user_ID) {
		$scope.loadThread($routeParams.user_ID);
	}
}
