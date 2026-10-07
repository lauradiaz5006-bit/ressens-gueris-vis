/* Genesolia · Livret numérologique complet à imprimer ou enregistrer en PDF.
   Utilise window.Numerologie. Appel : LivretNumerologie.imprimer(theme, bouton) */
(function () {
  'use strict';
  var VALEUR = { A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3, D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6, G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9 };
  var VOY = 'AEIOUY';
  var MOIS_NOMS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  /* Trois questions pour réfléchir, par nombre de chemin de vie */
  var QUESTIONS = {
    1: ["Dans quelle situation récente as-tu attendu la permission de quelqu'un pour avancer ?", "Qu'est-ce que tu as commencé seul·e et dont tu es fier·e ?", "Qui, dans ta famille, a dû se débrouiller tout·e seul·e très tôt ?"],
    2: ["Quand as-tu dit oui alors que tu pensais non ?", "Avec qui te sens-tu vraiment à égalité ?", "Qui, dans ta famille, faisait le lien entre tout le monde, parfois en s'oubliant ?"],
    3: ["Qu'est-ce que tu n'oses pas dire, ou pas montrer, de peur d'être jugé·e ?", "Quelle activité te fait perdre la notion du temps ?", "Dans ta famille, qui avait le droit de s'exprimer, et qui se taisait ?"],
    4: ["Qu'est-ce que tu t'interdis tant que tout n'est pas parfaitement en ordre ?", "Sur quoi as-tu bâti quelque chose de solide, pas à pas ?", "Quelle peur du manque a traversé ta famille ?"],
    5: ["De quoi as-tu envie de te libérer en ce moment ?", "Quand le changement t'a-t-il fait du bien, même s'il faisait peur ?", "Qui, dans ta famille, est parti, a voyagé ou a rompu avec le cadre ?"],
    6: ["Pour qui en fais-tu trop, et qu'attends-tu en retour ?", "Qu'est-ce qui te fait te sentir chez toi ?", "Qui portait la responsabilité de toute la famille ?"],
    7: ["Quelle question te suit depuis longtemps ?", "De quoi as-tu besoin quand tu te retires du monde ?", "Quel secret ou quel silence plane sur ta famille ?"],
    8: ["Quel rapport as-tu à l'argent, au pouvoir, à la réussite ?", "Où te sens-tu vraiment à ta place, légitime ?", "Quelle injustice, quelle perte ou quelle réussite a marqué ta lignée ?"],
    9: ["Qu'est-ce que tu as du mal à laisser partir ?", "À qui ou à quoi as-tu envie de transmettre ?", "Quelle histoire de ta famille mérite d'être enfin racontée ?"],
    11: ["Quelle intuition as-tu écartée, et qui s'est révélée juste ?", "Qu'est-ce qui t'inspire au point de te dépasser ?", "Qui, dans ta famille, voyait les choses autrement, et comment était-il ou elle reçu·e ?"],
    22: ["Quel projet plus grand que toi portes-tu en silence ?", "Qu'est-ce qui t'empêche de le rendre concret ?", "Quelle œuvre, quel héritage tes ancêtres ont-ils construit ?"],
    33: ["Comment te préserves-tu pendant que tu t'occupes des autres ?", "Où ta générosité te remplit-elle, et où t'épuise-t-elle ?", "Qui, dans ta famille, s'est donné·e sans compter ?"]
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dateFr(d) { var m = d.split('-'); return +m[2] + ' ' + MOIS_NOMS[+m[1] - 1] + ' ' + m[0]; }
  function lignes(n) { var h = ''; for (var i = 0; i < n; i++) h += '<div class="ligne"></div>'; return h; }

  function detailNom(N, txt) {
    var l = N.lettres(txt);
    var cells = l.split('').map(function (c) { return '<span class="lt' + (VOY.indexOf(c) >= 0 ? ' voy' : '') + '"><b>' + c + '</b><i>' + VALEUR[c] + '</i></span>'; }).join('');
    var s = 0, sv = 0; l.split('').forEach(function (c) { s += VALEUR[c]; if (VOY.indexOf(c) >= 0) sv += VALEUR[c]; });
    return { html: cells, total: s, voy: sv, cons: s - sv };
  }

  function css() {
    return '@font-face{font-family:"Gilda Display";font-weight:400;src:url(assets/polices/gilda-display-latin-400-normal.woff2) format("woff2")}' +
      '@font-face{font-family:"Nunito Sans";font-weight:400;src:url(assets/polices/nunito-sans-latin-400-normal.woff2) format("woff2")}' +
      '@font-face{font-family:"Nunito Sans";font-weight:600;src:url(assets/polices/nunito-sans-latin-600-normal.woff2) format("woff2")}' +
      '@page{size:A4;margin:16mm 16mm 18mm}' +
      '*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      'body{font:400 10.4pt/1.55 "Nunito Sans",system-ui,sans-serif;color:#4A2340;background:#fff}' +
      'h1,h2,h3,h4{font-family:"Gilda Display",Georgia,serif;font-weight:400;color:#6B2F5B;line-height:1.2}' +
      'h2{font-size:21pt;margin-bottom:3mm}h3{font-size:13.5pt;margin:0 0 1.5mm}h4{font-size:11.5pt;margin-bottom:1mm}' +
      'p{margin-bottom:2.4mm}b{font-weight:600}' +
      '.page{page-break-after:always;break-after:page}.page:last-child{page-break-after:auto;break-after:auto}' +
      '.sur{font:600 7.6pt/1 "Nunito Sans";letter-spacing:.16em;text-transform:uppercase;color:#B98A55;margin-bottom:2.5mm}' +
      '.intro{color:#8E6383;font-size:9.8pt}' +
      '.bloc{border:1px solid #EBCFD5;border-radius:4mm;padding:4.5mm 5mm;margin-bottom:4mm;break-inside:avoid;page-break-inside:avoid}' +
      '.doux{background:#FFF6F3}' +
      '.num{display:inline-flex;align-items:center;justify-content:center;width:13mm;height:13mm;border-radius:50%;background:#6B2F5B;color:#fff;font:400 17pt/1 "Gilda Display";flex:none}' +
      '.num.grand{width:30mm;height:30mm;font-size:42pt;background:radial-gradient(circle at 35% 30%,#8E4A7B,#6B2F5B)}' +
      '.tete{display:flex;gap:4mm;align-items:center;margin-bottom:2.5mm}.tete h3{margin:0}.tete small{display:block;font:400 9pt "Nunito Sans";color:#8E6383}' +
      '.mots{margin:1mm 0 3mm}.mots span{display:inline-block;border:1px solid #EBCFD5;border-radius:10mm;padding:.6mm 3mm;margin:0 1.5mm 1.5mm 0;font-size:8.6pt;color:#6B2F5B}' +
      '.fd{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:2mm}.fd div{background:#FFF6F3;border-radius:3mm;padding:3mm 3.5mm;font-size:9.4pt}.fd b{display:block;color:#6B2F5B;margin-bottom:.8mm}' +
      '.fam{border-left:2.5px solid #B98A55;padding:1mm 0 1mm 3.5mm;color:#6B2F5B;font-size:9.6pt;margin-top:2.5mm}' +
      /* couverture */
      '.couv{height:255mm;display:flex;flex-direction:column;justify-content:space-between;border-radius:6mm;padding:16mm 14mm;color:#fff;background:radial-gradient(120mm 90mm at 85% 8%,rgba(243,220,192,.55),transparent 60%),radial-gradient(110mm 90mm at 0% 100%,rgba(231,167,158,.45),transparent 60%),linear-gradient(160deg,#7B3A6A,#3E1736)}' +
      '.couv .marque{font:400 15pt "Gilda Display";letter-spacing:.04em}' +
      '.couv h1{color:#fff;font-size:34pt;margin:4mm 0 5mm}.couv .sur{color:#F3DCC0}.couv p{color:#F7E6E8;font-size:11pt}' +
      '.couv .chiffre{font:400 120pt/1 "Gilda Display";color:#F3DCC0;opacity:.9}' +
      '.couv .pied{font-size:8.6pt;color:#EBCFD5}' +
      /* sommaire */
      '.som{list-style:none;counter-reset:s;margin:3mm 0 6mm}.som li{counter-increment:s;display:flex;gap:3mm;padding:2.2mm 0;border-bottom:1px dotted #EBCFD5}.som li:before{content:counter(s,decimal-leading-zero);font:400 11pt "Gilda Display";color:#B98A55;width:8mm}' +
      /* grille */
      '.grille{display:grid;grid-template-columns:repeat(3,18mm);gap:2mm;margin:2mm 0}.grille div{height:16mm;border:1px solid #EBCFD5;border-radius:2.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center}.grille b{font:400 14pt "Gilda Display";color:#6B2F5B}.grille span{font-size:7.6pt;color:#8E6383}.grille .fort{background:#6B2F5B}.grille .fort b,.grille .fort span{color:#fff}.grille .vide{background:#FFF6F3;border-style:dashed}' +
      '.deux{display:grid;grid-template-columns:auto 1fr;gap:6mm;align-items:start}' +
      '.barre{display:grid;grid-template-columns:30mm 1fr 12mm;gap:3mm;align-items:center;margin:1.6mm 0;font-size:9.2pt}.barre i{display:block;height:2.6mm;border-radius:2mm;background:#F7E6E8;position:relative;overflow:hidden}.barre i:after{content:"";position:absolute;inset:0 auto 0 0;width:var(--p);background:#B98A55}.barre.fort b{color:#6B2F5B}' +
      /* périodes */
      '.frise{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:2mm 0 4mm}.frise div{border:1px solid #EBCFD5;border-radius:3mm;padding:3mm;font-size:9pt}.frise .ici{border-color:#6B2F5B;background:#FFF6F3}' +
      '.ici-tag{display:inline-block;background:#6B2F5B;color:#fff;border-radius:10mm;padding:.4mm 2.5mm;font-size:7.4pt;font-weight:600;margin-left:2mm;vertical-align:middle}' +
      /* mois */
      '.mois{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.mois .bloc{margin:0;padding:3.5mm 4mm;font-size:9.1pt}.mois h4{display:flex;justify-content:space-between;align-items:baseline}.mois h4 span{font:600 8pt "Nunito Sans";color:#B98A55;text-transform:uppercase;letter-spacing:.1em}.mois ul{margin:1mm 0 1.5mm 4mm}.mois .q{font-style:italic;color:#8E6383}' +
      /* tableau lignée */
      'table{width:100%;border-collapse:collapse;font-size:9.2pt;margin:2mm 0 4mm}th,td{border:1px solid #EBCFD5;padding:2.6mm 2.5mm;text-align:left}th{background:#FFF6F3;font-weight:600;color:#6B2F5B}td.v{height:9mm}' +
      '.ligne{height:8.5mm;border-bottom:1px solid #EBCFD5}' +
      '.lettres{display:flex;flex-wrap:wrap;gap:1mm;margin:1.5mm 0 2.5mm}.lt{display:inline-flex;flex-direction:column;align-items:center;width:7mm;border:1px solid #EBCFD5;border-radius:1.5mm;padding:.6mm 0}.lt b{font-size:9pt}.lt i{font-style:normal;font-size:7.6pt;color:#B98A55}.lt.voy{background:#FFF6F3}' +
      '.calc{font-size:9.2pt}.calc td{padding:2mm 2.5mm}' +
      '.note{font-size:8.4pt;color:#8E6383}' +
      '.fin{height:250mm;display:flex;flex-direction:column;justify-content:center;text-align:center;gap:4mm}.fin .bloc{text-align:left}';
  }

  function html(N, t) {
    var prenom = String(t.prenoms).trim().split(/\s+/)[0]; prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1);
    var auj = new Date(), an = auj.getFullYear();
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t.date), J = +m[3], M = +m[2];
    var P = N.POSITIONS, NB = N.NOMBRES;
    function fd(n) { return '<div class="fd"><div><b>Ta force</b>' + NB[n].force + '</div><div><b>Ton défi</b>' + NB[n].defi + '</div></div>'; }
    function mots(n) { return '<div class="mots">' + NB[n].mots.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>'; }
    function carte(pos, n, opts) {
      if (!n) return '';
      opts = opts || {};
      return '<div class="bloc"><div class="tete"><span class="num">' + n + '</span><div><h3>' + P[pos].titre + '</h3><small>' + n + ' · ' + NB[n].nom + (P[pos].calcul ? ' · ' + P[pos].calcul : '') + '</small></div></div>' +
        '<p class="intro">' + P[pos].intro + '</p><p>' + N.texte(pos, n) + '</p>' + (opts.fd === false ? '' : fd(n)) + (opts.fam ? '<p class="fam">' + NB[n].famille + '</p>' : '') + '</div>';
    }
    var secs = [];
    var som = [];
    function page(titre, contenu, dansSommaire) { if (dansSommaire !== false) som.push(titre); secs.push('<section class="page">' + contenu + '</section>'); }

    // 2. Comment lire
    var lire = '<p class="sur">Avant de commencer</p><h2>Comment lire ce livret</h2>' +
      '<p>Ce livret rassemble tout ton thème numérologique, calculé à partir de tes prénoms, de ton nom de naissance et de ta date de naissance. Chaque nombre éclaire une facette : ta route, ta façon d\'agir, ce qui te motive en profondeur, ce que tu traverses en ce moment.</p>' +
      '<p>Lis-le à ton rythme. Garde ce qui te parle, laisse le reste. Un nombre ne dit jamais qui tu es à ta place : il propose une piste, une question, une autre façon de regarder ton histoire.</p>' +
      '<div class="bloc doux"><h3>Tes repères</h3><p style="margin:0">Prénoms : <b>' + esc(t.prenoms) + '</b> · Nom de naissance : <b>' + esc(t.nom) + '</b><br>Né·e le <b>' + dateFr(t.date) + '</b>' + (t.age != null ? ' · ' + t.age + ' ans' : '') + '</p></div>' +
      '<h3 style="margin-top:5mm">Dans ce livret</h3><ol class="som">%SOMMAIRE%</ol>' +
      '<p class="note">La numérologie propose une lecture symbolique, pour réfléchir à ton histoire. Elle ne prédit pas l\'avenir et ne remplace aucun avis professionnel.</p>';
    secs.push('%LIRE%');

    // 3. Chemin de vie
    page('Ton chemin de vie', '<p class="sur">Le nombre le plus important</p><h2>Ton chemin de vie</h2>' +
      '<div class="deux" style="margin:4mm 0"><span class="num grand">' + t.chemin + '</span><div><h3 style="font-size:17pt">' + t.chemin + ' · ' + NB[t.chemin].nom + '</h3>' + mots(t.chemin) + '<p class="intro">' + P.chemin.intro + '</p></div></div>' +
      '<p>' + N.texte('chemin', t.chemin) + '</p><p>' + NB[t.chemin].essence + '</p>' + fd(t.chemin) +
      (NB[t.chemin].maitre ? '<div class="bloc doux" style="margin-top:4mm"><h4>Un nombre maître</h4><p style="margin:0">Le ' + t.chemin + ' est un nombre maître : il porte une intensité particulière. Il se vit souvent par étapes, en passant par son nombre de base, le ' + N.base(t.chemin) + ' (' + NB[N.base(t.chemin)].nom.toLowerCase() + ').</p></div>' : '') +
      '<h3 style="margin-top:5mm">Dans ta lignée</h3><p class="fam">' + NB[t.chemin].famille + '</p>' +
      '<p class="note" style="margin-top:3mm">Calcul : la somme de tous les chiffres de ta date de naissance, réduite à un seul chiffre (sauf 11, 22 et 33).</p>');

    // 4-6. Les autres nombres
    page('Ton expression et ton nombre intime', '<p class="sur">Tes nombres principaux</p><h2>Ce que tu montres, ce qui te motive</h2>' + carte('expression', t.expression) + carte('intime', t.intime));
    page('Ta réalisation et ta maturité', '<p class="sur">Tes nombres principaux</p><h2>Ce que tu construis</h2>' + carte('realisation', t.realisation) + carte('maturite', t.maturite));
    page('Ton nombre héréditaire, ton prénom, ton jour', '<p class="sur">Ce qui te relie</p><h2>Ta lignée, ton prénom, ton jour</h2>' + carte('hereditaire', t.hereditaire, { fam: true }) + carte('actif', t.actif, { fd: false }) + carte('jour', t.jour, { fd: false }));

    // 7. Le nom
    var g = t.grille, cases = '';
    for (var k = 1; k <= 9; k++) cases += '<div class="' + (!g[k] ? 'vide' : (t.dominants.indexOf(k) >= 0 ? 'fort' : '')) + '"><b>' + k + '</b><span>' + (g[k] ? '× ' + g[k] : 'absent') + '</span></div>';
    var totalL = 0; Object.keys(t.plans).forEach(function (c) { totalL += t.plans[c]; });
    page('Ce que dit ton nom', '<p class="sur">Les lettres de ton nom</p><h2>Ce que dit ton nom</h2>' +
      '<div class="deux"><div class="grille">' + cases + '</div><div><p>Chaque lettre de ton nom complet correspond à un nombre de 1 à 9. Ceux qui reviennent le plus colorent ta personnalité' +
      (t.dominants.length ? ' : chez toi, le <b>' + t.dominants.join('</b> et le <b>') + '</b>.' : '.') + '</p>' +
      t.dominants.map(function (d) { return '<p><b>' + d + ' · ' + NB[d].nom + '</b> : ' + NB[d].essence + '</p>'; }).join('') + '</div></div>' +
      (t.absents.length ? '<h3 style="margin-top:4mm">Tes nombres absents</h3><p class="intro">Ils indiquent des qualités à développer au fil de ta vie, des apprentissages plutôt que des manques.</p>' + t.absents.map(function (a) { return '<p><b>' + a + '</b> · ' + N.ABSENTS[a] + '</p>'; }).join('') : '<p class="bloc doux">Tous les nombres de 1 à 9 sont présents dans ton nom : un signe d\'équilibre.</p>') +
      '<h3 style="margin-top:4mm">Tes quatre plans</h3><p class="intro">Les lettres de ton nom se répartissent entre quatre façons de vivre les choses. Le plan le plus fort montre comment tu fonctionnes en premier.</p>' +
      Object.keys(N.PLANS).map(function (c) { var pc = totalL ? Math.round(t.plans[c] * 100 / totalL) : 0; return '<div class="barre' + (c === t.planDominant ? ' fort' : '') + '"><b>' + N.PLANS[c].nom + '</b><i style="--p:' + pc + '%"></i><span>' + pc + ' %</span></div>'; }).join('') +
      '<div class="bloc doux" style="margin-top:3mm"><h4>' + N.PLANS[t.planDominant].nom + ' : ton plan dominant</h4><p style="margin:0">' + N.PLANS[t.planDominant].texte + '</p></div>');

    // 8. Apprentissages
    if (t.dettes.length) {
      var vus = {};
      page('Tes nombres d\'apprentissage', '<p class="sur">Ce que tu es venu·e apprendre</p><h2>Tes nombres d\'apprentissage</h2><p class="intro">' + N.APPRENTISSAGES.intro + '</p>' +
        t.dettes.filter(function (d) { if (vus[d.n]) return false; vus[d.n] = 1; return true; }).map(function (d) {
          var ou = t.dettes.filter(function (x) { return x.n === d.n; }).map(function (x) { return N.OU[x.ou]; });
          var T = N.APPRENTISSAGES[d.n];
          return '<div class="bloc"><div class="tete"><span class="num">' + d.n + '</span><div><h3>' + T.titre + '</h3><small>Apparaît dans ' + ou.join(' et ') + '</small></div></div><p style="margin:0">' + T.texte + '</p></div>';
        }).join(''));
    }

    // 9. Cycles
    page('Tes trois grands cycles', '<p class="sur">Le temps long</p><h2>Tes trois grands cycles</h2><p class="intro">Ta vie se découpe en trois grands cycles : la jeunesse, l\'âge adulte et la maturité. Chacun a sa tonalité, qui colore tout ce que tu vis pendant ces années.</p>' +
      t.cycles.map(function (c, i) {
        var ici = t.cycleActuel === c;
        return '<div class="bloc' + (ici ? ' doux' : '') + '"><div class="tete"><span class="num">' + c.n + '</span><div><h3>' + N.CYCLES.noms[i] + (ici ? '<span class="ici-tag">Tu es ici</span>' : '') + '</h3><small>' + N.ages(c.de, c.a) + ' · ' + NB[c.n].nom + '</small></div></div><p>' + N.CYCLES[c.n] + '</p><p style="margin:0" class="intro">' + NB[c.n].essence + '</p></div>';
      }).join(''));

    // 10. Périodes
    var pa = t.periodeActuelle;
    page('Tes quatre réalisations et leurs défis', '<p class="sur">Le temps long</p><h2>Tes quatre grandes périodes</h2><p class="intro">' + N.PERIODES.intro + '</p>' +
      t.periodes.map(function (p, i) {
        var ici = pa && pa.index === i;
        return '<div class="bloc' + (ici ? ' doux' : '') + '"><div class="tete"><span class="num">' + p.n + '</span><div><h3>Période ' + (i + 1) + ' · Réalisation ' + p.n + (ici ? '<span class="ici-tag">Tu es ici</span>' : '') + '</h3><small>' + N.ages(p.de, p.a) + ' · ' + NB[p.n].nom + '</small></div></div><p>' + N.PERIODES[p.n] + '</p><p style="margin:0"><b>Défi ' + p.defi + '</b> · ' + N.DEFIS[p.defi].replace(/^Le défi [^:]+: /, '') + '</p></div>';
      }).join('') +
      '<div class="bloc"><h3>Ton défi principal : le ' + t.defiPrincipal + '</h3><p>' + N.DEFIS[t.defiPrincipal] + '</p><p class="intro" style="margin:0">' + N.DEFIS.intro + '</p></div>');

    // 11. Années
    var annees = [an, an + 1, an + 2].map(function (y) { return { y: y, n: N.anneePerso(J, M, y) }; });
    page('Tes trois prochaines années', '<p class="sur">Le temps proche</p><h2>Tes trois prochaines années</h2><p class="intro">Ton année personnelle suit un cycle de neuf ans. Elle change chaque 1er janvier et donne la tonalité de l\'année : commencer, s\'associer, s\'exprimer, construire, bouger, s\'engager, réfléchir, récolter, conclure.</p>' +
      annees.map(function (a, i) {
        var A = N.ANNEES[a.n];
        return '<div class="bloc' + (i === 0 ? ' doux' : '') + '"><div class="tete"><span class="num">' + a.n + '</span><div><h3>' + a.y + ' · ' + A.titre + (i === 0 ? '<span class="ici-tag">Cette année</span>' : '') + '</h3><small>Année personnelle ' + a.n + '</small></div></div><p>' + A.texte + '</p><p style="margin:0"><b>Ta piste :</b> ' + A.piste + '</p></div>';
      }).join(''));

    // 12-13. Mois
    var ap = annees[0].n, moisH = [];
    for (var mm = 1; mm <= 12; mm++) {
      var nm = N.reduire(ap + mm, false), L = N.MOIS_LONG[nm];
      moisH.push('<div class="bloc' + (mm === auj.getMonth() + 1 ? ' doux' : '') + '"><h4>' + MOIS_NOMS[mm - 1].charAt(0).toUpperCase() + MOIS_NOMS[mm - 1].slice(1) + ' ' + an + ' <span>Mois ' + nm + '</span></h4><p style="margin-bottom:1mm"><b>' + L.titre + '.</b> ' + L.texte + '</p>' +
        '<ul>' + L.gestes.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p class="q" style="margin:0">' + L.question + '</p></div>');
    }
    page('Tes douze mois de l\'année', '<p class="sur">Mois par mois</p><h2>Tes douze mois ' + an + '</h2><p class="intro">Chaque mois a sa couleur, à l\'intérieur de ton année ' + ap + '. Pour chacun : sa tonalité, deux gestes simples et une question à garder en tête.</p><div class="mois">' + moisH.slice(0, 6).join('') + '</div>');
    page('Tes douze mois (suite)', '<p class="sur">Mois par mois</p><h2>Tes douze mois ' + an + ' (suite)</h2><div class="mois">' + moisH.slice(6).join('') + '</div>', false);

    // 14. Lignée
    page('Ta lignée en nombres', '<p class="sur">Ta famille</p><h2>Ta lignée en nombres</h2>' +
      '<p>Quand on calcule les nombres de toute une famille, des échos apparaissent : le même chemin de vie chez une mère et sa fille, un nombre qui revient sur trois générations, un autre qui n\'apparaît jamais. Ton nombre héréditaire, le <b>' + t.hereditaire + '</b>, te relie déjà à la lignée de ton nom.</p>' +
      '<div class="bloc doux"><h4>Calculer un chemin de vie à la main</h4><p style="margin:0">Additionne tous les chiffres de la date de naissance, puis réduis jusqu\'à un seul chiffre (garde 11, 22 et 33). Exemple : 14/03/1952 donne 1+4+0+3+1+9+5+2 = 25, puis 2+5 = <b>7</b>.</p></div>' +
      '<table><thead><tr><th style="width:28%">Personne</th><th style="width:22%">Date de naissance</th><th style="width:16%">Chemin de vie</th><th>Ce que tu remarques</th></tr></thead><tbody>' +
      '<tr><td><b>Toi</b></td><td>' + dateFr(t.date) + '</td><td><b>' + t.chemin + '</b></td><td></td></tr>' +
      ['Ta mère', 'Ton père', 'Ta grand-mère maternelle', 'Ton grand-père maternel', 'Ta grand-mère paternelle', 'Ton grand-père paternel', 'Un frère ou une sœur', 'Un frère ou une sœur'].map(function (x) { return '<tr><td class="v">' + x + '</td><td></td><td></td><td></td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="note">Plus simple : dessine ton arbre sur genesolia.fr. L\'outil calcule les nombres de chacun·e et te montre les échos d\'une génération à l\'autre.</p>');

    // 15. Questions
    var Q = QUESTIONS[t.chemin] || QUESTIONS[N.base(t.chemin)];
    page('Questions pour aller plus loin', '<p class="sur">Ton carnet</p><h2>Questions pour aller plus loin</h2><p class="intro">Inspirées de ton chemin de vie ' + t.chemin + '. Prends le temps d\'écrire, sans te relire tout de suite.</p>' +
      Q.map(function (q) { return '<div style="margin-top:4mm;break-inside:avoid"><h4>' + q + '</h4>' + lignes(5) + '</div>'; }).join('') +
      '<div style="margin-top:4mm;break-inside:avoid"><h4>Ce que je retiens de mon thème</h4>' + lignes(5) + '</div>');

    // 16. Détail des calculs
    var dp = detailNom(N, t.prenoms), dn = detailNom(N, t.nom);
    var chif = t.date.replace(/\D/g, '').split('');
    page('Le détail de tes calculs', '<p class="sur">Pour vérifier</p><h2>Le détail de tes calculs</h2>' +
      '<p class="intro">Chaque lettre vaut un nombre : A, J, S = 1 · B, K, T = 2 · C, L, U = 3 · D, M, V = 4 · E, N, W = 5 · F, O, X = 6 · G, P, Y = 7 · H, Q, Z = 8 · I, R = 9. Les voyelles (sur fond rosé) donnent le nombre intime, les consonnes le nombre de réalisation.</p>' +
      '<h4>Tes prénoms</h4><div class="lettres">' + dp.html + '</div><h4>Ton nom de naissance</h4><div class="lettres">' + dn.html + '</div>' +
      '<table class="calc"><tbody>' +
      '<tr><td>Chemin de vie</td><td>' + chif.join(' + ') + ' = ' + chif.reduce(function (s, c) { return s + +c; }, 0) + '</td><td><b>' + t.chemin + '</b></td></tr>' +
      '<tr><td>Expression</td><td>toutes les lettres : ' + (dp.total + dn.total) + '</td><td><b>' + t.expression + '</b></td></tr>' +
      '<tr><td>Nombre intime</td><td>les voyelles : ' + (dp.voy + dn.voy) + '</td><td><b>' + t.intime + '</b></td></tr>' +
      '<tr><td>Réalisation</td><td>les consonnes : ' + (dp.cons + dn.cons) + '</td><td><b>' + t.realisation + '</b></td></tr>' +
      '<tr><td>Héréditaire</td><td>le nom de naissance : ' + dn.total + '</td><td><b>' + t.hereditaire + '</b></td></tr>' +
      (t.actif ? '<tr><td>Nombre actif</td><td>le premier prénom</td><td><b>' + t.actif + '</b></td></tr>' : '') +
      '<tr><td>Maturité</td><td>chemin de vie + expression</td><td><b>' + t.maturite + '</b></td></tr>' +
      '<tr><td>Jour de naissance</td><td>le ' + J + '</td><td><b>' + t.jour + '</b></td></tr>' +
      '<tr><td>Année personnelle ' + an + '</td><td>jour + mois de naissance + ' + an + '</td><td><b>' + ap + '</b></td></tr>' +
      '</tbody></table><p class="note">Les sommes sont réduites à un seul chiffre, sauf les nombres maîtres 11, 22 et 33 qui sont conservés.</p>');

    // 17. Fin
    secs.push('<section class="page"><div class="fin"><p class="sur">Et maintenant ?</p><h2>Ton histoire continue dans ta famille</h2>' +
      '<div class="bloc"><h4>Dessine ton arbre familial</h4><p style="margin:0">Sur genesolia.fr, l\'outil gratuit calcule les nombres de toute ta lignée et repère ce qui se répète : prénoms, âges, dates, chemins de vie.</p></div>' +
      '<div class="bloc"><h4>Le Cercle</h4><p style="margin:0">Chaque mois, ton mois personnel en numérologie, les dates de ton arbre et un carnet à imprimer. Le premier carnet est offert.</p></div>' +
      '<p class="note">Livret créé le ' + auj.getDate() + ' ' + MOIS_NOMS[auj.getMonth()] + ' ' + an + ' sur genesolia.fr. Lecture symbolique, pour t\'aider à réfléchir. La numérologie ne prédit pas l\'avenir.</p></div></section>');

    var couv = '<section class="page"><div class="couv"><div class="marque">Genesolia</div><div><p class="sur">Livret numérologique complet</p><h1>Le thème de ' + esc(prenom) + '</h1><p>Né·e le ' + dateFr(t.date) + '</p></div>' +
      '<div><div class="chiffre">' + t.chemin + '</div><p>Chemin de vie ' + t.chemin + ' · ' + NB[t.chemin].nom + '<br>Expression ' + t.expression + ' · Héréditaire ' + t.hereditaire + ' · Année ' + an + ' : ' + ap + '</p></div>' +
      '<div class="pied">genesolia.fr · Lecture symbolique, pour réfléchir à ton histoire</div></div></section>';
    var lireH = '<section class="page">' + lire.replace('%SOMMAIRE%', som.map(function (s) { return '<li>' + s + '</li>'; }).join('')) + '</section>';
    var corps = couv + secs.join('').replace('%LIRE%', lireH);
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><base href="' + esc(location.href) + '"><title>Livret numérologique · ' + esc(prenom) + ' · Genesolia</title><style>' + css() + '</style></head><body>' + corps + '</body></html>';
  }

  function imprimer(t, btn) {
    var N = window.Numerologie;
    var lib = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Préparation du livret…'; }
    var f = document.createElement('iframe');
    f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    document.body.appendChild(f);
    var doc = f.contentDocument; doc.open(); doc.write(html(N, t)); doc.close();
    var pret = (doc.fonts && doc.fonts.ready) ? doc.fonts.ready : Promise.resolve();
    Promise.race([pret, new Promise(function (ok) { setTimeout(ok, 2500); })]).then(function () {
      setTimeout(function () {
        f.contentWindow.focus(); f.contentWindow.print();
        if (btn) { btn.disabled = false; btn.textContent = lib; }
        setTimeout(function () { f.remove(); }, 3000);
      }, 300);
    });
    if (window.umami) try { window.umami.track('livret-numerologie'); } catch (x) {}
  }

  window.LivretNumerologie = { imprimer: imprimer, html: function (t) { return html(window.Numerologie, t); } };
})();
