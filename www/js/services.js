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




/*///////////////////////////////////////////
    Servicio que maneja el almacenamiento
///////////////////////////////////////////*/
.service('StorageService', function ( $rootScope, $window ){

    function compareObjects(o, p) {
        var i,
            keysO = Object.keys(o).sort(),
            keysP = Object.keys(p).sort();
        if (keysO.length !== keysP.length)
            return false;//not the same nr of keys
        if (keysO.join('') !== keysP.join(''))
            return false;//different keys
        for (i=0;i<keysO.length;++i)
        {
            if (o[keysO[i]] instanceof Array)
            {
                if (!(p[keysO[i]] instanceof Array))
                    return false;
                //if (compareObjects(o[keysO[i]], p[keysO[i]] === false) return false
                //would work, too, and perhaps is a better fit, still, this is easy, too
                if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join(''))
                    return false;
            }
            else if (o[keysO[i]] instanceof Date)
            {
                if (!(p[keysO[i]] instanceof Date))
                    return false;
                if ((''+o[keysO[i]]) !== (''+p[keysO[i]]))
                    return false;
            }
            else if (o[keysO[i]] instanceof Function)
            {
                if (!(p[keysO[i]] instanceof Function))
                    return false;
                //ignore functions, or check them regardless?
            }
            else if (o[keysO[i]] instanceof Object)
            {
                if (!(p[keysO[i]] instanceof Object))
                    return false;
                if (o[keysO[i]] === o)
                {//self reference?
                    if (p[keysO[i]] !== p)
                        return false;
                }
                else if (compareObjects(o[keysO[i]], p[keysO[i]]) === false)
                    return false;//WARNING: does not deal with circular refs other than ^^
            }
            if (o[keysO[i]] !== p[keysO[i]])//change !== to != for loose comparison
                return false;//not the same value
        }
        return true;
    }
    /* --------------------------------------------------------*/
    function existe( name ) {
        return $window.localStorage[name] ? true : false;
    }
    /* --------------------------------------------------------*/
    function fueModificado( name, value ) {
        var _it      = $window.localStorage.getItem(String(name));
        var _exist   = $window.localStorage[name]
        var _notNull = (_it != null && _it != "" ) ? true : false ;
        if ( _exist && _notNull ) {
            return (_it === value ) ? false : true ; 
        }
        else {
            return true
        }        
    }
    /* --------------------------------------------------------*/
    function fueModificadoJson( nameJson, valueJson ) {
        var _it      = $window.localStorage.getItem(String(nameJson));
        var _exist   = $window.localStorage[name]
        var _notNull = (_it != null && _it != "" ) ? true : false ;
        if ( _exist && _notNull ) {
            var json_it = JSON.parse(_it);
            // Equal -> Not modified = false
            return compareObjects( json_it, valueJson )? false : true ;
        }
        else {
            return true
        }
    }
    /* --------------------------------------------------------*/
    function obtener( name ) {
        return $window.localStorage.getItem(String(name));
    }
    /* --------------------------------------------------------*/
    function guardar( key, value ) {
        $window.localStorage.setItem(key, value);
    }
    /* --------------------------------------------------------*/
    function obtenerJson( nameJson ) {
        var stringJson = $window.localStorage.getItem(String(nameJson));
        return JSON.parse(stringJson);
    }
    /*---------------------------------------------------------*/
    function guardarJson( nameJson, jsonObject ) {
        $window.localStorage.setItem(nameJson, JSON.stringify(jsonObject));
    }
    /*---------------------------------------------------------*/
    /*---------------------------------------------------------*/
    /*---------------------------------------------------------*/
    /*---------------------------------------------------------*/

    return {
        exists: function (name){ 
            return existe(name); 
        },
        isModified: function (name,value){ 
            return fueModificado(name,value); 
        },
        isModifiedJson: function (nameJson, valueJson){
            return fueModificadoJson(nameJson, valueJson);
        },
        getElement: function (name){
            return obtener(name);
        },
        saveElement: function (key, value){
            guardar(key, value);
        },
        saveElementsJson:  function (tokens) {
          for (var key in tokens){
            $window.localStorage.setItem(key , encodeURIComponent(tokens[key]) );
          }
        },
        getJson: function (nameJson){
            return obtenerJson(nameJson);
        },
        saveJson: function (nameJson, jsonObject){
            guardarJson(nameJson, jsonObject);
        }
    }

})




/*//////////////////////////////////////
    Servicio que controla el login
///////////////////////////////////// */
.service('LoginService', function( $ionicHistory, $ionicLoading, $http, $window, API ){

    function consumirLogin( user, clave ) {
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
    }
    /* ------------------------------------------------------- */
    function consumirLogout(hide) {
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
    /* ------------------------------------------------------- */
    /* ------------------------------------------------------- */
    return {
        loginUser: function( user, clave ){
            return consumirLogin(user,clave);
        }, 
        logOut: function ( hide ){
            consumirLogout(hide);
        }
    }

})




/*/////////////////////////////////////////////////
    Servicio que controla los datos de paciente
//////////////////////////////////////////////// */
.service('PacienteService', function ( $window, API, $http ){
    /* ------------------------------------------------------- */
    // Cast function
    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj){
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };
    /* ------------------------------------------------------- */
    function obtenerDatosPaciente() {
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
    }
    /* ------------------------------------------------------- */
    function actualizarPaciente(datosPaciente) {
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
        return $http(req)
        .success(function(data, status, headers, config){})
        .error(function(data, status, headers, config){});
    }
    /* ------------------------------------------------------- */
    /* ------------------------------------------------------- */
    
    return {
        getDatos: function () {
            return obtenerDatosPaciente();
        },
        editarPaciente: function (datosPaciente) {
            return actualizarPaciente(datosPaciente);
        }
    }

})




/*/////////////////////////////////////////////////////
    Servicio que controla la informacion del centro
//////////////////////////////////////////////////// */
.service('CentroService', function($q, $rootScope, $http, $window, API) {
    /* ------------------------------------------------------- */
    function obtenerInformacionCentros(){
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
    }
    /* ------------------------------------------------------- */
    function obtenerCentroPorId( idCentro ) {
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
    }
    /* ------------------------------------------------------- */
    /* ------------------------------------------------------- */
    return {
        allCentros: function() {
            return obtenerInformacionCentros();
        },
        getById: function( idCentro ){
            return obtenerCentroPorId(idCentro);
        }
    }

})




/*////////////////////////////////////////////////
    Factory que controla el estado de 
    la conexion a internet (persistentemente)
////////////////////////////////////////////// */
.factory('ConnectivityMonitor', function( $rootScope, $cordovaNetwork, $ionicLoading, 
    $window,
    $ionicModal ){

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

            // Load the modal from the given template URL
            $ionicModal.fromTemplateUrl('templates/paciente/modalDesconexion.html', function($ionicModal) {
              $rootScope.modal = $ionicModal;
            }, {
              scope: $rootScope,
              animation: 'slide-in-up'
            });

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
$rootScope.modal.show();
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
$rootScope.modal.show();
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