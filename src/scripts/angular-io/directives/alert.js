// Bootstrap alert

angular.module('io.directives')
.directive('dismiss', [function() {

	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
			
			function closeAlert(e) {
				e.preventDefault();
				
				var elem = element;
				while (!elem.hasClass('alert')) {
					elem = elem.parent();
				}
				elem.remove();
			}
			
			if (attrs.dismiss === 'alert') {
				element.bind('click', closeAlert);
			}
		}
	};
}]);