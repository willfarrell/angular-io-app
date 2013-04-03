angular.module('io.fallback')
.directive('placeholder', ['io.config', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller) {
			// Special case for type=password adds password=true attr
			attrs.$set('password', (attrs.type == 'password'));
			function focus() {
				if (element.val() == attrs.placeholder) {
					element.val('');
					element.removeClass('placeholder');
					if (attrs.password) {
						element[0].type = 'password';
					}
				}
			}
			function blur() {
				if (element.val() == '' || element.val() == attrs.placeholder) {
					element.val(attrs.placeholder);
					element.addClass('placeholder');
					if (attrs.password) {
						element[0].type = 'text';
					}
				}
			}
			element.bind('focus', focus);
			element.bind('blur', blur);
			attrs.$observe('placeholder', blur);
		}
	};
}]);
