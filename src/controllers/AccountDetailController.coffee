angular.module 'showroomControllers'
.controller 'AccountDetailController', [
	'$scope', 'showService', 'userService', '$log', '$routeParams', 'videoService'
	($scope, showService, userService, $log, $routeParams, videoService) ->
		$scope.header = 'Account Show'
		$scope.currentPage = 0
		$scope.hasMore = true
		$scope.totalItem = 0

		$scope.loadMore = ->
			showService.getShowByUser accountId: $routeParams.accountId, pageNumber: $scope.currentPage++
			.then (response) ->
				if response.data.code == 1000
					if $scope.videos and angular.isArray $scope.videos
						$scope.videos = $scope.videos.concat videoService.parseVideo response:response.data
					else
						$scope.videos = videoService.parseVideo response:response.data
				else 
					$log.error response.data.message	
				$scope.hasMore = false if response.data.payload && $scope.videos.length >= $scope.totalItem

		userService.getAccountProfile accountId: $routeParams.accountId
		.then (response) ->
			if response.data.code == 1000
				accountInfo = response.data.payload.accountInfo
				$scope.totalItem = response.data.payload.showCounter
				$scope.header = accountInfo.firstName + ' ' + accountInfo.lastName + ' SHOW'
			$scope.loadMore()
]