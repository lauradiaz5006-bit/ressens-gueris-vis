/* Genesolia · « Ma synthèse » : rassemble les derniers résultats de Mon chemin en une lecture d'ensemble.
   GenesoliaSynthese.construire(resultats) -> Promise<{ html, resume, donnees } | null> */
(function () {
  'use strict';
  var SPHERES = { malkhout: 'Malkhout (ta place, ta sécurité)', yessod: 'Yessod (tes liens)', hod: 'Hod (ta parole)', netsah: 'Netsah (ta persévérance)', tiferet: 'Tiferet (ton cœur, ton équilibre)', guevoura: 'Guevoura (tes limites)', hessed: 'Hessed (ta générosité)', bina: 'Bina (ta compréhension)', hokhma: 'Hokhma (ton intuition)', keter: 'Kéter (le sens)' };
  var BLESSURES = { rejet: ['le rejet', 'racine', 'te sentir de trop, te faire petit·e'], abandon: ["l'abandon", 'coeur', 'avoir peur de perdre l’autre, t’accrocher ou partir la première'], humiliation: ["l'humiliation", 'racine', 'avoir honte de tes besoins, porter pour les autres'], trahison: ['la trahison', 'coeur', 'tout contrôler pour ne plus être déçu·e'], injustice: ["l'injustice", 'racine', 'être très exigeant·e avec toi-même, retenir tes émotions'] };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function script(src, test) { if (test()) return Promise.resolve(); return new Promise(function (ok) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ok; document.head.appendChild(s); }); }
  function phrase(t) { return ((String(t || '').match(/[^.!?]+[.!?]+/) || [t || ''])[0]).trim(); }
  function construire(liste) {
    var dernier = {};
    (liste || []).forEach(function (r) { if (!dernier[r.outil]) dernier[r.outil] = r; });
    var n = Object.keys(dernier).filter(function (k) { return k !== 'synthese'; }).length;
    if (n < 2) return Promise.resolve(null);
    var besoins = [];
    if (dernier.numerologie) besoins.push(script('assets/numerologie.js', function () { return !!window.Numerologie; }));
    if (dernier.maya || dernier['maya-duo']) besoins.push(script('assets/maya-textes.js', function () { return !!window.MAYA_TEXTES; }));
    if (dernier.astral) besoins.push(script('assets/astrologie-textes.js', function () { return !!window.ASTRO_TEXTES; }));
    return Promise.all(besoins).then(function () {
      var racine = 0, coeur = 0, sources = [], ressources = [], vigilances = [], questions = [];
      var b = dernier.blessures && dernier.blessures.donnees && dernier.blessures.donnees.scores;
      if (b) {
        var tri = Object.keys(b).filter(function (k) { return BLESSURES[k] && b[k] > 0; }).sort(function (x, y) { return b[y] - b[x]; });
        tri.forEach(function (k) { if (BLESSURES[k][1] === 'racine') racine += b[k]; else coeur += b[k]; });
        if (tri[0]) { vigilances.push('La blessure qui te parle le plus est <b>' + esc(BLESSURES[tri[0]][0]) + '</b> : elle peut te pousser à ' + esc(BLESSURES[tri[0]][2]) + '.'); questions.push('Qui, dans ta famille, a vécu ' + BLESSURES[tri[0]][0] + ' avant toi ?'); }
        sources.push('les blessures de l’âme');
      }
      var a = dernier['arbre-de-vie'] && dernier['arbre-de-vie'].donnees;
      if (a && a.cycles) {
        racine += (100 - (a.cycles.racine || 0)) / 20; coeur += (100 - (a.cycles.coeur || 0)) / 20;
        var sc = a.scores || {}, lum = Object.keys(sc).filter(function (k) { return sc[k] >= 70; }).sort(function (x, y) { return sc[y] - sc[x]; }).slice(0, 2);
        if (lum.length) ressources.push('Dans ton arbre de vie, tes sphères lumineuses : <b>' + lum.map(function (k) { return esc(SPHERES[k] || k); }).join(', ') + '</b>.');
        if (a.aNourrir && a.aNourrir[0]) vigilances.push('La sphère à nourrir en premier : <b>' + esc(SPHERES[a.aNourrir[0]] || a.aNourrir[0]) + '</b>.');
        sources.push('l’arbre de vie');
      }
      var nu = dernier.numerologie && dernier.numerologie.donnees, N = window.Numerologie;
      if (nu && N && N.NOMBRES[nu.chemin]) {
        var C = N.NOMBRES[nu.chemin];
        ressources.push('Ton chemin de vie <b>' + nu.chemin + ', ' + esc(C.nom.toLowerCase()) + '</b> : ' + esc(C.force));
        vigilances.push('Le défi de ton chemin de vie : ' + esc(C.defi));
        sources.push('ta numérologie');
      }
      var as = dernier.astral && dernier.astral.donnees, T = window.ASTRO_TEXTES;
      if (as && T && T.SIGNES[as.soleil]) {
        var mots = (T.SIGNES[as.soleil].mots || []).concat(as.lune && T.SIGNES[as.lune] ? T.SIGNES[as.lune].mots || [] : []);
        ressources.push('Ton ciel : Soleil en ' + esc(T.SIGNES[as.soleil].nom) + (as.lune ? ', Lune en ' + esc(T.SIGNES[as.lune].nom) : '') + (as.asc && T.SIGNES[as.asc] ? ', ascendant ' + esc(T.SIGNES[as.asc].nom) : '') + ' : <b>' + esc(mots.slice(0, 4).join(', ')) + '</b>.');
        questions.push('Ta Lune ressemble-t-elle au Soleil de ta mère ?');
        sources.push('ton thème astral');
      }
      var ma = dernier.maya && dernier.maya.donnees, MT = window.MAYA_TEXTES;
      if (ma && MT && MT.SIGNES[ma.signe]) {
        var S = MT.SIGNES[ma.signe];
        ressources.push('Ton jour maya <b>' + ma.nombre + ' ' + esc(S.kiche) + '</b> (' + esc(S.image) + ') : ' + esc(phrase(S.forces)));
        vigilances.push('Selon la tradition maya : ' + esc(phrase(S.defis)));
        sources.push('ton signe maya');
      }
      var pf = dernier['prenoms-famille'] && dernier['prenoms-famille'].donnees;
      if (pf && pf.echos && pf.echos[0]) { var e0 = pf.echos[0]; questions.push('Ton calcul de prénoms montre un écho entre ' + e0.a.prenom + ' et ' + e0.b.prenom + ' : qu’est-ce qui se transmet entre ces deux personnes ?'); sources.push('les prénoms de ta famille'); }
      if (dernier.prenom) sources.push('ton prénom');
      var cycle = racine === coeur ? null : racine > coeur ? 'racine' : 'coeur';
      var txtCycle = cycle === 'racine' ? 'Tes résultats se rejoignent autour du <b>cycle de la racine</b> : ta sécurité, ta place, le droit d’exister et d’avoir des besoins. C’est souvent là que l’histoire familiale pèse le plus : guerres, exils, pertes, manques.'
        : cycle === 'coeur' ? 'Tes résultats se rejoignent autour du <b>cycle du cœur</b> : ta façon d’aimer, de donner, de poser tes limites et de faire confiance. C’est là que se rejouent les histoires d’amour et de lien de ta lignée.'
          : 'Tes résultats touchent <b>les deux cycles</b> à parts égales : la racine (ta sécurité, ta place) et le cœur (tes liens, ta façon d’aimer).';
      var prochaine = cycle === 'racine' ? ['Dessine ton arbre et cherche qui, dans ta lignée, a tout perdu ou a dû se faire petit.', 'genosociogramme.html', 'Dessiner mon arbre'] : cycle === 'coeur' ? ['Relis les histoires d’amour de ta famille : qui a été quitté, qui est resté seul, qui n’a pas pu aimer librement.', 'genosociogramme.html', 'Dessiner mon arbre'] : ['Commence par le parcours guidé : il t’aide à nommer ce qui revient le plus souvent.', 'parcours.html', 'Faire le parcours'];
      var html = '<div class="sy"><p class="sy-sur">Ma synthèse · ' + esc(sources.join(', ')) + '</p>' +
        '<div class="sy-bloc sy-cycle"><h3>Ce qui revient</h3><p>' + txtCycle + '</p></div>' +
        (ressources.length ? '<div class="sy-bloc"><h3>Tes ressources</h3><ul>' + ressources.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' : '') +
        (vigilances.length ? '<div class="sy-bloc"><h3>Ce qui demande de l’attention</h3><ul>' + vigilances.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' : '') +
        (questions.length ? '<div class="sy-bloc"><h3>Les questions à poser à ta famille</h3><ul>' + questions.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '') +
        '<div class="sy-bloc sy-pas"><h3>Ta prochaine étape</h3><p>' + esc(prochaine[0]) + '</p><a class="btn btn-plein" href="' + prochaine[1] + '">' + esc(prochaine[2]) + '</a></div>' +
        '<p class="sy-note">Lecture symbolique qui croise des grilles différentes : elle propose des pistes pour réfléchir, pas un portrait définitif. Plus tu fais de tests, plus elle s’affine.</p></div>';
      return { html: html, resume: (cycle === 'racine' ? 'Cycle de la racine' : cycle === 'coeur' ? 'Cycle du cœur' : 'Les deux cycles') + ' · à partir de ' + sources.length + ' outils', donnees: { cycle: cycle, sources: sources } };
    });
  }
  window.GenesoliaSynthese = { construire: construire };
})();
