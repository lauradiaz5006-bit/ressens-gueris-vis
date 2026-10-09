/* Genesolia · Le Cercle · Carnet d'avril 2027, « J'avance » : « Dire vrai »
   Le carnet du mois est le côté « J'avance » du Cercle : exprimer ce que l'on ressent, communication bienveillante, authenticité.
   Le côté libération (« Les secrets et les non-dits ») est dans Mon suivi (assets/suivi/2027-04.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-04',
  nomMois: 'avril 2027',
  moisSuivant: 'mai',
  titre: 'Dire vrai',
  sousTitre: "Mettre des mots sur ce que tu ressens vraiment, le dire avec douceur et clarté, et laisser fleurir des relations plus vraies.",
  pdf: '',
  image: 'assets/cartes/une-relation-vraie.jpg',
  citation: "Dire vrai, ce n’est pas tout dire. C’est ne plus faire semblant avec ce qui compte.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Mes mots vrais', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-coffret.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/faire-semblant-mini.jpg', "Arrêter de faire semblant, c’est déjà respirer."],
      semaines: ['assets/cartes/une-relation-vraie-mini.jpg', "Une seule relation vraie peut tout changer."]
    }
  },

  mots: {
    tonmois: "Lis ton mois tranquillement. Remarque ce qui te fait du bien, et ce qui te serre un peu : les deux disent quelque chose de vrai.",
    ouverture: "Dix minutes pour ta météo, ta roue et ton objectif. Ce mois-ci, regarde surtout tes relations : là où tu fais semblant, l’énergie s’en va.",
    theme: "Rien à faire ici, seulement à lire. Remarque les moments où tu te dis : « Ça, c’est moi. »",
    comprendre: "Une émotion n’est jamais de trop. Elle te montre un besoin. La nommer, c’est déjà commencer à dire vrai.",
    exercices: "Commence par le premier exercice, au calme. Tu vas peut-être découvrir combien de choses tu gardes pour toi.",
    rituel: "Ce mois-ci, ta connexion passe par les fleurs du printemps. Chaque mot vrai est une fleur que tu laisses s’ouvrir.",
    semaines: "Un petit défi de vérité chaque semaine, toujours avec douceur. Tu choisis à qui, quand et combien.",
    cloture: "Relis ton mois et remarque les relations qui ont changé, même un peu. C’est souvent là que la vérité fleurit."
  },

  theme: {
    titre: "Le mois où je dis vrai",
    texte: [
      "Avril, c’est la floraison. Les cerisiers s’ouvrent, les jardins se remplissent de couleurs, et la nature ne cache plus rien de sa vitalité. Tout ce qui attendait sous la terre pendant l’hiver se montre enfin, simplement, sans se demander si c’est trop.",
      "Ce carnet t’invite à laisser fleurir tes mots vrais. Dire « ça m’a blessé·e » au lieu de « ce n’est rien ». Dire « j’ai besoin de toi » au lieu d’attendre qu’on devine. Dire « je ne suis pas d’accord » sans claquer la porte. Dire aussi « je t’aime », « merci », « je suis fier·e de toi », ces mots qu’on garde souvent pour plus tard. Pas pour tout déballer, mais pour arrêter de faire semblant avec ce qui compte."
    ],
    sousTitre: "Pourquoi dire vrai ?",
    texte2: [
      "Faire semblant coûte beaucoup d’énergie. Sourire quand on est en colère, dire oui quand on pense non, répondre « ça va » quand ça ne va pas : chaque petit décalage entre ce qu’on ressent et ce qu’on montre fatigue un peu plus. Et il éloigne des autres, car on ne peut être vraiment proche de quelqu’un qui ne nous voit jamais tel·le que l’on est.",
      "Dire vrai ne veut pas dire être brutal·e. La **communication bienveillante** propose une façon simple de dire les choses en quatre temps : ce qui s’est passé (les faits, sans jugement), ce que tu ressens, ce dont tu as besoin, et ce que tu demandes. « Quand tu regardes ton téléphone pendant que je parle, je me sens seul·e. J’ai besoin d’attention. Est-ce que tu veux bien le poser pendant le dîner ? »",
      "Ce mois-ci, tu vas **nommer** ce que tu ressens vraiment, **apprendre** à le dire en quatre temps, et **oser** un mot vrai chaque jour. En parallèle, ton suivi « Je me libère » écoute les silences de ta famille : on apprend souvent à se taire là où les générations d’avant ont dû se taire."
    ],
    exemplesTitre: "Quand on fait semblant, au quotidien",
    exemples: [
      "**Le « ça va » automatique** : ta collègue te demande comment tu vas, tu réponds « super » alors que tu as dormi trois heures et que tu as envie de pleurer.",
      "**La colère rentrée** : ton ami arrive encore avec quarante minutes de retard, tu dis « pas de souci » et tu passes la soirée à bouder sans le dire.",
      "**Les mots tendres gardés pour plus tard** : tu penses souvent que tu es fier·e de ta fille, mais tu ne le lui as jamais dit avec ces mots.",
      "**Le reproche au lieu du besoin** : tu lances « tu ne m’aides jamais » alors que tu voulais dire « je suis épuisé·e, j’ai besoin d’aide ce soir ».",
      "**Le masque au travail** : tu ris aux blagues qui te mettent mal à l’aise, pour ne pas passer pour quelqu’un de rabat-joie."
    ],
    exempleSpiraleTitre: "Un exemple de petit pas",
    exempleSpirale: "Ton compagnon te demande : « Ça va ? » D’habitude, tu réponds « oui » et tu ranges la cuisine en silence. Cette fois, tu poses le torchon, tu respires et tu dis : « Pas vraiment. Je me sens débordée, j’aurais besoin que tu t’occupes du bain des enfants ce soir. » Il dit : « Bien sûr. » Une phrase vraie, et la soirée a changé de couleur.",
    question: { k: 'theme-vrai', q: "Qu’est-ce que tu aimerais enfin dire, à quelqu’un ou à toi-même, si tu n’avais pas peur de la réaction ?", ph: "Exemple : à ma mère, que ses remarques sur mon poids me blessent depuis des années. À moi, que j’ai envie de changer de travail." }
  },

  comprendre: {
    titre: "Comprendre ce que tu ressens, pour mieux le dire",
    texte: [
      "Avant de dire vrai aux autres, il faut savoir ce qui est vrai pour toi. Beaucoup d’entre nous ont appris à ne pas trop sentir : « Arrête de pleurer », « Ne fais pas ta colère », « Ce n’est rien ». Alors on ne sait plus très bien si l’on est triste, fâché·e, fatigué·e ou inquiet·e. On sent juste que « ça ne va pas ».",
      "Il existe quatre grandes émotions de base, et chacune a son message. La **joie** dit : ce besoin est comblé, continue. La **tristesse** dit : tu as perdu quelque chose, ou il te manque du lien. La **colère** dit : une limite a été franchie, ou quelque chose est injuste. La **peur** dit : tu as besoin de sécurité. Aucune n’est mauvaise : toutes sont des messagères.",
      "Derrière chaque émotion se cache un **besoin** : du respect, de l’attention, du repos, de la reconnaissance, de la tendresse, de la liberté. Quand on dit son besoin plutôt que son reproche, l’autre peut entendre sans se défendre. « Tu ne m’écoutes jamais » ferme la porte. « J’ai besoin que tu m’écoutes cinq minutes » l’ouvre.",
      "Enfin, dire vrai, c’est aussi choisir. Tu n’as pas à tout dire à tout le monde. Tu peux choisir la personne, le moment et les mots. La vérité la plus utile est souvent dite au calme, à la première personne, avec un peu de tendresse."
    ],
    reperes: [
      { titre: "Tu dis vrai quand…", points: [
        "ce que tu dis ressemble à ce que tu ressens ;",
        "tu parles de toi (« je me sens… ») plutôt que de l’autre (« tu es… ») ;",
        "tu oses demander ce dont tu as besoin, clairement ;",
        "tu peux dire non sans mentir sur la raison."
      ] },
      { titre: "Tu fais encore semblant quand…", points: [
        "tu souris alors que tu as envie de partir ;",
        "tu dis « comme tu veux » alors que tu as une préférence ;",
        "tu ressasses le soir ce que tu n’as pas dit la journée ;",
        "tu dis à tout le monde que ça va, sauf à ton oreiller."
      ] }
    ],
    regarderTitre: "Pour dire plus vrai ce mois-ci, demande-toi",
    regarderIntro: "Prends ces questions une par une. Tu n’as pas à agir tout de suite : commence simplement par être honnête avec toi.",
    regarder: [
      { k: 'vrai-semblant', q: "Avec qui fais-tu le plus semblant en ce moment, et sur quoi ?", ph: "Exemple : avec ma belle-sœur. Je fais comme si ses remarques ne me touchaient pas." },
      { k: 'vrai-emotion', q: "Quelle émotion as-tu le plus de mal à montrer : la tristesse, la colère, la peur ou même la joie ?", ph: "Exemple : la colère. Chez nous, une fille en colère était « hystérique »." },
      { k: 'vrai-besoin', q: "Quel besoin se cache derrière ce que tu n’oses pas dire ?", ph: "Exemple : le besoin de respect. J’aimerais qu’on me demande avant de décider pour moi." },
      { k: 'vrai-tendre', q: "Quel mot tendre gardes-tu pour plus tard, et à qui pourrais-tu le dire ce mois-ci ?", ph: "Exemple : « Je suis fière de toi », à mon fils, qui a eu son permis." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Les [cartes Genesolia](cartes.html) peuvent t’aider à ouvrir une conversation vraie : tire-en une avec un·e proche, et parlez de ce que sa phrase vous inspire. Et si tu sens que tes silences ressemblent à ceux de ta famille, c’est le moment d’ouvrir [ton suivi](mon-suivi.html).",
    outils: [
      ['cartes.html', 'Tirer une carte à deux', "Une phrase pour ouvrir une conversation vraie avec quelqu’un que tu aimes."],
      ['mon-guide.html', 'Mon guide du mois', "Ton nombre du mois, ton ciel et tes dates clés, pour choisir le bon moment pour une conversation importante."],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', "Ce mois-ci : écouter les silences de ta famille et oser, à ton rythme, poser une question."]
    ]
  },

  exercicesTitre: "Ressentir, formuler, oser",
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à démêler ce que tu ressens vraiment, le deuxième à le dire en quatre temps, le troisième à oser un mot vrai chaque jour. Tu peux les faire dans l’ordre ou commencer par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: "Ce que je ressens vraiment", type: 'tableau', rangs: 3,
      etiquettes: ['Une situation qui m’a contrarié·e', 'Une situation où j’ai fait semblant', 'Une situation qui m’a touché·e'],
      consigne: "Choisis trois situations récentes : une qui t’a contrarié·e, une où tu as fait semblant, une qui t’a touché·e. Pour chacune, décris ce qui s’est passé en restant sur les faits, puis l’émotion et le besoin qui étaient là, et enfin ce que tu aurais aimé dire.",
      pourquoi: "Démêler les faits, l’émotion et le besoin, c’est le cœur de la communication bienveillante. Quand tu sais ce que tu ressens et de quoi tu as besoin, les mots justes viennent beaucoup plus facilement.",
      colonnes: [
        { q: "Que s’est-il passé, concrètement, sans jugement ?", ph: ["Exemple : mon chef a donné mon dossier à un collègue sans m’en parler", "Exemple : ma sœur m’a demandé si j’aimais son nouveau canapé", "Exemple : ma voisine m’a apporté une soupe un soir où j’étais débordée"] },
        { q: "Quelle émotion, et quel besoin derrière ?", ph: ["Exemple : de la colère, et un besoin de respect et de confiance", "Exemple : de la gêne, et un besoin d’honnêteté sans blesser", "Exemple : une grande émotion, et un besoin de lien comblé"] },
        { q: "Qu’aurais-tu aimé dire ?", ph: ["Exemple : « J’aurais aimé que tu m’en parles avant. »", "Exemple : « Ce n’est pas mon style, mais je vois qu’il te plaît beaucoup. »", "Exemple : « Ton geste m’a vraiment touchée, merci. »"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Qu’est-ce que tu remarques sur ce que tu gardes pour toi, et quel mot aimerais-tu dire en premier ?", ph: "Exemple : je garde surtout les mots tendres. Je commence par remercier ma voisine pour sa soupe, même trois semaines après." } },

    { k: 'ex2', titre: "Dire en quatre temps", type: 'blocs', nb: 3,
      etiquettes: ['Avec un·e proche', 'Au travail', 'Avec ma famille'],
      consigne: "Choisis trois situations où tu aimerais dire quelque chose de vrai. Pour chacune, prépare ta phrase en quatre temps : ce qui s’est passé (les faits), ce que tu ressens, ce dont tu as besoin, et ce que tu demandes concrètement. Lis-la à voix haute pour voir si elle te ressemble.",
      pourquoi: "Les quatre temps évitent les reproches et les généralités (« toujours », « jamais ») qui font fermer les oreilles. Préparer ses phrases à l’avance permet de les dire calmement, même quand l’émotion est là.",
      astuce: "Une bonne demande est concrète, réalisable, et laisse à l’autre la liberté de dire non. « Est-ce que tu veux bien… ? » plutôt que « Il faudrait que tu… ».",
      champs: [
        { q: "Que s’est-il passé, et comment te sens-tu ?", ph: ["Exemple : quand tu regardes ton téléphone pendant que je te parle, je me sens seule", "Exemple : quand je reçois des mails à 22 h, je me sens sous pression", "Exemple : quand tu commentes mon assiette au repas, je me sens jugée"] },
        { q: "De quoi as-tu besoin ?", ph: ["Exemple : j’ai besoin d’attention et de vraie présence", "Exemple : j’ai besoin de repos et de limites claires", "Exemple : j’ai besoin de respect et de liberté"] },
        { q: "Que demandes-tu, concrètement ?", ph: ["Exemple : « Est-ce que tu veux bien poser ton téléphone pendant le dîner ? »", "Exemple : « Est-ce qu’on peut garder les urgences pour le téléphone, et le reste pour le lendemain ? »", "Exemple : « Est-ce que tu veux bien me laisser choisir ce que je mange, sans commentaire ? »"] }
      ] },

    { k: 'ex3', titre: "Un mot vrai par jour", type: 'texte',
      consigne: "Chaque jour de ce mois, dis un mot vrai à quelqu’un : un ressenti, un besoin, un désaccord, un merci, un compliment sincère, une limite. Commence par les plus faciles. Note-les ici avec ce qui s’est passé et ce que tu as ressenti.",
      pourquoi: "On ne devient pas authentique d’un coup : on le devient mot après mot. Commencer par des vérités douces (un merci, un compliment) entraîne ta voix et ton cœur, et rend les vérités plus difficiles un peu plus faciles.",
      gestes: ["Répondre honnêtement à « Comment ça va ? »", "Dire un merci précis : « Merci d’avoir… »", "Dire à quelqu’un ce que tu admires chez lui ou chez elle", "Exprimer une préférence au lieu de « comme tu veux »", "Dire « ça m’a blessé·e » calmement", "Dire « je ne suis pas d’accord, et c’est ok »"],
      q: "Ton mot vrai : « Ce mois-ci, je vais oser dire chaque jour… »",
      ph: "Exemple : ce mois-ci, je vais oser dire chaque jour une chose vraie, en commençant par répondre honnêtement à « ça va ? » et par dire merci avec des mots précis.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque mot vrai : à qui, ce que tu as dit, et ce que tu as ressenti", ph: "Exemple : lundi, à mon père : « Je suis contente que tu sois venu. » Il a eu les yeux qui brillent. Moi aussi." } }
  ],

  rituel: {
    titre: "Le bouquet des mots vrais",
    intro: "En avril, tout fleurit : les arbres, les talus, les jardins. Ce rituel symbolique t’invite à composer un bouquet où chaque fleur porte un mot vrai que tu veux laisser s’ouvrir dans ta vie. Il se fait en quinze minutes, dehors si tu peux, en pleine floraison.",
    materiel: "Quelques fleurs ou branches fleuries ramassées en balade (ou achetées), un vase ou un verre d’eau, de petits papiers, un crayon et un ruban si tu en as un.",
    quand: "Fais-le en début de mois, après avoir rempli ta roue. Garde ton bouquet tout le temps qu’il dure, et relis tes papiers chaque fois que tu changes l’eau. Quand les fleurs fanent, tu peux les rendre à la terre.",
    etapes: [
      "Promène-toi et choisis trois à cinq fleurs ou branches qui t’attirent. Respire leur parfum et remercie la nature pour cette saison.",
      "Chez toi, installe-toi au calme. Sur chaque petit papier, écris un mot vrai que tu veux oser dire ce mois-ci : « merci », « non », « j’ai besoin », « je t’aime », « ça m’a blessé·e »…",
      "Pour chaque fleur, lis son mot à voix haute, puis place la fleur dans le vase en disant : « Je laisse ce mot s’ouvrir, comme cette fleur. »",
      "Noue le ruban autour du vase, ou pose les papiers au pied du bouquet.",
      "Pose une main sur ton cœur et dis ton intention du mois : à qui, et comment, tu veux dire plus vrai.",
      "Place le bouquet à un endroit où tu le verras chaque jour. Le soir, note ici les mots que tu as choisis."
    ],
    note: { k: 'rituel-note', q: "Quels mots vrais as-tu mis dans ton bouquet, et à qui as-tu envie de les dire ?", ph: "Exemple : « non », « j’ai besoin d’aide » et « je suis fière de toi ». Le dernier est pour ma fille, cette semaine." }
  },

  meditation: {
    titre: "Le verger en fleurs",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens ton corps se poser. Tes épaules descendent. Ta gorge se détend. Tu n’as rien à dire, rien à prouver. Juste être là, tel·le que tu es.",
      "Imagine un verger au mois d’avril. Les arbres sont couverts de fleurs blanches et roses. Une brise légère fait tomber quelques pétales qui tournoient dans la lumière. L’air sent bon. Tout est vivant, et rien ne se cache.",
      "[pause]",
      "Au milieu du verger, un petit lac à l’eau très claire. Approche-toi et regarde ton reflet. Il te montre ce que tu ressens vraiment, sous le sourire, sous le « ça va ». Regarde-le sans juger : de la fatigue, peut-être, de la tristesse, de la colère, ou une joie que tu n’oses pas montrer.",
      "Accueille ce que tu vois. Dis intérieurement : « Je te vois. Tu as le droit d’être là. » Sens comme ton reflet s’adoucit quand tu le reconnais.",
      "[longue pause]",
      "Maintenant, pense à une personne à qui tu aimerais dire quelque chose de vrai. Imagine-la assise au pied d’un arbre en fleurs, détendue, prête à t’écouter. Approche-toi tranquillement.",
      "Entends-toi lui dire tes mots, calmement, à la première personne. Pas de reproche, pas de tempête. Juste ce que tu ressens, et ce dont tu as besoin. Vois comment elle t’écoute. Vois comme tes épaules deviennent légères.",
      "[pause]",
      "Dis-toi intérieurement : « Mes mots vrais ont le droit de fleurir. Je peux dire ce que je ressens, avec douceur, et rester aimé·e. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais cette séance un soir tranquille, ou avant une conversation importante. Si une émotion monte en regardant ton reflet, laisse-la passer, reviens à ton souffle, et arrête-toi si tu en as besoin : tu peux revenir au verger un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Ton reflet, une personne, des mots, une sensation…", ph: "Exemple : mon reflet était triste derrière le sourire. J’ai dit à mon frère que je me sentais seule, et j’ai senti ma gorge se dénouer." }
  },

  semaines: [
    { titre: "La météo du cœur", texte: "Trois fois par jour (matin, midi, soir), arrête-toi dix secondes et demande-toi : « Qu’est-ce que je ressens, là ? » Nomme ton émotion avec un mot précis : joie, tristesse, colère, peur, ou leurs nuances.",
      exemple: "Par exemple : « Matin : inquiète. Midi : agacée. Soir : apaisée. » Mettre un mot précis sur une émotion la rend souvent plus légère. Tu peux mettre une alarme sur ton téléphone pour y penser.",
      ph: "Exemple : j’ai découvert que je dis « fatiguée » alors que je suis souvent triste. Ça m’a fait réfléchir." },
    { titre: "Écouter vraiment", texte: "Cette semaine, lors d’une conversation par jour, écoute l’autre sans l’interrompre, sans préparer ta réponse, sans donner de conseil. Juste écouter. Puis reformule ce que tu as entendu : « Si je comprends bien, tu te sens… »",
      exemple: "Par exemple : ton ado te raconte sa journée. Au lieu de dire « tu aurais dû… », tu dis : « Si je comprends bien, tu t’es senti mis de côté. » Dire vrai commence aussi par écouter vrai.",
      ph: "Exemple : ma fille m’a parlé vingt minutes sans s’arrêter. Elle ne l’avait pas fait depuis des mois." },
    { titre: "Le message vrai", texte: "Cette semaine, écris un message vrai à une personne qui compte : un merci profond, une admiration, un souvenir précieux, ou une chose que tu n’as jamais osé dire. Prends le temps de choisir tes mots, puis envoie-le.",
      exemple: "Par exemple : « Je repensais à l’été où tu m’as appris à nager. Je ne te l’ai jamais dit, mais c’est l’un de mes plus beaux souvenirs. Merci. » Ces mots-là changent souvent une relation.",
      ph: "Exemple : j’ai écrit à mon ancienne professeure de piano. Elle m’a répondu le soir même, très émue." },
    { titre: "Un vrai oui, un vrai non", texte: "Cette semaine, avant chaque oui, demande-toi : « Est-ce que j’en ai envie ? » Dis au moins un vrai non (doux et clair) et un vrai oui (joyeux et entier). En fin de semaine, refais ta roue de la vie dans ton bilan.",
      exemple: "Par exemple : « Non, je ne pourrai pas garder ton chien ce week-end, j’ai besoin de repos. » Et : « Oui, avec plaisir, j’adorerais venir à ton atelier ! » Un vrai oui a une autre saveur quand on sait aussi dire non.",
      ph: "Exemple : j’ai dit non à une soirée qui ne me tentait pas. Le oui suivant, à mon amie, était beaucoup plus joyeux." }
  ],

  bilanTitre: "Ce que ce mois a fait fleurir",
  bilan: [
    { k: 'fin-mot-vrai', q: "Quel mot vrai as-tu osé dire ce mois-ci, et qu’est-ce qu’il a changé ?", ph: "Exemple : j’ai dit à ma belle-sœur que ses remarques me blessaient. Elle s’est excusée, et nos repas sont plus légers." },
    { k: 'fin-relation', q: "Quelle relation est devenue plus vraie, et comment le sens-tu ?", ph: "Exemple : avec mon compagnon. On se dit plus facilement ce qui ne va pas, et on se dispute moins." },
    { k: 'fin-emotion', q: "Quelle émotion as-tu appris à mieux reconnaître ou à mieux exprimer ?", ph: "Exemple : la tristesse. Je la cachais derrière la fatigue, maintenant je peux dire « je suis triste »." },
    { k: 'fin-intention', q: "Quelle est ton intention pour mai ?", ph: "Exemple : continuer mes mots vrais, et prendre davantage de temps pour moi, sans culpabiliser.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Les secrets et les non-dits',
    texte: "Pendant que ton carnet t’aide à dire vrai, ton suivi t’invite à écouter les silences de ta famille, à repérer les indices, et à choisir, à ton rythme, ce que tu veux en faire. On apprend souvent à se taire là où les générations d’avant ont dû se taire. Ce que tu libères là-bas rend ta parole plus libre ici."
  },

  aVenir: [
    { mois: 'Mai', titre: 'Prendre soin de moi', texte: "Faire de ton quotidien un allié : rythme, repos, plaisirs simples et énergie retrouvée.", image: 'assets/cartes/se-retrouver-mini.jpg' },
    { mois: 'Juin', titre: 'Oser agir', texte: "Passer de l’envie à l’action, lancer ce projet qui t’attend, un pas après l’autre.", image: 'assets/cartes/prochain-pas-mini.jpg' },
    { mois: 'Juillet', titre: 'Ma valeur', texte: "Oser ta juste valeur : recevoir, demander, et laisser entrer l’abondance.", image: 'assets/guide/guide-coffret.webp' }
  ]
};
