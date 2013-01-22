// Requires accounting.js
angular.module('io.filter.currency', [])
.filter('currency', function () {
	return function(number, symbol, precision, thousand, decimal, format) {
		return accounting.formatMoney(number, symbol, precision, thousand, decimal, format);
	};
});