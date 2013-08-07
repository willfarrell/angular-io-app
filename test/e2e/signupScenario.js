/*
TODO
- add referral check
- reset password w/o signing up
*/

describe('E2E: Account Initalization', function() {
	//var user = 'test@angualario.com',
	//	pass = '12!@ASqwerty';
	var email = 'karma@angulario.com',
		pass = '1@3$Qwerty!',
		new_pass = '1@3$Qwerty!NEW';
	
	beforeEach(function() {
		browser().navigateTo('/');
	});
	
	afterEach(function() {
		
	});
	
	describe('Initial sign up and onboard process', function() {
		
		it('should allow sign up', function() {
			browser().navigateTo('#/sign/up');
			input('signup.email').enter(email);
			input('signup.password').enter(pass);
			element('[data-ng-view] .btn').click();
			expect(browser().location().path()).toBe('/onboard/user');
		});
		
		it('should require onbaord data', function() {
			// user
			browser().navigateTo('#/onboard/user');
			input('user.user_name_first').enter('karma');
			element('[data-ng-view] [data-ng-disabled]').click();
			// company
			expect(browser().location().path()).toBe('/onboard/company');
			browser().navigateTo('#/onboard/company/skip');
			expect(browser().location().path()).toBe('/app');
		});
		
		/*it('should require company data', function() {
			browser().navigateTo('#/onboard/company');
			sleep(0.1);
			input('company.company_name').enter('karma Inc');
			element('[data-ng-view] .btn').click(); // clicks the filepicker button as well
			expect(browser().location().path()).not().toBe('/onboard/user');
		});*/
		
		/*it('should complete onboard', function() {
			browser().navigateTo('#/onboard/company/skip');
			//browser().navigateTo('#/onboard/invite/skip');
			//browser().navigateTo('#/onboard/welcome/skip');
			expect(browser().location().path()).toBe('/app');
		});*/
		
		
		
		it('should signout', function() {
			browser().navigateTo('#/sign/out');
			expect(browser().location().path()).toContain('/sign/in');
		});
		
		it('should not allow sign up of existing user', function() {
			browser().navigateTo('#/sign/up');
			input('signup.email').enter(email);
			input('signup.password').enter(pass);
			element('[data-ng-view] .btn').click();
			expect(browser().location().path()).toBe('/sign/up');
		});
	});
	
	describe('Delete test User', function() {
		it('should redirect to sign in', function() {
			browser().navigateTo('#/');
			expect(browser().location().path()).toBe('/sign/in');
		});
		
		it('should sign in', function() {
			browser().navigateTo('#/sign/in');
			input('signin.email').enter(email);
			input('signin.password').enter(pass);
			element('[data-ng-view] .btn').click();
			expect(browser().location().path()).toBe('/');
		});
		
		it('should delete user data', function() {
			browser().navigateTo('#/settings/account');
			confirmOK();
			element('[data-ng-view] .btn-danger').click();
			// auto sign out
			expect(browser().location().path()).toContain('/sign/in');
		});
		
	});
	
	describe('Should reset password w/o signing in', function() {
		
	});
	
	describe('Should confirm email w/o signing in', function() {
		it('should confirm email', function() {
			//browser().navigateTo('#/settings/account');
			
			// confirm email - requires value from email
		});
	});
});
