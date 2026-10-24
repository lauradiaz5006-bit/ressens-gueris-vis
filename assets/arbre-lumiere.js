/* Genesolia · « Ma lignée en lumière » : la lignée dans des sphères de lumière, portée par un grand tore entre terre et ciel.
   Toi au cœur du tore, posé·e sur la terre ; chaque génération d'ancêtres sur un anneau de lumière, de plus en plus haut vers le ciel ;
   tes enfants, s'il y en a, dans la lumière de la terre, sous toi. Affiche en portrait (2480 x 3508, A4 ; l'A3 est le même dessin agrandi).
   ArbreLumiere.svg(donnees, o) -> chaîne SVG ; donnees.moi = { prenom, nom, naissance, deces, pere, mere }, donnees.enfants (facultatif). */
(function () {
  'use strict';
  var W = 2480, H = 3508, CX = W / 2, CY = 1900;
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }
  function alea(g) { var s = g || 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  var ctx = null;
  function larg(t, taille, police, gras) {
    try { if (!ctx) ctx = document.createElement('canvas').getContext('2d'); ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } catch (e) { return String(t).length * taille * .5; }
  }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }

  /* les ancêtres génération par génération (le père en 2k, la mère en 2k + 1) */
  function rangs(moi, max) {
    var R = [[moi]];
    for (var g = 1; g < max; g++) { var l = [], un = false; R[g - 1].forEach(function (p) { l.push(p ? p.pere || null : null, p ? p.mere || null : null); if (p && (p.pere || p.mere)) un = true; }); if (!un) break; R.push(l); }
    return R;
  }

  /* le tore : des lignes de champ (méridiens d'un tore « en corne »), vues un peu d'en dessus ; les lignes de devant plus lumineuses */
  function tore(r) {
    var R0 = 560, r0 = 560, tilt = .32, h = '', N = 40;
    for (var k = 0; k < N; k++) {
      var u = k / N * Math.PI * 2, pts = [], prof = 0;
      for (var i = 0; i <= 72; i++) {
        var v = i / 72 * Math.PI * 2, rr = R0 + r0 * Math.cos(v), X = rr * Math.cos(u), D = rr * Math.sin(u), Z = r0 * Math.sin(v);
        pts.push(f1(CX + X * 1.02) + ' ' + f1(CY - Z * Math.cos(tilt) * 1.15 + D * Math.sin(tilt) * .55)); prof += D;
      }
      var devant = Math.sin(u) > 0, op = devant ? .38 + .25 * Math.sin(u) : .14;
      h += '<path d="M' + pts.join('L') + '" fill="none" stroke="url(#lu-champ)" stroke-width="' + (devant ? 3.2 : 2) + '" opacity="' + op.toFixed(2) + '"/>';
    }
    /* l'anneau équatorial du tore, la ligne la plus claire */
    h += '<ellipse cx="' + CX + '" cy="' + CY + '" rx="' + f1((R0 + r0) * 1.02) + '" ry="' + f1((R0 + r0) * Math.sin(tilt) * .55) + '" fill="none" stroke="#FFE7B8" stroke-width="5" opacity=".55" filter="url(#lu-flou)"/>';
    return h;
  }

  /* une sphère de lumière, le nom dessous */
  function sphere(x, y, rs, p, fz, moi) {
    var h = '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs * 2.4) + '" fill="url(#lu-halo)" opacity="' + (moi ? .95 : .75) + '"/>' +
      '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs) + '" fill="url(' + (moi ? '#lu-coeur' : '#lu-sphere') + ')"/>' +
      '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(rs * .98) + '" fill="none" stroke="#FFF3D6" stroke-width="' + f1(Math.max(1.5, rs * .05)) + '" opacity=".8"/>' +
      '<ellipse cx="' + f1(x - rs * .32) + '" cy="' + f1(y - rs * .38) + '" rx="' + f1(rs * .28) + '" ry="' + f1(rs * .16) + '" fill="#fff" opacity=".55" transform="rotate(-30 ' + f1(x - rs * .32) + ' ' + f1(y - rs * .38) + ')"/>';
    var pr = String(p.prenom || '').trim(), nom = String(p.nom || '').toUpperCase(), dt = datesDe(p), ty = y + rs + fz * 1.05;
    var l = [[pr, fz, GN, 'lu-nom'], [nom, Math.round(fz * .74), NS, 'lu-nf'], [dt, Math.round(fz * .7), NS, 'lu-date']].filter(function (z) { return z[0]; });
    l.forEach(function (z) { h += '<text x="' + f1(x) + '" y="' + f1(ty) + '" text-anchor="middle" class="' + z[3] + '" font-size="' + z[1] + '"' + (moi ? ' style="stroke:#2A1035;stroke-width:' + Math.round(z[1] * .22) + 'px;stroke-opacity:.85"' : '') + '>' + esc(z[0]) + '</text>'; ty += z[1] * 1.12; });
    return h;
  }
  function hauteurNom(p, fz) { return fz * 1.05 + (p.nom ? fz * .74 * 1.12 : 0) + (datesDe(p) ? fz * .7 * 1.12 : 0) + fz * .3; }

  function svg(d, o) {
    o = o || {};
    var a3 = d.a3 || false, ech = typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1, min = Math.max(18, Math.round(34 / ech));
    var max = Math.max(2, Math.min(d.nbGen || 4, 5)), R = rangs(d.moi, max), r = alea(29), h = '';
    /* les étoiles du ciel, quelques poussières d'or près de la terre */
    var ciel = '';
    for (var i = 0; i < 260; i++) { var sx = r() * W, sy = r() * 1500, sr = r() < .08 ? 3.4 : 1 + r() * 1.6; ciel += '<circle cx="' + f1(sx) + '" cy="' + f1(sy) + '" r="' + f1(sr) + '" fill="#FFF8EC" opacity="' + (.35 + r() * .55).toFixed(2) + '"/>'; }
    for (i = 0; i < 90; i++) { var gx = 300 + r() * (W - 600), gy = 2700 + r() * 500; ciel += '<circle cx="' + f1(gx) + '" cy="' + f1(gy) + '" r="' + f1(1 + r() * 2.4) + '" fill="#FFD98F" opacity="' + (.25 + r() * .5).toFixed(2) + '"/>'; }
    /* l'axe de lumière, de la terre au ciel, qui traverse le cœur du tore */
    var axe = '<rect x="' + (CX - 70) + '" y="120" width="140" height="' + (H - 240) + '" fill="url(#lu-axe)" filter="url(#lu-flou)" opacity=".8"/>' +
      '<rect x="' + (CX - 4) + '" y="160" width="8" height="' + (H - 320) + '" fill="url(#lu-axe)"/>';
    /* la terre : une courbe douce et ses racines de lumière */
    var terre = '<path d="M-60 ' + (H - 640) + 'Q' + CX + ' ' + (H - 860) + ' ' + (W + 60) + ' ' + (H - 640) + 'V' + (H + 60) + 'H-60Z" fill="url(#lu-terre)"/>' +
      '<path d="M-60 ' + (H - 640) + 'Q' + CX + ' ' + (H - 860) + ' ' + (W + 60) + ' ' + (H - 640) + '" fill="none" stroke="#F3D39A" stroke-width="4" opacity=".7" filter="url(#lu-flou)"/>';
    var racines = '';
    for (i = 0; i < 9; i++) {
      var a = Math.PI * (.12 + .76 * i / 8), L = 380 + r() * 160, x2 = CX + Math.cos(a) * L * 1.6, y2 = H - 700 + Math.sin(a) * L * .55;
      racines += '<path d="M' + CX + ' ' + (H - 760) + 'Q' + f1(CX + Math.cos(a) * L * .5) + ' ' + f1(H - 700 + Math.sin(a) * 40) + ' ' + f1(x2) + ' ' + f1(y2) + '" stroke="#F6D79C" stroke-width="' + f1(5 - Math.abs(i - 4) * .7) + '" fill="none" opacity=".55" stroke-linecap="round"/>';
    }

    /* les anneaux des générations : de plus en plus larges et de plus en plus hauts, vers le ciel */
    var spheres = [], ANN = [[0, 0], [520, 110], [800, 250], [1010, 360], [1120, 430]], YG = [0, 1760, 1520, 1260, 1000];
    for (var g = 1; g < R.length; g++) {
      var n = Math.pow(2, g), rx = ANN[g][0], ry = ANN[g][1], cy = YG[g], fz = Math.max(min, [0, 56, 46, 38, 30][g]), rs = [0, 58, 46, 36, 26][g];
      for (var k = 0; k < n; k++) {
        var q = R[g][k]; if (!q) continue;
        /* en arche : le côté du père à gauche, celui de la mère à droite ; plus la génération est ancienne, plus l'arche monte vers le ciel */
        var t = (k + .5) / n, ang = Math.PI * (.94 - .88 * t), x = CX + rx * Math.cos(ang), y = cy - ry * Math.sin(ang);
        spheres.push({ x: x, y: y, rs: rs, p: q, fz: fz });
      }
    }
    /* toi, au cœur du tore */
    var fz0 = Math.max(min, 64), rs0 = 96, ym = CY + 120;
    var sph = spheres.map(function (s) { return sphere(s.x, s.y, s.rs, s.p, s.fz, false); }).join('');
    sph += sphere(CX, ym, rs0, d.moi, fz0, true);
    /* tes enfants, dans la lumière de la terre */
    var enf = (d.enfants || []).slice(0, 6), ens = '';
    if (enf.length) {
      var pas = Math.min(380, (W - 500) / Math.max(1, enf.length - 1)), x0 = CX - pas * (enf.length - 1) / 2;
      enf.forEach(function (q, j) { ens += sphere(x0 + j * pas, H - 560, 40, q, Math.max(min, 40), false); });
    }
    /* des fils de lumière : de toi vers tes parents, de chacun vers les siens */
    var fils = '';
    function lien(x1, y1, x2, y2) { return '<path d="M' + f1(x1) + ' ' + f1(y1) + 'Q' + f1((x1 + x2) / 2) + ' ' + f1(Math.min(y1, y2) - 60) + ' ' + f1(x2) + ' ' + f1(y2) + '" stroke="#FFE6B5" stroke-width="2.5" fill="none" opacity=".45"/>'; }
    var pos = {}; spheres.forEach(function (s) { pos[s.p.prenom + '|' + s.p.nom + '|' + s.p.naissance] = s; });
    function cle(p) { return p.prenom + '|' + p.nom + '|' + p.naissance; }
    (function relier(p, x, y) { [p.pere, p.mere].forEach(function (q) { if (!q) return; var s = pos[cle(q)]; if (!s) return; fils += lien(x, y, s.x, s.y); relier(q, s.x, s.y); }); })(d.moi, CX, ym);

    var titre = '<text x="' + CX + '" y="300" text-anchor="middle" class="lu-titre">' + esc(d.titreLumiere || d.titre || 'Ma lignée en lumière') + '</text>' +
      (d.sousTitre ? '<text x="' + CX + '" y="390" text-anchor="middle" class="lu-sous">' + esc(d.sousTitre) + '</text>' : '');
    var phrase = '<text x="' + CX + '" y="' + (H - 260) + '" text-anchor="middle" class="lu-phrase">Que la lumière de ma lignée me protège et m’accompagne.</text>';
    var pied = '<text x="' + CX + '" y="' + (H - 150) + '" text-anchor="middle" class="lu-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".12" transform="rotate(-30 ' + CX + ' ' + H / 2 + ')"><text x="' + CX + '" y="' + (H / 2 - 100) + '" text-anchor="middle" class="lu-fil">APERÇU</text><text x="' + CX + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="lu-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * W / 210) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-generations="' + R.length + '">' +
      '<defs>' +
      '<linearGradient id="lu-ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140823"/><stop offset=".35" stop-color="#2E1240"/><stop offset=".62" stop-color="#5A2A5C"/><stop offset=".8" stop-color="#B9786E"/><stop offset="1" stop-color="#E9BE85"/></linearGradient>' +
      '<linearGradient id="lu-terre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4A3A" stop-opacity=".85"/><stop offset=".5" stop-color="#3B2018"/><stop offset="1" stop-color="#1E0F0B"/></linearGradient>' +
      '<linearGradient id="lu-axe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E0" stop-opacity="0"/><stop offset=".25" stop-color="#FFF1D2" stop-opacity=".75"/><stop offset=".6" stop-color="#FFE3B0" stop-opacity=".95"/><stop offset="1" stop-color="#F3C47E" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lu-champ" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE9C2"/><stop offset=".5" stop-color="#F2B8C6"/><stop offset="1" stop-color="#E2C48E"/></linearGradient>' +
      '<radialGradient id="lu-halo"><stop offset="0" stop-color="#FFF4D9" stop-opacity=".9"/><stop offset=".35" stop-color="#FFD9A0" stop-opacity=".35"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lu-sphere" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#FFF0D0"/><stop offset=".75" stop-color="#F2C98C"/><stop offset="1" stop-color="#D99BA8"/></radialGradient>' +
      '<radialGradient id="lu-coeur" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#FFE9C9"/><stop offset=".7" stop-color="#F0B37A"/><stop offset="1" stop-color="#B0507A"/></radialGradient>' +
      '<radialGradient id="lu-coeur-halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF2D2" stop-opacity=".7"/><stop offset="1" stop-color="#FFF2D2" stop-opacity="0"/></radialGradient>' +
      '<filter id="lu-flou" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>' +
      '<style>.lu-titre{font-family:' + GN + ';font-size:132px;fill:#FFF3DE}.lu-sous{font-family:' + NS + ';font-size:36px;letter-spacing:9px;fill:#F2D3A2;text-transform:uppercase}' +
      '.lu-nom{font-family:' + GN + ';fill:#FFF8EE;paint-order:stroke;stroke:#2A1035;stroke-width:6px;stroke-opacity:.55}.lu-nf{font-family:' + NS + ';font-weight:700;letter-spacing:2px;fill:#FBE3C0;paint-order:stroke;stroke:#2A1035;stroke-width:5px;stroke-opacity:.5}.lu-date{font-family:' + NS + ';font-weight:700;fill:#F3C9D2;paint-order:stroke;stroke:#2A1035;stroke-width:5px;stroke-opacity:.5}' +
      '.lu-phrase{font-family:' + GN + ';font-style:italic;font-size:54px;fill:#FFEBC9}.lu-pied{font-family:' + NS + ';font-size:30px;letter-spacing:8px;fill:#F6DDB4;opacity:.85}.lu-fil{font-family:' + GN + ';font-size:300px;fill:#FFFFFF}</style></defs>' +
      '<rect x="-200" y="-200" width="' + (W + 400) + '" height="' + (H + 400) + '" fill="url(#lu-ciel)"/>' + ciel + axe + terre + racines +
      '<ellipse cx="' + CX + '" cy="' + CY + '" rx="1150" ry="900" fill="url(#lu-coeur-halo)" opacity=".55"/>' +
      tore() + fils + sph + ens + titre + phrase + pied + filigrane + '</svg>';
  }
  window.ArbreLumiere = { svg: svg };
})();
