/* Genesolia · Le carnet du mois : les textes de l'accompagnement personnalisé
   - VAGUES : les vingt treizaines (trecenas) du calendrier maya sacré, compte traditionnel k'iche' (même calcul que maya.js).
   - JOURS : ce que signifient tes jours personnels dans la semaine.
   - METEO : la lecture de ta météo du début, croisée avec ton mois (numérologie, ciel, maya).
   - BRAVO : un encouragement après chaque étape de « Ma météo du début ».
   - BLESSURES : le petit test des cinq blessures (mêmes phrases que blessures-de-l-ame.html) et le point du mois.
   - GESTES : la bibliothèque des gestes à cocher, choisis d'après les réponses (jamais au hasard).
   Rien ici n'est une prédiction : ce sont des repères symboliques, à garder s'ils te parlent. */
window.CARNET_ACCOMP = {

  /* Index des signes : 0 Imox … 19 Ajpu (comme MAYA_TEXTES.SIGNES). Une vague dure 13 jours, du nombre 1 au nombre 13. */
  VAGUES: [
    { titre: "La vague d’Imox, l’eau des origines", texte: "Treize jours portés par l’eau première, l’intuition et les rêves. Ce qui monte de l’intérieur a plus de place que d’habitude : une image, une envie, une émotion qui ne s’explique pas encore. C’est une vague pour écouter avant de décider, et pour laisser une idée neuve prendre forme sans la juger trop vite.", invitation: "Garde un carnet près de ton lit et note tes rêves ou ta première pensée du matin. En famille, écoute ce qui se dit à demi-mot." },
    { titre: "La vague d’Iq’, le souffle", texte: "Treize jours portés par le vent et la parole. Ce qui circule compte : ta respiration, les mots que tu dis, ceux que tu retiens. C’est une vague pour dire les choses simplement, aérer ce qui est resté fermé, et laisser partir ce qui pèse.", invitation: "Chaque jour, prends trois longues respirations avant une conversation importante. Ouvre les fenêtres, au propre comme au figuré : une parole vraie, un placard vidé." },
    { titre: "La vague d’Aq’ab’al, l’aube", texte: "Treize jours entre la nuit et le lever du jour. Ce qui était dans l’ombre commence à s’éclairer doucement. C’est une vague de recommencement, pour accueillir un début timide et faire confiance à la lumière qui revient, même lentement.", invitation: "Lève-toi un matin pour voir le jour se lever, ou allume une bougie au réveil. Choisis une chose à recommencer autrement cette quinzaine." },
    { titre: "La vague de K’at, le filet", texte: "Treize jours portés par le filet qui rassemble les graines mûres. Les liens se resserrent, les fils se nouent ou se démêlent. C’est une vague pour regarder ce qui te relie aux autres et à ta lignée, ce qui te soutient et ce qui t’emmêle.", invitation: "Range un tiroir, des papiers, un dossier en attente : démêler dehors aide à démêler dedans. Appelle une personne de ta famille à qui tu penses souvent." },
    { titre: "La vague de Kan, le serpent", texte: "Treize jours portés par l’énergie du corps, le désir et la force de vie. Ce qui est vivant en toi demande à bouger. C’est une vague pour retrouver ton élan, écouter ce que ton corps sait déjà, et changer de peau là où l’ancienne te serre.", invitation: "Bouge chaque jour, même dix minutes : marche, danse, étirements. Repère une habitude qui ne te ressemble plus et allège-la d’un cran." },
    { titre: "La vague de Kame, les ancêtres", texte: "Treize jours portés par la mémoire de celles et ceux qui sont venus avant toi. C’est une vague pour honorer, remercier, et regarder ce que tu as reçu de ta lignée, les forces comme les poids. Ce qui se termine peut se terminer en paix.", invitation: "Pose une photo d’un·e ancêtre près de toi et dis-lui merci pour une force reçue. Note une phrase de famille que tu entends encore aujourd’hui." },
    { titre: "La vague de Kej, le cerf", texte: "Treize jours portés par le cerf, l’équilibre et la tenue. Les quatre pattes posées sur la terre : ce qui te tient debout, ta place, ta responsabilité. C’est une vague pour te recentrer, prendre soin de ton corps et marcher à ton rythme.", invitation: "Passe du temps dans la nature, pieds sur la terre. Au travail, choisis une seule priorité par jour et tiens-la tranquillement." },
    { titre: "La vague de Q’anil, la graine", texte: "Treize jours portés par la semence et l’étoile du matin. Ce que tu plantes maintenant a de quoi pousser. C’est une vague pour semer une intention, un projet, une habitude douce, et lui donner le temps de germer.", invitation: "Écris une intention en une phrase et pose-la sous une plante ou un pot de graines. Commence petit : un geste par jour pour ton projet." },
    { titre: "La vague de Toj, l’offrande", texte: "Treize jours portés par l’offrande et l’équilibre entre donner et recevoir. C’est une vague pour remercier, réparer ce qui demande à l’être, et regarder où tu donnes trop ou pas assez. Ce que tu offres de bon cœur te revient autrement.", invitation: "Offre un petit cadeau, un temps, une aide, sans rien attendre. Note aussi ce que tu acceptes de recevoir cette quinzaine, sans te justifier." },
    { titre: "La vague de Tz’i’, le chien fidèle", texte: "Treize jours portés par la fidélité, la loyauté et le sens du juste. C’est une vague pour regarder à qui et à quoi tu es fidèle, et si cette fidélité te nourrit encore. Une loyauté peut se garder avec amour tout en te laissant libre.", invitation: "Tiens une promesse faite à toi-même. Remercie une personne fidèle de ta vie. Repère une loyauté familiale qui t’empêche d’avancer." },
    { titre: "La vague de B’atz’, le fil", texte: "Treize jours portés par le fil du temps et l’art de tisser. Ton histoire se tisse avec celle de ta famille ; la créativité, le jeu et la joie y ont toute leur place. C’est une vague pour créer, reprendre un fil abandonné, et rire un peu de toi.", invitation: "Reprends une activité créative laissée de côté : dessin, couture, musique, cuisine. Raconte à un proche une belle histoire de ta famille." },
    { titre: "La vague d’E, le chemin", texte: "Treize jours portés par la route et le voyage. Le chemin compte autant que l’arrivée. C’est une vague pour choisir une direction, faire un pas dans un nouveau sens, et regarder le chemin déjà parcouru avec bienveillance.", invitation: "Prends un chemin différent pour une course habituelle, ou fais une petite sortie nouvelle. Écris trois pas que tu as déjà faits cette année." },
    { titre: "La vague d’Aj, le roseau", texte: "Treize jours portés par le roseau, la maison et le foyer. Ce qui te fait te sentir chez toi, à l’intérieur comme dans ton lieu de vie. C’est une vague pour prendre soin de ton nid, de ta famille proche, et de ta propre maison intérieure.", invitation: "Rends une pièce de ta maison plus douce : une fleur, un coin rangé, une lumière. Partage un repas simple avec une personne qui compte." },
    { titre: "La vague d’I’x, le jaguar", texte: "Treize jours portés par le jaguar et la terre-mère. La force tranquille, l’instinct, la présence. C’est une vague pour faire confiance à ce que tu sens, poser tes limites avec calme, et te relier à la terre et au féminin sacré.", invitation: "Marche pieds nus quelques minutes, ou touche la terre d’une plante. Dis un « non » calme là où tu dis « oui » à contrecœur." },
    { titre: "La vague de Tz’ikin, l’oiseau", texte: "Treize jours portés par l’oiseau messager. Les signes, les rencontres, les bonnes nouvelles ont plus de place. C’est une vague pour prendre de la hauteur, voir plus large, et rester ouvert·e à ce qui vient vers toi.", invitation: "Note chaque jour un signe, une coïncidence, un message reçu. Prends de la hauteur sur une situation : comment la verrais-tu dans un an ?" },
    { titre: "La vague d’Ajmaq, le pardon", texte: "Treize jours portés par les erreurs et le pardon. Chez les gardien·nes du jour, c’est un temps pour reconnaître ses fautes et celles des ancêtres, sans s’y enfermer. C’est une vague pour pardonner, à toi d’abord, et alléger ce que tu portes depuis longtemps.", invitation: "Écris une lettre de pardon que tu n’envoies pas, puis déchire-la. Fais la paix avec une erreur passée en te disant : « Je faisais de mon mieux. »" },
    { titre: "La vague de No’j, la pensée", texte: "Treize jours portés par la pensée et la sagesse. Les idées claires, les prises de conscience, les bons conseils. C’est une vague pour apprendre, réfléchir avant d’agir, et écouter la sagesse des anciens comme la tienne.", invitation: "Lis quelques pages chaque jour, ou demande conseil à une personne plus âgée. Avant une décision, note les raisons de ton cœur et celles de ta tête." },
    { titre: "La vague de Tijax, le silex", texte: "Treize jours portés par la lame d’obsidienne qui tranche et qui soigne. C’est une vague pour couper ce qui doit l’être, dire une vérité avec douceur, et choisir ce que tu gardes. Trancher, ici, c’est libérer.", invitation: "Choisis une chose à arrêter, un engagement, un objet, une habitude, et fais-le cette quinzaine. Dis une vérité utile, avec des mots doux." },
    { titre: "La vague de Kawoq, l’orage", texte: "Treize jours portés par l’orage et la communauté. Les émotions peuvent être fortes, la pluie nettoie. C’est une vague pour te relier aux autres, demander de l’aide, et laisser passer les tempêtes sans t’y perdre.", invitation: "Demande de l’aide pour une chose précise. Si une émotion déborde, sors marcher sous le ciel et respire jusqu’à ce qu’elle redescende." },
    { titre: "La vague d’Ajpu, le soleil", texte: "Treize jours portés par le soleil et le courage. La lumière qui revient après la nuit, la joie, la confiance. C’est une vague pour oser te montrer, célébrer ce qui va bien, et briller sans t’en excuser.", invitation: "Offre-toi un moment de soleil chaque jour. Partage une réussite, même petite, avec une personne qui saura s’en réjouir." }
  ],

  /* Tes jours personnels dans la semaine */
  JOURS: {
    signe: { nom: "Ton jour-signe", texte: "Ton signe de naissance revient : un jour d’alignement, où tu es dans ton élément. Prends un moment pour toi, et exprime ta qualité propre dans un geste simple." },
    nombre: { nom: "Ton nombre", texte: "Le même nombre qu’à ta naissance : une énergie familière, qui te ressemble. Un bon jour pour poser une chose qui compte vraiment pour toi." },
    famille: { nom: "Jour de ta famille", texte: "Un signe de ta famille de signes (même direction, même couleur que le tien) : un jour de soutien, plus fluide pour toi." },
    vague: { nom: "Une vague qui te porte", texte: "Cette vague est portée par ton signe ou par ta famille de signes : treize jours qui te soutiennent. Profites-en pour avancer sur ce qui te tient à cœur." }
  },
  FAMILLES: ["l’Est, le rouge, le lever du soleil", "le Nord, le blanc, le souffle et les ancêtres", "l’Ouest, le noir, la nuit et l’intériorité", "le Sud, le jaune, la graine et la maturité"],
  CADRE_MAYA: "Ces repères viennent du calendrier maya sacré, selon le compte traditionnel k’iche’. Ce ne sont pas des prédictions, mais des rendez-vous avec toi-même.",

  /* Lecture de ta météo du début, croisée avec ton mois.
     Type de mois personnel : 1, 3, 5, 8 → élan ; 2, 7, 9 → douceur ; 4, 6 → construire. */
  TYPE_MOIS: { 1: "elan", 2: "douceur", 3: "elan", 4: "construire", 5: "elan", 6: "construire", 7: "douceur", 8: "elan", 9: "douceur" },
  NOM_TYPE: { elan: "un mois d’élan, qui invite à agir", douceur: "un mois plus doux, qui invite à ralentir et à écouter", construire: "un mois pour construire pas à pas" },
  METEO: {
    bas: {
      elan: { titre: "Ton mois appelle l’élan, ton énergie demande d’abord du repos", texte: "Tu n’as pas besoin de tout lancer cette semaine. Commence par recharger : du sommeil, des moments rien que pour toi, des refus quand c’est trop. Puis choisis un seul petit pas, le plus facile. L’élan du mois t’attendra : il dure tout le mois, pas seulement la première semaine." },
      douceur: { titre: "Ton énergie et ton mois vont dans le même sens : ralentir", texte: "Ton corps te le dit et ton mois aussi : c’est le moment de prendre soin de toi. Allège ton agenda, dis non à ce qui n’est pas essentiel, et offre-toi chaque jour un vrai temps de repos. Se reposer, ce mois-ci, c’est avancer." },
      construire: { titre: "Ton mois invite à construire, ton énergie demande de la douceur", texte: "Construis petit et régulier plutôt que grand et épuisant. Dix minutes par jour sur ton objectif suffisent. Garde des pauses dans ta semaine, et félicite-toi pour chaque brique posée, même minuscule." }
    },
    moyen: {
      elan: { titre: "Une bonne base pour profiter de l’élan du mois", texte: "Ton énergie est là, sans excès. Choisis une ou deux actions qui comptent vraiment et engage-toi dessus dès cette semaine. Garde aussi un temps de récupération, pour que l’élan tienne tout le mois." },
      douceur: { titre: "Un mois doux, une énergie stable : l’équilibre", texte: "Tu as ce qu’il faut pour avancer tranquillement. Profite de ce mois plus calme pour faire le point, écouter tes envies profondes, et nourrir ce qui te fait du bien. Pas besoin de forcer." },
      construire: { titre: "Le bon rythme pour construire", texte: "Ton énergie est suffisante pour avancer pas à pas. Pose une routine simple, toujours au même moment de la journée, et tiens-la. Ce mois récompense la régularité plus que l’effort ponctuel." }
    },
    haut: {
      elan: { titre: "Tout va dans le même sens : c’est le moment d’oser", texte: "Ton énergie est haute et ton mois invite à agir. Lance ce que tu repousses, propose, ose demander. Pense seulement à garder un peu de repos dans ta semaine, pour que cet élan dure." },
      douceur: { titre: "Ton énergie est haute, ton mois invite à ralentir", texte: "Profite de cette belle énergie pour terminer ce qui est en cours, ranger, réparer, plutôt que d’ouvrir trop de nouveaux chantiers. Garde aussi des moments de calme : ton mois t’invite à écouter autant qu’à agir." },
      construire: { titre: "Une belle énergie pour construire solide", texte: "Mets cette énergie au service de ton objectif, avec méthode : un plan simple, des étapes, et une action par jour. Ce que tu bâtis ce mois-ci avec régularité tiendra longtemps." }
    }
  },
  /* Petites touches selon tes curseurs (une ou deux s'ajoutent à la lecture) */
  NUANCES: {
    confiance: "Ta confiance est basse en ce moment : note chaque soir une chose que tu as bien faite, même toute petite. La confiance se construit par les preuves.",
    liens: "Tu te sens peu entouré·e : envoie un message à une personne qui te fait du bien, cette semaine. Un seul suffit pour commencer.",
    humeur: "Ton humeur est basse : accorde-toi une chose qui te met en joie chaque jour, une musique, une sortie, un moment doux.",
    elan: "Tu sens que tu avances peu : regarde le chemin déjà fait plutôt que celui qui reste. Il est souvent plus long que tu ne le crois.",
    serenite: "Tu te sens peu apaisé·e : trois respirations lentes avant chaque repas, et un moment de calme le soir, sans écran.",
    mercure: "Mercure est rétrograde ce mois-ci : vérifie tes rendez-vous et reformule ce que tu as compris. C’est un bon temps pour terminer plutôt que commencer.",
    nouvelle: "Une nouvelle lune tombe cette semaine : un bon moment pour poser ton intention par écrit.",
    pleine: "Une pleine lune tombe cette semaine : les émotions peuvent être plus fortes. Accueille-les, puis note ce qu’elles t’apprennent.",
    jourSigne: "Ton jour-signe maya tombe cette semaine : garde-toi un vrai moment rien que pour toi ce jour-là."
  },
  AUDIO: {
    detente: { titre: "Pour te détendre et déposer", texte: "Écoute ta séance du mois, les yeux fermés, dans un endroit calme : elle t’aide à relâcher et à déposer ce qui pèse." },
    avancer: { titre: "Pour retrouver confiance et avancer", texte: "Ta séance de visualisation du mois t’aide à te projeter et à nourrir ta confiance. Écoute-la le matin, avant de commencer ta journée." }
  },
  SOUTIEN: "Plusieurs de tes curseurs sont très bas en ce moment. Tu n’as pas à porter ça seul·e : parles-en à une personne de confiance, ou à un·e professionnel·le (ton médecin, un·e psychologue). Ce carnet t’accompagne, mais il ne remplace pas une aide humaine.",

  /* Après chaque étape de « Ma météo du début » (une variante par mois) */
  BRAVO: {
    1: ["Tu viens de prendre une vraie photo de ton état intérieur. Le regarder en face, c’est déjà prendre soin de toi.", "Bravo d’avoir pris ce temps. Savoir où tu en es, c’est le point de départ de tout le reste.", "Tu t’es écouté·e honnêtement. Quelle que soit ta météo, elle a le droit d’être là."],
    2: ["Tu viens de regarder ta vie avec honnêteté. C’est un vrai pas, et il demande du courage.", "Ta roue est dessinée. Elle n’a pas besoin d’être parfaite : elle a besoin d’être vraie, et elle l’est.", "Bravo. Tu sais maintenant où un petit pas changera le plus de choses."],
    3: ["Ton objectif est posé. Une direction claire, c’est déjà de l’énergie en mouvement.", "Bien formulé, ton objectif devient un chemin. Tu sais où tu vas et par où commencer.", "Tu as choisi ce que tu veux pour toi. C’est un acte de confiance en ta vie."],
    4: ["Tu as donné une image et une émotion à ton intention. Ce que tu nourris de ton attention grandit.", "Bravo. Tu viens de semer : laisse maintenant le temps faire sa part.", "Ton intention a pris vie sur le papier. Relis-la quand tu doutes : elle est là pour toi."],
    5: ["Ta phrase du mois t’accompagne. Redis-la chaque matin, elle deviendra vraie pour toi.", "Une phrase, un repère. Tu peux l’écrire sur un post-it et la coller sur ton miroir.", "Bravo, ton point de départ est complet. Tu as fait le plus important : commencer."]
  },

  /* Le petit test des cinq blessures : mêmes phrases que sur blessures-de-l-ame.html */
  BLESSURES: {
    noms: { rejet: "le rejet", abandon: "l’abandon", humiliation: "l’humiliation", trahison: "la trahison", injustice: "l’injustice" },
    pages: { rejet: "blessure-de-rejet.html", abandon: "blessure-d-abandon.html", humiliation: "blessure-d-humiliation.html", trahison: "blessure-de-trahison.html", injustice: "blessure-d-injustice.html" },
    phrases: {
      rejet: ["Tu te sens vite de trop, même quand on t’invite.", "Tu as tendance à te retirer, à t’isoler, à fuir les conflits.", "Tu doutes de ta valeur et tu as du mal à occuper l’espace.", "Un refus te fait l’effet d’une condamnation de toute ta personne."],
      abandon: ["La solitude te paraît insupportable.", "Tu as besoin d’être rassuré·e souvent dans tes relations.", "Tu acceptes beaucoup pour ne pas perdre quelqu’un.", "Une absence ou un silence te plonge dans l’angoisse."],
      humiliation: ["Tu te sens facilement honteux·se ou ridicule.", "Tu portes beaucoup pour les autres et peu pour toi.", "Tu as du mal à recevoir un compliment ou un plaisir.", "Tu te moques de toi avant que d’autres ne le fassent."],
      trahison: ["Tu as du mal à déléguer ou à lâcher prise.", "Les promesses non tenues te mettent hors de toi.", "Tu veux tout prévoir pour ne pas être pris·e de court.", "Tu te méfies, même de ceux qui t’aiment."],
      injustice: ["Tu es très exigeant·e avec toi-même.", "Tu as du mal à montrer tes émotions.", "Les règles, le juste et l’injuste comptent énormément pour toi.", "Tu te sens rarement reconnu·e pour ce que tu fais."]
    },
    /* Le point du mois, dans « Ma météo du début » */
    mois: [
      ["rejet", "Mis·e de côté, de trop, pas à ta place"],
      ["abandon", "Seul·e, pas assez soutenu·e"],
      ["humiliation", "Pas à la hauteur, gêné·e de toi"],
      ["trahison", "Déçu·e, en perte de confiance"],
      ["injustice", "Injustement traité·e, pas reconnu·e"]
    ]
  },

  /* Les gestes du mois, à cocher.
     base : toujours proposés. d : domaines de la roue ; b : blessures ; m : météo (« bas » ou « haut »). */
  GESTES: [
    { id: "b-gratitude", base: true, t: "Faire une prière ou dire merci chaque soir, même si ma vie est imparfaite (elle est en train de changer)" },
    { id: "b-marche", base: true, t: "Cinq minutes de marche dehors, en regardant le ciel" },
    { id: "b-respire", base: true, t: "Trois respirations lentes avant de répondre quand je suis tendu·e" },
    { id: "b-eau", base: true, t: "Boire un grand verre d’eau au réveil, en me disant une phrase douce" },
    { id: "b-ecran", base: true, t: "Poser mon téléphone dans une autre pièce pendant un repas" },
    { id: "b-victoire", base: true, t: "Noter le soir une chose que j’ai bien faite aujourd’hui" },

    { id: "colere", t: "Écrire une lettre pour sortir ma colère, que je n’envoie pas, puis la déchirer ou la brûler, et envoyer à la personne une boule d’amour pour pardonner", b: ["trahison", "injustice"], d: ["famille", "amour"] },
    { id: "liberer-coin", t: "Ranger un endroit de ma maison qui a besoin de respirer, et donner ou jeter ce qui ne me nourrit plus", d: ["chezmoi", "energie"], m: ["haut"] },
    { id: "pardon-soi", t: "Me pardonner une erreur en me disant : « Je faisais de mon mieux avec ce que je savais »", b: ["humiliation", "injustice"], d: ["evolution"] },
    { id: "aide", t: "Demander de l’aide pour une chose précise, sans m’excuser", b: ["abandon", "trahison"], d: ["amis", "travail"] },
    { id: "seule-plaisir", t: "Passer un moment seul·e avec plaisir : un café, une balade, un livre, rien que pour moi", b: ["abandon"], d: ["joie", "connexion"], m: ["bas"] },
    { id: "parole", t: "Prendre la parole une fois en réunion ou en famille pour dire ce que je pense", b: ["rejet"], d: ["travail", "famille"], m: ["haut"] },
    { id: "espace", t: "M’aménager un coin à moi dans la maison, même petit", b: ["rejet"], d: ["chezmoi", "connexion"] },
    { id: "plaisir", t: "M’offrir un plaisir sans culpabiliser et sans le justifier", b: ["humiliation"], d: ["joie"], m: ["bas"] },
    { id: "compliment", t: "Recevoir un compliment en disant simplement « merci »", b: ["humiliation", "rejet"], d: ["amis", "evolution"] },
    { id: "lacher", t: "Lâcher le contrôle sur une chose et laisser quelqu’un faire à sa façon", b: ["trahison"], d: ["travail", "famille"] },
    { id: "confiance", t: "Faire confiance à une personne pour une petite chose, et observer ce qui se passe", b: ["trahison"], d: ["amour", "amis"] },
    { id: "imparfait", t: "Laisser une tâche « assez bien » au lieu de parfaite", b: ["injustice"], d: ["travail", "energie"] },
    { id: "repos-merite", t: "Me reposer une heure sans l’avoir « mérité »", b: ["injustice", "humiliation"], d: ["energie"], m: ["bas"] },
    { id: "emotion", t: "Dire une émotion à voix haute à une personne de confiance : « Je me sens… »", b: ["injustice", "rejet"], d: ["amour", "amis"] },
    { id: "non-doux", t: "Dire un « non » calme là où je dis « oui » à contrecœur", b: ["humiliation", "abandon"], d: ["famille", "travail"] },
    { id: "rassure-moi", t: "Me rassurer moi-même quand j’ai peur : la main sur le cœur, « Je suis là pour toi »", b: ["abandon"], d: ["connexion"], m: ["bas"] },
    { id: "enfant-int", t: "Écrire trois lignes tendres à l’enfant que j’étais", b: ["rejet", "abandon", "humiliation"], d: ["evolution", "connexion"] },
    { id: "photo-enfant", t: "Regarder une photo de moi enfant et lui sourire", b: ["rejet", "abandon"], d: ["connexion"] },
    { id: "ancetre", t: "Allumer une bougie pour un·e ancêtre et lui dire merci pour une force reçue", d: ["famille", "connexion"] },
    { id: "appel-famille", t: "Appeler une personne de ma famille juste pour prendre des nouvelles", b: ["abandon"], d: ["famille"] },
    { id: "question-famille", t: "Poser à un parent une question sur son histoire, à mon âge", d: ["famille", "evolution"] },
    { id: "message-ami", t: "Envoyer un message gentil à une personne que j’aime, sans raison", b: ["abandon", "rejet"], d: ["amis", "amour"] },
    { id: "sortie-amie", t: "Proposer une sortie à une amie ou un ami que je n’ai pas vu depuis longtemps", d: ["amis", "joie"], m: ["haut"] },
    { id: "rdv-couple", t: "Offrir un moment de qualité à mon couple, ou à mon cœur si je suis seul·e : un vrai rendez-vous", d: ["amour"] },
    { id: "lettre-amour", t: "Écrire à une personne aimée ce que j’apprécie chez elle", b: ["injustice"], d: ["amour", "famille"] },
    { id: "budget", t: "Regarder mes comptes dix minutes, avec calme et sans me juger", d: ["argent"], b: ["trahison"] },
    { id: "valeur", t: "Lister ce que je sais faire et que je sous-estime", b: ["rejet", "humiliation"], d: ["argent", "travail"] },
    { id: "tarif", t: "Oser demander ce qui m’est dû : un tarif, un remboursement, une reconnaissance", b: ["injustice", "humiliation"], d: ["argent", "travail"], m: ["haut"] },
    { id: "abondance", t: "Noter chaque soir une chose que j’ai reçue aujourd’hui, même gratuite", d: ["argent", "joie"] },
    { id: "tri-papiers", t: "Trier une pile de papiers en attente", d: ["argent", "chezmoi"], b: ["trahison"] },
    { id: "fleurs", t: "Mettre une fleur ou une plante dans la pièce où je vis le plus", d: ["chezmoi", "joie"] },
    { id: "lit", t: "Changer mes draps et préparer ma chambre pour une vraie nuit de repos", d: ["chezmoi", "energie"], m: ["bas"] },
    { id: "sommeil", t: "Me coucher trente minutes plus tôt deux soirs dans la semaine", d: ["energie"], m: ["bas"] },
    { id: "bouger", t: "Bouger dix minutes : danser, m’étirer, marcher vite", d: ["energie", "joie"], m: ["haut"] },
    { id: "nature", t: "Passer une heure dans la nature, pieds sur la terre si possible", d: ["energie", "connexion"] },
    { id: "musique", t: "Mettre une musique qui me met en joie en rentrant chez moi", d: ["joie"], m: ["bas"] },
    { id: "jeu", t: "Faire quelque chose juste pour le plaisir, comme quand j’étais enfant", d: ["joie", "evolution"], b: ["injustice"] },
    { id: "creer", t: "Reprendre une activité créative laissée de côté", d: ["joie", "evolution"] },
    { id: "apprendre", t: "Apprendre une petite chose nouvelle : une recette, un mot, une technique", d: ["evolution", "travail"], m: ["haut"] },
    { id: "un-pas-projet", t: "Faire un pas de dix minutes sur un projet qui me tient à cœur", d: ["travail", "evolution"], m: ["haut"] },
    { id: "pause-travail", t: "Prendre une vraie pause loin de mon poste chaque jour de travail", d: ["travail", "energie"], b: ["injustice"], m: ["bas"] },
    { id: "meditation", t: "Écouter ma séance du mois, les yeux fermés", d: ["connexion", "energie"], m: ["bas"] },
    { id: "silence", t: "Cinq minutes de silence le matin, avant les écrans", d: ["connexion"] },
    { id: "intention", t: "Écrire mon intention du jour sur un papier et le garder dans ma poche", d: ["connexion", "evolution"] },
    { id: "pardon-autre", t: "Penser à une personne qui m’a blessé·e et lui souhaiter du bien, juste un instant, pour me libérer", b: ["trahison", "rejet", "injustice"], d: ["connexion", "famille"] },
    { id: "frontiere", t: "Prévenir à l’avance de ce que je peux faire et de ce que je ne peux pas faire", b: ["trahison", "humiliation"], d: ["famille", "travail"] },
    { id: "corps-merci", t: "Remercier mon corps le soir pour ce qu’il a fait aujourd’hui", b: ["humiliation", "rejet"], d: ["energie", "connexion"] },
    { id: "miroir", t: "Me regarder dans le miroir et me dire une phrase vraie et douce", b: ["rejet", "humiliation"], d: ["evolution"] },
    { id: "promesse-soi", t: "Tenir une petite promesse faite à moi-même", b: ["trahison", "abandon"], d: ["evolution"] },
    { id: "reconnaitre", t: "Me féliciter à voix haute pour un effort que personne n’a vu", b: ["injustice"], d: ["travail", "evolution"] },
    { id: "accueil", t: "Accepter une invitation, même si j’ai un peu peur d’être de trop", b: ["rejet"], d: ["amis", "joie"], m: ["haut"] }
  ],

  /* Phrases de confiance, affichées près de ce que tu écris */
  PRIVE: "Ce que tu écris ici t’appartient. Avec ton espace, c’est chiffré et Genesolia ne le lit jamais. Sans compte, ça reste dans ce navigateur, rien n’est envoyé."
};
