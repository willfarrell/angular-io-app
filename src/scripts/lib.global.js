/*global syncObject:true, syncArray:true */

function format(string, mask) {
	if (!string) {
		return string; // string undefined
	}
	mask = mask || 'w';
	var defs = {
		'9': '[0-9]',
		'a': '[A-Za-z]',
		'*': '[A-Za-z0-9]',
		// regex
		'w': '[\\w]',
		'W': '[\\W]',
		's': '[\\s]',
		'S': '[\\S]',
		'd': '[\\d]',
		'D': '[\\D]'
	};
	var output = '';
	var string_pos = 0;
	var mask_pos = 0;
	string.toString().split('');
	mask.split('');
	while (mask_pos < mask.length && string_pos < string.length) {
		var s = string[string_pos];
		var f = mask[mask_pos];
		if (defs[f]) {
			var regex = new RegExp(defs[f]);
			if (regex.exec(s)) {
				output += s;
				mask_pos++;
			}
			string_pos++;
		} else {
			output += f;
			mask_pos++;
		}

	}
	return output;
}

// pop ups //
// Universal clipboard button - ** move to general phonegap fct
function clipboard(text) {
window.prompt('Copy to clipboard: Ctrl+C, enter', text);
}

// Date //
// utc = number of seconds; local = number on miliseconds
// php unix timestamp in UTC -> local{timestamp, day, time}
function unix2date(unix) {
	var date		= {};
	date.time		= unix*1000;
	date.obj		= new Date(date.time);
	date.timezone	= date.obj.getTimezoneOffset()*60000;
	var m = new RegExp(/\((\w*)\)/).exec(date.obj.toString());
	date.timezone_str = (m === null) ? '' : m[1];

	//date.time		= date.obj.getTime();		// timestamp
	date.year		= date.obj.getFullYear();
	date.month		= date.obj.getMonth()+1;
	date.day		= date.obj.getDate();
	date.hour		= date.obj.getHours();
	date.min		= date.obj.getMinutes();
	date.sec		= date.obj.getSeconds();

	date.day_min	= date.hour*60 + date.min;	// min in the day
	date.time_day	= date.time - date.day_min*60000; // miliseconds to day start

	date.str = date.obj.toString();//date.year+'-'+date.month+'-'+date.day+' '+date.hour+':'+date.min+':'+date.sec;

	return date;
}
// local{timestamp, day, time} -> php unix time
function date2unix(timestamp, date, min) {
	if (date) {
		min = min || 0;
		var d = +new Date(date);
		timestamp = d + min*60000;
	}
	var timezone = new Date(timestamp).getTimezoneOffset()*60;
	return timestamp/1000 - timezone;
}

function syncVar(new_obj, old_obj) {
	if (old_obj === undefined) {
		//log("old_obj = undefined");
		old_obj = new_obj;
	} else if (typeof(new_obj) === 'object' && typeof(old_obj) === 'object') {
		//log("new_obj = Object");
		old_obj = syncObject(new_obj, old_obj);
	} else if (typeof(new_obj) === 'array' && typeof(old_obj) === 'array') {
		//log("new_obj = Array");
		old_obj = syncArray(new_obj, old_obj);
	}
	return old_obj;
}

function syncObject(new_obj, old_obj) {
	//log("==sync_loop_object==");
	//log("new");
	//log(new_obj);
	//log("old");
	//log(old_obj);
	for (var i in new_obj) {
		//console.log("new typeof "+typeof(new_obj[i]));
		if (old_obj[i] === undefined) {
			//log("old_obj = undefined");
			old_obj[i] = new_obj[i];
		} else if (typeof(new_obj[i]) === 'object') {
			//log("new_obj = Object");
			old_obj[i] = syncObject(new_obj[i], old_obj[i]);
		} else if (typeof(new_obj[i]) === 'array') {
			//log("new_obj = Array");
			old_obj[i] = syncArray(new_obj[i], old_obj[i]);
		} else {	// string, number, bool, etc
			old_obj[i] = new_obj[i];
		}
		//log("old state");
		//log(old_obj);
	}
	return old_obj;
}

function syncArray(new_obj, old_obj) {
	//log("==sync_loop_array==");
	//log("new");
	//log(new_obj);
	//log("old");
	//log(old_obj);
	for (var i = 0, l = new_obj.length; i < l; i++) {
		//log("new typeof "+typeof(new_obj[i]));
		if (typeof(new_obj[i]) === 'object') {
			//log("new_obj = Object");
			old_obj.push(syncObject(new_obj[i], old_obj[i]));
		} else if (typeof(new_obj[i]) === 'array') {
			//log("new_obj = Array");
			old_obj.push(syncArray(new_obj[i], old_obj[i]));
		} else {
			//log("new_obj = Other");
			old_obj.push(new_obj[i]);
		}
		//log("old state");
		//log(old_obj);
	}
	return old_obj;
}

// db.set("nav_more", settings.sync(this.more, db.get("nav_more", this.more)));


function nl2br(str){
	return str.replace( /\n/g, '<br />\n' );
}

function numberPadding(number, length){
	var str = '' + number;
	while (str.length < length) {
		str = '0'+str;
	}
	return str;
}

// used to create unique color from string
function strToARGB(str) {
	var hash = 0;
	for (var i = 0, l = str.length; i < l; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return ((hash>>24)&0xFF).toString(16) +
			((hash>>16)&0xFF).toString(16) +
			((hash>>8)&0xFF).toString(16) +
			(hash&0xFF).toString(16);
}
