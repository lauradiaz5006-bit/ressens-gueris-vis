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
    var k = norm(decouper(q).nom || q), deb = [], mot = [];
    for (var i = 0; i < VILLES.length && deb.length < 8; i++) {
      var v = VILLES[i];
      if (v.k.indexOf(k) === 0) deb.push(depuisLocal(v));
      else if (mot.length < 8 && v.k.indexOf(' ' + k) > 0) mot.push(depuisLocal(v));
    }
    return deb.concat(mot).slice(0, 8);
  }
  var TZ_DOM = { '971': 'America/Guadeloupe', '972': 'America/Martinique', '973': 'America/Cayenne', '974': 'Indian/Reunion', '976': 'Indian/Mayotte', '975': 'America/Miquelon', '977': 'America/St_Barthelemy', '978': 'America/Marigot' };
  function decouper(q) {
    var cp = (q.match(/\b(\d{5})\b/) || [])[1] || '';
    var dep = cp ? '' : ((q.match(/(?:^|[\s(,])(2[ab]|97\d|\d{2})(?:$|[\s),])/i) || [])[1] || '');
    var nom = q.replace(/\([^)]*[a-zà-ÿ]{3}[^)]*\)/gi, ' ').replace(/\b\d{5}\b/, '').replace(/(?:^|[\s(,])(2[ab]|97\d|\d{2})(?=$|[\s),])/i, ' ').replace(/[()]/g, ' ').replace(/,.*$/, '').replace(/\s+/g, ' ').trim();
    return { nom: nom, cp: cp, dep: dep.toUpperCase() };
  }
  /* France : toutes les communes avec leur département (geo.api.gouv.fr) */
  function france(q) {
    var d = decouper(q);
    if (d.nom.length < 2 && !d.cp) return Promise.resolve([]);
    var u = 'https://geo.api.gouv.fr/communes?fields=nom,code,centre,departement&boost=population&limit=8' + (d.nom.length >= 2 ? '&nom=' + encodeURIComponent(d.nom) : '') + (d.cp ? '&codePostal=' + d.cp : '') + (d.dep ? '&codeDepartement=' + d.dep : '');
    return fetch(u).then(function (r) { return r.ok ? r.json() : []; }).then(function (l) {
      return (l || []).filter(function (c) { return c.centre && c.centre.coordinates; }).map(function (c) {
        var dc = c.departement ? c.departement.code : '';
        return { name: c.nom, zone: c.departement ? c.departement.nom + ' · ' + dc : '', latitude: c.centre.coordinates[1], longitude: c.centre.coordinates[0], timezone: TZ_DOM[dc] || 'Europe/Paris', cc: 'FR', pays: 'France' };
      });
    }).catch(function () { return []; });
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
      minuteur = setTimeout(function () {
        Promise.all([france(q), distant(decouper(q).nom || q)]).then(function (r) {
          if (n !== demande) return;
          var fr = r[0], l = local(q), d = r[1];
          if (fr.length) { l = l.filter(function (x) { return x.cc !== 'FR'; }); d = d.filter(function (x) { return x.cc !== 'FR'; }); }
          montrer(fusion(fr.concat(l), d));
        });
      }, 300);
    });
    liste.addEventListener('mousedown', function (e) { e.preventDefault(); });
    liste.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) prendre(resultats[+li.getAttribute('data-i')], true); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !liste.hidden && resultats.length) { e.preventDefault(); prendre(resultats[0], true); } else if (e.key === 'Escape') liste.hidden = true; });
    input.addEventListener('blur', function () { setTimeout(function () { liste.hidden = true; }, 200); });
    return {
      lieu: function () { return choisi; },
      definir: function (l) { choisi = l; },
      resoudre: function () {
        var q = input.value.trim();
        if (!q || choisi) return Promise.resolve(choisi);
        var nom = decouper(q).nom || q;
        return france(q).then(function (fr) {
          var exFr = fr.filter(function (x) { return norm(x.name) === norm(nom); });
          if (exFr.length) { prendre(exFr[0], false); return choisi; }
          return charger().then(function () {
            var l = local(q), ex = l.filter(function (x) { return norm(x.name) === norm(nom); }), exF = ex.filter(function (x) { return x.cc === 'FR'; });
            if (exF.length || ex.length) { prendre(exF[0] || ex[0], false); return choisi; }
            if (fr.length) { prendre(fr[0], false); return choisi; }
            if (l.length) { prendre(l[0], false); return choisi; }
            return distant(nom).then(function (d) { if (d.length) prendre(d[0], false); return choisi; });
          });
        });
      }
    };
  }
  window.LieuNaissance = { brancher: brancher };
})();
