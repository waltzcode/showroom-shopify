angular.module 'showroomApp'
.config [
	'$routeProvider'
	($routeProvider) ->
		$routeProvider
		.when '/', templateUrl: "{{ 'views-home.html' | asset_url }}", controller: 'HomeController'
		.when '/login', templateUrl: "{{ 'views-login.html' | asset_url }}", controller: 'LoginController'
		.when '/signup', templateUrl: "{{ 'views-signup.html' | asset_url }}", controller: 'SignUpController'
		.when '/featured', templateUrl: "{{ 'views-list-show.html' | asset_url }}", controller: 'FeaturedController'
		.when '/popular', templateUrl: "{{ 'views-list-show.html' | asset_url }}", controller: 'PopularController'
		.when '/newest', templateUrl: "{{ 'views-list-show.html' | asset_url }}", controller: 'NewestController'
		.when '/myshow', templateUrl: "{{ 'views-list-show.html' | asset_url }}", controller: 'MyShowController'
		.otherwise templateUrl: "{{ 'views-home.html' | asset_url }}", controller: 'HomeController'
]
