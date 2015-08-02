angular.module 'showroomServices'
.factory 'sessionService', [
	'$cookies'
	'$http'
	'$q'
	'SHOWROOM_CONSTANTS'
	($cookies, $http, $q, SHOWROOM_CONSTANTS) ->
		{
			getSessionId: ->
				deferred = $q.defer()
				sessionId = $cookies.get SHOWROOM_CONSTANTS.sessionParam
				now = new Date()
				exp = new Date now.getTime() + 40*50*1000

				guid = ->
					_p8 = (s) ->
						p = (Math.random().toString(16) + "000000000").substr 2,8
						if s then "-" + p.substr(0,4) + "-" + p.substr(4,4) else p
					_p8() + _p8(true) + _p8(true) + _p8()

				data =
					deviceId: guid()
					model: 'WC_MR.Richard'
					name: 'Website Client'
					osName: ''
					osVersion: ''
					bundleId: SHOWROOM_CONSTANTS.serviceBundleId
					bundleVersion: SHOWROOM_CONSTANTS.serviceVersion
					langCode: ''

				if sessionId
					$cookies.put SHOWROOM_CONSTANTS.sessionParam, sessionId, expires: exp
					deferred.resolve sessionId
				else
					$http.post SHOWROOM_CONSTANTS.serviceHost + SHOWROOM_CONSTANTS.registerSessionURL, data: data
					.then (response) ->
						if response.code == 1000
							$cookies.put SHOWROOM_CONSTANTS.sessionParam, response.payload.sessionId, expires: exp
							deferred.resolve response.payload.sessionId
						else
							deferred.reject response.message
					.catch (error) -> deferred.reject error
				deferred.promise

			callService: (method, uri, data) ->
				@getSessionId()
				.then (sessionId) ->
					url = SHOWROOM_CONSTANTS.serviceHost + uri + sessionId
					$http {
						url: url
						method: method
						data: data
					}
		}
]
