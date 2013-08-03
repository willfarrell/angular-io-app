var should = require('should');
var request = require('supertest');
var superagent = require('superagent');
var agent = superagent.agent();

var url = 'http://src.angular/';
var email = 'mocha@angulario.com';
var password = '1@3$Qwerty!';
var cookie;

function saveCookies(res) {
	cookie = res.headers['set-cookie'];
	agent.saveCookies(res);
}

function signup() {
	request(url)
		.post('account/signup')
		.send({email:email,password:password})
		.set('Cookie', cookie)
		.end(function(err,res){
			if (err) { throw err; }
			saveCookies(res);
		});
}
function signin() {
	request(url)
		.post('account/signin')
		.send({email:email,password:password,remember:1})
		.set('Cookie', cookie)
		.end(function(err,res){
			if (err) { throw err; }
			saveCookies(res);
		});
}
function signcheck() {
	request(url)
		.get('account/signcheck')
		.set('Cookie', cookie)
		.end(function(err,res){
			if (err) { throw err; }
			saveCookies(res);
		});
}
function signout() {
	request(url)
		.get('account/signout')
		.set('Cookie', cookie)
		.end(function(err,res){
			if (err) { throw err; }
			saveCookies(res);
		});
}
function deleteUser() {
	request(url)
		.get('account/delete')
		.set('Cookie', cookie)
		.end(function(err,res){
			if (err) { throw err; }
			saveCookies(res);
		});
}

var new_pass = '1@3$Qwerty!NEW';

// init

//deleteUser();

// FAIL supertest cannot maintain session cookie yet - https://github.com/visionmedia/supertest/issues/14

describe('Account Routing', function() {
	/*describe('POST account/signup', function() {
		it('should return fail to sign up', function(done){
			request(url)
				.post('account/signup')
				.send({
					email:'NOTANEMAIL',
					password:password
				})
				.set('Cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('email');
					done();
				});
		});
		
		it('should return pass sign up', function(done){
			request(url)
				.post('account/signup')
				.send({
					email:email,
					password:password
				})
				.set('Cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.body.should.equal(true);
					done();
				});
		});
	});
	
	describe('GET account/signout', function() {
		it('should return sign out', function(done){
			request(url)
				.get('account/signout')
				.set('cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.body.should.equal(true);
					done();
				});
		});
	});*/
	
	describe('POST account/signin', function() {
		it('should return fail to sign in', function(done){
			request(url)
				.post('account/signin')
				.send({
					email:'NOTANEMAIL',
					password:password,
					remember:1
				})
				.set('Cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('password');
					done();
				});
		});
		
		it('should return pass sign in', function(done){
			request(url)
				.post('account/signin')
				.send({
					email:email,
					password:password,
					remember:1
				})
				.set('Cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.body.should.have.property('account');
					res.body.should.have.property('user');
					done();
				});
		});
	});
	
	describe('GET account/signcheck', function() {
		
		it('should return true when signed in', function(done){
			request(url)
				.get('account/signcheck')
				.set('Cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.text.should.not.equal('0');
					done();
				});
		});
		
		it('should return sign out', function(done){
			request(url)
				.get('account/signout')
				.set('cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should return false when signed out', function(done){
			request(url)
				.get('account/signcheck')
				.set('Cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					res.text.should.equal('0');
					done();
				});
		});
		//signin();
	});
	
	
	
	/*describe('DELETE account', function() {
		it('should delete user', function(done){
			request(url)
				.get('account/delete')
				.set('cookie', cookie)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					saveCookies(res);
					console.log(res.text);
					res.body.should.equal(true);
					done();
				});
		});
	});*/
	
	/*describe('GET account/signcheck', function() {
		it('should return 200 and JSON with valid keys', function(done){
			request(url)
				.get('account/signcheck')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.text.should.equal('0');
					done();
				});
		});
		
		// test: return > 0
	});
	
	describe('GET account/regen', function() {
		it('should return 200 and JSON with valid keys', function(done){
			request(url)
				.get('account/regen')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
	});
	
	describe('GET account/session', function() {
		it('should return 400 - Bad Request: Session Expired', function(done){
			request(url)
				.get('account/session')
				//.expect(400) //Status code
				//.type('json')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.error.message.should.equal('Bad Request: Session Expired');
					done();
				});
		});
		
		// test: success session returned
	});
	
	describe('GET account/unique', function() {
		it('should return 404', function(done){
			request(url)
				.get('account/unique/')
				.expect(404) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					done();
				});
		});
		
		it('should return 200 & Not Taken', function(done){
			request(url)
				.get('account/unique/NOT-TAKEN')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		// test: username taken
		/*it('should return 200 & Not Taken', function(done){
			request(url)
				.get('account/unique/TAKEN')
				.expect(200) //Status code
				.type('json')
				.end(function(err,res) {
					if (err) { throw err; }
					
					//res.body.should.equal(true);
					done();
				});
		});*
	});
	
	describe('POST account/signup', function() {
		it('should return fail to sign up', function(done){
			request(url)
				.post('account/signup')
				.send({
					email:'NOTANEMAIL',
					password:password
				})
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('email');
					done();
				});
		});
		
		it('should return pass sign up', function(done){
			request(url)
				.post('account/signup')
				.send({
					email:email,
					password:password
				})
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					console.log(res.body);
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('email');
					done();
				});
		});
	});*/
});
