/* Genesolia · style « Lignée » : arbre simple, tout à l'horizontale, comme un tableau d'ascendance.
   Chaque génération est une rangée ; quand une rangée est pleine, les étiquettes se placent en quinconce sur deux ou trois lignes.
   Les branches vides ne prennent pas de place : la place va aux ancêtres connus.
   ArbreLignee.svg(donnees, o) -> chaîne SVG (viewBox 2480 x 3508) ; o.a3 : tailles prévues pour l'A3 (8 points = 24 px).
   ArbreLignee.capacite(donnees, a3) -> nombre maximal de générations lisibles. */
(function () {
  'use strict';
  var W = 2480, H = 3508, OR = '#B98A55', OR_FONCE = '#9A6E38', OR_CLAIR = '#D9B77E', PRUNE = '#5A2147';
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  var MARGE = 190, HAUT = 700, BAS = 3170, ECART = 18, KMAX = 4, PARFAIT = false, MOTIF = '', SPRITES = { medaillon: 'assets/arbre/medaillon-or.png', racine: 'assets/arbre/racine-or.png' };
  /* Format : portrait (2480 x 3508) ou paysage (3508 x 2480, o.paysage) */
  function format(paysage) { W = paysage ? 3508 : 2480; H = paysage ? 2480 : 3508; HAUT = paysage ? 560 : 700; BAS = H - (paysage ? 420 : 338); KMAX = paysage ? 2 : 4; PARFAIT = !!paysage; }   /* zone de l'arbre et écart minimal entre deux étiquettes */

  /* taille du papier par rapport à l'A4 : false = A4, true = A3, ou un nombre (50 × 70 cm ≈ 2,4 ; 70 × 100 cm ≈ 3,3).
     Le texte doit faire au moins 8 points imprimés : 34 px en A4, moins en plus grand (la page est plus grande). */
  function ech(a3) { return typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ctx = null;
  function larg(t, taille, police, gras) {
    try { if (!ctx && typeof document !== 'undefined') ctx = document.createElement('canvas').getContext('2d'); if (ctx) { ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } } catch (e) {}
    return String(t).length * taille * (gras ? .62 : .5);
  }
  function f1(n) { return n.toFixed(1); }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }
  function NOM(p) { return String(p.nom || '').toUpperCase(); }

  function poids(p, g, max) { if (!p) return 0; var w = g < max - 1 ? poids(p.pere, g + 1, max) + poids(p.mere, g + 1, max) : 0; p._w = Math.max(1, w); return p._w; }
  function placer(p, g, x0, x1, max, sortie) {
    if (!p || g >= max) return;
    p._g = g; p._x0 = (x0 + x1) / 2; sortie.push(p);
    var wp = p.pere && g < max - 1 ? p.pere._w : 0, wm = p.mere && g < max - 1 ? p.mere._w : 0, t = wp + wm; if (!t) return;
    var mil = x0 + (x1 - x0) * wp / t;
    if (wp) { p.pere._enfant = p; placer(p.pere, g + 1, x0, mil, max, sortie); }
    if (wm) { p.mere._enfant = p; placer(p.mere, g + 1, mil, x1, max, sortie); }
  }
  function nettoyer(p) { if (!p) return; p._g = null; nettoyer(p.pere); nettoyer(p.mere); }
  function ranger(moi, max) { var gens = []; nettoyer(moi); poids(moi, 0, max); placer(moi, 0, MARGE, W - MARGE, max, gens); return gens; }

  /* Étiquette : prénom(s) sur une ou deux lignes, NOM, dates */
  function etiquette(q, fz, court, uneLigne) {
    if (q.couple) return { w: 0, h: 0, l: [] };   /* « Notre famille » : le couple est la rangée au-dessus ; ce point invisible relie le couple aux enfants */
    var fn = Math.max(Math.round(fz * .8), fz < 34 ? fz : 34), fd = Math.max(Math.round(fz * .78), fz < 34 ? fz : 34);
    var mots = String(q.prenom || '').trim().split(/\s+/).filter(Boolean), pre = court ? [mots[0] || ''] : [mots.join(' ')];
    if (!court && !uneLigne && mots.length > 1 && larg(pre[0], fz, GN) > Math.max(larg(NOM(q), fn, NS, true), larg(datesDe(q), fd, NS, true)) * 1.25) {
      var best = null; for (var k = 1; k < mots.length; k++) { var a = mots.slice(0, k).join(' '), b = mots.slice(k).join(' '), m = Math.max(larg(a, fz, GN), larg(b, fz, GN)); if (!best || m < best.m) best = { m: m, l: [a, b] }; }
      pre = best.l;
    }
    var l = pre.filter(Boolean).map(function (t) { return [t, fz, GN, false, 'li-nom']; });
    if (NOM(q)) l.push([NOM(q), fn, NS, true, 'li-nf']);
    if (datesDe(q)) l.push([datesDe(q), fd, NS, true, 'li-date']);
    var w = Math.max.apply(null, l.map(function (x) { return larg(x[0], x[1], x[2], x[3]); })) + 36;
    var h = l.reduce(function (s, x) { return s + x[1] * 1.16; }, 0) + 34;
    if (MOTIF === 'medaillons') {   /* médaillon peint (assets/arbre/medaillon-or.png) au-dessus du nom */
      var th = h - 34;
      if (uneLigne) {   /* toi : le grand médaillon avec le tronc et les racines (assets/arbre/racine-or.png), ton nom écrit dedans */
        var R = Math.round(Math.min(205, Math.max(w / 2 + 8, th / 2 + 24)));
        return { l: l, w: Math.max(w, R * 7.4), h: R * 2.5, rr: R, dedans: true, cy: R };   /* les racines descendent dans la marge du bas */
      }
      var rr = Math.round(Math.max(30, fz * 1.05));
      return { l: l, w: Math.max(w - 16, rr * 4.3), h: rr * 2.5 + 18 + th, rr: rr, cy: rr * 1.5 };
    }
    return { l: l, w: w, h: h };
  }

  /* Une rangée : on étale les étiquettes de gauche à droite sans qu'elles se touchent */
  function etaler(liste) {
    if (!liste.length) return true;
    liste.forEach(function (q) { q._x = q._x0; });
    for (var i = 1; i < liste.length; i++) { var e = (liste[i - 1]._e.w + liste[i]._e.w) / 2 + ECART; if (liste[i]._x - liste[i - 1]._x < e) liste[i]._x = liste[i - 1]._x + e; }
    var fin = liste[liste.length - 1]; if (fin._x + fin._e.w / 2 > W - MARGE) { var d = fin._x + fin._e.w / 2 - (W - MARGE); liste.forEach(function (q) { q._x -= d; }); }
    if (liste[0]._x - liste[0]._e.w / 2 < MARGE) {
      liste[0]._x = MARGE + liste[0]._e.w / 2;
      for (var j = 1; j < liste.length; j++) { var e2 = (liste[j - 1]._e.w + liste[j]._e.w) / 2 + ECART; if (liste[j]._x - liste[j - 1]._x < e2) liste[j]._x = liste[j - 1]._x + e2; }
      return liste[liste.length - 1]._x + liste[liste.length - 1]._e.w / 2 <= W - MARGE + 1;
    }
    return true;
  }

  /* Rangement « parfait » (une ligne par génération) : chaque personne exactement sous ses deux parents,
     les branches rapprochées au plus près rangée par rangée (méthode de Reingold et Tilford). Aucun trait ne se croise. */
  var EC = 32;
  function parentsDe(p) { return [p.pere, p.mere].filter(function (q) { return q && q._g === p._g + 1; }); }
  function contour(p) {
    var w = p._e.w / 2, ps = parentsDe(p), L = [-w], R = [w];
    if (ps.length === 1) { var c = contour(ps[0]); ps[0]._rel = 0; c.L.forEach(function (v, d) { L[d + 1] = v; R[d + 1] = c.R[d]; }); }
    else if (ps.length === 2) {
      var a = contour(ps[0]), b = contour(ps[1]), sep = 0;
      for (var d = 0; d < Math.min(a.R.length, b.L.length); d++) sep = Math.max(sep, a.R[d] - b.L[d] + EC);
      ps[0]._rel = -sep / 2; ps[1]._rel = sep / 2;
      for (d = 0; d < Math.max(a.L.length, b.L.length); d++) {
        var l = [], r = [];
        if (d < a.L.length) { l.push(a.L[d] - sep / 2); r.push(a.R[d] - sep / 2); }
        if (d < b.L.length) { l.push(b.L[d] + sep / 2); r.push(b.R[d] + sep / 2); }
        L[d + 1] = Math.min.apply(null, l); R[d + 1] = Math.max.apply(null, r);
      }
    }
    return { L: L, R: R };
  }
  function largeurRangee(moi) { var c = contour(moi), g = Math.min.apply(null, c.L.slice(1).concat([0])), d = Math.max.apply(null, c.R.slice(1).concat([0])); return { g: g, d: d, l: d - g }; }
  function bienRange(moi, fs, plan) {
    var z = largeurRangee(moi), cx = W / 2 - (z.g + z.d) / 2;
    if (cx - moi._e.w / 2 < MARGE || cx + moi._e.w / 2 > W - MARGE) cx = W / 2;
    var dx0 = cx - moi._x; moi._x = cx; fs.forEach(function (f) { f._x += dx0; });
    (function poser(p) { parentsDe(p).forEach(function (q) { q._x = p._x + q._rel; q._yb = plan[q._g].bas; poser(q); }); })(moi);
  }

  /* Mise en page : taille du texte, nombre de lignes en quinconce par rangée, hauteur de chaque rangée */
  function miseEnPage(gens, max, a3, fs) {
    var min = Math.max(9, Math.round(34 / ech(a3))), rangs = [];
    for (var g = 0; g < max; g++) rangs.push(gens.filter(function (q) { return q._g === g; }).sort(function (a, b) { return a._x0 - b._x0; }));
    function essai(taille) {
      var plan = [], total = 0, ok = true;
      for (var g = 0; g < max; g++) {
        var fz = Math.max(min, Math.round(taille * (1 - g * .06))), liste = rangs[g], trouve = null;
        if (g === 0) { liste.concat(fs).forEach(function (q) { q._e = etiquette(q, Math.round(fz * (MOTIF ? 1.05 : 1.25)), false, true); }); trouve = { k: 1, court: false }; }
        else if (RANGE) { liste.forEach(function (q) { q._e = etiquette(q, fz, RANGE === 'court'); }); trouve = { k: 1, court: RANGE === 'court' }; }
        else [false, true].some(function (court) {
          liste.forEach(function (q) { q._e = etiquette(q, fz, court); });
          for (var k = 1; k <= KMAX; k++) {
            var sous = []; for (var s = 0; s < k; s++) sous.push(liste.filter(function (q, i) { return i % k === s; }));
            if (sous.every(etaler)) { trouve = { k: k, court: court }; return true; }
          }
          return false;
        });
        if (!trouve) { ok = false; trouve = { k: KMAX, court: true }; }
        var hb = Math.max.apply(null, (g === 0 ? liste.concat(fs) : liste).map(function (q) { return q._e.h; }).concat([0]));
        plan.push({ fz: fz, k: trouve.k, court: trouve.court, hb: hb, h: trouve.k * hb + (trouve.k - 1) * 14 });
        total += plan[g].h;
      }
      var liens = (max - 1) * Math.round(90 / Math.pow(ech(a3), .75));   /* place minimale pour les traits entre deux rangées */
      if (RANGE && rangs[0][0] && largeurRangee(rangs[0][0]).l > W - 2 * MARGE) ok = false;
      return { plan: plan, ok: ok && total + liens <= BAS - HAUT, total: total, range: !!RANGE };
    }
    /* d'abord le rangement parfait (prénoms complets, puis premier prénom seulement), sinon les rangées en quinconce */
    var res = null, RANGE = '';
    (PARFAIT ? ['complet', 'court'] : ['']).filter(function (x) { return x !== null; }).some(function (mode) {
      RANGE = mode; var taille = PARFAIT ? (a3 ? 96 : 110) : (a3 ? 80 : 96); res = essai(taille);   /* à l'horizontale : le texte grandit quand il y a de la place */
      while (!res.ok && taille > min) { taille -= 2; res = essai(taille); }
      return res.ok;
    });
    return res;
  }

  /* « Avec mes enfants » : une rangée au pied de l'arbre, sous la personne choisie ; on garde sa place en bas de page */
  function reserverEnfants(donnees, a3) {
    var l = (donnees.enfants || []).slice(0, 6); if (!l.length) return null;
    var fz = a3 ? 60 : 70;
    l.forEach(function (q) { q._e = etiquette(q, fz, false); q._g = -1; });
    var hE = Math.max.apply(null, l.map(function (q) { return q._e.h; })), sous = MOTIF === 'medaillons' ? 230 : 0;
    var bas0 = BAS; BAS -= hE + 80 + sous;
    return { liste: l, h: hE, bas: bas0, fz: fz };
  }
  function capacite(donnees, a3, paysage, motif) {
    format(paysage); MOTIF = motif || ''; reserverEnfants(donnees, a3);
    var best = 2;
    for (var n = 3; n <= 14; n++) {
      var gens = ranger(donnees.moi, n);
      if (!gens.some(function (q) { return q._g === n - 1; })) break;
      if (miseEnPage(gens, n, a3, []).ok) best = n; else break;
    }
    return best;
  }

  function svg(donnees, o) {
    o = o || {};
    var a3 = o.a3 || (o.format === 'a3') || false, moi = donnees.moi, fs = (donnees.freresSoeurs || []).slice(0, 4), CJ = donnees.conjoint || null;
    /* demi-frères et demi-sœurs : à part, du côté du parent en commun, reliés à lui seul (la mère à droite, le père à gauche) */
    var fsDemiM = fs.filter(function (f) { return f.demi && f.cote === 'mere' && moi.mere; }), fsDemiP = fs.filter(function (f) { return f.demi && f.cote === 'pere' && moi.pere; }), fsPlein = fs.filter(function (f) { return fsDemiM.indexOf(f) < 0 && fsDemiP.indexOf(f) < 0; });
    /* unions : les autres parents de ses enfants, chacun à côté d'elle, à la même taille, comme sur un arbre généalogique classique */
    var UN = !moi.couple && !CJ && donnees.unions && donnees.unions.length ? donnees.unions.slice(0, 3) : [];
    function partenaire(q) { return q === CJ || UN.indexOf(q) >= 0; }
    var max = donnees.nbGen || capacite(donnees, a3, o.paysage, o.motif); format(o.paysage); MOTIF = o.motif || ''; if (o.sprites) SPRITES = o.sprites;
    var ENF = reserverEnfants(donnees, a3);
    var gens = ranger(moi, max), M = miseEnPage(gens, max, a3, fs), plan = M.plan;

    /* Rangées du bas (toi) vers le haut ; l'espace restant est réparti entre les rangées */
    var libre = (BAS - HAUT) - M.total, pas = max > 1 ? libre / (max - 1) : 0, y = BAS;
    for (var g = 0; g < max; g++) { plan[g].bas = y; y -= plan[g].h + pas; }
    /* les enfants jamais plus grands que la rangée au-dessus d'eux : l'ensemble garde des tailles régulières */
    var fzE = 0; if (ENF) { var fzRef = Math.round(plan[0].fz * (moi.couple ? 1 : 1.25)), fzE = Math.min(ENF.fz, moi.couple && max > 1 ? plan[1].fz : fzRef);
      if (fzE < ENF.fz) ENF.liste.forEach(function (q) { q._e = etiquette(q, fzE, false); }); }
    for (g = 0; g < max; g++) {
      var L = plan[g], liste = gens.filter(function (q) { return q._g === g; }).sort(function (a, b) { return a._x0 - b._x0; });
      if (g === 0) {
        /* toi au centre, frères et sœurs de part et d'autre */
        /* avec le conjoint : il se place juste à droite de toi, les frères et sœurs passent à gauche */
        var rang0 = [moi];
        if (CJ) { fsPlein.forEach(function (f) { rang0.unshift(f); }); rang0.push(CJ); }
        else if (UN.length) {   /* 1re union à droite, 2e à gauche, 3e à droite après la 1re ; frères et sœurs tout à gauche */
          if (UN[1]) rang0.unshift(UN[1]); fsPlein.forEach(function (f) { rang0.unshift(f); }); rang0.push(UN[0]); if (UN[2]) rang0.push(UN[2]);
        }
        else fsPlein.forEach(function (f, i) { if (i % 2) rang0.push(f); else rang0.unshift(f); });
        fsDemiP.forEach(function (f) { rang0.unshift(f); }); fsDemiM.forEach(function (f) { rang0.push(f); });   /* les demis au bout, côté de leur parent */
        /* Médaillons : seul toi as le grand médaillon et ses racines ; frères, sœurs et autres parents ont un médaillon comme les autres (même taille).
           La rangée doit tenir dans la largeur : sinon son texte rapetisse (jamais sous 8 points). */
        var ecartU = function (a, b) { return (partenaire(a) && b === moi) || (a === moi && partenaire(b)) || (partenaire(a) && partenaire(b)) ? (moi._e.rr ? 40 : 130) : 60; };
        var minR = Math.max(9, Math.round(34 / ech(a3))), f0 = Math.round(L.fz * (MOTIF ? 1.05 : 1.25)), tot = 0;
        var mesurer0 = function (fz0) {
          rang0.forEach(function (q) { q._e = etiquette(q, fz0, false, MOTIF === 'medaillons' ? q === moi : !partenaire(q)); q._x0 = W / 2; });
          if (MOTIF === 'medaillons') { var autres = rang0.filter(function (q) { return q !== moi; }), wA = Math.max.apply(null, autres.map(function (q) { return q._e.w; }).concat([0])), hA = Math.max.apply(null, autres.map(function (q) { return q._e.h; }).concat([0]));
            autres.forEach(function (q) { q._e.w = wA; q._e.h = hA; }); }
          if (UN.length) { var hMax = Math.max.apply(null, rang0.map(function (q) { return q._e.h; })), wMax = Math.max.apply(null, [moi].concat(UN).map(function (q) { return q._e.w; }));
            [moi].concat(UN).forEach(function (q) { if (!q._e.rr) { q._e.w = wMax; q._e.h = hMax; } }); }   /* toi et les autres parents : des cartes de même taille */
          return rang0.reduce(function (s, q, i) { return s + q._e.w + (i ? ecartU(rang0[i - 1], q) : 0); }, 0);
        };
        tot = mesurer0(f0);
        while (tot > W - 2 * MARGE && f0 > minR) { f0 = Math.max(minR, f0 - 2); tot = mesurer0(f0); }
        var x = W / 2 - tot / 2;
        rang0.forEach(function (q, i) { q._x = x + q._e.w / 2; x += q._e.w + (i < rang0.length - 1 ? ecartU(q, rang0[i + 1]) : 0); q._yb = L.bas; });
        var dm = W / 2 - moi._x; rang0.forEach(function (q) { q._x += dm; });
        var centre = function (q) { return q._e.cy != null ? q._yb - q._e.h + q._e.cy : q._yb - q._e.h / 2; };
        (CJ ? [CJ] : UN).forEach(function (q) { q._yb += centre(moi) - centre(q); });   /* les conjoints à la même hauteur que toi (centre contre centre) */
        continue;
      }
      liste.forEach(function (q) { q._e = etiquette(q, L.fz, L.court); });
      for (var s = 0; s < L.k; s++) {
        var sl = liste.filter(function (q, i) { return i % L.k === s; }); etaler(sl);
        sl.forEach(function (q) { q._yb = L.bas - (L.k - 1 - s) * (L.hb + 14); });   /* la première ligne est la plus haute */
      }
    }

    /* Si tout tient sur une seule ligne par génération, chaque personne se place exactement sous ses deux parents :
       aucun trait ne se croise et chaque famille reste groupée */
    if (M.range) bienRange(moi, fs.concat(CJ ? [CJ] : UN), plan);
    /* la rangée du bas (toi, frères et sœurs, autres parents) doit tenir dans la feuille avec le reste de l'arbre :
       sinon les frères et sœurs passent de l'autre côté, puis le texte de la rangée rapetisse (jamais sous 8 points) */
    (function () {
      if (!rang0 || rang0.length < 2) return;
      var anc = gens.filter(function (q) { return q !== moi && q._e && q._x != null && !q.couple; });
      var ga = Math.min.apply(null, anc.map(function (q) { return q._x - q._e.w / 2; }).concat([moi._x])), da = Math.max.apply(null, anc.map(function (q) { return q._x + q._e.w / 2; }).concat([moi._x]));
      function poser(ordre) {
        var iM = ordre.indexOf(moi), x = moi._x - moi._e.w / 2, i;
        for (i = iM - 1; i >= 0; i--) { x -= ecartU(ordre[i], ordre[i + 1]) + ordre[i]._e.w; ordre[i]._x = x + ordre[i]._e.w / 2; }
        x = moi._x + moi._e.w / 2;
        for (i = iM + 1; i < ordre.length; i++) { x += ecartU(ordre[i - 1], ordre[i]); ordre[i]._x = x + ordre[i]._e.w / 2; x += ordre[i]._e.w; }
        return [ordre[0]._x - ordre[0]._e.w / 2, ordre[ordre.length - 1]._x + ordre[ordre.length - 1]._e.w / 2];
      }
      function tient(e) { return Math.max(da, e[1]) - Math.min(ga, e[0]) <= W - 2 * MARGE; }
      function aligner() {
        rang0.forEach(function (q) { q._yb = plan[0].bas; });
        (CJ ? [CJ] : UN).forEach(function (q) { q._yb += centre(moi) - centre(q); });
      }
      var e0 = [Math.min.apply(null, rang0.map(function (q) { return q._x - q._e.w / 2; })), Math.max.apply(null, rang0.map(function (q) { return q._x + q._e.w / 2; }))];
      if (tient(e0)) return;
      var ordres = [rang0.slice()];
      if (fsPlein.length) ordres.push(fsDemiP.slice().reverse().concat(rang0.filter(function (q) { return fs.indexOf(q) < 0; }), fsPlein.slice().reverse(), fsDemiM));   /* frères et sœurs à droite */
      var fz0 = f0;
      for (;;) {
        for (var k = 0; k < ordres.length; k++) if (tient(poser(ordres[k]))) { aligner(); return; }
        if (fz0 <= minR) break;
        fz0 = Math.max(minR, fz0 - 2); mesurer0(fz0);
        if (ENF) ENF.liste.forEach(function (q) { q._e = etiquette(q, Math.min(fzE || ENF.fz, fz0), false); });   /* les enfants jamais plus grands que la rangée du dessus */
      }
      poser(ordres[0]); aligner();
    })();
    /* rien ne doit sortir de la feuille : si les frères et sœurs (ou le conjoint) débordent d'un côté, tout l'arbre glisse de l'autre */
    (function () {
      var t = gens.concat(fs, CJ ? [CJ] : UN).filter(function (q) { return q._e && q._x != null && !q.couple; }); if (!t.length) return;
      var g0 = Math.min.apply(null, t.map(function (q) { return q._x - Math.max(q._e.rr || 0, q._e.w / 2); })), d0 = Math.max.apply(null, t.map(function (q) { return q._x + Math.max(q._e.rr || 0, q._e.w / 2); }));
      var dx = g0 < MARGE ? MARGE - g0 : d0 > W - MARGE ? (W - MARGE) - d0 : 0;
      if (dx && (d0 - g0) > W - 2 * MARGE) dx = (W - (g0 + d0)) / 2;   /* trop large des deux côtés : on centre */
      if (dx) gens.concat(fs, CJ ? [CJ] : UN).forEach(function (q) { if (q._x != null) q._x += dx; });
    })();

    /* Traits : du haut de l'étiquette de l'enfant à une barre, puis au bas de l'étiquette de chaque parent */
    var traits = '', alt = {};
    /* familles d'une même rangée : une barre sur deux un peu plus haute, pour que deux barres voisines ne se confondent jamais */
    gens.slice().sort(function (a, b) { return a._g - b._g || a._x - b._x; }).forEach(function (p) { alt[p._g] = (alt[p._g] || 0) + 1; p._alt = alt[p._g] % 2; });
    var coeur = '';
    gens.forEach(function (p) {
      var ps = [p.pere, p.mere].filter(function (q) { return q && q._g === p._g + 1; }); if (!ps.length) return;
      if (p.couple && ps.length === 2) {   /* « Notre famille » : le couple relié à hauteur des cartes, un cœur au milieu */
        var a = ps[0]._x < ps[1]._x ? ps[0] : ps[1], b = a === ps[0] ? ps[1] : ps[0], yc = Math.max(a._yb - a._e.h / 2, b._yb - b._e.h / 2);
        var xa = a._x + a._e.w / 2, xb = b._x - b._e.w / 2, xm = (xa + xb) / 2;
        traits += '<path d="M' + f1(xa) + ' ' + f1(yc) + 'H' + f1(xb) + '" stroke="#B08048" stroke-width="7" fill="none"/>';
        coeur = '<path transform="translate(' + f1(xm) + ' ' + f1(yc) + ') scale(1.5)" d="M0 10C-14 0 -18 -8 -13 -13C-9 -17 -3 -15 0 -10C3 -15 9 -17 13 -13C18 -8 14 0 0 10Z" fill="#8E2F5E" stroke="#FBF5EA" stroke-width="2.5"/>';
        p._x = xm; p._yc = yc; return;
      }
      var yEnfant = p._yb - p._e.h, yParent = Math.max.apply(null, ps.map(function (q) { return q._yb; }));
      var yBarre = yEnfant - Math.max(28, (yEnfant - yParent) * .5) + (p._alt ? -12 : 12), e = Math.max(3, 9 - p._g * 1.3);
      var xs = ps.map(function (q) { return q._x; }).concat([p._x]), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
      if (!(p.couple && !ENF)) traits += '<path d="M' + f1(p._x) + ' ' + f1(yEnfant) + 'V' + f1(yBarre) + '" stroke="#B08048" stroke-width="' + e + '" fill="none"/>';   /* couple sans enfants : pas de trait qui descend vers rien */
      traits += '<path d="M' + f1(x0) + ' ' + f1(yBarre) + 'H' + f1(x1) + '" stroke="#B08048" stroke-width="' + e + '" fill="none" stroke-linecap="round"/>';
      ps.forEach(function (q) { traits += '<path d="M' + f1(q._x) + ' ' + f1(yBarre) + 'V' + f1(q._yb) + '" stroke="#B08048" stroke-width="' + e + '" fill="none"/>'; });
    });
    var yCm = moi._e.cy != null ? moi._yb - moi._e.h + moi._e.cy : moi._yb - moi._e.h / 2;
    if (UN.length) {   /* chaque union : un trait (pointillé si séparés) ; ses enfants dessous, à partir du milieu du trait */
      var bord = function (q, cote) { return q._x + cote * (q._e.rr ? q._e.rr : q._e.w / 2); };
      UN.forEach(function (u, k) {
        var d = u.separe ? ' stroke-dasharray="14 10"' : '', gauche = u._x < moi._x;
        if (k < 2) {
          var xa1 = gauche ? bord(u, 1) : bord(moi, 1), xb1 = gauche ? bord(moi, -1) : bord(u, -1);
          traits += '<path d="M' + f1(xa1) + ' ' + f1(yCm) + 'H' + f1(xb1) + '" stroke="#B08048" stroke-width="6" fill="none"' + d + '/>';
          u._xm = (xa1 + xb1) / 2; u._ym = yCm;
        } else {   /* 3e union : le trait passe au-dessus de la 1re */
          var yh = Math.min(moi._yb - moi._e.h, UN[0]._yb - UN[0]._e.h, u._yb - u._e.h) - 26;
          traits += '<path d="M' + f1(moi._x + moi._e.w * .3) + ' ' + f1(moi._yb - moi._e.h) + 'V' + f1(yh) + 'H' + f1(u._x - u._e.w * .3) + 'V' + f1(u._yb - u._e.h) + '" stroke="#B08048" stroke-width="6" fill="none"' + d + '/>';
          u._xm = (bord(UN[0], 1) + bord(u, -1)) / 2; u._ym = yh;
        }
      });
    }
    if (ENF && UN.length) {
      var groupes = [];
      ENF.liste.forEach(function (q) { var k = q._u >= 0 && q._u < UN.length ? q._u : -1, gr = groupes.filter(function (x) { return x.k === k; })[0]; if (!gr) { gr = { k: k, l: [], xp: k < 0 ? moi._x : UN[k]._xm, yp: k < 0 ? moi._yb + (MOTIF === 'medaillons' && moi._e.rr ? moi._e.rr * 1.1 : 0) : UN[k]._ym }; groupes.push(gr); } gr.l.push(q); });
      groupes.sort(function (a, b) { return a.xp - b.xp; });
      var GAP = 50, GAPG = 120, xe2 = -1e9;
      groupes.forEach(function (gr) { var w = gr.l.reduce(function (s2, q) { return s2 + q._e.w; }, 0) + (gr.l.length - 1) * GAP; gr.w = w; gr.x0 = Math.max(gr.xp - w / 2, xe2); xe2 = gr.x0 + w + GAPG; });
      var gG = groupes[0].x0, gD = groupes[groupes.length - 1].x0 + groupes[groupes.length - 1].w, dxg = 0;
      if (gG < MARGE) dxg = MARGE - gG; if (gD + dxg > W - MARGE) dxg = (W - MARGE) - gD;
      var yHautG = ENF.bas - ENF.h, yBG = yHautG - 34;
      groupes.forEach(function (gr, i) {
        var xx = gr.x0 + dxg; gr.l.forEach(function (q) { q._x = xx + q._e.w / 2; xx += q._e.w + GAP; q._yb = ENF.bas; });
        var yb = yBG - (groupes.length > 1 ? (i % 2) * 18 : 0), xsG = gr.l.map(function (q) { return q._x; }).concat([gr.xp]);
        traits += '<path d="M' + f1(gr.xp) + ' ' + f1(gr.yp) + 'V' + f1(yb) + '" stroke="#B08048" stroke-width="5" fill="none"/>';
        traits += '<path d="M' + f1(Math.min.apply(null, xsG)) + ' ' + f1(yb) + 'H' + f1(Math.max.apply(null, xsG)) + '" stroke="#B08048" stroke-width="5" fill="none" stroke-linecap="round"/>';
        gr.l.forEach(function (q) { traits += '<path d="M' + f1(q._x) + ' ' + f1(yb) + 'V' + f1(q._yb - q._e.h) + '" stroke="#B08048" stroke-width="5" fill="none"/>'; });
      });
    }
    if (ENF && !UN.length) {   /* les enfants : centrés sous la personne choisie, reliés à elle par un trait doré */
      var CJm = CJ && !moi._e.rr, xPar = CJm ? (moi._x + CJ._x) / 2 : moi._x;   /* médaillons : les enfants restent dans l'axe, sous tes racines (symétrie) ; en cartes, ils partent du milieu du couple */
      var totE = ENF.liste.reduce(function (s2, q) { return s2 + q._e.w; }, 0) + (ENF.liste.length - 1) * 50, xe = xPar - totE / 2;
      if (xe < MARGE) xe = MARGE; if (xe + totE > W - MARGE) xe = W - MARGE - totE;
      ENF.liste.forEach(function (q) { q._x = xe + q._e.w / 2; xe += q._e.w + 50; q._yb = ENF.bas; });
      var yHaut = ENF.bas - ENF.h, yDepart = moi.couple && moi._yc != null ? moi._yc + 16 : CJm ? (moi._e.cy != null ? moi._yb - moi._e.h + moi._e.cy : moi._yb - moi._e.h / 2) : moi._yb + (MOTIF === 'medaillons' && moi._e.rr ? moi._e.rr * 1.1 : 0), yB = yHaut - 34;
      var xsE = ENF.liste.map(function (q) { return q._x; }).concat([xPar]);
      traits += '<path d="M' + f1(xPar) + ' ' + f1(yDepart) + 'V' + f1(yB) + '" stroke="#B08048" stroke-width="6" fill="none"/>';
      traits += '<path d="M' + f1(Math.min.apply(null, xsE)) + ' ' + f1(yB) + 'H' + f1(Math.max.apply(null, xsE)) + '" stroke="#B08048" stroke-width="5" fill="none" stroke-linecap="round"/>';
      ENF.liste.forEach(function (q) { traits += '<path d="M' + f1(q._x) + ' ' + f1(yB) + 'V' + f1(q._yb - q._e.h) + '" stroke="#B08048" stroke-width="5" fill="none"/>'; });
    }
    if (CJ) {   /* le couple : un trait doré entre toi et ton conjoint (en pointillé s'ils sont séparés) */
      var yC = moi._e.cy != null ? moi._yb - moi._e.h + moi._e.cy : moi._yb - moi._e.h / 2, xa0 = moi._x + (moi._e.rr ? moi._e.rr : moi._e.w / 2), xb0 = CJ._x - (CJ._e.rr ? CJ._e.rr : CJ._e.w / 2);
      traits += '<path d="M' + f1(xa0) + ' ' + f1(yC) + 'H' + f1(xb0) + '" stroke="#B08048" stroke-width="6" fill="none"' + (CJ.separe ? ' stroke-dasharray="14 10"' : '') + '/>';
    }
    if (fsPlein.length) {   /* frères et sœurs : un trait commun au-dessus de la rangée */
      var tous = [moi].concat(fsPlein), yf = moi._yb - moi._e.h - 30, xa = Math.min.apply(null, tous.map(function (q) { return q._x; })), xb = Math.max.apply(null, tous.map(function (q) { return q._x; }));
      traits += '<path d="M' + f1(xa) + ' ' + f1(yf) + 'H' + f1(xb) + '" stroke="' + OR_FONCE + '" stroke-width="4" fill="none" opacity=".8"/>';
      fsPlein.forEach(function (f) { traits += '<path d="M' + f1(f._x) + ' ' + f1(yf) + 'V' + f1(f._yb - f._e.h) + '" stroke="' + OR_FONCE + '" stroke-width="4" opacity=".8"' + (f.demi ? ' stroke-dasharray="10 9"' : '') + '/>'; });
    }
    /* demi-frères et demi-sœurs : un trait en pointillé qui part de leur seul parent commun, pas de tes deux parents */
    [[moi.mere, fsDemiM], [moi.pere, fsDemiP]].forEach(function (x) {
      var par = x[0], l = x[1]; if (!l.length || !par || par._x == null) return;
      var yd = Math.max.apply(null, l.map(function (f) { return f._yb - f._e.h; })) - 46, xs = l.map(function (f) { return f._x; }).concat([par._x]);
      traits += '<path d="M' + f1(par._x) + ' ' + f1(par._yb) + 'V' + f1(yd) + '" stroke="' + OR_FONCE + '" stroke-width="4" fill="none" opacity=".8" stroke-dasharray="10 9"/>';
      traits += '<path d="M' + f1(Math.min.apply(null, xs)) + ' ' + f1(yd) + 'H' + f1(Math.max.apply(null, xs)) + '" stroke="' + OR_FONCE + '" stroke-width="4" fill="none" opacity=".8" stroke-dasharray="10 9"/>';
      l.forEach(function (f) { traits += '<path d="M' + f1(f._x) + ' ' + f1(yd) + 'V' + f1(f._yb - f._e.h) + '" stroke="' + OR_FONCE + '" stroke-width="4" opacity=".8" stroke-dasharray="10 9"/>'; });
    });

    /* Étiquettes : une carte crème bordée d'or, le symbole (rond = femme, carré = homme) serti en haut */
    var cartes = '';
    function feuilleM(x, y, a, t, c) { return '<path d="M0 0C' + f1(t * .3) + ' ' + f1(-t * .34) + ' ' + f1(t * .75) + ' ' + f1(-t * .26) + ' ' + f1(t) + ' 0C' + f1(t * .75) + ' ' + f1(t * .26) + ' ' + f1(t * .3) + ' ' + f1(t * .34) + ' 0 0Z" fill="' + c + '" transform="translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + a.toFixed(0) + ')"/>'; }
    var TEINTES = ['#C9A06A', '#8E2F5E', '#D9B77E', '#B7577B', '#A9814E', '#E2A9B8'];
    function brin(x, y, sens, t, n) {   /* un brin de feuillage : tige dorée, feuilles bordeaux, roses et dorées, quelques baies */
      var h2 = '', x2 = x + sens * t * 1.7, y2 = y - t * 1.5;
      h2 += '<path d="M' + f1(x) + ' ' + f1(y) + 'Q' + f1(x + sens * t * .5) + ' ' + f1(y - t * .2) + ' ' + f1(x2) + ' ' + f1(y2) + '" stroke="#B08048" stroke-width="' + f1(Math.max(2.5, t * .06)) + '" fill="none" stroke-linecap="round"/>';
      for (var i = 0; i < n; i++) {
        var k = (i + 1) / (n + 1), px = x + (x2 - x) * k + sens * t * .15 * (1 - k), py = y + (y2 - y) * k + t * .1 * (1 - k), cote = i % 2 ? 1 : -1;
        var ang = (sens > 0 ? -40 : -140) + cote * 45 * sens;
        h2 += feuilleM(px, py, ang, t * (.42 - k * .08), TEINTES[(i * 7 + Math.round(x)) % TEINTES.length]);
      }
      h2 += feuilleM(x2, y2, sens > 0 ? -50 : -130, t * .4, TEINTES[Math.round(y) % TEINTES.length]);
      h2 += '<circle cx="' + f1(x2 + sens * t * .2) + '" cy="' + f1(y2 + t * .25) + '" r="' + f1(t * .07) + '" fill="#9A3A68"/><circle cx="' + f1(x2 + sens * t * .05) + '" cy="' + f1(y2 + t * .4) + '" r="' + f1(t * .06) + '" fill="#C9677F"/>';
      return h2;
    }
    function fleuron(x, y, t) {   /* petit ornement doré posé sur le médaillon */
      return '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') scale(' + (t / 40).toFixed(3) + ')" fill="#B08048"><path d="M0 -38C6 -28 6 -18 0 -8C-6 -18 -6 -28 0 -38Z"/><path d="M-4 -8C-14 -10 -22 -18 -22 -26C-14 -24 -8 -18 -4 -8Z"/><path d="M4 -8C14 -10 22 -18 22 -26C14 -24 8 -18 4 -8Z"/><rect x="-10" y="-8" width="20" height="5" rx="2"/></g>';
    }
    gens.concat(fs, ENF ? ENF.liste : [], CJ ? [CJ] : UN).forEach(function (q) {
      if (q.couple) return;
      var e = q._e, x = q._x, yb = q._yb, yt = yb - e.h, moiMeme = q === moi, f = q.sexe === 'f';
      if (e.rr) {
        var rr = e.rr, cy = yt + e.cy, sy = Math.max(10, Math.round(rr * .3)), cs = moiMeme ? '#8E2F5E' : f ? '#D98AA1' : '#EFC3B4', sc;
        cartes += '<circle cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + f1(rr * .92) + '" fill="#FFFBF3"/>';
        if (e.dedans) { sc = rr / 210; cartes += '<image href="' + esc(SPRITES.racine) + '" x="' + f1(x - 906 * sc) + '" y="' + f1(cy - 270 * sc) + '" width="' + f1(1830 * sc) + '" height="' + f1(816 * sc) + '"/>'; }
        else { sc = rr / 152; cartes += '<image href="' + esc(SPRITES.medaillon) + '" x="' + f1(x - 360 * sc) + '" y="' + f1(cy - 279 * sc) + '" width="' + f1(780 * sc) + '" height="' + f1(540 * sc) + '"/>'; }
        if (e.dedans) {
          var Ht = e.l.reduce(function (s2, l) { return s2 + l[1] * 1.16; }, 0), tyd = cy - Ht / 2 + 4;
          e.l.forEach(function (l) { tyd += l[1] * 1.02; cartes += '<text x="' + f1(x) + '" y="' + f1(tyd) + '" text-anchor="middle" class="' + l[4] + '" font-size="' + l[1] + '">' + esc(l[0]) + '</text>'; tyd += l[1] * .14; });
          return;
        }
        cartes += f ? '<circle cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + sy + '" fill="' + cs + '" stroke="' + OR + '" stroke-width="3"/>'
          : '<rect x="' + f1(x - sy) + '" y="' + f1(cy - sy) + '" width="' + 2 * sy + '" height="' + 2 * sy + '" rx="3" fill="' + cs + '" stroke="' + OR + '" stroke-width="3"/>';
        var ty2 = cy + rr + 18;
        e.l.forEach(function (l) { ty2 += l[1] * 1.02; cartes += '<text x="' + f1(x) + '" y="' + f1(ty2) + '" text-anchor="middle" class="' + l[4] + '" font-size="' + l[1] + '" paint-order="stroke" stroke="#FBF5EA" stroke-width="7" stroke-linejoin="round">' + esc(l[0]) + '</text>'; ty2 += l[1] * .14; });
        return;
      }
      cartes += '<rect x="' + f1(x - e.w / 2) + '" y="' + f1(yt) + '" width="' + f1(e.w) + '" height="' + f1(e.h) + '" rx="' + f1(Math.min(22, e.h / 4)) + '" fill="#FFFCF6" stroke="' + (moiMeme ? '#8E2F5E' : OR) + '" stroke-width="' + (moiMeme ? 5 : 3) + '"/>';
      var s = Math.max(11, Math.round(e.l[0][1] * .36)), c = moiMeme ? '#8E2F5E' : f ? '#D98AA1' : '#EFC3B4';
      cartes += f ? '<circle cx="' + f1(x) + '" cy="' + f1(yt) + '" r="' + s + '" fill="' + c + '" stroke="' + OR + '" stroke-width="3"/>'
        : '<rect x="' + f1(x - s) + '" y="' + f1(yt - s) + '" width="' + 2 * s + '" height="' + 2 * s + '" rx="3" fill="' + c + '" stroke="' + OR + '" stroke-width="3"/>';
      var ty = yt + 18 + s * .4;
      e.l.forEach(function (l) { ty += l[1] * 1.02; cartes += '<text x="' + f1(x) + '" y="' + f1(ty) + '" text-anchor="middle" class="' + l[4] + '" font-size="' + l[1] + '">' + esc(l[0]) + '</text>'; ty += l[1] * .14; });
    });

    var coins = false ? [[150, 150, 45], [W - 150, 150, 135], [150, H - 150, -45], [W - 150, H - 150, -135]].map(function (c) {
      return '<g transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ')" fill="#B08048"><path d="M0 0C10 -6 26 -6 40 0C26 6 10 6 0 0Z"/><path d="M0 0C-6 10 -6 26 0 40C6 26 6 10 0 0Z" transform="rotate(-90)"/><circle r="5"/></g>';
    }).join('') : '';
    var fond = '<rect x="-60" y="-60" width="' + (W + 120) + '" height="' + (H + 120) + '" fill="url(#li-papier)"/>' +
      '<rect x="110" y="110" width="' + (W - 220) + '" height="' + (H - 220) + '" fill="none" stroke="' + OR + '" stroke-width="4" opacity=".6"/>' +
      '<rect x="132" y="132" width="' + (W - 264) + '" height="' + (H - 264) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="2" opacity=".6"/>';
    var feuille = function (x, yy, a, t, coul) { return '<path d="M0 0C' + t * .35 + ' ' + -t * .28 + ' ' + t * .75 + ' ' + -t * .22 + ' ' + t + ' 0C' + t * .75 + ' ' + t * .22 + ' ' + t * .35 + ' ' + t * .28 + ' 0 0Z" fill="' + coul + '" transform="translate(' + x + ' ' + yy + ') rotate(' + a + ')"/>'; };
    var titre = '<text x="' + W / 2 + '" y="' + (H < W ? 340 : 400) + '" text-anchor="middle" class="li-titre">' + esc(donnees.titre || 'Mon arbre') + '</text>' +
      '<g transform="translate(0 ' + (H < W ? -60 : 0) + ')"><path d="M' + (W / 2 - 360) + ' 470C' + (W / 2 - 150) + ' 446 ' + (W / 2 + 150) + ' 494 ' + (W / 2 + 360) + ' 466" stroke="' + OR + '" stroke-width="3" fill="none"/>' +
      feuille(W / 2 - 14, 468, -20, 44, '#8E2F5E') + feuille(W / 2 + 14, 470, 160, 38, '#C9677F') + '</g>' +
      (donnees.sousTitre ? '<text x="' + W / 2 + '" y="' + (H < W ? 480 : 552) + '" text-anchor="middle" class="li-sous">' + esc(donnees.sousTitre) + '</text>' : '');
    var pied = '<text x="' + W / 2 + '" y="' + (H - 178) + '" text-anchor="middle" class="li-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-30 ' + W / 2 + ' ' + H / 2 + ')"><text x="' + W / 2 + '" y="' + (H / 2 - 100) + '" text-anchor="middle" class="li-fil">APERÇU</text><text x="' + W / 2 + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="li-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * Math.min(W, H) / (210 * (typeof a3 === "number" ? a3 : 1))) : 0;   /* 4 mm du papier réel (grands formats : a3 = échelle) */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-personnes="' + (gens.length + fs.length) + '" data-generations="' + max + '">' +
      '<defs><radialGradient id="li-papier" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#FFFBF4"/><stop offset=".7" stop-color="#F8F0E3"/><stop offset="1" stop-color="#EFE3D0"/></radialGradient>' +
      '<linearGradient id="li-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6CB95"/><stop offset=".5" stop-color="' + OR + '"/><stop offset="1" stop-color="' + OR_FONCE + '"/></linearGradient>' +
      '<style>.li-titre{font-family:' + GN + ';font-size:128px;fill:' + PRUNE + '}.li-sous{font-family:' + NS + ';font-size:38px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.li-nom{font-family:' + GN + ';fill:#4A0F36}.li-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1.5px;fill:#4A0F36}.li-date{font-family:' + NS + ';font-weight:700;fill:#9A3A68}' +
      '.li-pied{font-family:' + NS + ';font-size:32px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.85}.li-fil{font-family:' + GN + ';font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      fond + coins + titre + traits + cartes + coeur + pied + filigrane + '</svg>';
  }
  /* taille du texte obtenue pour n générations, dans une orientation donnée (0 si ça ne tient pas) : sert à choisir portrait ou paysage */
  function taille(donnees, a3, paysage, motif, n) {
    format(paysage); MOTIF = motif || ''; reserverEnfants(donnees, a3);
    var r = miseEnPage(ranger(donnees.moi, n), n, a3, []);
    return r && r.ok ? r.plan[Math.min(1, n - 1)].fz : 0;
  }
  window.ArbreLignee = { svg: svg, capacite: capacite, taille: taille };
})();
