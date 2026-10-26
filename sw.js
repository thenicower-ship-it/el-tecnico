// Guarda el juego en el telefono para abrirlo sin señal. La pagina se busca primero en internet
// (asi llegan las versiones nuevas) y si no hay señal en 3 segundos se usa la copia guardada.
var C="et-a09581df1e",FILES=["./","index.html","manifest.json","icon-180-v2.png","icon-192-v2.png","icon-512-v2.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  if(r.mode==="navigate"){
    e.respondWith(new Promise(function(ok){
      var done=false,t=setTimeout(function(){caches.match("index.html").then(function(c){if(c&&!done){done=true;ok(c)}})},3000);
      fetch(r).then(function(n){if(n.ok){var cp=n.clone();caches.open(C).then(function(c){c.put("index.html",cp)})}if(!done){done=true;clearTimeout(t);ok(n)}})
      .catch(function(){caches.match("index.html").then(function(c){if(!done){done=true;clearTimeout(t);ok(c||Response.error())}})});
    }));return;
  }
  e.respondWith(caches.match(r).then(function(c){
    var n=fetch(r).then(function(x){if(x&&(x.ok||x.type==="opaque")){var cp=x.clone();caches.open(C).then(function(cc){cc.put(r,cp)})}return x}).catch(function(){return c});
    return c||n;
  }));
});
