/* Genesolia · Cycle 2 · Le carnet du module 8 de la formation « Sors de la boucle » : « Ta montagne »
   Reprend les exercices du cahier PDF du module 8 (assets/formation/cahier-module-8.pdf), en version à remplir.
   Même livre que le module 1 (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 8,
  cle: 'module-8',
  page: 'mon-module.html',
  pdf: 'assets/formation/cahier-module-8.pdf',
  titre: 'Ta montagne',
  objectifs: { principal: "Relier tout le chemin parcouru et faire durer le changement.", specifique: "Mesurer ton évolution, rassembler ta boîte à outils et écrire ta lettre d'intention pour la suite." },
  sousTitre: "Relier tout le chemin parcouru, et poser ton intention pour la suite.",
  citation: "Tu n'as pas à atteindre le sommet. Seulement à continuer de monter, un pas après l'autre.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/spirale.jpg',
    pages: {
      ouverture: 'assets/guide/guide-spirale-or.webp',
      comprendre: 'assets/guide/guide-etoiles.webp',
      exercices: 'assets/guide/guide-livre-lumineux.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-cadeau.webp'
    }
  },

  mots: {
    ouverture: "Avant de commencer, prends un instant pour mesurer le chemin parcouru depuis le premier module.",
    comprendre: "Ce travail continue toute la vie, et c'est une bonne nouvelle : chaque situation qui revient, tu la regardes d'un peu plus haut.",
    exercices: "Ces exercices sont la trace de ta montagne : garde-les, tu pourras y revenir aussi souvent que tu le veux.",
    outil: "Ton mental reviendra, c'est son rôle. Tu restes libre de le suivre ou de choisir ailleurs.",
    avancer: "Ta lettre d'intention est ta boussole. Relis-la chaque mois.",
    bilan: "Merci d'avoir fait ce chemin jusqu'au bout. C'est le premier tour d'une spirale qui monte, pour toi, et pour celles et ceux qui viendront après toi."
  },

  ouverture: {
    intro: "Le dernier module : tu rassembles tes outils, tu situes tes six paliers, tu écris ta lettre d'intention et tu prépares la suite. Commence par regarder la vidéo du module dans ton espace de formation, puis reviens ici pour pratiquer.",
    intensiteQ: "À quel point ta boucle principale pèse-t-elle aujourd'hui, comparée au tout début ?",
    souhaitQ: "Qu'est-ce que tu veux ancrer pour la suite, maintenant que la formation se termine ?",
    souhaitPh: "Exemple : garder mes rituels, même quand la vie s'accélère.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais avoir ma lettre d'intention et un plan simple pour continuer seule.",
    phrasePh: "Exemple : je continue de monter, un pas après l'autre."
  },

  comprendre: {
    titre: 'Mesure le chemin',
    chapeau: "Au début, ta boucle tournait toute seule. Aujourd'hui, tu sais la reconnaître, tu sais d'où elle vient, ce qui la fait tenir, et tu as des outils pour l'arrêter, la désamorcer et la remplacer.",
    texte: [
      "**Ta montagne intérieure.** Chaque pas est un mouvement vers le haut. Parfois la pente semble raide, le sommet très loin. Mais la montagne est ancrée dans la terre : elle te porte, et chaque pas compte vraiment.",
      "**Les six paliers.** Ma place : ai-je le droit d'être là ? Mon élan : ai-je le droit de désirer, de créer, de profiter ? Ma force : ai-je le droit de m'affirmer, de dire « je veux » et « non » ? Mon cœur : puis-je aimer en restant moi ? Ma voix : puis-je dire ma vérité ? Ma vision : où est-ce que je vais ? Ta boucle principale se joue souvent sur l'un d'eux. Quand un palier se libère, toute la montagne s'allège.",
      "**À quoi je donne mon énergie ?** Nos ancêtres ont souvent donné toute la leur à la survie et à la peur du lendemain. Une partie de nous continue par habitude : on ressasse, on s'inquiète, et on nourrit les mêmes peurs. Toi, tu peux choisir. Tu es celle qui observe tes pensées, et qui choisit."
    ],
    signesTitre: 'Les neuf étapes de la traversée',
    signes: [
      "**L'émergence** · une prise de conscience arrive. **L'exploration** de tes racines.",
      "**La confrontation** avec tes contradictions. **L'épreuve**, quand la vie te remet face à l'ancien schéma.",
      "**Le lâcher-prise** d'une ancienne façon d'être. **La transformation**, quand de nouveaux repères apparaissent.",
      "**Le rayonnement**, quand tu prends ta place. **La transmission**, quand ce que tu as traversé inspire autour de toi.",
      "**La renaissance.** Connaître ces étapes t'aide à savoir que tu passes d'une étape à l'autre, même quand tu te sens perdue."
    ],
    exemplesTitre: 'Ta boîte à outils',
    exemples: [
      "**Module 1** · la main suspendue, et les trois questions.",
      "**Module 2** · « À qui ça appartient ? »",
      "**Module 3** · attraper la phrase.",
      "**Module 4** · la lettre express de cinq minutes.",
      "**Module 5** · le protocole, et sa version de poche.",
      "**Module 6** · le réflexe de la couche profonde, et le geste sous quarante-huit heures.",
      "**Module 7** · le petit acte de celle que tu deviens.",
      "**Module 8** · baisser le volume du haut-parleur."
    ],
    retenir: [
      "Tu sais reconnaître ta boucle, la comprendre, l'arrêter et la remplacer.",
      "Tes six paliers montrent où porter ton attention, et se notent à nouveau tous les trois mois.",
      "Ta lettre d'intention est une parole que tu te donnes : tu la gardes, et tu la relis chaque mois.",
      "Ton dernier outil, pour le mental qui tourne en boucle : baisser le volume du haut-parleur."
    ],
    question: { k: 'comp-chemin', q: "En regardant ta boîte à outils, lequel a le plus changé ta vie, et comment ?", ph: "Exemple : « À qui ça appartient ? ». Je ne panique plus devant une facture : je sais que c'est la peur de ma grand-mère." }
  },

  exercicesIntro: "Les exercices de ton cahier, à remplir ici. Relis tes carnets des modules précédents si tu en as besoin : ils sont la matière de ta lettre d'intention.",
  exercices: [
    { k: 'm8ex1', type: 'tableau', titre: 'Ma boîte à outils',
      consigne: "Pour chaque module, note l'outil qui t'a le plus servi, dans quelle situation tu l'utilises, et ce qu'il a changé pour toi. Cette page résume ta formation : garde-la.",
      rangs: 7,
      etiquettes: ['1 · Boucle et spirale', '2 · La source', '3 · Programmes', '4 · Ce qui pèse', '5 · Clé 1', '6 · Clé 2', '7 · Clé 3'],
      colonnes: [
        { q: 'Mon outil', ph: ['Exemple : la main suspendue', 'Exemple : « À qui ça appartient ? »', 'Exemple : attraper la phrase', 'Exemple : la lettre express', 'Exemple : la version de poche', 'Exemple : le geste sous 48 heures', 'Exemple : le petit acte de celle que je deviens'] },
        { q: 'Quand je l’utilise', ph: ['Exemple : quand je sens la vieille réaction monter', 'Exemple : quand la panique d’argent arrive', 'Exemple : avant de dire oui à tout', 'Exemple : quand ça s’emballe le soir', 'Exemple : en réunion, quand on me critique', 'Exemple : quand une vieille peur revient', 'Exemple : chaque matin'] },
        { q: 'Ce qu’il a changé', ph: ['Exemple : un petit espace avant de réagir', 'Exemple : je respire et je paie, sans paniquer', 'Exemple : j’ose demander', 'Exemple : je passe à l’action le jour même', 'Exemple : je ne me justifie plus', 'Exemple : je ne me décourage plus', 'Exemple : je me sens plus vivante'] }
      ] },
    { k: 'm8ex2', type: 'tableau', titre: 'Mes six paliers',
      consigne: "Donne-toi une note de 1 à 10 pour chaque palier, selon ta solidité aujourd'hui. Puis note ce qui le fragilise, et un tout petit pas pour le renforcer. Tu referas cette page dans trois mois.",
      rangs: 6,
      etiquettes: ['Ma place', 'Mon élan', 'Ma force', 'Mon cœur', 'Ma voix', 'Ma vision'],
      colonnes: [
        { q: 'Ma note sur 10', ph: 'Exemple : 6' },
        { q: 'Ce qui le fragilise', ph: 'Exemple : je m’excuse encore d’exister en réunion' },
        { q: 'Un petit pas pour le renforcer', ph: 'Exemple : prendre la parole une fois par réunion' }
      ],
      apres: { k: 'm8ex2-date', q: 'La date de cette notation', ph: 'Exemple : le 14 mars. Je la refais le 14 juin.', court: true } },
    { k: 'm8ex3', type: 'tableau', titre: 'Ma traversée',
      consigne: "Pour chaque étape, note ce qu'elle fait émerger en toi (souvenirs, émotions, résistances), et l'intention que tu veux poser. Ce sera la matière de ta lettre.",
      rangs: 9,
      etiquettes: ['1 · Émergence', '2 · Exploration', '3 · Confrontation', '4 · Épreuve', '5 · Lâcher-prise', '6 · Transformation', '7 · Rayonnement', '8 · Transmission', '9 · Renaissance'],
      colonnes: [
        { q: 'Ce qu’elle fait émerger en moi', ph: ['Exemple : le jour où j’ai vu ma boucle pour la première fois', 'Exemple : l’histoire de ma grand-mère', 'Exemple : je dis vouloir de l’aide et je refuse tout', 'Exemple : le courrier de l’administration', 'Exemple : dire au revoir à la sauveuse', 'Exemple : je demande, et on m’aide', 'Exemple : je parle en réunion', 'Exemple : ma fille me regarde faire autrement', 'Exemple : une légèreté nouvelle'] },
        { q: 'Mon intention', ph: ['Exemple : rester attentive aux signaux', 'Exemple : honorer ma lignée', 'Exemple : aligner ce que je dis et ce que je fais', 'Exemple : voir chaque épreuve comme un étage', 'Exemple : laisser partir ce qui est fini', 'Exemple : accueillir le neuf', 'Exemple : prendre ma place', 'Exemple : montrer un autre chemin', 'Exemple : vivre à ma façon'] }
      ] },
    { k: 'm8ex4', type: 'questions', titre: 'Ma lettre d’intention',
      consigne: "Écris ta lettre à partir de l'exercice 3. Commence et termine par une phrase qui t'engage, au présent. Celle-ci, tu ne la brûles pas : tu la gardes, et tu la relis chaque mois.",
      questions: [
        { k: 'm8ex4-lettre', q: 'Ma lettre, qui commence par « Aujourd’hui, je choisis… »', ph: 'Exemple : « Aujourd’hui, je choisis de traverser mon chemin en conscience. Je me transforme pour être vivante… »', lignes: 12 },
        { k: 'm8ex4-signee', q: 'Signée le', ph: 'Exemple : le 14 mars', court: true }
      ] },
    { k: 'm8ex6', type: 'questions', titre: 'Mon plan pour la suite',
      consigne: "Pour que ça dure : chaque jour, un petit acte de celle que tu deviens. Chaque semaine, dix minutes pour relire ton carnet. Chaque mois, ta lettre d'intention. Tous les trois mois, tes six paliers.",
      astuce: "Note dès maintenant tes deux dates dans ton agenda ou ton téléphone, avec un rappel.",
      questions: [
        { k: 'm8ex6-jour', q: 'Mon rituel de chaque jour', ph: 'Exemple : un petit acte de celle que je deviens, et la version de poche dès qu’une alarme sonne.' },
        { k: 'm8ex6-semaine', q: 'Mon rituel de chaque semaine (jour, heure, ce que je fais)', ph: 'Exemple : le dimanche à 18 h, je relis mon carnet et j’écoute mon audio du mois.' },
        { k: 'm8ex6-signes', q: 'Les signes qui me diront qu’il est temps de reprendre un module', ph: 'Exemple : je recommence à tout porter seule, je dors mal.' },
        { k: 'm8ex6-appui', q: 'La personne sur qui je peux m’appuyer quand c’est difficile', ph: 'Exemple : ma sœur.', court: true },
        { k: 'm8ex6-lettre', q: 'La date à laquelle je relis ma lettre d’intention', ph: 'Exemple : le 14 de chaque mois.', court: true },
        { k: 'm8ex6-paliers', q: 'La date à laquelle je refais la notation de mes paliers', ph: 'Exemple : le 14 juin.', court: true }
      ] }
  ],

  outil: {
    titre: 'Baisser le volume du haut-parleur',
    intro: "Ton dernier outil, quand le mental tourne en boucle comme une annonce qui passe depuis le réveil. Le but : baisser le volume, et te rappeler que ce qu'il dit est le reflet de ton histoire.",
    etapes: [
      "**Stop.** Une respiration : « Là, maintenant, ce qui compte, c'est où je mets mon attention. »",
      "**Vide.** Écris toutes les pensées qui tournent, sans tri.",
      "**Questionne.** Quel programme suis-je en train de jouer ? Quel avenir suis-je en train de me fabriquer ? Quelle émotion suis-je en train de nourrir ?",
      "**Positionne-toi** par une phrase de choix : « Je choisis de m'occuper de ce qui dépend de moi. »",
      "**Recentre.** Donne ton attention, pendant dix minutes, à une seule chose qui te fait du bien ou te fait avancer."
    ],
    note: { k: 'outil-note', q: "Après ton premier essai, note le thème des pensées, ta phrase de choix, et où tu as mis ton attention.", ph: "Exemple : la réunion de demain · « je choisis de préparer ce qui dépend de moi » · dix minutes de préparation, puis une tisane." }
  },

  jours: {
    titre: 'Mon carnet du haut-parleur',
    consigne: "Chaque fois que ton mental tourne en boucle, applique l'outil, puis note le soir : le thème des pensées, le programme que tu jouais, ta phrase de choix, et où tu as mis ton attention.",
    ph: "Exemple : réveil à 5 h, je ressasse la réunion de demain · programme : « si je me trompe, je ne vaux rien » · « Je choisis de préparer ce qui dépend de moi » · dix minutes de préparation, puis je me suis rendormie.",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : qu'est-ce qui a changé, même un tout petit peu ?", ph: "Exemple : mes nuits sont plus calmes, je reconnais le haut-parleur plus vite." }
  },

  avancer: {
    intro: "La formation se termine, ton chemin continue. Cette page t'aide à voir où il te mène.",
    lieQ: "Dans un an, en relisant ta lettre d'intention, qu'aimerais-tu constater dans ta vie ?",
    liePh: "Exemple : je vis entourée, je prends ma place au travail, et ma boucle n'est plus qu'un souvenir que je reconnais de loin."
  },

  allerPlusLoin: [
    { titre: 'Ton suivi « Je me libère »', texte: "Le suivi de ton étape prolonge ce module dans ta lignée : repérer ce qui se rejoue, le rendre avec un rituel, et l'intégrer dans ta vie.", lien: 'mon-suivi-mois.html' },
    { titre: 'Ton carnet « J’avance »', texte: "Le carnet de ton étape t'aide à construire ce que tu veux vivre, pas à pas, avec ton audio du mois.", lien: 'mon-carnet.html' }
  ],

  bilan: [
    { k: 'bilan-debut', q: 'Qui j’étais au début de la formation, face à ma boucle', ph: 'Exemple : quelqu’un qui disait oui à tout et ruminait chaque soir.' },
    { k: 'bilan-aujourdhui', q: 'Qui je suis aujourd’hui', ph: 'Exemple : quelqu’un qui respire avant de répondre, et qui ose demander.' },
    { k: 'bilan-fiere', q: 'Ce dont je suis le plus fière', ph: 'Exemple : avoir écrit ma lettre à ma mère, et être restée proche d’elle.' },
    { k: 'bilan-transmets', q: 'Ce que je transmets désormais, à moi et à ceux qui viennent après moi', ph: 'Exemple : le droit de se reposer, et le courage de ma grand-mère.' },
    { k: 'bilan-toujours', q: 'La phrase que je garde pour toujours', ph: 'Exemple : « Ce qui revient est une invitation à regarder. »' }
  ]
};
