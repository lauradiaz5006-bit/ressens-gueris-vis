/* Genesolia · Le Cercle · Mon suivi « Je me libère » d'octobre 2026 : « Ce qui revient »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2026-10',
  cle: 'suivi-2026-10',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2026-10-8b31e0c2a4.pdf',
  nomMois: 'octobre 2026',
  moisSuivant: 'novembre',
  titre: 'Ce qui revient',
  sousTitre: "Repérer la boucle qui se rejoue dans ta vie, voir d'où elle vient, et faire le premier pas pour en sortir.",
  citation: "Ce qui revient n'est pas un échec : c'est une porte qui attend d'être ouverte.",
  audio: '',
  audioCourt: '',
  saisonLien: "Octobre est le mois où l'arbre lâche ce qui a fini son temps. C'est le bon moment pour regarder ce qui revient dans ta vie, encore et encore, et commencer à le déposer. Pas tout d'un coup : feuille après feuille.",
  intensiteQ: "À quel point ce qui se répète dans ta vie pèse-t-il aujourd’hui ?",
  souhaitPh: "Exemple : cette impression de devoir tout porter seul·e, au travail comme à la maison.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-boucle.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/boucle-spirale-mini.jpg', 'La boucle devient spirale le jour où je la regarde.']
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Tu n’as rien à réussir ce mois-ci, seulement à regarder.",
    theme: "Lis cette page comme une lettre. Rien à faire ici, seulement à reconnaître.",
    voir: "Cette semaine, tu observes sans te corriger. Voir, c’est déjà commencer à sortir.",
    source: "Ne cherche pas la réponse parfaite. Écris ce qui vient, même si ça te semble flou.",
    liberer: "Ce que tu rends ne te quitte pas brutalement : tu le poses, avec respect, et tu respires plus large.",
    remplacer: "Un tout petit geste, répété, vaut mieux qu’une grande résolution jamais tenue.",
    meditation: "Une fois dans le mois, un soir tranquille. Si une émotion monte, reviens simplement à ton souffle.",
    bilan: "Prends ce moment même si tout n’a pas été fait. C’est souvent là qu’on voit le chemin parcouru."
  },

  theme: {
    titre: 'Voir ce qui revient',
    texte: [
      "Octobre, la rentrée est passée, les jours raccourcissent. C'est souvent à ce moment de l'année que l'on remarque ce qui ne change pas : la même fatigue, la même dispute, le même type de relation, la même peur qui revient alors qu'on pensait l'avoir laissée derrière soi.",
      "Ce premier mois de suivi t'invite à faire une chose simple et courageuse : regarder ce qui revient, sans te juger. Pas pour tout comprendre tout de suite, mais pour commencer à voir. On ne sort pas d'une boucle qu'on ne voit pas. Une fois qu'on la voit, on n'y entre plus tout à fait de la même façon."
    ],
    sousTitre: 'La boucle et la spirale',
    texte2: [
      "Une boucle, c'est une situation qui se répète avec les mêmes réactions : on se retrouve au même endroit, avec d'autres personnes, dans d'autres décors. Elle s'est souvent installée pour te protéger, à un moment de ta vie ou de l'histoire de ta famille. Elle a été utile. Elle ne l'est peut-être plus.",
      "Dans une spirale, le même thème revient, mais tu le reconnais plus tôt, et tu réagis autrement. Tu avances, même si le décor semble identique. Sortir de la boucle, ce n'est pas faire disparaître le thème : c'est monter d'un cran à chaque passage. Pour aller plus loin : [la méthode des deux cycles](methode.html).",
      "Ce mois-ci, tu vas **voir** ta boucle, **remonter** à sa source, **libérer** ce qui ne t'appartient pas, et **poser** un premier geste différent."
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

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Ta boucle, sous tes yeux',
      intro: "Cette semaine, tu poses tout sur la table. Tu ne cherches pas encore à changer quoi que ce soit : tu regardes comment ta boucle fonctionne, ce qui la déclenche, et ce que tu fais en pilote automatique.",
      texte: "Commence par l’exercice des trois scènes, au calme, une vingtaine de minutes. Puis, chaque fois que la boucle se présente dans la semaine, même un peu, note-le dans ton journal.",
      exercices: [
        { k: 'ex1', titre: 'Ma boucle, trois fois', type: 'tableau', rangs: 3,
          etiquettes: ['La plus ancienne', 'Une autre fois', 'La plus récente'],
          consigne: "Choisis une situation qui revient dans ta vie. Note trois fois où tu l'as vécue, la plus ancienne en premier. Pour chacune, écris quand c'était et avec qui, ce qui s'est passé, puis ce que tu as ressenti et ce que tu as fait.",
          pourquoi: "Quand on écrit trois scènes l’une sous l’autre, le motif apparaît tout seul : un mot, une heure de la journée, un type de personne, la même réaction. C’est ce détail qui te permettra de repérer la boucle plus tôt la prochaine fois.",
          colonnes: [
            { q: "Quand est-ce arrivé, et avec qui ?", ph: ["Exemple : l'été de mes 16 ans, avec mon père, pendant les vacances", "Exemple : à 28 ans, avec ma cheffe, en réunion d’équipe", "Exemple : le mois dernier, avec mon compagnon, chez ses parents"] },
            { q: "Que s’est-il passé ?", ph: ["Exemple : il s’est moqué de ma tenue devant mes cousins", "Exemple : elle a repris mon idée sans me citer", "Exemple : sa mère a critiqué ma cuisine, il n’a rien dit"] },
            { q: "Qu’as-tu ressenti, et qu’as-tu fait ?", ph: ["Exemple : j’ai eu honte, je suis allé·e dans ma chambre sans un mot", "Exemple : j’étais en colère, j’ai souri et je me suis tu·e", "Exemple : je me suis senti·e seul·e, j’ai fait la vaisselle pour m’éloigner"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis tes trois lignes. Qu’est-ce qui se répète, même un détail : un mot, une émotion, un geste, un moment ?", ph: "Exemple : chaque fois, quelqu’un me rabaisse devant d’autres personnes, et je me tais au lieu de dire ce que je pense." } },
        { k: 'voir-journal', titre: 'Mon journal de la semaine', type: 'texte',
          consigne: "Chaque fois que ta boucle se présente cette semaine, même un peu, note-la le jour même : la situation, le premier signal dans ton corps, ce que tu as fait automatiquement. Vise au moins trois situations.",
          pourquoi: "Le premier signal (une gorge serrée, une chaleur, une phrase qui revient) arrive souvent avant la réaction. Le repérer, c’est gagner une seconde de liberté.",
          q: "Ce que tu remarques, en général, quand ta boucle démarre",
          ph: "Exemple : ça commence toujours par une boule dans le ventre quand quelqu’un hausse le ton.",
          journal: { k: 'voir-sit', n: 6, etiquette: 'Situation', q: "Chaque situation : le jour, ce qui s’est passé, le signal dans ton corps, ta réaction", ph: "Exemple : lundi, 8 h 40, message de ma cheffe, ventre serré, j’ai répondu en deux minutes." } }
      ],
      conseil: "Pas besoin de changer quoi que ce soit cette semaine : voir suffit. Si tu oublies de noter, note le soir, de mémoire. Ce n’est pas un examen." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'D’où vient ta boucle',
      intro: "Une boucle ne vient jamais de nulle part. Elle s’est installée un jour pour te protéger, dans ton enfance ou dans l’histoire de ta famille. Cette semaine, tu remontes le fil, avec douceur.",
      texte: [
        "Ce qui se répète dans une vie touche presque toujours l'un de deux besoins. Le **cycle de la racine** parle de sécurité : ta place, ton toit, ton argent, le droit d'exister et d'avoir des besoins. Le **cycle du cœur** parle de lien : aimer, être aimé·e, faire confiance, poser tes limites sans avoir peur de perdre l'autre.",
        "Une boucle de la racine ressemble souvent à la peur de manquer, au besoin de tout contrôler, à la difficulté de prendre ta place. Une boucle du cœur ressemble à des relations qui finissent toujours pareil, à donner beaucoup pour être choisi·e, à partir avant d'être quitté·e. Les deux se mêlent souvent, et c'est normal. On commence en général par la racine : tant qu'on ne se sent pas en sécurité, il est difficile d'aimer librement."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ton arbre, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en faisant la vaisselle ou sous la douche.",
          pourquoi: "Souvent, on découvre qu’une boucle a déjà été vécue par quelqu’un avant nous, au même âge ou dans la même situation. Le voir change tout : ce n’est plus « mon défaut », c’est une histoire que je peux regarder.",
          choix: { k: 'cycle', q: "Aujourd'hui, ta boucle touche surtout…", options: ['La racine : ma sécurité, ma place', 'Le cœur : ma façon d’aimer et d’être aimé·e', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'regarder-2', q: "À quel âge as-tu vécu cette boucle pour la première fois ? Que se passait-il alors ?", ph: "Exemple : vers 9 ans, quand ma petite sœur est née et que je devais être « la grande »." },
            { k: 'regarder-3', q: "Qui, dans ta famille, a vécu quelque chose de semblable ?", ph: "Exemple : ma mère, qui s’occupait de toute la famille et ne se plaignait jamais." },
            { k: 'regarder-4', q: "Qu’a-t-il ou elle traversé, qui pourrait expliquer cette façon de faire ?", ph: "Exemple : ma grand-mère a perdu sa mère à 12 ans, elle a dû tenir la maison seule." },
            { k: 'regarder-5', q: "Cette boucle t’a-t-elle protégé·e, à un moment ? De quoi ?", ph: "Exemple : être sage et serviable m’évitait les colères de mon père." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur une situation semblable vécue avant toi. Par téléphone, à table, ou par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma tante : « Est-ce que mamie disait souvent non, elle ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a raconté que mamie cachait des billets dans une boîte à sucre. J’ai compris d’où venait ma peur de manquer.", lignes: 3 }
          ] }
      ],
      conseil: "Tu peux placer ces personnes dans [ton arbre familial](genosociogramme.html) : l’outil repère les répétitions de dates, d’âges et de prénoms." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre ce qui ne t’appartient pas',
      intro: "Chaque boucle a sa petite phrase intérieure, souvent entendue enfant, dans la bouche d’un parent ou d’une grand-mère. Cette semaine, tu attrapes tes phrases, tu cherches d’où elles viennent, et tu rends symboliquement ce qui ne t’appartient pas.",
      exercices: [
        { k: 'ex2', titre: 'Les phrases qui tournent', type: 'blocs', nb: 3,
          etiquettes: ['Première phrase', 'Deuxième phrase', 'Troisième phrase'],
          consigne: "Attrape trois phrases qui tournent dans ta tête quand la boucle démarre : « Je ne suis pas assez », « Il faut tout faire soi-même », « On finit toujours par me quitter »… Cherche si elles viennent de quelqu'un, puis écris une phrase plus juste, que tu pourras te redire.",
          pourquoi: "Ces phrases tournent si vite qu’on ne les entend plus : elles décident à notre place. Les écrire, c’est les sortir de ta tête pour les regarder en face.",
          astuce: "Une bonne phrase de remplacement est vraie pour toi aujourd’hui. Pas « Je suis parfait·e », mais « J’ai le droit de demander de l’aide ».",
          champs: [
            { q: "Quelle phrase te dis-tu, dans ta tête, quand la boucle démarre ?", ph: ["Exemple : « Je dois me débrouiller seul·e. »", "Exemple : « Je vais encore déranger. »", "Exemple : « De toute façon, ça finit toujours mal. »"] },
            { q: "Qui disait cette phrase, ou une phrase proche, dans ta famille ?", ph: ["Exemple : mon grand-père : « On ne compte que sur soi. »", "Exemple : ma mère : « Ne fais pas de bruit, ton père se repose. »", "Exemple : personne ne la disait, mais ma tante la vivait."] },
            { q: "Quelle phrase plus juste choisis-tu à la place ?", ph: ["Exemple : « J’ai le droit de demander de l’aide. »", "Exemple : « Ma présence compte, je peux prendre de la place. »", "Exemple : « Cette fois peut se passer autrement. »"] }
          ] }
      ],
      rituel: {
        titre: 'La main suspendue',
        intro: "Ce rituel symbolique t'aide à interrompre la boucle au moment où elle commence. Entraîne-toi une première fois au calme, puis utilise-le dans la vie, quand tu sens la vieille réaction monter. Il dure moins d'une minute. Sous la table ou dans ta poche, ta main fonctionne aussi.",
        etapes: [
          "Repère le signal : une chaleur, une gorge serrée, une phrase qui revient. C'est le début de la boucle.",
          "Lève doucement une main devant toi, paume ouverte, comme pour dire « pause ». Garde-la suspendue.",
          "Respire trois fois, lentement, en regardant ta main.",
          "Dis intérieurement : « Je reconnais cette boucle. Elle m'a protégé·e. Aujourd'hui, je peux choisir autrement. »",
          "Pose ta main sur ton cœur, ou sur ton ventre, et choisis ton geste différent, même tout petit."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : le moment, ce que tu as fait, ce que tu as ressenti.", ph: "Exemple : jeudi soir, au téléphone avec ma sœur. J’ai posé ma main sur ma cuisse, j’ai respiré, et j’ai dit que je la rappellerais. Je me suis senti·e plus calme." }
      },
      conseil: "Si écrire la lettre réveille une émotion forte, fais une pause, bois un verre d’eau, sors marcher. Tu peux la finir un autre jour. Ce qui compte, c’est d’avoir commencé." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Ton geste différent',
      intro: "Tu as vu ta boucle, tu sais d’où elle vient, tu as rendu ce qui ne t’appartenait pas. Cette semaine, tu mets un espace entre ce qui se déclenche et ta réponse, et tu y glisses un geste nouveau.",
      texte: [
        "**La première pause.** Dès que tu sens la boucle arriver, respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois de suite. Puis nomme ce qui se passe, intérieurement : « Je te vois. Je sais d’où tu viens. Aujourd’hui, je peux choisir autrement. »",
        "**Le geste différent.** Sortir d'une boucle commence par un tout petit geste, au moment précis où elle se déclenche. Plus il est petit, plus il est facile à faire quand l’émotion monte."
      ],
      exercices: [
        { k: 'ex3', titre: 'Le geste différent', type: 'texte',
          consigne: "Choisis ton geste, écris-le, puis note chaque fois que tu l'as essayé, même maladroitement, et ce qui a changé. Ce geste devient aussi un appui dans ton carnet « J’avance ».",
          pourquoi: "On ne change pas une boucle en une fois, on la change en y glissant un grain de sable. Chaque essai, même raté, affaiblit le pilote automatique.",
          gestes: ["Respirer trois fois avant de répondre", "Dire « je te réponds demain »", "Demander au lieu d’attendre qu’on devine", "Sortir marcher dix minutes", "Écrire ce que tu ressens avant d’envoyer un message", "Dire « non, pas cette fois », sans te justifier"],
          q: "Ton geste différent : « La prochaine fois que ma boucle démarre, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de dire oui tout de suite, je vais dire « je regarde mon agenda et je te réponds ce soir ».",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as essayé, même maladroitement : quand, et qu’est-ce qui a changé ?", ph: "Exemple : mardi, au travail, j’ai demandé un délai, et on me l’a donné sans souci." } }
      ],
      conseil: "Si tu oublies et que la boucle se rejoue, ce n’est pas raté : remarque-le après coup, c’est déjà un pas. La prochaine fois, tu la verras un peu plus tôt." }
  ],

  meditation: {
    titre: 'Sortir du pilote automatique',
    intro: "Une séance guidée pour regarder ta boucle de loin, comme un film, l’arrêter sur pause, et imaginer une autre suite.",
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
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes : le soir avant de dormir, ou un dimanche matin. Si tu t’endors, ce n’est pas grave : recommence un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une image, un souvenir, une sensation, un mot…", ph: "Exemple : j’ai revu la cuisine de ma grand-mère, et j’ai eu envie de dire « stop » à voix haute." }
  },

  /* ───── Le suivi du cycle 2 « Comment j'aime, et comment aimer plus grand, en accord avec moi » : la cible du cœur ─────
     Le sujet vient de chaque personne (son test et ce qu'elle veut travailler) ; le thème de lignée du mois sert d'angle pour remonter à la source.
     S1 Voir ce qui vient · S2 Ta boucle sous tes yeux · S3 Libérer · S4 Mon geste différent. Tous les textes d'avant sont gardés ; aucune clé changée. */
  coeur: {
    /* Le sujet du mois, proposé au début du suivi (la personne peut aussi garder sa cible ou en écrire une autre) */
    sujetCoeur: 'Ce que je crois mériter en amour',
    /* Ton personnage prend une forme nouvelle chaque mois (dessin, objets, lettre, dialogue…), avec la même trame */
    personnageAngle: { titre: 'Ce mois-ci, ton personnage prend forme par le dessin',
      texte: [
        "Ton personnage peut prendre toutes les formes : une boule, un animal, un nuage, une pierre, une silhouette. Il n’a pas besoin d’être humain. Ce n’est pas toi : tu as des émotions humaines, et ce « truc » qui pèse peut sortir de toi.",
        "En lui donnant une forme, hors de toi, tu passes de « je suis ma blessure » à « je vois ce que je porte ». Chaque mois, tu lui donnes forme d’une nouvelle manière, pour voir ce que tu ressens et évacuer un peu plus de lourdeur.",
        "Si tu préfères les objets au dessin, pose sur une table un objet pour toi et un objet pour ton personnage, et regarde la place et la distance entre vous."
      ] },
    /* Les exercices propres au mois, à faire seul·e (1 ou 2 au plus) : rangés dans la semaine indiquée */
    exercicesDuMois: [
    { k: 'liberer-lettre', semaine: 3, titre: 'La lettre de restitution', type: 'questions',
      consigne: "Écris quelques lignes à la personne de ta famille qui portait cette phrase ou cette boucle avant toi. Tu ne l’enverras pas. Remercie-la pour ce que cette façon de faire lui a permis de traverser, puis rends-lui, avec respect, ce qui ne t’appartient pas.",
      pourquoi: "On ne se libère pas d’une loyauté en la rejetant, mais en la reconnaissant. Remercier, puis rendre, permet de garder l’amour et de laisser le poids.",
      questions: [
        { k: 'lettre-a', q: "À qui écris-tu ?", ph: "Exemple : à ma grand-mère Jeanne", court: true },
        { k: 'lettre-texte', q: "Ta lettre : ce que tu reconnais, ce que tu remercies, ce que tu rends, ce que tu choisis pour toi", ph: "Exemple : Mamie, tu as tenu la maison seule, sans jamais te plaindre. Cette force t’a permis de traverser la guerre. Je la reconnais et je t’en remercie. Je te rends l’idée qu’il faut tout porter sans rien demander. Moi, je choisis d’accepter l’aide qu’on me propose.", lignes: 7 }
      ] }
    ],
    /* « Si tu as peu de temps cette semaine » : trois gestes essentiels par semaine */
    peuDeTemps: [
      ["Écris ta cible du cœur en une phrase.", "Réponds au a. : ce que tu ressens en ce moment dans ton cœur, sur ta cible.", "Pose ta demande de libération (f.), puis note un signe par jour."],
      ["Remplis une seule scène de « Ma boucle, trois fois » : la plus récente.", "Dessine ton personnage, même en deux minutes.", "Pose-lui une question : « Pourquoi es-tu là ? », et note sa réponse."],
      ["Attrape une phrase qui tourne et écris la phrase plus juste que tu choisis.", "Dis à ton personnage la phrase de « Laisser partir », à voix haute si tu peux.", "Écoute ta séance de libération du mois, une fois."],
      ["Choisis ton geste différent et écris-le.", "Essaie-le une fois, et note ce qui a changé.", "Place ton curseur : où en est ta question du cœur aujourd’hui ?"]
    ],
    angle: "Ce mois-ci, ta lignée t’éclaire par ce qui revient : les boucles qui se rejouent d’une génération à l’autre.",
    intensiteQ: "À quel point ta question du cœur pèse-t-elle dans ta vie aujourd’hui ?",
    motQ: "En un mot, comment te sens-tu face à ta question du cœur ?",
    souhaitQ: "Qu’aimerais-tu libérer dans ta façon d’aimer ce mois-ci ?",
    souhaitPh: "Exemple : cette peur d’être de trop, qui me fait tout donner pour être choisie.",
    ex1Consigne: "Choisis une situation liée à ta cible du cœur, qui revient dans ta vie. Note trois fois où tu l'as vécue, la plus ancienne en premier. Pour chacune, écris quand c'était et avec qui, ce qui s'est passé, puis ce que tu as ressenti et ce que tu as fait.",
    traverse: { titre: 'Ce qui me traverse',
      intro: "Prends d’abord une feuille et un stylo. Écrire à la main laisse venir ce que la tête ne dit pas. Puis reporte ici l’essentiel, étape par étape, toujours sur ta cible du cœur. Prends ton temps : tu peux le faire en plusieurs fois dans la semaine.",
      ressens: { k: 'traverse-ressens', q: 'a. Ce que je ressens en ce moment dans mon cœur, sur ma cible', ph: 'Exemple : une boule dans la gorge dès qu’il ne répond pas, la peur qu’il me quitte, une grande fatigue d’attendre.' },
      fil: [
        { k: 'traverse-derniere', q: 'b. Quand l’as-tu ressenti pour la dernière fois ? À quel moment ?', ph: 'Exemple : samedi soir, quand il est sorti avec ses amis sans me dire à quelle heure il rentrerait.' },
        { k: 'traverse-avant', q: 'Et avant ?', ph: 'Exemple : avec mon ex, chaque fois qu’il partait en déplacement.' },
        { k: 'traverse-premiere', q: 'Et la toute première fois ?', ph: 'Exemple : vers 6 ans, quand mon père partait des semaines pour son travail et que je l’attendais à la fenêtre.' },
        { k: 'traverse-evenements', q: 'Les événements clés de ma vie autour de ce ressenti', ph: 'Exemple : 6 ans, absences de mon père. 15 ans, divorce de mes parents. 24 ans, première rupture. 31 ans, mon compagnon qui part en déplacement.', lignes: 4 }
      ],
      origine: { k: 'traverse-origine', q: 'c. D’où ça vient, selon toi ?', options: ['Un événement de cette vie', 'Ma lignée : depuis toujours, ou ce qui appartient à mon chemin de vie'] },
      intuition: { titre: 'Si tu connais peu ta famille', texte: "Adoption, famille dispersée, peu d’informations : ce n’est pas un frein. Écris seulement avec ton ressenti et ton intuition, ce qui vient en premier, sans chercher la preuve.", questions: [
        { k: 'traverse-intu-1', q: 'Qui a souffert comme ça dans ma lignée ?', ph: 'Exemple : je sens une femme, peut-être une grand-mère, qui attendait quelqu’un qui n’est jamais revenu.' },
        { k: 'traverse-intu-2', q: 'Que s’est-il passé que j’ignore ?', ph: 'Exemple : un départ à la guerre, un enfant donné, un amour interdit.' },
        { k: 'traverse-intu-3', q: 'Suis-je vraiment la première personne à vivre ça ?', ph: 'Exemple : non, j’ai l’impression que cette peur est plus vieille que moi.' },
        { k: 'traverse-intu-4', q: 'Ce que je porte est-il vraiment à moi ?', ph: 'Exemple : une partie oui, mais cette peur de l’abandon me semble trop grande pour ma seule histoire.' }
      ] },
      evenement: { k: 'traverse-evenement', q: 'e. L’événement qui a créé cette douleur émotionnelle', ph: 'Exemple : l’absence de mon père, et peut-être avant lui, ma grand-mère qui a attendu son mari prisonnier pendant cinq ans.' },
      demande: { titre: 'f. Ma demande de libération',
        texte: "Pose ta main sur ton cœur et dis, à voix haute ou dans ta tête : « Je demande que les réponses viennent à moi, avec douceur, au moment juste pour moi. Je suis prêt·e à voir ce qui doit être vu. » Puis lâche, et observe les jours suivants : un rêve, une phrase entendue, un souvenir qui remonte, une coïncidence. Note ce qui arrive : tu en auras besoin la semaine prochaine.",
        k: 'traverse-signes', n: 5, q: 'Ce qui arrive les jours suivants', ph: 'Exemple : mardi, j’ai rêvé de la maison de ma grand-mère. Jeudi, ma mère m’a parlé de mon grand-père sans que je lui demande.' } },
    personnage: { titre: 'Mon personnage',
      intro: "Cette semaine, tu regardes ta douleur de l’extérieur, comme un personnage à côté de toi. Ce n’est pas toi : c’est une part qui s’est installée pour une raison. Ici, tu fais seulement connaissance avec elle. La libération viendra la semaine prochaine.",
      etapes: [
        "Ferme les yeux et pense à ta cible du cœur. Laisse venir l’image de cette douleur comme un personnage qui se tiendrait près de toi.",
        "Donne-lui une forme, une couleur, une taille. Une boule, un animal, une silhouette, un nuage : ce qui vient est juste.",
        "Sur une feuille, dessine-toi, puis dessine ton personnage. Regarde où il se place : devant toi, derrière, sur tes épaules, collé à toi, loin.",
        "Pose-lui des questions, et écris ce qui vient : « Pourquoi es-tu là ? Que crois-tu protéger ? »",
        "Remercie-le simplement d’avoir répondu. Garde ton dessin pour la semaine prochaine."
      ],
      guides: "Si tu en sens le besoin, tu peux demander la présence de tes guides pour te soutenir.",
      questions: [
        { k: 'perso-forme', q: 'Sa forme, sa couleur, sa taille', ph: 'Exemple : une boule grise et lourde, de la taille d’un ballon.', court: true },
        { k: 'perso-place', q: 'Où se place-t-il par rapport à moi ?', ph: 'Exemple : accroché à ma poitrine, un peu sur la gauche.', court: true },
        { k: 'perso-pourquoi', q: '« Pourquoi es-tu là ? » Ce qu’il m’a répondu', ph: 'Exemple : pour que tu ne sois plus jamais surprise par un départ.' },
        { k: 'perso-protege', q: '« Que crois-tu protéger ? » Ce qu’il m’a répondu', ph: 'Exemple : ton cœur, pour qu’il ne se brise pas une deuxième fois.' }
      ],
      piste: { k: 'perso-piste', q: 'Ce qu’il porte, à ton avis (plusieurs réponses possibles)', options: ['Une croyance', 'Une culpabilité', 'Une loyauté envers quelqu’un de ma famille', 'Autre chose'] } },
    laisser: { titre: 'Laisser partir mon personnage',
      intro: "Reprends ton dessin de la semaine dernière. Tu as fait connaissance avec ton personnage, tu sais ce qu’il protégeait. Maintenant, tu peux le remercier et le laisser partir.",
      etapes: [
        "Installe-toi au calme avec ton dessin devant toi. Respire lentement trois fois.",
        "Regarde ton personnage et dis-lui, à voix haute si tu peux : « Je te vois. Je te comprends. Je suis désolé·e pour tout ce qui s’est passé. Je t’aime énormément, tu m’as permis d’avancer. Merci. »",
        "Laisse venir ce qui vient : une émotion, des larmes, un soupir. Tout est bienvenu.",
        "Fais ensuite le protocole de libération du mois, ci-dessous.",
        "Pour finir, observe ton corps : ce qui bouge, ce qui se relâche, et comment la boucle se défait maintenant que tu la vois."
      ],
      questions: [
        { k: 'laisser-corps', q: 'Où ça bouge dans mon corps ?', ph: 'Exemple : ma poitrine s’ouvre, mes épaules descendent.' },
        { k: 'laisser-relache', q: 'Ce qui se relâche', ph: 'Exemple : la boule dans la gorge, et cette impression de devoir surveiller son téléphone.' },
        { k: 'laisser-boucle', q: 'Comment la boucle se défait, maintenant que je la vois', ph: 'Exemple : quand il ne répond pas, je sens la peur arriver, mais je sais qu’elle est vieille. Je respire et j’attends sans paniquer.' }
      ] },
    protocole: null,
    retour: { titre: 'Où en suis-je avec ma question du cœur ?',
      curseur: { k: 'coeur-ou-n', q: 'Aujourd’hui, à quel point ma question du cœur pèse-t-elle ?' },
      questions: [
        { k: 'coeur-ou', q: 'Ce qui a changé dans ma façon d’aimer ce mois-ci', ph: 'Exemple : j’ose dire quand j’ai besoin d’être rassurée, au lieu de bouder.' },
        { k: 'coeur-ou-reste', q: 'Ce qui reste à libérer', ph: 'Exemple : la peur revient encore le soir, quand je suis seule.' }
      ] },
    autel: {
      intention: "Ce mois-ci, ton autel accompagne ta question du cœur : il te rappelle que tu mérites d’être aimé·e tel·le que tu es, et que ce qui a fini son temps peut tomber, comme les feuilles.",
      cueillette: ['Des feuilles rousses et dorées', 'Quelques glands', 'Une branche fine, tombée au sol', 'Une petite pierre en forme de cœur, si tu en trouves une'],
      couleurs: "Des tons chauds d’automne : roux, ambre, or, brun doux. Trois bougies ambre (ou blanches, entourées de feuilles rousses).",
      elements: [
        { nom: 'La terre', texte: 'La petite pierre en forme de cœur, ou une poignée de glands.' },
        { nom: 'L’eau', texte: 'Une petite coupelle d’eau, ou une pomme rouge, pleine de son eau.' },
        { nom: 'Le feu', texte: 'Les trois bougies ambre.' },
        { nom: 'L’air', texte: 'Une plume, ou deux bâtons de cannelle dont le parfum se diffuse.' },
        { nom: 'L’amour que tu te portes', texte: 'Un objet qui te représente avec tendresse : une photo de toi enfant, un bijou que tu aimes, un mot doux écrit pour toi.' }
      ],
      ouverture: "« J’ouvre cet espace pour moi. J’honore l’être de la création que je suis, et je laisse l’amour que je mérite venir jusqu’à moi. »",
      entretien: ['Chaque semaine, allume une bougie quelques minutes et relis ta cible du cœur.', 'Change l’eau ou ajoute une feuille quand tu sens que c’est le moment.', 'Si tu reçois un signe, une réponse, une belle nouvelle, pose un petit objet sur l’autel pour le célébrer.'],
      cloture: "À la fin du mois, remercie ton autel. Rends à la nature ce qui vient d’elle : dépose les feuilles, les glands et la branche au pied d’un arbre. Garde la pierre en forme de cœur si tu le souhaites, ou offre-la à la terre."
    },
    autelPrompt: "Illustration peinte douce, entre aquarelle et peinture numérique, format carré : un petit autel d’automne posé sur une table en bois, feuilles rousses et dorées, glands, bâtons de cannelle, une pomme rouge, trois bougies ambre allumées, une petite pierre en forme de cœur ; lumière chaude de fin d’après-midi, palette prune, vieux rose, or champagne et crème ; aucun texte, aucune personne."
  },

  /* À lire ce mois-ci : 3 articles du blog liés au sujet, en bas du suivi */
  lectures: [
    { lien: 'schemas-repetitifs-en-amour.html', titre: 'Schémas répétitifs en amour', resume: "Toujours le même type de personne, la même fin : repérer ton schéma, et ce que ton histoire familiale peut éclairer." },
    { lien: 'blessure-abandon-relation-amoureuse.html', titre: 'La blessure d’abandon en amour', resume: "La peur d’être quitté·e, le besoin d’être rassuré·e : les signes, l’histoire familiale et des pistes concrètes." },
    { lien: 'loyaute-familiale-invisible.html', titre: 'La loyauté familiale invisible', resume: "Ce que c’est, des exemples concrets, les signes pour la reconnaître et choisir ta propre vie." }
  ],
  /* L'image citation du mois (carrée) : assets/images-mois/2026-10.jpg, à indiquer ici quand elle est prête */
  image: '',

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-boucle', q: "Quelle boucle as-tu repérée ce mois-ci ?", ph: "Exemple : dire oui à tout le monde, puis m’épuiser et en vouloir aux autres." },
    { k: 'fin-origine', q: "Qu’as-tu compris de son origine, dans ton histoire ou dans celle de ta famille ?", ph: "Exemple : chez nous, les femmes tenaient la maison sans jamais se plaindre. J’ai appris très tôt à faire pareil." },
    { k: 'fin-rendu', q: "Qu’as-tu rendu, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : j’ai rendu à ma grand-mère l’idée qu’il faut tout porter. Je me sens plus légère quand je demande de l’aide." },
    { k: 'fin-geste', q: "Quel geste différent as-tu osé, et qu’est-ce qu’il a changé ?", ph: "Exemple : j’ai demandé un délai à ma cheffe. Elle a dit oui, et j’ai passé un week-end tranquille." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en novembre ?", ph: "Exemple : continuer à dire « je te réponds demain », et écouter les histoires de ma famille.", court: true }
  ],

  carnet: {
    titre: 'Mon point de départ',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas : ta roue de la vie, ton objectif du mois et tes petits pas. Reporte ton geste différent dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Novembre', titre: 'Ceux qui sont venus avant toi', texte: "Honorer tes ancêtres, reconnaître ce qu’ils t’ont transmis, et rendre avec respect ce qui ne t’appartient pas.", image: 'assets/cercle/apercu-2026-11.jpg' },
    { mois: 'Décembre', titre: 'Les fêtes et les places à table', texte: "Observer qui s’assoit où, honorer les absent·es, et trouver ta juste place au cœur des fêtes.", image: 'assets/guide/guide-cadeau.webp' },
    { mois: 'Janvier', titre: 'Ton prénom, ton héritage', texte: "Découvrir l’histoire de ton prénom, ce qu’il porte de ta lignée, et en faire pleinement le tien.", image: 'assets/guide/guide-transmission.webp' }
  ]
};
