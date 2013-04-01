//angular.module('app.controller.root', [])
//.controller('AppCtrl',
//['$rootScope', '$scope', '$http', '$follow', '$filepicker',
//function(rootScope, $scope, $http, follow, filepicker) {
AppCtrl.$inject = ['$rootScope', '$scope', '$http', '$cookies', '$location', '$filepicker', '$accessibility', '$markdown', '$message', '$follow'];
function AppCtrl(rootScope, $scope, $http, $cookies, $location, filepicker, accessibility, markdown, message, follow) {
	console.log('AppCtrl ('+$scope.$id+')');
	
	$rootScope = rootScope; // important
	
	// scope fall back for children
	//$scope.$http = $http;
	
	// Factory init - $scope.factory = factory;
 	$rootScope.filepicker = filepicker;
 	$rootScope.accessibility = accessibility;
 	$rootScope.markdown = markdown;
	$rootScope.message = message;
	$rootScope.follow = follow;
	
	markdown.setOptions({
	  	gfm: true,
	  	tables: true,
	  	breaks: false,
	  	pedantic: false,
	  	sanitize: true,
	  	smartLists: true
	});
	$rootScope.markdown = markdown;
	
	// Events
	/*
	jQuery Dependencies
	- Bootstrap (modal, dropdown, etc)
	- placeholder fallback
	*/
	$scope.jQueryInit = function() {
		setTimeout(function() {
			console.log('jQueryInit');
	        
	        // http://webdesignerwall.com/tutorials/cross-browser-html5-placeholder-text
	        // To Do: rewrite to user angular.jslite - http://docs.angularjs.org/api/angular.element - move to $scope.Modernizr()
	        if(!Modernizr.input.placeholder){
	        	//console.log(angular.element('[placeholder]'));
				$('[placeholder]').focus(function() {
				  var input = $(this);
				  if (input.val() == sinput.attr('placeholder')) {
					input.val('');
					input.removeClass('placeholder');
					if (input.attr('type') == 'password') {	// special case
						
					}
				  }
				}).blur(function() {
				  var input = $(this);
				  if (input.attr('value')) input.attr('value') == '';
				  if (input.val() == '' || input.val() == input.attr('placeholder')) {
					input.addClass('placeholder');
					input.val(input.attr('placeholder'));
					if (input.attr('type') == 'password') {	// special case
						
					}
				  }
				}).blur(); // causes error in IE8 - SCRIPT256
				// clear field on submit - not needed
				/*$('[placeholder]').parents('form').submit(function() {
				  $(this).find('[placeholder]').each(function() {
					var input = $(this);
					if (input.val() == input.attr('placeholder')) {
					  input.val('');
					}
				  })
				});*/
	        
			}
	        
		}, 500); // needed to ensure it load properly
		
		
	};
	
	$scope.Modernizr = function() {
	
		
	}
	
	$scope.$on('$viewContentLoaded', function(event) {
		$scope.jQueryInit();
		$scope.Modernizr();
		// ga - add $window and $location to $inject if adding in
		// use $rootScope.$on('$routeChangeSuccess', ...) or angular-googleanalytics
		//$window._gaq.push(['_trackPageView', $location.path()]);	
		
	});
	$scope.$on('$includeContentLoaded', function(event) {
		$scope.jQueryInit();
		$scope.Modernizr();
	});
	
	// referral param
	// requires $location & $cookies
	if ($location.search()['ref']) $cookies.referral = $location.search()['ref'];
	
	$scope.slideNavBool = -1;
	$scope.slideNav = function(value) {
		console.log(value);
		if (value == 1 || value == -1) $scope.slideNavBool = value;
		else $scope.slideNavBool *= -1;
	}
	
	//!-- App Root Scoope Functions --//
	/*
	$scope.sampleRequest = function(a, b, c, d) {
		var http_config = {
		        'method':'post', // get,head,post,put,delete,jsonp
		        'url':$rootScope.settings.server+'/a/'+a+'/'+b+'/'+encodeURIComponent(c),
		        'data':d
	        },
	        http_callback = function(data) {
	        	
	    	};
		$http(http_config)
			.success(function(data) {
				console.log('sampleRequest.post.success');
				if ($rootScope.checkHTTPReturn(data)) {
					http_callback(data);
				} else { // only if using local alerts and errors
					$scope.alerts = (data.alerts) ? data.alerts : [];
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function() {
				console.log('sampleRequest.post.error');
				$rootScope.http_error();
				$rootScope.offline.que_request(http_config, http_callback);
			});
	};
	*/
	
	
	
	
}
//}]);
