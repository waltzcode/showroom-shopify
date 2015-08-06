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
	# Global Feed Services - need add page nummber and page size path param.
	getGlobalLastestFeedURL: '/feed/latest/'
	getGlobalMostLikeFeedURL: '/feed/most/like/'
	getGlobalMostViewFeedURL: '/feed/most/view/'
	getGlobalMostShareFeedURL: '/feed/most/share/'
	getGlobalFeaturedFeedURL: '/feed/featured/'
	# Personal Feed
	getPersonalFeedURL: '/account/me/feed/'
	getPersonalShowURL: '/show/me/list/'
 	# User Services
	registerEmailAccountURL: '/account/email/register/'
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
		$sceDelegateProvider.resourceUrlWhitelist ['self', 'http://cdn.shopify.com/**', 'https://cdn.shopify.com/**']
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
