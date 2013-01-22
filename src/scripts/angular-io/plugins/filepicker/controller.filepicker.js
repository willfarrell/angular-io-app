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
//angular.module('io.controller.filepicker', [])
//.controller('FilepickerCtrl', ['$scope', '$http', function($scope, $http) {
function FilepickerCtrl($scope, $http) {
	console.log('FilepickerCtrl ('+$scope.$id+')');
	$scope.alerts = [];
	$scope.errors = {};
	$scope.button = {};

	$scope.multi = false;
	
	$scope.alerts = [];
	$scope.errors = {};
	$scope.button = {};

	$scope.multi = false;

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
        $scope.setFiles(evt.dataTransfer.files);
    }, false);
    //============== DRAG & DROP =============
    
    //============== BUTTON SELECT =============
    $scope.setFilesButton = function(element) {
    	console.log('setFilesButton(element)');
      	
        $scope.setFiles(element.files);
	        
    };
    //============== BUTTON SELECT =============
    
    // Turn the FileList object into an Array
    $scope.setFiles = function(files) {
    	console.log('setFiles(files)');
      	console.log('files:', files);
      	
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
	                	$scope.alerts.push({
	                		'class':'error',
	                		'label':'Invalid File Type',
	                		'message':'Try: '+$scope.filepicker.args.types.join(', ')
	                	});
                	} else if (!allowedExtension) {
	                	$scope.alerts.push({
	                		'class':'error',
	                		'label':'Invalid File Extension',
	                		'message':'Try: '+$scope.filepicker.args.extensions.join(', ')
	                	});
                	} else {
	                	$scope.files.push(files[i]);
                	}
                }
	            if ($scope.files.length) {
	                $scope.uploadFile();
	            }
            });
        }
    }
    
    $scope.uploadFile = function() {
        console.log('uploadFile()');
        $scope.progressVisible = false;
        
        var fd = new FormData();
        for (var i in $scope.files) {
        	// if ($scope.files[i].type.match(/image.*/)) {
            fd.append("file", $scope.files[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/filepicker/upload/"+$rootScope.filepicker.args.action);
        $scope.progressVisible = true;
        xhr.send(fd);
        console.log("POST /filepicker/upload/"+$rootScope.filepicker.args.action);
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
	    	$scope.alerts.push(res);

        });
    }

    function uploadFailed(evt) {
        $scope.$apply(function(){
        	$scope.alerts.push({
        		"class":"error",
        		"label":"Failed",
        		"message":"There was an error attempting to upload the file."
        	});
        });
    }
    
    
    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false;
            $scope.alerts.push({
            	"class":"error",
            	"label":"Canceled",
            	"message":"The upload has been canceled by the user or the browser dropped the connection."
            });
        })

    };
}
//}]);