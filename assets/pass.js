/* Genesolia · l'appli « Le Pass · Mon enquête » (pass.html).
   Pour celles qui veulent explorer leur lignée étape par étape : le fil d'or d'abord (il nourrit l'agenda), puis l'enquête,
   avec une part d'intuition et d'invisible. Ce n'est pas Le Cercle (pas de carnet ni de suivi) : c'est l'enquête vivante,
   reliée à l'arbre, au fil d'or, au ciel et aux nombres. Le livre « L'enquête de ma lignée » va plus loin, sur papier.
   Données :
   - l'arbre : table arbres (sinon cet appareil, geno4) ; le fil d'or : coffre « fil-d-or » (sinon cet appareil) ;
   - la date de naissance : reperes (sinon la fiche « moi » de l'arbre) ;
   - l'enquête (étapes faites, réponses, notes et rappels de l'agenda) : coffre chiffré « enquete » si la personne a donné son accord,
     sinon seulement sur cet appareil. Genesolia ne lit jamais ces réponses.
   Accès : le Pass ou Le Cercle (GenesoliaAcces.pass). ?exemple : l'appli remplie avec la famille d'exemple, pour la découvrir. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var sb = null; try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var ETAPES = window.PASS_ENQUETE || [], QUESTIONS = window.PASS_QUESTIONS || [], N = window.Numerologie, A = window.Astronomy;
  var EXEMPLE = /[?&]exemple\b/.test(location.search);
  var vue = document.getElementById('pa-vue');
  var D = { user: null, acces: false, arbre: null, fil: null, naissance: null, prenom: '', etat: null, accord: false };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var JS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
  var EVT = { deuil: 'un deuil', 'deces-precoce': 'un départ trop tôt', rupture: 'une séparation', abandon: 'un abandon', secret: 'un secret', guerre: 'une guerre ou un exil', demenagement: 'un départ, un déracinement', pauvrete: 'un manque d’argent', faillite: 'une perte de biens', heritage: 'un héritage difficile', 'perte-emploi': 'une perte de travail', ascension: 'une ascension', declassement: 'un déclassement', 'hors-mariage': 'une naissance hors mariage', maladie: 'une épreuve', sacrifice: 'un effacement', trahison: 'une trahison', injustice: 'une injustice', honte: 'une honte', mariage: 'un mariage', naissance: 'une naissance', reussite: 'une réussite' };

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lireL(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function ecrireL(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function cap(t) { t = String(t || ''); return t.charAt(0).toUpperCase() + t.slice(1); }
  function prenom1(p) { return String((p && p.prenom) || '').trim().split(/\s+/)[0] || 'Quelqu’un'; }
  function an(t) { var m = String(t || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function dateComplete(t) { var m = String(t || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { a: +m[1], m: +m[2], j: +m[3] } : null; }

  /* ───── L'état de l'enquête : étapes faites, réponses, notes et rappels de l'agenda ───── */
  var CLE = 'genesolia-enquete', minuteur = null;
  function etatVide() { return { faites: {}, debut: {}, reponses: {}, notes: {}, rappels: {} }; }
  function sauver() {
    if (EXEMPLE) return;
    ecrireL(CLE, D.etat);
    clearTimeout(minuteur);
    var z = document.getElementById('pa-sauve'); if (z) z.textContent = 'Enregistrement…';
    minuteur = setTimeout(function () {
      var fin = function (ok) { var z2 = document.getElementById('pa-sauve'); if (z2) z2.textContent = ok ? (D.accord ? 'Gardé dans ton espace, chiffré.' : 'Gardé sur cet appareil.') : 'Pas encore enregistré dans ton espace : réessaie dans un instant.'; };
      if (!(sb && D.user && D.accord)) { fin(true); return; }
      window.GenesoliaCoffre.ecrire(sb, D.user, 'enquete', D.etat).then(function (r) { fin(!(r && r.error)); }, function () { fin(false); });
    }, 700);
  }

  /* ───── Le chargement ───── */
  function charger() {
    if (EXEMPLE) return chargerExemple();
    if (!sb) return Promise.resolve();
    return sb.auth.getSession().then(function (r) {
      var s = r && r.data && r.data.session; D.user = s ? s.user : null;
      if (!D.user) return;
      D.accord = !!(window.GenesoliaCoffre && window.GenesoliaCoffre.accord(D.user));
      var C = window.GenesoliaCoffre;
      return Promise.all([
        window.GenesoliaAcces && window.GenesoliaAcces.pass ? window.GenesoliaAcces.pass() : Promise.resolve(false),
        sb.from('arbres').select('data').eq('user_id', D.user.id).maybeSingle().then(function (x) { return x && x.data ? x.data.data : null; }, function () { return null; }),
        C && D.accord ? C.lire(sb, D.user, 'fil-d-or').then(function (x) { return x && x.etat ? x.etat : null; }, function () { return null; }) : Promise.resolve(null),
        window.GenesoliaReperes ? window.GenesoliaReperes.lire(sb, D.user) : Promise.resolve(null),
        C && D.accord ? C.lire(sb, D.user, 'enquete').then(function (x) { return x; }, function () { return null; }) : Promise.resolve(null)
      ]).then(function (x) {
        D.acces = !!x[0];
        D.arbre = x[1] && x[1].people && Object.keys(x[1].people).length ? x[1] : lireL('geno4');
        D.fil = x[2] || lireL('genesolia-arbre-ressentis');
        if (x[3] && x[3].date) { D.naissance = x[3].date; D.prenom = x[3].prenom; }
        D.etat = x[4] || lireL(CLE) || etatVide();
      });
    });
  }
  function chargerExemple() {
    D.acces = true; D.user = { id: 'exemple' };
    return fetch('assets/exemple-genosociogramme.json').then(function (r) { return r.json(); }).then(function (a) {
      D.arbre = a;
      D.fil = { personnes: { toi: { rel: 'toi', prenom: 'Léa', etapes: [{ age: '8', evt: 'Le départ de mon père', em: ['tristesse'] }, { age: '31', evt: 'Ma séparation', em: ['peur'] }] }, mere: { rel: 'mere', prenom: 'Hélène', etapes: [{ age: '32', evt: 'Son divorce', em: ['colère'] }] } } };
      D.etat = { faites: { fil: '2026-10-01', noms: '2026-10-09' }, debut: { fil: '2026-10-01', noms: '2026-10-02', voix: '2026-10-10' }, reponses: {}, notes: {}, rappels: {} };
    });
  }
  function moiDeLArbre() {
    var P = (D.arbre && D.arbre.people) || {}; for (var k in P) if (P[k].role === 'moi') return P[k]; return null;
  }
  function filPersonnes() {
    var p = (D.fil && D.fil.personnes) || {};
    return Object.keys(p).filter(function (k) { var x = p[k]; return x && (x.prenom || (x.etapes || []).some(function (e) { return e.age || e.evt || e.texte; })); });
  }
  function filDepose() { var p = (D.fil && D.fil.personnes) || {}, n = 0; filPersonnes().forEach(function (k) { n += (p[k].etapes || []).filter(function (e) { return e.age || e.evt || e.texte; }).length; }); return n >= 1; }

  /* ───── Nombres et lune ───── */
  function naissance() {
    var d = dateComplete(D.naissance); if (d) return d;
    var m = moiDeLArbre(); return m ? dateComplete(m.naiss) : null;
  }
  function jourPerso(dt) { var b = naissance(); if (!b || !N) return null; var ap = N.anneePerso(b.j, b.m, dt.getFullYear()), mp = N.reduire(ap + dt.getMonth() + 1, false); return N.reduire(mp + dt.getDate(), false); }
  function moisPerso(dt) { var b = naissance(); if (!b || !N) return null; return N.reduire(N.anneePerso(b.j, b.m, dt.getFullYear()) + dt.getMonth() + 1, false); }
  var LUNES = {};
  function lunesDuMois(a, m) {
    var k = a + '-' + m; if (LUNES[k]) return LUNES[k];
    var r = {}; if (!A) return r;
    [[0, 'Nouvelle lune'], [90, 'Premier quartier'], [180, 'Pleine lune'], [270, 'Dernier quartier']].forEach(function (ph) {
      var t = new Date(a, m, 1), fin = new Date(a, m + 1, 1);
      for (var i = 0; i < 3; i++) {
        var x = A.SearchMoonPhase(ph[0], t, 40); if (!x || x.date >= fin) break;
        if (ph[0] === 0 || ph[0] === 180) r[iso(x.date)] = ph[1];
        t = new Date(x.date.getTime() + 864e5);
      }
    });
    LUNES[k] = r; return r;
  }
  function phaseDuJour(dt) {
    if (!A) return '';
    var ph = A.MoonPhase(dt);
    return ph < 12 || ph >= 348 ? 'Nouvelle lune' : ph < 78 ? 'Premier croissant' : ph < 102 ? 'Premier quartier' : ph < 168 ? 'Lune gibbeuse croissante' : ph < 192 ? 'Pleine lune' : ph < 258 ? 'Lune gibbeuse décroissante' : ph < 282 ? 'Dernier quartier' : 'Dernier croissant';
  }

  /* ───── Les dates de la lignée : anniversaires de naissance et de départ, échos d'âge, dates du fil d'or ───── */
  function datesLignee(a, m) {
    var P = (D.arbre && D.arbre.people) || {}, l = [];
    Object.keys(P).forEach(function (k) {
      var p = P[k], n = dateComplete(p.naiss), d = dateComplete(p.deces), moi = p.role === 'moi';
      if (n && n.m === m + 1) l.push({ j: n.j, type: 'l', cle: 'n-' + k, texte: moi ? 'Ton anniversaire' : 'Naissance de ' + prenom1(p) + ' (' + n.a + ')', ans: a - n.a });
      if (d && d.m === m + 1) l.push({ j: d.j, type: 'f', cle: 'd-' + k, texte: 'Départ de ' + prenom1(p) + ' (' + d.a + ')', ans: a - d.a });
    });
    return l;
  }
  function echosAge(annee) {
    var P = (D.arbre && D.arbre.people) || {}, b = naissance(), moi = null; if (!b) return [];
    for (var k in P) if (P[k].role === 'moi') moi = k;
    var age = annee - b.a, l = [];
    Object.keys(P).forEach(function (k) {
      if (k === moi) return; var p = P[k];
      (p.events || []).forEach(function (e) { if (+e.age === age && EVT[e.type]) l.push(prenom1(p) + ' a vécu ' + EVT[e.type] + ' à ' + age + ' ans' + (e.year ? ' (' + e.year + ')' : '') + '.'); });
    });
    var F = (D.fil && D.fil.personnes) || {};
    Object.keys(F).forEach(function (k) {
      if (k === 'toi') return;
      (F[k].etapes || []).forEach(function (e) { if (+e.age === age && e.evt) l.push((F[k].prenom || 'Quelqu’un de ta lignée') + ' : « ' + e.evt + ' », à ' + age + ' ans.'); });
    });
    return l;
  }

  /* ───── Affichage ───── */
  function afficher(h) { vue.innerHTML = h; window.scrollTo(0, 0); }
  function etapeCourante() { for (var i = 0; i < ETAPES.length; i++) if (!D.etat.faites[ETAPES[i].id]) return i; return ETAPES.length; }
  function ouverte(i) { return i === 0 || !!D.etat.faites[ETAPES[i - 1].id]; }

  function vuePorte() {
    var u = !!D.user;
    afficher('<section class="pa-carte pa-porte"><img src="assets/icones/pass-192.png" alt="" width="84" height="84" style="border-radius:22px;box-shadow:0 10px 26px rgba(31,11,42,.25)">' +
      '<h1 class="pa-h1">Mon enquête de lignée</h1><p>Pars à la rencontre de ta lignée, étape par étape : ton fil d’or, tes ancêtres, les dates qui se répondent, ton ciel et tes nombres, et ce que ton intuition sait déjà.</p>' +
      '<ul><li>Ton enquête guidée, une étape après l’autre, avec un geste invisible à chaque fois</li><li>L’agenda de ta lignée : ses dates, les lunes, tes jours personnels, et les rappels que tu choisis</li><li>Ton mois à toi et le ciel du mois appliqué à ton thème</li><li>Toutes les analyses de ton arbre, et tous les livrets, pour toi et tes proches</li></ul>' +
      '<p><b>Le Pass</b> · 10 € par mois, sans engagement, ou 27 € les 3 mois.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center">' + (u ? '<a class="pa-bt" href="tarifs.html#t-pass">Prendre le Pass</a>' : '<a class="pa-bt" href="login.html?retour=pass.html">Me connecter</a><a class="pa-bt clair" href="tarifs.html#t-pass">Découvrir le Pass</a>') +
      '<a class="pa-bt clair" href="pass.html?exemple">Voir un exemple</a></div></section>');
  }

  function vueJour() {
    var dt = new Date(), jp = jourPerso(dt), mp = moisPerso(dt), lune = phaseDuJour(dt), i = etapeCourante(), E = ETAPES[i];
    var q = QUESTIONS[Math.floor(dt.getTime() / 864e5) % QUESTIONS.length];
    var dates = datesLignee(dt.getFullYear(), dt.getMonth()).filter(function (x) { return x.j >= dt.getDate() && x.j <= dt.getDate() + 7; }).sort(function (a, b) { return a.j - b.j; });
    var echos = echosAge(dt.getFullYear());
    var h = '<h1 class="pa-h1">' + (D.prenom ? 'Bonjour ' + esc(D.prenom) : 'Ton enquête du jour') + '</h1><p class="pa-sous">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>';
    h += '<section class="pa-carte pa-nuit"><p class="pa-etiq">Ton jour · ' + esc(lune) + '</p>' +
      (jp ? '<p class="pa-gros">' + jp + '</p><p>' + esc((N.JOURNEES || {})[jp] || '') + (mp ? ' Ton mois personnel est un ' + mp + ' : ' + esc(((N.MOIS || {})[mp] || '').replace(/^Un mois pour /, 'un mois pour ')) : '') + '</p>'
        : '<p>Ajoute ta date de naissance complète dans ton arbre (ta fiche « C’est moi ») pour voir ton jour et ton mois personnels.</p>') + '</section>';
    if (!filDepose()) {
      h += '<section class="pa-carte" style="border-color:#B0507A"><p class="pa-etiq">Pour commencer</p><h2>Tire le premier fil</h2><p>Ton enquête commence par ton fil d’or : quelques moments de ta vie, l’âge que tu avais, ce que tu as ressenti. C’est lui qui nourrit ton agenda et tes échos.</p><a class="pa-bt" href="fil-d-or.html">Ouvrir mon fil d’or</a></section>';
    } else if (E) {
      h += '<a class="pa-carte" href="#enquete" data-ouvrir="' + i + '"><p class="pa-etiq">Ton enquête · étape ' + (i + 1) + ' sur ' + ETAPES.length + '</p><h2>' + esc(E.titre) + '</h2><p>' + esc(E.souffle.split('. ')[0]) + '.</p><span class="pa-bt clair">Continuer mon enquête</span></a>';
    } else h += '<section class="pa-carte"><p class="pa-etiq">Ton enquête</p><h2>Tu as fait tout le chemin</h2><p>Ta lignée est en lumière. Tu peux relire chaque étape, et reprendre tes réponses quand tu veux.</p></section>';
    h += '<section class="pa-carte"><p class="pa-etiq">La question du jour</p><p style="font:400 1.15rem/1.45 var(--display);color:#5A2147">' + esc(q) + '</p><p class="pa-discret">Laisse venir la première réponse, sans la juger.</p></section>';
    if (echos.length) h += '<section class="pa-carte"><p class="pa-etiq">Échos d’âge, cette année</p><ul class="pa-liste">' + echos.slice(0, 4).map(function (t) { return '<li><span class="pa-pastille f">✦</span><span>' + esc(t) + '</span></li>'; }).join('') + '</ul><p class="pa-discret">Une piste, pas une prédiction : un âge qui se répond invite à poser une question, à toi ou à ta famille.</p></section>';
    if (dates.length) h += '<section class="pa-carte"><p class="pa-etiq">Dans ta lignée, cette semaine</p><ul class="pa-liste">' + dates.map(function (x) { return '<li><span class="pa-pastille ' + (x.type === 'f' ? 'f' : '') + '">' + x.j + '</span><span>' + esc(x.texte) + (x.ans > 0 ? ' · il y a ' + x.ans + ' ans' : '') + '</span></li>'; }).join('') + '</ul><a class="pa-bt clair" href="#agenda">Voir mon agenda</a></section>';
    afficher(h);
  }

  function vueEnquete() {
    var faites = ETAPES.filter(function (e) { return D.etat.faites[e.id]; }).length, i0 = etapeCourante();
    var h = '<h1 class="pa-h1">Mon enquête</h1><p class="pa-sous">Une étape après l’autre. Chacune s’ouvre quand tu as terminé la précédente : prends le temps qu’il faut.</p>' +
      '<section class="pa-carte"><p class="pa-etiq">Ton chemin</p><div class="pa-jauge"><i style="width:' + Math.round(faites / ETAPES.length * 100) + '%"></i></div><p class="pa-discret" style="margin:0">' + faites + ' étape' + (faites > 1 ? 's' : '') + ' sur ' + ETAPES.length + '</p></section><ol class="pa-chemin">';
    ETAPES.forEach(function (E, i) {
      var f = !!D.etat.faites[E.id], o = ouverte(i), cl = f ? 'fait' : i === i0 ? 'encours' : o ? '' : 'ferme';
      h += '<li><button type="button" class="pa-etape ' + cl + '" data-ouvrir="' + i + '"' + (o ? '' : ' aria-disabled="true"') + '><span class="pa-num">' + (f ? '✓' : i + 1) + '</span><span><b>' + esc(E.titre) + '</b><span>' + esc(f ? 'Terminée' : o ? E.court + ' · à explorer' : 'S’ouvrira après l’étape ' + i) + '</span></span><em>' + (i === i0 ? 'En cours' : '') + '</em></button></li>';
    });
    h += '</ol><a class="pa-carte pa-livre" href="enquete-de-ma-lignee.html"><img src="assets/livres/enquete-de-ma-lignee-3d.webp" alt="" width="64" height="106" loading="lazy"><span><b>Le livre « L’enquête de ma lignée »</b><span>Pour écrire ton enquête à la main, la remplir en famille et la transmettre : 166 pages, 18 thèmes expliqués.</span></span></a>';
    if (D.user && !D.accord && !EXEMPLE) h += '<div id="pa-coffre"></div>';
    afficher(h);
    var z = document.getElementById('pa-coffre');
    if (z && window.GenesoliaCoffre) window.GenesoliaCoffre.demander(z, sb, function () { D.accord = true; sauver(); });
  }

  /* une étape, dans un panneau qui monte du bas */
  function ouvrirEtape(i) {
    var E = ETAPES[i]; if (!E || !ouverte(i)) return;
    if (!D.etat.debut[E.id]) { D.etat.debut[E.id] = iso(new Date()); sauver(); }
    var R = D.etat.reponses[E.id] || {}, f = !!D.etat.faites[E.id], bloque = E.condition === 'fil' && !filDepose();
    var h = '<p class="pa-etiq">Étape ' + (i + 1) + ' sur ' + ETAPES.length + '</p><h2>' + esc(E.titre) + '</h2><p class="pa-souffle">' + esc(E.souffle) + '</p>' +
      '<div class="pa-bloc"><h3>Ton enquête</h3><ul>' + E.enquete.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (E.outils.length ? '<div class="pa-outils" style="margin-top:.6rem">' + E.outils.map(function (o) { return '<a class="pa-bt clair" href="' + esc(o[1]) + '">' + esc(o[0]) + '</a>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="pa-bloc pa-q"><h3>Ce que tu ressens</h3>' + E.ressens.map(function (q, k) { return '<label for="pa-r' + k + '">' + esc(q) + '</label><textarea id="pa-r' + k + '" data-r="' + k + '" maxlength="3000">' + esc(R[k] || '') + '</textarea>'; }).join('') +
      '<p class="pa-sauve" id="pa-sauve">' + (D.accord ? 'Tes réponses sont gardées dans ton espace, chiffrées. Genesolia ne les lit pas.' : 'Tes réponses restent sur cet appareil.') + '</p></div>' +
      '<div class="pa-bloc pa-geste"><h3>Le geste invisible</h3><p style="margin:0">' + esc(E.geste) + '</p></div>' +
      '<div class="pa-bloc"><a class="pa-livre" href="enquete-de-ma-lignee.html"><img src="assets/livres/enquete-de-ma-lignee-3d.webp" alt="" width="64" height="106" loading="lazy"><span><b>Pour aller plus loin, dans le livre</b><span>' + esc(E.livre) + '</span></span></a></div>' +
      (bloque ? '<p class="pa-discret" style="color:#9A3A68">Pour terminer cette étape, dépose au moins un moment dans ton fil d’or.</p>' : '') +
      '<p><button type="button" class="pa-bt' + (f ? ' clair' : ' or') + '" data-faite="' + i + '"' + (bloque ? ' disabled' : '') + '>' + (f ? 'Étape terminée ✓ (rouvrir)' : 'J’ai terminé cette étape') + '</button></p>';
    feuille(h);
    var c = document.querySelector('.pa-f-corps');
    c.addEventListener('input', function (e) { var t = e.target.closest('[data-r]'); if (!t) return; var r = D.etat.reponses[E.id] = D.etat.reponses[E.id] || {}; r[t.getAttribute('data-r')] = t.value; sauver(); });
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-faite]'); if (!b) return;
      if (D.etat.faites[E.id]) delete D.etat.faites[E.id]; else D.etat.faites[E.id] = iso(new Date());
      sauver(); fermerFeuille(); router();
    });
  }
  function feuille(h) {
    fermerFeuille();
    var v = document.createElement('div'); v.className = 'pa-voile'; v.addEventListener('click', fermerFeuille);
    var f = document.createElement('section'); f.className = 'pa-feuille'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    f.innerHTML = '<div class="pa-f-tete"><button type="button" class="pa-f-fermer" aria-label="Fermer">×</button></div><div class="pa-f-corps">' + h + '</div>';
    f.querySelector('.pa-f-fermer').addEventListener('click', fermerFeuille);
    document.body.appendChild(v); document.body.appendChild(f);
    requestAnimationFrame(function () { v.classList.add('ouvert'); f.classList.add('ouvert'); });
  }
  function fermerFeuille() { document.querySelectorAll('.pa-voile,.pa-feuille').forEach(function (x) { x.remove(); }); }

  /* ───── L'agenda de la lignée ───── */
  var vueMois = null, jourChoisi = null;
  function evenements(a, m) {
    var E = {}, L = lunesDuMois(a, m);
    function add(j, e) { (E[j] = E[j] || []).push(e); }
    datesLignee(a, m).forEach(function (x) { add(x.j, { type: x.type, cle: x.cle, texte: x.texte + (x.ans > 0 ? ' · il y a ' + x.ans + ' ans' : '') }); });
    Object.keys(L).forEach(function (k) { var d = +k.slice(8, 10); add(d, { type: 'm', cle: 'lune-' + k, texte: L[k] }); });
    var notes = D.etat.notes || {};
    Object.keys(notes).forEach(function (k) { if (+k.slice(0, 4) === a && +k.slice(5, 7) === m + 1) (notes[k] || []).forEach(function (t, n) { add(+k.slice(8, 10), { type: 'e', cle: 'note-' + k + '-' + n, texte: t, note: true }); }); });
    return E;
  }
  function vueAgenda() {
    var auj = new Date(); if (!vueMois) vueMois = new Date(auj.getFullYear(), auj.getMonth(), 1);
    var a = vueMois.getFullYear(), m = vueMois.getMonth(), E = evenements(a, m), dec = (new Date(a, m, 1).getDay() + 6) % 7, nb = new Date(a, m + 1, 0).getDate();
    if (!jourChoisi || jourChoisi.getMonth() !== m || jourChoisi.getFullYear() !== a) jourChoisi = auj.getMonth() === m && auj.getFullYear() === a ? auj : new Date(a, m, 1);
    var h = '<h1 class="pa-h1">Mon agenda</h1><p class="pa-sous">Les dates de ta lignée, les lunes et tes jours personnels. Touche un jour pour voir ce qu’il porte, et choisis tes rappels.</p>' +
      '<div class="pa-mois-tete"><button type="button" data-mois="-1" aria-label="Mois précédent">‹</button><h2>' + MOIS[m] + ' ' + a + '</h2><button type="button" data-mois="1" aria-label="Mois suivant">›</button></div>' +
      '<div class="pa-grille">' + JS.map(function (j) { return '<span class="js">' + j + '</span>'; }).join('');
    for (var k = 0; k < dec; k++) h += '<span class="pa-jour vide"></span>';
    for (var j = 1; j <= nb; j++) {
      var dt = new Date(a, m, j), ev = E[j] || [], jp = jourPerso(dt), cl = (iso(dt) === iso(auj) ? ' auj' : '') + (iso(dt) === iso(jourChoisi) ? ' choisi' : '');
      h += '<button type="button" class="pa-jour' + cl + '" data-jour="' + j + '"><span class="n">' + j + '</span>' + (jp ? '<span class="jp">' + jp + '</span>' : '') + '<span class="pts">' + ev.slice(0, 4).map(function (e) { return '<i class="' + e.type + '"></i>'; }).join('') + '</span></button>';
    }
    h += '</div><p class="pa-legende"><span><i style="background:#2E1338"></i>naissance</span><span><i style="background:#B0507A"></i>départ</span><span><i style="background:#6E9BC8"></i>lune</span><span><i style="background:#B98A55"></i>ta note</span><span style="font-family:var(--display);color:#B98A55">5</span>&nbsp;jour personnel</p>';
    h += '<section class="pa-carte" id="pa-jour-detail"></section>';
    var nR = Object.keys(D.etat.rappels || {}).length;
    h += '<section class="pa-carte"><p class="pa-etiq">Mes rappels</p><p>' + (nR ? nR + ' rappel' + (nR > 1 ? 's choisis' : ' choisi') + '. ' : 'Touche la cloche d’une date pour la choisir. ') + 'Ajoute-les ensuite au calendrier de ton téléphone : chaque rappel revient tous les ans, la veille au soir et le jour même.</p>' +
      '<button type="button" class="pa-bt' + (nR ? '' : ' clair') + '" data-ics' + (nR ? '' : ' disabled') + '>Ajouter mes rappels à mon calendrier</button></section>';
    if (!filDepose()) h += '<section class="pa-carte"><p class="pa-etiq">Pour un agenda plus riche</p><p>Ton fil d’or et ton arbre (avec les dates complètes) nourrissent ton agenda : plus tu avances dans ton enquête, plus il se remplit.</p><a class="pa-bt clair" href="fil-d-or.html">Mon fil d’or</a></section>';
    afficher(h); detailJour();
  }
  var CLOCHE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  function detailJour() {
    var z = document.getElementById('pa-jour-detail'); if (!z) return;
    var dt = jourChoisi, ev = evenements(dt.getFullYear(), dt.getMonth())[dt.getDate()] || [], jp = jourPerso(dt), k = iso(dt);
    var h = '<p class="pa-etiq">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>';
    if (jp) h += '<p><b style="font-family:var(--display);color:#B98A55;font-size:1.2rem">' + jp + '</b> · ' + esc((N.JOURNEES || {})[jp] || '') + '</p>';
    h += ev.length ? ev.map(function (e) {
      var on = !!(D.etat.rappels || {})[e.cle];
      return '<div class="pa-evt"><p>' + esc(e.texte) + (e.note ? '<small>Ta note</small>' : '') + '</p>' + (e.note ? '<button type="button" class="pa-cloche" data-suppr="' + esc(e.cle) + '" aria-label="Supprimer cette note">×</button>' : '<button type="button" class="pa-cloche" data-rappel="' + esc(e.cle) + '" data-texte="' + esc(e.texte) + '" data-date="' + k + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Retirer le rappel' : 'Me le rappeler') + '">' + CLOCHE + '</button>') + '</div>';
    }).join('') : '<p class="pa-discret">Rien de particulier dans ta lignée ce jour-là.</p>';
    h += '<div class="pa-note"><input type="text" id="pa-note-t" maxlength="140" placeholder="Une intention, un ressenti, un souvenir…" aria-label="Ajouter une note à ce jour"><button type="button" class="pa-bt" style="margin:0" data-note>Noter</button></div>';
    z.innerHTML = h;
  }
  function telechargerIcs() {
    var R = D.etat.rappels || {}, l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Genesolia//Mon enquete//FR', 'CALSCALE:GREGORIAN'];
    Object.keys(R).forEach(function (cle) {
      var r = R[cle], d = String(r.date || '').replace(/-/g, ''); if (!/^\d{8}$/.test(d)) return;
      var annuel = !/^lune-|^note-/.test(cle), t = String(r.texte || '').replace(/[,;\\]/g, ' ');
      l.push('BEGIN:VEVENT', 'UID:' + cle + '@genesolia.fr', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + d, 'SUMMARY:' + t, 'DESCRIPTION:Mon enquête Genesolia · genesolia.fr/pass.html#agenda');
      if (annuel) l.push('RRULE:FREQ=YEARLY');
      l.push('BEGIN:VALARM', 'TRIGGER:-PT15H', 'ACTION:DISPLAY', 'DESCRIPTION:' + t, 'END:VALARM', 'BEGIN:VALARM', 'TRIGGER:PT9H', 'ACTION:DISPLAY', 'DESCRIPTION:' + t, 'END:VALARM', 'END:VEVENT');
    });
    l.push('END:VCALENDAR');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([l.join('\r\n')], { type: 'text/calendar' })); a.download = 'mon-enquete-rappels.ics';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ───── Mon ciel ───── */
  function vueCiel() {
    var dt = new Date(), mp = moisPerso(dt), b = naissance(), ap = b && N ? N.anneePerso(b.j, b.m, dt.getFullYear()) : null;
    var mois = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'][dt.getMonth()];
    var h = '<h1 class="pa-h1">Mon ciel</h1><p class="pa-sous">Tes nombres et ton ciel, reliés à ta lignée.</p>';
    h += '<a class="pa-carte pa-nuit" href="mon-mois.html"><p class="pa-etiq">Ton mois à toi</p><h2>' + (mp ? 'Mois personnel ' + mp : 'Ton mois personnel') + '</h2><p>' + esc(mp ? (N.MOIS || {})[mp] || '' : 'Ton mois personnel, le ciel du mois appliqué à ton thème et les dates de ton arbre.') + '</p><span class="pa-bt or">Ouvrir mon mois</span></a>';
    if (ap) h += '<a class="pa-carte" href="annee-personnelle-' + ap + '-en-' + dt.getFullYear() + '.html"><p class="pa-etiq">Ton année</p><h3>Année personnelle ' + ap + '</h3><p>Ce que ton année t’invite à vivre, mois par mois et dans ton histoire familiale.</p></a>';
    h += '<a class="pa-carte" href="ciel-' + mois + '-' + dt.getFullYear() + '.html"><p class="pa-etiq">Le ciel du mois</p><h3>' + cap(MOIS[dt.getMonth()]) + ' ' + dt.getFullYear() + '</h3><p>Les lunes, les planètes et ce qu’elles éclairent ce mois-ci.</p></a>' +
      '<a class="pa-carte" href="theme-numerologique.html"><p class="pa-etiq">Tes nombres</p><h3>Ton thème numérologique</h3><p>Ton chemin de vie, tes cycles, et les nombres qui reviennent dans ta famille.</p></a>' +
      '<a class="pa-carte" href="theme-astral.html"><p class="pa-etiq">Ton ciel de naissance</p><h3>Ton thème astral</h3><p>Ton Soleil, ta Lune, ton ascendant, et ce que ton ciel partage avec celui des tiens.</p></a>' +
      '<a class="pa-carte" href="arbre-de-vie.html"><p class="pa-etiq">L’arbre de vie</p><h3>Tes dix sphères</h3><p>Une autre lecture de tes nombres, entre racines et lumière.</p></a>';
    afficher(h);
  }
  function vueLivrets() {
    var L = [['Ton livret de numérologie', 'Tes nombres, tes cycles et tes défis, en 30 pages', 'theme-numerologique.html'], ['Ton livret du thème astral', 'Ton ciel de naissance en 10 pages', 'theme-astral.html'], ['Le livret de l’arbre de vie', 'Tes dix sphères et ce qu’elles nourrissent', 'arbre-de-vie.html'], ['Votre analyse à deux', 'Vos signes mayas, ce qui vous rapproche', 'ton-signe-maya.html'], ['Le rapport de ton arbre', 'Chaque répétition expliquée, avec des questions', 'genosociogramme.html'], ['Les 12 saisons', 'Le livret de l’année, mois après mois', 'assets/cercle/les-12-saisons-c4709f2dad.pdf']];
    var h = '<h1 class="pa-h1">Mes livrets</h1><p class="pa-sous">Tous compris dans ton Pass, pour toi et pour tes proches : il suffit de changer la date de naissance.</p><div class="pa-grille-l">' +
      L.map(function (x) { return '<a class="pa-carte" href="' + x[2] + '"' + (/\.pdf$/.test(x[2]) ? ' download' : '') + '><h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></a>'; }).join('') + '</div>' +
      '<a class="pa-carte" href="genosociogramme.html#lumiere" style="margin-top:.9rem"><p class="pa-etiq">Ta lignée en lumière</p><h3>Ton image de protection</h3><p>Chaque personne de ta lignée dans sa sphère de lumière, entre la Terre et le ciel. À télécharger.</p></a>' +
      '<section class="pa-carte" style="background:#FBF4EA;border-color:#EBD3BC"><p class="pa-etiq">Envie d’être accompagnée ?</p><p>Le Cercle t’accompagne pas à pas, avec un carnet chaque mois, des séances audio et la formation. Ton Pass y est compris.</p><a class="pa-bt clair" href="abonnement.html">Découvrir Le Cercle</a></section>';
    afficher(h);
  }

  /* ───── Navigation ───── */
  function router() {
    var h = (location.hash || '').replace('#', '');
    fermerFeuille();
    document.querySelectorAll('.pa-barre [data-onglet]').forEach(function (a) { var o = a.getAttribute('data-onglet'); if ((o === 'jour' && !h) || o === h) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (!D.acces) { document.querySelector('.pa-barre').hidden = true; return vuePorte(); }
    document.querySelector('.pa-barre').hidden = false;
    if (h === 'enquete') vueEnquete(); else if (h === 'agenda') vueAgenda(); else if (h === 'ciel') vueCiel(); else if (h === 'livrets') vueLivrets(); else vueJour();
  }
  window.addEventListener('hashchange', router);
  document.querySelector('.pa-barre').addEventListener('click', function (e) {
    var a = e.target.closest('[data-onglet]'); if (!a) return;
    if (a.getAttribute('data-onglet') === 'jour') { e.preventDefault(); history.pushState(null, '', location.pathname + location.search); router(); }
  });
  vue.addEventListener('click', function (e) {
    var o = e.target.closest('[data-ouvrir]');
    if (o) { e.preventDefault(); var i = +o.getAttribute('data-ouvrir'); if (location.hash !== '#enquete') { location.hash = 'enquete'; setTimeout(function () { ouvrirEtape(i); }, 60); } else ouvrirEtape(i); return; }
    var m = e.target.closest('[data-mois]'); if (m) { vueMois = new Date(vueMois.getFullYear(), vueMois.getMonth() + +m.getAttribute('data-mois'), 1); jourChoisi = null; vueAgenda(); return; }
    var j = e.target.closest('[data-jour]'); if (j) { jourChoisi = new Date(vueMois.getFullYear(), vueMois.getMonth(), +j.getAttribute('data-jour')); document.querySelectorAll('.pa-jour.choisi').forEach(function (x) { x.classList.remove('choisi'); }); j.classList.add('choisi'); detailJour(); return; }
    var r = e.target.closest('[data-rappel]');
    if (r) { var c = r.getAttribute('data-rappel'), R = D.etat.rappels = D.etat.rappels || {}; if (R[c]) delete R[c]; else R[c] = { texte: r.getAttribute('data-texte'), date: r.getAttribute('data-date') }; sauver(); vueAgenda(); return; }
    var s = e.target.closest('[data-suppr]');
    if (s) { var p = s.getAttribute('data-suppr').split('-'), dk = p.slice(1, 4).join('-'), n = +p[4], N2 = D.etat.notes[dk] || []; N2.splice(n, 1); if (!N2.length) delete D.etat.notes[dk]; sauver(); vueAgenda(); return; }
    if (e.target.closest('[data-note]')) { var t = document.getElementById('pa-note-t'), v = t && t.value.trim(); if (!v) return; var k = iso(jourChoisi); (D.etat.notes[k] = D.etat.notes[k] || []).push(v.slice(0, 140)); sauver(); vueAgenda(); return; }
    if (e.target.closest('[data-ics]')) { telechargerIcs(); }
  });

  charger().then(function () { if (!D.etat) D.etat = lireL(CLE) || etatVide(); router(); }, function () { D.etat = etatVide(); router(); });
})();
