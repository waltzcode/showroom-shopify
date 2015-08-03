angular.module 'showroomControllers'
.controller 'NewestController', [
	'$scope', 'showService', 'videoService', '$log'
	($scope, showService, videoService, $log) ->
		$scope.header = 'Newest'
		showService.getGlobalMostLikeFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.videos = videoService.parseVideo({response: response.data})
]
