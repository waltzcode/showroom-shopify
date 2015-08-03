angular.module 'showroomControllers'
.controller 'HeaderController', [
	'$scope', '$location'
	($scope, $location) ->
		$scope.searchUser = ->
			if $scope.userKeywords
				$location.search 'q', $scope.userKeywords
				$location.path '/user/search'
		$scope.searchShow = ->
			if $scope.showKeywords
				$location.search 'q', $scope.showKeywords
				$location.path '/show/search'
]