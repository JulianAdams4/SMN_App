// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'ionMdInput'])

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
            StatusBar.styleDefault();
        }
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

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    /* ********************************************* */
    /*/////////////////////////////////////////////////
        Estados y vistas para niños
    /////////////////////////////////////////////////*/
    .state('paciente', {
        url: '/paciente',
        abstract: true,
        templateUrl: 'templates/paciente/menuChild.html',
        controller: 'AppCtrl'
    })

    .state('paciente.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/profileChild.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': ''
        }
    })

    .state('paciente.tareas', {
        url: '/tareas',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/tareasChild.html',
                controller: 'TareasCtrl'
            },
            'fabContent': ''
        }
    })

    .state('paciente.detalleTarea', {
        url: '/tareas/:idTarea',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/detalleTareaChild.html',
                controller: 'DetalleTareaCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900" ng-click="marcarTarea()"><i class="icon ion-checkmark"></i></button>',
                controller: 'DetalleTareaCtrl'
            }
        }
    })

    .state('paciente.horario', {
        url: '/horario',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/horario.html',
                controller: 'CalendarioCtrl'
            },
            'fabContent': ''
        }
    })

    .state('paciente.calendario', {
        url: '/calendario',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/calendario.html',
                controller: 'HorarioCtrl'
            },
            'fabContent': ''
        }
    })

    .state('paciente.calificaciones', {
        url: '/calificaciones',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/calificaciones.html',
                controller: 'CalificacionesCtrl'
            },
            'fabContent': ''
        }
    })

    .state('paciente.detalleCalificacion', {
        url: '/calificaciones/:idCalif',
        views: {
            'menuContent': {
                templateUrl: 'templates/paciente/detalleCalificacion.html',
                controller: 'DetalleCalificacionCtrl'
            },
            'fabContent': ''
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
