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
	
describe('Plugin Follow', function() {
	
	it('should sign up', function(done){ signup(done,0); });
	it('should sign in', function(done){ signin(done,0); });
	it('should sign out', function(done){ signout(done); });
	
	it('should sign up', function(done){ signup(done,1); });
	it('should sign in', function(done){ signin(done,1); });
	
	
	//describe('Follow', function() {
		
		it('should get follow status of user return false', function(done){
			request.get(url+'follow/0/'+user_ID[0])
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.following.should.equal(false);
					done();
				});
		});
		
		it('should follow user', function(done){
			request.put(url+'follow/0/'+user_ID[0])
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should get follow status of user return true', function(done){
			request.get(url+'follow/0/'+user_ID[0])
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.following.should.be.within(1375000000, 91375000000);
					done();
				});
		});
		
		it('should un-follow user', function(done){
			request.get(url+'follow/delete/0/'+user_ID[0]+'/0')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should re-follow user', function(done){
			request.put(url+'follow/0/'+user_ID[0])
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
	//});
	
	
	//describe('Follow Groups', function() {
		var group_ID;
		
		it('should get group return none', function(done){
			request.get(url+'follow/group')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.lengthOf(0);
					done();
				});
		});
		
		it('should add a group', function(done){
			request.post(url+'follow/group')
				.send({
					group_name:'test group'
				})
				.end(function(err,res) {
					if (err) { throw err; }
					
					group_ID = res.body;
					res.body.should.be.ok
					done();
				});
		});
		
		it('should get group return 1', function(done){
			request.get(url+'follow/group')
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.have.lengthOf(1);
					done();
				});
		});
		
		it('should follow user with group', function(done){
			request.put(url+'follow/0/'+user_ID[0]+'/'+group_ID)
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
	//});
	
	//describe('Follow Lists', function() {
		it('should get follow search', function(done){
			request.get(url+'follow/search/')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
		
		it('should get follow suggestions', function(done){
			request.get(url+'follow/suggestions/')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
		
		it('should get following', function(done){
			request.get(url+'follow/ing/')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
		
		it('should sign out', function(done){ signout(done); });
		it('should sign in', function(done){ signin(done,0); });
		
		it('should get followers', function(done){
			request.get(url+'follow/ers')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
		
		it('should follow back user', function(done){
			request.put(url+'follow/0/'+user_ID[1])
				.end(function(err,res) {
					if (err) { throw err; }
					
					res.body.should.equal(true);
					done();
				});
		});
		
		it('should get mutual follows (friends', function(done){
			request.get(url+'follow/friends')
				.end(function(err,res) {
					if (err) { throw err; }
					
					(res.body.length).should.be.within(1, 11);
					done();
				});
		});
	//});
	
	it('should delete user', function(done){ deleteUser(done); });
	
	it('should sign in', function(done){ signin(done,1); });
	it('should delete user', function(done){ deleteUser(done); });
});
