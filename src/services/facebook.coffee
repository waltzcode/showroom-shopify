angular.module 'showroomServices'
.factory 'facebookService', [
	'$q'
	'$window'
	($q, $window) ->
		{
			checkLoginStatus: ->
				deferred = $q.defer()
				$window.FB.getLoginStatus (response) ->
					if !response or response.erorr
						deferred.reject response.error or 'Facebook::Error when check login status.'
					else deferred.resolve response
				deferred.promise
			login: ->
				deferred = $q.defer()
				$window.FB.login (response) ->
					if !response or response.erorr
						deferred.reject response.error or 'Facebook::Error when login.'
					else deferred.resolve response
				deferred.promise
		}
]
