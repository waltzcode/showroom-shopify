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
		.when '/search/user', templateUrl: "{{ 'views-user-search.html' | asset_url }}", controller: 'UserSearchController'
		.when '/search/show', templateUrl: "{{ 'views-show-search.html' | asset_url }}", controller: 'ShowSearchController'
		.when '/category/:channelId', templateUrl: "{{ 'views-channel-detail.html' | asset_url }}", controller: 'ChannelDetailController'
		.when '/account/:accountId', templateUrl: "{{ 'views-account-detail.html' | asset_url }}", controller: 'AccountDetailController' # with accountId
		.when '/user/:username', templateUrl: "{{ 'views-account-detail.html' | asset_url }}", controller: 'UserDetailController' # with username
		.when '/show/:showId', templateUrl: "{{ 'views-show-detail.html' | asset_url }}", controller: 'ShowDetailController' # with showId
		.otherwise templateUrl: "{{ 'views-home.html' | asset_url }}", controller: 'HomeController'
]