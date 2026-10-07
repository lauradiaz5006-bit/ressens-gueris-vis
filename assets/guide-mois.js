/* Genesolia · « Ton guide du mois » : calcul personnel du mois.
   Nombres (Numerologie), ciel réel du mois rapporté au thème natal (Astrologie + Astronomy Engine),
   calendrier maya (Maya) et, si un arbre existe, les dates de la famille.
   Guide.calculer(profil, annee, mois, arbre?) ; profil = { date, heure, lat, lon, tz, lieu, prenom } */
(function () {
  'use strict';
  var A = window.Astronomy, AS = window.Astrologie, N = window.Numerologie, MY = window.Maya;
  var LENTES = { jupiter: 2, saturne: 2, uranus: 1.5, neptune: 1.5, pluton: 1.5 };
  var ASPECTS = [['conjonction', 0], ['trigone', 120], ['carre', 90], ['opposition', 180]];

  function jourUTC(annee, mois, jour, heure) { return new Date(Date.UTC(annee, mois - 1, jour, heure == null ? 12 : heure)); }
  function nbJours(annee, mois) { return new Date(Date.UTC(annee, mois, 0)).getUTCDate(); }
  function ecart(a, b) { var d = Math.abs(AS.norm(a - b)); return d > 180 ? 360 - d : d; }
  function jourLocal(date, tz) {
    var f = new Intl.DateTimeFormat('fr-CA', { timeZone: tz || 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' });
    return f.format(date);
  }
  function place(lon, natal) {
    var o = { signe: AS.signeDe(lon) };
    if (natal.cuspides) o.maison = AS.maisonDe(lon, natal.cuspides);
    return o;
  }

  function lunaisons(annee, mois, natal, tz) {
    var debut = A.MakeTime(jourUTC(annee, mois, 1, 0)), fin = jourUTC(annee, mois, nbJours(annee, mois), 23).getTime(), out = [];
    [[0, 'nouvelle'], [180, 'pleine']].forEach(function (ph) {
      var t = debut;
      for (var i = 0; i < 3; i++) {
        var r = A.SearchMoonPhase(ph[0], t, 40); if (!r || r.date.getTime() > fin) break;
        var lon = ph[1] === 'nouvelle' ? AS.longitude('soleil', r.date) : AS.longitude('lune', r.date);
        out.push(Object.assign({ type: ph[1], date: r.date, jour: jourLocal(r.date, tz) }, place(lon, natal)));
        t = A.MakeTime(new Date(r.date.getTime() + 86400000));
      }
    });
    return out.sort(function (a, b) { return a.date - b.date; });
  }

  function eclipses(annee, mois, tz) {
    var d0 = jourUTC(annee, mois, 1, 0), fin = jourUTC(annee, mois, nbJours(annee, mois), 23).getTime(), out = [];
    try {
      var l = A.SearchLunarEclipse(A.MakeTime(d0));
      if (l && l.peak.date.getTime() <= fin) out.push({ type: 'lunaire', kind: l.kind, date: l.peak.date, jour: jourLocal(l.peak.date, tz) });
      var s = A.SearchGlobalSolarEclipse(A.MakeTime(d0));
      if (s && s.peak.date.getTime() <= fin) out.push({ type: 'solaire', kind: s.kind, date: s.peak.date, jour: jourLocal(s.peak.date, tz) });
    } catch (e) {}
    return out;
  }

  function aspects(annee, mois, natal) {
    var n = nbJours(annee, mois), cibles = ['soleil'], out = [];
    if (natal.heureConnue || !natal.luneIncertaine) cibles.push('lune');
    Object.keys(LENTES).forEach(function (p) {
      var lons = []; for (var j = 1; j <= n; j++) lons.push(AS.longitude(p, jourUTC(annee, mois, j)));
      cibles.forEach(function (c) {
        var lc = natal.planetes[c].lon;
        ASPECTS.forEach(function (as) {
          var best = 99, jour = 0;
          lons.forEach(function (l, i) { var o = Math.abs(ecart(l, lc) - as[1]); if (o < best) { best = o; jour = i + 1; } });
          if (best <= LENTES[p]) out.push({ planete: p, cible: c, aspect: as[0], orbe: best, jour: annee + '-' + String(mois).padStart(2, '0') + '-' + String(jour).padStart(2, '0'), exact: best < 0.35 });
        });
      });
    });
    return out.sort(function (a, b) { return a.orbe - b.orbe; });
  }

  function mercure(annee, mois) {
    var n = nbJours(annee, mois), prev = AS.longitude('mercure', jourUTC(annee, mois, 0)), retro = [], stations = [];
    var avant = null;
    for (var j = 1; j <= n; j++) {
      var l = AS.longitude('mercure', jourUTC(annee, mois, j)), v = ((l - prev + 540) % 360) - 180, r = v < 0;
      if (r) retro.push(j);
      if (avant !== null && r !== avant) stations.push({ jour: j, type: r ? 'debut' : 'fin' });
      avant = r; prev = l;
    }
    if (!retro.length) return null;
    return { jours: retro.length, debut: retro[0], fin: retro[retro.length - 1], stations: stations };
  }

  function maya(annee, mois, dateNaiss) {
    if (!MY) return null;
    var natal = MY.calculer(dateNaiss), n = nbJours(annee, mois), jours = [], anniv = null;
    for (var j = 1; j <= n; j++) {
      var ds = annee + '-' + String(mois).padStart(2, '0') + '-' + String(j).padStart(2, '0'), r = MY.calculer(ds);
      if (r.signe === natal.signe) { jours.push({ jour: ds, nombre: r.nombre }); if (r.kin === natal.kin) anniv = ds; }
    }
    return { natal: natal, jours: jours, anniversaire: anniv };
  }

  function famille(arbre, annee, mois, age) {
    if (!arbre || !arbre.people) return null;
    var out = { dates: [], echos: [] }, mm = String(mois).padStart(2, '0');
    Object.keys(arbre.people).forEach(function (id) {
      var p = arbre.people[id]; if (!p || p.role === 'moi') return;
      var nom = [p.prenom, p.nom].filter(Boolean).join(' ') || p.role || 'Une personne de ta famille';
      [['naiss', 'Naissance'], ['deces', 'Départ']].forEach(function (k) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p[k[0]] || '');
        if (m && m[2] === mm) out.dates.push({ jour: annee + '-' + mm + '-' + m[3], quoi: k[1] + ' de ' + nom, il_y_a: annee - +m[1] });
      });
      (p.events || []).forEach(function (e) { if (age != null && +e.age === age) out.echos.push({ nom: nom, type: e.type, annee: e.year }); });
    });
    out.dates.sort(function (a, b) { return a.jour < b.jour ? -1 : 1; });
    return out;
  }

  function calculer(profil, annee, mois, arbre) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(profil.date || ''); if (!m) return null;
    var J = +m[3], M = +m[2], tz = profil.tz || 'Europe/Paris';
    var natal = AS.calculer({ date: profil.date, heure: profil.heure || '', lat: profil.lat, lon: profil.lon, tz: tz });
    var ap = N.anneePerso(J, M, annee), mp = N.reduire(ap + mois, false);
    var milieu = jourUTC(annee, mois, 15);
    var ref = new Date(Date.UTC(annee, mois - 1, 15)), age = annee - +m[1] - ((mois < M || (mois === M && 15 < J)) ? 1 : 0);
    var r = {
      annee: annee, mois: mois, prenom: profil.prenom || '', natal: natal, maisons: !!natal.cuspides,
      anneePerso: ap, moisPerso: mp, age: age,
      lunaisons: lunaisons(annee, mois, natal, tz),
      eclipses: eclipses(annee, mois, tz),
      jupiter: place(AS.longitude('jupiter', milieu), natal),
      saturne: place(AS.longitude('saturne', milieu), natal),
      aspects: aspects(annee, mois, natal),
      mercure: mercure(annee, mois),
      maya: maya(annee, mois, profil.date),
      famille: famille(arbre, annee, mois, age)
    };
    // dates clés, dans l'ordre
    var d = [];
    r.lunaisons.forEach(function (l) { d.push({ jour: l.jour, quoi: (l.type === 'nouvelle' ? 'Nouvelle lune' : 'Pleine lune') + ' en ' + nomSigne(l.signe) + (l.maison ? ', dans ta maison ' + l.maison : '') }); });
    r.eclipses.forEach(function (e) { d.push({ jour: e.jour, quoi: 'Éclipse ' + e.type }); });
    r.aspects.slice(0, 4).forEach(function (a) { d.push({ jour: a.jour, quoi: nomPlanete(a.planete) + ' ' + nomAspect(a.aspect) + ' ' + (a.cible === 'soleil' ? 'à ton Soleil' : 'à ta Lune') }); });
    if (r.mercure) r.mercure.stations.forEach(function (s) { d.push({ jour: annee + '-' + String(mois).padStart(2, '0') + '-' + String(s.jour).padStart(2, '0'), quoi: s.type === 'debut' ? 'Mercure commence sa marche rétrograde' : 'Mercure reprend sa marche directe' }); });
    if (r.maya) { r.maya.jours.forEach(function (x) { d.push({ jour: x.jour, quoi: 'Jour de ton signe maya' + (x.jour === r.maya.anniversaire ? ' : ton anniversaire maya' : '') }); }); }
    if (r.famille) r.famille.dates.forEach(function (x) { d.push({ jour: x.jour, quoi: x.quoi + ' (il y a ' + x.il_y_a + ' ans)', famille: true }); });
    r.dates = d.sort(function (a, b) { return a.jour < b.jour ? -1 : a.jour > b.jour ? 1 : 0; });
    return r;
  }

  var NOMS_SIGNES = { belier: 'Bélier', taureau: 'Taureau', gemeaux: 'Gémeaux', cancer: 'Cancer', lion: 'Lion', vierge: 'Vierge', balance: 'Balance', scorpion: 'Scorpion', sagittaire: 'Sagittaire', capricorne: 'Capricorne', verseau: 'Verseau', poissons: 'Poissons' };
  var NOMS_PLANETES = { jupiter: 'Jupiter', saturne: 'Saturne', uranus: 'Uranus', neptune: 'Neptune', pluton: 'Pluton' };
  var NOMS_ASPECTS = { conjonction: 'en conjonction', trigone: 'en trigone', carre: 'en carré', opposition: 'en opposition' };
  function nomSigne(s) { return NOMS_SIGNES[s] || s; }
  function nomPlanete(p) { return NOMS_PLANETES[p] || p; }
  function nomAspect(a) { return NOMS_ASPECTS[a] || a; }

  window.Guide = { calculer: calculer, nomSigne: nomSigne, nomPlanete: nomPlanete, nomAspect: nomAspect };
})();
