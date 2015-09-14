angular.module 'showroomApp'
.config [
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
