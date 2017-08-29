// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var dependencies = ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'pdf'];

angular.module('starter', dependencies)
.run(function( $ionicPlatform, $ionicHistory ) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // To Conditionally Disable Back
    $ionicPlatform.registerBackButtonAction(function(){
      if( $ionicHistory.currentStateName === 'app.login' ){
        event.preventDefault();
      }
      else if ( $ionicHistory.currentStateName === 'paciente.profile' ) {
        event.preventDefault();
      }
      else{
        $ionicHistory.goBack();
      }
    },100);

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // Titulo de las vistas en el centro
  $ionicConfigProvider.navBar.alignTitle('center');

  // Turn off caching for demo simplicity's sake
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
  
  /*////////////////////
      Login 
      ConnectivityMonitor.startWatching();
  ////////////////////*/
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
  
  
  /*/////////////////////////////////////////////////
          Estados y vistas para pacientes
  /////////////////////////////////////////////////*/


  /*////////////////////
      Menú lateral
  ////////////////////*/
  .state('paciente', {
    url: '/paciente',
    abstract: true,
    templateUrl: 'templates/paciente/menuChild.html',
    controller: 'AppCtrl'
  })

   
  /*//////////////////////
      Página principal
  //////////////////////*/
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


  /*//////////////////////////////////
      Formulario datos del perfil 
  //////////////////////////////////*/
  .state('paciente.editProfile', {
    url: '/editarPerfil',
    views: {
      'menuContent': {
        templateUrl: 'templates/paciente/formPerfil.html',
        controller: 'ProfileCtrl'
      },
      'fabContent': {
        template: '<button id="fabSubProf" class="button button-fab button-fab-bottom-right theme-color-app" ng-click="submitProfile()"><i class="icon ion-checkmark"></i></button>',
        controller: 'ProfileCtrl'
      }
    }
  })

    
  /*//////////////////////////////////
      Centros médicos 
  //////////////////////////////////*/
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
  
  
  /*//////////////////////////////////
      Datos de control 
  //////////////////////////////////*/
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

  
  /*//////////////////////////////////
      Plan nutricional 
  //////////////////////////////////*/
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

  
  /*//////////////////////////////////
      Citas 
  //////////////////////////////////*/
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

  
  /*//////////////////////////////////
      Estadisticas 
  //////////////////////////////////*/
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
  $urlRouterProvider.otherwise('/app/login');
  
});