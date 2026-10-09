/* Genesolia · Le Cercle · Carnet de juillet 2027, « J'avance » : « Ma valeur »
   Le carnet du mois est le côté « J'avance » du Cercle : apprendre à recevoir, oser demander, reconnaître ta juste valeur, goûter l'abondance.
   Le côté libération (« L'argent et ta valeur », les phrases familiales sur l'argent) est dans Mon suivi (assets/suivi/2027-07.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-07',
  nomMois: 'juillet 2027',
  moisSuivant: 'août',
  titre: 'Ma valeur',
  sousTitre: "Apprendre à recevoir, oser demander ce qui te revient, reconnaître ta juste valeur, et goûter l'abondance de l'été.",
  pdf: '',
  image: 'assets/cartes/ma-place.jpg',
  citation: "Ta valeur n'a pas besoin d'être prouvée. Elle a besoin d'être reconnue, d'abord par toi.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Ma juste valeur', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-bienvenue.webp',
      theme: 'assets/guide/guide-cadeau.webp',
      comprendre: 'assets/guide/guide-coffret.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ma-place-mini.jpg', 'Ma place existe. Je n’ai pas à la mériter.'],
      semaines: ['assets/cartes/demander-mini.jpg', 'J’ai le droit de demander ce que je veux vraiment.']
    }
  },

  mots: {
    tonmois: "Lis ton mois à l’ombre, tranquillement. Juillet n’exige rien de toi : prends ce qui te parle, et laisse mûrir le reste.",
    ouverture: "Quelques minutes suffisent pour ouvrir ce mois. Ton objectif peut être léger : l’été est aussi fait pour recevoir.",
    theme: "Lis cette page comme on reçoit un compliment : sans le repousser. Remarque ce qui, en toi, a envie de dire « oui, mais… ».",
    comprendre: "Ta valeur ne dépend ni de ce que tu produis ni de ce que tu gagnes. Ce mois-ci, tu apprends à la regarder en face.",
    exercices: "Un exercice par semaine, à ton rythme d’été. Le deuxième se fait très bien en terrasse, avec un verre frais.",
    rituel: "Ce mois-ci, ta connexion passe par les fruits de l’été et la gratitude. Tout est là pour te rappeler que la vie donne.",
    semaines: "Chaque semaine, un petit défi pour oser recevoir et demander. Si tu as envie de ralentir, ralentis : c’est aussi te respecter.",
    cloture: "Regarde tout ce que tu as reçu ce mois-ci, et tout ce que tu as osé demander. C’est ça, reconnaître ta valeur."
  },

  theme: {
    titre: 'Le mois de la valeur',
    texte: [
      "Juillet, c'est le plein soleil. Les blés se dorent, les fruits gonflent, la chaleur ralentit tout. La nature donne sans compter : abricots, cerises, tomates, longues soirées dehors. Et pourtant, beaucoup d'entre nous ont du mal à simplement recevoir. On rend un compliment aussitôt, on minimise ce qu'on a fait, on n'ose pas demander ce qui nous revient.",
      "Ce carnet t'invite à profiter de cette abondance pour regarder ta propre valeur. Pas celle qu'on t'a donnée, ni celle que tu crois devoir mériter, mais celle qui est déjà là. Ce mois-ci, tu apprends à recevoir sans te justifier, à demander sans t'excuser, et à reconnaître ce que tu apportes au monde. Et comme juillet invite à ralentir, tu as aussi le droit de faire tout cela tranquillement."
    ],
    sousTitre: 'Pourquoi est-ce si difficile de reconnaître sa valeur ?',
    texte2: [
      "On apprend très tôt à se mesurer : aux notes, aux félicitations, aux comparaisons. Peu à peu, on finit par croire que notre valeur dépend de ce que l'on fait, de ce que l'on gagne, ou de ce que les autres pensent de nous. Alors on donne beaucoup, on travaille dur, et l'on a du mal à recevoir, comme si on n'y avait pas tout à fait droit.",
      "On observe souvent que la juste valeur repose sur trois gestes simples : **recevoir** ce qui t'est offert sans le minimiser, **demander** ce dont tu as besoin et ce qui te revient, et **oser** afficher ce que vaut ton travail, ton temps et ta présence. Ces trois gestes ouvrent la porte à l'abondance : non pas forcément plus d'argent tout de suite, mais plus de place, plus de reconnaissance, plus de légèreté.",
      "Ce mois-ci, tu vas **regarder** l'équilibre entre ce que tu donnes et ce que tu reçois, **rassembler** les preuves de ta valeur, et **oser** une vraie demande. En parallèle, ton suivi « Je me libère » t'invite à écouter les phrases de ta famille sur l'argent : elles expliquent souvent pourquoi recevoir te semble si compliqué."
    ],
    exemplesTitre: 'À quoi ressemble une valeur qu’on n’ose pas voir, au quotidien',
    exemples: [
      "**Au travail** : tu fais le travail de deux personnes depuis un an, et tu n'as jamais osé demander une augmentation, de peur de paraître exigeant·e.",
      "**Dans ton activité** : tu fixes des prix plus bas que les autres, tu offres des heures en plus, et tu t'étonnes d'être fatigué·e et mal payé·e.",
      "**Avec les compliments** : quand on te dit « c'est très réussi », tu réponds aussitôt « oh, ce n'est rien, j'ai eu de la chance ».",
      "**Dans tes relations** : tu proposes ton aide à tout le monde, mais tu ne demandes jamais rien, même quand tu es débordé·e.",
      "**Avec toi-même** : tu t'offres des cadeaux pour les autres sans hésiter, et tu culpabilises au moment de dépenser vingt euros pour toi."
    ],
    exempleSpiraleTitre: 'Un exemple de juste valeur',
    exempleSpirale: "Ta voisine te demande, une fois de plus, de garder ses enfants le samedi. D'habitude, tu dis oui, puis tu te sens utilisé·e. Ce mois-ci, tu respires et tu réponds : « Je peux ce samedi, et j'aimerais que tu prennes les miens le suivant. » Elle accepte avec le sourire. Rien de dramatique, et pourtant tout a changé : tu as reconnu que ton temps a de la valeur, et tu as osé recevoir en retour.",
    question: { k: 'theme-valeur', q: "Si tu reconnaissais pleinement ta valeur, qu’est-ce que tu oserais demander ou recevoir ce mois-ci ?", ph: "Exemple : j’oserais augmenter mes tarifs de 10 %, et j’accepterais l’aide de ma sœur pour les vacances sans me sentir redevable." }
  },

  comprendre: {
    titre: 'Recevoir, demander, oser',
    texte: [
      "Ta valeur n'est pas un chiffre, ni une note, ni un salaire. Elle est faite de tout ce que tu es et de tout ce que tu apportes : tes compétences, ta façon d'écouter, ta créativité, ta fiabilité, ta chaleur. Le problème n'est presque jamais que cette valeur manque. C'est qu'on ne la voit pas, ou qu'on n'ose pas la montrer.",
      "**Recevoir.** Recevoir est un vrai savoir-faire. Quand tu repousses un compliment, une aide ou un cadeau, tu refuses sans le vouloir ce que l'autre avait envie de t'offrir. Ce mois-ci, tu t'entraînes à dire simplement « merci », et à laisser le cadeau entrer.",
      "**Demander.** Beaucoup attendent qu'on devine leurs besoins, puis se sentent oubliés quand personne ne les devine. Demander n'est ni égoïste ni exigeant : c'est donner aux autres la chance de te répondre. Une demande claire, calme, sans excuse, est souvent entendue bien mieux qu'on ne l'imagine.",
      "**Oser ta juste valeur.** Il s'agit de reconnaître ce que vaut ton temps, ton travail, ta présence, et de l'afficher sans gêne : un tarif, une augmentation, une limite, un « non » quand on te demande trop. Ce n'est pas de l'orgueil, c'est de la justesse. Et quand tu te respectes, les autres apprennent à te respecter aussi."
    ],
    reperes: [
      { titre: 'Tu minimises ta valeur quand…', points: [
        "tu repousses un compliment au lieu de le recevoir ;",
        "tu t’excuses avant de demander, ou tu ne demandes pas du tout ;",
        "tu fixes tes prix ou acceptes un salaire en dessous de ce que tu vaux ;",
        "tu donnes beaucoup et tu culpabilises dès que tu reçois."
      ] },
      { titre: 'Tu honores ta valeur quand…', points: [
        "tu dis « merci » et tu laisses le compliment te toucher ;",
        "tu formules une demande claire, sans te justifier longuement ;",
        "tu reconnais à voix haute ce que tu as accompli ;",
        "tu t’offres quelque chose de beau sans avoir besoin de le mériter."
      ] }
    ],
    regarderTitre: 'Pour mieux voir ta valeur, demande-toi',
    regarderIntro: "Réponds à ces questions sans fausse modestie. Personne ne lira tes réponses : tu as le droit d’être généreux·se avec toi.",
    regarder: [
      { k: 'valeur-donne', q: "Qu’est-ce que tu donnes facilement aux autres, que tu as du mal à recevoir toi-même ?", ph: "Exemple : de l’écoute et du temps. Je suis toujours là pour mes amies, mais je n’ose jamais les appeler quand ça ne va pas." },
      { k: 'valeur-forces', q: "Quelles sont les trois choses que les autres apprécient chez toi, d’après ce qu’ils te disent ?", ph: "Exemple : mon calme dans les crises, mon sens de l’organisation, et ma façon de mettre les gens à l’aise." },
      { k: 'valeur-demande', q: "Quelle demande repousses-tu depuis longtemps, par peur de déranger ou d’en vouloir trop ?", ph: "Exemple : demander à mon responsable de passer à quatre jours par semaine, avec un nouveau calcul de mon salaire." },
      { k: 'valeur-abondance', q: "À quoi ressemblerait, pour toi, une vie d’abondance, concrètement, dans une semaine ordinaire ?", ph: "Exemple : un travail payé à sa juste valeur, du temps pour moi le vendredi, et un restaurant entre amies sans regarder les prix." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Si tu sens que ta difficulté à recevoir vient de loin, la page [l'argent et la lignée](argent-et-lignee.html) t'aide à comprendre ce qui se transmet dans les familles, et ton [suivi du mois](mon-suivi.html) t'accompagne pas à pas. Ton [guide du mois](mon-guide.html), lui, t'indique les jours les plus porteurs pour oser ta demande.",
    outils: [
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel et tes dates clés, pour choisir le bon moment pour demander.'],
      ['argent-et-lignee.html', 'L’argent et la lignée', 'Comprendre comment les histoires d’argent se transmettent, et comment s’en libérer à son rythme.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : l’argent et ta valeur, les phrases familiales et ce que tu t’autorises à recevoir.']
    ]
  },

  exercicesTitre: 'Recevoir, reconnaître, demander',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à voir l’équilibre entre ce que tu donnes et ce que tu reçois, le deuxième à rassembler les preuves concrètes de ta valeur, le troisième à oser une vraie demande. Prends ton temps : c’est l’été.",
  exercices: [
    { k: 'ex1', titre: 'Ce que je donne, ce que je reçois', type: 'tableau', rangs: 3,
      etiquettes: ['Au travail', 'Dans mes relations', 'Avec moi-même'],
      consigne: "Pour chacun de ces trois endroits de ta vie, note ce que tu donnes, ce que tu reçois en retour ou ce que tu refuses de recevoir, et ce que tu pourrais oser demander ou accepter. Sois honnête : on cherche l'équilibre, pas la culpabilité.",
      pourquoi: "Quand on donne beaucoup sans recevoir, la fatigue et l’amertume finissent par s’installer. Regarder l’équilibre noir sur blanc te montre où tu peux rééquilibrer, sans donner moins de toi, simplement en recevant plus.",
      colonnes: [
        { q: "Que donnes-tu, souvent sans compter ?", ph: ["Exemple : des heures supplémentaires, mon aide aux nouveaux, mes idées en réunion", "Exemple : mon écoute, mes services, les repas que je prépare pour tous", "Exemple : de l’exigence, des efforts, très peu de repos"] },
        { q: "Que reçois-tu en retour, ou que refuses-tu de recevoir ?", ph: ["Exemple : peu de reconnaissance, et je refuse les remerciements en disant « c’est normal »", "Exemple : de l’affection, mais je refuse leur aide quand on me la propose", "Exemple : presque rien, je ne m’accorde ni compliment ni cadeau"] },
        { q: "Que pourrais-tu oser demander ou accepter ?", ph: ["Exemple : demander un entretien pour parler de mon évolution", "Exemple : accepter que mon frère fasse les courses quand je suis débordé·e", "Exemple : me féliciter chaque vendredi et m’offrir un vrai moment"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Où l’équilibre penche-t-il le plus, et quelle demande ou quel cadeau veux-tu oser en premier ?", ph: "Exemple : au travail, je donne énormément et je n’ose rien demander. Je commence par demander un entretien à ma responsable avant la fin du mois." } },

    { k: 'ex2', titre: 'Mes preuves de valeur', type: 'blocs', nb: 3,
      etiquettes: ['Une compétence', 'Une qualité humaine', 'Une réussite dont je suis fier·e'],
      consigne: "Rassemble trois preuves concrètes de ta valeur : une compétence, une qualité humaine, une réussite. Pour chacune, écris une situation précise où elle a fait la différence, puis ce qu'elle apporte, à toi et aux autres. Pas de fausse modestie : ici, tu as le droit de te reconnaître pleinement.",
      pourquoi: "Quand on doute de sa valeur, la tête oublie les preuves et ne garde que les erreurs. Les écrire, avec des faits précis, te donne une base solide à relire avant une demande, un entretien, ou un jour de doute.",
      astuce: "Si tu bloques, demande à deux proches ce qu’ils apprécient chez toi. Leurs réponses te surprendront peut-être, et elles comptent.",
      champs: [
        { q: "Laquelle choisis-tu ?", ph: ["Exemple : savoir organiser un événement de A à Z", "Exemple : ma capacité à écouter sans juger", "Exemple : avoir repris mes études à 40 ans"] },
        { q: "Dans quelle situation précise a-t-elle fait la différence ?", ph: ["Exemple : le salon de mai, j’ai tout géré, cent cinquante invités, aucun couac", "Exemple : quand mon amie a perdu son travail, elle m’a dit que je l’avais aidée à tenir", "Exemple : j’ai obtenu mon diplôme en travaillant à mi-temps avec deux enfants"] },
        { q: "Qu’est-ce qu’elle apporte, à toi et aux autres ?", ph: ["Exemple : de la sérénité à mon équipe, et des économies à mon entreprise", "Exemple : de la confiance et de la douceur à ceux que j’aime", "Exemple : la preuve que je suis capable de choses que je croyais impossibles"] }
      ] },

    { k: 'ex3', titre: 'Ma demande juste', type: 'texte',
      consigne: "Choisis une demande que tu repousses : une augmentation, un nouveau tarif, de l'aide, du temps, un service rendu en retour. Écris-la clairement, en une ou deux phrases, sans excuse. Puis ose-la ce mois-ci, et note chaque fois que tu as osé demander ou recevoir, et ce qui s'est passé.",
      pourquoi: "La peur d’une demande est presque toujours plus grande que la demande elle-même. L’écrire d’abord la rend plus claire, et chaque petite demande osée t’entraîne pour les grandes. Même un refus t’apprend quelque chose : tu as osé.",
      gestes: ["Dire « merci » à un compliment, sans rien ajouter", "Demander de l’aide pour une tâche que je fais toujours seul·e", "Annoncer mon nouveau tarif sans me justifier", "Demander un entretien pour parler de mon salaire", "Accepter un cadeau ou une invitation sans proposer de rendre aussitôt", "M’offrir quelque chose de beau, rien que pour moi"],
      q: "Ta demande : « Je demande à…, de…, parce que… »",
      ph: "Exemple : je demande à ma responsable un entretien avant le 31 juillet pour parler d’une augmentation, parce que j’ai pris en charge deux nouveaux clients cette année.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as osé demander ou recevoir : quand, et que s’est-il passé ?", ph: "Exemple : jeudi, ma collègue m’a dit que ma présentation était excellente. J’ai dit « merci, j’y ai passé du temps ». Je me suis senti·e grandir." } }
  ],

  rituel: {
    titre: 'La corbeille d’été',
    intro: "En juillet, la terre donne ses fruits en abondance, sans rien demander en retour. Ce petit rituel symbolique t'invite à t'en inspirer : remercier pour ce que tu reçois déjà, et ouvrir tes mains à ce qui vient. Il se fait en quinze minutes, dehors ou près d'une fenêtre ouverte, à l'heure douce du soir.",
    materiel: "Une petite corbeille ou un joli bol, quelques fruits de saison, une bougie, et un papier.",
    quand: "Fais-le en début de mois, après avoir rempli ta roue et ton objectif. Tu peux le refaire juste avant d’oser ta grande demande : il t’aide à te sentir dans l’abondance plutôt que dans le manque.",
    etapes: [
      "Dispose tes fruits dans la corbeille, en prenant ton temps. Remarque leurs couleurs, leur parfum, leur poids dans ta main.",
      "Allume la bougie à côté. Respire trois fois profondément, en laissant tes épaules descendre.",
      "Pour chaque fruit, dis intérieurement une chose que tu as reçue ces derniers mois : « Merci pour cette amitié », « Merci pour ce travail », « Merci pour ce soleil ».",
      "Écris ensuite sur le papier une qualité ou une compétence que tu reconnais en toi, et glisse-le sous la corbeille. Tu fais partie de l’abondance.",
      "Ouvre tes mains, paumes vers le ciel, et dis : « J’accueille ce qui me revient. Je reconnais ma juste valeur. »",
      "Partage les fruits, avec toi d’abord, puis avec ceux que tu aimes. Éteins la bougie et note ici ce que tu as remercié et reconnu."
    ],
    note: { k: 'rituel-note', q: "Pour quoi as-tu dit merci, et quelle valeur as-tu reconnue en toi ?", ph: "Exemple : merci pour mes amies, pour ma nouvelle cliente, pour l’été. J’ai écrit : « Je suis fiable et créative, et ça a de la valeur. »" }
  },

  meditation: {
    titre: 'Le verger en plein été',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Pose tes mains sur tes cuisses, paumes ouvertes vers le ciel. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens l’air sur tes paumes, leur chaleur, leur poids. Remarque si elles ont envie de se refermer, ou de rester ouvertes. Laisse-les comme elles sont.",
      "Imagine un verger, un après-midi de juillet. Il fait chaud, mais tu marches à l’ombre des arbres. L’air sent l’abricot mûr et l’herbe sèche. Tu entends les cigales au loin, et le bruit léger des feuilles.",
      "Les branches sont lourdes de fruits. Il y en a partout, bien plus qu’il n’en faut. Personne ne les compte. Ils sont simplement là, offerts.",
      "[pause]",
      "Approche-toi d’un arbre. Un fruit se détache doucement et vient se poser dans ta main ouverte. Tu n’as rien eu à faire pour le mériter. Remarque ce que tu ressens : de la joie, de la gêne, l’envie de le rendre…",
      "Si une petite voix te dit « ce n’est pas pour toi », ou « tu devras le payer », écoute-la avec douceur. Puis réponds-lui : « Merci de m’avoir protégé·e. Aujourd’hui, j’ai le droit de recevoir. »",
      "[longue pause]",
      "Goûte le fruit, lentement. Sens sa douceur, sa fraîcheur. Laisse cette sensation remplir ta bouche, ta gorge, ta poitrine. C’est la sensation de recevoir.",
      "Maintenant, regarde-toi au milieu du verger. Toi aussi, tu portes des fruits : tes talents, ta chaleur, ce que tu offres aux autres. Ils ont de la valeur. Laisse-toi les voir, comme tu vois ceux des arbres.",
      "Si à un moment c’est trop, si une émotion forte monte, ouvre simplement les yeux et reviens à ton souffle. Le verger t’attendra.",
      "[pause]",
      "Dis intérieurement : « Je reçois avec gratitude. Je demande avec confiance. Je reconnais ma juste valeur. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, le siège sous toi. Referme doucement tes mains, comme pour garder ce que tu as reçu. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment calme, à l’ombre ou dans la fraîcheur du soir, où personne ne te dérangera pendant dix minutes. Juillet invite à ralentir : si tu t’endors, laisse-toi faire, et recommence un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Le fruit reçu, la petite voix, les fruits que tu portes, une sensation…", ph: "Exemple : j’ai eu envie de rendre le fruit tout de suite. Puis je l’ai gardé, et j’ai senti une chaleur dans la poitrine. Mes fruits à moi, c’était mon rire et ma patience." }
  },

  semaines: [
    { titre: 'Recevoir sans minimiser', texte: "Cette semaine, chaque fois qu’on te fait un compliment, qu’on te propose une aide ou un cadeau, réponds simplement « merci », sans rien ajouter. Pas de « oh, ce n’est rien », pas de « tu n’aurais pas dû ». Juste merci, et un sourire.",
      exemple: "Par exemple : ta collègue te dit que ton dossier est très clair. Au lieu de répondre « j’ai fait vite », tu dis « merci, ça me fait plaisir ». Remarque ce que ça te fait, et ce que ça fait à l’autre.",
      ph: "Exemple : j’ai dit merci quatre fois sans me justifier. La première fois, j’avais chaud aux joues. La dernière, j’ai savouré." },
    { titre: 'Une demande par jour', texte: "Chaque jour de la semaine, ose une petite demande : un coup de main, un renseignement, un service, une préférence. Elle peut être minuscule. L’idée est d’entraîner ton muscle de la demande, avant la grande.",
      exemple: "Par exemple : lundi, tu demandes à ton compagnon de faire le dîner. Mardi, tu demandes une table au calme au restaurant. Mercredi, tu demandes un délai pour un dossier. Chaque demande rend la suivante plus facile.",
      ph: "Exemple : j’ai osé cinq demandes, et quatre ont été acceptées sans aucune difficulté. La cinquième, un refus, ne m’a pas fait si mal." },
    { titre: 'Mon carnet d’abondance', texte: "Chaque soir, note trois choses que tu as reçues dans la journée : un sourire, un repas, un message, un rayon de soleil, un paiement, une idée. Et une chose que tu as offerte. Tu verras combien tu reçois déjà, sans le remarquer.",
      exemple: "Par exemple : « J’ai reçu un message de mon frère, une glace offerte par ma voisine, la fraîcheur du soir sur le balcon. J’ai offert mon aide à un inconnu à la gare. » L’abondance commence par le regard.",
      ph: "Exemple : au bout de trois jours, j’ai remarqué que je reçois énormément, mais que je ne le voyais pas. Je me sens plus riche, au sens large." },
    { titre: 'Oser ma demande et refaire ma roue', texte: "Cette semaine, ose la demande de ton troisième exercice, si ce n’est pas encore fait. Puis refais ta roue de la vie dans ton bilan, en regardant surtout l’argent, le travail et la connexion à toi. Tu peux aussi refaire le [test de l’arbre de vie](arbre-de-vie.html) et voir ce qui a bougé dans [ton espace](login.html#mon-chemin).",
      exemple: "Par exemple : tu as demandé ton entretien, et il est fixé à la rentrée. Ton domaine argent est passé de 3 à 5, non parce que ton salaire a changé, mais parce que tu as enfin osé. Célèbre-le.",
      ph: "Exemple : j’ai annoncé mon nouveau tarif à trois clientes. Deux ont dit oui tout de suite. Ma roue est plus ronde du côté du travail." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-recevoir', q: "Qu’as-tu appris à recevoir ce mois-ci, et qu’est-ce que ça t’a fait ?", ph: "Exemple : les compliments. Je dis merci sans me justifier, et je sens qu’ils me nourrissent vraiment." },
    { k: 'fin-demande', q: "Quelle demande as-tu osée, et que s’est-il passé ?", ph: "Exemple : j’ai demandé un entretien pour mon salaire. Il aura lieu en septembre, et je me sens fier·e d’avoir osé." },
    { k: 'fin-valeur', q: "Qu’est-ce que tu reconnais aujourd’hui de ta valeur, que tu ne voyais pas au début du mois ?", ph: "Exemple : que mon calme et mon organisation sont rares, et qu’ils ont une vraie valeur pour mon équipe." },
    { k: 'fin-abondance', q: "Où as-tu senti l’abondance dans ta vie ce mois-ci ?", ph: "Exemple : dans mes amitiés, dans les longues soirées sur le balcon, et dans les fruits du marché que je me suis offerts sans compter." },
    { k: 'fin-intention', q: "Quelle est ton intention pour août ?", ph: "Exemple : garder mes mains ouvertes, et faire de mon chez-moi un endroit qui me ressemble.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'L’argent et ta valeur',
    texte: "Pendant que ton carnet t’aide à recevoir, demander et reconnaître ta juste valeur, ton suivi t’invite à écouter les phrases de ta famille sur l’argent, à regarder ce que ta lignée a vécu, et à choisir ce que tu t’autorises à recevoir. Ce que tu libères là-bas ouvre tes mains ici."
  },

  aVenir: [
    { mois: 'Août', titre: 'Mon chez-moi, mon élan', texte: "Faire de ton lieu de vie un appui, et retrouver l’élan qui te porte pour la rentrée.", image: 'assets/cartes/racines-appuis-mini.jpg' },
    { mois: 'Septembre', titre: 'Ma vocation', texte: "Écouter ce qui t’anime vraiment, et donner plus de place à ce que tu aimes faire.", image: 'assets/cartes/ecrire-la-mienne-mini.jpg' },
    { mois: 'Octobre', titre: 'Mon bilan de l’année', texte: "Comparer tes roues, relire ta lettre, célébrer le chemin parcouru en une année dans Le Cercle.", image: 'assets/guide/guide-livre-lumineux.webp' }
  ]
};
