angular.module('app.route', [])
.config(
['$routeProvider',
function($routeProvider) {
	var _view_ = 'view/', _app_ = 'app/';
	$routeProvider
		// application
		.when('/app', 				{templateUrl:_view_+_app_+'index.html'})

		// sign up/in/reset
		.when('/sign/:action', 		{templateUrl:_view_+'account/sign.html'})
		.when('/confirm/:hash', 	{templateUrl:_view_+'account/confirm.html'})
		.when('/reset/:hash', 		{templateUrl:_view_+'account/reset.html'})
		
		
		// user
		.when('/profile/:profile_name', {templateUrl:_view_+'user/profile.html'}) // used for profile name
		.when('/user/edit', 		{templateUrl:_view_+'user/edit.html'})
		//when('/user/follow', 		{templateUrl:_view_+'user/follow.html'})
		.when('/user/invite', 		{templateUrl:_view_+'user/invite.html'})
		.when('/user/profile', 		{templateUrl:_view_+'user/profile.html'})
		.when('/user/profile/:profile_ID', {templateUrl:_view_+'user/profile.html'})

		// company plugin
		//when('/company/users', 	{templateUrl:_view_+'company/users.html'})
		.when('/company/edit', 		{templateUrl:_view_+'company/edit.html'})
		.when('/company/profile', 	{templateUrl:_view_+'company/profile.html'})

		// onboard
		.when('/onboard/password', 		{templateUrl:_view_+'onboard/password.html'})	// special case - force password change
		.when('/onboard/:page', 		{templateUrl:_view_+'onboard.html'})
		.when('/onboard/:page/:action', {templateUrl:_view_+'onboard.html'})
		
		// hub pages
		.when('/settings/:page', 		{templateUrl:_view_+'settings.html'})
		.when('/support/:page', 		{templateUrl:_view_+'support.html'})
		
		// extra pages
		//when('/bootstrap/:section', {templateUrl:_view_+'page/bootstrap.html'	}).

		// fallback
		.when('/', 						{templateUrl:_view_+'app/index.html'})
		.when('/:page', 				{templateUrl:_view_+'page.html'})
		.otherwise({redirectTo:'/'});
	
	// configure html5 to get links working
	// If you don't do this, you URLs will be base.com/#/home rather than base.com/home
	//$locationProvider.html5Mode(true);
}]);