/* Genesolia · Mon point de départ (point-de-depart.html), à faire dès l'inscription au Cercle, et à refaire tous les 3 mois.
   1. Ta roue de la vie · 2. Ton mode survie (cycle 1) · 3. Tes blessures du cœur (cycle 2) · 4. Mes cibles · 5. Bienvenue
   Textes : window.POINT_DEPART (assets/point-de-depart-textes.js).
   Réponses : sur l'appareil (genesolia-carnet-point-de-depart) et, avec un compte et l'accord, dans le coffre chiffré (carnet « point-de-depart »).
   Le résultat des blessures alimente aussi le profil d'accompagnement des carnets (genesolia-profil-accompagnement). */
(function () {
  'use strict';
  var T = window.POINT_DEPART, racine = document.getElementById('pd'); if (!T || !racine) return;
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CLE = 'point-de-depart', CLE_LOCALE = 'genesolia-carnet-' + CLE, CLE_PBL = 'genesolia-profil-accompagnement';
  var sb = null, user = null, D = { v: {}, t: {} }, minuteur = null;
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var ROUE = [['energie', 'Mon énergie au quotidien'], ['amour', 'L’amour, ma vie de couple ou mon cœur'], ['famille', 'Mes liens avec ma famille'], ['amis', 'Mes amitiés, mon entourage'], ['travail', 'Mon travail, mes projets'],
    ['argent', 'L’argent, ma sécurité matérielle'], ['chezmoi', 'Mon chez-moi, mon cadre de vie'], ['joie', 'La joie, les loisirs, le plaisir'], ['evolution', 'Mon évolution personnelle'], ['connexion', 'Ma connexion à moi, ma spiritualité']];
  var MODES = ['lutter', 'fuir', 'figer', 'plaire'], BLESSURES = ['rejet', 'abandon', 'humiliation', 'trahison', 'injustice'];
  var NOMS_BL = { rejet: 'Le rejet', abandon: 'L’abandon', humiliation: 'L’humiliation', trahison: 'La trahison', injustice: 'L’injustice' };
  var PAGES_BL = { rejet: 'blessure-de-rejet.html', abandon: 'blessure-d-abandon.html', humiliation: 'blessure-d-humiliation.html', trahison: 'blessure-de-trahison.html', injustice: 'blessure-d-injustice.html' };
  var ETAPES = ['Ta roue de la vie', T.cycle1.titre, T.cycle2.titre, 'Mes cibles', 'Bienvenue'];
  var etape = 0;

  function aujourdhui() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function paras(t) { return String(t || '').split('\n').map(function (x) { return '<p>' + esc(x) + '</p>'; }).join(''); }
  function curseur(k, q, bas, haut) {
    return '<div class="pd-curseur"><label for="pd-' + k + '">' + esc(q) + '</label><div class="pd-ligne"><span>' + esc(bas) + '</span><input id="pd-' + k + '" type="range" min="0" max="10" step="1" value="5" data-k="' + k + '"><span>' + esc(haut) + '</span></div><b data-val="' + k + '">Place le curseur</b></div>';
  }

  /* ───── Les pages ───── */
  function pageRoue() {
    return '<h2>Ta roue de la vie</h2><p class="pd-consigne">Pour chaque domaine de ta vie, à quel point te sens-tu comblée aujourd’hui ? 0, pas du tout ; 10, pleinement. C’est la photo de ton point de départ : tu la compareras dans trois mois.</p>' +
      ROUE.map(function (d) { return curseur('roue-' + d[0], d[1], 'pas du tout', 'pleinement'); }).join('') + '<div class="pd-resultat" data-res-roue hidden></div>';
  }
  function pageC1() {
    var C = T.cycle1;
    return '<h2>' + esc(C.titre) + '</h2><p class="pd-sur">Cycle 1 · Vivre en paix</p><p class="pd-consigne">' + esc(C.consigne) + '</p>' +
      '<ol class="pd-affs">' + C.affirmations.map(function (a, i) {
        return '<li><p>' + esc(a.texte) + '</p><div class="pd-notes" role="radiogroup" aria-label="' + esc(a.texte) + '">' + [0, 1, 2, 3].map(function (n) {
          return '<label><input type="radio" name="c1a' + i + '" value="' + n + '" data-k="c1-a' + i + '" data-radio><span>' + ['Pas du tout moi', 'Un peu moi', 'Souvent moi', 'Tout à fait moi'][n] + '</span></label>';
        }).join('') + '</div></li>';
      }).join('') + '</ol>' +
      '<h3>Tes domaines de sécurité</h3>' + C.domaines.map(function (d) {
        return '<div class="pd-domaine">' + curseur('c1-d-' + d.cle, d.nom + ' · ' + d.aide, 'très en insécurité', 'en paix') +
          '<fieldset class="pd-niveaux"><legend>Ce qui précise ce que tu vis (facultatif)</legend>' + d.niveaux.map(function (n, j) { return '<label><input type="checkbox" data-k="c1-n-' + d.cle + '-' + j + '"> ' + esc(n) + '</label>'; }).join('') + '</fieldset></div>';
      }).join('') +
      '<div class="pd-resultat" data-res-c1 hidden></div><p class="pd-mention">' + esc(C.mention) + '</p>';
  }
  function pageC2() {
    var C = T.cycle2;
    return '<h2>' + esc(C.titre) + '</h2><p class="pd-sur">Cycle 2 · Aimer en paix</p><p class="pd-consigne">' + esc(C.consigne) + '</p>' +
      '<ul class="pd-cases">' + C.affirmations.map(function (a, i) { return '<li><label><input type="checkbox" data-k="c2-a' + i + '"> ' + esc(a.texte) + '</label></li>'; }).join('') + '</ul>' +
      '<h3>Ce qui pèse sur ton cœur</h3><p class="pd-consigne">' + esc(C.pese.consigne) + '</p>' +
      '<ul class="pd-cases">' + C.pese.options.map(function (o, j) { return '<li><label><input type="checkbox" data-k="c2-p' + j + '"> ' + esc(o) + '</label></li>'; }).join('') + '</ul>' +
      '<label class="pd-champ"><span>Autre, avec tes mots</span><input type="text" data-k="c2-p-autre" maxlength="200" placeholder="Exemple : le départ de mes enfants de la maison"></label>' +
      '<div class="pd-resultat" data-res-c2 hidden></div><p class="pd-mention">' + esc(C.mention) + '</p>';
  }
  function cibles(n, consigne, exemples) {
    return '<section class="pd-cibles"><h3>Cycle ' + n + ' · ' + (n === 1 ? 'Vivre en paix' : 'Aimer en paix') + '</h3><p class="pd-consigne">' + esc(consigne) + '</p>' +
      [1, 2, 3].map(function (r) { return '<label class="pd-champ"><span>Priorité ' + r + (r > 1 ? ' (facultatif)' : '') + '</span><input type="text" maxlength="160" data-k="c' + n + '-cible-' + r + '" placeholder="Exemple : ' + esc(exemples[r - 1] || exemples[0]) + '"></label>'; }).join('') +
      '<p class="pd-echange"><button type="button" class="btn btn-trait" data-echanger="' + n + '">Échanger les priorités 1 et 2</button></p></section>';
  }
  function pageCibles() {
    var C = T.cibles;
    return '<h2>Mes cibles</h2><div class="pd-resume" data-resume></div>' + cibles(1, C.consigne1, C.exemples1) + cibles(2, C.consigne2, C.exemples2) + '<div class="pd-rythme">' + paras(C.rythme) + '</div>';
  }
  function pageFin() {
    return '<h2>Bienvenue dans le Cercle</h2>' + paras(T.fin) + '<div class="pd-resume" data-resume-fin></div>' +
      '<p class="pd-boutons"><a class="btn btn-plein" href="mon-carnet.html">Ouvrir mon carnet du mois</a><a class="btn btn-trait" href="mon-module.html?module=1">Ouvrir le module 1</a><a class="btn btn-trait" href="cercle.html">Aller à mon Cercle</a></p>' +
      '<p class="pd-mention">Tu pourras refaire ce point de départ tous les trois mois, depuis ton Cercle, pour voir le chemin parcouru.</p>';
  }

  function construire() {
    racine.innerHTML = '<header class="pd-tete"><p class="pd-sur">Le Cercle · à faire en arrivant</p><h1>Mon point de départ</h1><div class="pd-intro">' + paras(T.intro) + '</div><div class="pd-compte" id="pd-compte" hidden></div></header>' +
      '<nav class="pd-etapes" aria-label="Les étapes">' + ETAPES.map(function (e, i) { return '<button type="button" data-etape="' + i + '"><span>' + (i + 1) + '</span>' + esc(e) + '</button>'; }).join('') + '</nav>' +
      [pageRoue, pageC1, pageC2, pageCibles, pageFin].map(function (f, i) {
        return '<section class="pd-page" data-page="' + i + '"' + (i ? ' hidden' : '') + '>' + f() +
          '<div class="pd-nav">' + (i ? '<button type="button" class="btn btn-trait" data-etape="' + (i - 1) + '">Étape précédente</button>' : '<span></span>') +
          (i < ETAPES.length - 1 ? '<button type="button" class="btn btn-plein" data-etape="' + (i + 1) + '">' + (i === 3 ? 'Terminer' : 'Étape suivante') + '</button>' : '') + '</div></section>';
      }).join('') + '<p class="pd-etat" id="pd-etat" aria-live="polite"></p>';
    racine.addEventListener('click', function (e) {
      var b = e.target.closest('[data-etape]'); if (b) { aller(+b.getAttribute('data-etape')); return; }
      var x = e.target.closest('[data-echanger]'); if (x) { var n = x.getAttribute('data-echanger'), a = 'c' + n + '-cible-1', c = 'c' + n + '-cible-2', t = D.v[a]; poser(a, D.v[c] || ''); poser(c, t || ''); appliquer(); sauver(); }
    });
    racine.addEventListener('input', changement);
    racine.addEventListener('change', changement);
    racine.addEventListener('pointerup', function (e) { if (e.target.type === 'range') changement({ target: e.target }); });
    var h = (location.hash || '').replace('#etape-', ''); if (/^[1-5]$/.test(h)) etape = +h - 1;
  }
  function aller(i) {
    if (i < 0 || i >= ETAPES.length) return;
    etape = i;
    racine.querySelectorAll('.pd-page').forEach(function (p) { p.hidden = +p.getAttribute('data-page') !== i; });
    racine.querySelectorAll('.pd-etapes [data-etape]').forEach(function (b) { var a = +b.getAttribute('data-etape') === i; b.classList.toggle('actif', a); if (a) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    try { history.replaceState(null, '', '#etape-' + (i + 1)); } catch (e) {}
    if (i === ETAPES.length - 1 && !D.v.fait) { poser('fait', aujourdhui()); garderResume(); sauver(); }
    majResultats();
    var nav = racine.querySelector('.pd-etapes'); if (nav) window.scrollTo({ top: Math.max(0, nav.getBoundingClientRect().top + window.pageYOffset - 80), behavior: 'auto' });
  }

  /* ───── Les valeurs ───── */
  function poser(k, v) { D.v[k] = v; D.t = D.t || {}; D.t[k] = Date.now(); }
  function changement(e) {
    var el = e.target; if (!el.hasAttribute || !el.hasAttribute('data-k')) return;
    var k = el.getAttribute('data-k'), v;
    if (el.type === 'checkbox') v = el.checked; else if (el.hasAttribute('data-radio')) { if (!el.checked) return; v = +el.value; } else if (el.type === 'range') v = +el.value; else v = el.value;
    poser(k, v);
    if (el.type === 'range') afficherVal(el);
    majResultats(); sauver();
  }
  function afficherVal(el) {
    var k = el.getAttribute('data-k'), b = racine.querySelector('[data-val="' + k + '"]'), ok = typeof D.v[k] === 'number';
    if (b) b.textContent = ok ? D.v[k] + ' sur 10' : 'Place le curseur';
    el.closest('.pd-curseur').classList.toggle('pd-vide', !ok);
  }
  function appliquer() {
    racine.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k'), v = D.v[k];
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.hasAttribute('data-radio')) el.checked = v !== undefined && +el.value === v;
      else if (el.type === 'range') { if (typeof v === 'number') el.value = v; afficherVal(el); }
      else el.value = v || '';
    });
    majResultats();
  }

  /* ───── Les résultats ───── */
  function scoresModes() {
    var s = { lutter: 0, fuir: 0, figer: 0, plaire: 0 }, n = 0;
    T.cycle1.affirmations.forEach(function (a, i) { var v = D.v['c1-a' + i]; if (typeof v === 'number') { s[a.mode] += v; n++; } });
    return n ? s : null;
  }
  function modesDominants(s) { var max = Math.max.apply(null, MODES.map(function (m) { return s[m]; })); return max > 0 ? MODES.filter(function (m) { return s[m] === max; }).slice(0, 2) : []; }
  function domaineFragile() {
    var l = T.cycle1.domaines.filter(function (d) { return typeof D.v['c1-d-' + d.cle] === 'number'; });
    if (!l.length) return null;
    return l.reduce(function (a, d) { return D.v['c1-d-' + d.cle] < D.v['c1-d-' + a.cle] ? d : a; }, l[0]);
  }
  function scoresBlessures() {
    var s = {}, n = 0; BLESSURES.forEach(function (b) { s[b] = 0; });
    T.cycle2.affirmations.forEach(function (a, i) { if (D.v['c2-a' + i]) { s[a.blessure]++; n++; } });
    return n ? s : null;
  }
  function blessuresDominantes(s) { var max = Math.max.apply(null, BLESSURES.map(function (b) { return s[b]; })); return BLESSURES.filter(function (b) { return s[b] === max && max > 0; }).slice(0, 2); }
  function majResultats() {
    /* la roue */
    var zr = racine.querySelector('[data-res-roue]'), notes = ROUE.filter(function (d) { return typeof D.v['roue-' + d[0]] === 'number'; });
    if (zr) { zr.hidden = notes.length < 3; if (notes.length >= 3) { var bas = notes.slice().sort(function (a, b) { return D.v['roue-' + a[0]] - D.v['roue-' + b[0]]; }).slice(0, 2); zr.innerHTML = '<p class="pd-res-t">Ce qui demande le plus d’attention aujourd’hui</p><p>' + bas.map(function (d) { return esc(d[1]) + ' (' + D.v['roue-' + d[0]] + ' sur 10)'; }).join(' et ') + '. Tu pourras t’en servir pour choisir tes cibles.</p>'; } }
    /* le mode survie */
    var z1 = racine.querySelector('[data-res-c1]'), s = scoresModes();
    if (z1) {
      z1.hidden = !s;
      if (s) {
        var dom = modesDominants(s), df = domaineFragile();
        z1.innerHTML = '<p class="pd-res-t">Ton résultat</p>' + (dom.length ? dom.map(function (m) {
          var R = T.cycle1.resultats[m];
          return '<article class="pd-res"><h3>' + esc(R.nom) + '</h3><p>' + esc(R.texte) + '</p><p class="pd-res-t">Ce qui t’aide</p><ul>' + R.aide.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul><p class="pd-phrase">« ' + esc(R.phrase) + ' »</p></article>';
        }).join('') : '<p>Note encore quelques affirmations pour voir ton mode le plus présent.</p>') +
          '<p class="pd-barres">' + MODES.map(function (m) { return '<span><b>' + esc(T.cycle1.resultats[m].nom) + '</b><i style="--v:' + Math.round(s[m] / 12 * 100) + '%"></i>' + s[m] + ' sur 12</span>'; }).join('') + '</p>' +
          (df ? '<p class="pd-res-t">Le domaine le plus fragile</p><p><b>' + esc(df.nom) + '</b> (' + D.v['c1-d-' + df.cle] + ' sur 10). ' + df.niveaux.filter(function (n, j) { return D.v['c1-n-' + df.cle + '-' + j]; }).map(esc).join(' ') + '</p>' : '');
      }
    }
    /* les blessures */
    var z2 = racine.querySelector('[data-res-c2]'), b = scoresBlessures();
    if (z2) {
      z2.hidden = !b;
      if (b) z2.innerHTML = '<p class="pd-res-t">Ce qui te parle le plus</p>' + blessuresDominantes(b).map(function (k) {
        var R = T.cycle2.resultats[k];
        return '<article class="pd-res"><h3>' + NOMS_BL[k] + '</h3><p>' + esc(R.texte) + '</p><p class="pd-res-t">Un premier pas</p><p>' + esc(R.pas) + '</p><p><a href="' + PAGES_BL[k] + '">Lire tout sur ' + NOMS_BL[k].toLowerCase() + '</a></p></article>';
      }).join('') + '<p class="pd-barres">' + BLESSURES.map(function (k) { return '<span><b>' + NOMS_BL[k] + '</b><i style="--v:' + Math.round(b[k] / 4 * 100) + '%"></i>' + b[k] + ' sur 4</span>'; }).join('') + '</p>';
    }
    /* le résumé, avant les cibles et à la fin */
    var res = resume();
    racine.querySelectorAll('[data-resume],[data-resume-fin]').forEach(function (z) {
      z.innerHTML = res.mode || res.domaine || res.blessures.length ? '<p class="pd-res-t">Ce que tes réponses montrent</p><ul>' +
        (res.mode ? '<li>Ton mode survie : <b>' + esc(res.mode) + '</b></li>' : '') + (res.domaine ? '<li>Ton domaine le plus fragile : <b>' + esc(res.domaine) + '</b></li>' : '') +
        (res.blessures.length ? '<li>Ce qui te parle le plus dans tes liens : <b>' + res.blessures.map(function (k) { return NOMS_BL[k].toLowerCase(); }).join(' et ') + '</b></li>' : '') +
        (z.hasAttribute('data-resume-fin') && D.v['c1-cible-1'] ? '<li>Ta cible du cycle 1 : <b>' + esc(D.v['c1-cible-1']) + '</b></li>' : '') +
        (z.hasAttribute('data-resume-fin') && D.v['c2-cible-1'] ? '<li>Ta cible du cycle 2 : <b>' + esc(D.v['c2-cible-1']) + '</b></li>' : '') + '</ul>' : '';
    });
  }
  function resume() {
    var s = scoresModes(), dom = s ? modesDominants(s) : [], df = domaineFragile(), b = scoresBlessures();
    return { mode: dom.map(function (m) { return T.cycle1.resultats[m].nom; }).join(' et '), modes: dom, domaine: df ? df.nom : '', domaineCle: df ? df.cle : '', blessures: b ? blessuresDominantes(b) : [], scoresBl: b };
  }
  /* Le résumé est gardé avec les réponses (pour l'appli), et les blessures rejoignent le profil des carnets */
  function garderResume() {
    var r = resume();
    poser('resume', { date: aujourdhui(), mode: r.mode, modes: r.modes, domaine: r.domaine, domaineCle: r.domaineCle, blessures: r.blessures, cible1: D.v['c1-cible-1'] || '', cible2: D.v['c2-cible-1'] || '' });
    if (r.scoresBl) {
      var p = { scores: r.scoresBl, date: aujourdhui(), moi: user ? user.id : 'appareil' };
      try { localStorage.setItem(CLE_PBL, JSON.stringify(p)); } catch (e) {}
      var CF = window.GenesoliaCoffre;
      if (user && sb && CF && CF.accord(user)) CF.ecrire(sb, user, 'profil-accompagnement', p);
    }
  }

  /* ───── L'enregistrement (même règle que les carnets) ───── */
  function etat(t) { var e = document.getElementById('pd-etat'); if (e) e.textContent = t; }
  function sauver() {
    if (D.v.fait) garderResumeSilencieux();
    try { localStorage.setItem(CLE_LOCALE, JSON.stringify(D)); } catch (e) {}
    clearTimeout(minuteur);
    if (!user || !sb) { etat('Gardé dans ce navigateur jusqu’à sa fermeture. Crée ton espace pour le garder.'); return; }
    var CF = window.GenesoliaCoffre;
    if (CF && !CF.accord(user)) { etat('Gardé sur cet appareil, en attente de ton accord.'); return; }
    etat('Enregistrement…');
    minuteur = setTimeout(function () {
      (CF ? CF.ecrire(sb, user, CLE, D) : Promise.resolve({ error: true })).then(function (r) { etat(r && r.error ? 'Pas enregistré, réessaie plus tard.' : 'Enregistré et chiffré dans ton espace.'); }, function () { etat('Pas enregistré, réessaie plus tard.'); });
    }, 900);
  }
  function garderResumeSilencieux() { var r = resume(), a = D.v.resume || {}; D.v.resume = { date: a.date || D.v.fait, mode: r.mode, modes: r.modes, domaine: r.domaine, domaineCle: r.domaineCle, blessures: r.blessures, cible1: D.v['c1-cible-1'] || '', cible2: D.v['c2-cible-1'] || '' }; }
  function fusion(a, b) {
    var r = { v: {}, t: {} };
    [a, b].forEach(function (x) { if (!x || !x.v) return; Object.keys(x.v).forEach(function (k) { var tk = (x.t && x.t[k]) || 0; if (!(k in r.v) || tk >= (r.t[k] || 0)) { r.v[k] = x.v[k]; r.t[k] = tk; } }); });
    return r;
  }
  function charger() {
    var local = null; try { local = JSON.parse(localStorage.getItem(CLE_LOCALE) || 'null'); } catch (e) {}
    function fin(d) { D = d || D; appliquer(); aller(etape); }
    if (!sb) { fin(local); return; }
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) {
        fin(local);
        var z = document.getElementById('pd-compte'); z.hidden = false;
        z.innerHTML = '<p><b>Sans compte, tes réponses restent dans ce navigateur tant qu’il est ouvert.</b> Crée ton espace gratuit pour les garder et les retrouver dans ton Cercle.</p><a class="btn btn-plein" href="login.html?inscription&amp;retour=point-de-depart.html">Créer mon espace</a> <a href="login.html?retour=point-de-depart.html">J’ai déjà un compte</a>';
        return;
      }
      user = s.user;
      var CF = window.GenesoliaCoffre;
      (CF && CF.accord(user) ? CF.lire(sb, user, CLE) : Promise.resolve(null)).then(function (dist) {
        fin(fusion(dist, local));
        if (CF && !CF.accord(user)) CF.demander(document.getElementById('pd-compte'), sb, function () { user.user_metadata = Object.assign({}, user.user_metadata, { coffre_accord: new Date().toISOString() }); sauver(); });
        else if (local && Object.keys(local.v || {}).length) sauver();
      }, function () { fin(local); });
    }).catch(function () { fin(local); });
  }

  construire();
  charger();
})();
