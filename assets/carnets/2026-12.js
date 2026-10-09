/* Genesolia · Le Cercle · Carnet de décembre 2026, « J'avance » : « Ma place, mes limites »
   Le carnet du mois est le côté « J'avance » du Cercle : dire oui, dire non, protéger son énergie, trouver sa juste place.
   Le côté libération (« Les fêtes et les places à table ») est dans Mon suivi (assets/suivi/2026-12.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2026-12',
  nomMois: 'décembre 2026',
  moisSuivant: 'janvier',
  titre: 'Ma place, mes limites',
  sousTitre: "Dire oui quand c'est oui, dire non quand c'est non, protéger ton énergie pendant les fêtes, et trouver ta juste place.",
  pdf: '',
  image: 'assets/formation/spirale.jpg',
  citation: "Une limite posée avec douceur n'éloigne pas les autres. Elle leur montre où te trouver.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Poser mes limites', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-cadeau.webp',
      comprendre: 'assets/guide/guide-boucle.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ma-place-mini.jpg', 'Ma place existe. Je n’ai pas à la mériter.'],
      semaines: ['assets/cartes/dire-non-mini.jpg', 'Dire non à certains, c’est parfois dire oui à moi.']
    }
  },

  mots: {
    tonmois: "Lis ton mois au chaud. Décembre va vite : ici, tu as le droit de ralentir et de choisir ce qui compte.",
    ouverture: "Dix minutes pour ta météo, ta roue et ton objectif. Si tu es fatigué·e, c’est normal en décembre : note-le, sans te juger.",
    theme: "Rien à faire sur cette page, seulement à lire. Remarque les moments où tu dis oui alors que tout en toi dit non.",
    comprendre: "Une limite n’est pas un mur. C’est une porte dont tu gardes la clé.",
    exercices: "Commence par le premier exercice avant les fêtes : il t’aidera à préparer tes oui et tes non.",
    rituel: "Ta connexion de décembre se vit autour de la nuit la plus longue : une flamme, des branches, et la lumière qui revient.",
    semaines: "Un défi par semaine, même au milieu des préparatifs. Un seul non bien placé peut changer toute une fête.",
    cloture: "Prends ce moment même si les fêtes ont tout bousculé. Regarde surtout les fois où tu t’es respecté·e."
  },

  theme: {
    titre: 'Le mois de ta juste place',
    texte: [
      "Décembre est le mois de la nuit la plus longue. Le soleil se lève tard, se couche tôt, et pourtant, au solstice, la lumière commence à revenir. C'est aussi le mois des fêtes, des invitations, des cadeaux à trouver, des repas à préparer, des attentes de chacun·e. Beaucoup de personnes arrivent en décembre fatiguées, et en sortent épuisées.",
      "C'est normal de ne pas être à fond en décembre. La nature, elle, se repose. Ce carnet t'invite à faire un peu comme elle : protéger ton énergie, choisir où tu la mets, et trouver ta juste place, ni trop effacée, ni à tout porter. Dire oui à ce qui te fait du bien, et non, avec douceur, à ce qui te vide."
    ],
    sousTitre: 'Pourquoi parler de limites ?',
    texte2: [
      "Une limite, c'est l'endroit où tu t'arrêtes et où l'autre commence. C'est ce que tu acceptes, et ce que tu n'acceptes pas : dans ton temps, ton énergie, ton argent, ton corps, tes émotions. Quand nos limites sont claires, les relations deviennent plus simples, parce que chacun·e sait où il ou elle en est.",
      "Beaucoup d'entre nous ont appris qu'être gentil·le, c'était dire oui. Alors on dit oui au repas qu'on n'a pas envie d'organiser, au cadeau trop cher, à la conversation qui nous blesse. Puis on en veut aux autres, et surtout à soi. Un oui qui pense non finit toujours par se payer : en fatigue, en rancœur, ou en distance.",
      "Ce mois-ci, tu vas **repérer** tes oui automatiques, **oser** quelques non doux, et **choisir** ta place, pendant les fêtes et dans ta vie. En parallèle, ton suivi « Je me libère » t'invite à regarder les places à table dans ta famille : les deux avancent ensemble."
    ],
    exemplesTitre: 'À quoi ressemble une limite floue, au quotidien',
    exemples: [
      "**Au travail** : ta responsable t’envoie un message le 23 décembre au soir, et tu réponds dans la minute, alors que tu es en congés.",
      "**En famille** : tu reçois tout le monde chaque année, parce que « c’est toi qui as la plus grande table », et tu passes la soirée en cuisine.",
      "**Avec l’argent** : tu dépenses plus que prévu en cadeaux pour ne décevoir personne, et janvier commence avec un découvert.",
      "**Dans les conversations** : un oncle fait toujours la même remarque sur ta vie, tu souris, et tu y repenses toute la nuit.",
      "**Avec toi-même** : tu te promets une soirée tranquille, puis tu acceptes une sortie de plus, et tu finis la semaine vidé·e."
    ],
    exempleSpiraleTitre: 'Un exemple de limite posée',
    exempleSpirale: "Chaque année, tu reçois la famille le 24 et tu termines à 2 h du matin, seul·e devant la vaisselle. Cette année, tu proposes : « Je fais le plat principal, chacun apporte une entrée ou un dessert, et on fait la vaisselle ensemble. » Ta sœur dit oui tout de suite. Tu passes la soirée à table, et tu ris avec les tiens. Ta place a changé, la fête aussi.",
    question: { k: 'theme-place', q: "Si tu pouvais vivre les fêtes de cette année exactement à ta place, à quoi ressembleraient-elles ?", ph: "Exemple : un repas simple avec les personnes que j’aime, une journée pyjama le lendemain, et aucune obligation de tout organiser." }
  },

  comprendre: {
    titre: 'Des limites qui protègent le lien',
    texte: [
      "Poser une limite, ce n'est pas rejeter l'autre. C'est lui dire comment être en lien avec toi sans te blesser. Une limite claire protège la relation, bien plus qu'un oui forcé qui finit en rancœur.",
      "Ton corps te prévient souvent avant ta tête. Une gorge qui se serre, des épaules qui montent, un soupir avant de répondre : ce sont des signaux que quelque chose dépasse ta limite. Apprendre à les écouter, c'est te donner une seconde pour choisir ta réponse.",
      "Un non n'a pas besoin d'être long ni justifié. « Non, merci. » « Pas cette fois. » « Je te réponds demain. » Plus tu te justifies, plus l'autre a de prises pour discuter. Un non doux et ferme se dit avec un sourire, et sans excuse.",
      "Ta juste place, enfin, c'est celle où tu peux être toi : ni effacé·e pour faire plaisir, ni à tout porter pour être aimé·e. Elle se trouve souvent en osant un petit déplacement : t'asseoir ailleurs, demander de l'aide, partir un peu plus tôt, dire ce que tu préfères."
    ],
    reperes: [
      { titre: 'Une limite saine…', points: [
        "se dit calmement, sans attendre d’être à bout ;",
        "parle de toi (« j’ai besoin de… ») plutôt que de l’autre ;",
        "se tient dans le temps, même si l’autre insiste ;",
        "laisse de la place au lien : tu dis non à la demande, pas à la personne."
      ] },
      { titre: 'Un oui qui te coûte…', points: [
        "se dit vite, avant d’avoir réfléchi ;",
        "s’accompagne d’un soupir, d’une tension, d’un « bon, d’accord » ;",
        "laisse ensuite de la fatigue ou de la rancœur ;",
        "vient souvent d’une vieille peur : décevoir, déranger, ne plus être aimé·e."
      ] }
    ],
    regarderTitre: 'Pour trouver tes limites, demande-toi',
    regarderIntro: "Pense à tes dernières semaines, et aux fêtes qui arrivent. Réponds simplement, avec ce qui vient en premier.",
    regarder: [
      { k: 'limites-oui', q: "À quoi as-tu dit oui récemment, alors que tu pensais non ?", ph: "Exemple : garder les enfants de ma sœur samedi, alors que j’avais besoin de repos." },
      { k: 'limites-signal', q: "Quel signal ton corps t’envoie-t-il quand une limite est dépassée ?", ph: "Exemple : ma mâchoire se serre et j’ai chaud dans la nuque." },
      { k: 'limites-peur', q: "Qu’as-tu peur qu’il se passe si tu dis non ?", ph: "Exemple : qu’on me trouve égoïste, et qu’on ne m’invite plus." },
      { k: 'limites-place', q: "Où, dans ta vie, aimerais-tu prendre un peu plus de place ?", ph: "Exemple : en réunion, pour donner mon avis avant que tout soit décidé." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Pour mieux comprendre la place que tu as prise enfant, lis [ta place dans la fratrie](place-dans-la-fratrie.html). Et si les fêtes réveillent des tensions avec tes parents, [cet article](conflits-avec-ses-parents.html) t'aidera à les regarder autrement. Ton suivi de décembre t'invite à observer les places à table dans ta famille.",
    outils: [
      ['place-dans-la-fratrie.html', 'Ta place dans la fratrie', 'Aîné·e, cadet·te, benjamin·e : ce que ton rang t’a appris sur ta place.'],
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel et tes dates clés, pour savoir où mettre ton énergie.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : les fêtes et les places à table, et les absent·es qui comptent.']
    ]
  },

  exercicesTitre: 'Repérer, oser, choisir',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à repérer tes oui qui te coûtent, le deuxième à préparer les fêtes en protégeant ton énergie, le troisième à trouver ta phrase pour dire non. Fais le deuxième avant le 20 décembre si tu peux.",
  exercices: [
    { k: 'ex1', titre: 'Mes oui qui me coûtent', type: 'tableau', rangs: 3,
      etiquettes: ['Au travail', 'En famille', 'Avec mes amis, et avec moi-même'],
      consigne: "Pour chacun de ces trois endroits de ta vie, note un oui que tu as dit alors que tu pensais non, ce qu'il t'a coûté, et la réponse plus juste que tu aurais pu donner. Pas besoin de te juger : on cherche seulement à voir.",
      pourquoi: "On ne change pas une habitude qu’on ne voit pas. En écrivant tes oui automatiques, tu repères les situations où tu t’oublies, et tu prépares déjà ta prochaine réponse.",
      colonnes: [
        { q: "À quoi as-tu dit oui, alors que tu pensais non ?", ph: ["Exemple : reprendre le dossier d’un collègue absent, en plus du mien", "Exemple : organiser le repas du 25 chez moi, encore cette année", "Exemple : une soirée en ville, alors que j’étais épuisé·e"] },
        { q: "Que t’a coûté ce oui ?", ph: ["Exemple : deux soirées de travail et une grosse fatigue", "Exemple : trois jours de courses et de cuisine, et aucun moment pour moi", "Exemple : un dimanche gâché à récupérer"] },
        { q: "Quelle réponse plus juste aurais-tu pu donner ?", ph: ["Exemple : « Je peux en prendre une partie, pas tout. »", "Exemple : « Cette année, je propose qu’on le fasse chez toi. »", "Exemple : « Je passe mon tour, on se voit la semaine prochaine ? »"] }
      ],
      apres: { k: 'ex1-motif', q: "Relis tes trois lignes. Qu’est-ce qui se répète : une personne, une peur, un moment de la journée ?", ph: "Exemple : je dis oui surtout quand je suis fatigué·e, et quand j’ai peur de décevoir quelqu’un que j’aime." } },

    { k: 'ex2', titre: 'Mes fêtes, à ma façon', type: 'blocs', nb: 3,
      etiquettes: ['Un moment que j’appréhende', 'Un moment qui me demande beaucoup', 'Un moment que j’attends avec joie'],
      consigne: "Choisis trois moments des fêtes qui arrivent : un que tu appréhendes, un qui te demande beaucoup d'énergie, et un que tu attends avec joie. Pour chacun, note ce dont tu as besoin pour le vivre bien, et la limite ou l'arrangement que tu vas poser.",
      pourquoi: "Les fêtes demandent beaucoup d’énergie. Les préparer à l’avance, avec tes besoins en tête, t’évite de tout subir sur le moment. Et protéger un moment de joie compte autant qu’alléger un moment difficile.",
      astuce: "Pense en heures et en gestes concrets : « Je pars à 22 h », « Je fais une pause dehors après le repas », « Je dis que je ne parlerai pas de mon travail. »",
      champs: [
        { q: "Quel est ce moment ?", ph: ["Exemple : le repas du 24 chez mes beaux-parents", "Exemple : préparer le repas du 25 pour douze personnes", "Exemple : la balade du 26 avec mes enfants"] },
        { q: "De quoi as-tu besoin pour le vivre bien ?", ph: ["Exemple : savoir à quelle heure je pars, et avoir un allié à côté de moi", "Exemple : de l’aide en cuisine, et une heure pour moi avant l’arrivée de tous", "Exemple : que personne ne m’appelle pendant ces deux heures"] },
        { q: "Quelle limite, ou quel arrangement, vas-tu poser ?", ph: ["Exemple : je préviens que nous partons à 23 h, et je m’y tiens", "Exemple : je confie les desserts et la vaisselle à mes frères", "Exemple : je laisse mon téléphone à la maison"] }
      ] },

    { k: 'ex3', titre: 'Ma phrase pour dire non', type: 'texte',
      consigne: "Choisis une phrase courte et douce pour dire non, ou « pas maintenant », que tu pourras sortir sans réfléchir. Écris-la, répète-la à voix haute deux ou trois fois, puis note chaque fois que tu l'as utilisée ce mois-ci, et ce qui s'est passé.",
      pourquoi: "Quand on n’a pas de mots prêts, la vieille habitude répond à notre place. Une phrase préparée, c’est une porte de sortie toujours disponible, même quand l’émotion monte.",
      gestes: ["« Non, merci, pas cette fois. »", "« Je regarde et je te réponds demain. »", "« Je peux faire ça, mais pas ça. »", "« Ce n’est pas possible pour moi. »", "« J’ai besoin d’y réfléchir. »", "« Je préfère qu’on parle d’autre chose. »"],
      q: "Ta phrase : « Quand on me demande…, je vais répondre… »",
      ph: "Exemple : quand on me demande d’organiser quelque chose en plus, je vais répondre « je regarde mon agenda et je te dis demain ».",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu as utilisé ta phrase : quand, avec qui, et qu’est-ce qui s’est passé ?", ph: "Exemple : lundi, avec ma mère. J’ai dit « je te réponds demain ». Elle a dit « d’accord », tout simplement." } }
  ],

  rituel: {
    titre: 'Le cercle du solstice',
    intro: "Autour du 21 décembre, la nuit est la plus longue de l'année, puis la lumière revient, minute après minute. Ce petit rituel symbolique t'invite à tracer ton cercle : ce que tu protèges à l'intérieur, ce que tu laisses à l'extérieur. Il se fait en quinze minutes, le soir.",
    materiel: "Une bougie, quelques branches de sapin, des pommes de pin ou des petits cailloux (ou une ficelle si tu n'en as pas), deux petits papiers et un crayon.",
    quand: "Fais-le le soir du solstice, ou un soir de la semaine qui précède les fêtes. Tu peux garder le cercle en place quelques jours, et rallumer la bougie chaque fois que tu sens que tu t'éparpilles.",
    etapes: [
      "Éteins les lumières, et allume ta bougie. Regarde la flamme trois respirations : c’est la lumière qui revient au cœur de la nuit la plus longue.",
      "Avec les branches, les pommes de pin ou les cailloux, trace un cercle autour de la bougie. Ce cercle, c’est ton espace, ton énergie, ta juste place.",
      "Sur un premier papier, écris ce que tu protèges dans ce cercle pendant les fêtes : un moment, un besoin, une personne, ton repos. Pose-le à l’intérieur, près de la flamme.",
      "Sur un deuxième papier, écris ce que tu laisses à l’extérieur : une obligation, une attente qui n’est pas la tienne, un oui de trop. Pose-le hors du cercle.",
      "Pose une main sur ton cœur et dis, à voix basse : « Ma place existe. Je protège ce qui compte. Je dis oui à ce qui me nourrit, et non, avec douceur, au reste. »",
      "Remercie cette année pour ce qu’elle t’a appris. Éteins la bougie (ne la laisse jamais sans surveillance), et note ici ce que tu as placé dans ton cercle."
    ],
    note: { k: 'rituel-note', q: "Qu’as-tu mis à l’intérieur de ton cercle, et qu’as-tu laissé dehors ?", ph: "Exemple : à l’intérieur, mes matinées tranquilles et le repas avec mes enfants. Dehors, l’obligation de faire plaisir à tout le monde." }
  },

  meditation: {
    titre: 'La maison de lumière',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Imagine une nuit d’hiver, claire et froide. La neige crisse sous tes pas. Devant toi, une petite maison, avec une lumière dorée à la fenêtre. C’est ta maison intérieure.",
      "Tu t’approches de la porte. Dans ta main, tu sens une clé. Elle est à toi. C’est toi qui décides quand la porte s’ouvre, et pour qui.",
      "[pause]",
      "Tu entres. Il fait bon. Un feu brûle doucement dans la cheminée. Regarde autour de toi : les couleurs, les objets, l’odeur. Tout ici te ressemble. Tu peux enlever ton manteau, et tout ce que tu portais pour les autres.",
      "Choisis ta place dans la pièce. Un fauteuil près du feu, un coussin près de la fenêtre. Assieds-toi. Sens comme ton corps se dépose. Ici, tu n’as rien à faire, rien à organiser, personne à satisfaire.",
      "[longue pause]",
      "Peut-être que quelqu’un frappe à la porte. Une demande, une attente, une obligation. Tu n’es pas obligé·e d’ouvrir tout de suite. Tu peux répondre, doucement : « Pas maintenant. » ou « Entre, mais pour un moment seulement. » Sens comme c’est simple, et comme tu restes en lien.",
      "Maintenant, pense à une personne que tu aimes vraiment. Ouvre-lui la porte. Elle entre, s’assoit près de toi. Il y a de la place pour elle, et toujours de la place pour toi.",
      "[pause]",
      "Regarde la flamme dans la cheminée. C’est ton énergie. Tu la protèges, tu la nourris. Au cœur de la nuit la plus longue, elle continue de briller.",
      "Dis intérieurement : « Ma place existe. Je choisis à qui j’ouvre. Je garde ma lumière. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux, avec la clé toujours dans ta main."
    ],
    conseil: "Fais cette méditation avant une journée chargée, ou le soir après une réunion de famille, pour retrouver ta place. Si la fatigue t’emporte et que tu t’endors, c’est que ton corps en avait besoin : en décembre, c’est normal. Recommence un autre jour.",
    note: { k: 'medit-note', q: "Comment était ta maison intérieure, et qu’as-tu répondu à la personne qui frappait ?", ph: "Exemple : une petite maison en bois avec des plaids partout. J’ai dit « pas maintenant » à une demande de travail, et je me suis senti·e fier·e." }
  },

  semaines: [
    { titre: 'Repérer mes oui automatiques', texte: "Cette semaine, chaque fois que tu dis oui, prends une seconde pour te demander : « Est-ce un vrai oui ? » Note le soir les oui qui te coûtaient. Pas besoin de changer quoi que ce soit : voir suffit pour commencer.",
      exemple: "Par exemple : « Mardi : oui pour le pot de départ, vrai oui. Mercredi : oui pour garder le chien de la voisine, faux oui, j’étais déjà débordé·e. » À la fin de la semaine, tu sauras où tes limites sont fragiles.",
      ph: "Exemple : mes faux oui arrivent surtout par message, quand je réponds trop vite." },
    { titre: 'Un non doux', texte: "Cette semaine, dis au moins un non, ou un « pas maintenant », à une demande qui te coûte. Utilise ta phrase de l'exercice 3, sans te justifier, avec le sourire. Puis observe : que s'est-il vraiment passé ?",
      exemple: "Par exemple : « Non, cette année je ne fais pas les bûches pour tout le monde, mais j’apporte le pain. » Souvent, l’autre accepte bien plus facilement qu’on ne l’imaginait.",
      ph: "Exemple : j’ai dit non pour la réunion du samedi. Mon collègue a dit « pas de souci ». J’avais imaginé un drame pour rien." },
    { titre: 'Mes pauses des fêtes', texte: "Pendant chaque réunion de famille ou soirée, offre-toi une pause de dix minutes rien qu'à toi : sortir prendre l'air, faire un tour du pâté de maisons, respirer à la fenêtre. Prévois-la à l'avance, comme un rendez-vous.",
      exemple: "Par exemple : après le plat principal, tu sors marcher dix minutes avec ton manteau et ton écharpe. Tu reviens plus calme, et tu profites mieux du dessert. Personne ne s’en offusque, et certains viennent même avec toi.",
      ph: "Exemple : ma pause dehors après le repas m’a évité de m’énerver quand mon oncle a relancé le sujet de mon travail." },
    { titre: 'Ma juste place', texte: "Cette semaine, ose un petit déplacement : t'asseoir à une autre place, demander de l'aide, confier une tâche, ou dire ce que tu préfères. Puis refais ta roue dans ton bilan, et regarde ce qui a bougé.",
      exemple: "Par exemple : tu demandes à ton frère de découper la volaille, tu t’assois à côté de ta nièce plutôt qu’au bout de la table près de la cuisine, ou tu dis « je préfère qu’on ouvre les cadeaux le matin ». Un petit pas de côté suffit.",
      ph: "Exemple : pour la première fois, je me suis assis·e au milieu de la table, et quelqu’un d’autre a fait le service. J’ai vraiment mangé chaud." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-non', q: "Quel non, ou quel « pas maintenant », as-tu osé ce mois-ci, et que s’est-il passé ?", ph: "Exemple : j’ai refusé d’organiser le repas du 25. Ma sœur l’a fait chez elle, et tout s’est bien passé." },
    { k: 'fin-energie', q: "Comment as-tu protégé ton énergie pendant les fêtes ?", ph: "Exemple : avec mes pauses dehors et ma soirée pyjama du 26, sans aucune obligation." },
    { k: 'fin-place', q: "Quelle place as-tu prise, ou laissée, et comment t’es-tu senti·e ?", ph: "Exemple : j’ai laissé la place de celle qui sert tout le monde. Je me suis senti·e invité·e, pour une fois." },
    { k: 'fin-limite', q: "Quelle limite veux-tu garder pour l’année qui vient ?", ph: "Exemple : ne plus répondre aux messages de travail après 19 h, ni pendant mes congés." },
    { k: 'fin-intention', q: "Quelle est ton intention pour janvier ?", ph: "Exemple : commencer l’année doucement, et choisir ce qui compte vraiment pour moi.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Les fêtes et les places à table',
    texte: "Pendant que ton carnet t’aide à poser tes limites et à protéger ton énergie, ton suivi t’invite à observer les places à table dans ta famille : qui organise, qui se tait, qui manque. Comprendre la place que l’on t’a donnée t’aide à choisir celle que tu prends."
  },

  aVenir: [
    { mois: 'Janvier', titre: 'Mon intention, mes valeurs', texte: "Clarifier ce qui compte vraiment pour toi, et poser l’intention de ton année.", image: 'assets/guide/guide-transmission.webp' },
    { mois: 'Février', titre: 'M’aimer d’abord', texte: "Te traiter avec la douceur que tu offres aux autres, et devenir ton tout premier appui.", image: 'assets/cartes/entiere-mini.jpg' },
    { mois: 'Mars', titre: 'Ma voix, ma confiance', texte: "Oser dire ce que tu penses, prendre la parole, et faire confiance à ce que tu ressens.", image: 'assets/cartes/demander-mini.jpg' }
  ]
};
