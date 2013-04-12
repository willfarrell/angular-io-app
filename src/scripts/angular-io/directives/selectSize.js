
// <select ng-size="">
angular.module('io.directives')
.directive('ngSize', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller) {

			attrs.$observe('ngSize', function(value) {
				// min size=2, dropdown has size=1
				element[0].size = (value > 1) ? value : 2;
			});
		}
	};
}]);
