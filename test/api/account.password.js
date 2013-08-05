var should = require('should');
var superagent = require('superagent');
var request = superagent.agent();

var url = 'http://src.angular/';
var email = 'mocha@angulario.com';
var password = '1@3$Qwerty!';

var new_password = '1@3$Qwerty!NEW';

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
	
describe('Password Reset & Change', function() {

	describe('Change Password', function() {
		it('should sign up', function(done){ signup(done); });
		it('should sign in', function(done){ signin(done); });
		
		it('should reset a user password', function(done){
			request.put(url+'account/password_change')
				.send({
					old_password:password,
					new_password:new_password
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should sign out', function(done){ signout(done); });
		
		it('should succeed to sign in with new password', function(done){
			request.post(url+'account/signin')
				.send({
					email:email,
					password:new_password,
					remember:1
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('account');
					res.body.should.have.property('user');
					done();
				});
		});
		
		it('should delete user', function(done){ deleteUser(done); });
	});
	
	describe('Reset Password', function() {
		var reset_hash;
		
		it('should sign up', function(done){ signup(done); });
		it('should sign in', function(done){ signin(done); });
		it('should sign out', function(done){ signout(done); });
		
		it('should send password return true', function(done){
			request.get(url+'account/reset_send/'+email)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should return code for email confirm (TEST API)', function(done){
			request.get(url+'test/passwordresetcode/'+email)
				.end(function(err,res) {
					if (err) { throw err; }
					
					reset_hash = res.body;
					res.body.should.have.lengthOf(16);
					done();
				});
		});
		
		it('should check reset code validity return true', function(done){
			request.get(url+'account/reset_check/'+reset_hash)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		/*it('should check user credential before reset return true', function(done){
			request.put(url+'account/put_reset_verify')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});*/
		
		it('should reset a user password', function(done){
			request.put(url+'account/reset_password')
				.send({
					old_password:password,
					new_password:new_password,
					hash:reset_hash
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should succeed to sign in with new password', function(done){
			request.post(url+'account/signin')
				.send({
					email:email,
					password:new_password,
					remember:1
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('account');
					res.body.should.have.property('user');
					done();
				});
		});
		
		it('should sign in', function(done){ signin(done); });
		it('should delete user', function(done){ deleteUser(done); });
	});
	
	/*
	
	
	reset_send
	reset_check
	reset_check_hash
	put_reset_verify
	put_reset_password
	
	
	*/
	
});
