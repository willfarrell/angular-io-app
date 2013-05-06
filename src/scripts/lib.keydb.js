/*
 * will Farrell
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

		/*if ( result === 'undefined' ) {
			return result;
		}*/
		if (result && result.match(/^[{\["]/)) {
			return JSON.parse(result);
		} else if (result === 'true') {
			return true;
		} else if (result === 'false') {
			return false;
		} 
		result = '"'+result+'"'; // to catch numbers
		return JSON.parse(result);

		// if (result === typeof Object)
	},

	/**
	* @this {Object}
	*/
	set: function(key, obj) {
		//console.log('db.set(', key, obj, ")");
		if (key !== null) {
			this.ls.setItem(key, (typeof(obj) === 'object') ? JSON.stringify(obj) : obj);
		}
		return obj;
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
	var obj = {};
	if (typeof(default_obj) === 'function') { obj = default_obj(); }
	else { obj = default_obj; }

	return db.get(this.id+key, obj);
};

keyDB.prototype.set = function(key, obj) {
	if (obj === 'undefined' || key === 'undefined') { return; }	// don't set undefined
	//console.log("keyDB.set("+key+", ");
	db.set(this.id+key, obj);
	// save key in keychain if not already there
	var index = this.keys.indexOf(key);
	if ( index === -1 ) { // if not in keys
		this.keys.push(key);
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
	var obj = [], list = [];
	if (typeof(list_default) === 'function') { obj = list_default(); }
	else { obj = list_default; }

	for (var i = 0, l = this.keys.length; i < l; i++) {
		list.push(this.get(this.keys[i]));
	}
	if (!list.length && key && obj) {
		this.setAllArray(key, obj);
		list = obj;
	}
	return list;
};

/**
 * list = {} - default container
 */
keyDB.prototype.getAllObject = function(list_default) {
	var obj = {}, list = {};
	if (typeof(list_default) === 'function') { obj = list_default(); }
	else { obj = list_default; }

	for (var i = 0, l = this.keys.length; i < l; i++) {
		list[this.keys[i]] = this.get(this.keys[i]);
	}
	if (!list.length && obj) {
		this.setAllObject(obj);
		list = obj;
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
 * list = [] or {} - default container
 * key = string key name if list is array
 */
/*keyDB.prototype.setAll= function(list, key) {
	this.clear();
	if (typeof(list) === 'object') {
		this.setObject(list);
	} else if (key && typeof(list) === 'array') {
		this.setArray(key, list);
	}
};*/

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
