describe('$session', function() {
	beforeEach(module('ngCookies', 'io.factories'));
	
	it('should contain default values', inject(function($session) {
		expect($session.active).toEqual(false);
		expect($session.account).toEqual({});
		expect($session.user).toEqual({});
		expect($session.company).toEqual({});
	}));
	
	it('should reset values', inject(function($session) {
		// change values
		$session.active = {'test':'test'};
		$session.account = {'test':'test'};
		$session.user = {'test':'test'};
		$session.company = {'test':'test'};
		
		$session.reset();
		expect($session.active).toEqual(false);
		expect($session.account).toEqual({});
		expect($session.user).toEqual({});
		expect($session.company).toEqual({});
	}));
	
	it('should update active bool', inject(function($rootScope, $session) {
		
		$rootScope.$broadcast('session', true);
		expect($session.active).toEqual(true);
		
		$rootScope.$broadcast('session', false);
		expect($session.active).toEqual(false);
		
		$rootScope.$emit('session', true);
		expect($session.active).toEqual(true);
		
		$rootScope.$emit('session', false);
		expect($session.active).toEqual(false);
	}));
	
	it('should save session', inject(function($session) {
		
	}));
	
	it('should update session', inject(function($session) {
		
	}));
	
	it('should regen session ID', inject(function($session) {
		
	}));
	
	it('should confirm current session value', inject(function($session) {
		
	}));
	
	it('should require signin', inject(function($session) {
		
	}));
	
});