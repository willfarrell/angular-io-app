var should = require('should'),
	request = require('supertest');

var url = 'http://src.angular/';
	
describe('Contact Routing', function() {
	
	describe('POST contact', function() {
		it('should return 200, with invalid email', function(done){
			request(url)
				.post('contact')
				.send({
					name:'',
					email:'',
					message:''
				})
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('name');
					res.body.errors.should.have.property('email');
					res.body.errors.should.have.property('message');
					done();
				});
		});
		
		it('should return 200, with success', function(done){
			request(url)
				.post('contact')
				.send({
					name:'Sender Name',
					email:'mocha@angulario.com',
					message:'Mocha Test'
				})
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
