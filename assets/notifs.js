/* Genesolia · les rappels de l'appli Le Cercle (notifications sur le téléphone ou l'ordinateur).
   GenesoliaNotifs.etat() : 'non-supporte' | 'installer' (iPhone : ajouter d'abord l'appli à l'écran d'accueil) | 'bloque' | 'actif' | 'inactif'
   GenesoliaNotifs.activer(sb, user) / couper(sb) : Promise<boolean>.
   L'abonnement est gardé dans Supabase (table notifs_abonnements, liée au compte) ; les textes sont dans notifs_programme.
   L'envoi : la fonction Supabase « notifs-cercle », chaque matin. */
(function () {
  'use strict';
  var FONCTION = 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/notifs-cercle';
  function ios() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function installee() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function supporte() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
  function cleBytes(b64) {
    var p = '='.repeat((4 - b64.length % 4) % 4), s = atob((b64 + p).replace(/-/g, '+').replace(/_/g, '/')), a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }
  function inscription() {
    if (!supporte()) return Promise.resolve(null);
    return navigator.serviceWorker.getRegistration('/').then(function (r) { return r ? r.pushManager.getSubscription() : null; }).catch(function () { return null; });
  }
  function etat() {
    if (ios() && !installee()) return Promise.resolve('installer');
    if (!supporte()) return Promise.resolve('non-supporte');
    if (Notification.permission === 'denied') return Promise.resolve('bloque');
    return inscription().then(function (s) { return s && Notification.permission === 'granted' ? 'actif' : 'inactif'; });
  }
  function enregistrer(sb, user, s) {
    var j = s.toJSON();
    return sb.from('notifs_abonnements').upsert({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, user_id: user.id }, { onConflict: 'endpoint' })
      .then(function (r) { return !r.error; });
  }
  function activer(sb, user) {
    if (!supporte() || !sb || !user) return Promise.resolve(false);
    return Notification.requestPermission().then(function (p) {
      if (p !== 'granted') return false;
      return Promise.all([
        navigator.serviceWorker.register('/sw.js').then(function () { return navigator.serviceWorker.ready; }),
        fetch(FONCTION).then(function (r) { return r.json(); })
      ]).then(function (x) {
        var reg = x[0], cle = x[1] && x[1].cle; if (!cle) return false;
        return reg.pushManager.getSubscription().then(function (s) {
          return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cleBytes(cle) });
        }).then(function (s) { return enregistrer(sb, user, s); });
      });
    }).catch(function () { return false; });
  }
  function couper(sb) {
    return inscription().then(function (s) {
      if (!s) return true;
      var ep = s.endpoint;
      return s.unsubscribe().then(function () { return sb ? sb.from('notifs_abonnements').delete().eq('endpoint', ep) : null; }).then(function () { return true; });
    }).catch(function () { return false; });
  }
  /* Si l'abonnement existe sur l'appareil, on le réenregistre (changement de compte, abonnement renouvelé par le navigateur) */
  function rafraichir(sb, user) {
    if (!sb || !user || !supporte() || Notification.permission !== 'granted') return Promise.resolve();
    return inscription().then(function (s) { if (s) return enregistrer(sb, user, s); });
  }
  window.GenesoliaNotifs = { etat: etat, activer: activer, couper: couper, rafraichir: rafraichir, ios: ios, installee: installee };
})();
