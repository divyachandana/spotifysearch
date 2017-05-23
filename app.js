/**
BY Divya Chandana
*/

var spotifyApp = angular.module('spotifyApp', ["ngRoute"]);

//ngRoute module navigates application to different pages without reloading the entire application
spotifyApp.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl  : 'searchSpotifyAlbums.html',
    controller  : 'searchSpotifyAlbumsController'
  });

  // .otherwise({redirectTo: '/'});
});

//spinner directive , can make use of spinner directive in entire application with spinner tag
spotifyApp.directive('spinner',function(){
        return{
          restrict : 'EA',
          replace : true,
          template : "<img src='spinner.gif' height='200' width='200'></img>",
          link : function(scope, element, attribute){
            //scope.$watch('spinner', function(val){
              // if(val){
              //   $(element).show();
              // } else {
              //   $(element).hide();
              // }
            //});
          }
        }
});

// search for spotify albums, artists or playlists
spotifyApp.controller('searchSpotifyAlbumsController', function($scope, $http, $timeout){

  //initializing default values
  function initSpotify(){
    $scope.searchSpotify = 'katty';
    $scope.spinner = true;
    $scope.noItemsFound = false;
    $scope.selectedSpotify = 'album'
    $scope.spotifySearch = [];
    $scope.searchSpotifyAlbums();
  }

//search given name
  $scope.searchSpotifyAlbums = function(search){
    //search from recent searches
    if(search !== null && search !== undefined && search.length >0){
      $scope.searchSpotify = search;
    }

    $scope.spinner = true;
    $scope.noItemsFound = false;

    if($scope.searchSpotify !== null && $scope.searchSpotify !== undefined && $scope.searchSpotify !== ''){

      var endPoint = 'https://api.spotify.com/v1/search?q=' + $scope.searchSpotify + '&type=' + $scope.selectedSpotify;
      $http.get(endPoint)
      .then(function(response){

        var responseData = response.data[$scope.selectedSpotify + 's'];

        if(responseData.items.length <=0){
          $scope.noItemsFound = true;
        }

        $scope.searchResult = responseData.items;
        $timeout(function(){
          $scope.spinner = false;
          //local storage : storing recent searches locally
          var recentSearches = [];
          recentSearches = JSON.parse(localStorage.getItem("spotifySearch"));
          if(recentSearches === undefined  || recentSearches ===null){
            recentSearches = [];
          }

          //checking for duplicates
          if(recentSearches.indexOf($scope.searchSpotify) == -1){
            //placing recent search on top
            recentSearches.unshift($scope.searchSpotify);
          }

          //displaying recent top 5 searched items
          // recentSearches.slice(0,5);
          localStorage.setItem("spotifySearch", JSON.stringify(recentSearches.slice(0,4)));
          $scope.spotifySearch = recentSearches;
        }, 1000);


      });
    }

  };

//popupfor selected item
  $scope.showSelectedDetails = function(item){
    $scope.popupTitle = $scope.selectedSpotify;
        $scope.popupSearchName =item.name;
        $scope.popupImg = item.images[0].url;
        if( item.external_urls.length !== 0 || item.external_urls !== undefined || external_urls !== null){
          $scope.popuphref = item.external_urls.spotify;

        } else{
          $scope.popuphref = '';
        }
      $scope.showPopup = true;
  }

//npm install http-server -g
//http-server F:/workisfun/angulartask
//starts here
  initSpotify();

});
