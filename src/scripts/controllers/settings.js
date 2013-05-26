function SettingsCtrl($scope, $session) {
	console.log('SettingsCtrl (', $scope.$id, ')');
	$session.require_signin();
}
SettingsCtrl.$inject = ['$scope', '$session'];