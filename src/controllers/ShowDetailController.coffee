angular.module 'showroomControllers'
.controller 'ShowDetailController', [
	'$scope', 'showService', 'socialService', '$filter', '$log', '$routeParams', 'videoService', '$location', '$rootScope'
	($scope, showService, socialService, $filter, $log, $routeParams, videoService, $location, $rootScope) ->

		# display setting
		$rootScope.removeHeader = false
		$rootScope.removeBrand = false
		$rootScope.removeNav = false
		$rootScope.removeFooter = false

		# get showId from path
		showId = $routeParams.showId
		# redirect to home page unless has showId
		$location.path('/').replace() unless showId 
		$scope.showId = showId

		# comment method
		# Dedicated
		$scope.likeClick = (event) ->
			$rootScope.goToLogin() unless $rootScope.loggedIn
			
			if $scope.isLiked
				socialService.unlikeAShow showId
				.then (response) ->
					if response.data.code == 1000
						$scope.isLiked = false 
						$scope.likeCounter--
			else
				socialService.likeAShow showId
				.then (response) ->
					if response.data.code == 1000
						$scope.isLiked = true 
						$scope.likeCounter++

		# get show information with showId
		$scope.loadShow = ->
			showService.getShowById showId
			.then (response) ->
				# validate response
				$location.path '/' if !response.data or response.data.code != 1000

				# pass ShowInfo, Comments, OwnerInfo, ProductInfo to $scope
				payload = response.data.payload
				showInfo = payload.ShowInfo
				productInfo = payload.ProductInfo
				productMetaData = JSON.parse productInfo.metaData unless angular.isObject productInfo.metaData
				productUrl = productMetaData.url

				# Product info
				$scope.productName = productInfo.name
				$scope.productPrice = $filter('number') productInfo.price, 2
				$scope.productUrl = $filter('productLink') productUrl
				$scope.productTarget = $filter('productTarget') productUrl
				$scope.productBrief = productInfo.brief
				$scope.productCategoryId = productInfo.productCategoryId

				# video object to display video
				$scope.video = videoService.parseSingleVideo show: payload.ShowInfo, product: payload.ProductInfo

				# likeCounter, viewCounter, commentCounter, shareCounter
				$scope.likeCounter = showInfo.likeCounter
				$scope.viewCounter = showInfo.viewCounter
				$scope.commentCounter = showInfo.commentCounter
				$scope.shareCounter = showInfo.shareCounter

				# isliked & isFollowed
				$scope.isLiked = payload.liked
				$scope.isFollowed = payload.isFollow

			.catch (error) ->
				$log.error error

		# first time load show infor.	
		$scope.loadShow()
]

angular.module 'showroomControllers'
.controller 'ShowCommentController', [
	'$scope', '$rootScope', 'socialService','$log', '$routeParams', 'videoService'
	($scope, $rootScope, socialService, $log, $routeParams, videoService) ->

		showId = $scope.$parent.showId
		# dedicated
		$scope.commentCounter = $scope.$parent.commentCounter

		# current page of comments
		$scope.currentPage = 0

		# Map<accountId, accountObject>
		accountMap = {}
		
		getAccountName = (accountId) ->
			account = accountMap[accountId]
			return '' unless account
			account.firstName + ' ' + account.lastName

		# insert Account name into comment content
		refineComment = (comment) ->
					accs = comment.match /\|`\|(\w+)\|`\|/g
					return comment if !accs or accs.length <= 0
					for acc in accs
						accountId = acc.slice 3, acc.length - 3
						#accountName = '<a href="/#/account/' + accountId + '"><b>' + $scope.getAccountName(accountId) + '</b></a>'
						accountName = '<b>' + getAccountName(accountId) + '</b>'
						comment = comment.replace acc, accountName
					'<p>' + comment + '</p>'

		$scope.deleteComment = (socialActionId) ->
			socialService.removeCommentAShow socialActionId
			.then (response) ->
				$scope.loadCommment() if response.data.code == 1000

		# handle commiting of the comment form.
		$scope.commit = (event) ->
			if $scope.commentForm.$valid
				socialService.commentAShow showId, comment: $scope.commentText
				.then (response) ->
					return unless response.data.code == 1000
					# reload comment.
					$scope.loadCommment()
					$scope.commentText = ''

		$scope.loadCommment = ->
			socialService.listCommentByShow {showId: showId, pageSize: 10, sortType: 'desc'}
			.then (response) ->
				# Check if request is error
				return if response.data.code != 1000
				payload = response.data.payload
				listComments = payload.items.reverse()
				listAccounts = payload.listAccounts

				accountMap[account.accountId] = account for account in listAccounts

				checkIsMime = (accountId) ->
					return false unless $rootScope.loggedIn && $rootScope.userInfo
					$rootScope.userInfo.accountId == accountId

				$scope.comments = for comment in listComments
					socialActionId: comment.id
					authorName: getAccountName comment.accountId
					authorAvatarUrl: accountMap[comment.accountId].avatarUrl
					updatedAt: comment.updatedAt
					content: refineComment comment.metaData.comment
					isMime: checkIsMime comment.accountId

		# first time load comments
		$scope.loadCommment()
]