angular.module 'showroomServices'
.factory 'showService', [
	'SHOWROOM_CONSTANTS', 'sessionService', '$http', '$q'
	(SHOWROOM_CONSTANTS, sessionService) ->
		buildUri = (uri, pagging) ->
			pageNumber = pagging.pageNumber or 0;
			pageSize = pagging.pageSize || 15
			uri + pageNumber + '/' + pageSize + '/'

		{
			getGlobalLastestFeed: (pagging) ->
				sessionService.callService 'GET', buildUri SHOWROOM_CONSTANTS.getGlobalLastestFeedURL
			getGlobalMostLikeFeed: (pagging) ->
				sessionService.callService 'GET', buildUri SHOWROOM_CONSTANTS.getGlobalMostLikeFeedURL
		}
]
