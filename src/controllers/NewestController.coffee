angular.module 'showroomControllers'
.controller 'NewestController', [
	'$scope', 'showService', 'videoService', '$log'
	($scope, showService, videoService, $log) ->
		$scope.header = 'Newest'
		showService.getGlobalLastestFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.videos = videoService.parseVideo({response: response.data})
]
