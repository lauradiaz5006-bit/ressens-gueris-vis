/* Genesolia · Le Cercle · Mon suivi « Je me libère » de décembre 2026 : « Quelle est ma place ? »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2026-12',
  cle: 'suivi-2026-12',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2026-12-ce7016469f.pdf',
  nomMois: 'décembre 2026',
  moisSuivant: 'janvier',
  titre: "Quelle est ma place ?",
  sousTitre: "Racines de ton arbre de vie · Voir la place de chacun·e dans ta famille et ta fratrie, alléger les liens qui pèsent en gardant l’amour, et prendre ta juste place.",
  citation: "Ma juste place est celle où je respire, pleinement moi.",
  audio: '',
  audioCourt: '',
  saisonLien: "Décembre porte la nuit la plus longue de l’année, puis, au solstice, la lumière revient, minute après minute. Pour certain·es, c’est le temps des tables pleines et des anciens rôles qui reviennent vite. Pour d’autres, ces fêtes se vivent seul·e, loin des siens, après une rupture ou avec un manque. Si tu passes ces fêtes seul·e, offre-toi un rituel pour toi : une table dressée juste pour toi, une bougie, un plat que tu aimes, un message à une personne choisie. Tes ancêtres peuvent être présents autrement : un prénom dit à voix haute, une photo, une recette refaite. Dans tous les cas, garde une petite lumière pour toi, et choisis la place où tu te sens bien.",
  intensiteQ: "À quel point ta place dans ta famille, et les liens qui pèsent, comptent-ils pour toi aujourd’hui ?",
  souhaitPh: "Exemple : ce rôle de grande sœur qui organise tout, et ce lien avec ma mère qui me fatigue à chaque appel.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-etoiles.webp',
      theme: 'assets/guide/guide-cadeau.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/aimer-et-choisir-mini.jpg', 'On peut aimer sa famille et choisir autre chose.']
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Que tu aies cinq frères et sœurs ou que tu sois enfant unique, ta place compte.",
    theme: "Lis cette page comme une lettre. Remarque les places et les rôles dans lesquels tu te reconnais, avec bienveillance pour toi.",
    voir: "Cette semaine, tu observes ta place, au présent comme dans ton enfance. Voir, c’est déjà commencer à choisir.",
    source: "Les fratries de tes parents ont souvent beaucoup à t’apprendre sur la tienne. Range chaque information dans son tiroir, et prends ton temps.",
    liberer: "Alléger un lien, c’est garder l’amour et laisser à chacun·e son histoire. Tu avances à ton rythme.",
    remplacer: "Un petit déplacement, à ta juste place, suffit cette semaine. Tes liens s’ajusteront, à leur rythme.",
    meditation: "Une fois dans le mois, un soir tranquille. Si une émotion monte, reviens à ton souffle : tu peux t’arrêter à tout moment.",
    bilan: "Prends ce moment, même si une partie reste à faire. Tu as regardé ta place, et c’est déjà la prendre un peu."
  },

  theme: {
    titre: "Trouver ta juste place",
    texte: [
      "Dans une famille, chacun·e retrouve vite sa place : celle qui organise, celui qui fait rire, celle qui reste discrète, celui qu’on attend. Elle revient en quelques secondes, au téléphone, dans un message, autour d’une table partagée. Ces places viennent souvent de loin : de ton rang parmi tes frères et sœurs, du rang de tes parents dans leur propre fratrie, des liens qui se sont noués et dénoués au fil des années. Et quand ta famille est loin, absente ou en rupture, ta place existe toujours : elle se vit aussi dans tes liens choisis, et dans ta façon d’habiter ta propre vie.",
      "Avec cette étape 3, tu termines les **racines** de ton arbre de vie. Après les prénoms de ta lignée à l’étape 1 et les dons reçus à l’étape 2, tu cherches ta **juste place** : celle où tu te sens bien, à côté des autres, avec des liens qui te nourrissent. De la peur héritée à la vie choisie, trouver ta place est une étape douce et essentielle."
    ],
    sousTitre: "Rangs, rôles et liens",
    texte2: [
      "En psychogénéalogie, on observe que la place dans la fratrie compte beaucoup. L’aîné·e reçoit souvent les responsabilités et les attentes, le ou la benjamin·e la liberté ou la protection, l’enfant du milieu cherche parfois sa place entre les deux. L’enfant unique reçoit tous les regards. À ces rangs s’ajoutent des rôles : le sage, la rebelle, celui qui fait rire, celle qui s’occupe de tout. On les endosse tôt, et on les reprend vite dès qu’on se retrouve en famille.",
      "Certains liens nourrissent, d’autres pèsent : une comparaison qui continue, une alliance qui exclut, un parent qu’on protège, une dispute ancienne. Il arrive aussi que la fratrie de tes parents se rejoue dans la tienne, une génération plus tard. Ce sont des pistes à regarder avec curiosité : tu en gardes ce qui t’éclaire. Pour aller plus loin : [la place dans la fratrie](place-dans-la-fratrie.html).",
      "Si tu vis loin de ta famille, en rupture, ou si tu traverses un deuil, cette étape est aussi pour toi. Ta place se regarde dans ta lignée, dans tes liens choisis (ami·es, voisin·es, collègues) et dans ta relation à toi-même. Les absent·es gardent leur place dans ton histoire, et tu gardes la tienne.",
      "Pendant cette étape, tu vas **explorer** ta place et celles de ta lignée, **comprendre** d’où viennent les rôles en rangeant chaque information dans son tiroir, **transformer** les liens qui pèsent avec ton protocole, puis **intégrer** ta juste place sur ton arbre de vie, par un petit déplacement dans un lien de ta vie."
    ],
    exemplesTitre: "À quoi ressemble une place de famille, au quotidien",
    exemples: [
      "**La grande qui gère** : c’est toujours toi qu’on appelle quand ta mère a un souci de papiers, même si ton frère habite à côté.",
      "**Le petit qu’on protège** : à 35 ans, tu as un métier et deux enfants, et on te demande encore « Tu es sûr de toi ? » à chaque décision.",
      "**L’enfant du milieu discret** : au repas de famille, la conversation passe au-dessus de toi, et tu finis par débarrasser la table en silence.",
      "**La comparaison qui continue** : ta sœur vient d’acheter une maison, et tu sens revenir le vieux pincement de l’école, quand ses notes étaient affichées sur le frigo.",
      "**Le lien qui pèse** : chaque appel de ton père dure une heure et te laisse vidé·e, et tu décroches quand même, par loyauté.",
      "**La place à distance** : tu vis loin des tiens, ou les liens se sont rompus, et pourtant ton vieux rôle revient dès qu’un message arrive, ou avec tes ami·es, quand tu organises tout pour tout le monde."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Un dimanche midi, ta mère t’appelle depuis la cuisine : « Tu viens m’aider ? ». La boucle de l’aînée se serait levée aussitôt, pour toute la soirée. La spirale respire, et répond : « Je viens pour le dessert. Léa, tu peux aller aider maman ? » Le lien reste tendre, ta place a changé.",
    question: { k: 'theme-place-dec', q: "En une phrase, quelle place ou quel rôle tiens-tu aujourd’hui dans ta famille ou ta fratrie ?", ph: "Exemple : je suis toujours celle qui organise, prévient tout le monde et règle les problèmes." }
  },

  semaines: [
    { cle: 'voir', nom: 'Explorer', etape: 'Explorer', titre: "Ta place, sous tes yeux",
      intro: "Cette semaine, tu poses sur la table ta fratrie, celles de tes parents, et les liens qui comptent pour toi. Tu explores : tu regardes les rangs, les rôles, et ce que tu fais en pilote automatique dès que tu es avec les tiens.",
      texte: "Commence par le tableau des fratries, au calme, une vingtaine de minutes. Puis, pendant la semaine, observe-toi chaque fois que tu échanges avec un frère, une sœur, un parent, ou une personne qui compte pour toi, et note ce que le lien t’apporte ou te coûte.",
      exercices: [
        { k: 'fratries-dec', titre: "Les fratries de ma lignée", type: 'tableau', rangs: 3,
          etiquettes: ['Ma fratrie', 'La fratrie de ma mère', 'La fratrie de mon père'],
          consigne: "Pour chacune de ces trois fratries, note les enfants dans l’ordre des naissances, avec les enfants disparus si tu en connais. Puis indique le rôle qu’on donnait à chacun·e, en quelques mots, et ce qui te semble se répéter. Si tu es enfant unique, note-le simplement : c’est une place à part entière. Si ta famille est recomposée ou adoptive, pars de la famille qui t’a élevé·e, de celle dont tu es issu·e, ou des deux.",
          pourquoi: "Quand on pose les fratries côte à côte, des échos apparaissent souvent : une même aînée qui porte tout, un même fils qui part loin, une même comparaison entre deux sœurs. Les voir, c’est comprendre que ton rôle vient aussi de ton histoire familiale.",
          colonnes: [
            { q: "Qui sont les enfants, dans l’ordre des naissances ?", ph: ["Exemple : moi (1978), Julien (1981), Léa (1986)", "Exemple : ma mère, puis tante Anne, puis oncle Paul", "Exemple : mon père, enfant unique"] },
            { q: "Quel rôle donnait-on à chacun·e ?", ph: ["Exemple : moi la responsable, Julien le rigolo, Léa le bébé", "Exemple : ma mère devait être sage et aider à la maison", "Exemple : on attendait tout de lui, il devait réussir"] },
            { q: "Qu’est-ce qui te semble se répéter ?", ph: ["Exemple : l’aînée qui s’occupe de tout", "Exemple : la cadette qui part vivre loin", "Exemple : un enfant sur qui reposent tous les espoirs"] }
          ],
          apres: { k: 'fratries-dec-repete', q: "Relis ton tableau. Qu’est-ce qui se répète d’une fratrie à l’autre, même un détail : un rang, un rôle, un départ ?", ph: "Exemple : dans les trois fratries, la fille aînée garde les plus petits et reste près des parents." } },
        { k: 'liens-journal-dec', titre: "Mon journal des liens", type: 'texte',
          consigne: "Chaque fois que tu es en contact avec un frère, une sœur ou un parent cette semaine (appel, message, visite, repas), note le rôle que tu as pris, et si le lien t’a nourri·e ou t’a pesé. Si tes contacts avec ta famille sont rares en ce moment, observe tes liens choisis : ami·es, voisin·es, collègues. Vise au moins trois situations.",
          pourquoi: "Un rôle de famille se réactive en quelques secondes, souvent dès le premier mot au téléphone. Remarquer ce que chaque lien t’apporte prépare ton protocole : tu sauras avec qui le lien te nourrit, et avec qui il pèse.",
          q: "Ce que tu remarques, en général, sur les liens qui te nourrissent et ceux qui pèsent",
          ph: "Exemple : avec mon frère, je ris et je me sens légère. Avec ma mère, je reprends tout de suite ma voix de grande sœur responsable.",
          journal: { k: 'liens-sit-dec', n: 6, q: "Chaque situation : le jour, avec qui, le rôle que tu as pris, ce que le lien t’a apporté ou coûté", ph: "Exemple : dimanche, appel avec ma sœur. J’ai fait la médiatrice entre elle et notre père. J’étais vidée en raccrochant." } }
      ],
      conseil: "Si tu as perdu un frère ou une sœur, ou si certains liens sont interrompus, avance doucement : remplis seulement ce qui te semble possible aujourd’hui. Une case vide est aussi une information. Si une émotion forte monte, pose le stylo, respire, et reprends un autre jour." },

    { cle: 'source', nom: 'Comprendre', etape: 'Comprendre', titre: "D’où vient ta place",
      intro: "Un rôle de famille se reçoit souvent très tôt, parfois avant même de savoir parler. Cette semaine, tu remontes le fil avec douceur, tu écoutes les récits, et tu ranges chaque information dans son tiroir.",
      texte: [
        "Pour chaque information sur ta place, demande-toi dans quel tiroir elle va. **Ce que je sais** : ton rang, les dates de naissance, qui vivait sous le même toit. **Ce qu’on m’a raconté** : « tu étais la grande », « lui, c’était le préféré », avec le regard de la personne qui raconte. **Ce que je suppose** : une ressemblance avec la place d’un parent, un écho entre deux fratries.",
        "Beaucoup de rôles ont été utiles, à une époque. Dans une famille nombreuse, l’aînée qui gardait les petits permettait aux parents de travailler. Dans une famille où l’on se fâchait vite, celui qui faisait rire gardait tout le monde à table. Reconnaître ce qu’un rôle a apporté permet de le remercier, puis de choisir la place que tu veux habiter aujourd’hui."
      ],
      exercices: [
        { k: 'source-place-dec', titre: "Dans ton arbre, regarde les places", type: 'questions',
          consigne: "Prends ces questions une par une, avec ton tableau des fratries à côté de toi. Si une réponse tarde, passe à la suivante : elle viendra peut-être dans la semaine, en regardant une vieille photo ou en parlant avec un proche.",
          pourquoi: "Souvent, on découvre qu’un parent tenait le même rôle dans sa propre fratrie, ou qu’un lien difficile répète une histoire plus ancienne. Le voir transforme « mon caractère » en une place que tu peux regarder et ajuster.",
          choix: { k: 'tiroir-dec', q: "Ce que tu sais de ta place vient surtout du tiroir…", options: ['Ce que je sais : des faits', 'Ce qu’on m’a raconté : des récits', 'Ce que je suppose : des pistes', 'Un peu des trois'] },
          questions: [
            { k: 'source-rang-dec', q: "Quel est ton rang, et que disait-on de ta place quand tu étais enfant ?", ph: "Exemple : je suis l’aînée. On me disait « tu es grande, tu dois montrer l’exemple » dès mes 5 ans." },
            { k: 'source-role-dec', q: "Quel rôle t’a-t-on donné enfant, et le portes-tu encore aujourd’hui ?", ph: "Exemple : celle qui console. Aujourd’hui encore, toute ma famille m’appelle quand ça va mal." },
            { k: 'source-parents-dec', q: "Quelle place tes parents occupaient-ils dans leur propre fratrie ?", ph: "Exemple : ma mère était aussi l’aînée, elle élevait ses quatre frères pendant que ma grand-mère travaillait." },
            { k: 'source-liens-dec', q: "Avec qui le lien te nourrit, avec qui il pèse, et depuis quand ?", ph: "Exemple : il me nourrit avec mon frère depuis toujours. Il pèse avec ma mère depuis mon départ de la maison." },
            { k: 'source-echo-dec', q: "Quelles rivalités ou alliances reviennent d’une génération à l’autre, comme une piste ?", ph: "Exemple : ma mère et sa sœur se parlent peu depuis l’héritage. Avec ma sœur, on se compare très souvent." }
          ] },
        { k: 'source-question', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un parent ou un proche sur la façon dont il ou elle vivait sa place dans sa propre fratrie. Pendant un appel, une visite ou par message. Si ta famille est loin ou absente, pose-la à une personne qui l’a connue, ou écris-la dans ton carnet comme une question ouverte. Choisis une question ouverte et légère, puis range la réponse dans son tiroir. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à mon père : « Comment c’était, d’être le seul garçon avec trois sœurs ? »", court: true },
            { k: 'source-reponse-dec', q: "Qu’as-tu appris ? Qu’est-ce qui résonne avec ta propre place ?", ph: "Exemple : on lui demandait de « faire l’homme de la maison » quand son père était absent. C’est un récit, et mon frère a vécu quelque chose de très proche.", lignes: 3 }
          ] }
      ],
      conseil: "Tu peux ajouter dans [ton arbre familial](genosociogramme.html) tous les enfants de chaque fratrie, avec leur rang : l’outil repère les répétitions de dates et de places. Si une question réveille une tension, change de sujet avec douceur : la porte reste ouverte pour un autre jour." },

    { cle: 'liberer', nom: 'Transformer', etape: 'Transformer', titre: "Alléger les liens qui pèsent",
      intro: "Cette semaine, tu vis ton protocole du mois. Tu poses ta famille en objets, tu cherches ta juste place, et tu remplaces les liens qui pèsent par un fil doré, plus long et plus souple. Les exercices ci-dessous t’aident à te préparer.",
      exercices: [
        { k: 'liens-dec', titre: "Les liens que j’allège", type: 'blocs', nb: 3,
          etiquettes: ['Un premier lien', 'Un deuxième lien', 'Un troisième lien'],
          consigne: "Choisis trois liens qui pèsent dans ta famille ou dans tes liens proches : un parent, un frère, une sœur, un oncle, une grand-mère, un·e ami·e de longue date. Pour chacun, écris ce que ce lien t’a apporté, ce qui pèse aujourd’hui, et ce que tu choisis de garder. Ces trois liens seront tes ficelles pendant le protocole.",
          pourquoi: "Alléger un lien, c’est garder l’amour et laisser à l’autre son histoire. Reconnaître d’abord ce que le lien t’a apporté permet de le transformer avec respect, en gardant le meilleur.",
          astuce: "Un lien léger garde souvent la tendresse et laisse la charge. Tu peux aimer ta mère et choisir d’appeler une fois par semaine plutôt que chaque jour.",
          champs: [
            { q: "Avec qui le lien pèse-t-il ?", ph: ["Exemple : ma mère", "Exemple : ma sœur Claire", "Exemple : mon oncle Thierry"] },
            { q: "Que t’a apporté ce lien, et que pèse-t-il aujourd’hui ?", ph: ["Exemple : il m’a appris à être fiable. Il pèse quand je dois tout organiser pour elle.", "Exemple : on a partagé tant de souvenirs. La comparaison pèse à chaque réussite.", "Exemple : il m’a fait rire enfant. Ses remarques pèsent à chaque repas."] },
            { q: "Que gardes-tu, et quel lien libre et léger choisis-tu ?", ph: ["Exemple : je garde notre tendresse. Je choisis un appel le dimanche, plein et joyeux.", "Exemple : je garde notre complicité. Je choisis de fêter ses réussites et les miennes.", "Exemple : je garde son humour. Je choisis de changer de place à table."] }
          ] },
        { k: 'lettre-place-dec', titre: "La lettre à ma place", type: 'questions',
          consigne: "Écris une lettre à la place que tu occupes dans ta famille. Commence par « Chère place que j’occupe… ». Dis-lui ce qu’elle t’a appris, ce qu’elle te coûte parfois, et ce que tu veux garder. Termine par la place que tu choisis de prendre, à ta façon. Cette lettre prépare ta phrase du protocole : « Ma juste place, c’est… ».",
          pourquoi: "On quitte un rôle plus facilement en le remerciant. Écrire à ta place, c’est reconnaître ce qu’elle t’a donné, et te donner le droit d’en essayer une autre.",
          questions: [
            { k: 'lettre-a-dec', q: "Quelle place, ou quel rôle, choisis-tu de remercier ?", ph: "Exemple : ma place de celle qui organise et sert tout le monde", court: true },
            { k: 'lettre-texte-dec', q: "Ta lettre : ce que cette place t’a appris, ce qu’elle te coûte, ce que tu gardes, la place que tu choisis", ph: "Exemple : Chère place près de la cuisine, tu m’as appris à veiller sur les autres, à savoir recevoir, à être utile. Tu me coûtes mes soirées et mes repas chauds. Je garde le plaisir de cuisiner. Cette année, je choisis de m’asseoir au milieu des miens et de partager le service.", lignes: 7 }
          ] }
      ],
      rituel: {
        titre: "La chaise des absent·es",
        intro: "Ce petit rituel prépare ton protocole : avant de poser ta famille en objets, tu fais une place à celles et ceux qui manquent dans ta vie, disparu·es, loin ou partis. Fais-le seul·e, dans un moment calme. Il dure environ dix minutes.",
        materiel: "Une chaise, une bougie, un stylo. Si tu le souhaites, une photo ou un objet qui rappelle une personne absente : tu pourras le garder pour ton protocole.",
        etapes: [
          "Place une chaise vide face à toi. Si tu as une photo ou un objet, pose-le sur la chaise.",
          "Allume la bougie et dis : « Je fais une place à celles et ceux qui manquent. »",
          "Nomme chaque absent·e, une par une, et dis : « Tu fais partie de notre famille. »",
          "Puis dis : « Je prends ma place, et je te laisse la tienne. »",
          "Reste quelques minutes au calme, et accueille ce qui vient. Si une émotion devient forte, pose les mains sur ton ventre et respire lentement.",
          "Éteins la bougie en restant près d’elle jusqu’au bout, remets la chaise à sa place, et note ce qui est venu ci-dessous."
        ],
        note: { k: 'rituel-note-dec', q: "Comment s’est passé ton rituel ? Quels noms sont venus, et qu’as-tu ressenti ?", ph: "Exemple : j’ai nommé papi Robert et ma tante partie loin. J’ai senti de la tristesse, puis de la douceur. J’ai gardé la photo de papi pour mon protocole." }
      },
      conseil: "Faire une place aux absent·es et alléger un lien te laisse libre : libre de pardonner ou d’attendre, de reprendre contact ou de garder ta distance. Si une émotion monte pendant le protocole, fais une pause, bois un verre d’eau, sors marcher au grand air, et reprends un autre jour." },

    { cle: 'remplacer', nom: 'Intégrer', etape: 'Intégrer', titre: "Ta juste place, à ta façon",
      intro: "Tu as vu ta place, compris d’où viennent les rôles, allégé les liens qui pèsent. Cette semaine, tu intègres : tu écris ton prénom et ta phrase sur le tronc de ton arbre de vie, et dans un lien de ta vie (un repas, un appel, une rencontre, un moment avec toi-même), tu prends consciemment une place différente, même toute petite.",
      texte: [
        "**La première pause.** Au moment où tu sens le vieux rôle t’attraper (te lever pour servir, faire une blague pour apaiser, te taire), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Merci. Ce soir, je choisis ma juste place. »",
        "**Le petit déplacement.** Une autre chaise, une tâche confiée, une phrase dite à voix haute : un seul déplacement suffit pour que tout le lien bouge un peu. Après ce moment, prends le temps d’accueillir ce qui s’est passé, le doux comme le plus délicat."
      ],
      exercices: [
        { k: 'deplacement-dec', titre: "Le déplacement", type: 'texte',
          consigne: "Choisis ton déplacement pour cette semaine : une place, un rôle, un geste différent, en famille, avec tes proches ou avec toi-même, qui va avec ta phrase « Ma juste place, c’est… ». Écris-le, puis note chaque fois que tu l’as essayé, même maladroitement, et ce qui a changé. Ce déplacement devient aussi une limite posée dans ton carnet « J’avance ».",
          pourquoi: "Une famille est un équilibre : quand une personne bouge, même un peu, les autres s’ajustent. Ton petit déplacement ouvre une possibilité pour toi, et parfois pour tout ton entourage.",
          gestes: ["M’asseoir à une autre place", "Rester assis·e pendant le plat principal", "Confier le service à quelqu’un d’autre", "Prononcer le prénom d’un·e absent·e, à voix haute ou en silence", "Laisser une tension se dérouler entre les personnes qu’elle concerne", "Partir à l’heure que j’ai choisie"],
          q: "Ton déplacement : « Dans ce lien, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de me lever chaque fois qu’il manque quelque chose à table, je vais rester assis·e et dire « tu peux aller le chercher ? ».",
          journal: { k: 'deplacement-essais-dec', n: 6, q: "Chaque fois que tu l’as essayé : quand, et qu’est-ce qui a changé ?", ph: "Exemple : dimanche, je suis resté·e assis·e. Mon neveu s’est levé pour servir, et ma mère m’a souri." } },
        { k: 'accueil-dec', titre: "Accueillir ce que tu as vécu", type: 'questions',
          consigne: "En fin de semaine, repense à ces jours avec douceur, que tu les aies vécus entouré·e ou seul·e. Note un moment de joie, et un moment plus délicat, avec bienveillance pour toi comme pour les autres.",
          questions: [
            { k: 'accueil-joie-place', q: "Quel moment de joie veux-tu garder de ces jours, avec les autres ou avec toi-même ?", ph: "Exemple : le fou rire avec ma cousine pendant la vaisselle, et ma balade de dimanche au soleil, juste pour moi.", lignes: 2 },
            { k: 'accueil-dur-place', q: "Quel moment a été plus délicat, et qu’est-ce qu’il t’apprend sur ta place ?", ph: "Exemple : quand mon père m’a coupé la parole. J’ai compris que j’ai encore besoin d’être écouté·e comme un·e adulte, et que je peux le dire.", lignes: 3 }
          ] }
      ],
      conseil: "Si le vieux rôle revient pendant un repas ou un appel, remarque-le après coup : tu l’as vu, et c’est déjà un progrès. Les retrouvailles, les dates qui comptent et les repas sont des moments intenses pour changer de place. La prochaine fois, tu le sentiras venir un peu plus tôt. Pense à écrire ton prénom et ta phrase sur le tronc de ton arbre de vie." }
  ],

  meditation: {
    titre: 'La table de lumière',
    intro: "Une séance guidée pour voir ta famille s’installer autour d’une grande table, saluer les absent·es avec douceur, et choisir la place où tu te sens bien : ta juste place.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois. Laisse ton corps se poser.",
      "[pause]",
      "Imagine une grande table dressée dans une pièce chaleureuse. Une lumière douce éclaire la nappe, les assiettes, les verres. Il y a une odeur de plat qui mijote, peut-être une recette de ton enfance. Dehors, il fait froid et nuit noire. Ici, il fait bon.",
      "Peu à peu, les membres de ta famille arrivent et s'installent. Observe qui vient en premier, qui reste debout, qui s'assoit sans hésiter. Remarque où chacun·e prend place, et ce que tu ressens en les voyant.",
      "[pause]",
      "Remarque aussi les chaises vides. Tu sais peut-être qui devrait s'y trouver : une grand-mère, un oncle, un enfant qu'on n'a pas connu. Salue ces absent·es avec douceur. Tu peux leur dire intérieurement : « Je pense à toi. Tu fais partie de nous. »",
      "Maintenant, cherche ta place. Peut-être est-ce celle que tu occupes toujours. Peut-être une autre t'attire, plus près de quelqu'un, ou plus près de la fenêtre. Prends le temps de choisir.",
      "[longue pause]",
      "Assieds-toi là où tu te sens bien. Sens le soutien de la chaise, ton dos droit, tes pieds sur le sol. Respire. Personne ne te demande de jouer un rôle.",
      "Regarde la table depuis cette place. Tu n'as rien à prouver, rien à réparer. Tu es là, simplement, à ta juste place, au milieu des tiens. Au centre de la table, une bougie brille : c'est la lumière qui revient, au cœur de la nuit la plus longue.",
      "[pause]",
      "Garde cette image en toi. Pendant les fêtes, tu pourras la retrouver d'une seule respiration, même au milieu du bruit.",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts, les épaules. Quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais cette séance avant un moment avec les tiens ou avec tes proches pour te préparer, ou après pour te retrouver. Elle t’accompagne aussi si tu vis ces jours seul·e : ta table de lumière accueille les liens de ton choix. Si une chaise vide te serre le cœur fort, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une place choisie, un visage, une chaise vide, une sensation…", ph: "Exemple : je me suis assis·e près de la fenêtre, loin de la cuisine. J’ai vu la chaise de mon grand-père, et j’ai souri." }
  },

  /* Le protocole du mois, cycle 2 « Mon arbre de vie » (version 3) : Explorer, Transformer, Intégrer.
     Affiché en semaine 3 (Libérer), après les exercices. Clé de champ : arbre-note. */
  protocole: {
    titre: "Racines · Quelle est ma place ?",
    intro: "**Objectif :** trouver ma juste place dans ma famille. **Sous-objectif :** voir la place de chacun·e, me placer là où je me sens bien, et alléger les liens qui pèsent en gardant l’amour. **Intensité douce.**",
    materiel: "Une dizaine de petits objets (boutons, pierres, figurines), de la ficelle, des ciseaux, un fil doré. Ton carnet, des crayons de couleur, et ton affiche [« Mon arbre de vie »](arbre-de-vie-affiche.html). Le cadre du suivi est dans [le mode d’emploi](mode-emploi-suivi.html).",
    etapes: [
      {
        titre: "**Explorer** · 20 min",
        etapes: [
          "**Ma fratrie (10 min).** Ton rang, celui de tes parents dans leur propre fratrie. Qui tu soutiens, qui tu protèges, à qui on te compare.",
          "**Mes liens (10 min).** Avec qui le lien te nourrit, avec qui il pèse."
        ]
      },
      {
        titre: "**Transformer** · 45 min",
        etapes: [
          "**Ma famille en objets (15 min).** Sur une table, choisis un objet pour chaque personne et un pour toi. Place-les comme tu ressens ta famille aujourd’hui : les distances, les regards. Observe, puis prends une photo.",
          "**Ma juste place (10 min).** Déplace ton objet à l’endroit où tu te sens bien. Observe ce qui change pour toi. Ajuste doucement les autres si tu le sens, avec respect.",
          "**Le fil (10 min).** Entre ton objet et chaque personne avec qui le lien pèse, pose une ficelle. Dis : « Je garde l’amour, je te laisse ton histoire. » Coupe la ficelle, et pose à la place un fil doré, plus long et plus souple : « Je choisis un lien libre et léger. »",
          "**La photo finale (5 min).** Photographie ta nouvelle disposition et compare avec la première.",
          "**Respirer (5 min).**"
        ]
      },
      {
        titre: "**Intégrer** · 15 min",
        etapes: [
          "**Clôture commune (3 min).** Lis à voix haute [le texte de fin de rituel et de réunification intérieure](mode-emploi-suivi.html#cloture).",
          "**Ma phrase (5 min).** « Ma juste place, c’est… ». Lis-la debout, dos droit.",
          "**Sur mon arbre (7 min).** Ton prénom sur le tronc, avec ta phrase."
        ]
      }
    ],
    questions: [
      {
        k: "arbre-note",
        q: "Ce que j’ai posé sur mon arbre ce mois-ci",
        ph: "Exemple : mon prénom sur le tronc, avec « Ma juste place, c’est à côté de ma sœur, à égalité »."
      }
    ]
  },

  lectures: [
    { lien: 'place-dans-la-fratrie.html', titre: "La place dans la fratrie", resume: "Aîné·e, enfant du milieu, benjamin·e, enfant unique : ce que ton rang peut éclairer, et la juste mesure de ces repères." },
    { lien: 'filles-garcons-fratrie.html', titre: "Fille ou garçon attendu", resume: "Ce que racontent les fratries d’une famille, et comment une attente ancienne peut colorer une place." },
    { lien: 'conflits-avec-ses-parents.html', titre: "Les liens qui pèsent avec ses parents", resume: "Ce qui se joue dans les tensions avec tes parents, et des pistes pour garder l’amour en trouvant ta place d’adulte." }
  ],

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-place-vue-dec', q: "Quelle place ou quel rôle as-tu repéré ce mois-ci ?", ph: "Exemple : celle qui organise tout, comme ma mère et ma grand-mère avant moi." },
    { k: 'fin-origine-dec', q: "Qu’as-tu compris de son origine, et dans quel tiroir le ranges-tu ?", ph: "Exemple : ma mère était aussi l’aînée qui élevait ses frères. C’est un fait, et la ressemblance avec moi reste une piste qui me parle." },
    { k: 'fin-lien-dec', q: "Quel lien as-tu allégé avec ton fil doré, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : le lien avec ma mère. Je l’appelle avec plaisir le dimanche, et je me sens plus libre le reste de la semaine." },
    { k: 'fin-juste-dec', q: "Quelle est ta phrase : « Ma juste place, c’est… » ?", ph: "Exemple : ma juste place, c’est au milieu des miens, assise, écoutée, avec du temps pour moi." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer à l’étape suivante, autour de la peur que tu portes ?", ph: "Exemple : regarder la peur qui revient à certaines périodes, et ce qu’elle porte de ma famille.", court: true }
  ],

  carnet: {
    titre: 'Ma place, mes limites',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Dans ton carnet, tu repères tes oui qui te coûtent et tu protèges ton énergie : reporte ton déplacement et ta phrase « Ma juste place, c’est… », ils deviennent une limite posée."
  },

  aVenir: [
    { mois: 'Étape 4 · Tronc', titre: "Quelle peur je porte, et pour qui ?", texte: "Repérer tes périodes sensibles et les dates de ta lignée, faire la part des choses, et rendre la part de peur qui appartient à l’histoire familiale.", image: 'assets/cartes/apprendre-mini.jpg' },
    { mois: 'Étape 5 · Tronc', titre: "Quel projet a-t-on posé sur moi ?", texte: "Découvrir l’histoire de ton prénom et les attentes posées sur toi, puis écrire ton propre contrat avec la vie.", image: 'assets/cartes/ecrire-la-mienne-mini.jpg' },
    { mois: 'Étape 6 · Tronc', titre: "Quelles émotions avaient le droit d’exister ?", texte: "Voir les émotions bienvenues et celles mises de côté dans ta famille, distinguer émotion et sentiment, et écrire à l’une d’elles.", image: 'assets/cartes/faire-semblant-mini.jpg' }
  ]
};
