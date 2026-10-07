/* Genesolia · champ « lieu de naissance » réutilisable : liste locale de villes (GeoNames, CC BY 4.0)
   complétée par Open-Meteo. LieuNaissance.brancher({ input, liste, info, surChoix(lieu) }) ; renvoie { resoudre() }. */
(function () {
  'use strict';
  var REG = { '11': 'Île-de-France', '24': 'Centre-Val de Loire', '27': 'Bourgogne-Franche-Comté', '28': 'Normandie', '32': 'Hauts-de-France', '44': 'Grand Est', '52': 'Pays de la Loire', '53': 'Bretagne', '75': 'Nouvelle-Aquitaine', '76': 'Occitanie', '84': 'Auvergne-Rhône-Alpes', '93': "Provence-Alpes-Côte d'Azur", '94': 'Corse' };
  var PAYS = { FR: 'France', BE: 'Belgique', CH: 'Suisse', LU: 'Luxembourg', MC: 'Monaco', CA: 'Canada', MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie', SN: 'Sénégal', CI: "Côte d'Ivoire", RE: 'La Réunion', GP: 'Guadeloupe', MQ: 'Martinique', GF: 'Guyane', YT: 'Mayotte', NC: 'Nouvelle-Calédonie', PF: 'Polynésie française', PM: 'Saint-Pierre-et-Miquelon', HT: 'Haïti', CM: 'Cameroun', MG: 'Madagascar' };
  var PROV = { '10': 'Québec', '08': 'Ontario', '04': 'Nouveau-Brunswick' };
  var VILLES = null, TZ = {}, chargement = null;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-'’.]/g, ' ').replace(/\bst(e?)\b/g, 'saint$1').replace(/\s+/g, ' ').trim(); }
  function charger() {
    if (!chargement) chargement = fetch('assets/villes.json').then(function (r) { return r.json(); }).then(function (d) {
      TZ = d.tz; VILLES = d.v.map(function (v) { return { n: v[0], k: norm(v[0]), lat: v[1], lon: v[2], cc: v[3], adm: v[4] || '' }; });
    }).catch(function () { VILLES = []; });
    return chargement;
  }
  function depuisLocal(v) {
    var tz = v.cc === 'CA' ? TZ['CA' + v.adm] : TZ[v.cc];
    var zone = v.cc === 'FR' ? (REG[v.adm] || '') : v.cc === 'CA' ? (PROV[v.adm] || '') + ', Canada' : PAYS[v.cc];
    return { name: v.n, zone: zone, latitude: v.lat, longitude: v.lon, timezone: tz, cc: v.cc, pays: PAYS[v.cc] };
  }
  function local(q) {
    if (!VILLES) return [];
    var k = norm(q), deb = [], mot = [];
    for (var i = 0; i < VILLES.length && deb.length < 8; i++) {
      var v = VILLES[i];
      if (v.k.indexOf(k) === 0) deb.push(depuisLocal(v));
      else if (mot.length < 8 && v.k.indexOf(' ' + k) > 0) mot.push(depuisLocal(v));
    }
    return deb.concat(mot).slice(0, 8);
  }
  function distant(q) {
    return fetch('https://geocoding-api.open-meteo.com/v1/search?count=8&language=fr&format=json&name=' + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .then(function (d) { return ((d && d.results) || []).filter(function (x) { return x.timezone; }).map(function (x) { return { name: x.name, zone: [x.admin1, x.country].filter(Boolean).join(', '), latitude: x.latitude, longitude: x.longitude, timezone: x.timezone, cc: x.country_code, pays: x.country }; }); })
      .catch(function () { return []; });
  }
  function fusion(a, b) {
    var vus = {}, out = [];
    a.concat(b).forEach(function (x) { var c = norm(x.name) + '|' + Math.round(x.latitude * 10) + '|' + Math.round(x.longitude * 10); if (!vus[c]) { vus[c] = 1; out.push(x); } });
    return out.slice(0, 8);
  }
  function versLieu(x) { return { nom: x.name + (x.cc && x.cc !== 'FR' && x.pays ? ', ' + x.pays : ''), lat: x.latitude, lon: x.longitude, tz: x.timezone }; }

  function brancher(o) {
    var input = o.input, liste = o.liste, info = o.info, resultats = [], minuteur = null, demande = 0, choisi = null;
    input.setAttribute('autocomplete', 'off');
    function montrer(l) {
      resultats = l;
      if (!l.length) { liste.hidden = true; return; }
      liste.innerHTML = l.map(function (x, i) { return '<li role="option" data-i="' + i + '">' + esc(x.name) + '<small>' + esc(x.zone || '') + '</small></li>'; }).join('');
      liste.hidden = false;
    }
    function prendre(x, ecrire) {
      choisi = versLieu(x);
      if (ecrire) input.value = x.name + (x.zone ? ' (' + x.zone + ')' : '');
      if (info) { info.textContent = 'Lieu trouvé : ' + x.name + (x.zone ? ' (' + x.zone + ')' : '') + ' · fuseau ' + x.timezone; }
      liste.hidden = true;
      if (o.surChoix) o.surChoix(choisi);
    }
    input.addEventListener('focus', charger);
    input.addEventListener('input', function () {
      choisi = null; if (info) info.textContent = 'Choisis ta ville dans la liste, ou continue : on prendra la plus proche.';
      clearTimeout(minuteur); var q = input.value.trim(), n = ++demande;
      if (q.length < 2) { liste.hidden = true; return; }
      charger().then(function () { if (n === demande) montrer(local(q)); });
      minuteur = setTimeout(function () { distant(q).then(function (d) { if (n === demande) montrer(fusion(local(q), d)); }); }, 300);
    });
    liste.addEventListener('mousedown', function (e) { e.preventDefault(); });
    liste.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) prendre(resultats[+li.getAttribute('data-i')], true); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !liste.hidden && resultats.length) { e.preventDefault(); prendre(resultats[0], true); } else if (e.key === 'Escape') liste.hidden = true; });
    input.addEventListener('blur', function () { setTimeout(function () { liste.hidden = true; }, 200); });
    return {
      lieu: function () { return choisi; },
      definir: function (l) { choisi = l; },
      resoudre: function () {
        var q = input.value.replace(/\s*\(.*$/, '').trim();
        if (!q || choisi) return Promise.resolve(choisi);
        return charger().then(function () {
          var l = local(q), ex = l.filter(function (x) { return norm(x.name) === norm(q); });
          if (ex.length || l.length) { prendre(ex[0] || l[0], false); return choisi; }
          return distant(q).then(function (d) { if (d.length) prendre(d[0], false); return choisi; });
        });
      }
    };
  }
  window.LieuNaissance = { brancher: brancher };
})();
