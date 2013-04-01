
// add applicationCache listener
if (!!window.applicationCache) { // Check from Moderizr - pulled out for speed
	// Fired when the manifest resources have been newly redownloaded.
	window.applicationCache.addEventListener('updateready', function() {
		if (window.applicationCache.status == 4) { // window.applicationCache.UPDATEREADY == 4
	      // Browser downloaded a new app cache.
	      // Swap it in and reload the page to get the new version.
	      window.applicationCache.swapCache();
	      if (confirm('A new version of this site is available. Load it?')) {
	      	window.location.reload();
	      }
	    }// else {
	      // Manifest didn't changed. Nothing new yet.
	    //}
	}, false);
}

//(function() {
console.group('Async Load Application');

/*var _gaq=[
  ['_setAccount','UA-XXXXXX-X'],
  //['_setDomainName', '.angularjs.org'],
  ['_trackPageview'],['_trackPageLoadTime']
];

$script('//google-analytics.com/ga.js');
*/
// CDN
var cdnSrc = {
	// ajax.googleapis.com is a slower CDN
    jQuery: 	'//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js', // remove when possible
    Bootstrap: 	'//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min.js', // remove when possible
    AngularJS: 	'//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.5/angular.min.js',
    Modernizr:	'//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js'
    // Shims
};

var cdnFallbackSrc = {
    jQuery: 	'js/vendor/jquery.min.js',
    Bootstrap: 	'js/vendor/bootstrap.min.js',
    AngularJS: 	'js/vendor/angular.min.js',
    Modernizr:	'js/vendor/modernizr.min.js'
    // Shims
};

function modernizrFallback(id) {
	//console.log(id);
	for (var i in id) {
		if (typeof id[i] == 'object') {
			console.group(i);
			modernizrFallback(id[i]);
		} else if (typeof id[i] == 'boolean' && !id[i]) {
			console.log('loadFallback('+i+')');
			$script('js/fallback/'+i+'.js');
		}
	}
	console.groupEnd();
}

function cdnFallback(depsNotFound) {
	var i = depsNotFound.length;
	while (i--) {
		console.log('cdnFallback '+depsNotFound[i]);
		$script(cdnFallbackSrc[depsNotFound[i]], depsNotFound[i]);
	}
}

// js Frameworks & Libraries
$script(cdnSrc.Modernizr, 'Modernizr', function() {
	console.group('Modernizr Fallback');
	
	modernizrFallback(Modernizr);
	bootstrap();
}, cdnFallback);

$script(cdnSrc.jQuery, 'jQuery', function() {
	console.log('jQuery ready');
	
	$script(cdnSrc.Bootstrap, 'Bootstrap', function() {
		console.log('Bootstrap ready');
		bootstrap();
	}, cdnFallback);
}, cdnFallback);

$script(cdnSrc.AngularJS, 'AngularJS', function() {
	console.log('AngularJS ready');
	
	locale = JSON.parse(localStorage.getItem('locale'));
	if (locale) {
		$script('js/vendor/i18n/angular-locale_'+locale+'.js', function() {
			console.log('AngularJS.ngLocale ready');
			//angular.module('ngLocal.us', [])._invokeQueue.push(angular.module('ngLocale')._invokeQueue[0]);
			bootstrap();
		});
	} else {
		bootstrap();
	}
}, cdnFallback);

// App
$script.ready([
	'jQuery',
	'AngularJS'
], function () {
	console.log('Frameworks & Libraries ready');
	
	// needed for main page (core)
	$script('js/app.min.js', function(){
		bootstrap();
	});
	
	// lazy load the rest
});

// Support Functions

// Dependency of bootstrap()
function checkTypeOf(obj_list) {
	var i = obj_list.length,
		j,l,			// for loop
		obj_parts = [],	// used to build nested ref '$.fn.button' -> window['$']['fn']['button']
		obj = {},		// temp obj for building nested ref
		win = window;	// set local ref for speed
	
	while (i--) {
		obj_parts = obj_list[i].split(".");
		obj = win;
		for (j = 0, l = obj_parts.length; j !== l; j++) {
			obj = obj[obj_parts[j]];
			if (typeof obj === 'undefined') return 0;
		}
	}
	return 1;
}

// Dependency of bootstrap()
function hasModule(moduleName) {
  try {
    return angular.module(moduleName);
  } catch (e) {
    return 0;
  }
}

function bootstrap() {
	//console.log('bootstrap');
  	if (checkTypeOf([
  			'Modernizr',
  			'$.fn.dropdown',	// jQuery ($) Then Bootstrap (fn.dropdown)
  			'angular'			// Angular
  		]) && hasModule('app')	// Angular 'app' Ready 
  	) {
  	  	console.groupEnd();
    	angular.bootstrap(document, ['app']);
    }
}


//}());
