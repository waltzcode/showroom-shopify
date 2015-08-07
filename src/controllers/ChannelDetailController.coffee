angular.module 'showroomControllers'
.controller 'ChannelDetailController', [
	'$scope', 'showService', '$log', '$routeParams', 'videoService'
	($scope, showService, $log, $routeParams, videoService) ->
		showService.getFeaturedByChannel channelId: $routeParams.channelId
		.then (response) ->
			if response.data.code == 1000
				$scope.header = $routeParams.channelId + ' Category'
				$scope.videos= videoService.parseVideo response:response.data
			else 
				$log.error response.data.message	
]