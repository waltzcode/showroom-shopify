angular.module 'showroomServices'
.factory 'socialService', [
	'SHOWROOM_CONSTANTS'
	'sessionService'
	(SHOWROOM_CONSTANTS, sessionService) ->
		{
			likeAShow: (showId) ->
				url = SHOWROOM_CONSTANTS.likeAShowURL + showId + '/'
				sessionService.callService 'GET', url
			unlikeAShow: (showId) ->
				url = SHOWROOM_CONSTANTS.unlikeAShowURL + showId + '/'
				sessionService.callService 'GET', url
			checkLikeAShow: (showId) ->
				url = SHOWROOM_CONSTANTS.checkLikeAShowURL + showId + '/'
				sessionService.callService 'GET', url
			commentAShow: (showId, data) ->
				url = SHOWROOM_CONSTANTS.commentAShowURL + showId + '/'
				sessionService.callService 'POST', url, data
			removeCommentAShow: (socialActionId) ->
				url = SHOWROOM_CONSTANTS.removeCommentAShowURL + socialActionId + '/'
				sessionService.callService 'DELETE', url
			listCommentByShow: (params) ->
				showId = params.showId
				pageNumber = params.pageNumber || 0
				pageSize = params.pageSize || 10
				sortType = params.sortType || 'desc'
				if sortType == 'desc'
					uri = SHOWROOM_CONSTANTS.listCommentByShowDescURL
				else
					uri = SHOWROOM_CONSTANTS.listCommentByShowAscURL
				url = uri + showId + '/' + pageNumber + '/' + pageSize + '/'
				sessionService.callService 'GET', url
		}
]