angular.module 'showroomControllers'
.controller 'LoginController', [
	'userService', 'facebookService', '$scope', '$rootScope', '$log', '$location'
	(userService, facebookService, $scope, $rootScope, $log, $location) ->
		# Display Settings
		$rootScope.removeHeader = true
		$rootScope.removeBrand = true
		$rootScope.removeNav = true
		$rootScope.removeFooter = true
		$scope.errors = []
		$location.patch '/' if $rootScope.loggedIn
		$scope.email = ''
		$scope.password = ''
		$scope.backUrl = $location.search().backUrl
		$scope.backUrl ?= '/'

		$scope.loginEmail = ->
			if $scope.loginForm.$invalid
				$scope.showMessages = true
			else
				userService.loginEmailAccount email: $scope.email, password: $scope.password
				.then (response) ->
					if response.data.code == 1000
						$rootScope.loggedIn = true
						userService.getLoggedInAccountInfo()
						.then (response) -> $rootScope.userInfo = response.data.payload if response.data.code == 1000
						.finally -> 
							$location.path($scope.backUrl).search('').replace()
					else $scope.message = 'Email or password is invalid.'
				.catch (error) ->
					$scope.message = 'Internal server error'
					$log.error error

		$scope.connectFacebook = ->
			facebookService.login()
			.then (response) ->
				if response.status == 'connected'
					userService.loginFacebookAccount socialToken: response.authResponse.accessToken
				else
					new Error 'Nothing'
			.then (response) ->
				if (response.data.code == 1000)
					$rootScope.loggedIn = true
					userService.getLoggedInAccountInfo()
					.then (response) -> $rootScope.userInfo = response.data.payload if response.data.code == 1000
					.finally -> $location.path($scope.backUrl).search('').replace()
			.catch (error) -> $log.error error

		$scope.popupForgetPwd = -> $.fancybox href: "#forgot-password"
]
.controller 'ForgotPwdController', [
	'$scope', 'userService', '$log'
	($scope, userService, $log) ->
		$scope.headerText = 'FORGOT PASSWORDS?'
		$scope.message = '<p>Having a hard time remembering your SHOWROOM password? No worries. </p><p>We\'ll email you a link to reset it.</p>'
		$scope.sendEmail = ->
			if $scope.forgotPasswordForm.$valid
				userService.resetEmailAccountPassword email: $scope.email
				.then (response) ->
					if response.data.code == 1000
						$scope.resetSuccess = true
						$scope.headerText = 'You\'re almost back to SHOWROOM.'
						$scope.message = '<p>We\'ve just sent an email that includes instructions and a link to reset your password.</p> ' + '<p>We\'ll have you back to the SHOWROOM in no time!</p>'
					else
						$scope.headerText = 'FAIL!'
						$scope.message = '<p>' + response.data.message + '</p>'
				.catch (error) -> $log.error error
			else $scope.showForgotMessages = true
]
