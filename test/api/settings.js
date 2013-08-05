var should = require('should');
var superagent = require('superagent');
var request = superagent.agent();

var url = 'http://src.angular/';
var email = 'mocha@angulario.com';
var password = '1@3$Qwerty!';

//-- Auth Functions --//
// it('should sign in', function(done){ signin(done); });
function signup(done) {
	request.post(url+'account/signup')
		.send({email:email,password:password})
		.end(function(err,res) { done(); });
}
function signin(done) {
	request.post(url+'account/signin')
		.send({email:email,password:password,remember:1})
		.end(function(err,res) { done(); });
}
function signout(done) {
	request.get(url+'account/signout').end(function(err,res) { done(); });
}
function deleteUser(done) {
	request.get(url+'account/delete').end(function(err,res) { done(); });
}

describe('User Settings', function() {
	describe('Account Settings', function() {
		it('Taken care of in `Email Settings` testing', function(done){
			done();
		});
	});
	
	describe('Email Settings', function() {
		var confirm_code;
		var new_email = 'mocha.new@angualrio.com';
		
		it('should sign up', function(done){ signup(done); });
		it('should sign in', function(done){ signin(done); });
		
		it('should change email return true', function(done){
			request.put(url+'account/email_change')
				.send({
					user_email:new_email,
					password:password
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should return code for email confirm (TEST API)', function(done){
			request.get(url+'test/emailconfirmCode/'+new_email)
				.end(function(err,res) {
					if (err) { throw err; }
					
					confirm_code = res.body;
					res.body.should.have.lengthOf(16);
					done();
				});
		});
			
		it('should confirm email return true', function(done){
			request.get(url+'account/confirm_email/'+confirm_code)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should resend email confirm letter return true', function(done){
			request.get(url+'account/resend_confirm_email')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should return code for email confirm (TEST API)', function(done){
			request.get(url+'test/emailconfirmCode/'+new_email)
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body).should.not.equal(confirm_code);
					confirm_code = res.body;
					res.body.should.have.lengthOf(16);
					done();
				});
		});
			
		it('should confirm email return true', function(done){
			request.get(url+'account/confirm_email/'+confirm_code)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should delete user', function(done){ deleteUser(done); });
	});
	
	describe('Passowrd Settings', function() {
		it('Taken care of in `Password Reset` testing', function(done){
			done();
		});
	});
	
	describe('Notification Settings', function() {
		var notify;
		
		it('should sign up', function(done){ signup(done); });
		it('should sign in', function(done){ signin(done); });
		
		it('should return notify settings', function(done){
			request.get(url+'user/notify')
				.end(function(err,res) {
					if (err) { throw err; }
					
					notify = res.body;
					done();
				});
		});
		
		it('should clear settings return true', function(done){
			request.put(url+'user/notify')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should return notify settings', function(done){
			request.get(url+'user/notify')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(notify).should.not.equal(res.body);
					done();
				});
		});
		
		it('should reset settings return true', function(done){
			request.put(url+'user/notify')
				.send(notify)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should delete user', function(done){ deleteUser(done); });
	});
	
	describe('Profile Settings', function() {
		it('Taken care of in `User Profile` testing', function(done){
			done();
		});
	});
	
	describe('Security Settings', function() {
		var security = {
			totp: {
				service:'google',
				secret:''
			},
			email: {
				keyserver:''
			}
		};
		
		function saveSecurity(done) {
			request.put(url+'user/security').send(security).end(function(err,res) { done(); });
		}
		
		describe('Get & Save Settings', function() {
			it('should sign up', function(done){ signup(done); });
			it('should sign in', function(done){ signin(done); });
			
			it('should get security settings return null', function(done){
				request.get(url+'user/security')
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.text.should.equal('null');
						done();
					});
			});
			
			it('should save security settings return true', function(done){
				request.put(url+'user/security')
					.send(security)
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.body.should.equal(true);
						done();
					});
			});
			
			it('should get security settings return settings object', function(done){
				request.get(url+'user/security')
					.end(function(err,res) {
						if (err) { throw err; }
						
						for (var i in res.body) {
							if (res.body.hasOwnProperty(i)) {
								security[i] = res.body[i];
							}
						}
						res.body.should.have.property('totp');
						res.body.should.have.property('email');
						done();
					});
			});
			
			it('should delete user', function(done){ deleteUser(done); });
		});
		
		describe('TOTP', function() {
			var code;
			
			it('should sign up', function(done){ signup(done); });
			it('should sign in', function(done){ signin(done); });
			
			it('should return secret', function(done){
				request.get(url+'user/totp/generate/'+security.totp.service)
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.body.should.have.lengthOf(16);
						security.totp.secret = res.body;
						done();
					});
			});
			
			it('should return a new unique secret', function(done){
				request.get(url+'user/totp/generate/'+security.totp.service)
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.body.should.have.lengthOf(16);
						(security.totp.secret).should.not.eql(res.body);
						security.totp.secret = res.body;
						done();
					});
			});
			
			it('should return confirm secret code as failure', function(done){
				request.put(url+'user/totp/check/'+security.totp.secret+'/******')
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.text.should.equal('false');
						done();
					});
			});
			
			it('should return code for secret (TEST API)', function(done){
				request.get(url+'test/totpcode/'+security.totp.secret+'/')
					.end(function(err,res) {
						if (err) { throw err; }
						
						code = res.body;
						res.body.should.have.lengthOf(6);
						done();
					});
			});
			
			it('should confirm secret code return true', function(done){
				request.put(url+'user/totp/check/'+security.totp.secret+'/'+code)
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.body.should.equal(true);
						done();
					});
			});
			
			it('should save settings', function(done){ saveSecurity(done); });
			
			it('should verify code return false', function(done){
				request.put(url+'account/totp/verify/AAAAAA')
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.text.should.equal('false');
						done();
					});
			});
			
			it('should verify code return true', function(done){
				request.put(url+'account/totp/verify/'+code)
					.end(function(err,res) {
						if (err) { throw err; }
						
						res.body.should.have.property('account');
						res.body.should.have.property('user');
						done();
					});
			});
			
			it('should delete user', function(done){ deleteUser(done); });
		});
		
		describe('PGP', function() {
			it('should sign up', function(done){ signup(done); });
			it('should sign in', function(done){ signin(done); });
			
			/*it('should enable PGP', function(done){
				request.put(url+'user/pgp')
					.send({
						keyserver:'pgp.mit.edu'
					})
					.end(function(err,res) {
						if (err) { throw err; }
						console.log(res.text);
						res.body.should.have.property('account');
						res.body.should.have.property('user');
						done();
					});
			});*/
			
			it('should delete user', function(done){ deleteUser(done); });
		});
		
		
	});
});
