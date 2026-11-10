/* Genesolia · Cycle 2 · Le carnet du module 2 de la formation « Sors de la boucle » : « Remonter à la source »
   Reprend les exercices du cahier PDF du module 2 (assets/formation/cahier-module-2.pdf), en version à remplir.
   Même livre que le module 1 (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 2,
  cle: 'module-2',
  page: 'mon-module.html',
  pdf: 'assets/formation/cahier-module-2.pdf',
  titre: 'Remonter à la source',
  objectifs: { principal: "Comprendre d'où vient ta boucle.", specifique: "Retrouver ce qui s'est transmis dans ta famille, les âges et les dates qui se répondent (le syndrome d'anniversaire), et te demander « à qui ça appartient ? »." },
  sousTitre: "D'où vient ta boucle, et ce qui s'est peut-être transmis avant toi.",
  citation: "Ce qui reste invisible continue de choisir à ta place. Ce que tu vois, tu peux commencer à le choisir.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    pages: {
      ouverture: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-transmission.webp',
      exercices: 'assets/guide/guide-coffret.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-cadeau.webp'
    }
  },

  mots: {
    ouverture: "Tu n'as pas besoin de connaître toute l'histoire de ta famille. Ce que tu sais déjà suffit pour commencer.",
    comprendre: "Reconnaître une transmission, ce n'est ni accuser, ni se croire condamnée. C'est commencer à choisir.",
    exercices: "Écris ce qui vient en premier. Les approximations et les points d'interrogation ont toute leur place.",
    outil: "Une seule question, au bon moment, suffit souvent à couper l'élan de la boucle.",
    avancer: "Ce que tu rends libère de la place. Cette page t'aide à choisir ce que tu veux y mettre.",
    bilan: "Regarde ce que tu as découvert, avec douceur pour toi et pour celles et ceux qui t'ont précédée."
  },

  ouverture: {
    intro: "Dans ce module, tu remontes le fil de ta boucle pour voir d'où elle vient, et ce qui s'est peut-être transmis dans ta famille. Commence par écouter le podcast du module dans ton espace de formation, puis reviens ici pour pratiquer.",
    intensiteQ: "À quel point ta boucle principale pèse-t-elle dans ta vie aujourd'hui ?",
    souhaitQ: "Quelle peur ou quelle réaction aimerais-tu mieux comprendre grâce à ce module ?",
    souhaitPh: "Exemple : ma panique dès qu'une dépense imprévue arrive, même quand j'ai de quoi payer.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais reconnaître cette peur quand elle monte, et me dire qu'elle n'est pas à moi.",
    phrasePh: "Exemple : ce que je vois, je peux commencer à le choisir."
  },

  comprendre: {
    titre: 'Ce qui se transmet',
    chapeau: "Quand on a repéré sa boucle, une question arrive presque toujours : mais d'où ça vient ? Une partie de la réponse est dans ton histoire à toi. Une autre, souvent plus discrète, se trouve avant toi, dans ta famille.",
    histoire: {
      titre: 'Julie, et sa peur de manquer',
      texte: [
        "Julie a 34 ans et un rapport très tendu à l'argent. Même quand tout va bien, elle vérifie ses comptes, elle ne se fait jamais plaisir, et elle panique à la moindre dépense imprévue.",
        "En faisant son tableau, elle voit que sa mère et sa grand-mère étaient exactement pareilles, toutes deux inquiètes du manque. Puis elle compare les âges. À 28 ans, elle a vécu une rupture brutale. À 28 ans, sa grand-mère s'était retrouvée seule avec trois enfants.",
        "« Ce n'est pas juste moi. Mais maintenant que je le vois, je peux choisir de ne plus porter ça. » La fois suivante, devant une facture, elle a reconnu la panique et s'est dit : « Ça, c'est la peur de ma grand-mère. Moi, aujourd'hui, j'ai de quoi payer. » Et elle a respiré."
      ]
    },
    texte: [
      "Quand une émotion n'a pas pu être vécue ou dite par une génération, elle passe plus loin, **comme une lettre jamais ouverte qui passe de main en main**. Celle qui la reçoit ne sait pas ce qu'elle contient. Mais elle sent qu'elle pèse.",
      "Une famille transmet aussi des façons de vivre : **des peurs** (manquer, être quittée, déranger), **des façons d'aimer** (se sacrifier, tout contrôler), **des silences** (un secret, un départ dont on ne parle jamais) et **des règles**, souvent dites en une phrase : « Il faut se débrouiller seule. » Personne ne décide de transmettre tout ça : ça passe par l'exemple, par l'ambiance, et surtout par ce qui n'est jamais dit.",
      "Parfois, les dates se répondent : une rupture à l'âge exact où ta mère a vécu la sienne, une période difficile qui revient chaque année au même moment. On appelle ça le **syndrome d'anniversaire**. Prends ce que tu trouves comme **une piste, pas comme une preuve**. Le bon critère, c'est ce que tu ressens."
    ],
    signesTitre: 'Trois familles d’indices',
    signes: [
      "**Les comportements** · ta mère était-elle inquiète comme toi ? Ton père avait-il besoin de tout contrôler ?",
      "**L'enfance** · as-tu vécu une enfance qui ressemble à celle d'un de tes parents : un départ, une solitude ?",
      "**Le destin** · des séparations, des soucis d'argent, des épreuves qui reviennent aux mêmes moments de la vie.",
      "**Les phrases entendues** · « Elle a toujours eu peur de manquer. » Une seule phrase, dite à un repas de famille, peut ouvrir une porte."
    ],
    exemplesTitre: 'Cinq grands thèmes qui traversent souvent les générations',
    exemples: [
      "**L'abandon** · des départs et des séparations qui se répètent.",
      "**Le rejet** · le sentiment de ne pas avoir été voulu·e.",
      "**La trahison** · la méfiance, le besoin de tout contrôler.",
      "**L'humiliation** · la honte, la peur du regard des autres.",
      "**L'injustice** · tout porter seule, sans jamais être reconnue."
    ],
    retenir: [
      "Une famille transmet des peurs, des façons d'aimer, des silences et des règles, sans le décider.",
      "Reconnaître une transmission, c'est commencer à choisir, sans accuser personne.",
      "Les âges et les dates qui se répondent (le syndrome d'anniversaire) sont des pistes : suis celles qui te touchent.",
      "Ton outil du module : au moment où ta boucle démarre, demande-toi « À qui ça appartient ? »."
    ],
    question: { k: 'comp-indice', q: "Parmi ces indices, lequel te parle le plus aujourd'hui, et à qui te fait-il penser ?", ph: "Exemple : les phrases entendues. Ma grand-mère disait toujours « on ne sait jamais de quoi demain sera fait »." }
  },

  exercicesIntro: "Les exercices de ton cahier, à remplir ici. Tu peux t'aider de ton [fil d'or](fil-d-or.html) et de ton [arbre](genosociogramme.html) : ils repèrent pour toi les âges qui se répondent.",
  exercices: [
    { k: 'm2ex1', type: 'tableau', titre: 'Mon tableau des transmissions',
      consigne: "Reprends les peurs et les familles de peurs notées dans le module 1. Pour chacune, demande-toi : « Qui dans ma famille ressent, ou ressentait, la même chose ? » Cherche tout près : écoute ce qui vient en premier.",
      rangs: 5,
      etiquettes: ['Peur 1', 'Peur 2', 'Peur 3', 'Peur 4', 'Peur 5'],
      colonnes: [
        { q: 'Ma peur, ou ce qui me pèse', ph: ['Exemple : la peur de manquer d’argent', 'Exemple : la peur d’être quittée', 'Exemple : la peur de déranger', 'Exemple : tout porter seule', 'Exemple : la peur de ne pas être à la hauteur'] },
        { q: 'Qui dans ma famille', ph: ['Exemple : ma mère, ma grand-mère maternelle', 'Exemple : ma tante', 'Exemple : mon père', 'Exemple : ma grand-mère paternelle', 'Exemple : mon grand-père'] },
        { q: 'Ce qui se ressemble', ph: ['Exemple : toujours inquiètes, elles comptaient tout et ne se faisaient jamais plaisir', 'Exemple : elle a été quittée deux fois, elle disait « les hommes partent toujours »', 'Exemple : il ne demandait jamais rien à personne', 'Exemple : elle tenait toute la maison sans jamais se plaindre', 'Exemple : il se sentait jugé par sa famille'] }
      ] },
    { k: 'm2ex2', type: 'blocs', titre: 'Les phrases entendues',
      consigne: "Note les phrases que tu as entendues sur les membres de ta famille, ou qu'on te disait à toi. Même anodines. Puis écris à côté ce qu'elles t'ont peut-être appris sur la vie.",
      astuce: "Les phrases qui reviennent le plus souvent à ton esprit sont généralement les plus importantes. Celles qui te font sourire ou serrer les dents aussi.",
      nb: 5,
      etiquettes: ['Phrase 1', 'Phrase 2', 'Phrase 3', 'Phrase 4', 'Phrase 5'],
      champs: [
        { q: 'La phrase', ph: ['Exemple : « Dans la famille, on ne se plaint pas. »', 'Exemple : « Elle a toujours eu peur de manquer. »', 'Exemple : « Sois sage, ne fais pas de vagues. »', 'Exemple : « L’argent ne tombe pas du ciel. »', 'Exemple : « Les hommes, on ne peut pas compter dessus. »'] },
        { q: 'Ce qu’elle m’a appris', ph: ['Exemple : garder pour moi ce qui ne va pas, tout porter seule', 'Exemple : que le manque peut arriver à tout moment', 'Exemple : me taire pour être aimée', 'Exemple : me méfier dès que je dépense pour moi', 'Exemple : ne compter que sur moi'] }
      ] },
    { k: 'm2ex3', type: 'tableau', titre: 'Mes événements marquants',
      consigne: "Liste les moments qui ont marqué ta vie, avec ton âge à ce moment-là : séparations, deuils, déménagements, changements de travail, naissances, ruptures, périodes difficiles.",
      rangs: 6,
      etiquettes: ['Moment 1', 'Moment 2', 'Moment 3', 'Moment 4', 'Moment 5', 'Moment 6'],
      colonnes: [
        { q: 'Mon âge', ph: 'Exemple : 7 ans' },
        { q: 'Ce qui s’est passé', ph: 'Exemple : la séparation de mes parents' },
        { q: 'Ce que j’ai ressenti', ph: 'Exemple : je me suis sentie abandonnée, j’ai appris à ne plus rien demander' }
      ] },
    { k: 'm2ex4', type: 'tableau', titre: 'Ce qu’a vécu ma lignée',
      consigne: "Fais la même chose pour ta famille : parents, grands-parents, et plus loin si tu le peux. Demande, cherche, fais confiance à ce que tu sais déjà. Dans la dernière colonne, note un lien éventuel avec ta vie.",
      astuce: "Interroge avec douceur, si c'est possible : « Comment était-elle, ta mère ? » « Qu'est-ce qui a été dur pour vous ? » Note aussi les silences : une personne dont on ne parle jamais, une période floue, ce sont des indices précieux.",
      rangs: 6,
      etiquettes: ['Personne 1', 'Personne 2', 'Personne 3', 'Personne 4', 'Personne 5', 'Personne 6'],
      colonnes: [
        { q: 'Qui', ph: 'Exemple : ma mère' },
        { q: 'Son âge', ph: 'Exemple : 28 ans' },
        { q: 'Ce qu’il ou elle a vécu', ph: 'Exemple : le divorce de ses parents' },
        { q: 'Un lien avec ma vie ?', ph: 'Exemple : moi aussi, une rupture importante à 28 ans' }
      ] },
    { k: 'm2ex5', type: 'questions', titre: 'Ce qui se répond',
      consigne: "Relis tes exercices 3 et 4 côte à côte. Repère les âges, les dates et les situations qui se ressemblent. Puis réponds.",
      questions: [
        { k: 'm2ex5-ages', q: 'Les âges ou les dates qui se répondent', ph: 'Exemple : 28 ans pour ma rupture, 28 ans pour le départ du mari de ma grand-mère.' },
        { k: 'm2ex5-schema', q: 'Le schéma qui se répète d’une génération à l’autre', ph: 'Exemple : les femmes restent seules et tiennent tout, sans demander d’aide.' }
      ] },
    { k: 'm2ex5b', type: 'questions', titre: 'Ce qui se répond (suite) : le thème de ta lignée',
      consigne: "Quel thème te semble traverser ta lignée ? Choisis-le, puis note en un mot pourquoi, et ce que tu ressens.",
      choix: { k: 'm2ex5-theme', q: 'Le thème qui traverse ma lignée', options: ['Abandon · départs, séparations', 'Rejet · ne pas être voulu·e', 'Trahison · méfiance, contrôle', 'Humiliation · honte, regard des autres', 'Injustice · tout porter seule', 'Un autre, à nommer'] },
      questions: [
        { k: 'm2ex5-pourquoi', q: 'Pourquoi ce thème, en un mot ou une phrase', ph: 'Exemple : l’injustice, parce que chez nous les femmes portent tout sans être remerciées.' },
        { k: 'm2ex5-ressens', q: 'Ce que je ressens en voyant ce fil', ph: 'Exemple : de la tristesse pour ma grand-mère, et un soulagement : ce n’est pas seulement moi.', lignes: 3 }
      ] }
  ],

  outil: {
    titre: 'À qui ça appartient ?',
    intro: "Ton outil du module, à utiliser au moment précis où l'émotion familière monte. Entraîne-toi une première fois au calme, puis dans la vie. Il dure moins d'une minute.",
    etapes: [
      "**Arrête-toi.** Pose une main sur ta poitrine et respire lentement, en laissant l'expiration plus longue.",
      "**Demande.** « Est-ce vraiment à moi, ici et maintenant ? Ou ça ressemble à quelqu'un de ma famille ? »",
      "**Nomme.** Si un visage apparaît : « Ça, c'est la peur de ma grand-mère. » « Ça, c'est la colère de mon père. »",
      "**Rends.** Dis intérieurement : « Je te vois. Je respecte ce que tu as vécu. Ce n'est pas à moi de le porter. »",
      "**Choisis.** « De quoi ai-je besoin, moi, aujourd'hui ? » Et fais un seul petit geste différent : attendre dix minutes avant de répondre, dire « je vais y réfléchir », t'autoriser une dépense prévue.",
      "Et si aucun visage n'apparaît : « Cette peur est peut-être ancienne. Je peux choisir autrement maintenant, sans savoir d'où elle vient. »"
    ],
    note: { k: 'outil-note', q: "Après ton premier essai, note ce qui s'est passé : la situation, le visage qui est venu, ton petit geste.", ph: "Exemple : devant une facture, j’ai senti la panique. J’ai pensé à ma grand-mère. J’ai respiré, j’ai payé, et j’ai continué ma journée." }
  },

  jours: {
    titre: 'Mon carnet des 7 jours',
    consigne: "Chaque fois que ta boucle se déclenche cette semaine, fais le geste du « à qui ça appartient ? ». Le soir, note la situation, à qui ça ressemblait, et le petit geste différent que tu as fait.",
    ph: "Exemple : mon chef m’a fait une remarque, j’ai eu envie de me justifier pendant dix minutes. Ça ressemblait à ma mère face à son père. J’ai juste dit : « D’accord, je regarde ça. »",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : qu'est-ce qui a changé, même un tout petit peu ?", ph: "Exemple : deux fois, j’ai reconnu la peur de ma grand-mère avant qu’elle ne m’emporte." }
  },

  avancer: {
    intro: "Rendre ce qui ne t'appartient pas libère de la place. Cette page t'aide à poser ce que tu veux vivre à la place, en gardant le meilleur de ta lignée.",
    lieQ: "Si tu laissais à ta lignée ce qui lui appartient, à quoi ressemblerait ta vie dans le domaine de ta boucle ?",
    liePh: "Exemple : je dépense pour moi sans culpabiliser, et je garde la débrouillardise de ma grand-mère."
  },

  allerPlusLoin: [
    { titre: 'Ton livret « Libération »', texte: "Le suivi de ton étape prolonge ce module dans ta lignée : repérer ce qui se rejoue, le rendre avec un rituel, et l'intégrer dans ta vie.", lien: 'mon-suivi-mois.html' },
    { titre: 'Ton carnet « Renaissance »', texte: "Le carnet de ton étape t'aide à construire ce que tu veux vivre, pas à pas, avec ton audio du mois.", lien: 'mon-carnet.html' }
  ],

  bilan: [
    { k: 'bilan-decouvert', q: 'Ce que j’ai découvert sur ma famille', ph: 'Exemple : trois générations de femmes qui ont tout tenu seules.' },
    { k: 'bilan-rendre', q: 'Ce qui n’est pas à moi, et que je choisis de ne plus porter', ph: 'Exemple : la peur du manque de ma grand-mère.' },
    { k: 'bilan-gratitude', q: 'Ce que je garde avec gratitude de ma lignée', ph: 'Exemple : le courage, et le sens de l’humour de ma grand-mère.' },
    { k: 'bilan-phrase', q: 'La phrase que je me dis désormais quand ma boucle démarre', ph: 'Exemple : « Ça, c’est ancien. Moi, aujourd’hui, j’ai ce qu’il me faut. »' }
  ],

  suivant: { titre: 'Module 3 · Les programmes invisibles', texte: "Les croyances héritées, les loyautés familiales et les phrases qui décident encore à ta place. L'outil du module : attraper la phrase." }
};
