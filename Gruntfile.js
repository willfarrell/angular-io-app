'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
	return connect['static'](require('path').resolve(dir));
};

module.exports = function(grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').concat(['gruntacular']).forEach(grunt.loadNpmTasks);
	// configurable paths
	var yeomanConfig = {
		app:	'src',
		dist:	'dist',
		web:	'dist-web', // only static, for CDN
		api:	'dist-api', // web service
		phonegap:'dist-phonegap',	// only static, for phonegap
		splashcolor:'white'		// phonegap splash screen background color
	};
	grunt.initConfig({
		yeoman: yeomanConfig,
		pkg: grunt.file.readJSON('package.json'),
		jshintrc: grunt.file.readJSON('.jshintrc'),
		/*watch: {
			coffee: {
				files: ['<%= yeoman.app %>/scripts/*.coffee'],
				tasks: ['coffee:dist']
			},
			coffeeTest: {
				files: ['test/spec/*.coffee'],
				tasks: ['coffee:test']
			},
			compass: {
				files: ['<%= yeoman.app %>/styles/*.{scss,sass}'],
				tasks: ['compass']
			},
			livereload: {
				files: [
					'<%= yeoman.app %>/*.html',
					'{.tmp,<%= yeoman.app %>}/styles/*.css',
					'{.tmp,<%= yeoman.app %>}/scripts/*.js',
					'<%= yeoman.app %>/images/*.{png,jpg,jpeg}'
				],
				tasks: ['livereload']
			}
		},
		connect: {
			options: {
				port: 9000
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, '<%= yeoman.app %>')
						];
					}
				}
			},
			test: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'test')
						];
					}
				}
			},
			dist: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, '<%= yeoman.dist %>')
						];
					}
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= connect.options.port %>'
			}
		},
		mocha: {
			all: {
				options: {
					run: true,
					urls: ['http://localhost:<%= connect.options.port %>/index.html']
				}
			}
		},
		coffee: {
			dist: {
				files: {
					'.tmp/scripts/coffee.js': '<%= yeoman.app %>/scripts/*.coffee'
				}
			},
			test: {
				files: [{
					expand: true,
					cwd: '.tmp/spec',
					src: '*.coffee',
					dest: 'test/spec'
				}]
			}
		},
		compass: {
			options: {
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '.tmp/styles',
				imagesDir: '<%= yeoman.app %>/images',
				javascriptsDir: '<%= yeoman.app %>/scripts',
				fontsDir: '<%= yeoman.app %>/styles/fonts',
				importPath: 'app/components',
				relativeAssets: true
			},
			dist: {},
			server: {
				options: {
					debugInfo: true
				}
			}
		},*/
		less: {
			dev: {
				options: {
					paths: ['<%= yeoman.app %>/styles/less/']
				},
				files: {
					'<%= yeoman.app %>/styles/bootstrap.css': '<%= yeoman.app %>/styles/less/bootstrap.less'
				}
			}
		},
		csscss: {
			options: {
				colorize: false,
				verbose: true,
				outputJson: false,
				minMatch: 2,
				compass: true,
				ignoreProperties: 'padding',
				ignoreSelectors: '.rule-a'
			},
			dist: {
				//src: ['<%= yeoman.app %>/styles/**/*.css']
				src: ['<%= yeoman.app %>/styles/styles.css']
			}
		},
		clean: {
			dist: ['.tmp', '<%= yeoman.dist %>/*'],
			deploy: ['<%= yeoman.web %>', '<%= yeoman.api %>'],//'<%= yeoman.dist %>/img/user/*', '<%= yeoman.dist %>/img/company/*',			phonegap: ['<%= yeoman.phonegap %>', 'build.phonegap.zip'],
			server: '.tmp'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/**/*.js',
					'!<%= yeoman.app %>/scripts/script.js',
					'!<%= yeoman.app %>/scripts/angular-io/plugins/browser/*.js',
					'!<%= yeoman.app %>/scripts/modernizr.js',
				'test/spec/*.js'
			]
		},
		htmllint: {
			dist: [
				'<%= yeoman.app %>/**/*.html',
				'!<%= yeoman.app %>/components/'
			]
		},
		// not used since Uglify task does concat,
		// but still available if needed
		/*concat: {
			options: {
				stripBanners: true
			//	banner: '/ <%= baz %> /\n' // '/ abcde /\n'
			},
			dist: {
				src: ['<%= yeoman.dist %>/app.min.js'],
				dest: 'dist/built.js'
			}
		},*/
		uglify: {
			options: {
				preserveComments: 'some' // preserve !, @cc_on for IE var in scripts/async.js
			},
			// fallback scripts
			'<%= yeoman.dist %>/js/fallback/json.min.js':		'<%= yeoman.app %>/components/json3/lib/json3.min.js',
			//'<%= yeoman.dist %>/js/fallback/_.js':'<%= yeoman.app %>/scripts/angular-io/fallback/_.js', // .htaccess catch
			'<%= yeoman.dist %>/js/fallback/placeholder.min.js':'<%= yeoman.app %>/scripts/angular-io/modernizr/placeholder.js',
			'<%= yeoman.dist %>/js/fallback/reveal.min.js':'<%= yeoman.app %>/scripts/angular-io/modernizr/reveal.js'
		},
		useminPrepare: {
			html: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/index.web.html', '<%= yeoman.app %>/index.device.html'],
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		usemin: {
			html: ['<%= yeoman.dist %>/*.html'],
			css: ['<%= yeoman.dist %>/styles/*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		},
		rev: {
			options: {
				algorithm: 'md5',
				length: 4
			},
			assets: {
				files: [{
					src: [
						//'<%= yeoman.dist %>/img/**/*.{jpg,jpeg,gif,png,webp}',
						//'<%= yeoman.dist %>/js/**/*.js', '!<%= yeoman.dist %>/js/vendor/**/*.js'
						'<%= yeoman.dist %>/css/**/*.css'
						//'**/*.{eot,svg,ttf,woff}'
					]
				}]
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/img',
					src: ['**/*.{png,jpg,jpeg}', '!company/*.{png,jpg,jpeg}', '!user/*.{png,jpg,jpeg}'],
					dest: '<%= yeoman.dist %>/img'
				}]
			}
		},
		'imagemagick-convert':{	// {16,32,64,128,256} not supported
			// favicon
			'favicon-256':{
				args:['./files/icon.png','-background', 'none', '-resize', '256x256', 'files/build/favicon/icon-256.png']
			},
			'favicon-128':{
				args:['./files/icon.png','-background', 'none', '-resize', '128x128', 'files/build/favicon/icon-128.png']
			},
			'favicon-64':{
				args:['./files/icon.png','-background', 'none', '-resize', '64x64', 'files/build/favicon/icon-64.png']
			},
			'favicon-32':{
				args:['./files/icon.png','-background', 'none', '-resize', '32x32', 'files/build/favicon/icon-32.png']
			},
			'favicon-16':{
				args:['./files/icon.png','-background', 'none', '-resize', '16x16', 'files/build/favicon/icon-16.png']
			},
			'favicon':{
				args:[
					'./files/build/favicon/icon-16.png',
					'./files/build/favicon/icon-32.png',
					'./files/build/favicon/icon-64.png',
					'./files/build/favicon/icon-128.png',
					'./files/build/favicon/icon-256.png',
					'-colors', '256', 'files/build/favicon.ico']
			},
			// fluidicon
			'fluidicon':{
				args:['./files/icon.png','-background', 'none', '-resize', '512x512', 'files/build/fluidicon.png']
			},
			// phonegap icons
			'icon':{
				args:['./files/icon.png','-background', 'none', '-resize', '128x128', 'files/build/icon.png']
			},
			'icon-android-ldpi':{
				args:['./files/icon.png','-background', 'none', '-resize', '36x36', 'files/build/icon/android/icon-36-ldpi.png']
			},
			'icon-android-mdpi':{
				args:['./files/icon.png','-background', 'none', '-resize', '48x48', 'files/build/icon/android/icon-48-mdpi.png']
			},
			'icon-android-hdpi':{
				args:['./files/icon.png','-background', 'none', '-resize', '72x72', 'files/build/icon/android/icon-72-hdpi.png']
			},
			'icon-android-xhdpi':{
				args:['./files/icon.png','-background', 'none', '-resize', '96x96', 'files/build/icon/android/icon-96-xhdpi.png']
			},
			'icon-blackberry-80':{
				args:['./files/icon.png','-background', 'none', '-resize', '80x80', 'files/build/icon/blackberry/icon-80.png']
			},
			'icon-ios-57':{
				args:['./files/icon.png','-background', 'none', '-resize', '57x57', 'files/build/icon/ios/icon-57.png']
			},
			'icon-ios-72':{
				args:['./files/icon.png','-background', 'none', '-resize', '72x72', 'files/build/icon/ios/icon-72.png']
			},
			'icon-ios-57-2x':{
				args:['./files/icon.png','-background', 'none', '-resize', '114x114', 'files/build/icon/ios/icon-57-2x.png']
			},
			'icon-ios-72-2x':{
				args:['./files/icon.png','-background', 'none', '-resize', '144x144', 'files/build/icon/ios/icon-72-2x.png']
			},
			'icon-webos-64':{
				args:['./files/icon.png','-background', 'none', '-resize', '64x64', 'files/build/icon/webos/icon-64.png']
			},
			'icon-winphone-48':{
				args:['./files/icon.png','-background', 'none', '-resize', '48x48', 'files/build/icon/winphone/icon-48.png']
			},
			'icon-winphone-62':{
				args:['./files/icon.png','-background', 'none', '-resize', '62x62', 'files/build/icon/winphone/icon-62-tile.png']
			},
			'icon-winphone-173':{
				args:['./files/icon.png','-background', 'none', '-resize', '173x173', 'files/build/icon/winphone/icon-173-tile.png']
			},
			// phonegap splash
			'splash':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '128x128', '-extent', '225x225','files/build/splash.png']
			},
			'splash-android-xhdpi-landscape':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '512x512', '-extent', '1280x720','files/build/splash/android/xhdpi-landscape.png']
			},
			'splash-android-hdpi-portrait':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '480x800','files/build/splash/android/hdpi-portrait.png']
			},
			'splash-android-ldpi-landscape':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '128x128', '-extent', '320x200','files/build/splash/android/ldpi-landscape.png']
			},
			'splash-android-xhdpi-portrait':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '512x512', '-extent', '720x1280','files/build/splash/android/xhdpi-portrait.png']
			},
			'splash-android-mdpi-portrait':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '320x480','files/build/splash/android/mdpi-portrait.png']
			},
			'splash-android-mdpi-landscape':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '480x320','files/build/splash/android/mdpi-landscape.png']
			},
			'splash-android-ldpi-portrait':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '128x128', '-extent', '200x320','files/build/splash/android/ldpi-portrait.png']
			},
			'splash-android-hdpi-landscape':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '800x480','files/build/splash/android/hdpi-landscape.png']
			},
			'splash-blackberry':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '128x128', '-extent', '225x225','files/build/splash/blackberry/splash.png']
			},
			'splash-ios-iphone-portrait':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '320x480','files/build/splash/ios/iphone-portrait.png']
			},
			'splash-ios-iphone-landscape-2x':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '960x640','files/build/splash/ios/iphone-landscape-2x.png']
			},
			'splash-ios-iphone-landscape':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '480x320','files/build/splash/ios/iphone-landscape.png']
			},
			'splash-ios-ipad-portrait':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '512x512', '-extent', '768x1004','files/build/splash/ios/ipad-portrait.png']
			},
			'splash-ios-ipad-portrait-2x':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '1024x1024', '-extent', '1536x2008','files/build/splash/ios/ipad-portrait-2x.png']
			},
			'splash-ios-ipad-landscape':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '512x512', '-extent', '1024x783','files/build/splash/ios/ipad-landscape.png']
			},
			'splash-ios-iphone-portrait-2x':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '640x960','files/build/splash/ios/iphone-portrait-2x.png']
			},
			'splash-ios-ipad-landscape-2x':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '1024x1024', '-extent', '2008x1536','files/build/splash/ios/ipad-landscape-2x.png']
			},
			'splash-webos':{
				args:['./files/icon.png', '-resize', '64x64', 'files/build/splash/webos/splash.png']
			},
			'splash-winphone':{
				args:['./files/icon.png','-background', '<%= yeoman.splashcolor %>', '-gravity', 'center',
				'-resize', '256x256', '-extent', '480x800','files/build/splash/winphone/splash.png']
			}
		},
		/*webfont: {
			icons: {
				src: 'files/webfont/*.svg',
				dest: '<%= yeoman.dist %>/fonts',
				destCss: '<%= yeoman.dist %>/css',
				stylesheet: 'bootstrap',
				options: {
					font: 'ponies'
				}
			}
		},*/
		cssmin: {
			dist: {
				files: {}
			}
		},
		htmlmin: {
			dist: {
				options: {
					/*removeComments: true,
					removeCommentsFromCDATA: true,
					//removeCDATASectionsFromCDATA: true,
					//collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					//removeRedundantAttributes: true,
					useShortDoctype: true,
					//removeEmptyAttributes: true,
					removeOptionalTags: true
					//removeEmptyElements:false*/
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: ['*.html', 'view/**/*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			},
			minify: {
				options: {
					removeComments: true,
					removeCommentsFromCDATA: true,
					removeCDATASectionsFromCDATA: true,
					collapseWhitespace: true,
					collapseWhitespaceToOne: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					//removeRedundantAttributes: false, // removes type='text' from <input> causes style issues in bootstrap
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeOptionalTags: false,	// XHTML Requires All Closing Tags (IE 8)
					removeEmptyElements:false	// Doesn't really work for angular apps
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html'],//, 'view/**/*.html'
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		copy: {
			dist: {
				files: [
					{
						src: '<%= yeoman.dist %>/index.web.html',
						dest: '<%= yeoman.dist %>/index.html'
					},
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.app %>',
						dest: '<%= yeoman.dist %>',
						src: [
							'*.{txt,xml,appcache,php}',	// boilerplate
							'.htaccess',				// apache
							'img/**/*.{ico,svg,gif}',	// non-compress imags
							'font/*.{eot,ttf,woff,otf}',
							'css/**/*.css',
							'{i18n,json}/**/*.json',
							'php/**/*.php'
						]
					},
					// component font-awesome fonts (build)
					{
						expand: true,
						cwd:'<%= yeoman.app %>/components/font-awesome/build',
						src: [
							'**/*.{eot,ttf,woff,otf}'
						],
						dest: '<%= yeoman.dist %>/css'
					},
					/*{
						expand: true,
						cwd:'<%= yeoman.app %>/components/jquery',
						src: ['jquery.min.js'],
						dest: '<%= yeoman.dist %>/js/vendor'
					},*/
					{
						expand: true,
						cwd:'<%= yeoman.app %>/components/json3/libs',
						src: ['json3.min.js'],
						dest: '<%= yeoman.dist %>/js/vendor'
					},
					{
						expand: true,
						cwd:'<%= yeoman.app %>/components/angular-complete',
						src: ['angular.min.js', 'i18n/*.js'],
						dest: '<%= yeoman.dist %>/js/vendor'
					}
				]
			},
			web: {
				files: [
					{
						src: '<%= yeoman.dist %>/index.web.html',
						dest: '<%= yeoman.web %>/index.html'
					},
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.dist %>',
						dest: '<%= yeoman.web %>',
						src: [
							'*.{txt,appcache}',	// boilerplate
							'crossdomain.xml',
							'.htaccess',				// apache
							'view/**/*.html',
							'img/*',
							'font/*',
							'css/**/*.css',
							'js/**/*.js',
							'{i18n,json}/**/*.json'
						]
					},
					{
						expand: true,
						dot: true,
						cwd: 'files/build',
						dest: '<%= yeoman.web %>',
						src: [
							'favicon.ico',
							'favicon/*.png',
							'fluidicon.png',
							'icons/**/*.png'
						]
					}
				]
			},
			api: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.dist %>',
					dest: '<%= yeoman.api %>',
					src: [
						'.htaccess',
						'**/*.php',
						'json/**/*.json'
					]
				}]
			},
			phonegap: {
				files: [
					{
						src: '<%= yeoman.dist %>/index.device.html',
						dest: '<%= yeoman.phonegap %>/index.html'
					},
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.dist %>',
						dest: '<%= yeoman.phonegap %>',
						src: [
							'config.xml',	// boilerplate
							'css/**/*.css',
							'img/*',
							'js/**/*.js',
							'view/**/*.html',
							'{i18n,json}/**/*.json'
						]
					},
					{
						expand: true,
						dot: true,
						cwd: 'files/build',
						dest: '<%= yeoman.phonegap %>',
						src: [
							'icons.png',
							'icons/**/*.png'
						]
					},
					{
						expand: true,
						dot: true,
						cwd: 'files/build',
						dest: '<%= yeoman.phonegap %>',
						src: [
							'splash.png',
							'splash/**/*.png'
						]
					}
				]
			}
		},
		replace: {
			jslint: {
				options: {
					replacements: [
						{	// Clean "Trailing whitespace"
							pattern: /[ \t]+[\n\r]/g,
							replacement: '\n'
						},
						{	// Clean "Mixed spaces and tabs" - All spaces
							pattern: /[ ]{4}/g,
							replacement: '\t'
						},
						{	// Clean "Mixed spaces and tabs" - Pre Mix
							pattern: /[ ]{1,3}\t+/g,
							replacement: ''
						},
						{	// Clean "Mixed spaces and tabs" - Post Mix
							pattern: /\t+[ ]{1,3}/g,
							replacement: '\t'
						}/*,
						{	// Clean "Extra comma" - Has trailing single-line comment check
							pattern: /,(\s*(\/\/.*)[\n\r]\s*[\]\}]+)/g,
							replacement: '$1' // requires "
						}*/
						// "A regular expression literal can be confused with '/='" - Use /\=
					]
				},
				files: [
					{
						expand: true,
						dot: true,
						cwd: '',
						dest: '',
						src: [
							'*.js',
							'<%= yeoman.app %>/scripts/**/*.js'
						]
					}
				]
			},
			dist: {
				options: {
					// grunt-string-replace
					replacements: [
						{
							pattern: '{{version}}',
							replacement: '<%= pkg.version %>'
						},
						{
							pattern: '{{date}}',
							replacement: '<%= new Date().toString() %>'
						},
						{
							pattern: '{{timestamp}}',
							replacement: '<%= new Date().getTime() %>'
						}
					]
				},
				files: [
					{
						src: ['<%= yeoman.dist %>/manifest.appcache'],
						dest: '<%= yeoman.dist %>/manifest.appcache'
					},
					{
						src: ['<%= yeoman.dist %>/humans.txt'],
						dest: '<%= yeoman.dist %>/humans.txt'
					},
					{
						src: ['<%= yeoman.dist %>/view/footer.html'],
						dest: '<%= yeoman.dist %>/view/footer.html'
					}
				]
			},
			cssmin: {
				options: {
					replacements: [
						// removes /*! ---- */ banner comments for max compression
						{
							pattern: /\/\*([\s\S]*?)\*\//g,
							replacement: ''
						},
						// Remove query strings from static resources ie ?v=3.0.1
						{
							pattern: /\?[\w=\.]+/g,
							replacement: ''
						}
					]
				},
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.dist %>',
						dest: '<%= yeoman.dist %>',
						src: ['css/**/*.css']
					}
				]
			},
			// remove all console function calls - production only (call before uglify)
			jsmin: {
				options: {
					replacements: [
						// remove all console functions
						{
							pattern: /console\.[\w]+\((.*)\);/g,
							replacement: ''
						}
					]
				},
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.dist %>',
						dest: '<%= yeoman.dist %>',
						src: [
							'js/**/*.js', '!js/vendor/*.js'
						]
					}
				]
			},
			inline: {
				options: {
					replacements: [
						{
							pattern: '<script src="js/async.min.js"></script>',
							replacement: '<script><%= grunt.file.read(yeoman.dist+\'/js/async.min.js\') %></script>'
						},
						{
							pattern: '<script src="js/appCache.min.js"></script>',
							replacement: '<script><%= grunt.file.read(yeoman.dist+\'/js/appCache.min.js\') %></script>'
						}
					]
				},
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.dist %>',
						dest: '<%= yeoman.dist %>',
						src: [
							'*.html'
						]
					}
				]
			}
		},
		compress: {
			phonegap: {
				options: {
					archive:'build.phonegap.zip',
					pretty:true
				},
				files: [
					{
						src: ['<%= yeoman.phonegap %>/*'],
						dest: ''
					}
				]
			}
		},
		/*'closure-compiler': {
			dist: {
			closurePath: '/usr/local/opt/closure-compiler/libexec', // brew --prefix closure-compiler # + /libexec
			js: '<%= yeoman.dist %>/js/app.min.js',
			jsOutputFile: '<%= yeoman.dist %>/js/app.min.cc.js',
			options: {
				compilation_level: 'SIMPLE_OPTIMIZATIONS',
				language_in: 'ECMASCRIPT5_STRICT'
			}
			}
		},*/
		manifest: {
			generate: {
				options: {
					basePath: '<%= yeoman.dist %>/',
					cache: [
						//'//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js',
						//'//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min.js',
						'//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.5/angular.min.js',
						'//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js'
					],
					//network: ['http://*', 'https://*'],
					//fallback: ['/js/fallback/ /js/fallback/_js'],
					exclude: [
						'index.web.html',
						'index.device.html',

						'js/async.min.js',
						'js/appCache.min.js',
						'js/vendor/*',
						'js/device.min.js'
					],
					preferOnline: true,
					verbose: true,
					timestamp: true
				},
				src: [
					// load top level html files
					//'*.html', // don't cache index.html ever (Best Practice) - can prevet offline reload
					'view/*.html', //'view/**/*.html',
					//'favicon.ico',
					'js/**/*.js',
					'!js/fallback/*.js',	// covered by CDNs
					'!js/vendor/**/*.js',
					'css/**/*.css',
					//'font/*.{eot,ttf,woff,otf}', // fonts are too big
					'{i18n,json}/**/*.json', '!i18n/en/geo/*.json'
				],
				dest: '<%= yeoman.dist %>/manifest.appcache'
			}
		},
		sitemap: {
			dist: {
				siteRoot: '<%= yeoman.dist %>/'//,
				//homepage: ''//
				//changefreq: 'daily'
				//priority: '0.5'
			}
		}/*,
		bower: {
			dir: '<%= yeoman.app %>/components',
			//rjsConfig: '<%= yeoman.app %>/scripts/main.js',
			indent: '	'
		}*/
	});
	grunt.renameTask('regarde', 'watch');

	grunt.renameTask('string-replace', 'replace');
	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['open', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'coffee:dist',
			'compass:server',
			'livereload-start',
			'connect:livereload',
			'open',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'coffee',
		'compass',
		'connect:test',
		'mocha'
	]);
	// generate all icon files from icon.png
	grunt.registerTask('icon_convert', [
		'favicon_convert',
		'imagemagick-convert:fluidicon',
		'phongap_icon_convert',
		'phongap_splash_convert'
	]);
	// generate favicons
	grunt.registerTask('favicon_convert', [
		'imagemagick-convert:favicon-256',
		'imagemagick-convert:favicon-128',
		'imagemagick-convert:favicon-64',
		'imagemagick-convert:favicon-32',
		'imagemagick-convert:favicon-16',
		'imagemagick-convert:favicon'
		//'imagemin:favicon' // already optimized
	]);
	// generate phonegap icons and splash screens
	grunt.registerTask('phongap_icon_convert', [
		'imagemagick-convert:icon',
		'imagemagick-convert:icon-android-ldpi',
		'imagemagick-convert:icon-android-mdpi',
		'imagemagick-convert:icon-android-hdpi',
		'imagemagick-convert:icon-android-xhdpi',
		'imagemagick-convert:icon-blackberry-80',
		'imagemagick-convert:icon-ios-57',
		'imagemagick-convert:icon-ios-72',
		'imagemagick-convert:icon-ios-57-2x',
		'imagemagick-convert:icon-ios-72-2x',
		'imagemagick-convert:icon-webos-64',
		'imagemagick-convert:icon-winphone-48',
		'imagemagick-convert:icon-winphone-62',
		'imagemagick-convert:icon-winphone-173'
		//'imagemin:phonegap' // already optimized
	]);
	grunt.registerTask('phongap_splash_convert', [
		'imagemagick-convert:splash',
		'imagemagick-convert:splash-android-xhdpi-landscape',
		'imagemagick-convert:splash-android-hdpi-portrait',
		'imagemagick-convert:splash-android-ldpi-landscape',
		'imagemagick-convert:splash-android-xhdpi-portrait',
		'imagemagick-convert:splash-android-mdpi-portrait',
		'imagemagick-convert:splash-android-mdpi-landscape',
		'imagemagick-convert:splash-android-ldpi-portrait',
		'imagemagick-convert:splash-android-hdpi-landscape',
		'imagemagick-convert:splash-blackberry',
		'imagemagick-convert:splash-ios-iphone-portrait',
		'imagemagick-convert:splash-ios-iphone-landscape-2x',
		'imagemagick-convert:splash-ios-iphone-landscape',
		'imagemagick-convert:splash-ios-ipad-portrait',
		'imagemagick-convert:splash-ios-ipad-portrait-2x',
		'imagemagick-convert:splash-ios-ipad-landscape',
		'imagemagick-convert:splash-ios-iphone-portrait-2x',
		'imagemagick-convert:splash-ios-ipad-landscape-2x',
		'imagemagick-convert:splash-webos',
		'imagemagick-convert:splash-winphone'
		//'imagemin:phonegap' // already optimized
	]);
	// seperate web and api for deploymen
	grunt.registerTask('deploy', [
		'clean:deploy',
		'copy:web',
		'copy:api'
	]);
	// build phonegap ready
	grunt.registerTask('phonegap', [
		'clean:phonegap',
		'copy:phonegap',
		'compress:phonegap'
	]);

	grunt.registerTask('build', [
		
		// Dev
		//'replace:jslint',
		'jshint',
		//'test',
		//'coffee',
		//'compass:dist',
		'less:dev',
		
		// Setup
		'clean:dist',
		'useminPrepare',
		'concat',
		'replace:cssmin',	// remove banners
		'imagemin:dist',
		'cssmin',
		'htmlmin:dist',
		'copy:dist',
		//'replace:jsmin',	// remove console fct calls - prod only
		'uglify',
			//'closure-compiler',	// Warning: Object #<Object> has no method 'expandFiles' 2013-02-15
			//'ngmin',				// make a larger file 2013-02-15
		'replace:dist',
		'rev',
		'usemin',
		'replace:inline',
		'htmlmin:minify',
		'manifest',
		'clean:deploy'
	]);
	grunt.registerTask('lint', [
		//'htmllint',	// not the best for angular
		'replace:jslint',
		'jshint'
	]);

	grunt.registerTask('default', ['build']); // , 'deploy', 'phonegap'
};
