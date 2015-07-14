var Constants = {
  sessionParam: 'showroomSId',
  registerSessionURL: 'http://services.showroomapp.net/session/register',
  serviceBundleId: 'showroom.ios',
  serviceVersion: '1.0.8',
  getFeaturedFeedURL: 'http://services.showroomapp.net/feed/featured/0/15/',
  getPopularFeedURL: 'http://services.showroomapp.net/feed/most/like/0/15/',
  getNewestFeedURL: 'http://services.showroomapp.net/feed/latest/0/15/',
  showroomCDN: 'http://cdn.showroomapp.tv/'
};

var app = angular.module('myApp', [
  "ngCookies",
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.poster"
]);
    
app.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.config(function ($sceProvider) {
  $sceProvider.enabled(false);
});

app.filter('jsonParse', function() {
  return function(input) {
    return angular.isObject(input) ? input : JSON.parse(input);
  };
});

app.factory('CheckSessionId', function($cookies, $http, $q) {
  var deferred = $q.defer();
  var sessionId = $cookies.get(Constants.sessionParam);
  var now = new Date();
  var exp = new Date(now.getTime() + 40*50*1000);
  var data = {
    deviceId: '',
    model: '',
    name: '',
    osName: '',
    osVersion: '',
    bundleId: Constants.serviceBundleId,
    bundleVersion: Constants.serviceVersion,
    langCode: ''
  };
  
  if (sessionId) {
    $cookies.put(Constants.sessionParam, sessionId, {
      expires: exp
    }); 
    deferred.resolve(sessionId);
  } else {
    $http({
      url: Constants.registerSessionURL,
      method: 'POST',
      data: data
    })
    .success(function(response) {
      sessionId = response.payload.sessionId;
      if (response.code == 1000) {
        
        $cookies.put(Constants.sessionParam, response.payload.sessionId, {
          expires: exp
        }); 
      	deferred.resolve(response.payload.sessionId);
      } else { 
        deferred.reject('Error when register session');
      }
      
    })
    .error(function(data) {
      deferred.reject(data);
    })
  }
  
  return deferred.promise;
});


app.controller('myCtrl', [
  "$scope","$http","CheckSessionId", "$sce","VG_STATES",
  function($scope, $http, CheckSessionId, $sce, VG_STATES) {
    
  $scope.cdn = Constants.showroomCDN;
  $scope.theme = '//cdn.shopify.com/s/files/1/0853/2260/t/6/assets/videogular.min.css?10437709724679761488';
  $scope.currentAPI;
    
  CheckSessionId
  .then(function(sessionId) {
    var featuredUrl = Constants.getFeaturedFeedURL + sessionId;
    var popularUrl = Constants.getPopularFeedURL + sessionId;
    var newestUrl = Constants.getNewestFeedURL + sessionId;
    
    // Featured shows
    $http.get(featuredUrl)
    .success(function(response) {
      if (response.code == 1000) {
       	$scope.featuredVideos = [];
        $scope.featuredShows = response.payload.listShows;
        $scope.featuredProducts = response.payload.listProducts;
        
        angular.forEach($scope.featuredShows, function(show, index) {
          $scope.featuredVideos[index] = {
            preload: 'none',
            sources: [
              {
                src: $sce.trustAsResourceUrl($scope.cdn + $scope.featuredShows[index].videoSets['400']),
                type: 'video/mp4'
              }
            ],
            poster: $sce.trustAsResourceUrl($scope.cdn + $scope.featuredShows[index].thumbnailSets['700']),
            onPlayerReady: function($API) {
              var instance = this;
              instance.API = $API;
            }, 
            play: function() {
              var instance = this;
              if ($scope.currentAPI && $scope.currentAPI.currentState == VG_STATES.PLAY) {
                $scope.currentAPI.stop();
              }
              if (instance.API && instance.API.currentState != VG_STATES.PLAY) {
                $scope.currentAPI = instance.API;
                instance.API.play();
              }
            },
            likeCounter: $scope.featuredShows[index].likeCounter,
            viewCounter: $scope.featuredShows[index].viewCounter,
            commentCounter: $scope.featuredShows[index].commentCounter,
            shareCounter: $scope.featuredShows[index].shareCounter
          };
        });
      }
    })
    .error(function(data) {
      alert(data);
    });
    
    
    // Popular shows
    $http.get(popularUrl)
    .success(function(response) {
      if (response.code == 1000) {
       	$scope.popularVideos = [];
        $scope.popularShows = response.payload.listShows;
        $scope.popularProducts = response.payload.listProducts;
        
        angular.forEach($scope.popularShows, function(show, index) {
          $scope.popularVideos[index] = {
            preload: 'none',
            sources: [
              {
                src: $sce.trustAsResourceUrl($scope.cdn + $scope.popularShows[index].videoSets['400']),
                type: 'video/mp4'
              }
            ],
            poster: $sce.trustAsResourceUrl($scope.cdn + $scope.popularShows[index].thumbnailSets['700']),
            onPlayerReady: function($API) {
              var instance = this;
              instance.API = $API;
            }, 
            play: function() {
              var instance = this;
              if ($scope.currentAPI && $scope.currentAPI.currentState == VG_STATES.PLAY) {
                $scope.currentAPI.stop();
              }
              if (instance.API && instance.API.currentState != VG_STATES.PLAY) {
                $scope.currentAPI = instance.API;
                instance.API.play();
              }
            },
            likeCounter: $scope.popularShows[index].likeCounter,
            viewCounter: $scope.popularShows[index].viewCounter,
            commentCounter: $scope.popularShows[index].commentCounter,
            shareCounter: $scope.popularShows[index].shareCounter
          };
        });
      }
    })
    .error(function(data) {
      alert(data);
    });
    
    // Newest shows
    $http.get(newestUrl)
    .success(function(response) {
      if (response.code == 1000) {
       	$scope.newestVideos = [];
        $scope.newestShows = response.payload.listShows;
        $scope.newestProducts = response.payload.listProducts;
        
        angular.forEach($scope.newestShows, function(show, index) {
          $scope.newestVideos[index] = {
            preload: 'none',
            sources: [
              {
                src: $sce.trustAsResourceUrl($scope.cdn + $scope.newestShows[index].videoSets['400']),
                type: 'video/mp4'
              }
            ],
            poster: $sce.trustAsResourceUrl($scope.cdn + $scope.newestShows[index].thumbnailSets['700']),
            onPlayerReady: function($API) {
              var instance = this;
              instance.API = $API;
            }, 
            play: function() {
              var instance = this;
              if ($scope.currentAPI && $scope.currentAPI.currentState == VG_STATES.PLAY) {
                $scope.currentAPI.stop();
              }
              if (instance.API && instance.API.currentState != VG_STATES.PLAY) {
                $scope.currentAPI = instance.API;
                instance.API.play();
              }
            },
            likeCounter: $scope.newestShows[index].likeCounter,
            viewCounter: $scope.newestShows[index].viewCounter,
            commentCounter: $scope.newestShows[index].commentCounter,
            shareCounter: $scope.newestShows[index].shareCounter
          };
        });
      }
    })
    .error(function(data) {
      alert(data);
    });
    
  }, function(error) {
    console.log("Deo lay duoc sessionId, error: " + error);
  });
}]);