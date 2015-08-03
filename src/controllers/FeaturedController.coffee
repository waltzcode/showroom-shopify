angular.module 'showroomControllers'
.controller 'FeaturedController', [
	'$scope', 'showService', 'videoService', '$log'
	($scope, showService, videoService, $log) ->
		$scope.header = 'Featured'
		showService.getGlobalFeaturedFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.videos = videoService.parseVideo({response: response.data})
]
