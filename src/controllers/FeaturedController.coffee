angular.module 'showroomControllers'
.controller 'FeaturedController', [
	'$scope', 'showService', 'videoService', '$log', 'SHOWROOM_CONSTANTS'
	($scope, showService, videoService, $log, SHOWROOM_CONSTANTS) ->
		$scope.header = 'Featured'
		showService.getFeaturedByChannel channelId: SHOWROOM_CONSTANTS.BeautyChannelId
		.then (response) -> $scope.videos = videoService.parseVideo({response: response.data})
]
