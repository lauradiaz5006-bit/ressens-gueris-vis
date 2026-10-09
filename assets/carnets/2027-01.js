/* Genesolia · Le Cercle · Carnet de janvier 2027, « J'avance » : « Mon intention, mes valeurs »
   Le carnet du mois est le côté « J'avance » du Cercle : clarifier ses valeurs, poser l'intention de l'année, choisir ce qui compte.
   Le côté libération (« Ton prénom, ton héritage ») est dans Mon suivi (assets/suivi/2027-01.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-01',
  nomMois: 'janvier 2027',
  moisSuivant: 'février',
  titre: 'Mon intention, mes valeurs',
  sousTitre: "Clarifier ce qui compte vraiment pour toi, poser l'intention de ton année, et faire chaque semaine un choix qui te ressemble.",
  pdf: '',
  image: 'assets/formation/montagne.jpg',
  citation: "Une intention claire n'est pas une promesse de plus. C'est une boussole qui te ramène à toi.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Clarifier mes valeurs', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-bienvenue.webp',
      theme: 'assets/guide/guide-reves.webp',
      comprendre: 'assets/guide/guide-nombres.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/entiere-mini.jpg', 'Je ne suis pas trop. Je suis entière.'],
      semaines: ['assets/cartes/prochain-pas-mini.jpg', 'Je n’ai pas besoin de tout savoir. Seulement du prochain pas.']
    }
  },

  mots: {
    tonmois: "Lis ton mois comme la première page d’un nouveau carnet. Ton année personnelle commence aussi : garde ce qui t’éclaire.",
    ouverture: "Ta météo, ta roue et ton objectif : dix minutes pour poser le décor de l’année. Pas de liste de résolutions, promis.",
    theme: "Rien à faire sur cette page, seulement à lire. Laisse venir ce qui compte vraiment pour toi.",
    comprendre: "Une valeur, ce n’est pas ce qu’on devrait aimer. C’est ce qui te met debout quand tu le vis.",
    exercices: "Le premier exercice se fait au calme, avec une boisson chaude. Tes valeurs sont déjà là, dans tes souvenirs.",
    rituel: "Ta connexion de janvier tient dans une graine et un peu de terre. Ce qui pousse lentement pousse longtemps.",
    semaines: "Un choix aligné par semaine, c’est cinquante-deux pas dans l’année. Commence par le premier.",
    cloture: "Prends ce moment même si tout n’a pas été fait. Regarde surtout les choix qui t’ont ressemblé."
  },

  theme: {
    titre: 'Le mois du seuil',
    texte: [
      "Janvier est un seuil. Dehors, la nature semble immobile : les arbres sont nus, la terre est froide, les jours rallongent à peine. Pourtant, sous la surface, les graines attendent, les racines gardent leurs réserves. C'est le moment où l'on fait des vœux, où l'on prend des résolutions, et souvent où l'on se met la pression pour tout changer d'un coup.",
      "Ce carnet t'invite à faire autrement. Pas de liste de résolutions à tenir : une seule intention, posée sur ce qui compte vraiment pour toi. Avant de décider où aller, on regarde sa boussole. Tes valeurs sont cette boussole : quand tes choix leur ressemblent, tu avances avec plus d'élan, et moins de fatigue."
    ],
    sousTitre: 'Pourquoi partir de tes valeurs ?',
    texte2: [
      "On observe souvent que les résolutions s'essoufflent souvent en février, parce qu'elles viennent de ce qu'on « devrait » faire. Une intention ancrée dans tes valeurs tient mieux : elle parle de ce qui te fait vibrer, pas de ce qui te manque.",
      "Une valeur, c'est ce qui est important pour toi, au point que tu te sens toi-même quand tu la vis, et mal à l'aise quand on la piétine : la liberté, la loyauté, la créativité, la justice, la tendresse, l'aventure, la transmission… Certaines te viennent de ta famille, d'autres se sont construites contre elle, d'autres encore sont nées de ton propre chemin. Toutes méritent d'être regardées.",
      "Ce mois-ci, tu vas **clarifier** tes valeurs, **choisir** les trois qui comptent le plus en ce moment, et **poser** l'intention de ton année. En parallèle, ton suivi « Je me libère » t'invite à découvrir l'histoire de ton prénom : ce qu'on a voulu pour toi, et ce que tu choisis pour toi."
    ],
    exemplesTitre: 'Quand tes choix et tes valeurs ne se rencontrent pas',
    exemples: [
      "**Au travail** : la créativité compte énormément pour toi, et tu passes tes journées à remplir des tableaux. Le soir, tu es vidé·e sans avoir beaucoup bougé.",
      "**En famille** : tu tiens à la liberté, et tu acceptes chaque dimanche un repas obligatoire. Tu y vas, mais tu sens une petite révolte chaque fois.",
      "**Avec l’argent** : la sécurité est essentielle pour toi, et tu dépenses sans compter pour faire plaisir. Tu t’inquiètes à chaque fin de mois.",
      "**En amitié** : la sincérité est une de tes valeurs, et tu fais semblant d’être d’accord pour éviter les vagues. Tu rentres avec l’impression d’avoir joué un rôle.",
      "**Avec toi-même** : tu rêves d’aventure, et tu remets chaque projet de voyage à « l’année prochaine », depuis cinq ans."
    ],
    exempleSpiraleTitre: 'Un exemple d’intention qui te ressemble',
    exempleSpirale: "Ta résolution habituelle était « faire du sport trois fois par semaine », et elle tenait jusqu’au 15 janvier. Cette année, tu pars de ta valeur : la liberté. Ton intention devient « Cette année, je choisis de bouger dehors, à ma façon. » Tu marches le samedi, tu fais du vélo pour aller travailler quand il fait beau. En mars, tu bouges encore, parce que ça te ressemble.",
    question: { k: 'theme-compte', q: "Si tu ne devais garder que trois choses vraiment importantes pour toi cette année, lesquelles serais-tu sûr·e de garder ?", ph: "Exemple : du temps avec mes enfants, ma liberté de créer, et des amitiés sincères." }
  },

  comprendre: {
    titre: 'Clarifier tes valeurs, choisir ton intention',
    texte: [
      "Tes valeurs ne se décident pas sur une liste. Elles se découvrent dans ta vie : dans les moments où tu t'es senti·e pleinement toi, dans ce qui te met en colère, dans les personnes que tu admires. Elles sont déjà là. Il s'agit seulement de les nommer.",
      "On confond parfois une valeur avec une obligation héritée. « Il faut travailler dur », « on ne se plaint pas », « la famille avant tout » : ces phrases peuvent être de vraies valeurs pour toi, ou des règles reçues que tu n'as jamais choisies. Le bon test : est-ce que vivre cette valeur te donne de l'élan, ou seulement le sentiment d'être en règle ?",
      "Une fois tes valeurs claires, l'intention devient simple. Ce n'est pas un objectif chiffré, c'est une direction : « Cette année, je choisis de… ». Elle se formule au présent, au positif, et elle te ressemble. Elle peut tenir en un mot : douceur, élan, liberté, oser.",
      "Enfin, une intention ne vit que dans les petits choix. Dire oui à ce qui lui ressemble, et non à ce qui l'éloigne. Chaque fois que tu hésites, tu peux te demander : « Qu'est-ce que mes valeurs choisiraient ? »"
    ],
    reperes: [
      { titre: 'Une vraie valeur…', points: [
        "te donne de l’énergie quand tu la vis ;",
        "te fait réagir quand elle est piétinée ;",
        "se retrouve dans tes plus beaux souvenirs ;",
        "t’aide à choisir quand tu hésites entre deux chemins."
      ] },
      { titre: 'Une intention juste…', points: [
        "se dit en une phrase, ou même en un mot ;",
        "parle de ce que tu veux, pas de ce que tu ne veux plus ;",
        "s’appuie sur une ou deux de tes valeurs ;",
        "se vit dans des gestes simples, chaque semaine."
      ] }
    ],
    regarderTitre: 'Pour trouver tes valeurs, demande-toi',
    regarderIntro: "Réponds avec tes souvenirs plutôt qu’avec des idées. Les valeurs se cachent dans les histoires que tu as vécues.",
    regarder: [
      { k: 'valeurs-fier', q: "De quel choix de ta vie es-tu le plus fier·e, et qu’est-ce qu’il disait de toi ?", ph: "Exemple : avoir quitté un emploi sûr pour un métier qui avait du sens. Ça disait que le sens compte plus que le confort." },
      { k: 'valeurs-colere', q: "Qu’est-ce qui te met profondément en colère, et quelle valeur cela touche-t-il ?", ph: "Exemple : quand on se moque de quelqu’un de plus faible. Ça touche ma valeur de justice." },
      { k: 'valeurs-admire', q: "Quelle personne admires-tu, et pour quelle qualité ?", ph: "Exemple : ma tante Hélène, pour sa liberté et sa façon de dire les choses sans détour." },
      { k: 'valeurs-heritees', q: "Quelle valeur as-tu reçue de ta famille, et la choisis-tu encore aujourd’hui ?", ph: "Exemple : « le travail avant tout ». Je garde le goût du travail bien fait, mais je choisis aussi le repos." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Pour éclairer ta nouvelle année, découvre [ton année personnelle 2027](annee-personnelle-2027.html) : ton nombre de l'année t'aide à choisir le bon tempo pour ton intention. Et si une valeur reçue de ta famille te pèse, ton suivi de janvier t'invite à regarder l'histoire de ton prénom, et ce qu'on a voulu pour toi.",
    outils: [
      ['annee-personnelle-2027.html', 'Mon année personnelle 2027', 'Ton nombre de l’année, pour poser ton intention au bon rythme.'],
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir les sphères lumineuses de ta vie au seuil de l’année.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : ton prénom, ton héritage, et la façon de le faire pleinement tien.']
    ]
  },

  exercicesTitre: 'Clarifier, choisir, s’engager',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à retrouver tes valeurs dans ton histoire, le deuxième à choisir les trois qui comptent le plus en ce moment, le troisième à écrire ton intention de l’année et à la faire vivre. Fais-les dans l’ordre si tu peux : chacun prépare le suivant.",
  exercices: [
    { k: 'ex1', titre: 'Mes valeurs dans mon histoire', type: 'tableau', rangs: 3,
      etiquettes: ['Un moment où je me suis senti·e pleinement moi', 'Un moment qui m’a révolté·e', 'Une personne que j’admire'],
      consigne: "Pour chacune de ces trois situations, retrouve un souvenir précis. Note ce qui s'est passé, la valeur qui était en jeu, et la place que cette valeur a dans ta vie aujourd'hui. Laisse venir les souvenirs, même anciens, même petits.",
      pourquoi: "Nos valeurs se révèlent dans les moments forts : quand on se sent vivant·e, quand on se révolte, quand on admire. En les cherchant dans ton histoire plutôt que sur une liste, tu trouves celles qui sont vraiment à toi.",
      colonnes: [
        { q: "Que s’est-il passé, ou qui est cette personne ?", ph: ["Exemple : le jour où j’ai fait un stage de théâtre, j’ai osé improviser devant tout le monde", "Exemple : au collège, un camarade a été puni à la place d’un autre", "Exemple : mon amie Samia, qui a ouvert son atelier à 45 ans"] },
        { q: "Quelle valeur était en jeu ?", ph: ["Exemple : la créativité, l’expression, la liberté", "Exemple : la justice, la vérité", "Exemple : le courage, l’audace, l’indépendance"] },
        { q: "Quelle place cette valeur a-t-elle dans ta vie aujourd’hui ?", ph: ["Exemple : presque aucune. Je ne crée plus rien depuis des années.", "Exemple : une grande place, je défends souvent mes collègues", "Exemple : une petite place, j’ai des envies que je n’ose pas encore"] }
      ],
      apres: { k: 'ex1-boussole', q: "Relis tes trois lignes. Quelles valeurs reviennent, et laquelle a le plus besoin de place dans ta vie cette année ?", ph: "Exemple : la liberté revient deux fois, et la créativité aussi. C’est la créativité qui manque le plus en ce moment." } },

    { k: 'ex2', titre: 'Mes trois valeurs phares', type: 'blocs', nb: 3,
      etiquettes: ['Ma première valeur', 'Ma deuxième valeur', 'Ma troisième valeur'],
      consigne: "Choisis les trois valeurs qui comptent le plus pour toi en ce moment. Pour chacune, écris ce qu'elle veut dire pour toi, concrètement, puis un geste simple pour la vivre davantage cette année. Ces trois valeurs seront ta boussole pour les mois qui viennent.",
      pourquoi: "Un même mot ne veut pas dire la même chose pour tout le monde. La liberté, pour l’un, c’est voyager ; pour l’autre, c’est avoir ses soirées à soi. Définir tes valeurs avec tes mots, c’est savoir exactement comment les nourrir.",
      astuce: "Trois valeurs, pas dix. Si tu hésites, demande-toi : « Si je ne pouvais en garder qu’une, laquelle ? » puis recommence avec celles qui restent.",
      champs: [
        { q: "Quelle valeur choisis-tu ?", ph: ["Exemple : la liberté", "Exemple : la créativité", "Exemple : la tendresse"] },
        { q: "Que veut-elle dire pour toi, concrètement ?", ph: ["Exemple : décider de mon emploi du temps au moins un jour par semaine", "Exemple : fabriquer, dessiner, inventer avec mes mains", "Exemple : prendre le temps d’être doux·ce avec mes proches et avec moi"] },
        { q: "Quel geste simple vas-tu faire pour la vivre davantage cette année ?", ph: ["Exemple : garder mes samedis sans aucun programme", "Exemple : m’inscrire à un atelier de céramique le jeudi soir", "Exemple : un câlin et un mot gentil chaque soir, avant le coucher"] }
      ] },

    { k: 'ex3', titre: 'Mon intention de l’année', type: 'texte',
      consigne: "À partir de tes trois valeurs, écris l'intention de ton année en une phrase : « Cette année, je choisis de… ». Au présent, au positif, avec tes mots. Puis, chaque fois que tu fais un choix qui lui ressemble, même minuscule, note-le ici.",
      pourquoi: "Une intention écrite et relue devient un filtre pour tes choix. Chaque petit choix aligné la renforce, et c’est leur répétition qui transforme une année.",
      gestes: ["Cette année, je choisis la douceur", "Cette année, je choisis d’oser", "Cette année, je choisis de créer chaque semaine", "Cette année, je choisis d’être présent·e", "Cette année, je choisis ma liberté", "Cette année, je choisis de m’écouter"],
      q: "Ton intention : « Cette année, je choisis de…, parce que… compte pour moi. »",
      ph: "Exemple : cette année, je choisis de créer avec mes mains chaque semaine, parce que la créativité et la liberté comptent pour moi.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque choix qui a ressemblé à ton intention : quand, quoi, et qu’as-tu ressenti ?", ph: "Exemple : samedi, j’ai refusé une sortie pour finir mon carnet de croquis. Je me suis senti·e fidèle à moi." } }
  ],

  rituel: {
    titre: 'La graine d’intention',
    intro: "En janvier, sous la terre froide, les graines attendent leur heure. Ce petit rituel symbolique t'invite à confier ton intention à une graine, et à la regarder pousser tout l'hiver. Il se fait en quinze minutes, près d'une fenêtre.",
    materiel: "Un petit pot avec de la terre, quelques graines faciles (lentilles, blé, cresson, ou un bulbe de jacinthe), un petit papier, un crayon, et une bougie si tu le souhaites.",
    quand: "Fais-le dans les premiers jours de janvier, ou à la nouvelle lune du mois, après ton exercice des trois valeurs. Arrose ta graine chaque fois que tu relis ton intention : vous pousserez ensemble.",
    etapes: [
      "Installe-toi près d’une fenêtre, à la lumière du jour. Si tu le souhaites, allume une bougie. Respire trois fois profondément.",
      "Écris ton intention de l’année sur le petit papier, en une phrase ou en un mot. Relis-la à voix basse.",
      "Plie le papier et glisse-le au fond du pot, sous la terre. C’est la racine de ton année.",
      "Prends les graines dans ta main. Pense à tes trois valeurs, une par une, et dis : « Je choisis ce qui compte pour moi. »",
      "Sème les graines, recouvre-les d’un peu de terre, et arrose doucement. Dis intérieurement : « Je ne force rien. Je laisse pousser, à mon rythme. »",
      "Pose le pot près d’une fenêtre. Éteins la bougie (ne la laisse jamais sans surveillance), et note ici ton intention et ce que tu as ressenti."
    ],
    note: { k: 'rituel-note', q: "Quelle intention as-tu semée, et qu’as-tu ressenti en la mettant en terre ?", ph: "Exemple : « Cette année, je choisis d’oser. » J’ai ressenti une joie calme, comme un début." }
  },

  meditation: {
    titre: 'Le seuil de l’année',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Imagine un matin d’hiver, très calme. L’air est froid et pur. Le ciel s’éclaire doucement. Devant toi, il y a une porte, simple, en bois clair. C’est le seuil de ton année.",
      "Derrière toi, il y a l’année qui s’achève. Tu peux te retourner un instant et la regarder : ses joies, ses fatigues, ce que tu as appris. Remercie-la, sans rien juger. Elle t’a amené·e jusqu’ici.",
      "[pause]",
      "Tourne-toi à nouveau vers la porte. Dans ta main, tu tiens une petite boussole. Regarde-la. Au lieu des quatre points cardinaux, tu vois trois mots : tes valeurs. Laisse-les apparaître, sans chercher.",
      "L’aiguille tremble un peu, puis se stabilise. Elle indique une direction. Tu n’as pas besoin de voir tout le chemin. Seulement la direction.",
      "[longue pause]",
      "Pose ta main sur la poignée de la porte. Avant de l’ouvrir, dis intérieurement ton intention. Une phrase, ou un mot. Sens comment elle résonne dans ton corps : dans ta poitrine, dans ton ventre, dans tes épaules.",
      "Ouvre la porte. Devant toi, un paysage d’hiver, encore endormi, mais plein de promesses. Un chemin s’y dessine, dans la direction de ta boussole.",
      "Fais un premier pas. Juste un. Sens la terre ferme sous tes pieds. Tu n’es pas pressé·e. Tu avances à ton rythme, avec ce qui compte pour toi.",
      "[pause]",
      "Dis intérieurement : « Je choisis ce qui compte. Je garde ma boussole. Je fais un pas à la fois. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais cette méditation dans les premiers jours de janvier, un matin si tu peux, avant que la journée commence. Tu peux la refaire chaque fois que tu doutes de ta direction. Si une fatigue de l’année passée remonte, laisse-la passer en respirant : elle a le droit d’être là aussi.",
    note: { k: 'medit-note', q: "Quels mots sont apparus sur ta boussole, et qu’as-tu vu derrière la porte ?", ph: "Exemple : liberté, tendresse, créer. Derrière la porte, il y avait un chemin dans la neige qui menait vers une maison éclairée." }
  },

  semaines: [
    { titre: 'Mon mot de l’année', texte: "Choisis un mot qui résume ton intention, et mets-le sous tes yeux : en fond d'écran, sur un post-it sur le miroir, à la première page de ton agenda. Chaque matin, lis-le une fois, en respirant.",
      exemple: "Par exemple : « oser », « douceur », « élan », « présence ». Un mot simple, que tu peux retrouver en une seconde quand tu hésites. Certaines personnes le choisissent d’abord, et l’intention vient après.",
      ph: "Exemple : mon mot, c’est « élan ». Je l’ai collé sur la porte du frigo, et je le dis à voix basse en préparant mon café." },
    { titre: 'Un choix aligné par jour', texte: "Chaque soir, note un choix de ta journée qui ressemblait à tes valeurs, même minuscule. Et si un choix t'en a éloigné·e, note-le aussi, sans te juger : c'est une information précieuse.",
      exemple: "Par exemple : « Lundi : j’ai pris le temps de lire une histoire à ma fille au lieu de répondre à mes mails, tendresse. Mardi : j’ai dit oui à une réunion inutile, éloigné·e de ma liberté. » À la fin de la semaine, tu sauras où ton intention vit déjà.",
      ph: "Exemple : mes choix alignés arrivent surtout le matin. Le soir, la fatigue me fait dire oui à tout." },
    { titre: 'Faire de la place', texte: "Cette semaine, retire une chose de ta vie qui ne ressemble pas à tes valeurs : un engagement, une habitude, un abonnement, une obligation. Pour qu'une intention pousse, il lui faut de la place.",
      exemple: "Par exemple : tu quittes un groupe de discussion qui te pèse, tu arrêtes une activité choisie pour faire plaisir, tu libères ton mercredi soir. Ce que tu retires laisse un espace pour ce qui compte.",
      ph: "Exemple : j’ai arrêté le cours que je suivais par obligation. Mon jeudi soir est libre pour mon atelier de céramique." },
    { titre: 'Ma lettre d’intention signée', texte: "En fin de mois, écris quelques lignes à la personne que tu seras en décembre prochain : ton intention, tes trois valeurs, et ce que tu espères pour elle. Signe-la de ton prénom. Puis refais ta roue dans ton bilan, et regarde ce qui a bougé.",
      exemple: "Par exemple : « Chère toi de décembre, cette année j’ai choisi d’oser. Je te souhaite d’avoir ouvert ton atelier, ou au moins d’avoir essayé. Je suis fier·e de toi d’avance. Signé : Camille. » Range-la dans un endroit où tu la retrouveras.",
      ph: "Exemple : j’ai écrit ma lettre et je l’ai glissée dans mon agenda de l’année, à la page de décembre. Ça m’a donné le sourire." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-valeurs', q: "Quelles sont tes trois valeurs phares, et laquelle as-tu le plus vécue ce mois-ci ?", ph: "Exemple : liberté, créativité, tendresse. C’est la créativité que j’ai le plus nourrie, avec mon atelier du jeudi." },
    { k: 'fin-choix', q: "Quel choix aligné es-tu le plus fier·e d’avoir fait ce mois-ci ?", ph: "Exemple : avoir dit non à un projet de travail qui ne me ressemblait pas, sans me justifier." },
    { k: 'fin-place', q: "Qu’as-tu retiré de ta vie pour faire de la place à ton intention ?", ph: "Exemple : le cours du jeudi que je suivais par obligation, et une heure d’écran chaque soir." },
    { k: 'fin-annee', q: "Comment ton intention de l’année résonne-t-elle en toi, un mois plus tard ?", ph: "Exemple : elle me semble encore plus juste. Je la relis chaque lundi, et elle m’aide à trier." },
    { k: 'fin-intention', q: "Quelle est ton intention pour février ?", ph: "Exemple : garder mon atelier du jeudi, et apprendre à me traiter avec plus de douceur.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Ton prénom, ton héritage',
    texte: "Pendant que ton carnet t’aide à choisir tes valeurs et à poser ton intention, ton suivi t’invite à découvrir l’histoire de ton prénom : qui l’a choisi, ce qu’il porte de ta lignée, et comment en faire pleinement le tien. Signer ton intention de ton prénom prend alors tout son sens."
  },

  aVenir: [
    { mois: 'Février', titre: 'M’aimer d’abord', texte: "Te traiter avec la douceur que tu offres aux autres, reconnaître tes besoins, et devenir ton tout premier appui.", image: 'assets/cartes/me-le-donner-mini.jpg' },
    { mois: 'Mars', titre: 'Ma voix, ma confiance', texte: "Oser prendre la parole, t’affirmer avec douceur, et faire grandir ta confiance en toi.", image: 'assets/cartes/demander-mini.jpg' },
    { mois: 'Avril', titre: 'Dire vrai', texte: "Exprimer ce que tu ressens vraiment, avec des mots justes et bienveillants.", image: 'assets/cartes/une-relation-vraie-mini.jpg' }
  ]
};
