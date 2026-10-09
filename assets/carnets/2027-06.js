/* Genesolia · Le Cercle · Carnet de juin 2027, « J'avance » : « Oser agir »
   Le carnet du mois est le côté « J'avance » du Cercle : décider, structurer, passer à l'action, tenir ses engagements envers soi.
   Le côté libération (« Du côté des pères », la lignée paternelle) est dans Mon suivi (assets/suivi/2027-06.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-06',
  nomMois: 'juin 2027',
  moisSuivant: 'juillet',
  titre: 'Oser agir',
  sousTitre: "Décider enfin, découper ton projet en étapes simples, passer à l'action, et tenir les promesses que tu te fais.",
  pdf: '',
  image: 'assets/cartes/prochain-pas.jpg',
  citation: "Tu n'as pas besoin d'être prêt·e pour commencer. Tu deviens prêt·e en commençant.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Passer à l’action', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-spirale-or.webp',
      comprendre: 'assets/guide/guide-nombres.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/prochain-pas-mini.jpg', 'Je n’ai pas besoin de tout savoir. Seulement du prochain pas.'],
      semaines: ['assets/cartes/dire-non-mini.jpg', 'Dire non à certains, c’est parfois dire oui à moi.']
    }
  },

  mots: {
    tonmois: "Lis ton mois en repérant tes jours d’élan. Ce sont de bons moments pour poser les actions qui comptent.",
    ouverture: "Dix minutes, et tu sauras par où commencer. Ton objectif de juin peut être petit : l’essentiel est qu’il soit à toi.",
    theme: "Lis cette page sans te juger pour ce que tu as repoussé. Tout le monde remet à plus tard. Ce mois-ci, tu apprends à faire autrement.",
    comprendre: "Agir ne demande pas de courage géant. Il demande un pas assez petit pour que la peur n’ait pas le temps de répondre.",
    exercices: "Commence par le premier exercice : il te montre ce que tu repousses. Les deux autres t’aident à t’y mettre pour de bon.",
    rituel: "Ce mois-ci, ta connexion passe par la lumière du solstice : une flamme, un coucher de soleil, une promesse à toi.",
    semaines: "Chaque semaine, une action concrète. Fais-la même imparfaitement : une chose faite vaut mieux que dix choses parfaites dans ta tête.",
    cloture: "Regarde tout ce que tu as osé ce mois-ci, même ce qui n’a pas marché. Chaque essai t’a rapproché·e de toi."
  },

  theme: {
    titre: 'Le mois de l’élan',
    texte: [
      "Juin, c'est la pleine lumière. Les journées n'en finissent plus, les cerises rougissent, les soirées se prolongent dehors. L'énergie est à son sommet, et pourtant, c'est souvent le moment où l'on mesure ce qu'on n'a pas encore fait : le projet promis en janvier, l'appel repoussé, la décision qu'on garde au chaud depuis des mois.",
      "Ce carnet t'invite à profiter de cette lumière pour oser agir. Pas en devenant quelqu'un d'autre, ni en remplissant ton été de résolutions, mais en choisissant une chose qui compte pour toi et en lui donnant enfin une forme. Le solstice nous le rappelle : au plus haut de la lumière, les jours commencent déjà à raccourcir. C'est maintenant."
    ],
    sousTitre: 'Pourquoi on repousse, et comment s’y mettre',
    texte2: [
      "On ne remet presque jamais à plus tard par paresse. On repousse parce que la tâche paraît trop grosse, parce qu'on a peur de mal faire, de déranger, d'échouer, ou au contraire de réussir et de devoir changer. Parfois aussi, on attend un feu vert de quelqu'un qui ne viendra jamais.",
      "On sait qu'une envie devient une action quand elle passe par trois étapes : **décider** clairement ce que l'on veut, **structurer** le chemin en petites étapes concrètes, et **s'engager** envers soi avec une date, une heure, un lieu. Ce n'est pas la motivation qui fait avancer, c'est la clarté du prochain pas.",
      "Ce mois-ci, tu vas **repérer** ce que tu repousses, **découper** ton projet en étapes faciles, et **tenir** chaque semaine une promesse envers toi. En parallèle, ton suivi « Je me libère » t'invite à regarder le côté de ton père et des hommes de ta lignée : ce que tu as reçu d'eux éclaire souvent ta façon d'oser, ou de te retenir."
    ],
    exemplesTitre: 'À quoi ressemble ce qu’on repousse, au quotidien',
    exemples: [
      "**Un projet qui attend** : tu rêves d'ouvrir ton atelier depuis trois ans, tu as tout en tête, et rien n'est encore sur papier.",
      "**Une décision suspendue** : changer de poste, déménager, t'inscrire à cette formation. Tu pèses le pour et le contre depuis si longtemps que la question te fatigue.",
      "**Une conversation repoussée** : tu sais qu'il faudrait parler à ta responsable, à ton compagnon, à ton frère, et tu attends « le bon moment ».",
      "**Une promesse à toi-même** : reprendre le sport, écrire chaque matin, ranger le garage. Tu commences le lundi avec enthousiasme, et le jeudi c'est oublié.",
      "**Un petit rien qui pèse** : un dossier à envoyer, un rendez-vous à prendre, un mail à écrire. Cinq minutes de travail, et des semaines de culpabilité."
    ],
    exempleSpiraleTitre: 'Un exemple de premier pas',
    exempleSpirale: "Tu repousses depuis un an l'idée de proposer tes illustrations à des boutiques. Ce mois-ci, tu ne te demandes pas de « lancer ton activité » : tu choisis un premier pas de vingt minutes. Mardi soir, tu fais la liste de cinq boutiques que tu aimes. Jeudi, tu photographies trois dessins. Samedi, tu envoies un seul message. La réponse importe moins que le geste : pour la première fois, ton projet existe hors de ta tête.",
    question: { k: 'theme-oser', q: "Si tu savais que tu ne pouvais pas échouer, quelle chose oserais-tu commencer ce mois-ci ?", ph: "Exemple : je proposerais mes ateliers de couture à la médiathèque de mon quartier, et je fixerais une première date." }
  },

  comprendre: {
    titre: 'De l’envie à l’action',
    texte: [
      "Entre l'envie et l'action, il y a souvent un grand vide. On sait ce qu'on veut, on en parle, on y pense le soir, et pourtant rien ne bouge. Ce vide n'est pas un défaut de caractère : il est fait de petites peurs, de tâches trop floues et d'attentes trop hautes. Bonne nouvelle, chacun de ces freins a sa clé.",
      "**Décider.** Une décision n'a pas besoin d'être parfaite, elle a besoin d'être prise. Donne-toi une date limite pour choisir, et accepte qu'un choix imparfait vaut mieux qu'une hésitation éternelle. Tu pourras ajuster en chemin.",
      "**Structurer.** Un projet flou fait peur, une étape précise donne envie. « Créer mon site » paralyse. « Choisir trois couleurs mardi soir » se fait. Découpe ton projet jusqu'à ce que chaque étape tienne en moins d'une heure, et commence par la plus facile.",
      "**S'engager envers soi.** On honore les rendez-vous pris avec les autres, beaucoup moins ceux pris avec soi. Ce mois-ci, tu traites tes engagements envers toi comme des rendez-vous importants : une heure, un lieu, une trace écrite. Et quand tu les tiens, tu te félicites. C'est ainsi que l'on construit la confiance en soi : une promesse tenue à la fois."
    ],
    reperes: [
      { titre: 'Ce qui te freine souvent…', points: [
        "une tâche trop grosse, que tu ne sais pas par quel bout prendre ;",
        "la peur du regard des autres, ou de ne pas être à la hauteur ;",
        "le perfectionnisme, qui te fait attendre que tout soit prêt ;",
        "l’attente d’une permission, d’un feu vert, du bon moment."
      ] },
      { titre: 'Ce qui t’aide à avancer…', points: [
        "un premier pas si petit qu’il est impossible de ne pas le faire ;",
        "une date et une heure précises, notées dans ton agenda ;",
        "une personne à qui tu racontes ton engagement ;",
        "le droit de faire « assez bien » plutôt que parfaitement."
      ] }
    ],
    regarderTitre: 'Pour le projet que tu veux faire avancer, demande-toi',
    regarderIntro: "Prends le projet ou la décision de ton objectif du mois. Réponds à ces questions une par une, honnêtement, sans te juger.",
    regarder: [
      { k: 'agir-quoi', q: "Qu’est-ce que tu veux vraiment faire avancer ce mois-ci, en une phrase simple ?", ph: "Exemple : envoyer ma candidature pour la formation de photographe avant le 30 juin." },
      { k: 'agir-frein', q: "Qu’est-ce qui t’a retenu·e jusqu’ici, honnêtement ?", ph: "Exemple : la peur de ne pas être pris·e, et l’idée que je suis trop vieux·vieille pour changer de métier." },
      { k: 'agir-premier', q: "Quel est le tout premier pas, faisable en moins d’une heure cette semaine ?", ph: "Exemple : télécharger le dossier et lire la liste des pièces à fournir, mercredi soir." },
      { k: 'agir-appui', q: "Sur qui ou sur quoi peux-tu t’appuyer pour tenir ton engagement ?", ph: "Exemple : mon amie Nadia, à qui je vais envoyer un message chaque vendredi pour lui dire où j’en suis." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Ton [guide du mois](mon-guide.html) t'indique tes jours d'élan et tes dates clés : choisis-les pour poser tes actions les plus importantes. Et si tu remarques que tu te freines toujours au même endroit, ton [suivi du mois](mon-suivi.html) t'aide à regarder ce que tu as reçu de ton père et des hommes de ta lignée.",
    outils: [
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel et tes dates clés, pour choisir les meilleurs jours pour agir.'],
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir quelle sphère de ta vie a le plus besoin d’élan en ce moment.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : du côté des pères, ce que tu as reçu de la lignée des hommes.']
    ]
  },

  exercicesTitre: 'Décider, structurer, tenir',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à voir ce que tu repousses et pourquoi, le deuxième à découper ton projet en trois étapes concrètes, le troisième à tenir chaque jour une petite promesse envers toi. Fais-les dans l’ordre si tu peux : ils s’enchaînent.",
  exercices: [
    { k: 'ex1', titre: 'Ce que je repousse', type: 'tableau', rangs: 3,
      etiquettes: ['Un projet qui me tient à cœur', 'Une décision en attente', 'Une petite chose remise depuis longtemps'],
      consigne: "Pour chacune de ces trois lignes, note ce que tu repousses, ce qui te retient vraiment, et le tout premier pas que tu pourrais faire en moins d'une heure. Sois précis·e : plus le premier pas est concret, plus il devient facile.",
      pourquoi: "Ce qu’on repousse occupe de la place dans la tête, même quand on n’y pense pas. Le poser par écrit, avec ce qui te freine, transforme une culpabilité diffuse en un plan simple. Souvent, on découvre que la petite chose remise ne prend que dix minutes.",
      colonnes: [
        { q: "De quoi s’agit-il, concrètement ?", ph: ["Exemple : lancer mon podcast sur les plantes sauvages", "Exemple : choisir entre rester dans mon poste ou demander une mutation", "Exemple : prendre rendez-vous chez le garagiste pour la voiture"] },
        { q: "Qu’est-ce qui te retient d’agir, honnêtement ?", ph: ["Exemple : la peur que personne ne l’écoute, et le matériel qui me semble compliqué", "Exemple : j’attends d’être sûr·e à cent pour cent, et ça n’arrive jamais", "Exemple : ça m’ennuie, et je n’aime pas téléphoner"] },
        { q: "Quel serait le tout premier pas, faisable en moins d’une heure ?", ph: ["Exemple : enregistrer cinq minutes avec mon téléphone, juste pour moi", "Exemple : écrire les trois raisons de partir et les trois de rester, dimanche matin", "Exemple : prendre le rendez-vous en ligne, demain à 8 h"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Qu’est-ce qui te freine le plus souvent ? Quel premier pas vas-tu faire en premier, et quand ?", ph: "Exemple : c’est toujours la peur de mal faire. Je commence par le rendez-vous du garagiste demain matin, pour me prouver que je peux." } },

    { k: 'ex2', titre: 'Mon plan en trois étapes', type: 'blocs', nb: 3,
      etiquettes: ['Étape 1 : cette semaine', 'Étape 2 : d’ici quinze jours', 'Étape 3 : d’ici la fin du mois'],
      consigne: "Prends le projet que tu veux faire avancer en juin, celui de ton objectif du mois. Découpe-le en trois étapes, de la plus facile à la plus engageante. Pour chacune, écris l'action précise, le moment exact où tu la feras, et ce qui pourrait te freiner, avec ta solution.",
      pourquoi: "Un projet entier fait peur, trois étapes rassurent. En prévoyant à l’avance ce qui pourrait te freiner, tu prépares ta réponse avant que l’obstacle n’arrive : c’est l’une des façons les plus efficaces de tenir ses engagements.",
      astuce: "Formule chaque étape avec un verbe d’action : écrire, appeler, envoyer, choisir, réserver. Si tu ne peux pas la cocher, c’est qu’elle est encore trop floue.",
      champs: [
        { q: "Quelle action précise vas-tu faire ?", ph: ["Exemple : écrire la présentation de mon atelier en dix lignes", "Exemple : appeler deux lieux qui pourraient m’accueillir", "Exemple : annoncer ma première date sur les réseaux"] },
        { q: "Quand et où, exactement ?", ph: ["Exemple : mardi soir, de 20 h à 21 h, à la table du salon", "Exemple : vendredi midi, pendant ma pause, depuis le parc", "Exemple : le samedi 26 juin au matin, avec un café"] },
        { q: "Qu’est-ce qui pourrait te freiner, et comment vas-tu faire ?", ph: ["Exemple : la fatigue. Je prépare tout la veille pour n’avoir qu’à m’asseoir", "Exemple : la peur d’un refus. Je me rappelle qu’un non n’est pas un jugement sur moi", "Exemple : le doute de dernière minute. Je demande à Nadia de me relancer"] }
      ] },

    { k: 'ex3', titre: 'Ma promesse tenue', type: 'texte',
      consigne: "Choisis une petite promesse envers toi, liée à ton projet ou à ton élan, et tiens-la chaque jour, ou chaque semaine si c'est plus réaliste. Elle doit être si simple que tu peux la tenir même un jour difficile. Note chaque fois que tu l'as tenue, et ce que ça t'a fait.",
      pourquoi: "La confiance en soi ne tombe pas du ciel : elle se construit chaque fois que tu fais ce que tu t’étais dit. Une petite promesse tenue chaque jour vaut mieux qu’une grande promesse oubliée au bout d’une semaine.",
      gestes: ["Vingt minutes sur mon projet, chaque matin avant le reste", "Une action, même minuscule, avant midi chaque jour", "Envoyer un message ou un mail que je repoussais, chaque lundi", "Noter le soir une chose que j’ai osée dans la journée", "Ranger mon espace de travail avant de commencer", "Dire à voix haute ce que je vais faire, puis le faire"],
      q: "Ta promesse : « Chaque jour (ou chaque semaine), pour avancer sur…, je m’engage à… »",
      ph: "Exemple : chaque matin, pour avancer sur mon atelier, je m’engage à passer vingt minutes à mon bureau avant de regarder mes mails.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as tenue : quand, et qu’est-ce que ça t’a fait ?", ph: "Exemple : lundi, 7 h 30, j’ai écrit mon texte de présentation. Je suis parti·e travailler avec une vraie fierté." } }
  ],

  rituel: {
    titre: 'La flamme du solstice',
    intro: "Le 21 juin, la lumière est à son sommet : c'est le jour le plus long de l'année. Ce petit rituel symbolique t'invite à profiter de cette pleine lumière pour poser un engagement envers toi, et à remercier pour l'élan déjà là. Il se fait en quinze minutes, au coucher du soleil si tu peux.",
    materiel: "Une bougie, un papier et un crayon, et un endroit d’où tu vois le ciel : un jardin, un balcon, une fenêtre, un banc dans un parc.",
    quand: "Le soir du solstice, ou un soir de la semaine qui l’entoure. Tu peux rallumer ta bougie chaque fois que tu doutes de ton engagement, pour te rappeler ce que tu as choisi ce soir-là.",
    etapes: [
      "Installe-toi face au ciel, un peu avant le coucher du soleil. Allume la bougie et respire trois fois profondément.",
      "Pense à tout ce que la première moitié de l’année t’a déjà apporté. Dis intérieurement trois mercis, pour trois choses que tu as vécues ou osées depuis janvier.",
      "Pense maintenant au projet que tu veux faire avancer. Imagine-le, déjà en route, dans la pleine lumière de l’été.",
      "Écris sur le papier ton engagement, au présent et avec une date : « D’ici le 30 juin, je… ».",
      "Lis-le à voix haute en regardant la flamme, puis le soleil qui descend. Dis : « Je choisis d’avancer, à mon rythme et avec confiance. »",
      "Garde le papier dans ce carnet ou sur ton bureau. Éteins la bougie, et note ici ce que tu as promis et ce que tu as ressenti."
    ],
    note: { k: 'rituel-note', q: "Quels mercis as-tu dits, et quel engagement as-tu posé pour toi ?", ph: "Exemple : merci pour mon nouveau travail, pour mes amies, pour mon courage en mars. Mon engagement : « D’ici le 30 juin, j’envoie mon dossier de formation. »" }
  },

  meditation: {
    titre: 'Le chemin dans la lumière',
    texte: [
      "Installe-toi confortablement, le dos droit et souple, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens le sol sous tes pieds, solide et stable. Sens ton dos qui te tient. Tu es là, pleinement, dans ce moment.",
      "Imagine un sentier, un soir de juin. La lumière est dorée, l’air est doux, les blés frémissent de chaque côté. Au loin, sur une colline, tu aperçois un endroit qui t’attire : c’est là que mène ton projet.",
      "Regarde le chemin. Il te semble peut-être long, ou flou. Tu n’as pas besoin de le voir en entier. Regarde seulement le premier mètre, juste devant tes pieds.",
      "[pause]",
      "Remarque ce qui te retient d’avancer. Une peur, une voix qui doute, un poids sur tes épaules. Ne lutte pas. Dis-lui simplement : « Je t’entends. Tu peux venir avec moi, mais c’est moi qui marche. »",
      "Maintenant, fais un premier pas. Un seul. Sens ton pied se poser sur la terre tiède. Rien de grave n’est arrivé. Tu es toujours là, et tu es un peu plus près.",
      "[longue pause]",
      "Fais un deuxième pas, puis un troisième. À chaque pas, la colline se rapproche un peu, et ta respiration devient plus ample. Tu remarques que le chemin s’éclaire à mesure que tu avances.",
      "Si tu te sens fatigué·e, tu peux t’arrêter, t’asseoir au bord du chemin, et regarder le soleil. Te reposer fait aussi partie du voyage. Le chemin t’attendra.",
      "Imagine-toi à la fin du mois, un peu plus haut sur la colline. Regarde derrière toi tous les petits pas que tu as faits. Sens la fierté monter, tranquille, dans ta poitrine.",
      "[pause]",
      "Dis intérieurement : « Je n’ai pas besoin de tout savoir. Seulement du prochain pas. Je tiens mes promesses envers moi. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais cette méditation un matin, avant de poser ta première action de la semaine : elle donne de l’élan. Si tu l’écoutes le soir et que tu t’endors, ce n’est pas grave, recommence un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Ce qui te retenait, la colline, ton premier pas, une sensation…", ph: "Exemple : la voix qui doutait ressemblait à celle de mon père. En faisant le premier pas, j’ai senti mes épaules se relâcher." }
  },

  semaines: [
    { titre: 'Décider en cinq minutes', texte: "Cette semaine, prends une décision que tu repousses depuis longtemps, petite ou grande. Donne-toi cinq minutes, un papier, et une limite : à la fin, tu choisis. Puis fais un premier geste pour l’ancrer.",
      exemple: "Par exemple : tu hésites depuis des mois à t’inscrire au cours de théâtre. Tu mets un minuteur, tu notes ce que tu ressens, et à la cinquième minute tu décides. Puis tu envoies le mail d’inscription dans la foulée, avant que le doute ne revienne.",
      ph: "Exemple : j’ai décidé de ne plus aller aux réunions du mardi soir. J’ai prévenu le groupe le jour même, et je me suis senti·e libéré·e." },
    { titre: 'Ma première heure d’action', texte: "Bloque une heure dans ton agenda pour ton projet, comme un vrai rendez-vous, et fais l’étape 1 de ton plan. Pendant cette heure, téléphone loin, porte fermée, rien d’autre. Si tu finis avant, tu as le droit de t’arrêter et de te féliciter.",
      exemple: "Par exemple : samedi de 9 h à 10 h, tu écris enfin la présentation de ton activité. Elle n’est pas parfaite, mais elle existe. Tu pourras l’améliorer la semaine prochaine.",
      ph: "Exemple : j’ai tenu mon heure de samedi. J’ai fait plus que prévu, et j’ai compris que le plus dur, c’était de m’asseoir." },
    { titre: 'Tenir ma parole envers moi', texte: "Cette semaine, tiens chaque jour la petite promesse de ton troisième exercice. Le soir, coche-la, ou note ce qui t’en a empêché·e, sans te juger. Le but n’est pas la perfection, c’est la régularité.",
      exemple: "Par exemple : vingt minutes sur ton projet chaque matin. Lundi, mardi, mercredi, c’est fait. Jeudi, tu as oublié : vendredi, tu reprends, sans te faire de reproches. Quatre jours sur cinq, c’est une vraie victoire.",
      ph: "Exemple : j’ai tenu ma promesse cinq jours sur sept. Pour la première fois, j’ai l’impression de pouvoir compter sur moi." },
    { titre: 'Célébrer et refaire ma roue', texte: "En fin de semaine, fais la liste de tout ce que tu as osé ce mois-ci, même les essais ratés. Célèbre-les vraiment : un bon repas, une sortie, un message à une amie. Puis refais ta roue dans ton bilan, et le [test de l’arbre de vie](arbre-de-vie.html) si tu en as envie.",
      exemple: "Par exemple : ton évolution personnelle est passée de 4 à 6, ton travail de 5 à 6. Tu as envoyé ta candidature, appelé deux lieux, tenu tes vingt minutes. Ça mérite un dîner en terrasse, rien que pour toi.",
      ph: "Exemple : j’ai noté onze choses osées ce mois-ci. Je n’en revenais pas. J’ai fêté ça avec ma sœur, au restaurant." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-ose', q: "Quelle est l’action dont tu es le plus fier·e ce mois-ci, et pourquoi ?", ph: "Exemple : avoir envoyé mon dossier de formation. Je repoussais depuis deux ans, et je l’ai fait en une soirée." },
    { k: 'fin-frein', q: "Qu’as-tu appris sur ce qui te freine, et sur la façon de le dépasser ?", ph: "Exemple : je me freine quand l’étape est trop floue. Dès que je la découpe en petits morceaux, j’avance." },
    { k: 'fin-promesse', q: "Quelle promesse envers toi as-tu tenue, et qu’est-ce que ça a changé dans ta confiance ?", ph: "Exemple : mes vingt minutes du matin. Je me sens plus solide, comme si je pouvais enfin compter sur moi." },
    { k: 'fin-suite', q: "Quelle est la prochaine étape de ton projet, avec une date ?", ph: "Exemple : préparer mon entretien de sélection, d’ici le 15 juillet." },
    { k: 'fin-intention', q: "Quelle est ton intention pour juillet ?", ph: "Exemple : continuer à avancer à mon rythme, et oser enfin dire combien vaut mon travail.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Du côté des pères',
    texte: "Pendant que ton carnet t’aide à oser agir, ton suivi t’invite à regarder ton père, ton grand-père et les hommes de ta lignée : ce que tu as reçu d’eux, en élan comme en retenue, et ce que tu choisis d’en faire. Ce que tu reconnais là-bas libère souvent ton passage à l’action ici."
  },

  aVenir: [
    { mois: 'Juillet', titre: 'Ma valeur', texte: "Apprendre à recevoir, oser demander, et reconnaître ta juste valeur, dans l’abondance de l’été.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Août', titre: 'Mon chez-moi, mon élan', texte: "Faire de ton lieu de vie un appui, et retrouver l’élan qui te porte pour la rentrée.", image: 'assets/cartes/racines-appuis-mini.jpg' },
    { mois: 'Septembre', titre: 'Ma vocation', texte: "Écouter ce qui t’anime vraiment, et donner plus de place à ce que tu aimes faire.", image: 'assets/cartes/ecrire-la-mienne-mini.jpg' }
  ]
};
