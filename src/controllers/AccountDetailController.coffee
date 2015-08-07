angular.module 'showroomControllers'
.controller 'AccountDetailController', [
	'$scope', 'showService', '$log', '$routeParams', 'videoService'
	($scope, showService, $log, $routeParams, videoService) ->
		showService.getShowByUser account: $routeParams.accountId
		.then (response) ->
			if response.data.code == 1000
				$scope.header = 'Account Show'
			else 
				$log.error response.data.message	
]