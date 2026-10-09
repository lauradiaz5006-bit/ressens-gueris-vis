/* Genesolia · Le Cercle · Carnet interactif d'octobre 2026 : « Ce qui revient »
   Même contenu que le carnet PDF, avec des liens vers les outils et des zones à remplir.
   Le texte accepte **gras** et [lien](page.html). */
window.GENESOLIA_CARNET = {
  mois: '2026-10',
  nomMois: 'octobre 2026',
  moisSuivant: 'novembre',
  titre: 'Ce qui revient',
  sousTitre: "Repérer la boucle qui se rejoue dans ta vie, et faire le premier pas pour en sortir.",
  pdf: 'assets/cercle/cercle-2026-10-8b31e0c2a4.pdf',
  image: 'assets/cercle/apercu-2026-10.jpg',
  citation: "Ce qui revient n'est pas un échec : c'est une porte qui attend d'être ouverte.",

  theme: {
    titre: 'Le mois du premier pas',
    texte: [
      "Octobre, la rentrée est passée, les jours raccourcissent. C'est souvent à ce moment de l'année que l'on remarque ce qui ne change pas : la même fatigue, la même dispute, le même type de relation, la même peur qui revient alors qu'on pensait l'avoir laissée derrière soi.",
      "Ce carnet t'invite à faire une chose simple et courageuse : regarder ce qui revient, sans te juger. Pas pour tout comprendre tout de suite, mais pour commencer à voir. On ne sort pas d'une boucle qu'on ne voit pas. Une fois qu'on la voit, on n'y entre plus tout à fait de la même façon."
    ],
    sousTitre: 'La boucle et la spirale',
    texte2: [
      "Une boucle, c'est une situation qui se répète avec les mêmes réactions : on se retrouve au même endroit, avec d'autres personnes, dans d'autres décors. Elle s'est souvent installée pour te protéger, à un moment de ta vie ou de l'histoire de ta famille. Elle a été utile. Elle ne l'est peut-être plus.",
      "Dans une spirale, le même thème revient, mais tu le reconnais plus tôt, et tu réagis autrement. Tu avances, même si le décor semble identique. Sortir de la boucle, ce n'est pas faire disparaître le thème : c'est monter d'un cran à chaque passage. Pour aller plus loin : [la méthode des deux cycles](methode.html).",
      "Ce mois-ci, tu vas **repérer** ta boucle, **comprendre** dans quel cycle elle se joue, et **poser** un premier geste différent."
    ]
  },

  comprendre: {
    titre: 'La racine ou le cœur',
    texte: [
      "Ce qui se répète dans une vie touche presque toujours l'un de deux besoins. Le **cycle de la racine** parle de sécurité : ta place, ton toit, ton argent, le droit d'exister et d'avoir des besoins. Le **cycle du cœur** parle de lien : aimer, être aimé·e, faire confiance, poser tes limites sans avoir peur de perdre l'autre.",
      "Une boucle de la racine ressemble souvent à la peur de manquer, au besoin de tout contrôler, à la difficulté de prendre ta place. Une boucle du cœur ressemble à des relations qui finissent toujours pareil, à donner beaucoup pour être choisi·e, à partir avant d'être quitté·e. Voir aussi : [les schémas répétitifs en amour](schemas-repetitifs-en-amour.html).",
      "Les deux se mêlent souvent, et c'est normal. On commence en général par la racine : tant qu'on ne se sent pas en sécurité, il est difficile d'aimer librement. Le [parcours guidé](parcours.html) t'aide à repérer lequel des deux te parle le plus aujourd'hui."
    ],
    choix: { k: 'cycle', q: "Aujourd'hui, ma boucle touche surtout…", options: ['La racine : ma sécurité, ma place', 'Le cœur : ma façon d’aimer et d’être aimé·e', 'Les deux', 'Je ne sais pas encore'] },
    regarder: [
      ['regarder-1', "Quelle situation revient le plus souvent dans ta vie, avec des personnes différentes ?"],
      ['regarder-2', "À quel âge l'as-tu vécue pour la première fois ?"],
      ['regarder-3', "Qui, dans ta famille, a vécu quelque chose de semblable ?"],
      ['regarder-4', "Quelle phrase te dis-tu chaque fois que la boucle démarre ?"]
    ],
    outils: [
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir les sphères lumineuses et celles à nourrir. Gardé avec sa date dans ton espace : refais-le à la fin du mois.'],
      ['genosociogramme.html', 'Ouvrir mon arbre familial', 'Place les personnes qui ont vécu une situation semblable : l’outil repère les répétitions.'],
      ['questions-a-poser-a-sa-famille.html', 'Les questions à poser à ma famille', 'Pour la semaine 2 : une question à poser à un proche.']
    ]
  },

  exercices: [
    { k: 'ex1', titre: 'Ma boucle, trois fois', type: 'tableau', colonnes: ['Quand, avec qui', 'Ce qui s’est passé', 'Ce que j’ai ressenti, ce que j’ai fait'], rangs: 3,
      consigne: "Choisis une situation qui revient dans ta vie. Note trois fois où tu l'as vécue, la plus ancienne en premier. Relis ensuite les trois lignes : qu'est-ce qui se répète, même un détail ?",
      apres: { k: 'ex1-repete', q: 'Ce qui se répète dans les trois' } },
    { k: 'ex2', titre: 'Les phrases qui tournent', type: 'blocs', nb: 3,
      champs: ['La phrase que je me dis quand la boucle démarre', 'Qui disait cette phrase, ou une phrase proche, dans ma famille ?', 'La phrase que je choisis à la place'],
      consigne: "Chaque boucle a sa petite phrase intérieure : « Je ne suis pas assez », « Il faut tout faire soi-même », « On finit toujours par me quitter »… Attrape trois de tes phrases. Cherche si elles viennent de quelqu'un, puis écris une phrase plus juste, que tu pourras te redire." },
    { k: 'ex3', titre: 'Le geste différent', type: 'texte', debut: 'La prochaine fois que ma boucle démarre, au lieu de…, je vais…',
      consigne: "Sortir d'une boucle commence par un tout petit geste différent, au moment précis où elle se déclenche : respirer avant de répondre, dire « je reviens vers toi demain », demander au lieu d'attendre, partir faire un tour. Choisis ton geste et écris-le.",
      journal: { k: 'ex3-essais', q: 'Chaque fois que je l’ai essayé (même maladroitement) : quand, et ce qui a changé', n: 6 } }
  ],

  rituel: {
    titre: 'La main suspendue',
    intro: "Ce rituel symbolique t'aide à interrompre la boucle au moment où elle commence. Entraîne-toi une première fois au calme, puis utilise-le dans la vie, quand tu sens la vieille réaction monter. Il dure moins d'une minute.",
    etapes: [
      "Repère le signal : une chaleur, une gorge serrée, une phrase qui revient. C'est le début de la boucle.",
      "Lève doucement une main devant toi, paume ouverte, comme pour dire « pause ». Garde-la suspendue.",
      "Respire trois fois, lentement, en regardant ta main.",
      "Dis intérieurement : « Je reconnais cette boucle. Elle m'a protégé·e. Aujourd'hui, je peux choisir autrement. »",
      "Pose ta main sur ton cœur, ou sur ton ventre, et choisis ton geste différent, même tout petit.",
      "Le soir, note ici ce qui s'est passé : ce que tu as fait, et ce que tu as ressenti."
    ],
    note: { k: 'rituel-note', q: 'Après le rituel, je note' }
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
    note: { k: 'medit-note', q: 'Ce qui m’est venu pendant la méditation' }
  },

  semaines: [
    ['Repérer', "Chaque fois que ta boucle se présente, même un peu, note-le ici : le jour, la situation, le premier signal dans ton corps."],
    ['Comprendre', "Remplis « Ma boucle, trois fois » et « Les phrases qui tournent ». Pose une question à un membre de ta famille sur une situation semblable vécue avant toi : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html)."],
    ['Essayer', "Pratique la main suspendue au calme, puis dans la vie. Essaie ton geste différent au moins une fois, et note ce qui se passe."],
    ['Ancrer', "Refais le [test de l’arbre de vie](arbre-de-vie.html) et compare avec ton premier résultat dans [ton espace](login.html#mon-chemin). Note ce qui a bougé, même un peu."]
  ]
};
