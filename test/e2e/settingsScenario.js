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
		sleep(0.1);
		input('signin.email').enter(email);
		input('signin.password').enter(pass);
		element('[data-ng-view] .btn').click();
		expect(browser().location().path()).not().toContain('/sign/');
	});
	
	afterEach(function() {
	});
	
	it('should update account', function() {
		browser().navigateTo('#/settings/account');
		sleep(0.1);
		
		// to be done
		expect(element('[data-ng-model="accessibility.settings.accessibility"]').attr('checked')).not().toBeDefined();
		input('accessibility.settings.accessibility').check();
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/account');
		sleep(0.1);
		expect(element('[data-ng-model="accessibility.settings.accessibility"]').attr('checked')).toBeDefined();
	});
	
	it('should update email', function() {
		browser().navigateTo('#/settings/email');
		sleep(0.1);
		
		expect(element('[data-ng-view] .btn').attr('disabled')).toBeDefined();
		input('email.user_email').enter(new_email);
		input('email.password').enter(pass);
		expect(element('[data-ng-view] .btn').attr('disabled')).not().toBeDefined();
		element('[data-ng-view] .btn').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		input('email.user_email').enter(email);
		input('email.password').enter(pass);
		element('[data-ng-view] .btn').click();
	});
	
	it('should update password', function() {
		browser().navigateTo('#/settings/password');
		sleep(0.1);
		
		expect(element('[data-ng-view] .btn').attr('disabled')).toBeDefined();
		input('password.old_password').enter(pass);
		input('password.new_password').enter(new_pass);
		expect(element('[data-ng-view] .btn').attr('disabled')).not().toBeDefined();
		element('[data-ng-view] .btn').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		pass = new_pass;
		//input('password.old_password').enter(new_pass);
		//input('password.new_password').enter(pass);
		//element('[data-ng-view] .btn').click();
		//expect(input('password.new_password').val()).toContain('');
	});
	
	it('should update notifications', function() {
		browser().navigateTo('#/settings/notifications');
		sleep(0.1);
		
		expect(element('[data-ng-model="notify.new_message.email"]').attr('checked')).not().toBeDefined();
		input('notify.new_message.email').check();
		element('[data-ng-view] .btn').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/notifications');
		sleep(0.1);
		expect(element('[data-ng-model="notify.new_message.email"]').attr('checked')).toBeDefined();
	});
	
	it('should update security', function() {
		browser().navigateTo('#/settings/security');
		sleep(0.1);
		
		// to do once complete
	});
	
	it('should update user profile', function() {
		browser().navigateTo('#/settings/profile');
		sleep(0.1);
		
		input('user.user_name_first').enter('karma');
		input('user.user_name_last').enter('amrak');
		input('user.user_function').enter('good will');
		input('user.user_phone').enter('9115555555');
		input('user.user_url').enter('http://willfarrell.ca');
		input('user.user_details').enter('about details here');
		element('[data-ng-view] .btn').click();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/profile');
		sleep(0.1);
		
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
		sleep(0.1);
		
		input('company.company_username').enter('karma-inc');
		input('company.company_name').enter('karma Inc');
		input('company.company_url').enter('http://angulario.com');
		input('company.company_phone').enter('9115555555');
		input('company.company_details').enter('about details here');
		element('[data-ng-view] .btn').click();
		pause();
		expect(element('.alert-fixed-top').text()).toContain('Saved');
		
		browser().navigateTo('#/');
		browser().navigateTo('#/settings/company');
		sleep(0.1);
		
		expect(input('company.company_username').val()).toBe('karma-inc');
		expect(input('company.company_name').val()).toBe('karma Inc');
		expect(input('company.company_url').val()).toBe('http://angulario.com');
		expect(input('company.company_phone').val()).toBe('(911) 555-5555');
		expect(input('company.company_details').val()).toBe('about details here');
		
	});
	
	it('should add a location', function() {
		browser().navigateTo('#/settings/locations');
		sleep(0.1);
		
	});
	
	it('should add a user', function() {
		browser().navigateTo('#/settings/users');
		sleep(0.1);
		
	});
});