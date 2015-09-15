angular.module 'showroomDirectives'
.directive 'srToggleSearch', [
	'$document'
	($document) ->
		link = ($scope, $element, $attr) ->
			$body = $document.find('body')
			$element.on 'click.srToggleSearch', ->
				$body.toggleClass 'search-open'
		{
			restrict: 'A'
			link: link
		}
]