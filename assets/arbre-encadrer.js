/* Genesolia · « Mon arbre à encadrer » : arbre doré dessiné sur un papier crème (assets/arbre/papier-dore.jpg, sans lin ni fleurs : seule la mise en scène les montre).
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
    var g = p._g, fz = M.nom[g], fd = M.date[g], fn = Math.max(Math.round(fz * .8), M.nom.length === 5 ? 24 : 34);   /* au moins 8 points imprimés */
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
      (o.decor !== false ? '<image href="' + esc(o.decor || 'assets/arbre/papier-dore.jpg') + '" x="' + (-B) + '" y="' + (-B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" preserveAspectRatio="xMidYMid slice"/>' : '') +
      titre + '<g>' + h + '</g>' + liens + pers + pied + filigrane + '</svg>';
  }
  /* ───────── Style « Figuier » : illustration peinte (assets/arbre/figuier.jpg) + médaillons dorés posés par le site ─────────
     Les médaillons sont placés à des endroits fixes du feuillage, étage par étage (1, 2, 4, 8, 16) ;
     un ancêtre inconnu = pas de médaillon (le feuillage reste visible). Pas de frères et sœurs dans ce style.
     options.scene : la même affiche posée sur la photo avec les fleurs (assets/arbre/figuier-scene.jpg), pour l'écran seulement. */
  var FIG = {
    /* par étage : y du centre, demi-largeur et demi-hauteur du médaillon ovale */
    2: [[2600, 210, 180], [1950, 230, 190]],
    3: [[2620, 210, 175], [1900, 220, 180], [1100, 225, 185]],
    4: [[2640, 200, 165], [2050, 205, 165], [1450, 200, 160], [830, 136, 122]],
    5: [[2660, 190, 150], [2130, 190, 150], [1660, 175, 135], [1180, 134, 112], [720, 122, 88]]
  };
  var FIG_X = {
    1: [.5], 2: [.30, .70], 4: [.16, .39, .61, .84],
    8: [.085, .204, .323, .441, .559, .677, .796, .915],
    16: [.06, .119, .177, .236, .295, .353, .412, .471, .529, .588, .647, .705, .764, .823, .881, .94]
  };
  /* L'affiche (2480 x 3508) dans la photo de mise en scène (1055 x 1491) */
  var FIG_SCENE = { w: 1055, h: 1491, x: 55, y: 66, k: 949 / 2480 };

  /* Largeur réelle d'un texte (mesurée avec les polices du site quand c'est possible) */
  var ctxMesure = null;
  function largeurTexte(t, taille, police, gras) {
    try {
      if (!ctxMesure && typeof document !== 'undefined') ctxMesure = document.createElement('canvas').getContext('2d');
      if (ctxMesure) { ctxMesure.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctxMesure.measureText(t).width; }
    } catch (e) {}
    return t.length * taille * (gras ? .62 : .5);
  }
  function medaillon(p, cx, cy, RX, RY, g, max, moiMeme) {
    var M = MISE[Math.max(3, max)], f = p.sexe === 'f', A3 = max === 5;
    var minDate = A3 ? 24 : 34, minNom = A3 ? 24 : 34;   /* 8 points minimum à l'impression, pour les dates comme pour les noms */
    var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
    var fz = Math.min(M.nom[g] + 6, RY * .4), fn = Math.max(Math.round(fz * .78), minNom), fd = Math.max(M.date[g], minDate);
    var nom = String(p.nom || '').toUpperCase(), dates = (p.naissance || '') + (p.deces ? ' – ' + p.deces : '');
    function corde(dy) { var q = 1 - Math.pow(dy / RY, 2); return q > 0 ? 2 * RX * Math.sqrt(q) * .9 : 0; }
    function coupe(taille) {
      var mots = String(p.prenom || '').trim().split(/\s+/), lignes = [mots.join(' ')];
      if (largeurTexte(lignes[0], taille, GN) > RX * 1.55 && mots.length > 1) {
        var best = null;
        for (var k = 1; k < mots.length; k++) { var a = mots.slice(0, k).join(' '), b = mots.slice(k).join(' '), m = Math.max(largeurTexte(a, taille, GN), largeurTexte(b, taille, GN)); if (!best || m < best.m) best = { m: m, l: [a, b] }; }
        lignes = best.l;
        /* trois prénoms ou plus trop longs pour deux lignes : une ligne par groupe de prénoms */
        if (mots.length > 2 && best.m > RX * 1.55) {
          var b3 = null;
          for (var i3 = 1; i3 < mots.length - 1; i3++) for (var j3 = i3 + 1; j3 < mots.length; j3++) {
            var l3 = [mots.slice(0, i3).join(' '), mots.slice(i3, j3).join(' '), mots.slice(j3).join(' ')], m3 = Math.max.apply(null, l3.map(function (x) { return largeurTexte(x, taille, GN); }));
            if (!b3 || m3 < b3.m) b3 = { m: m3, l: l3 };
          }
          lignes = b3.l;
        }
      }
      return lignes;
    }
    var pre, lignes, essai = 0, RY0 = RY;
    for (;;) {
      pre = coupe(fz);
      lignes = pre.map(function (l) { return { t: l, taille: fz, police: GN, cls: 'ae-nom', h: fz * 1.05 }; });
      if (nom) lignes.push({ t: nom, taille: fn, police: NS, gras: true, cls: 'ae-nf', h: fn * 1.2 });
      if (dates) lignes.push({ t: dates, taille: fd, police: NS, gras: true, cls: 'ae-date', h: fd * 1.25 });
      var H = lignes.reduce(function (s2, l) { return s2 + l.h; }, 0), y = -H / 2 + 6, ok = true;
      lignes.forEach(function (l) { l.dy = y + l.h * .78; y += l.h; if (largeurTexte(l.t, l.taille, l.police, l.gras) > corde(l.dy - l.taille * .35)) ok = false; });
      if (ok || essai++ > 80) break;
      /* on réduit d'abord le prénom, puis le nom, puis les dates, sans passer sous les minimums */
      if (fz > Math.max(minDate, fn + 2)) fz -= 2; else if (fn > minNom) fn -= 1; else if (fd > minDate) fd -= 1;
      /* déjà aux tailles minimales : le médaillon s'agrandit un peu (jusqu'à +35 %) plutôt que de couper le texte */
      else if (RY < RY0 * 1.35) { RY += 6; RX += 3; } else break;
    }
    var h = '<g filter="url(#ae-ombre)"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + RX + '" ry="' + RY + '" fill="#FBF6EC"/></g>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (RX - 7) + '" ry="' + (RY - 7) + '" fill="none" stroke="url(#ae-or)" stroke-width="13"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (RX - 20) + '" ry="' + (RY - 20) + '" fill="none" stroke="' + OR + '" stroke-width="2" opacity=".5"/>';
    if (moiMeme) h += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (RX + 14) + '" ry="' + (RY + 14) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3"/>';
    /* le symbole (cercle = femme, carré = homme) est serti en haut du médaillon, comme un bijou */
    var s = Math.max(16, RY * .15), sy = cy - RY + 4, fond = moiMeme ? '#8E2F5E' : f ? '#D98AA1' : '#EFC3B4';
    h += f ? '<circle cx="' + cx + '" cy="' + sy.toFixed(1) + '" r="' + s.toFixed(1) + '" fill="' + fond + '" stroke="' + OR + '" stroke-width="4"/>'
      : '<rect x="' + (cx - s).toFixed(1) + '" y="' + (sy - s).toFixed(1) + '" width="' + (2 * s).toFixed(1) + '" height="' + (2 * s).toFixed(1) + '" rx="4" fill="' + fond + '" stroke="' + OR + '" stroke-width="4"/>';
    lignes.forEach(function (l) { h += '<text x="' + cx + '" y="' + (cy + l.dy).toFixed(1) + '" text-anchor="middle" class="' + l.cls + '" font-size="' + l.taille + '">' + esc(l.t) + '</text>'; });
    return h;
  }
  function svgFiguier(donnees, o) {
    var max = Math.min(5, Math.max(2, donnees.nbGen || 4)), L = FIG[max], moi = donnees.moi, h = '';
    /* Placement : chaque branche reçoit une largeur à la mesure des ancêtres connus (l'arbre reste centré
       quand une branche est vide), puis les médaillons d'une même rangée s'écartent pour ne jamais se toucher,
       avec au moins 5 mm de marge sur les côtés (le cadre en cache une partie). */
    var MARGE = 70, ECART = 20, gens = [];
    poids(moi, 0, max);
    (function placerF(p, g, x0, x1) {
      if (!p || g >= max) return;
      p._fx = (x0 + x1) / 2; p._fg = g; p._fy = L[g][0]; gens.push(p);
      var wp = p.pere && g < max - 1 ? p.pere._poids : 0, wm = p.mere && g < max - 1 ? p.mere._poids : 0, tot = wp + wm;
      if (!tot) return;
      var mil = x0 + (x1 - x0) * wp / tot;
      if (wp) placerF(p.pere, g + 1, x0, mil);
      if (wm) placerF(p.mere, g + 1, mil, x1);
    })(moi, 0, 60, W - 60);
    for (var g = 1; g < max; g++) {
      var rang = gens.filter(function (q) { return q._fg === g; }).sort(function (a, b) { return a._fx - b._fx; }), rx = L[g][1];
      if (!rang.length) continue;
      var serre = rang.some(function (q, i) { return i && q._fx - rang[i - 1]._fx < 2 * rx + ECART; });
      var groupes = serre && g === 4 ? [rang.filter(function (q, i) { return !(i % 2); }), rang.filter(function (q, i) { return i % 2; })] : [rang];
      if (groupes.length > 1) { groupes[0].forEach(function (q) { q._fy -= 100; }); groupes[1].forEach(function (q) { q._fy += 100; }); }
      groupes.forEach(function (liste) {
        var e = 2 * rx + ECART, x0 = MARGE + rx, x1 = W - MARGE - rx;
        for (var i = 1; i < liste.length; i++) if (liste[i]._fx - liste[i - 1]._fx < e) liste[i]._fx = liste[i - 1]._fx + e;
        var depasse = liste[liste.length - 1]._fx - x1; if (depasse > 0) liste.forEach(function (q) { q._fx -= depasse; });
        if (liste[0]._fx < x0) { liste[0]._fx = x0; for (var j = 1; j < liste.length; j++) if (liste[j]._fx - liste[j - 1]._fx < e) liste[j]._fx = liste[j - 1]._fx + e; }
      });
    }
    gens.forEach(function (p) { h += medaillon(p, Math.round(p._fx), p._fy, L[p._fg][1], L[p._fg][2], p._fg, max, p === moi); });
    /* Frères et sœurs : de part et d'autre du tronc, au niveau des petits buissons (si la cliente les inclut) */
    var fs = (donnees.freresSoeurs || []).slice(0, 4), FS_X = [[.29, .71], [.29, .71, .12, .88]][fs.length > 2 ? 1 : 0];
    fs.forEach(function (f, i) { f._fg = 1; h += medaillon(f, Math.round(FS_X[i] * W), 2820, 150, 120, 1, max, false); });
    var titre = '<text x="' + W / 2 + '" y="178" text-anchor="middle" class="ae-titre" font-size="118">' + esc(donnees.titre || 'Mon arbre') + '</text>' +
      (donnees.sousTitre ? '<text x="' + W / 2 + '" y="252" text-anchor="middle" class="ae-sous" font-size="34">' + esc(donnees.sousTitre) + '</text>' : '');
    var pied = '<text x="' + W / 2 + '" y="3430" text-anchor="middle" class="ae-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".16" transform="rotate(-30 1240 1754)"><text x="1240" y="1650" text-anchor="middle" class="ae-filigrane">APERÇU</text><text x="1240" y="2050" text-anchor="middle" class="ae-filigrane">GENESOLIA</text></g>' : '';
    var defs = '<defs><linearGradient id="ae-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9CF98"/><stop offset=".5" stop-color="' + OR + '"/><stop offset="1" stop-color="' + OR_FONCE + '"/></linearGradient>' +
      '<filter id="ae-ombre" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#6B4A20" flood-opacity=".3"/></filter>' +
      '<style>.ae-titre{font-family:"Gilda Display",Georgia,serif;fill:' + PRUNE + '}.ae-sous{font-family:"Nunito Sans",sans-serif;letter-spacing:8px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.ae-nom{font-family:"Gilda Display",Georgia,serif;fill:#4A0F36}.ae-nf{font-family:"Nunito Sans",sans-serif;font-weight:700;letter-spacing:2px;fill:#4A0F36}.ae-date{font-family:"Nunito Sans",sans-serif;font-weight:700;fill:#9A3A68;letter-spacing:1px}' +
      '.ae-pied{font-family:"Nunito Sans",sans-serif;font-size:32px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.85}.ae-filigrane{font-family:"Gilda Display",serif;font-size:300px;fill:' + PRUNE + '}</style></defs>';
    var contenu = titre + h + pied + filigrane;
    if (o.scene) {   /* mise en scène : l'affiche posée sur le lin avec les fleurs (écran seulement) */
      var S = FIG_SCENE;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + S.w + ' ' + S.h + '" width="' + S.w + '" height="' + S.h + '">' + defs +
        '<image href="' + esc(o.scene === true ? 'assets/arbre/figuier-scene.jpg' : o.scene) + '" width="' + S.w + '" height="' + S.h + '"/>' +
        '<g transform="translate(' + S.x + ' ' + S.y + ') scale(' + S.k + ')">' + contenu + '</g></svg>';
    }
    var B = o.fondPerdu ? Math.round(4 * W / 210) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '">' + defs +
      '<image href="' + esc(o.decor || 'assets/arbre/figuier-ecran.jpg') + '" x="' + (-B) + '" y="' + (-B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" preserveAspectRatio="xMidYMid slice"/>' +
      contenu + '</svg>';
  }

  /* ───────── « Dans son cadre » : l'affiche dans le cadre Gelato, à l'échelle, accrochée au mur (écran seulement) ─────────
     Cadre « prêt à accrocher » Gelato : baguette de 12 mm vue de face, 22 mm d'épaisseur, plexiglas, bois naturel ou blanc.
     Le rebord du cadre recouvre environ 3 mm de l'affiche sur chaque bord. o.format : 'a4' | 'a3' ; o.cadre : 'bois' | 'blanc' | '' (poster seul). */
  var CADRE = { baguette: 12, rebord: 3, largeurMm: { a4: 210, a3: 297 } };
  function enCadre(affiche, o) {
    /* l'affiche peut être en portrait (2480 x 3508) ou à l'horizontale (3508 x 2480) */
    var tl = affiche.match(/width="(\d+)" height="(\d+)"/), AW = tl ? +tl[1] : W, AH = tl ? +tl[2] : H, paysage = AW > AH;
    var mm = AW / ((CADRE.largeurMm[o.format] || 210) * (paysage ? Math.SQRT2 : 1)), fw = o.cadre ? Math.round(CADRE.baguette * mm) : 0, lip = o.cadre ? Math.round(CADRE.rebord * mm) : 0;
    var iw = AW - 2 * lip, ih = AH - 2 * lip, ow = iw + 2 * fw, oh = ih + 2 * fw, marge = Math.round(ow * .16), VW = ow + 2 * marge, VH = oh + 2 * marge + Math.round(marge * .4);
    var bois = o.cadre === 'blanc' ? ['#FBF9F5', '#EEE9E1', '#E3DCD1'] : ['#E2C69D', '#CDA674', '#B8895A'];
    var interne = affiche.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''), vb = (affiche.match(/viewBox="([^"]+)"/) || [])[1] || ('0 0 ' + AW + ' ' + AH);
    var x0 = marge, y0 = marge, h = '';
    h += '<defs><linearGradient id="ec-mur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EDE5"/><stop offset="1" stop-color="#E6DDD2"/></linearGradient>' +
      '<linearGradient id="ec-bois" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bois[0] + '"/><stop offset=".5" stop-color="' + bois[1] + '"/><stop offset="1" stop-color="' + bois[2] + '"/></linearGradient>' +
      '<pattern id="ec-veine" width="220" height="14" patternUnits="userSpaceOnUse"><path d="M0 4C60 2 120 7 220 4M0 10C80 12 150 8 220 11" stroke="' + (o.cadre === 'blanc' ? '#D9D1C4' : '#9C7044') + '" stroke-width="1.6" fill="none" opacity="' + (o.cadre === 'blanc' ? '.25' : '.35') + '"/></pattern>' +
      '<linearGradient id="ec-reflet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".05"/><stop offset=".36" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>' +
      '<filter id="ec-ombre" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx="0" dy="' + Math.round(ow * .012) + '" stdDeviation="' + Math.round(ow * .014) + '" flood-color="#3D2A1A" flood-opacity=".35"/></filter></defs>';
    h += '<rect width="' + VW + '" height="' + VH + '" fill="url(#ec-mur)"/>';
    if (o.cadre) {
      h += '<g filter="url(#ec-ombre)"><rect x="' + x0 + '" y="' + y0 + '" width="' + ow + '" height="' + oh + '" fill="url(#ec-bois)"/></g>' +
        '<rect x="' + x0 + '" y="' + y0 + '" width="' + ow + '" height="' + oh + '" fill="url(#ec-veine)"/>' +
        /* biseau : lumière en haut à gauche, ombre en bas à droite */
        '<path d="M' + x0 + ' ' + y0 + 'h' + ow + 'l-' + fw + ' ' + fw + 'h-' + (ow - 2 * fw) + 'v' + (oh - 2 * fw) + 'l-' + fw + ' ' + fw + 'z" fill="#fff" opacity=".18"/>' +
        '<path d="M' + (x0 + ow) + ' ' + (y0 + oh) + 'h-' + ow + 'l' + fw + '-' + fw + 'h' + (ow - 2 * fw) + 'v-' + (oh - 2 * fw) + 'l' + fw + '-' + fw + 'z" fill="#000" opacity=".12"/>';
    }
    var ax = x0 + fw, ay = y0 + fw;
    /* poster seul : l'ombre est portée par un simple rectangle derrière (une ombre sur l'affiche entière serait trop lente à dessiner) */
    if (!o.cadre) h += '<g filter="url(#ec-ombre)"><rect x="' + ax + '" y="' + ay + '" width="' + iw + '" height="' + ih + '" fill="#FFFBF3"/></g>';
    h += '<svg x="' + ax + '" y="' + ay + '" width="' + iw + '" height="' + ih + '" viewBox="' + lip + ' ' + lip + ' ' + iw + ' ' + ih + '" preserveAspectRatio="none">' + interne + '</svg>';
    if (o.cadre) h += '<rect x="' + ax + '" y="' + ay + '" width="' + iw + '" height="' + ih + '" fill="none" stroke="#3D2A1A" stroke-opacity=".25" stroke-width="' + Math.max(4, Math.round(fw * .06)) + '"/>' +
      '<rect x="' + ax + '" y="' + ay + '" width="' + iw + '" height="' + ih + '" fill="url(#ec-reflet)"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + VW + ' ' + VH + '" width="' + VW + '" height="' + VH + '">' + h + '</svg>';
  }

  /* Styles à l'horizontale (assets/arbre-lignee.js) : « Lignée » (cartes) et « Médaillons » (médaillons peints) */
  var PAYSAGE = { lignee: '', medaillons: 'medaillons', famille: '' };   /* « Notre famille » : la Lignée, avec le couple et les deux lignées */
  function svgStyle(donnees, o) {
    o = o || {};
    if (o.cadre !== undefined && o.format) { var a = svgStyle(donnees, Object.assign({}, o, { cadre: undefined, format: undefined, scene: false, fondPerdu: false })); return enCadre(a, o); }
    return dedicace(svgStyle0(donnees, o), donnees.dedicace);
  }
  /* Option cadeau : le petit mot remplace la signature en bas de l'affiche, en italique */
  function dedicace(svg, mot) {
    mot = String(mot || '').trim(); if (!mot) return svg;
    var t = esc('« ' + mot.slice(0, 80) + ' »'), st = ' style="font-family:\'Gilda Display\',Georgia,serif;font-style:italic;font-size:46px;letter-spacing:1px;opacity:1"';
    /* Grand arbre : la signature est dans le coin, au milieu des racines ; le mot va au centre, en bas, sur un voile de papier */
    var g = /<svg[^>]*viewBox="0 0 (\d+) (\d+)"/.exec(svg);
    if (/class="gr-pied"/.test(svg) && g) {
      var W = +g[1], H = +g[2], lw = Math.min(W - 400, mot.length * 22 + 120);
      return svg.replace(/<text[^>]*class="gr-pied"[^>]*>[^<]*<\/text>/, '<rect x="' + Math.round(W / 2 - lw / 2) + '" y="' + (H - 132) + '" width="' + Math.round(lw) + '" height="70" rx="35" fill="#FBF3E6" opacity=".88"/>' +
        '<text x="' + W / 2 + '" y="' + (H - 82) + '" text-anchor="middle" class="gr-pied"' + st.replace('opacity:1', 'opacity:1;fill:#5A2A4E') + '>' + t + '</text>');
    }
    return svg.replace(/(<text[^>]*class="(?:ae|li)-pied")([^>]*)>[^<]*<\/text>/, function (m, deb, fin) { return deb + fin + st + '>' + t + '</text>'; });
  }
  function svgStyle0(donnees, o) {
    var st = o.style || donnees.style;
    if (st === 'grand' && window.ArbreGrand) return window.ArbreGrand.svg(donnees, { fond: o.decor || undefined, medaillon: (o.sprites && o.sprites.medaillon) || 'assets/arbre/medaillon-or.png', apercu: o.apercu, fondPerdu: o.fondPerdu });
    if (st === 'descendants' && window.ArbreDescendants) return window.ArbreDescendants.svg(donnees, { a3: !!donnees.a3, apercu: o.apercu, fondPerdu: o.fondPerdu, pied: o.pied });
    if (st in PAYSAGE && window.ArbreLignee) return window.ArbreLignee.svg(donnees, { paysage: true, a3: !!donnees.a3, motif: PAYSAGE[st], sprites: o.sprites, apercu: o.apercu, fondPerdu: o.fondPerdu, pied: o.pied });
    return st === 'figuier' ? svgFiguier(donnees, o) : svg(donnees, o);
  }
  window.ArbreEncadrer = { svg: svgStyle, paysage: function (st) { return st in PAYSAGE || st === 'grand' || st === 'descendants'; }, styles: [['famille', 'Notre famille'], ['grand', 'Grand arbre'], ['figuier', 'Figuier'], ['medaillons', 'Médaillons'], ['lignee', 'Lignée'], ['dore', 'Arbre doré'], ['descendants', 'Descendants']] };
})();
