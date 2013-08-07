var should = require('should');
var superagent = require('superagent');
var request = superagent.agent();

var url = 'http://src.angular/';
var email = ['mocha@angulario.com', 'mochaFriend@angulario.com'];
var password = '1@3$Qwerty!';
var user_ID = [];

//-- Auth Functions --//
// it('should sign in', function(done){ signin(done); });
function signup(done, id) {
	request.post(url+'account/signup')
		.send({email:email[id],password:password})
		.end(function(err,res) { done(); });
}
function signin(done,id) {
	request.post(url+'account/signin')
		.send({email:email[id],password:password,remember:1})
		.end(function(err,res) {
			user_ID[id] = res.body.user.user_ID;
			done();
		});
}
function signout(done) {
	request.get(url+'account/signout').end(function(err,res) { done(); });
}
function deleteUser(done) {
	request.get(url+'account/delete').end(function(err,res) { done(); });
}
	
describe('Plugin Message (MySQL)', function() {
	var hash; // for delete
	
	it('should sign up', function(done){ signup(done,0); });
	it('should sign in', function(done){ signin(done,0); });
	it('should sign out', function(done){ signout(done); });
	
	it('should sign up', function(done){ signup(done,1); });
	it('should sign in', function(done){ signin(done,1); });
	
	
	it('should send a message', function(done){
		request.post(url+'message')
		.send({
			user_ID:user_ID[0],
			message:'Hello'
		})
		.end(function(err,res) {
			if (err) { throw err; }
			
			res.body.should.equal(true);
			done();
		});
	});
	
	it('should show all message threads', function(done){
		request.get(url+'message/list')
		.end(function(err,res) {
			if (err) { throw err; }
			
			res.body.should.have.lengthOf(1);
			done();
		});
	});
	
	it('should show all messages between a user', function(done){
		request.get(url+'message/'+user_ID[0])
		.end(function(err,res) {
			if (err) { throw err; }
			
			hash = res.body.thread[0].hash;
			res.body.thread.should.have.lengthOf(1);
			done();
		});
	});
	
	it('should delete the message', function(done){
		request.get(url+'message/delete/'+hash)
		.end(function(err,res) {
			if (err) { throw err; }
			
			res.body.should.equal(true);
			done();
		});
	});
	
	it('should send a message', function(done){
		request.post(url+'message')
		.send({
			user_ID:user_ID[0],
			message:'Hello Again'
		})
		.end(function(err,res) {
			if (err) { throw err; }
			
			res.body.should.equal(true);
			done();
		});
	});
	
	it('should sign out', function(done){ signout(done); });
	it('should sign in', function(done){ signin(done,0); });
	
	it('should get unread count', function(done){
		request.get(url+'message/unread')
		.end(function(err,res) {
			if (err) { throw err; }
			
			(res.body).should.be.within(1, 99);
			done();
		});
	});
	
	it('should delete user', function(done){ deleteUser(done); });
	
	it('should sign in', function(done){ signin(done,1); });
	it('should delete user', function(done){ deleteUser(done); });
});
