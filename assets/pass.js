/* Genesolia · l'appli du Pass, « Mon enquête » (pass.html).
   Quatre espaces liés, en bas sur téléphone et à gauche sur ordinateur :
   1. Moi (#)            : tes repères (astro et nombres), ta base (arbre ou fil d'or), « je dépose un ressenti », tes fils en cours.
   2. Mon fil d'or (#fil): ta base (ton fil d'or et ce qui se répète dans ton arbre) et chaque ressenti devenu un fil à suivre :
                           Voir → À qui ça appartient (moi ou ma lignée, racine ou cœur) → Enquêter → Libérer → La spirale.
   3. Mon agenda (#agenda): les dates de la lignée, les dates qui reviennent, les échos d'âge, les lunes, tes jours personnels,
                           tes ressentis, tes libérations, tes notes et tes rappels (.ics).
   4. Mon bilan (#bilan) : ta lignée en sphères, avec le lien que tu ressens (cercle de lumière : paix ; orange : mitigé),
                           les peurs partagées, les loyautés, et tout ton chemin.
   Données :
   - l'arbre : table arbres (avec « lecture » : ce qui se répète, gardé par genosociogramme.js), sinon cet appareil (geno4) ;
   - le fil d'or : coffre « fil-d-or » (sinon cet appareil) ; un ressenti peut y être ajouté (dans « toi ») ;
   - les repères de naissance : reperes (sinon la fiche « moi » de l'arbre) ;
   - l'enquête (ressentis, liens, notes, rappels) : coffre chiffré « enquete » si la personne a donné son accord,
     sinon seulement sur cet appareil. Genesolia ne lit jamais ces réponses.
   Accès : le Pass ou Le Cercle (GenesoliaAcces.pass). ?exemple : l'appli remplie avec la famille d'exemple. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var sb = null; try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var PISTES = window.PASS_ENQUETE || [], QUESTIONS = window.PASS_QUESTIONS || [], PF = window.PASS_FIL || {}, N = window.Numerologie, A = window.Astronomy;
  var EXEMPLE = /[?&]exemple\b/.test(location.search);
  var vue = document.getElementById('pa-vue');
  var D = { user: null, acces: false, arbre: null, fil: null, naissance: null, prenoms: '', nom: '', prenom: '', etat: null, accord: false, cercle: false, pro: false };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var JS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
  var EVT = { deuil: 'un deuil', 'deces-precoce': 'un départ trop tôt', rupture: 'une séparation', abandon: 'un abandon', secret: 'un secret', guerre: 'une guerre ou un exil', demenagement: 'un départ, un déracinement', pauvrete: 'un manque d’argent', faillite: 'une perte de biens', heritage: 'un héritage difficile', 'perte-emploi': 'une perte de travail', ascension: 'une ascension', declassement: 'un déclassement', 'hors-mariage': 'une naissance hors mariage', maladie: 'une épreuve', sacrifice: 'un effacement', trahison: 'une trahison', injustice: 'une injustice', honte: 'une honte', mariage: 'un mariage', naissance: 'une naissance', reussite: 'une réussite' };
  var ETAPES = PF.ETAPES || [];

  function esc(t) { return String(t == null ? '' : t).replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }   /* espaces insécables avant ? ! : ; » */
  function lireL(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function ecrireL(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function cap(t) { t = String(t || ''); return t.charAt(0).toUpperCase() + t.slice(1); }
  function prenom1(p) { return String((p && p.prenom) || '').trim().split(/\s+/)[0] || 'Quelqu’un'; }
  function dateComplete(t) { var m = String(t || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { a: +m[1], m: +m[2], j: +m[3] } : null; }
  function dateCourte(k) { var d = dateComplete(k); return d ? d.j + ' ' + MOIS[d.m - 1] + ' ' + d.a : ''; }
  function ageNum(s) { var m = String(s || '').match(/\d{1,3}/); return m ? +m[0] : null; }
  function liste(l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' et ' + l[l.length - 1]; }

  /* ───── L'état : ressentis, liens, notes et rappels ───── */
  var CLE = 'genesolia-enquete', minuteur = null;
  function etatVide() { return { v: 2, ressentis: [], liens: {}, notes: {}, rappels: {} }; }
  function completer(e) {
    e = e || etatVide();
    e.v = 2; e.ressentis = Array.isArray(e.ressentis) ? e.ressentis : []; e.liens = e.liens || {}; e.notes = e.notes || {}; e.rappels = e.rappels || {};
    return e;
  }
  function sauver() {
    if (EXEMPLE) return;
    ecrireL(CLE, D.etat);
    clearTimeout(minuteur);
    marque('Enregistrement…');
    minuteur = setTimeout(function () {
      if (!(sb && D.user && D.accord)) { marque('Gardé sur cet appareil.'); return; }
      window.GenesoliaCoffre.ecrire(sb, D.user, 'enquete', D.etat).then(function (r) { marque(r && r.error ? 'Pas encore enregistré dans ton espace : réessaie dans un instant.' : 'Gardé dans ton espace, chiffré.'); }, function () { marque('Pas encore enregistré dans ton espace : réessaie dans un instant.'); });
    }, 700);
  }
  function marque(t) { document.querySelectorAll('[data-sauve]').forEach(function (z) { z.textContent = t; }); }

  /* ───── Le chargement ───── */
  function charger() {
    if (EXEMPLE) return chargerExemple();
    if (!sb) return Promise.resolve();
    return sb.auth.getSession().then(function (r) {
      var s = r && r.data && r.data.session; D.user = s ? s.user : null;
      if (!D.user) return;
      D.accord = !!(window.GenesoliaCoffre && window.GenesoliaCoffre.accord(D.user));
      var C = window.GenesoliaCoffre, GA = window.GenesoliaAcces || {};
      return Promise.all([
        GA.pass ? GA.pass() : Promise.resolve(false),
        sb.from('arbres').select('data').eq('user_id', D.user.id).maybeSingle().then(function (x) { return x && x.data ? x.data.data : null; }, function () { return null; }),
        C && D.accord ? C.lire(sb, D.user, 'fil-d-or').then(function (x) { return x && x.etat ? x.etat : null; }, function () { return null; }) : Promise.resolve(null),
        window.GenesoliaReperes ? window.GenesoliaReperes.lire(sb, D.user) : Promise.resolve(null),
        C && D.accord ? C.lire(sb, D.user, 'enquete').then(function (x) { return x; }, function () { return null; }) : Promise.resolve(null),
        GA.membre ? GA.membre() : Promise.resolve(false),
        sb.from('praticiens').select('user_id').eq('user_id', D.user.id).then(function (x) { return !!(x && x.data && x.data.length); }, function () { return false; })
      ]).then(function (x) {
        D.acces = !!x[0];
        D.arbre = x[1] && x[1].people && Object.keys(x[1].people).length ? x[1] : lireL('geno4');
        D.fil = x[2] || lireL('genesolia-arbre-ressentis');
        if (x[3] && x[3].date) { D.naissance = x[3].date; D.prenoms = x[3].prenoms || ''; D.nom = x[3].nom || ''; D.prenom = x[3].prenom; }
        D.etat = completer(x[4] || lireL(CLE));
        D.cercle = !!x[5]; D.pro = !!x[6];
      });
    });
  }
  function chargerExemple() {
    D.acces = true; D.user = { id: 'exemple' }; D.prenom = 'Léa';
    return fetch('assets/exemple-genosociogramme.json').then(function (r) { return r.json(); }).then(function (a) {
      D.arbre = a;
      D.arbre.lecture = { reps: [{ type: 'anniversaire', label: 'Syndrome anniversaire : Hélène Durand', desc: 'Tu as 32 ans. Hélène Durand a vécu « séparation » à 32 ans, l’âge que tu as aujourd’hui.' }, { type: 'date', jm: '12/11', label: 'Une date qui revient : le 12 novembre', desc: 'naissance de Paul, décès de Marcel.' }, { type: 'schema', label: 'Des femmes qui s’effacent', desc: 'Hélène, Jeanne.' }] };
      D.fil = { personnes: { toi: { rel: 'toi', prenom: 'Léa', etapes: [{ age: '8', evt: 'Le départ de mon père', em: ['Tristesse'], bl: ['abandon'] }, { age: '31', evt: 'Ma séparation', em: ['Peur', 'Solitude'], bl: ['abandon'] }] }, m: { rel: '', prenom: 'Hélène', etapes: [{ age: '32', evt: 'Son divorce', em: ['Colère', 'Solitude'], bl: ['abandon'] }] }, mm: { rel: '', prenom: 'Jeanne', etapes: [{ age: '30', evt: 'Veuve avec trois enfants', em: ['Peur de manquer'], bl: [] }] } }, ordre: ['m', 'mm'] };
      var auj = new Date(), il = function (j) { return iso(new Date(auj.getTime() - j * 864e5)); };
      D.etat = completer({
        ressentis: [
          { id: 'r1', date: il(3), quoi: 'Mon amie a annulé notre week-end au dernier moment, je me suis sentie comme une petite fille laissée sur le quai.', em: ['Tristesse', 'Solitude'], bl: ['abandon'], force: 8, corps: ['La gorge'], revient: 'oui', ages: '8, 31', phrase: 'On finit toujours par me laisser', aqui: 'parent', qui: 'a:p2', cycle: 'coeur', nom: 'la mémoire d’abandon', etape: 2, enquete: { q: {} }, intuition: {} },
          { id: 'r2', date: il(40), quoi: 'Une angoisse en regardant mon compte en banque, alors que tout va bien.', em: ['Peur de manquer'], bl: [], force: 6, corps: ['Le ventre'], revient: 'oui', ages: '', phrase: 'L’argent ne dure jamais', aqui: 'loin', qui: 'a:p4', cycle: 'racine', nom: 'la mémoire de peur de manquer', etape: 4, libere: il(20), geste: 'Mettre 5 € de côté', gesteDate: il(19), enquete: { q: {} }, intuition: {} }
        ],
        liens: { 'a:p2': { t: 'mitige', peurs: ['Peur d’être abandonné·e'], loyaute: true, note: 'Beaucoup d’amour, et la même peur d’être quittée.' }, 'a:p4': { t: 'paix', peurs: ['Peur de manquer'] } }
      });
      D.etat.reves = [{ id: 'v1', date: il(5), texte: 'J’étais dans la maison de Jeanne, l’eau montait dans la cuisine et je cherchais ma valise.', types: ['symbole', 'lignee'], symboles: ['Maison', 'Eau', 'Perdre quelque chose'], em: ['Peur'], qui: ['a:p4'] }];
      var r2 = D.etat.ressentis[1]; r2.porte = 'lignee'; r2.intention = 'Je suis en sécurité. Je peux recevoir et garder.'; r2.intentionPosee = il(18); r2.vois = 'Je vois que la peur de manquer de Jeanne vit dans mon ventre.'; r2.voisDate = il(30); r2.roles = ['sauveur'];
      D.etat.humeurs = {}; D.etat.humeurs[il(0)] = ['Paix']; D.etat.humeurs[il(2)] = ['Fatigue', 'Inquiétude']; D.etat.humeurs[il(3)] = ['Tristesse']; D.etat.humeurs[il(6)] = ['Joie'];
    });
  }

  /* ───── Toi : naissance, nombres, ciel ───── */
  function moiDeLArbre() { var P = (D.arbre && D.arbre.people) || {}; for (var k in P) if (P[k].role === 'moi') return P[k]; return null; }
  function naissance() { var d = dateComplete(D.naissance); if (d) return d; var m = moiDeLArbre(); return m ? dateComplete(m.naiss) : null; }
  function ageA(dt) { var b = naissance(); if (!b) return null; var a = dt.getFullYear() - b.a; if (dt.getMonth() + 1 < b.m || (dt.getMonth() + 1 === b.m && dt.getDate() < b.j)) a--; return a; }
  function jourPerso(dt) { var b = naissance(); if (!b || !N) return null; var ap = N.anneePerso(b.j, b.m, dt.getFullYear()), mp = N.reduire(ap + dt.getMonth() + 1, false); return N.reduire(mp + dt.getDate(), false); }
  function moisPerso(dt) { var b = naissance(); if (!b || !N) return null; return N.reduire(N.anneePerso(b.j, b.m, dt.getFullYear()) + dt.getMonth() + 1, false); }
  function chemin() {
    var b = naissance(); if (!b || !N) return null;
    try { var m = moiDeLArbre(), t = N.theme(D.prenoms || (m && m.prenom) || D.prenom || '', D.nom || (m && m.nom) || '', b.a + '-' + ('0' + b.m).slice(-2) + '-' + ('0' + b.j).slice(-2)); return t && t.chemin ? t.chemin : null; } catch (e) { return null; }
  }
  var SIGNES = [[1, 20, 'Capricorne'], [2, 19, 'Verseau'], [3, 21, 'Poissons'], [4, 20, 'Bélier'], [5, 21, 'Taureau'], [6, 21, 'Gémeaux'], [7, 23, 'Cancer'], [8, 23, 'Lion'], [9, 23, 'Vierge'], [10, 23, 'Balance'], [11, 22, 'Scorpion'], [12, 22, 'Sagittaire']];
  function signeDe(d) { if (!d) return null; var s = SIGNES[d.m - 1]; return d.j < s[1] ? s[2] : (SIGNES[d.m % 12][2]); }
  function soleil() { return signeDe(naissance()); }
  function cheminDe(d) { if (!d || !N) return null; var t = String(d.a) + ('0' + d.m).slice(-2) + ('0' + d.j).slice(-2); return N.reduire(t.split('').reduce(function (x, c) { return x + +c; }, 0), true); }
  /* Ce que tu partages avec quelqu'un de ta lignée : chemin de vie, signe, jour ou mois de naissance */
  function communs(p) {
    var b = naissance(), d = p && p.anneeN; if (!b || !d) return [];
    var l = [], c1 = cheminDe(b), c2 = cheminDe(d), s1 = signeDe(b), s2 = signeDe(d);
    if (c1 && c1 === c2) l.push('le même chemin de vie, ' + c1);
    if (s1 && s1 === s2) l.push('le même Soleil, en ' + s1);
    if (b.j === d.j && b.m === d.m) l.push('le même jour d’anniversaire');
    else if (b.j === d.j) l.push('le même jour de naissance dans le mois, le ' + d.j);
    else if (b.m === d.m) l.push('le même mois de naissance');
    return l;
  }
  var LUNES = {};
  function lunesDuMois(a, m) {
    var k = a + '-' + m; if (LUNES[k]) return LUNES[k];
    var r = {}; if (!A) return r;
    [[0, 'Nouvelle lune'], [180, 'Pleine lune']].forEach(function (ph) {
      var t = new Date(a, m, 1), fin = new Date(a, m + 1, 1);
      for (var i = 0; i < 3; i++) { var x = A.SearchMoonPhase(ph[0], t, 40); if (!x || x.date >= fin) break; r[iso(x.date)] = ph[1]; t = new Date(x.date.getTime() + 864e5); }
    });
    LUNES[k] = r; return r;
  }
  /* La phase du jour : la nouvelle lune, le premier quartier, la pleine lune et le dernier quartier seulement le jour exact */
  function phaseDuJour(dt) {
    if (!A) return '';
    var d0 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()), d1 = new Date(d0.getTime() + 864e5), nom = '';
    [[0, 'Nouvelle lune'], [90, 'Premier quartier'], [180, 'Pleine lune'], [270, 'Dernier quartier']].forEach(function (x) { if (nom) return; var t = A.SearchMoonPhase(x[0], d0, 1.2); if (t && t.date < d1) nom = x[1]; });
    if (nom) return nom;
    var ph = A.MoonPhase(new Date(d0.getTime() + 432e5));
    return ph < 90 ? 'Premier croissant' : ph < 180 ? 'Lune gibbeuse croissante' : ph < 270 ? 'Lune gibbeuse décroissante' : 'Dernier croissant';
  }

  /* ───── La lignée : personnes, générations et liens avec toi ───── */
  var BASE_FIL = { p: ['Ton père', 1, 'm'], m: ['Ta mère', 1, 'f'], pp: ['Ton grand-père paternel', 2, 'm'], pm: ['Ta grand-mère paternelle', 2, 'f'], mp: ['Ton grand-père maternel', 2, 'm'], mm: ['Ta grand-mère maternelle', 2, 'f'] };
  var REL_FIL = { frere: ['Ton frère', 0, 'm'], soeur: ['Ta sœur', 0, 'f'], enfant: ['Ton enfant', -1, 'u'], tante_m: ['Ta tante maternelle', 1, 'f'], oncle_m: ['Ton oncle maternel', 1, 'm'], tante_p: ['Ta tante paternelle', 1, 'f'], oncle_p: ['Ton oncle paternel', 1, 'm'] };
  var CACHE_P = null;
  function personnes() {
    if (CACHE_P) return CACHE_P;
    var l = [], P = (D.arbre && D.arbre.people) || {}, R = (D.arbre && D.arbre.rels) || [], moi = moiDeLArbre();
    if (moi && Object.keys(P).length > 1) {
      var par = {}, enf = {}, cpl = {};
      R.forEach(function (r) {
        if (r.type === 'parent') { (par[r.to] = par[r.to] || []).push(r.from); (enf[r.from] = enf[r.from] || []).push(r.to); }
        else if (r.type === 'couple') { (cpl[r.from] = cpl[r.from] || []).push(r.to); (cpl[r.to] = cpl[r.to] || []).push(r.from); }
      });
      var gen = {}, file = [moi.id]; gen[moi.id] = 0;
      while (file.length) {
        var x = file.shift();
        (par[x] || []).forEach(function (y) { if (gen[y] == null) { gen[y] = gen[x] + 1; file.push(y); } });
        (enf[x] || []).forEach(function (y) { if (gen[y] == null) { gen[y] = gen[x] - 1; file.push(y); } });
        (cpl[x] || []).forEach(function (y) { if (gen[y] == null) { gen[y] = gen[x]; file.push(y); } });
      }
      var anc = {}; (function monter(id, n) { (par[id] || []).forEach(function (y) { anc[y] = n; monter(y, n + 1); }); })(moi.id, 1);
      var desc = {}; (function descendre(id, n) { (enf[id] || []).forEach(function (y) { desc[y] = n; descendre(y, n + 1); }); })(moi.id, 1);
      var freres = {}; (par[moi.id] || []).forEach(function (pp) { (enf[pp] || []).forEach(function (y) { if (y !== moi.id) freres[y] = 1; }); });
      Object.keys(P).forEach(function (id) {
        if (id === moi.id || gen[id] == null) return;
        var p = P[id], f = p.sex === 'f', g = gen[id], lien;
        if (anc[id] === 1) lien = f ? 'Ta mère' : 'Ton père';
        else if (anc[id] === 2) lien = f ? 'Ta grand-mère' : 'Ton grand-père';
        else if (anc[id]) lien = f ? 'Ton aïeule' : 'Ton aïeul';
        else if (desc[id] === 1) lien = f ? 'Ta fille' : p.sex === 'm' ? 'Ton fils' : 'Ton enfant';
        else if (desc[id]) lien = f ? 'Ta petite-fille' : 'Ton petit-fils';
        else if (freres[id]) lien = f ? 'Ta sœur' : 'Ton frère';
        else if ((cpl[moi.id] || []).indexOf(id) >= 0) lien = 'Ton couple';
        else lien = g >= 2 ? (f ? 'Ton aïeule' : 'Ton aïeul') : g === 1 ? (f ? 'Ta tante' : 'Ton oncle') : g === 0 ? 'Ta famille' : (f ? 'Ta nièce' : 'Ton neveu');
        var proche = anc[id] === 1 || desc[id] === 1 || freres[id] || lien === 'Ton couple';
        l.push({ k: 'a:' + id, id: id, prenom: prenom1(p), lien: lien, gen: g, f: f, parti: !!p.deces, anneeD: dateComplete(p.deces), anneeN: dateComplete(p.naiss), rang: proche ? 1 : (anc[id] === 2 || desc[id] === 2 || Math.abs(g) === 1) ? 2 : 3 });
      });
    } else {
      var F = (D.fil && D.fil.personnes) || {};
      Object.keys(F).forEach(function (id) {
        if (id === 'toi') return; var p = F[id], b = BASE_FIL[id] || REL_FIL[p.rel], g = b ? b[1] : (/^[pm]{3}$/.test(id) ? 3 : 1);
        var lien = b ? b[0] : /^[pm]{3}$/.test(id) ? (id.slice(-1) === 'm' ? 'Une arrière-grand-mère' : 'Un arrière-grand-père') : 'Ta famille';
        l.push({ k: 'f:' + id, id: id, prenom: p.prenom || lien.replace(/^(Ton|Ta|Une|Un) /, ''), lien: lien, gen: g, f: b ? b[2] === 'f' : /m$/.test(id), parti: false, rang: Math.abs(g) <= 1 && !/^(tante|oncle)/.test(p.rel || '') ? 1 : g === 2 || /^(tante|oncle)/.test(p.rel || '') ? 2 : 3 });
      });
    }
    CACHE_P = l; return l;
  }
  function personne(k) { var l = personnes(); for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i]; return null; }
  function nomPers(k) { var p = personne(k); return p ? p.prenom + ' (' + p.lien.toLowerCase() + ')' : ''; }

  /* ───── Le fil d'or ───── */
  function filPersonnes() { var p = (D.fil && D.fil.personnes) || {}; return Object.keys(p).filter(function (k) { var x = p[k]; return x && (x.prenom || (x.etapes || []).some(plein)); }); }
  function plein(e) { return !!(e && (e.age || e.evt || e.texte)); }
  function nbMoments() { var p = (D.fil && D.fil.personnes) || {}, n = 0; Object.keys(p).forEach(function (k) { n += (p[k].etapes || []).filter(plein).length; }); return n; }
  function nomFil(id) { if (id === 'toi') return 'Toi'; var p = (D.fil.personnes || {})[id] || {}, b = BASE_FIL[id] || REL_FIL[p.rel]; var l = b ? b[0].toLowerCase() : 'quelqu’un de ta lignée'; return p.prenom ? p.prenom + ', ' + l : cap(l); }
  /* Toujours le lien de parenté après le prénom (deux Jeanne ne se confondent pas) */
  function nomL(p) { return p ? p.prenom + ', ' + p.lien.toLowerCase() : ''; }
  function nomA(k, P) { var x = personne('a:' + k); return x ? nomL(x) : prenom1(P[k]); }
  function nbArbre() { return Object.keys((D.arbre && D.arbre.people) || {}).length; }
  function baseOk() { return nbArbre() >= 3 || nbMoments() >= 1; }
  function reps() { return (D.arbre && D.arbre.lecture && D.arbre.lecture.reps) || []; }
  /* Un ressenti ajouté au fil d'or, dans « toi » (le fil d'or s'ouvre ensuite avec ce moment) */
  function ajouterAuFil(r) {
    var F = D.fil && D.fil.personnes && D.fil.personnes.toi ? D.fil : { v: 1, ordre: [], seq: 0, visionsPerso: [], personnes: { toi: { id: 'toi', rel: '', prenom: D.prenom || '', global: { bl: [], em: [], vi: [] }, etapes: [] } } };
    var t = F.personnes.toi; t.etapes = (t.etapes || []).filter(plein);
    var age = ageA(new Date());
    var vi = [];
    if (r.phrase) { vi.push(r.phrase); F.visionsPerso = F.visionsPerso || []; if (F.visionsPerso.indexOf(r.phrase) < 0) F.visionsPerso.push(r.phrase); }
    t.etapes.push({ age: age != null ? String(age) : '', evt: String(r.quoi || '').slice(0, 140), bl: (r.bl || []).slice(), em: (r.em || []).slice(), vi: vi, texte: 'Déposé dans Mon enquête le ' + dateCourte(r.date) + '.' });
    D.fil = F; r.fil = true;
    sauverFil(true);
  }
  var minuteurFil = null;
  function sauverFil(tout) {
    CACHE_P = null;
    if (EXEMPLE) return;
    clearTimeout(minuteurFil);
    minuteurFil = setTimeout(function () {
      var maj = new Date().toISOString();
      try { localStorage.setItem('genesolia-arbre-ressentis', JSON.stringify(D.fil)); localStorage.setItem('genesolia-arbre-ressentis-maj', maj); } catch (e) {}
      if (sb && D.user && D.accord) window.GenesoliaCoffre.ecrire(sb, D.user, 'fil-d-or', { etat: D.fil, maj: maj, v: 1 });
    }, tout ? 0 : 700);
  }
  function filEtat() {
    if (!D.fil || !D.fil.personnes || !D.fil.personnes.toi) D.fil = { v: 1, ordre: [], seq: 0, visionsPerso: [], personnes: { toi: nouvPers('toi', '') } };
    D.fil.ordre = D.fil.ordre || []; return D.fil;
  }
  function nouvPers(id, rel) { return { id: id, rel: rel || '', prenom: '', global: { bl: [], em: [], vi: [] }, etapes: [] }; }
  function etiquetteFil(id) { if (id === 'toi') return 'Toi'; var p = D.fil.personnes[id] || {}, b = BASE_FIL[id] || REL_FIL[p.rel]; return b ? b[0].replace(/^(Ton|Ta) /, '').replace(/^./, function (c) { return c.toUpperCase(); }) : /^[pm]{3}$/.test(id) ? (id.slice(-1) === 'm' ? 'Arrière-grand-mère' : 'Arrière-grand-père') : 'Quelqu’un'; }

  /* ───── Les échos : ce qui, dans ta lignée, répond à un ressenti ───── */
  function echosRessenti(r) {
    var l = [], F = (D.fil && D.fil.personnes) || {}, age = r.date ? ageA(new Date(r.date)) : null;
    Object.keys(F).forEach(function (id) {
      if (id === 'toi') return;
      (F[id].etapes || []).forEach(function (e) {
        var com = (e.em || []).filter(function (x) { return (r.em || []).indexOf(x) >= 0; }), bl = (e.bl || []).filter(function (x) { return (r.bl || []).indexOf(x) >= 0; });
        var ea = ageNum(e.age);
        if (com.length) l.push('La même émotion chez ' + nomFil(id) + ' : ' + com.join(', ').toLowerCase() + (e.evt ? ', « ' + e.evt + ' »' : '') + (ea != null ? ', à ' + ea + ' ans' : '') + '.');
        else if (bl.length) l.push('La même blessure chez ' + nomFil(id) + (e.evt ? ' : « ' + e.evt + ' »' : '') + '.');
        else if (age != null && ea != null && Math.abs(ea - age) <= 1 && e.evt) l.push(nomFil(id) + ' avait ton âge : « ' + e.evt + ' », à ' + ea + ' ans.');
      });
    });
    var P = (D.arbre && D.arbre.people) || {}, moi = moiDeLArbre();
    if (age != null) Object.keys(P).forEach(function (k) {
      if (moi && k === moi.id) return;
      (P[k].events || []).forEach(function (e) { if (Math.abs(+e.age - age) <= 1 && EVT[e.type]) l.push(nomA(k, P) + ' a vécu ' + EVT[e.type] + ' à ' + e.age + ' ans, à peu près ton âge ce jour-là.'); });
    });
    return l.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 6);
  }
  function cycleSuggere(r) {
    var em = (r.em || []).join(' '), bl = (r.bl || []).join(' ');
    var ra = /manquer|Impuissance|Honte/.test(em) || /humiliation|injustice|rejet/.test(bl), co = /Solitude|Tristesse/.test(em) || /abandon|trahison/.test(bl);
    return ra && co ? 'deux' : ra ? 'racine' : co ? 'coeur' : '';
  }

  /* ───── Affichage ───── */
  function afficher(h) { vue.innerHTML = h; window.scrollTo(0, 0); }
  function feuille(h) {
    document.querySelectorAll('.pa-voile,.pa-feuille').forEach(function (x) { x.remove(); });
    var v = document.createElement('div'); v.className = 'pa-voile'; v.addEventListener('click', fermerFeuille);
    var f = document.createElement('section'); f.className = 'pa-feuille'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    f.innerHTML = '<div class="pa-f-tete"><button type="button" class="pa-f-fermer" aria-label="Fermer">×</button></div><div class="pa-f-corps">' + h + '</div>';
    f.querySelector('.pa-f-fermer').addEventListener('click', fermerFeuille);
    document.body.appendChild(v); document.body.appendChild(f); document.body.classList.add('pa-fige');
    requestAnimationFrame(function () { v.classList.add('ouvert'); f.classList.add('ouvert'); });
    return f.querySelector('.pa-f-corps');
  }
  function fermerFeuille() {
    var avait = !!document.querySelector('.pa-feuille');
    document.querySelectorAll('.pa-voile,.pa-feuille').forEach(function (x) { x.remove(); }); document.body.classList.remove('pa-fige');
    if (avait && D.acces) rafraichir();
  }
  var rafraichir = function () {};
  function puces(nom, liste, choisis, multi) {
    return '<div class="pa-puces" data-groupe="' + nom + '"' + (multi ? ' data-multi' : '') + '>' + liste.map(function (x) { var v = Array.isArray(x) ? x[0] : x, t = Array.isArray(x) ? x[1] : x; return '<button type="button" data-v="' + esc(v) + '" aria-pressed="' + ((choisis || []).indexOf(v) >= 0) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
  }
  function lirePuces(z, nom) { var g = z.querySelector('[data-groupe="' + nom + '"]'); return g ? [].map.call(g.querySelectorAll('[aria-pressed="true"]'), function (b) { return b.getAttribute('data-v'); }) : []; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pa-puces button'); if (!b || b.closest('.pa-exemples')) return;
    var g = b.parentNode;
    if (!g.hasAttribute('data-multi')) g.querySelectorAll('button').forEach(function (x) { if (x !== b) x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    g.dispatchEvent(new Event('change', { bubbles: true }));
  });
  function points(r) {
    var n = r.spirale ? ETAPES.length : (r.etape || 0);
    return '<span class="pa-points" aria-label="' + n + ' étape' + (n > 1 ? 's' : '') + ' sur ' + ETAPES.length + '">' + ETAPES.map(function (E, i) { return '<i class="' + (i < n ? 'fait' : i === n ? 'ici' : '') + '"></i>'; }).join('') + '</span>';
  }
  function carteFil(r) {
    var E = ETAPES[Math.min(r.etape || 0, ETAPES.length - 1)];
    return '<button type="button" class="pa-carte pa-fil" data-fil="' + esc(r.id) + '"><span class="pa-etiq">' + esc(dateCourte(r.date)) + (r.spirale ? ' · devenu spirale' : ' · ' + esc(E.titre)) + '</span>' +
      '<b>' + esc(String(r.quoi || 'Un ressenti').slice(0, 110)) + (String(r.quoi || '').length > 110 ? '…' : '') + '</b>' +
      '<span class="pa-ligne">' + ((r.em || []).length ? '<span class="pa-em">' + esc(r.em.join(' · ')) + '</span>' : '<span></span>') + points(r) + '</span></button>';
  }

  /* ── Sans le Pass ── */
  function vuePorte() {
    var u = !!D.user;
    afficher('<section class="pa-carte pa-porte"><img src="assets/icones/pass-192.png" alt="" width="84" height="84" style="border-radius:22px;box-shadow:0 10px 26px rgba(31,11,42,.25)">' +
      '<h1 class="pa-h1">Mon enquête de lignée</h1><p>Un espace pour déposer ce que tu ressens, chercher à qui ça appartient, enquêter dans ta lignée et transformer ce qui tourne en boucle en spirale.</p>' +
      '<ul><li>Moi : tes repères, ton ciel et tes nombres, et un endroit où déposer chaque ressenti</li><li>Mon fil d’or : ta base, et chaque ressenti suivi pas à pas, jusqu’à la libération</li><li>Mon agenda : les dates de ta lignée, ce qui revient, tes ressentis et tes libérations</li><li>Mon bilan : ta lignée en sphères de lumière, avec les liens que tu ressens</li></ul>' +
      '<p><b>Le Pass</b> · 10 € par mois, sans engagement, ou 27 € les 3 mois.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center">' + (u ? '<a class="pa-bt" href="tarifs.html#t-pass">Prendre le Pass</a>' : '<a class="pa-bt" href="login.html?retour=pass.html">Me connecter</a><a class="pa-bt clair" href="tarifs.html#t-pass">Découvrir le Pass</a>') +
      '<a class="pa-bt clair" href="pass.html?exemple">Voir un exemple</a></div></section>');
  }

  /* ── 1. Moi ── */
  function vueMoi() {
    var dt = new Date(), jp = jourPerso(dt), mp = moisPerso(dt), b = naissance(), ap = b && N ? N.anneePerso(b.j, b.m, dt.getFullYear()) : null, ch = chemin(), so = soleil();
    var q = QUESTIONS[Math.floor(dt.getTime() / 864e5) % (QUESTIONS.length || 1)] || '';
    var enCours = D.etat.ressentis.filter(function (r) { return !r.spirale; }).sort(function (x, y) { return x.date < y.date ? 1 : -1; });
    var h = '<h1 class="pa-h1">' + (D.prenom ? 'Bonjour ' + esc(D.prenom) : 'Bonjour') + '</h1><p class="pa-sous">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + ' · ' + esc(phaseDuJour(dt)) + ' <span class="pa-offre">Ton offre : ' + (D.cercle ? 'Le Cercle' : 'Le Pass') + '</span></p><div class="pa-2col"><div>';
    if (!b) {
      h += '<section class="pa-carte" style="border-color:#B0507A"><p class="pa-etiq">Pour commencer · 1 minute</p><h2>Tes repères</h2><p>Ta date de naissance et tes prénoms ouvrent ton ciel et tes nombres : ton chemin de vie, ton année, ton mois et ton jour personnels.</p>' +
        '<form id="pa-reperes" class="pa-form" novalidate><label for="pa-pr">Tes prénoms</label><input id="pa-pr" autocomplete="given-name" maxlength="120" required>' +
        '<label for="pa-nom">Ton nom de naissance</label><input id="pa-nom" autocomplete="family-name" maxlength="80">' +
        '<label for="pa-dn">Ta date de naissance</label><input id="pa-dn" type="date" required min="1900-01-01" max="' + iso(dt) + '">' +
        (D.user && !EXEMPLE ? '<p class="pa-discret">' + ((window.GenesoliaReperes || {}).AVANT || '') + '</p>' : '') +
        '<button class="pa-bt" type="submit">Ouvrir mon ciel</button><p class="pa-erreur" role="alert"></p></form></section>';
    } else {
      h += '<section class="pa-carte pa-nuit"><p class="pa-etiq">Ton ciel et tes nombres</p><div class="pa-chiffres">' +
        (ch ? '<span><b>' + ch + '</b>chemin de vie</span>' : '') + (ap ? '<span><b>' + ap + '</b>année</span>' : '') + (mp ? '<span><b>' + mp + '</b>mois</span>' : '') + (jp ? '<span><b>' + jp + '</b>jour</span>' : '') + '</div>' +
        '<p>' + (so ? 'Soleil en ' + esc(so) + '. ' : '') + esc((N.JOURNEES || {})[jp] || '') + '</p>' +
        '<div class="pa-outils"><a class="pa-bt or" href="mon-mois.html">Mon mois</a><a class="pa-bt nuit" href="theme-numerologique.html">Mes nombres</a><a class="pa-bt nuit" href="theme-astral.html">Mon ciel de naissance</a></div></section>';
    }
    var hm = (D.etat.humeurs || {})[iso(dt)] || [];
    h += '<section class="pa-carte"><p class="pa-etiq">Mon état d’âme aujourd’hui</p>' + puces('humeur', PF.HUMEURS || [], hm, true) + '<p class="pa-discret">Il rejoint ton agenda : avec le temps, tu verras ce qui revient, et quand.</p></section>';
    if (!baseOk()) {
      h += '<section class="pa-carte pa-base"><p class="pa-etiq">Ta base</p><h2>Ce que tu sais déjà</h2><p>Quelques prénoms, des dates, des moments de ta vie : c’est ta base. Ton agenda, tes échos et ton bilan s’en nourrissent. Commence par celui qui te parle le plus.</p>' +
        '<div class="pa-deux"><a href="genosociogramme.html"><b>Mon arbre</b><span>Les personnes, les dates, les métiers : l’arbre repère tout seul ce qui se répète.</span></a><a href="#fil"><b>Mon fil d’or</b><span>Les moments de ta vie et ce que tu as ressenti, puis ceux des tiens.</span></a></div></section>';
    } else {
      var nr = reps().length;
      h += '<a class="pa-carte" href="#fil"><p class="pa-etiq">Ta base</p><p class="pa-stats">' + (nbArbre() ? '<span><b>' + nbArbre() + '</b>personnes dans ton arbre</span>' : '') + (nbMoments() ? '<span><b>' + nbMoments() + '</b>moments dans ton fil d’or</span>' : '') + (nr ? '<span><b>' + nr + '</b>répétitions repérées</span>' : '') + '</p><span class="pa-plus">Voir ma base</span></a>';
    }
    h += '</div><div>';
    h += '<section class="pa-carte pa-depot"><p class="pa-etiq">Quand quelque chose remonte</p><h2>Une émotion, une situation qui se répète ?</h2><p>Au lieu de la garder pour toi, viens la déposer ici. On regarde ensemble à qui elle appartient, et comment la libérer.</p><div class="pa-outils"><button type="button" class="pa-bt or" data-depot>Je dépose un ressenti</button><button type="button" class="pa-bt clair" data-reve="new">Je note un rêve</button></div></section>';
    h += blocIntentions();
    if (enCours.length) h += carteEnCours(enCours[0]) + (enCours.length > 1 ? '<p class="pa-titre-s">Mes autres fils</p><p class="pa-def">Un fil, c’est un ressenti que tu suis jusqu’au bout, étape par étape.</p>' + enCours.slice(1, 3).map(carteFil).join('') + (enCours.length > 3 ? '<a class="pa-bt clair" href="#fil">Voir tous mes fils</a>' : '') : '');
    h += '<section class="pa-carte pa-grande-q"><p class="pa-etiq">La question à te poser, chaque fois</p><p>' + esc(PF.QUESTION || '') + '</p></section>';
    h += '<section class="pa-carte"><p class="pa-etiq">La question du jour</p><p class="pa-q-jour">' + esc(q) + '</p><p class="pa-discret">Laisse venir la première réponse, sans la juger.</p></section>';
    h += '</div></div>';
    if (!D.cercle) h += '<section class="pa-carte pa-cercle-plus"><p class="pa-etiq">Ce que Le Cercle ajoute à ton Pass</p><ul class="pa-echos"><li>Un carnet chaque mois (Renaissance) et un livret pour déposer ce qui se rejoue (Libération)</li><li>Deux séances audio guidées par mois</li><li>La formation « Sors de la boucle », en 8 modules</li><li>Ton guide du mois et la question du mois</li></ul><p class="pa-discret">Tout ce que tu as dans le Pass reste compris.</p><a class="pa-bt clair" href="abonnement.html">Découvrir Le Cercle</a></section>';
    h += '<section class="pa-carte pa-espaces-m"><p class="pa-etiq">Mes espaces</p><div class="pa-outils">' + espacesLiens('pa-bt clair') + '</div></section>';
    h += '<section class="pa-carte"><p class="pa-etiq">Mes livrets, compris dans ton Pass</p><div class="pa-outils">' + [['Mes nombres', 'theme-numerologique.html'], ['Mon thème astral', 'theme-astral.html'], ['L’arbre de vie', 'arbre-de-vie.html'], ['Analyse à deux', 'ton-signe-maya.html'], ['Le rapport de mon arbre', 'genosociogramme.html'], ['Les 12 saisons', 'assets/cercle/les-12-saisons-c4709f2dad.pdf'], ['Ma lignée en lumière', 'genosociogramme.html#lumiere']].map(function (x) { return '<a class="pa-bt clair" href="' + x[1] + '"' + (/\.pdf$/.test(x[1]) ? ' download' : '') + '>' + x[0] + '</a>'; }).join('') + '</div></section>';
    afficher(h);
    var f = document.getElementById('pa-reperes'); if (f) f.addEventListener('submit', garderReperes);
  }
  /* Les intentions posées : la nouvelle lune qui revient, et le corps qui réapprend chaque jour */
  function blocIntentions() {
    var auj = iso(new Date()), I = D.etat.ressentis.filter(function (r) { return r.intentionPosee && !r.spirale; });
    if (!I.length) return '';
    return '<section class="pa-carte pa-intentions"><p class="pa-etiq">Mes intentions posées</p>' + I.map(function (r) {
      var lu = lunesApres(r.intentionPosee, 6), due = lu.filter(function (d) { return d === auj && !((r.lunes || {})[d] && Object.keys(r.lunes[d]).length); })[0], proch = lu.filter(function (d) { return d > auj; })[0], fait = !!(r.corpsJ || {})[auj];
      return '<div class="pa-int"><div class="pa-graine petite"></div><div><p class="pa-int-t">« ' + esc(r.intention || '') + ' »</p>' +
        (due ? '<button type="button" class="pa-bt or" data-fil="' + esc(r.id) + '" data-etape="4">Nouvelle lune : qu’est-ce qui a bougé ?</button>' : '<p class="pa-discret">Elle revient à la nouvelle lune du ' + esc(dateCourte(proch || '')) + '.</p>') +
        '<button type="button" class="pa-corps-j" data-corps-j="' + esc(r.id) + '" aria-pressed="' + fait + '">' + (fait ? '✓ Ton corps a eu sa minute de sécurité aujourd’hui' : 'Ma minute de sécurité pour le corps, aujourd’hui') + '</button></div></div>';
    }).join('') + '</section>';
  }
  /* La libération en cours, avec les personnes concernées */
  function carteEnCours(r) {
    var n = Math.min(r.etape || 0, ETAPES.length - 1), E = ETAPES[n], q = r.qui ? personne(r.qui) : null, L = D.etat.liens || {}, gens = [];
    if (q) gens.push(q);
    echosPers(r).forEach(function (p) { if (gens.indexOf(p) < 0) gens.push(p); });
    var h = '<section class="pa-carte pa-en-cours"><p class="pa-etiq">Ta libération en cours · étape ' + (n + 1) + ' sur ' + ETAPES.length + ' · ' + esc(E.titre) + '</p>' +
      '<h2>' + esc(r.nom ? cap(r.nom) : String(r.quoi || 'Un ressenti').slice(0, 90)) + '</h2>' + ((r.em || []).length ? '<p class="pa-em">' + esc(r.em.join(' · ')) + ' · ' + esc(dateCourte(r.date)) + '</p>' : '') + points(r);
    if (gens.length) h += '<p class="pa-lab">Les personnes concernées</p><ul class="pa-gens">' + gens.slice(0, 4).map(function (p) { var t = (L[p.k] || {}).t; return '<li><button type="button" data-personne="' + esc(p.k) + '"><i class="pa-mini ' + (t || '') + '"></i><span><b>' + esc(p.prenom) + '</b>' + esc(p.lien.toLowerCase()) + (p === q ? ' · à qui ça appartient' : ' · le même ressenti') + '</span></button></li>'; }).join('') + '</ul>';
    else h += '<p class="pa-discret">À qui appartient-elle ? Un parent, plus loin, ou cette vie ? C’est la prochaine question.</p>';
    return h + '<button type="button" class="pa-bt or" data-fil="' + esc(r.id) + '">Continuer</button></section>';
  }
  /* Les personnes de ta lignée qui ont noté la même émotion ou la même blessure dans le fil d'or */
  function echosPers(r) {
    var F = (D.fil && D.fil.personnes) || {}, l = [];
    Object.keys(F).forEach(function (id) {
      if (id === 'toi') return;
      if ((F[id].etapes || []).some(function (e) { return (e.em || []).some(function (x) { return (r.em || []).indexOf(x) >= 0; }) || (e.bl || []).some(function (x) { return (r.bl || []).indexOf(x) >= 0; }); })) {
        var p = personneDuFil(id); if (p) l.push(p);
      }
    });
    return l;
  }
  function personneDuFil(id) {
    var p = personne('f:' + id); if (p) return p;
    var F = (D.fil.personnes || {})[id] || {}, pr = String(F.prenom || '').toLowerCase();
    if (pr) { var l = personnes(); for (var i = 0; i < l.length; i++) if (l[i].prenom.toLowerCase() === pr) return l[i]; }
    return null;
  }
  function espacesLiens(cl) {
    return '<a class="' + cl + '" href="login.html">Mon compte</a>' + (D.cercle ? '<a class="' + cl + '" href="cercle.html">Le Cercle</a>' : '') + (D.pro ? '<a class="' + cl + '" href="pro.html">Genesolia Pro</a>' : '') + '<a class="' + cl + '" href="genosociogramme.html">Mon arbre</a>';
  }
  function garderReperes(e) {
    e.preventDefault();
    var pr = document.getElementById('pa-pr').value.trim(), nom = document.getElementById('pa-nom').value.trim(), dn = document.getElementById('pa-dn').value, err = document.querySelector('#pa-reperes .pa-erreur');
    if (!pr || !/^\d{4}-\d{2}-\d{2}$/.test(dn)) { err.textContent = 'Il manque tes prénoms ou ta date de naissance.'; return; }
    D.naissance = dn; D.prenoms = pr; D.nom = nom; D.prenom = pr.split(/\s+/)[0];
    if (!EXEMPLE && sb && D.user && window.GenesoliaReperes) window.GenesoliaReperes.enregistrer(sb, D.user, { prenoms: pr, nom: nom, date: dn });
    else ecrireL('genesolia-guide', { prenom: D.prenom, prenoms: pr, nom: nom, date: dn });
    vueMoi();
  }

  /* ── Déposer un ressenti ── */
  function ouvrirDepot() {
    var z = feuille('<p class="pa-etiq">Je dépose un ressenti</p><h2>Qu’est-ce qui se passe ?</h2><p class="pa-souffle">' + esc(ETAPES[0] ? ETAPES[0].souffle : '') + '</p>' +
      '<form class="pa-form" id="pa-depot" novalidate><label for="pa-quoi">Ce qui s’est passé, en quelques mots</label><textarea id="pa-quoi" maxlength="1500" placeholder="Ce matin, quand…"></textarea>' +
      '<p class="pa-lab">Ce que tu ressens</p>' + puces('em', PF.EMOTIONS || [], [], true) +
      '<p class="pa-lab">Une blessure qui se réveille ? <small>(si tu la sens)</small></p>' + puces('bl', PF.BLESSURES || [], [], true) +
      '<label for="pa-force">Avec quelle force ? <b id="pa-force-v">5</b>/10</label><input type="range" id="pa-force" min="0" max="10" value="5">' +
      '<p class="pa-lab">Où le sens-tu dans ton corps ?</p>' + puces('corps', PF.CORPS || [], [], true) +
      '<p class="pa-lab">Est-ce que ça revient dans ta vie ?</p>' + puces('revient', [['oui', 'Oui, souvent'], ['parfois', 'Parfois'], ['non', 'C’est la première fois']], [], false) +
      '<div id="pa-ages-z" hidden><label for="pa-ages">À quels âges, à peu près ?</label><input id="pa-ages" maxlength="60" placeholder="8 ans, 31 ans…"></div>' +
      '<label for="pa-phrase">Une phrase qui tourne dans ta tête ? <small>(facultatif)</small></label><input id="pa-phrase" maxlength="120" placeholder="On finit toujours par…">' +
      '<label class="pa-coche"><input type="checkbox" id="pa-afil" checked> Ajouter ce moment à mon fil d’or</label>' +
      '<button class="pa-bt or" type="submit">Déposer</button><p class="pa-erreur" role="alert"></p></form>');
    var f = z.querySelector('#pa-depot');
    f.querySelector('#pa-force').addEventListener('input', function (e) { f.querySelector('#pa-force-v').textContent = e.target.value; });
    f.addEventListener('change', function () { var rv = lirePuces(f, 'revient')[0]; f.querySelector('#pa-ages-z').hidden = !(rv === 'oui' || rv === 'parfois'); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var quoi = f.querySelector('#pa-quoi').value.trim(), em = lirePuces(f, 'em');
      if (!quoi && !em.length) { f.querySelector('.pa-erreur').textContent = 'Écris quelques mots ou choisis ce que tu ressens.'; return; }
      var r = { id: 'r' + Date.now().toString(36), date: iso(new Date()), quoi: quoi, em: em, bl: lirePuces(f, 'bl'), force: +f.querySelector('#pa-force').value, corps: lirePuces(f, 'corps'), revient: lirePuces(f, 'revient')[0] || '', ages: f.querySelector('#pa-ages').value.trim(), phrase: f.querySelector('#pa-phrase').value.trim(), etape: 0, intuition: {}, enquete: { q: {} } };
      if (f.querySelector('#pa-afil').checked) ajouterAuFil(r);
      D.etat.ressentis.push(r); sauver();
      ouvrirFil(r.id);
    });
  }

  /* ── Le chemin d'un ressenti ── */
  function trouver(id) { for (var i = 0; i < D.etat.ressentis.length; i++) if (D.etat.ressentis[i].id === id) return D.etat.ressentis[i]; return null; }
  function ouvrirFil(id, voir) {
    var r = trouver(id); if (!r) return;
    var n = r.spirale ? ETAPES.length - 1 : Math.min(r.etape || 0, ETAPES.length - 1), i = voir != null ? voir : n, E = ETAPES[i];
    var h = '<p class="pa-etiq">' + esc(dateCourte(r.date)) + (r.force != null ? ' · force ' + r.force + '/10' : '') + '</p><h2 class="pa-quoi">' + esc(r.quoi || 'Un ressenti') + '</h2>' +
      ((r.em || []).length ? '<p class="pa-em">' + esc(r.em.join(' · ')) + '</p>' : '') +
      '<ol class="pa-pas">' + ETAPES.map(function (x, k) { var ok = k <= n; return '<li><button type="button" data-pas="' + k + '"' + (ok ? '' : ' disabled') + ' class="' + (k < n || r.spirale ? 'fait' : '') + (k === i ? ' ici' : '') + '"><i>' + (k < n || (r.spirale && k <= n) ? '✓' : k + 1) + '</i><span>' + esc(x.titre) + '</span></button></li>'; }).join('') + '</ol><p class="pa-def">Les 5 étapes d’une mémoire : la voir, la situer sur ta ligne du temps, la libérer, poser une intention, puis réapprendre au quotidien.</p>' +
      '<div class="pa-etape-c"><h3 class="pa-h3">' + esc(E.titre) + '</h3><p class="pa-souffle">' + esc(E.souffle) + '</p>' + contenuEtape(r, E.id) + '</div>' +
      '<p class="pa-discret" data-sauve>' + (D.accord ? 'Gardé dans ton espace, chiffré. Genesolia ne le lit pas.' : 'Gardé sur cet appareil.') + '</p>' +
      '<p class="pa-actions">' + (i === n && !r.spirale ? boutonSuite(r, E.id) : i < n ? '<button type="button" class="pa-bt clair" data-pas="' + n + '">Revenir à l’étape en cours</button>' : '') + '<button type="button" class="pa-lien-s" data-suppr-fil>Supprimer ce ressenti</button></p>';
    var z = feuille(h);
    brancherEtape(z, r, i);
  }
  function boutonSuite(r, id) {
    if (id === 'liberer') return '<button type="button" class="pa-bt or" data-suite>J’ai libéré cette mémoire</button>';
    if (id === 'intention') return r.intentionPosee ? '<button type="button" class="pa-bt" data-suite>Continuer : réapprendre</button>' : '';
    if (id === 'reapprendre') return '<button type="button" class="pa-bt or" data-suite>Ma mémoire est devenue spirale</button>';
    return '<button type="button" class="pa-bt" data-suite>Étape suivante</button>';
  }
  function zoneTexte(cle, label, val, ph) { return '<label for="pa-t-' + cle + '">' + esc(label) + '</label><textarea id="pa-t-' + cle + '" data-t="' + cle + '" maxlength="3000"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(val || '') + '</textarea>'; }
  function champ(cle, label, val, ph, max) { return '<label for="pa-t-' + cle + '">' + esc(label) + '</label><input id="pa-t-' + cle + '" data-t="' + cle + '" maxlength="' + (max || 160) + '" value="' + esc(val || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>'; }
  function porteDe(r) { if (r.porte) return r.porte; var a = r.aqui; return a === 'moi' ? 'vie' : a === 'parent' || a === 'loin' || a === 'lignee' ? 'lignee' : a === 'ancienne' || a === '?' ? 'ancienne' : ''; }
  /* Les mêmes émotions déjà déposées */
  function memesRessentis(r) { return D.etat.ressentis.filter(function (x) { return x.id !== r.id && (x.em || []).some(function (e) { return (r.em || []).indexOf(e) >= 0; }); }); }
  function contenuEtape(r, id) {
    var h = '', qp = r.qui ? personne(r.qui) : null, porte = porteDe(r);
    if (id === 'voir') {
      h += '<div class="pa-resume">' + (r.corps && r.corps.length ? '<p><b>Dans ton corps :</b> ' + esc(r.corps.join(', ').toLowerCase()) + '</p>' : '') + (r.revient ? '<p><b>Ça revient :</b> ' + esc({ oui: 'oui, souvent', parfois: 'parfois', non: 'c’est la première fois' }[r.revient] || '') + (r.ages ? ' (' + esc(r.ages) + ')' : '') + '</p>' : '') + (r.phrase ? '<p><b>La phrase :</b> « ' + esc(r.phrase) + ' »</p>' : '') + (r.fil ? '<p class="pa-discret">Ajouté à ton fil d’or.</p>' : '') + '</div>';
      var ec = echosRessenti(r), ms = memesRessentis(r);
      if (ms.length) ec.unshift('Tu as déjà déposé ' + (ms.length > 1 ? ms.length + ' fois' : 'une fois') + ' cette émotion : ' + liste(ms.slice(0, 3).map(function (x) { return dateCourte(x.date); })) + '. Elle revient : c’est une mémoire qui se montre.');
      reps().forEach(function (x) { if ((r.bl || []).indexOf('abandon') >= 0 && /départ|absent|parti/i.test(x.label + x.desc)) ec.push('Dans ton arbre : ' + x.label + '.'); });
      h += ec.length ? '<div class="pa-bloc pa-miroir"><h4>Ce que ta vie et ta lignée te montrent</h4><ul class="pa-echos">' + ec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>'
        : '<p class="pa-discret">Plus ton fil d’or et ton arbre se remplissent, plus l’appli te montre ce qui, dans ta vie et ta lignée, ressemble à ce que tu vis.</p>';
      h += '<div class="pa-bloc pa-prise">' + zoneTexte('vois', 'Je vois que…', r.vois, 'Je vois que chaque fois qu’on s’éloigne, je redeviens la petite fille qui attend sur le quai…') + '<p class="pa-discret">C’est ta prise de conscience. Elle est datée et rejoint ton agenda.</p></div>';
    } else if (id === 'aqui') {
      h += '<div class="pa-bloc pa-grande-q"><h4>La question</h4><p>' + esc(PF.QUESTION || '') + '</p></div>';
      h += '<div class="pa-bloc"><h4>Où est la mémoire sur ta ligne du temps ?</h4><div class="pa-portes">' + (PF.PORTES || []).map(function (x) { return '<button type="button" data-porte="' + x[0] + '" aria-pressed="' + (porte === x[0]) + '"><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></button>'; }).join('') + '</div>';
      if (porte === 'vie') {
        var ag = ageA(new Date()) || 60, vAge = r.ageFige != null ? r.ageFige : '';
        var F = (D.fil && D.fil.personnes && D.fil.personnes.toi && D.fil.personnes.toi.etapes) || [];
        h += '<div class="pa-frise-vie"><label for="pa-age-f">À quel âge cette partie de toi s’est-elle figée ? <b id="pa-age-v">' + (vAge !== '' ? vAge + ' ans' : '') + '</b></label><input type="range" id="pa-age-f" min="0" max="' + ag + '" value="' + (vAge !== '' ? vAge : Math.min(8, ag)) + '">' +
          (F.filter(plein).length ? '<p class="pa-discret">Tes moments du fil d’or :</p><div class="pa-puces">' + F.filter(plein).map(function (e) { var a = ageNum(e.age); return a != null ? '<button type="button" data-age="' + a + '" aria-pressed="' + (+vAge === a) + '">' + a + ' ans · ' + esc(String(e.evt || '').slice(0, 30)) + '</button>' : ''; }).join('') + '</div>' : '') + '</div>';
      } else if (porte === 'lignee') {
        var P = personnes().filter(function (p) { return p.gen > 0 || /couple|sœur|frère/i.test(p.lien); }).sort(function (x, y) { return x.gen - y.gen; });
        h += '<p class="pa-discret">Qui l’a portée avant toi ? Laisse venir le premier nom.</p><div class="pa-qui-l">' + P.map(function (p) { return '<button type="button" data-qui="' + esc(p.k) + '" aria-pressed="' + (r.qui === p.k) + '"><i class="pa-mini ' + (((D.etat.liens || {})[p.k] || {}).t || '') + '"></i><b>' + esc(p.prenom) + '</b><span>' + esc(p.lien.replace(/^(Ton|Ta|Une|Un) /, '')) + '</span></button>'; }).join('') + '<button type="button" data-qui="" aria-pressed="' + (!r.qui) + '"><i class="pa-mini"></i><b>Je ne sais pas</b><span>quelqu’un d’avant</span></button></div>' + (P.length ? '' : '<p class="pa-discret">Ajoute les tiens dans ton fil d’or pour les retrouver ici.</p>');
      }
      h += '</div>';
      h += '<div class="pa-bloc"><h4>Écoute ton intuition</h4>' + (PF.INTUITION || []).map(function (q, k) { return zoneTexte('i' + k, q, (r.intuition || {})[k]); }).join('') + '</div>';
      h += '<div class="pa-bloc"><h4>Nomme la mémoire</h4>' + champ('nom', 'Mémoire de…', r.nom, nomSuggere(r), 80) + '</div>';
      var sug = cycleSuggere(r), C = PF.CYCLES || {};
      h += '<div class="pa-bloc"><h4>Cycle 1 ou cycle 2 ?</h4><div class="pa-cycles">' + ['racine', 'coeur'].map(function (c) { return '<div><b>' + esc(C[c].nom) + '</b><span>' + esc(C[c].texte) + '</span></div>'; }).join('') + '</div>' +
        puces('cycle', [['racine', 'Cycle 1'], ['coeur', 'Cycle 2'], ['deux', 'Les deux']], [r.cycle || ''], false) + (sug && !r.cycle ? '<p class="pa-discret">Ce que tu as déposé fait penser ' + (sug === 'deux' ? 'aux deux cycles' : sug === 'racine' ? 'au cycle 1' : 'au cycle 2') + '. C’est toi qui sens.</p>' : '') + '</div>';
      h += '<details class="pa-plus-loin"' + (porte === 'lignee' || porte === 'ancienne' ? ' open' : '') + '><summary>Enquêter plus loin</summary>' + blocEnquete(r) + '</details>';
    } else if (id === 'liberer') {
      var Lb = PF.LIBERER || {}, pid = protoDe(r), prof = pid === 'cle2', PR = PF.PROTOCOLES || [], P0 = null;
      PR.forEach(function (x) { if (x.id === pid) P0 = x; });
      var LP = (PF.LIB_PORTE || {})[porte];
      if (LP) {
        var qui = qp ? qp.prenom : 'celle ou celui qui l’a portée', ageT = r.ageFige != null ? r.ageFige + ' ans' : 'l’âge où tout s’est figé';
        h += '<div class="pa-bloc pa-geste"><h4>' + esc(LP.titre.replace('{qui}', qui)) + '</h4><ol>' + LP.etapes.map(function (t) { return '<li>' + esc(t.replace(/\{qui\}/g, qui).replace('{age}', ageT)) + '</li>'; }).join('') + '</ol></div>';
      } else h += '<p class="pa-discret">Tu n’as pas encore situé la mémoire sur ta ligne du temps. Tu peux revenir à l’étape « Où est-elle ? », ou libérer quand même.</p>';
      if (PR.length > 1) h += '<div class="pa-bloc"><h4>Ton protocole</h4><div class="pa-protos">' + PR.map(function (x) { return '<button type="button" data-proto="' + esc(x.id) + '" aria-pressed="' + (x.id === pid) + '"><b>' + esc(x.titre) + '</b><span>' + esc(x.court) + '</span></button>'; }).join('') + '</div>' + (prof ? '<p class="pa-discret">Ce n’est pas un retour en arrière : tu creuses le même trou, plus profond.</p>' : '') + '</div>';
      if (P0 && P0.etapes) {
        h += '<div class="pa-lib">' + P0.etapes.map(function (x, k) { return '<div class="pa-lib-e"><span>' + (k + 1) + '</span><div><h4>' + esc(x.titre) + '</h4><p>' + esc(x.texte) + '</p></div></div>'; }).join('') + '</div>' + (P0.questions || []).map(function (q, k) { return zoneTexte('p' + pid + k, q, r['p' + pid + k]); }).join('');
      } else {
        h += '<div class="pa-lib"><div class="pa-lib-e"><span>1</span><div><h4>Respirer</h4><p>' + esc(Lb.respirer) + '</p>' + sphereResp() + '</div></div>';
        h += '<div class="pa-lib-e"><span>2</span><div><h4>Nommer</h4>' + (prof ? (Lb.couches || []).map(function (q, k) { return zoneTexte('c' + k, q, r['c' + k]); }).join('') : '') + champ('nom', 'Le nom de la mémoire', r.nom, nomSuggere(r), 80) + champ('source', 'Mémoire de qui, ou de quoi ?', r.source || sourceSuggeree(r) || (porte === 'vie' && r.ageFige != null ? 'moi à ' + r.ageFige + ' ans' : ''), 'ma grand-mère qui a tout perdu, moi à 8 ans…', 120) + '</div></div>';
        h += '<div class="pa-lib-e"><span>3</span><div><h4>Reconnaître</h4><p class="pa-discret">Dis-la à voix haute si tu peux, sinon intérieurement.</p><blockquote class="pa-phrase" id="pa-phrase-lib">' + esc(phraseLib(r, prof)) + '</blockquote></div></div>';
        h += '<div class="pa-lib-e"><span>4</span><div><h4>Transmuter</h4><ol>' + (Lb.transmuter || []).concat(prof ? Lb.profond || [] : []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol><p class="pa-discret">Tu peux répéter doucement : ' + (Lb.mantras || []).map(function (m) { return '« ' + esc(m) + ' »'; }).join(' ') + '</p></div></div>';
        h += '<div class="pa-lib-e"><span>5</span><div><h4>Réorienter</h4>' + (Lb.reorienter || []).map(function (q, k) { return zoneTexte('o' + k, q, r['o' + k]); }).join('') + '<div class="pa-deux-c"><div>' + zoneTexte('ancienne', 'Mon ancienne réaction', r.ancienne, 'Je me justifie, je fuis…') + '</div><div>' + zoneTexte('nouvelle', 'Ma nouvelle réponse', r.nouvelle, '« Merci, je vais y réfléchir. »') + '</div></div></div></div></div>';
      }
      h += '<div class="pa-bloc pa-geste"><h4>Ton geste dans les 48 heures</h4><p style="margin:0 0 .5rem">Un petit acte concret, dans le sens de ce que tu choisis, crée une nouvelle empreinte.</p><p class="pa-discret" style="color:#F3DCC0">' + esc((Lb.gestes || []).map(function (g) { return g[0] + ' : ' + g[1]; }).join(' · ')) + '</p>' +
        '<label for="pa-t-geste" style="color:#fff">Mon geste</label><input id="pa-t-geste" data-t="geste" maxlength="140" value="' + esc(r.geste || '') + '"><label for="pa-t-gdate" style="color:#fff">Le jour</label><input id="pa-t-gdate" type="date" data-t="gesteDate" value="' + esc(r.gesteDate || iso(new Date(Date.now() + 864e5))) + '"></div>';
    } else if (id === 'intention') {
      var I = PF.INTENTION || {}, op = (PF.OPPOSES || {})[(r.em || [])[0]] || '';
      if (r.intentionPosee) {
        h += '<div class="pa-posee"><div class="pa-graine"></div><p class="pa-etiq">Intention posée le ' + esc(dateCourte(r.intentionPosee)) + '</p><p class="pa-phrase">' + esc(r.intention || '') + '</p><p>' + esc(I.lacher) + '</p><p class="pa-discret">Elle reviendra le ' + esc(lunesApres(r.intentionPosee, 1).map(dateCourte).join('')) + ', à la nouvelle lune.</p></div>';
      } else {
        h += '<div class="pa-lib"><div class="pa-lib-e"><span>1</span><div><h4>Te centrer</h4><p>' + esc(I.centrer) + '</p>' + sphereResp() + '</div></div>';
        h += '<div class="pa-lib-e"><span>2</span><div><h4>L’écrire</h4><p>' + esc(I.ecrire) + '</p>' + (op ? '<p class="pa-discret">L’opposé de ta mémoire : ' + esc(op.toLowerCase()) + '.</p>' : '') + zoneTexte('intention', 'Mon intention', r.intention, I.exemples ? I.exemples[0] : '') +
          '<div class="pa-puces pa-exemples">' + (I.exemples || []).map(function (x) { return '<button type="button" data-exemple="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div></div></div>';
        h += '<div class="pa-lib-e"><span>3</span><div><h4>La poser</h4><p>' + esc(I.acter) + '</p><button type="button" class="pa-tenir" data-tenir aria-label="Garder appuyé pour poser mon intention"><i></i><span>Garder appuyé</span></button></div></div></div>';
      }
      h += '<details class="pa-plus-loin"><summary>Ce que je veux avoir, faire, être</summary>' + champ('choix', 'Ce que je choisis à la place de ma mémoire', r.choix, op || 'La sécurité, l’abondance…', 120) + (PF.ENVIES || []).map(function (q, k) { return champ('e' + k, q, r['e' + k], '', 120); }).join('') + '</details>';
    } else if (id === 'reapprendre') {
      var RP = PF.REAPPRENDRE || {}, auj = new Date();
      h += '<div class="pa-bloc"><h4>Ton corps · réapprendre la sécurité</h4><p>' + esc(RP.corps) + '</p>' + (r.corps && r.corps.length ? '<p class="pa-discret">Ton corps se met en alerte : ' + esc(r.corps.join(', ').toLowerCase()) + '. Cette alerte appartient ' + (porte === 'vie' ? 'à la petite fille de ' + (r.ageFige != null ? r.ageFige + ' ans' : 'ton passé') : porte === 'lignee' ? (qp ? 'à ' + qp.prenom : 'à ta lignée') : 'à une mémoire ancienne') + ', pas à aujourd’hui.</p>' : '') +
        '<div class="pa-semaine">' + [6, 5, 4, 3, 2, 1, 0].map(function (n) { var d = new Date(auj.getTime() - n * 864e5), k = iso(d), on = !!(r.corpsJ || {})[k]; return '<button type="button" data-corps="' + k + '" aria-pressed="' + on + '"><small>' + JS[(d.getDay() + 6) % 7] + '</small>' + (on ? '✓' : d.getDate()) + '</button>'; }).join('') + '</div></div>';
      h += '<div class="pa-bloc"><h4>Tes pensées</h4><p class="pa-discret">' + esc(RP.pensees) + '</p>' + champ('phrase', 'L’ancienne phrase', r.phrase, 'On finit toujours par me laisser', 120) + champ('nphrase', 'Ma nouvelle phrase', r.nphrase, r.intention || 'Je mérite qu’on reste.', 160) + '</div>';
      h += '<div class="pa-bloc"><h4>Tes gestes</h4><p class="pa-discret">' + esc(RP.gestes) + '</p><div class="pa-deux-c"><div>' + zoneTexte('ancienne', 'Avant, je…', r.ancienne) + '</div><div>' + zoneTexte('nouvelle', 'Maintenant, je…', r.nouvelle) + '</div></div></div>';
      h += '<div class="pa-bloc"><h4>Le rôle que tu prends</h4><p class="pa-discret">Dans cette situation, sans te juger : quel rôle joues-tu ?</p>' + puces('role', (PF.ROLES || []).map(function (x) { return [x[0], x[1]]; }), r.roles || [], true) +
        (PF.ROLES || []).filter(function (x) { return (r.roles || []).indexOf(x[0]) >= 0; }).map(function (x) { return '<div class="pa-role"><p><b>' + esc(x[1]) + '</b> · ' + esc(x[2]) + '</p><p class="pa-or">' + esc(x[3]) + '</p></div>'; }).join('') +
        ((r.roles || []).length ? '<label for="pa-role-qui">Qui jouait ce rôle dans ta lignée ?</label><select id="pa-role-qui"><option value="">Je ne sais pas</option>' + personnes().map(function (p) { return '<option value="' + esc(p.k) + '"' + (r.roleQui === p.k ? ' selected' : '') + '>' + esc(p.prenom + ' · ' + p.lien.toLowerCase()) + '</option>'; }).join('') + '</select>' : '') + '</div>';
      var lu = r.intentionPosee ? lunesApres(r.intentionPosee, 6) : [], passees = lu.filter(function (d) { return d <= iso(auj); });
      h += '<div class="pa-bloc"><h4>À chaque nouvelle lune</h4>' + (r.intentionPosee ? '' : '<p class="pa-discret">Pose d’abord ton intention : elle reviendra à chaque nouvelle lune.</p>');
      if (r.intentionPosee) h += '<p class="pa-discret">Ton intention : « ' + esc(r.intention || '') + ' ». Prochaine nouvelle lune : ' + esc(dateCourte(lu.filter(function (d) { return d > iso(auj); })[0] || '')) + '.</p>' +
        passees.reverse().map(function (d) { var L = (r.lunes || {})[d] || {}; return '<div class="pa-lune"><p class="pa-etiq">Nouvelle lune du ' + esc(dateCourte(d)) + '</p>' + (RP.lune || []).map(function (q, k) { return '<label for="pa-l-' + d + k + '">' + esc(q) + '</label><input id="pa-l-' + d + k + '" data-lune="' + d + '" data-k="' + k + '" maxlength="200" value="' + esc(L[k] || '') + '">'; }).join('') + '</div>'; }).join('');
      h += '</div>';
    }
    return h;
  }
  function blocEnquete(r) {
    var h = '', cyc = r.cycle === 'racine' || r.cycle === 'coeur' ? [r.cycle] : ['racine', 'coeur'], Q = [], vus = r.enquete && r.enquete.q || {}, qui = r.qui ? personne(r.qui) : null;
    cyc.forEach(function (c) { Q = Q.concat(((PF.QUESTIONS || {})[c] || []).slice(0, cyc.length > 1 ? 3 : 5)); });
    (r.bl || []).forEach(function (b) { if ((PF.BLESSURE_Q || {})[b]) Q.push(PF.BLESSURE_Q[b]); });
    h += '<div class="pa-bloc"><h4>Les questions à poser' + (qui ? ' autour de ' + esc(qui.prenom) : '') + '</h4><ul class="pa-coches">' + Q.map(function (q, k) { return '<li><label><input type="checkbox" data-q="' + k + '"' + (vus[k] ? ' checked' : '') + '> ' + esc(q) + '</label></li>'; }).join('') + '</ul></div>';
    var OU = []; cyc.forEach(function (c) { OU = OU.concat(((PF.OU || {})[c] || []).slice(0, cyc.length > 1 ? 2 : 4)); }); OU = OU.concat((PF.OU || {}).tous || []);
    h += '<div class="pa-bloc"><h4>Où chercher</h4><ul class="pa-ou">' + OU.map(function (o) { return '<li><b>' + esc(o[0]) + '</b><span>' + esc(o[1]) + '</span></li>'; }).join('') + '</ul></div>';
    h += '<div class="pa-bloc">' + zoneTexte('trouve', 'Ce que j’ai trouvé, entendu ou senti', (r.enquete || {}).trouve, 'Une date, une phrase, un papier, un rêve…') + '</div>';
    return h + livre('Le livre te donne une page pour chaque personne de ta lignée, à remplir à la main et à transmettre.');
  }
  function sphereResp() { return '<div class="pa-resp" aria-live="polite"><i></i><button type="button" class="pa-bt clair" data-respirer>Respirer avec moi</button></div>'; }
  /* Les nouvelles lunes après une date (iso) */
  function lunesApres(k, n) {
    var d = dateComplete(k), l = []; if (!d || !A) return l;
    var t = new Date(d.a, d.m - 1, d.j + 1);
    for (var i = 0; i < n; i++) { var x = A.SearchMoonPhase(0, t, 40); if (!x) break; l.push(iso(x.date)); t = new Date(x.date.getTime() + 2 * 864e5); }
    return l;
  }
  function aquiDe(r) { return porteDe(r); }
  function protoDe(r) { return r.protocole || (r.profond ? 'cle2' : dejaLibere(r) ? 'cle2' : 'cle1'); }
  function nomSuggere(r) { var e = (r.em || [])[0]; return e ? 'la mémoire de ' + e.toLowerCase() : 'la mémoire de peur'; }
  function sourceSuggeree(r) { var q = r.qui ? personne(r.qui) : null; return q ? q.lien.toLowerCase().replace(/^(ton|ta|un|une) /, function (m) { return { 'ton ': 'mon ', 'ta ': 'ma ', 'un ': 'un ', 'une ': 'une ' }[m]; }) + ' ' + q.prenom : ''; }
  function phraseLib(r, prof) {
    var L = PF.LIBERER || {}, nom = String(r.nom || nomSuggere(r)).replace(/^(la )?mémoire de /i, ''), src = r.source || sourceSuggeree(r) || 'celle ou celui qui l’a portée avant moi';
    return (prof ? L.phraseProfonde : L.phrase || '').replace('{nom}', nom).replace('{source}', src);
  }
  function dejaLibere(r) { return D.etat.ressentis.some(function (x) { return x.id !== r.id && x.libere && x.date <= r.date && (x.em || []).some(function (e) { return (r.em || []).indexOf(e) >= 0; }); }); }
  var respMinuteur = null;
  function respirer(z) {
    var rond = z.querySelector('i'), bt = z.querySelector('button'), n = 0, temps = [['Inspire…', 5000, 1.35], ['Retiens…', 2000, 1.35], ['Expire…', 7000, .7]];
    clearTimeout(respMinuteur); bt.disabled = true;
    (function pas(k) {
      if (!document.body.contains(z)) return;
      if (k === 3) { n++; if (n >= 3) { rond.textContent = 'C’est bien.'; rond.style.transform = 'scale(1)'; bt.disabled = false; bt.textContent = 'Encore une fois'; return; } k = 0; }
      var t = temps[k]; rond.textContent = t[0]; rond.style.transitionDuration = (t[1] / 1000) + 's'; rond.style.transform = 'scale(' + t[2] + ')';
      respMinuteur = setTimeout(function () { pas(k + 1); }, t[1]);
    })(0);
  }
  function livre(t) { return '<a class="pa-livre" href="enquete-de-ma-lignee.html"><img src="assets/livres/enquete-de-ma-lignee-3d.webp" alt="" width="64" height="106" loading="lazy"><span><b>Le livre « L’enquête de ma lignée »</b><span>' + esc(t) + '</span><span class="pa-plus">Voir le livre</span></span></a>'; }
  function brancherEtape(z, r, i) {
    var E = ETAPES[i];
    z.addEventListener('input', function (e) {
      var lu = e.target.closest('[data-lune]'); if (lu) { r.lunes = r.lunes || {}; var d = lu.getAttribute('data-lune'); r.lunes[d] = r.lunes[d] || {}; r.lunes[d][lu.getAttribute('data-k')] = lu.value; sauver(); return; }
      if (e.target.id === 'pa-age-f') { r.ageFige = +e.target.value; z.querySelector('#pa-age-v').textContent = r.ageFige + ' ans'; sauver(); return; }
      var t = e.target.closest('[data-t]'); if (!t) return;
      var k = t.getAttribute('data-t'), v = t.value;
      if (/^i\d$/.test(k)) { r.intuition = r.intuition || {}; r.intuition[k.slice(1)] = v; }
      else if (/^s\d$/.test(k)) { r.sp = r.sp || {}; r.sp[k.slice(1)] = v; }
      else if (k === 'trouve') { r.enquete = r.enquete || { q: {} }; r.enquete.trouve = v; }
      else { r[k] = v; if (k === 'vois' && v && !r.voisDate) r.voisDate = iso(new Date()); }
      var ph = z.querySelector('#pa-phrase-lib'); if (ph && (k === 'nom' || k === 'source')) ph.textContent = phraseLib(r, protoDe(r) === 'cle2');
      sauver();
    });
    z.addEventListener('change', function (e) {
      var q = e.target.closest('[data-q]'); if (q) { r.enquete = r.enquete || { q: {} }; r.enquete.q = r.enquete.q || {}; if (q.checked) r.enquete.q[q.getAttribute('data-q')] = iso(new Date()); else delete r.enquete.q[q.getAttribute('data-q')]; sauver(); return; }
      if (e.target.id === 'pa-role-qui') { r.roleQui = e.target.value; sauver(); return; }
      var g = e.target.closest('[data-groupe]'); if (!g) return;
      var nom = g.getAttribute('data-groupe');
      if (nom === 'cycle') r.cycle = lirePuces(z, nom)[0] || '';
      if (nom === 'role') { r.roles = lirePuces(z, 'role'); sauver(); ouvrirFil(r.id, i); return; }
      sauver();
    });
    z.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pas]'); if (p && !p.disabled) { ouvrirFil(r.id, +p.getAttribute('data-pas')); return; }
      if (e.target.closest('[data-respirer]')) { respirer(e.target.closest('.pa-resp')); return; }
      var pr = e.target.closest('[data-proto]'); if (pr) { r.protocole = pr.getAttribute('data-proto'); sauver(); ouvrirFil(r.id, i); return; }
      var po = e.target.closest('[data-porte]'); if (po) { r.porte = po.getAttribute('data-porte'); if (r.porte !== 'lignee') r.qui = r.porte === 'vie' ? '' : r.qui; sauver(); ouvrirFil(r.id, i); return; }
      var qb = e.target.closest('[data-qui]'); if (qb) { r.qui = qb.getAttribute('data-qui'); z.querySelectorAll('[data-qui]').forEach(function (b) { b.setAttribute('aria-pressed', b === qb); }); sauver(); return; }
      var ab = e.target.closest('[data-age]'); if (ab) { r.ageFige = +ab.getAttribute('data-age'); sauver(); ouvrirFil(r.id, i); return; }
      var ex = e.target.closest('[data-exemple]'); if (ex) { var ta = z.querySelector('#pa-t-intention'); if (ta) { ta.value = ex.getAttribute('data-exemple'); r.intention = ta.value; sauver(); } return; }
      var cp = e.target.closest('[data-corps]'); if (cp) { r.corpsJ = r.corpsJ || {}; var ck = cp.getAttribute('data-corps'); if (r.corpsJ[ck]) delete r.corpsJ[ck]; else r.corpsJ[ck] = 1; sauver(); ouvrirFil(r.id, i); return; }
      if (e.target.closest('[data-suite]')) {
        var auj = iso(new Date());
        if (E.id === 'liberer') r.libere = auj;
        if (E.id === 'reapprendre') { r.spirale = auj; sauver(); fermerFeuille(); return; }
        r.etape = Math.max(r.etape || 0, i + 1); sauver(); ouvrirFil(r.id); return;
      }
      if (e.target.closest('[data-suppr-fil]') && confirm('Supprimer ce ressenti et tout ce que tu as écrit dessus ?')) {
        D.etat.ressentis = D.etat.ressentis.filter(function (x) { return x.id !== r.id; }); sauver(); fermerFeuille();
      }
    });
    /* Poser l'intention : garder le doigt appuyé trois secondes */
    var tb = z.querySelector('[data-tenir]');
    if (tb) {
      var tm = null;
      var debut = function (e) { e.preventDefault(); if (!String(r.intention || '').trim()) { tb.querySelector('span').textContent = 'Écris d’abord ton intention'; return; } tb.classList.add('tient'); tb.querySelector('span').textContent = 'Reste centré·e…'; tm = setTimeout(function () { r.intentionPosee = iso(new Date()); r.etape = Math.max(r.etape || 0, i + 1); if (navigator.vibrate) navigator.vibrate(60); sauver(); ouvrirFil(r.id, i); }, 3000); };
      var fin = function () { if (tm) { clearTimeout(tm); tm = null; } if (!r.intentionPosee) { tb.classList.remove('tient'); tb.querySelector('span').textContent = 'Garder appuyé'; } };
      tb.addEventListener('pointerdown', debut); tb.addEventListener('pointerup', fin); tb.addEventListener('pointerleave', fin); tb.addEventListener('pointercancel', fin);
      tb.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !tm) debut(e); });
      tb.addEventListener('keyup', fin);
    }
  }

  /* ── Les rêves ── */
  function trouverReve(id) { var l = D.etat.reves || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  /* Pour un partage anonyme : on retire les prénoms connus, les adresses e-mail et les numéros */
  function anonymiser(t) {
    var noms = [D.prenom].concat(String(D.prenoms || '').split(/\s+/), D.nom).concat(personnes().map(function (p) { return p.prenom; }));
    var F = (D.fil && D.fil.personnes) || {}; Object.keys(F).forEach(function (k) { if (F[k].prenom) noms.push(F[k].prenom); });
    t = String(t || '').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[e-mail]').replace(/(\+?\d[\d .-]{7,}\d)/g, '[numéro]');
    noms.filter(function (n) { return n && n.length > 1; }).forEach(function (n) { t = t.replace(new RegExp('(^|[^\\wÀ-ÿ])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^\\wÀ-ÿ])', 'gi'), '$1[prénom]'); });
    return t;
  }
  function ouvrirReve(id) {
    var R = D.etat.reves = D.etat.reves || [], v = id === 'new' ? null : trouverReve(id), neuf = !v;
    if (neuf) v = { id: 'v' + Date.now().toString(36), date: iso(new Date()), texte: '', types: [], symboles: [], em: [], qui: [] };
    var RV = PF.REVES || {}, P = personnes();
    var h = '<p class="pa-etiq">' + (neuf ? 'Je note un rêve' : 'Mon rêve du ' + esc(dateCourte(v.date))) + '</p><h2>Ton rêve</h2><p class="pa-souffle">Note-le vite, avant qu’il ne s’efface : les images, les lieux, les personnes, ce que tu as ressenti au réveil. Certains rêves rangent ce que tu vis en ce moment, d’autres portent des symboles forts, ou la visite de quelqu’un de ta lignée.</p>' +
      '<form class="pa-form" novalidate onsubmit="return false"><label for="pa-rv-t">Ce que j’ai rêvé</label><textarea id="pa-rv-t" maxlength="4000" placeholder="J’étais dans la maison de ma grand-mère…">' + esc(v.texte) + '</textarea>' +
      '<p class="pa-lab">Ce rêve…</p>' + puces('rv-types', RV.types || [], v.types, true) +
      '<p class="pa-lab">Les symboles</p>' + puces('rv-sym', (RV.symboles || []).map(function (x) { return x[0]; }), v.symboles, true) + '<div id="pa-rv-pistes"></div>' +
      '<p class="pa-lab">Au réveil, je ressentais</p>' + puces('rv-em', (PF.EMOTIONS || []).concat(['Paix', 'Joie']), v.em, true) +
      (P.length ? '<p class="pa-lab">Quelqu’un de ma lignée y était</p>' + puces('rv-qui', P.map(function (p) { return [p.k, p.prenom]; }), v.qui, true) : '') + '<div id="pa-rv-echos"></div>' +
      '<div class="pa-partage"><label class="pa-coche"><input type="checkbox" id="pa-rv-ok"' + (v.partage ? ' checked disabled' : '') + '> J’accepte que Genesolia utilise ce rêve, de façon totalement anonyme, pour écrire des articles sur les rêves</label>' +
      '<div id="pa-rv-apercu"' + (v.partage ? '' : ' hidden') + '></div></div>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-rv-ok>' + (neuf ? 'Garder mon rêve' : 'C’est noté') + '</button>' + (!neuf ? '<button type="button" class="pa-bt clair" data-rv-fil>Ce rêve parle d’une mémoire : la suivre</button><button type="button" class="pa-lien-s" data-rv-suppr>Supprimer ce rêve</button>' : '') + '</div></form>';
    var z = feuille(h);
    function lire() { v.texte = z.querySelector('#pa-rv-t').value; v.types = lirePuces(z, 'rv-types'); v.symboles = lirePuces(z, 'rv-sym'); v.em = lirePuces(z, 'rv-em'); v.qui = lirePuces(z, 'rv-qui'); }
    function pistes() {
      var sy = lirePuces(z, 'rv-sym'), m = {}; (RV.symboles || []).forEach(function (x) { m[x[0]] = x[1]; });
      z.querySelector('#pa-rv-pistes').innerHTML = sy.length ? '<ul class="pa-echos">' + sy.map(function (x) { return '<li><b>' + esc(x) + '</b> · ' + esc(m[x]) + '</li>'; }).join('') + '</ul><p class="pa-discret">Des pistes, jamais des certitudes : c’est toi qui sens ce que ton rêve veut dire.</p>' : '';
      var ec = [], qs = lirePuces(z, 'rv-qui');
      qs.forEach(function (k) { var p = personne(k); if (!p) return; var t = p.prenom + ' (' + p.lien.toLowerCase() + ')'; if (p.parti && p.anneeD) t += ' est parti' + (p.f ? 'e' : '') + ' le ' + p.anneeD.j + ' ' + MOIS[p.anneeD.m - 1] + ' ' + p.anneeD.a; var c = communs(p); if (c.length) t += ' · vous avez ' + c.join(', '); var dr = (D.etat.reves || []).filter(function (x) { return x.id !== v.id && (x.qui || []).indexOf(k) >= 0; }).length; if (dr) t += ' · déjà venu' + (p.f ? 'e' : '') + ' dans ' + dr + ' autre' + (dr > 1 ? 's' : '') + ' rêve' + (dr > 1 ? 's' : ''); ec.push(t + '. Que vient-' + (p.f ? 'elle' : 'il') + ' te dire, ou te rendre ?'); });
      var memes = (D.etat.reves || []).filter(function (x) { return x.id !== v.id && (x.symboles || []).some(function (y) { return sy.indexOf(y) >= 0; }); });
      if (memes.length) ec.push('Ces symboles sont déjà venus dans ' + memes.length + ' rêve' + (memes.length > 1 ? 's' : '') + ' : ils insistent.');
      z.querySelector('#pa-rv-echos').innerHTML = ec.length ? '<div class="pa-bloc"><h4>Ce que ce rêve réveille</h4><ul class="pa-echos">' + ec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' : '';
    }
    function apercu() { var ok = z.querySelector('#pa-rv-ok'), a = z.querySelector('#pa-rv-apercu'); a.hidden = !ok.checked; if (ok.checked) a.innerHTML = v.partage ? '<p class="pa-discret">Partagé anonymement le ' + esc(dateCourte(v.partage)) + '. Merci.</p>' : '<p class="pa-discret">Voici exactement ce qui sera envoyé, sans ton nom, ton e-mail ni ton compte. Les prénoms sont retirés : relis et enlève tout ce qui pourrait te reconnaître.</p><blockquote class="pa-apercu">' + esc(anonymiser(z.querySelector('#pa-rv-t').value)) + '</blockquote>'; }
    pistes(); if (v.partage) apercu();
    z.addEventListener('change', function (e) { if (e.target.id === 'pa-rv-ok') apercu(); else pistes(); });
    z.addEventListener('input', function (e) { if (e.target.id === 'pa-rv-t' && z.querySelector('#pa-rv-ok').checked && !v.partage) apercu(); });
    z.addEventListener('click', function (e) {
      if (e.target.closest('[data-rv-ok]')) {
        lire(); if (!v.texte.trim() && !v.symboles.length) { fermerFeuille(); return; }
        if (neuf) R.push(v);
        if (z.querySelector('#pa-rv-ok').checked && !v.partage) partagerReve(v);
        sauver(); fermerFeuille(); return;
      }
      if (e.target.closest('[data-rv-fil]')) {
        lire(); var r = { id: 'r' + Date.now().toString(36), date: iso(new Date()), quoi: 'Mon rêve : ' + String(v.texte || '').slice(0, 300), em: v.em.filter(function (x) { return (PF.EMOTIONS || []).indexOf(x) >= 0; }), bl: [], corps: [], revient: v.types.indexOf('revient') >= 0 ? 'oui' : '', etape: 0, intuition: {}, enquete: { q: {} }, reve: v.id, qui: v.qui[0] || '', porte: v.qui.length ? 'lignee' : '' };
        D.etat.ressentis.push(r); v.fil = r.id; sauver(); ouvrirFil(r.id); return;
      }
      if (e.target.closest('[data-rv-suppr]') && confirm('Supprimer ce rêve ?')) { D.etat.reves = R.filter(function (x) { return x.id !== v.id; }); sauver(); fermerFeuille(); }
    });
  }
  function partagerReve(v) {
    v.partage = iso(new Date());
    if (EXEMPLE || !sb) return;
    sb.from('reves_anonymes').insert({ mois: v.date.slice(0, 7), texte: anonymiser(v.texte).slice(0, 4000), symboles: v.symboles, emotions: v.em, types: v.types }).then(function (r) { if (r && r.error) { delete v.partage; sauver(); } }, function () { delete v.partage; sauver(); });
  }
  function blocReves() {
    var R = (D.etat.reves || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var h = '<section class="pa-carte"><p class="pa-etiq">Mes rêves</p>';
    if (!R.length) h += '<p>Tes rêves sont remplis d’indices. Note-les ici : l’appli relie leurs symboles et les personnes qui y viennent à ta lignée.</p>';
    else {
      var sy = {}; R.forEach(function (v) { (v.symboles || []).forEach(function (x) { sy[x] = (sy[x] || 0) + 1; }); });
      var rec = Object.keys(sy).filter(function (x) { return sy[x] > 1; });
      if (rec.length) h += '<p class="pa-discret"><b>Les symboles qui reviennent :</b> ' + esc(rec.map(function (x) { return x.toLowerCase() + ' (' + sy[x] + ')'; }).join(', ')) + '</p>';
      h += '<ul class="pa-moments">' + R.slice(0, 5).map(function (v) { return '<li><button type="button" data-reve="' + esc(v.id) + '"><span class="pa-age rv">☾</span><span><b>' + esc(String(v.texte || 'Un rêve').slice(0, 70)) + '</b><small>' + esc(dateCourte(v.date) + ((v.symboles || []).length ? ' · ' + v.symboles.join(', ').toLowerCase() : '')) + '</small></span></button></li>'; }).join('') + '</ul>';
    }
    return h + '<div class="pa-outils"><button type="button" class="pa-bt clair" data-reve="new">Je note un rêve</button></div></section>';
  }

  /* ── 2. Mon fil d'or ── */
  function vueFil() {
    var h = '<h1 class="pa-h1">Mon fil d’or</h1><p class="pa-sous">Ta base, et chaque ressenti que tu tires, jusqu’à ce que la boucle devienne spirale.</p><div class="pa-2col"><div>';
    h += blocFil();
    var R = reps();
    h += '<section class="pa-carte"><p class="pa-etiq">Ta base · ce qui se répète dans ton arbre</p>';
    if (R.length) h += R.slice(0, 8).map(function (x) { return '<details class="pa-rep"><summary>' + esc(x.label) + '</summary><p>' + esc(x.desc) + '</p></details>'; }).join('') + (R.length > 8 ? '<p class="pa-discret">Et ' + (R.length - 8) + ' autres pistes dans ton arbre.</p>' : '');
    else if (nbArbre()) h += '<p>Ouvre ton arbre une fois : ce qui se répète s’affichera ici, et dans ton agenda.</p>';
    else h += '<p>Avec ton arbre, les répétitions (âges, dates, prénoms, métiers) se repèrent toutes seules et rejoignent ton agenda.</p>';
    h += '<div class="pa-outils"><a class="pa-bt clair" href="genosociogramme.html">Ouvrir mon arbre</a></div></section>';
    h += blocCiel();
    h += '</div><div>';
    var enCours = D.etat.ressentis.filter(function (r) { return !r.spirale; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }), finis = D.etat.ressentis.filter(function (r) { return r.spirale; });
    h += '<section class="pa-carte pa-depot"><p class="pa-etiq">Tirer un nouveau fil</p><p>Chaque ressenti suit le même chemin : <b>' + ETAPES.map(function (E) { return esc(E.titre); }).join('</b>, <b>') + '</b>.</p><button type="button" class="pa-bt or" data-depot>Je dépose un ressenti</button></section>';
    h += enCours.length ? '<p class="pa-titre-s">Mes fils en cours</p><p class="pa-def">Un fil, c’est un ressenti que tu suis jusqu’au bout, étape par étape.</p>' + enCours.map(carteFil).join('') : '';
    h += finis.length ? '<p class="pa-titre-s">Devenus spirale</p><p class="pa-def">La boucle tourne toujours au même endroit ; la spirale monte : le thème peut revenir, mais tu le reconnais et tu réagis autrement.</p>' + finis.map(carteFil).join('') : '';
    h += blocReves();
    h += livre('Pour écrire ton enquête à la main, la remplir en famille et la transmettre : 166 pages, 18 thèmes expliqués.');
    if (D.user && !D.accord && !EXEMPLE) h += '<div id="pa-coffre"></div>';
    h += '</div></div>';
    afficher(h);
    var z = document.getElementById('pa-coffre');
    if (z && window.GenesoliaCoffre) window.GenesoliaCoffre.demander(z, sb, function () { D.accord = true; sauver(); });
  }

  var filSel = 'toi';
  function blocFil() {
    var F = filEtat(), ids = ['toi'].concat(F.ordre.filter(function (id) { return F.personnes[id] && id !== 'toi'; })), P = F.personnes[filSel] ? filSel : 'toi', x = F.personnes[P];
    var h = '<section class="pa-carte pa-fil-ed"><p class="pa-etiq">Ta base · ton fil d’or</p>';
    if (!(D.etat.vu || {}).fil) h += '<div class="pa-intro"><p><b>Ton fil d’or, c’est ta vie en quelques moments.</b> Pour chacun : l’âge que tu avais, ce qui s’est passé, ce que tu as ressenti. Puis fais la même chose pour ta mère, ton père, tes grands-parents, même si tu en sais peu. En mettant les ressentis côte à côte, les ressemblances d’une génération à l’autre apparaissent : c’est d’elles que naît ton enquête.</p><button type="button" class="pa-bt clair" data-fil-vu>J’ai compris</button></div>';
    h += '<div class="pa-onglets-f" role="tablist">' + ids.map(function (id) { var n = (F.personnes[id].etapes || []).filter(plein).length; return '<button type="button" role="tab" data-fil-p="' + id + '" aria-selected="' + (id === P) + '">' + esc(F.personnes[id].prenom || etiquetteFil(id)) + (F.personnes[id].prenom && id !== 'toi' ? ' <em>' + esc(etiquetteFil(id).toLowerCase()) + '</em>' : '') + (n ? ' <small>' + n + '</small>' : '') + '</button>'; }).join('') +
      '<select data-fil-ajout aria-label="Ajouter quelqu’un"><option value="">+ Ajouter</option>' + [['m', 'Ma mère'], ['p', 'Mon père'], ['mm', 'Ma grand-mère maternelle'], ['mp', 'Mon grand-père maternel'], ['pm', 'Ma grand-mère paternelle'], ['pp', 'Mon grand-père paternel']].filter(function (o) { return !F.personnes[o[0]]; }).concat([['r:soeur', 'Une sœur'], ['r:frere', 'Un frère'], ['r:enfant', 'Un enfant'], ['r:tante_m', 'Une tante maternelle'], ['r:oncle_m', 'Un oncle maternel'], ['r:tante_p', 'Une tante paternelle'], ['r:oncle_p', 'Un oncle paternel']]).map(function (o) { return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
    h += '<div class="pa-pers-f"><label for="pa-fil-prenom">' + (P === 'toi' ? 'Ton prénom' : 'Son prénom') + '</label><input id="pa-fil-prenom" data-fil-prenom maxlength="40" value="' + esc(x.prenom || '') + '" placeholder="' + esc(etiquetteFil(P)) + '">';
    var et = (x.etapes || []).map(function (e, k) { return [e, k]; }).filter(function (y) { return plein(y[0]); }).sort(function (u, v) { return (ageNum(u[0].age) || 0) - (ageNum(v[0].age) || 0); });
    h += et.length ? '<ul class="pa-moments">' + et.map(function (y) { var e = y[0]; return '<li><button type="button" data-fil-m="' + y[1] + '"><span class="pa-age">' + (ageNum(e.age) != null ? ageNum(e.age) + '<small>ans</small>' : '·') + '</span><span><b>' + esc(e.evt || 'Un moment') + '</b>' + ((e.em || []).length ? '<small>' + esc(e.em.join(' · ')) + '</small>' : '') + '</span></button></li>'; }).join('') + '</ul>'
      : '<p class="pa-discret">' + (P === 'toi' ? 'Aucun moment encore. Commence par un moment qui t’a marqué·e.' : 'Même un seul moment suffit : ce que tu sais, ou ce que tu sens.') + '</p>';
    h += '<div class="pa-outils"><button type="button" class="pa-bt" data-fil-m="new">Ajouter un moment</button>' + (P !== 'toi' ? '<button type="button" class="pa-lien-s" data-fil-suppr>Retirer cette personne</button>' : '') + '</div></div>';
    var em = {}; ids.forEach(function (id) { (F.personnes[id].etapes || []).forEach(function (e) { (e.em || []).forEach(function (y) { if ((em[y] = em[y] || []).indexOf(id) < 0) em[y].push(id); }); }); });
    var top = Object.keys(em).filter(function (y) { return em[y].length > 1; }).sort(function (a, b) { return em[b].length - em[a].length; }).slice(0, 4);
    if (top.length) h += '<p class="pa-discret" style="margin-top:.8rem"><b>Les émotions qui voyagent :</b> ' + top.map(function (y) { return esc(y.toLowerCase()) + ' (' + em[y].map(function (id) { return esc(id === 'toi' ? 'toi' : (F.personnes[id].prenom || etiquetteFil(id))); }).join(', ') + ')'; }).join(' · ') + '</p>';
    var ages = {}; ids.forEach(function (id) { (F.personnes[id].etapes || []).forEach(function (e) { var a = ageNum(e.age); if (a != null && plein(e)) { if ((ages[a] = ages[a] || []).indexOf(id) < 0) ages[a].push(id); } }); });
    var ag = Object.keys(ages).filter(function (a) { return ages[a].length > 1; });
    if (ag.length) h += '<p class="pa-discret"><b>Les âges qui se répondent :</b> ' + ag.map(function (a) { return a + ' ans (' + ages[a].map(function (id) { return esc(id === 'toi' ? 'toi' : (F.personnes[id].prenom || etiquetteFil(id))); }).join(', ') + ')'; }).join(' · ') + '</p>';
    return h + '</section>';
  }
  function ouvrirMoment(k) {
    var F = filEtat(), P = F.personnes[filSel] ? filSel : 'toi', x = F.personnes[P], neuf = k === 'new';
    if (neuf) { x.etapes = (x.etapes || []).filter(plein); x.etapes.push({ age: '', evt: '', bl: [], em: [], vi: [], texte: '' }); k = x.etapes.length - 1; }
    var e = x.etapes[+k];
    var z = feuille('<p class="pa-etiq">Fil d’or · ' + esc(x.prenom || etiquetteFil(P)) + '</p><h2>' + (neuf ? 'Un nouveau moment' : 'Ce moment') + '</h2><form class="pa-form" novalidate onsubmit="return false">' +
      '<label for="pa-m-age">' + (P === 'toi' ? 'L’âge que tu avais' : 'L’âge qu’' + (/m$/.test(P) || /soeur|tante/.test(x.rel) ? 'elle' : 'il') + ' avait') + ' <small>(à peu près)</small></label><input id="pa-m-age" data-m="age" inputmode="numeric" maxlength="12" value="' + esc(e.age || '') + '">' +
      '<label for="pa-m-evt">Ce qui s’est passé</label><input id="pa-m-evt" data-m="evt" maxlength="140" value="' + esc(e.evt || '') + '" placeholder="Le départ de mon père, une séparation, un déménagement…">' +
      '<p class="pa-lab">Ce qui a été ressenti</p>' + puces('m-em', PF.EMOTIONS || [], e.em || [], true) +
      '<p class="pa-lab">Une blessure ?</p>' + puces('m-bl', PF.BLESSURES || [], e.bl || [], true) +
      '<label for="pa-m-texte">Ce que tu sais, ou ce que tu sens <small>(facultatif)</small></label><textarea id="pa-m-texte" data-m="texte" maxlength="2000">' + esc(e.texte || '') + '</textarea>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-m-ok>C’est noté</button><button type="button" class="pa-lien-s" data-m-suppr>Supprimer ce moment</button></div></form>');
    z.addEventListener('input', function (ev) { var t = ev.target.getAttribute('data-m'); if (t) { e[t] = ev.target.value; sauverFil(); } });
    z.addEventListener('change', function () { e.em = lirePuces(z, 'm-em'); e.bl = lirePuces(z, 'm-bl'); sauverFil(); });
    z.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-m-ok]')) fermerFeuille();
      if (ev.target.closest('[data-m-suppr]')) { x.etapes.splice(+k, 1); sauverFil(); fermerFeuille(); }
    });
  }
  /* Le ciel et les nombres de ta lignée : ce qui se répète d'une personne à l'autre */
  function astroLignee() {
    var l = [], b = naissance();
    if (b) l.push({ nom: 'toi', d: b, moi: true });
    personnes().forEach(function (p) { if (p.anneeN) l.push({ nom: p.prenom, d: p.anneeN, p: p }); });
    var g = { chemin: {}, signe: {}, mois: {}, jour: {} };
    l.forEach(function (x) {
      var c = cheminDe(x.d), s2 = signeDe(x.d);
      if (c) (g.chemin[c] = g.chemin[c] || []).push(x);
      if (s2) (g.signe[s2] = g.signe[s2] || []).push(x);
      (g.mois[x.d.m] = g.mois[x.d.m] || []).push(x);
      (g.jour[x.d.j] = g.jour[x.d.j] || []).push(x);
    });
    var out = [];
    function noms(t) { return liste(t.map(function (x) { return x.p ? nomL(x.p) : x.nom; })); }
    Object.keys(g.chemin).forEach(function (k) { if (g.chemin[k].length > 1) out.push({ moi: g.chemin[k].some(function (x) { return x.moi; }), t: 'Chemin de vie ' + k + ' : ' + noms(g.chemin[k]) }); });
    Object.keys(g.signe).forEach(function (k) { if (g.signe[k].length > 1) out.push({ moi: g.signe[k].some(function (x) { return x.moi; }), t: 'Soleil en ' + k + ' : ' + noms(g.signe[k]) }); });
    Object.keys(g.jour).forEach(function (k) { if (g.jour[k].length > 1) out.push({ moi: g.jour[k].some(function (x) { return x.moi; }), t: 'Né·es un ' + k + ' : ' + noms(g.jour[k]) }); });
    Object.keys(g.mois).forEach(function (k) { if (g.mois[k].length > 2) out.push({ moi: g.mois[k].some(function (x) { return x.moi; }), t: g.mois[k].length + ' naissances en ' + MOIS[k - 1] + ' : ' + noms(g.mois[k]) }); });
    return out.sort(function (a, b) { return b.moi - a.moi; });
  }
  function blocCiel() {
    var A2 = astroLignee();
    if (!A2.length) return '<section class="pa-carte"><p class="pa-etiq">Ta base · le ciel et les nombres de ta lignée</p><p>Avec les dates de naissance complètes dans ton arbre, tu verras ici les chemins de vie, les signes et les dates qui se répètent d’une génération à l’autre.</p></section>';
    return '<section class="pa-carte"><p class="pa-etiq">Ta base · le ciel et les nombres de ta lignée</p><ul class="pa-echos">' + A2.slice(0, 8).map(function (x) { return '<li>' + (x.moi ? '<b>' : '') + esc(x.t) + (x.moi ? '</b>' : '') + '</li>'; }).join('') + '</ul><p class="pa-discret">En gras, ce que tu partages. Un nombre ou un signe qui revient est une invitation à regarder, pas une explication.</p></section>';
  }

  /* ── 3. Mon agenda ── */
  function datesLignee(a, m) {
    var P = (D.arbre && D.arbre.people) || {}, l = [];
    Object.keys(P).forEach(function (k) {
      var p = P[k], n = dateComplete(p.naiss), d = dateComplete(p.deces), moi = p.role === 'moi';
      if (n && n.m === m + 1) l.push({ j: n.j, type: 'l', cle: 'n-' + k, texte: moi ? 'Ton anniversaire' : 'Naissance de ' + nomA(k, P) + ' (' + n.a + ')', sous: (cheminDe(n) ? 'Chemin de vie ' + cheminDe(n) + ' · ' : '') + 'Soleil en ' + signeDe(n), ans: a - n.a });
      if (d && d.m === m + 1) l.push({ j: d.j, type: 'f', cle: 'd-' + k, texte: 'Départ de ' + nomA(k, P) + ' (' + d.a + ')', ans: a - d.a });
    });
    return l;
  }
  /* Les échos d'âge, regroupés par personne : ce qu'ont vécu les tiens à l'âge que tu as cette année */
  function echosAge(annee) {
    var P = (D.arbre && D.arbre.people) || {}, b = naissance(), moi = moiDeLArbre(); if (!b) return { age: null, l: [] };
    var age = annee - b.a, G = {}, ordre = [];
    function add(cle, nom, t) { if (!G[cle]) { G[cle] = { nom: nom, t: [] }; ordre.push(cle); } if (G[cle].t.indexOf(t) < 0) G[cle].t.push(t); }
    Object.keys(P).forEach(function (k) {
      if (moi && k === moi.id) return; var p = P[k];
      (p.events || []).forEach(function (e) { if (+e.age === age && EVT[e.type]) add('a:' + k, nomA(k, P), EVT[e.type] + (e.year ? ' (' + e.year + ')' : '')); });
      var dd = dateComplete(p.deces), nn = dateComplete(p.naiss); if (dd && nn && dd.a - nn.a === age) add('a:' + k, nomA(k, P), 'son départ (' + dd.a + ')');
    });
    var F = (D.fil && D.fil.personnes) || {};
    Object.keys(F).forEach(function (k) { if (k === 'toi') return; var x = personneDuFil(k); (F[k].etapes || []).forEach(function (e) { if (ageNum(e.age) === age && e.evt) add(x ? x.k : 'f:' + k, x ? nomL(x) : nomFil(k), '« ' + e.evt + ' »'); }); });
    return { age: age, l: ordre.map(function (c) { return G[c]; }) };
  }
  function evenements(a, m) {
    var E = {}, L = lunesDuMois(a, m);
    function add(j, e) { (E[j] = E[j] || []).push(e); }
    datesLignee(a, m).forEach(function (x) { add(x.j, { type: x.type, cle: x.cle, texte: x.texte + (x.ans > 0 ? ' · il y a ' + x.ans + ' ans' : ''), sous: x.sous }); });
    var HU = D.etat.humeurs || {};
    Object.keys(HU).forEach(function (k) { var d = dateComplete(k); if (d && d.a === a && d.m === m + 1 && (HU[k] || []).length) add(d.j, { type: 'h', cle: 'hum-' + k, texte: 'État d’âme : ' + HU[k].join(', ').toLowerCase(), humeur: true }); });
    reps().forEach(function (x) { var p = String(x.jm || '').split('/'); if (p.length === 2 && +p[1] === m + 1) add(+p[0], { type: 'r', cle: 'rep-' + x.jm, texte: x.label, sous: x.desc }); });
    Object.keys(L).forEach(function (k) { add(+k.slice(8, 10), { type: 'm', cle: 'lune-' + k, texte: L[k] }); });
    D.etat.ressentis.forEach(function (r) {
      var q = r.qui ? personne(r.qui) : null, qt = q ? q.prenom + ' (' + q.lien.toLowerCase() + ')' : '';
      var d = dateComplete(r.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'e', cle: 'res-' + r.id, texte: 'Ressenti : ' + (r.em && r.em.length ? r.em.join(', ').toLowerCase() : String(r.quoi || '').slice(0, 60)), sous: String(r.quoi || '').slice(0, 100) + (qt ? ' · lié à ' + qt : ''), fil: r.id });
      var l = dateComplete(r.libere); if (l && l.a === a && l.m === m + 1) add(l.j, { type: 'lib', cle: 'lib-' + r.id, texte: 'Mémoire libérée' + (r.nom ? ' : ' + r.nom.replace(/^la /, '') : ''), sous: qt ? 'Rendue à ' + qt + liensDates(q) : '', fil: r.id });
      var s = dateComplete(r.spirale); if (s && s.a === a && s.m === m + 1) add(s.j, { type: 'lib', cle: 'spi-' + r.id, texte: 'Un fil devenu spirale', fil: r.id });
      var g = dateComplete(r.gesteDate); if (g && r.geste && g.a === a && g.m === m + 1) add(g.j, { type: 'g', cle: 'geste-' + r.id, texte: 'Mon geste : ' + r.geste, fil: r.id });
      var ip = dateComplete(r.intentionPosee); if (ip && ip.a === a && ip.m === m + 1) add(ip.j, { type: 'int', cle: 'int-' + r.id, texte: 'Intention posée : « ' + (r.intention || '') + ' »', fil: r.id });
      if (r.intentionPosee && !r.spirale) lunesApres(r.intentionPosee, 6).forEach(function (k) { var x = dateComplete(k); if (x.a === a && x.m === m + 1) add(x.j, { type: 'int', cle: 'lun-' + r.id + k, texte: 'Nouvelle lune : ton intention revient', sous: '« ' + (r.intention || '') + ' » · qu’est-ce qui a bougé ?', fil: r.id, etape: 4 }); });
      var vs = dateComplete(r.voisDate); if (vs && vs.a === a && vs.m === m + 1) add(vs.j, { type: 'e', cle: 'vois-' + r.id, texte: 'Prise de conscience', sous: String(r.vois || '').slice(0, 120), fil: r.id });
      /* un an après une libération : une date à fêter */
      if (l && l.a < a && l.m === m + 1) add(l.j, { type: 'lib', cle: 'anlib-' + r.id, texte: 'Il y a ' + (a - l.a) + ' an' + (a - l.a > 1 ? 's' : '') + ', tu libérais une mémoire', fil: r.id });
    });
    (D.etat.reves || []).forEach(function (v) { var d = dateComplete(v.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'rv', cle: 'reve-' + v.id, texte: 'Un rêve' + ((v.symboles || []).length ? ' : ' + v.symboles.join(', ').toLowerCase() : ''), sous: String(v.texte || '').slice(0, 100), reve: v.id }); });
    var notes = D.etat.notes || {};
    Object.keys(notes).forEach(function (k) { if (+k.slice(0, 4) === a && +k.slice(5, 7) === m + 1) (notes[k] || []).forEach(function (t, n) { add(+k.slice(8, 10), { type: 'n', cle: 'note-' + k + '-' + n, texte: t, note: true }); }); });
    return E;
  }
  /* Les dates de la personne concernée par une libération, pour voir le lien avec elle */
  function liensDates(q) {
    if (!q) return ''; var t = [];
    if (q.anneeN) t.push((q.f ? 'née' : 'né') + ' le ' + q.anneeN.j + ' ' + MOIS[q.anneeN.m - 1] + ' ' + q.anneeN.a + (cheminDe(q.anneeN) ? ', chemin de vie ' + cheminDe(q.anneeN) : ''));
    if (q.anneeD) t.push((q.f ? 'partie' : 'parti') + ' le ' + q.anneeD.j + ' ' + MOIS[q.anneeD.m - 1] + ' ' + q.anneeD.a);
    var c = communs(q); if (c.length) t.push('vous avez ' + c.join(', '));
    return t.length ? ' · ' + t.join(' · ') : '';
  }
  /* Ton chemin du mois : ressentis, états d'âme, libérations et gestes, avec les personnes de ta lignée */
  function cheminMois(a, m) {
    var l = [];
    D.etat.ressentis.forEach(function (r) {
      var q = r.qui ? personne(r.qui) : null;
      [['date', 'Tu déposes'], ['voisDate', 'Tu prends conscience'], ['libere', 'Tu libères'], ['gesteDate', 'Ton geste'], ['intentionPosee', 'Tu poses ton intention'], ['spirale', 'Devenu spirale']].forEach(function (c) {
        var d = dateComplete(r[c[0]]); if (!d || d.a !== a || d.m !== m + 1) return;
        if (c[0] === 'gesteDate' && !r.geste) return;
        var t = c[0] === 'date' ? (r.em || []).join(', ').toLowerCase() || String(r.quoi || '').slice(0, 50) : c[0] === 'voisDate' ? String(r.vois || '').slice(0, 70) : c[0] === 'libere' ? (r.nom || 'une mémoire') : c[0] === 'gesteDate' ? r.geste : c[0] === 'intentionPosee' ? '« ' + String(r.intention || '').slice(0, 70) + ' »' : '';
        l.push({ j: d.j, k: c[0], fil: r.id, t: c[1] + (t ? ' : ' + t : ''), q: q });
      });
    });
    (D.etat.reves || []).forEach(function (v) { var d = dateComplete(v.date); if (d && d.a === a && d.m === m + 1) l.push({ j: d.j, k: 'reve', reve: v.id, t: 'Un rêve' + ((v.symboles || []).length ? ' : ' + v.symboles.join(', ').toLowerCase() : ''), q: null }); });
    var HU = D.etat.humeurs || {}, cpt = {};
    Object.keys(HU).forEach(function (k) { var d = dateComplete(k); if (d && d.a === a && d.m === m + 1) (HU[k] || []).forEach(function (x) { cpt[x] = (cpt[x] || 0) + 1; }); });
    return { l: l.sort(function (x, y) { return x.j - y.j; }), humeurs: cpt };
  }
  /* Les périodes qui reviennent : ce que ce mois-là porte dans ta lignée, d'une année sur l'autre */
  function periodeMois(a, m) {
    var P = (D.arbre && D.arbre.people) || {}, dep = [], l = [];
    Object.keys(P).forEach(function (k) { var d = dateComplete(P[k].deces); if (d && d.m === m + 1) dep.push(nomA(k, P) + ' (' + d.a + ')'); });
    if (dep.length >= 2) l.push(dep.length + ' départs en ' + MOIS[m] + ' dans ta lignée : ' + liste(dep) + '.');
    var avant = D.etat.ressentis.filter(function (r) { var d = dateComplete(r.date); return d && d.m === m + 1 && d.a < a; });
    if (avant.length) l.push('Tu avais déposé ' + avant.length + ' ressenti' + (avant.length > 1 ? 's' : '') + ' en ' + MOIS[m] + ' les années passées : ' + liste(avant.map(function (r) { return (r.em || [])[0] ? r.em[0].toLowerCase() : 'un ressenti'; }).filter(function (v, i, x) { return x.indexOf(v) === i; })) + '.');
    var rp = reps().filter(function (x) { var p = String(x.jm || '').split('/'); return p.length === 2 && +p[1] === m + 1; });
    rp.forEach(function (x) { l.push(x.label + '.'); });
    var b = naissance(), nes = personnes().filter(function (p) { return p.anneeN && p.anneeN.m === m + 1; });
    if (b && b.m === m + 1) l.push('C’est ton mois de naissance' + (nes.length ? ' : ' + liste(nes.map(nomL)) + ' aussi' : '') + '.');
    else if (nes.length >= 2) l.push(nes.length + ' naissances en ' + MOIS[m] + ' : ' + liste(nes.map(function (p) { return nomL(p) + ' (' + signeDe(p.anneeN) + ')'; })) + '.');
    var lib = D.etat.ressentis.filter(function (r) { var d = dateComplete(r.libere); return d && d.m === m + 1 && d.a < a; });
    lib.forEach(function (r) { var d = dateComplete(r.libere), q = r.qui ? personne(r.qui) : null; l.push('En ' + MOIS[m] + ' ' + d.a + ', tu libérais ' + (r.nom || 'une mémoire') + (q ? ', rendue à ' + nomL(q) : '') + '.'); });
    return l;
  }
  var vueMoisD = null, jourChoisi = null;
  function vueAgenda() {
    var auj = new Date(); if (!vueMoisD) vueMoisD = new Date(auj.getFullYear(), auj.getMonth(), 1);
    var a = vueMoisD.getFullYear(), m = vueMoisD.getMonth(), E = evenements(a, m), dec = (new Date(a, m, 1).getDay() + 6) % 7, nb = new Date(a, m + 1, 0).getDate();
    if (!jourChoisi || jourChoisi.getMonth() !== m || jourChoisi.getFullYear() !== a) jourChoisi = auj.getMonth() === m && auj.getFullYear() === a ? auj : new Date(a, m, 1);
    var h = '<h1 class="pa-h1">Mon agenda</h1><p class="pa-sous">Les dates de ta lignée et ce qui revient, tes ressentis et tes libérations, les lunes et tes jours personnels.</p><div class="pa-2col pa-ag"><div>' +
      '<div class="pa-mois-tete"><button type="button" data-mois="-1" aria-label="Mois précédent">‹</button><h2>' + MOIS[m] + ' ' + a + '</h2><button type="button" data-mois="1" aria-label="Mois suivant">›</button></div>' +
      (naissance() ? '<p class="pa-jp-opt"><button type="button" data-jp aria-pressed="' + voirJP() + '">Mes jours personnels</button></p>' : '') +
      '<div class="pa-grille">' + JS.map(function (j) { return '<span class="js">' + j + '</span>'; }).join('');
    for (var k = 0; k < dec; k++) h += '<span class="pa-jour vide"></span>';
    for (var j = 1; j <= nb; j++) {
      var dt = new Date(a, m, j), ev = E[j] || [], jp = voirJP() ? jourPerso(dt) : null, cl = (iso(dt) === iso(auj) ? ' auj' : '') + (iso(dt) === iso(jourChoisi) ? ' choisi' : '');
      h += '<button type="button" class="pa-jour' + cl + '" data-jour="' + j + '"><span class="n">' + j + '</span>' + (jp ? '<span class="jp">' + jp + '</span>' : '') + '<span class="pts">' + ev.slice(0, 5).map(function (e) { return '<i class="' + e.type + '"></i>'; }).join('') + '</span></button>';
    }
    h += '</div><details class="pa-legende-d"><summary>Légende</summary><p class="pa-legende"><span><i class="l"></i>naissance</span><span><i class="f"></i>départ</span><span><i class="r"></i>date qui revient</span><span><i class="e"></i>ressenti</span><span><i class="lib"></i>libération</span><span><i class="g"></i>mon geste</span><span><i class="h"></i>état d’âme</span><span><i class="int"></i>intention</span><span><i class="rv"></i>rêve</span><span><i class="m"></i>lune</span><span><i class="n"></i>note</span>' + (voirJP() ? '<span><b class="jpl">5</b> jour personnel (ton nombre du jour)</span>' : '') + '</p></details>';
    var pm = periodeMois(a, m), ea = a === auj.getFullYear() ? echosAge(a) : { l: [] }, cm = cheminMois(a, m);
    if (cm.l.length || Object.keys(cm.humeurs).length) {
      h += '<section class="pa-carte"><p class="pa-etiq">Ton chemin en ' + MOIS[m] + '</p>';
      if (cm.l.length) h += '<ul class="pa-frise">' + cm.l.map(function (x) { return '<li class="' + x.k + '"><b>' + x.j + '</b><button type="button" ' + (x.reve ? 'data-reve="' + esc(x.reve) + '"' : 'data-fil="' + esc(x.fil) + '"') + '><span>' + esc(x.t) + '</span>' + (x.q ? '<small>avec ' + esc(x.q.prenom + ', ' + x.q.lien.toLowerCase()) + '</small>' : '') + '</button></li>'; }).join('') + '</ul>';
      var hk = Object.keys(cm.humeurs).sort(function (x, y) { return cm.humeurs[y] - cm.humeurs[x]; });
      if (hk.length) h += '<p class="pa-discret"><b>Tes états d’âme :</b> ' + hk.map(function (x) { return esc(x.toLowerCase()) + ' (' + cm.humeurs[x] + ' jour' + (cm.humeurs[x] > 1 ? 's' : '') + ')'; }).join(', ') + '</p>';
      h += '</section>';
    }
    if (pm.length) h += '<section class="pa-carte"><p class="pa-etiq">Ce qui revient en ' + MOIS[m] + '</p><ul class="pa-echos">' + pm.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>';
    if (ea.l && ea.l.length) h += '<section class="pa-carte"><p class="pa-etiq">Échos d’âge, cette année</p><p>Tu as ' + ea.age + ' ans cette année. Au même âge, dans ta lignée :</p><ul class="pa-echos">' + ea.l.slice(0, 6).map(function (x) { return '<li><b>' + esc(x.nom) + '</b> : ' + esc(x.t.join(' · ')) + '</li>'; }).join('') + '</ul><p class="pa-discret">Une piste, pas une prédiction : un âge qui se répond invite à poser une question.</p></section>';
    h += '</div><div><section class="pa-carte" id="pa-jour-detail"></section>';
    var nR = Object.keys(D.etat.rappels || {}).length;
    h += '<section class="pa-carte"><p class="pa-etiq">Mes rappels</p><p>' + (nR ? nR + ' rappel' + (nR > 1 ? 's choisis' : ' choisi') + '. ' : 'Touche la cloche d’une date pour la choisir. ') + 'Ajoute-les au calendrier de ton téléphone : chaque date de ta lignée revient tous les ans, la veille au soir et le jour même.</p>' +
      '<button type="button" class="pa-bt' + (nR ? '' : ' clair') + '" data-ics' + (nR ? '' : ' disabled') + '>Ajouter mes rappels à mon calendrier</button></section>';
    if (!baseOk()) h += '<section class="pa-carte"><p class="pa-etiq">Pour un agenda plus riche</p><p>Ton arbre (avec les dates complètes) et ton fil d’or nourrissent ton agenda.</p><div class="pa-outils"><a class="pa-bt clair" href="genosociogramme.html">Mon arbre</a><a class="pa-bt clair" href="#fil">Mon fil d’or</a></div></section>';
    h += '</div></div>';
    afficher(h); detailJour();
  }
  function voirJP() { var v = lireL('genesolia-pass-jp'); return v == null ? window.innerWidth >= 700 : !!v; }
  var CLOCHE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  function detailJour() {
    var z = document.getElementById('pa-jour-detail'); if (!z) return;
    var dt = jourChoisi, ev = evenements(dt.getFullYear(), dt.getMonth())[dt.getDate()] || [], jp = jourPerso(dt), k = iso(dt);
    var h = '<p class="pa-etiq">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>';
    if (jp) h += '<p><b class="jpl">' + jp + '</b> · ' + esc((N.JOURNEES || {})[jp] || '') + '</p>';
    h += ev.length ? ev.map(function (e) {
      var on = !!(D.etat.rappels || {})[e.cle], btn;
      if (e.note) btn = '<button type="button" class="pa-cloche" data-suppr="' + esc(e.cle) + '" aria-label="Supprimer cette note">×</button>';
      else if (e.humeur) btn = '';
      else if (e.reve) btn = '<button type="button" class="pa-cloche" data-reve="' + esc(e.reve) + '" aria-label="Ouvrir ce rêve">›</button>';
      else if (e.fil) btn = '<button type="button" class="pa-cloche" data-fil="' + esc(e.fil) + '"' + (e.etape != null ? ' data-etape="' + e.etape + '"' : '') + ' aria-label="Ouvrir">›</button>';
      else btn = '<button type="button" class="pa-cloche" data-rappel="' + esc(e.cle) + '" data-texte="' + esc(e.texte) + '" data-date="' + k + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Retirer le rappel' : 'Me le rappeler') + '">' + CLOCHE + '</button>';
      return '<div class="pa-evt"><p><i class="pa-pt ' + e.type + '"></i>' + esc(e.texte) + (e.sous ? '<small>' + esc(e.sous) + '</small>' : '') + (e.note ? '<small>Ta note</small>' : '') + '</p>' + btn + '</div>';
    }).join('') : '<p class="pa-discret">Rien de particulier dans ta lignée ce jour-là.</p>';
    if (dt <= new Date()) h += '<p class="pa-lab">Mon état d’âme ce jour-là</p>' + puces('humeur', PF.HUMEURS || [], (D.etat.humeurs || {})[k] || [], true);
    h += '<div class="pa-note"><input type="text" id="pa-note-t" maxlength="140" placeholder="Une action, un ressenti, un rêve…" aria-label="Ajouter une note à ce jour"><button type="button" class="pa-bt" style="margin:0" data-note>Noter</button></div>';
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
    var x = document.createElement('a'); x.href = URL.createObjectURL(new Blob([l.join('\r\n')], { type: 'text/calendar' })); x.download = 'mon-enquete-rappels.ics';
    document.body.appendChild(x); x.click(); x.remove();
  }

  /* ── 4. Mon bilan ── */
  function dessinLignee() {
    var P = personnes().slice().sort(function (x, y) { return x.rang - y.rang || y.gen - x.gen; }), W = 640, C = W / 2, RAY = [0, 118, 200, 272], L = D.etat.liens || {};
    var rangs = [[], [], [], []]; P.forEach(function (p) { if (rangs[p.rang].length < [0, 10, 14, 16][p.rang]) rangs[p.rang].push(p); });
    var s = '<svg class="pa-lignee" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="Ta lignée en sphères de lumière"><defs>' +
      '<radialGradient id="pa-g-paix"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#FFF4DA"/><stop offset="1" stop-color="#F2D9A0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pa-g-mit"><stop offset="0" stop-color="#FFE7CC"/><stop offset=".6" stop-color="#F3A65A" stop-opacity=".55"/><stop offset="1" stop-color="#E8893A" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pa-g-sph"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#F6EAF2"/><stop offset="1" stop-color="#D9C2D3"/></radialGradient>' +
      '<radialGradient id="pa-g-toi"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#FFF1CF"/><stop offset="1" stop-color="#E2C48E" stop-opacity="0"/></radialGradient></defs>';
    RAY.slice(1).forEach(function (r, k) { if (rangs[k + 1].length) s += '<circle cx="' + C + '" cy="' + C + '" r="' + r + '" fill="none" stroke="rgba(255,255,255,.08)"/>'; });
    var pos = [];
    [1, 2, 3].forEach(function (rg) {
      var l = rangs[rg], n = l.length; if (!n) return;
      var anc = l.filter(function (p) { return p.gen > 0; }).length, debut = -90 - (anc / n * 360) / 2 + (360 / n) / 2;
      l.forEach(function (p, i) { var ang = (debut + i * 360 / n + (rg === 2 ? 360 / n / 3 : 0)) * Math.PI / 180; pos.push({ p: p, x: C + RAY[rg] * Math.cos(ang), y: C + RAY[rg] * Math.sin(ang) }); });
    });
    pos.forEach(function (o) {
      var t = (L[o.p.k] || {}).t;
      s += '<line x1="' + C + '" y1="' + C + '" x2="' + o.x.toFixed(1) + '" y2="' + o.y.toFixed(1) + '" stroke="' + (t === 'paix' ? '#F2D9A0' : t === 'mitige' ? '#E8893A' : 'rgba(255,255,255,.18)') + '" stroke-width="' + (t ? 2.6 : 1.2) + '"' + (t ? '' : ' stroke-dasharray="3 5"') + (t === 'paix' ? ' opacity=".9"' : '') + '/>';
    });
    s += '<circle cx="' + C + '" cy="' + C + '" r="64" fill="url(#pa-g-toi)"/><circle cx="' + C + '" cy="' + C + '" r="30" fill="#fff"/><text x="' + C + '" y="' + (C + 5) + '" text-anchor="middle" class="pa-sv-toi">' + esc(D.prenom || 'Toi') + '</text>';
    pos.forEach(function (o) {
      var t = (L[o.p.k] || {}).t, r = o.p.rang === 1 ? 22 : o.p.rang === 2 ? 19 : 16;
      s += '<g class="pa-sph" data-personne="' + esc(o.p.k) + '" tabindex="0" role="button" aria-label="' + esc(o.p.prenom + ', ' + o.p.lien.toLowerCase() + (t === 'paix' ? ', lien de paix' : t === 'mitige' ? ', lien mitigé' : '')) + '">' +
        (t === 'paix' ? '<circle cx="' + o.x.toFixed(1) + '" cy="' + o.y.toFixed(1) + '" r="' + (r + 18) + '" fill="url(#pa-g-paix)"/>' : t === 'mitige' ? '<circle cx="' + o.x.toFixed(1) + '" cy="' + o.y.toFixed(1) + '" r="' + (r + 14) + '" fill="url(#pa-g-mit)"/>' : '') +
        '<circle cx="' + o.x.toFixed(1) + '" cy="' + o.y.toFixed(1) + '" r="' + r + '" fill="url(#pa-g-sph)" stroke="' + (t === 'paix' ? '#FFF4DA' : t === 'mitige' ? '#E8893A' : 'rgba(255,255,255,.45)') + '" stroke-width="' + (t ? 3 : 1.4) + '"' + (o.p.parti ? ' opacity=".82"' : '') + '/>' +
        (communs(o.p).length ? '<text x="' + (o.x + r * .8).toFixed(1) + '" y="' + (o.y - r * .55).toFixed(1) + '" class="pa-sv-et">✦</text>' : '') +
        '<text x="' + o.x.toFixed(1) + '" y="' + (o.y + r + 15).toFixed(1) + '" text-anchor="middle" class="pa-sv-nom">' + esc(o.p.prenom.slice(0, 13)) + '</text>' +
        '<text x="' + o.x.toFixed(1) + '" y="' + (o.y + r + 28).toFixed(1) + '" text-anchor="middle" class="pa-sv-lien">' + esc(o.p.lien.replace(/^(Ton|Ta|Une|Un) /, '')) + '</text></g>';
    });
    return s + '</svg>';
  }
  function vueBilan() {
    var Rs = D.etat.ressentis, L = D.etat.liens || {}, P = personnes();
    var h = '<h1 class="pa-h1">Mon bilan</h1><p class="pa-sous">Ta lignée telle que tu la sens aujourd’hui. Touche une sphère pour poser le lien que tu ressens.</p><div class="pa-2col pa-bil"><div>';
    if (P.length) {
      h += '<section class="pa-carte pa-nuit pa-ciel-l">' + dessinLignee() + '<p class="pa-leg-l"><span><i class="paix"></i>Lien de paix · cercle de lumière</span><span><i class="mit"></i>Lien mitigé · même avec de l’amour</span><span><i class="vide"></i>Pas encore regardé</span><span><b class="pa-et">✦</b>Te ressemble (nombres, ciel)</span></p></section>';
    } else h += '<section class="pa-carte"><p class="pa-etiq">Ta lignée en sphères</p><p>Ajoute les tiens dans ton arbre ou ton fil d’or : ils apparaîtront ici, chacun dans sa sphère, reliés à toi.</p><div class="pa-outils"><a class="pa-bt clair" href="#fil">Mon fil d’or</a><a class="pa-bt clair" href="genosociogramme.html">Mon arbre</a></div></section>';
    h += '</div><div>';
    var lib = Rs.filter(function (r) { return r.libere; }), spi = Rs.filter(function (r) { return r.spirale; });
    h += '<section class="pa-carte"><p class="pa-etiq">Ton chemin</p><p class="pa-stats"><span><b>' + Rs.length + '</b>ressenti' + (Rs.length > 1 ? 's' : '') + ' déposé' + (Rs.length > 1 ? 's' : '') + '</span><span><b>' + lib.length + '</b>mémoire' + (lib.length > 1 ? 's' : '') + ' libérée' + (lib.length > 1 ? 's' : '') + '</span><span><b>' + spi.length + '</b>devenu' + (spi.length > 1 ? 's' : '') + ' spirale</span></p><p class="pa-def">Spirale : la mémoire est libérée ; quand le thème revient, tu le reconnais et tu réagis autrement.</p>';
    if (Rs.length) {
      var prem = Rs.map(function (r) { return r.date; }).sort()[0], d0 = dateComplete(prem), now = new Date(), mois = d0 ? (now.getFullYear() - d0.a) * 12 + now.getMonth() + 1 - d0.m : 0, ph = null;
      (PF.PHASES || []).some(function (x) { if (mois < x[0]) { ph = x; return true; } return false; });
      if (ph) h += '<p class="pa-lab">Où tu en es · ' + esc(ph[1]) + '</p><p class="pa-def">Le chemin a 5 phases, de la surface à l’intégration, comptées depuis ton premier ressenti.</p><p class="pa-discret" style="margin-top:0">' + esc(ph[2]) + '</p>';
    }
    var ra = Rs.filter(function (r) { return r.cycle === 'racine' || r.cycle === 'deux'; }).length, co = Rs.filter(function (r) { return r.cycle === 'coeur' || r.cycle === 'deux'; }).length;
    if (ra + co) h += '<p class="pa-lab">Cycle 1 ou cycle 2</p><div class="pa-barres"><span style="flex:' + (ra || .001) + '" class="ra">Cycle 1 · ' + ra + '</span><span style="flex:' + (co || .001) + '" class="co">Cycle 2 · ' + co + '</span></div>';
    var aq = {}; Rs.forEach(function (r) { var x = aquiDe(r); if (x) aq[x] = (aq[x] || 0) + 1; });
    if (Object.keys(aq).length) h += '<p class="pa-discret"><b>D’où viennent tes mémoires :</b> ' + (PF.PORTES || []).filter(function (x) { return aq[x[0]]; }).map(function (x) { return esc(x[1].toLowerCase()) + ' (' + aq[x[0]] + ')'; }).join(', ') + '</p>';
    var em = {}; Rs.forEach(function (r) { (r.em || []).forEach(function (x) { em[x] = (em[x] || 0) + 1; }); });
    var tE = Object.keys(em).sort(function (a, b) { return em[b] - em[a]; }).slice(0, 4);
    if (tE.length) h += '<p class="pa-discret"><b>Ce qui revient le plus :</b> ' + tE.map(function (x) { return esc(x.toLowerCase()) + ' (' + em[x] + ')'; }).join(', ') + '</p>';
    h += '</section>';
    var paix = P.filter(function (p) { return (L[p.k] || {}).t === 'paix'; }), mit = P.filter(function (p) { return (L[p.k] || {}).t === 'mitige'; });
    if (paix.length || mit.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes liens</p>' + (paix.length ? '<p><b class="pa-or">En paix :</b> ' + esc(liste(paix.map(nomL))) + '</p>' : '') + (mit.length ? '<p><b class="pa-orange">Mitigés :</b> ' + esc(liste(mit.map(nomL))) + '</p>' : '') + '</section>';
    var peurs = {}; P.forEach(function (p) { ((L[p.k] || {}).peurs || []).forEach(function (x) { (peurs[x] = peurs[x] || []).push(nomL(p)); }); });
    if (Object.keys(peurs).length) h += '<section class="pa-carte"><p class="pa-etiq">Les peurs que tu partages</p><ul class="pa-echos">' + Object.keys(peurs).map(function (x) { return '<li><b>' + esc(x) + '</b> · avec ' + esc(liste(peurs[x])) + '</li>'; }).join('') + '</ul></section>';
    var loy = P.filter(function (p) { return (L[p.k] || {}).loyaute; });
    if (loy.length) h += '<section class="pa-carte"><p class="pa-etiq">Les loyautés que tu sens</p><p>' + esc(liste(loy.map(nomL))) + '</p><p class="pa-discret">Une loyauté n’est pas un manque d’amour : c’est souvent beaucoup d’amour, qui garde la même peur pour rester proche.</p></section>';
    if (lib.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes libérations</p><ul class="pa-liste">' + lib.map(function (r) { var q = r.qui ? personne(r.qui) : null; return '<li><span class="pa-pastille or">✦</span><span><b>' + esc(dateCourte(r.libere)) + '</b><br><small>' + esc((q ? 'Rendue à ' + nomL(q) + ' · ' : '') + String(r.quoi || '').slice(0, 90)) + '</small></span></li>'; }).join('') + '</ul></section>';
    var sem = P.map(function (p) { return { p: p, c: communs(p) }; }).filter(function (x) { return x.c.length; });
    if (sem.length) h += '<section class="pa-carte"><p class="pa-etiq">Ceux qui te ressemblent</p><ul class="pa-gens">' + sem.slice(0, 6).map(function (x) { var t = (L[x.p.k] || {}).t; return '<li><button type="button" data-personne="' + esc(x.p.k) + '"><i class="pa-mini ' + (t || '') + '"></i><span><b>' + esc(x.p.prenom) + '</b>' + esc(x.p.lien.toLowerCase() + ' · ' + x.c.join(', ')) + '</span></button></li>'; }).join('') + '</ul><p class="pa-discret">Par les nombres ou par le ciel, ces personnes te ressemblent : elles méritent qu’on les regarde. Qu’ont-elles vécu à ton âge ? Que portent-elles que tu reconnais ?</p></section>';
    var lr = (D.etat.ressentis || []).filter(function (r) { return r.qui; });
    if (lr.length) { var parP = {}; lr.forEach(function (r) { (parP[r.qui] = parP[r.qui] || []).push(r); }); h += '<section class="pa-carte"><p class="pa-etiq">Tes mémoires et tes ancêtres</p><ul class="pa-echos">' + Object.keys(parP).map(function (k) { var q = personne(k); if (!q) return ''; var rr = parP[k]; return '<li><b>' + esc(q.prenom) + '</b> · ' + esc(q.lien.toLowerCase()) + ' : ' + esc(rr.map(function (r) { return (r.nom || (r.em || [])[0] || 'un ressenti').toLowerCase() + (r.libere ? ' (libérée le ' + dateCourte(r.libere) + ')' : ' (en cours)'); }).join(', ')) + '</li>'; }).join('') + '</ul></section>'; }
    var ints = Rs.filter(function (r) { return r.intentionPosee; });
    if (ints.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes intentions</p><ul class="pa-liste">' + ints.map(function (r) { return '<li><span class="pa-pastille or">' + (r.spirale ? '✓' : '✦') + '</span><span><b>« ' + esc(r.intention || '') + ' »</b><br><small>' + esc('Posée le ' + dateCourte(r.intentionPosee) + (r.nom ? ' · après ' + r.nom : '') + (r.spirale ? ' · devenue spirale' : '')) + '</small></span></li>'; }).join('') + '</ul></section>';
    var ro = {}; Rs.forEach(function (r) { (r.roles || []).forEach(function (x) { ro[x] = (ro[x] || 0) + 1; }); });
    if (Object.keys(ro).length) h += '<section class="pa-carte"><p class="pa-etiq">Les rôles que tu prends</p><p>' + esc((PF.ROLES || []).filter(function (x) { return ro[x[0]]; }).map(function (x) { return x[1] + ' (' + ro[x[0]] + ')'; }).join(' · ')) + '</p><p class="pa-discret">Les voir, c’est déjà pouvoir en sortir.</p></section>';
    var RVs = D.etat.reves || [];
    if (RVs.length) { var syb = {}; RVs.forEach(function (v) { (v.symboles || []).forEach(function (x) { syb[x] = (syb[x] || 0) + 1; }); }); var tsy = Object.keys(syb).sort(function (a, b) { return syb[b] - syb[a]; }).slice(0, 4); h += '<section class="pa-carte"><p class="pa-etiq">Tes rêves</p><p>' + RVs.length + ' rêve' + (RVs.length > 1 ? 's' : '') + ' noté' + (RVs.length > 1 ? 's' : '') + (tsy.length ? ' · ' + esc(tsy.map(function (x) { return x.toLowerCase(); }).join(', ')) : '') + '</p></section>'; }
    var nr = reps().length; if (nr) h += '<a class="pa-carte" href="#fil"><p class="pa-etiq">Ce qui se répète</p><p>' + nr + ' piste' + (nr > 1 ? 's' : '') + ' repérée' + (nr > 1 ? 's' : '') + ' dans ton arbre.</p><span class="pa-plus">Voir ma base</span></a>';
    h += '<p class="pa-outils"><button type="button" class="pa-bt clair" data-imprimer>Imprimer mon bilan</button><a class="pa-bt clair" href="genosociogramme.html#lumiere">Ma lignée en lumière (poster)</a></p>';
    h += '</div></div>';
    afficher(h);
  }
  function ouvrirPersonne(k) {
    var p = personne(k); if (!p) return;
    var L = D.etat.liens[k] = D.etat.liens[k] || {}, lies = D.etat.ressentis.filter(function (r) { return r.qui === k; });
    var h = '<p class="pa-etiq">' + esc(p.lien) + (p.anneeN ? ' · ' + (p.f ? 'née' : 'né') + ' en ' + p.anneeN.a : '') + (p.parti && p.anneeD ? ' · ' + (p.f ? 'partie' : 'parti') + ' en ' + p.anneeD.a : '') + '</p><h2>' + esc(p.prenom) + '</h2>' +
      (communs(p).length ? '<p class="pa-commun">✦ Vous avez ' + esc(communs(p).join(', ')) + '. Regarde ce qu’' + (p.f ? 'elle' : 'il') + ' a vécu : ça mérite d’être vu.</p>' : '') +
      '<div class="pa-bloc"><h4>Le lien que tu ressens</h4>' + puces('lien', [['paix', 'Lien de paix'], ['mitige', 'Lien mitigé'], ['', 'Je ne sais pas encore']], [L.t || ''], false) + '<p class="pa-discret">La paix : tu peux penser à ' + (p.f ? 'elle' : 'lui') + ' sans que rien ne se serre. Mitigé : il y a de l’amour, et aussi quelque chose qui pèse ou qui se ressemble.</p></div>' +
      '<div class="pa-bloc"><h4>Les peurs que vous partagez</h4>' + puces('peurs', PF.PEURS || [], L.peurs || [], true) + '</div>' +
      '<label class="pa-coche"><input type="checkbox" id="pa-loy"' + (L.loyaute ? ' checked' : '') + '> Je sens une loyauté envers ' + (p.f ? 'elle' : 'lui') + ', même avec beaucoup d’amour</label>' +
      '<div class="pa-bloc">' + zoneTexte('note', 'Ce que je sens de ce lien', L.note, 'Quand je pense à ' + p.prenom + '…') + '</div>' +
      (lies.length ? '<div class="pa-bloc"><h4>Tes ressentis rendus à ' + esc(p.prenom) + '</h4>' + lies.map(carteFil).join('') + '</div>' : '') +
      '<p class="pa-discret" data-sauve>' + (D.accord ? 'Gardé dans ton espace, chiffré.' : 'Gardé sur cet appareil.') + '</p>';
    var z = feuille(h);
    z.addEventListener('change', function (e) {
      if (e.target.id === 'pa-loy') L.loyaute = e.target.checked;
      else { L.t = lirePuces(z, 'lien')[0] || ''; L.peurs = lirePuces(z, 'peurs'); }
      sauver();
    });
    z.addEventListener('input', function (e) { if (e.target.getAttribute('data-t') === 'note') { L.note = e.target.value; sauver(); } });
    z.addEventListener('click', function (e) { var f = e.target.closest('[data-fil]'); if (f) ouvrirFil(f.getAttribute('data-fil')); });
  }

  /* ───── Navigation ───── */
  var ANCIENS = { enquete: 'fil', ciel: '', livrets: '' };
  function onglet() { var h = (location.hash || '').replace('#', ''); if (ANCIENS.hasOwnProperty(h)) h = ANCIENS[h]; return ['fil', 'agenda', 'bilan'].indexOf(h) >= 0 ? h : ''; }
  function router() {
    var h = onglet(); CACHE_P = null;
    document.querySelectorAll('.pa-feuille,.pa-voile').forEach(function (x) { x.remove(); }); document.body.classList.remove('pa-fige');
    document.querySelectorAll('.pa-barre [data-onglet]').forEach(function (a) { if (a.getAttribute('data-onglet') === (h || 'moi')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var barre = document.querySelector('.pa-barre');
    if (!D.acces) { barre.hidden = true; document.body.classList.add('pa-porte-b'); return vuePorte(); }
    barre.hidden = false; document.body.classList.remove('pa-porte-b');
    var z = document.getElementById('pa-espaces'); if (z) z.innerHTML = espacesLiens('');
    var fn = h === 'fil' ? vueFil : h === 'agenda' ? vueAgenda : h === 'bilan' ? vueBilan : vueMoi;
    rafraichir = function () { var y = window.scrollY; fn(); window.scrollTo(0, y); };
    if (h === 'fil') vueFil(); else if (h === 'agenda') vueAgenda(); else if (h === 'bilan') vueBilan(); else vueMoi();
  }
  function vueAgendaSansHaut() { var y = window.scrollY; vueAgenda(); window.scrollTo(0, y); }
  window.addEventListener('hashchange', router);
  document.querySelector('.pa-barre').addEventListener('click', function (e) {
    var a = e.target.closest('[data-onglet]'); if (!a) return;
    if (a.getAttribute('data-onglet') === 'moi') { e.preventDefault(); history.pushState(null, '', location.pathname + location.search); router(); }
  });
  vue.addEventListener('click', function (e) {
    if (e.target.closest('[data-depot]')) { ouvrirDepot(); return; }
    if (e.target.closest('[data-fil-vu]')) { D.etat.vu = D.etat.vu || {}; D.etat.vu.fil = iso(new Date()); sauver(); rafraichir(); return; }
    var fp = e.target.closest('[data-fil-p]'); if (fp) { filSel = fp.getAttribute('data-fil-p'); rafraichir(); return; }
    var fm = e.target.closest('[data-fil-m]'); if (fm) { ouvrirMoment(fm.getAttribute('data-fil-m')); return; }
    if (e.target.closest('[data-fil-suppr]')) { var F0 = filEtat(), x0 = F0.personnes[filSel]; if (x0 && (!(x0.etapes || []).some(plein) || confirm('Retirer cette personne et ses moments de ton fil d’or ?'))) { delete F0.personnes[filSel]; F0.ordre = F0.ordre.filter(function (k) { return k !== filSel; }); filSel = 'toi'; sauverFil(); rafraichir(); } return; }
    var cj = e.target.closest('[data-corps-j]'); if (cj) { var rr = trouver(cj.getAttribute('data-corps-j')), kk = iso(new Date()); if (rr) { rr.corpsJ = rr.corpsJ || {}; if (rr.corpsJ[kk]) delete rr.corpsJ[kk]; else rr.corpsJ[kk] = 1; sauver(); rafraichir(); } return; }
    var rv = e.target.closest('[data-reve]'); if (rv) { ouvrirReve(rv.getAttribute('data-reve')); return; }
    var f = e.target.closest('[data-fil]'); if (f) { ouvrirFil(f.getAttribute('data-fil'), f.hasAttribute('data-etape') ? +f.getAttribute('data-etape') : null); return; }
    var pe = e.target.closest('[data-personne]'); if (pe) { ouvrirPersonne(pe.getAttribute('data-personne')); return; }
    if (e.target.closest('[data-imprimer]')) { window.print(); return; }
    if (e.target.closest('[data-jp]')) { ecrireL('genesolia-pass-jp', !voirJP()); vueAgendaSansHaut(); return; }
    var m = e.target.closest('[data-mois]'); if (m) { vueMoisD = new Date(vueMoisD.getFullYear(), vueMoisD.getMonth() + +m.getAttribute('data-mois'), 1); jourChoisi = null; vueAgenda(); return; }
    var j = e.target.closest('[data-jour]'); if (j) { jourChoisi = new Date(vueMoisD.getFullYear(), vueMoisD.getMonth(), +j.getAttribute('data-jour')); document.querySelectorAll('.pa-jour.choisi').forEach(function (x) { x.classList.remove('choisi'); }); j.classList.add('choisi'); detailJour(); if (window.innerWidth < 1000) { var d = document.getElementById('pa-jour-detail'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
    var r = e.target.closest('[data-rappel]');
    if (r) { var c = r.getAttribute('data-rappel'), R = D.etat.rappels = D.etat.rappels || {}; if (R[c]) delete R[c]; else R[c] = { texte: r.getAttribute('data-texte'), date: r.getAttribute('data-date') }; sauver(); vueAgendaSansHaut(); return; }
    var s = e.target.closest('[data-suppr]');
    if (s) { var p = s.getAttribute('data-suppr').split('-'), dk = p.slice(1, 4).join('-'), n = +p[4], N2 = D.etat.notes[dk] || []; N2.splice(n, 1); if (!N2.length) delete D.etat.notes[dk]; sauver(); vueAgendaSansHaut(); return; }
    if (e.target.closest('[data-note]')) { var t = document.getElementById('pa-note-t'), v = t && t.value.trim(); if (!v) return; var k = iso(jourChoisi); (D.etat.notes[k] = D.etat.notes[k] || []).push(v.slice(0, 140)); sauver(); vueAgendaSansHaut(); return; }
    if (e.target.closest('[data-ics]')) { telechargerIcs(); }
  });
  vue.addEventListener('change', function (e) {
    var g = e.target.closest('[data-groupe="humeur"]');
    if (g) { var k = document.getElementById('pa-jour-detail') && jourChoisi && g.closest('#pa-jour-detail') ? iso(jourChoisi) : iso(new Date()), H = D.etat.humeurs = D.etat.humeurs || {}, v = lirePuces(g.parentNode, 'humeur'); if (v.length) H[k] = v; else delete H[k]; sauver(); if (g.closest('#pa-jour-detail')) rafraichir(); return; }
    var aj = e.target.closest('[data-fil-ajout]');
    if (aj && aj.value) { var F = filEtat(), v2 = aj.value, id; if (/^r:/.test(v2)) { F.seq = (F.seq || 0) + 1; id = 'a' + F.seq; F.personnes[id] = nouvPers(id, v2.slice(2)); } else { id = v2; F.personnes[id] = nouvPers(id, ''); } F.ordre.push(id); filSel = id; sauverFil(); rafraichir(); }
  });
  vue.addEventListener('input', function (e) { if (e.target.hasAttribute('data-fil-prenom')) { var F = filEtat(); F.personnes[filSel].prenom = e.target.value.trim().slice(0, 40); sauverFil(); } });
  vue.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-personne]')) { e.preventDefault(); ouvrirPersonne(e.target.closest('[data-personne]').getAttribute('data-personne')); } });

  if (EXEMPLE) {
    var cadre = document.getElementById('pass'), lien = 'login.html?inscription&retour=' + encodeURIComponent('pass.html');
    var bandeau = function (bas) { var d = document.createElement('div'); d.className = 'pa-exemple-b' + (bas ? ' bas' : ''); d.innerHTML = '<p><b>Exemple</b> · Léa est fictive : rien de ce que tu touches ici n’est enregistré.</p><a class="pa-bt or" href="' + lien + '">Créer mon espace gratuit</a>'; return d; };
    cadre.insertBefore(bandeau(false), vue); cadre.appendChild(bandeau(true));
  }
  charger().then(function () { if (!D.etat) D.etat = completer(lireL(CLE)); router(); }, function () { D.etat = completer(null); router(); });
})();
