angular.module('io.filters')
// http://danielcsgomes.com/tutorials/how-to-create-a-custom-filter-with-angularjs-v1/
.filter('range', function() {
	return function(input, start, end, step) {
		if (isNaN(end)) {
			end = start;
			start = 0;
		}
		if (isNaN(step)) {
			step = 1;
		}
		start = parseInt(start, 10);
		end = parseInt(end, 10);
		// flip start/end
		if (start > end) {
			var tmp = start;
			start = end;
			end = tmp;
		}
		for (var i=start; i<end; i += step) {
			input.push(i.toString());
		}
		return input;
	};
});
