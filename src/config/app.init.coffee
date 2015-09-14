angular.module 'showroomApp'
.run [
	'$rootScope'
	'$log'
	'$filter'
	'userService'
	'channelService'
	'SHOWROOM_CONSTANTS'
	'$location'
	'$q'
	($rootScope, $log, $filter, userService, channelService, SHOWROOM_CONSTANTS, $location, $q) ->

		# check current session wherever logged in
		userService.getLoggedInAccountInfo()
			.then (response) ->
				if response.data.code == 1000
					$rootScope.loggedIn = true
					$rootScope.userInfo = response.data.payload
			.catch (error) -> $log.error error

		# Get channal list
		channelService.getListChannel().then (response) ->
			if response.data.code == 1000
				channels = response.data.payload.items
				$rootScope.channels = $filter('filter') channels, {parentChannelId: SHOWROOM_CONSTANTS.BeautyChannelId}, true

		# create global logout function
		$rootScope.logout = ->
			userService.logout()
				.then (response) ->
					if response.data.code == 1000
						$rootScope.loggedIn = false
						$rootScope.userInfo = undefined
				.catch (error) -> $log.error error

		$rootScope.getUserInfo = ->
			return q.when $rootScope.userInfo if $rootScope.userInfo			
			userService.getLoggedInAccountInfo()
			.then (response) ->
				if response.data.code == 1000
					$q.when response.payload
				else $q.when undefined
			.catch (error) -> $log.error error

		# go to login page 
		$rootScope.goToLogin = ->
			currentPath = $location.path()
			$log.debug currentPath
			$location.path('/login').search({backUrl: currentPath})
]