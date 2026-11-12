/* Mon Espace Pro : tableau de bord privé de Laura (mon-bureau.html).
   Aucune IA : la page lit elle-même ses données à l'ouverture.
   Stockage : table Supabase public.qg_items (une ligne = { kind, data }), lisible seulement par les deux comptes de Laura.
   Copie sur l'appareil (localStorage) pour un affichage immédiat et pour garder ce qui n'a pas pu partir sans réseau. */
(function () {
  'use strict';
  var SB = 'https://qsvzzkjtjsznfntahvvh.supabase.co', CLE = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var JETON = 'sb-qsvzzkjtjsznfntahvvh-auth-token', CACHE = 'espace-pro-cache', ATTENTE = 'espace-pro-attente', ONGLET = 'espace-pro-onglet';
  var EMAILS = ['contact@genesolia.fr', 'lauradiaz5006@gmail.com'];

  /* ---------- Petits outils ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lienSur(u) { u = String(u || '').trim(); return /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : ''; }
  function lsLire(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsEcrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function uuid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function deIso(s) { var p = String(s).slice(0, 10).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function plusJours(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function lundi(d) { var j = (d.getDay() + 6) % 7; return plusJours(d, -j); }
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function dateLongue(d) { return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear(); }
  var MOIS_C = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function dateCourte(d) { return d.getDate() + ' ' + MOIS_C[d.getMonth()]; }
  var AUJ = new Date(), AUJ_ISO = iso(AUJ);
  var toastT;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('vu'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('vu'); }, 2200); }

  var MARQUES = { gen: 'Genesolia', bou: 'Boutique', str: 'STRAKARA', sev: 'Sève' };
  function pastille(m) { return MARQUES[m] ? '<span class="mq mq-' + m + '">' + MARQUES[m] + '</span>' : '<span class="mq mq-tout">Toutes</span>'; }
  function optionsMarques(sel, avecTout) {
    sel.innerHTML = (avecTout ? '<option value="tout">Toutes</option>' : '') + Object.keys(MARQUES).map(function (k) { return '<option value="' + k + '">' + MARQUES[k] + '</option>'; }).join('');
  }

  /* ---------- Session (même verrou que le site, pour ne jamais casser la connexion des autres onglets) ---------- */
  function lireSession() { try { return JSON.parse(localStorage.getItem(JETON) || 'null'); } catch (e) { return null; } }
  function valide(x) { return x && x.access_token && x.expires_at && x.expires_at * 1000 > Date.now() + 60000; }
  function session() {
    var x = lireSession();
    if (!x || !x.refresh_token) return Promise.resolve(valide(x) ? x : null);
    if (valide(x)) return Promise.resolve(x);
    function rafraichir() {
      var y = lireSession();
      if (!y || !y.refresh_token) return null;
      if (valide(y)) return y;
      return fetch(SB + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: CLE, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: y.refresh_token }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (n) {
          if (!n || !n.access_token) return null;
          n.expires_at = n.expires_at || Math.floor(Date.now() / 1000) + (n.expires_in || 3600);
          try { var z = lireSession(); if (z && z.refresh_token === y.refresh_token) localStorage.setItem(JETON, JSON.stringify(n)); } catch (e) {}
          return n;
        });
    }
    var p = (navigator.locks && navigator.locks.request) ? navigator.locks.request('lock:' + JETON, { mode: 'exclusive' }, rafraichir) : Promise.resolve().then(rafraichir);
    return p.catch(function () { return null; });
  }
  function entetes(s, plus) { var h = { apikey: CLE, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' }; for (var k in plus || {}) h[k] = plus[k]; return h; }

  /* ---------- Stockage ---------- */
  var S = { lignes: lsLire(CACHE, []), enLigne: false };
  function etat(t, cls) { var el = $('#sync'); el.className = 'ep-sync ' + (cls || ''); el.lastChild.textContent = t; }
  function memoriser() { lsEcrire(CACHE, S.lignes); }
  function file() { return lsLire(ATTENTE, []); }
  function enFile(op) { var f = file(); f.push(op); lsEcrire(ATTENTE, f); }
  function de(kind) { return S.lignes.filter(function (l) { return l.kind === kind; }); }
  function une(kind, test) { return S.lignes.filter(function (l) { return l.kind === kind && (!test || test(l.data || {})); })[0] || null; }
  function envoyer(op) {
    return session().then(function (s) {
      if (!s) throw new Error('session');
      if (op.op === 'del') return fetch(SB + '/rest/v1/qg_items?id=eq.' + encodeURIComponent(op.id), { method: 'DELETE', headers: entetes(s, { Prefer: 'return=minimal' }) });
      return fetch(SB + '/rest/v1/qg_items?on_conflict=id', { method: 'POST', headers: entetes(s, { Prefer: 'resolution=merge-duplicates,return=minimal' }), body: JSON.stringify([op.ligne]) });
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); });
  }
  function enregistrer(ligne) {
    ligne.maj = new Date().toISOString();
    if (!ligne.id) { ligne.id = uuid(); ligne.cree_le = ligne.maj; S.lignes.push(ligne); }
    memoriser();
    var op = { op: 'save', ligne: { id: ligne.id, kind: ligne.kind, data: ligne.data, cree_le: ligne.cree_le, maj: ligne.maj } };
    envoyer(op).then(function () { if (S.enLigne) etat('Enregistré'); }).catch(function () { enFile(op); etat('Gardé sur cet appareil', 'attente'); });
    return ligne;
  }
  function supprimer(ligne) {
    S.lignes = S.lignes.filter(function (l) { return l.id !== ligne.id; });
    memoriser();
    var op = { op: 'del', id: ligne.id };
    envoyer(op).catch(function () { enFile(op); etat('Gardé sur cet appareil', 'attente'); });
  }
  function viderFile() {
    var f = file(); if (!f.length) return Promise.resolve();
    var reste = [];
    return f.reduce(function (p, op) { return p.then(function () { return envoyer(op).catch(function () { reste.push(op); }); }); }, Promise.resolve())
      .then(function () { lsEcrire(ATTENTE, reste); });
  }
  function charger() {
    return session().then(function (s) {
      if (!s) { location.replace('/login.html'); throw new Error('session'); }
      var m = String((s.user && s.user.email) || '').toLowerCase();
      if (EMAILS.indexOf(m) < 0) { location.replace('/'); throw new Error('compte'); }
      return viderFile().then(function () {
        return fetch(SB + '/rest/v1/qg_items?select=id,kind,data,cree_le,maj&order=cree_le.asc&limit=5000', { headers: entetes(s) });
      });
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (rows) {
      S.lignes = rows || []; S.enLigne = true; memoriser();
      /* ce qui attend encore (sans réseau) reste visible */
      file().forEach(function (op) { if (op.op === 'save' && !S.lignes.some(function (l) { return l.id === op.ligne.id; })) S.lignes.push(op.ligne); });
      etat(file().length ? 'Gardé sur cet appareil' : 'À jour', file().length ? 'attente' : '');
    }).catch(function (e) {
      if (e && (e.message === 'session' || e.message === 'compte')) throw e;
      etat('Hors ligne', 'hors');
      var a = $('#alerte'); a.hidden = false;
      a.textContent = 'Ton espace n\'a pas pu être lu en ligne (réseau ou table qg_items absente). Tu vois la dernière copie de cet appareil ; ce que tu changes est gardé ici et partira à la prochaine ouverture.';
    });
  }

  /* ---------- 1. Aujourd'hui ---------- */
  var ROUTINE = [
    { id: 'r-0900', h: '9h00', m: 10, mq: 'tout', t: 'Récupérer les vidéos TikTok du jour (2 Genesolia, 1 STRAKARA) dans ta conversation Claude.' },
    { id: 'r-0930', h: '9h30', m: 10, mq: 'tout', t: 'Référencement : dans « À indexer », demander l\'indexation de 10 pages max par site dans Search Console (Genesolia, puis STRAKARA/Sève), et cliquer « Demandée » pour chaque page faite.', vers: 'indexer' },
    { id: 'r-0940', h: '9h40', m: 15, mq: 'tout', t: 'Prospection : valider les prospects Genesolia et STRAKARA dans Airtable (cocher « OK envoyer »).' },
    { id: 'r-1230', h: '12h30', m: 5, mq: 'tout', t: 'TikTok : publier la vidéo Genesolia A et la vidéo STRAKARA, en ajoutant le son.' },
    { id: 'r-1800', h: '18h00', m: 20, mq: 'tout', t: 'Notoriété : répondre aux commentaires et messages (TikTok, Instagram, Facebook, LinkedIn), 5 commentaires utiles sur LinkedIn.' },
    { id: 'r-2030', h: '20h30', m: 5, mq: 'gen', t: 'TikTok : publier la vidéo Genesolia B.' }
  ];
  var EN_PLUS = {
    1: { id: 'r-0935-lun', h: '9h30', m: 5, mq: 'tout', t: 'Lundi : Search Console > Pages, vérifier qu\'il n\'y a pas de nouvelle erreur ; soumettre à nouveau le sitemap s\'il n\'a pas été lu depuis 7 jours.' },
    3: { id: 'r-0935-mer', h: '9h30', m: 2, mq: 'gen', t: 'Mercredi : vérifier que le nouvel article est bien dans le sitemap, et le demander en premier.' }
  };
  function routine() { var r = ROUTINE.slice(), x = EN_PLUS[AUJ.getDay()]; if (x) r.splice(3, 0, x); return r; }
  var FOND = {
    1: { titre: 'Lundi : STRAKARA et chiffres', l: [{ mq: 'str', t: 'Publier les biens de la semaine dans le groupe LinkedIn.' }, { mq: 'tout', t: 'Noter les chiffres de la semaine (onglet Chiffres).', vers: 'chiffres' }] },
    2: { titre: 'Mardi : Sève', l: [{ mq: 'sev', t: '1 post Instagram/Facebook (avant/après ou ambiance).' }, { mq: 'sev', t: 'Le partager dans 1 groupe Facebook de commerçants locaux.' }] },
    3: { titre: 'Mercredi : Genesolia et STRAKARA', l: [{ mq: 'gen', t: '1 nouvel article ou une nouvelle page (SEO).' }, { mq: 'str', t: '1 post dans 2 groupes Facebook maximum.' }] },
    4: { titre: 'Jeudi : Sève et STRAKARA', l: [{ mq: 'sev', t: 'Contacter 5 commerces locaux (instituts, restaurants, boutiques).' }, { mq: 'str', t: 'Contacter 3 hébergeurs potentiels.' }] },
    5: { titre: 'Vendredi : Boutique et Genesolia', l: [{ mq: 'bou', t: '1 post produit sur Instagram.' }, { mq: 'bou', t: 'Vérifier Etsy : messages, avis, statistiques.' }, { mq: 'gen', t: 'Une question à la communauté en vidéo TikTok.' }] },
    6: { titre: 'Samedi : 20 minutes, pas plus', l: [{ mq: 'tout', t: 'Répondre aux messages.' }, { mq: 'tout', t: '1 story par marque.' }] },
    0: { titre: 'Dimanche : repos', l: [] }
  };
  function itemsDuJour() {
    var j = AUJ.getDay(), f = FOND[j], liste = [];
    if (j >= 1 && j <= 5) liste = routine();
    f.l.forEach(function (x, i) { liste.push({ id: 'f-' + j + '-' + i, mq: x.mq, t: x.t, vers: x.vers, fond: true }); });
    return liste;
  }
  function ligneCoches() { return une('coche', function (d) { return d.date === AUJ_ISO; }); }
  function coches() { var l = ligneCoches(); return (l && l.data.ids) || []; }
  function basculer(id, on) {
    var l = ligneCoches() || { kind: 'coche', data: { date: AUJ_ISO, ids: [] } };
    var ids = (l.data.ids || []).filter(function (x) { return x !== id; }); if (on) ids.push(id);
    l.data = { date: AUJ_ISO, ids: ids }; enregistrer(l);
  }
  function minutes(h) { var p = h.replace('h', ':').split(':'); return +p[0] * 60 + (+p[1] || 0); }
  function liCoche(it, fait, maintenant) {
    var id = 'c-' + it.id;
    return '<li class="' + (fait ? 'fait' : '') + (maintenant ? ' maintenant' : '') + '"><input type="checkbox" id="' + id + '" data-coche="' + esc(it.id) + '"' + (fait ? ' checked' : '') + '>' +
      '<div class="tx"><div class="meta">' + (it.h ? '<span class="h">' + it.h + '</span><span class="duree">' + it.m + ' min</span>' : '') + pastille(it.mq) + '</div>' +
      '<label for="' + id + '">' + esc(it.t) + '</label>' + (it.vers ? '<a href="#' + it.vers + '" data-aller="' + it.vers + '" class="ep-discret" style="display:inline-block;font-weight:700;color:#9A3A68">Ouvrir</a>' : '') + '</div></li>';
  }
  function rendreAujourdhui() {
    var j = AUJ.getDay(), faits = coches(), items = itemsDuJour(), maint = AUJ.getHours() * 60 + AUJ.getMinutes();
    var prochain = null;
    routine().forEach(function (it) { if (!prochain && j >= 1 && j <= 5 && faits.indexOf(it.id) < 0 && minutes(it.h) + it.m >= maint - 60) prochain = it; });
    if (j >= 1 && j <= 5) {
      $('#routine-titre').textContent = 'La routine du ' + JOURS[j];
      $('#routine').innerHTML = routine().map(function (it) { return liCoche(it, faits.indexOf(it.id) >= 0, prochain === it); }).join('');
    } else {
      $('#routine-titre').textContent = j === 6 ? 'Samedi léger' : 'Jour de repos';
      $('#routine').innerHTML = '<li class="ep-repos" style="display:block"><b>' + (j === 6 ? 'Pas de routine aujourd\'hui' : 'Repos') + '</b><span class="ep-discret">' + (j === 6 ? '20 minutes suffisent : regarde l\'action de fond à côté.' : 'Rien à publier. La semaine reprend demain à 9h.') + '</span></li>';
    }
    var f = FOND[j];
    $('#fond-titre').textContent = f.titre;
    $('#fond').innerHTML = f.l.length ? items.filter(function (i) { return i.fond; }).map(function (it) { return liCoche(it, faits.indexOf(it.id) >= 0, false); }).join('') : '<li class="ep-vide" style="display:block">Rien de prévu. Profite.</li>';
    /* mes tâches */
    var taches = de('tache').filter(function (l) { return l.data.date === AUJ_ISO; });
    $('#taches').innerHTML = taches.length ? taches.map(function (l) {
      var id = 't-' + l.id;
      return '<li class="' + (l.data.fait ? 'fait' : '') + '"><input type="checkbox" id="' + id + '" data-tache="' + esc(l.id) + '"' + (l.data.fait ? ' checked' : '') + '><div class="tx"><div class="meta">' + pastille(l.data.marque) + '</div><label for="' + id + '">' + esc(l.data.texte) + '</label></div><button class="ep-suppr" type="button" data-suppr-tache="' + esc(l.id) + '" aria-label="Supprimer">&times;</button></li>';
    }).join('') : '<li class="ep-vide" style="display:block">Aucune tâche en plus. Ajoute-en une si besoin.</li>';
    var hier = de('tache').filter(function (l) { return l.data.date < AUJ_ISO && !l.data.fait; });
    var ph = $('#taches-hier');
    if (hier.length) { ph.innerHTML = hier.length + ' tâche' + (hier.length > 1 ? 's' : '') + ' des jours passés pas cochée' + (hier.length > 1 ? 's' : '') + '. <button class="bt clair mini" type="button" id="reporter">Les reporter à aujourd\'hui</button>'; }
    else ph.textContent = '';
    /* en-tête */
    var total = items.length + taches.length, fait = items.filter(function (i) { return faits.indexOf(i.id) >= 0; }).length + taches.filter(function (l) { return l.data.fait; }).length;
    $('#r-fait').textContent = fait + '/' + total;
    $('#r-jauge').style.width = (total ? Math.round(fait / total * 100) : 0) + '%';
    var suiv = prochain ? prochain.h + ' · ' + prochain.t : (items.filter(function (i) { return faits.indexOf(i.id) < 0; })[0] || {}).t;
    $('#r-suivant').innerHTML = '<small>' + (prochain ? 'Ensuite' : 'Reste à faire') + '</small><span>' + esc(suiv || (j === 0 ? 'Repos. À demain.' : 'Tout est fait. Belle journée.')) + '</span>';
  }

  /* ---------- 2. À indexer ---------- */
  var SITES = {
    gen: { nom: 'Genesolia', plan: '/sitemap.xml', console: 'https://search.google.com/search-console?resource_id=sc-domain%3Agenesolia.fr', propriete: 'sc-domain:genesolia.fr' },
    str: { nom: 'STRAKARA', plan: 'https://www.strakara.fr/sitemap.xml', console: 'https://search.google.com/search-console?resource_id=sc-domain%3Astrakara.fr', propriete: 'sc-domain:strakara.fr' }
  };
  /* Pages à demander, dans cet ordre, par site (tri fait à partir des rapports Search Console du 8 nov. 2026 : on a retiré
     les actualités, les mentions légales, les prénoms, les anciennes adresses sans .html et les fiches espace dynamiques).
     Le plan du site ne sert plus qu'à repérer les pages NOUVELLES ou modifiées depuis moins de 14 jours. */
  var PRIORITE = {
    gen: [
      'https://genesolia.fr/synchronicite-jung-psychologie.html',
      'https://genesolia.fr/chiffres-prenoms-dates-qui-reviennent.html',
      'https://genesolia.fr/synchronicite-ou-coincidence-difference.html',
      'https://genesolia.fr/synchronicites-familiales-generations.html',
      'https://genesolia.fr/carnet-synchronicites-methode.html',
      'https://genesolia.fr/annee-personnelle-2027.html',
      'https://genesolia.fr/annee-personnelle-1-en-2027.html',
      'https://genesolia.fr/annee-personnelle-2-en-2027.html',
      'https://genesolia.fr/annee-personnelle-3-en-2027.html',
      'https://genesolia.fr/annee-personnelle-4-en-2027.html',
      'https://genesolia.fr/annee-personnelle-5-en-2027.html',
      'https://genesolia.fr/annee-personnelle-6-en-2027.html',
      'https://genesolia.fr/annee-personnelle-7-en-2027.html',
      'https://genesolia.fr/annee-personnelle-8-en-2027.html',
      'https://genesolia.fr/annee-personnelle-9-en-2027.html',
      'https://genesolia.fr/arbre-de-vie-arbre-genealogique-genosociogramme.html',
      'https://genesolia.fr/conflits-avec-ses-parents.html',
      'https://genesolia.fr/enfant-de-remplacement.html',
      'https://genesolia.fr/loyaute-familiale-invisible.html',
      'https://genesolia.fr/grands-symboles-des-reves.html',
      'https://genesolia.fr/jung-reves-archetypes.html',
      'https://genesolia.fr/informations-avant-genosociogramme.html',
      'https://genesolia.fr/cartes.html',
      'https://genesolia.fr/lettre-du-mois.html',
      'https://genesolia.fr/lettre-dans-un-an.html',
      'https://genesolia.fr/ciel-janvier-2027.html',
      'https://genesolia.fr/ciel-fevrier-2027.html'
    ],
    str: [
      'https://www.strakara.fr/blog/stocker-palettes-valence-a7-vallee-du-rhone.html',
      'https://www.strakara.fr/blog/palettes-valeur-valence-bunker-securise.html',
      'https://www.strakara.fr/blog/stockage-palettes-lyon-est-aeroport-saint-exupery.html',
      'https://www.strakara.fr/blog/dimensionner-stockage-palettes-racks-10-a-500.html',
      'https://www.strakara.fr/blog/stockage-palettes-bordeaux-nord-est-a89-a10.html',
      'https://www.strakara.fr/blog/entrepot-isole-chauffe-quelles-marchandises-bordeaux.html',
      'https://www.strakara.fr/blog/stockage-palettes-centre-bretagne-moreac-pontivy.html',
      'https://www.strakara.fr/blog/choisir-formule-stockage-palettes-entrepot-racke-moreac.html',
      'https://www.strakara.fr/espaces/stockage-palette-bourg-les-valence.html',
      'https://www.strakara.fr/espaces/stockage-palettes-saint-laurent-de-mure.html',
      'https://www.strakara.fr/espaces/stockage-palettes-saint-sulpice-et-cameyrac-33.html',
      'https://www.strakara.fr/espaces/stockage-palettes-moreac.html',
      'https://www.strakara.fr/espaces/stockage-palette-tours.html',
      'https://www.strakara.fr/blog/combien-de-palettes-entrepot-300-m2-tours.html',
      'https://www.strakara.fr/blog/choisir-entrepot-stockage-palettes-tours-criteres.html',
      'https://www.strakara.fr/blog/stocker-palettes-indre-et-loire-cas-concrets.html',
      'https://www.strakara.fr/blog/stockage-professionnel-tours-entrepot-flexible-palettes.html',
      'https://www.strakara.fr/espaces/cellules-activite-tours-37.html',
      'https://www.strakara.fr/espaces/cellules-activite-tours-chartres.html',
      'https://www.strakara.fr/espaces/cellules-activite-chartres-perche-28.html',
      'https://www.strakara.fr/blog/espace-stockage-champigny-sur-marne.html',
      'https://www.strakara.fr/blog/securite-vol-entrepot-espace-partage-camera.html',
      'https://www.strakara.fr/blog/grand-compte-deploiement-regional-espace-professionnel.html',
      'https://www.strakara.fr/blog/co-stockage-paris-ile-de-france.html',
      'https://www.strakara.fr/blog/guide-stockage-professionnel-morangis-essonne.html',
      'https://www.strakara.fr/blog/bureau-entrepot-partage-professionnel.html',
      'https://www.strakara.fr/blog/stockage-professionnel-rennes.html',
      'https://www.strakara.fr/blog/espace-flexible-stockage-activite-valence.html',
      'https://www.strakara.fr/blog/stockage-professionnel-bordeaux-guide-2026.html',
      'https://www.strakara.fr/blog/choisir-entrepot-stockage.html',
      'https://www.strakara.fr/blog/cout-espace-stockage-professionnel-france.html',
      'https://www.strakara.fr/blog/prix-location-entrepot-2026.html',
      'https://www.strakara.fr/blog/stockage-sans-caution-empreinte-bancaire-swikly.html',
      'https://www.strakara.fr/blog/stockage-professionnel-sans-bail-commercial.html',
      'https://www.strakara.fr/blog/rentabiliser-entrepot-partiellement-vide.html',
      'https://www.strakara.fr/blog/location-entrepot-seine-et-marne-77-stockage-professionnel-flexible.html',
      'https://www.strakara.fr/blog/self-stockage-vs-espace-pro-strakara.html',
      'https://www.strakara.fr/blog/stockage-saisonnier-professionnel-france.html',
      'https://www.strakara.fr/blog/transition-locaux-stockage-temporaire-pme.html',
      'https://www.strakara.fr/blog/atelier-professionnel-brest-flexible.html',
      'https://www.strakara.fr/blog/charges-fixes-espace-professionnel-sous-utilise.html',
      'https://www.strakara.fr/blog/chef-projet-base-operationnelle-temporaire.html',
      'https://www.strakara.fr/blog/co-stockage-entrepot-partage-professionnel.html',
      'https://www.strakara.fr/blog/diviser-espace-professionnel-500m2-hebergeur.html',
      'https://www.strakara.fr/blog/immobilier-professionnel-flexible.html',
      'https://www.strakara.fr/blog/locaux-professionnels-trop-petits-entreprise.html',
      'https://www.strakara.fr/blog/photos-espace-stockage-professionnel-annonce.html',
      'https://www.strakara.fr/blog/prestataire-itinerant-depot-professionnel.html',
      'https://www.strakara.fr/caution-swikly.html',
      'https://www.strakara.fr/checklist-stockage-professionnel.html',
      'https://www.strakara.fr/devenir-partenaire-affaires.html'
    ]
  };
  function rangPrio(cle, url) { return (PRIORITE[cle] || []).indexOf(url); }
  var IX = { gen: { etat: 'charge', urls: [], voir: 10 }, str: { etat: 'charge', urls: [], voir: 10 } };
  function lirePlan(cle) {
    var site = SITES[cle];
    return fetch(site.plan, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (t) {
      var doc = new DOMParser().parseFromString(t, 'application/xml');
      if (doc.getElementsByTagName('parsererror').length) throw new Error('xml');
      var u = Array.prototype.map.call(doc.getElementsByTagName('url'), function (n, i) {
        var loc = n.getElementsByTagName('loc')[0], lm = n.getElementsByTagName('lastmod')[0];
        return { url: loc ? loc.textContent.trim() : '', lastmod: lm ? lm.textContent.trim().slice(0, 10) : '', ordre: i };
      }).filter(function (x) { return /^https?:\/\//.test(x.url); });
      IX[cle].etat = 'ok'; IX[cle].urls = u;
    }).catch(function () { IX[cle].etat = 'erreur'; });
  }
  function marques() { var m = {}; de('indexe').forEach(function (l) { var d = l.data; if (!m[d.url] || m[d.url].le < d.le) m[d.url] = { le: d.le, ligne: l }; }); return m; }
  function aIndexer(cle) {
    var m = marques(), limite14 = iso(plusJours(AUJ, -14)), limite30 = iso(plusJours(AUJ, -30));
    var vus = {}, tous = IX[cle].urls.slice();
    tous.forEach(function (u) { vus[u.url] = 1; });
    (PRIORITE[cle] || []).forEach(function (url, i) { if (!vus[url]) tous.push({ url: url, lastmod: '', ordre: 9000 + i }); });   /* page choisie mais absente du plan : on la garde */
    return tous.filter(function (u) {
      var k = m[u.url], choisie = rangPrio(cle, u.url) >= 0, recente = u.lastmod && u.lastmod >= limite14 && u.lastmod <= AUJ_ISO;
      if (!choisie && !recente) return false;               /* ni choisie, ni nouvelle : on n'en parle pas */
      if (!k) return true;                                   /* jamais demandée */
      if (k.le >= limite30) return false;                   /* demandée il y a moins de 30 jours */
      return u.lastmod && u.lastmod >= limite14 && u.lastmod > k.le;   /* modifiée récemment depuis la dernière demande */
    }).sort(function (a, b) {
      var ra = rangPrio(cle, a.url), rb = rangPrio(cle, b.url);
      if (ra >= 0 || rb >= 0) return (ra < 0 ? 999 : ra) - (rb < 0 ? 999 : rb);
      return (b.lastmod || '').localeCompare(a.lastmod || '') || a.ordre - b.ordre;
    });
  }
  function rendreIndex(cle) {
    var box = $('#ix-' + cle), site = SITES[cle], st = IX[cle];
    var tete = '<div class="ix-tete"><div><span class="ep-etiq">' + (cle === 'gen' ? 'genesolia.fr' : 'strakara.fr') + '</span><h3 style="margin:0">' + site.nom + '</h3></div><a class="bt clair mini" href="' + site.console + '" target="_blank" rel="noopener">Search Console</a></div>';
    if (st.etat === 'charge') { box.innerHTML = tete + '<p class="ep-vide">Lecture du plan du site…</p>'; return; }
    if (st.etat === 'erreur') { box.innerHTML = tete + '<p class="ep-vide">Le plan du site n\'a pas pu être lu' + (cle === 'str' ? ' (strakara.fr n\'autorise peut-être pas encore genesolia.fr à le lire, ou pas de réseau)' : '') + '. Ouvre directement Search Console, ou réessaie plus tard. <button class="bt clair mini" type="button" data-relire="' + cle + '">Réessayer</button></p>'; return; }
    var liste = aIndexer(cle), m = marques(), lim14 = iso(plusJours(AUJ, -14));
    var duJour = Object.keys(m).filter(function (u) { return m[u].le === AUJ_ISO && st.urls.some(function (x) { return x.url === u; }); }).length;
    var mois = Object.keys(m).filter(function (u) { return m[u].le >= iso(plusJours(AUJ, -30)) && st.urls.some(function (x) { return x.url === u; }); }).length;
    var html = tete + '<div class="ix-compte"><span><b>' + liste.length + '</b>à demander</span><span><b>' + duJour + '/10</b>aujourd\'hui</span><span><b>' + mois + '</b>sur 30 jours</span><span><b>' + st.urls.length + '</b>pages au plan</span></div>' +
      '<div class="ix-quota"><i style="width:' + Math.min(100, duJour * 10) + '%"></i></div>';
    if (!liste.length) html += '<p class="ep-vide">Tout est demandé. Rien à faire ici aujourd\'hui.</p>';
    else {
      html += '<ul class="ix">' + liste.slice(0, st.voir).map(function (u) {
        var court = u.url.replace(/^https?:\/\/[^\/]+/, '') || '/';
        var neuf = u.lastmod && u.lastmod >= lim14;
        var insp = 'https://search.google.com/search-console/inspect?resource_id=' + encodeURIComponent(site.propriete) + '&id=' + encodeURIComponent(u.url);
        return '<li><div class="u">' + (rangPrio(cle, u.url) >= 0 && rangPrio(cle, u.url) < ({ gen: 10, str: 8 })[cle] ? '<span class="nouv">Priorité</span> ' : '') + '<a href="' + esc(insp) + '" target="_blank" rel="noopener" title="Inspecter dans Search Console">' + esc(court) + '</a><small>' + (u.lastmod ? (neuf ? '<span class="nouv">Modifiée le ' + esc(dateCourte(deIso(u.lastmod))) + '</span>' : 'Modifiée le ' + esc(dateCourte(deIso(u.lastmod)))) : 'Sans date') + (m[u.url] ? ' · demandée le ' + esc(dateCourte(deIso(m[u.url].le))) : ' · jamais demandée') + '</small></div>' +
          '<div class="act"><button class="bt clair mini" type="button" data-copier="' + esc(u.url) + '">Copier</button><button class="bt mini" type="button" data-demandee="' + esc(u.url) + '"' + (duJour >= 10 ? ' title="10 déjà demandées aujourd\'hui"' : '') + '>Demandée</button></div></li>';
      }).join('') + '</ul>';
      if (liste.length > st.voir) html += '<p style="text-align:center;margin:.6rem 0 0"><button class="bt clair mini" type="button" data-plus="' + cle + '">Voir plus (' + (liste.length - st.voir) + ')</button></p>';
    }
    if (duJour >= 10) html += '<p class="ep-discret">Les 10 demandes du jour sont faites pour ' + site.nom + '. La suite demain.</p>';
    box.innerHTML = html;
  }
  function rendreIndexTout() {
    rendreIndex('gen'); rendreIndex('str');
    var n = (IX.gen.etat === 'ok' ? aIndexer('gen').length : 0) + (IX.str.etat === 'ok' ? aIndexer('str').length : 0);
    var pret = IX.gen.etat !== 'charge' && IX.str.etat !== 'charge';
    $('#r-index').textContent = pret ? n : '…';
    var p = $('#p-index'); p.hidden = !pret || !n; p.textContent = n > 99 ? '99+' : n;
  }
  function copier(t) {
    function ok() { toast('Adresse copiée'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, secours); else secours();
    function secours() { var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Copie impossible : appuie longuement sur le lien'); } a.remove(); }
  }

  /* ---------- 3. Chiffres ---------- */
  var STATS = [
    ['comptes', 'Comptes créés'], ['cercle_actifs', 'Le Cercle, accès actifs'], ['spirale_actifs', 'Ma spirale, accès actifs'], ['essais_cercle', 'Essais du Cercle demandés'],
    ['newsletter', 'Inscrites à la newsletter'], ['contacts', 'Contacts'], ['demandes', 'Demandes reçues'], ['achats', 'Paiements Stripe'],
    ['commandes_boutique', 'Commandes boutique payées'], ['cartes_cadeaux', 'Cartes cadeaux payées'], ['tests_faits', 'Tests faits sur le site'], ['arbres', 'Arbres enregistrés'],
    ['carnets', 'Carnets remplis'], ['formation', 'Inscrites à la formation'], ['notifications', 'Appareils abonnés aux rappels'], ['praticiens', 'Praticien·nes']
  ];
  var RESEAUX_CH = [
    ['tt_gen', 'gen', 'TikTok'], ['ig_gen', 'gen', 'Instagram'], ['fb_gen', 'gen', 'Facebook'],
    ['tt_str', 'str', 'TikTok'], ['li_laura', 'tout', 'LinkedIn Laura'], ['li_str', 'str', 'Page LinkedIn'], ['fb_str', 'str', 'Facebook'],
    ['ig_sev', 'sev', 'Instagram'], ['etsy_mois', 'bou', 'Etsy, ventes du mois'],
    ['umami_gen', 'gen', 'Umami, visiteurs semaine'], ['umami_str', 'str', 'Umami, visiteurs semaine'],
    ['dem_str', 'str', 'Demandes'], ['dem_sev', 'sev', 'Demandes'], ['essais_spirale', 'gen', 'Essais Ma spirale']
  ];
  function chargerStats() {
    var box = $('#stats'); box.innerHTML = '<p class="ep-vide">Lecture…</p>';
    session().then(function (s) {
      if (!s) throw new Error('session');
      return fetch(SB + '/rest/v1/rpc/qg_stats', { method: 'POST', headers: entetes(s), body: '{}' });
    }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
      box.innerHTML = STATS.filter(function (x) { return d[x[0]]; }).map(function (x) {
        var v = d[x[0]];
        return '<div class="st"><small>' + esc(x[1]) + '</small><b>' + esc(v.total) + '</b><em class="' + (v.j7 > 0 ? 'plus' : '') + '">+' + esc(v.j7) + ' en 7 j</em> <em>· +' + esc(v.j30) + ' en 30 j</em>' + (v.non_lues ? '<em style="display:block;color:#8A5A12;font-weight:700">' + esc(v.non_lues) + ' non lues</em>' : '') + '</div>';
      }).join('');
      $('#stats-info').textContent = 'Mis à jour le ' + dateLongue(new Date()) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + '. Seulement des nombres, aucune donnée personnelle.';
    }).catch(function () {
      box.innerHTML = '<p class="ep-vide">Les chiffres du site ne sont pas disponibles pour le moment (réseau, ou fonction qg_stats pas encore installée).</p>';
    });
  }
  var semCh = lundi(AUJ);
  function ligneSemaine(d) { var k = iso(d); return une('chiffres', function (x) { return x.semaine === k; }); }
  function historique(cle) {
    return de('chiffres').map(function (l) { return { s: l.data.semaine, v: l.data.v && l.data.v[cle] }; })
      .filter(function (x) { return x.v !== '' && x.v != null && !isNaN(+x.v); }).sort(function (a, b) { return a.s.localeCompare(b.s); });
  }
  function courbe(pts) {
    if (pts.length < 2) return '<svg viewBox="0 0 120 28" aria-hidden="true"><line x1="0" y1="20" x2="120" y2="20" stroke="#EFDCE3" stroke-width="1.5" stroke-dasharray="3 4"/></svg>';
    pts = pts.slice(-12);
    var vs = pts.map(function (p) { return +p.v; }), mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs), et = mx - mn || 1;
    var c = vs.map(function (v, i) { return [(i / (vs.length - 1) * 116 + 2).toFixed(1), (24 - (v - mn) / et * 20).toFixed(1)]; });
    var d = c.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
    var dernier = c[c.length - 1];
    return '<svg viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + ' L118 28 L2 28 Z" fill="rgba(185,138,85,.12)"/><path d="' + d + '" fill="none" stroke="#B98A55" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="' + dernier[0] + '" cy="' + dernier[1] + '" r="2.4" fill="#3B1747"/></svg>';
  }
  function nombre(n) { return (+n).toLocaleString('fr-FR'); }
  function rendreChiffres() {
    $('#ch-liste').innerHTML = RESEAUX_CH.map(function (x) {
      var h = historique(x[0]), dern = h[h.length - 1], prec = h[h.length - 2];
      var ev = '', cls = 'z';
      if (dern && prec) { var dv = +dern.v - +prec.v; ev = (dv > 0 ? '+' : dv < 0 ? '−' : '±') + nombre(Math.abs(dv)); cls = dv > 0 ? 'p' : dv < 0 ? 'm' : 'z'; }
      else if (dern) ev = '1re semaine';
      else ev = 'à noter';
      return '<div class="ch"><span class="nom">' + pastille(x[1]) + esc(x[2]) + '</span>' + courbe(h) + '<span class="val">' + (dern ? nombre(dern.v) : '–') + '</span><span class="ev ' + cls + '">' + esc(ev) + '</span></div>';
    }).join('');
    var l = ligneSemaine(semCh), v = (l && l.data.v) || {};
    $('#sem-titre').textContent = 'Semaine du ' + dateCourte(semCh);
    $('#sem-ap').disabled = iso(semCh) >= iso(lundi(AUJ));
    $('#ch-form').innerHTML = RESEAUX_CH.map(function (x) {
      return '<label class="ep-champ"><span>' + (MARQUES[x[1]] ? MARQUES[x[1]] + ' · ' : '') + esc(x[2]) + '</span><input type="number" inputmode="numeric" min="0" step="1" name="' + x[0] + '" value="' + esc(v[x[0]] != null ? v[x[0]] : '') + '"></label>';
    }).join('');
    $('#ch-ok').textContent = l ? 'Déjà notée, tu peux corriger.' : '';
  }

  /* ---------- 4. Mes posts ---------- */
  var RESEAUX = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Etsy', 'YouTube', 'Google', 'Autre'];
  var CANAUX = { gen: ['Instagram', 'Facebook', 'TikTok'], bou: ['Instagram', 'Etsy'], str: ['LinkedIn', 'Facebook', 'TikTok'], sev: ['Instagram', 'Facebook'] };
  var semPt = lundi(AUJ);
  function rendrePosts() {
    var fin = plusJours(semPt, 6);
    $('#pt-titre').textContent = dateCourte(semPt) + ' – ' + dateCourte(fin);
    var posts = de('post');
    var html = '';
    for (var i = 0; i < 7; i++) {
      var d = plusJours(semPt, i), k = iso(d);
      var duJour = posts.filter(function (p) { return p.data.date === k; }).sort(function (a, b) { return (a.data.marque || '').localeCompare(b.data.marque || ''); });
      html += '<div class="pt-jour' + (k === AUJ_ISO ? ' auj' : '') + '"><h4>' + JOURS[d.getDay()].slice(0, 3) + '. ' + d.getDate() + '</h4>' +
        (duJour.length ? duJour.map(function (p) {
          var pub = p.data.statut === 'Publié';
          return '<button type="button" class="pt' + (pub ? ' publie' : '') + '" data-post="' + esc(p.id) + '"><span class="l1">' + pastille(p.data.marque) + '<span class="stt">' + (pub ? 'Publié' : 'Prévu') + '</span></span><span class="rs">' + esc(p.data.reseau) + '</span><span class="sj">' + esc(p.data.sujet) + '</span></button>';
        }).join('') : '<span class="ep-discret" style="margin:0">–</span>') + '</div>';
    }
    $('#pt-jours').innerHTML = html;
    /* canaux silencieux : dernier « Publié » par marque et réseau */
    var lim = iso(plusJours(AUJ, -7)), silences = [];
    Object.keys(CANAUX).forEach(function (m) {
      CANAUX[m].forEach(function (r) {
        var der = posts.filter(function (p) { return p.data.marque === m && p.data.reseau === r && p.data.statut === 'Publié' && p.data.date <= AUJ_ISO; }).map(function (p) { return p.data.date; }).sort().pop();
        if (!der || der <= lim) silences.push({ m: m, r: r, der: der });
      });
    });
    $('#silence').innerHTML = silences.length ? silences.map(function (s) { return '<li><b>' + MARQUES[s.m] + '</b> · ' + esc(s.r) + (s.der ? ' (dernier le ' + esc(dateCourte(deIso(s.der))) + ')' : ' (rien de noté)') + '</li>'; }).join('') : '<li style="background:#EEF6EF;color:#2F7A45">Tous tes canaux ont parlé cette semaine.</li>';
    var p = $('#p-silence'); p.hidden = !silences.length; p.textContent = silences.length;
  }
  function formPost(l) {
    var f = $('#f-post');
    f.id.value = l ? l.id : '';
    f.date.value = l ? l.data.date : (iso(semPt) <= AUJ_ISO && AUJ_ISO <= iso(plusJours(semPt, 6)) ? AUJ_ISO : iso(semPt));
    f.marque.value = l ? l.data.marque : 'gen';
    f.reseau.value = l ? l.data.reseau : 'Instagram';
    f.statut.value = l ? l.data.statut : 'Prévu';
    f.sujet.value = l ? l.data.sujet : '';
    f.lien.value = l ? (l.data.lien || '') : '';
    $('#pt-f-etiq').textContent = l ? 'Modifier le post' : 'Nouveau post';
    $('#pt-ok').textContent = l ? 'Enregistrer' : 'Ajouter';
    $('#pt-annuler').hidden = $('#pt-suppr').hidden = !l;
    var lien = l && lienSur(l.data.lien);
    var ex = $('#pt-lien-ouvrir'); if (ex) ex.remove();
    if (lien) { var a = document.createElement('a'); a.id = 'pt-lien-ouvrir'; a.className = 'bt clair'; a.href = lien; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Ouvrir le lien'; $('#pt-suppr').after(a); }
  }

  /* ---------- 5. Plan du mois ---------- */
  var MOIS_LISTE = [
    { id: 'm-chiffres', mq: 'tout', t: 'Le 1er : relire les chiffres du mois (onglet Chiffres).' },
    { id: 'm-themes', mq: 'tout', t: 'Le 1er : choisir 3 thèmes du mois pour chaque marque.' },
    { id: 'm-visuels', mq: 'tout', t: 'Le 20 : préparer les visuels du mois suivant.' },
    { id: 'm-avis-str', mq: 'str', t: 'Demander 2 avis Google à des clients STRAKARA.' },
    { id: 'm-avis-sev', mq: 'sev', t: 'Demander 2 avis Google à des clients Sève.' },
    { id: 'm-part-gen', mq: 'gen', t: '1 partenariat Genesolia (praticien·ne, école, créatrice).' },
    { id: 'm-part-bou', mq: 'bou', t: '1 partenariat Boutique (créatrice, boutique, influenceuse).' },
    { id: 'm-part-str', mq: 'str', t: '1 partenariat STRAKARA (transport, logistique, réseau d\'entreprises).' },
    { id: 'm-part-sev', mq: 'sev', t: '1 partenariat Sève (artisan, décoratrice, commerçant local).' },
    { id: 'm-news', mq: 'gen', t: 'Envoyer la newsletter Genesolia du mois.' }
  ];
  var CALENDRIER = [
    { mois: [10, 11], quand: 'Novembre – décembre', titre: 'Noël', l: ['Ma spirale : 7 jours offerts, puis 4,99 € par mois (offre de Noël).', 'Boutique : idées cadeaux, mettre en avant les affiches et les livrets.', 'Gelato : vérifier les dates limites de commande pour une livraison avant Noël, et les afficher.', 'STRAKARA : stockage temporaire de fin d\'année pour l\'e-commerce.'] },
    { mois: [0], quand: 'Janvier', titre: 'Nouvelle année, intentions', l: ['Genesolia : intentions de l\'année, année personnelle 2027, Le Cercle.', 'Sève : repenser son espace pour la nouvelle année.', 'STRAKARA : entreprises qui réorganisent leurs stocks après les fêtes.'] },
    { mois: [1], quand: 'Février', titre: 'Saint-Valentin', l: ['Genesolia : schémas amoureux, choix amoureux et lignée.', 'Boutique : cadeaux de couple (affiche « Notre famille »).', 'Sève : ambiance des restaurants et instituts pour la Saint-Valentin.'] },
    { mois: [2, 3], quand: 'Mars – avril', titre: 'Printemps', l: ['Sève : nouvelle saison, nouvelle ambiance pour les boutiques.', 'STRAKARA : stocks de saison, artisans et ateliers.', 'Genesolia : renouveau, fête des grands-mères (début mars).'] },
    { mois: [4, 5], quand: 'Mai – juin', titre: 'Fêtes des mères et des pères', l: ['Boutique : arbre imprimé et livre de famille à offrir.', 'Genesolia : la place dans la lignée, mères et pères.'] },
    { mois: [8], quand: 'Septembre', titre: 'Rentrée', l: ['Les quatre marques : nouveaux rendez-vous, nouvelle routine.', 'STRAKARA : rentrée des entreprises, besoins d\'espace.', 'Sève : préparer les commerces pour la fin d\'année.'] },
    { mois: [9], quand: 'Octobre – 1er novembre', titre: 'Toussaint', l: ['Genesolia : ancêtres et mémoire familiale.', 'Boutique : préparer les visuels de Noël avant le 20 octobre.'] }
  ];
  function rendrePlan() {
    var cle = AUJ_ISO.slice(0, 7), l = une('mois', function (d) { return d.mois === cle; }), ids = (l && l.data.ids) || [];
    $('#mois-etiq').textContent = MOIS[AUJ.getMonth()] + ' ' + AUJ.getFullYear();
    $('#mois').innerHTML = MOIS_LISTE.map(function (it) { return liCoche(it, ids.indexOf(it.id) >= 0, false).replace('data-coche=', 'data-mois='); }).join('');
    var m = AUJ.getMonth();
    $('#cal').innerHTML = CALENDRIER.map(function (c) {
      return '<div class="' + (c.mois.indexOf(m) >= 0 || c.mois.indexOf((m + 1) % 12) >= 0 ? 'actuel' : '') + '"><span>' + c.quand + '</span><b>' + c.titre + '</b><ul>' + c.l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
  }

  /* ---------- 6. Angles morts ---------- */
  var ANGLES = [
    { id: 'a-gbp', mq: 'tout', t: 'Créer ou compléter la fiche Google Business Profile de STRAKARA et de Sève (photos, horaires, secteur, lien).' },
    { id: 'a-avis', mq: 'tout', t: 'Demander des avis clients, juste après chaque mission réussie : c\'est le moment où on dit oui.' },
    { id: 'a-recycle', mq: 'tout', t: 'Recycler chaque vidéo TikTok en Réel Instagram et en Short YouTube.' },
    { id: 'a-bio', mq: 'tout', t: 'Un seul lien en bio par marque, qui mène à la bonne page.' },
    { id: 'a-24h', mq: 'tout', t: 'Répondre en moins de 24 h aux messages et commentaires.' },
    { id: 'a-umami', mq: 'tout', t: 'Exclure tes propres visites d\'Umami sur chaque appareil (genesolia.fr/?ne-pas-me-compter).' },
    { id: 'a-console', mq: 'tout', t: 'Chaque lundi, regarder Search Console : erreurs et pages non indexées.' },
    { id: 'a-news', mq: 'gen', t: 'Une newsletter mensuelle Genesolia, même courte.' },
    { id: 'a-collab', mq: 'tout', t: 'Collaborations : praticien·nes et écoles pour Genesolia, commerçants locaux pour Sève.' }
  ];
  function rendreAngles() {
    var l = une('angles'), ids = (l && l.data.ids) || [];
    $('#angles').innerHTML = ANGLES.map(function (it) { return liCoche(it, ids.indexOf(it.id) >= 0, false).replace('data-coche=', 'data-angle='); }).join('');
    var n = ANGLES.filter(function (a) { return ids.indexOf(a.id) >= 0; }).length;
    $('#angles-bilan').textContent = n + ' sur ' + ANGLES.length + ' en place.';
  }
  function cocherListe(kind, test, base, id, on) {
    var l = une(kind, test) || { kind: kind, data: base };
    var ids = (l.data.ids || []).filter(function (x) { return x !== id; }); if (on) ids.push(id);
    l.data = Object.assign({}, base, { ids: ids }); enregistrer(l);
  }

  /* ---------- 7. Liens rapides ---------- */
  var LIENS = [
    ['Tous les jours', [
      ['Search Console', 'Indexation Google', 'https://search.google.com/search-console'],
      ['Airtable STRAKARA', 'Prospection', 'https://airtable.com/appYz7mZAu15F7vh7'],
      ['Airtable Genesolia', 'Prospection', 'https://airtable.com/appC1Knzj66DUEhPJ/tbl2ADJbWV0JBeXcL'],
      ['Meta Business Suite', 'Instagram, Facebook', 'https://business.facebook.com/latest/home'],
      ['TikTok Studio', 'Vidéos', 'https://www.tiktok.com/tiktokstudio'],
      ['LinkedIn', 'Fil et messages', 'https://www.linkedin.com/feed/'],
      ['Mon cap', 'Ton tableau de bord Claude', 'https://claude.ai/artifact/3gBsHPK7tPfD9hqHjF4HvQ']
    ]],
    ['Ventes et chiffres', [
      ['Umami', 'Visiteurs', 'https://cloud.umami.is/'],
      ['Stripe', 'Paiements', 'https://dashboard.stripe.com/'],
      ['Etsy', 'Gestionnaire de boutique', 'https://www.etsy.com/your/shops/me/dashboard'],
      ['Gelato', 'Commandes boutique', 'https://dashboard.gelato.com/']
    ]],
    ['Technique', [
      ['Netlify', 'Mises en ligne', 'https://app.netlify.com/'],
      ['Supabase', 'Base Genesolia', 'https://supabase.com/dashboard/project/qsvzzkjtjsznfntahvvh']
    ]],
    ['Mes sites', [
      ['genesolia.fr', 'Genesolia', 'https://genesolia.fr/'],
      ['strakara.fr', 'STRAKARA', 'https://www.strakara.fr/'],
      ['Sève', 'strakara.fr/seve.html', 'https://www.strakara.fr/seve.html']
    ]]
  ];
  function rendreLiens() {
    $('#liens').innerHTML = LIENS.map(function (g) {
      return '<div class="ln-groupe"><h3>' + esc(g[0]) + '</h3><div class="ln">' + g[1].map(function (x) { return '<a href="' + esc(x[2]) + '" target="_blank" rel="noopener"><b>' + esc(x[0]) + '</b><small>' + esc(x[1]) + '</small></a>'; }).join('') + '</div></div>';
    }).join('');
  }


  /* ---------- 0. Mes entreprises ---------- */
  var FREQS = ['Quotidienne', 'Chaque lundi', 'Chaque mardi', 'Chaque mercredi', 'Chaque jeudi', 'Chaque vendredi', 'Toutes les 2 semaines', 'Mensuelle', 'Ponctuelle'];
  var ENT = {
    gen: { titre: 'Genesolia', sous: 'genesolia.fr · Le Cercle · Ma spirale',
      canaux: [['tt', 'TikTok', 'q', 'Vidéos préparées chaque matin']],
      prosp: [['prat', 'Prospection praticien·nes', 'Quotidienne', 'Airtable Genesolia, 10 par jour']], todo: [],
      liens: [['genesolia.fr', 'https://genesolia.fr/'], ['Airtable', 'https://airtable.com/appC1Knzj66DUEhPJ/tbl2ADJbWV0JBeXcL'], ['Meta', 'https://business.facebook.com/latest/home']] },
    bou: { titre: 'Boutique', sous: 'Gelato · Etsy', prospTitre: 'Rendez-vous régulier',
      canaux: [['visuels', 'Visuels produits', '']],
      prosp: [['etsy', 'Vérifier Etsy (messages, avis, stats)', 'Chaque vendredi', '']], todo: [],
      liens: [['Etsy', 'https://www.etsy.com/your/shops/me/dashboard'], ['Gelato', 'https://dashboard.gelato.com/'], ['Boutique du site', 'https://genesolia.fr/boutique.html']] },
    str: { titre: 'STRAKARA', sous: 'strakara.fr · espaces pro sans bail commercial',
      canaux: [['meta', 'Instagram et Facebook', '2026-11-17', 'Du 18/11 au 05/12 : posts prévus mais pas programmés dans Meta'], ['li', 'LinkedIn profil', '2027-01-15'], ['biens', 'Annonces des biens (groupes LinkedIn et Facebook)', '2026-11-30'], ['tt', 'TikTok', 'q', 'Vidéos préparées chaque matin']],
      prosp: [['heb', 'Prospection hébergeurs', 'Chaque jeudi', ''], ['cli', 'Prospection clients', 'Quotidienne', 'Airtable STRAKARA']], todo: [],
      alerte: 'Anciennes promesses à retirer : supprimer dans Meta et LinkedIn les posts programmés qui disent « STRAKARA gère le reste », « Pas de facture client à gérer », « La caution est gérée pour vous », « Hébergeurs : on s\'occupe du reste », « 1 seul interlocuteur », « Chercher seul ou être accompagné ». Ils sont remplacés par les 30 nouveaux visuels (prompt prêt le 03/11).',
      liens: [['strakara.fr', 'https://www.strakara.fr/'], ['Airtable', 'https://airtable.com/appYz7mZAu15F7vh7'], ['LinkedIn', 'https://www.linkedin.com/feed/']] },
    sev: { titre: 'Sève', sous: 'Études d\'aménagement et d\'ambiance',
      canaux: [['visuels', 'Visuels Instagram et Facebook', '']],
      prosp: [['com', 'Prospection commerces locaux', 'Chaque jeudi', 'Instituts, restaurants, boutiques']],
      todo: ['Créer le compte Instagram Sève', 'Créer la fiche Google Business Profile Sève'],
      liens: [['seve.html', 'https://www.strakara.fr/seve.html'], ['Google Business', 'https://business.google.com/'], ['Instagram', 'https://www.instagram.com/']] }
  };
  function ligneEnt(m) { return une('entreprise', function (d) { return d.m === m; }); }
  function donneesEnt(m) {
    var def = ENT[m], l = ligneEnt(m), d = (l && l.data) || {};
    var canaux = {}; def.canaux.forEach(function (c) { canaux[c[0]] = c[2] === 'q' ? 'q' : c[2]; });
    var prosp = {}; def.prosp.forEach(function (p) { prosp[p[0]] = { date: '', freq: p[2] }; });
    var todo = def.todo.map(function (t, i) { return { id: 'd' + i, t: t, fait: false }; });
    return { m: m, canaux: Object.assign(canaux, d.canaux || {}), prosp: Object.assign(prosp, d.prosp || {}), derniere: d.derniere || null, todo: d.todo || todo, alerteFaite: !!d.alerteFaite };
  }
  function majEnt(m, fn) { var l = ligneEnt(m) || { kind: 'entreprise', data: {} }; var d = donneesEnt(m); fn(d); l.data = d; enregistrer(l); }
  var JOUR_FREQ = { 'Chaque lundi': 1, 'Chaque mardi': 2, 'Chaque mercredi': 3, 'Chaque jeudi': 4, 'Chaque vendredi': 5 };
  function prochaine(p, apres) {   /* prochaine date : celle notée si elle est à venir, sinon calculée selon la fréquence */
    var debut = apres ? plusJours(AUJ, 1) : AUJ, d = p.date ? deIso(p.date) : null;
    if (d && iso(d) >= iso(debut)) return d;
    var f = p.freq;
    if (f === 'Quotidienne') { var x = debut; while (x.getDay() === 0 || x.getDay() === 6) x = plusJours(x, 1); return x; }
    if (JOUR_FREQ[f] != null) { var y = debut; while (y.getDay() !== JOUR_FREQ[f]) y = plusJours(y, 1); return y; }
    if (!d) return null;
    var pas = f === 'Toutes les 2 semaines' ? 14 : f === 'Mensuelle' ? 30 : 0; if (!pas) return d;
    while (iso(d) < iso(debut)) d = plusJours(d, pas);
    return d;
  }
  function etatCanal(v) {
    if (v === 'q') return { c: 'q', t: 'Quotidien' };
    if (!v) return { c: 'r', t: 'Rien de programmé' };
    var n = Math.round((deIso(v) - deIso(AUJ_ISO)) / 864e5);
    if (n <= 7) return { c: 'r', t: n < 0 ? 'Dépassé, à programmer maintenant' : 'À programmer maintenant', n: n };
    if (n <= 14) return { c: 'o', t: 'À préparer', n: n };
    return { c: 'v', t: 'Programmé', n: n };
  }
  function alertesEnt() {
    var a = [];
    Object.keys(ENT).forEach(function (m) {
      var d = donneesEnt(m);
      ENT[m].canaux.forEach(function (c) {
        var v = d.canaux[c[0]], e = etatCanal(v); if (e.c !== 'r' && e.c !== 'o') return;
        a.push({ c: e.c, t: ENT[m].titre + ' · ' + c[1] + (v ? ' : visuels jusqu\'au ' + dateCourte(deIso(v)) + ', à préparer dès le ' + dateCourte(plusJours(deIso(v), -10)) : ' : rien de programmé') });
      });
      if (ENT[m].alerte && !d.alerteFaite) a.push({ c: 'r', t: ENT[m].titre + ' : anciennes promesses à retirer dans Meta et LinkedIn' });
    });
    return a.sort(function (x, y) { return x.c === y.c ? 0 : x.c === 'r' ? -1 : 1; });
  }
  function rendreAlertes() {
    var a = alertesEnt(), box = $('#ent-alertes');
    box.hidden = !a.length;
    box.innerHTML = '<div class="al-tete"><span class="ep-etiq" style="margin:0">À surveiller</span><a href="#entreprises" data-aller="entreprises" class="bt clair mini">Mes entreprises</a></div><ul>' +
      a.map(function (x) { return '<li class="al-' + x.c + '">' + esc(x.t) + '</li>'; }).join('') + '</ul>';
    var p = $('#p-ent'), r = a.filter(function (x) { return x.c === 'r'; }).length; p.hidden = !r; p.textContent = r;
  }
  function rendreEntreprises() {
    $('#ent').innerHTML = Object.keys(ENT).map(function (m) {
      var def = ENT[m], d = donneesEnt(m);
      var canaux = def.canaux.map(function (c) {
        var v = d.canaux[c[0]], e = etatCanal(v);
        var txt = v === 'q' ? esc(c[3] || '') : v ? 'Préparer dès le ' + esc(dateCourte(plusJours(deIso(v), -10))) + (e.n >= 0 ? ' · J−' + e.n : '') : 'Aucune date notée';
        return '<li><div class="cn-l1"><b>' + esc(c[1]) + '</b><span class="bd bd-' + e.c + '">' + esc(e.t) + '</span></div>' +
          '<div class="cn-l2">' + (v === 'q' ? '' : '<label>jusqu\'au <input type="date" data-ent="' + m + '" data-canal="' + c[0] + '" value="' + esc(v || '') + '"></label>') + '<small>' + txt + '</small></div>' +
          (c[3] && v !== 'q' ? '<small class="cn-note">' + esc(c[3]) + '</small>' : '') + '</li>';
      }).join('');
      var prosp = def.prosp.map(function (p) {
        var x = d.prosp[p[0]], pr = prochaine(x), auj = pr && iso(pr) === AUJ_ISO;
        return '<li><div class="cn-l1"><b>' + esc(p[1]) + '</b><span class="bd ' + (auj ? 'bd-o' : 'bd-q') + '">' + (pr ? (auj ? 'Aujourd\'hui' : esc(JOURS[pr.getDay()] + ' ' + dateCourte(pr))) : 'À dater') + '</span></div>' +
          '<div class="cn-l2"><input type="date" aria-label="Prochaine date" data-ent="' + m + '" data-prosp="' + p[0] + '" value="' + esc(pr ? iso(pr) : '') + '"><select aria-label="Fréquence" data-ent="' + m + '" data-freq="' + p[0] + '">' + FREQS.map(function (f) { return '<option' + (f === x.freq ? ' selected' : '') + '>' + f + '</option>'; }).join('') + '</select>' +
          '<button class="bt mini" type="button" data-ent-fait="' + m + '" data-p="' + p[0] + '">Fait</button></div>' + (p[3] ? '<small class="cn-note">' + esc(p[3]) + '</small>' : '') + '</li>';
      }).join('');
      var todo = d.todo.map(function (t) {
        var id = 'e-' + m + '-' + t.id;
        return '<li class="' + (t.fait ? 'fait' : '') + '"><input type="checkbox" id="' + esc(id) + '" data-ent="' + m + '" data-todo="' + esc(t.id) + '"' + (t.fait ? ' checked' : '') + '><div class="tx"><label for="' + esc(id) + '">' + esc(t.t) + '</label></div><button class="ep-suppr" type="button" data-ent="' + m + '" data-todo-suppr="' + esc(t.id) + '" aria-label="Supprimer">&times;</button></li>';
      }).join('');
      return '<article class="ep-carte ent ent-' + m + '"><div class="ent-tete"><div><h3>' + esc(def.titre) + '</h3><small>' + esc(def.sous) + '</small></div>' + pastille(m) + '</div>' +
        (def.alerte && !d.alerteFaite ? '<div class="ent-alerte"><p>' + esc(def.alerte) + '</p><label class="ent-fait"><input type="checkbox" data-ent="' + m + '" data-alerte-faite> Fait</label></div>' : '') +
        '<span class="ep-etiq">Visuels programmés</span><ul class="cn">' + canaux + '</ul>' +
        '<span class="ep-etiq">' + esc(def.prospTitre || 'Prochaine prospection') + '</span><ul class="cn">' + prosp + '</ul>' +
        '<span class="ep-etiq">Dernière action</span><div class="ent-der"><input data-ent="' + m + '" data-derniere maxlength="160" placeholder="Ex. 5 hébergeurs contactés" value="' + esc(d.derniere ? d.derniere.t : '') + '">' + (d.derniere && d.derniere.le ? '<small>le ' + esc(dateCourte(deIso(d.derniere.le))) + '</small>' : '') + '</div>' +
        '<span class="ep-etiq">À faire</span><ul class="ck ck-mini">' + (todo || '<li class="ep-vide" style="display:block;padding:.3rem 0">Rien pour le moment.</li>') + '</ul>' +
        '<form class="ent-ajout" data-ent-form="' + m + '" autocomplete="off"><input name="t" maxlength="160" placeholder="Ajouter une tâche" aria-label="Tâche ' + esc(def.titre) + '" required><button class="bt clair mini" type="submit">Ajouter</button></form>' +
        '<div class="ent-liens">' + def.liens.map(function (x) { return '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a>'; }).join('') + '</div></article>';
    }).join('');
  }
  document.addEventListener('change', function (e) {
    var t = e.target, m = t.getAttribute && t.getAttribute('data-ent'); if (!m || !ENT[m]) return;
    if (t.hasAttribute('data-canal')) majEnt(m, function (d) { d.canaux[t.getAttribute('data-canal')] = t.value; });
    else if (t.hasAttribute('data-prosp')) majEnt(m, function (d) { d.prosp[t.getAttribute('data-prosp')].date = t.value; });
    else if (t.hasAttribute('data-freq')) majEnt(m, function (d) { var p = d.prosp[t.getAttribute('data-freq')]; p.freq = FREQS.indexOf(t.value) >= 0 ? t.value : 'Ponctuelle'; p.date = ''; });
    else if (t.hasAttribute('data-derniere')) majEnt(m, function (d) { d.derniere = t.value.trim() ? { t: t.value.trim().slice(0, 160), le: AUJ_ISO } : null; });
    else if (t.hasAttribute('data-todo')) majEnt(m, function (d) { d.todo.forEach(function (x) { if (x.id === t.getAttribute('data-todo')) x.fait = t.checked; }); });
    else if (t.hasAttribute('data-alerte-faite')) majEnt(m, function (d) { d.alerteFaite = t.checked; });
    else return;
    rendreEntreprises(); rendreAlertes();
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button') : null; if (!t) return; var m = t.getAttribute('data-ent') || t.getAttribute('data-ent-fait'); if (!m || !ENT[m]) return;
    if (t.hasAttribute('data-ent-fait')) {
      var k = t.getAttribute('data-p'), lib = ENT[m].prosp.filter(function (p) { return p[0] === k; })[0][1];
      majEnt(m, function (d) { var p = d.prosp[k]; p.date = ''; var n = prochaine({ date: '', freq: p.freq }, true); p.date = n ? iso(n) : ''; d.derniere = { t: lib + ' faite', le: AUJ_ISO }; });
      toast('Noté. Prochaine date mise à jour');
    } else if (t.hasAttribute('data-todo-suppr')) majEnt(m, function (d) { d.todo = d.todo.filter(function (x) { return x.id !== t.getAttribute('data-todo-suppr'); }); });
    else return;
    rendreEntreprises(); rendreAlertes();
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, m = f.getAttribute && f.getAttribute('data-ent-form'); if (!m || !ENT[m]) return;
    e.preventDefault(); var v = f.t.value.trim(); if (!v) return;
    majEnt(m, function (d) { d.todo.push({ id: uuid().slice(0, 8), t: v.slice(0, 160), fait: false }); });
    rendreEntreprises(); rendreAlertes();
  });


  /* ---------- Idées ---------- */
  var BLOCS = [['l', 'Lives & vidéos'], ['a', 'Articles de blog à écrire'], ['r', 'Articles écrits, à vérifier avant publication'], ['v', 'Vendre plus']];
  var IDEES = {
    gen: { titre: 'Genesolia', mq: 'gen',
      l: ['Tirer le premier fil de ton arbre, en direct', 'Les dates qui se répètent dans ta famille : on cherche ensemble', 'Questions-réponses psychogénéalogie (réponds aux commentaires)', 'Noël en famille : les loyautés qui reviennent à table', 'Ton prénom vient d\'où ? Je lis vos prénoms en direct', 'Rêver de ses ancêtres : ce que ça raconte', 'Ton année personnelle 2027 en direct', 'Je fais un génosociogramme en direct (famille inventée)'],
      a: ['Syndrome d\'anniversaire : comment le repérer dans ton arbre', 'Pourquoi je répète les mêmes histoires d\'amour', 'Enfant de remplacement : porter la place d\'un autre', 'Les fêtes de fin d\'année et les tensions familiales', 'Loyauté invisible envers un parent : les signes', 'Ce que dit ta place dans la fratrie', 'Écrire une lettre à un ancêtre : comment faire', 'Faire son arbre généalogique gratuitement en ligne', 'Les 5 symboles du génosociogramme à connaître'],
      r: ['Couper les ponts : la coupure émotionnelle (famille-toxique-couper-les-ponts.html)', 'Enfant pris entre ses parents : le triangle familial (triangle-familial-enfant-pris-entre-ses-parents.html)', 'Enfant parentifié (enfant-parentifie-parentification.html)', 'Aîné·e après une fausse couche (aine-apres-une-fausse-couche.html)', 'Même place qu\'un ancêtre dans la fratrie (meme-place-qu-un-ancetre-fratrie.html)', 'Adoption et placement dans l\'arbre (adoption-placement-psychogenealogie.html)', 'Veuves de génération en génération (veuvage-precoce-generations.html)', 'Plusieurs unions à chaque génération (remariages-familles-recomposees-generations.html)', 'Conjoint au prénom de son père ou de sa mère (conjoint-meme-prenom-que-son-pere.html)', 'Transfuge de classe (transfuge-de-classe-nevrose-de-classe.html)', 'Fausse couche, IVG, enfant mort-né : les enfants non nés (enfants-non-nes-fausse-couche-ivg-fratrie.html)', 'Grossesse perdue au même âge que sa mère (grossesse-perdue-meme-age-que-sa-mere.html)', 'Mise à jour : La place dans la fratrie (3 visions) (place-dans-la-fratrie.html)', 'Après publication, demander à Claude : relier chaque article publié aux pistes de l\'arbre (à la place des articles proches)', 'Après publication, demander à Claude : ajouter les articles publiés au plan du site (sitemap)', 'Après publication, demander à Claude : mettre la date de publication au bon jour dans chaque article'],
      v: ['Mettre en avant l\'offre de Noël du Cercle (17,77 €/mois jusqu\'au 31/12) dans chaque vidéo', 'Ma spirale : 7 jours offerts puis 4,99 €, lien en bio TikTok', 'Envoyer une newsletter mensuelle avec une offre', 'Proposer la carte cadeau Genesolia pour Noël', 'Espace praticien : relancer les praticien·nes avec le tarif fondateur', 'Lien unique en bio vers les offres (Cercle, Ma spirale, boutique, livres)'] },
    bou: { titre: 'Boutique & livres', mq: 'bou',
      l: ['Déballer un arbre imprimé / un poster en vidéo', 'Montrer les pages du livre L\'enquête de ma lignée', 'Idée cadeau de Noël en 15 secondes'],
      a: ['Idées cadeaux pour une personne qui aime sa famille', 'Offrir son arbre généalogique encadré'],
      r: [],
      v: ['Vérifier les dates limites de commande Gelato pour Noël et les afficher', 'Fiches Etsy : titres et mots-clés de Noël, 5 photos par produit', 'Demander des avis Amazon aux premiers lecteurs de Racines et L\'enquête de ma lignée', 'Mettre les livres et la boutique dans la newsletter'] },
    str: { titre: 'STRAKARA', mq: 'str',
      l: ['LinkedIn live : stocker sans bail commercial, questions-réponses', 'Vidéo : visite d\'un entrepôt disponible (1 par semaine)', 'Vidéo hébergeurs : rentabiliser des m² vides'],
      a: ['Stockage temporaire avant Noël : les solutions', 'Un espace pro pour 3 mois, sans bail commercial', 'Combien de palettes dans 100 m² ?', 'Rentabiliser un entrepôt à moitié vide', 'Un atelier temporaire pour artisan', 'Une page par ville où un espace est libre'],
      r: [],
      v: ['Créer et compléter la fiche Google Business Profile', 'Partenariats : experts-comptables, CCI, transporteurs', 'Relancer les hébergeurs inscrits sans espace publié', 'Répondre aux recherches clients sous 24 h', 'Demander un avis Google après chaque mise en relation'] },
    sev: { titre: 'Sève', mq: 'sev',
      l: ['Avant / après d\'un institut en vidéo', '3 erreurs d\'aménagement qui coûtent cher', 'Quelle ambiance pour mon commerce ? (Clairière, Canopée, Écorce)'],
      a: ['Combien coûte l\'aménagement d\'un institut de 40 m²', 'Éclairage d\'un commerce : quel blanc choisir', 'Refaire sa boutique avec 4 000 €', 'Bois blond, noyer, béton : choisir son ambiance'],
      r: [],
      v: ['Offre de lancement : les 3 premières études à prix réduit (mettre en avant)', 'Démarcher 5 instituts, restaurants ou boutiques par semaine', 'Partenariats avec des artisans locaux (peintres, menuisiers)', 'Fiche Google Business Profile Sève', 'Partager l\'exemple d\'étude PDF dans les groupes Facebook de commerçants'] }
  };
  /* qg_items kind 'idee' : { ref, fait } pour une idée de départ ; { m, b, t, fait } pour une idée ajoutée */
  function rendreIdees() {
    var lignes = de('idee'), faits = {};
    lignes.forEach(function (l) { if (l.data.ref) faits[l.data.ref] = !!l.data.fait; });
    $('#idees').innerHTML = Object.keys(IDEES).map(function (m) {
      var I = IDEES[m], tot = 0, ok = 0;
      var blocs = BLOCS.map(function (b) {
        var items = I[b[0]].map(function (t, i) { var ref = m + '-' + b[0] + '-' + i; return { ref: ref, t: t, fait: !!faits[ref] }; })
          .concat(lignes.filter(function (l) { return l.data.m === m && l.data.b === b[0] && !l.data.ref; }).map(function (l) { return { id: l.id, t: l.data.t, fait: !!l.data.fait }; }));
        tot += items.length; ok += items.filter(function (x) { return x.fait; }).length;
        return '<div class="id-bloc"><h4>' + b[1] + '</h4><ul class="ck ck-mini">' + items.map(function (x) {
          var k = x.ref || x.id, hid = 'id-' + k;
          return '<li class="' + (x.fait ? 'fait' : '') + '"><input type="checkbox" id="' + esc(hid) + '" ' + (x.ref ? 'data-idee-ref="' + esc(x.ref) + '"' : 'data-idee-id="' + esc(x.id) + '"') + (x.fait ? ' checked' : '') + '><div class="tx"><label for="' + esc(hid) + '">' + esc(x.t) + '</label></div>' +
            (x.id ? '<button class="ep-suppr" type="button" data-idee-suppr="' + esc(x.id) + '" aria-label="Supprimer">&times;</button>' : '') + '</li>';
        }).join('') + '</ul><form class="ent-ajout" data-idee-form="' + m + '-' + b[0] + '" autocomplete="off"><input name="t" maxlength="200" placeholder="Ajouter une idée" aria-label="Ajouter une idée, ' + esc(b[1]) + '" required><button class="bt clair mini" type="submit">Ajouter</button></form></div>';
      }).join('');
      return '<article class="ep-carte id-marque ent ent-' + m + '"><div class="ent-tete"><h3>' + esc(I.titre) + '</h3><span class="bd bd-q">' + ok + ' / ' + tot + ' faites</span></div><div class="id-blocs">' + blocs + '</div></article>';
    }).join('');
  }
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-idee-ref')) {
      var ref = t.getAttribute('data-idee-ref'), l = une('idee', function (d) { return d.ref === ref; }) || { kind: 'idee', data: { ref: ref } };
      l.data = { ref: ref, fait: t.checked }; enregistrer(l); rendreIdees();
    } else if (t.hasAttribute && t.hasAttribute('data-idee-id')) {
      var x = S.lignes.filter(function (y) { return y.id === t.getAttribute('data-idee-id'); })[0];
      if (x) { x.data = Object.assign({}, x.data, { fait: t.checked }); enregistrer(x); rendreIdees(); }
    }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-idee-suppr]') : null; if (!t) return;
    var x = S.lignes.filter(function (y) { return y.id === t.getAttribute('data-idee-suppr'); })[0];
    if (x) { supprimer(x); rendreIdees(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, k = f.getAttribute && f.getAttribute('data-idee-form'); if (!k) return;
    e.preventDefault(); var p = k.split('-'), v = f.t.value.trim(); if (!v || !IDEES[p[0]] || 'larv'.indexOf(p[1]) < 0) return;
    enregistrer({ kind: 'idee', data: { m: p[0], b: p[1], t: v.slice(0, 200), fait: false } }); rendreIdees(); toast('Idée ajoutée');
  });

  /* ---------- Onglets ---------- */
  var NOMS = ['entreprises', 'aujourdhui', 'indexer', 'chiffres', 'idees', 'plan', 'angles', 'liens'];
  function ouvrir(n, garder) {
    if (NOMS.indexOf(n) < 0) n = 'aujourdhui';
    $$('[data-sec]').forEach(function (s) { s.hidden = s.getAttribute('data-sec') !== n; });
    $$('[data-onglet]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-onglet') === n ? 'true' : 'false'); });
    var b = $('[data-onglet="' + n + '"]'); if (!garder && b && b.scrollIntoView && window.innerWidth < 1000) b.scrollIntoView({ inline: 'center', block: 'nearest' });
    try { localStorage.setItem(ONGLET, n); } catch (e) {}
    if (!garder && history.replaceState) history.replaceState(null, '', '#' + n);
    if (n === 'chiffres' && !ouvrir.stats) { ouvrir.stats = true; chargerStats(); }
  }

  function tout() { rendreEntreprises(); rendreAlertes(); rendreAujourdhui(); rendreIndexTout(); rendreChiffres(); rendreIdees(); rendrePlan(); rendreAngles(); }

  /* ---------- Événements ---------- */
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-coche]')) { basculer(t.getAttribute('data-coche'), t.checked); rendreAujourdhui(); }
    else if (t.matches('[data-tache]')) { var l = S.lignes.filter(function (x) { return x.id === t.getAttribute('data-tache'); })[0]; if (l) { l.data = Object.assign({}, l.data, { fait: t.checked }); enregistrer(l); rendreAujourdhui(); } }
    else if (t.matches('[data-mois]')) { var k = AUJ_ISO.slice(0, 7); cocherListe('mois', function (d) { return d.mois === k; }, { mois: k }, t.getAttribute('data-mois'), t.checked); rendrePlan(); }
    else if (t.matches('[data-angle]')) { cocherListe('angles', null, {}, t.getAttribute('data-angle'), t.checked); rendreAngles(); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button,a') : null; if (!t) return;
    if (t.hasAttribute('data-onglet')) { ouvrir(t.getAttribute('data-onglet')); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (t.hasAttribute('data-aller')) { e.preventDefault(); ouvrir(t.getAttribute('data-aller')); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (t.hasAttribute('data-suppr-tache')) { var l = S.lignes.filter(function (x) { return x.id === t.getAttribute('data-suppr-tache'); })[0]; if (l) { supprimer(l); rendreAujourdhui(); } }
    else if (t.id === 'reporter') { de('tache').forEach(function (l) { if (l.data.date < AUJ_ISO && !l.data.fait) { l.data = Object.assign({}, l.data, { date: AUJ_ISO }); enregistrer(l); } }); rendreAujourdhui(); toast('Reporté à aujourd\'hui'); }
    else if (t.hasAttribute('data-copier')) copier(t.getAttribute('data-copier'));
    else if (t.hasAttribute('data-demandee')) { enregistrer({ kind: 'indexe', data: { url: t.getAttribute('data-demandee'), le: AUJ_ISO } }); rendreIndexTout(); toast('Noté : revient dans 30 jours si besoin'); }
    else if (t.hasAttribute('data-plus')) { IX[t.getAttribute('data-plus')].voir += 10; rendreIndexTout(); }
    else if (t.hasAttribute('data-relire')) { var c = t.getAttribute('data-relire'); IX[c].etat = 'charge'; rendreIndexTout(); lirePlan(c).then(rendreIndexTout); }
    else if (t.id === 'st-maj') chargerStats();
    else if (t.id === 'sem-av') { semCh = plusJours(semCh, -7); rendreChiffres(); }
    else if (t.id === 'sem-ap') { if (iso(semCh) < iso(lundi(AUJ))) { semCh = plusJours(semCh, 7); rendreChiffres(); } }
    else if (t.id === 'pt-av') { semPt = plusJours(semPt, -7); rendrePosts(); }
    else if (t.id === 'pt-ap') { semPt = plusJours(semPt, 7); rendrePosts(); }
    else if (t.hasAttribute('data-post')) { var p = S.lignes.filter(function (x) { return x.id === t.getAttribute('data-post'); })[0]; if (p) { formPost(p); $('#f-post').scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
    else if (t.id === 'pt-annuler') formPost(null);
    else if (t.id === 'pt-suppr') { var id = $('#f-post').id.value, q = S.lignes.filter(function (x) { return x.id === id; })[0]; if (q && confirm('Supprimer ce post ?')) { supprimer(q); formPost(null); rendrePosts(); toast('Post supprimé'); } }
  });
  $('#f-tache').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target, tx = f.texte.value.trim(); if (!tx) return;
    enregistrer({ kind: 'tache', data: { date: AUJ_ISO, texte: tx.slice(0, 200), marque: f.marque.value, fait: false } });
    f.texte.value = ''; rendreAujourdhui();
  });
  $('#f-chiffres').addEventListener('submit', function (e) {
    e.preventDefault(); var v = {}, n = 0;
    RESEAUX_CH.forEach(function (x) { var val = e.target[x[0]].value.trim(); if (val !== '' && !isNaN(+val)) { v[x[0]] = +val; n++; } });
    var l = ligneSemaine(semCh) || { kind: 'chiffres', data: { semaine: iso(semCh) } };
    l.data = { semaine: iso(semCh), v: v }; enregistrer(l); rendreChiffres();
    $('#ch-ok').textContent = n + ' chiffre' + (n > 1 ? 's' : '') + ' enregistré' + (n > 1 ? 's' : '') + '.'; toast('Semaine enregistrée');
  });
  window.addEventListener('hashchange', function () { ouvrir(location.hash.slice(1), true); });

  /* ---------- Démarrage ---------- */
  $('#date-du-jour').textContent = dateLongue(AUJ).replace(/^./, function (c) { return c.toUpperCase(); });
  var hh = AUJ.getHours(); $('#bonjour').textContent = (hh >= 18 ? 'Bonsoir' : 'Bonjour') + ' Laura';
  optionsMarques($('#f-tache').marque, true);
  rendreLiens();
  var dernier = null; try { dernier = localStorage.getItem(ONGLET); } catch (e) {}
  ouvrir(location.hash.slice(1) || dernier || 'aujourdhui', true);
  tout();   /* affichage immédiat avec la copie de l'appareil */
  charger().then(tout, function () {});
  lirePlan('gen').then(rendreIndexTout); lirePlan('str').then(rendreIndexTout);
  /* à minuit, la journée change : on recharge la page si elle reste ouverte */
  setInterval(function () { if (iso(new Date()) !== AUJ_ISO) location.reload(); }, 60000);
})();
