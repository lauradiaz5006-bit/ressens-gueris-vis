/* Genesolia · Le Cercle · Mon suivi « Je me libère » de mars 2027 : « Quelles émotions avaient le droit d’exister ? »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-03',
  cle: 'suivi-2027-03',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-03-ea9f0fd173.pdf',
  nomMois: 'mars 2027',
  moisSuivant: 'avril',
  titre: "Quelles émotions avaient le droit d’exister ?",
  sousTitre: "Tronc de ton arbre de vie · Voir les émotions bienvenues et celles mises de côté dans ta famille, distinguer émotion et sentiment, et rendre à chacune sa place en toi.",
  citation: "Une émotion qui a le droit d’exister peut enfin passer.",
  audio: '',
  audioCourt: '',
  saisonLien: "Mars, c’est le mois des giboulées : un grand soleil, puis une averse, puis le soleil encore. Personne ne demande au ciel de choisir entre les deux. Tes émotions ressemblent à ce ciel de mars : elles arrivent, elles passent, et la lumière revient. C’est le bon moment pour regarder lesquelles avaient le droit de traverser ta famille, et laisser les tiennes circuler à nouveau.",
  intensiteQ: "À quel point les émotions que tu gardes pour toi, sans pouvoir les montrer, t’encombrent-elles aujourd’hui ?",
  souhaitPh: "Exemple : cette colère que je ravale au travail, et qui ressort le soir contre mes enfants.",

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-boucle.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/faire-semblant-mini.jpg', "Toutes mes émotions ont le droit d’exister."]
    }
  },

  mots: {
    saison: "Commence par respirer avec le ciel du moment. Soleil ou averse, chaque émotion a le droit de passer.",
    theme: "Lis cette page comme une lettre. Remarque les émotions dans lesquelles tu te reconnais, sans te juger.",
    voir: "Cette semaine, tu observes la météo de tes émotions, chez toi comme dans ta famille. Voir, c’est déjà commencer à accueillir.",
    source: "Les règles d’une famille sur les émotions se transmettent souvent sans un mot. Remonte le fil avec douceur, et prends ton temps.",
    liberer: "Rendre sa place à une émotion ne veut pas dire te laisser déborder. Tu l’écoutes, puis tu choisis ce que tu en fais.",
    remplacer: "Laisser passer une émotion, un petit moment à la fois, suffit cette semaine. Ta voix revient à son rythme.",
    meditation: "Une fois dans le mois, un soir tranquille. Si une émotion monte, reviens à ton souffle : tu peux t’arrêter à tout moment.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Tu as écouté tes émotions, et c’est déjà leur rendre un peu de place."
  },

  theme: {
    titre: "Les émotions qui avaient leur place chez toi",
    texte: [
      "Dans chaque famille, certaines émotions sont bienvenues, d’autres simplement tolérées, d’autres encore mises de côté. Chez certain·es, on rit fort mais on ne pleure jamais devant les autres. Chez d’autres, la colère du père fait trembler la maison, et celle des enfants est interdite. Ces règles se disent rarement : elles se sentent, très tôt, dans un regard, un silence, une porte qui claque.",
      "Tu continues le **tronc** de ton arbre de vie : tu comprends ce que tu portes. Après la peur héritée et le projet posé sur toi, tu regardes ce mois-ci les émotions qui avaient le droit d’exister dans ta famille, et celles qu’on a appris à cacher. Le but : rendre à chacune sa place, pour que ta voix retrouve toutes ses couleurs."
    ],
    sousTitre: "Bienvenues, tolérées, mises de côté",
    texte2: [
      "En psychogénéalogie, on observe que les émotions se transmettent autant que les histoires. Une arrière-grand-mère qui a dû tenir seule pendant la guerre a peut-être appris à ne jamais montrer sa tristesse. Sa fille a grandi en entendant « on ne pleure pas pour si peu », et sa petite-fille, aujourd’hui, sourit quand elle a envie de crier. Une émotion mise de côté ne disparaît pas : elle se déguise. La colère devient fatigue, la tristesse devient agacement, la peur devient besoin de tout contrôler.",
      "Pour les reconnaître, souviens-toi : une **émotion** est une vague courte, dans le corps, ici et maintenant ; un **sentiment** s’installe dans la durée, nourri par les pensées et l’histoire. Une émotion retenue longtemps peut devenir un sentiment : une colère ravalée devient rancœur, une tristesse cachée devient nostalgie. Pour aller plus loin : [émotion ou sentiment](emotion-ou-sentiment.html), [la roue des émotions](roue-des-emotions.html) pour trouver le mot juste, et [les cinq éléments et les émotions](cinq-elements-emotions.html), une lecture symbolique de chacune.",
      "Ce mois-ci, tu vas **voir** la météo émotionnelle de ta famille et la tienne, **remonter** à la règle qui a appris à chacun·e quoi montrer et quoi cacher, **rendre** sa place à trois émotions mises de côté, et **laisser passer** une émotion au quotidien. Au moment où la vague monte, tu retrouves aussi le protocole en 60 secondes de ta formation."
    ],
    exemplesTitre: "À quoi ressemble une émotion mise de côté, au quotidien",
    exemples: [
      "**La colère qui devient sourire** : ton collègue présente ton travail comme le sien en réunion, tu souris, et le soir tu claques les placards sans savoir pourquoi.",
      "**Les larmes retenues** : au cinéma, Camille sent les larmes monter et serre la mâchoire. Chez elle, on disait « arrête ton cinéma ».",
      "**La joie qui se fait discrète** : tu décroches le poste dont tu rêvais, et ta première pensée est de ne pas trop le dire, « pour ne pas faire de jaloux ».",
      "**La peur qu’on cache** : Karim ne dit jamais qu’il a peur. Chez lui, un garçon devait être fort. Alors il vérifie tout, tout le temps, et dort mal la veille de chaque rendez-vous important.",
      "**La tristesse qui dérange** : quand ta fille pleure, tu sens monter une gêne immense, et tu dis très vite « allez, ce n’est rien »."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Ta sœur annule encore le déjeuner à la dernière minute. La boucle aurait répondu « pas de souci ! », puis ruminé toute la soirée. La spirale respire, sent la colère passer dans le ventre, et répond : « Je suis déçue, et un peu fâchée. On fixe une autre date ? » L’émotion a eu sa place, et le lien aussi.",
    question: { k: 'theme-emo', q: "En une phrase, quelle émotion as-tu le plus de mal à montrer aujourd’hui, et devant qui ?", ph: "Exemple : la colère, surtout devant mes parents. Je deviens toute gentille et je me tais." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "La météo de tes émotions",
      intro: "Cette semaine, tu poses sur la table les émotions de ta famille et les tiennes. Tu ne cherches pas encore à changer : tu regardes lesquelles étaient bienvenues, lesquelles étaient tolérées, et lesquelles on mettait de côté, et ce que tu en fais aujourd’hui en pilote automatique.",
      texte: "Commence par le tableau des émotions permises et interdites chez vous, au calme, une vingtaine de minutes. Puis, pendant la semaine, observe les émotions qui montent en toi, et ce que tu en fais dans les secondes qui suivent.",
      exercices: [
        { k: 'ex1-emo', titre: "Les émotions permises et interdites chez nous", type: 'tableau', rangs: 4,
          etiquettes: ['La colère', 'La tristesse', 'La peur', 'La joie'],
          consigne: "Pour chacune de ces quatre émotions, donne la météo de ta famille quand tu étais enfant : soleil (bienvenue), nuage (tolérée) ou orage (mise de côté). Note qui l’exprimait et comment on réagissait, puis ce que tu en fais toi, aujourd’hui. Tu peux penser à la famille qui t’a élevé·e, et regarder aussi du côté de tes grands-parents si tu les as connus.",
          pourquoi: "Quand on pose les quatre émotions côte à côte, la règle de la famille apparaît souvent d’un coup : une émotion réservée à une seule personne, une autre que personne ne montrait, une troisième qu’on transformait en blague. La voir, c’est comprendre que ta façon de ressentir ne vient pas seulement de toi.",
          colonnes: [
            { q: "Quelle météo chez toi, enfant : soleil, nuage ou orage ?", ph: ["Exemple : orage. Seul mon père avait le droit de se fâcher.", "Exemple : nuage. On pouvait être triste, mais dans sa chambre.", "Exemple : orage. « Tu n’as pas à avoir peur, tu es grand. »", "Exemple : soleil, sauf quand ma mère était fatiguée."] },
            { q: "Qui l’exprimait, et comment réagissait-on ?", ph: ["Exemple : mon père criait, tout le monde se taisait. Ma mère, jamais.", "Exemple : ma grand-mère pleurait en cachette à la cuisine. On faisait semblant de ne rien voir.", "Exemple : personne. Ma mère disait « on ne va pas s’inquiéter pour rien ».", "Exemple : mon oncle Bruno, qui faisait rire tout le monde aux repas."] },
            { q: "Et toi aujourd’hui, que fais-tu de cette émotion ?", ph: ["Exemple : je souris et je dis oui, puis j’ai mal au ventre.", "Exemple : je pleure seule sous la douche.", "Exemple : je fais comme si tout allait bien, et je prépare tout trois fois.", "Exemple : je ris facilement, sauf quand je réussis quelque chose."] }
          ],
          apres: { k: 'ex1-emo-repete', q: "Relis ton tableau. Quelle émotion était la plus mise de côté chez vous, et la retrouves-tu dans ta vie d’adulte ?", ph: "Exemple : la colère. Personne n’avait le droit sauf mon père, et aujourd’hui encore je la transforme en fatigue." } },
        { k: 'voir-journal-emo', titre: "Mon journal des émotions", type: 'texte',
          consigne: "Chaque fois qu’une émotion monte en toi cette semaine (une contrariété, une envie de pleurer, une inquiétude, un élan de joie), note-la, et ce que tu en as fait : la montrer, la cacher, la transformer, la laisser passer. Vise au moins trois moments. Si le mot juste ne vient pas, ouvre [la roue des émotions](roue-des-emotions.html).",
          pourquoi: "Une émotion mise de côté se referme en quelques secondes, souvent avant même qu’on l’ait reconnue. La remarquer au moment où elle monte, c’est lui laisser un peu de place, et te laisser un peu de liberté.",
          q: "Ce que tu remarques, en général, sur ce que tu fais de tes émotions",
          ph: "Exemple : dès que je sens de la tristesse, je me lève et je range quelque chose. Je ne reste jamais avec elle plus de deux secondes.",
          journal: { k: 'voir-sit-emo', n: 6, q: "Chaque moment : le jour, l’émotion, ce qui l’a fait monter, ce que tu en as fait", ph: "Exemple : jeudi, mon chef a critiqué mon dossier devant tout le monde. Colère. J’ai souri, et j’ai mangé un paquet de biscuits en rentrant." } }
      ],
      conseil: "Si un souvenir difficile remonte en remplissant le tableau, avance doucement : tu peux remplir seulement ce qui te semble possible aujourd’hui. Pose le stylo, respire, et reprends un autre jour. Il n’y a pas de bonne ou de mauvaise émotion, seulement des émotions qui ont eu, ou non, le droit de passer." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "D’où vient la règle",
      intro: "Une règle sur les émotions ne s’écrit nulle part : elle s’apprend en regardant les adultes, souvent avant même de savoir parler. Cette semaine, tu remontes le fil, avec douceur, pour voir qui exprimait quoi, et ce qui arrivait quand un enfant pleurait, se fâchait ou avait peur.",
      texte: [
        "Les émotions mises de côté touchent souvent les deux cycles. Le **cycle de la racine** parle de sécurité : garder sa place, ne pas être rejeté·e, rester à l’abri. Une règle de la racine ressemble à « si je montre ma colère, je risque ma place » ou « si j’ai peur, personne ne viendra ». Le **cycle du cœur** parle de lien : être aimé·e, ne pas déranger, garder l’affection des siens. Une règle du cœur ressemble à « si je suis triste, je dérange » ou « si je suis trop joyeuse, on va me trouver prétentieuse ».",
        "Les deux se mêlent. On commence par la racine : quand une émotion semble menacer ta place, tout ton corps apprend à la retenir. Comprendre que cette règle protégeait l’enfant que tu étais permet de la regarder sans honte, et de voir qu’aujourd’hui, tu peux en choisir une autre."
      ],
      exercices: [
        { k: 'source-arbre-emo', titre: "Dans ta famille, regarde les émotions", type: 'questions',
          consigne: "Prends ces questions une par une, avec ton tableau de la semaine dernière à côté de toi. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en regardant une vieille photo ou en parlant avec un proche.",
          pourquoi: "Souvent, on découvre qu’un parent a lui-même appris à cacher la même émotion, parce que dans sa propre enfance elle était dangereuse ou mal reçue. Le voir change tout : ce n’est plus « je suis comme ça », c’est une règle reçue, que tu peux regarder et assouplir.",
          choix: { k: 'cycle-emo', q: "Aujourd’hui, l’émotion que tu retiens le plus touche surtout…", options: ['La racine : si je la montre, je risque ma place', 'Le cœur : si je la montre, je dérange ou je déçois', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-exprimait-emo', q: "Dans ta famille, qui avait le droit d’exprimer quoi ?", ph: "Exemple : mon père, la colère. Ma mère, l’inquiétude. Les enfants, la joie, à condition de ne pas faire de bruit." },
            { k: 'source-pleurer-emo', q: "Que se passait-il quand tu pleurais, enfant ?", ph: "Exemple : ma mère disait « arrête, tu vas me faire pleurer aussi ». J’ai appris à pleurer en silence." },
            { k: 'source-colere-emo', q: "Que se passait-il quand tu te fâchais ?", ph: "Exemple : on m’envoyait dans ma chambre « jusqu’à ce que tu sois calmée ». Personne ne venait me demander pourquoi." },
            { k: 'source-peur-emo', q: "Et quand tu avais peur, ou que tu étais très joyeux·se ?", ph: "Exemple : ma peur faisait rire mon frère. Ma joie, on me disait de la garder pour moi, « pour ne pas faire de peine à ta cousine »." },
            { k: 'source-phrase-emo', q: "Quelle phrase entendais-tu souvent au sujet des émotions ?", ph: "Exemple : « On ne pleure pas pour si peu. » Ou : « Ne fais pas cette tête devant les invités. »" },
            { k: 'source-lignee-emo', q: "Qu’ont traversé tes parents ou tes grands-parents qui a pu rendre cette émotion difficile à vivre ?", ph: "Exemple : ma grand-mère a perdu son mari jeune et a élevé seule quatre enfants. Elle disait : « Si je m’étais mise à pleurer, je ne me serais jamais arrêtée. »" }
          ] },
        { k: 'source-question-emo', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un parent ou un proche sur la façon dont on vivait les émotions chez lui ou chez elle, enfant. Par téléphone, à table ou par message. Choisis une question ouverte et légère. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui-emo', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma mère : « Chez tes parents, est-ce qu’on avait le droit de se mettre en colère ? »", court: true },
            { k: 'source-reponse-emo', q: "Qu’as-tu appris ? Qu’est-ce qui résonne avec ta propre façon de ressentir ?", ph: "Exemple : elle m’a dit que son père ne supportait aucun cri à table. Elle a ri en disant « alors on boudait ». Je boude encore, moi aussi, au lieu de dire.", lignes: 3 }
          ] }
      ],
      conseil: "Tu peux noter dans [ton arbre familial](genosociogramme.html), à côté de chaque personne, l’émotion qu’elle montrait le plus et celle qu’elle gardait pour elle : des répétitions apparaissent souvent d’une génération à l’autre. Pour comprendre ce qui se passe dans le corps quand une émotion monte puis redescend : [émotions et hormones](emotions-et-hormones.html)." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "Rendre sa place à chaque émotion",
      intro: "Chaque émotion mise de côté t’a protégé·e, et t’a aussi coûté. Cette semaine, tu en regardes trois en face, tu choisis ce que tu veux en faire, puis tu vis ton protocole du mois : la lettre à une émotion. Le petit rituel des quatre bols t’aide, avant ou après, à redonner à chacune sa place.",
      exercices: [
        { k: 'ex2-emo', titre: "Mes émotions mises de côté", type: 'blocs', nb: 3,
          etiquettes: ['Première émotion', 'Deuxième émotion', 'Troisième émotion'],
          consigne: "Choisis trois émotions ou sentiments que tu as appris à cacher, à retenir ou à transformer : la colère, la tristesse, la peur, la joie, la jalousie, la fierté… Pour chacune, écris ce qu’elle protégeait, ce qu’elle t’a coûté, et ce que tu choisis aujourd’hui. Rien n’est définitif.",
          pourquoi: "Mettre une émotion de côté n’était pas une erreur : c’était souvent la meilleure façon de garder ta place ou l’amour des tiens. Reconnaître ce qu’elle protégeait permet de remercier cette stratégie au lieu de te le reprocher, puis de choisir librement une autre façon de faire.",
          astuce: "Rendre sa place à une émotion, ce n’est pas l’exprimer à n’importe qui, n’importe comment. C’est d’abord la reconnaître en toi, puis choisir le bon moment et la bonne personne pour la dire.",
          champs: [
            { q: "Quelle émotion as-tu appris à mettre de côté ?", ph: ["Exemple : la colère", "Exemple : la tristesse", "Exemple : la fierté"] },
            { q: "Que protégeait-elle, peut-être ?", ph: ["Exemple : la paix à la maison, quand mon père criait déjà assez pour tout le monde", "Exemple : ma mère, qui était déjà si fatiguée", "Exemple : ma place parmi mes cousins, pour qu’on ne me trouve pas prétentieuse"] },
            { q: "Que t’a-t-elle coûté ?", ph: ["Exemple : je dis oui à tout, et je suis épuisée", "Exemple : je me sens seule quand ça ne va pas", "Exemple : je minimise tout ce que je réussis"] },
            { q: "Que choisis-tu aujourd’hui ?", ph: ["Exemple : je m’autorise à dire « ça ne me convient pas », calmement", "Exemple : j’appelle une amie quand je suis triste", "Exemple : je raconte une réussite par semaine à quelqu’un qui m’aime"] }
          ] }
      ],
      rituel: {
        titre: "Les quatre bols",
        intro: "Ce petit rituel symbolique te permet de voir chaque émotion à sa place, de la laisser se mélanger à l’eau puis passer, comme une averse qui traverse le ciel. Fais-le une fois cette semaine, dans un moment calme. Compte une quinzaine de minutes.",
        materiel: "Quatre bols ou quatre verres transparents remplis d’eau claire, et quatre couleurs : quelques gouttes d’encre, d’aquarelle ou de colorant alimentaire. Si tu veux, inspire-toi des [cinq éléments](cinq-elements-emotions.html) : le vert du bois pour la colère, le bleu profond de l’eau pour la peur, le gris argenté du métal pour la tristesse, le rouge du feu pour la joie. Ton carnet et un stylo.",
        etapes: [
          "Pose les quatre bols devant toi, en ligne. Respire trois fois profondément, et regarde l’eau claire.",
          "Pour chaque bol, nomme une émotion à voix haute ou intérieurement : la colère, la tristesse, la peur, la joie. Verse une goutte de sa couleur, et dis : « Tu as ta place chez moi. »",
          "Regarde la couleur se déployer dans l’eau, lentement, à sa façon. Elle bouge, elle s’étend, elle se mélange : c’est ce que fait une émotion quand on la laisse vivre.",
          "Approche-toi du bol de l’émotion que ta famille mettait le plus de côté. Pose tes mains autour, et dis : « Je t’écoute. Qu’est-ce que tu viens me dire ? » Laisse venir un mot, une image, une sensation.",
          "Verse doucement les quatre bols, ensemble, au pied d’une plante ou dans la terre du jardin. Dis : « Vous pouvez passer. Je garde votre message. »",
          "Rince les bols à l’eau claire, et note ce qui est venu ci-dessous."
        ],
        note: { k: 'rituel-note-emo', q: "Après le rituel, note ce qui s’est passé : ce que tu as ressenti en nommant chaque émotion, et ce que t’a dit celle que tu as écoutée.", ph: "Exemple : en versant le vert de la colère, j’ai eu envie de rire, comme si c’était interdit. Elle m’a dit : « Je suis là pour te protéger, pas pour faire du mal. »" }
      },
      conseil: "Écouter une émotion longtemps retenue peut faire monter des larmes, de la colère ou un grand fou rire. C’est normal : elle reprend sa place. Fais une pause, bois un verre d’eau, sors marcher. Tu peux vivre le rituel et le protocole en deux fois." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: "Laisser passer une émotion",
      intro: "Tu as vu la météo de ta famille, tu sais d’où vient la règle, tu as rendu à tes émotions leur place. Cette semaine, tu choisis une émotion à laisser vivre, tu écris ta phrase de permission, et tu poses chaque jour un petit geste pour la laisser passer.",
      texte: [
        "**La première pause.** Quand tu sens une émotion monter et le vieux réflexe arriver (sourire, te taire, ranger, changer de sujet), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis-toi : « Je te reconnais. Tu as le droit d’être là. Je t’écoute, et je choisis ce que j’en fais. »",
        "**Le geste qui laisse passer.** Une émotion accueillie dure souvent quelques minutes, comme une averse. Un petit geste suffit pour la laisser traverser : la nommer, souffler, bouger, en parler. Les personnes autour de toi peuvent être surprises de t’entendre dire ce que tu ressens : laisse-leur le temps de s’habituer."
      ],
      exercices: [
        { k: 'permission-emo', titre: "Ma phrase de permission émotionnelle", type: 'questions',
          consigne: "Choisis l’émotion que tu veux autoriser en premier, celle qui a été la plus mise de côté chez toi. Puis écris ta phrase de permission, au présent, avec tes mots : « J’ai le droit de… » ou « Ma … a sa place ». Relis-la chaque matin cette semaine, à voix haute si tu peux.",
          pourquoi: "Une règle familiale s’est installée avec des phrases répétées. Une phrase de permission, choisie par toi et répétée chaque jour, commence à dessiner une nouvelle règle, la tienne.",
          questions: [
            { k: 'permission-choix-emo', q: "Quelle émotion choisis-tu d’autoriser en premier ?", ph: "Exemple : la tristesse", court: true },
            { k: 'permission-texte-emo', q: "Ta phrase de permission, au présent, avec tes mots", ph: "Exemple : « J’ai le droit d’être triste, et de le dire à quelqu’un qui m’aime. Ma tristesse ne dérange personne : elle me montre ce qui compte. »", lignes: 3 }
          ] },
        { k: 'ex3-emo', titre: "Je laisse passer une émotion", type: 'texte',
          consigne: "Choisis un geste simple pour laisser passer une émotion quand elle monte, et pose-le au moins une fois par jour cette semaine. Écris-le, puis note chaque essai, même maladroit, et ce qui a changé. Ce geste rejoint ton carnet « J’avance » : quand tes émotions ont le droit de passer, ta voix retrouve sa confiance.",
          pourquoi: "Une émotion qu’on laisse passer redescend souvent d’elle-même, en quelques minutes. Chaque essai montre à ton corps qu’il peut ressentir sans danger, et à tes proches qu’une autre façon de vivre les émotions est possible.",
          gestes: ["Nommer à voix haute ce que je ressens : « Là, je suis fâchée »", "Souffler fort trois fois, ou secouer les mains", "Laisser couler des larmes, sans m’excuser", "Dire « ça me rend triste » au lieu de « ce n’est rien »", "Marcher dix minutes quand la colère monte", "Partager une joie avec quelqu’un, tout de suite, sans la minimiser"],
          q: "Ton geste : « La prochaine fois qu’une émotion monte, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de sourire et de dire « pas de souci », je vais respirer et dire « je suis déçue, j’ai besoin d’un moment ».",
          journal: { k: 'ex3-essais-emo', n: 6, q: "Chaque fois que tu l’as essayé : quand, quelle émotion, et qu’est-ce qui a changé ?", ph: "Exemple : mardi, j’ai dit à mon conjoint « ce que tu viens de dire m’a blessée ». Ma voix tremblait. Il s’est excusé, et la soirée a été douce." } }
      ],
      conseil: "Si le vieux réflexe revient et que tu caches encore une émotion, remarque-le après coup, sans te juger : c’est déjà un pas. Tu peux même revenir vers la personne le lendemain et dire « hier, j’étais en colère, et je ne l’ai pas dit ». Une émotion reconnue tard reste une émotion reconnue." }
  ],

  meditation: {
    titre: "L’eau qui se remet à couler",
    intro: "Une séance guidée pour laisser les émotions longtemps retenues reprendre leur place, comme une eau qui se remet à couler, et retrouver ta voix.",
    texte: [
      "Je m’installe confortablement, le dos soutenu, les pieds bien posés. Je ferme les yeux, ou je laisse mon regard se poser doucement devant moi. Je respire profondément, trois fois… Mon corps se pose.",
      "[pause]",
      "Je sens mon corps sur le siège, mes pieds sur le sol. Je suis en sécurité, ici et maintenant. À chaque instant, je peux revenir à mon souffle.",
      "J’imagine un ruisseau de montagne, au petit matin. L’air est frais, la lumière douce. Par endroits, l’eau est encore prise dans la glace, immobile et silencieuse, comme une émotion gardée longtemps à l’intérieur.",
      "Je m’approche. Sous la glace, j’entends un tout petit bruit : l’eau est là, vivante, elle attend son moment. Un rayon de soleil touche la surface, et la glace commence doucement à fondre.",
      "[pause]",
      "Goutte après goutte, l’eau se remet à couler. Avec elle, une émotion remonte peut-être en moi : une colère ancienne, une tristesse, une peur, une joie restée discrète. Je l’accueille telle qu’elle est. Je remarque où elle se pose dans mon corps : la gorge, la poitrine, le ventre, les mains.",
      "Je lui dis intérieurement : « Je te vois. Tu as le droit d’exister. Tu as ta place chez moi. » Je la laisse circuler, comme l’eau du ruisseau qui trouve son chemin entre les pierres.",
      "[longue pause]",
      "L’eau coule de mieux en mieux. Elle chante sur les pierres. Chaque émotion arrive, traverse, et repart vers la vallée. Je reste sur la rive, calme et présent·e, et je regarde passer ce qui passe.",
      "Ma gorge s’ouvre doucement. Ma voix revient, claire, à moi. Je me répète : « Toutes mes émotions ont le droit d’exister. Je les écoute, et je choisis ma direction. »",
      "[pause]",
      "Je respire profondément. Je sens mon corps, le sol, le siège sous moi. Je bouge doucement les doigts, les épaules. Et quand je suis prêt·e, j’ouvre les yeux."
    ],
    conseil: "Choisis un moment calme, avec dix minutes pour toi. Si une émotion monte fort, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note-emo', q: "Qu’est-ce qui t’est venu pendant la séance ? La glace, l’eau qui coule, une émotion, une sensation dans la voix…", ph: "Exemple : la glace était dans ma gorge. Quand l’eau s’est remise à couler, j’ai eu envie de pleurer, puis j’ai respiré très large." }
  },

  /* Le protocole du mois, cycle 2 « Mon arbre de vie » (version 3) : Explorer, Transformer, Intégrer.
     Affiché en semaine 3 (Libérer), après les exercices. Clé de champ : arbre-note. */
  protocole: {
    titre: "Tronc · Quelles émotions avaient le droit d’exister ?",
    intro: [
      "**Objectif :** libérer une émotion ou un sentiment installé depuis longtemps. **Sous-objectif :** distinguer émotion et sentiment, voir les émotions permises chez moi, et écrire à l’une d’elles. **Intensité moyenne.** Lettre (3 sur 4), gardée dans une enveloppe.",
      "**À lire avant :** une émotion est souvent une vague courte, dans le corps, ici et maintenant (colère, tristesse, peur, joie). Un sentiment s’installe plutôt dans la durée, nourri par les pensées et l’histoire (rancœur, culpabilité, honte, nostalgie). Une émotion gardée longtemps peut devenir un sentiment. Lien : l’article [« Émotion ou sentiment »](emotion-ou-sentiment.html)."
    ],
    materiel: "Une enveloppe. Ton carnet, des crayons de couleur, et ton affiche [« Mon arbre de vie »](arbre-de-vie-affiche.html). Le cadre du suivi est dans [le mode d’emploi](mode-emploi-suivi.html).",
    etapes: [
      {
        titre: "**Explorer** · 20 min",
        etapes: [
          "**La météo de ma famille (10 min).** Pour la colère, la tristesse, la peur et la joie : soleil (bienvenue), nuage (tolérée), orage (mise de côté). Qui l’exprimait ?",
          "**Ce qui est installé en moi (10 min).** 3 émotions ou sentiments présents depuis longtemps : depuis quand, dans quelle situation."
        ]
      },
      {
        titre: "**Transformer** · 45 min",
        etapes: [
          "**Ouvrir (3 min).**",
          "**La lettre (25 min).** À une émotion ou à un sentiment, le plus ancien : « Chère colère (ou chère tristesse, chère honte…), tu es là depuis… Tu es venue chaque fois que… Tu voulais me protéger de… Je te remercie. Aujourd’hui, je te laisse partir, et à ta place j’accueille… ». Pour finir : la colère, « le calme et ma juste force » ; la tristesse, « la douceur et la joie » ; la peur, « la confiance et la sécurité » ; la honte, « la fierté d’être moi » ; la culpabilité, « la paix et le droit de vivre ma vie ».",
          "**Un geste confortable (7 min).** Choisis : souffler fort, marcher, laisser couler des larmes, rire, danser, ou continuer à écrire.",
          "**L’enveloppe (7 min).** Plie ta lettre dans une enveloppe, écris dessus « Ce que je laisse partir », et range-la. À la fin du mois, tu choisis de la garder ou de la déchirer.",
          "**Respirer (3 min).**"
        ]
      },
      {
        titre: "**Intégrer** · 15 min",
        etapes: [
          "**Clôture commune (3 min).** Lis à voix haute [le texte de fin de rituel et de réunification intérieure](mode-emploi-suivi.html#cloture).",
          "**Mon journal de 7 soirs (5 min, puis 1 min par soir).** « Aujourd’hui, j’ai ressenti… et je l’ai laissé passer. »",
          "**Sur mon arbre (7 min).** Une couleur pour chaque émotion sur le tronc. Refais ta roue de la vie : 6 mois de chemin."
        ]
      }
    ],
    questions: [
      {
        k: "arbre-note",
        q: "Ce que j’ai posé sur mon arbre ce mois-ci",
        ph: "Exemple : du rouge doux pour la colère, du bleu pour la tristesse, du jaune pour la joie qui revient."
      }
    ]
  },

  bilanTitre: "Ce que ce mois a remis en mouvement",
  bilan: [
    { k: 'fin-emotion', q: "Quelle émotion mise de côté as-tu repérée ce mois-ci, chez toi ou dans ta famille ?", ph: "Exemple : la colère. Chez nous, seul mon père avait le droit de se fâcher." },
    { k: 'fin-regle-emo', q: "Qu’as-tu compris de la règle qui l’entourait, et de ce qu’elle protégeait ?", ph: "Exemple : ma mère se taisait pour éviter les disputes. Je me taisais aussi, pour garder ma place." },
    { k: 'fin-libere-emo', q: "Qu’as-tu laissé partir, avec ta lettre ou tes quatre bols, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : la honte de pleurer. J’ai pleuré devant une amie, et elle m’a prise dans ses bras. Je me sens plus vraie." },
    { k: 'fin-permission-emo', q: "Quelle phrase de permission veux-tu garder près de toi ?", ph: "Exemple : « J’ai le droit d’être en colère, et de le dire calmement. »" },
    { k: 'fin-intention-emo', q: "Qu’aimerais-tu continuer à libérer à ta prochaine étape ?", ph: "Exemple : écouter les phrases qu’on répétait chez nous, comme « on ne pleure pas pour si peu », et les réécrire avec mes mots.", court: true }
  ],

  carnet: {
    titre: "Ma direction, ma confiance",
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Une émotion qui a le droit d’exister devient une boussole : ta colère montre une limite, ta tristesse ce qui compte pour toi, ta peur ce qui demande à être protégé, ta joie la direction qui te fait du bien. Ton carnet t’aide ce mois-ci à écouter cette direction, à te souvenir de tes forces et à oser une phrase d’affirmation chaque semaine, avec ta voix à toi. Reporte ta phrase de permission dans ton carnet, elle devient un appui."
  },

  aVenir: [
    { mois: 'Avril', titre: "Quelles phrases me guident ?", texte: "Collecter les phrases de ta famille, voir où elles agissent dans ta vie, et les réécrire avec tes propres mots.", image: 'assets/cartes/boucle-spirale-mini.jpg' },
    { mois: 'Mai', titre: "Comment ai-je appris à aimer ?", texte: "Regarder ce que tu as reçu de ta mère et des femmes de ta lignée, garder le meilleur et faire autrement.", image: 'assets/cartes/ma-mere-mini.jpg' },
    { mois: 'Juin', titre: "Ai-je le droit d’aller plus loin ?", texte: "Regarder ce que tu as reçu de ton père et des hommes de ta lignée, et trouver ta propre façon d’avancer.", image: 'assets/cartes/deux-parents-mini.jpg' }
  ]
};
