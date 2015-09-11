angular.module 'showroomControllers'
.controller 'SearchFormController', [
	'$location', '$scope'
	($location, $scope) ->

		# check path and query param
		path =  $location.path()
		search = $location.search()
		if search.q
			switch path
				when '/search/user' then $scope.userKeywords = search.q
				when '/search/show' then $scope.showKeywords = search.q

		collapseMenu = ->
			if jQuery and jQuery.shifter
				jQuery.shifter 'close'

		$scope.searchUser = ->
			if $scope.userKeywords
				$scope.showKeywords = ''

				collapseMenu()

				$location.search 'q', $scope.userKeywords
				$location.path '/search/user'
		$scope.searchShow = ->
			if $scope.showKeywords
				$scope.userKeywords = ''

				collapseMenu()

				$location.search 'q', $scope.showKeywords
				$location.path '/search/show'
]