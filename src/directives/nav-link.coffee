angular.module 'showroomDirectives'
.directive 'srNavHref', [
	'$location', '$rootScope', '$timeout'
	($location, $rootScope, $timeout) ->
		link = ($scope, $el, $attr) ->
			onClick = ($event) ->
				# go to location
				$location.path $scope.srNavHref if $scope.srNavHref
				# close shifter page
				if jQuery and jQuery.shifter
					jQuery.shifter 'close'
				$scope.$apply()

			$el.on 'click.srNavHref', onClick
				
		# return directive config
		{
			restrict: 'A'
			scope:
				srNavHref: '@'
			link: link
		}
]