angular.module('ui.config', []).value('ui.config', {});
angular.module('ui.filters', ['ui.config']);
angular.module('ui.directives', ['ui.config']);
angular.module('ui.bootstrap', ['ui.config']);
angular.module('ui', ['ui.filters', 'ui.directives', 'ui.bootstrap', 'ui.config']);