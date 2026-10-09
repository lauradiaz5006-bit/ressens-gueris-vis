/* Genesolia · Le Cercle · Carnet interactif d'octobre 2026 : « Ce qui revient »
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2026-10',
  nomMois: 'octobre 2026',
  moisSuivant: 'novembre',
  titre: 'Ce qui revient',
  sousTitre: "Repérer la boucle qui se rejoue dans ta vie, et faire le premier pas pour en sortir.",
  pdf: 'assets/cercle/cercle-2026-10-8b31e0c2a4.pdf',
  image: 'assets/cercle/apercu-2026-10.jpg',
  citation: "Ce qui revient n'est pas un échec : c'est une porte qui attend d'être ouverte.",
  audio: '',
  audioCourt: '',

  /* Illustrations déjà présentes sur le site : une en tête de chaque page, et les fonds */
  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-boucle.webp',
      comprendre: 'assets/guide/guide-arbre.webp',
      exercices: 'assets/guide/guide-repete.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/boucle-spirale-mini.jpg', 'La boucle devient spirale le jour où je la regarde.'],
      semaines: ['assets/cartes/aujourdhui-spirale-mini.jpg', 'Aujourd’hui, je choisis la spirale.']
    }
  },

  /* Petits mots de la coach sur chaque page de gauche */
  mots: {
    ouverture: "Dix minutes suffisent. Tu peux remplir la suite plus tard : tout est enregistré au fur et à mesure.",
    theme: "Lis cette page comme une lettre. Rien à faire ici, seulement à reconnaître.",
    comprendre: "Ne cherche pas la réponse parfaite. Écris ce qui vient, même si ça te semble flou.",
    exercices: "Un exercice par semaine suffit. Le premier se fait en vingt minutes, au calme, avec une boisson chaude.",
    rituel: "Le rituel se fait en moins d’une minute. La méditation, une fois dans le mois, un soir tranquille.",
    semaines: "Une petite case cochée chaque semaine vaut mieux qu’un grand plan jamais commencé.",
    cloture: "Prends ce moment même si tout n’a pas été fait. C’est souvent là qu’on voit le chemin parcouru."
  },

  theme: {
    titre: 'Le mois du premier pas',
    texte: [
      "Octobre, la rentrée est passée, les jours raccourcissent. C'est souvent à ce moment de l'année que l'on remarque ce qui ne change pas : la même fatigue, la même dispute, le même type de relation, la même peur qui revient alors qu'on pensait l'avoir laissée derrière soi.",
      "Ce premier carnet du Cercle t'invite à faire une chose simple et courageuse : regarder ce qui revient, sans te juger. Pas pour tout comprendre tout de suite, mais pour commencer à voir. On ne sort pas d'une boucle qu'on ne voit pas. Une fois qu'on la voit, on n'y entre plus tout à fait de la même façon."
    ],
    sousTitre: 'La boucle et la spirale',
    texte2: [
      "Une boucle, c'est une situation qui se répète avec les mêmes réactions : on se retrouve au même endroit, avec d'autres personnes, dans d'autres décors. Elle s'est souvent installée pour te protéger, à un moment de ta vie ou de l'histoire de ta famille. Elle a été utile. Elle ne l'est peut-être plus.",
      "Dans une spirale, le même thème revient, mais tu le reconnais plus tôt, et tu réagis autrement. Tu avances, même si le décor semble identique. Sortir de la boucle, ce n'est pas faire disparaître le thème : c'est monter d'un cran à chaque passage. Pour aller plus loin : [la méthode des deux cycles](methode.html).",
      "Ce mois-ci, tu vas **repérer** ta boucle, **comprendre** dans quel cycle elle se joue, et **poser** un premier geste différent."
    ],
    exemplesTitre: 'À quoi ressemble une boucle, au quotidien',
    exemples: [
      "**Au travail** : tu dis oui à une tâche de plus alors que tu es déjà débordé·e, puis tu en veux à tout le monde, et surtout à toi.",
      "**En amour** : tu t’attaches à quelqu’un qui n’est jamais tout à fait disponible, et tu attends, encore, qu’il ou elle choisisse enfin.",
      "**En famille** : au repas du dimanche, la même remarque te pique, tu te tais, et tu rumines pendant tout le trajet du retour.",
      "**Avec l’argent** : chaque fois qu’un peu d’argent arrive, une dépense imprévue l’emporte, et tu te retrouves à recompter à la fin du mois.",
      "**Avec toi-même** : tu commences un projet avec enthousiasme, puis tu t’arrêtes au même endroit, juste avant que ça devienne visible."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Ta collègue te demande encore un service le vendredi à 17 h. La boucle aurait dit oui en soupirant. La spirale remarque la chaleur dans la poitrine, respire, et répond : « Je peux lundi matin. » Le thème est le même, ta place a changé.",
    question: { k: 'theme-revient', q: "En une phrase, qu’est-ce qui revient dans ta vie en ce moment ?", ph: "Exemple : je finis toujours par tout porter seul·e, au travail comme à la maison." }
  },

  comprendre: {
    titre: 'La racine ou le cœur',
    texte: [
      "Ce qui se répète dans une vie touche presque toujours l'un de deux besoins. Le **cycle de la racine** parle de sécurité : ta place, ton toit, ton argent, le droit d'exister et d'avoir des besoins. Le **cycle du cœur** parle de lien : aimer, être aimé·e, faire confiance, poser tes limites sans avoir peur de perdre l'autre.",
      "Une boucle de la racine ressemble souvent à la peur de manquer, au besoin de tout contrôler, à la difficulté de prendre ta place. Une boucle du cœur ressemble à des relations qui finissent toujours pareil, à donner beaucoup pour être choisi·e, à partir avant d'être quitté·e. Voir aussi : [les schémas répétitifs en amour](schemas-repetitifs-en-amour.html).",
      "Les deux se mêlent souvent, et c'est normal. On commence en général par la racine : tant qu'on ne se sent pas en sécurité, il est difficile d'aimer librement. Repère simplement lequel des deux te parle le plus aujourd'hui. Le [parcours guidé](parcours.html) peut t'aider à le voir."
    ],
    reperes: [
      { titre: 'Ça ressemble à la racine si…', points: [
        "tu gardes toujours un peu d’argent « au cas où », même quand tu aurais besoin de te faire plaisir ;",
        "tu as du mal à demander une augmentation, un rendez-vous, un coup de main ;",
        "tu te sens obligé·e de tout vérifier, tout prévoir, tout tenir ;",
        "tu as l’impression de devoir mériter ta place, partout."
      ] },
      { titre: 'Ça ressemble au cœur si…', points: [
        "tu dis « ce n’est pas grave » alors que ça l’est pour toi ;",
        "tu sens l’autre s’éloigner au moindre silence, et tu en fais plus pour le retenir ;",
        "tes histoires finissent souvent de la même manière, avec des personnes très différentes ;",
        "tu préfères partir la ou le premier·e, pour ne pas être quitté·e."
      ] }
    ],
    choix: { k: 'cycle', q: "Aujourd'hui, ma boucle touche surtout…", options: ['La racine : ma sécurité, ma place', 'Le cœur : ma façon d’aimer et d’être aimé·e', 'Les deux', 'Je ne sais pas encore'] },
    regarderIntro: "Prends ces cinq questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en faisant la vaisselle ou sous la douche.",
    regarder: [
      { k: 'regarder-1', q: "Quelle situation revient le plus souvent dans ta vie, avec des personnes différentes ?", ph: "Exemple : on me demande beaucoup, je n’ose pas refuser, puis je m’épuise et je me fâche." },
      { k: 'regarder-2', q: "À quel âge l'as-tu vécue pour la première fois ? Que se passait-il alors ?", ph: "Exemple : vers 9 ans, quand ma petite sœur est née et que je devais être « la grande »." },
      { k: 'regarder-3', q: "Qui, dans ta famille, a vécu quelque chose de semblable ?", ph: "Exemple : ma mère, qui s’occupait de toute la famille et ne se plaignait jamais." },
      { k: 'regarder-4', q: "Quelle phrase te dis-tu chaque fois que la boucle démarre ?", ph: "Exemple : « Si je ne le fais pas, personne ne le fera. »" },
      { k: 'regarder-5', q: "Cette boucle touche-t-elle d'abord ta sécurité, ou ta façon d'aimer ? Qu’est-ce qui te le fait penser ?", ph: "Exemple : plutôt ma sécurité, parce que j’ai peur qu’on se passe de moi si je dis non." }
    ],
    enLigneTitre: 'Dans ton arbre en ligne',
    enLigne: "Fais le [test de l'arbre de vie](arbre-de-vie.html) sur genesolia.fr : il te montre en cinq minutes quelles sphères de ta vie sont lumineuses et lesquelles demandent à être nourries. Connecté·e, ton résultat est gardé avec sa date dans Mon chemin : tu pourras le refaire à la fin du mois et voir ce qui a bougé.",
    outils: [
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir les sphères lumineuses et celles à nourrir. Gardé avec sa date dans ton espace : refais-le à la fin du mois.'],
      ['genosociogramme.html', 'Ouvrir mon arbre familial', 'Place les personnes qui ont vécu une situation semblable : l’outil repère les répétitions.'],
      ['questions-a-poser-a-sa-famille.html', 'Les questions à poser à ma famille', 'Pour la semaine 2 : une question à poser à un proche.']
    ]
  },

  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à voir la boucle, le deuxième à entendre ce qu’elle te dit, le troisième à faire autrement. Tu peux les faire dans l’ordre ou commencer par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: 'Ma boucle, trois fois', type: 'tableau', rangs: 3,
      etiquettes: ['La plus ancienne', 'Une autre fois', 'La plus récente'],
      consigne: "Choisis une situation qui revient dans ta vie. Note trois fois où tu l'as vécue, la plus ancienne en premier. Pour chacune, écris quand c'était et avec qui, ce qui s'est passé, puis ce que tu as ressenti et ce que tu as fait. Relis ensuite les trois lignes : qu'est-ce qui se répète, même un détail ?",
      pourquoi: "Quand on écrit trois scènes l’une sous l’autre, le motif apparaît tout seul : un mot, une heure de la journée, un type de personne, la même réaction. C’est ce détail qui te permettra de repérer la boucle plus tôt la prochaine fois.",
      colonnes: [
        { q: "Quand est-ce arrivé, et avec qui ?", ph: ["Exemple : l'été de mes 16 ans, avec mon père, pendant les vacances", "Exemple : à 28 ans, avec ma cheffe, en réunion d’équipe", "Exemple : le mois dernier, avec mon compagnon, chez ses parents"] },
        { q: "Que s’est-il passé ?", ph: ["Exemple : il s’est moqué de ma tenue devant mes cousins", "Exemple : elle a repris mon idée sans me citer", "Exemple : sa mère a critiqué ma cuisine, il n’a rien dit"] },
        { q: "Qu’as-tu ressenti, et qu’as-tu fait ?", ph: ["Exemple : j’ai eu honte, je suis allé·e dans ma chambre sans un mot", "Exemple : j’étais en colère, j’ai souri et je me suis tu·e", "Exemple : je me suis senti·e seul·e, j’ai fait la vaisselle pour m’éloigner"] }
      ],
      apres: { k: 'ex1-repete', q: "Relis tes trois lignes. Qu’est-ce qui se répète, même un détail : un mot, une émotion, un geste, un moment ?", ph: "Exemple : chaque fois, quelqu’un me rabaisse devant d’autres personnes, et je me tais au lieu de dire ce que je pense." } },

    { k: 'ex2', titre: 'Les phrases qui tournent', type: 'blocs', nb: 3,
      consigne: "Chaque boucle a sa petite phrase intérieure : « Je ne suis pas assez », « Il faut tout faire soi-même », « On finit toujours par me quitter »… Attrape trois de tes phrases. Cherche si elles viennent de quelqu'un, puis écris une phrase plus juste, que tu pourras te redire.",
      pourquoi: "Ces phrases tournent si vite qu’on ne les entend plus : elles décident à notre place. Les écrire, c’est les sortir de ta tête pour les regarder en face. Souvent, on s’aperçoit qu’on les a entendues enfant, dans la bouche d’un parent ou d’une grand-mère.",
      astuce: "Une bonne phrase de remplacement est vraie pour toi aujourd’hui. Pas « Je suis parfait·e », mais « J’ai le droit de demander de l’aide ».",
      champs: [
        { q: "Quelle phrase te dis-tu, dans ta tête, quand la boucle démarre ?", ph: ["Exemple : « Je dois me débrouiller seul·e. »", "Exemple : « Je vais encore déranger. »", "Exemple : « De toute façon, ça finit toujours mal. »"] },
        { q: "Qui disait cette phrase, ou une phrase proche, dans ta famille ?", ph: ["Exemple : mon grand-père : « On ne compte que sur soi. »", "Exemple : ma mère : « Ne fais pas de bruit, ton père se repose. »", "Exemple : personne ne la disait, mais ma tante la vivait."] },
        { q: "Quelle phrase plus juste choisis-tu à la place ?", ph: ["Exemple : « J’ai le droit de demander de l’aide. »", "Exemple : « Ma présence compte, je peux prendre de la place. »", "Exemple : « Cette fois peut se passer autrement. »"] }
      ] },

    { k: 'ex3', titre: 'Le geste différent', type: 'texte',
      consigne: "Sortir d'une boucle commence par un tout petit geste différent, au moment précis où elle se déclenche : respirer avant de répondre, dire « je reviens vers toi demain », demander au lieu d'attendre, partir faire un tour. Choisis ton geste, écris-le, puis note chaque fois que tu l'as essayé, même maladroitement, et ce qui a changé.",
      pourquoi: "On ne change pas une boucle en une fois, on la change en y glissant un grain de sable. Plus le geste est petit, plus il est facile à faire au moment où l’émotion monte.",
      gestes: ["Respirer trois fois avant de répondre", "Dire « je te réponds demain »", "Demander au lieu d’attendre qu’on devine", "Sortir marcher dix minutes", "Écrire ce que tu ressens avant d’envoyer un message", "Dire « non, pas cette fois », sans te justifier"],
      q: "Ton geste différent : « La prochaine fois que ma boucle démarre, au lieu de…, je vais… »",
      ph: "Exemple : au lieu de dire oui tout de suite, je vais dire « je regarde mon agenda et je te réponds ce soir ».",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as essayé, même maladroitement : quand, et qu’est-ce qui a changé ?", ph: "Exemple : mardi, au travail, j’ai demandé un délai, et on me l’a donné sans souci." } }
  ],

  rituel: {
    titre: 'La main suspendue',
    intro: "Ce rituel symbolique t'aide à interrompre la boucle au moment où elle commence. Entraîne-toi une première fois au calme, puis utilise-le dans la vie, quand tu sens la vieille réaction monter. Il dure moins d'une minute.",
    materiel: "Rien, juste ta main. Pour le premier essai, ce carnet et un stylo.",
    quand: "Dans la vie, ça peut être au moment où le nom de ta mère s’affiche sur ton téléphone, quand un collègue te coupe la parole, ou quand tu sens que tu vas encore dire oui. Personne n’a besoin de voir ta main : sous la table ou dans ta poche, elle fonctionne aussi.",
    etapes: [
      "Repère le signal : une chaleur, une gorge serrée, une phrase qui revient. C'est le début de la boucle.",
      "Lève doucement une main devant toi, paume ouverte, comme pour dire « pause ». Garde-la suspendue.",
      "Respire trois fois, lentement, en regardant ta main.",
      "Dis intérieurement : « Je reconnais cette boucle. Elle m'a protégé·e. Aujourd'hui, je peux choisir autrement. »",
      "Pose ta main sur ton cœur, ou sur ton ventre, et choisis ton geste différent, même tout petit.",
      "Le soir, note ici ce qui s'est passé : ce que tu as fait, et ce que tu as ressenti."
    ],
    note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : le moment, ce que tu as fait, ce que tu as ressenti.", ph: "Exemple : jeudi soir, au téléphone avec ma sœur. J’ai posé ma main sur ma cuisse, j’ai respiré, et j’ai dit que je la rappellerais. Je me suis senti·e plus calme, un peu fier·e." }
  },

  meditation: {
    titre: 'Sortir du pilote automatique',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens le poids de ton corps sur le siège. Sens tes pieds sur le sol. Tu n'as rien à faire, nulle part où aller. Juste être là.",
      "Laisse venir à ton esprit la situation qui revient dans ta vie. Ne plonge pas dedans : regarde-la de loin, comme un film projeté sur un mur, au fond d'une salle. Tu es assis·e dans un fauteuil, au calme.",
      "[pause]",
      "Observe la scène. Les personnages, le décor, les mots. Remarque le moment précis où tout bascule, où la vieille réaction se met en route, comme un pilote automatique.",
      "Maintenant, imagine que tu as dans la main une petite télécommande. Appuie sur « pause ». L'image se fige. Tout s'arrête. Respire.",
      "[longue pause]",
      "Dans cette image figée, regarde la personne que tu étais. Avec douceur. Elle faisait de son mieux, avec ce qu'elle avait appris. Tu peux lui dire intérieurement : « Je te vois. Tu n'es plus seul·e. »",
      "Et maintenant, imagine une autre suite. Juste un petit geste différent : un mot, un silence, un pas de côté. Regarde la scène repartir avec ce geste. Vois comment elle change, même un peu.",
      "[pause]",
      "Garde cette image en toi. C'est une graine. Tu pourras la retrouver chaque fois que la boucle reviendra.",
      "Respire profondément. Sens à nouveau ton corps, le sol, l'air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes : le soir avant de dormir, ou un dimanche matin. Si tu t’endors, ce n’est pas grave : ton corps avait besoin de repos, recommence un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Une image, un souvenir, une sensation, un mot…", ph: "Exemple : j’ai revu la cuisine de ma grand-mère, et j’ai eu envie de dire « stop » à voix haute." }
  },

  semaines: [
    { titre: 'Repérer', texte: "Chaque fois que ta boucle se présente, même un peu, note-le ici : le jour, la situation, le premier signal dans ton corps.",
      exemple: "Par exemple : « Lundi, 8 h 40, message de ma cheffe, ventre serré, j’ai répondu en deux minutes alors que je prenais mon café. » Pas besoin de changer quoi que ce soit cette semaine : voir suffit.",
      ph: "Exemple : lundi, réunion, gorge serrée quand on m’a demandé mon avis. Jeudi, dîner chez ma mère, même sensation." },
    { titre: 'Comprendre', texte: "Remplis « Ma boucle, trois fois » et « Les phrases qui tournent ». Pose une question à un membre de ta famille sur une situation semblable vécue avant toi : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
      exemple: "Par exemple, au téléphone avec ta tante : « Est-ce que mamie disait souvent non, elle ? » Une seule question suffit. Note sa réponse, même si elle te paraît sans importance.",
      ph: "Exemple : j’ai demandé à ma mère comment sa propre mère faisait avec l’argent. Elle m’a raconté qu’elle cachait des billets dans une boîte à sucre." },
    { titre: 'Essayer', texte: "Pratique la main suspendue au calme, puis dans la vie. Essaie ton geste différent au moins une fois, et note ce qui se passe.",
      exemple: "Par exemple : entraîne-toi deux fois le lundi soir, au calme, puis essaie pour de vrai dans la semaine. Si tu oublies et que la boucle se rejoue, ce n’est pas raté : remarque-le après coup, c’est déjà un pas.",
      ph: "Exemple : mercredi, j’ai dit « je te rappelle demain » au lieu de céder. Je tremblais un peu, et rien de grave n’est arrivé." },
    { titre: 'Ancrer', texte: "Refais le [test de l’arbre de vie](arbre-de-vie.html) et compare avec ton premier résultat dans [ton espace](login.html#mon-chemin). Note ce qui a bougé, même un peu.",
      exemple: "Par exemple : la sphère du lien est passée de 4 à 5. Un point, c’est un vrai mouvement. Remercie-toi pour ce que tu as osé ce mois-ci, puis passe à ton bilan.",
      ph: "Exemple : je reconnais ma boucle plus tôt. Je la vois venir dès le premier message." }
  ],

  /* Les questions du bilan de fin, propres au mois (le moteur ajoute les questions communes à tous les mois) */
  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-boucle', q: "Quelle boucle as-tu repérée ce mois-ci ?", ph: "Exemple : dire oui à tout le monde, puis m’épuiser et en vouloir aux autres." },
    { k: 'fin-origine', q: "Qu’as-tu compris de son origine, dans ton histoire ou dans celle de ta famille ?", ph: "Exemple : chez nous, les femmes tenaient la maison sans jamais se plaindre. J’ai appris très tôt à faire pareil." },
    { k: 'fin-geste', q: "Quel geste différent as-tu osé, et qu’est-ce qu’il a changé ?", ph: "Exemple : j’ai demandé un délai à ma cheffe. Elle a dit oui, et j’ai passé un week-end tranquille." },
    { k: 'fin-intention', q: "Quelle est ton intention pour novembre ?", ph: "Exemple : continuer à dire « je te réponds demain », et écouter les histoires de ma famille.", court: true }
  ],

  /* Les prochains carnets du Cercle */
  aVenir: [
    { mois: 'Novembre', titre: 'Ceux qui sont venus avant toi', texte: "Honorer tes ancêtres, reconnaître ce qu’ils t’ont transmis, et rendre avec respect ce qui ne t’appartient pas.", image: 'assets/cercle/apercu-2026-11.jpg' },
    { mois: 'Décembre', titre: 'Les fêtes et les places à table', texte: "Observer qui s’assoit où, honorer les absent·es, et trouver ta juste place au cœur des fêtes.", image: 'assets/guide/guide-cadeau.webp' },
    { mois: 'Janvier', titre: 'Ton prénom, ton héritage', texte: "Découvrir l’histoire de ton prénom, ce qu’il porte de ta lignée, et en faire pleinement le tien.", image: 'assets/guide/guide-transmission.webp' }
  ]
};
