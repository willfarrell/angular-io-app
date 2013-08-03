/*globals
LOG_DISABLE:true, LOG_ERROR:true, LOG_WARN:true, LOG_INFO:true, LOG_DEBUG:true
*/



// Testacular configuration
// http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-testacular.html

module.exports = function(config) {
	config.set({


		// base path, that will be used to resolve files and exclude
		basePath: '..',
		urlRoot: '/src/',
		hostname: 'localhost',

		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'test/lib/angular.js',
			'test/lib/angular-mocks.js',
			
			'src/scripts/app.js',
			'src/scripts/**/*.js',
			'src/components/angular-io/src/scripts/**/*.js',
			
			//'test/unit/**/*.js'
			'test/unit/**/api*.js'
		],
		
		// list of files to exclude
		exclude: [
			'**/_*',
			'src/scripts/app.device.js',
			'src/scripts/appCache.js',
			'src/scripts/async.js'
		],
		
		// use dots reporter, as travis terminal does not support escaping sequences
		// possible values: 'dots', 'progress', 'junit', 'teamcity'
		// CLI --reporters progress
		reporters: ['progress', 'junit'],
		
		junitReporter: {
			outputFile: 'logs/unit.xml',
			suite: 'unit'
		},
		
		// web server port
		// CLI --port 9876
		port: 9876,
		
		// cli runner port
		// CLI --runner-port 9100
		runnerPort: 9100,
		
		// enable / disable colors in the output (reporters and logs)
		colors: true,
		
		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,
		
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,
		
		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - IE (only Windows)
		// - Opera
		// - PhantomJS
		// - Safari
		browsers: ['PhantomJS'],
		
		// If browser does not capture in given timeout [ms], kill it
		// CLI --capture-timeout 5000
		//captureTimeout: 60000;
		
		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false,
		
		//proxies: { '/': 'http://angulario:8888/' },
		
		// report which specs are slower than 500ms
		// CLI --report-slower-than 500
		reportSlowerThan: 500,
		
		// compile coffee scripts
		preprocessors: {
			//'**/*.coffee': 'coffee'
		},
		
		plugins: [
			'karma-jasmine',
			'karma-ng-scenario',
			'karma-qunit',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			//'karma-ie-launcher',
			//'karma-opera-launcher',
			'karma-phantomjs-launcher',
			'karma-script-launcher',
			//'karma-safari-launcher',
			'karma-junit-reporter'
		]
	});
};