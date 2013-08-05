var should = require('should');
var superagent = require('superagent');
var request = superagent.agent();

var url = 'http://src.angular/';
var email = 'mocha@angulario.com';
var password = '1@3$Qwerty!';

var username = 'mocha';

//-- Auth Functions --//
// it('should sign in', function(done){ signin(done); });
function signup(done) {
	request.post(url+'account/signup')
		.send({email:email,password:password})
		.end(function(err,res) { done();});
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

describe('User Profile', function() {

	describe('Edit Profile', function() {
		it('should sign up', function(done){ signup(done); });
		it('should sign in', function(done){ signin(done); });
		
		it('should check if username is unique return 400', function(done){
			request.get(url+'user/unique/')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.should.have.status(400);
					res.body.error.message.should.include('Bad Request:');
					done();
				});
		});
		
		it('should check if username is unique return Not Taken', function(done){
			request.get(url+'user/unique/NOT-TAKEN')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		// it - should check if username is unique return Taken
		
		it('should save user profile details return true', function(done){
			request.put(url+'user')
				.send({
					'user_username': username,
					'user_name_first': 'cafe',
					'user_name_last': 'mocha',
					'user_phone': '191155500009999',
					'user_url': 'http://angulario.com',
					'user_function': 'Tester',
					'user_details': 'None at this time.'
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should delete user', function(done){ deleteUser(done); });
	});
	
	describe('View Profile', function() {
		var user_ID = 0;
		
		it('should sign up', function(done){ signup(done); });
		it('should sign in', function(done){ signin(done); });
		it('should complete onboard', function(done){ onboardDone(done); });
		
		it('should inject username', function(done){
			request.put(url+'user')
				.send({ 'user_username': username, })
				.end(function(err,res) { done(); });
		});
		
		it('should search for user return list of users', function(done){
			request.get(url+'user/search/')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
		
		it('should search for user return list of users', function(done){
			request.get(url+'user/search/'+username)
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
		
		it('should get user session ID return user object', function(done){
			request.get(url+'user')
				.end(function(err,res) {
					if (err) { throw err; }
					
					user_ID = res.body.user_ID;
					res.body.should.have.property('user_ID');
					done();
				});
		});
		
		it('should get user by ID return user object', function(done){
			request.get(url+'user/'+user_ID)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('user_ID');
					done();
				});
		});
		
		it('should get user by session username return user object', function(done){
			request.get(url+'user/name')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('user_ID');
					done();
				});
		});
		it('should get user by username return user object', function(done){
			request.get(url+'user/name/'+username)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('user_ID');
					done();
				});
		});
		
		it('should delete user', function(done){ deleteUser(done); });
	});
	
	describe('GET account/unique', function() {
		
	});
	
	
});