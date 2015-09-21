angular.module 'showroomControllers'
.controller 'AccountDetailController', [
	'$scope', '$rootScope', 'showService', 'userService', '$log', '$routeParams', 'videoService'
	($scope, $rootScope, showService, userService, $log, $routeParams, videoService) ->
		# display setting
		$rootScope.removeHeader = false
		$rootScope.removeBrand = false
		$rootScope.removeNav = false
		$rootScope.removeFooter = false

		$scope.header = 'Account Show'
		$scope.currentPage = 0
		$scope.hasMore = true
		$scope.videos = []

		$scope.loadMore = ->
			showService.getShowByUser accountId: $routeParams.accountId, pageNumber: $scope.currentPage++
			.then (response) ->
				if response.data.code == 1000
					$scope.videos = $scope.videos.concat videoService.parseVideo response:response.data
					$scope.hasMore = false if $scope.videos.length >= response.data.payload.totalItem
				else 
					$log.error response.data.message	

		userService.getAccountProfile accountId: $routeParams.accountId
		.then (response) ->
			if response.data.code == 1000
				accountInfo = response.data.payload.accountInfo
				$scope.header = accountInfo.firstName + ' ' + accountInfo.lastName + '\'S SHOWS'
			$scope.loadMore()
]