/* Genesolia · livret du thème astral (créé sur l'appareil de la personne)
   LivretAstral.imprimer({ e, r, roue }, bouton) — e : entrée (prénom, date, heure, lieu), r : calcul Astrologie, roue : SVG */
(function () {
  'use strict';
  var MOBILE = /iphone|ipad|ipod|android/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var NOMS_P = { soleil: 'Soleil', lune: 'Lune', mercure: 'Mercure', venus: 'Vénus', mars: 'Mars', jupiter: 'Jupiter', saturne: 'Saturne', uranus: 'Uranus', neptune: 'Neptune', pluton: 'Pluton', noeud: 'Nœud Nord' };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dateFr(d) { var m = String(d).split('-'); return +m[2] + ' ' + MOIS[+m[1] - 1] + ' ' + m[0]; }
  function css() {
    return '@font-face{font-family:"Gilda Display";src:url(assets/polices/gilda-display-latin-400-normal.woff2) format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400;src:url(assets/polices/nunito-sans-latin-400-normal.woff2) format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:600;src:url(assets/polices/nunito-sans-latin-600-normal.woff2) format("woff2")}' +
      '@page{size:A4;margin:15mm 12mm 17mm}*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font:400 10.6pt/1.68 "Nunito Sans",system-ui,sans-serif;color:#4A2340;background:#fff;padding:0 6mm}' +
      'h1,h2,h3{font-family:"Gilda Display",Georgia,serif;font-weight:400;color:#6B2F5B;line-height:1.2}h2{font-size:21pt;margin-bottom:3mm}h3{font-size:13.5pt;margin:0 0 1.5mm}p{margin-bottom:3.4mm}b{font-weight:600}' +
      '.page{page-break-after:always;break-after:page;padding-top:4mm}.page:last-child{page-break-after:auto}.sur{font:600 7.6pt/1 "Nunito Sans";letter-spacing:.16em;text-transform:uppercase;color:#B98A55;margin-bottom:2.5mm}.intro{color:#8E6383;font-size:9.8pt}' +
      '.bloc{border:1px solid #EBCFD5;border-radius:4mm;padding:4.5mm 5mm;margin-bottom:4mm;break-inside:avoid}.bloc p:last-child{margin-bottom:0}.doux{background:#FFF6F3}.or{background:#FBF0E4;border-color:#F3DCC0}' +
      '.couv{height:255mm;display:flex;flex-direction:column;justify-content:space-between;border-radius:6mm;padding:16mm 14mm;color:#fff;background:radial-gradient(120mm 90mm at 85% 8%,rgba(243,220,192,.5),transparent 60%),linear-gradient(160deg,#1E1238,#3A1745 50%,#6B2F5B)}' +
      '.couv h1{color:#fff;font-size:34pt;margin:4mm 0 5mm}.couv .sur{color:#F3DCC0}.couv p{color:#F7E6E8;font-size:11pt}.couv .marque{font:400 15pt "Gilda Display"}.couv svg{width:96mm;height:auto;align-self:center;background:#fff;border-radius:50%;padding:2mm}' +
      '.trio{display:grid;gap:4mm}.etiq{font:600 8pt/1 "Nunito Sans";letter-spacing:.1em;text-transform:uppercase;color:#B98A55;margin-bottom:1.5mm}.mots span{display:inline-block;border:1px solid #EBCFD5;border-radius:10mm;padding:.5mm 2.6mm;margin:0 1.4mm 1.4mm 0;font-size:8.4pt;color:#6B2F5B}' +
      'table{width:100%;border-collapse:collapse;font-size:9.4pt}td,th{border-bottom:1px solid #EBCFD5;padding:1.6mm;text-align:left}th{font-weight:600;color:#6B2F5B}' +
      '.jauge{height:3mm;border-radius:2mm;background:#F6E3E6;overflow:hidden;margin:1mm 0 2.5mm}.jauge i{display:block;height:100%;background:linear-gradient(90deg,#E7A79E,#B98A55)}' +
      'ul.q{list-style:none}ul.q li{border-left:2.5px solid #B98A55;padding:1mm 0 1mm 3.5mm;margin-bottom:2mm;color:#6B2F5B}.notes{border:1px solid #EBCFD5;border-radius:3mm;height:50mm;margin-top:2mm;background:repeating-linear-gradient(#fff 0 7.5mm,#F3E3E7 7.5mm 7.8mm)}' +
      '.barre-livret{display:none}@media screen{body{max-width:200mm;margin:0 auto}.barre-livret{display:flex;position:sticky;top:0;z-index:9;gap:.6rem;align-items:center;justify-content:space-between;padding:.7rem 1rem;background:#6B2F5B;color:#fff;font:600 14px sans-serif;margin:0 -6mm 4mm}.barre-livret button{border:0;border-radius:99px;padding:.55rem 1rem;background:#F3DCC0;color:#6B2F5B;font:700 14px sans-serif}}';
  }
  function html(d) {
    var T = window.ASTRO_TEXTES, AS = window.Astrologie, e = d.e, r = d.r, P = r.planetes, S = function (k) { return T.SIGNES[k] ? T.SIGNES[k].nom : ''; };
    var enS = function (k) { return 'en ' + S(k); }, prenom = (e.prenom || '').trim(), auj = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    function signe(k) { var s = T.SIGNES[k]; return s ? '<p class="mots">' + (s.mots || []).map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</p><p class="intro">' + esc(s.dates || '') + ' · élément ' + esc(s.element || '') + ' · mode ' + esc(s.mode || '') + ' · maître : ' + esc(s.maitre || '') + '</p>' : ''; }
    var p = '';
    p += '<section class="page"><div class="couv"><div><p class="marque">Genesolia</p><p class="sur" style="margin-top:10mm">Livret du thème astral</p><h1>' + (prenom ? 'Le ciel de ' + esc(prenom) : 'Ton ciel de naissance') + '</h1><p>Né·e le ' + esc(dateFr(e.date)) + (r.heureConnue && e.heure ? ' à ' + esc(String(e.heure).replace(':', ' h ')) : '') + (e.lieu ? ' · ' + esc(e.lieu) : '') + '</p><p>Soleil ' + esc(enS(P.soleil.signe)) + ' · Lune ' + esc(enS(P.lune.signe)) + (r.asc ? ' · Ascendant ' + esc(S(r.asc.signe)) : '') + '</p></div>' + (d.roue || '') + '<p style="font-size:8.6pt;color:#EBCFD5">Lecture symbolique, pour réfléchir. L’astrologie ne prédit pas l’avenir.</p></div></section>';
    p += '<section class="page"><p class="sur">Avant de commencer</p><h2>Comment lire ton thème</h2><p>' + esc(T.INTRO.theme) + '</p><p>Ton thème est la photographie du ciel au moment exact de ta naissance, vue depuis ton lieu de naissance. Les planètes se trouvent dans des signes, qui colorent leur manière de s’exprimer, et dans des maisons, qui disent dans quel domaine de ta vie elles agissent.</p><p>Commence par le trio Soleil, Lune, ascendant : c’est le cœur de ton thème. Regarde ensuite l’équilibre des éléments, puis chaque planète. Garde ce qui te parle, laisse le reste : c’est une grille de lecture, pas une vérité sur toi.</p>' +
      (!r.heureConnue ? '<div class="bloc doux"><p><b>Sans heure de naissance.</b> ' + esc(T.INTRO.sans_heure) + '</p></div>' : '') +
      '<div class="bloc"><h3>Ton ciel en un coup d’œil</h3><table><tr><th>Planète</th><th>Signe</th><th>Degré</th>' + (r.cuspides ? '<th>Maison</th>' : '') + '</tr>' + Object.keys(NOMS_P).filter(function (k) { return P[k]; }).map(function (k) { return '<tr><td>' + NOMS_P[k] + '</td><td>' + esc(S(P[k].signe)) + '</td><td>' + (P[k].deg != null ? Math.floor(P[k].deg) + '°' : '') + '</td>' + (r.cuspides ? '<td>' + (P[k].maison || '') + '</td>' : '') + '</tr>'; }).join('') + (r.asc ? '<tr><td>Ascendant</td><td>' + esc(S(r.asc.signe)) + '</td><td>' + Math.floor(r.asc.deg) + '°</td>' + (r.cuspides ? '<td>1</td>' : '') + '</tr>' : '') + '</table></div></section>';
    p += '<section class="page"><p class="sur">Le cœur de ton thème</p><h2>Ton Soleil ' + esc(enS(P.soleil.signe)) + '</h2>' + signe(P.soleil.signe) + '<p>' + esc(T.SOLEIL[P.soleil.signe]) + '</p>' +
      '<h2 style="margin-top:5mm">Ta Lune ' + esc(enS(P.lune.signe)) + (r.luneIncertaine ? ' <span style="font-size:11pt">(incertaine)</span>' : '') + '</h2>' + signe(P.lune.signe) + '<p>' + esc(T.LUNE[P.lune.signe]) + '</p></section>';
    p += '<section class="page"><p class="sur">Le cœur de ton thème</p>' + (r.asc ? '<h2>Ton ascendant ' + esc(S(r.asc.signe)) + '</h2>' + signe(r.asc.signe) + '<p>' + esc(T.ASCENDANT[r.asc.signe]) + '</p>' : '<h2>Ton ascendant</h2><p>Il faut ton heure et ton lieu de naissance pour le calculer. Ton heure figure sur la copie intégrale de ton acte de naissance, que tu peux demander gratuitement à la mairie de ton lieu de naissance.</p>') +
      (r.elements ? (function () { var tot = 0; Object.keys(r.elements).forEach(function (k) { tot += r.elements[k]; }); var ED = T.ELEMENTS[r.elementDominant];
        return '<h2 style="margin-top:5mm">Tes éléments</h2><div class="bloc">' + ['feu', 'terre', 'air', 'eau'].map(function (k) { var pc = Math.round(r.elements[k] * 100 / (tot || 1)); return '<p style="margin:0">' + esc(T.ELEMENTS[k].nom) + ' · ' + pc + ' %</p><div class="jauge"><i style="width:' + Math.max(3, pc) + '%"></i></div>'; }).join('') + '</div>' +
          '<p><b>' + esc(ED.nom) + ' domine.</b> ' + esc(ED.fort) + '</p>' + (r.elementsAbsents || []).map(function (k) { return '<p><b>' + esc(T.ELEMENTS[k].nom) + ' manque.</b> ' + esc(T.ELEMENTS[k].faible) + '</p>'; }).join('') +
          (r.modeDominant ? '<p><b>Mode dominant : ' + esc(T.MODES[r.modeDominant].nom) + '.</b> ' + esc(T.MODES[r.modeDominant].texte) + '</p>' : ''); })() : '') + '</section>';
    var pers = ['mercure', 'venus', 'mars', 'jupiter', 'saturne'];
    p += '<section class="page"><p class="sur">Tes planètes</p><h2>Comment tu penses, aimes, agis</h2>' + pers.map(function (k) {
      return '<div class="bloc"><p class="etiq">' + NOMS_P[k] + ' ' + esc(enS(P[k].signe)) + (P[k].maison ? ' · maison ' + P[k].maison : '') + '</p><h3>' + esc(T.PLANETES[k].role.charAt(0).toUpperCase() + T.PLANETES[k].role.slice(1)) + '</h3><p>' + esc(T[k.toUpperCase()][P[k].signe]) + '</p></div>';
    }).join('') + '</section>';
    p += '<section class="page"><p class="sur">Ta génération et ta direction</p><h2>Les planètes lentes</h2><p class="intro">Uranus, Neptune et Pluton restent des années dans un signe : elles décrivent ce que tu partages avec toute ta génération.</p>' + ['uranus', 'neptune', 'pluton'].map(function (k) {
      return P[k] ? '<div class="bloc"><p class="etiq">' + NOMS_P[k] + ' ' + esc(enS(P[k].signe)) + '</p><p>' + esc((T.GENERATIONNELLES[k] || {})[P[k].signe] || '') + '</p></div>' : '';
    }).join('') + (P.noeud ? '<h2 style="margin-top:4mm">Ton Nœud Nord ' + esc(enS(P.noeud.signe)) + '</h2><p>' + esc(T.NOEUD[P.noeud.signe]) + '</p>' : '') + '</section>';
    if (r.cuspides) p += '<section class="page"><p class="sur">Les domaines de ta vie</p><h2>Tes douze maisons</h2>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (k) {
      var dans = Object.keys(NOMS_P).filter(function (x) { return P[x] && P[x].maison === k; }).map(function (x) { return NOMS_P[x]; });
      return '<div class="bloc" style="padding:3mm 4mm;margin-bottom:2.5mm"><h3 style="font-size:11.5pt">' + esc(T.MAISONS[String(k)].titre) + ' · ' + esc(S(AS.signeDe(r.cuspides[k]))) + (dans.length ? ' · ' + esc(dans.join(', ')) : '') + '</h3><p style="font-size:9.2pt">' + esc(T.MAISONS[String(k)].texte) + '</p></div>';
    }).join('') + '</section>';
    p += '<section class="page"><p class="sur">Et dans ta famille ?</p><h2>Ton ciel et ta lignée</h2><p>' + esc(T.INTRO.lignee) + '</p>' +
      '<div class="bloc"><p class="etiq">Lune ' + esc(enS(P.lune.signe)) + ' · la mère</p><p>' + esc(T.PLANETES.lune.famille) + '</p></div><div class="bloc"><p class="etiq">Soleil ' + esc(enS(P.soleil.signe)) + ' · le père</p><p>' + esc(T.PLANETES.soleil.famille) + '</p></div>' +
      '<div class="bloc"><p class="etiq">Saturne ' + esc(enS(P.saturne.signe)) + ' · les règles et les ancêtres</p><p>' + esc(T.PLANETES.saturne.famille) + '</p></div>' +
      '<div class="bloc or"><h3>Questions à poser à ta famille</h3><ul class="q"><li>Quels sont les signes de mes parents, de mes grands-parents ? Lesquels reviennent ?</li><li>Ma Lune est-elle dans le signe du Soleil de ma mère, ou de mon père ?</li><li>Quel élément domine ma lignée, et lequel manque à tout le monde ?</li><li>Qui est né le même mois que moi, ou à la même saison ?</li></ul></div><p class="sur">Tes notes</p><div class="notes"></div></section>';
    p += '<section class="page"><p class="sur">Ton chemin</p><h2>Aller plus loin</h2><p>Ajoute les dates de naissance de ta famille dans ton arbre sur genesolia.fr : l’outil calcule les signes de chacun·e et te montre les échos d’une génération à l’autre. Ton guide du mois rapporte chaque mois les grands mouvements du ciel à tes maisons.</p><div class="bloc"><h3>Ce que je retiens de mon thème</h3><div class="notes" style="height:110mm"></div></div><p class="intro">Livret créé le ' + esc(auj) + ' sur genesolia.fr. ' + (r.systeme ? 'Maisons : système ' + esc(r.systeme) + '. ' : '') + 'Lecture symbolique : l’astrologie ne prédit pas l’avenir et ne remplace pas un avis médical, psychologique ou professionnel.</p></section>';
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="' + esc(location.href) + '"><title>Livret du thème astral · Genesolia</title><style>' + css() + '</style></head><body><div class="barre-livret"><span>Ton livret Genesolia</span><button onclick="window.print()">Enregistrer en PDF</button></div>' + p + '</body></html>';
  }
  function imprimer(d, btn) {
    var lib = btn ? btn.textContent : '';
    var w = MOBILE ? window.open('', '_blank') : null, page = html(d);
    if (w) { w.document.open(); w.document.write(page); w.document.close(); return; }
    if (btn) { btn.disabled = true; btn.textContent = 'Préparation du livret…'; }
    var f = document.createElement('iframe'); f.setAttribute('aria-hidden', 'true'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    document.body.appendChild(f); var doc = f.contentDocument; doc.open(); doc.write(page); doc.close();
    var pret = (doc.fonts && doc.fonts.ready) ? doc.fonts.ready : Promise.resolve();
    Promise.race([pret, new Promise(function (ok) { setTimeout(ok, 2500); })]).then(function () {
      setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); if (btn) { btn.disabled = false; btn.textContent = lib; } setTimeout(function () { f.remove(); }, 4000); }, 300);
    });
    if (window.umami) try { window.umami.track('livret-astral'); } catch (x) {}
  }
  window.LivretAstral = { imprimer: imprimer, html: html };
})();
