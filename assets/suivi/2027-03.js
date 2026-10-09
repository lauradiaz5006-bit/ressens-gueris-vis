/* Genesolia · Le Cercle · Mon suivi « Je me libère » de mars 2027 : « Ta place dans la fratrie »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-03',
  cle: 'suivi-2027-03',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-03-ea9f0fd173.pdf',
  nomMois: 'mars 2027',
  moisSuivant: 'avril',
  titre: 'Ta place dans la fratrie',
  sousTitre: "Regarder la place que tu as reçue parmi tes frères et sœurs, et choisir celle que tu veux habiter aujourd’hui.",
  citation: "Chaque enfant naît dans une famille différente, même sous le même toit.",
  audio: '',
  audioCourt: '',
  saisonLien: "Mars, c’est l’élan du printemps et ses giboulées : un grand soleil, puis une averse, puis le soleil encore. Sur la branche, chaque bourgeon sort à sa place, ni avant ni après les autres. C’est le bon moment pour regarder la tienne, parmi tes frères et sœurs, et sentir l’élan de choisir celle que tu veux habiter.",
  intensiteQ: "À quel point le rôle que tu tiens dans ta fratrie pèse-t-il aujourd’hui ?",
  souhaitPh: "Exemple : ce rôle de grande sœur responsable de tout, même à 40 ans.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
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
      theme: ['assets/cartes/ma-place-mini.jpg', "Ma place existe. Je n’ai pas à la mériter."]
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Que tu aies cinq frères et sœurs ou aucun, ta place compte.",
    theme: "Lis cette page comme une lettre. Remarque les rôles dans lesquels tu te reconnais, sans te juger.",
    voir: "Cette semaine, tu observes ta place et ton rôle, au présent comme dans ton enfance. Voir, c’est déjà commencer à choisir.",
    source: "Les fratries de tes parents ont souvent beaucoup à t’apprendre sur la tienne. Prends ton temps.",
    liberer: "Poser un rôle ne veut pas dire abandonner les tiens. Tu peux les aimer autant, en portant moins.",
    remplacer: "Un petit geste différent, à ta juste place, suffit cette semaine. Ta famille s’ajustera, à son rythme.",
    meditation: "Une fois dans le mois, un soir tranquille. Si une émotion monte, reviens à ton souffle : tu peux t’arrêter à tout moment.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Tu as regardé ta place, et c’est déjà la prendre un peu."
  },

  theme: {
    titre: "Regarder ta place parmi les tiens",
    texte: [
      "Mars ramène le printemps. Les bourgeons sortent un à un, chacun à sa place sur la branche. C’est le bon moment pour regarder la tienne : celle que tu occupes parmi tes frères et sœurs, demi-frères et demi-sœurs, ou seul·e si tu es enfant unique.",
      "Aîné·e, cadet·te, benjamin·e : ton rang a souvent dessiné un rôle, des attentes, des alliances et des rivalités. On te l’a parfois répété sans y penser : « c’est toi la grande », « lui, c’est le petit ». Ce mois-ci t’invite à observer cette place avec curiosité, sans reproche, pour mieux voir ce que tu veux en garder.",
      "Tu continues le deuxième temps de ton année de suivi : **Traverser**, de janvier à juin. Après avoir appris à voir ce qui revient, tu traverses un à un les grands fils de ta lignée. Après celui de l’amour en février, voici celui des frères et sœurs."
    ],
    sousTitre: "Rangs, rôles et absents",
    texte2: [
      "En psychogénéalogie, on observe que la place dans la fratrie compte autant que la famille elle-même. L’aîné·e reçoit souvent les responsabilités et les attentes, le ou la benjamin·e la liberté ou la protection, l’enfant du milieu cherche parfois sa place entre les deux. L’enfant unique, lui, porte seul·e tous les regards. À ces rangs s’ajoutent des rôles : le sage, la rebelle, celui qui fait rire, celle qui s’occupe de tout. On les endosse tôt, et on les reprend vite dès qu’on se retrouve en famille.",
      "Une fratrie compte aussi ses absent·es : un frère mort jeune, une sœur jamais née, une grossesse dont on n’a pas parlé. Même invisibles, ces enfants changent souvent la place des autres. Un enfant né peu après un décès peut grandir avec l’impression de devoir compter pour deux. Il arrive aussi que la fratrie de tes parents se rejoue dans la tienne, une génération plus tard. Pour aller plus loin : [la place dans la fratrie](place-dans-la-fratrie.html).",
      "Ce mois-ci, tu vas **voir** ta place et celles de ta lignée, **remonter** aux rôles et aux échos entre les fratries, **poser** ce qui ne t’appartient pas, et **choisir** un geste à ta juste place."
    ],
    exemplesTitre: "À quoi ressemble un rôle de fratrie, au quotidien",
    exemples: [
      "**La grande qui gère** : c’est toujours toi qu’on appelle quand ta mère a un souci de papiers, même si ton frère habite à côté.",
      "**Le petit qu’on ne prend pas au sérieux** : à 35 ans, tu as un métier et deux enfants, et on te demande encore « Tu es sûr de toi ? » à chaque décision.",
      "**L’enfant du milieu invisible** : au repas de famille, la conversation passe au-dessus de toi, et tu finis par débarrasser la table sans rien dire.",
      "**La comparaison qui continue** : ta sœur vient d’acheter une maison, et tu sens revenir le vieux pincement de l’école, quand ses notes étaient affichées sur le frigo.",
      "**Le médiateur** : dès que deux membres de la famille se disputent, tu te retrouves au milieu, à calmer tout le monde, épuisé·e."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Ton père appelle : la chaudière est en panne, « tu peux t’en occuper ? ». La boucle de l’aînée aurait dit oui aussitôt, en annulant sa soirée. La spirale respire, et répond : « Je ne peux pas ce soir. Appelle Julien, il est à dix minutes. » Le thème est le même, ta place a changé.",
    question: { k: 'theme-place', q: "En une phrase, quelle place ou quel rôle tiens-tu encore dans ta fratrie ou ta famille aujourd’hui ?", ph: "Exemple : je suis toujours celle qui organise, prévient tout le monde et règle les problèmes." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "Ta place, sous tes yeux",
      intro: "Cette semaine, tu poses sur la table ta fratrie et celles de tes parents. Tu ne cherches pas encore à changer : tu regardes les rangs, les rôles, les absents, et ce que tu fais en pilote automatique dès que tu es avec les tiens.",
      texte: "Commence par le tableau des fratries, au calme, une vingtaine de minutes. Puis, pendant la semaine, observe-toi chaque fois que tu parles à un frère, une sœur ou un parent, ou que tu parles d’eux.",
      exercices: [
        { k: 'ex1', titre: "Les fratries de ma lignée", type: 'tableau', rangs: 3,
          etiquettes: ['Ma fratrie', 'La fratrie de ma mère', 'La fratrie de mon père'],
          consigne: "Pour chacune de ces trois fratries, note les enfants dans l’ordre des naissances, y compris les enfants disparus ou jamais nés si tu en connais. Puis indique le rôle qu’on donnait à chacun·e, en quelques mots, et ce qui te semble se répéter. Si tu es enfant unique, note-le simplement : c’est une place à part entière.",
          pourquoi: "Quand on pose les fratries côte à côte, des échos apparaissent souvent : une même rivalité entre deux sœurs, un même fils qui part loin, une même aînée qui porte tout. Les voir, c’est comprendre que ton rôle ne vient pas seulement de toi.",
          colonnes: [
            { q: "Qui sont les enfants, dans l’ordre des naissances ?", ph: ["Exemple : moi (1978), Julien (1981), Léa (1986)", "Exemple : un garçon mort à 2 ans, ma mère, puis tante Anne", "Exemple : mon père, enfant unique"] },
            { q: "Quel rôle donnait-on à chacun·e ?", ph: ["Exemple : moi la responsable, Julien le rigolo, Léa le bébé", "Exemple : ma mère devait être sage et ne pas faire de peine", "Exemple : on attendait tout de lui, il devait réussir"] },
            { q: "Qu’est-ce qui te semble se répéter ?", ph: ["Exemple : l’aînée qui s’occupe de tout", "Exemple : une fille qui naît après un deuil, comme moi après une fausse couche", "Exemple : un enfant sur qui reposent tous les espoirs"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis ton tableau. Qu’est-ce qui se répète d’une fratrie à l’autre, même un détail : un rang, un rôle, un départ, un absent ?", ph: "Exemple : dans les trois fratries, la fille aînée garde les plus petits et ne quitte jamais la région." } },
        { k: 'voir-journal', titre: "Mon journal de fratrie", type: 'texte',
          consigne: "Chaque fois que tu es en contact avec un frère, une sœur ou un parent cette semaine (appel, message, repas), ou que tu parles d’eux, note le rôle que tu as pris et ce que tu as fait sans y penser. Vise au moins trois situations.",
          pourquoi: "Un rôle de fratrie se réactive en quelques secondes, souvent dès le premier mot au téléphone. Le remarquer au moment où il se met en route, c’est gagner un peu de liberté.",
          q: "Ce que tu remarques, en général, sur le rôle qui revient",
          ph: "Exemple : dès que ma sœur m’appelle, je prends une voix de maman et je lui donne des conseils qu’elle n’a pas demandés.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque situation : le jour, avec qui, le rôle que tu as pris, ce que tu as ressenti", ph: "Exemple : dimanche, déjeuner chez mes parents. J’ai fait la médiatrice entre mon frère et mon père. J’étais vidée en rentrant." } }
      ],
      conseil: "Si tu as perdu un frère ou une sœur, ou si certains liens sont rompus, avance doucement : tu peux remplir seulement ce qui te semble possible aujourd’hui. Si une émotion forte monte, pose le stylo, respire, et reprends un autre jour." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "D’où vient ton rôle",
      intro: "Un rôle de fratrie ne se choisit pas : il se reçoit, souvent avant même de savoir parler. Cette semaine, tu remontes le fil, avec douceur, pour voir ce qui a dessiné ta place et ce qu’elle doit aux fratries d’avant toi.",
      texte: [
        "La place dans la fratrie touche souvent les deux cycles. Le **cycle de la racine** parle de sécurité : avoir sa place à la table, ne pas être de trop, être utile pour être gardé·e. Le **cycle du cœur** parle de lien : être aimé·e autant que les autres, être vu·e pour ce que l’on est, et pas pour le rôle que l’on tient.",
        "Un rôle de la racine ressemble souvent à « je dois être utile pour avoir ma place » ou « je ne dois pas prendre trop de place ». Un rôle du cœur ressemble à « je dois faire rire pour être aimé·e » ou « je dois réussir pour qu’on me regarde ». Les deux se mêlent. On commence par la racine : se sentir à sa place, c’est la base pour tout le reste."
      ],
      exercices: [
        { k: 'source-arbre', titre: "Dans ton arbre, regarde les fratries", type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en regardant une vieille photo ou en parlant avec un proche.",
          pourquoi: "Souvent, on découvre que l’un de nos parents tenait le même rôle dans sa propre fratrie, ou qu’un enfant absent a changé la place de tous. Le voir change tout : ce n’est plus « mon caractère », c’est une place que je peux regarder et ajuster.",
          choix: { k: 'cycle', q: "Aujourd’hui, ton rôle de fratrie touche surtout…", options: ['La racine : avoir ma place, ne pas être de trop', 'Le cœur : être aimé·e et vu·e pour moi', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-rang', q: "Quel est ton rang, et que disait-on de ta place quand tu étais enfant ?", ph: "Exemple : je suis l’aînée. On me disait « tu es grande, tu dois montrer l’exemple » dès mes 5 ans." },
            { k: 'source-role', q: "Quel rôle t’a-t-on donné enfant, et le portes-tu encore aujourd’hui ?", ph: "Exemple : celle qui console. Aujourd’hui encore, toute ma famille m’appelle quand ça ne va pas." },
            { k: 'source-absent', q: "Y a-t-il un frère ou une sœur disparu·e, ou jamais né·e, dans ta fratrie ou celle de tes parents ?", ph: "Exemple : ma mère a perdu un bébé un an avant ma naissance. On n’en parlait presque jamais." },
            { k: 'source-parents', q: "Quelle place tes parents occupaient-ils dans leur propre fratrie ?", ph: "Exemple : ma mère était aussi l’aînée, elle élevait ses quatre frères pendant que ma grand-mère travaillait." },
            { k: 'source-echo', q: "Quelles rivalités ou alliances reviennent d’une génération à l’autre ?", ph: "Exemple : ma mère et sa sœur ne se parlent plus depuis l’héritage. Avec ma sœur, on se compare sans cesse." }
          ] },
        { k: 'source-question', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un parent ou un proche sur la façon dont il ou elle vivait sa place dans sa propre fratrie. Par téléphone, à table ou par message. Choisis une question ouverte et légère. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à mon père : « Comment c’était, d’être le seul garçon avec trois sœurs ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce qui résonne avec ta propre place ?", ph: "Exemple : il m’a dit qu’on lui demandait toujours de « faire l’homme de la maison » quand son père était absent. Mon frère a vécu exactement la même chose.", lignes: 3 }
          ] }
      ],
      conseil: "Tu peux ajouter dans [ton arbre familial](genosociogramme.html) tous les enfants de chaque fratrie, y compris ceux dont on parle peu, avec leur rang : l’outil repère les répétitions de dates et de places. Pour comprendre les enfants nés après un deuil : [l’enfant de remplacement](enfant-de-remplacement.html)." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "Poser ce qui ne t’appartient pas",
      intro: "Chaque rôle de fratrie t’a apporté quelque chose, et t’a aussi coûté. Cette semaine, tu regardes tes rôles en face, tu choisis ce que tu veux en faire, et tu redonnes symboliquement à chaque enfant de ta fratrie sa place, toi compris·e.",
      exercices: [
        { k: 'ex2', titre: "Mes rôles", type: 'blocs', nb: 3,
          etiquettes: ['Premier rôle', 'Deuxième rôle', 'Troisième rôle'],
          consigne: "Choisis trois rôles que tu as tenus ou tiens encore dans ta famille : la responsable, le médiateur, celle qu’on ne voit pas, celui qui réussit, la rigolote… Pour chacun, écris ce qu’il t’a apporté et ce qu’il te coûte aujourd’hui. Puis décide, simplement, ce que tu veux en faire : le garder, l’alléger, ou le poser. Rien n’est définitif.",
          pourquoi: "Un rôle n’est ni bon ni mauvais : il t’a souvent aidé·e à trouver ta place. Reconnaître ce qu’il t’a apporté permet de le remercier au lieu de le rejeter, puis de décider librement de la place que tu veux lui laisser.",
          astuce: "Alléger un rôle, c’est souvent garder la qualité et laisser la charge. La responsable peut garder son sens de l’organisation, sans tout organiser pour tout le monde.",
          champs: [
            { q: "Quel rôle tiens-tu, ou as-tu tenu, dans ta famille ?", ph: ["Exemple : la responsable, celle qui gère tout", "Exemple : la médiatrice entre mes parents", "Exemple : la sage, qui ne fait jamais de vagues"] },
            { q: "Que t’a-t-il apporté, et que te coûte-t-il aujourd’hui ?", ph: ["Exemple : il m’a rendue autonome et fiable. Il me coûte ma fatigue et mes week-ends.", "Exemple : il m’a appris à écouter. Il me coûte mes propres disputes, que je n’ose jamais avoir.", "Exemple : on m’aimait pour ma gentillesse. Il me coûte ma colère, que je n’exprime jamais."] },
            { q: "Que choisis-tu aujourd’hui : le garder, l’alléger ou le poser ?", ph: ["Exemple : l’alléger. Je garde l’organisation, je laisse les papiers de maman à mon frère une fois sur deux.", "Exemple : le poser. Je ne suis plus la messagère entre mes parents.", "Exemple : l’alléger. Je m’autorise une vague de temps en temps."] }
          ] }
      ],
      rituel: {
        titre: "Les pierres de la fratrie",
        intro: "Ce rituel symbolique te permet de voir chaque enfant à sa place, toi compris·e, et de reprendre la tienne, rien que la tienne. Fais-le une fois cette semaine, après le tableau des fratries et l’exercice des rôles. Compte une quinzaine de minutes.",
        materiel: "Une petite pierre ou un caillou par enfant de ta fratrie, y compris les absents dont tu as connaissance. Ton carnet et un stylo. Si tu es enfant unique, prends une pierre pour toi et une pour l’enfant que tu aurais pu avoir à tes côtés.",
        etapes: [
          "Choisis un moment calme. Pose les pierres devant toi, sans ordre, et respire trois fois profondément.",
          "Prends-les une à une, dans l’ordre des naissances, et nomme chaque enfant à voix haute ou intérieurement.",
          "Aligne-les. Pour les absents, dis : « Tu fais partie de nous, tu as ta place. »",
          "Pose ta main sur ta pierre et dis : « Je prends ma place, rien que ma place. Je vous laisse les vôtres. »",
          "Si tu portes encore le rôle de quelqu’un d’autre, pose doucement une seconde pierre à côté de la sienne et dis : « Je te rends ce qui est à toi. »",
          "Regarde la rangée quelques minutes. Range les pierres ensemble, dans un endroit choisi, et note ce qui est venu ci-dessous."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : ce que tu as ressenti en nommant chaque enfant, et en posant ta main sur ta pierre.", ph: "Exemple : en nommant le bébé que ma mère a perdu, j’ai eu une grande émotion. Sur ma pierre, j’ai senti que j’avais le droit d’être juste moi, et pas deux enfants à la fois." }
      },
      conseil: "Nommer un enfant absent peut réveiller une émotion forte, même si tu ne l’as jamais connu. C’est normal. Fais une pause, bois un verre d’eau, sors marcher. Tu peux finir le rituel un autre jour." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: "Ta juste place",
      intro: "Tu as vu ta place, tu sais d’où vient ton rôle, tu as rendu à chacun·e la sienne. Cette semaine, tu choisis un rôle à alléger et tu poses un petit geste différent, à ta juste place.",
      texte: [
        "**La première pause.** Quand tu sens ton vieux rôle se mettre en route (prendre en charge, faire rire, t’effacer, calmer tout le monde), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis-toi : « Je te reconnais. Je ne suis plus l’enfant que j’étais. Aujourd’hui, je choisis ma place. »",
        "**Le geste à ta juste place.** Tes frères, tes sœurs et tes parents ont l’habitude de ton rôle : ils peuvent être surpris. C’est normal. Un petit geste, répété avec douceur, laisse à chacun le temps de s’ajuster."
      ],
      exercices: [
        { k: 'remplacer-lettre', titre: "La lettre à un frère ou une sœur", type: 'questions',
          consigne: "Écris à un frère ou une sœur, présent·e, éloigné·e, disparu·e ou jamais né·e. Si tu es enfant unique, écris à l’enfant que tu aurais pu avoir à tes côtés. Dis-lui ce que tu as vécu à ta place, ce que tu as compris ce mois-ci, et ce que tu lui souhaites. Cette lettre est pour toi seul·e : tu ne l’enverras pas, sauf si tu en as vraiment envie.",
          pourquoi: "Écrire à un frère ou une sœur, c’est se donner le droit de dire ce qui n’a jamais été dit, sans risque. Souvent, la rivalité ou la distance s’adoucit quand on reconnaît que chacun a grandi à sa place, avec ses propres difficultés.",
          questions: [
            { k: 'lettre-a', q: "À qui écris-tu ?", ph: "Exemple : à mon petit frère Julien", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu as vécu à ta place, ce que tu as compris, ce que tu lui souhaites", ph: "Exemple : Julien, j’ai souvent été jalouse de ta liberté, pendant que je gardais Léa. J’ai compris que toi aussi, tu portais quelque chose : être celui qui fait rire pour détendre l’ambiance. Je te souhaite d’être pris au sérieux, et je me souhaite de souffler un peu.", lignes: 7 }
          ] },
        { k: 'ex3', titre: "Mon geste à ma juste place", type: 'texte',
          consigne: "Choisis un rôle à alléger et un geste concret pour cette semaine. Écris-le, puis note chaque fois que tu l’as posé, même maladroitement, et ce qui a changé. Ce geste rejoint ton carnet « J’avance » : prendre ta juste place, c’est aussi laisser parler ta voix.",
          pourquoi: "Un rôle de fratrie ne se pose pas d’un coup : il s’allège à chaque fois que tu fais un petit pas de côté. Chaque essai montre à ta famille, et à toi, qu’une autre place est possible.",
          gestes: ["Laisser un frère ou une sœur s’occuper d’une chose que tu fais toujours", "Dire « je ne peux pas cette fois » sans te justifier", "Ne pas intervenir dans une dispute qui ne te concerne pas", "Donner ton avis au repas de famille, même si on ne te le demande pas", "Demander de l’aide à un frère ou une sœur", "Raconter toi-même une nouvelle de ta vie, avant qu’on la raconte pour toi"],
          q: "Ton geste : « La prochaine fois que mon vieux rôle se met en route, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de tout organiser pour l’anniversaire de maman, je vais proposer à Léa de s’occuper du gâteau et à Julien du cadeau.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as essayé : quand, et qu’est-ce qui a changé ?", ph: "Exemple : mercredi, j’ai laissé mon frère appeler le plombier pour papa. Il l’a fait, très bien. Je me suis sentie légère et un peu bizarre." } }
      ],
      conseil: "Si ta famille insiste pour que tu reprennes ton rôle, c’est normal : chacun a besoin de temps pour s’habituer. Garde ton geste petit et répète-le avec douceur. Si tu oublies et que le vieux rôle revient, remarque-le après coup : c’est déjà un pas." }
  ],

  meditation: {
    titre: "Le jardin de la fratrie",
    intro: "Une séance guidée pour voir chaque enfant de ta fratrie à sa place, saluer les absents, et sentir les racines de ta propre place.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens le poids de ton corps sur le siège. Sens tes pieds sur le sol. Tu es en sécurité, ici et maintenant. Tu peux revenir à ton souffle à tout moment.",
      "Imagine un jardin au début du printemps. L’air est frais, la lumière douce. Une averse vient de passer, et tout brille. Dans la terre, de jeunes pousses sortent, chacune à sa place.",
      "Tu remarques une rangée de petits arbres. Chacun représente un enfant de ta fratrie. Certains sont grands, d’autres plus fragiles. Il y a peut-être un espace vide, là où un arbre n’a pas poussé.",
      "[pause]",
      "Approche-toi de l’arbre qui est toi. Regarde sa taille, ses branches, ses feuilles. Il a grandi à côté des autres, parfois dans leur ombre, parfois en les protégeant.",
      "Regarde aussi les arbres voisins. Certains ont poussé en se penchant vers toi, d’autres en s’écartant. Il n’y a rien à corriger. Chacun a trouvé comme il a pu son chemin vers la lumière. Si un espace est vide, tu peux y poser doucement ta main et dire intérieurement : « Je te vois. Tu as ta place ici. »",
      "[longue pause]",
      "Reviens vers ton arbre. Sens ses racines dans la terre, profondes et solides. Il n’a pas à prendre la place d’un autre, ni à porter ses branches. Il a juste à pousser vers la lumière.",
      "Remarque un bourgeon nouveau sur l’une de tes branches. Il représente ce que tu veux faire grandir cette année, pour toi, à ta place. Dis-toi : « Ma place existe. Je n’ai pas à la mériter. »",
      "[pause]",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes, le soir ou un dimanche matin. Si l’espace vide d’un enfant absent réveille une émotion forte, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux arrêter la séance et la reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Un arbre, un espace vide, une sensation, un mot…", ph: "Exemple : mon arbre se penchait pour protéger le plus petit. Quand il s’est redressé, j’ai respiré beaucoup plus large." }
  },

  bilanTitre: "Ce que ce mois a remis à sa place",
  bilan: [
    { k: 'fin-role', q: "Quel rôle de fratrie as-tu repéré ce mois-ci ?", ph: "Exemple : celle qui s’occupe de tout et de tout le monde." },
    { k: 'fin-origine', q: "Qu’as-tu compris de son origine, dans ta fratrie ou celles de tes parents ?", ph: "Exemple : ma mère était aussi l’aînée qui élevait ses frères. J’ai repris sa place sans le savoir." },
    { k: 'fin-pose', q: "Quel rôle as-tu posé ou allégé, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : je ne gère plus les papiers de mon père seule. Je me sens moins fatiguée, et plus proche de mon frère." },
    { k: 'fin-place', q: "Quelle place choisis-tu désormais dans ta famille ?", ph: "Exemple : la grande sœur qui aime, qui écoute, mais qui ne porte plus tout." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en avril ?", ph: "Exemple : continuer à laisser la place aux autres, et écouter ce qui ne se dit pas dans ma famille.", court: true }
  ],

  carnet: {
    titre: "Ma voix, ma confiance",
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Ta place dans la fratrie a souvent décidé si tu pouvais parler fort ou si tu devais te taire : ton carnet t’aide ce mois-ci à retrouver ta voix, à te souvenir de tes forces et à oser une phrase d’affirmation chaque semaine. Reporte ton geste à ta juste place dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Avril', titre: 'Les secrets et les non-dits', texte: "Écouter les silences de ta famille, repérer les indices, et oser, à ton rythme, poser une question.", image: 'assets/cartes/ce-silence-mini.jpg' },
    { mois: 'Mai', titre: 'Ta mère, tes mères', texte: "Regarder ce que tu as reçu de ta mère et des femmes de ta lignée, garder le meilleur et faire autrement.", image: 'assets/cartes/ma-mere-mini.jpg' },
    { mois: 'Juin', titre: 'Du côté des pères', texte: "Regarder ce que tu as reçu de ton père et des hommes de ta lignée, et trouver ta propre façon d’avancer.", image: 'assets/cartes/deux-parents-mini.jpg' }
  ]
};
