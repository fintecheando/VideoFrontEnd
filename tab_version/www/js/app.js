// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])
.run(function($ionicPlatform) {
  (function(d){
    // load the Facebook javascript SDK

    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";

    ref.parentNode.insertBefore(js, ref);

  }(document));
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.style(1);
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tab_menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: '/home',
      views: {
        'mainContent': {
          templateUrl: 'templates/home.html',
		      controller: 'HomeCtrl'
        }
      }
  })
  .state('app.account', {
    url: '/account',
    views: {
      'mainContent': {
        templateUrl: 'templates/account.html',
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'mainContent': {
        templateUrl: 'templates/search.html',
		    controller: 'SearchCtrl'
      }
    }
  })

  .state('app.categories', {
      url: '/categories',
      views: {
        'mainContent': {
          templateUrl: 'templates/categories.html',
          controller: 'CategoriesCtrl'
        }
      }
    })
  .state('app.category', {
      url: '/category/:categoryId',
      views: {
        'mainContent': {
          templateUrl: 'templates/category.html',
		      controller: 'SingleCategoryCtrl'
        }
      }
    })
  .state('app.video', {
    url: '/video/:videoId',
    views: {
      'mainContent': {
        templateUrl: 'templates/video.html',
        controller: 'VideoCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
