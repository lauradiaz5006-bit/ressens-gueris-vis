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
    geste: 'Avant l’échange, allume une bougie (de préférence en cire d’abeille) ou ouvre une fenêtre, et pose l’intention d’écouter sans juger. Après, remercie à voix haute, même si la personne n’est plus en face de toi.',
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
  /* Une seule liste du corps et des sensations partout (dépôt, fiche, note du jour, suivi) : sinon aucun rapprochement possible */
  CORPS: ['La tête', 'La gorge', 'La poitrine', 'Le ventre', 'Les épaules', 'Le dos', 'Les mains', 'Les jambes', 'Partout', 'Je ne sens rien'],
  SENSATIONS: ['Serré', 'Lourd', 'Chaud', 'Froid', 'Agité', 'Vide', 'Calme'],
  /* Les blessures dites avec les phrases qu'on se dit */
  BLESSURES_P: { abandon: 'On me laisse', rejet: 'Je n’ai pas ma place', trahison: 'Je ne peux compter sur personne', humiliation: 'J’ai honte, on me rabaisse', injustice: 'Ce n’est pas juste, je dois être parfait·e' },
  /* Le nom proposé pour un schéma : ce qui se répète, pas l'émotion (modifiable) */
  NOMS: { abandon: 'la peur d’être quitté·e', rejet: 'la peur de ne pas avoir ma place', trahison: 'la peur d’être trahi·e', humiliation: 'la peur d’être rabaissé·e', injustice: 'la peur de ne pas être assez', 'Peur de manquer': 'la peur de manquer', 'Solitude': 'la peur d’être seul·e', 'Honte': 'la peur d’être rabaissé·e', 'Culpabilité': 'la peur de mal faire', 'Impuissance': 'la peur de ne rien pouvoir', 'Colère': 'la colère qui monte', 'Peur': 'la peur qui revient', 'Tristesse': 'la tristesse qui revient', 'Vide': 'le vide qui revient', 'Fatigue': 'la fatigue qui revient' },
  /* Ce que je veux à la place, l'intention et les gestes, selon la blessure */
  PAR_BLESSURE: {
    abandon: { place: 'Une présence qui reste, à commencer par la mienne', intention: 'Je suis digne d’un amour qui reste. Je ne me quitte plus.', gestes: ['Dire oui à une invitation', 'Appeler quelqu’un, juste pour prendre des nouvelles', 'Passer une heure seul·e, avec douceur, sans rien prouver'] },
    rejet: { place: 'Ma place, sans avoir à la mériter', intention: 'Ma place existe, je la prends.', gestes: ['Donner ton avis une fois, en réunion ou en famille', 'T’asseoir au milieu, pas au bord', 'Demander une chose dont tu as besoin'] },
    trahison: { place: 'La confiance, à commencer par moi', intention: 'Je peux faire confiance, et je tiens mes promesses envers moi.', gestes: ['Confier une petite tâche sans la vérifier', 'Tenir une promesse faite à toi-même', 'Dire à quelqu’un ce que tu attends de lui'] },
    humiliation: { place: 'La fierté d’être moi', intention: 'Je suis fier·ère d’être moi. Ma voix compte.', gestes: ['Recevoir un compliment en disant juste merci', 'Montrer quelque chose que tu as fait', 'Porter un vêtement que tu aimes vraiment'] },
    injustice: { place: 'La justesse, et le droit d’être imparfait·e', intention: 'Je suis assez, tel·le que je suis. Je peux recevoir et garder.', gestes: ['Laisser une chose imparfaite, volontairement', 'Mettre 5 € de côté : « je peux garder »', 'T’accorder une pause sans la justifier'] }
  },
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
    racine: { nom: 'L’insécurité', court: 'l’insécurité', texte: 'Survivre, le droit d’exister, ta place, ta sécurité, ne pas manquer.', signes: ['peur de manquer, même quand tout va bien', 'difficile de prendre ta place ou de demander', 'besoin de tout contrôler, de tout prévoir'] },
    coeur: { nom: 'Le relationnel', court: 'le relationnel', texte: 'Aimer et être aimé·e, tes liens, la peur d’être quitté·e.', signes: ['des relations qui se ressemblent', 'donner beaucoup pour être aimé·e', 'peur d’être quitté·e, ou partir avant'] }
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
  /* Libérer : clé 1, libérer la mémoire ; clé 2, quand ça revient plus fort, quand le thème revient */
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
    exemples: ['Je suis en sécurité, ici et maintenant.', 'Je suis digne d’un amour stable.', 'Ma place existe, je la prends.', 'Mon succès honore ma lignée.'],
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
    ['sauveur', 'Sauveur·euse', '« Sans moi, ils n’y arriveront pas. » Tu portes les autres, tu t’oublies.', 'Soutenir sans porter : laisser à l’autre sa force, et revenir à toi.'],
    ['bourreau', 'Persécuteur·rice', '« C’est de ta faute. » Tu reproches, tu contrôles, tu durcis.', 'T’affirmer sans attaquer : dire ce dont tu as besoin.']
  ],
  /* Les rêves : symboles (des pistes, jamais des certitudes) */
  REVES: {
    types: [['emotion', 'Il parle de ce que je vis en ce moment'], ['symbole', 'Il a des symboles forts'], ['lignee', 'Quelqu’un de ma lignée y était'], ['revient', 'Il revient souvent']],
    symboles: [['Eau', 'tes émotions, leur calme ou leur tempête'], ['Maison', 'toi, ton intérieur, parfois ta lignée'], ['Chute', 'une perte de contrôle, une peur de lâcher'], ['Poursuite', 'ce que tu fuis ou évites de regarder'], ['Un défunt', 'un lien à regarder, un message, quelque chose à rendre ou à recevoir'], ['Un bébé', 'un projet neuf, une partie de toi qui naît, ou un enfant de la lignée'], ['Les dents', 'la peur de perdre, de vieillir, de ne plus pouvoir mordre dans la vie'], ['Un examen', 'la peur d’être jugé·e, de ne pas être à la hauteur'], ['Un voyage, un train', 'ton chemin, une étape qui commence ou qu’on rate'], ['Un animal', 'ton instinct, une force ou une peur'], ['Le feu', 'une colère, ou une transformation'], ['La lumière', 'une protection, une ouverture'], ['Être nu·e', 'la peur d’être vu·e, d’être exposé·e'], ['Perdre quelque chose', 'une part de toi que tu cherches']]
  },
  SPIRALE: [
    'Quand le thème est revenu, l’as-tu reconnu plus vite ?',
    'Qu’as-tu fait autrement, même un tout petit peu ?',
    'Qu’est-ce qui est plus léger dans ton corps aujourd’hui ?'
  ],
  /* La fiche « Mon schéma » : ce qui relie les ressentis entre eux */
  SCHEMA: {
    couleurs: { abandon: '#6B2F5B', rejet: '#D9705F', trahison: '#B98A55', humiliation: '#C2466E', injustice: '#4E5D94' },   /* les mêmes partout, sans vert */
    domaines: ['Couple', 'Argent', 'Travail', 'Famille', 'Amis', 'Corps', 'Moi-même'],
    sensations: ['Serré', 'Lourd', 'Chaud', 'Froid', 'Agité', 'Vide', 'Calme'],
    reactions: ['Fuir', 'Contrôler', 'Tout donner', 'Me taire', 'Me justifier', 'Attaquer', 'M’effacer', 'Me couper de tout'],
    tiroirs: [['sais', 'Je sais'], ['raconte', 'On m’a raconté'], ['suppose', 'Je suppose']],
    statuts: [['comprendre', 'À comprendre'], ['liberation', 'En libération'], ['suivi', 'En suivi'], ['classe', 'Devenu spirale']],
    personnages: ['la Petite fille', 'le Petit garçon', 'l’Invisible', 'la Forte', 'le Fort', 'la Sauveuse', 'le Sauveur', 'la Gentille', 'le Gentil', 'la Délaissée', 'le Délaissé', 'la Parfaite', 'le Parfait', 'la Victime', 'la Gardienne', 'le Soldat', 'la Peur'],
    roles: [['victime', 'Victime'], ['sauveur', 'Sauveur·euse'], ['bourreau', 'Persécuteur·rice'], ['controle', 'Je contrôle tout'], ['effacee', 'Je m’efface']],
    neuf: [['Émergence', 'Quelque chose attire ton attention. Tu sens qu’un même schéma est à l’œuvre.'], ['Initiation', 'Tu commences à observer. Tu repères ce qui déclenche la répétition.'], ['Rencontre avec l’ombre', 'Ce que tu évitais de regarder apparaît clairement.'], ['Épreuves', 'La situation se rejoue, parfois plus fort, comme pour être enfin vue.'], ['Lâcher l’ancien', 'L’ancienne façon de réagir n’a plus de sens. Tu la laisses partir.'], ['Transformation', 'Ce que tu as vécu devient une compréhension, et non plus un poids.'], ['Élévation', 'Tu agis autrement, naturellement, sans avoir à te forcer.'], ['Transmission', 'Ce que tu as compris profite à ceux qui t’entourent et à ceux qui viennent après toi.'], ['Renaissance', 'Le thème n’est plus une question. Le cycle est complet.']]
  },
  /* Mes actions : les 10 protocoles de Laura (validés le 02/11/2026) + « Si ça monte fort ». Étapes : { t: titre, x: texte } (\n = retour à la ligne, « - » = puce). */
  ACTIONS: [
 {
  "id": "vie",
  "titre": "Reviens à la première fois",
  "court": "Pour libérer un schéma qui se répète dans ta vie, dans tes pensées, tes actes ou des cycles qui reviennent toujours.",
  "duree": "15 à 20 minutes · au calme",
  "pour": "vie",
  "visuel": "01-vie",
  "avertissement": "Si tu portes des événements très lourds (violences, abus, perte brutale…), ne fais pas ce chemin seul·e. Fais-toi accompagner par un·e psychologue ou un·e professionnel·le en qui tu as confiance.",
  "prepare": "Offre-toi un espace rien qu’à toi. Baisse la lumière, allume une bougie (de préférence en cire d’abeille) si tu en as envie, éteins ce qui pourrait te déranger. Ce temps t’appartient.\nSi tu en ressens le besoin, appelle à tes côtés une présence qui t’accompagne : ton guide, un être de lumière, ou une force plus grande, comme ton toi du futur, celui ou celle que tu deviens, plus sage et apaisé·e. Sens cette présence s’installer près de toi. Tu n’es pas seul·e.",
  "trouver": [
   "Respire avec la sphère : 5 secondes pour inspirer, 2 pour retenir, 7 pour expirer, trois fois.",
   "Repense à ce que tu as déposé : {nom}. Laisse la sensation revenir dans ton corps, là où tu la sens.",
   "Demande-toi doucement : « Quand je ressens ça, je me sens quel âge ? » Ne cherche pas, laisse venir le premier âge, même flou.",
   "Laisse venir une scène, même floue : un lieu, une lumière, quelqu’un qui est là. Tu n’as pas besoin de la date exacte : un âge à peu près, une scène floue, c’est déjà assez.",
   "Regarde l’enfant que tu étais avec douceur. Dis-lui : « Je te vois. Tu as fait de ton mieux. Je suis grand·e maintenant, je m’occupe de nous. »",
   "Tends-lui la main, et laisse-la revenir dans ton cœur. Puis note l’âge et la scène qui sont venus."
  ],
  "fin": "Si une émotion devient trop forte, ouvre les yeux, pose tes pieds bien à plat sur le sol et respire. Tu pourras reprendre plus tard.",
  "apres": "Un autre jour, si tu le sens, continue ton chemin avec « Le retour de mes énergies ».",
  "etapes": [
   {
    "t": "Descends en toi",
    "x": "Ferme les yeux. Laisse ta respiration ralentir, doucement, jusqu’à ce que le dehors s’éloigne.\nPuis tourne ton attention vers l’intérieur. Ce schéma qui revient, où le ressens-tu dans ton corps ? Une gorge serrée, un poids sur la poitrine, un vide au creux du ventre… Ne cherche pas à le chasser. Écoute-le simplement : il a quelque chose à te montrer."
   },
   {
    "t": "Remonte le fil du temps",
    "x": "Demande-toi tout bas : « Quand ai-je ressenti cela pour la toute première fois ? »\nLaisse venir un souvenir, même récent : il y a quinze jours, il y a cinq ans. Puis descends encore, d’un souvenir à l’autre, comme on descend les marches de sa propre histoire. (Ta présence guide marche à tes côtés.)\nContinue jusqu’à la toute première fois. Bien souvent, c’est là, dans l’enfance ou à l’adolescence, que tout a commencé."
   },
   {
    "t": "Retrouve l’enfant que tu étais",
    "x": "Le voici. L’enfant que tu étais, dans ce lieu, à ce moment-là. Regarde son visage, sa posture, ce qu’il ou elle porte de trop lourd pour son âge.\nApproche-toi doucement et tends-lui la main. L’adulte que tu es aujourd’hui est enfin venu·e le chercher."
   },
   {
    "t": "Dis-lui la vérité",
    "x": "Penche-toi vers l’enfant que tu étais et dis-lui tout ce qui n’était pas normal, tout ce qui était injuste pour lui ou pour elle à ce moment-là. Mets des mots sur ce que personne n’a dit.\nPuis rassure l’enfant que tu étais. Prends-le dans tes bras, longuement. Laisse-lui sentir qu’il ou elle compte, enfin."
   },
   {
    "t": "Rends ce qui ne t’appartient pas",
    "x": "Tourne-toi maintenant vers l’adulte en face de vous, souvent un parent. (Si c’est difficile, ta présence guide se tient juste derrière toi et te prête sa force.)\nDepuis la place de l’enfant, à voix haute ou dans le silence de ton cœur, dis ce que tu ressens et là où tu n’es pas d’accord :\n« Maman, ce n’est pas normal, ce qui vient de se passer. »\n« Je ressens de la… et je te la rends. Elle n’est plus à moi. »\n« Nos rôles ont été inversés. Je reprends ma place d’enfant. »\n« Cette violence, je n’en veux plus. »\nTu as le droit de dire stop. Fais de même avec chaque adulte présent."
   },
   {
    "t": "Libère le lien",
    "x": "Observe ce qui te relie à cette personne. Peut-être une liane, une corde, un fil d’énergie, une ombre… Laisse ta visualisation faire le travail, à sa manière :\n- tu peux le couper, avec un objet tranchant que tu imagines ;\n- tu peux le transformer, le nettoyer, le laisser se dissoudre dans la lumière ;\n- tu peux le couper, puis laisser naître à sa place un lien doré, fait seulement d’amour et de paix.\nChaque personne est différente : fais ce que tu ressens, toi. (Ta présence guide peut t’aider si tu en as besoin.)"
   },
   {
    "t": "Referme la porte",
    "x": "Prends l’enfant que tu étais par la main. Ensemble, quittez cette pièce. (Ta présence guide vous ouvre le chemin.)\nEn sortant, dis-lui : « Tu es avec moi maintenant. Tu es en sécurité. Tu as le droit d’être qui tu es. »\nPuis referme la porte derrière vous. Écoute-la se fermer. Ce souvenir a fini de te retenir."
   },
   {
    "t": "Accueille l’enfant que tu étais en toi",
    "x": "Ouvre ton cœur et accueille l’enfant que tu étais à l’intérieur de toi. Sens son énergie reprendre sa place, au chaud, en sécurité. Vous ne faites plus qu’un.\nRespire ce sentiment d’unité. Remercie ta présence guide, puis reviens doucement, à ton rythme, et ouvre les yeux."
   }
  ]
 },
 {
  "id": "energies",
  "titre": "Le retour de mes énergies",
  "court": "Quand des souvenirs parasites reviennent, que certaines situations t’enferment et te font répéter les mêmes choses.",
  "duree": "15 à 30 minutes · au calme",
  "pour": "",
  "visuel": "02-energies",
  "avertissement": "Si tu portes des événements très lourds (violences, abus, perte brutale…), ne fais pas ce chemin seul·e. Fais-toi accompagner par un·e psychologue ou un·e professionnel·le en qui tu as confiance.",
  "prepare": "Offre-toi un espace rien qu’à toi. Baisse la lumière, allume une bougie (de préférence en cire d’abeille) si tu en as envie, éteins ce qui pourrait te déranger. Ce temps t’appartient.\nSi tu en ressens le besoin, appelle à tes côtés une présence qui t’accompagne : ton guide, un être de lumière, ou une force plus grande, comme ton toi du futur, celui ou celle que tu deviens, plus sage et apaisé·e. Sens cette présence s’installer près de toi. Tu n’es pas seul·e.",
  "fin": "Si une émotion devient trop forte, ouvre les yeux, pose tes pieds bien à plat sur le sol et respire. Tu pourras reprendre plus tard.",
  "etapes": [
   {
    "t": "Déroule ta frise",
    "x": "Ferme les yeux et laisse ta respiration s’apaiser.\nDevant toi, imagine ta frise du temps qui se déroule : ton passé d’un côté, ton présent de l’autre. (Ta présence guide se tient à tes côtés, face à elle.)\nÉcoute ce que tu ressens. Ce problème qui revient sans cesse, toujours de la même manière : sens-le, sans le juger."
   },
   {
    "t": "Pose le premier souvenir",
    "x": "Laisse venir un souvenir lié à ce ressenti. Pose-le délicatement sur ta frise, à sa place dans le temps. Observe-le un instant, comme une scène que tu regardes de loin."
   },
   {
    "t": "Entre dans la pièce",
    "x": "Quand tu te sens prêt·e, avance vers ce souvenir et entre dedans. (Ta présence guide t’accompagne.)\nRetrouve le lieu, l’atmosphère, les personnes présentes. Et regarde ton toi du passé : la personne que tu étais, là, à ce moment-là."
   },
   {
    "t": "Rejoins ton toi du passé",
    "x": "Approche-toi de ton toi du passé et parle-lui avec douceur. Dis-lui que cette situation n’est pas confortable, que tu le vois, et que maintenant tu es là : il n’est plus seul.\nPrends ton toi du passé par la main."
   },
   {
    "t": "Libère ton toi du passé de cet endroit",
    "x": "Ensemble, quittez cette pièce et laissez derrière vous les personnes présentes. En sortant, dis :\n« Je libère mon âme de cet endroit et de cette énergie. Je coupe tous les liens avec cet espace. »\nSi tu vois des liens, des fils ou quoi que ce soit qui vous retient, libère-les à ta manière : coupe, nettoie, dissous dans la lumière. Fais ce que tu ressens. (Ta présence guide peut t’aider.)"
   },
   {
    "t": "Referme la porte",
    "x": "Referme la porte derrière vous. S’il n’y en a pas, crée-en une, belle et solide, puis referme-la. Ce lieu n’a plus de prise sur toi."
   },
   {
    "t": "Mets ton toi du passé en sécurité",
    "x": "Emmène ton toi du passé dans un endroit doux et lumineux, un lieu où il fait bon être. (Ta présence guide veille sur vous.)\nRassure ton toi du passé. Dis-lui que tu l’aimes, que tout va bien maintenant. Puis dis-lui :\n« Maintenant, tu es avec moi. Ton énergie est de retour en moi. Nous sommes ensemble. »\nSens cette énergie revenir en toi comme un·e partenaire retrouvé·e, une force qui te rend plus entier·e et plus puissant·e."
   },
   {
    "t": "Poursuis le long de ta frise",
    "x": "D’autres souvenirs attendent peut-être sur ta frise. Pour chacun, reprends le même chemin, de l’étape 2 à l’étape 7, à ton rythme.\nQuand tu as terminé, remercie ta présence guide, respire profondément, et reviens doucement à l’instant présent."
   }
  ]
 },
 {
  "id": "intention",
  "titre": "De la tête au cœur avec intention",
  "court": "Pour redescendre en toi, te recentrer, t’ancrer et te reconnecter à ta source.",
  "duree": "15 à 20 minutes · au calme",
  "pour": "intention",
  "visuel": "03-intention",
  "prepare": "Choisis un endroit propre et calme, où personne ne viendra te déranger. Si tu le souhaites, allume une bougie, de préférence en cire d’abeille. Installe-toi confortablement, le dos droit, les pieds posés au sol.",
  "etapes": [
   {
    "t": "Respire et laisse partir",
    "x": "Ferme les yeux. Pendant deux minutes, respire lentement et profondément.\nÀ chaque expiration, imagine que tu laisses sortir tout ce qui ne te convient plus, comme une fumée sombre qui quitte ton corps et se dissout dans l’air.\nÀ chaque inspiration, accueille le prana, cette énergie pure et vivante. Sens-la entrer en toi, claire et lumineuse.\nCrois-y pleinement, comme si c’était réel, là, maintenant, dans cet instant. Parce que ça l’est."
   },
   {
    "t": "Redescends au cœur",
    "x": "Des pensées passent peut-être dans ta tête. Laisse-les passer comme des nuages, sans les retenir.\nLes yeux fermés, tu vois devant toi, même si tout est noir. Maintenant, imagine que ce regard descend doucement, jusqu’à ton cœur. Tu ne regardes plus depuis ta tête : tu regardes depuis ton cœur.\nÀ cet endroit, laisse naître une petite sphère de lumière. Garde ton attention posée là, tranquillement, et sens l’équilibre qui s’installe pendant que ta sphère brille d’elle-même."
   },
   {
    "t": "Plonge tes racines dans la terre",
    "x": "Quand tu te sens prêt·e, imagine des racines lumineuses qui naissent sous tes pieds. Ne les regarde pas seulement : accompagne-les par l’esprit.\nDescends avec elles, loin, très loin dans la terre, jusqu’en son centre. Là, laisse apparaître ce qui te ressource : des cristaux, un soleil intérieur, une lumière chaude… ce qui te parle.\nBranche tes racines à cette source. Puis remonte avec toute cette puissance, le long de tes racines, jusque dans ton corps. Sens ton corps s’emplir de lumière, tranquillement, à son rythme.\nLaisse ce mouvement continuer tout seul. Comme ton cœur qui brille avec sa sphère. Comme ta respiration qui continue avec le prana."
   },
   {
    "t": "Accueille la lumière d’en haut",
    "x": "Porte maintenant ton attention au-dessus de ta tête, assez haut. Une énergie source est déjà là. Il te suffit d’y poser ton intention pour la voir : une grande sphère de lumière.\nFais-la descendre doucement en toi :\n- dans ta tête, ton visage, ta gorge ;\n- tes épaules, tes bras, jusqu’au bout de tes doigts ;\n- ta poitrine, ton dos et ta colonne vertébrale, vertèbre après vertèbre ;\n- ton ventre, ton bassin ;\n- tes jambes, tes genoux, tes chevilles, tes pieds.\nElle nourrit ton cœur et ta sphère de lumière, elle rejoint tes racines, puis elle ressort par tes pieds et remonte jusqu’au-dessus de ta tête.\nElle forme une boucle de lumière qui circule autour de toi, comme un tore, de plus en plus grande, jusqu’à devenir une grande bulle qui t’enveloppe et te protège.\nReste ainsi quelques instants. Laisse toute cette énergie circuler en toi et autour de toi."
   },
   {
    "t": "Élève-toi",
    "x": "Quand ton corps est bien enveloppé de cette lumière, laisse ton regard monter vers la source, au-dessus de toi. Laisse-toi porter plus haut encore, toujours plus haut, jusqu’au-dessus de la planète.\nTu es enveloppé·e de lumière. Ici, tu te connectes à un autre flux d’énergie.\nTu vois une colonne de lumière qui te relie à ton corps, resté en bas. Tu n’es plus seulement ton corps : tu es là-haut, avec toi-même."
   },
   {
    "t": "Pose ton intention",
    "x": "Depuis ton cœur, choisis une intention : un vrai besoin, une envie sincère, quelque chose de positif pour toi.\nFais-la résonner autour de toi, avec amour. Puis inscris-la dans la source, dans cette colonne de lumière, comme on écrit des mots qui restent.\nSache qu’elle est entendue.\nSi aucune intention ne vient, ce n’est pas grave. Ressens simplement l’harmonie parfaite en toi, ou envoie de l’amour à la planète, à celles et ceux que tu aimes, à ce qui compte pour toi.\nPuis dis merci."
   },
   {
    "t": "Reviens dans ton corps",
    "x": "Quand tu es prêt·e, redescends doucement le long de la colonne de lumière, jusque dans ton corps, avec toute cette énergie et cette connexion.\nSens ton corps. Sens le poids de tes pieds sur le sol, l’air autour de toi, la pièce où tu te trouves. Bouge doucement les doigts.\nReviens pleinement ici. Ouvre les yeux quand tu le souhaites, et savoure cette sensation de te sentir plus léger·ère, plus aligné·e."
   }
  ]
 },
 {
  "id": "emotion",
  "titre": "Libérer une émotion",
  "court": "Quand une émotion lourde arrive, envahit ton corps et prend toute la place.",
  "duree": "5 à 10 minutes · partout où tu peux te poser",
  "pour": "",
  "visuel": "04-emotion",
  "intro": [
   "Avant tout, comprends ce qui se passe",
   "Tes émotions sont des messages de ton inconscient. Tant qu’un schéma n’est pas encore libéré, elles peuvent surgir au mauvais moment, là où il n’y a aucun danger.\nImagine : tu rencontres enfin quelqu’un qui te fait du bien, mais dans ta lignée l’amour s’est souvent mal fini. Alors ton inconscient, fidèle, sonne l’alarme : attention, danger !\nCes messages méritent d’être compris. C’est ainsi que tu apprends à écouter ceux qui te servent, et à dire à ton corps que les anciennes alertes ne sont plus nécessaires."
  ],
  "apres": "Si une image continue de revenir et de te bloquer, poursuis avec « Transmuter une image mentale ».",
  "etapes": [
   {
    "t": "Pose-toi et respire",
    "x": "Arrête-toi un instant. Une émotion arrive : quelque chose d’inconfortable, qui serre, qui pèse. Plus elle est forte, plus elle a attendu d’être écoutée.\nRespire lentement, plusieurs fois. Laisse ton souffle calmer ton corps, doucement."
   },
   {
    "t": "Trouve où elle se loge",
    "x": "Où est cette sensation dans ton corps ? Ta gorge, ta poitrine, ton plexus, ton ventre… Cherche, sans te presser. Elle est là, quelque part, et elle attend que tu la trouves."
   },
   {
    "t": "Nomme-la",
    "x": "Observe ce qui se passe réellement, sans en rajouter. Puis mets un mot dessus : la peur, la colère, la tristesse, le rejet… ou la situation qui l’a réveillée.\nSi tu en as envie, écris-le. Nommer, c’est déjà desserrer."
   },
   {
    "t": "Donne-lui une forme",
    "x": "Visualise cette émotion à l’endroit où tu la sens, comme une petite boule d’énergie brillante, de la couleur qui te vient.\nRegarde-la. Elle n’est pas ton ennemie : c’est un message."
   },
   {
    "t": "Parle-lui",
    "x": "Respire, et parle intérieurement à cette boule de lumière :\n« Je te vois. Je t’entends. Ton message appartient au passé. Tu peux calmer ton intensité, maintenant. Je vais te libérer. »\nImportant : à ce moment-là, tu parles à ton inconscient. Il te prend au mot. Si tu lui promets de libérer, de pardonner ou de changer quelque chose, fais-le vraiment. Sinon, il reviendra frapper à la porte dans une autre situation semblable.\nQuand le message vient de plus loin, d’une vieille histoire ou de ta lignée, tu pourras ensuite le libérer en profondeur avec « Reviens à la première fois » ou « Le retour de mes énergies ». Le but : que ce message ne corresponde plus à qui tu es, ni à qui tu choisis de devenir."
   },
   {
    "t": "Laisse-la partir",
    "x": "Maintenant, laisse sortir cette boule de lumière, par le chemin qui te parle :\n- par ton souffle : à chaque expiration, elle sort de toi et s’envole ;\n- par tes pieds : surtout si ce message vient de ta famille, elle descend à travers ton corps et retourne à la terre.\nRegarde-la s’éloigner… et partir."
   },
   {
    "t": "Bravo",
    "x": "Elle est sortie. Continue de respirer tranquillement. Sens l’espace qu’elle laisse en toi, plus léger, plus calme. Tu as écouté ton message, et tu l’as laissé partir."
   }
  ]
 },
 {
  "id": "image",
  "titre": "Transmuter une image mentale",
  "court": "Quand une image mentale revient sans cesse et t’apporte un malaise : un visage, une relation, une lettre des impôts… ce que tu veux.",
  "duree": "5 minutes",
  "pour": "",
  "visuel": "05-image",
  "etapes": [
   {
    "t": "Installe-toi",
    "x": "Pose-toi au calme, ferme les yeux et respire."
   },
   {
    "t": "Regarde l’image",
    "x": "Laisse venir cette image qui revient sans arrêt et qui t’apporte quelque chose d’inconfortable.\nPlace-la sur un écran ou sur une affiche. Quelle taille a-t-elle ? À quelle distance est-elle de toi : tout près, loin ?"
   },
   {
    "t": "Dis-lui adieu",
    "x": "Regarde-la bien en face et dis-lui clairement : « Je ne veux plus de toi. C’est fini. Je passe à autre chose. »"
   },
   {
    "t": "Éloigne-la et rétrécis-la",
    "x": "Maintenant, éloigne cet écran. Puis rétrécis l’image. Encore. Et encore.\nChange ses couleurs : passe-la en noir et blanc, ou au contraire en arc-en-ciel, comme tu préfères.\nRétrécis-la encore. Tu la vois déjà beaucoup moins, n’est-ce pas ?"
   },
   {
    "t": "Joue avec le son",
    "x": "Ajoute une musique qui te fait du bien, ou coupe complètement le son. Fais ce qui t’arrange, ce qui affaiblit ton lien avec cette image qui ne t’appartient plus."
   },
   {
    "t": "Brouille-la",
    "x": "Envoie-la encore plus loin, encore plus petite. Ajoute de la neige dessus, comme une vieille télé mal réglée : l’image grésille, elle se brouille."
   },
   {
    "t": "Clap de fin",
    "x": "Quand tu es prêt·e, frappe dans tes mains. Clap ! L’image disparaît complètement.\nTu ne la vois plus. Elle était devenue si petite et si lointaine qu’elle s’est effacée."
   }
  ]
 },
 {
  "id": "amour",
  "titre": "Diffuser de l’amour dans un lieu",
  "court": "Pour offrir ton amour et ta paix à ta maison, à un lieu qui compte pour toi, à ta ville, à ton pays ou au monde entier.",
  "duree": "10 à 20 minutes · au calme",
  "pour": "",
  "visuel": "06-amour",
  "intro": [
   "Avant de commencer",
   "Fais d’abord le protocole « De la tête au cœur avec intention ». Tu commences ainsi ancré·e, le cœur ouvert et lumineux, enveloppé·e de ta bulle de lumière."
  ],
  "etapes": [
   {
    "t": "Laisse ton aura grandir",
    "x": "Ressens ta sphère de lumière qui brille au cœur. À chaque respiration, laisse ton aura s’agrandir : elle dépasse ton corps, puis la pièce, et s’étend sur plusieurs mètres autour de toi.\nTu es immense, lumineux·se, et tu rayonnes."
   },
   {
    "t": "Élève-toi au-dessus des villes",
    "x": "Laisse-toi porter au-dessus du sol, doucement, puis plus haut. Sous toi apparaît un pays : la France, ou celui que tu choisis.\nSurvole une première ville. Regarde ses toits, ses rues, ses lumières."
   },
   {
    "t": "Dépose ta vague d’amour",
    "x": "Depuis ton cœur et toute ta présence, laisse jaillir ta lumière sur cette ville. Elle descend comme une immense vague d’amour, qui roule et entre partout : dans chaque rue, chaque maison, chaque recoin, chaque cœur.\nCette énergie est lumineuse et pénétrante, comme un soleil. Rien ne lui échappe. Elle enveloppe tout, avec douceur et puissance."
   },
   {
    "t": "Continue ton voyage",
    "x": "Passe à la ville suivante, puis à une autre. Laisse ta vague d’amour se déposer partout où tu passes : villes, campagnes, régions, pays entiers… le monde, si tu le souhaites.\nPrends ton temps. Il n’y a pas de limite."
   },
   {
    "t": "À toutes les échelles",
    "x": "Tu peux aussi offrir ta vague d’amour à une échelle plus petite, tout aussi précieuse : ta maison, pièce après pièce ; ton lieu de travail ; l’école de tes enfants ; un hôpital, un quartier, un lieu qui compte pour toi ; ou une personne que tu portes dans ton cœur.\nLe geste est le même : ta lumière jaillit de ton cœur et enveloppe chaque recoin, avec douceur et puissance."
   },
   {
    "t": "Reviens",
    "x": "Quand tu sens que c’est complet, dis merci. Puis reviens doucement dans ton corps, avec ta lumière en toi. Sens tes pieds sur le sol, la pièce autour de toi, et ouvre les yeux quand tu le souhaites."
   }
  ]
 },
 {
  "id": "lignee",
  "titre": "Remercier et rendre à ma lignée",
  "court": "Pour libérer un schéma hérité d’un parent ou d’un ancêtre, en lui rendant ce qui lui appartient avec amour.",
  "duree": "20 à 30 minutes · au calme",
  "materiel": "Une feuille, un stylo, une bougie (de préférence en cire d’abeille), et si tu le souhaites un bol d’eau.",
  "pour": "lignee",
  "visuel": "07-lignee",
  "avertissement": "Si tu portes des événements très lourds (violences, abus, perte brutale…), ne fais pas ce chemin seul·e. Fais-toi accompagner par un·e psychologue ou un·e professionnel·le en qui tu as confiance.",
  "prepare": "Offre-toi un espace rien qu’à toi. Baisse la lumière, allume une bougie (de préférence en cire d’abeille) si tu en as envie, éteins ce qui pourrait te déranger. Ce temps t’appartient.\nSi tu en ressens le besoin, appelle à tes côtés une présence qui t’accompagne : ton guide, un être de lumière, ou une force plus grande, comme ton toi du futur, celui ou celle que tu deviens, plus sage et apaisé·e. Sens cette présence s’installer près de toi. Tu n’es pas seul·e.",
  "fin": "Si une émotion devient trop forte, ouvre les yeux, pose tes pieds bien à plat sur le sol et respire. Tu pourras reprendre plus tard.",
  "etapes": [
   {
    "t": "Fais venir la personne de ta lignée",
    "x": "Ferme les yeux et respire. Laisse apparaître devant toi la personne de ta lignée qui porte ce schéma : un parent, une grand-mère, un ancêtre que tu as connu ou non. Vois-la dans une lumière douce, à la bonne distance pour toi. (Ta présence guide se tient à tes côtés.)"
   },
   {
    "t": "Envoie-lui de l’amour et remercie-la",
    "x": "Depuis ton cœur, envoie-lui de l’amour. Remercie-la pour tout ce qu’elle a traversé, pour la vie qu’elle a transmise, pour la force qui coule aussi en toi grâce à elle.\n« Merci pour tout ce que tu as vécu. Merci pour la vie. Je reconnais ton chemin. »"
   },
   {
    "t": "Écoute le message",
    "x": "Reste avec elle un moment et écoute ce que tu ressens. Quel message as-tu reçu d’elle sans le savoir ? Une peur, une croyance, une façon d’aimer ou de se protéger… Laisse venir les mots, les images, les sensations. Tu comprends maintenant d’où vient ce que tu portais."
   },
   {
    "t": "Écris ce que tu rends",
    "x": "Ouvre les yeux et prends ta feuille. Choisis la forme qui te parle, ou fais les deux :\n- une lettre, forte, sincère, sans retenue. Dis-lui tout ce que tu as porté pour elle, et rends-le-lui : « Cette peur t’appartient, je te la rends. » « Ce destin est le tien, pas le mien. » « Je garde ton amour et ta force, et je te rends le reste. »\n- une liste de tout ce que tu ne veux plus recevoir de cet ancêtre : « Je ne veux plus de la peur de manquer. Je ne veux plus du silence. Je ne veux plus de… »\nÉcris jusqu’à sentir que tout est dit."
   },
   {
    "t": "Libère par le feu ou par l’eau",
    "x": "Choisis ce qui te parle :\n- par le feu : brûle ta feuille à la flamme de ta bougie, en sécurité, dans un récipient résistant au feu, loin de tout objet inflammable. Regarde les mots partir en fumée ;\n- par l’eau : pose ta feuille dans un bol d’eau et laisse l’encre s’y dissoudre. Demande à l’eau : « Eau, purifie ces mémoires. » Quand tu sens que c’est fait, verse cette eau dans la terre ou laisse-la s’écouler.\nPuis demande, à voix haute ou dans ton cœur : « Je demande le nettoyage de cette mémoire, pour moi et pour toute ma lignée. »"
   },
   {
    "t": "Remets ta lignée à sa place",
    "x": "Referme les yeux. Vois toute ta lignée rassemblée, derrière toi ou quelque part dans un lieu lumineux : tes parents, tes grands-parents, et tous ceux qui sont venus avant. Ils sont ensemble, apaisés, heureux. Chacun est à sa juste place.\nToi, tu es devant, libre, soutenu·e par eux. Sens leur force dans ton dos."
   },
   {
    "t": "Reviens",
    "x": "Remercie-les une dernière fois, remercie ta présence guide, puis reviens doucement, à ton rythme, et ouvre les yeux. Éteins ta bougie toi-même, en restant près d’elle jusqu’au bout."
   }
  ]
 },
 {
  "id": "profond",
  "titre": "Quand ça revient plus fort",
  "court": "Quand ton schéma revient, parfois plus intense, alors que tu l’avais déjà travaillé.",
  "duree": "10 minutes · partout où tu peux te poser",
  "pour": "",
  "visuel": "08-profond",
  "intro": [
   "Avant tout, sache ceci",
   "Ce n’est pas un échec, et tu ne recules pas. Quand un schéma revient plus fort, c’est souvent qu’une couche plus profonde se présente, maintenant que tu es prêt·e à la voir. Tu creuses au même endroit, mais plus loin."
  ],
  "etapes": [
   {
    "t": "Respire et pose-toi",
    "x": "Arrête-toi. Respire lentement, les pieds au sol, une main sur le cœur. Rappelle-toi : tu as déjà fait une partie du chemin."
   },
   {
    "t": "Regarde la situation exacte",
    "x": "Qu’est-ce qui s’est passé, précisément ? Qui, où, quels mots, quel geste ? Écris-le simplement, sans juger."
   },
   {
    "t": "Cherche ce qu’il y a dessous",
    "x": "Demande-toi : « Qu’est-ce que cette situation réveille de plus profond ? Quelle est ma vraie peur, sous celle que je connais déjà ? »\nPeut-être une peur plus ancienne, une autre personne de ta lignée, un âge plus jeune."
   },
   {
    "t": "Reconnais ton chemin",
    "x": "Compare avec avant : tu l’as peut-être vu venir plus tôt, tu as peut-être respiré au lieu de réagir, tu es peut-être en train de lire ces lignes au lieu de t’y perdre. Tout cela, c’est du chemin parcouru. Note-le."
   },
   {
    "t": "Choisis ton protocole",
    "x": "Selon ce que tu as trouvé :\n- une émotion forte, là maintenant : « Libérer une émotion » ;\n- une image qui revient sans cesse : « Transmuter une image mentale » ;\n- un souvenir plus ancien : « Reviens à la première fois » ;\n- plusieurs souvenirs qui t’enferment : « Le retour de mes énergies » ;\n- une relation qui te retient : « Couper un lien et reprendre mon énergie » ;\n- une mémoire de ta lignée : « Remercier et rendre à ma lignée »."
   },
   {
    "t": "Sois doux·ce avec toi",
    "x": "Dis-toi : « Je suis en chemin. Chaque fois que ça revient, je vais plus loin. »"
   }
  ]
 },
 {
  "id": "corps",
  "titre": "Ancrer le nouveau, chaque jour",
  "court": "Après une libération, pour apprendre à ton corps et à tes pensées une nouvelle réponse. À faire chaque jour, pendant au moins 21 jours.",
  "duree": "3 à 5 minutes · le matin ou le soir",
  "pour": "",
  "visuel": "09-corps",
  "etapes": [
   {
    "t": "Pose-toi",
    "x": "Assieds-toi, les pieds bien à plat sur le sol, une main sur le ventre, l’autre sur le cœur. Ferme les yeux."
   },
   {
    "t": "Respire en sécurité",
    "x": "Respire lentement, en expirant plus longtemps que tu n’inspires. Dis à ton corps :\n« Je suis en sécurité, ici et maintenant. »\nIl a appris l’ancienne alerte. Aujourd’hui, tu lui apprends le calme."
   },
   {
    "t": "Rappelle ta nouvelle vérité",
    "x": "Dis la phrase qui remplace ton ancien schéma, au présent, comme si elle était déjà vraie :\n« J’ai le droit d’être aimé·e tel·le que je suis. »\n« Je suis en sécurité dans l’amour. »\n« J’ai le droit de prendre ma place. »\nChoisis la tienne et répète-la trois fois."
   },
   {
    "t": "Vois-toi vivre le nouveau",
    "x": "Imagine une situation de ta journée où l’ancien schéma aurait pu se déclencher. Vois-toi y répondre autrement : calme, aligné·e, à ta place. Sens ce que ça fait dans ton corps."
   },
   {
    "t": "Ancre-le",
    "x": "Pose un geste simple pour le garder en toi : presse ton pouce et ton index, ou garde ta main sur le cœur pendant trois respirations. Ce geste devient ton rappel : chaque fois que tu le refais dans la journée, ton corps se souvient de ta nouvelle réponse."
   },
   {
    "t": "Ouvre les yeux",
    "x": "Respire une dernière fois, profondément, et ouvre les yeux. Ta journée peut commencer, ou se terminer, avec cette nouvelle réponse en toi."
   }
  ]
 },
 {
  "id": "lien",
  "titre": "Couper un lien et reprendre mon énergie",
  "court": "Quand une relation d’aujourd’hui ou d’hier te retient encore : un ex, une emprise, une relation qui t’épuise.",
  "duree": "15 à 25 minutes · au calme",
  "pour": "",
  "visuel": "10-lien",
  "avertissement": "Si tu portes des événements très lourds (violences, abus, perte brutale…), ne fais pas ce chemin seul·e. Fais-toi accompagner par un·e psychologue ou un·e professionnel·le en qui tu as confiance.",
  "prepare": "Offre-toi un espace rien qu’à toi. Baisse la lumière, allume une bougie (de préférence en cire d’abeille) si tu en as envie, éteins ce qui pourrait te déranger. Ce temps t’appartient.\nSi tu en ressens le besoin, appelle à tes côtés une présence qui t’accompagne : ton guide, un être de lumière, ou une force plus grande, comme ton toi du futur, celui ou celle que tu deviens, plus sage et apaisé·e. Sens cette présence s’installer près de toi. Tu n’es pas seul·e.",
  "fin": "Si une émotion devient trop forte, ouvre les yeux, pose tes pieds bien à plat sur le sol et respire. Tu pourras reprendre plus tard.",
  "etapes": [
   {
    "t": "Déroule ta frise",
    "x": "Ferme les yeux et laisse ta respiration s’apaiser. Devant toi, déroule ta frise du temps. Laisse venir les moments de cette relation qui te retiennent encore. (Ta présence guide se tient à tes côtés.)"
   },
   {
    "t": "Entre dans chaque souvenir",
    "x": "Pour chaque souvenir, avance et entre dedans. Retrouve le lieu, l’atmosphère, et regarde ton toi du passé, la personne que tu étais à ce moment-là. Approche-toi, dis-lui que tu es là et qu’il n’est plus seul, et prends ton toi du passé par la main.\nEnsemble, quittez cette pièce en disant : « Je libère mon âme de cet endroit et de cette énergie. Je coupe tous les liens avec cet espace. » Referme la porte derrière vous, et emmène ton toi du passé dans un endroit doux et lumineux. Dis-lui : « Maintenant, tu es avec moi. Ton énergie est de retour en moi. Nous sommes ensemble. »\nFais de même pour chaque souvenir de cette relation."
   },
   {
    "t": "Regarde le lien",
    "x": "Maintenant, regarde la personne de cette relation, à distance. Vois le lien qui part de toi vers elle. Est-il fin comme un fil, ou épais comme une corde ? Où s’accroche-t-il sur ton corps ? Sa taille te montre combien d’énergie tu as laissée dans cette relation."
   },
   {
    "t": "Libère le lien",
    "x": "Libère-le à ta manière : coupe-le, dissous-le dans la lumière, nettoie-le. Fais ce que tu ressens. (Ta présence guide peut t’aider.)\n« Je me libère de ce lien. Je reprends ma liberté. »"
   },
   {
    "t": "Récupère ton énergie",
    "x": "Rappelle maintenant à toi toute l’énergie que tu as laissée dans cette relation. Vois-la revenir vers toi, comme une lumière qui retrouve sa maison.\nAccueille-la dans ta sphère de lumière, au cœur. Sens-la te remplir, te renforcer, te rendre entier·e.\n« Je reprends toute mon énergie. Elle m’appartient. »"
   },
   {
    "t": "Renforce ta bulle de lumière",
    "x": "Ta sphère grandit et forme autour de toi une bulle de lumière, solide et lumineuse.\nSur toute sa surface, imagine des miroirs tournés vers l’extérieur. Si un lien négatif essaie encore de t’atteindre, il est renvoyé à sa source, sans haine et sans retour possible vers toi.\n« Ce qui ne m’appartient pas retourne à sa source. »"
   },
   {
    "t": "Reviens",
    "x": "Respire dans ta bulle, entier·e et protégé·e. Remercie ta présence guide, puis reviens doucement, à ton rythme, et ouvre les yeux."
   }
  ]
 },
 {
  "id": "monte",
  "titre": "Si ça monte fort",
  "court": "Revenir ici et maintenant.",
  "pour": "",
  "etapes": [
   "Pose les pieds au sol.",
   "Respire avec la sphère, trois fois, lentement.",
   "Nomme cinq objets autour de toi, à voix haute.",
   "Tu peux reprendre un autre jour : rien ne presse."
  ],
  "securite": "Si ça dure plusieurs jours, ou si c’est trop lourd à porter seul·e, parles-en à une personne de confiance ou à un·e professionnel·le de l’accompagnement."
 }
],
  /* Les repères de la note sur 10 */
  NOTE: [[0, 'ça me prend comme avant'], [5, 'je le vois venir et je respire'], [10, 'la situation arrive et je reste calme']],
  IMAGE: 'Si tu ne vois pas d’image, sens-le, ou dis-le simplement : ça marche aussi.',
  CONFIANCE: 'Personne d’autre que toi ne lit ce que tu écris ici.',
  /* La question qui revient à chaque fois */
  QUESTION: 'À qui est cette incohérence, cette distorsion dans mon être ? À un parent ? Plus loin ? Est-ce que je répète un problème de cette vie, ou une mémoire plus ancienne ?',
  AQUI: [['moi', 'De cette vie : un problème que je répète'], ['parent', 'D’un parent'], ['loin', 'De plus loin dans ma lignée'], ['ancienne', 'D’une mémoire plus ancienne, je ne sais pas d’où']],
  HUMEURS: ['Paix', 'Joie', 'Élan', 'Gratitude', 'Fatigue', 'Tristesse', 'Inquiétude', 'Colère', 'Vide'],
  /* Les protocoles de libération. Pour en ajouter un : { id, titre, court, etapes: [{ titre, texte }], questions: ['…'] }.
     cle1 et cle2 ont leur affichage complet (respiration guidée, phrase qui se compose, etc.). */
  PROTOCOLES: [
    { id: 'cle1', titre: 'Libérer la mémoire', court: 'Respirer, nommer, reconnaître, transmuter, réorienter. Quand une mémoire s’active.' },
    { id: 'cle2', titre: 'Quand ça revient plus fort', court: 'Quand le thème revient alors que tu l’avais déjà travaillé.' }
  ],
  /* Les pistes du livre à proposer dans « Enquêter », selon le cycle */
  PISTES: { racine: ['noms', 'dates', 'absents', 'ciel'], coeur: ['voix', 'repete', 'corps', 'absents'] }
};
