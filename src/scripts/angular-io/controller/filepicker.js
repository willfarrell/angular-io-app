angular.module('io.controller.filepicker', [])
.controller('FilepickerCtrl', ['$scope', '$http', '$filepicker', function($scope, $http, filepicker) {
//FilepickerCtrl.$inject = ['$scope', '$http', '$filepicker'];
//function FilepickerCtrl($scope, $http, filepicker) {
	console.log('FilepickerCtrl ('+$scope.$id+')');
	//$scope.errors = {};
	
	//-- dropzone --//
	var dropbox = document.getElementById("dropbox");

    // init event handlers
    function dragEnterLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $scope.$apply(function(){
            $scope.filepicker.setDropzoneName(true);
            $scope.dropClass = '';
        });
    }
    dropbox.addEventListener("dragenter", dragEnterLeave, false);
    dropbox.addEventListener("dragleave", dragEnterLeave, false);
    dropbox.addEventListener("dragover", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        //console.log(evt.dataTransfer);
        var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0; //***** Investigate!!
        $scope.$apply(function(){
        	$scope.filepicker.setDropzoneName(ok);
            $scope.dropClass = ok ? 'alert-success' : 'alert-error';
        })
    }, false);
    dropbox.addEventListener("drop", function(evt) {
        //console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)));
        //console.log(evt.dataTransfer.getData('TEXT'));
        //console.log(evt.dataTransfer.getData('URL'));
        
        evt.stopPropagation();
        evt.preventDefault();
        $scope.$apply(function(){
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
		if ($scope.filepicker.args.multi) 	$('#file_multi_upload').click();
		else 								$('#file_upload').click();
	};
	
	// select file after button click
	$scope.computer.buttonSelect = function(element) {
    	console.log('setFilesButton(element)');
      	
        $scope.setFiles(element.files);
	        
    };

	
    
    
	//-- URL --//
	// Image - http://www.maxnov.com/getimagedata/ requires nginx proxy
	// Got "Uncaught Error: SECURITY_ERR: DOM Exception 18"?
	// Simply start chrome with ‘–allow-file-access-from-files’ argument of test server
	// 413 - Request Entity Too Large - The image you are trying to fetch is too large. The limit for image size is 1MB.
	$scope.url = {};
	$scope.url.value = 'http://www.gravatar.com/avatar/blank.png';
    $scope.url.load = function(url) {
	    console.log(url);
	    
	    if ($scope.filepicker.args.resizecrop) {
	    	var type = 'image/'+url.substr(url.lastIndexOf('.'));
	    	$scope.resizecrop.initParams($scope.settings.proxy+'?q='+url, type);
	    	$scope.resizecrop.generate();
	    } else {
		    
	    }
    }
	
    //-- RESIZECROP --//
	$scope.resizecrop = {};
	
	$scope.resizecrop.initParams = function(src, type) {
		var img = {};
		img.src = src; // URL
		img.type = type;
		img.zoom = 100;
		img.canvas; // source canvas
		img.data = ''; // DataURL
		
		$scope.resizecrop.img = img; // gen img
	}
	
	$scope.resizecrop.loadFile = function() {
	    for (var i in $scope.files) {
        	if ($scope.files[i].type.match(/image.*/)) {
        		
	        	//fd.append("file", $scope.resizeImg($scope.files[i]), $scope.files[i].name);
	        	//fd.append("file", $scope.files[i]);
	        	console.log($scope.files[i]);
	        	var file = $scope.files[i];
	        	var reader = new FileReader();  

		        reader.onload = function(evt) {
		            console.log('reader.onload');
		            $scope.resizecrop.initParams(evt.target.result, file.type)
		            $scope.$apply(function(){
		            	$scope.resizecrop.generate();
		            	$scope.filepicker.args.service = 'RESIZECROP';
		            });
		        };
		        reader.readAsDataURL(file);
		        
        	}
        }

    };
    
    $scope.resizecrop.loadUrl = function(url) {
	    var type = 'image/'+url.substr(url.lastIndexOf('.'));

		/*$http.jsonp(url+"?callback=JSON_CALLBACK", {headers:{'Content-Type':'image/*'}})
			.success(function(data){
				//console.log(data);
				$scope.resizecrop.generate(data, file.type);
			})
			.error(function(){
				$scope.filepicker.alerts = [{
	        		"class":"error",
	        		"label":"Failed",
	        		"message":"There was an error attempting to obtain the image."
	        	}];
			});*/
		
		/*$http({'method':'', 'url':url, 'headers':{'Content-Type':'image/png'}})
			.success(function(data){
				console.log(data);
				$scope.resizecrop.generate(data, file.type);
			})
			.error(function(){
				$scope.filepicker.alerts = [{
	        		"class":"error",
	        		"label":"Failed",
	        		"message":"There was an error attempting to obtain the image."
	        	}];
			});*/
		
		//$rootScope.loadScript(url);
		
		
    };
	
	$scope.resizecrop.generate = function() {
		
		var image = new Image();
        image.onload = function(evt) {
            console.log('image.onload');
            	// image origenal size
            var	this_width = this.width,
            	this_height = this.height,
            	
		        // thumbnail size to upload
            	dest_width = $scope.filepicker.args.width,
                dest_height = $scope.filepicker.args.height,
                
            	// canvas size
	            canvas_width = dest_width*1.5,
		        canvas_height = dest_height*1.5,
                
	            // canvas crop offsets
	            crop_left = ((canvas_width - dest_width) / 2),
	            crop_top = ((canvas_height - dest_height) / 2),
		        
		        // image scale ratios
                width  = this_width,
                height = this_height,
                
                // image scale ratios
                width_ratio  = dest_width  / this_width,
                height_ratio = dest_height / this_height,
                
                x = (canvas_width/2),
                y = (canvas_height/2);
            
            
            function scaleImage() {
            	width = Math.round(this_width * ((width_ratio > height_ratio) ? width_ratio: height_ratio)) * $scope.resizecrop.img.zoom / 100;
            	height = Math.round(this_height * ((width_ratio > height_ratio) ? width_ratio: height_ratio)) * $scope.resizecrop.img.zoom / 100;
	            
	            //console.log(width+' x '+height+' ('+x+','+y+')>('+(x-width/2)+','+(y-height/2)+') @ '+zoom+'% zoom');
	            
	            // check image is still positioned right
	            
			 	//console.log(crop_left+' < '+(x - width/2)+' < '+(crop_left + dest_width)+' -> x = '+(x));
			 	//console.log(crop_top+' < '+(y - height/2)+' < '+(crop_top + dest_height)+' -> y = '+(y));
	            var left = (crop_left < (x - width/2)),
			 		right = ((x + width/2) < (crop_left + dest_width)),
			 		top = (crop_top < (y - height/2)),
			 		bottom = ((y + height/2) < (crop_top + dest_height));
			 	if(left) {console.log('l');
				  	x = crop_left + width/2;
			  	} else if (right) {console.log('r');
				  	x = crop_left + dest_width - width/2;
			  	}
			  	if (top){console.log('t');
			  		y = crop_top + height/2;
			  	} else if (bottom) {console.log('b');
			  		y = crop_top + dest_height - height/2;
			  	}
	            
	            
	            // scaled image canvas
	            var canvas = document.createElement("canvas");
	            canvas.width = width;
	            canvas.height = height;
	            canvas.getContext("2d").drawImage(image, 0, 0, width, height);
	            $scope.resizecrop.img.canvas = canvas;
            }
            
            
            function draw() {
	            
	            
				canvas.width = canvas_width;
		        canvas.height = canvas_height;
		        //canvas.style.cursor = 'move'; // see css rules
		        //canvas.onselectstart = function(){ return false; }; // browser bug work around - http://stackoverflow.com/questions/2745028/chrome-sets-cursor-to-text-while-dragging-why
		        var ctx = canvas.getContext("2d");
		        
		        //ctx.clearRect(0, 0, canvas_width, canvas_height);
	            //ctx.drawImage(copy, image_left, image_top)
	            ctx.drawImage($scope.resizecrop.img.canvas, (x-width/2), (y-height/2))
	            // draw faded overlay
	            ctx.save();
	            ctx.globalAlpha = 0.5;
	            // left
	            ctx.beginPath();
			    ctx.rect(0, 0, crop_left, canvas_height);
			    ctx.rect(crop_left, 0, dest_width, crop_top);
			    ctx.rect(crop_left+dest_width, 0, crop_left, canvas_height);
			    ctx.rect(crop_left, crop_top+dest_height, dest_width, crop_top);
			    ctx.fillStyle = 'white';
			    ctx.fill();
			    
			    ctx.beginPath();
			    ctx.rect(crop_left, crop_top, dest_width, dest_height);
			    ctx.lineWidth = 1;
			    ctx.strokeStyle = 'grey';
			    ctx.stroke();
			    
			    document.getElementById("resizecrop").innerHTML = '';
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
	            var top = Math.round(((height - dest_height) / 2)-(y-canvas_height/2));
	            var left = Math.round(((width - dest_width) / 2)-(x-canvas_width/2));
	            
            	var canvas = document.createElement('canvas');
	            // export canvas
	            canvas.width = dest_width;
	            canvas.height = dest_height;
	            
	            canvas.getContext('2d').drawImage($scope.resizecrop.img.canvas,
	            	left, top, dest_width, dest_height,
	            	0, 0, dest_width, dest_height
	            );
	            $scope.resizecrop.img.data = canvas.toDataURL($scope.resizecrop.img.type);
	            
	            //var img = document.createElement('img');
	            //img.src = $scope.resizecrop.img.data;
	            //document.getElementById('resizecrop').appendChild(document.createElement('p'));
			    //document.getElementById('resizecrop').appendChild(img);
	            
            }
            
            
			scaleImage();
			var canvas = document.createElement("canvas");
            draw();
            
            
			// zoom
			document.getElementById("resizecrop-zoom").onchange = function(evt) {
				scaleImage();
				draw();
			}
			
			// pan
			// x,y vector from image center to pointer grab location
			var	grab_x = 0, grab_y = 0;
		 	
            function move(e) {
            	// get offsets
            	var pageX,pageY, totalOffsetX = 0, totalOffsetY = 0, currentElement = this;
		    	
		    	// global position of mouse pointer
		    	if (e.pageX || e.pageY) { 
				  pageX = e.pageX;
				  pageY = e.pageY;
				}
				else { 
				  pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
				  pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
				}
				
				// global position of canvas top-left
				do{
			        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
			        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
			    }
			    while(currentElement = currentElement.offsetParent)
			    
			    // calc grab offset - on mouse down only
			    if (grab_x === 0 && grab_y === 0) {
				    grab_x = (pageX - totalOffsetX) - x;
				    grab_y = (pageY - totalOffsetY) - y;
			    }
			 	
			 	//console.log(totalOffsetX + crop_left+' < '+(pageX - width/2)+' < '+(totalOffsetX + crop_left + dest_width)+' -> x = '+(pageX - totalOffsetX));
			 	//console.log(totalOffsetY + crop_top+' < '+(pageY - height/2)+' < '+(totalOffsetY + crop_top + dest_height)+' -> y = '+(pageY - totalOffsetY));
			 	
			 	// x,y = center of image from canvas origin (top-left)
			 	
			 	// check if img is outside limits
			 	var left = (pageX - width/2 - grab_x < totalOffsetX + crop_left),
			 		right = (totalOffsetX + crop_left + dest_width  < pageX + width/2 - grab_x),
			 		top = (pageY - height/2 - grab_y < totalOffsetY + crop_top),
			 		bottom = (totalOffsetY + crop_top + dest_height < pageY + height/2 - grab_y);
			 	if (left && right){	// left
				 	x = (pageX - totalOffsetX) - grab_x;
			  	} else if(left) {
				  	x = crop_left + dest_width - width/2;
			  	} else if (right) {
				  	x = crop_left + width/2;
			  	}
			  	if (top && bottom){				// top
			  		y = (pageY - totalOffsetY) - grab_y;
			  	} else if (top){
			  		y = crop_top + dest_height - height/2;
			  	} else if (bottom) {
				  	y = crop_top + height/2;
			  	}
			  	
			  	//console.log('('+x+','+y+')');
			  	draw();
			}
			
			canvas.onselectstart = function(){ return false; };
			canvas.onmouseover = function (e){
				//canvas.onselectstart = function(){ return false; };
			}
			canvas.onmouseout = function (){
			 	//canvas.onselectstart = function(){ return true; };
			};
		    canvas.onmousedown = function (e){
		    	grab_x = 0, grab_y = 0;	// reset pan grab offset
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
			canvas.onmouseup = function (){
			 	console.log('onmouseup');
			 	canvas.onmousemove = null;
			};
			
            
        };
        image.onerror = function() {
            //message("+= " + file.name + " does not look like a valid image");
        };
        image.src = $scope.resizecrop.img.src;
        
    };
    
    $scope.resizecrop.save = function() {
    	console.log('resizecrop.save');
    	var blob = dataURItoBlob($scope.resizecrop.img.data);
    	$scope.files[0] = blob;
    	$scope.uploadFile();
    };
    
    
    
    // Turn the FileList object into an Array - *** move to computer service
    $scope.setFiles = function(files) {
    	console.log('setFiles(files)');
      	console.log('files:', files);
      	
	    if (files.length > 0) {
            //$scope.$apply(function(){
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
	                	$scope.filepicker.alerts.push({
	                		'class':'error',
	                		'label':'Invalid File Type',
	                		'message':'Try: '+$scope.filepicker.args.types.join(', ')
	                	});
                	} else if (!allowedExtension) {
	                	$scope.filepicker.alerts.push({
	                		'class':'error',
	                		'label':'Invalid File Extension',
	                		'message':'Try: '+$scope.filepicker.args.extensions.join(', ')
	                	});
                	} else {
	                	$scope.files.push(files[i]);
                	}
                }
	            if ($scope.files.length) {
	                if ($scope.filepicker.args.resizecrop)	$scope.resizecrop.loadFile();
	                else									$scope.uploadFile();
	            }
            //});
        }
    }
    
    // move to computer service
    $scope.uploadFile = function() {
        console.log('uploadFile()');
        $scope.progressVisible = false;
        
        var fd = new FormData();
        for (var i in $scope.files) {
        	console.log($scope.files[i]);
        	//if ($scope.files[i].type.match(/image.*/)) {
	        fd.append("file", $scope.files[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/filepicker/computer/"+$scope.filepicker.args.action);
        $scope.progressVisible = true;
        xhr.send(fd);
        //console.log("POST /filepicker/computer/"+$scope.filepicker.args.action);
    };
    
    
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
	    	$scope.filepicker.alerts = [res];

        });
    }

    function uploadFailed(evt) {
        $scope.$apply(function(){
        	$scope.filepicker.alerts = [{
        		"class":"error",
        		"label":"Failed",
        		"message":"There was an error attempting to upload the file."
        	}];
        });
    }

    function uploadCanceled(evt) {
        $scope.$apply(function(){
            $scope.progressVisible = false;
            $scope.filepicker.alerts = [{
            	"class":"error",
            	"label":"Canceled",
            	"message":"The upload has been canceled by the user or the browser dropped the connection."
            }];
        })

    }
    
    // used to create blob from resized and cropped image
    function dataURItoBlob(dataURI) {
	    var binary = atob(dataURI.split(',')[1]);
	    var array = [];
	    for(var i = 0; i < binary.length; i++) {
	        array.push(binary.charCodeAt(i));
	    }
	    return new Blob([new Uint8Array(array)], {type: 'image/png'});
	}
	
//}
}]);