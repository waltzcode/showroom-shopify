angular.module 'showroomDirectives'
.directive 'srLazySrc', [
	'$document'
	'$window'
	'$interval'
	'$timeout'
	'$log'
	($document, $window, $interval, $timeout, $log) ->
		
		lazyLoader = (->

			images = []

			renderTimer = null
			renderDeley = 350

			documentWatchingTimer = null
			documentWatchingDeley = 1000

			# cache the currently document height
			$docHeigth = 0

			win = angular.element $window

			checkImages = ->
				windowHeight = win.height()
				scrollTop = win.scrollTop()
				visible = []
				hidden = []
				topFoldOffset = scrollTop
				bottomFoldOffset = scrollTop + windowHeight
				# if an image is visible, render it and remove it from the managed images
				
				for image, index in images
					if image.isVisible topFoldOffset, bottomFoldOffset
						visible.push image
					else
						hidden.push image

				image.render() for image in visible
				images = hidden
				stopRender()
				stopWatchingWindow() unless images.length

			onWatchingDocument = ->
				currentDocHeight = $document.height()
				startRender() if $docHeigth and currentDocHeight != $docHeigth
				$docHeigth = currentDocHeight
							
			startRender = ->
				renderTimer ?= $timeout checkImages, renderDeley

			stopRender = ->
				$timeout.cancel renderTimer if renderTimer
				renderTimer = null

			startWatchingWindow = ->
				documentWatchingTimer ?= $interval onWatchingDocument, documentWatchingDeley
				win.on 'resize.srLazySrc scroll.srLazySrc', startRender

			stopWatchingWindow = ->
				$log.debug 'Stop watching window'
				$interval.cancel documentWatchingTimer if documentWatchingTimer
				documentWatchingTimer = null
				win.off 'resize.srLazySrc scroll.srLazySrc'

			addImage = (image) ->
				images.push image
				startRender()
				startWatchingWindow() unless documentWatchingTimer

			removeImage = (image) ->
				for img, i in images
					images.splice i, 1 if img == image
				unless images.length > 0
					stopRender()
					stopWatchingWindow()

			publicAPI = 
				addImage: addImage
				removeImage: removeImage

			publicAPI
		)()

		# represent a single Lazy-Loading Image.
		class LazyImage
			constructor: (@image) ->
				@rendered = false
			isVisible: (topFoldOffset, bottomFoldOffset) ->
				return false unless @image.is ':visible'
				height = @image.height()
				top = @image.offset().top
				bottom = top + height
				isVisible = (top >= topFoldOffset && top <= bottomFoldOffset) ||
							(bottom >= topFoldOffset && bottom <= bottomFoldOffset) ||
							(top <= topFoldOffset && bottom >= bottomFoldOffset)
				isVisible
			render: ->
				@rendered = true
				@renderSource()
			setSource: (@source) ->
				@renderSource() if @rendered
			renderSource: ->
				@image.attr 'src', @source
		
		# Directive link function.	
		link = ($scope, $el, $attrs) ->
			image = new LazyImage $el
			$attrs.$observe 'srLazySrc', (source) -> image.setSource source
			lazyLoader.addImage image

			$scope.$on '$destroy', ->
				lazyLoader.removeImage image

		# return the directive configuration.
		{
			link: link
			restrict: 'A'
		}
]