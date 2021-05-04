//guardar en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {

    if (res.ok) { //hay data en la respuesta de red
        //almacenarla la request en el cache
        return caches.open( dynamicCache ).then( cache => {
            cache.put(req, res.clone());
            return res.clone();
        });
    } else {// no hay respuesta desde la web
        //retornar lo que venga, errores, etc
        return res;
    }
}