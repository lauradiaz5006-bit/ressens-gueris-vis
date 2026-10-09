/* Genesolia · Le Cercle · Mon suivi « Je me libère » de mai 2027 : « Ta mère, tes mères »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-05',
  cle: 'suivi-2027-05',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-05-7398c67b52.pdf',
  nomMois: 'mai 2027',
  moisSuivant: 'juin',
  titre: 'Ta mère, tes mères',
  sousTitre: "Regarder la lignée des femmes qui t'ont précédé·e, reconnaître ce que tu as reçu, et choisir ce que tu transmets.",
  citation: "On peut honorer la vie reçue sans tout reprendre du chemin.",
  audio: '',
  audioCourt: '',
  saisonLien: "Mai est le mois de la croissance joyeuse : tout pousse, tout fleurit, la vie se transmet de la graine à la fleur. C'est le bon moment pour regarder d'où te vient ta propre vie, du côté des femmes de ta lignée. Pas pour tout reprendre de leur chemin, mais pour choisir, comme un·e jardinier·e, ce que tu veux faire pousser à ton tour.",
  intensiteQ: "À quel point ce que tu as reçu de ta mère, ou ce qui t’a manqué d’elle, pèse-t-il dans ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette habitude de m’effacer pour que tout le monde aille bien, comme ma mère et ma grand-mère avant elle.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-transmission.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-coffret.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ma-mere-mini.jpg', 'Je peux ressembler à ma mère, et faire autrement.']
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Quelle que soit ton histoire avec ta mère, elle a sa place ici, sans avoir à être belle ou simple.",
    theme: "Lis cette page doucement. Si elle réveille un manque ou une tristesse, c’est normal : pose ta main sur ton cœur et prends ton temps.",
    voir: "Cette semaine, tu observes ce qui te vient des femmes de ta famille, sans juger ni elles ni toi.",
    source: "Écris ce que tu sais, même si c’est peu. Un prénom, une date, une phrase suffisent pour commencer à remonter le fil.",
    liberer: "Rendre n’est pas rejeter. Tu peux remercier pour la vie reçue et laisser, avec respect, ce qui ne t’appartient pas.",
    remplacer: "Ce que tu choisis de transmettre commence par un geste envers toi. C’est souvent là que la lignée change.",
    meditation: "Reste à la distance qui te convient. Si c’est trop, ouvre les yeux et reviens à ton souffle : tu peux reprendre un autre jour.",
    bilan: "Regarde le chemin parcouru avec tendresse. Tu as osé regarder une des histoires les plus intimes qui soient."
  },

  theme: {
    titre: 'Le mois des mères',
    texte: [
      "Mai est le mois de la fête des mères. Pour certain·es, c'est un jour simple et joyeux, avec des fleurs et un coup de fil. Pour d'autres, il réveille un manque, une distance, une relation compliquée, ou l'absence d'une mère partie trop tôt ou jamais connue. Toutes ces réalités ont leur place ici, sans hiérarchie.",
      "Nous sommes au cœur du deuxième temps de l'année du Cercle, **Traverser** : après avoir appris à voir ce qui revient, tu traverses maintenant les grandes relations qui t'ont façonné·e. Ce mois-ci, tu regardes ta mère, ta grand-mère, et toutes les femmes qui ont compté pour toi comme des figures maternelles. Sans les idéaliser, sans les juger non plus : pour voir ce que tu as reçu, et ce que tu choisis de laisser."
    ],
    sousTitre: 'Pourquoi regarder la lignée des femmes ?',
    texte2: [
      "En psychogénéalogie, on observe que les femmes d'une famille se transmettent bien plus que des recettes : une façon d'aimer, de se taire, de travailler, de se sacrifier ou de se battre. Ces héritages passent souvent de mère en fille, et de mère en fils, sans être nommés. Une arrière-grand-mère qui a tenu seule la ferme pendant une guerre peut laisser une force immense, et aussi l'idée qu'il ne faut jamais demander d'aide.",
      "Ta mère est elle-même la fille d'une mère, qui était la fille d'une autre. Chacune a fait avec ce qu'elle avait reçu, et avec son époque : moins de choix, moins de mots, parfois moins de tendresse disponible. Et une mère n'est pas toujours celle qui a donné naissance : une grand-mère qui t'a élevé·e, une tante, une belle-mère, une voisine ou une enseignante ont parfois tenu ce rôle. Ces liens comptent, même s'ils ne figurent pas sur l'arbre.",
      "Si ta mère a été absente, distante ou difficile, tu n'as rien à forcer, ni pardon ni rapprochement. Tu peux reconnaître la vie qu'elle t'a donnée, et tourner aussi ton regard vers celles qui t'ont entouré·e. Ce mois-ci, tu vas **voir** ce qui te vient des femmes de ta lignée, **remonter** à leur histoire, **rendre** ce qui ne t'appartient pas, et **choisir** ce que tu transmets. Pour aller plus loin : [la méthode des deux cycles](methode.html)."
    ],
    exemplesTitre: 'Ce que l’on reçoit des mères, au quotidien',
    exemples: [
      "**Dans tes gestes** : tu plies le linge exactement comme ta mère, tu soupires comme elle devant l'évier, et tu t'en rends compte en l'entendant sortir de ta propre bouche.",
      "**Dans ta façon d'aimer** : chez vous, on montrait l'amour en faisant à manger, jamais en le disant. Aujourd'hui, tu cuisines pour tout le monde, et tu as du mal à dire « je t'aime ».",
      "**Dans ce que tu t'autorises** : ta grand-mère n'a jamais pris de vacances, ta mère culpabilisait de s'asseoir. Toi, tu te sens coupable dès que tu te reposes.",
      "**Dans tes peurs** : « Méfie-toi des hommes », « Ne compte que sur toi », « Il faut être forte ». Des phrases entendues enfant qui décident encore de certains de tes choix.",
      "**Dans tes forces** : le courage de tout recommencer, l'humour dans les moments durs, l'art de recevoir. Ce sont aussi des cadeaux de ta lignée."
    ],
    exempleSpirale: "Ta mère s'effaçait toujours pour que tout le monde aille bien, comme sa mère avant elle. Pendant des années, tu as fait pareil, au travail comme en famille. Ce mois-ci, au repas d'anniversaire de ta sœur, tu sens le vieux réflexe : te lever, servir, débarrasser, ne jamais t'asseoir. Tu respires, et tu restes assis·e jusqu'au dessert. Tu reconnais le geste de tes mères, tu les remercies intérieurement, et tu choisis autre chose. Le thème est le même, ta place a changé.",
    question: { k: 'theme-meres', q: "En une phrase, qu’est-ce que tu as reçu des femmes de ta lignée que tu retrouves aujourd’hui dans ta vie ?", ph: "Exemple : la force de tout tenir seule, et la difficulté à demander de l’aide, comme ma mère et ma grand-mère." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les femmes de ta lignée',
      intro: "Cette semaine, tu poses sur la table ce que tu sais des femmes de ta famille. Tu ne cherches pas encore à comprendre ni à changer : tu regardes ce qu’elles ont vécu, et ce qui, d’elles, vit encore en toi.",
      texte: "Commence par l’exercice de la lignée, au calme, une vingtaine de minutes. Si tu sais peu de choses, écris ce que tu sais, même une seule phrase. Puis, dans la semaine, note chaque fois qu’un geste, une phrase ou une réaction de ta mère ou de ta grand-mère te revient.",
      exercices: [
        { k: 'ex1', titre: 'La lignée des femmes', type: 'tableau', rangs: 4,
          etiquettes: ['Ma mère, ou celle qui a tenu ce rôle', 'Ma grand-mère maternelle', 'Ma grand-mère paternelle', 'Une autre femme de la lignée'],
          consigne: "Remonte la lignée des femmes de ta famille, côté mère et côté père. Pour chacune, note en quelques mots ce qu'elle a vécu, ce qu'elle t'a transmis en force, et ce qu'elle t'a transmis en poids. Si tu n'as pas connu ta mère, écris ce que tu sais d'elle, ou ce que tu imagines, ou choisis la femme qui t'a élevé·e.",
          pourquoi: "Quand on écrit les vies de ces femmes les unes sous les autres, des fils apparaissent : un même renoncement, un même courage, un même silence. On comprend alors que certaines façons de faire ne sont pas des défauts personnels, mais des héritages.",
          colonnes: [
            { q: "Que sais-tu de ce qu’elle a vécu ?", ph: ["Exemple : elle s’est mariée à 20 ans, a eu trois enfants, a travaillé à l’usine puis à la mairie", "Exemple : elle a perdu son mari jeune et a élevé seule ses quatre enfants à la ferme", "Exemple : je sais seulement qu’elle était couturière et qu’elle chantait beaucoup", "Exemple : ma tante Simone, partie vivre à Paris à 18 ans contre l’avis de tous"] },
            { q: "Qu’a-t-elle transmis en force ?", ph: ["Exemple : le sens de l’organisation, la générosité, l’humour", "Exemple : le courage, la capacité à ne jamais baisser les bras", "Exemple : l’amour de la musique et des belles choses", "Exemple : l’audace de choisir sa vie"] },
            { q: "Qu’a-t-elle transmis en poids ?", ph: ["Exemple : l’idée qu’une bonne mère s’oublie pour les autres", "Exemple : la peur de manquer, et l’interdiction de se plaindre", "Exemple : le silence sur ses tristesses", "Exemple : la sensation qu’on paie toujours sa liberté par la solitude"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis tes lignes. Qu’est-ce qui passe de femme en femme, en force comme en poids, et que tu reconnais en toi ?", ph: "Exemple : toutes ont tenu la maison sans jamais demander d’aide. J’ai leur courage, et aussi leur difficulté à me reposer." } },
        { k: 'voir-journal', titre: 'Mes mères en moi', type: 'texte',
          consigne: "Cette semaine, chaque fois qu’un geste, une phrase ou une réaction te rappelle ta mère, ta grand-mère ou une autre figure maternelle, note-le le jour même. Remarque aussi ce que tu ressens à ce moment-là : de la tendresse, de l’agacement, de la surprise. Vise au moins trois moments.",
          pourquoi: "On ressemble souvent à ses mères dans les petites choses du quotidien, sans y prêter attention. Les remarquer, c’est commencer à choisir : ce que tu gardes avec joie, et ce que tu aimerais faire autrement.",
          q: "Ce que tu remarques, en général, de tes mères en toi",
          ph: "Exemple : j’ai sa façon de m’excuser tout le temps, et aussi son rire quand quelque chose tourne mal.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque moment : le jour, ce que tu as fait ou dit, de qui ça te vient, ce que tu as ressenti", ph: "Exemple : lundi, j’ai dit « on ne gaspille pas » en grattant le plat. C’est ma grand-mère. J’ai souri." } }
      ],
      conseil: "Si tu n’as pas connu ta mère, ou si penser à elle est douloureux, tu peux commencer par une autre femme qui a compté pour toi. Et si une émotion forte monte, fais une pause, respire, sors marcher : tu reprendras quand tu voudras." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'L’histoire de tes mères',
      intro: "Chaque mère a d’abord été une enfant. Cette semaine, tu remontes le fil de leurs histoires, avec douceur, pour comprendre ce qu’elles ont reçu à leur tour, et ce que leur époque leur a permis ou interdit.",
      texte: [
        "Dans la méthode des deux cycles, la mère touche aux deux à la fois. Le **cycle de la racine** parle de sécurité : être nourri·e, accueilli·e, avoir un toit, sentir que l'on a le droit d'exister et d'avoir des besoins. Le **cycle du cœur** parle d'amour : être regardé·e, consolé·e, aimé·e pour ce que l'on est, et non pour ce que l'on fait.",
        "Une mère inquiète, débordée ou qui a elle-même manqué transmet souvent une racine fragile : la peur de manquer, le besoin de tout contrôler, la difficulté à se poser. Une mère qui n'a pas reçu de tendresse a parfois du mal à en donner, et l'enfant apprend à mériter l'amour en étant sage, utile, parfait·e. On commence en général par la racine : quand on se sent en sécurité, on peut aimer et se laisser aimer plus librement."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ta lignée, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, au détour d’une photo ou d’une conversation.",
          pourquoi: "Souvent, on découvre que ce qui nous a manqué de notre mère lui avait déjà manqué à elle. Le voir ne fait pas disparaître le manque, mais il change le regard : on passe du reproche à la compréhension, et on peut enfin choisir pour soi.",
          choix: { k: 'cycle', q: "Aujourd'hui, ce que tu as reçu de ta mère touche surtout…", options: ['La racine : ma sécurité, mon droit d’exister', 'Le cœur : ma façon d’aimer et d’être aimé·e', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'regarder-enfance', q: "Que sais-tu de l’enfance de ta mère, et de celle de ta grand-mère ?", ph: "Exemple : ma mère était l’aînée de six enfants, elle a quitté l’école à 14 ans pour aider à la maison." },
            { k: 'regarder-phrases', q: "Quelles phrases ou habitudes passent de femme en femme dans ta famille ?", ph: "Exemple : « Une femme doit savoir se débrouiller seule. » Ma grand-mère le disait, ma mère aussi, et je me surprends à le penser." },
            { k: 'regarder-autres', q: "Quelles autres femmes ont été pour toi des figures maternelles, et qu’ont-elles apporté ?", ph: "Exemple : ma marraine, qui m’emmenait au musée le mercredi et me disait que j’étais capable de tout." },
            { k: 'regarder-epoque', q: "Qu’est-ce que l’époque de ta mère, ou de ta grand-mère, ne leur permettait pas de vivre ?", ph: "Exemple : ma grand-mère n’a pas pu avoir de compte en banque à elle avant ses 40 ans, ni choisir son métier." }
          ] },
        { k: 'source-question', titre: 'Une question sur une femme de ta lignée', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur une femme de ta lignée : ta mère jeune, une grand-mère, une arrière-grand-mère. Par téléphone, à table, ou par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html). Si personne ne peut te répondre, regarde une photo d’elle et note ce que tu y vois.",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à mon oncle : « Comment était maman quand elle avait mon âge ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : il m’a dit qu’elle rêvait d’être institutrice et qu’elle a renoncé pour s’occuper de sa mère. J’ai compris sa tristesse les dimanches soir.", lignes: 3 }
          ] }
      ],
      conseil: "Complète la lignée des femmes dans [ton arbre familial](genosociogramme.html) : mères, grands-mères, arrière-grands-mères, avec leurs dates. L’outil repère les répétitions d’âges et de prénoms, et ta page « Ton mois » te rappellera leurs anniversaires." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Recevoir la vie, rendre le poids',
      intro: "Cette semaine, tu fais le tri, avec respect. Ce que tu as reçu de tes mères en force, tu le gardes. Ce qui pèse, tu le rends symboliquement, sans rien renier de l’amour. Et tu écris à ta mère, ou à celle qui l’a été pour toi.",
      exercices: [
        { k: 'ex2', titre: 'Mes mères', type: 'blocs', nb: 3,
          etiquettes: ['Une première figure maternelle', 'Une deuxième', 'Une troisième'],
          consigne: "Choisis trois femmes qui ont joué pour toi un rôle maternel : ta mère, ou une autre si c'est plus juste pour toi, une grand-mère, une tante, une amie plus âgée. Pour chacune, écris ce qu'elle t'a donné, même petit. Puis note ce que tu gardes avec gratitude, et ce que tu choisis de laisser avec respect.",
          pourquoi: "On croit souvent devoir tout prendre ou tout rejeter d’une mère. Faire le tri, figure par figure, permet de garder l’amour et la force, et de déposer ce qui t’empêche d’avancer, sans culpabilité.",
          astuce: "Si une figure maternelle t’a fait du mal, tu as le droit de ne rien garder d’elle, sinon la vie reçue. C’est déjà beaucoup, et c’est suffisant.",
          champs: [
            { q: "Qui est-elle pour toi ?", ph: ["Exemple : ma mère, Françoise", "Exemple : ma grand-mère Odette, qui m’a gardé·e tous les étés", "Exemple : madame Leroy, ma professeure de français en quatrième"] },
            { q: "Que t’a-t-elle donné, même de petit ?", ph: ["Exemple : le goût des livres, sa ténacité, ses gâteaux du dimanche", "Exemple : la sensation d’être attendu·e, ses histoires du soir", "Exemple : la confiance en ma façon d’écrire"] },
            { q: "Que gardes-tu avec gratitude, et que laisses-tu avec respect ?", ph: ["Exemple : je garde sa ténacité, je laisse sa peur de déranger", "Exemple : je garde sa tendresse, je laisse son inquiétude permanente", "Exemple : je garde sa confiance en moi, je n’ai rien à laisser"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à ma mère', type: 'questions',
          consigne: "Écris à ta mère, ou à une figure maternelle si c'est plus juste pour toi. Dis ce que tu as reçu, ce qui t'a manqué peut-être, et ce que tu veux lui dire aujourd'hui. Tu peux aussi écrire à ta grand-mère. Cette lettre n'est pas faite pour être envoyée : elle est pour toi. Si la relation est douloureuse, écris seulement ce qui te semble juste aujourd'hui, même trois lignes.",
          pourquoi: "On porte souvent pendant des années des mots jamais dits, de gratitude comme de colère. Les écrire leur donne une place hors de toi. Remercier pour la vie, puis rendre ce qui pèse, permet de rester relié·e sans rester attaché·e.",
          questions: [
            { k: 'lettre-a', q: "À qui écris-tu ?", ph: "Exemple : à maman, ou à toi, mamie Rose, qui as été comme une mère pour moi", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu as reçu, ce qui t’a manqué, ce que tu rends, ce que tu choisis pour toi", ph: "Exemple : Maman, tu m’as donné la vie, ton courage et ton amour des fleurs. Il m’a manqué tes mots doux, je sais aujourd’hui que toi non plus, tu ne les avais pas reçus. Je te rends l’idée qu’il faut s’oublier pour être une bonne mère. Moi, je choisis de m’accorder aussi de la douceur.", lignes: 8 }
          ] }
      ],
      rituel: {
        titre: 'Le fil des mères',
        intro: "Ce rituel symbolique relie les femmes de ta lignée et te laisse libre de ta propre place. Fais-le une fois dans la semaine, après le tableau de la lignée ou après ta lettre. Il dure une quinzaine de minutes. Tu peux y inclure toutes les femmes qui ont compté pour toi, même hors de la famille.",
        materiel: "Un fil de laine ou un ruban d’environ un mètre, des ciseaux, et un endroit calme.",
        etapes: [
          "Choisis un moment tranquille. Pose le fil devant toi, bien droit, et respire trois fois.",
          "Fais un nœud pour chaque femme de ta lignée, en la nommant : ta mère, tes grands-mères, et plus loin si tu le peux. Si tu ne connais pas un prénom, dis simplement « toi, la mère de ma mère ».",
          "Ajoute un nœud pour chacune des autres figures maternelles qui ont compté pour toi.",
          "Tiens le fil dans tes mains et dis, à voix haute ou intérieurement : « Je reçois la vie que vous m'avez transmise. Je garde le meilleur, et je vous laisse le reste avec respect. »",
          "Laisse un bout de fil libre après le dernier nœud : c'est ta place, et ce que tu transmettras à ta façon. Si tu le souhaites, coupe ce bout et garde-le à part, comme un fil rien qu'à toi.",
          "Range le fil dans un endroit choisi : une boîte, un livre, un tiroir. Puis note ici ce qui est venu."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : les noms que tu as dits, ce que tu as ressenti, ce que tu as fait du fil.", ph: "Exemple : j’ai fait sept nœuds, dont un pour ma voisine Mireille. En coupant mon bout de fil, j’ai senti que j’avais le droit d’être différente d’elles." }
      },
      conseil: "Si la lettre ou le rituel réveillent une émotion forte, fais une pause, bois un verre d’eau, sors marcher ou appelle une personne de confiance. Tu peux finir un autre jour. Et si ta mère t’a fait du mal, tu n’as rien à pardonner ce mois-ci : regarder, c’est déjà beaucoup." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Ce que tu choisis de transmettre',
      intro: "Tu as regardé la lignée de tes mères, compris un peu de leur histoire, et rendu ce qui pesait. Cette semaine, tu choisis ce que tu fais passer à ton tour : à tes enfants si tu en as, à ton entourage, et d’abord à toi-même.",
      texte: [
        "**La première pause.** Quand tu sens monter un geste ou une phrase hérités que tu ne veux plus, respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois de suite. Puis dis-toi intérieurement : « Je te reconnais, tu viens de mes mères. Aujourd’hui, je choisis autrement. »",
        "**Le geste que tu transmets.** Que tu sois mère, père, que tu aies choisi de ne pas avoir d'enfant, ou que tu ne le saches pas encore, tu transmets tous les jours : par ta façon de te traiter, de parler aux autres, de vivre ta place. Changer un seul geste envers toi, c'est déjà changer ce que la lignée fait passer."
      ],
      exercices: [
        { k: 'ex3', titre: 'Le geste que je transmets', type: 'texte',
          consigne: "Choisis un geste nouveau, à la place d'un geste hérité qui pèse. Écris-le, puis note chaque fois que tu l'as essayé, même maladroitement, et ce qui a changé. Ce geste rejoint ton carnet « J’avance » : il fait partie de ta façon de te materner.",
          pourquoi: "Une lignée change par petits gestes répétés. Chaque fois que tu fais autrement, tu ne trahis pas tes mères : tu continues leur histoire avec ce qu’elles n’ont pas pu s’offrir.",
          gestes: ["M’asseoir à table jusqu’à la fin du repas", "Dire « je t’aime » au lieu de seulement le montrer", "Demander de l’aide une fois par jour", "Me reposer sans m’en excuser", "Me féliciter à voix haute pour une chose réussie", "Raconter à un proche une histoire heureuse d’une femme de ma lignée"],
          q: "Ton geste : « Là où mes mères…, moi je choisis de… »",
          ph: "Exemple : là où mes mères se levaient toujours les premières pour servir, moi je choisis de rester assis·e et de laisser les autres participer.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as essayé, même maladroitement : quand, et qu’est-ce qui a changé ?", ph: "Exemple : dimanche, chez ma sœur, je suis resté·e assis·e. Mon neveu a débarrassé, et personne n’a rien dit. Je me suis senti·e invité·e, enfin." } }
      ],
      conseil: "Si le vieux geste revient malgré tout, ce n’est pas un échec : remarque-le après coup, souris, et dis-toi « la prochaine fois ». Et pense à remercier aussi tes mères pour ce que tu gardes d’elles : leur force voyage avec toi." }
  ],

  meditation: {
    titre: 'La file des femmes',
    intro: "Une séance guidée pour rencontrer la lignée des femmes qui t’ont précédé·e, à la distance qui te convient, recevoir la vie, et retrouver ton propre chemin.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois… Laisse ton corps se poser.",
      "[pause]",
      "Avant de commencer, sache que tu peux t’arrêter à tout moment. Si quelque chose est trop fort, ouvre les yeux, sens tes pieds sur le sol, et reviens à ton souffle. Tu es en sécurité, ici et maintenant.",
      "Imagine un champ au mois de mai. L'herbe est haute, les fleurs s'ouvrent, l'air est tiède. Tu entends des oiseaux au loin, des abeilles autour des fleurs, et le bruit léger du vent.",
      "Devant toi, à quelques pas, se tient ta mère, telle que tu la connais, ou telle que tu l'imagines si tu ne l'as pas connue. Derrière elle, sa mère. Derrière encore, une longue file de femmes qui se perd dans la lumière.",
      "[pause]",
      "Tu n'as pas besoin de t'approcher plus que tu ne le souhaites. Reste à la distance qui te convient, même si elle est grande. Remarque simplement que chacune a donné la vie à la suivante, jusqu'à toi.",
      "Regarde leurs mains. Des mains qui ont travaillé, bercé, cuisiné, cousu, écrit. Des mains qui ont fait de leur mieux, avec ce qu'elles avaient, à leur époque.",
      "À côté de la file, d'autres femmes se tiennent peut-être : une tante, une voisine, une amie, une enseignante. Celles qui t'ont entouré·e d'une autre façon. Accueille-les aussi, une par une, à ta façon.",
      "[longue pause]",
      "Si tu portes quelque chose de lourd venant de cette lignée, une peur, un renoncement, un silence, imagine que tu le poses doucement dans l'herbe, devant elles. Dis intérieurement : « Merci pour la vie. Je garde ce qui me fait grandir. Je vous laisse ce qui vous appartient. »",
      "Sens que tu peux te tourner vers ton propre chemin. Tu avances, avec elles derrière toi, et devant toi un espace libre, fleuri, qui n'appartient qu'à toi.",
      "[pause]",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes, plutôt en journée ou en début de soirée. Garde un verre d’eau à côté de toi. Si tu as perdu ta mère récemment, ou si votre relation est très douloureuse, commence par imaginer seulement les autres figures maternelles : la file peut attendre.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Un visage, des mains, un mot, une distance, une sensation…", ph: "Exemple : je suis resté·e loin de ma mère, mais j’ai vu ma grand-mère me sourire. J’ai posé dans l’herbe un gros sac gris, et j’ai respiré plus large." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-heritage', q: "Qu’as-tu découvert de la lignée des femmes de ta famille ce mois-ci ?", ph: "Exemple : toutes ont tenu seules, sans jamais demander d’aide. Ce n’était pas leur choix, c’était leur époque." },
    { k: 'fin-recu', q: "Que reçois-tu de tes mères avec gratitude ?", ph: "Exemple : le courage, l’humour dans les moments durs, l’art de recevoir les autres." },
    { k: 'fin-rendu', q: "Qu’as-tu laissé avec respect, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : l’idée qu’une femme doit s’oublier. Je me sens moins coupable de me reposer." },
    { k: 'fin-transmets', q: "Quel geste nouveau as-tu osé, et que choisis-tu de transmettre à ton tour ?", ph: "Exemple : je reste assis·e à table et je demande de l’aide. Je veux transmettre qu’on peut être forte et se reposer." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en juin, en regardant le côté de ton père ?", ph: "Exemple : continuer à me reposer sans culpabilité, et regarder avec douceur ce que j’ai reçu de mon père.", court: true }
  ],

  carnet: {
    titre: 'Prendre soin de moi',
    texte: "Ce que tu libères ici adoucit ce que tu construis là-bas. Pendant que ton suivi regarde ce que tu as reçu de tes mères, ton carnet t’aide à devenir pour toi-même une présence douce, à respecter ton rythme et à t’offrir des moments rien qu’à toi. Reporte ton geste nouveau dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Juin', titre: 'Du côté des pères', texte: "Regarder ton père, ton grand-père et la lignée des hommes, pour reconnaître ce que tu as reçu du côté paternel.", image: 'assets/cartes/deux-parents-mini.jpg' },
    { mois: 'Juillet', titre: 'L’argent et ta valeur', texte: "Écouter les phrases familiales sur l’argent, et choisir ce que tu t’autorises à recevoir.", image: 'assets/cartes/peurs-rendre-mini.jpg' },
    { mois: 'Août', titre: 'Racines, départs et lieux', texte: "Retrouver les lieux de ta famille, regarder les départs et les exils, et sentir où tu te sens chez toi.", image: 'assets/cartes/partir-mini.jpg' }
  ]
};
