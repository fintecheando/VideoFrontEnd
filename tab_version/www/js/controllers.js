angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $ionicLoading, $location, appConfig, $ionicSideMenuDelegate) {

	$scope.userInfo = {};

	// Form data for the login modal
	$scope.loginData = {};

	// Form data for the regsiter modal
	$scope.registerData = {};

	// Form data for the forgot modal
	$scope.forgotData = {};
	
	// Form data for the search modal
	$scope.searchData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
	  scope: $scope,
	}).then(function(modal) {
	  $scope.mLogin = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
	  $scope.mLogin.hide();
	};

	// Open the login modal
	$scope.login = function() {
	  $scope.closeRegister();
	  $scope.mLogin.show();
	};

	// Triggered in the register modal to close it
	$ionicModal.fromTemplateUrl('templates/register.html', {
	  scope: $scope,
	}).then(function(modal) {
	  $scope.mRegister = modal;
	});

	// Triggered in the register modal to close it
	$scope.closeRegister = function() {
	  $scope.mRegister.hide();
	};

	// Open the register modal
	$scope.register = function() {
	  $scope.closeLogin();
	  $scope.mRegister.show();
	};

	// Triggered in the forgot password modal to close it
	$ionicModal.fromTemplateUrl('templates/forgot_password.html', {
	  scope: $scope,
	}).then(function(modal) {
	  $scope.mForgotPassword = modal;
	});

	// Triggered in the forgot password modal to close it
	$scope.closeForgotPassword = function() {
	  $scope.mForgotPassword.hide();
	};

	// Open the forgot password modal
	$scope.forgotPassword = function() {
	  $scope.closeLogin();
	  $scope.mForgotPassword.show();
	};

	// Open Menu
	$scope.toggleLeftSideMenu = function() {
	    $ionicSideMenuDelegate.toggleLeft();
	};


	$scope.sendMail = function() {
		cordova.plugins.email.isAvailable(
			function (isAvailable) {
				cordova.plugins.email.open({
						to: appConfig.adminEmail,
						subject: 'Nice Theme!',
						body:    'How are you? Nice greetings from YoVideo'
				});
			}
		);
	};
	//open rate dialog
	$scope.appRate = function() {
	  var customLocale = {};
	  customLocale.title = "Rate YoVideo";
	  customLocale.message = "If you enjoy using YoVideo, would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!";
	  customLocale.cancelButtonLabel = "No, Thanks";
	  customLocale.laterButtonLabel = "Remind Me Later";
	  customLocale.rateButtonLabel = "Rate It Now";

	  AppRate.preferences.openStoreInApp = true;
	  AppRate.preferences.storeAppURL.ios = '849930087';
	  AppRate.preferences.storeAppURL.android = 'market://details?id=com.inspius.yovideo';
	  AppRate.preferences.customLocale = customLocale;
	  AppRate.preferences.displayAppName = 'YoVideo';
	  AppRate.preferences.usesUntilPrompt = 5;
	  AppRate.preferences.promptAgainForEachNewVersion = false;
	  AppRate.promptForRating(true); 
	};
	$scope.doRegister = function() {
	  $ionicLoading.show({
		  template: 'Loading...'
	  });
	  $http({
		  method: 'POST',
		  url: appConfig.apiUrl + '/register',
		  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		  transformRequest: function(obj) {
			  var str = [];
			  for(var p in obj)
				  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			  return str.join("&");
		  },
		  data: $scope.registerData
	  })
	  .success(function(response) {
		  $ionicLoading.hide();
		  // handle success things
		  if(response.code === 1){
			  window.localStorage.setItem("is_login", true);
			  $scope.closeRegister();
		  }
		  else {
			  alert('User is not active or Username/Password is wrong.');
		  }
	  })
	  .error(function(data, status, headers, config) {
		  // handle error things
		  $ionicLoading.hide();
		  alert('User is not active or Username/Password is wrong.');
	  });
	};
  
	$scope.isLoggedIn = function() {
	  if(window.localStorage.getItem("is_login") !== null && window.localStorage.getItem("is_login") === 'true'){
		  $scope.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
		  // console.log($scope.userInfo);
		  return true;
	  }
	  else {
		  return false;
	  }
	};
	$scope.doLogout = function() {
		window.localStorage.setItem("is_login", false);
		window.localStorage.setItem("userInfo", '');
	};
	$scope.doResetPassword = function(forgotForm) {
		if(!forgotForm.$valid) {
			return false;
		}
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http({
			method: 'POST',
			url: appConfig.apiUrl + '/forgot_password',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: $scope.forgotData
		})
		.success(function(response) {
			$ionicLoading.hide();
			// handle success things
			if(response.code === 1){
				alert('An email will be sent to you with reset password link.');
				$scope.closeForgotPassword();
			}
			else {
				alert('There is no account with the given email address. You can register a new account with this email address.');
			}
		})
		.error(function(data, status, headers, config) {
			// handle error things
			$ionicLoading.hide();
			alert('User is not active or Username/Password is wrong.');
		});
  };
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }
    var authResponse = response.authResponse;
    facebookConnectPlugin.getAccessToken(function(token) {
		$scope.updateFbTokenToServer(token);
    }, function(err) {
		fbLoginError("Cannot find the token");
		return;
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
	alert(JSON.stringify(error));
    $ionicLoading.hide();
  };
  $scope.updateFbTokenToServer = function(token) {
	 $http({
		method: 'POST',
		url: appConfig.apiUrl + '/loginFacebook',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		transformRequest: function(obj) {
			var str = [];
			for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			return str.join("&");
		},
		data: {"access-token": token} 
	})
	.success(function(response) {
		$ionicLoading.hide();
		// handle success things
		if(response.code === 1){
			window.localStorage.setItem("is_login", true);
			window.localStorage.setItem("userInfo", JSON.stringify(response.content));
			$scope.closeLogin();
		}
		else {
			alert('User is not active or Username/Password is wrong.');
		}
	})
	.error(function(data, status, headers, config) {
		// handle error things
		$ionicLoading.hide();
		alert('User is not active or Username/Password is wrong.');
	});
  };
  $scope.doLoginFacebook = function() {
	  $ionicLoading.show({
			template: 'Logging in...'
	  });
	  facebookConnectPlugin.getLoginStatus(function(success){
		if(success.status === 'connected'){
			facebookConnectPlugin.getAccessToken(function(token) {
				$scope.updateFbTokenToServer(token);
			}, function(err) {
				fbLoginError("Cannot find the token");
				return;
			});
		} else {
		  facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
		}
	  });
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function(loginForm) {
  	if(!loginForm.$valid) {
  		return false;
  	}
  	$ionicLoading.show({
  		template: 'Loading...'
  	});
  	$http({
  		method: 'POST',
  		url: appConfig.apiUrl + '/login',
  		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		transformRequest: function(obj) {
  			var str = [];
  			for(var p in obj)
  				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  			return str.join("&");
  		},
  		data: $scope.loginData
  	})
  	.success(function(response) {
  		$ionicLoading.hide();
		// handle success things
		if(response.code === 1){
			window.localStorage.setItem("is_login", true);
			window.localStorage.setItem("userInfo", JSON.stringify(response.content));
			$scope.closeLogin();
		}
		else {
			alert('User is not active or Username/Password is wrong.');
		}
	})
  	.error(function(data, status, headers, config) {
		// handle error things
		$ionicLoading.hide();
		alert('There is no account with the given email address. You can register a new account with this email address.');
	});
  };

	$scope.activeMenu = function (path) {
		return ($location.path().indexOf(path) > -1) ? 'active' : '';
	};


	// Remove Back button in Tab Menu
	$scope.hideBackButton = function(){
		var path = $location.path();
		if (path.indexOf('search') != -1
			|| path.indexOf('home') != -1
			|| path.indexOf('categories') != -1){
	     	return 'hide-back-button';
	   	// }else if(path.indexOf('account') != -1){
	   	// 	return 'visible-back-button';
	   	}else{
	   		return '';
	   	}
	}
	

})

.controller('CategoriesCtrl', function($scope, $state, $ionicLoading, $http, appConfig) {
	$scope.categoryData = [];
	$scope.openCategory = function($categoryId){
		angular.forEach($scope.categoryData, function(category, key) {
			if(category.id === $categoryId) {
				window.localStorage.setItem("categoryName",  category.name);
				$state.go('app.category', {categoryId: $categoryId});
				return true;
			}
		});
	}
	$scope.getCategoryListData = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http({
			method: 'GET',
			url: appConfig.apiUrl + '/categories/',
		})
		.success(function(response) {
			$ionicLoading.hide();
			// handle success things
			if (response.code === 1) {
				$scope.categoryData = response.content.all_category;
			}
			else {
				
			}
		});
	};
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		// handle event
		$scope.getCategoryListData();
	});
})

.controller('SingleCategoryCtrl', function($scope, $timeout, $stateParams, $state, $http, $ionicLoading, appConfig) {
	$scope.pageCategory = 1;
	$scope.categoryData = [];
	$scope.canLoadMoreCategoryData = true;
	$timeout(function(){
	$scope.categoryName = window.localStorage.getItem("categoryName");
	}, 700);
	$scope.openVideo = function($videoId) {
		angular.forEach($scope.categoryData, function(video, key) {
			if(video.id === $videoId) {
				window.localStorage.setItem("video",  JSON.stringify(video));
				$state.go('app.video', {videoId: $videoId});
				return true;
			}
		});
	};
	$scope.getCategoryData = function($page) {
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http({
			method: 'GET',
			url: appConfig.apiUrl + '/getListVideoByCategory/'+$stateParams.categoryId+'/'+$page+'/10',
		})
		.success(function(response) {
			$ionicLoading.hide();
			// handle success things
			if (response.code === 1) {
				if(response.content.length > 0){
					angular.forEach(response.content, function(video, key) {
						$scope.categoryData.push(video);
					});
					$scope.pageCategory = $page + 1;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				}			
				else {
					$scope.canLoadMoreCategoryData = false;
				}
			}
			else {
				
			}
		});
	};
	$scope.loadMoreCategoryData = function() {
		$scope.getCategoryData($scope.pageCategory);
	};
	$scope.refreshCategoryData = function() {
		$scope.pageCategory = 1;
		$scope.categoryData = [];
		$scope.canLoadMoreCategoryData = true;
		$scope.getCategoryData(1);
	};
})

.controller('SearchCtrl', function($scope, $state, $http, $ionicLoading, appConfig) {
	$scope.pageSearch = 1;
	$scope.searchData = [];
	$scope.searchFormData = {};
	$scope.canLoadMoreSearchData = false;
	$scope.openVideo = function($videoId) {
		angular.forEach($scope.searchData, function(video, key) {
			if(video.id === $videoId) {
				window.localStorage.setItem("video",  JSON.stringify(video));
				$state.go('app.video', {videoId: $videoId});
				return true;
			}
		});
	};
	$scope.getSearchData = function($page) {
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http({
			method: 'POST',
			url: appConfig.apiUrl + '/getListVideoByKeyword/',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: {"keyword": $scope.searchFormData.keyword, "limit": 10, "page": $page}
		})
		.success(function(response) {
			$ionicLoading.hide();
			// handle success things
			if (response.code === 1) {
				if(response.content.length > 0){
					angular.forEach(response.content, function(video, key) {
						$scope.searchData.push(video);
					});
					$scope.pageSearch = $page + 1;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				}			
				else {
					$scope.canLoadMoreSearchData = false;
				}
			}
			else {
				
			}
		});
	};
	$scope.doSearch = function(){
		$scope.pageSearch = 1;
		$scope.searchData = [];
		$scope.canLoadMoreSearchData = true;
		$scope.getSearchData(1);
	};
	$scope.loadMoreSearchData = function() {
		$scope.getSearchData($scope.pageSearch);
	};
})

.controller('VideoCtrl', function($scope, $sce, $http, appConfig) {
	$scope.videoData = JSON.parse(window.localStorage.getItem("video"));
	$scope.video_url = "";
	$scope.userInfo = {};
	$scope.shareVideo = function($videoId) {
		var options = {
			message: $scope.videoData.title, // not supported on some apps (Facebook, Instagram)
			url: $scope.videoData.video.url,
			chooserTitle: 'Share video' // Android only, you can override the default share sheet title
		};
		window.plugins.socialsharing.shareWithOptions(options, $scope.onSuccessShare);
	};
	$scope.onSuccessShare = function() {
		$http({
			method: 'POST',
			url: appConfig.apiUrl + '/updateStatistics/',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: {"video_id": $scope.videoData.id, "user_id": $scope.userInfo.id, "field": 'share'}
		})
		.success(function(response) {
			// handle success things
			if (response.code === 1) {
			}
			else {
				
			}
		});
	};
	$scope.getVideoType = function() {
		return $scope.videoData.video.type;
	};
	$scope.getVideoUrl = function() {
		if ($scope.videoData.video.type === "YOUTUBE") {
			if($scope.videoData.video.url.split("v=")[1]){
				$scope.video_url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+$scope.videoData.video.url.split("v=")[1].substring(0, 11) + '?showinfo=0');
				return true;
			}
			if($scope.videoData.video.url.split("/")[3]){
				$scope.video_url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+$scope.videoData.video.url.split("v=")[4] + '?showinfo=0');
				return true;
			}
		}
		if ($scope.videoData.video.type === "VIMEO") {
			$scope.video_url = $sce.trustAsResourceUrl($scope.videoData.video.url + '?title=0&byline=0');
			return true;
		}
		if ($scope.videoData.video.type === "FACEBOOK") {
			$scope.video_url = $sce.trustAsResourceUrl("https://www.facebook.com/v2.5/plugins/video.php?allowfullscreen=true&href=" + $scope.videoData.video.url);
			return true;
		}
		$scope.video_url = $sce.trustAsResourceUrl($scope.videoData.video.url);
		
	};
	$scope.addVideoView = function() {
		$http({
			method: 'POST',
			url: appConfig.apiUrl + '/updateStatistics/',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: {"video_id": $scope.videoData.id, "user_id": $scope.userInfo.id, "field": 'view'}
		})
		.success(function(response) {
			// handle success things
			if (response.code === 1) {
			}
			else {
				
			}
		});
	};
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		// handle event
		$scope.getVideoUrl();
		if(window.localStorage.getItem("is_login") !== null && window.localStorage.getItem("is_login") === 'true'){
			$scope.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
		}
		else {
			$scope.userInfo.id = -1;
		}
		$scope.addVideoView();
		// select the right Ad Id according to platform
		var admobid = {};
		if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
		  admobid = appConfig.admobid_ios;
		} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
		  admobid = appConfig.admobid_android;
		} else { // for windows phone

		}
		if(AdMob){
			AdMob.setOptions({
				// adSize: 'SMART_BANNER',
				position: AdMob.AD_POSITION.BOTTOM_CENTER,
				isTesting: true, // set to true, to receiving test ad for testing purpose
				bgColor: 'black', // color name, or '#RRGGBB'
				// autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
				// offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
			});
			AdMob.prepareInterstitial({
			adId: admobid.interstitial,
			position: AdMob.AD_POSITION.TOP_CENTER,
			autoShow: true });
		}
		
	});
})

.controller('HomeCtrl', function($scope, $ionicLoading, $http, $state, appConfig) {
	$scope.pageLatestView = 1;
	$scope.canLoadMoreLatestData = true;
	$scope.latestViewData = [];
	$scope.pageMostView = 1;
	$scope.canLoadMoreMostViewData = true;
	$scope.mostViewData = [];
	$scope.openVideo = function($videoId) {
		angular.forEach($scope.latestViewData, function(video, key) {
			if(video.id === $videoId) {
				window.localStorage.setItem("video",  JSON.stringify(video));
				$state.go('app.video', {videoId: $videoId});
				return true;
			}
		});
		angular.forEach($scope.mostViewData, function(video, key) {
			if(video.id === $videoId) {
				window.localStorage.setItem("video",  JSON.stringify(video));
				$state.go('app.video', {videoId: $videoId});
				return true;
			}
		});
	};
	$scope.getLatestViewData = function($page) {
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http({
			method: 'GET',
			url: appConfig.apiUrl + '/getListVideoLasted/'+$page+'/10'
		})
		.success(function(response) {
			$ionicLoading.hide();
			// handle success things
			if (response.code === 1) {
				if(response.content.videos.length > 0){
					angular.forEach(response.content.videos, function(video, key) {
						$scope.latestViewData.push(video);
					});
					$scope.pageLatestView = $page + 1;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				}			
				else {
					$scope.canLoadMoreLatestData = false;
				}
			}
			else {
				
			}
		})
		.error(function(data, status, headers, config) {
			// handle error things
			$ionicLoading.hide();		
		});
	};
	$scope.loadMoreLatestViewData = function() {
		$scope.getLatestViewData($scope.pageLatestView);
	};
	$scope.refreshLatestViewData = function() {
		$scope.pageLatestView = 1;
		$scope.canLoadMoreLatestData = true;
		$scope.latestViewData = [];
		$scope.getLatestViewData(1);
	};
	$scope.getMostViewData = function($page) {
		$ionicLoading.show({
			template: 'Loading...'
		});
		$http({
			method: 'GET',
			url: appConfig.apiUrl + '/getListVideoMostView/'+$page+'/10',
		})
		.success(function(response) {
			$ionicLoading.hide();
				// handle success things
				if (response.code === 1) {
					if(response.content.videos.length > 0){
						angular.forEach(response.content.videos, function(video, key) {
							$scope.mostViewData.push(video);
						});
						$scope.pageMostView = $page + 1;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.$broadcast('scroll.refreshComplete');
					}			
					else {
						$scope.canLoadMoreMostViewData = false;
					}
				}
				else {

				}
			})
		.error(function(data, status, headers, config) {
				// handle error things
				$ionicLoading.hide();		
			});
		
	};
	$scope.loadMoreMostViewData = function() {
		$scope.getMostViewData($scope.pageMostView);
	};
	$scope.refreshMostViewData = function() {
		$scope.pageMostView = 1;
		$scope.canLoadMoreMostViewData = true;
		$scope.mostViewData = [];
		$scope.getMostViewData(1);
	};
});
