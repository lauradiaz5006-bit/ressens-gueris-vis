/* Genesolia · « Ma lignée en lumière » : une colonne de lumière qui relie la terre au ciel, la personne choisie en son cœur,
   dans une grande sphère blanche ; autour d'elle, chaque personne de sa lignée dans sa propre sphère de lumière, à sa place :
   les vivants dans une sphère blanche lumineuse, les défunts dans une sphère blanche nacrée, entourée d'un halo de protection.
   Les ancêtres s'élèvent génération après génération vers le ciel ; les enfants reposent dans la lumière de la terre.
   Affiche en portrait (2480 x 3508, A4 ; l'A3 est le même dessin agrandi).
   ArbreLumiere.svg(donnees, o) -> chaîne SVG ; donnees.moi = { prenom, nom, naissance, deces, pere, mere }, donnees.enfants (facultatif). */
(function () {
  'use strict';
  var W = 2480, H = 3508, CX = W / 2, CY = 1960;
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }
  function alea(g) { var s = g || 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  var ctx = null;
  function larg(t, taille, police, gras) {
    try { if (!ctx) ctx = document.createElement('canvas').getContext('2d'); ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } catch (e) { return String(t).length * taille * .55; }
  }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }
  /* en vie : pas de date de décès, et née il y a moins de 105 ans (sans date de naissance, on ne suppose rien : sphère nacrée) */
  function vivant(p) { return !p.deces && !p.decede && p.naissance && p.naissance > new Date().getFullYear() - 105; }

  function rangs(moi, max) {
    var R = [[moi]];
    for (var g = 1; g < max; g++) { var l = [], un = false; R[g - 1].forEach(function (p) { l.push(p ? p.pere || null : null, p ? p.mere || null : null); if (p && (p.pere || p.mere)) un = true; }); if (!un) break; R.push(l); }
    return R;
  }

  /* le texte d'une personne (prénom, NOM, dates) et le rayon de la sphère qui le contient */
  function lignes(p, fz) {
    var mots = String(p.prenom || '').trim().split(/\s+/).filter(Boolean), pre = mots.join(' ');
    var l = [];
    if (pre && larg(pre, fz, GN) > fz * 6.5 && mots.length > 1) l.push([mots[0], fz, GN, 'lu-nom'], [mots.slice(1).join(' '), fz, GN, 'lu-nom']); else if (pre) l.push([pre, fz, GN, 'lu-nom']);
    if (p.nom) l.push([String(p.nom).toUpperCase(), Math.round(fz * .74), NS, 'lu-nf']);
    if (datesDe(p)) l.push([datesDe(p), Math.round(fz * .7), NS, 'lu-date']);
    return l;
  }
  function rayon(l) {
    var w = Math.max.apply(null, l.map(function (z) { return larg(z[0], z[1], z[2], z[3] === 'lu-nf' || z[3] === 'lu-date'); }).concat([10]));
    var h = l.reduce(function (s, z) { return s + z[1] * 1.12; }, 0);
    return Math.sqrt(Math.pow(w / 2 + 18, 2) + Math.pow(h / 2 + 10, 2)) * 1.06;
  }

  /* une sphère de lumière, le nom à l'intérieur */
  function sphere(x, y, rs, l, etat) {
    var defunt = etat === 'defunt', coeur = etat === 'coeur';
    var h = '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs * (coeur ? 1.9 : 1.6)) + '" fill="url(#' + (defunt ? 'lu-halo-n' : 'lu-halo') + ')"/>';
    if (defunt) h += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs * 1.16) + '" fill="none" stroke="#EDE6FF" stroke-width="' + f1(Math.max(2, rs * .025)) + '" opacity=".55"/>';
    h += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs) + '" fill="url(#' + (defunt ? 'lu-sphere-n' : 'lu-sphere') + ')"/>' +
      '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs - 2) + '" fill="none" stroke="#FFFFFF" stroke-width="' + f1(Math.max(2, rs * .035)) + '" opacity=".95"/>' +
      '<path d="M' + f1(x - rs * .62) + ' ' + f1(y - rs * .42) + 'A' + f1(rs * .78) + ' ' + f1(rs * .78) + ' 0 0 1 ' + f1(x + rs * .1) + ' ' + f1(y - rs * .76) + '" fill="none" stroke="#FFFFFF" stroke-width="' + f1(rs * .07) + '" stroke-linecap="round" opacity=".8"/>';
    var hh = l.reduce(function (s, z) { return s + z[1] * 1.12; }, 0), ty = y - hh / 2;
    l.forEach(function (z) { ty += z[1] * 1.12; h += '<text x="' + f1(x) + '" y="' + f1(ty - z[1] * .22) + '" text-anchor="middle" class="' + z[3] + '" font-size="' + z[1] + '">' + esc(z[0]) + '</text>'; });
    return h;
  }

  function svg(d, o) {
    o = o || {};
    var a3 = d.a3 || false, ech = typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1, min = Math.max(18, Math.round(34 / ech));
    var max = Math.max(2, Math.min(d.nbGen || 4, 5)), R = rangs(d.moi, max), r = alea(29);
    /* le ciel étoilé, des poussières d'or près de la terre */
    var ciel = '';
    for (var i = 0; i < 280; i++) { var sx = r() * W, sy = r() * 1700, sr = r() < .08 ? 3.4 : 1 + r() * 1.6; ciel += '<circle cx="' + f1(sx) + '" cy="' + f1(sy) + '" r="' + f1(sr) + '" fill="#FFF8EC" opacity="' + (.3 + r() * .55).toFixed(2) + '"/>'; }
    for (i = 0; i < 110; i++) { var gx = 200 + r() * (W - 400), gy = 2800 + r() * 420; ciel += '<circle cx="' + f1(gx) + '" cy="' + f1(gy) + '" r="' + f1(1 + r() * 2.4) + '" fill="#FFE3A8" opacity="' + (.25 + r() * .5).toFixed(2) + '"/>'; }
    /* la colonne de lumière, large et douce, de la terre jusqu'au ciel */
    var col = '<rect x="' + (CX - 420) + '" y="-200" width="840" height="' + (H - 380) + '" fill="url(#lu-col-l)" opacity=".55" filter="url(#lu-flou-l)"/>' +
      '<rect x="' + (CX - 250) + '" y="-200" width="500" height="' + (H - 420) + '" fill="url(#lu-col)" opacity=".9"/>' +
      '<rect x="' + (CX - 90) + '" y="-200" width="180" height="' + (H - 440) + '" fill="url(#lu-col)" opacity=".85" filter="url(#lu-flou)"/>';
    /* des particules de lumière qui montent dans la colonne */
    for (i = 0; i < 120; i++) { var px = CX + (r() - .5) * 460, py = 200 + r() * (H - 900); col += '<circle cx="' + f1(px) + '" cy="' + f1(py) + '" r="' + f1(1.5 + r() * 3) + '" fill="#FFFFFF" opacity="' + (.35 + r() * .5).toFixed(2) + '"/>'; }
    /* la terre et ses racines de lumière, sous la colonne */
    var terre = '<path d="M-200 ' + (H - 640) + 'Q' + CX + ' ' + (H - 860) + ' ' + (W + 200) + ' ' + (H - 640) + 'V' + (H + 200) + 'H-200Z" fill="url(#lu-terre)"/>' +
      '<ellipse cx="' + CX + '" cy="' + (H - 760) + '" rx="620" ry="90" fill="url(#lu-halo)" opacity=".9"/>';
    for (i = 0; i < 11; i++) {
      var a = Math.PI * (.08 + .84 * i / 10), L = 360 + r() * 200, x2 = CX + Math.cos(a) * L * 1.7, y2 = H - 700 + Math.sin(a) * L * .55;
      terre += '<path d="M' + CX + ' ' + (H - 770) + 'Q' + f1(CX + Math.cos(a) * L * .5) + ' ' + f1(H - 710 + Math.sin(a) * 40) + ' ' + f1(x2) + ' ' + f1(y2) + '" stroke="#FFE2A6" stroke-width="' + f1(6 - Math.abs(i - 5) * .8) + '" fill="none" opacity=".5" stroke-linecap="round"/>';
    }
    /* un cercle de protection, discret, autour de la colonne (le tore vu de face) */
    var tore = '';
    for (var k = 0; k < 7; k++) { var rx = 1060 - k * 26, ry = 330 - k * 14; tore += '<ellipse cx="' + CX + '" cy="' + (CY + 60) + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#FFF1DA" stroke-width="' + (k ? 1.6 : 3) + '" opacity="' + (k ? .16 : .32) + '"/>'; }

    /* les générations : de plus en plus haut vers le ciel, en arches autour de la colonne */
    var ARC = [null, { rx: 640, ry: 30, cy: CY - 60, fz: 54 }, { rx: 860, ry: 260, cy: 1560, fz: 46 }, { rx: 1030, ry: 380, cy: 1330, fz: 38 }, { rx: 1120, ry: 470, cy: 1130, fz: 30 }];
    var bulles = [];
    for (var g = 1; g < R.length; g++) {
      var A = ARC[g], n = Math.pow(2, g), fz = Math.max(min, A.fz), ls = [], rmax = 0;
      for (var j = 0; j < n; j++) { var q = R[g][j]; if (!q) continue; var l = lignes(q, fz); rmax = Math.max(rmax, rayon(l)); ls.push([j, q, l]); }
      /* toutes les sphères d'une génération ont la même taille ; elles ne se touchent jamais */
      var arc = Math.PI * Math.sqrt((A.rx * A.rx + A.ry * A.ry) / 2) * .88, rG = Math.min(rmax, arc / n / 2 - 14);
      if (rG < rmax) { var kk = rG / rmax; fz = Math.max(min, Math.floor(fz * kk)); ls.forEach(function (x) { x[2] = lignes(x[1], fz); }); rG = Math.max(rG, Math.max.apply(null, ls.map(function (x) { return rayon(x[2]); }))); }
      ls.forEach(function (x) {
        var t = (x[0] + .5) / n, ang = g === 1 ? (x[0] ? .04 : .96) * Math.PI : Math.PI * (.94 - .88 * t);
        bulles.push({ x: CX + A.rx * Math.cos(ang), y: A.cy - A.ry * Math.sin(ang), r: rG, l: x[2], p: x[1] });
      });
    }
    /* la personne, au cœur de la colonne */
    var l0 = lignes(d.moi, Math.max(min, 66)), r0 = Math.max(210, rayon(l0));
    /* les fils de lumière : de chacun vers ses parents */
    var fils = '', pos = [];
    bulles.forEach(function (b) { pos.push(b); });
    function chercher(p) { for (var m = 0; m < pos.length; m++) if (pos[m].p === p) return pos[m]; return null; }
    (function relier(p, x, y) { [p.pere, p.mere].forEach(function (q) { var b = q && chercher(q); if (!b) return; fils += '<path d="M' + f1(x) + ' ' + f1(y) + 'Q' + f1((x + b.x) / 2) + ' ' + f1(Math.min(y, b.y) - 40) + ' ' + f1(b.x) + ' ' + f1(b.y) + '" stroke="#FFF1D6" stroke-width="3" fill="none" opacity=".35"/>'; relier(q, b.x, b.y); }); })(d.moi, CX, CY);
    var sph = bulles.map(function (b) { return sphere(b.x, b.y, b.r, b.l, vivant(b.p) ? 'vivant' : 'defunt'); }).join('');
    sph += sphere(CX, CY, r0, l0, 'coeur');
    /* les enfants, dans la lumière de la terre */
    var enf = (d.enfants || []).slice(0, 6), ens = '';
    if (enf.length) {
      var fe = Math.max(min, 36), le = enf.map(function (q) { return lignes(q, fe); }), re = Math.max.apply(null, le.map(rayon));
      var pas = Math.min(2 * re + 70, (W - 360) / enf.length), x0 = CX - pas * (enf.length - 1) / 2, ye = H - 560;
      enf.forEach(function (q, m) { fils += '<path d="M' + CX + ' ' + f1(CY + r0) + 'Q' + CX + ' ' + f1(ye - 60) + ' ' + f1(x0 + m * pas) + ' ' + f1(ye) + '" stroke="#FFF1D6" stroke-width="3" fill="none" opacity=".35"/>'; ens += sphere(x0 + m * pas, ye, re, le[m], vivant(q) ? 'vivant' : 'defunt'); });
    }

    var titre = '<text x="' + CX + '" y="300" text-anchor="middle" class="lu-titre">' + esc(d.titre || 'Ma lignée en lumière') + '</text>' +
      (d.sousTitre ? '<text x="' + CX + '" y="390" text-anchor="middle" class="lu-sous">' + esc(d.sousTitre) + '</text>' : '');
    var phrase = '<text x="' + CX + '" y="' + (H - 300) + '" text-anchor="middle" class="lu-phrase">Que la lumière de ma lignée me protège et m’accompagne.</text>';
    var leg = '<g class="lu-leg"><circle cx="' + (CX - 470) + '" cy="' + (H - 212) + '" r="16" fill="url(#lu-sphere)" stroke="#fff" stroke-width="2"/><text x="' + (CX - 444) + '" y="' + (H - 201) + '">en vie</text>' +
      '<circle cx="' + (CX + 60) + '" cy="' + (H - 212) + '" r="16" fill="url(#lu-sphere-n)" stroke="#fff" stroke-width="2"/><text x="' + (CX + 86) + '" y="' + (H - 201) + '">dans la lumière</text></g>';
    var pied = '<text x="' + CX + '" y="' + (H - 130) + '" text-anchor="middle" class="lu-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".12" transform="rotate(-30 ' + CX + ' ' + H / 2 + ')"><text x="' + CX + '" y="' + (H / 2 - 100) + '" text-anchor="middle" class="lu-fil">APERÇU</text><text x="' + CX + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="lu-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * W / 210) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-generations="' + R.length + '">' +
      '<defs>' +
      '<linearGradient id="lu-ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120720"/><stop offset=".35" stop-color="#2C123F"/><stop offset=".62" stop-color="#55285A"/><stop offset=".8" stop-color="#B07473"/><stop offset="1" stop-color="#E7BC86"/></linearGradient>' +
      '<linearGradient id="lu-terre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4A3A" stop-opacity=".9"/><stop offset=".5" stop-color="#3B2018"/><stop offset="1" stop-color="#1E0F0B"/></linearGradient>' +
      '<linearGradient id="lu-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6E6" stop-opacity="0"/><stop offset=".3" stop-color="#FFF6E6" stop-opacity=".45"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset=".7" stop-color="#FFF6E6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF6E6" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lu-col-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE8C8" stop-opacity="0"/><stop offset=".5" stop-color="#FFE8C8" stop-opacity=".6"/><stop offset="1" stop-color="#FFE8C8" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="lu-halo"><stop offset=".55" stop-color="#FFF6E2" stop-opacity=".55"/><stop offset=".75" stop-color="#FFE6BC" stop-opacity=".22"/><stop offset="1" stop-color="#FFE6BC" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lu-halo-n"><stop offset=".55" stop-color="#F4F0FF" stop-opacity=".55"/><stop offset=".78" stop-color="#E4DDFF" stop-opacity=".24"/><stop offset="1" stop-color="#E4DDFF" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lu-sphere" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#FFFDF8" stop-opacity=".97"/><stop offset=".9" stop-color="#FFF3DC" stop-opacity=".92"/><stop offset="1" stop-color="#FFE7BD" stop-opacity=".9"/></radialGradient>' +
      '<radialGradient id="lu-sphere-n" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#FBFAFF" stop-opacity=".96"/><stop offset=".9" stop-color="#EEEAFB" stop-opacity=".92"/><stop offset="1" stop-color="#DCD6F2" stop-opacity=".9"/></radialGradient>' +
      '<linearGradient id="lu-fondu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff" stop-opacity="0"/><stop offset=".24" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>' +
      '<mask id="lu-masque" maskUnits="userSpaceOnUse" x="-200" y="-200" width="' + (W + 400) + '" height="' + (H + 400) + '"><rect x="-200" y="0" width="' + (W + 400) + '" height="' + H + '" fill="url(#lu-fondu)"/></mask>' +
      '<filter id="lu-flou" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>' +
      '<filter id="lu-flou-l" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="60"/></filter>' +
      '<style>.lu-titre{font-family:' + GN + ';font-size:132px;fill:#FFF3DE}.lu-sous{font-family:' + NS + ';font-size:36px;letter-spacing:9px;fill:#F2D3A2;text-transform:uppercase}' +
      '.lu-nom{font-family:' + GN + ';fill:#4A0F36}.lu-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1.5px;fill:#5A2147}.lu-date{font-family:' + NS + ';font-weight:700;fill:#9A6E38}' +
      '.lu-phrase{font-family:' + GN + ';font-style:italic;font-size:56px;fill:#FFEBC9}.lu-leg text{font-family:' + NS + ';font-size:32px;letter-spacing:2px;fill:#F6DDB4}.lu-pied{font-family:' + NS + ';font-size:30px;letter-spacing:8px;fill:#F6DDB4;opacity:.85}.lu-fil{font-family:' + GN + ';font-size:300px;fill:#FFFFFF}</style></defs>' +
      '<rect x="-200" y="-200" width="' + (W + 400) + '" height="' + (H + 400) + '" fill="url(#lu-ciel)"/>' + ciel + terre + '<g mask="url(#lu-masque)">' + col + '</g>' + tore + fils + sph + ens + titre + phrase + leg + pied + filigrane + '</svg>';
  }
  window.ArbreLumiere = { svg: svg };
})();
