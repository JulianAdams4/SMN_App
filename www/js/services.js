angular.module('starter.services', [])

/*/////////////////////////////////////////
    Servicio que muestra notificaciones
//////////////////////////////////////// */
.service('NotifyService', function ( $ionicLoading, $rootScope, $window ){
    return {
        notify: function (text, duration) {
            $ionicLoading.show({
                template: text, animation: 'fade-in',
                showBackdrop: false, maxWidth: 500,
                showDelay: 0
            });
            $window.setTimeout(function () {
                $ionicLoading.hide();
            }, duration);
        }
    }
})


/*///////////////////////////////////
    Servicio que consume el API 
    y que controla el login
////////////////////////////////// */
.service('LoginService', function( $ionicHistory, $ionicLoading, $rootScope, 
                                   $http, $window, API ){

    return {
        setToken:  function (tokens) {
          for (var key in tokens){
            $window.localStorage.setItem(key , encodeURIComponent(tokens[key]) );
          }
        },


        getToken: function (value) {
          return $window.localStorage.getItem(String(value));    
        },


        isSessionActive: function () {
          var a = $window.localStorage.rol;
          var b = $window.localStorage.rol!=""; 
          return (a && b) ? true : false;
        },


        loginUser: function( user, clave) {
            var myobject = { cedula: user, password: clave };
            // Cast function
            Object.toparams = function ObjecttoParams(obj) {
                var p = [];
                    for (var key in obj){
                        p.push(key + '=' + encodeURIComponent(obj[key]));
                    }
                return p.join('&');
            };
            // Data for requeriment
            var req = {
                method: 'POST',
                url: API.url + '/pacienteLogin',
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'private'
                }
            }
            // Return promise
            return $http(req)
            .success(function(data, status, headers, config){})
            .error(function(data, status, headers, config){});
        }, 

        logOut: function (hide) {
            $window.localStorage.clear();
            $window.sessionStorage.clear();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            // No back
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });
            // Hide animation
            if (hide && hide>0) { 
                $window.setTimeout(function () {
                    $ionicLoading.hide();  // Off animation
                    $window.location.href = '#/app/login';  // To login
                }, hide);
            }
            else {
                $window.location.href = '#/app/login';  // To login
            }
        }
        
    }
})


.service('PacienteService', function ( $rootScope, $window, API, $http ){
    // Cast function
    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj){
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };

    return {
        getDatos: function () {
            var myobject = {};
            // Data for requeriment
            var req = {
                method: 'GET',
                url: API.url + '/pacientes/perfil',
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'private'
                }
            }
            // Return promise
            return $http(req)
            .success(function(data, status, headers, config){})
            .error(function(data, status, headers, config){});
        },

        editarPaciente: function (datosPaciente) {
            var info = { paciente: datosPaciente }
            // Data for requeriment
            var req = {
                method: 'PUT',
                url: API.url + '/pacientes/perfil',
                data: info,
                headers: {
                    'Cache-Control': 'private'
                }
            }
            // Return promise
            return $http(req)
            .success(function(data, status, headers, config){})
            .error(function(data, status, headers, config){});
        }
    }
})

/*//////////////////////////////////////////
    Servicio que consume el API 
    para obtener informacion del centro
///////////////////////////////////////// */
.service('CentroService', function($q, $rootScope, $http, $window, API) {
    return {
        allCentros: function() {
            var myobject = {};
            Object.toparams = function ObjecttoParams(obj) {
                var p = [];
                    for (var key in obj){
                        p.push(key + '=' + encodeURIComponent(obj[key]));
                    }
                return p.join('&');
            };
            var req =  {
                method: 'GET',
                url: API.url + '/centro',
                data: myobject,
                headers: {'Cache-Control': 'public, last-modified'}
            }
            return $http(req)
            .success(function(data, status, headers, config){})
            .error(function(data, status, headers, config){});
        }, // end allCentros

        getById: function(idCentro) {
            var myobject = {};
            var req =  {
                method: 'GET',
                url: API.url + '/centro/'+idCentro,
                data: myobject,
                headers: {'Cache-Control': 'public, last-modified'}
            }

            return $http(req)
            .success(function(data, status, headers, config){})
            .error(function(data, status, headers, config){});
        }  // end getById

    }
})


/*//////////////////////////////////////////
    Servicio que consume el API 
    para obtener informacion de 
    los examenes de un paciente
///////////////////////////////////////// */
.service('ExamenesPacienteService', function($q, $http, $window, API){
    return {
        allExamenes: function (idPaciente) {
            return $http.get(API.url + '/muestrasByPaciente/'+String(idPaciente), {cache: false})
            .success(function (data) {
                // Success
            })
            .error(function (data) {
                console.log("Error en ExamenesPacienteService");
            })
        },

        examenByIdMuestra: function (idM) {
            return $http.get(API.url + '/muestras/'+String(idM), {cache: false})
            .success(function (data) {
                // Success
            })
            .error(function (data) {
                console.log("Error en ExamenesPacienteService");
            })
        }
    }
})


/*////////////////////////////////////////////////
    Factory que controla el estado
    de la conexion a internet persistentemente
////////////////////////////////////////////// */
.factory('ConnectivityMonitor', function( $rootScope, $cordovaNetwork, $ionicLoading, $window ){
    return {
        // Verifica si posee conexion
        isOnline: function(){
            if(ionic.Platform.isWebView()){
                return $cordovaNetwork.isOnline();    
            } 
            else {
                return navigator.onLine;
            }
        },

        // Verifica si no posee conexion
        isOffline: function(){
            if(ionic.Platform.isWebView()){
                return !$cordovaNetwork.isOnline();    
            } 
            else {
                return !navigator.onLine;
            }
        },

        // Monitorea la conexion a internet
        startWatching: function(){
            if(ionic.Platform.isWebView()){
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                    $ionicLoading.show({
                        template: "<h4>Conectado a internet</h4>", 
                        animation: 'fade-in', showBackdrop: false, 
                        maxWidth: 500, showDelay: 0
                    });
                    $window.setTimeout(function () {
                        $ionicLoading.hide();
                    }, 3000);
                });
     
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    $ionicLoading.show({
                        template: "<h4>No estás conectado a internet</h4>", 
                        animation: 'fade-in', showBackdrop: false, 
                        maxWidth: 500, showDelay: 0
                    });
                    $window.setTimeout(function () {
                        $ionicLoading.hide();
                    }, 3000);
                });
            }
            else {
                window.addEventListener("online", function(e) {
                    $ionicLoading.show({
                        template: "<h4>Conectado a internet</h4>", 
                        animation: 'fade-in', showBackdrop: false, 
                        maxWidth: 500, showDelay: 0
                    });
                    $window.setTimeout(function () {
                        $ionicLoading.hide();
                    }, 3000);
                }, false);    
                window.addEventListener("offline", function(e) {
                    $ionicLoading.show({
                        template: "<h4>No estás conectado a internet</h4>", 
                        animation: 'fade-in', showBackdrop: false, 
                        maxWidth: 500, showDelay: 0
                    });
                    $window.setTimeout(function () {
                        $ionicLoading.hide();
                    }, 3000);
                }, false);  
            }       
        }

    } // end return
})


/*///////////////////////////
    Servicio para archivos
///////////////////////////*/
/*
.service('FileService', function($http, $window, API, $cordovaInAppBrowser){
    return {
        descargar: function (filePath, options) {
            var type = "";
            if (device.platform === "iOS"){ 
                type = "_blank"; 
            }
            else if (device.platform === "Android") { 
                type = "_system"; 
            }
            else { 
                type = "_system"; 
            }
            $cordovaInAppBrowser.open(filePath, type, options)
            .then(function (event) {
                //alert("Success");
            })
            .catch(function (event) {
                //alert("Error");
            });
        }
    } // end return
})
*/
;