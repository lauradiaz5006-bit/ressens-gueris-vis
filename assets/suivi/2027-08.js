/* Genesolia · Le Cercle · Mon suivi « Je me libère » d'août 2027 : « Racines, départs et lieux »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-08',
  cle: 'suivi-2027-08',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-08-57387072e5.pdf',
  nomMois: 'août 2027',
  moisSuivant: 'septembre',
  titre: 'Racines, départs et lieux',
  sousTitre: "Retrouver les lieux de ta famille, regarder les départs et les exils, et sentir où tu te sens chez toi.",
  citation: "Chaque lieu de ta lignée garde un morceau de ton histoire.",
  audio: '',
  audioCourt: '',
  saisonLien: "Août, c’est la lumière dorée des greniers qui se remplissent. La moisson est rentrée, on ouvre les maisons de famille, on retrouve des malles, des photos, des odeurs de pierre chaude. C’est le bon moment pour regarder les lieux de ta lignée, ceux qu’on a gardés et ceux qu’on a quittés, et pour engranger ce qu’ils t’ont transmis de beau.",
  intensiteQ: "À quel point la question des lieux, des départs ou du « chez-moi » pèse-t-elle dans ta vie aujourd’hui ?",
  souhaitPh: "Exemple : cette impression d’être de passage partout, comme si je n’avais pas le droit de m’installer.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/montagne.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-transmission.webp',
      voir: 'assets/guide/guide-coffret.webp',
      source: 'assets/guide/guide-repete.webp',
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
    saison: "Respire avec l’été. Ce mois-ci, tu voyages dans les lieux de ta lignée sans bouger de chez toi.",
    theme: "Lis cette page comme une carte postale venue de loin. Laisse remonter les noms de lieux, les paysages, les accents.",
    voir: "Cette semaine, tu dessines la carte de ta famille. Une case vide est aussi une information.",
    source: "Les départs ont souvent été vécus en silence. Pose tes questions avec douceur, et accueille aussi les « je ne sais pas ».",
    liberer: "Tu peux garder l’amour d’un lieu sans porter sa nostalgie. Ce que tu rends, tu le poses avec respect.",
    remplacer: "Habiter ta vie, ça commence par un coin, un geste, une plante. Petit, mais à toi.",
    meditation: "Un soir d’été, au calme. Si une émotion monte en pensant à un départ, reviens simplement à ton souffle et à tes pieds sur le sol.",
    bilan: "Regarde le chemin parcouru, de lieu en lieu. Tu montes encore d’un cran sur la spirale."
  },

  theme: {
    titre: 'Le mois des lieux',
    texte: [
      "Août est souvent le mois des retours : la maison de famille qu’on rouvre, le village des grands-parents, la région d’où l’on vient, la langue qu’on y entend encore. Pour d’autres, c’est un mois de voyage, loin de tout lieu d’origine, ou un mois où l’on reste seul·e en ville pendant que les autres partent.",
      "Ce mois-ci, tu regardes les lieux de ta lignée : ceux où l’on est né·e, ceux qu’on a quittés, ceux où l’on s’est installé, parfois sans le choisir. Et tu te demandes, simplement, où tu te sens vraiment chez toi aujourd’hui, et pourquoi. Tu es dans le troisième temps de l’année du Cercle, **Transmettre** : après avoir vu, puis traversé, tu choisis ce que tu gardes et ce que tu fais passer à ton tour."
    ],
    sousTitre: 'Partir, rester, revenir',
    texte2: [
      "On observe souvent que les lieux portent la mémoire des familles. Une ferme vendue après un décès, un pays quitté dans l’urgence, une maison perdue pendant une guerre : ces histoires se transmettent, même quand on n’en parle pas. On les retrouve dans une nostalgie sans objet, un attachement très fort à un paysage, une difficulté à s’installer, ou au contraire une peur de bouger.",
      "Derrière chaque départ, il y a une raison : la guerre, la pauvreté, l’amour, le travail, l’espoir d’une vie meilleure. Celles et ceux qui sont partis ont souvent laissé une partie d’eux-mêmes derrière eux : une langue, une cuisine, des frères et sœurs, une tombe qu’on ne visite plus. Celles et ceux qui sont restés ont parfois porté la maison comme une promesse. Reconnaître ces chemins permet d’habiter ta propre vie plus librement : tu peux garder le lien avec un lieu d’origine sans t’y sentir obligé·e, et choisir aussi tes propres racines. Pour aller plus loin : [la méthode des deux cycles](methode.html).",
      "Ce mois-ci, tu vas **voir** la carte des lieux de ta lignée, **remonter** aux départs qui l’ont dessinée, **libérer** la nostalgie qui ne t’appartient pas, et **poser** un geste pour habiter ta vie là où tu es."
    ],
    exemplesTitre: 'À quoi ressemble l’écho d’un lieu, au quotidien',
    exemples: [
      "**Toujours entre deux valises** : tu déménages tous les trois ans, et chaque fois tu laisses quelques cartons fermés, comme tes grands-parents qui ont dû repartir plusieurs fois.",
      "**La maison qu’on n’ose pas vendre** : la maison de famille coûte cher, personne n’y va plus, mais la vendre semblerait trahir ceux qui l’ont construite.",
      "**Une nostalgie sans adresse** : un accent, une chanson, une odeur d’épices te serrent le cœur, alors que tu n’as jamais vécu dans ce pays.",
      "**La culpabilité de partir** : tu es le premier ou la première à quitter le village depuis des générations, et chaque appel du dimanche te rappelle que tu es loin.",
      "**La peur de bouger** : une belle proposition ailleurs t’attire, et tu la refuses sans savoir pourquoi, comme si partir était dangereux."
    ],
    exempleSpirale: "La spirale, c’est la même envie, un cran plus haut. Tu as toujours vécu avec des cartons fermés au fond du placard, comme ta grand-mère arrivée d’Italie qui gardait sa valise sous le lit. Ce mois-ci, tu ouvres les cartons, tu accroches une photo de son village au mur, et tu dis : « Je garde ton courage, et moi, je m’installe. » Le thème du départ est toujours là, mais tu as choisi ta place.",
    question: { k: 'theme-lieu', q: "En une phrase, quel lieu de ta lignée te parle le plus aujourd’hui, et pourquoi ?", ph: "Exemple : le village de mon grand-père en Bretagne. Je n’y suis allé·e qu’une fois, et pourtant je m’y suis senti·e chez moi." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: 'La carte de ta lignée',
      intro: "Cette semaine, tu poses sur la table les lieux de ta famille : villages, villes, pays, maisons. Tu ne cherches pas encore à comprendre : tu dessines la carte, et tu remarques ce qu’elle te fait.",
      texte: "Commence par la carte des lieux, au calme, une vingtaine de minutes, avec des photos si tu en as. Puis, chaque fois qu’un lieu te touche dans la semaine, une rue, un paysage, une odeur, une conversation, note-le dans ton journal.",
      exercices: [
        { k: 'lieux', titre: 'La carte des lieux', type: 'tableau', rangs: 5,
          etiquettes: ['Le lieu de mes arrière-grands-parents', 'Le lieu de mes grands-parents', 'Le lieu de mon enfance', 'Un lieu quitté ou perdu', 'Le lieu où je vis aujourd’hui'],
          consigne: "Pour chacun de ces cinq lieux, note de quel endroit il s’agit, qui y a vécu et à quelle époque si tu le sais, puis ce que ce lieu évoque pour toi : une odeur, une image, une émotion, ou rien du tout. Si tu ne sais pas, écris « je ne sais pas » : une case vide montre ce qu’on ne t’a pas raconté.",
          pourquoi: "Quand on écrit les lieux de sa lignée l’un sous l’autre, on voit apparaître le chemin de la famille : les départs, les arrivées, les endroits où l’on est resté longtemps. Et l’on remarque souvent qu’un lieu inconnu nous émeut plus qu’un lieu où l’on a grandi.",
          colonnes: [
            { q: "Quel est ce lieu ?", ph: ["Exemple : un village près de Naples, en Italie", "Exemple : une ferme dans le Cantal", "Exemple : un appartement dans une cité de Lyon", "Exemple : la maison de ma grand-mère, vendue en 2009", "Exemple : un deux-pièces à Nantes, depuis quatre ans"] },
            { q: "Qui y a vécu, et à quelle époque ?", ph: ["Exemple : mon arrière-grand-père Luigi, jusqu’en 1923", "Exemple : mes grands-parents paternels, jusqu’aux années soixante", "Exemple : mes parents, mon frère et moi, jusqu’à mes 15 ans", "Exemple : ma grand-mère, toute sa vie, et nous l’été", "Exemple : moi, seul·e, puis avec mon compagnon"] },
            { q: "Qu’évoque ce lieu pour toi ?", ph: ["Exemple : rien de précis, mais une chaleur quand j’entends parler italien", "Exemple : l’odeur du foin, et des silences à table", "Exemple : la cage d’escalier qui résonne, les copains en bas", "Exemple : une tristesse que je n’ai jamais vraiment dite", "Exemple : un endroit agréable, mais où je ne me sens pas tout à fait installé·e"] }
          ],
          apres: { k: 'lieux-repete', q: "Relis tes cinq lignes. Qu’est-ce qui se répète ou te surprend : des départs, un attachement, une émotion, un vide ?", ph: "Exemple : chaque génération est partie de son lieu de naissance, et personne n’a gardé de maison. Je comprends mieux mes cartons jamais vidés." } },
        { k: 'voir-lieux', titre: 'Les lieux qui me touchent', type: 'texte',
          consigne: "Cette semaine, remarque les lieux qui te touchent, ceux qui te rappellent ta famille, ou qui réveillent une envie de partir ou de rester. Note-les le jour même : le lieu, ce que tu as ressenti, la personne ou l’histoire qui t’est revenue. Vise au moins trois moments.",
          pourquoi: "Un lieu agit souvent avant qu’on comprenne pourquoi : un pincement en passant devant une gare, une paix soudaine au bord d’un champ. Repérer ces moments, c’est entendre ce que ta mémoire familiale te murmure.",
          q: "Ce que tu remarques, en général, quand un lieu te touche",
          ph: "Exemple : ce sont toujours les gares et les ports qui me serrent la gorge, et les jardins potagers qui m’apaisent.",
          journal: { k: 'voir-lieu', n: 6, q: "Chaque moment : le jour, le lieu, ce que tu as ressenti, ce qui t’est revenu", ph: "Exemple : mardi, à la gare, en voyant une famille avec de grosses valises. Gorge serrée. J’ai pensé à mon grand-père arrivé d’Algérie." } }
      ],
      conseil: "Si tu connais peu de lieux, c’est normal : beaucoup de familles ont perdu cette mémoire en chemin. Note ce que tu sais, même un nom de région, et laisse le reste ouvert. Tu peux aussi regarder de vieilles photos : le décor en dit souvent long." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: 'Les départs de ta lignée',
      intro: "Une carte de famille est dessinée par les départs : migrations, exils, déménagements, maisons quittées. Cette semaine, tu remontes le fil de ces départs, avec douceur, pour comprendre ce qu’ils ont laissé en toi.",
      texte: [
        "Les lieux touchent d’abord le **cycle de la racine** : la sécurité, le toit, le droit d’avoir une place et de s’y installer. Quand une famille a dû partir dans l’urgence, perdre une maison ou recommencer ailleurs, ses descendant·es peuvent garder un sentiment d’être de passage, ou un besoin très fort de tout contrôler pour ne plus jamais manquer de toit.",
        "Les lieux touchent aussi le **cycle du cœur** : ceux qu’on a laissés derrière soi, la langue qu’on n’a plus parlée, les frères et sœurs restés au pays. Partir par amour, rester par loyauté, revenir pour une personne : les lieux sont souvent liés à des liens. On commence en général par la racine : tant qu’on ne se sent pas en sécurité quelque part, il est difficile de s’y attacher librement."
      ],
      exercices: [
        { k: 'source-arbre', titre: 'Dans ton arbre, regarde', type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en regardant une photo ou en écoutant une conversation.",
          pourquoi: "Souvent, on découvre qu’une envie de partir ou une peur de bouger a déjà été vécue par quelqu’un avant nous. Le voir change tout : ce n’est plus « mon instabilité », c’est une histoire de famille que je peux regarder.",
          choix: { k: 'cycle', q: "Aujourd’hui, la question des lieux touche surtout…", options: ['La racine : ma sécurité, mon toit, ma place', 'Le cœur : les liens laissés ou gardés à travers les lieux', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-nes', q: "Où sont nés tes grands-parents et tes arrière-grands-parents, si tu le sais ?", ph: "Exemple : ma grand-mère à Oran, mon grand-père dans un village des Vosges. Pour les arrière-grands-parents, je ne sais pas." },
            { k: 'source-parti', q: "Qui est parti de son pays ou de sa région, et pourquoi ?", ph: "Exemple : mon arrière-grand-père a quitté la Pologne en 1930 pour travailler dans les mines du Nord." },
            { k: 'source-maison', q: "Y a-t-il une maison de famille, vendue, perdue ou gardée ? Qu’en dit-on chez vous ?", ph: "Exemple : la maison de Normandie, gardée par ma tante. On en parle comme d’un trésor, mais personne n’y va plus." },
            { k: 'source-demenage', q: "Combien de fois as-tu déménagé dans ta vie, et qu’as-tu ressenti à chaque fois ?", ph: "Exemple : huit fois. Toujours un soulagement de partir, puis la sensation de ne jamais vraiment arriver." },
            { k: 'source-protege', q: "Ta façon de vivre les lieux, partir souvent ou ne jamais bouger, t’a-t-elle protégé·e à un moment ? De quoi ?", ph: "Exemple : partir vite m’évitait de m’attacher et d’avoir mal en quittant, comme mon père qui changeait de ville à chaque crise." }
          ] },
        { k: 'source-question', titre: 'Une question à ta famille', type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur les lieux et les départs : d’où venaient vos aïeux, pourquoi ils sont partis, ce qu’ils ont laissé. Par téléphone, à table, pendant une visite d’été. Note sa réponse, même si elle te paraît sans importance. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à mon oncle : « Pourquoi papi a-t-il quitté le Portugal ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : il est parti à 17 ans, à pied, sans dire au revoir à sa mère. Je comprends mieux pourquoi on ne parle jamais du pays chez nous.", lignes: 3 }
          ] }
      ],
      conseil: "Certains départs ont été douloureux, et en parler peut réveiller beaucoup d’émotions, chez toi ou chez la personne que tu interroges. Si c’est trop, arrête-toi, respire, bois un verre d’eau, et reprends un autre jour. Tu peux aussi placer ces lieux dans [ton arbre familial](genosociogramme.html), et lire [la guerre et la mémoire familiale](guerre-et-memoire-familiale.html) si ta famille a connu un exil." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: 'Rendre la nostalgie, garder les racines',
      intro: "Celles et ceux qui sont partis ont parfois laissé derrière eux une nostalgie, une culpabilité, une peur, que leurs descendant·es portent encore. Cette semaine, tu regardes trois départs de ta famille, tu écris à un lieu, et tu rends symboliquement ce qui ne t’appartient pas.",
      exercices: [
        { k: 'departs', titre: 'Les grands départs', type: 'blocs', nb: 3,
          etiquettes: ['Premier départ', 'Deuxième départ', 'Troisième départ'],
          consigne: "Choisis trois départs de ta famille : une migration, un exil, un déménagement, une maison quittée, et pourquoi pas le tien. Écris ce que tu sais des circonstances, même peu. Puis note ce que tu reconnais en toi : un goût du voyage, un besoin de racines, une force pour recommencer, une peur.",
          pourquoi: "Chaque départ transmet à la fois un poids et une force. Les écrire côte à côte permet de séparer les deux : la nostalgie que tu peux rendre, et le courage que tu peux garder.",
          astuce: "Pour chaque départ, cherche aussi ce qu’il t’a donné de beau. Si ta grand-mère a tout recommencé à 30 ans dans un pays inconnu, toi aussi tu sais recommencer.",
          champs: [
            { q: "Qui est parti, et d’où ?", ph: ["Exemple : mon arrière-grand-mère, de son village d’Arménie", "Exemple : mes parents, de la ferme familiale vers la ville", "Exemple : moi, de ma ville natale à 19 ans"] },
            { q: "Que sais-tu de ce départ ?", ph: ["Exemple : elle est partie très jeune, seule, et n’a jamais revu sa famille", "Exemple : il n’y avait plus assez de travail, mon grand-père ne leur a jamais pardonné", "Exemple : je suis parti·e pour mes études, ma mère a pleuré pendant des semaines"] },
            { q: "Qu’est-ce que ce départ te transmet ?", ph: ["Exemple : une force pour recommencer, et une peur de tout perdre", "Exemple : la culpabilité de partir, et le goût de la liberté", "Exemple : l’habitude de ne jamais me sentir tout à fait chez moi"] }
          ] },
        { k: 'liberer-lettre', titre: 'La lettre à un lieu', type: 'questions',
          consigne: "Choisis un lieu de ta lignée, que tu le connaisses ou non : une maison, un village, un pays. Écris-lui une lettre que tu n’enverras pas. Dis ce que tu sais de lui, ce que tu imagines, ce que tu aurais aimé y vivre. Remercie-le pour ce qu’il a donné à ta famille, rends-lui la nostalgie qui ne t’appartient pas, et termine par ce que tu emportes de lui là où tu vis aujourd’hui.",
          pourquoi: "On ne se libère pas d’un lieu en l’oubliant, mais en lui donnant sa juste place. Lui écrire permet de garder l’amour et la mémoire, et de laisser le poids là où il est né.",
          questions: [
            { k: 'lettre-lieu', q: "À quel lieu écris-tu ?", ph: "Exemple : à la maison de ma grand-mère, à Saint-Flour", court: true },
            { k: 'lettre-lieu-texte', q: "Ta lettre : « Cher lieu de mes ancêtres… » Ce que tu sais, ce que tu imagines, ce que tu remercies, ce que tu rends, ce que tu emportes", ph: "Exemple : Chère maison de Saint-Flour, tu as abrité quatre générations. Je me souviens de ton escalier qui craque et des confitures de mamie. Merci d’avoir été un refuge. Je te rends la tristesse de ta vente, elle appartient à ceux qui t’ont quittée. J’emporte ta chaleur, et je la mets dans ma cuisine, à Nantes.", lignes: 7 }
          ] }
      ],
      rituel: {
        titre: 'La poignée de terre',
        intro: "Ce rituel symbolique relie les lieux de ta lignée à celui où tu vis. Fais-le une fois cette semaine, après ta lettre. Il dure environ dix minutes, dehors ou près d’une fenêtre ouverte.",
        materiel: "Un petit pot ou un bol, un peu de terre (du jardin, d’un parc, ou d’un sac de terreau), une graine ou une petite plante, ce carnet et un stylo.",
        etapes: [
          "Installe-toi au calme, le pot de terre devant toi. Respire trois fois, lentement.",
          "Nomme à voix haute les lieux de ta lignée, un par un, même ceux dont tu ne connais que le nom.",
          "Après chaque lieu, dis : « Je reconnais ce lieu. Il fait partie de mon histoire. »",
          "Prends un peu de terre dans ta main et dis : « Je porte vos racines là où je vis. Je vous rends ce qui vous appartient, je garde ce qui me fait grandir. »",
          "Plante la graine ou pose la petite plante dans la terre. Garde-la chez toi, à un endroit où tu la verras chaque jour.",
          "Note ci-dessous ce que tu as ressenti."
        ],
        note: { k: 'rituel-terre', q: "Après le rituel, note ce qui s’est passé : les lieux nommés, ce que tu as ressenti, l’endroit où tu as posé ta plante.", ph: "Exemple : j’ai nommé six lieux. J’ai eu les larmes aux yeux en disant « Oran ». J’ai planté du basilic, il est sur le rebord de ma fenêtre." }
      },
      conseil: "Si la lettre ou le rituel réveille une émotion forte, fais une pause, sors marcher, pose tes mains sur la terre ou sur un arbre. Tu peux finir un autre jour. Ce qui compte, c’est d’avoir ouvert la porte." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: 'Habiter ta vie, là où tu es',
      intro: "Tu as vu la carte de ta lignée, tu as remonté les départs, tu as rendu ce qui ne t’appartenait pas. Cette semaine, tu choisis de t’installer vraiment dans ta vie : un geste, un coin, une habitude qui dit « ici, je suis chez moi ».",
      texte: [
        "**La première pause.** Quand l’envie de fuir ou la peur de bouger arrive, respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis intérieurement : « Je te reconnais. Tu viens de loin. Aujourd’hui, je choisis où je suis. »",
        "**Le geste qui enracine.** Habiter sa vie commence par des gestes tout simples : ouvrir un carton, accrocher une photo, apprendre le nom de ses voisins, s’asseoir sur le même banc chaque semaine. Plus il est petit, plus il est facile à tenir."
      ],
      exercices: [
        { k: 'ex3', titre: 'Le geste qui enracine', type: 'texte',
          consigne: "Choisis ton geste pour habiter ta vie là où tu es, écris-le, puis note chaque fois que tu l’as fait, et ce qui a changé. Ce geste devient aussi un appui dans ton carnet « J’avance », pour ton domaine chez-moi.",
          pourquoi: "On ne change pas en un jour une habitude de départ ou d’immobilité qui a traversé des générations. Mais chaque geste d’installation, répété, dit à ton corps qu’il a le droit de rester, et de choisir.",
          gestes: ["Vider un carton resté fermé", "Accrocher une photo d’un lieu de ta lignée", "Saluer un voisin par son prénom", "Cuisiner un plat du pays de tes aïeux", "T’asseoir chaque semaine au même endroit dehors", "Arroser ta plante en disant « je suis là »"],
          q: "Ton geste : « La prochaine fois que je me sens de passage, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de regarder des annonces dans d’autres villes, je vais accrocher une photo au mur et inviter une amie à dîner chez moi.",
          journal: { k: 'ex3-racine', n: 6, q: "Chaque fois que tu l’as fait : quand, et qu’est-ce qui a changé ?", ph: "Exemple : samedi, j’ai vidé le carton de livres et je les ai rangés. Je me suis senti·e installé·e pour la première fois." } }
      ],
      conseil: "Habiter ta vie ne veut pas dire ne plus jamais partir. Si un jour tu déménages, tu le feras par choix, et non parce qu’une vieille histoire te pousse. Si tu oublies ton geste, ce n’est pas raté : reprends-le simplement le lendemain." }
  ],

  meditation: {
    titre: 'Le chemin vers la maison',
    intro: "Une séance guidée pour traverser les lieux de ta lignée, déposer ce qui ne t’appartient pas, et arriver dans un lieu où tu te sens chez toi.",
    texte: [
      "Installe-toi confortablement et ferme les yeux. Respire profondément, trois fois. Laisse tes épaules descendre, ton dos se poser, ton souffle ralentir.",
      "[pause]",
      "Imagine que tu marches sur une route, dans la lumière douce d’un soir d’été. L’air sent l’herbe chaude et le blé coupé. Le paysage change doucement autour de toi, au rythme de tes pas.",
      "Tu traverses les lieux de ta lignée : un village, une ville, une campagne, un port, peut-être un autre pays. Tu n’as pas besoin de les reconnaître. Sens simplement qu’ils font partie de toi, comme des pages d’une même histoire.",
      "[pause]",
      "Sur le bord du chemin, des personnes de ta famille te regardent passer. Certaines sont parties, d’autres sont restées. Certaines ont porté une valise, d’autres ont gardé la maison. Chacune a fait de son mieux, avec ce qu’elle avait.",
      "Tu peux leur adresser un signe de la main, un sourire, un merci silencieux. Elles ne te demandent rien. Elles sont simplement heureuses de te voir avancer.",
      "Si tu portes une nostalgie ou une inquiétude qui ne t’appartient pas, tu peux la déposer au bord de la route, en disant : « Je te laisse ici, avec respect. Je garde mes racines. »",
      "[longue pause]",
      "Au bout du chemin, il y a un lieu où tu te sens bien. Une maison, un jardin, un paysage, ou même une simple pièce. Entre, et regarde autour de toi : les couleurs, la lumière, les sons.",
      "Sens que tu as le droit d’être là. Ici, tu es chez toi, et tu peux y revenir quand tu le souhaites, où que tu vives.",
      "[pause]",
      "Respire profondément. Sens le sol sous toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un soir d’été, fenêtre ouverte, où personne ne te dérangera pendant dix minutes. Si penser à un départ te serre la gorge, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux reprendre la séance un autre jour.",
    note: { k: 'medit-chemin', q: "Qu’est-ce qui t’est venu pendant la séance ? Un lieu, un visage, ce que tu as déposé, le lieu où tu es arrivé·e…", ph: "Exemple : j’ai vu un port, et ma grand-mère qui me faisait signe. J’ai déposé une valise. Je suis arrivé·e dans un jardin plein de tomates." }
  },

  bilanTitre: 'Ce que ce mois a libéré',
  bilan: [
    { k: 'fin-retiens', q: "Qu’as-tu découvert sur les lieux et les départs de ta lignée ce mois-ci ?", ph: "Exemple : trois générations ont dû partir de chez elles. Mon envie de bouger sans cesse vient de loin." },
    { k: 'fin-laisse', q: "Qu’as-tu laissé aux lieux de ta lignée, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : j’ai rendu la tristesse de la maison vendue à ceux qui l’ont vécue. Je me sens plus libre de m’attacher à mon appartement." },
    { k: 'fin-garde', q: "Quelle force, quel goût, quelle tradition gardes-tu de ces lieux ?", ph: "Exemple : le courage de recommencer, et la cuisine de ma grand-mère, que je vais apprendre." },
    { k: 'fin-chez', q: "Qu’est-ce qui te fait te sentir chez toi aujourd’hui ?", ph: "Exemple : mon coin lecture, ma plante, les voisins qui me saluent, et le marché du samedi." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en septembre ?", ph: "Exemple : continuer à m’installer, et regarder ce que ma famille m’a transmis sur le travail.", court: true }
  ],

  carnet: {
    titre: 'Mon chez-moi, mon élan',
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas : ton coin à toi, ton élan d’été, ta roue de la vie. Reporte ton geste qui enracine dans ton carnet, il devient un appui pour ton domaine chez-moi."
  },

  aVenir: [
    { mois: 'Septembre', titre: 'Les métiers de la lignée', texte: "Regarder le travail de ta famille, reconnaître les vocations empêchées, et choisir ta propre voie.", image: 'assets/cartes/aimer-et-choisir-mini.jpg' },
    { mois: 'Octobre', titre: 'Les âges qui se répondent', texte: "Observer les âges et les dates qui reviennent dans ta famille, et vivre chacun d’eux à ta façon.", image: 'assets/cartes/aujourdhui-spirale-mini.jpg' },
    { mois: 'Novembre', titre: 'Une nouvelle année dans Le Cercle', texte: "Un nouveau tour de spirale, plus léger, avec tout ce que tu as vu, traversé et transmis.", image: 'assets/guide/guide-spirale-or.webp' }
  ]
};
