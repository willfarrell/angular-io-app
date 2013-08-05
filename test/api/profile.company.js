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
	
describe('Company Profile & Settings', function() {
	
	it('should sign up', function(done){ signup(done); });
	it('should sign in', function(done){ signin(done); });
	
	it('should delete user', function(done){ deleteUser(done); });
});
