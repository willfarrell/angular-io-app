angular.module('app')
.config(['$routeProvider', function($routeProvider) {
	var _view_ = 'view/', _app_ = 'app/';
	$routeProvider

		// Angular.io Routes //
		// sign up/in/reset
		//.when('/confirm/:confirm_hash', {templateUrl:_view_+'sign/confirm.html'}) // move to sign/confirm/:hash ???
		//.when('/reset/:reset_hash',		{templateUrl:_view_+'sign/password.html'}) // add to sign/reset/:hash ???s

		// user
		//when('/user/follow',			{templateUrl:_view_+'user/follow.html'})
		.when('/user/message',			{templateUrl:_view_+'user/message.html'})
		.when('/user/message/:user_ID',	{templateUrl:_view_+'user/message.html'})
		.when('/user/invite',			{templateUrl:_view_+'user/invite.html'})

		//.when('/profile/:profile_name', {templateUrl:_view_+'user/profile.user.html'}) // used for profile name
		.when('/profile/:profile_name',	{templateUrl:_view_+'user/profile.company.html'}) // used for profile name
		.when('/user/profile',			{templateUrl:_view_+'user/profile.user.html'})
		.when('/user/profile/:profile_ID',		{templateUrl:_view_+'user/profile.user.html'})
		.when('/company/profile',		{templateUrl:_view_+'user/profile.company.html'})
		.when('/company/profile/:profile_ID',	{templateUrl:_view_+'user/profile.company.html'})



		// application
		.when('/app',					{templateUrl:_view_+_app_+'index.html'})

		// onboard
		.when('/onboard/password',			{templateUrl:_view_+'onboard/password.html'})	// special case - force password change ** move to page/? merge with reset/:hash ????

		// fallback
		.when('/',						{templateUrl:_view_+_app_+'index.html'})
		.when('/:page',					{
			template:'<div data-ng-include src="templateUrl"></div>',
			controller: 'TemplateUrlCtrl'
			//resolve: { resolveData: function(){ return 'test'; } }
		}) // ex 404
		.when('/:folder/:page',			{
			template:'<div data-ng-include src="templateUrl"></div>',
			controller: 'TemplateUrlCtrl'
			//resolve: { resolveData: function(){ return 'test'; } }
		}) // ex settings, support
		.when('/:folder/:page/:action',	{
			template:'<div data-ng-include src="templateUrl"></div>',
			controller: 'TemplateUrlCtrl'
			/*
			resolve: {
				resolveData: function($q, $timesout){
					var defer = $q.defer();

					$timeout(function() {
						defer.resolve();
						//defer.reject('reject message');
					}, 0);

					return defer.promise;
				}
			}
			*/
		}) // ex onboard
		.otherwise({redirectTo:'/'});
	// configure html5 to get links working
	// If you don't do this, you URLs will be base.com/#/home rather than base.com/home
	//$locationProvider.html5Mode(true);
}]);
