'use strict'
showroomApp = angular.module 'showroomApp', [
	'ngRoute'
	'showroomServices'
	'showroomControllers'
	'showroomFilters'
	'showroomDirectives'
	'angular-loading-bar'
]
showroomServices = angular.module 'showroomServices', [
	'ngCookies'
	'ngSanitize',
	'com.2fdevs.videogular'
	'com.2fdevs.videogular.plugins.poster'
]
showroomControllers = angular.module 'showroomControllers', []
showroomFilters = angular.module 'showroomFilters', []
showroomDirectives = angular.module 'showroomDirectives', []

showroomApp.constant 'SHOWROOM_CONSTANTS', {
	# Service service
	serviceHost: '//services.showroomapp.net'
	# Showroom shopify website param
	sessionParam: 'showroomSId'
	serviceBundleId: 'showroom.ios'
	serviceVersion: '1.0.8'
	# Session Services
	registerSessionURL: '/session/register'
	# Global Feed /uri../{pageNumber}/{pageSize}/{sessionId}
	getGlobalLastestFeedURL: '/feed/latest/' # GET
	getGlobalMostLikeFeedURL: '/feed/most/like/' # GET
	getGlobalMostViewFeedURL: '/feed/most/view/' # GET
	getGlobalMostShareFeedURL: '/feed/most/share/' # GET
	getGlobalFeaturedFeedURL: '/feed/featured/' # GET
	getFeaturedByChannelURL: '/feed/channel/featured/' #GET
	# User Feed /uri../{pageNumber}/{pageSize}/{sessionId}
	getPersonalFeedURL: '/account/me/feed/' # GET
	getPersonalShowURL: '/show/me/list/' # GET
	getShowByUserURL: '/show/list/by/account/' # GET /:account/:pageNumber/:pageSize/:sessionId
	# Channel Service
	getListChannelURL: '/channel/list/' # GET /:sessionId
	# Channel Constants
	BeautyChannelId: '84fccf26862232b49f2ad44fca89c667'
 	# User Services
	registerEmailAccountURL: '/account/email/register/' # POST
	resetEmailAccountPasswordURL: '/account/email/resetpassword/'
	changeEmailAccountPasswordURL: '/account/email/changepassword/'
	loginEmailAccountURL: '/account/email/login/'
	loginFacebookAccountURL: '/account/facebook/login/'
	getLoggedInAccountInfoURL: '/account/me/info/'
	searchAccountByKeywordsURL: '/search/account/name/'
	searchShowByKeywordsURL: '/search/show/product/'
	logoutURL: '/account/me/logout/'
	# Showroom CDN
	showroomCDN: '//cdn.showroomapp.tv/'
}

showroomApp.config [
	'$interpolateProvider', '$sceDelegateProvider', '$sceProvider'
	($interpolateProvider, $sceDelegateProvider, $sceProvider) ->
		$interpolateProvider.startSymbol '{[{'
			.endSymbol '}]}'
		#$sceDelegateProvider.resourceUrlWhitelist ['self', 'http://cdn.shopify.com/**', 'https://cdn.shopify.com/**']
		$sceProvider.enabled false
]

showroomApp.run [
	'$rootScope', '$log', 'userService', '$q'
	($rootScope, $log, userService, $q) ->
		userService.getLoggedInAccountInfo()
			.then (response) ->
				if response.data.code == 1000
					$rootScope.loggedIn = true
					$rootScope.userInfo = response.payload
			.catch (error) -> $log.error error
		$rootScope.logout = ->
			userService.logout()
				.then (response) ->
					if response.data.code == 1000
						$rootScope.loggedIn = false
						$rootScope.userInfo = undefined
				.catch (error) -> $log.error error
]
