angular.module 'showroomServices'
.factory 'videoService', [
	'SHOWROOM_CONSTANTS'
	'socialService'
	'$rootScope'
	'$filter'
	'$sce'
	(SHOWROOM_CONSTANTS, socialService, $rootScope, $filter, $sce) ->
		# parse video from the payload that return a list of shows.
		parseVideo = (config) ->
			@response = config.response
			@currencySymbol = config.currencySymbol || '$'
			@exceprtTitleLength = config.exceprtTitleLength || 35
			@excerptMore = config.excerptMore || ' ...'
			@videoSize = config.videoSize || '700'
			@thumbnailSize = config.thumbnailSize || '700'
			if @response.code == 1000
				shows = @response.payload.listShows || @response.payload.items
				products = @response.payload.listProducts;
				productMap = {}
				productMap[product.id] = product for product in products
				videos = for show, index in shows
					sources: [{
						src: $sce.trustAsResourceUrl SHOWROOM_CONSTANTS.showroomCDN + show.videoSets[@videoSize]
						type: 'video/mp4'
					}]
					showId: show.id
					poster: $sce.trustAsResourceUrl SHOWROOM_CONSTANTS.showroomCDN + show.thumbnailSets[@thumbnailSize]
					likeCounter: show.likeCounter
					viewCounter: show.viewCounter
					commentCounter: show.commentCounter
					likeClick: ->
						$rootScope.goToLogin() unless $rootScope.loggedIn
					shareCounter: show.shareCounter
					productName: $filter('excerptTitle')(productMap[show.productId].name, @exceprtTitleLength, @excerptMore);
					productTitle: productMap[show.productId].name;
					price: $filter('number')(productMap[show.productId].price, 2)
					productLinkUrl: $filter('productLink')($filter('jsonParse')(productMap[show.productId].metaData).url)
					productLinkTarget: $filter('productTarget')($filter('jsonParse')(productMap[show.productId].metaData).url)

		# parse single video from show info and product info
		# @param data an object with data.show and data.product
		parseSingleVideo = (data) ->
			show = data.show
			product = data.product
			videoSize = data.videoSize || '700'
			thumbnailSize = data.thumbnailSize || '700'
			video = 
				sources: [{
					src: $sce.trustAsResourceUrl SHOWROOM_CONSTANTS.showroomCDN + show.videoSets[videoSize]
					type: 'video/mp4'
				}]
				poster: $sce.trustAsResourceUrl SHOWROOM_CONSTANTS.showroomCDN + show.thumbnailSets[thumbnailSize]


		# public APIs for the video service.
		{
			parseVideo: parseVideo
			parseSingleVideo: parseSingleVideo
		}
]