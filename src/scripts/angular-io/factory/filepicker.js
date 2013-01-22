(function (angular) {
angular.module('io.factory.filepicker', [])
.factory('$filepicker', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FilepickerFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	
	$scope.args_default = {
		action:'',
		types: ['*/*'],	// image/*
		extensions: [],	// ['.png','.jpg']
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:true
	};

	$scope.img_default = {
		action:'',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:false
	};

	$scope.profile_user = {
		action:'profile_user',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:false
	};

	$scope.profile_company = {
		action:'profile_company',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:false
	};

	$scope.args = {};
	$scope.accept = '';
	$scope.timestamp = 0;

	$scope.open = function(args) {
		self = this;
		console.log(args);
		self.args = syncVar(args, objectClone(self.args_default));

		// input accept tag
		self.accept = self.args.extensions.length ? self.args.extensions.join(',') : self.args.types.join(',');
		
		$('#filepickerModal').modal('show');
	};

	$scope.close = function() {
		this.timestamp = +new Date(); // used to force image to be reloaded
	};
	
	return $scope;
}]);

})(angular);