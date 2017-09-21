/*==========================================================
  angular.module is a global place for creating, 
  registering and retrieving Angular modules
  
  'starter' is the name of this angular module example 
  (also set in a <body> attribute in index.html)
  
  The 2nd parameter is an array of 'requires'
  'starter.controllers' is found in controllers.js
------------------------------------------------------------*/

function checkSession($window, $ionicLoading, $location) {
    var a = $window.localStorage.rol;
    var b = ( $window.localStorage.rol !="" ? true : false ); 
    if (a && b) {
        /*===================
            Already Logged
        ---------------------*/
        // Animation
        $ionicLoading.show({
          template: '<ion-spinner icon="circles"></ion-spinner><br><h4>Cargando</h4>', 
          animation: 'fade-in', showBackdrop: false, 
          maxWidth: 500, showDelay: 0
        });
        // Get user role from storage
        var role = $window.localStorage.getItem(String("rol"));
        // Hide animation
        $window.setTimeout(function () {
            $ionicLoading.hide();
            if ( role === 'paciente' ) {
                //  Logged as 'paciente' -> Profile
                $location.path('/paciente/profile');
            } 
            else {
                //  Unathorized session -> Login
                $location.path('/app/login');
            }
        }, 1500);
    }
    else {
        /*=============== 
            Not logged
        -----------------*/
        $location.path('/app/login');
    }
}



/*==========================================================
  Registering onDeviceReady callback with deviceready event
/*---------------------------------------------------------*/
function onDeviceReady() {
    angular.bootstrap(document, ["starter"]);
}

document.addEventListener("deviceready", onDeviceReady, false);


/*//////////////////////////////////////////////////////////////////////*/


var dependencies = [
  'ionic', 
  'starter.controllers', 
  'starter.services', 
  'ionic-material'
];

angular.module('starter', dependencies)
.run(function( $ionicPlatform, $ionicHistory, $window, $ionicLoading, $location ) {
  $ionicPlatform.ready(function() {
    /*========================================================== 
      Hide the accessory bar by default 
      (remove this to show the accessory bar above the keyboard
      for form inputs)
    ------------------------------------------------------------*/
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    /*=====================================
        Verify session
    ---------------------------------------*/
    checkSession($window, $ionicLoading, $location)


    /*==============================
      To Disable Back in Entire App
    --------------------------------*/
    var backbutton = 0;
    $ionicPlatform.registerBackButtonAction(function(event){
      // Exit App
      if ( backbutton != 0 ) {
          backbutton = 0;
          navigator.app.exitApp();          
      }
      // Alert back button pressed
      else {
          event.preventDefault();

          $ionicLoading.show({
            template: "<h4>Presione de nuevo para salir</h4>", 
            animation: 'fade-in', showBackdrop: false, 
            maxWidth: 500, showDelay: 0
          });

          $window.setTimeout(function () {
            $ionicLoading.hide();
            backbutton = backbutton + 1;
          },1500);
      }
    },100);


  });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  /*====================================
    Titulo de las vistas en el centro
  --------------------------------------*/
  $ionicConfigProvider.navBar.alignTitle('center');


  /*============================================ 
    Turn off caching for demo simplicity's sake
  ----------------------------------------------*/
  $ionicConfigProvider.views.maxCache(0);

  /*
  // Turn off back button text
  $ionicConfigProvider.backButton.previousTitleText(false);
  */

  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/login/initLogin.html',
    controller: 'InitLoginCtrl'
  })
  
  /*==================
      Login 
  --------------------*/
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })
  
  
  /*===============================================
          Estados y vistas para pacientes
  -------------------------------------------------*/

  /*==================
      Menú lateral
  --------------------*/
  .state('paciente', {
    url: '/paciente',
    abstract: true,
    templateUrl: 'templates/paciente/menuChild.html',
    controller: 'AppCtrl'
  })

   
  /*====================
      Página principal
  ----------------------*/
  .state('paciente.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/profileChild.html',
        controller: 'ProfileCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })


  /*================================
      Formulario datos del perfil 
  ----------------------------------*/
  .state('paciente.editProfile', {
    url: '/editarPerfil',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/formPerfil.html',
        controller: 'EditProfileCtrl'
      },
      'fabContent': {
        template: '<button id="fabSubProf" class="button button-fab button-fab-bottom-right theme-color-app" ng-click="submitProfile()"><i class="icon ion-checkmark"></i></button>',
        controller: 'EditProfileCtrl'
      }
    }
  })

    
  /*============================
      Centros médicos 
  ------------------------------*/
  .state('paciente.centros', {
    url: '/centros',
    views: {
     'menuContent': {
        templateUrl: 'templates/paciente/centro.html',
        controller: 'CentrosCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })
  
  
  /*==============================
      Datos de control 
  --------------------------------*/
  .state('paciente.control', {
    url: '/control',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/datosControl.html',
        controller: 'ControlCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })

  
  /*==============================
      Plan nutricional 
  --------------------------------*/
  .state('paciente.plan', {
    url: '/plan',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/plan.html',
        controller: 'PlanCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })

  
  /*==============================
      Citas 
  --------------------------------*/
  .state('paciente.citas', {
    url: '/citas',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/citas.html',
        controller: 'CitasCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })

  
  /*=============================
      Estadisticas 
  -------------------------------*/
  .state('paciente.logros', {
    url: '/logros',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/logros.html',
        controller: 'LogrosCtrl'
      },
      'fabContent': { templateUrl: '', controller: '' }
    }
  })
  ;


  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/login');
  
});