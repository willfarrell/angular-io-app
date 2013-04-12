/**
* Adds an ordinal to a number (e.g. 'st', 'nd', 'rd', 'th').
* @author Venkat K (algo)
* @willFarrell (angularJS)
* @see http://www.eggheadcafe.com/community/aspnet/3/43489/hi.aspx
* @param {Number} A positive number.
* @returns a the original number and a ordinal suffix.
* @type String
*/

angular.module('io.filters')
.filter('ordinal', function() {
	return function(num) {
		var n = num % 100;
		var suffix = ['th', 'st', 'nd', 'rd', 'th']; // en
		var ord = n < 21 ? (n < 4 ? suffix[n] : suffix[0]) : (n % 10 > 4 ? suffix[0] : suffix[n % 10]);
		return num + ord;
	};
});