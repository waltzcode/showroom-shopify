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
    searchAccountByKeywordsURL: '/search/account/name/',
    searchShowByKeywordsURL: '/search/show/product/',
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
        controller: 'FeaturedController'
      }).when('/popular', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'PopularController'
      }).when('/newest', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'NewestController'
      }).when('/myshow', {
        templateUrl: "{{ 'views-list-show.html' | asset_url }}",
        controller: 'MyShowController'
      }).when('/user/search', {
        templateUrl: "{{ 'views-user-search.html' | asset_url }}",
        controller: 'UserSearchController'
      }).when('/show/search', {
        templateUrl: "{{ 'views-show-search.html' | asset_url }}",
        controller: 'ShowSearchController'
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
        },
        searchShowByKeywords: function(options) {
          var keywords, pageNumber, pageSize, url;
          keywords = options.keywords;
          pageNumber = options.pageNumber || 0;
          pageSize = options.pageSize || 15;
          url = SHOWROOM_CONSTANTS.searchShowByKeywordsURL + keywords + '/' + pageNumber + '/' + pageSize + '/';
          return sessionService.callService('GET', url);
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
        },
        searchAccountByKeywords: function(options) {
          var keywords, pageNumber, pageSize, url;
          keywords = options.keywords;
          pageNumber = options.pageNumber || 0;
          pageSize = options.pageSize || 15;
          url = SHOWROOM_CONSTANTS.searchAccountByKeywordsURL + keywords + '/' + pageNumber + '/' + pageSize + '/';
          return sessionService.callService('GET', url);
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
          shows = this.response.payload.listShows || this.response.payload.items;
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

  angular.module('showroomControllers').controller('FeaturedController', [
    '$scope', 'showService', 'videoService', '$log', function($scope, showService, videoService, $log) {
      $scope.header = 'Featured';
      return showService.getGlobalFeaturedFeed({
        pageNumber: 0,
        pageSize: 15
      }).then(function(response) {
        return $scope.videos = videoService.parseVideo({
          response: response.data
        });
      });
    }
  ]);

  angular.module('showroomControllers').controller('HeaderController', [
    '$scope', '$location', function($scope, $location) {
      $scope.searchUser = function() {
        if ($scope.userKeywords) {
          $location.search('q', $scope.userKeywords);
          return $location.path('/user/search');
        }
      };
      return $scope.searchShow = function() {
        if ($scope.showKeywords) {
          $location.search('q', $scope.showKeywords);
          return $location.path('/show/search');
        }
      };
    }
  ]);

  angular.module('showroomControllers').controller('HomeController', [
    'showService', 'videoService', '$scope', '$rootScope', '$log', '$q', '$location', function(showService, videoService, $scope, $rootScope, $log, $q, $location) {
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

  angular.module('showroomControllers').controller('LoginController', [
    'userService', 'facebookService', '$scope', '$rootScope', '$log', '$location', function(userService, facebookService, $scope, $rootScope, $log, $location) {
      $rootScope.removeHeader = true;
      $rootScope.removeBrand = true;
      $rootScope.removeNav = true;
      $rootScope.removeFooter = true;
      $scope.errors = [];
      if ($rootScope.loggedIn) {
        $location.patch('/');
      }
      $scope.email = '';
      $scope.password = '';
      $scope.loginEmail = function() {
        if ($scope.loginForm.$invalid) {
          return $scope.showMessages = true;
        } else {
          return userService.loginEmailAccount({
            email: $scope.email,
            password: $scope.password
          }).then(function(response) {
            if (response.data.code === 1000) {
              $rootScope.loggedIn = true;
              return userService.getLoggedInAccountInfo().then(function(response) {
                if (response.data.code === 1000) {
                  return $rootScope.userInfo = response.data.payload;
                }
              })["finally"](function() {
                return $location.path('/');
              });
            } else {
              return $scope.message = 'Email or password is invalid.';
            }
          })["catch"](function(error) {
            $scope.message = 'Internal server error';
            return $log.error(error);
          });
        }
      };
      $scope.connectFacebook = function() {
        return facebookService.login().then(function(response) {
          if (response.status === 'connected') {
            return userService.loginFacebookAccount({
              socialToken: response.authResponse.accessToken
            });
          } else {
            return new Error('Nothing');
          }
        }).then(function(response) {
          if (response.data.code === 1000) {
            $rootScope.loggedIn = true;
            return userService.getLoggedInAccountInfo().then(function(response) {
              if (response.data.code === 1000) {
                return $rootScope.userInfo = response.data.payload;
              }
            })["finally"](function() {
              return $location.path('/');
            });
          }
        })["catch"](function(error) {
          return $log.error(error);
        });
      };
      return $scope.popupForgetPwd = function() {
        return $.fancybox({
          href: "#forgot-password"
        });
      };
    }
  ]).controller('ForgotPwdController', [
    '$scope', 'userService', '$log', function($scope, userService, $log) {
      $scope.headerText = 'FORGOT PASSWORDS?';
      $scope.message = '<p>Having a hard time remembering your SHOWROOM password? No worries. </p><p>We\'ll email you a link to reset it.</p>';
      return $scope.sendEmail = function() {
        if ($scope.forgotPasswordForm.$valid) {
          return userService.resetEmailAccountPassword({
            email: $scope.email
          }).then(function(response) {
            if (response.data.code === 1000) {
              $scope.resetSuccess = true;
              $scope.headerText = 'You\'re almost back to SHOWROOM.';
              return $scope.message = '<p>We\'ve just sent an email that includes instructions and a link to reset your password.</p> ' + '<p>We\'ll have you back to the SHOWROOM in no time!</p>';
            } else {
              $scope.headerText = 'FAIL!';
              return $scope.message = '<p>' + response.data.message + '</p>';
            }
          })["catch"](function(error) {
            return $log.error(error);
          });
        } else {
          return $scope.showForgotMessages = true;
        }
      };
    }
  ]);

  angular.module('showroomControllers').controller('MyShowController', [
    '$scope', '$rootScope', 'showService', 'videoService', '$log', function($scope, $rootScope, showService, videoService, $log) {
      $scope.header = 'My shows';
      if ($rootScope.loggedIn) {
        return showService.getPersonalShow({
          pageNumber: 0,
          pageSize: 15
        }).then(function(response) {
          return $scope.videos = videoService.parseVideo({
            response: response.data
          });
        });
      }
    }
  ]);

  angular.module('showroomControllers').controller('NewestController', [
    '$scope', 'showService', 'videoService', '$log', function($scope, showService, videoService, $log) {
      $scope.header = 'Newest';
      return showService.getGlobalMostLikeFeed({
        pageNumber: 0,
        pageSize: 15
      }).then(function(response) {
        return $scope.videos = videoService.parseVideo({
          response: response.data
        });
      });
    }
  ]);

  angular.module('showroomControllers').controller('PopularController', [
    '$scope', 'showService', 'videoService', '$log', function($scope, showService, videoService, $log) {
      $scope.header = 'Popular';
      return showService.getGlobalMostLikeFeed({
        pageNumber: 0,
        pageSize: 15
      }).then(function(response) {
        return $scope.videos = videoService.parseVideo({
          response: response.data
        });
      });
    }
  ]);

  angular.module('showroomControllers').controller('ShowSearchController', [
    'showService', 'videoService', '$scope', '$location', '$log', function(showService, videoService, $scope, $location, $log) {
      $scope.keywords = $location.search().q;
      return showService.searchShowByKeywords({
        keywords: $scope.keywords
      }).then(function(response) {
        $scope.header = 'Search result for \'' + $scope.keywords + '\'';
        if (response.data.code === 1000) {
          $scope.shows = response.data.payload.items;
        }
        $scope.totalItem = response.data.payload.totalItem;
        $scope.videos = videoService.parseVideo({
          response: response.data
        });
        if (response.data.code !== 1000) {
          return $scope.message = response.data.message;
        }
      });
    }
  ]);

  angular.module('showroomControllers').controller('SignUpController', [
    '$scope', '$rootScope', 'userService', '$log', '$location', function($scope, $rootScope, userService, $log, $location) {
      $rootScope.removeHeader = true;
      $rootScope.removeBrand = true;
      $rootScope.removeNav = true;
      $rootScope.removeFooter = true;
      return $scope.signup = function() {
        $scope.showMessages = true;
        if ($scope.signupForm.$valid) {
          return userService.registerEmailAccount({
            email: $scope.email,
            password: $scope.password,
            firstName: $scope.firstName,
            lastName: $scope.lastName
          }).then(function(response) {
            if (response.code === 1000) {
              return userService.loginEmailAccount({
                email: $scope.email,
                password: $scope.password
              }).then(function(response) {
                if (response.data.code === 1000) {
                  $rootScope.loggedIn = true;
                  if (response.data.code === 1000.["catch"](function(error) {
                    return $log.error(error);
                  })["finally"](function() {
                    return $location.path('/');
                  })) {
                    return userService.getLoggedInAccountInfo().then(response($rootScope.userInfo = response.payload));
                  }
                } else {
                  return $scope.message = 'Email or password is invalid.';
                }
              })["catch"](function(error) {
                $log.error(error);
                return $scope.message = 'Internal server error.';
              });
            } else {
              return $scope.message = response.message;
            }
          })["catch"](function(error) {
            $log.error(error);
            return $scope.message = error;
          });
        }
      };
    }
  ]);

  angular.module('showroomControllers').controller('UserSearchController', [
    'userService', '$scope', '$location', '$log', function(userService, $scope, $location, $log) {
      $scope.keywords = $location.search().q;
      return userService.searchAccountByKeywords({
        keywords: $scope.keywords
      }).then(function(response) {
        if (response.data.code === 1000) {
          $scope.users = response.data.payload.items;
        }
        if (response.data.code !== 1000) {
          return $scope.message = response.data.message;
        }
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
  }).filter('asset_url', [
    'SHOWROOM_CONSTANTS', function(SHOWROOM_CONSTANTS) {
      return function(input) {
        return SHOWROOM_CONSTANTS.showroomCDN + input;
      };
    }
  ]);

}).call(this);
