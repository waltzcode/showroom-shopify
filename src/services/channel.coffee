angular.module 'showroomServices'
.factory 'channelService', [
	'sessionService'
	'$q'
	'SHOWROOM_CONSTANTS'
	'$log'
	(sessionService, $q, SHOWROOM_CONSTANTS, $log) ->
		{
			getListChannel: -> sessionService.callService 'GET', SHOWROOM_CONSTANTS.getListChannelURL
		}
]