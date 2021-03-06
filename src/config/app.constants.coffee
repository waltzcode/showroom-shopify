angular.module 'showroomApp'
.constant 'SHOWROOM_CONSTANTS', {

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