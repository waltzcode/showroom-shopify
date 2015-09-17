(function() {
  'use strict';
  angular.module('showroomApp', ['ngRoute', 'ngAnimate', 'showroomServices', 'showroomControllers', 'showroomFilters', 'showroomDirectives', 'angular-loading-bar']);

  angular.module('showroomServices', ['ngCookies']);

  angular.module('showroomControllers', []);

  angular.module('showroomFilters', []);

  angular.module('showroomDirectives', []);

  angular.module('showroomApp').config([
    '$interpolateProvider', '$sceDelegateProvider', '$sceProvider', '$logProvider', 'cfpLoadingBarProvider', function($interpolateProvider, $sceDelegateProvider, $sceProvider, $logProvider, cfpLoadingBarProvider) {
      $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
      $sceProvider.enabled(false);
      $logProvider.debugEnabled(true);
      return cfpLoadingBarProvider.includeSpinner = false;
    }
  ]);

  angular.module('showroomApp').constant('SHOWROOM_CONSTANTS', {
    serviceHost: '//services.showroomapp.net',
    showroomCDN: '//cdn.showroomapp.tv/',
    sessionParam: 'showroomSId',
    serviceBundleId: 'showroom.ios',
    serviceVersion: '1.0.8',
    BeautyChannelId: '84fccf26862232b49f2ad44fca89c667',

    /* ALL RESTFULL WEBSERVICE ENTRIES USED IN THE SHOWROOM SYSTEM */
    registerSessionURL: '/session/register',
    getGlobalLastestFeedURL: '/show/browse/latest/',
    getGlobalMostLikeFeedURL: '/show/browse/most/like/',
    getGlobalMostViewFeedURL: '/show/browse/most/view/',
    getGlobalMostShareFeedURL: '/show/browse/most/share/',
    getGlobalFeaturedFeedURL: '/show/browse/featured/',
    getFeaturedByChannelURL: '/show/browse/channel/featured/',
    getLastestByChannelURL: '/show/browse/channel/latest/',
    getMostLikeByChannelURL: '/show/browse/channel/most/like/',
    getMostViewByChannelURL: '/show/browse/channel/most/view/',
    getMostShareByChannelURL: '/show/browse/channel/most/share/',
    getPersonalFeedURL: '/account/me/feed/',
    getPersonalShowURL: '/show/me/list/',
    getShowByIdURL: '/show/info/',
    getShowByUserURL: '/show/list/by/account/',
    getShowByUsernameURL: '/show/list/by/username/',
    getListChannelURL: '/channel/list/',
    registerEmailAccountURL: '/account/email/register/',
    resetEmailAccountPasswordURL: '/account/email/resetpassword/',
    changeEmailAccountPasswordURL: '/account/email/changepassword/',
    loginEmailAccountURL: '/account/email/login/',
    loginFacebookAccountURL: '/account/facebook/login/',
    getLoggedInAccountInfoURL: '/account/me/info/',
    logoutURL: '/account/me/logout/',
    getAccountProfileURL: '/account/info/',
    searchAccountByKeywordsURL: '/search/account/name/',
    searchShowByKeywordsURL: '/search/show/product/',
    getProductByIdURL: '/product/info/',
    likeAShowURL: '/social/me/show/like/',
    unlikeAShowURL: '/social/me/show/unlike/',
    checkLikeAShowURL: '/social/me/show/islike/',
    commentAShowURL: '/social/me/show/comment/',
    removeCommentAShowURL: '/social/me/show/comment/remove/',
    listCommentByShowDescURL: '/social/show/list/comment/desc/',
    listCommentByShowAscURL: '/social/show/list/comment/asc/'
  });

  angular.module('showroomApp').run([
    '$rootScope', '$log', '$filter', 'userService', 'channelService', 'SHOWROOM_CONSTANTS', '$location', '$q', function($rootScope, $log, $filter, userService, channelService, SHOWROOM_CONSTANTS, $location, $q) {
      userService.getLoggedInAccountInfo().then(function(response) {
        if (response.data.code === 1000) {
          $rootScope.loggedIn = true;
          return $rootScope.userInfo = response.data.payload;
        }
      })["catch"](function(error) {
        return $log.error(error);
      });
      channelService.getListChannel().then(function(response) {
        var channels;
        if (response.data.code === 1000) {
          channels = response.data.payload.items;
          return $rootScope.channels = $filter('filter')(channels, {
            parentChannelId: SHOWROOM_CONSTANTS.BeautyChannelId
          }, true);
        }
      });
      $rootScope.logout = function() {
        return userService.logout().then(function(response) {
          if (response.data.code === 1000) {
            $rootScope.loggedIn = false;
            return $rootScope.userInfo = void 0;
          }
        })["catch"](function(error) {
          return $log.error(error);
        });
      };
      $rootScope.getUserInfo = function() {
        if ($rootScope.userInfo) {
          return q.when($rootScope.userInfo);
        }
        return userService.getLoggedInAccountInfo().then(function(response) {
          if (response.data.code === 1000) {
            return $q.when(response.payload);
          } else {
            return $q.when(void 0);
          }
        })["catch"](function(error) {
          return $log.error(error);
        });
      };
      return $rootScope.goToLogin = function() {
        var currentPath;
        currentPath = $location.path();
        $log.debug(currentPath);
        return $location.path('/login').search({
          backUrl: currentPath
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
      }).when('/search/user', {
        templateUrl: "{{ 'views-user-search.html' | asset_url }}",
        controller: 'UserSearchController'
      }).when('/search/show', {
        templateUrl: "{{ 'views-show-search.html' | asset_url }}",
        controller: 'ShowSearchController'
      }).when('/category/:channelId', {
        templateUrl: "{{ 'views-channel-detail.html' | asset_url }}",
        controller: 'ChannelDetailController'
      }).when('/account/:accountId', {
        templateUrl: "{{ 'views-account-detail.html' | asset_url }}",
        controller: 'AccountDetailController'
      }).when('/user/:username', {
        templateUrl: "{{ 'views-account-detail.html' | asset_url }}",
        controller: 'UserDetailController'
      }).when('/show/:showId', {
        templateUrl: "{{ 'views-show-detail.html' | asset_url }}",
        controller: 'ShowDetailController'
      }).otherwise({
        templateUrl: "{{ 'views-home.html' | asset_url }}",
        controller: 'HomeController'
      });
    }
  ]);

  angular.module('showroomDirectives').directive('srLazySrc', [
    '$document', '$window', '$interval', '$timeout', '$log', function($document, $window, $interval, $timeout, $log) {
      var LazyImage, lazyLoader, link;
      lazyLoader = (function() {
        var $docHeigth, addImage, checkImages, documentWatchingDeley, documentWatchingTimer, images, onWatchingDocument, publicAPI, removeImage, renderDeley, renderTimer, startRender, startWatchingWindow, stopRender, stopWatchingWindow, win;
        images = [];
        renderTimer = null;
        renderDeley = 350;
        documentWatchingTimer = null;
        documentWatchingDeley = 1000;
        $docHeigth = 0;
        win = angular.element($window);
        checkImages = function() {
          var bottomFoldOffset, hidden, image, index, j, k, len, len1, scrollTop, topFoldOffset, visible, windowHeight;
          windowHeight = win.height();
          scrollTop = win.scrollTop();
          visible = [];
          hidden = [];
          topFoldOffset = scrollTop;
          bottomFoldOffset = scrollTop + windowHeight;
          for (index = j = 0, len = images.length; j < len; index = ++j) {
            image = images[index];
            if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
              visible.push(image);
            } else {
              hidden.push(image);
            }
          }
          for (k = 0, len1 = visible.length; k < len1; k++) {
            image = visible[k];
            image.render();
          }
          images = hidden;
          stopRender();
          if (!images.length) {
            return stopWatchingWindow();
          }
        };
        onWatchingDocument = function() {
          var currentDocHeight;
          currentDocHeight = $document.height();
          if ($docHeigth && currentDocHeight !== $docHeigth) {
            startRender();
          }
          return $docHeigth = currentDocHeight;
        };
        startRender = function() {
          return renderTimer != null ? renderTimer : renderTimer = $timeout(checkImages, renderDeley);
        };
        stopRender = function() {
          if (renderTimer) {
            $timeout.cancel(renderTimer);
          }
          return renderTimer = null;
        };
        startWatchingWindow = function() {
          if (documentWatchingTimer == null) {
            documentWatchingTimer = $interval(onWatchingDocument, documentWatchingDeley);
          }
          return win.on('resize.srLazySrc scroll.srLazySrc', startRender);
        };
        stopWatchingWindow = function() {
          $log.debug('Stop watching window');
          if (documentWatchingTimer) {
            $interval.cancel(documentWatchingTimer);
          }
          documentWatchingTimer = null;
          return win.off('resize.srLazySrc scroll.srLazySrc');
        };
        addImage = function(image) {
          images.push(image);
          startRender();
          if (!documentWatchingTimer) {
            return startWatchingWindow();
          }
        };
        removeImage = function(image) {
          var i, img, j, len;
          for (i = j = 0, len = images.length; j < len; i = ++j) {
            img = images[i];
            if (img === image) {
              images.splice(i, 1);
            }
          }
          if (!(images.length > 0)) {
            stopRender();
            return stopWatchingWindow();
          }
        };
        publicAPI = {
          addImage: addImage,
          removeImage: removeImage
        };
        return publicAPI;
      })();
      LazyImage = (function() {
        function LazyImage(image1) {
          this.image = image1;
          this.rendered = false;
        }

        LazyImage.prototype.isVisible = function(topFoldOffset, bottomFoldOffset) {
          var bottom, height, isVisible, top;
          if (!this.image.is(':visible')) {
            return false;
          }
          height = this.image.height();
          top = this.image.offset().top;
          bottom = top + height;
          isVisible = (top >= topFoldOffset && top <= bottomFoldOffset) || (bottom >= topFoldOffset && bottom <= bottomFoldOffset) || (top <= topFoldOffset && bottom >= bottomFoldOffset);
          return isVisible;
        };

        LazyImage.prototype.render = function() {
          this.rendered = true;
          return this.renderSource();
        };

        LazyImage.prototype.setSource = function(source1) {
          this.source = source1;
          if (this.rendered) {
            return this.renderSource();
          }
        };

        LazyImage.prototype.renderSource = function() {
          return this.image.attr('src', this.source);
        };

        return LazyImage;

      })();
      link = function($scope, $el, $attrs) {
        var image;
        image = new LazyImage($el);
        $attrs.$observe('srLazySrc', function(source) {
          return image.setSource(source);
        });
        lazyLoader.addImage(image);
        return $scope.$on('$destroy', function() {
          return lazyLoader.removeImage(image);
        });
      };
      return {
        link: link,
        restrict: 'A'
      };
    }
  ]);

  angular.module('showroomDirectives').directive('srNavHref', [
    '$location', '$rootScope', '$timeout', function($location, $rootScope, $timeout) {
      var link;
      link = function($scope, $el, $attr) {
        var onClick;
        onClick = function($event) {
          if ($scope.srNavHref) {
            $location.path($scope.srNavHref);
          }
          if (jQuery && jQuery.shifter) {
            jQuery.shifter('close');
          }
          return $scope.$apply();
        };
        return $el.on('click.srNavHref', onClick);
      };
      return {
        restrict: 'A',
        scope: {
          srNavHref: '@'
        },
        link: link
      };
    }
  ]);

  angular.module('showroomDirectives').directive('srToggleSearch', [
    '$document', function($document) {
      var link;
      link = function($scope, $element, $attr) {
        var $body;
        $body = $document.find('body');
        return $element.on('click.srToggleSearch', function() {
          return $body.toggleClass('search-open');
        });
      };
      return {
        restrict: 'A',
        link: link
      };
    }
  ]);

  angular.module('showroomDirectives').directive('srToggle', function() {
    var link;
    link = function($scope, $el, $attr) {
      var classes;
      classes = $scope.toggleClass;
      $el.on('mouseover.srToggle', function() {
        return $el.addClass(classes);
      });
      return $el.on('mouseout.srToggle', function() {
        return $el.removeClass(classes);
      });
    };
    return {
      restrict: 'A',
      scope: {
        toggleClass: '@'
      },
      link: link
    };
  });

  angular.module('showroomDirectives').directive('srVideoContainer', [
    '$log', '$timeout', function($log, $timeout) {
      var link, videoManager;
      videoManager = (function() {
        var _addVideo, _playVideo, _removeVideo, currentVideo, listContainers, listVideos;
        listVideos = [];
        listContainers = [];
        currentVideo = {};
        _addVideo = function(video, container) {
          listVideos.push(video);
          return listContainers.push(container);
        };
        _removeVideo = function(video) {
          var i, j, len, results, vd;
          results = [];
          for (i = j = 0, len = listVideos.length; j < len; i = ++j) {
            vd = listVideos[i];
            if (vd === video) {
              listVideos.splice(i, 1);
              results.push(listContainers.splice(i, 1));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
        _playVideo = function(video, container) {
          var el, j, k, len, len1, vd;
          if (container.hasClass('playing loading')) {
            return;
          }
          for (j = 0, len = listVideos.length; j < len; j++) {
            vd = listVideos[j];
            vd[0].pause();
            vd.off('canplaythrough.srVideo load.srVideo');
          }
          for (k = 0, len1 = listContainers.length; k < len1; k++) {
            el = listContainers[k];
            el.removeClass('loading playing');
          }
          video[0].play();
          if (video[0].readyState !== 4) {
            container.addClass('loading');
            video.on('canplaythrough.srVideo load.srVideo', function() {
              video.off('canplaythrough.srVideo load.srVideo');
              container.removeClass('loading');
              container.addClass('playing');
              return video[0].play();
            });
            $timeout(function() {
              return video[0].pause();
            }, 1);
          } else {
            container.addClass('playing');
            video.on('paused.srVideo', function() {
              container.removeClass('playing');
              return video[0].off('paused.srVideo');
            });
          }
          return video[0].currentTime = 0.1;
        };
        return {
          addVideo: _addVideo,
          removeVideo: _removeVideo,
          playVideo: _playVideo
        };
      })();
      link = function($scope, $element, $attrs) {
        var video;
        video = $element.find('video').eq(0);
        videoManager.addVideo(video, $element);
        $element.on('mouseover', function() {
          return videoManager.playVideo(video, $element);
        });
        return $scope.$on('$destroy', function() {
          return videoManager.removeVideo(video);
        });
      };
      return {
        restrict: 'A',
        link: link
      };
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
      if (link.indexOf('amazon') === -1) {
        return '_self';
      } else {
        return '_blank';
      }
    };
  }).filter('excerptTitle', function() {
    return function(input, length, excerpt_more) {
      if (input.length > length) {
        input = input.substring(0, length);
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
  ]).filter('user_avatar_url', [
    'SHOWROOM_CONSTANTS', function(SHOWROOM_CONSTANTS) {
      return function(input) {
        if (input) {
          return SHOWROOM_CONSTANTS.showroomCDN + input;
        } else {
          return "{{ 'no-avatar.png' | asset_url }}";
        }
      };
    }
  ]);

  angular.module('showroomServices').factory('channelService', [
    'sessionService', '$q', 'SHOWROOM_CONSTANTS', '$log', function(sessionService, $q, SHOWROOM_CONSTANTS, $log) {
      return {
        getListChannel: function() {
          return sessionService.callService('GET', SHOWROOM_CONSTANTS.getListChannelURL);
        }
      };
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

  angular.module('showroomServices').factory('productService', [
    'SHOWROOM_CONSTANTS', 'sessionService', function(SHOWROOM_CONSTANTS, sessionService) {
      buildUr;
      return {
        getProductById: function(productId) {
          var url;
          url = SHOWROOM_CONSTANTS.getProductByIdURL + productId + '/';
          return sessionService.callService('GET', url);
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
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.searchShowByKeywordsURL + options.keywords + '/', options));
        },
        getShowByUser: function(options) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getShowByUserURL + options.accountId + '/', options));
        },
        getShowByUsername: function(options) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getShowByUsernameURL + options.username + '/', options));
        },
        getFeaturedByChannel: function(options) {
          return sessionService.callService('GET', buildUri(SHOWROOM_CONSTANTS.getFeaturedByChannelURL + options.channelId + '/', options));
        },
        getShowById: function(showId) {
          var url;
          url = SHOWROOM_CONSTANTS.getShowByIdURL + showId + '/';
          return sessionService.callService('GET', url);
        }
      };
    }
  ]);

  angular.module('showroomServices').factory('socialService', [
    'SHOWROOM_CONSTANTS', 'sessionService', function(SHOWROOM_CONSTANTS, sessionService) {
      return {
        likeAShow: function(showId) {
          var url;
          url = SHOWROOM_CONSTANTS.likeAShowURL + showId + '/';
          return sessionService.callService('GET', url);
        },
        unlikeAShow: function(showId) {
          var url;
          url = SHOWROOM_CONSTANTS.unlikeAShowURL + showId + '/';
          return sessionService.callService('GET', url);
        },
        checkLikeAShow: function(showId) {
          var url;
          url = SHOWROOM_CONSTANTS.checkLikeAShowURL + showId + '/';
          return sessionService.callService('GET', url);
        },
        commentAShow: function(showId, data) {
          var url;
          url = SHOWROOM_CONSTANTS.commentAShowURL + showId + '/';
          return sessionService.callService('POST', url, data);
        },
        removeCommentAShow: function(socialActionId) {
          var url;
          url = SHOWROOM_CONSTANTS.removeCommentAShowURL + socialActionId + '/';
          return sessionService.callService('DELETE', url);
        },
        listCommentByShow: function(params) {
          var pageNumber, pageSize, showId, sortType, uri, url;
          showId = params.showId;
          pageNumber = params.pageNumber || 0;
          pageSize = params.pageSize || 10;
          sortType = params.sortType || 'desc';
          if (sortType === 'desc') {
            uri = SHOWROOM_CONSTANTS.listCommentByShowDescURL;
          } else {
            uri = SHOWROOM_CONSTANTS.listCommentByShowAscURL;
          }
          url = uri + showId + '/' + pageNumber + '/' + pageSize + '/';
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
        },
        getAccountProfile: function(options) {
          var accountId, url;
          accountId = options.accountId;
          url = SHOWROOM_CONSTANTS.getAccountProfileURL + accountId + '/';
          return sessionService.callService('GET', url);
        }
      };
    }
  ]);

  angular.module('showroomServices').factory('videoService', [
    'SHOWROOM_CONSTANTS', 'socialService', '$rootScope', '$filter', '$sce', function(SHOWROOM_CONSTANTS, socialService, $rootScope, $filter, $sce) {
      var parseSingleVideo, parseVideo;
      parseVideo = function(config) {
        var index, j, len, product, productMap, products, show, shows, videos;
        this.response = config.response;
        this.currencySymbol = config.currencySymbol || '$';
        this.exceprtTitleLength = config.exceprtTitleLength || 32;
        this.excerptMore = config.excerptMore || ' ...';
        this.videoSize = config.videoSize || '700';
        this.thumbnailSize = config.thumbnailSize || '700';
        if (this.response.code === 1000) {
          shows = this.response.payload.listShows || this.response.payload.items;
          products = this.response.payload.listProducts;
          productMap = {};
          for (j = 0, len = products.length; j < len; j++) {
            product = products[j];
            productMap[product.id] = product;
          }
          return videos = (function() {
            var k, len1, results;
            results = [];
            for (index = k = 0, len1 = shows.length; k < len1; index = ++k) {
              show = shows[index];
              results.push({
                sources: [
                  {
                    src: $sce.trustAsResourceUrl(SHOWROOM_CONSTANTS.showroomCDN + show.videoSets[this.videoSize]),
                    type: 'video/mp4'
                  }
                ],
                showId: show.id,
                poster: $sce.trustAsResourceUrl(SHOWROOM_CONSTANTS.showroomCDN + show.thumbnailSets[this.thumbnailSize]),
                likeCounter: show.likeCounter,
                viewCounter: show.viewCounter,
                commentCounter: show.commentCounter,
                likeClick: function() {
                  if (!$rootScope.loggedIn) {
                    return $rootScope.goToLogin();
                  }
                },
                shareCounter: show.shareCounter,
                productName: $filter('excerptTitle')(productMap[show.productId].name, this.exceprtTitleLength, this.excerptMore),
                productTitle: productMap[show.productId].name,
                price: $filter('number')(productMap[show.productId].price, 2),
                productLinkUrl: $filter('productLink')($filter('jsonParse')(productMap[show.productId].metaData).url),
                productLinkTarget: $filter('productTarget')($filter('jsonParse')(productMap[show.productId].metaData).url)
              });
            }
            return results;
          }).call(this);
        }
      };
      parseSingleVideo = function(data) {
        var product, show, thumbnailSize, video, videoSize;
        show = data.show;
        product = data.product;
        videoSize = data.videoSize || '700';
        thumbnailSize = data.thumbnailSize || '700';
        return video = {
          sources: [
            {
              src: $sce.trustAsResourceUrl(SHOWROOM_CONSTANTS.showroomCDN + show.videoSets[videoSize]),
              type: 'video/mp4'
            }
          ],
          poster: $sce.trustAsResourceUrl(SHOWROOM_CONSTANTS.showroomCDN + show.thumbnailSets[thumbnailSize])
        };
      };
      return {
        parseVideo: parseVideo,
        parseSingleVideo: parseSingleVideo
      };
    }
  ]);

  angular.module('showroomControllers').controller('AccountDetailController', [
    '$scope', '$rootScope', 'showService', 'userService', '$log', '$routeParams', 'videoService', function($scope, $rootScope, showService, userService, $log, $routeParams, videoService) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.header = 'Account Show';
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.totalItem = 0;
      $scope.loadMore = function() {
        return showService.getShowByUser({
          accountId: $routeParams.accountId,
          pageNumber: $scope.currentPage++
        }).then(function(response) {
          if (response.data.code === 1000) {
            if ($scope.videos && angular.isArray($scope.videos)) {
              $scope.videos = $scope.videos.concat(videoService.parseVideo({
                response: response.data
              }));
            } else {
              $scope.videos = videoService.parseVideo({
                response: response.data
              });
            }
          } else {
            $log.error(response.data.message);
          }
          if (response.data.payload && $scope.videos.length >= $scope.totalItem) {
            return $scope.hasMore = false;
          }
        });
      };
      return userService.getAccountProfile({
        accountId: $routeParams.accountId
      }).then(function(response) {
        var accountInfo;
        if (response.data.code === 1000) {
          accountInfo = response.data.payload.accountInfo;
          $scope.totalItem = response.data.payload.showCounter;
          $scope.header = accountInfo.firstName + ' ' + accountInfo.lastName + ' SHOW';
        }
        return $scope.loadMore();
      });
    }
  ]);

  angular.module('showroomControllers').controller('ChannelDetailController', [
    '$scope', '$rootScope', 'showService', '$log', '$routeParams', 'videoService', function($scope, $rootScope, showService, $log, $routeParams, videoService) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.loadMore = function() {
        return showService.getFeaturedByChannel({
          channelId: $routeParams.channelId,
          pageNumber: $scope.currentPage++
        }).then(function(response) {
          if (response.data.code === 1000) {
            $scope.header = response.data.payload.channel.name + ' Category';
            if ($scope.videos && angular.isArray($scope.videos)) {
              $scope.videos = $scope.videos.concat(videoService.parseVideo({
                response: response.data
              }));
            } else {
              $scope.videos = videoService.parseVideo({
                response: response.data
              });
            }
            if (response.data.payload && $scope.videos.length >= response.data.payload.totalItem) {
              return $scope.hasMore = false;
            }
          } else {
            return $log.error(response.data.message);
          }
        });
      };
      return $scope.loadMore();
    }
  ]);

  angular.module('showroomControllers').controller('FeaturedController', [
    '$scope', '$rootScope', 'showService', 'videoService', '$log', 'SHOWROOM_CONSTANTS', function($scope, $rootScope, showService, videoService, $log, SHOWROOM_CONSTANTS) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.header = 'Featured';
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.loadMore = function() {
        return showService.getFeaturedByChannel({
          channelId: SHOWROOM_CONSTANTS.BeautyChannelId,
          pageNumber: $scope.currentPage++
        }).then(function(response) {
          if (angular.isArray($scope.videos)) {
            $scope.videos = $scope.videos.concat(videoService.parseVideo({
              response: response.data
            }));
          } else {
            $scope.videos = videoService.parseVideo({
              response: response.data
            });
          }
          if (response.data.payload && $scope.videos.length >= response.data.payload.totalItem) {
            return $scope.hasMore = false;
          }
        });
      };
      return $scope.loadMore();
    }
  ]);

  angular.module('showroomControllers').controller('HeaderController', [
    '$scope', '$location', 'channelService', '$log', '$filter', 'SHOWROOM_CONSTANTS', function($scope, $location, channelService, $log, $filter, SHOWROOM_CONSTANTS) {
      return channelService.getListChannel().then(function(response) {
        var channels;
        if (response.data.code === 1000) {
          channels = response.data.payload.items;
          return $scope.channels = $filter('filter')(channels, {
            parentChannelId: SHOWROOM_CONSTANTS.BeautyChannelId
          }, true);
        }
      });
    }
  ]);

  angular.module('showroomControllers').controller('HomeController', [
    'showService', 'videoService', '$scope', '$rootScope', '$log', function(showService, videoService, $scope, $rootScope, $log) {
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
      $scope.backUrl = $location.search().backUrl;
      if ($scope.backUrl == null) {
        $scope.backUrl = '/';
      }
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
                return $location.path($scope.backUrl).search('').replace();
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
              return $location.path($scope.backUrl).search('').replace();
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
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.header = 'My shows';
      $scope.pageNumber = 0;
      $scope.hasMore = true;
      if ($rootScope.loggedIn) {
        $scope.loadMore = function() {
          return showService.getPersonalShow({
            pageNumber: $scope.pageNumber++,
            pageSize: 15
          }).then(function(response) {
            if ($scope.videos && angular.isArray($scope.videos)) {
              $scope.videos = $scope.videos.concat(videoService.parseVideo({
                response: response.data
              }));
            } else {
              $scope.videos = videoService.parseVideo({
                response: response.data
              });
            }
            if ($scope.videos.length >= response.data.payload.totalItem) {
              return $scope.hasMore = false;
            }
          });
        };
        return $scope.loadMore();
      }
    }
  ]);

  angular.module('showroomControllers').controller('NewestController', [
    '$scope', '$rootScope', 'showService', 'videoService', '$log', function($scope, $rootScope, showService, videoService, $log) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.header = 'Newest';
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.loadMore = function() {
        return showService.getGlobalLastestFeed({
          pageNumber: $scope.currentPage++,
          pageSize: 15
        }).then(function(response) {
          if (angular.isArray($scope.videos)) {
            $scope.videos = $scope.videos.concat(videoService.parseVideo({
              response: response.data
            }));
          } else {
            $scope.videos = videoService.parseVideo({
              response: response.data
            });
          }
          if (response.data.payload && $scope.videos.length >= response.data.payload.totalItem) {
            return $scope.hasMore = false;
          }
        });
      };
      return $scope.loadMore();
    }
  ]);

  angular.module('showroomControllers').controller('PopularController', [
    '$scope', '$rootScope', 'showService', 'videoService', '$log', function($scope, $rootScope, showService, videoService, $log) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.header = 'Popular';
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.loadMore = function() {
        return showService.getGlobalMostLikeFeed({
          pageNumber: $scope.currentPage++,
          pageSize: 15
        }).then(function(response) {
          if (angular.isArray($scope.videos)) {
            $scope.videos = $scope.videos.concat(videoService.parseVideo({
              response: response.data
            }));
          } else {
            $scope.videos = videoService.parseVideo({
              response: response.data
            });
          }
          if (response.data.payload && $scope.videos.length >= response.data.payload.totalItem) {
            return $scope.hasMore = false;
          }
        });
      };
      return $scope.loadMore();
    }
  ]);

  angular.module('showroomControllers').controller('SearchFormController', [
    '$location', '$scope', function($location, $scope) {
      var collapseMenu, path, search;
      path = $location.path();
      search = $location.search();
      if (search.q) {
        switch (path) {
          case '/search/user':
            $scope.userKeywords = search.q;
            break;
          case '/search/show':
            $scope.showKeywords = search.q;
        }
      }
      collapseMenu = function() {
        if (jQuery && jQuery.shifter) {
          return jQuery.shifter('close');
        }
      };
      $scope.searchUser = function() {
        if ($scope.userKeywords) {
          $scope.showKeywords = '';
          collapseMenu();
          $location.search('q', $scope.userKeywords);
          return $location.path('/search/user');
        }
      };
      return $scope.searchShow = function() {
        if ($scope.showKeywords) {
          $scope.userKeywords = '';
          collapseMenu();
          $location.search('q', $scope.showKeywords);
          return $location.path('/search/show');
        }
      };
    }
  ]);

  angular.module('showroomControllers').controller('ShowDetailController', [
    '$scope', 'showService', 'socialService', '$filter', '$log', '$routeParams', 'videoService', '$location', '$rootScope', function($scope, showService, socialService, $filter, $log, $routeParams, videoService, $location, $rootScope) {
      var showId;
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      showId = $routeParams.showId;
      if (!showId) {
        $location.path('/').replace();
      }
      $scope.showId = showId;
      $scope.likeClick = function(event) {
        if (!$rootScope.loggedIn) {
          $rootScope.goToLogin();
        }
        if ($scope.isLiked) {
          return socialService.unlikeAShow(showId).then(function(response) {
            if (response.data.code === 1000) {
              $scope.isLiked = false;
              return $scope.likeCounter--;
            }
          });
        } else {
          return socialService.likeAShow(showId).then(function(response) {
            if (response.data.code === 1000) {
              $scope.isLiked = true;
              return $scope.likeCounter++;
            }
          });
        }
      };
      $scope.loadShow = function() {
        return showService.getShowById(showId).then(function(response) {
          var payload, productInfo, productMetaData, productUrl, showInfo;
          if (!response.data || response.data.code !== 1000) {
            $location.path('/');
          }
          payload = response.data.payload;
          showInfo = payload.ShowInfo;
          productInfo = payload.ProductInfo;
          if (!angular.isObject(productInfo.metaData)) {
            productMetaData = JSON.parse(productInfo.metaData);
          }
          productUrl = productMetaData.url;
          $scope.productName = productInfo.name;
          $scope.productPrice = $filter('number')(productInfo.price, 2);
          $scope.productUrl = $filter('productLink')(productUrl);
          $scope.productTarget = $filter('productTarget')(productUrl);
          $scope.productBrief = productInfo.brief;
          $scope.productCategoryId = productInfo.productCategoryId;
          $scope.video = videoService.parseSingleVideo({
            show: payload.ShowInfo,
            product: payload.ProductInfo
          });
          $scope.likeCounter = showInfo.likeCounter;
          $scope.viewCounter = showInfo.viewCounter;
          $scope.commentCounter = showInfo.commentCounter;
          $scope.shareCounter = showInfo.shareCounter;
          $scope.isLiked = payload.liked;
          return $scope.isFollowed = payload.isFollow;
        })["catch"](function(error) {
          return $log.error(error);
        });
      };
      return $scope.loadShow();
    }
  ]);

  angular.module('showroomControllers').controller('ShowCommentController', [
    '$scope', '$rootScope', 'socialService', '$log', '$routeParams', 'videoService', function($scope, $rootScope, socialService, $log, $routeParams, videoService) {
      var accountMap, getAccountName, refineComment, showId;
      showId = $scope.$parent.showId;
      $scope.commentCounter = $scope.$parent.commentCounter;
      $scope.currentPage = 0;
      accountMap = {};
      getAccountName = function(accountId) {
        var account;
        account = accountMap[accountId];
        if (!account) {
          return '';
        }
        return account.firstName + ' ' + account.lastName;
      };
      refineComment = function(comment) {
        var acc, accountId, accountName, accs, j, len;
        accs = comment.match(/\|`\|(\w+)\|`\|/g);
        if (!accs || accs.length <= 0) {
          return comment;
        }
        for (j = 0, len = accs.length; j < len; j++) {
          acc = accs[j];
          accountId = acc.slice(3, acc.length - 3);
          accountName = '<b>' + getAccountName(accountId) + '</b>';
          comment = comment.replace(acc, accountName);
        }
        return '<p>' + comment + '</p>';
      };
      $scope.deleteComment = function(socialActionId) {
        return socialService.removeCommentAShow(socialActionId).then(function(response) {
          if (response.data.code === 1000) {
            return $scope.loadCommment();
          }
        });
      };
      $scope.commit = function(event) {
        if ($scope.commentForm.$valid) {
          return socialService.commentAShow(showId, {
            comment: $scope.commentText
          }).then(function(response) {
            if (response.data.code !== 1000) {
              return;
            }
            $scope.loadCommment();
            return $scope.commentText = '';
          });
        }
      };
      $scope.loadCommment = function() {
        return socialService.listCommentByShow({
          showId: showId,
          pageSize: 10,
          sortType: 'desc'
        }).then(function(response) {
          var account, checkIsMime, comment, j, len, listAccounts, listComments, payload;
          if (response.data.code !== 1000) {
            return;
          }
          payload = response.data.payload;
          listComments = payload.items.reverse();
          listAccounts = payload.listAccounts;
          for (j = 0, len = listAccounts.length; j < len; j++) {
            account = listAccounts[j];
            accountMap[account.accountId] = account;
          }
          checkIsMime = function(accountId) {
            if (!($rootScope.loggedIn && $rootScope.userInfo)) {
              return false;
            }
            return $rootScope.userInfo.accountId === accountId;
          };
          return $scope.comments = (function() {
            var k, len1, results;
            results = [];
            for (k = 0, len1 = listComments.length; k < len1; k++) {
              comment = listComments[k];
              results.push({
                socialActionId: comment.id,
                authorName: getAccountName(comment.accountId),
                authorAvatarUrl: accountMap[comment.accountId].avatarUrl,
                updatedAt: comment.updatedAt,
                content: refineComment(comment.metaData.comment),
                isMime: checkIsMime(comment.accountId)
              });
            }
            return results;
          })();
        });
      };
      return $scope.loadCommment();
    }
  ]);

  angular.module('showroomControllers').controller('ShowSearchController', [
    'showService', 'videoService', '$scope', '$rootScope', '$location', '$log', function(showService, videoService, $scope, $rootScope, $location, $log) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      if (!$('body').hasClass('search-open')) {
        $('body').addClass('search-open');
      }
      $scope.keywords = $location.search().q;
      $scope.header = 'Search result for show - \'' + $scope.keywords + '\'';
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.loadMore = function() {
        return showService.searchShowByKeywords({
          keywords: $scope.keywords,
          pageNumber: $scope.currentPage++
        }).then(function(response) {
          if (angular.isArray($scope.videos)) {
            $scope.videos = $scope.videos.concat(videoService.parseVideo({
              response: response.data
            }));
          } else {
            $scope.videos = videoService.parseVideo({
              response: response.data
            });
          }
          if (response.data.payload && $scope.videos.length >= response.data.payload.totalItem) {
            return $scope.hasMore = false;
          }
        });
      };
      return $scope.loadMore();
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

  angular.module('showroomControllers').controller('UserDetailController', [
    '$scope', '$rootScope', 'showService', 'userService', '$log', '$routeParams', 'videoService', function($scope, $rootScope, showService, userService, $log, $routeParams, videoService) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      $scope.header = 'Account Show';
      $scope.currentPage = 0;
      $scope.hasMore = true;
      $scope.totalItem = 0;
      $scope.loadMore = function() {
        return showService.getShowByUsername({
          username: $routeParams.username,
          pageNumber: $scope.currentPage++
        }).then(function(response) {
          if (response.data.code === 1000) {
            if ($scope.videos && angular.isArray($scope.videos)) {
              $scope.videos = $scope.videos.concat(videoService.parseVideo({
                response: response.data
              }));
            } else {
              $scope.videos = videoService.parseVideo({
                response: response.data
              });
            }
          } else {
            $log.error(response.data.message);
          }
          if (response.data.payload && $scope.videos.length >= $scope.totalItem) {
            return $scope.hasMore = false;
          }
        });
      };
      return $scope.loadMore();
    }
  ]);

  angular.module('showroomControllers').controller('UserSearchController', [
    'userService', '$scope', '$rootScope', '$location', '$log', function(userService, $scope, $rootScope, $location, $log) {
      $rootScope.removeHeader = false;
      $rootScope.removeBrand = false;
      $rootScope.removeNav = false;
      $rootScope.removeFooter = false;
      if (!$('body').hasClass('search-open')) {
        $('body').addClass('search-open');
      }
      $scope.keywords = $location.search().q;
      return userService.searchAccountByKeywords({
        keywords: $scope.keywords
      }).then(function(response) {
        $scope.header = 'Search result for user - \'' + $scope.keywords + '\'';
        if (response.data.code === 1000) {
          $scope.users = response.data.payload.items;
        }
        if (response.data.code !== 1000) {
          return $scope.message = response.data.message;
        }
      });
    }
  ]);

}).call(this);
