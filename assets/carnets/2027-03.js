/* Genesolia · Le Cercle · Carnet de mars 2027, « J'avance » : « Ma voix, ma confiance »
   Le carnet du mois est le côté « J'avance » du Cercle : s'affirmer, prendre la parole, faire grandir sa confiance en soi.
   Le côté libération (« Ta place dans la fratrie ») est dans Mon suivi (assets/suivi/2027-03.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-03',
  nomMois: 'mars 2027',
  moisSuivant: 'avril',
  titre: 'Ma voix, ma confiance',
  sousTitre: "Retrouver ta voix, oser dire ce que tu penses et ce que tu veux, et faire grandir ta confiance en toi, un petit pas après l’autre.",
  pdf: '',
  image: 'assets/cartes/demander.jpg',
  citation: "Ta voix a sa place dans le monde. Elle n’a pas besoin d’être forte pour être entendue, seulement d’être la tienne.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Ma confiance', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-bienvenue.webp',
      theme: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-nombres.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/demander-mini.jpg', "J’ai le droit de demander ce que je veux vraiment."],
      semaines: ['assets/cartes/dire-non-mini.jpg', "Dire non à certains, c’est parfois dire oui à moi."]
    }
  },

  mots: {
    tonmois: "Lis ton mois à voix haute si tu peux. C’est déjà une première façon de faire entendre ta voix.",
    ouverture: "Dix minutes pour ta météo, ta roue et ton objectif. Ce mois-ci, regarde où ta voix se fait petite : c’est souvent là que ta roue se creuse.",
    theme: "Rien à faire ici, seulement à lire. Remarque les situations où tu te reconnais.",
    comprendre: "La confiance ne se trouve pas avant d’agir. Elle se construit en agissant, même avec le cœur qui bat.",
    exercices: "Le premier exercice se fait au calme, en vingt minutes. Sois honnête avec toi : personne ne lira ces lignes à ta place.",
    rituel: "Ce mois-ci, ta connexion passe par le vent du printemps et ta propre voix. Ose la faire sonner, même tout bas.",
    semaines: "Chaque semaine, un petit défi de courage. Le but n’est pas d’être à l’aise, c’est d’essayer.",
    cloture: "Relis ton mois et compte les fois où tu as osé. Chacune compte, même celles où ta voix tremblait."
  },

  theme: {
    titre: "Le mois où ma voix se réveille",
    texte: [
      "Mars, c’est le mois de l’élan. Les bourgeons percent, les oiseaux recommencent à chanter dès l’aube, et les giboulées alternent avec de grands ciels bleus. La nature ne demande pas la permission pour revenir à la vie : elle pousse, elle chante, elle prend sa place.",
      "Ce carnet t’invite à faire pareil avec ta voix. Oser donner ton avis en réunion, dire ce que tu veux au restaurant, demander une augmentation, refuser un service de trop, poser une question sans t’excuser. Pas en devenant quelqu’un d’autre, mais en laissant sortir celle ou celui que tu es déjà. Ta confiance n’a pas disparu : elle attend simplement que tu lui fasses un peu de place."
    ],
    sousTitre: "Pourquoi travailler sa voix et sa confiance ?",
    texte2: [
      "La confiance en soi, ce n’est pas ne jamais avoir peur. C’est savoir que tu peux agir même avec la peur, et que tu te relèveras si ça ne se passe pas comme prévu. Elle se construit comme un muscle : chaque petit acte de courage la renforce un peu.",
      "S’affirmer, c’est trouver le juste milieu entre se taire pour ne pas déranger et imposer son avis. C’est dire calmement ce que tu penses, ce que tu ressens et ce que tu veux, tout en respectant l’autre. On appelle souvent ça l’**affirmation de soi** : ni paillasson, ni hérisson, simplement toi, debout.",
      "Ce mois-ci, tu vas **repérer** où ta voix se fait petite, **te souvenir** de tes réussites et de tes forces, et **oser** une phrase d’affirmation chaque semaine. En parallèle, ton suivi « Je me libère » regarde ta place dans la fratrie : c’est souvent là que l’on a appris à parler fort, à se taire, ou à laisser parler les autres."
    ],
    exemplesTitre: "Quand ta voix se fait petite, au quotidien",
    exemples: [
      "**En réunion** : tu as une idée, tu la tournes dans ta tête, et quelqu’un d’autre la dit à ta place. Tu te dis : « J’aurais dû parler. »",
      "**Au restaurant** : ton plat est froid, mais tu le manges quand même, pour ne pas faire d’histoire.",
      "**En famille** : à table, quand on parle de ton travail, tu laisses ton frère raconter ta vie à ta place, en souriant.",
      "**Les excuses en trop** : tu commences chaque mail par « Désolé·e de te déranger » et chaque demande par « Si ce n’est pas trop demander ».",
      "**Le doute avant d’agir** : tu voudrais t’inscrire à cette formation, mais une voix te dit que ce n’est pas pour toi, que d’autres sont plus légitimes."
    ],
    exempleSpiraleTitre: "Un exemple de petit pas",
    exempleSpirale: "En réunion, ta cheffe demande : « Des idées ? » Ton cœur accélère. D’habitude, tu attends. Cette fois, tu poses les pieds bien à plat, tu respires, et tu dis : « J’ai une proposition. » Ta voix tremble un peu. On t’écoute. Après, tu as les mains moites et un grand sourire intérieur : tu viens de prouver à ta confiance qu’elle peut compter sur toi.",
    question: { k: 'theme-voix', q: "Si ta voix était pleinement libre, qu’est-ce que tu oserais dire, demander ou faire dès ce mois-ci ?", ph: "Exemple : je demanderais à travailler en télétravail le vendredi, et je dirais à ma mère que je ne viendrai pas tous les dimanches." }
  },

  comprendre: {
    titre: "Comprendre ta confiance sans te juger",
    texte: [
      "La confiance en soi n’est pas un trait de caractère que l’on a ou que l’on n’a pas. Elle bouge selon les domaines : tu peux être très sûr·e de toi avec tes enfants et perdre tes moyens devant un guichet administratif. C’est normal, et c’est une bonne nouvelle : cela veut dire qu’elle peut grandir.",
      "Elle repose sur trois appuis. **La confiance en tes capacités** : je sais faire, j’ai déjà réussi. **La confiance en ta valeur** : je mérite d’être écouté·e, même quand je me trompe. **La confiance en ta capacité à rebondir** : si ça rate, je saurai me relever. Souvent, c’est le troisième appui qui manque le plus, et c’est lui qui fait le plus de différence.",
      "Ta voix intérieure joue un grand rôle. Si elle te répète « tu vas te ridiculiser », ton corps se crispe et ta voix se serre. Si elle te dit « vas-y, tu as le droit d’essayer », ton souffle s’ouvre. On ne la fait pas taire d’un coup, mais on peut lui répondre, comme on rassurerait une amie.",
      "Enfin, souviens-toi que ta posture parle à ta confiance. Les pieds ancrés, le dos droit, le souffle lent : ton corps envoie à ton esprit le message que tu es en sécurité. Parfois, on se tient droit avant de se sentir fort, et la force suit."
    ],
    reperes: [
      { titre: "Ta confiance est là quand…", points: [
        "tu donnes ton avis même si tu n’es pas sûr·e d’avoir raison ;",
        "tu peux dire « je ne sais pas » sans te sentir diminué·e ;",
        "tu demandes ce dont tu as besoin, sans te justifier longuement ;",
        "une critique te touche sans te démolir."
      ] },
      { titre: "Ta confiance demande à être nourrie quand…", points: [
        "tu te tais pour ne pas déranger, puis tu ressasses le soir ;",
        "tu t’excuses avant même d’avoir parlé ;",
        "tu attends d’être parfait·e pour te lancer ;",
        "tu crois que les autres sont toujours plus légitimes que toi."
      ] }
    ],
    regarderTitre: "Pour faire grandir ta confiance, demande-toi",
    regarderIntro: "Prends ces questions une par une. Écris ce qui vient, même si ça te semble petit : les petites victoires sont les fondations de la confiance.",
    regarder: [
      { k: 'conf-domaine', q: "Dans quel domaine de ta vie te sens-tu le plus sûr·e de toi, et pourquoi ?", ph: "Exemple : avec mes élèves. Je sais ce que je fais, je n’ai pas peur de me tromper devant eux." },
      { k: 'conf-taire', q: "Dans quelle situation te tais-tu le plus souvent, alors que tu aurais quelque chose à dire ?", ph: "Exemple : quand mon beau-père fait des remarques sur l’éducation de mes enfants." },
      { k: 'conf-voix', q: "Que te dit ta petite voix intérieure juste avant que tu renonces à parler ?", ph: "Exemple : « Tu vas dire une bêtise, tout le monde va te regarder. »" },
      { k: 'conf-reponse', q: "Que pourrais-tu répondre à cette petite voix, comme tu rassurerais une amie ?", ph: "Exemple : « Mon avis vaut celui des autres. Et si je me trompe, ce n’est pas grave. »" }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Tire une [carte Genesolia](cartes.html) avant un moment où tu veux oser : sa phrase peut devenir ton mot de courage du jour. Et si tu remarques que ta façon de te taire ou de parler fort vient de ta place parmi tes frères et sœurs, c’est le moment d’ouvrir [ton suivi](mon-suivi.html).",
    outils: [
      ['cartes.html', 'Tirer une carte de courage', "Une phrase à garder sur toi avant une réunion, un appel ou une conversation importante."],
      ['mon-guide.html', 'Mon guide du mois', "Ton nombre du mois, ton ciel et tes dates clés, pour choisir le bon moment pour oser."],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', "Ce mois-ci : regarder ta place dans la fratrie, et choisir celle que tu veux habiter aujourd’hui."]
    ]
  },

  exercicesTitre: "Repérer, me souvenir, oser",
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à voir où ta voix se fait petite, le deuxième à retrouver les preuves de ta force, le troisième à oser une phrase d’affirmation et à la faire vivre. Tu peux les faire dans l’ordre ou commencer par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: "Là où ma voix se fait petite", type: 'tableau', rangs: 3,
      etiquettes: ['Au travail', 'En famille', 'Avec mes ami·es ou mon couple'],
      consigne: "Pour chacun de ces trois endroits de ta vie, note une situation où tu te tais, t’effaces ou dis oui alors que tu penses autre chose. Puis écris ce que tu voudrais vraiment dire, et une première phrase simple que tu pourrais oser. Choisis des situations concrètes et récentes.",
      pourquoi: "On croit souvent qu’on manque de confiance « en général ». En réalité, la voix se serre dans des situations bien précises. Les repérer permet de préparer ses mots à l’avance, et une phrase préparée est beaucoup plus facile à dire.",
      colonnes: [
        { q: "Dans quelle situation te tais-tu ou t’effaces-tu ?", ph: ["Exemple : quand mon collègue me coupe la parole en réunion", "Exemple : quand ma mère critique ma façon de m’habiller", "Exemple : quand mes amies choisissent toujours le restaurant"] },
        { q: "Que voudrais-tu vraiment dire ?", ph: ["Exemple : que je n’avais pas fini, et que mon idée compte", "Exemple : que j’aime mes vêtements et que ça me regarde", "Exemple : que j’aimerais choisir de temps en temps"] },
        { q: "Quelle première phrase simple pourrais-tu oser ?", ph: ["Exemple : « Je termine ma phrase, s’il te plaît. »", "Exemple : « Je me sens bien comme ça, maman. »", "Exemple : « Cette fois, j’ai envie de proposer un endroit. »"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Qu’est-ce que tu remarques, et quelle phrase veux-tu oser en premier ce mois-ci ?", ph: "Exemple : je me tais surtout face aux personnes plus âgées que moi. Je commence par « Je termine ma phrase » en réunion lundi." } },

    { k: 'ex2', titre: "Mes réussites oubliées", type: 'blocs', nb: 3,
      etiquettes: ['Quand j’étais enfant ou adolescent·e', 'Ces dernières années', 'Cette année'],
      consigne: "Retrouve trois moments de ta vie où tu as réussi quelque chose, osé, ou tenu bon, même si personne ne l’a remarqué : un examen, un déménagement, une conversation difficile, un enfant consolé, un projet mené jusqu’au bout. Pour chacun, note la qualité qui t’a permis de le faire, puis comment elle peut t’aider ce mois-ci.",
      pourquoi: "La confiance se nourrit de preuves. Notre mémoire garde facilement les échecs et oublie les réussites. Les écrire, c’est rappeler à ton esprit que tu sais déjà faire, et que tes qualités sont toujours là, prêtes à servir.",
      astuce: "Si tu sèches, demande-toi : « De quoi suis-je fier·e, même un tout petit peu ? » ou demande à quelqu’un qui te connaît bien.",
      champs: [
        { q: "Quelle réussite, quel moment de courage ?", ph: ["Exemple : à 12 ans, j’ai défendu une camarade devant toute la classe", "Exemple : j’ai changé de métier à 38 ans", "Exemple : j’ai dit à mon frère que ses blagues me blessaient"] },
        { q: "Quelle qualité t’a permis de le faire ?", ph: ["Exemple : mon sens de la justice", "Exemple : ma persévérance et ma curiosité", "Exemple : mon honnêteté, même avec le cœur qui bat"] },
        { q: "Comment cette qualité peut-elle t’aider ce mois-ci ?", ph: ["Exemple : pour défendre mon idée en réunion, comme je défendais les autres", "Exemple : pour m’inscrire à la formation qui me tente", "Exemple : pour dire à ma mère que je ne viendrai pas dimanche"] }
      ] },

    { k: 'ex3', titre: "Ma phrase d’affirmation", type: 'texte',
      consigne: "Choisis une situation où tu veux oser parler ce mois-ci, et prépare ta phrase d’affirmation : courte, calme, à la première personne. Dis-la d’abord à voix haute chez toi, devant le miroir, puis dans la vraie vie. Note chaque fois que tu as osé, même à moitié, et ce que tu as ressenti.",
      pourquoi: "Une phrase préparée et répétée devient familière à ta bouche et à ton corps. Le jour venu, elle sort plus facilement, même quand le cœur bat. Et chaque fois que tu l’oses, ta confiance enregistre une nouvelle preuve.",
      gestes: ["Donner ton avis en premier, une fois par semaine", "Dire « je ne suis pas d’accord » calmement", "Faire une demande sans commencer par « désolé·e »", "Poser une question en public", "Dire « non, merci » sans te justifier", "Recevoir un compliment avec un simple « merci »"],
      q: "Ta phrase d’affirmation : « Ce mois-ci, quand…, je vais oser dire : … »",
      ph: "Exemple : ce mois-ci, quand on me coupe la parole en réunion, je vais oser dire calmement : « Je n’avais pas terminé, je finis mon idée. »",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as osé : quand, ce que tu as dit, et ce que tu as ressenti", ph: "Exemple : jeudi, réunion d’équipe. J’ai dit « je finis mon idée ». Ma voix tremblait, mais on m’a écouté·e jusqu’au bout. J’étais fier·e toute la journée." } }
  ],

  rituel: {
    titre: "La graine et le vent",
    intro: "En mars, le vent du printemps secoue les branches et réveille les graines. Ce rituel symbolique t’invite à semer une graine de confiance et à faire entendre ta voix au vent, dehors si tu peux. Il se fait en dix minutes, idéalement autour de l’équinoxe, quand le jour et la nuit sont à égalité.",
    materiel: "Quelques graines (fleurs, basilic, lentilles), un petit pot avec de la terre, un papier et un crayon. Un balcon, un jardin, ou une fenêtre ouverte.",
    quand: "Fais-le en début de mois ou autour du 20 mars, jour de l’équinoxe. Tu peux redire ta phrase chaque fois que tu arroses ton pot : il devient ton rappel de confiance pour tout le printemps.",
    etapes: [
      "Installe-toi dehors ou devant une fenêtre ouverte. Sens l’air sur ton visage et respire trois fois profondément.",
      "Sur le papier, écris une phrase qui commence par « J’ose… » : ce que tu veux oser dire ou faire ce printemps.",
      "Prends les graines dans ta main. Lis ta phrase à voix haute, une première fois doucement, puis une deuxième fois un peu plus fort.",
      "Sème les graines dans le pot en disant : « Je laisse pousser ma voix, à son rythme, comme ces graines. »",
      "Si tu es dehors, laisse le vent emporter quelques mots de plus : crie, chante ou murmure ce qui vient. Personne n’a besoin de l’entendre, sauf toi.",
      "Glisse le papier sous le pot. Le soir, note ici ta phrase et ce que tu as ressenti en entendant ta propre voix."
    ],
    note: { k: 'rituel-note', q: "Quelle phrase « J’ose… » as-tu semée, et qu’as-tu ressenti en l’entendant à voix haute ?", ph: "Exemple : « J’ose demander une augmentation. » La deuxième fois, ma voix était plus forte. J’ai ri toute seule sur mon balcon." }
  },

  meditation: {
    titre: "La source de ta voix",
    texte: [
      "Installe-toi confortablement, le dos droit et soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens tes pieds sur le sol. Ils sont stables, ancrés. Imagine que la terre sous toi te porte, solide et patiente, comme elle porte les arbres qui se réveillent en ce mois de mars.",
      "Porte maintenant ton attention sur ton ventre. Sens-le se gonfler doucement à chaque inspiration, se relâcher à chaque expiration. C’est là que naît ta voix : dans ton souffle, bien avant ta gorge.",
      "[pause]",
      "Imagine qu’au creux de ton ventre coule une petite source claire. Pendant longtemps, peut-être, des pierres l’ont recouverte : des « tais-toi », des « ce n’est pas le moment », des regards qui t’ont fait douter.",
      "Une à une, regarde ces pierres. Tu n’as pas besoin de les jeter avec force. Remercie-les : elles t’ont peut-être protégé·e à un moment. Puis pose-les doucement sur le côté.",
      "[longue pause]",
      "La source coule plus librement maintenant. Sens son eau monter, à travers ta poitrine, jusqu’à ta gorge. Ta gorge s’ouvre, se détend. Tes épaules descendent. Ta mâchoire se relâche.",
      "Imagine-toi dans une situation où tu veux oser parler. Vois-toi debout, les pieds ancrés, le souffle lent. Entends ta voix, calme et claire, dire ce que tu as à dire. Les autres t’écoutent.",
      "[pause]",
      "Dis-toi intérieurement : « Ma voix a sa place. J’ai le droit d’être entendu·e. Je peux parler, même avec le cœur qui bat. »",
      "Respire profondément. Si tu le veux, laisse sortir un léger son en expirant, un « mmm » tout doux, pour sentir ta voix vibrer. Puis sens à nouveau ton corps, le sol, l’air autour de toi. Quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais cette séance un matin, avant une journée où tu veux oser, ou la veille d’un rendez-vous important. Assieds-toi plutôt droit que trop calé·e. Si tu n’as pas envie d’émettre un son, imagine-le simplement : l’effet est déjà là.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Une pierre, une image, un mot, une sensation dans ta gorge…", ph: "Exemple : une grosse pierre portait le mot « sage ». En la posant, j’ai senti ma gorge s’ouvrir et j’ai eu envie de chanter." }
  },

  semaines: [
    { titre: "Ma posture de confiance", texte: "Chaque matin, pendant deux minutes, tiens-toi debout, pieds ancrés au sol, dos droit, épaules ouvertes, mains sur les hanches ou bras ouverts. Respire lentement. Refais-le juste avant un moment où tu veux oser.",
      exemple: "Par exemple : dans la salle de bain avant de partir, ou dans les toilettes du bureau avant une réunion. Ton corps envoie le message « je suis en sécurité », et ta voix sort plus facilement.",
      ph: "Exemple : je l’ai fait avant mon appel avec la banque. Je me suis senti·e plus grand·e, et je n’ai pas bafouillé." },
    { titre: "Mon avis, une fois par jour", texte: "Chaque jour, donne ton avis une fois, sur n’importe quoi : un film, un plat, une idée au travail, la couleur d’un mur. Commence ta phrase par « Je pense que… » ou « Moi, je préfère… ».",
      exemple: "Par exemple : « Moi, je préfère qu’on aille au parc plutôt qu’au centre commercial. » « Je pense que ce titre serait plus clair. » C’est petit, mais c’est ton muscle de confiance qui s’entraîne chaque jour.",
      ph: "Exemple : j’ai remarqué que je dis souvent « comme tu veux ». Cette semaine, j’ai choisi le film deux fois." },
    { titre: "Une demande sans excuse", texte: "Cette semaine, fais au moins une vraie demande, sans commencer par « désolé·e » ni te justifier pendant cinq minutes : une aide, un délai, un service, un changement. Formule-la simplement, puis tais-toi et attends la réponse.",
      exemple: "Par exemple : « Est-ce que tu peux récupérer les enfants jeudi ? » plutôt que « Désolée, je sais que tu es débordé, ce n’est pas grave si tu ne peux pas, mais… ». Une demande claire est aussi un cadeau pour l’autre.",
      ph: "Exemple : j’ai demandé à ma voisine d’arroser mes plantes, sans m’excuser. Elle a dit oui tout de suite, ravie." },
    { titre: "Célébrer mes victoires", texte: "Chaque soir, note une chose que tu as osée dans la journée, même minuscule, et félicite-toi à voix haute. En fin de semaine, relis ta liste et refais ta roue de la vie dans ton bilan.",
      exemple: "Par exemple : « Aujourd’hui, j’ai dit que je n’étais pas d’accord avec le planning. Bravo. » À la fin de la semaine, tu as sept preuves de courage sous les yeux. C’est ça, la confiance qui grandit.",
      ph: "Exemple : ma liste m’a surprise. J’ai osé bien plus de choses que je ne le pensais, surtout au travail." }
  ],

  bilanTitre: "Ce que ce mois a réveillé",
  bilan: [
    { k: 'fin-ose', q: "Qu’as-tu osé dire ou faire ce mois-ci, que tu n’aurais pas fait avant ?", ph: "Exemple : j’ai demandé mon vendredi en télétravail. On me l’a accordé." },
    { k: 'fin-situation', q: "Dans quelle situation ta voix se sent-elle plus libre maintenant ?", ph: "Exemple : en réunion. Je parle plus tôt, et je ne m’excuse plus avant." },
    { k: 'fin-qualite', q: "Quelle qualité t’a aidé·e à oser, et comment veux-tu continuer à t’en servir ?", ph: "Exemple : ma persévérance. Je veux m’en servir pour m’inscrire enfin à cette formation." },
    { k: 'fin-intention', q: "Quelle est ton intention pour avril ?", ph: "Exemple : continuer à donner mon avis chaque jour, et oser dire ce que je ressens vraiment à mes proches.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Ta place dans la fratrie',
    texte: "Pendant que ton carnet t’aide à faire entendre ta voix, ton suivi t’invite à regarder la place que tu as reçue parmi tes frères et sœurs, et les rôles qu’on t’a confiés. C’est souvent là qu’on a appris à parler fort ou à se taire. Ce que tu libères là-bas rend ta voix plus libre ici."
  },

  aVenir: [
    { mois: 'Avril', titre: 'Dire vrai', texte: "Exprimer ce que tu ressens vraiment, avec des mots justes, et créer des relations plus vraies.", image: 'assets/cartes/une-relation-vraie-mini.jpg' },
    { mois: 'Mai', titre: 'Prendre soin de moi', texte: "Faire de ton quotidien un allié : rythme, repos, plaisirs simples et énergie retrouvée.", image: 'assets/cartes/se-retrouver-mini.jpg' },
    { mois: 'Juin', titre: 'Oser agir', texte: "Passer de l’envie à l’action, lancer ce projet qui t’attend, un pas après l’autre.", image: 'assets/cartes/prochain-pas-mini.jpg' }
  ]
};
