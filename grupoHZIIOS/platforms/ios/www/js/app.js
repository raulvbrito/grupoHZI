// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('grupoHZIApp', ['ionic','ionic.service.core','ionic.service.push', 'grupoHZIApp.controllers', 'grupoHZIApp.services'])

.run(function($ionicPlatform, $http, $cordovaPush, $rootScope) {
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
  
  var iosConfig = {
	 "badge": true,
	 "sound": true,
	 "alert": true,
	};
	
	setTimeout(function(){
		$cordovaPush.register(iosConfig).then(function(deviceToken) {
			$http.post("https://push.ionic.io/api/v1/push",
				{ "tokens":[ deviceToken ],
				  "notification":{
					"alert":"Hello World!",
					"ios":{
						"badge":1,
						"sound":"ping.aiff",
						"expiry": 1423238641,
						"priority": 10,
						"contentAvailable": true,
						"payload":{
							"key1":"value",
							"key2":"value"
						}
					}
				}
			});
		}, function(error){
			alert('Registration Error');
		});
	}, 5000);
	
	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
		console.log(notification);
		if (notification.alert) {
			navigator.notification.alert(notification.alert);
		}
										   
		if (notification.sound) {
			var snd = new Media(event.sound);
			snd.play();
		}
		
		if (notification.badge) {
			$cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
				console.log(result);
			}, function(err) {
				console.log(err);
			});
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicAppProvider) {
		$ionicAppProvider.identify({
			app_id: '6014ec9b',
			api_key: '60302388fde1b41ebe0c6ca0c1c48179083aa6489de2481b',
			dev_push: true
		});

		
        $stateProvider
        
        .state('login', {
               url: '/login',
               templateUrl: 'templates/login.html',
               controller: 'LoginCtrl'
               })
        
        .state('app', {
               url: '/app',
               abstract: true,
               templateUrl: 'templates/menu.html',
               controller: 'AppCtrl'
               })
        
        .state('app_camera', {
               url: '/app',
               abstract: true,
               templateUrl: 'templates/menu_camera.html',
               controller: 'AppCtrl'
               })
        
        .state('app_plus', {
               url: '/app',
               abstract: true,
               templateUrl: 'templates/menu_plus.html',
               controller: 'AppCtrl'
               })
        
        .state('app.perfil', {
               url: '/perfil',
               views: {
               'menuContent': {
               templateUrl: 'templates/perfil.html',
               controller: 'PerfilCtrl'
               }
               }
               })
        
        .state('app_plus.agendamentos', {
               url: '/agendamentos',
               views: {
               'menuContent': {
               templateUrl: 'templates/agendamentos.html',
               controller: 'AgendamentosCtrl'
               }
               }
               })
        
        .state('app_camera.enviar_arquivos', {
               url: '/enviar_arquivos',
               views: {
               'menuContent': {
               templateUrl: 'templates/enviar_arquivos.html',
               controller: 'EnviarArquivosCtrl'
               }
               }
               })
        
        .state('app.listar_arquivos', {
               url: '/listar_arquivos',
               views: {
               'menuContent': {
               templateUrl: 'templates/listar_arquivos.html',
               controller: 'ListarArquivosCtrl'
               }
               }
               })
        
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
        });
