angular.module('grupoHZIApp.controllers', ['ngCordova', 'angular-ladda'])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $rootScope, $ionicUser, $ionicPush, $log) {
            $scope.data = {};
            $scope.submitting = false;
            
            $scope.login = function() {
            LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
                                                                                       console.log(data);
                                                                                       $scope.submitting = true;                                        $state.go('app.perfil');
                                                                                       }).error(function(data) {
                                                                                $scope.submitting = true;                                          console.log(data);
                                                                                                $state.go('app.perfil');
                                                                                                /*var alertPopup = $ionicPopup.alert({
                                                                                                 title: 'Falha no login',
                                                                                                 template: 'Usuário ou senha incorretos'
                                                                                                 });*/
                                                                                                });
            }
            
            $rootScope.$on('$cordovaPush:tokenReceived', function(event, data){
                           alert('success' + data.token);
                           console.log(data.platform);
                           $scope.token = data.token;
                           })
            
            $scope.identifyUser = function() {
            $log.info('Ionic User: Identifying with Ionic User service');
            
            var user = $ionicUser.get();
            if(!user.user_id) {
            // Set your user_id here, or generate a random one.
            user.user_id = $ionicUser.generateGUID();
            };
            
            // Add some metadata to your user object.
            angular.extend(user, {
                           name: 'Ionitron',
                           bio: 'I come from planet Ion'
                           });
            
            // Identify your user with the Ionic User Service
            $ionicUser.identify(user).then(function(){
                                           $scope.identified = true;
                                           alert('Identified user ' + user.name + '\n ID ' + user.user_id);
                                           $scope.pushRegister();
                                           });
            };
            
            $scope.pushRegister = function() {
            $log.info('Ionic Push: Registering user');
            
            // Register with the Ionic Push service.  All parameters are optional.
            $ionicPush.register({
                                canShowAlert: true, //Can pushes show an alert on your screen?
                                canSetBadge: true, //Can pushes update app icon badges?
                                canPlaySound: true, //Can notifications play a sound?
                                canRunActionsOnWake: true, //Can run actions outside the app,
                                onNotification: function(notification) {
                                // Handle new push notifications here
                                // $log.info(notification);
                                return true;
                                }
                                });
            };
            
            })

.controller('AppCtrl', function($scope, $ionicPopup, $state, $cordovaCamera, $timeout, $cordovaFileTransfer, $ionicLoading, $cordovaDialogs, $cordovaImagePicker, $cordovaEmailComposer, $cordovaToast) {
            $scope.data = {};
            
            $scope.app = function() {}
            
            $scope.submitting = false;
            
            $scope.takePicture = function(){
            $('.loading').fadeIn();
            var options = {
            quality: 40,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            };
            
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                                                    $scope.saveFileToLocalStorage(imageURI, 'jpg');
													
													setTimeout(function(){
															   $cordovaToast.showLongBottom('Foto capturada').then(function(success) {}, function (error) {});
														}, 1000);
                                                    }, function(err) {
                                                    $('.loading').fadeOut();
                                                    });
            
            
            //$cordovaCamera.cleanup().then(...);
												}
            
            $scope.saveFileToLocalStorage = function(file, type){
            console.log(file);
            console.log(type);
            var newFileArray = [];
            var files = [];
            var fileArray = {};
            var filesToUpload = localStorage.getItem('filesToUpload');
            
            if(filesToUpload != null && filesToUpload != ''){
            fileArray.fileURI = file;
            fileArray.fileType = type;
            
            newFileArray = JSON.parse(filesToUpload);
            newFileArray.push(fileArray);
            
            localStorage.setItem('filesToUpload', JSON.stringify(newFileArray));
            }else{
            fileArray.fileURI = file;
            fileArray.fileType = type;
            
            files.push(fileArray);
            
            localStorage.setItem('filesToUpload', JSON.stringify(files));
            }
            
            $scope.fileGrid();
            }
			
            $scope.fileGrid = function(){
            var filesToUpload = JSON.parse(localStorage.getItem('filesToUpload'));
            var fileName;
            $('.files-to-upload-container').html('');
            
            if(localStorage.getItem('filesToUpload') != null){
            $.each(filesToUpload, function(key, file){
                   fileName = filesToUpload[key].fileURI.substr(filesToUpload[key].fileURI.lastIndexOf('/')+1);
                   if(filesToUpload[key].fileURI.indexOf("content://") > -1)
                   fileName = fileName+"."+filesToUpload[key].fileType;
                   $('.files-to-upload-container').append('<div class="col col-50 file" style="background-image: url('+filesToUpload[key].fileURI+')" ng-click="sendEmail('+filesToUpload[key].fileURI+')"><div class="file-content icon '+filesToUpload[key].fileType+'"><h6 class="filename text-center center">'+fileName+'</h6></div></div>');
				   //$scope.sendEmail(encodeURI(filesToUpload[key].fileURI));
                   });
			
            }
            
            $('.loading').fadeOut();
            }
            
            $scope.uploadFile = function(filePosition){
            $scope.submitting = true;
            if(localStorage.getItem('filesToUpload') != null){
            $('.loading').fadeIn();
            var trustHosts = true;
            var filesToUpload = JSON.parse(localStorage.getItem('filesToUpload'));
            var options = {};
            options.fileKey="file";
            options.fileName = filesToUpload[filePosition].fileURI.substr(filesToUpload[filePosition].fileURI.lastIndexOf('/')+1);;
            options.mimeType="*/*";
            options.chunkedMode = true;
            options.headers = {
            Connection: "close"
            };
            
            
            
            $cordovaFileTransfer.upload(encodeURI("http://logconect.com.br/controllers/fileUpload.php"), filesToUpload[filePosition].fileURI, options, true)
            .then(function(result) {
                  console.log(result);
                  var filesToUpload = JSON.parse(localStorage.getItem('filesToUpload'));
                  
                  if((filesToUpload.length - 1) != filePosition++){
                  $scope.uploadFile(filePosition++);
                  }else{
                  localStorage.removeItem('filesToUpload');
                  $('.progress').fadeOut();
                  
                  $scope.fileGrid();
				  
				  setTimeout(function(){
							 $cordovaToast.showLongBottom('Arquivos enviados').then(function(success) {}, function (error) {});
					}, 1000);
                  }
                  $scope.submitting = false;
                  // Success!
                  }, function(err) {
                  console.log(err);
                  $('.loading').fadeOut();
                  //var alertPopup = $ionicPopup.alert({
                  //                                   title: 'Falha no envio de arquivos',
                  //                                   template: 'Ocorreu um erro no envio de arquivos'
                  //                                   });
                  $cordovaDialogs.alert('Ocorreu um erro no envio de arquivos', 'Atencao', 'OK').then(function(){});
                  $scope.submitting = false;
                  // Error
                  }, function (progress) {
                  });
            }
            }
			
			$scope.sendEmail = function(fileURI){
			console.log(fileURI);
			var email = {
			to: 'raulvbrito@gmail.com',
			attachments: [
						  fileURI
						  ],
			subject: 'Arquivo via Email',
			body: 'Prezado(a) Cliente, <br><br> Você acaba de receber um(a) <b>arquivo</b>. Clique no mesmo para abri-lo ou baixa-lo.',
			isHtml: true
			};
			$cordovaEmailComposer.open(email).then(null, function(){});
			}
			
			$scope.downloadFileGrid = function(){
			
			}
			
			$scope.downloadFileGrid();
			
			$scope.downloadFile = function(fileURL){
			$('.loading').fadeIn();
			var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
			var targetPath = cordova.file.documentsDirectory + "testImage.png";
			var trustHosts = true;
			var options = {};
			
			$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
			.then(function(result) {
				  // Success!
				  console.log(result);
				  console.log('baixou');
      }, function(err) {
				  // Error
				  console.log(err);
				  console.log('deu erro no download');
      }, function (progress) {
				  $timeout(function () {
						   $scope.downloadProgress = (progress.loaded / progress.total) * 100;
						   })
      });
			}
			
			$scope.pickFile = function(){
			var options = {
   maximumImagesCount: 10,
   width: 800,
   height: 800,
   quality: 80
			};
			
			$cordovaImagePicker.getPictures(options)
			.then(function (results) {
      for (var i = 0; i < results.length; i++) {
				  $scope.saveFileToLocalStorage(results[i], 'jpg');
      }
                  setTimeout(function(){
						$cordovaToast.showLongBottom('Arquivos selecionados').then(function(success) {}, function (error) {});
					}, 1000);
				  }, function(error) {
      // error getting photos
				  console.log(error);
				  });
			}
            
            })

.controller('PerfilCtrl', function($scope, $state) {
            $scope.data = {};
            
            $scope.perfil = function() {}
            
            //$('.ion-camera').hide();
            })

.controller('EnviarArquivosCtrl', function($scope, $state) {
            $scope.data = {};
            
            $scope.enviar_arquivos = function() {}
            
            //$('.ion-camera').show();
            
            localStorage.removeItem('filesToUpload');
            })

.controller('ListarArquivosCtrl', function($scope, $state) {
			$scope.data = {};
			
			$scope.listar_arquivos = function() {}
			
			})

.run(function($http, $cordovaPush, $rootScope) {
	 setTimeout(function(){
  var iosConfig = {
	 "badge": true,
	 "sound": true,
	 "alert": true,
  };
	 console.log(iosConfig);
	 
	 $cordovaPush.register(iosConfig).then(function(deviceToken) {
																  // Success -- send deviceToken to server, and store for future use
										   console.log("deviceToken: " + deviceToken);
										   console.log('antes do post');
                                           $http.post("https://push.ionic.io/api/v1/push", {"tokens":[
                                                                                                      deviceToken
                                                                                                      ],
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
										   console.log('depois do post');
																  }, function(err) {
										   alert("Registration error: " + err);
																  });
				}, 5000);
	 
							$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
										   console.log('entrou no notification');
										   if (notification.alert) {
										   navigator.notification.alert(notification.alert);
										   }
										   
										   if (notification.sound) {
										   var snd = new Media(event.sound);
										   snd.play();
										   }
										   
										   if (notification.badge) {
										   $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
																								// Success!
																								console.log(result);
																								}, function(err) {
																								console.log(err);
																								});
										   }
										   });
							
	 });
	 