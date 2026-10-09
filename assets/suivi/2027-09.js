/* Genesolia · Le Cercle · Mon suivi « Je me libère » de septembre 2027 : « Les métiers de la lignée »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-09',
  cle: 'suivi-2027-09',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-09-1a0be1622e.pdf',
  nomMois: 'septembre 2027',
  moisSuivant: 'octobre',
  titre: 'Les métiers de la lignée',
  sousTitre: "Regarder le travail de ta famille, reconnaître les vocations empêchées, et choisir ce que tu veux faire de ta vie professionnelle.",
  citation: "Tu peux honorer le métier des tiens sans en faire ta prison.",
  audio: '',
  audioCourt: '',
  saisonLien: "Septembre est le mois des équilibres et des cahiers neufs. Autour de l’équinoxe, le jour et la nuit se partagent le temps à parts égales, et la rentrée ouvre une page blanche. C’est le bon moment pour regarder ce que ta lignée t’a transmis sur le travail, peser ce que tu gardes et ce que tu laisses, et écrire ta propre page.",
  intensiteQ: "À quel point ton rapport au travail, à l’effort ou à ta voie professionnelle pèse-t-il dans ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette idée qu’il faut souffrir au travail pour mériter son salaire, comme mon père.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-livre-pupitre.webp',
      theme: 'assets/guide/guide-transmission.webp',
      voir: 'assets/guide/guide-arbre.webp',
      source: 'assets/guide/guide-repete.webp',
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
    saison: "Respire avec la rentrée. Ce mois-ci, tu regardes le travail des tiens avec curiosité, sans juger personne, ni eux, ni toi.",
    theme: "Lis cette page en pensant aux mains de ta famille : celles qui ont semé, cousu, compté, enseigné, porté.",
    voir: "Cette semaine, tu remplis le tableau des métiers. Les cases vides sont aussi précieuses que les autres.",
    source: "Derrière chaque métier, il y a une époque et un choix, ou une absence de choix. Écoute les réponses avec tendresse.",
    liberer: "Tu peux remercier une phrase qui a aidé les tiens à tenir, et la laisser à son époque. C’est ça, rendre avec respect.",
    remplacer: "Un petit pas vers ce qui t’attire suffit. Ta lignée t’a donné du courage : tu peux t’en servir pour toi.",
    meditation: "Un soir calme de rentrée. Si une émotion monte en pensant à un rêve empêché, reviens simplement à ton souffle.",
    bilan: "Regarde ce que tu as reconnu, et ce que tu as choisi. Tu montes encore d’un cran sur la spirale."
  },

  theme: {
    titre: 'Le mois de la rentrée',
    texte: [
      "Septembre, c’est la rentrée. Les cartables, les agendas neufs, la reprise du travail. C’est aussi un moment où l’on se demande : est-ce que ce que je fais me ressemble vraiment ? Est-ce que je l’ai choisi, ou est-ce que je l’ai suivi ?",
      "Ton rapport au travail ne vient pas de nulle part. Tes parents, tes grands-parents ont exercé des métiers, rêvé d’autres vies, transmis des phrases sur l’argent et l’effort. Ce mois-ci, tu regardes cet héritage avec curiosité, sans juger personne : ni celles et ceux qui ont travaillé dur, ni toi qui cherches peut-être autre chose. Tu es dans le troisième temps de l’année du Cercle, **Transmettre** : tu choisis ce que tu gardes de leur travail, et ce que tu fais passer à ton tour."
    ],
    sousTitre: 'Le travail, une histoire de famille',
    texte2: [
      "On observe souvent que les métiers se transmettent d’une génération à l’autre : une lignée d’artisans, d’enseignant·es, de commerçant·es. Parfois avec fierté, parfois par obligation, parfois sans même qu’on s’en rende compte. Un petit-fils devient boulanger comme son arrière-grand-père qu’il n’a jamais connu ; une petite-fille d’institutrice choisit, elle aussi, d’enseigner aux enfants du village.",
      "On remarque aussi l’inverse : des vocations empêchées. Une grand-mère qui voulait étudier et a dû travailler à quatorze ans, un père qui rêvait de musique et a repris l’entreprise. Ces rêves en suspens peuvent revenir chez un·e descendant·e, qui se sent attiré·e par cette voie sans savoir pourquoi, ou au contraire bloqué·e chaque fois qu’il ou elle s’en approche. Et puis il y a les phrases : « On n’est pas là pour s’amuser », « Il faut un vrai métier ». Elles ont aidé les tiens à tenir dans des époques difficiles, mais elles ne correspondent pas forcément à ta vie d’aujourd’hui. Pour aller plus loin : [la méthode des deux cycles](methode.html) et [les métiers transmis](metiers-transmis-genealogie.html).",
      "Ce mois-ci, tu vas **voir** les métiers de ta lignée, **remonter** aux rêves et aux renoncements, **libérer** les phrases qui ne t’appartiennent plus, et **poser** un premier pas vers ta propre voie."
    ],
    exemplesTitre: 'À quoi ressemble un héritage professionnel, au quotidien',
    exemples: [
      "**Le métier qu’on n’a pas vraiment choisi** : tu es devenu·e enseignant·e comme ta mère et ta tante, et tu te demandes parfois si tu l’aurais choisi sans elles.",
      "**L’effort comme preuve** : tu ne te sens légitime que quand tu es épuisé·e. Une journée facile te donne l’impression de tricher.",
      "**Le rêve qui revient** : tu es attiré·e par le théâtre sans savoir pourquoi, et tu découvres que ton grand-père voulait être comédien.",
      "**Le plafond invisible** : chaque fois qu’une promotion arrive, tu la refuses ou tu la sabotes, comme si gagner plus que tes parents était interdit.",
      "**La peur de l’instabilité** : tu restes dans un poste qui t’ennuie depuis dix ans, parce que chez vous « on ne quitte pas un CDI »."
    ],
    exempleSpirale: "La spirale, c’est la même rentrée, un cran plus haut. Chaque septembre, tu promets de t’inscrire à ce cours de dessin, et chaque année tu te dis que « ce n’est pas sérieux », comme ton père qui disait que l’art ne nourrit pas son homme. Cette année, tu remercies ton père pour la sécurité qu’il t’a donnée, tu lui rends sa phrase, et tu t’inscris au cours du jeudi soir. Le thème est le même, ta place a changé.",
    question: { k: 'theme-metier', q: "En une phrase, qu’est-ce que ta famille t’a transmis sur le travail ?", ph: "Exemple : qu’il faut travailler dur, ne jamais se plaindre, et que le plaisir viendra après." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les métiers de ta lignée',
      intro: "Cette semaine, tu poses sur la table le travail de ta famille : les métiers, les rêves, ce que le travail a demandé et donné. Tu ne cherches pas encore à comprendre : tu remplis, tu observes, tu remarques ce que ça te fait.",
      texte: "Commence par le tableau des métiers, au calme, une vingtaine de minutes. Puis, chaque jour de la semaine, remarque ce que tu ressens en partant travailler ou en pensant à ton travail, et note-le dans ton journal.",
      exercices: [
        { k: 'metiers', titre: 'Les métiers de ma lignée', type: 'tableau', rangs: 5,
          etiquettes: ['Mes arrière-grands-parents', 'Mes grands-parents', 'Mes parents', 'Un oncle, une tante, un cousin', 'Moi'],
          consigne: "Pour chaque génération, note qui exerçait quel métier, ce qu’il ou elle aurait aimé faire si tu le sais, puis ce que ce travail lui a demandé et apporté. Une case vide est aussi une information : elle montre ce qu’on ne t’a pas raconté.",
          pourquoi: "Quand on écrit les métiers de sa famille l’un sous l’autre, on voit apparaître des fils : un même domaine, un même rapport à l’effort, un même rêve qui revient. On comprend alors que certains choix ne sont pas tout à fait les nôtres, et que d’autres le sont pleinement.",
          colonnes: [
            { q: "Qui, et quel était son métier ?", ph: ["Exemple : mon arrière-grand-père Émile, forgeron", "Exemple : ma grand-mère Odette, couturière à domicile", "Exemple : ma mère, secrétaire ; mon père, chauffeur routier", "Exemple : mon oncle Rachid, boulanger", "Exemple : moi, comptable dans une grande entreprise"] },
            { q: "Quel était son rêve, si tu le connais ?", ph: ["Exemple : je ne sais pas, on ne parlait pas de rêves", "Exemple : elle voulait être institutrice, mais elle a dû arrêter l’école à 13 ans", "Exemple : mon père voulait être mécanicien de course", "Exemple : il rêvait d’ouvrir son propre restaurant", "Exemple : je voulais être architecte"] },
            { q: "Qu’est-ce que ce travail lui a demandé, et apporté ?", ph: ["Exemple : des journées de quatorze heures, et une place respectée au village", "Exemple : de la fatigue, et la fierté de faire vivre ses quatre enfants", "Exemple : de longues absences, et une maison achetée à 45 ans", "Exemple : des nuits courtes, et beaucoup de joie à nourrir le quartier", "Exemple : de la sécurité, et un ennui qui grandit chaque année"] }
          ],
          apres: { k: 'metiers-repete', q: "Relis tes cinq lignes. Qu’est-ce qui se répète ou te surprend : un domaine, un rêve, un renoncement, un rapport à l’effort ?", ph: "Exemple : dans chaque génération, quelqu’un a renoncé à un métier de création pour la sécurité. Moi aussi." } },
        { k: 'voir-travail', titre: 'Mon travail, cette semaine', type: 'texte',
          consigne: "Chaque jour de cette semaine, remarque ce que tu ressens en partant travailler, ou en pensant à ton travail : les mots qui te viennent, les sensations dans ton corps, les phrases qui tournent. Note-les le jour même. Vise au moins trois moments.",
          pourquoi: "Notre corps sait souvent avant notre tête si un travail nous ressemble : des épaules lourdes le dimanche soir, un élan le matin d’une réunion qu’on aime. Repérer ces signaux, c’est entendre ce que ta vie professionnelle te dit vraiment.",
          q: "Ce que tu remarques, en général, quand tu penses à ton travail",
          ph: "Exemple : le lundi matin, j’ai toujours la même phrase en tête : « Allez, il faut y aller. » Comme ma mère.",
          journal: { k: 'voir-trav', n: 6, q: "Chaque moment : le jour, ce que tu ressentais, les mots ou la phrase qui sont venus", ph: "Exemple : mardi, 7 h 45, dans le métro. Ventre serré. Phrase : « On n’est pas là pour s’amuser. »" } }
      ],
      conseil: "Si tu connais peu de métiers dans ta famille, c’est normal : on a souvent parlé du travail sans parler des personnes. Note ce que tu sais, et laisse le reste ouvert. Tu peux aussi regarder de vieilles photos : un tablier, un outil, un uniforme en disent souvent long." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'Les rêves et les renoncements',
      intro: "Derrière chaque métier, il y a une époque, un choix, ou une absence de choix. Cette semaine, tu remontes le fil des rêves professionnels de ta famille, ceux qui ont été vécus et ceux qui ont été mis de côté, pour comprendre ce qu’ils ont laissé en toi.",
      texte: [
        "Le travail touche d’abord le **cycle de la racine** : gagner sa vie, nourrir les siens, avoir un toit, ne pas manquer. Dans les familles qui ont connu la guerre, l’exode rural ou la pauvreté, le travail a souvent été une question de survie. Il était logique de choisir la sécurité plutôt que le rêve, et de transmettre des phrases qui protègent : « Un vrai métier », « Ne prends pas de risque ».",
        "Le travail touche aussi le **cycle du cœur** : être reconnu·e, faire la fierté de ses parents, appartenir à une lignée. Reprendre l’entreprise familiale par amour, renoncer à partir pour ne pas décevoir, choisir le même métier que sa mère pour rester proche d’elle : le travail est souvent lié au lien. On commence en général par la racine : tant qu’on a peur de manquer, il est difficile de choisir librement ce qu’on aime."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ton arbre, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en passant devant une vitrine ou en écoutant une conversation au travail.",
          pourquoi: "Souvent, on découvre que notre façon de vivre le travail a déjà été vécue avant nous. Le voir change tout : ce n’est plus « je manque d’ambition » ou « je ne sais pas ce que je veux », c’est une histoire de famille que je peux regarder.",
          choix: { k: 'cycle', q: "Aujourd’hui, ton rapport au travail touche surtout…", options: ['La racine : la sécurité, l’argent, ne pas manquer', 'Le cœur : la reconnaissance, la fierté, la loyauté envers les miens', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-reviennent', q: "Quels métiers ou quels domaines reviennent dans ta famille, sur plusieurs générations ?", ph: "Exemple : le commerce, du côté de mon père. Ma grand-mère tenait une épicerie, mon père une boutique de vêtements." },
            { k: 'source-renonce', q: "Qui a dû renoncer à un rêve professionnel, et pourquoi ?", ph: "Exemple : ma mère voulait être architecte, mais ses parents n’avaient pas les moyens de payer ses études." },
            { k: 'source-phrases', q: "Quelles phrases sur le travail et l’argent as-tu entendues enfant ?", ph: "Exemple : « L’argent ne tombe pas du ciel », « Les artistes finissent sur la paille »." },
            { k: 'source-ideal', q: "Quel métier « idéal » ta famille imaginait-elle pour toi ?", ph: "Exemple : ingénieur·e ou avocat·e. « Un métier où l’on te respecte. »" },
            { k: 'source-protege', q: "Ton rapport actuel au travail t’a-t-il protégé·e à un moment ? De quoi ?", ph: "Exemple : rester dans un poste sûr m’a protégé·e de la peur de manquer que j’ai vue chez mes parents quand mon père a été licencié." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur son travail ou ses rêves : quel métier il ou elle aurait aimé faire, pourquoi il ou elle a choisi le sien. Par téléphone, à table, par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à mon père : « Si tu avais pu choisir n’importe quel métier, lequel aurais-tu fait ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : il m’a dit « luthier », sans hésiter. Il n’en avait jamais parlé. J’ai compris pourquoi il m’emmenait voir tous les concerts.", lignes: 3 }
          ] }
      ],
      conseil: "Parler de rêves empêchés peut réveiller de la tristesse ou de la colère, chez toi ou chez la personne que tu interroges. Si c’est trop, arrête-toi, respire, et reprends un autre jour. Tu peux ajouter le métier de chaque personne dans [ton arbre familial](genosociogramme.html), et lire [l’argent et la lignée](argent-et-lignee.html) si les phrases sur l’argent te parlent beaucoup." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre les phrases, garder le savoir-faire',
      intro: "Chaque famille a ses formules sur le travail et l’argent. Répétées pendant des années, elles finissent par sembler des vérités, et on les retrouve dans sa propre bouche. Cette semaine, tu attrapes trois de ces phrases, tu écris à ta vocation, et tu rends symboliquement ce qui ne t’appartient plus.",
      exercices: [
        { k: 'phrases', titre: 'Les phrases héritées', type: 'blocs', nb: 3,
          etiquettes: ['Première phrase', 'Deuxième phrase', 'Troisième phrase'],
          consigne: "Choisis trois phrases sur le travail ou l’argent que tu as souvent entendues dans ta famille. Pour chacune, note qui la disait et ce qu’elle l’aidait à traverser. Puis écris ta propre phrase, celle qui correspond à la vie que tu veux mener aujourd’hui.",
          pourquoi: "Ces phrases ont souvent été utiles à celles et ceux qui les disaient : elles les ont aidé·es à tenir pendant une guerre, une crise, quand perdre son travail voulait dire ne plus pouvoir nourrir les siens. Les écrire, c’est reconnaître leur utilité, et décider lesquelles tu laisses à leur époque.",
          astuce: "Une bonne phrase de remplacement est vraie pour toi aujourd’hui. Pas « L’argent coule à flots », mais « Je peux gagner ma vie en faisant quelque chose qui a du sens pour moi ».",
          champs: [
            { q: "Quelle phrase sur le travail ou l’argent entendais-tu ?", ph: ["Exemple : « On n’est pas là pour s’amuser. »", "Exemple : « Il faut un vrai métier. »", "Exemple : « L’argent, ça se gagne à la sueur de son front. »"] },
            { q: "Qui la disait, et qu’est-ce qu’elle l’aidait à traverser ?", ph: ["Exemple : mon grand-père, ouvrier à l’usine. Elle l’aidait à tenir ses journées", "Exemple : ma mère, qui avait vu son père perdre son travail. Elle la rassurait", "Exemple : ma grand-mère, agricultrice. Elle donnait du sens à sa fatigue"] },
            { q: "Quelle phrase choisis-tu de dire à la place ?", ph: ["Exemple : « Je peux travailler sérieusement et y prendre du plaisir. »", "Exemple : « Un métier qui me ressemble est un vrai métier. »", "Exemple : « Je peux bien gagner ma vie sans m’épuiser. »"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à ma vocation', type: 'questions',
          consigne: "Écris une lettre à ce que tu aurais aimé faire, ou à ce que tu as envie de faire maintenant. Tu ne l’enverras à personne. Raconte ce qui t’a retenu·e, ce que ta famille en aurait pensé, ce qui t’attire encore. Remercie les tiens pour ce qu’ils t’ont transmis, rends-leur ce qui ne t’appartient pas, et termine par un petit pas concret que tu peux faire ce mois-ci.",
          pourquoi: "On ne se libère pas d’une loyauté professionnelle en la rejetant, mais en la reconnaissant. Écrire à ta vocation, c’est lui redonner une place, sans trahir personne.",
          questions: [
            { k: 'lettre-voc', q: "À quelle envie, à quel rêve écris-tu ?", ph: "Exemple : à mon envie de devenir illustratrice", court: true },
            { k: 'lettre-voc-texte', q: "Ta lettre : « Chère envie que je mets de côté depuis longtemps… » Ce qui t’a retenu·e, ce que tu remercies, ce que tu rends, ce qui t’attire, ton petit pas", ph: "Exemple : Chère envie de dessiner, je t’ai rangée dans un tiroir à 16 ans, parce que papa disait que les artistes ne mangent pas à leur faim. Je le remercie de m’avoir appris à être prudente. Je lui rends sa peur. Toi, je te ressors : ce mois-ci, je m’inscris à un atelier d’illustration le jeudi soir.", lignes: 7 }
          ] }
      ],
      rituel: {
        titre: 'L’outil et la page blanche',
        intro: "Ce rituel symbolique t’aide à reconnaître le travail de ta lignée tout en ouvrant ta propre voie. Fais-le une fois cette semaine, après tes phrases et ta lettre. Il dure environ quinze minutes.",
        materiel: "Un objet lié au travail de ta famille (un outil, un stylo, une photo, un carnet, un dé à coudre), une feuille blanche, ce carnet et un stylo.",
        etapes: [
          "Choisis un moment calme. Pose devant toi l’objet et la feuille blanche, côte à côte. Respire trois fois.",
          "Prends l’objet dans tes mains et pense à celles et ceux qui ont travaillé avant toi : leurs gestes, leurs journées, leur fatigue, leur fierté.",
          "Dis, à voix haute ou intérieurement : « Je reconnais votre travail et tout ce qu’il a permis. Merci. Je vous rends les phrases qui vous ont aidé·es à tenir. Je garde votre courage et votre savoir-faire. »",
          "Repose l’objet. Prends la feuille blanche et dis : « Ma vie professionnelle m’appartient. Je choisis ma voie. »",
          "Écris sur la feuille un mot qui représente ce que tu veux vivre dans ton travail. Garde-la près de toi ce mois-ci, sur ton bureau ou dans ton sac.",
          "Note ci-dessous ce qui est venu pendant le rituel."
        ],
        note: { k: 'rituel-outil', q: "Après le rituel, note ce qui s’est passé : l’objet choisi, le mot écrit, ce que tu as ressenti avant, pendant et après.", ph: "Exemple : j’ai pris le mètre ruban de ma grand-mère couturière. J’ai écrit « créer ». J’ai senti une grande douceur, comme si elle me donnait sa permission." }
      },
      conseil: "Si écrire à ta vocation réveille un regret ou une émotion forte, fais une pause, sors marcher, bois un verre d’eau. Tu peux finir la lettre un autre jour. Il n’est jamais trop tard pour un petit pas, et ce qui compte, c’est d’avoir ouvert le tiroir." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Ton premier pas vers ta voie',
      intro: "Tu as vu les métiers de ta lignée, tu as remonté les rêves et les renoncements, tu as rendu les phrases qui ne t’appartenaient plus. Cette semaine, tu mets un espace entre la vieille phrase et ta réponse, et tu y glisses un petit pas vers ce qui t’attire.",
      texte: [
        "**La première pause.** Quand une vieille phrase sur le travail arrive (« ce n’est pas sérieux », « tu n’as pas le droit de te plaindre »), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis intérieurement : « Je te reconnais. Tu as aidé les miens. Aujourd’hui, je choisis ma phrase. »",
        "**Le pas vers ta voie.** Changer de rapport au travail ne veut pas dire tout quitter. Une recherche, un appel, une heure rien que pour ton projet, une tâche que tu choisis de déléguer : plus le pas est petit, plus il est facile à faire."
      ],
      exercices: [
        { k: 'ex3', titre: 'Le pas vers ma voie', type: 'texte',
          consigne: "Choisis ton petit pas, écris-le, puis note chaque fois que tu l’as fait, même maladroitement, et ce qui a changé. Ce pas devient aussi un appui dans ton carnet « J’avance », pour ta vocation.",
          pourquoi: "On ne transforme pas en un jour un rapport au travail qui a traversé des générations. Mais chaque petit pas vers ce qui te ressemble dit à ton corps qu’il a le droit de choisir, sans perdre sa sécurité.",
          gestes: ["Chercher une formation qui t’attire", "Appeler quelqu’un qui fait ce métier", "Bloquer une heure par semaine pour ton projet", "Dire « je n’ai pas besoin de m’épuiser pour bien faire »", "Partir à l’heure un soir par semaine", "Montrer ton travail créatif à une personne de confiance"],
          q: "Ton pas : « La prochaine fois que la vieille phrase arrive, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de me dire « ce n’est pas sérieux » et de refermer l’ordinateur, je vais passer vingt minutes à regarder les formations en illustration.",
          journal: { k: 'ex3-voie', n: 6, q: "Chaque fois que tu l’as fait : quand, et qu’est-ce qui a changé ?", ph: "Exemple : mercredi, j’ai envoyé un mail à une école. J’ai eu peur, puis j’ai senti une grande fierté." } }
      ],
      conseil: "Si la vieille phrase gagne une fois, ce n’est pas raté : remarque-la après coup, c’est déjà un pas. Et souviens-toi que ta lignée t’a transmis du courage et des savoir-faire : tu peux t’en servir pour ta propre voie." }
  ],

  meditation: {
    titre: 'L’atelier de la lignée',
    intro: "Une séance guidée pour traverser l’atelier de ta famille, saluer le travail accompli et les rêves en suspens, et trouver la table qui t’attend.",
    texte: [
      "Installe-toi confortablement, et ferme les yeux. Respire profondément, trois fois… Laisse ton corps se poser.",
      "[pause]",
      "Imagine une grande pièce lumineuse, un atelier ancien. Sur les tables sont posés des outils : un marteau, une aiguille, un livre, une balance, un tablier. Ce sont les outils de ta lignée. Certains sont usés, polis par des années de gestes répétés.",
      "Tu avances lentement entre les tables. Tu n’as pas besoin de savoir à qui appartenait chaque outil. Sens simplement tout le travail accompli, toutes ces journées, tout cet effort. Les levers avant l’aube, les mains fatiguées, la fierté d’un travail bien fait.",
      "Tu peux poser la main sur l’un de ces outils, et dire intérieurement : « Merci. Grâce à vous, je suis là. »",
      "[pause]",
      "Au fond de l’atelier, tu remarques une table plus petite. Dessus, quelques objets jamais utilisés : un pinceau, un instrument, un cahier vide. Ce sont les rêves que certain·es n’ont pas pu vivre.",
      "Regarde-les avec douceur. Tu n’as pas à les réaliser à leur place. Tu peux simplement les saluer, et dire intérieurement : « Je vous vois. Vous avez compté. »",
      "[longue pause]",
      "Puis tu remarques une table libre, rien qu’à toi. Qu’aimerais-tu y poser ? Laisse venir une image, un objet, un mot. Accueille ce qui vient, sans juger. Ce n’est peut-être pas un métier précis : juste une envie, une couleur, une façon d’être au travail.",
      "Sens que tu as le droit de choisir. Ta lignée t’a transmis du courage et des savoir-faire. La suite, c’est toi qui l’écris.",
      "[pause]",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir de rentrée où personne ne te dérangera pendant dix minutes. Si un regret ou une tristesse monte devant la table des rêves, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux reprendre la séance un autre jour.",
    note: { k: 'medit-atelier', q: "Qu’est-ce qui t’est venu pendant la séance ? Un outil, un rêve en suspens, ce que tu as posé sur ta table…", ph: "Exemple : j’ai vu la machine à coudre de ma grand-mère, et un violon jamais joué. Sur ma table, j’ai posé un carnet de croquis." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-retiens', q: "Qu’as-tu découvert sur le travail et les rêves de ta lignée ce mois-ci ?", ph: "Exemple : trois générations ont renoncé à un métier de création pour la sécurité. Mon hésitation vient de là." },
    { k: 'fin-reconnais', q: "Que reconnais-tu, avec gratitude, du travail de ta lignée ?", ph: "Exemple : le courage de mes grands-parents, leur sérieux, et le savoir-faire des mains." },
    { k: 'fin-rendu', q: "Quelle phrase as-tu rendue, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : j’ai rendu « ce n’est pas un vrai métier » à mon père. Je me sens plus libre de parler de mon projet." },
    { k: 'fin-choisis', q: "Que choisis-tu pour ta vie professionnelle, même un tout petit pas ?", ph: "Exemple : je garde mon poste pour l’instant, et je suis l’atelier d’illustration du jeudi toute l’année." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en octobre ?", ph: "Exemple : continuer à dire mes nouvelles phrases, et regarder les âges et les dates de ma famille.", court: true }
  ],

  carnet: {
    titre: 'Ma vocation',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas : ce qui te fait vibrer, tes talents, ton heure pour ta vocation. Reporte ton pas vers ta voie dans ton carnet, il devient un appui pour ton domaine travail."
  },

  aVenir: [
    { mois: 'Octobre', titre: 'Les âges qui se répondent', texte: "Observer les âges et les dates qui reviennent dans ta famille, et vivre chacun d’eux à ta façon.", image: 'assets/cartes/aujourdhui-spirale-mini.jpg' },
    { mois: 'Novembre', titre: 'Une nouvelle année dans Le Cercle', texte: "Un nouveau tour de spirale, plus léger, avec tout ce que tu as vu, traversé et transmis.", image: 'assets/guide/guide-spirale-or.webp' }
  ]
};
