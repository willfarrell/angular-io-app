/*global format:true */

angular.module('io.directives')
// requires format(str,mask)
// data-input-mask='(999) 999-9999 x999999'
.directive('inputMask', [function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, controller) {
			// view -> model
			element.bind('keyup', function(event) {
				//console.log('inputMask');
				//console.log(element);
				//console.log(attrs);
				//console.log(controller);
				// see ui-keypressHelper
				var shiftPressed = event.shiftKey;
				var keyCode = event.keyCode;
				var cursorPos = element.prop('selectionStart');
				// normalize keycodes
				if (!shiftPressed && keyCode >= 97 && keyCode <= 122) {
					keyCode = keyCode - 32;
				}
				if (keyCode >= 48 && keyCode <= 90) {
					scope.$apply(function() {
						var value = format(controller.$viewValue, attrs.inputMask);
						element.val(value);
						controller.$setViewValue(value.replace(/[^a-zA-Z0-9]+/g,'')); // clean modal var
						// re place caret
						/*if (element.setSelectionRange) {
							element.setSelectionRange(cursorPos, cursorPos);
						} else if (element.createTextRange) {
							var range = element.createTextRange();
							range.collapse(true);
							range.moveEnd('character', cursorPos);
							range.moveStart('character', cursorPos);
							range.select();
						}*/					});
				}
			});
			// model -> view
			controller.$render = function() {
				if (controller.$viewValue) {
					var value = format(controller.$viewValue, attrs.inputMask);
					element.val(value);
					controller.$setViewValue(value.replace(/[^a-zA-Z0-9]+/g,'')); // clean modal var
				}
			};
		}
	};
}]);