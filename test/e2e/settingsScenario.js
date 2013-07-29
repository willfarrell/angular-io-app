describe('E2E: Account Settings', function() {
	//var user = 'test@angualario.com',
	//	pass = '12!@ASqwerty';
	var email = 'karma@angulario.com',
		new_email = 'karma_new@angulario.com',
		pass = '1@3$Qwerty!',
		new_pass = '1@3$Qwerty!NEW';
	
	beforeEach(function() {
		browser().navigateTo('/');
		browser().navigateTo('#/sign/out');
		browser().navigateTo('#/sign/in');
		
		input('signin.email').enter(email);
		input('signin.password').enter(pass);
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(browser().location().path()).not().toContain('/sign/');
	});
	
	afterEach(function() {
	});
	
	it('should update account', function() {
		browser().navigateTo('#/settings/account');
		
		// to be done
		expect(element('[data-ng-model="accessibility.settings.accessibility"]').attr('checked')).not().toBeDefined();
		input('accessibility.settings.accessibility').check();
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/account');
		expect(element('[data-ng-model="accessibility.settings.accessibility"]').attr('checked')).toBeDefined();
	});
	
	it('should update email', function() {
		browser().navigateTo('#/settings/email');
		
		expect(element('[data-ng-view] [data-ng-disabled]').attr('disabled')).toBeDefined();
		input('email.user_email').enter(new_email);
		input('email.password').enter(pass);
		expect(element('[data-ng-view] [data-ng-disabled]').attr('disabled')).not().toBeDefined();
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		input('email.user_email').enter(email);
		input('email.password').enter(pass);
		element('[data-ng-view] [data-ng-disabled]').click();
	});
	
	describe('Should confirm email', function() {
	
	});
	
	it('should update password', function() {
		browser().navigateTo('#/settings/password');
		
		expect(element('[data-ng-view] [data-ng-disabled]').attr('disabled')).toBeDefined();
		input('password.old_password').enter(pass);
		input('password.new_password').enter(new_pass);
		expect(element('[data-ng-view] [data-ng-disabled]').attr('disabled')).not().toBeDefined();
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		pass = new_pass;
		//input('password.old_password').enter(new_pass);
		//input('password.new_password').enter(pass);
		//element('[data-ng-view] .btn').click();
		//expect(input('password.new_password').val()).toContain('');
	});
	
	it('should update notifications', function() {
		browser().navigateTo('#/settings/notifications');
		
		expect(element('[data-ng-model="notify.new_message.email"]').attr('checked')).not().toBeDefined();
		input('notify.new_message.email').check();
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/notifications');
		
		expect(element('[data-ng-model="notify.new_message.email"]').attr('checked')).toBeDefined();
	});
	
	it('should update security', function() {
		browser().navigateTo('#/settings/security');
		
		// set totp (requires phone) > sign in with totp > turn off
		
		// PGP email
		
	});
	
	it('should update user profile', function() {
		browser().navigateTo('#/settings/profile');
		
		// username
		//input('user.user_username').enter('karma');
		//expect(element('.alert-fixed-top').text()).toContain('Saved'); // check if unique works
		
		input('user.user_name_first').enter('karma');
		input('user.user_name_last').enter('amrak');
		input('user.user_function').enter('good will');
		input('user.user_phone').enter('9115555555');
		input('user.user_url').enter('http://willfarrell.ca');
		input('user.user_details').enter('about details here');
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/profile');
		
		expect(input('user.user_name_first').val()).toBe('karma');
		expect(input('user.user_name_first').val()).toBe('karma');
		expect(input('user.user_name_last').val()).toBe('amrak');
		expect(input('user.user_function').val()).toBe('good will');
		expect(input('user.user_phone').val()).toBe('(911) 555-5555');
		expect(input('user.user_url').val()).toBe('http://willfarrell.ca');
		expect(input('user.user_details').val()).toBe('about details here');
		
	});
	
	it('should update company profile', function() {
		browser().navigateTo('#/settings/company');
		
		input('company.company_username').enter('karma-inc');
		input('company.company_name').enter('karma Inc');
		input('company.company_url').enter('http://angulario.com');
		input('company.company_phone').enter('9115555555');
		input('company.company_details').enter('about details here');
		element('[data-ng-view] .btn').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		expect(input('company.user_default_ID').val()).toBeDefined();
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/company');
		
		expect(input('company.company_username').val()).toBe('karma-inc');
		expect(input('company.company_name').val()).toBe('karma Inc');
		expect(input('company.company_url').val()).toBe('http://angulario.com');
		expect(input('company.company_phone').val()).toBe('(911) 555-5555');
		expect(input('company.company_details').val()).toBe('about details here');
		
	});
	
	it('should add a location', function() {
		browser().navigateTo('#/settings/locations');
		
		element('[data-ng-view] .btn').click(); // click new location
		
		input('location.location_name').enter('Head Office');
		input('location.address_1').enter('1 Young St.');
		input('location.address_2').enter('314159');
		input('location.city').enter('Toronto');
		select('location.country_code').option('CA'); // must be before region_code
		select('location.region_code').option('ON');
		input('location.mail_code').enter('A1A1A1');
		input('location.location_phone').enter('9115555555');
		
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/locations');
		
		element('[data-ng-view] td').click(); // click first location to confirm
		
		expect(input('location.location_name').val()).toBe('Head Office');
		expect(input('location.address_1').val()).toBe('1 Young St.');
		expect(input('location.address_2').val()).toBe('314159');
		expect(input('location.city').val()).toBe('Toronto');
		expect(input('location.region_code').val()).toBe('ON');
		expect(input('location.country_code').val()).toBe('CA');
		expect(input('location.mail_code').val()).toBe('A1A1A1');
		expect(input('location.location_phone').val()).toBe('(911) 555-5555');
		
		// check default was set
		browser().navigateTo('#/settings/company');
		expect(input('company.location_default_ID').val()).toBeDefined();
	});
	
	/*it('should add another location change default', function() {
		browser().navigateTo('#/settings/locations');
		
		element('[data-ng-view] .btn').click(); // click new location
		
		input('location.location_name').enter('Remote Office');
		input('location.address_1').enter('1314 Kapiolani Blvd');
		input('location.address_2').enter('');
		input('location.city').enter('Honolulu');
		select('location.country_code').option('US'); // must be before region_code
		select('location.region_code').option('HI');
		input('location.mail_code').enter('96814');
		input('location.location_phone').enter('9115555555');
		
		element('[data-ng-view] [data-ng-disabled]').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/settings/company');
		expect(input('company.location_default_ID').val()).toBeDefined();
	});*/
	
	it('should add another user change default', function() {
		browser().navigateTo('#/settings/users');
		
	});
});
