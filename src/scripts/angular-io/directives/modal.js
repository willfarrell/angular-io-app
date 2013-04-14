// Bootstrap modal
angular.module('io.directives')
.directive('dismiss', [function() {
	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
		
			function closeModal(e) {
				e.preventDefault();
				
				// hide modal
				var elem = element;
				while (!elem.hasClass('modal')) {
					elem = elem.parent();
				}
				elem.addClass('hide');
				
				// hide backdrop
				angular.element(document.querySelector('.modal-backdrop')).remove();
			}
			
			if (attrs.dismiss === 'modal') {
				element.bind('click', closeModal);
			}
		}
	};
}])
.directive('toggle', [function() {
	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
		
			function openModal(e) {
				e.preventDefault();
				
				// show modal
				var elem = angular.element(document.querySelector(attrs.href));
				elem.removeClass('hide');
				
				// show backdrop
				elem.after('<div class="modal-backdrop"></div>');
			}
			
			if (attrs.toggle === 'modal') {
				element.bind('click', openModal);
			}
		}
	};
}]);