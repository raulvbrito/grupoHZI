// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('grupoHZIApp', ['ionic','ionic.service.core','ionic.service.push', 'grupoHZIApp.controllers', 'grupoHZIApp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
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
        
        .state('app.perfil', {
               url: '/perfil',
               views: {
               'menuContent': {
               templateUrl: 'templates/perfil.html',
               controller: 'PerfilCtrl'
               }
               }
               })
        
        .state('app.enviar_arquivos', {
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
