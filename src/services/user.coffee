angular.module 'showroomServices'
.factory 'userService', [
	'SHOWROOM_CONSTANTS', 'sessionService'
	(SHOWROOM_CONSTANTS, sessionService) ->
		{
			registerEmailAccount: (data) ->
				sessionService.callService 'POST', SHOWROOM_CONSTANTS.registerEmailAccountURL, data
			resetEmailAccountPassword: (data) ->
				sessionService.callService 'POST', SHOWROOM_CONSTANTS.resetEmailAccountPasswordURL, data
			changeEmailAccountPassword: (data) ->
				sessionService.callService 'POST', SHOWROOM_CONSTANTS.changeEmailAccountPasswordURL, data
			loginEmailAccount: (data) ->
				sessionService.callService 'PUT', SHOWROOM_CONSTANTS.loginEmailAccountURL, data
			loginFacebookAccount: (data) ->
				sessionService.callService 'PUT', SHOWROOM_CONSTANTS.loginFacebookAccountURL, data
			getLoggedInAccountInfo:  ->
				sessionService.callService 'GET', SHOWROOM_CONSTANTS.getLoggedInAccountInfoURL, null
			logout: ->
				sessionService.callService 'GET', SHOWROOM_CONSTANTS.logoutURL, null
			searchAccountByKeywords: (options) ->
				keywords = options.keywords
				pageNumber = options.pageNumber || 0
				pageSize = options.pageSize || 15
				url = SHOWROOM_CONSTANTS.searchAccountByKeywordsURL + keywords + '/' + pageNumber + '/' + pageSize + '/'
				sessionService.callService 'GET', url
			getAccountProfile: (options) ->
				accountId = options.accountId
				url = SHOWROOM_CONSTANTS.getAccountProfileURL + accountId + '/'
				sessionService.callService 'GET', url
		}
]
