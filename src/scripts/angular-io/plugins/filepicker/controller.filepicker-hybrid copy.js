//(function (filepicker) {
//	filepicker.setKey('AWMZaQ4koQ9ea1GTMTTX6z');
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
//})(filepicker);

FilepickerCtrl.$inject = ['$scope', '$route', '$http'];
function FilepickerCtrl($scope, $route, $http) {
	console.log('FilepickerCtrl ('+$scope.$id+')');
	$scope.alerts = [];
	$scope.errors = {};
	$scope.button = {};

	$scope.multi = false;
	
	$scope.maxheight = 200;
	$scope.maxwidth = 200;
	/*args_default = {
		action:'',
		types: ['* /*'],	// image/*
		extensions: [],	// ['.png','.jpg']
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:true
	};

	img_default = {
		action:'',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:true
	};

	profile_user = {
		action:'profile_user',
		types: ['image/*'],
		extensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png'],
		services: ['COMPUTER','URL'],
		service: 'COMPUTER',
		multi:false
	};

	profile_company = {
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
		console.log(args);
		$scope.args = syncVar($scope.args, objectClone($scope.args_default));

		// input accept tag
		$scope.accept = $scope.args.extensions.length ? $scope.args.extensions.join(',') : $scope.args.types.join(',');
	};

	$scope.close = function() {
		$scope.timestamp = +new Date(); // used to force image to be reloaded
	};*/
	
	
	$scope.services = {
		'':{
			'name':'Filepicker',
			'icon':'upload-alt'
		},
		'COMPUTER':{
			'name':'My Computer',
			'icon':'home'
		}/*,
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
		},
		'EVERNOTE':{
			'name':'Evernote',
			'icon':'evernote',
			'url':'https://evernote.com/'
		}*/
	};

	$scope.location = function(service) {
		$scope.filepicker.args.service = service;
	}

	//-- COMPUTER --//
	$scope.button.input = function() {
		if ($scope.multi) 	$('#file_multi_upload').click();
		else 				$('#file_upload').click();
	};

	// http://jsfiddle.net/danielzen/utp7j/
	//============== DRAG & DROP =============
    // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/
	var dropbox = document.getElementById("dropbox");
	$scope.dropText = 'Drop files here...';

    // init event handlers
    function dragEnterLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $scope.$apply(function(){
            $scope.dropText = 'Drop files here...';
            $scope.dropClass = '';
        });
    }
    dropbox.addEventListener("dragenter", dragEnterLeave, false);
    dropbox.addEventListener("dragleave", dragEnterLeave, false);
    dropbox.addEventListener("dragover", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0; //***** Investigate!!
        $scope.$apply(function(){
            $scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!';
            $scope.dropClass = ok ? 'alert-success' : 'alert-error';
        })
    }, false);
    dropbox.addEventListener("drop", function(evt) {
        console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)));
        evt.stopPropagation();
        evt.preventDefault();
        $scope.$apply(function(){
            $scope.dropText = 'Drop files here...';
            $scope.dropClass = '';
        });
        var files = evt.dataTransfer.files;
        if (files.length > 0) {
            $scope.$apply(function(){
	            $scope.files = [];
	            var error = false;
	            for (var i = 0; i < files.length; i++) {
                	var extension = files[i].name.substr(files[i].name.lastIndexOf('.'));
                	console.log(extension);
                	var allowedType = (
                		($scope.filepicker.args.types.indexOf('*/*') !== -1)
                		|| ($scope.filepicker.args.types.indexOf(files[i].type.substr(0, files[i].type.indexOf('/'))+'/*') !== -1)
                		|| ($scope.filepicker.args.types.indexOf(files[i].type) !== -1)
            		);
            		var allowedExtension = (
            			($scope.filepicker.args.extensions.length == 0)
            			|| ($scope.filepicker.args.extensions.indexOf(extension) !== -1)
            		);
                	// check type && extension
                	if (!allowedType) {
                		error = true;
	                	$scope.alerts = [{
	                		'class':'error',
	                		'label':'Invalid File Type',
	                		'message':'Try: '+$scope.filepicker.args.types.join(', ')
	                	}];
                	} else if (!allowedExtension) {
	                	$scope.alerts = [{
	                		'class':'error',
	                		'label':'Invalid File Extension',
	                		'message':'Try: '+$scope.filepicker.args.extensions.join(', ')
	                	}];
                	} else {
	                	$scope.files.push(files[i]);
                	}
                }
	            if ($scope.files.length && !$scope.multi) {
	                $scope.uploadFile();
	            }
            });
        }
    }, false);
    //============== DRAG & DROP =============

    $scope.setFiles = function(element) {
    	$scope.$apply(function(scope) {
      		console.log('files:', element.files);
      		// Turn the FileList object into an Array
	        $scope.files = [];
	        for (var i = 0; i < element.files.length; i++) {
	          	$scope.files.push(element.files[i]);
	        }
	        $scope.progressVisible = false;
	    });
    };
    
    $scope.resizeImg = function(file) {
    	console.log('resizeImg(file)');
    	var reader = new FileReader();  

        reader.onload = function(evt) {
            var image = new Image();
            image.onload = function(evt) {
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    ratio = Math.min($scope.maxwidth / this.width, $scope.maxheight / this.height, 1),
                    width = Math.round(this.width * ratio),
                    height = Math.round(this.height * ratio),
                    img = null;

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image,0,0, width, height);

                img = document.createElement("img");
                img.src = canvas.toDataURL(file.type);
            };
            image.onerror = function() {
                //message("+= " + file.name + " does not look like a valid image");
            };
            image.src = evt.target.result; 
        };
        reader.readAsDataURL(file);
        console.log(reader);
        return reader.result;
    	/*var MAX_WIDTH = 200;
		var MAX_HEIGHT = 200;
    	
    	var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
    	
	    var img = document.createElement("img");
	    img.src = window.URL.createObjectURL(file);
	    
	    
		var width = img.width;
		var height = img.height;
		 
		if (width > height) {
		  if (width > MAX_WIDTH) {
		    height *= MAX_WIDTH / width;
		    width = MAX_WIDTH;
		  }
		} else {
		  if (height > MAX_HEIGHT) {
		    width *= MAX_HEIGHT / height;
		    height = MAX_HEIGHT;
		  }
		}
		
		
		canvas.width = width;
		canvas.height = height;
		
		ctx.drawImage(img, 0, 0, width, height);
		
		img.src = canvas.toDataURL(file.type);
		console.log(img.src);
		var blob = dataURItoBlob(reader.result);
		console.log(blob);
		return blob;*/
    };
    
    $scope.uploadFile = function() {
        var fd = new FormData();
        for (var i in $scope.files) {
        	if ($scope.files[i].type.match(/image.*/)) {
	        	//fd.append("file", $scope.resizeImg($scope.files[i]), $scope.files[i].name);
	        	fd.append("file", $scope.files[i]);
        	} else {
	        	fd.append("file", $scope.files[i]);
        	}
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/filepicker/upload/"+$rootScope.filepicker.args.action);
        $scope.progressVisible = true;
        xhr.send(fd);
    }

    function uploadProgress(evt) {
        $scope.$apply(function(){
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total);
            } else {
                $scope.progress = 'unable to compute';
            }
        });
    }

    function uploadComplete(evt) {
    	$scope.$apply(function(){
    		$scope.progressVisible = false;
    		/* This event is raised when the server send back a response */
    		console.log('uploadComplete');
    		console.log(evt.target.responseText);
    		var res = JSON.parse(evt.target.responseText);
	    	$scope.alerts = [res];

        });
    }

    function uploadFailed(evt) {
        $scope.$apply(function(){
        	$scope.alerts = [{
        		"class":"error",
        		"label":"Failed",
        		"message":"There was an error attempting to upload the file."
        	}];
        });
    }

    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false;
            $scope.alerts = [{
            	"class":"error",
            	"label":"Canceled",
            	"message":"The upload has been canceled by the user or the browser dropped the connection."
            }];
        })

    }

    function dataURItoBlob(dataURI) {
	    var binary = atob(dataURI.split(',')[1]);
	    var array = [];
	    for(var i = 0; i < binary.length; i++) {
	        array.push(binary.charCodeAt(i));
	    }
	    return new Blob([new Uint8Array(array)], {type: 'image/png'});
	}
    
}
