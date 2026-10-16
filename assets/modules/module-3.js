/* Genesolia · Cycle 2 · Le carnet du module 3 de la formation « Sors de la boucle » : « Les programmes invisibles »
   Reprend les exercices du cahier PDF du module 3 (assets/formation/cahier-module-3.pdf), en version à remplir.
   Même livre que le module 1 (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 3,
  cle: 'module-3',
  page: 'mon-module.html',
  pdf: 'assets/formation/cahier-module-3.pdf',
  titre: 'Les programmes invisibles',
  objectifs: { principal: "Voir les croyances et les loyautés qui décident à ta place.", specifique: "Attraper les phrases de famille qui tournent dans ta tête et écrire tes propres phrases de permission." },
  sousTitre: "Les phrases, les croyances et les loyautés qui décident encore à ta place.",
  citation: "Un programme a protégé quelqu'un, un jour. On ne le combat pas : on le remercie, et on le met à jour.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    pages: {
      ouverture: 'assets/guide/guide-livre-lumineux.webp',
      comprendre: 'assets/guide/guide-repete.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-etoiles.webp',
      bilan: 'assets/guide/guide-spirale-or.webp'
    }
  },

  mots: {
    ouverture: "Si tu as refait la même chose en le sachant, c'est normal. Ce module t'aide à voir ce qui tourne en arrière-plan.",
    comprendre: "Ces programmes ont presque toujours eu une bonne raison d'exister. Regarde-les avec respect.",
    exercices: "Note les phrases mot pour mot, telles qu'elles se disaient. Ce sont souvent les plus simples qui comptent le plus.",
    outil: "Au début, tu attraperas la phrase après coup. Puis pendant. Puis un jour, avant : c'est là que tu choisis.",
    avancer: "Chaque phrase remerciée laisse la place à une phrase vraie pour aujourd'hui.",
    bilan: "Regarde ce que tu as desserré, même un peu. Un nœud se défait en relâchant, jamais en tirant."
  },

  ouverture: {
    intro: "Dans ce module, tu regardes ce qui fait tenir ta boucle : les croyances héritées, les loyautés et les phrases qui décident à ta place. Commence par regarder la vidéo du module dans ton espace de formation, puis reviens ici pour pratiquer.",
    intensiteQ: "À quel point te sens-tu coincée par ta boucle aujourd'hui ?",
    souhaitQ: "Qu'est-ce que tu refais encore, même en sachant que c'est ta boucle ?",
    souhaitPh: "Exemple : je sais que je devrais demander de l'aide, et je finis toujours par tout faire seule.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais entendre la phrase « ne dérange pas » quand elle arrive, et oser demander quand même.",
    phrasePh: "Exemple : aujourd'hui, j'ai le droit de demander."
  },

  comprendre: {
    titre: 'Ce qui fait tenir la boucle',
    chapeau: "Une boucle tient rarement par manque de volonté. Elle tient par des programmes invisibles, qui tournent en arrière-plan comme une application qu'on aurait oublié de fermer.",
    histoire: {
      titre: 'Camille, et la promotion qui lui échappe',
      texte: [
        "Camille a 41 ans, elle est douée, reconnue. Et pourtant, chaque fois qu'une promotion se profile, elle rate une échéance, se dispute avec la mauvaise personne, ou dit qu'elle n'est pas intéressée. Trois fois en huit ans.",
        "En remontant le fil, elle se souvient de sa mère, brillante à l'école, qui a dû arrêter ses études à seize ans pour s'occuper de ses frères et sœurs. Et qui répétait en souriant : « Moi, je n'ai pas eu cette chance. » Camille a compris : comme si réussir, c'était la laisser derrière elle.",
        "Elle a écrit sa phrase de permission : « Maman, tu n'as pas pu aller plus loin, et je le vois. Moi, je peux. Et je reste ta fille, c'est aussi pour toi. » Elle l'a relue chaque matin pendant un mois. À la promotion suivante, elle a dit oui. Et sa mère a pleuré de fierté."
      ]
    },
    texte: [
      "Ces programmes ont presque toujours eu une bonne raison d'exister : ils ont protégé quelqu'un, un jour. Ce qui pose question, c'est qu'ils continuent de tourner alors que la situation qui les justifiait est terminée depuis longtemps.",
      "Pour en débusquer un, il y a un indice très fiable : **le décalage entre ce que tu ressens, ce que tu dis et ce que tu fais**. Je ressens un besoin d'amour, je dis que l'amour fait souffrir, et je m'éloigne dès que quelqu'un s'approche. Chaque décalage crée une tension : c'est souvent elle que tu ressens comme l'impression d'être coincée.",
      "Une loyauté invisible est faite d'amour, même maladroit. On lui offre une autre façon d'aimer : **la phrase de permission**, en trois temps. Je reconnais ce qu'a vécu la personne. J'affirme ce que je choisis. Je rassure le lien. Lis-la à voix haute : une phrase juste fait presque toujours quelque chose, un soupir, une émotion, des épaules qui se détendent."
    ],
    signesTitre: 'Trois formes de programmes invisibles',
    signes: [
      "**Les croyances héritées** · des idées sur la vie, l'argent, l'amour, reçues avant de pouvoir les choisir. « L'argent corrompt. » « Les hommes finissent toujours par partir. »",
      "**Les loyautés invisibles** · une fidélité à quelqu'un de ta famille, comme si aller mieux revenait à le trahir. « Si je réussis, je dépasse ma mère qui n'a pas pu. »",
      "**Les injonctions** · des règles de conduite jamais dites, mais toujours respectées. « Chez nous, on garde ses émotions pour soi. » « Sois forte. » « Ne dérange pas. »"
    ],
    retenir: [
      "Une boucle tient par des programmes invisibles : croyances héritées, loyautés, injonctions.",
      "Le décalage entre ressentir, dire et faire montre où se cache un programme.",
      "Une loyauté se transforme avec une phrase de permission : reconnaître, affirmer, rassurer le lien.",
      "Ton outil du module : attraper la phrase qui part juste avant la boucle, et la remplacer par une phrase vraie."
    ],
    question: { k: 'comp-programme', q: "Laquelle de ces trois formes reconnais-tu le plus dans ta vie, et par quelle phrase ?", ph: "Exemple : une injonction. « Ne dérange pas », que ma grand-mère disait à tout le monde." }
  },

  exercicesIntro: "Les exercices de ton cahier, à remplir ici. Pour la carte des nœuds, tu peux aussi imprimer la version papier et la dessiner à la main.",
  exercices: [
    { k: 'm3ex1', type: 'tableau', titre: 'Les phrases de ma famille',
      consigne: "Note les phrases, devises ou règles qui circulaient dans ta famille, dites ou jamais dites. Puis observe ce que tu en as fait dans ta vie : tu les appliques, tu les combats, ou tu les subis ?",
      rangs: 5,
      etiquettes: ['Phrase 1', 'Phrase 2', 'Phrase 3', 'Phrase 4', 'Phrase 5'],
      colonnes: [
        { q: 'La phrase ou la règle', ph: ['Exemple : « Il faut travailler dur pour mériter »', 'Exemple : « Ne dérange pas »', 'Exemple : « Sois forte »', 'Exemple : « L’argent corrompt »', 'Exemple : « Chez nous, on garde ses émotions pour soi »'] },
        { q: 'Qui la disait ou la vivait', ph: ['Exemple : mon père', 'Exemple : ma grand-mère', 'Exemple : ma mère', 'Exemple : mon grand-père', 'Exemple : toute la famille'] },
        { q: 'Ce que j’en fais aujourd’hui', ph: ['Exemple : je l’applique, je ne me repose jamais sans culpabiliser', 'Exemple : je la subis, je n’ose pas demander', 'Exemple : je l’applique, je pleure seule', 'Exemple : je la combats, mais je dépense tout dès que je gagne', 'Exemple : je la subis, je souris quand ça va mal'] }
      ] },
    { k: 'm3ex2', type: 'tableau', titre: 'Ressentir, dire, faire',
      consigne: "Pour chaque domaine, note ce que tu ressens vraiment, ce que tu dis (à toi ou aux autres), ce que tu fais concrètement. Dans la dernière colonne, note l'origine : croyance héritée, loyauté, injonction, ou un simple point d'interrogation.",
      rangs: 6,
      etiquettes: ['Amour', 'Travail', 'Argent', 'Famille', 'Mon temps à moi', 'Mes projets'],
      colonnes: [
        { q: 'Je ressens', ph: ['Exemple : un grand besoin d’être aimée', 'Exemple : l’envie d’évoluer', 'Exemple : l’envie de me faire plaisir', 'Exemple : de la fatigue', 'Exemple : le besoin de souffler', 'Exemple : l’envie de me lancer'] },
        { q: 'Je dis', ph: ['Exemple : « L’amour fait souffrir »', 'Exemple : « Ce n’est pas pour moi »', 'Exemple : « Je n’en ai pas besoin »', 'Exemple : « Ça va, je gère »', 'Exemple : « Je n’ai pas le temps »', 'Exemple : « Un jour, peut-être »'] },
        { q: 'Je fais', ph: ['Exemple : je m’éloigne dès que quelqu’un s’approche', 'Exemple : je refuse les responsabilités', 'Exemple : je garde tout de côté', 'Exemple : j’organise tout pour tout le monde', 'Exemple : je remplis chaque minute', 'Exemple : je repousse'] },
        { q: 'D’où ça vient ?', ph: ['Exemple : loyauté à ma mère, quittée deux fois', 'Exemple : croyance héritée', 'Exemple : injonction', 'Exemple : loyauté', 'Exemple : ?', 'Exemple : croyance héritée'] }
      ] },
    { k: 'm3ex3', type: 'questions', titre: 'Ma carte des nœuds',
      consigne: "Sur papier, dessine une silhouette simple avec trois zones : le cœur (je ressens), la gorge (je dis), la tête (je fais). Place chaque décalage de l'exercice 2 : nœud serré si les trois divergent, nœud lâche si un seul diverge, fil libre si tout est aligné. La taille dit l'ancienneté. Ajoute un petit fil vers le bas pour ce qui vient de ta lignée. Ici, note ce que ta carte montre.",
      questions: [
        { k: 'm3ex3-serres', q: 'Mes nœuds serrés (les trois partent dans des directions différentes)', ph: 'Exemple : l’amour, l’argent.' },
        { k: 'm3ex3-laches', q: 'Mes nœuds lâches (un seul diverge)', ph: 'Exemple : le travail, mes projets.' },
        { k: 'm3ex3-libres', q: 'Mes fils libres (tout est aligné)', ph: 'Exemple : mes amitiés, ma cuisine.' },
        { k: 'm3ex3-lignee', q: 'Les nœuds qui portent un petit fil vers ma lignée', ph: 'Exemple : l’amour, vers ma mère.' }
      ] },
    { k: 'm3ex4', type: 'questions', titre: 'Lire ma carte',
      consigne: "Regarde ta carte comme si c'était celle de quelqu'un d'autre.",
      astuce: "Si tu ne trouves pas la croyance racine, complète cette phrase plusieurs fois, vite, sans réfléchir : « Au fond, je crois que je… ». La bonne réponse te surprendra peut-être.",
      questions: [
        { k: 'm3ex4-gros', q: 'Mes plus gros nœuds, et ce qu’ils me coûtent', ph: 'Exemple : l’amour. Je suis seule depuis des années et je m’épuise à me protéger.' },
        { k: 'm3ex4-fidele', q: 'Ceux qui portent un fil vers ma lignée : à qui suis-je fidèle ?', ph: 'Exemple : à ma mère, qui a été quittée deux fois.' },
        { k: 'm3ex4-libres', q: 'Mes fils libres : là où je sais déjà être alignée', ph: 'Exemple : avec mes amies, je dis ce que je ressens et je fais ce que je dis.' },
        { k: 'm3ex4-racine', q: 'La croyance racine qui relie peut-être plusieurs nœuds', ph: 'Exemple : « Au fond, je crois que je ne mérite pas qu’on reste. »' }
      ] },
    { k: 'm3ex5', type: 'blocs', titre: 'Mes phrases de permission',
      consigne: "Pour chaque loyauté ou croyance repérée, écris ta phrase de permission en trois temps : je reconnais ce que la personne a vécu, j'affirme ce que je choisis, je rassure le lien. Lis-la à voix haute et ajuste-la jusqu'à ce qu'elle sonne juste.",
      nb: 3,
      etiquettes: ['Permission 1', 'Permission 2', 'Permission 3'],
      champs: [
        { q: 'La loyauté ou la croyance', ph: ['Exemple : je ne peux pas réussir plus que ma mère', 'Exemple : l’amour finit toujours par partir', 'Exemple : je dois tout porter seule'] },
        { q: 'Ma phrase de permission', ph: ['Exemple : « Maman, tu n’as pas pu. Moi, je peux. Et je reste ta fille. »', 'Exemple : « Maman, tu as été quittée, et je le vois. Moi, je peux être aimée et rester. Je t’aime toujours. »', 'Exemple : « Grand-mère, tu as tout tenu seule. Moi, je peux demander. Et je garde ton courage. »'] }
      ],
      pourquoi: "Garde tes phrases de permission à portée de main : tu en auras besoin pour écrire tes lettres dans le module 4." }
  ],

  outil: {
    titre: 'Attraper la phrase',
    intro: "Presque chaque boucle démarre par une phrase intérieure, si rapide que tu ne l'entends plus. Ton outil du module, à utiliser juste avant de réagir.",
    etapes: [
      "**Écoute.** Note ce qui se dit dans ta tête juste avant de réagir, mot pour mot. « Je vais encore me faire avoir. » « Il ne faut pas déranger. »",
      "**Demande.** Qui disait ça dans ta famille ?",
      "**Remercie.** « Tu as protégé quelqu'un, autrefois. Merci. »",
      "**Remplace.** Une phrase vraie pour aujourd'hui, simple et juste : « Aujourd'hui, j'ai le droit de demander. »",
      "**Pose un acte**, même minuscule, dans le sens de cette nouvelle phrase. Maintenant, pas demain."
    ],
    note: { k: 'outil-note', q: "Après ton premier essai, note la phrase attrapée, qui la disait, ta phrase vraie et ton petit acte.", ph: "Exemple : « Je ne veux pas déranger » · ma grand-mère · « J’ai le droit de demander » · j’ai demandé de l’aide à ma collègue." }
  },

  jours: {
    titre: 'Mon carnet des phrases attrapées',
    consigne: "Chaque jour, attrape au moins une phrase automatique. Note-la mot pour mot, qui la disait dans ta famille, ta nouvelle phrase vraie, et le petit acte que tu as posé. En une semaine, tu verras que ce sont presque toujours les deux ou trois mêmes : ce sont elles, tes programmes principaux.",
    ph: "Exemple : « Je ne veux pas déranger » · ma grand-mère · « J’ai le droit de demander » · j’ai demandé de l’aide à ma collègue.",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : quelles phrases reviennent le plus souvent ?", ph: "Exemple : « ne dérange pas » et « tu vas encore te faire avoir ». Je les entends maintenant pendant, plus seulement après." }
  },

  avancer: {
    intro: "Chaque phrase remerciée libère de la place pour une phrase vraie. Cette page t'aide à imaginer ta vie quand ce que tu ressens, ce que tu dis et ce que tu fais vont dans le même sens.",
    lieQ: "Si ton plus gros nœud se desserrait, à quoi ressemblerait ta vie dans ce domaine ?",
    liePh: "Exemple : je laisse quelqu'un s'approcher, je dis ce que je ressens, et je reste."
  },

  allerPlusLoin: [
    { titre: 'Ton suivi « Je me libère »', texte: "Le suivi de ton étape prolonge ce module dans ta lignée : repérer ce qui se rejoue, le rendre avec un rituel, et l'intégrer dans ta vie.", lien: 'mon-suivi-mois.html' },
    { titre: 'Ton carnet « J’avance »', texte: "Le carnet de ton étape t'aide à construire ce que tu veux vivre, pas à pas, avec ton audio du mois.", lien: 'mon-carnet.html' }
  ],

  bilan: [
    { k: 'bilan-programme', q: 'Le programme invisible le plus fort que j’ai découvert', ph: 'Exemple : « Ne dérange pas », qui me fait tout porter seule.' },
    { k: 'bilan-fidele', q: 'À qui j’étais fidèle, et comment je peux l’aimer autrement', ph: 'Exemple : à ma grand-mère. Je peux l’aimer en gardant son courage, et en demandant de l’aide.' },
    { k: 'bilan-permission', q: 'Ma phrase de permission la plus importante', ph: 'Exemple : « Grand-mère, tu as tout tenu seule. Moi, je peux demander. Et je garde ton courage. »' },
    { k: 'bilan-acte', q: 'Le premier acte aligné que je pose cette semaine', ph: 'Exemple : demander à mon frère de s’occuper des courses de maman samedi.' }
  ],

  suivant: { titre: 'Module 4 · Ce qui pèse', texte: "Trois lettres et un rituel pour déposer ce que tu portes depuis trop longtemps. L'outil du module : la lettre express de cinq minutes." }
};
