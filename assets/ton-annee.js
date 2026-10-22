/* Genesolia · « Ton année, mois par mois » (ton-annee.html).
   Agenda de l'année calculé pour la personne : année et mois personnels (Numerologie), ciel réel rapporté à son thème
   (Guide.calculer mois par mois : lunes et éclipses dans ses maisons, passages des planètes lentes sur son Soleil et sa Lune,
   Mercure rétrograde, entrées de Jupiter et de Saturne dans ses maisons), calendrier maya et dates de sa famille (arbre).
   Réservé au Pass (et à tout ce qui le contient : Le Cercle, accès offert, Espace praticien). Sans accès : l'aperçu
   (l'année, ses grands passages et un mois ouvert), le reste flouté avec l'offre.
   RESERVE: false ouvre l'année complète à tout le monde. */
(function () {
  'use strict';
  var RESERVE = true;
  var OFFRES = /^(pass|cercle|abonnement|offert|admin|pro|praticien)$/;
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CLE = 'genesolia-guide', G = window.Guide, T = window.GUIDE_TEXTES, N = window.Numerologie, AS = window.Astrologie, MT = window.MAYA_TEXTES;
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var NOMS_P = { jupiter: 'Jupiter', saturne: 'Saturne', uranus: 'Uranus', neptune: 'Neptune', pluton: 'Pluton' };
  var VERBE = { conjonction: 'passe sur', carre: 'forme un carré avec', opposition: 's’oppose à', trigone: 'soutient' };
  var POIDS_P = { pluton: 5, neptune: 4, uranus: 4, saturne: 3, jupiter: 2 }, POIDS_A = { conjonction: 3, opposition: 2, carre: 2, trigone: 1 };
  var sb = null, utilisateur = null, arbre = null, profil = null, acces = false, annee = null;
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var f = document.getElementById('y-form'), err = document.getElementById('y-erreur'), zone = document.getElementById('resultat');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function phrase1(t) { var m = String(t || '').match(/^.+?[.!?](?=\s|$)/); return m ? m[0] : String(t || ''); }
  function jour(ds) { return +String(ds).slice(8, 10); }
  function leJour(ds) { var j = jour(ds); return (j === 1 ? '1er' : j) + ' ' + MOIS[+String(ds).slice(5, 7) - 1]; }
  function cible(c) { return c === 'soleil' ? 'ton Soleil' : 'ta Lune'; }
  function enSigne(s) { return 'en ' + G.nomSigne(s); }

  var lieu = window.LieuNaissance.brancher({ input: document.getElementById('y-lieu'), liste: document.getElementById('y-sugg'), info: document.getElementById('y-lieu-info') });
  document.getElementById('y-sans-heure').addEventListener('change', function () { var h = document.getElementById('y-heure'); h.disabled = this.checked; if (this.checked) h.value = ''; });

  /* ───── Calcul de l'année ───── */
  function calculerAnnee(p, Y) {
    var mois = [];
    for (var m = 1; m <= 12; m++) mois.push(G.calculer(p, Y, m, arbre));
    if (!mois[0]) return null;
    var natal = mois[0].natal;
    // Passages des planètes lentes : regroupés sur l'année
    var pass = {};
    mois.forEach(function (r) {
      r.aspects.forEach(function (a) {
        var k = a.planete + '|' + a.cible + '|' + a.aspect, x = pass[k];
        if (!x) x = pass[k] = { planete: a.planete, cible: a.cible, aspect: a.aspect, mois: [], exacts: [], best: a };
        x.mois.push(r.mois);
        if (a.exact) x.exacts.push(a.jour);
        if (a.orbe < x.best.orbe) x.best = a;
      });
    });
    var passages = Object.keys(pass).map(function (k) { var x = pass[k]; x.poids = POIDS_P[x.planete] * POIDS_A[x.aspect] + (x.cible === 'soleil' ? 1 : 0); if (!x.exacts.length) x.exacts = [x.best.jour]; return x; });
    passages.sort(function (a, b) { return b.poids - a.poids || (a.best.jour < b.best.jour ? -1 : 1); });
    // Entrées de Jupiter et de Saturne dans une nouvelle maison (seulement avec l'heure et le lieu)
    var entrees = [];
    if (natal.cuspides) ['jupiter', 'saturne'].forEach(function (pl) {
      var avant = AS.maisonDe(AS.longitude(pl, new Date(Date.UTC(Y - 1, 11, 31, 12))), natal.cuspides);
      for (var d = new Date(Date.UTC(Y, 0, 1, 12)); d.getUTCFullYear() === Y; d = new Date(d.getTime() + 86400000)) {
        var ma = AS.maisonDe(AS.longitude(pl, d), natal.cuspides);
        if (ma !== avant) entrees.push({ planete: pl, maison: ma, jour: Y + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()), retour: false });
        avant = ma;
      }
    });
    var dn = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.date);
    return { annee: Y, mois: mois, natal: natal, passages: passages, entrees: entrees, anneePerso: mois[0].anneePerso, naiss: { a: +dn[1], m: +dn[2], j: +dn[3] } };
  }

  /* L'agenda d'un mois : une ligne par date, dans l'ordre */
  function agendaMois(A, r) {
    var mm = pad(r.mois), L = [], fond = [];
    if (A.naiss.m === r.mois) L.push({ jour: A.annee + '-' + mm + '-' + pad(A.naiss.j), cls: 'toi', etiq: 'Toi', titre: 'Ton anniversaire', texte: 'Tu as ' + (A.annee - A.naiss.a) + ' ans. Un bon jour pour regarder le chemin parcouru depuis l’an dernier.' });
    var jEclipses = r.eclipses.map(function (e) { return e.jour; });
    r.lunaisons.forEach(function (l) {
      if (jEclipses.indexOf(l.jour) >= 0) return;   /* l'éclipse du même jour remplace la lune */
      var nv = l.type === 'nouvelle', txt = l.maison ? (nv ? T.NOUVELLE_LUNE_MAISON : T.PLEINE_LUNE_MAISON)[l.maison] : (nv ? T.NOUVELLE_LUNE_SIGNE : T.PLEINE_LUNE_SIGNE)[l.signe];
      L.push({ jour: l.jour, cls: 'ciel', etiq: 'Ciel', titre: (nv ? 'Nouvelle lune ' : 'Pleine lune ') + enSigne(l.signe) + (l.maison ? ', dans ta maison ' + l.maison : ''), texte: phrase1(txt) });
    });
    r.eclipses.forEach(function (e) {
      var lon = e.type === 'solaire' ? AS.longitude('soleil', e.date) : AS.longitude('lune', e.date), s = AS.signeDe(lon), ma = A.natal.cuspides ? AS.maisonDe(lon, A.natal.cuspides) : null;
      L.push({ jour: e.jour, cls: 'ciel', etiq: 'Ciel', titre: 'Éclipse ' + e.type + ' ' + enSigne(s) + (ma ? ', dans ta maison ' + ma : ''), texte: phrase1(e.type === 'solaire' ? T.ECLIPSE_SOLAIRE : T.ECLIPSE_LUNAIRE) + (ma ? ' Domaine concerné : ' + T.MAISONS_NOMS[ma] + '.' : '') });
    });
    r.aspects.forEach(function (a) {
      var titre = NOMS_P[a.planete] + ' ' + VERBE[a.aspect] + ' ' + cible(a.cible);
      if (a.exact) L.push({ jour: a.jour, cls: 'ciel', etiq: 'Grand passage', titre: titre, texte: phrase1(T.ASPECTS[a.planete][a.cible][a.aspect]) });
      else fond.push(titre);
    });
    A.entrees.forEach(function (x) {
      if (x.jour.slice(5, 7) !== mm) return;
      var txt = (x.planete === 'jupiter' ? T.JUPITER_MAISON : T.SATURNE_MAISON)[x.maison];
      L.push({ jour: x.jour, cls: 'ciel', etiq: 'Ciel', titre: NOMS_P[x.planete] + ' entre dans ta maison ' + x.maison, texte: phrase1(txt) + ' Domaine concerné : ' + T.MAISONS_NOMS[x.maison] + '.' });
    });
    if (r.mercure) r.mercure.stations.forEach(function (s) {
      L.push({ jour: A.annee + '-' + mm + '-' + pad(s.jour), cls: 'ciel', etiq: 'Ciel', titre: s.type === 'debut' ? 'Mercure commence sa marche rétrograde' : 'Mercure reprend sa marche directe', texte: s.type === 'debut' ? 'Le temps de relire, de vérifier et de reprendre ce qui est resté en plan, plutôt que de commencer.' : 'Les échanges et les décisions retrouvent de la fluidité.' });
    });
    if (r.maya && r.maya.anniversaire) L.push({ jour: r.maya.anniversaire, cls: 'nb', etiq: 'Maya', titre: 'Ton anniversaire maya', texte: phrase1(T.MAYA_ANNIVERSAIRE) });
    if (r.famille) {
      r.famille.dates.forEach(function (x) {
        var ans = 'Il y a ' + x.il_y_a + ' an' + (x.il_y_a > 1 ? 's' : '') + '.';
        L.push({ jour: x.jour, cls: 'fam', etiq: 'Famille', titre: x.quoi, texte: /^Départ/.test(x.quoi) ? ans + ' Une date à vivre avec douceur : il arrive qu’on se sente fatigué·e ou à fleur de peau autour d’elle sans savoir pourquoi.' : ans });
      });
      if (r.famille.echos.length) {
        var qui = r.famille.echos.map(function (x) { return x.nom + (x.annee ? ' (en ' + x.annee + ')' : ''); }).filter(function (v, k, t) { return t.indexOf(v) === k; });
        fond.push('à ' + r.age + ' ans, l’âge que tu as, ' + qui.join(', ') + (qui.length > 1 ? ' ont' : ' a') + ' vécu un événement marquant');
      }
    }
    L.sort(function (a, b) { return a.jour < b.jour ? -1 : a.jour > b.jour ? 1 : 0; });
    return { lignes: L, fond: fond };
  }

  /* ───── Affichage ───── */
  function htmlMois(A, r) {
    var ML = N.MOIS_LONG[r.moisPerso], ag = agendaMois(A, r), nom = MOIS[r.mois - 1];
    var h = '<article class="y-mois" id="m-' + r.mois + '"><div class="y-mtete"><div class="y-num" aria-hidden="true">' + r.moisPerso + '</div><div><h3>' + nom + ' ' + A.annee + '</h3><p>Mois personnel ' + r.moisPerso + ' · ' + esc(ML.titre) + '</p></div></div><div class="y-mcorps">';
    h += '<p class="y-ton">' + esc(phrase1(ML.texte)) + ' ' + esc(T.MOIS[r.moisPerso].theme) + '.</p>';
    h += ag.lignes.length ? '<ul class="y-agenda">' + ag.lignes.map(function (x) {
      return '<li class="' + x.cls + '"><div class="d">' + jour(x.jour) + '<small>' + nom.slice(0, 4) + '</small></div><div><em>' + esc(x.etiq) + '</em><b>' + esc(x.titre) + '</b><span>' + esc(x.texte) + '</span></div></li>';
    }).join('') + '</ul>' : '<p class="note">Un mois sans grand rendez-vous du ciel : avance à ton rythme.</p>';
    if (ag.fond.length) h += '<div class="y-fond"><b>En toile de fond ce mois-ci :</b> ' + esc(ag.fond.join(' ; ')) + '.</div>';
    h += '<p class="y-geste"><b>Ton geste du mois :</b> ' + esc(ML.gestes[0]) + '</p>';
    return h + '</div></article>';
  }
  function htmlFort(x, i) {
    var ms = x.mois.filter(function (m, k, t) { return t.indexOf(m) === k; });
    var periode = ms.length > 1 ? (/^[aeiou]/.test(MOIS[ms[0] - 1]) ? 'D’' : 'De ') + MOIS[ms[0] - 1] + ' à ' + MOIS[ms[ms.length - 1] - 1] : 'En ' + MOIS[ms[0] - 1];
    var exacts = x.exacts.filter(function (d, k, t) { return t.indexOf(d) === k; }).map(leJour);
    return '<div class="y-fort"><i aria-hidden="true">' + (i + 1) + '</i><div><h4>' + NOMS_P[x.planete] + ' ' + VERBE[x.aspect] + ' ' + cible(x.cible) + '</h4><p class="quand">' + periode + ' · au plus près le ' + exacts.join(', puis le ') + '</p><p>' + esc(T.ASPECTS[x.planete][x.cible][x.aspect]) + '</p></div></div>';
  }

  function rendu(A) {
    var auj = new Date(), ouvert = A.annee === auj.getFullYear() ? auj.getMonth() + 1 : 1, complet = acces || !RESERVE;
    var Y = A.annee, AN = N.ANNEES[A.anneePerso], n = A.natal, signeMaya = A.mois[0].maya && MT ? MT.SIGNES[A.mois[0].maya.natal.signe] : null;
    var h = '<div class="conteneur">';
    h += '<div class="y-carte"><p class="y-sur">' + (profil.prenom ? 'L’année de ' + esc(String(profil.prenom).replace(/[\s.,;:!]+$/, '')) : 'Ton année') + '</p><h2>Ton année ' + Y + '</h2><p><b>Année personnelle ' + A.anneePerso + ' · ' + esc(AN.titre) + '.</b> ' + esc(AN.texte) + '</p>' +
      '<div class="y-puces"><span>Soleil ' + esc(G.nomSigne(n.planetes.soleil.signe)) + '</span>' + (n.luneIncertaine ? '' : '<span>Lune ' + esc(G.nomSigne(n.planetes.lune.signe)) + '</span>') + (n.asc ? '<span>Ascendant ' + esc(G.nomSigne(n.asc.signe)) + '</span>' : '') + (signeMaya ? '<span>Signe maya ' + esc(signeMaya.kiche) + '</span>' : '') + '</div>' +
      '<div class="y-annees" role="group" aria-label="Choisir l’année">' + [auj.getFullYear(), auj.getFullYear() + 1].map(function (y) { return '<button type="button" data-annee="' + y + '" aria-pressed="' + (y === Y) + '">' + y + '</button>'; }).join('') + '</div></div>';
    // Les grands passages de l'année
    var forts = A.passages.slice(0, 4);
    h += '<div class="y-bloc"><p class="y-etiq">Les grands passages de ton année</p>' + (forts.length ? '<div class="y-forts">' + forts.map(htmlFort).join('') + '</div>' : '<p>Pas de grand passage des planètes lentes sur ton Soleil ou ta Lune cette année : une année pour avancer à ton rythme, portée surtout par tes nombres et tes lunes.</p>') +
      (n.cuspides ? '' : '<p class="note" style="margin-top:.8rem">Ajoute ton heure et ton lieu de naissance pour savoir dans quels domaines de ta vie tombent les lunes, les éclipses et les entrées de Jupiter et de Saturne.</p>') + '</div>';
    // Sommaire
    h += '<nav class="y-sommaire" aria-label="Les mois">' + A.mois.map(function (r) { var libre = complet || r.mois === ouvert; return '<a href="#' + (libre ? 'm-' + r.mois : 'y-offre') + '"' + (libre ? '' : ' class="ferme"') + '>' + cap(MOIS[r.mois - 1]) + ' · ' + r.moisPerso + '</a>'; }).join('') + '</nav>';
    if (complet) {
      h += A.mois.map(function (r) { return htmlMois(A, r); }).join('');
      h += '<div class="y-actions"><button class="btn btn-plein" type="button" id="y-imprimer">Imprimer ou enregistrer mon année</button><button class="btn btn-trait" type="button" id="y-modifier">Modifier mes repères</button></div>';
    } else {
      h += htmlMois(A, A.mois[ouvert - 1]);
      var suite = A.mois.filter(function (r) { return r.mois !== ouvert; }).slice(0, 2).map(function (r) { return htmlMois(A, r); }).join('');
      var nb = A.mois.reduce(function (s, r) { return s + (r.mois === ouvert ? 0 : agendaMois(A, r).lignes.length); }, 0);
      h += '<div class="y-verrou" id="y-offre"><div class="y-flou" aria-hidden="true">' + suite + '</div><div class="y-offre"><p class="y-etiq">Ton année complète</p><h3>Les 11 autres mois de ton agenda</h3><p>' + nb + ' dates t’attendent encore, calculées pour toi : tes lunes, tes grands passages, tes mois personnels et ta famille.</p>' +
        '<ul><li>Les 12 mois de ton année, à lire et à imprimer</li><li>Ton mois à toi, chaque mois</li><li>Toutes les analyses de ton arbre et tes livrets</li></ul>' +
        '<a class="btn btn-plein" href="tarifs.html#t-pass">Avec le Pass, 10 € par mois</a><a class="y-ou" href="essai.html">Ou Le Cercle, qui contient le Pass : ton 1<sup>er</sup> mois est offert</a>' +
        (utilisateur ? '' : '<p class="note" style="margin-top:.8rem">Déjà le Pass ou Le Cercle ? <a href="login.html?retour=ton-annee.html">Connecte-toi</a></p>') + '</div></div>';
    }
    h += '<p class="note" style="margin-top:1.4rem">' + esc(T.INTRO.replace(/Ton guide du mois/, 'Ton année').replace(/ce guide/, 'cet agenda')) + '</p><p class="note">Lecture symbolique, pour t’accompagner dans ton année. Elle ne prédit rien.</p></div>';
    zone.innerHTML = h; zone.hidden = false;
    zone.querySelectorAll('[data-annee]').forEach(function (b) { b.addEventListener('click', function () { annee = +b.getAttribute('data-annee'); afficher(); }); });
    var imp = document.getElementById('y-imprimer'); if (imp) imp.addEventListener('click', function () { window.print(); });
    var mod = document.getElementById('y-modifier'); if (mod) mod.addEventListener('click', function () { document.querySelector('.y-tete').classList.remove('y-replie'); f.scrollIntoView({ behavior: 'smooth' }); });
  }

  function afficher() {
    if (!profil) return;
    var A = calculerAnnee(profil, annee);
    if (A) rendu(A);
    if (window.umami) try { window.umami.track('ton-annee', { annee: annee, acces: acces ? 'oui' : 'non' }); } catch (e) {}
  }
  function anneeParDefaut() { var a = new Date(); return a.getMonth() >= 9 ? a.getFullYear() + 1 : a.getFullYear(); }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = f.date.value, sansH = document.getElementById('y-sans-heure').checked, hr = sansH ? '' : f.heure.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || +d.slice(0, 4) < 1900) { err.textContent = 'Indique ta date de naissance complète.'; f.date.focus(); return; }
    err.textContent = '';
    lieu.resoudre().then(function (l) {
      var prenoms = f.prenom.value.trim(), verrou = !!(profil && profil.verrou);
      profil = { prenom: prenoms.split(/\s+/)[0] || '', prenoms: prenoms, nom: f.nom.value.trim(), date: d, heure: hr, lieu: l ? l.nom : '', lat: l ? l.lat : null, lon: l ? l.lon : null, tz: l ? l.tz : 'Europe/Paris', verrou: verrou };
      try { localStorage.setItem(CLE, JSON.stringify(profil)); } catch (x) {}
      if (utilisateur && sb && window.GenesoliaReperes) window.GenesoliaReperes.enregistrer(sb, utilisateur, profil).then(function (p) { if (p) { profil = p; etatReperes(); } });
      annee = annee || anneeParDefaut();
      afficher(); zone.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function demarrer() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(CLE) || 'null'); } catch (x) {}
    if (!s) { try { var a = JSON.parse(localStorage.getItem('genesolia-astro') || 'null'); if (a && a.date) s = { prenom: a.prenom || '', date: a.date, heure: a.heure || '', lieu: a.lieu || '', lat: a.lat, lon: a.lon, tz: a.tz || 'Europe/Paris' }; } catch (x) {} }
    if (!s && arbre && arbre.people) { var moi = Object.keys(arbre.people).map(function (k) { return arbre.people[k]; }).filter(function (p) { return p.role === 'moi'; })[0]; if (moi && /^\d{4}-\d{2}-\d{2}$/.test(moi.naiss || '')) s = { prenom: moi.prenom || '', date: moi.naiss, heure: '', tz: 'Europe/Paris' }; }
    if (s && s.date) {
      f.prenom.value = s.prenoms || s.prenom || ''; f.nom.value = s.nom || ''; f.date.value = s.date; f.heure.value = s.heure || '';
      if (!s.heure) { document.getElementById('y-sans-heure').checked = true; f.heure.disabled = true; }
      if (s.lieu) { document.getElementById('y-lieu').value = s.lieu; lieu.definir({ nom: s.lieu, lat: s.lat, lon: s.lon, tz: s.tz }); document.getElementById('y-lieu-info').textContent = 'Lieu enregistré · fuseau ' + s.tz; }
      profil = s; annee = anneeParDefaut();
      afficher();
      if (!zone.hidden) document.querySelector('.y-tete').classList.add('y-replie');
    }
  }
  function etatReperes() {
    var R = window.GenesoliaReperes, n = document.getElementById('y-note-reperes'), v = !!(profil && profil.verrou);
    ['prenom', 'nom', 'date'].forEach(function (k) { f[k].readOnly = v; });
    if (!R) return;
    if (v) { n.innerHTML = R.NOTE; n.hidden = false; }
    else if (utilisateur) { n.textContent = R.AVANT; n.hidden = false; }
    else n.hidden = true;
    if (utilisateur) document.getElementById('y-intro-reperes').textContent = 'Ils servent à calculer ton année, ton guide et tes livres du mois.';
  }
  /* Le Pass, ou ce qui le contient (Le Cercle, accès offert, Espace praticien) */
  function verifierAcces() {
    if (!sb || !utilisateur) return Promise.resolve(false);
    var ap = sb.from('acces_premium').select('offre,valide_jusqu').eq('user_id', utilisateur.id).then(function (r) {
      return ((r && r.data) || []).some(function (a) { return OFFRES.test(a.offre) && new Date(a.valide_jusqu) > new Date(); });
    }, function () { return false; });
    var pr = sb.from('praticiens').select('acces_jusqu').eq('user_id', utilisateur.id).then(function (r) {
      return ((r && r.data) || []).some(function (p) { return p.acces_jusqu && new Date(p.acces_jusqu) > new Date(); });
    }, function () { return false; });
    return Promise.all([ap, pr]).then(function (x) { return x[0] || x[1]; });
  }

  try { arbre = JSON.parse(localStorage.getItem('geno4') || 'null'); } catch (x) {}
  if (!sb) { demarrer(); return; }
  sb.auth.getSession().then(function (res) {
    var s = res && res.data && res.data.session;
    if (s) utilisateur = s.user;
    if (!utilisateur) return demarrer();
    var sonArbre = sb.from('arbres').select('data').eq('user_id', utilisateur.id).maybeSingle().then(function (r) { if (r && r.data && r.data.data) arbre = r.data.data; }, function () {});
    var sesReperes = window.GenesoliaReperes ? window.GenesoliaReperes.lire(sb, utilisateur) : Promise.resolve(null);
    return Promise.all([verifierAcces(), sonArbre, sesReperes]).then(function (x) { acces = !!x[0]; demarrer(); etatReperes(); }, demarrer);
  }).catch(demarrer);
})();
