const CACHE_STATIC_NAME = 'cacheStatic'
const CACHE_DYNAMIC_NAME = 'cacheDynamic'
const CACHE_INMUTABLE_NAME = 'cacheInmutable'

function cleanCache(cacheName, sizeItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys().then(keys => {
                if (keys.length >= sizeItems) {
                    cache.delete(keys[0]).then(() => {
                        cleanCache(cacheName, sizeItems)
                    })
                }
            })
        })
}

self.addEventListener('install', (event) => {
    console.log("Se instalo el SW")
    const promesaCache = caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll([
            '/ZAF-U2-T1/',
            '/ZAF-U2-T1/index.html',
            '/ZAF-U2-T1/js/app.js',
            '/ZAF-U2-T1/manifest.json'
        ])
    })

    const promInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cacheInmu => {
        return cacheInmu.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js'
        ])
    })

    event.waitUntil(Promise.all([promesaCache, promInmutable]))
});

self.addEventListener('activate', (event) => {
    console.log("El SW se ha activado!");
});

self.addEventListener('fetch', (event) => {
    const respuesta = caches.match(event.request)
        .then(resp => {
            if (resp) {
                return resp;
            }
            console.log("Caché no encontradooo!", event.request.url)
            return fetch(event.request)
                .then(respNet => {
                    caches.open(CACHE_DYNAMIC_NAME)
                        .then((cache) => {
                            cache.put(event.request, respNet).then(() => {
                                cleanCache(CACHE_DYNAMIC_NAME, 10)
                            })
                        })
                    return respNet.clone();
                });
        })
    event.respondWith(respuesta)
});