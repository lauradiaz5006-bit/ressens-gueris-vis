/* Genesolia · Le Cercle · Mon livret « Libération » de février 2027 : « Quel projet a-t-on posé sur moi ? »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-02',
  cle: 'suivi-2027-02',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-02-0d10ec64c2.pdf',
  nomMois: 'février 2027',
  moisSuivant: 'mars',
  titre: "Quel projet a-t-on posé sur moi ?",
  sousTitre: "Tronc de ton arbre de vie · Découvrir l’histoire de ton prénom, voir les attentes posées sur toi, et écrire ton propre contrat avec la vie.",
  citation: "Mon prénom m’a été donné. Ma vie, je la choisis.",
  audio: '',
  audioCourt: '',
  saisonLien: "Février est le mois des premières lueurs : les jours rallongent, la sève commence à monter dans les arbres, encore invisible. C’est le bon moment pour revenir à ce qui t’accompagne depuis ta naissance : ton prénom, et les espoirs que ta famille a posés sur toi. Comme la sève sous l’écorce, ton propre élan est déjà là, prêt à grandir à ta façon.",
  intensiteQ: "À quel point les attentes posées sur toi depuis l’enfance pèsent-elles sur ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette impression de devoir réussir pour toute la famille, comme si mon chemin était tracé avant ma naissance.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-etoiles.webp',
      theme: 'assets/guide/guide-boucle.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-arbre.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/aimer-et-choisir-mini.jpg', "On peut aimer sa famille et choisir autre chose."]
    }
  },

  mots: {
    saison: "Prends un moment pour respirer avec ta saison. Sens ton propre élan, encore discret, déjà vivant.",
    theme: "Lis cette page comme une lettre. Si un prénom ou une attente te vient en lisant, note-le quelque part.",
    voir: "Cette semaine, tu regardes les prénoms de ta lignée. Même un prénom à l’histoire inconnue est déjà une information.",
    source: "Pose tes questions avec douceur, à ta famille comme à toi. Range chaque réponse dans son tiroir, et garde ce qui te parle.",
    liberer: "Tu remercies l’ancien contrat, puis tu écris le tien. Tu avances à ton rythme, avec tendresse pour l’enfant que tu étais.",
    remplacer: "Porter ton prénom à ta façon, un petit geste à la fois. Ton contrat avec la vie prend corps au quotidien.",
    meditation: "Un soir tranquille, un moment doux. Si une émotion monte, reviens à ton souffle et à tes pieds sur le sol.",
    bilan: "Prends ce moment, même si une partie reste à faire. Ton prénom t’appartient un peu plus qu’au début du mois."
  },

  theme: {
    titre: "Le projet posé sur toi",
    texte: [
      "Avant même ta naissance, quelqu’un a choisi ton prénom. Avec lui sont souvent venus des espoirs : ressembler à une grand-mère admirée, réussir là où un parent a dû renoncer, apporter de la joie dans une période difficile, prolonger une tradition ou au contraire ouvrir une page neuve. Ces attentes étaient souvent pleines d’amour. Elles ont parfois dessiné un chemin avant que tu puisses choisir le tien.",
      "Tu continues le **tronc** de ton arbre de vie : tu comprends ce que tu portes. Après la peur héritée, à l’étape précédente, tu regardes ce mois-ci le projet posé sur toi, pour te réapproprier ton prénom et ton chemin. De la peur héritée à la vie choisie, c’est le moment d’écrire ton propre contrat avec la vie."
    ],
    sousTitre: "Prénoms, attentes et projet-sens",
    texte2: [
      "En psychogénéalogie, on observe que le prénom raconte souvent une histoire : un hommage, une mémoire, un espoir, un désir de changement. Les mêmes prénoms circulent parfois d’une génération à l’autre : un Jean à chaque génération, des Marie en deuxième prénom. Une petite Louise qui porte le prénom d’une grand-mère très admirée peut sentir qu’on attend d’elle la même force.",
      "On parle aussi de **projet-sens** : l’ensemble des espoirs, des peurs et des projets qui entourent la venue d’un enfant. L’année de ta naissance, que vivait ta famille ? Une installation, un départ, une réussite, une perte ? Ce contexte a pu colorer ce qu’on attendait de toi. Ce sont des pistes, à regarder avec tendresse pour celles et ceux qui ont fait de leur mieux. Pour aller plus loin : [le prénom transmis](prenom-transmis-psychogenealogie.html) et [le projet-sens](projet-sens-conception-deuil.html).",
      "Ce mois-ci, tu vas **voir** les prénoms de ta lignée, **comprendre** l’histoire du tien et les attentes de ta naissance en rangeant chaque information dans son tiroir, **écrire** ton propre contrat avec la vie grâce à ton protocole du mois, et **porter** ton prénom à ta façon, chaque jour."
    ],
    exemplesTitre: "Ce que peut porter un prénom, au quotidien",
    exemples: [
      "**L’hommage** : tu portes le prénom de ton grand-père, et à chaque repas de famille on te dit « tu es bien comme lui ». Tu cherches ce qui est vraiment à toi.",
      "**L’espoir** : tes parents t’ont appelé·e Victoire, ou René, « celui qui renaît ». Tu sens depuis toujours qu’il fallait réussir, ou recommencer quelque chose.",
      "**Le métier rêvé** : ton père rêvait d’être ingénieur, il a dû travailler à 16 ans. Depuis l’enfance, on te dit « toi, tu feras de longues études ».",
      "**La rupture** : ton prénom est unique dans la famille. Tu apprends que ta mère voulait ouvrir une page neuve, loin des vieilles traditions.",
      "**Le surnom** : depuis l’enfance, on t’appelle « la petite » ou par un diminutif. À 35 ans, tu remarques que tu as du mal à te faire appeler par ton vrai prénom."
    ],
    exempleSpirale: "La spirale, c’est le même prénom, un cran plus haut. Tu portes celui de ta grand-mère Jeanne, réputée pour tout supporter en silence, et tu te surprends à faire pareil. Ce mois-ci, tu apprends son histoire, tu la remercies, tu écris ton propre contrat. Quand tu signes « Jeanne » au bas de ton contrat, tu as l’impression, pour la première fois, de signer pour toi.",
    question: { k: 'theme-projet-feb', q: "Quand tu prononces ton prénom à voix haute, que ressens-tu, et quelle attente semble l’accompagner ?", ph: "Exemple : de la fierté, et un peu de poids. Il évoque ma grand-mère, que tout le monde admirait pour sa force." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "Les prénoms de ta lignée",
      intro: "Cette semaine, tu poses sur la table les prénoms de ta famille, sur trois ou quatre générations. Tu explores, tu regardes ce qui revient, et tu remarques comment on prononce ton prénom autour de toi.",
      texte: "Commence par la liste des prénoms, au calme, une vingtaine de minutes, avec ton arbre si tu l’as déjà commencé. Puis, pendant la semaine, remarque comment on t’appelle, et note-le dans ton journal.",
      exercices: [
        { k: 'prenoms-feb', titre: "Les prénoms de ma lignée", type: 'tableau', rangs: 4,
          etiquettes: ['Un premier prénom', 'Un deuxième prénom', 'Un troisième prénom', 'Un quatrième prénom'],
          consigne: "Fais la liste des prénoms de ta famille, en commençant par ceux qui reviennent ou qui ressemblent au tien. Note qui les a portés, et ce que tu sais de leur histoire. Si ta famille est adoptive ou recomposée, tu peux partir de la famille qui t’a élevé·e, de celle dont tu es issu·e, ou des deux.",
          pourquoi: "Quand on aligne les prénoms d’une famille, les répétitions apparaissent : un prénom qui saute une génération, un deuxième prénom toujours identique, un prénom redonné. Ce sont des indices précieux de ce que la famille a voulu garder vivant.",
          colonnes: [
            { q: "Quel est ce prénom ?", ph: ["Exemple : Jean", "Exemple : Marie, en deuxième prénom", "Exemple : Louise", "Exemple : Pierre"] },
            { q: "Qui l’a porté, dans ta famille ?", ph: ["Exemple : mon arrière-grand-père, mon grand-père, et mon frère aîné", "Exemple : ma mère, ma tante, ma sœur et moi", "Exemple : ma grand-mère maternelle, puis ma fille", "Exemple : le frère de mon père, puis mon père lui-même"] },
            { q: "Que sais-tu de leur histoire ?", ph: ["Exemple : tous les aînés ont repris la ferme, sauf mon frère", "Exemple : c’était pour remercier une tante qui avait élevé ma grand-mère", "Exemple : ma grand-mère était la femme forte de la famille", "Exemple : on en parle peu, juste « le petit Pierre »"] }
          ],
          apres: { k: 'prenoms-feb-repete', q: "Relis ta liste. Quels prénoms reviennent, et lequel ressemble le plus au tien, ou à ton histoire ?", ph: "Exemple : Jean revient à chaque génération chez les aînés. Et mon deuxième prénom, Louise, est celui de ma grand-mère." } },
        { k: 'journal-prenom-feb', titre: "Mon journal du prénom", type: 'texte',
          consigne: "Cette semaine, remarque comment on prononce ton prénom autour de toi : au travail, en famille, entre amis. Le ton, les surnoms, les raccourcis, qui l’utilise et qui préfère un autre nom. Note chaque jour un moment, et ce que tu as ressenti. Vise au moins trois moments.",
          pourquoi: "La façon dont on nous appelle dit beaucoup de la place qu’on nous donne. Un surnom d’enfant chez les adultes, un prénom prononcé avec tendresse ou avec sécheresse : tout cela se remarque à peine, et pourtant nous touche.",
          q: "Ce que tu remarques, en général, quand on prononce ton prénom",
          ph: "Exemple : ma famille utilise toujours mon surnom d’enfant, et au travail on m’appelle par mon nom de famille. Mon vrai prénom, je l’entends rarement.",
          journal: { k: 'journal-prenom-sit-feb', n: 6, q: "Chaque moment : le jour, qui t’a appelé·e, comment, et ce que tu as ressenti", ph: "Exemple : mardi, ma mère m’a appelée « ma Loulou » au téléphone. Je me suis sentie petite, et un peu attendrie." } }
      ],
      conseil: "Commence par les prénoms que tu connais, et laisse des cases vides : elles se rempliront peut-être en posant des questions la semaine prochaine. Une case vide est aussi une information." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "L’histoire de ton prénom",
      intro: "Cette semaine, tu remontes à ta naissance : qui a choisi ton prénom, pour quelle raison, et ce que vivait ta famille cette année-là. Tu écoutes les récits, et tu ranges chaque information dans son tiroir.",
      texte: [
        "Pour chaque information, demande-toi dans quel tiroir elle va. **Ce que je sais** : la date et le lieu de ta naissance, qui a déclaré ton prénom, ce que vivait ta famille cette année-là. **Ce qu’on m’a raconté** : « on t’a appelée comme ta grand-mère parce qu’elle était si courageuse ». **Ce que je suppose** : une attente que tu sens, une ressemblance, un mot que tu entends dans ton prénom.",
        "Les attentes posées sur un enfant sont souvent pleines d’amour, et parfois lourdes à porter. Les regarder, c’est recevoir ton prénom en connaissance de cause, avec gratitude pour celles et ceux qui l’ont choisi. Ensuite, la semaine prochaine, tu pourras écrire l’ancien contrat, et le tien."
      ],
      exercices: [
        { k: 'source-prenom-feb', titre: "Autour de ton prénom, regarde", type: 'questions',
          consigne: "Prends ces questions une par une, avec ta liste de prénoms à côté de toi. Si une réponse tarde, passe à la suivante : elle viendra peut-être dans la semaine, au détour d’une conversation.",
          pourquoi: "Les raisons d’un prénom sont souvent racontées en une phrase, une fois, puis oubliées. Les rassembler permet de voir ce que ton prénom porte : un hommage, une attente, une mémoire, un désir de changement.",
          choix: { k: 'tiroir-feb', q: "Ce que tu sais de l’histoire de ton prénom vient surtout du tiroir…", options: ['Ce que je sais : des faits', 'Ce qu’on m’a raconté : des récits', 'Ce que je suppose : des pistes', 'Un peu des trois'] },
          questions: [
            { k: 'source-choisi-feb', q: "Qui a choisi ton prénom, et dans quelles circonstances ?", ph: "Exemple : mon père, à la mairie, parce que ma mère hésitait encore entre deux prénoms." },
            { k: 'source-pourquoi-feb', q: "Pourquoi ce prénom, d’après ce qu’on t’a raconté ?", ph: "Exemple : en hommage à la sœur de ma mère, qui était très drôle et voulait partir à Paris." },
            { k: 'source-avant-feb', q: "Qui le portait avant toi dans la famille, et que sais-tu de cette personne ?", ph: "Exemple : ma grand-tante Hélène. On dit qu’elle chantait tout le temps." },
            { k: 'source-annee-feb', q: "L’année de ta naissance, que vivait ta famille ?", ph: "Exemple : mes parents venaient d’acheter la boulangerie, mon grand-père était parti à la retraite." },
            { k: 'source-attente-feb', q: "Qu’espérait-on peut-être de toi, à travers ce prénom et ce moment ?", ph: "Exemple : que je sois la joie de la maison, et que je reprenne un jour la boulangerie." },
            { k: 'source-ecoute-feb', q: "Dis ton prénom à voix haute, comme un jeu : quels mots entends-tu dedans ?", ph: "Exemple : Claire, j’entends « clair ». René, j’entends « re-né ». Serge, j’entends « je sers ». Je garde ce qui me parle." }
          ] },
        { k: 'source-question', titre: "Une question à ta famille", type: 'questions',
          consigne: "Demande à un membre de ta famille pourquoi ton prénom a été choisi, ou ce que vivait la famille l’année de ta naissance. Par téléphone, à table ou par message. Note sa réponse, puis range-la dans son tiroir. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma mère : « Pourquoi m’avez-vous appelée Claire ? Vous aviez pensé à d’autres prénoms ? »", court: true },
            { k: 'source-reponse-feb', q: "Qu’as-tu appris, et dans quel tiroir le ranges-tu ?", ph: "Exemple : je devais m’appeler Marie, comme ma grand-mère, et mon père a choisi Claire au dernier moment. C’est un récit, et je me suis senti·e libre, d’un coup.", lignes: 3 }
          ] }
      ],
      conseil: "Ajoute dans [ton arbre familial](genosociogramme.html) les prénoms qui se répètent et les personnes qui les ont portés. Pour jouer avec les sonorités de ton prénom, tu peux aussi ouvrir [l’outil ton prénom](ton-prenom.html). Si tu découvres que ton prénom a été porté par un enfant disparu, prends le temps de respirer, et lis si tu le souhaites [l’enfant de remplacement](enfant-de-remplacement.html)." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "L’ancien contrat, et le tien",
      intro: "Cette semaine, tu vis ton protocole du mois. Tu écris le contrat qu’on a posé sur toi, puis le tien, tu accueilles l’enfant que tu étais, et tu ranges l’ancien contrat « à leur histoire ». L’exercice ci-dessous t’aide à préparer ton ancien contrat.",
      exercices: [
        { k: 'attentes-feb', titre: "Les attentes posées sur moi", type: 'blocs', nb: 3,
          etiquettes: ['Une attente de ma mère', 'Une attente de mon père', 'Une attente de ma famille'],
          consigne: "Pour chaque ligne, écris une attente que tu as sentie, dite ou devinée. Puis ce qu’elle espérait ou protégeait, et ce que tu choisis d’en faire aujourd’hui. Si tu as été élevé·e par d’autres adultes, adapte les étiquettes à ton histoire.",
          pourquoi: "Une attente reconnue perd de sa force cachée. En voyant ce qu’elle espérait pour toi, tu peux la remercier, garder ce qui te ressemble, et laisser le reste à leur histoire.",
          astuce: "Derrière une attente lourde, il y a souvent un rêve inachevé ou une peur. « Tu feras de longues études » peut vouloir dire « je veux que tu aies la liberté qui m’a manqué ».",
          champs: [
            { q: "Quelle attente as-tu sentie ?", ph: ["Exemple : être sage et discrète", "Exemple : reprendre la boulangerie", "Exemple : être la première à faire des études"] },
            { q: "Qu’espérait-elle ou que protégeait-elle, peut-être ?", ph: ["Exemple : la paix à la maison, après des années de disputes", "Exemple : la continuité du travail de toute une vie", "Exemple : une revanche sur une vie de travail dur"] },
            { q: "Que choisis-tu d’en faire aujourd’hui ?", ph: ["Exemple : je garde la douceur, je reprends ma voix", "Exemple : je garde l’amour du travail bien fait, je choisis mon métier", "Exemple : je garde le goût d’apprendre, à mon rythme"] }
          ] }
      ],
      rituel: {
        titre: "Le prénom retrouvé",
        intro: "Ce petit rituel accompagne ton protocole : après avoir écrit ton contrat, tu fais pleinement tien ton prénom. Fais-le une fois ce mois-ci, dans un moment calme. Il dure environ dix minutes.",
        materiel: "Une feuille, un stylo et, si tu le souhaites, une bougie.",
        etapes: [
          "Si tu le souhaites, allume la bougie. Respire trois fois profondément. Écris ton prénom en grand au centre de la feuille.",
          "Autour, note les personnes et les histoires qu’il porte : celles et ceux qui l’ont porté avant toi, qui l’ont choisi, ce qu’on espérait de toi.",
          "Dis à voix haute : « Je reçois l’histoire de mon prénom avec respect. »",
          "Puis dis : « Ce qui appartient aux autres, je le leur laisse. »",
          "Prononce ton prénom trois fois, lentement, et dis : « Il est à moi. »",
          "Plie la feuille et garde-la avec ton contrat. Si tu as allumé une bougie, éteins-la en restant près d’elle jusqu’au bout, et note ce qui est venu ci-dessous."
        ],
        note: { k: 'rituel-note-feb', q: "Comment s’est passé ton rituel ? Qu’as-tu ressenti en disant « Il est à moi » ?", ph: "Exemple : la première fois, ma voix tremblait. La troisième fois, j’ai souri. J’ai eu l’impression de m’entendre vraiment pour la première fois." }
      },
      conseil: "Si l’accueil de l’enfant réveille une émotion forte, garde les yeux ouverts, pose les pieds au sol, bois un verre d’eau. Tu peux écrire à la place d’imaginer, et vivre le protocole en deux fois. Ton prénom et ton contrat t’attendent, à ton rythme." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: "Porter ton prénom à ta façon",
      intro: "Tu as vu les prénoms de ta lignée, découvert l’histoire du tien, écrit ton contrat avec la vie. Cette semaine, tu intègres : tu écris ton prénom en grand sur ton arbre de vie, et tu fais vivre ton contrat, chaque jour, par un petit geste.",
      texte: [
        "**La première pause.** Quand une vieille attente se présente (« tu es bien comme ton grand-père », « toi, tu dois réussir »), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Merci. Je porte ce prénom à ma façon, et je suis mon propre chemin. »",
        "**Le prénom choisi.** Te réapproprier ton prénom, c’est accueillir son histoire en affirmant : « Je suis moi, avec ma propre vie. » Certain·es changent de surnom, d’autres gardent tout tel quel et le portent autrement. Sur ton arbre, tu écris : « Mon prénom m’invite à vivre… »."
      ],
      exercices: [
        { k: 'lettre-prenom-feb', titre: "La lettre à mon prénom", type: 'questions',
          consigne: "Écris une lettre à ton prénom. Commence par « Cher prénom que je porte… ». Dis-lui ce que tu as aimé chez lui, ce qu’il porte de ta famille, et ce que tu laisses à leur histoire. Termine par ta phrase : « Mon prénom m’invite à vivre… ».",
          pourquoi: "Écrire à ton prénom permet de remercier ce qui te relie à ta lignée, de laisser ce qui appartient aux autres, et de garder ton prénom léger et vivant.",
          questions: [
            { k: 'lettre-prenom-a-feb', q: "Quel prénom choisis-tu d’écrire, tel que tu le portes aujourd’hui ?", ph: "Exemple : Jeanne-Marie, mes deux prénoms ensemble", court: true },
            { k: 'lettre-prenom-texte-feb', q: "Ta lettre : ce que tu aimes, ce qu’il porte de ta famille, ce que tu laisses, et ta phrase « Mon prénom m’invite à vivre… »", ph: "Exemple : Cher prénom que je porte, enfant je te trouvais trop ancien. Tu portes ma grand-mère, son courage et sa façon de tout encaisser. Je garde son courage, et je laisse le « tout encaisser » à son histoire. Mon prénom m’invite à vivre avec force et avec joie.", lignes: 8 }
          ] },
        { k: 'contrat-geste-feb', titre: "Mon contrat, au quotidien", type: 'texte',
          consigne: "Choisis une phrase de ton contrat avec la vie et un petit geste qui va avec, pour cette semaine. Écris-le, puis note chaque fois que tu l’as fait, même maladroitement, et ce que tu as ressenti. Ce geste rejoint aussi ton carnet « Renaissance ».",
          pourquoi: "Un contrat prend vie quand il se traduit en gestes. Chaque fois que tu agis selon ton propre choix, l’ancien contrat perd de sa force et ton prénom devient un appui.",
          gestes: ["Me présenter avec mon prénom complet", "Demander gentiment qu’on utilise mon vrai prénom", "Signer mes messages de mon prénom", "Faire une chose que je choisis, pour moi seul·e", "Dire mon prénom en me regardant dans le miroir", "Relire mon contrat chaque matin"],
          q: "Ton geste : « Mon contrat dit… Cette semaine, je vais… »",
          ph: "Exemple : mon contrat dit « je m’autorise à choisir mon métier ». Cette semaine, je vais m’inscrire à l’atelier de céramique dont je rêve.",
          journal: { k: 'contrat-essais-feb', n: 6, q: "Chaque fois que tu as fait vivre ton contrat : quand, comment, et qu’as-tu ressenti ?", ph: "Exemple : lundi, je me suis présentée « Jeanne » à la réunion, au lieu de « Jeannette ». J’ai senti mes épaules se redresser." } }
      ],
      conseil: "Si l’ancien surnom ou l’ancienne attente revient, remarque-le, souris, et redis ton prénom intérieurement : chaque retour est une occasion de choisir à nouveau. Changer la façon de porter un prénom prend du temps, pour toi comme pour les autres. Pense à écrire ton prénom en grand sur ton arbre de vie." }
  ],

  meditation: {
    titre: "Le prénom murmuré",
    intro: "Une séance guidée pour entendre ton prénom prononcé avec douceur, saluer celles et ceux qui ont rêvé un chemin pour toi, leur laisser leurs attentes avec respect, et faire de ton prénom pleinement le tien.",
    texte: [
      "Je m’installe confortablement, le dos soutenu, les pieds bien posés. Je ferme les yeux, ou je laisse mon regard se poser doucement devant moi. Je respire profondément, trois fois… Mon corps se pose.",
      "[pause]",
      "J’imagine le jour de ma naissance. La pièce est calme, la lumière douce. Quelqu’un me tient dans ses bras, me regarde pour la première fois, et prononce mon prénom.",
      "J’écoute sa voix. Qui que ce soit, je sens simplement ce qu’elle transmet : de l’amour, un espoir, une fierté, peut-être une mémoire, peut-être une attente. J’accueille tout, tel quel.",
      "[pause]",
      "Derrière cette voix, d’autres visages apparaissent doucement. Celles et ceux qui ont eu ce prénom avant moi, ou qui l’ont inspiré, et celles et ceux qui ont rêvé un chemin pour moi. Certains visages sont connus, d’autres restent dans la lumière.",
      "Je les salue avec respect. Je leur dis intérieurement : « Merci. Je reçois ce que vous m’avez transmis, avec tout votre amour. Je vous laisse vos rêves, et je vis ma propre histoire. » Je les regarde s’éloigner, apaisé·es.",
      "[longue pause]",
      "Maintenant, je prononce moi-même mon prénom, intérieurement. Lentement. J’écoute comme il sonne dans ma voix à moi, celle d’aujourd’hui. Je remarque ce que je ressens en l’entendant : une chaleur, une gêne, une fierté. Tout est bienvenu.",
      "Je le prononce encore, comme si je me présentais à moi-même pour la première fois. Je le sens devenir pleinement le mien. Mon prénom m’a été donné. Ma vie, je la choisis.",
      "[pause]",
      "Il m’accompagne depuis toujours, et il m’accompagne dans tout ce que je vais vivre, comme un chemin ouvert devant moi, que je dessine à ma façon.",
      "Je respire profondément. Je sens mon corps, le sol, le siège sous moi. Je bouge doucement les doigts, les épaules. Et quand je suis prêt·e, j’ouvre les yeux."
    ],
    conseil: "Choisis un moment calme, avec dix minutes pour toi. Si ton prénom est lié à un·e disparu·e et qu’une émotion monte fort, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une voix, un visage, une sensation en prononçant ton prénom…", ph: "Exemple : j’ai entendu la voix de mon père, très douce. En disant mon prénom, j’ai senti une chaleur dans la poitrine." }
  },

  /* Le protocole du mois, cycle 2 « Mon arbre de vie » (version 3) : Explorer, Transformer, Intégrer.
     Affiché en semaine 3 (Libérer), après les exercices. Clé de champ : arbre-note. */
  protocole: {
    titre: "Tronc · Quel projet a-t-on posé sur moi ?",
    intro: "**Objectif :** me réapproprier mon prénom et mon chemin. **Sous-objectif :** découvrir l’histoire de mon prénom, voir les attentes posées sur moi, et écrire mon propre contrat avec la vie. **Intensité douce.**",
    materiel: "Une photo de toi enfant, une enveloppe. Ton carnet, des crayons de couleur, et ton affiche [« Mon arbre de vie »](arbre-de-vie-affiche.html). Le cadre du suivi est dans [le mode d’emploi](mode-emploi-suivi.html).",
    etapes: [
      {
        titre: "**Explorer** · 20 min",
        etapes: [
          "**L’enquête du prénom (10 min).** Qui l’a choisi, pourquoi, d’après qui ? Demande-le à un·e proche si tu le peux. Qui d’autre le porte dans ta famille ? Qu’est-ce que tes parents admiraient ou espéraient en choisissant ce prénom ? Qui ou quoi voulaient-ils honorer à travers toi ? Un prénom choisi par admiration pour un savant, un artiste, un ancêtre, ou pour sa signification spirituelle, porte souvent une attente : Albert, par exemple, choisi par admiration pour un grand savant. Note celle que tu entends, et ce que tu choisis d’en garder. Lien : l’article [« Le prénom transmis »](prenom-transmis-psychogenealogie.html).",
          "**Le jeu d’écoute (5 min).** Dis ton prénom à voix haute et note les mots que tu entends dedans, comme un jeu : Claire (clair), René (re-né), Serge (je sers). Garde ce qui te parle.",
          "**Les attentes (5 min).** L’année de ta naissance : que vivait ta famille ? Qu’espérait-on de toi ? Lien : l’article [« Le projet-sens »](projet-sens-conception-deuil.html)."
        ]
      },
      {
        titre: "**Transformer** · 45 min",
        etapes: [
          "**Ouvrir (3 min).**",
          "**L’ancien contrat (12 min).** Écris le contrat qu’on a posé sur toi : « Contrat de naissance. On attendait de moi que… »",
          "**Mon contrat (10 min).** Écris le tien : « Mon contrat avec la vie. Je choisis… Je m’autorise… ». Signe-le.",
          "**Accueillir l’enfant (10 min).** Ta photo d’enfant devant toi, les yeux ouverts ou fermés. Dis-lui : « Bienvenue. Tu es accueilli·e tel·le que tu es. Tu as ta place. »",
          "**Ranger l’ancien (5 min).** Plie l’ancien contrat dans une enveloppe, écris dessus « À leur histoire », et range-la.",
          "**Respirer (5 min).**"
        ]
      },
      {
        titre: "**Intégrer** · 15 min",
        etapes: [
          "**Apaiser (5 min).**",
          "**Clôture commune (3 min).** Lis à voix haute [le texte de fin de rituel et de réunification intérieure](mode-emploi-suivi.html#cloture).",
          "**Sur mon arbre (7 min).** Ton prénom en grand, et : « Mon prénom m’invite à vivre… »"
        ]
      }
    ],
    questions: [
      {
        k: "arbre-note",
        q: "Ce que j’ai posé sur mon arbre ce mois-ci",
        ph: "Exemple : « Claire » en grand, et « Mon prénom m’invite à vivre en pleine lumière »."
      }
    ]
  },

  lectures: [
    { lien: 'prenom-transmis-psychogenealogie.html', titre: "Le prénom transmis", resume: "Ce qu’un prénom peut porter d’une génération à l’autre : hommage, mémoire, espoir, et la liberté de le faire tien." },
    { lien: 'projet-sens-conception-deuil.html', titre: "Le projet-sens", resume: "Les espoirs et les projets qui entourent l’arrivée d’un enfant, et comment choisir ta propre route." },
    { lien: 'liste-des-valeurs.html', titre: "Trouver tes valeurs", resume: "Une liste de valeurs pour repérer celles qui te ressemblent, et écrire ton propre contrat avec la vie." }
  ],

  lectures: [
    { lien: 'prenom-transmis-psychogenealogie.html', titre: "Le prénom transmis", resume: "Ce qu’un prénom peut porter d’une génération à l’autre : hommage, mémoire, espoir, et la liberté de le faire tien." },
    { lien: 'projet-sens-conception-deuil.html', titre: "Le projet-sens", resume: "Les espoirs et les projets qui entourent l’arrivée d’un enfant, et comment choisir ta propre route." },
    { lien: 'liste-des-valeurs.html', titre: "Trouver tes valeurs", resume: "Une liste de valeurs pour repérer celles qui te ressemblent, et écrire ton propre contrat avec la vie." }
  ],

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-histoire-feb', q: "Qu’as-tu découvert de l’histoire de ton prénom ?", ph: "Exemple : il vient de ma grand-mère Jeanne, et mes parents espéraient que j’aie sa force." },
    { k: 'fin-attentes-feb', q: "Quelles attentes as-tu reconnues, et dans quel tiroir les ranges-tu ?", ph: "Exemple : reprendre la boulangerie. C’est un récit de ma mère, et une attente que je sentais très fort." },
    { k: 'fin-ancien-feb', q: "Qu’as-tu laissé à leur histoire avec l’ancien contrat, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : le « tout encaisser ». Je dis plus facilement ce qui me pèse, et je me sens plus légère." },
    { k: 'fin-contrat-feb', q: "Quelle phrase de ton contrat avec la vie veux-tu garder près de toi ?", ph: "Exemple : « Je choisis mon métier, et je m’autorise à changer d’avis. »" },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer à ta prochaine étape ?", ph: "Exemple : regarder les émotions qui avaient leur place chez nous, et celles qu’on mettait de côté.", court: true }
  ],

  carnet: {
    titre: "M’aimer d’abord",
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Accueillir l’enfant que tu étais, c’est t’aimer d’abord : ton carnet t’aide ce mois-ci à te traiter avec tendresse, à écouter tes besoins, et à t’offrir chaque jour un geste qui te dit que tu comptes. Reporte ton contrat avec la vie dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Mars', titre: "Quelles émotions avaient le droit d’exister ?", texte: "Voir les émotions bienvenues et celles mises de côté dans ta famille, distinguer émotion et sentiment, et écrire à l’une d’elles.", image: 'assets/cartes/faire-semblant-mini.jpg' },
    { mois: 'Avril', titre: "Quelles phrases me guident ?", texte: "Collecter les phrases de ta famille, voir où elles agissent dans ta vie, et les réécrire avec tes propres mots.", image: 'assets/cartes/boucle-spirale-mini.jpg' },
    { mois: 'Mai', titre: "Comment ai-je appris à aimer ?", texte: "Regarder l’amour que tu as appris, ton imago et ton rôle en amour, pour choisir l’amour que tu veux vivre.", image: 'assets/cartes/une-relation-vraie-mini.jpg' }
  ]
};
