/* Genesolia · numérologie : calculs et textes, partagés par la page du thème et l'arbre familial */
(function () {
  'use strict';

  var VALEUR = { A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3, D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6, G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9 };
  var VOYELLES = 'AEIOUY';
  var MAITRES = [11, 22, 33];

  function lettres(txt) {
    return String(txt || '').replace(/œ/gi, 'oe').replace(/æ/gi, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  }
  function reduire(n, garderMaitres) {
    while (n > 9 && !(garderMaitres && MAITRES.indexOf(n) >= 0)) {
      n = String(n).split('').reduce(function (s, c) { return s + +c; }, 0);
    }
    return n;
  }
  function somme(l, filtre) {
    var s = 0;
    for (var i = 0; i < l.length; i++) if (!filtre || filtre(l[i])) s += VALEUR[l[i]] || 0;
    return s;
  }
  function chiffres(txt) { return String(txt).replace(/\D/g, '').split('').reduce(function (s, c) { return s + +c; }, 0); }

  /* date : 'AAAA-MM-JJ' ; prenoms, nom : texte libre ; auj : Date (facultatif) */
  function theme(prenoms, nom, date, auj) {
    auj = auj || new Date();
    var lp = lettres(prenoms), ln = lettres(nom), tout = lp + ln;
    var r = { prenoms: prenoms, nom: nom, date: date };
    if (tout) {
      r.expression = reduire(somme(tout), true);
      r.intime = reduire(somme(tout, function (c) { return VOYELLES.indexOf(c) >= 0; }), true);
      r.realisation = reduire(somme(tout, function (c) { return VOYELLES.indexOf(c) < 0; }), true);
      var premier = lettres(String(prenoms || '').trim().split(/[\s,]+/)[0]);
      if (premier) r.actif = reduire(somme(premier), true);
      if (ln) r.hereditaire = reduire(somme(ln), true);
      var g = {}; for (var k = 1; k <= 9; k++) g[k] = 0;
      for (var i = 0; i < tout.length; i++) g[VALEUR[tout[i]]]++;
      r.grille = g;
      r.absents = Object.keys(g).filter(function (k) { return !g[k]; }).map(Number);
      var max = 0; Object.keys(g).forEach(function (k) { if (g[k] > max) max = g[k]; });
      r.dominants = Object.keys(g).filter(function (k) { return g[k] === max && max > 0; }).map(Number);
    }
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '');
    if (m) {
      r.chemin = reduire(chiffres(date), true);
      if (r.expression) r.maturite = reduire(reduire(r.chemin, false) + reduire(r.expression, false), true);
      r.annee = anneePerso(+m[3], +m[2], auj.getFullYear());
      r.mois = reduire(r.annee + auj.getMonth() + 1, false);
    }
    return r;
  }
  function anneePerso(jour, mois, annee) { return reduire(chiffres(jour) + chiffres(mois) + chiffres(annee), false); }
  function base(n) { return reduire(n, false); }

  var NOMBRES = {
    1: { nom: "L'élan", mots: ['initiative', 'indépendance', 'courage'],
      essence: "Le 1 est le nombre du commencement. Il porte l'envie d'avancer par toi-même, d'ouvrir des chemins et de prendre ta place.",
      force: "Tu sais décider, te lancer et entraîner les autres.",
      defi: "Accepter l'aide, et ne pas tout porter seul·e pour prouver que tu en es capable.",
      famille: "Dans une lignée, le 1 marque souvent celles et ceux qui ont dû partir, fonder ou tout recommencer." },
    2: { nom: 'Le lien', mots: ['écoute', 'coopération', 'sensibilité'],
      essence: "Le 2 est le nombre de la relation. Il cherche l'accord, la douceur et la juste place à côté des autres.",
      force: "Tu perçois ce que les autres ressentent et tu sais créer l'harmonie.",
      defi: "Oser dire ce que tu veux, même quand cela crée un désaccord.",
      famille: "Dans une lignée, le 2 évoque celles et ceux qui ont tenu la famille unie, parfois en s'oubliant." },
    3: { nom: "L'expression", mots: ['créativité', 'communication', 'joie'],
      essence: "Le 3 est le nombre de la parole et de la création. Il a besoin de s'exprimer, d'échanger et de partager ce qui l'anime.",
      force: "Ton enthousiasme, ton sens du contact et ta créativité.",
      defi: "Aller au bout de ce que tu commences, et ne pas cacher tes peines derrière ton sourire.",
      famille: "Dans une lignée, le 3 rappelle les talents mis de côté, les artistes empêchés, les mots qui n'ont pas pu être dits." },
    4: { nom: 'La construction', mots: ['stabilité', 'travail', 'fiabilité'],
      essence: "Le 4 est le nombre des fondations. Il bâtit pas à pas, avec méthode, quelque chose de solide et de durable.",
      force: "Ta constance, ton sérieux et ta capacité à rendre les choses concrètes.",
      defi: "Assouplir le cadre, accueillir l'imprévu et t'autoriser le repos.",
      famille: "Dans une lignée, le 4 parle de celles et ceux qui ont travaillé dur pour mettre la famille à l'abri, souvent sans se plaindre." },
    5: { nom: 'La liberté', mots: ['mouvement', 'curiosité', 'changement'],
      essence: "Le 5 est le nombre du mouvement. Il aime découvrir, voyager, essayer, et supporte mal ce qui l'enferme.",
      force: "Ton adaptabilité, ta curiosité et ton goût de la vie.",
      defi: "Trouver ta liberté sans fuir, et t'engager sans avoir l'impression de te perdre.",
      famille: "Dans une lignée, le 5 évoque les départs, les déménagements, les exils et les envies d'ailleurs." },
    6: { nom: 'Le foyer', mots: ['responsabilité', 'amour', 'harmonie'],
      essence: "Le 6 est le nombre du foyer et de l'engagement. Il prend soin des autres, il protège et cherche l'harmonie autour de lui.",
      force: "Ta loyauté, ton sens des responsabilités et ta générosité.",
      defi: "Prendre soin de toi autant que des autres, et laisser chacun·e porter sa part.",
      famille: "Dans une lignée, le 6 parle de celles et ceux qui ont porté la famille sur leurs épaules, parfois au prix de leurs propres envies." },
    7: { nom: 'La quête de sens', mots: ['réflexion', 'intériorité', 'recherche'],
      essence: "Le 7 est le nombre de la recherche intérieure. Il a besoin de comprendre, d'approfondir et de prendre du recul.",
      force: "Ta profondeur, ton intuition et ton esprit d'analyse.",
      defi: "Faire confiance aux autres, et ne pas t'isoler quand tu as besoin d'eux.",
      famille: "Dans une lignée, le 7 rappelle les secrets, les silences, et celles et ceux qui ont cherché à comprendre." },
    8: { nom: 'La puissance', mots: ['réalisation', 'ambition', 'matière'],
      essence: "Le 8 est le nombre de l'action concrète et de la réussite matérielle. Il a l'énergie de bâtir, de gérer et de transformer.",
      force: "Ta détermination, ton courage face aux épreuves et ton sens des réalités.",
      defi: "Trouver l'équilibre entre ce que tu possèdes et ce que tu vis, et lâcher le contrôle.",
      famille: "Dans une lignée, le 8 évoque les questions d'argent, d'héritage et de pouvoir, les pertes et les reconstructions." },
    9: { nom: "L'ouverture", mots: ['humanité', 'idéal', 'transmission'],
      essence: "Le 9 est le nombre de l'accomplissement et du don. Il voit large, il veut aider et transmettre.",
      force: "Ta générosité, ta compréhension des autres et ton idéal.",
      defi: "Savoir clore les chapitres, et accepter que tu ne peux pas sauver tout le monde.",
      famille: "Dans une lignée, le 9 parle de fins de cycle, de ce qui a été donné, perdu ou transmis aux générations suivantes." },
    11: { nom: "L'inspiration", mots: ['intuition', 'vision', 'idéal'], maitre: true,
      essence: "Le 11 est un nombre maître. Il porte une grande sensibilité et l'envie d'inspirer, d'éclairer ou de guider. Il se vit aussi comme un 2.",
      force: "Ton intuition, ta vision et ta capacité à toucher les autres.",
      defi: "Canaliser ton intensité, et ne pas exiger de toi d'être parfait·e.",
      famille: "Dans une lignée, le 11 évoque celles et ceux qui ont ressenti fort, parfois sans pouvoir le dire." },
    22: { nom: 'Le grand bâtisseur', mots: ['vision', 'construction', 'utilité'], maitre: true,
      essence: "Le 22 est un nombre maître. Il a l'ambition de construire quelque chose de grand et d'utile aux autres. Il se vit aussi comme un 4.",
      force: "Ta vision à long terme et ta capacité à concrétiser de grands projets.",
      defi: "Ne pas te laisser écraser par l'ampleur de ce que tu veux accomplir.",
      famille: "Dans une lignée, le 22 rappelle les grandes œuvres familiales : une maison, une entreprise, une terre, un nom à faire vivre." },
    33: { nom: 'Le don', mots: ['bienveillance', 'transmission', 'amour'], maitre: true,
      essence: "Le 33 est un nombre maître, plus rare. Il porte l'élan de transmettre, d'enseigner et de prendre soin des autres avec beaucoup d'amour. Il se vit aussi comme un 6.",
      force: "Ta bienveillance et ta capacité à faire grandir les autres.",
      defi: "Ne pas t'oublier dans le don, et savoir poser des limites.",
      famille: "Dans une lignée, le 33 évoque celles et ceux qui ont tout donné aux autres." }
  };

  var POSITIONS = {
    chemin: { titre: 'Ton chemin de vie', calcul: 'Calculé avec ta date de naissance',
      intro: "C'est le nombre le plus important de ton thème. Il décrit la route que tu parcours, les expériences qui reviennent et ce que tu viens apprendre en chemin." },
    expression: { titre: "Ton nombre d'expression", calcul: 'Toutes les lettres de tes prénoms et de ton nom de naissance',
      intro: "Il décrit ta façon d'agir et d'être au monde : tes talents naturels, et ce que les autres perçoivent de toi." },
    intime: { titre: 'Ton nombre intime', calcul: 'Les voyelles de tes prénoms et de ton nom',
      intro: "Il décrit tes motivations profondes : ce qui te nourrit vraiment, ce que tu désires au fond de toi." },
    realisation: { titre: 'Ton nombre de réalisation', calcul: 'Les consonnes de tes prénoms et de ton nom',
      intro: "Il décrit ta manière de concrétiser : comment tu passes à l'action et comment tu te montres." },
    maturite: { titre: 'Ton nombre de maturité', calcul: "Ton chemin de vie et ton nombre d'expression réunis",
      intro: "Il décrit ce qui se révèle avec les années : la direction vers laquelle ta vie t'amène, souvent à partir de la quarantaine." },
    hereditaire: { titre: 'Ton nombre héréditaire', calcul: 'Les lettres de ton nom de naissance',
      intro: "Il décrit ce que ta lignée te transmet à travers ton nom : des forces, une couleur, des questions qui traversent les générations." }
  };

  var ANNEES = {
    1: { titre: 'Une année de commencement', texte: "Une nouvelle période de neuf ans s'ouvre. C'est le moment de semer : lancer un projet, prendre une décision, oser quelque chose pour toi.", piste: "Choisis une chose que tu veux commencer cette année, et fais le premier pas ce mois-ci." },
    2: { titre: 'Une année de patience et de liens', texte: "Ce que tu as semé pousse lentement. L'année favorise les relations, la coopération et l'écoute de ce que tu ressens.", piste: "Prends soin d'une relation qui compte pour toi, et laisse le temps faire son œuvre." },
    3: { titre: "Une année d'expression", texte: "L'année t'invite à t'exprimer, à créer, à sortir et à rencontrer. Ta joie et ta parole ont besoin d'espace.", piste: "Reprends une activité créative, ou dis enfin quelque chose que tu gardes pour toi." },
    4: { titre: 'Une année de construction', texte: "C'est le temps de consolider : travailler, organiser, poser des bases solides. Les efforts de cette année comptent pour les suivantes.", piste: "Choisis un chantier concret et avance un peu chaque semaine." },
    5: { titre: 'Une année de changement', texte: "Le mouvement revient : changements, rencontres, envies d'ailleurs. L'année demande de la souplesse et un peu d'audace.", piste: "Accueille une nouveauté au lieu de la repousser." },
    6: { titre: "Une année de foyer et d'engagements", texte: "La famille, le couple, la maison et les responsabilités sont au centre. L'année t'invite à organiser ta vie autour de ce qui compte vraiment.", piste: "Regarde quels engagements te nourrissent, et lesquels tu portes par loyauté." },
    7: { titre: "Une année d'introspection", texte: "Une année plus intérieure, propice au recul, à la réflexion et à la compréhension de ton histoire. Un temps idéal pour explorer ton arbre familial.", piste: "Offre-toi des moments de calme, et note ce que tu comprends de ta famille." },
    8: { titre: 'Une année de réalisation', texte: "L'énergie se tourne vers le concret : l'argent, le travail, les projets d'envergure. Ce que tu as construit peut porter ses fruits.", piste: "Ose demander ce que tu vaux, et fais un pas concret vers un projet important." },
    9: { titre: 'Une année de fin de cycle', texte: "Une période de neuf ans se termine. C'est le moment de trier, de clore, de pardonner et de faire de la place pour la suite.", piste: "Choisis une chose à laisser derrière toi avant la fin de l'année." }
  };

  var MOIS = {
    1: "Un mois pour initier : commence ce que tu repousses.",
    2: "Un mois pour écouter, coopérer et prendre ton temps.",
    3: "Un mois pour t'exprimer, créer et voir du monde.",
    4: "Un mois pour t'organiser et avancer pas à pas.",
    5: "Un mois pour bouger et accueillir le changement.",
    6: "Un mois tourné vers ton foyer et tes proches.",
    7: "Un mois pour prendre du recul et te retrouver.",
    8: "Un mois pour agir concrètement et oser demander.",
    9: "Un mois pour terminer, trier et alléger."
  };

  var ABSENTS = {
    1: "l'affirmation de toi : oser décider pour toi-même.",
    2: "la coopération : accepter de recevoir et de faire équipe.",
    3: "l'expression : dire ce que tu ressens, créer, partager.",
    4: "la persévérance : t'organiser et tenir dans la durée.",
    5: "la liberté : accueillir le changement sans crainte.",
    6: "l'engagement : prendre ta place au sein du foyer sans t'y perdre.",
    7: "la confiance intérieure : écouter ta propre voix.",
    8: "ta relation à l'argent et à ta propre force.",
    9: "le lâcher-prise : savoir clore et transmettre."
  };

  window.Numerologie = { theme: theme, anneePerso: anneePerso, reduire: reduire, base: base, lettres: lettres,
    NOMBRES: NOMBRES, POSITIONS: POSITIONS, ANNEES: ANNEES, MOIS: MOIS, ABSENTS: ABSENTS };
})();
