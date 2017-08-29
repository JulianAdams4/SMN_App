/* global angular, document, window */
'use strict';
angular.module('starter.controllers', ['ngCordova', 'chart.js'])



.constant('API', {
//  url: 'http://apismn4movil.herokuapp.com/api'
  url: 'http://www.angiedelpezo.com/api'
//  url: 'http://localhost:3000/api'
})


/*
.config(function($cordovaInAppBrowserProvider) {
  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  };
  document.addEventListener("deviceready", function () {
    $cordovaInAppBrowserProvider.setDefaultOptions(options)
  }, false);
})
*/


.controller('AppCtrl', function(
    $scope, $ionicModal, $ionicPopover, $timeout, $window, $ionicHistory, $state, $ionicLoading, 
    LoginService, $rootScope ) {

    // Color de la Status bar
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#f2aa00';
    });

    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    /*//////////////////////////////////////////
        Usado por el menú desplegable lateral
    //////////////////////////////////////////*/

    $scope.cerrarSesion = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"></ion-spinner> <h4>Cerrando sesión</h4>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 500,
            showDelay: 0
        });
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
        // Send time to hide animation
        LoginService.logOut(500);
    }

})



.controller('InitLoginCtrl', function(
    $scope, $window, $ionicHistory, $state) {

    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
})



.controller('LoginCtrl', function(
    $scope, $timeout, $stateParams, ionicMaterialInk, $ionicModal, $ionicLoading, $ionicHistory, 
    $state, $ionicPopup, $window, $rootScope, NotifyService, LoginService, ConnectivityMonitor ) {

    $scope.init = function () {
        ConnectivityMonitor.startWatching();

        if ( LoginService.isSessionActive() ) {
            var str = LoginService.getToken("rol");
            $state.go(str+'.profile',{});
        }
        else {
            $scope.loginData = {};
            $scope.loginData.loginUser="";
            $scope.loginData.loginPassword="";
        }
    }

    //ionicMaterialInk.displayEffect();

    $scope.login = function () {
        // Campos vacios
        if( $scope.loginData.loginUser=="" || $scope.loginData.loginPassword=="" ){
            NotifyService.notify('<h4>¡Ingrese credenciales válidas!</h4>', 3000);
        }
        else {
            // Animation
            $ionicLoading.show({
                template: '<ion-spinner icon="circles"></ion-spinner> <h4>Por favor, espere</h4>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 0
            });
            /*/////////////////////////////////////// 
                Validacion de credenciales y roles
            ///////////////////////////////////////*/
            var user = $scope.loginData.loginUser;
            var pass = $scope.loginData.loginPassword;

            LoginService.loginUser( user, pass )
            .success(function (data) {
                //console.log(data);
                var ls = {
                    sessionActive: true,
                    rol: 'paciente'
                };
                LoginService.setToken(ls); // Se crea la "session"
                // No back button
                $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true
                });
                $ionicLoading.hide();
                $state.go('paciente.profile',{}, {reload: true});

            })
            .error(function (data) {
                //console.log(data);
                $ionicLoading.hide();
                NotifyService.notify('<h4>¡Usuario o contraseña incorrectos!<br>Por favor verifique las credenciales</h4>',3000);
            });
        } // else empty

    } // end login

    $scope.cerrarSesion = function () {
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"></ion-spinner> <h4>Cerrando sesión</h4>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 500,
            showDelay: 0
        });
        // Send true for hide animation
        LoginService.logOut(500);
    }

})



.controller('CentrosCtrl', function(
    $scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicNavBarDelegate, 
    CentroService, NotifyService ) {

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    // Sin boton atrás
    $ionicNavBarDelegate.showBackButton(true);
    // Que la navbar no se expanda
    $scope.$parent.setExpanded(false);
    // Sin fabContent
    $scope.$parent.setHeaderFab(false);

    $scope.centro = {};

    $scope.init = function () {
        CentroService.allCentros()
        .success(function (data) {
            var dataCentro = data[0];
            $scope.centro = dataCentro;
        })
        .error(function (data) {
            NotifyService.notify('<h4>Ha ocurrido un error y no se pudo<br>obtener la informacion del centro</h4>',3000);
        })
    }

})



.controller('ControlCtrl', function(
    ionicMaterialInk, ionicMaterialMotion, $ionicNavBarDelegate, $scope, $stateParams, $timeout, 
    $window, $http, NotifyService, API ) {

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    // Boton atrás
    $ionicNavBarDelegate.showBackButton(true);
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    // Cargar datos
    $scope.cargarDatosControl = function(){
      $http({
        method: 'GET',
        url: API.url + '/datosControlPaciente'
      })
      .then(function(response){
        $scope.datosControl = response.data;
      }, function(errorResponse){
        var str = errorResponse.data.message || 'Ha ocurrido un error y no se pudo<br>obtener los datos de control';
        NotifyService.notify('<h4>'+str+'</h4>',3000);
      });
    }

    $scope.marcarTarea = function () {
        $window.location.href = '#/child/tareas';
    }

    $scope.regresarATareasParent = function () {
        $window.location.href = '#/parent/tareas';
    }

})



.controller('ProfileCtrl', function(
    ionicMaterialMotion, ionicMaterialInk, $ionicNavBarDelegate, $scope, $stateParams, $timeout, 
    $rootScope, PacienteService, NotifyService, $ionicLoading, $state, $window ) {

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $ionicNavBarDelegate.showBackButton(false);

    $scope.nombreChild = "";
    $scope.noUserData = false;
    $scope.info = {};
    $scope.info.NombresApellidos = "";
    $scope.info.fechaNacimiento = "";
    $scope.info.Cedula = "";
    $scope.info.Sexo = "";
    $scope.info.Email = "";
    $scope.paciente = {}
    $scope.isText = true;

    function formatDate(date) {
        var monthNames = [
            "Ene", "Feb", "Mar", "Abr", 
            "May", "Jun", "Jul", "Ago", 
            "Sep", "Oct", "Nov", "Dic"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return day + '/' + monthNames[monthIndex] + '/' + year;
    }


    $scope.changeType = function () {
        if ( $scope.isText == true ) {
            $scope.isText = false;
        }
        if ( $scope.isText == false ) {
            $scope.isText = true;
        }
        console.log("Changed");
    }

    $scope.getDatosPaciente = function () {
        $ionicNavBarDelegate.showBackButton(false);
        // Animation
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"></ion-spinner> <h4>Cargando...</h4>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 500,
            showDelay: 0
        });

        PacienteService.getDatos()
        .success(function (data) {
            $scope.noUserData = false;
            $scope.nombreChild = data.nombres.split(" ")[0] + ' ' + data.apellidos.split(" ")[0];
            $scope.info.NombresApellidos = data.nombres + ' ' + data.apellidos;
            data.fechaNacimiento = new Date(data.fechaNacimiento);
            $scope.info.fechaNacimiento = formatDate(data.fechaNacimiento);
            $scope.info.Cedula = data.cedula;
            $scope.info.Sexo = data.sexo;
            $scope.info.Email = data.email;
            $scope.paciente = data;
            $rootScope.paciente = $scope.paciente;

            $ionicLoading.hide();
        })
        .error(function (data) {
            $scope.noUserData = true;
            $scope.nombreChild = 'Bienvenido, usuario';
            $scope.info.NombresApellidos = 'None';
            $scope.info.Cedula = '0900000000';
            var today = new Date();
            $scope.info.fechaNacimiento = formatDate(today);
            $scope.info.Sexo = 'Masculino';
            $scope.info.Email = 'none@gmail.com';

            $ionicLoading.hide();
            NotifyService.notify('<h4>Ha ocurrido un error<br>y no se pudo obtener los datos</h4>',3000);
        });
    }

    $scope.getDatosPacienteEdit = function () {
        $ionicNavBarDelegate.showBackButton(true);
        // Animation
        $ionicLoading.show({
            template: '<ion-spinner icon="circles"></ion-spinner> <h4>Cargando...</h4>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 500,
            showDelay: 0
        });

        PacienteService.getDatos()
        .success(function (data) {
            $scope.noUserData = false;
            $scope.nombreChild = data.nombres.split(" ")[0] + ' ' + data.apellidos.split(" ")[0];
            $scope.info.NombresApellidos = data.nombres + ' ' + data.apellidos;
            data.fechaNacimiento = new Date(data.fechaNacimiento);
            $scope.info.fechaNacimiento = formatDate(data.fechaNacimiento);
            $scope.info.Cedula = data.cedula;
            $scope.info.Sexo = data.sexo;
            $scope.info.Email = data.email;
            $scope.paciente = data;
            $rootScope.paciente = $scope.paciente;

            $ionicLoading.hide();
        })
        .error(function (data) {
            $scope.noUserData = true;
            $scope.nombreChild = 'Bienvenido, usuario';
            $scope.info.NombresApellidos = 'None';
            $scope.info.Cedula = '0900000000';
            var today = new Date();
            $scope.info.fechaNacimiento = formatDate(today);
            $scope.info.Sexo = 'Masculino';
            $scope.info.Email = 'none@gmail.com';

            $ionicLoading.hide();
            NotifyService.notify('<h4>Ha ocurrido un error<br>y no se pudo obtener los datos</h4>',3000);
        });
    }

    $scope.submitProfile = function () {
console.log("submit");
        if ( $rootScope.paciente && $rootScope.paciente.password && $rootScope.paciente.password.length<8 ) {
console.log("Menor a 8");
          NotifyService.notify('<h4>La clave ingresada debe tener<br><b>al menos 8 caracteres</b></h4>',3000);
        }
        else {
            // Animation
            $ionicLoading.show({
                template: '<ion-spinner icon="circles"></ion-spinner> <h4>Guardando...</h4>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 0
            });

            PacienteService.editarPaciente($rootScope.paciente)
            .success(function (data) {
                $ionicLoading.hide();
                NotifyService.notify('<h4>Se ha actualizado la información<br>de su perfil exitosamente</h4>',3000);
                $timeout(function() {
                    $window.location.href = '#/paciente/profile';
                },3000);
            })
            .error(function (data) {
                var errMsg = data.message.split("</i>")[1];
                var str = errMsg || 'Ha ocurrido un error<br>y no se pudo actualizar los datos';
                var str2 = '<h4>' + str + '</h4>';
                $ionicLoading.hide();
                NotifyService.notify(str2,4000);
            });
        }
    }

})


/*
.controller('AlertasCtrl', function($scope, $stateParams, $timeout, 
                                    ionicMaterialMotion, ionicMaterialInk, $ionicNavBarDelegate) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    // Sin boton atrás
    $ionicNavBarDelegate.showBackButton(false);
    // Que la navbar no se expanda
    $scope.$parent.setExpanded(false);
    // Sin fabContent
    $scope.$parent.setHeaderFab(false);
    
    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

})
*/


.controller('PlanCtrl', function(
    $scope, $timeout, $http, $ionicNavBarDelegate, $ionicModal, $ionicLoading, 
    $cordovaFileTransfer, $cordovaInAppBrowser, 
    $sce, API, NotifyService, ConnectivityMonitor ) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $ionicNavBarDelegate.showBackButton(false);

    $scope.disableButtons = false;
    $scope.url = '';

    $scope.cargarPlanNutricional = function(){
      // Animation
      $ionicLoading.show({
        template: '<ion-spinner icon="circles"></ion-spinner> <h4>Cargando...</h4>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
      // Get data
      $http({
        method: 'GET',
        url: API.url + '/planNutricionalPacienteVigente'
      })
      .then(
        function(response){
          if ( response.data && response.data.length > 0 ) {
            var documentoUrl = response.data[0].documento;
            $scope.url = documentoUrl;
            $ionicLoading.hide();
            /*
            // Obtenemos el documento PDF
            $http({
              method: 'GET',
              url: $scope.url
            })
            .then(function (data) {
                // PDF string here
                $scope.pdfData = data;
                $ionicLoading.hide();
              },
              function (err) {
                var msj = "<h4>Ha ocurrido un error y no se <br> pudo obtener su plan nutricional</h4>";
                $ionicLoading.hide();
                NotifyService.notify(msj,4000);
            });
            */
          }
          else {
            $scope.disableButtons = true;
            var msj = "<h4>Plan nutricional no disponible</h4>";
            $ionicLoading.hide();
            NotifyService.notify(msj,4000);
          }
        }, 
        function(errorResponse){
          var defaultErrMessage = errorResponse.data.message || "Ha ocurrido un error y no se <br> pudo obtener su plan nutricional";
          $ionicLoading.hide();
          NotifyService.notify("<h4>"+defaultErrMessage+"</h4>",4000);
      });
    }
    /*
    $scope.initModal = function (){    
      // Initialize the modal view.
      $ionicModal.fromTemplateUrl('pdf-viewer.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
    }
    */
    /*
    // Clean up the modal view.
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.mostrarModal = function () {
      $scope.modal.show();
    }

    $scope.cerrarModal = function () {
      $scope.modal.hide();
    }
    */

    $scope.verPlanVigente = function () {
      var closed = false;
      // Animation
      $ionicLoading.show({
        template: '<ion-spinner icon="circles"></ion-spinner> <h4>Cargando...</h4>',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 500,
        showDelay: 0
      });
      var connected = ConnectivityMonitor.isOnline();
      if ( !connected ) {
        var msj = "<h4><b>Parece que no estás conectado a internet</b><br>Revise su conexión e intente de nuevo</h4>";
        $ionicLoading.hide();
        NotifyService.notify(msj, 4000);
        return;
      }
      if ( connected && $scope.pdfurl!="" ) {
        $ionicLoading.hide();
        var options = {
          location: 'yes',
          clearcache: 'yes'
        };
        var type = "_system";
        window.open($scope.pdfurl, type, 'location=yes'); return false;
        /*
        if (device.platform === "iOS") { type = "_blank"; }
        else if (device.platform === "Android") { type = "_system"; }
        else { ; }
        */
        /*
        $cordovaInAppBrowser.open($scope.url, type, options)
        .then(function (event) {
          closed = true;
          $ionicLoading.hide();
          NotifyService.notify("Success", 3000);
        })
        .catch(function (event) {
          closed = true;
          $ionicLoading.hide();
          NotifyService.notify("Error", 3000);
        });
        */
      }
      else {
        var msj = "<h4><b>Ha ocurrido un error</b><br>No se pudo visualizar su plan nutricional</h4>";
        closed = true;
        $ionicLoading.hide();
        NotifyService.notify(msj, 4000);
      }
      // Prevention
      if ( closed == false ) { $ionicLoading.hide(); }
    };
/*
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    function setDefaultsForPdfViewer($scope) {  
      $scope.scroll = 0;
      $scope.loading = 'loading';

      $scope.onError = function (error) {
         console.error(error);
      };

      $scope.onLoad = function () {
        $scope.loading = '';
      };

      $scope.onProgress = function (progress) {
        //console.log(progress);
      };
    }
*/
    $scope.descargarPlanVigente = function () {
      var url = $scope.url;
      var fileName = "plan_nutricional.pdf"
      var targetPath = cordova.file.externalRootDirectory + '/Download/' + fileName;
      var trustHosts = true;
      var options = {};

      if ( url != "" ) {
        // Animation
        $ionicLoading.show({
          template: '<ion-spinner icon="circles"></ion-spinner> <h4>Descargando...</h4>',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 500,
          showDelay: 0
        });
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(
          function(result) {
            // Descargado con exito
            var msj = "<h4><b>¡Se ha descargado su plan nutricional!</b><br>Reviselo en la carpeta de <b>Descargas</b></h4>"
            $ionicLoading.hide();
            NotifyService.notify(msj, 4000);
          }, 
          function(err) {
            // Error
            var msj = "<h4>Ocurrió un <b>error</b> durante la descarga<br>No se ha podido descargar el plan</h4>";
            $ionicLoading.hide();
            NotifyService.notify(msj, 4000);
          }, 
          function (progress) {
            $timeout(function(){
              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
            });
          }
        );
      }
      else {
        var msj = '<h4>Plan nutricional no disponible</h4>';
        $ionicLoading.hide();
        NotifyService.notify(msj, 4000);
      }
    }

})



.controller('CitasCtrl', function(
    $scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, ionicDatePicker ){

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    /*
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });
    */
})



.controller('LogrosCtrl', function(
    $scope, $http, $window, API, NotifyService, $ionicLoading ) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope.suficientesDatos = false;
    $scope.currentDate  = new Date();
    $scope.Year  = $scope.currentDate.getFullYear();
    $scope.Month = $scope.currentDate.getMonth();
    $scope.Day   = $scope.currentDate.getDay();

    $scope.formularioEC = {};
    $scope.datosArray = [];
    $scope.parametros = [];

    $scope.init = function(){
      $scope.getDatosPaciente();
    }

    $scope.getDatosPaciente = function () {
      // Animation
      $ionicLoading.show({
          template: '<ion-spinner icon="circles"></ion-spinner> <h4>Guardando...</h4>',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 0
      });

      var url = API.url + '/datosControlPaciente';
      $http({
        method: 'GET',
        url: url
      })
      .then(
        function(response){
          var datosPaciente = response.data;
          var listaParametros = [];
          
          if ( datosPaciente.length < 2 ) {
            $scope.suficientesDatos = false;
          } 
          else {
            $scope.suficientesDatos = true;
            for (var i = 0; i < datosPaciente.length; i++) {
              var datosArr = datosPaciente[i].datos;
              var fecha = datosPaciente[i].fechaDato;
              for (var j = 0; j < datosArr.length; j++) {
                var nombreDC = datosArr[j].nombreDato;
                var valorDC = datosArr[j].valorDato;
                var elem = {
                  "fecha": fecha,
                  "nombre": nombreDC,
                  "valor": valorDC
                }
                // Si el parametro no está en lista, se añade
                if( listaParametros.indexOf( nombreDC ) < 0 ){
                  listaParametros.push( nombreDC );
                }
                $scope.datosArray.push(elem);
              }
            }
            // Lista de string -> lista de objects
            for ( var z=0; z<listaParametros.length ; z++ ){
              var par = {
                "value": listaParametros[z],
                "label": listaParametros[z]
              }
              $scope.parametros.push(par);
            }
            $scope.formularioEC = {};
            $scope.formularioEC.tipo = "Barras";
            $scope.formularioEC.parametro = $scope.parametros[0].value;
            // Fechas del formulario 
            $scope.formularioEC.inicio = new Date($scope.Year,  0,  1);
            $scope.formularioEC.fin    = new Date($scope.Year, 11, 31);

            $ionicLoading.hide();
          } // else ( >= 2 )
        }, 
        function(errorResponse){
          $scope.suficientesDatos = false;
          // Fechas del formulario 
          $scope.formularioEC.inicio = new Date($scope.Year,  0,  1);
          $scope.formularioEC.fin    = new Date($scope.Year, 11, 31);
          $scope.formularioEC.tipo = "Barras";
          var defaultErrType = errorResponse.data.type || "danger";
          var defaultErrMessage = errorResponse.data.message || "Ha ocurrido un error y no se pudo obtener sus logros";

          $ionicLoading.hide();
          NotifyService.notify(defaultErrMessage,4000);
        } // errorResponse
      );
    }

    $scope.resetChart = function(){
        $scope.series = [ "Año" ];
        $scope.data = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        $scope.unidadGrafico = "";
    }

    // ===================================
    //   Variables del chart 
    // =================================== 
    $scope.unidadGrafico = "";
    $scope.series = [ "Año" ];
    $scope.labels = [
      'Ene', 'Feb', 'Mar', 'Abr', 
      'May', 'Jun', 'Jul', 'Ago',
      'Sep', 'Oct', 'Nov', 'Dic'
    ];

    // Fake data
    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    $scope.lineOptions = {
      legend: { display: true },
      scales: {
        xAxes: [
          { ticks: { maxRotation: 0, minRotation: 0 } }
        ],
        yAxes: [{ 
          type: 'linear', 
          display: true, 
          position: 'left', 
          ticks: { beginAtZero: true } 
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var allData = data.datasets[tooltipItem.datasetIndex].data;
            var tooltipLabel = data.labels[tooltipItem.index];
            var tooltipData = allData[tooltipItem.index];
            var unidad = $scope.unidadGrafico;
            return tooltipLabel + ': ' + tooltipData + ' ' + unidad; 
          }
        }
      }
    };
    $scope.barOptions = {
      legend: { display: true },
      scales: {
        xAxes: [
          { ticks: { maxRotation: 0, minRotation: 0 } }
        ],
        yAxes: [
          { 
            type: 'linear', display: true, position: 'left', 
            ticks: { beginAtZero: true }, 
            stacked: true 
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var allData = data.datasets[tooltipItem.datasetIndex].data;
            var tooltipLabel = data.labels[tooltipItem.index];
            var tooltipData = allData[tooltipItem.index];
            var unidad = $scope.unidadGrafico;
            return tooltipLabel + ': ' + tooltipData + ' ' + unidad; 
          }
        }
      }
    };
    // ===================================

    $scope.submit = function(){
      //console.log($scope.formularioEC.tipo);
      var url = API.url + '/datosControlPacienteRango';
      var dataToSend = {
        'inicio': $scope.formularioEC.inicio, 
        'fin': $scope.formularioEC.fin, 
        'parametro': $scope.formularioEC.parametro 
      };
      $http({
        method: 'POST',
        url: url,
        data: dataToSend
      })
      .then(
        function(response){
          if ($scope.formularioEC.tipo = 'Lineas') { $scope.lineas = true; $scope.barras = false; }
          if ($scope.formularioEC.tipo = 'Barras') { $scope.lineas = false; $scope.barras = true; }
          $scope.series = response.data.series;
          $scope.data = response.data.data;
          $scope.unidadGrafico = response.data.unidad;
        }, 
        function(errorResponse){
          if ($scope.formularioEC.tipo = 'Líneas') { $scope.lineas = true; $scope.barras = false; }
          if ($scope.formularioEC.tipo = 'Barras') { $scope.lineas = false; $scope.barras = true; }
          $scope.series = ["Año"];
          $scope.data = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ];
          $scope.unidadGrafico = "";
          var defaultErrType = errorResponse.data.type || "danger";
          var defaultErrMessage = errorResponse.data.message || "Ha ocurrido un error y no se pudo obtener sus logros";
          NotifyService.notify(defaultErrMessage,4000);
        }
      );
    }

})
;
