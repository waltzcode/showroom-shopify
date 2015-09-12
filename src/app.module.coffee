'use strict'
showroomApp = angular.module 'showroomApp', [
	'ngRoute'
	'ngAnimate'
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
	serviceHost: 							'//services.showroomapp.net'						# API server hostname.
	showroomCDN: 							'//cdn.showroomapp.tv/'								# CDN server for serving static resources

	# PARAMS FOR REGISTER A SESSION FOR CLIENT
	sessionParam: 							'showroomSId'										# session param name that should be stored in browser cookie
	serviceBundleId: 						'showroom.ios'										#
	serviceVersion: 						'1.0.8'												#

	# DISPLAY PARAMS
	BeautyChannelId: 						'84fccf26862232b49f2ad44fca89c667'					# Showroom system currently only using this category

	### ALL RESTFULL WEBSERVICE ENTRIES USED IN THE SHOWROOM SYSTEM ###

	# SESSION
	registerSessionURL: 					'/session/register'									# POST 	/:sessionId [deviceId, model, name, osName, osVersion, bundleId, bundleVersion, langeCode]
	
	# GLOBAL SHOW
	getGlobalLastestFeedURL: 				'/show/browse/latest/' 								# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalMostLikeFeedURL: 				'/show/browse/most/like/' 							# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalMostViewFeedURL: 				'/show/browse/most/view/' 							# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalMostShareFeedURL: 				'/show/browse/most/share/' 							# GET 	/:pageNumber/:pageSize/:sessionId
	getGlobalFeaturedFeedURL: 				'/show/browse/featured/' 							# GET 	/:pageNumber/:pageSize/:sessionId

	# SHOWS BY CHANNEL
	getFeaturedByChannelURL: 				'/show/browse/channel/featured/' 					# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getLastestByChannelURL: 				'/show/browse/channel/latest/' 						# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getMostLikeByChannelURL: 				'/show/browse/channel/most/like/' 					# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getMostViewByChannelURL: 				'/show/browse/channel/most/view/' 					# GET 	/:channelId/:pageNumber/:pageSize/:sessionId
	getMostShareByChannelURL: 				'/show/browse/channel/most/share/' 					# GET 	/:channelId/:pageNumber/:pageSize/:sessionId

	# SHOW FOR CURRENT USER
	getPersonalFeedURL: 					'/account/me/feed/' 								# GET 	/{pageNumber}/{pageSize}/{sessionId}
	getPersonalShowURL: 					'/show/me/list/'									# GET 	/{pageNumber}/{pageSize}/{sessionId}

	# SHOW BY SHOW ID
	getShowByIdURL: 						'/show/info/'										# GET 	/:showId/:sessionId

	# SHOW BY WITH USER/ACCOUNT
	getShowByUserURL: 						'/show/list/by/account/'							# GET 	/:accountId/:pageNumber/:pageSize/:sessionId
	getShowByUsernameURL:					'/show/list/by/username/'							# GET 	/:username/:pageNumber/:pageSize/:sessionId

	# CHANNEL
	getListChannelURL: 						'/channel/list/' 									# GET 	/:sessionId

 	# USERS, ACCOUNT
	registerEmailAccountURL: 				'/account/email/register/' 							# POST 	/:sessionId [email, password, firstName, lastName]
	resetEmailAccountPasswordURL: 			'/account/email/resetpassword/'						# POST 	/:sessionId [email]
	changeEmailAccountPasswordURL: 			'/account/email/changepassword/'					# POST 	/:sessionId [email, password, newPassword]
	loginEmailAccountURL: 					'/account/email/login/'								# PUT 	/:sessionId [email, password]
	loginFacebookAccountURL: 				'/account/facebook/login/'							# PUT 	/:sessionId [socialTokem]
	getLoggedInAccountInfoURL: 				'/account/me/info/'									# GET 	/:sessionId 
	logoutURL: 								'/account/me/logout/'								# GET 	/:sessionId
	getAccountProfileURL: 					'/account/info/'									# GET 	/:accountId/:sessionId

	# SEARCHING
	searchAccountByKeywordsURL: 			'/search/account/name/'								# GET 	/:keywords/:pageNumber/:pageSize/:sessionId
	searchShowByKeywordsURL: 				'/search/show/product/'								# GET 	/:keywords/:pageNumber/:pageSize/:sessionId

	# GET PRODUCT BY PRODUCT ID
	getProductByIdURL: 						'/product/info/'									# GET 	/:productId/:sessionId

	# SOCIAL ACTIONS
	likeAShowURL:							'/social/me/show/like/'								# GET 	/:showId/:sessionId
	unlikeAShowURL: 						'/social/me/show/unlike/' 							# GET 	/:showId/:sessionId
	checkLikeAShowURL: 						'/social/me/show/islike/' 							# GET 	/:showId/:sessionId
	commentAShowURL: 						'/social/me/show/comment/'							# POST 	/:showId/:sessionId
	removeCommentAShowURL: 					'/social/me/show/comment/remove/'					# DELETE /:socialActionId/:sessionId

	listCommentByShowDescURL: 				'/social/show/list/comment/desc/' 					# GET 	/:showId/:pageNumber/:pageSize/:sessionId
	listCommentByShowAscURL: 				'/social/show/list/comment/asc/' 					# GET 	/:showId/:pageNumber/:pageSize/:sessionId
}

showroomApp.config [
	'$interpolateProvider'
	'$sceDelegateProvider'
	'$sceProvider'
	'$logProvider'
	'cfpLoadingBarProvider'
	($interpolateProvider, $sceDelegateProvider, $sceProvider, $logProvider, cfpLoadingBarProvider) ->
		$interpolateProvider.startSymbol('{[{').endSymbol('}]}')
		# $sceDelegateProvider.resourceUrlWhitelist ['self', 'http://cdn.shopify.com/**', 'https://cdn.shopify.com/**']
		$sceProvider.enabled false
		# Enable/Disable Debug level message
		$logProvider.debugEnabled true
		# Turn the spinner off (loading-bar)
		cfpLoadingBarProvider.includeSpinner = false
]

showroomApp.run [
	'$rootScope'
	'$log'
	'userService'
	'$location'
	'$q'
	($rootScope, $log, userService, $location, $q) ->
		# check current session wherever logged in
		userService.getLoggedInAccountInfo()
			.then (response) ->
				if response.data.code == 1000
					$rootScope.loggedIn = true
					$rootScope.userInfo = response.data.payload
			.catch (error) -> $log.error error

		# create global logout function
		$rootScope.logout = ->
			userService.logout()
				.then (response) ->
					if response.data.code == 1000
						$rootScope.loggedIn = false
						$rootScope.userInfo = undefined
				.catch (error) -> $log.error error

		$rootScope.getUserInfo = ->
			return q.when $rootScope.userInfo if $rootScope.userInfo			
			userService.getLoggedInAccountInfo()
			.then (response) ->
				if response.data.code == 1000
					$q.when response.payload
				else $q.when undefined
			.catch (error) -> $log.error error

		# go to login page 
		$rootScope.goToLogin = ->
			currentPath = $location.path()
			$log.debug currentPath
			$location.path('/login').search({backUrl: currentPath})

]
