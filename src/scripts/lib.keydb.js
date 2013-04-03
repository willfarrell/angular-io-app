/*
//== To Do ==//
-add update fucntions
-merge [g|s]etAllArray and [g|s]etAllObject into one

//== Important Notes ==//
-JSON.parse() and JSON.stringify() are built-in
-"keys" is a reserved key name for keyDB objects

//== Examples ==//

//= General Examples =//
db.get('key');
db.set('key', {});
db.remove('key');
db.clear();

db.keyDB_name.get('key');
db.keyDB_name.set('key', {});
db.keyDB_name.remove('key');
db.keyDB_name.clear();

var list = db.keyDB_name.keys;	// get list of keys
var obj = db.keyDB_name.obj;	// get default obj

//= init Examples =//
var test = {}
if (storage) {
	test = db.get('test', test);
} else {
	alert('Your browser seems to be in Private Mode. Please disable it if you\'d like your settings saved for your next visit.');
}

//= Creating a keyDB =//
db.name = new keyDB(
	"name",				// DB prefix for all keys
	{						// default object (optinal)
		"key":"",
		"value":"",
		"timestamp":Date.now(),
	}
);


*/

// localStorage db wrapper
var db = {
	on: false,			// bool - if localStorage is enabled in browser
	ls: localStorage,	// localStorage short name - obfusification

	/**
	* set 'on' bool for those that want to
	* test if localStorage is enabled
	*
	* call from below
	*
	* @this {Object}
	*/
	init: function() {
		var uid = +new Date(),
			result;
		try {
			result = this.get(uid, uid) === uid;
			this.remove(uid);
			this.on = result;
		} catch( e ) {}
	},

	// Main Functions //

	/**
	* @this {Object}
	*/
	get: function(key, default_obj) {
		//console.log("db.get('"+key+"', "+JSON.stringify(default_obj)+")");
		if ( default_obj !== 'undefined' && !this.ls.getItem(key)) {
			this.set(key, default_obj);
		}
		//console.log(this.ls.getItem(key));
		var result = this.ls.getItem(key);

		if ( result === 'undefined' ) {
			return result;
		} else {
			return JSON.parse(result);
		}
		// if (result === typeof Object)
	},

	/**
	* @this {Object}
	*/
	set: function(key, obj) {
		//console.log("db.set('"+key+"', "+JSON.stringify(obj)+")");
		if (key !== null) { this.ls.setItem(key, JSON.stringify(obj)); }
	},

	/**
	* @this {Object}
	*/
	remove: function(key) {
		this.ls.removeItem(key);
	},

	// clears ALL localStorage - only call if you're sure
	/**
	* @this {Object}
	*/
	clear: function() {
		this.ls.clear();
	}
};

db.init();

// Keyed DB Class
// keyDB("id", {})
// "keys" is a reserved keyname
/**
 * @this {Object}
 */
function keyDB(id, default_obj) {
	this.id = id ? id+'_' : '_'; // prefix for all keys, end with _
	this.keys = db.get(this.id+'keys', []);
	this.obj = default_obj || {}; // default object being stored
}


keyDB.prototype.get = function(key, default_obj) {
	//console.log("keyDB.get("+key+")");
	return db.get(this.id+key, default_obj);
};

keyDB.prototype.set = function(key, obj) {
	if (obj === 'undefined' || key === 'undefined') { return; }	// don't set undefined
	//console.log("keyDB.set("+key+", ");
	//console.log(obj);
	//console.log(")");
	db.set(this.id+key, obj);
	// save key in keychain if not already there
	var index = this.keys.indexOf(key);
	//console.log(index);
	if ( index === -1 ) { // if not in keys
		this.keys.push(key);
		//console.log(this.keys);
		db.set(this.id+'keys', this.keys);
	}
};

keyDB.prototype.remove = function(key) {
	db.remove(this.id+key);
	// remove key in keychain
	var index = this.keys.indexOf(key);
	if (index !== -1) { // if in keys
		this.keys.splice(index, 1);
		db.set(this.id+'keys', this.keys);
	}
};

/**
 * list = [] - default container
 */
keyDB.prototype.getAllArray = function(key, list_default) {
	if (typeof(list_default) === 'function') { list_default = list_default(); }
	var list = [];
	for (var i = 0, l = this.keys.length; i < l; i++) {
		list.push(this.get(this.keys[i]));
	}
	if (!list.length && key && list_default) {
		this.setAllArray(key, list_default);
		list = list_default;
	}
	return list;
};

/**
 * list = {} - default container
 */
keyDB.prototype.getAllObject = function(list_default) {
	if (typeof(list_default) === 'function') { list_default = list_default(); }
	var list = {};
	for (var i = 0, l = this.keys.length; i < l; i++) {
		list[this.keys[i]] = this.get(this.keys[i]);
	}
	if (!list.length && list_default) {
		this.setAllObject(list_default);
		list = list_default;
	}
	return list;
};

/**
 * key = string key name
 * list = [] - default container
 */
keyDB.prototype.setArray = function(key, list) {
	if (!key) { return; }	// return if no key

	for (var i = 0, l = list.length; i < l; i++) {
		//console.log(list[i]);
		this.set(list[i][key], list[i]);
	}
};

/**
 * list = key:{key:key, ...} - default container
 */
keyDB.prototype.setObject = function(list) {
	for (var i in list) {
		if (list.hasOwnProperty(i)) {
			this.set(i, list[i]);
		}
	}
};

/**
 * key = string key name
 * list = [] - default container
 */
keyDB.prototype.setAllArray = function(key, list) {
	if (!key) { return; }	// return if no key
	this.clear();

	this.setArray(key, list);
};

/**
 * list = key:{key:key, ...} - default container
 */
keyDB.prototype.setAllObject = function(list) {
	this.clear();
	this.setObject(list);
};

/**
 * remove all keys from ls
 */
keyDB.prototype.clear = function() {
	//this.ls.clear();
	for (var i = 0, l = this.keys.length; i < l; i++) {
		db.remove(this.id+this.keys[i]);
	}
	db.remove(this.id+'keys');
};
