
// AngularIO (io)
angular.module('io.config', []).value('io.config', {
	'client'		:'',				// https://static.domain.com
	'server'		:'',				// https://api.domain.com
	'dashboard'		:'/app',				// app dashboard ie #/app - special button
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
			'angular-io',
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
	// pulgins //
	// onboard - view/onboard
	'onboard':{
		'required'		:true,		// always true
		'start'			:'user'		// ** make smart so not needed
	},
	'follow':'user'
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

// AngularStrap ($strap)
angular.module('$strap.config', []).value('$strap.config', {});
angular.module('$strap.directives', ['$strap.config']);
angular.module('$strap.filters', ['$strap.config']);
angular.module('$strap', ['$strap.directives', '$strap.filters', '$strap.config']);

// App (app)
angular.module('app.config', []).value('app.config', {
	'datepicker':{}
});
angular.module('app.controllers', ['app.config']);
angular.module('app.directives', ['app.config']);
angular.module('app.factories', ['app.config']);
angular.module('app.filters', ['app.config']);

var app = angular.module('app', ['ngCookies', 'io', 'ui', '$strap', 'app.controllers', 'app.directives', 'app.factories', 'app.filters', 'app.config']);
