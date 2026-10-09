/* Genesolia · Le Cercle · Carnet de février 2027, « J'avance » : « M'aimer d'abord »
   Le carnet du mois est le côté coaching du Cercle : estime de soi, besoins, se traiter comme on traite ceux qu'on aime.
   Le côté libération (« Le couple et les schémas amoureux ») est dans Mon suivi (assets/suivi/2027-02.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-02',
  nomMois: 'février 2027',
  moisSuivant: 'mars',
  titre: "M’aimer d’abord",
  sousTitre: "Te regarder avec la même tendresse que tu offres à ceux que tu aimes, reconnaître tes besoins, et t’offrir chaque semaine un geste qui te dit : tu comptes.",
  pdf: '',
  image: 'assets/cartes/me-le-donner.jpg',
  citation: "La façon dont tu te parles devient la maison dans laquelle tu vis. Fais-en un endroit doux.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Mes besoins', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-bienvenue.webp',
      theme: 'assets/guide/guide-cadeau.webp',
      comprendre: 'assets/guide/guide-coffret.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/me-le-donner-mini.jpg', "Ce que je n’ai pas reçu, je peux apprendre à me le donner."],
      semaines: ['assets/cartes/entiere-mini.jpg', "Je ne suis pas trop. Je suis entière."]
    }
  },

  mots: {
    tonmois: "Lis ton mois comme une lettre écrite par quelqu’un qui t’aime. Garde ce qui te fait du bien, laisse le reste.",
    ouverture: "Prends dix minutes pour ta météo, ta roue et ton objectif. Ce mois-ci, regarde surtout ta connexion à toi : c’est elle qu’on va nourrir.",
    theme: "Rien à faire ici, seulement à lire. Et si une phrase te touche, relis-la à voix basse, pour toi.",
    comprendre: "Un besoin n’est pas un caprice. C’est une information précieuse sur ce qui te fait tenir debout.",
    exercices: "Commence par le premier exercice, un soir tranquille. Tu vas peut-être découvrir que tu es bien plus dur·e avec toi qu’avec n’importe qui d’autre.",
    rituel: "Une bougie, un miroir, quelques mots doux. Ce rituel est simple, et pourtant il peut changer ta façon de te regarder.",
    semaines: "Un petit geste de tendresse envers toi chaque jour. Pas pour être parfait·e : pour te rappeler que tu comptes.",
    cloture: "Relis ton mois avec les yeux d’une amie. Tu verras tout ce que tu as osé t’offrir."
  },

  theme: {
    titre: "Le mois où je m’aime d’abord",
    texte: [
      "Février, c’est le mois où l’on parle d’amour partout. Les vitrines se remplissent de cœurs, on pense à l’autre, au couple, à ce qu’on offre et à ce qu’on reçoit. Mais il y a une relation qu’on oublie presque toujours : celle que tu as avec toi. Elle est pourtant la seule qui t’accompagnera chaque jour de ta vie.",
      "Pendant que la lumière revient doucement, quelques minutes de plus chaque soir, ce carnet t’invite à rallumer la tienne. Te regarder avec la même tendresse que tu réserves à tes enfants, à ta meilleure amie, à ton chat. Reconnaître ce dont tu as besoin, sans te sentir égoïste. Et t’offrir, chaque semaine, un geste qui te dit : tu comptes, toi aussi."
    ],
    sousTitre: "Pourquoi s’aimer d’abord ?",
    texte2: [
      "S’aimer d’abord, ce n’est pas se préférer aux autres. C’est arrêter de passer en dernier. Quand ton réservoir est vide, tu donnes avec fatigue, parfois avec rancœur. Quand il est plein, tu donnes avec joie, et tu sais aussi recevoir. L’estime de soi n’est pas un luxe : c’est le sol sur lequel tout le reste se construit.",
      "L’estime de soi repose sur trois piliers simples. **Te reconnaître** : voir tes qualités, tes efforts, ce que tu fais bien, même quand personne ne le remarque. **Te respecter** : écouter tes besoins et leur faire une place. **Te parler avec douceur** : remplacer la petite voix qui critique par une voix qui encourage.",
      "Ce mois-ci, tu vas **observer** comment tu te parles, **nommer** tes besoins essentiels, et **t’offrir** un geste de tendresse chaque jour. En parallèle, ton suivi « Je me libère » regarde les couples de ta lignée et ta façon d’aimer : les deux se répondent, car on aime souvent les autres comme on a appris à s’aimer soi-même."
    ],
    exemplesTitre: "Quand on oublie de s’aimer, au quotidien",
    exemples: [
      "**Le dernier morceau** : tu gardes toujours la part la plus abîmée pour toi, la chaise bancale, la serviette la plus usée. Sans y penser.",
      "**La voix intérieure** : tu as oublié un rendez-vous et tu te traites d’idiot·e, alors que tu dirais à une amie : « Ça arrive à tout le monde. »",
      "**Les compliments** : quelqu’un te dit que ta robe te va bien, tu réponds aussitôt « Oh, elle est vieille », au lieu de dire merci.",
      "**Les besoins en attente** : tu repousses ton rendez-vous chez le coiffeur depuis trois mois, mais tu as organisé l’anniversaire de toute la famille.",
      "**La fatigue cachée** : tu dis « ça va » alors que tu rêves d’une après-midi entière sans rien faire."
    ],
    exempleSpiraleTitre: "Un exemple de petit pas",
    exempleSpirale: "Ce soir, tu as raté ta recette et la petite voix démarre : « Tu ne sais rien faire. » Cette fois, tu poses la cuillère, tu respires et tu te demandes : « Qu’est-ce que je dirais à ma sœur ? » Tu te réponds : « Tu étais fatiguée, ce n’est qu’un gâteau. » Tu ris un peu. Rien n’a changé dehors, mais quelque chose a changé dedans : tu viens de te traiter comme quelqu’un que tu aimes.",
    question: { k: 'theme-amour-soi', q: "Si tu te traitais exactement comme tu traites la personne que tu aimes le plus, qu’est-ce qui changerait dans tes journées ?", ph: "Exemple : je me laisserais dormir le dimanche matin, je me ferais un vrai déjeuner, et je ne me gronderais plus pour chaque oubli." }
  },

  comprendre: {
    titre: "Écouter tes besoins sans te juger",
    texte: [
      "Un besoin, c’est ce qui te permet de te sentir bien, en sécurité et vivant·e. Le repos, le mouvement, la reconnaissance, la tendresse, le calme, la liberté, le sens. Tout le monde en a. Pourtant, beaucoup d’entre nous ont appris très tôt à les faire passer après ceux des autres, parfois au point de ne plus savoir les reconnaître.",
      "Ton corps et tes émotions te parlent de tes besoins. La **fatigue** dit souvent besoin de repos. L’**agacement** dit souvent besoin de respect ou d’espace. La **tristesse** dit souvent besoin de lien ou de réconfort. L’**ennui** dit souvent besoin de sens ou de nouveauté. Une émotion n’est pas un problème à faire taire : c’est un messager.",
      "Écouter un besoin ne veut pas dire tout lâcher pour lui. Cela veut dire le reconnaître (« J’ai besoin de calme »), puis chercher un geste simple pour le nourrir, même petit : dix minutes au calme dans la voiture avant de rentrer, c’est déjà répondre à ce besoin.",
      "Et souviens-toi : tu n’as pas à mériter tes besoins. Tu n’as pas à finir toutes tes tâches pour avoir le droit de te reposer. Tu peux te donner ce dont tu as besoin, aujourd’hui, tel·le que tu es."
    ],
    reperes: [
      { titre: "Une estime de soi qui grandit se reconnaît…", points: [
        "quand tu acceptes un compliment avec un simple merci ;",
        "quand tu oses dire « j’ai besoin de… » sans te justifier pendant dix minutes ;",
        "quand une erreur reste une erreur, et pas une preuve que tu ne vaux rien ;",
        "quand tu prends du temps pour toi sans culpabilité."
      ] },
      { titre: "Une estime de soi qui a besoin d’être nourrie se reconnaît…", points: [
        "quand tu te compares sans cesse et que tu sors toujours perdant·e ;",
        "quand tu as du mal à dire non, de peur de décevoir ;",
        "quand tu ne sais plus très bien ce qui te fait plaisir ;",
        "quand tu attends que les autres te disent que tu as bien fait pour y croire."
      ] }
    ],
    regarderTitre: "Pour mieux t’aimer ce mois-ci, demande-toi",
    regarderIntro: "Prends ces questions une par une, sans chercher la réponse parfaite. Écris ce qui vient en premier : c’est souvent le plus vrai.",
    regarder: [
      { k: 'besoin-oublie', q: "Quel besoin as-tu mis de côté depuis trop longtemps ?", ph: "Exemple : le besoin de calme. Je n’ai pas eu une soirée seule depuis la rentrée." },
      { k: 'besoin-voix', q: "Quelle phrase dure te répètes-tu le plus souvent, et à qui ne la dirais-tu jamais ?", ph: "Exemple : « Tu es nulle en organisation. » Je ne la dirais jamais à ma fille." },
      { k: 'besoin-qualites', q: "Quelles sont trois qualités que les personnes qui t’aiment voient en toi ?", ph: "Exemple : ma générosité, mon humour, ma façon d’écouter sans juger." },
      { k: 'besoin-geste', q: "Quel geste simple te ferait sentir aimé·e par toi-même cette semaine ?", ph: "Exemple : prendre un bain le dimanche soir avec une musique douce, téléphone éteint." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Les [cartes Genesolia](cartes.html) peuvent t’accompagner ce mois-ci : tire-en une le matin et garde sa phrase avec toi toute la journée. Et si tu remarques que ta façon de t’aimer ressemble à celle de ta mère ou de ta grand-mère, c’est le moment d’ouvrir [ton suivi](mon-suivi.html).",
    outils: [
      ['cartes.html', 'Tirer une carte du jour', "Une phrase douce pour la journée, à garder sur toi ou à recopier dans ton carnet."],
      ['mon-guide.html', 'Mon guide du mois', "Ton nombre du mois, ton ciel et tes dates clés, pour savoir quand t’accorder du repos."],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', "Ce mois-ci : regarder les couples de ta lignée et choisir l’amour que tu veux vivre."]
    ]
  },

  exercicesTitre: "Me voir, me comprendre, me choyer",
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à entendre comment tu te parles, le deuxième à nommer tes besoins essentiels, le troisième à t’offrir chaque jour une preuve d’amour. Tu peux les faire dans l’ordre ou commencer par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: "Comme je parle à ceux que j’aime", type: 'tableau', rangs: 3,
      etiquettes: ['Quand je me trompe', 'Quand je suis fatigué·e', 'Quand je réussis quelque chose'],
      consigne: "Pour chacune de ces trois situations, écris d’abord ce que tu dirais à une personne que tu aimes, puis ce que tu te dis réellement à toi, et enfin la phrase que tu veux t’offrir désormais. Sois honnête : personne d’autre ne lira ces lignes.",
      pourquoi: "On est souvent bien plus dur·e avec soi qu’avec n’importe qui. Mettre les deux voix côte à côte rend l’écart visible, et c’est en le voyant qu’on peut enfin choisir une voix plus juste.",
      colonnes: [
        { q: "Que dirais-tu à une personne que tu aimes ?", ph: ["Exemple : « Ce n’est pas grave, tu apprends. »", "Exemple : « Va t’allonger, je m’occupe du reste. »", "Exemple : « Bravo, tu peux être fière de toi ! »"] },
        { q: "Que te dis-tu à toi, en vrai ?", ph: ["Exemple : « Tu es vraiment bête, tu rates tout. »", "Exemple : « Arrête de te plaindre, les autres font plus que toi. »", "Exemple : « Ce n’était pas si difficile, n’importe qui l’aurait fait. »"] },
        { q: "Quelle phrase veux-tu t’offrir désormais ?", ph: ["Exemple : « Je me suis trompé·e, et je peux réparer. »", "Exemple : « J’ai le droit de m’arrêter. »", "Exemple : « J’ai réussi, et je le savoure. »"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Qu’est-ce que tu remarques sur la façon dont tu te parles, et quelle phrase veux-tu garder en premier ?", ph: "Exemple : je ne me félicite jamais. Je garde « J’ai réussi, et je le savoure » et je la colle sur mon frigo." } },

    { k: 'ex2', titre: "Mes trois besoins essentiels", type: 'blocs', nb: 3,
      etiquettes: ['Un besoin de mon corps', 'Un besoin de mon cœur', 'Un besoin de mon esprit'],
      consigne: "Choisis trois besoins qui comptent vraiment pour toi en ce moment : un pour ton corps (repos, mouvement, chaleur…), un pour ton cœur (tendresse, reconnaissance, lien…), un pour ton esprit (calme, sens, nouveauté…). Pour chacun, note comment tu sais qu’il n’est pas nourri, puis un geste simple pour lui faire une place.",
      pourquoi: "Un besoin ignoré ne disparaît pas : il revient sous forme de fatigue, d’agacement ou de tristesse. Le nommer clairement, c’est passer de « je ne vais pas bien » à « je sais ce qu’il me faut », et ça change tout.",
      astuce: "Choisis des gestes si simples que tu ne pourras pas dire « je n’ai pas le temps ». Dix minutes suffisent.",
      champs: [
        { q: "Quel est ce besoin ?", ph: ["Exemple : dormir plus", "Exemple : être reconnu·e pour ce que je fais", "Exemple : avoir du calme dans ma tête"] },
        { q: "Comment sais-tu qu’il n’est pas nourri en ce moment ?", ph: ["Exemple : je bâille dès 15 h, je suis irritable le soir", "Exemple : je me sens invisible, je fais tout sans un merci", "Exemple : je pense à mille choses en même temps, même la nuit"] },
        { q: "Quel geste simple vas-tu lui offrir cette semaine ?", ph: ["Exemple : me coucher à 22 h trois soirs", "Exemple : me dire moi-même merci, chaque soir, pour une chose faite", "Exemple : dix minutes de silence après le déjeuner"] }
      ] },

    { k: 'ex3', titre: "Mon carnet de tendresse", type: 'texte',
      consigne: "Chaque jour de ce mois, offre-toi un petit geste de tendresse, rien que pour toi, et note-le ici avec ce que tu as ressenti. Ce n’est pas une récompense pour avoir bien travaillé : c’est un cadeau que tu te fais parce que tu existes.",
      pourquoi: "L’estime de soi grandit par des preuves, pas par des promesses. Chaque geste noté devient une preuve que tu sais veiller sur toi, et ces preuves, accumulées, changent la façon dont tu te regardes.",
      gestes: ["Te préparer une boisson chaude et la boire assis·e, sans rien faire d’autre", "Mettre ton plus joli vêtement un jour ordinaire", "Te dire « merci » le soir pour une chose faite", "Marcher dix minutes au soleil de février", "T’acheter une fleur, juste pour toi", "Accepter un compliment avec un simple merci"],
      q: "Ton geste de tendresse : « Ce mois-ci, pour me montrer que je compte, je vais… »",
      ph: "Exemple : ce mois-ci, pour me montrer que je compte, je vais m’offrir chaque matin dix minutes de café au calme, avant de réveiller la maison.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu t’es offert ce geste : quand, et qu’as-tu ressenti ?", ph: "Exemple : jeudi, j’ai bu mon café à la fenêtre en regardant le jour se lever. Je me suis senti·e précieux·se, pour une fois." } }
  ],

  rituel: {
    titre: "La lumière qui revient",
    intro: "En février, la lumière revient discrètement : chaque soir, le jour s’attarde un peu plus. Ce rituel symbolique t’invite à rallumer ta propre lumière, avec une bougie, un miroir et quelques mots doux. Il se fait en dix minutes, un soir tranquille.",
    materiel: "Une bougie, un petit miroir (ou celui de ta salle de bain), un papier et un crayon. Si tu peux, une fleur ou une branche de saison posée à côté.",
    quand: "Fais-le en début de mois, un soir où tu as un peu de temps. Tu peux le refaire chaque fois que la petite voix critique devient trop forte. Certaines personnes le refont le soir de leur anniversaire.",
    etapes: [
      "Installe-toi au calme, éteins les lumières fortes et allume la bougie. Regarde la flamme et respire trois fois profondément.",
      "Sur le papier, écris trois choses que tu aimes chez toi : une qualité, un geste, un moment où tu as été fier·e de toi.",
      "Prends le miroir, regarde-toi dans les yeux quelques secondes. Si c’est inconfortable, souris-toi simplement : c’est déjà beaucoup.",
      "Lis à voix basse tes trois phrases, en commençant par « J’aime chez moi… ». Puis dis : « Merci d’être là, chaque jour. »",
      "Pose une main sur ton cœur et dis ton intention du mois : ce que tu choisis de t’offrir.",
      "Glisse le papier dans ton portefeuille ou sous ton oreiller, puis souffle la bougie. Note ici ce que tu as ressenti."
    ],
    note: { k: 'rituel-note', q: "Qu’as-tu écrit sur ton papier, et qu’as-tu ressenti en te regardant dans le miroir ?", ph: "Exemple : j’ai écrit « mon rire, ma patience avec mon fils, mon courage l’an dernier ». Au miroir, j’ai eu envie de pleurer, puis je me suis souri." }
  },

  meditation: {
    titre: "La lumière de février",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens ton corps se poser. Tes épaules descendent un peu. Ta mâchoire se desserre. Tu n’as rien à faire, rien à prouver. Juste être là, avec toi.",
      "Imagine un soir de février. Dehors, il fait encore froid, mais tu remarques que le jour s’attarde un peu plus que la semaine dernière. Une lumière dorée se pose sur les toits, sur les branches nues. La lumière revient, sans bruit.",
      "[pause]",
      "Maintenant, porte ton attention au centre de ta poitrine. Imagine qu’une petite flamme y brille. Elle a toujours été là, même les jours où tu ne la voyais plus. Elle est chaude, douce, patiente.",
      "À chaque inspiration, la flamme grandit un peu. Sa chaleur se répand dans ta poitrine, dans tes épaules, le long de tes bras, jusqu’au bout de tes doigts. Puis dans ton ventre, tes jambes, tes pieds.",
      "[longue pause]",
      "Pense maintenant à une personne que tu aimes profondément. Sens comme tu lui veux du bien, comme tu lui pardonnes facilement, comme tu la trouves belle. Garde ce sentiment… et doucement, tourne-le vers toi.",
      "Dis-toi intérieurement : « Je mérite la même tendresse. Je mérite la même patience. Je mérite d’être aimé·e, aussi par moi. »",
      "[pause]",
      "Si une petite voix proteste, ce n’est pas grave. Remercie-la, et reviens simplement à la chaleur de ta flamme. Elle ne discute pas : elle brille.",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Garde la flamme avec toi, et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes, idéalement en fin de journée, quand la lumière baisse. Une couverture sur les genoux aide. Si une émotion monte, laisse-la passer, reviens à ton souffle, et arrête-toi si tu en as besoin : tu peux reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Une image, une sensation, une phrase, une résistance…", ph: "Exemple : j’ai eu du mal à tourner la tendresse vers moi. Puis j’ai senti une chaleur dans le ventre, comme une main posée." }
  },

  semaines: [
    { titre: "Une phrase douce au miroir", texte: "Chaque matin, en te brossant les dents ou en te coiffant, regarde-toi une seconde dans le miroir et dis-toi une phrase gentille. Une seule. Même si ça te semble bizarre au début.",
      exemple: "Par exemple : « Tu fais de ton mieux », « Je suis là pour toi aujourd’hui », « Tu as le droit d’être fatigué·e ». Le troisième jour, ça devient plus naturel. Le septième, tu l’attends presque.",
      ph: "Exemple : le premier jour j’ai ri toute seule, le cinquième j’ai eu les larmes aux yeux. Ça me fait du bien." },
    { titre: "Un besoin honoré par jour", texte: "Chaque jour, demande-toi une fois : « De quoi ai-je besoin, là, maintenant ? » Puis offre-toi une réponse, même minuscule : un verre d’eau, cinq minutes assis·e, un pull plus chaud, un message à une amie.",
      exemple: "Par exemple : mardi à 16 h, tu remarques que tu as faim et froid. Au lieu de continuer, tu te fais un thé et tu manges une pomme. C’est simple, et c’est exactement ça, s’écouter.",
      ph: "Exemple : j’ai découvert que j’ai presque toujours besoin de pause vers 15 h, et que je l’ignorais depuis des années." },
    { titre: "Un rendez-vous tendresse", texte: "Bloque une heure dans ta semaine pour faire quelque chose de doux, rien que pour toi. Pas une corvée déguisée : quelque chose qui te fait plaisir. Note-la dans ton agenda et honore-la comme un rendez-vous important.",
      exemple: "Par exemple : un bain avec une bougie le dimanche soir, une balade au marché le samedi matin, une heure de lecture dans ton café préféré. Si tu dois le déplacer, déplace-le, mais ne l’annule pas.",
      ph: "Exemple : j’ai tenu mon heure du samedi au café. Personne n’avait besoin de moi pendant une heure, et c’était merveilleux." },
    { titre: "Ma liste de qualités", texte: "Demande à trois personnes qui t’aiment de te dire une qualité qu’elles voient en toi. Écris-les sans les discuter. Ajoute deux qualités que tu te reconnais toi-même. En fin de semaine, refais ta roue de la vie dans ton bilan et regarde ta connexion à toi.",
      exemple: "Par exemple : un simple message « Je fais un exercice sur la confiance en moi, tu peux me dire une qualité que tu vois chez moi ? ». Les réponses surprennent souvent, et elles restent longtemps.",
      ph: "Exemple : ma sœur a écrit « ta loyauté », mon collègue « ton calme », mon ami « ta drôlerie ». Je n’aurais jamais pensé à « calme »." }
  ],

  bilanTitre: "Ce que ce mois t’a offert",
  bilan: [
    { k: 'fin-voix', q: "Qu’est-ce qui a changé dans ta façon de te parler ce mois-ci ?", ph: "Exemple : je me surprends à me dire « ce n’est pas grave » au lieu de « tu es nulle »." },
    { k: 'fin-besoin', q: "Quel besoin as-tu appris à mieux écouter, et comment le nourris-tu maintenant ?", ph: "Exemple : mon besoin de calme. Je garde dix minutes de silence après le travail, dans la voiture." },
    { k: 'fin-qualite', q: "Quelle qualité as-tu découverte ou acceptée chez toi ?", ph: "Exemple : ma douceur. Je pensais que c’était une faiblesse, je vois maintenant que c’est une force." },
    { k: 'fin-intention', q: "Quelle est ton intention pour mars ?", ph: "Exemple : continuer mon café du matin, et oser dire ce que je pense au moins une fois par semaine.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Le couple et les schémas amoureux',
    texte: "Pendant que ton carnet t’aide à t’aimer d’abord, ton suivi t’invite à regarder les couples de ta lignée et ce qui se répète dans ta façon d’aimer. Plus tu te traites avec tendresse ici, plus tu peux choisir là-bas l’amour qui te ressemble."
  },

  aVenir: [
    { mois: 'Mars', titre: 'Ma voix, ma confiance', texte: "Oser prendre la parole, t’affirmer avec douceur, et faire grandir ta confiance en toi.", image: 'assets/cartes/demander-mini.jpg' },
    { mois: 'Avril', titre: 'Dire vrai', texte: "Exprimer ce que tu ressens vraiment, avec des mots justes et bienveillants.", image: 'assets/cartes/une-relation-vraie-mini.jpg' },
    { mois: 'Mai', titre: 'Prendre soin de moi', texte: "Faire de ton quotidien un allié : rythme, repos, plaisirs simples et énergie retrouvée.", image: 'assets/cartes/se-retrouver-mini.jpg' }
  ]
};
