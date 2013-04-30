
// AngularIO (io)
angular.module('io.config', []).value('io.config', {
	'password':{				// As per OWASP
		'min_length'	:10,
		'min_subset'	:3,
		'min_upper'		:1,
		'min_lower'		:1,
		'min_number'	:1,
		'min_special'	:1,
		'min_other'		:0,
		'max_identical'	:3
	},
	'follow': {
		'type': 'user',
		'tpl': {
			'button':'view/partials/follow.button.html',
			'groups':'view/partials/follow.groups.html',
			'list':'view/partials/follow.list.thumb.html'
		}
	}
});
angular.module('io.controllers', ['io.config']);
angular.module('io.directives', ['io.config']);
angular.module('io.factories', ['io.config']);
angular.module('io.filters', ['io.config']);
angular.module('io.modules', ['io.config']);	// plugins (mix of types)
angular.module('io.modernizr', []);
angular.module('io', ['io.controllers', 'io.directives', 'io.factories', 'io.filters', 'io.modules', 'io.modernizr', 'io.config']);

// AngularUI (ui)
angular.module('ui.config', []).value('ui.config', {});
angular.module('ui.directives', ['ui.config']);
angular.module('ui.filters', ['ui.config']);
angular.module('ui', ['ui.directives', 'ui.filters', 'ui.config']);

angular.module('bs', ['ui.bootstrap.dropdownToggle']);

// AngularStrap ($strap)
angular.module('$strap.config', []).value('$strap.config', {});
angular.module('$strap.directives', ['$strap.config']);
angular.module('$strap.filters', ['$strap.config']);
angular.module('$strap', ['$strap.directives', '$strap.filters', '$strap.config']);

// App (app)
angular.module('app.config', []).value('app.config', {
	'dashboard'		:'#/app',				// app dashboard ie #/app - special button
	//'offline'		:[],		//'class':{							// add in classes at root level ($rootScope.class_name.class_attr)
		//'validate':validate,			// validation (password)
		//'filepicker':filepicker,		// file picker
		//'follow':{},					// follow		//},
	'i18n':{
		'default'	:'en',				// default locale
		'lang'		:[					// array of file names, in lang only folder ie en
			//'countries',				// {'country_code':'country_name'}
			//'languages'				// {'en-ca':'English (Canadian)'}
		],
		'lang-locale':[					// array of file names, in locale folder ie en-ca
			'app'
		],
		// load json files into $rootScope.json[key] = JSON.parse(file);
		'json'		:[						// array of file names, in lang only folder ie en to be placed in a list
			'countries',					// {'country_code':'country_name'}
			'languages',					// {'en-ca':'English (Canadian)'}
			'user_levels'
		],
		'options'	:['en']					// which locales to allow
	},
	'json':{								// load json files into $rootScope.json[key] = JSON.parse(file);
		'calling_codes'	:'calling_codes'	// {'country_code':'calling_code'}
	},
	'account': {
		'user_name'		:false,	// Require username in profile
		'company'		:false,
		'company_username':false
	},
	'password':{				// As per OWASP
		'min_age'		:0,
		'min_timestamp'	:0
	},
	'security': {
		'totp': true
	},
	// pulgins //
	// onboard - view/onboard
	'onboard':{
		'required'		:true,		// always true
		'start'			:'user'		// ** make smart so not needed
	},
	'datepicker':{}
});
angular.module('app.controllers', ['app.config']);
angular.module('app.directives', ['app.config']);
angular.module('app.factories', ['app.config']);
angular.module('app.filters', ['app.config']);
angular.module('app.modules', ['app.config']);

var app = angular.module('app', ['ngCookies', 'io', 'ui', 'bs', '$strap',
	'app.controllers', 'app.directives', 'app.factories', 'app.filters', 'app.modules', 'app.config']);
