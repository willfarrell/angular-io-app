module.exports = function(config) {
	config.set({
		basePath: '..',
		urlRoot: '/__e2e/',
		hostname: 'localhost',

		frameworks: ['ng-scenario'],
		
		files: [
			'test/lib/window-dialog-commands.js',
			'test/e2e/signupScenario.js',
			'test/e2e/settingsScenario.js',
			//'test/e2e/**/*.js'
		],
		
		reporters: ['progress', 'junit'],
		
		logLevel: config.LOG_INFO,
		
		autoWatch: false,
		
		
		// global config for SauceLabs
		sauceLabs: {
			username: 'jamesbond',
			accessKey: '007',
			startConnect: false,
			testName: 'my unit tests'
		},
		
		// define SL browsers
		customLaunchers: {
			sl_chrome_linux: {
				base: 'SauceLabs',
				browserName: 'chrome',
				//version: '',
				platform: 'linux'
			}
		},
		
		browsers: ['Chrome'],
		
		singleRun: true,
		
		port: 9876,
		proxies: {
			'/': 'http://localhost:8888/' // use port number of localhost apache (MAMP:8888, default:80)
		},
		
		junitReporter: {
			outputFile: 'logs/e2e.xml',
			suite: 'e2e'
		},
		
		plugins: [
			'karma-jasmine',
			'karma-ng-scenario',
			'karma-qunit',
			
			'karma-junit-reporter',
			
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			//'karma-ie-launcher', // doesn't exist
			//'karma-opera-launcher', // doesn't exist
			'karma-phantomjs-launcher',
			'karma-safari-launcher',
			'karma-browserstack-launcher',
			'karma-sauce-launcher',
			'karma-script-launcher'
		]
	});
};