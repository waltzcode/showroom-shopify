angular.module 'showroomControllers'
.controller 'PopularController', [
	'$scope', 'showService', 'videoService', '$log'
	($scope, showService, videoService, $log) ->
		$scope.header = 'Popular'
		showService.getGlobalMostLikeFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.videos = videoService.parseVideo({response: response.data})
]
