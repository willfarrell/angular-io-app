angular.module('io.directive.markdown', [])
// <markdown>
.directive('markdown', function() {
  	var converter = new Markdown.getSanitizingConverter();
  	
  	return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            element.html(converter.makeHtml(element.text()));
        }
    }
});
