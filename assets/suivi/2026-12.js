/* Genesolia · Le Cercle · Mon suivi « Je me libère » de décembre 2026 : « Les fêtes et les places à table »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2026-12',
  cle: 'suivi-2026-12',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2026-12-ce7016469f.pdf',
  nomMois: 'décembre 2026',
  moisSuivant: 'janvier',
  titre: 'Les fêtes et les places à table',
  sousTitre: "Observer qui s'assoit où, honorer les absent·es, et trouver ta juste place au cœur des fêtes.",
  citation: "Autour de la table, chaque chaise raconte une histoire.",
  audio: '',
  audioCourt: '',
  saisonLien: "Décembre porte la nuit la plus longue de l'année, puis, au solstice, la lumière commence à revenir, minute après minute. C'est souvent un mois chargé, et c'est normal de ne pas être à fond : la nature, elle, se repose. Ce mois-ci, tu n'as pas besoin de tout réparer avant les fêtes. Tu peux simplement observer la table, faire une place aux absent·es, et garder une petite lumière pour toi.",
  intensiteQ: "À quel point les fêtes de famille et les places de chacun·e pèsent-elles sur toi aujourd’hui ?",
  souhaitPh: "Exemple : ce rôle de celle ou celui qui organise tout et n’a jamais le temps de s’asseoir.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-etoiles.webp',
      theme: 'assets/guide/guide-cadeau.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
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
    saison: "Commence par respirer avec la saison. Décembre est long et lumineux à la fois : prends-le à ton rythme.",
    theme: "Lis cette page comme une lettre. Pense à une table de fête de ton enfance, et laisse venir les visages.",
    voir: "Cette semaine, tu dessines la table. Tu observes, comme un·e invité·e curieux·se, sans juger personne.",
    source: "Les rôles se transmettent souvent sans un mot. Pose tes questions avec légèreté, entre deux préparatifs.",
    liberer: "Faire une place aux absent·es, ce n’est pas rendre la fête triste. C’est lui permettre de respirer.",
    remplacer: "Un petit déplacement suffit : une autre chaise, une tâche confiée, un mot différent.",
    meditation: "Un soir avant les fêtes, ou juste après. Si une émotion monte, reviens à ton souffle et à tes pieds sur le sol.",
    bilan: "Prends ce moment même si les fêtes ont tout bousculé. Chaque place choisie compte."
  },

  theme: {
    titre: 'La table des fêtes, miroir de la famille',
    texte: [
      "Décembre rassemble les familles. On dresse la table, on sort la vaisselle des grands jours, on prépare les plats d'autrefois, on retrouve des visages qu'on voit peu le reste de l'année. Ces moments sont souvent pleins de chaleur, de rires et de souvenirs, et parfois de tensions qui reviennent, presque à l'identique, chaque année. Les fêtes sont un miroir de la famille : qui reçoit, qui cuisine, qui découpe, qui se tait, qui manque.",
      "Sur l'année, ton suivi traverse trois temps : **Voir** (d'octobre à décembre), **Traverser** (de janvier à juin) et **Transmettre** (de juillet à octobre). Décembre clôt le premier temps. Après avoir vu ce qui revient et honoré tes ancêtres, tu regardes la scène où tout se rejoue en un seul soir : la table de fête. Avec curiosité plutôt qu'avec reproche, pour comprendre la place que tu occupes, et celle que tu as envie de prendre."
    ],
    sousTitre: 'Les places, les rôles et les chaises vides',
    texte2: [
      "En psychogénéalogie, on observe que les familles rejouent souvent les mêmes scènes d'une génération à l'autre. Le repas de fête en concentre beaucoup : les places habituelles, les sujets qu'on évite, les rôles que chacun·e endosse sans y penser. Dans certaines familles, le bout de table revient toujours au fils aîné, comme autrefois au grand-père. Dans d'autres, une fille reprend la cuisine de sa mère sans que personne le lui ait demandé.",
      "Il y a la personne qui organise tout, celle qui apaise les disputes, celle qui provoque, celle qu'on n'écoute pas, celle qui fait rire pour détendre l'atmosphère. Ces rôles ont souvent été transmis. Ils t'ont peut-être appris de belles choses, mais ils ne disent pas tout de qui tu es.",
      "Et puis il y a les chaises vides : un grand-parent disparu, un frère fâché, une tante partie vivre loin, un enfant dont on ne parle plus. Leur absence se glisse dans un silence au moment de trinquer, dans une recette que plus personne n'ose préparer. Reconnaître ces absences permet de vivre la fête plus librement. Ce mois-ci, tu vas **observer** la table, **remonter** à l'origine des rôles, **honorer** les absent·es, et **choisir** ta place. Pour aller plus loin : [la méthode des deux cycles](methode.html)."
    ],
    exemplesTitre: 'À quoi ressemblent les places à table, au quotidien',
    exemples: [
      "**Celle ou celui qui sert** : tu passes le repas debout, entre la cuisine et la table. Quand tu t’assois enfin, tout le monde en est au café.",
      "**Celle ou celui qui apaise** : dès que le ton monte entre ton père et ton frère, tu changes de sujet ou tu fais une blague. Tu rentres épuisé·e.",
      "**La place qui ne bouge pas** : ta grand-mère est partie il y a cinq ans, et personne ne s’assoit sur sa chaise, sans que personne n’en ait jamais parlé.",
      "**Le sujet interdit** : chaque année, on évite de parler de l’oncle qui ne vient plus. Son prénom ne se prononce pas, mais tout le monde y pense.",
      "**Le rôle d’enfant** : tu as 40 ans, et tu es encore assis·e à « la table des petits », ou on te coupe la parole comme lorsque tu avais 10 ans."
    ],
    exempleSpirale: "La spirale, c’est la même fête, un cran plus haut. Chaque année, tu fais le service toute la soirée, comme ta mère avant toi. Cette année, tu préviens : « Je fais l’entrée, et ensuite je m’assois. » Au moment du plat, tu restes assis·e, tu respires, ta sœur se lève. Le rôle est toujours là, mais tu n’es plus obligé·e de le porter seul·e.",
    question: { k: 'theme-table', q: "Quand tu penses à la table des fêtes de ta famille, quelle image te vient en premier ?", ph: "Exemple : ma grand-mère en bout de table, qui surveille tout, et moi qui débarrasse sans qu’on me le demande." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'Le plan de table',
      intro: "Cette semaine, tu dessines la table. Tu te souviens d’un repas de fête, tu places chacun·e, tu nommes les rôles. Tu ne cherches pas encore à changer quoi que ce soit : tu observes la scène de l’extérieur.",
      texte: "Commence par le plan de table, au calme, une vingtaine de minutes. Puis, pendant les préparatifs des fêtes autour de toi, remarque qui organise, qui décide, qui s’efface, et note-le dans ton journal.",
      exercices: [
        { k: 'ex1', titre: 'Le plan de table', type: 'tableau', rangs: 5,
          etiquettes: ['Une première personne', 'Une deuxième personne', 'Une troisième personne', 'Une quatrième personne', 'Moi, à cette table'],
          consigne: "Souviens-toi d'un repas de fête de ton enfance, ou de l'an dernier. Note chaque personne présente, la place où elle s'assoit et le rôle qu'elle tient : celle qui sert, celle qui raconte, celle qui se tait. N'oublie pas de t'inscrire toi aussi, sur la dernière ligne.",
          pourquoi: "Quand on pose la table sur le papier, on voit soudain ce qui était invisible : qui est près de qui, qui est au bout, qui est toujours debout. Ces places racontent l’histoire de la famille, et souvent celle des générations d’avant.",
          colonnes: [
            { q: "Qui est cette personne ?", ph: ["Exemple : mon grand-père Robert", "Exemple : ma mère", "Exemple : mon oncle Thierry", "Exemple : ma cousine Léa", "Exemple : moi, à 12 ans"] },
            { q: "Où s’assoit-elle, à cette table ?", ph: ["Exemple : en bout de table, face à la porte", "Exemple : au plus près de la cuisine, elle se lève sans arrêt", "Exemple : à côté de mon grand-père, à sa droite", "Exemple : à la petite table, avec les enfants", "Exemple : entre ma mère et ma tante, en face de l’horloge"] },
            { q: "Quel rôle tient-elle pendant le repas ?", ph: ["Exemple : il découpe la viande et décide quand on passe au dessert", "Exemple : elle sert, surveille, ne mange presque pas", "Exemple : il provoque, il lance les sujets qui fâchent", "Exemple : elle fait rire tout le monde quand ça se tend", "Exemple : je me tais, j’aide à débarrasser, je me fais oublier"] }
          ],
          apres: { k: 'ex1-scene', q: "Regarde ta table. Qu’est-ce qui te frappe : une place, un rôle, une absence, quelque chose qui se répète ?", ph: "Exemple : ce sont toujours les femmes qui sont près de la cuisine, et moi, j’ai pris exactement la place de ma mère." } },
        { k: 'voir-journal', titre: 'Mon journal des préparatifs', type: 'texte',
          consigne: "Cette semaine, observe les préparatifs autour de toi : qui organise, qui décide du menu, qui appelle, qui s’efface, qui râle. Note chaque jour une scène, en quelques mots, et ce que tu as fait, toi. Vise au moins trois scènes.",
          pourquoi: "Les rôles se mettent en place bien avant le repas : au téléphone, dans les courses, dans les messages du groupe familial. Les repérer à l’avance, c’est avoir un temps d’avance sur le jour de la fête.",
          q: "Ce que tu remarques, en général, dans la façon dont ta famille prépare les fêtes",
          ph: "Exemple : c’est toujours ma mère qui décide, et c’est toujours moi qui l’appelle pour proposer mon aide, sans qu’elle me la demande.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque scène : le jour, qui a fait quoi, ce que tu as fait, ce que tu as ressenti", ph: "Exemple : lundi, ma sœur a écrit « on fait comme d’habitude ? ». J’ai répondu oui tout de suite, et j’ai soupiré." } }
      ],
      conseil: "Pas besoin de changer quoi que ce soit cette semaine : voir suffit. Si le souvenir d’un repas est douloureux, choisis-en un autre, plus doux, ou arrête-toi et reprends un autre jour." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'D’où viennent les places',
      intro: "Les places à table ne sont jamais tout à fait le fruit du hasard. Cette semaine, tu remontes le fil : qui tenait ce rôle avant toi, depuis quand, et pourquoi.",
      texte: [
        "Les rôles de famille touchent souvent l'un de deux besoins. Le **cycle de la racine** parle de sécurité et de place : qui a le droit de s'asseoir, de prendre la parole, d'avoir sa part. Celle ou celui qui se tient toujours debout a peut-être appris, très tôt, que sa place n'était pas acquise. Le **cycle du cœur** parle de lien : qui apaise pour que l'on reste ensemble, qui fait rire pour éviter la dispute, qui se tait pour ne pas perdre l'amour des autres.",
        "Beaucoup de rôles ont été utiles, à une époque. Dans une famille qui avait connu la guerre ou le manque, tenir la cuisine, c'était nourrir et protéger. Dans une famille où l'on se fâchait vite, faire rire, c'était garder tout le monde à table. Reconnaître l'origine d'un rôle permet de le remercier, puis de choisir si tu veux encore le porter."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Autour de la table, regarde', type: 'questions',
          consigne: "Prends ces questions une par une, avec ton plan de table à côté de toi. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être pendant un repas, en écoutant les conversations.",
          pourquoi: "En regardant qui tenait la même place avant, on découvre souvent qu’un rôle a traversé deux ou trois générations. Ce n’est plus « mon caractère », c’est une place transmise, que je peux regarder et choisir.",
          choix: { k: 'cycle', q: "Aujourd'hui, la place que tu tiens à table touche surtout…", options: ['La racine : avoir ma place, ma part, le droit d’exister', 'Le cœur : garder le lien, éviter les disputes, être aimé·e', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-preside', q: "Qui préside la table, et depuis quand ?", ph: "Exemple : mon père, depuis la mort de mon grand-père. Avant, c’était lui, et encore avant, son propre père." },
            { k: 'source-enfant', q: "Quelle place occupais-tu enfant, et laquelle occupes-tu aujourd’hui ?", ph: "Exemple : enfant, j’étais à côté de ma mère pour l’aider. Aujourd’hui, je suis toujours à côté de la cuisine." },
            { k: 'source-manque', q: "Qui manque à la table des fêtes, et depuis quand ?", ph: "Exemple : mon oncle Jacques, fâché avec mon père depuis l’héritage de 2009." },
            { k: 'source-sujet', q: "Quel sujet évite-t-on chaque année, et que se passe-t-il si quelqu’un l’aborde ?", ph: "Exemple : la maison de famille vendue. Si quelqu’un en parle, ma mère quitte la table." },
            { k: 'source-role', q: "Quel rôle reprends-tu sans l’avoir choisi, et qui le tenait avant toi ?", ph: "Exemple : celui qui apaise. Ma grand-mère le tenait, puis ma mère, et maintenant moi." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Pendant les préparatifs ou à table, pose une seule question à un membre de ta famille sur les fêtes d’autrefois : comment c’était, qui faisait quoi, qui était là. Les questions sur les souvenirs heureux ouvrent souvent les portes plus facilement. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma grand-tante : « Quand tu étais petite, qui faisait la cuisine pour les fêtes ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris, et qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a raconté que son père mettait toujours une assiette de plus « pour le pauvre qui passe ». J’ai compris pourquoi on cuisine toujours trop chez nous.", lignes: 3 }
          ] }
      ],
      conseil: "Note dans [ton arbre familial](genosociogramme.html) les absent·es des fêtes et les dates qui tombent en décembre : ta page « Ton mois » te les rappellera. Si une question réveille une tension, n’insiste pas : change de sujet avec douceur, la porte restera ouverte." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Faire une place aux absent·es',
      intro: "Cette semaine, tu fais une place à celles et ceux qui manquent, et tu écris à ta propre place. Reconnaître les absent·es allège la fête ; remercier ton rôle te permet de le poser.",
      exercices: [
        { k: 'ex2', titre: 'Les absent·es de la fête', type: 'blocs', nb: 3,
          etiquettes: ['Une première personne qui manque', 'Une deuxième personne', 'Une troisième personne'],
          consigne: "Choisis trois personnes qui manquent à la table : disparues, éloignées, fâchées, ou jamais connues. Pour chacune, écris ce que sa présence apportait, ou aurait apporté, puis un geste simple pour lui faire une place cette année : une pensée, une recette, un prénom prononcé.",
          pourquoi: "Les absent·es dont on ne parle pas pèsent sur la fête sans qu’on le sache. Leur faire une petite place, consciemment, libère souvent l’atmosphère : on peut être triste un instant, puis rire de nouveau.",
          astuce: "Un geste très simple suffit. Il n’est pas nécessaire d’en parler à toute la famille : une pensée en allumant une bougie, un plat préparé en son honneur, c’est déjà beaucoup.",
          champs: [
            { q: "Qui manque à la table ?", ph: ["Exemple : mon grand-père Robert, parti il y a trois ans", "Exemple : mon frère, qui vit à l’étranger", "Exemple : la sœur de ma mère, fâchée depuis dix ans"] },
            { q: "Qu’est-ce que sa présence apportait, ou aurait apporté ?", ph: ["Exemple : ses histoires de jeunesse, et son rire au dessert", "Exemple : de la légèreté, il faisait danser tout le monde", "Exemple : je ne sais pas, je l’ai si peu connue, peut-être une douceur"] },
            { q: "Comment veux-tu lui faire une place cette année ?", ph: ["Exemple : refaire son pain d’épices et raconter une de ses histoires", "Exemple : lui envoyer une photo de la table et l’appeler pendant le dessert", "Exemple : penser à elle en silence au moment de trinquer"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à ma place', type: 'questions',
          consigne: "Écris une lettre à la place que tu occupes dans ta famille pendant les fêtes. Commence par « Chère place que j’occupe à table… ». Dis-lui ce qu’elle t’a appris, ce qu’elle te coûte parfois, et ce que tu veux garder. Termine par la place que tu choisis de prendre, à ta façon.",
          pourquoi: "On ne quitte pas un rôle en le rejetant, mais en le remerciant. Écrire à ta place, c’est reconnaître ce qu’elle t’a donné, et te donner le droit d’en essayer une autre.",
          questions: [
            { k: 'lettre-a', q: "Quelle place, ou quel rôle, choisis-tu de remercier ?", ph: "Exemple : ma place de celle qui sert tout le monde", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que cette place t’a appris, ce qu’elle te coûte, ce que tu gardes, la place que tu choisis", ph: "Exemple : Chère place près de la cuisine, tu m’as appris à veiller sur les autres, à savoir recevoir, à être utile. Mais tu me coûtes mes soirées, je ne mange jamais chaud. Je garde le plaisir de cuisiner. Cette année, je choisis de m’asseoir au milieu, et de laisser les autres servir le plat.", lignes: 8 }
          ] }
      ],
      rituel: {
        titre: 'La chaise des absent·es',
        intro: "Ce rituel symbolique fait une place aux personnes qui manquent, avant ou pendant les fêtes. Fais-le seul·e, dans un moment calme. Il dure environ dix minutes.",
        materiel: "Une chaise, une bougie, un stylo. Si tu le souhaites, une photo ou un objet qui rappelle une personne absente.",
        etapes: [
          "Place une chaise vide face à toi. Si tu as une photo ou un objet, pose-le sur la chaise.",
          "Allume la bougie et dis : « Je fais une place à celles et ceux qui manquent. »",
          "Nomme chaque absent·e, une par une, et dis : « Tu fais partie de notre famille. »",
          "Puis dis : « Je prends ma place, et je te laisse la tienne. »",
          "Reste quelques minutes en silence, et accueille ce qui vient. Si une émotion devient trop forte, pose les mains sur ton ventre et respire lentement.",
          "Éteins la bougie (ne la laisse jamais sans surveillance), remets la chaise à sa place, et note ce qui est venu, ci-dessous."
        ],
        note: { k: 'rituel-note', q: "Comment s’est passé ton rituel ? Quels noms sont venus, et qu’as-tu ressenti ?", ph: "Exemple : j’ai nommé papi Robert et ma tante. Pour ma tante, j’ai senti de la colère, puis une tristesse. Après, j’ai eu envie de lui envoyer une carte." }
      },
      conseil: "Si la lettre ou le rituel réveille une émotion forte, fais une pause, bois un verre d’eau, sors marcher dans l’air froid. Tu peux finir un autre jour. Faire une place aux absent·es ne t’oblige à rien : ni à pardonner, ni à reprendre contact." },

    { cle: 'remplacer', nom: 'Choisir', etape: 'Remplacer', titre: 'Ta juste place, à ta façon',
      intro: "Tu as observé la table, compris d’où viennent les rôles, fait une place aux absent·es. Cette semaine, pendant un repas de fête, tu prends consciemment une place ou un rôle différent, même tout petit.",
      texte: [
        "**La première pause.** Au moment où tu sens le vieux rôle t’attraper (te lever pour servir, faire une blague pour apaiser, te taire), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Puis dis intérieurement : « Je te reconnais. Merci. Ce soir, je peux faire autrement. »",
        "**Le petit déplacement.** Changer de place ne veut pas dire faire une révolution. Une autre chaise, une tâche confiée, une phrase dite au lieu d’être tue : un seul déplacement suffit pour que toute la table bouge un peu. Et après les fêtes, prends un moment pour accueillir ce qui s’est passé, le doux comme le plus difficile."
      ],
      exercices: [
        { k: 'ex3', titre: 'Le déplacement', type: 'texte',
          consigne: "Choisis ton déplacement pour les fêtes : une place, un rôle, un geste différent. Écris-le, puis note chaque fois que tu l’as essayé, même maladroitement, et ce qui a changé. Ce déplacement devient aussi une limite posée dans ton carnet « J’avance ».",
          pourquoi: "Une famille est un équilibre : quand une personne bouge, même un peu, les autres s’ajustent. Ton petit déplacement ouvre une possibilité pour toi, et parfois pour toute la table.",
          gestes: ["M’asseoir à une autre place", "Rester assis·e pendant le plat principal", "Confier le service à quelqu’un d’autre", "Prononcer le prénom d’un·e absent·e au moment de trinquer", "Ne pas désamorcer une tension qui n’est pas la mienne", "Partir à l’heure que j’ai choisie"],
          q: "Ton déplacement : « Pendant les fêtes, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de me lever chaque fois qu’il manque quelque chose, je vais rester assis·e et dire « tu peux aller le chercher ? ».",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as essayé : quand, et qu’est-ce qui a changé ?", ph: "Exemple : le 24, je suis resté·e assis·e. Mon neveu s’est levé pour servir, et ma mère m’a souri." } },
        { k: 'remplacer-accueil', titre: 'Accueillir les fêtes passées', type: 'questions',
          consigne: "Après les fêtes, repense à ces jours avec douceur. Note un moment de joie, et un moment plus difficile, sans te juger ni juger les autres.",
          questions: [
            { k: 'accueil-joie', q: "Quel moment de joie veux-tu garder de ces fêtes ?", ph: "Exemple : le fou rire avec ma cousine pendant la vaisselle, et la balade du 26 au soleil.", lignes: 2 },
            { k: 'accueil-dur', q: "Quel moment a été plus difficile, et qu’est-ce qu’il t’apprend sur ta place ?", ph: "Exemple : quand mon père m’a coupé la parole. J’ai compris que j’ai encore besoin d’être écouté·e comme un·e adulte, et que je peux le dire.", lignes: 3 }
          ] }
      ],
      conseil: "Si le vieux rôle t’a rattrapé·e malgré tout, ce n’est pas raté : tu l’as vu, et c’est déjà un pas. Les fêtes sont le moment le plus difficile de l’année pour changer de place. La prochaine fois, tu le sentiras venir un peu plus tôt." }
  ],

  meditation: {
    titre: 'La table de lumière',
    intro: "Une séance guidée pour voir ta famille s’installer autour d’une grande table, saluer les absent·es avec douceur, et choisir la place où tu te sens bien.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois. Laisse ton corps se poser.",
      "[pause]",
      "Imagine une grande table dressée dans une pièce chaleureuse. Une lumière douce éclaire la nappe, les assiettes, les verres. Il y a une odeur de plat qui mijote, peut-être une recette de ton enfance. Dehors, il fait froid et nuit noire. Ici, il fait bon.",
      "Peu à peu, les membres de ta famille arrivent et s'installent. Observe qui vient en premier, qui reste debout, qui s'assoit sans hésiter. Remarque où chacun·e prend place, et ce que tu ressens en les voyant.",
      "[pause]",
      "Remarque aussi les chaises vides. Tu sais peut-être qui devrait s'y trouver : une grand-mère, un oncle, un enfant qu'on n'a pas connu. Salue ces absent·es avec douceur. Tu peux leur dire intérieurement : « Je pense à toi. Tu fais partie de nous. »",
      "Maintenant, cherche ta place. Peut-être est-ce celle que tu occupes toujours. Peut-être une autre t'attire, plus près de quelqu'un, ou plus près de la fenêtre. Prends le temps de choisir.",
      "[longue pause]",
      "Assieds-toi là où tu te sens bien. Sens le soutien de la chaise, ton dos droit, tes pieds sur le sol. Respire. Personne ne te demande de jouer un rôle.",
      "Regarde la table depuis cette place. Tu n'as rien à prouver, rien à réparer. Tu es là, simplement, à ta juste place, au milieu des tiens. Au centre de la table, une bougie brille : c'est la lumière qui revient, au cœur de la nuit la plus longue.",
      "[pause]",
      "Garde cette image en toi. Pendant les fêtes, tu pourras la retrouver d'une seule respiration, même au milieu du bruit.",
      "Respire profondément. Sens ton corps, le sol, le siège sous toi. Bouge doucement les doigts, les épaules. Quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais cette séance avant les fêtes pour te préparer, ou juste après pour te retrouver. Si une chaise vide te serre le cœur trop fort, ouvre les yeux, pose les pieds bien à plat et respire : tu peux t’arrêter là et reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Une place choisie, un visage, une chaise vide, une sensation…", ph: "Exemple : je me suis assis·e près de la fenêtre, loin de la cuisine. J’ai vu la chaise de mon grand-père, et j’ai souri." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-retiens', q: "Que retiens-tu de ce mois passé à observer la table des fêtes ?", ph: "Exemple : que ma place près de la cuisine vient de ma grand-mère, et que je ne suis pas obligé·e de la garder." },
    { k: 'fin-role', q: "Quel rôle laisses-tu de côté, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : celui qui apaise toutes les disputes. Je me sens plus léger·e, même si c’est encore inconfortable." },
    { k: 'fin-absents', q: "Quelle place as-tu faite aux absent·es, et qu’est-ce que ça a changé ?", ph: "Exemple : j’ai refait le pain d’épices de papi. Tout le monde a parlé de lui en riant." },
    { k: 'fin-choisie', q: "Quelle place choisis-tu de prendre, désormais ?", ph: "Exemple : une place assise, au milieu des miens, où je mange chaud et où l’on m’écoute." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en janvier ?", ph: "Exemple : découvrir l’histoire de mon prénom, et continuer à prendre ma place.", court: true }
  ],

  carnet: {
    titre: 'Ma place, mes limites',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Dans ton carnet, tu repères tes oui qui te coûtent et tu protèges ton énergie : reporte ton déplacement des fêtes, il devient une limite posée."
  },

  aVenir: [
    { mois: 'Janvier', titre: 'Ton prénom, ton héritage', texte: "Découvrir l’histoire de ton prénom, ce qu’il porte de ta lignée, et en faire pleinement le tien.", image: 'assets/guide/guide-transmission.webp' },
    { mois: 'Février', titre: 'Le couple et les schémas amoureux', texte: "Voir ce qui se rejoue dans ta façon d’aimer, d’où ça vient, et choisir une relation vraie.", image: 'assets/cartes/une-relation-vraie-mini.jpg' },
    { mois: 'Mars', titre: 'Ta place dans la fratrie', texte: "Regarder la place que tu as reçue parmi tes frères et sœurs, et choisir celle que tu veux habiter aujourd’hui.", image: 'assets/cartes/ma-place-mini.jpg' }
  ]
};
