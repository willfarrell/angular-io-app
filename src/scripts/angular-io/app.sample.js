(function (angular) {

angular.module('io.config', []).value('io.config', {});
angular.module('io.directives', ['io.config', 'io.directive.htmlExtend', 'io.directive.markdown']);
angular.module('io.filters', ['io.config', 'io.filter.format']);
angular.module('io.factories', ['io.config', 'io.factory.accessibility', 'io.factory.follow', 'io.factory.filepicker', 'io.factory.avatarpicker']);

angular.module('io.init', ['io.config', 'io.init.settings', 'io.init.rootScope']);

angular.module('io', ['io.directives', 'io.filters', 'io.factories', 'io.init', 'io.config']);

})(angular);