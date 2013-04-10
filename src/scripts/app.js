
// AngularIO (io) - ** redo like io and strap (strip out into side project?
angular.module('io.config', []).value('io.config', {});

angular.module('io.controllers', [
	'io.controller.company',
	'io.controller.confirm',
	'io.controller.onboard',
	'io.controller.page',
	'io.controller.reset',
	'io.controller.sign',
	'io.controller.user',
	'io.controller.password'
]);
angular.module('io.directives', ['io.config', 'io.directive.inputMask']); // 'io.directive.htmlExtend'
angular.module('io.factories', ['io.config']);
angular.module('io.filters', ['io.config', 'io.filter.format', 'io.filter.range']);
angular.module('io.fallback', ['io.config']);	// Polyfills for browser fallback
angular.module('io.init', ['io.config', 'io.init.settings', 'io.init.rootScope']); // move to app.?


// io plugings
angular.module('io.follow',			['io.config', 'io.factory.follow']);
angular.module('io.message',		['io.config', 'io.filter.truncate', 'io.factory.message']);
angular.module('io.filepicker',		['io.config', 'io.factory.filepicker']);
angular.module('io.accessibility',	['io.config']);

angular.module('io.plugins',		['io.follow', 'io.message', 'io.filepicker', 'io.accessibility', 'io.markdown']);

angular.module('io', ['io.directives', 'io.factories', 'io.filters', 'io.plugins', 'io.fallback', 'io.init', 'io.config']);

// AngularUI (ui)
angular.module('ui.config', []).value('ui.config', {});
angular.module('ui.directives', ['ui.config']);
angular.module('ui.filters', ['ui.config']);
angular.module('ui', ['ui.directives', 'ui.filters', 'ui.config']);

// AngularStrap ($strap)
angular.module('$strap.config', []).value('$strap.config', {});
angular.module('$strap.filters', ['$strap.config']);
angular.module('$strap.directives', ['$strap.config']);
angular.module('$strap', ['$strap.filters', '$strap.directives', '$strap.config']);

// App (app)
angular.module('app.config', []).value('app.config', {});

angular.module('app.controllers', ['app.config']);
angular.module('app.directives', ['app.config']);
angular.module('app.factories', ['app.config']);
angular.module('app.filters', ['app.config']);

angular.module('app.init', ['app.config', 'app.route']);

var app = angular.module('app', ['ngCookies', 'io', 'ui', '$strap', 'app.directives', 'app.filters', 'app.factories', 'app.init', 'app.config']);
