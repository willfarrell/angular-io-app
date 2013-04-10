window.Modernizr = (function( window, document, undefined ) {

	var version = '2.6.2',

	Modernizr = {},


	docElement = document.documentElement,

	mod = 'modernizr',
	modElem = document.createElement(mod),
	mStyle = modElem.style,

	inputElem  = document.createElement('input')  ,

	smile = ':)',

	toString = {}.toString,	tests = {},
	inputs = {},
	attrs = {},

	classes = [],

	slice = classes.slice,

	featureName,



	_hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

	if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
	hasOwnProp = function (object, property) {
		return _hasOwnProperty.call(object, property);
	};
	}
	else {
	hasOwnProp = function (object, property) {
		return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
	};
	}


	if (!Function.prototype.bind) {
	Function.prototype.bind = function bind(that) {

		var target = this;

		if (typeof target != "function") {
			throw new TypeError();
		}

		var args = slice.call(arguments, 1),
			bound = function () {

			if (this instanceof bound) {

	var F = function(){};
	F.prototype = target.prototype;
	var self = new F();

	var result = target.apply(
	self,
	args.concat(slice.call(arguments))
	);
	if (Object(result) === result) {
	return result;
	}
	return self;

			} else {

	return target.apply(
	that,
	args.concat(slice.call(arguments))
	);

			}

		};

		return bound;
	};
	}

	function setCss( str ) {
		mStyle.cssText = str;
	}

	function setCssAll( str1, str2 ) {
		return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
	}

	function is( obj, type ) {
		return typeof obj === type;
	}

	function contains( str, substr ) {
		return !!~('' + str).indexOf(substr);
	}


	function testDOMProps( props, obj, elem ) {
		for ( var i in props ) {
			var item = obj[props[i]];
			if ( item !== undefined) {

							if (elem === false) return props[i];

							if (is(item, 'function')){
								return item.bind(elem || obj);
				}

							return item;
			}
		}
		return false;
	}
	function webforms() {
											Modernizr['input'] = (function( props ) {
			for ( var i = 0, len = props.length; i < len; i++ ) {
				attrs[ props[i] ] = !!(props[i] in inputElem);
			}
			if (attrs.list){
	attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
			}
			return attrs;
		})('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
							Modernizr['inputtypes'] = (function(props) {

			for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

				inputElem.setAttribute('type', inputElemType = props[i]);
				bool = inputElem.type !== 'text';

													if ( bool ) {

					inputElem.value	= smile;
					inputElem.style.cssText = 'position:absolute;visibility:hidden;';

					if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

	docElement.appendChild(inputElem);
	defaultView = document.defaultView;

										bool =  defaultView.getComputedStyle &&
	defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
	(inputElem.offsetHeight !== 0);

	docElement.removeChild(inputElem);

					} else if ( /^(search|tel)$/.test(inputElemType) ){
																					} else if ( /^(url|email)$/.test(inputElemType) ) {
										bool = inputElem.checkValidity && inputElem.checkValidity() === false;

					} else {
										bool = inputElem.value != smile;
					}
				}

				inputs[ props[i] ] = !!bool;
			}
			return inputs;
		})('search tel url email datetime date month week time datetime-local number range color'.split(' '));
		}
	for ( var feature in tests ) {
		if ( hasOwnProp(tests, feature) ) {
									featureName  = feature.toLowerCase();
			Modernizr[featureName] = tests[feature]();

			classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
		}
	}

	Modernizr.input || webforms();


	Modernizr.addTest = function ( feature, test ) {
	if ( typeof feature == 'object' ) {
	for ( var key in feature ) {
	if ( hasOwnProp( feature, key ) ) {
	Modernizr.addTest( key, feature[ key ] );
	}
	}
	} else {

	feature = feature.toLowerCase();

	if ( Modernizr[feature] !== undefined ) {
	return Modernizr;
	}

	test = typeof test == 'function' ? test() : test;

	if (typeof enableClasses !== "undefined" && enableClasses) {
	docElement.className += ' ' + (test ? '' : 'no-') + feature;
	}
	Modernizr[feature] = test;

	}

	return Modernizr;
	};


	setCss('');
	modElem = inputElem = null;


	Modernizr._version	= version;


	return Modernizr;

})(this, this.document);
