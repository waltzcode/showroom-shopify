angular.module 'showroomControllers'
.controller 'FeaturedController', [
	'$scope', 'showService', 'videoService', '$log', 'SHOWROOM_CONSTANTS'
	($scope, showService, videoService, $log, SHOWROOM_CONSTANTS) ->
		$scope.header = 'Featured'
		$scope.currentPage = 0
		$scope.hasMore = true

		$scope.loadMore = ->
			showService.getFeaturedByChannel channelId: SHOWROOM_CONSTANTS.BeautyChannelId, pageNumber: $scope.currentPage++
			.then (response) ->
				if angular.isArray($scope.videos) 
					$scope.videos = $scope.videos.concat videoService.parseVideo({response: response.data})		
				else 
					$scope.videos = videoService.parseVideo({response: response.data})
				$scope.hasMore = false if response.data.payload && $scope.videos.length >= response.data.payload.totalItem

		$scope.loadMore()
]
