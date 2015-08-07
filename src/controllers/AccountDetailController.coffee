angular.module 'showroomControllers'
.controller 'AccountDetailController', [
	'$scope', 'showService', '$log', '$routeParams', 'videoService'
	($scope, showService, $log, $routeParams, videoService) ->
		showService.getShowByUser accountId: $routeParams.accountId
		.then (response) ->
			if response.data.code == 1000
				$scope.header = 'Account Show'
				$scope.videos= videoService.parseVideo response:response.data
			else 
				$log.error response.data.message	
]