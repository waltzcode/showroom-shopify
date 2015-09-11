angular.module 'showroomControllers'
.controller 'ShowSearchController', [
	'showService', 'videoService','$scope', '$rootScope', '$location', '$log'
	(showService, videoService, $scope, $rootScope, $location, $log) ->

		# display setting
		$rootScope.removeHeader = false
		$rootScope.removeBrand = false
		$rootScope.removeNav = false
		$rootScope.removeFooter = false

		# check search panel displaying
		unless $('#search, #searchPanel').hasClass 'expanded'
			$('#search, #searchPanel').addClass 'expanded'


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