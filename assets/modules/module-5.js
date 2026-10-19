/* Genesolia · Cycle 2 · Le carnet du module 5 de la formation « Sors de la boucle » : « Clé 1 · Libérer la mémoire »
   Reprend les exercices du cahier PDF du module 5 (assets/formation/cahier-module-5.pdf), en version à remplir.
   Même livre que le module 1 (assets/mon-carnet.js, type 'module').
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le module ouvert), q: la question, ph: l'exemple }.
   Les clés doivent être uniques dans tout le module. */
window.GENESOLIA_CARNET = {
  type: 'module',
  module: 5,
  cle: 'module-5',
  page: 'mon-module.html',
  pdf: 'assets/formation/cahier-module-5.pdf',
  titre: 'Clé 1 · Libérer la mémoire',
  objectifs: { principal: "Libérer l'émotion au moment précis où la boucle se déclenche.", specifique: "Maîtriser le protocole en 5 étapes, puis sa version en 60 secondes, utilisable n'importe où.", bonASavoir: "Au module 4, tu as **déposé** le passé avec tes lettres et le rituel. Ici, tu apprends à **libérer** au moment précis où la boucle se déclenche, avec le protocole en 5 étapes et sa version en 60 secondes, à utiliser n’importe où." },
  sousTitre: "Un protocole en cinq étapes, au moment précis où la boucle se déclenche.",
  citation: "Tu ne peux pas empêcher une mémoire de se réveiller. Mais tu peux choisir ce que tu fais quand elle se réveille.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    pages: {
      ouverture: 'assets/guide/guide-etoiles.webp',
      comprendre: 'assets/guide/guide-repete.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      outil: 'assets/guide/guide-pause.webp',
      avancer: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-spirale-or.webp'
    }
  },

  mots: {
    ouverture: "Au début, tu feras souvent le protocole après coup. C'est normal, et c'est utile : il deviendra plus rapide à chaque fois.",
    comprendre: "Dans chaque boucle, il y a un instant précis entre ce qui arrive et ce que tu fais. C'est cet instant qu'on apprend à habiter.",
    exercices: "Prépare tes phrases à l'avance : le jour où l'alarme sonne, elles seront prêtes.",
    outil: "Si tu n'as même pas soixante secondes, garde au moins les trois respirations.",
    avancer: "Chaque nouvelle réponse dessine la personne que tu veux être.",
    bilan: "Une mémoire qui revient malgré le protocole a simplement plusieurs couches. C'est exactement ce que la clé 2 va t'aider à traverser."
  },

  ouverture: {
    intro: "On entre dans les trois clés. La première est peut-être la plus utile au quotidien : libérer la mémoire au moment précis où elle se déclenche. Commence par écouter le podcast du module dans ton espace de formation, puis reviens ici pour pratiquer.",
    intensiteQ: "À quel point tes réactions automatiques t'embarquent-elles aujourd'hui ?",
    souhaitQ: "Quelle situation déclenche le plus souvent ta réaction automatique ?",
    souhaitPh: "Exemple : quand on me critique au travail, je me justifie pendant dix minutes.",
    envieQ: "Et à la place, qu'aimerais-tu vivre au bout de ce module ? Commence par « J'aimerais… »",
    enviePh: "Exemple : j'aimerais respirer, reconnaître ma peur, et répondre calmement « merci, je vais y réfléchir ».",
    phrasePh: "Exemple : je te vois, mémoire. Je choisis ma réponse."
  },

  comprendre: {
    titre: 'L’instant où tout se joue',
    chapeau: "Dans chaque boucle, il y a une fraction de seconde entre ce qui arrive et ce que tu fais. Une remarque, un message, un regard, une facture. Et juste après, la réaction familière qui part toute seule. C'est dans cet instant que tout se joue.",
    histoire: {
      titre: 'Sandrine, et le message de l’école',
      texte: [
        "Sandrine reçoit un message de l'école : le directeur veut la voir au sujet des résultats de sa fille Léna, douze ans. En une seconde, son ventre se noue, ses joues brûlent. Avant, elle aurait crié, puni, puis pleuré seule.",
        "Cette fois, elle respire trois fois. Elle se demande qui a déjà vécu ça dans sa famille. La réponse arrive : elle-même, à douze ans, et son père qui lui disait « tu es nulle ». Elle dit : « Je te vois, mémoire de honte. Léna n'est pas moi, et je ne suis pas mon père. »",
        "Le soir, au lieu de punir, elle demande à sa fille ce qui est difficile pour elle. Léna se met à pleurer : deux élèves s'en prenaient à elle depuis des semaines. Ces trois minutes de protocole ont peut-être changé la vie de sa fille."
      ]
    },
    texte: [
      "**Les trois clés.** La clé 1, ici : libérer la mémoire au moment où la boucle se déclenche. La clé 2, au module 6 : stopper les répétitions, quand une mémoire revient malgré tout. La clé 3, au module 7 : remplacer la mémoire par quelque chose de neuf.",
      "**Tes alarmes.** Une mémoire qui se réveille se signale par le corps, souvent avant même que tu aies compris. Le cœur s'accélère, la gorge se serre, le ventre se noue, les pensées s'emballent : « encore », « je le savais ». Chacune a les siennes : les épaules qui montent, la mâchoire qui se serre, les mains froides. Les reconnaître, c'est gagner les quelques secondes qui te permettent de choisir."
    ],
    signesTitre: 'Le protocole en cinq étapes',
    signes: [
      "**Respirer** · inspire par le nez en comptant jusqu'à cinq, garde l'air deux secondes, expire par la bouche en comptant jusqu'à sept, comme pour souffler doucement sur une bougie. Au moins trois fois.",
      "**Nommer** · qui a déjà vécu cette situation dans ma famille ? D'où vient cette peur, cette colère, cette honte ? Si rien ne vient, nomme simplement l'émotion : la mémoire de peur, la mémoire de honte.",
      "**Reconnaître** · « Je te vois, mémoire de… Je te reconnais, mémoire de… Merci d'être là. Je choisis d'y mettre fin. » Ton corps voudra encore réagir comme avant : continue simplement de respirer.",
      "**Transformer** · une lumière douce s'allume dans ton cœur et grandit comme un phare. Dirige-la vers la mémoire, comme une fumée sombre, et regarde-la s'élever vers le soleil et s'y dissoudre.",
      "**Réorienter** · de quoi ai-je vraiment besoin ? Quelle réponse correspond à la personne que je veux être ? « Merci pour ton retour, je vais y réfléchir. » « Je prends vingt-quatre heures. »"
    ],
    retenir: [
      "Une mémoire se réveille d'abord dans le corps : ce sont tes alarmes.",
      "Le protocole : respirer, nommer, reconnaître, transformer, réorienter.",
      "Au début, il se fait après coup et prend quelques minutes. Peu à peu, il devient un réflexe.",
      "Ton outil du module, à utiliser dès aujourd'hui : la version de poche, en soixante secondes."
    ],
    question: { k: 'comp-alarme', q: "Quelle est l'alarme que ton corps t'envoie le plus souvent quand ta boucle démarre ?", ph: "Exemple : le ventre qui se noue, puis les joues qui chauffent." }
  },

  exercicesIntro: "Les exercices de ton cahier, à remplir ici. Commence par tes alarmes et tes situations : elles nourrissent tous les exercices suivants.",
  exercices: [
    { k: 'm5ex1', type: 'questions', titre: 'Mes alarmes personnelles',
      consigne: "Repense à la dernière fois que ta boucle s'est déclenchée. Qu'as-tu ressenti, et où ? Note tout ce qui te revient dans chaque zone, même les détails.",
      questions: [
        { k: 'm5ex1-coeur', q: 'Cœur, poitrine', ph: 'Exemple : il accélère, une chaleur, un serrement.', court: true },
        { k: 'm5ex1-gorge', q: 'Gorge, voix', ph: 'Exemple : serrée, bloquée, la voix trop rapide.', court: true },
        { k: 'm5ex1-ventre', q: 'Ventre', ph: 'Exemple : un nœud, un vide, une crispation.', court: true },
        { k: 'm5ex1-epaules', q: 'Épaules, mâchoire, mains', ph: 'Exemple : épaules qui montent, poings serrés.', court: true },
        { k: 'm5ex1-pensees', q: 'Pensées', ph: 'Exemple : « Encore ! », « Je le savais ».', court: true },
        { k: 'm5ex1-emotions', q: 'Émotions', ph: 'Exemple : peur, honte, colère, tristesse.', court: true },
        { k: 'm5ex1-fiable', q: 'Mon alarme la plus fiable, celle qui arrive toujours en premier', ph: 'Exemple : le ventre qui se noue.' }
      ] },
    { k: 'm5ex2', type: 'tableau', titre: 'Mes situations déclencheuses',
      consigne: "Liste les situations qui déclenchent ta boucle, ta réaction automatique, et la mémoire qui s'active peut-être (une personne, une phrase, une croyance). Un point d'interrogation est une réponse acceptée.",
      rangs: 4,
      etiquettes: ['Situation 1', 'Situation 2', 'Situation 3', 'Situation 4'],
      colonnes: [
        { q: 'La situation', ph: ['Exemple : on me critique au travail', 'Exemple : une facture inattendue', 'Exemple : mon compagnon ne répond pas', 'Exemple : ma fille a de mauvaises notes'] },
        { q: 'Ma réaction automatique', ph: ['Exemple : je me justifie pendant dix minutes', 'Exemple : je panique et je vérifie mon compte dix fois', 'Exemple : j’envoie cinq messages', 'Exemple : je crie, puis je culpabilise'] },
        { q: 'La mémoire qui s’active', ph: ['Exemple : « Si je me trompe, je ne vaux rien » (ma grand-mère perfectionniste)', 'Exemple : la peur de manquer de ma mère', 'Exemple : ?', 'Exemple : mon père qui me disait « tu es nulle »'] }
      ] },
    { k: 'm5ex3', type: 'blocs', titre: 'Mes phrases de reconnaissance',
      consigne: "Pour chaque mémoire repérée, prépare ta phrase à l'avance. Tu l'auras ainsi toute prête au moment où tu en auras besoin. Modèle : « Je te vois, mémoire de… Je te reconnais, mémoire de… Merci d'être là. Je choisis d'y mettre fin. »",
      nb: 3,
      etiquettes: ['Mémoire 1', 'Mémoire 2', 'Mémoire 3'],
      champs: [
        { q: 'La mémoire', ph: ['Exemple : la peur de manquer', 'Exemple : la honte de ne pas être à la hauteur', 'Exemple : la peur d’être abandonnée'] },
        { q: 'Ma phrase de reconnaissance', ph: ['Exemple : « Je te vois, mémoire de peur. Je te reconnais, mémoire de ma grand-mère après la guerre. Merci d’être là. Je choisis d’y mettre fin. »', 'Exemple : « Je te vois, mémoire de honte. Je te reconnais, mémoire de mon père. Merci d’être là. Je choisis d’y mettre fin. »', 'Exemple : « Je te vois, mémoire d’abandon. Je te reconnais, mémoire de ma mère quittée. Merci d’être là. Je choisis d’y mettre fin. »'] }
      ] },
    { k: 'm5ex4', type: 'questions', titre: 'Mon protocole complet',
      consigne: "Choisis une situation récente qui t'a marquée, pas la plus difficile. Installe-toi au calme et déroule le protocole, en notant ce qui se passe à chaque étape.",
      questions: [
        { k: 'm5ex4-situation', q: 'La situation', ph: 'Exemple : ma sœur m’a reproché d’être en retard au repas de famille.' },
        { k: 'm5ex4-respirer', q: '1 · Respirer : ce que j’ai ressenti avant et après les trois respirations', ph: 'Exemple : avant, le ventre noué. Après, un peu plus d’espace dans la poitrine.' },
        { k: 'm5ex4-nommer', q: '2 · Nommer : qui a vécu ça dans ma famille ? D’où ça vient ?', ph: 'Exemple : ma mère, toujours critiquée par sa propre mère. La honte.' },
        { k: 'm5ex4-reconnaitre', q: '3 · Reconnaître : ma phrase, et ce qu’elle a fait en moi', ph: 'Exemple : « Je te vois, mémoire de honte. » J’ai senti mes épaules redescendre.' },
        { k: 'm5ex4-transformer', q: '4 · Transformer : l’image qui est venue, la sensation qui a suivi', ph: 'Exemple : une fumée grise qui monte vers le soleil. Puis du calme.' },
        { k: 'm5ex4-reorienter', q: '5 · Réorienter : mon vrai besoin, et la nouvelle réponse que je choisis', ph: 'Exemple : besoin d’être respectée. « Tu as raison, la prochaine fois je préviens. »' }
      ] },
    { k: 'm5ex5', type: 'tableau', titre: 'Ancienne réaction, nouvelle réponse',
      consigne: "Pour chaque situation de l'exercice 2, imagine dès maintenant ta nouvelle réponse. Une phrase simple, concrète, que tu pourrais vraiment dire ou faire.",
      rangs: 4,
      etiquettes: ['Situation 1', 'Situation 2', 'Situation 3', 'Situation 4'],
      colonnes: [
        { q: 'Mon ancienne réaction', ph: ['Exemple : me justifier face à la critique', 'Exemple : paniquer devant une facture', 'Exemple : envoyer cinq messages', 'Exemple : crier sur ma fille'] },
        { q: 'Ma nouvelle réponse', ph: ['Exemple : « Merci pour ton retour. Je vais y réfléchir. »', 'Exemple : respirer, lire la facture en entier, prévoir un échéancier si besoin', 'Exemple : un seul message, puis une activité qui me fait du bien', 'Exemple : « Qu’est-ce qui est difficile pour toi ? »'] }
      ] }
  ],

  outil: {
    titre: 'La version de poche, en soixante secondes',
    intro: "Dans la vraie vie, tu n'as parfois que quelques secondes. Voici la version de poche du protocole, à utiliser dès aujourd'hui. Recopie-la sur une petite carte ou en fond d'écran, et relis-la une fois par jour les premières semaines.",
    etapes: [
      "**Trois respirations**, les pieds bien posés au sol.",
      "**Un mot pour l'émotion** : peur, honte, colère, tristesse.",
      "**Une phrase intérieure** : « Je te vois, mémoire. Ma réponse m'appartient. »",
      "**Une image** : une seule expiration pour souffler la fumée sombre vers le soleil.",
      "**Une question** : « De quoi ai-je besoin, là, tout de suite ? » Et tu réponds à partir de là."
    ],
    note: { k: 'outil-note', q: "Après ton premier essai, note ce qui s'est passé : l'alarme, le mot, et ta réponse.", ph: "Exemple : ventre noué en réunion, « honte », j’ai respiré et j’ai dit : « Je regarde ça et je reviens vers toi. »" }
  },

  jours: {
    titre: 'Mon carnet de la version de poche',
    consigne: "Chaque jour, note une fois où tu as fait la version de poche : l'alarme, le mot pour l'émotion, et ce que tu as répondu à la place de ta réaction habituelle. Et au moins une fois dans la semaine, fais le protocole complet, au calme.",
    ph: "Exemple : ventre noué quand ma sœur m’a reproché d’être en retard · « Honte » · J’ai dit : « Tu as raison, désolée, la prochaine fois je préviens », sans me justifier.",
    fin: { k: 'jours-fin', q: "À la fin de la semaine : qu'est-ce qui a changé, même un tout petit peu ?", ph: "Exemple : je repère mon alarme plus tôt, et deux fois j’ai répondu sans me justifier." }
  },

  avancer: {
    intro: "Chaque fois que tu réponds autrement, tu dessines la personne que tu veux être. Cette page t'aide à la voir plus nettement.",
    lieQ: "Si tu répondais toujours à partir de ton vrai besoin, à quoi ressemblerait ta vie dans la situation qui te déclenche le plus ?",
    liePh: "Exemple : au travail, j'écoute les critiques calmement, je garde ce qui est utile, et je rentre le soir sans ruminer."
  },

  allerPlusLoin: [
    { titre: 'Ton suivi « Je me libère »', texte: "Le suivi de ton étape prolonge ce module dans ta lignée : repérer ce qui se rejoue, le rendre avec un rituel, et l'intégrer dans ta vie.", lien: 'mon-suivi-mois.html' },
    { titre: 'Ton carnet « J’avance »', texte: "Le carnet de ton étape t'aide à construire ce que tu veux vivre, pas à pas, avec ton audio du mois.", lien: 'mon-carnet.html' }
  ],

  bilan: [
    { k: 'bilan-etape', q: 'L’étape du protocole qui m’aide le plus', ph: 'Exemple : nommer. Dès que je dis « mémoire de honte », ça baisse.' },
    { k: 'bilan-premiere', q: 'Une situation où j’ai répondu autrement pour la première fois', ph: 'Exemple : quand ma sœur m’a fait un reproche, je me suis excusée simplement, sans me justifier.' },
    { k: 'bilan-difficile', q: 'Ce qui est encore difficile pour moi', ph: 'Exemple : penser à respirer quand je suis très en colère.' },
    { k: 'bilan-revient', q: 'La mémoire qui revient malgré tout, et que j’emporte dans le module 6', ph: 'Exemple : la peur de manquer, qui revient à chaque facture.' }
  ],

  suivant: { titre: 'Module 6 · Clé 2 · Stopper les répétitions', texte: "Quand une boucle revient malgré tout : descendre jusqu'à sa couche profonde, écrire une nouvelle vérité, et poser un geste dans les quarante-huit heures." }
};
