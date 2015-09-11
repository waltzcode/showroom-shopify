angular.module 'showroomControllers'
.controller 'UserSearchController', [
	'userService','$scope', '$rootScope', '$location', '$log'
	(userService, $scope, $rootScope, $location, $log) ->
		# display setting
		$rootScope.removeHeader = false
		$rootScope.removeBrand = false
		$rootScope.removeNav = false
		$rootScope.removeFooter = false

		# check search panel displaying
		unless $('#search, #searchPanel').hasClass 'expanded'
			$('#search, #searchPanel').addClass 'expanded'

		$scope.keywords = $location.search().q
		userService.searchAccountByKeywords keywords: $scope.keywords
		.then (response) ->
			$scope.header = 'Search result for user - \'' + $scope.keywords + '\''
			$scope.users = response.data.payload.items if response.data.code is 1000
			$scope.message = response.data.message if response.data.code isnt 1000
]