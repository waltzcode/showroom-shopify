angular.module 'showroomControllers'
.controller 'ShowSearchController', [
	'showService', 'videoService','$scope', '$location', '$log'
	(showService, videoService, $scope, $location, $log) ->
		$scope.keywords = $location.search().q
		showService.searchShowByKeywords keywords: $scope.keywords
		.then (response) ->
			$scope.header = 'Search result for show - \'' + $scope.keywords + '\''
			$scope.shows = response.data.payload.items if response.data.code is 1000
			$scope.totalItem = response.data.payload.totalItem
			$scope.videos = videoService.parseVideo response: response.data
			$scope.message = response.data.message if response.data.code isnt 1000
]