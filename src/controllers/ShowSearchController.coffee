angular.module 'showroomControllers'
.controller 'ShowSearchController', [
	'showService', 'videoService','$scope', '$location', '$log'
	(showService, videoService, $scope, $location, $log) ->
		$scope.keywords = $location.search().q
		$scope.header = 'Search result for show - \'' + $scope.keywords + '\''
		$scope.currentPage = 0
		$scope.hasMore = true

		$scope.loadMore = ->
			showService.searchShowByKeywords keywords: $scope.keywords, pageNumber: $scope.currentPage++
			.then (response) ->
				if angular.isArray($scope.videos) 
					$scope.videos = $scope.videos.concat videoService.parseVideo({response: response.data})		
				else 
					$scope.videos = videoService.parseVideo({response: response.data})
				$scope.hasMore = false if response.data.payload && $scope.videos.length >= response.data.payload.totalItem
		$scope.loadMore()
]