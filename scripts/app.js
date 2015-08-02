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
    '$cookies', '$http', '$q', 'SHOWROOM_CONSTANTS', '$log', function($cookies, $http, $q, SHOWROOM_CONSTANTS, $log) {
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
            $http.post(SHOWROOM_CONSTANTS.serviceHost + SHOWROOM_CONSTANTS.registerSessionURL, data).then(function(response) {
              if (response.data.code === 1000) {
                $cookies.put(SHOWROOM_CONSTANTS.sessionParam, response.data.payload.sessionId, {
                  expires: exp
                });
                return deferred.resolve(response.data.payload.sessionId);
              } else {
                return deferred.reject(response.data.message);
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
    'SHOWROOM_CONSTANTS', 'sessionService', function(SHOWROOM_CONSTANTS, sessionService) {
      var buildUri;
      buildUri = function(uri, pagging) {
        var pageNumber, pageSize;
        pageNumber = pagging.pageNumber || 0;
        pageSize = pagging.pageSize || 15;
        return uri + pageNumber + '/' + pageSize + '/';
      };
      return {
        getGlobalLastestFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalLastestFeedURL, pagging));
        },
        getGlobalMostLikeFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostLikeFeedURL, pagging));
        },
        getGlobalMostViewFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostViewFeedURL, pagging));
        },
        getGlobalMostShareFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalMostShareFeedURL, pagging));
        },
        getGlobalFeaturedFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getGlobalFeaturedFeedURL, pagging));
        },
        getPersonalFeed: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getPersonalFeedURL, pagging));
        },
        getPersonalShow: function(pagging) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getPersonalShowURL, pagging));
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

  angular.module('showroomServices').factory('videoService', [
    'SHOWROOM_CONSTANTS', 'VG_STATES', '$filter', '$sce', '$rootScope', function(SHOWROOM_CONSTANTS, VG_STATES, $filter, $sce, $rootScope) {
      var parseVideo;
      parseVideo = function(config) {
        var index, products, show, shows, videos;
        this.response = config.response;
        this.currencySymbol = config.currencySymbol || '$';
        this.exceprtTitleLength = config.exceprtTitleLength || 30;
        this.excerptMore = config.excerptMore || '...';
        this.videoSize = config.videoSize || '400';
        this.thumbnailSize = config.thumbnailSize || '700';
        if (this.response.code === 1000) {
          shows = this.response.payload.listShows;
          products = this.response.payload.listProducts;
          return videos = (function() {
            var i, len, results;
            results = [];
            for (index = i = 0, len = shows.length; i < len; index = ++i) {
              show = shows[index];
              results.push({
                preload: 'none',
                sources: [
                  {
                    src: $sce.trustAsResourceUrl(SHOWROOM_CONSTANTS.showroomCDN + show.videoSets[this.videoSize]),
                    type: 'video/mp4'
                  }
                ],
                poster: $sce.trustAsResourceUrl(SHOWROOM_CONSTANTS.showroomCDN + show.thumbnailSets[this.thumbnailSize]),
                onPlayerReady: function($API) {
                  return this.API = $API;
                },
                play: function() {
                  if ($rootScope.currentAPI && $rootScope.currentAPI.currentState === VG_STATES.PLAY) {
                    $rootScope.currentAPI.stop();
                  }
                  if (this.API && this.API.currentAPI !== VG_STATES.PLAY) {
                    $rootScope.currentAPI = this.API;
                    return this.API.play();
                  }
                },
                likeCounter: show.likeCounter,
                viewCounter: show.viewCounter,
                commentCounter: show.commentCounter,
                shareCounter: show.shareCounter,
                productName: $filter('excerptTitle')(products[index].name, this.exceprtTitleLength, this.excerptMore),
                productTitle: products[index].name,
                price: $filter('currency')(products[index].price, this.currencySymbol, 2),
                productLinkUrl: $filter('productLink')($filter('jsonParse')(products[index].metaData).url),
                productLinkTarget: $filter('productTarget')($filter('jsonParse')(products[index].metaData).url)
              });
            }
            return results;
          }).call(this);
        }
      };
      return {
        parseVideo: parseVideo
      };
    }
  ]);

  angular.module('showroomControllers').controller('HomeController', [
    'showService', 'videoService', '$scope', '$rootScope', '$log', '$q', function(showService, videoService, $scope, $rootScope, $log, $q) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      if ($rootScope.loggedIn) {
        showService.getPersonalFeed({
          pageNumber: 0,
          pageSize: 15
        }).then(function(response) {
          return $scope.myFeedVideos = videoService.parseVideo({
            response: response.data
          });
        });
        showService.getPersonalShow({
          pageNumber: 0,
          pageSize: 15
        }).then(function(response) {
          return $scope.myShowVideos = videoService.parseVideo({
            response: response.data
          });
        });
      }
      showService.getGlobalFeaturedFeed({
        pageNumber: 0,
        pageSize: 15
      }).then(function(response) {
        return $scope.featuredVideos = videoService.parseVideo({
          response: response.data
        });
      });
      showService.getGlobalMostLikeFeed({
        pageNumber: 0,
        pageSize: 15
      }).then(function(response) {
        return $scope.popularVideos = videoService.parseVideo({
          response: response.data
        });
      });
      return showService.getGlobalLastestFeed({
        pageNumber: 0,
        pageSize: 15
      }).then(function(response) {
        return $scope.newestVideos = videoService.parseVideo({
          response: response.data
        });
      });
    }
  ]);

  angular.module('showroomFilters').filter('jsonParse', function() {
    return function(input) {
      if (angular.isObject(input)) {
        return input;
      } else {
        return JSON.parse(input);
      }
    };
  }).filter('productLink', function() {
    return function(link) {
      if (link.indexOf('showroom-store.myshopify.com') === -1 && link.indexOf('amazon.com') === -1 && link.indexOf('store.showroomapp.tv') === -1) {
        return '/pages/ext-product?url=' + link;
      } else {
        return link;
      }
    };
  }).filter('productTarget', function() {
    return function(link) {
      if (link.indexOf('amazon' === -1)) {
        return '_self';
      } else {
        return '_blank';
      }
    };
  }).filter('excerptTitle', function() {
    return function(input, length, excerpt_more) {
      if (input.length > length) {
        input = input.substring(0, length);
        input = input.substring(0, input.lastIndexOf(' ') + 1);
        input += excerpt_more;
      }
      return input;
    };
  });

}).call(this);
