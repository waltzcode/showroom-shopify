angular.module 'showroomControllers'
.controller 'ChannelDetailController', [
	'$scope', 'showService', '$log', '$routeParams', 'videoService'
	($scope, showService, $log, $routeParams, videoService) ->
		$scope.currentPage = 0
		$scope.hasMore = true

		$scope.loadMore = ->
			showService.getFeaturedByChannel channelId: $routeParams.channelId, pageNumber: $scope.currentPage++
			.then (response) ->
				if response.data.code == 1000
					$scope.header = response.data.payload.channel.name + ' Category'
					if $scope.videos and angular.isArray $scope.videos
						$scope.videos = $scope.videos.concat videoService.parseVideo response:response.data
					else
						$scope.videos = videoService.parseVideo response:response.data
					$scope.hasMore = false if response.data.payload && $scope.videos.length >= response.data.payload.totalItem
				else 
					$log.error response.data.message	
		$scope.loadMore()
]