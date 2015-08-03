angular.module 'showroomControllers'
.controller 'MyShowController', [
	'$scope', '$rootScope', 'showService', 'videoService', '$log'
	($scope, $rootScope, showService, videoService, $log) ->
		$scope.header = 'My shows'
		if $rootScope.loggedIn
			showService.getPersonalShow pageNumber: 0, pageSize: 15
			.then (response) -> $scope.videos = videoService.parseVideo({response: response.data})
]
