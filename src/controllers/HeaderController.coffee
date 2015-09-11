angular.module 'showroomControllers'
.controller 'HeaderController', [
	'$scope', '$location', 'channelService', '$log', '$filter', 'SHOWROOM_CONSTANTS'
	($scope, $location, channelService, $log, $filter, SHOWROOM_CONSTANTS) ->
		# Get channal list
		channelService.getListChannel().then (response) ->
			if response.data.code == 1000
				channels = response.data.payload.items
				$scope.channels = $filter('filter') channels, {parentChannelId: SHOWROOM_CONSTANTS.BeautyChannelId}, true
]