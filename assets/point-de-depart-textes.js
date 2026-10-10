/* Genesolia · Mon point de départ : les textes (test cycle 1 « Ton mode survie », test cycle 2 « Tes blessures du cœur », mes cibles).
   Utilisés par point-de-depart.html. Les clés (mode, blessure, cle) ne doivent pas changer : les réponses enregistrées s'y réfèrent. */
window.POINT_DEPART = {
 "intro": "Bienvenue dans ton point de départ, un moment pour te retrouver et regarder ce que tu vis aujourd’hui.\nPrévois environ 15 minutes, dans un endroit où tu te sens suffisamment tranquille.\nIl n’y a rien de juste ou de faux, seulement tes réponses, avec tes mots et ton histoire.\nTu peux laisser une question de côté ou faire une pause quand tu en as besoin.\nCe que tu partages orientera tes deux livrets, « Vivre en paix » et « Aimer en paix ».\nPrendre conscience de ce qui se passe en toi, c’est ouvrir une possibilité d’avancer.\nTu pourras refaire ce point tous les trois mois pour voir le chemin parcouru.",
 "cycle1": {
  "titre": "Ton mode survie",
  "consigne": "Pense à ton quotidien de ces dernières semaines. Pour chaque affirmation, choisis une note : 0 (« pas du tout moi »), 1 (« un peu moi »), 2 (« souvent moi »), 3 (« tout à fait moi »). Ces quatre modes proposent des repères pour observer tes réactions lorsque quelque chose te semble menaçant ou incertain. Plusieurs peuvent se retrouver chez toi. Pour chaque domaine de sécurité, donne ensuite une note de 0 (« très en insécurité ») à 10 (« en paix »), puis coche les propositions qui précisent ce que tu vis. Tu peux n’en choisir aucune ou en choisir plusieurs, elles ne suivent pas un ordre de gravité.",
  "affirmations": [
   {
    "mode": "lutter",
    "texte": "Quand un imprévu arrive, je prends tout en main et j’ai du mal à laisser quelqu’un m’aider."
   },
   {
    "mode": "plaire",
    "texte": "Je dis oui à une demande alors que je suis fatiguée et que j’aurais besoin de repos."
   },
   {
    "mode": "figer",
    "texte": "Devant plusieurs choses à faire, je reste sans commencer, même quand je voudrais avancer."
   },
   {
    "mode": "fuir",
    "texte": "Je repousse l’ouverture d’un courrier ou d’un message qui risque de m’inquiéter."
   },
   {
    "mode": "figer",
    "texte": "Quand on me demande de choisir sous pression, je n’arrive plus à savoir ce que je veux."
   },
   {
    "mode": "lutter",
    "texte": "Quand une tâche est confiée à quelqu’un, je vérifie chaque détail ou je la refais moi-même."
   },
   {
    "mode": "fuir",
    "texte": "Quand une pensée me dérange, je prends mon téléphone pour ne plus y penser."
   },
   {
    "mode": "plaire",
    "texte": "Quand quelqu’un est contrarié, je cherche à arranger la situation, même si je n’y suis pour rien."
   },
   {
    "mode": "fuir",
    "texte": "Je remplis ma journée de petites occupations pour éviter une conversation difficile."
   },
   {
    "mode": "figer",
    "texte": "Pendant une discussion tendue, je me sens vide et les mots ne viennent plus."
   },
   {
    "mode": "plaire",
    "texte": "Je laisse les autres choisir le programme, même quand j’aurais envie d’autre chose."
   },
   {
    "mode": "lutter",
    "texte": "Quand je suis inquiète, je multiplie les tâches et je m’agite au lieu de faire une pause."
   },
   {
    "mode": "plaire",
    "texte": "Je garde mon désaccord pour moi parce que j’ai peur de décevoir ou de créer un conflit."
   },
   {
    "mode": "fuir",
    "texte": "Quand un échange devient inconfortable, je change de sujet ou je trouve une raison de partir."
   },
   {
    "mode": "lutter",
    "texte": "Quand les choses ne se passent pas comme prévu, je donne des consignes et j’insiste pour qu’on les suive."
   },
   {
    "mode": "figer",
    "texte": "Après une contrariété, je reste longtemps assise ou allongée sans réussir à passer à une action simple."
   }
  ],
  "domaines": [
   {
    "cle": "argent",
    "nom": "L’argent",
    "aide": "Quand tu penses à tes dépenses, à tes ressources et à demain, à quel point te sens-tu en sécurité ?",
    "niveaux": [
     "Il me manque réellement de l’argent pour couvrir mes besoins essentiels.",
     "J’ai peur d’en manquer, même quand mes besoins sont couverts.",
     "Mon argent repart dès qu’il arrive et je ne me sens jamais tranquille.",
     "Je culpabilise de recevoir de l’argent ou d’en garder pour moi."
    ]
   },
   {
    "cle": "corps",
    "nom": "Le corps et l’énergie",
    "aide": "Dans ton corps, tes journées et tes temps de repos, à quel point te sens-tu à l’aise et suffisamment soutenue ?",
    "niveaux": [
     "Je me sens épuisée et mon quotidien me laisse peu de repos.",
     "Je reste tendue, même quand j’ai un moment pour souffler.",
     "J’ai du mal à remarquer ma faim, ma fatigue ou mon besoin de pause.",
     "Je me juge quand mon corps ne suit pas le rythme que je voudrais."
    ]
   },
   {
    "cle": "lieu",
    "nom": "Le lieu de vie",
    "aide": "Là où tu vis, peux-tu te poser, préserver ton intimité et te sentir suffisamment tranquille ?",
    "niveaux": [
     "Mon logement est incertain ou ne répond pas à mes besoins essentiels.",
     "Le bruit, les tensions ou les conditions de vie me gardent sur mes gardes.",
     "Je manque d’un espace à moi où je peux me retirer.",
     "Même chez moi, j’ai du mal à me sentir installée et à relâcher."
    ]
   },
   {
    "cle": "relations",
    "nom": "Les relations",
    "aide": "Avec les personnes qui t’entourent, à quel point peux-tu être toi-même, exprimer un besoin et poser une limite ?",
    "niveaux": [
     "Certains échanges me font peur ou me mettent sous pression.",
     "Je crains de perdre le lien si je dis ce que je pense.",
     "Je donne beaucoup et je manque de soutien en retour.",
     "Je me sens seule, même lorsque je suis entourée."
    ]
   },
   {
    "cle": "travail",
    "nom": "Le travail et la place",
    "aide": "Dans ton activité ou ta situation actuelle, à quel point te sens-tu respectée, utile et à ta place ?",
    "niveaux": [
     "Ma situation est instable et je ne sais pas sur quoi compter.",
     "La charge ou les attentes dépassent ce que je peux porter.",
     "Je doute de ma valeur et j’ai peur de ne pas être à la hauteur.",
     "Je ne trouve plus de sens ou je n’ose pas prendre ma place."
    ]
   }
  ],
  "resultats": {
   "lutter": {
    "nom": "Celle qui tient les rênes",
    "texte": "Quand l’incertitude arrive, tu peux chercher à reprendre les commandes. Ton corps se tend, tes gestes s’accélèrent et le repos attendra. Faire, vérifier, prévoir peut t’avoir aidée à traverser des moments où tu devais compter surtout sur toi. Ce réflexe mérite d’être regardé avec douceur. Aujourd’hui, il peut aussi te laisser fatiguée, seule à porter les choses et peu disponible pour recevoir de l’aide. Tu n’as pas à abandonner toute maîtrise. Tu peux commencer par reconnaître les moments où tu disposes d’un peu de marge, et desserrer une seule prise.",
    "aide": [
     "Si c’est confortable, pose tes mains sur tes cuisses et sens leur poids pendant quelques instants.",
     "Desserre doucement les doigts, puis les épaules, sans chercher à tout détendre.",
     "Marche quelques pas plus lentement et remarque le contact de tes pieds avec le sol."
    ],
    "phrase": "Je peux faire ma part et laisser une petite place au soutien."
   },
   "fuir": {
    "nom": "Celle qui cherche de l’air",
    "texte": "Quand quelque chose devient inconfortable, tu peux chercher une sortie, une occupation ou une pensée qui t’emmène ailleurs. Ton corps semble vouloir bouger, et rester avec ce qui te préoccupe devient difficile. Prendre de la distance peut t’avoir protégée lorsque tu n’avais ni les moyens ni le soutien pour faire face. Aujourd’hui, ce réflexe peut laisser des démarches en attente et des inquiétudes qui reviennent. Tu n’as pas à tout affronter d’un coup. Un contact bref avec une seule chose, suivi d’une pause choisie, peut être un début plus accessible.",
    "aide": [
     "Regarde autour de toi et repère trois objets, en prenant le temps de voir leurs couleurs.",
     "Pose les pieds au sol et presse-les doucement quelques secondes, puis relâche.",
     "Tiens un objet familier et remarque sa texture avant de choisir une toute petite action."
    ],
    "phrase": "Je peux rester un instant, puis choisir ma prochaine petite action."
   },
   "figer": {
    "nom": "Celle qui a besoin de temps",
    "texte": "Quand il y a trop de pression, tu peux sentir que tout s’arrête. Ton corps devient lourd, tes mots manquent ou les choix paraissent hors de portée. Ce ralentissement peut t’avoir permis de traverser des situations où agir semblait impossible ou risqué. Il ne dit rien de ta valeur ni de ta volonté. Aujourd’hui, il peut te laisser avec des tâches qui s’accumulent et une impression de ne plus avancer. Tu peux commencer très petit, sans te brusquer. Retrouver un mouvement accessible compte davantage que te demander de repartir immédiatement.",
    "aide": [
     "Bouge doucement un doigt, puis les autres, en restant dans ce qui te semble facile.",
     "Sens le dossier ou l’assise qui te soutient, sans modifier ta respiration.",
     "Si tu en as envie, étire légèrement les bras ou fais quelques pas à ton rythme."
    ],
    "phrase": "Un petit mouvement suffit pour commencer, je peux prendre mon temps."
   },
   "plaire": {
    "nom": "Celle qui veille sur le lien",
    "texte": "Quand tu sens une tension, tu peux chercher à rassurer, arranger ou dire oui. Ton sourire arrive parfois avant que tu aies pu écouter ton envie, et ton corps reste attentif aux réactions des autres. Préserver le lien peut t’avoir protégée dans des moments où déplaire semblait coûter cher. Cette attention aux autres a sa place. Aujourd’hui, elle peut aussi t’épuiser et rendre tes propres besoins difficiles à entendre. Tu peux garder ta douceur tout en te donnant un peu d’espace. Une pause avant de répondre peut déjà changer quelque chose.",
    "aide": [
     "Avant de répondre, sens tes pieds au sol et laisse passer quelques secondes.",
     "Pose une main sur ton avant-bras, si ce contact t’est agréable, pour revenir à toi.",
     "Recule ou déplace légèrement ta chaise pour trouver une distance plus confortable."
    ],
    "phrase": "Mes besoins ont aussi leur place dans la relation."
   }
  },
  "mention": "Ce test propose une lecture symbolique de tes réponses, pas une vérité sur toi ni une mesure du fonctionnement de ton système nerveux. Tes réactions peuvent varier selon les situations. Si ce que tu traverses est très lourd, tu peux en parler à un·e professionnel·le qualifié·e pour trouver un soutien adapté."
 },
 "cycle2": {
  "titre": "Tes blessures du cœur",
  "consigne": "Pense à ce que tu ressens dans tes liens, aujourd’hui ou dans des situations qui reviennent souvent. Coche les affirmations dans lesquelles tu te reconnais. Tu peux en cocher plusieurs ou aucune. Les mots « rejet », « abandon », « humiliation », « trahison » et « injustice » sont ici des repères symboliques pour explorer ton vécu, sans t’enfermer dans une catégorie ni désigner une cause certaine.",
  "affirmations": [
   {
    "blessure": "rejet",
    "texte": "Dans un groupe, je préfère rester en retrait parce que j’ai peur de ne pas être la bienvenue."
   },
   {
    "blessure": "trahison",
    "texte": "Quand une personne me fait une promesse, je cherche des preuves avant de lui faire confiance."
   },
   {
    "blessure": "abandon",
    "texte": "Quand une personne proche tarde à me répondre, j’ai peur qu’elle s’éloigne de moi."
   },
   {
    "blessure": "injustice",
    "texte": "Quand les efforts de quelqu’un sont reconnus et pas les miens, je reste longtemps affectée."
   },
   {
    "blessure": "humiliation",
    "texte": "Quand je fais une erreur devant quelqu’un, j’ai honte bien après que la situation est passée."
   },
   {
    "blessure": "abandon",
    "texte": "Je reste dans une relation qui ne me convient plus parce que la séparation me fait peur."
   },
   {
    "blessure": "humiliation",
    "texte": "Je cache certains besoins ou certaines envies de peur qu’on se moque de moi."
   },
   {
    "blessure": "rejet",
    "texte": "Je n’ose pas proposer une sortie ou une rencontre parce qu’un refus me ferait me sentir de trop."
   },
   {
    "blessure": "trahison",
    "texte": "Je vérifie ce qu’on me raconte parce que j’ai peur qu’on me cache quelque chose."
   },
   {
    "blessure": "injustice",
    "texte": "Je m’impose d’être irréprochable pour qu’on ne puisse rien me reprocher."
   },
   {
    "blessure": "trahison",
    "texte": "Quand un accord n’est pas respecté, j’ai du mal à faire de nouveau confiance à cette personne."
   },
   {
    "blessure": "rejet",
    "texte": "Quand une personne n’est pas d’accord avec moi, je me demande si elle m’apprécie encore."
   },
   {
    "blessure": "injustice",
    "texte": "Je retiens mes émotions pour qu’on ne puisse pas dire que j’exagère."
   },
   {
    "blessure": "humiliation",
    "texte": "Je me rabaisse avec une plaisanterie avant que quelqu’un puisse faire une remarque sur moi."
   },
   {
    "blessure": "abandon",
    "texte": "Quand un moment partagé se termine, je ressens un vide et je cherche vite un nouveau contact."
   },
   {
    "blessure": "injustice",
    "texte": "Quand on me reproche quelque chose, je ressens le besoin de justifier chaque détail."
   },
   {
    "blessure": "abandon",
    "texte": "J’ai besoin qu’on me rassure souvent sur la place que j’occupe dans la relation."
   },
   {
    "blessure": "trahison",
    "texte": "Dans une relation, je préfère garder le contrôle plutôt que dépendre de la parole de l’autre."
   },
   {
    "blessure": "humiliation",
    "texte": "Quand je pose une limite, je me sens égoïste et j’ai envie de m’excuser."
   },
   {
    "blessure": "rejet",
    "texte": "Je montre peu ce qui compte vraiment pour moi, de peur que l’autre ne l’accepte pas."
   }
  ],
  "pese": {
   "consigne": "Coche ce qui pèse sur ton cœur en ce moment, sans te sentir obligée de raconter les détails. Tu peux choisir plusieurs réponses ou laisser cette partie vide. Un champ libre « Autre » te permet d’ajouter ce qui manque, avec tes mots.",
   "options": [
    "Une séparation ou une rupture.",
    "Un deuil.",
    "Un manque d’amour ou d’attention dans l’enfance.",
    "Une perte de sens dans ma vie.",
    "Une confiance abîmée par un proche.",
    "Une relation douloureuse qui semble se répéter.",
    "Un conflit familial ou une distance avec ma famille.",
    "Des paroles blessantes qui restent présentes.",
    "Une culpabilité ou un regret que je porte encore.",
    "Une histoire familiale dont le silence ou le poids me touche."
   ]
  },
  "resultats": {
   "rejet": {
    "texte": "Le repère du rejet peut faire écho à cette peur de ne pas avoir de place, ou de devoir cacher une part de toi pour être accueillie. Dans les liens, tu peux te retirer avant de savoir si l’autre souhaite vraiment te rejoindre. Un refus ponctuel prend alors beaucoup de place dans ton regard sur toi. Des expériences personnelles ou des récits familiaux peuvent nourrir tes questions, sans expliquer à eux seuls ce que tu vis. Tu peux explorer où tu te sens libre d’exister telle que tu es.",
    "pas": "Avec une personne auprès de qui tu te sens respectée, exprime une petite préférence, sans chercher à la rendre parfaite ou acceptable."
   },
   "abandon": {
    "texte": "Le repère de l’abandon peut faire écho à la peur que le lien disparaisse dès que l’autre s’éloigne. Une réponse tardive ou un changement de programme peut réveiller beaucoup d’incertitude. Tu peux alors chercher des assurances, t’accrocher ou accepter plus que tu ne le souhaites. Ton besoin de présence mérite d’être entendu. Tu peux aussi regarder les séparations et les absences de ton histoire, y compris familiale, sans conclure qu’elles déterminent tes relations. Peu à peu, tu peux distinguer ce qui se passe aujourd’hui de ce que tu redoutes.",
    "pas": "Lors d’une attente, écris deux phrases : « Ce que je sais aujourd’hui » et « Ce que j’imagine ». Puis choisis une activité courte qui te fait du bien."
   },
   "humiliation": {
    "texte": "Le repère de l’humiliation peut faire écho à la peur d’être rabaissée, exposée ou jugée dans tes besoins. Dans les liens, tu peux t’excuser beaucoup, te faire petite ou rire de toi avant que quelqu’un ne le fasse. Des remarques anciennes, personnelles ou familiales, peuvent encore peser sur la manière dont tu te regardes. Elles ne définissent pas ta valeur. Tu peux commencer à repérer les échanges où tu te sens respectée, et ceux où tu t’oublies pour éviter la honte ou le malaise.",
    "pas": "Choisis un besoin simple et formule-le sans te rabaisser : « J’ai besoin d’une pause » ou « Je préfère ne pas en parler maintenant »."
   },
   "trahison": {
    "texte": "Le repère de la trahison peut faire écho à une confiance devenue difficile après une parole non tenue, un mensonge ou une déception. Dans les liens, tu peux vérifier, anticiper et garder les commandes pour éviter d’être prise au dépourvu. Cette vigilance peut avoir ses raisons, mais elle peut aussi rendre chaque incertitude épuisante. Tu peux regarder les accords et les loyautés de ton histoire familiale comme des pistes de réflexion. La confiance peut se construire à partir de faits, de limites claires et de temps.",
    "pas": "Pour un engagement concret, précise avec l’autre ce qui est prévu, puis observe les faits avant de décider du niveau de confiance que tu souhaites accorder."
   },
   "injustice": {
    "texte": "Le repère de l’injustice peut faire écho au sentiment de devoir faire davantage pour être reconnue ou traitée équitablement. Dans les liens, tu peux chercher à être irréprochable, retenir tes émotions ou défendre chaque détail de ta position. Cela peut te laisser peu de place pour l’erreur et la souplesse. Tu peux interroger les attentes de ton histoire, notamment familiale, sans en faire une explication unique. Ton besoin d’équité compte. Il peut s’exprimer avec des demandes concrètes, même lorsque tout le monde ne partage pas ton regard.",
    "pas": "Choisis une situation précise et écris ce que tu voudrais voir changer, puis formule une demande réalisable : « J’aimerais que nous partagions cette tâche »."
   }
  },
  "mention": "Ce test propose une lecture symbolique de tes réponses, pas une vérité sur toi ni la preuve qu’une histoire familiale explique tes difficultés. Tu restes libre de retenir seulement ce qui t’aide à réfléchir. Si ce que tu traverses est très lourd, tu peux en parler à un·e professionnel·le qualifié·e pour trouver un soutien adapté."
 },
 "cibles": {
  "consigne1": "Pour le cycle 1, « Vivre en paix », écris avec tes mots une à trois choses que tu souhaites apaiser ou sécuriser dans ton quotidien. Choisis des situations concrètes plutôt qu’une exigence envers toi-même. Classe-les par ordre d’importance pour toi aujourd’hui : 1 pour ta priorité, puis 2 et 3 si tu en as d’autres. Ta première cible orientera ton livret.",
  "exemples1": [
   "Pouvoir regarder mon compte et prévoir mes dépenses sans repousser ce moment.",
   "M’accorder une pause quand je remarque que je suis fatiguée.",
   "Créer chez moi un petit espace où je peux me poser tranquillement."
  ],
  "consigne2": "Pour le cycle 2, « Aimer en paix », écris avec tes mots une à trois choses que tu souhaites déposer ou libérer dans tes liens ou ton histoire. Déposer peut simplement vouloir dire mettre en mots ce que tu portes et lui donner moins de place. Classe tes cibles par ordre d’importance pour toi aujourd’hui : 1 pour ta priorité, puis 2 et 3 si tu en as d’autres. Ta première cible orientera ton livret et ton parcours « Sors de la boucle ».",
  "exemples2": [
   "Donner moins de place à la peur d’être quittée quand l’autre prend du temps pour soi.",
   "Déposer la culpabilité que je ressens lorsque je dis non à ma famille.",
   "Comprendre pourquoi je m’efface dans mes relations et oser exprimer une préférence."
  ],
  "rythme": "Tu gardes ta cible aussi longtemps que tu en as besoin, chacune avance à son rythme.\nÀ la fin de chaque mois, tu regarderas ce qui a changé, ce qui reste sensible et ce qui compte pour toi.\nTu choisiras alors de continuer avec cette cible, de la reformuler ou de passer à la suivante."
 },
 "fin": "Bienvenue dans le Cercle, tu peux commencer avec ce qui est là aujourd’hui.\nTes réponses sont un point de départ, tu pourras les préciser au fil du chemin.\nOuvre maintenant ton carnet du mois et retrouve la cible que tu as choisie pour commencer.\nPrends le temps de te regarder en toi, avec curiosité et douceur.\nPuis choisis un premier pas assez petit pour trouver sa place dans ta vie."
};
