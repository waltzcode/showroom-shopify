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
		unless $('body').hasClass 'search-open'
			$('body').addClass 'search-open'

		$scope.keywords = $location.search().q

		$scope.header = 'Search result for user - \'' + $scope.keywords + '\''
		$scope.currentPage = 0
		$scope.hasMore = true
		$scope.users = []

		$scope.loadMore = ->
			userService.searchAccountByKeywords keywords: $scope.keywords, pageNumber: $scope.currentPage++
			.then (response) ->
				if response.data.code == 1000
					$scope.users = $scope.users.concat response.data.payload.items
					$scope.hasMore = false if $scope.users.length >= response.data.payload.totalItem
				else 
					$scope.hasMore = false
					$scope.message = response.data.message

		# First load
		$scope.loadMore()
]