// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
    .state('child', {
        url: '/child',
        abstract: true,
        templateUrl: 'templates/child/menuChild.html',
        controller: 'AppCtrl'
    })

    .state('child.tareas', {
        url: '/tareas',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/tareasChild.html',
                controller: 'TareasCtrl'
            },
            'fabContent': ''
        }
    })

    .state('child.detalleTarea', {
        url: '/tareas/:idTarea',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/detalleTareaChild.html',
                controller: 'DetalleTareaCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900" ng-click="marcarTarea()"><i class="icon ion-checkmark"></i></button>',
                controller: 'DetalleTareaCtrl'
            }
        }
    })

    .state('child.horario', {
        url: '/horario',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/horario.html',
                controller: 'CalendarioCtrl'
            },
            'fabContent': ''
        }
    })

    .state('child.calendario', {
        url: '/calendario',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/calendario.html',
                controller: 'HorarioCtrl'
            },
            'fabContent': ''
        }
    })

    .state('child.calificaciones', {
        url: '/calificaciones',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/calificaciones.html',
                controller: 'CalificacionesCtrl'
            },
            'fabContent': ''
        }
    })

    .state('child.detalleCalificacion', {
        url: '/calificaciones/:idCalif',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/detalleCalificacion.html',
                controller: 'DetalleCalificacionCtrl'
            },
            'fabContent': ''
        }
    })

    .state('child.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/child/profileChild.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': ''
        }
    })

    /* ********************************************* */
    /*/////////////////////////////////////////////////
        Estados y vistas para profesores
    /////////////////////////////////////////////////*/
    /* Menu para profesores */
    .state('teacher', {
        url: '/teacher',
        abstract: true,
        templateUrl: 'templates/teacher/menuTeacher.html',
        controller: 'AppCtrl'
    })

    .state('teacher.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'EventosCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('teacher.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'TareasCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('teacher.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'CalendarioCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    /* Vista de Tareas para profesores */
    .state('teacher.tareas', {
        url: '/tareas',
        views: {
            'menuContent': {
                templateUrl: 'templates/teacher/tareasTeacher.html',
                controller: 'TareasCtrl'
            },
            'fabContent': ''
        }
    })

    /* Vista de Detalles de tareas para profesores */
    .state('teacher.detalleTarea', {
        url: '/tareas/:idTarea',
        views: {
            'menuContent': {
                templateUrl: 'templates/teacher/detalleTareaTeacher.html',
                controller: 'DetalleTareaCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900" ng-click="marcarTarea()"><i class="icon ion-checkmark"></i></button>',
                controller: 'DetalleTareaCtrl'
            }
        }
    })

    /* Vista de perfil para profesores */
    .state('teacher.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/teacher/profileTeacher.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': ''
        }
    })

    /* ********************************************* */
    /*/////////////////////////////////////////////////
        Estados y vistas para padres
    /////////////////////////////////////////////////*/
    .state('parent', {
        url: '/parent',
        abstract: true,
        templateUrl: 'templates/parent/menuParent.html',
        controller: 'AppCtrl'
    })

    /* Eventos para padres */
    .state('parent.eventos', {
        url: '/eventos',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/eventosParent.html',
                controller: 'EventosCtrl'
            },
            'fabContent': ''
        }
    })

    /* Alertas para padres */
    .state('parent.alertas', {
        url: '/alertas',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/alertasParent.html',
                controller: 'AlertasCtrl'
            },
            'fabContent': ''
        }
    })

    /* Vista de Tareas para profesores */
    .state('parent.tareas', {
        url: '/tareas',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/tareasParent.html',
                controller: 'TareasCtrl'
            },
            'fabContent': ''
        }
    })

    /* Vista de Detalles de tareas para profesores */
    .state('parent.detalleTarea', {
        url: '/tareas/:idTarea',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/detalleTareaParent.html',
                controller: 'DetalleTareaCtrl'
            },
            'fabContent': ''
        }
    })

    /* Calendario de eventos para padres */
    .state('parent.calendario', {
        url: '/calendario',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/calendario.html',
                controller: 'HorarioCtrl'
            },
            'fabContent': ''
        }
    })

    .state('parent.calificaciones', {
        url: '/calificaciones',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/calificaciones.html',
                controller: 'CalificacionesCtrl'
            },
            'fabContent': ''
        }
    })

    .state('parent.detalleCalificacion', {
        url: '/calificaciones/:idCalif',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/detalleCalificacion.html',
                controller: 'DetalleCalificacionCtrl'
            },
            'fabContent': ''
        }
    })

    /* Vista de perfil para padres */
    .state('parent.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/parent/profileParent.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': ''
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
