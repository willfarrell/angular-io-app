/**
 * Created with IntelliJ IDEA.
 * User: Mateusz
 * Date: 28.11.12
 * Time: 20:03
 */

angular.module('io')
.config(['$httpProvider', function ($httpProvider) {

	var $http,
		interceptor = ['$q', '$injector', function ($q, $injector) {

			function success(response) {
				return response;
			}

			function error(response) {
				if (response.status === 404 && response.config.url.indexOf('.html')) {

					// get $http via $injector because of circular dependency problem
					$http = $http || $injector.get('$http');

					var defer = $q.defer();
					$http.get('404.html')
						.then(function (result) {
							response.status = 200;
							response.data = result.data;
							defer.resolve(response);
						}, function () {
							defer.reject(response);
						});

					return defer.promise;// response;
				} else {
					return $q.reject(response);
				}
			}

			return function (promise) {
				return promise.then(success, error);
			};
		}];

	$httpProvider.responseInterceptors.push(interceptor);
}]);