angular.module 'showroomControllers'
.controller 'HomeController', [
	'showService', 'videoService', '$scope', '$rootScope', '$log', '$q', '$location'
	(showService, videoService, $scope, $rootScope, $log, $q, $location) ->
		# View Setttings
		$rootScope.removeHeader = false
		$rootScope.removeBrand = false
		$rootScope.removeNav = false
		$rootScope.removeFooter = false
		if $rootScope.loggedIn
			showService.getPersonalFeed pageNumber: 0, pageSize: 15
			.then (response) -> $scope.myFeedVideos = videoService.parseVideo response: response.data
			showService.getPersonalShow pageNumber: 0, pageSize: 15
			.then (response) -> $scope.myShowVideos = videoService.parseVideo response: response.data
		showService.getGlobalFeaturedFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.featuredVideos = videoService.parseVideo response: response.data
		showService.getGlobalMostLikeFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.popularVideos = videoService.parseVideo response: response.data
		showService.getGlobalLastestFeed pageNumber: 0, pageSize: 15
		.then (response) -> $scope.newestVideos = videoService.parseVideo response: response.data
]