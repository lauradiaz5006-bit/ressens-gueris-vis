/* Genesolia · les rappels (notifications sur le téléphone ou l'ordinateur), deux canaux :
   - 'cercle' : les rappels de l'appli Le Cercle (nouveau carnet, semaines, météo de fin de mois, lunes) ;
   - 'site'   : le ciel du mois, Mercure rétrograde, les nouveaux articles et les nouveaux tests.
   Un appareil = un seul abonnement, avec ses canaux. Tout passe par la fonction Supabase « notifs-cercle »
   (les visiteurs sans compte peuvent s'abonner au canal site). Au plus un rappel par jour et par appareil.
   GenesoliaNotifs.etat(canal) : 'non-supporte' | 'installer' (iPhone : ajouter d'abord l'appli à l'écran d'accueil) | 'bloque' | 'actif' | 'inactif'
   GenesoliaNotifs.activer(canal, sb) / couper(canal) : Promise<boolean>. */
(function () {
  'use strict';
  var FONCTION = 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/notifs-cercle';
  var CLE_CANAUX = 'genesolia-rappels-canaux';
  function ios() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function installee() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function supporte() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
  function canaux() { try { return JSON.parse(localStorage.getItem(CLE_CANAUX) || '[]') || []; } catch (e) { return []; } }
  function garder(l) { try { localStorage.setItem(CLE_CANAUX, JSON.stringify(l)); } catch (e) {} }
  function cleBytes(b64) {
    var p = '='.repeat((4 - b64.length % 4) % 4), s = atob((b64 + p).replace(/-/g, '+').replace(/_/g, '/')), a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }
  function inscription() {
    if (!supporte()) return Promise.resolve(null);
    return navigator.serviceWorker.getRegistration('/').then(function (r) { return r ? r.pushManager.getSubscription() : null; }).catch(function () { return null; });
  }
  function appel(corps) {
    return fetch(FONCTION, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  /* Le jeton du compte (s'il y en a un) : la fonction relie l'abonnement au compte, sans autre donnée */
  function jeton(sb) {
    if (!sb || !sb.auth) return Promise.resolve(null);
    return sb.auth.getSession().then(function (r) { return r && r.data && r.data.session ? r.data.session.access_token : null; }).catch(function () { return null; });
  }
  function etat(canal) {
    if (ios() && !installee()) return Promise.resolve('installer');
    if (!supporte()) return Promise.resolve('non-supporte');
    if (Notification.permission === 'denied') return Promise.resolve('bloque');
    return inscription().then(function (s) { return s && Notification.permission === 'granted' && canaux().indexOf(canal) >= 0 ? 'actif' : 'inactif'; });
  }
  function activer(canal, sb) {
    if (!supporte()) return Promise.resolve(false);
    return Notification.requestPermission().then(function (p) {
      if (p !== 'granted') return false;
      return Promise.all([
        navigator.serviceWorker.register('/sw.js').then(function () { return navigator.serviceWorker.ready; }),
        fetch(FONCTION).then(function (r) { return r.json(); }),
        jeton(sb)
      ]).then(function (x) {
        var reg = x[0], cle = x[1] && x[1].cle, jt = x[2]; if (!cle) return false;
        return reg.pushManager.getSubscription().then(function (s) {
          return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cleBytes(cle) });
        }).then(function (s) {
          return appel({ action: 'abonner', canal: canal, abonnement: s.toJSON(), jeton: jt });
        }).then(function (r) {
          if (!r || !r.canaux) return false;
          garder(r.canaux); return true;
        });
      });
    }).catch(function () { return false; });
  }
  function couper(canal) {
    return inscription().then(function (s) {
      var reste = canaux().filter(function (c) { return c !== canal; });
      if (!s) { garder(reste); return true; }
      return appel({ action: 'retirer', canal: canal, endpoint: s.endpoint }).then(function (r) {
        reste = r && r.canaux ? r.canaux : reste; garder(reste);
        return reste.length ? true : s.unsubscribe().then(function () { return true; });
      });
    }).catch(function () { return false; });
  }
  /* L'abonnement existe sur l'appareil : on le réenregistre (compte connecté depuis, abonnement renouvelé par le navigateur) */
  function rafraichir(sb) {
    if (!supporte() || Notification.permission !== 'granted' || !canaux().length) return Promise.resolve();
    return Promise.all([inscription(), jeton(sb)]).then(function (x) {
      var s = x[0]; if (!s) return;
      return appel({ action: 'abonner', canaux: canaux(), abonnement: s.toJSON(), jeton: x[1] }).then(function (r) { if (r && r.canaux) garder(r.canaux); });
    });
  }
  /* L'encart « Recevoir les nouveautés » du site (appli du site, blog) : z = élément vide, o = { titre, texte, sb, plusTard (clé : proposé une seule fois) } */
  var STYLE = '.gn-encart{margin:1.2rem 0;padding:1.1rem 1.2rem;border-radius:18px;background:#fff;border:1px solid #EBCFD5}.gn-encart .gn-t{font:400 1.15rem/1.3 "Gilda Display",Georgia,serif;color:#6B2F5B;margin:0 0 .35rem}' +
    '.gn-encart p{margin:0 0 .6rem}.gn-encart .gn-etat{font-weight:600;color:#6B2F5B}.gn-encart .gn-note{font-size:.88rem;color:#8E6383}.gn-act{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.4rem}' +
    '.gn-act button{font:600 .92rem/1 inherit;font-family:inherit;min-height:44px;padding:.55rem 1.1rem;border-radius:999px;border:0;cursor:pointer;background:#6B2F5B;color:#fff}.gn-act button.gn-clair{background:#FBF0E4;color:#6B2F5B}.gn-retour{color:#9B2C2C;font-size:.9rem}.gn-retour:empty{display:none}';
  function encart(z, o) {
    if (!z) return;
    o = o || {};
    if (!document.getElementById('gn-style')) { var st = document.createElement('style'); st.id = 'gn-style'; st.textContent = STYLE; document.head.appendChild(st); }
    var vu = null; try { vu = o.plusTard ? localStorage.getItem(o.plusTard) : null; } catch (e) {}
    etat('site').then(function (e) {
      if (o.plusTard && (vu || e !== 'inactif') && e !== 'actif') { z.innerHTML = ''; return; }
      if (o.plusTard && e === 'actif') { z.innerHTML = ''; return; }
      var h = '<div class="gn-encart"><p class="gn-t">' + o.titre + '</p><p>' + o.texte + '</p>';
      if (e === 'installer') h += '<p class="gn-note">Sur iPhone, ajoute d’abord Genesolia à ton écran d’accueil (bouton Partager, puis « Sur l’écran d’accueil »), puis ouvre-la depuis son icône.</p>';
      else if (e === 'non-supporte') h += '<p class="gn-note">Ce navigateur ne permet pas les notifications.</p>';
      else if (e === 'bloque') h += '<p class="gn-note">Les notifications sont bloquées pour Genesolia sur cet appareil : autorise-les dans les réglages de ton téléphone ou de ton navigateur.</p>';
      else if (e === 'actif') h += '<p class="gn-etat">C’est activé sur cet appareil.</p><div class="gn-act"><button type="button" class="gn-clair" data-gn-couper>Ne plus recevoir</button></div>';
      else h += '<div class="gn-act"><button type="button" data-gn-activer>Recevoir les nouveautés</button>' + (o.plusTard ? '<button type="button" class="gn-clair" data-gn-tard>Plus tard</button>' : '') + '</div>';
      z.innerHTML = h + '<p class="gn-retour" role="status"></p></div>';
      var ret = z.querySelector('.gn-retour'), a = z.querySelector('[data-gn-activer]'), c = z.querySelector('[data-gn-couper]'), t = z.querySelector('[data-gn-tard]');
      if (a) a.addEventListener('click', function () {
        a.disabled = true;
        activer('site', o.sb).then(function (ok) {
          if (ok) { if (window.umami) try { window.umami.track('rappels-site'); } catch (x) {} if (o.plusTard) { z.querySelector('.gn-encart').innerHTML = '<p class="gn-etat">C’est activé\u00a0: tu seras prévenu·e des nouveautés, une fois par jour au plus.</p>'; try { localStorage.setItem(o.plusTard, '1'); } catch (x) {} } else encart(z, o); }
          else { a.disabled = false; ret.textContent = Notification.permission === 'denied' ? 'Les notifications ont été refusées sur cet appareil.' : 'L’activation n’a pas fonctionné. Réessaie dans un instant.'; }
        });
      });
      if (c) c.addEventListener('click', function () { c.disabled = true; couper('site').then(function () { encart(z, o); }); });
      if (t) t.addEventListener('click', function () { try { localStorage.setItem(o.plusTard, '1'); } catch (x) {} z.innerHTML = ''; });
    });
  }
  window.GenesoliaNotifs = { etat: etat, activer: activer, couper: couper, rafraichir: rafraichir, encart: encart, ios: ios, installee: installee };
})();
