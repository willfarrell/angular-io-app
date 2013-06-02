/*global syncVar:true, db:true, objectIsEmpty:true, objectLength:true, numberPadding:true, device:true */

angular.module('app')
.run(['app.config', '$rootScope', '$timeout', '$locale', '$cookies', '$http', '$window', '$location',
function(config, $rootScope, $timeout, $locale, $cookies, $http, $window, $location) {
	console.group('app.rootScope (', $rootScope.$id, ')');
	
	// appCache - from outside of angular (appCache.js)
	$rootScope.appCache = $window.appCache;
	$rootScope.$on('appCache', function(e, value) {
		$rootScope.$apply(function(){
			$rootScope.appCache = value;
		});
	});

	// HTML5SHIV
	/*$rootScope.ie8 = function(obj) {
		if (obj.attachEvent) {	// <= IE8
		obj.addEventListener = obj.attachEvent; // event = window.attachEvent ? 'onclick' : 'click';
			}
	}
	$window = $rootScope.ie8($window);*/
	if ($window.attachEvent) {	// <= IE8
		$window.addEventListener = $window.attachEvent; // event = window.attachEvent ? 'onclick' : 'click';
	}

	// watch url change
	$rootScope.$watch(function () {
			return $location.path();
		}, function(value) {
			// antuo scroll to top of page when ng-view doesn't chenge
			document.querySelectorAll('.page')[0].scrollTop = 0;
			//$rootScope.updateSession();

			// clear global alerts and errors on page change
			$rootScope.alerts = [];
			$rootScope.errors = {};
		});

	// referral param
	// requires $location & $cookies
	if ($location.search().ref) { $cookies.referral = $location.search().ref; }
	if ($location.search().redirect) { $cookies.redirect = $location.search().redirect; }

	$rootScope.device= (typeof device !== 'undefined') ? device : false; // cordova active?
	// history tracking - research History API / History.js (22Kb) - migrate?
	$rootScope.history = $window.history; // IE defaultes to 0, rest default to 1

	$rootScope.alerts= [];	// for alert-fixed-top
	$rootScope.errors= {};	// global place holder


	// ********** everything below here will be redone ***
	$rootScope.objectIsEmpty = function(obj) {
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				return false;
			}
		}
		return true;
	};

	$rootScope.objectLength = function(obj) {
		var c = 0;
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				++c;
			}
		}
		return c;
	};

	//!-- Loading Screen --//
	var loader = {
		width:0,
		details:'',
		count:0,
		total:(
			config.i18n['lang'].length+
			config.i18n['lang-locale'].length+
			config.i18n['json'].length+
			//+config['json'].length
			$rootScope.objectLength(config.json)
		)
	};

	$rootScope.$on('loaderEvent', function(e, name) {
		name = name ? name.replace(/[^0-9a-zA-Z]/g, ' ') : '';
		++loader.count;
		console.log(loader.count+' / '+loader.total+' '+name);

		if (loader.count < loader.total) {	// progress bar
			loader.width = ((loader.count / loader.total)*100);
			loader.details = name;
		} else {
			console.groupEnd();
		}
	});
	//!-- End Loading Screen --//

	//!-- Global Vars --//
	$rootScope.set = function(key, value) { $rootScope[key] = value; };
	$rootScope.loading= false;	// nav bar loading indicator
	$rootScope.modal= {};	// for alertModal
	$rootScope.datetime = new Date();
	$rootScope.timezone_min = new Date().getTimezoneOffset();
	$rootScope.i18n = {}; // will be changign to support loading subset of lang files based on needs - lazy loading
	$rootScope.json = {
		'regions':{}
	};


	//!-- JSON -- //
	$rootScope.loadJSON = function(key, file, folder, callback) {
		folder = folder || 'json';
		console.log('loadJSON(', key, file, ')');
		$http.get(''+folder+'/'+file+'.json')
			.success(function(data){
				console.log('loadJSON.get(', folder+'/'+file, ').success');
				//console.log(data);
				//$rootScope.json[config.id] = data;
				$rootScope.$emit('loaderEvent', key);
				if (callback) {
					callback(data);
				} else {
					$rootScope.json[key] = data;
				}
			})
			.error(function(){
				console.log('loadJSON.get(', folder+'/'+file, ').error');
				$rootScope.$emit('loaderEvent', key);
				if (callback) {
					callback(null);
				} else {
					$rootScope.json[key] = null;
				}
			});
	};

	for (var key in config.json) {
		if (config.json.hasOwnProperty(key)) {
			$rootScope.loadJSON(key, config.json[key]);
		}
	}

	//!-- Lang --//
	$rootScope.initLocale = function() {
		//$rootScope.locale= localStorage.getItem('locale');		//$rootScope.locale || ($rootScope.locale = localStorage.setItem('locale', $locale.id));// en-ca
		$rootScope.locale = db.get('locale', $locale.id);
		$rootScope.language = db.get('language', $rootScope.locale.substr(0,2));// en
		db.set('language', $rootScope.language);
		if ($rootScope.locale.length > 2) {
			$rootScope.country_code = $rootScope.locale.substr(3,2).toUpperCase();
			db.set('country_code', $rootScope.country_code);
		} else {
			$rootScope.country_code = db.get('country_code', $locale.id.substr(3,2).toUpperCase());
		}
	};
	$rootScope.saveLocale = function(locale) {
		//localStorage.setItem('locale', locale);
		$cookies.locale = locale;
		db.set('locale', locale);
		$cookies.lang = locale.substr(0,2).toLowerCase();
		db.set('language', $cookies.lang);
		if (locale.length > 2) {
			$cookies.country = locale.substr(3,2).toUpperCase();
			db.set('country_code', $cookies.country);
		}
	};
	$rootScope.changeLocale = function(locale) {
		$rootScope.saveLocale(locale);
		$window.location.reload();
	};
	$rootScope.loadLocaleFile = function(locale, file) {
		console.log('loadLocaleFile(', locale, file, ')');
		$http.get('i18n/'+locale+'/'+file+'.json')
			.success(function(data) {
				console.log('loadLocaleFile.get(', locale+'/'+file, ').success');
				//console.log(data);
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						$rootScope.i18n[key] = data[key];
					}
				}
				$rootScope.i18n.id = locale;
				$rootScope.$emit('loaderEvent', locale);
			})
			.error(function() {
				console.log('loadLocaleFile.get('+locale+'/'+file+').error');
				if (locale.length === 2) { $rootScope.loadLocaleFile(config.i18n['default'], file); }	// load default if root lang doesn't exist
				else { $rootScope.loadLocaleFile(locale.substr(0,2), file); }
			});
	};
	$rootScope.loadLocale = function() {
		console.log('loadLocale()');
		var i,l;
		for (i = 0, l = config.i18n['lang'].length; i < l; i++) {
			//console.log($rootScope.language+'/'+config.i18n['lang'][i]);
			$rootScope.loadLocaleFile($rootScope.language, config.i18n['lang'][i]);
		}
		for (i = 0, l = config.i18n['lang-locale'].length; i < l; i++) {
			//console.log($rootScope.locale+'/'+config.i18n['lang-locale'][i]);
			$rootScope.loadLocaleFile($rootScope.locale, config.i18n['lang-locale'][i]);
		}
		for (i = 0, l = config.i18n['json'].length; i < l; i++) {
			//console.log($rootScope.language+'/'+config.i18n['json'][i]);
			$rootScope.loadJSON(config.i18n['json'][i], $rootScope.language+'/'+config.i18n['json'][i], 'i18n');
		}
	};
	//!-- End Lang --//

	//!-- JSON Special Cases --//
	$rootScope.loadRegions = function(country_code) {
		$rootScope.json.regions = $rootScope.json.regions || {};
		if ($rootScope.json.regions[country_code]) { return; }
		console.log('loadRegions(', country_code, ')');
		$http.get('i18n/'+$rootScope.language+'/geo/'+country_code+'.json')
			.success(function(data){
				console.log('loadRegions.get.success');
				$rootScope.json.regions[country_code] = data;
			})
			.error(function(){
				console.log('loadRegions.get.error');
			});
	};

	$rootScope.initLocale();
	$rootScope.loadLocale($rootScope.locale); // $locale.id == 'en-us'
	$rootScope.saveLocale($rootScope.locale); // save locale
	$rootScope.json.month = $locale.DATETIME_FORMATS.SHORTMONTH;
	// days in a month
	$rootScope.json.day = function(year, month) {
		var day = {};
		if (year && month) {
			for (var i = 1, l = (32 - new Date(year, month, 32).getDate()); i<=l; i++) {
				key = numberPadding(i.toString(), 2);
				day[key] = key;
			}
		}
		return day;
	};
	//!-- End JSON --//
	//!-- Classes --//
	/*$rootScope.loadClass = function(key, _var) {
		console.log('loadClass('+key+')');
		$rootScope[key] = _var;
		$rootScope.$emit('loaderEvent', key);
	};

	for (var key in config['class']) {
		$rootScope.loadClass(key, config['class'][key]);
		//delete key;	// remove from global scope
	}*/
	//!-- End Classes --//

	//!-- Page Functions --//
	// get current uri with leading # **** move to rest??
	$rootScope.uri = function() {
		var uri = ($location.$$url.indexOf('?') === -1) ?
			$location.$$url :
			$location.$$url.substr(0, $location.$$url.indexOf('?')
		);
		return uri;
	};
	// redirect to new page
	$rootScope.href = function(url, open) {
		url = url || '/';
		console.log('href(', url, open, ')');
		if (open) { $window.open(url, '_blank', 'location=yes'); } // http://docs.phonegap.com/en/edge/cordova_inappbrowser_inappbrowser.md.html#InAppBrowser
		// There is a bug where current Ctrla nd next Ctrl loop in loading, only when compressed
		else if (url.substr(0,1) === '#') { $location.url(url.substr(1)); }
		else if (url.substr(0,1) === '/') { $location.url(url); }
		//else if (url.substr(0,1) == '#') $location.path(url.substr(1));
		//else if (url.substr(0,1) == '/') $location.path(url);
		//else if (url.substr(0,1) == '#') $window.location.href = url;
		//else if (url.substr(0,1) == '/') $window.location.href = '#'+url;
		else { $window.location.href = url; }
	};
	// refreshes current page
	$rootScope.refresh = function() {
		$rootScope.href($rootScope.uri()+'?'+(+new Date()));	// ? forces a refresh of user data
	};
	// used by SignCtrl and OnboardCtrl
	$rootScope.redirect = function() {
		console.log('redirect(', $cookies.redirect, ')');
		var redirect = $cookies.redirect || config.dashboard;
		delete $cookies.redirect;
		$rootScope.href(redirect);
	};

	// usecase: <div ng-bind-html-unsafe="renderIframe(item, 'http://url.com')"></div>
	$rootScope.renderIframe = function (name, src) {
		return '<iframe id="' + name + '" src="' + src + '" marginheight="0" marginwidth="0" frameborder="0"></iframe>';
	};



	//!-- End JS Functions --//
}]);
