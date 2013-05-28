var basePath = '..',
	urlRoot = '/__e2e/',
	hostname = 'localhost',

frameworks = ['ng-scenario'];

files = [
	'test/lib/window-dialog-commands.js',
	'test/e2e/signupScenario.js',
	'test/e2e/settingsScenario.js',
	//'test/e2e/**/*.js'
],

reporters = ['progress', 'junit'],

logLevel = LOG_INFO,

autoWatch = false,

browsers = ['Chrome'],

singleRun = true,

port = 9876,
proxies = {
	'/': 'http://localhost:8888/' // use port number of localhost apache (MAMP:8888, default:80)
},

junitReporter = {
	outputFile: 'logs/e2e.xml',
	suite: 'e2e'
},

plugins = [
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
];