//
// test/midway/routesSpec.js
//
describe("Testing Routes", function() {

  var test;

  before(function(done) {
    test = new ngMidwayTester();
    test.register('App', done);
  });

  it("should have a videos_path", function() {
    expect(ROUTER.routeDefined('videos_path')).to.equal(true);
    var url = ROUTER.routePath('videos_path');
    expect(url).to.equal('/videos');
  });

  it("the videos_path should goto the VideosCtrl controller", function() {
    var route = ROUTER.getRoute('videos_path');
    route.params.controller.should.equal('VideosCtrl');
  });

  it("the home_path should be the same as the videos_path", function() {
    expect(ROUTER.routeDefined('home_path')).to.equal(true);
    var url1 = ROUTER.routePath('home_path');
    var url2 = ROUTER.routePath('videos_path');
    expect(url1).to.equal(url2);
  });

});