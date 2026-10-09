/* Genesolia · Le Cercle · Carnet de novembre 2026, « J'avance » : « Mes forces, mes appuis »
   Le carnet du mois est le côté coaching du Cercle : reconnaître ses forces, ses ressources, ce sur quoi s'appuyer.
   Le côté libération (« Ceux qui sont venus avant toi ») est dans Mon suivi (assets/suivi/2026-11.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2026-11',
  nomMois: 'novembre 2026',
  moisSuivant: 'décembre',
  titre: 'Mes forces, mes appuis',
  sousTitre: "Reconnaître tes forces et tes ressources, savoir sur quoi t'appuyer, et dire merci à ce qui t'a été transmis de beau.",
  pdf: '',
  image: 'assets/cercle/apercu-2026-11.jpg',
  citation: "Tu es déjà plus solide que tu ne le crois. Tes forces t'attendent, il suffit de les regarder.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Reconnaître mes forces', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-bienvenue.webp',
      theme: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-transmission.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/racines-appuis-mini.jpg', 'Mes racines ne sont pas une cage. Ce sont mes appuis.'],
      semaines: ['assets/cartes/me-le-donner-mini.jpg', 'Ce que je n’ai pas reçu, je peux apprendre à me le donner.']
    }
  },

  mots: {
    tonmois: "Lis ton mois comme une lettre écrite pour toi. Novembre invite à rentrer à l’intérieur : prends ce qui te réchauffe.",
    ouverture: "Ta météo, ta roue et ton objectif : dix minutes, pas plus. Ce mois-ci, regarde aussi ce qui tient bon dans ta roue.",
    theme: "Rien à faire ici, seulement à lire. Laisse remonter les moments où tu as été plus fort·e que tu ne pensais.",
    comprendre: "La modestie, c’est joli, mais pas ce mois-ci. Ose nommer ce que tu fais bien, sans t’excuser.",
    exercices: "Commence par le premier exercice, au chaud, avec un thé. Tes fiertés sont plus nombreuses que tu ne crois.",
    rituel: "Ta connexion de novembre passe par une pierre, une flamme et un merci. Simple, et tellement réconfortant.",
    semaines: "Chaque semaine, un petit défi pour t’appuyer sur toi. Tu n’as rien à prouver, seulement à remarquer.",
    cloture: "Prends ce moment même si tout n’a pas été fait. Regarde surtout ce sur quoi tu as pu t’appuyer."
  },

  theme: {
    titre: 'Le mois de tes appuis',
    texte: [
      "Novembre, c'est la saison où la nature se retire. Les arbres sont presque nus, la lumière baisse tôt, et l'on a envie de rentrer, de se réchauffer, de se rassembler. Ce n'est pas un temps vide : c'est le moment où l'arbre se tient grâce à ce qu'il a de plus solide, son tronc et ses racines.",
      "Ce carnet t'invite à faire pareil : regarder ce qui te tient debout. Tes forces, celles que tu utilises sans même y penser. Tes appuis, les personnes, les lieux, les habitudes qui te ressourcent. Et ce que tu as reçu de beau de celles et ceux qui sont venus avant toi. Quand on sait sur quoi s'appuyer, on traverse l'hiver plus sereinement."
    ],
    sousTitre: 'Pourquoi regarder tes forces ?',
    texte2: [
      "En coaching, on dit souvent que l'on avance plus vite en s'appuyant sur ses forces qu'en corrigeant ses faiblesses. Pourtant, quand on nous demande nos qualités, on bafouille, alors qu'on peut citer nos défauts en dix secondes. Ce qui nous vient facilement nous paraît normal, et nous ne le voyons plus.",
      "Une force, c'est ce que tu fais bien et qui te donne de l'énergie en même temps : écouter, organiser, faire rire, persévérer, créer du beau, apaiser une pièce tendue. Un appui, c'est ce qui te ressource quand le reste vacille : une amie, une marche en forêt, une recette, une phrase qu'on te disait enfant. Certaines de ces forces et de ces appuis t'ont été transmis : le courage d'une grand-mère, l'humour d'un oncle, des mains habiles qui viennent de loin.",
      "Ce mois-ci, tu vas **reconnaître** tes forces, **rassembler** tes appuis, et **dire merci** à ce qui t'a été transmis de beau. En parallèle, ton suivi « Je me libère » t'invite à te tourner vers tes ancêtres : les deux avancent ensemble, l'un reçoit, l'autre rend."
    ],
    exemplesTitre: 'Des forces que l’on ne voit plus',
    exemples: [
      "**Au travail** : c'est toujours vers toi que l'on se tourne quand il faut calmer un client mécontent. Tu appelles ça « avoir l'habitude ». C'est une vraie force : l'apaisement.",
      "**En famille** : tu te souviens des anniversaires de tout le monde et tu envoies un mot à chacun·e. Ce n'est pas « rien », c'est ta fidélité, et elle tient les liens.",
      "**Avec tes amis** : on te confie des secrets depuis l'école. Ta discrétion et ton écoute sont des appuis pour les autres, et elles peuvent l'être pour toi aussi.",
      "**Dans les moments durs** : tu as traversé un déménagement, une séparation, une période de doute, et tu as continué à te lever chaque matin. Ta persévérance est là, même quand tu ne la sens pas.",
      "**Dans ce que tu as reçu** : tu cuisines comme ta grand-mère, tu jardines comme ton père, tu racontes les histoires comme ta tante. Ces gestes sont des racines vivantes."
    ],
    exempleSpiraleTitre: 'Un exemple d’appui retrouvé',
    exempleSpirale: "Ta roue montre ton énergie à 4. Au lieu de chercher ce qui ne va pas, tu regardes ce qui t'a toujours relancé·e : la marche, depuis l'enfance, avec ton grand-père le dimanche. Tu décides de marcher vingt minutes chaque samedi matin, en pensant à lui. À la fin du mois, ton énergie est à 6, et tu as l'impression de marcher accompagné·e.",
    question: { k: 'theme-forces', q: "Si une personne qui t’aime décrivait tes trois plus grandes forces, que dirait-elle ?", ph: "Exemple : elle dirait que je suis fiable, que je sais écouter sans juger, et que je ne lâche jamais une amie dans la difficulté." }
  },

  comprendre: {
    titre: 'Reconnaître tes forces, sans fausse modestie',
    texte: [
      "Reconnaître tes forces, ce n'est pas te vanter. C'est voir clairement ce que tu sais faire, pour pouvoir t'en servir quand tu en as besoin. Une force que l'on ne voit pas reste au fond du tiroir ; une force que l'on nomme devient un outil.",
      "Pour repérer une force, cherche ce qui coche trois cases : tu le fais bien, tu le fais souvent sans effort, et ça te donne de l'énergie plutôt que de t'en prendre. Si l'une des cases manque, c'est peut-être une compétence apprise par obligation : utile, mais pas forcément nourrissante.",
      "Beaucoup de forces sont nées dans des moments difficiles. Celle ou celui qui a grandi dans une maison bruyante a souvent appris à garder son calme. Celle ou celui qui a dû se débrouiller tôt sait trouver des solutions. Tu peux remercier ces forces, même si tu n'as pas choisi la façon dont tu les as apprises.",
      "Tes appuis, enfin, sont de quatre sortes : des **personnes** (une amie, un collègue, un parent), des **lieux** (un banc, une cuisine, une forêt), des **habitudes** (un bain, une musique, une marche) et un **héritage** (une recette, un savoir-faire, une phrase de famille). Les connaître, c'est savoir où aller quand le froid arrive."
    ],
    reperes: [
      { titre: 'Une vraie force, c’est…', points: [
        "ce que l’on vient te demander spontanément ;",
        "ce que tu fais bien et qui te donne de l’élan ;",
        "ce qui t’a permis de traverser un moment difficile ;",
        "ce que tu pourrais transposer dans un autre domaine de ta roue."
      ] },
      { titre: 'Un bon appui, c’est…', points: [
        "une personne avec qui tu peux être toi, sans masque ;",
        "un lieu ou un moment où tu respires mieux ;",
        "une habitude simple qui te remet d’aplomb ;",
        "un héritage dont tu es fier·e, et que tu as envie de faire vivre."
      ] }
    ],
    regarderTitre: 'Pour mieux voir tes forces, demande-toi',
    regarderIntro: "Réponds tranquillement, sans chercher la réponse modeste. Si tu bloques, pense à ce que tes proches te disent souvent.",
    regarder: [
      { k: 'forces-demande', q: "Pour quoi les autres viennent-ils te demander de l’aide, le plus souvent ?", ph: "Exemple : pour relire un courrier important, ou pour savoir comment parler à quelqu’un de délicat." },
      { k: 'forces-facile', q: "Qu’est-ce que tu fais facilement, et qui semble difficile pour d’autres ?", ph: "Exemple : organiser un repas pour douze personnes sans stresser." },
      { k: 'forces-traverse', q: "Quelle épreuve as-tu traversée, et quelle force t’a aidé·e à tenir ?", ph: "Exemple : mon licenciement il y a trois ans. Ma capacité à rebondir, et à demander de l’aide à mes amies." },
      { k: 'forces-recu', q: "Quelle qualité as-tu reçue de ta famille, et dont tu es fier·e aujourd’hui ?", ph: "Exemple : le sens de l’accueil de ma grand-mère. Chez moi, il y a toujours une assiette de plus." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Le [test de l'arbre de vie](arbre-de-vie.html) t'aide à voir les sphères lumineuses de ta vie : ce sont souvent tes appuis. Et pour découvrir les talents et les métiers qui circulent dans ta famille, lis [les métiers transmis](metiers-transmis-genealogie.html). Ton suivi de novembre te propose de te tourner vers celles et ceux qui sont venus avant toi.",
    outils: [
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir ce qui est lumineux dans ta vie, et ce qui demande à être nourri.'],
      ['metiers-transmis-genealogie.html', 'Les métiers et talents transmis', 'Ce que ta lignée t’a donné, dans les mains comme dans le cœur.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : honorer tes ancêtres, recevoir ce qu’ils t’ont transmis, rendre ce qui ne t’appartient pas.']
    ]
  },

  exercicesTitre: 'Reconnaître, rassembler, s’appuyer',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à retrouver tes forces dans ton histoire, le deuxième à rassembler tes appuis, le troisième à utiliser une force exprès, chaque jour. Tu peux commencer par celui qui t’attire le plus.",
  exercices: [
    { k: 'ex1', titre: 'Mes trois fiertés', type: 'tableau', rangs: 3,
      etiquettes: ['Quand j’étais enfant ou adolescent·e', 'Quand j’étais jeune adulte', 'Ces dernières années'],
      consigne: "Pour chacune de ces trois périodes de ta vie, retrouve un moment dont tu es fier·e : une chose réussie, osée ou traversée. Note ce qui s'est passé, la force que tu as utilisée, et où tu pourrais l'utiliser à nouveau ce mois-ci. Les petites fiertés comptent autant que les grandes.",
      pourquoi: "Quand on aligne trois fiertés à des âges différents, on voit apparaître les forces qui nous accompagnent depuis toujours. Ce sont elles qui te tiendront debout cet hiver, et tu pourras les rappeler exprès.",
      colonnes: [
        { q: "Qu’as-tu réussi, osé ou traversé ?", ph: ["Exemple : à 11 ans, j’ai chanté seul·e à la fête de l’école malgré le trac", "Exemple : à 23 ans, je suis parti·e travailler dans une ville où je ne connaissais personne", "Exemple : l’an dernier, j’ai repris mes études tout en travaillant"] },
        { q: "Quelle force as-tu utilisée ce jour-là ?", ph: ["Exemple : le courage, et l’envie de partager ce que j’aime", "Exemple : l’audace et la capacité à créer des liens", "Exemple : l’organisation et la persévérance"] },
        { q: "Où pourrais-tu utiliser cette force ce mois-ci ?", ph: ["Exemple : prendre la parole en réunion pour proposer mon idée", "Exemple : m’inscrire seul·e à l’atelier de poterie du quartier", "Exemple : avancer sur mon projet trente minutes chaque mardi"] }
      ],
      apres: { k: 'ex1-fil', q: "Relis tes trois lignes. Quelle force revient, comme un fil rouge, d’une période à l’autre ?", ph: "Exemple : le courage d’y aller même quand j’ai peur. Je l’ai toujours eu, je l’avais juste oublié." } },

    { k: 'ex2', titre: 'Mon cercle d’appuis', type: 'blocs', nb: 3,
      etiquettes: ['Une personne', 'Un lieu, un moment ou une habitude', 'Un héritage de ma famille'],
      consigne: "Rassemble trois appuis : une personne qui te fait du bien, un lieu ou une habitude qui te ressource, et un héritage de ta famille dont tu es fier·e (une recette, un savoir-faire, une phrase, une façon d'être). Pour chacun, note ce qu'il t'apporte, et comment tu vas t'y appuyer ce mois-ci.",
      pourquoi: "Quand la fatigue arrive, on oublie souvent ce qui nous fait du bien. Avoir son cercle d’appuis sous les yeux, c’est savoir exactement où aller le jour où tu en auras besoin.",
      astuce: "Choisis des appuis concrets et accessibles cette semaine. Une amie que tu peux appeler ce soir vaut mieux qu’un voyage rêvé dans trois ans.",
      champs: [
        { q: "Quel est cet appui ?", ph: ["Exemple : ma cousine Inès", "Exemple : la marche du samedi au bord du canal", "Exemple : la soupe de potiron de ma grand-mère"] },
        { q: "Que t’apporte-t-il, concrètement ?", ph: ["Exemple : elle me fait rire et me rappelle qui je suis", "Exemple : je rentre la tête vidée et les idées claires", "Exemple : un goût de maison, de sécurité, de dimanche"] },
        { q: "Comment vas-tu t’y appuyer ce mois-ci ?", ph: ["Exemple : l’appeler un soir par semaine, sans raison", "Exemple : bloquer chaque samedi matin dans mon agenda", "Exemple : la cuisiner un dimanche et inviter mes voisins"] }
      ] },

    { k: 'ex3', titre: 'Ma force en action', type: 'texte',
      consigne: "Choisis une seule force, celle qui t'aiderait le plus en ce moment, et utilise-la exprès, chaque jour, dans une petite situation. Écris ton engagement, puis note chaque fois que tu l'as fait, et ce que tu as ressenti. Une force que l'on exerce grandit, comme un muscle.",
      pourquoi: "Utiliser consciemment une force, même dans un geste minuscule, renforce la confiance en soi bien plus que de corriger un défaut. Tu te prouves, jour après jour, que tu peux compter sur toi.",
      gestes: ["Utiliser ton humour pour détendre un moment tendu", "Mettre ta patience au service d’un proche", "Proposer ton aide pour organiser quelque chose", "Écouter une amie jusqu’au bout, sans conseiller", "Créer quelque chose de beau, même petit", "Oser dire ce que tu penses, avec douceur"],
      q: "Ta force du mois : « Ce mois-ci, je choisis de m’appuyer sur ma… en… »",
      ph: "Exemple : ce mois-ci, je choisis de m’appuyer sur ma créativité en dessinant dix minutes chaque soir, au lieu de regarder mon téléphone.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as utilisé ta force : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : mercredi, j’ai trouvé une solution pour le planning de l’équipe. Je me suis senti·e utile et fier·e." } }
  ],

  rituel: {
    titre: 'La pierre d’appui',
    intro: "En novembre, la nature se replie sur l'essentiel : la terre, les racines, ce qui tient. Ce petit rituel symbolique t'invite à choisir une pierre qui portera tes forces tout l'hiver, et à dire merci à ce qui t'a été transmis de beau. Il se fait en quinze minutes, dehors puis au chaud.",
    materiel: "Une petite pierre ramassée pendant une balade (ou un galet, un caillou du jardin), une bougie, un papier et un crayon. Si tu en as une, une photo d'une personne de ta famille qui t'inspire.",
    quand: "Fais-le en début de mois, après ton exercice des trois fiertés. Garde ensuite ta pierre dans ta poche ou près de ton lit : chaque fois que tu doutes, serre-la et rappelle-toi une de tes forces. Tu peux refaire le rituel à la nouvelle lune.",
    etapes: [
      "Pendant une balade, cherche une pierre qui t’attire par sa forme, sa couleur ou sa douceur. Ramasse-la et garde-la dans ta main jusqu’à la maison.",
      "Chez toi, allume la bougie. Pose la pierre devant toi, et respire trois fois profondément.",
      "Prends la pierre dans ta main. Nomme à voix basse trois de tes forces, une par une : « Je suis… Je sais… Je peux… »",
      "Pense à une personne qui t’a transmis quelque chose de beau, vivante ou disparue. Dis intérieurement : « Merci pour ce que tu m’as donné. Je le porte avec moi. »",
      "Écris sur le papier ta force principale du mois, plie-le, et glisse-le sous la pierre ou à côté de la bougie.",
      "Reste une minute en silence, la pierre au creux de la main, à sentir son poids. Puis éteins la bougie (ne la laisse jamais sans surveillance) et note ici ce qui est venu."
    ],
    note: { k: 'rituel-note', q: "Quelles forces as-tu confiées à ta pierre, et à qui as-tu dit merci ?", ph: "Exemple : ma persévérance, ma douceur et mon humour. J’ai dit merci à mon grand-père, qui ne baissait jamais les bras." }
  },

  meditation: {
    titre: 'Le cercle de tes appuis',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Pose tes mains sur tes cuisses, paumes ouvertes. Ferme les yeux, ou laisse ton regard se poser devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Imagine que tu marches sur un chemin de novembre. L’air est frais, les feuilles craquent sous tes pas, et au loin tu vois une petite lumière chaude : un feu, dans une clairière.",
      "Tu t’approches. Le feu crépite doucement. Il y a un tapis épais, une couverture. Tu t’assois. Tu sens la chaleur sur ton visage et sur tes mains.",
      "[pause]",
      "Autour du feu, peu à peu, des silhouettes viennent s’asseoir. Ce sont tes appuis. Une amie qui te fait rire. Une personne de ta famille qui t’a appris quelque chose. Peut-être un professeur, un voisin, quelqu’un que tu n’as pas revu depuis longtemps. Laisse-les venir, sans chercher.",
      "Chacun·e te regarde avec bienveillance. Tu n’as rien à prouver ici. Tu es accueilli·e tel·le que tu es.",
      "[longue pause]",
      "Maintenant, imagine que l’une de ces personnes se penche vers toi et te dit une de tes forces : « Tu es courageux·se. » ou « Tu sais aimer. » ou « Tu ne lâches jamais. » Écoute. Laisse ce mot entrer en toi, comme la chaleur du feu.",
      "Une autre personne te tend un petit objet. C’est ce que ta famille t’a transmis de beau : un geste, une recette, une façon de rire, un savoir-faire. Prends-le dans tes mains. Remercie-la intérieurement.",
      "[pause]",
      "Sens comme tu es entouré·e. Même quand tu te crois seul·e, ce cercle est là, en toi. Tu peux y revenir chaque fois que tu as froid.",
      "Dis intérieurement : « Je reconnais mes forces. Je m’appuie sur ce qui me tient. Je dis merci à ce qui m’a été donné. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir tranquille, une boisson chaude à côté de toi, une couverture sur les genoux. Si une personne disparue vient s’asseoir près du feu et qu’une émotion monte, reviens simplement à ton souffle et à la chaleur sur tes mains. Tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qui est venu s’asseoir autour du feu, et quelle force t’a-t-on dite ?", ph: "Exemple : ma tante Simone, et mon amie Léa. Ma tante m’a dit : « Tu es plus forte que tu ne crois. » J’ai eu chaud au cœur." }
  },

  semaines: [
    { titre: 'Trois forces par jour', texte: "Chaque soir, note une chose que tu as bien faite dans la journée, et la force qui t'a permis de la faire. Même minuscule. Tu entraînes ton regard à voir ce qui va bien en toi.",
      exemple: "Par exemple : « J’ai calmé mon fils avant l’école : ma patience. J’ai fini le dossier en avance : mon organisation. J’ai fait rire ma collègue : mon humour. » En fin de semaine, tu auras quinze preuves de tes forces.",
      ph: "Exemple : la patience revient presque tous les soirs. Je ne savais pas que je l’utilisais autant." },
    { titre: 'Demander à trois proches', texte: "Envoie un message à trois personnes qui te connaissent bien, et demande-leur : « Selon toi, quelle est ma plus grande force ? » Lis leurs réponses sans les discuter, et garde-les précieusement.",
      exemple: "Par exemple : ton frère répond « ta loyauté », ton amie « ta façon d’écouter », ta collègue « ton calme dans la tempête ». Souvent, les autres voient en nous ce que nous ne voyons plus.",
      ph: "Exemple : deux personnes sur trois ont parlé de ma générosité. J’ai été ému·e, et un peu gêné·e aussi." },
    { titre: 'Mon heure ressource', texte: "Choisis un de tes appuis (un lieu, une activité, une personne) et offre-lui une heure cette semaine. Note-la dans ton agenda comme un vrai rendez-vous, et honore-la, même s'il fait froid.",
      exemple: "Par exemple : une heure à la piscine le jeudi soir, un café avec ta meilleure amie, une balade en forêt le dimanche matin. Si tu dois le déplacer, déplace-le, mais ne l’annule pas.",
      ph: "Exemple : j’ai marché une heure en forêt dimanche. Je suis rentré·e avec les joues rouges et la tête légère." },
    { titre: 'Faire vivre un héritage', texte: "Cette semaine, fais vivre une chose belle qui t'a été transmise : cuisiner une recette de famille, ressortir un savoir-faire, appeler un aîné pour lui dire merci. Puis refais ta roue dans ton bilan et regarde ce qui a bougé.",
      exemple: "Par exemple : tu prépares le gratin de ta grand-mère, tu ressors la boîte à couture de ta mère, ou tu appelles ton oncle pour lui dire que tu penses à lui chaque fois que tu bricoles. Ce geste relie ce que tu as reçu à ce que tu vis.",
      ph: "Exemple : j’ai fait les crêpes de ma grand-mère avec mes enfants. On a parlé d’elle toute la soirée, c’était doux." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-force', q: "Quelle force as-tu le plus utilisée ce mois-ci, et qu’est-ce qu’elle t’a permis ?", ph: "Exemple : mon courage. J’ai osé demander un entretien à ma responsable, et elle m’a écouté·e." },
    { k: 'fin-appuis', q: "Quel appui as-tu découvert ou retrouvé, et veux-tu garder ?", ph: "Exemple : la marche du samedi, et les appels du mardi avec ma cousine." },
    { k: 'fin-transmis', q: "Qu’est-ce qui t’a été transmis de beau, et que tu as envie de faire vivre ?", ph: "Exemple : le sens de la fête de ma grand-mère. J’ai envie d’inviter plus souvent." },
    { k: 'fin-regard', q: "Qu’est-ce qui a changé dans ta façon de te regarder ?", ph: "Exemple : j’ose me dire que je suis fiable, sans ajouter « enfin, je crois »." },
    { k: 'fin-intention', q: "Quelle est ton intention pour décembre ?", ph: "Exemple : m’appuyer sur mon calme pendant les fêtes, et oser dire non une fois.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Ceux qui sont venus avant toi',
    texte: "Pendant que ton carnet t’aide à reconnaître tes forces, ton suivi t’invite à te tourner vers tes ancêtres : nommer les oubliés, recevoir ce qu’ils t’ont transmis, et rendre avec respect ce qui ne t’appartient pas. Les forces que tu reçois là-bas deviennent des appuis ici."
  },

  aVenir: [
    { mois: 'Décembre', titre: 'Ma place, mes limites', texte: "Dire oui, dire non, protéger ton énergie, et trouver ta juste place, même au cœur des fêtes.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Janvier', titre: 'Mon intention, mes valeurs', texte: "Clarifier ce qui compte vraiment pour toi, et poser l’intention de ton année.", image: 'assets/guide/guide-transmission.webp' },
    { mois: 'Février', titre: 'M’aimer d’abord', texte: "Te traiter avec la douceur que tu offres aux autres, et devenir ton tout premier appui.", image: 'assets/cartes/entiere-mini.jpg' }
  ]
};
