angular.module('io.init.settings', [])
.run(['$rootScope', function($rootScope) {
	'use strict';
	console.log('io.init.settings ('+$rootScope.$id+')');
	//$rootScope.version = "β.7.5";
	$rootScope.settings = {
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
		// browser plugin - view/page/sign		//'browser': BrowserDetect	// option
	};
	//$rootScope.sliderNav = 1;
}]);