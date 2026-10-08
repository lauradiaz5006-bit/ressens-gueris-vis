/* Genesolia · livret de l'arbre de vie (une vingtaine de pages, créé sur l'appareil de la personne)
   LivretArbre.imprimer({ score, cycles, spheres: SPHERES, groupes: GROUPES, svg, prenom }, bouton) */
(function () {
  'use strict';
  var MOBILE = /iphone|ipad|ipod|android/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var ORDRE = ['malkhout', 'yessod', 'hod', 'netsah', 'tiferet', 'guevoura', 'hessed', 'bina', 'hokhma', 'keter'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function niveau(s) { return s < 45 ? 'nourrir' : s < 70 ? 'mouvement' : 'lumineuse'; }
  var NIV = { nourrir: 'À nourrir', mouvement: 'En mouvement', lumineuse: 'Lumineuse' };
  function charger() {
    if (window.LIVRET_ARBRE) return Promise.resolve();
    return new Promise(function (ok) { var sc = document.createElement('script'); sc.src = 'assets/livret-arbre-textes.js?v=1'; sc.onload = ok; sc.onerror = ok; document.head.appendChild(sc); });
  }
  function css() {
    return '@font-face{font-family:"Gilda Display";src:url(assets/polices/gilda-display-latin-400-normal.woff2) format("woff2")}' +
      '@font-face{font-family:"Nunito Sans";font-weight:400;src:url(assets/polices/nunito-sans-latin-400-normal.woff2) format("woff2")}' +
      '@font-face{font-family:"Nunito Sans";font-weight:600;src:url(assets/polices/nunito-sans-latin-600-normal.woff2) format("woff2")}' +
      '@page{size:A4;margin:15mm 12mm 17mm}*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      'body{font:400 10.6pt/1.68 "Nunito Sans",system-ui,sans-serif;color:#4A2340;background:#fff;padding:0 6mm}' +
      'h1,h2,h3{font-family:"Gilda Display",Georgia,serif;font-weight:400;color:#6B2F5B;line-height:1.2}h2{font-size:21pt;margin-bottom:3mm}h3{font-size:13.5pt;margin:0 0 1.5mm}' +
      'p{margin-bottom:3.4mm}b{font-weight:600}.page{page-break-after:always;break-after:page;padding-top:4mm}.page:last-child{page-break-after:auto}' +
      '.sur{font:600 7.6pt/1 "Nunito Sans";letter-spacing:.16em;text-transform:uppercase;color:#B98A55;margin-bottom:2.5mm}.intro{color:#8E6383;font-size:9.8pt}' +
      '.bloc{border:1px solid #EBCFD5;border-radius:4mm;padding:4.5mm 5mm;margin-bottom:4mm;break-inside:avoid}.bloc p:last-child{margin-bottom:0}.doux{background:#FFF6F3}.or{background:#FBF0E4;border-color:#F3DCC0}' +
      '.couv{height:255mm;display:flex;flex-direction:column;justify-content:space-between;border-radius:6mm;padding:16mm 14mm;color:#fff;background:radial-gradient(120mm 90mm at 85% 8%,rgba(243,220,192,.55),transparent 60%),linear-gradient(160deg,#3A1745,#6B2F5B 60%,#8E4A7B)}' +
      '.couv h1{color:#fff;font-size:34pt;margin:4mm 0 5mm}.couv .sur{color:#F3DCC0}.couv p{color:#F7E6E8;font-size:11pt}.couv .marque{font:400 15pt "Gilda Display"}.couv svg{width:70mm;height:auto;align-self:center;background:#fff;border-radius:6mm;padding:4mm}' +
      '.jauge{height:3mm;border-radius:2mm;background:#F6E3E6;overflow:hidden;margin:1mm 0 2mm}.jauge i{display:block;height:100%;background:linear-gradient(90deg,#E7A79E,#B98A55)}' +
      '.ligne{display:grid;grid-template-columns:32mm 1fr 12mm;gap:3mm;align-items:center;font-size:9.6pt;padding:1.2mm 0;border-bottom:1px dotted #EBCFD5}.ligne b{text-align:right}' +
      '.niv{display:inline-block;font:600 7.6pt/1 "Nunito Sans";letter-spacing:.08em;text-transform:uppercase;padding:1.2mm 2.4mm;border-radius:10mm;background:#F3DCC0;color:#6B2F5B}.niv.nourrir{background:#F6E3E6}.niv.lumineuse{background:#E8C899}' +
      '.tete{display:flex;justify-content:space-between;align-items:baseline;gap:4mm;border-bottom:1px solid #EBCFD5;padding-bottom:2mm;margin-bottom:3mm}.tete h2{margin:0}.score{font:400 26pt/1 "Gilda Display";color:#B98A55}' +
      'ul.q{list-style:none;margin:1mm 0 0}ul.q li{border-left:2.5px solid #B98A55;padding:1mm 0 1mm 3.5mm;margin-bottom:2mm;color:#6B2F5B}' +
      '.phrase{font:400 14pt/1.35 "Gilda Display";color:#A4473D;text-align:center;padding:3mm 6mm}' +
      '.notes{border:1px solid #EBCFD5;border-radius:3mm;height:42mm;margin-top:2mm;background:repeating-linear-gradient(#fff 0 7.5mm,#F3E3E7 7.5mm 7.8mm)}' +
      '.sem{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.sem .bloc{margin:0}.jours{display:grid;grid-template-columns:repeat(7,1fr);gap:1.5mm;margin-top:2mm}.jours span{border:1px solid #EBCFD5;border-radius:2mm;height:12mm;font-size:7pt;color:#8E6383;padding:1mm;text-align:center}' +
      '.barre-livret{display:none}@media screen{body{max-width:200mm;margin:0 auto}.barre-livret{display:flex;position:sticky;top:0;z-index:9;gap:.6rem;align-items:center;justify-content:space-between;padding:.7rem 1rem;background:#6B2F5B;color:#fff;font:600 14px sans-serif;margin:0 -6mm 4mm}.barre-livret button{border:0;border-radius:99px;padding:.55rem 1rem;background:#F3DCC0;color:#6B2F5B;font:700 14px sans-serif}}';
  }
  function html(d) {
    var T = window.LIVRET_ARBRE, S = d.spheres, sc = d.score, cy = d.cycles, auj = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    var tri = Object.keys(sc).sort(function (a, b) { return sc[a] - sc[b]; });
    var aNourrir = tri.filter(function (s) { return sc[s] < 70; }).slice(0, 3); if (!aNourrir.length) aNourrir = tri.slice(0, 1);
    var lum = tri.filter(function (s) { return sc[s] >= 70; }).reverse();
    var p = '';
    /* Couverture */
    p += '<section class="page"><div class="couv"><div><p class="marque">Genesolia</p><p class="sur" style="margin-top:10mm">Livret de l’arbre de vie</p><h1>' + (d.prenom ? 'L’arbre de vie de ' + esc(d.prenom) : 'Ton arbre de vie') + '</h1><p>Ta photographie du ' + esc(auj) + ' · dix sphères, trois cycles, un chemin.</p></div>' + (d.svg || '') + '<p class="pied" style="font-size:8.6pt;color:#EBCFD5">Lecture symbolique pour réfléchir à ton histoire. Elle ne remplace pas un accompagnement professionnel.</p></div></section>';
    /* Sommaire + origine */
    p += '<section class="page"><p class="sur">Avant de commencer</p><h2>D’où vient l’arbre de vie</h2>' + T.origine.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') +
      '<h2 style="margin-top:6mm">Comment lire ton arbre</h2>' + T.lire.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') + '</section>';
    /* Vue d'ensemble */
    p += '<section class="page"><p class="sur">Ta vue d’ensemble</p><h2>Ton arbre aujourd’hui</h2>' +
      '<div class="bloc or"><h3>Tes trois cycles</h3>' + [['racine', 'Cycle 1 · La racine'], ['coeur', 'Cycle 2 · Le cœur'], ['elan', 'L’élan']].map(function (g) { return '<div class="ligne"><span>' + g[1] + '</span><div class="jauge"><i style="width:' + Math.max(4, cy[g[0]] || 0) + '%"></i></div><b>' + (cy[g[0]] || 0) + '</b></div>'; }).join('') +
      '<p style="margin-top:3mm">' + ((cy.racine || 0) <= (cy.coeur || 0) ? 'Ton cycle à regarder en premier est celui de la <b>racine</b> : ta sécurité, ta place, ce qui te fait tenir debout.' : 'Ton cycle à regarder en premier est celui du <b>cœur</b> : ta façon d’aimer, de donner et de poser tes limites.') + '</p></div>' +
      '<div class="bloc"><h3>Tes dix sphères</h3>' + ORDRE.slice().reverse().map(function (k) { return '<div class="ligne"><span>' + esc(S[k].nom) + '</span><div class="jauge"><i style="width:' + Math.max(4, sc[k]) + '%"></i></div><b>' + sc[k] + '</b></div>'; }).join('') + '</div>' +
      '<div class="bloc doux"><h3>Ce qui ressort</h3><p><b>À nourrir en premier :</b> ' + aNourrir.map(function (k) { return esc(S[k].nom); }).join(', ') + '.</p><p><b>Tes ressources :</b> ' + (lum.length ? lum.map(function (k) { return esc(S[k].nom); }).join(', ') + '. Appuie-toi sur elles pour nourrir les autres.' : 'aucune sphère n’est encore pleinement lumineuse, c’est fréquent en période de changement.') + '</p></div></section>';
    /* Piliers */
    var pil = T.piliers, moyP = function (l) { return Math.round(l.reduce(function (t, k) { return t + (sc[k] || 0); }, 0) / l.length); };
    p += '<section class="page"><p class="sur">Ton équilibre</p><h2>Les trois piliers</h2><p>' + esc(pil.intro) + '</p>' + ['gauche', 'centre', 'droite'].map(function (c) {
      var x = pil[c], m = moyP(x.spheres);
      return '<div class="bloc"><h3>' + esc(x.nom) + ' · ' + m + '</h3><div class="jauge"><i style="width:' + Math.max(4, m) + '%"></i></div><p style="font-size:9pt;color:#8E6383">' + x.spheres.map(function (k) { return esc(S[k].nom); }).join(', ') + '</p><p>' + esc(x.texte) + '</p></div>';
    }).join('');
    var g = moyP(pil.gauche.spheres), dr = moyP(pil.droite.spheres);
    p += '<div class="bloc or"><p>' + (Math.abs(g - dr) < 10 ? 'Tes piliers de la structure et de l’élan sont proches : un bel équilibre entre te protéger et te lancer.' : g > dr ? 'Ton pilier de la structure domine : tu te protèges bien, au risque parfois de te retenir. Tes sphères de l’élan demandent à être encouragées.' : 'Ton pilier de l’élan domine : tu donnes et tu avances, au risque parfois de t’épuiser. Tes sphères de la structure t’aideront à te préserver.') + '</p></div></section>';
    /* Une page par sphère */
    ORDRE.forEach(function (k) {
      var s = S[k], t = T.spheres[k], n = niveau(sc[k]);
      p += '<section class="page"><p class="sur">' + esc(d.groupes[s.groupe] || '') + '</p><div class="tete"><h2>' + esc(s.nom) + '</h2><span class="score">' + sc[k] + '</span></div>' +
        '<p><span class="niv ' + n + '">' + NIV[n] + '</span> &nbsp;<b>' + esc(s.theme) + '</b></p><p>' + esc(t.sens) + '</p>' +
        '<div class="bloc ' + (n === 'nourrir' ? 'doux' : 'or') + '"><h3>Pour toi aujourd’hui</h3><p>' + esc(n === 'nourrir' ? s.nourrir : t[n]) + '</p><p><b>La question :</b> « ' + esc(s.q) + ' »</p></div>' +
        '<div class="bloc"><h3>Dans ta famille</h3><ul class="q">' + t.famille.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="bloc"><h3>À faire cette semaine</h3><p>' + esc(t.exercice) + '</p></div>' +
        '<p class="phrase">« ' + esc(t.phrase) + ' »</p><p class="sur" style="margin-top:2mm">Tes notes</p><div class="notes"></div></section>';
    });
    /* Plan de quatre semaines */
    var cible = S[aNourrir[0]];
    p += '<section class="page"><p class="sur">Ton mois</p><h2>Quatre semaines avec ' + esc(cible.nom) + '</h2><p class="intro">La sphère à nourrir en premier. Un petit pas par jour, une semaine après l’autre.</p><div class="sem">' +
      T.semaines.map(function (w) { return '<div class="bloc"><h3>' + esc(w[0]) + '</h3><p style="font-size:9.4pt">' + esc(w[1]) + '</p><div class="jours">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (j) { return '<span>' + j + '</span>'; }).join('') + '</div></div>'; }).join('') + '</div></section>';
    /* Refaire le test */
    p += '<section class="page"><p class="sur">Ton chemin</p><h2>Refaire le test, voir ton évolution</h2><p>Ton arbre change à mesure que tu avances. Refais le test dans un mois, sur genesolia.fr, connecté·e à ton espace : chaque résultat y est gardé avec sa date, et tu vois ce qui a bougé, sphère par sphère.</p>' +
      '<div class="bloc"><h3>Mes dates</h3>' + ['Aujourd’hui · ' + auj, 'Dans un mois', 'Dans trois mois', 'Dans six mois'].map(function (x) { return '<div class="ligne"><span>' + esc(x) + '</span><span style="color:#8E6383">Racine ____ · Cœur ____ · Élan ____</span><b></b></div>'; }).join('') + '</div>' +
      '<div class="bloc or"><h3>Aller plus loin</h3><p>Dessine ton arbre familial sur genesolia.fr : les dates, les prénoms et les événements qui se répètent éclairent souvent les sphères à nourrir. La formation « Sors de la boucle » t’accompagne pas à pas pour arrêter de rejouer ce qui revient.</p></div>' +
      '<p class="intro" style="margin-top:6mm">Livret créé le ' + esc(auj) + ' sur genesolia.fr. Lecture symbolique, pour réfléchir à ton histoire. Elle ne remplace pas un avis médical, psychologique ou professionnel.</p></section>';
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="' + esc(location.href) + '"><title>Livret de l’arbre de vie · Genesolia</title><style>' + css() + '</style></head><body><div class="barre-livret"><span>Ton livret Genesolia</span><button onclick="window.print()">Enregistrer en PDF</button></div>' + p + '</body></html>';
  }
  function imprimer(d, btn) {
    var lib = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Préparation du livret…'; }
    var w = MOBILE ? window.open('', '_blank') : null;
    charger().then(function () {
      var page = html(d);
      if (w) { w.document.open(); w.document.write(page); w.document.close(); if (btn) { btn.disabled = false; btn.textContent = lib; } return; }
      var f = document.createElement('iframe'); f.setAttribute('aria-hidden', 'true'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(f); var doc = f.contentDocument; doc.open(); doc.write(page); doc.close();
      var pret = (doc.fonts && doc.fonts.ready) ? doc.fonts.ready : Promise.resolve();
      Promise.race([pret, new Promise(function (ok) { setTimeout(ok, 2500); })]).then(function () {
        setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); if (btn) { btn.disabled = false; btn.textContent = lib; } setTimeout(function () { f.remove(); }, 4000); }, 300);
      });
    });
    if (window.umami) try { window.umami.track('livret-arbre-de-vie'); } catch (x) {}
  }
  window.LivretArbre = { imprimer: imprimer, html: html, charger: charger };
})();
