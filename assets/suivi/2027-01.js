/* Genesolia · Le Cercle · Mon suivi « Je me libère » de janvier 2027 : « Quelle peur je porte, et pour qui ? »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-01',
  cle: 'suivi-2027-01',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-01-6750c8248e.pdf',
  nomMois: 'janvier 2027',
  moisSuivant: 'février',
  titre: "Quelle peur je porte, et pour qui ?",
  sousTitre: "Tronc de ton arbre de vie · Repérer tes périodes sensibles, faire la part entre ta vie et ton histoire familiale, et rendre symboliquement la part de peur qui appartient à ta lignée.",
  citation: "Aujourd’hui, je suis en sécurité, et je vis ma vie.",
  audio: '',
  audioCourt: '',
  saisonLien: "Janvier ouvre l’année dans le froid et la lumière basse. La nature garde ses forces à l’abri, sous la terre et dans l’écorce, en attendant le retour des beaux jours. C’est le bon moment pour regarder tes peurs avec calme, au chaud : celles qui reviennent à certaines périodes, et celles qui semblent venir de plus loin que toi. Tu avances doucement, en sécurité, à ton rythme.",
  intensiteQ: "À quel point la peur, ou une fatigue qui revient à certaines périodes, pèse-t-elle sur ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette inquiétude qui revient à la même période chaque année, comme si quelque chose de grave allait arriver.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-etoiles.webp',
      theme: 'assets/guide/guide-transmission.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-arbre.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/apprendre-mini.jpg', 'Tout ce qui revient a quelque chose à m’apprendre.']
    }
  },

  mots: {
    saison: "Prends un moment pour respirer avec ta saison. Regarde tes peurs avec calme, à ton rythme.",
    theme: "Lis cette page comme une lettre. Si une période de l’année ou une date te vient en lisant, note-la quelque part.",
    voir: "Cette semaine, tu observes tes périodes sensibles. Chaque moment noté t’aide à mieux te connaître.",
    source: "Une date proche reste une piste. Range chaque information dans son tiroir, et garde ce qui te parle.",
    liberer: "Rendre une part de peur, c’est garder la force de ta lignée et choisir la confiance. Tu avances à ton rythme.",
    remplacer: "Un calendrier doux et une phrase de sécurité : de petits gestes, répétés, suffisent pour apaiser une racine.",
    meditation: "Un matin calme ou un soir tranquille. Si une émotion monte, reviens à ton souffle et à tes pieds sur le sol.",
    bilan: "Prends ce moment, même si une partie reste à faire. Chaque peur regardée avec douceur est déjà plus légère."
  },

  theme: {
    titre: "La peur que tu portes",
    texte: [
      "Il y a des moments où l’on se projette : un nouveau projet, un changement, une date qui approche. Et parfois, une vieille peur se réveille au même moment : peur de manquer, peur de perdre, peur que tout s’arrête. Certaines peurs viennent de ta vie, de ce que tu as traversé. D’autres semblent venir de plus loin : d’une histoire familiale, d’une période difficile vécue par ceux d’avant, d’une inquiétude transmise en silence.",
      "Avec cette étape 4, tu entres dans le **tronc** de ton arbre de vie : tu comprends ce que tu portes. Après les racines des trois premières étapes (les prénoms, les dons, ta juste place), tu regardes la peur héritée, pour aller doucement vers la vie choisie. Pendant cette étape, tu cherches à faire la part des choses : ce qui est à toi, et ce qui appartient peut-être à ta lignée."
    ],
    sousTitre: "Périodes sensibles et dates de la lignée",
    texte2: [
      "Beaucoup de personnes remarquent qu’une fatigue ou une inquiétude revient à la même période chaque année. Parfois, en regardant l’arbre, on découvre une date familiale proche : un départ, un décès, une faillite, un déménagement forcé. En psychogénéalogie, on parle de dates qui se répondent. C’est une piste à regarder avec prudence : une date proche peut être une coïncidence, et tu gardes simplement ce qu’elle évoque pour toi.",
      "Une peur peut aussi se transmettre par les gestes et les phrases : « on se méfie », « garde toujours une réserve », « il vaut mieux rester discret ». Elle a souvent protégé quelqu’un, à une époque où le danger était réel. Aujourd’hui, tu peux la remercier pour cette protection et choisir la confiance. Pour aller plus loin : [le syndrome d’anniversaire, entre faits et hypothèses](syndrome-anniversaire.html).",
      "Pendant cette étape, tu vas **explorer** ton calendrier sensible, **comprendre** les dates de ta lignée en rangeant chaque information dans son tiroir, **transformer** en rendant la part de peur qui appartient à ta famille avec ton protocole, puis **intégrer** : colorer une racine apaisée sur ton arbre de vie et accueillir tes périodes sensibles avec un calendrier doux."
    ],
    exemplesTitre: "Quand une peur semble venir de plus loin, au quotidien",
    exemples: [
      "**Le mois lourd** : chaque année en février, tu te sens épuisé·e et inquiet·e. En regardant l’arbre, tu découvres que ton grand-père a perdu son travail un mois de février, quand ta mère avait 8 ans.",
      "**La réserve** : tu gardes toujours une grosse somme de côté et tu as du mal à profiter. Tes grands-parents ont tout recommencé deux fois, après deux déménagements forcés.",
      "**L’âge qui inquiète** : à l’approche de tes 40 ans, une inquiétude monte. Ta grand-mère a dû tout quitter à cet âge-là, et on en parlait à voix basse.",
      "**Le départ** : chaque voyage te serre le ventre. Un arrière-grand-père est parti un jour pour l’étranger, et la famille a attendu longtemps de ses nouvelles.",
      "**La vigilance** : tu vérifies trois fois que la porte est fermée, comme ta mère, comme sa mère avant elle."
    ],
    exempleSpirale: "La spirale, c’est la même saison, un cran plus haut. Chaque mois de février, tu te sentais inquiet·e et tu te le reprochais. Cette année, tu as noté la période dans ton agenda, avec ta phrase : « Aujourd’hui, je suis en sécurité, et je vis ma vie. » Quand l’inquiétude arrive, tu la reconnais, tu respires, tu prévois une promenade et un repas avec une amie. La peur passe, plus légère : tu sais d’où elle vient peut-être, et tu choisis la confiance.",
    question: { k: 'theme-peur-jan', q: "En une phrase, quelle peur reconnais-tu en toi, et à quel moment de l’année revient-elle le plus souvent ?", ph: "Exemple : la peur de manquer, qui revient chaque fin d’automne, quand les jours raccourcissent." }
  },

  semaines: [
    { cle: 'voir', nom: 'Explorer', etape: 'Explorer', titre: "Ton calendrier sensible",
      intro: "Cette semaine, tu explores les moments de l’année où la peur ou la fatigue reviennent. Tu observes, tu notes, tu remarques ce que ça te fait. Les dates de ta lignée viendront la semaine prochaine.",
      texte: "Commence par ton calendrier sensible, au calme, une vingtaine de minutes, avec un agenda ou un calendrier sous les yeux. Puis, pendant la semaine, remarque chaque fois qu’une peur se présente, même petite.",
      exercices: [
        { k: 'calendrier-jan', titre: "Mon calendrier sensible", type: 'tableau', rangs: 4,
          etiquettes: ['Un premier moment', 'Un deuxième moment', 'Un troisième moment', 'Un quatrième moment'],
          consigne: "Note les moments de l’année où la peur, l’inquiétude ou la fatigue reviennent : un mois, une saison, une fête, un anniversaire, un âge. Pour chacun, écris ce que tu ressens, et ce qui se passait dans ta vie à ce moment-là, si tu le sais. Deux ou trois moments suffisent pour commencer.",
          pourquoi: "Quand on pose ses périodes sensibles sur le papier, on voit souvent qu’elles reviennent avec une régularité étonnante. Les connaître à l’avance permet de les accueillir avec plus de douceur, et de préparer la suite du mois.",
          colonnes: [
            { q: "Quand revient ce moment ?", ph: ["Exemple : chaque fin novembre", "Exemple : autour de mon anniversaire, en mars", "Exemple : la rentrée de septembre", "Exemple : les veilles de départ en voyage"] },
            { q: "Que ressens-tu, à ce moment-là ?", ph: ["Exemple : une fatigue lourde et l’envie de me cacher", "Exemple : une inquiétude diffuse, comme une menace", "Exemple : la peur de manquer d’argent", "Exemple : le ventre serré, des images de catastrophe"] },
            { q: "Que se passait-il dans ta vie, à ce moment-là ?", ph: ["Exemple : en apparence, tout va bien", "Exemple : un mois ordinaire, et c’est ce qui m’étonne", "Exemple : les factures de rentrée", "Exemple : je laisse ma maison et mes repères"] }
          ],
          apres: { k: 'calendrier-jan-commun', q: "Relis ton calendrier. Qu’est-ce que ces moments ont en commun, même un détail : une saison, un âge, une fête, un départ ?", ph: "Exemple : ce sont surtout des moments de passage, quand les jours raccourcissent ou quand je pars." } },
        { k: 'peur-journal-jan', titre: "Mon journal de la peur", type: 'texte',
          consigne: "Cette semaine, remarque chaque fois qu’une peur se présente, même petite : une inquiétude, un scénario catastrophe, une vigilance. Note le jour, ce qui l’a déclenchée, où tu l’as sentie dans ton corps, et la phrase qui l’accompagnait. Vise au moins trois moments.",
          pourquoi: "Une peur héritée a souvent une voix reconnaissable, une phrase entendue enfant. La remarquer au moment où elle arrive, c’est déjà prendre un peu de distance avec elle.",
          q: "Ce que tu remarques, en général, sur la peur qui revient",
          ph: "Exemple : elle arrive le soir, avec la phrase « et si tout s’écroulait ? ». C’est la voix de ma grand-mère.",
          journal: { k: 'peur-sit-jan', n: 6, etiquette: 'Moment', q: "Chaque moment : le jour, le déclencheur, l’endroit du corps, la phrase qui l’accompagnait", ph: "Exemple : mercredi, en ouvrant mon relevé de compte. Le ventre serré. « On va finir à la rue. »" } }
      ],
      conseil: "Si une période te semble très lourde, avance doucement : note seulement ce qui te paraît possible aujourd’hui. Pose les pieds au sol, regarde autour de toi et nomme cinq objets que tu vois. Tu peux reprendre un autre jour." },

    { cle: 'source', nom: 'Comprendre', etape: 'Comprendre', titre: "Les dates de ta lignée",
      intro: "Cette semaine, tu regardes les dates de ta famille, avec curiosité et prudence. Tu remontes le fil, tu écoutes les récits, et tu fais la part entre ce qui vient de ta vie et ce qui semble venir de ton histoire familiale.",
      texte: [
        "Pour chaque information, demande-toi dans quel tiroir elle va. **Ce que je sais** : une date écrite sur un acte, un faire-part, une tombe. **Ce qu’on m’a raconté** : « c’était l’hiver où ton grand-père est parti », avec les mots et l’émotion de la personne qui raconte. **Ce que je suppose** : une date proche de ta période sensible, une ressemblance, une intuition.",
        "Une date proche reste une piste. Elle peut éclairer ce que tu ressens, comme elle peut être une simple coïncidence : les deux sont possibles, et c’est toi qui choisis ce que tu en gardes. L’essentiel est ailleurs : faire la part entre ta vie et ton histoire familiale, pour rendre à ta lignée la part qui lui appartient peut-être, et garder la tienne."
      ],
      exercices: [
        { k: 'dates-jan', titre: "Les dates de ma lignée", type: 'questions',
          consigne: "Prends ces questions une par une, avec ton calendrier sensible à côté de toi. Note les dates que tu connais, même approximatives. Si une réponse tarde, passe à la suivante : elle viendra peut-être en feuilletant un album ou en parlant avec un proche.",
          pourquoi: "Les dates sont les traces les plus solides d’une histoire familiale. Les poser à côté de tes périodes sensibles t’aide à voir des échos possibles, à garder comme des hypothèses ouvertes.",
          choix: { k: 'tiroir-jan', q: "Le lien entre ta peur et ta lignée va surtout dans le tiroir…", options: ['Ce que je sais : un fait', 'Ce qu’on m’a raconté : un récit', 'Ce que je suppose : une piste', 'Un peu des trois'] },
          questions: [
            { k: 'dates-jan-connues', q: "Quelles dates familiales connais-tu : naissances, départs, décès, mariages, déménagements ?", ph: "Exemple : papi né en mars 1932, départ de la ferme en novembre 1958, mamie partie en février 1999." },
            { k: 'dates-jan-proches', q: "Lesquelles tombent près de tes périodes sensibles, ou d’un âge qui t’inquiète ?", ph: "Exemple : le départ de la ferme, en novembre. Ma fatigue de fin novembre, peut-être." },
            { k: 'dates-jan-recits', q: "Quelles peurs se racontent dans ta famille, et à propos de quels événements ?", ph: "Exemple : la peur de tout perdre, depuis la vente forcée de la ferme. On en parle encore à chaque réunion de famille." },
            { k: 'dates-jan-qui', q: "Qui, avant toi, portait une peur semblable à la tienne ?", ph: "Exemple : ma grand-mère, qui gardait des boîtes de conserve « au cas où » dans tous les placards." },
            { k: 'dates-jan-part', q: "Dans ta peur, quelle part vient de ta vie, et quelle part te semble venir de ta famille ?", ph: "Exemple : de ma vie, une période de chômage à 30 ans. De ma famille, cette impression que tout peut s’écrouler du jour au lendemain." }
          ] },
        { k: 'source-question', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur une date ou une période importante : comment c’était, qui était là, ce qu’on ressentait. Commence par un souvenir heureux pour ouvrir la porte, puis range la réponse dans son tiroir. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à mon oncle : « Tu te souviens de l’hiver où vous avez quitté la ferme ? »", court: true },
            { k: 'source-reponse-jan', q: "Qu’as-tu appris, et dans quel tiroir le ranges-tu ?", ph: "Exemple : il m’a raconté que mamie pleurait en cachette et comptait chaque sou. C’est un récit, et il éclaire ma propre façon de compter.", lignes: 3 }
          ] }
      ],
      conseil: "Ajoute les dates que tu retrouves dans [ton arbre familial](genosociogramme.html) : ta page « Ton mois » te les rappellera chaque année. Pour voir les âges et les dates qui se répondent, tu peux utiliser [le calcul des dates anniversaires](calcul-syndrome-anniversaire.html), en gardant chaque résultat comme une piste. Si une question réveille une peine chez la personne que tu interroges, remercie-la avec douceur et laisse la porte ouverte." },

    { cle: 'liberer', nom: 'Transformer', etape: 'Transformer', titre: "Rendre la part de peur",
      intro: "Cette semaine, tu vis ton protocole du mois. Tu poses ta peur en trois colonnes, tu écris une lettre courte à celles et ceux d’avant toi, tu rends au feu la part de peur qui leur appartient, et tu choisis la confiance.",
      exercices: [
        { k: 'colonnes-jan', titre: "Ma peur en trois colonnes", type: 'blocs', nb: 3,
          etiquettes: ['Une première peur', 'Une deuxième peur', 'Une troisième peur'],
          consigne: "Pour une, deux ou trois peurs, écris la peur, ce qui vient de ta vie, et ce qui te semble venir de ta famille. C’est l’étape « Ma peur en trois colonnes » de ton protocole : tu peux la faire ici, puis garder ta page sous les yeux pour écrire ta lettre.",
          pourquoi: "Faire la part des choses apaise souvent beaucoup. Ce qui vient de ta vie, tu peux l’accueillir et l’accompagner. Ce qui semble venir de ta famille, tu peux le remercier et le rendre, en gardant la force qui l’accompagnait.",
          astuce: "Une peur héritée a souvent protégé quelqu’un, à une époque où le danger était réel. Demande-toi quelle force elle demandait : la prudence, l’endurance, la débrouille. Cette force, tu la gardes.",
          champs: [
            { q: "Quelle est cette peur ?", ph: ["Exemple : la peur de manquer", "Exemple : la peur que mes proches partent", "Exemple : la peur de me faire remarquer"] },
            { q: "Qu’est-ce qui vient de ta vie ?", ph: ["Exemple : une année difficile à 30 ans, quand j’ai perdu mon travail", "Exemple : le départ de mon père quand j’avais 10 ans", "Exemple : des moqueries au collège"] },
            { q: "Qu’est-ce qui te semble venir de ta famille ?", ph: ["Exemple : la ferme vendue, les grands-parents qui comptaient chaque sou", "Exemple : l’arrière-grand-père parti à l’étranger, l’attente des nouvelles", "Exemple : « chez nous, on reste discrets », depuis des générations"] }
          ] },
        { k: 'lettre-jan', titre: "Avant ta lettre courte", type: 'questions',
          consigne: "Ton protocole t’invite à écrire une lettre courte, puis à la brûler ou à la déchirer. Tu peux la préparer ici, et l’écrire ensuite à la main sur une feuille. Tu choisis à qui tu écris : un prénom, ou « ceux d’avant moi ».",
          pourquoi: "Une lettre courte va à l’essentiel : rendre une part, garder une force, choisir la confiance. L’écrire à la main, puis la confier au feu ou la déchirer, donne un corps à ce choix.",
          questions: [
            { k: 'lettre-a-jan', q: "À qui écris-tu ?", ph: "Exemple : à mes grands-parents de la ferme", court: true },
            { k: 'lettre-texte-jan', q: "Ta lettre : la part de peur que tu rends, la force que tu gardes, la confiance que tu choisis", ph: "Exemple : À vous, papi et mamie, je vous rends la part de peur qui vous appartient, celle de tout perdre. Je garde votre force de recommencer. Aujourd’hui, je choisis la confiance.", lignes: 5 }
          ] }
      ],
      rituel: {
        titre: "Mes ancres de sécurité",
        intro: "Ce petit rituel prépare ton protocole. Avant de regarder ta peur en face, tu rassembles trois ancres qui te rappellent que tu es en sécurité, ici et maintenant. Compte une dizaine de minutes, la veille ou juste avant ton protocole.",
        materiel: "Trois ancres : un objet doux ou solide à tenir dans la main, une image d’un lieu où tu te sens bien, et une phrase écrite sur un papier. Une couverture, un verre d’eau.",
        etapes: [
          "Choisis un coin calme et installe-toi confortablement, une couverture sur les épaules si tu en as envie.",
          "Prends ton objet dans la main. Sens son poids, sa température, sa forme. Dis : « Je suis ici, dans mon corps, aujourd’hui. »",
          "Regarde ton image et respire lentement trois fois, en imaginant que tu es dans ce lieu.",
          "Lis ta phrase à voix haute, par exemple : « Aujourd’hui, je suis en sécurité, et je vis ma vie. »",
          "Pose les trois ancres près de toi pour ton protocole. Si une émotion monte pendant la lettre, reprends ton objet dans la main et relis ta phrase.",
          "Après ton protocole, note ci-dessous ce que tes ancres t’ont apporté."
        ],
        note: { k: 'rituel-note-jan', q: "Quelles ancres as-tu choisies, et que t’ont-elles apporté pendant ton protocole ?", ph: "Exemple : un galet de la plage de mon enfance, une photo de mon jardin, ma phrase. Au moment du feu, j’ai serré le galet et je me suis senti·e solide." }
      },
      conseil: "Le feu est une possibilité parmi d’autres : déchirer la lettre, l’enterrer ou la garder dans une enveloppe sont des gestes tout aussi forts. Suis la consigne du [mode d’emploi](mode-emploi-suivi.html#feu). Si une émotion monte, pose les pieds au sol, nomme cinq objets autour de toi, bois un verre d’eau. Tu peux vivre le protocole en deux fois." },

    { cle: 'remplacer', nom: 'Intégrer', etape: 'Intégrer', titre: "Ton calendrier doux",
      intro: "Tu as vu tes périodes sensibles, compris les dates de ta lignée, rendu la part de peur qui appartenait à ta lignée. Cette semaine, tu intègres : tu colores une racine apaisée sur ton arbre de vie, tu prépares ton calendrier doux, et tu poses chaque jour un petit geste de confiance.",
      texte: [
        "**La première pause.** Quand la vieille peur se présente (un scénario catastrophe, une vigilance, une envie de tout contrôler), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Merci d’avoir protégé les miens. Aujourd’hui, je suis en sécurité, et je vis ma vie. »",
        "**Le calendrier doux.** Note tes périodes sensibles dans ton agenda, avec ta phrase de sécurité, et prévois pour chacune un rendez-vous qui te fait du bien : une promenade, un repas avec une amie, une soirée au calme. Tu transformes une date redoutée en rendez-vous avec toi-même."
      ],
      exercices: [
        { k: 'confiance-jan', titre: "Mon geste de confiance", type: 'texte',
          consigne: "Choisis un petit geste de confiance pour cette semaine, à l’opposé de ta vieille peur : dépenser un peu pour un plaisir, partir en balade en laissant une part d’imprévu, accepter une invitation de dernière minute. Écris-le, puis note chaque fois que tu l’as fait, même maladroitement, et ce que tu as ressenti. Ce geste nourrit aussi ton intention dans ton carnet « J’avance ».",
          pourquoi: "La confiance se construit par petits gestes répétés. Chaque geste montre à ton corps que tu es en sécurité aujourd’hui, et ta racine apaisée prend vie dans ton quotidien.",
          gestes: ["Noter mes périodes sensibles dans mon agenda, avec ma phrase", "Prévoir un rendez-vous doux pendant une période sensible", "M’offrir un petit plaisir, ici et maintenant", "Partir en balade en laissant une part d’imprévu", "Appeler une personne de confiance quand la peur arrive", "Garder mon ancre dans ma poche les jours délicats"],
          q: "Ton geste : « Quand ma vieille peur se présente, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de vérifier mon compte trois fois par jour, je vais le regarder une fois le dimanche, avec une tasse de thé, et me dire ma phrase.",
          journal: { k: 'confiance-essais-jan', n: 6, q: "Chaque fois que tu as posé ce geste : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : samedi, je suis allé·e au cinéma sur un coup de tête. J’ai senti la peur, puis du plaisir." } }
      ],
      conseil: "Si la peur revient, remarque-la, remercie-la, et rappelle-toi ta phrase : chaque retour est une occasion de la reconnaître un peu plus tôt. Pense à colorer une racine apaisée sur ton arbre de vie. Si un malaise dure plusieurs jours, parles-en à une personne de confiance." }
  ],

  meditation: {
    titre: "Le coffret rendu",
    intro: "Une séance guidée pour regarder une peur avec calme, la rendre avec respect à celle ou celui de ta lignée qui l’a connue en premier, recevoir sa force, et choisir la confiance, ici et maintenant.",
    texte: [
      "Je m’installe confortablement, le dos soutenu, les pieds bien posés. Je ferme les yeux, ou je laisse mon regard se poser doucement devant moi. Je respire profondément, trois fois… Mon corps se pose.",
      "[pause]",
      "Je sens mon corps sur le siège, mes pieds sur le sol. Je suis en sécurité, ici et maintenant. À chaque instant, je peux revenir à mon souffle.",
      "Dans mes mains, un petit coffret apparaît. Il contient une peur que je connais bien : celle qui revient à certains moments, celle qui semble venir de loin. Je la regarde avec calme. Je remarque sa couleur, sa forme, sa température.",
      "[pause]",
      "Devant moi, un chemin remonte doucement vers celles et ceux qui sont venus avant moi. Une silhouette s’avance. Peut-être une grand-mère, un arrière-grand-père, ou quelqu’un dont j’ignore le nom. Cette peur, elle l’a connue la première, à une époque difficile. Elle l’a gardée pour tenir, et pour protéger les siens.",
      "Je la salue avec respect. Je lui dis intérieurement : « Je vois ce que tu as traversé. Cette peur t’a aidé·e à tenir, et la vie est arrivée jusqu’à moi. Merci. »",
      "[longue pause]",
      "Je tends le coffret, doucement, avec les deux mains : « Je te rends la part de peur qui t’appartient. Je garde ta force et ton courage. » La silhouette reçoit le coffret. Je la vois sourire, apaisée. Mes mains s’allègent, mes épaules se relâchent, mon souffle s’élargit.",
      "En retour, elle pose dans mes mains une petite lumière chaude : sa force, sa façon de tenir et de recommencer. Je la reçois. Elle devient ma confiance.",
      "[pause]",
      "Je me tourne vers ma vie d’aujourd’hui. Le chemin devant moi est clair et ouvert. Je me répète doucement : « Aujourd’hui, je suis en sécurité, et je vis ma vie. Je choisis la confiance. »",
      "Je respire profondément. Je sens mon corps, le sol, le siège sous moi. Je bouge doucement les doigts, les épaules. Et quand je suis prêt·e, j’ouvre les yeux."
    ],
    conseil: "Choisis un moment calme, avec dix minutes pour toi. Si une émotion monte fort, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Le coffret, une silhouette, la force reçue, une sensation…", ph: "Exemple : le coffret était gris et froid. Mon arrière-grand-mère l’a pris en souriant, et m’a donné une lumière orange. J’ai senti mes épaules se relâcher." }
  },

  /* Le protocole du mois, cycle 2 « Mon arbre de vie » (version 3) : Explorer, Transformer, Intégrer.
     Affiché en semaine 3 (Libérer), après les exercices. Clé de champ : arbre-note. */
  protocole: {
    titre: "Tronc · Quelle peur je porte, et pour qui ?",
    intro: "**Objectif :** alléger la peur héritée. **Sous-objectif :** repérer mes périodes sensibles, faire la part entre ma vie et mon histoire familiale, et rendre symboliquement la part qui appartient à ma lignée. **Intensité moyenne.** Lettre et feu (2 sur 2).",
    materiel: "Ton carnet, des crayons de couleur, et ton affiche [« Mon arbre de vie »](arbre-de-vie-affiche.html). Le cadre du suivi est dans [le mode d’emploi](mode-emploi-suivi.html). Pour le feu : un récipient en métal ou en terre cuite, posé sur une surface stable, et un verre d’eau à côté, comme l’explique [le mode d’emploi](mode-emploi-suivi.html#feu).",
    etapes: [
      {
        titre: "**Explorer** · 20 min",
        etapes: [
          "**Mon calendrier sensible (10 min).** Les moments de l’année où la peur ou la fatigue reviennent.",
          "**Les dates de ma lignée (10 min).** Les dates familiales que tu connais. Note les rapprochements comme des pistes : une date proche peut être une coïncidence, note simplement ce qu’elle évoque pour toi."
        ]
      },
      {
        titre: "**Transformer** · 45 min",
        etapes: [
          "**Ouvrir (2 min).** Bougie, respiration lente.",
          "**Ma peur en trois colonnes (8 min).** La peur, ce qui vient de ma vie, ce qui me semble venir de ma famille.",
          "**La lettre courte (15 min).** « À toi (un prénom, ou « ceux d’avant moi »), je te rends la part de peur qui t’appartient. Je garde ta force de… Aujourd’hui, je choisis la confiance. »",
          "**Le feu (10 min).** Brûle la lettre en suivant [la consigne du mode d’emploi](mode-emploi-suivi.html#feu), ou déchire-la : « Je confie cette peur au feu, et je choisis la confiance. »",
          "**Bouger (10 min).** Secoue doucement les mains, les bras, les jambes. Souffle fort. Puis nomme cinq objets autour de toi."
        ]
      },
      {
        titre: "**Intégrer** · 15 min",
        etapes: [
          "**Apaiser (5 min).**",
          "**Clôture commune (3 min).** Lis à voix haute [le texte de fin de rituel et de réunification intérieure](mode-emploi-suivi.html#cloture).",
          "**Mon calendrier doux et mon arbre (7 min).** Note tes périodes sensibles dans ton agenda avec une phrase : « Aujourd’hui, je suis en sécurité, et je vis ma vie. » Sur ton arbre, colore une racine apaisée."
        ]
      }
    ],
    questions: [
      {
        k: "arbre-note",
        q: "Ce que j’ai posé sur mon arbre ce mois-ci",
        ph: "Exemple : une racine colorée en vert tendre, pour la peur de manquer que j’ai rendue à mon grand-père."
      }
    ]
  },

  lectures: [
    { lien: 'syndrome-anniversaire.html', titre: "Les dates qui se répondent", resume: "Le syndrome d’anniversaire entre faits, hypothèses et coïncidences : comment regarder les dates de ta lignée avec prudence." },
    { lien: 'peur-de-manquer-d-argent.html', titre: "La peur de manquer, d’où vient-elle ?", resume: "Quand une peur semble venir des années difficiles vécues par ceux d’avant : des pistes pour la reconnaître et choisir la confiance." },
    { lien: 'memoire-transgenerationnelle.html', titre: "La mémoire transgénérationnelle", resume: "Ce qui se transmet d’une génération à l’autre, et ce qu’on peut vraiment en dire, avec nuance." }
  ],

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-periodes-jan', q: "Quelles périodes sensibles as-tu repérées ce mois-ci ?", ph: "Exemple : la fin novembre et la veille de chaque départ en voyage." },
    { k: 'fin-part-jan', q: "Qu’as-tu compris de la part qui vient de ta vie, et de celle qui semble venir de ta famille ?", ph: "Exemple : ma peur de manquer vient un peu de ma vie, et beaucoup, peut-être, de la ferme vendue. C’est une piste qui me parle." },
    { k: 'fin-rendu-jan', q: "Quelle part de peur as-tu rendue, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : la peur de tout perdre. Je respire mieux en regardant mes comptes, et je m’autorise de petits plaisirs." },
    { k: 'fin-force-jan', q: "Quelle force de ta lignée gardes-tu avec toi ?", ph: "Exemple : la force de recommencer de mes grands-parents, et leur sens du partage." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer à l’étape suivante, autour de ton prénom et des attentes posées sur toi ?", ph: "Exemple : découvrir l’histoire de mon prénom, et les attentes posées sur moi.", court: true }
  ],

  carnet: {
    titre: 'Mon intention, mes valeurs',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Dans ton carnet, tu choisis tes valeurs et tu poses ton intention pour l’année : reporte ta phrase de sécurité et ton geste de confiance, ils deviennent le socle de ton intention."
  },

  aVenir: [
    { mois: 'Étape 5 · Tronc', titre: "Quel projet a-t-on posé sur moi ?", texte: "Découvrir l’histoire de ton prénom et les attentes posées sur toi, puis écrire ton propre contrat avec la vie.", image: 'assets/cartes/ecrire-la-mienne-mini.jpg' },
    { mois: 'Étape 6 · Tronc', titre: "Quelles émotions avaient le droit d’exister ?", texte: "Voir les émotions bienvenues et celles mises de côté dans ta famille, distinguer émotion et sentiment, et écrire à l’une d’elles.", image: 'assets/cartes/faire-semblant-mini.jpg' },
    { mois: 'Étape 7 · Branches', titre: "Quelles phrases me guident ?", texte: "Collecter les phrases de ta famille, voir où elles agissent dans ta vie, et les réécrire avec tes propres mots.", image: 'assets/cartes/boucle-spirale-mini.jpg' }
  ]
};
