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
		}
]
