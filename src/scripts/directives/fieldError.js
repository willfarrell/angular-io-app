/*
<span class="help-block error" data-ng-show="form.FIELD_ID.$error.server">Fixed Error String</span>
*/
angular.module('io.directives')
.directive('fieldError', ['$rootScope', function($rootScope) {
	var original = null,
		error = null;
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, controller) {
			/*
			console.log(scope);
			console.log(element);
			console.log(attrs);
			console.log(controller);
			*/

			function check() {
				var value = controller.$modelValue,
					err_msg = $rootScope.errors[attrs.fieldError];
				// initial set
				if (original === null || (err_msg && error !== err_msg)) {
					//console.log('set', original, err_msg, error)
					original = value;
					error = err_msg;
				}
				
				//console.log(original, '==', value, 'error:', error);
				if (original === value && error) { //console.log('add error back in');
					$rootScope.errors[attrs.fieldError] = error;
					scope.form[attrs.fieldError].$error.server = true;
					scope.form.$invalid =  true;
				} else if (err_msg) { //console.log('delete');
					delete $rootScope.errors[attrs.fieldError];
					scope.form[attrs.fieldError].$error.server = false;
					scope.form.$invalid = !scope.form.$valid; // reset to original value
				}
				
				$rootScope.$digest(); // update $rootScope.errors change to view
			}
			
			element.bind('keydown', check);
			element.bind('keyup', check);
			//attrs.$observe('ngModel', check);
		}
	};
}]);
