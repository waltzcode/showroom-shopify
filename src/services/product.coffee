angular.module 'showroomServices'
.factory 'productService', [
	'SHOWROOM_CONSTANTS'
	'sessionService'
	(SHOWROOM_CONSTANTS, sessionService) ->
		buildUr
		{
			getProductById: (productId) ->
				url = SHOWROOM_CONSTANTS.getProductByIdURL + productId + '/'
				sessionService.callService 'GET', url
		}
]