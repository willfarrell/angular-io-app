//(function (angular) {
angular.module('io.factory.filepicker', [])
.factory('$filepicker', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FilepickerFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.2.0';
	$scope.alerts = [];
	
	$scope.services = {
		'':{
			'name':'Filepicker',
			'icon':'upload-alt'
		},
		'DOWNLOAD':{
			'name':'Download',
			'icon':'cloud-download'
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
	
	// defaults
	$scope.args_upload = {
		type:'UPLOAD',
		action:'',
		types: ['*/*'],	// image/*
		extensions: [],	// ['.png','.jpg']
		services: ['COMPUTER'],
		service: 'COMPUTER',
		multi:true,
		ID:''		// params passed to backend, ie object_ID
	};
	
	$scope.args_download = {
		type:'DOWNLOAD',
		action:'',
		files:{},
		services: ['COMPUTER'],
		service: 'COMPUTER',
		ID:''		// params passed to backend, ie object_ID
	};

	$scope.args = {};
	$scope.accept = '';
	$scope.timestamp = +new Date();
	$scope.dropzone_name = 'files';
	
	$scope.loadFiles = function() {
		if (!$scope.args.multi) return;
		// get files json
		$http.get($rootScope.settings.server+'/filepicker/list/'+$scope.args.action+'/'+$scope.args.ID)
			.success(function(data) {
				$scope.args.files = data;
			})
			.error(function() {
				
			});
	};
	
	$scope.upload = function(args, ID) {
		ID || (ID = '');
		console.log(args);
		console.log(ID);
		$scope.alerts = [];
		
		$scope.args = syncVar(args, $scope.args_upload);
		$scope.args.ID = ID;
		
		$scope.loadFiles();
		
		// input accept tag
		$scope.accept = $scope.args.extensions.length ? $scope.args.extensions.join(',') : $scope.args.types.join(',');
		
		$scope.setDropzoneName(true);
		$('#filepickerModal').modal('show');
	};
	
	$scope.view = function(args, ID) {
		ID || (ID = '');
		console.log(ID);
		$scope.alerts = [];
		
		$scope.args = syncVar(args, $scope.args_download);
		$scope.args.ID = ID;
		
		$scope.loadFiles();
		
	};
	
	$scope.download = function(args, ID) {
		ID || (ID = '');
		console.log(ID);
		$scope.alerts = [];
		
		$scope.args = syncVar(args, $scope.args_download);
		$scope.args.ID = ID;
		
		$scope.loadFiles();
		
		$('#filepickerModal').modal('show');
	};
	
	$scope.downloadFile = function(file) {
		$http.post($rootScope.settings.server+'/filepicker/download/'+$scope.args.action+'/'+$scope.args.ID, {"file":file})
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $scope.alerts = data.alerts;
				
				if (!data.errors && !data.alerts) {
					$rootScope.alerts = [{"class":"success", "label":"File deleted"}];
				}
			})
			.error(function() {
				
			});
	}
	
	
	$scope.confirmDelete = function(file, callback) {
		console.log('filepicker.confirmDelete()');
		$rootScope.modal = {
			hide:{
				header:false,
				close:false,
				footer:false
			},
			header:"Confirm File Delete",
			content:"Are you sure you want to delete '"+file+"'?",
			buttons:[
				{
					"class":"btn-primary",
					value:"Delete",
					callback:function(){
						callback(file);
					}
				},
				{
					"class":"",
					value:"Cancel",
					callback:function(){}
				}
			]
		};
		$('#alertModal').modal('show');
	};
	
	$scope.delete = function(file) {
		$http.delete($rootScope.settings.server+'/filepicker/'+$scope.args.action+'/'+$scope.args.ID+'/'+encodeURIComponent(file))
			.success(function(data) {
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $scope.alerts = data.alerts;
				
				if (!data.errors && !data.alerts) {
					$rootScope.alerts = [{"class":"success", "label":"File deleted"}];
					$scope.view($scope.args, $scope.args.ID); // reload list
				}
			})
			.error(function() {
				
			});
	}

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