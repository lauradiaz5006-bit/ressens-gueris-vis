/* Genesolia · astrologie : calcul du thème (positions tropicales, ascendant, maisons Placidus).
   S'appuie sur Astronomy Engine (assets/astronomy.browser.min.js, licence MIT). */
(function () {
  'use strict';
  var A = window.Astronomy;
  var SIGNES = ['belier', 'taureau', 'gemeaux', 'cancer', 'lion', 'vierge', 'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'];
  var ELEMENT = { belier: 'feu', lion: 'feu', sagittaire: 'feu', taureau: 'terre', vierge: 'terre', capricorne: 'terre', gemeaux: 'air', balance: 'air', verseau: 'air', cancer: 'eau', scorpion: 'eau', poissons: 'eau' };
  var MODE = { belier: 'cardinal', cancer: 'cardinal', balance: 'cardinal', capricorne: 'cardinal', taureau: 'fixe', lion: 'fixe', scorpion: 'fixe', verseau: 'fixe', gemeaux: 'mutable', vierge: 'mutable', sagittaire: 'mutable', poissons: 'mutable' };
  var CORPS = [['soleil', 'Sun'], ['lune', 'Moon'], ['mercure', 'Mercury'], ['venus', 'Venus'], ['mars', 'Mars'], ['jupiter', 'Jupiter'], ['saturne', 'Saturn'], ['uranus', 'Uranus'], ['neptune', 'Neptune'], ['pluton', 'Pluto']];
  var RAD = Math.PI / 180;

  function norm(x) { x %= 360; return x < 0 ? x + 360 : x; }
  function signeDe(lon) { return SIGNES[Math.floor(norm(lon) / 30)]; }
  function degDans(lon) { return norm(lon) % 30; }

  /* décalage (en minutes) d'un fuseau IANA à un instant donné, historique compris */
  function decalage(tz, date) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var p = {}; f.formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    var loc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return Math.round((loc - date.getTime()) / 60000);
  }
  /* heure locale (date + heure) dans un fuseau, convertie en instant UTC */
  function versUTC(date, heure, tz) {
    var d = date.split('-').map(Number), h = (heure || '12:00').split(':').map(Number);
    var naif = Date.UTC(d[0], d[1] - 1, d[2], h[0], h[1] || 0);
    if (!tz) return new Date(naif);
    var t = naif - decalage(tz, new Date(naif)) * 60000;
    t = naif - decalage(tz, new Date(t)) * 60000;
    return new Date(t);
  }

  function longitude(nomAstro, t) {
    if (nomAstro === 'Sun') return A.SunPosition(t).elon;
    if (nomAstro === 'Moon') return A.EclipticGeoMoon(t).lon;
    var v = A.GeoVector(A.Body[nomAstro], t, true);
    return A.SphereFromVector(A.RotateVector(A.Rotation_EQJ_ECT(t), v)).lon;
  }
  function siecles(t) { return t.tt / 36525; }
  function obliquite(t) { var T = siecles(t); return 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T; }
  function noeudMoyen(t) { var T = siecles(t); return norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000); }

  function eclDepuisAD(ra, eps) { return norm(Math.atan2(Math.sin(ra * RAD), Math.cos(eps * RAD) * Math.cos(ra * RAD)) / RAD); }
  /* Ascendant, Milieu du Ciel et maisons Placidus (repli en maisons égales au-delà du cercle polaire) */
  function maisons(t, lat, lon) {
    var eps = obliquite(t), ramc = norm(A.SiderealTime(t) * 15 + lon), phi = lat * RAD, e = eps * RAD, r = ramc * RAD;
    var mc = eclDepuisAD(ramc, eps);
    var asc = norm(Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) / RAD);
    var cus = new Array(13), polaire = Math.abs(lat) > 66;
    cus[1] = asc; cus[10] = mc; cus[7] = norm(asc + 180); cus[4] = norm(mc + 180);
    function placidus(f, nocturne) {
      var ra = norm(ramc + (nocturne ? 180 - f * 90 : f * 90)), l;
      for (var i = 0; i < 40; i++) {
        l = eclDepuisAD(ra, eps);
        var dec = Math.asin(Math.sin(e) * Math.sin(l * RAD));
        var x = -Math.tan(phi) * Math.tan(dec); if (x < -1 || x > 1) return null;
        var dsa = Math.acos(x) / RAD, nouv;
        nouv = nocturne ? norm(ramc + 180 - f * (180 - dsa)) : norm(ramc + f * dsa);
        if (Math.abs(nouv - ra) < 1e-7) break;
        ra = nouv;
      }
      return eclDepuisAD(ra, eps);
    }
    var c11 = null, c12 = null, c2 = null, c3 = null;
    if (!polaire) { c11 = placidus(1 / 3, false); c12 = placidus(2 / 3, false); c2 = placidus(2 / 3, true); c3 = placidus(1 / 3, true); }
    if (c11 == null || c12 == null || c2 == null || c3 == null) {
      for (var k = 0; k < 12; k++) cus[k + 1] = norm(asc + 30 * k);
      return { asc: asc, mc: mc, cuspides: cus, systeme: 'égales' };
    }
    cus[11] = c11; cus[12] = c12; cus[2] = c2; cus[3] = c3;
    cus[5] = norm(c11 + 180); cus[6] = norm(c12 + 180); cus[8] = norm(c2 + 180); cus[9] = norm(c3 + 180);
    return { asc: asc, mc: mc, cuspides: cus, systeme: 'Placidus' };
  }
  function maisonDe(lon, cus) {
    for (var i = 1; i <= 12; i++) {
      var a = cus[i], b = cus[i % 12 + 1], d = norm(b - a), x = norm(lon - a);
      if (x < d) return i;
    }
    return 1;
  }

  /* entree : { date:'AAAA-MM-JJ', heure:'HH:MM' ou '', lat, lon, tz } */
  function calculer(entree) {
    var heureConnue = /^\d{1,2}:\d{2}$/.test(entree.heure || '');
    var utc = versUTC(entree.date, heureConnue ? entree.heure : '12:00', entree.tz);
    var t = A.MakeTime(utc), t2 = A.MakeTime(new Date(utc.getTime() + 86400000));
    var r = { utc: utc, heureConnue: heureConnue, lieu: entree.lieu || '', planetes: {}, elements: { feu: 0, terre: 0, air: 0, eau: 0 }, modes: { cardinal: 0, fixe: 0, mutable: 0 } };
    CORPS.forEach(function (c) {
      var l = norm(longitude(c[1], t)), l2 = norm(longitude(c[1], t2));
      var vit = ((l2 - l + 540) % 360) - 180;
      r.planetes[c[0]] = { lon: l, signe: signeDe(l), deg: degDans(l), retro: c[0] !== 'soleil' && c[0] !== 'lune' && vit < 0 };
    });
    var nn = noeudMoyen(t);
    r.planetes.noeud = { lon: nn, signe: signeDe(nn), deg: degDans(nn), retro: true };
    r.noeudSud = { lon: norm(nn + 180), signe: signeDe(nn + 180), deg: degDans(nn + 180) };
    if (!heureConnue) {
      // la Lune avance d'environ 13° par jour : on vérifie si elle change de signe dans la journée
      var deb = norm(longitude('Moon', A.MakeTime(versUTC(entree.date, '00:00', entree.tz)))), fin = norm(longitude('Moon', A.MakeTime(versUTC(entree.date, '23:59', entree.tz))));
      if (signeDe(deb) !== signeDe(fin)) r.luneIncertaine = { avant: signeDe(deb), apres: signeDe(fin) };
    }
    if (heureConnue && typeof entree.lat === 'number' && typeof entree.lon === 'number') {
      var m = maisons(t, entree.lat, entree.lon);
      r.asc = { lon: m.asc, signe: signeDe(m.asc), deg: degDans(m.asc) };
      r.mc = { lon: m.mc, signe: signeDe(m.mc), deg: degDans(m.mc) };
      r.cuspides = m.cuspides; r.systeme = m.systeme;
      Object.keys(r.planetes).forEach(function (k) { r.planetes[k].maison = maisonDe(r.planetes[k].lon, m.cuspides); });
    }
    // équilibre des éléments et des modes : planètes personnelles et sociales, plus l'ascendant
    var poids = { soleil: 2, lune: 2, mercure: 1, venus: 1, mars: 1, jupiter: 1, saturne: 1 };
    Object.keys(poids).forEach(function (k) { var s = r.planetes[k].signe; r.elements[ELEMENT[s]] += poids[k]; r.modes[MODE[s]] += poids[k]; });
    if (r.asc) { r.elements[ELEMENT[r.asc.signe]] += 2; r.modes[MODE[r.asc.signe]] += 2; }
    r.elementDominant = Object.keys(r.elements).sort(function (a, b) { return r.elements[b] - r.elements[a]; })[0];
    r.elementsAbsents = Object.keys(r.elements).filter(function (k) { return !r.elements[k]; });
    r.modeDominant = Object.keys(r.modes).sort(function (a, b) { return r.modes[b] - r.modes[a]; })[0];
    return r;
  }
  /* version rapide pour l'arbre : date seule (midi, heure de Paris par défaut) */
  function simple(date, tz) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return null;
    return calculer({ date: date, heure: '', tz: tz || 'Europe/Paris' });
  }
  function degres(d) { var g = Math.floor(d), m = Math.floor((d - g) * 60); return g + '°' + (m < 10 ? '0' : '') + m; }

  window.Astrologie = { longitude: function (corps, date) { var c = CORPS.filter(function (x) { return x[0] === corps; })[0]; return norm(longitude(c ? c[1] : corps, A.MakeTime(date))); }, maisonDe: maisonDe, norm: norm, calculer: calculer, simple: simple, signeDe: signeDe, degres: degres, versUTC: versUTC, decalage: decalage, SIGNES: SIGNES, ELEMENT: ELEMENT, MODE: MODE };
})();
