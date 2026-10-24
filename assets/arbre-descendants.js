/* Genesolia · style « Descendants » : l'arbre qui descend d'une personne (ou d'un couple) vers ses enfants,
   petits-enfants, arrière-petits-enfants. Le cadeau type pour des grands-parents.
   À l'horizontale (3508 x 2480), dans le même esprit que la Lignée : étiquettes crème, traits dorés.
   ArbreDescendants.svg(donnees, o) -> chaîne SVG ; donnees.moi = { prenom, nom, sexe, naissance, deces, enf: [...] }, donnees.conjoint (facultatif)
   ArbreDescendants.capacite(donnees, a3) -> nombre maximal de générations lisibles (2 à 7).
   Chaque descendant peut avoir son conjoint (q.cj) : il s'écrit sous lui, « & Prénom NOM ».
   Rangées très remplies (grands formats) : les étiquettes se lisent de bas en haut, plus serrées. */
(function () {
  'use strict';
  var W = 3508, H = 2480, OR = '#B98A55', OR_FONCE = '#9A6E38', OR_CLAIR = '#D9B77E', PRUNE = '#5A2147';
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  var MARGE = 200, HAUT = 640, BAS0 = H - 330, BAS = BAS0, ECART = 34;
  /* Habillages : '' = cartes crème (Lignée), 'medaillons' = médaillons dorés, 'dore' = l'arbre doré qui pousse vers le haut
     (la personne au pied du tronc, ses descendants dans les branches), sur papier texturé. */
  var THEME = '', SPRITE = 'assets/arbre/medaillon-or.png', UNS = [];   /* UNS : les autres parents de ses enfants (plusieurs unions), à côté de la personne */
  function theme(t) { THEME = t === 'medaillons' || t === 'dore' ? t : ''; BAS = THEME === 'dore' ? BAS0 - 150 : BAS0; }

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ctx = null;
  var MEMO = {};
  function larg(t, taille, police, gras) {
    var cle = t + '|' + taille + '|' + police + '|' + (gras ? 1 : 0); if (MEMO[cle] != null) return MEMO[cle];
    var l = larg0(t, taille, police, gras); try { if (document.fonts && document.fonts.status === 'loaded') MEMO[cle] = l; } catch (e) {} return l;
  }
  function larg0(t, taille, police, gras) {
    try { if (!ctx && typeof document !== 'undefined') ctx = document.createElement('canvas').getContext('2d'); if (ctx) { ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } } catch (e) {}
    return String(t).length * taille * (gras ? .62 : .5);
  }
  function f1(n) { return n.toFixed(1); }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }
  function NOM(p) { return String(p.nom || '').toUpperCase(); }

  /* étiquette : prénom(s), NOM, dates ; « court » = le premier prénom seulement */
  function cjTexte(q, c) { c = c || q.cj; return c ? ('& ' + (String(c.prenom || '').trim().split(/\s+/)[0] || '') + ' ' + NOM(c)).trim() : ''; }
  function etiquette(q, fz, court, vert) {
    var fn = Math.round(fz * .8), fd = Math.round(fz * .78);
    if (vert) {   /* étiquette verticale : « Prénom NOM » puis dates (et le conjoint), lue de bas en haut */
      var mv = String(q.prenom || '').trim().split(/\s+/).filter(Boolean), prev = court ? (mv[0] || '') : mv.join(' ');
      var l1 = [[prev, fz, GN, false, 'de-nom'], [NOM(q), fn, NS, true, 'de-nf']].filter(function (z) { return z[0]; }), dv = datesDe(q), cv = cjTexte(q);
      var lv = [l1.length ? l1 : [['?', fz, GN, false, 'de-nom']]];
      if (vert === 2) { if (dv) lv.push([[dv, fd, NS, true, 'de-date']]); } else if (dv) lv[0] = lv[0].concat([[dv, fd, NS, true, 'de-date']]);
      if (cv) lv.push([[cv + (q.cj2 ? ' · ' + cjTexte(q, q.cj2) : ''), fd, GN, false, 'de-cj']]);
      var lon = Math.max.apply(null, lv.map(function (li) { return li.reduce(function (s0, z) { return s0 + larg(z[0], z[1], z[2], z[3]) * 1.04 + (z[4] === 'de-nf' ? z[0].length * 1.5 : 0); }, 0) + (li.length - 1) * fz * .35; }));
      var ep = lv.length * fz * 1.18 + 10, sy0 = Math.max(9, Math.round(fz * .36)), rmv = THEME === 'medaillons' ? Math.max(sy0 + 4, ep * .42) : 0;
      return { v: true, lv: lv, l: [[prev, fz]], w: Math.round(ep), h: Math.round(lon + 30 + sy0 + (rmv ? 2 * rmv + 10 : 0)), rmv: rmv, lon: lon };
    }
    var mots = String(q.prenom || '').trim().split(/\s+/).filter(Boolean), pre = court ? [mots[0] || ''] : [mots.join(' ')];
    if (!court && mots.length > 1 && larg(pre[0], fz, GN) > Math.max(larg(NOM(q), fn, NS, true), larg(datesDe(q), fd, NS, true)) * 1.25) {
      var best = null; for (var k = 1; k < mots.length; k++) { var a = mots.slice(0, k).join(' '), b = mots.slice(k).join(' '), m = Math.max(larg(a, fz, GN), larg(b, fz, GN)); if (!best || m < best.m) best = { m: m, l: [a, b] }; }
      pre = best.l;
    }
    var l = pre.filter(Boolean).map(function (t) { return [t, fz, GN, false, 'de-nom']; });
    if (NOM(q)) l.push([NOM(q), fn, NS, true, 'de-nf']);
    if (datesDe(q)) l.push([datesDe(q), fd, NS, true, 'de-date']);
    if (cjTexte(q)) l.push([cjTexte(q), fd, GN, false, 'de-cj']);
    if (q.cj2) l.push([cjTexte(q, q.cj2), fd, GN, false, 'de-cj']);
    if (!l.length) l.push(['?', fz, GN, false, 'de-nom']);
    var w = Math.max.apply(null, l.map(function (x) { return larg(x[0], x[1], x[2], x[3]); })) + 40;
    var h = l.reduce(function (s, x) { return s + x[1] * 1.16; }, 0) + 38;
    if (THEME === 'medaillons') {   /* un médaillon doré au-dessus du nom, sans carte */
      var rr = Math.round(fz * .62);
      return { w: Math.max(w - 20, rr * 3.4), h: h - 20 + rr * 2.5 + 18, l: l, rr: rr, cy: rr * 1.5 };
    }
    return { w: w, h: h, l: l };
  }

  /* l'arbre jusqu'à max générations (racine = génération 0) */
  function couper(p, g, max) { return { p: p, g: g, enf: g < max - 1 ? (p.enf || []).map(function (e) { return couper(e, g + 1, max); }) : [] }; }
  function profondeur(p) { return 1 + Math.max.apply(null, [0].concat((p.enf || []).map(profondeur))); }

  /* pile : quand la dernière génération est trop nombreuse, les enfants d'un même parent se rangent en colonne sous lui */
  var PILE = 24, VG = 99;   /* VG : première génération en étiquettes verticales */
  function ecart(g) { return g >= VG ? 8 : ECART; }
  function mesurer(n, fz, court, cj, pile) {
    n.e = etiquette(n.p, n.g === 0 ? Math.round(fz * 1.2) : fz, court, n.g >= VG ? (VERT || 2) : 0);
    n.ec = n.g === 0 && cj ? etiquette(cj, Math.round(fz * 1.2), court) : null;
    n.ecs = n.g === 0 && !cj && UNS.length ? UNS.map(function (u) { return etiquette(u, Math.round(fz * 1.2), court); }) : null;
    var propre = n.ec ? 2 * Math.max(n.e.w, n.ec.w) + 120 : n.ecs ? n.e.w + 2 * Math.max.apply(null, n.ecs.map(function (e) { return e.w + 120; })) : n.e.w;
    n.enf.forEach(function (c) { mesurer(c, fz, court, null, pile); });
    n.pile = !!(pile && n.g > 0 && n.enf.length > 1 && n.enf.every(function (c) { return !c.enf.length; }));
    var enfants = n.pile ? Math.max.apply(null, n.enf.map(function (c) { return c.sw; })) + 60
      : n.enf.reduce(function (s, c) { return s + c.sw; }, 0) + Math.max(0, n.enf.length - 1) * ecart(n.g + 1);
    n.sw = Math.max(propre, enfants); n.swE = enfants;
    n.hPile = n.pile ? n.enf.reduce(function (s, c) { return s + c.e.h; }, 0) + (n.enf.length - 1) * PILE : 0;
    return n;
  }
  /* hauteur totale minimale (rangées + petits écarts), pour savoir si l'arbre tient dans la page */
  function hauteur(r) {
    var l = tous(r, []), hR = [], nG = 0;
    l.forEach(function (n) { nG = Math.max(nG, n.g + 1); var h = Math.max(n.e.h, n.ec ? n.ec.h : 0, n.ecs ? Math.max.apply(null, n.ecs.map(function (e) { return e.h; })) : 0); hR[n.g] = Math.max(hR[n.g] || 0, h); if (n.pile) hR[n.g + 1] = Math.max(hR[n.g + 1] || 0, n.hPile); });
    return hR.reduce(function (s, h) { return s + (h || 0); }, 0) + 110 * (nG - 1);
  }
  function placer(n, x0) {
    if (n.pile) { n.x = x0 + n.sw / 2; n.enf.forEach(function (c) { c.x = n.x + 30; }); return; }
    if (!n.enf.length) { n.x = x0 + n.sw / 2; return; }
    var x = x0 + (n.sw - n.swE) / 2;
    n.enf.forEach(function (c) { placer(c, x); x += c.sw + ecart(c.g); });
    n.x = (n.enf[0].x + n.enf[n.enf.length - 1].x) / 2;
  }
  function tous(n, l) { l.push(n); n.enf.forEach(function (c) { tous(c, l); }); return l; }

  /* plus grande taille de texte qui tient dans la largeur ; null si rien ne tient */
  var VERT = 0;
  function ajuster(d, max, a3) {
    var e0 = typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1, mini = Math.max(10, Math.round(36 / e0)), cj = d.conjoint || null;
    UNS = !cj && d.unions && d.unions.length ? d.unions.slice(0, 2) : [];
    /* [prénom court, enfants en colonne, première génération verticale, lignes des étiquettes verticales] :
       d'abord les étiquettes à plat, puis à la verticale à partir de la génération la plus basse possible */
    var modes = THEME === 'dore' ? [[0, 0, 99, 0], [1, 0, 99, 0]] : [[0, 0, 99, 0], [1, 0, 99, 0], [0, 1, 99, 0], [1, 1, 99, 0]];   /* l'arbre doré : pas de colonne d'enfants (il pousse vers le haut) */
    [2, 1].forEach(function (nl) { for (var v = max - 1; v >= 1; v--) modes.push([0, 0, v, nl]); });
    var ESP = 0;   /* l'arbre doré : d'abord avec des branches assez longues entre les rangées, sinon plus serré (jamais une génération en moins) */
    function ok(r) { return r.sw <= W - 2 * MARGE && hauteur(r) + ESP * (max - 1) <= BAS - HAUT; }
    var FZX = THEME === 'dore' ? 84 : 110;
    for (var m = 0; m < modes.length; m++) {
      VG = modes[m][2]; VERT = modes[m][3];
      var essai = function (fz) { return mesurer(couper(d.moi, 0, max), fz, !!modes[m][0], cj, !!modes[m][1]); };
      var esps = THEME === 'dore' ? [70, 0] : [0];
      for (var k = 0; k < esps.length; k++) {
        ESP = esps[k];
        var r = essai(FZX); if (ok(r)) return { r: r, fz: FZX, court: !!modes[m][0] };
        r = essai(mini); if (!ok(r)) continue;   /* même au plus petit, ça ne tient pas : on essaie autrement */
        var lo = mini, hi = FZX, best = r;
        while (hi - lo > 2) { var mi = Math.round((lo + hi) / 2), r2 = essai(mi); if (ok(r2)) { lo = mi; best = r2; } else hi = mi; }
        r = essai(lo); return { r: ok(r) ? r : best, fz: lo, court: !!modes[m][0] };
      }
    }
    VG = 99; VERT = 0;
    return null;
  }
  function capacite(d, a3, th) {
    if (!d || !d.moi) return 2;
    theme(th);
    var p = Math.min(7, profondeur(d.moi));
    for (var m = p; m >= 2; m--) if (ajuster(d, m, a3)) return m;
    return 2;
  }

  function svg(d, o) {
    o = o || {};
    SPRITE = (o.sprites && o.sprites.medaillon) || 'assets/arbre/medaillon-or.png';
    var a3 = o.a3 || d.a3 || false, cap = capacite(d, a3, o.theme), max = Math.max(2, Math.min(d.nbGen || cap, cap, 7));
    var fzm = Math.max(10, Math.round(36 / (typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1)));
    var aj = ajuster(d, max, a3) || { r: mesurer(couper(d.moi, 0, max), fzm, true, d.conjoint), fz: fzm, court: true };
    var R = aj.r, cj = d.conjoint || null;
    placer(R, MARGE + (W - 2 * MARGE - R.sw) / 2);
    var noeuds = tous(R, []), nG = Math.max.apply(null, noeuds.map(function (n) { return n.g; })) + 1;
    /* hauteurs : la plus haute étiquette de chaque rangée, rangées réparties entre le titre et le bas */
    var hRang = []; noeuds.forEach(function (n) { hRang[n.g] = Math.max(hRang[n.g] || 0, n.e.h, n.ec ? n.ec.h : 0, n.ecs ? Math.max.apply(null, n.ecs.map(function (e) { return e.h; })) : 0); if (n.pile) hRang[n.g + 1] = Math.max(hRang[n.g + 1] || 0, n.hPile); });
    noeuds.forEach(function (n) { if (n.e.v) n.e.h = hRang[n.g]; });   /* cartes verticales d'une même rangée : même hauteur */
    var libre = BAS - HAUT - hRang.reduce(function (s, h) { return s + h; }, 0), pas = nG > 1 ? Math.min(440, libre / (nG - 1)) : 0;
    var total = hRang.reduce(function (s, h) { return s + h; }, 0) + pas * (nG - 1), y = HAUT + Math.max(0, (BAS - HAUT - total) / 2), yTop = [];
    for (var g = 0; g < nG; g++) { yTop[g] = y; y += hRang[g] + pas; }
    var DORE = THEME === 'dore', MED = THEME === 'medaillons';
    if (DORE) for (var g2 = 0; g2 < nG; g2++) yTop[g2] = HAUT + BAS - yTop[g2] - hRang[g2];   /* l'arbre doré pousse vers le haut : la personne en bas, ses descendants au-dessus */
    /* racine et conjoint côte à côte, le couple centré au-dessus des enfants */
    var xr = R.x, xc = null;
    if (R.ec) { xr = R.x - 60 - R.e.w / 2; xc = R.x + 60 + R.ec.w / 2; }   /* le milieu du trait du couple pile au-dessus des enfants */
    /* plusieurs unions : la 1re à droite, la 2e à gauche ; chacune a son trait d'union, ses enfants partent de son milieu */
    var UNI = (R.ecs || []).map(function (e, k) { var s0 = k ? -1 : 1, x = xr + s0 * (R.e.w / 2 + 120 + e.w / 2); return { e: e, p: UNS[k], x: x, xm: xr + s0 * (R.e.w / 2 + 60) }; });
    function depart0(c) { var u = c && c.p && c.p._u >= 0 ? UNI[c.p._u] : null; return u ? u.xm : R.ec ? (xr + R.e.w / 2 + xc - R.ec.w / 2) / 2 : xr; }
    R.xd = xr;

    var traits = '', cartes = '';
    /* arbre doré : branches en ruban, feuillage, pousses au bout des branches (même esprit que l'Arbre doré des ancêtres) */
    var graine = 11; function rnd() { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; }
    function epBranche(g) { return Math.max(6, aj.fz * .5 * Math.pow(.68, g)); }
    function ruban(x1, y1, x2, y2, l1, l2, courbe) {
      var dx = x2 - x1, dy = y2 - y1, nn = Math.sqrt(dx * dx + dy * dy) || 1, px = -dy / nn, py = dx / nn;
      var c1x = x1 + dx * .1 + px * courbe, c1y = y1 + dy * .5 + py * courbe, c2x = x2 - dx * .05 - px * courbe * .3, c2y = y1 + dy * .75;
      var g1 = [], d1 = [];
      for (var i = 0; i <= 24; i++) {
        var t = i / 24, u = 1 - t;
        var x = u * u * u * x1 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x2, y = u * u * u * y1 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y2;
        var tx = 3 * u * u * (c1x - x1) + 6 * u * t * (c2x - c1x) + 3 * t * t * (x2 - c2x), ty = 3 * u * u * (c1y - y1) + 6 * u * t * (c2y - c1y) + 3 * t * t * (y2 - c2y);
        var m = Math.sqrt(tx * tx + ty * ty) || 1, l = (l1 + (l2 - l1) * t) / 2;
        g1.push([x - ty / m * l, y + tx / m * l]); d1.unshift([x + ty / m * l, y - tx / m * l]);
      }
      return { d: 'M' + g1.concat(d1).map(function (q) { return f1(q[0]) + ' ' + f1(q[1]); }).join('L') + 'Z', points: g1.map(function (q, i) { return [(q[0] + d1[24 - i][0]) / 2, (q[1] + d1[24 - i][1]) / 2]; }) };
    }
    function feuilleD(x, yy, a, t, coul, op) { return '<path d="M0 0C' + f1(t * .35) + ' ' + f1(-t * .28) + ' ' + f1(t * .75) + ' ' + f1(-t * .22) + ' ' + f1(t) + ' 0C' + f1(t * .75) + ' ' + f1(t * .22) + ' ' + f1(t * .35) + ' ' + f1(t * .28) + ' 0 0Z" fill="' + coul + '" opacity="' + op + '" transform="translate(' + f1(x) + ' ' + f1(yy) + ') rotate(' + Math.round(a) + ')"/>'; }
    function feuillage(pts, densite, taille) {
      var hh = '';
      pts.forEach(function (q, i) { if (i < 4 || i > 21 || rnd() > densite) return; var a = (rnd() < .5 ? -1 : 1) * (35 + rnd() * 60) - 90 + (rnd() - .5) * 40; hh += feuilleD(q[0], q[1], a, taille * (.7 + rnd() * .6), [OR, OR_CLAIR, OR_FONCE][Math.floor(rnd() * 3)], (.55 + rnd() * .4).toFixed(2)); });
      return hh;
    }
    function pousses(x, y, place, fz) {   /* au bout d'une branche : quelques pousses et feuilles, sans monter jusqu'au titre */
      var L0 = Math.min(fz * 2.2, place); if (L0 < fz * .6) return '';
      var hh = '';
      for (var i = 0; i < 3; i++) {
        var a = -90 + (i - 1) * 38 + (rnd() - .5) * 20, L = L0 * (.6 + rnd() * .4), x2 = x + Math.cos(a * Math.PI / 180) * L, y2 = y + Math.sin(a * Math.PI / 180) * L;
        var b = ruban(x, y, x2, y2, Math.max(4, fz * .1), 1.2, (rnd() - .5) * 24);
        hh += '<path d="' + b.d + '" fill="url(#de-or)"/>' + feuillage(b.points, .5, Math.max(18, fz * .35)) + feuilleD(x2, y2, a, Math.max(22, fz * .42), OR_CLAIR, .9);
      }
      return hh;
    }
    function carte(q, e, x, yt, racine) {
      if (MED) {
        var fm = q.sexe === 'f', cm = racine ? '#8E2F5E' : fm ? '#D98AA1' : '#EFC3B4', m = '';
        if (e.v) {   /* étiquette verticale : un petit médaillon doré en haut, le nom dessous, lu de bas en haut */
          var rm = e.rmv, fzm = e.lv[0][0][1], epm = e.lv.length * fzm * 1.18;
          m += '<circle cx="' + f1(x) + '" cy="' + f1(yt + rm) + '" r="' + f1(rm) + '" fill="#FFFBF3" stroke="url(#de-or)" stroke-width="' + f1(Math.max(2.5, rm * .22)) + '"/>';
          m += fm ? '<circle cx="' + f1(x) + '" cy="' + f1(yt + rm) + '" r="' + f1(rm * .42) + '" fill="' + cm + '"/>' : '<rect x="' + f1(x - rm * .38) + '" y="' + f1(yt + rm * .62) + '" width="' + f1(rm * .76) + '" height="' + f1(rm * .76) + '" rx="2" fill="' + cm + '"/>';
          m += '<g transform="translate(' + f1(x) + ' ' + f1(yt + 2 * rm + 10) + ') rotate(-90)">';
          e.lv.forEach(function (li, k) { var yy = -epm / 2 + (k + .78) * fzm * 1.18; m += '<text x="0" y="' + f1(yy) + '" text-anchor="end" paint-order="stroke" stroke="#FBF5EA" stroke-width="5" stroke-linejoin="round">' + li.map(function (z, j) { return '<tspan class="' + z[4] + '" font-size="' + z[1] + '"' + (j ? ' dx="' + f1(fzm * .35) + '"' : '') + '>' + esc(z[0]) + '</tspan>'; }).join('') + '</text>'; });
          return m + '</g>';
        }
        var rr = e.rr, cy = yt + e.cy, sy = Math.max(10, Math.round(rr * .3)), sc = rr / 152;
        m += '<circle cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + f1(rr * .92) + '" fill="#FFFBF3"/>';
        m += '<image href="' + esc(SPRITE) + '" x="' + f1(x - 360 * sc) + '" y="' + f1(cy - 279 * sc) + '" width="' + f1(780 * sc) + '" height="' + f1(540 * sc) + '"/>';
        if (racine) m += '<circle cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + f1(rr * 1.18) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3"/>';
        m += fm ? '<circle cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + sy + '" fill="' + cm + '" stroke="' + OR + '" stroke-width="3"/>'
          : '<rect x="' + f1(x - sy) + '" y="' + f1(cy - sy) + '" width="' + 2 * sy + '" height="' + 2 * sy + '" rx="3" fill="' + cm + '" stroke="' + OR + '" stroke-width="3"/>';
        var tym = cy + rr + 18;
        e.l.forEach(function (l) { tym += l[1] * 1.02; m += '<text x="' + f1(x) + '" y="' + f1(tym) + '" text-anchor="middle" class="' + l[4] + '" font-size="' + l[1] + '" paint-order="stroke" stroke="#FBF5EA" stroke-width="7" stroke-linejoin="round">' + esc(l[0]) + '</text>'; tym += l[1] * .14; });
        return m;
      }
      if (e.v) {
        var fv = q.sexe === 'f', fzv = e.lv[0][0][1], sv = Math.max(9, Math.round(fzv * .36)), cv = fv ? '#D98AA1' : '#EFC3B4', ep = e.lv.length * fzv * 1.18;
        var tv = '<rect x="' + f1(x - e.w / 2) + '" y="' + f1(yt) + '" width="' + f1(e.w) + '" height="' + f1(e.h) + '" rx="' + f1(Math.min(12, e.w / 3)) + '" fill="#FFFCF6" stroke="' + OR + '" stroke-width="2.5"/>';
        tv += fv ? '<circle cx="' + f1(x) + '" cy="' + f1(yt) + '" r="' + sv + '" fill="' + cv + '" stroke="' + OR + '" stroke-width="2.5"/>' : '<rect x="' + f1(x - sv) + '" y="' + f1(yt - sv) + '" width="' + 2 * sv + '" height="' + 2 * sv + '" rx="2" fill="' + cv + '" stroke="' + OR + '" stroke-width="2.5"/>';
        tv += '<g transform="translate(' + f1(x) + ' ' + f1(yt + (e.h + sv) / 2) + ') rotate(-90)">';
        e.lv.forEach(function (li, k) { var yy = -ep / 2 + (k + .78) * fzv * 1.18; tv += '<text x="0" y="' + f1(yy) + '" text-anchor="middle">' + li.map(function (z, j) { return '<tspan class="' + z[4] + '" font-size="' + z[1] + '"' + (j ? ' dx="' + f1(fzv * .35) + '"' : '') + '>' + esc(z[0]) + '</tspan>'; }).join('') + '</text>'; });
        return tv + '</g>';
      }
      var f = q.sexe === 'f', h = e.h, s = Math.max(11, Math.round(e.l[0][1] * .36)), c = racine ? '#8E2F5E' : f ? '#D98AA1' : '#EFC3B4';
      var t = '<rect x="' + f1(x - e.w / 2) + '" y="' + f1(yt) + '" width="' + f1(e.w) + '" height="' + f1(h) + '" rx="' + f1(Math.min(22, h / 4)) + '" fill="#FFFCF6" stroke="' + (racine ? '#8E2F5E' : OR) + '" stroke-width="' + (racine ? 5 : 3) + '"/>';
      t += f ? '<circle cx="' + f1(x) + '" cy="' + f1(yt) + '" r="' + s + '" fill="' + c + '" stroke="' + OR + '" stroke-width="3"/>'
        : '<rect x="' + f1(x - s) + '" y="' + f1(yt - s) + '" width="' + 2 * s + '" height="' + 2 * s + '" rx="3" fill="' + c + '" stroke="' + OR + '" stroke-width="3"/>';
      var ty = yt + 18 + s * .4;
      e.l.forEach(function (l) { ty += l[1] * 1.02; t += '<text x="' + f1(x) + '" y="' + f1(ty) + '" text-anchor="middle" class="' + l[4] + '" font-size="' + l[1] + '">' + esc(l[0]) + '</text>'; ty += l[1] * .14; });
      return t;
    }
    noeuds.forEach(function (n) { if (n.pile) { var yy = yTop[n.g + 1]; n.enf.forEach(function (c) { c.yt = yy; yy += c.e.h + PILE; }); } });
    noeuds.forEach(function (n) {
      var yt = n.yt != null ? n.yt : yTop[n.g] + (hRang[n.g] - n.e.h) / 2, x = n.g === 0 ? xr : n.x;
      cartes += carte(n.p, n.e, x, yt, n.g === 0);
      if (n.g === 0 && R.ec) {
        var ytc = yTop[0] + (hRang[0] - R.ec.h) / 2, yc = yTop[0] + hRang[0] / 2;
        traits += '<path d="M' + f1(xr + R.e.w / 2) + ' ' + f1(yc) + 'H' + f1(xc - R.ec.w / 2) + '" stroke="#B08048" stroke-width="6" fill="none"' + (cj.separe ? ' stroke-dasharray="14 10"' : '') + '/>';
        cartes += carte(cj, R.ec, xc, ytc, false);
      }
      if (n.g === 0) UNI.forEach(function (u, k) {
        var ycu = yTop[0] + hRang[0] / 2, s0 = k ? -1 : 1, xa = xr + s0 * R.e.w / 2, xb = u.x - s0 * u.e.w / 2;
        traits += '<path d="M' + f1(Math.min(xa, xb)) + ' ' + f1(ycu) + 'H' + f1(Math.max(xa, xb)) + '" stroke="#B08048" stroke-width="6" fill="none"' + (u.p.separe ? ' stroke-dasharray="14 10"' : '') + '/>';
        cartes += carte(u.p, u.e, u.x, yTop[0] + (hRang[0] - u.e.h) / 2, false);
      });
      if (!n.enf.length) { if (DORE && n.g > 0) traits += pousses(x, yt + 4, yt - HAUT - 30, aj.fz); return; }
      if (DORE) {   /* branches dorées effilées, du haut de l'étiquette du parent vers le bas de celle de chaque enfant */
        var yp0 = n.g === 0 ? yTop[0] + 6 : yt + 8, ep0 = epBranche(n.g);
        n.enf.forEach(function (c, i) {
          var xp0 = n.g === 0 ? depart0(c) : n.x, yc0 = yTop[c.g] + (hRang[c.g] - c.e.h) / 2 + c.e.h - 6, dx = c.x - xp0;
          var b = ruban(xp0 + Math.max(-ep0 * .4, Math.min(ep0 * .4, dx * .05)), yp0, c.x, yc0, ep0, ep0 * .45, (dx > 0 ? -1 : 1) * Math.min(90, Math.abs(dx) * .12) + (rnd() - .5) * 30);
          traits += '<path d="' + b.d + '" fill="url(#de-or)"/>' + feuillage(b.points, .62, Math.max(26, aj.fz * .5));
        });
        return;
      }
      if (n.pile) {   /* colonne : un trait qui descend à gauche des cartes, une petite branche vers chacune */
        var xl = n.x + 30 - Math.max.apply(null, n.enf.map(function (c) { return c.e.w; })) / 2 - 34, yDer = n.enf[n.enf.length - 1].yt + n.enf[n.enf.length - 1].e.h / 2;
        traits += '<path d="M' + f1(n.x) + ' ' + f1(yt + n.e.h) + 'V' + f1(yTop[n.g + 1] - 40) + 'H' + f1(xl) + 'V' + f1(yDer) + '" stroke="#B08048" stroke-width="5" fill="none" stroke-linejoin="round"/>';
        n.enf.forEach(function (c) { traits += '<path d="M' + f1(xl) + ' ' + f1(c.yt + c.e.h / 2) + 'H' + f1(c.x - c.e.w / 2) + '" stroke="#B08048" stroke-width="4" fill="none"/>'; });
        return;
      }
      /* traits : du parent (ou du milieu du couple) vers la barre, puis vers chaque enfant */
      /* les enfants de chaque union forment un groupe, relié au milieu de son trait d'union (ou à la personne seule) */
      var grp = [];
      n.enf.forEach(function (c) { var k = n.g === 0 && UNI.length && c.p._u >= 0 ? c.p._u : -1, gr = grp.filter(function (x) { return x.k === k; })[0]; if (!gr) { gr = { k: k, l: [] }; grp.push(gr); } gr.l.push(c); });
      grp.forEach(function (gr, i) {
        var xp = n.g === 0 ? (gr.k >= 0 ? UNI[gr.k].xm : R.ec ? (xr + R.e.w / 2 + xc - R.ec.w / 2) / 2 : xr) : n.x;
        var y0 = n.g === 0 && (R.ec || gr.k >= 0) ? yTop[0] + hRang[0] / 2 : yt + n.e.h, yB = yTop[n.g + 1] - Math.min(70, pas / 2) + (grp.length > 1 ? (i % 2 ? -16 : 16) : 0);
        var xs = gr.l.map(function (c) { return c.x; }).concat([xp]);
        traits += '<path d="M' + f1(xp) + ' ' + f1(y0) + 'V' + f1(yB) + '" stroke="#B08048" stroke-width="5" fill="none"/>';
        traits += '<path d="M' + f1(Math.min.apply(null, xs)) + ' ' + f1(yB) + 'H' + f1(Math.max.apply(null, xs)) + '" stroke="#B08048" stroke-width="5" fill="none" stroke-linecap="round"/>';
        gr.l.forEach(function (c) { var yc2 = yTop[c.g] + (hRang[c.g] - c.e.h) / 2; traits += '<path d="M' + f1(c.x) + ' ' + f1(yB) + 'V' + f1(yc2) + '" stroke="#B08048" stroke-width="5" fill="none"/>'; });
      });
    });

    if (DORE) {   /* le tronc sous la personne, et ses racines */
      var xt = R.ec ? (xr + R.e.w / 2 + xc - R.ec.w / 2) / 2 : xr, yb0 = BAS + 110, e0 = epBranche(0);
      var tr = ruban(xt, yb0, xt, yTop[0] + 6, e0 * 3, e0 * 1.5, 0);
      var rac = '';
      for (var k2 = 0; k2 < 9; k2++) {
        var ar = 12 + k2 * 19.5 + (rnd() - .5) * 8, Lr = 220 + rnd() * 200, x2r = xt + Math.cos(ar * Math.PI / 180) * Lr * 1.5, y2r = yb0 + Math.sin(ar * Math.PI / 180) * Lr * .2 + 12;
        rac += '<path d="' + ruban(xt + (rnd() - .5) * e0, yb0 - 24, x2r, y2r, e0 * .9 - Math.abs(k2 - 4) * e0 * .12, 2, (rnd() - .5) * 60).d + '" fill="url(#de-or)" opacity=".9"/>';
      }
      traits = rac + '<path d="' + tr.d + '" fill="url(#de-or)"/>' + traits;
    }
    var fond = (DORE ? '<image href="' + esc(o.decor || 'assets/arbre/papier-dore.jpg') + '" x="-200" y="-200" width="' + (W + 400) + '" height="' + (H + 400) + '" preserveAspectRatio="xMidYMid slice"/>' : '<rect x="-60" y="-60" width="' + (W + 120) + '" height="' + (H + 120) + '" fill="url(#de-papier)"/>') +
      '<rect x="110" y="110" width="' + (W - 220) + '" height="' + (H - 220) + '" fill="none" stroke="' + OR + '" stroke-width="4" opacity=".6"/>' +
      '<rect x="132" y="132" width="' + (W - 264) + '" height="' + (H - 264) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="2" opacity=".6"/>';
    var feuille = function (x, yy, a, t, coul) { return '<path d="M0 0C' + t * .35 + ' ' + -t * .28 + ' ' + t * .75 + ' ' + -t * .22 + ' ' + t + ' 0C' + t * .75 + ' ' + t * .22 + ' ' + t * .35 + ' ' + t * .28 + ' 0 0Z" fill="' + coul + '" transform="translate(' + x + ' ' + yy + ') rotate(' + a + ')"/>'; };
    var titre = '<text x="' + W / 2 + '" y="340" text-anchor="middle" class="de-titre">' + esc(d.titre || 'Notre famille') + '</text>' +
      '<path d="M' + (W / 2 - 360) + ' 410C' + (W / 2 - 150) + ' 386 ' + (W / 2 + 150) + ' 434 ' + (W / 2 + 360) + ' 406" stroke="' + OR + '" stroke-width="3" fill="none"/>' +
      feuille(W / 2 - 14, 408, -20, 44, '#8E2F5E') + feuille(W / 2 + 14, 410, 160, 38, '#C9677F') +
      (d.sousTitre ? '<text x="' + W / 2 + '" y="490" text-anchor="middle" class="de-sous">' + esc(d.sousTitre) + '</text>' : '');
    var pied = '<text x="' + W / 2 + '" y="' + (H - 178) + '" text-anchor="middle" class="li-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-30 ' + W / 2 + ' ' + H / 2 + ')"><text x="' + W / 2 + '" y="' + (H / 2 - 100) + '" text-anchor="middle" class="de-fil">APERÇU</text><text x="' + W / 2 + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="de-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * Math.min(W, H) / (210 * (typeof a3 === "number" ? a3 : 1))) : 0;   /* 4 mm du papier réel (grands formats : a3 = échelle) */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-personnes="' + (noeuds.length + (cj ? 1 : 0)) + '" data-generations="' + nG + '">' +
      '<defs><linearGradient id="de-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2C48E"/><stop offset=".45" stop-color="' + OR + '"/><stop offset="1" stop-color="' + OR_FONCE + '"/></linearGradient><radialGradient id="de-papier" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#FFFBF4"/><stop offset=".7" stop-color="#F8F0E3"/><stop offset="1" stop-color="#EFE3D0"/></radialGradient>' +
      '<style>.de-titre{font-family:' + GN + ';font-size:128px;fill:' + PRUNE + '}.de-sous{font-family:' + NS + ';font-size:38px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.de-nom{font-family:' + GN + ';fill:#4A0F36}.de-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1.5px;fill:#4A0F36}.de-date{font-family:' + NS + ';font-weight:700;fill:#9A3A68}.de-cj{font-family:' + GN + ';font-style:italic;fill:#6B2F5B}' +
      '.li-pied{font-family:' + NS + ';font-size:32px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.85}.de-fil{font-family:' + GN + ';font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      fond + titre + traits + cartes + pied + filigrane + '</svg>';
  }

  /* ───── « Éventail » des descendants : la personne (et son conjoint) au centre, en bas ;
     ses enfants dans le premier anneau, ses petits-enfants dans le suivant… Chaque branche de la famille a sa couleur,
     chaque personne reçoit une part à la mesure de ses descendants. ───── */
  var EV = { CX: W / 2, CY: H - 300 }; EV.RMAX = Math.min(W / 2 - 200, EV.CY - 600);
  var EV_TEINTES = [['#F7EDDF', '#F0E1C9'], ['#F8E9EC', '#F1DAE0'], ['#EEF1E4', '#E2E8D2'], ['#F1EAF4', '#E6DCEC'], ['#F6EADF', '#EEDCCB']];
  function evMin(a3) { return Math.max(8, Math.round(34 / (typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1))); }
  function evLignes(q, mode, fz, min, complet) {
    var mots = String(q.prenom || '').trim().split(/\s+/).filter(Boolean), pre = complet ? mots.join(' ') : (mots[0] || ''), nom = NOM(q), dt = datesDe(q);
    var fn = Math.max(Math.round(fz * .8), min);
    var l = mode === 3 ? [[pre, fz, GN, false, 'ev-nom'], [nom, fn, NS, true, 'ev-nf'], [dt, fn, NS, true, 'ev-date']]
      : mode === 2 ? [[(pre + ' ' + nom).trim(), fz, GN, false, 'ev-nom'], [dt, fn, NS, true, 'ev-date']]
      : [[(pre + ' ' + nom).trim(), fz, GN, false, 'ev-nom']];
    return l.filter(function (x) { return x[0]; });
  }
  function evH(l) { return l.reduce(function (s0, x) { return s0 + x[1] * 1.18; }, 0); }
  function evL(l) { return l.reduce(function (m, x) { return Math.max(m, larg(x[0], x[1], x[2], x[3])); }, 0); }
  function evCoupe(x, max) {
    if (larg(x[0], x[1], x[2], x[3]) <= max) return x;
    var t = x[0]; while (t.length > 3 && larg(t + '…', x[1], x[2], x[3]) > max) t = t.slice(0, -1);
    return [t.replace(/[\s\-]+$/, '') + '…', x[1], x[2], x[3], x[4]];
  }
  /* les parts : chaque personne, sa génération, ses angles (de π à gauche à 0 à droite), la branche (l'enfant d'où elle descend) */
  function evParts(moi, max) {
    var gens = [];
    function poids(p, g) { var e = g < max - 1 ? (p.enf || []) : []; p._w = e.length ? e.reduce(function (s0, c) { return s0 + poids(c, g + 1); }, 0) : 1; return p._w; }
    function poser(p, g, a0, a1, br) {
      if (g > 0) { (gens[g] = gens[g] || []).push({ p: p, a0: a0, a1: a1, br: br }); }
      var e = g < max - 1 ? (p.enf || []) : [], tot = p._w, a = a0;
      e.forEach(function (c, i) { var th = (a0 - a1) * c._w / tot; poser(c, g + 1, a, a - th, g === 0 ? i : br); a -= th; });
    }
    poids(moi, 0); poser(moi, 0, Math.PI, 0, 0);
    return gens;
  }
  function evPlan(G, n, a3, fzB) {
    var min = evMin(a3), r0 = Math.max(300, Math.round(fzB * 6.5)), r = r0, anneaux = [];
    for (var g = 1; g < n && g < G.length; g++) {
      var ps = G[g]; if (!ps || !ps.length) return null;
      var thMin = Math.min.apply(null, ps.map(function (x) { return x.a0 - x.a1; }));
      if (g <= 2) {   /* à plat tant que ça tient : les premiers anneaux, larges */
        var plat = null;
        for (var fzt = fzB; fzt >= Math.max(min, fzB * .7) && !plat; fzt -= 2) {
          var padt = fzt * .7, okp = true, hm = 0;
          ps.forEach(function (x) { var l = evLignes(x.p, 3, fzt, min, true), th = Math.min(x.a0 - x.a1, Math.PI * .9); hm = Math.max(hm, evH(l)); if (evL(l) / 2 + padt > (r + padt) * Math.tan(th / 2) * .92) okp = false; });
          if (okp) plat = { fz: fzt, h: hm + 2 * padt };
        }
        if (plat) { anneaux.push({ g: g, r0: r, r1: r + plat.h, fz: plat.fz, mode: 3, radial: false }); r += plat.h; continue; }
      }
      var rBesoin = (min * 1.18 / .86) / (2 * Math.sin(Math.min(thMin, Math.PI) / 2));
      if (r < rBesoin && anneaux.length) { anneaux[anneaux.length - 1].r1 = rBesoin; r = rBesoin; }
      var choix = null;
      for (var mode = 3; mode >= 1 && !choix; mode--) for (var fz = Math.round(fzB); fz >= min; fz--) {
        var okr = ps.every(function (x) { return evH(evLignes(x.p, mode, fz, min, false)) <= 2 * r * Math.sin(Math.min(x.a0 - x.a1, Math.PI) / 2) * .86; });
        if (okr) { choix = { mode: mode, fz: fz }; break; }
      }
      if (!choix) return null;
      var cap = choix.fz * 13, pad2 = choix.fz * .6;
      var wr = Math.max.apply(null, ps.map(function (x) { return evL(evLignes(x.p, choix.mode, choix.fz, min, false).map(function (z) { return evCoupe(z, cap); })); }));
      anneaux.push({ g: g, r0: r, r1: r + wr + 2 * pad2, fz: choix.fz, mode: choix.mode, radial: true, cap: cap }); r += wr + 2 * pad2;
    }
    if (r > EV.RMAX) return null;
    return { r0: r0, anneaux: anneaux, rayon: r, fzB: fzB };
  }
  function evMeilleur(G, n, a3) {
    var min = evMin(a3), lo = min, hi = Math.round(Math.max(min * 3, 90)), ok = evPlan(G, n, a3, lo);
    if (!ok) return null;
    while (hi - lo > 1) { var m = Math.round((lo + hi) / 2), p = evPlan(G, n, a3, m); if (p) { ok = p; lo = m; } else hi = m; }
    var k = EV.RMAX / ok.rayon; ok.r0 = Math.round(ok.r0 * k); ok.anneaux.forEach(function (an) { an.r0 *= k; an.r1 *= k; }); ok.rayon = EV.RMAX;
    return ok;
  }
  function evCapacite(d, a3) {
    if (!d || !d.moi) return 2;
    var p = Math.min(7, profondeur(d.moi)), best = 2;
    for (var n = 2; n <= p; n++) { if (evMeilleur(evParts(d.moi, n), n, a3)) best = n; else break; }
    return best;
  }
  function evSvg(d, o) {
    o = o || {};
    var a3 = o.a3 || d.a3 || false, min = evMin(a3), CX = EV.CX, CY = EV.CY;
    var max = Math.max(2, Math.min(d.nbGen || evCapacite(d, a3), profondeur(d.moi), 7)), P = null, G;
    while (max >= 2) { G = evParts(d.moi, max); P = evMeilleur(G, max, a3); if (P || max === 2) break; max--; }
    if (!P) { G = evParts(d.moi, 2); P = evPlan(G, 2, a3, min) || { r0: 300, anneaux: [], rayon: 300, fzB: min }; }
    function pt(r, a) { return f1(CX + r * Math.cos(a)) + ' ' + f1(CY - r * Math.sin(a)); }
    function part(r0, r1, a0, a1) { return 'M' + pt(r1, a0) + 'A' + f1(r1) + ' ' + f1(r1) + ' 0 0 1 ' + pt(r1, a1) + 'L' + pt(r0, a1) + 'A' + f1(r0) + ' ' + f1(r0) + ' 0 0 0 ' + pt(r0, a0) + 'Z'; }
    function bloc(l) { var hh = evH(l), y = -hh / 2; return l.map(function (x) { y += x[1] * 1.18; return '<text x="0" y="' + f1(y - x[1] * .3) + '" text-anchor="middle" class="' + x[4] + '" font-size="' + x[1] + '">' + esc(x[0]) + '</text>'; }).join(''); }
    var parts = '', textes = '', traits = '', personnes = 1 + (d.conjoint ? 1 : 0);
    P.anneaux.forEach(function (an) {
      (G[an.g] || []).forEach(function (x) {
        var T = EV_TEINTES[x.br % EV_TEINTES.length];
        parts += '<path d="' + part(an.r0, an.r1, x.a0, x.a1) + '" fill="' + T[an.g % 2] + '" stroke="' + OR_CLAIR + '" stroke-width="2.5"/>';
        personnes++;
        var phi = (x.a0 + x.a1) / 2, rm = (an.r0 + an.r1) / 2, px = CX + rm * Math.cos(phi), py = CY - rm * Math.sin(phi), deg = phi * 180 / Math.PI, rot;
        var l = evLignes(x.p, an.mode, an.fz, min, !an.radial);
        if (an.radial) { l = l.map(function (z) { return evCoupe(z, an.cap); }); rot = deg <= 90 ? -deg : 180 - deg; } else rot = 90 - deg;
        textes += '<g transform="translate(' + f1(px) + ' ' + f1(py) + ') rotate(' + f1(rot) + ')">' + bloc(l) + '</g>';
      });
    });
    /* une personne sans descendant (dans les générations montrées) : sa part reste claire jusqu'au bord, l'éventail garde sa forme */
    P.anneaux.forEach(function (an) { (G[an.g] || []).forEach(function (x) {
      if ((x.p.enf || []).length && an.g < max - 1) return;
      P.anneaux.forEach(function (b2) { if (b2.g > an.g) parts += '<path d="' + part(b2.r0, b2.r1, x.a0, x.a1) + '" fill="#FBF6EE" stroke="' + OR_CLAIR + '" stroke-width="1.5" opacity=".9"/>'; });
    }); });
    /* un filet doré entre les branches de chaque enfant */
    (G[1] || []).forEach(function (x, i) { if (i) traits += '<path d="M' + pt(P.r0, x.a0) + 'L' + pt(P.rayon, x.a0) + '" stroke="' + OR + '" stroke-width="5"/>'; });
    /* au centre : la personne (et son conjoint), sur une demi-lune prune */
    var r0 = P.r0, moi = d.moi, cj = d.conjoint, fz0 = Math.max(min, Math.min(Math.round(P.fzB * 1.5), 64));
    function l0(fz) {
      var fn = Math.max(Math.round(fz * .8), min), p1 = String(moi.prenom || '').trim().split(/\s+/)[0] || '';
      if (!cj) return evLignes(moi, 3, fz, min, true);
      var p2 = String(cj.prenom || '').trim().split(/\s+/)[0] || '', n1 = NOM(moi), n2 = NOM(cj);
      return [[p1 + ' & ' + p2, fz, GN, false, 'ev-nom'], [n1 && n2 && n1 !== n2 ? n1 + ' · ' + n2 : n1 || n2, fn, NS, true, 'ev-nf']].filter(function (x) { return x[0]; });
    }
    function tient(l) { var hh = evH(l), y = r0 * .44 + hh / 2; return l.every(function (x) { var top = y; y -= x[1] * 1.18; return 2 * Math.sqrt(Math.max(0, r0 * r0 - top * top)) * .86 >= larg(x[0], x[1], x[2], x[3]); }); }
    var lc = l0(fz0); while (!tient(lc) && fz0 > min) { fz0--; lc = l0(fz0); }
    var centre = '<path d="M' + f1(CX - r0) + ' ' + CY + 'A' + r0 + ' ' + r0 + ' 0 0 1 ' + f1(CX + r0) + ' ' + CY + 'Z" fill="' + PRUNE + '"/>' +
      '<path d="M' + f1(CX - r0 + 16) + ' ' + CY + 'A' + (r0 - 16) + ' ' + (r0 - 16) + ' 0 0 1 ' + f1(CX + r0 - 16) + ' ' + CY + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3" opacity=".8"/>' +
      '<g transform="translate(' + CX + ' ' + f1(CY - r0 * .44) + ')" class="ev-moi">' + bloc(lc) + '</g>';
    var Rx = P.rayon, bord = '<path d="M' + f1(CX - Rx) + ' ' + CY + 'A' + f1(Rx) + ' ' + f1(Rx) + ' 0 0 1 ' + f1(CX + Rx) + ' ' + CY + '" fill="none" stroke="' + OR + '" stroke-width="6"/>' +
      '<path d="M' + f1(CX - Rx - 22) + ' ' + CY + 'A' + f1(Rx + 22) + ' ' + f1(Rx + 22) + ' 0 0 1 ' + f1(CX + Rx + 22) + ' ' + CY + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3"/>' +
      '<path d="M' + f1(CX - Rx - 22) + ' ' + CY + 'H' + f1(CX + Rx + 22) + '" stroke="' + OR + '" stroke-width="5"/>';
    var feuille = function (x, yy, a, t, coul) { return '<path d="M0 0C' + t * .35 + ' ' + -t * .28 + ' ' + t * .75 + ' ' + -t * .22 + ' ' + t + ' 0C' + t * .75 + ' ' + t * .22 + ' ' + t * .35 + ' ' + t * .28 + ' 0 0Z" fill="' + coul + '" transform="translate(' + x + ' ' + yy + ') rotate(' + a + ')"/>'; };
    var titre = '<text x="' + W / 2 + '" y="300" text-anchor="middle" class="li-titre">' + esc(d.titre || 'Notre famille') + '</text>' +
      '<g transform="translate(0 -84)"><path d="M' + (W / 2 - 360) + ' 470C' + (W / 2 - 150) + ' 446 ' + (W / 2 + 150) + ' 494 ' + (W / 2 + 360) + ' 466" stroke="' + OR + '" stroke-width="3" fill="none"/>' +
      feuille(W / 2 - 14, 468, -20, 44, '#8E2F5E') + feuille(W / 2 + 14, 470, 160, 38, '#C9677F') + '</g>' +
      (d.sousTitre ? '<text x="' + W / 2 + '" y="452" text-anchor="middle" class="li-sous">' + esc(d.sousTitre) + '</text>' : '');
    var fond = '<rect x="-60" y="-60" width="' + (W + 120) + '" height="' + (H + 120) + '" fill="url(#ev-papier)"/>' +
      '<rect x="110" y="110" width="' + (W - 220) + '" height="' + (H - 220) + '" fill="none" stroke="' + OR + '" stroke-width="4" opacity=".6"/>' +
      '<rect x="132" y="132" width="' + (W - 264) + '" height="' + (H - 264) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="2" opacity=".6"/>';
    var pied = '<text x="' + W / 2 + '" y="' + (H - 160) + '" text-anchor="middle" class="li-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-20 ' + W / 2 + ' ' + H / 2 + ')"><text x="' + W / 2 + '" y="' + (H / 2 - 60) + '" text-anchor="middle" class="li-fil">APERÇU</text><text x="' + W / 2 + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="li-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * H / (210 * (typeof a3 === 'number' ? a3 : 1))) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-personnes="' + personnes + '" data-generations="' + (P.anneaux.length + 1) + '">' +
      '<defs><radialGradient id="ev-papier" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#FFFBF4"/><stop offset=".7" stop-color="#F8F0E3"/><stop offset="1" stop-color="#EFE3D0"/></radialGradient>' +
      '<style>.li-titre{font-family:' + GN + ';font-size:124px;fill:' + PRUNE + '}.li-sous{font-family:' + NS + ';font-size:38px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.ev-nom{font-family:' + GN + ';fill:#4A0F36}.ev-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1px;fill:#4A0F36}.ev-date{font-family:' + NS + ';font-weight:700;fill:#9A3A68}' +
      '.ev-moi .ev-nom,.ev-moi .ev-nf{fill:#FFF6EA}.ev-moi .ev-date{fill:' + OR_CLAIR + '}' +
      '.li-pied{font-family:' + NS + ';font-size:32px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.85}.li-fil{font-family:' + GN + ';font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      fond + titre + parts + traits + bord + centre + textes + pied + filigrane + '</svg>';
  }

  window.ArbreDescendants = { svg: svg, capacite: capacite, profondeur: function (d) { return d && d.moi ? profondeur(d.moi) : 1; } };
  window.ArbreEventailDesc = { svg: evSvg, capacite: evCapacite };
})();
