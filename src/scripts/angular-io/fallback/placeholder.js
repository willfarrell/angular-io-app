/*
IE 9 Full
IE <8 Simple - Error:"Could not get the type property. This command is not supported."
*/
angular.module('io.fallback')
.directive('placeholder', ['io.config', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller) {
			var IE; //@cc_on IE = parseFloat((/MSIE[\s]*([\d\.]+)/).exec(navigator.appVersion)[1]);

			// Special case for type=password adds password=true attr
			attrs.$set('password', (attrs.type === 'password'));
			function focus() {
				if (element.val() === attrs.placeholder) {
					element.val('');
					element.removeClass('placeholder');
					if (attrs.password) {
						if (IE > 8) { element[0].type = 'password'; }
					}
				}
			}
			function blur() {
				if (element.val() === '' || element.val() === attrs.placeholder) {
					element.val(attrs.placeholder);
					element.addClass('placeholder');
					if (attrs.password) {
						if (IE > 8) { element[0].type = 'text'; }
					}
				}
			}
			element.bind('focus', focus);
			element.bind('blur', blur);

			//blur(); // for static strings - doesn't work (needed)
			attrs.$observe('placeholder', blur); // for dynamic strings
			/*if (controller) {
				controller.$render(blur);
			}*/
		}
	};
}]);
