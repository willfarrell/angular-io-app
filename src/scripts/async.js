/*global $script:true, Modernizr:true */

// IE version, undefined if not IE. Used for HTML5 polyfills.
var IE; //@cc_on IE = parseFloat((/MSIE[\s]*([\d\.]+)/).exec(navigator.appVersion)[1]);

//-- applicationCache --//
if (!!window.applicationCache) { // Check from Moderizr - pulled out for speed
	// Fired when the manifest resources have been newly redownloaded.
	window.applicationCache.addEventListener('updateready', function() {
		if (window.applicationCache.status === 4) { // window.applicationCache.UPDATEREADY == 4
	// Browser downloaded a new app cache.
	// Swap it in and reload the page to get the new version.
	window.applicationCache.swapCache();
	// force new version
	alert('A new version of this site is available. Load it?');
	window.location.reload();
	// give option - for large appcache, allow user to complete current task before reload
	//if(confirm('A new version of this site is available. Load it?')) {
	//	window.location.reload();
	//}
		}// else {
	// Manifest didn't changed. Nothing new yet.
		//}
	}, false);
} //else {
	// Add in appCache fallback - https://code.google.com/p/html5-gears/source/browse/trunk/src/html5_offline.js
//}

//(function() {
console.group('Async Load');

//-- Error Detection and Tracking --//// http://errorception.com
var _errs=['5113b3e6bedd207c2b000400'];
$script('//d15qhc0lu1ghnk.cloudfront.net/beacon.js');

// Google Analytics
/*var _gaq=[
  ['_setAccount','UA-XXXXXX-X'],
  //['_setDomainName', '.angulario.com'],
  ['_trackPageview'],['_trackPageLoadTime']
];
$script('//google-analytics.com/ga.js');
*/

// KISSmetrics
/*var _kmq = _kmq || [];
var _kmk = _kmk || 'foo';
$script('//i.kissmetrics.com/i.js');
$script('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
*/

// CDN
var cdnHttp = '//cdnjs.cloudflare.com/ajax/libs/',
	cdnSrc = {
		// ajax.googleapis.com is a slower CDN
		jQuery:cdnHttp+'jquery/1.9.1/jquery.min.js', // remove when possible
		Bootstrap:cdnHttp+'twitter-bootstrap/2.3.1/js/bootstrap.min.js', // remove when possible
		Angular:cdnHttp+'angular.js/1.0.5/angular.min.js',
		Modernizr:	cdnHttp+'modernizr/2.6.2/modernizr.min.js'//,
		// HTML5 Polyfills - https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills
		//JSON3:		cdnHttp+'json3/3.2.4/json3.min.js'//, // add for IE 6-7
		// localStorage IE 6-7
		// HTML5 Sectioning Elements
		//html5shiv:	cdnHttp+'html5shiv/3.6.2/html5shiv.js',	// IE 6-9 - https://github.com/aFarkas/html5shiv
		//'html5shiv-print':	cdnHttp+'html5shiv/3.6.2/html5shiv-printshiv.js' // IE 6-8
	},
	cdnDir = 'js/vendor/',
	cdnFallbackSrc = {
		jQuery:cdnDir+'jquery.min.js',
		Bootstrap:cdnDir+'bootstrap.min.js',
		Angular:cdnDir+'angular.min.js',
		Modernizr:	cdnDir+'modernizr.min.js'
	//,   JSON3:cdnDir+'json3.min.js' // loaded into fallback loop
	//,	html5shiv:cdnDir+'html5shiv.min.js'
	//,	'html5shiv-print':cdnDir+'html5shiv-print.min.js',
	},
	fallbackBool = 0,
	fallbackArray = [];

// Dependency of bootstrap()
function checkTypeOf(obj_list) {
	var i = obj_list.length,
		j,l,			// for loop
		obj_parts = [],	// used to build nested ref '$.fn.button' -> window['$']['fn']['button']
		obj = {},		// temp obj for building nested ref
		win = window;	// set local ref for speed
	while (i--) {
		obj_parts = obj_list[i].split('.');
		obj = win;
		for (j = 0, l = obj_parts.length; j !== l; j++) {
			obj = obj[obj_parts[j]];
			if (typeof obj === 'undefined') { return 0; }
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
		'JSON',				// JSON3 for IE 6-7
		//'html',			// html5shiv
		'Modernizr',
		'$.fn.dropdown',	// jQuery ($) Then Bootstrap (fn.dropdown)
		'angular'			// Angular
		]) && hasModule('app')	// Angular 'app' Ready&& fallbackBool			// Fallback Bool
		) {
		console.groupEnd();
		angular.bootstrap(document, ['app']);
	}
}

function modernizrFallback(id) {
	for (var i in id) {
		if (typeof id[i] === 'object') {
			console.group(i);
			modernizrFallback(id[i]);
		} else if (typeof id[i] === 'boolean' && !id[i]) {
			console.log('loadFallback('+i+')');
			fallbackArray.push(i);
			$script('js/fallback/'+i+'.min.js', i);
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
	console.log('Modernizr ready');
	bootstrap();
}, cdnFallback);

$script(cdnSrc.jQuery, 'jQuery', function() {
	console.log('jQuery ready');
	$script(cdnSrc.Bootstrap, 'Bootstrap', function() {
		console.log('Bootstrap ready');
		bootstrap();
	}, cdnFallback);
}, cdnFallback);

$script(cdnSrc.Angular, 'Angular', function() {
	console.log('Angular ready');
	var locale = JSON.parse(localStorage.getItem('locale'));
	if (locale) {
		$script(cdnDir+'i18n/angular-locale_'+locale+'.js', function() {
			console.log('Angular.ngLocale ready');
			//angular.module('ngLocal.us', [])._invokeQueue.push(angular.module('ngLocale')._invokeQueue[0]);
			bootstrap();
		});
	}
	// App Files
	$script('js/app.min.js', 'App', function(){
		console.log('App ready');
		bootstrap();
	});
}, cdnFallback);

// Polyfills - detect with Modernizr, lazy load Angular modules
// Tests: http://modernizr.github.com/Modernizr/test/
$script.ready(['Modernizr', 'Angular', 'App'], function() {
	console.group('Modernizr Fallback');
	//$script('js/fallback/placeholder.min.js');
	modernizrFallback(Modernizr);
	// Ensure all fallback have had a chance to load before bootstrapping
	$script.ready(fallbackArray, function() {
		fallbackBool = 1;
		bootstrap();
	}, function() {
		fallbackBool = 1;
		bootstrap();
	});
});


//}());
