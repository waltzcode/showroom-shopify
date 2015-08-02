angular.module 'showroomServices'
.factory 'showService', [
	'SHOWROOM_CONSTANTS', 'sessionService'
	(SHOWROOM_CONSTANTS, sessionService) ->
		buildUri = (uri, pagging) ->
			pageNumber = pagging.pageNumber or 0;
			pageSize = pagging.pageSize || 15
			uri + pageNumber + '/' + pageSize + '/'

		{
			getGlobalLastestFeed: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getGlobalLastestFeedURL, pagging)
			getGlobalMostLikeFeed: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostLikeFeedURL, pagging)
			getGlobalMostViewFeed: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostViewFeedURL, pagging)
			getGlobalMostShareFeed: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostShareFeedURL, pagging)
			getGlobalFeaturedFeed: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getGlobalFeaturedFeedURL, pagging)
			getPersonalFeed: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getPersonalFeedURL, pagging)
			getPersonalShow: (pagging) ->
				sessionService.callService 'GET', buildUri(SHOWROOM_CONSTANTS.getPersonalShowURL, pagging)
		}
]
