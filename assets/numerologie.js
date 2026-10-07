/* Genesolia · numérologie : calculs et textes, partagés par la page du thème et l'arbre familial */
(function () {
  'use strict';

  var VALEUR = { A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3, D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6, G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9 };
  var VOYELLES = 'AEIOUY';
  var MAITRES = [11, 22, 33];
  var DETTES = [13, 14, 16, 19];

  function lettres(txt) {
    return String(txt || '').replace(/œ/gi, 'oe').replace(/æ/gi, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  }
  function sommeChiffres(n) { return String(n).split('').reduce(function (s, c) { return s + +c; }, 0); }
  function reduire(n, garderMaitres) {
    while (n > 9 && !(garderMaitres && MAITRES.indexOf(n) >= 0)) n = sommeChiffres(n);
    return n;
  }
  /* toutes les étapes d'une réduction (pour repérer 13, 14, 16, 19) */
  function etapes(n) { var e = [n]; while (n > 9) { n = sommeChiffres(n); e.push(n); } return e; }
  function somme(l, filtre) {
    var s = 0;
    for (var i = 0; i < l.length; i++) if (!filtre || filtre(l[i])) s += VALEUR[l[i]] || 0;
    return s;
  }
  function chiffres(txt) { return String(txt).replace(/\D/g, '').split('').reduce(function (s, c) { return s + +c; }, 0); }
  function base(n) { return reduire(n, false); }
  function anneePerso(jour, mois, annee) { return reduire(chiffres(jour) + chiffres(mois) + chiffres(annee), false); }
  function ageA(date, auj) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || ''); if (!m) return null;
    var a = auj.getFullYear() - +m[1];
    if (auj.getMonth() + 1 < +m[2] || (auj.getMonth() + 1 === +m[2] && auj.getDate() < +m[3])) a--;
    return a;
  }

  /* date : 'AAAA-MM-JJ' ; prenoms, nom : texte libre ; auj : Date (facultatif) */
  function theme(prenoms, nom, date, auj) {
    auj = auj || new Date();
    var lp = lettres(prenoms), ln = lettres(nom), tout = lp + ln;
    var r = { prenoms: prenoms, nom: nom, date: date, dettes: [] };
    function dette(brut, ou) {
      etapes(brut).forEach(function (v) {
        if (DETTES.indexOf(v) >= 0 && !r.dettes.some(function (d) { return d.n === v && d.ou === ou; })) r.dettes.push({ n: v, ou: ou });
      });
    }
    if (tout) {
      var sTout = somme(tout), sVoy = somme(tout, function (c) { return VOYELLES.indexOf(c) >= 0; }), sCons = sTout - sVoy;
      r.expression = reduire(sTout, true); dette(sTout, 'expression');
      r.intime = reduire(sVoy, true); dette(sVoy, 'intime');
      r.realisation = reduire(sCons, true); dette(sCons, 'realisation');
      var premier = lettres(String(prenoms || '').trim().split(/[\s,]+/)[0]);
      if (premier) r.actif = reduire(somme(premier), true);
      if (ln) r.hereditaire = reduire(somme(ln), true);
      var g = {}; for (var k = 1; k <= 9; k++) g[k] = 0;
      for (var i = 0; i < tout.length; i++) g[VALEUR[tout[i]]]++;
      r.grille = g;
      r.absents = Object.keys(g).filter(function (k) { return !g[k]; }).map(Number);
      var max = 0; Object.keys(g).forEach(function (k) { if (g[k] > max) max = g[k]; });
      r.dominants = Object.keys(g).filter(function (k) { return g[k] === max && max > 0; }).map(Number);
      var pl = { mental: 0, physique: 0, emotionnel: 0, intuitif: 0 };
      for (var j = 0; j < tout.length; j++) for (var cle in PLANS) if (PLANS[cle].lettres.indexOf(tout[j]) >= 0) pl[cle]++;
      r.plans = pl;
      r.planDominant = Object.keys(pl).sort(function (a, b) { return pl[b] - pl[a]; })[0];
    }
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '');
    if (m) {
      var J = +m[3], M = +m[2], A = +m[1];
      var brutDate = chiffres(date);
      r.chemin = reduire(brutDate, true); dette(brutDate, 'chemin');
      r.jour = reduire(J, true); if (DETTES.indexOf(J) >= 0) dette(J, 'jour');
      if (r.expression) r.maturite = reduire(base(r.chemin) + base(r.expression), true);
      r.annee = anneePerso(J, M, auj.getFullYear());
      r.mois = reduire(r.annee + auj.getMonth() + 1, false);
      r.journee = reduire(r.mois + auj.getDate(), false);
      r.age = ageA(date, auj);
      // Cycles, réalisations et défis
      var a = base(M), b = base(J), c = base(chiffres(A));
      var fin1 = 36 - base(r.chemin);
      r.cycles = [
        { n: reduire(M, true), de: 0, a: fin1 },
        { n: reduire(J, true), de: fin1, a: fin1 + 27 },
        { n: reduire(chiffres(A), true), de: fin1 + 27, a: null }
      ];
      var r1 = reduire(a + b, true), r2 = reduire(b + c, true);
      r.periodes = [
        { n: r1, defi: Math.abs(a - b), de: 0, a: fin1 },
        { n: r2, defi: Math.abs(b - c), de: fin1, a: fin1 + 9 },
        { n: reduire(base(r1) + base(r2), true), defi: Math.abs(Math.abs(a - b) - Math.abs(b - c)), de: fin1 + 9, a: fin1 + 18 },
        { n: reduire(a + c, true), defi: Math.abs(a - c), de: fin1 + 18, a: null }
      ];
      r.defiPrincipal = r.periodes[2].defi;
      r.periodeActuelle = periodeA(r, r.age);
      r.cycleActuel = r.cycles.filter(function (cy) { return r.age >= cy.de && (cy.a == null || r.age < cy.a); })[0] || null;
    }
    r.dettes.sort(function (x, y) { return x.n - y.n; });
    return r;
  }
  /* la réalisation (période) vécue à un âge donné */
  function periodeA(t, age) {
    if (!t.periodes || age == null) return null;
    for (var i = 0; i < t.periodes.length; i++) { var p = t.periodes[i]; if (age >= p.de && (p.a == null || age < p.a)) return { index: i, n: p.n, defi: p.defi, de: p.de, a: p.a }; }
    return null;
  }

  var PLANS = {
    mental: { nom: 'Mental', lettres: 'AHJNP', theme: 'la réflexion, les idées, la logique', texte: "Tu fonctionnes d'abord par la réflexion : tu as besoin de comprendre avant d'agir." },
    physique: { nom: 'Physique', lettres: 'DEMW', theme: "l'action, le concret, le corps", texte: "Tu fonctionnes d'abord par l'action : tu as besoin de concret et de résultats visibles." },
    emotionnel: { nom: 'Émotionnel', lettres: 'BIORSTXZ', theme: 'les sentiments, la sensibilité, les relations', texte: "Tu fonctionnes d'abord par le cœur : tes relations et tes ressentis guident tes choix." },
    intuitif: { nom: 'Intuitif', lettres: 'CFGKLQUVY', theme: "l'imagination, les ressentis, le sens", texte: "Tu fonctionnes d'abord par l'intuition : tu sens les choses avant de pouvoir les expliquer." }
  };

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
      intro: "Il décrit ce que ta lignée te transmet à travers ton nom : des forces, une couleur, des questions qui traversent les générations." },
    actif: { titre: 'Ton nombre actif', calcul: 'Ton premier prénom',
      intro: "Il décrit la façon dont tu te présentes au quotidien, celle que les autres découvrent en premier." },
    jour: { titre: 'Ton jour de naissance', calcul: 'Le jour du mois où tu es né·e',
      intro: "Il révèle un talent naturel, une facilité que tu as reçue en arrivant au monde." }
  };

  /* Un texte propre à chaque nombre, pour chaque position */
  var TEXTES = {
    chemin: {
      1: "Ton chemin te demande d'apprendre à avancer par toi-même. La vie te place souvent en situation de décider, de commencer, d'ouvrir la voie, parfois seul·e. Plus tu oses suivre ta propre direction, plus les choses se mettent en place.",
      2: "Ton chemin passe par les autres. La vie t'apprend la coopération, la patience et l'art de trouver ta juste place dans la relation. Ton défi est de rester toi-même au milieu des autres, sans t'effacer.",
      3: "Ton chemin est celui de l'expression. La vie t'invite à communiquer, à créer, à partager ta joie et tes idées. Tu avances quand tu te montres, et tu stagnes quand tu te tais.",
      4: "Ton chemin se construit pas à pas. La vie te demande des efforts réguliers, de l'organisation et de la patience, et te récompense par des résultats solides. Tu apprends que la lenteur n'est pas un échec.",
      5: "Ton chemin est fait de mouvement. Changements, voyages, rencontres, rebondissements : la vie t'apprend la liberté et l'adaptation. Ton défi est de choisir ta liberté plutôt que de la subir.",
      6: "Ton chemin passe par l'amour et les responsabilités. Famille, couple, foyer, engagements : la vie te confie souvent des personnes à accompagner. Tu apprends à aimer sans te sacrifier.",
      7: "Ton chemin est intérieur. La vie te pousse à comprendre, à chercher le sens, parfois à travers des périodes de solitude. Tu avances en écoutant ta propre sagesse plutôt que l'avis des autres.",
      8: "Ton chemin est celui de la réalisation concrète. La vie te met face à des défis matériels, à des questions d'argent ou de pouvoir, et te donne la force de les traverser. Tu apprends à utiliser ta puissance avec justesse.",
      9: "Ton chemin est tourné vers les autres et vers le monde. La vie t'apprend le don, la compréhension, et l'art de clore les chapitres pour passer au suivant. Tu grandis chaque fois que tu laisses partir ce qui est terminé.",
      11: "Ton chemin est celui de l'inspiration. La vie te rend très sensible et te donne une intuition forte, que tu es invité·e à mettre au service des autres. Les périodes d'intensité alternent avec des moments où tu vis ton chemin comme un 2.",
      22: "Ton chemin est celui des grands projets. La vie te donne la capacité de bâtir quelque chose de durable et d'utile au plus grand nombre. La pression peut être forte : tu vis aussi ce chemin comme un 4, pas à pas.",
      33: "Ton chemin est celui du don et de la transmission. La vie t'appelle à accompagner, à enseigner, à faire grandir les autres avec beaucoup d'amour. Tu vis aussi ce chemin comme un 6, en apprenant tes propres limites."
    },
    expression: {
      1: "Tu agis avec assurance et indépendance. Les autres te voient comme quelqu'un qui décide et qui avance, parfois un peu vite. Tu es à ton meilleur quand tu as la main sur ce que tu entreprends.",
      2: "Tu agis avec tact et douceur. Les autres te voient comme quelqu'un d'à l'écoute, qui sait apaiser et rassembler. Tu es à ton meilleur dans la collaboration.",
      3: "Tu agis avec enthousiasme et créativité. Les autres te voient comme quelqu'un de communicatif et de vivant, qui met de la couleur partout. Tu es à ton meilleur quand tu peux t'exprimer.",
      4: "Tu agis avec méthode et sérieux. Les autres te voient comme quelqu'un de fiable, sur qui on peut compter. Tu es à ton meilleur quand tu construis quelque chose de concret.",
      5: "Tu agis avec vivacité et curiosité. Les autres te voient comme quelqu'un de libre et d'adaptable, toujours prêt·e à découvrir. Tu es à ton meilleur quand ta vie bouge.",
      6: "Tu agis avec cœur et sens des responsabilités. Les autres te voient comme quelqu'un de chaleureux, qui veille sur son entourage. Tu es à ton meilleur quand tu te sens utile aux autres.",
      7: "Tu agis avec réflexion et discrétion. Les autres te voient comme quelqu'un de profond, parfois un peu secret. Tu es à ton meilleur quand tu peux approfondir un sujet.",
      8: "Tu agis avec détermination et efficacité. Les autres te voient comme quelqu'un de solide, capable de mener de grands projets. Tu es à ton meilleur face aux défis.",
      9: "Tu agis avec générosité et ouverture. Les autres te voient comme quelqu'un de bienveillant, tourné vers les autres. Tu es à ton meilleur quand ce que tu fais a du sens pour le monde.",
      11: "Tu agis avec intuition et idéal. Les autres te voient comme quelqu'un d'inspirant, de différent, parfois difficile à cerner. Tu es à ton meilleur quand tu suis ta vision.",
      22: "Tu agis avec vision et ambition. Les autres te voient comme quelqu'un capable de transformer une idée en réalité. Tu es à ton meilleur dans les projets d'envergure.",
      33: "Tu agis avec dévouement et bienveillance. Les autres te voient comme quelqu'un sur qui s'appuyer, qui donne beaucoup. Tu es à ton meilleur quand tu transmets."
    },
    intime: {
      1: "Au fond de toi, tu as besoin d'autonomie et de reconnaissance. Tu te sens bien quand tu peux décider pour toi-même et être fier·e de ce que tu accomplis.",
      2: "Au fond de toi, tu as besoin d'harmonie et de lien. Tu te sens bien quand tu te sens aimé·e et en accord avec les personnes qui comptent.",
      3: "Au fond de toi, tu as besoin de t'exprimer et de partager. Tu te sens bien quand ta vie est joyeuse, créative et entourée.",
      4: "Au fond de toi, tu as besoin de sécurité et de stabilité. Tu te sens bien quand ta vie est ordonnée et que tu sais où tu vas.",
      5: "Au fond de toi, tu as besoin de liberté et de nouveauté. Tu te sens bien quand ta vie bouge et te surprend.",
      6: "Au fond de toi, tu as besoin d'aimer et d'être utile aux tiens. Tu te sens bien dans un foyer harmonieux, entouré·e des personnes que tu aimes.",
      7: "Au fond de toi, tu as besoin de comprendre et de temps pour toi. Tu te sens bien dans le calme, la lecture et la réflexion.",
      8: "Au fond de toi, tu as besoin de réussir et de maîtriser ta vie. Tu te sens bien quand tes efforts portent des fruits concrets.",
      9: "Au fond de toi, tu as besoin de donner du sens et d'aider. Tu te sens bien quand tu contribues à quelque chose de plus grand que toi.",
      11: "Au fond de toi, tu as besoin d'idéal et de spiritualité. Tu te sens bien quand ce que tu vis a du sens et peut inspirer les autres.",
      22: "Au fond de toi, tu as besoin de bâtir quelque chose qui dure. Tu te sens bien quand tu œuvres pour un projet qui te dépasse.",
      33: "Au fond de toi, tu as besoin d'aimer sans compter. Tu te sens bien quand tu aides les autres à grandir."
    },
    realisation: {
      1: "Tu concrétises en prenant les devants. Tu te montres affirmé·e et direct·e, et tu préfères souvent agir seul·e.",
      2: "Tu concrétises en coopérant. Tu avances mieux à deux ou en équipe, avec diplomatie et patience.",
      3: "Tu concrétises par la parole et la création. Tu te montres souriant·e et sociable, et tu réussis dans ce qui demande de communiquer.",
      4: "Tu concrétises par un travail régulier. Tu te montres organisé·e et rigoureux·se, et tes réalisations sont solides.",
      5: "Tu concrétises par l'adaptation. Tu te montres dynamique, et tu réussis dans ce qui bouge, change et demande de la souplesse.",
      6: "Tu concrétises en t'engageant. Tu te montres responsable et attentionné·e, et tu réussis quand tu œuvres pour les autres.",
      7: "Tu concrétises par l'analyse. Tu te montres réservé·e, et tu réussis dans ce qui demande réflexion et expertise.",
      8: "Tu concrétises avec force. Tu te montres ambitieux·se et efficace, et tu réussis dans la gestion et les projets d'envergure.",
      9: "Tu concrétises en servant une cause. Tu te montres ouvert·e et généreux·se, et tu réussis dans ce qui a une dimension humaine.",
      11: "Tu concrétises par l'inspiration. Tu te montres original·e, et tu réussis quand tu suis ton intuition.",
      22: "Tu concrétises en grand. Tu te montres bâtisseur·se, et tu réussis dans les projets ambitieux et utiles.",
      33: "Tu concrétises par le don. Tu te montres dévoué·e, et tu réussis dans la transmission et l'accompagnement."
    },
    maturite: {
      1: "Avec les années, tu gagnes en indépendance. La seconde partie de ta vie t'invite à affirmer tes choix et à vivre davantage pour toi.",
      2: "Avec les années, tu gagnes en douceur et en sens du lien. La seconde partie de ta vie s'ouvre sur des relations plus apaisées.",
      3: "Avec les années, tu gagnes en légèreté. La seconde partie de ta vie t'invite à créer, à t'exprimer et à profiter.",
      4: "Avec les années, tu gagnes en stabilité. La seconde partie de ta vie te permet de récolter ce que tu as construit.",
      5: "Avec les années, tu gagnes en liberté. La seconde partie de ta vie t'ouvre de nouveaux horizons.",
      6: "Avec les années, tu gagnes en harmonie. La seconde partie de ta vie se tourne vers le foyer, la famille et l'amour.",
      7: "Avec les années, tu gagnes en sagesse. La seconde partie de ta vie t'invite à l'intériorité et à transmettre ce que tu as compris.",
      8: "Avec les années, tu gagnes en assurance. La seconde partie de ta vie peut t'apporter réussite et reconnaissance.",
      9: "Avec les années, tu gagnes en ouverture. La seconde partie de ta vie t'invite à transmettre et à t'engager pour les autres.",
      11: "Avec les années, ton intuition s'affirme. La seconde partie de ta vie t'invite à inspirer et à guider.",
      22: "Avec les années, tes grands projets prennent forme. La seconde partie de ta vie peut voir naître une œuvre durable.",
      33: "Avec les années, tu deviens un repère pour les autres. La seconde partie de ta vie se tourne vers la transmission."
    },
    hereditaire: {
      1: "Ton nom te relie à une lignée qui a dû s'affirmer : partir, fonder, recommencer. Elle te transmet le courage d'ouvrir ta propre voie.",
      2: "Ton nom te relie à une lignée de liens et d'alliances, où l'on a souvent maintenu l'unité. Elle te transmet le sens de la relation, et la question de ta propre place.",
      3: "Ton nom te relie à une lignée où la parole et les talents comptent, même quand ils n'ont pas pu s'exprimer. Elle te transmet le désir de créer et de dire.",
      4: "Ton nom te relie à une lignée de travail et de construction. Elle te transmet la solidité, et parfois le poids du devoir.",
      5: "Ton nom te relie à une lignée de mouvements : départs, déménagements, exils. Elle te transmet le goût de la liberté, et la question de l'enracinement.",
      6: "Ton nom te relie à une lignée tournée vers la famille et les responsabilités. Elle te transmet le sens du foyer, et parfois celui du sacrifice.",
      7: "Ton nom te relie à une lignée de silences et de questions. Elle te transmet le besoin de comprendre, et peut-être des secrets à éclairer.",
      8: "Ton nom te relie à une lignée où l'argent, le travail et le pouvoir ont compté. Elle te transmet la force de bâtir, et des histoires de pertes et de reconstructions.",
      9: "Ton nom te relie à une lignée de dons et de fins de cycle. Elle te transmet le sens des autres, et l'invitation à clore ce qui doit l'être.",
      11: "Ton nom te relie à une lignée sensible, où l'on a ressenti fort. Elle te transmet une intuition précieuse.",
      22: "Ton nom te relie à une lignée de bâtisseurs et de bâtisseuses : une maison, une terre, une entreprise. Elle te transmet l'envie de construire grand.",
      33: "Ton nom te relie à une lignée de dévouement. Elle te transmet le sens du don, et l'invitation à ne pas t'y oublier."
    },
    actif: {
      1: "Ton premier prénom te donne de l'élan et de l'audace au quotidien. Les autres te découvrent volontaire et direct·e.",
      2: "Ton premier prénom te donne de la douceur et le sens du contact. Les autres te découvrent attentif·ve et conciliant·e.",
      3: "Ton premier prénom te donne de la gaieté et de l'aisance à communiquer. Les autres te découvrent souriant·e et sociable.",
      4: "Ton premier prénom te donne de la constance et de l'organisation. Les autres te découvrent sérieux·se et fiable.",
      5: "Ton premier prénom te donne de la vivacité et le goût du changement. Les autres te découvrent curieux·se et libre.",
      6: "Ton premier prénom te donne de la chaleur et le sens des responsabilités. Les autres te découvrent accueillant·e et protecteur·rice.",
      7: "Ton premier prénom te donne de la réflexion et un besoin de calme. Les autres te découvrent réservé·e et profond·e.",
      8: "Ton premier prénom te donne de l'assurance et de l'efficacité. Les autres te découvrent solide et déterminé·e.",
      9: "Ton premier prénom te donne de la générosité et de l'ouverture. Les autres te découvrent bienveillant·e et tourné·e vers eux.",
      11: "Ton premier prénom te donne une sensibilité et une intuition très vives. Les autres te découvrent inspirant·e et singulier·ère.",
      22: "Ton premier prénom te donne de l'ambition et une vision large. Les autres te découvrent capable de grandes choses.",
      33: "Ton premier prénom te donne beaucoup de bienveillance. Les autres te découvrent comme un appui."
    },
    jour: {
      1: "Ton talent : lancer les choses et décider. Tu sais prendre l'initiative quand les autres hésitent.",
      2: "Ton talent : l'écoute et la médiation. Tu sais rapprocher les personnes et apaiser les tensions.",
      3: "Ton talent : la parole, l'humour et la création. Tu sais mettre de la vie dans ce que tu touches.",
      4: "Ton talent : organiser et construire. Tu sais transformer une idée en plan concret.",
      5: "Ton talent : t'adapter et convaincre. Tu sais rebondir quand tout change.",
      6: "Ton talent : accueillir et veiller sur les autres. Tu sais créer un lieu où l'on se sent bien.",
      7: "Ton talent : analyser et comprendre en profondeur. Tu sais voir ce qui échappe aux autres.",
      8: "Ton talent : gérer et mener des projets. Tu sais prendre les commandes quand il le faut.",
      9: "Ton talent : comprendre les autres et transmettre. Tu sais trouver les mots qui aident.",
      11: "Ton talent : ressentir et inspirer. Tu sais percevoir ce qui n'est pas dit.",
      22: "Ton talent : concrétiser des projets ambitieux. Tu sais voir grand et rester pratique."
    }
  };

  var CYCLES = {
    intro: "Ta vie se déroule en trois grands cycles : la jeunesse, qui vient de ton mois de naissance ; l'âge adulte, qui vient de ton jour de naissance ; et la maturité, qui vient de ton année de naissance.",
    noms: ['La jeunesse', "L'âge adulte", 'La maturité'],
    1: "Un cycle où tu apprends à t'affirmer et à te débrouiller seul·e.",
    2: "Un cycle tourné vers les relations, la sensibilité et la coopération.",
    3: "Un cycle d'expression, de créativité et de vie sociale.",
    4: "Un cycle de travail, d'efforts et de construction.",
    5: "Un cycle de mouvements, de changements et de découvertes.",
    6: "Un cycle centré sur la famille, le foyer et les responsabilités.",
    7: "Un cycle de réflexion, d'études et de recherche intérieure.",
    8: "Un cycle d'ambition, de réalisations matérielles et de pouvoir personnel.",
    9: "Un cycle d'ouverture, de don et de fins de chapitres.",
    11: "Un cycle d'intensité et d'inspiration, où ta sensibilité est très présente.",
    22: "Un cycle de grands projets, où tu peux bâtir quelque chose de durable.",
    33: "Un cycle de dévouement et de transmission."
  };

  var PERIODES = {
    intro: "Ta vie traverse quatre grandes périodes, appelées réalisations. Chacune a sa couleur, ses occasions et son défi. Les âges de passage sont calculés à partir de ton chemin de vie.",
    1: "Une période pour t'affirmer, prendre des initiatives et gagner en autonomie.",
    2: "Une période favorable aux associations, au couple et à la patience.",
    3: "Une période propice à la créativité, à la communication et aux rencontres.",
    4: "Une période de travail sérieux, où tu poses des fondations solides.",
    5: "Une période de changements, de voyages et de liberté retrouvée.",
    6: "Une période tournée vers le foyer, la famille et les engagements.",
    7: "Une période de recul, d'études et de connaissance de toi.",
    8: "Une période de réussite matérielle et de responsabilités importantes.",
    9: "Une période d'accomplissement, de don et de fin de cycle.",
    11: "Une période d'inspiration, où ton intuition peut te guider vers un rôle important.",
    22: "Une période où de grands projets peuvent se concrétiser.",
    33: "Une période de transmission et de dévouement."
  };

  var DEFIS = {
    intro: "Chaque période a son défi : un apprentissage qui revient tant qu'il n'est pas vécu. Le défi principal t'accompagne toute ta vie.",
    0: "Le défi du choix : tu as toutes les possibilités, et c'est à toi de choisir ta direction.",
    1: "Le défi de l'affirmation : oser exister et décider, sans dépendre de l'avis des autres.",
    2: "Le défi de la sensibilité : ne pas te laisser submerger par tes émotions, ni par celles des autres.",
    3: "Le défi de l'expression : oser te montrer et dire ce que tu ressens.",
    4: "Le défi de la persévérance : tenir dans la durée, sans rigidité.",
    5: "Le défi de la liberté : ne pas fuir, et accepter de t'engager.",
    6: "Le défi des responsabilités : ne pas tout porter, et accepter les autres tels qu'ils sont.",
    7: "Le défi de la confiance : t'ouvrir aux autres et faire confiance à la vie.",
    8: "Le défi de la matière : trouver une relation juste à l'argent et au pouvoir."
  };

  var APPRENTISSAGES = {
    intro: "En numérologie, quand les nombres 13, 14, 16 ou 19 apparaissent dans un calcul, on parle de dettes karmiques. Nous les voyons plutôt comme des nombres d'apprentissage : des leçons que tu es invité·e à vivre, et qui rejoignent souvent l'histoire de ta famille.",
    13: { titre: "L'apprentissage de l'effort", texte: "Construire patiemment, sans chercher de raccourci, et tenir tes engagements jusqu'au bout. Dans une lignée, le 13 évoque souvent un travail resté inachevé, ou des efforts qui n'ont pas été reconnus." },
    14: { titre: "L'apprentissage de la mesure", texte: "Vivre ta liberté sans excès, et trouver ton équilibre entre envies et engagements. Dans une lignée, le 14 évoque souvent des libertés perdues, ou au contraire des départs précipités." },
    16: { titre: "L'apprentissage de l'humilité", texte: "Accepter que certaines choses s'effondrent pour reconstruire plus juste, et ne pas t'appuyer seulement sur l'image. Dans une lignée, le 16 évoque souvent des chutes, des ruptures brutales ou des secrets." },
    19: { titre: "L'apprentissage de l'entraide", texte: "Oser demander de l'aide, et ne pas tout faire seul·e pour prouver ta valeur. Dans une lignée, le 19 évoque souvent des personnes qui ont dû tout porter seules." }
  };
  var OU = { chemin: 'ton chemin de vie', expression: 'ton nombre d’expression', intime: 'ton nombre intime', realisation: 'ton nombre de réalisation', jour: 'ton jour de naissance' };

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

  var JOURNEES = {
    1: "Une journée pour commencer quelque chose.",
    2: "Une journée pour écouter et coopérer.",
    3: "Une journée pour t'exprimer et sourire.",
    4: "Une journée pour avancer sur tes tâches concrètes.",
    5: "Une journée pour accueillir l'imprévu.",
    6: "Une journée pour tes proches.",
    7: "Une journée pour te retrouver au calme.",
    8: "Une journée pour agir et décider.",
    9: "Une journée pour terminer et faire du tri."
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

  /* texte d'un nombre à une position (avec repli sur l'essence générale) */
  function texte(pos, n) { return (TEXTES[pos] && TEXTES[pos][n]) || (NOMBRES[n] && NOMBRES[n].essence) || ''; }
  function ages(de, a) { return a == null ? 'à partir de ' + de + ' ans' : (de === 0 ? 'de la naissance à ' + a + ' ans' : 'de ' + de + ' à ' + a + ' ans'); }

  window.Numerologie = { theme: theme, periodeA: periodeA, anneePerso: anneePerso, reduire: reduire, base: base, lettres: lettres, ageA: ageA, texte: texte, ages: ages,
    NOMBRES: NOMBRES, POSITIONS: POSITIONS, TEXTES: TEXTES, CYCLES: CYCLES, PERIODES: PERIODES, DEFIS: DEFIS, APPRENTISSAGES: APPRENTISSAGES, OU: OU,
    PLANS: PLANS, ANNEES: ANNEES, MOIS: MOIS, JOURNEES: JOURNEES, ABSENTS: ABSENTS };
})();
