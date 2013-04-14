/*global syncVar:true */

//(function (angular) {
angular.module('io.modules')
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
	// remove service is not supported
	$scope.removeService = function(service) {
		// remove from list of services
		$scope.args.services.splice($scope.args.services.indexOf(service), 1);
		// reset current service if same service
		if ($scope.args.service === service) {
			$scope.args.service = $scope.args.services[0];
		}
	};
	// defaults
	$scope.args_upload = {
		type:'UPLOAD',
		action:'',
		types: ['*/*'],	// image/*
		extensions: [],	// ['.png','.jpg']
		services: ['COMPUTER'], // , 'URL'
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
		if (!$scope.args.multi) { return; }
		// get files json
		$http.get($rootScope.settings.server+'/filepicker/list/'+$scope.args.action+'/'+$scope.args.ID)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data)) {
					$scope.args.files = data;
				}
			})
			.error(function() {
			});
	};
	$scope.upload = function(args, ID) {
		ID = ID || '';
		console.log(args);
		console.log(ID);
		$scope.alerts = [];
		$scope.args = syncVar(args, $scope.args_upload);
		$scope.args.ID = ID;
		$scope.cameraModernizr(); // incase camera is default
		$scope.location($scope.args.service);
		$scope.loadFiles();
		// input accept tag
		$scope.accept = $scope.args.extensions.length ? $scope.args.extensions.join(',') : $scope.args.types.join(',');
		$scope.setDropzoneName();
		$('#filepickerModal').modal('show');
	};
	$scope.view = function(args, ID) {
		ID = ID || '';
		console.log(ID);
		$scope.alerts = [];
		$scope.args = syncVar(args, $scope.args_download);
		$scope.args.ID = ID;
		$scope.loadFiles();
	};
	$scope.download = function(args, ID) {
		ID = ID || '';
		console.log(ID);
		$scope.alerts = [];
		$scope.args = syncVar(args, $scope.args_download);
		$scope.args.ID = ID;
		$scope.loadFiles();
		$('#filepickerModal').modal('show');
	};
	$scope.downloadFile = function(file) {
		$http.post($rootScope.settings.server+'/filepicker/download/'+$scope.args.action+'/'+$scope.args.ID, {'file':file})
			.success(function(data) {
				console.log('downloadFile.post.success');
				if ($rootScope.checkHTTPReturn(data, {'alerts':true,'errors':true})) {
					$rootScope.alerts = [{'class':'success', 'label':'File deleted'}];
				} else {
					$scope.alerts = (data.alerts) ? data.alerts : [];
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('downloadFile.post.error');
			});
	};
	$scope.confirmDelete = function(file, callback) {
		console.log('filepicker.confirmDelete()');
		$rootScope.modal = {
			hide:{
				header:false,
				close:false,
				footer:false
			},
			header:'Confirm File Delete',
			content:'Are you sure you want to delete \''+file+'\'?',
			buttons:[
				{
					'class':'btn-primary',
					value:'Delete',
					callback:function(){
						callback(file);
					}
				},
				{
					'class':'',
					value:'Cancel',
					callback:function(){}
				}
			]
		};
		//$('#alertModal').modal('show');
		
		callback(file);
	};
	$scope.deleteFile = function(file) {
		var http_config = {
			'method':'delete', // get,head,post,put,delete,jsonp
			'url':$rootScope.settings.server+'/filepicker/'+$scope.args.action+'/'+$scope.args.ID+'/'+encodeURIComponent(file)
		};
		$http(http_config)
			.success(function(data) {
				if ($rootScope.checkHTTPReturn(data, {'alerts':true,'errors':true})) {
					$rootScope.alerts = [{'class':'success', 'label':'File deleted'}];
					$scope.view($scope.args, $scope.args.ID); // reload list
				} else {
					$scope.alerts = (data.alerts) ? data.alerts : [];
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
			});
	};

	$scope.close = function() {
		this.timestamp = +new Date(); // used to force image to be reloaded
	};
	$scope.location = function(service) {
		if (service === 'CAMERA') {
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
		};
		if (!hasUserMedia()) {
			console.log('!hasUserMedia');
			$scope.removeService('CAMERA');
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
		var dom = document.getElementById('camera');
		$scope.camera.video = dom.querySelector('video');
		$scope.camera.canvas = dom.querySelector('canvas');
		$scope.camera.canvas.width = $scope.args.width * 2;
		$scope.camera.canvas.height = $scope.args.height * 2;
		$scope.camera.ctx = $scope.camera.canvas.getContext('2d');
		//$scope.camera.img = dom.querySelector('img');
		//$scope.camera.link = document.createElement('a');
		var failure = function(e) {
			console.log('camera Fail', e);
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
				console.log('metadata loaded');
			};
		};
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
		$scope.camera.video.src='';
	};
	return $scope;
}])
//angular.module('io.controller.filepicker', ['io.factory.filepicker'])
.controller('FilepickerCtrl', ['$scope', '$http', '$filepicker', function($scope, $http, filepicker) {
//function FilepickerCtrl($scope, $http, filepicker) {
	console.log('FilepickerCtrl (' + $scope.$id + ')');
	//$scope.errors = {};
	$scope.filepicker = filepicker;




	//-- dropzone --//
	var dropbox = document.getElementById('dropbox');
	if (dropbox.attachEvent) {	// <= IE8
		dropbox.addEventListener = dropbox.attachEvent; // event = window.attachEvent ? 'onclick' : 'click';
	}

	// init event handlers
	$scope.dragEnterLeave = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		$scope.$apply(function() {
			$scope.filepicker.setDropzoneName(true);
			$scope.dropClass = '';
		});
	};

	dropbox.addEventListener('dragenter', $scope.dragEnterLeave, false);
	dropbox.addEventListener('dragleave', $scope.dragEnterLeave, false);
	dropbox.addEventListener('dragover', function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		//console.log(objectClone(evt.dataTransfer));
		var ok = evt.dataTransfer && evt.dataTransfer.types && (
			evt.dataTransfer.types.indexOf('Files') >= 0 || // file from computer
			evt.dataTransfer.types.indexOf('text/uri-list') >= 0 // url from other window
		);
		$scope.$apply(function() {
			$scope.filepicker.setDropzoneName(ok);
			$scope.dropClass = ok ? 'alert-success' : 'alert-error';
		});
	}, false);
	dropbox.addEventListener('drop', function(evt) {
		//console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)));
		//console.log(evt.dataTransfer.getData('TEXT'));
		//console.log(evt.dataTransfer.getData('URL'));
		evt.stopPropagation();
		evt.preventDefault();
		$scope.$apply(function() {
			$scope.filepicker.setDropzoneName(true);
			$scope.dropClass = '';
		});
		if (evt.dataTransfer.getData('URL')) {
			// pass to URL upload service
			$scope.url.load(evt.dataTransfer.getData('URL'));
		} else {
			$scope.setFiles(evt.dataTransfer.files);
		}
	}, false);


	//-- COMPUTER --//
	$scope.computer = {};
	// click button
	$scope.computer.buttonClick = function() {
		if ($scope.filepicker.args.multi) { document.getElementById('file_multi_upload').click(); }
		else { document.getElementById('file_upload').click(); }
	};
	// select file after button click
	$scope.computer.buttonSelect = function(element) {
		console.log('computer.buttonSelect(element)');
		console.log(element);
		$scope.setFiles(element.files);
	};

	//-- URL --//
	$scope.url = {};
	$scope.url.value = '';
	$scope.url.load = function(url) {
		url = encodeURIComponent(url);
		if ($scope.filepicker.args.resizecrop) {
			$scope.setFiles([{
				name: url,
				type: 'image/' + url.substr(url.lastIndexOf('.'))
			}]);
		} else {
			//$scope.settings.server+'/filepicker/url/'+url.replace(/\./g, '%2E');
			$http.post($scope.settings.server + '/filepicker/url/' + $scope.filepicker.args.action + '/' + $scope.filepicker.args.ID, {
				url: url
			}).success(function(data) {
				console.log('url.load.post.success');
				if ($rootScope.checkHTTPReturn(data)) {
					data = {
						target: {
							responseText: data
						}
					};
					$scope.uploadComplete(JSON.stringify(data));
				}
			}).error(function() {
				console.log('url.load.post.error');
				$scope.uploadFailed();
			});
		}
	};

	//-- RESIZECROP --//
	$scope.resizecrop = {
		img: {}
	};
	$scope.resizecrop.initParams = function(src, type) {
		var img = {};
		img.src = src; // URL
		img.type = type;
		img.zoom = 100;
		//img.canvas; // source canvas
		img.data = ''; // DataURL
		$scope.resizecrop.img = img; // gen img
	};

	$scope.resizecrop.loadFiles = function() {
		for (var i in $scope.files) {
			if ($scope.files[i].type.match(/image.*/)) {
				//fd.append('file', $scope.resizeImg($scope.files[i]), $scope.files[i].name);
				//fd.append('file', $scope.files[i]);
				console.log($scope.files[i]);

				$scope.resizecrop.loadFile($scope.files[i]);
			}
		}
	};

	$scope.resizecrop.loadFile = function(file) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			console.log('loadFile.reader.onload');
			$scope.resizecrop.initParams(evt.target.result, file.type);
			$scope.$apply(function() {
				$scope.resizecrop.generate();
				if ($scope.filepicker.args.multi === false) {
					$scope.filepicker.args.service = 'RESIZECROP';
				}
			});
		};
		reader.readAsDataURL(file);
	};

	$scope.resizecrop.loadURL = function(src, type) {
		src = src || $scope.files[0].name; //.replace(/\./g, '%2E'),
		type = type || $scope.files[0].type;
		var proxy = $scope.settings.server + '/filepicker/url/?url=' + src;
		$http.get(proxy + '&callback=JSON_CALLBACK').success(function(data) {
			//console.log(data);
			console.log('loadURL.get.success');
			if ($rootScope.checkHTTPReturn(data)) {
				$scope.resizecrop.initParams(proxy, type);
				//$scope.$apply(function(){
				$scope.resizecrop.generate();
				if ($scope.filepicker.args.multi === false) {
					$scope.filepicker.args.service = 'RESIZECROP';
				}
				//});
			}
		}).error(function() {
			$scope.filepicker.alerts = [{
				'class': 'error',
				'label': 'Failed',
				'message': 'There was an error attempting to obtain the image.'
			}];
		});
	};

	$scope.resizecrop.generate = function() {
		var image = new Image();
		image.onload = function(evt) {
			console.log('image.onload');
			// image origenal size
			var this_width = this.width,
				this_height = this.height,
				// thumbnail size to upload
				dest_width = $scope.filepicker.args.width,
				dest_height = $scope.filepicker.args.height,
				// canvas size
				canvas_width = dest_width * 1.5,
				canvas_height = dest_height * 1.5,
				// canvas crop offsets
				crop_left = ((canvas_width - dest_width) / 2),
				crop_top = ((canvas_height - dest_height) / 2),
				// image scale ratios
				width = this_width,
				height = this_height,
				// image scale ratios
				width_ratio = dest_width / this_width,
				height_ratio = dest_height / this_height,
				x = (canvas_width / 2),
				y = (canvas_height / 2);

			function scaleImage() {
				width = Math.round(this_width * ((width_ratio > height_ratio) ? width_ratio : height_ratio)) * $scope.resizecrop.img.zoom / 100;
				height = Math.round(this_height * ((width_ratio > height_ratio) ? width_ratio : height_ratio)) * $scope.resizecrop.img.zoom / 100;
				//console.log(width+' x '+height+' ('+x+','+y+')>('+(x-width/2)+','+(y-height/2)+') @ '+zoom+'% zoom');
				// check image is still positioned right
				//console.log(crop_left+' < '+(x - width/2)+' < '+(crop_left + dest_width)+' -> x = '+(x));
				//console.log(crop_top+' < '+(y - height/2)+' < '+(crop_top + dest_height)+' -> y = '+(y));
				var left = (crop_left < (x - width / 2)),
					right = ((x + width / 2) < (crop_left + dest_width)),
					top = (crop_top < (y - height / 2)),
					bottom = ((y + height / 2) < (crop_top + dest_height));
				if (left) {
					console.log('l');
					x = crop_left + width / 2;
				} else if (right) {
					console.log('r');
					x = crop_left + dest_width - width / 2;
				}
				if (top) {
					console.log('t');
					y = crop_top + height / 2;
				} else if (bottom) {
					console.log('b');
					y = crop_top + dest_height - height / 2;
				}
				// scaled image canvas
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').drawImage(image, 0, 0, width, height);
				$scope.resizecrop.img.canvas = canvas;
			}

			function draw() {
				canvas.width = canvas_width;
				canvas.height = canvas_height;
				//canvas.style.cursor = 'move'; // see css rules
				//canvas.onselectstart = function(){ return false; }; // browser bug work around - http://stackoverflow.com/questions/2745028/chrome-sets-cursor-to-text-while-dragging-why
				var ctx = canvas.getContext('2d');
				//ctx.clearRect(0, 0, canvas_width, canvas_height);
				//ctx.drawImage(copy, image_left, image_top)
				ctx.drawImage($scope.resizecrop.img.canvas, (x - width / 2), (y - height / 2));
				// draw faded overlay
				ctx.save();
				ctx.globalAlpha = 0.5;
				// left
				ctx.beginPath();
				ctx.rect(0, 0, crop_left, canvas_height);
				ctx.rect(crop_left, 0, dest_width, crop_top);
				ctx.rect(crop_left + dest_width, 0, crop_left, canvas_height);
				ctx.rect(crop_left, crop_top + dest_height, dest_width, crop_top);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.beginPath();
				ctx.rect(crop_left, crop_top, dest_width, dest_height);
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'grey';
				ctx.stroke();
				document.getElementById('resizecrop').innerHTML = '';
				document.getElementById('resizecrop').appendChild(canvas);
				build();
			}

			function build() {
				// image offsets
/*console.log(
					'left: ('+(x-width/2)+')-('+(crop_left)+')'+' = '+
					((x-width/2)-(crop_left))+' = '+
					(((width - dest_width) / 2)-(x-canvas_width/2))+', '+
					'top: ('+(y-height/2)+')-('+(crop_top)+')'+' = '+
					((y-height/2)-(crop_top))+' = '+
					(((height - dest_height) / 2)-(y-canvas_height/2))
				);*/
				var top = Math.round(((height - dest_height) / 2) - (y - canvas_height / 2));
				var left = Math.round(((width - dest_width) / 2) - (x - canvas_width / 2));
				var canvas = document.createElement('canvas');
				// export canvas
				canvas.width = dest_width;
				canvas.height = dest_height;
				canvas.getContext('2d').drawImage($scope.resizecrop.img.canvas, left, top, dest_width, dest_height, 0, 0, dest_width, dest_height);
				$scope.resizecrop.img.data = canvas.toDataURL($scope.resizecrop.img.type);
				//var img = document.createElement('img');
				//img.src = $scope.resizecrop.img.data;
				//document.getElementById('resizecrop').appendChild(document.createElement('p'));
				//document.getElementById('resizecrop').appendChild(img);
			}
			scaleImage();
			var canvas = document.createElement('canvas');
			draw();
			// if resizing multiple images for say a gallery, auto save
			if ($scope.filepicker.args.multi === true) {
				$scope.resizecrop.save();
			}
			// zoom
			document.getElementById('resizecrop-zoom').onchange = function(evt) {
				scaleImage();
				draw();
			};
			// pan
			// x,y vector from image center to pointer grab location
			var grab_x = 0,
				grab_y = 0;

			function move(e) {
				// get offsets
				var pageX, pageY, totalOffsetX = 0,
					totalOffsetY = 0,
					currentElement = this;
				// global position of mouse pointer
				if (e.pageX || e.pageY) {
					pageX = e.pageX;
					pageY = e.pageY;
				} else {
					pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				// global position of canvas top-left
				do {
					totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
					totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
				} while ((currentElement = currentElement.offsetParent));
				// calc grab offset - on mouse down only
				if (grab_x === 0 && grab_y === 0) {
					grab_x = (pageX - totalOffsetX) - x;
					grab_y = (pageY - totalOffsetY) - y;
				}
				//console.log(totalOffsetX + crop_left+' < '+(pageX - width/2)+' < '+(totalOffsetX + crop_left + dest_width)+' -> x = '+(pageX - totalOffsetX));
				//console.log(totalOffsetY + crop_top+' < '+(pageY - height/2)+' < '+(totalOffsetY + crop_top + dest_height)+' -> y = '+(pageY - totalOffsetY));
				// x,y = center of image from canvas origin (top-left)
				// check if img is outside limits
				var left = (pageX - width / 2 - grab_x < totalOffsetX + crop_left),
					right = (totalOffsetX + crop_left + dest_width < pageX + width / 2 - grab_x),
					top = (pageY - height / 2 - grab_y < totalOffsetY + crop_top),
					bottom = (totalOffsetY + crop_top + dest_height < pageY + height / 2 - grab_y);
				if (left && right) { // left
					x = (pageX - totalOffsetX) - grab_x;
				} else if (left) {
					x = crop_left + dest_width - width / 2;
				} else if (right) {
					x = crop_left + width / 2;
				}
				if (top && bottom) { // top
					y = (pageY - totalOffsetY) - grab_y;
				} else if (top) {
					y = crop_top + dest_height - height / 2;
				} else if (bottom) {
					y = crop_top + height / 2;
				}
				//console.log('('+x+','+y+')');
				draw();
			}
			canvas.onselectstart = function() {
				return false;
			};
			canvas.onmouseover = function(e) {
				//canvas.onselectstart = function(){ return false; };
			};
			canvas.onmouseout = function() {
				//canvas.onselectstart = function(){ return true; };
			};
			canvas.onmousedown = function(e) {
				grab_x = 0, grab_y = 0; // reset pan grab offset
				canvas.onmousemove = move;
/*if (pageX < x + width + totalOffsetX &&
			pageX > x - width + totalOffsetX &&
			pageY < y + height + totalOffsetY &&
			pageY > y - height + totalOffsetY){
				x = pageX - totalOffsetX;
				y = pageY - totalOffsetY;
				//console.log('move: '+x+','+y+'');
				//dragok = true;
				canvas.onmousemove = move;
				}*/
				document.onselectstart = null;
			};
			canvas.onmouseup = function() {
				console.log('onmouseup');
				canvas.onmousemove = null;
			};
		};
		image.onerror = function() {
			//message('+= ' + file.name + ' does not look like a valid image');
		};
		image.src = $scope.resizecrop.img.src;
	};
	$scope.resizecrop.save = function() {
		console.log('resizecrop.save');
		var blob = $scope.dataURItoBlob($scope.resizecrop.img.data);
		$scope.files[0] = blob;
		$scope.uploadFiles();
	};

	$scope.camera = {};
	$scope.camera.save = function() {
		console.log('camera.save');
		console.log(filepicker.camera);
		if (!$scope.filepicker.camera.video.videoWidth && !$scope.filepicker.camera.video.videoHeight) { return; } // camera not loaded yet
		// reset canvas to camera size
		$scope.filepicker.camera.canvas.width = $scope.filepicker.camera.video.videoWidth;
		$scope.filepicker.camera.canvas.height = $scope.filepicker.camera.video.videoHeight;
		// draw webcam picture in canvas
		$scope.filepicker.camera.ctx.drawImage(
		$scope.filepicker.camera.video, 0, 0);
		// create data URL and insert into <img/>
		//$scope.filepicker.camera.img.src = $scope.filepicker.camera.canvas.toDataURL('image/png');
		//$scope.filepicker.camera.img.data = $scope.filepicker.camera.canvas.toDataURL($scope.filepicker.camera.img.type);
		// resize and crop
		$scope.files[0] = {
			name: 'camera' + (+new Date()) + '.png',
			type: 'image/png'
		};
		$scope.resizecrop.initParams($scope.filepicker.camera.canvas.toDataURL('image/png'), 'image/png');
		$scope.resizecrop.generate();
		if ($scope.filepicker.args.multi === false) {
			$scope.filepicker.args.service = 'RESIZECROP';
			$scope.filepicker.cameraStop();
		}
	};

	$scope.files = [];
	// Turn the FileList object into an Array - *** move to computer service
	$scope.setFiles = function(files) {
		console.log('setFiles(files)');
		console.log('files:', files);
		if (files.length > 0) {
			//$scope.$apply(function(){
			$scope.files = [];
			var error = false;
			for (var i = 0; i < files.length; i++) {
				console.log(files[i]);
				var extension = files[i].name.substr(files[i].name.lastIndexOf('.'));
				//console.log(extension);
				var allowedType = (($scope.filepicker.args.types.indexOf('*/*') !== -1) || ($scope.filepicker.args.types.indexOf(files[i].type.substr(0, files[i].type.indexOf('/')) + '/*') !== -1) || ($scope.filepicker.args.types.indexOf(files[i].type) !== -1));
				var allowedExtension = (($scope.filepicker.args.extensions.length === 0) || ($scope.filepicker.args.extensions.indexOf(extension.toLowerCase()) !== -1) // toLowerCase to catch windows problems
				);
				// check type && extension
				if (!allowedType) {
					error = true;
					$scope.filepicker.alerts.push({
						'class': 'error',
						'label': 'Invalid File Type',
						'message': 'Try: ' + $scope.filepicker.args.types.join(', ')
					});
				} else if (!allowedExtension) {
					$scope.filepicker.alerts.push({
						'class': 'error',
						'label': 'Invalid File Extension',
						'message': 'Try: ' + $scope.filepicker.args.extensions.join(', ')
					});
				} else {
					$scope.files.push(files[i]);
				}
			}
			if ($scope.files.length) {
				if ($scope.filepicker.args.resizecrop) { // one file
					if ($scope.files[0].name.match(/^http/)) { // url
						$scope.resizecrop.loadURL();
					} else {
						$scope.resizecrop.loadFiles();
					}
				} else {
					$scope.uploadFiles();
				}
			}
			//});
		}
	};

	// move to computer service
	$scope.uploadFiles = function() {
		for (var i in $scope.files) {
			if ($scope.files.hasOwnProperty(i)) {
				console.log($scope.files[i]);
				//if ($scope.files[i].type.match(/image.*/)) {
				$scope.uploadFile($scope.files[i]);
			}
		}
	};

	// Events
	$scope.progress = 0;
	$scope.uploadProgress = function(evt) {
		//console.log('uploadProgress');
		$scope.$apply(function() {
			if (evt.lengthComputable) {
				$scope.progress = Math.round(evt.loaded * 100 / evt.total);
			} else {
				$scope.progress = 0;//'unable to compute';
			}
		});
	};

	$scope.uploadComplete = function(evt) {
		console.log('uploadComplete');
		$scope.$apply(function() {
			$scope.progressVisible = false;
			console.log(JSON.parse(evt.target.responseText));
			$scope.filepicker.alerts = [JSON.parse(evt.target.responseText)];
			$scope.filepicker.loadFiles();
		});
	};

	$scope.uploadFailed = function(evt) {
		console.log('uploadFailed');
		$scope.$apply(function() {
			$scope.filepicker.alerts = [{
				'class': 'error',
				'label': 'Failed',
				'message': 'There was an error attempting to upload the file.'
			}];
		});
	};

	$scope.uploadCanceled = function(evt) {
		console.log('uploadCanceled');
		$scope.$apply(function() {
			$scope.progressVisible = false;
			$scope.filepicker.alerts = [{
				'class': 'error',
				'label': 'Canceled',
				'message': 'The upload has been canceled by the user or the browser dropped the connection.'
			}];
		});
	};


	$scope.uploadFile = function(file) {
		console.log('uploadFile()');
		file = file || $scope.files[0];
		$scope.progressVisible = false;
		var fd = new FormData();
		fd.append('file', file);
		var xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', $scope.uploadProgress, false);
		xhr.addEventListener('load', $scope.uploadComplete, false);
		xhr.addEventListener('error', $scope.uploadFailed, false);
		xhr.addEventListener('abort', $scope.uploadCanceled, false);
		xhr.open('POST', $rootScope.settings.server + '/filepicker/computer/' + $scope.filepicker.args.action + '/' + $scope.filepicker.args.ID);
		$scope.progressVisible = true;
		xhr.send(fd);
		//console.log('POST /filepicker/computer/'+$scope.filepicker.args.action);
	};

	// used to create blob from resized and cropped image
	$scope.dataURItoBlob = function(dataURI) {
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {
			type: 'image/png'
		});
	};

	//-- Remote Services --//
	//-- FTP --//
	$scope.ftp = {};
	$scope.ftp.connect = function(url, username, password) {
		url = encodeURIComponent(url);
		//$scope.settings.server+'/filepicker/url/'+url.replace(/\./g, '%2E');
		$http.post($scope.settings.server + '/filepicker/url/' + $scope.filepicker.args.action + '/' + $scope.filepicker.args.ID, {
			url: url
		}).success(function(data) {
			console.log('url.load.post.success');
			console.log(data);
			if ($rootScope.checkHTTPReturn(data)) {
				data = {
					target: {
						responseText: data
					}
				};
				$scope.uploadComplete(JSON.stringify(data));
			}
		}).error(function() {
			console.log('url.load.post.error');
			$scope.uploadFailed();
		});
	};
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
