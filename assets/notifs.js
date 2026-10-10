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
  /* À l'ouverture de l'appli : une fenêtre en bas de l'écran propose les notifications, une seule fois par appareil.
     Le téléphone exige un toucher avant d'afficher sa propre demande : le bouton « Oui » la déclenche aussitôt.
     o = { canal, titre, texte, sb, apres(ok) } */
  var CLE_PROPOSE = 'genesolia-rappels-propose';
  var STYLE_F = '.gn-voile{position:fixed;inset:0;z-index:9998;background:rgba(43,20,40,.35);display:flex;align-items:flex-end;justify-content:center;animation:gnV .2s}' +
    '.gn-feuille{width:100%;max-width:30rem;background:#FFF9F7;border-radius:22px 22px 0 0;padding:1.4rem 1.3rem calc(1.2rem + env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(43,20,40,.18);animation:gnM .25s ease-out;font-family:inherit;color:#2b1428}' +
    '.gn-feuille img{display:block;width:56px;height:56px;border-radius:14px;margin:0 auto .7rem}.gn-feuille h2{font:400 1.3rem/1.3 "Gilda Display",Georgia,serif;color:#6B2F5B;text-align:center;margin:0 0 .5rem}' +
    '.gn-feuille p{margin:0 0 1rem;text-align:center;line-height:1.5}.gn-feuille button{display:block;width:100%;min-height:48px;margin-top:.5rem;border-radius:999px;border:0;font:700 1rem/1 inherit;font-family:inherit;cursor:pointer}' +
    '.gn-oui{background:#6B2F5B;color:#fff}.gn-non{background:none;color:#8E6383;font-weight:600!important}@keyframes gnV{from{opacity:0}}@keyframes gnM{from{transform:translateY(100%)}}@media (min-width:700px){.gn-voile{align-items:center}.gn-feuille{border-radius:22px}}';
  function proposer(o) {
    o = o || {};
    var deja = null; try { deja = localStorage.getItem(CLE_PROPOSE + '-' + o.canal); } catch (e) {}
    if (deja || !installee()) return;
    etat(o.canal).then(function (e) {
      if (e !== 'inactif' || document.querySelector('.gn-voile')) return;
      try { localStorage.setItem(CLE_PROPOSE + '-' + o.canal, '1'); } catch (x) {}
      if (!document.getElementById('gn-style-f')) { var st = document.createElement('style'); st.id = 'gn-style-f'; st.textContent = STYLE_F; document.head.appendChild(st); }
      var v = document.createElement('div'); v.className = 'gn-voile';
      v.innerHTML = '<div class="gn-feuille" role="dialog" aria-modal="true" aria-labelledby="gn-t">' + (o.icone ? '<img src="' + o.icone + '" alt="">' : '') + '<h2 id="gn-t">' + o.titre + '</h2><p>' + o.texte + '</p>' +
        '<button type="button" class="gn-oui">Oui, je veux être prévenu·e</button><button type="button" class="gn-non">Pas maintenant</button></div>';
      document.body.appendChild(v);
      function fermer() { v.remove(); }
      v.querySelector('.gn-non').addEventListener('click', function () { fermer(); if (o.apres) o.apres(false); });
      v.addEventListener('click', function (ev) { if (ev.target === v) fermer(); });
      v.querySelector('.gn-oui').addEventListener('click', function () {
        var b = this; b.disabled = true; b.textContent = 'Un instant…';
        activer(o.canal, o.sb).then(function (ok) {
          if (ok && window.umami) try { window.umami.track('rappels-ouverture-' + o.canal); } catch (x) {}
          v.querySelector('.gn-feuille').innerHTML = ok ? '<h2>C’est activé</h2><p>Tu recevras au plus une notification par jour. Tu peux les couper quand tu veux.</p><button type="button" class="gn-oui">Parfait</button>'
            : '<h2>Pas de souci</h2><p>Tu pourras les activer plus tard' + (o.ou ? ', ' + o.ou : '') + '.</p><button type="button" class="gn-oui">D’accord</button>';
          v.querySelector('.gn-oui').addEventListener('click', fermer);
          if (o.apres) o.apres(ok);
        });
      });
    });
  }
  /* Ma phrase du jour : la personne écrit sa propre phrase (son argent, sa confiance, sa limite…) et la reçoit chaque jour à l'heure choisie.
     La phrase est gardée avec l'abonnement de l'appareil (non chiffrée, pour pouvoir l'envoyer) ; on peut l'effacer à tout moment.
     z = élément vide, o = { canal, sb, suggestion, apres } */
  var CLE_PHRASE = 'genesolia-phrase-du-jour';
  var STYLE_P = '.gn-phrase{margin:1rem 0;padding:1.1rem 1.2rem;border-radius:18px;background:#FFF9F4;border:1px solid #EBCFD5}.gn-phrase .gn-t{font:400 1.15rem/1.3 "Gilda Display",Georgia,serif;color:#6B2F5B;margin:0 0 .35rem}' +
    '.gn-phrase p{margin:0 0 .6rem}.gn-phrase textarea{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;padding:.6rem .75rem;border-radius:12px;border:1.5px solid #EBCFD5;background:#fff;resize:vertical}' +
    '.gn-heures{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0}.gn-heures label{cursor:pointer}.gn-heures input{position:absolute;opacity:0}.gn-heures span{display:inline-block;padding:.4rem .85rem;border-radius:99px;border:1.5px solid #EBCFD5;background:#fff;font-size:.92rem}' +
    '.gn-heures input:checked+span{background:#6B2F5B;color:#fff;border-color:#6B2F5B}.gn-heures input:focus-visible+span{outline:2px solid #B98A55}.gn-phrase .gn-note{font-size:.86rem;color:#8E6383}.gn-phrase .gn-etat{font-weight:600;color:#6B2F5B}' +
    '.gn-phrase .gn-act button{font:700 .92rem/1 inherit;font-family:inherit;min-height:44px;padding:.55rem 1.1rem;border-radius:999px;border:0;cursor:pointer;background:#6B2F5B;color:#fff}.gn-phrase .gn-act button.gn-clair{background:#FBF0E4;color:#6B2F5B}.gn-phrase .gn-act{display:flex;flex-wrap:wrap;gap:.5rem}.gn-retour{color:#9B2C2C;font-size:.9rem}.gn-retour:empty{display:none}@media print{.gn-phrase{display:none}}';
  function lirePhrase() { try { return JSON.parse(localStorage.getItem(CLE_PHRASE) || 'null'); } catch (e) { return null; } }
  function phraseDuJour(z, o) {
    if (!z) return; o = o || {};
    if (!document.getElementById('gn-style-p')) { var st = document.createElement('style'); st.id = 'gn-style-p'; st.textContent = STYLE_P; document.head.appendChild(st); }
    var mem = lirePhrase(), H = [[8, 'Le matin, 8h'], [12, 'À midi'], [20, 'Le soir, 20h']];
    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    etat(o.canal).then(function (e) {
      var actif = mem && mem.texte;
      var h = '<div class="gn-phrase"><p class="gn-t">Ma phrase du jour</p><p>Écris la phrase que tu veux te redire chaque jour, avec tes mots : pour ton argent, ta confiance, tes limites, ton couple… Tu la recevras en notification, à l’heure que tu choisis.</p>';
      if (e === 'installer') h += '<p class="gn-note">Sur iPhone, ajoute d’abord l’appli à ton écran d’accueil et ouvre-la depuis son icône.</p>';
      else if (e === 'non-supporte') h += '<p class="gn-note">Ce navigateur ne permet pas les notifications.</p>';
      else if (e === 'bloque') h += '<p class="gn-note">Les notifications sont bloquées pour Genesolia sur cet appareil : autorise-les dans les réglages de ton téléphone.</p>';
      else {
        h += '<textarea rows="2" maxlength="140" data-gn-texte placeholder="Exemple : J’ai le droit de gagner ma vie avec ce que j’aime.">' + esc(actif ? mem.texte : (o.suggestion || '')) + '</textarea>' +
          '<div class="gn-heures" role="radiogroup" aria-label="L’heure de ta phrase">' + H.map(function (x) { return '<label><input type="radio" name="gn-heure" value="' + x[0] + '"' + ((actif ? mem.heure : 8) === x[0] ? ' checked' : '') + '><span>' + x[1] + '</span></label>'; }).join('') + '</div>' +
          (actif ? '<p class="gn-etat">Tu reçois ta phrase chaque jour.</p>' : '') +
          '<div class="gn-act"><button type="button" data-gn-ok>' + (actif ? 'Mettre à jour' : 'Recevoir ma phrase chaque jour') + '</button>' + (actif ? '<button type="button" class="gn-clair" data-gn-stop>Arrêter</button>' : '') + '</div>' +
          '<p class="gn-note">Ta phrase est gardée sur nos serveurs en Europe pour pouvoir te l’envoyer (elle n’est pas chiffrée, contrairement à ton carnet). Tu peux l’arrêter et l’effacer à tout moment.</p>';
      }
      z.innerHTML = h + '<p class="gn-retour" role="status"></p></div>';
      var ok = z.querySelector('[data-gn-ok]'), stop = z.querySelector('[data-gn-stop]'), ret = z.querySelector('.gn-retour');
      if (ok) ok.addEventListener('click', function () {
        var t = z.querySelector('[data-gn-texte]').value.trim().slice(0, 140), hr = +(z.querySelector('input[name="gn-heure"]:checked') || {}).value || 8;
        if (!t) { ret.textContent = 'Écris d’abord ta phrase.'; return; }
        ok.disabled = true; ret.textContent = '';
        (e === 'actif' ? Promise.resolve(true) : activer(o.canal, o.sb)).then(function (a) {
          if (!a) return false;
          return inscription().then(function (s) { return s ? appel({ action: 'phrase', endpoint: s.endpoint, texte: t, heure: hr }) : null; }).then(function (r) { return !!(r && r.ok); });
        }).then(function (bon) {
          if (bon) { try { localStorage.setItem(CLE_PHRASE, JSON.stringify({ texte: t, heure: hr })); } catch (x) {} mem = lirePhrase(); if (window.umami) try { window.umami.track('phrase-du-jour'); } catch (x) {} phraseDuJour(z, o); if (o.apres) o.apres(true); }
          else { ok.disabled = false; ret.textContent = 'Ça n’a pas fonctionné. Vérifie que les notifications sont autorisées, puis réessaie.'; }
        });
      });
      if (stop) stop.addEventListener('click', function () {
        stop.disabled = true;
        inscription().then(function (s) { return s ? appel({ action: 'phrase', endpoint: s.endpoint, texte: '', heure: null }) : null; }).then(function () {
          try { localStorage.removeItem(CLE_PHRASE); } catch (x) {} mem = null; phraseDuJour(z, o);
        });
      });
    });
  }
  window.GenesoliaNotifs = { etat: etat, activer: activer, couper: couper, rafraichir: rafraichir, encart: encart, proposer: proposer, phraseDuJour: phraseDuJour, ios: ios, installee: installee };
})();
