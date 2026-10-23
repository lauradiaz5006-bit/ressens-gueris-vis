/* Genesolia · « Mon arbre à encadrer » : arbre doré dessiné sur le décor A4 (assets/arbre/decor-a4.jpg).
   Les branches suivent la lignée : le tronc porte la personne, chaque branche monte vers un parent,
   puis vers ses parents, jusqu'aux arrière-grands-parents.
   ArbreEncadrer.svg(donnees, options) -> chaîne SVG (viewBox 2480 x 3508, format A4 ; l'A3 est le même dessin agrandi)
   donnees.nbGen : 3, 4 ou 5 générations (5 seulement pour l'A3 : les dates y font 8 points)
   options.fondPerdu : ajoute 4 mm de décor tout autour (fichier pour l'imprimeur), l'arbre ne bouge pas
   donnees = { titre, sousTitre, moi: P, freresSoeurs: [P], }  avec P = { prenom, nom, naissance, deces, sexe: 'f'|'m', pere: P, mere: P } */
(function () {
  'use strict';
  var W = 2480, H = 3508, OR = '#B98A55', OR_FONCE = '#9A6E38', OR_CLAIR = '#D9B77E', PRUNE = '#5A2147';
  /* Mise en page selon le nombre de générations (3 ou 4 en A4, jusqu'à 5 en A3).
     Tailles en pixels du dessin (2480 de large) : 34 px = 8 points en A4 ; 24 px = 8 points en A3. */
  var MISE = {
    3: { lignes: [2430, 1830, 1230], gauche: 300, droite: 2180, nom: [56, 52, 48], date: [40, 38, 36], rayon: [48, 46, 44] },
    4: { lignes: [2430, 1960, 1490, 1030], gauche: 260, droite: 2220, nom: [50, 46, 42, 38], date: [38, 36, 34, 34], rayon: [46, 44, 40, 36] },
    5: { lignes: [2470, 2100, 1730, 1360, 960], gauche: 130, droite: 2350, nom: [44, 40, 36, 30, 26], date: [32, 30, 28, 26, 24], rayon: [42, 38, 34, 28, 22] }
  };

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
  /* Rameau retombant (façon figuier pleureur) : il monte un peu vers l'extérieur, s'arrondit puis retombe,
     avec des feuilles qui pendent le long de la courbe */
  function retombant(x, y, cote, L, epais, r) {
    var cx = x + cote * L * (.45 + r() * .15), cy = y - L * (.45 + r() * .2), ex = x + cote * L * (.8 + r() * .2), ey = y + L * (.35 + r() * .3);
    var c = [], g = [], d = [];
    for (var i = 0; i <= 28; i++) {
      var t = i / 28, u = 1 - t;
      c.push([u * u * x + 2 * u * t * cx + t * t * ex, u * u * y + 2 * u * t * cy + t * t * ey]);
    }
    c.forEach(function (pt, i) {
      var q = c[Math.min(i + 1, 28)], o = c[Math.max(i - 1, 0)], tx = q[0] - o[0], ty = q[1] - o[1], m = Math.sqrt(tx * tx + ty * ty) || 1, l = (epais + (1 - epais) * i / 28) / 2;
      g.push([pt[0] - ty / m * l, pt[1] + tx / m * l]); d.unshift([pt[0] + ty / m * l, pt[1] - tx / m * l]);
    });
    var h = '<path d="M' + g.concat(d).map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z" fill="url(#ae-or)"/>';
    c.forEach(function (pt, i) {
      if (i < 6 || r() > .6) return;
      var pend = i > 12, a = pend ? 90 + (r() - .5) * 50 - cote * 15 : -90 + cote * (40 + r() * 40), t2 = (pend ? 30 : 26) * (.75 + r() * .5);
      h += feuille(pt[0], pt[1], a, t2, [OR, OR_CLAIR, OR_FONCE][Math.floor(r() * 3)], (.6 + r() * .35).toFixed(2));
    });
    h += feuille(ex, ey, 95 - cote * 10, 40, OR_CLAIR, .9);
    return h;
  }
  /* Petites pousses décoratives au bout d'une branche */
  function pousses(x, y, angle, r, n, long) {
    var h = '';
    for (var i = 0; i < n; i++) {
      if (i % 2) { h += retombant(x, y, i % 4 === 1 ? -1 : 1, long * (.9 + r() * .5), 6, r); continue; }
      var a = angle + (r() - .5) * 110, L = long * (.55 + r() * .6), x2 = x + Math.cos(a * Math.PI / 180) * L, y2 = y + Math.sin(a * Math.PI / 180) * L;
      var b = ruban(x, y, x2, y2, 7, 1.2, (r() - .5) * 40, r);
      h += '<path d="' + b.d + '" fill="url(#ae-or)"/>' + feuillage(b.points, r, .55, 34) + feuille(x2, y2, a, 40, OR_CLAIR, .9);
    }
    return h;
  }

  /* Placement : chaque personne reçoit une largeur à la mesure des ancêtres qu'elle porte,
     pour que l'arbre reste centré et sans trou quand une branche est vide */
  function poids(p, g, max) {
    if (!p) return 0;
    var w = g < max - 1 ? poids(p.pere, g + 1, max) + poids(p.mere, g + 1, max) : 0;
    p._poids = Math.max(1, w); return p._poids;
  }
  function placer(p, g, x0, x1, M, max, sortie) {
    if (!p || g >= max) return;
    p._x = (x0 + x1) / 2; p._y = M.lignes[g]; p._g = g; sortie.push(p);
    var wp = p.pere && g < max - 1 ? p.pere._poids : 0, wm = p.mere && g < max - 1 ? p.mere._poids : 0, tot = wp + wm;
    if (!tot) return;
    var mil = x0 + (x1 - x0) * wp / tot;
    if (wp) placer(p.pere, g + 1, x0, mil, M, max, sortie);
    if (wm) placer(p.mere, g + 1, mil, x1, M, max, sortie);
  }
  /* Étiquette d'une personne : prénom(s) sur une ou deux lignes, NOM, dates */
  function lignesNom(prenom, fz, maxL) {
    prenom = String(prenom || '').trim();
    if (prenom.length * fz * .5 <= maxL || prenom.indexOf(' ') < 0) return [prenom];
    var mots = prenom.split(' '), best = null;
    for (var k = 1; k < mots.length; k++) { var a = mots.slice(0, k).join(' '), b = mots.slice(k).join(' '), m = Math.max(a.length, b.length); if (!best || m < best.m) best = { m: m, l: [a, b] }; }
    return best.l;
  }
  function etiquette(p, M) {
    var g = p._g, fz = M.nom[g], fd = M.date[g], fn = Math.max(Math.round(fz * .8), M.nom.length === 5 ? 22 : 30);   /* au moins 7 points imprimés */
    var pre = lignesNom(p.prenom, fz, 15 * fz * .5), nom = String(p.nom || '').toUpperCase(), dates = (p.naissance || '') + (p.deces ? ' – ' + p.deces : '');
    var w = Math.max.apply(null, pre.map(function (l) { return l.length * fz * .5; }).concat([nom.length * fn * .68, dates.length * fd * .6])) + 40;
    var h = pre.length * fz * 1.08 + (nom ? fn * 1.15 : 0) + (dates ? fd * 1.25 : 0) + 22;
    return { fz: fz, fd: fd, fn: fn, pre: pre, nom: nom, dates: dates, w: w, h: h };
  }
  /* Écarte les étiquettes d'une même rangée ; si la place manque, une personne sur deux monte d'un cran (en quinconce) */
  function ecarter(rang, x0, x1) {
    function pousser(liste) {
      for (var i = 1; i < liste.length; i++) { var a = liste[i - 1], b = liste[i], ecart = (a._et.w + b._et.w) / 2 + 14; if (b._x - a._x < ecart) b._x = a._x + ecart; }
      var deb = liste[0], fin = liste[liste.length - 1], deb0 = deb._x - deb._et.w / 2, fin0 = fin._x + fin._et.w / 2;
      if (fin0 > x1) { var d = fin0 - x1; liste.forEach(function (q) { q._x -= d; }); }
      if (liste[0]._x - liste[0]._et.w / 2 < x0) {
        liste[0]._x = x0 + liste[0]._et.w / 2;
        for (var j = 1; j < liste.length; j++) { var e2 = (liste[j - 1]._et.w + liste[j]._et.w) / 2 + 14; if (liste[j]._x - liste[j - 1]._x < e2) liste[j]._x = liste[j - 1]._x + e2; }
      }
    }
    rang.sort(function (a, b) { return a._x - b._x; });
    var serre = rang.some(function (q, i) { return i && q._x - rang[i - 1]._x < (q._et.w + rang[i - 1]._et.w) / 2 + 14; });
    if (!serre || rang.length < 3) { pousser(rang); return false; }
    var depart = rang.map(function (q) { return q._x; });
    var hauts = rang.filter(function (q, i) { return i % 2; }), bas = rang.filter(function (q, i) { return !(i % 2); });
    pousser(bas); pousser(hauts);
    rang.forEach(function (q, i) { if (Math.abs(q._x - depart[i]) > 400) q._x = depart[i]; });
    hauts.forEach(function (q) { q._y -= q._et.h + q._et.fz * .4 + 30; q._monte = true; });
    return true;
  }

  function svg(donnees, o) {
    o = o || {};
    var r = alea(o.graine || 11), gens = [], moi = donnees.moi, h = '';
    var max = Math.min(5, Math.max(2, donnees.nbGen || 4)), M = MISE[Math.max(3, max)];
    poids(moi, 0, max);
    placer(moi, 0, M.gauche, M.droite, M, max, gens);
    gens.forEach(function (p) { p._et = etiquette(p, M); p._monte = false; });
    var fs = donnees.freresSoeurs || [], tous = [moi];
    fs.forEach(function (f, i) { f._x = W / 2 + (i % 2 ? -1 : 1) * 340 * (Math.floor(i / 2) + 1); f._y = M.lignes[0]; f._g = 0; f._et = etiquette(f, M); tous.push(f); });
    for (var gg = 0; gg < max; gg++) {
      var rang = gens.filter(function (q) { return q._g === gg; }).concat(gg === 0 ? fs : []);
      if (rang.length > 1) ecarter(rang, 70, W - 70);
    }
    var tronc = { x: W / 2, y: 2950 }, haut = { x: W / 2, y: M.lignes[0] + 70 };
    if (moi._x !== W / 2) haut.x = moi._x;

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
    var epaisseur = [64, 40, 24, 14, 9];
    gens.forEach(function (p) {
      [p.pere, p.mere].forEach(function (q, j) {
        if (!q || q._x == null) return;
        var x1 = p._x + (p._g === 0 ? (j ? 30 : -30) : 0), y1 = p._g === 0 ? haut.y + 30 : p._y - M.rayon[p._g] + 4;
        var b = ruban(x1, y1, q._x, q._y + M.rayon[q._g] - 2, epaisseur[p._g], epaisseur[p._g] * .55, (j ? 1 : -1) * (60 + r() * 50), r);
        h += '<path d="' + b.d + '" fill="url(#ae-or)"/>' + feuillage(b.points, r, .7, 50 - p._g * 5);
        /* rameaux secondaires vers l'extérieur, pour remplir la couronne */
        for (var k = 5; k < 21; k += 2 + Math.floor(r() * 3) + (max > 4 && p._g >= 2 ? 2 : 0)) {
          if (r() > .75) continue;
          var a0 = b.points[k], a1 = b.points[k + 1], dir = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]) * 180 / Math.PI;
          var cote = q._x < W / 2 ? -1 : 1, ang = dir + cote * (35 + r() * 45) * (r() < .25 ? -1 : 1), L = 110 + r() * 170 - p._g * 15;
          var x3 = a0[0] + Math.cos(ang * Math.PI / 180) * L, y3 = a0[1] + Math.sin(ang * Math.PI / 180) * L;
          if (r() < .65) { h += retombant(a0[0], a0[1], cote, L * 1.15, Math.max(5, epaisseur[p._g] * .3), r); continue; }
          var tw = ruban(a0[0], a0[1], x3, y3, Math.max(5, epaisseur[p._g] * .3), 1.2, (r() - .5) * 50, r);
          h += '<path d="' + tw.d + '" fill="url(#ae-or)"/>' + feuillage(tw.points, r, .75, 40) + feuille(x3, y3, ang, 44, [OR_CLAIR, OR][Math.floor(r() * 2)], .9);
        }
      });
      /* Bout de la lignée : la couronne continue en pousses et feuilles */
      /* les pousses ne doivent pas monter jusqu'au sous-titre (personnes remontées en quinconce : pousses courtes) */
      if (p._g === max - 1 || (!p.pere && !p.mere && p._g > 0)) h += pousses(p._x, p._y - M.rayon[p._g] - 2, -90, r, p._monte ? 3 : max > 4 ? 4 : 6, Math.min(max > 4 ? 130 : 190, (p._y - M.rayon[p._g] - 690) * .8));
    });
    /* Pousses de remplissage sur les côtés de la couronne */

    /* Frères et sœurs : sur la même ligne que la personne, reliés par un trait doré */
    var liens = '';
    if (fs.length) {
      var xs = tous.map(function (q) { return q._x; }), y0 = M.lignes[0] - 90;
      liens += '<path d="M' + Math.min.apply(null, xs) + ' ' + y0 + 'H' + Math.max.apply(null, xs) + '" stroke="' + OR_FONCE + '" stroke-width="4" fill="none"/>';
      tous.forEach(function (q) { liens += '<path d="M' + q._x + ' ' + y0 + 'V' + (q._y - M.rayon[0]) + '" stroke="' + OR_FONCE + '" stroke-width="4"/>'; });
    }
    /* Couples : trait fin entre les deux parents de chaque personne (s'ils sont sur la même ligne et que leurs étiquettes ne se touchent pas) */
    gens.forEach(function (p) {
      var a = p.pere, b = p.mere; if (!a || !b || a._x == null || b._x == null || a._y !== b._y) return;
      var x1 = a._x + M.rayon[a._g] + 4, x2 = b._x - M.rayon[b._g] - 4; if (x2 - x1 < 20) return;
      liens += '<path d="M' + x1 + ' ' + a._y + 'H' + x2 + '" stroke="' + OR_FONCE + '" stroke-width="3.5" stroke-dasharray="' + (p._g >= 2 ? '10 8' : 'none') + '" opacity=".8"/>';
    });

    /* Personnes */
    var pers = '';
    gens.concat(fs).forEach(function (p) {
      var x = p._x, y = p._y, moiMeme = p === moi, rr = M.rayon[p._g], f = p.sexe === 'f', e = p._et;
      var fond = moiMeme ? '#8E2F5E' : f ? '#D98AA1' : '#EFC3B4';
      pers += '<g filter="url(#ae-ombre)">' + (f ? '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="' + fond + '" stroke="' + OR + '" stroke-width="5"/>' : '<rect x="' + (x - rr) + '" y="' + (y - rr) + '" width="' + rr * 2 + '" height="' + rr * 2 + '" rx="6" fill="' + fond + '" stroke="' + OR + '" stroke-width="5"/>') + '</g>';
      if (moiMeme) pers += '<circle cx="' + x + '" cy="' + y + '" r="' + (rr + 14) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3"/>';
      /* Étiquette : prénom(s), NOM, dates — toujours les trois, pour toutes les générations */
      var haut0 = y + rr + 14, ty = haut0 + 10 + e.fz * .85;
      pers += '<rect x="' + (x - e.w / 2).toFixed(0) + '" y="' + haut0.toFixed(0) + '" width="' + e.w.toFixed(0) + '" height="' + e.h.toFixed(0) + '" rx="' + Math.min(e.h / 2.4, 40).toFixed(0) + '" fill="#FFFBF3" fill-opacity=".93" stroke="' + OR_CLAIR + '" stroke-width="2.5"/>';
      e.pre.forEach(function (l) { pers += '<text x="' + x.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="middle" class="ae-nom" font-size="' + e.fz + '">' + esc(l) + '</text>'; ty += e.fz * 1.08; });
      if (e.nom) { ty += e.fn * .1; pers += '<text x="' + x.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="middle" class="ae-nf" font-size="' + e.fn + '">' + esc(e.nom) + '</text>'; ty += e.fn * 1.15; }
      if (e.dates) pers += '<text x="' + x.toFixed(1) + '" y="' + (ty + e.fd * .2).toFixed(1) + '" text-anchor="middle" class="ae-date" font-size="' + e.fd + '">' + esc(e.dates) + '</text>';
    });

    var titre = '<text x="' + W / 2 + '" y="430" text-anchor="middle" class="ae-titre">' + esc(donnees.titre || 'Mon arbre') + '</text>' +
      '<path d="M' + (W / 2 - 340) + ' 505C' + (W / 2 - 150) + ' 480 ' + (W / 2 + 150) + ' 530 ' + (W / 2 + 340) + ' 500" stroke="' + OR + '" stroke-width="3" fill="none"/>' + feuille(W / 2 - 14, 498, -20, 44, '#8E2F5E', .9) + feuille(W / 2 + 14, 500, 160, 38, '#C9677F', .85) +
      (donnees.sousTitre ? '<text x="' + W / 2 + '" y="590" text-anchor="middle" class="ae-sous">' + esc(donnees.sousTitre) + '</text>' : '');
    var pied = '<text x="' + W / 2 + '" y="3275" text-anchor="middle" class="ae-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".16" transform="rotate(-30 1240 1754)"><text x="1240" y="1650" text-anchor="middle" class="ae-filigrane">APERÇU</text><text x="1240" y="2050" text-anchor="middle" class="ae-filigrane">GENESOLIA</text></g>' : '';

    var B = o.fondPerdu ? Math.round(4 * W / 210) : 0;   /* 4 mm de fond perdu */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '">' +
      '<defs><linearGradient id="ae-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2C48E"/><stop offset=".45" stop-color="' + OR + '"/><stop offset="1" stop-color="' + OR_FONCE + '"/></linearGradient>' +
      '<filter id="ae-ombre" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#7A5226" flood-opacity=".28"/></filter>' +
      '<style>.ae-titre{font-family:"Gilda Display",Georgia,serif;font-size:132px;fill:' + PRUNE + '}.ae-sous{font-family:"Nunito Sans",sans-serif;font-size:40px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.ae-nom{font-family:"Gilda Display",Georgia,serif;fill:#4A0F36}.ae-nf{font-family:"Nunito Sans",sans-serif;font-weight:700;letter-spacing:2px;fill:#4A0F36}.ae-date{font-family:"Nunito Sans",sans-serif;font-weight:700;fill:#9A3A68;letter-spacing:1px}' +
      '.ae-pied{font-family:"Nunito Sans",sans-serif;font-size:34px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.9}.ae-filigrane{font-family:"Gilda Display",serif;font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      (o.decor !== false ? '<image href="' + esc(o.decor || 'assets/arbre/decor-a4.jpg') + '" x="' + (-B) + '" y="' + (-B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" preserveAspectRatio="xMidYMid slice"/>' : '') +
      titre + '<g>' + h + '</g>' + liens + pers + pied + filigrane + '</svg>';
  }
  window.ArbreEncadrer = { svg: svg };
})();
