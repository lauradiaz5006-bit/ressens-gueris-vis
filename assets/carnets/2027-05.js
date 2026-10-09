/* Genesolia · Le Cercle · Carnet de mai 2027, « J'avance » : « Prendre soin de moi »
   Le carnet du mois est le côté « J'avance » du Cercle : retrouver ton rythme, te ressourcer, devenir pour toi-même une présence douce.
   Le côté libération (« Ta mère, tes mères », la lignée des femmes) est dans Mon suivi (assets/suivi/2027-05.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-05',
  nomMois: 'mai 2027',
  moisSuivant: 'juin',
  titre: 'Prendre soin de moi',
  sousTitre: "Retrouver ton propre rythme, t'offrir ce qui te ressource, et apprendre à te parler avec la douceur que tu mérites.",
  pdf: '',
  image: 'assets/cartes/me-le-donner.jpg',
  citation: "La douceur que tu attends des autres, tu peux commencer à te l'offrir aujourd'hui.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Me materner', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

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
      theme: ['assets/cartes/me-le-donner-mini.jpg', 'Ce que je n’ai pas reçu, je peux apprendre à me le donner.'],
      semaines: ['assets/cartes/a-mon-rythme-mini.jpg', 'Je ne suis pas en retard. Je suis à mon rythme.']
    }
  },

  mots: {
    tonmois: "Lis ton mois comme on reçoit un mot glissé sous la porte. Prends ce qui te fait du bien, laisse le reste sans regret.",
    ouverture: "Installe-toi bien avant de commencer : une boisson chaude, un plaid, un coin de lumière. Ce carnet commence par ta façon de t’accueillir.",
    theme: "Rien à faire ici, seulement à lire. Si une phrase te touche, arrête-toi un instant et respire avec elle.",
    comprendre: "Tu n’as pas à devenir une autre personne. Seulement à ajouter un peu de douceur dans ta façon de te parler.",
    exercices: "Un exercice par semaine, pas plus. Si tu te sens pressé·e, c’est le signe qu’il faut ralentir, même ici.",
    rituel: "Ce mois-ci, ta connexion passe par les fleurs de mai et une petite flamme. Simple, joyeux, rien que pour toi.",
    semaines: "Chaque défi est une invitation, pas une obligation. Une semaine manquée n’efface rien : tu reprends là où tu en es.",
    cloture: "Regarde ton mois avec les yeux de quelqu’un qui t’aime. C’est exactement l’exercice de ce carnet."
  },

  theme: {
    titre: 'Le mois de la douceur envers soi',
    texte: [
      "Mai déborde de vie. Les haies se couvrent de fleurs, les soirées s'allongent, les invitations se multiplient, et tout semble pousser plus vite qu'on ne peut le suivre. C'est un mois joyeux, et c'est souvent aussi un mois où l'on s'oublie un peu : on dit oui à tout, on remplit chaque soirée, on court d'un rendez-vous à l'autre, et l'on arrive au 31 un peu essoufflé·e.",
      "Ce carnet t'invite à faire de la place pour toi au cœur de cette abondance. Pas en ajoutant une tâche de plus à ta liste, mais en apprenant à te regarder autrement : avec la patience, la tendresse et l'attention que tu offres si facilement aux autres. Ce mois-ci, la personne que tu choisis de chouchouter, c'est toi."
    ],
    sousTitre: 'Pourquoi apprendre à se materner ?',
    texte2: [
      "Se materner, c'est devenir pour soi-même la présence bienveillante dont on a besoin : celle qui remarque la fatigue avant l'épuisement, qui encourage au lieu de critiquer, qui propose une pause quand tout s'accélère. Que tu aies reçu beaucoup de tendresse enfant, ou très peu, cette présence intérieure s'apprend à tout âge.",
      "On observe souvent que la façon dont on se parle décide souvent de la façon dont on avance. Une voix intérieure dure épuise, même quand tout va bien. Une voix douce et ferme à la fois donne de l'élan, parce qu'on n'a plus peur de se tromper. Ton **rythme** compte aussi : chacun·e a ses heures de pleine énergie et ses heures creuses, et les respecter n'est pas de la paresse, c'est de l'intelligence.",
      "Ce mois-ci, tu vas **observer** ce qui te vide et ce qui te ressource, **adoucir** ta voix intérieure, et **t'offrir** chaque semaine un vrai moment pour toi. En parallèle, ton suivi « Je me libère » t'invite à regarder la lignée des femmes de ta famille : ce que tu as reçu de tes mères éclaire souvent la façon dont tu t'accueilles toi-même."
    ],
    exemplesTitre: 'À quoi ressemble l’oubli de soi, au quotidien',
    exemples: [
      "**Le matin** : tu te lèves déjà en retard sur ta liste, tu avales un café debout, et tu as l'impression de courir avant même d'avoir commencé.",
      "**Dans tes relations** : tu proposes ton aide à tout le monde, tu écoutes chacun·e, et personne ne sait vraiment comment toi, tu vas.",
      "**Dans ta tête** : tu te parles comme tu ne parlerais jamais à une amie. « Tu aurais dû », « Tu n'y arriveras pas », « Encore raté ».",
      "**Dans ton agenda** : chaque créneau libre est aussitôt rempli, et le moment pour toi passe toujours en dernier, quand il reste du temps.",
      "**Le soir** : tu restes tard sur ton téléphone, non par envie, mais parce que c'est le seul moment où personne ne te demande rien."
    ],
    exempleSpiraleTitre: 'Un exemple de douceur au quotidien',
    exempleSpirale: "Mardi soir, tu rentres épuisé·e et la petite voix commence : « Tu n'as même pas rangé, tu n'as pas avancé sur ton dossier. » Ce mois-ci, tu l'arrêtes doucement, et tu te demandes : « Qu'est-ce que je dirais à ma meilleure amie, là, maintenant ? » La réponse vient : « Tu as eu une longue journée. Assieds-toi, mange tranquillement, le reste attendra demain. » Rien n'a changé dehors. Pourtant, ta soirée n'a plus la même couleur.",
    question: { k: 'theme-douceur', q: "Si tu te traitais ce mois-ci comme tu traites la personne que tu aimes le plus, qu’est-ce qui changerait dans tes journées ?", ph: "Exemple : je m’accorderais des pauses sans me justifier, je mangerais assis·e, et je me féliciterais pour les petites choses." }
  },

  comprendre: {
    titre: 'Devenir ta propre présence bienveillante',
    texte: [
      "Chacun·e porte en soi plusieurs voix. Il y a souvent une voix exigeante, qui pousse, compare et corrige. Elle a été utile : elle t'a aidé·e à réussir, à tenir, à ne pas décevoir. Mais quand elle parle seule, elle finit par épuiser. Ce mois-ci, tu vas apprendre à faire grandir une autre voix, plus douce : celle d'une mère intérieure bienveillante.",
      "Cette voix ne dit pas « laisse tout tomber ». Elle dit « tu as le droit d'être fatigué·e », « tu as fait de ton mieux », « de quoi as-tu besoin, là, maintenant ? ». Elle tient compte de ton rythme. Elle sait que tu n'as pas la même énergie un lundi matin qu'un vendredi soir, ni en mai qu'en novembre.",
      "Se materner passe aussi par des gestes très concrets : manger assis·e, aller se coucher quand on tombe de fatigue, s'offrir une promenade sans but, dire non à une soirée de trop. Ce sont des gestes simples, et pourtant beaucoup d'entre nous attendent qu'on les leur offre, au lieu de se les offrir.",
      "Si tu n'as pas reçu cette douceur enfant, ou pas assez, ce n'est pas trop tard. La présence bienveillante se construit comme un muscle : un geste, une phrase, un choix à la fois. Et si tu l'as reçue, c'est le moment de te la redonner, à toi l'adulte."
    ],
    reperes: [
      { titre: 'Tu t’oublies quand…', points: [
        "tu dis oui avant même de savoir si tu en as envie ;",
        "tu te parles avec des mots que tu n’accepterais de personne ;",
        "tu repousses toujours ton moment à toi à « quand tout sera fini » ;",
        "tu ignores les signaux de fatigue jusqu’à ce qu’ils crient."
      ] },
      { titre: 'Tu te maternes quand…', points: [
        "tu remarques ta fatigue et tu lui réponds, même par une petite pause ;",
        "tu te félicites pour ce qui a été fait, avant de regarder ce qui reste ;",
        "tu choisis ton rythme au lieu de suivre celui des autres ;",
        "tu t’offres un plaisir simple sans avoir besoin de le mériter."
      ] }
    ],
    regarderTitre: 'Pour mieux te connaître, demande-toi',
    regarderIntro: "Réponds à ces questions tranquillement, sans chercher la bonne réponse. Ce qui vient en premier est souvent le plus juste.",
    regarder: [
      { k: 'moi-voix', q: "Quelle phrase dure te répètes-tu le plus souvent dans la journée ?", ph: "Exemple : « Tu n’en fais jamais assez. » Je l’entends surtout le soir, quand je regarde ce qui reste à faire." },
      { k: 'moi-rythme', q: "À quel moment de la journée te sens-tu pleinement en énergie, et à quel moment as-tu besoin de ralentir ?", ph: "Exemple : je suis en pleine forme entre 9 h et midi, et après 16 h j’ai besoin de calme et de lumière douce." },
      { k: 'moi-ressource', q: "Quelles sont les trois choses qui te ressourcent vraiment, même en peu de temps ?", ph: "Exemple : marcher sous les arbres, un bain chaud avec de la musique, une conversation sans écran avec mon amie." },
      { k: 'moi-attente', q: "Qu’attends-tu que les autres t’offrent, que tu pourrais commencer à t’offrir toi-même ?", ph: "Exemple : de la reconnaissance. Je pourrais noter chaque soir ce que j’ai réussi, au lieu d’attendre qu’on me le dise." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Ton [guide du mois](mon-guide.html) t'aide à repérer les jours où ton énergie monte et ceux où elle a besoin de repos : un bon allié pour respecter ton rythme. Et si la voix dure que tu entends ressemble à celle d'une femme de ta famille, ton [suivi du mois](mon-suivi.html) t'aide justement à regarder la lignée de tes mères.",
    outils: [
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel et tes dates clés, pour suivre ton énergie et choisir tes moments pour toi.'],
      ['cartes.html', 'Les cartes de Genesolia', 'Une phrase douce à tirer le matin, à garder sur ton téléphone ou sur ton frigo.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : la lignée des femmes, ce que tu as reçu de tes mères, et ce que tu choisis de transmettre.']
    ]
  },

  exercicesTitre: 'Observer, adoucir, t’offrir',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier t’aide à voir ce qui te ressource dans tes journées, le deuxième à faire grandir ta voix intérieure bienveillante, le troisième à installer un vrai rendez-vous de douceur avec toi. Commence par celui qui t’appelle.",
  exercices: [
    { k: 'ex1', titre: 'Ma carte de ressourcement', type: 'tableau', rangs: 3,
      etiquettes: ['Mes matins', 'Mes soirées', 'Mes week-ends'],
      consigne: "Pour chacun de ces trois moments, décris comment ils se passent aujourd'hui, ce dont tu aurais besoin pour te sentir ressourcé·e, et un petit geste de douceur que tu peux t'offrir dès cette semaine. Reste concret·e : on cherche des choses faisables, pas une vie idéale.",
      pourquoi: "On croit souvent manquer de temps, alors qu’on manque surtout de moments choisis. Regarder tes matins, tes soirées et tes week-ends un par un te montre où un petit changement peut te redonner beaucoup d’énergie.",
      colonnes: [
        { q: "Comment se passe ce moment aujourd’hui, en vrai ?", ph: ["Exemple : réveil à 6 h 30, téléphone tout de suite, café debout, je cours", "Exemple : dîner rapide, vaisselle, écran jusqu’à minuit", "Exemple : courses, ménage, lessive, et le dimanche soir je suis vidé·e"] },
        { q: "De quoi aurais-tu besoin pour te sentir ressourcé·e ?", ph: ["Exemple : dix minutes de calme avant de commencer la journée", "Exemple : un moment de lecture et me coucher plus tôt", "Exemple : une demi-journée sans aucune tâche"] },
        { q: "Quel petit geste de douceur peux-tu t’offrir dès cette semaine ?", ph: ["Exemple : boire mon café assis·e près de la fenêtre, sans téléphone", "Exemple : poser l’écran à 22 h et lire trois pages", "Exemple : garder le dimanche matin libre, rien que pour moi"] }
      ],
      apres: { k: 'ex1-remarque', q: "Relis tes trois lignes. Lequel de ces gestes te fait le plus envie, et quand vas-tu l’essayer pour la première fois ?", ph: "Exemple : le café assis près de la fenêtre. Je commence demain matin, même si je dois me lever dix minutes plus tôt." } },

    { k: 'ex2', titre: 'Ma voix intérieure bienveillante', type: 'blocs', nb: 3,
      etiquettes: ['Quand je suis fatigué·e', 'Quand je me trompe', 'Quand je réussis quelque chose'],
      consigne: "Pour ces trois moments de la vie ordinaire, écris ce que ta voix intérieure te dit aujourd'hui. Puis imagine ce que te dirait une présence idéale, douce et solide, qui t'aime sans condition. Enfin, choisis un geste concret qui irait avec ces mots.",
      pourquoi: "Ce que l’on se répète finit par devenir une conviction. Écrire côte à côte la voix dure et la voix bienveillante, c’est te donner le choix : tu ne peux pas toujours faire taire la première, mais tu peux apprendre à faire parler la seconde.",
      astuce: "Si tu as du mal à trouver les mots doux, pense à ce que tu dirais à un·e enfant que tu aimes, ou à ta meilleure amie dans la même situation.",
      champs: [
        { q: "Que te dit ta voix intérieure, aujourd’hui, dans ce moment ?", ph: ["Exemple : « Tu es faible, les autres tiennent bien, eux. »", "Exemple : « Tu es nul·le, tu aurais dû vérifier. »", "Exemple : « Bof, ce n’était pas si difficile. »"] },
        { q: "Que te dirait une présence douce et solide, qui t’aime sans condition ?", ph: ["Exemple : « Tu as beaucoup donné. Tu as le droit de t’arrêter. »", "Exemple : « Tout le monde se trompe. Qu’est-ce que tu as appris ? »", "Exemple : « Bravo, tu peux être fier·e de toi. Savoure. »"] },
        { q: "Quel geste concret t’offrirais-tu avec ces mots ?", ph: ["Exemple : me coucher une heure plus tôt ce soir", "Exemple : faire une pause de cinq minutes dehors avant de corriger", "Exemple : m’offrir un bon chocolat chaud en terrasse"] }
      ] },

    { k: 'ex3', titre: 'Mon rendez-vous douceur', type: 'texte',
      consigne: "Choisis un moment de douceur que tu t'offriras chaque semaine, ou même chaque jour s'il est tout petit. Note-le comme un vrai rendez-vous, avec une heure et un lieu. Puis, chaque fois que tu l'as vécu, écris ici ce que tu as fait et ce que tu as ressenti.",
      pourquoi: "Quand le moment pour soi n’a pas de place précise, il passe toujours après le reste. Lui donner une heure, c’est lui donner de la valeur. Et le noter chaque fois t’aide à voir combien il te change.",
      gestes: ["Un bain ou une douche longue, avec ta musique préférée", "Une promenade de vingt minutes sans but, rien que pour regarder", "Un petit-déjeuner servi joliment, juste pour toi", "Une sieste de quinze minutes, le dimanche après-midi", "Un livre et un thé, téléphone en mode avion", "Danser seul·e dans ton salon sur une chanson qui te met en joie"],
      q: "Ton rendez-vous douceur : « Chaque… à…, je m’offre… »",
      ph: "Exemple : chaque mercredi à 19 h, je m’offre une heure de lecture dans mon fauteuil, avec une tisane et une bougie, téléphone dans une autre pièce.",
      journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as vécu : quand, et qu’as-tu ressenti ?", ph: "Exemple : mercredi soir, j’ai lu une heure. J’ai eu l’impression de rentrer chez moi, à l’intérieur." } }
  ],

  rituel: {
    titre: 'Le bouquet de mai',
    intro: "En mai, la nature offre ses fleurs sans compter. Ce petit rituel symbolique t'invite à t'offrir à toi aussi un bouquet, et à honorer la personne que tu es, avec la même générosité. Il se fait en quinze minutes, un soir tranquille ou un matin de week-end.",
    materiel: "Quelques fleurs ou herbes cueillies sur un chemin, dans un jardin, ou achetées au marché, un verre d’eau ou un petit vase, une bougie, et un papier.",
    quand: "Fais-le en début de mois, après avoir rempli ta roue et ton objectif. Tu peux renouveler le bouquet chaque semaine : à chaque fois, c’est un petit merci à toi-même. Certaines personnes en font un rendez-vous de printemps, chaque année.",
    etapes: [
      "Choisis tes fleurs en prenant ton temps. Prends celles qui te font envie, pas celles qui seraient « bien ». C’est ton bouquet.",
      "Installe-les dans leur vase, à un endroit où tu les verras chaque jour : ta table de nuit, ton bureau, la table de la cuisine.",
      "Allume la bougie à côté. Respire trois fois profondément en regardant la flamme et les couleurs des fleurs.",
      "Pour chaque fleur, dis intérieurement une chose que tu apprécies chez toi : « Merci pour ma patience », « Merci pour mon rire », « Merci d’avoir tenu cet hiver ».",
      "Écris sur le papier une phrase douce que tu as envie de te redire tout le mois, et glisse-la au pied du vase.",
      "Éteins la bougie en disant : « Ce mois-ci, je me choisis aussi. » Puis note ici ce qui est venu."
    ],
    note: { k: 'rituel-note', q: "Quelles qualités as-tu remerciées chez toi, et quelle phrase douce as-tu écrite ?", ph: "Exemple : j’ai remercié ma persévérance, mon humour et ma façon d’écouter. J’ai écrit : « Tu as le droit de ralentir. »" }
  },

  meditation: {
    titre: 'Le jardin de mai',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Pose tes mains sur ton ventre ou sur tes cuisses. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Laisse ton souffle trouver son propre rythme. Tu n’as rien à réussir, rien à prouver. Pour les dix minutes qui viennent, la seule personne dont tu t’occupes, c’est toi.",
      "Imagine un jardin au mois de mai. L’herbe est tendre, les fleurs s’ouvrent partout, l’air est tiède et sent le lilas. Tu entends des oiseaux, le bourdonnement des abeilles, le vent léger dans les feuilles.",
      "Au milieu du jardin, il y a un banc, à l’ombre d’un arbre en fleurs. Avance tranquillement vers lui, et assieds-toi. Sens le bois tiède sous toi, la lumière qui joue sur ton visage.",
      "[pause]",
      "Remarque ce que tu portes en arrivant : une fatigue, une liste, une inquiétude. Tu n’as pas besoin de t’en débarrasser. Pose-les simplement à côté de toi, sur le banc, comme un sac que l’on dépose enfin.",
      "Maintenant, imagine qu’une présence très douce vient s’asseoir près de toi. Elle a le visage que tu veux, ou pas de visage du tout : c’est une chaleur, une lumière, une tendresse. Elle te connaît parfaitement, et elle t’aime telle que tu es.",
      "[longue pause]",
      "Écoute ce qu’elle te dit. Peut-être : « Tu as beaucoup donné. Tu as le droit de te reposer. » Peut-être : « Je suis fier·e de toi. » Laisse ses mots entrer, même si une partie de toi a du mal à les croire.",
      "Si une émotion monte, accueille-la. Si c’est trop, ouvre simplement les yeux et reviens à ton souffle : tu pourras retrouver ce jardin un autre jour.",
      "Avant de partir, cette présence te tend une fleur. Prends-la. C’est ta douceur à toi, celle que tu emportes dans tes journées. Remarque sa couleur, son parfum.",
      "[pause]",
      "Dis intérieurement : « Je m’accueille. Je respecte mon rythme. Je mérite la douceur que j’offre aux autres. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, le siège sous toi. Bouge doucement les doigts, étire-toi si tu en as envie. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes : un dimanche matin dans ton lit, ou un soir près d’une fenêtre ouverte. Si tu t’endors, c’est que ton corps avait besoin de repos : c’est exactement le thème du mois, recommence un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la méditation ? Les mots de la présence, la couleur de ta fleur, une sensation…", ph: "Exemple : elle m’a dit « tu n’as pas à tout porter ». Ma fleur était un coquelicot. J’ai pleuré un peu, et je me suis senti·e plus léger·e." }
  },

  semaines: [
    { titre: 'Un matin rien qu’à moi', texte: "Chaque matin de la semaine, offre-toi dix minutes avant de regarder ton téléphone : un café assis·e, quelques étirements, la fenêtre ouverte. Puis note comment commence ta journée.",
      exemple: "Par exemple : tu laisses ton téléphone dans l’entrée la veille au soir, et le matin tu bois ton thé en regardant le ciel. Dix minutes suffisent pour sentir que ta journée t’appartient un peu plus.",
      ph: "Exemple : les jours où j’ai eu mes dix minutes, j’étais moins irritable au travail. Le jeudi, j’ai oublié, et ça s’est senti." },
    { titre: 'Trois douceurs par jour', texte: "Chaque soir, note trois choses douces que tu t'es offertes dans la journée, même minuscules : un repas pris lentement, une pause au soleil, un mot gentil envers toi. Si tu n'en trouves pas, offre-t'en une avant de dormir.",
      exemple: "Par exemple : « J’ai mangé assis·e et sans écran. J’ai refusé un appel tardif. Je me suis dit bravo après la réunion. » C’est simple, et pourtant ça entraîne ton regard à remarquer chaque geste doux envers toi.",
      ph: "Exemple : le premier soir, je n’en ai trouvé qu’une. À la fin de la semaine, j’en avais facilement trois, et j’y pensais dans la journée." },
    { titre: 'Un non pour un oui à moi', texte: "Cette semaine, dis non à une sollicitation qui te coûte, et offre-toi le temps libéré. Une soirée, un service, une réunion facultative. Pas besoin de te justifier longuement : « Pas cette fois, merci » suffit.",
      exemple: "Par exemple : tu déclines un apéro le jeudi alors que tu es épuisé·e, et tu prends ce temps pour un bain et un livre. Remarque ce que ce non t’a coûté sur le moment, et ce qu’il t’a rapporté ensuite.",
      ph: "Exemple : j’ai dit non à la sortie de vendredi. J’ai culpabilisé une heure, puis j’ai passé la meilleure soirée du mois, chez moi, tranquille." },
    { titre: 'Refaire ma roue', texte: "En fin de semaine, refais ta roue de la vie dans ton bilan et compare-la avec celle du début du mois. Regarde surtout ton énergie, ta joie et ta connexion à toi. Tu peux aussi refaire le [test de l’arbre de vie](arbre-de-vie.html) et voir ce qui a bougé dans [ton espace](login.html#mon-chemin).",
      exemple: "Par exemple : ton énergie est passée de 4 à 6, ta connexion à toi de 3 à 5. Rien de spectaculaire dehors, et pourtant tout a changé dedans. Remercie-toi pour chaque moment que tu t’es offert.",
      ph: "Exemple : ma joie a gagné deux points depuis que je m’offre mon mercredi soir. Je me sens plus présent·e avec les autres aussi." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-douceur', q: "Quelle douceur t’es-tu offerte ce mois-ci, que tu n’aurais pas osé t’offrir avant ?", ph: "Exemple : une matinée entière au lit le dimanche, sans culpabilité, avec un livre et un café." },
    { k: 'fin-voix', q: "Qu’est-ce qui a changé dans ta façon de te parler ?", ph: "Exemple : quand je me trompe, je me dis plus souvent « ce n’est pas grave, qu’est-ce que j’apprends ? » au lieu de « tu es nul·le »." },
    { k: 'fin-rythme', q: "Qu’as-tu découvert sur ton propre rythme ?", ph: "Exemple : j’ai besoin d’une vraie pause en milieu d’après-midi, et je suis bien plus efficace après." },
    { k: 'fin-rituel-garde', q: "Quel geste de ce mois veux-tu garder comme une habitude ?", ph: "Exemple : mes dix minutes du matin sans téléphone, et le bouquet renouvelé chaque semaine." },
    { k: 'fin-intention', q: "Quelle est ton intention pour juin ?", ph: "Exemple : garder ma douceur, et l’utiliser pour oser enfin lancer mon projet.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Ta mère, tes mères',
    texte: "Pendant que ton carnet t’apprend à te materner, ton suivi t’invite à regarder la lignée des femmes qui t’ont précédé·e : ce que tu as reçu de ta mère et de tes grands-mères, ce que tu gardes, et ce que tu choisis de laisser. Ce que tu comprends là-bas adoucit ta voix intérieure ici."
  },

  aVenir: [
    { mois: 'Juin', titre: 'Oser agir', texte: "Décider, structurer ton projet, passer à l’action, et tenir les engagements que tu prends envers toi.", image: 'assets/cartes/prochain-pas-mini.jpg' },
    { mois: 'Juillet', titre: 'Ma valeur', texte: "Apprendre à recevoir, oser demander, et reconnaître ta juste valeur, dans l’abondance de l’été.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Août', titre: 'Mon chez-moi, mon élan', texte: "Faire de ton lieu de vie un appui, et retrouver l’élan qui te porte pour la rentrée.", image: 'assets/cartes/racines-appuis-mini.jpg' }
  ]
};
