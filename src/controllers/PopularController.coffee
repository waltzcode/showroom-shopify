angular.module 'showroomControllers'
.controller 'PopularController', [
	'$scope', '$rootScope', 'showService', 'videoService', '$log'
	($scope, $rootScope, showService, videoService, $log) ->		
		# display setting
		$rootScope.removeHeader = false
		$rootScope.removeBrand = false
		$rootScope.removeNav = false
		$rootScope.removeFooter = false

		$scope.header = 'Popular'
		$scope.currentPage = 0
		$scope.hasMore = true

		$scope.loadMore = ->
			showService.getGlobalMostLikeFeed pageNumber: $scope.currentPage++ , pageSize: 15
			.then (response) ->
				if angular.isArray($scope.videos) 
					$scope.videos = $scope.videos.concat videoService.parseVideo({response: response.data})		
				else 
					$scope.videos = videoService.parseVideo({response: response.data})
				$scope.hasMore = false if response.data.payload && $scope.videos.length >= response.data.payload.totalItem
		$scope.loadMore()
]
