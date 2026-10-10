/* Genesolia · Cycle 2 · Le carnet du module 1 de la formation « Sors de la boucle » : « La boucle et la spirale »
   Le carnet de chaque module reprend les exercices du cahier PDF de la formation, en version à remplir,
   avec le fil des 7 jours, l'outil du module, une page pour avancer vers ce que tu veux vivre, et le bilan.
   Il utilise le même livre que le carnet et le suivi (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 1,
  cle: 'module-1',
  page: 'mon-module.html',
  offert: true,
  titre: 'La boucle et la spirale',
  sousTitre: "Repérer ce qui se répète dans ta vie, pour enfin pouvoir faire autrement.",
  citation: "Ce qui revient n'est pas un échec. C'est une invitation à regarder.",
  seance: 'Sortir du pilote automatique',

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    pages: {
      ouverture: 'assets/guide/guide-boucle.webp',
      comprendre: 'assets/guide/guide-repete.webp',
      exercices: 'assets/guide/guide-spirale-douce.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-spirale-or.webp'
    }
  },

  mots: {
    ouverture: "Prends ce carnet comme un rendez-vous avec toi. Tu n'as rien à réussir : seulement à regarder, avec douceur.",
    comprendre: "Lis cette page lentement. Si une phrase te parle plus que les autres, c'est souvent celle qu'il te fallait.",
    exercices: "Écris sans te censurer. Tu peux faire les exercices en une fois ou sur plusieurs jours.",
    outil: "Un geste de moins d'une minute, répété chaque jour, vaut mieux qu'une grande résolution jamais tenue.",
    avancer: "Voir ta boucle libère de la place. Cette page t'aide à choisir ce que tu veux mettre à la place.",
    bilan: "Prends ce moment même si tout n'a pas été fait. C'est souvent là qu'on voit le chemin parcouru."
  },

  ouverture: {
    intro: "Dans ce premier module, tu apprends à remarquer le moment où ta boucle démarre. Commence par regarder la vidéo et écouter la séance « Sortir du pilote automatique » dans ton espace de formation, puis reviens ici pour pratiquer.",
    intensiteQ: "À quel point ce qui se répète dans ta vie pèse-t-il aujourd'hui ?",
    souhaitQ: "Qu'est-ce qui, dans ta vie, se passe toujours de la même façon, même quand tu voudrais que ce soit différent ?",
    souhaitPh: "Exemple : je dis oui à tout au travail, puis je rumine le soir que personne ne me respecte.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais remarquer le moment où je vais dire oui, et prendre une seconde avant de répondre.",
    phrasePh: "Exemple : ce qui revient est une invitation à regarder."
  },

  comprendre: {
    titre: 'Deux mouvements',
    chapeau: "Dans tout ce que tu vis, deux mouvements sont à l'œuvre. Les deux tournent, les deux reviennent. Mais l'un tourne sur place, et l'autre monte.",
    histoire: {
      titre: 'Une journée en pilote automatique',
      texte: [
        "6h45. Le réveil sonne. Inès tend la main pour l'éteindre, comme chaque matin depuis trois ans. Même café, même trajet, mêmes réponses : « Ça va, et toi ? »",
        "À 10h30, une collègue critique son travail. Inès sourit, remercie, puis rumine toute la journée ce qu'elle aurait dû répondre. Le soir, elle se couche en se disant : « Demain, je change. » Mais quoi, exactement ?",
        "Le lendemain, quand le réveil sonne, sa main reste suspendue dans l'air. Une question la traverse : « Est-ce que j'ai choisi cette journée ? » Ce moment-là, la main suspendue, c'est le début de tout. C'est l'instant où l'on remarque la boucle."
      ]
    },
    texte: [
      "**La boucle.** Une situation déclenche la même émotion, la même réaction, la même fin. Et la situation revient, avec d'autres personnes ou dans d'autres décors.",
      "**La spirale.** La situation peut revenir, mais tu la regardes autrement. Chaque tour se fait un peu plus haut. La spirale ne promet pas une vie sans difficulté : ce qui change, c'est la façon de les traverser. Comprendre un peu plus, choisir un peu plus, grandir à chaque tour."
    ],
    signes: [
      "La situation revient, avec d'autres personnes ou dans d'autres décors.",
      "Ta réaction part toute seule, plus vite que ta réflexion.",
      "Tu penses ou tu dis : « Encore ! » ou « C'est toujours pareil ».",
      "L'histoire finit souvent de la même manière."
    ],
    exemples: [
      "**En amour** · toujours le même type de partenaire, les mêmes disputes, la même peur d'être quittée.",
      "**Au travail** · ne jamais oser demander, tout porter seule, se sentir illégitime.",
      "**Avec l'argent** · il file dès qu'il arrive, ou l'on n'ose rien dépenser pour soi.",
      "**En famille** · les mêmes rôles à chaque repas, les mêmes non-dits."
    ],
    retenir: [
      "Une boucle, c'est un enchaînement automatique : déclencheur, émotion, réaction, conséquence.",
      "Elle revient dans plusieurs domaines de ta vie, souvent avec la même peur en dessous.",
      "La spirale, ce n'est pas éviter les difficultés : c'est les traverser en conscience, un tour plus haut.",
      "Le premier pas est simple : remarquer le moment où la boucle démarre. La main suspendue."
    ],
    question: { k: 'comp-resonne', q: "Laquelle de ces boucles courantes te ressemble le plus, et dans quel domaine de ta vie ?", ph: "Exemple : au travail, je porte tout seule et je n'ose jamais demander d'aide." }
  },

  exercicesIntro: "Les trois exercices de ton cahier, à remplir ici. Prends ton temps : tu peux les faire en une fois ou sur plusieurs jours, et y revenir quand tu veux.",
  exercices: [
    { k: 'ex1', type: 'tableau', titre: 'Ce qui me pèse, et ce que je crains',
      consigne: "Pour chaque domaine, note d'abord ce que tu ressens au quotidien (tension, irritation, tristesse, lassitude, sentiment de ne pas être à ta place…), puis ce que tu crains en dessous (être abandonnée, manquer, être rejetée, échouer, perdre le contrôle, ne pas être aimée…). Écris sans te censurer : tout ce qui vient a sa place.",
      astuce: "Si des émotions fortes remontent, accueille-les sans chercher à tout analyser. Le but n'est pas de juger, mais de voir.",
      rangs: 8,
      etiquettes: ['Couple et vie amoureuse', 'Travail', 'Famille', 'Amitiés et entourage', 'Argent et sécurité', 'Mon rythme et mon quotidien', 'Le monde autour de moi', 'Moi-même'],
      colonnes: [
        { q: 'Ce que je ressens', ph: ['Exemple : de la jalousie, des disputes fréquentes', 'Exemple : je me sens illégitime en réunion', 'Exemple : je me tends avant chaque repas de famille', 'Exemple : je donne beaucoup et je reçois peu', 'Exemple : je vérifie mon compte plusieurs fois par jour', 'Exemple : je cours toute la journée, je n’ai jamais de temps pour moi', 'Exemple : les informations me laissent inquiète', 'Exemple : je me critique sans arrêt'] },
        { q: 'Ce que je crains', ph: ['Exemple : être abandonnée, ne pas être assez', 'Exemple : qu’on découvre que je ne suis pas à la hauteur', 'Exemple : ne pas être aimée telle que je suis', 'Exemple : être mise de côté si je dis non', 'Exemple : manquer, tout perdre', 'Exemple : perdre le contrôle si je ralentis', 'Exemple : que tout s’écroule', 'Exemple : ne jamais y arriver'] }
      ] },
    { k: 'ex2', type: 'blocs', titre: 'Mes familles de peurs',
      consigne: "Relis ton tableau. Quelles peurs reviennent dans plusieurs domaines ? Regroupe-les par familles. Par exemple : la peur de manquer (argent, travail, quotidien), la peur d'être abandonnée ou rejetée (couple, amitiés, famille), la peur de ne pas être à la hauteur (travail, famille, moi-même).",
      nb: 3,
      etiquettes: ['Famille 1', 'Famille 2', 'Famille 3'],
      champs: [
        { q: 'La peur de…', ph: ['Exemple : manquer', 'Exemple : être abandonnée', 'Exemple : ne pas être à la hauteur'] },
        { q: 'On la retrouve dans ces domaines', ph: ['Exemple : argent, travail, quotidien', 'Exemple : couple, amitiés, famille', 'Exemple : travail, moi-même'] }
      ],
      apres: [
        { k: 'ex2-principale', q: 'Ma famille la plus présente, et dans combien de domaines elle apparaît', ph: 'Exemple : la peur d’être abandonnée, dans cinq domaines.', court: true }
      ],
      pourquoi: "Souvent, la même racine apparaît partout : c'est ta boucle principale. Et c'est une bonne nouvelle, car ce qu'on voit, on peut le transformer." },
    { k: 'ex3', type: 'questions', titre: 'Le cercle de ma boucle',
      consigne: "Choisis une situation récente où tu as réagi « en automatique ». Remplis les quatre cases dans l'ordre du cercle.",
      questions: [
        { k: 'ex3-declencheur', q: '1 · Le déclencheur : que s’est-il passé ?', ph: 'Exemple : ma collègue a corrigé mon travail devant toute l’équipe.' },
        { k: 'ex3-emotion', q: '2 · L’émotion : qu’as-tu ressenti ?', ph: 'Exemple : de la honte, la gorge serrée, envie de disparaître.' },
        { k: 'ex3-reaction', q: '3 · Ma réaction : qu’as-tu fait ou dit ?', ph: 'Exemple : j’ai souri, j’ai dit merci, et je n’ai rien répondu.' },
        { k: 'ex3-fin', q: '4 · La fin : comment ça s’est terminé ?', ph: 'Exemple : j’ai ruminé toute la soirée en me disant que je ne vaux rien.' },
        { k: 'ex3-spirale', q: 'Et si c’était une spirale ? La prochaine fois que ce déclencheur arrive, quelle petite chose pourrais-tu faire autrement ?', ph: 'Exemple : respirer une fois avant de répondre, puis dire : « Je regarde ça et je reviens vers toi. »' }
      ] }
  ],

  outil: {
    titre: 'La main suspendue',
    intro: "Ton outil du module, pour interrompre la boucle au moment où elle commence. Entraîne-toi une première fois au calme, puis utilise-le dans la vie, quand tu sens la vieille réaction monter. Il dure moins d'une minute. Sous la table ou dans ta poche, ta main fonctionne aussi.",
    etapes: [
      "Repère le signal : une chaleur, une gorge serrée, une phrase qui revient. C'est le début de la boucle.",
      "Lève doucement une main devant toi, paume ouverte, comme pour dire « pause ». Garde-la suspendue.",
      "Respire trois fois, lentement, en regardant ta main.",
      "Dis intérieurement : « Je reconnais cette boucle. Elle m'a protégée. Aujourd'hui, je peux choisir autrement. »",
      "Pose ta main sur ton cœur, ou sur ton ventre, et choisis ton geste différent, même tout petit."
    ],
    note: { k: 'outil-note', q: "Après ton premier essai au calme, note ce qui s'est passé : ce que tu as fait, ce que tu as ressenti.", ph: "Exemple : j’ai levé la main, j’ai respiré trois fois. Mes épaules sont redescendues, j’ai senti un petit espace." }
  },

  jours: {
    titre: 'Mon carnet de la semaine',
    consigne: "Chaque soir, complète une ligne : « Aujourd'hui, j'ai remarqué ma boucle quand… ». Juste remarquer, sans rien changer. C'est déjà beaucoup.",
    ph: "Exemple : Aujourd’hui, j’ai remarqué ma boucle quand mon chef m’a demandé un dossier pour hier. J’ai senti ma gorge se serrer.",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : qu'est-ce qui a changé, même un tout petit peu ?", ph: "Exemple : je la vois arriver un peu plus tôt. Deux fois, j’ai attendu avant de répondre." }
  },

  avancer: {
    intro: "Remarquer ta boucle libère un peu de place. Cette page t'aide à poser ce que tu veux vivre à la place, pour que chaque tour de spirale t'emmène quelque part qui te ressemble.",
    lieQ: "Si ta boucle principale devenait une spirale, à quoi ressemblerait ta vie dans ce domaine ?",
    liePh: "Exemple : au travail, j’ose dire ce dont j’ai besoin. Je rentre le soir sans ruminer."
  },

  allerPlusLoin: [
    { titre: 'Ce qui revient', texte: "Le cahier de la lignée qui prolonge ce module : repérer ta boucle trois fois, voir d'où elle vient, et poser ton premier geste différent.", lien: 'mon-suivi-mois.html?mois=2026-10' }
  ],

  bilan: [
    { k: 'bilan-boucle', q: 'Ma boucle principale, telle que je la vois aujourd’hui', ph: 'Exemple : quand on me critique, je me tais et je rumine, avec la peur de ne pas être à la hauteur.' },
    { k: 'bilan-remarque', q: 'Le moment où je l’ai remarquée le plus tôt cette semaine', ph: 'Exemple : jeudi, avant même de répondre à ma sœur, j’ai senti ma gorge se serrer.' },
    { k: 'bilan-garder', q: 'Ce que je garde de ce module', ph: 'Exemple : la main suspendue, et l’idée que ce qui revient n’est pas un échec.' },
    { k: 'bilan-emporter', q: 'La question que j’emporte dans le module 2 : d’où vient ma boucle ?', ph: 'Exemple : ma mère aussi se taisait devant les critiques. Est-ce que ça vient d’elle ?' }
  ],

  suivant: { titre: 'Module 2 · Remonter à la source', texte: "D'où vient ta boucle, et que s'est-il transmis dans ta famille ? Les âges et les dates qui se répondent, le geste du « À qui ça appartient ? »." }
};
