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
		.when('/confirm/:confirm_hash', {templateUrl:_view_+'account/confirm.html'})
		.when('/reset/:reset_hash', 	{templateUrl:_view_+'account/reset.html'})
		
		
		// user
		//when('/user/follow', 		{templateUrl:_view_+'user/follow.html'})
		.when('/user/message', 		{templateUrl:_view_+'user/message.html'})
		.when('/user/message/:user_ID', {templateUrl:_view_+'user/message.html'})
		.when('/user/invite', 		{templateUrl:_view_+'user/invite.html'})
		
		.when('/profile/:profile_name', {templateUrl:_view_+'user/profile.html'}) // used for profile name
		.when('/user/profile', 		{templateUrl:_view_+'user/profile.html'})
		.when('/user/profile/:profile_ID', {templateUrl:_view_+'user/profile.html'})
		.when('/company/profile', 	{templateUrl:_view_+'user/profile.company.html'})

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
		.when('/', 						{templateUrl:_view_+_app_+'index.html'})
		.when('/:page', 				{templateUrl:_view_+'page.html'})
		.otherwise({redirectTo:'/'});
	
	// configure html5 to get links working
	// If you don't do this, you URLs will be base.com/#/home rather than base.com/home
	//$locationProvider.html5Mode(true);
}]);