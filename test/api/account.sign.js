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
function onboardDone(done) {
	request.get(url+'account/onboard_done').end(function(err,res) { done(); });
}
function signout(done) {
	request.get(url+'account/signout').end(function(err,res) { done(); });
}
function deleteUser(done) {
	request.get(url+'account/delete').end(function(err,res) { done(); });
}

describe('Sign Up Process', function() {

	describe('Full Sign Cycle', function() {
		//-- Sign Up --//
		it('should fail to sign up', function(done){
			request.post(url+'account/signup')
				.send({
					email:'NOTANEMAIL',
					password:''
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('email');
					res.body.errors.should.have.property('password');
					done();
				});
		});
		
		it('should succeed to sign up', function(done){
			request.post(url+'account/signup')
				.send({
					email:email,
					password:password
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		//-- Sign In--//
		/*it('should handel bad request', function(done){
			request.post(url+'account/signin')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('password');
					done();
				});
		});*/
		
		it('should fail to sign in (bad email)', function(done){
			request.post(url+'account/signin')
				.send({
					email:'NOTANEMAIL',
					password:password,
					remember:1
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('password');
					done();
				});
		});
		
		it('should fail to sign in (bad password)', function(done){
			request.post(url+'account/signin')
				.send({
					email:email,
					password:'_',
					remember:1
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('password');
					done();
				});
		});
		
		it('should succeed to sign in', function(done){
			request.post(url+'account/signin')
				.send({
					email:email,
					password:password,
					remember:1
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('account');
					res.body.should.have.property('user');
					done();
				});
		});

		it('should succeed to complete onboard process', function(done){
			request.get(url+'account/onboard_done')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		//-- Sign Out --//
		it('should sign out', function(done){
			request.get(url+'account/signout')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
	});
	
	/*describe('Regen Session GET account/regen', function() {
		it('should return true', function(done){
			request.get(url+'account/regen')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
	});*/
	
	describe('Get Session', function() {
		
		it('should sign in', function(done){ signin(done); });
		
		it('should return session', function(done){
			request.get(url+'account/session')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('account');
					res.body.should.have.property('user');
					done();
				});
		});
		
		it('should sign out', function(done){ signout(done); });
		
		it('should return 400 - Bad Request: Session Expired', function(done){
			request.get(url+'account/session')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.should.have.status(400);
					res.body.error.message.should.include('Bad Request:');
					done();
				});
		});
	});
	
	describe('Sign Check', function() {
		
		it('should sign in', function(done){ signin(done); });
		
		it('should return true when signed in', function(done){
			request.get(url+'account/signcheck')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.text.should.not.equal('0');
					done();
				});
		});
		
		it('should sign out', function(done){ signout(done); });
		
		it('should return false when signed out', function(done){
			request.get(url+'account/signcheck')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.text.should.equal('0');
					done();
				});
		});
	});
	
	describe('DELETE account', function() {
		
		it('should sign in', function(done){ signin(done); });
		
		it('should delete user', function(done){
			request.get(url+'account/delete')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
	});
});
