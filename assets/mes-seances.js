/* Genesolia · Le Cercle · « Mes séances »
   1 séance de plus par mois d'abonnement, dans chaque cycle autorisé (cycle 1 seul pour l'offre « cycle1 », cycles 1 et 2 pour Le Cercle complet).
   La première ouverture vient après le point de départ : la page rappelle ce que la personne veut travailler et marque « Pour toi ».
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
      '<p>Tes séances s’ouvrent une par une, au fil des mois. Pour choisir la bonne, il faut savoir ce que tu veux travailler : ton point de départ te le montre en quinze minutes.</p>' +
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
      '<p class="ms-note">Les séances marquées « Pour toi » répondent à ce que tu vis. Celle de la saison est marquée « Ce mois-ci », et dans le cycle 2, celle de ton étape du suivi est marquée « Ton étape ». Le choix reste le tien. <a href="point-de-depart.html">Revoir mon point de départ</a></p></section>';
  }
  function etatCycle(cy) {
    if (!acces) return '';
    if (cyclesPermis().indexOf(cy) < 0) return '<p class="ms-etat">Ces séances sont incluses dans Le Cercle complet. <a href="abonnement.html">Découvrir Le Cercle complet</a></p>';
    var c = credits(cy), p = prochaine();
    if (!pdFait()) return '<p class="ms-etat">Tes séances s’ouvriront après ton point de départ.</p>';
    return '<p class="ms-etat">' + (c > 0 ? (c === 1 ? 'Tu peux ouvrir <b>1 séance</b> ce mois-ci.' : 'Tu peux ouvrir <b>' + c + ' séances</b>.') : 'Ta séance de ce mois est ouverte.') +
      (p ? ' Prochaine séance à ouvrir à partir du ' + dateCourte(p) + '.' : '') + '</p>';
  }
  function carte(s) {
    var permis = acces && cyclesPermis().indexOf(s.cycle) >= 0, ouverte = !!ouvertes[s.id], dispo = permis && !ouverte && pdFait() && credits(s.cycle) > 0;
    /* Cycle 2 : le suivi avance par étapes (mois d'abonnement, comme assets/site.js) ; la séance de l'étape en cours est mise en avant */
    var et = s.cycle === 2 && acces ? Math.min(moisDepuis(acces.cree_le), 12) : 0, cetEtape = et > 0 && s.mois === ORDRE[et - 1];
    var cetteSaison = et ? false : s.mois === new Date().getMonth() + 1, toi = pdFait() && permis && pourToi(s);
    var cls = 'ms-carte' + (ouverte ? ' ms-ouverte' : '') + (!permis ? ' ms-grise' : '') + (toi ? ' ms-toi' : '');
    var action;
    if (ouverte) action = '<button type="button" class="btn btn-plein" data-ecouter="' + s.id + '">Écouter</button>';
    else if (!acces) action = '<p class="ms-verrou">Réservée aux membres du Cercle</p>';
    else if (!permis) action = '<p class="ms-verrou">Incluse dans Le Cercle complet</p>';
    else if (!pdFait()) action = '<p class="ms-verrou">Après ton point de départ</p>';
    else if (dispo && choix === s.id) action = '<p class="ms-confirme">Tu ouvres cette séance pour ton mois en cours. Elle restera ouverte tant que tu es membre.</p><p class="ms-boutons"><button type="button" class="btn btn-plein" data-ouvrir="' + s.id + '">Oui, je l’ouvre</button> <button type="button" class="btn btn-trait" data-annuler>Choisir une autre</button></p>';
    else if (dispo) action = '<button type="button" class="btn btn-trait" data-choisir="' + s.id + '">Ouvrir cette séance</button>';
    else action = '<p class="ms-verrou">À ouvrir un prochain mois</p>';
    return '<article class="' + cls + '" id="seance-' + s.id + '">' +
      '<p class="ms-badges"><span class="ms-mois">' + esc(MOIS[s.mois - 1]) + '</span>' + (toi ? '<span class="ms-badge">Pour toi</span>' : '') + (cetteSaison ? '<span class="ms-badge ms-badge-saison">Ce mois-ci</span>' : '') + (cetEtape ? '<span class="ms-badge ms-badge-saison">Ton étape ' + et + '</span>' : '') + (ouverte ? '<span class="ms-badge ms-badge-ok">Ouverte</span>' : '') + '</p>' +
      '<h3>' + esc(s.titre) + '</h3>' + (s.sujet ? '<p class="ms-sujet">' + esc(s.sujet) + '</p>' : '') +
      '<p class="ms-voyage">' + esc(s.voyage) + '</p>' +
      (s.libere ? '<p class="ms-ligne"><span>Ce qu’elle libère</span>' + esc(s.libere) + '</p>' : '') +
      '<p class="ms-ligne"><span>' + (s.cycle === 1 ? 'Ce qui prend la place' : 'Ta ressource') + '</span>' + esc(s.place) + '</p>' +
      '<div class="ms-action">' + action + '</div><div class="ms-lecteur" data-lecteur="' + s.id + '"></div></article>';
  }
  function afficher() {
    var h = '<header class="ms-tete"><p class="ms-sur">Le Cercle</p><h1>Mes séances</h1>' +
      '<p>Chaque mois, tu ouvres une nouvelle séance audio : celle qui te parle le plus, selon ce que tu traverses. Elle reste à toi tant que tu es membre, pour l’écouter aussi souvent que tu veux.</p></header>';
    if (!user) h += '<section class="ms-encadre"><h2>Connecte-toi pour retrouver tes séances</h2><p><a class="btn btn-plein" href="login.html">Me connecter</a></p></section>';
    else if (!acces) h += '<section class="ms-encadre"><h2>Tes séances arrivent avec Le Cercle</h2><p>Les séances audio font partie de l’abonnement au Cercle. Tu peux les découvrir ci-dessous.</p><p><a class="btn btn-plein" href="abonnement.html">Découvrir Le Cercle</a></p></section>';
    else h += travail();
    if (!base) h += '<p class="ms-note ms-attente">L’ouverture des séances se met en place : elle sera disponible très bientôt.</p>';
    [1, 2].forEach(function (cy) {
      var C = CAT.cycles[cy] || {};
      var liste = CAT.liste.filter(function (s) { return s.cycle === cy; }).sort(function (a, b) { return ORDRE.indexOf(a.mois) - ORDRE.indexOf(b.mois); });
      h += '<section class="ms-cycle' + (acces && cyclesPermis().indexOf(cy) < 0 ? ' ms-cycle-grise' : '') + '"><h2>' + esc(C.titre) + '</h2><p class="ms-cycle-st">' + esc(C.sousTitre) + '</p>' + etatCycle(cy) +
        '<div class="ms-grille">' + liste.map(carte).join('') + '</div></section>';
    });
    h += '<p class="ms-mention">Ces séances proposent une démarche symbolique de développement personnel. Elles ne remplacent pas un accompagnement médical ou psychologique. Écoute-les au calme, jamais en conduisant.</p>';
    racine.innerHTML = h;
  }

  /* ───── Les actions ───── */
  function ouvrir(id, bouton) {
    bouton.disabled = true;
    sb.rpc('ouvrir_seance', { p_seance: id }).then(function (r) {
      var d = r && r.data;
      if (r.error || !d) { bouton.disabled = false; message(id, 'L’ouverture n’a pas marché. Réessaie dans un instant.'); return; }
      if (!d.ok) {
        var t = { mois: 'Tu as déjà ouvert ta séance de ce mois' + (d.prochaine ? ' : la prochaine s’ouvre à partir du ' + dateCourte(new Date(d.prochaine + 'T12:00:00')) : '') + '.', offre: 'Cette séance est incluse dans Le Cercle complet.', abonnement: 'Ton abonnement n’est plus actif.' }[d.erreur] || 'L’ouverture n’a pas marché.';
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
        if (d && d.url) { z.innerHTML = '<audio controls preload="metadata" src="' + esc(d.url) + '"></audio>'; var a = z.querySelector('audio'); if (a) a.play().catch(function () {}); return; }
        z.innerHTML = '<p class="ms-note">' + (d && d.bientot ? 'Ta séance est en cours d’enregistrement : elle sera là très bientôt, au même endroit.' : 'La séance ne s’ouvre pas pour l’instant. Recharge la page.') + '</p>';
      })
      .catch(function () { bouton.disabled = false; z.innerHTML = '<p class="ms-note">La séance ne s’ouvre pas pour l’instant. Recharge la page.</p>'; });
  }
  function message(id, t) { var z = racine.querySelector('[data-lecteur="' + id + '"]'); if (z) z.innerHTML = '<p class="ms-note">' + esc(t) + '</p>'; }
  racine.addEventListener('click', function (e) {
    var t = e.target;
    var c = t.closest('[data-choisir]'); if (c) { choix = c.getAttribute('data-choisir'); afficher(); var el = document.getElementById('seance-' + choix); if (el) el.querySelector('[data-ouvrir]').focus(); return; }
    if (t.closest('[data-annuler]')) { choix = ''; afficher(); return; }
    var o = t.closest('[data-ouvrir]'); if (o) { ouvrir(o.getAttribute('data-ouvrir'), o); return; }
    var l = t.closest('[data-ecouter]'); if (l) { ecouter(l.getAttribute('data-ecouter'), l); return; }
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
