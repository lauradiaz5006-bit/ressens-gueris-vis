/* Genesolia — application installable.
   Toujours le réseau en premier : le site reste à jour à chaque visite.
   Sans connexion, on ressert la dernière version vue de la page, ou la page « hors ligne ». */
var CACHE = 'genesolia-v4';
var BASE = ['/', '/appli.html', '/offline.html', '/assets/site.css', '/assets/site.js', '/apple-touch-icon.png', '/assets/icones/icone-192.png'];

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

/* Les rappels du Cercle (fonction Supabase « notifs-cercle ») : { titre, texte, url, tag } */
self.addEventListener('push', function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { texte: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titre || 'Le Cercle', {
    body: d.texte || '', icon: '/assets/icones/cercle-192.png', badge: '/assets/icones/cercle-192.png',
    tag: d.tag || 'cercle', data: { url: d.url || '/cercle.html' }, lang: 'fr'
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var cible = new URL((e.notification.data && e.notification.data.url) || '/cercle.html', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (l) {
    for (var i = 0; i < l.length; i++) { if (l[i].url === cible && 'focus' in l[i]) return l[i].focus(); }
    return self.clients.openWindow(cible);
  }));
});
