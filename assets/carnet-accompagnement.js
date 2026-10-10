/* Genesolia · Le carnet du mois : textes de l'accompagnement personnalisé
   - BLESSURES : le test des cinq blessures (mêmes phrases que blessures-de-l-ame.html) et le point du mois.
   - GESTES : la bibliothèque des gestes à cocher, choisis d'après les réponses (jamais au hasard).
   - ROUE : la lecture de ta roue (domaines les plus bas, le plus haut, évolution).
   - BILAN : les messages du bilan des gestes.
   Ce ne sont ni des diagnostics ni des prédictions : des repères pour t'accompagner. */
window.CARNET_ACCOMP = {

  /* La lecture de ta roue : une phrase quand le domaine est bas, une quand il est ta force */
  ROUE: {
    energie: { bas: "Ton énergie demande du soin : du sommeil, des pauses, et le droit de faire moins certains jours.", haut: "Ton énergie est une vraie ressource : appuie-toi dessus pour faire bouger un domaine plus fragile." },
    amour: { bas: "Ton cœur a besoin d’attention : un moment de tendresse, pour ton couple ou pour toi, compte déjà.", haut: "Ton cœur est nourri : cette douceur peut rayonner sur le reste de ta vie." },
    famille: { bas: "Tes liens familiaux pèsent ou manquent : un petit pas, un appel, une limite posée, peut alléger beaucoup.", haut: "Tes liens familiaux te soutiennent : c’est une base solide pour avancer." },
    amis: { bas: "Tu te sens peu entouré·e : un seul message à une personne qui te fait du bien peut tout changer cette semaine.", haut: "Ton entourage est une force : n’hésite pas à t’appuyer dessus." },
    travail: { bas: "Ton travail ou tes projets te nourrissent peu en ce moment : cherche le plus petit changement possible, pas la révolution.", haut: "Ton travail te porte : cette satisfaction peut t’aider à oser ailleurs." },
    argent: { bas: "Ta sécurité matérielle t’inquiète : regarder tes comptes avec calme est déjà un premier pas.", haut: "Tu te sens en sécurité matérielle : c’est une liberté pour prendre soin du reste." },
    chezmoi: { bas: "Ton cadre de vie te pèse : un coin rangé, une fleur, une lumière, et ta maison respire avec toi.", haut: "Ton chez-toi est un refuge : profites-en pour t’y ressourcer." },
    joie: { bas: "La joie manque un peu : accorde-toi un plaisir simple, sans attendre de l’avoir mérité.", haut: "La joie est présente dans ta vie : garde-lui sa place, même quand tout s’accélère." },
    evolution: { bas: "Tu sens que tu avances peu : regarde le chemin déjà fait, il est souvent plus long que tu ne crois.", haut: "Tu grandis et tu le sens : c’est le moment de nourrir cet élan." },
    connexion: { bas: "Ta connexion à toi demande un peu de calme : cinq minutes de silence par jour suffisent pour commencer.", haut: "Tu es bien relié·e à toi : cette présence t’aide dans toutes tes décisions." }
  },
  ROUE_EVOL: { monte: "Par rapport au mois dernier, ta roue s’est arrondie ici :", baisse: "Et ici, elle s’est un peu creusée, ce qui est une information, pas un échec :", stable: "Ta roue ressemble beaucoup à celle du mois dernier : tu la connais mieux, et c’est déjà un pas." },

  BILAN: {
    zero: "Tu n’as pas encore coché de geste ce mois-ci. Il est encore temps : un seul geste, aujourd’hui, compte déjà.",
    un: "Chaque geste compte, même un seul. Tu as commencé, et c’est le plus important.",
    quelques: "Regarde tout ce que tu as fait pour toi. Ce sont ces petits pas qui changent une vie.",
    beaucoup: "C’est énorme. Chacun de ces gestes est une preuve d’amour pour toi : relis cette liste quand tu doutes.",
    nouveau: "nouveau pour toi"
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

  /* Phrase de confiance, exacte : les écrits sont chiffrés dans la base, la clé est côté serveur */
  PRIVE: "Tes écrits sont chiffrés dans ton espace, et Genesolia ne les lit jamais. Sans compte, ils restent dans ce navigateur."
};
