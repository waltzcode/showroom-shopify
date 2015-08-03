angular.module 'showroomControllers'
.controller 'SignUpController', [
	'$scope', '$rootScope', 'userService', '$log', '$location'
	($scope, $rootScope, userService, $log, $location) ->
		# Display Settings
		$rootScope.removeHeader = true
		$rootScope.removeBrand = true
		$rootScope.removeNav = true
		$rootScope.removeFooter = true

		$scope.signup = ->
			$scope.showMessages = true
			if $scope.signupForm.$valid
				userService.registerEmailAccount {
					email: $scope.email
					password: $scope.password
					firstName: $scope.firstName
					lastName: $scope.lastName
				}
				.then (response) ->
					if response.code == 1000
						userService.loginEmailAccount email: $scope.email, password: $scope.password
						.then (response) ->
							if response.data.code == 1000
								$rootScope.loggedIn = true
								userService.getLoggedInAccountInfo()
								.then (response) $rootScope.userInfo = response.payload if response.data.code == 1000
								.catch (error) -> $log.error error
								.finally -> $location.path '/'
							else $scope.message = 'Email or password is invalid.'
						.catch (error) ->
							$log.error(error)
							$scope.message = 'Internal server error.'
					else $scope.message = response.message
				.catch (error) ->
					$log.error(error);
					$scope.message = error;
]
