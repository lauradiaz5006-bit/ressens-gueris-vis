/* Genesolia · Le Cercle · Carnet d'août 2027, « J'avance » : « Mon chez-moi, mon élan »
   Le carnet du mois est le côté coaching du Cercle : faire le point, choisir ce que l'on veut nourrir, avancer pas à pas.
   Le côté libération (« Racines, départs et lieux ») est dans Mon suivi (assets/suivi/2027-08.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-08',
  nomMois: 'août 2027',
  moisSuivant: 'septembre',
  titre: 'Mon chez-moi, mon élan',
  sousTitre: "Te sentir vraiment chez toi, là où tu vis, et oser le mouvement qui te fait envie, un petit pas à la fois.",
  pdf: '',
  image: 'assets/cercle/apercu-12-saisons.jpg',
  citation: "Être chez soi, ce n’est pas un lieu parfait. C’est un endroit où l’on a le droit d’être soi.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Mon lieu, mon élan', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/montagne.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-bienvenue.webp',
      theme: 'assets/guide/guide-arbre.webp',
      comprendre: 'assets/guide/guide-coffret.webp',
      exercices: 'assets/guide/guide-livre-pupitre.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/partir-mini.jpg', 'Partir n’est pas abandonner. C’est grandir.'],
      semaines: ['assets/cartes/racines-appuis-mini.jpg', 'Mes racines ne sont pas une cage. Ce sont mes appuis.']
    }
  },

  mots: {
    tonmois: "Lis ton mois comme on ouvre les volets d’une maison d’été : doucement, en laissant entrer ce qui te fait du bien.",
    ouverture: "Prends dix minutes, là où tu te sens bien. Ta météo, ta roue et ton objectif : regarde surtout ton domaine « chez-moi ».",
    theme: "Rien à faire ici, seulement à lire. Laisse venir les images de tes lieux, ceux d’hier et celui d’aujourd’hui.",
    comprendre: "Ton chez-moi n’a pas besoin d’être grand ni parfait. Il a besoin de te ressembler un peu plus chaque mois.",
    exercices: "Le premier exercice se fait en marchant chez toi, pièce par pièce. Prends ton carnet et laisse-toi guider par ce que tu ressens.",
    rituel: "Ce mois-ci, ta connexion passe par le seuil de ta porte et la lumière du soir. Un moment simple pour remercier ton lieu.",
    semaines: "Un coin rangé, une marche, un lieu nouveau : en août, chaque petit mouvement compte double.",
    cloture: "Regarde ton chez-moi avec les yeux du début du mois. Même un seul coin qui a changé, c’est un vrai pas."
  },

  theme: {
    titre: 'Le mois du chez-moi et de l’élan',
    texte: [
      "Août, c’est le cœur de l’été. Certain·es partent, d’autres restent, d’autres encore rentrent dans une maison de famille rouverte pour quelques semaines. La lumière est dorée, le rythme ralentit, et l’on voit soudain son lieu de vie avec d’autres yeux : en rentrant de voyage, en rangeant une valise, en passant une soirée sur le balcon.",
      "Ce carnet t’invite à te poser deux questions toutes simples. Est-ce que je me sens vraiment chez moi, là où je vis ? Et quel mouvement ai-je envie d’oser : ranger, transformer, déménager un jour peut-être, ou simplement bouger un peu plus dans ma vie ? Tu n’as rien à décider de définitif. Tu as seulement à écouter ce qui, en toi, a envie de bouger."
    ],
    sousTitre: 'Pourquoi le chez-moi compte autant ?',
    texte2: [
      "Ton lieu de vie est le domaine de ta roue que tu vois chaque jour, en te levant et en te couchant. Quand il te ressemble, il te recharge sans que tu y penses. Quand il te pèse, il te prend de l’énergie en silence : le désordre de l’entrée, la pièce où tu n’aimes pas rester, l’impression d’être de passage.",
      "Se sentir chez soi, ce n’est pas une question de mètres carrés ni de décoration. C’est se sentir **en sécurité**, **à sa place**, et **libre** de faire évoluer son lieu. Une chambre en colocation peut être un vrai chez-soi, et une grande maison peut rester étrangère.",
      "Ce mois-ci, tu vas **regarder** ton chez-moi pièce par pièce, **choisir** le changement que tu as envie d’oser, et **remettre du mouvement** dans ta vie, dans ton corps comme dans tes projets. En parallèle, ton suivi « Je me libère » t’emmène vers les lieux de ta lignée, les départs et les racines : les deux avancent ensemble."
    ],
    exemplesTitre: 'Ce que ton chez-moi peut te montrer',
    exemples: [
      "**Une pièce que tu évites** : le bureau encombré où tu n’entres plus, ou la chambre d’amis devenue débarras. Elle raconte souvent un projet en attente.",
      "**Un coin où tu respires** : le fauteuil près de la fenêtre, la table de la cuisine le matin. Il te montre ce dont tu as besoin pour te sentir bien.",
      "**L’impression d’être de passage** : les cartons jamais tout à fait vidés, les murs restés blancs. Comme si tu n’osais pas t’installer pour de bon.",
      "**Une envie qui revient** : changer de ville, vivre près de la mer, avoir un jardin. Elle ne demande pas forcément un déménagement, mais elle demande à être écoutée.",
      "**Un manque de mouvement** : tu passes de la maison au travail sans jamais marcher, et ton énergie s’en ressent."
    ],
    exempleSpiraleTitre: 'Un exemple de petit pas',
    exempleSpirale: "Ta roue montre ton chez-moi à 4. Tu ne vas pas déménager ce mois-ci : tu choisis un seul coin. Le samedi matin, tu vides le fauteuil couvert de vêtements, tu l’approches de la fenêtre, tu y poses un plaid et une lampe. Le soir, tu t’y installes avec un livre. À la fin du mois, ton chez-moi est à 6, et tu as découvert que tu avais surtout besoin d’un endroit rien qu’à toi.",
    question: { k: 'theme-chezmoi', q: "Dans quel lieu, aujourd’hui ou dans ta vie, t’es-tu senti·e vraiment chez toi, et qu’est-ce qui le rendait si bon ?", ph: "Exemple : la cuisine de ma grand-mère, l’été. Il y avait du bruit, de la lumière, et personne ne me demandait d’être sage." }
  },

  comprendre: {
    titre: 'Habiter ton lieu, oser le mouvement',
    texte: [
      "Ton chez-moi n’est pas une note sur ta réussite. C’est un lieu vivant, qui change avec toi. Il garde la trace de tes saisons de vie : un déménagement précipité, une séparation, un enfant qui grandit, une période où tu n’avais pas l’énergie de ranger. Le regarder avec douceur, c’est déjà commencer à l’habiter.",
      "En coaching, on distingue souvent trois besoins dans un lieu de vie. Le **besoin de sécurité** : te sentir protégé·e, savoir que tu peux te reposer. Le **besoin d’identité** : voir autour de toi des objets, des couleurs, des images qui te ressemblent. Le **besoin d’élan** : sentir que ton lieu t’aide à avancer, à créer, à recevoir, au lieu de te retenir.",
      "Le mouvement, lui, ne passe pas forcément par un déménagement. Déplacer un meuble, ouvrir une pièce fermée, aller marcher dans un quartier inconnu, partir deux jours seul·e : chaque petit changement de lieu remet de l’air dans ta vie. Souvent, quand on bouge dehors, quelque chose se débloque aussi dedans.",
      "Et si une grande envie de changement te travaille, partir, t’installer ailleurs, tu n’as pas besoin de trancher tout de suite. Ce carnet t’aide à l’écouter, à la préciser, et à faire un premier pas qui ne t’engage pas encore, mais qui te rapproche."
    ],
    reperes: [
      { titre: 'Tu te sens chez toi quand…', points: [
        "tu peux te reposer sans te sentir de passage ;",
        "tu reconnais autour de toi des objets qui racontent ta vie à toi ;",
        "tu as au moins un coin rien qu’à toi, même tout petit ;",
        "tu as envie d’inviter, de créer, de rester."
      ] },
      { titre: 'Ton lieu te demande du mouvement quand…', points: [
        "tu évites une pièce, ou tu ne t’assois jamais au même endroit deux fois ;",
        "tu rêves souvent d’ailleurs, sans savoir ce que tu y chercherais ;",
        "tu gardes des objets d’une autre époque de ta vie qui te pèsent ;",
        "parfois, une envie de partir ou de rester qui semble plus vieille que toi : c’est le rôle de ton suivi de la regarder."
      ] }
    ],
    regarderTitre: 'Pour ton chez-moi, demande-toi',
    regarderIntro: "Prends ces questions une par une, si possible assis·e dans ton lieu de vie, à l’endroit où tu te sens le mieux. Écris ce qui vient, sans chercher la phrase parfaite.",
    regarder: [
      { k: 'lieu-ressenti', q: "Quand tu passes ta porte le soir, qu’est-ce que tu ressens en premier ?", ph: "Exemple : du soulagement, puis un peu de lassitude en voyant le linge à plier dans l’entrée." },
      { k: 'lieu-dix', q: "À quoi ressemblerait ton chez-moi à 10 sur 10, dans une journée ordinaire ?", ph: "Exemple : une entrée dégagée, une table où je prends mon petit-déjeuner au soleil, des plantes vertes, et un coin lecture." },
      { k: 'lieu-envie', q: "Quel mouvement as-tu envie d’oser, petit ou grand, dans ton lieu ou dans ta vie ?", ph: "Exemple : repeindre ma chambre, et un jour vivre plus près de la nature." },
      { k: 'lieu-frein', q: "Qu’est-ce qui te retient aujourd’hui de faire ce mouvement ?", ph: "Exemple : la peur de me tromper, et l’idée qu’il faut tout faire d’un coup." },
      { k: 'lieu-point', q: "Qu’est-ce qui ferait gagner un seul point à ton chez-moi d’ici la fin du mois ?", ph: "Exemple : vider le fauteuil de la chambre et en faire mon coin à moi." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Si ton envie de partir ou de rester te semble plus ancienne que toi, ton [suivi « Je me libère »](mon-suivi.html) t’emmène ce mois-ci vers les lieux et les départs de ta lignée. Et le [test de l’arbre de vie](arbre-de-vie.html) te montre en cinq minutes comment ton chez-moi s’accorde avec les autres sphères de ta vie.",
    outils: [
      ['arbre-de-vie.html', 'Faire le test de l’arbre de vie', 'Cinq minutes pour voir les sphères lumineuses et celles à nourrir. Gardé avec sa date dans ton espace.'],
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel d’août et tes dates clés, pour savoir quand oser ton mouvement.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : les lieux de ta lignée, les départs, et là où tu te sens chez toi.']
    ]
  },

  exercicesTitre: 'Regarder, oser, bouger',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier te fait visiter ton chez-moi avec un regard neuf, le deuxième t’aide à choisir le changement que tu veux oser, le troisième remet du mouvement dans tes journées. Commence par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: 'Mon chez-moi, pièce par pièce', type: 'tableau', rangs: 3,
      etiquettes: ['Là où je me repose', 'Là où je vis avec les autres', 'Un coin rien qu’à moi'],
      consigne: "Fais le tour de ton lieu de vie, carnet en main, comme si tu le visitais pour la première fois. Pour ces trois endroits, note ce que tu ressens en y entrant, ce qui te pèse, et un petit changement possible. Si tu n’as pas encore de coin à toi, écris celui que tu aimerais avoir.",
      pourquoi: "On ne voit plus son propre lieu à force d’y vivre. Le visiter avec un regard neuf, c’est repérer les endroits qui te rechargent et ceux qui te vident, et retrouver le pouvoir de les transformer.",
      colonnes: [
        { q: "Qu’est-ce que tu ressens en entrant dans cet endroit ?", ph: ["Exemple : de la douceur, mais aussi du fouillis sur la table de nuit", "Exemple : de la chaleur, le salon est vivant le soir", "Exemple : rien, je n’en ai pas vraiment, je lis sur le canapé"] },
        { q: "Qu’est-ce qui te pèse ou te gêne ici ?", ph: ["Exemple : les papiers en attente posés sur la commode", "Exemple : la télévision allumée en continu", "Exemple : je suis toujours interrompu·e"] },
        { q: "Quel petit changement pourrais-tu faire ?", ph: ["Exemple : ranger les papiers dans une boîte et la sortir de la chambre", "Exemple : un soir sans écran par semaine, avec une bougie", "Exemple : installer un fauteuil près de la fenêtre de la chambre"] }
      ],
      apres: { k: 'ex1-chezmoi', q: "Relis tes trois lignes. Quel changement veux-tu faire en premier, et quand ?", ph: "Exemple : mon coin à moi. Samedi matin, je vide le fauteuil et je l’approche de la fenêtre." } },

    { k: 'ex2', titre: 'Les changements que j’ose', type: 'blocs', nb: 3,
      etiquettes: ['Un petit changement', 'Un changement moyen', 'Un rêve de changement'],
      consigne: "Choisis trois changements de lieu ou de mouvement qui te font envie : un petit, faisable cette semaine ; un moyen, pour les prochains mois ; un rêve, plus grand, même s’il te semble lointain. Pour chacun, note ce qui te retient, et le tout premier pas qui ne t’engage à rien de définitif.",
      pourquoi: "Quand une envie de changement reste floue, elle fait peur ou elle fatigue. En la découpant en trois tailles, tu vois qu’un petit pas est possible tout de suite, et que même un grand rêve commence par une recherche, une visite, une conversation.",
      astuce: "Pour ton rêve, écris le premier pas le plus minuscule possible : regarder une carte, poser une question à quelqu’un qui vit là-bas, passer un week-end sur place.",
      champs: [
        { q: "Quel changement as-tu envie d’oser ?", ph: ["Exemple : repeindre le mur de ma chambre en vert sauge", "Exemple : transformer la chambre d’amis en atelier", "Exemple : vivre un jour près de la mer"] },
        { q: "Qu’est-ce qui te retient aujourd’hui ?", ph: ["Exemple : je repousse, je n’ai pas choisi la couleur", "Exemple : la peur de ne plus pouvoir recevoir ma famille", "Exemple : mon travail, et la peur d’être loin de mes proches"] },
        { q: "Quel est ton tout premier pas, sans engagement ?", ph: ["Exemple : acheter deux échantillons de peinture samedi", "Exemple : vider l’armoire de la chambre d’amis", "Exemple : passer un week-end en septembre dans la ville qui m’attire"] }
      ] },

    { k: 'ex3', titre: 'Mon élan d’été', type: 'texte',
      consigne: "Le mouvement du corps entraîne souvent le mouvement de la vie. Choisis un geste tout simple qui te fait bouger, dehors ou chez toi, si petit qu’il est impossible de ne pas le faire. Fais-le, puis note chaque fois que tu l’as répété, et ce que tu as ressenti.",
      pourquoi: "Quand on se sent coincé·e quelque part, le corps le sent avant la tête. Bouger un peu chaque jour, changer de trajet, sortir à une autre heure, c’est rappeler à ton corps qu’il peut aller ailleurs. L’élan revient souvent par les pieds.",
      gestes: ["Marcher dix minutes après le dîner", "Prendre un autre chemin pour rentrer", "Danser sur une chanson en rangeant", "Ouvrir grand les fenêtres chaque matin", "Déplacer un objet pour changer ton regard", "Aller boire un café dans un quartier inconnu"],
      q: "Ton geste d’élan : « Chaque jour (ou chaque semaine), pour remettre du mouvement dans ma vie, je vais… »",
      ph: "Exemple : chaque soir après le dîner, je vais marcher dix minutes dans le quartier, sans téléphone, en regardant les fenêtres allumées.",
      journal: { k: 'ex3-elan', n: 6, q: "Chaque fois que tu l’as fait : quand, et qu’as-tu ressenti ?", ph: "Exemple : mardi soir, j’ai découvert une petite place avec un banc. Je me suis senti·e en vacances chez moi." } }
  ],

  rituel: {
    titre: 'Le seuil et la lumière du soir',
    intro: "En août, les soirées sont longues et la lumière dorée s’attarde sur les murs. Ce petit rituel symbolique t’invite à remercier ton lieu de vie, à déposer ce qui l’alourdit, et à y inviter l’élan que tu veux pour la suite de l’été. Il se fait en dix minutes, au moment où le soleil descend.",
    materiel: "Une bougie ou une petite lampe, un verre d’eau, quelques fleurs ou une branche cueillie dehors (ou une plante de la maison), et un endroit près de ta porte d’entrée ou d’une fenêtre ouverte.",
    quand: "Fais-le un soir de début de mois, après avoir rempli ta roue, ou en rentrant de vacances pour retrouver ton chez-moi. Tu peux le refaire chaque fois que tu emménages quelque part, même pour quelques jours, ou à la pleine lune.",
    etapes: [
      "Ouvre ta porte ou ta fenêtre. Allume la bougie près du seuil, pose le verre d’eau et les fleurs à côté. Respire trois fois en regardant la lumière du soir.",
      "Pense à ce que ton lieu t’a offert cette année : des nuits de repos, des repas, des rires, des moments seul·e. Dis intérieurement : « Merci pour l’abri que tu me donnes. »",
      "Pense à une chose qui alourdit ton chez-moi : un désordre, une tension, un objet d’une autre époque. Nomme-la à voix basse : « Je te laisse partir. »",
      "Bois une gorgée d’eau, en imaginant qu’elle t’enracine là où tu vis. Puis franchis le seuil, un pas dehors, un pas dedans, comme pour entrer à nouveau chez toi.",
      "Pose une main sur ton cœur et dis ton intention : « Je choisis de me sentir chez moi ici, et j’ose le mouvement qui me fait envie. »",
      "Laisse la bougie briller quelques minutes, puis éteins-la. Le soir, note ici ce que tu as déposé et l’élan que tu as invité."
    ],
    note: { k: 'rituel-seuil', q: "Qu’as-tu remercié, qu’as-tu laissé partir, et quel élan as-tu invité chez toi ?", ph: "Exemple : j’ai remercié ma cuisine pour les dîners avec mes amis. J’ai laissé partir les cartons du placard. J’ai invité l’envie de recevoir plus souvent." }
  },

  meditation: {
    titre: 'La maison intérieure',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens le poids de ton corps, le sol sous tes pieds, l’air tiède de l’été sur ta peau. Tu n’as rien à faire, nulle part où aller. Tu es déjà arrivé·e.",
      "Imagine maintenant un chemin, dans la lumière dorée d’un soir d’août. Au bout de ce chemin, il y a une maison. Ce n’est pas forcément une maison que tu connais : c’est ta maison intérieure, celle qui te ressemble vraiment.",
      "Approche-toi doucement. Regarde la porte : sa couleur, sa matière, la poignée sous ta main. Ouvre-la, et entre.",
      "[pause]",
      "À l’intérieur, tout est à ta mesure. Regarde la lumière, les couleurs, les objets. Sens l’odeur de cette maison. Écoute ses sons : un parquet qui craque, le vent dans un rideau, le silence.",
      "Trouve la pièce où tu te sens le mieux. Installe-toi. Ici, tu es en sécurité. Ici, tu as le droit d’être exactement comme tu es.",
      "[longue pause]",
      "Remarque maintenant une fenêtre. Derrière elle, un paysage que tu as envie de découvrir : une mer, une forêt, une ville, une route. C’est ton élan. Tu n’as pas besoin de partir tout de suite. Regarde-le, simplement, et sens qu’il est possible.",
      "Si quelque chose te serre ou te retient, une peur, une hésitation, laisse-la s’asseoir à côté de toi. Elle a le droit d’être là. Tu restes au calme, dans ta maison.",
      "[pause]",
      "Dis intérieurement : « Je suis chez moi en moi. Où que j’aille, je peux revenir ici. J’ose le mouvement qui me fait envie, à mon rythme. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais-la un soir d’été, fenêtre ouverte, ou un matin tranquille avant que la maison ne s’éveille. Si tu es en vacances loin de chez toi, c’est un beau moment pour la faire : ta maison intérieure voyage avec toi.",
    note: { k: 'medit-maison', q: "Comment était ta maison intérieure, et qu’as-tu vu par la fenêtre ?", ph: "Exemple : une petite maison en pierre, une cuisine pleine de soleil. Par la fenêtre, une forêt. J’ai envie de marcher plus souvent dans les bois." }
  },

  semaines: [
    { titre: 'Un coin qui me ressemble', texte: "Cette semaine, choisis un seul coin de ton lieu de vie et transforme-le pour qu’il te ressemble : vide-le, déplace un meuble, ajoute une lampe, une plante, une photo que tu aimes. Puis passe-y au moins un moment chaque jour.",
      exemple: "Par exemple : le rebord de la fenêtre de la cuisine, avec un petit pot de basilic et la photo de ton dernier voyage. Ou un fauteuil près de la fenêtre, avec un plaid et le livre que tu repousses depuis des mois.",
      ph: "Exemple : j’ai transformé le coin de la chambre en coin lecture. J’y bois mon café chaque matin, et je me sens enfin chez moi." },
    { titre: 'Bouger chaque jour', texte: "Chaque jour, offre-toi un moment de mouvement, même court : une marche, quelques étirements au réveil, une danse en cuisine, un trajet à vélo. Note ton énergie avant et après.",
      exemple: "Par exemple : « Lundi : 4 avant, 6 après, dix minutes de marche au coucher du soleil. » À la fin de la semaine, regarde ce qui t’a le plus remis en élan.",
      ph: "Exemple : la marche du soir me fait du bien, mais c’est la danse en rangeant qui me donne le plus d’énergie." },
    { titre: 'Explorer un lieu nouveau', texte: "Cette semaine, va découvrir un endroit où tu n’es jamais allé·e : un quartier, un parc, un village voisin, une librairie, un sentier. Observe ce que tu ressens en arrivant quelque part pour la première fois.",
      exemple: "Par exemple : un samedi matin au marché d’un village à vingt minutes, ou une balade dans un quartier que tu ne traverses qu’en voiture. Remarque ce qui te donne envie de rester, et ce qui te fait du bien de quitter.",
      ph: "Exemple : j’ai découvert un parc au bord de l’eau. J’ai réalisé que j’ai besoin de voir de l’eau pour me sentir apaisé·e." },
    { titre: 'Refaire ma roue', texte: "En fin de semaine, refais ta roue de la vie dans ton bilan et compare-la avec celle du début du mois, en regardant surtout ton chez-moi. Tu peux aussi refaire le [test de l’arbre de vie](arbre-de-vie.html) et regarder ce qui a bougé dans [ton espace](login.html#mon-chemin).",
      exemple: "Par exemple : ton chez-moi est passé de 4 à 6, ton énergie de 5 à 6. Rien n’a été révolutionné, et pourtant tu rentres le soir avec plaisir. Remercie-toi pour ce que tu as osé ce mois-ci.",
      ph: "Exemple : mon chez-moi a gagné deux points depuis que j’ai mon coin à moi. Je me sens plus ancré·e, et j’ai envie d’inviter des amis." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-chezmoi', q: "Qu’est-ce qui a changé dans ton chez-moi ce mois-ci, et qu’est-ce que tu ressens en rentrant ?", ph: "Exemple : l’entrée est dégagée et j’ai un coin lecture. Je rentre le soir avec le sourire." },
    { k: 'fin-elan', q: "Quel mouvement as-tu osé, petit ou grand, et qu’est-ce qu’il t’a appris ?", ph: "Exemple : j’ai passé un week-end dans la ville qui m’attire. J’ai compris que c’est surtout la nature qui me manque." },
    { k: 'fin-lieu-garder', q: "Quelle habitude de mouvement ou de lieu veux-tu garder ?", ph: "Exemple : ma marche du soir, et mon café du matin dans mon coin." },
    { k: 'fin-intention', q: "Quelle est ton intention pour septembre ?", ph: "Exemple : garder mon élan à la rentrée, et chercher ce qui me fait vraiment vibrer dans mon travail.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Racines, départs et lieux',
    texte: "Pendant que ton carnet t’aide à te sentir chez toi et à oser le mouvement, ton suivi t’emmène vers les lieux de ta lignée : les maisons gardées ou perdues, les départs, les exils, les retours. Ce que tu y reconnais t’aide à habiter ta vie plus librement, où que tu sois."
  },

  aVenir: [
    { mois: 'Septembre', titre: 'Ma vocation', texte: "Retrouver ce qui te fait vibrer, mettre du sens dans ton travail, et reconnaître tes talents.", image: 'assets/cartes/ecrire-la-mienne-mini.jpg' },
    { mois: 'Octobre', titre: 'Mon bilan de l’année', texte: "Comparer tes roues, célébrer le chemin parcouru, relire ta lettre, et choisir la suite.", image: 'assets/cartes/a-mon-rythme-mini.jpg' },
    { mois: 'Novembre', titre: 'Une nouvelle année dans Le Cercle', texte: "Un nouveau tour de spirale, avec tout ce que tu as appris en chemin.", image: 'assets/guide/guide-spirale-or.webp' }
  ]
};
