/* Genesolia · « Ma lignée en lumière » : sur le décor peint (assets/arbre/lumiere-fond.jpg : soleil, colonne de lumière,
   feuillage doré et bordeaux, Terre et racines), le site dessine lui-même les sphères de lumière, au nombre exact de la lignée :
   la personne au-dessus de la Terre, ses parents, grands-parents… jusqu'à 5 générations, chacun dans sa sphère avec son cartouche.
   Les vivants dans une sphère blanche au liseré doré ; les défunts dans une sphère blanche nacrée, avec un halo de protection.
   Affiche en portrait (2480 x 3508, A4 ; l'A3 est le même dessin agrandi). Le décor (2:3) est posé en pleine hauteur, fond blanc sur les côtés.
   ArbreLumiere.svg(donnees, o) -> chaîne SVG ; donnees.moi = { prenom, nom, naissance, deces, pere, mere } ; o.decor : image du décor (data URL pour le fichier HD). */
(function () {
  'use strict';
  var W = 2480, H = 3508, CX = W / 2, DW = Math.round(H * 2 / 3), DX = (W - DW) / 2;
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }
  var ctx = null;
  function larg(t, taille, police, gras) {
    try { if (!ctx) ctx = document.createElement('canvas').getContext('2d'); ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } catch (e) { return String(t).length * taille * .55; }
  }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }
  function vivant(p) { return !p.deces && !p.decede && p.naissance && p.naissance > new Date().getFullYear() - 105; }
  function rangs(moi, max) {
    var R = [[moi]];
    for (var g = 1; g < max; g++) { var l = [], un = false; R[g - 1].forEach(function (p) { l.push(p ? p.pere || null : null, p ? p.mere || null : null); if (p && (p.pere || p.mere)) un = true; }); if (!un) break; R.push(l); }
    return R;
  }

  /* le texte du cartouche : prénom, NOM, dates (les dates seulement s'il y a la place) ; taille réduite jusqu'à ce que ça tienne */
  function texte(p, fz, wMax, min, avecDates) {
    var pre = String(p.prenom || '').trim().split(/\s+/)[0] || '', nom = String(p.nom || '').toUpperCase(), dt = avecDates ? datesDe(p) : '';
    for (var f = fz; f >= min; f--) {
      var l = [[pre, f, GN, 'lu-nom'], [nom, Math.round(f * .74), NS, 'lu-nf'], [dt, Math.round(f * .68), NS, 'lu-date']].filter(function (z) { return z[0]; });
      if (l.every(function (z) { return larg(z[0], z[1], z[2], z[3] !== 'lu-nom') <= wMax; })) return l;
    }
    return [[pre, min, GN, 'lu-nom'], [nom, Math.round(min * .8), NS, 'lu-nf']].filter(function (z) { return z[0]; });
  }
  function hauteur(l) { return l.reduce(function (s, z) { return s + z[1] * 1.15; }, 0); }

  /* une silhouette douce, ni homme ni femme, dans la sphère */
  var NCLIP = 0;
  function silhouette(x, y, r) {
    var k = r / 100, id = 'lu-c' + (++NCLIP);
    return '<clipPath id="' + id + '"><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * .96) + '"/></clipPath>' +
      '<g clip-path="url(#' + id + ')"><g transform="translate(' + f1(x) + ' ' + f1(y + r * .12) + ') scale(' + k.toFixed(3) + ')">' +
      '<ellipse cx="0" cy="10" rx="46" ry="62" fill="#FFF3D6" opacity=".55" filter="url(#lu-doux)"/>' +
      '<g fill="url(#lu-corps)" opacity=".92"><circle cx="0" cy="-44" r="15"/>' +
      '<path d="M-7 -30C-8 -26 -10 -23 -26 -18C-38 -14 -42 -4 -43 8L-47 40C-48 50 -44 58 -40 70L40 70C44 58 48 50 47 40L43 8C42 -4 38 -14 26 -18C10 -23 8 -26 7 -30C3 -28 -3 -28 -7 -30Z"/></g></g></g>';
  }
  function etincelles(x, y, r, s) {
    var h = '', t = s;
    for (var i = 0; i < 7; i++) { t = (t * 16807) % 2147483647; var a = t / 2147483647 * 6.283; t = (t * 16807) % 2147483647; var d = r * (.35 + .5 * t / 2147483647); h += '<circle cx="' + f1(x + Math.cos(a) * d) + '" cy="' + f1(y + Math.sin(a) * d) + '" r="' + f1(Math.max(1.5, r * .03)) + '" fill="#FFFFFF" opacity=".9"/>'; }
    return h;
  }
  /* la sphère de lumière, son petit lotus doré, puis le cartouche avec le nom */
  function personne(x, y, r, l, cw, etat, graine) {
    var defunt = etat === 'defunt', h = '';
    var teinte = ['lu-t1', 'lu-t2', 'lu-t3', 'lu-t4'][graine % 4];
    h += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 1.7) + '" fill="url(#' + (defunt ? 'lu-halo-n' : 'lu-halo') + ')"/>';
    if (defunt) h += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 1.14) + '" fill="none" stroke="#E9E3FA" stroke-width="' + f1(Math.max(2, r * .03)) + '" opacity=".8"/>';
    h += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="url(#' + (defunt ? 'lu-sphere-n' : 'lu-sphere') + ')"/>' +
      '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="url(#' + teinte + ')" opacity="' + (defunt ? '.55' : '.8') + '"/>' + silhouette(x, y, r) + etincelles(x, y, r, graine) +
      '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="none" stroke="url(#' + (defunt ? 'lu-nacre' : 'lu-or') + ')" stroke-width="' + f1(Math.max(2.5, r * .055)) + '"/>' +
      '<path d="M' + f1(x - r * .55) + ' ' + f1(y - r * .5) + 'A' + f1(r * .75) + ' ' + f1(r * .75) + ' 0 0 1 ' + f1(x + r * .05) + ' ' + f1(y - r * .78) + '" fill="none" stroke="#FFFFFF" stroke-width="' + f1(r * .06) + '" stroke-linecap="round" opacity=".85"/>';
    /* lotus */
    var ly = y + r * .92, s = r * .32;
    h += '<g transform="translate(' + f1(x) + ' ' + f1(ly) + ') scale(' + (s / 40).toFixed(3) + ')" fill="url(#lu-or)" stroke="#9A6E38" stroke-width="1.5"><path d="M0 -34C10 -20 10 -8 0 4C-10 -8 -10 -20 0 -34Z"/><path d="M-4 2C-20 -2 -30 -14 -32 -26C-18 -22 -9 -12 -4 2Z"/><path d="M4 2C20 -2 30 -14 32 -26C18 -22 9 -12 4 2Z"/><path d="M-6 4C-26 6 -40 -2 -46 -10C-30 -12 -16 -6 -6 4Z"/><path d="M6 4C26 6 40 -2 46 -10C30 -12 16 -6 6 4Z"/></g>';
    /* cartouche */
    var ch = hauteur(l) + 26, cy = y + r + 14, e = Math.min(ch * .35, 22);
    h += '<path d="M' + f1(x - cw / 2 + e) + ' ' + f1(cy) + 'H' + f1(x + cw / 2 - e) + 'L' + f1(x + cw / 2) + ' ' + f1(cy + e) + 'V' + f1(cy + ch - e) + 'L' + f1(x + cw / 2 - e) + ' ' + f1(cy + ch) + 'H' + f1(x - cw / 2 + e) + 'L' + f1(x - cw / 2) + ' ' + f1(cy + ch - e) + 'V' + f1(cy + e) + 'Z" fill="#FFFDF8" stroke="url(#lu-or)" stroke-width="' + f1(Math.max(2.5, ch * .045)) + '"/>' +
      '<path d="M' + f1(x - cw / 2 + e + 6) + ' ' + f1(cy + 6) + 'H' + f1(x + cw / 2 - e - 6) + 'M' + f1(x - cw / 2 + e + 6) + ' ' + f1(cy + ch - 6) + 'H' + f1(x + cw / 2 - e - 6) + '" stroke="#E2C48E" stroke-width="1.5" opacity=".8"/>';
    var ty = cy + 13;
    l.forEach(function (z) { ty += z[1] * 1.15; h += '<text x="' + f1(x) + '" y="' + f1(ty - z[1] * .22) + '" text-anchor="middle" class="' + z[3] + '" font-size="' + z[1] + '">' + esc(z[0]) + '</text>'; });
    return { svg: h, bas: cy + ch };
  }
  function feuille(x, y, a, t, c) { return '<path d="M0 0C' + f1(t * .3) + ' ' + f1(-t * .34) + ' ' + f1(t * .75) + ' ' + f1(-t * .26) + ' ' + f1(t) + ' 0C' + f1(t * .75) + ' ' + f1(t * .26) + ' ' + f1(t * .3) + ' ' + f1(t * .34) + ' 0 0Z" fill="' + c + '" opacity=".9" transform="translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + Math.round(a) + ')"/>'; }

  function svg(d, o) {
    o = o || {};
    var a3 = d.a3 || false, ech = typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1, min = Math.max(14, Math.round(34 / ech));
    var COUPLE = !!d.moi.couple, max = Math.max(2, Math.min(d.nbGen || 4, 5)), R = rangs(d.moi, max), n = R.length;
    var enf = COUPLE ? (d.enfants || []).slice(0, 6) : [];
    /* places : la personne (ou le couple) juste au-dessus de la Terre, la génération la plus ancienne sous le soleil ;
       en couple avec enfants, les enfants au-dessus de la Terre et le couple au-dessus d'eux */
    var b0 = COUPLE ? 1 : 0, nR = n - b0, yM = COUPLE && enf.length ? 1930 : 2280, yT = nR > 3 ? 840 : nR > 2 ? 900 : 1180;
    var G0 = nR > 2 ? (COUPLE && enf.length ? 380 : 430) : yM - yT, pasY = nR > 2 ? (yM - G0 - yT) / (nR - 2) : 0;
    var SPAN = [0, 760, 1520, 1960, 2260], RAY = [118, COUPLE ? 104 : 92, nR > 4 ? 72 : 80, nR > 4 ? 56 : 64, 44], FZ = [58, COUPLE ? 50 : 46, nR > 4 ? 36 : 40, nR > 4 ? 32 : 36, 28];
    var parts = [], graine = 11, parRang = [];
    function yDe(g) { return g === b0 ? yM : yM - G0 - (g - b0 - 1) * pasY; }
    if (!COUPLE) { var p0 = { x: CX, y: yM, r: RAY[0], g: 0, p: d.moi }; parts.push(p0); parRang.push([p0]); } else parRang.push([null]);
    for (var g = 1; g < n; g++) {
      var nb = Math.pow(2, g), span = COUPLE && g === 1 ? 820 : SPAN[g], slot = span / nb, rr = Math.min(RAY[g], slot * .36), y = yDe(g), lst = [];
      for (var k = 0; k < nb; k++) { var q = R[g][k]; var x = CX - span / 2 + slot * (k + .5); var it = q ? { x: x, y: y, r: rr, g: g, p: q, k: k, slot: slot } : null; lst.push(it); if (it) parts.push(it); }
      parRang.push(lst);
    }
    /* les enfants du couple, dans la lumière de la Terre */
    var enfP = [];
    if (enf.length) {
      var ns = enf.length, spanE = Math.min(2100, 420 * ns), slotE = spanE / ns, rE = Math.min(84, slotE * .36);
      enf.forEach(function (q, m) { var it = { x: CX - spanE / 2 + slotE * (m + .5), y: 2330, r: rE, g: 1, p: q, slot: slotE, enfant: true }; enfP.push(it); parts.push(it); });
    }
    /* les branches dorées : de la sphère de chaque enfant vers le cartouche de chacun de ses parents */
    var branches = '', feuilles = '', personnes = '', coeur = '';
    parts.forEach(function (it) {
      var slotW = it.g ? it.slot : 560, cw = Math.min(slotW * .94, it.r * (it.g ? 3.1 : 3.6));
      var l = texte(it.p, Math.max(min, it.enfant ? 40 : FZ[it.g]), cw - 24, min, it.g < 4);
      var r = personne(it.x, it.y, it.r, l, cw, it.g === 0 ? 'vivant' : vivant(it.p) ? 'vivant' : 'defunt', graine += 97);
      it.html = r.svg; it.bas = r.bas;
    });
    function branche(x1, y1, x2, y2, ep, g, j) {
      var my = (y1 + y2) / 2;
      branches += '<path d="M' + f1(x1) + ' ' + f1(y1) + 'C' + f1(x1) + ' ' + f1(my) + ' ' + f1(x2) + ' ' + f1(my + (y2 - my) * .3) + ' ' + f1(x2) + ' ' + f1(y2) + '" fill="none" stroke="url(#lu-or)" stroke-width="' + f1(ep) + '" stroke-linecap="round"/>';
      var fx = (x1 + x2) / 2 + (j ? 1 : -1) * 6, fy = my, t = Math.max(18, 38 - g * 5), s = j ? 1 : -1;
      feuilles += feuille(fx, fy, s > 0 ? -30 : -150, t, '#8E2F5E') + feuille(fx, fy + 6, s > 0 ? 20 : 160, t * .85, '#C9A06A') + feuille(fx - s * 4, fy - 4, s > 0 ? -80 : -100, t * .7, '#B7577B');
    }
    for (g = b0; g < n - 1; g++) {
      parRang[g].forEach(function (c, k) {
        if (!c) return;
        [parRang[g + 1][2 * k], parRang[g + 1][2 * k + 1]].forEach(function (pa, j) {
          if (!pa) return;
          branche(c.x + (j ? 1 : -1) * c.r * .25, c.y - c.r * .92, pa.x, pa.bas, Math.max(3.5, 8 - g * 1.2), g, j);
        });
      });
    }
    if (COUPLE) {   /* le cœur de lumière entre les deux, et les enfants qui en descendent */
      var cp = parRang[1].filter(Boolean), xh = CX, yh = yM;
      if (cp.length === 2) branches += '<path d="M' + f1(cp[0].x + cp[0].r) + ' ' + f1(yh) + 'H' + f1(cp[1].x - cp[1].r) + '" stroke="url(#lu-or)" stroke-width="6" fill="none"/>';
      coeur = '<circle cx="' + f1(xh) + '" cy="' + f1(yh) + '" r="70" fill="url(#lu-halo)"/><path transform="translate(' + f1(xh) + ' ' + f1(yh) + ') scale(2.3)" d="M0 10C-14 0 -18 -8 -13 -13C-9 -17 -3 -15 0 -10C3 -15 9 -17 13 -13C18 -8 14 0 0 10Z" fill="url(#lu-or)" stroke="#FFF6E2" stroke-width="1.5"/>';
      var yd = Math.max.apply(null, cp.map(function (c) { return c.bas; }).concat([yh + 40]));
      enfP.forEach(function (e, m) { branche(xh, yd + 6, e.x, e.y - e.r * .95, 5, 1, e.x > xh ? 1 : 0); });
      if (enfP.length) branches += '<path d="M' + f1(xh) + ' ' + f1(yh + 26) + 'V' + f1(yd + 6) + '" stroke="url(#lu-or)" stroke-width="5"/>';
    }
    parts.slice().reverse().forEach(function (it) { personnes += it.html; }); personnes += coeur;

    var decor = o.decor || 'assets/arbre/lumiere-fond.jpg';
    /* le titre : seulement s'il a été écrit (rien d'imposé) */
    var titre = (d.titre ? '<text x="' + CX + '" y="' + (yT - (nR > 3 ? 220 : 330)) + '" text-anchor="middle" class="lu-titre">' + esc(d.titre) + '</text>' : '') +
      (d.sousTitre ? '<text x="' + CX + '" y="' + (yT - (nR > 3 ? 155 : 260)) + '" text-anchor="middle" class="lu-sous">' + esc(d.sousTitre) + '</text>' : '');
    var phrase = '<text x="' + CX + '" y="' + (H - 64) + '" text-anchor="middle" class="lu-phrase">' + (COUPLE ? 'Que la lumière de nos lignées nous protège et nous accompagne.' : 'Que la lumière de ma lignée me protège et m’accompagne.') + '</text>';
    var pied = '<text x="' + (W - DX - 30) + '" y="' + (H - 30) + '" text-anchor="end" class="lu-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-30 ' + CX + ' ' + H / 2 + ')"><text x="' + CX + '" y="' + (H / 2 - 100) + '" text-anchor="middle" class="lu-fil">APERÇU</text><text x="' + CX + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="lu-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * W / 210) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-generations="' + n + '">' +
      '<defs>' +
      '<linearGradient id="lu-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D79C"/><stop offset=".5" stop-color="#C9973F"/><stop offset="1" stop-color="#9A6E38"/></linearGradient>' +
      '<linearGradient id="lu-nacre" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#D9D2EE"/><stop offset="1" stop-color="#BBAFD8"/></linearGradient>' +
      '<radialGradient id="lu-halo"><stop offset=".5" stop-color="#FFF1CC" stop-opacity=".95"/><stop offset=".72" stop-color="#FFDA96" stop-opacity=".45"/><stop offset="1" stop-color="#FFDA96" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lu-halo-n"><stop offset=".6" stop-color="#F6F2FF" stop-opacity=".75"/><stop offset=".82" stop-color="#E2DBFA" stop-opacity=".35"/><stop offset="1" stop-color="#E2DBFA" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lu-sphere" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FFF8EE"/><stop offset=".85" stop-color="#F8E6EE"/><stop offset="1" stop-color="#EBDDF1"/></radialGradient>' +
      '<radialGradient id="lu-sphere-n" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FAF9FF"/><stop offset=".85" stop-color="#ECE8F8"/><stop offset="1" stop-color="#DCD5EE"/></radialGradient>' +
      '<linearGradient id="lu-corps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBF2"/><stop offset=".6" stop-color="#F8DDB0"/><stop offset="1" stop-color="#EFC48A" stop-opacity=".6"/></linearGradient>' +
      '<radialGradient id="lu-t1" cx=".5" cy=".45" r=".6"><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#E9C3DA"/></radialGradient>' +
      '<radialGradient id="lu-t2" cx=".5" cy=".45" r=".6"><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#CFC6EE"/></radialGradient>' +
      '<radialGradient id="lu-t3" cx=".5" cy=".45" r=".6"><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#C9DCF0"/></radialGradient>' +
      '<radialGradient id="lu-t4" cx=".5" cy=".45" r=".6"><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#F3D7A6"/></radialGradient>' +
      '<filter id="lu-doux" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>' +
      '<style>.lu-titre{font-family:' + GN + ';font-size:118px;fill:#6B2F5B;paint-order:stroke;stroke:#FFFFFF;stroke-width:14px}.lu-sous{font-family:' + NS + ';font-size:34px;letter-spacing:9px;fill:#9A6E38;text-transform:uppercase;paint-order:stroke;stroke:#FFFFFF;stroke-width:10px}' +
      '.lu-nom{font-family:' + GN + ';fill:#4A0F36}.lu-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1.5px;fill:#5A2147}.lu-date{font-family:' + NS + ';font-weight:700;fill:#9A6E38}' +
      '.lu-phrase{font-family:' + GN + ';font-style:italic;font-size:46px;fill:#6B2F5B;paint-order:stroke;stroke:#FFFFFF;stroke-width:12px}.lu-pied{font-family:' + NS + ';font-size:24px;letter-spacing:6px;fill:#9A6E38;paint-order:stroke;stroke:#FFFFFF;stroke-width:8px}.lu-fil{font-family:' + GN + ';font-size:300px;fill:#6B2F5B}</style></defs>' +
      '<rect x="-200" y="-200" width="' + (W + 400) + '" height="' + (H + 400) + '" fill="#FFFFFF"/>' +
      '<image href="' + esc(decor) + '" x="' + f1(DX) + '" y="0" width="' + DW + '" height="' + H + '" preserveAspectRatio="xMidYMid slice"/>' +
      titre + branches + feuilles + personnes + phrase + pied + filigrane + '</svg>';
  }
  window.ArbreLumiere = { svg: svg };
})();
