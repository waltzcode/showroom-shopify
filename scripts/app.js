(function() {
  'use strict';
  var showroomApp, showroomControllers, showroomDirectives, showroomFilters, showroomServices;

  showroomApp = angular.module('showroomApp', ['ngRoute', 'showroomServices', 'showroomControllers', 'showroomFilters', 'showroomDirectives']);

  showroomServices = angular.module('showroomServices', ['ngCookies', 'ngSanitize', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.poster']);

  showroomControllers = angular.module('showroomControllers', []);

  showroomFilters = angular.module('showroomFilters', []);

  showroomDirectives = angular.module('showroomDirectives', []);

  showroomApp.constant('SHOWROOM_CONSTANTS', {
    serviceHost: '//services.showroomapp.net',
    sessionParam: 'showroomSId',
    serviceBundleId: 'showroom.ios',
    serviceVersion: '1.0.8',
    registerSessionURL: '/session/register',
    getGlobalLastestFeedURL: '/feed/latest/',
    getGlobalMostLikeFeedURL: '/feed/most/like/',
    getGlobalMostViewFeedURL: '/feed/most/view/',
    getGlobalMostShareFeedURL: '/feed/most/share/',
    getGlobalFeaturedFeedURL: '/feed/featured/',
    getPersonalFeedURL: '/account/me/feed/',
    getPersonalShowURL: '/show/me/list/',
    registerEmailAccountURL: '/account/email/register/',
    resetEmailAccountPasswordURL: '/account/email/resetpassword/',
    changeEmailAccountPasswordURL: '/account/email/changepassword/',
    loginEmailAccountURL: '/account/email/login/',
    loginFacebookAccountURL: '/account/facebook/login/',
    getLoggedInAccountInfoURL: '/account/me/info/',
    logoutURL: '/account/me/logout/',
    showroomCDN: '//cdn.showroomapp.tv/'
  });

  showroomApp.config([
    '$interpolateProvider', '$sceDelegateProvider', '$sceProvider', function($interpolateProvider, $sceDelegateProvider, $sceProvider) {
      $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
      $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://cdn.shopify.com/**', 'https://cdn.shopify.com/**']);
      return $sceProvider.enabled(false);
    }
  ]);

  showroomApp.run([
    '$rootScope', '$log', 'userService', '$q', function($rootScope, $log, userService, $q) {
      userService.getLoggedInAccountInfo().then(function(response) {
        if (response.code === 1000) {
          $rootScope.loggedIn = true;
          return $rootScope.userInfo = response.payload;
        }
      })["catch"](function(error) {
        return $log.error(error);
      });
      return $rootScope.logout = function() {
        return userService.logout().then(function(response) {
          $rootScope.loggedIn = false;
          return $rootScope.userInfo = void 0;
        })["catch"](function(error) {
          return $log.error(error);
        });
      };
    }
  ]);

  angular.module('showroomApp').config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/', {
        templateUrl: "{{ 'views-home.html' | asset_url }}",
        controller: 'HomeController'
      }).when('/login', {
        templateUrl: "{{ 'views-login.html' | asset_url }}",
        controller: 'LoginController'
      }).when('/signup', {
        templateUrl: "{{ 'views-signup.html' | asset_url }}",
        controller: 'SignUpController'
      }).when('/featured', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'FeatureController'
      }).when('/popular', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'PopularController'
      }).when('/newest', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'NewsetController'
      }).when('/myshow', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'MyShowController'
      }).otherwise({
        templateUrl: "{{ 'views-home.html' | asset_url }}",
        controller: 'HomeController'
      });
    }
  ]);

  angular.module('showroomServices').factory('facebookService', [
    '$q', '$window', function($q, $window) {
      return {
        checkLoginStatus: function() {
          var deferred;
          deferred = $q.defer();
          $window.FB.getLoginStatus(function(response) {
            if (!response || response.erorr) {
              return deferred.reject(response.error || 'Facebook::Error when check login status.');
            } else {
              return deferred.resolve(response);
            }
          });
          return deferred.promise;
        },
        login: function() {
          var deferred;
          deferred = $q.defer();
          $window.FB.login(function(response) {
            if (!response || response.erorr) {
              return deferred.reject(response.error || 'Facebook::Error when login.');
            } else {
              return deferred.resolve(response);
            }
          });
          return deferred.promise;
        }
      };
    }
  ]);

  angular.module('showroomServices').factory('sessionService', [
    '$cookies', '$http', '$q', 'SHOWROOM_CONSTANTS', function($cookies, $http, $q, SHOWROOM_CONSTANTS) {
      return {
        getSessionId: function() {
          var data, deferred, exp, guid, now, sessionId;
          deferred = $q.defer();
          sessionId = $cookies.get(SHOWROOM_CONSTANTS.sessionParam);
          now = new Date();
          exp = new Date(now.getTime() + 40 * 50 * 1000);
          guid = function() {
            var _p8;
            _p8 = function(s) {
              var p;
              p = (Math.random().toString(16) + "000000000").substr(2, 8);
              if (s) {
                return "-" + p.substr(0, 4) + "-" + p.substr(4, 4);
              } else {
                return p;
              }
            };
            return _p8() + _p8(true) + _p8(true) + _p8();
          };
          data = {
            deviceId: guid(),
            model: 'WC_MR.Richard',
            name: 'Website Client',
            osName: '',
            osVersion: '',
            bundleId: SHOWROOM_CONSTANTS.serviceBundleId,
            bundleVersion: SHOWROOM_CONSTANTS.serviceVersion,
            langCode: ''
          };
          if (sessionId) {
            $cookies.put(SHOWROOM_CONSTANTS.sessionParam, sessionId, {
              expires: exp
            });
            deferred.resolve(sessionId);
          } else {
            $http.post(SHOWROOM_CONSTANTS.serviceHost + SHOWROOM_CONSTANTS.registerSessionURL, {
              data: data
            }).then(function(response) {
              if (response.code === 1000) {
                $cookies.put(SHOWROOM_CONSTANTS.sessionParam, response.payload.sessionId, {
                  expires: exp
                });
                return deferred.resolve(response.payload.sessionId);
              } else {
                return deferred.reject(response.message);
              }
            })["catch"](function(error) {
              return deferred.reject(error);
            });
          }
          return deferred.promise;
        },
        callService: function(method, uri, data) {
          return this.getSessionId().then(function(sessionId) {
            var url;
            url = SHOWROOM_CONSTANTS.serviceHost + uri + sessionId;
            return $http({
              url: url,
              method: method,
              data: data
            });
          });
        }
      };
    }
  ]);

  angular.module('showroomServices').factory('showService', [
    'SHOWROOM_CONSTANTS', 'sessionService', '$http', '$q', function(SHOWROOM_CONSTANTS, sessionService) {
      var buildUri;
      buildUri = function(uri, pagging) {
        var pageNumber, pageSize;
        pageNumber = pagging.pageNumber || 0;
        pageSize = pagging.pageSize || 15;
        return uri + pageNumber + '/' + pageSize + '/';
      };
      return {
        getGlobalLastestFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalLastestFeedURL));
        },
        getGlobalMostLikeFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostLikeFeedURL));
        }
      };
    }
  ]);

  angular.module('showroomServices').factory('userService', [
    'SHOWROOM_CONSTANTS', 'sessionService', function(SHOWROOM_CONSTANTS, sessionService) {
      return {
        registerEmailAccount: function(data) {
          return sessionService.callService('POST', SHOWROOM_CONSTANTS.registerEmailAccountURL, data);
        },
        resetEmailAccountPassword: function(data) {
          return sessionService.callService('POST', SHOWROOM_CONSTANTS.resetEmailAccountPasswordURL, data);
        },
        changeEmailAccountPassword: function(data) {
          return sessionService.callService('POST', SHOWROOM_CONSTANTS.changeEmailAccountPasswordURL, data);
        },
        loginEmailAccount: function(data) {
          return sessionService.callService('PUT', SHOWROOM_CONSTANTS.loginEmailAccountURL, data);
        },
        loginFacebookAccount: function(data) {
          return sessionService.callService('PUT', SHOWROOM_CONSTANTS.loginFacebookAccountURL, data);
        },
        getLoggedInAccountInfo: function() {
          return sessionService.callService('GET', SHOWROOM_CONSTANTS.getLoggedInAccountInfoURL, null);
        },
        logout: function() {
          return sessionService.callService('GET', SHOWROOM_CONSTANTS.logoutURL, null);
        }
      };
    }
  ]);

}).call(this);
