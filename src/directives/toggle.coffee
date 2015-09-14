angular.module 'showroomDirectives'
.directive 'srToggle', ->
	link = ($scope, $el, $attr) ->
		classes = $scope.toggleClass

		$el.on 'mouseover.srToggle', ->
			$el.addClass classes
		$el.on 'mouseout.srToggle', ->
			$el.removeClass classes
			
	# return directive config
	{
		restrict: 'A'
		scope:
			toggleClass: '@'
		link: link
	}
