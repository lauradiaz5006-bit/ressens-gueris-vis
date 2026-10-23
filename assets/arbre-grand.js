/* Genesolia · style « Grand arbre » : l'arbre doré peint (assets/arbre/grand-arbre.jpg), à l'horizontale,
   avec un médaillon par ancêtre sur 5 générations : 1, 2, 4, 8, 16 (31 médaillons).
   Le nom de chaque personne est écrit dans son médaillon ; un ancêtre inconnu laisse le médaillon vide.
   Prévu pour l'A3 : 8 points imprimés au moins = 24 px dans ce dessin (3508 x 2480).
   ArbreGrand.svg(donnees, o) -> chaîne SVG ; o.fond : image de fond (URL ou data:), o.apercu, o.fondPerdu. */
(function () {
  'use strict';
  var W = 3508, H = 2480, MIN = 24, PRUNE = '#5A2147', OR_FONCE = '#9A6E38';
  var GN = '"Gilda Display",Georgia,serif', NS = '"Nunito Sans",sans-serif';
  /* centres des médaillons, génération par génération, de gauche à droite (père à gauche, mère à droite) */
  var X = [[1747], [1194, 2314], [538, 1280, 2218, 2959], [282, 665, 1023, 1400, 2099, 2468, 2831, 3218],
    [189, 379, 568, 753, 926, 1110, 1295, 1475, 2032, 2207, 2387, 2562, 2741, 2929, 3117, 3305]];
  var Y = [[2020], [1712, 1713], [1306, 1310, 1307, 1307], [889, 882, 891, 889, 891, 891, 891, 891],
    [549, 542, 549, 541, 542, 545, 543, 541, 542, 537, 542, 542, 541, 545, 546, 541]];
  var R = [163, 150, 130, 108, 76];   /* rayon du médaillon ; on écrit dans 80 % de ce rayon */

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ctx = null;
  function larg(t, taille, police, gras) {
    try { if (!ctx && typeof document !== 'undefined') ctx = document.createElement('canvas').getContext('2d'); if (ctx) { ctx.font = (gras ? '700 ' : '400 ') + taille + 'px ' + police; return ctx.measureText(t).width; } } catch (e) {}
    return String(t).length * taille * (gras ? .62 : .5);
  }
  function f1(n) { return (+n).toFixed(1); }

  /* Le texte d'un médaillon : prénom(s), NOM, dates, le plus grand possible sans sortir du cercle */
  function medaillon(p, x, y, r) {
    var pre = String(p.prenom || '').trim().split(/\s+/).filter(Boolean), nom = String(p.nom || '').toUpperCase();
    var dates = (p.naissance || '') + (p.deces ? '–' + p.deces : '');
    var lignes = null, fz = Math.max(MIN, Math.round(r * .42));
    function essai(t, prenom) {
      var l = [[prenom, t, GN, false, 'gr-nom'], [nom, t * .86, NS, true, 'gr-nf'], [dates, Math.max(MIN, t * .8), NS, true, 'gr-date']].filter(function (z) { return z[0]; });
      var h = l.reduce(function (s, z) { return s + z[1] * 1.12; }, 0), yy = -h / 2, ok = true;
      l.forEach(function (z) { var mid = yy + z[1] * .56, ch = 2 * Math.sqrt(Math.max(0, r * r - mid * mid)); if (larg(z[0], z[1], z[2], z[3]) > ch * .94) ok = false; yy += z[1] * 1.12; });
      return ok ? l : null;
    }
    /* d'abord tous les prénoms (le texte peut un peu rapetisser), puis le premier prénom seulement si la place manque vraiment */
    var fz0 = fz, seuil = Math.max(MIN, Math.round(fz0 * .55));
    for (; fz >= seuil && !lignes; fz--) lignes = essai(fz, pre.join(' '));
    for (fz = fz0; fz >= MIN && !lignes; fz--) lignes = essai(fz, pre.join(' ')) || (pre.length > 1 ? essai(fz, pre[0]) : null);
    if (!lignes) lignes = essai(MIN, pre[0] || '') || [[pre[0] || '', MIN, GN, false, 'gr-nom'], [nom, MIN, NS, true, 'gr-nf'], [dates, MIN, NS, true, 'gr-date']].filter(function (z) { return z[0]; });
    var h = lignes.reduce(function (s, z) { return s + z[1] * 1.12; }, 0), ty = y - h / 2, out = '<circle cx="' + x + '" cy="' + y + '" r="' + f1(r * 1.02) + '" fill="#FDF8EF" opacity=".92"/>';
    /* le NOM le plus long peut toucher le bord : il est resserré pour rester dans le cercle */
    lignes.forEach(function (z) {
      ty += z[1] * .88;
      var w = larg(z[0], z[1], z[2], z[3]), mid = ty - y - z[1] * .3, ch = 2 * Math.sqrt(Math.max(0, r * r - mid * mid)) * .96;
      out += '<text x="' + x + '" y="' + f1(ty) + '" text-anchor="middle" class="' + z[4] + '" font-size="' + f1(z[1]) + '"' + (w > ch ? ' textLength="' + f1(ch) + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(z[0]) + '</text>';
      ty += z[1] * .24;
    });
    return out;
  }

  function svg(donnees, o) {
    o = o || {};
    var h = '', max = Math.min(5, donnees.nbGen || 5);
    (function poser(p, g, i) {
      if (!p || g >= max) return;
      h += medaillon(p, X[g][i], Y[g][i], R[g] * .8);
      poser(p.pere, g + 1, i * 2); poser(p.mere, g + 1, i * 2 + 1);
    })(donnees.moi, 0, 0);
    /* « Avec mes enfants » : de petits médaillons dorés parmi les racines, reliés au médaillon du bas */
    var enf = (donnees.enfants || []).slice(0, 6), eH = '', CJ = donnees.conjoint || null;
    if (enf.length) {
      /* du plus âgé (à gauche) au plus jeune (à droite), de part et d'autre du médaillon du bas */
      /* des médaillons peints (les mêmes que l'arbre), aussi grands que ceux des grands-parents, de part et d'autre de toi ; avec le conjoint, les deux côtés s'écartent d'un cran pour rester symétriques */
      var RE = enf.length > 4 ? 112 : 128, YE = 2225, PAS = enf.length > 4 ? 285 : 330, nG = Math.ceil(enf.length / 2), sc = RE / 152;
      enf.forEach(function (q, i) {
        var e0 = R[0] + RE + 70 + (CJ ? PAS : 0), dx = i < nG ? -(e0 + (nG - 1 - i) * PAS) : e0 + (i - nG) * PAS, x = X[0][0] + dx, y = YE, sg = dx < 0 ? -1 : 1;
        /* pas de trait : les racines peintes relient déjà les enfants au médaillon du bas */
        eH += '<circle cx="' + f1(x) + '" cy="' + y + '" r="' + f1(RE * .95) + '" fill="#FDF8EF"/>';
        eH += o.medaillon ? '<image href="' + esc(o.medaillon) + '" x="' + f1(x - 360 * sc) + '" y="' + f1(y - 279 * sc) + '" width="' + f1(780 * sc) + '" height="' + f1(540 * sc) + '"/>'
          : '<circle cx="' + f1(x) + '" cy="' + y + '" r="' + RE + '" fill="none" stroke="url(#gr-or)" stroke-width="11"/>';
        eH += medaillon(q, Math.round(x), y, RE * .78);
      });
    }
    /* le conjoint : un médaillon peint à droite de toi, relié par un trait doré (pointillé s'ils sont séparés) */
    if (CJ) {
      var RC = 128, xc = X[0][0] + R[0] + RC + 75, yc = Y[0][0] - 10, scc = RC / 152;
      eH += '<path d="M' + (X[0][0] + R[0] - 4) + ' ' + Y[0][0] + 'L' + f1(xc - RC + 6) + ' ' + yc + '" stroke="#B08048" stroke-width="8" fill="none" stroke-linecap="round"' + (CJ.separe ? ' stroke-dasharray="16 12"' : '') + '/>';
      eH += '<circle cx="' + f1(xc) + '" cy="' + yc + '" r="' + f1(RC * .95) + '" fill="#FDF8EF"/>';
      eH += o.medaillon ? '<image href="' + esc(o.medaillon) + '" x="' + f1(xc - 360 * scc) + '" y="' + f1(yc - 279 * scc) + '" width="' + f1(780 * scc) + '" height="' + f1(540 * scc) + '"/>' : '<circle cx="' + f1(xc) + '" cy="' + yc + '" r="' + RC + '" fill="none" stroke="url(#gr-or)" stroke-width="11"/>';
      eH += medaillon(CJ, Math.round(xc), yc, RC * .78);
    }
    /* titre dans le creux, entre les deux moitiés de l'arbre */
    var t = String(donnees.titre || 'Notre famille').trim(), l1 = t, l2 = '';
    var m = /^(La famille|Les|Famille)\s+(.+)$/i.exec(t);
    if (m) { l1 = m[1]; l2 = m[2]; } else if (larg(t, 88, GN) > 560) { var mots = t.split(' '), k = Math.ceil(mots.length / 2); l1 = mots.slice(0, k).join(' '); l2 = mots.slice(k).join(' '); }
    var tz = Math.min(88, Math.floor(88 * 560 / Math.max(larg(l1, 88, GN), larg(l2 || ' ', 88, GN), 1)));
    var sous = String(donnees.sousTitre || '').split(/\s+·\s+/);
    var titre = '<text x="' + W / 2 + '" y="' + (l2 ? 370 : 420) + '" text-anchor="middle" class="gr-titre" font-size="' + tz + '">' + esc(l1) + '</text>' +
      (l2 ? '<text x="' + W / 2 + '" y="' + f1(370 + tz * 1.1) + '" text-anchor="middle" class="gr-titre" font-size="' + tz + '">' + esc(l2) + '</text>' : '') +
      sous.map(function (s, i) { return '<text x="' + W / 2 + '" y="' + (575 + i * 46) + '" text-anchor="middle" class="gr-sous" font-size="' + (i ? 26 : 28) + '">' + esc(s) + '</text>'; }).join('');
    var pied = '<text x="' + (W - 230) + '" y="' + (H - 150) + '" text-anchor="end" class="gr-pied">GENESOLIA · genesolia.fr</text>';
    var filigrane = o.apercu ? '<g opacity=".14" transform="rotate(-25 ' + W / 2 + ' ' + H / 2 + ')"><text x="' + W / 2 + '" y="' + (H / 2 - 60) + '" text-anchor="middle" class="gr-fil">APERÇU</text><text x="' + W / 2 + '" y="' + (H / 2 + 300) + '" text-anchor="middle" class="gr-fil">GENESOLIA</text></g>' : '';
    var B = o.fondPerdu ? Math.round(4 * H / 210) : 0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-B) + ' ' + (-B) + ' ' + (W + 2 * B) + ' ' + (H + 2 * B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" data-generations="' + max + '">' +
      '<defs><linearGradient id="gr-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6CB95"/><stop offset=".5" stop-color="#B98A55"/><stop offset="1" stop-color="#9A6E38"/></linearGradient><style>.gr-titre{font-family:' + GN + ';fill:' + PRUNE + '}.gr-sous{font-family:' + NS + ';font-weight:700;letter-spacing:5px;fill:' + OR_FONCE + ';text-transform:uppercase}' +
      '.gr-nom{font-family:' + GN + ';fill:#4A0F36}.gr-nf{font-family:' + NS + ';font-weight:700;letter-spacing:.5px;fill:#4A0F36}.gr-date{font-family:' + NS + ';font-weight:700;fill:#9A3A68}' +
      '.gr-pied{font-family:' + NS + ';font-size:26px;letter-spacing:6px;fill:' + PRUNE + ';opacity:.7}.gr-fil{font-family:' + GN + ';font-size:300px;fill:' + PRUNE + '}</style></defs>' +
      '<image href="' + esc(o.fond || 'assets/arbre/grand-arbre-ecran.jpg') + '" x="' + (-B) + '" y="' + (-B) + '" width="' + (W + 2 * B) + '" height="' + (H + 2 * B) + '" preserveAspectRatio="xMidYMid slice"/>' +
      titre + eH + h + pied + filigrane + '</svg>';
  }
  window.ArbreGrand = { svg: svg, generations: 5 };
})();
