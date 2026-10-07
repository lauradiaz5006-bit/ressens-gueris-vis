/* Genesolia · calendrier maya : Tzolk'in, Haab', Compte long.
   Compte traditionnel tenu par les ajq'ij k'iche', corrélation GMT 584283.
   Contrôle : 21/12/2012 = 13.0.0.0.0, 4 Ajaw 3 K'ank'in. */
(function () {
  'use strict';
  var CORR = 584283;
  var HAAB = ['Pop', "Wo'", 'Sip', "Sotz'", 'Sek', 'Xul', "Yaxk'in", 'Mol', "Ch'en", 'Yax', "Sak'", 'Keh', 'Mak', "K'ank'in", 'Muwan', 'Pax', "K'ayab'", "Kumk'u", "Wayeb'"];

  function jdn(y, m, d) {
    var a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }
  function mod(a, n) { return ((a % n) + n) % n; }

  function calculer(date) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || ''); if (!m) return null;
    var j = jdn(+m[1], +m[2], +m[3]), jours = j - CORR;
    var nombre = mod(jours + 3, 13) + 1;          // 1 à 13
    var signe = mod(jours + 19, 20);              // 0 = Imix … 19 = Ajaw
    var kin = 0;
    for (var k = 1; k <= 260; k++) if (mod(k - 1, 13) + 1 === nombre && mod(k - 1, 20) === signe) { kin = k; break; }
    var h = mod(jours + 348, 365);
    var lc = [], reste = jours, unites = [144000, 7200, 360, 20, 1];
    for (var i = 0; i < 5; i++) { lc.push(Math.floor(reste / unites[i])); reste = mod(reste, unites[i]); }
    return { nombre: nombre, signe: signe, kin: kin, haab: { jour: h % 20, mois: HAAB[Math.floor(h / 20)] }, compteLong: lc };
  }

  /* Chiffre maya en SVG : points (1) au-dessus, barres (5) en dessous, coquillage pour 0 */
  function chiffre(n, opts) {
    opts = opts || {};
    var c = opts.couleur || '#6B2F5B', w = 60, barres = Math.floor(n / 5), points = n % 5, hBarre = 9, ecart = 5;
    var h = Math.max(24, barres * (hBarre + ecart) + (points ? 16 : 0)) + 4, s = '', y = h - 2;
    if (n === 0) {
      return '<svg viewBox="0 0 60 34" class="' + (opts.classe || '') + '" role="img" aria-label="zéro"><ellipse cx="30" cy="17" rx="24" ry="13" fill="none" stroke="' + c + '" stroke-width="2.4"/><path d="M12 15 Q30 4 48 15 M14 20 Q30 30 46 20 M30 5 V29" fill="none" stroke="' + c + '" stroke-width="1.6"/></svg>';
    }
    for (var b = 0; b < barres; b++) { y -= hBarre; s += '<rect x="4" y="' + y + '" width="52" height="' + hBarre + '" rx="4.5" fill="' + c + '"/>'; y -= ecart; }
    if (points) {
      var cy = y - 6, pas = 12, x0 = 30 - (points - 1) * pas / 2;
      for (var p = 0; p < points; p++) s += '<circle cx="' + (x0 + p * pas) + '" cy="' + cy + '" r="5" fill="' + c + '"/>';
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="' + (opts.classe || '') + '" role="img" aria-label="' + n + '">' + s + '</svg>';
  }

  window.Maya = { calculer: calculer, chiffre: chiffre, HAAB: HAAB };
})();
