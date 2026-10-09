/* Genesolia · « Mon arbre à encadrer » : arbre doré dessiné sur le décor A4 (assets/arbre/decor-a4.jpg).
   Les branches suivent la lignée : le tronc porte la personne, chaque branche monte vers un parent,
   puis vers ses parents, jusqu'aux arrière-grands-parents.
   ArbreEncadrer.svg(donnees, options) -> chaîne SVG (viewBox 2480 x 3508, format A4)
   donnees = { titre, sousTitre, moi: P, freresSoeurs: [P], }  avec P = { prenom, nom, naissance, deces, sexe: 'f'|'m', pere: P, mere: P } */
(function () {
  'use strict';
  var W = 2480, H = 3508, OR = '#B98A55', OR_FONCE = '#9A6E38', OR_CLAIR = '#D9B77E', PRUNE = '#5A2147';
  var LIGNES = [2430, 1960, 1490, 1030];           /* moi, parents, grands-parents, arrière-grands-parents */
  var GAUCHE = 300, DROITE = 2180;

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function alea(graine) { var s = graine || 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  /* Branche effilée : un ruban courbe qui s'affine de l1 à l2 */
  function ruban(x1, y1, x2, y2, l1, l2, courbe, r) {
    var dx = x2 - x1, dy = y2 - y1, n = Math.sqrt(dx * dx + dy * dy) || 1, px = -dy / n, py = dx / n;
    var c1x = x1 + dx * 0.25 + px * courbe, c1y = y1 + dy * 0.45 + py * courbe, c2x = x1 + dx * 0.7 - px * courbe * 0.4, c2y = y1 + dy * 0.85 - py * courbe * 0.4;
    var g = [], d = [];
    for (var i = 0; i <= 24; i++) {
      var t = i / 24, u = 1 - t;
      var x = u * u * u * x1 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x2;
      var y = u * u * u * y1 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y2;
      var tx = 3 * u * u * (c1x - x1) + 6 * u * t * (c2x - c1x) + 3 * t * t * (x2 - c2x);
      var ty = 3 * u * u * (c1y - y1) + 6 * u * t * (c2y - c1y) + 3 * t * t * (y2 - c2y);
      var m = Math.sqrt(tx * tx + ty * ty) || 1, l = (l1 + (l2 - l1) * t) / 2;
      g.push([x - ty / m * l, y + tx / m * l]); d.unshift([x + ty / m * l, y - tx / m * l]);
    }
    var pts = g.concat(d);
    return { d: 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z', points: g.map(function (p, i) { return [(p[0] + d[24 - i][0]) / 2, (p[1] + d[24 - i][1]) / 2]; }) };
  }
  function feuille(x, y, a, t, couleur, op) {
    return '<path d="M0 0C' + (t * .35) + ' ' + (-t * .28) + ' ' + (t * .75) + ' ' + (-t * .22) + ' ' + t + ' 0C' + (t * .75) + ' ' + (t * .22) + ' ' + (t * .35) + ' ' + (t * .28) + ' 0 0Z" fill="' + couleur + '" opacity="' + op + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + a.toFixed(0) + ')"/>';
  }
  function feuillage(points, r, densite, taille) {
    var h = '';
    points.forEach(function (p, i) {
      if (i < 4 || r() > densite) return;
      var a = (r() < .5 ? -1 : 1) * (35 + r() * 60) - 90 + (r() - .5) * 40, t = taille * (.7 + r() * .6);
      h += feuille(p[0], p[1], a, t, [OR, OR_CLAIR, OR_FONCE][Math.floor(r() * 3)], (.55 + r() * .4).toFixed(2));
    });
    return h;
  }
  /* Petites pousses décoratives au bout d'une branche */
  function pousses(x, y, angle, r, n, long) {
    var h = '';
    for (var i = 0; i < n; i++) {
      var a = angle + (r() - .5) * 110, L = long * (.55 + r() * .6), x2 = x + Math.cos(a * Math.PI / 180) * L, y2 = y + Math.sin(a * Math.PI / 180) * L;
      var b = ruban(x, y, x2, y2, 7, 1.2, (r() - .5) * 40, r);
      h += '<path d="' + b.d + '" fill="url(#ae-or)"/>' + feuillage(b.points, r, .55, 34) + feuille(x2, y2, a, 40, OR_CLAIR, .9);
    }
    return h;
  }

  function placer(p, g, i, sortie) {
    if (!p || g > 3) return;
    var n = Math.pow(2, g), x = g === 0 ? W / 2 : GAUCHE + (i + .5) * (DROITE - GAUCHE) / n;
    p._x = x; p._y = LIGNES[g]; p._g = g; sortie.push(p);
    placer(p.pere, g + 1, i * 2, sortie); placer(p.mere, g + 1, i * 2 + 1, sortie);
  }

  function svg(donnees, o) {
    o = o || {};
    var r = alea(o.graine || 11), gens = [], moi = donnees.moi, h = '';
    placer(moi, 0, 0, gens);
    var tronc = { x: W / 2, y: 2950 }, haut = { x: W / 2, y: LIGNES[0] + 70 };

    /* Racines */
    for (var k = 0; k < 9; k++) {
      var a = 20 + k * 17.5 + (r() - .5) * 8, L = 260 + r() * 220, x2 = tronc.x + Math.cos(a * Math.PI / 180) * L * 1.5, y2 = tronc.y + Math.sin(a * Math.PI / 180) * L * .38 + 30;
      var rb = ruban(tronc.x + (r() - .5) * 60, tronc.y - 30, x2, y2, 34 - Math.abs(k - 4) * 4, 2, (r() - .5) * 90, r);
      h += '<path d="' + rb.d + '" fill="url(#ae-or)" opacity=".92"/>';
      var sx = x2 - (x2 - tronc.x) * .35, sy = y2 - (y2 - tronc.y) * .35;
      var rb2 = ruban(sx, sy, sx + (x2 - tronc.x) * .35 + (r() - .5) * 120, sy + 50 + r() * 40, 8, 1, (r() - .5) * 50, r);
      h += '<path d="' + rb2.d + '" fill="url(#ae-or)" opacity=".8"/>';
    }
    /* Tronc */
    var t = ruban(tronc.x, tronc.y, haut.x, haut.y + 40, 190, 90, 26, r);
    h += '<path d="' + t.d + '" fill="url(#ae-or)"/>';
    for (var s = 0; s < 6; s++) { var sx2 = tronc.x - 50 + s * 20 + (r() - .5) * 10; h += '<path d="M' + sx2 + ' ' + (tronc.y - 20) + 'C' + (sx2 + (r() - .5) * 30) + ' ' + (tronc.y - 300) + ' ' + (sx2 + (r() - .5) * 30) + ' ' + (haut.y + 300) + ' ' + (W / 2 + (s - 2.5) * 10) + ' ' + (haut.y + 60) + '" stroke="' + OR_FONCE + '" stroke-width="3" fill="none" opacity=".35"/>'; }

    /* Branches de la lignée : de chaque personne vers son père et sa mère */
    var epaisseur = [64, 40, 24, 12];
    gens.forEach(function (p) {
      [p.pere, p.mere].forEach(function (q, j) {
        if (!q || q._x == null) return;
        var x1 = p._x + (p._g === 0 ? (j ? 30 : -30) : 0), y1 = p._g === 0 ? haut.y + 30 : p._y - 40;
        var b = ruban(x1, y1, q._x, q._y + 44, epaisseur[p._g], epaisseur[p._g] * .55, (j ? 1 : -1) * (60 + r() * 50), r);
        h += '<path d="' + b.d + '" fill="url(#ae-or)"/>' + feuillage(b.points, r, .7, 50 - p._g * 5);
        /* rameaux secondaires vers l'extérieur, pour remplir la couronne */
        for (var k = 5; k < 21; k += 2 + Math.floor(r() * 3)) {
          if (r() > .75) continue;
          var a0 = b.points[k], a1 = b.points[k + 1], dir = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]) * 180 / Math.PI;
          var cote = q._x < W / 2 ? -1 : 1, ang = dir + cote * (35 + r() * 45) * (r() < .25 ? -1 : 1), L = 110 + r() * 170 - p._g * 15;
          var x3 = a0[0] + Math.cos(ang * Math.PI / 180) * L, y3 = a0[1] + Math.sin(ang * Math.PI / 180) * L;
          var tw = ruban(a0[0], a0[1], x3, y3, Math.max(5, epaisseur[p._g] * .3), 1.2, (r() - .5) * 50, r);
          h += '<path d="' + tw.d + '" fill="url(#ae-or)"/>' + feuillage(tw.points, r, .75, 40) + feuille(x3, y3, ang, 44, [OR_CLAIR, OR][Math.floor(r() * 2)], .9);
        }
      });
      /* Bout de la lignée : la couronne continue en pousses et feuilles */
      if (p._g === 3 || (!p.pere && !p.mere && p._g > 0)) h += pousses(p._x, p._y - 46, -90, r, 6, 190);
    });
    /* Pousses de remplissage sur les côtés de la couronne */

    /* Frères et sœurs : sur la même ligne que la personne, reliés par un trait doré */
    var fs = donnees.freresSoeurs || [], tous = [moi];
    fs.forEach(function (f, i) { f._x = W / 2 + (i % 2 ? -1 : 1) * 250 * (Math.floor(i / 2) + 1); f._y = LIGNES[0]; f._g = 0; tous.push(f); });
    var liens = '';
    if (fs.length) {
      var xs = tous.map(function (q) { return q._x; }), y0 = LIGNES[0] - 90;
      liens += '<path d="M' + Math.min.apply(null, xs) + ' ' + y0 + 'H' + Math.max.apply(null, xs) + '" stroke="' + OR_FONCE + '" stroke-width="4" fill="none"/>';
      tous.forEach(function (q) { liens += '<path d="M' + q._x + ' ' + y0 + 'V' + (q._y - 46) + '" stroke="' + OR_FONCE + '" stroke-width="4"/>'; });
    }
    /* Couples : trait fin entre les deux parents de chaque personne */
    gens.forEach(function (p) { if (p.pere && p.mere && p.pere._x != null && p.mere._x != null) liens += '<path d="M' + (p.pere._x + 48) + ' ' + p.pere._y + 'H' + (p.mere._x - 48) + '" stroke="' + OR_FONCE + '" stroke-width="3.5" stroke-dasharray="' + (p._g >= 2 ? '10 8' : 'none') + '" opacity=".8"/>'; });

    /* Personnes */
    var pers = '';
    gens.concat(fs).forEach(function (p) {
      var x = p._x, y = p._y, moiMeme = p === moi, rr = p._g === 3 ? 38 : 46, f = p.sexe === 'f';
      var fond = moiMeme ? '#8E2F5E' : f ? '#D98AA1' : '#EFC3B4';
      pers += '<g filter="url(#ae-ombre)">' + (f ? '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="' + fond + '" stroke="' + OR + '" stroke-width="5"/>' : '<rect x="' + (x - rr) + '" y="' + (y - rr) + '" width="' + rr * 2 + '" height="' + rr * 2 + '" rx="6" fill="' + fond + '" stroke="' + OR + '" stroke-width="5"/>') + '</g>';
      if (moiMeme) pers += '<circle cx="' + x + '" cy="' + y + '" r="' + (rr + 14) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3"/>';
      var nom = (p.prenom || '') + (p._g <= 1 && p.nom ? ' ' + p.nom : ''), dates = (p.naissance || '') + (p.deces ? ' – ' + p.deces : '');
      var ty = y + rr + (p._g === 3 ? 44 : 54), fz = p._g === 3 ? 36 : 42;
      pers += '<text x="' + x + '" y="' + ty + '" text-anchor="middle" class="ae-nom" font-size="' + fz + '">' + esc(nom) + '</text>';
      if (dates) pers += '<text x="' + x + '" y="' + (ty + fz * .95) + '" text-anchor="middle" class="ae-date" font-size="' + (fz * .66).toFixed(0) + '">' + esc(dates) + '</text>';
    });

    var titre = '<text x="' + W / 2 + '" y="430" text-anchor="middle" class="ae-titre">' + esc(donnees.titre || 'Mon arbre') + '</text>' +
      '<path d="M' + (W / 2 - 340) + ' 505C' + (W / 2 - 150) + ' 480 ' + (W / 2 + 150) + ' 530 ' + (W / 2 + 340) + ' 500" stroke="' + OR + '" stroke-width="3" fill="none"/>' + feuille(W / 2 - 14, 498, -20, 44, '#8E2F5E', .9) + feuille(W / 2 + 14, 500, 160, 38, '#C9677F', .85) +
      (donnees.sousTitre ? '<text x="' + W / 2 + '" y="590" text-anchor="middle" class="ae-sous">' + esc(donnees.sousTitre) + '</text>' : '');
    var pied = '<text x="' + W / 2 + '" y="3275" text-anchor="middle" class="ae-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".16" transform="rotate(-30 1240 1754)"><text x="1240" y="1650" text-anchor="middle" class="ae-filigrane">APERÇU</text><text x="1240" y="2050" text-anchor="middle" class="ae-filigrane">GENESOLIA</text></g>' : '';

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">' +
      '<defs><linearGradient id="ae-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2C48E"/><stop offset=".45" stop-color="' + OR + '"/><stop offset="1" stop-color="' + OR_FONCE + '"/></linearGradient>' +
      '<filter id="ae-ombre" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#7A5226" flood-opacity=".28"/></filter>' +
      '<style>.ae-titre{font-family:"Gilda Display",Georgia,serif;font-size:132px;fill:' + PRUNE + '}.ae-sous{font-family:"Nunito Sans",sans-serif;font-size:40px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.ae-nom{font-family:"Gilda Display",Georgia,serif;fill:' + PRUNE + ';paint-order:stroke;stroke:#FBF6EC;stroke-width:12px;stroke-linejoin:round}.ae-date{font-family:"Nunito Sans",sans-serif;fill:#7A5A3A;paint-order:stroke;stroke:#FBF6EC;stroke-width:10px;stroke-linejoin:round}' +
      '.ae-pied{font-family:"Nunito Sans",sans-serif;font-size:34px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.9}.ae-filigrane{font-family:"Gilda Display",serif;font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      (o.decor !== false ? '<image href="' + esc(o.decor || 'assets/arbre/decor-a4.jpg') + '" x="0" y="0" width="' + W + '" height="' + H + '" preserveAspectRatio="xMidYMid slice"/>' : '') +
      titre + '<g>' + h + '</g>' + liens + pers + pied + filigrane + '</svg>';
  }
  window.ArbreEncadrer = { svg: svg };
})();
