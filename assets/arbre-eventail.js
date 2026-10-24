/* Genesolia · style « Éventail » : l'arbre en demi-cercle.
   Toi au centre, en bas ; tes parents dans le premier anneau, puis chaque génération dans un anneau plus large.
   À gauche la lignée de ton père, à droite celle de ta mère.
   ArbreEventail.svg(donnees, o) -> chaîne SVG à l'horizontale (3508 x 2480) ;
     o.a3 : taille du papier par rapport à l'A4 (false = A4, true = A3, ou un nombre : 50 × 70 cm ≈ 2,4 ; 70 × 100 cm ≈ 3,3).
   ArbreEventail.capacite(donnees, a3) -> nombre maximal de générations lisibles (texte d'au moins 8 points imprimés). */
(function () {
  'use strict';
  var W = 3508, H = 2480, CX = W / 2, CY = H - 300, RMAX = Math.min(W / 2 - 200, CY - 600);
  var OR = '#B98A55', OR_FONCE = '#9A6E38', OR_CLAIR = '#D9B77E', PRUNE = '#5A2147';
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  /* teintes des anneaux : côté paternel (doré), côté maternel (rosé), un anneau sur deux un peu plus soutenu */
  var TEINTES = { p: ['#F7EDDF', '#F0E1C9'], m: ['#F8E9EC', '#F1DAE0'] }, VIDE = '#FBF6EE';

  function ech(a3) { return typeof a3 === 'number' ? a3 : a3 ? 1.414 : 1; }
  function minFz(a3) { return Math.max(8, Math.round(34 / ech(a3))); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ctx = null;
  var MEMO = {};   /* les mêmes noms sont mesurés des centaines de fois pendant la mise en page : on garde chaque mesure */
  function larg(t, taille, police, gras) {
    var cle = t + '|' + taille + '|' + police + '|' + (gras ? 1 : 0); if (MEMO[cle] != null) return MEMO[cle];
    var l = larg0(t, taille, police, gras); try { if (document.fonts && document.fonts.status === 'loaded') MEMO[cle] = l; } catch (e) {} return l;
  }
  function larg0(t, taille, police, gras) {
    try { if (!ctx && typeof document !== 'undefined') ctx = document.createElement('canvas').getContext('2d'); if (ctx) { ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } } catch (e) {}
    return String(t).length * taille * (gras ? .62 : .5);
  }
  function f1(n) { return Math.round(n * 10) / 10; }
  function NOM(p) { return String(p.nom || '').toUpperCase(); }
  function datesDe(p) { return (p.naissance == null ? '' : String(p.naissance)) + (p.deces ? ' – ' + p.deces : ''); }

  /* les ancêtres, génération par génération : rangs[g][k] (k de 0 à 2^g - 1 ; le père en 2k, la mère en 2k + 1) */
  function rangs(moi, max) {
    var R = [[moi]];
    for (var g = 1; g < max; g++) {
      var l = [], un = false;
      R[g - 1].forEach(function (p) { l.push(p ? p.pere || null : null, p ? p.mere || null : null); if (p && (p.pere || p.mere)) un = true; });
      if (!un) break;
      R.push(l);
    }
    return R;
  }

  /* les lignes d'une personne : 3 = prénom / NOM / dates ; 2 = prénom NOM / dates ; 1 = prénom NOM */
  function lignes(q, mode, fz, min, complet) {
    var mots = String(q.prenom || '').trim().split(/\s+/).filter(Boolean), pre = complet ? mots.join(' ') : (mots[0] || ''), nom = NOM(q), dt = datesDe(q);
    var fn = Math.max(Math.round(fz * .8), min), fd = Math.max(Math.round(fz * .8), min);
    var l = mode === 3 ? [[pre, fz, GN, false, 'ev-nom'], [nom, fn, NS, true, 'ev-nf'], [dt, fd, NS, true, 'ev-date']]
      : mode === 2 ? [[(pre + ' ' + nom).trim(), fz, GN, false, 'ev-nom'], [dt, fd, NS, true, 'ev-date']]
      : [[(pre + ' ' + nom).trim(), fz, GN, false, 'ev-nom']];
    return l.filter(function (x) { return x[0]; });
  }
  function hauteur(l) { return l.reduce(function (s, x) { return s + x[1] * 1.18; }, 0); }
  function largeur(l) { return l.reduce(function (m, x) { return Math.max(m, larg(x[0], x[1], x[2], x[3])); }, 0); }
  /* un nom trop long est raccourci (…) pour ne pas élargir tout l'anneau */
  function raccourcir(x, max) {
    if (larg(x[0], x[1], x[2], x[3]) <= max) return x;
    var t = x[0]; while (t.length > 3 && larg(t + '…', x[1], x[2], x[3]) > max) t = t.slice(0, -1);
    return [t.replace(/[\s\-]+$/, '') + '…', x[1], x[2], x[3], x[4]];
  }

  /* Mise en page pour n générations et une taille de texte de base fzB : rayons de chaque anneau, sens du texte, taille */
  function plan(R, n, a3, fzB) {
    var min = minFz(a3), r0 = Math.max(300, Math.round(fzB * 6.5)), r = r0, anneaux = [];
    for (var g = 1; g < n && g < R.length; g++) {
      var ps = R[g].filter(Boolean), th = Math.PI / Math.pow(2, g), corde = 2 * r * Math.sin(th / 2);
      if (!ps.length) return null;
      /* texte à plat (dans le sens de l'anneau) tant qu'il tient : les premiers anneaux, larges */
      /* un bloc droit, posé à plat au bord intérieur de la part, tient si sa demi-largeur ≤ rayon × tan(angle / 2) */
      if (g <= 3) {
        var plat = null;
        for (var fzt = fzB; fzt >= Math.max(min, fzB * .7) && !plat; fzt -= 2) {
          var ltt = ps.map(function (q) { return lignes(q, 3, fzt, min, true); }), padt = fzt * .7;
          if (Math.max.apply(null, ltt.map(largeur)) / 2 + padt <= (r + padt) * Math.tan(th / 2) * .92) plat = { fz: fzt, h: Math.max.apply(null, ltt.map(hauteur)) + 2 * padt };
        }
        if (plat) { anneaux.push({ g: g, r0: r, r1: r + plat.h, fz: plat.fz, mode: 3, radial: false, complet: true }); r += plat.h; continue; }
      }
      /* sinon le texte suit le rayon : la place disponible est la largeur de la part, au bord intérieur.
         Anneaux très nombreux (grands formats, 9 générations et plus) : si la part est trop étroite pour une ligne,
         l'anneau précédent s'élargit et celui-ci commence plus loin du centre, là où la part est assez large. */
      var rBesoin = (min * 1.18 / .86) / (2 * Math.sin(th / 2));
      if (r < rBesoin && anneaux.length) { anneaux[anneaux.length - 1].r1 = rBesoin; r = rBesoin; corde = 2 * r * Math.sin(th / 2); }
      var dispo = corde * .86, choix = null;
      for (var mode = 3; mode >= 1 && !choix; mode--) {
        for (var fz = Math.round(fzB); fz >= min; fz--) {
          var hh = Math.max.apply(null, ps.map(function (q) { return hauteur(lignes(q, mode, fz, min, false)); }));
          if (hh <= dispo) { choix = { mode: mode, fz: fz }; break; }
        }
      }
      if (!choix) return null;
      var cap = choix.fz * 13, pad2 = choix.fz * .6;
      var wr = Math.max.apply(null, ps.map(function (q) { return largeur(lignes(q, choix.mode, choix.fz, min, false).map(function (x) { return raccourcir(x, cap); })); }));
      var t = wr + 2 * pad2;
      anneaux.push({ g: g, r0: r, r1: r + t, fz: choix.fz, mode: choix.mode, radial: true, cap: cap }); r += t;
    }
    if (r > RMAX) return null;
    return { r0: r0, anneaux: anneaux, rayon: r, fzB: fzB };
  }
  function meilleur(R, n, a3) {
    var min = minFz(a3), lo = min, hi = Math.round(Math.max(min * 3, 90)), ok = plan(R, n, a3, lo);
    if (!ok) return null;
    while (hi - lo > 1) { var m = Math.round((lo + hi) / 2), p = plan(R, n, a3, m); if (p) { ok = p; lo = m; } else hi = m; }
    var p2 = plan(R, n, a3, hi); ok = p2 || ok;
    /* la place qui reste : les anneaux s'élargissent jusqu'au bord (le texte garde sa taille, il respire) */
    var k = RMAX / ok.rayon; ok.r0 = Math.round(ok.r0 * k); ok.anneaux.forEach(function (a) { a.r0 *= k; a.r1 *= k; }); ok.rayon = RMAX;
    return ok;
  }
  function capacite(d, a3) {
    if (!d || !d.moi) return 2;
    var R = rangs(d.moi, 14), best = 2;
    for (var n = 3; n <= R.length; n++) { if (meilleur(R, n, a3)) best = n; else break; }
    return best;
  }

  /* une part d'anneau, de l'angle a0 à a1 (en radians, de π à gauche à 0 à droite) */
  function pt(r, a) { return f1(CX + r * Math.cos(a)) + ' ' + f1(CY - r * Math.sin(a)); }
  function part(r0, r1, a0, a1) {
    return 'M' + pt(r1, a0) + 'A' + f1(r1) + ' ' + f1(r1) + ' 0 0 1 ' + pt(r1, a1) + 'L' + pt(r0, a1) + 'A' + f1(r0) + ' ' + f1(r0) + ' 0 0 0 ' + pt(r0, a0) + 'Z';
  }
  /* bloc de lignes centré sur (0,0) dans le repère tourné */
  function bloc(l) {
    var h = hauteur(l), y = -h / 2;
    return l.map(function (x) { y += x[1] * 1.18; return '<text x="0" y="' + f1(y - x[1] * .3) + '" text-anchor="middle" class="' + x[4] + '" font-size="' + x[1] + '">' + esc(x[0]) + '</text>'; }).join('');
  }

  function svg(d, o) {
    o = o || {};
    var a3 = o.a3 || d.a3 || false, min = minFz(a3), R = rangs(d.moi, 14);
    var max = Math.max(2, Math.min(d.nbGen || capacite(d, a3), R.length));
    var P = null; while (max > 2 && !(P = meilleur(R, max, a3))) max--;
    if (!P) P = meilleur(R, 2, a3) || plan(R, 2, a3, min) || { r0: 300, anneaux: [], rayon: 300, fzB: min };
    var parts = '', textes = '', personnes = 1;
    /* les anneaux */
    P.anneaux.forEach(function (an) {
      var g = an.g, n = Math.pow(2, g), th = Math.PI / n, teinte = g % 2;
      for (var k = 0; k < n; k++) {
        var q = R[g][k], enfant = R[g - 1][k >> 1];
        if (!q && !enfant) continue;   /* au-delà d'un ancêtre inconnu : rien */
        var a0 = Math.PI - k * th, a1 = a0 - th, cote = k < n / 2 ? 'p' : 'm';
        parts += '<path d="' + part(an.r0, an.r1, a0, a1) + '" fill="' + (q ? TEINTES[cote][teinte] : VIDE) + '" stroke="' + OR_CLAIR + '" stroke-width="2.5"/>';
        if (!q) continue;
        personnes++;
        var phi = (a0 + a1) / 2, rm = (an.r0 + an.r1) / 2, x = CX + rm * Math.cos(phi), y = CY - rm * Math.sin(phi), deg = phi * 180 / Math.PI, rot;
        var l = lignes(q, an.mode, an.fz, min, an.complet);
        if (an.radial) { l = l.map(function (z) { return raccourcir(z, an.cap); }); rot = deg <= 90 ? -deg : 180 - deg; }
        else rot = 90 - deg;
        textes += '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + f1(rot) + ')">' + bloc(l) + '</g>';
      }
    });
    /* le trait qui sépare la lignée du père et celle de la mère */
    var traits = '<path d="M' + CX + ' ' + (CY - P.r0) + 'V' + f1(CY - P.rayon) + '" stroke="' + OR + '" stroke-width="5"/>';
    /* toi, au centre : une demi-lune prune, ton nom en clair */
    var moi = d.moi, r0 = P.r0, fz0 = Math.max(min, Math.min(Math.round(P.fzB * 1.5), 64));
    /* « Notre famille » en éventail : le couple dans le premier anneau (sa lignée à gauche, celle de l'autre à droite), leurs enfants au centre */
    function lignesCentre(fz, complet) {
      if (!moi.couple) return lignes(moi, 3, fz, min, complet);
      var ens = (d.enfants || []).map(function (e) { return String(e.prenom || '').trim().split(/\s+/)[0]; }).filter(Boolean);
      var pr = function (q) { return q ? String(q.prenom || '').trim().split(/\s+/)[0] : ''; };
      if (!ens.length) return [[[pr(moi.pere), pr(moi.mere)].filter(Boolean).join(' & ') || 'Notre famille', fz, GN, false, 'ev-nom']];
      var t = ens.length > 1 ? ens.slice(0, -1).join(', ') + ' & ' + ens[ens.length - 1] : ens[0];
      var l = [[t, fz, GN, false, 'ev-nom']];
      if (ens.length > 2 && !complet) l = [[ens.slice(0, Math.ceil(ens.length / 2)).join(', '), fz, GN, false, 'ev-nom'], [(ens.length > 1 ? '& ' : '') + ens.slice(Math.ceil(ens.length / 2)).join(', ').replace(/, ([^,]*)$/, ' & $1'), fz, GN, false, 'ev-nom']];
      return l;
    }
    var l0 = lignesCentre(fz0, true);
    /* chaque ligne doit tenir dans la demi-lune, à sa hauteur */
    function tient(l) { var h = hauteur(l), yc = r0 * .44, y = yc + h / 2; return l.every(function (x) { var top = y; y -= x[1] * 1.18; return 2 * Math.sqrt(Math.max(0, r0 * r0 - top * top)) * .86 >= larg(x[0], x[1], x[2], x[3]); }); }
    var complet = true;
    while (!tient(l0)) { if (complet && fz0 < 44) { complet = false; fz0 = Math.max(min, Math.min(Math.round(P.fzB * 1.5), 64)); } else if (fz0 > min) fz0--; else break; l0 = lignesCentre(fz0, complet); }
    var centre = '<path d="M' + f1(CX - r0) + ' ' + CY + 'A' + r0 + ' ' + r0 + ' 0 0 1 ' + f1(CX + r0) + ' ' + CY + 'Z" fill="' + PRUNE + '"/>' +
      '<path d="M' + f1(CX - r0 + 16) + ' ' + CY + 'A' + (r0 - 16) + ' ' + (r0 - 16) + ' 0 0 1 ' + f1(CX + r0 - 16) + ' ' + CY + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3" opacity=".8"/>' +
      '<g transform="translate(' + CX + ' ' + f1(CY - r0 * .44) + ')" class="ev-moi">' + bloc(l0) + '</g>';
    /* le bord de l'éventail : un double filet doré */
    var Rx = P.rayon, bord = '<path d="M' + f1(CX - Rx) + ' ' + CY + 'A' + f1(Rx) + ' ' + f1(Rx) + ' 0 0 1 ' + f1(CX + Rx) + ' ' + CY + '" fill="none" stroke="' + OR + '" stroke-width="6"/>' +
      '<path d="M' + f1(CX - Rx - 22) + ' ' + CY + 'A' + f1(Rx + 22) + ' ' + f1(Rx + 22) + ' 0 0 1 ' + f1(CX + Rx + 22) + ' ' + CY + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="3"/>' +
      '<path d="M' + f1(CX - Rx - 22) + ' ' + CY + 'H' + f1(CX + Rx + 22) + '" stroke="' + OR + '" stroke-width="5"/>';
    var fzC = Math.max(min, 36);
    var pc = function (q) { return q ? String(q.prenom || '').trim().split(/\s+/)[0] : ''; }, cg = moi.couple ? 'Lignée de ' + pc(moi.pere) : 'Côté paternel', cd = moi.couple ? 'Lignée de ' + pc(moi.mere) : 'Côté maternel';
    var cotes = R.length > 1 ? '<text x="' + f1(CX - Rx / 2) + '" y="' + (CY + 78) + '" text-anchor="middle" class="ev-cote" font-size="' + fzC + '">' + esc(cg) + '</text>' +
      '<text x="' + f1(CX + Rx / 2) + '" y="' + (CY + 78) + '" text-anchor="middle" class="ev-cote" font-size="' + fzC + '">' + esc(cd) + '</text>' : '';
    var feuille = function (x, yy, a, t, coul) { return '<path d="M0 0C' + t * .35 + ' ' + -t * .28 + ' ' + t * .75 + ' ' + -t * .22 + ' ' + t + ' 0C' + t * .75 + ' ' + t * .22 + ' ' + t * .35 + ' ' + t * .28 + ' 0 0Z" fill="' + coul + '" transform="translate(' + x + ' ' + yy + ') rotate(' + a + ')"/>'; };
    var titre = '<text x="' + W / 2 + '" y="300" text-anchor="middle" class="li-titre">' + esc(d.titre || 'Mon arbre') + '</text>' +
      '<g transform="translate(0 -84)"><path d="M' + (W / 2 - 360) + ' 470C' + (W / 2 - 150) + ' 446 ' + (W / 2 + 150) + ' 494 ' + (W / 2 + 360) + ' 466" stroke="' + OR + '" stroke-width="3" fill="none"/>' +
      feuille(W / 2 - 14, 468, -20, 44, '#8E2F5E') + feuille(W / 2 + 14, 470, 160, 38, '#C9677F') + '</g>' +
      (d.sousTitre ? '<text x="' + W / 2 + '" y="452" text-anchor="middle" class="li-sous">' + esc(d.sousTitre) + '</text>' : '');
    var fond = '<rect x="-60" y="-60" width="' + (W + 120) + '" height="' + (H + 120) + '" fill="url(#ev-papier)"/>' +
      '<rect x="110" y="110" width="' + (W - 220) + '" height="' + (H - 220) + '" fill="none" stroke="' + OR + '" stroke-width="4" opacity=".6"/>' +
      '<rect x="132" y="132" width="' + (W - 264) + '" height="' + (H - 264) + '" fill="none" stroke="' + OR_CLAIR + '" stroke-width="2" opacity=".6"/>';
    var pied = '<text x="' + W / 2 + '" y="' + (H - 160) + '" text-anchor="middle" class="li-pied">' + esc(o.pied || 'GENESOLIA · genesolia.fr') + '</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-20 ' + W / 2 + ' ' + H / 2 + ')"><text x="' + W / 2 + '" y="' + (H / 2 - 60) + '" text-anchor="middle" class="li-fil">APERÇU</text><text x="' + W / 2 + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="li-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * H / (210 * (typeof a3 === 'number' ? a3 : 1))) : 0;   /* 4 mm du papier réel */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-personnes="' + personnes + '" data-generations="' + (P.anneaux.length + 1) + '">' +
      '<defs><radialGradient id="ev-papier" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#FFFBF4"/><stop offset=".7" stop-color="#F8F0E3"/><stop offset="1" stop-color="#EFE3D0"/></radialGradient>' +
      '<style>.li-titre{font-family:' + GN + ';font-size:124px;fill:' + PRUNE + '}.li-sous{font-family:' + NS + ';font-size:38px;letter-spacing:9px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.ev-nom{font-family:' + GN + ';fill:#4A0F36}.ev-nf{font-family:' + NS + ';font-weight:700;letter-spacing:1px;fill:#4A0F36}.ev-date{font-family:' + NS + ';font-weight:700;fill:#9A3A68}' +
      '.ev-moi .ev-nom,.ev-moi .ev-nf{fill:#FFF6EA}.ev-moi .ev-date{fill:' + OR_CLAIR + '}' +
      '.ev-cote{font-family:' + NS + ';letter-spacing:7px;text-transform:uppercase;fill:' + OR_FONCE + '}' +
      '.li-pied{font-family:' + NS + ';font-size:32px;letter-spacing:8px;fill:' + PRUNE + ';opacity:.85}.li-fil{font-family:' + GN + ';font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      fond + titre + parts + traits + bord + centre + textes + cotes + pied + filigrane + '</svg>';
  }
  window.ArbreEventail = { svg: svg, capacite: capacite };
})();
