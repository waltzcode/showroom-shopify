angular.module 'showroomDirectives'
.directive 'srVideoContainer', [
	'$log'
	'$timeout'
	($log, $timeout) ->

		videoManager = (->

			listVideos = []
			listContainers = []

			# Push video and video's container to the lists
			_addVideo = (video, container) ->
				listVideos.push video
				listContainers.push container

			# Remove video and video's container from the lists
			_removeVideo = (video) ->
				for vd, i in listVideos
					if vd == video
						listVideos.splice i, 1 
						listContainers.splice i, 1

			# Play a video
			_playVideo = (video, container) ->
				# ignore unless video is paused
				return if container.hasClass 'playing loading'
				
				# stop all video
				vd[0].pause() for vd in listVideos
				el.removeClass 'loading playing' for el in listContainers

					

				# play the given video from begining
				video[0].play()

				if video[0].readyState != 4 # HAVE_ENOUGH_DATA
					$log.debug 'readyState = ' + video[0].readyState
					# turn on spinner
					container.addClass 'loading'
					video.on 'canplaythrough.srVideo load.srVideo', ->
						# remove event listeners
						video.off 'canplaythrough.srVideo load.srVideo'
						# turn off spinner and display video
						container.removeClass 'loading'
						container.addClass 'playing'
						#play video
						video[0].play()
					$timeout ->
							video[0].pause()
						, 
							1
				else # video is ready and is playing
					# add class 'playing' to container to user can see the video
					container.addClass 'playing'
					# remove class 'playing' when video ended or paused
					video.on 'paused.srVideo', ->
						container.removeClass 'playing'
						video[0].off 'paused.srVideo'

				# do video play from begin
				video[0].currentTime = 0.1

			{
				addVideo: _addVideo
				removeVideo: _removeVideo
				playVideo: _playVideo
			}
		)()

		link = ($scope, $element, $attrs) ->

			# add video and video container to the lists which is managed by videoManger object.
			video = $element.find('video').eq 0
			videoManager.addVideo video, $element
			# play video when mouseover event
			$element.on 'mouseover', ->
				videoManager.playVideo video, $element
			# remove video and container from managed lists when container destroy.
			$scope.$on '$destroy', -> videoManager.removeVideo video
			
		# directive configuration
		{
			restrict: 'A'
			link: link
		}
]