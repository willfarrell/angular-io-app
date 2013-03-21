//(function (angular) {
angular.module('io.factory.filepicker', [])
.factory('$filepicker', ['$rootScope', '$http', function($rootScope, $http) {
	console.log('FilepickerFactory ('+$rootScope.$id+')');
	
	var $scope = {};
	$scope.version = '0.2.0';
	$scope.alerts = [];
	
	if (!$rootScope.settings.filepicker) {
	 	$rootScope.loadJSON(null, 'config.filepicker', 'json', function(data){
		 	$rootScope.settings.filepicker = data;
	 	});
 	}
 	
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
		'CAMERA':{
			'name':'Take Picture',
			'icon':'camera-retro'
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
		services: ['COMPUTER'], //, 'URL'
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
console.log($scope.args);		
		$scope.cameraModernizr(); // incase camera is default
		$scope.location($scope.args.service);
		$scope.loadFiles();
		
		// input accept tag
		$scope.accept = $scope.args.extensions.length ? $scope.args.extensions.join(',') : $scope.args.types.join(',');
		
		$scope.setDropzoneName();
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
	
	$scope.deleteFile = function(file) {
		var http_config = {
	        'method':'delete', // get,head,post,put,delete,jsonp
	        'url':$rootScope.settings.server+'/filepicker/'+$scope.args.action+'/'+$scope.args.ID+'/'+encodeURIComponent(file)
	    };
		$http(http_config)
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
	};

	$scope.close = function() {
		this.timestamp = +new Date(); // used to force image to be reloaded
	};
	
	$scope.location = function(service) {
		if (service == 'CAMERA') {
			$scope.cameraInit();
		}
		
		$scope.args.service = service;
	};
	
	$scope.setDropzoneName = function() {
		/*if ($scope.args.cropresize) {
        	$scope.dropzone_name = ok ? 'image' : '!image';
    	} else {
        	$scope.dropzone_name = ok ? 'file' : '!file';
    	}*/
    	if ($scope.args.resizecrop) {
        	$scope.dropzone_name = 'image';
    	} else {
        	$scope.dropzone_name = 'file';
    	}
	};
	
	//-- Camera --//
	$scope.camera = {};
	$scope.cameraModernizr = function() {
		console.log('cameraModernizr');
		// check if able - if not disable
		var hasUserMedia = function() {
		    if (!navigator.getUserMedia) {
		        navigator.getUserMedia = navigator.webkitGetUserMedia ||
		            navigator.mozGetUserMedia || navigator.msGetUserMedia;
		    }
		    if (!window.URL) {
		        window.URL = window.webkitURL || window.mozURL;
		    }
		    return !!(navigator.getUserMedia);
		}
		
		if (!hasUserMedia()) {
			console.log('!hasUserMedia');
			$scope.cameraRemove();
		}
	};
	$scope.cameraRemove = function() {
		// remove from list of services
	    $scope.args.services.splice($scope.args.services.indexOf('CAMERA'), 1);
	    // reset current service if camera
	    if ($scope.args.service === 'CAMERA') {
		    $scope.args.service = $scope.args.services[0];
	    }
	};
	$scope.cameraInit = function() {
		if (!navigator.getUserMedia) {
		        navigator.getUserMedia = navigator.webkitGetUserMedia ||
		            navigator.mozGetUserMedia || navigator.msGetUserMedia;
		    }
		    if (!window.URL) {
		        window.URL = window.webkitURL || window.mozURL;
		    }
		    
		// load in
		var dom = document.getElementById("camera");
		$scope.camera.video = dom.querySelector('video');
		$scope.camera.canvas = dom.querySelector('canvas');
		$scope.camera.canvas.width = $scope.args.width * 2;
	    $scope.camera.canvas.height = $scope.args.height * 2;
		$scope.camera.ctx = $scope.camera.canvas.getContext('2d');
		//$scope.camera.img = dom.querySelector('img');
		//$scope.camera.link = document.createElement('a');
	
	    var failure = function(e) {
	        console.log("camera Fail", e);
	        $scope.cameraRemove();
	    };
	
	    var success = function(stream) {
	    	
	        if (/Chrome/.test(navigator.userAgent)) {
	          	$scope.camera.video.src = window.URL.createObjectURL(stream);
	        } else {
	          	$scope.camera.video.src = stream;
	        }
	        $scope.camera.stream = stream;	// for stopping
	        
	        $scope.camera.video.width = $scope.camera.canvas.width;
	    	$scope.camera.video.height = $scope.camera.canvas.height;
	    	
	        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
	        // See crbug.com/110938.
	        $scope.camera.video.onloadedmetadata = function(e) {
	            console.log("metadata loaded");
	        }
	    }
	
	    navigator.getUserMedia({video:true}, success, failure);
	
	    /*$scope.camera.video.addEventListener('click', function() {
	        //var width = this.videoWidth;
	        //var height = this.videoHeight;
	        //canvas.width = width;
	        //canvas.height = height;
	        
	        // draw webcam picture in canvas
	        $scope.camera.ctx.drawImage(video, 0, 0);
	        // create data URL and insert into <img/>
	        $scope.camera.img.src = $scope.camera.canvas.toDataURL('image/png');
	        // download picture when clicking on it
	        $scope.camera.img.onclick = function() {
	            // set filename for downloading picture
	            // https://developer.mozilla.org/en-US/docs/HTML/Element/a#attr-download
	           // $scope.camera.link.setAttribute('download', 'webcam-'+location.hostname+'-'+Date.now()+'.png');
	            //$scope.camera.link.href = $scope.camera.canvas.toDataURL('image/png');
	            //$scope.camera.link.click();
	        };
	        
	        $scope.camera.img.data = $scope.camera.canvas.toDataURL($scope.camera.img.type);
	        
	    }, false);*/
	};
	// doesn't work
	$scope.cameraStop = function() {
		$scope.camera.video.pause();
		$scope.camera.stream.stop();
		
		// For Opera 12
		$scope.camera.video.src=null;
		
		//For Firefox Nightly 18.0
		$scope.camera.video.mozSrcObject=null;
		
		//For Chrome 22
		$scope.camera.video.src="";
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
