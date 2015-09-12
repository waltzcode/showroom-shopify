angular.module 'showroomDirectives'
.directive 'srVideoContainer', [
	'$log'
	($log) ->

		videoManager = (->
			listVideos = []

			_addVideo = (video) ->
				listVideos.push video

			_removeVideo = (video) ->
				for vd, i in listVideos
					listVideos.splice i, 1 if vd == video

			_playVideo = (video) ->

				# ignore unless video is paused
				# return unless video[0].paused
				
				# stop all video
				for vd in listVideos
					vd[0].pause()

				# play the given video from begining
				#video[0].load()
				#alert 'loading'
				video[0].play()
				video[0].currentTime = 0

			{
				addVideo: _addVideo
				removeVideo: _removeVideo
				playVideo: _playVideo
			}
		)()

		link = ($scope, $element, $attrs) ->

			video = $element.find('video').eq 0
			videoManager.addVideo video

			# Flag video is loading when play video
			video.on 'play', ->
				$element.addClass 'loading'

			# video.on 'canplaythrough', ->
			# 	alert 'canplaythrough'

			# Flag video is playing and remove loading status
			video.on 'playing', ->
				$element.removeClass 'loading'
				$element.addClass 'playing'	

			# Remove playing and loading status when pause video
			video.on 'pause', ->
				$element.removeClass 'playing'
				$element.removeClass 'loading'	

			# video.on 'waiting', ->
			# 	alert 'waiting'

			# play video when mouseover
			$element.on 'mouseover', ->
				videoManager.playVideo video

			$scope.$on '$destroy', -> videoManager.removeVideo video

		{
			restrict: 'A'
			link: link
		}
]