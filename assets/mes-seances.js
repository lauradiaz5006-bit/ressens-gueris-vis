/* Genesolia · Le Cercle · « Mes séances »
   Les séances se débloquent une par une, au fil des étapes : à l'étape N, les séances 1 à N de chaque cycle autorisé sont débloquées
   (cycle 1 seul pour l'offre « cycle1 », cycles 1 et 2 pour Le Cercle). La page rappelle le point de départ et marque « Pour toi ».
   Au premier « Écouter », la séance est enregistrée comme ouverte par le serveur (ouvrir_seance), dans l'ordre des étapes.
   Le compte est fait par le serveur (fonction ouvrir_seance) ; l'écoute passe par la fonction « seance-audio » (lien d'une heure).
   Textes et règles : outils-internes/supabase-seances.sql et assets/seances.js. */
(function () {
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CAT = window.GENESOLIA_SEANCES || { cycles: {}, liste: [] };
  var racine = document.getElementById('seances');
  var sb = null, user = null, jeton = '', acces = null, ouvertes = {}, PD = null, base = true, choix = '';
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var ORDRE = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var NOMS_BL = { rejet: 'le rejet', abandon: 'l’abandon', humiliation: 'l’humiliation', trahison: 'la trahison', injustice: 'l’injustice' };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function moisDepuis(d) {
    var a = new Date(d), n = new Date(), m = (n.getFullYear() - a.getFullYear()) * 12 + (n.getMonth() - a.getMonth());
    if (n.getDate() < a.getDate()) m--;
    return Math.max(0, m) + 1;
  }
  function plusMois(d, k) { var x = new Date(d); x.setMonth(x.getMonth() + k); return x; }
  function dateCourte(d) { return d.getDate() + (d.getDate() === 1 ? 'er' : '') + ' ' + MOIS[d.getMonth()]; }

  /* ───── Ce qu'on sait de la personne ───── */
  function cyclesPermis() { if (!acces) return []; return acces.offre === 'cycle1' ? [1] : [1, 2]; }
  function credits(cy) {
    if (!acces) return 0;
    var n = 0; Object.keys(ouvertes).forEach(function (k) { if (ouvertes[k] === cy) n++; });
    return Math.max(0, moisDepuis(acces.cree_le) - n);
  }
  function prochaine() { return acces ? plusMois(acces.cree_le, moisDepuis(acces.cree_le)) : null; }
  function etapeDe(s) { return ORDRE.indexOf(s.mois) + 1; }
  /* Le parcours démarre le jour de l'inscription : le premier mois (étape 1) est offert, la séance 1 est débloquée tout de suite */
  function debut() { return acces ? new Date(acces.cree_le) : new Date(); }
  function etapeEnCours() { return acces ? Math.min(moisDepuis(debut()), 12) : 0; }
  function debloquee(s) { return !!acces && cyclesPermis().indexOf(s.cycle) >= 0 && (etapeDe(s) <= etapeEnCours() || !!ouvertes[s.id]); }
  function abonner(t) { return '<p class="ms-verrou ms-abonne">' + t + ' <a href="abonnement.html">Tu veux t’abonner ?</a></p>'; }
  function pdV() { return (PD && PD.v) || {}; }
  function pdFait() { return !!pdV().fait; }
  function pdRes() { return pdV().resume || {}; }
  function pourToi(s) {
    var r = pdRes();
    if (s.cycle === 1) return (r.modes || []).some(function (m) { return (s.modes || []).length < 4 && s.modes.indexOf(m) >= 0; });
    return (r.blessures || []).slice(0, 2).some(function (b) { return (s.blessures || []).length < 5 && s.blessures.indexOf(b) >= 0; });
  }

  /* ───── L'affichage ───── */
  function travail() {
    var v = pdV(), r = pdRes();
    if (!pdFait()) return '<section class="ms-encadre ms-pd"><p class="ms-sur">Avant ta première séance</p><h2>Fais d’abord ton point de départ</h2>' +
      '<p>Tes séances se débloquent au fil de tes étapes. Ton point de départ, en quinze minutes, te montre ce que tu veux travailler : la page marquera alors les séances « Pour toi ».</p>' +
      '<p><a class="btn btn-plein" href="point-de-depart.html">Faire mon point de départ</a></p></section>';
    var l = [];
    var c1 = v['c1-cible-1'] || r.cible1, c2 = v['c2-cible-1'] || r.cible2;
    if (c1) l.push('<li><span>Ta cible du cycle 1</span>« ' + esc(c1) + ' »</li>');
    if (r.mode) l.push('<li><span>Ton mode survie</span>' + esc(r.mode) + '</li>');
    if (r.domaine) l.push('<li><span>Le domaine où tu te sens le moins en sécurité</span>' + esc(r.domaine) + '</li>');
    if (cyclesPermis().indexOf(2) >= 0) {
      if (c2) l.push('<li><span>Ta cible du cœur</span>« ' + esc(c2) + ' »</li>');
      if ((r.blessures || []).length) l.push('<li><span>Ta blessure du cœur</span>' + esc(r.blessures.slice(0, 2).map(function (b) { return NOMS_BL[b] || b; }).join(' et ')) + '</li>');
    }
    return '<section class="ms-encadre"><p class="ms-sur">Ce que tu veux travailler</p><h2>Ton point de départ</h2>' +
      (l.length ? '<ul class="ms-travail">' + l.join('') + '</ul>' : '') +
      '<p class="ms-note">Les séances marquées « Pour toi » répondent à ce que tu vis. Dans chaque cycle, celle de ton étape (la même dans ton carnet et dans ton suivi) est marquée « Ton étape ». <a href="point-de-depart.html">Revoir mon point de départ</a></p></section>';
  }
  function etatCycle(cy) {
    if (!acces) return cy === 1 ? '<p class="ms-etat">Tes séances se débloquent une par une, au fil de tes étapes, dès ton entrée dans Le Cercle. <a href="abonnement.html">Découvrir Le Cercle</a></p>'
      : '<p class="ms-etat">Réservé aux abonné·es du Cercle. <a href="abonnement.html">Tu veux t’abonner ?</a></p>';
    if (cyclesPermis().indexOf(cy) < 0) return '<p class="ms-etat">Réservé aux abonné·es du Cercle. <a href="abonnement.html">Tu veux t’abonner ?</a></p>';
    var et = etapeEnCours(), n = CAT.liste.filter(function (s) { return s.cycle === cy && debloquee(s); }).length, t;
    if (n >= 12) t = 'Tu as débloqué <b>toutes tes séances</b>. Écoute-les aussi souvent que tu veux.';
    else {
      t = n <= 1 ? (et === 1 ? 'Ton premier mois est offert : tu as débloqué <b>la séance 1</b>.' : 'Tu as débloqué <b>la séance 1</b> pour le moment.') : n === 2 ? 'Tu as débloqué <b>les séances 1 et 2</b>.' : 'Tu as débloqué <b>les ' + n + ' premières séances</b>.';
      t += ' La séance ' + (et + 1) + ' se débloque à ton étape ' + (et + 1) + ', à partir du ' + dateCourte(plusMois(debut(), et)) + '.';
    }
    return '<p class="ms-etat">' + t + '</p>';
  }
  function carte(s) {
    var permis = !!acces && cyclesPermis().indexOf(s.cycle) >= 0, ok = debloquee(s), n = etapeDe(s), et = etapeEnCours();
    var cetEtape = ok && et > 0 && n === et, toi = pdFait() && permis && pourToi(s);
    var cls = 'ms-carte' + (ok ? ' ms-ouverte' : ' ms-fermee') + (!permis ? ' ms-grise' : '') + (toi ? ' ms-toi' : '') + (location.hash === '#seance-' + s.id ? ' ms-cible' : '');
    var action;
    if (ok) action = '<button type="button" class="btn btn-plein" data-ecouter="' + s.id + '">Écouter</button>';
    else if (!acces) action = s.cycle === 1 ? abonner('Réservée aux membres du Cercle.') : abonner('Réservée aux abonné·es du Cercle.');
    else if (!permis) action = abonner('Réservée aux abonné·es du Cercle.');
    else action = '<p class="ms-verrou">Se débloque à ton étape ' + n + ', à partir du ' + dateCourte(plusMois(debut(), n - 1)) + '.</p>';
    return '<article class="' + cls + '" id="seance-' + s.id + '">' +
      (s.image ? '<div class="ms-img"><img src="' + esc(s.image) + '" alt="" loading="lazy" width="800" height="450">' + (ok ? '' : '<span class="ms-cadenas" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>') + '</div>' : '') +
      '<p class="ms-badges"><span class="ms-mois">Séance ' + n + '</span>' + (cetEtape ? '<span class="ms-badge ms-badge-saison">Ton étape</span>' : '') + (toi ? '<span class="ms-badge">Pour toi</span>' : '') + (ok ? '<span class="ms-badge ms-badge-ok">Débloquée</span>' : '') + '</p>' +
      '<h3>' + esc(s.titre) + '</h3>' + (s.sujet ? '<p class="ms-sujet">' + esc(s.sujet) + '</p>' : '') +
      '<p class="ms-voyage">' + esc(s.voyage) + '</p>' +
      (s.libere ? '<p class="ms-ligne"><span>Ce qu’elle libère</span>' + esc(s.libere) + '</p>' : '') +
      '<p class="ms-ligne"><span>' + (s.cycle === 1 ? 'Ce qui prend la place' : 'Ta ressource') + '</span>' + esc(s.place) + '</p>' +
      '<div class="ms-action">' + action + '</div><div class="ms-lecteur" data-lecteur="' + s.id + '"></div></article>';
  }
  function afficher() {
    var h = '<header class="ms-tete"><p class="ms-sur">Le Cercle</p><h1>Mes séances</h1>' +
      '<p>Tes séances audio se débloquent une par une, au fil de ton avancée : à chaque nouvelle étape, une nouvelle séance s’ouvre dans chaque cycle. Elles restent à toi tant que tu es membre, pour les écouter aussi souvent que tu veux.</p></header>';
    if (!user) h += '<section class="ms-encadre"><h2>Connecte-toi pour retrouver tes séances</h2><p><a class="btn btn-plein" href="login.html">Me connecter</a></p></section>';
    else if (!acces) h += '<section class="ms-encadre"><h2>Tes séances arrivent avec Le Cercle</h2><p>Les séances audio font partie de l’abonnement au Cercle : la première se débloque dès ton entrée, puis une nouvelle à chaque étape. Tu peux les découvrir ci-dessous.</p><p><a class="btn btn-plein" href="abonnement.html">Tu veux t’abonner ?</a></p></section>';
    /* plus d'encadré « Ce que tu veux travailler » : les séances suivent les étapes, il n'y a pas de choix à faire */
    if (!base) h += '<p class="ms-note ms-attente">L’ouverture des séances se met en place : elle sera disponible très bientôt.</p>';
    /* d'abord les séances débloquées (la plus récente en premier), puis, cycle par cycle, celles qui arrivent */
    var actives = CAT.liste.filter(debloquee).sort(function (a, b) { return (etapeDe(b) - etapeDe(a)) || (a.cycle - b.cycle); });
    if (actives.length) h += '<section class="ms-cycle ms-actives"><h2>À écouter maintenant</h2><p class="ms-cycle-st">Tes séances débloquées, à réécouter aussi souvent que tu veux.</p>' +
      '<div class="ms-grille">' + actives.map(carte).join('') + '</div></section>';
    [1, 2].forEach(function (cy) {
      var C = CAT.cycles[cy] || {};
      var liste = CAT.liste.filter(function (s) { return s.cycle === cy && !debloquee(s); }).sort(function (a, b) { return ORDRE.indexOf(a.mois) - ORDRE.indexOf(b.mois); });
      if (!liste.length) return;
      h += '<section class="ms-cycle' + (acces && cyclesPermis().indexOf(cy) < 0 ? ' ms-cycle-grise' : '') + '"><h2>' + (actives.length ? 'À venir · ' : '') + esc(C.titre) + '</h2><p class="ms-cycle-st">' + esc(C.sousTitre) + '</p>' + etatCycle(cy) +
        '<div class="ms-grille">' + liste.map(carte).join('') + '</div></section>';
    });
    h += '<p class="ms-mention">Ces séances proposent une démarche symbolique de développement personnel. Elles ne remplacent pas un accompagnement médical ou psychologique. Écoute-les au calme, jamais en conduisant.</p>';
    racine.innerHTML = h;
    /* Venue du carnet ou du suivi (#seance-c2-11…) : la séance de l'étape est mise en avant, et on s'y rend une seule fois */
    if (!vue && /^#seance-c[12]-\d\d$/.test(location.hash)) { vue = true; var cib = document.getElementById(location.hash.slice(1)); if (cib) setTimeout(function () { cib.scrollIntoView({ block: 'center' }); }, 60); }
  }
  var vue = false;

  /* ───── Les actions ───── */
  function ouvrir(id, bouton) {
    bouton.disabled = true;
    sb.rpc('ouvrir_seance', { p_seance: id }).then(function (r) {
      var d = r && r.data;
      if (r.error || !d) { bouton.disabled = false; message(id, 'L’ouverture n’a pas marché. Réessaie dans un instant.'); return; }
      if (!d.ok) {
        var t = { mois: 'Tu as déjà ouvert ta séance de ce mois' + (d.prochaine ? ' : la prochaine s’ouvre à partir du ' + dateCourte(new Date(d.prochaine + 'T12:00:00')) : '') + '.', offre: 'Cette séance est incluse dans Le Cercle.', abonnement: 'Ton abonnement n’est plus actif.' }[d.erreur] || 'L’ouverture n’a pas marché.';
        message(id, t); bouton.disabled = false; return;
      }
      ouvertes[id] = +id.charAt(1); choix = ''; afficher();
      var c = document.getElementById('seance-' + id); if (c) c.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (window.umami) try { window.umami.track('seance-ouverte', { seance: id }); } catch (x) {}
    });
  }
  function ecouter(id, bouton) {
    var z = racine.querySelector('[data-lecteur="' + id + '"]'); if (!z) return;
    bouton.disabled = true;
    fetch(SB_URL + '/functions/v1/seance-audio', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + jeton, 'Content-Type': 'application/json' }, body: JSON.stringify({ seance: id }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        bouton.disabled = false;
        if (d && d.url) { var au = '<audio controls preload="metadata" src="' + esc(d.url) + '"></audio>'; z.innerHTML = window.GenesoliaCadre ? window.GenesoliaCadre.html(au) : au; return; }
        z.innerHTML = '<p class="ms-note">' + (d && d.bientot ? 'Ta séance est en cours d’enregistrement : elle sera là très bientôt, au même endroit.' : 'La séance ne s’ouvre pas pour l’instant. Recharge la page.') + '</p>';
      })
      .catch(function () { bouton.disabled = false; z.innerHTML = '<p class="ms-note">La séance ne s’ouvre pas pour l’instant. Recharge la page.</p>'; });
  }
  /* Une séance débloquée par l'étape est enregistrée comme ouverte au premier « Écouter » (le serveur vérifie l'abonnement et le nombre d'étapes) */
  function enregistrer(id, bouton) {
    bouton.disabled = true;
    sb.rpc('ouvrir_seance', { p_seance: id }).then(function (r) {
      var d = r && r.data; bouton.disabled = false;
      if (!r.error && d && d.ok) { ouvertes[id] = +id.charAt(1); if (window.umami) try { window.umami.track('seance-ouverte', { seance: id }); } catch (x) {} ecouter(id, bouton); return; }
      message(id, d && d.erreur === 'abonnement' ? 'Ton abonnement n’est plus actif.' : d && d.erreur === 'offre' ? 'Cette séance est réservée aux abonné·es du Cercle.' : 'La séance ne s’ouvre pas pour l’instant. Réessaie dans un instant, ou écris-nous à contact@genesolia.fr.');
    }, function () { bouton.disabled = false; message(id, 'La séance ne s’ouvre pas pour l’instant. Recharge la page.'); });
  }
  function message(id, t) { var z = racine.querySelector('[data-lecteur="' + id + '"]'); if (z) z.innerHTML = '<p class="ms-note">' + esc(t) + '</p>'; }
  racine.addEventListener('click', function (e) {
    var t = e.target;
    var c = t.closest('[data-choisir]'); if (c) { choix = c.getAttribute('data-choisir'); afficher(); var el = document.getElementById('seance-' + choix); if (el) el.querySelector('[data-ouvrir]').focus(); return; }
    if (t.closest('[data-annuler]')) { choix = ''; afficher(); return; }
    var o = t.closest('[data-ouvrir]'); if (o) { ouvrir(o.getAttribute('data-ouvrir'), o); return; }
    var l = t.closest('[data-ecouter]'); if (l) { var id = l.getAttribute('data-ecouter'); if (ouvertes[id]) ecouter(id, l); else enregistrer(id, l); return; }
  });

  /* ───── Le chargement ───── */
  function chargerPD() {
    var local = null; try { local = JSON.parse(localStorage.getItem('genesolia-carnet-point-de-depart') || 'null'); } catch (e) {}
    var CF = window.GenesoliaCoffre;
    if (user && CF && CF.accord(user)) return CF.lire(sb, user, 'point-de-depart').then(function (d) { return d || local; }, function () { return local; });
    return Promise.resolve(local);
  }
  function demarrer() {
    if (!sb) { afficher(); return; }
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { afficher(); return; }
      user = s.user; jeton = s.access_token;
      return Promise.all([
        sb.from('acces_premium').select('offre,valide_jusqu,cree_le').then(function (x) { return x.data || []; }, function () { return []; }),
        sb.from('seances_ouvertes').select('seance,cycle').then(function (x) { if (x.error) base = false; return x.data || []; }, function () { base = false; return []; }),
        chargerPD()
      ]).then(function (v) {
        var maintenant = new Date();
        acces = (v[0] || []).filter(function (a) { return a.valide_jusqu && new Date(a.valide_jusqu) > maintenant; }).sort(function (a, b) { return new Date(b.valide_jusqu) - new Date(a.valide_jusqu); })[0] || null;
        if (acces && !acces.cree_le) acces.cree_le = maintenant.toISOString();
        (v[1] || []).forEach(function (o) { ouvertes[o.seance] = o.cycle; });
        PD = v[2];
        afficher();
      });
    }).catch(afficher);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
