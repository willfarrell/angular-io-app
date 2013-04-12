/*globals IE:true */

/*
IE 9 Full
IE <=8 Simple (password type not supported) - Error:"Could not get the type property. This command is not supported."
*/
angular.module('io.modernizr')
.directive('placeholder', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {

			// Special case for type=password adds password=true attr
			if (attrs.type === 'password') { attrs.$set('password', true); }
			
			function focus() {
				//console.log('focus');
				if (element.val() === attrs.placeholder && !ngModel.$viewValue) {
					element.val('');
					if (attrs.password) {
						if (!IE || (IE >= 9 && IE < 10)) { element[0].type = 'password'; }
					}
				}
			}
			
			function blur() {
				//console.log('blur');
				if ( (element.val() === '' || element.val() === attrs.placeholder) && !ngModel.$viewValue) {
					element.val(attrs.placeholder);
					if (attrs.password) {
						if (!IE || (IE >= 9 && IE < 10)) { element[0].type = 'text'; }
					}
				}
			}
			
			function keyup(e) {
				//console.log('keypress');
				//console.log(e);
				if (!ngModel.$viewValue) {
					element.addClass('placeholder');
				} else {
					element.removeClass('placeholder');
				}
			}
			
			element.bind('focus', focus);
			element.bind('blur', blur);
			element.bind('keyup', keyup);

			//blur(); // for static strings - doesn't work (needed)
			attrs.$observe('placeholder', blur); // for dynamic strings
			$timeout(keyup,0); // called on model render
		}
	};
}]);
