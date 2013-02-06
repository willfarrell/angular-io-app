//(function (angular) {
angular.module('io.factory.filepicker', [])
.factory('$filepicker', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FilepickerFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.1.0';
	$scope.alerts = [];
	
	$scope.services = {
		'':{
			'name':'Filepicker',
			'icon':'upload-alt'
		},
		'RESIZECROP':{
			'name':'Resize & Crop Image',
			'icon':'fullscreen'
		},
		'COMPUTER':{
			'name':'My Computer',
			'icon':'home'
		},
		'URL':{
			'name':'Link (URL)',
			'icon':'link'
		},
		'FTP':{
			'name':'FTP',
			'icon':'hdd'
		},
		'WEBDAV':{
			'name':'WebDAV',
			'icon':'hdd'
		},
		'DROPBOX':{
			'name':'Dropbox',
			'icon':'dropbox',
			'url':'https://dropbox.com/'
		}
	};
	
	$scope.args_default = {
		action:'',
		types: ['*/*'],	// image/*
		extensions: [],	// ['.png','.jpg']
		services: ['COMPUTER'],
		service: 'COMPUTER',
		multi:true
	};

	$scope.img_default = {
		action:'',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER'],
		service: 'COMPUTER',
		multi:false,
		resizecrop:true,
		width:200,
		height:200
	};

	$scope.profile_user = {
		action:'profile_user',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER'],
		service: 'COMPUTER',
		multi:false,
		resizecrop:true,
		width:200,
		height:200
	};

	$scope.profile_company = {
		action:'profile_company',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER'],
		service: 'COMPUTER',
		multi:false,
		resizecrop:true,
		width:300,
		height:200
	};

	$scope.args = {};
	$scope.accept = '';
	$scope.timestamp = +new Date();
	$scope.dropzone_name = 'files';

	$scope.open = function(args) {
		console.log(args);
		$scope.alerts = [];
		
		$scope.args = syncVar(args, $scope.args);

		// input accept tag
		$scope.accept = $scope.args.extensions.length ? $scope.args.extensions.join(',') : $scope.args.types.join(',');
		
		$scope.setDropzoneName(true);
		$('#filepickerModal').modal('show');
	};

	$scope.close = function() {
		this.timestamp = +new Date(); // used to force image to be reloaded
	};
	
	$scope.location = function(service) {
		$scope.args.service = service;
	}
	
	$scope.setDropzoneName = function(ok) {
		/*if ($scope.args.cropresize) {
        	$scope.dropzone_name = ok ? 'image' : '!image';
    	} else {
        	$scope.dropzone_name = ok ? 'file' : '!file';
    	}*/
    	if ($scope.args.cropresize) {
        	$scope.dropzone_name = 'image';
    	} else {
        	$scope.dropzone_name = 'file';
    	}
	}
	
	
	return $scope;
}]);

/*
	0ct 2012

	Alfresco		// redirect
	BOX				// redirect
	+COMPUTER
	DROPBOX			// redirect
	EVERNOTE		// redirect
	FACEBOOK		// redirect
	FLICKR			// redirect
	+FTP				// !image/*
	GITHUB			// redirect
	GOOGLE_DRIVE	// redirect
	PICASA			// redirect
	+WEBDAV			// !image/*

	Pick only:
	GMAIL			// redirect
	+IMAGE_SEARCH
	INSTAGRAM		// redirect
	+URL
	VIDEO			// Adobe Flash
	WEBCAM			// Adobe Flash

	Export only:
	SEND_EMAIL

	QQQQ
	- connect directly to S3?

	*/
//})(angular);