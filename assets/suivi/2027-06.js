/* Genesolia · Le Cercle · Mon suivi « Je me libère » de juin 2027 : « Du côté des pères »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-06',
  cle: 'suivi-2027-06',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-06-ca6dfabe67.pdf',
  nomMois: 'juin 2027',
  moisSuivant: 'juillet',
  titre: 'Du côté des pères',
  sousTitre: "Regarder ton père, ton grand-père et la lignée des hommes, pour reconnaître ce que tu as reçu du côté paternel.",
  citation: "Tu peux reconnaître ce que tu as reçu sans tout accepter.",
  audio: '',
  audioCourt: '',
  saisonLien: "Juin est le mois de la pleine lumière, juste avant le grand basculement du solstice. Tout est éclairé, même les coins que l'on préfère d'habitude laisser dans l'ombre. C'est le bon moment pour regarder le côté de ton père, avec douceur, dans cette lumière qui ne juge pas. Ce qui est vu en pleine lumière peut ensuite, doucement, commencer à mûrir autrement.",
  intensiteQ: "À quel point ce que tu as reçu de ton père, ou ce qui t’a manqué de lui, pèse-t-il dans ta vie aujourd’hui ?",
  souhaitPh: "Exemple : ce silence que je garde quand je suis en colère, comme mon père et mon grand-père avant lui.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/montagne.jpg',
    pages: {
      saison: 'assets/guide/guide-etoiles.webp',
      theme: 'assets/guide/guide-arbre.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/deux-parents-mini.jpg', 'J’ai le droit d’aimer mes deux parents sans choisir.']
    }
  },

  mots: {
    saison: "Respire avec la lumière de juin. Quelle que soit ton histoire avec ton père, elle a sa place ici, même si elle est faite d’absence.",
    theme: "Lis cette page à ton rythme. Si elle serre un peu le cœur, pose ta main dessus et respire. Tu n’as rien à prouver.",
    voir: "Cette semaine, tu regardes les hommes de ta lignée comme on regarde de vieilles photos : avec curiosité, sans tribunal.",
    source: "Un père a d’abord été un fils. Ce que tu découvres de son enfance peut changer ta façon de le regarder.",
    liberer: "Tu n’as pas besoin de pardonner pour poser ce qui pèse. Reconnaître sa place suffit pour reprendre la tienne.",
    remplacer: "Choisis une qualité reçue du côté paternel et fais-la vivre à ta façon. C’est ainsi qu’un héritage devient le tien.",
    meditation: "Tu choisis ta distance. Si c’est trop, ouvre les yeux, sens tes pieds sur le sol, et reviens à ton souffle.",
    bilan: "Regarde ce que tu as osé voir ce mois-ci. Tu as traversé une des lignées les plus silencieuses de ton arbre."
  },

  theme: {
    titre: 'Le mois des pères',
    texte: [
      "Juin ramène la fête des pères. Dans les vitrines, les cartes et les cadeaux montrent des pères souriants et proches. Pour certain·es, c'est un moment simple et joyeux. Pour d'autres, c'est un jour qui serre un peu le cœur : un père absent, silencieux, disparu trop tôt, jamais connu, ou une relation restée compliquée.",
      "Ce mois clôt le deuxième temps de l'année du Cercle, **Traverser**. Après la lignée de tes mères en mai, tu regardes maintenant le côté paternel : ton père, son père, et les hommes qui les ont précédés. En juillet commencera le troisième temps, **Transmettre**. Tu avances à ton rythme, tu écris seulement ce qui te semble juste, et tu restes libre de t'arrêter où tu veux."
    ],
    sousTitre: 'Pourquoi regarder la lignée des pères ?',
    texte2: [
      "En psychogénéalogie, on observe que chaque lignée transmet ses façons de faire : travailler, protéger, se taire, partir, tenir bon. Du côté paternel, ces transmissions passent souvent par des gestes plus que par des mots : la façon de réparer un objet, de gérer une colère, de rentrer tard du travail, de montrer sa fierté sans la dire.",
      "Beaucoup d'hommes des générations passées ont appris très tôt à ne pas montrer ce qu'ils ressentaient. Un arrière-grand-père parti à la guerre à vingt ans, un grand-père placé comme apprenti à douze, un père qui a dû faire vivre toute une famille : ils ont souvent fait ce qu'ils pouvaient avec ce qu'ils avaient reçu. Et ce qui manque se transmet aussi : un fils qui n'a pas eu de père devient parfois un père qui ne sait pas comment faire, ou qui se promet de tout faire autrement. Rien de cela n'est une faute, c'est une chaîne.",
      "Un père peut être là chaque jour et rester silencieux. Il peut être parti tôt, avoir fondé une autre famille, ou n'avoir jamais été connu. Parfois, c'est un beau-père, un oncle ou un grand-père qui a pris cette place. Ce mois-ci, tu vas **voir** les hommes de ta lignée, **remonter** à leur histoire, **rendre** ce qui ne t'appartient pas, et **recevoir** ce qu'ils t'ont transmis de précieux. Tu n'as pas besoin de pardonner ni de tout comprendre : regarder suffit. Pour aller plus loin : [la méthode des deux cycles](methode.html)."
    ],
    exemplesTitre: 'Ce que l’on reçoit des pères, au quotidien',
    exemples: [
      "**Dans ta façon de travailler** : ton père ne s'arrêtait jamais, même le dimanche. Aujourd'hui, tu te sens coupable dès que tu n'es pas « utile ».",
      "**Dans tes colères** : chez vous, les hommes se taisaient, puis explosaient d'un coup. Tu te surprends à serrer les dents pendant des semaines, et à claquer une porte pour un rien.",
      "**Dans ta façon d'oser** : « Ne te fais pas remarquer », « Reste à ta place », « Ce n'est pas pour nous ». Des phrases qui t'ont appris à ne pas trop viser haut.",
      "**Dans les départs** : ton grand-père est parti quand ton père avait huit ans, ton père a quitté la maison quand tu en avais dix. Tu remarques que tu pars souvent avant d'être quitté·e.",
      "**Dans tes forces** : savoir réparer, garder son calme dans la tempête, tenir parole, aimer la nature. Ce sont aussi des cadeaux de la lignée paternelle."
    ],
    exempleSpirale: "Ton père ne disait jamais ce qu'il ressentait, comme son père avant lui. Toi aussi, tu as appris à te taire. Ce mois-ci, ton compagnon te demande ce qui ne va pas, et tu sens le vieux réflexe : répondre « rien » et te fermer. Tu respires, et tu dis une phrase de plus : « Je suis déçu·e, et j'ai du mal à le dire. » Tu reconnais le silence des hommes de ta lignée, tu le remercies de t'avoir protégé·e, et tu choisis une parole. Le thème est le même, ta place a changé.",
    question: { k: 'theme-peres', q: "En une phrase, qu’est-ce que tu as reçu du côté paternel que tu retrouves aujourd’hui dans ta vie ?", ph: "Exemple : le goût du travail bien fait, et la difficulté à dire ce que je ressens, comme mon père et mon grand-père." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les hommes de ta lignée',
      intro: "Cette semaine, tu poses sur la table ce que tu sais des hommes de ta famille, côté père surtout, et côté mère si tu le souhaites. Tu ne cherches pas encore à comprendre : tu regardes ce qu’ils ont vécu, et ce qui semble se répéter.",
      texte: "Commence par l’exercice de la lignée, au calme, une vingtaine de minutes. Même si tu sais très peu de choses, écris ce que tu sais. Puis, dans la semaine, note ce qui te vient quand tu penses à ton père, ou quand tu entends parler des pères autour de toi.",
      exercices: [
        { k: 'ex1', titre: 'La lignée des hommes', type: 'tableau', rangs: 4,
          etiquettes: ['Mon père, ou celui qui a tenu ce rôle', 'Mon grand-père paternel', 'Mon grand-père maternel', 'Un autre homme de la lignée'],
          consigne: "Fais la liste des hommes de ta famille : ton père, tes grands-pères, un oncle ou un arrière-grand-père dont on parlait. Pour chacun, note ce que tu sais de sa vie, comment il était avec les autres, et ce qui semble se répéter : un métier, un départ, un silence, une force. Si tu n'as pas connu ton père, écris ce que tu sais de lui, ce que tu imagines, ou choisis l'homme qui a compté pour toi.",
          pourquoi: "Quand on écrit les vies de ces hommes les unes sous les autres, la chaîne apparaît : un même âge de départ, un même métier imposé, une même façon de ne rien dire. Ce que tu prenais pour ton caractère se révèle parfois être un héritage.",
          colonnes: [
            { q: "Que sais-tu de sa vie, même très peu ?", ph: ["Exemple : il est entré à l’usine à 16 ans et y est resté quarante ans", "Exemple : paysan dans le Cantal, prisonnier pendant la guerre", "Exemple : je sais seulement qu’il était menuisier et qu’il est mort jeune", "Exemple : mon oncle Paul, parti en Argentine à 25 ans"] },
            { q: "Comment était-il avec ses enfants, ou avec les autres ?", ph: ["Exemple : présent mais silencieux, il montrait son amour en réparant nos vélos", "Exemple : sévère, on se taisait quand il rentrait des champs", "Exemple : on dit qu’il était drôle et qu’il chantait au bal", "Exemple : très généreux avec les amis, absent avec sa famille"] },
            { q: "Qu’est-ce qui semble se répéter : un métier, un départ, un silence, une force ?", ph: ["Exemple : travailler sans jamais s’arrêter, ne jamais parler de soi", "Exemple : la dureté, et une loyauté sans faille envers la terre", "Exemple : des hommes qui partent tôt, d’une façon ou d’une autre", "Exemple : le goût de partir loin pour recommencer"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis tes lignes. Qu’est-ce qui passe d’homme en homme, en force comme en poids, et que tu reconnais en toi ?", ph: "Exemple : tous travaillaient sans relâche et ne disaient jamais « je suis fatigué ». J’ai leur endurance, et aussi leur difficulté à m’arrêter." } },
        { k: 'voir-journal', titre: 'Mon père en moi', type: 'texte',
          consigne: "Cette semaine, chaque fois qu’un geste, une phrase, une réaction te rappelle ton père, ton grand-père ou un homme de ta lignée, note-le le jour même. Remarque aussi ce qui te vient quand tu vois des pères autour de toi, dans la rue, dans une vitrine, dans un film. Vise au moins trois moments.",
          pourquoi: "Du côté paternel, l’héritage passe souvent par le corps et les gestes plus que par les mots. Le remarquer dans ta vie de tous les jours, c’est commencer à choisir ce que tu gardes.",
          q: "Ce que tu remarques, en général, de ton père en toi",
          ph: "Exemple : j’ai sa façon de froncer les sourcils quand je réfléchis, et son besoin de tout réparer moi-même.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque moment : le jour, ce que tu as fait ou ressenti, de qui ça te vient", ph: "Exemple : mardi, j’ai refusé l’aide d’un collègue en disant « je vais me débrouiller ». C’est exactement mon père. J’ai souri, un peu triste." } }
      ],
      conseil: "Si tu n’as pas connu ton père, ou si penser à lui est douloureux, commence par un grand-père, un oncle, un beau-père ou un autre homme qui a compté. Et si une émotion forte monte, fais une pause, respire, sors marcher : tu reprendras quand tu voudras." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'L’histoire des pères',
      intro: "Chaque père a d’abord été un fils, avec son propre père, présent ou absent. Cette semaine, tu remontes le fil de leurs histoires, avec douceur, pour comprendre ce qu’ils ont reçu, et ce que leur époque leur a demandé.",
      texte: [
        "Dans la méthode des deux cycles, le côté paternel touche souvent au **cycle de la racine** : la protection, le cadre, le travail, le droit d'aller dans le monde et d'y prendre sa place. Un père qui a lui-même manqué de sécurité transmet parfois la peur de prendre des risques, ou au contraire le besoin de tout contrôler, de ne compter que sur soi.",
        "Il touche aussi au **cycle du cœur** : être regardé·e, reconnu·e, recevoir la fierté de son père. Beaucoup d'enfants ont attendu un « je suis fier de toi » qui n'est jamais venu, et continuent, adultes, à chercher cette reconnaissance dans leur travail ou leurs relations. On commence en général par la racine : quand on se sent en sécurité, on peut accueillir plus librement l'amour reçu, même maladroit."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Du côté paternel, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, au détour d’une photo, d’un objet, d’une conversation.",
          pourquoi: "On découvre souvent que ce qui nous a manqué de notre père lui avait déjà manqué à lui. Le voir ne fait pas disparaître le manque, mais il transforme le reproche en compréhension, et te rend libre de faire autrement.",
          choix: { k: 'cycle', q: "Aujourd'hui, ce que tu as reçu du côté paternel touche surtout…", options: ['La racine : ma sécurité, mon droit d’oser', 'Le cœur : être reconnu·e et aimé·e', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'regarder-enfance', q: "Que sais-tu de l’enfance de ton père ?", ph: "Exemple : il a été élevé par sa grand-mère, son père travaillait à l’usine de nuit et le voyait peu." },
            { k: 'regarder-grand-pere', q: "Comment ton grand-père paternel était-il avec ses enfants ?", ph: "Exemple : très dur, il ne parlait qu’au moment des repas et on n’avait pas le droit de pleurer." },
            { k: 'regarder-departs', q: "Quels hommes de ta lignée sont partis, ou ont disparu tôt ? À quel âge ?", ph: "Exemple : mon arrière-grand-père, mort à la guerre à 32 ans. Mon grand-père avait 6 ans." },
            { k: 'regarder-phrases', q: "Quelles phrases sur les hommes, ou sur les pères, entendais-tu enfant ?", ph: "Exemple : « Un homme, ça ne pleure pas. » « Les hommes, on ne peut pas compter dessus. »" }
          ] },
        { k: 'source-question', titre: 'Une question sur ton grand-père', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur ton grand-père paternel, ou sur ton père jeune. Par téléphone, à table, ou par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html). Si personne ne peut te répondre, regarde un objet ou une photo qui vient de lui, et note ce que tu y vois.",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma tante : « Comment était papi avec papa quand il était petit ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a raconté que papi n’a jamais pris mon père dans ses bras. J’ai compris pourquoi mon père ne savait pas le faire avec moi.", lignes: 3 }
          ] }
      ],
      conseil: "Complète la branche paternelle de [ton arbre familial](genosociogramme.html), même avec peu d’informations. Si tu connais les dates de naissance et de décès, l’outil repère les âges qui se répètent, et ta page « Ton mois » te les rappellera." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Reconnaître sa place, reprendre la tienne',
      intro: "Cette semaine, tu fais le tri. Ce que tu as reçu du côté paternel en force, tu le gardes. Ce qui pèse, tu le rends symboliquement, sans rien renier de la vie reçue. Et tu écris à ton père ce qui n’a jamais pu être dit.",
      exercices: [
        { k: 'ex2', titre: 'Ce que j’ai reçu de mon père', type: 'blocs', nb: 3,
          etiquettes: ['Une première chose reçue', 'Une deuxième', 'Une troisième'],
          consigne: "Choisis trois choses reçues du côté paternel : une qualité, un goût, une habitude, une phrase. Si ton père a été absent, pense à ce que son absence t'a appris, ou à un autre homme qui a compté. Pour chacune, écris comment tu la vis aujourd'hui, et ce que tu choisis d'en faire : la garder, la transformer, ou la laisser.",
          pourquoi: "On croit souvent devoir tout accepter ou tout rejeter d’un père. Regarder ce qu’on a reçu, chose par chose, permet de garder la force et de déposer le poids, sans avoir à trancher sur l’homme tout entier.",
          astuce: "Même une absence transmet quelque chose : l’autonomie, la débrouillardise, le désir de faire autrement. Tu as le droit de reconnaître ce que tu as construit à partir du manque.",
          champs: [
            { q: "Qu’as-tu reçu ?", ph: ["Exemple : son goût pour le bricolage et le travail manuel", "Exemple : la phrase « on ne se plaint pas »", "Exemple : son absence, qui m’a appris à me débrouiller très tôt"] },
            { q: "Comment le vis-tu aujourd’hui ?", ph: ["Exemple : avec joie, je retape des meubles le week-end et ça me ressource", "Exemple : je ne dis jamais quand ça ne va pas, même à mes proches", "Exemple : je suis très autonome, mais je n’arrive pas à demander de l’aide"] },
            { q: "Que choisis-tu d’en faire ?", ph: ["Exemple : je le garde avec fierté, et je vais l’apprendre à ma fille", "Exemple : je le laisse, et je choisis de dire quand je suis fatigué·e", "Exemple : je garde ma débrouillardise, et j’apprends à accepter l’aide"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre au père', type: 'questions',
          consigne: "Écris une lettre à ton père, que tu ne lui enverras pas. Commence par « Papa », par son prénom, ou par « toi que je n'ai pas connu ». Dis ce que tu as aimé, ce qui t'a manqué, ce que tu n'as jamais pu lui dire. Si la relation est difficile, écris seulement ce qui te semble juste aujourd'hui, même trois lignes. Termine par ce que tu gardes de lui.",
          pourquoi: "Du côté des pères, beaucoup de choses sont restées dans le silence. Écrire les mots jamais dits leur donne enfin une place, hors de toi. Reconnaître sa place de père, puis lui rendre ce qui pèse, permet de te tenir debout, à ta place.",
          questions: [
            { k: 'lettre-a', q: "À qui écris-tu ?", ph: "Exemple : à papa, ou à toi, mon père que je n’ai jamais rencontré", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu as aimé, ce qui t’a manqué, ce que tu rends, ce que tu gardes de lui", ph: "Exemple : Papa, j’ai aimé nos dimanches au bord de la rivière, ta patience quand tu m’apprenais à pêcher. Il m’a manqué que tu me dises que tu étais fier de moi. Je sais aujourd’hui que ton père ne te l’a jamais dit non plus. Je te rends ce silence. Je garde ton calme et ton amour de la nature.", lignes: 8 }
          ] }
      ],
      rituel: {
        titre: 'La pierre du père',
        intro: "Ce rituel symbolique reconnaît la place de ton père dans ta vie, quelle qu'elle soit, et te rend la tienne. Fais-le une fois dans la semaine, après ta lettre. Il dure environ dix minutes, dehors de préférence.",
        materiel: "Une petite pierre choisie sur un chemin ou dans un jardin, ta lettre, et un endroit calme.",
        etapes: [
          "Installe-toi dans un endroit calme. Tiens la pierre dans ta main, sens son poids et sa forme. Respire trois fois.",
          "Pense à ton père, tel qu'il a été, ou tel que tu l'imagines si tu ne l'as pas connu. Reste à la distance qui te convient.",
          "Dis, à voix haute ou intérieurement : « Tu es mon père. Tu as ta place dans ma lignée. »",
          "Puis : « Je prends la vie qui m'est venue par toi. Ce qui t'appartient, je te le laisse. Je prends ma place, ni devant ni derrière toi. »",
          "Pose la pierre dans un endroit qui te plaît : au pied d’un arbre, dans un pot de fleurs, au bord d'un chemin ou d’une rivière.",
          "Regarde-la quelques secondes, puis éloigne-toi tranquillement. Note ici ce que tu as ressenti."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : où tu as posé la pierre, ce que tu as dit, ce que tu as ressenti.", ph: "Exemple : je l’ai posée au bord du canal où il m’emmenait faire du vélo. En disant « tu as ta place », j’ai pleuré, puis je me suis senti·e plus droit·e." }
      },
      conseil: "Si la lettre ou le rituel réveillent une émotion forte, fais une pause, bois un verre d’eau, sors marcher ou appelle une personne de confiance. Tu peux finir un autre jour. Et si ton père t’a fait du mal, tu n’as rien à pardonner ce mois-ci : reconnaître qu’il est ton père, c’est simplement reconnaître d’où te vient la vie." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Recevoir et faire vivre',
      intro: "Tu as regardé les hommes de ta lignée, compris un peu de leur histoire, et rendu ce qui pesait. Cette semaine, tu choisis une qualité reçue du côté paternel, et tu la fais vivre consciemment, à ta façon, dans ta vie d’aujourd’hui.",
      texte: [
        "**La première pause.** Quand tu sens monter un vieux réflexe hérité, le silence, la colère qui gronde, l'envie de partir, respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois de suite. Puis dis-toi intérieurement : « Je te reconnais, tu viens des hommes de ma lignée. Aujourd’hui, je choisis autrement. »",
        "**La qualité que tu fais vivre.** Chaque lignée paternelle porte aussi des trésors : le courage, la patience, l'habileté des mains, la loyauté, le sens de l'humour, l'amour de la terre. Choisir l'un d'eux et l'utiliser consciemment, c'est transformer un héritage subi en un héritage choisi. C'est aussi une belle façon d'ouvrir, dès juillet, le temps de la transmission."
      ],
      exercices: [
        { k: 'ex3', titre: 'La qualité que je reçois', type: 'texte',
          consigne: "Choisis une qualité reçue du côté paternel, ou d'un homme qui a compté pour toi. Écris comment tu vas la faire vivre cette semaine, puis note chaque fois que tu l'as utilisée consciemment, et ce que ça t'a fait. Elle rejoint ton carnet « J’avance » : elle peut devenir un appui pour oser agir.",
          pourquoi: "Quand on regarde une lignée, on voit d’abord ce qui pèse. Choisir consciemment ce qui porte, c’est rééquilibrer le regard, et sentir que l’on peut s’appuyer sur ceux qui sont venus avant.",
          gestes: ["Réparer moi-même un objet, en pensant à lui", "Tenir une parole donnée, comme il savait le faire", "Garder mon calme dans une situation tendue", "Dire « je suis fier·e de moi » à voix haute", "Partager une histoire de mon grand-père avec un proche", "Dire une émotion au lieu de la taire, là où lui ne pouvait pas"],
          q: "Ta qualité : « De mon père (ou de…), je reçois…, et cette semaine je vais la faire vivre en… »",
          ph: "Exemple : de mon grand-père, je reçois la patience. Cette semaine, je vais la faire vivre en accompagnant mon fils dans ses devoirs sans m’énerver.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as fait vivre : quand, et qu’est-ce que ça t’a fait ?", ph: "Exemple : mercredi, j’ai réparé la lampe du salon. J’ai pensé à lui, et je me suis senti·e accompagné·e." } }
      ],
      conseil: "Si le vieux réflexe revient malgré tout, ce n’est pas un échec : remarque-le après coup, et dis-toi « la prochaine fois ». Et si tu n’as trouvé aucune qualité chez ton père, choisis-en une chez un autre homme de ta vie : la lignée du cœur compte aussi." }
  ],

  meditation: {
    titre: 'La main du père',
    intro: "Une séance guidée pour rencontrer ton père et la lignée des hommes, à la distance qui te convient, poser ce qui pèse, et te tenir debout à ta place.",
    texte: [
      "Installe-toi confortablement et ferme les yeux. Respire profondément, trois fois. Laisse tes épaules descendre, ton dos se poser, ton souffle ralentir.",
      "[pause]",
      "Avant de commencer, sache que tu peux t’arrêter à tout moment. Si quelque chose est trop fort, ouvre les yeux, sens tes pieds sur le sol, et reviens à ton souffle. Tu es en sécurité, ici et maintenant.",
      "Imagine que tu marches dans un paysage calme, à la fin d'une journée d'été. L'air est doux, la lumière est dorée, l’herbe sent le foin. Devant toi, à quelques pas, se tient une silhouette d'homme. C'est ton père, tel que tu l'as connu, ou l'image que tu as de lui si tu ne l'as pas connu.",
      "Tu peux t'approcher, ou rester à distance. Tu choisis. Rien ne t'oblige. Remarque simplement ce qui se passe en toi : de la chaleur, de la gêne, de la tristesse, de la colère, ou rien de particulier. Tout est accueilli.",
      "[pause]",
      "Derrière lui, tu devines son propre père. Et derrière encore, d'autres hommes, une longue file qui remonte le temps : des paysans, des ouvriers, des soldats, des artisans, des voyageurs. Chacun a porté ce qu'il a pu, avec ce qu'il avait reçu.",
      "Si tu le souhaites, imagine que ton père te tend quelque chose : un objet, un mot, une couleur. Prends-le, ou laisse-le. Les deux sont justes.",
      "[longue pause]",
      "Si tu portes quelque chose de lourd venant de cette lignée, une colère, un silence, une attente, tu peux le poser au sol, doucement, en disant intérieurement : « Je te laisse ceci. Je garde la vie qui m'est venue par toi. »",
      "Sens comme tes épaules s’allègent. Sens le sol sous tes pieds. Tu es debout, à ta place, ni devant ni derrière. La file des hommes reste là, derrière toi, comme un appui, et tu peux avancer.",
      "Si un autre homme t’a accompagné·e dans ta vie, un grand-père, un oncle, un ami, imagine-le aussi, à tes côtés. Remercie-le, à ta façon.",
      "[pause]",
      "Respire profondément. Sens ton corps, le siège sous toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes, plutôt en journée ou en début de soirée. Garde un verre d’eau à côté de toi. Si ta relation avec ton père est très douloureuse, ou si tu l’as perdu récemment, tu peux commencer par imaginer seulement un autre homme qui a compté : la file peut attendre.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une silhouette, une distance, un objet tendu, ce que tu as posé…", ph: "Exemple : je suis resté·e loin, puis j’ai fait deux pas. Il m’a tendu un vieux couteau de poche. J’ai posé au sol une pierre très lourde, et j’ai respiré." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-lignee', q: "Qu’as-tu découvert de la lignée des hommes de ta famille ce mois-ci ?", ph: "Exemple : de père en fils, personne n’a jamais dit « je suis fier de toi ». Ce n’était pas un manque d’amour, c’était une chaîne." },
    { k: 'fin-laisse', q: "Qu’as-tu laissé à la lignée des pères, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : le silence et la colère rentrée. J’ose dire plus facilement quand quelque chose ne va pas." },
    { k: 'fin-recois', q: "Que gardes-tu, et que reçois-tu avec gratitude, du côté paternel ?", ph: "Exemple : l’habileté des mains, l’amour de la nature, le sens de la parole donnée." },
    { k: 'fin-geste', q: "Quelle qualité as-tu fait vivre, et qu’est-ce qu’elle a changé ?", ph: "Exemple : la patience de mon grand-père. Les devoirs avec mon fils se passent mieux, et je me sens relié·e à lui." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en juillet, en regardant l’argent et ta valeur ?", ph: "Exemple : continuer à dire ce que je ressens, et regarder ce que ma famille m’a transmis sur l’argent.", court: true }
  ],

  carnet: {
    titre: 'Oser agir',
    texte: "Ce que tu libères ici donne de l’élan à ce que tu construis là-bas. Pendant que ton suivi regarde ce que tu as reçu de ton père, ton carnet t’aide à décider, à découper ton projet en étapes et à tenir tes promesses envers toi. Reporte ta qualité reçue dans ton carnet, elle devient un appui pour agir."
  },

  aVenir: [
    { mois: 'Juillet', titre: 'L’argent et ta valeur', texte: "Écouter les phrases familiales sur l’argent, regarder ce que ta lignée a vécu, et choisir ce que tu t’autorises à recevoir.", image: 'assets/cartes/peurs-rendre-mini.jpg' },
    { mois: 'Août', titre: 'Racines, départs et lieux', texte: "Retrouver les lieux de ta famille, regarder les départs et les exils, et sentir où tu te sens chez toi.", image: 'assets/cartes/partir-mini.jpg' },
    { mois: 'Septembre', titre: 'Les métiers de la lignée', texte: "Regarder le travail de ta famille, reconnaître les vocations empêchées, et choisir ce que tu veux faire de ta vie professionnelle.", image: 'assets/guide/guide-transmission.webp' }
  ]
};
