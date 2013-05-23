/*globals
LOG_DISABLE:true, LOG_ERROR:true, LOG_WARN:true, LOG_INFO:true, LOG_DEBUG:true
*/

// Testacular configuration
// http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-testacular.html

// base path, that will be used to resolve files and exclude
var basePath = '..',
	urlRoot = '/src/',

frameworks = ['jasmine'], // 'requirejs' for ANGULAR_SCENARIO:true, ANGULAR_SCENARIO_ADAPTER:true,

// list of files / patterns to load in the browser
files = [
 	'test/lib/angular.js',
 	'test/lib/angular-mocks.js',
 	
 	'src/scripts/app.js',
 	'src/components/angular-io/src/scripts/**/*.js',
 	'src/scripts/**/*.js',
	'test/unit/**/*.js'
],

// list of files to exclude
exclude = [
	'**/_*',
	'src/scripts/script.js',
	'src/scripts/async.js',
	'src/scripts/appCache.js',
],

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots', 'progress', 'junit', 'teamcity'
// CLI --reporters progress
reporters = ['progress', 'junit'],

junitReporter = {
	// will be resolved to basePath (in the same way as files/exclude patterns)
	outputFile: 'test-results.xml'
},

// web server port
// CLI --port 9876
port = 9876,

// cli runner port
// CLI --runner-port 9100
runnerPort = 9100,

// enable / disable colors in the output (reporters and logs)
colors = true,

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO,

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false,

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'],

// If browser does not capture in given timeout [ms], kill it
// CLI --capture-timeout 5000
//captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false,

//proxies = { '/': 'http://angulario:8888/' },

// report which specs are slower than 500ms
// CLI --report-slower-than 500
reportSlowerThan = 500,

// compile coffee scripts
preprocessors = {
	//'**/*.coffee': 'coffee'
},

plugins = [
	'karma-jasmine',
	'karma-chrome-launcher',
	'karma-firefox-launcher',
	//'karma-opera-launcher',
	//'karma-safari-launcher',
	'karma-phantomjs-launcher',
	'karma-script-launcher',
	'karma-junit-reporter'
];
