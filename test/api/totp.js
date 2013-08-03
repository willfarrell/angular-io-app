var should = require('should'),
	request = require('supertest');

var url = 'http://src.angular/',
	email = 'mocha@angulario.com',
	password = '1@3$Qwerty!';

function signin() { request(url).post('account/signin').send({email:email,password:password}); }
function signout() { request(url).get('account/signout'); }

describe('TOTP Routing', function() {
	var secret, code;
	
	signin();
	
	describe('Setup TOTP', function() {
		var service = 'google';
		it('should return secret', function(done){
			request(url)
				.get('user/totp/'+service)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.lengthOf(16);
					secret = res.body;
					done();
				});
		});
		
		it('should return a new unique secret', function(done){
			request(url)
				.get('user/totp/'+service)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.lengthOf(16);
					(secret).should.not.eql(res.body);
					secret = res.body;
					done();
				});
		});
		
		it('should return confirm secret code as failure', function(done){
			request(url)
				.put('user/totp/'+secret+'/******')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should return confirm secret code as success', function(done){
			request(url)
				.put('user/totp/'+secret+'/'+code)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
	});
	
	describe('Verify Code', function() {
		
		it('should return 200, with success', function(done){
			request(url)
				.put('user/totp/verify/'+code)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		// test: return > 0
	});
	
});
