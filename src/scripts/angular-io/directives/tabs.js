angular.module('io.directives').
directive('tabs', function() {
	return {
	restrict: 'E',
	transclude: true,
	scope: {},
	controller: function($scope, $element) {
		var panes = $scope.panes = [];
		$scope.select = function(pane) {
			angular.forEach(panes, function(pane) {
				pane.selected = false;
			});
			pane.selected = true;
		};
		this.addPane = function(pane) {
			if (panes.length === 0) { $scope.select(pane); }
			panes.push(pane);
		};
	},
	template:
		'<div class="tabbable">' +
			'<ul class="nav nav-tabs">' +
				'<li data-ng-repeat="pane in panes" data-ng-class="{active:pane.selected}">'+
					'<a href="" data-ng-click="select(pane)">{{pane.title}}</a>' +
				'</li>' +
			'</ul>' +
			'<div class="tab-content" data-ng-transclude></div>' +
		'</div>',
	replace: true
	};
  }).
  directive('pane', function() {
	return {
	require: '^tabs',
	restrict: 'E',
	transclude: true,
	scope: { title: '@' },
	link: function(scope, element, attrs, tabsCtrl) {
		tabsCtrl.addPane(scope);
	},
	template:
		'<div class="tab-pane" data-ng-class="{active: selected}" data-ng-transclude>' +
		'</div>',
	replace: true
	};
});