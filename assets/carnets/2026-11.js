/* Genesolia · Le Cercle · Carnet de novembre 2026, « J'avance » : « Mes forces, mes appuis »
   Le carnet du mois est le côté « J'avance » du Cercle : reconnaître ses forces, ses ressources, ce sur quoi s'appuyer.
   Le côté libération (« Qu’est-ce que j’ai reçu ? ») est dans Mon suivi (assets/suivi/2026-11.js).
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
    tonmois: "Lis ton mois comme une lettre écrite pour toi. Prends ce qui te réchauffe, et laisse le reste.",
    ouverture: "Ta météo, ta roue et ton objectif : dix minutes, pas plus. Ce mois-ci, regarde aussi ce qui tient bon dans ta roue.",
    theme: "Rien à faire ici, seulement à lire. Laisse remonter les moments où tu as été plus fort·e que tu ne pensais.",
    comprendre: "La modestie, c’est joli, mais pas ce mois-ci. Ose nommer ce que tu fais bien, sans t’excuser.",
    exercices: "Commence par le premier exercice, au chaud, avec un thé. Tes fiertés sont plus nombreuses que tu ne crois.",
    rituel: "Ta connexion de cette étape passe par une pierre, une flamme et un merci. Simple, et tellement réconfortant.",
    semaines: "Chaque semaine, un petit défi pour t’appuyer sur toi. Tu n’as rien à prouver, seulement à remarquer.",
    cloture: "Prends ce moment même si tout n’a pas été fait. Regarde surtout ce sur quoi tu as pu t’appuyer."
  },

  theme: {
    titre: 'Le mois de tes appuis',
    texte: [
      "Il y a des moments où l’on a besoin de revenir à l’essentiel : ce qui tient, ce qui soutient, ce qui reste quand le reste vacille. En toute saison, un arbre se tient debout grâce à ce qu’il a de plus solide, son tronc et ses racines.",
      "Ce carnet t'invite à faire pareil : regarder ce qui te tient debout. Tes forces, celles que tu utilises sans même y penser. Tes appuis, les personnes, les lieux, les habitudes qui te ressourcent. Et ce que tu as reçu de beau de celles et ceux qui sont venus avant toi. Quand on sait sur quoi s’appuyer, on traverse les périodes difficiles plus sereinement."
    ],
    sousTitre: 'Pourquoi regarder tes forces ?',
    texte2: [
      "On dit souvent que l'on avance plus vite en s'appuyant sur ses forces qu'en corrigeant ses faiblesses. Pourtant, quand on nous demande nos qualités, on bafouille, alors qu'on peut citer nos défauts en dix secondes. Ce qui nous vient facilement nous paraît normal, et nous ne le voyons plus.",
      "Une force, c'est ce que tu fais bien et qui te donne de l'énergie en même temps : écouter, organiser, faire rire, persévérer, créer du beau, apaiser une pièce tendue. Un appui, c'est ce qui te ressource quand le reste vacille : une amie, une marche en forêt, une recette, une phrase qu'on te disait enfant. Certaines de ces forces et de ces appuis t'ont été transmis : le courage d'une grand-mère, l'humour d'un oncle, des mains habiles qui viennent de loin.",
      "Ce mois-ci, tu vas **reconnaître** tes forces, **rassembler** tes appuis, et **dire merci** à ce qui t'a été transmis de beau. En parallèle, ton suivi « Je me libère » t'invite à te tourner vers tes ancêtres : les deux avancent ensemble, l'un reçoit, l'autre rend."
    ],
    exemplesTitre: 'Des forces que l’on ne voit plus',
    exemples: [
      "**Au travail** : c'est toujours vers toi que l'on se tourne quand il faut calmer un client mécontent. Tu appelles ça « avoir l'habitude ». C'est une vraie force : l'apaisement.",
      "**En famille** : tu te souviens des anniversaires de tout le monde et tu envoies un mot à chacun·e. Ce n'est pas « rien », c'est ta fidélité, et elle tient les liens.",
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
      "Tes appuis, enfin, sont de quatre sortes : des **personnes** (une amie, un collègue, un parent), des **lieux** (un banc, une cuisine, une forêt), des **habitudes** (un bain, une musique, une marche) et un **héritage** (une recette, un savoir-faire, une phrase de famille). Les connaître, c’est savoir où aller quand la fatigue arrive."
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
      { k: 'forces-facile', q: "Qu’est-ce que tu fais facilement, et qui semble difficile pour d’autres ?", ph: "Exemple : organiser un repas pour douze personnes sans m’affoler." },
      { k: 'forces-traverse', q: "Quelle épreuve as-tu traversée, et quelle force t’a aidé·e à tenir ?", ph: "Exemple : mon licenciement il y a trois ans. Ma capacité à rebondir, et à demander de l’aide à mes amies." },
      { k: 'forces-recu', q: "Quelle qualité as-tu reçue de ta famille, et dont tu es fier·e aujourd’hui ?", ph: "Exemple : le sens de l’accueil de ma grand-mère. Chez moi, il y a toujours une assiette de plus." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Le [test de l'arbre de vie](arbre-de-vie.html) t'aide à voir les sphères lumineuses de ta vie : ce sont souvent tes appuis. Et pour découvrir les talents et les métiers qui circulent dans ta famille, lis [les métiers transmis](metiers-transmis-genealogie.html). Ton suivi, à cette étape, te propose de te tourner vers celles et ceux qui sont venus avant toi.",
    outils: [
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir ce qui est lumineux dans ta vie, et ce qui demande à être nourri.'],
      ['metiers-transmis-genealogie.html', 'Les métiers et talents transmis', 'Ce que ta lignée t’a donné, dans les mains comme dans le cœur.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'À cette étape : honorer tes ancêtres, recevoir ce qu’ils t’ont transmis, rendre ce qui ne t’appartient pas.']
    ]
  },

  exercicesTitre: 'Reconnaître, rassembler, s’appuyer',
  exercicesIntro: "Pour aller plus loin, à côté de ton exercice du mois : trois exercices en plus, à faire si tu en as envie, un par semaine environ. Le premier t’aide à retrouver tes forces dans ton histoire, le deuxième à rassembler tes appuis, le troisième à utiliser une force exprès, chaque jour. Tu peux commencer par celui qui t’attire le plus.",
  exercices: [
    { k: 'ex1', titre: 'Mes trois fiertés', type: 'tableau', rangs: 3,
      etiquettes: ['Quand j’étais enfant ou adolescent·e', 'Quand j’étais jeune adulte', 'Ces dernières années'],
      consigne: "Pour chacune de ces trois périodes de ta vie, retrouve un moment dont tu es fier·e : une chose réussie, osée ou traversée. Note ce qui s'est passé, la force que tu as utilisée, et où tu pourrais l'utiliser à nouveau ce mois-ci. Les petites fiertés comptent autant que les grandes.",
      pourquoi: "Quand on aligne trois fiertés à des âges différents, on voit apparaître les forces qui nous accompagnent depuis toujours. Ce sont elles qui te tiendront debout dans les moments difficiles, et tu pourras les rappeler exprès.",
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
      q: "Ta force du mois : « Ce mois-ci, je choisis de m’appuyer sur ma… en… »",
      ph: "Exemple : ce mois-ci, je choisis de m’appuyer sur ma créativité en dessinant dix minutes chaque soir, au lieu de regarder mon téléphone.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as utilisé ta force : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : mercredi, j’ai trouvé une solution pour le planning de l’équipe. Je me suis senti·e utile et fier·e." } }
  ],

  rituel: {
    titre: 'La pierre d’appui',
    intro: "Ce petit rituel symbolique t’invite à revenir à l’essentiel : la terre, les racines, ce qui tient. Tu choisis une pierre qui portera tes forces tout au long de ton étape, et tu dis merci à ce qui t’a été transmis de beau. Il se fait en quinze minutes, dehors puis au chaud.",
    materiel: "Une petite pierre ramassée pendant une balade (ou un galet, un caillou du jardin), une bougie, un papier et un crayon. Si tu en as une, une photo d'une personne de ta famille qui t'inspire.",
    quand: "Fais-le en début de mois, après ton exercice des trois fiertés. Garde ensuite ta pierre dans ta poche ou près de ton lit : chaque fois que tu doutes, serre-la et rappelle-toi une de tes forces. Tu peux refaire le rituel à la nouvelle lune.",
    etapes: [
      "Pendant une balade, cherche une pierre qui t’attire par sa forme, sa couleur ou sa douceur. Ramasse-la et garde-la dans ta main jusqu’à la maison.",
      "Chez toi, allume la bougie. Pose la pierre devant toi, et respire trois fois profondément.",
      "Prends la pierre dans ta main. Nomme à voix basse trois de tes forces, une par une : « Je suis… Je sais… Je peux… »",
      "Pense à une personne qui t’a transmis quelque chose de beau, vivante ou disparue. Dis intérieurement : « Merci pour ce que tu m’as donné. Je le porte avec moi. »",
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
      "Imagine que tu marches sur un chemin calme. L’air est doux, tes pas sont tranquilles, et au loin tu vois une petite lumière chaude : un feu, dans une clairière.",
      "Tu t’approches. Le feu crépite doucement. Il y a un tapis épais, une couverture. Tu t’assois. Tu sens la chaleur sur ton visage et sur tes mains.",
      "[pause]",
      "Autour du feu, peu à peu, des silhouettes viennent s’asseoir. Ce sont tes appuis. Une amie qui te fait rire. Une personne de ta famille qui t’a appris quelque chose. Peut-être un professeur, un voisin, quelqu’un que tu as perdu de vue depuis longtemps. Laisse-les venir, simplement.",
      "Chacun·e te regarde avec bienveillance. Ici, tu es libre d’être toi. Tu es accueilli·e tel·le que tu es.",
      "[longue pause]",
      "Maintenant, imagine que l’une de ces personnes se penche vers toi et te dit une de tes forces : « Tu es courageux·se. » ou « Tu sais aimer. » ou « Tu tiens bon. » Écoute. Laisse ce mot entrer en toi, comme la chaleur du feu.",
      "Une autre personne te tend un petit objet. C’est ce que ta famille t’a transmis de beau : un geste, une recette, une façon de rire, un savoir-faire. Prends-le dans tes mains. Remercie-la intérieurement.",
      "[pause]",
      "Sens comme tu es entouré·e. Même quand tu te crois seul·e, ce cercle est là, en toi. Tu peux y revenir chaque fois que tu en as besoin.",
      "Dis intérieurement : « Je reconnais mes forces. Je m’appuie sur ce qui me tient. Je dis merci à ce qui m’a été donné. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir tranquille, une boisson chaude à côté de toi, une couverture sur les genoux. Si une personne disparue vient s’asseoir près du feu et qu’une émotion monte, reviens simplement à ton souffle et à la chaleur sur tes mains. Tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qui est venu s’asseoir autour du feu, et quelle force t’a-t-on dite ?", ph: "Exemple : ma tante Simone, et mon amie Léa. Ma tante m’a dit : « Tu es plus forte que tu ne crois. » J’ai eu chaud au cœur." }
  },

  semaines: [
    { titre: 'Trois forces par jour', texte: "Chaque soir, note une chose que tu as bien faite dans la journée, et la force qui t'a permis de la faire. Même minuscule. Tu entraînes ton regard à voir ce qui va bien en toi.",
      exemple: "Par exemple : « J’ai calmé mon fils avant l’école : ma patience. J’ai fini le dossier en avance : mon organisation. J’ai fait rire ma collègue : mon humour. » En fin de semaine, tu auras quinze preuves de tes forces.",
      ph: "Exemple : la patience revient presque tous les soirs. Je ne savais pas que je l’utilisais autant." },
    { titre: 'Demander à trois proches', texte: "Envoie un message à trois personnes qui te connaissent bien, et demande-leur : « Selon toi, quelle est ma plus grande force ? » Lis leurs réponses sans les discuter, et garde-les précieusement.",
      exemple: "Par exemple : ton frère répond « ta loyauté », ton amie « ta façon d’écouter », ta collègue « ton calme dans la tempête ». Souvent, les autres voient en nous ce que nous ne voyons plus.",
      ph: "Exemple : deux personnes sur trois ont parlé de ma générosité. J’ai été ému·e, et un peu gêné·e aussi." },
    { titre: 'Mon heure ressource', texte: "Choisis un de tes appuis (un lieu, une activité, une personne) et offre-lui une heure cette semaine. Note-la dans ton agenda comme un vrai rendez-vous, et honore-la, même si ta semaine est chargée.",
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
    { k: 'fin-regard', q: "Qu’est-ce qui a changé dans ta façon de te regarder ?", ph: "Exemple : j’ose me dire que je suis fiable, sans ajouter « enfin, je crois »." },
    { k: 'fin-intention', q: "Quelle est ton intention pour ta prochaine étape ?", ph: "Exemple : m’appuyer sur mon calme dans les moments chargés, et oser dire non une fois.", court: true }
  ],

  /* ───── Nouvelle trame du carnet (cycle 1 « Vivre en paix ») : 4 bases chaque mois, un sujet différent selon le mois ─────
     S1 Voir mes forces autrement · S2 Nourrir mon corps · S3 Grandir ma force · S4 Imaginer l'impossible.
     Les exercices profonds se téléchargent en PDF (mention de droits). Les clés existantes (ex1, ex2, ex3, sem1-…) sont gardées. */
  trame: 2,
  t2: {
    objectifTheme: "M’appuyer sur mes forces au quotidien",
    /* Le protocole audio du mois (un seul, en semaine 1, sur l'exercice en profondeur). audio vide : aucun lecteur. */
    protocole: { exercice: 'rencontre', titre: 'La rencontre aux trois âges', audio: '' },
    semaines: [
      { base: 'Voir mes forces autrement', titre: 'D’où viennent mes forces',
        intro: "Cette semaine, tu regardes tes forces avec des yeux neufs : d’où elles viennent, ce qu’on attendait de toi quand elles sont nées, et ce que tu veux en garder. Tu ne retires rien de ce qui t’a construite : tu enlèves seulement ce qui pèse dessus.",
        ancrage: { titre: 'Mon ancrage de sécurité',
          intro: "Un geste qui rappelle à ton corps qu’il est en sécurité. Plus tu le répètes au calme, plus il fonctionnera dans les moments difficiles.",
          etapes: [
            "Assieds-toi, les pieds au sol. Fais trois respirations lentes.",
            "Sens le poids de ton corps, tes pieds sur le sol. Imagine des racines qui partent de ton bassin et descendent dans la terre.",
            "Rappelle-toi un moment où tu t’es sentie en sécurité, entourée, tranquille. Laisse revenir l’image, les sons, la sensation.",
            "Quand la sensation est là, pose ta main sur ton cœur et garde-la quelques secondes.",
            "Dis intérieurement : « Je suis ici, maintenant, dans mon corps, en sécurité. » Puis relâche, et ouvre les yeux."
          ],
          questions: [
            { k: 'corps-s4-geste', q: 'Mon souvenir de sécurité, relié à mon geste', ph: 'Exemple : le soir où je riais avec mes amies sur la plage, l’été dernier.' },
            { k: 'corps-s4-utilise', q: 'Dans quelle situation vais-je m’en servir ce mois-ci ?', ph: 'Exemple : avant d’ouvrir mes relevés bancaires, et avant la réunion du lundi.' }
          ] },
        exercice: { de: 0, titre: 'La frise de mes forces', consigne: "Prends une grande feuille et un crayon. Trace une ligne de gauche à droite : c’est ta vie. Place trois moments dont tu es fière, un dans l’enfance, un quand tu étais jeune adulte, un ces dernières années. Pour chacun, écris au-dessus la force que tu as utilisée, et en dessous ce qui se passait autour de toi. Puis reporte ici l’essentiel : tu en auras besoin pour la rencontre." },
        protocole: { id: 'rencontre', titre: 'La rencontre aux trois âges', pdf: true,
          intro: "Un moment au calme pour rencontrer celle que tu étais, à chaque moment de ta frise. Tu la remercies, tu regardes dans quel contexte sa force est née, et tu l’aides à poser ce qui s’y est collé. Compte trente à quarante minutes. Tu peux aussi le faire en trois fois, une période par jour.",
          materiel: "Ta frise, une bougie, une chaise ou un coussin posé face à toi, un mouchoir à côté si besoin.",
          etapes: [
            "Installe-toi au calme. Allume la bougie, pose ta frise devant toi et respire lentement trois fois, en laissant ton ventre se gonfler.",
            "Imagine, assise face à toi, la petite fille que tu étais au premier moment de ta frise. Regarde ses yeux, sa posture, ses vêtements. Laisse-la être là, simplement.",
            "Dis-lui ce que tu as trouvé formidable chez elle : « Tu as été tellement courageuse quand… » Prends le temps de le lui dire vraiment.",
            "Demande-lui dans quel contexte cette force est née. Que se passait-il à la maison ? Que disait-on d’elle ? Qu’attendait-on d’elle ? Laisse venir les images et les phrases, sans forcer.",
            "Repère ce qui s’est collé à sa force : une obligation (« je dois toujours… »), un rôle (celle qui sauve, celle qui ne se plaint jamais, celle qui porte tout), une croyance, une loyauté envers quelqu’un.",
            "Parle-lui comme à une enfant que tu aimes : « Tu gardes cette force, elle t’appartient. Tu n’as plus besoin de porter ce qui allait avec. Tu peux poser ça, maintenant. » Imagine qu’elle dépose ce poids à côté d’elle, et qu’elle se redresse.",
            "Fais la même chose avec la jeune femme du deuxième moment, puis avec la femme du troisième.",
            "Pour finir, imagine que les trois viennent se placer en toi, au creux de ta poitrine, avec leurs forces et sans le poids. Respire. Pose ta main sur ton cœur, puis souffle la bougie."
          ],
          ages: ['La petite fille', 'La jeune femme', 'La femme d’aujourd’hui'],
          champs: [
            { q: 'Ce que je lui ai dit', ph: ['Exemple : tu as été si courageuse de chanter seule devant toute l’école.', 'Exemple : tu as osé partir dans une ville inconnue, je suis fière de toi.', 'Exemple : tu as tenu bon pendant tes études et ton travail en même temps.'] },
            { q: 'Ce qui s’était collé à sa force', ph: ['Exemple : il fallait être parfaite pour qu’on me remarque.', 'Exemple : je devais me débrouiller seule, ne jamais demander.', 'Exemple : je dois tout porter, sinon tout s’écroule.'] },
            { q: 'Ce qu’elle a posé', ph: ['Exemple : l’obligation d’être parfaite.', 'Exemple : la peur de déranger en demandant de l’aide.', 'Exemple : le rôle de celle qui tient tout.'] }
          ],
          apres: { k: 'rencontre-apres', q: 'Après la rencontre, ce que je ressens, et ce que je garde de mes trois forces', ph: 'Exemple : je me sens plus légère. Je garde mon courage, ma capacité à créer des liens et ma persévérance, sans l’obligation de tout faire seule.' } },
        complement: { titre: 'Le complément du mois · La lettre à la petite fille qui a dû être forte', pdf: true,
          consigne: "Après ta rencontre, écris à la petite fille que tu étais. Console-la pour ce qu’elle a porté trop tôt, remercie-la pour ce qu’elle t’a donné, et dis-lui ce qui change maintenant que tu es là pour elle. Écris-lui comme à une enfant que tu aimes de tout ton cœur.",
          amorces: ['Ma petite…', 'Tu as dû être forte quand…', 'Aujourd’hui, je suis là pour toi et…', 'Tu as le droit de…'],
          k: 'complement-lettre', ph: 'Exemple : Ma petite Léa, je sais que tu as dû grandir vite…' },
        coches: [{ k: 'sem3-c2', t: 'J’ai installé mon ancrage de sécurité' }, { k: 'sem1-c0', t: 'J’ai tracé ma frise des forces' }, { k: 'sem1-c1', t: 'J’ai fait la rencontre aux trois âges' }, { k: 'sem1-c2', t: 'J’ai écrit ma lettre à la petite fille (facultatif)' }, { k: 'sem1-c3', t: 'J’ai suivi mon fil des 7 jours' }],
        plusLoin: ['exemples', 'spirale', 'complement'] },

      { base: 'Nourrir mon corps', titre: 'Mes forces, sans jouer un rôle',
        intro: "Une force que l’on joue comme un rôle fatigue. Une force que l’on choisit nourrit. Cette semaine, tu amplifies tes forces par choix, avec plaisir, et tu offres à ton corps de nouvelles informations : il peut se détendre, tu es en sécurité.",
        comprendre: { titre: 'Pour comprendre : le mode alerte', texte: [
          "Ton système nerveux fonctionne un peu comme une voiture : il a un **accélérateur** et un **frein**. L’accélérateur te met en mouvement pour faire face (le cœur pompe, les muscles se tendent, la respiration devient courte). Le frein te ramène au calme, au repos, au lien avec les autres.",
          "Le frein passe beaucoup par le **nerf vague**, un long nerf qui relie ton cerveau à ton cœur, tes poumons et ton ventre. Quand tu expires lentement, quand tu poses une main chaude sur ta poitrine, quand tu te parles avec douceur, il reçoit le message : tu peux relâcher. Et ton corps ne fait pas bien la différence entre ce qui arrive et ce que tu imagines : quand tu te projettes dans le pire, il appuie sur l’accélérateur comme si c’était vrai."
        ], questions: [
          { k: 'corps-s2-projection', q: 'Quel scénario du pire ton esprit se raconte-t-il le plus souvent ?', ph: 'Exemple : je vais manquer d’argent à la fin du mois et je ne pourrai pas faire face.' },
          { k: 'corps-s2-reel', q: 'Et là, maintenant, qu’est-ce qui est réellement vrai ? Qu’est-ce qui tient bon ?', ph: 'Exemple : aujourd’hui, mon loyer est payé, j’ai un travail, et ma sœur m’aiderait si besoin.' }
        ] },
        protocoles: [
          { id: 'coherence', titre: 'La cohérence cardiaque', pdf: true,
            intro: "Cinq minutes, trois fois par jour cette semaine : le matin, le midi et en fin d’après-midi. C’est la façon la plus simple d’appuyer sur le frein de ton corps.",
            etapes: [
              "Assieds-toi, le dos droit, les pieds à plat sur le sol. Pose une main sur ton cœur.",
              "Inspire par le nez en comptant jusqu’à 5, en laissant ton ventre se gonfler.",
              "Expire doucement par la bouche en comptant jusqu’à 5, comme si tu soufflais dans une paille.",
              "Continue ainsi pendant cinq minutes, soit six respirations par minute. Tu peux t’aider d’un minuteur.",
              "Pendant les dernières respirations, pense à un moment où tu t’es sentie fière de toi, et laisse cette chaleur se répandre dans ta poitrine."
            ],
            jours: { k: 'coh', moments: ['Matin', 'Midi (facultatif)', 'Fin d’après-midi (facultatif)'] } },
          { id: 'corps', titre: 'Parler à mon corps', pdf: true,
            intro: "Maintenant que tu sais d’où viennent tes forces et ce qui s’y était collé, tu offres à ton corps de nouvelles informations. Une quinzaine de minutes, allongée ou assise, au calme.",
            etapes: [
              "Ferme les yeux. Respire lentement. Parcours ton corps des pieds jusqu’à la tête, et repère les zones tendues, lourdes ou serrées.",
              "Pose ta main sur la zone la plus tendue. Remercie-la : « Merci de m’avoir protégée. Tu as fait ton travail. »",
              "Demande-toi à qui appartient vraiment cette tension. Peut-être à toi, peut-être à une personne de ta famille dont tu as pris le poids sans le savoir.",
              "Si elle ne t’appartient pas, dis intérieurement : « Cette tension appartient à… Je la reconnais, je la lui rends avec amour, et je la relâche. » Imagine-la quitter ton corps à chaque expiration.",
              "Offre à cette zone une information nouvelle, comme si tu parlais à chacune de tes cellules : « Tu peux te détendre. Je suis en sécurité. Je garde ma force, sans le poids. »",
              "Respire dans la zone trois fois, lentement. Puis bouge doucement les doigts, les pieds, et ouvre les yeux."
            ],
            questions: [
              { k: 'corps-zone', q: 'La zone de mon corps qui était la plus tendue', ph: 'Exemple : mes épaules et ma mâchoire.', court: true },
              { k: 'corps-pas-a-moi', q: 'À qui appartenait cette tension, et ce que j’ai relâché', ph: 'Exemple : à ma mère, qui avait toujours peur de manquer. J’ai relâché l’idée que je dois tout prévoir.' },
              { k: 'corps-nouvelle', q: 'La nouvelle information que j’ai offerte à mon corps', ph: 'Exemple : je suis en sécurité, je peux me reposer.', court: true }
            ] }
        ],
        coches: [{ k: 'sem2-c1', t: 'J’ai fait la cohérence cardiaque au moins une fois par jour' }, { k: 'sem2-c2', t: 'J’ai parlé à mon corps' }, { k: 'sem2-c3', t: 'J’ai suivi mon fil des 7 jours' }],
        plusLoin: ['comprendre'] },

      { base: 'Grandir ma force', titre: 'Remplacer la peur par la joie d’être moi',
        intro: "Cette semaine, tu remplaces les images qui te font douter par des images de toi pleine de ta force, tu observes comment tu l’utilises, et tu y prends du plaisir. Plus tu ressens ce plaisir, plus ta confiance grandit et plus ton corps se calme.",
        protocole: { id: 'swish', titre: 'Le swish, pour changer d’image', pdf: true,
          intro: "Un exercice de PNL qui remplace une image de peur par une image de force. Il dure cinq minutes.",
          etapes: [
            "Repère une image mentale qui te fait douter de toi : toi qui bloques, qui échoues, qui te fais petite. Regarde-la quelques secondes, puis note-la.",
            "Crée maintenant l’image de toi qui utilises ta force avec aisance. Rends-la grande, lumineuse, en couleurs, avec les sons et ce que tu ressens. Note-la aussi.",
            "Place la première image en grand devant toi. Mets la nouvelle, toute petite et sombre, dans un coin de cette image.",
            "En un éclair, dis « swish » : la petite image grandit et s’illumine jusqu’à tout recouvrir, pendant que l’ancienne rapetisse et s’éloigne jusqu’à disparaître.",
            "Ouvre les yeux et regarde un objet autour de toi pour effacer l’écran. Recommence cinq fois, de plus en plus vite.",
            "Pense à nouveau à l’ancienne image. Que se passe-t-il ? Souvent, elle est plus floue, plus loin, ou c’est la nouvelle qui revient d’elle-même."
          ],
          questions: [
            { k: 'swish-ancienne', q: 'L’image qui me faisait douter', ph: 'Exemple : moi qui rougis et bafouille en réunion.' },
            { k: 'swish-nouvelle', q: 'Ma nouvelle image, pleine de ma force', ph: 'Exemple : moi qui prends la parole calmement, le dos droit, et qui souris.' },
            { k: 'swish-apres', q: 'Ce qui a changé après cinq fois', ph: 'Exemple : l’ancienne image est floue, et je sens mes épaules plus légères.' }
          ] },
        amplifier: { titre: 'Amplifier ma force, par choix',
          consigne: "Choisis la force de ta frise qui compte le plus pour toi en ce moment. Regarde quand tu l’utilises par plaisir, et quand tu l’utilises par obligation. Puis écris la phrase qui la rend vraiment tienne.",
          questions: [
            { k: 'ampl-force', q: 'La force que je choisis d’amplifier ce mois-ci', ph: 'Exemple : mon courage.', court: true },
            { k: 'ampl-plaisir', q: 'Quand est-ce que je l’utilise avec plaisir, par choix ?', ph: 'Exemple : quand je propose une idée nouvelle au travail, ou quand j’ose une activité seule.' },
            { k: 'ampl-role', q: 'Quand est-ce que je l’utilise comme un rôle, par obligation ?', ph: 'Exemple : quand je fais semblant que tout va bien pour ne pas inquiéter ma famille.' },
            { k: 'ampl-phrase', q: 'Ma phrase : « Je choisis d’être… parce que j’aime… »', ph: 'Exemple : je choisis d’être courageuse parce que j’aime me sentir vivante, pas parce qu’on attend de moi que je tienne.', court: true }
          ] },
        loupe: { de: 2, titre: 'La loupe sur ma force', consigne: "Choisis une seule force, celle que tu viens d’amplifier, et utilise-la exprès chaque jour dans une petite situation. Observe-toi comme avec une loupe : ce que tu fais, ce que tu ressens dans ton corps, et le plaisir que tu y prends.",
          plaisir: { k: 'loupe-plaisir', q: 'Le plaisir que j’ai pris à utiliser ma force cette semaine' },
          corps: { k: 'loupe-corps', q: 'Ce qui change dans mon corps quand j’utilise ma force par plaisir', ph: 'Exemple : ma respiration est plus ample, je me tiens plus droite, je souris plus.' } },
        coches: [{ k: 'sem3-c0', t: 'J’ai fait le swish cinq fois' }, { k: 'sem2-c0', t: 'J’ai écrit ma phrase « Je choisis d’être… »' }, { k: 'sem3-c1', t: 'J’ai utilisé ma force exprès chaque jour' }, { k: 'sem3-c3', t: 'J’ai suivi mon fil des 7 jours' }] },

      { base: 'Imaginer l’impossible', titre: 'Une foi solide en la vie',
        intro: "Dernière semaine du mois : tu imagines plus grand que ce que tu crois possible. Pas pour te mettre la pression, mais pour retrouver une foi solide en la vie. Tu fais ta part, la vie fait la sienne, parfois d’une façon que tu n’aurais pas imaginée.",
        impossible: { titre: 'Et si tout était possible ?', questions: [
          { k: 'imp-tout', q: 'Si tout était possible, sans limite d’argent, de temps ni de regard des autres, que vivrais-tu dans un an ?', ph: 'Exemple : je vivrais au bord de la mer, j’animerais des ateliers d’écriture, et je me réveillerais sans peur du lendemain.', lignes: 4 },
          { k: 'imp-part', q: 'Quelle petite part de ce rêve peux-tu commencer dès ce mois-ci ?', ph: 'Exemple : écrire chaque dimanche matin, et me renseigner sur un premier atelier.' }
        ] },
        texte: { titre: 'Mon texte « Je suis »', pdf: true,
          consigne: "Ta visualisation du mois, c’est toi qui l’écris. Complète chaque phrase avec tes mots, au présent, comme si c’était déjà vrai. Puis relis ton texte : s’il ne te ressemble pas tout à fait, modifie-le jusqu’à ce qu’il sonne juste.",
          phrases: [
            { k: 'vis-1', avant: 'Je suis', ph: 'une femme solide, douce et libre' },
            { k: 'vis-2', avant: 'Chaque jour, je ressens', ph: 'de la confiance et de la joie' },
            { k: 'vis-3', avant: 'Ce mois-ci, j’ai libéré', ph: 'l’obligation de tout porter seule' },
            { k: 'vis-4', avant: 'Je m’appuie sur', ph: 'mon courage et mes amies' },
            { k: 'vis-5', avant: 'Je m’autorise à', ph: 'recevoir de l’aide et du plaisir' },
            { k: 'vis-6', avant: 'Ma vie m’offre', ph: 'des rencontres justes et de la sérénité' },
            { k: 'vis-7', avant: 'Je dis merci pour', ph: 'tout ce qui vient vers moi' }
          ],
          relu: { k: 'vis-relu', q: 'J’ai relu mon texte : il est en accord avec moi' },
          modif: { k: 'vis-modif', q: 'Ce que je modifie pour qu’il me ressemble vraiment (facultatif)', ph: 'Exemple : je remplace « solide » par « apaisée ».' },
          lecture: { k: 'vis-lu', q: 'Je lis mon texte à voix haute, matin et soir, cette semaine' } },
        coches: ['J’ai imaginé l’impossible et choisi une part à commencer', 'J’ai écrit et relu mon texte « Je suis »', 'Je l’ai lu à voix haute matin et soir', 'J’ai suivi mon fil des 7 jours'] }
    ]
  },

  /* L'exercice du mois, à faire seul·e (version finale) : affiché en semaine 1, après le thème.
     Étapes : une phrase, { t, liste, fin } ou un groupe { titre, etapes }. Clés de champ : exmois-note, exmois-fait. */
  exerciceDuMois: {
    titre: "Vider mon sac : ce que je désire, ce que je porte",
    objectif: "faire le tri entre ce qui est à moi et ce que je porte pour les autres.",
    sousObjectif: "repérer les croyances, les phrases, les loyautés et les étiquettes qui freinent mes envies, et voir les forces et les appuis que j’ai déjà.",
    duree: "en deux jours. Jour 1 : 30 min. Jour 2 : 30 min. Ensuite, 1 min par jour.",
    temps: [
      {
        titre: "Jour 1 · Ouvrir mon sac (30 min)",
        etapes: [
          "**Mes 9 envies (10 min).** Note 3 choses que tu voudrais avoir dans ta vie matérielle, 3 choses que tu voudrais être, et 3 choses que tu voudrais voir dans la société et autour de toi.",
          "**Mon tableau (20 min).** À côté de chaque envie, trois colonnes : ma croyance (ce que je pense tout bas à ce sujet), la phrase entendue (ce qu’on disait dans ma famille, et qui le disait), la loyauté (à qui je reste fidèle en gardant cette croyance). Chaque croyance, phrase ou loyauté est un objet de ton sac."
        ],
        tableau: {
          titre: "Un exemple de tableau",
          entetes: ["Mon envie", "Ma croyance", "La phrase entendue", "La loyauté"],
          lignes: [
            [
              "Avoir une maison lumineuse avec un jardin",
              "Une maison, ça se paie toute une vie",
              "« Chez nous, on se contente de ce qu’on a » (ma mère)",
              "Mes parents ont vécu avec le strict nécessaire. Avoir plus, ce serait les dépasser"
            ],
            [
              "Être reconnu·e pour mon travail",
              "Il faut souffrir pour mériter",
              "« Le travail, c’est dur, c’est comme ça » (mon père)",
              "Mon père a travaillé toute sa vie dans l’ombre"
            ],
            [
              "Voir autour de moi des gens qui s’entraident",
              "Chacun pour soi",
              "« Méfie-toi des autres » (ma grand-mère)",
              "Ma grand-mère a été trahie par ses proches pendant la guerre"
            ]
          ]
        }
      },
      {
        titre: "Jour 2 · Trier (30 min)",
        etapes: [
          "**Est-ce vraiment pour moi ? (5 min)** Pour chaque envie, écris pourquoi tu la veux : pour toi, ou pour prouver, faire plaisir, réparer quelqu’un ? Garde les envies qui viennent de ton cœur.",
          "**Ce qui la retient (10 min).** Quelle étiquette est encore collée sur moi (« la fragile », « la petite dernière », « celle qui galère ») ? Ai-je un pardon à faire, envers moi ou quelqu’un d’autre, pour me sentir digne de la recevoir ? Qu’est-ce qui d’autre se met entre moi et cet objectif ?",
          "**Mes forces et mes appuis (10 min).** Ce que tu as déjà de ces envies, même en petit. Ce que tu as construit, les personnes et les ressources sur lesquelles tu t’appuies. Termine par : « Je comprends comment je crée ma réalité : … »",
          "**Vider le sac (5 min).** Écris sur un papier ce que tu laisses sortir du sac, puis brûle-le en sécurité ou déchire-le. Écris tes forces sur une petite carte et glisse-la dans ton sac ou ton portefeuille."
        ]
      }
    ],
    geste: {
      titre: "Chaque jour (1 min)",
      texte: "Regarde ta carte de forces, et note une chose de tes envies déjà présente dans ta vie."
    },
    liens: [
      ["loyaute-familiale-invisible.html", "La loyauté familiale invisible"]
    ],
    ph: "Exemple : je garde mon envie de maison lumineuse. Je laisse sortir du sac la phrase « on se contente de ce qu’on a »."
  },

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: "Qu’est-ce que j’ai reçu ?",
    texte: "Pendant que ton carnet t’aide à reconnaître tes forces, ton suivi t’invite à faire l’inventaire de ce que ta lignée t’a transmis : les dons que tu gardes, et un poids que tu choisis de rendre avec respect. Les dons que tu reçois là-bas deviennent des appuis ici."
  },

  /* À lire ce mois-ci : les articles du blog reliés au mois, en bas du carnet */
  aLire: [
    { lien: 'toussaint-ancetres-et-deuils.html', titre: 'Toussaint : honorer ses ancêtres et les deuils de sa lignée', resume: "D’où viennent ces fêtes, les deuils restés en suspens, des gestes simples et des questions à poser en famille." },
    { lien: 'metiers-transmis-genealogie.html', titre: 'Le métier transmis de génération en génération', resume: "Reprendre le métier de son père, rompre avec lui, le métier qui saute une génération." },
    { lien: 'loyaute-familiale-invisible.html', titre: 'La loyauté familiale invisible', resume: "Ce que c’est, des exemples concrets, les signes pour la reconnaître et choisir ta propre vie." },
    { lien: 'le-ciel-du-mois.html', titre: 'Le ciel du mois', resume: "Les lunes, les éclipses, les rétrogrades et les nombres du mois, avec une lecture symbolique reliée à ta famille." }
  ],

  aVenir: [
    { mois: 'Étape 3', titre: 'Ma place, mes limites', texte: "Dire oui, dire non, protéger ton énergie, et trouver ta juste place, même dans les moments les plus chargés.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Étape 4', titre: 'Mon intention, mes valeurs', texte: "Clarifier ce qui compte vraiment pour toi, et poser l’intention de ton année.", image: 'assets/guide/guide-transmission.webp' },
    { mois: 'Étape 5', titre: 'M’aimer d’abord', texte: "Te traiter avec la douceur que tu offres aux autres, et devenir ton tout premier appui.", image: 'assets/cartes/entiere-mini.jpg' }
  ]
};
