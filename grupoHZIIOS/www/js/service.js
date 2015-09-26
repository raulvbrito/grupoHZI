angular.module('grupoHZIApp.services', [])

.service('LoginService', function($q) {
         return {
         loginUser: function(name, pw) {
         var deferred = $q.defer();
         var promise = deferred.promise;
         console.log(name);
         console.log(pw);
         if (name == 'user' && pw == 'secret') {
         deferred.resolve('Olá ' + name + '!');
         } else {
         deferred.reject('Usuário ou senha incorretos');
         }
         promise.success = function(fn) {
         promise.then(fn);
         return promise;
         }
         promise.error = function(fn) {
         promise.then(null, fn);
         return promise;
         }
         return promise;
         }
         }
         })

.service('PerfilService', function($q) {
         return {
         perfilUser: function() {
         }
         }
         })

.service('EnviarArquivosService', function($q) {
         return {
         perfilUser: function() {
         }
         }
         })