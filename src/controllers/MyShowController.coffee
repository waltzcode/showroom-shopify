angular.module 'showroomControllers'
.controller 'MyShowController', [
	'$scope', '$rootScope', 'showService', 'videoService', '$log'
	($scope, $rootScope, showService, videoService, $log) ->
		$scope.header = 'My shows'
		$scope.pageNumber = 0
		$scope.hasMore = true

		if $rootScope.loggedIn
			$scope.loadMore = ->
				showService.getPersonalShow pageNumber: $scope.pageNumber++ , pageSize: 15
				.then (response) ->
					if $scope.videos and angular.isArray $scope.videos
						$scope.videos = $scope.videos.concat videoService.parseVideo({response: response.data})
					else
						$scope.videos = videoService.parseVideo({response: response.data})

					$scope.hasMore = false if $scope.videos.length >= response.data.payload.totalItem
			$scope.loadMore()
]
