/* Genesolia · Le Cercle · Mon suivi « Je me libère » de novembre 2026 : « Ceux qui sont venus avant toi »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2026-11',
  cle: 'suivi-2026-11',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2026-11-474ce578d0.pdf',
  nomMois: 'novembre 2026',
  moisSuivant: 'décembre',
  titre: 'Ceux qui sont venus avant toi',
  sousTitre: "Honorer tes ancêtres, reconnaître ce qu'ils t'ont transmis, et rendre avec respect ce qui ne t'appartient pas.",
  citation: "Quand chacun·e retrouve sa place dans l'arbre, tu peux enfin prendre la tienne.",
  audio: '',
  audioCourt: '',
  saisonLien: "Novembre est le mois du silence fertile. Sous la terre nue, les racines travaillent sans bruit, et l'on pense plus volontiers aux absent·es : celles et ceux qui ne sont plus là, ou dont on ne parle plus. C'est le bon moment pour te tourner vers ta lignée, doucement, une bougie à la main. Tu n'as rien à forcer : il suffit d'écouter ce qui remonte.",
  intensiteQ: "À quel point l’histoire de tes ancêtres pèse-t-elle sur ta vie aujourd’hui ?",
  souhaitPh: "Exemple : ce sentiment de porter une tristesse qui ne vient pas de moi, chaque année à la même saison.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-transmission.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-arbre.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ils-ont-traverse-mini.jpg', 'Ils ont traversé tant de choses pour que je puisse vivre la mienne.']
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Novembre ne demande pas d’aller vite : il demande d’écouter.",
    theme: "Lis cette page comme une lettre. Si un prénom te vient en lisant, note-le quelque part, il compte.",
    voir: "Cette semaine, tu fais la liste. Même un prénom sans date, même « le frère de mon père », c’est déjà beaucoup.",
    source: "Pose tes questions avec douceur, à ta famille comme à toi. Une réponse peut venir des jours plus tard.",
    liberer: "Tu ne rejettes personne : tu remercies, puis tu rends. Si une émotion monte, fais une pause, tu pourras reprendre un autre jour.",
    remplacer: "Porter la force, pas le poids. Un petit geste chaque jour suffit pour faire vivre ce que tu as reçu.",
    meditation: "Un soir tranquille, une couverture, une boisson chaude. Si une émotion monte, reviens à ton souffle et à tes pieds sur le sol.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Chaque prénom nommé ce mois-ci a retrouvé sa place."
  },

  theme: {
    titre: 'Honorer ceux qui sont venus avant toi',
    texte: [
      "Novembre est le mois où l'on pense aux disparus. Les jours raccourcissent, la nature se retire, et beaucoup de familles fleurissent les tombes, allument une bougie, se souviennent. C'est un moment idéal pour te tourner vers celles et ceux qui sont venus avant toi. Tu n'as pas choisi ta lignée, mais tu en es le prolongement : tes ancêtres t'ont transmis la vie, des forces, des talents, et parfois des histoires restées en suspens.",
      "Sur l'année, ton suivi traverse trois temps : **Voir** (d'octobre à décembre), **Traverser** (de janvier à juin) et **Transmettre** (de juillet à octobre). Nous sommes au cœur du premier temps. En octobre, tu as repéré ce qui revient dans ta vie ; ce mois-ci, tu regardes d'où cela peut venir, en levant les yeux vers ton arbre, ni pour juger tes ancêtres ni pour les idéaliser, mais pour leur donner leur juste place."
    ],
    sousTitre: 'Les oubliés de l’arbre',
    texte2: [
      "En psychogénéalogie, on observe que ce qui n'a pas été pleinement vécu, dit ou reconnu dans une famille a tendance à revenir aux générations suivantes. Un deuil qui n'a pas pu être fait, un enfant dont on ne parle plus, une personne exclue de la famille : ces histoires laissent des traces, souvent sans que personne ne fasse le lien.",
      "Dans beaucoup de familles, certaines personnes ont été effacées : un enfant mort jeune, une tante partie fâchée, un grand-père dont on avait honte, un premier mari dont on ne prononce plus le nom. Ces « oubliés » prennent souvent plus de place qu'on ne le croit. Leur absence se sent : un silence à table, une gêne quand on pose une question, un prénom redonné à un enfant né plus tard. Parfois, quelqu'un dans la génération suivante se met à leur ressembler sans le savoir.",
      "Honorer ses ancêtres, ce n'est pas vivre dans le passé. C'est reconnaître ce qui a été, pour ne plus avoir à le porter sans le savoir, et recevoir ce qu'ils t'ont donné de beau : un courage, un savoir-faire, une façon d'aimer. Ce mois-ci, tu vas **nommer** celles et ceux qu'on a oubliés, **remonter** à ce qui n'a pas été dit, **rendre** symboliquement ce qui ne t'appartient pas, et **recevoir** les forces de ta lignée. Pour aller plus loin : [la méthode des deux cycles](methode.html)."
    ],
    exemplesTitre: 'Quand les absent·es se font sentir, au quotidien',
    exemples: [
      "**À table** : chaque fois que tu demandes qui est le petit garçon sur la vieille photo, ta mère se lève pour débarrasser. Le sujet est clos, et personne ne sait pourquoi.",
      "**Dans les prénoms** : ton oncle porte le prénom d’un frère aîné mort bébé. On en parle à mi-voix, et lui a toujours eu l’impression de devoir « valoir pour deux ».",
      "**Dans le calendrier** : tous les ans, en novembre, tu te sens lourd·e sans raison. En regardant les dates, tu découvres qu’une arrière-grand-mère est partie à cette période.",
      "**Dans tes choix** : tu es la seule personne de ta famille à faire de la musique. Un jour, on te raconte qu’un grand-oncle, « celui dont on ne parle pas », jouait du violon dans les bals.",
      "**Dans tes peurs** : tu as toujours eu peur de partir loin. Tu apprends qu’un aïeul a émigré et n’a jamais revu les siens."
    ],
    exempleSpirale: "La spirale, c’est la même saison, un cran plus haut. Chaque mois de novembre, tu te sentais triste sans comprendre, et tu te le reprochais. Cette année, tu as nommé ton arrière-grand-mère Louise, partie un 14 novembre. Le 14, tu allumes une bougie pour elle et tu fais une promenade. La tristesse passe, plus légère : elle a trouvé sa place, tu as gardé la tienne.",
    question: { k: 'theme-avant', q: "Quand tu penses à « celles et ceux qui sont venus avant toi », quelle personne te vient en premier, et pourquoi elle ?", ph: "Exemple : ma grand-mère paternelle, que je n’ai pas connue. On disait que je lui ressemblais, mais personne ne me parlait d’elle." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les visages de ta lignée',
      intro: "Cette semaine, tu poses sur la table celles et ceux dont on parle peu. Tu ne cherches pas encore à comprendre : tu nommes, tu listes, tu remarques ce que ça te fait.",
      texte: "Commence par la liste des oubliés, au calme, une vingtaine de minutes, avec des photos de famille si tu en as. Puis, chaque fois que tu penses à un·e ancêtre ou que quelqu’un en parle autour de toi, note-le dans ton journal.",
      exercices: [
        { k: 'ex1', titre: 'La liste des oubliés', type: 'tableau', rangs: 4,
          etiquettes: ['Une première personne', 'Une deuxième personne', 'Une troisième personne', 'Une quatrième personne'],
          consigne: "Fais la liste des personnes de ta famille dont on parle peu ou pas du tout : enfants morts jeunes, personnes parties, exclues, oubliées. Pour chacune, note ce que tu sais, même très peu, et ce que tu ressens en écrivant son nom. Si tu ne connais pas le prénom, écris « le premier enfant de ma grand-mère », « le frère de mon père »…",
          pourquoi: "Nommer, c’est déjà redonner une place. Beaucoup de personnes sentent un apaisement simplement en écrivant un prénom qu’on ne prononçait plus. Et en alignant ces personnes, des points communs apparaissent parfois : une période, un départ, un silence.",
          colonnes: [
            { q: "Qui est cette personne, pour toi ?", ph: ["Exemple : Marcel, le frère aîné de mon grand-père", "Exemple : le premier bébé de ma grand-mère, sans prénom connu", "Exemple : ma tante Josiane, partie vivre au Canada", "Exemple : le premier mari de mon arrière-grand-mère"] },
            { q: "Que sais-tu d’elle, même très peu ?", ph: ["Exemple : il est mort à 20 ans, pendant la guerre, on n’en parle jamais", "Exemple : il est mort à quelques mois, ma grand-mère n’en parlait qu’aux fêtes, tard le soir", "Exemple : elle s’est fâchée avec ma mère dans les années 80", "Exemple : on sait juste qu’il s’appelait Henri et qu’il est « parti »"] },
            { q: "Que ressens-tu en écrivant son nom ?", ph: ["Exemple : une grande tendresse, et une boule dans la gorge", "Exemple : de la tristesse pour ma grand-mère, et l’envie de lui donner un prénom", "Exemple : de la curiosité, et un peu de colère", "Exemple : rien de précis, juste une gêne, comme s’il ne fallait pas"] }
          ],
          apres: { k: 'ex1-commun', q: "Relis ta liste. Qu’est-ce que ces personnes ont en commun, même un détail : un âge, une époque, un départ, un silence ?", ph: "Exemple : ce sont surtout des hommes partis jeunes, et dont personne n’a jamais raconté l’histoire." } },
        { k: 'voir-journal', titre: 'Mon journal des ancêtres', type: 'texte',
          consigne: "Cette semaine, remarque chaque fois que tu penses à un·e ancêtre, que tu croises son prénom, que quelqu’un en parle, ou qu’un rêve te le rappelle. Note-le le jour même, en quelques mots. Vise au moins trois moments.",
          pourquoi: "Quand on ouvre la porte aux ancêtres, ils se manifestent souvent dans le quotidien : un objet, une expression, une chanson. Les noter permet de voir ce qui cherche à remonter.",
          q: "Ce que tu remarques, en général, quand tu penses à tes ancêtres",
          ph: "Exemple : je pense souvent à mon grand-père quand je bricole, et je l’entends dire « on ne lâche pas ».",
          journal: { k: 'voir-sit', n: 6, q: "Chaque moment : le jour, la personne, ce qui te l’a rappelée, ce que tu as ressenti", ph: "Exemple : mardi, ma mère a dit « comme ton oncle Paul », j’ai senti de la curiosité." } }
      ],
      conseil: "Tu n’as pas besoin de tout savoir. Un prénom, une date, une phrase suffisent. Si la liste te rend triste, pose ton stylo, respire, et reviens-y demain. Elle peut se remplir au fil du mois." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'Ce qui n’a pas été dit',
      intro: "Cette semaine, tu remontes le fil des silences. Qui manque, qui a été effacé, quelles dates reviennent ? Tu poses des questions, à ton arbre et à ta famille, avec douceur.",
      texte: [
        "Ce que l'on tait dans une famille touche presque toujours l'un de deux besoins. Le **cycle de la racine** parle de sécurité : avoir sa place, un toit, de quoi vivre, le droit d'exister. Une famille qui a connu la guerre, l'exil, la faim ou la perte d'une maison transmet souvent une vigilance, une peur de manquer, une difficulté à se poser. Le **cycle du cœur** parle de lien : les amours perdues, les enfants partis trop tôt, les ruptures et les fâcheries. Il transmet souvent la peur d'aimer pleinement, ou celle d'être quitté·e.",
        "Les oubliés de l'arbre appartiennent souvent à l'un de ces deux cycles. Un enfant mort jeune touche le cœur de toute une famille. Un ancêtre qui a tout perdu touche la racine. Regarder de quel côté penche ton histoire t'aide à comprendre ce que tu portes, sans que ce soit à toi."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ton arbre, regarde', type: 'questions',
          consigne: "Prends ces questions une par une, avec ta liste des oubliés à côté de toi. Si une réponse ne vient pas, passe à la suivante. Elle viendra peut-être dans la semaine, au détour d’une conversation.",
          pourquoi: "Les dates, les prénoms et les silences sont les traces les plus fiables d’une histoire non dite. Les relever, c’est commencer à voir ce que ta famille a porté, et ce qui en est arrivé jusqu’à toi.",
          choix: { k: 'cycle', q: "Aujourd'hui, ce que ta lignée a laissé en suspens touche surtout…", options: ['La racine : la sécurité, la place, le manque', 'Le cœur : les liens perdus, les amours, les départs', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-jeune', q: "Qui est mort jeune dans ta famille, et comment en parle-t-on ?", ph: "Exemple : mon grand-oncle Marcel, mort à 20 ans. On dit juste « le pauvre Marcel » et on change de sujet." },
            { k: 'source-absent', q: "Qui n’apparaît presque jamais dans les récits, les photos, les conversations ?", ph: "Exemple : le premier mari de mon arrière-grand-mère. Il n’y a aucune photo de lui dans l’album." },
            { k: 'source-prenoms', q: "Quels prénoms ont été redonnés après un décès ?", ph: "Exemple : mon père s’appelle Pierre, comme son frère aîné mort à deux ans avant sa naissance." },
            { k: 'source-dates', q: "Quelles dates de décès tombent près de ton anniversaire, ou de celui de tes enfants ?", ph: "Exemple : ma grand-mère est partie le 3 mars, et ma fille est née le 5 mars, trente ans plus tard." },
            { k: 'source-silence', q: "À quels moments ta famille se tait-elle, ou change-t-elle de sujet ?", ph: "Exemple : dès qu’on parle de la ferme vendue en 1962, mon grand-père sort fumer." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur une personne disparue ou oubliée. Par téléphone, à table, ou par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma tante : « Tu te souviens de ton oncle Marcel ? Il était comment ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris, et qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a dit qu’il chantait tout le temps et qu’il voulait être instituteur. J’ai eu l’impression qu’il redevenait quelqu’un.", lignes: 3 }
          ] }
      ],
      conseil: "Ajoute dans [ton arbre familial](genosociogramme.html) les personnes oubliées que tu retrouves, même avec très peu d’informations. Si tu connais leurs dates, ta page « Ton mois » te les rappellera chaque année. Si une question réveille une peine chez la personne que tu interroges, n’insiste pas : remercie-la, et laisse la porte ouverte." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre avec respect',
      intro: "Cette semaine, tu fais le tri entre ce que tu gardes et ce que tu rends. Tu reconnais les forces que ta lignée t’a transmises, tu écris à un·e ancêtre, et tu allumes une bougie pour redonner à chacun·e sa place.",
      exercices: [
        { k: 'ex2', titre: 'Ce que j’ai reçu', type: 'blocs', nb: 3,
          etiquettes: ['Un·e premier·e ancêtre', 'Un·e deuxième ancêtre', 'Un·e troisième ancêtre'],
          consigne: "Choisis trois ancêtres, connus ou non : un grand-parent, une arrière-grand-mère dont tu as entendu parler, un aïeul dont tu ne sais presque rien. Pour chacun·e, écris une force que tu reconnais en toi et qui pourrait venir de cette personne, puis comment tu la vis aujourd’hui. Il ne s’agit pas d’avoir raison : il s’agit de te relier.",
          pourquoi: "Avant de rendre ce qui pèse, on reçoit ce qui porte. Reconnaître les forces de ta lignée te permet de rendre le reste sans rejeter personne : tu gardes l’amour et le courage, tu laisses la douleur.",
          astuce: "Si tu ne sais rien d’une personne, pars de ce qu’elle a forcément traversé : une époque, un métier, un exil. Quelle force lui a-t-il fallu ?",
          champs: [
            { q: "Quel·le ancêtre choisis-tu ?", ph: ["Exemple : ma grand-mère Jeanne", "Exemple : mon arrière-grand-père, mineur dans le Nord", "Exemple : l’aïeule italienne dont je porte le nom"] },
            { q: "Quelle force, quelle qualité ou quel talent reconnais-tu en toi, qui pourrait venir d’elle ou de lui ?", ph: ["Exemple : sa façon de tenir bon sans se plaindre", "Exemple : l’endurance et la solidarité", "Exemple : le courage de partir et de tout recommencer"] },
            { q: "Comment vis-tu cette force aujourd’hui, et comment veux-tu la vivre ?", ph: ["Exemple : je tiens bon, mais seul·e. Je veux tenir bon en acceptant l’aide.", "Exemple : je suis endurant·e au travail. Je veux l’être aussi pour mes projets à moi.", "Exemple : j’ai déménagé quatre fois. Je veux partir par choix, pas par fuite."] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à un·e ancêtre', type: 'questions',
          consigne: "Choisis une personne de ta lignée qui te touche particulièrement. Écris-lui une lettre que tu n’enverras pas. Commence par « Je suis… » (ta petite-fille, ton arrière-petit-fils, ta descendante…). Dis-lui ce que tu sais d’elle, ce que tu aurais aimé lui demander, ce que tu veux lui dire aujourd’hui. Termine par ce que tu choisis de garder de ce qu’elle t’a transmis, et ce que tu lui rends.",
          pourquoi: "Écrire à un·e ancêtre, c’est lui redonner une place de personne, avec une histoire et des émotions. On ne se libère pas d’une loyauté en la rejetant, mais en la reconnaissant : remercier, puis rendre, permet de garder le lien et de laisser le poids.",
          questions: [
            { k: 'lettre-a', q: "À qui écris-tu ?", ph: "Exemple : à mon grand-oncle Marcel", court: true },
            { k: 'lettre-texte', q: "Ta lettre : qui tu es pour elle ou lui, ce que tu sais, ce que tu aurais aimé demander, ce que tu gardes, ce que tu rends", ph: "Exemple : Je suis Claire, la petite-fille de ta sœur Germaine. On ne parlait pas de toi, mais je sais que tu chantais et que tu voulais enseigner. J’aurais aimé te demander si tu avais peur. Je garde ta joie de chanter. Je te rends la peur de partir trop tôt, qui n’est pas la mienne. Tu as ta place dans notre famille.", lignes: 8 }
          ] }
      ],
      rituel: {
        titre: 'La bougie des ancêtres',
        intro: "Ce rituel symbolique marque le moment où tu rends à chacun·e sa place. Fais-le une fois ce mois-ci, idéalement après avoir rempli ta liste des oubliés. Prends ton temps : il dure environ quinze minutes.",
        materiel: "Une bougie, ta liste des oubliés, un stylo. Si tu en as, des photos de tes ancêtres.",
        etapes: [
          "Choisis un moment calme, le soir de préférence. Pose devant toi les photos, ou simplement ta liste de noms.",
          "Allume la bougie et dis, à voix haute ou intérieurement : « J'allume cette lumière pour celles et ceux qui sont venus avant moi. »",
          "Nomme chaque personne, une par une, y compris les oubliés de ta liste. Après chaque nom, dis : « Tu as ta place dans notre famille. »",
          "Puis dis : « Je reçois avec gratitude la vie et les forces que vous m'avez transmises. Ce qui vous appartient, je vous le laisse avec respect. »",
          "Reste quelques minutes devant la flamme, sans rien faire. Laisse venir les images, les souvenirs, les émotions. Si c’est trop fort, pose les mains sur ton ventre et respire lentement.",
          "Éteins la bougie (ne la laisse jamais sans surveillance) et note ce qui est venu, ci-dessous."
        ],
        note: { k: 'rituel-note', q: "Comment s’est passé ton rituel : avant, pendant et après ? Quels noms sont venus ?", ph: "Exemple : j’étais intimidé·e avant. En disant « tu as ta place » pour Marcel, j’ai pleuré un peu. Après, je me suis senti·e calme, comme si la maison respirait." }
      },
      conseil: "Si la lettre ou le rituel réveille une émotion forte, fais une pause, bois un verre d’eau, sors marcher. Tu peux finir un autre jour, ou faire le rituel en deux fois. Ce qui compte, c’est d’avoir commencé." },

    { cle: 'remplacer', nom: 'Recevoir', etape: 'Remplacer', titre: 'Porter la force, pas le poids',
      intro: "Tu as nommé les oubliés, remonté les silences, rendu ce qui ne t’appartenait pas. Cette semaine, tu remplaces l’ancien poids par une force reçue : tu choisis un cadeau de ta lignée, et tu le fais vivre, exprès, chaque jour.",
      texte: [
        "**La première pause.** Quand une vieille peur familiale se présente (peur de manquer, peur de partir, peur d’être quitté·e), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Tu appartiens à leur histoire. Moi, je choisis la force qu’ils m’ont donnée. »",
        "**Le geste qui honore.** Faire vivre une force reçue, c’est la plus belle façon d’honorer un·e ancêtre. Pas besoin de grands gestes : une recette refaite, un courage osé, un prénom prononcé à table. La force circule de nouveau, et le poids n’a plus besoin d’être porté."
      ],
      exercices: [
        { k: 'ex3', titre: 'La force que je fais vivre', type: 'texte',
          consigne: "Choisis une force reçue de ta lignée, et utilise-la consciemment cette semaine. Écris ton engagement, puis note chaque fois que tu l’as fait, même maladroitement, et ce que tu as ressenti. Cette force devient aussi un appui dans ton carnet « J’avance ».",
          pourquoi: "Ce que l’on reçoit consciemment se transforme : ce n’est plus une loyauté invisible, c’est un choix. Chaque fois que tu fais vivre une force de ta lignée, tu montes d’un cran sur la spirale.",
          gestes: ["Cuisiner une recette de famille et raconter son histoire", "Oser une chose courageuse, comme cet·te ancêtre l’aurait fait", "Prononcer le prénom d’un·e oublié·e à table", "Reprendre un savoir-faire transmis : coudre, jardiner, bricoler", "Accepter une aide, là où l’ancêtre portait seul·e", "Rire de bon cœur, comme ton grand-père savait le faire"],
          q: "Ton geste : « Cette semaine, pour faire vivre la force de…, je vais… »",
          ph: "Exemple : pour faire vivre le courage de ma grand-mère Jeanne, je vais oser demander une augmentation, en pensant à elle avant d’entrer.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as fait vivre cette force : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : jeudi, j’ai fait la soupe de mamie et j’ai raconté son histoire à mon fils. Je me suis senti·e relié·e." } }
      ],
      conseil: "Si une vieille peur revient malgré tout, ce n’est pas un recul : remarque-la, remercie-la, et rappelle-toi la force que tu as choisie. La prochaine fois, tu la reconnaîtras un peu plus tôt." }
  ],

  meditation: {
    titre: 'Le chemin des ancêtres',
    intro: "Une séance guidée pour sentir derrière toi la longue file de celles et ceux qui sont venus avant toi, recevoir ce qu’ils t’ont donné, et déposer ce qui ne t’appartient pas.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois… Laisse ton corps se poser.",
      "[pause]",
      "Imagine que tu marches sur un chemin, dans la lumière douce d'une fin d'après-midi de novembre. Le sol est ferme sous tes pieds. L'air est calme, un peu frais. Derrière toi, tu sens une présence bienveillante.",
      "Tu te retournes. Derrière toi se tiennent tes parents. Derrière eux, tes quatre grands-parents. Derrière eux encore, tes huit arrière-grands-parents… et plus loin, une longue file de silhouettes qui se perd dans la lumière. Des centaines de personnes, dont tu es le prolongement.",
      "[pause]",
      "Tu n'as pas besoin de connaître leurs visages. Sens simplement qu'ils sont là. Chacun·e a vécu des joies, des peines, des épreuves. Chacun·e a transmis la vie, jusqu'à toi. Parmi eux, il y a aussi les oubliés : ceux dont on ne parlait pas. Ils sont là, eux aussi, à leur place.",
      "Peut-être que l'une de ces silhouettes s'avance un peu. Laisse-la venir. Tu n'as rien à faire, seulement l'accueillir. Peut-être qu'elle te tend quelque chose : un objet, une couleur, un mot. Reçois-le.",
      "[longue pause]",
      "Et si tu portes un poids qui ne t'appartient pas, tu peux le déposer doucement à ses pieds, en disant intérieurement : « Je te rends ceci avec respect. Je garde la vie que tu m'as donnée. »",
      "Sens que la file entière te regarde avec bienveillance. Ils sont derrière toi. Ils te soutiennent. Tu peux avancer.",
      "[pause]",
      "Retourne-toi vers le chemin devant toi. Il est ouvert. Fais quelques pas, plus léger·e, avec dans les mains ce que tu as reçu.",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir tranquille, où personne ne te dérangera pendant dix minutes. Si une personne disparue te touche trop fort pendant la séance, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une silhouette, un objet reçu, un mot, une sensation…", ph: "Exemple : une femme en tablier s’est avancée et m’a tendu une clé. J’ai senti mes épaules se relâcher en déposant mon sac." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-retiens', q: "Que retiens-tu de ce mois passé avec tes ancêtres ?", ph: "Exemple : que je ne suis pas seul·e, et que certaines tristesses de novembre ne venaient pas de moi." },
    { k: 'fin-nommes', q: "Qui as-tu nommé ce mois-ci, et qu’est-ce que ça a changé ?", ph: "Exemple : Marcel et le premier bébé de ma grand-mère. J’en ai parlé à ma mère, et elle m’a remercié·e." },
    { k: 'fin-rendu', q: "Qu’as-tu rendu à ta lignée, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : la peur de partir trop tôt. Je me sens plus libre de faire des projets à long terme." },
    { k: 'fin-recu', q: "Que gardes-tu, et reçois-tu avec gratitude ?", ph: "Exemple : le courage de ma grand-mère Jeanne, et la joie de chanter de Marcel." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en décembre ?", ph: "Exemple : continuer à faire une place aux absent·es, surtout pendant les fêtes.", court: true }
  ],

  carnet: {
    titre: 'Mes forces, mes appuis',
    texte: "Ce que tu reçois ici nourrit ce que tu construis là-bas. Dans ton carnet, tu reconnais tes forces et tu rassembles tes appuis : reporte la force de ta lignée que tu as choisie, elle devient un appui pour tout ton mois."
  },

  aVenir: [
    { mois: 'Décembre', titre: 'Les fêtes et les places à table', texte: "Observer qui s’assoit où, honorer les absent·es, et trouver ta juste place au cœur des fêtes.", image: 'assets/guide/guide-cadeau.webp' },
    { mois: 'Janvier', titre: 'Ton prénom, ton héritage', texte: "Découvrir l’histoire de ton prénom, ce qu’il porte de ta lignée, et en faire pleinement le tien.", image: 'assets/guide/guide-transmission.webp' },
    { mois: 'Février', titre: 'Le couple et les schémas amoureux', texte: "Voir ce qui se rejoue dans ta façon d’aimer, d’où ça vient, et choisir une relation vraie.", image: 'assets/cartes/une-relation-vraie-mini.jpg' }
  ]
};
