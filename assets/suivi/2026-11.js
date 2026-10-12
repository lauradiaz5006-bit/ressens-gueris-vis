/* Genesolia · Le Cercle · Mon suivi « Je me libère » de novembre 2026 : « Qu’est-ce que j’ai reçu ? »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2026-11',
  cle: 'suivi-2026-11',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2026-11-474ce578d0.pdf',
  nomMois: 'novembre 2026',
  moisSuivant: 'décembre',
  titre: "Qu’est-ce que j’ai reçu ?",
  sousTitre: "Racines de ton arbre de vie · Reconnaître ce que ta lignée t’a transmis, les dons comme les poids, garder les dons et rendre un poids avec respect.",
  citation: "Ce que j’ai reçu de beau, je le garde et je le fais vivre.",
  audio: '',
  audioCourt: '',
  saisonLien: "Novembre est le mois du silence qui prépare. Sous la terre nue, les racines gardent les réserves de l’arbre pour tout l’hiver. C’est le bon moment pour faire, toi aussi, l’inventaire de tes réserves : ce que ta lignée t’a confié de précieux, et ce que tu portes encore pour elle. Tu avances doucement, une bougie à la main, à l’écoute de ce qui remonte.",
  intensiteQ: "À quel point ce que tu portes de ta lignée pèse-t-il sur ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette habitude de tout porter seul·e, comme ma grand-mère, alors que je voudrais garder surtout son courage.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-transmission.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-arbre.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ils-ont-traverse-mini.jpg', 'Ils ont traversé tant de choses pour que je puisse vivre la mienne.']
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Novembre t’invite à écouter, à ton rythme.",
    theme: "Lis cette page comme une lettre. Si un don ou un prénom te vient en lisant, note-le quelque part : il compte.",
    voir: "Cette semaine, tu fais l’inventaire des dons. Un geste, une recette, une phrase douce : chaque petite chose a sa place.",
    source: "Cette semaine, tu regardes aussi les poids, avec curiosité. Range chaque information dans son tiroir, et garde tes conclusions ouvertes.",
    liberer: "Tu remercies, puis tu rends. Si une émotion monte, fais une pause : tu pourras reprendre un autre jour.",
    remplacer: "Porter la force et laisser le poids. Un petit geste chaque jour suffit pour faire vivre un don reçu.",
    meditation: "Un soir tranquille, une couverture, une boisson chaude. Si une émotion monte, reviens à ton souffle et à tes pieds sur le sol.",
    bilan: "Prends ce moment, même si une partie reste à faire. Chaque don reconnu ce mois-ci a trouvé sa place sur ton arbre."
  },

  theme: {
    titre: "Ce que ta lignée t’a transmis",
    texte: [
      "Novembre est le mois où l’on pense à celles et ceux qui sont venus avant nous. Les jours raccourcissent, beaucoup de familles allument une bougie et se souviennent. C’est un beau moment pour te poser une question simple : qu’est-ce que j’ai reçu ? Ta lignée t’a transmis la vie, et avec elle des talents, des gestes, des recettes, des valeurs. Elle t’a peut-être aussi confié des peurs, des habitudes ou des phrases plus lourdes à porter.",
      "Cette année, ton suivi suit le fil de **ton arbre de vie** : de la peur héritée à la vie choisie. En automne, tu poses les **racines** : en octobre, les prénoms de ta lignée ; ce mois-ci, les dons que tu as reçus ; en décembre, ta juste place. Tu regardes ton héritage avec tendresse et lucidité, pour garder le meilleur et choisir ce que tu fais du reste."
    ],
    sousTitre: "Les dons et les poids",
    texte2: [
      "En psychogénéalogie, on parle souvent d’un double héritage. L’héritage visible se voit et se raconte : un savoir-faire, une recette, un objet, une façon de recevoir les amis, un goût pour la musique ou le jardin. L’héritage invisible se sent plus qu’il se dit : une peur de manquer, une habitude de tout porter, une phrase qui revient, une loyauté discrète envers quelqu’un d’avant.",
      "Les deux arrivent souvent ensemble. La grand-mère qui t’a transmis son courage t’a peut-être aussi transmis sa façon de serrer les dents. Le père qui t’a appris à bien travailler t’a peut-être aussi appris à t’oublier. Reconnaître un poids reste une piste, une hypothèse à regarder avec douceur : tu gardes ce qui te parle. Pour aller plus loin : [ce que tu portes commence parfois avant toi](heriter.html).",
      "Ce mois-ci, tu vas **voir** les dons de ta lignée, **comprendre** d’où viennent tes poids en rangeant chaque information dans son tiroir, **rendre** symboliquement un poids avec ton protocole du mois, et **faire vivre** un don reçu, chaque jour, dans ta vie."
    ],
    exemplesTitre: "Les dons et les poids, au quotidien",
    exemples: [
      "**Dans la cuisine** : tu fais la tarte aux pommes de ta grand-mère les yeux fermés. Avec elle, tu as aussi reçu l’habitude de finir chaque assiette, même quand tu as assez mangé.",
      "**Au travail** : tu es fiable et endurant·e, comme ton père. Comme lui, tu restes tard le soir et tu gardes tes soucis pour toi.",
      "**Dans tes mains** : tu couds, tu bricoles, tu jardines avec plaisir. Un jour, tu réalises que ce savoir vient d’une arrière-grand-tante dont on parle peu.",
      "**Dans tes phrases** : tu dis « on verra bien » avec le sourire, comme ta mère. Tu dis aussi « il faut se méfier », comme elle, et tu te sens parfois freiné·e.",
      "**Dans tes réserves** : tu gardes toujours de l’argent de côté « au cas où », comme tes grands-parents qui ont connu les restrictions."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Ton amie te propose son aide pour ton déménagement. La boucle aurait répondu « je vais me débrouiller », comme ta grand-mère qui portait tout seule. La spirale respire, garde le courage de ta grand-mère, et répond : « Oui, avec plaisir, viens samedi. » Le don reste, le poids s’allège.",
    question: { k: 'theme-recu-nov', q: "Quand tu te demandes « qu’est-ce que j’ai reçu ? », quel don te vient en premier, et de qui te vient-il ?", ph: "Exemple : le goût de recevoir, de ma grand-mère Jeanne. Chez elle, il y avait toujours une assiette de plus pour qui passait." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "Les dons de ta lignée",
      intro: "Cette semaine, tu poses sur la table ce que ta lignée t’a donné de bon. Tu explores, tu listes, tu remarques ce que ça te fait. Les poids viendront la semaine prochaine : pour l’instant, tu remplis tes réserves.",
      texte: "Commence par l’inventaire des dons, au calme, une vingtaine de minutes, avec des photos ou des objets de famille si tu en as. Puis, pendant la semaine, remarque chaque fois que tu utilises un don reçu.",
      exercices: [
        { k: 'dons-nov', titre: "L’inventaire des dons", type: 'tableau', rangs: 4,
          etiquettes: ["Un talent ou un savoir-faire", "Un objet ou une recette", "Une phrase douce ou une valeur", "Un courage ou une façon de tenir"],
          consigne: "Pour chaque ligne, note un don que tu as reçu de ta lignée, la personne qui te l’a transmis, et la façon dont il vit en toi aujourd’hui. Si tu connais peu ta famille, pars de ce que tu as reçu des adultes qui t’ont élevé·e, ou de ce que tu sais d’une époque, d’un métier, d’un lieu.",
          pourquoi: "Avant de regarder ce qui pèse, on reconnaît ce qui porte. Faire l’inventaire des dons te donne des appuis solides pour la suite du mois, et beaucoup de personnes découvrent qu’elles ont reçu bien plus qu’elles le pensaient.",
          colonnes: [
            { q: "Quel est ce don ?", ph: ["Exemple : coudre, réparer, faire durer les choses", "Exemple : le carnet de recettes de ma grand-mère", "Exemple : « Chez nous, on accueille tout le monde »", "Exemple : se relever après chaque coup dur"] },
            { q: "Qui te l’a transmis ?", ph: ["Exemple : ma grand-mère maternelle, couturière", "Exemple : mamie Jeanne, par ma mère", "Exemple : mon grand-père, qui ouvrait sa porte à tous", "Exemple : mon arrière-grand-père, venu d’Italie"] },
            { q: "Comment vit-il en toi aujourd’hui ?", ph: ["Exemple : je répare les vêtements de toute la famille", "Exemple : je le ressors à chaque fête", "Exemple : ma maison est pleine d’amis le dimanche", "Exemple : je recommence, quoi qu’il arrive"] }
          ],
          apres: { k: 'dons-nov-commun', q: "Relis ton inventaire. Qu’est-ce que ces dons ont en commun, même un détail : une personne, un côté de la famille, une façon d’aimer ?", ph: "Exemple : presque tout vient des femmes du côté de ma mère, et tout parle d’accueillir et de nourrir les autres." } },
        { k: 'voir-journal-nov', titre: "Mon journal des dons", type: 'texte',
          consigne: "Cette semaine, remarque chaque fois que tu utilises un don reçu : un geste, une expression, une recette, une façon de faire. Note-le le jour même, en quelques mots, avec la personne qui te l’a transmis. Vise au moins trois moments.",
          pourquoi: "Les dons de ta lignée se cachent souvent dans les gestes les plus ordinaires. Les remarquer au moment où ils se manifestent, c’est commencer à les recevoir en conscience.",
          q: "Ce que tu remarques, en général, sur les dons que tu utilises",
          ph: "Exemple : je chante en cuisinant, comme ma mère, et je me sens tout de suite mieux.",
          journal: { k: 'voir-sit-nov', n: 6, etiquette: 'Moment', q: "Chaque moment : le jour, le don utilisé, la personne qui te l’a transmis, ce que tu as ressenti", ph: "Exemple : mardi, j’ai réparé la chaise avec les gestes de mon grand-père. Je me suis senti·e fier·e et relié·e." } }
      ],
      conseil: "Un don peut être tout petit : une façon de plier le linge, un mot doux, une chanson. Si tu connais peu ta famille, les dons reçus d’autres adultes comptent aussi. Si une émotion monte, pose ton stylo, respire, et reviens-y demain : la liste peut se remplir au fil du mois." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "Les poids et leurs histoires",
      intro: "Cette semaine, tu regardes aussi ce qui pèse : une peur, une habitude, une phrase dure. Tu remontes doucement le fil, tu écoutes les récits, et tu ranges chaque information dans son tiroir. Tu gardes tes conclusions ouvertes.",
      texte: [
        "Pour chaque information sur ta lignée, demande-toi dans quel tiroir elle va. **Ce que je sais** : un fait, une date, un métier, un lieu. **Ce qu’on m’a raconté** : un récit, avec les mots et le regard de la personne qui raconte. **Ce que je suppose** : une piste, une ressemblance, une intuition. Les trois tiroirs ont de la valeur, et chacun garde sa place.",
        "Un poids familial se range souvent dans le troisième tiroir : « je suppose que ma peur de manquer vient de mes grands-parents ». C’est une piste précieuse, à garder comme une hypothèse. Tu en gardes ce qui t’aide à mieux vivre aujourd’hui, et tu laisses le reste ouvert. Le protocole de la semaine prochaine t’invitera à rendre un seul poids : cette semaine, tu prépares ton choix."
      ],
      exercices: [
        { k: 'poids-nov', titre: "Mes poids, tiroir par tiroir", type: 'questions',
          consigne: "Prends ces questions une par une, avec ton inventaire des dons à côté de toi. Si une réponse tarde, passe à la suivante : elle viendra peut-être dans la semaine, au détour d’une conversation.",
          pourquoi: "Ranger un poids dans son tiroir change souvent la façon de le porter. Ce qui semblait être « mon caractère » devient une histoire que tu peux regarder, comprendre, et choisir de rendre.",
          choix: { k: 'tiroir-nov', q: "Le poids qui te parle le plus en ce moment va surtout dans le tiroir…", options: ['Ce que je sais : un fait', 'Ce qu’on m’a raconté : un récit', 'Ce que je suppose : une piste', 'Un peu des trois'] },
          questions: [
            { k: 'poids-nov-liste', q: "Quels poids sens-tu en toi : une peur, une habitude, une phrase dure, une répétition ?", ph: "Exemple : la peur de manquer, l’habitude de tout porter seule, la phrase « serre les dents »." },
            { k: 'poids-nov-qui', q: "Pour chacun, qui le portait peut-être avant toi ?", ph: "Exemple : ma grand-mère, qui a élevé cinq enfants seule après la guerre." },
            { k: 'poids-nov-sait', q: "Pour le poids principal, qu’est-ce que tu sais vraiment : les faits, les dates, les lieux ?", ph: "Exemple : mon grand-père est né en 1938, sa famille a quitté la ferme en 1952." },
            { k: 'poids-nov-recit', q: "Qu’est-ce qu’on t’a raconté à son sujet, et qui te l’a raconté ?", ph: "Exemple : ma mère dit qu’à la maison, on gardait chaque morceau de pain « au cas où »." },
            { k: 'poids-nov-piste', q: "Qu’est-ce que tu supposes, comme une piste à garder ouverte ?", ph: "Exemple : peut-être que ma façon de tout compter vient de ces années difficiles." },
            { k: 'poids-nov-choix', q: "Quel poids choisis-tu de rendre ce mois-ci, avec ton protocole ?", ph: "Exemple : l’habitude de tout porter seule. Je garde le courage, je rends la solitude." }
          ] },
        { k: 'source-question', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur un don ou un poids de ta lignée. Par téléphone, à table ou par message. Commence par un souvenir heureux pour ouvrir la porte, puis note la réponse et range-la dans son tiroir. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma tante : « Qui t’a appris à coudre, et comment c’était ? »", court: true },
            { k: 'source-reponse-nov', q: "Qu’as-tu appris, et dans quel tiroir le ranges-tu ?", ph: "Exemple : c’était son arrière-grand-mère, couturière dans un atelier à Lyon. C’est un récit, et il me donne envie de chercher des faits.", lignes: 3 }
          ] }
      ],
      conseil: "Ajoute dans [ton arbre familial](genosociogramme.html) les dons et les métiers que tu retrouves, même avec très peu d’informations. Si une question réveille une peine chez la personne que tu interroges, remercie-la avec douceur et laisse la porte ouverte pour un autre jour." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "Rendre un poids, honorer ta lignée",
      intro: "Cette semaine, tu vis ton protocole du mois. Tu reconnais d’abord les dons que tu gardes, puis tu écris ta lettre, tu rends symboliquement le poids choisi, et tu honores ta lignée pour la vie transmise.",
      exercices: [
        { k: 'garde-nov', titre: "Ce que je garde, ce que je rends", type: 'blocs', nb: 3,
          etiquettes: ['Une première personne', 'Une deuxième personne', 'Une troisième personne'],
          consigne: "Choisis trois personnes de ta lignée, connues ou devinées. Pour chacune, écris le don que tu gardes avec gratitude, puis le poids que tu choisis de lui laisser. Cet exercice prépare ta lettre : il t’aide à rendre en gardant le lien.",
          pourquoi: "On rend plus facilement un poids quand on a d’abord reconnu le don qui l’accompagne. Tu gardes l’amour et la force, tu laisses à chacun·e son histoire.",
          astuce: "Si tu sais peu de choses d’une personne, pars de ce qu’elle a forcément traversé : une époque, un métier, un départ. Quelle force lui a-t-il fallu ?",
          champs: [
            { q: "Quelle personne choisis-tu ?", ph: ["Exemple : ma grand-mère Jeanne", "Exemple : mon arrière-grand-père, mineur dans le Nord", "Exemple : l’aïeule italienne dont je porte le nom"] },
            { q: "Quel don gardes-tu d’elle ou de lui ?", ph: ["Exemple : son courage et son rire", "Exemple : l’endurance et la solidarité", "Exemple : l’audace de partir et de tout recommencer"] },
            { q: "Quel poids lui laisses-tu, avec respect ?", ph: ["Exemple : l’habitude de tout porter seule", "Exemple : l’idée qu’il faut s’épuiser pour mériter", "Exemple : la peur de perdre ce que j’ai construit"] }
          ] },
        { k: 'lettre-nov', titre: "Avant ta lettre", type: 'questions',
          consigne: "Ton protocole t’invite à écrire une lettre en trois parties, puis à la brûler ou à la déchirer. Tu peux la préparer ici, en quelques lignes, et l’écrire ensuite à la main sur une feuille. Tu choisis à qui tu écris : une personne précise, ou « celles et ceux d’avant moi ».",
          pourquoi: "Écrire à la main, puis confier la feuille au feu ou la déchirer, donne un corps au geste de rendre. Préparer tes mots ici t’aide à arriver au rituel plus serein·e.",
          questions: [
            { k: 'lettre-a-nov', q: "À qui écris-tu ?", ph: "Exemple : à ma grand-mère Jeanne", court: true },
            { k: 'lettre-texte-nov', q: "Tes premiers mots : ce que tu as porté, d’où ça vient peut-être, ce que tu rends et ce que tu gardes", ph: "Exemple : Mamie, j’ai porté pendant longtemps l’habitude de tout faire seule. Je comprends que cela vient peut-être de tes années difficiles, et tu faisais avec ce que tu avais. Je te rends cette solitude, et je garde ton courage et ton rire.", lignes: 7 }
          ] }
      ],
      rituel: {
        titre: "La table des dons",
        intro: "Ce petit rituel prépare ton protocole. Tu rassembles sur une table quelques traces des dons de ta lignée, pour avoir sous les yeux ce que tu gardes au moment où tu rends un poids. Compte une dizaine de minutes, la veille ou juste avant ton protocole.",
        materiel: "Une bougie, ton inventaire des dons, et trois à cinq objets qui les représentent : une photo, une recette, un outil, un bijou, un tissu, ou simplement un prénom écrit sur un papier.",
        etapes: [
          "Choisis un coin calme et dégage une petite table ou une étagère.",
          "Pose les objets un à un. Pour chacun, dis à voix haute ou intérieurement : « Merci pour ce don. Je le garde. »",
          "Allume la bougie au centre et reste une minute à regarder ta table : ce sont tes réserves, tes racines.",
          "Garde cette table telle quelle pour ton protocole. Au moment de rendre ton poids, regarde-la : les dons restent avec toi.",
          "Après ton protocole, éteins la bougie, en restant près d’elle jusqu’au bout, et note ce qui est venu ci-dessous."
        ],
        note: { k: 'rituel-note-nov', q: "Quels objets as-tu posés, et qu’as-tu ressenti en regardant ta table, avant et après ton protocole ?", ph: "Exemple : la recette de mamie, le marteau de papi, une photo de mon arrière-grand-mère. Après le feu, j’ai regardé la table et je me suis senti·e riche de tout ça." }
      },
      conseil: "Le feu est une possibilité parmi d’autres : déchirer la lettre, l’enterrer ou la garder dans une enveloppe sont des gestes tout aussi forts. Si une émotion monte, fais une pause, bois un verre d’eau, sors marcher. Tu peux vivre le protocole en deux fois." },

    { cle: 'remplacer', nom: 'Recevoir', etape: 'Remplacer', titre: "Faire vivre un don reçu",
      intro: "Tu as vu tes dons, compris tes poids, rendu celui que tu avais choisi. Cette semaine, tu intègres : tu poses tes feuilles dorées sur ton arbre de vie, et tu fais vivre un don reçu, exprès, chaque jour.",
      texte: [
        "**La première pause.** Quand un vieux poids se présente (tout porter, tout compter, serrer les dents), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Tu appartiens à leur histoire. Moi, je choisis le don qu’ils m’ont confié. »",
        "**Le geste qui honore.** Faire vivre un don reçu, c’est la plus belle façon d’honorer ta lignée. Un petit geste suffit : une recette refaite, un courage osé, un savoir-faire transmis à ton tour. Le don circule de nouveau, et le poids s’allège."
      ],
      exercices: [
        { k: 'ex3-nov', titre: "Le don que je fais vivre", type: 'texte',
          consigne: "Choisis un don de ton inventaire et fais-le vivre en conscience cette semaine. Écris ton engagement, puis note chaque fois que tu l’as fait, même maladroitement, et ce que tu as ressenti. Ce don devient aussi un appui dans ton carnet « J’avance ».",
          pourquoi: "Ce que l’on reçoit en conscience devient un choix. Chaque fois que tu fais vivre un don de ta lignée, ta feuille dorée prend racine dans ta vie de tous les jours.",
          gestes: ["Cuisiner une recette de famille et raconter son histoire", "Oser une chose courageuse, comme cette personne l’aurait fait", "Transmettre un savoir-faire à un proche", "Reprendre un geste hérité : coudre, jardiner, bricoler", "Accepter une aide, là où l’ancêtre portait tout seul·e", "Rire de bon cœur, comme ton grand-père savait le faire"],
          q: "Ton geste : « Cette semaine, pour faire vivre le don de…, je vais… »",
          ph: "Exemple : pour faire vivre le goût de recevoir de ma grand-mère Jeanne, je vais inviter mes voisins dimanche, simplement, avec sa tarte aux pommes.",
          journal: { k: 'ex3-essais-nov', n: 6, q: "Chaque fois que tu as fait vivre ce don : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : jeudi, j’ai appris à ma fille à recoudre un bouton, comme mamie. Je me suis senti·e relié·e et joyeux·se." } }
      ],
      conseil: "Si un vieux poids revient, remarque-le, remercie-le, et rappelle-toi le don que tu as choisi : chaque retour est une occasion de le reconnaître un peu plus tôt. Pense à poser sur ton arbre de vie une feuille dorée pour chaque don reçu." }
  ],

  meditation: {
    titre: 'Le chemin des ancêtres',
    intro: "Une séance guidée pour sentir derrière toi la longue file de celles et ceux qui sont venus avant toi, recevoir leurs dons, et déposer le poids que tu as choisi de rendre ce mois-ci.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois… Laisse ton corps se poser.",
      "[pause]",
      "Imagine que tu marches sur un chemin, dans la lumière douce d'une fin d'après-midi de novembre. Le sol est ferme sous tes pieds. L'air est calme, un peu frais. Derrière toi, tu sens une présence bienveillante.",
      "Tu te retournes. Derrière toi se tiennent tes parents. Derrière eux, tes quatre grands-parents. Derrière eux encore, tes huit arrière-grands-parents… et plus loin, une longue file de silhouettes qui se perd dans la lumière. Des centaines de personnes, dont tu es le prolongement.",
      "[pause]",
      "Tu n'as pas besoin de connaître leurs visages. Sens simplement qu'ils sont là. Chacun·e a vécu des joies, des peines, des épreuves. Chacun·e a transmis la vie, jusqu'à toi. Parmi eux, il y a aussi les oubliés : ceux dont on ne parlait pas. Ils sont là, eux aussi, à leur place.",
      "Peut-être que l'une de ces silhouettes s'avance un peu. Laisse-la venir. Tu n'as rien à faire, seulement l'accueillir. Peut-être qu'elle te tend quelque chose : un objet, une couleur, un mot. Reçois-le.",
      "[longue pause]",
      "Et si tu portes un poids qui ne t'appartient pas, tu peux le déposer doucement à ses pieds, en disant intérieurement : « Je te rends ceci avec respect. Je garde la vie que tu m'as donnée. »",
      "Sens que la file entière te regarde avec bienveillance. Ils sont derrière toi. Ils te soutiennent. Tu peux avancer.",
      "[pause]",
      "Retourne-toi vers le chemin devant toi. Il est ouvert. Fais quelques pas, plus léger·e, avec dans les mains ce que tu as reçu.",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir tranquille, où personne ne te dérangera pendant dix minutes. Si une personne disparue te touche trop fort pendant la séance, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une silhouette, un objet reçu, un mot, une sensation…", ph: "Exemple : une femme en tablier s’est avancée et m’a tendu une clé. J’ai senti mes épaules se relâcher en déposant mon sac." }
  },

  /* Le protocole du mois, cycle 2 « Mon arbre de vie » (version 3) : Explorer, Transformer, Intégrer.
     Affiché en semaine 3 (Libérer), après les exercices. Clé de champ : arbre-note. */
  protocole: {
    titre: "Racines · Qu’est-ce que j’ai reçu ?",
    intro: "**Objectif :** reconnaître ce que ma lignée m’a transmis, les dons comme les poids. **Sous-objectif :** faire mon inventaire, rendre symboliquement un poids, et honorer ma lignée. **Intensité moyenne.** Lettre et feu (1 sur 2).",
    materiel: "Ton carnet, des crayons de couleur, et ton affiche [« Mon arbre de vie »](arbre-de-vie-affiche.html). Le cadre du suivi est dans [le mode d’emploi](mode-emploi-suivi.html). Pour le feu : un récipient en métal ou en terre cuite, posé sur une surface stable, et un verre d’eau à côté, comme l’explique [le mode d’emploi](mode-emploi-suivi.html#feu).",
    etapes: [
      {
        titre: "**Explorer** · 20 min",
        etapes: [
          "**Mon inventaire (15 min).** Deux colonnes. Les dons : talents, gestes, recettes, objets, courage, phrases douces. Les poids : peurs, habitudes, phrases dures, répétitions. Pour chacun : qui me l’a transmis, et dans quel tiroir il va.",
          "**Choisir (5 min).** Le poids que tu choisis de rendre ce mois-ci."
        ]
      },
      {
        titre: "**Transformer** · 45 min",
        etapes: [
          "**Ouvrir (3 min).** Allume la bougie, une main sur le cœur, une sur le ventre : « Je suis ici, dans ma place et dans ma force. Je rends à ma lignée ce qui lui appartient, avec amour. »",
          "**La lettre (20 min).** En trois parties. Ce que j’ai porté : « J’ai porté pendant longtemps… ». D’où ça vient, selon ce que je sais ou suppose : « Je comprends que cela vient peut-être de… », « Tu faisais avec ce que tu avais. » Ce que je rends et ce que je garde : « Je te rends… et je garde ton… ».",
          "**Le feu (7 min).** Lis la lettre à voix haute, puis brûle-la en suivant [la consigne du mode d’emploi](mode-emploi-suivi.html#feu), ou déchire-la.",
          "**Bouger (5 min).** Souffle fort, secoue les mains, puis regarde autour de toi.",
          "**Honorer (10 min).** Imagine ta lignée près de toi. Remercie chacun·e pour la vie transmise. Une lumière dorée descend sur tous. Dis : « Je vous rends votre place avec amour. Je reprends la mienne avec paix. Je marche libre de choisir ma route, soutenu·e par votre lumière et enrichi·e de vos dons. »"
        ]
      },
      {
        titre: "**Intégrer** · 15 min",
        etapes: [
          "**Apaiser (5 min).** Pieds au sol, un grand verre d’eau.",
          "**Clôture commune (3 min).** Lis à voix haute [le texte de fin de rituel et de réunification intérieure](mode-emploi-suivi.html#cloture).",
          "**Sur mon arbre (7 min).** Une feuille dorée pour chaque don reçu."
        ]
      }
    ],
    questions: [
      {
        k: "arbre-note",
        q: "Ce que j’ai posé sur mon arbre ce mois-ci",
        ph: "Exemple : quatre feuilles dorées : le rire de ma grand-mère, la tarte aux pommes, le courage de mon père, le goût des livres."
      }
    ]
  },

  lectures: [
    { lien: 'heriter.html', titre: "Ce que tu portes commence parfois avant toi", resume: "L’héritage visible et l’héritage invisible : ce qui se transmet dans une famille, et comment choisir ce que tu gardes." },
    { lien: 'loyaute-familiale-invisible.html', titre: "La loyauté familiale invisible", resume: "Ces fidélités discrètes envers la lignée : des exemples concrets pour les reconnaître, garder le lien et choisir ta vie." },
    { lien: 'toussaint-ancetres-et-deuils.html', titre: "Honorer tes ancêtres en novembre", resume: "Allumer une bougie, nommer celles et ceux d’avant toi, et remercier pour la vie transmise, en douceur." }
  ],

  lectures: [
    { lien: 'heriter.html', titre: "Ce que tu portes commence parfois avant toi", resume: "L’héritage visible et l’héritage invisible : ce qui se transmet dans une famille, et comment choisir ce que tu gardes." },
    { lien: 'loyaute-familiale-invisible.html', titre: "La loyauté familiale invisible", resume: "Ces fidélités discrètes envers la lignée : des exemples concrets pour les reconnaître, garder le lien et choisir ta vie." },
    { lien: 'toussaint-ancetres-et-deuils.html', titre: "Honorer tes ancêtres en novembre", resume: "Allumer une bougie, nommer celles et ceux d’avant toi, et remercier pour la vie transmise, en douceur." }
  ],

  lectures: [
    { lien: 'heriter.html', titre: "Ce que tu portes commence parfois avant toi", resume: "L’héritage visible et l’héritage invisible : ce qui se transmet dans une famille, et comment choisir ce que tu gardes." },
    { lien: 'loyaute-familiale-invisible.html', titre: "La loyauté familiale invisible", resume: "Ces fidélités discrètes envers la lignée : des exemples concrets pour les reconnaître, garder le lien et choisir ta vie." },
    { lien: 'toussaint-ancetres-et-deuils.html', titre: "Honorer tes ancêtres en novembre", resume: "Allumer une bougie, nommer celles et ceux d’avant toi, et remercier pour la vie transmise, en douceur." }
  ],

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-dons-nov', q: "Quels dons de ta lignée as-tu reconnus ce mois-ci ?", ph: "Exemple : le courage de ma grand-mère, les mains habiles de mon grand-père, le goût de recevoir." },
    { k: 'fin-poids-nov', q: "Quel poids as-tu rendu, et dans quel tiroir l’avais-tu rangé ?", ph: "Exemple : l’habitude de tout porter seule. C’était une piste, et elle m’a beaucoup parlé." },
    { k: 'fin-depuis-nov', q: "Qu’est-ce que tu ressens depuis ton protocole ?", ph: "Exemple : plus de légèreté quand je demande de l’aide, et beaucoup de tendresse pour mamie." },
    { k: 'fin-vivre-nov', q: "Quel don fais-tu vivre désormais, et comment ?", ph: "Exemple : la couture de ma grand-mère. Je répare, je transforme, et j’apprends à ma fille." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en décembre ?", ph: "Exemple : trouver ma juste place pendant les fêtes de famille.", court: true }
  ],

  carnet: {
    titre: 'Mes forces, mes appuis',
    texte: "Ce que tu reçois ici nourrit ce que tu construis là-bas. Dans ton carnet, tu reconnais tes forces et tu rassembles tes appuis : reporte le don de ta lignée que tu fais vivre cette semaine, il devient un appui pour tout ton mois."
  },

  aVenir: [
    { mois: 'Décembre', titre: "Quelle est ma place ?", texte: "Regarder ta place dans la fratrie et dans ta famille, alléger les liens qui pèsent en gardant l’amour, et trouver ta juste place.", image: 'assets/cartes/aimer-et-choisir-mini.jpg' },
    { mois: 'Janvier', titre: "Quelle peur je porte, et pour qui ?", texte: "Repérer tes périodes sensibles et les dates de ta lignée, faire la part des choses, et rendre la part de peur qui appartient à l’histoire familiale.", image: 'assets/cartes/apprendre-mini.jpg' },
    { mois: 'Février', titre: "Quel projet a-t-on posé sur moi ?", texte: "Découvrir l’histoire de ton prénom et les attentes posées sur toi, puis écrire ton propre contrat avec la vie.", image: 'assets/cartes/ecrire-la-mienne-mini.jpg' }
  ]
};
