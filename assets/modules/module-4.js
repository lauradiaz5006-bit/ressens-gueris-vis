/* Genesolia · Cycle 2 · Le carnet du module 4 de la formation « Sors de la boucle » : « Ce qui pèse »
   Reprend les exercices du cahier PDF du module 4 (assets/formation/cahier-module-4.pdf), en version à remplir.
   Même livre que le module 1 (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 4,
  cle: 'module-4',
  page: 'mon-module.html',
  pdf: 'assets/formation/cahier-module-4.pdf',
  titre: 'Ce qui pèse',
  objectifs: { principal: "Déposer ce que tu portes depuis trop longtemps.", specifique: "Écrire tes trois lettres, vivre le rituel du module et garder la lettre express pour les moments où ça déborde.", bonASavoir: "Ce module, c’est **déposer** : tu libères le passé une fois, en profondeur, avec tes trois lettres et le rituel. Au module 5, tu apprendras à **libérer** au moment précis où la boucle se déclenche." },
  sousTitre: "Trois lettres et un rituel pour déposer ce que tu portes depuis trop longtemps.",
  citation: "Ce qui n'a jamais été dit continue de peser. Le mettre en mots, c'est déjà le sortir de soi.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    pages: {
      ouverture: 'assets/guide/guide-coffret.webp',
      comprendre: 'assets/guide/guide-livre-pupitre.webp',
      exercices: 'assets/guide/guide-livre-lumineux.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-cadeau.webp'
    }
  },

  mots: {
    ouverture: "Ces lettres sont pour toi seule. Tu peux tout écrire, sans filtre et sans politesse.",
    comprendre: "Une lettre par séance d'écriture, avec quelques jours entre chacune. Ton rythme est le bon.",
    exercices: "Ici, tu prépares tes lettres. Tu les écris ensuite en entier sur une feuille libre, celle que tu mettras à distance.",
    outil: "Garde quelques feuilles pliées à portée de main : le jour où la boucle démarre, tu n'auras pas à chercher.",
    avancer: "Ce que tu déposes laisse de la place. Cette page t'aide à choisir ce que tu veux y mettre.",
    bilan: "Si une lettre reste à écrire, ce n'est pas grave : certaines ont besoin de temps pour mûrir. Tu peux continuer la formation et y revenir quand tu te sentiras prête."
  },

  ouverture: {
    intro: "Jusqu'ici, tu as surtout regardé et compris. Dans ce module, tu déposes, avec trois lettres et un rituel simple. Commence par écouter le podcast du module dans ton espace de formation, puis reviens ici pour préparer tes lettres.",
    intensiteQ: "À quel point ce que tu portes pèse-t-il aujourd'hui ?",
    souhaitQ: "Qu'est-ce que tu as besoin de déposer en priorité ?",
    souhaitPh: "Exemple : le rôle de la petite fille sage qui arrange tout pour tout le monde.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais pouvoir dire « pas ce week-end » à ma mère sans me sentir coupable.",
    phrasePh: "Exemple : je dépose ce qui ne m'appartient plus."
  },

  comprendre: {
    titre: 'Ouvrir le sac',
    chapeau: "Imagine un sac à dos que tu portes depuis l'enfance. Au fil des années, on y a glissé des pierres : une croyance, une colère jamais dite, une tristesse, une promesse faite sans le savoir. Aujourd'hui, on ouvre le sac.",
    histoire: {
      titre: 'Nadia, la petite fille sage',
      texte: [
        "Dans sa famille, c'est Nadia qu'on appelle pour tout. Elle dit oui à tout, puis s'en veut. Quand ses parents se sont séparés, elle avait neuf ans. Sa mère pleurait beaucoup, et Nadia est devenue la petite fille sage qui consolait et arrangeait.",
        "Elle a écrit ses trois lettres sur trois semaines. Dans la lettre de deuil, elle a dit au revoir à cette petite fille. Dans la lettre à sa mère, elle a écrit : « Je te rends ta tristesse, maman, et je reprends mon enfance. » Elle a pleuré une heure, puis dormi comme jamais.",
        "Le dimanche suivant, quand sa mère lui a demandé de venir, elle a répondu : « Pas ce week-end, maman, mais je t'appelle mardi. » Pour la première fois, le oui automatique n'est pas sorti."
      ]
    },
    texte: [
      "Pourquoi écrire ? Mettre des mots sur ce qu'on ressent, c'est déjà le sortir de soi. Le regarder sur le papier, c'est prendre de la distance. Et accomplir un geste symbolique avec cette lettre, c'est dire à une partie profonde de soi : **cette page est tournée**.",
      "**Le cadre.** Choisis un moment où tu as du temps, dans un endroit où tu seras tranquille. Prends des feuilles libres. Prévois quelque chose de doux pour après : une marche, un thé, un appel à une amie. Une lettre par séance d'écriture, avec quelques jours entre chacune. Ces lettres ne s'envoient jamais. Si c'est trop lourd, arrête-toi, et fais-toi accompagner si tu en ressens le besoin.",
      "**Le rituel, après chaque lettre, en cinq temps.** Écris sans te relire, jusqu'à ce que tout soit sorti, puis signe et date. Lis-la à voix haute. Mets-la à distance : la brûler en sécurité dans un évier ou un récipient en métal, la déchirer, l'enterrer, ou la ranger loin dans une enveloppe fermée. Laisse passer l'émotion. Et prends soin de toi : un grand verre d'eau, une couverture, une marche, du repos."
    ],
    signesTitre: 'Les trois lettres',
    signes: [
      "**La lettre de libération** · elle libère les croyances et les loyautés découvertes au module 3. Elle se termine par tes phrases de permission.",
      "**La lettre de deuil** · tu dis au revoir à une ancienne version de toi (la fille sage, celle qui attend qu'on la choisisse, celle qui se tait), en cinq temps : prendre conscience, la colère, le marchandage, la tristesse, l'accueil.",
      "**La lettre à tes parents** · elle s'écrit même s'ils sont décédés, même si tu ne les as pas connus, même si vous vous entendez bien. Son cœur : « Je vous rends… et je reprends pour moi… ». Tu n'as pas à pardonner : le but est de reprendre ta liberté."
    ],
    retenir: [
      "Ce qui n'a jamais été dit continue de peser : l'écrire, c'est le sortir de soi.",
      "Trois lettres : libérer les croyances et les loyautés, dire au revoir à une ancienne version de toi, rendre à tes parents ce qui leur appartient.",
      "Chaque lettre se vit avec un rituel en cinq temps, et beaucoup de douceur après.",
      "Ton outil du module, pour les jours où la boucle s'emballe : la lettre express de cinq minutes."
    ],
    question: { k: 'comp-lettre', q: "Laquelle des trois lettres t'appelle le plus, et pourquoi ?", ph: "Exemple : la lettre de deuil. Je sens que la sauveuse en moi est fatiguée." }
  },

  exercicesIntro: "Les exercices de ton cahier, à remplir ici. Tu y prépares les idées et les mots clés de chaque lettre, puis tu notes ce qui a changé après le rituel. Garde à portée de main tes phrases de permission du module 3.",
  exercices: [
    { k: 'm4ex1', type: 'questions', titre: 'Préparer ma lettre de libération',
      consigne: "Ici, tu prépares ta première lettre : tu poses les idées et les mots clés. Puis tu l'écris en entier sur une feuille libre, celle que tu mettras à distance pendant le rituel.",
      astuce: "Si tu bloques, commence simplement par : « Il y a une chose que je n'ai jamais dite… » et laisse venir la suite.",
      questions: [
        { k: 'm4ex1-croyance', q: 'La croyance ou la loyauté que je veux libérer', ph: 'Exemple : je dois tout porter seule.' },
        { k: 'm4ex1-origine', q: 'De qui elle vient, et comment elle l’a protégé·e', ph: 'Exemple : de ma grand-mère, veuve à trente ans. Elle a tenu grâce à ça.' },
        { k: 'm4ex1-empeche', q: 'Ce qu’elle m’a empêchée de vivre', ph: 'Exemple : demander de l’aide, me reposer, être soutenue en couple.' },
        { k: 'm4ex1-appris', q: 'Ce qu’elle m’a appris de bon, malgré tout', ph: 'Exemple : je suis débrouillarde et solide.' },
        { k: 'm4ex1-permission', q: 'Ce que je m’autorise désormais (ma phrase de permission)', ph: 'Exemple : « Grand-mère, tu as tout tenu seule. Moi, je peux demander. Et je garde ton courage. »' }
      ] },
    { k: 'm4ex2', type: 'questions', titre: 'Préparer ma lettre de deuil',
      consigne: "Choisis la version de toi à qui tu dis au revoir. Donne-lui un nom si tu veux (la fille sage, la sauveuse, l'invisible…). Puis note quelques mots pour chacun des cinq temps. Ces temps ne viennent pas toujours dans l'ordre : écris ce qui est là.",
      questions: [
        { k: 'm4ex2-version', q: 'La version de moi à qui je dis au revoir', ph: 'Exemple : la sauveuse.', court: true },
        { k: 'm4ex2-conscience', q: 'Prendre conscience : « Je prends conscience que je dois dire au revoir à… »', ph: 'Exemple : …celle qui répond toujours présente, même épuisée.' },
        { k: 'm4ex2-colere', q: 'La colère : « Je suis en colère parce que… »', ph: 'Exemple : …personne ne m’a jamais demandé comment j’allais.' },
        { k: 'm4ex2-marchandage', q: 'Le marchandage : « J’aurais aimé que… mais je comprends que… »', ph: 'Exemple : J’aurais aimé qu’on me laisse être une enfant, mais je comprends que maman faisait comme elle pouvait.' },
        { k: 'm4ex2-tristesse', q: 'La tristesse : « Je ressens de la tristesse en laissant partir… »', ph: 'Exemple : …celle qui se sentait utile et aimée en aidant.' },
        { k: 'm4ex2-accueil', q: 'L’accueil : « J’accueille ce changement, et je choisis de… »', ph: 'Exemple : …aider quand je le choisis, et me reposer quand j’en ai besoin.' },
        { k: 'm4ex2-fin', q: 'Ce que je lui dis pour finir : un merci, un mot doux, une promesse à moi-même', ph: 'Exemple : « Merci de m’avoir portée. Je prends le relais, autrement. »' }
      ] },
    { k: 'm4ex3', type: 'questions', titre: 'Préparer ma lettre à mes parents',
      consigne: "Tu peux écrire une seule lettre aux deux, ou une à chacun. Note ce qui doit absolument être dit. Rappelle-toi : cette lettre ne sera jamais envoyée.",
      questions: [
        { k: 'm4ex3-porte', q: 'Ce que j’ai porté pendant longtemps', ph: 'Exemple : la tristesse de maman après le divorce.' },
        { k: 'm4ex3-manque', q: 'Ce qui m’a mise en colère, ou ce qui m’a manqué', ph: 'Exemple : que personne ne me console, moi.' },
        { k: 'm4ex3-comprends', q: 'Ce que je comprends de ce qu’ils ont vécu (si je le souhaite)', ph: 'Exemple : maman était seule, sans aide, avec deux enfants.' }
      ] },
    { k: 'm4ex3b', type: 'blocs', titre: 'Ma lettre à mes parents (suite) : je vous rends, je reprends',
      consigne: "Le cœur de la lettre : ce que tu leur rends, et ce que tu reprends pour toi. Tu n'as pas à pardonner : le but est de reprendre ta liberté.",
      nb: 3,
      etiquettes: ['Rendre 1', 'Rendre 2', 'Rendre 3'],
      champs: [
        { q: 'Je vous rends…', ph: ['Exemple : ta tristesse, maman', 'Exemple : votre peur de manquer', 'Exemple : ta colère, papa'] },
        { q: 'Et je reprends pour moi…', ph: ['Exemple : ma joie, et mon enfance', 'Exemple : le droit de profiter', 'Exemple : ma douceur'] }
      ],
      apres: [{ k: 'm4ex3-choisis', q: 'À partir de maintenant, je choisis de…', ph: 'Exemple : …dire non quand je suis fatiguée, et appeler maman quand j’en ai envie.' }] },
    { k: 'm4ex4', type: 'tableau', titre: 'Après le rituel',
      consigne: "Remplis cette page le lendemain de chaque rituel, quand l'émotion est retombée.",
      rangs: 3,
      etiquettes: ['Lettre 1', 'Lettre 2', 'Lettre 3'],
      colonnes: [
        { q: 'Comment je l’ai mise à distance', ph: 'Exemple : brûlée dans l’évier' },
        { q: 'Ce que j’ai ressenti', ph: 'Exemple : des larmes, puis un grand calme' },
        { q: 'Ce qui a changé depuis', ph: 'Exemple : je dors mieux, j’ai dit non une fois sans m’excuser' }
      ],
      apres: { k: 'm4ex4-douceur', q: 'Ce qui m’a fait du bien pour prendre soin de moi après', ph: 'Exemple : un bain, une couverture, et une soirée sans téléphone.' } }
  ],

  outil: {
    titre: 'La lettre express',
    intro: "Les grandes lettres prennent du temps. Certains jours, la boucle s'emballe et tu as besoin de quelque chose de rapide : la lettre express, en cinq minutes. Ça marche aussi dans une note de ton téléphone, que tu effaces ensuite.",
    etapes: [
      "Prends une feuille, n'importe laquelle.",
      "Écris trois phrases, vite. « Ce que je ressens là, maintenant, c'est… »",
      "« Ce qui est ancien là-dedans, c'est… »",
      "« Ce que je choisis maintenant, c'est… » : une seule chose concrète, possible aujourd'hui.",
      "Lis-les une fois. Puis déchire la feuille, jette-la, et fais ce que tu as choisi."
    ],
    note: { k: 'outil-note', q: "Après ta première lettre express, note ce qui s'est passé : ce que tu as écrit (en deux mots), et ce que tu as fait ensuite.", ph: "Exemple : colère contre ma sœur, ancien : la place de l’aînée qui doit tout gérer. J’ai choisi de lui demander de s’occuper du cadeau. Elle a dit oui." }
  },

  jours: {
    titre: 'Mes lettres express',
    consigne: "La lettre express se jette. Ici, note seulement, le soir, ce qui s'est passé : la situation, ce qui était ancien, ce que tu as choisi, et si tu l'as fait.",
    ph: "Exemple : mon compagnon est rentré tard sans prévenir, panique d’être abandonnée · ancien : la peur de ma mère · choisi : lui dire calmement que j’aimerais un message · fait, et il s’est excusé.",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : qu'est-ce qui a changé, même un tout petit peu ?", ph: "Exemple : j’écris la lettre express de plus en plus vite, et je passe à l’action le jour même." }
  },

  avancer: {
    intro: "Chaque pierre déposée libère de la place. Cette page t'aide à imaginer ta vie avec un sac plus léger.",
    lieQ: "Si tu avais déposé ce qui pèse le plus, à quoi ressemblerait ta vie au quotidien ?",
    liePh: "Exemple : je dis oui quand j'en ai envie, je me repose sans culpabiliser, et ma relation avec ma mère est plus simple."
  },

  allerPlusLoin: [
    { titre: 'Ton suivi « Je me libère »', texte: "Le suivi de ton étape prolonge ce module dans ta lignée : repérer ce qui se rejoue, le rendre avec un rituel, et l'intégrer dans ta vie.", lien: 'mon-suivi-mois.html' },
    { titre: 'Ton carnet « J’avance »', texte: "Le carnet de ton étape t'aide à construire ce que tu veux vivre, pas à pas, avec ton audio du mois.", lien: 'mon-carnet.html' }
  ],

  bilan: [
    { k: 'bilan-pierre', q: 'La pierre la plus lourde que j’ai posée', ph: 'Exemple : le rôle de la petite fille qui console maman.' },
    { k: 'bilan-corps', q: 'Ce que je ressens dans mon corps, maintenant qu’elle n’est plus là', ph: 'Exemple : mes épaules sont plus basses, je respire plus large.' },
    { k: 'bilan-repris', q: 'Ce que j’ai repris pour moi', ph: 'Exemple : mes week-ends, et le droit de dire non.' },
    { k: 'bilan-douceur', q: 'Une chose douce que je m’offre pour célébrer ce passage', ph: 'Exemple : une journée au bord de la mer, seule.' }
  ],

  suivant: { titre: 'Module 5 · Clé 1 · Libérer la mémoire', texte: "Un protocole en cinq étapes pour agir au moment précis où la boucle se déclenche, et sa version de poche en soixante secondes." }
};
