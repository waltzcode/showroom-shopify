angular.module 'showroomServices'
.factory 'videoService', [
	'SHOWROOM_CONSTANTS', 'VG_STATES', '$filter', '$sce', '$rootScope'
	(SHOWROOM_CONSTANTS, VG_STATES, $filter, $sce, $rootScope) ->
		parseVideo = (config) ->
			@response = config.response
			@currencySymbol = config.currencySymbol || '$'
			@exceprtTitleLength = config.exceprtTitleLength || 30
			@excerptMore = config.excerptMore || '...'
			@videoSize = config.videoSize || '400'
			@thumbnailSize = config.thumbnailSize || '700'
			if @response.code == 1000
				shows = @response.payload.listShows || @response.payload.items
				products = @response.payload.listProducts;
				videos = for show, index in shows
					preload: 'none'
					sources: [{
						src: $sce.trustAsResourceUrl SHOWROOM_CONSTANTS.showroomCDN + show.videoSets[@videoSize]
						type: 'video/mp4'
					}]
					poster: $sce.trustAsResourceUrl SHOWROOM_CONSTANTS.showroomCDN + show.thumbnailSets[@thumbnailSize]
					onPlayerReady: ($API) -> @API = $API
					play: ->
						$rootScope.currentAPI.stop() if $rootScope.currentAPI and $rootScope.currentAPI.currentState == VG_STATES.PLAY
						if @API and @API.currentAPI != VG_STATES.PLAY 
							$rootScope.currentAPI = @API
							@API.play()
					likeCounter: show.likeCounter
					viewCounter: show.viewCounter
					commentCounter: show.commentCounter
					shareCounter: show.shareCounter
					productName:$filter('excerptTitle')(products[index].name, @exceprtTitleLength, @excerptMore);
					productTitle: products[index].name;
					price: $filter('currency')(products[index].price, @currencySymbol, 2)
					productLinkUrl: $filter('productLink')($filter('jsonParse')(products[index].metaData).url)
					productLinkTarget: $filter('productTarget')($filter('jsonParse')(products[index].metaData).url)
		{parseVideo: parseVideo}
]