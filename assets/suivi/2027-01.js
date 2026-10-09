/* Genesolia · Le Cercle · Mon suivi « Je me libère » de janvier 2027 : « Ton prénom, ton héritage »
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
  titre: 'Ton prénom, ton héritage',
  sousTitre: "Découvrir l'histoire de ton prénom, ce qu'il porte de ta lignée, et en faire pleinement le tien.",
  citation: "Ton prénom a une histoire, et tu peux en écrire la suite.",
  audio: '',
  audioCourt: '',
  saisonLien: "Janvier est un seuil : l'année ouvre ses deux regards, l'un vers ce qui a été, l'autre vers ce qui vient. C'est le bon moment pour revenir à ce qui t'accompagne depuis ton tout premier jour, ton prénom. En regardant son histoire, tu reçois ce qu'on a voulu pour toi ; en le faisant tien, tu poses l'intention de ce que tu veux vivre. Pas de révolution : un seuil se franchit pas à pas.",
  intensiteQ: "À quel point l’histoire de ton prénom, ou ce qu’on attendait de toi en le choisissant, pèse-t-elle aujourd’hui ?",
  souhaitPh: "Exemple : cette impression de devoir ressembler à la grand-mère dont je porte le prénom.",

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
      theme: ['assets/cartes/ecrire-la-mienne-mini.jpg', 'Je ne rejoue pas leur histoire. J’écris la mienne.']
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Le seuil de l’année n’exige rien de toi : il t’invite à regarder, puis à choisir.",
    theme: "Lis cette page comme une lettre. Prononce ton prénom à voix basse en la lisant, et remarque ce qu’il te fait.",
    voir: "Cette semaine, tu fais la liste des prénoms. Ce qui se répète devient visible, tout simplement.",
    source: "Demande l’histoire de ton prénom avec curiosité. Même un « je ne sais plus » est une réponse qui compte.",
    liberer: "Tu ne renies pas ton prénom : tu le remercies, tu rends ce qui ne t’appartient pas, et tu le gardes pour toi.",
    remplacer: "Signe ton intention de ton prénom. C’est peut-être la première fois que tu le portes exprès.",
    meditation: "Un matin calme, si tu peux. Si une émotion monte en entendant ton prénom, reviens simplement à ton souffle.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Ton prénom sonne peut-être déjà un peu autrement."
  },

  theme: {
    titre: 'L’histoire de ton prénom',
    texte: [
      "Janvier ouvre une nouvelle année. On prend des résolutions, on fait des vœux, on range ce qui est fini et on se projette vers ce qui vient. C'est un bon moment pour revenir à ce qui t'accompagne depuis ta naissance, que tu entends chaque jour et que tu écris sans y penser : ton prénom. Quelqu'un l'a choisi pour toi, avant même de te connaître. Il porte parfois un hommage, un espoir, une promesse, une mémoire familiale.",
      "Sur l'année, ton suivi traverse trois temps : **Voir** (d'octobre à décembre), **Traverser** (de janvier à juin) et **Transmettre** (de juillet à octobre). Avec janvier, tu entres dans le deuxième temps. Tu as vu ce qui revient, honoré tes ancêtres, observé ta place à table. Maintenant, tu traverses : tu regardes ce que tu portes en toi, en commençant par le plus intime, ton prénom, pour le vivre avec plus de liberté dans l'année qui commence."
    ],
    sousTitre: 'Les prénoms qui reviennent',
    texte2: [
      "En psychogénéalogie, on observe que le prénom est rarement neutre. Il peut venir d'un grand-parent, d'une personne aimée, d'une figure admirée, d'un personnage de roman, ou d'un enfant disparu avant toi. Même un prénom choisi « parce qu'il sonnait bien » raconte quelque chose : les goûts d'une époque, le désir de rompre avec la tradition, ou au contraire de la prolonger.",
      "Porter un prénom transmis, c'est parfois recevoir une attente sans le savoir : ressembler à quelqu'un, prolonger son histoire, combler une absence. Une petite Louise qui porte le prénom d'une grand-mère très admirée peut sentir qu'on attend d'elle la même force. Dans beaucoup de familles, les mêmes prénoms circulent : un Jean à chaque génération, des Marie en deuxième prénom. Parfois, un prénom est redonné à un enfant né après un décès, et l'enfant grandit avec l'impression d'occuper deux places à la fois. Ces répétitions ne sont pas un destin : elles sont une piste pour comprendre ce que ta famille a voulu garder vivant.",
      "Ce mois-ci, tu vas **voir** les prénoms de ta lignée, **remonter** à l'histoire du tien, **rendre** ce qu'il porte et qui n'est pas à toi, et te le **réapproprier**, pour signer ton année de ton propre nom. Pour aller plus loin : [la méthode des deux cycles](methode.html) et [le prénom transmis](prenom-transmis-psychogenealogie.html)."
    ],
    exemplesTitre: 'Ce que peut porter un prénom, au quotidien',
    exemples: [
      "**L’hommage** : tu portes le prénom de ton grand-père, et à chaque repas de famille on te dit « tu es bien comme lui ». Tu ne sais plus très bien ce qui est à toi.",
      "**La mémoire** : ta mère a perdu une petite sœur, et tu portes son prénom en deuxième position. Personne n’en parle, mais ta mère a toujours eu peur pour toi.",
      "**L’espoir** : tes parents t’ont appelé·e Victoire, ou René, « celui qui renaît ». Tu sens depuis toujours qu’il fallait réussir, ou recommencer quelque chose.",
      "**La rupture** : ton prénom ne ressemble à aucun autre dans la famille. Tu apprends que ta mère voulait « en finir avec les vieux prénoms », et avec tout ce qui allait avec.",
      "**Le surnom** : depuis l’enfance, on t’appelle « la petite », « Bibou » ou par un diminutif. À 35 ans, tu remarques que tu as du mal à te faire appeler par ton vrai prénom."
    ],
    exempleSpirale: "La spirale, c’est le même prénom, un cran plus haut. Tu portes celui de ta grand-mère Jeanne, réputée pour tout supporter sans se plaindre, et tu te surprends à faire pareil. Ce mois-ci, tu apprends son histoire, tu la remercies, et tu lui rends le « tout supporter ». Tu gardes son courage. Quand tu signes ton intention « Jeanne », tu as l’impression, pour la première fois, de signer pour toi.",
    question: { k: 'theme-prenom', q: "Quand tu prononces ton prénom à voix haute, que ressens-tu, et qu’est-ce qu’il évoque pour toi ?", ph: "Exemple : de la fierté, et un peu de poids. Il évoque ma grand-mère, que tout le monde admirait." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les prénoms de ta lignée',
      intro: "Cette semaine, tu poses sur la table les prénoms de ta famille, sur trois ou quatre générations. Tu ne cherches pas encore à tout comprendre : tu regardes ce qui revient.",
      texte: "Commence par la liste des prénoms, au calme, une vingtaine de minutes, avec ton arbre si tu l’as déjà commencé. Puis, pendant la semaine, remarque comment on prononce ton prénom autour de toi, et note-le dans ton journal.",
      exercices: [
        { k: 'ex1', titre: 'Les prénoms de ma lignée', type: 'tableau', rangs: 4,
          etiquettes: ['Un premier prénom', 'Un deuxième prénom', 'Un troisième prénom', 'Un quatrième prénom'],
          consigne: "Fais la liste des prénoms de ta famille, sur trois ou quatre générations, en commençant par ceux qui reviennent ou qui ressemblent au tien. Note qui les a portés, et ce que tu sais de leur histoire. Ce qui se répète devient visible.",
          pourquoi: "Quand on aligne les prénoms d’une famille, les répétitions sautent aux yeux : un prénom qui saute une génération, un deuxième prénom toujours identique, un prénom donné après un départ. Ce sont des indices précieux de ce que la famille a voulu garder vivant.",
          colonnes: [
            { q: "Quel est ce prénom ?", ph: ["Exemple : Jean", "Exemple : Marie, en deuxième prénom", "Exemple : Louise", "Exemple : Pierre"] },
            { q: "Qui l’a porté, dans ta famille ?", ph: ["Exemple : mon arrière-grand-père, mon grand-père, et mon frère aîné", "Exemple : ma mère, ma tante, ma sœur et moi", "Exemple : ma grand-mère maternelle, puis ma fille", "Exemple : le frère de mon père, mort enfant, puis mon père lui-même"] },
            { q: "Que sais-tu de leur histoire ?", ph: ["Exemple : tous les aînés ont repris la ferme, sauf mon frère", "Exemple : c’était pour remercier une tante qui avait élevé ma grand-mère", "Exemple : ma grand-mère était la femme forte de la famille", "Exemple : on n’en parle presque pas, juste « le petit Pierre »"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis ta liste. Quels prénoms reviennent, et lequel ressemble le plus au tien, ou à ton histoire ?", ph: "Exemple : Jean revient à chaque génération chez les aînés. Et mon deuxième prénom, Louise, est celui de ma grand-mère que je n’ai pas connue." } },
        { k: 'voir-journal', titre: 'Mon journal du prénom', type: 'texte',
          consigne: "Cette semaine, remarque comment on prononce ton prénom autour de toi : au travail, en famille, entre amis. Le ton, les surnoms, les raccourcis, qui l’utilise et qui ne l’utilise jamais. Note chaque jour un moment, et ce que tu as ressenti. Vise au moins trois moments.",
          pourquoi: "La façon dont on nous appelle dit beaucoup de la place qu’on nous donne. Un surnom d’enfant chez les adultes, un prénom prononcé sèchement, un prénom qu’on évite : tout cela se remarque à peine, et pourtant nous touche.",
          q: "Ce que tu remarques, en général, quand on prononce ton prénom",
          ph: "Exemple : ma famille utilise toujours mon surnom d’enfant, et au travail on m’appelle par mon nom de famille. Mon vrai prénom, presque personne ne le dit.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque moment : le jour, qui t’a appelé·e, comment, et ce que tu as ressenti", ph: "Exemple : mardi, ma mère m’a appelée « ma Loulou » au téléphone. Je me suis sentie petite, et un peu attendrie." } }
      ],
      conseil: "Tu n’as pas besoin de connaître tous les prénoms de ta famille. Commence par ceux que tu connais, et laisse des cases vides : elles se rempliront peut-être en posant des questions la semaine prochaine." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'Qui a choisi ton prénom, et pourquoi',
      intro: "Cette semaine, tu remontes à la naissance de ton prénom. Qui l’a choisi, pour quelle raison, en pensant à qui ? Tu poses tes questions avec douceur, à ta famille comme à toi-même.",
      texte: [
        "Un prénom porte souvent l'un de deux besoins. Le **cycle de la racine** parle de sécurité et de place : un prénom d'aîné qui garantit la continuité, un prénom qui inscrit l'enfant dans la lignée, ou au contraire un prénom donné « pour remplacer » quelqu'un, et qui laisse le sentiment de devoir mériter sa place. Le **cycle du cœur** parle de lien : un prénom d'hommage à une personne aimée, un prénom choisi pour réparer une peine, un prénom qui exprime l'amour ou l'espoir des parents.",
        "Regarder de quel côté penche ton prénom t'aide à comprendre ce qu'il t'a demandé, sans que personne ne l'ait jamais dit. Ce n'est pas un reproche fait à ceux qui l'ont choisi : ils ont fait de leur mieux, avec leur histoire. C'est une façon de recevoir ton prénom en connaissance de cause."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Autour de ton prénom, regarde', type: 'questions',
          consigne: "Prends ces questions une par une, avec ta liste de prénoms à côté de toi. Si une réponse ne vient pas, passe à la suivante. Elle viendra peut-être dans la semaine, au détour d’une conversation.",
          pourquoi: "Les raisons d’un prénom sont souvent racontées en une phrase, une fois, puis oubliées. Les rassembler permet de voir ce que ton prénom porte vraiment : un hommage, une attente, une mémoire, un désir de changement.",
          choix: { k: 'cycle', q: "Aujourd'hui, l'histoire de ton prénom touche surtout…", options: ['La racine : la continuité, la place, le droit d’exister pour moi-même', 'Le cœur : l’hommage, l’amour, une peine à apaiser', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-choisi', q: "Qui a choisi ton prénom, et dans quelles circonstances ?", ph: "Exemple : mon père, à la mairie, parce que ma mère hésitait encore entre deux prénoms." },
            { k: 'source-pourquoi', q: "Pourquoi ce prénom, et pas un autre ?", ph: "Exemple : en hommage à la sœur de ma mère, morte à 18 ans dans un accident." },
            { k: 'source-avant', q: "Qui le portait avant toi dans la famille, et que sais-tu de cette personne ?", ph: "Exemple : ma grand-tante Hélène. On dit qu’elle était très drôle et qu’elle voulait partir à Paris." },
            { k: 'source-attente', q: "Qu’est-ce qu’on attendait peut-être de toi, à travers ce prénom ?", ph: "Exemple : que je sois aussi joyeuse qu’elle, et que je console ma mère de sa perte." },
            { k: 'source-surnom', q: "Quel surnom t’a-t-on donné, et pourquoi ?", ph: "Exemple : « Poussin », parce que j’étais le plus petit de la famille. On me l’a dit jusqu’à mes 30 ans." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Demande à un membre de ta famille pourquoi ton prénom a été choisi. Par téléphone, à table, ou par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma mère : « Pourquoi m’avez-vous appelée Claire ? Vous aviez pensé à d’autres prénoms ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris, et qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a dit que je devais m’appeler Marie, comme ma grand-mère, mais que mon père avait refusé au dernier moment. Je me suis senti·e libre, d’un coup.", lignes: 3 }
          ] }
      ],
      conseil: "Ajoute dans [ton arbre familial](genosociogramme.html) les prénoms qui se répètent et les personnes qui les ont portés : ta page « Ton mois » te rappellera leurs dates. Si tu découvres que ton prénom a été porté par un enfant disparu, prends le temps de respirer : tu peux lire [l’enfant de remplacement](enfant-de-remplacement.html), ou simplement faire une pause et revenir plus tard." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre ce que ton prénom porte',
      intro: "Cette semaine, tu fais le tri dans ce que porte ton prénom : ce que tu gardes avec gratitude, et ce que tu rends, avec respect, à celles et ceux à qui cela appartient.",
      exercices: [
        { k: 'ex2', titre: 'L’histoire de mon prénom', type: 'blocs', nb: 3,
          etiquettes: ['Mon prénom', 'Un prénom qui me touche', 'Un autre prénom de ma famille'],
          consigne: "Commence par ton propre prénom, puis choisis deux autres prénoms qui te touchent : un frère, une sœur, un parent, un enfant. Pour chacun, note ce que tu sais de son choix, même si c’est très peu, et ce qu’il évoque pour toi aujourd’hui.",
          pourquoi: "Regarder le prénom des autres aide à voir le sien avec plus de recul. On découvre souvent qu’un frère porte l’espoir, une sœur la mémoire, et soi-même autre chose encore. Chacun·e a reçu sa part de l’histoire.",
          astuce: "Si tu ne sais rien du choix d’un prénom, écris ce que tu imagines, puis vérifie plus tard. L’intuition est aussi une information.",
          champs: [
            { q: "Quel est ce prénom, et qui le porte ?", ph: ["Exemple : Jeanne, moi", "Exemple : Paul, mon frère aîné", "Exemple : Rose, ma fille"] },
            { q: "Qui l’a choisi, et pourquoi ?", ph: ["Exemple : ma mère, en hommage à sa grand-mère qui l’a élevée", "Exemple : mon père, pour continuer la lignée des Paul", "Exemple : nous deux, parce qu’il était doux et qu’il n’appartenait à personne dans la famille"] },
            { q: "Que porte ce prénom pour toi, aujourd’hui ?", ph: ["Exemple : du courage, et l’impression de devoir tout supporter", "Exemple : la fierté d’être l’aîné, et le poids de la ferme", "Exemple : un vrai nouveau départ, un prénom libre"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à mon prénom', type: 'questions',
          consigne: "Écris une lettre à ton prénom. Commence par « Cher prénom que je porte… ». Dis-lui ce que tu as aimé ou moins aimé chez lui, ce qu’il porte de ta famille, et ce que tu veux lui rendre. Termine par la façon dont tu choisis de le porter cette année, comme le tien.",
          pourquoi: "On ne se libère pas d’un héritage en le rejetant, mais en le reconnaissant. Écrire à ton prénom permet de remercier ce qu’il te relie à ta lignée, et de lui rendre ce qui n’est pas à toi, pour le garder léger.",
          questions: [
            { k: 'lettre-a', q: "Quel prénom choisis-tu d’écrire, tel que tu le portes aujourd’hui ?", ph: "Exemple : Jeanne-Marie, mes deux prénoms ensemble", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu as aimé ou moins aimé, ce qu’il porte de ta famille, ce que tu rends, comment tu choisis de le porter", ph: "Exemple : Cher prénom que je porte, enfant je te trouvais trop vieux, et je rêvais d’un prénom à la mode. Tu portes ma grand-mère, son courage et sa façon de tout encaisser. Je garde son courage. Je lui rends le « tout encaisser ». Cette année, je choisis de te porter fièrement, et de dire « Jeanne » quand je me présente, au lieu de mon surnom.", lignes: 8 }
          ] }
      ],
      rituel: {
        titre: 'Le prénom retrouvé',
        intro: "Ce rituel symbolique marque le moment où tu fais pleinement tien ton prénom, au seuil de la nouvelle année. Fais-le une fois ce mois-ci, dans un moment calme, idéalement après ta lettre. Il dure environ dix minutes.",
        materiel: "Une feuille, un stylo et, si tu le souhaites, une bougie.",
        etapes: [
          "Si tu le souhaites, allume la bougie. Respire trois fois profondément. Écris ton prénom en grand au centre de la feuille.",
          "Autour, note les personnes et les histoires qu’il porte : ceux qui l’ont porté avant toi, ceux qui l’ont choisi, ce qu’on attendait de toi.",
          "Dis à voix haute : « Je reçois l’histoire de mon prénom avec respect. »",
          "Puis dis : « Ce qui appartient aux autres, je le leur laisse. »",
          "Prononce ton prénom trois fois, lentement, et dis : « Il est à moi. »",
          "Plie la feuille et garde-la dans un endroit qui compte pour toi. Si tu as allumé une bougie, éteins-la (ne la laisse jamais sans surveillance), et note ce qui est venu, ci-dessous."
        ],
        note: { k: 'rituel-note', q: "Comment s’est passé ton rituel ? Qu’as-tu ressenti en disant « Il est à moi » ?", ph: "Exemple : la première fois, ma voix tremblait. La troisième fois, j’ai souri. J’ai eu l’impression de m’entendre vraiment pour la première fois." }
      },
      conseil: "Si la lettre ou le rituel réveille une émotion forte, surtout si ton prénom est lié à une personne disparue, fais une pause, bois un verre d’eau, sors marcher. Tu peux finir un autre jour. Ton prénom restera là, il n’est pas pressé." },

    { cle: 'remplacer', nom: 'L’élan', etape: 'Remplacer', titre: 'Signer ton année de ton prénom',
      intro: "Tu as vu les prénoms de ta lignée, découvert l’histoire du tien, rendu ce qu’il portait de trop. Cette semaine, tu poses une intention pour l’année qui te ressemble vraiment, et tu la signes de ton prénom.",
      texte: [
        "**La première pause.** Quand une vieille attente liée à ton prénom se présente (« tu es bien comme ton grand-père », « une vraie petite Louise »), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Merci. Je porte ce prénom à ma façon. »",
        "**Le prénom choisi.** Te réapproprier ton prénom, c’est accueillir son histoire tout en affirmant : « Je suis moi, avec ma propre vie. » Certain·es changent d’usage ou de surnom ; d’autres le gardent tel quel, mais le portent autrement. Signer ton intention de l’année de ton prénom, c’est le premier geste de cette liberté."
      ],
      exercices: [
        { k: 'ex3', titre: 'Mon intention signée', type: 'texte',
          consigne: "Écris une intention pour l’année qui te ressemble vraiment, puis signe-la de ton prénom, en entier. Ensuite, note chaque fois que tu as porté ton prénom autrement cette semaine : te présenter, signer, corriger un surnom, le dire avec fierté. Cette intention rejoint aussi celle de ton carnet « J’avance ».",
          pourquoi: "Un prénom porté exprès devient un appui. Chaque fois que tu le prononces en conscience, tu le reprends un peu plus pour toi, et l’ancienne attente perd de sa force.",
          gestes: ["Me présenter avec mon prénom complet", "Demander gentiment qu’on n’utilise plus un surnom", "Signer mes messages de mon prénom", "Écrire mon prénom joliment, à la main", "Dire mon prénom en me regardant dans le miroir", "Choisir le prénom que je préfère parmi les miens"],
          q: "Ton intention signée : « Cette année, je choisis de… » suivie de ton prénom",
          ph: "Exemple : cette année, je choisis de vivre ma propre histoire, avec le courage de ma grand-mère et ma joie à moi. Jeanne.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as porté ton prénom autrement : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : lundi, je me suis présentée « Jeanne » à la réunion, au lieu de « Jeannette ». J’ai senti mes épaules se redresser." } }
      ],
      conseil: "Si l’ancien surnom ou l’ancienne attente revient, ce n’est pas un échec : remarque-le, souris, et redis ton prénom intérieurement. Changer la façon de porter un prénom prend du temps, pour toi comme pour les autres." }
  ],

  meditation: {
    titre: 'Le prénom murmuré',
    intro: "Une séance guidée pour entendre ton prénom prononcé pour la première fois, saluer celles et ceux qui l’ont porté avant toi, et le faire pleinement tien.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois. Laisse ton corps se poser.",
      "[pause]",
      "Imagine le jour de ta naissance. La pièce est calme, la lumière douce, une lumière d’hiver peut-être, ou de printemps. Quelqu'un te tient dans ses bras, te regarde pour la première fois, et prononce ton prénom.",
      "Écoute sa voix. Tu n'as pas besoin de savoir qui c'est. Sens simplement ce qu'elle porte : de l'amour, un espoir, une fierté, peut-être une mémoire, peut-être une inquiétude. Accueille tout, sans rien trier.",
      "[pause]",
      "Derrière cette voix, d'autres personnes apparaissent doucement. Celles qui ont porté ce prénom avant toi, ou qui l'ont inspiré. Certaines ont un visage connu, d'autres restent dans la lumière.",
      "Salue-les avec respect. Tu peux leur dire intérieurement : « Merci. Je reçois ce que vous m'avez transmis. Je garde le meilleur, et je vis ma propre histoire. » Regarde-les s'éloigner, apaisées.",
      "[longue pause]",
      "Maintenant, prononce toi-même ton prénom, intérieurement. Lentement. Écoute comme il sonne dans ta voix à toi, celle d'aujourd'hui. Remarque ce que tu ressens dans ton corps en l'entendant : une chaleur, une gêne, une fierté. Tout est bienvenu.",
      "Prononce-le encore, comme si tu te présentais à toi-même pour la première fois. Sens-le devenir pleinement le tien.",
      "[pause]",
      "Il t'accompagne depuis toujours, et il t'accompagnera dans tout ce que tu vas vivre cette année, comme un chemin ouvert devant toi, au-delà du seuil.",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts, les épaules. Quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un matin calme, ou un soir tranquille, où personne ne te dérangera pendant dix minutes. Si ton prénom est lié à une personne disparue et qu’une émotion monte trop fort, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une voix, un visage, une sensation en prononçant ton prénom…", ph: "Exemple : j’ai entendu la voix de mon père, très douce. En disant mon prénom, j’ai senti une chaleur dans la poitrine." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-retiens', q: "Que retiens-tu de ce mois passé avec ton prénom ?", ph: "Exemple : que mon prénom est un hommage plein d’amour, pas une mission à accomplir." },
    { k: 'fin-porte', q: "Qu’as-tu découvert de ce que ton prénom porte de ta lignée ?", ph: "Exemple : le courage de ma grand-mère Jeanne, et son habitude de tout encaisser sans rien dire." },
    { k: 'fin-rendu', q: "Qu’as-tu rendu, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : j’ai rendu le « tout encaisser ». J’ose dire plus facilement quand quelque chose ne me convient pas." },
    { k: 'fin-garde', q: "Que choisis-tu de garder de ton prénom, et comment veux-tu le porter ?", ph: "Exemple : son courage, et sa douceur. Je veux le porter en entier, sans surnom, avec fierté." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en février ?", ph: "Exemple : regarder les couples de ma famille, et ce qui se rejoue dans ma façon d’aimer.", court: true }
  ],

  carnet: {
    titre: 'Mon intention, mes valeurs',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Dans ton carnet, tu clarifies tes valeurs et tu poses l’intention de ton année : signe-la du prénom que tu viens de faire tien, elle n’en sera que plus forte."
  },

  aVenir: [
    { mois: 'Février', titre: 'Le couple et les schémas amoureux', texte: "Regarder les couples de ta lignée, repérer ce qui se répète en amour, et choisir l’amour que tu veux vivre.", image: 'assets/cartes/une-relation-vraie-mini.jpg' },
    { mois: 'Mars', titre: 'Ta place dans la fratrie', texte: "Regarder la place que tu as reçue parmi tes frères et sœurs, et choisir celle que tu veux habiter aujourd’hui.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Avril', titre: 'Les secrets et les non-dits', texte: "Écouter les silences de ta famille, repérer les indices, et oser, à ton rythme, poser une question.", image: 'assets/cartes/ce-silence-mini.jpg' }
  ]
};
