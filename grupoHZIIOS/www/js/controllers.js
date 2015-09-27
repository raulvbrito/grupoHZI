angular.module('grupoHZIApp.controllers', ['ngCordova', 'angular-ladda'])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
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
            })

.controller('AppCtrl', function($scope, $ionicPopup, $state, $cordovaCamera, $timeout, $cordovaFileTransfer, $ionicLoading, $cordovaDialogs, $cordovaImagePicker, $cordovaEmailComposer) {
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
                  
                  console.log(filePosition);
                  
                  if((filesToUpload.length - 1) != filePosition++){
                  $scope.uploadFile(filePosition++);
                  }else{
                  localStorage.removeItem('filesToUpload');
                  $('.progress').fadeOut();
                  
                  $scope.fileGrid();
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
			console.log('oi');
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
			console.log('vai mandar email agora');
			$cordovaEmailComposer.open(email).then(null, function(){});
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
            });

.controller('ListarArquivosCtrl', function($scope, $state) {
			$scope.data = {};
			
			$scope.listar_arquivos = function() {}
			});