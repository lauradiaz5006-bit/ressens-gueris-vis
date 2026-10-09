/* Genesolia · Le Cercle · Carnet d'octobre 2026, « J'avance » : « Mon point de départ »
   Le carnet du mois est le côté coaching du Cercle : faire le point, choisir ce que l'on veut nourrir, avancer pas à pas.
   Le côté libération (« Ce qui revient », la boucle et les deux cycles) est dans Mon suivi (assets/suivi/2026-10.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2026-10',
  nomMois: 'octobre 2026',
  moisSuivant: 'novembre',
  titre: 'Mon point de départ',
  sousTitre: "Faire le point sur ta vie avec ta roue, choisir ce que tu veux nourrir, et avancer d'un petit pas chaque semaine.",
  pdf: '',
  image: 'assets/cercle/apercu-2026-10.jpg',
  citation: "Tu n'as pas besoin de tout changer. Un pas juste, aujourd'hui, suffit pour commencer.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Lire ma roue', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-nombres.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/prochain-pas-mini.jpg', 'Mon prochain pas compte plus que tout le chemin.'],
      semaines: ['assets/cartes/a-mon-rythme-mini.jpg', 'J’avance à mon rythme.']
    }
  },

  mots: {
    tonmois: "Lis ton mois tranquillement, comme une lettre qui t’est adressée. Garde ce qui te parle, laisse le reste.",
    ouverture: "Dix minutes suffisent. Ta météo, ta roue et ton objectif : le reste peut attendre, tout est enregistré au fur et à mesure.",
    theme: "Rien à faire sur cette page, seulement à lire. Laisse venir ce qui te touche.",
    comprendre: "Une roue n’est jamais parfaite. Ce qui compte, c’est de savoir où tu en es aujourd’hui, avec tendresse.",
    exercices: "Un exercice par semaine suffit. Le premier se fait en vingt minutes, au calme, avec une boisson chaude.",
    rituel: "Ce mois-ci, ta connexion passe par la nature : une feuille, un arbre, ta respiration. Simple et vrai.",
    semaines: "Une petite case cochée chaque semaine vaut mieux qu’un grand plan jamais commencé.",
    cloture: "Prends ce moment même si tout n’a pas été fait. C’est souvent là qu’on voit le chemin parcouru."
  },

  theme: {
    titre: 'Le mois du point de départ',
    texte: [
      "Octobre, c'est la saison où les arbres trient. Ils laissent tomber ce qui a fini son temps, et gardent leur sève pour l'essentiel. La rentrée est passée, les jours raccourcissent, et l'on sent naturellement le besoin de faire le point : qu'est-ce qui me fait du bien, qu'est-ce qui me coûte, où est-ce que je veux aller ?",
      "Ce premier carnet du Cercle t'invite à faire comme l'arbre : regarder ta vie dans son ensemble, avec douceur, sans te juger. Pas pour tout changer d'un coup, mais pour choisir un endroit où mettre ton énergie ce mois-ci. Un seul. C'est souvent le plus petit pas, bien choisi, qui fait bouger tout le reste."
    ],
    sousTitre: 'Pourquoi une roue de la vie ?',
    texte2: [
      "La roue de la vie est un outil que l'on utilise beaucoup en coaching. Elle découpe ta vie en dix domaines : ton énergie, l'amour, ta famille, tes amitiés, ton travail, l'argent, ton chez-moi, la joie, ton évolution personnelle et ta connexion à toi-même. Pour chacun, tu te demandes simplement : à quel point suis-je comblé·e aujourd'hui, de 0 à 10 ?",
      "Quand on relie les points, on obtient une roue. Plus elle est ronde, plus ta vie roule de façon fluide. Là où elle se creuse, ça cahote. L'idée n'est pas d'avoir 10 partout, personne n'a 10 partout. L'idée est de voir où tu en es, de choisir ce que tu veux nourrir, et de mesurer, mois après mois, comment ta roue s'arrondit.",
      "Ce mois-ci, tu vas **faire le point** avec ta roue, **choisir** le domaine que tu veux nourrir, et **avancer** d'un petit pas chaque semaine. En parallèle, ton suivi « Je me libère » t'aide à repérer ce qui se rejoue et te freine : les deux avancent ensemble."
    ],
    exemplesTitre: 'Ce que ta roue peut te montrer',
    exemples: [
      "**Un domaine très haut et un très bas** : ton travail est à 9, ta joie à 3. Tu donnes beaucoup là où tu es reconnu·e, et tu oublies ce qui te fait vibrer.",
      "**Des domaines qui se tiennent** : quand ton énergie est basse, tout le reste baisse avec elle. Parfois, nourrir un seul domaine fait remonter les autres.",
      "**Un domaine que tu as oublié** : tu n'avais pas pensé à ton chez-moi depuis des mois, et tu réalises qu'il te pèse chaque soir en rentrant.",
      "**Une surprise** : tu pensais que l'argent était ton souci principal, et c'est ta connexion à toi qui ressort la plus basse."
    ],
    exempleSpiraleTitre: 'Un exemple de petit pas',
    exempleSpirale: "Ta roue montre la joie à 3. Tu ne vas pas tout révolutionner : tu choisis de remettre une chose qui te faisait du bien. Le jeudi soir, tu ressors ta guitare, ou tu marches trente minutes sans téléphone. À la fin du mois, ta joie est à 5. Deux points, c'est énorme : la roue a commencé à tourner autrement.",
    question: { k: 'theme-envie', q: "Si, dans un an, ta vie te ressemblait vraiment, qu’est-ce qui serait différent ?", ph: "Exemple : j’aurais plus de temps pour moi, une maison qui me ressemble, et j’oserais dire ce que je pense." }
  },

  comprendre: {
    titre: 'Lire ta roue sans te juger',
    texte: [
      "Ta roue est une photo de ce moment de ta vie, pas une note sur ta valeur. Un domaine bas ne veut pas dire que tu as échoué : il te montre simplement où ton énergie a envie d'aller.",
      "Regarde d'abord tes domaines les plus hauts. Ce sont tes **appuis** : ce qui marche, ce qui te tient debout. Ils contiennent souvent des forces que tu pourras utiliser ailleurs. Si tu sais créer de beaux liens avec tes amies, tu sais aussi demander de l'aide, même au travail.",
      "Regarde ensuite tes domaines les plus bas, avec curiosité. Demande-toi ce qui leur manque, et ce qui changerait si tu gagnais un seul point. Un seul. Le coaching avance par petits pas : on ne passe pas de 3 à 9 en un mois, mais de 3 à 4, puis à 5, et c'est ce mouvement qui change une vie.",
      "Enfin, remarque les liens entre les domaines. Souvent, l'énergie, la joie et la connexion à soi montent et descendent ensemble. Les nourrir, c'est remettre de l'huile dans toute la roue."
    ],
    reperes: [
      { titre: 'Tes domaines hauts te disent…', points: [
        "ce sur quoi tu peux t’appuyer quand le reste vacille ;",
        "les forces que tu as déjà : constance, chaleur, courage, créativité ;",
        "ce que tu sais faire sans effort, et que tu peux transposer ailleurs ;",
        "ce qu’il faut protéger pendant que tu travailles le reste."
      ] },
      { titre: 'Tes domaines bas te disent…', points: [
        "où ton énergie a envie d’aller ce mois-ci ;",
        "un besoin que tu as peut-être mis de côté depuis longtemps ;",
        "parfois, une boucle qui se rejoue : c’est le rôle de ton suivi de la regarder ;",
        "où un tout petit geste peut changer le plus de choses."
      ] }
    ],
    regarderTitre: 'Pour le domaine que tu veux nourrir, demande-toi',
    regarderIntro: "Prends le domaine que tu as choisi dans ton objectif. Réponds à ces questions une par une, sans chercher la phrase parfaite.",
    regarder: [
      { k: 'roue-manque', q: "Qu’est-ce qui manque aujourd’hui dans ce domaine pour que tu te sentes mieux ?", ph: "Exemple : du temps pour moi, sans culpabilité, au moins une fois par semaine." },
      { k: 'roue-dix', q: "À quoi ressemblerait ce domaine à 10 sur 10, concrètement, dans une journée ordinaire ?", ph: "Exemple : je me lève sans me presser, je marche le matin, je lis le soir au lieu de faire défiler mon téléphone." },
      { k: 'roue-point', q: "Qu’est-ce qui te ferait gagner un seul point d’ici la fin du mois ?", ph: "Exemple : bloquer le samedi matin rien que pour moi." },
      { k: 'roue-appui', q: "Quel domaine haut de ta roue peut t’aider à nourrir celui-ci ?", ph: "Exemple : mes amitiés. Je peux proposer une balade du dimanche à mon amie." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Le [test de l'arbre de vie](arbre-de-vie.html) complète bien ta roue : il te montre en cinq minutes quelles sphères de ta vie sont lumineuses et lesquelles demandent à être nourries. Et si un domaine bas te semble lié à une histoire qui se répète, c'est le moment d'ouvrir [ton suivi](mon-suivi.html).",
    outils: [
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir les sphères lumineuses et celles à nourrir. Gardé avec sa date dans ton espace.'],
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel et tes dates clés, pour savoir où mettre ton énergie.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : repérer ce qui revient dans ta vie, et d’où ça vient.']
    ]
  },

  exercicesTitre: 'Voir, choisir, avancer',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à voir ce qui te nourrit et ce qui te vide, le deuxième à imaginer ta vie à 10 sur 10, le troisième à poser ton tout premier pas. Tu peux les faire dans l’ordre ou commencer par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: 'Ce qui me nourrit, ce qui me vide', type: 'tableau', rangs: 3,
      etiquettes: ['Dans mes journées', 'Dans mes relations', 'Dans mon cadre de vie'],
      consigne: "Pour chacun de ces trois endroits de ta vie, note ce qui te donne de l'énergie, ce qui t'en prend, et un petit ajustement possible. Pas besoin de grandes décisions : on cherche des leviers simples, que tu peux actionner dès cette semaine.",
      pourquoi: "On passe souvent nos journées à remplir des fuites sans les voir. Mettre noir sur blanc ce qui nourrit et ce qui vide, c’est retrouver le pouvoir d’agir sur ton énergie, au lieu de la subir.",
      colonnes: [
        { q: "Qu’est-ce qui te nourrit, te donne de l’énergie ?", ph: ["Exemple : mon café du matin au calme, marcher pour aller travailler", "Exemple : les appels avec ma sœur, rire avec mes collègues", "Exemple : ma plante sur le bureau, la lumière du salon le matin"] },
        { q: "Qu’est-ce qui te vide, te coûte de l’énergie ?", ph: ["Exemple : les réunions sans fin, manger devant l’écran", "Exemple : les messages tardifs de mon ex, dire oui par politesse", "Exemple : le désordre de l’entrée, le bruit de la rue"] },
        { q: "Quel petit ajustement pourrais-tu faire ?", ph: ["Exemple : déjeuner dehors deux fois par semaine", "Exemple : couper les notifications après 20 h", "Exemple : vider le meuble de l’entrée samedi"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Qu’est-ce que tu remarques ? Quel ajustement veux-tu tester en premier ?", ph: "Exemple : je me vide surtout dans les relations où je n’ose pas dire non. Je commence par couper les notifications le soir." } },

    { k: 'ex2', titre: 'Ma vie à 10 sur 10', type: 'blocs', nb: 3,
      etiquettes: ['Le domaine que je veux nourrir', 'Un deuxième domaine', 'Un domaine qui va déjà bien'],
      consigne: "Choisis trois domaines de ta roue : celui que tu veux nourrir ce mois-ci, un deuxième qui te tient à cœur, et un qui va déjà bien. Pour chacun, imagine-le à 10 sur 10, avec des détails concrets, comme si tu le vivais déjà.",
      pourquoi: "En coaching, on dit que l’on avance mieux vers une image claire que loin d’un problème. Imaginer précisément ce que serait « 10 », c’est donner une direction à ton énergie. Et regarder un domaine qui va bien te rappelle que tu sais déjà le faire.",
      astuce: "Écris au présent et avec tes sens : ce que tu vois, entends, ressens. Plus c’est concret, plus ça devient possible.",
      champs: [
        { q: "Quel domaine choisis-tu ?", ph: ["Exemple : la joie, les loisirs", "Exemple : mon chez-moi", "Exemple : mes amitiés"] },
        { q: "À 10 sur 10, à quoi ressemble ce domaine dans une journée ordinaire ?", ph: ["Exemple : je danse le mardi soir, je ris plusieurs fois par jour", "Exemple : un salon rangé et lumineux, des fleurs sur la table", "Exemple : un dîner par mois avec mes trois amies"] },
        { q: "Quel serait le premier signe que ce domaine a gagné un point ?", ph: ["Exemple : je me suis inscrit·e au cours d’essai", "Exemple : j’ai trié le meuble de l’entrée", "Exemple : c’est moi qui ai proposé le prochain dîner"] }
      ] },

    { k: 'ex3', titre: 'Mon petit pas d’un pour cent', type: 'texte',
      consigne: "Les grands changements naissent de petits pas répétés. Choisis un geste minuscule pour le domaine que tu veux nourrir, si petit qu'il est impossible de ne pas le faire : cinq minutes, une phrase, un objet déplacé. Fais-le, puis note chaque fois que tu l'as répété, et ce que tu as ressenti.",
      pourquoi: "Un pas d’un pour cent ne fait pas peur, il ne demande pas de motivation. Répété chaque jour, il crée une nouvelle habitude, et ta roue commence à s’arrondir sans que tu t’en rendes compte.",
      gestes: ["Cinq minutes de marche dehors, chaque matin", "Écrire une ligne de gratitude avant de dormir", "Envoyer un message gentil à une personne aimée", "Ranger un seul tiroir par semaine", "Mettre une musique qui te met en joie en rentrant", "Poser ton téléphone dans une autre pièce pour le dîner"],
      q: "Ton petit pas : « Chaque jour (ou chaque semaine), pour nourrir…, je vais… »",
      ph: "Exemple : chaque soir, pour nourrir ma joie, je vais mettre une chanson que j’aime et danser dans la cuisine pendant le repas.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as fait : quand, et qu’as-tu ressenti ?", ph: "Exemple : mardi soir, j’ai dansé en faisant la vaisselle. Mes enfants ont ri, je me suis senti·e légère." } }
  ],

  rituel: {
    titre: 'La feuille d’automne',
    intro: "En octobre, la nature lâche ce qui a fini son temps pour garder sa force pour l'essentiel. Ce petit rituel symbolique t'invite à faire pareil : déposer une chose que tu laisses partir, et planter l'intention de ton mois. Il se fait en dix minutes, dehors si tu peux.",
    materiel: "Une feuille d’arbre tombée (ou un petit papier si tu es en ville), un crayon, et un endroit au calme : un parc, un jardin, un balcon, ou près d’une fenêtre ouverte.",
    quand: "Fais-le en début de mois, après avoir rempli ta roue. Tu peux le refaire à la pleine lune, ou chaque fois que tu sens que tu portes trop. Certaines personnes en font un rendez-vous d’automne, chaque année.",
    etapes: [
      "Ramasse une feuille qui t’attire, ou prends un petit papier. Tiens-la dans ta main et respire trois fois profondément.",
      "Pense à une chose que tu veux laisser partir ce mois-ci : une habitude, une inquiétude, une exigence envers toi. Écris un mot pour la nommer.",
      "Dis intérieurement : « Merci pour ce que tu m’as appris. Aujourd’hui, je te laisse partir, comme l’arbre laisse tomber sa feuille. »",
      "Dépose la feuille au pied d’un arbre, dans la terre d’une plante, ou laisse le vent l’emporter. Regarde-la quelques secondes.",
      "Pose une main sur ton cœur. Dis ton intention du mois, à voix basse : ce que tu choisis de nourrir.",
      "Le soir, note ici ce que tu as déposé et l’intention que tu as plantée."
    ],
    note: { k: 'rituel-note', q: "Qu’as-tu laissé partir, et quelle intention as-tu plantée ?", ph: "Exemple : j’ai laissé partir l’idée que je dois tout réussir seul·e. J’ai planté : « Je m’accorde du temps chaque semaine. »" }
  },

  meditation: {
    titre: 'L’arbre en automne',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens tes pieds sur le sol. Imagine que, sous tes pieds, partent de fines racines qui descendent dans la terre, tranquillement, profondément. Tu es stable. Tu es soutenu·e.",
      "Ton dos devient un tronc, droit et souple à la fois. Tes bras, tes épaules, deviennent des branches. Tu es un arbre, en automne, au milieu d’une belle lumière dorée.",
      "[pause]",
      "Regarde tes feuilles. Certaines sont encore vertes, pleines de vie : ce sont les domaines de ta vie qui te nourrissent. Remercie-les.",
      "D’autres ont jauni. Elles ont fait leur temps. Une fatigue, une inquiétude, une vieille habitude. Tu n’as pas besoin de les arracher. Laisse simplement le vent passer… et regarde-les tomber doucement, une à une.",
      "[longue pause]",
      "Sens comme tes branches deviennent plus légères. Ta sève redescend vers le cœur de l’arbre, vers l’essentiel. Rien n’est perdu : tout ce qui tombe nourrira la terre pour le printemps.",
      "Maintenant, choisis une branche. Celle du domaine que tu veux nourrir ce mois-ci. Imagine qu’un petit bourgeon s’y forme, bien protégé. C’est ton intention. Elle n’a pas besoin de fleurir tout de suite. Elle est là.",
      "[pause]",
      "Dis intérieurement : « Je garde l’essentiel. Je laisse partir ce qui a fait son temps. J’avance à mon rythme. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes : le soir avant de dormir, ou un dimanche matin, près d’une fenêtre. Si tu t’endors, ce n’est pas grave : ton corps avait besoin de repos, recommence un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Une feuille qui tombe, une image, une sensation, un mot…", ph: "Exemple : j’ai vu tomber une feuille qui portait le mot « parfaite ». J’ai respiré plus large après." }
  },

  semaines: [
    { titre: 'Observer mon énergie', texte: "Chaque soir, note ton énergie de 0 à 10, et une chose qui l'a nourrie ou vidée dans la journée. Pas besoin de changer quoi que ce soit : observer suffit pour commencer.",
      exemple: "Par exemple : « Lundi : 4. Vidée par la réunion de 17 h. Nourrie par l’appel de ma mère. » À la fin de la semaine, tu verras apparaître tes vrais carburants.",
      ph: "Exemple : mon énergie remonte toujours quand je sors marcher à midi, et chute quand je mange devant l’écran." },
    { titre: 'Trois mercis par jour', texte: "Chaque soir, avant de dormir, écris ou dis trois choses pour lesquelles tu dis merci aujourd'hui, même minuscules. La gratitude entraîne ton regard à voir ce qui va bien.",
      exemple: "Par exemple : le soleil sur la table du petit-déjeuner, le sourire de la boulangère, avoir fini un dossier. C’est simple, et pourtant ça change la couleur de la semaine.",
      ph: "Exemple : j’ai remarqué que je souris plus facilement le matin depuis que je fais mes trois mercis." },
    { titre: 'Un rendez-vous avec moi', texte: "Bloque une heure dans ta semaine, rien que pour toi et pour le domaine que tu as choisi de nourrir. Note-la dans ton agenda comme un vrai rendez-vous, et honore-la.",
      exemple: "Par exemple : samedi de 10 h à 11 h, un café en terrasse avec un livre. Ou jeudi soir, un cours d’essai de danse. Si tu dois le déplacer, déplace-le, mais ne l’annule pas.",
      ph: "Exemple : j’ai tenu mon rendez-vous du samedi. J’ai eu l’impression de me retrouver." },
    { titre: 'Refaire ma roue', texte: "En fin de semaine, refais ta roue de la vie dans ton bilan et compare-la avec celle du début du mois. Tu peux aussi refaire le [test de l’arbre de vie](arbre-de-vie.html) et regarder ce qui a bougé dans [ton espace](login.html#mon-chemin).",
      exemple: "Par exemple : ta joie est passée de 3 à 5, ton énergie de 4 à 5. Un point, c’est un vrai mouvement. Remercie-toi pour ce que tu as osé ce mois-ci.",
      ph: "Exemple : mon chez-moi a gagné deux points depuis que j’ai rangé l’entrée. Je rentre le soir plus détendu·e." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-domaine', q: "Qu’est-ce qui a bougé dans le domaine que tu as choisi de nourrir ?", ph: "Exemple : ma joie. Je danse deux fois par semaine, et je me sens plus légère." },
    { k: 'fin-habitude', q: "Quelle habitude qui te fait du bien veux-tu garder ?", ph: "Exemple : mes trois mercis du soir, et mon rendez-vous du samedi." },
    { k: 'fin-appui', q: "Sur quelle force t’es-tu appuyé·e ce mois-ci ?", ph: "Exemple : ma constance. Même fatigué·e, j’ai fait mes cinq minutes de marche." },
    { k: 'fin-intention', q: "Quelle est ton intention pour novembre ?", ph: "Exemple : continuer à nourrir ma joie, et m’appuyer davantage sur mes amies.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Ce qui revient',
    texte: "Pendant que ton carnet t’aide à choisir ce que tu veux construire, ton suivi t’aide à repérer la boucle qui se rejoue dans ta vie, à voir d’où elle vient dans ton histoire, et à poser un premier geste différent. Ce que tu libères là-bas nourrit ta roue ici."
  },

  aVenir: [
    { mois: 'Novembre', titre: 'Mes forces, mes appuis', texte: "Reconnaître ce sur quoi tu peux t’appuyer : tes forces, tes ressources, et ce que ta lignée t’a transmis de beau.", image: 'assets/cartes/racines-appuis-mini.jpg' },
    { mois: 'Décembre', titre: 'Ma place, mes limites', texte: "Dire oui, dire non, et trouver ta juste place, même au cœur des fêtes.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Janvier', titre: 'Mon intention, mes valeurs', texte: "Choisir ce qui compte vraiment pour toi, et poser l’intention de ton année.", image: 'assets/guide/guide-transmission.webp' }
  ]
};
