/* Genesolia · Le Cercle · Mon suivi « Je me libère » d'octobre 2027 : « Les âges qui se répondent »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Dernier mois de l'année du Cercle : il boucle la spirale ouverte en octobre 2026 avec « Ce qui revient ».
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-10',
  cle: 'suivi-2027-10',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-10-d5fd318737.pdf',
  nomMois: 'octobre 2027',
  moisSuivant: 'novembre',
  titre: 'Les âges qui se répondent',
  sousTitre: "Observer les âges et les dates qui reviennent dans ta famille, et vivre chacun d’eux à ta façon.",
  citation: "Un âge n’est pas un destin : c’est une page que tu écris.",
  audio: '',
  audioCourt: '',
  saisonLien: "Octobre est le mois du lâcher-prise et du passage. Les feuilles tombent sans regret, la lumière change, l’arbre se prépare à un nouveau cycle. C’est le bon moment pour regarder les âges et les dates qui reviennent dans ta famille, déposer ceux qui pèsent, et passer, toi aussi, d’un tour de spirale au suivant.",
  intensiteQ: "À quel point un âge, une date ou une saison de l’année pèse-t-il dans ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette tristesse qui revient chaque novembre, sans que je sache vraiment pourquoi.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-spirale-or.webp',
      voir: 'assets/guide/guide-nombres.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-douce.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/aujourdhui-spirale-mini.jpg', 'Aujourd’hui, je choisis la spirale.']
    }
  },

  mots: {
    saison: "Respire avec l’automne. Ce mois-ci, tu boucles une année entière : prends le temps de sentir tout le chemin.",
    theme: "Lis cette page avec curiosité. Un écho d’âge est une observation, jamais une prédiction.",
    voir: "Cette semaine, tu fais un peu de calcul, et beaucoup de tendresse. Entoure les échos, sans en tirer de conclusion.",
    source: "Certaines dates touchent des départs ou des disparitions. Va doucement, et arrête-toi dès que tu en as besoin.",
    liberer: "Les dates de ta lignée appartiennent à leur histoire. Les tiennes, tu peux les vivre à ta façon.",
    remplacer: "Un anniversaire, une saison, un âge : tu peux en faire un moment de douceur ou de fête. C’est toi qui choisis.",
    meditation: "La dernière séance de l’année. Un soir calme, une bougie peut-être. Si une émotion monte, reviens simplement à ton souffle.",
    bilan: "Ton dernier bilan de l’année. Regarde d’où tu viens : la boucle est devenue spirale."
  },

  theme: {
    titre: 'Le mois du bilan',
    texte: [
      "Octobre, les feuilles tombent et la lumière change. L’automne invite à faire le point. Voilà un an que tu avances avec Le Cercle : en octobre dernier, tu regardais « Ce qui revient ». Aujourd’hui, tu reviens au même endroit de l’année, un tour plus haut, pour regarder le chemin parcouru, les découvertes, les questions posées, les liens retrouvés.",
      "Ce mois-ci, tu t’intéresses au temps qui passe dans ta famille : les âges, les anniversaires, les dates qui semblent revenir. Non pour y lire l’avenir, mais pour mieux comprendre ton histoire et choisir comment tu veux vivre la suite. C’est le dernier mois du troisième temps de l’année, **Transmettre** : après avoir vu (d’octobre à décembre), puis traversé (de janvier à juin), tu choisis ce que tu fais passer, et tu boucles ton premier tour de spirale."
    ],
    sousTitre: 'Les âges en écho',
    texte2: [
      "On observe parfois qu’un événement marquant revient à un âge ou à une date proche de celui vécu par un·e ancêtre : un départ, un changement de vie, un mariage, au même âge qu’un parent ou un grand-parent. Une femme quitte son emploi à quarante-deux ans, l’âge où sa mère a perdu son père ; un homme se sent inquiet en approchant de l’âge où son grand-père a disparu. C’est ce qu’on appelle souvent les dates anniversaires.",
      "C’est une observation, pas une loi. Beaucoup de coïncidences n’ont aucun sens particulier, et rien n’est écrit d’avance. Remarquer un écho peut simplement t’aider à comprendre pourquoi une période te pèse, ou t’émeut. Une fois l’écho reconnu, on se sent souvent plus libre de vivre cet âge autrement. Dans certaines familles, ce sont des dates qui se croisent : on se marie en juin depuis trois générations, ou novembre rappelle plusieurs départs. Pour aller plus loin : [les dates anniversaires](syndrome-anniversaire.html) et [la méthode des deux cycles](methode.html).",
      "Ce mois-ci, tu vas **voir** les âges et les dates de ta lignée, **remonter** aux échos possibles, **libérer** ceux qui ne t’appartiennent pas, et **choisir** de vivre chaque âge à ta façon."
    ],
    exemplesTitre: 'À quoi ressemble un écho d’âge ou de date, au quotidien',
    exemples: [
      "**Une saison qui pèse** : chaque année, fin novembre, tu te sens fatigué·e et nostalgique, et tu découvres que trois départs ont eu lieu ce mois-là dans ta famille.",
      "**Un âge que tu redoutes** : tu approches de 38 ans, l’âge où ta mère a tout quitté, et tu sens une agitation que tu ne t’expliques pas.",
      "**Un même âge pour un tournant** : tu as eu ton premier enfant à 24 ans, comme ta mère et ta grand-mère, sans l’avoir prévu.",
      "**Une date qui se croise** : ton fils est né le jour anniversaire de la naissance de ton grand-père, et toute la famille en parle encore.",
      "**Une fête qu’on évite** : chez vous, on ne fête jamais les 50 ans, sans que personne ne sache vraiment pourquoi."
    ],
    exempleSpirale: "La spirale, c’est le même âge, un cran plus haut. Ton père a quitté sa famille à 40 ans, et toi, à l’approche de tes 40 ans, tu sens une envie de tout envoyer promener. Tu remarques l’écho, tu le poses sur le papier, tu dis : « Cet âge a été le sien. Moi, je le vis à ma façon. » Pour tes 40 ans, tu organises un week-end avec les personnes que tu aimes. Le thème est le même, ta façon de le vivre a changé.",
    question: { k: 'theme-age', q: "En une phrase, quel âge, quelle date ou quelle saison résonne particulièrement dans ta vie ?", ph: "Exemple : le mois de mars. Chaque année, je me sens à fleur de peau, et ma mère aussi." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les âges de ta lignée',
      intro: "Cette semaine, tu poses sur la table les grands tournants de ta famille, avec leurs âges et leurs dates. Tu ne cherches pas encore à comprendre : tu notes, tu calcules, tu remarques ce qui fait écho.",
      texte: "Commence par le tableau des âges, au calme, une vingtaine de minutes, avec les dates que tu connais. Puis, dans la semaine, remarque les moments où une date, un âge ou une saison te reviennent en tête, et note-les dans ton journal.",
      exercices: [
        { k: 'ages', titre: 'Les âges en écho', type: 'tableau', rangs: 5,
          etiquettes: ['Un tournant de mes arrière-grands-parents', 'Un tournant de mes grands-parents', 'Un tournant de ma mère', 'Un tournant de mon père', 'Un tournant de ma vie'],
          consigne: "Pour chacun de ces cinq tournants (naissance d’un enfant, mariage, départ, changement de vie, disparition), note qui l’a vécu et de quoi il s’agissait, à quel âge et à quelle date si tu le sais, puis ton propre âge à ce moment-là, ou l’âge que tu auras. Si un écho apparaît, note-le simplement, sans en tirer de conclusion.",
          pourquoi: "Quand on écrit les âges de sa famille l’un sous l’autre, des correspondances apparaissent parfois : un même âge pour un départ, une même saison pour une naissance. Les voir sur le papier permet de les regarder calmement, comme des repères, et de reprendre la main.",
          colonnes: [
            { q: "Qui, et quel était ce tournant ?", ph: ["Exemple : mon arrière-grand-père Paul, parti à la guerre", "Exemple : ma grand-mère Rose, son mariage", "Exemple : ma mère, son départ de la maison familiale", "Exemple : mon père, son changement de métier", "Exemple : moi, ma séparation"] },
            { q: "À quel âge, et à quelle date si tu la connais ?", ph: ["Exemple : à 22 ans, en août 1914", "Exemple : à 19 ans, en juin 1952", "Exemple : à 18 ans, en septembre 1976", "Exemple : à 42 ans, au printemps 1995", "Exemple : à 34 ans, en novembre 2021"] },
            { q: "Quel âge avais-tu, ou auras-tu, à ce moment-là ?", ph: ["Exemple : je n’étais pas né·e, mais j’ai eu 22 ans en 2009", "Exemple : j’avais 19 ans quand je me suis installé·e en couple", "Exemple : je suis parti·e de chez mes parents à 18 ans, en septembre aussi", "Exemple : j’aurai 42 ans dans deux ans", "Exemple : ma mère avait 34 ans quand elle a quitté mon père"] }
          ],
          apres: { k: 'ages-echo', q: "Relis tes cinq lignes. Quels échos remarques-tu, un âge, une saison, un mois, et qu’est-ce que ça te fait de les voir ?", ph: "Exemple : ma mère et moi avons quitté le foyer au même âge, en septembre. Ça me surprend, et ça me soulage aussi de le voir écrit." } },
        { k: 'voir-dates', titre: 'Mon calendrier intérieur', type: 'texte',
          consigne: "Cette semaine, remarque les moments où une date, un âge ou une saison te reviennent en tête : un anniversaire qui approche, une odeur d’automne qui rappelle quelqu’un, une phrase sur « l’âge de ». Note-les le jour même : le moment, la date ou l’âge, ce que tu as ressenti. Vise au moins trois moments.",
          pourquoi: "Notre corps garde souvent la mémoire du calendrier mieux que notre tête : une fatigue chaque année à la même période, une joie inexpliquée au printemps. Repérer ces moments, c’est commencer à comprendre ton calendrier intérieur.",
          q: "Ce que tu remarques, en général, à propos des dates et des saisons dans ta vie",
          ph: "Exemple : je suis toujours plus fragile entre la Toussaint et mon anniversaire, début décembre.",
          journal: { k: 'voir-date', n: 6, q: "Chaque moment : le jour, la date ou l’âge qui est revenu, ce que tu as ressenti", ph: "Exemple : jeudi, en voyant la date du 14 sur mon agenda. C’est l’anniversaire de ma grand-mère. Une douceur, puis un peu de tristesse." } }
      ],
      conseil: "Ne cherche pas à tout relier : beaucoup de coïncidences n’ont aucun sens particulier, et une case sans écho est aussi une bonne nouvelle. Si un calcul te serre le cœur, pose ton stylo, respire, et reviens-y un autre jour. Pour t’aider, tu peux utiliser le [calcul des dates anniversaires](calcul-syndrome-anniversaire.html)." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'Les dates qui reviennent',
      intro: "Une date qui pèse ou un âge qu’on redoute viennent parfois d’une histoire ancienne, vécue par quelqu’un avant nous. Cette semaine, tu remontes le fil de ces dates, avec beaucoup de douceur, pour comprendre ce qu’elles ont laissé en toi.",
      texte: [
        "Les âges et les dates touchent souvent le **cycle de la racine** : la sécurité, le droit d’exister et de durer. Quand un parent a disparu jeune, quand une famille a tout perdu à un âge donné, ses descendant·es peuvent sentir une inquiétude en approchant de cet âge, comme si leur propre sécurité était en jeu.",
        "Ils touchent aussi le **cycle du cœur** : les anniversaires qu’on fête ou qu’on évite, les dates de mémoire, les liens qui se sont noués ou dénoués à une saison précise. Un mois de l’année peut rester chargé d’amour et de manque à la fois. On commence en général par la racine : te rappeler que tu es en sécurité, ici et maintenant, aide ensuite à vivre ces dates avec plus de douceur."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ton arbre, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante. Et si une question touche une disparition qui te fait encore beaucoup de peine, tu peux la laisser de côté : elle attendra.",
          pourquoi: "Souvent, on découvre qu’une saison difficile ou un âge redouté a une histoire. Le voir change tout : ce n’est plus « je suis toujours fragile en novembre », c’est une date de famille que je peux reconnaître, et vivre autrement.",
          choix: { k: 'cycle', q: "Aujourd’hui, les âges et les dates touchent surtout…", options: ['La racine : ma sécurité, le droit de durer et d’avancer', 'Le cœur : la mémoire des liens, les anniversaires, le manque', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-tournants', q: "À quel âge tes parents et tes grands-parents ont-ils vécu leurs grands tournants ?", ph: "Exemple : ma mère s’est mariée à 20 ans, mon père a changé de vie à 45 ans, ma grand-mère est devenue veuve à 50 ans." },
            { k: 'source-dates', q: "Quelles dates ou quels mois reviennent plusieurs fois dans ton arbre ?", ph: "Exemple : le mois de février : deux naissances et un mariage, sur trois générations." },
            { k: 'source-saison', q: "Y a-t-il une saison qui te pèse ou t’émeut chaque année ? Que s’est-il passé à cette saison dans ta famille, si tu le sais ?", ph: "Exemple : la fin de l’été. C’est à cette période que la maison de famille a été vendue, quand j’avais 10 ans." },
            { k: 'source-redoute', q: "Quel âge appréhendes-tu, ou attends-tu avec impatience ? Qui l’a vécu avant toi ?", ph: "Exemple : 50 ans. Mon grand-père a tout perdu à cet âge, et on en parlait souvent à table." },
            { k: 'source-protege', q: "Ta façon de vivre cette date ou cet âge t’a-t-elle protégé·e à un moment ? De quoi ?", ph: "Exemple : ne jamais fêter mon anniversaire m’évitait d’être déçu·e, comme ma mère qui disait que les fêtes finissaient toujours mal." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur un âge ou une date : à quel âge il ou elle a vécu un grand tournant, ou ce qui s’est passé à une saison qui revient. Par téléphone, à table, par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma mère : « Quel âge avait mamie quand elle est arrivée en France ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : elle avait 31 ans, comme moi aujourd’hui. J’ai compris pourquoi j’ai autant envie de partir cette année.", lignes: 3 }
          ] }
      ],
      conseil: "Les dates touchent parfois des départs ou des disparitions encore sensibles, pour toi ou pour la personne que tu interroges. Si c’est trop, arrête-toi, bois un verre d’eau, sors marcher, et reprends un autre jour, ou pas du tout. Tu peux compléter les dates dans [ton arbre familial](genosociogramme.html), et lire [devenir parent au même âge](devenir-parent-au-meme-age.html) si un âge de naissance te parle." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre les dates, choisir tes âges',
      intro: "Les dates de ta lignée appartiennent à leur histoire. Les tiennes t’appartiennent. Cette semaine, tu choisis trois dates qui comptent pour toi, tu écris à l’âge que tu as aujourd’hui, et tu rends symboliquement ce qui ne t’appartient pas, en bouclant ton année de Cercle.",
      exercices: [
        { k: 'mesdates', titre: 'Mes dates à moi', type: 'blocs', nb: 3,
          etiquettes: ['Première date', 'Deuxième date', 'Troisième date'],
          consigne: "Choisis trois dates ou périodes de l’année qui comptent pour toi : un anniversaire, une saison, un jour de mémoire. Note ce qu’elles évoquent dans ton histoire familiale. Puis écris comment tu veux les vivre à partir de maintenant : un geste, une sortie, un moment pour toi.",
          pourquoi: "Mettre ces dates sur papier, c’est reprendre la main. Tu peux décider d’en faire des moments de mémoire, de douceur ou de fête, au lieu de les subir chaque année sans comprendre.",
          astuce: "Une date de mémoire peut devenir un rendez-vous doux : une promenade le jour anniversaire d’un·e disparu·e, un repas pour célébrer une naissance, une journée rien qu’à toi.",
          champs: [
            { q: "Quelle date ou quelle période choisis-tu ?", ph: ["Exemple : le 2 novembre", "Exemple : mon anniversaire, le 8 mars", "Exemple : la fin du mois d’août"] },
            { q: "Que rappelle-t-elle dans ta famille ?", ph: ["Exemple : le départ de mon grand-père, et des Toussaint très silencieuses", "Exemple : on ne l’a presque jamais fêté, ma mère trouvait ça inutile", "Exemple : la vente de la maison de famille, et la fin des vacances ensemble"] },
            { q: "Comment choisis-tu de la vivre désormais ?", ph: ["Exemple : une promenade en forêt, et un gâteau qu’il aimait", "Exemple : un vrai repas avec mes amis, et un cadeau que je m’offre", "Exemple : un dernier pique-nique d’été avec mes cousins, chaque année"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à mon âge', type: 'questions',
          consigne: "Écris une lettre à l’âge que tu as maintenant. Tu ne l’enverras à personne. Dis-lui ce qu’il représente dans ta famille, ce que tu crains ou espères de lui. Remercie celles et ceux qui l’ont vécu avant toi, rends-leur ce qui leur appartient, puis raconte comment tu veux le vivre, toi, avec tes propres choix. Termine par ce que cette année de Cercle t’a apporté.",
          pourquoi: "On ne se libère pas d’un écho en le niant, mais en le reconnaissant. Écrire à ton âge, c’est lui donner sa juste place : celle d’une page neuve que tu écris toi-même.",
          questions: [
            { k: 'lettre-age', q: "Quel âge as-tu aujourd’hui ?", ph: "Exemple : 41 ans", court: true },
            { k: 'lettre-age-texte', q: "Ta lettre : « Cher âge que j’ai aujourd’hui… » Ce que tu représentes dans ma famille, ce que je crains ou espère, ce que je rends, comment je veux te vivre, ce que cette année m’a apporté", ph: "Exemple : Cher âge de 41 ans, tu es celui où ma mère a quitté la maison, et j’avais peur de toi. Je la remercie pour son courage, et je lui rends sa fuite. Moi, je veux te vivre en restant, en construisant, en voyageant aussi. Cette année de Cercle m’a appris que je peux choisir mes âges.", lignes: 7 }
          ] }
      ],
      rituel: {
        titre: 'Le fil des saisons',
        intro: "Ce rituel symbolique marque la fin d’une année de Cercle et t’aide à poser tes dates familiales avec douceur. Fais-le une fois cette semaine, après tes dates et ta lettre. Il dure environ quinze minutes.",
        materiel: "Un long fil ou une ficelle, quelques feuilles d’automne ou petits papiers, une bougie si tu le souhaites, ce carnet et un stylo.",
        etapes: [
          "Choisis un moment calme. Pose le fil devant toi, bien à plat : il représente le temps de ta lignée. Respire trois fois.",
          "Sur chaque feuille ou papier, écris une date ou un âge important de ta famille, et place-le le long du fil.",
          "Dis, à voix haute ou intérieurement : « Ces dates appartiennent à leur histoire. Je les reconnais avec respect. Je vous rends ce qui vous appartient. »",
          "Au bout du fil, pose un papier avec ton prénom et dis : « Mes âges m’appartiennent. Je les vis à ma façon. »",
          "Repense à cette année de Cercle et à ce que tu as découvert, mois après mois. Dis : « Merci pour ce premier tour de spirale. »",
          "Range le fil et les papiers dans une boîte ou dans ce carnet, puis note ci-dessous ce qui est venu."
        ],
        note: { k: 'rituel-fil', q: "Après le rituel, note ce qui s’est passé : les dates posées, ce que tu as ressenti en plaçant ton prénom au bout du fil, ce que tu retiens de ton année.", ph: "Exemple : j’ai posé sept dates. En mettant mon prénom au bout, j’ai senti mes épaules se relâcher. Je retiens que je ne suis pas condamné·e à répéter." }
      },
      conseil: "Si la lettre ou le rituel réveille une émotion forte, fais une pause, sors marcher, regarde les arbres. Tu peux finir un autre jour. Il n’y a aucune date limite pour clore une année : elle se boucle quand tu es prêt·e." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Vivre chaque âge à ta façon',
      intro: "Tu as vu les âges de ta lignée, tu as remonté les dates qui reviennent, tu as rendu ce qui ne t’appartenait pas. Cette semaine, tu choisis comment vivre tes propres dates, et tu célèbres ton année de Cercle.",
      texte: [
        "**La première pause.** Quand une date ou un âge te serre le cœur, respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis intérieurement : « Je te reconnais. Tu appartiens à leur histoire. Aujourd’hui, j’écris la mienne. »",
        "**Le geste qui célèbre.** Vivre un âge à sa façon commence par un petit geste : fêter un anniversaire qu’on évitait, transformer un jour de mémoire en promenade, s’offrir un moment rien qu’à soi à une saison difficile. Et cette semaine, offre-toi aussi un moment pour fêter ton année de Cercle : une promenade, un repas, une lettre."
      ],
      exercices: [
        { k: 'ex3', titre: 'Le geste qui célèbre', type: 'texte',
          consigne: "Choisis ton geste pour vivre une date ou un âge à ta façon, écris-le, puis note chaque fois que tu l’as fait, et ce qui a changé. Ajoute aussi la façon dont tu as fêté ton année de Cercle. Ce geste devient un appui dans ton carnet « J’avance », pour ton bilan de l’année.",
          pourquoi: "Un écho reconnu perd beaucoup de sa force. Un écho que l’on transforme en moment choisi devient une ressource. Chaque date vécue à ta façon dit à ton corps que l’avenir n’est pas écrit d’avance.",
          gestes: ["Fêter un anniversaire que tu évitais", "Faire une promenade le jour d’une date de mémoire", "Cuisiner le plat préféré d’un·e ancêtre", "T’offrir une journée rien qu’à toi à une saison difficile", "Écrire une carte à une personne de ta famille le jour de sa fête", "Fêter ton année de Cercle avec quelqu’un que tu aimes"],
          q: "Ton geste : « La prochaine fois que cette date ou cet âge arrive, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de passer le 2 novembre enfermé·e chez moi, je vais marcher en forêt et allumer une bougie pour mon grand-père en rentrant.",
          journal: { k: 'ex3-celebre', n: 6, q: "Chaque fois que tu l’as fait : quand, et qu’est-ce qui a changé ?", ph: "Exemple : samedi, j’ai fêté mon année de Cercle avec ma sœur au restaurant. Je me suis senti·e fier·e, et léger·ère." } }
      ],
      conseil: "Si une date reste difficile malgré tout, ce n’est pas raté : certaines dates demandent plusieurs tours de spirale pour s’adoucir. Chaque année, tu la vivras un peu plus à ta façon. Et souviens-toi : tu as bouclé une année entière. C’est immense." }
  ],

  meditation: {
    titre: 'La spirale du temps',
    intro: "La dernière séance de l’année : une marche en spirale dans la forêt d’automne, pour saluer les âges de ta lignée, poser les pieds sur ton propre tour, et remercier le chemin parcouru.",
    texte: [
      "Installe-toi confortablement, et ferme les yeux. Respire profondément, trois fois… Laisse ton corps se poser.",
      "[pause]",
      "Imagine que tu marches dans une forêt d’automne. Les feuilles rousses craquent sous tes pas. L’air est frais, la lumière dorée. Tu respires l’odeur de la terre humide et des feuilles tombées.",
      "Au cœur de la forêt, tu découvres un chemin en spirale. Chaque tour représente une génération : tes parents, tes grands-parents, et plus loin encore.",
      "[pause]",
      "Tu remarques que certains endroits du chemin se ressemblent d’un tour à l’autre. Les mêmes âges, les mêmes saisons. Observe-les avec curiosité, sans inquiétude. Ce sont des repères, comme des pierres posées le long du chemin par celles et ceux qui sont passés avant toi.",
      "Si l’une de ces pierres te semble lourde, tu peux la saluer, simplement, et la laisser à sa place. Elle appartient à son tour de spirale.",
      "Puis tu arrives sur ton propre tour. Ici, le chemin est neuf. Il ressemble parfois aux autres, mais c’est toi qui choisis où poser tes pieds, à quel rythme avancer, où t’arrêter pour regarder le paysage.",
      "[longue pause]",
      "Sens que chaque âge que tu vis est le tien. Tu peux accueillir ce qui fait écho, et décider de le vivre autrement. Rien n’est écrit d’avance.",
      "Repense à l’année qui vient de s’écouler. Laisse remonter un moment, une découverte, un visage. Remercie-toi pour le chemin parcouru, pour ta curiosité et pour ton courage d’avoir regardé ton histoire en face.",
      "Regarde devant toi : le chemin continue de monter, plus large, plus lumineux. Un nouveau tour t’attend. Tu n’as pas besoin de savoir où il mène.",
      "[pause]",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir d’automne où personne ne te dérangera pendant dix minutes, une bougie allumée si tu aimes. Si un souvenir ou un âge te serre la gorge, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux reprendre la séance un autre jour.",
    note: { k: 'medit-spirale', q: "Qu’est-ce qui t’est venu pendant la séance ? Une pierre sur le chemin, un visage, un moment de ton année, ce que tu as vu devant toi…", ph: "Exemple : j’ai vu une pierre marquée « 40 ans », je l’ai saluée et laissée. Sur mon tour, il y avait du soleil. J’ai pensé au jour où j’ai ouvert mon premier carnet." }
  },

  bilanTitre: 'Ce que cette année a libéré',
  bilan: [
    { k: 'fin-retiens', q: "Qu’as-tu découvert sur les âges et les dates de ta lignée ce mois-ci ?", ph: "Exemple : ma mère et ma grand-mère ont toutes les deux changé de vie à 38 ans. Mon envie de tout bouger cette année a une histoire." },
    { k: 'fin-echos', q: "Quels échos reconnais-tu, sans les subir, et comment choisis-tu de les vivre ?", ph: "Exemple : novembre me rend nostalgique. Je le reconnais, et je choisis d’en faire un mois de promenades et de photos de famille." },
    { k: 'fin-annee-cercle', q: "Que t’a apporté cette année de Cercle, d’octobre dernier à aujourd’hui ?", ph: "Exemple : j’ai vu mes boucles, j’ai compris d’où elles venaient, et j’ose faire autrement. Je me sens plus libre, et plus proche de ma famille." },
    { k: 'fin-boucle-spirale', q: "Repense à la boucle que tu avais repérée en octobre dernier. Comment la vis-tu aujourd’hui ?", ph: "Exemple : je disais oui à tout. Aujourd’hui, je dis « je te réponds demain », et souvent, je dis non sans culpabilité." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en novembre, pour ton nouveau tour de spirale ?", ph: "Exemple : mon rapport à l’argent, et continuer à écouter les histoires de ma famille.", court: true }
  ],

  carnet: {
    titre: 'Mon bilan de l’année',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas : tes deux roues, ta lettre relue, ta suite choisie. Reporte ton geste qui célèbre dans ton carnet, il devient un appui pour ta nouvelle année."
  },

  aVenir: [
    { mois: 'Novembre', titre: 'Une nouvelle année dans Le Cercle', texte: "Un nouveau tour de spirale s’ouvre. Les saisons reviennent, les thèmes aussi, mais tu les traverses désormais avec tout ce que tu as vu, traversé et transmis. Tu reconnais plus tôt, tu choisis plus librement, et tu montes encore d’un cran.", image: 'assets/guide/guide-spirale-or.webp' }
  ]
};
