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
          { id: 'r1', date: il(3), quoi: 'Mon amie a annulé notre week-end au dernier moment, je me suis sentie comme une petite fille laissée sur le quai.', em: ['Tristesse', 'Solitude'], bl: ['abandon'], force: 8, corps: ['La gorge'], revient: 'oui', ages: '8, 31', phrase: 'On finit toujours par me laisser', aqui: 'lignee', qui: 'a:p2', cycle: 'coeur', etape: 2, enquete: { q: {} }, intuition: {} },
          { id: 'r2', date: il(40), quoi: 'Une angoisse en regardant mon compte en banque, alors que tout va bien.', em: ['Peur de manquer'], bl: [], force: 6, corps: ['Le ventre'], revient: 'oui', ages: '', phrase: 'L’argent ne dure jamais', aqui: 'lignee', qui: 'a:p4', cycle: 'racine', etape: 4, libere: il(20), enquete: { q: {} }, intuition: {} }
        ],
        liens: { 'a:p2': { t: 'mitige', peurs: ['Peur d’être abandonné·e'], loyaute: true, note: 'Beaucoup d’amour, et la même peur d’être quittée.' }, 'a:p4': { t: 'paix', peurs: ['Peur de manquer'] } }
      });
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
  function soleil() { var b = naissance(); if (!b) return null; var s = SIGNES[b.m - 1]; return b.j < s[1] ? s[2] : (SIGNES[b.m % 12][2]); }
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
  function phaseDuJour(dt) {
    if (!A) return '';
    var ph = A.MoonPhase(dt);
    return ph < 12 || ph >= 348 ? 'Nouvelle lune' : ph < 78 ? 'Premier croissant' : ph < 102 ? 'Premier quartier' : ph < 168 ? 'Lune gibbeuse croissante' : ph < 192 ? 'Pleine lune' : ph < 258 ? 'Lune gibbeuse décroissante' : ph < 282 ? 'Dernier quartier' : 'Dernier croissant';
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
        else if (anc[id]) lien = f ? 'Une aïeule' : 'Un aïeul';
        else if (desc[id] === 1) lien = f ? 'Ta fille' : p.sex === 'm' ? 'Ton fils' : 'Ton enfant';
        else if (desc[id]) lien = f ? 'Ta petite-fille' : 'Ton petit-fils';
        else if (freres[id]) lien = f ? 'Ta sœur' : 'Ton frère';
        else if ((cpl[moi.id] || []).indexOf(id) >= 0) lien = 'Ton couple';
        else lien = g >= 2 ? (f ? 'Une aïeule' : 'Un aïeul') : g === 1 ? (f ? 'Une tante' : 'Un oncle') : g === 0 ? 'Ta famille' : (f ? 'Une nièce' : 'Un neveu');
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
  function nomFil(id) { if (id === 'toi') return 'Toi'; var p = (D.fil.personnes || {})[id] || {}, b = BASE_FIL[id] || REL_FIL[p.rel]; var l = b ? b[0].toLowerCase() : 'quelqu’un de ta lignée'; return p.prenom ? p.prenom + ' (' + l + ')' : cap(l); }
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
    if (EXEMPLE) return;
    var maj = new Date().toISOString();
    try { localStorage.setItem('genesolia-arbre-ressentis', JSON.stringify(F)); localStorage.setItem('genesolia-arbre-ressentis-maj', maj); } catch (e) {}
    if (sb && D.user && D.accord) window.GenesoliaCoffre.ecrire(sb, D.user, 'fil-d-or', { etat: F, maj: maj, v: 1 });
  }

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
      (P[k].events || []).forEach(function (e) { if (Math.abs(+e.age - age) <= 1 && EVT[e.type]) l.push(prenom1(P[k]) + ' a vécu ' + EVT[e.type] + ' à ' + e.age + ' ans, à peu près ton âge ce jour-là.'); });
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
    var b = e.target.closest('.pa-puces button'); if (!b) return;
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
    var h = '<h1 class="pa-h1">' + (D.prenom ? 'Bonjour ' + esc(D.prenom) : 'Bonjour') + '</h1><p class="pa-sous">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + ' · ' + esc(phaseDuJour(dt)) + '</p><div class="pa-2col"><div>';
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
    if (!baseOk()) {
      h += '<section class="pa-carte pa-base"><p class="pa-etiq">Ta base</p><h2>Ce que tu sais déjà</h2><p>Quelques prénoms, des dates, des moments de ta vie : c’est ta base. Ton agenda, tes échos et ton bilan s’en nourrissent. Commence par celui qui te parle le plus.</p>' +
        '<div class="pa-deux"><a href="genosociogramme.html"><b>Mon arbre</b><span>Les personnes, les dates, les métiers : l’arbre repère tout seul ce qui se répète.</span></a><a href="fil-d-or.html"><b>Mon fil d’or</b><span>Les moments de ta vie et ce que tu as ressenti, puis ceux des tiens.</span></a></div></section>';
    } else {
      var nr = reps().length;
      h += '<a class="pa-carte" href="#fil"><p class="pa-etiq">Ta base</p><p class="pa-stats">' + (nbArbre() ? '<span><b>' + nbArbre() + '</b>personnes dans ton arbre</span>' : '') + (nbMoments() ? '<span><b>' + nbMoments() + '</b>moments dans ton fil d’or</span>' : '') + (nr ? '<span><b>' + nr + '</b>répétitions repérées</span>' : '') + '</p><span class="pa-plus">Voir ma base</span></a>';
    }
    h += '</div><div>';
    h += '<section class="pa-carte pa-depot"><p class="pa-etiq">Quand quelque chose remonte</p><h2>Une émotion, une situation qui se répète ?</h2><p>Au lieu de la garder pour toi, viens la déposer ici. On regarde ensemble à qui elle appartient, et comment la libérer.</p><button type="button" class="pa-bt or" data-depot>Je dépose un ressenti</button></section>';
    if (enCours.length) h += '<p class="pa-titre-s">Mes fils en cours</p>' + enCours.slice(0, 3).map(carteFil).join('') + (enCours.length > 3 ? '<a class="pa-bt clair" href="#fil">Voir tous mes fils</a>' : '');
    h += '<section class="pa-carte"><p class="pa-etiq">La question du jour</p><p class="pa-q-jour">' + esc(q) + '</p><p class="pa-discret">Laisse venir la première réponse, sans la juger.</p></section>';
    h += '</div></div>';
    h += '<section class="pa-carte pa-espaces-m"><p class="pa-etiq">Mes espaces</p><div class="pa-outils">' + espacesLiens('pa-bt clair') + '</div></section>';
    h += '<section class="pa-carte"><p class="pa-etiq">Mes livrets, compris dans ton Pass</p><div class="pa-outils">' + [['Mes nombres', 'theme-numerologique.html'], ['Mon thème astral', 'theme-astral.html'], ['L’arbre de vie', 'arbre-de-vie.html'], ['Analyse à deux', 'ton-signe-maya.html'], ['Le rapport de mon arbre', 'genosociogramme.html'], ['Les 12 saisons', 'assets/cercle/les-12-saisons-c4709f2dad.pdf'], ['Ma lignée en lumière', 'genosociogramme.html#lumiere']].map(function (x) { return '<a class="pa-bt clair" href="' + x[1] + '"' + (/\.pdf$/.test(x[1]) ? ' download' : '') + '>' + x[0] + '</a>'; }).join('') + '</div></section>';
    afficher(h);
    var f = document.getElementById('pa-reperes'); if (f) f.addEventListener('submit', garderReperes);
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
      '<ol class="pa-pas">' + ETAPES.map(function (x, k) { var ok = k <= n; return '<li><button type="button" data-pas="' + k + '"' + (ok ? '' : ' disabled') + ' class="' + (k < n || r.spirale ? 'fait' : '') + (k === i ? ' ici' : '') + '"><i>' + (k < n || (r.spirale && k <= n) ? '✓' : k + 1) + '</i><span>' + esc(x.titre) + '</span></button></li>'; }).join('') + '</ol>' +
      '<div class="pa-etape-c"><h3 class="pa-h3">' + esc(E.titre) + '</h3><p class="pa-souffle">' + esc(E.souffle) + '</p>' + contenuEtape(r, E.id) + '</div>' +
      '<p class="pa-discret" data-sauve>' + (D.accord ? 'Gardé dans ton espace, chiffré. Genesolia ne le lit pas.' : 'Gardé sur cet appareil.') + '</p>' +
      '<p class="pa-actions">' + (i === n && !r.spirale ? boutonSuite(r, E.id) : i < n ? '<button type="button" class="pa-bt clair" data-pas="' + n + '">Revenir à l’étape en cours</button>' : '') + '<button type="button" class="pa-lien-s" data-suppr-fil>Supprimer ce ressenti</button></p>';
    var z = feuille(h);
    brancherEtape(z, r, i);
  }
  function boutonSuite(r, id) {
    if (id === 'liberer') return '<button type="button" class="pa-bt or" data-suite>J’ai libéré cette mémoire</button>';
    if (id === 'spirale') return '<button type="button" class="pa-bt or" data-suite>Mon fil devient spirale</button>';
    return '<button type="button" class="pa-bt" data-suite>Étape suivante</button>';
  }
  function zoneTexte(cle, label, val, ph) { return '<label for="pa-t-' + cle + '">' + esc(label) + '</label><textarea id="pa-t-' + cle + '" data-t="' + cle + '" maxlength="3000"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(val || '') + '</textarea>'; }
  function contenuEtape(r, id) {
    var h = '';
    if (id === 'voir') {
      h += '<div class="pa-resume">' + (r.corps && r.corps.length ? '<p><b>Dans ton corps :</b> ' + esc(r.corps.join(', ').toLowerCase()) + '</p>' : '') + (r.revient ? '<p><b>Ça revient :</b> ' + esc({ oui: 'oui, souvent', parfois: 'parfois', non: 'c’est la première fois' }[r.revient] || '') + (r.ages ? ' (' + esc(r.ages) + ')' : '') + '</p>' : '') + (r.phrase ? '<p><b>La phrase :</b> « ' + esc(r.phrase) + ' »</p>' : '') + (r.fil ? '<p class="pa-discret">Ajouté à ton fil d’or.</p>' : '') + '</div>';
      var ec = echosRessenti(r);
      h += ec.length ? '<div class="pa-bloc"><h4>Ce qui lui répond dans ta lignée</h4><ul class="pa-echos">' + ec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>'
        : '<p class="pa-discret">Plus ton fil d’or et ton arbre se remplissent, plus tu verras ici ce qui, dans ta lignée, répond à ce ressenti.</p>';
    } else if (id === 'aqui') {
      h += '<div class="pa-bloc"><h4>Écoute ton intuition</h4>' + (PF.INTUITION || []).map(function (q, k) { return zoneTexte('i' + k, q, (r.intuition || {})[k]); }).join('') + '</div>';
      h += '<div class="pa-bloc"><h4>Nomme la mémoire</h4><label for="pa-t-nom">Mémoire de…</label><input id="pa-t-nom" data-t="nom" maxlength="80" value="' + esc(r.nom || '') + '" placeholder="' + esc(nomSuggere(r)) + '">' +
        '<p class="pa-discret">Si tu ne vois pas encore d’où elle vient, nomme-la simplement : « la mémoire de peur », « la mémoire de honte ». C’est déjà la reconnaître.</p></div>';
      h += '<div class="pa-bloc"><h4>À qui ça appartient ?</h4>' + puces('aqui', [['moi', 'À moi, à ma vie'], ['lignee', 'À quelqu’un de ma lignée'], ['?', 'Je ne sais pas encore']], [r.aqui], false);
      var P = personnes();
      h += '<div id="pa-qui-z"' + (r.aqui === 'lignee' ? '' : ' hidden') + '><label for="pa-qui">À qui, à ton avis ?</label><select id="pa-qui"><option value="">Quelqu’un que je ne connais pas</option>' + P.map(function (p) { return '<option value="' + esc(p.k) + '"' + (r.qui === p.k ? ' selected' : '') + '>' + esc(p.prenom + ' · ' + p.lien.toLowerCase()) + '</option>'; }).join('') + '</select>' + (P.length ? '' : '<p class="pa-discret">Ajoute les tiens dans ton arbre ou ton fil d’or pour les retrouver ici.</p>') + '</div></div>';
      var sug = cycleSuggere(r), C = PF.CYCLES || {};
      h += '<div class="pa-bloc"><h4>Racine ou cœur ?</h4><div class="pa-cycles">' + ['racine', 'coeur'].map(function (c) { return '<div><b>' + esc(C[c].nom) + '</b><span>' + esc(C[c].texte) + '</span><span class="pa-discret">' + esc(C[c].signes.join(' · ')) + '</span></div>'; }).join('') + '</div>' +
        puces('cycle', [['racine', 'La racine'], ['coeur', 'Le cœur'], ['deux', 'Les deux']], [r.cycle || ''], false) + (sug && !r.cycle ? '<p class="pa-discret">Ce que tu as déposé fait penser à ' + (sug === 'deux' ? 'la racine et au cœur' : sug === 'racine' ? 'la racine' : 'le cœur') + '. C’est une piste : c’est toi qui sens.</p>' : '') + '</div>';
    } else if (id === 'enqueter') {
      var cyc = r.cycle === 'racine' || r.cycle === 'coeur' ? [r.cycle] : ['racine', 'coeur'], Q = [], vus = r.enquete && r.enquete.q || {};
      cyc.forEach(function (c) { Q = Q.concat(((PF.QUESTIONS || {})[c] || []).slice(0, cyc.length > 1 ? 3 : 5)); });
      (r.bl || []).forEach(function (b) { if ((PF.BLESSURE_Q || {})[b]) Q.push(PF.BLESSURE_Q[b]); });
      var qui = r.qui ? personne(r.qui) : null;
      h += '<div class="pa-bloc"><h4>Les questions à poser' + (qui ? ' autour de ' + esc(qui.prenom) : '') + '</h4><p class="pa-discret">À ceux qui sont encore là, ou à toi-même. Coche celles que tu as posées.</p><ul class="pa-coches">' + Q.map(function (q, k) { return '<li><label><input type="checkbox" data-q="' + k + '"' + (vus[k] ? ' checked' : '') + '> ' + esc(q) + '</label></li>'; }).join('') + '</ul></div>';
      var OU = []; cyc.forEach(function (c) { OU = OU.concat(((PF.OU || {})[c] || []).slice(0, cyc.length > 1 ? 2 : 4)); }); OU = OU.concat((PF.OU || {}).tous || []);
      h += '<div class="pa-bloc"><h4>Où chercher</h4><ul class="pa-ou">' + OU.map(function (o) { return '<li><b>' + esc(o[0]) + '</b><span>' + esc(o[1]) + '</span></li>'; }).join('') + '</ul></div>';
      var ids = (PF.PISTES || {})[cyc[0]] || [], pid = ids[(r.date || '').length ? (+r.date.slice(-2)) % ids.length : 0], pi = null;
      PISTES.forEach(function (p) { if (p.id === pid) pi = p; });
      if (pi) h += '<div class="pa-bloc pa-geste"><h4>Une piste pour cette semaine · ' + esc(pi.titre) + '</h4><ul>' + pi.enquete.slice(0, 2).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><p style="margin:.6rem 0 0">' + esc(pi.geste) + '</p>' + (pi.outils && pi.outils.length ? '<div class="pa-outils">' + pi.outils.filter(function (o) { return o[1].charAt(0) !== '#'; }).map(function (o) { return '<a class="pa-bt nuit" href="' + esc(o[1]) + '">' + esc(o[0]) + '</a>'; }).join('') + '</div>' : '') + '</div>';
      h += '<div class="pa-bloc">' + zoneTexte('trouve', 'Ce que j’ai trouvé, entendu ou senti', (r.enquete || {}).trouve, 'Une date, une phrase, un papier, un rêve…') + '</div>';
      h += livre(pi ? pi.livre : 'Le livre te donne une page pour chaque personne de ta lignée, à remplir à la main et à transmettre.');
    } else if (id === 'liberer') {
      var Lb = PF.LIBERER || {}, prof = r.profond != null ? r.profond : dejaLibere(r);
      h += '<label class="pa-coche"><input type="checkbox" id="pa-profond"' + (prof ? ' checked' : '') + '> Ce thème était déjà venu et je l’avais travaillé : c’est une couche plus profonde</label>' + (prof ? '<p class="pa-discret">Ce n’est pas un retour en arrière : tu creuses le même trou, plus profond. La couche du dessous ne pouvait se montrer qu’une fois celle du dessus libérée.</p>' : '');
      h += '<div class="pa-lib"><div class="pa-lib-e"><span>1</span><div><h4>Respirer</h4><p>' + esc(Lb.respirer) + '</p><div class="pa-resp" aria-live="polite"><i></i><button type="button" class="pa-bt clair" data-respirer>Respirer avec moi</button></div></div></div>';
      h += '<div class="pa-lib-e"><span>2</span><div><h4>Nommer</h4>' + (prof ? (Lb.couches || []).map(function (q, k) { return zoneTexte('c' + k, q, r['c' + k]); }).join('') : '') +
        '<label for="pa-t-nom2">Le nom de la mémoire</label><input id="pa-t-nom2" data-t="nom" maxlength="80" value="' + esc(r.nom || '') + '" placeholder="' + esc(nomSuggere(r)) + '">' +
        '<label for="pa-t-source">Mémoire de qui, ou de quoi ?</label><input id="pa-t-source" data-t="source" maxlength="120" value="' + esc(r.source || sourceSuggeree(r)) + '" placeholder="ma grand-mère qui a tout perdu, mon père qui partait…"></div></div>';
      h += '<div class="pa-lib-e"><span>3</span><div><h4>Reconnaître</h4><p class="pa-discret">Dis-la à voix haute si tu peux, sinon intérieurement. Ton corps va vouloir réagir comme d’habitude : continue de respirer, écoute ton cœur.</p><blockquote class="pa-phrase" id="pa-phrase-lib">' + esc(phraseLib(r, prof)) + '</blockquote></div></div>';
      h += '<div class="pa-lib-e"><span>4</span><div><h4>Transmuter</h4><ol>' + (Lb.transmuter || []).concat(prof ? Lb.profond || [] : []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol><p class="pa-discret">Tu peux répéter doucement : ' + (Lb.mantras || []).map(function (m) { return '« ' + esc(m) + ' »'; }).join(' ') + '</p></div></div>';
      h += '<div class="pa-lib-e"><span>5</span><div><h4>Réorienter</h4>' + (Lb.reorienter || []).map(function (q, k) { return zoneTexte('o' + k, q, r['o' + k]); }).join('') +
        '<div class="pa-deux-c"><div>' + zoneTexte('ancienne', 'Mon ancienne réaction', r.ancienne, 'Je me justifie, je fuis…') + '</div><div>' + zoneTexte('nouvelle', 'Ma nouvelle réponse', r.nouvelle, '« Merci, je vais y réfléchir. »') + '</div></div>' +
        '<label for="pa-t-verite">Ma nouvelle vérité</label><input id="pa-t-verite" data-t="verite" maxlength="160" value="' + esc(r.verite || '') + '" placeholder="Je suis en sécurité. Je peux m’attacher en toute confiance.">' +
        '<p class="pa-discret" id="pa-affirm">' + esc((Lb.affirmation || '').replace('{verite}', r.verite || '…')) + '</p></div></div></div>';
      var gs = (Lb.gestes || []).map(function (g) { return g[0] + ' : ' + g[1]; });
      h += '<div class="pa-bloc pa-geste"><h4>Ton geste dans les 48 heures</h4><p style="margin:0 0 .5rem">Ton corps et ta lignée ont toujours réagi de la même façon. Un petit acte concret, dans le sens de ta nouvelle vérité, crée une nouvelle empreinte.</p><p class="pa-discret" style="color:#F3DCC0">' + esc(gs.join(' · ')) + '</p>' +
        '<label for="pa-t-geste" style="color:#fff">Mon geste</label><input id="pa-t-geste" data-t="geste" maxlength="140" value="' + esc(r.geste || '') + '">' +
        '<label for="pa-t-gdate" style="color:#fff">Le jour</label><input id="pa-t-gdate" type="date" data-t="gesteDate" value="' + esc(r.gesteDate || iso(new Date(Date.now() + 864e5))) + '"><p class="pa-discret" style="color:#F3DCC0">Il apparaît dans ton agenda.</p></div>';
      h += '<p class="pa-discret">Ces clés viennent du livre « Ressens · Guéris · Vis ». Chaque fois que tu fais ce chemin, la mémoire s’affaiblit : rien ne change du jour au lendemain, et c’est normal.</p>';
    } else if (id === 'spirale') {
      var op = (PF.OPPOSES || {})[(r.em || [])[0]] || '';
      h += '<div class="pa-bloc"><h4>Ce que je choisis à la place</h4><label for="pa-t-choix">L’opposé de ma mémoire</label><input id="pa-t-choix" data-t="choix" maxlength="120" value="' + esc(r.choix || '') + '" placeholder="' + esc(op || 'La sécurité, l’abondance, une vie entourée…') + '">' +
        '<p class="pa-discret">Sois précise : plus c’est concret, plus ta tête peut suivre la nouvelle direction. Si une autre mémoire se réveille en l’écrivant, c’est normal : tu pourras la déposer aussi.</p>' +
        (PF.ENVIES || []).map(function (q, k) { return '<label for="pa-t-e' + k + '">' + esc(q) + '</label><input id="pa-t-e' + k + '" data-t="e' + k + '" maxlength="120" value="' + esc(r['e' + k] || '') + '">'; }).join('') + '</div>';
      h += '<div class="pa-bloc"><h4>Quand le thème revient</h4>' + (PF.SPIRALE || []).map(function (q, k) { return zoneTexte('s' + k, q, (r.sp || {})[k]); }).join('') + '</div>';
      if (r.libere) h += '<p class="pa-discret">Mémoire libérée le ' + esc(dateCourte(r.libere)) + '. Elle apparaît dans ton agenda et ton bilan.</p>';
    }
    return h;
  }
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
  function livre(t) { return '<a class="pa-livre" href="enquete-de-ma-lignee.html"><img src="assets/livres/enquete-de-ma-lignee-3d.webp" alt="" width="64" height="106" loading="lazy"><span><b>Pour aller plus loin, dans le livre</b><span>' + esc(t) + '</span></span></a>'; }
  function brancherEtape(z, r, i) {
    var E = ETAPES[i];
    z.addEventListener('input', function (e) {
      var t = e.target.closest('[data-t]'); if (!t) return;
      var k = t.getAttribute('data-t'), v = t.value;
      if (/^i\d$/.test(k)) { r.intuition = r.intuition || {}; r.intuition[k.slice(1)] = v; }
      else if (/^s\d$/.test(k)) { r.sp = r.sp || {}; r.sp[k.slice(1)] = v; }
      else if (k === 'trouve') { r.enquete = r.enquete || { q: {} }; r.enquete.trouve = v; }
      else r[k] = v;
      var ph = z.querySelector('#pa-phrase-lib'); if (ph && (k === 'nom' || k === 'source')) ph.textContent = phraseLib(r, r.profond != null ? r.profond : dejaLibere(r));
      var af = z.querySelector('#pa-affirm'); if (af && k === 'verite') af.textContent = ((PF.LIBERER || {}).affirmation || '').replace('{verite}', v || '…');
      sauver();
    });
    z.addEventListener('change', function (e) {
      var q = e.target.closest('[data-q]'); if (q) { r.enquete = r.enquete || { q: {} }; r.enquete.q = r.enquete.q || {}; if (q.checked) r.enquete.q[q.getAttribute('data-q')] = iso(new Date()); else delete r.enquete.q[q.getAttribute('data-q')]; sauver(); return; }
      if (e.target.id === 'pa-qui') { r.qui = e.target.value; sauver(); return; }
      if (e.target.id === 'pa-profond') { r.profond = e.target.checked; sauver(); ouvrirFil(r.id, i); return; }
      var g = e.target.closest('[data-groupe]'); if (!g) return;
      var nom = g.getAttribute('data-groupe'), v = lirePuces(z, nom)[0] || '';
      if (nom === 'aqui') { r.aqui = v; var qz = z.querySelector('#pa-qui-z'); if (qz) qz.hidden = v !== 'lignee'; }
      if (nom === 'cycle') r.cycle = v;
      sauver();
    });
    z.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pas]'); if (p && !p.disabled) { ouvrirFil(r.id, +p.getAttribute('data-pas')); return; }
      if (e.target.closest('[data-respirer]')) { respirer(e.target.closest('.pa-resp')); return; }
      if (e.target.closest('[data-suite]')) {
        var auj = iso(new Date());
        if (E.id === 'liberer') r.libere = auj;
        if (E.id === 'spirale') { r.spirale = auj; sauver(); fermerFeuille(); return; }
        r.etape = Math.max(r.etape || 0, i + 1); sauver(); ouvrirFil(r.id); return;
      }
      if (e.target.closest('[data-suppr-fil]') && confirm('Supprimer ce ressenti et tout ce que tu as écrit dessus ?')) {
        D.etat.ressentis = D.etat.ressentis.filter(function (x) { return x.id !== r.id; }); sauver(); fermerFeuille();
      }
    });
  }

  /* ── 2. Mon fil d'or ── */
  function vueFil() {
    var h = '<h1 class="pa-h1">Mon fil d’or</h1><p class="pa-sous">Ta base, et chaque ressenti que tu tires, jusqu’à ce que la boucle devienne spirale.</p><div class="pa-2col"><div>';
    var F = (D.fil && D.fil.personnes) || {}, ids = filPersonnes();
    h += '<section class="pa-carte"><p class="pa-etiq">Ta base · ton fil d’or</p>';
    if (nbMoments()) {
      var em = {}; ids.forEach(function (id) { (F[id].etapes || []).forEach(function (e) { (e.em || []).forEach(function (x) { (em[x] = em[x] || []).indexOf(id) < 0 && em[x].push(id); }); }); });
      var top = Object.keys(em).sort(function (a, b) { return em[b].length - em[a].length; }).filter(function (x) { return em[x].length > 1; }).slice(0, 4);
      h += '<ul class="pa-liste">' + ids.slice(0, 8).map(function (id) { var et = (F[id].etapes || []).filter(plein); return '<li><span class="pa-pastille' + (id === 'toi' ? ' l' : '') + '">' + et.length + '</span><span><b>' + esc(nomFil(id)) + '</b><br><small>' + esc(et.slice(0, 3).map(function (e) { return (e.age ? e.age + ' ans' : '') + (e.evt ? (e.age ? ' : ' : '') + e.evt : ''); }).join(' · ')) + '</small></span></li>'; }).join('') + '</ul>';
      if (top.length) h += '<p class="pa-discret" style="margin-top:.6rem"><b>Les émotions qui voyagent :</b> ' + top.map(function (x) { return esc(x.toLowerCase()) + ' (' + em[x].map(function (id) { return esc(id === 'toi' ? 'toi' : (F[id].prenom || nomFil(id))); }).join(', ') + ')'; }).join(' · ') + '</p>';
    } else h += '<p>Ton fil d’or est encore vide. Note quelques moments de ta vie, l’âge que tu avais et ce que tu as ressenti, puis ceux des tiens.</p>';
    h += '<div class="pa-outils"><a class="pa-bt clair" href="fil-d-or.html">Ouvrir mon fil d’or</a></div></section>';
    var R = reps();
    h += '<section class="pa-carte"><p class="pa-etiq">Ta base · ce qui se répète dans ton arbre</p>';
    if (R.length) h += R.slice(0, 8).map(function (x) { return '<details class="pa-rep"><summary>' + esc(x.label) + '</summary><p>' + esc(x.desc) + '</p></details>'; }).join('') + (R.length > 8 ? '<p class="pa-discret">Et ' + (R.length - 8) + ' autres pistes dans ton arbre.</p>' : '');
    else if (nbArbre()) h += '<p>Ouvre ton arbre une fois : ce qui se répète s’affichera ici, et dans ton agenda.</p>';
    else h += '<p>Avec ton arbre, les répétitions (âges, dates, prénoms, métiers) se repèrent toutes seules et rejoignent ton agenda.</p>';
    h += '<div class="pa-outils"><a class="pa-bt clair" href="genosociogramme.html">Ouvrir mon arbre</a></div></section>';
    h += '</div><div>';
    var enCours = D.etat.ressentis.filter(function (r) { return !r.spirale; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }), finis = D.etat.ressentis.filter(function (r) { return r.spirale; });
    h += '<section class="pa-carte pa-depot"><p class="pa-etiq">Tirer un nouveau fil</p><p>Chaque ressenti suit le même chemin : <b>' + ETAPES.map(function (E) { return esc(E.titre); }).join('</b>, <b>') + '</b>.</p><button type="button" class="pa-bt or" data-depot>Je dépose un ressenti</button></section>';
    h += enCours.length ? '<p class="pa-titre-s">Mes fils en cours</p>' + enCours.map(carteFil).join('') : '';
    h += finis.length ? '<p class="pa-titre-s">Devenus spirale</p>' + finis.map(carteFil).join('') : '';
    h += livre('Pour écrire ton enquête à la main, la remplir en famille et la transmettre : 166 pages, 18 thèmes expliqués.');
    if (D.user && !D.accord && !EXEMPLE) h += '<div id="pa-coffre"></div>';
    h += '</div></div>';
    afficher(h);
    var z = document.getElementById('pa-coffre');
    if (z && window.GenesoliaCoffre) window.GenesoliaCoffre.demander(z, sb, function () { D.accord = true; sauver(); });
  }

  /* ── 3. Mon agenda ── */
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
    var P = (D.arbre && D.arbre.people) || {}, b = naissance(), moi = moiDeLArbre(); if (!b) return [];
    var age = annee - b.a, l = [];
    Object.keys(P).forEach(function (k) {
      if (moi && k === moi.id) return; var p = P[k];
      (p.events || []).forEach(function (e) { if (+e.age === age && EVT[e.type]) l.push(prenom1(p) + ' a vécu ' + EVT[e.type] + ' à ' + age + ' ans' + (e.year ? ' (' + e.year + ')' : '') + '.'); });
      var dd = dateComplete(p.deces), nn = dateComplete(p.naiss); if (dd && nn && dd.a - nn.a === age) l.push(prenom1(p) + ' est parti' + (p.sex === 'f' ? 'e' : '') + ' à ' + age + ' ans.');
    });
    var F = (D.fil && D.fil.personnes) || {};
    Object.keys(F).forEach(function (k) { if (k === 'toi') return; (F[k].etapes || []).forEach(function (e) { if (ageNum(e.age) === age && e.evt) l.push(nomFil(k) + ' : « ' + e.evt + ' », à ' + age + ' ans.'); }); });
    return l.filter(function (v, i, x) { return x.indexOf(v) === i; });
  }
  function evenements(a, m) {
    var E = {}, L = lunesDuMois(a, m);
    function add(j, e) { (E[j] = E[j] || []).push(e); }
    datesLignee(a, m).forEach(function (x) { add(x.j, { type: x.type, cle: x.cle, texte: x.texte + (x.ans > 0 ? ' · il y a ' + x.ans + ' ans' : '') }); });
    reps().forEach(function (x) { var p = String(x.jm || '').split('/'); if (p.length === 2 && +p[1] === m + 1) add(+p[0], { type: 'r', cle: 'rep-' + x.jm, texte: x.label, sous: x.desc }); });
    Object.keys(L).forEach(function (k) { add(+k.slice(8, 10), { type: 'm', cle: 'lune-' + k, texte: L[k] }); });
    D.etat.ressentis.forEach(function (r) {
      var d = dateComplete(r.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'e', cle: 'res-' + r.id, texte: 'Ressenti : ' + (r.em && r.em.length ? r.em.join(', ').toLowerCase() : String(r.quoi || '').slice(0, 60)), fil: r.id });
      var l = dateComplete(r.libere); if (l && l.a === a && l.m === m + 1) add(l.j, { type: 'lib', cle: 'lib-' + r.id, texte: 'Mémoire libérée' + (r.qui && personne(r.qui) ? ' · rendue à ' + personne(r.qui).prenom : ''), fil: r.id });
      var s = dateComplete(r.spirale); if (s && s.a === a && s.m === m + 1) add(s.j, { type: 'lib', cle: 'spi-' + r.id, texte: 'Un fil devenu spirale', fil: r.id });
      var g = dateComplete(r.gesteDate); if (g && r.geste && g.a === a && g.m === m + 1) add(g.j, { type: 'g', cle: 'geste-' + r.id, texte: 'Mon geste : ' + r.geste, fil: r.id });
      /* un an après une libération : une date à fêter */
      if (l && l.a < a && l.m === m + 1) add(l.j, { type: 'lib', cle: 'anlib-' + r.id, texte: 'Il y a ' + (a - l.a) + ' an' + (a - l.a > 1 ? 's' : '') + ', tu libérais une mémoire', fil: r.id });
    });
    var notes = D.etat.notes || {};
    Object.keys(notes).forEach(function (k) { if (+k.slice(0, 4) === a && +k.slice(5, 7) === m + 1) (notes[k] || []).forEach(function (t, n) { add(+k.slice(8, 10), { type: 'n', cle: 'note-' + k + '-' + n, texte: t, note: true }); }); });
    return E;
  }
  /* Les périodes qui reviennent : ce que ce mois-là porte dans ta lignée, d'une année sur l'autre */
  function periodeMois(a, m) {
    var P = (D.arbre && D.arbre.people) || {}, dep = [], l = [];
    Object.keys(P).forEach(function (k) { var d = dateComplete(P[k].deces); if (d && d.m === m + 1) dep.push(prenom1(P[k]) + ' (' + d.a + ')'); });
    if (dep.length >= 2) l.push(dep.length + ' départs en ' + MOIS[m] + ' dans ta lignée : ' + liste(dep) + '.');
    var avant = D.etat.ressentis.filter(function (r) { var d = dateComplete(r.date); return d && d.m === m + 1 && d.a < a; });
    if (avant.length) l.push('Tu avais déposé ' + avant.length + ' ressenti' + (avant.length > 1 ? 's' : '') + ' en ' + MOIS[m] + ' les années passées : ' + liste(avant.map(function (r) { return (r.em || [])[0] ? r.em[0].toLowerCase() : 'un ressenti'; }).filter(function (v, i, x) { return x.indexOf(v) === i; })) + '.');
    var rp = reps().filter(function (x) { var p = String(x.jm || '').split('/'); return p.length === 2 && +p[1] === m + 1; });
    rp.forEach(function (x) { l.push(x.label + '.'); });
    return l;
  }
  var vueMoisD = null, jourChoisi = null;
  function vueAgenda() {
    var auj = new Date(); if (!vueMoisD) vueMoisD = new Date(auj.getFullYear(), auj.getMonth(), 1);
    var a = vueMoisD.getFullYear(), m = vueMoisD.getMonth(), E = evenements(a, m), dec = (new Date(a, m, 1).getDay() + 6) % 7, nb = new Date(a, m + 1, 0).getDate();
    if (!jourChoisi || jourChoisi.getMonth() !== m || jourChoisi.getFullYear() !== a) jourChoisi = auj.getMonth() === m && auj.getFullYear() === a ? auj : new Date(a, m, 1);
    var h = '<h1 class="pa-h1">Mon agenda</h1><p class="pa-sous">Les dates de ta lignée et ce qui revient, tes ressentis et tes libérations, les lunes et tes jours personnels.</p><div class="pa-2col pa-ag"><div>' +
      '<div class="pa-mois-tete"><button type="button" data-mois="-1" aria-label="Mois précédent">‹</button><h2>' + MOIS[m] + ' ' + a + '</h2><button type="button" data-mois="1" aria-label="Mois suivant">›</button></div>' +
      '<div class="pa-grille">' + JS.map(function (j) { return '<span class="js">' + j + '</span>'; }).join('');
    for (var k = 0; k < dec; k++) h += '<span class="pa-jour vide"></span>';
    for (var j = 1; j <= nb; j++) {
      var dt = new Date(a, m, j), ev = E[j] || [], jp = jourPerso(dt), cl = (iso(dt) === iso(auj) ? ' auj' : '') + (iso(dt) === iso(jourChoisi) ? ' choisi' : '');
      h += '<button type="button" class="pa-jour' + cl + '" data-jour="' + j + '"><span class="n">' + j + '</span>' + (jp ? '<span class="jp">' + jp + '</span>' : '') + '<span class="pts">' + ev.slice(0, 5).map(function (e) { return '<i class="' + e.type + '"></i>'; }).join('') + '</span></button>';
    }
    h += '</div><p class="pa-legende"><span><i class="l"></i>naissance</span><span><i class="f"></i>départ</span><span><i class="r"></i>date qui revient</span><span><i class="e"></i>ressenti</span><span><i class="lib"></i>libération</span><span><i class="g"></i>mon geste</span><span><i class="m"></i>lune</span><span><i class="n"></i>note</span><span><b class="jpl">5</b> jour personnel</span></p>';
    var pm = periodeMois(a, m), ea = a === auj.getFullYear() ? echosAge(a) : [];
    if (pm.length) h += '<section class="pa-carte"><p class="pa-etiq">Ce qui revient en ' + MOIS[m] + '</p><ul class="pa-echos">' + pm.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>';
    if (ea.length) h += '<section class="pa-carte"><p class="pa-etiq">Échos d’âge, cette année</p><ul class="pa-echos">' + ea.slice(0, 5).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><p class="pa-discret">Une piste, pas une prédiction : un âge qui se répond invite à poser une question.</p></section>';
    h += '</div><div><section class="pa-carte" id="pa-jour-detail"></section>';
    var nR = Object.keys(D.etat.rappels || {}).length;
    h += '<section class="pa-carte"><p class="pa-etiq">Mes rappels</p><p>' + (nR ? nR + ' rappel' + (nR > 1 ? 's choisis' : ' choisi') + '. ' : 'Touche la cloche d’une date pour la choisir. ') + 'Ajoute-les au calendrier de ton téléphone : chaque date de ta lignée revient tous les ans, la veille au soir et le jour même.</p>' +
      '<button type="button" class="pa-bt' + (nR ? '' : ' clair') + '" data-ics' + (nR ? '' : ' disabled') + '>Ajouter mes rappels à mon calendrier</button></section>';
    if (!baseOk()) h += '<section class="pa-carte"><p class="pa-etiq">Pour un agenda plus riche</p><p>Ton arbre (avec les dates complètes) et ton fil d’or nourrissent ton agenda.</p><div class="pa-outils"><a class="pa-bt clair" href="genosociogramme.html">Mon arbre</a><a class="pa-bt clair" href="fil-d-or.html">Mon fil d’or</a></div></section>';
    h += '</div></div>';
    afficher(h); detailJour();
  }
  var CLOCHE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  function detailJour() {
    var z = document.getElementById('pa-jour-detail'); if (!z) return;
    var dt = jourChoisi, ev = evenements(dt.getFullYear(), dt.getMonth())[dt.getDate()] || [], jp = jourPerso(dt), k = iso(dt);
    var h = '<p class="pa-etiq">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>';
    if (jp) h += '<p><b class="jpl">' + jp + '</b> · ' + esc((N.JOURNEES || {})[jp] || '') + '</p>';
    h += ev.length ? ev.map(function (e) {
      var on = !!(D.etat.rappels || {})[e.cle], btn;
      if (e.note) btn = '<button type="button" class="pa-cloche" data-suppr="' + esc(e.cle) + '" aria-label="Supprimer cette note">×</button>';
      else if (e.fil) btn = '<button type="button" class="pa-cloche" data-fil="' + esc(e.fil) + '" aria-label="Ouvrir ce fil">›</button>';
      else btn = '<button type="button" class="pa-cloche" data-rappel="' + esc(e.cle) + '" data-texte="' + esc(e.texte) + '" data-date="' + k + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Retirer le rappel' : 'Me le rappeler') + '">' + CLOCHE + '</button>';
      return '<div class="pa-evt"><p><i class="pa-pt ' + e.type + '"></i>' + esc(e.texte) + (e.sous ? '<small>' + esc(e.sous) + '</small>' : '') + (e.note ? '<small>Ta note</small>' : '') + '</p>' + btn + '</div>';
    }).join('') : '<p class="pa-discret">Rien de particulier dans ta lignée ce jour-là.</p>';
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
        '<text x="' + o.x.toFixed(1) + '" y="' + (o.y + r + 15).toFixed(1) + '" text-anchor="middle" class="pa-sv-nom">' + esc(o.p.prenom.slice(0, 13)) + '</text>' +
        '<text x="' + o.x.toFixed(1) + '" y="' + (o.y + r + 28).toFixed(1) + '" text-anchor="middle" class="pa-sv-lien">' + esc(o.p.lien.replace(/^(Ton|Ta|Une|Un) /, '')) + '</text></g>';
    });
    return s + '</svg>';
  }
  function vueBilan() {
    var Rs = D.etat.ressentis, L = D.etat.liens || {}, P = personnes();
    var h = '<h1 class="pa-h1">Mon bilan</h1><p class="pa-sous">Ta lignée telle que tu la sens aujourd’hui. Touche une sphère pour poser le lien que tu ressens.</p><div class="pa-2col pa-bil"><div>';
    if (P.length) {
      h += '<section class="pa-carte pa-nuit pa-ciel-l">' + dessinLignee() + '<p class="pa-leg-l"><span><i class="paix"></i>Lien de paix · cercle de lumière</span><span><i class="mit"></i>Lien mitigé · même avec de l’amour</span><span><i class="vide"></i>Pas encore regardé</span></p></section>';
    } else h += '<section class="pa-carte"><p class="pa-etiq">Ta lignée en sphères</p><p>Ajoute les tiens dans ton arbre ou ton fil d’or : ils apparaîtront ici, chacun dans sa sphère, reliés à toi.</p><div class="pa-outils"><a class="pa-bt clair" href="genosociogramme.html">Mon arbre</a><a class="pa-bt clair" href="fil-d-or.html">Mon fil d’or</a></div></section>';
    h += '</div><div>';
    var lib = Rs.filter(function (r) { return r.libere; }), spi = Rs.filter(function (r) { return r.spirale; });
    h += '<section class="pa-carte"><p class="pa-etiq">Ton chemin</p><p class="pa-stats"><span><b>' + Rs.length + '</b>ressenti' + (Rs.length > 1 ? 's' : '') + ' déposé' + (Rs.length > 1 ? 's' : '') + '</span><span><b>' + lib.length + '</b>mémoire' + (lib.length > 1 ? 's' : '') + ' libérée' + (lib.length > 1 ? 's' : '') + '</span><span><b>' + spi.length + '</b>devenu' + (spi.length > 1 ? 's' : '') + ' spirale</span></p>';
    if (Rs.length) {
      var prem = Rs.map(function (r) { return r.date; }).sort()[0], d0 = dateComplete(prem), now = new Date(), mois = d0 ? (now.getFullYear() - d0.a) * 12 + now.getMonth() + 1 - d0.m : 0, ph = null;
      (PF.PHASES || []).some(function (x) { if (mois < x[0]) { ph = x; return true; } return false; });
      if (ph) h += '<p class="pa-lab">Où tu en es · ' + esc(ph[1]) + '</p><p class="pa-discret" style="margin-top:0">' + esc(ph[2]) + '</p>';
    }
    var ra = Rs.filter(function (r) { return r.cycle === 'racine' || r.cycle === 'deux'; }).length, co = Rs.filter(function (r) { return r.cycle === 'coeur' || r.cycle === 'deux'; }).length;
    if (ra + co) h += '<p class="pa-lab">Racine ou cœur</p><div class="pa-barres"><span style="flex:' + (ra || .001) + '" class="ra">La racine · ' + ra + '</span><span style="flex:' + (co || .001) + '" class="co">Le cœur · ' + co + '</span></div>';
    var em = {}; Rs.forEach(function (r) { (r.em || []).forEach(function (x) { em[x] = (em[x] || 0) + 1; }); });
    var tE = Object.keys(em).sort(function (a, b) { return em[b] - em[a]; }).slice(0, 4);
    if (tE.length) h += '<p class="pa-discret"><b>Ce qui revient le plus :</b> ' + tE.map(function (x) { return esc(x.toLowerCase()) + ' (' + em[x] + ')'; }).join(', ') + '</p>';
    h += '</section>';
    var paix = P.filter(function (p) { return (L[p.k] || {}).t === 'paix'; }), mit = P.filter(function (p) { return (L[p.k] || {}).t === 'mitige'; });
    if (paix.length || mit.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes liens</p>' + (paix.length ? '<p><b class="pa-or">En paix :</b> ' + esc(liste(paix.map(function (p) { return p.prenom; }))) + '</p>' : '') + (mit.length ? '<p><b class="pa-orange">Mitigés :</b> ' + esc(liste(mit.map(function (p) { return p.prenom; }))) + '</p>' : '') + '</section>';
    var peurs = {}; P.forEach(function (p) { ((L[p.k] || {}).peurs || []).forEach(function (x) { (peurs[x] = peurs[x] || []).push(p.prenom); }); });
    if (Object.keys(peurs).length) h += '<section class="pa-carte"><p class="pa-etiq">Les peurs que tu partages</p><ul class="pa-echos">' + Object.keys(peurs).map(function (x) { return '<li><b>' + esc(x) + '</b> · avec ' + esc(liste(peurs[x])) + '</li>'; }).join('') + '</ul></section>';
    var loy = P.filter(function (p) { return (L[p.k] || {}).loyaute; });
    if (loy.length) h += '<section class="pa-carte"><p class="pa-etiq">Les loyautés que tu sens</p><p>' + esc(liste(loy.map(function (p) { return p.prenom; }))) + '</p><p class="pa-discret">Une loyauté n’est pas un manque d’amour : c’est souvent beaucoup d’amour, qui garde la même peur pour rester proche.</p></section>';
    if (lib.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes libérations</p><ul class="pa-liste">' + lib.map(function (r) { var q = r.qui ? personne(r.qui) : null; return '<li><span class="pa-pastille or">✦</span><span><b>' + esc(dateCourte(r.libere)) + '</b><br><small>' + esc((q ? 'Rendu à ' + q.prenom + ' · ' : '') + String(r.quoi || '').slice(0, 90)) + '</small></span></li>'; }).join('') + '</ul></section>';
    var nr = reps().length; if (nr) h += '<a class="pa-carte" href="#fil"><p class="pa-etiq">Ce qui se répète</p><p>' + nr + ' piste' + (nr > 1 ? 's' : '') + ' repérée' + (nr > 1 ? 's' : '') + ' dans ton arbre.</p><span class="pa-plus">Voir ma base</span></a>';
    h += '<p class="pa-outils"><button type="button" class="pa-bt clair" data-imprimer>Imprimer mon bilan</button><a class="pa-bt clair" href="genosociogramme.html#lumiere">Ma lignée en lumière (poster)</a></p>';
    h += '</div></div>';
    afficher(h);
  }
  function ouvrirPersonne(k) {
    var p = personne(k); if (!p) return;
    var L = D.etat.liens[k] = D.etat.liens[k] || {}, lies = D.etat.ressentis.filter(function (r) { return r.qui === k; });
    var h = '<p class="pa-etiq">' + esc(p.lien) + (p.anneeN ? ' · ' + (p.f ? 'née' : 'né') + ' en ' + p.anneeN.a : '') + (p.parti && p.anneeD ? ' · ' + (p.f ? 'partie' : 'parti') + ' en ' + p.anneeD.a : '') + '</p><h2>' + esc(p.prenom) + '</h2>' +
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
    var f = e.target.closest('[data-fil]'); if (f) { ouvrirFil(f.getAttribute('data-fil')); return; }
    var pe = e.target.closest('[data-personne]'); if (pe) { ouvrirPersonne(pe.getAttribute('data-personne')); return; }
    if (e.target.closest('[data-imprimer]')) { window.print(); return; }
    var m = e.target.closest('[data-mois]'); if (m) { vueMoisD = new Date(vueMoisD.getFullYear(), vueMoisD.getMonth() + +m.getAttribute('data-mois'), 1); jourChoisi = null; vueAgenda(); return; }
    var j = e.target.closest('[data-jour]'); if (j) { jourChoisi = new Date(vueMoisD.getFullYear(), vueMoisD.getMonth(), +j.getAttribute('data-jour')); document.querySelectorAll('.pa-jour.choisi').forEach(function (x) { x.classList.remove('choisi'); }); j.classList.add('choisi'); detailJour(); if (window.innerWidth < 1000) { var d = document.getElementById('pa-jour-detail'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
    var r = e.target.closest('[data-rappel]');
    if (r) { var c = r.getAttribute('data-rappel'), R = D.etat.rappels = D.etat.rappels || {}; if (R[c]) delete R[c]; else R[c] = { texte: r.getAttribute('data-texte'), date: r.getAttribute('data-date') }; sauver(); vueAgendaSansHaut(); return; }
    var s = e.target.closest('[data-suppr]');
    if (s) { var p = s.getAttribute('data-suppr').split('-'), dk = p.slice(1, 4).join('-'), n = +p[4], N2 = D.etat.notes[dk] || []; N2.splice(n, 1); if (!N2.length) delete D.etat.notes[dk]; sauver(); vueAgendaSansHaut(); return; }
    if (e.target.closest('[data-note]')) { var t = document.getElementById('pa-note-t'), v = t && t.value.trim(); if (!v) return; var k = iso(jourChoisi); (D.etat.notes[k] = D.etat.notes[k] || []).push(v.slice(0, 140)); sauver(); vueAgendaSansHaut(); return; }
    if (e.target.closest('[data-ics]')) { telechargerIcs(); }
  });
  vue.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-personne]')) { e.preventDefault(); ouvrirPersonne(e.target.closest('[data-personne]').getAttribute('data-personne')); } });

  charger().then(function () { if (!D.etat) D.etat = completer(lireL(CLE)); router(); }, function () { D.etat = completer(null); router(); });
})();
