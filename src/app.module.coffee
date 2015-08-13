'use strict'
showroomApp = angular.module 'showroomApp', [
	'ngRoute'
	'showroomServices'
	'showroomControllers'
	'showroomFilters'
	'showroomDirectives'
	'angular-loading-bar'
]

angular.module 'showroomServices', [
	'ngCookies'
]
angular.module 'showroomControllers', []
angular.module 'showroomFilters', []
angular.module 'showroomDirectives', []

### Showroom Store Configs ###
showroomApp.constant 'SHOWROOM_CONSTANTS', {

	# SERVER PARAMS
	serviceHost: 								'//services.showroomapp.net'						# API server hostname.
	showroomCDN: 								'//cdn.showroomapp.tv/'								# CDN server for serving static resources

	# PARAMS FOR REGISTER A SESSION FOR CLIENT
	sessionParam: 								'showroomSId'											# session param name that should be stored in browser cookie
	serviceBundleId: 							'showroom.ios'											#
	serviceVersion: 							'1.0.8'													#

	# DISPLAY PARAMS
	BeautyChannelId: 							'84fccf26862232b49f2ad44fca89c667'				# Showroom system currently only using this category

	### ALL RESTFULL WEBSERVICE ENTRIES USED IN THE SHOWROOM SYSTEM ###

	# SESSION
	registerSessionURL: 						'/session/register'									# POST 	/:sessionId [deviceId, model, name, osName, osVersion, bundleId, bundleVersion, langeCode]
	
	# GLOBAL SHOW
	getGlobalLastestFeedURL: 				'/show/browse/latest/' 								# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalMostLikeFeedURL: 				'/show/browse/most/like/' 							# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalMostViewFeedURL: 				'/show/browse/most/view/' 							# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalMostShareFeedURL: 			'/show/browse/most/share/' 						# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalFeaturedFeedURL: 				'/show/browse/featured/' 							# GET 	/:pageNumber/:pageSize/:sessionId

	# SHOWS BY CHANNEL
	getFeaturedByChannelURL: 				'/show/browse/channel/featured/' 				# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getLastestByChannelURL: 				'/show/browse/channel/latest/' 					# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getMostLikeByChannelURL: 				'/show/browse/channel/most/like/' 				# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getMostViewByChannelURL: 				'/show/browse/channel/most/view/' 				# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getMostShareByChannelURL: 				'/show/browse/channel/most/share/' 				# GET 	/:channelId/:pageNumber/:pageSize/:sessionId

	# SHOW FOR CURRENT USER
	getPersonalFeedURL: 						'/account/me/feed/' 									# GET 	/{pageNumber}/{pageSize}/{sessionId}
	getPersonalShowURL: 						'/show/me/list/'										# GET 	/{pageNumber}/{pageSize}/{sessionId}

	# SHOW BY WITH USER/ACCOUNT
	getShowByUserURL: 						'/show/list/by/account/'							# GET 	/:accountId/:pageNumber/:pageSize/:sessionId

	# CHANNEL
	getListChannelURL: 						'/channel/list/' 										# GET 	/:sessionId

 	# USERS, ACCOUNT
	registerEmailAccountURL: 				'/account/email/register/' 						# POST 	/:sessionId [email, password, firstName, lastName]
	resetEmailAccountPasswordURL: 		'/account/email/resetpassword/'					# POST 	/:sessionId [email]
	changeEmailAccountPasswordURL: 		'/account/email/changepassword/'					# POST 	/:sessionId [email, password, newPassword]
	loginEmailAccountURL: 					'/account/email/login/'								# PUT 	/:sessionId [email, password]
	loginFacebookAccountURL: 				'/account/facebook/login/'							# PUT 	/:sessionId [socialTokem]
	getLoggedInAccountInfoURL: 			'/account/me/info/'									# GET 	/:sessionId 
	logoutURL: 									'/account/me/logout/'								# GET 	/:sessionId
	getAccountProfileURL: 					'/account/info/'										# GET 	/:accountId/:sessionId

	# SEARCHING
	searchAccountByKeywordsURL: 			'/search/account/name/'								# /:keywords/:pageNumber/:pageSize/:sessionId
	searchShowByKeywordsURL: 				'/search/show/product/'								# /:keywords/:pageNumber/:pageSize/:sessionId
}

showroomApp.config [
	'$interpolateProvider'
	'$sceDelegateProvider'
	'$sceProvider'
	'$logProvider'
	($interpolateProvider, $sceDelegateProvider, $sceProvider, $logProvider) ->
		$interpolateProvider.startSymbol('{[{').endSymbol('}]}')
		# $sceDelegateProvider.resourceUrlWhitelist ['self', 'http://cdn.shopify.com/**', 'https://cdn.shopify.com/**']
		$sceProvider.enabled false
		# Enable/Disable Debug level message
		$logProvider.debugEnabled true
]

showroomApp.run [
	'$rootScope'
	'$log'
	'userService'
	'$q'
	($rootScope, $log, userService, $q) ->
		# check current session wherever logged in
		userService.getLoggedInAccountInfo()
			.then (response) ->
				if response.data.code == 1000
					$rootScope.loggedIn = true
					$rootScope.userInfo = response.payload
			.catch (error) -> $log.error error

		# create global logout function
		$rootScope.logout = ->
			userService.logout()
				.then (response) ->
					if response.data.code == 1000
						$rootScope.loggedIn = false
						$rootScope.userInfo = undefined
				.catch (error) -> $log.error error
]
