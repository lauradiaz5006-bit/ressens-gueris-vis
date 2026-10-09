/* Genesolia · Le Cercle · Mon suivi « Je me libère » d'avril 2027 : « Les secrets et les non-dits »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-04',
  cle: 'suivi-2027-04',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-04-0df5f051e5.pdf',
  nomMois: 'avril 2027',
  moisSuivant: 'mai',
  titre: 'Les secrets et les non-dits',
  sousTitre: "Écouter les silences de ta famille, repérer les indices, et oser, à ton rythme, poser une question.",
  citation: "Ce qui n’est pas dit cherche souvent un autre chemin pour se faire entendre.",
  audio: '',
  audioCourt: '',
  saisonLien: "Avril, c’est la floraison. Les bourgeons s’ouvrent, les fenêtres aussi, on secoue les tapis et on laisse entrer l’air du printemps. Ce mois-ci, tu peux ouvrir une autre fenêtre, plus intime : celle des silences de ta famille. Pas toutes à la fois, et seulement si tu le souhaites : une fleur s’ouvre à son rythme.",
  intensiteQ: "À quel point les silences de ta famille pèsent-ils sur toi aujourd’hui ?",
  souhaitPh: "Exemple : cette gêne que je sens chaque fois qu’on parle de mon grand-père, sans savoir pourquoi.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-coffret.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ce-silence-mini.jpg', "Ce silence ne dit rien de ma valeur."]
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Tu n’as rien à découvrir de force ce mois-ci : seulement à écouter.",
    theme: "Lis cette page comme une lettre. Si un souvenir te revient, laisse-le simplement venir, sans chercher à tout comprendre.",
    voir: "Cette semaine, tu remarques les silences, comme on remarque une fenêtre fermée. Tu n’as pas à l’ouvrir.",
    source: "Relier les indices, c’est comme un puzzle : certaines pièces manqueront peut-être toujours. Ce n’est pas grave.",
    liberer: "Reconnaître un silence ne veut pas dire trahir ceux qui l’ont gardé. Tu peux les respecter et poser le poids.",
    remplacer: "Tu restes libre de poser ta question, d’attendre, ou de garder pour toi ce que tu sais. Tous ces choix sont justes.",
    meditation: "Une fois dans le mois, un soir tranquille. Si une émotion monte, reviens à ton souffle : tu peux t’arrêter à tout moment.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Tu as écouté les silences, et c’est déjà beaucoup."
  },

  theme: {
    titre: "Écouter les silences de ta famille",
    texte: [
      "Avril, c’est le renouveau. La nature se réveille, les fenêtres s’ouvrent, on fait entrer l’air. Ce mois-ci, tu peux aussi ouvrir une autre fenêtre, plus intime : celle des silences de ta famille.",
      "Chaque famille a ses sujets qu’on évite, ses phrases laissées en suspens, ses histoires racontées à moitié : « on n’en parle pas », « c’était une autre époque ». Ce mois-ci ne te demande pas de tout découvrir. Il t’invite à remarquer ce qui se tait, avec douceur, à relier ce que tu as déjà entendu ici et là, et à décider toi-même jusqu’où tu veux aller.",
      "Tu continues le deuxième temps de ton année de suivi : **Traverser**, de janvier à juin. Après l’amour et la fratrie, tu traverses ce mois-ci le fil le plus discret de ta lignée : celui de ce qui n’a pas été dit."
    ],
    sousTitre: "Comment un secret se transmet",
    texte2: [
      "En psychogénéalogie, on observe qu’un secret de famille ne disparaît pas parce qu’on le tait. Il se transmet autrement : par une gêne, un sujet interdit, une émotion qui surgit sans raison apparente, une date anniversaire qui rend tout le monde nerveux sans qu’on sache pourquoi. Les enfants sentent ces silences sans les comprendre, et peuvent porter plus tard une inquiétude ou un tabou dont ils ignorent l’origine.",
      "Le plus souvent, ceux qui gardent un secret le font pour protéger : par pudeur, par honte, par peur de blesser ou d’être jugé·e. Une naissance avant le mariage, une faillite, un parent parti, une origine qu’on préférait taire : ce qui était lourd à une époque peut sembler plus léger aujourd’hui. Il ne s’agit donc pas de juger, mais de comprendre ce qui a pesé sur la parole. Pour aller plus loin : [le secret de famille](secret-de-famille.html).",
      "Ce mois-ci, tu vas **voir** les silences, **relier** les indices entre eux, **reconnaître** ce qui a été tu sans avoir à le porter, et **choisir** ce que tu veux en faire, sans rien forcer.",
      "Un mot important : tu restes libre à chaque étape. Libre de ne pas chercher, de ne pas poser de question, d’attendre des années, ou de garder pour toi ce que tu découvres. Si un sujet réveille quelque chose de trop lourd, arrête-toi, reviens au souffle, et parles-en à une personne de confiance."
    ],
    exemplesTitre: "À quoi ressemble un non-dit, au quotidien",
    exemples: [
      "**Le sujet qui change** : dès que tu demandes comment tes grands-parents se sont rencontrés, ta mère se lève pour aller chercher le dessert.",
      "**La date qui pèse** : chaque année, en novembre, ton père devient sombre et silencieux. Personne ne dit pourquoi, tout le monde fait attention.",
      "**La photo découpée** : dans l’album de famille, il manque une moitié de photo, et une page entière a été arrachée.",
      "**Le prénom qu’on ne prononce plus** : tu sais qu’il y avait un oncle Pierre, mais on n’en parle jamais, et quand tu demandes, on dit « laisse ».",
      "**L’histoire toujours racontée pareil** : la même anecdote, avec les mêmes mots, chaque Noël, comme un texte appris par cœur qui protège autre chose."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Au repas, ta tante évoque « l’époque de Marseille », puis s’arrête net. La boucle aurait baissé les yeux et changé de sujet, comme toujours. La spirale remarque le silence, respire, et dit simplement, plus tard, en aidant à débarrasser : « Tu me raconterais Marseille, un jour ? » Elle répond : « Un jour, oui. » Le silence est encore là, mais une porte s’est entrouverte.",
    question: { k: 'theme-silence', q: "En une phrase, quel silence ou quel sujet évité sens-tu le plus dans ta famille ?", ph: "Exemple : on ne parle jamais de la première femme de mon grand-père, ni de ce qui lui est arrivé." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "Les silences, sous tes yeux",
      intro: "Cette semaine, tu poses sur la table les silences de ta famille. Tu ne cherches pas à deviner ce qui se cache : tu remarques seulement où la parole s’arrête, qui se tait, et quels petits indices tu as déjà vus sans y prêter attention.",
      texte: "Commence par la carte des silences, au calme, une vingtaine de minutes. Puis, pendant la semaine, écoute les conversations de famille et remarque les moments où elles s’arrêtent net ou changent de sujet.",
      exercices: [
        { k: 'ex1', titre: "La carte des silences", type: 'tableau', rangs: 3,
          etiquettes: ['Un sujet qu’on évite', 'Une histoire racontée à moitié', 'Une date, un lieu ou un prénom qui gêne'],
          consigne: "Pour chacune de ces trois lignes, note ce qui te vient, même si ça te semble anodin : un départ, un mariage, une période, un lieu, une personne. Indique qui se tait ou change de sujet, puis l’indice qui t’a mis·e sur la piste. Tu n’as pas à deviner ce qui se cache : observe seulement.",
          pourquoi: "Un silence laisse des traces : une date qui ne colle pas, une photo découpée, un parent qui change de sujet. Mis bout à bout, ces petits indices dessinent souvent une forme. Les écrire t’aide à voir ce que tu sentais déjà sans le savoir.",
          colonnes: [
            { q: "Quel est ce sujet, cette histoire, ou cette date ?", ph: ["Exemple : la guerre de mon grand-père en Algérie", "Exemple : la rencontre de mes parents, toujours en deux phrases", "Exemple : le village natal de ma grand-mère, jamais nommé"] },
            { q: "Qui se tait, ou change de sujet ?", ph: ["Exemple : mon grand-père lui-même, et ma mère qui le protège", "Exemple : mon père, qui dit « c’est de l’histoire ancienne »", "Exemple : ma grand-mère, qui répond « là-bas »"] },
            { q: "Quel indice as-tu remarqué ?", ph: ["Exemple : il quitte la pièce quand il y a un reportage à la télévision", "Exemple : leur mariage date de quatre mois avant ma naissance", "Exemple : une carte postale cachée dans sa boîte à couture"] }
          ],
          apres: { k: 'ex1-indices', q: "Relis ta carte. Qu’est-ce que tu remarques : une période, une personne, un lieu qui revient dans plusieurs silences ?", ph: "Exemple : tout tourne autour des années 1960 et de la famille de ma grand-mère. Plusieurs silences se touchent." } },
        { k: 'voir-journal', titre: "Mon journal des silences", type: 'texte',
          consigne: "Chaque fois que, cette semaine, une conversation de famille s’arrête net, change de sujet, ou qu’un silence se fait, note-le le jour même : la situation, le thème évité, et ce que tu as ressenti dans ton corps. Vise au moins trois observations. Si tu ne vois pas ta famille cette semaine, note les souvenirs qui te reviennent.",
          pourquoi: "On a souvent appris enfant à ne pas remarquer les silences, pour ne pas déranger. Les noter, c’est te redonner le droit de voir ce que tu vois. Et ton corps sent souvent un non-dit avant ta tête.",
          q: "Ce que tu remarques, en général, quand un silence se fait dans ta famille",
          ph: "Exemple : je sens une tension dans les épaules, et je me mets à parler très vite pour remplir le vide.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque observation : le jour, la scène, le thème évité, ce que tu as ressenti", ph: "Exemple : dimanche, au téléphone avec ma mère. J’ai parlé de Lyon, elle a changé de sujet en deux secondes. Gorge serrée." } }
      ],
      conseil: "Tu n’as pas besoin de questionner qui que ce soit cette semaine : écouter suffit. Si un souvenir ou un indice te trouble, pose le stylo, respire, sors marcher. Tu peux reprendre un autre jour, ou laisser cette ligne vide." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "Relier les indices",
      intro: "Un silence de famille a presque toujours une raison : protéger quelqu’un, éviter une honte, ne pas rouvrir une blessure ancienne. Cette semaine, tu relies doucement les indices entre eux, et tu regardes comment ces silences ont pu se poser sur ta propre vie.",
      texte: [
        "Les secrets touchent souvent les deux cycles. Le **cycle de la racine** parle de sécurité : un secret sur l’argent, une faillite, une origine, un exil, une naissance hors mariage, tout ce qui pouvait menacer la place de la famille. Le **cycle du cœur** parle de lien : un amour caché, un enfant parti, une dispute jamais réparée, un parent dont on ne parle plus.",
        "Un non-dit de la racine peut se transmettre en peur de manquer, en méfiance d’une région, en « on ne parle pas d’argent ». Un non-dit du cœur peut se transmettre en difficulté à faire confiance, en sentiment que l’on cache toujours quelque chose. Tu n’as pas à savoir ce qui s’est passé pour sentir ce que le silence t’a transmis."
      ],
      exercices: [
        { k: 'source-arbre', titre: "Dans ton arbre, cherche les zones floues", type: 'questions',
          consigne: "Prends ces questions une par une, à ton rythme. Si une réponse ne vient pas, passe à la suivante. Tu peux aussi relire ta carte des silences et chercher les indices qui se répondent : des dates, des lieux, des prénoms.",
          pourquoi: "Relier les indices, c’est passer de l’impression floue (« il y a quelque chose ») à une forme plus claire (« tout tourne autour de cette période »). Souvent, cela suffit à alléger le poids, même sans connaître toute l’histoire.",
          choix: { k: 'cycle', q: "Aujourd’hui, les silences de ta famille touchent surtout…", options: ['La racine : l’argent, les origines, la place de la famille', 'Le cœur : un amour, un départ, une personne dont on ne parle plus', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-jamais', q: "De quoi ne parle-t-on jamais dans ta famille ?", ph: "Exemple : de la jeunesse de ma grand-mère, avant son mariage." },
            { k: 'source-moitie', q: "Quelles histoires sont racontées à moitié, ou toujours exactement de la même façon ?", ph: "Exemple : le départ de mon grand-père « pour le travail », toujours en une phrase, et on passe à autre chose." },
            { k: 'source-dates', q: "Quelles dates, quels lieux ou quels prénoms provoquent un silence ou une gêne ?", ph: "Exemple : le prénom Lucienne, et la ville de Toulon." },
            { k: 'source-sait', q: "Qui semble savoir quelque chose sans jamais le dire ?", ph: "Exemple : ma grand-tante Odette. Elle a toujours un petit sourire triste quand on parle du passé." },
            { k: 'source-toi', q: "Dans ta propre vie, y a-t-il une peur, un tabou ou une habitude dont tu ignores l’origine ?", ph: "Exemple : je n’ose jamais parler d’argent, même avec mon compagnon, et je ne sais pas pourquoi." }
          ] },
        { k: 'source-arbre-en-ligne', titre: "Les zones floues de ton arbre", type: 'questions',
          consigne: "Ouvre [ton arbre familial](genosociogramme.html) et repère les zones floues : dates manquantes, personnes dont on sait peu, événements évoqués à mi-voix. Note-les ici. Tu peux aussi vérifier si certaines dates se répondent avec [le calcul du syndrome anniversaire](calcul-syndrome-anniversaire.html).",
          questions: [
            { k: 'source-flou', q: "Quelles zones floues as-tu repérées dans ton arbre ?", ph: "Exemple : je ne connais ni la date de naissance ni le métier de mon arrière-grand-père paternel. Et il y a cinq ans sans rien chez ma grand-mère, entre 1952 et 1957.", lignes: 3 },
            { k: 'source-relie', q: "Quels indices semblent se répondre entre eux ?", ph: "Exemple : la date du mariage de ma grand-mère, la carte postale de Toulon et le prénom Lucienne : tout se passe la même année.", lignes: 3 }
          ] }
      ],
      conseil: "Tu n’as pas à tout comprendre, ni à tout reconstituer. Certaines pièces du puzzle manqueront peut-être toujours, et ton chemin reste entier. Si une découverte te bouleverse, pose le stylo, respire, et parles-en à une personne de confiance avant d’aller plus loin." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "Reconnaître sans porter",
      intro: "Tu n’as pas à garder le silence des autres, ni à le briser de force. Il existe un chemin entre les deux : reconnaître ce qui a été tu, avec respect pour ceux qui l’ont gardé, et poser le poids que tu portais sans le savoir. C’est ce que tu fais cette semaine.",
      exercices: [
        { k: 'liberer-lettre', titre: "La lettre au silence", type: 'questions',
          consigne: "Écris une lettre au silence lui-même, ou à la personne qui a gardé un secret. Commence par « Toi, le silence de notre famille… » ou par son prénom. Dis ce que tu as senti sans comprendre, ce que tu aimerais savoir, ce que tu reconnais, et ce que tu choisis de faire désormais. Cette lettre n’est pas faite pour être envoyée. Elle est pour toi seul·e.",
          pourquoi: "Un secret pèse souvent moins par ce qu’il cache que par le fait qu’on ne peut rien en dire. Écrire au silence, c’est enfin pouvoir lui parler, sans risque pour personne. On garde le respect pour ceux qui se sont tus, et on se rend sa liberté.",
          questions: [
            { k: 'lettre-a', q: "À qui, ou à quoi, écris-tu ?", ph: "Exemple : au silence autour de mon grand-père Pierre", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu as senti, ce que tu aimerais savoir, ce que tu reconnais, ce que tu choisis", ph: "Exemple : Toi, le silence de notre famille, je t’ai senti à chaque Noël, quand on évitait de parler de Pierre. Je ne sais pas ce qui s’est passé, et je n’ai peut-être pas besoin de tout savoir. Je reconnais que tu as protégé quelqu’un. Je choisis de ne plus te porter dans mes épaules, et de parler librement de mes propres histoires.", lignes: 7 }
          ] }
      ],
      rituel: {
        titre: "La fenêtre ouverte",
        intro: "Ce rituel symbolique marque ton choix de laisser entrer un peu d’air dans les silences de ta famille, sans rien forcer. Fais-le une fois cette semaine, idéalement après la carte des silences et la lettre. Il dure une dizaine de minutes, le matin de préférence.",
        materiel: "Une feuille de papier, un stylo, une enveloppe, et une fenêtre que tu peux ouvrir. Si tu veux, une fleur de saison posée sur le rebord.",
        etapes: [
          "Choisis un moment calme. Place-toi devant une fenêtre fermée et respire trois fois profondément.",
          "Écris sur la feuille un silence de ta famille, en quelques mots, sans détail.",
          "Ouvre la fenêtre. Respire l’air du printemps et dis : « Je reconnais ce qui a été tu. Je respecte ceux qui l’ont gardé. Je n’ai pas à le porter seul·e. »",
          "Lis ta feuille à voix basse, puis plie-la et glisse-la dans l’enveloppe.",
          "Reste quelques minutes devant la fenêtre ouverte. Écoute les bruits du dehors, les oiseaux, le vent. Laisse venir ce qui vient.",
          "Range l’enveloppe dans un endroit choisi, puis note ci-dessous ce que tu as ressenti."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : ce que tu as écrit, et ce que tu as ressenti devant la fenêtre ouverte.", ph: "Exemple : j’ai écrit « Lucienne ». En ouvrant la fenêtre, j’ai senti mes épaules descendre. J’ai entendu un merle, et j’ai pleuré un peu, doucement." }
      },
      conseil: "Si écrire la lettre ou faire le rituel réveille une émotion forte, fais une pause, bois un verre d’eau, sors marcher. Tu peux finir un autre jour. Ce qui compte, c’est d’avoir commencé à regarder, à ton rythme." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: "Oser, à ton rythme",
      intro: "Tu as vu les silences, relié les indices, reconnu ce qui a été tu. Cette semaine, tu choisis ce que tu veux en faire : préparer une question, la poser si tu t’en sens prêt·e, ou simplement l’écrire. Et tu poses un geste différent dans ta propre parole.",
      texte: [
        "**La première pause.** Quand tu sens le vieux réflexe du silence arriver (te taire, changer de sujet, faire comme si tu n’avais rien vu), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis-toi : « Je te reconnais. Ce silence n’est pas le mien. Aujourd’hui, je peux choisir ma parole. »",
        "**Oser une question, ou non.** Commence par ce qui est léger : une photo, un lieu, une époque. Une question ouverte et chaleureuse, sans accusation, comme « Comment était-ce à cette époque ? ». Et souviens-toi : ne pas la poser est aussi un choix juste, si tu sens que ce n’est pas le moment."
      ],
      exercices: [
        { k: 'ex2', titre: "Les questions possibles", type: 'blocs', nb: 3,
          etiquettes: ['Première personne', 'Deuxième personne', 'Troisième personne'],
          consigne: "Choisis trois personnes de ta famille qui pourraient savoir quelque chose. Pour chacune, écris une question simple et ouverte, sans accusation, puis ce que tu ressens à l’idée de la poser. Tu décideras ensuite si tu le fais, et quand.",
          pourquoi: "Préparer une question à l’avance permet de la poser calmement, avec des mots doux. Et noter ce que tu ressens t’aide à savoir si tu es prêt·e, ou si tu as besoin d’attendre. Les deux sont légitimes.",
          astuce: "Une bonne question parle d’une photo, d’un lieu ou d’une époque, pas d’un secret. « Tu as des photos de mamie jeune ? » ouvre plus de portes que « Qu’est-ce qu’on m’a caché ? ».",
          champs: [
            { q: "À qui pourrais-tu poser une question ?", ph: ["Exemple : ma grand-tante Odette", "Exemple : mon père", "Exemple : la cousine de ma mère, qui a les albums"] },
            { q: "Quelle question, formulée simplement ?", ph: ["Exemple : « Comment était maman quand elle était petite ? »", "Exemple : « Tu te souviens de la maison de Toulon ? »", "Exemple : « On pourrait regarder les vieilles photos ensemble ? »"] },
            { q: "Que ressens-tu à l’idée de la poser ?", ph: ["Exemple : de la curiosité, et un peu de peur de la faire pleurer", "Exemple : beaucoup de peur. Je préfère attendre encore un peu.", "Exemple : de l’envie. Je me sens prête."] }
          ] },
        { k: 'ex3', titre: "Mon geste de parole", type: 'texte',
          consigne: "Choisis un geste différent pour ta propre parole : poser une de tes questions, l’écrire dans une lettre que tu garderas, ou dire enfin une chose vraie sur ta propre vie. Écris-le, puis note chaque fois que tu l’as osé et ce qui s’est passé. Ce geste rejoint ton carnet « J’avance » : dire vrai, c’est aussi sortir des silences dont on a hérité.",
          pourquoi: "On ne change pas un héritage de silence en une conversation. On le change par de petits gestes de parole, répétés : une question douce, une vérité sur soi, un « je ne sais pas, mais j’aimerais savoir ». Chaque mot posé rend le suivant plus facile.",
          gestes: ["Poser une question légère sur une photo ou un lieu", "Écrire ta question dans un carnet, sans la poser", "Parler à tes enfants d’un souvenir de ta propre vie", "Dire « je préfère ne pas en parler » au lieu de mentir", "Remercier la personne qui t’a raconté quelque chose", "Partager une de tes propres vérités avec un·e proche"],
          q: "Ton geste : « Au lieu de me taire comme d’habitude, je vais… »",
          ph: "Exemple : au lieu de changer de sujet quand on parle du passé, je vais demander à ma grand-tante si elle veut bien me montrer ses photos.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as osé : quand, ce que tu as dit, et ce qui s’est passé", ph: "Exemple : samedi, j’ai demandé à Odette ses photos. Elle m’a montré mamie à 20 ans, à Toulon. Elle n’a pas tout dit, mais elle a souri." } }
      ],
      conseil: "Si la personne ne veut pas répondre, ou se ferme, ce n’est pas un échec : tu as respecté ta parole et la sienne. Remercie-la, et laisse le temps faire. Et si tu découvres quelque chose de lourd, tu as le droit de le garder pour toi, d’en parler à une personne de confiance, et de t’arrêter là." }
  ],

  meditation: {
    titre: "La maison aux volets clos",
    intro: "Une séance guidée pour traverser la maison de ta famille, t’arrêter devant une porte close sans avoir à l’ouvrir, et laisser entrer l’air du printemps.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens le poids de ton corps sur le siège. Sens tes pieds sur le sol. Tu es en sécurité, ici et maintenant. Tu peux revenir à ton souffle, et ouvrir les yeux, à tout moment.",
      "Imagine une maison de famille, un matin d’avril. Le portail grince un peu, le jardin commence à fleurir, les premières feuilles sont d’un vert tendre. Pourtant, certains volets sont encore fermés.",
      "Tu entres. Tu traverses la cuisine, le salon, les chambres. Tu reconnais des objets, des odeurs, des voix lointaines : chaque pièce raconte une partie de l’histoire de ta famille. La plupart sont claires.",
      "[pause]",
      "Au bout d’un couloir, une porte reste close. Tu n’as pas besoin de l’ouvrir. Tu peux simplement t’arrêter devant. Pose ta main sur la porte. Sens qu’elle a été fermée pour protéger quelqu’un, peut-être par peur, peut-être par pudeur, peut-être par amour. Dis intérieurement : « Je sais que tu es là. »",
      "Si tu le souhaites, entrouvre-la à peine. Un mince filet de lumière passe. Tu n’as rien à voir de plus, rien à comprendre maintenant. Si tu préfères la laisser fermée, c’est juste aussi.",
      "[longue pause]",
      "Retourne dans le couloir. Ouvre un volet, puis un autre. L’air du printemps entre dans la maison, la poussière danse dans la lumière. La maison respire un peu mieux, et toi aussi.",
      "Sens que tu peux revenir ici quand tu veux, à ton rythme. Personne ne te presse. Certaines portes s’ouvrent en une fois, d’autres petit à petit, au fil des années, et d’autres restent fermées. Ta vie est entière dans tous les cas.",
      "[pause]",
      "Dis-toi intérieurement : « Je respecte ce qui a été tu. Je garde ma liberté de parler. » Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes, le matin de préférence, avec une fenêtre entrouverte. Si une émotion forte monte devant la porte, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux arrêter la séance et la reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une pièce, une porte, un objet, une sensation, un mot…", ph: "Exemple : la porte était celle de la chambre de mon arrière-grand-mère. Je ne l’ai pas ouverte, mais j’ai senti beaucoup de douceur en posant ma main dessus." }
  },

  bilanTitre: "Ce que ce mois a laissé respirer",
  bilan: [
    { k: 'fin-silence', q: "Quel silence de ta famille as-tu reconnu ce mois-ci ?", ph: "Exemple : le silence autour de la jeunesse de ma grand-mère, à Toulon." },
    { k: 'fin-indices', q: "Qu’as-tu compris en reliant les indices, même sans tout savoir ?", ph: "Exemple : que ma peur de parler d’argent vient peut-être de la faillite dont on ne parle jamais chez mes grands-parents." },
    { k: 'fin-choix', q: "Qu’as-tu choisi d’en faire, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : j’ai posé une question douce à ma grand-tante, et je laisse le reste au temps. Je me sens plus légère, moins en alerte." },
    { k: 'fin-parole', q: "Quel geste de parole as-tu osé, pour toi-même ?", ph: "Exemple : j’ai raconté à ma fille l’histoire de mon premier travail. Je ne lui avais jamais dit." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en mai ?", ph: "Exemple : continuer à parler librement de ma vie, et regarder ce que j’ai reçu de ma mère.", court: true }
  ],

  carnet: {
    titre: "Dire vrai",
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. On apprend souvent à se taire là où les générations d’avant ont dû se taire : ton carnet t’aide ce mois-ci à nommer ce que tu ressens, à le dire en quatre temps et à oser un mot vrai chaque jour. Reporte ton geste de parole dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Mai', titre: 'Ta mère, tes mères', texte: "Regarder ce que tu as reçu de ta mère et des femmes de ta lignée, garder le meilleur et faire autrement.", image: 'assets/cartes/ma-mere-mini.jpg' },
    { mois: 'Juin', titre: 'Du côté des pères', texte: "Regarder ce que tu as reçu de ton père et des hommes de ta lignée, et trouver ta propre façon d’avancer.", image: 'assets/cartes/deux-parents-mini.jpg' },
    { mois: 'Juillet', titre: 'L’argent et ta valeur', texte: "Regarder ce que ta lignée t’a transmis sur l’argent, et t’autoriser ta juste valeur.", image: 'assets/guide/guide-coffret.webp' }
  ]
};
