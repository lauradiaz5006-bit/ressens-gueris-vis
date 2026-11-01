/* Genesolia · Tes dates clés de l'année (aimant gratuit contre l'e-mail).
   Fenêtre : prénom, date de naissance (heure et ville en option), e-mail, accord.
   Calcul sur l'appareil (transits de Jupiter à Pluton sur le thème, éclipses, Mercure rétrograde, anniversaire, année personnelle),
   téléchargement d'un fichier agenda (.ics), puis envoi à la fonction Supabase « dates-cles » qui prépare les mails
   (les dates tout de suite, puis un rappel 3 jours avant chaque période). Les textes : assets/dates-cles-textes.json.
   Ouvre avec n'importe quel élément [data-dates-cles], ou GenesoliaDatesCles.ouvrir(). */
(function () {
  'use strict';
  if (window.GenesoliaDatesCles) return;
  var FN = 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/dates-cles';
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var LENTES = { jupiter: 2, saturne: 2, uranus: 1.5, neptune: 1.5, pluton: 1.5 };
  var P_PL = { jupiter: 5, saturne: 5, pluton: 3, uranus: 3, neptune: 2 }, P_PT = { soleil: 5, venus: 5, asc: 4, mc: 4, lune: 4, mars: 3, mercure: 2 };
  var ASPECTS = [[0, 'conj', 3], [60, 'harm', 1], [90, 'tens', 2], [120, 'harm', 2], [180, 'tens', 2]];
  var TEXTES = null, VILLES = null, VTZ = {};

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function script(src) { return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); }
  function prets() {
    var p = [];
    if (!TEXTES) p.push(fetch('assets/dates-cles-textes.json').then(function (r) { return r.json(); }).then(function (j) { TEXTES = j; }));
    var a = window.Astronomy ? Promise.resolve() : script('assets/astronomy.browser.min.js');
    p.push(a.then(function () { return window.Astrologie ? null : script('assets/astrologie.js'); }));
    return Promise.all(p);
  }
  function villes() {
    if (VILLES) return Promise.resolve(VILLES);
    return fetch('assets/villes.json').then(function (r) { return r.json(); }).then(function (d) {
      VTZ = d.tz; VILLES = d.v.map(function (v) { return { n: v[0], k: cle(v[0]), lat: v[1], lon: v[2], cc: v[3], adm: v[4] || '' }; }); return VILLES;
    });
  }
  function cle(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function iso(d) { return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2); }
  function jour(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)); }
  function joli(s) { var d = jour(s), n = d.getUTCDate(); return (n === 1 ? '1er' : n) + ' ' + MOIS[d.getUTCMonth()]; }
  function plage(it) { return it.d === it.f ? 'Le ' + joli(it.d) : 'Du ' + joli(it.d) + ' au ' + joli(it.f); }
  function anneeVisee() { var n = new Date(); return n.getMonth() >= 9 ? n.getFullYear() + 1 : n.getFullYear(); }
  function reduire(n) { while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + +b; }, 0); return n; }
  function cielLien(s, an) { var d = jour(s), m = d.getUTCMonth() + 1, y = d.getUTCFullYear(); return (y === 2026 && m >= 10) || (y === 2027 && m <= 9) ? 'ciel-' + cle(MOIS[m - 1]).replace(/ /g, '') + '-' + y + '.html' : 'theme-astral.html'; }

  /* ───── Le calcul ───── */
  function calculer(e) {
    var A = window.Astrologie, Y = e.annee, theme = A.calculer({ date: e.date, heure: e.heure || '', tz: e.tz || 'Europe/Paris', lat: e.lat, lon: e.lon });
    var pts = { soleil: theme.planetes.soleil.lon, mercure: theme.planetes.mercure.lon, venus: theme.planetes.venus.lon, mars: theme.planetes.mars.lon };
    if (theme.heureConnue) pts.lune = theme.planetes.lune.lon;
    if (theme.asc) { pts.asc = theme.asc.lon; pts.mc = theme.mc.lon; }
    var debut = Date.UTC(Y, 0, 1, 12), nb = Math.round((Date.UTC(Y + 1, 0, 1, 12) - debut) / 864e5), pos = {}, items = [];
    Object.keys(LENTES).concat(['mercure']).forEach(function (pl) { pos[pl] = []; for (var i = 0; i < nb; i++) pos[pl].push(A.longitude(pl, new Date(debut + i * 864e5))); });
    function dist(a, b) { return Math.abs(((a - b + 540) % 360) - 180); }
    /* transits lents : jours dans l'orbe, regroupés en périodes (écart de moins de 20 jours = même période) */
    Object.keys(LENTES).forEach(function (pl) {
      Object.keys(pts).forEach(function (pt) {
        ASPECTS.forEach(function (as) {
          if (as[0] === 60 && pl !== 'jupiter' && pl !== 'saturne') return;
          var per = [], cur = null;
          for (var i = 0; i < nb; i++) {
            var dd = Math.min(dist(pos[pl][i], pts[pt] + as[0]), as[0] && as[0] !== 180 ? dist(pos[pl][i], pts[pt] - as[0]) : 999);
            if (dd <= LENTES[pl]) { if (cur && i - cur[1] <= 20) cur[1] = i; else { cur = [i, i]; per.push(cur); } }
          }
          per.forEach(function (p) {
            items.push({ k: 'transit:' + pl + '-' + pt + '-' + as[1], d: iso(new Date(debut + p[0] * 864e5)), f: iso(new Date(debut + p[1] * 864e5)), s: P_PL[pl] * P_PT[pt] * as[2] });
          });
        });
      });
    });
    items.sort(function (a, b) { return b.s - a.s; });
    items = items.slice(0, 16);
    /* éclipses proches d'un point personnel */
    try {
      var Ast = window.Astronomy, t0 = Ast.MakeTime(new Date(Date.UTC(Y, 0, 1))), fin = Date.UTC(Y + 1, 0, 1), ecl = [];
      for (var l = Ast.SearchLunarEclipse(t0); l.peak.date.getTime() < fin; l = Ast.NextLunarEclipse(l.peak)) ecl.push([l.peak.date, A.longitude('lune', l.peak.date)]);
      for (var s = Ast.SearchGlobalSolarEclipse(t0); s.peak.date.getTime() < fin; s = Ast.NextGlobalSolarEclipse(s.peak)) ecl.push([s.peak.date, A.longitude('soleil', s.peak.date)]);
      ecl.forEach(function (x) {
        ['soleil', 'lune', 'asc', 'mc'].some(function (pt) {
          if (pts[pt] == null || Math.min(dist(x[1], pts[pt]), dist(x[1], pts[pt] + 180)) > 4) return false;
          var t = x[0].getTime(); items.push({ k: 'eclipse:' + pt, d: iso(new Date(Math.max(t - 3 * 864e5, debut))), f: iso(new Date(Math.min(t + 7 * 864e5, fin - 864e5))) }); return true;
        });
      });
    } catch (er) {}
    /* Mercure rétrograde (pour tout le monde, mais utile dans l'agenda) */
    var r0 = -1;
    for (var i = 1; i < nb; i++) {
      var retro = ((pos.mercure[i] - pos.mercure[i - 1] + 540) % 360) - 180 < 0;
      if (retro && r0 < 0) r0 = i;
      if ((!retro || i === nb - 1) && r0 >= 0) { items.push({ k: 'mercure', d: iso(new Date(debut + r0 * 864e5)), f: iso(new Date(debut + (i - 1) * 864e5)) }); r0 = -1; }
    }
    var dn = e.date.split('-'), anniv = Y + '-' + dn[1] + '-' + dn[2];
    if (dn[1] === '02' && dn[2] === '29' && Y % 4) anniv = Y + '-02-28';
    items.push({ k: 'anniversaire', d: anniv, f: anniv });
    var ap = reduire(+dn[2] + +dn[1] + String(Y).split('').reduce(function (a, b) { return a + +b; }, 0));
    items.push({ k: 'annee:' + ap, d: Y + '-01-01', f: Y + '-01-01' });
    items.sort(function (a, b) { var x = a.k.indexOf('annee') === 0 ? -1 : 0, y = b.k.indexOf('annee') === 0 ? -1 : 0; return x - y || (a.d < b.d ? -1 : a.d > b.d ? 1 : 0); });
    return { annee: Y, ap: ap, heure: theme.heureConnue, asc: !!theme.asc, items: items.map(function (x) { return { k: x.k, d: x.d, f: x.f }; }) };
  }
  /* Texte d'une date : { t, p, l } */
  function texte(it) {
    var k = it.k.split(':'), T = TEXTES, x;
    if (k[0] === 'transit') x = T.transits[k[1]];
    else if (k[0] === 'eclipse') x = T.eclipses[k[1]];
    else if (k[0] === 'annee') { var a = T.annee[k[1]]; x = { t: 'Ton année ' + k[1] + ' : ' + a[0].charAt(0).toLowerCase() + a[0].slice(1), p: a[1], l: 'annee-personnelle-' + k[1] + '-en-' + it.d.slice(0, 4) + '.html' }; }
    else x = T[k[0]];
    x = x || { t: 'Date clé', p: '', l: 'theme-astral.html' };
    return { t: x.t, p: x.p, l: x.l === 'ciel' ? cielLien(it.d) : x.l };
  }

  /* ───── Le fichier agenda ───── */
  function ics(r, prenom) {
    function d8(s) { return s.replace(/-/g, ''); }
    function lendemain(s) { return iso(new Date(jour(s).getTime() + 864e5)); }
    function plie(s) { return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
    var st = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    var l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Genesolia//Dates cles//FR', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Mes dates clés ' + r.annee + ' · Genesolia'];
    r.items.forEach(function (it, n) {
      var x = texte(it);
      l.push('BEGIN:VEVENT', 'UID:dates-cles-' + r.annee + '-' + n + '-' + d8(it.d) + '@genesolia.fr', 'DTSTAMP:' + st, 'DTSTART;VALUE=DATE:' + d8(it.d), 'DTEND;VALUE=DATE:' + d8(lendemain(it.f)),
        'SUMMARY:' + plie(x.t + ' · Genesolia'), 'DESCRIPTION:' + plie(x.p + '\n\nPour aller plus loin : https://genesolia.fr/' + x.l), 'TRANSP:TRANSPARENT', 'END:VEVENT');
    });
    l.push('END:VCALENDAR');
    return l.join('\r\n');
  }
  function telecharger(r) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics(r)], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'mes-dates-cles-' + r.annee + '-genesolia.ics'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function liste(r) {
    return '<ol class="dk-liste">' + r.items.map(function (it) { var x = texte(it); return '<li><span>' + plage(it) + '</span><b>' + esc(x.t) + '</b>' + esc(x.p) + ' <a href="' + esc(x.l) + '">Aller plus loin</a></li>'; }).join('') + '</ol>';
  }

  /* ───── La fenêtre ───── */
  var CSS = '.dk-carte{width:min(30rem,100%);max-height:92vh;overflow:auto;text-align:left}.dk-carte h2{text-align:center}.dk-carte .dk-sous{text-align:center;margin:-.4rem 0 1rem;color:var(--prune-doux)}' +
    '.dk-f{display:grid;gap:.7rem}.dk-f label{display:grid;gap:.25rem;font-weight:600;font-size:.95rem}.dk-f label small{font-weight:400;color:var(--prune-doux)}' +
    '.dk-f input[type=text],.dk-f input[type=email],.dk-f input[type=date],.dk-f input[type=time]{border:1px solid var(--rose-fonce);border-radius:12px;padding:.7rem .9rem;font:inherit;color:var(--prune);background:#fff;width:100%;box-sizing:border-box}' +
    '.dk-deux{display:grid;grid-template-columns:1fr 1.4fr;gap:.6rem}.dk-f .dk-accord{display:flex;gap:.5rem;align-items:flex-start;font-weight:400;font-size:.85rem;grid-template-columns:none}.dk-accord input{margin-top:.2rem}' +
    '.dk-err{color:#A3324A;font-weight:600;margin:0;min-height:1.2em;font-size:.92rem}.dk-f .btn{width:100%;justify-content:center}' +
    '.dk-liste{list-style:none;margin:1rem 0;padding:0;display:grid;gap:.7rem}.dk-liste li{background:#fff;border:1px solid var(--rose);border-radius:14px;padding:.8rem 1rem;line-height:1.5;font-size:.95rem}' +
    '.dk-liste span{display:block;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:#A9773F;font-weight:700}.dk-liste b{display:block;font-family:var(--display);font-weight:400;font-size:1.15rem}.dk-liste a{color:var(--prune);font-weight:600}' +
    '.dk-ok{text-align:center}.dk-ok .btn{margin:.4rem auto}';
  function ouvrir() {
    if (!document.getElementById('dk-css')) { var st = document.createElement('style'); st.id = 'dk-css'; st.textContent = CSS; document.head.appendChild(st); }
    var an = anneeVisee(), f = document.createElement('div');
    f.className = 'appli-fenetre'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', 'Tes dates clés ' + an);
    f.innerHTML = '<div class="appli-carte dk-carte"><button type="button" class="appli-fermer" aria-label="Fermer">×</button>' +
      '<img src="/assets/icones/icone-192.png" alt="" width="64" height="64"><h2>Tes dates clés ' + an + '</h2>' +
      '<p class="dk-sous">Tes périodes de l’année, calculées pour toi, avec leur phrase clé. À mettre dans ton agenda en un clic. Offert.</p>' +
      '<form class="dk-f" novalidate><label>Ton prénom<input type="text" name="prenom" autocomplete="given-name" maxlength="60" required></label>' +
      '<label>Ta date de naissance<input type="date" name="date" min="1920-01-01" max="' + (new Date().getFullYear()) + '-12-31" required></label>' +
      '<div class="dk-deux"><label>Ton heure <small>(si tu la connais)</small><input type="time" name="heure"></label>' +
      '<label>Ta ville de naissance <small>(avec l’heure)</small><input type="text" name="ville" list="dk-villes" autocomplete="off" placeholder="Lyon, Bruxelles…"></label></div><datalist id="dk-villes"></datalist>' +
      '<label>Ton e-mail<input type="email" name="email" autocomplete="email" required></label>' +
      '<label class="dk-accord"><input type="checkbox" name="accord" required><span>J’accepte de recevoir mes dates clés et les e-mails de Genesolia qui les accompagnent (un petit rappel avant chaque période). Je peux me désinscrire à tout moment. <a href="confidentialite.html">Mes données</a></span></label>' +
      '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">' +
      '<p class="dk-err" role="alert"></p><button class="btn btn-plein" type="submit">Recevoir mes dates clés</button>' +
      '<p class="a-mini" style="margin:0;font-size:.8rem;color:var(--prune-doux)">Le calcul se fait sur ton appareil. Avec ton heure et ta ville, tes dates sont encore plus précises.</p></form></div>';
    document.body.appendChild(f);
    var fo = f.querySelector('form'), err = f.querySelector('.dk-err'), dl = f.querySelector('#dk-villes');
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('.appli-fermer')) f.remove(); });
    fo.ville.addEventListener('focus', function () { villes().catch(function () {}); }, { once: true });
    fo.ville.addEventListener('input', function () {
      if (!VILLES) return; var q = cle(this.value); if (q.length < 2) return;
      dl.innerHTML = VILLES.filter(function (v) { return v.k.indexOf(q) === 0; }).slice(0, 8).map(function (v) { return '<option value="' + esc(v.n + (v.adm ? ' (' + v.adm + ')' : '') + ' · ' + v.cc) + '">'; }).join('');
    });
    prets().catch(function () {});
    fo.prenom.focus();
    fo.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (fo._gotcha.value) return;
      var prenom = fo.prenom.value.trim(), email = fo.email.value.trim(), date = fo.date.value, heure = fo.heure.value, ville = fo.ville.value.trim(), lieu = null;
      if (!prenom) { err.textContent = 'Indique ton prénom.'; return; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = 'Indique ta date de naissance.'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Vérifie ton adresse e-mail.'; return; }
      if (!fo.accord.checked) { err.textContent = 'Coche la case pour recevoir tes dates.'; return; }
      if (heure && ville && VILLES) {
        var m = ville.match(/^(.*?)(?: \((.*)\))? · ([A-Z]{2})$/), k = cle(m ? m[1] : ville);
        lieu = VILLES.filter(function (v) { return v.k === k && (!m || v.cc === m[3]) && (!m || !m[2] || v.adm === m[2]); })[0] || VILLES.filter(function (v) { return v.k === k; })[0] || null;
      }
      err.textContent = ''; var bt = fo.querySelector('button'); bt.disabled = true; bt.textContent = 'Calcul de tes dates…';
      prets().then(function () {
        var e = { date: date, heure: heure, annee: an, tz: lieu ? (VTZ[lieu.cc] || 'Europe/Paris') : 'Europe/Paris', lat: lieu ? lieu.lat : undefined, lon: lieu ? lieu.lon : undefined };
        var r = calculer(e);
        telecharger(r);
        envoyer({ email: email, prenom: prenom, accord: true, annee: r.annee, ap: r.ap, items: r.items, lien: lienRetour(e) }, prenom, email);
        try { localStorage.setItem('genesolia-dates-cles', JSON.stringify({ a: r.annee, t: Date.now() })); } catch (x) {}
        if (window.umami) try { window.umami.track('dates-cles', { heure: r.heure ? 'oui' : 'non' }); } catch (x) {}
        f.querySelector('.dk-carte').innerHTML = '<button type="button" class="appli-fermer" aria-label="Fermer">×</button><div class="dk-ok"><img src="/assets/icones/icone-192.png" alt="" width="64" height="64">' +
          '<h2>' + esc(prenom) + ', tes dates clés ' + r.annee + '</h2><p>Ton fichier agenda se télécharge : ouvre-le, et toutes tes périodes s’ajoutent à ton calendrier. Tu les reçois aussi par e-mail.</p>' +
          '<button class="btn btn-plein" type="button" data-dk-re>Télécharger à nouveau</button></div>' + liste(r) +
          (r.asc ? '' : '<p class="dk-sous" style="font-size:.9rem">Avec ton heure et ta ville de naissance, tu aurais aussi les dates liées à ta Lune, ton ascendant et ta vocation.</p>') +
          '<div class="dk-ok"><p>Pour vivre ces périodes pas à pas, Le Cercle t’accompagne toute l’année.</p><a class="btn btn-trait" href="abonnement.html">Découvrir Le Cercle, 1<sup>er</sup> mois offert</a></div>';
        f.querySelector('[data-dk-re]').addEventListener('click', function () { telecharger(r); });
      }).catch(function () { bt.disabled = false; bt.textContent = 'Recevoir mes dates clés'; err.textContent = 'Le calcul n’a pas fonctionné. Réessaie dans un instant.'; });
    });
  }
  /* Lien du mail pour retélécharger l'agenda (les données de naissance restent dans le lien, rien n'est gardé ailleurs) */
  function lienRetour(e) { return 'https://genesolia.fr/dates-cles.html#' + btoa(JSON.stringify({ d: e.date, h: e.heure || '', z: e.tz, a: e.lat, o: e.lon, y: e.annee })); }
  function envoyer(corps, prenom, email) {
    fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) })
      .then(function (r) { if (!r.ok) throw new Error('fn'); })
      .catch(function () { /* fonction pas encore en place : la demande est au moins rangée dans « demandes » */
        if (window.GenesoliaEnvoyer) window.GenesoliaEnvoyer('Dates clés ' + corps.annee, { prenom: prenom, email: email, annee: String(corps.annee), lien: corps.lien }, '').catch(function () {});
      });
  }
  /* Page dates-cles.html : retélécharger depuis le lien du mail */
  function depuisLien(zone) {
    var e; try { var j = JSON.parse(atob(location.hash.slice(1))); e = { date: j.d, heure: j.h, tz: j.z, lat: j.a, lon: j.o, annee: j.y }; } catch (x) { e = null; }
    if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.date || '')) { zone.innerHTML = '<p>Ce lien n’est pas complet. <button class="btn btn-plein" type="button" data-dates-cles>Calculer mes dates clés</button></p>'; return; }
    prets().then(function () {
      var r = calculer(e);
      zone.innerHTML = '<p><button class="btn btn-plein" type="button" data-dk-dl>Ajouter mes dates à mon agenda</button></p>' + liste(r);
      if (!document.getElementById('dk-css')) { var st = document.createElement('style'); st.id = 'dk-css'; st.textContent = CSS; document.head.appendChild(st); }
      zone.querySelector('[data-dk-dl]').addEventListener('click', function () { telecharger(r); });
    });
  }
  window.GenesoliaDatesCles = { ouvrir: ouvrir, depuisLien: depuisLien, calculer: calculer, texte: texte, prets: prets };
})();
