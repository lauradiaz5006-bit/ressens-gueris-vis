/* Genesolia · Le Cercle · Mon suivi « Je me libère » de juillet 2027 : « L'argent et ta valeur »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-07',
  cle: 'suivi-2027-07',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-07-88553a1fb8.pdf',
  nomMois: 'juillet 2027',
  moisSuivant: 'août',
  titre: 'L’argent et ta valeur',
  sousTitre: "Écouter les phrases familiales sur l'argent, regarder ce que ta lignée a vécu, et choisir ce que tu t'autorises à recevoir.",
  citation: "Ta valeur ne se compte pas, mais elle mérite d'être reconnue.",
  audio: '',
  audioCourt: '',
  saisonLien: "Juillet, c'est le plein soleil où tout mûrit lentement. Les fruits gonflent, les blés se dorent, et la terre donne sans compter. C'est un beau moment pour regarder ton rapport à l'argent et à ta valeur : ce qui a mûri dans ta lignée, en peurs comme en richesses, et ce que tu t'autorises à récolter à ton tour. Et comme rien ne mûrit plus vite parce qu'on le surveille, tu as le droit de ralentir : ce suivi peut se vivre à l'ombre, sans te presser.",
  intensiteQ: "À quel point ton rapport à l’argent, et à ce que tu t’autorises à recevoir, pèse-t-il dans ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette peur de manquer qui revient chaque fin de mois, même quand mon compte va bien, comme chez ma grand-mère.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-coffret.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-cadeau.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/peurs-rendre-mini.jpg', 'Certaines peurs ne m’appartiennent pas. Je peux les rendre, avec douceur.']
    }
  },

  mots: {
    saison: "Respire avec le plein soleil. Ce mois-ci, tu regardes un sujet souvent tabou : avance à l’ombre, à ton rythme.",
    theme: "Lis cette page sans te juger sur ton compte en banque. On parle ici d’histoire et de valeur, pas de chiffres.",
    voir: "Cette semaine, tu écoutes. Les phrases sur l’argent sont partout : à table, dans ta tête, dans tes réflexes.",
    source: "Derrière chaque peur d’argent, il y a souvent une histoire. Écris ce que tu sais, même un fragment.",
    liberer: "Rendre une peur à ta lignée ne t’éloigne pas des tiens. Tu gardes leur courage et tu poses leur poids.",
    remplacer: "Une nouvelle phrase, un petit geste de permission. C’est ainsi que l’on commence à transmettre autre chose.",
    meditation: "Garde tes mains ouvertes, et si une émotion monte, reviens simplement à ton souffle. Tu peux reprendre un autre jour.",
    bilan: "Regarde ce que tu t’autorises aujourd’hui que tu ne t’autorisais pas au début du mois. C’est ça, la récolte."
  },

  theme: {
    titre: 'Le mois de l’argent',
    texte: [
      "L'argent est l'un des sujets les plus chargés dans une famille. On en parle trop, ou jamais. Il rassemble autour d'une maison achetée ensemble, il divise autour d'un héritage, il laisse des souvenirs de fierté, de gêne ou de honte. Souvent, les enfants comprennent très tôt ce qu'il ne faut pas demander.",
      "Avec ce mois s'ouvre le troisième temps de l'année du Cercle, **Transmettre**. Après avoir vu ce qui revient, puis traversé les liens avec tes mères et tes pères, tu regardes maintenant ce qui se transmet de génération en génération, en commençant par l'argent. Tu ne cherches pas à juger tes parents ni tes aïeux, seulement à voir ce que tu portes, pour choisir ce que tu gardes, et ce que tu feras passer à ton tour."
    ],
    sousTitre: 'Pourquoi regarder l’argent dans sa lignée ?',
    texte2: [
      "En psychogénéalogie, on observe que les familles transmettent une façon de vivre l'argent. Une grand-mère qui a connu la faim pendant la guerre, un grand-père dont le commerce a fait faillite, un héritage disputé entre frères et sœurs : ces histoires laissent des traces, même deux ou trois générations plus tard. Elles se transforment souvent en règles silencieuses : ne pas dépenser pour soi, ne pas réclamer son dû, ne pas dépasser ses parents, toujours garder une réserve « au cas où ».",
      "Dans certaines lignées, on a manqué longtemps, et la peur de manquer est restée même quand l'aisance est arrivée. Dans d'autres, on a beaucoup eu, puis tout perdu, et l'on se méfie depuis de ce qui va bien. Parfois, gagner plus que ses parents ressemble, sans qu'on le sache, à une forme d'abandon. Alors on s'arrête juste avant, on refuse une promotion, on donne tout ce qu'on gagne, par loyauté envers ceux qui ont peiné. Rien de cela n'est un défaut, c'est une fidélité.",
      "Ce mois-ci, tu vas **écouter** les phrases de ta famille, **remonter** aux histoires d'argent de ta lignée, **rendre** les peurs qui ne t'appartiennent pas, et **choisir** ce que tu t'autorises à recevoir. Reconnaître ces loyautés te laisse libre : tu peux honorer l'histoire des tiens tout en traçant ton propre chemin. Pour aller plus loin : [l'argent et la lignée](argent-et-lignee.html) et [la méthode des deux cycles](methode.html)."
    ],
    exemplesTitre: 'À quoi ressemble l’argent hérité, au quotidien',
    exemples: [
      "**Dans tes dépenses** : tu achètes sans hésiter pour tes enfants ou tes amis, et tu reposes l'article en rayon dès qu'il est pour toi, comme ta mère le faisait.",
      "**Dans ton travail** : tu n'oses pas fixer tes prix, tu fais des remises sans qu'on te les demande, et tu entends la voix de ton grand-père : « Il ne faut pas être gourmand. »",
      "**Dans tes peurs** : ton compte va bien, et pourtant tu vérifies ton solde trois fois par jour, avec une boule dans le ventre, comme si tout pouvait disparaître demain.",
      "**Dans tes réussites** : chaque fois que tu approches d'un vrai succès, une dépense imprévue, un oubli ou un renoncement arrive, et tu retombes au niveau de tes parents.",
      "**Dans tes forces** : le sens de l'économie, la générosité, le courage de recommencer à zéro, la fierté du travail bien fait. Ce sont aussi des héritages précieux."
    ],
    exempleSpirale: "Chez toi, on disait « l'argent ne tombe pas du ciel », et ta grand-mère comptait chaque pièce. Pendant des années, tu as refusé les cadeaux d'argent, et tu as sous-payé ton travail sans le voir. Ce mois-ci, une cliente te demande ton tarif, et tu sens le vieux réflexe : baisser le prix avant même qu'elle ne réagisse. Tu respires, et tu annonces ton vrai tarif, calmement. Tu reconnais la peur de ta grand-mère, tu la remercies d'avoir protégé la famille, et tu choisis de recevoir ta juste part. Le thème est le même, ta place a changé.",
    question: { k: 'theme-argent', q: "En une phrase, qu’est-ce que ta famille t’a transmis sur l’argent que tu retrouves aujourd’hui dans ta vie ?", ph: "Exemple : la peur de manquer, et l’idée qu’on ne demande jamais rien pour soi, comme ma mère et ma grand-mère." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Les phrases sur l’argent',
      intro: "Cette semaine, tu écoutes. Les phrases sur l’argent entendues enfant continuent souvent de parler en toi, à chaque dépense, à chaque demande, à chaque prix. Tu ne cherches pas encore à les changer : tu les attrapes, une par une.",
      texte: "Commence par l’exercice des phrases, au calme, une vingtaine de minutes. Puis, dans la semaine, remarque chaque fois qu’un réflexe d’argent se présente : une hésitation devant un achat, une gêne quand on parle salaire, un soulagement quand tu économises. Note-le.",
      exercices: [
        { k: 'ex1', titre: 'Les phrases sur l’argent', type: 'tableau', rangs: 4,
          etiquettes: ['Une phrase entendue à table', 'Une phrase sur le fait de dépenser', 'Une phrase sur ceux qui ont de l’argent', 'Une phrase que je me dis aujourd’hui'],
          consigne: "Note les phrases sur l'argent que tu as entendues dans ta famille : « l'argent ne tombe pas du ciel », « on n'est pas riches », « il ne faut pas en parler »… Pour chacune, indique qui la disait et dans quelle situation, puis ce que tu en fais aujourd'hui : tu la gardes, tu la changes, ou tu la laisses. Si tu n'as pas grandi avec tes parents, pense aux adultes qui t'ont élevé·e.",
          pourquoi: "Ces phrases sont si familières qu’on ne les entend plus : elles décident pourtant de nos prix, de nos dépenses et de nos renoncements. Les écrire avec le nom de qui les disait, c’est rendre à chaque phrase son origine, et retrouver le droit de choisir.",
          colonnes: [
            { q: "Quelle est la phrase, mot pour mot si possible ?", ph: ["Exemple : « On ne parle pas d’argent à table. »", "Exemple : « Ce n’est pas pour nous, c’est trop cher. »", "Exemple : « Les riches, ils ont forcément volé quelqu’un. »", "Exemple : « Je ne vais pas demander plus, je suis déjà bien payé·e. »"] },
            { q: "Qui la disait, et dans quelle situation ?", ph: ["Exemple : mon père, chaque fois que ma mère parlait des factures", "Exemple : ma mère, devant les vitrines, quand j’avais envie de quelque chose", "Exemple : mon grand-père, en regardant les informations", "Exemple : moi, au moment de mon entretien annuel, l’an dernier"] },
            { q: "Que fais-tu de cette phrase aujourd’hui : tu la gardes, tu la changes, tu la laisses ?", ph: ["Exemple : je la change : « On peut parler d’argent simplement, sans honte. »", "Exemple : je la laisse. J’ai le droit d’avoir envie de belles choses.", "Exemple : je la laisse, avec respect pour son histoire d’ouvrier", "Exemple : je la change : « Mon travail a de la valeur, je peux en parler. »"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis tes phrases. Qu’ont-elles en commun ? Quelle règle silencieuse dessinent-elles dans ta vie ?", ph: "Exemple : toutes disent qu’on ne doit pas vouloir plus. La règle, c’est : « Reste à ta place, ne demande rien. » Je la suis encore au travail." } },
        { k: 'voir-journal', titre: 'Mes réflexes d’argent', type: 'texte',
          consigne: "Cette semaine, chaque fois qu’un réflexe d’argent se présente, note-le le jour même : la situation, ce que tu as ressenti dans ton corps, la phrase qui t’est venue, ce que tu as fait. Une hésitation devant un achat, une gêne quand on parle de salaire, une générosité automatique. Vise au moins trois moments.",
          pourquoi: "Les réflexes d’argent sont rapides et discrets. Les noter, c’est voir que la peur de manquer ou la gêne de recevoir apparaissent toujours dans les mêmes situations, et c’est là que tu pourras choisir autrement.",
          q: "Ce que tu remarques, en général, quand l’argent entre en jeu",
          ph: "Exemple : j’ai toujours une petite honte quand je paie quelque chose pour moi, même un livre.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque moment : le jour, la situation, ce que tu as ressenti, la phrase qui est venue", ph: "Exemple : mardi, au marché, j’ai reposé les cerises en pensant « c’est trop cher pour moi ». C’est la voix de ma mère." } }
      ],
      conseil: "L’argent touche parfois à des histoires douloureuses : des dettes, des disputes, une période de manque. Si une émotion forte monte, fais une pause, respire, sors marcher à l’ombre. Tu peux reprendre un autre jour. Personne ne te demande de tout regarder d’un coup." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'Les histoires d’argent de ta lignée',
      intro: "Derrière chaque peur d’argent, il y a souvent une histoire : une guerre, une faillite, un héritage perdu, une réussite qui a éloigné quelqu’un des siens. Cette semaine, tu remontes le fil, avec douceur, pour voir d’où viennent tes réflexes.",
      texte: [
        "Dans la méthode des deux cycles, l'argent touche d'abord au **cycle de la racine** : la sécurité, le toit, le droit d'avoir des besoins et de les satisfaire. Une lignée qui a manqué transmet souvent la peur de manquer, le besoin d'accumuler, ou au contraire l'impossibilité de garder ce qui arrive, comme si l'argent brûlait les mains.",
        "Il touche aussi au **cycle du cœur** : ta valeur, le droit de recevoir, la loyauté envers les tiens. Réussir plus que ses parents peut donner la sensation de les trahir. Demander ce qui te revient peut réveiller la peur d'être rejeté·e. Recevoir un cadeau peut sembler créer une dette. On commence en général par la racine : quand on se sent en sécurité, on peut recevoir plus librement, et reconnaître sa valeur sans culpabilité."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ta lignée, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en ouvrant un vieux tiroir, en regardant une photo, ou au détour d’une conversation.",
          pourquoi: "Souvent, on découvre que notre façon de vivre l’argent répond à une histoire vécue avant nous. Le voir change tout : ce n’est plus « je suis nul·le avec l’argent », c’est une fidélité que je peux reconnaître, puis choisir de transformer.",
          choix: { k: 'cycle', q: "Aujourd'hui, ton rapport à l'argent touche surtout…", options: ['La racine : ma sécurité, la peur de manquer', 'Le cœur : ma valeur, le droit de recevoir', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'regarder-manque', q: "Qui a manqué, et qui a réussi, dans ta lignée ? Que sais-tu de leur histoire ?", ph: "Exemple : mes grands-parents paternels étaient ouvriers agricoles, ils ont connu la faim pendant la guerre. Mon oncle a monté une entreprise et on disait qu’il « avait pris la grosse tête »." },
            { k: 'regarder-heritage', q: "Y a-t-il eu des héritages, des dettes, des faillites ou des disputes d’argent dans ta famille ?", ph: "Exemple : à la mort de mon arrière-grand-père, la ferme a été vendue et les frères ne se sont plus parlé pendant vingt ans." },
            { k: 'regarder-depenser', q: "Comment tes parents, ou les adultes qui t’ont élevé·e, vivaient-ils le fait de dépenser ?", ph: "Exemple : mon père dépensait sans compter, ma mère cachait des économies dans une boîte. Ils se disputaient souvent à ce sujet." },
            { k: 'regarder-recevoir', q: "Qu’as-tu du mal à demander ou à recevoir aujourd’hui ?", ph: "Exemple : une augmentation, des cadeaux d’argent, et même l’aide de mes amis quand je déménage." }
          ] },
        { k: 'source-question', titre: 'Une question sur l’argent des aïeux', type: 'questions',
          consigne: "Demande à un membre de ta famille comment vivaient vos aïeux : leurs métiers, leurs maisons, les moments difficiles, les fiertés. Par téléphone, à table, ou par message. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html). Si personne ne peut te répondre, regarde un objet de famille et imagine l’histoire qu’il raconte.",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma mère : « Est-ce que mamie a déjà eu peur de ne pas pouvoir nourrir ses enfants ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a raconté que mamie a fait des ménages en cachette pendant dix ans pour payer les dettes de papi. J’ai compris d’où vient ma honte de demander.", lignes: 3 }
          ] }
      ],
      conseil: "Ajoute dans [ton arbre familial](genosociogramme.html) les métiers, les faillites, les héritages et les départs liés à l’argent. L’outil t’aide à voir les répétitions, et ta page « Ton mois » te rappellera les dates importantes de ces histoires. Pour aller plus loin : [la peur de manquer d’argent](peur-de-manquer-d-argent.html)." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre les peurs, garder le courage',
      intro: "Cette semaine, tu fais le tri entre ce que ta lignée t’a transmis de précieux sur l’argent, et ce qui pèse. Tu rends symboliquement les peurs qui ne t’appartiennent pas, et tu t’écris une vraie lettre de permission.",
      exercices: [
        { k: 'ex2', titre: 'L’argent dans ma lignée', type: 'blocs', nb: 3,
          etiquettes: ['Quelqu’un qui a manqué', 'Quelqu’un qui a réussi', 'Quelqu’un qui a perdu'],
          consigne: "Choisis trois personnes de ta famille dont l'histoire avec l'argent te parle : quelqu'un qui a manqué, quelqu'un qui a réussi, quelqu'un qui a perdu. Si tu n'as pas d'exemple pour une case, choisis quelqu'un d'autre qui t'inspire. Écris ce que tu sais de son vécu, puis ce que tu reconnais en toi : une peur, une force, une habitude.",
          pourquoi: "Regarder trois histoires différentes montre que ta lignée n’est pas faite d’une seule couleur. Le manque, la réussite et la perte t’ont chacun transmis quelque chose, et tu peux choisir, pour chacun, ce que tu gardes.",
          astuce: "Cherche aussi les forces : celui qui a manqué t’a peut-être transmis la débrouillardise, celle qui a perdu, le courage de recommencer. Les peurs et les forces viennent souvent de la même histoire.",
          champs: [
            { q: "Qui est-ce ?", ph: ["Exemple : ma grand-mère Lucienne, veuve à 35 ans avec quatre enfants", "Exemple : mon oncle Jacques, qui a créé son garage", "Exemple : mon arrière-grand-père, qui a perdu sa boutique en 1930"] },
            { q: "Que sais-tu de ce qu’elle ou il a vécu avec l’argent ?", ph: ["Exemple : elle faisait des ménages, comptait chaque centime, n’a jamais acheté une robe pour elle", "Exemple : il a bien gagné sa vie, mais la famille disait qu’il « se croyait mieux que les autres »", "Exemple : il a tout perdu en un an, et ne s’en est jamais remis"] },
            { q: "Que reconnais-tu en toi : une peur, une force, une habitude ?", ph: ["Exemple : sa peur de manquer, et aussi son incroyable courage", "Exemple : la peur d’être jugé·e si je réussis, et le goût d’entreprendre", "Exemple : la méfiance quand tout va bien, comme si la chute allait suivre"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre de permission', type: 'questions',
          consigne: "Écris-toi une lettre de permission. Commence par « Aujourd'hui, je m'autorise à… ». Dis ce que tu t'autorises à gagner, à demander, à recevoir, à dépenser pour toi. Tu peux remercier les tiens pour ce qu'ils ont construit, et leur dire que tu choisis maintenant ton propre rapport à l'argent. Cette lettre est pour toi seul·e.",
          pourquoi: "Beaucoup de règles d’argent ont été posées sans qu’on nous demande notre avis. S’écrire une permission, c’est reprendre la main : tu ne rejettes pas ta lignée, tu poses tes propres règles, avec respect pour celles qui t’ont précédé·e.",
          questions: [
            { k: 'lettre-a', q: "À qui adresses-tu aussi tes remerciements, dans ta lignée ?", ph: "Exemple : à mamie Lucienne, et à tous ceux qui ont travaillé dur avant moi", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu reconnais, ce que tu remercies, ce que tu rends, ce que tu t’autorises", ph: "Exemple : Aujourd’hui, je m’autorise à être bien payé·e pour mon travail. Mamie, tu as tenu la famille à bout de bras, je te remercie pour ton courage. Je te rends la peur de manquer, elle t’a protégée, elle ne me sert plus. Je m’autorise à dépenser pour moi sans honte, à demander ce qui me revient, et à réussir sans m’éloigner de ceux que j’aime.", lignes: 8 }
          ] }
      ],
      rituel: {
        titre: 'La pièce de la lignée',
        intro: "Ce rituel symbolique honore ce que ta lignée a vécu avec l'argent et marque ta propre permission. Fais-le une fois dans la semaine, après ta lettre. Il dure environ dix minutes, au calme, à l'ombre ou à la fraîcheur du soir.",
        materiel: "Une pièce de monnaie, une petite boîte ou une enveloppe, ta lettre de permission.",
        etapes: [
          "Installe-toi au calme. Tiens la pièce dans ta main ouverte, paume vers le ciel. Respire trois fois.",
          "Pense aux personnes de ta lignée qui ont travaillé, manqué, réussi ou perdu. Laisse venir leurs visages, ou simplement leurs noms.",
          "Dis, à voix haute ou intérieurement : « Je reconnais ce que vous avez vécu. Merci pour ce que vous avez construit. »",
          "Puis : « Ce qui vous appartient, je vous le laisse. Je garde votre courage. Je m'autorise à recevoir ma juste part. »",
          "Range la pièce dans la boîte ou l'enveloppe, avec ta lettre si tu le souhaites, et garde-la dans un endroit qui te plaît.",
          "Note ici ce que tu as ressenti, et la phrase de permission qui te touche le plus."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : à qui tu as pensé, ce que tu as dit, ce que tu as ressenti.", ph: "Exemple : j’ai pensé à mamie et à son porte-monnaie usé. En disant « je m’autorise à recevoir », ma voix a tremblé, puis je me suis senti·e plus léger·e." }
      },
      conseil: "Si la lettre ou le rituel réveillent une émotion forte, fais une pause, bois un verre d’eau, sors marcher. Tu peux finir un autre jour. Et si l’argent est aujourd’hui une vraie difficulté dans ta vie, sois particulièrement doux·ce avec toi : regarder l’histoire n’efface pas les factures, mais allège souvent le poids de la honte." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Ce que tu t’autorises à recevoir',
      intro: "Tu as écouté les phrases de ta famille, regardé les histoires d’argent de ta lignée, et rendu ce qui pesait. Cette semaine, tu poses une nouvelle phrase et un petit geste de permission, et tu commences à transmettre autre chose.",
      texte: [
        "**La première pause.** Quand tu sens monter un vieux réflexe d’argent, la gêne devant un prix, l’envie de refuser un cadeau, la boule au ventre en regardant ton compte, respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois de suite. Puis dis-toi intérieurement : « Je te reconnais, tu viens de ma lignée. Aujourd’hui, je choisis autrement. »",
        "**Recevoir, c'est aussi transmettre.** Le temps de la transmission commence ici : chaque fois que tu t'autorises à recevoir, à demander ou à dépenser pour toi sans honte, tu montres à ceux qui t'entourent, enfants, neveux, amis, qu'un autre rapport à l'argent est possible. Ce que tu changes pour toi, tu le changes aussi pour la suite."
      ],
      exercices: [
        { k: 'ex3', titre: 'Mon geste de permission', type: 'texte',
          consigne: "Choisis une nouvelle phrase sur l'argent, et un petit geste de permission qui va avec. Écris-les, puis note chaque fois que tu as osé recevoir, demander ou dépenser pour toi, même un tout petit peu, et ce que ça t'a fait. Ce geste rejoint ton carnet « J’avance » : il nourrit ta juste valeur.",
          pourquoi: "On ne change pas une règle d’argent en la contredisant une fois, mais en vivant autrement, petit à petit. Chaque geste de permission, même minuscule, apprend à ton corps qu’il peut recevoir sans danger.",
          gestes: ["Accepter un compliment ou un cadeau en disant seulement « merci »", "M’offrir une chose qui me fait plaisir, sans me justifier", "Annoncer mon tarif ou mon prix sans baisser la voix", "Parler d’argent simplement avec un proche", "Demander ce qui me revient : un remboursement, un paiement, un service rendu", "Mettre de côté une petite somme rien que pour un plaisir"],
          q: "Ta nouvelle phrase et ton geste : « Désormais, je me dis… et je m’autorise à… »",
          ph: "Exemple : désormais, je me dis « mon travail a de la valeur, et j’ai le droit d’être bien payé·e », et je m’autorise à annoncer mon vrai tarif dès le premier rendez-vous.",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as osé recevoir, demander ou dépenser pour toi : quand, et qu’est-ce que ça t’a fait ?", ph: "Exemple : samedi, j’ai acheté les cerises sans regarder le prix. Je les ai mangées sur mon balcon, et j’ai pensé à mamie avec tendresse." } }
      ],
      conseil: "Si le vieux réflexe revient malgré tout, ce n’est pas un échec : remarque-le après coup, et dis-toi « la prochaine fois ». Ton rapport à l’argent s’est construit sur des générations : il peut se transformer à ton rythme, sans te presser, comme un fruit qui mûrit en été." }
  ],

  meditation: {
    titre: 'Les mains ouvertes',
    intro: "Une séance guidée pour regarder ta lignée et son histoire avec l’argent, rendre les peurs qui ne t’appartiennent pas, et ouvrir tes mains à ce qui te revient.",
    texte: [
      "Installe-toi confortablement et ferme les yeux. Respire profondément, trois fois. Laisse tes épaules descendre, ton dos se poser, ton souffle ralentir.",
      "[pause]",
      "Avant de commencer, sache que tu peux t’arrêter à tout moment. Si quelque chose est trop fort, ouvre les yeux, sens tes pieds sur le sol, et reviens à ton souffle. Tu es en sécurité, ici et maintenant.",
      "Pose tes mains sur tes cuisses, paumes vers le ciel. Sens l'air sur tes paumes, leur poids, leur chaleur. Remarque si elles ont envie de se refermer, ou de rester ouvertes.",
      "Imagine derrière toi les personnes de ta lignée. Certaines ont travaillé dur aux champs ou à l'usine, d'autres ont compté chaque pièce à la fin du mois, d'autres encore ont connu l'aisance, ou l'ont perdue.",
      "[pause]",
      "Chacune a vécu l'argent à sa manière, avec ce qu'elle avait et ce qu'elle savait, à son époque. Tu peux les regarder avec respect, sans rien leur reprocher, sans rien leur devoir non plus.",
      "Si tu portes une peur qui ne t'appartient pas, la peur de manquer, de perdre, de trop avoir, imagine que tu la poses doucement devant elles, comme un vieux sac. Dis intérieurement : « Je vous la rends. Je garde votre courage. »",
      "[longue pause]",
      "Reviens à tes mains ouvertes. Imagine qu'elles reçoivent quelque chose de doux : une lumière dorée d’été, une chaleur, un mot. Laisse-les recevoir, simplement, sans rien rendre tout de suite.",
      "Si une petite voix dit « ce n’est pas pour toi », remercie-la de t’avoir protégé·e, et laisse tes mains ouvertes un instant de plus.",
      "Sens que tu as le droit d'être là, de prendre ta place, de recevoir ta juste part. Derrière toi, ta lignée te regarde avancer, et tu peux lui dire merci pour tout ce qu'elle a construit.",
      "[pause]",
      "Respire profondément. Sens ton corps, le siège sous toi. Referme doucement tes mains, comme pour garder ce que tu as reçu. Bouge les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment calme, dans la fraîcheur du matin ou du soir, où personne ne te dérangera pendant dix minutes. Garde un verre d’eau à côté de toi. Si l’argent est en ce moment une source de grande inquiétude, commence par la seule partie des mains ouvertes : la lignée peut attendre.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Des visages, ce que tu as rendu, ce que tes mains ont reçu, une sensation…", ph: "Exemple : j’ai vu mon grand-père avec ses mains abîmées. Je lui ai rendu un sac très lourd. Mes mains ont reçu une lumière chaude, et j’ai eu envie de pleurer de soulagement." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-phrases', q: "Quelles phrases ou quelles règles d’argent as-tu repérées ce mois-ci ?", ph: "Exemple : « On ne demande rien pour soi » et « Il ne faut pas dépasser ses parents ». Je les suivais sans le savoir." },
    { k: 'fin-histoire', q: "Qu’as-tu compris de l’histoire d’argent de ta lignée ?", ph: "Exemple : ma grand-mère a payé les dettes de mon grand-père en cachette. Sa honte est devenue la mienne." },
    { k: 'fin-laisse', q: "Qu’as-tu laissé à ta lignée, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : la peur de manquer. Je regarde mon compte moins souvent, et avec moins de peur." },
    { k: 'fin-autorise', q: "Que t’autorises-tu désormais, et quel geste de permission as-tu osé ?", ph: "Exemple : je m’autorise à être bien payé·e. J’ai annoncé mon nouveau tarif à deux clientes, et elles ont accepté." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en août, en regardant les lieux et les départs de ta lignée ?", ph: "Exemple : continuer à recevoir sans honte, et découvrir d’où vient ma famille, et où je me sens chez moi.", court: true }
  ],

  carnet: {
    titre: 'Ma valeur',
    texte: "Ce que tu libères ici ouvre tes mains là-bas. Pendant que ton suivi regarde ce que ta lignée t’a transmis sur l’argent, ton carnet t’aide à recevoir, à demander et à oser ta juste valeur. Reporte ton geste de permission dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Août', titre: 'Racines, départs et lieux', texte: "Retrouver les lieux de ta famille, regarder les départs et les exils, et sentir où tu te sens chez toi.", image: 'assets/cartes/partir-mini.jpg' },
    { mois: 'Septembre', titre: 'Les métiers de la lignée', texte: "Regarder le travail de ta famille, reconnaître les vocations empêchées, et choisir ce que tu veux faire de ta vie professionnelle.", image: 'assets/guide/guide-transmission.webp' },
    { mois: 'Octobre', titre: 'Les âges qui se répondent', texte: "Observer les âges et les dates qui reviennent dans ta famille, et vivre chacun d’eux à ta façon.", image: 'assets/cartes/apprendre-mini.jpg' }
  ]
};
