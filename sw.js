//imports
importScripts('js/sw-utils.js')


//personalizar mis nombres de caches, tantos como dese
const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//info que es necesaria para que funcione la app
// a almacenar en el static, 
//que yo puedo modificar
const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//librerias que yo no hice y no se van a modificar
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];



//instalacion del sw
self.addEventListener('install', e => {

    //almacenar en el cache el APP_SHELL y APP_SHELL_INMUTABLE
    const cacheStatic = caches.open(STATIC_CACHE) //abrir el cache static
    .then( cache => {
        cache.addAll(APP_SHELL); //agregar  APP_SHELL
    });
    const cacheInmutable = caches.open(INMUTABLE_CACHE) //abrir el cache inmutable
    .then( cache => {
        cache.addAll(APP_SHELL_INMUTABLE); //agregar  APP_SHELL_INMUTABLE
    });

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );
});


//cuando se active el sw
self.addEventListener('activate', e => {

    //borrar caches viejos cuando cambie el sw
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil( respuesta );

});


//Estrategias de cache
self.addEventListener('fetch', e =>{

    const respuesta = caches.match( e.request ).then( res => {
        if (res) {
            return res;
        }else {
            //no se encontro en cache, hay que hacer un fetch a la web
            return fetch( e.request ).then( newRes => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes);
            });
            
        }
    })

    e.respondWith( respuesta );

});