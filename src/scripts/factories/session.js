
/*
To Do
- test

*/
angular.module('app.factories')
.factory('$session', ['app.config', '$rootScope', '$cookies', '$http', '$localStorage', function(config, $rootScope, $cookies, $http,$localStorage) {

	var $scope = {};
	$scope.active = $localStorage.get('session.active', false); // signed in bool
	$scope.account = $localStorage.get('session.account', {});
	$scope.user = $localStorage.get('session.user', {});
	$scope.company = $localStorage.get('session.company', {});

	$rootScope.$on('session', function(value){
		$scope.active = (value);
	});

	$scope.reset = function() {
		console.log('reset()');
		$scope.active = false;
		$scope.account = {};
		$scope.user = {};
		$scope.company = {};
		$scope.save(true);
		/*$localStorage.set('session.active', false); // signed in bool
		$localStorage.set('session.account', {});
		$localStorage.set('session.user', {});
		$localStorage.set('session.company', {});*/
	};

	$scope.save = function(force) {
		console.log('saveSession()');
		if ($scope.account.remember || force) {
			$localStorage.set('session.active', $scope.active); // signed in bool
			$localStorage.set('session.account', $scope.account);
			$localStorage.set('session.user', $scope.user);
			$localStorage.set('session.company', $scope.company);
		}
	};

	$scope.update = function(callback) {
		console.log('updateSession(', callback, ')');
		$http.get('/account/session')	// re-get session data if currently no storing any
			.success(function(data) {
				console.log('updateSession.get.success');
				console.log(data);
				if (data === []) { // special case no 'if ($rootScope.checkHTTPReturn(data)) {'
					$rootScope.href('/sign/out');
				} else {
					//$scope.session = syncVar(data, $scope.db);
					$scope.account = $localStorage.set('session.account', data.account);
					$scope.user = $localStorage.set('session.user', data.user);
					$scope.company = $localStorage.set('session.company', data.company);
					//$rootScope.session.timestamp = +new Date();
					$scope.save();
					if (callback) { callback(); } // $rootScope.$eval();
				}
			});
	};

	$scope.regen = function() {
		console.log('regenSession()');
		$http.get('/account/regen')
			.success(function(data) {
				console.log('regenSession.get.success');
			});
	};

	$scope.check = function(callback) {
		console.log('checkSession(', callback, ')');
		$http.get('/account/signcheck')
			.success(function(data) {
				console.log('checkSession.get.success');
				console.log(data);
				if (parseInt(data, 10)) {	// has active cookie
					if (!$scope.active) {
						$scope.update(callback);
					} else if (callback) {
						callback();//$rootScope.$eval(callback());
					}
				} else if ($scope.active) {
					$cookies.redirect = $rootScope.uri();
					$rootScope.href('/sign/out');
				}
			});
	};

	$scope.require_signin = function(callback) {
		console.log('require_signin(', callback, ')');
		//console.log(config);
		//console.log(JSON.stringify($rootScope.session));
		// not signed in -> sign/in

		if (!$scope.active) {
			console.log('not signed in');

			if ($rootScope.uri().match(/\/sign\//) === null) { // prevent redirect loop
				$cookies.redirect = $rootScope.uri();
				$rootScope.href('/sign/in');
			}
		// email not confirmed -> onboard
		} else if (config.onboard.required && !$scope.account.email_confirm && $rootScope.uri().match(/\/onboard\/email/) === null) {
			//console.log('email not confirmed = '+(config.onboard.required)+' && '+!$rootScope.session.email_confirm+' && '+($rootScope.uri().match(/\/onboard/) === null));
			$rootScope.href('/onboard/email');
		// haven't completed manditory onboard steps -> onboard
		} else if (config.onboard.required && !$scope.account.timestamp_create && $rootScope.uri().match(/\/onboard/) === null) {
			//console.log('onboard not completed = '+(config.onboard.required)+' && '+!$rootScope.session.timestamp_create+' && '+($rootScope.uri().match(/\/onboard/) === null));
			$rootScope.href('/onboard/'+config.onboard.start);
		// has an old password -> change pass
		} else if (
			(config.password.max_age && $scope.account.password_age > config.password.max_age) ||
			(config.password.min_timestamp && $scope.account.password_timestamp < config.password.min_timestamp)
			) {
			$rootScope.href('/onboard/password');
		// all good -> eval callback
		} else if (callback) {
			callback();//$rootScope.$eval(callback());
		}
	};



	return $scope;
}]);