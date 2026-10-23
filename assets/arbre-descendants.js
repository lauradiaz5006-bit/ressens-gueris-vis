/* Genesolia · style « Descendants » : l'arbre qui descend d'une personne (ou d'un couple) vers ses enfants,
   petits-enfants, arrière-petits-enfants. Le cadeau type pour des grands-parents.
   À l'horizontale (3508 x 2480), dans le même esprit que la Lignée : étiquettes crème, traits dorés.
   ArbreDescendants.svg(donnees, o) -> chaîne SVG ; donnees.moi = { prenom, nom, sexe, naissance, deces, enf: [...] }, donnees.conjoint (facultatif)
   ArbreDescendants.capacite(donnees, a3) -> nombre maximal de générations lisibles (2 à 4). */
(function () {
  'use strict';
  var W = 3508, H = 2480, OR = '#B98A55', OR_FONCE = '#9A6E38', OR_CLAIR = '#D9B77E', PRUNE = '#5A2147';
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  var MARGE = 200, HAUT = 640, BAS = H - 330, ECART = 34;

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ctx = null;
  function larg(t, taille, police, gras) {
    try { if (!ctx && typeof document !== 'undefined') ctx = document.createElement('canvas').getContext('2d'); if (ctx) { ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } } catch (e) {}
    return String(t).length * taille * (gras ? .62 : .5);
  }
  function f1(n) { return n.toFixed(1); }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }
  function NOM(p) { return String(p.nom || '').toUpperCase(); }

  /* étiquette : prénom(s), NOM, dates ; « court » = le premier prénom seulement */
  function etiquette(q, fz, court) {
    var fn = Math.round(fz * .8), fd = Math.round(fz * .78);
    var mots = String(q.prenom || '').trim().split(/\s+/).filter(Boolean), pre = court ? [mots[0] || ''] : [mots.join(' ')];
    if (!court && mots.length > 1 && larg(pre[0], fz, GN) > Math.max(larg(NOM(q), fn, NS, true), larg(datesDe(q), fd, NS, true)) * 1.25) {
      var best = null; for (var k = 1; k < mots.length; k++) { var a = mots.slice(0, k).join(' '), b = mots.slice(k).join(' '), m = Math.max(larg(a, fz, GN), larg(b, fz, GN)); if (!best || m < best.m) best = { m: m, l: [a, b] }; }
      pre = best.l;
    }
    var l = pre.filter(Boolean).map(function (t) { return [t, fz, GN, false, 'de-nom']; });
    if (NOM(q)) l.push([NOM(q), fn, NS, true, 'de-nf']);
    if (datesDe(q)) l.push([datesDe(q), fd, NS, true, 'de-date']);
    if (!l.length) l.push(['?', fz, GN, false, 'de-nom']);
    var w = Math.max.apply(null, l.map(function (x) { return larg(x[0], x[1], x[2], x[3]); })) + 40;
    var h = l.reduce(function (s, x) { return s + x[1] * 1.16; }, 0) + 38;
    return { w: w, h: h, l: l };
  }

  /* l'arbre jusqu'à max générations (racine = génération 0) */
  function couper(p, g, max) { return { p: p, g: g, enf: g < max - 1 ? (p.enf || []).map(function (e) { return couper(e, g + 1, max); }) : [] }; }
  function profondeur(p) { return 1 + Math.max.apply(null, [0].concat((p.enf || []).map(profondeur))); }

  /* pile : quand la dernière génération est trop nombreuse, les enfants d'un même parent se rangent en colonne sous lui */
  var PILE = 24;
  function mesurer(n, fz, court, cj, pile) {
    n.e = etiquette(n.p, n.g === 0 ? Math.round(fz * 1.2) : fz, court);
    n.ec = n.g === 0 && cj ? etiquette(cj, Math.round(fz * 1.2), court) : null;
    var propre = n.ec ? 2 * Math.max(n.e.w, n.ec.w) + 120 : n.e.w;
    n.enf.forEach(function (c) { mesurer(c, fz, court, null, pile); });
    n.pile = !!(pile && n.g > 0 && n.enf.length > 1 && n.enf.every(function (c) { return !c.enf.length; }));
    var enfants = n.pile ? Math.max.apply(null, n.enf.map(function (c) { return c.sw; })) + 60
      : n.enf.reduce(function (s, c) { return s + c.sw; }, 0) + Math.max(0, n.enf.length - 1) * ECART;
    n.sw = Math.max(propre, enfants); n.swE = enfants;
    n.hPile = n.pile ? n.enf.reduce(function (s, c) { return s + c.e.h; }, 0) + (n.enf.length - 1) * PILE : 0;
    return n;
  }
  /* hauteur totale minimale (rangées + petits écarts), pour savoir si l'arbre tient dans la page */
  function hauteur(r) {
    var l = tous(r, []), hR = [], nG = 0;
    l.forEach(function (n) { nG = Math.max(nG, n.g + 1); var h = Math.max(n.e.h, n.ec ? n.ec.h : 0); hR[n.g] = Math.max(hR[n.g] || 0, h); if (n.pile) hR[n.g + 1] = Math.max(hR[n.g + 1] || 0, n.hPile); });
    return hR.reduce(function (s, h) { return s + (h || 0); }, 0) + 110 * (nG - 1);
  }
  function placer(n, x0) {
    if (n.pile) { n.x = x0 + n.sw / 2; n.enf.forEach(function (c) { c.x = n.x + 30; }); return; }
    if (!n.enf.length) { n.x = x0 + n.sw / 2; return; }
    var x = x0 + (n.sw - n.swE) / 2;
    n.enf.forEach(function (c) { placer(c, x); x += c.sw + ECART; });
    n.x = (n.enf[0].x + n.enf[n.enf.length - 1].x) / 2;
  }
  function tous(n, l) { l.push(n); n.enf.forEach(function (c) { tous(c, l); }); return l; }

  /* plus grande taille de texte qui tient dans la largeur ; null si rien ne tient */
  function ajuster(d, max, a3) {
    var mini = a3 ? 26 : 36, cj = d.conjoint || null;
    var modes = [[0, 0], [1, 0], [0, 1], [1, 1]];   /* [prénom court, enfants en colonne] */
    for (var m = 0; m < modes.length; m++) {
      for (var fz = 110; fz >= mini; fz -= 2) {
        var r = mesurer(couper(d.moi, 0, max), fz, !!modes[m][0], cj, !!modes[m][1]);
        if (r.sw <= W - 2 * MARGE && hauteur(r) <= BAS - HAUT) return { r: r, fz: fz, court: !!modes[m][0] };
      }
    }
    return null;
  }
  function capacite(d, a3) {
    if (!d || !d.moi) return 2;
    var p = Math.min(4, profondeur(d.moi));
    for (var m = p; m >= 2; m--) if (ajuster(d, m, a3)) return m;
    return 2;
  }

  function svg(d, o) {
    o = o || {};
    var a3 = !!(o.a3 || d.a3), cap = capacite(d, a3), max = Math.max(2, Math.min(d.nbGen || cap, cap, 4));
    var aj = ajuster(d, max, a3) || { r: mesurer(couper(d.moi, 0, max), a3 ? 26 : 36, true, d.conjoint), fz: a3 ? 26 : 36, court: true };
    var R = aj.r, cj = d.conjoint || null;
    placer(R, MARGE + (W - 2 * MARGE - R.sw) / 2);
    var noeuds = tous(R, []), nG = Math.max.apply(null, noeuds.map(function (n) { return n.g; })) + 1;
    /* hauteurs : la plus haute étiquette de chaque rangée, rangées réparties entre le titre et le bas */
    var hRang = []; noeuds.forEach(function (n) { hRang[n.g] = Math.max(hRang[n.g] || 0, n.e.h, n.ec ? n.ec.h : 0); if (n.pile) hRang[n.g + 1] = Math.max(hRang[n.g + 1] || 0, n.hPile); });
    var libre = BAS - HAUT - hRang.reduce(function (s, h) { return s + h; }, 0), pas = nG > 1 ? Math.min(440, libre / (nG - 1)) : 0;
    var total = hRang.reduce(function (s, h) { return s + h; }, 0) + pas * (nG - 1), y = HAUT + Math.max(0, (BAS - HAUT - total) / 2), yTop = [];
    for (var g = 0; g < nG; g++) { yTop[g] = y; y += hRang[g] + pas; }
    /* racine et conjoint côte à côte, le couple centré au-dessus des enfants */
    var xr = R.x, xc = null;
    if (R.ec) { xr = R.x - 60 - R.e.w / 2; xc = R.x + 60 + R.ec.w / 2; }   /* le milieu du trait du couple pile au-dessus des enfants */
    R.xd = xr;

    var traits = '', cartes = '';
    function carte(q, e, x, yt, racine) {
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
      if (!n.enf.length) return;
      if (n.pile) {   /* colonne : un trait qui descend à gauche des cartes, une petite branche vers chacune */
        var xl = n.x + 30 - Math.max.apply(null, n.enf.map(function (c) { return c.e.w; })) / 2 - 34, yDer = n.enf[n.enf.length - 1].yt + n.enf[n.enf.length - 1].e.h / 2;
        traits += '<path d="M' + f1(n.x) + ' ' + f1(yt + n.e.h) + 'V' + f1(yTop[n.g + 1] - 40) + 'H' + f1(xl) + 'V' + f1(yDer) + '" stroke="#B08048" stroke-width="5" fill="none" stroke-linejoin="round"/>';
        n.enf.forEach(function (c) { traits += '<path d="M' + f1(xl) + ' ' + f1(c.yt + c.e.h / 2) + 'H' + f1(c.x - c.e.w / 2) + '" stroke="#B08048" stroke-width="4" fill="none"/>'; });
        return;
      }
      /* traits : du parent (ou du milieu du couple) vers la barre, puis vers chaque enfant */
      var xp = n.g === 0 ? (R.ec ? (xr + R.e.w / 2 + xc - R.ec.w / 2) / 2 : xr) : n.x, y0 = n.g === 0 && R.ec ? yTop[0] + hRang[0] / 2 : yt + n.e.h, yB = yTop[n.g + 1] - Math.min(70, pas / 2);
      var xs = n.enf.map(function (c) { return c.x; }).concat([xp]);
      traits += '<path d="M' + f1(xp) + ' ' + f1(y0) + 'V' + f1(yB) + '" stroke="#B08048" stroke-width="5" fill="none"/>';
      traits += '<path d="M' + f1(Math.min.apply(null, xs)) + ' ' + f1(yB) + 'H' + f1(Math.max.apply(null, xs)) + '" stroke="#B08048" stroke-width="5" fill="none" stroke-linecap="round"/>';
      n.enf.forEach(function (c) { var yc2 = yTop[c.g] + (hRang[c.g] - c.e.h) / 2; traits += '<path d="M' + f1(c.x) + ' ' + f1(yB) + 'V' + f1(yc2) + '" stroke="#B08048" stroke-width="5" fill="none"/>'; });
    });

    var fond = '<rect x="-60" y="-60" width="' + (W + 120) + '" height="' + (H + 120) + '" fill="url(#de-papier)"/>' +
      '<rect x="110" y="110" width="' + (W - 220) + '" height="' + (H - 220) + '" fill="none" stroke="' + OR + '" stroke-width="4" opacity=".6"/>' +
      '<rect x="132" y="132" width="' + (W - 264) + '" height="' + (H - 264) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="2" opacity=".6"/>';
    var feuille = function (x, yy, a, t, coul) { return '<path d="M0 0C' + t * .35 + ' ' + -t * .28 + ' ' + t * .75 + ' ' + -t * .22 + ' ' + t + ' 0C' + t * .75 + ' ' + t * .22 + ' ' + t * .35 + ' ' + t * .28 + ' 0 0Z" fill="' + coul + '" transform="translate(' + x + ' ' + yy + ') rotate(' + a + ')"/>'; };
    var titre = '<text x="' + W / 2 + '" y="340" text-anchor="middle" class="de-titre">' + esc(d.titre || 'Notre famille') + '</text>' +
      '<path d="M' + (W / 2 - 360) + ' 410C' + (W / 2 - 150) + ' 386 ' + (W / 2 + 150) + ' 434 ' + (W / 2 + 360) + ' 406" stroke="' + OR + '" stroke-width="3" fill="none"/>' +
      feuille(W / 2 - 14, 408, -20, 44, '#8E2F5E') + feuille(W / 2 + 14, 410, 160, 38, '#C9677F') +
      (d.sousTitre ? '<text x="' + W / 2 + '" y="490" text-anchor="middle" class="de-sous">' + esc(d.sousTitre) + '</text>' : '');
    var pied = '<text x="' + W / 2 + '" y="' + (H - 178) + '" text-anchor="middle" class="li-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-30 ' + W / 2 + ' ' + H / 2 + ')"><text x="' + W / 2 + '" y="' + (H / 2 - 100) + '" text-anchor="middle" class="de-fil">APERÇU</text><text x="' + W / 2 + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="de-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * Math.min(W, H) / 210) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-personnes="' + (noeuds.length + (cj ? 1 : 0)) + '" data-generations="' + nG + '">' +
      '<defs><radialGradient id="de-papier" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#FFFBF4"/><stop offset=".7" stop-color="#F8F0E3"/><stop offset="1" stop-color="#EFE3D0"/></radialGradient>' +
      '<style>.de-titre{font-family:' + GN + ';font-size:128px;fill:' + PRUNE + '}.de-sous{font-family:' + NS + ';font-size:38px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.de-nom{font-family:' + GN + ';fill:#4A0F36}.de-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1.5px;fill:#4A0F36}.de-date{font-family:' + NS + ';font-weight:700;fill:#9A3A68}' +
      '.li-pied{font-family:' + NS + ';font-size:32px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.85}.de-fil{font-family:' + GN + ';font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      fond + titre + traits + cartes + pied + filigrane + '</svg>';
  }
  window.ArbreDescendants = { svg: svg, capacite: capacite, profondeur: function (d) { return d && d.moi ? profondeur(d.moi) : 1; } };
})();
