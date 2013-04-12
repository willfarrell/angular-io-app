angular.module('io.directives')
.directive('password', ['io.config', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller) {
			/*
			This will insert an eye icon to the right of the field
			onclickdown it will show the contents
			onclickup it will rehide the contents
			note IE8 does not allow the change of element type
			*/
			// Special case for type=password adds password=true attr
			/*attrs.$set('password', (attrs.type === 'password'));
			function focus() {
				if (element.val() === attrs.placeholder) {
					element.val('');
					element.removeClass('placeholder');
					if (attrs.password) {
						element[0].type = 'password';
					}
				}
			}
			function blur() {
				if (element.val() === '' || element.val() === attrs.placeholder) {
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
			*/
		}
	};
}]);
