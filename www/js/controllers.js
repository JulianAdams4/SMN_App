/* global angular, document, window */
'use strict';

angular.module('starter.controllers', ['ionic-datepicker'])
.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Selecciona un dia',
      setLabel: 'SI',
      todayLabel: 'Hoy',
      closeLabel: 'X',
      mondayFirst: false,
      weeksList: ["D", "L", "M", "M", "J", "V", "S"],
      monthsList: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      templateType: 'popup',
      from: new Date(2010, 1, 1),
      to: new Date(2018, 12, 31),
      showTodayButton: false,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })


.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, 
                                $timeout, $window, $ionicHistory,
                                $state) {

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

    $scope.cerrarSesion = function () {
        $window.localStorage.clear();
        $window.sessionStorage.clear();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        // **********
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
        // **********
        $scope.hideNavBar();
        $scope.noHeader();
        $window.location.href = '#/app/login';
        //$state.go('app.login',{}, {reload: true});
    }
})


.controller('InitLoginCtrl', function($scope, $window, $ionicHistory,
                                      $state) {

    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    $scope.cerrarSesion = function () {
        $window.localStorage.clear();
        $window.sessionStorage.clear();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        // **********
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
        // **********
        $window.location.href = '#/app/login';
        //$state.go('app.login',{}, {reload: true});
    }
})


.controller('LoginCtrl', function($scope, $timeout, $stateParams, 
                                  ionicMaterialInk, $ionicModal, $ionicLoading, 
                                  $ionicHistory, $state, $ionicPopup, 
                                  $window) {

    $scope.init = function () {
        if ( $scope.isSessionActive() ) {
            var str = $window.localStorage.getItem('rol');
            $state.go(str+'.profile',{});
        }
        else {
            $scope.loginData = {};
            $scope.loginData.loginUser="";
            $scope.loginData.loginPassword="";
            $scope.rolLogin="";
        }
    }

    /*
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    */
    ionicMaterialInk.displayEffect();

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('gbCaseEdit.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.errorModal = modal;
    });

    // Triggered in the login modal to close it
    $scope.cerrarModalError = function() {
        $scope.errorModal.hide();
    };

    // Open the login modal
    $scope.mostrarModalError = function() {
        $scope.errorModal.show();
    };

    $scope.isSessionActive = function () {
        return $window.localStorage.id ? true : false;
    }

    $scope.setToken = function (tokens) {
        for (var key in tokens){
            $window.localStorage.setItem(key , encodeURIComponent(tokens[key]) );
        }
    }

    $scope.login = function () {

        // Campos vacios
        if( $scope.loginData.loginUser=="" || $scope.loginData.loginPassword=="" ){
            //$rootScope.notify('<h4>¡Ingrese credenciales válidas!</h4>');
            alert('Ingrese credenciales válidas');
            return false;
        }
        else {
            // Animation
            $ionicLoading.show({
                template: '<ion-spinner icon="circles" class="spinner-calm"></ion-spinner><h4>Autenticando</h4>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 0
            });

            /*/////////////////////////////////////// 
                Validacion de credenciales y roles
            ///////////////////////////////////////*/
            if ( $scope.loginData.loginUser=="1" && $scope.loginData.loginPassword=="1" ) {
                $scope.rolLogin = "child";
                $scope.idUser = "001";

                var ls = {
                    rol: $scope.rolLogin, 
                    id: $scope.idUser
                };

                // Se crea la session
                $scope.setToken(ls);

                $ionicLoading.hide();
                $scope.loginData.loginPassword="";
                
                /* ********** */
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                /* ********* */
                $state.go('child.profile',{}, {reload: true});
            }
            else if ( $scope.loginData.loginUser=="2" && $scope.loginData.loginPassword=="2" ) {
                $scope.rolLogin = "teacher";
                $scope.idUser = "002";

                var ls = {
                    rol: $scope.rolLogin, 
                    id: $scope.idUser
                };

                // Se crea la session
                $scope.setToken(ls);

                $ionicLoading.hide();
                $scope.loginData.loginPassword="";
                
                /* ********** */
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                /* ********* */
                $state.go('teacher.profile',{}, {reload: true});
            }
            else if ( $scope.loginData.loginUser=="3" && $scope.loginData.loginPassword=="3" ) {
                $scope.rolLogin = "parent";
                $scope.idUser = "003";

                var ls = {
                    rol: $scope.rolLogin, 
                    id: $scope.idUser
                };

                // Se crea la session
                $scope.setToken(ls);

                $ionicLoading.hide();
                $scope.loginData.loginPassword="";
                
                /* ********** */
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                /* ********* */
                $state.go('parent.profile',{}, {reload: true});
            }
            else {
                $ionicLoading.hide();
                $scope.mostrarModalError();
                $scope.loginData.loginPassword="";
            }

        }

    } // end login

})

.controller('TareasCtrl', function($scope, $stateParams, $timeout, 
                                    ionicMaterialInk, ionicMaterialMotion, $ionicNavBarDelegate) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    // Sin boton atrás
    $ionicNavBarDelegate.showBackButton(false);
    // Que la navbar no se expanda
    $scope.$parent.setExpanded(false);
    // Sin fabContent
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    /*
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
    */
    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('DetalleTareaCtrl', function(ionicMaterialInk, ionicMaterialMotion, $ionicNavBarDelegate, 
                                         $scope, $stateParams, $timeout, 
                                         $window) {

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    // Boton atrás
    $ionicNavBarDelegate.showBackButton(true);
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    // Cargar datos
    $scope.init = function () {
        // Boton atrás
        $ionicNavBarDelegate.showBackButton(true);

        var id = $stateParams.idTarea;

        $scope.viewData = {}
        if (id) {
            switch(id) {
                case "001":
                    $scope.viewData = {
                        titulo: "Investigación sobre célula vegetal", 
                        materia: "Ciencias Naturales", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui. Sed at arcu non neque semper dignissim", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "Pendiente"
                    }
                    break;
                case "002":
                    $scope.viewData = {
                        titulo: "Escribir ensayo sobre el 24 de Julio", 
                        materia: "Lenguaje y comunicación", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui.", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "Realizada"
                    }
                    break;
                case "003":
                    $scope.viewData = {
                        titulo: "Miscelánea de ejercicios", 
                        materia: "Matemáticas", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui.", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "No realizada"
                    }
                    break;
                case "004":
                    $scope.viewData = {
                        titulo: "Investigación sobre mitosis", 
                        materia: "Ciencias Naturales", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui.", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "Realizada"
                    }
                    break;
                case "005":
                    $scope.viewData = {
                        titulo: "Ejercicios página 50", 
                        materia: "Matemáticas", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui.", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "Realizada"
                    }
                    break;
                case "006":
                    $scope.viewData = {
                        titulo: "Llevar diccionario", 
                        materia: "Lenguaje y comunicación", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui.", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "Realizada"
                    }
                    break;
                default:
                    $scope.viewData = {
                        titulo: "Titulo de la tarea", 
                        materia: "Materia 1", 
                        descripcion: "Lorem ipsum dolor sit amet. Nam pharetra ipsum et eleifend volutpat. Proin ultrices rutrum sapien, id feugiat arcu vestibulum pretium. Sed cursus nisl massa, ut porta ipsum sagittis sit amet. Quisque a nisi non arcu vehicula porttitor. Nunc nec erat dui.", 
                        fechaEntrega: "24-Julio-2017", 
                        estado: "Pendiente"
                    }
                    
            } /* End switch */
        }
    }

    $scope.marcarTarea = function () {
        $window.location.href = '#/child/tareas';
    }

    $scope.regresarATareasParent = function () {
        $window.location.href = '#/parent/tareas';
    }

})


.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {

    // Nombres ficticios
    $scope.nombreChild = "Julián Adams";
    $scope.nombreParent = "Elizabeth Sánchez";
    $scope.nombreTeacher = "Erick Pérez";

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('EventosCtrl', function($scope, $stateParams, $timeout, 
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


.controller('CalendarioCtrl', function($scope, $stateParams, $timeout, 
                                        ionicMaterialInk, ionicMaterialMotion, ionicDatePicker) {

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


    $scope.selectedDate1;
    $scope.selectedDate2;

    var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is :\n-> ', new Date(val));
      },
      titleLabel: 'Selecciona un dia',
      setLabel: 'Fijar',
      todayLabel: 'Hoy',
      closeLabel: 'Cerrar',
      disabledDates: [],
      from: new Date(2010, 1, 1), //Optional
      to: new Date(2020, 12, 31), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.abrirCalendarioPopup = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

    // ------------------------------

    $scope.$on('$viewContentLoaded', function() {
        $scope.abrirCalendarioModal();
    });

    $scope.abrirCalendarioModal = function (val) {
      var ipObj1 = {
        callback: function (val) {  //Mandatory
          console.log('Return value from the datepicker modal is:\n -> ', new Date(val));
          $scope.selectedDate2 = new Date(val);
        },
        disabledDates: [],
        titleLabel: 'Selecciona un dia',
        setLabel: 'Fijar',
        todayLabel: 'Hoy',
        closeLabel: 'Cerrar',
        from: new Date(2010, 1, 1),
        to: new Date(2020, 12, 31),
        inputDate: new Date(),
        mondayFirst: false, 
        disableWeekdays: [],
        showTodayButton: true,
        closeOnSelect: false,
        templateType: 'modal'
      };
      ionicDatePicker.openDatePicker(ipObj1);
    }


})


.controller('HorarioCtrl', function($scope, $stateParams, $timeout, 
                                        ionicMaterialInk, ionicMaterialMotion, ionicDatePicker) {

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

.controller('CalificacionesCtrl', function($scope, $stateParams, $timeout, 
                                        ionicMaterialInk, ionicMaterialMotion) {

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
    $scope.calificaciones = [
        {
          id: "001", 
          materia: "Matemáticas",
          deberes: '10/10',
          lecciones: '25/30',
          examen: '50/60'
        },
        {
          id: "002", 
          materia: "Lenguaje",
          deberes: '15/20',
          lecciones: '20/30',
          examen: '46/50'
        },
        {
          id: "003", 
          materia: "Ciencias Naturales",
          deberes: '7/10',
          lecciones: '30/30',
          examen: '58/60'
        },
        {
          id: "004", 
          materia: "Música Contemporánea",
          deberes: '10/10',
          lecciones: '30/10',
          examen: '60/60'
        }
    ];

})


.controller('DetalleCalificacionCtrl', function($scope, $stateParams, $timeout, 
                                        ionicMaterialInk, ionicMaterialMotion, $ionicNavBarDelegate) {

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

    // Cargar datos
    $scope.init = function () {
        // Boton atrás
        $ionicNavBarDelegate.showBackButton(true);
        var id = $stateParams.idCalif;
        if ( id=="001" ) { $scope.name = "Matemáticas" }
        if ( id=="002" ) { $scope.name = "Lenguaje" }
        if ( id=="003" ) { $scope.name = "Ciencias Naturales" }
        if ( id=="004" ) { $scope.name = "Música Contemporánea" }
        $scope.viewData = {
            id: "001", 
            materia: $scope.name, 
            total: '85/100', 
            deberes: {
                total: '10/10',
                detalle: ['3/3', '4/4', '3/3']
            }, 
            lecciones: {
                total: '25/30',
                detalle: ['10/10', '5/10', '10/10']
            }, 
            examen: '50/60'
        }
        console.log($scope.viewData);
    }

})

;
