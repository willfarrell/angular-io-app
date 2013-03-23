//$script('url', function(){});

var _gaq=[
      ['_setAccount','UA-XXXXXX-X'],
      //['_setDomainName', '.angularjs.org'],
      ['_trackPageview'],['_trackPageLoadTime']
    ];

$script('//google-analytics.com/ga.js');

// CDN
var cdn = {
    jQuery: 	'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
    Bootstrap: 	'//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min.js',
    AngularJS: 	'//ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js'
};
var cdnFallback = {
    jQuery: 	'js/vendor/jquery.min.js',
    Bootstrap: 	'js/vendor/bootstrap.min.js',
    AngularJS: 	'js/vendor/angular.min.js'
};

// js Frameworks & Libraries
$script(cdn.jQuery, 'jQuery', function() {
	console.log('jQuery ready');
	$script(cdn.Bootstrap, 'Bootstrap', function() {
		console.log('Bootstrap ready');
		bootstrap();
	}, function(depsNotFound) { fallback(depsNotFound); });
}, function(depsNotFound) { fallback(depsNotFound); });
$script(cdn.AngularJS, 'AngularJS', function() {
	console.log('AngularJS ready');
	
	locale = JSON.parse(localStorage.getItem('locale'));
	if (locale) $script('js/vendor/i18n/angular-locale_'+locale+'.js', function() {
		console.log('AngularJS.ngLocale ready');
		//angular.module('ngLocal.us', [])._invokeQueue.push(angular.module('ngLocale')._invokeQueue[0]);
		bootstrap();
	});
}, function(depsNotFound) { fallback(depsNotFound); });

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
function fallback(depsNotFound) {
  	depsNotFound.forEach(function(dep) {
		console.log('cdnFallback '+dep);
	  	$script(cdnFallback[dep], dep);
	});
}

function bootstrap() {
	/*console.log('bootstrap');
	console.log(window.$ && 1);
	console.log($.fn.dropdown && 1);
	console.log(angular.bootstrap && 1);
	//console.log(hasModule('ngLocal.') && 1);
	console.log(hasModule('app') && 1);
	console.log($.fn);*/
	
  	if (window.$ && $.fn.dropdown && angular.bootstrap && hasModule('app')) {
  	  	console.log('angular.bootstrap');
    	angular.bootstrap(document, ['app']);
    }
}

function hasModule(moduleName) {
  try {
    return angular.module(moduleName);
  } catch (e) {
    return false;
  }
}
