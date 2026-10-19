/* Genesolia · Cycle 2 · Le carnet du module 6 de la formation « Sors de la boucle » : « Clé 2 · Stopper les répétitions »
   Reprend les exercices du cahier PDF du module 6 (assets/formation/cahier-module-6.pdf), en version à remplir.
   Même livre que le module 1 (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 6,
  cle: 'module-6',
  page: 'mon-module.html',
  pdf: 'assets/formation/cahier-module-6.pdf',
  titre: 'Clé 2 · Stopper les répétitions',
  objectifs: { principal: "Comprendre pourquoi une boucle revient malgré tout.", specifique: "Descendre jusqu'à sa racine, couche après couche, et poser un geste concret dans les 48 heures." },
  sousTitre: "Quand une boucle revient malgré tout : descendre jusqu'à sa racine.",
  citation: "Ce n'est pas la case départ. C'est une couche plus profonde, et si elle se montre, c'est que tu es prête à la traverser.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    pages: {
      ouverture: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-repete.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-spirale-or.webp'
    }
  },

  mots: {
    ouverture: "Ce module est peut-être celui qui t'évitera d'abandonner au mauvais moment. Lis-le même si tout va bien.",
    comprendre: "Tu ne creuses pas un nouveau trou : tu creuses le même, plus profond.",
    exercices: "Si tu ne vois pas encore la racine, laisse la case vide : elle se révélera peut-être plus tard.",
    outil: "Sans le geste, la compréhension reste dans ta tête. Avec lui, elle passe dans ta vie.",
    avancer: "Chaque vague qui revient est moins haute que la précédente.",
    bilan: "Quand une mémoire se libère, elle laisse un espace. Dans le module 7, tu apprendras à le remplir avec ce que tu veux vraiment."
  },

  ouverture: {
    intro: "Dans ce module, tu apprends à reconnaître ce qui se passe quand une boucle que tu croyais réglée revient, et à descendre jusqu'à sa racine. Commence par écouter le podcast du module dans ton espace de formation, puis reviens ici pour pratiquer.",
    intensiteQ: "À quel point la boucle qui revient te décourage-t-elle aujourd'hui ?",
    souhaitQ: "Quelle boucle revient, alors que tu pensais l'avoir réglée ?",
    souhaitPh: "Exemple : la peur de manquer. J'allais mieux avec l'argent, et un courrier m'a tout fait revivre.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais voir la prochaine vague comme un étage de plus, et poser mon geste dans les 48 heures.",
    phrasePh: "Exemple : ce n'est pas un retour en arrière, c'est une couche plus profonde."
  },

  comprendre: {
    titre: 'Les couches de l’oignon',
    chapeau: "Tu as pratiqué, ça marche. Et puis un jour, tout revient d'un coup, avec une situation qui ressemble presque trop à ta peur. La pensée tombe : « J'ai échoué. » En réalité, tu es arrivée à une couche plus profonde.",
    histoire: {
      titre: 'Claire, descendue d’un étage',
      texte: [
        "Claire avait travaillé des mois sur sa peur de manquer. Ses finances s'étaient apaisées, elle avait enfin pu respirer. Puis, avec trois enfants et des nuits courtes, elle a relâché sa pratique.",
        "Un matin, un courrier : une erreur dans son dossier, une grosse somme à rembourser. La panique. « Je le savais, l'argent part toujours. » Elle a repris le protocole, et elle a vu que sa vraie peur était l'autorité : celle de son grand-père, qui avait tout perdu pendant la guerre.",
        "Son geste dans les quarante-huit heures : appeler l'administration, calmement, et demander un échéancier. On le lui a accordé en dix minutes. « J'étais juste descendue d'un étage. »"
      ]
    },
    texte: [
      "**L'oignon.** Chaque couche protège la suivante. En surface : « l'argent, c'est difficile à gagner ». Tu travailles dessus, l'argent commence à rentrer. Alors seulement, la couche suivante se montre : « si j'en ai trop, on va me le reprendre ». C'est ton progrès qui l'a réveillée. Et dessous, la racine : « dans ma famille, on ne garde jamais rien ».",
      "**Pourquoi elles attendent.** Une partie de toi est très sage : elle te montre les choses quand tu es prête, quand tu as assez pratiqué et que tu es assez solide pour traverser. Si une couche revient, c'est que tu es capable de la traverser.",
      "**La peur de conséquence.** La couche profonde est souvent une peur de ce qui arriverait si tu obtenais ce que tu veux. Pour la trouver, complète : « J'ai peur que, si j'obtiens ce que je veux, alors… » et écris ce qui vient, même si ça te semble absurde.",
      "**Les phases.** Le nettoyage de surface, puis la consolidation, puis la stabilisation, la plus déroutante : des semaines de calme, puis une grosse vague. Ensuite la transformation profonde, et l'intégration, quand le protocole est devenu un réflexe."
    ],
    signesTitre: 'Trois signes qu’une couche profonde remonte',
    signes: [
      "**Tu pensais avoir réglé ce sujet** · tu n'y pensais plus du tout depuis des semaines.",
      "**La situation ressemble presque trop à ta peur** · un courrier officiel quand tu as peur de l'autorité, une distance soudaine quand tu as peur d'être abandonnée.",
      "**Tu te sens découragée** · « tout ce travail pour rien ». Ce découragement est lui-même un signe."
    ],
    retenir: [
      "Une boucle qui revient n'est pas un échec : c'est une couche plus profonde qui se montre.",
      "La couche profonde est souvent une peur de conséquence : « si j'obtiens ce que je veux, alors… ».",
      "Pour elle, le protocole va jusqu'aux racines, puis se termine par une nouvelle vérité.",
      "Ton outil du module : le réflexe de la couche profonde, et un geste concret dans les quarante-huit heures."
    ],
    question: { k: 'comp-signe', q: "Lequel de ces trois signes as-tu déjà vécu, et à propos de quelle boucle ?", ph: "Exemple : le découragement. Quand mon ex m'a recontactée, je me suis dit que tout mon travail n'avait servi à rien." }
  },

  exercicesIntro: "Les exercices de ton cahier, à remplir ici. Prends la boucle qui revient le plus souvent dans ta vie, et suis-la d'exercice en exercice.",
  exercices: [
    { k: 'm6ex1', type: 'questions', titre: 'La boucle qui revient',
      consigne: "Pense à une boucle sur laquelle tu as déjà travaillé et qui est revenue, ou qui revient régulièrement malgré tes efforts. Décris-la sans te juger.",
      astuce: "Relis ta réponse à la question 3. Si tu y trouves « encore », « toujours », « jamais » ou « case départ », c'est très probablement une couche profonde qui remonte.",
      questions: [
        { k: 'm6ex1-boucle', q: 'La boucle qui revient', ph: 'Exemple : la peur de manquer d’argent.' },
        { k: 'm6ex1-situation', q: 'La dernière fois qu’elle est revenue : la situation exacte', ph: 'Exemple : un courrier qui me demande de rembourser une grosse somme.' },
        { k: 'm6ex1-dit', q: 'Ce que je me suis dit sur le moment', ph: 'Exemple : « Encore ! Je suis revenue à la case départ. »' },
        { k: 'm6ex1-trop', q: 'Ce qui ressemblait presque trop à ma peur', ph: 'Exemple : que ce soit justement l’administration qui me reprenne de l’argent.' },
        { k: 'm6ex1-temps', q: 'Combien de temps j’avais été tranquille avant qu’elle revienne', ph: 'Exemple : quatre mois.', court: true }
      ] },
    { k: 'm6ex2', type: 'questions', titre: 'Mon oignon',
      consigne: "Pour la boucle de l'exercice 1, essaie de retrouver ses couches, de la surface jusqu'à la racine. Si tu ne vois pas encore la racine, laisse la case vide : elle se révélera peut-être plus tard.",
      questions: [
        { k: 'm6ex2-surface', q: 'Couche de surface : la croyance évidente, celle que tu as travaillée en premier. Quand s’est-elle montrée ?', ph: 'Exemple : « L’argent, c’est difficile à gagner. » Dès mon premier emploi.' },
        { k: 'm6ex2-milieu', q: 'Couche intermédiaire : celle qui s’est révélée quand tu as commencé à aller mieux. Quelle situation l’a réveillée ?', ph: 'Exemple : « Si j’en ai trop, on va me le reprendre. » Le courrier de l’administration.' },
        { k: 'm6ex2-racine', q: 'Couche racine : la peur la plus ancienne. De qui vient-elle dans ta lignée ?', ph: 'Exemple : « On ne garde jamais rien. » Mon grand-père, ruiné pendant la guerre.' }
      ] },
    { k: 'm6ex3', type: 'tableau', titre: 'Analyser les couches',
      consigne: "Pour chaque situation où une ancienne boucle est revenue, remplis une ligne. Pour trouver la couche profonde, complète : « J'ai peur que, si j'obtiens ce que je veux, alors… »",
      rangs: 3,
      etiquettes: ['Situation 1', 'Situation 2', 'Situation 3'],
      colonnes: [
        { q: 'La situation', ph: 'Exemple : un courrier me demande de rembourser' },
        { q: 'La couche de surface', ph: 'Exemple : « L’argent, c’est difficile »' },
        { q: 'La couche profonde', ph: 'Exemple : « Les autorités me reprennent ce que j’ai »' },
        { q: 'Son origine', ph: 'Exemple : mon grand-père ruiné pendant la guerre' }
      ] },
    { k: 'm6ex4', type: 'tableau', titre: 'Ma nouvelle vérité',
      consigne: "Pour chaque couche profonde, écris une nouvelle vérité : au présent, à la première personne, simple et crédible pour toi. Lis-la à voix haute : elle doit te faire du bien, et sonner vrai.",
      rangs: 3,
      etiquettes: ['Vérité 1', 'Vérité 2', 'Vérité 3'],
      colonnes: [
        { q: 'La couche profonde', ph: ['Exemple : la peur de l’abandon', 'Exemple : « on me reprend ce que j’ai »', 'Exemple : « réussir, c’est trahir ma famille »'] },
        { q: 'Ma nouvelle vérité', ph: ['Exemple : « Je mérite un amour stable. Je peux m’attacher en sécurité. »', 'Exemple : « Je peux recevoir et garder. »', 'Exemple : « Ma réussite honore ma famille. »'] }
      ],
      apres: { k: 'm6ex4-quotidien', q: 'La phrase que je colle là où je la verrai chaque jour', ph: 'Exemple : « Je peux recevoir et garder », sur le miroir de la salle de bain.' } },
    { k: 'm6ex5', type: 'tableau', titre: 'Mes gestes symboliques',
      consigne: "Pour chaque nouvelle vérité, choisis un geste concret à poser dans les quarante-huit heures. Puis, quand c'est fait, note la date et ce que tu as ressenti.",
      rangs: 3,
      etiquettes: ['Geste 1', 'Geste 2', 'Geste 3'],
      colonnes: [
        { q: 'Ma nouvelle vérité', ph: 'Exemple : je peux recevoir et garder' },
        { q: 'Mon geste', ph: 'Exemple : mettre vingt euros de côté sur un compte séparé' },
        { q: 'Fait le', ph: 'Exemple : le 12' },
        { q: 'Ce que j’ai ressenti', ph: 'Exemple : de la fierté, un peu de peur, puis du calme' }
      ] }
  ],

  outil: {
    titre: 'Le réflexe de la couche profonde',
    intro: "La prochaine fois qu'une boucle que tu croyais réglée revient, voici ton réflexe. Et surtout, le geste dans les quarante-huit heures : c'est là que la boucle s'arrête.",
    etapes: [
      "**Respire trois fois**, et dis à voix haute : « C'est une couche plus profonde, et je suis prête à la traverser. »",
      "**Complète** : « J'ai peur que, si j'obtiens ce que je veux, alors… »",
      "**Remonte le fil** : qui a eu peur de ça dans ma famille ? Puis fais le protocole jusqu'aux racines : « Je te vois, mémoire de… Je comprends que tu étais cachée sous la première couche. Merci de te montrer maintenant, je suis prête à te libérer. » Imagine la lumière qui descend en toi, puis à travers des racines, jusqu'à la personne de ta lignée qui a porté cette peur.",
      "**Écris ta nouvelle vérité**, au présent, et colle-la là où tu la verras.",
      "**Pose un geste concret dans les quarante-huit heures** : régler un dossier dans le calme, mettre une petite somme de côté, accepter une invitation, envoyer ta candidature."
    ],
    note: { k: 'outil-note', q: "Après ton premier essai, note la couche profonde trouvée, ta nouvelle vérité et ton geste.", ph: "Exemple : « si j’ai de l’argent, on me le reprend » · « je peux recevoir et garder » · j’ai appelé la banque pour ouvrir un livret." }
  },

  jours: {
    titre: 'Mon carnet des vagues',
    consigne: "Chaque jour, note si une ancienne boucle a refait surface, à quelle intensité (de 1 à 10), et ce que tu as fait. Au fil des semaines, tu verras les vagues baisser.",
    ph: "Exemple : jalousie quand il a parlé de son ex · intensité 6 (avant : 9) · réflexe de la couche profonde, puis je lui ai dit calmement ce que je ressentais.",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : comment ont évolué tes vagues ?", ph: "Exemple : de 8 à 5 en une semaine. Je me décourage moins vite." }
  },

  avancer: {
    intro: "Chaque couche traversée te rapproche de la racine, et chaque vague est moins haute. Cette page t'aide à voir ce qui t'attend de l'autre côté.",
    lieQ: "Si la racine de ta boucle était libérée, à quoi ressemblerait ta vie dans ce domaine ?",
    liePh: "Exemple : j'ouvre mon courrier sans peur, je mets de l'argent de côté chaque mois, et je le garde."
  },

  allerPlusLoin: [
    { titre: 'Ton suivi « Je me libère »', texte: "Le suivi de ton étape prolonge ce module dans ta lignée : repérer ce qui se rejoue, le rendre avec un rituel, et l'intégrer dans ta vie.", lien: 'mon-suivi-mois.html' },
    { titre: 'Ton carnet « J’avance »', texte: "Le carnet de ton étape t'aide à construire ce que tu veux vivre, pas à pas, avec ton audio du mois.", lien: 'mon-carnet.html' }
  ],

  bilan: [
    { k: 'bilan-echec', q: 'Ce que je croyais être un échec, et que je vois maintenant autrement', ph: 'Exemple : le retour de ma peur de manquer. C’était un étage de plus.' },
    { k: 'bilan-couche', q: 'La couche profonde la plus importante que j’ai découverte', ph: 'Exemple : la peur que l’autorité me reprenne tout.' },
    { k: 'bilan-geste', q: 'Le geste symbolique qui a le plus compté', ph: 'Exemple : appeler l’administration et demander un échéancier.' },
    { k: 'bilan-verite', q: 'Ma nouvelle vérité, telle que je la dis aujourd’hui', ph: 'Exemple : « Je peux recevoir, garder, et demander quand j’ai besoin. »' }
  ],

  suivant: { titre: 'Module 7 · Clé 3 · Remplacer la mémoire', texte: "Remplir l'espace laissé par l'ancienne boucle avec ce que tu veux vraiment vivre. L'outil du module : le petit acte de celle que tu deviens." }
};
