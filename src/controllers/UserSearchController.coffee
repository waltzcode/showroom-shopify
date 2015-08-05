angular.module 'showroomControllers'
.controller 'UserSearchController', [
	'userService','$scope', '$location', '$log'
	(userService, $scope, $location, $log) ->
		$scope.keywords = $location.search().q
		userService.searchAccountByKeywords keywords: $scope.keywords
		.then (response) ->
			$scope.header = 'Search result for \'' + $scope.keywords + '\''
			$scope.users = response.data.payload.items if response.data.code is 1000
			$scope.message = response.data.message if response.data.code isnt 1000
]