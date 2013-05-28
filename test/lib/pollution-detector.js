/*

Test for Pollution of unit tests
src: https://www.youtube.com/watch?v=Mi14KwP1TyM

*/

'use strict';

/*
DOM Pollution

beforeEach(function() { pollutionDetectorDOM.setup(); });
afterEach(function() { pollutionDetectorDOM.teardown(); });

Catch:
- created DOM elements there were not destroyed
*/
var pollutionDetectorDOM;
(function() {
	var bodyHTMLbefore, bodyHTMLafter;
	pollutionDetectorDOM = {
		setup: function() {
			bodyHTMLbefore = document.body.outerHTML;
		},
		teardown: function() {
			bodyHTMLafter = document.body.outerHTML;
			if (bodyHTMLbefore !== bodyHTMLafter) {
				throw Error('DOM pollution detected!');
			}
		}
	}
})();

/*
AngularJS $rootScope Pollution

beforeEach(function() { pollutionDetectorNG.setup(); });
afterEach(function() { pollutionDetectorNG.teardown(); });

Catch:
- Child Scopes created but never destroyed
- Lingering event handelers and $watch expressions that never deregistered
- Properties added to $rootScope but nver removed
*/
var pollutionDetectorNG;
(function() {
	var rsShallowBefore, rsShallowAfter;
	pollutionDetectorNG = {
		setup: function() {
			inject(['$rootScope', function($rootScope) {
				//rsShallowBefore = _.clone($rootScope);
				angular.copy($rootScope, rsShallowBefore);
			}]);
		},
		teardown: function() {
			inject(['$rootScope', function($rootScope) {
				//var rsShallowAfter = = _.clone($rootScope);
				//if (!_.isEqual(rsShallowBefore, rsShallowAfter)) {
				angular.copy($rootScope, rsShallowAfter);
				if (!angular.equals(rsShallowBefore, rsShallowAfter)) {
					throw Error('$rootScope change detected!');
				}
			}]);
		}
	}
})();


/*
AngualrJS services pollution

beforeEach(module('app', 'pollutionDetector'));

Fix Examples:
- scope.$destroy();
*/
angular.module('pollutionDetector', [])
.config(['$provide', function($provide) {
	$provide.decorator('$compile', ['$delegate', '$rootScope', function($compile, $rootScope) {
		return function() {
			var linker = $compile.apply(this, arguments);
			return function (scope) {
				if (scope === $rootScope) {
					throw Error('$compile called against $rootScope');
				}
				return linker.apply(this, arguments);
			};
		};
	}]);
}]);
