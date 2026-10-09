/* Genesolia · Le Cercle · Carnet d'octobre 2027, « J'avance » : « Mon bilan de l'année »
   Le carnet du mois est le côté « J'avance » du Cercle : faire le point, choisir ce que l'on veut nourrir, avancer pas à pas.
   Le côté libération (« Les âges qui se répondent ») est dans Mon suivi (assets/suivi/2027-10.js).
   Dernier carnet de l'année : il boucle la spirale ouverte en octobre 2026 avec « Mon point de départ ».
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-10',
  nomMois: 'octobre 2027',
  moisSuivant: 'novembre',
  titre: 'Mon bilan de l’année',
  sousTitre: "Une année dans Le Cercle : comparer tes roues, célébrer le chemin parcouru, relire ta lettre, et choisir la suite.",
  pdf: '',
  image: 'assets/cercle/apercu-12-saisons.jpg',
  citation: "Tu n’es pas revenu·e au point de départ. Tu es au même endroit, un tour plus haut.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Relire mon année', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-spirale-or.webp',
      comprendre: 'assets/guide/guide-livre-pupitre.webp',
      exercices: 'assets/guide/guide-coffret.webp',
      rituel: 'assets/guide/guide-arbre.webp',
      semaines: 'assets/guide/guide-cadeau.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/apprendre-mini.jpg', 'Tout ce qui revient a quelque chose à m’apprendre.'],
      semaines: ['assets/cartes/a-mon-rythme-mini.jpg', 'Je ne suis pas en retard. Je suis à mon rythme.']
    }
  },

  mots: {
    tonmois: "Lis ton mois comme la dernière page d’un beau livre : lentement, avec gratitude pour tout ce qui a été écrit.",
    ouverture: "Remplis ta roue sans regarder celle de l’an dernier. La comparaison viendra plus tard, et elle te surprendra.",
    theme: "Rien à faire ici, seulement à lire. Laisse remonter les visages, les moments, les petites victoires de l’année.",
    comprendre: "Un bilan n’est pas un examen. C’est un regard tendre sur le chemin, avec ses détours, ses pauses et ses élans.",
    exercices: "Pour le premier exercice, ouvre [ton espace](login.html#mon-chemin) : tes roues de l’année t’y attendent.",
    rituel: "Ce mois-ci, ta connexion passe par douze feuilles d’automne et une bougie. Une feuille pour chaque mois vécu.",
    semaines: "Cette fois, les défis sont des cadeaux : relire, célébrer, remercier, choisir. Tu l’as bien mérité.",
    cloture: "C’est le dernier bilan de l’année. Prends ton temps. Tout ce que tu as fait compte, même ce qui n’a pas été fini."
  },

  theme: {
    titre: 'Le mois du bilan',
    texte: [
      "Octobre revient. Il y a un an, presque jour pour jour, tu ouvrais ton premier carnet du Cercle, « Mon point de départ ». Tu remplissais ta première roue de la vie, tu choisissais un domaine à nourrir, tu écrivais une lettre à la personne que tu serais un an plus tard. Cette personne, c’est toi, aujourd’hui.",
      "Ce dernier carnet de l’année t’invite à t’arrêter, à regarder le chemin parcouru, et à le célébrer. Pas pour te donner une note, mais pour reconnaître tout ce que tu as osé : les petits pas, les essais, les moments où tu as continué alors que c’était difficile. Et pour choisir, en conscience, ce que tu veux vivre maintenant."
    ],
    sousTitre: 'Pourquoi faire le bilan d’une année ?',
    texte2: [
      "On dit souvent que l’on surestime ce que l’on peut faire en un mois, et que l’on sous-estime ce que l’on peut faire en un an. Mois après mois, les changements semblent minuscules : un point gagné ici, une habitude là. Mais quand on regarde douze mois d’un coup, on voit souvent une vraie transformation.",
      "Faire le bilan, c’est **mesurer** ce qui a bougé, en comparant ta roue d’aujourd’hui à celle d’il y a un an ; **célébrer** ce que tu as vécu, les fiertés comme les difficultés traversées ; **relire** ta lettre de l’an dernier, pour voir ce qui s’est réalisé, ce qui a changé de forme, ce qui t’attend encore ; et **choisir** la suite, avec tout ce que tu sais maintenant de toi.",
      "Ce mois-ci, la spirale boucle son premier tour. Tu reviens en octobre, au même endroit de l’année, mais tu n’es plus la même personne. En parallèle, ton suivi « Je me libère » t’invite à regarder les âges et les dates qui se répondent dans ta famille, et à vivre chacun d’eux à ta façon : les deux avancent ensemble, jusqu’au bout."
    ],
    exemplesTitre: 'Ce qu’un bilan d’année peut te montrer',
    exemples: [
      "**Un domaine qui a beaucoup grandi** : ta joie était à 3 l’an dernier, elle est à 7. Tu ne l’avais pas remarqué, parce que ça s’est fait doucement.",
      "**Un domaine resté au même endroit** : ton argent n’a pas bougé. Ce n’est pas un échec : c’est peut-être le prochain domaine à nourrir.",
      "**Une habitude devenue naturelle** : tes trois mercis du soir, ta marche du matin. Tu les fais sans y penser, alors qu’ils te demandaient un effort en octobre dernier.",
      "**Une phrase de ta lettre qui s’est réalisée** : tu avais écrit « j’oserai dire ce que je pense », et tu l’as fait, plusieurs fois.",
      "**Une découverte inattendue** : tu pensais travailler ton couple, et c’est ta relation à ta mère qui a le plus changé."
    ],
    exempleSpiraleTitre: 'Un exemple de spirale',
    exempleSpirale: "En octobre dernier, ta roue montrait l’énergie à 3 et la connexion à toi à 2. Tu as choisi de marcher cinq minutes chaque matin. En novembre, tu as ajouté une ligne de gratitude, en janvier un soir sans écran. Aujourd’hui, ton énergie est à 6 et ta connexion à toi à 7. Tu relis ta lettre : tu avais écrit « J’espère que tu prends enfin du temps pour toi. » Tu souris. C’est fait, et ce n’est qu’un début.",
    question: { k: 'theme-annee', q: "Si tu devais résumer ton année dans Le Cercle en une phrase, que dirais-tu ?", ph: "Exemple : j’ai appris à m’écouter, à dire non sans culpabilité, et à voir d’où venaient mes vieilles peurs." }
  },

  comprendre: {
    titre: 'Relire ton année avec tendresse',
    texte: [
      "Un bilan n’est pas un examen. Il ne s’agit pas de vérifier si tu as tout réussi, mais de reconnaître le chemin que tu as fait, avec ses détours, ses pauses et ses élans. Les mois où tu n’as rien ouvert font aussi partie du chemin : ils t’ont peut-être appris que tu avais besoin de repos.",
      "Commence par **ce qui a grandi**. Regarde tes roues dans [ton espace](login.html#mon-chemin) : celle d’octobre dernier, et celle d’aujourd’hui. Note les domaines qui ont gagné des points, même un seul. Derrière chacun, il y a des gestes que tu as faits, des décisions que tu as prises. Ce sont tes victoires.",
      "Regarde ensuite **ce qui a résisté**. Un domaine qui n’a pas bougé, ou qui a baissé, n’est pas un échec : la vie a peut-être apporté une épreuve, un déménagement, une fatigue. Demande-toi ce qu’il t’a appris, et s’il a besoin d’attention maintenant, ou s’il peut encore attendre.",
      "Enfin, regarde **qui tu es devenu·e**. Au-delà des chiffres, qu’est-ce qui a changé dans ta façon de te parler, de réagir, de choisir ? C’est souvent là que se trouve la plus belle transformation de l’année : pas dans ce que tu as fait, mais dans la personne qui le fait."
    ],
    reperes: [
      { titre: 'Ton année a fait grandir…', points: [
        "les domaines de ta roue qui ont gagné un point ou plus ;",
        "les habitudes devenues naturelles, que tu fais sans y penser ;",
        "ta façon de te parler, plus douce, plus juste ;",
        "ta capacité à reconnaître une boucle avant qu’elle ne se rejoue."
      ] },
      { titre: 'Ton année te laisse en chemin…', points: [
        "un domaine qui attend encore ton attention, sans urgence ;",
        "une envie notée dans un carnet, que tu n’as pas encore osée ;",
        "une question restée ouverte sur ton histoire familiale ;",
        "des graines plantées qui fleuriront plus tard, à leur rythme."
      ] }
    ],
    regarderTitre: 'Pour ton bilan, demande-toi',
    regarderIntro: "Prends ces questions une par une, si possible avec tes carnets de l’année ouverts à côté de toi, dans [mes carnets précédents](mon-mois.html). Écris ce qui vient, sans chercher à tout résumer.",
    regarder: [
      { k: 'an-fier', q: "De quoi es-tu le plus fier ou la plus fière, quand tu regardes cette année ?", ph: "Exemple : d’avoir continué, même les mois où j’étais fatigué·e, et d’avoir parlé à mon père de son enfance." },
      { k: 'an-change', q: "Qu’est-ce qui a changé dans ta façon de te parler ou de réagir ?", ph: "Exemple : je ne me dis plus « je suis nul·le » quand je me trompe. Je me dis « tu apprends »." },
      { k: 'an-mois', q: "Quel carnet ou quel mois de l’année t’a le plus marqué·e, et pourquoi ?", ph: "Exemple : décembre, « Ma place, mes limites ». J’ai dit non pour la première fois au repas de Noël." },
      { k: 'an-attente', q: "Qu’est-ce qui attend encore ton attention, sans urgence ?", ph: "Exemple : mon rapport à l’argent. Je l’ai effleuré, mais je n’ai pas encore osé vraiment le regarder." },
      { k: 'an-point', q: "Si tu pouvais faire gagner un point à un seul domaine pour bien commencer la nouvelle année, lequel choisirais-tu ?", ph: "Exemple : mes amitiés. J’ai beaucoup travaillé sur moi, j’ai envie de partager plus." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Tes roues, tes météos et ta lettre de l’an dernier sont gardées dans [ton espace](login.html#mon-chemin), et tous tes carnets de l’année t’attendent dans [mes carnets précédents](mon-mois.html). Tu peux aussi refaire le [test de l’arbre de vie](arbre-de-vie.html) et le comparer à ton premier.",
    outils: [
      ['login.html#mon-chemin', 'Mon chemin', 'Tes roues, tes météos et ta lettre de dans un an, gardées avec leur date tout au long de l’année.'],
      ['mon-mois.html', 'Mes carnets précédents', 'Relire tes carnets de l’année, de « Mon point de départ » à « Ma vocation ».'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : les âges et les dates qui se répondent, et la fin du premier tour de spirale.']
    ]
  },

  exercicesTitre: 'Mesurer, célébrer, choisir',
  exercicesIntro: "Trois exercices pour clore l’année. Le premier compare ta roue d’aujourd’hui à celle d’octobre dernier, le deuxième célèbre trois moments de ton année, le troisième te fait relire ta lettre et choisir la suite. Prends ton temps : c’est le plus beau rendez-vous de l’année.",
  exercices: [
    { k: 'ex1', titre: 'Mes deux roues', type: 'tableau', rangs: 3,
      etiquettes: ['Un domaine qui a grandi', 'Un domaine resté au même endroit', 'Un domaine qui a baissé ou qui attend'],
      consigne: "Ouvre ta roue d’octobre dernier dans [ton espace](login.html#mon-chemin), et remplis celle de ce mois-ci dans ta météo du début. Choisis trois domaines : un qui a grandi, un qui est resté au même endroit, un qui a baissé ou qui attend encore. Pour chacun, note la note d’il y a un an et celle d’aujourd’hui, ce qui explique ce mouvement, et ce que tu en retiens. Si tu n’as pas ta roue de l’an dernier, fie-toi à ton souvenir.",
      pourquoi: "Mois après mois, on ne voit pas toujours les progrès. En comparant deux roues à un an d’écart, tu vois d’un coup tout le chemin parcouru. Et tu comprends ce qui a vraiment fait la différence : ce sont ces gestes-là que tu pourras garder.",
      colonnes: [
        { q: "Quel domaine, et quelle note il y a un an, puis aujourd’hui ?", ph: ["Exemple : la joie, de 3 à 7", "Exemple : l’argent, 5 et toujours 5", "Exemple : la famille, de 6 à 4"] },
        { q: "Qu’est-ce qui explique ce mouvement ?", ph: ["Exemple : la danse du mardi, les trois mercis du soir, les amies retrouvées", "Exemple : je ne m’en suis pas vraiment occupé·e, j’ai donné la priorité au reste", "Exemple : j’ai posé des limites, ça a créé des tensions avec ma sœur"] },
        { q: "Qu’est-ce que tu en retiens pour la suite ?", ph: ["Exemple : je sais maintenant ce qui nourrit ma joie, je le garde", "Exemple : c’est peut-être le domaine à nourrir en premier cette année", "Exemple : les tensions sont passagères, mes limites sont justes"] }
      ],
      apres: { k: 'ex1-roues', q: "Regarde tes deux roues côte à côte. Quelle est la plus grande surprise de ton année ?", ph: "Exemple : ma connexion à moi a gagné cinq points. Je ne l’avais pas remarqué, parce que ça s’est fait tout doucement." } },

    { k: 'ex2', titre: 'Les trois moments de mon année', type: 'blocs', nb: 3,
      etiquettes: ['Une fierté', 'Une difficulté traversée', 'Une joie inattendue'],
      consigne: "Choisis trois moments de ton année dans Le Cercle : une fierté, une difficulté que tu as traversée, une joie à laquelle tu ne t’attendais pas. Pour chacun, décris le moment, ce qu’il t’a appris, et ce que tu as envie de te dire aujourd’hui en y repensant.",
      pourquoi: "On retient souvent les difficultés et l’on oublie les victoires. Mettre côte à côte une fierté, une épreuve et une joie, c’est donner à ton année sa vraie couleur : celle d’un chemin vivant, où tout a compté.",
      astuce: "Feuillette tes carnets précédents, tes notes de semaines, tes victoires : les moments sont déjà écrits, il suffit de les retrouver.",
      champs: [
        { q: "Quel était ce moment ?", ph: ["Exemple : le jour où j’ai demandé une augmentation, en mars", "Exemple : la dispute avec ma mère en décembre, quand j’ai dit non", "Exemple : la lettre que mon grand-oncle m’a envoyée sur l’histoire de notre famille"] },
        { q: "Qu’est-ce qu’il t’a appris ?", ph: ["Exemple : que ma valeur ne dépend pas de la réponse des autres", "Exemple : qu’on peut se fâcher et se retrouver, et que mes limites sont légitimes", "Exemple : que les questions qu’on pose ouvrent des portes inattendues"] },
        { q: "Que veux-tu te dire aujourd’hui en y repensant ?", ph: ["Exemple : « Bravo, tu as été courageux·se. »", "Exemple : « Tu as bien fait. Tu n’as pas perdu son amour. »", "Exemple : « Continue à poser des questions, ta famille a tant à raconter. »"] }
      ] },

    { k: 'ex3', titre: 'Relire ma lettre, choisir la suite', type: 'questions',
      consigne: "Il y a un an, tu as écrit une lettre à la personne que tu serais aujourd’hui. Retrouve-la dans [ton espace](login.html#mon-chemin), ou dans ton premier carnet. Lis-la lentement, à voix haute si tu peux. Puis réponds-lui, et choisis la direction de ta nouvelle année. Si tu n’avais pas écrit de lettre, imagine ce que tu te serais dit, et réponds quand même.",
      pourquoi: "Relire sa lettre un an plus tard, c’est l’un des plus beaux moments du Cercle. On y découvre ce qui s’est réalisé, ce qui a changé de forme, et parfois une phrase qu’on avait oubliée et qui prend tout son sens. Lui répondre, c’est fermer la boucle, et ouvrir la spirale suivante.",
      choix: { k: 'suite-direction', q: "Pour l’année qui vient, tu as surtout envie de…", options: ['Approfondir ce que j’ai commencé', 'Nourrir un domaine que j’ai laissé de côté', 'Ralentir et savourer ce qui est déjà là', 'Explorer quelque chose de tout nouveau', 'Je ne sais pas encore, et c’est très bien'] },
      questions: [
        { k: 'lettre-relue', q: "En relisant ta lettre, qu’est-ce qui s’est réalisé, et qu’est-ce qui a changé de forme ?", ph: "Exemple : j’avais écrit « tu as une maison qui te ressemble ». Je n’ai pas déménagé, mais mon appartement me ressemble enfin.", lignes: 3 },
        { k: 'lettre-phrase', q: "Quelle phrase de ta lettre te touche le plus aujourd’hui ?", ph: "Exemple : « N’oublie pas que tu as le droit de te reposer. »", court: true },
        { k: 'lettre-reponse', q: "Ta réponse à la personne qui t’a écrit il y a un an : ce que tu veux lui dire, la remercier, la rassurer", ph: "Exemple : Chère moi d’il y a un an, tu doutais tellement. Je veux te dire que tu as bien fait d’ouvrir ce premier carnet. Tu as appris à dire non, à marcher le matin, à écouter ta famille autrement. Merci d’avoir osé commencer. Tu peux être fière de nous.", lignes: 7 },
        { k: 'suite-intention', q: "Pour la nouvelle année qui s’ouvre, quel est le premier domaine que tu choisis de nourrir, et pourquoi ?", ph: "Exemple : l’argent. J’ai fait la paix avec mon histoire familiale, je me sens prêt·e à regarder mes chiffres en face.", lignes: 2 }
      ] }
  ],

  rituel: {
    titre: 'Les douze feuilles',
    intro: "En octobre, la nature lâche ce qui a fini son temps et garde sa sève pour la saison suivante. Ce petit rituel symbolique t’invite à faire le tour de ton année, mois par mois, avec douze feuilles d’automne : une pour chaque mois vécu dans Le Cercle. Il se fait en quinze minutes, dehors si tu peux, ou près d’une fenêtre ouverte.",
    materiel: "Douze feuilles d’arbre tombées (ou douze petits papiers), un crayon, une bougie, et un endroit au calme : un parc, un jardin, un balcon, ou une table près d’une fenêtre.",
    quand: "Fais-le après avoir rempli tes deux roues et relu ta lettre, un après-midi d’octobre ou un soir de pleine lune. Tu peux en faire un rendez-vous d’automne, chaque année, pour marquer chaque tour de spirale.",
    etapes: [
      "Installe-toi au calme. Allume la bougie. Dispose les douze feuilles en cercle, ou en spirale, devant toi. Respire trois fois profondément.",
      "Prends la première feuille, pour octobre dernier. Écris un mot dessus : ce que ce mois t’a apporté. Repose-la. Fais de même pour chaque mois, jusqu’à septembre, sans chercher le mot parfait.",
      "Regarde ta spirale de feuilles. Dis intérieurement : « Merci pour chaque mois de cette année. Merci pour ce que j’ai osé, pour ce que j’ai appris, et même pour ce que je n’ai pas fini. »",
      "Choisis une feuille qui porte quelque chose que tu veux laisser derrière toi. Dépose-la au pied d’un arbre, ou laisse le vent l’emporter. Les autres, garde-les dans ton carnet ou dans une boîte.",
      "Pose une main sur ton cœur. Dis à voix basse ton intention pour la nouvelle année qui s’ouvre.",
      "Laisse la bougie briller quelques minutes, puis éteins-la. Le soir, note ici les mots de ton année et l’intention que tu as posée."
    ],
    note: { k: 'rituel-feuilles', q: "Quels mots as-tu écrits sur tes douze feuilles, laquelle as-tu laissée partir, et quelle intention as-tu posée ?", ph: "Exemple : départ, forces, place, valeurs, courage… J’ai laissé partir la feuille de février, « doute ». Mon intention : « Je continue, à mon rythme, avec confiance. »" }
  },

  meditation: {
    titre: 'Le chemin de l’année',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens tes pieds sur le sol, ton dos soutenu, ton souffle qui va et vient. Tu es là, aujourd’hui, en octobre. Un an a passé depuis ton premier carnet.",
      "Imagine un chemin qui monte doucement en spirale, autour d’une colline, dans la lumière dorée de l’automne. Les feuilles rousses craquent sous tes pas. Ce chemin, c’est ton année.",
      "Commence à marcher. Au premier virage, tu retrouves l’automne dernier : la personne que tu étais, qui ouvrait son premier carnet. Regarde-la avec tendresse. Elle ne savait pas encore tout ce qu’elle allait découvrir.",
      "[pause]",
      "Continue de marcher. Tu traverses l’hiver, ses fêtes, ses intentions. Puis le printemps, ses élans. Puis l’été, sa lumière. À chaque saison, laisse venir une image, un visage, un moment. Tu n’as pas besoin de tout revoir. Ce qui vient est juste.",
      "Remarque les endroits où tu as trébuché, et vois comme tu t’es relevé·e. Remarque les endroits où tu as osé, et sens la fierté monter doucement dans ta poitrine.",
      "[longue pause]",
      "Te voici revenu·e en octobre, au même endroit de l’année. Mais regarde : tu es plus haut sur la colline. Le paysage est plus large. Tu vois plus loin, plus clair.",
      "Retourne-toi vers la personne que tu étais il y a un an, tout en bas du chemin. Dis-lui intérieurement : « Merci d’avoir commencé. Regarde où nous sommes. »",
      "[pause]",
      "Puis regarde devant toi. Le chemin continue, il monte encore. Tu n’as pas besoin de savoir où il mène. Dis simplement : « J’avance à mon rythme, avec tout ce que j’ai appris. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais-la après avoir relu ta lettre, un soir tranquille ou un dimanche matin d’octobre. Si une émotion forte monte en revoyant certains moments, laisse-la passer, reviens à ton souffle et à tes pieds sur le sol. Tu peux faire une pause et reprendre plus tard.",
    note: { k: 'medit-annee', q: "Qu’est-ce qui t’est venu pendant la méditation ? Une saison, un visage, un moment de fierté, ce que tu as vu du haut de la colline…", ph: "Exemple : j’ai revu le repas de Noël où j’ai dit non. En haut de la colline, j’ai vu une mer au loin. J’ai senti que j’avais envie de voyager." }
  },

  semaines: [
    { titre: 'Relire mes carnets', texte: "Cette semaine, prends un moment pour relire tes carnets de l’année, un ou deux par soir, dans [mes carnets précédents](mon-mois.html). Ne relis pas tout : arrête-toi sur tes victoires de la semaine, tes bilans, les phrases que tu avais choisies.",
      exemple: "Par exemple : lundi, octobre et novembre ; mardi, décembre et janvier. Note à chaque fois une phrase qui te touche encore. À la fin de la semaine, tu auras un petit recueil de ton année.",
      ph: "Exemple : en relisant mes carnets, j’ai vu que la même phrase revenait : « J’ai le droit de prendre ma place. » Elle est devenue vraie." },
    { titre: 'Célébrer une victoire', texte: "Cette semaine, choisis une victoire de ton année et célèbre-la vraiment : un repas, une sortie, un petit cadeau, une soirée avec les personnes qui t’ont soutenu·e. Dis à voix haute ce que tu fêtes.",
      exemple: "Par exemple : un dîner avec ton amie pour fêter ton premier « non » à ta mère, ou une journée au bord de la mer pour fêter ta joie retrouvée. On fête rarement ses progrès intérieurs : c’est le moment.",
      ph: "Exemple : j’ai invité ma sœur au restaurant pour fêter mon année. Je lui ai raconté ce que j’avais compris. Elle m’a dit qu’elle me trouvait changé·e." },
    { titre: 'Remercier', texte: "Cette semaine, remercie trois personnes qui t’ont aidé·e à avancer cette année, et remercie-toi aussi. Un message, une carte, un appel, ou une lettre à toi-même.",
      exemple: "Par exemple : un message à ton amie qui t’a écouté·e en février, une carte à ta tante qui t’a raconté l’histoire de la famille, et un mot posé sur ton miroir : « Merci d’avoir continué. »",
      ph: "Exemple : j’ai remercié ma tante pour toutes ses histoires. Elle a pleuré au téléphone. Et je me suis écrit un mot, que j’ai glissé dans mon carnet." },
    { titre: 'Refaire ma roue et choisir la suite', texte: "En fin de semaine, refais ta roue de la vie dans ton bilan et compare-la avec celle du début du mois, et avec celle d’octobre dernier dans [ton espace](login.html#mon-chemin). Puis choisis le domaine que tu veux nourrir en premier dans la nouvelle année.",
      exemple: "Par exemple : ta roue a gagné en rondeur, ta joie et ta connexion à toi ont beaucoup grandi, ton argent attend encore. Tu choisis de commencer l’année par lui. Remercie-toi pour ce premier tour de spirale.",
      ph: "Exemple : ma roue n’a jamais été aussi ronde. Je commence la nouvelle année avec mes amitiés, parce que j’ai envie de partager tout ce que j’ai appris." }
  ],

  bilanTitre: 'Ce que cette année t’a apporté',
  bilan: [
    { k: 'fin-annee-grandi', q: "Qu’est-ce qui a le plus grandi en toi cette année ?", ph: "Exemple : la confiance. J’ose dire ce que je pense, et je ne m’excuse plus d’exister." },
    { k: 'fin-annee-habitude', q: "Quelles habitudes de l’année veux-tu emporter dans la suivante ?", ph: "Exemple : ma marche du matin, mes trois mercis, et mon rendez-vous du samedi avec moi." },
    { k: 'fin-annee-lettre', q: "Que dirais-tu, en une phrase, à la personne qui ouvrira son carnet dans un an ?", ph: "Exemple : « Continue d’avancer à ton rythme, tu es sur le bon chemin. »" },
    { k: 'fin-intention', q: "Quelle est ton intention pour novembre, le premier mois de ta nouvelle année ?", ph: "Exemple : commencer doucement, nourrir mes amitiés, et garder tout ce que j’ai appris.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Les âges qui se répondent',
    texte: "Pendant que ton carnet t’aide à faire le bilan de ton année, ton suivi t’invite à regarder les âges et les dates qui reviennent dans ta famille, et à vivre chacun d’eux à ta façon. Ensemble, ils bouclent ton premier tour de spirale."
  },

  aVenir: [
    { mois: 'Novembre', titre: 'Une nouvelle année dans Le Cercle', texte: "Un nouveau tour de spirale s’ouvre. Tu repars avec tes roues, tes lettres, tes gestes et tout ce que tu sais maintenant de toi. Les saisons reviennent, et toi, tu montes encore d’un cran, à ton rythme.", image: 'assets/guide/guide-spirale-or.webp' }
  ]
};
