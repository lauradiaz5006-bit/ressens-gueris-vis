/* Genesolia : génosociogramme en ligne.
   Les personnes et les liens sont stockés tels quels ; le placement est recalculé à chaque dessin
   (générations en lignes, couples côte à côte, enfants sous leurs parents, symboles standards). */
(function () {
  'use strict';

  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co';
  var SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  /* Plusieurs arbres : ?arbre=<id> ouvre un arbre supplémentaire (table arbres_supp) ; sans paramètre, l'arbre principal (table arbres) */
  var ARBRE_ID = (function () { try { var a = new URLSearchParams(location.search).get('arbre'); return a && /^[0-9a-f-]{32,36}$/i.test(a) ? a.toLowerCase() : null; } catch (e) { return null; } })();
  var CLE_LOCALE = ARBRE_ID ? 'geno4-' + ARBRE_ID : 'geno4';   // un arbre supplémentaire n'écrase jamais « geno4 »
  var arbreNom = '', arbreBloque = false;   // arbreBloque : arbre supplémentaire introuvable ou non chargé, rien n'est enregistré

  var SLOT = 150;     // largeur réservée à une personne
  var ECART = 36;     // espace entre deux blocs
  var RANG = 215;     // hauteur d'une génération
  var R = 24;         // demi-taille du symbole
  var BAS_TEXTE = R + 68;

  var PRUNE = '#6B2F5B', PRUNE_DOUX = '#8E6383', CHAMPAGNE = '#B98A55', CORAIL = '#E7A79E';
  var ROUGE = '#C62F3A'; /* les répétitions les plus évidentes */
  var COUL = { anniversaire: '#D2793A', gisant: '#B5485C', depart: '#9C6B78', epreuve: '#B98A55', schema: '#7A4FA0', prenom: '#D06A7E', metier: '#4F7CAC', date: '#C46D9A' };

  var EVTS = [
    ['deuil', 'Deuil, perte d’un proche'],
    ['deces-precoce', 'Mort jeune'],
    ['rupture', 'Séparation, rupture'],
    ['abandon', 'Abandon, rejet'],
    ['secret', 'Secret de famille'],
    ['guerre', 'Guerre, exil'],
    ['demenagement', 'Départ, déracinement'],
    ['pauvrete', 'Manque d’argent'],
    ['faillite', 'Faillite, perte de biens'],
    ['heritage', 'Héritage conflictuel'],
    ['perte-emploi', 'Perte d’emploi ou de revenus'],
    ['ascension', 'Ascension sociale'],
    ['declassement', 'Déclassement'],
    ['hors-mariage', 'Naissance hors mariage, reconnaissance tardive'],
    ['maladie', 'Épreuve majeure'],
    ['sacrifice', 'Sacrifice, effacement'],
    ['trahison', 'Trahison'],
    ['injustice', 'Injustice'],
    ['honte', 'Honte'],
    ['abus', 'Violence'],
    ['mariage', 'Mariage, union'],
    ['naissance', 'Naissance d’un enfant'],
    ['reussite', 'Réussite, tournant heureux']
  ];
  var NOM_EVT = {}; EVTS.forEach(function (e) { NOM_EVT[e[0]] = e[1]; });

  /* ───────── État ───────── */
  var S = { people: {}, rels: [], nid: 1 };
  var sb = null, utilisateur = null, EXEMPLE = false;
  var selId = null, repActive = null;
  var vue = { x: 0, y: 0, k: 1 };
  var plan = null;          // dernier placement calculé
  var pile = [];            // historique pour Annuler
  var minuteur = null;
  var annexes = {};         // autres données du compte (ex. parcours guidé) à conserver
  var enAttente = false, essais = 0;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function moy(a) { var s = 0; a.forEach(function (v) { s += v; }); return a.length ? s / a.length : 0; }
  function pad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
  function couper(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; }

  /* ───────── Dates ───────── */
  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function jourMois(d) { var m = String(d || '').match(/^\d{4}-(\d{2})-(\d{2})$/); return m ? m[2] + '/' + m[1] : null; }
  function normDate(v) {
    v = String(v || '').trim(); if (!v) return '';
    var m, an = new Date().getFullYear() + 1;
    function valide(y, mo, d) { var t = new Date(+y, +mo - 1, +d); return +y >= 1500 && +y <= an && t.getFullYear() === +y && t.getMonth() === +mo - 1 && t.getDate() === +d; }
    if ((m = v.match(/^(\d{1,2})[\/.\- ](\d{1,2})[\/.\- ](\d{4})$/))) return valide(m[3], m[2], m[1]) ? m[3] + '-' + pad(m[2]) + '-' + pad(m[1]) : null;
    if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return valide(m[1], m[2], m[3]) ? m[1] + '-' + pad(m[2]) + '-' + pad(m[3]) : null;
    if ((m = v.match(/^(?:vers\s+|env\.?\s*|~\s*)?(\d{4})$/i))) return (+m[1] >= 1500 && +m[1] <= an) ? m[1] : null;
    return null;
  }
  function affDate(d) { var m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? m[3] + '/' + m[2] + '/' + m[1] : (d || ''); }
  function ageEntre(d1, d2) {
    var a = String(d1 || '').match(/^(\d{4})-(\d{2})-(\d{2})$/), b = String(d2 || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (a && b) { var n = +b[1] - +a[1]; if (+b[2] < +a[2] || (+b[2] === +a[2] && +b[3] < +a[3])) n--; return n; }
    var y1 = annee(d1), y2 = annee(d2); return (y1 && y2) ? y2 - y1 : null;
  }
  function aujourdhui() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function decede(p) { return !!(p.deces || p.decede); }
  function ageDeces(p) { var a = ageEntre(p.naiss, p.deces); return (a != null && a >= 0) ? a : null; }
  function ageActuel(p) { if (decede(p) || !annee(p.naiss)) return null; var a = ageEntre(p.naiss, aujourdhui()); return (a != null && a >= 0 && a < 125) ? a : null; }
  function texteDates(p) {
    var b = annee(p.naiss), d = annee(p.deces);
    if (b && d) return b + ' – ' + d;
    if (b && p.decede) return b + ' – ?';
    if (b) return (p.sex === 'f' ? 'née en ' : p.sex === 'm' ? 'né en ' : 'naissance ') + b;
    if (d) return '† ' + d;
    return '';
  }

  /* ───────── Liens ───────── */
  function existe(id) { return !!S.people[id]; }
  function parents(id) { return S.rels.filter(function (r) { return r.type === 'parent' && r.to === id && existe(r.from); }).map(function (r) { return r.from; }); }
  function enfants(id) { return S.rels.filter(function (r) { return r.type === 'parent' && r.from === id && existe(r.to); }).map(function (r) { return r.to; }); }
  function partenaires(id) { return S.rels.filter(function (r) { return r.type === 'couple' && (r.from === id || r.to === id); }).map(function (r) { return r.from === id ? r.to : r.from; }).filter(existe); }
  function relCouple(a, b) { return S.rels.find(function (r) { return r.type === 'couple' && ((r.from === a && r.to === b) || (r.from === b && r.to === a)); }); }
  function idMoi() { var k = Object.keys(S.people).find(function (id) { return S.people[id].role === 'moi'; }); return k || null; }
  function groupesFratrie() {
    var uf = {};
    function f(x) { if (!uf[x]) uf[x] = x; return uf[x] === x ? x : (uf[x] = f(uf[x])); }
    S.rels.forEach(function (r) { if (r.type === 'fratrie' && existe(r.from) && existe(r.to)) uf[f(r.from)] = f(r.to); });
    var taille = {};
    Object.keys(S.people).forEach(function (id) { var k = f(id); taille[k] = (taille[k] || 0) + 1; });
    return { racine: f, taille: taille };
  }
  function freresDirects(id, g) {
    g = g || groupesFratrie();
    var res = {};
    var ps = parents(id);
    ps.forEach(function (p) { enfants(p).forEach(function (c) { if (c !== id) res[c] = 1; }); });
    var k = g.racine(id);
    if (g.taille[k] > 1) Object.keys(S.people).forEach(function (o) { if (o !== id && g.racine(o) === k) res[o] = 1; });
    return Object.keys(res);
  }
  function estAncetre(a, b) { // a est-il ancêtre de b ?
    var vus = {}, file = [b];
    while (file.length) { var x = file.shift(); var ps = parents(x); for (var i = 0; i < ps.length; i++) { if (ps[i] === a) return true; if (!vus[ps[i]]) { vus[ps[i]] = 1; file.push(ps[i]); } } }
    return false;
  }

  function nouvellePersonne(o) {
    var p = Object.assign({ id: 'p' + (S.nid++), prenom: '', nom: '', sex: 'u', naiss: '', deces: '', decede: false, metier: '', lieu: '', traits: [], events: [], notes: '', role: '' }, o || {});
    while (S.people[p.id]) p.id = 'p' + (S.nid++);
    S.people[p.id] = p;
    return p;
  }
  /* Notation des génogrammes (McGoldrick et Gerson) : enfants non nés, adoption, placement, jumeaux (champs facultatifs) */
  var GROSS = { fc: 'Fausse couche', mn: 'Enfant mort-né', ivg: 'IVG', encours: 'Grossesse en cours' };
  var RP = 13;   // demi-taille des petits symboles
  function petit(p) { return !!(p && GROSS[p.grossesse]); }
  function perte(p) { return !!p && (p.grossesse === 'fc' || p.grossesse === 'mn'); }
  function jumeauDe(id) {
    var p = S.people[id]; if (!p) return null;
    if (p.jumeau && p.jumeau !== id && existe(p.jumeau)) return p.jumeau;
    var k = Object.keys(S.people).find(function (o) { return o !== id && S.people[o].jumeau === id; });
    return k || null;
  }
  function nomComplet(p) { return ((p.prenom || '') + ' ' + (p.nom || '')).trim(); }
  function nomAffiche(p) { return nomComplet(p) || lienDe(p.id) || 'Sans prénom'; }

  /* ───────── Parenté par rapport à toi ───────── */
  var LIENS = {
    'U': ['Père', 'Mère', 'Parent'], 'UU': ['Grand-père', 'Grand-mère', 'Grand-parent'],
    'UUU': ['Arrière-grand-père', 'Arrière-grand-mère', 'Arrière-grand-parent'],
    'UUUU': ['Trisaïeul', 'Trisaïeule', 'Trisaïeul·e'],
    'D': ['Fils', 'Fille', 'Enfant'], 'DD': ['Petit-fils', 'Petite-fille', 'Petit-enfant'], 'DDD': ['Arrière-petit-fils', 'Arrière-petite-fille', 'Arrière-petit-enfant'],
    'UD': ['Frère', 'Sœur', 'Frère ou sœur'], 'S': ['Conjoint', 'Conjointe', 'Conjoint·e'],
    'UUD': ['Oncle', 'Tante', 'Oncle ou tante'], 'UUUD': ['Grand-oncle', 'Grand-tante', 'Grand-oncle ou tante'],
    'UUDD': ['Cousin', 'Cousine', 'Cousin·e'], 'UDD': ['Neveu', 'Nièce', 'Neveu ou nièce'],
    'US': ['Beau-père', 'Belle-mère', 'Beau-parent'], 'SU': ['Beau-père', 'Belle-mère', 'Beau-parent'],
    'DS': ['Gendre', 'Belle-fille', 'Gendre ou belle-fille'], 'SD': ['Beau-fils', 'Belle-fille', 'Enfant du conjoint'],
    'UDS': ['Beau-frère', 'Belle-sœur', 'Beau-frère ou belle-sœur'], 'SUD': ['Beau-frère', 'Belle-sœur', 'Beau-frère ou belle-sœur'],
    'UUDS': ['Oncle', 'Tante', 'Oncle ou tante'], 'UUS': ['Beau-grand-père', 'Belle-grand-mère', 'Conjoint·e de grand-parent'],
    'DU': ['Autre parent de ton enfant', 'Autre parent de ton enfant', 'Autre parent de ton enfant']
  };
  var cacheLiens = null;
  function calculerLiens() {
    var moi = idMoi(), res = {};
    if (!moi) return res;
    var g = groupesFratrie();
    var chemin = {}; chemin[moi] = ''; var file = [moi];
    while (file.length) {
      var a = file.shift(), s = chemin[a];
      if (s.length >= 5) continue;
      var pas = [];
      parents(a).forEach(function (b) { pas.push([b, 'U']); });
      enfants(a).forEach(function (b) { pas.push([b, 'D']); });
      partenaires(a).forEach(function (b) { pas.push([b, 'S']); });
      var k = g.racine(a);
      if (g.taille[k] > 1) Object.keys(S.people).forEach(function (o) { if (o !== a && g.racine(o) === k) pas.push([o, 'UD']); });
      pas.forEach(function (x) { if (chemin[x[0]] === undefined) { chemin[x[0]] = s + x[1]; file.push(x[0]); } });
    }
    Object.keys(chemin).forEach(function (id) {
      if (id === moi) { res[id] = 'Toi'; return; }
      var t = LIENS[chemin[id]]; if (!t) return;
      var p = S.people[id], i = p.sex === 'm' ? 0 : p.sex === 'f' ? 1 : 2, lib = t[i];
      if (chemin[id] === 'UD') {
        var a1 = parents(moi), b1 = parents(id);
        if (a1.length === 2 && b1.length === 2 && a1.filter(function (x) { return b1.indexOf(x) >= 0; }).length === 1) lib = ['Demi-frère', 'Demi-sœur', 'Demi-frère ou sœur'][i];
      }
      res[id] = lib;
    });
    return res;
  }
  function lienDe(id) { if (!cacheLiens) cacheLiens = calculerLiens(); return cacheLiens[id] || ''; }

  /* ───────── Placement automatique ───────── */
  function calculerPlan() {
    var ids = Object.keys(S.people);
    var res = { pos: {}, familles: [], couples: [], boite: null };
    if (!ids.length) return res;
    var g = groupesFratrie();
    var par = {}, enf = {}, part = {};
    ids.forEach(function (id) { par[id] = []; enf[id] = []; part[id] = []; });
    S.rels.forEach(function (r) {
      if (!existe(r.from) || !existe(r.to) || r.from === r.to) return;
      if (r.type === 'parent') { par[r.to].push(r.from); enf[r.from].push(r.to); }
      else if (r.type === 'couple') { part[r.from].push(r.to); part[r.to].push(r.from); }
    });
    function freres(id) {
      var k = g.racine(id); if (g.taille[k] < 2) return [];
      return ids.filter(function (o) { return o !== id && g.racine(o) === k; });
    }

    // 1. Générations (parcours depuis toi, puis chaque groupe isolé)
    var gen = {}, comp = {}, ordre = {}, nc = 0, cpt = 0;
    var moi = idMoi();
    var departs = (moi ? [moi] : []).concat(ids);
    departs.forEach(function (d) {
      if (gen[d] !== undefined) return;
      gen[d] = 0; comp[d] = nc; ordre[d] = cpt++;
      var file = [d];
      while (file.length) {
        var a = file.shift(), ga = gen[a];
        var v = [];
        par[a].forEach(function (b) { v.push([b, ga - 1]); });
        part[a].forEach(function (b) { v.push([b, ga]); });
        freres(a).forEach(function (b) { v.push([b, ga]); });
        enf[a].forEach(function (b) { v.push([b, ga + 1]); });
        v.forEach(function (x) { if (gen[x[0]] === undefined) { gen[x[0]] = x[1]; comp[x[0]] = nc; ordre[x[0]] = cpt++; file.push(x[0]); } });
      }
      nc++;
    });

    // 2. Blocs : une personne et son ou ses partenaires de la même génération
    var uf = {};
    function f(x) { if (!uf[x]) uf[x] = x; return uf[x] === x ? x : (uf[x] = f(uf[x])); }
    S.rels.forEach(function (r) { if (r.type === 'couple' && existe(r.from) && existe(r.to) && gen[r.from] === gen[r.to]) uf[f(r.from)] = f(r.to); });
    var tmp = {};
    ids.forEach(function (id) { var k = f(id); (tmp[k] = tmp[k] || []).push(id); });
    var blocs = Object.keys(tmp).map(function (k) { return { membres: ordonnerBloc(tmp[k], part, ordre), x: 0 }; });
    var blocDe = {}, decal = {};
    blocs.forEach(function (b) {
      var n = b.membres.length;
      b.gen = gen[b.membres[0]]; b.comp = comp[b.membres[0]]; b.w = n * SLOT;
      b.ordre = Math.min.apply(null, b.membres.map(function (m) { return ordre[m]; }));
      b.membres.forEach(function (m, i) { blocDe[m] = b; decal[m] = (i - (n - 1) / 2) * SLOT; });
    });
    function px(id) { return blocDe[id].x + decal[id]; }

    // 3. Familles : enfants regroupés par couple de parents (ou par fratrie sans parents connus)
    var fm = {};
    ids.forEach(function (c) {
      var ps = par[c].slice().sort(), cle;
      if (ps.length) cle = 'p:' + ps.join('|');
      else if (g.taille[g.racine(c)] > 1) cle = 'f:' + g.racine(c);
      else return;
      (fm[cle] = fm[cle] || { cle: cle, parents: ps, enfants: [] }).enfants.push(c);
    });
    var familles = Object.keys(fm).map(function (k) { return fm[k]; });
    familles.forEach(function (fa) {
      fa.enfants.sort(function (a, b) {
        var ya = annee(S.people[a].naiss), yb = annee(S.people[b].naiss);
        if (ya && yb && ya !== yb) return ya - yb;
        if (ya && !yb) return -1; if (yb && !ya) return 1;
        return ordre[a] - ordre[b];
      });
      // des jumeaux restent côte à côte dans la fratrie
      var e = fa.enfants;
      for (var i = 0; i < e.length; i++) { var t = jumeauDe(e[i]), k = t ? e.indexOf(t) : -1; if (k > i + 1) { e.splice(k, 1); e.splice(i + 1, 0, t); } }
    });
    var famDe = {};
    familles.forEach(function (fa) { fa.enfants.forEach(function (c, k) { famDe[c] = { f: fa, k: k }; }); });
    var famsParBloc = new Map();
    familles.forEach(function (fa) {
      var vus = [];
      fa.parents.forEach(function (p) { var b = blocDe[p]; if (vus.indexOf(b) < 0) { vus.push(b); if (!famsParBloc.has(b)) famsParBloc.set(b, []); famsParBloc.get(b).push(fa); } });
    });

    function depuisEnfants(b) {
      var fs = famsParBloc.get(b); if (!fs) return null;
      var s = 0, n = 0;
      fs.forEach(function (fa) {
        var miens = fa.parents.filter(function (p) { return blocDe[p] === b; });
        var cx = moy(fa.enfants.map(px)), off = moy(miens.map(function (m) { return decal[m]; }));
        s += (cx - off) * fa.enfants.length; n += fa.enfants.length;
      });
      return n ? s / n : null;
    }
    function depuisParents(b) {
      var s = 0, n = 0;
      b.membres.forEach(function (m) {
        var fd = famDe[m]; if (!fd) return;
        var fa = fd.f;
        var ancre = fa.parents.length ? moy(fa.parents.map(px)) : moy(fa.enfants.map(px));
        var t = ancre + (fd.k - (fa.enfants.length - 1) / 2) * SLOT;
        s += t - decal[m]; n++;
      });
      return n ? s / n : null;
    }
    function ancreDe(m) { var fd = famDe[m]; return (fd && fd.f.parents.length) ? moy(fd.f.parents.map(px)) : null; }
    function ajusterBloc(b) {
      if (b.membres.length !== 2) return;
      var m0 = b.membres[0], m1 = b.membres[1], a0 = ancreDe(m0), a1 = ancreDe(m1), inverser = false;
      function moitieGauche(m) { var fd = famDe[m]; return fd.k < (fd.f.enfants.length - 1) / 2; }
      if (a0 != null && a1 != null) inverser = a0 > a1 + 1;
      else if (a0 != null) inverser = moitieGauche(m0);
      else if (a1 != null) inverser = !moitieGauche(m1);
      if (inverser) { b.membres = [m1, m0]; decal[m1] = -SLOT / 2; decal[m0] = SLOT / 2; }
    }
    function resoudre(liste, souhait) {
      var arr = liste.map(function (b) { var d = souhait.get(b); return { b: b, d: d == null ? b.x : d }; });
      arr.sort(function (a, c) { return (a.d - c.d) || (a.b.x - c.b.x) || (a.b.ordre - c.b.ordre); });
      var n = arr.length, L = [], Rr = [], i;
      for (i = 0; i < n; i++) L[i] = i ? Math.max(arr[i].d, L[i - 1] + (arr[i - 1].b.w + arr[i].b.w) / 2 + ECART) : arr[i].d;
      for (i = n - 1; i >= 0; i--) Rr[i] = i < n - 1 ? Math.min(arr[i].d, Rr[i + 1] - (arr[i].b.w + arr[i + 1].b.w) / 2 - ECART) : arr[i].d;
      for (i = 0; i < n; i++) arr[i].b.x = (L[i] + Rr[i]) / 2;
    }

    // 4. Itérations par groupe isolé
    var decalageComp = 0;
    for (var c = 0; c < nc; c++) {
      var bc = blocs.filter(function (b) { return b.comp === c; });
      var parGen = {};
      bc.forEach(function (b) { (parGen[b.gen] = parGen[b.gen] || []).push(b); });
      var gens = Object.keys(parGen).map(Number).sort(function (a, b) { return a - b; });
      gens.forEach(function (gg) {
        var x = 0;
        parGen[gg].sort(function (a, b) { return a.ordre - b.ordre; }).forEach(function (b) { b.x = x + b.w / 2; x += b.w + ECART; });
      });
      for (var it = 0; it < 16; it++) {
        var gi, souhait;
        for (gi = gens.length - 2; gi >= 0; gi--) {
          souhait = new Map();
          parGen[gens[gi]].forEach(function (b) { var d = depuisEnfants(b); if (d == null) d = depuisParents(b); souhait.set(b, d); });
          resoudre(parGen[gens[gi]], souhait);
        }
        for (gi = 1; gi < gens.length; gi++) {
          parGen[gens[gi]].forEach(ajusterBloc);
          souhait = new Map();
          parGen[gens[gi]].forEach(function (b) { var d = depuisParents(b); if (d == null) d = depuisEnfants(b); souhait.set(b, d); });
          resoudre(parGen[gens[gi]], souhait);
        }
        if (gens.length === 1) { souhait = new Map(); parGen[gens[0]].forEach(function (b) { souhait.set(b, depuisParents(b)); }); resoudre(parGen[gens[0]], souhait); }
      }
      // un couple pile sous le trait de ses parents : on le décale un peu pour que les traits restent lisibles
      bc.forEach(function (b) {
        if (b.membres.length !== 2 || !famsParBloc.get(b)) return;
        b.membres.forEach(function (m) {
          var A = ancreDe(m); if (A == null || Math.abs(b.x - A) >= 12) return;
          var dir = decal[m] < 0 ? 1 : -1;
          var voisins = parGen[b.gen].filter(function (o) { return o !== b && (o.x - b.x) * dir > 0; });
          var place = 40;
          voisins.forEach(function (o) { place = Math.min(place, Math.abs(o.x - b.x) - (o.w + b.w) / 2 - ECART); });
          if (place > 6) b.x += dir * Math.min(40, place);
          else {
            var v2 = parGen[b.gen].filter(function (o) { return o !== b && (o.x - b.x) * dir > 0; });
            v2.forEach(function (o) { o.x += dir * 40; });
            b.x += dir * 40;
          }
        });
      });
      var mn = Infinity, mx = -Infinity;
      bc.forEach(function (b) { mn = Math.min(mn, b.x - b.w / 2); mx = Math.max(mx, b.x + b.w / 2); });
      bc.forEach(function (b) { b.x += decalageComp - mn; });
      decalageComp += (mx - mn) + 160;
    }

    ids.forEach(function (id) { res.pos[id] = { x: px(id), y: gen[id] * RANG }; });
    res.familles = familles.filter(function (fa) { return fa.parents.length || fa.enfants.length > 1; });
    S.rels.forEach(function (r) { if (r.type === 'couple' && existe(r.from) && existe(r.to)) res.couples.push(r); });
    var bx = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    ids.forEach(function (id) { var p = res.pos[id]; bx.x1 = Math.min(bx.x1, p.x - SLOT / 2); bx.x2 = Math.max(bx.x2, p.x + SLOT / 2); bx.y1 = Math.min(bx.y1, p.y - R - 14); bx.y2 = Math.max(bx.y2, p.y + BAS_TEXTE); });
    res.boite = bx;
    return res;
  }
  function ordonnerBloc(m, part, ordre) {
    if (m.length === 1) return m;
    if (m.length === 2) {
      var a = S.people[m[0]], b = S.people[m[1]];
      var rang = function (p) { return p.sex === 'm' ? 0 : p.sex === 'u' ? 1 : 2; };
      return rang(a) <= rang(b) ? m : [m[1], m[0]];
    }
    var pivot = m.slice().sort(function (a, b) { return (part[b].length - part[a].length) || (ordre[a] - ordre[b]); })[0];
    var autres = m.filter(function (x) { return x !== pivot; }).sort(function (a, b) { return ordre[a] - ordre[b]; });
    var g = [], d = [];
    autres.forEach(function (x, i) { if (i % 2) g.unshift(x); else d.push(x); });
    return g.concat([pivot], d);
  }

  /* ───────── Répétitions ───────── */
  var GROUPES_METIERS = {
    'métiers du soin': ['medecin', 'infirmi', 'soignant', 'pharmac', 'kine', 'sage-femme', 'aide-soignant', 'chirurgien', 'dentiste'],
    'enseignement': ['enseignant', 'professeur', 'institut', 'educat', 'formateur', 'maitresse', 'prof '],
    'commerce': ['commerc', 'vendeu', 'boulang', 'bouch', 'epicier', 'marchand', 'representant'],
    'terre': ['agricult', 'fermier', 'fermiere', 'vigneron', 'paysan', 'eleveu', 'maraich'],
    'artisanat': ['artisan', 'menuisier', 'charpentier', 'couturi', 'tailleur', 'cordonnier', 'macon', 'ebeniste', 'plombier', 'electricien'],
    'uniforme': ['militaire', 'soldat', 'gendarme', 'policier', 'pompier'],
    'foyer': ['au foyer', 'menagere', 'domestique'],
    'religion': ['pretre', 'pasteur', 'religieu', 'cure', 'moine', 'nonne'],
    'usine': ['ouvrier', 'ouvriere', 'usine', 'mineur', 'manoeuvre'],
    'chiffres': ['comptable', 'banqu', 'notaire', 'financ', 'gestionnaire']
  };
  function groupeMetier(m) {
    var n = norm(m); if (!n) return null;
    for (var g in GROUPES_METIERS) { if (GROUPES_METIERS[g].some(function (w) { return n.indexOf(w) >= 0; })) return g; }
    return null;
  }
  function a(p, type) { return (p.events || []).some(function (e) { return e.type === type; }); }
  function txt(p) { return norm((p.traits || []).join(' ') + ' ' + (p.notes || '')); }
  var SCHEMAS = [
    { id: 'effacee', label: 'Des femmes qui s’effacent', test: function (p) { return p.sex === 'f' && (a(p, 'sacrifice') || /sacrifi|effac|devou|s.oubli/.test(txt(p)) || false); } },
    { id: 'absent', label: 'Des pères absents ou partis', test: function (p) { return p.sex === 'm' && (a(p, 'abandon') || /absent|parti |disparu|quitte/.test(txt(p))); } },
    { id: 'aine', label: 'Des aînés qui portent la famille', test: function (p) { return /responsab|aine|parentifi|porte la famille/.test(txt(p)); } },
    { id: 'secret', label: 'Des secrets et des non-dits', test: function (p) { return a(p, 'secret') || a(p, 'honte') || /secret|non-dit|on n.en parl|tabou|honte/.test(txt(p)); } },
    { id: 'colere', label: 'De la colère ou de la violence', test: function (p) { return a(p, 'abus') || /violen|colere|coleri|brutal/.test(txt(p)); } },
    { id: 'deuil', label: 'Des deuils dont on ne parle pas', test: function (p) { return a(p, 'deuil') && /jamais|silence|tabou|pas parl/.test(txt(p)); } },
    { id: 'exil', label: 'Des départs et des déracinements', test: function (p) { return a(p, 'guerre') || a(p, 'demenagement') || /exil|immigr|emigr|parti vivre/.test(txt(p)); } }
  ];

  function detecter() {
    // une IVG ou une grossesse en cours n'entre pas dans les pistes ; une fausse couche ou un enfant mort-né compte comme une perte
    var liste = Object.keys(S.people).map(function (id) { return S.people[id]; }).filter(function (p) { return !petit(p) || perte(p); });
    var reps = [];
    function nom(p) { return nomComplet(p) || lienDe(p.id) || 'Sans prénom'; }
    var moi = S.people[idMoi()];

    // Syndrome anniversaire : ton âge aujourd'hui
    if (moi) {
      var age = ageActuel(moi);
      if (age != null) {
        liste.forEach(function (p) {
          if (p.id === moi.id) return;
          var ad = ageDeces(p);
          if (ad != null && Math.abs(ad - age) <= 1) reps.push({ type: 'anniversaire', c: COUL.anniversaire, label: 'Syndrome anniversaire', desc: 'Tu as ' + age + ' ans. ' + nom(p) + ' est ' + (p.sex === 'f' ? 'décédée' : 'décédé') + ' à ' + ad + ' ans.', ids: [moi.id, p.id], exo: { a: nom(p), l: (p.sex === 'f' ? 'décédée' : 'décédé') + ' à ' + ad + ' ans, l’âge que j’ai aujourd’hui' } });
          (p.events || []).forEach(function (e) {
            var ea = parseInt(e.age, 10);
            if (!isNaN(ea) && Math.abs(ea - age) <= 1) reps.push({ type: 'anniversaire', c: COUL.anniversaire, label: 'Syndrome anniversaire', desc: 'Tu as ' + age + ' ans. ' + nom(p) + ' a vécu « ' + (NOM_EVT[e.type] || e.type).toLowerCase() + ' » à ' + ea + ' ans.', ids: [moi.id, p.id], exo: { a: nom(p), l: 'a vécu « ' + (NOM_EVT[e.type] || e.type).toLowerCase() + ' » à ' + ea + ' ans, l’âge que j’ai aujourd’hui' } });
          });
        });
      }
    }
    // Dates qui reviennent (même jour et même mois)
    var dm = {};
    liste.forEach(function (p) {
      [['naiss', 'naissance'], ['deces', 'décès']].forEach(function (k) {
        var j = jourMois(p[k[0]]); if (!j) return;
        (dm[j] = dm[j] || []).push({ p: p, quoi: k[1] });
      });
    });
    Object.keys(dm).forEach(function (j) {
      var g = dm[j]; var ids = []; g.forEach(function (x) { if (ids.indexOf(x.p.id) < 0) ids.push(x.p.id); });
      var dec = g.filter(function (x) { return x.quoi === 'décès'; }), nai = g.filter(function (x) { return x.quoi === 'naissance'; });
      if (ids.length === 2 && dec.length === 1 && nai.length === 1 && famille(dec[0].p)[nai[0].p.id] && annee(nai[0].p.naiss) < annee(dec[0].p.deces)) return;   // repris par « Un décès près d'un anniversaire »
      if (ids.length >= 2) {
        var parts = j.split('/');
        var mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][+parts[1] - 1];
        reps.push({ type: 'date', c: COUL.date, label: 'Une date qui revient : le ' + (+parts[0]) + ' ' + mois, desc: g.map(function (x) { return x.quoi + ' de ' + nom(x.p); }).join(', ') + '.', ids: ids });
      }
    });
    // Départs précoces : parmi tes proches (jusqu'aux arrière-grands-parents, oncles et tantes) quand « toi » est placé·e
    function jeune(p) { var ad = ageDeces(p); return a(p, 'deces-precoce') || (ad != null && ad < 50); }
    var anAuj = new Date().getFullYear(), anMax = Math.max.apply(null, liste.map(function (p) { var x = annee(p.naiss); return x && x <= anAuj ? x : 0; }));
    var proches = moi ? liste.filter(function (p) { return !!lienDe(p.id); }) : liste.filter(function (p) { return (annee(p.naiss) || 0) >= anMax - 100; });
    var jeunes = proches.filter(jeune);
    if (jeunes.length >= 2) reps.push({ type: 'depart', c: COUL.depart, label: 'Des départs précoces', desc: jeunes.map(function (p) { var ad = ageDeces(p); return nom(p) + (ad != null ? ' (' + ad + ' ans)' : ''); }).join(', ') + '.', ids: jeunes.map(function (p) { return p.id; }) });

    // Piste du gisant (Salomon Sellam) : un décès, et quelqu'un qui naît ensuite relié à ce défunt
    // par une naissance proche du décès, la reprise de son prénom ou une naissance le jour anniversaire du décès.
    function jours(d1, d2) {
      var x = String(d1 || '').match(/^(\d{4})-(\d{2})-(\d{2})$/), y = String(d2 || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
      return (x && y) ? Math.round((Date.UTC(+y[1], +y[2] - 1, +y[3]) - Date.UTC(+x[1], +x[2] - 1, +x[3])) / 864e5) : null;
    }
    function prenom1(p) { return norm(String(p.prenom || '').replace(/[\s,-]+/g, ' ')); }   // le prénom complet (Pierre Marie ≠ Pierre)
    function memePrenom(x, y) {
      var u = prenom1(x), v = prenom1(y); if (!u || !v) return false;
      if (u === v) return true;
      var court = u.length < v.length ? u : v, long = u.length < v.length ? v : u;
      return court.length >= 4 && long.indexOf(court) === 0 && long.length - court.length <= 2;   // Jean, Jeanne ; Louis, Louise
    }
    function ecartJM(dDeces, dNaiss) {   // écart en jours entre l'anniversaire du décès et le jour de naissance, à l'année près
      var x = String(dDeces || '').match(/^\d{4}-(\d{2})-(\d{2})$/), y = String(dNaiss || '').match(/^\d{4}-(\d{2})-(\d{2})$/);
      if (!x || !y) return null;
      var e = Math.abs(Date.UTC(2001, +x[1] - 1, +x[2]) - Date.UTC(2001, +y[1] - 1, +y[2])) / 864e5;
      return Math.min(e, 365 - e);
    }
    function descendants(id, acc) { enfants(id).forEach(function (e) { if (!acc[e]) { acc[e] = 1; descendants(e, acc); } }); return acc; }
    function famille(d) {   // les descendants du défunt et ceux de ses parents (frères, sœurs, neveux, nièces…)
      var acc = descendants(d.id, {}); parents(d.id).forEach(function (pp) { descendants(pp, acc); }); delete acc[d.id]; return acc;
    }
    function ne(g) { return 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : ''); }
    function nomA(p) { var an = annee(p.naiss); return nom(p) + (an ? ' (' + ne(p) + ' en ' + an + ')' : ''); }
    liste.forEach(function (d) {
      var ad = annee(d.deces); if (!ad) return;
      var fam = famille(d);
      var estJeune = jeune(d), liens = [], ids = [d.id], exoMoi = null;
      liste.forEach(function (g) {
        if (g.id === d.id || !fam[g.id]) return;
        var an = annee(g.naiss); if (!an || an <= annee(d.naiss || '')) return;
        var raisons = [];
        // 1. Le jour anniversaire du décès (naissance après le décès)
        var e = ecartJM(d.deces, g.naiss);
        if (e != null && e <= 7 && an > ad) raisons.push(e === 0 ? 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' le jour anniversaire de ce décès' : 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' à ' + e + ' jour' + (e > 1 ? 's' : '') + ' de l’anniversaire de ce décès');
        if (estJeune) {
          // 2. Une naissance proche du décès
          var dj = jours(d.deces, g.naiss);
          if (dj != null ? (dj >= -730 && dj <= 730) : (an >= ad - 2 && an <= ad + 2)) {
            var t = dj == null ? (an === ad ? 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' l’année de ce décès' : an < ad ? ne(g) + ' ' + (ad - an) + ' an' + (ad - an > 1 ? 's' : '') + ' avant ce décès' : 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' ' + (an - ad) + ' an' + (an - ad > 1 ? 's' : '') + ' après')
              : dj < 0 ? 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' ' + Math.max(1, Math.round(-dj / 30.4)) + ' mois avant ce décès' : 'né' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' ' + Math.max(1, Math.round(dj / 30.4)) + ' mois après' + (dj >= 180 && dj <= 300 ? ', conçu' + (g.sex === 'f' ? 'e' : g.sex === 'u' ? '·e' : '') + ' autour du deuil' : '');
            raisons.push(t);
          }
          // 3. Le prénom du défunt repris
          if (memePrenom(d, g)) raisons.push('porte ' + (prenom1(d) === prenom1(g) ? 'son prénom' : 'une forme de son prénom'));
        }
        if (raisons.length) { liens.push(nomA(g) + ' : ' + raisons.join(', ')); ids.push(g.id); if (moi && g.id === moi.id) exoMoi = raisons.join(', ').replace(/^né(e|·e)? /, 'je suis ' + ne(g) + ' ').replace(/^porte /, 'je porte '); }
      });
      if (!liens.length) return;
      var age = ageDeces(d);
      reps.push({ type: 'gisant', c: COUL.gisant, exo: exoMoi ? { a: nom(d), l: (d.sex === 'f' ? 'décédée' : 'décédé') + ' en ' + ad + (age != null ? ' à ' + age + ' ans' : '') + ' ; ' + exoMoi } : null, label: 'Piste du gisant : ' + nom(d), desc: nomA(d) + ' est ' + (d.sex === 'f' ? 'décédée' : 'décédé') + (age != null ? ' à ' + age + ' ans' : '') + ' en ' + ad + '. ' + liens.join(' ; ') + '.', ids: ids });
    });
    // Un décès le jour (ou à une semaine près) de l'anniversaire d'un descendant ou d'un proche déjà né
    var MOIS_N = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    liste.forEach(function (d) {
      var md = String(d.deces || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!md) return;
      var fam = famille(d);
      liste.forEach(function (g) {
        if (g.id === d.id || !fam[g.id]) return;
        var e = ecartJM(d.deces, g.naiss); if (e == null || e > 7) return;
        var ag = ageEntre(g.naiss, d.deces); if (ag == null || ag < 1) return;   // déjà né·e, au moins un an avant
        if (g.deces && annee(g.deces) < +md[1]) return;
        var toi = moi && g.id === moi.id, quand = (+md[3] === 1 ? '1er' : +md[3]) + ' ' + MOIS_N[+md[2] - 1] + ' ' + md[1];
        var age = (toi ? 'tes ' : 'des ') + ag + ' ans' + (toi ? '' : ' de ' + nom(g));
        reps.push({ type: 'date', c: COUL.date, label: 'Un décès près d’un anniversaire : ' + nom(d),
          desc: nomA(d) + ' est ' + (d.sex === 'f' ? 'décédée' : 'décédé') + ' le ' + quand + ', ' + (e === 0 ? 'le jour ' + (toi ? 'de ' : '') + age : 'à ' + e + ' jour' + (e > 1 ? 's' : '') + ' ' + (toi ? 'de ' : '') + age) + '.',
          ids: [d.id, g.id], exo: toi ? { a: nom(d), l: (d.sex === 'f' ? 'décédée' : 'décédé') + ' le ' + quand + ', ' + (e === 0 ? 'le jour de mes ' + ag + ' ans' : 'à ' + e + ' jour' + (e > 1 ? 's' : '') + ' de mes ' + ag + ' ans') } : null });
      });
    });

    // Un parent qui part peu après une naissance (ou pendant la grossesse), et qui se répète d'une génération à l'autre
    var departsNaissance = [];
    liste.forEach(function (enf) {
      var an = annee(enf.naiss); if (!an) return;
      parents(enf.id).forEach(function (pid) {
        var par = S.people[pid], ad = annee(par && par.deces); if (!ad) return;
        var dj = jours(enf.naiss, par.deces), ok = dj != null ? (dj >= -280 && dj <= 730) : (ad >= an && ad <= an + 2);
        if (!ok) return;
        var quand = dj != null ? (dj < 0 ? 'avant la naissance de ' + nomA(enf) : dj < 45 ? 'quelques semaines après la naissance de ' + nomA(enf) : Math.round(dj / 30.4) + ' mois après la naissance de ' + nomA(enf))
          : (ad === an ? 'l’année de la naissance de ' + nomA(enf) : (ad - an) + ' an' + (ad - an > 1 ? 's' : '') + ' après la naissance de ' + nomA(enf));
        departsNaissance.push({ txt: nomA(par) + ' meurt en ' + ad + (ageDeces(par) != null ? ', à ' + ageDeces(par) + ' ans' : '') + ', ' + quand, ids: [par.id, enf.id] });
      });
    });
    if (departsNaissance.length >= 2) {
      var idsDN = []; departsNaissance.forEach(function (x) { x.ids.forEach(function (i) { if (idsDN.indexOf(i) < 0) idsDN.push(i); }); });
      reps.push({ type: 'gisant', c: COUL.gisant, label: 'Un parent qui part juste après une naissance, ' + departsNaissance.length + ' fois', desc: departsNaissance.map(function (x) { return x.txt; }).join(' ; ') + '.', ids: idsDN });
    }

    // Événements répétés
    var parType = {};
    liste.forEach(function (p) {
      var vus = {};
      (p.events || []).forEach(function (e) { if (!e.type || vus[e.type]) return; vus[e.type] = 1; (parType[e.type] = parType[e.type] || []).push({ p: p, age: parseInt(e.age, 10) }); });
    });
    Object.keys(parType).forEach(function (t) {
      var g = parType[t]; if (g.length < 2) return;
      var nomT = (NOM_EVT[t] || t).toLowerCase();
      var avecAge = g.filter(function (x) { return !isNaN(x.age); });
      var proches = [];
      avecAge.forEach(function (x) { if (avecAge.some(function (y) { return y !== x && Math.abs(y.age - x.age) <= 2; })) proches.push(x); });
      if (proches.length >= 2) {
        var am = Math.round(moy(proches.map(function (x) { return x.age; })));
        reps.push({ type: 'epreuve', c: COUL.epreuve, label: 'Même événement, au même âge', desc: '« ' + nomT + ' » vers ' + am + ' ans : ' + proches.map(function (x) { return nom(x.p) + ' (' + x.age + ' ans)'; }).join(', ') + '.', ids: proches.map(function (x) { return x.p.id; }) });
      } else {
        reps.push({ type: 'epreuve', c: COUL.epreuve, label: 'Même événement : ' + nomT, desc: g.map(function (x) { return nom(x.p) + (isNaN(x.age) ? '' : ' (' + x.age + ' ans)'); }).join(', ') + '.', ids: g.map(function (x) { return x.p.id; }) });
      }
    });
    // Schémas
    SCHEMAS.forEach(function (s) {
      var g = liste.filter(s.test);
      if (g.length >= 2) reps.push({ type: 'schema', c: COUL.schema, label: s.label, desc: g.map(nom).join(', ') + '.', ids: g.map(function (p) { return p.id; }) });
    });
    // Prénoms
    var pr = {};
    liste.forEach(function (p) { var k = norm(p.prenom); if (k) (pr[k] = pr[k] || []).push(p); });
    Object.keys(pr).forEach(function (k) { var g = pr[k]; if (g.length >= 2) reps.push({ type: 'prenom', c: COUL.prenom, label: 'Un prénom qui revient : ' + g[0].prenom, desc: g.map(function (p) { var l = lienDe(p.id); return nom(p) + (l && l !== 'Toi' ? ' (' + l.toLowerCase() + ')' : l === 'Toi' ? ' (toi)' : ''); }).join(', ') + '.', ids: g.map(function (p) { return p.id; }) }); });
    // Métiers
    var mt = {};
    liste.forEach(function (p) { if (!p.metier) return; var k = groupeMetier(p.metier) || norm(p.metier); (mt[k] = mt[k] || []).push(p); });
    Object.keys(mt).forEach(function (k) {
      var g = mt[k]; if (g.length < 2) return;
      var lib = GROUPES_METIERS[k] ? k : g[0].metier;
      reps.push({ type: 'metier', c: COUL.metier, label: 'Même domaine de métier : ' + lib, desc: g.map(function (p) { return nom(p) + ', ' + p.metier; }).join(' · ') + '.', ids: g.map(function (p) { return p.id; }) });
    });

    /* ── Ce qui saute aux yeux dans une lignée (surtout utile pour les grands arbres importés) ── */
    var parentsDe = {}, enfantsDe = {};
    S.rels.forEach(function (r) {
      if (r.type !== 'parent' || !S.people[r.from] || !S.people[r.to]) return;
      (parentsDe[r.to] = parentsDe[r.to] || []).push(r.from);
      (enfantsDe[r.from] = enfantsDe[r.from] || []).push(r.to);
    });
    // 1. Des ancêtres présents par deux branches (mariage entre cousins, « implexe »)
    var bases = moi ? [moi.id] : liste.filter(function (p) { return !enfantsDe[p.id] && parentsDe[p.id]; }).map(function (p) { return p.id; });
    var chemins = {};
    bases.forEach(function (b) {
      var compte = {};
      (function monter(id) { (parentsDe[id] || []).forEach(function (pa) { compte[pa] = (compte[pa] || 0) + 1; monter(pa); }); })(b);
      Object.keys(compte).forEach(function (k) { chemins[k] = Math.max(chemins[k] || 0, compte[k]); });
    });
    var doubles = Object.keys(chemins).filter(function (k) { return chemins[k] >= 2; });
    // On garde les plus proches : ceux dont aucun enfant n'est lui-même présent deux fois
    var proches2 = doubles.filter(function (k) { return !(enfantsDe[k] || []).some(function (e) { return chemins[e] >= 2; }); });
    if (proches2.length) {
      reps.push({ type: 'schema', fort: true, label: 'Des ancêtres présents dans deux branches de ' + (moi ? 'ton ' : 'l’') + 'arbre',
        desc: proches2.map(function (k) { return nom(S.people[k]); }).join(', ') + ' : leurs descendants se sont mariés entre cousins. Deux lignées de ' + (moi ? 'ta' : 'la') + ' famille viennent de la même souche.',
        ids: proches2.concat((function () { var l = []; proches2.forEach(function (k) { (enfantsDe[k] || []).forEach(function (e) { if (l.indexOf(e) < 0) l.push(e); }); }); return l; })()) });
    }
    // 2. Ce qui passe de parent à enfant, génération après génération : prénom (même sexe) et métier
    function chaine(test, min) {
      var memo = {};
      function long(id) { // plus longue suite d'ancêtres directs qui partagent le trait, en partant de id
        if (memo[id]) return memo[id];
        var best = [id];
        (parentsDe[id] || []).forEach(function (pa) { if (test(S.people[pa], S.people[id])) { var l = long(pa); if (l.length + 1 > best.length) best = [id].concat(l); } });
        return (memo[id] = best);
      }
      var res = [];
      liste.forEach(function (p) {
        var estDebut = !(enfantsDe[p.id] || []).some(function (e) { return test(S.people[p.id], S.people[e]); });
        if (!estDebut) return;
        var l = long(p.id); if (l.length >= (min || 3)) res.push(l);
      });
      return res;
    }
    var premierPrenom = function (p) { return norm(p && p.prenom).split(/[\s-]+/).slice(0, 2).join(' '); };
    chaine(function (pa, en) { return pa && en && pa.sex === en.sex && premierPrenom(pa) && premierPrenom(pa) === premierPrenom(en); }).forEach(function (l) {
      var p0 = S.people[l[0]];
      reps.push({ type: 'prenom', fort: true, label: 'Le prénom « ' + p0.prenom.split(/\s+/).slice(0, 2).join(' ') + ' » transmis sur ' + l.length + ' générations', desc: 'De ' + (p0.sex === 'f' ? 'mère en fille' : 'père en fils') + ' : ' + l.map(function (id) { return nom(S.people[id]); }).reverse().join(' → ') + '.', ids: l });
    });
    var cleMetier = function (p) { return p && p.metier ? (groupeMetier(p.metier) || norm(p.metier)) : ''; };
    chaine(function (pa, en) { return pa && en && pa.sex === en.sex && cleMetier(pa) && cleMetier(pa) === cleMetier(en) && cleMetier(pa) !== 'foyer'; }).forEach(function (l) {
      var p0 = S.people[l[0]];
      reps.push({ type: 'metier', fort: l.length >= 4, label: 'Le même métier sur ' + l.length + ' générations : ' + norm(S.people[l[l.length - 1]].metier), desc: 'De ' + (p0.sex === 'f' ? 'mère en fille' : 'père en fils') + ' : ' + l.map(function (id) { return nom(S.people[id]) + ' (' + S.people[id].metier + ')'; }).reverse().join(' → ') + '.', ids: l });
    });
    // 3. Des mères qui meurent jeunes, en laissant de jeunes enfants
    var meres = liste.filter(function (p) {
      if (p.sex !== 'f') return false;
      var ad = ageDeces(p), fin = annee(p.deces); if (ad == null || ad >= 40 || !fin) return false;
      return (enfantsDe[p.id] || []).some(function (e) { var n = annee(S.people[e].naiss); return n && fin - n <= 12; });
    });
    if (meres.length >= 2) reps.push({ type: 'depart', fort: meres.length >= 3, label: meres.length + ' mères parties avant 40 ans, en laissant de jeunes enfants', desc: meres.map(function (p) { return nom(p) + ' (' + ageDeces(p) + ' ans)'; }).join(', ') + '.', ids: meres.map(function (p) { return p.id; }) });

    // 4. Un prénom qui en porte un autre : Stéphanie après Stéphane, Jean-Marie et une Marie disparue…
    function phon(t) { return norm(t).replace(/[^a-z]/g, '').replace(/ph/g, 'f').replace(/y/g, 'i').replace(/qu/g, 'k').replace(/(.)\1+/g, '$1'); }
    function racine(t) { var r = t.replace(/(ienne|enne|ette|ine|ie|e)$/, ''); return r.length >= 3 ? r : t; }
    function morceaux(p) { return norm(p && p.prenom).split(/[\s'’-]+/).map(phon).filter(function (t) { return t.length >= 3; }); }
    function souci(d) {
      var ad = ageDeces(d), l = [];
      if (ad != null && ad < 50) l.push((d.sex === 'f' ? 'décédée' : 'décédé') + ' à ' + ad + ' ans');
      (d.events || []).forEach(function (e) { if (e.type) l.push('« ' + (NOM_EVT[e.type] || e.type).toLowerCase() + ' »' + (e.age ? ' à ' + e.age + ' ans' : '')); });
      return l;
    }
    var caches = {};
    liste.forEach(function (d) {
      var md = morceaux(d); if (!md.length) return;
      var pb = souci(d); if (!pb.length) return;
      var fin = annee(d.deces) || annee(d.naiss); if (!fin) return;
      var fam = famille(d);
      liste.forEach(function (g) {
        if (g.id === d.id || !fam[g.id]) return;
        var an = annee(g.naiss); if (!an || an < fin || an - fin > 30) return;
        var mg = morceaux(g), tout = mg.join(''), forme = null;
        md.forEach(function (td) {
          if (forme) return;
          if (mg.some(function (tg) { return racine(tg) === racine(td); })) forme = d.prenom.split(/[\s-]+/).find(function (w) { return racine(phon(w)) === racine(td); }) || d.prenom;
          else if (td.length >= 4 && tout.indexOf(td) >= 0) forme = d.prenom.split(/[\s-]+/).find(function (w) { return phon(w) === td; }) || d.prenom;
        });
        if (!forme) return;
        (caches[g.id] = caches[g.id] || []).push({ d: d, forme: forme, pb: pb, ecart: an - (annee(d.deces) || fin) });
      });
    });
    Object.keys(caches).map(function (k) { return { g: S.people[k], l: caches[k].sort(function (x, y) { return x.ecart - y.ecart; }) }; })
      .sort(function (x, y) { return x.l[0].ecart - y.l[0].ecart; }).slice(0, 8).forEach(function (c) {
        var fortC = c.l.some(function (x) { var ad = ageDeces(x.d); return (ad != null && ad < 30) || (annee(x.d.deces) && x.ecart <= 5); });
        reps.push({ type: 'prenom', fort: fortC, tags: 'prenom cache symbolique memoire porte un autre',
          label: 'Un prénom qui en porte un autre : ' + c.g.prenom,
          desc: nomA(c.g) + ' porte « ' + c.l.map(function (x) { return x.forme; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(' », « ') + ' » : ' + c.l.slice(0, 3).map(function (x) { return nomA(x.d) + ', ' + x.pb.join(', ') + (annee(x.d.deces) ? (x.ecart === 0 ? ' (l’année de sa naissance)' : ' (' + x.ecart + ' an' + (x.ecart > 1 ? 's' : '') + ' avant sa naissance)') : ''); }).join(' ; ') + '.',
          ids: [c.g.id].concat(c.l.slice(0, 3).map(function (x) { return x.d.id; })) });
      });
    // 5. Les enfants : fratries d'un seul sexe, même nombre d'enfants d'une génération à l'autre
    var fratries = {};
    liste.forEach(function (p) { var pa = (parentsDe[p.id] || []).slice().sort().join('+'); if (pa) (fratries[pa] = fratries[pa] || []).push(p); });
    var seulesF = [], seulsM = [];
    Object.keys(fratries).forEach(function (k) {
      var f = fratries[k]; if (f.length < 2) return;
      var par = k.split('+').map(function (id) { return S.people[id]; });
      var qui = par.map(nom).join(' et ');
      if (f.every(function (e) { return e.sex === 'f'; })) seulesF.push({ txt: qui + ' : ' + f.length + ' filles', ids: k.split('+').concat(f.map(function (e) { return e.id; })) });
      if (f.every(function (e) { return e.sex === 'm'; })) seulsM.push({ txt: qui + ' : ' + f.length + ' garçons', ids: k.split('+').concat(f.map(function (e) { return e.id; })) });
    });
    [[seulesF, 'Des fratries de filles uniquement'], [seulsM, 'Des fratries de garçons uniquement']].forEach(function (x) {
      if (x[0].length >= 2) reps.push({ type: 'schema', fort: x[0].length >= 3, tags: 'enfants filles garcons fratrie sexe', label: x[1] + ', ' + x[0].length + ' fois', desc: x[0].map(function (y) { return y.txt; }).join(' ; ') + '.', ids: [].concat.apply([], x[0].map(function (y) { return y.ids; })) });
    });
    var parTaille = {};
    Object.keys(fratries).forEach(function (k) { var n = fratries[k].length; if (n >= 2) (parTaille[n] = parTaille[n] || []).push(k); });
    Object.keys(parTaille).forEach(function (n) {
      var l = parTaille[n]; if (l.length < 3) return;
      reps.push({ type: 'schema', tags: 'enfants nombre fratrie taille', label: n + ' enfants, dans ' + l.length + ' familles', desc: l.slice(0, 6).map(function (k) { return k.split('+').map(function (id) { return nom(S.people[id]); }).join(' et '); }).join(' ; ') + '.', ids: [].concat.apply([], l.map(function (k) { return k.split('+').concat(fratries[k].map(function (e) { return e.id; })); })) });
    });
    // 6. Métiers : la rupture après une longue lignée, et le métier qui saute une génération
    chaine(function (pa, en) { return pa && en && pa.sex === en.sex && cleMetier(pa) && cleMetier(pa) === cleMetier(en) && cleMetier(pa) !== 'foyer'; }).forEach(function (l) {
      var jeune0 = S.people[l[0]], m0 = norm(jeune0.metier);
      (enfantsDe[jeune0.id] || []).map(function (e) { return S.people[e]; }).filter(function (e) { return e.sex === jeune0.sex && e.metier && cleMetier(e) !== cleMetier(jeune0); }).forEach(function (e) {
        reps.push({ type: 'metier', fort: l.length >= 3, tags: 'metier rupture lignee descendant change', label: 'Une rupture après ' + l.length + ' générations de ' + m0, desc: nomA(e) + ' devient « ' + e.metier + ' », alors que ' + l.map(function (id) { return nom(S.people[id]); }).reverse().join(', ') + ' étaient ' + m0 + '.', ids: l.concat([e.id]) });
      });
    });
    var sauts = [];
    liste.forEach(function (gp) {
      var kg = cleMetier(gp); if (!kg || kg === 'foyer') return;
      (enfantsDe[gp.id] || []).forEach(function (pid) {
        var pm = S.people[pid]; if (!pm || !pm.metier || cleMetier(pm) === kg) return;
        (enfantsDe[pid] || []).forEach(function (eid) { var e = S.people[eid]; if (e && cleMetier(e) === kg) sauts.push({ txt: nom(gp) + ' et ' + nom(e) + ' : ' + norm(gp.metier) + ' (' + nom(pm) + ' : ' + pm.metier + ')', ids: [gp.id, pm.id, e.id] }); });
      });
    });
    if (sauts.length) reps.push({ type: 'metier', tags: 'metier saute generation grand-parent petit-enfant ascendant descendant', label: 'Un métier qui saute une génération' + (sauts.length > 1 ? ', ' + sauts.length + ' fois' : ''), desc: sauts.slice(0, 5).map(function (x) { return x.txt; }).join(' ; ') + '.', ids: [].concat.apply([], sauts.map(function (x) { return x.ids; })) });

    /* ── Pistes issues des notions publiques de psychogénéalogie (formulées pour Genesolia) ── */
    function plein(d) { return /^\d{4}-\d{2}-\d{2}$/.test(String(d || '')); }
    function enJours(d) { var m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/); return Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5; }
    function freres(id) { var l = []; (parentsDe[id] || []).forEach(function (pa) { (enfantsDe[pa] || []).forEach(function (e) { if (e !== id && l.indexOf(e) < 0) l.push(e); }); }); return l; }
    function procheDe(g) {   // parents, grands-parents, frères et sœurs, oncles et tantes
      var l = [], add = function (x) { if (x && x !== g && l.indexOf(x) < 0) l.push(x); };
      (parentsDe[g] || []).forEach(function (pa) { add(pa); (parentsDe[pa] || []).forEach(add); freres(pa).forEach(add); });
      freres(g).forEach(add);
      return l;
    }
    // 7. Conçu·e pendant un deuil : décès d'un proche entre 12 mois avant la conception estimée (naissance − 266 jours) et la naissance
    var concus = [];
    liste.forEach(function (g) {
      var an = annee(g.naiss); if (!an) return;
      procheDe(g.id).forEach(function (did) {
        var d = S.people[did], ad = annee(d.deces); if (!ad) return;
        var ok, quand;
        if (plein(g.naiss) && plein(d.deces)) {
          var nj = enJours(g.naiss), dj = enJours(d.deces), conc = nj - 266;
          ok = dj >= conc - 365 && dj <= nj;
          quand = dj < conc ? Math.max(1, Math.round((conc - dj) / 30.4)) + ' mois avant sa conception' : 'pendant la grossesse';
        } else { ok = ad === an || ad === an - 1; quand = ad === an ? 'l’année de sa naissance' : 'l’année avant sa naissance'; }
        if (ok && ad <= an) concus.push({ g: g, d: d, txt: nomA(g) + ' : ' + nom(d) + ' ' + (d.sex === 'f' ? 'décédée' : 'décédé') + ' ' + quand, proche: (parentsDe[g.id] || []).indexOf(did) >= 0 || freres(g.id).indexOf(did) >= 0 });
      });
    });
    if (concus.length) reps.push({ type: 'gisant', qk: 'conception', fort: concus.some(function (x) { return x.proche; }), tags: 'conception concu deuil grossesse projet sens',
      label: 'Conçu·e pendant un deuil' + (concus.length > 1 ? ', ' + concus.length + ' fois' : ''), desc: concus.slice(0, 6).map(function (x) { return x.txt; }).join(' ; ') + '.',
      ids: [].concat.apply([], concus.map(function (x) { return [x.g.id, x.d.id]; })) });
    // 8. Un enfant qui naît après la perte d'un frère ou d'une sœur (dans les 24 mois)
    function libPerte(p, min) { var t = p.grossesse === 'fc' ? 'une fausse couche' : 'un enfant mort-né'; return nomComplet(p) ? nomComplet(p) + ' (' + t + ')' : min ? t : t.charAt(0).toUpperCase() + t.slice(1); }
    liste.forEach(function (g) {
      var an = annee(g.naiss); if (!an || petit(g)) return;
      freres(g.id).forEach(function (sid) {
        var sb = S.people[sid]; if (petit(sb) && !perte(sb)) return;
        var pt = perte(sb), dFin = sb.deces || (pt ? sb.naiss : ''), ad = pt ? 0 : ageDeces(sb), fin = annee(dFin); if (!fin || ad == null || ad >= 18) return;
        var ecart = plein(g.naiss) && plein(dFin) ? (enJours(g.naiss) - enJours(dFin)) / 30.4 : (an - fin) * 12;
        if (ecart < 0 || ecart > 24) return;
        var memeSexe = g.sex && g.sex === sb.sex, memeNom = morceaux(g).some(function (t) { return morceaux(sb).some(function (u) { return racine(t) === racine(u); }); });
        reps.push({ type: 'gisant', qk: 'remplacement', fort: !!(memeSexe || memeNom), tags: 'enfant remplacement frere soeur perte' + (pt ? ' fausse couche mort-ne grossesse' : ''),
          label: 'Né' + (g.sex === 'f' ? 'e' : '') + ' après la perte d’un' + (sb.sex === 'f' ? 'e sœur' : sb.sex === 'm' ? ' frère' : ' frère ou d’une sœur') + ' : ' + nom(g),
          desc: (pt ? libPerte(sb) + ' en ' + fin : nom(sb) + ' est ' + (sb.sex === 'f' ? 'décédée' : 'décédé') + (ad < 1 ? ' avant 1 an' : ' à ' + ad + ' an' + (ad > 1 ? 's' : '')) + ' en ' + fin) + ', puis ' + nomA(g) + ' arrive ' + (ecart < 1 ? 'quelques semaines après' : Math.round(ecart) + ' mois après') + (memeSexe ? ', du même sexe' : '') + (memeNom ? ', avec un prénom proche' : '') + '.', ids: [sb.id, g.id] });
      });
    });
    // 9. La perte du premier enfant, à plusieurs générations
    var premiers = [];
    Object.keys(fratries).forEach(function (k) {
      var dN = function (e) { return e.naiss || (perte(e) ? e.deces : ''); };
      var f = fratries[k].filter(function (e) { return annee(dN(e)); }).sort(function (x, y) { return (annee(dN(x)) - annee(dN(y))) || (plein(dN(x)) && plein(dN(y)) ? enJours(dN(x)) - enJours(dN(y)) : 0); });
      if (f.length < 2) return; var e0 = f[0], ad = ageDeces(e0);
      if (perte(e0)) premiers.push({ txt: k.split('+').map(function (id) { return nom(S.people[id]); }).join(' et ') + ' perdent leur premier enfant : ' + libPerte(e0, true), ids: k.split('+').concat([e0.id]) });
      else if ((ad != null && ad < 18) || a(e0, 'deces-precoce')) premiers.push({ txt: k.split('+').map(function (id) { return nom(S.people[id]); }).join(' et ') + ' perdent leur premier enfant, ' + nom(e0) + (ad != null ? ' (' + (ad < 1 ? 'moins d’un an' : ad + ' an' + (ad > 1 ? 's' : '')) + ')' : ''), ids: k.split('+').concat([e0.id]) });
    });
    if (premiers.length >= 2) reps.push({ type: 'depart', qk: 'premier', fort: premiers.length >= 3, tags: 'premier enfant aine perte deces', label: 'La perte du premier enfant, ' + premiers.length + ' fois', desc: premiers.map(function (x) { return x.txt; }).join(' ; ') + '.', ids: [].concat.apply([], premiers.map(function (x) { return x.ids; })) });
    // 10. Le même âge pour devenir parent, sur 3 générations ou plus
    function agePremier(p) { var an = annee(p && p.naiss); if (!an) return null; var e = (enfantsDe[p.id] || []).map(function (x) { return annee(S.people[x].naiss); }).filter(Boolean); return e.length ? Math.min.apply(null, e) - an : null; }
    chaine(function (pa, en) { var x = agePremier(pa), y = agePremier(en); return x != null && y != null && x >= 14 && y >= 14 && Math.abs(x - y) <= 2; }).forEach(function (l) {
      reps.push({ type: 'schema', qk: 'ageparent', tags: 'age parent premier enfant devenir mere pere', label: 'Parent au même âge, sur ' + l.length + ' générations', desc: l.map(function (id) { var p = S.people[id]; return nom(p) + ' : ' + agePremier(p) + ' ans'; }).reverse().join(' → ') + '.', ids: l });
    });
    // 11. Contexte historique : les hommes en âge d'être mobilisés pendant les guerres
    var GUERRES = [[1870, 1871, 'la guerre de 1870'], [1914, 1918, 'la Première Guerre mondiale'], [1939, 1945, 'la Seconde Guerre mondiale'], [1946, 1954, 'la guerre d’Indochine'], [1954, 1962, 'la guerre d’Algérie']];
    var mobil = [];
    GUERRES.forEach(function (gu) {
      var l = liste.filter(function (p) { var an = annee(p.naiss), fin = annee(p.deces); return p.sex === 'm' && !petit(p) && an && an + 18 <= gu[1] && an + 45 >= gu[0] && (!fin || fin >= gu[0]); });
      if (l.length) mobil.push({ txt: gu[2] + ' : ' + l.slice(0, 8).map(function (p) { return nom(p) + ' (' + (Math.max(gu[0], annee(p.naiss) + 18) - annee(p.naiss)) + ' ans en ' + Math.max(gu[0], annee(p.naiss) + 18) + ')'; }).join(', ') + (l.length > 8 ? '…' : ''), ids: l.map(function (p) { return p.id; }) });
    });
    if (mobil.length) reps.push({ type: 'epreuve', qk: 'guerre', tags: 'guerre histoire mobilise contexte socio', label: 'En âge d’être mobilisés', desc: mobil.map(function (x) { return x.txt; }).join(' ; ') + '. Ce n’est qu’une question d’âge : que sait-on de ce qu’ils ont vécu ?', ids: [].concat.apply([], mobil.map(function (x) { return x.ids; })) });
    // 12. Zones d'ombre : un grand écart dans une fratrie, un ancêtre direct sans aucune date
    var ombres = [], idsO = [];
    Object.keys(fratries).forEach(function (k) {
      var f = fratries[k].filter(function (e) { return annee(e.naiss); }).sort(function (x, y) { return annee(x.naiss) - annee(y.naiss); });
      for (var i = 1; i < f.length; i++) { var ec = annee(f[i].naiss) - annee(f[i - 1].naiss); if (ec > 6) { ombres.push(ec + ' ans entre ' + nom(f[i - 1]) + ' et ' + nom(f[i])); idsO.push(f[i - 1].id, f[i].id); } }
    });
    var sansDate = liste.filter(function (p) { return !p.naiss && !p.deces && (enfantsDe[p.id] || []).length && (!moi || !!lienDe(p.id)); });
    if (sansDate.length) { ombres.push('aucune date pour ' + sansDate.slice(0, 6).map(nom).join(', ') + (sansDate.length > 6 ? '…' : '')); sansDate.forEach(function (p) { idsO.push(p.id); }); }
    if (ombres.length) reps.push({ type: 'schema', qk: 'ombre', tags: 'zone ombre secret ecart fratrie manque date inconnu', label: 'Des zones d’ombre à explorer', desc: ombres.slice(0, 6).join(' ; ') + '. Ce sont des questions, pas des conclusions.', ids: idsO });

    /* ── Argent et trajectoire sociale (loyautés invisibles, transfuge de classe : notions publiques) ── */
    var PERTES = ['faillite', 'pauvrete', 'perte-emploi', 'declassement'];
    function evtsDe(p, types) { return (p.events || []).filter(function (e) { return types.indexOf(e.type) >= 0; }).map(function (e) { var ag = parseInt(e.age, 10), an = annee(p.naiss); return { type: e.type, age: isNaN(ag) ? null : ag, an: !isNaN(ag) && an ? an + ag : null }; }); }
    function libE(t) { return (NOM_EVT[t] || t).toLowerCase(); }
    function ancetresDe(id) { var acc = {}; (function up(x) { (parentsDe[x] || []).forEach(function (pa) { if (!acc[pa]) { acc[pa] = 1; up(pa); } }); })(id); return acc; }
    // 13. Des pertes d'argent sur plusieurs générations de la même lignée
    chaine(function (pa, en) { return pa && en && evtsDe(pa, PERTES).length && evtsDe(en, PERTES).length; }, 2).forEach(function (l) {
      reps.push({ type: 'epreuve', qk: 'argent', fort: l.length >= 3, tags: 'argent perte faillite pauvrete lignee generation',
        label: 'Des pertes d’argent sur ' + l.length + ' générations', desc: l.map(function (id) { var p = S.people[id]; return nom(p) + ' (' + evtsDe(p, PERTES).map(function (e) { return libE(e.type) + (e.age != null ? ' à ' + e.age + ' ans' : ''); }).join(', ') + ')'; }).reverse().join(' → ') + '.', ids: l });
    });
    // 14. Un revers d'argent au même âge, dans la même lignée (et quand tu approches de cet âge)
    var avecAge = [];
    liste.forEach(function (p) { evtsDe(p, PERTES).forEach(function (e) { if (e.age != null) avecAge.push({ p: p, e: e }); }); });
    var memesAges = [];
    avecAge.forEach(function (x) {
      var anc = ancetresDe(x.p.id);
      avecAge.forEach(function (y) { if (y.p.id !== x.p.id && anc[y.p.id] && Math.abs(y.e.age - x.e.age) <= 2) memesAges.push(nom(y.p) + ' (' + libE(y.e.type) + ' à ' + y.e.age + ' ans) puis ' + nom(x.p) + ' (' + libE(x.e.type) + ' à ' + x.e.age + ' ans)'), memesAges.ids = (memesAges.ids || []).concat([x.p.id, y.p.id]); });
    });
    if (memesAges.length) reps.push({ type: 'epreuve', qk: 'reversage', fort: true, tags: 'argent revers meme age anniversaire perte', label: 'Un revers d’argent au même âge', desc: memesAges.slice(0, 4).join(' ; ') + '.', ids: memesAges.ids });
    if (moi && ageActuel(moi) != null) {
      var ancM = ancetresDe(moi.id), ageM = ageActuel(moi);
      avecAge.filter(function (x) { return ancM[x.p.id] && x.e.age - ageM >= 0 && x.e.age - ageM <= 2; }).forEach(function (x) {
        reps.push({ type: 'anniversaire', qk: 'reversage', tags: 'argent revers age approche anniversaire', label: 'Tu approches d’un âge sensible : ' + x.e.age + ' ans', desc: 'Tu as ' + ageM + ' ans. ' + nom(x.p) + ' a vécu « ' + libE(x.e.type) + ' » à ' + x.e.age + ' ans. Ce n’est pas une prédiction : juste un repère à regarder avec douceur.', ids: [moi.id, x.p.id] });
      });
    }
    // 15. Un héritage conflictuel, puis une rupture dans les 5 ans (chez la personne ou ses frères et sœurs)
    liste.forEach(function (p) {
      evtsDe(p, ['heritage']).forEach(function (h) {
        if (h.an == null) return;
        var qui = [p.id].concat(freres(p.id)), ruptures = [];
        qui.forEach(function (id) { var q = S.people[id]; evtsDe(q, ['rupture']).forEach(function (r) { if (r.an != null && r.an >= h.an && r.an - h.an <= 5) ruptures.push(nom(q) + ' en ' + r.an); }); });
        if (ruptures.length) reps.push({ type: 'epreuve', qk: 'heritage', tags: 'argent heritage rupture partage dette famille', label: 'Un héritage, puis une rupture', desc: 'Héritage conflictuel pour ' + nom(p) + ' vers ' + h.an + ', puis une séparation : ' + ruptures.join(', ') + '.', ids: qui });
      });
    });
    // 16. Monter, puis redescendre : une ascension suivie d'une perte dans les 15 ans (la personne ou ses enfants)
    liste.forEach(function (p) {
      evtsDe(p, ['ascension']).forEach(function (asc) {
        if (asc.an == null) return;
        var apres = [];
        [p.id].concat(enfantsDe[p.id] || []).forEach(function (id) { var q = S.people[id]; evtsDe(q, PERTES).forEach(function (e) { if (e.an != null && e.an > asc.an && e.an - asc.an <= 15) apres.push(nom(q) + ' : ' + libE(e.type) + ' vers ' + e.an); }); });
        if (apres.length) reps.push({ type: 'schema', qk: 'ascension', fort: true, tags: 'argent ascension sociale declassement transfuge redescendre', label: 'Monter, puis redescendre', desc: nom(p) + ' connaît une ascension sociale vers ' + asc.an + ', puis ' + apres.join(' ; ') + '.', ids: [p.id].concat(enfantsDe[p.id] || []) });
      });
    });
    // 17. Un revers d'argent dans les 2 ans qui suivent la mort d'un parent
    var reversDeuil = [];
    liste.forEach(function (g) {
      evtsDe(g, PERTES).forEach(function (e) {
        if (e.an == null) return;
        (parentsDe[g.id] || []).forEach(function (pid) { var pa = S.people[pid], ad = annee(pa.deces); if (ad && e.an >= ad && e.an - ad <= 2) reversDeuil.push({ txt: nom(g) + ' : ' + libE(e.type) + ' vers ' + e.an + ', ' + (e.an === ad ? 'l’année de' : (e.an - ad) + ' an' + (e.an - ad > 1 ? 's' : '') + ' après') + ' la mort de ' + nom(pa), ids: [g.id, pid] }); });
      });
    });
    if (reversDeuil.length) reps.push({ type: 'gisant', qk: 'reversdeuil', tags: 'argent revers deuil parent perte emploi', label: 'Un revers d’argent après un deuil' + (reversDeuil.length > 1 ? ', ' + reversDeuil.length + ' fois' : ''), desc: reversDeuil.map(function (x) { return x.txt; }).join(' ; ') + '.', ids: [].concat.apply([], reversDeuil.map(function (x) { return x.ids; })) });

    // Questions pour réfléchir, selon la piste
    var QUESTIONS = {
      anniversaire: ['Que se passe-t-il dans ta vie en ce moment ?', 'Que sais-tu de ce que cette personne vivait à cet âge ?'],
      gisant: ['Ce décès a-t-il pu être pleuré, ou n’en parlait-on pas ?', 'Qui a choisi les prénoms à cette période, et pourquoi ?'],
      conception: ['Que traversait la famille quand cet enfant a été attendu ?', 'Comment cette naissance a-t-elle été accueillie, en plein deuil ?'],
      remplacement: ['Cet enfant a-t-il été comparé à celui ou celle qui manquait ?', 'Qu’a-t-on raconté de l’enfant perdu ?'],
      premier: ['Comment la famille parlait-elle de ce premier enfant ?', 'Quelle place a pris l’enfant suivant ?'],
      ageparent: ['Comment l’âge de devenir parent s’est-il décidé à chaque génération ?', 'Et toi, comment te situes-tu par rapport à cet âge ?'],
      guerre: ['Qu’a-t-on raconté de cette période dans ta famille ?', 'Qui est parti, qui est resté, qui est revenu changé ?'],
      ombre: ['Qui pourrait en savoir plus : cousins, voisins, archives ?', 'Sur quels sujets t’a-t-on répondu de façon évasive ?'],
      cousins: ['Que sais-tu de ces deux branches avant qu’elles ne se rejoignent ?', 'Qu’est-ce qui comptait, dans cette famille, au moment de choisir un conjoint ?'],
      depart: ['Ces départs ont-ils pu être pleurés ?', 'Quelqu’un a-t-il pris la place laissée vide ?'],
      date: ['Comment cette date est-elle vécue dans ta famille ?', 'Te sens-tu différent·e à cette période de l’année ?'],
      epreuve: ['Comment cet événement a-t-il été raconté à chaque génération ?', 'Où en es-tu, toi, avec ce type d’événement ?'],
      schema: ['Te reconnais-tu dans cette façon de faire ?', 'Qu’est-ce que cela a protégé, autrefois ?'],
      enfants: ['Attendait-on plutôt une fille ou un garçon ?', 'Quelle place avait chacun selon son rang ?'],
      metier: ['Ce métier a-t-il été choisi, ou s’est-il imposé ?', 'Quel métier aurait-on rêvé d’exercer ?'],
      prenom: ['Qui a choisi ce prénom, et pour quelle raison ?', 'Qu’évoque ce prénom dans ta famille ?'],
      argent: ['Comment parlait-on de ces pertes à la maison ?', 'Quelle idée de la sécurité as-tu gardée de ces histoires ?'],
      reversage: ['Que sais-tu de cette période de sa vie ?', 'Qu’est-ce qui rend ta situation différente de la sienne ?'],
      heritage: ['Qu’est-ce qui s’est joué dans ce partage, au-delà de l’argent ?', 'Quelle place cette histoire donne-t-elle à chacun aujourd’hui ?'],
      ascension: ['Comment la famille a-t-elle vécu cette réussite, puis ce revers ?', 'Dans quel milieu te sens-tu chez toi ?'],
      reversdeuil: ['Quel soutien cette personne représentait-elle ?', 'Sur quoi peux-tu t’appuyer aujourd’hui ?']
    };
    // L'article du blog qui explique chaque piste
    var A = function (u, t) { return { u: u, t: t }; };
    var ARTICLES = {
      anniversaire: A('syndrome-anniversaire.html', 'Le syndrome d’anniversaire'), date: A('syndrome-anniversaire.html', 'Le syndrome d’anniversaire'),
      gisant: A('syndrome-du-gisant.html', 'Le syndrome du gisant'), conception: A('projet-sens-conception-deuil.html', 'Le projet sens'),
      remplacement: A('enfant-de-remplacement.html', 'L’enfant de remplacement'), premier: A('deuil-non-fait-mort-jeune.html', 'Le deuil non fait'),
      depart: A('deuil-non-fait-mort-jeune.html', 'Le deuil non fait'), ageparent: A('devenir-parent-au-meme-age.html', 'Les âges qui se répondent'),
      guerre: A('guerre-et-memoire-familiale.html', 'La guerre dans l’arbre'), ombre: A('secret-de-famille.html', 'Les secrets de famille'),
      cousins: A('implexe-mariage-entre-cousins.html', 'L’implexe et les mariages entre cousins'), epreuve: A('memoire-transgenerationnelle.html', 'La mémoire transgénérationnelle'),
      schema: A('loyaute-familiale-invisible.html', 'Les loyautés invisibles'), enfants: A('filles-garcons-fratrie.html', 'Filles, garçons et fratries'),
      metier: A('metiers-transmis-genealogie.html', 'Les métiers de famille'), prenom: A('prenom-transmis-psychogenealogie.html', 'Les prénoms transmis'),
      argent: A('argent-et-lignee.html', 'Argent et histoire familiale'), reversage: A('argent-et-lignee.html', 'Argent et histoire familiale'),
      heritage: A('argent-et-lignee.html', 'Argent et histoire familiale'), ascension: A('argent-et-lignee.html', 'Argent et histoire familiale'),
      reversdeuil: A('argent-et-lignee.html', 'Argent et histoire familiale'), secret: A('secret-de-famille.html', 'Les secrets de famille'),
      ageevt: A('devenir-parent-au-meme-age.html', 'Les âges qui se répondent')
    };
    reps.forEach(function (r) {
      var k = r.qk || (/secret|non-dit/i.test(r.label) ? 'secret' : /au même âge/.test(r.label) ? 'ageevt' : '') || (/cousins/.test(r.label) ? 'cousins' : /fratries|enfants, dans/.test(r.label) ? 'enfants' : r.type);
      r.q = QUESTIONS[k] || null;
      r.art = ARTICLES[k] || null;
    });

    // Mots-clés pour la recherche dans le panneau
    var TAGS = { anniversaire: 'syndrome anniversaire age', gisant: 'gisant syndrome deces naissance memoire', depart: 'mort jeune deces precoce depart', date: 'date anniversaire jour', epreuve: 'evenement epreuve', schema: 'schema', metier: 'metier profession lignee', prenom: 'prenom' };
    reps.forEach(function (r) { r.tags = (r.tags ? r.tags + ' ' : '') + (TAGS[r.type] || '') + (/cousins/.test(r.label) ? ' cousins implexe mariage consanguin' : ''); });

    // Les répétitions les plus évidentes en premier, en rouge ; les prénoms isolés en dernier
    var ORDRE = { anniversaire: 1, gisant: 2, schema: 3, depart: 4, date: 5, epreuve: 6, metier: 7, prenom: 8 };
    reps.forEach(function (r, i) {
      if (r.type === 'anniversaire' || (r.type === 'gisant' && /fois$/.test(r.label))) r.fort = true;
      if (r.fort) r.c = ROUGE; else if (!r.c) r.c = COUL[r.type];
      r.rang = (r.fort ? 0 : 10) + (ORDRE[r.type] || 9) + i / 1000;
    });
    reps.sort(function (x, y) { return x.rang - y.rang; });
    // Un prénom seul qui revient n'apprend pas grand-chose dans un grand arbre : on n'en garde que 3
    var nbPrenoms = 0;
    reps = reps.filter(function (r) { return !(r.type === 'prenom' && !r.fort && ++nbPrenoms > 3); });
    reps.forEach(function (r, i) { r.cle = r.type + ':' + r.ids.slice().sort().join(',') + ':' + i; });
    return reps;
  }

  /* ───────── Dessin ───────── */
  function symbole(p, rayon) {
    var r = rayon;
    if (p.sex === 'm') return '<rect x="' + (-r) + '" y="' + (-r) + '" width="' + (2 * r) + '" height="' + (2 * r) + '" rx="3"';
    if (p.sex === 'f') return '<circle r="' + r + '"';
    return '<path d="M0 ' + (-r - 4) + 'L' + (r + 4) + ' 0L0 ' + (r + 4) + 'L' + (-r - 4) + ' 0Z"';
  }
  // contour d'une personne : petit rond (fausse couche, IVG), triangle (grossesse en cours) ou symbole du sexe
  function forme(p, r) {
    if (p.grossesse === 'fc' || p.grossesse === 'ivg') return '<circle r="' + r + '"';
    if (p.grossesse === 'encours') return '<path d="M0 ' + (-r - 2) + 'L' + (r + 2) + ' ' + (r * 0.85) + 'L' + (-r - 2) + ' ' + (r * 0.85) + 'Z"';
    return symbole(p, r);
  }
  function hautSymbole(id) { var p = S.people[id]; if (!p) return R; return petit(p) ? RP + (p.grossesse === 'encours' || p.sex === 'u' ? 3 : 0) : R + (p.sex === 'u' ? 4 : 0); }
  function dessinPetit(p) {
    var g = p.grossesse, x = RP * 0.72, croix = function (d, l) { return '<path d="M' + (-d) + ' ' + (-d) + 'L' + d + ' ' + d + 'M' + d + ' ' + (-d) + 'L' + (-d) + ' ' + d + '" stroke="' + PRUNE + '" stroke-width="' + l + '" stroke-linecap="round"/>'; };
    if (g === 'fc') return '<circle r="' + (RP * 0.75) + '" fill="' + PRUNE + '" stroke="' + PRUNE + '" stroke-width="1.6"/>';
    if (g === 'ivg') return croix(RP * 0.7, 2.2);
    if (g === 'encours') return forme(p, RP) + ' fill="#FFFFFF" stroke="' + PRUNE + '" stroke-width="1.8" stroke-linejoin="round"/>';
    return symbole(p, RP) + ' fill="#FFFFFF" stroke="' + PRUNE + '" stroke-width="1.6"/>' + croix(p.sex === 'm' ? RP : x, 1.4);   // mort-né
  }
  function dessinPersonne(p, pos, o) {
    var moi = p.role === 'moi', sel = o.sel === p.id, att = o.attenue && o.attenue.indexOf(p.id) < 0;
    var lien = lienDe(p.id), pt = petit(p), rr = pt ? RP : R;
    var nom = nomComplet(p);
    var h = '<g class="personne" data-id="' + esc(p.id) + '" transform="translate(' + pos.x + ',' + pos.y + ')"' + (o.export ? '' : ' tabindex="0" role="button" aria-label="' + esc((nom || (pt ? GROSS[p.grossesse] : '') || lien || 'Personne sans prénom') + (lien && nom ? ', ' + lien : '')) + '"') + (att ? ' opacity=".22"' : '') + '>';
    if (!o.export) h += '<rect class="zone-clic" x="' + (-SLOT / 2 + 6) + '" y="' + (-R - 10) + '" width="' + (SLOT - 12) + '" height="' + (BAS_TEXTE + R + 12) + '" fill="transparent"/>';
    if (sel) h += forme(p, rr + 9) + ' class="halo" fill="none" stroke="' + CORAIL + '" stroke-width="3"/>';
    else if (!o.export) h += forme(p, rr + 9) + ' class="halo" fill="none" stroke="' + PRUNE + '" stroke-opacity="0" stroke-width="2"/>';
    if (pt) {
      h += dessinPetit(p);
      if (o.badges && o.badges[p.id]) o.badges[p.id].slice(0, 4).forEach(function (c, i) { h += '<circle cx="' + (RP + 9) + '" cy="' + (-RP + 4 + i * 12) + '" r="5" fill="' + c + '" stroke="#fff" stroke-width="1.5"/>'; });
      var yp = RP + 19, anP = annee(p.naiss) || annee(p.deces);
      h += '<text y="' + yp + '" text-anchor="middle" font-family="\'Gilda Display\',Georgia,serif" font-size="14" fill="' + (nom ? PRUNE : PRUNE_DOUX) + '"' + (nom ? '' : ' font-style="italic"') + '>' + esc(couper(nom || GROSS[p.grossesse], 19)) + '</text>';
      if (nom) { yp += 15; h += '<text y="' + yp + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="11" font-style="italic" fill="' + PRUNE_DOUX + '">' + esc(GROSS[p.grossesse].toLowerCase()) + '</text>'; }
      if (anP) { yp += 15; h += '<text y="' + yp + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="11.5" fill="' + PRUNE_DOUX + '">' + anP + '</text>'; }
      return h + '</g>';
    }
    if (moi) h += symbole(p, R + 5) + ' fill="none" stroke="' + PRUNE + '" stroke-width="1.6"/>';
    h += symbole(p, R) + ' fill="' + (moi ? '#FBE6EA' : '#FFFFFF') + '" stroke="' + PRUNE + '" stroke-width="1.8"/>';
    if (decede(p)) {
      var d = p.sex === 'f' ? R * 0.7 : p.sex === 'm' ? R : R * 0.72;
      h += '<path d="M' + (-d) + ' ' + (-d) + 'L' + d + ' ' + d + 'M' + d + ' ' + (-d) + 'L' + (-d) + ' ' + d + '" stroke="' + PRUNE + '" stroke-width="1.6" stroke-linecap="round"/>';
    } else {
      var age = ageActuel(p);
      if (age != null) h += '<text y="5" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="14" font-weight="600" fill="' + PRUNE + '">' + age + '</text>';
    }
    if (o.badges && o.badges[p.id]) {
      o.badges[p.id].slice(0, 4).forEach(function (c, i) { h += '<circle cx="' + (R + 9) + '" cy="' + (-R + 4 + i * 12) + '" r="5" fill="' + c + '" stroke="#fff" stroke-width="1.5"/>'; });
    }
    var y = R + 19;
    h += '<text y="' + y + '" text-anchor="middle" font-family="\'Gilda Display\',Georgia,serif" font-size="15" fill="' + (nom ? PRUNE : PRUNE_DOUX) + '"' + (nom ? '' : ' font-style="italic"') + '>' + esc(couper(nom || 'Sans prénom', 19)) + '</text>';
    var dt = texteDates(p);
    if (dt) { y += 16; h += '<text y="' + y + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="11.5" fill="' + PRUNE_DOUX + '">' + esc(dt) + '</text>'; }
    if (p.metier) { y += 15; h += '<text y="' + y + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="11" font-style="italic" fill="' + CHAMPAGNE + '">' + esc(couper(p.metier, 22)) + '</text>'; }
    var place = p.place ? (p.sex === 'f' ? 'placée' : p.sex === 'm' ? 'placé' : 'placé·e') : '';
    if (lien || place) { y += 15; h += '<text y="' + y + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="9.5" font-weight="600" letter-spacing=".08em" fill="' + PRUNE_DOUX + '">' + esc(lien.toUpperCase()) + (place ? (lien ? ' · ' : '') + '<tspan fill="' + CHAMPAGNE + '">' + esc(place.toUpperCase()) + '</tspan>' : '') + '</text>'; }
    return h + '</g>';
  }

  function dessinLiens(pl) {
    var pos = pl.pos, h = '';
    var trait = ' stroke="' + PRUNE + '" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"';
    // couples
    pl.couples.forEach(function (r) {
      var a = pos[r.from], b = pos[r.to]; if (!a || !b) return;
      var g = a.x <= b.x ? a : b, d = a.x <= b.x ? b : a;
      if (a.y === b.y) {
        var x1 = g.x + R + 2, x2 = d.x - R - 2, y = g.y;
        h += '<path d="M' + x1 + ' ' + y + 'H' + x2 + '"' + trait + (r.statut === 'union' ? ' stroke-dasharray="6 5"' : '') + '/>';
        var m = (x1 + x2) / 2;
        if (r.statut === 'separe' || r.statut === 'divorce') h += '<path d="M' + (m - 4) + ' ' + (y + 9) + 'L' + (m + 4) + ' ' + (y - 9) + '"' + trait + '/>';
        if (r.statut === 'divorce') h += '<path d="M' + (m + 4) + ' ' + (y + 9) + 'L' + (m + 12) + ' ' + (y - 9) + '"' + trait + '/>';
      } else {
        h += '<path d="M' + a.x + ' ' + a.y + 'L' + b.x + ' ' + b.y + '"' + trait + ' stroke-dasharray="3 4"/>';
      }
    });
    // familles : niveau de barre pour éviter que deux familles voisines se confondent
    var infos = pl.familles.map(function (fa) {
      var enfs = fa.enfants.filter(function (c) { return pos[c]; });
      var ps = fa.parents.filter(function (p) { return pos[p]; });
      var xs = enfs.map(function (c) { return pos[c].x; });
      if (ps.length >= 2) xs.push((pos[ps[0]].x + pos[ps[1]].x) / 2); else if (ps.length === 1) xs.push(pos[ps[0]].x);
      return { fa: fa, enfs: enfs, ps: ps, x1: Math.min.apply(null, xs), x2: Math.max.apply(null, xs), y: enfs.length ? Math.min.apply(null, enfs.map(function (c) { return pos[c].y; })) : 0, niveau: 0 };
    }).filter(function (i) { return i.enfs.length; });
    var parY = {};
    infos.forEach(function (i) { (parY[i.y] = parY[i.y] || []).push(i); });
    Object.keys(parY).forEach(function (y) {
      var fins = [];
      parY[y].sort(function (a, b) { return a.x1 - b.x1; }).forEach(function (i) {
        var n = 0; while (fins[n] != null && fins[n] > i.x1 - 14) n++;
        i.niveau = n; fins[n] = i.x2;
      });
    });
    var jumDessines = {};
    infos.forEach(function (inf) {
      var fa = inf.fa, enfs = inf.enfs, ps = inf.ps;
      // jumeaux de cette fratrie : leurs traits partent d'un même point de la ligne (en V)
      var jum = {};
      enfs.forEach(function (c) { var t = jumeauDe(c); if (t && enfs.indexOf(t) >= 0 && pos[t].y === pos[c].y) { jum[c] = (pos[c].x + pos[t].x) / 2; jumDessines[c] = jumDessines[t] = 1; } });
      var barre = inf.y - R - 22 - inf.niveau * 14 - (Object.keys(jum).length ? 16 : 0);
      var xs = enfs.map(function (c) { return jum[c] != null ? jum[c] : pos[c].x; });
      var ancre = null, depart = null;
      if (ps.length >= 2) {
        var p1 = pos[ps[0]], p2 = pos[ps[1]];
        ancre = (p1.x + p2.x) / 2;
        depart = p1.y === p2.y ? p1.y : Math.max(p1.y, p2.y) + R;
        if (!relCouple(ps[0], ps[1]) && p1.y === p2.y) h += '<path d="M' + (Math.min(p1.x, p2.x) + R + 2) + ' ' + p1.y + 'H' + (Math.max(p1.x, p2.x) - R - 2) + '"' + trait + ' stroke-dasharray="2 5"/>';
      } else if (ps.length === 1) {
        ancre = pos[ps[0]].x; depart = pos[ps[0]].y + BAS_TEXTE + 4;
      }
      var x1 = Math.min.apply(null, xs), x2 = Math.max.apply(null, xs);
      if (ancre != null) {
        if (depart > barre) barre = depart + 10;
        h += '<path d="M' + ancre + ' ' + depart + 'V' + barre + '"' + trait + '/>';
        x1 = Math.min(x1, ancre); x2 = Math.max(x2, ancre);
      }
      if (x2 > x1) h += '<path d="M' + x1 + ' ' + barre + 'H' + x2 + '"' + trait + '/>';
      enfs.forEach(function (c) {
        var p = pos[c], bas = p.y - hautSymbole(c) - 1, pointille = S.people[c].adopte ? ' stroke-dasharray="4 4"' : '';
        if (jum[c] != null) h += '<path d="M' + jum[c] + ' ' + barre + 'L' + p.x + ' ' + bas + '"' + trait + pointille + '/>';
        else h += '<path d="M' + p.x + ' ' + barre + 'V' + bas + '"' + trait + pointille + '/>';
      });
    });
    // jumeaux qui ne sont pas dans la même fratrie dessinée : un petit lien « jumeaux » entre eux
    Object.keys(pos).forEach(function (c) {
      var t = jumeauDe(c); if (!t || !pos[t] || jumDessines[c] || jumDessines[t] || c > t) return;
      var a = pos[c], b = pos[t], my = Math.min(a.y, b.y) - R - 34;
      h += '<path d="M' + a.x + ' ' + (a.y - hautSymbole(c) - 2) + 'Q' + ((a.x + b.x) / 2) + ' ' + my + ' ' + b.x + ' ' + (b.y - hautSymbole(t) - 2) + '"' + trait + ' stroke-dasharray="2 4"/>';
      h += '<text x="' + ((a.x + b.x) / 2) + '" y="' + ((my + Math.min(a.y, b.y) - R) / 2 - 4) + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="10" font-style="italic" fill="' + PRUNE_DOUX + '">jumeaux</text>';
    });
    return h;
  }

  /* Liens relationnels entre deux personnes : proximité (trois traits), conflit (zigzag), rupture (trait coupé), distance (pointillé léger) */
  var NATURES = { proche: ['Proximité, fusion', '#4F8A6B'], conflit: ['Conflit', '#C0573F'], rupture: ['Rupture', '#5D6B8A'], distance: ['Distance', '#A08E78'] };
  function dessinRelations(pl) {
    var pos = pl.pos, h = '';
    S.rels.forEach(function (r) {
      if (r.type !== 'relation' || !NATURES[r.nature] || !pos[r.from] || !pos[r.to] || r.from === r.to) return;
      var a = pos[r.from], b = pos[r.to], memeRang = a.y === b.y, loin = memeRang && Math.abs(b.x - a.x) > SLOT + ECART + 10;
      // voisins sur la même ligne : trait droit un peu sous le trait de couple ; plus loin : un arc au-dessus, pour ne pas traverser les personnes entre les deux
      var p0 = { x: a.x, y: a.y + (memeRang && !loin ? 10 : 0) }, p2 = { x: b.x, y: b.y + (memeRang && !loin ? 10 : 0) };
      var c = loin ? { x: (a.x + b.x) / 2, y: a.y - R - 70 - Math.min(50, Math.abs(b.x - a.x) * 0.06) } : { x: (a.x + b.x) / 2, y: (p0.y + p2.y) / 2 };
      var pts = [], n = 60, i;
      for (i = 0; i <= n; i++) { var t = i / n, u = 1 - t; pts.push({ x: u * u * p0.x + 2 * u * t * c.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p2.y }); }
      var ra = hautSymbole(r.from) + 6, rb = hautSymbole(r.to) + 6;
      pts = pts.filter(function (p) { return Math.hypot(p.x - a.x, p.y - a.y) > ra && Math.hypot(p.x - b.x, p.y - b.y) > rb; });
      if (pts.length < 2) return;
      var cum = [0]; for (i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
      var lg = cum[cum.length - 1]; if (lg < 12) return;
      function en(s, d) {   // point à l'abscisse s, décalé de d perpendiculairement
        var k = 1; while (k < cum.length - 1 && cum[k] < s) k++;
        var q0 = pts[k - 1], q1 = pts[k], f = cum[k] > cum[k - 1] ? (s - cum[k - 1]) / (cum[k] - cum[k - 1]) : 0, ln = cum[k] - cum[k - 1] || 1;
        var nx = -(q1.y - q0.y) / ln, ny = (q1.x - q0.x) / ln;
        return (q0.x + (q1.x - q0.x) * f + nx * d).toFixed(1) + ' ' + (q0.y + (q1.y - q0.y) * f + ny * d).toFixed(1);
      }
      function trace(s0, s1, d) { var m = Math.max(1, Math.ceil((s1 - s0) / 6)), z = 'M' + en(s0, d); for (var j = 1; j <= m; j++) z += 'L' + en(s0 + (s1 - s0) * j / m, d); return z; }
      var coul = NATURES[r.nature][1], st = ' fill="none" stroke="' + coul + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"', p;
      if (r.nature === 'proche') p = trace(0, lg, -4.5) + trace(0, lg, 0) + trace(0, lg, 4.5);
      else if (r.nature === 'conflit') { var nz = Math.max(2, Math.round(lg / 9)); p = 'M' + en(0, 0); for (i = 1; i < nz; i++) p += 'L' + en(lg * i / nz, i % 2 ? -5 : 5); p += 'L' + en(lg, 0); }
      else if (r.nature === 'rupture') { var mi = lg / 2; p = trace(0, mi - 7, 0) + trace(mi + 7, lg, 0) + 'M' + en(mi - 7, -7) + 'L' + en(mi - 7, 7) + 'M' + en(mi + 7, -7) + 'L' + en(mi + 7, 7); }
      else p = trace(0, lg, 0);
      h += '<path class="relation" opacity=".85" d="' + p + '"' + st + (r.nature === 'distance' ? ' stroke-dasharray="2 6" stroke-opacity=".8"' : '') + '/>';
    });
    return h;
  }
  function dessinRepetition(pl, rep) {
    if (!rep) return '';
    var pos = pl.pos, h = '', ids = rep.ids.filter(function (id) { return pos[id]; });
    for (var i = 0; i < ids.length - 1; i++) {
      var a = pos[ids[i]], b = pos[ids[i + 1]];
      var mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 60 - Math.abs(a.x - b.x) * 0.08;
      h += '<path d="M' + a.x + ' ' + (a.y - R) + 'Q' + mx + ' ' + my + ' ' + b.x + ' ' + (b.y - R) + '" fill="none" stroke="' + rep.c + '" stroke-width="2.5" stroke-dasharray="7 6" stroke-linecap="round" opacity=".9"/>';
    }
    return h;
  }

  function badgesDe(reps) {
    var b = {};
    reps.forEach(function (r) { r.ids.forEach(function (id) { (b[id] = b[id] || []); if (b[id].indexOf(r.c) < 0) b[id].push(r.c); }); });
    return b;
  }

  var reps = [];
  function dessiner(garderId) {
    cacheLiens = null;
    var ancien = (garderId && plan && plan.pos[garderId]) ? { x: plan.pos[garderId].x, y: plan.pos[garderId].y } : null;
    plan = calculerPlan();
    reps = detecter();
    if (repActive && !reps.some(function (r) { return r.cle === repActive.cle; })) repActive = null;
    if (ancien && plan.pos[garderId]) { vue.x += (ancien.x - plan.pos[garderId].x) * vue.k; vue.y += (ancien.y - plan.pos[garderId].y) * vue.k; }
    var o = { sel: selId, badges: badgesDe(reps), attenue: repActive ? repActive.ids : null };
    var h = '<g id="monde">' + dessinRelations(plan) + dessinLiens(plan) + dessinRepetition(plan, repActive);
    Object.keys(S.people).forEach(function (id) { h += dessinPersonne(S.people[id], plan.pos[id], o); });
    h += '</g>';
    $('dessin').innerHTML = h;
    appliquerVue();
    $('vide').classList.toggle('visible', !Object.keys(S.people).length);
    dessinerPanneau();
    majAnnuler();
  }
  function appliquerVue() {
    var m = $('monde'); if (m) m.setAttribute('transform', 'translate(' + vue.x + ',' + vue.y + ') scale(' + vue.k + ')');
    placerActions();
  }
  function recentrer() {
    var t = $('toile'); if (!plan || !plan.boite) { vue = { x: t.clientWidth / 2, y: t.clientHeight / 2, k: 1 }; appliquerVue(); return; }
    var b = plan.boite, W = t.clientWidth, H = t.clientHeight;
    var droite = 30, bas = 70, haut = 70;
    var k = Math.min(1.1, (W - 60 - droite) / (b.x2 - b.x1), (H - haut - bas) / (b.y2 - b.y1));
    k = Math.max(0.3, k);
    vue.k = k;
    vue.x = (W - droite) / 2 - ((b.x1 + b.x2) / 2) * k;
    vue.y = haut + (H - haut - bas) / 2 - ((b.y1 + b.y2) / 2) * k;
    appliquerVue();
  }
  function rendreVisible(id) {
    if (!plan || !plan.pos[id]) return;
    var t = $('toile'), p = plan.pos[id], marge = 40;
    var x1 = (p.x - SLOT / 2) * vue.k + vue.x, x2 = (p.x + SLOT / 2) * vue.k + vue.x;
    var y1 = (p.y - R - 70) * vue.k + vue.y, y2 = (p.y + BAS_TEXTE) * vue.k + vue.y;
    var dx = 0, dy = 0;
    if (x1 < marge) dx = marge - x1; else if (x2 > t.clientWidth - marge) dx = t.clientWidth - marge - x2;
    if (y1 < marge) dy = marge - y1; else if (y2 > t.clientHeight - 60) dy = t.clientHeight - 60 - y2;
    if (dx || dy) { vue.x += dx; vue.y += dy; appliquerVue(); }
  }
  function zoomer(f, cx, cy) {
    var t = $('toile');
    if (cx == null) { cx = t.clientWidth / 2; cy = t.clientHeight / 2; }
    var nk = Math.min(2.2, Math.max(0.25, vue.k * f));
    vue.x = cx - (cx - vue.x) * (nk / vue.k); vue.y = cy - (cy - vue.y) * (nk / vue.k); vue.k = nk;
    appliquerVue();
  }

  /* ───────── Barre d'actions ───────── */
  function placerActions() {
    var bar = $('actions-perso');
    if (!selId || !plan || !plan.pos[selId] || !S.people[selId]) { bar.classList.remove('visible'); return; }
    var p = plan.pos[selId], t = $('toile');
    var x = p.x * vue.k + vue.x, y = (p.y - R - 14) * vue.k + vue.y;
    bar.classList.add('visible');
    var w = bar.offsetWidth, l = Math.max(w / 2 + 8, Math.min(t.clientWidth - w / 2 - 8, x));
    if (y < bar.offsetHeight + 10) { y = (p.y + BAS_TEXTE + 8) * vue.k + vue.y; bar.style.transform = 'translate(-50%,0)'; }
    else bar.style.transform = 'translate(-50%,-100%)';
    bar.style.left = l + 'px'; bar.style.top = y + 'px';
  }
  function majBarreActions() {
    var bar = $('actions-perso');
    if (!selId || !S.people[selId]) { bar.innerHTML = ''; bar.classList.remove('visible'); return; }
    var b = '<button type="button" class="principal" data-act="modifier">Modifier</button>';
    var np0 = parents(selId).length;
    if (np0 < 2) b += '<button type="button" data-act="parent">' + (np0 ? '+ Parent' : '+ Parents') + '</button>';
    b += '<button type="button" data-act="couple">+ Conjoint·e</button>';
    b += '<button type="button" data-act="enfant">+ Enfant</button>';
    b += '<button type="button" data-act="fratrie">+ Frère ou sœur</button>';
    if (Object.keys(S.people).length > 1) b += '<button type="button" data-act="relation">+ Lien relationnel</button>';
    b += '<button type="button" class="danger" data-act="supprimer" aria-label="Supprimer">Supprimer</button>';
    bar.innerHTML = b;
    placerActions();
  }
  function choisir(id) { selId = id; dessiner(); if (id) rendreVisible(id); majBarreActions(); }

  /* ───────── Panneau ───────── */
  /* Recherche dans le panneau : texte libre ou suggestion */
  var RECH_SUGG = [
    ['gisant', 'Syndrome du gisant', 'Il faut des dates de décès et des naissances qui suivent dans la même famille.'],
    ['prénom caché', 'Prénoms cachés', 'Un prénom qui en porte un autre (Stéphanie après Stéphane, Jean-Marie et une Marie disparue) : il faut des dates de naissance et de décès.'],
    ['filles garçons', 'Filles et garçons', 'Ajoute les frères et sœurs de chaque génération, avec leur sexe.'],
    ['nombre enfants', 'Nombre d’enfants', 'Ajoute tous les enfants de chaque couple, sur plusieurs générations.'],
    ['métier', 'Métiers de la lignée', 'Ajoute le métier de chacun : les transmissions, ruptures et sauts de génération apparaîtront.'],
    ['mort jeune', 'Morts jeunes', 'Il faut les années de naissance et de décès.'],
    ['cousins', 'Mariages entre cousins', 'Un même ancêtre doit apparaître dans deux branches.'],
    ['date', 'Dates qui reviennent', 'Il faut des dates complètes (jour et mois).'],
    ['conception', 'Conception et deuil', 'Il faut les dates de naissance des enfants et les dates de décès de leurs proches.'],
    ['guerre', 'Guerres', 'Il faut le sexe et l’année de naissance des hommes de l’arbre.'],
    ['zone ombre', 'Zones d’ombre', 'Ajoute les frères et sœurs avec leurs années de naissance.'],
    ['premier enfant', 'Premier enfant', 'Ajoute tous les enfants de chaque couple, avec leurs dates.'],
    ['argent', 'Argent', 'Coche les événements d’argent sur les fiches : faillite, manque d’argent, perte d’emploi, héritage conflictuel, ascension, déclassement.'],
    ['age parent', 'Âge pour devenir parent', 'Il faut les années de naissance des parents et de leurs enfants, sur plusieurs générations.']
  ];
  var recherche = '';
  function correspond(r, mots) { var t = norm(r.label + ' ' + r.desc + ' ' + (r.tags || '')); return mots.every(function (m) { return t.indexOf(m) >= 0; }); }
  function carteprenom(q) {   // « Marie » : toutes les personnes qui portent ce prénom, seul ou composé, et ce qu'elles ont vécu
    var cible = norm(q).replace(/[^a-z]/g, ''); if (cible.length < 3) return null;
    var l = Object.keys(S.people).map(function (id) { return S.people[id]; }).filter(function (p) {
      return norm(p.prenom).split(/[\s'’-]+/).some(function (w) { var x = w.replace(/[^a-z]/g, ''); return x === cible || (cible.length >= 4 && (x.indexOf(cible) === 0 && x.length - cible.length <= 3)); });
    });
    if (!l.length) return null;
    return { synth: true, type: 'prenom', c: COUL.prenom, label: 'Le prénom « ' + q.trim() + ' » dans ton arbre : ' + l.length + ' personne' + (l.length > 1 ? 's' : ''),
      desc: l.map(function (p) { var ad = ageDeces(p), ev = (p.events || []).map(function (e) { return (NOM_EVT[e.type] || e.type || '').toLowerCase(); }).filter(Boolean); return nomComplet(p) + (p.naiss ? ' (' + annee(p.naiss) + ')' : '') + (ad != null ? ', ' + (p.sex === 'f' ? 'décédée' : 'décédé') + ' à ' + ad + ' ans' : '') + (ev.length ? ', ' + ev.join(', ') : ''); }).join(' ; ') + '.',
      ids: l.map(function (p) { return p.id; }), tags: 'prenom', cle: 'synth:' + q };
  }
  function dessinerPanneau() {
    reps = reps.filter(function (r) { return !r.synth; });
    var n = reps.length;
    $('compte').textContent = n; $('compte-bouton').textContent = n;
    var z = $('reps');
    if (!Object.keys(S.people).length) { z.innerHTML = '<p class="rep-aide">Commence par te placer dans l’arbre.</p>'; return; }
    if (!n) {
      z.innerHTML = '<p class="rep-aide">Rien pour l’instant. Ajoute <b>les dates</b>, <b>les métiers</b> et <b>les événements marquants</b> de chacun : les répétitions apparaissent ici toutes seules.</p>' +
        (idMoi() ? '' : '<p class="rep-aide">Astuce : coche « C’est moi » sur ta fiche pour repérer le syndrome anniversaire.</p>');
      return;
    }
    // Exercices « Ce que je ressens, ce qu'il ou elle a vécu » : ils s'accumulent ici, à faire quand on a le temps
    var EXO = {}; try { EXO = JSON.parse(localStorage.getItem('genesolia-exercices') || '{}') || {}; } catch (e) { EXO = {}; }
    function cleExo(a) { return norm(a); }
    function lienExo(x) { return 'exercice-ressenti-ancetre.html?ancetre=' + encodeURIComponent(x.a) + '&amp;lien=' + encodeURIComponent(x.l || ''); }
    var aFaire = [], vus = {};
    reps.forEach(function (r) { if (r.exo && !vus[cleExo(r.exo.a)]) { vus[cleExo(r.exo.a)] = 1; aFaire.push({ a: r.exo.a, l: r.exo.l, c: r.c }); } });
    Object.keys(EXO).forEach(function (k) { if (!vus[k] && EXO[k] && EXO[k].ancetre) { vus[k] = 1; aFaire.push({ a: EXO[k].ancetre, l: EXO[k].lien, c: COUL.gisant }); } });
    function statut(a) { var x = EXO[cleExo(a)]; return x && x.statut === 'fait' ? 'fait' : x && x.statut === 'commence' ? 'commence' : 'afaire'; }
    var LIB = { afaire: 'À faire', commence: 'Commencé', fait: 'Fait' };
    var restants = aFaire.filter(function (x) { return statut(x.a) !== 'fait'; }).length;
    var blocExo = aFaire.length ? '<div class="exos"><p class="exos-titre">Tes exercices <span>' + (restants ? restants + ' à faire' : 'tous faits') + '</span></p>' +
      '<p class="rep-aide">Continue ton arbre : les exercices t’attendent ici, à faire quand tu as le temps.</p>' +
      aFaire.map(function (x) { var st = statut(x.a); return '<a class="exo exo-' + st + '" style="--c:' + x.c + '" href="' + lienExo(x) + '"><b>' + esc(x.a) + '</b><span class="exo-st">' + LIB[st] + '</span>' + (x.l ? '<small>' + esc(x.l) + '</small>' : '') + '</a>'; }).join('') + '</div>' : '';
    var mots = norm(recherche).split(/[\s'’,-]+/).filter(function (m) { return m.length >= 2; });
    var visibles = reps.map(function (r, i) { return i; });
    var info = '';
    if (mots.length) {
      var cp = carteprenom(recherche);
      if (cp) reps.unshift(cp);
      visibles = []; reps.forEach(function (r, i) { if (r.synth || correspond(r, mots)) visibles.push(i); });
      var sg = RECH_SUGG.find(function (x) { return norm(x[0]) === norm(recherche).trim(); });
      info = '<p class="rep-aide">' + (visibles.length ? visibles.length + ' résultat' + (visibles.length > 1 ? 's' : '') + ' pour « ' + esc(recherche.trim()) + ' ».' : 'Rien trouvé pour « ' + esc(recherche.trim()) + ' » dans ton arbre.' + (sg ? ' ' + esc(sg[2]) : ' Essaie un prénom, un métier, ou une suggestion ci-dessus.')) + '</p>';
    }
    z.innerHTML = (mots.length ? info : blocExo) + visibles.map(function (i) { var r = reps[i];
      var st = r.exo ? statut(r.exo.a) : null;
      return '<button type="button" class="rep" style="--c:' + r.c + '" data-rep="' + i + '" aria-pressed="' + (repActive && repActive.cle === r.cle ? 'true' : 'false') + '"><strong>' + esc(r.label) + '</strong><span>' + esc(r.desc) + '</span>' + (r.q ? '<em class="rep-q">' + r.q.map(esc).join('<br>') + '</em>' : '') + '</button>' +
        (r.art ? '<a class="rep-lire" style="--c:' + r.c + '" href="' + r.art.u + '" target="_blank" rel="noopener">Lire l’article : ' + esc(r.art.t) + ' ↗</a>' : '') +
        (r.exo ? '<a class="rep-exo" style="--c:' + r.c + '" href="' + lienExo(r.exo) + '">' + (st === 'fait' ? 'Revoir l’exercice avec ' : st === 'commence' ? 'Reprendre l’exercice avec ' : 'Faire l’exercice avec ') + esc(r.exo.a) + '</a>' : '');
    }).join('') + (idMoi() ? '' : '<p class="rep-aide">Astuce : coche « C’est moi » sur ta fiche pour repérer le syndrome anniversaire.</p>');
  }

  /* ───────── Historique et sauvegarde ───────── */
  function instantane() { return JSON.stringify(S); }
  function memoriser() { pile.push(instantane()); if (pile.length > 60) pile.shift(); majAnnuler(); }
  function majAnnuler() { var b = $('bt-annuler'); if (b) b.disabled = !pile.length || EXEMPLE; }
  function annuler() {
    if (!pile.length) return;
    S = JSON.parse(pile.pop());
    if (selId && !S.people[selId]) selId = null;
    dessiner(); majBarreActions(); enregistrer();
  }
  function statut(t) { $('statut').innerHTML = t; }
  function textStatutRepos() {
    if (EXEMPLE) return '';
    if (utilisateur) return 'Enregistré dans ton espace';
    if (ARBRE_ID) return 'Cet arbre est dans ton espace · <a href="login.html?retour=genosociogramme.html">Me connecter pour l\u2019ouvrir</a>';
    return 'Enregistré dans ce navigateur · <a href="login.html?retour=genosociogramme.html">Me connecter pour le garder en sécurité</a>';
  }
  function marquerSynchro(ok) { if (ARBRE_ID) return; try { localStorage.setItem('geno4-synchro', ok ? 'ok' : 'attente'); } catch (e) {} }
  /* Exercices « Ce que je ressens… » : gardés dans ce navigateur et, avec un compte, dans les données de l'arbre (clé exercices) */
  function lireExos() { try { return JSON.parse(localStorage.getItem('genesolia-exercices') || '{}') || {}; } catch (e) { return {}; } }
  function fusionnerExos(a, b) {
    var r = {}; a = a || {}; b = b || {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      if (k === '_dernier' || r[k]) return;
      var x = a[k], y = b[k];
      r[k] = !x ? y : !y ? x : ((y.maj || '') > (x.maj || '') ? y : (x.maj || '') > (y.maj || '') ? x : (y.statut === 'fait' ? y : x));
    });
    if (b._dernier || a._dernier) r._dernier = b._dernier || a._dernier;
    return r;
  }
  function donneesCompte() {
    if (ARBRE_ID) return Object.assign({}, annexes, { people: S.people, rels: S.rels, nid: S.nid, v: 2 });
    return Object.assign({}, annexes, { exercices: fusionnerExos(annexes.exercices, lireExos()) }, { people: S.people, rels: S.rels, nid: S.nid, v: 2 }); }
  function envoyer() {
    clearTimeout(minuteur); minuteur = null;
    if (!utilisateur || !sb) return;
    enAttente = false;
    statut('Enregistrement…');
    var req = ARBRE_ID
      ? sb.from('arbres_supp').update({ data: donneesCompte(), maj: new Date().toISOString() }).eq('id', ARBRE_ID)
      : sb.from('arbres').upsert({ user_id: utilisateur.id, data: donneesCompte(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    return req
      .then(function (r) {
        if (r.error) throw r.error;
        essais = 0; marquerSynchro(true); statut(textStatutRepos());
      })
      .catch(function () {
        essais++; enAttente = true; marquerSynchro(false);
        statut('Pas encore enregistré dans ton espace (connexion ?). Nouvel essai…');
        minuteur = setTimeout(envoyer, Math.min(60000, 5000 * essais));
      });
  }
  function enregistrer() {
    if (EXEMPLE || arbreBloque) return;
    try { localStorage.setItem(CLE_LOCALE, JSON.stringify({ people: S.people, rels: S.rels, nid: S.nid, v: 2 })); } catch (e) {}
    if (!utilisateur || !sb) { statut(textStatutRepos()); return; }
    enAttente = true; marquerSynchro(false);
    clearTimeout(minuteur);
    statut('Enregistrement…');
    minuteur = setTimeout(envoyer, 900);
  }
  // Si on quitte la page juste après une modification, on envoie tout de suite
  function envoyerSiBesoin() { if (enAttente && utilisateur) envoyer(); }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') envoyerSiBesoin(); });
  window.addEventListener('pagehide', envoyerSiBesoin);
  window.addEventListener('beforeunload', function (e) { if (enAttente && utilisateur) { envoyer(); e.preventDefault(); e.returnValue = ''; } });
  window.addEventListener('online', envoyerSiBesoin);
  function charger(d) {
    d = d || {};
    S = { people: d.people || {}, rels: Array.isArray(d.rels) ? d.rels : [], nid: d.nid || 1 };
    Object.keys(S.people).forEach(function (id) {
      var p = S.people[id]; p.id = id;
      if (!Array.isArray(p.traits)) p.traits = [];
      if (!Array.isArray(p.events)) p.events = [];
      if (p.role && p.role !== 'moi') p.role = '';
      var n = parseInt(String(id).replace(/\D/g, ''), 10); if (!isNaN(n) && n >= S.nid) S.nid = n + 1;
    });
    S.rels = S.rels.filter(function (r) { return r && r.from && r.to && r.from !== r.to && S.people[r.from] && S.people[r.to]; });
  }
  function chargerLocal() { try { var raw = localStorage.getItem(CLE_LOCALE); if (raw) { charger(JSON.parse(raw)); return true; } } catch (e) {} return false; }

  /* ───────── Fenêtres ───────── */
  var dernierFocus = null;
  function ouvrir(id) { dernierFocus = document.activeElement; $(id).classList.add('ouverte'); }
  function fermer(id) { $(id).classList.remove('ouverte'); if (dernierFocus && dernierFocus.focus) try { dernierFocus.focus(); } catch (e) {} }
  document.querySelectorAll('.fenetre-fond').forEach(function (f) {
    f.addEventListener('mousedown', function (e) { if (e.target === f) f.dataset.clicFond = '1'; else f.dataset.clicFond = ''; });
    f.addEventListener('click', function (e) {
      if ((e.target === f && f.dataset.clicFond) || e.target.closest('[data-fermer]')) {
        if (f.id === 'fen-personne') annulerFiche(); else fermer(f.id);
      }
    });
  });

  /* ───────── Ajouter un proche ───────── */
  var ajout = null;
  var SYMB = {
    f: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    m: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    u: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5L14.5 8 8 14.5 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    deux: '<svg viewBox="0 0 26 16" aria-hidden="true" style="width:26px"><circle cx="7" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="2.5" width="11" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
  };
  var CHOIX = {
    parent: { titre: 'Ajouter un parent', items: [['f', 'Mère'], ['m', 'Père'], ['u', 'Parent']] },
    couple: { titre: 'Ajouter un ou une partenaire', items: [['f', 'Femme'], ['m', 'Homme'], ['u', 'Non précisé']] },
    enfant: { titre: 'Ajouter un enfant', items: [['f', 'Fille'], ['m', 'Fils'], ['u', 'Non précisé']] },
    fratrie: { titre: 'Ajouter un frère ou une sœur', items: [['f', 'Sœur'], ['m', 'Frère'], ['u', 'Non précisé']] }
  };
  function nomCourt(id) { var p = S.people[id]; return nomComplet(p) || lienDe(id) || 'Sans prénom'; }
  function ouvrirAjout(type, id) {
    ajout = { type: type, id: id };
    var c = CHOIX[type], p = S.people[id];
    var deuxParents = type === 'parent' && parents(id).length === 0;
    if (deuxParents) c = { titre: 'Ajouter les parents', items: [['deux', 'Mère et père'], ['f', 'Mère seule'], ['m', 'Père seul'], ['u', 'Un parent']] };
    $('fa-titre').textContent = c.titre;
    $('fa-sous').textContent = 'Pour ' + nomCourt(id);
    var defaut = 'f';
    if (type === 'parent') { var ps = parents(id); if (ps.length === 1) defaut = S.people[ps[0]].sex === 'f' ? 'm' : 'f'; if (deuxParents) defaut = 'deux'; }
    if (type === 'couple') defaut = p.sex === 'f' ? 'm' : p.sex === 'm' ? 'f' : 'f';
    $('fa-choix').innerHTML = c.items.map(function (it) {
      return '<label><input type="radio" name="fa-sexe" value="' + it[0] + '"' + (it[0] === defaut ? ' checked' : '') + '><span>' + SYMB[it[0]] + it[1] + '</span></label>';
    }).join('');
    var o = '';
    if (type === 'parent') {
      var ex = parents(id);
      if (deuxParents) {
        o += '<div class="deux-col" id="fa-deux">' +
          '<div class="champ"><label for="fa-mere">Prénom de la mère</label><input type="text" id="fa-mere" autocomplete="off" placeholder="Facultatif"></div>' +
          '<div class="champ"><label for="fa-pere">Prénom du père</label><input type="text" id="fa-pere" autocomplete="off" placeholder="Facultatif"></div></div>';
      }
      if (ex.length === 1) o += '<label class="case"><input type="checkbox" id="fa-couple" checked> En couple avec ' + esc(nomCourt(ex[0])) + '</label>';
      var fr = freresDirects(id).filter(function (f) { return parents(f).length < 2; });
      if (fr.length) {
        o += '<div class="champ"><span class="etiq">' + (deuxParents ? 'Aussi les parents de' : 'Aussi parent de') + '</span><div class="liste-cases">' + fr.map(function (f) {
          var memes = ex.every(function (x) { return parents(f).indexOf(x) >= 0; });
          return '<label class="case"><input type="checkbox" data-aussi="' + esc(f) + '"' + (memes ? ' checked' : '') + '> ' + esc(nomCourt(f)) + '</label>';
        }).join('') + '</div></div>';
      }
    }
    if (type === 'couple') {
      o += '<div class="champ"><label for="fa-statut">Situation</label><select id="fa-statut">' +
        '<option value="marie">Marié·es ou pacsé·es</option><option value="union">En couple</option><option value="separe">Séparé·es</option><option value="divorce">Divorcé·es</option></select></div>';
    }
    if (type === 'enfant') {
      var pa = partenaires(id);
      o += '<div class="champ"><label for="fa-avec">Avec</label><select id="fa-avec">' +
        pa.map(function (x) { return '<option value="' + esc(x) + '">' + esc(nomCourt(x)) + '</option>'; }).join('') +
        '<option value="">Autre parent non indiqué</option></select></div>';
    }
    if (type === 'fratrie') {
      var ps2 = parents(id);
      if (ps2.length) {
        o += '<div class="champ"><span class="etiq">Mêmes parents</span><div class="liste-cases">' + ps2.map(function (x) {
          return '<label class="case"><input type="checkbox" data-meme="' + esc(x) + '" checked> ' + esc(nomCourt(x)) + '</label>';
        }).join('') + '</div><span class="aide">Décoche un parent s’il s’agit d’un demi-frère ou d’une demi-sœur.</span></div>';
      }
    }
    $('fa-options').innerHTML = o;
    ouvrir('fen-ajout');
    majChoixDeux();
    setTimeout(function () { var r = deuxParents ? $('fa-mere') : $('fa-choix').querySelector('input:checked'); if (r) r.focus(); }, 30);
  }
  function majChoixDeux() {
    var z = $('fa-deux'); if (!z) return;
    var v = (document.querySelector('input[name="fa-sexe"]:checked') || {}).value;
    z.style.display = v === 'deux' ? '' : 'none';
  }
  $('fa-choix').addEventListener('change', majChoixDeux);
  $('fa-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!ajout) return;
    var sexe = (document.querySelector('input[name="fa-sexe"]:checked') || {}).value || 'u';
    var id = ajout.id, type = ajout.type;
    memoriser();
    var avant = pile[pile.length - 1];
    if (type === 'parent' && sexe === 'deux') {
      var enf = S.people[id];
      var mere = nouvellePersonne({ sex: 'f', prenom: $('fa-mere').value.trim() });
      var pere = nouvellePersonne({ sex: 'm', prenom: $('fa-pere').value.trim(), nom: enf.nom || '' });
      var cibles = [id];
      document.querySelectorAll('[data-aussi]').forEach(function (cb) { if (cb.checked) cibles.push(cb.getAttribute('data-aussi')); });
      cibles.forEach(function (c) { S.rels.push({ from: mere.id, to: c, type: 'parent' }); S.rels.push({ from: pere.id, to: c, type: 'parent' }); });
      S.rels.push({ from: pere.id, to: mere.id, type: 'couple', statut: 'marie' });
      fermer('fen-ajout');
      selId = id;
      dessiner(id);
      rendreVisible(mere.id); rendreVisible(pere.id);
      majBarreActions();
      enregistrer();
      return;
    }
    var np = nouvellePersonne({ sex: sexe });
    if (type === 'parent') {
      var ex = parents(id);
      S.rels.push({ from: np.id, to: id, type: 'parent' });
      if (ex.length === 1 && $('fa-couple') && $('fa-couple').checked && !relCouple(ex[0], np.id)) S.rels.push({ from: ex[0], to: np.id, type: 'couple', statut: 'marie' });
      document.querySelectorAll('[data-aussi]').forEach(function (cb) { if (cb.checked) S.rels.push({ from: np.id, to: cb.getAttribute('data-aussi'), type: 'parent' }); });
    } else if (type === 'couple') {
      S.rels.push({ from: id, to: np.id, type: 'couple', statut: $('fa-statut').value });
    } else if (type === 'enfant') {
      S.rels.push({ from: id, to: np.id, type: 'parent' });
      var avec = $('fa-avec') ? $('fa-avec').value : '';
      if (avec) S.rels.push({ from: avec, to: np.id, type: 'parent' });
    } else if (type === 'fratrie') {
      var memes = Array.prototype.slice.call(document.querySelectorAll('[data-meme]')).filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.getAttribute('data-meme'); });
      if (memes.length) memes.forEach(function (p) { S.rels.push({ from: p, to: np.id, type: 'parent' }); });
      else S.rels.push({ from: id, to: np.id, type: 'fratrie' });
    }
    fermer('fen-ajout');
    selId = np.id;
    dessiner(id);
    rendreVisible(np.id);
    majBarreActions();
    enregistrer();
    ouvrirFiche(np.id, true, avant);
  });

  /* ───────── Fiche d'une personne ───────── */
  var fiche = null;
  function optionsEvt(v) { return '<option value="">Choisis…</option>' + EVTS.map(function (e) { return '<option value="' + e[0] + '"' + (e[0] === v ? ' selected' : '') + '>' + e[1] + '</option>'; }).join(''); }
  function ligneEvt(e) {
    e = e || {};
    var d = document.createElement('div'); d.className = 'evt';
    d.innerHTML = '<select aria-label="Événement">' + optionsEvt(e.type) + '</select>' +
      '<input type="text" inputmode="numeric" aria-label="Âge" placeholder="Âge" value="' + esc(e.age || '') + '">' +
      '<input type="text" inputmode="numeric" aria-label="Année" placeholder="Année" value="' + esc(e.year || '') + '">' +
      '<button type="button" class="suppr" aria-label="Retirer cet événement">×</button>';
    d.querySelector('.suppr').addEventListener('click', function () { d.remove(); });
    $('fp-evts').appendChild(d);
  }
  function dessinerTraits() {
    var box = $('fp-traits'), inp = $('fp-trait');
    box.querySelectorAll('.puce').forEach(function (x) { x.remove(); });
    fiche.traits.forEach(function (t, i) {
      var s = document.createElement('span'); s.className = 'puce';
      s.innerHTML = esc(t) + '<button type="button" aria-label="Retirer ' + esc(t) + '">×</button>';
      s.querySelector('button').addEventListener('click', function () { fiche.traits.splice(i, 1); dessinerTraits(); });
      box.insertBefore(s, inp);
    });
  }
  function ajouterTrait() {
    var inp = $('fp-trait');
    inp.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (t) { if (fiche.traits.indexOf(t) < 0) fiche.traits.push(t); });
    inp.value = ''; dessinerTraits();
  }
  $('fp-trait').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); ajouterTrait(); }
    else if (e.key === 'Backspace' && !this.value && fiche.traits.length) { fiche.traits.pop(); dessinerTraits(); }
  });
  $('fp-trait').addEventListener('blur', function () { if (this.value.trim()) ajouterTrait(); });
  $('fp-traits').addEventListener('click', function (e) { if (e.target === this) $('fp-trait').focus(); });
  $('fp-ajout-evt').addEventListener('click', function () { ligneEvt(); var s = $('fp-evts').lastChild.querySelector('select'); s.focus(); });

  var STATUTS = [['marie', 'Marié·es ou pacsé·es'], ['union', 'En couple'], ['separe', 'Séparé·es'], ['divorce', 'Divorcé·es']];
  function dessinerLiensFiche() {
    var id = fiche.id, h = '';
    S.rels.forEach(function (r, i) {
      var autre = null, lib = '';
      if (r.type === 'parent' && r.to === id) { autre = r.from; lib = 'Parent : '; }
      else if (r.type === 'parent' && r.from === id) { autre = r.to; lib = 'Enfant : '; }
      else if (r.type === 'couple' && (r.from === id || r.to === id)) { autre = r.from === id ? r.to : r.from; lib = 'En couple avec '; }
      else if (r.type === 'fratrie' && (r.from === id || r.to === id)) { autre = r.from === id ? r.to : r.from; lib = 'Frère ou sœur : '; }
      else if (r.type === 'relation' && NATURES[r.nature] && (r.from === id || r.to === id)) { autre = r.from === id ? r.to : r.from; lib = 'Lien relationnel avec '; }
      if (!autre || !S.people[autre]) return;
      h += '<div class="lien"><span>' + lib + '<b>' + esc(nomCourt(autre)) + '</b></span>' +
        (r.type === 'relation' ? '<select data-nature="' + i + '" aria-label="Nature du lien">' + Object.keys(NATURES).map(function (k) { return '<option value="' + k + '"' + (r.nature === k ? ' selected' : '') + '>' + NATURES[k][0] + '</option>'; }).join('') + '</select>' : '') +
        (r.type === 'couple' ? '<select data-statut="' + i + '" aria-label="Situation du couple">' + STATUTS.map(function (s) { return '<option value="' + s[0] + '"' + ((r.statut || 'marie') === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select>' : '') +
        '<button type="button" class="suppr" data-retirer="' + i + '" aria-label="Retirer ce lien">×</button></div>';
    });
    $('fp-liens').innerHTML = h || '<p class="rep-aide" style="padding:0">Aucun lien pour l’instant.</p>';
    var sel = $('fp-lier-qui');
    sel.innerHTML = Object.keys(S.people).filter(function (o) { return o !== id; }).map(function (o) { return '<option value="' + esc(o) + '">' + esc(nomCourt(o)) + '</option>'; }).join('');
    $('fp-bloc-liens').style.display = Object.keys(S.people).length > 1 ? '' : 'none';
  }
  $('fp-liens').addEventListener('click', function (e) {
    var b = e.target.closest('[data-retirer]'); if (!b) return;
    memoriser();
    S.rels.splice(+b.getAttribute('data-retirer'), 1);
    dessinerLiensFiche(); dessiner(fiche.id); majBarreActions(); enregistrer();
  });
  $('fp-liens').addEventListener('change', function (e) {
    var nt = e.target.closest('[data-nature]');
    if (nt) { memoriser(); S.rels[+nt.getAttribute('data-nature')].nature = nt.value; dessiner(fiche.id); enregistrer(); return; }
    var s = e.target.closest('[data-statut]'); if (!s) return;
    memoriser();
    S.rels[+s.getAttribute('data-statut')].statut = s.value;
    dessiner(fiche.id); enregistrer();
  });
  $('fp-lier').addEventListener('click', function () {
    var t = $('fp-lier-type').value, o = $('fp-lier-qui').value, id = fiche.id, err = $('fp-erreur');
    err.textContent = '';
    if (!o) return;
    var r;
    if (/^rel-/.test(t)) {
      if (S.rels.some(function (x) { return x.type === 'relation' && ((x.from === id && x.to === o) || (x.from === o && x.to === id)); })) { err.textContent = 'Un lien relationnel existe déjà avec cette personne : change sa nature dans la liste ci-dessus.'; return; }
      r = { from: id, to: o, type: 'relation', nature: t.slice(4) };
    }
    else if (t === 'couple') { if (relCouple(id, o)) { err.textContent = 'Ce lien existe déjà.'; return; } r = { from: id, to: o, type: 'couple', statut: 'marie' }; }
    else {
      var parent = t === 'parent' ? id : o, enfant = t === 'parent' ? o : id;
      if (parents(enfant).indexOf(parent) >= 0) { err.textContent = 'Ce lien existe déjà.'; return; }
      if (parents(enfant).length >= 2) { err.textContent = nomCourt(enfant) + ' a déjà deux parents. Retire d’abord un lien.'; return; }
      if (estAncetre(enfant, parent)) { err.textContent = 'Impossible : cette personne est déjà son ancêtre.'; return; }
      r = { from: parent, to: enfant, type: 'parent' };
    }
    memoriser(); S.rels.push(r);
    dessinerLiensFiche(); dessiner(id); majBarreActions(); enregistrer();
  });

  function ouvrirFiche(id, nouveau, instantAvant) {
    var p = S.people[id]; if (!p) return;
    fiche = { id: id, nouveau: !!nouveau, avant: instantAvant || null, traits: (p.traits || []).slice() };
    var lien = lienDe(id);
    $('fp-titre').textContent = nouveau ? (lien && lien !== 'Toi' ? 'Nouvelle personne : ' + lien.toLowerCase() : 'Nouvelle personne') : (nomComplet(p) || lien || 'Sans prénom');
    $('fp-sous').textContent = nouveau ? 'Remplis ce que tu sais, tout le reste est facultatif.' : (lien || '');
    document.querySelectorAll('input[name="sexe"]').forEach(function (r) { r.checked = r.value === (p.sex || 'u'); });
    $('fp-prenom').value = p.prenom || '';
    $('fp-nom').value = p.nom || '';
    $('fp-naiss').value = affDate(p.naiss);
    $('fp-deces').value = affDate(p.deces);
    $('fp-decede').checked = !!p.decede && !p.deces;
    $('fp-metier').value = p.metier || '';
    $('fp-lieu').value = p.lieu || '';
    var moi = idMoi();
    $('fp-moi-ligne').style.display = (!moi || moi === id) ? '' : 'none';
    $('fp-moi').checked = p.role === 'moi';
    $('fp-notes').value = p.notes || '';
    $('fp-grossesse').value = GROSS[p.grossesse] ? p.grossesse : '';
    $('fp-adopte').checked = !!p.adopte;
    $('fp-place').checked = !!p.place;
    var jm = jumeauDe(id), fr = freresDirects(id);
    if (jm && fr.indexOf(jm) < 0) fr.push(jm);
    $('fp-jumeau').innerHTML = '<option value="">Personne</option>' + fr.map(function (o) { return '<option value="' + esc(o) + '"' + (o === jm ? ' selected' : '') + '>' + esc(nomCourt(o)) + '</option>'; }).join('');
    $('fp-jumeau-ligne').style.display = fr.length ? '' : 'none';
    $('fp-situation').open = !!(GROSS[p.grossesse] || p.adopte || p.place || jm);
    $('fp-evts').innerHTML = '';
    (p.events || []).forEach(ligneEvt);
    dessinerTraits();
    dessinerLiensFiche();
    $('fp-erreur').textContent = '';
    $('fp-suppr').style.display = nouveau ? 'none' : '';
    ouvrir('fen-personne');
    setTimeout(function () { $('fp-prenom').focus(); }, 40);
  }
  function annulerFiche() {
    if (fiche && fiche.nouveau && fiche.avant) {
      // on retire la personne tout juste créée
      S = JSON.parse(fiche.avant);
      if (pile[pile.length - 1] === fiche.avant) pile.pop();
      selId = null; dessiner(); majBarreActions(); enregistrer();
    }
    fiche = null;
    fermer('fen-personne');
  }
  $('fp-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!fiche) return;
    var p = S.people[fiche.id], err = $('fp-erreur');
    if ($('fp-trait').value.trim()) ajouterTrait();
    var n = normDate($('fp-naiss').value), d = normDate($('fp-deces').value);
    if (n === null) { err.textContent = 'Date de naissance non reconnue. Écris par exemple 1952 ou 14/03/1952.'; $('fp-naiss').focus(); return; }
    if (d === null) { err.textContent = 'Date de décès non reconnue. Écris par exemple 1987 ou 02/11/1987.'; $('fp-deces').focus(); return; }
    if (n && d && annee(d) < annee(n)) { err.textContent = 'Le décès ne peut pas être avant la naissance.'; $('fp-deces').focus(); return; }
    var evts = [], bad = false;
    $('fp-evts').querySelectorAll('.evt').forEach(function (row) {
      var t = row.querySelector('select').value, ins = row.querySelectorAll('input');
      var ag = ins[0].value.trim(), an = ins[1].value.trim();
      if (!t) return;
      if ((ag && !/^\d{1,3}$/.test(ag)) || (an && !/^\d{4}$/.test(an))) bad = true;
      if (!ag && an && annee(n)) ag = String(+an - annee(n));
      if (ag && !an && annee(n)) an = String(annee(n) + +ag);
      evts.push({ type: t, age: ag, year: an });
    });
    if (bad) { err.textContent = 'Dans les événements, l’âge s’écrit en chiffres (32) et l’année avec 4 chiffres (1995).'; return; }
    if (!fiche.nouveau) memoriser();
    p.sex = (document.querySelector('input[name="sexe"]:checked') || {}).value || 'u';
    p.prenom = $('fp-prenom').value.trim();
    p.nom = $('fp-nom').value.trim();
    p.naiss = n; p.deces = d;
    p.decede = !d && $('fp-decede').checked;
    p.metier = $('fp-metier').value.trim();
    p.lieu = $('fp-lieu').value.trim();
    p.notes = $('fp-notes').value.trim();
    p.traits = fiche.traits.slice();
    p.events = evts;
    var gr = $('fp-grossesse').value;
    if (GROSS[gr]) p.grossesse = gr; else delete p.grossesse;
    if ($('fp-adopte').checked) p.adopte = true; else delete p.adopte;
    if ($('fp-place').checked) p.place = true; else delete p.place;
    var jNouv = $('fp-jumeau').value, jAnc = jumeauDe(fiche.id);
    if (jAnc && jAnc !== jNouv && S.people[jAnc].jumeau === fiche.id) delete S.people[jAnc].jumeau;
    if (jNouv && S.people[jNouv] && jNouv !== fiche.id) {
      var jEx = jumeauDe(jNouv);
      if (jEx && jEx !== fiche.id && S.people[jEx].jumeau === jNouv) delete S.people[jEx].jumeau;
      p.jumeau = jNouv; S.people[jNouv].jumeau = fiche.id;
    } else delete p.jumeau;
    if ($('fp-moi').checked) { Object.keys(S.people).forEach(function (o) { if (S.people[o].role === 'moi') S.people[o].role = ''; }); p.role = 'moi'; }
    else if (p.role === 'moi') p.role = '';
    var id = fiche.id;
    fiche = null;
    fermer('fen-personne');
    selId = id;
    dessiner(id); majBarreActions(); enregistrer();
  });
  function supprimer(id) {
    var p = S.people[id]; if (!p) return;
    if (!confirm('Supprimer ' + nomCourt(id) + ' de l’arbre ? Tu pourras revenir en arrière avec « Annuler ».')) return;
    memoriser();
    delete S.people[id];
    Object.keys(S.people).forEach(function (o) { if (S.people[o].jumeau === id) delete S.people[o].jumeau; });
    S.rels = S.rels.filter(function (r) { return r.from !== id && r.to !== id; });
    selId = null; fiche = null;
    fermer('fen-personne');
    dessiner(); majBarreActions(); enregistrer();
  }
  $('fp-suppr').addEventListener('click', function () { if (fiche) supprimer(fiche.id); });

  /* ───────── Interactions sur la toile ───────── */
  var toile = $('toile'), glisse = null;
  toile.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || e.target.closest('.actions-perso,.zoom,.legende-symb,.vide-carte')) return;
    glisse = { x: e.clientX, y: e.clientY, vx: vue.x, vy: vue.y, bouge: false, cible: e.target.closest('.personne') };
  });
  window.addEventListener('pointermove', function (e) {
    if (!glisse) return;
    var dx = e.clientX - glisse.x, dy = e.clientY - glisse.y;
    if (!glisse.bouge && Math.abs(dx) + Math.abs(dy) > 4) { glisse.bouge = true; toile.classList.add('glisse'); }
    if (glisse.bouge) { vue.x = glisse.vx + dx; vue.y = glisse.vy + dy; appliquerVue(); }
  });
  window.addEventListener('pointerup', function () {
    if (!glisse) return;
    var g = glisse; glisse = null; toile.classList.remove('glisse');
    if (g.bouge) return;
    if (g.cible) { var id = g.cible.getAttribute('data-id'); if (id !== selId) choisir(id); }
    else if (selId) choisir(null);
  });
  $('dessin').addEventListener('dblclick', function (e) { var n = e.target.closest('.personne'); if (n) ouvrirFiche(n.getAttribute('data-id'), false); });
  $('dessin').addEventListener('keydown', function (e) {
    var n = e.target.closest('.personne'); if (!n) return;
    var id = n.getAttribute('data-id');
    if (e.key === 'Enter') { e.preventDefault(); ouvrirFiche(id, false); }
    else if (e.key === ' ') { e.preventDefault(); choisir(id); setTimeout(function () { var x = document.querySelector('.personne[data-id="' + id + '"]'); if (x) x.focus(); }, 0); }
  });
  toile.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = toile.getBoundingClientRect();
    zoomer(e.deltaY > 0 ? 0.9 : 1.11, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  $('bt-zplus').addEventListener('click', function () { zoomer(1.2); });
  $('bt-zmoins').addEventListener('click', function () { zoomer(1 / 1.2); });
  $('bt-centrer').addEventListener('click', recentrer);
  $('bt-annuler').addEventListener('click', annuler);
  $('actions-perso').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b || !selId) return;
    var act = b.getAttribute('data-act');
    if (act === 'modifier') ouvrirFiche(selId, false);
    else if (act === 'relation') {   // la fiche, ouverte directement sur l'ajout d'un lien relationnel
      ouvrirFiche(selId, false);
      $('fp-lier-type').value = 'rel-proche';
      setTimeout(function () { $('fp-bloc-liens').scrollIntoView({ block: 'center' }); $('fp-lier-qui').focus(); }, 60);
    }
    else if (act === 'supprimer') supprimer(selId);
    else ouvrirAjout(act, selId);
  });
  (function () {
    var champ = $('rep-cherche'), sugg = $('rep-sugg'); if (!champ || !sugg) return;
    sugg.innerHTML = RECH_SUGG.map(function (x) { return '<button type="button" data-cherche="' + esc(x[0]) + '">' + esc(x[1]) + '</button>'; }).join('');
    var t = null;
    champ.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { recherche = champ.value; repActive = null; dessinerPanneau(); }, 150); });
    sugg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cherche]'); if (!b) return;
      var v = b.getAttribute('data-cherche'); champ.value = champ.value === v ? '' : v; recherche = champ.value; repActive = null;
      sugg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b && champ.value ? 'true' : 'false'); });
      dessinerPanneau();
    });
  })();
  $('reps').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rep]'); if (!b) return;
    var r = reps[+b.getAttribute('data-rep')];
    repActive = (repActive && repActive.cle === r.cle) ? null : r;
    dessiner();
  });
  $('bt-panneau').addEventListener('click', function () { document.body.classList.toggle('panneau-ouvert'); });
  $('bt-replier').addEventListener('click', function () { document.body.classList.remove('panneau-ouvert'); });
  window.addEventListener('resize', placerActions);
  window.addEventListener('pageshow', function (e) { if (e.persisted) dessiner(); });   // retour depuis un exercice : mettre à jour les statuts

  $('bt-commencer').addEventListener('click', function () {
    memoriser();
    var avant = pile[pile.length - 1];
    var p = nouvellePersonne({ role: 'moi', sex: 'f' });
    selId = p.id;
    dessiner(); recentrer(); majBarreActions(); enregistrer();
    ouvrirFiche(p.id, true, avant);
  });

  document.addEventListener('keydown', function (e) {
    var dansChamp = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''));
    var ouverte = document.querySelector('.fenetre-fond.ouverte');
    if (e.key === 'Escape') {
      if (ouverte) { if (ouverte.id === 'fen-personne') annulerFiche(); else fermer(ouverte.id); }
      else if (repActive) { repActive = null; dessiner(); }
      else if (selId) choisir(null);
      return;
    }
    if (ouverte || dansChamp || EXEMPLE) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); annuler(); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && selId) { e.preventDefault(); supprimer(selId); }
  });

  /* ───────── Export, impression ───────── */
  var policesEmbarquees = null;
  function polices() {
    if (policesEmbarquees) return policesEmbarquees;
    var f = [['Gilda Display', 400, 'assets/polices/gilda-display-latin-400-normal.woff2'], ['Nunito Sans', 400, 'assets/polices/nunito-sans-latin-400-normal.woff2'], ['Nunito Sans', 600, 'assets/polices/nunito-sans-latin-600-normal.woff2']];
    policesEmbarquees = Promise.all(f.map(function (x) {
      return fetch(x[2]).then(function (r) { return r.blob(); }).then(function (b) {
        return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { ok('@font-face{font-family:"' + x[0] + '";font-weight:' + x[1] + ';src:url(' + fr.result + ') format("woff2")}'); }; fr.onerror = function () { ok(''); }; fr.readAsDataURL(b); });
      }).catch(function () { return ''; });
    })).then(function (l) { return l.join(''); });
    return policesEmbarquees;
  }
  function svgExport(css) {
    var pl = calculerPlan(); cacheLiens = null;
    if (!pl.boite) return null;
    var b = pl.boite, m = 50, haut = 70, bas = 60;
    var W = Math.round(b.x2 - b.x1 + 2 * m), H = Math.round(b.y2 - b.y1 + haut + bas);
    W = Math.max(W, 620);
    // les notations particulières utilisées dans cet arbre, au-dessus de la légende (sur plusieurs lignes si besoin)
    var tous = Object.keys(S.people).map(function (id) { return S.people[id]; }), plus = [];
    [['fc', 'Petit rond plein : fausse couche'], ['mn', 'Petit symbole barré : enfant mort-né'], ['ivg', 'Petite croix : IVG'], ['encours', 'Triangle : grossesse en cours']].forEach(function (x) { if (tous.some(function (p) { return p.grossesse === x[0]; })) plus.push(x[1]); });
    if (tous.some(function (p) { return p.adopte; })) plus.push('Trait pointillé : adopté·e');
    if (tous.some(function (p) { return p.place; })) plus.push('Placé·e : en famille d’accueil');
    if (tous.some(function (p) { return jumeauDe(p.id); })) plus.push('Traits en V : jumeaux');
    [['proche', 'Trois traits verts : proximité'], ['conflit', 'Zigzag : conflit'], ['rupture', 'Trait coupé : rupture'], ['distance', 'Pointillé léger : distance']].forEach(function (x) { if (S.rels.some(function (r) { return r.type === 'relation' && r.nature === x[0] && existe(r.from) && existe(r.to); })) plus.push(x[1]); });
    var lignesPlus = [];
    plus.forEach(function (t) { var d = lignesPlus.length - 1; if (d >= 0 && (lignesPlus[d] + ' · ' + t).length * 5.8 <= W - 2 * m) lignesPlus[d] += ' · ' + t; else lignesPlus.push(t); });
    H += Math.max(0, lignesPlus.length - 1) * 18;
    var dx = (W - (b.x2 - b.x1)) / 2 - b.x1, dy = haut - b.y1;
    var o = { export: true, badges: badgesDe(detecter()) };
    var h = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
    if (css) h += '<style>' + css + '</style>';
    h += '<rect width="100%" height="100%" fill="#FFF9F7"/>';
    h += '<text x="' + m + '" y="40" font-family="\'Gilda Display\',Georgia,serif" font-size="24" fill="' + PRUNE + '">Mon génosociogramme</text>';
    var d = new Date();
    h += '<text x="' + (W - m) + '" y="40" text-anchor="end" font-family="\'Nunito Sans\',sans-serif" font-size="12" fill="' + PRUNE_DOUX + '">' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + '</text>';
    h += '<g transform="translate(' + dx + ',' + dy + ')">' + dessinRelations(pl) + dessinLiens(pl);
    Object.keys(S.people).forEach(function (id) { h += dessinPersonne(S.people[id], pl.pos[id], o); });
    h += '</g>';
    var ly = H - 24, lx = m;
    var leg = [['m', 'Homme'], ['f', 'Femme'], ['u', 'Non précisé']];
    leg.forEach(function (l) {
      h += '<g transform="translate(' + (lx + 8) + ',' + (ly - 4) + ')">' + symbole({ sex: l[0] }, 7) + ' fill="#fff" stroke="' + PRUNE + '" stroke-width="1.3"/></g>';
      h += '<text x="' + (lx + 22) + '" y="' + ly + '" font-family="\'Nunito Sans\',sans-serif" font-size="11" fill="' + PRUNE_DOUX + '">' + l[1] + '</text>';
      lx += 22 + l[1].length * 6.6 + 26;
    });
    h += '<text x="' + lx + '" y="' + ly + '" font-family="\'Nunito Sans\',sans-serif" font-size="11" fill="' + PRUNE_DOUX + '">Croix : décédé·e · Chiffre : âge · Double contour : toi</text>';
    for (var li = lignesPlus.length - 1; li >= 0; li--) h += '<text x="' + m + '" y="' + (ly - 18 * (lignesPlus.length - li)) + '" font-family="\'Nunito Sans\',sans-serif" font-size="11" fill="' + PRUNE_DOUX + '">' + esc(lignesPlus[li]) + '</text>';
    h += '<text x="' + (W - m) + '" y="' + ly + '" text-anchor="end" font-family="\'Nunito Sans\',sans-serif" font-size="11" font-weight="600" fill="' + CHAMPAGNE + '">genesolia.fr</text>';
    return { svg: h + '</svg>', W: W, H: H };
  }
  function telecharger(blob, nom) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
  function arbreVide() { if (!Object.keys(S.people).length) { alert('Ton arbre est vide pour l’instant.'); return true; } return false; }
  $('bt-image').addEventListener('click', function () {
    if (arbreVide()) return;
    var b = this; b.disabled = true;
    polices().then(function (css) {
      var e = svgExport(css);
      var img = new Image();
      img.onload = function () {
        var k = Math.min(2, 6000 / Math.max(e.W, e.H));
        var c = document.createElement('canvas'); c.width = Math.round(e.W * k); c.height = Math.round(e.H * k);
        var ctx = c.getContext('2d'); ctx.scale(k, k); ctx.drawImage(img, 0, 0);
        c.toBlob(function (bl) { telecharger(bl, 'mon-genosociogramme.png'); b.disabled = false; }, 'image/png');
      };
      img.onerror = function () { b.disabled = false; alert('L’image n’a pas pu être créée. Essaie « Imprimer » puis « Enregistrer en PDF ».'); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(e.svg);
    });
  });
  $('bt-svg').addEventListener('click', function () {
    if (arbreVide()) return;
    polices().then(function (css) { telecharger(new Blob([svgExport(css).svg], { type: 'image/svg+xml' }), 'mon-genosociogramme.svg'); });
  });
  $('bt-imprimer').addEventListener('click', function () {
    if (arbreVide()) return;
    polices().then(function (css) {
      var e = svgExport(css);
      var paysage = e.W >= e.H;
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(f);
      var doc = f.contentDocument;
      doc.open();
      doc.write('<!doctype html><html><head><meta charset="utf-8"><title>Mon génosociogramme</title><style>@page{size:A4 ' + (paysage ? 'landscape' : 'portrait') + ';margin:10mm}html,body{margin:0;background:#fff}svg{display:block;width:100%;height:auto;max-height:' + (paysage ? '188mm' : '275mm') + '}</style></head><body>' + e.svg.replace('<svg ', '<svg preserveAspectRatio="xMidYMin meet" ') + '</body></html>');
      doc.close();
      setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(function () { f.remove(); }, 1500); }, 350);
    });
  });
  var versions = [];
  function dateFr(d) { d = new Date(d); return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  function chargerVersions() {
    var z = $('fs-versions'); if (!z) return;
    if (!utilisateur || !sb || arbreBloque) { z.innerHTML = ''; return; }
    z.innerHTML = '<p class="rep-aide">Chargement des versions…</p>';
    (ARBRE_ID ? sb.from('arbres_supp_versions').select('numero,data,enregistre_le').eq('arbre_id', ARBRE_ID)
      : sb.from('arbres_versions').select('numero,data,enregistre_le').eq('user_id', utilisateur.id)).order('numero', { ascending: false }).limit(30).then(function (r) {
      if (r.error) { z.innerHTML = '<p class="rep-aide">Les versions précédentes n\u2019ont pas pu être chargées.</p>'; return; }
      versions = r.data || [];
      if (!versions.length) { z.innerHTML = '<p class="rep-aide">Aucune version précédente pour l\u2019instant. Une version est gardée au plus toutes les 5 minutes, et à chaque suppression.</p>'; return; }
      z.innerHTML = '<div class="liste-versions">' + versions.map(function (v, i) {
        var n = v.data && v.data.people ? Object.keys(v.data.people).length : 0;
        return '<div class="lien"><span>' + dateFr(v.enregistre_le) + ' · <b>' + n + ' personne' + (n > 1 ? 's' : '') + '</b></span><button type="button" class="bt" data-version="' + i + '">Restaurer</button></div>';
      }).join('') + '</div>';
    });
  }
  $('fs-versions').addEventListener('click', function (e) {
    var b = e.target.closest('[data-version]'); if (!b) return;
    var v = versions[+b.getAttribute('data-version')]; if (!v || !v.data) return;
    if (!confirm('Remplacer ton arbre actuel par la version du ' + dateFr(v.enregistre_le) + ' ? Ton arbre actuel sera lui aussi gardé dans l\u2019historique.')) return;
    memoriser(); charger(v.data); selId = null; repActive = null;
    fermer('fen-sauve'); dessiner(); recentrer(); majBarreActions(); enregistrer(); envoyer();
  });
  $('bt-sauve').addEventListener('click', function () {
    $('fs-texte').innerHTML = utilisateur ? 'Ton arbre est enregistré <b>dans ton espace</b> à chaque modification : tu le retrouves sur n\u2019importe quel ordinateur en te connectant. Les 30 dernières versions sont gardées.' : 'Ton arbre est enregistré <b>seulement dans ce navigateur</b>, sur cet ordinateur. Si tu vides ton navigateur ou changes d\u2019ordinateur, il sera perdu. Pour le garder en sécurité, connecte-toi ou télécharge une copie.';
    $('bt-compte').style.display = utilisateur ? 'none' : '';
    $('fs-bloc-versions').style.display = utilisateur ? '' : 'none';
    ouvrir('fen-sauve');
    chargerVersions();
  });
  $('bt-json').addEventListener('click', function () {
    if (arbreVide()) return;
    var d = new Date();
    telecharger(new Blob([JSON.stringify({ people: S.people, rels: S.rels, nid: S.nid, v: 2 }, null, 1)], { type: 'application/json' }), 'mon-arbre-genesolia-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.json');
  });
  $('bt-ouvrir').addEventListener('click', function () { $('fichier').click(); });
  $('fichier').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (!d || typeof d.people !== 'object') throw new Error();
        if (Object.keys(S.people).length && !confirm('Remplacer ton arbre actuel par celui du fichier ? Tu pourras revenir en arrière avec « Annuler ».')) return;
        memoriser(); charger(d); selId = null; repActive = null;
        fermer('fen-sauve'); dessiner(); recentrer(); majBarreActions(); enregistrer();
      } catch (err) { alert('Ce fichier ne contient pas d’arbre lisible.'); }
      e.target.value = '';
    };
    r.readAsText(f);
  });
  /* Import d'un arbre déjà fait (PDF ou GEDCOM) : lecture et vérification dans assets/import-arbre.js */
  window.GenoArbre = {
    exemple: function () { return EXEMPLE; },
    etat: function () { var e = JSON.parse(JSON.stringify(S)); e.libelles = JSON.parse(JSON.stringify(NOM_EVT)); return e; },   // lecture seule (export GEDCOM)
    ouvrir: ouvrir, fermer: fermer,
    personnes: function () { return Object.keys(S.people).map(function (id) { return { id: id, nom: nomAffiche(S.people[id]), moi: S.people[id].role === 'moi' }; }); },
    // d : { people, rels } avec les identifiants du fichier ; o : { remplacer, moi, meme: { fichier, arbre } }
    importer: function (d, o) {
      o = o || {};
      memoriser();
      if (o.remplacer) S = { people: {}, rels: [], nid: 1 };
      var ids = {};
      if (o.meme && S.people[o.meme.arbre]) ids[o.meme.fichier] = o.meme.arbre;
      Object.keys(d.people).forEach(function (k) {
        var src = d.people[k], p;
        if (ids[k]) {   // même personne déjà dans l'arbre : on complète seulement ce qui manque
          p = S.people[ids[k]];
          ['prenom', 'nom', 'naiss', 'deces', 'metier', 'lieu'].forEach(function (c) { if (!p[c] && src[c]) p[c] = src[c]; });
          if (p.sex === 'u' && src.sex) p.sex = src.sex;
          if (src.decede) p.decede = true;
          if (src.notes) p.notes = p.notes ? p.notes + '\n' + src.notes : src.notes;
          p.events = (p.events || []).concat(src.events || []);
          return;
        }
        p = nouvellePersonne({ prenom: src.prenom || '', nom: src.nom || '', sex: src.sex || 'u', naiss: src.naiss || '', deces: src.deces || '', decede: !!src.decede, metier: src.metier || '', lieu: src.lieu || '', notes: src.notes || '', events: src.events || [] });
        if (o.moi === k && !idMoi()) p.role = 'moi';
        ids[k] = p.id;
      });
      d.rels.forEach(function (r) {
        var a = ids[r.from], b = ids[r.to];
        if (!a || !b || a === b) return;
        if (r.type === 'couple') { if (!relCouple(a, b)) S.rels.push({ from: a, to: b, type: 'couple', statut: r.statut || 'marie' }); return; }
        if (!S.rels.some(function (x) { return x.type === r.type && x.from === a && x.to === b; })) S.rels.push({ from: a, to: b, type: r.type });
      });
      selId = null; repActive = null;
      dessiner(); recentrer(); majBarreActions(); enregistrer();
    }
  };
  $('bt-effacer').addEventListener('click', function () {
    if (!Object.keys(S.people).length) { fermer('fen-sauve'); return; }
    if (!confirm((ARBRE_ID ? 'Vider l’arbre « ' + arbreNom + ' » pour repartir de zéro ?' : 'Effacer tout ton arbre pour repartir de zéro ?') + '\n\nToutes les personnes et leurs informations seront retirées' + (utilisateur ? ', ici et dans ton espace' : '') + '. Pour garder une copie, télécharge-la d’abord depuis « Sauvegardes ».\n\nTu pourras revenir en arrière avec « Annuler » tant que tu restes sur cette page.')) return;
    memoriser(); S = { people: {}, rels: [], nid: 1 }; selId = null; repActive = null;
    fermer('fen-sauve'); dessiner(); recentrer(); majBarreActions(); enregistrer();
  });

  /* ───────── Téléphone ───────── */
  var URL_OUTIL = 'https://genesolia.fr/genosociogramme.html';
  function infoPorte(t) { $('porte-info').textContent = t; }
  $('porte-copier').addEventListener('click', function () {
    var fini = function () { infoPorte('Lien copié. Colle-le dans un mail ou un message pour l’ouvrir sur ton ordinateur.'); };
    if (navigator.clipboard) navigator.clipboard.writeText(URL_OUTIL).then(fini, function () { infoPorte(URL_OUTIL); });
    else infoPorte(URL_OUTIL);
  });
  $('porte-envoyer').addEventListener('click', function () {
    if (navigator.share) { navigator.share({ title: 'Mon arbre familial · Genesolia', text: 'À ouvrir sur mon ordinateur :', url: URL_OUTIL }).catch(function () {}); return; }
    location.href = 'mailto:?subject=' + encodeURIComponent('Mon arbre familial · Genesolia') + '&body=' + encodeURIComponent('À ouvrir sur mon ordinateur : ' + URL_OUTIL);
  });
  $('porte-continuer').addEventListener('click', function () {
    try { sessionStorage.setItem('arbre-telephone', 'ok'); } catch (e) {}
    document.body.classList.remove('porte-ouverte');
    dessiner(); recentrer();
  });
  function surTelephone() {
    var ok = false; try { ok = sessionStorage.getItem('arbre-telephone') === 'ok'; } catch (e) {}
    return !ok && window.matchMedia('(max-width: 760px)').matches;
  }

  /* ───────── Rapport de ton arbre (offre payante) ─────────
     Accès : table Supabase « acces_premium » (une ligne par compte, avec une date de fin).
     Tant que les liens de paiement sont vides, les boutons proposent d'être prévenue (Formspree). */
  var RAPPORT = {
    offert: true,         // true : rapport offert à toute personne connectée ; false : offres payantes ci-dessous
    prix: '9 €', duree: '7 jours',
    abo: '29 € par mois',
    lienAchat: '',        // lien de paiement Stripe pour le rapport (9 €)
    lienAbonnement: '',   // lien de paiement Stripe pour l'abonnement (29 €/mois, après 1 mois gratuit)
    formspree: 'https://formspree.io/f/xdawvnby'
  };
  var TEXTES_RAPPORT = {
    anniversaire: { titre: 'Le syndrome d’anniversaire', intro: 'Tu traverses aujourd’hui un âge auquel quelqu’un de ta famille a vécu un événement marquant. En psychogénéalogie, on observe que certaines périodes de la vie peuvent réveiller une mémoire familiale, comme si une date intérieure se rappelait à nous. Ce n’est pas une prédiction : c’est une invitation à être attentive à cette période.', pistes: ['Qu’est-ce qui se passe dans ta vie en ce moment, et qu’est-ce que cela réveille en toi ?', 'Que sais-tu vraiment de ce que cette personne a vécu à cet âge ?', 'Qu’aimerais-tu vivre différemment, toi, à cet âge ?'], geste: 'Écris une phrase pour cette personne : « Tu as vécu cela à cet âge. Moi, je choisis de vivre… »' },
    date: { titre: 'Les dates qui reviennent', intro: 'Plusieurs naissances ou décès tombent le même jour de l’année. Ces dates partagées peuvent tisser des liens invisibles entre les personnes : une naissance qui répond à un départ, un anniversaire chargé de plusieurs histoires.', pistes: ['Comment cette date est-elle vécue dans ta famille : une fête, un silence, un malaise ?', 'T’arrive-t-il de te sentir différente à cette période de l’année ?', 'Qui est né à la suite de qui, et qu’est-ce que cela a pu signifier pour la famille ?'], geste: 'Cette année, à cette date, offre-toi un moment qui n’appartient qu’à toi.' },
    gisant: { titre: 'La piste du gisant', intro: 'Une personne de ton arbre est décédée, et quelqu’un né ensuite lui est relié : par une naissance proche de ce décès, par son prénom, ou par une naissance le jour anniversaire de sa mort. Le Dr Salomon Sellam appelle « syndrome du gisant » cette situation où, après un deuil qui n’a pas pu se faire, un enfant de la famille porterait sans le savoir une part de la vie du défunt. C’est une hypothèse de lecture, pas une vérité sur ta famille.', pistes: ['Ce décès a-t-il pu être pleuré, ou est-ce qu’on n’en parlait pas ?', 'La personne reliée a-t-elle parfois l’impression de ne pas vivre sa propre vie ?', 'Qui a choisi ce prénom, ou comment cette date anniversaire est-elle vécue dans la famille ?'], geste: 'Écris le prénom et les dates de la personne disparue, puis ce que tu sais d’elle : lui redonner sa place, c’est rendre la leur aux vivants.' },
    depart: { titre: 'Des départs précoces', intro: 'Plusieurs personnes proches de toi dans l’arbre sont parties jeunes. Ces deuils ont souvent marqué ceux qui sont restés, parfois sans qu’on en parle. Ce sont des pistes à explorer avec douceur.', pistes: ['Ces départs ont-ils pu être pleurés, ou est-ce qu’on n’en parlait pas ?', 'Quelqu’un est-il né peu de temps après l’un de ces départs ? Porte-t-il son prénom ?', 'Y a-t-il en toi une inquiétude liée à l’un de ces âges ?'], geste: 'Écris le prénom de ces personnes et allume une bougie pour elles : leur redonner une place, c’est libérer celle des vivants.' },
    epreuve: { titre: 'Les mêmes événements', intro: 'Un même type d’événement revient chez plusieurs personnes, parfois au même âge. C’est souvent le signe d’une boucle familiale : une façon de vivre, d’aimer ou de perdre qui se transmet d’une génération à l’autre.', pistes: ['Comment cet événement a-t-il été vécu, puis raconté, à chaque génération ?', 'Quelle croyance ta famille en a-t-elle tirée ? (« les hommes partent », « l’argent ne reste pas »…)', 'Où en es-tu, toi, avec ce type d’événement ?'], geste: 'Quand tu sens cette situation revenir dans ta vie, demande-toi : « Est-ce vraiment à moi, ou est-ce que ça ressemble à quelqu’un de ma famille ? »' },
    schema: { titre: 'Les schémas familiaux', intro: 'Plusieurs personnes partagent une même façon d’être : s’effacer, porter la famille, se taire, partir. Ces schémas sont rarement choisis : ils se transmettent par l’exemple et par fidélité.', pistes: ['Te reconnais-tu dans ce schéma ? Dans quels domaines de ta vie ?', 'Qu’est-ce que ce schéma a protégé, autrefois ?', 'Que se passerait-il si tu faisais autrement ?'], geste: 'Écris une phrase de permission : « Toi, tu as dû… Moi, j’ai le droit de… »' },
    prenom: { titre: 'Les prénoms transmis', intro: 'Un même prénom circule dans ta famille. Donner un prénom, c’est souvent transmettre une histoire, une attente, parfois une place à reprendre.', pistes: ['Pourquoi ce prénom a-t-il été choisi ? Qu’en disait-on ?', 'Quelles qualités ou quelles histoires sont attachées à ce prénom ?', 'La personne qui le porte aujourd’hui vit-elle sa propre vie, ou celle d’un autre ?'], geste: 'Si c’est ton prénom, écris trois choses qui n’appartiennent qu’à toi.' },
    metier: { titre: 'Les métiers qui se répètent', intro: 'Plusieurs personnes ont exercé dans le même domaine. Un métier peut se transmettre par vocation, par fidélité ou par réparation : prendre soin, servir, protéger, nourrir…', pistes: ['Ce métier a-t-il été choisi, ou s’est-il imposé ?', 'Que cherchait-on à réparer ou à protéger à travers lui ?', 'Ton propre chemin professionnel suit-il cette lignée, ou s’en écarte-t-il ?'], geste: 'Note ce que tu aimes vraiment faire, indépendamment de ce qu’on attendait de toi.' }
  };
  var ORDRE_TYPES = ['anniversaire', 'gisant', 'epreuve', 'schema', 'date', 'depart', 'prenom', 'metier'];
  var accesRapport = null;

  function verifierAcces() {
    if (!sb || !utilisateur) return Promise.resolve(null);
    if (RAPPORT.offert) return Promise.resolve({ offre: 'offert', valide_jusqu: '2999-12-31', libre: true });
    return sb.from('acces_premium').select('offre,valide_jusqu').eq('user_id', utilisateur.id).maybeSingle()
      .then(function (r) { return (r && r.data && new Date(r.data.valide_jusqu) > new Date()) ? r.data : null; }, function () { return null; });
  }
  function statsArbre() {
    var ids = Object.keys(S.people), pl = calculerPlan();
    var gens = {}; ids.forEach(function (id) { if (pl.pos[id]) gens[pl.pos[id].y] = 1; });
    var couples = S.rels.filter(function (r) { return r.type === 'couple' && existe(r.from) && existe(r.to); });
    var evts = 0; ids.forEach(function (id) { evts += (S.people[id].events || []).length; });
    return {
      personnes: ids.length, generations: Object.keys(gens).length,
      decedes: ids.filter(function (id) { return decede(S.people[id]); }).length,
      unions: couples.length,
      separations: couples.filter(function (r) { return r.statut === 'separe' || r.statut === 'divorce'; }).length,
      evenements: evts,
      sansDate: ids.filter(function (id) { return !annee(S.people[id].naiss); }).map(function (id) { return nomAffiche(S.people[id]); }),
      sansEvt: ids.filter(function (id) { return !(S.people[id].events || []).length; }).map(function (id) { return nomAffiche(S.people[id]); })
    };
  }
  function grouperReps(reps) {
    var g = {}; reps.forEach(function (r) { (g[r.type] = g[r.type] || []).push(r); });
    return ORDRE_TYPES.filter(function (t) { return g[t]; }).map(function (t) { return { type: t, items: g[t] }; });
  }
  function dateLongue(d) { return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }

  function htmlRapport(css, e) {
    var reps = detecter(), groupes = grouperReps(reps), st = statsArbre(), d = new Date();
    var C = '@page{size:A4;margin:16mm 16mm 18mm}' + css +
      '*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{margin:0;font-family:"Nunito Sans",sans-serif;color:#4E2A47;font-size:10.8pt;line-height:1.6}' +
      'h1,h2,h3{font-family:"Gilda Display",Georgia,serif;font-weight:400;color:#6B2F5B;line-height:1.15;margin:0}' +
      '.couv{height:255mm;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;border-radius:8mm;padding:16mm 14mm;color:#FFF4F6;background:radial-gradient(120mm 90mm at 85% 10%,rgba(231,167,158,.45),transparent 60%),linear-gradient(160deg,#3B1747,#6B2F5B)}' +
      '.couv .marque{font-family:"Gilda Display",serif;font-size:15pt}.couv h1{color:#fff;font-size:38pt;margin:4mm 0 5mm}.couv p{color:#F7E6EE;font-size:12pt;max-width:130mm}' +
      '.couv .sur{font-size:8.5pt;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#F3DCC0}' +
      '.chiffres{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:8mm}.chiffres div{background:rgba(255,255,255,.1);border:.6pt solid rgba(243,220,192,.4);border-radius:4mm;padding:4mm}.chiffres b{display:block;font-family:"Gilda Display",serif;font-weight:400;font-size:22pt;color:#fff}.chiffres span{font-size:9pt;color:#F3DCC0}' +
      '.page{page-break-before:always}.sur2{font-size:8pt;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#B98A55;margin-bottom:2mm}' +
      'h2{font-size:22pt;margin-bottom:5mm}h3{font-size:14pt;margin:6mm 0 2mm}.intro{color:#6E4466;margin:0 0 5mm}' +
      '.arbre-img{border:.6pt solid #EBCFD5;border-radius:4mm;padding:3mm;background:#FFF9F7}.arbre-img svg{display:block;width:100%;height:auto;max-height:225mm}' +
      '.rep{border:.6pt solid #EBCFD5;border-left:2.4mm solid var(--c);border-radius:3mm;padding:3mm 4mm;margin:0 0 3mm;break-inside:avoid}.rep b{display:block;font-weight:600;color:var(--c);font-size:10pt}.rep p{margin:1mm 0 0}' +
      '.pistes{background:#FFF5EA;border:.6pt solid #F3DCC0;border-radius:4mm;padding:4mm 5mm;margin:4mm 0;break-inside:avoid}.pistes ol{margin:2mm 0 0;padding-left:5mm}.pistes li{margin-bottom:1.5mm}' +
      '.geste{background:#FCEFF3;border-radius:4mm;padding:4mm 5mm;break-inside:avoid}.geste b{display:block;font-size:8pt;letter-spacing:.12em;text-transform:uppercase;color:#B5485C;margin-bottom:1mm}' +
      '.section{break-inside:auto;margin-bottom:9mm}h2,h3{break-after:avoid}.notes{break-inside:avoid;margin-top:6mm}.lignes{border-bottom:.6pt solid #EBCFD5;height:9mm}' +
      'table{width:100%;border-collapse:collapse;margin:3mm 0 5mm}td,th{text-align:left;padding:2mm 3mm;border-bottom:.6pt solid #EBCFD5;font-size:10pt}th{font-size:8pt;letter-spacing:.08em;text-transform:uppercase;color:#6B2F5B;background:#F7E6E8}' +
      '.discret{color:#8E6383;font-size:8.5pt}.fin{margin-top:8mm;padding:5mm 6mm;border-radius:4mm;background:#6B2F5B;color:#F7E6EE}.fin b{color:#fff}';
    var h = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Le rapport de ton arbre · Genesolia</title><style>' + C + '</style></head><body>';
    h += '<section class="couv"><div class="marque">Genesolia</div><div><div class="sur">Rapport personnel · ' + esc(dateLongue(d)) + '</div><h1>Le rapport<br>de ton arbre</h1>' +
      '<p>Ce que ton arbre familial laisse apparaître : les dates, les âges, les prénoms et les façons de vivre qui se répètent, avec des pistes de réflexion pour chacun.</p>' +
      '<div class="chiffres"><div><b>' + st.personnes + '</b><span>personnes</span></div><div><b>' + st.generations + '</b><span>générations</span></div><div><b>' + reps.length + '</b><span>répétitions repérées</span></div></div></div>' +
      '<p class="discret" style="color:#E3C9DA">Ce rapport propose une lecture symbolique de ton histoire familiale. Il ne remplace pas un avis médical ou psychologique.</p></section>';
    // L'arbre
    h += '<section><div class="sur2">Ton arbre</div><h2>Ton génosociogramme</h2><div class="arbre-img">' + e.svg.replace('<svg ', '<svg preserveAspectRatio="xMidYMin meet" ') + '</div></section>';
    // En chiffres
    h += '<section class="page"><div class="sur2">Vue d’ensemble</div><h2>Ton arbre en chiffres</h2><table><tr><th>Ce que contient ton arbre</th><th>Nombre</th></tr>' +
      [['Personnes', st.personnes], ['Générations', st.generations], ['Personnes décédées', st.decedes], ['Unions', st.unions], ['Séparations ou divorces', st.separations], ['Événements notés', st.evenements], ['Répétitions repérées', reps.length]].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</table>';
    if (groupes.length) {
      h += '<h3>Les fils les plus présents</h3><p class="intro">Voici, par ordre d’importance, les grands thèmes qui traversent ton arbre. Chacun est détaillé dans les pages suivantes.</p><table><tr><th>Thème</th><th>Répétitions</th></tr>' +
        groupes.slice().sort(function (a, b) { return b.items.length - a.items.length; }).map(function (g) { return '<tr><td>' + esc(TEXTES_RAPPORT[g.type].titre) + '</td><td>' + g.items.length + '</td></tr>'; }).join('') + '</table>';
    } else {
      h += '<p class="intro">Ton arbre ne fait pas encore apparaître de répétition. Ce n’est pas qu’il n’y en a pas : c’est souvent qu’il manque des dates, des âges ou des événements. La page « Pour aller plus loin » t’indique quoi compléter.</p>';
    }
    h += '</section>';
    // Sections par thème
    groupes.forEach(function (g, i) {
      var T = TEXTES_RAPPORT[g.type];
      h += '<section class="section page"><div class="sur2">Thème ' + (i + 1) + '</div><h2>' + esc(T.titre) + '</h2><p class="intro">' + esc(T.intro) + '</p>';
      h += g.items.map(function (r) { return '<div class="rep" style="--c:' + r.c + '"><b>' + esc(r.label) + '</b><p>' + esc(r.desc) + '</p></div>'; }).join('');
      h += '<div class="pistes"><b>Pistes de réflexion</b><ol>' + T.pistes.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></div>';
      h += '<div class="geste"><b>Pour sortir de la boucle</b>' + esc(T.geste) + '</div>';
      h += '<div class="notes"><h3>Mes notes</h3>' + new Array(7).join('<div class="lignes"></div>') + '</div></section>';
    });
    h += sectionNumeroRapport();
    h += sectionAstroRapport();
    // Pour aller plus loin
    h += '<section class="page"><div class="sur2">Pour aller plus loin</div><h2>Ce que ton arbre ne dit pas encore</h2><p class="intro">Plus ton arbre est complet, plus les répétitions apparaissent. Voici ce que tu pourrais compléter, puis régénérer ton rapport.</p>';
    if (st.sansDate.length) h += '<h3>Les dates de naissance manquantes</h3><p>' + esc(st.sansDate.slice(0, 30).join(', ')) + (st.sansDate.length > 30 ? '…' : '') + '</p>';
    if (st.sansEvt.length) h += '<h3>Les personnes sans événement noté</h3><p>' + esc(st.sansEvt.slice(0, 30).join(', ')) + (st.sansEvt.length > 30 ? '…' : '') + '</p><p class="discret">Un départ, une séparation, un déménagement, une réussite, un secret… même approximatif, avec un âge, c’est ce qui fait apparaître les répétitions.</p>';
    h += '<h3>Les questions à poser à ta famille</h3><ol><li>Comment se sont rencontrés tes grands-parents, et comment l’histoire a-t-elle continué ?</li><li>Qui est parti, ou dont on ne parle plus ?</li><li>Qu’est-ce qui a été dur pour eux, à quel âge ?</li><li>D’où viennent les prénoms de la famille ?</li><li>Quelles phrases revenaient souvent à table ?</li></ol>';
    h += '<div class="fin"><b>Et maintenant ?</b> Repérer une répétition, c’est déjà commencer à en sortir. Si tu veux aller plus loin, la formation « Sors de la boucle » t’accompagne pas à pas pour arrêter de répéter ce qui se transmet. Plus d’informations sur genesolia.fr/formation.html</div>';
    h += '<p class="discret" style="margin-top:6mm">Rapport généré le ' + esc(dateLongue(d)) + ' sur genesolia.fr. Ce rapport propose une lecture symbolique de ton histoire familiale, à partir des informations que tu as saisies. Il ne remplace pas un avis médical ou psychologique.</p></section>';
    return h + '</body></html>';
  }

  function imprimerRapport(btn) {
    if (btn) { btn.disabled = true; btn.textContent = 'Préparation du rapport…'; }
    chargerAstro().catch(function () {}).then(polices).then(function (css) {
      var e = svgExport(css);
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(f);
      var doc = f.contentDocument; doc.open(); doc.write(htmlRapport(css, e)); doc.close();
      setTimeout(function () {
        f.contentWindow.focus(); f.contentWindow.print();
        if (btn) { btn.disabled = false; btn.textContent = 'Générer mon rapport (PDF)'; }
        setTimeout(function () { f.remove(); }, 2000);
      }, 500);
    });
  }

  function lienPaiement(base) {
    if (!base) return '';
    var u = base + (base.indexOf('?') < 0 ? '?' : '&');
    if (utilisateur) u += 'client_reference_id=' + encodeURIComponent(utilisateur.id) + (utilisateur.email ? '&prefilled_email=' + encodeURIComponent(utilisateur.email) : '');
    return u;
  }

  function contenuApercu(reps) {
    var groupes = grouperReps(reps);
    var h = '';
    if (!groupes.length) {
      h += '<p class="rap-texte">Ton arbre ne fait pas encore apparaître de répétition. Ajoute des dates de naissance, des âges et des événements : c’est ce qui les fait apparaître. Le rapport t’indiquera aussi quoi compléter.</p>';
    } else {
      h += '<p class="rap-texte">Ton arbre fait apparaître <b>' + reps.length + ' répétition' + (reps.length > 1 ? 's' : '') + '</b> dans ' + groupes.length + ' thème' + (groupes.length > 1 ? 's' : '') + ' :</p>';
      h += '<ul class="rap-themes">' + groupes.map(function (g) { return '<li><span>' + esc(TEXTES_RAPPORT[g.type].titre) + '</span><b>' + g.items.length + '</b></li>'; }).join('') + '</ul>';
      var r0 = groupes[0].items[0], T0 = TEXTES_RAPPORT[groupes[0].type];
      h += '<div class="rap-extrait"><p class="rap-sur">Extrait du rapport</p><div class="rap-rep" style="--c:' + r0.c + '"><b>' + esc(r0.label) + '</b><span>' + esc(r0.desc) + '</span></div><p class="rap-piste"><b>Piste de réflexion :</b> ' + esc(T0.pistes[0]) + '</p></div>';
      if (reps.length > 1) h += '<p class="rap-flou" aria-hidden="true">' + reps.slice(1, 4).map(function (r) { return esc(r.label); }).join(' · ') + '</p><p class="rap-cadenas">Les ' + (reps.length - 1) + ' autres répétitions, leurs explications et leurs pistes sont dans le rapport complet.</p>';
    }
    h += '<p class="rap-contenu">Le rapport complet (PDF à imprimer ou à garder) contient : ton arbre, tes chiffres clés, chaque répétition expliquée avec ses pistes de réflexion et un geste pour sortir de la boucle, ta lignée en nombres (numérologie) et dans les étoiles (astrologie) avec leurs échos, des pages de notes, et ce qu’il te reste à compléter.</p>';
    return h;
  }

  function ouvrirRapport() {
    var fen = $('fen-rapport'), corps = $('fr-corps');
    if (Object.keys(S.people).length < 3) {
      corps.innerHTML = '<p class="rap-texte">Ajoute au moins trois personnes à ton arbre (toi, tes parents…) pour obtenir ton rapport. Plus il est complet, plus le rapport est riche.</p>';
      ouvrir('fen-rapport'); return;
    }
    var reps = detecter();
    corps.innerHTML = '<p class="rap-texte">Un instant…</p>';
    ouvrir('fen-rapport');
    verifierAcces().then(function (acces) {
      accesRapport = acces;
      if (acces) {
        corps.innerHTML = (acces.libre ? '<p class="rap-texte"><b>Ton rapport est offert.</b> Complète ton arbre et régénère-le autant de fois que tu veux : il suit chaque ajout.</p>' : '<p class="rap-texte">Ton accès au rapport est actif jusqu’au <b>' + esc(dateLongue(new Date(acces.valide_jusqu))) + '</b>. Tu peux compléter ton arbre et régénérer ton rapport autant de fois que tu veux d’ici là.</p>') +
          '<button class="bt plein rap-gros" type="button" id="bt-generer">Générer mon rapport (PDF)</button>' +
          '<p class="rap-aide">Une fenêtre d’impression s’ouvre : choisis <b>« Enregistrer au format PDF »</b> comme imprimante pour garder ton rapport.</p>';
        $('bt-generer').addEventListener('click', function () { imprimerRapport(this); });
        return;
      }
      var h = contenuApercu(reps);
      if (RAPPORT.offert) {
        h += '<div class="rap-offre rap-reco" style="margin-bottom:.9rem"><p class="rap-nom">Ton rapport complet, offert</p><p>Toutes les répétitions de ton arbre lues par cycle, les nombres et les étoiles de ta lignée, en PDF à garder. Il suffit d’un compte gratuit : il garde aussi ton arbre en sécurité sur tous tes appareils.</p>' +
          '<a class="bt plein rap-gros" href="login.html?retour=genosociogramme.html">Créer mon compte et recevoir mon rapport</a></div>';
        corps.innerHTML = h;
        return;
      }
      h += '<div class="rap-offres">' +
        '<div class="rap-offre"><p class="rap-prix">' + RAPPORT.prix + '</p><p class="rap-nom">Mon rapport</p><p>Ton rapport complet, et ' + RAPPORT.duree + ' pour compléter ton arbre et le régénérer autant de fois que tu veux.</p>' + boutonOffre('rapport') + '</div>' +
        '<div class="rap-offre rap-reco"><p class="rap-badge">Le plus complet</p><p class="rap-prix">' + RAPPORT.abo + '</p><p class="rap-nom">L’abonnement</p><p>Ton rapport mis à jour à chaque changement de ton arbre, et chaque mois, <a href="mon-mois.html?exemple" target="_blank">ton mois personnel et les dates de ton arbre</a>. Sans engagement.</p>' + boutonOffre('abonnement') + '</div>' +
      '</div>';
      if (!utilisateur) h += '<p class="rap-aide">Pour obtenir ton rapport, il faut un compte gratuit : il permet aussi de retrouver ton arbre sur tous tes appareils. <a href="login.html?retour=genosociogramme.html">Créer mon compte ou me connecter</a></p>';
      h += '<div id="rap-prevenir"></div>';
      corps.innerHTML = h;
      corps.querySelectorAll('[data-offre]').forEach(function (b) { b.addEventListener('click', function () { prevenir(b.getAttribute('data-offre')); }); });
    });
  }
  function boutonOffre(offre) {
    var lien = lienPaiement(offre === 'rapport' ? RAPPORT.lienAchat : RAPPORT.lienAbonnement);
    var lib = offre === 'rapport' ? 'Obtenir mon rapport' : 'Je m’abonne';
    if (!utilisateur) return '<a class="bt' + (offre === 'abonnement' ? ' plein' : '') + ' rap-gros" href="login.html?retour=genosociogramme.html">' + lib + '</a>';
    if (lien) return '<a class="bt' + (offre === 'abonnement' ? ' plein' : '') + ' rap-gros" href="' + esc(lien) + '" target="_blank" rel="noopener">' + lib + '</a>';
    return '<button class="bt' + (offre === 'abonnement' ? ' plein' : '') + ' rap-gros" type="button" data-offre="' + offre + '">' + lib + '</button>';
  }
  function prevenir(offre) {
    var z = $('rap-prevenir');
    z.innerHTML = '<form class="rap-form" novalidate><p class="rap-texte"><b>Le paiement en ligne arrive très bientôt.</b> Laisse ton e-mail : tu seras prévenue dès l’ouverture, avec ton premier rapport à prix réduit.</p>' +
      '<div class="rap-ligne"><input type="email" name="email" required placeholder="Ton e-mail" value="' + esc((utilisateur && utilisateur.email) || '') + '" aria-label="Ton e-mail"><button class="bt plein" type="submit">Me prévenir</button></div>' +
      '<label class="rap-accord"><input type="checkbox" name="accord" required> J’accepte de recevoir un e-mail de Genesolia à ce sujet. <a href="confidentialite.html" target="_blank">Mes données</a></label><p class="rap-erreur" role="alert"></p></form>';
    var f = z.querySelector('form');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = f.querySelector('.rap-erreur'), email = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Indique une adresse e-mail valide.'; return; }
      if (!f.accord.checked) { err.textContent = 'Coche la case d’accord.'; return; }
      var data = new FormData(); data.append('email', email); data.append('offre', offre === 'rapport' ? 'Rapport ' + RAPPORT.prix : 'Abonnement ' + RAPPORT.abo);
      data.append('repetitions', String(detecter().length)); data.append('personnes', String(Object.keys(S.people).length));
      data.append('_subject', 'Intérêt pour le rapport de l’arbre');
      if (window.GenesoliaN8N) window.GenesoliaN8N('genesolia-interet', data);
      f.querySelector('button').disabled = true;
      fetch(RAPPORT.formspree, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); z.innerHTML = '<p class="rap-merci">Merci ! Tu seras prévenue dès que le rapport sera disponible.</p>'; })
        .catch(function () { f.querySelector('button').disabled = false; err.textContent = 'L’envoi n’a pas fonctionné. Réessaie dans un instant.'; });
    });
    z.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $('bt-rapport').addEventListener('click', ouvrirRapport);


  /* ───────── Numérologie de la lignée ───────── */
  var NUM = window.Numerologie || null;
  function dateComplete(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || ''); }
  function numeroLignee() {
    var pl = calculerPlan(), moi = idMoi(), auj = new Date();
    var gens = {}; Object.keys(S.people).forEach(function (id) { if (pl.pos[id]) gens[id] = pl.pos[id].y; });
    var lst = Object.keys(S.people).filter(function (id) { return !petit(S.people[id]); }).map(function (id) {
      var p = S.people[id], t = NUM.theme(p.prenom || '', p.nom || '', dateComplete(p.naiss) ? p.naiss : '', auj);
      var sph = window.Guematrie && p.prenom ? window.Guematrie.prenom(p.prenom).sphere : null;
      return { id: id, p: p, nom: nomComplet(p) || 'Sans nom', lien: id === moi ? 'toi' : lienDe(id), gen: gens[id], t: t, sphere: sph, moi: id === moi, vivant: !decede(p) };
    }).filter(function (x) { return x.t.chemin || x.t.expression; });
    lst.sort(function (a, b) { return (a.gen == null ? 99 : a.gen) - (b.gen == null ? 99 : b.gen) || (b.moi - a.moi); });
    var echos = [];
    function grouper(cle, type) {
      var g = {};
      lst.forEach(function (x) { var v = cle === 'sphere' ? x.sphere : x.t[cle]; if (v) (g[v] = g[v] || []).push(x); });
      Object.keys(g).forEach(function (v) {
        var xs = g[v], ng = {}; xs.forEach(function (x) { ng[x.gen] = 1; });
        var nbGen = Object.keys(ng).length;
        if (xs.length >= 2 && nbGen >= 2) echos.push({ type: type, n: +v, gens: nbGen, pers: xs, toi: xs.some(function (x) { return x.moi; }) });
      });
    }
    grouper('chemin', 'chemin');
    grouper('expression', 'expression');
    if (window.Guematrie) grouper('sphere', 'sphere');
    var avecChemin = lst.filter(function (x) { return x.t.chemin; });
    if (avecChemin.length >= 5) {
      var vus = {}; avecChemin.forEach(function (x) { vus[NUM.base(x.t.chemin)] = 1; });
      var abs = []; for (var k = 1; k <= 9; k++) if (!vus[k]) abs.push(k);
      if (abs.length && abs.length <= 4) echos.push({ type: 'absent', nombres: abs, pers: [] });
    }
    var me = lst.find(function (x) { return x.moi; });
    if (me && me.t.annee) {
      var memes = lst.filter(function (x) { return !x.moi && x.vivant && x.t.annee === me.t.annee; });
      if (memes.length) echos.push({ type: 'annee', n: me.t.annee, pers: [me].concat(memes), toi: true });
    }
    // À ton âge, qui traversait la même grande période que toi ?
    if (me && me.t.periodeActuelle && me.t.age != null) {
      var pn = me.t.periodeActuelle.n, memesPer = [];
      lst.forEach(function (x) {
        if (x.moi || !x.t.periodes) return;
        var per = NUM.periodeA(x.t, me.t.age);
        if (!per || per.n !== pn) return;
        var fin = per.a == null ? 200 : per.a;
        var evts = (x.p.events || []).filter(function (ev) { var a = parseInt(ev.age, 10); return !isNaN(a) && a >= per.de && a < fin; })
          .map(function (ev) { return (NOM_EVT[ev.type] || ev.type || 'événement').toLowerCase() + ' à ' + parseInt(ev.age, 10) + ' ans'; });
        memesPer.push({ x: x, per: per, evts: evts });
      });
      if (memesPer.length) echos.push({ type: 'periode', n: pn, age: me.t.age, details: memesPer, pers: [me].concat(memesPer.map(function (m) { return m.x; })), toi: true, gens: 2 });
    }
    // Les nombres d'apprentissage partagés
    var parDette = {};
    lst.forEach(function (x) { (x.t.dettes || []).forEach(function (d) { (parDette[d.n] = parDette[d.n] || {})[x.id] = x; }); });
    Object.keys(parDette).forEach(function (n) {
      var xs = Object.keys(parDette[n]).map(function (id) { return parDette[n][id]; }), ng = {};
      xs.forEach(function (x) { ng[x.gen] = 1; });
      if (xs.length >= 2 && Object.keys(ng).length >= 2) echos.push({ type: 'dette', n: +n, gens: Object.keys(ng).length, pers: xs, toi: xs.some(function (x) { return x.moi; }) });
    });
    echos.sort(function (a, b) { return (b.toi ? 1 : 0) - (a.toi ? 1 : 0) || (b.gens || 0) - (a.gens || 0) || b.pers.length - a.pers.length; });
    return { liste: lst, echos: echos, moi: me, incomplets: Object.keys(S.people).length - lst.length };
  }
  function prenomsDe(xs) { return xs.map(function (x) { return x.moi ? 'toi' : (x.p.prenom || x.nom) + (x.lien ? ' (' + x.lien.toLowerCase() + ')' : ''); }).join(', ').replace(/, ([^,]*)$/, ' et $1'); }
  function titreEcho(e) {
    if (e.type === 'chemin') return 'Le chemin de vie ' + e.n + ' revient sur ' + e.gens + ' générations';
    if (e.type === 'expression') return 'Le nombre d’expression ' + e.n + ' revient sur ' + e.gens + ' générations';
    if (e.type === 'sphere') return 'Des prénoms qui mènent ' + window.Guematrie.SPHERES[e.n].nom.toLowerCase().replace(/^le /, 'au ').replace(/^la /, 'à la ').replace(/^l’|^l'/, 'à l’') + ' sur ' + e.gens + ' générations';
    if (e.type === 'absent') return e.nombres.length > 1 ? 'Les nombres ' + e.nombres.join(', ').replace(/, (\d+)$/, ' et $1') + ' n’apparaissent dans aucun chemin de vie' : 'Le nombre ' + e.nombres[0] + ' n’apparaît dans aucun chemin de vie';
    if (e.type === 'periode') return 'À ton âge, ' + (e.details.length > 1 ? e.details.length + ' personnes traversaient' : (e.details[0].x.p.prenom || e.details[0].x.nom) + ' traversait') + ' aussi une réalisation ' + e.n;
    if (e.type === 'dette') return 'Le nombre d’apprentissage ' + e.n + ' revient sur ' + e.gens + ' générations';
    return 'Cette année, vous êtes ' + e.pers.length + ' en année personnelle ' + e.n;
  }
  function sousEcho(e) {
    if (e.type === 'absent') return 'Dans toute ta lignée';
    if (e.type === 'periode') return NUM.NOMBRES[e.n].nom + ' · ' + e.details.map(function (d) { return (d.x.p.prenom || d.x.nom) + (d.x.lien ? ' (' + d.x.lien.toLowerCase() + ')' : '') + (d.evts.length ? ' : ' + d.evts.join(', ') : ''); }).join(' ; ');
    if (e.type === 'dette') return NUM.APPRENTISSAGES[e.n].titre + ' · ' + prenomsDe(e.pers);
    if (e.type === 'sphere') return 'Arbre de vie, sphère ' + e.n + ' · ' + prenomsDe(e.pers);
    return (e.type === 'annee' ? '' : NUM.NOMBRES[e.n].nom + ' · ') + prenomsDe(e.pers);
  }
  function texteEcho(e) {
    if (e.type === 'sphere') { var SP = window.Guematrie.SPHERES[e.n]; return { texte: 'Sur l’arbre de vie, la valeur des lettres de ces prénoms conduit à la même sphère, ' + SP.nom.toLowerCase() + '. ' + SP.essence + ' ' + SP.famille, piste: SP.question + ' Qui a choisi ces prénoms, et en pensant à qui ?' }; }
    if (e.type === 'chemin' || e.type === 'expression') {
      var T = NUM.NOMBRES[e.n];
      return { texte: T.essence + ' ' + T.famille, piste: 'Le ' + e.n + ' apporte ' + T.mots.join(', ') + '. ' + (e.toi ? 'Qu’as-tu reçu de ' + (e.pers.length > 2 ? 'ces personnes' : 'cette personne') + ' ?' : 'Qu’est-ce que ces personnes ont vécu de semblable ?') + ' Le défi du ' + e.n + ', pour toi : ' + T.defi.charAt(0).toLowerCase() + T.defi.slice(1) };
    }
    if (e.type === 'absent') return { texte: 'En numérologie, un nombre absent d’une lignée évoque une qualité que la famille a eu peu l’occasion de vivre : ' + e.nombres.map(function (n) { return 'le ' + n + ', ' + NUM.ABSENTS[n].replace(/\.$/, ''); }).join(' ; ') + '.', piste: 'C’est peut-être une qualité que ta génération est invitée à développer. Où pourrais-tu commencer à la vivre ?' };
    if (e.type === 'periode') {
      var avecEvt = e.details.filter(function (d) { return d.evts.length; });
      return { texte: 'Tu as ' + e.age + ' ans et tu es dans ta réalisation ' + e.n + ' : ' + NUM.PERIODES[e.n].charAt(0).toLowerCase() + NUM.PERIODES[e.n].slice(1) + ' Au même âge, ' + (e.details.length > 1 ? 'ces personnes de ta famille vivaient' : 'cette personne de ta famille vivait') + ' une période de la même couleur.' + (avecEvt.length ? ' Ce qu’elles y ont vécu est noté dans ton arbre.' : ''),
        piste: avecEvt.length ? 'Regarde ce qu’elles ont vécu pendant cette période. Qu’est-ce qui résonne avec ta vie aujourd’hui ? Qu’as-tu envie de vivre autrement ?' : 'Que sais-tu de ce qu’elles ont vécu à cette période de leur vie ? C’est une bonne question à poser à ta famille.' };
    }
    if (e.type === 'dette') { var D = NUM.APPRENTISSAGES[e.n]; return { texte: D.titre + ' : ' + D.texte.charAt(0).toLowerCase() + D.texte.slice(1), piste: 'Cet apprentissage traverse plusieurs générations. Qui l’a vécu avant toi, et comment ? Que peux-tu en faire, toi, aujourd’hui ?' }; }
    var A = NUM.ANNEES[e.n];
    return { texte: A.titre + '. ' + A.texte, piste: 'Vivre la même année personnelle crée des résonances. Qu’est-ce qui se joue en ce moment pour vous ' + (e.pers.length > 2 ? 'tous' : 'deux') + ' ?' };
  }
  function nb(n) { return n ? n : '<span class="nl-vide">·</span>'; }

  function ouvrirNumero() {
    var corps = $('fn-corps');
    if (!NUM) { corps.innerHTML = '<p class="rap-texte">Le calcul n’a pas pu se charger. Recharge la page.</p>'; ouvrir('fen-numero'); return; }
    var L = numeroLignee(), h = '';
    if (L.liste.length < 2) {
      h = '<p class="rap-texte">Ajoute au moins deux personnes avec leur prénom, leur nom et leur date de naissance complète (jour, mois, année) : l’outil calcule alors les nombres de chacun·e et fait apparaître les échos de ta lignée.</p><p class="rap-aide">Tu veux d’abord découvrir ton propre thème ? <a href="theme-numerologique.html">Calculer mon thème numérologique</a></p>';
      corps.innerHTML = h; ouvrir('fen-numero'); return;
    }
    if (L.echos.length) {
      h += '<p class="rap-texte">Ta lignée fait apparaître <b>' + L.echos.length + ' écho' + (L.echos.length > 1 ? 's' : '') + '</b> :</p><ul class="nl-echos">' +
        L.echos.map(function (e) { return '<li' + (e.toi ? ' class="toi"' : '') + '><b>' + esc(titreEcho(e)) + '</b><span>' + esc(sousEcho(e)) + '</span></li>'; }).join('') + '</ul>';
    } else {
      h += '<p class="rap-texte">Pas encore d’écho visible entre les générations. Complète les dates de naissance et les prénoms : les échos apparaissent souvent avec les grands-parents.</p>';
    }
    h += '<div class="nl-table-zone"><table class="nl-table"><thead><tr><th>Personne</th><th title="Chemin de vie">Chemin</th><th title="Nombre d’expression">Expr.</th><th title="Nombre héréditaire (nom)">Hérit.</th><th title="Année personnelle ' + new Date().getFullYear() + '">Année</th>' + (window.Guematrie ? '<th title="Sphère de l’arbre de vie (prénom)">Arbre</th>' : '') + '</tr></thead><tbody>' +
      L.liste.map(function (x) { return '<tr' + (x.moi ? ' class="toi"' : '') + '><td><b>' + esc(x.nom) + '</b>' + (x.lien ? '<small>' + esc(x.lien) + '</small>' : '') + '</td><td>' + nb(x.t.chemin) + '</td><td>' + nb(x.t.expression) + '</td><td>' + nb(x.t.hereditaire) + '</td><td>' + (x.vivant ? nb(x.t.annee) : '<span class="nl-vide">·</span>') + '</td>' + (window.Guematrie ? '<td>' + nb(x.sphere) + '</td>' : '') + '</tr>'; }).join('') +
      '</tbody></table></div>';
    if (L.incomplets) h += '<p class="rap-aide">' + L.incomplets + ' personne' + (L.incomplets > 1 ? 's n’ont' : ' n’a') + ' pas encore de prénom ni de date complète.</p>';
    h += '<p class="rap-aide">Pour un calcul juste, indique dans la fiche de chacun·e <b>tous ses prénoms</b> et son <b>nom de naissance</b> (celui de jeune fille pour les femmes mariées), et la date de naissance complète.</p>';
    h += '<div class="nl-actions"><button class="bt plein rap-gros" type="button" id="bt-numero-rapport">Comprendre chaque écho dans mon rapport</button><a class="bt rap-gros" href="theme-numerologique.html">Voir mon thème complet</a><a class="bt rap-gros" href="ton-prenom.html">Lire mon prénom</a><a class="bt rap-gros" href="mon-mois.html">Voir mon mois</a></div>';
    corps.innerHTML = h;
    $('bt-numero-rapport').addEventListener('click', function () { fermer('fen-numero'); ouvrirRapport(); });
    ouvrir('fen-numero');
  }
  function sectionNumeroRapport() {
    if (!NUM) return '';
    var L = numeroLignee(); if (L.liste.length < 2) return '';
    var h = '<section class="section page"><div class="sur2">Numérologie</div><h2>Ta lignée en nombres</h2><p class="intro">Chaque personne de ton arbre porte des nombres, calculés à partir de ses prénoms, de son nom et de sa date de naissance. Quand les mêmes nombres reviennent d’une génération à l’autre, ils dessinent des échos : une autre façon de regarder ce qui se transmet.</p>';
    h += '<table><tr><th>Personne</th><th>Lien</th><th>Chemin de vie</th><th>Expression</th><th>Héréditaire</th></tr>' + L.liste.map(function (x) { return '<tr><td>' + esc(x.nom) + '</td><td>' + esc(x.lien || '') + '</td><td>' + (x.t.chemin || '') + '</td><td>' + (x.t.expression || '') + '</td><td>' + (x.t.hereditaire || '') + '</td></tr>'; }).join('') + '</table>';
    if (L.moi && L.moi.t.chemin) {
      var C = NUM.NOMBRES[L.moi.t.chemin];
      h += '<h3>Ton chemin de vie : ' + L.moi.t.chemin + ', ' + esc(C.nom.toLowerCase()) + '</h3><p>' + esc(NUM.texte('chemin', L.moi.t.chemin)) + '</p><p><b>Ta force :</b> ' + esc(C.force) + ' <b>Ton défi :</b> ' + esc(C.defi) + '</p>';
    }
    if (L.moi && L.moi.t.periodes) {
      h += '<h3>Tes grandes périodes</h3><table><tr><th>Âges</th><th>Réalisation</th><th>Défi</th></tr>' + L.moi.t.periodes.map(function (p, i) {
        var ici = L.moi.t.periodeActuelle && L.moi.t.periodeActuelle.index === i;
        return '<tr' + (ici ? ' style="background:#FFF5EA"' : '') + '><td>' + esc(NUM.ages(p.de, p.a)) + (ici ? ' <b>(maintenant)</b>' : '') + '</td><td><b>' + p.n + '</b> · ' + esc(NUM.PERIODES[p.n]) + '</td><td>' + p.defi + '</td></tr>';
      }).join('') + '</table>';
    }
    if (L.moi && L.moi.t.annee) { var A = NUM.ANNEES[L.moi.t.annee]; h += '<h3>Ton année personnelle ' + new Date().getFullYear() + ' : ' + L.moi.t.annee + '</h3><p><b>' + esc(A.titre) + '.</b> ' + esc(A.texte) + '</p><p><b>Ta piste :</b> ' + esc(A.piste) + '</p>'; }
    h += '</section>';
    if (L.echos.length) {
      h += '<section class="section" style="margin-top:10mm;break-before:auto"><div style="break-inside:avoid"><div class="sur2">Numérologie</div><h2>Les échos de ta lignée</h2></div>';
      L.echos.forEach(function (e) {
        var t = texteEcho(e);
        h += '<div style="break-inside:avoid;margin-bottom:6mm"><div class="rep" style="--c:#B98A55"><b>' + esc(titreEcho(e)) + '</b><p>' + esc(sousEcho(e)) + '</p></div><p>' + esc(t.texte) + '</p><div class="pistes" style="margin-bottom:0"><b>Piste de réflexion</b><p style="margin:1.5mm 0 0">' + esc(t.piste) + '</p></div></div>';
      });
      h += '<div class="notes"><h3>Mes notes</h3>' + new Array(5).join('<div class="lignes"></div>') + '</div></section>';
    }
    return h;
  }
  $('bt-numero').addEventListener('click', ouvrirNumero);


  /* ───────── Astrologie de la lignée ───────── */
  var astroPromesse = null;
  function chargerAstro() {
    if (window.Astrologie && window.ASTRO_TEXTES) return Promise.resolve();
    if (astroPromesse) return astroPromesse;
    function script(src) { return new Promise(function (ok, ko) { var e = document.createElement('script'); e.src = src; e.onload = ok; e.onerror = ko; document.head.appendChild(e); }); }
    astroPromesse = script('assets/astronomy.browser.min.js').then(function () { return script('assets/astrologie.js'); }).then(function () { return script('assets/astrologie-textes.js'); });
    return astroPromesse;
  }
  function astroLignee() {
    var AS = window.Astrologie, pl = calculerPlan(), moi = idMoi();
    var lst = Object.keys(S.people).filter(function (id) { return dateComplete(S.people[id].naiss) && !petit(S.people[id]); }).map(function (id) {
      var p = S.people[id], r = AS.simple(p.naiss);
      return { id: id, p: p, nom: nomComplet(p) || 'Sans nom', lien: id === moi ? 'toi' : lienDe(id), gen: pl.pos[id] ? pl.pos[id].y : null, moi: id === moi,
        soleil: r.planetes.soleil.signe, lune: r.planetes.lune.signe, luneIncertaine: r.luneIncertaine || null, element: AS.ELEMENT[r.planetes.soleil.signe] };
    });
    lst.sort(function (a, b) { return (a.gen == null ? 99 : a.gen) - (b.gen == null ? 99 : b.gen) || (b.moi - a.moi); });
    var echos = [], parId = {}; lst.forEach(function (x) { parId[x.id] = x; });
    function grouper(cle) {
      var g = {}; lst.forEach(function (x) { if (cle === 'lune' && x.luneIncertaine) return; (g[x[cle]] = g[x[cle]] || []).push(x); });
      Object.keys(g).forEach(function (sg) { var xs = g[sg], ng = {}; xs.forEach(function (x) { ng[x.gen] = 1; }); var n = Object.keys(ng).length; if (xs.length >= 2 && n >= 2) echos.push({ type: cle, signe: sg, gens: n, pers: xs, toi: xs.some(function (x) { return x.moi; }) }); });
    }
    grouper('soleil'); grouper('lune');
    S.rels.forEach(function (rel) {
      if (rel.type !== 'parent') return;
      var par = parId[rel.from], enf = parId[rel.to]; if (!par || !enf) return;
      if (!enf.luneIncertaine && enf.lune === par.soleil) echos.push({ type: 'croise', sens: 'lune-soleil', enf: enf, par: par, signe: par.soleil, pers: [enf, par], toi: enf.moi || par.moi });
      if (!par.luneIncertaine && enf.soleil === par.lune) echos.push({ type: 'croise', sens: 'soleil-lune', enf: enf, par: par, signe: enf.soleil, pers: [enf, par], toi: enf.moi || par.moi });
    });
    if (lst.length >= 4) {
      var c = { feu: 0, terre: 0, air: 0, eau: 0 }, tot = 0;
      lst.forEach(function (x) { c[x.element]++; tot++; if (!x.luneIncertaine) { c[window.Astrologie.ELEMENT[x.lune]]++; tot++; } });
      var dom = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0];
      if (c[dom] / tot >= 0.4) echos.push({ type: 'element', element: dom, part: Math.round(c[dom] * 100 / tot), pers: [] });
      Object.keys(c).filter(function (k) { return !c[k]; }).forEach(function (k) { echos.push({ type: 'manque', element: k, pers: [] }); });
    }
    echos.sort(function (a, b) { return (b.toi ? 1 : 0) - (a.toi ? 1 : 0) || (b.gens || 0) - (a.gens || 0); });
    return { liste: lst, echos: echos, moi: lst.filter(function (x) { return x.moi; })[0] || null };
  }
  function nomAstro(x) { return x.moi ? 'toi' : (x.p.prenom || x.nom) + (x.lien ? ' (' + x.lien.toLowerCase() + ')' : ''); }
  function titreAstro(e) {
    var AT = window.ASTRO_TEXTES, Sg = function (s) { return AT.SIGNES[s].nom; };
    if (e.type === 'soleil') return 'Le Soleil en ' + Sg(e.signe) + ' revient sur ' + e.gens + ' générations';
    if (e.type === 'lune') return 'La Lune en ' + Sg(e.signe) + ' revient sur ' + e.gens + ' générations';
    if (e.type === 'croise') return e.sens === 'lune-soleil' ? 'La Lune de ' + nomAstro(e.enf) + ' est dans le signe solaire de ' + nomAstro(e.par) : 'Le Soleil de ' + nomAstro(e.enf) + ' est dans le signe lunaire de ' + nomAstro(e.par);
    if (e.type === 'element') return 'Une lignée d’' + AT.ELEMENTS[e.element].nom.replace(/^(Le |La |L’|L')/, '').toLowerCase() + ' (' + e.part + ' % des Soleils et des Lunes)';
    return AT.ELEMENTS[e.element].nom + ' n’apparaît dans aucun Soleil ni aucune Lune';
  }
  function sousAstro(e) {
    var AT = window.ASTRO_TEXTES;
    if (e.type === 'soleil' || e.type === 'lune') return AT.SIGNES[e.signe].mots.join(', ') + ' · ' + e.pers.map(nomAstro).join(', ').replace(/, ([^,]*)$/, ' et $1');
    if (e.type === 'croise') return AT.SIGNES[e.signe].nom + ' · ' + AT.SIGNES[e.signe].mots.join(', ');
    return 'Dans toute ta lignée';
  }
  function texteAstro(e) {
    var AT = window.ASTRO_TEXTES;
    if (e.type === 'soleil') return { texte: AT.SIGNES[e.signe].essence + ' ' + AT.PLANETES.soleil.famille, piste: 'Qu’est-ce que ces personnes ont en commun dans leur façon d’exister et de prendre leur place ? Qu’as-tu envie de vivre de ce signe à ta manière ?' };
    if (e.type === 'lune') return { texte: AT.SIGNES[e.signe].essence + ' ' + AT.PLANETES.lune.famille, piste: 'Ces personnes ont peut-être les mêmes besoins pour se sentir en sécurité. Comment ces besoins ont-ils été accueillis, ou non, d’une génération à l’autre ?' };
    if (e.type === 'croise') return { texte: e.sens === 'lune-soleil' ? 'La Lune parle de ce dont on a besoin pour se sentir en sécurité. Quand elle tombe dans le signe solaire d’un parent, ce parent incarne souvent, symboliquement, ce qui rassure ou ce que l’on attend de lui.' : 'Quand le Soleil d’un enfant tombe dans le signe lunaire d’un parent, l’enfant exprime au grand jour ce que le parent vivait de l’intérieur : une sensibilité, des besoins, parfois un rêve resté discret.', piste: 'Qu’est-ce que cette personne t’a transmis de ce signe ? Qu’est-ce qui t’appartient vraiment, et qu’est-ce que tu portes pour elle ?' };
    if (e.type === 'element') return { texte: AT.ELEMENTS[e.element].lignee, piste: 'Comment cet élément s’exprime-t-il dans ta famille : dans les métiers, les caractères, les façons de réagir ? Et comment veux-tu le vivre, toi ?' };
    return { texte: AT.ELEMENTS[e.element].faible, piste: 'C’est peut-être une qualité que ta génération est invitée à développer pour toute la lignée. Où pourrais-tu commencer à la cultiver ?' };
  }
  function ouvrirAstro() {
    var corps = $('fa-corps');
    corps.innerHTML = '<p class="rap-texte">Calcul des thèmes de ta famille…</p>'; ouvrir('fen-astro');
    chargerAstro().then(function () {
      var L = astroLignee(), AT = window.ASTRO_TEXTES, h = '';
      if (L.liste.length < 2) {
        corps.innerHTML = '<p class="rap-texte">Ajoute au moins deux personnes avec leur date de naissance complète (jour, mois, année) : l’outil calcule alors leur Soleil et leur Lune et fait apparaître les échos de ta lignée.</p><p class="rap-aide">Tu veux d’abord découvrir ton thème complet ? <a href="theme-astral.html">Calculer mon thème astral</a></p>'; return;
      }
      h += L.echos.length ? '<p class="rap-texte">Ta lignée fait apparaître <b>' + L.echos.length + ' écho' + (L.echos.length > 1 ? 's' : '') + '</b> :</p><ul class="nl-echos">' + L.echos.map(function (e) { return '<li' + (e.toi ? ' class="toi"' : '') + '><b>' + esc(titreAstro(e)) + '</b><span>' + esc(sousAstro(e)) + '</span></li>'; }).join('') + '</ul>'
        : '<p class="rap-texte">Pas encore d’écho visible entre les générations. Ajoute les dates de naissance de tes grands-parents : les échos apparaissent souvent avec eux.</p>';
      h += '<div class="nl-table-zone"><table class="nl-table"><thead><tr><th>Personne</th><th>Soleil</th><th>Lune</th><th>Élément</th></tr></thead><tbody>' + L.liste.map(function (x) {
        return '<tr' + (x.moi ? ' class="toi"' : '') + '><td><b>' + esc(x.nom) + '</b>' + (x.lien ? '<small>' + esc(x.lien) + '</small>' : '') + '</td><td style="font-family:var(--texte);font-size:.86rem">' + AT.SIGNES[x.soleil].nom + '</td><td style="font-family:var(--texte);font-size:.86rem">' + AT.SIGNES[x.lune].nom + (x.luneIncertaine ? ' ?' : '') + '</td><td style="font-family:var(--texte);font-size:.86rem">' + x.element + '</td></tr>';
      }).join('') + '</tbody></table></div>';
      h += '<p class="rap-aide">Calcul à midi, heure de Paris, faute d’heure de naissance : le Soleil est fiable, la Lune peut changer de signe dans la journée (marquée « ? »).</p>';
      h += '<div class="nl-actions"><button class="bt plein rap-gros" type="button" id="bt-astro-rapport">Comprendre chaque écho dans mon rapport</button><a class="bt rap-gros" href="theme-astral.html">Mon thème astral complet</a></div>';
      corps.innerHTML = h;
      $('bt-astro-rapport').addEventListener('click', function () { fermer('fen-astro'); ouvrirRapport(); });
    }, function () { corps.innerHTML = '<p class="rap-texte">Le calcul n’a pas pu se charger. Recharge la page.</p>'; });
  }
  function sectionAstroRapport() {
    if (!window.Astrologie || !window.ASTRO_TEXTES) return '';
    var L = astroLignee(), AT = window.ASTRO_TEXTES; if (L.liste.length < 2) return '';
    var h = '<section class="section page"><div class="sur2">Astrologie</div><h2>Ta lignée dans les étoiles</h2><p class="intro">' + esc(AT.INTRO.lignee) + '</p>';
    h += '<table><tr><th>Personne</th><th>Lien</th><th>Soleil</th><th>Lune</th><th>Élément</th></tr>' + L.liste.map(function (x) { return '<tr><td>' + esc(x.nom) + '</td><td>' + esc(x.lien || '') + '</td><td>' + AT.SIGNES[x.soleil].nom + '</td><td>' + AT.SIGNES[x.lune].nom + (x.luneIncertaine ? ' (?)' : '') + '</td><td>' + x.element + '</td></tr>'; }).join('') + '</table>';
    if (L.moi) h += '<h3>Ton Soleil en ' + AT.SIGNES[L.moi.soleil].nom + '</h3><p>' + esc(AT.SOLEIL[L.moi.soleil]) + '</p><h3>Ta Lune en ' + AT.SIGNES[L.moi.lune].nom + (L.moi.luneIncertaine ? ' (à vérifier avec ton heure de naissance)' : '') + '</h3><p>' + esc(AT.LUNE[L.moi.lune]) + '</p>';
    h += '<p class="discret">Calcul à midi, heure de Paris : pour ton thème complet avec ton ascendant, rends-toi sur genesolia.fr/theme-astral.html.</p></section>';
    if (L.echos.length) {
      h += '<section class="section page"><div class="sur2">Astrologie</div><h2>Les échos célestes de ta lignée</h2>';
      L.echos.forEach(function (e) { var t = texteAstro(e); h += '<div style="break-inside:avoid;margin-bottom:6mm"><div class="rep" style="--c:#7A4FA0"><b>' + esc(titreAstro(e)) + '</b><p>' + esc(sousAstro(e)) + '</p></div><p>' + esc(t.texte) + '</p><div class="pistes" style="margin-bottom:0"><b>Piste de réflexion</b><p style="margin:1.5mm 0 0">' + esc(t.piste) + '</p></div></div>'; });
      h += '</section>';
    }
    return h;
  }
  $('bt-astro').addEventListener('click', ouvrirAstro);

  /* ───────── Démarrage ───────── */
  var exportDemande = new URLSearchParams(location.search).get('export');
  var numeroFait = false;
  function numeroSiDemande() {
    if (numeroFait) return; var q = new URLSearchParams(location.search);
    if (q.has('numerologie')) { numeroFait = true; setTimeout(ouvrirNumero, 400); }
    else if (q.has('astrologie')) { numeroFait = true; setTimeout(ouvrirAstro, 400); }
  }
  function exporterSiDemande() {
    numeroSiDemande();
    if (!exportDemande) return;
    var e = exportDemande; exportDemande = null;
    history.replaceState(null, '', location.pathname + (ARBRE_ID ? '?arbre=' + ARBRE_ID : ''));
    if (!Object.keys(S.people).length) return;
    setTimeout(function () { $(e === 'imprimer' ? 'bt-imprimer' : 'bt-image').click(); }, 300);
  }
  /* ───────── Plusieurs arbres : sélecteur dans la barre ───────── */
  var TITRE_PAGE = document.title;
  var listeSupp = null, erreurListe = false;
  function majNomArbre() {
    var b = $('bt-arbres-nom'); if (b) b.textContent = ARBRE_ID ? (arbreNom || 'Autre arbre') : 'Mon arbre';
    document.title = ARBRE_ID ? (arbreNom || 'Autre arbre') + ' · Mon arbre familial · Genesolia' : TITRE_PAGE;
  }
  function chargerListeArbres() {
    if (!utilisateur || !sb) return Promise.resolve();
    return sb.from('arbres_supp').select('id,nom,maj').eq('user_id', utilisateur.id).order('cree_le', { ascending: true }).then(function (r) {
      erreurListe = !!r.error; listeSupp = r.error ? [] : (r.data || []);
      if (ARBRE_ID && !arbreNom) listeSupp.forEach(function (a) { if (a.id === ARBRE_ID) { arbreNom = a.nom; majNomArbre(); } });
      if (!$('menu-arbres').hidden) dessinerMenuArbres();
    });
  }
  function chargerArbreSupp() {
    return sb.from('arbres_supp').select('id,nom,data').eq('id', ARBRE_ID).maybeSingle().then(function (res) {
      if (res.error) { arbreBloque = true; statut('Cet arbre n’a pas pu être chargé (connexion ?). Recharge la page dans un instant.'); return; }
      if (!res.data) {
        arbreBloque = true;
        try { localStorage.removeItem(CLE_LOCALE); } catch (e) {}
        S = { people: {}, rels: [], nid: 1 }; selId = null; dessiner(); majBarreActions();
        statut('Cet arbre est introuvable (il a peut-être été supprimé) · <a href="genosociogramme.html">Ouvrir mon arbre</a>');
        return;
      }
      arbreNom = res.data.nom || ''; majNomArbre();
      var dc = res.data.data || {};
      annexes = {};
      Object.keys(dc).forEach(function (k) { if (['people', 'rels', 'nid', 'v', 'nodePos'].indexOf(k) < 0) annexes[k] = dc[k]; });
      charger(dc);
      try { localStorage.setItem(CLE_LOCALE, JSON.stringify({ people: S.people, rels: S.rels, nid: S.nid, v: 2 })); } catch (e) {}
      selId = null; repActive = null; dessiner(); recentrer(); majBarreActions();
      statut(textStatutRepos());
    });
  }
  function texteLimite(lim) {
    var debut = lim >= 100000 ? 'Tu as atteint le nombre d’arbres de ta formule.'
      : lim > 0 ? 'Tu as déjà tes 3 arbres : c’est le maximum de ta formule. L’Espace praticien permet des arbres illimités.'
      : 'Avec la formule gratuite, tu as un arbre. Le Cercle te permet d’avoir 3 arbres, et l’Espace praticien des arbres illimités.';
    return '<p>' + debut + '</p><p><a href="abonnement.html">Découvrir Le Cercle</a> · <a href="espace-praticien.html">Découvrir l’Espace praticien</a></p>';
  }
  function lienArbre(id, nom, info) {
    var courant = (id || null) === ARBRE_ID;
    return '<a class="ma-arbre' + (courant ? ' courant' : '') + '" href="genosociogramme.html' + (id ? '?arbre=' + esc(id) : '') + '"' + (courant ? ' aria-current="page"' : '') + ' data-aller><span>' + esc(nom) + '</span>' + (info ? '<small>' + esc(info) + '</small>' : '') + '</a>';
  }
  function dessinerMenuArbres(msg) {
    var m = $('menu-arbres'), h = '<p class="ma-titre">Mes arbres</p>';
    if (!utilisateur) {
      m.innerHTML = h + lienArbre(null, 'Mon arbre', 'dans ce navigateur') + '<a class="ma-action" href="login.html?retour=genosociogramme.html">Me connecter pour avoir plusieurs arbres</a>';
      return;
    }
    if (listeSupp === null) { m.innerHTML = h + '<p class="ma-aide">Chargement de tes arbres…</p>'; return; }
    h += lienArbre(null, 'Mon arbre', 'arbre principal');
    listeSupp.forEach(function (a) { h += lienArbre(a.id, a.nom || 'Autre arbre'); });
    if (erreurListe) h += '<p class="ma-aide">Tes autres arbres n’ont pas pu être chargés pour l’instant.</p>';
    h += '<span class="ma-sep"></span><button type="button" class="ma-action" data-arbre-action="creer">+ Créer un autre arbre</button>';
    if (ARBRE_ID && !arbreBloque) h += '<button type="button" class="ma-action" data-arbre-action="renommer">Renommer cet arbre</button><button type="button" class="ma-action danger" data-arbre-action="supprimer">Supprimer cet arbre</button>';
    if (msg) h += '<div class="ma-message" role="status">' + msg + '</div>';
    m.innerHTML = h;
  }
  function basculerMenuArbres(ouvert) {
    var m = $('menu-arbres'), b = $('bt-arbres');
    if (ouvert == null) ouvert = m.hidden;
    m.hidden = !ouvert; b.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    if (ouvert) {
      dessinerMenuArbres(); if (utilisateur && listeSupp === null) chargerListeArbres();
      m.style.left = ''; var r = m.getBoundingClientRect(), deborde = r.right - (window.innerWidth - 12);   // petit écran : on garde la liste dans l'écran
      if (deborde > 0) m.style.left = -Math.min(deborde, Math.max(0, r.left - 12)) + 'px';
    }
  }
  // Avant de changer d'arbre, on termine l'enregistrement en cours
  function allerVers(url) {
    var p = (enAttente && utilisateur && sb && !arbreBloque) ? envoyer() : null;
    Promise.resolve(p).then(function () { location.href = url; }, function () { location.href = url; });
  }
  function nomValide(n) { return n == null ? null : (String(n).trim().slice(0, 80) || null); }
  function creerArbre() {
    dessinerMenuArbres('<p>Un instant…</p>');
    sb.rpc('limite_arbres_supp', { uid: utilisateur.id }).then(function (r) {
      var lim = r && !r.error && r.data != null ? Number(r.data) : null;
      if (lim !== null && (listeSupp || []).length >= lim) { dessinerMenuArbres(texteLimite(lim)); return; }
      dessinerMenuArbres();
      var nom = nomValide(prompt('Nom du nouvel arbre (par exemple « Famille de Paul » ou « Dossier Mme D. ») :', ''));
      if (!nom) return;
      return sb.from('arbres_supp').insert({ user_id: utilisateur.id, nom: nom, data: { people: {}, rels: [], nid: 1, v: 2 } }).select('id').single().then(function (ins) {
        if (ins.error || !ins.data) {
          var refus = ins.error && (ins.error.code === '42501' || /row-level|policy|limite/i.test(ins.error.message || ''));
          dessinerMenuArbres(refus ? texteLimite(lim || 0) : '<p>Le nouvel arbre n’a pas pu être créé. Réessaie dans un instant.</p>');
          return;
        }
        allerVers('genosociogramme.html?arbre=' + ins.data.id);
      });
    });
  }
  function renommerArbre() {
    var nom = nomValide(prompt('Nouveau nom de cet arbre :', arbreNom));
    if (!nom || nom === arbreNom) return;
    sb.from('arbres_supp').update({ nom: nom }).eq('id', ARBRE_ID).then(function (r) {
      if (r.error) { dessinerMenuArbres('<p>Le nom n’a pas pu être changé. Réessaie.</p>'); return; }
      arbreNom = nom; majNomArbre();
      (listeSupp || []).forEach(function (a) { if (a.id === ARBRE_ID) a.nom = nom; });
      dessinerMenuArbres();
    });
  }
  function supprimerArbre() {
    if (!confirm('Supprimer définitivement l’arbre « ' + arbreNom + ' » ?\n\nToutes ses personnes, leurs informations et ses versions enregistrées seront effacées. Cette suppression ne peut pas être annulée.\n\nTon arbre principal et tes autres arbres ne sont pas touchés.')) return;
    clearTimeout(minuteur); minuteur = null; enAttente = false; arbreBloque = true;
    sb.from('arbres_supp').delete().eq('id', ARBRE_ID).then(function (r) {
      if (r.error) { arbreBloque = false; dessinerMenuArbres('<p>Cet arbre n’a pas pu être supprimé. Réessaie.</p>'); return; }
      try { localStorage.removeItem(CLE_LOCALE); } catch (e) {}
      location.href = 'genosociogramme.html';
    });
  }
  $('bt-arbres').addEventListener('click', function (e) { e.stopPropagation(); basculerMenuArbres(); });
  $('menu-arbres').addEventListener('click', function (e) {
    e.stopPropagation();
    var a = e.target.closest('[data-aller]');
    if (a) { e.preventDefault(); if (!a.classList.contains('courant')) allerVers(a.getAttribute('href')); else basculerMenuArbres(false); return; }
    var b = e.target.closest('[data-arbre-action]'); if (!b || !utilisateur || !sb) return;
    var act = b.getAttribute('data-arbre-action');
    if (act === 'creer') creerArbre(); else if (act === 'renommer') renommerArbre(); else if (act === 'supprimer') supprimerArbre();
  });
  document.addEventListener('click', function () { if (!$('menu-arbres').hidden) basculerMenuArbres(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('menu-arbres').hidden) { basculerMenuArbres(false); $('bt-arbres').focus(); } });
  majNomArbre();

  function demarrer() {
    if (surTelephone()) document.body.classList.add('porte-ouverte');
    try { if (window.supabase && window.supabase.createClient) sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) { sb = null; }

    if (new URLSearchParams(location.search).has('exemple')) {
      EXEMPLE = true;
      fetch('assets/exemple-genosociogramme.json').then(function (r) { return r.json(); }).then(function (d) {
        charger(d); dessiner(); recentrer();
        var b = document.createElement('div'); b.className = 'bandeau-exemple'; b.setAttribute('role', 'status');
        b.innerHTML = 'Exemple fictif : la famille de Léa. Rien n’est enregistré. <a href="genosociogramme.html">Créer mon propre arbre</a>';
        document.body.appendChild(b);
        statut('');
        numeroSiDemande();
      });
      return;
    }
    chargerLocal();
    dessiner(); recentrer();
    statut(textStatutRepos());
    if (!sb) { exporterSiDemande(); return; }
    sb.auth.getSession().then(function (r) {
      var s = r && r.data && r.data.session; if (!s) return;
      utilisateur = s.user;
      statut(textStatutRepos());
      chargerListeArbres();
      if (ARBRE_ID) return chargerArbreSupp();
      return sb.from('arbres').select('data').eq('user_id', utilisateur.id).maybeSingle().then(function (res) {
        if (res.error) return;
        var dc = (res.data && res.data.data) || {};
        annexes = {};
        Object.keys(dc).forEach(function (k) { if (['people', 'rels', 'nid', 'v', 'nodePos'].indexOf(k) < 0) annexes[k] = dc[k]; });
        var exos = fusionnerExos(annexes.exercices, lireExos());   // retrouver les exercices faits sur un autre appareil
        annexes.exercices = exos;
        try { localStorage.setItem('genesolia-exercices', JSON.stringify(exos)); } catch (e) {}
        dessinerPanneau();
        if (dc.people && Object.keys(dc.people).length) {
          var local = instantane();
          if (Object.keys(S.people).length && JSON.stringify(dc.people) !== JSON.stringify(S.people)) {
            // l'arbre de ce navigateur est différent : on le garde de côté (et « Annuler » permet d'y revenir)
            try { localStorage.setItem('geno4-avant-connexion', local); } catch (e) {}
            memoriser();
          }
          charger(dc);
          marquerSynchro(true);
          try { localStorage.setItem(CLE_LOCALE, JSON.stringify({ people: S.people, rels: S.rels, nid: S.nid, v: 2 })); } catch (e) {}
          selId = null; dessiner(); recentrer(); majBarreActions();
        } else if (Object.keys(S.people).length) {
          enregistrer();
        }
      });
    }).then(exporterSiDemande, exporterSiDemande);
  }
  demarrer();
})();
