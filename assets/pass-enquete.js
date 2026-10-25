/* Genesolia · Le Pass · « Mon enquête » : les étapes, une par une.
   Ce n'est pas le livre « L'enquête de ma lignée » recopié : c'est sa version vivante, reliée à ton arbre, à ton fil d'or,
   à ton ciel et à tes nombres, avec une part d'intuition et d'invisible. Chaque étape renvoie au livre pour aller plus loin.
   Chaque étape : titre, souffle (ce qu'on cherche), enquete (ce que tu fais, avec les outils du site), ressens (questions d'intuition,
   les réponses sont gardées), geste (le geste invisible), livre (ce que le livre ajoute), outils [texte, lien]. */
window.PASS_ENQUETE = [
  {
    id: 'fil', court: 'Le premier fil', titre: 'Tirer le premier fil',
    souffle: 'Toute enquête commence par un détail qui ne laisse pas tranquille. Le tien, c’est ce que tu as ressenti. Avant les noms et les dates, pose ce qui t’a marqué·e : c’est le fil d’or qui va guider tout le reste.',
    enquete: ['Ouvre ton fil d’or et note au moins trois moments de ta vie : l’âge que tu avais, ce qui s’est passé, ce que tu as ressenti.', 'Ajoute une personne de ta famille dont tu sens que l’histoire résonne avec la tienne, même si tu en sais peu.'],
    ressens: ['Quel moment de ta vie est revenu en premier, sans que tu le cherches ?', 'Si ton histoire avait une couleur aujourd’hui, laquelle serait-elle ?'],
    geste: 'Avant de commencer, pose une main sur ton cœur et dis à voix basse : « J’ouvre mon enquête avec douceur. Je prends ce qui vient, je laisse le reste pour plus tard. »',
    livre: 'Dans le livre, ton fil d’or se dessine à la main, génération après génération, avec les couleurs de chaque émotion.',
    outils: [['Ouvrir mon fil d’or', 'fil-d-or.html']],
    condition: 'fil'
  },
  {
    id: 'noms', court: 'Les noms', titre: 'Les noms qui te portent',
    souffle: 'Derrière chaque prénom, une vie entière. Rassembler les noms, c’est déjà rendre une place à chacun. Tu n’as pas besoin de tout savoir : un prénom, une ville, une année approximative suffisent pour commencer.',
    enquete: ['Complète ton arbre sur trois générations : tes parents, tes grands-parents, et plus loin si tu peux.', 'Ajoute les dates que tu connais, même seulement l’année : elles viendront nourrir ton agenda.', 'Marque d’un point d’interrogation ce que tu supposes : c’est une piste, pas une erreur.'],
    ressens: ['Quel prénom de ta lignée te touche sans que tu saches pourquoi ?', 'Y a-t-il quelqu’un dont tu ne connais même pas le prénom ? Que ressens-tu face à ce vide ?'],
    geste: 'Écris le prénom de chacun de tes quatre grands-parents sur un petit papier, plie-les ensemble et garde-les quelques jours près de ton lit. Note le premier rêve ou la première pensée qui vient au réveil.',
    livre: 'Le livre te donne une page pour chaque ancêtre, jusqu’à la cinquième génération, à remplir à la main et à transmettre.',
    outils: [['Compléter mon arbre', 'genosociogramme.html']]
  },
  {
    id: 'voix', court: 'Les voix', titre: 'Les voix de ta lignée',
    souffle: 'Ceux qui sont encore là gardent des souvenirs que personne n’a écrits. Ce qui compte n’est pas seulement ce qui s’est passé, mais ce qu’ils ont ressenti. Une question posée avec douceur peut ouvrir une porte fermée depuis cinquante ans.',
    enquete: ['Choisis une personne vivante de ta famille : ta mère, une tante, un grand-père, un cousin plus âgé.', 'Pose-lui une seule question cette semaine, par exemple : « Qu’as-tu ressenti quand tu as quitté ta maison d’enfance ? »', 'Note ses mots exacts, même ceux qui semblent anodins.'],
    ressens: ['Qu’as-tu ressenti dans ton corps pendant qu’elle ou il te répondait ?', 'Qu’est-ce qui n’a pas été dit, et que tu as quand même entendu ?'],
    geste: 'Avant l’échange, allume une bougie ou ouvre une fenêtre, et pose l’intention d’écouter sans juger. Après, remercie à voix haute, même si la personne n’est plus en face de toi.',
    livre: 'Le livre propose des entretiens complets, une page par personne qui raconte : ta mère, ton père, tes quatre grands-parents, et d’autres voix.',
    outils: [['Les questions à poser à sa famille', 'questions-a-poser-a-sa-famille.html']]
  },
  {
    id: 'dates', court: 'Les dates', titre: 'Les dates qui se répondent',
    souffle: 'Certaines périodes de l’année pèsent sans raison apparente. Une fatigue en novembre, une tension au printemps, une tristesse autour d’un anniversaire. Parfois, la mémoire de la lignée se loge dans le calendrier.',
    enquete: ['Ouvre ton agenda : les naissances, les départs et les dates de ta lignée y apparaissent.', 'Repère un mois qui revient souvent, chez toi et chez les autres.', 'Regarde les échos d’âge : l’âge que tu as aujourd’hui, qu’ont vécu les tiens à ce même âge ?'],
    ressens: ['Y a-t-il un moment de l’année où tu te sens différente, sans savoir pourquoi ?', 'Quelle date de ta lignée te donne envie de t’arrêter un instant ?'],
    geste: 'Choisis une date de ta lignée dans ton agenda et active son rappel. Ce jour-là, prends une minute pour penser à cette personne, et dis-lui simplement : « Je te vois. »',
    livre: 'Le livre a un calendrier des dates de ta lignée sur douze mois, pour les voir toutes d’un seul regard.',
    outils: [['Mon agenda', '#agenda'], ['Le syndrome d’anniversaire', 'syndrome-anniversaire.html']]
  },
  {
    id: 'repete', court: 'Ce qui revient', titre: 'Ce qui revient',
    souffle: 'Un même métier, un même prénom, une même façon de partir ou de rester. Ce qui se répète n’est pas une fatalité : c’est un message qui attend d’être lu. Le voir, c’est déjà commencer à choisir.',
    enquete: ['Ouvre l’analyse de ton arbre : ce qui se répète, les prénoms transmis, les places dans la fratrie.', 'Choisis une seule répétition, celle qui te parle le plus.', 'Cherche où elle commence : chez qui l’as-tu vue pour la première fois ?'],
    ressens: ['Cette répétition, la portes-tu aussi ? Où la sens-tu dans ta vie aujourd’hui ?', 'Qu’a-t-elle protégé, autrefois, dans ta famille ?'],
    geste: 'Prends une ficelle ou un fil de laine. Fais un nœud pour chaque personne qui porte cette répétition. Garde-le quelques jours, puis défais le dernier nœud, le tien, en disant : « Je vois, et je choisis. »',
    livre: 'Le livre explique dix-huit thèmes de la mémoire familiale, avec pour chacun ce qu’il faut demander et un exercice.',
    outils: [['Ce qui se répète dans mon arbre', 'genosociogramme.html']]
  },
  {
    id: 'absents', court: 'Les absents', titre: 'Les absents et les silences',
    souffle: 'Dans chaque famille, il y a ceux dont on parle peu. Un enfant parti trop tôt, une tante dont on a perdu la trace, un premier amour effacé. Ces places vides ont souvent beaucoup à dire.',
    enquete: ['Repère dans ton arbre une personne dont on parle peu, ou une case restée vide.', 'Note ce que tu sais d’elle, même une phrase entendue enfant.', 'Si tu le peux, demande avec délicatesse : « Tu te souviens d’elle ? »'],
    ressens: ['Qui manque, dans ton arbre ? Que ressens-tu en pensant à cette place vide ?', 'Si cette personne pouvait te dire une phrase, laquelle serait-elle ?'],
    geste: 'Écris le prénom de cette personne (ou « toi que je ne connais pas ») sur un papier. Pose-le près d’une fenêtre ou d’une plante pendant une nuit. Le lendemain, dis : « Tu as ta place. » Puis range-le dans ton carnet.',
    livre: 'Le livre a un registre des mystères, pour noter ce qui reste à découvrir sans forcer les portes.',
    outils: [['Les secrets de famille', 'secret-de-famille.html']]
  },
  {
    id: 'corps', court: 'L’intuition', titre: 'Ce que ton corps sait déjà',
    souffle: 'Tu n’as pas besoin de tout comprendre pour sentir. Ton corps, tes rêves, tes élans soudains en savent souvent plus que ta tête. Cette étape t’invite à écouter ce qui ne passe pas par les mots.',
    enquete: ['Pendant une semaine, note chaque matin un rêve, une image ou une sensation au réveil.', 'Relis ton fil d’or : quelle émotion revient le plus souvent ?', 'Remarque où tu la sens dans ton corps : la gorge, la poitrine, le ventre, les épaules.'],
    ressens: ['Quand tu penses à ta lignée, où ça se passe dans ton corps ?', 'Quel rêve ou quelle image t’est venu cette semaine ? Qu’a-t-il voulu te dire, à ton avis ?'],
    geste: 'Allonge-toi trois minutes, les mains sur le ventre. Imagine une lumière douce qui descend de la tête aux pieds. À chaque expiration, laisse partir ce qui ne t’appartient pas. À chaque inspiration, accueille ce qui te nourrit.',
    livre: 'Le livre relie les rêves qui reviennent à la mémoire de la lignée, avec des pistes pour les écouter.',
    outils: [['Les rêves qui reviennent', 'reves-recurrents-et-memoire-familiale.html'], ['Mon fil d’or', 'fil-d-or.html']]
  },
  {
    id: 'ciel', court: 'Ton ciel', titre: 'Le ciel et les nombres de ta lignée',
    souffle: 'Les dates de naissance de ta famille dessinent aussi un ciel et des nombres. Certains reviennent d’une génération à l’autre, comme une signature. C’est une autre façon de lire ton histoire, plus symbolique.',
    enquete: ['Ouvre la numérologie de ta famille : les chemins de vie qui se répètent.', 'Regarde ton thème astral et celui d’un parent : qu’ont-ils en commun ?', 'Lis ton mois personnel : qu’est-ce qu’il éclaire de ton enquête en ce moment ?'],
    ressens: ['Quel nombre ou quel signe revient dans ta lignée ? Qu’évoque-t-il pour toi ?', 'Qu’est-ce que ce ciel te donne envie d’oser ?'],
    geste: 'Une nuit claire, regarde le ciel quelques minutes. Pense à ceux qui ont regardé ce même ciel avant toi, et remercie-les en silence pour ce qu’ils t’ont transmis de lumineux.',
    livre: 'Le livre relie chaque thème à ce que tu peux transformer, avec ton arbre de vie à compléter.',
    outils: [['Mon mois', 'mon-mois.html'], ['Mon thème numérologique', 'theme-numerologique.html'], ['Mon thème astral', 'theme-astral.html']]
  },
  {
    id: 'delier', court: 'Délier', titre: 'Délier, rendre, garder',
    souffle: 'Tu as vu, tu as ressenti, tu as compris. Il est temps de choisir. Rendre ce qui ne t’appartient pas, avec amour, et garder ce qui te fait grandir. Ce n’est pas renier sa famille : c’est s’en libérer pour mieux l’aimer.',
    enquete: ['Fais deux listes : ce que ta lignée t’a donné de précieux, ce que tu portes et qui n’est pas à toi.', 'Choisis une seule chose à rendre maintenant.'],
    ressens: ['Qu’est-ce que tu rends aujourd’hui ? À qui ?', 'Qu’est-ce que tu gardes précieusement, et que tu veux transmettre ?'],
    geste: 'Écris une lettre qui ne sera pas envoyée : « Je te rends… Je garde… Merci pour… » Lis-la à voix haute, puis brûle-la en sécurité, ou enterre-la au pied d’un arbre. Regarde la fumée ou la terre emporter ce qui n’est plus à toi.',
    livre: 'Le livre accompagne cette étape en neuf temps, avec une lettre à ta lignée et une autre aux générations futures.',
    outils: []
  },
  {
    id: 'lumiere', court: 'La lumière', titre: 'Mettre ta lignée en lumière',
    souffle: 'Ton enquête a rendu une place à chacun. Il reste à honorer ce chemin : mettre ta lignée en lumière, et choisir ce que tu transmets à ceux qui viendront après toi.',
    enquete: ['Crée « Ma lignée en lumière » : chaque personne de ta lignée dans sa sphère de lumière, entre la Terre et le ciel.', 'Écris une phrase pour ceux qui viendront après toi.'],
    ressens: ['Qu’est-ce qui a changé en toi depuis le début de ton enquête ?', 'Quelle phrase veux-tu laisser aux générations futures ?'],
    geste: 'Place ton image de lumière (imprimée ou sur ton téléphone) là où tu la vois chaque jour. Le matin, pose ton regard sur elle et dis : « Je suis portée. Je porte la lumière plus loin. »',
    livre: 'Le livre se termine par sa transmission : à qui le confier, pour que l’histoire continue.',
    outils: [['Créer ma lignée en lumière', 'genosociogramme.html#lumiere']]
  }
];

/* Les questions d'intuition du jour : une par jour, toujours la même pour une date donnée */
window.PASS_QUESTIONS = [
  'Quel geste de ta mère ou de ta grand-mère refais-tu sans y penser ?',
  'Si une ancêtre pouvait t’accompagner aujourd’hui, laquelle choisirais-tu ?',
  'Quelle phrase de ta famille entends-tu encore dans ta tête ?',
  'Qu’est-ce qui t’a rendu·e fier·e de ta lignée, une seule fois ?',
  'Quel lieu de ta famille aimerais-tu revoir ?',
  'Quelle émotion as-tu le droit de vivre, que les tiens n’avaient pas ?',
  'Qu’est-ce que tu fais différemment de tes parents, et qui te fait du bien ?',
  'Quel objet de famille aimerais-tu tenir dans tes mains aujourd’hui ?',
  'À quel âge as-tu senti, pour la première fois, que tu étais « de cette famille-là » ?',
  'Qu’est-ce qui, dans ton histoire, mérite un merci ?',
  'Quelle recette, quelle chanson ou quel parfum te ramène à ta lignée ?',
  'Qui, dans ta famille, a osé quelque chose de neuf ? Qu’est-ce que ça t’autorise ?',
  'Qu’est-ce que tu as reçu sans qu’on te l’ait jamais dit ?',
  'Si ton arbre avait une saison aujourd’hui, laquelle serait-elle ?',
  'Quel silence de ta famille aimerais-tu doucement rompre ?',
  'Qui t’a appris à aimer, et comment ?',
  'Quelle force de tes ancêtres sens-tu en toi en ce moment ?',
  'Qu’est-ce que tu veux arrêter de porter, dès cette semaine ?',
  'Quelle trace veux-tu laisser à ceux qui viendront ?',
  'Qu’est-ce que ton intuition te souffle sur ta lignée, aujourd’hui ?',
  'Quel prénom de ta famille aimerais-tu entendre plus souvent ?'
];

/* ───────── Le Pass · le chemin d'un ressenti (version 2) ─────────
   Chaque ressenti déposé devient un « fil » qui suit le même chemin, comme une boucle qui devient spirale :
   Voir (ce qui se passe) → À qui ça appartient (moi ou ma lignée, racine ou cœur) → Enquêter (questions, où chercher)
   → Libérer → La spirale (ce qui change). Les pistes ci-dessus (PASS_ENQUETE) servent dans « Enquêter ».
   Libérer et La spirale reprennent les clés de libération de Laura (clés 1, 2 et 3), en tutoiement. */
window.PASS_FIL = {
  EMOTIONS: ['Peur', 'Peur de manquer', 'Tristesse', 'Colère', 'Honte', 'Culpabilité', 'Solitude', 'Impuissance', 'Vide', 'Fatigue'],   /* les mêmes que le fil d'or */
  BLESSURES: [['abandon', 'Abandon'], ['rejet', 'Rejet'], ['trahison', 'Trahison'], ['humiliation', 'Humiliation'], ['injustice', 'Injustice']],
  CORPS: ['La gorge', 'La poitrine', 'Le ventre', 'Les épaules', 'La tête', 'Le dos', 'Les mains', 'Partout', 'Je ne sais pas'],
  PEURS: ['Peur de manquer', 'Peur d’être abandonné·e', 'Peur de ne pas avoir ma place', 'Peur de déplaire', 'Peur d’être trahi·e', 'Peur de réussir', 'Peur d’être vu·e', 'Peur du conflit', 'Peur de perdre ceux que j’aime', 'Peur de ne pas être assez'],
  /* Le chemin d'une mémoire : voir, la situer dans le temps, libérer, poser l'intention, réapprendre */
  ETAPES: [
    { id: 'voir', titre: 'Voir', court: 'La prise de conscience',
      souffle: 'Le corps réagit avant la tête : la gorge qui se serre, le ventre qui se contracte. C’est ton alarme. Fais un petit pas de côté : « Tiens, voilà la peur qui arrive. » Tu la décris, donc tu n’es pas elle. Regarde ce qui, dans ta vie et dans ta lignée, ressemble à ce que tu vis : c’est la mémoire qui se montre.' },
    { id: 'aqui', titre: 'Où est-elle ?', court: 'Sur la ligne du temps',
      souffle: 'Une mémoire est toujours quelque part sur la ligne du temps : dans ta vie, à un âge où une partie de toi s’est figée, ou plus haut, dans ta lignée, chez quelqu’un qui l’a portée avant toi. Ton intuition sait souvent où avant ta tête.' },
    { id: 'liberer', titre: 'Libérer', court: 'Rendre ou retrouver',
      souffle: 'Une mémoire non libérée est comme une bulle sombre où une part de ton énergie est restée figée. Libérer, c’est faire circuler à travers elle une énergie plus claire, comme de l’eau chaude sur un glaçon : elle fond, et l’énergie te revient. En la libérant, tu libères aussi ta lignée, celle d’avant et celle qui vient.' },
    { id: 'intention', titre: 'L’intention', court: 'Poser la première pierre',
      souffle: 'Une mémoire libérée laisse un espace. Si tu ne le remplis pas, l’ancienne histoire revient s’y loger. L’intention, c’est ce que tu choisis d’y mettre : bien centré·e, posée du plus profond de toi, puis lâchée avec confiance. L’énergie suit l’intention.' },
    { id: 'reapprendre', titre: 'Réapprendre', court: 'Le corps, les pensées, les gestes',
      souffle: 'Une mémoire a appris à ton corps à se mettre en alerte, parfois depuis des générations. Après l’intention vient le vrai travail : réapprendre la sécurité au corps, d’autres pensées, d’autres gestes. Petit à petit, la boucle devient spirale.' }
  ],
  /* Les trois portes de la ligne du temps */
  PORTES: [
    ['vie', 'Dans ma vie', 'Une partie de moi s’est figée à un âge'],
    ['lignee', 'Dans ma lignée', 'Quelqu’un l’a portée avant moi'],
    ['ancienne', 'Plus ancienne', 'Je ne sais pas d’où, mais elle est vieille']
  ],
  /* Libérer selon la porte (avant les étapes communes de la clé 1) */
  LIB_PORTE: {
    vie: { titre: 'Retrouver la partie de toi', etapes: ['Ferme les yeux. Vois-toi à {age}, dans la scène où tout s’est figé. Regarde-toi avec douceur.', 'Dis-lui : « Je te vois. Tu as fait de ton mieux. Tu n’as plus besoin de rester là : je suis grand·e maintenant, je m’occupe de nous. »', 'Tends-lui la main. Imagine qu’elle revient vers toi et se pose dans ton cœur. L’énergie restée figée là-bas circule de nouveau en toi.'] },
    lignee: { titre: 'Libérer {qui}', etapes: ['Vois {qui} devant toi, dans une lumière douce. Regarde ce qu’elle ou il a traversé.', 'Dis-lui : « Je te vois. Ce que tu as porté était lourd. Je te rends ce qui t’appartient, avec respect et avec amour. Je garde ta force. »', 'Vois le paquet se déposer devant elle ou lui, puis la lumière l’envelopper et le dissoudre. Elle ou il peut se reposer, et toi, avancer.'] },
    ancienne: { titre: 'Libérer pour toute la lignée', etapes: ['Vois un faisceau de lumière descendre en toi, puis à travers tes racines, génération après génération, aussi loin que tu peux sentir.', 'Dis : « À celles et ceux qui ont porté cette mémoire avant moi : je vous vois. Je la libère pour nous tous. »', 'Laisse la lumière remonter jusqu’à toi. Ce qui était lourd devient léger.'] }
  },
  /* « À qui ça appartient ? » : nommer (livre, clé 1, étape 2) */
  INTUITION: [
    'Qui a déjà vécu cette situation dans ma famille ? Un parent ? Plus loin ?',
    'D’où vient cette peur, cette colère, cette honte ?',
    'Est-ce vraiment ce qui se passe… ou une vieille mémoire qui se rejoue ?',
    'Si ce ressenti avait un âge, quel âge aurait-il ?'
  ],
  CYCLES: {
    racine: { nom: 'Cycle 1', court: 'le cycle 1', texte: 'Survivre, le droit d’exister, ta place, ta sécurité, ne pas manquer.', signes: ['peur de manquer, même quand tout va bien', 'difficile de prendre ta place ou de demander', 'besoin de tout contrôler, de tout prévoir'] },
    coeur: { nom: 'Cycle 2', court: 'le cycle 2', texte: 'Aimer et être aimé·e, tes liens, la peur d’être quitté·e.', signes: ['des relations qui se ressemblent', 'donner beaucoup pour être aimé·e', 'peur d’être quitté·e, ou partir avant'] }
  },
  /* Enquêter : ce que tu peux demander, et où chercher, selon le cycle */
  QUESTIONS: {
    racine: ['Où vivaient-ils ? Ont-ils dû quitter une maison, une terre, un pays ?', 'Y a-t-il eu un manque d’argent, une faillite, une maison perdue ?', 'Un enfant confié, placé, né hors mariage ou reconnu tard ?', 'Qui a dû travailler très jeune, ou tout porter pour les autres ?', 'Quelle phrase sur l’argent ou la sécurité revenait à table ?'],
    coeur: ['Comment se sont-ils rencontrés ? Étaient-ils libres de choisir ?', 'Y a-t-il eu un premier amour avant, une séparation, un veuvage, un remariage ?', 'Un enfant préféré, un enfant moins regardé ?', 'Qui est parti, et qui a été quitté ?', 'Que disait-on de l’amour, du mariage, des hommes, des femmes ?']
  },
  BLESSURE_Q: {
    abandon: 'Qui, dans ta lignée, a perdu quelqu’un trop tôt, ou a été laissé seul ?',
    rejet: 'Qui n’a pas été attendu, ou pas désiré comme il était ?',
    trahison: 'Une promesse rompue, un héritage disputé, une confiance perdue ?',
    humiliation: 'Une honte qu’on cachait : une faute, une pauvreté, une naissance ?',
    injustice: 'Qui a été traité autrement que les autres, dans la fratrie ou ailleurs ?'
  },
  OU: {
    racine: [['Les recensements', 'les archives départementales en ligne : qui vivait sous le même toit, les métiers'], ['Les actes de naissance', 'les mentions en marge : reconnaissance, adoption, mariage, décès'], ['Les registres matricules', 'les archives départementales : les parcours de guerre des hommes de ta lignée'], ['Les actes notariés', 'une maison vendue, un héritage, une dette']],
    coeur: [['Les actes de mariage', 'les témoins, la date à comparer avec la naissance du premier enfant'], ['Les mentions de divorce', 'en marge des actes de mariage et de naissance'], ['Les lettres et les photos', 'le dos des photos, les faire-part, les cartes gardées dans une boîte'], ['Le livret de famille', 'les enfants nés, ceux partis trop tôt, les remariages']],
    tous: [['Ceux qui sont encore là', 'une seule question, posée avec douceur'], ['Le cimetière', 'les tombes réunissent parfois ceux qu’on ne connaissait pas']]
  },
  /* Libérer : clé 1, libérer la mémoire ; clé 2, la couche profonde, quand le thème revient */
  LIBERER: {
    respirer: 'Inspire lentement par le nez (5 secondes), retiens (2 secondes), expire longuement par la bouche (7 secondes). Au moins trois fois. La respiration coupe le pilote automatique : ton corps voulait réagir « comme d’habitude ».',
    phrase: 'Je te vois, mémoire de {nom}. Je te reconnais, mémoire de {source}. Merci d’être là, car tu me permets de libérer les mémoires de ma lignée et d’y mettre fin.',
    phraseProfonde: 'Je te vois, mémoire de {nom}. Je te reconnais, mémoire de {source}. Je comprends maintenant que tu étais cachée sous la première couche. Merci de te révéler maintenant, car je suis prêt·e à te libérer. Tu me permets de libérer les mémoires les plus profondes de ma lignée et d’y mettre fin.',
    transmuter: [
      'Ferme les yeux et porte ton attention sur ton cœur. À chaque inspiration, tu reçois l’énergie de vie. À chaque expiration, elle grandit, comme un phare de plus en plus lumineux, rempli d’amour, de paix et de clarté.',
      'Vois la mémoire comme une boule sombre ou une fumée. À chaque expiration, le phare de ton cœur envoie sa lumière vers elle. Dis-lui intérieurement : « Stop, je te reconnais. Je t’aime. Maintenant, retourne au soleil. »',
      'Regarde-la monter vers le soleil et se dissoudre complètement dans sa lumière. Souffle après souffle, laisse le calme s’installer.',
      'Si l’émotion est forte, tapote doucement le haut de ton ventre et laisse-la te traverser pendant que tu continues.'
    ],
    profond: [
      'Vois un faisceau de lumière descendre en toi, puis à travers tes racines, jusqu’à tes ancêtres.',
      'Il traverse la mémoire de celle ou celui qui l’a portée avant toi, et de toute la lignée.',
      'À chaque inspiration, envoie un jet de lumière vers la mémoire, puis vers l’ancêtre. Dis intérieurement : « Je libère cette mémoire pour nous tous. »'
    ],
    mantras: ['Je suis libre de toutes mémoires.', 'Je suis la paix en action.', 'Je suis en sécurité.'],
    reorienter: ['De quoi ai-je vraiment besoin dans cette situation ?', 'Quelle réponse serait alignée avec qui je veux être, et non avec qui ma lignée était ?', 'Quelle solution me ferait ressentir de la paix, de la fierté, de la cohérence ?'],
    couches: ['Quelle est la situation exacte qui s’est produite ?', 'Qu’est-ce qu’elle révèle de ma vraie peur, sous celle que j’avais déjà travaillée ?', 'Qui, dans ma lignée, a vécu cette peur très fort ?'],
    affirmation: 'Cette mémoire est libérée avec les ancêtres de ma lignée. Je choisis maintenant une nouvelle vérité : {verite}',
    gestes: [['Peur de manquer', 'Mettre 5 € de côté : « je peux garder »'], ['Peur d’être abandonné·e', 'Accepter un rendez-vous, dire oui à une invitation'], ['Peur de réussir', 'Appeler quelqu’un de ta famille et lui parler de ton projet'], ['Peur de l’échec', 'Partager ton travail, postuler à une opportunité'], ['Peur de l’autorité', 'Régler un papier administratif dans le calme']]
  },
  /* La spirale : clé 3, remplacer la mémoire */
  OPPOSES: { 'Peur': 'La sécurité', 'Peur de manquer': 'L’abondance', 'Tristesse': 'La joie', 'Colère': 'La paix', 'Honte': 'La fierté d’être moi', 'Culpabilité': 'Le droit d’être heureux·se', 'Solitude': 'Une vie entourée', 'Impuissance': 'Mon pouvoir d’agir', 'Vide': 'Ce qui me nourrit', 'Fatigue': 'L’élan' },
  ENVIES: ['Quelque chose que je veux avoir', 'Quelque chose que je veux faire', 'Quelque chose que je veux être'],
  /* Où tu en es : les phases du livre, depuis ton premier ressenti */
  PHASES: [
    [3, 'Le nettoyage de surface', 'Tu travailles les mémoires évidentes et les réactions de tous les jours. Le chemin peut servir plusieurs fois par semaine.'],
    [6, 'La consolidation', 'Les déclencheurs sont moins fréquents. Tu te sens mieux dans l’ensemble.'],
    [12, 'La stabilisation', 'Des semaines tranquilles, puis soudain une vague : ce n’est pas un retour en arrière, c’est une couche plus profonde qui devient enfin visible.'],
    [24, 'La transformation profonde', 'Tu touches les dernières racines de la lignée, une ou deux fois par mois.'],
    [999, 'L’intégration', 'Le chemin est devenu un réflexe. Les mémoires sont largement dissoutes.']
  ],
  /* L'intention : se centrer, acter, lâcher */
  INTENTION: {
    centrer: 'Pose les pieds au sol, une main sur le cœur. Respire avec la sphère jusqu’à te sentir centré·e.',
    ecrire: 'Écris-la au présent, comme si c’était déjà vrai, avec des mots qui te font vibrer.',
    exemples: ['Je suis en sécurité. Je peux recevoir et garder.', 'Je suis digne d’un amour stable.', 'Ma place existe, je la prends.', 'Mon succès honore ma lignée.'],
    acter: 'Lis-la à voix haute, la main sur le cœur, du plus profond de toi. Puis garde le doigt appuyé sur la sphère jusqu’à ce qu’elle s’allume.',
    lacher: 'C’est posé. Maintenant tu lâches : tu n’as plus à y penser ni à vérifier. Tu fais confiance, avec une foi tranquille. Elle reviendra à la nouvelle lune.'
  },
  /* Réapprendre : le suivi du corps, des pensées, des gestes et des rôles */
  REAPPRENDRE: {
    corps: 'Chaque jour, une minute : les pieds bien posés, une main sur le ventre, respire lentement et dis à ton corps : « Je suis en sécurité, ici et maintenant. » Il a appris l’alerte, il peut apprendre la sécurité.',
    pensees: 'Quand l’ancienne phrase revient, remarque-la, sans te juger, et remplace-la par ta nouvelle phrase.',
    gestes: 'Un geste différent, même minuscule, chaque fois que la situation revient.',
    lune: ['Qu’est-ce qui a bougé dans ton corps ?', 'Et dans tes pensées ?', 'Et dans tes gestes, tes réactions ?']
  },
  ROLES: [
    ['victime', 'Victime', '« Ça m’arrive toujours à moi. » Tu subis, tu attends qu’on te sauve.', 'Reprendre ton pouvoir : qu’est-ce que je peux choisir, là, maintenant ?'],
    ['sauveur', 'Sauveur', '« Sans moi, ils n’y arriveront pas. » Tu portes les autres, tu t’oublies.', 'Soutenir sans porter : laisser à l’autre sa force, et revenir à toi.'],
    ['bourreau', 'Persécuteur', '« C’est de ta faute. » Tu reproches, tu contrôles, tu durcis.', 'T’affirmer sans attaquer : dire ce dont tu as besoin.']
  ],
  /* Les rêves : symboles (des pistes, jamais des certitudes) */
  REVES: {
    types: [['emotion', 'Il parle de ce que je vis en ce moment'], ['symbole', 'Il a des symboles forts'], ['lignee', 'Quelqu’un de ma lignée y était'], ['revient', 'Il revient souvent']],
    symboles: [['Eau', 'tes émotions, leur calme ou leur tempête'], ['Maison', 'toi, ton intérieur, parfois ta lignée'], ['Chute', 'une perte de contrôle, une peur de lâcher'], ['Poursuite', 'ce que tu fuis ou évites de regarder'], ['Un défunt', 'un lien à regarder, un message, quelque chose à rendre ou à recevoir'], ['Un bébé', 'un projet neuf, une partie de toi qui naît, ou un enfant de la lignée'], ['Les dents', 'la peur de perdre, de vieillir, de ne plus pouvoir mordre dans la vie'], ['Un examen', 'la peur d’être jugée, de ne pas être à la hauteur'], ['Un voyage, un train', 'ton chemin, une étape qui commence ou qu’on rate'], ['Un animal', 'ton instinct, une force ou une peur'], ['Le feu', 'une colère, ou une transformation'], ['La lumière', 'une protection, une ouverture'], ['Être nue', 'la peur d’être vue, d’être exposée'], ['Perdre quelque chose', 'une part de toi que tu cherches']]
  },
  SPIRALE: [
    'Quand le thème est revenu, l’as-tu reconnu plus vite ?',
    'Qu’as-tu fait autrement, même un tout petit peu ?',
    'Qu’est-ce qui est plus léger dans ton corps aujourd’hui ?'
  ],
  /* La question qui revient à chaque fois */
  QUESTION: 'À qui est cette incohérence, cette distorsion dans mon être ? À un parent ? Plus loin ? Est-ce que je répète un problème de cette vie, ou une mémoire plus ancienne ?',
  AQUI: [['moi', 'De cette vie : un problème que je répète'], ['parent', 'D’un parent'], ['loin', 'De plus loin dans ma lignée'], ['ancienne', 'D’une mémoire plus ancienne, je ne sais pas d’où']],
  HUMEURS: ['Paix', 'Joie', 'Élan', 'Gratitude', 'Fatigue', 'Tristesse', 'Inquiétude', 'Colère', 'Vide'],
  /* Les protocoles de libération. Pour en ajouter un : { id, titre, court, etapes: [{ titre, texte }], questions: ['…'] }.
     cle1 et cle2 ont leur affichage complet (respiration guidée, phrase qui se compose, etc.). */
  PROTOCOLES: [
    { id: 'cle1', titre: 'Libérer la mémoire', court: 'Respirer, nommer, reconnaître, transmuter, réorienter. Quand une mémoire s’active.' },
    { id: 'cle2', titre: 'La couche profonde', court: 'Quand le thème revient alors que tu l’avais déjà travaillé.' }
  ],
  /* Les pistes du livre à proposer dans « Enquêter », selon le cycle */
  PISTES: { racine: ['noms', 'dates', 'absents', 'ciel'], coeur: ['voix', 'repete', 'corps', 'absents'] }
};
