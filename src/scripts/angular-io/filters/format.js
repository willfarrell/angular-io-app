/*global format:true */

angular.module('io.filters')
// phone number {{ value | phone }}
.filter('format', function() {
	return function(string, mask) {
		return format(string, mask || 'w');
	};
})
.filter('phone', function() {
	return function(string, mask) {
		return format(string, mask || '(999) 999-9999 x99999');
	};
});