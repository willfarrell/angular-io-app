angular.module('io.filters')
.filter('durationToPast', function() {
	return function(timestamp) {
		var now = +new Date(), Seconds = (now - timestamp)/1000;
		if (Seconds < 0) { Seconds *= -1; }
		var Days = Math.floor(Seconds / 86400);
		Seconds -= Days * 86400;
		if (Days && Days === 1) {
			return 'yesterday hh:mm';
		} else if (Days && Days < 7) {
			return 'day_of_the_week hh:mm';
		} else if (Days) {
			return 'YYYY MMM DD hh:mm';
		}
		var Hours = Math.floor(Seconds / 3600);
		Seconds -= Hours * (3600);
		if (Hours && Hours > 3) {
			return 'hh:mm';
		} else if (Hours) {
			return (Hours > 1) ? Hours + ' hours ': Hours + ' hour ';
		}
		var Minutes = Math.floor(Seconds / 60);
		Seconds -= Minutes * (60);
		if (Minutes > 0) { return (Minutes > 1) ? Minutes + ' minutes ': Minutes + ' minute '; }
		if (Seconds > 0) { return (Seconds > 1) ? Seconds + ' seconds ': Seconds + ' second '; }
		return 'zero';

	};
})
.filter('durationToFuture', function() {
	return function(timestamp) {
		var now = +new Date(), Seconds = (timestamp - now)/1000;
		if (Seconds < 0) { Seconds *= -1; }
		var Days = Math.floor(Seconds / 86400);
		Seconds -= Days * 86400;
		if (Days > 0) { return (Days > 1) ? Days + ' days ': Days + ' day '; }
		var Hours = Math.floor(Seconds / 3600);
		Seconds -= Hours * (3600);
		if (Hours > 0) { return (Hours > 1) ? Hours + ' hours ': Hours + ' hour '; }
		var Minutes = Math.floor(Seconds / 60);
		Seconds -= Minutes * (60);
		if (Minutes > 0) { return (Minutes > 1) ? Minutes + ' minutes ': Minutes + ' minute '; }
		if (Seconds > 0) { return (Seconds > 1) ? Seconds + ' seconds ': Seconds + ' second '; }
		return 'zero';
	};
});

/*


// 10 sec ago, 30 min ago, 10:15, thursday at 10:15, YYYY MMM DD
function formatRelativeDate(timestamp) {
	var now = +new Date(), Seconds = (now - timestamp)/1000;
	if (Seconds < 0) Seconds *= -1;
	var Days = Math.floor(Seconds / 86400);
	Seconds -= Days * 86400;
	if (Days && Days == 1) {
		return 'yesterday hh:mm';
	} else if (Days && Days < 7) {
		return 'day_of_the_week hh:mm';
	} else if (Days) {
		return 'YYYY MMM DD hh:mm'
	}

	var Hours = Math.floor(Seconds / 3600);
	Seconds -= Hours * (3600);
	if (Hours && Hours > 3) {
		return 'hh:mm';
	} else if (Hours) {
		return (Hours > 1) ? Hours + ' hours ': Hours + ' hour ';
	}

	var Minutes = Math.floor(Seconds / 60);
	Seconds -= Minutes * (60);
	if (Minutes > 0) { return (Minutes > 1) ? Minutes + ' minutes ': Minutes + ' minute '; }
	if (Seconds > 0) { return (Seconds > 1) ? Seconds + ' seconds ': Seconds + ' second '; }
	return 'zero';
}

// 6 days till end
function formatCountdown(timestamp) {
	var now = +new Date(), Seconds = (timestamp - now)/1000;
	if (Seconds < 0) Seconds *= -1;
	var Days = Math.floor(Seconds / 86400);
	Seconds -= Days * 86400;
	if (Days > 0) { return (Days > 1) ? Days + ' days ': Days + ' day '; }

	var Hours = Math.floor(Seconds / 3600);
	Seconds -= Hours * (3600);
	if (Hours > 0) { return (Hours > 1) ? Hours + ' hours ': Hours + ' hour '; }

	var Minutes = Math.floor(Seconds / 60);
	Seconds -= Minutes * (60);
	if (Minutes > 0) { return (Minutes > 1) ? Minutes + ' minutes ': Minutes + ' minute '; }
	if (Seconds > 0) { return (Seconds > 1) ? Seconds + ' seconds ': Seconds + ' second '; }
	return 'zero';
}

*/