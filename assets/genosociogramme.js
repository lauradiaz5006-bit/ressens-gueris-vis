/* Genesolia : génosociogramme en ligne.
   Les personnes et les liens sont stockés tels quels ; le placement est recalculé à chaque dessin
   (générations en lignes, couples côte à côte, enfants sous leurs parents, symboles standards). */
(function () {
  'use strict';

  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co';
  var SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CLE_LOCALE = 'geno4';

  var SLOT = 150;     // largeur réservée à une personne
  var ECART = 36;     // espace entre deux blocs
  var RANG = 215;     // hauteur d'une génération
  var R = 24;         // demi-taille du symbole
  var BAS_TEXTE = R + 68;

  var PRUNE = '#6B2F5B', PRUNE_DOUX = '#8E6383', CHAMPAGNE = '#B98A55', CORAIL = '#E7A79E';
  var COUL = { anniversaire: '#D2793A', gisant: '#B5485C', epreuve: '#B98A55', schema: '#7A4FA0', prenom: '#D06A7E', metier: '#4F7CAC', date: '#C46D9A' };

  var EVTS = [
    ['deuil', 'Deuil, perte d’un proche'],
    ['deces-precoce', 'Mort jeune'],
    ['rupture', 'Séparation, rupture'],
    ['abandon', 'Abandon, rejet'],
    ['secret', 'Secret de famille'],
    ['guerre', 'Guerre, exil'],
    ['demenagement', 'Départ, déracinement'],
    ['pauvrete', 'Manque d’argent'],
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
    { id: 'effacee', label: 'Des femmes qui s’effacent', test: function (p) { return p.sex === 'f' && (a(p, 'sacrifice') || /sacrifi|effac|devou|s.oubli/.test(txt(p)) || groupeMetier(p.metier) === 'foyer'); } },
    { id: 'absent', label: 'Des pères absents ou partis', test: function (p) { return p.sex === 'm' && (a(p, 'abandon') || /absent|parti |disparu|quitte/.test(txt(p))); } },
    { id: 'aine', label: 'Des aînés qui portent la famille', test: function (p) { return /responsab|aine|parentifi|porte la famille/.test(txt(p)); } },
    { id: 'secret', label: 'Des secrets et des non-dits', test: function (p) { return a(p, 'secret') || a(p, 'honte') || /secret|non-dit|on n.en parl|tabou|honte/.test(txt(p)); } },
    { id: 'colere', label: 'De la colère ou de la violence', test: function (p) { return a(p, 'abus') || /violen|colere|coleri|brutal/.test(txt(p)); } },
    { id: 'deuil', label: 'Des deuils dont on ne parle pas', test: function (p) { return a(p, 'deuil') && /jamais|silence|tabou|pas parl/.test(txt(p)); } },
    { id: 'exil', label: 'Des départs et des déracinements', test: function (p) { return a(p, 'guerre') || a(p, 'demenagement') || /exil|immigr|emigr|parti vivre/.test(txt(p)); } }
  ];

  function detecter() {
    var liste = Object.keys(S.people).map(function (id) { return S.people[id]; });
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
          if (ad != null && Math.abs(ad - age) <= 1) reps.push({ type: 'anniversaire', c: COUL.anniversaire, label: 'Syndrome anniversaire', desc: 'Tu as ' + age + ' ans. ' + nom(p) + ' est ' + (p.sex === 'f' ? 'décédée' : 'décédé') + ' à ' + ad + ' ans.', ids: [moi.id, p.id] });
          (p.events || []).forEach(function (e) {
            var ea = parseInt(e.age, 10);
            if (!isNaN(ea) && Math.abs(ea - age) <= 1) reps.push({ type: 'anniversaire', c: COUL.anniversaire, label: 'Syndrome anniversaire', desc: 'Tu as ' + age + ' ans. ' + nom(p) + ' a vécu « ' + (NOM_EVT[e.type] || e.type).toLowerCase() + ' » à ' + ea + ' ans.', ids: [moi.id, p.id] });
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
      if (ids.length >= 2) {
        var parts = j.split('/');
        var mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][+parts[1] - 1];
        reps.push({ type: 'date', c: COUL.date, label: 'Une date qui revient : le ' + (+parts[0]) + ' ' + mois, desc: g.map(function (x) { return x.quoi + ' de ' + nom(x.p); }).join(', ') + '.', ids: ids });
      }
    });
    // Morts jeunes
    var jeunes = liste.filter(function (p) { var ad = ageDeces(p); return a(p, 'deces-precoce') || (ad != null && ad < 50); });
    if (jeunes.length >= 2) reps.push({ type: 'gisant', c: COUL.gisant, label: 'Des morts jeunes (syndrome du gisant)', desc: jeunes.map(function (p) { var ad = ageDeces(p); return nom(p) + (ad != null ? ' (' + ad + ' ans)' : ''); }).join(', ') + '.', ids: jeunes.map(function (p) { return p.id; }) });
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
  function dessinPersonne(p, pos, o) {
    var moi = p.role === 'moi', sel = o.sel === p.id, att = o.attenue && o.attenue.indexOf(p.id) < 0;
    var lien = lienDe(p.id);
    var nom = nomComplet(p);
    var h = '<g class="personne" data-id="' + esc(p.id) + '" transform="translate(' + pos.x + ',' + pos.y + ')"' + (o.export ? '' : ' tabindex="0" role="button" aria-label="' + esc((nom || lien || 'Personne sans prénom') + (lien && nom ? ', ' + lien : '')) + '"') + (att ? ' opacity=".22"' : '') + '>';
    if (!o.export) h += '<rect class="zone-clic" x="' + (-SLOT / 2 + 6) + '" y="' + (-R - 10) + '" width="' + (SLOT - 12) + '" height="' + (BAS_TEXTE + R + 12) + '" fill="transparent"/>';
    if (sel) h += symbole(p, R + 9) + ' class="halo" fill="none" stroke="' + CORAIL + '" stroke-width="3"/>';
    else if (!o.export) h += symbole(p, R + 9) + ' class="halo" fill="none" stroke="' + PRUNE + '" stroke-opacity="0" stroke-width="2"/>';
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
    if (lien) { y += 15; h += '<text y="' + y + '" text-anchor="middle" font-family="\'Nunito Sans\',sans-serif" font-size="9.5" font-weight="600" letter-spacing=".08em" fill="' + PRUNE_DOUX + '">' + esc(lien.toUpperCase()) + '</text>'; }
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
    infos.forEach(function (inf) {
      var fa = inf.fa, enfs = inf.enfs, ps = inf.ps;
      var barre = inf.y - R - 22 - inf.niveau * 14;
      var xs = enfs.map(function (c) { return pos[c].x; });
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
      enfs.forEach(function (c) { var p = pos[c]; h += '<path d="M' + p.x + ' ' + barre + 'V' + (p.y - R - (S.people[c].sex === 'u' ? 5 : 1)) + '"' + trait + '/>'; });
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
    var h = '<g id="monde">' + dessinLiens(plan) + dessinRepetition(plan, repActive);
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
    b += '<button type="button" class="danger" data-act="supprimer" aria-label="Supprimer">Supprimer</button>';
    bar.innerHTML = b;
    placerActions();
  }
  function choisir(id) { selId = id; dessiner(); if (id) rendreVisible(id); majBarreActions(); }

  /* ───────── Panneau ───────── */
  function dessinerPanneau() {
    var n = reps.length;
    $('compte').textContent = n; $('compte-bouton').textContent = n;
    var z = $('reps');
    if (!Object.keys(S.people).length) { z.innerHTML = '<p class="rep-aide">Commence par te placer dans l’arbre.</p>'; return; }
    if (!n) {
      z.innerHTML = '<p class="rep-aide">Rien pour l’instant. Ajoute <b>les dates</b>, <b>les métiers</b> et <b>les événements marquants</b> de chacun : les répétitions apparaissent ici toutes seules.</p>' +
        (idMoi() ? '' : '<p class="rep-aide">Astuce : coche « C’est moi » sur ta fiche pour repérer le syndrome anniversaire.</p>');
      return;
    }
    z.innerHTML = reps.map(function (r, i) {
      return '<button type="button" class="rep" style="--c:' + r.c + '" data-rep="' + i + '" aria-pressed="' + (repActive && repActive.cle === r.cle ? 'true' : 'false') + '"><strong>' + esc(r.label) + '</strong><span>' + esc(r.desc) + '</span></button>';
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
    return 'Enregistré dans ce navigateur · <a href="login.html">Me connecter</a>';
  }
  function enregistrer() {
    if (EXEMPLE) return;
    try { localStorage.setItem(CLE_LOCALE, JSON.stringify({ people: S.people, rels: S.rels, nid: S.nid, v: 2 })); } catch (e) {}
    clearTimeout(minuteur);
    if (!utilisateur || !sb) { statut(textStatutRepos()); return; }
    statut('Enregistrement…');
    minuteur = setTimeout(function () {
      sb.from('arbres').upsert({ user_id: utilisateur.id, data: { people: S.people, rels: S.rels, nid: S.nid, v: 2 }, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .then(function (r) { statut(r.error ? 'Pas de connexion : enregistré dans ce navigateur' : textStatutRepos()); })
        .catch(function () { statut('Pas de connexion : enregistré dans ce navigateur'); });
    }, 900);
  }
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
      if (!autre || !S.people[autre]) return;
      h += '<div class="lien"><span>' + lib + '<b>' + esc(nomCourt(autre)) + '</b></span>' +
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
    if (t === 'couple') { if (relCouple(id, o)) { err.textContent = 'Ce lien existe déjà.'; return; } r = { from: id, to: o, type: 'couple', statut: 'marie' }; }
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
    else if (act === 'supprimer') supprimer(selId);
    else ouvrirAjout(act, selId);
  });
  $('reps').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rep]'); if (!b) return;
    var r = reps[+b.getAttribute('data-rep')];
    repActive = (repActive && repActive.cle === r.cle) ? null : r;
    dessiner();
  });
  $('bt-panneau').addEventListener('click', function () { document.body.classList.toggle('panneau-ouvert'); });
  $('bt-replier').addEventListener('click', function () { document.body.classList.remove('panneau-ouvert'); });
  window.addEventListener('resize', placerActions);

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
    var dx = (W - (b.x2 - b.x1)) / 2 - b.x1, dy = haut - b.y1;
    var o = { export: true, badges: badgesDe(detecter()) };
    var h = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
    if (css) h += '<style>' + css + '</style>';
    h += '<rect width="100%" height="100%" fill="#FFF9F7"/>';
    h += '<text x="' + m + '" y="40" font-family="\'Gilda Display\',Georgia,serif" font-size="24" fill="' + PRUNE + '">Mon génosociogramme</text>';
    var d = new Date();
    h += '<text x="' + (W - m) + '" y="40" text-anchor="end" font-family="\'Nunito Sans\',sans-serif" font-size="12" fill="' + PRUNE_DOUX + '">' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + '</text>';
    h += '<g transform="translate(' + dx + ',' + dy + ')">' + dessinLiens(pl);
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
  $('bt-sauve').addEventListener('click', function () {
    $('fs-texte').textContent = utilisateur ? 'Ton arbre est enregistré dans ton espace : tu le retrouves sur n’importe quel ordinateur en te connectant.' : 'Ton arbre est enregistré dans ce navigateur, sur cet ordinateur. Pour le garder en sécurité ou le retrouver ailleurs, télécharge une copie ou connecte-toi.';
    $('bt-compte').style.display = utilisateur ? 'none' : '';
    ouvrir('fen-sauve');
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
  $('bt-effacer').addEventListener('click', function () {
    if (!Object.keys(S.people).length) { fermer('fen-sauve'); return; }
    if (!confirm('Effacer tout ton arbre ? Tu pourras revenir en arrière avec « Annuler » tant que tu restes sur cette page.')) return;
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

  /* ───────── Démarrage ───────── */
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
      });
      return;
    }
    chargerLocal();
    dessiner(); recentrer();
    statut(textStatutRepos());
    if (!sb) return;
    sb.auth.getSession().then(function (r) {
      var s = r && r.data && r.data.session; if (!s) return;
      utilisateur = s.user;
      statut(textStatutRepos());
      return sb.from('arbres').select('data').eq('user_id', utilisateur.id).maybeSingle().then(function (res) {
        if (res.error) return;
        if (res.data && res.data.data && res.data.data.people && Object.keys(res.data.data.people).length) {
          charger(res.data.data);
          try { localStorage.setItem(CLE_LOCALE, JSON.stringify({ people: S.people, rels: S.rels, nid: S.nid, v: 2 })); } catch (e) {}
          selId = null; dessiner(); recentrer(); majBarreActions();
        } else if (Object.keys(S.people).length) {
          enregistrer();
        }
      });
    }).catch(function () {});
  }
  demarrer();
})();
