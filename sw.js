/* Genesolia — application installable.
   Toujours le réseau en premier : le site reste à jour à chaque visite.
   Sans connexion, on ressert la dernière version vue de la page, ou la page « hors ligne ». */
var CACHE = 'genesolia-v1';
var BASE = ['/', '/offline.html', '/assets/site.css', '/assets/site.js', '/apple-touch-icon.png', '/assets/icones/icone-192.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, url = new URL(r.url);
  if (r.method !== 'GET' || url.origin !== location.origin) return; /* Supabase, paiements, formulaires : jamais touchés */
  e.respondWith(fetch(r).then(function (rep) {
    if (rep && rep.ok && rep.type === 'basic') { var copie = rep.clone(); caches.open(CACHE).then(function (c) { c.put(r, copie); }); }
    return rep;
  }).catch(function () {
    return caches.match(r).then(function (m) {
      return m || (r.mode === 'navigate' ? caches.match('/offline.html') : Response.error());
    });
  }));
});
