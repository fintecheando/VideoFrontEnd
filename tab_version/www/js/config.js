angular.module('starter')
//config param of YoVideo App
.constant('appConfig', {
    apiUrl: 'http://test.inspius.com/yovideo/api',
	admobid_ios: {  
				banner: 'ca-app-pub-5666653509036319/5912934928',
				interstitial: 'ca-app-pub-5666653509036319/7389668127'
	},
	admobid_android: {  
				banner: 'ca-app-pub-5666653509036319/1343134527',
				interstitial: 'ca-app-pub-5666653509036319/2819867728'
	},
	adminEmail: 'envato@inspius.com'
});