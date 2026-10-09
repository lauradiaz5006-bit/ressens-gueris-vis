/* Genesolia · Le Cercle · Carnet de septembre 2027, « J'avance » : « Ma vocation »
   Le carnet du mois est le côté « J'avance » du Cercle : faire le point, choisir ce que l'on veut nourrir, avancer pas à pas.
   Le côté libération (« Les métiers de la lignée ») est dans Mon suivi (assets/suivi/2027-09.js).
   Tout ce qui est propre au mois est ici. Le moteur (assets/mon-carnet.js) ne contient que ce qui sert tous les mois.
   Le texte accepte **gras** et [lien](page.html).
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple affiché dans le champ }.
   audio : adresse d'un fichier mp3 pour la méditation. Vide : aucun lecteur n'apparaît. */
window.GENESOLIA_CARNET = {
  mois: '2027-09',
  nomMois: 'septembre 2027',
  moisSuivant: 'octobre',
  titre: 'Ma vocation',
  sousTitre: "Retrouver ce qui te fait vibrer, remettre du sens dans ton travail, et reconnaître les talents que tu portes déjà.",
  pdf: '',
  image: 'assets/cercle/apercu-12-saisons.jpg',
  citation: "Ta vocation n’est pas loin de toi. Elle t’attend souvent là où le temps s’arrête.",
  audio: '',
  audioCourt: '',

  noms: { comprendre: 'Ce qui me fait vibrer', rituel: 'Ma connexion', rituelSur: 'Ma connexion du mois' },

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/montagne.jpg',
    pages: {
      tonmois: 'assets/guide/guide-etoiles.webp',
      ouverture: 'assets/guide/guide-reves.webp',
      theme: 'assets/guide/guide-livre-pupitre.webp',
      comprendre: 'assets/guide/guide-nombres.webp',
      exercices: 'assets/guide/guide-coffret.webp',
      rituel: 'assets/guide/guide-pause.webp',
      semaines: 'assets/guide/guide-spirale-douce.webp',
      cloture: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ecrire-la-mienne-mini.jpg', 'Je ne rejoue pas leur histoire. J’écris la mienne.'],
      semaines: ['assets/cartes/prochain-pas-mini.jpg', 'Je n’ai pas besoin de tout savoir. Seulement du prochain pas.']
    }
  },

  mots: {
    tonmois: "Lis ton mois comme on ouvre un agenda neuf : avec curiosité, sans rien remplir encore.",
    ouverture: "Dix minutes, une boisson chaude. Regarde surtout ton domaine travail et ta joie : ils se parlent souvent.",
    theme: "Rien à faire ici, seulement à lire. Laisse revenir les moments où tu étais tellement absorbé·e que tu oubliais l’heure.",
    comprendre: "Une vocation n’est pas toujours un métier. C’est parfois une façon d’être au travail, un fil qui relie tout ce que tu aimes faire.",
    exercices: "Le premier exercice te fait voyager dans ton enfance. Prends une vieille photo de toi, si tu en as une.",
    rituel: "Ce mois-ci, ta connexion passe par un cahier neuf et la lumière de l’équinoxe. Une page blanche, rien qu’à toi.",
    semaines: "Une heure pour ta vocation cette semaine vaut mieux qu’un grand projet repoussé à l’année prochaine.",
    cloture: "Regarde tes notes du mois : tu as sûrement retrouvé un fil. Même mince, c’est le tien."
  },

  theme: {
    titre: 'Le mois de la vocation',
    texte: [
      "Septembre, c’est la rentrée. Les cahiers neufs, les agendas vierges, la reprise du travail après l’été. C’est un moment où l’on se pose naturellement la question : est-ce que ce que je fais me ressemble ? Est-ce que je me lève le matin pour quelque chose qui a du sens pour moi ?",
      "Ce carnet t’invite à retrouver ce qui te fait vibrer. Pas forcément pour changer de métier demain, mais pour remettre un peu plus de toi dans ta vie professionnelle, et dans tes journées en général. Ta vocation n’est pas un grand destin caché quelque part : c’est souvent un fil que tu tiens déjà, depuis l’enfance, sans l’avoir remarqué."
    ],
    sousTitre: 'Qu’est-ce qu’une vocation ?',
    texte2: [
      "On parle souvent de vocation quand trois choses se rencontrent : **ce que tu aimes faire**, ce moment où le temps s’arrête ; **ce que tu sais bien faire**, tes talents, ceux que les autres remarquent avant toi ; et **ce qui a du sens pour toi**, ce qui te semble utile, beau ou juste dans le monde.",
      "Quand ces trois cercles se rejoignent, même un peu, le travail devient plus léger. Tu peux être comptable et vibrer en aidant une petite entreprise à s’en sortir. Tu peux être agent·e d’accueil en maison de retraite et trouver ta vocation dans les rires partagés avec les personnes âgées. Tu peux aussi découvrir que ta vocation se vit en dehors du travail : dans une association, un atelier, une passion du dimanche.",
      "Ce mois-ci, tu vas **retrouver** ce qui te fait vibrer, **reconnaître** tes talents, et **tester** un petit pas vers ce qui t’attire. En parallèle, ton suivi « Je me libère » t’aide à regarder les métiers de ta lignée et les rêves professionnels restés en suspens : les deux avancent ensemble."
    ],
    exemplesTitre: 'Ce que ta vocation peut te souffler',
    exemples: [
      "**Un moment où le temps s’arrête** : quand tu prépares un repas pour dix personnes, quand tu répares un vélo, quand tu écoutes une amie. Ce moment dit quelque chose de toi.",
      "**Un talent qu’on te reconnaît** : « Tu expliques si bien », « Tu as l’œil pour les couleurs ». Tu ne le vois pas, parce que c’est facile pour toi.",
      "**Une colère qui montre une valeur** : l’injustice te révolte, le gaspillage te met hors de toi. Souvent, ce qui te met en colère indique ce que tu as envie de protéger.",
      "**Un rêve d’enfant qui revient** : tu voulais être vétérinaire, illustratrice, maître nageur. Le métier n’est peut-être plus le bon, mais ce qu’il contenait est toujours là.",
      "**Une fatigue qui ne passe pas** : tu es épuisé·e le dimanche soir avant même d’avoir commencé la semaine. Elle ne dit pas que tu es paresseux·se, elle dit que quelque chose manque de sens."
    ],
    exempleSpiraleTitre: 'Un exemple de petit pas',
    exempleSpirale: "Ta roue montre ton travail à 4 et ta joie à 3. Tu ne vas pas démissionner ce mois-ci. Tu remarques que tu t’illumines chaque fois que tu aides un nouveau collègue à prendre ses marques. Tu proposes à ta responsable de t’occuper de l’accueil des nouvelles recrues, une heure par semaine. À la fin du mois, ton travail est à 6 : tu as remis un morceau de ta vocation dans ta journée.",
    question: { k: 'theme-vibre', q: "Quand t’es-tu senti·e, pour la dernière fois, tellement absorbé·e par ce que tu faisais que tu en as oublié l’heure ?", ph: "Exemple : samedi dernier, en repeignant la commode de ma fille. Je n’ai pas vu passer l’après-midi." }
  },

  comprendre: {
    titre: 'Retrouver le fil de ta vocation',
    texte: [
      "Ta vocation n’est pas quelque chose que tu dois inventer. C’est un fil qui court à travers ta vie, depuis longtemps : dans tes jeux d’enfant, dans les matières que tu aimais, dans les moments où l’on venait te chercher pour ton aide. Le retrouver, c’est regarder en arrière avec curiosité, et remarquer ce qui revient.",
      "Commence par **ce qui te fait vibrer** : les activités où tu te sens vivant·e, où tu perds la notion du temps, où tu as de l’énergie même fatigué·e. Ce n’est pas toujours « sérieux » : organiser une fête, ranger une bibliothèque, raconter une histoire. Ce qui compte, c’est ce que ces activités ont en commun : créer, relier, transmettre, réparer, embellir, comprendre.",
      "Regarde ensuite **tes talents**. On a souvent du mal à voir les siens, parce qu’ils nous semblent naturels. Les autres les voient mieux que toi : c’est pour ça que ce mois-ci, tu vas leur demander. Un talent, c’est ce que tu fais bien sans effort, et que d’autres trouvent difficile.",
      "Enfin, regarde **le sens** : ce qui te paraît important, juste, utile. Quand ton travail touche ce sens, même un peu, la fatigue n’a pas le même goût. Et si ton travail actuel ne le touche pas du tout, tu peux commencer par l’ajouter ailleurs dans ta vie, en attendant de voir plus loin."
    ],
    reperes: [
      { titre: 'Ta vocation se montre quand…', points: [
        "tu perds la notion du temps en faisant quelque chose ;",
        "on vient te chercher spontanément pour un certain type d’aide ;",
        "tu as encore de l’énergie à la fin, même fatigué·e ;",
        "tu en parles avec des yeux qui brillent, et les autres le remarquent."
      ] },
      { titre: 'Ta vocation est freinée quand…', points: [
        "tu te dis « ce n’est pas un vrai métier » ou « ce n’est pas pour moi » ;",
        "tu repousses toujours à plus tard ce qui t’attire ;",
        "tu fais un travail qui ne te ressemble pas pour faire plaisir ou par sécurité ;",
        "parfois, une phrase de famille sur le travail qui décide encore à ta place : c’est le rôle de ton suivi de la regarder."
      ] }
    ],
    regarderTitre: 'Pour ta vocation, demande-toi',
    regarderIntro: "Prends ces questions une par une, au calme, avec ton cahier de rentrée. Réponds avec la première idée qui vient : on corrigera plus tard, si besoin.",
    regarder: [
      { k: 'voc-enfant', q: "Qu’aimais-tu faire pendant des heures quand tu étais enfant ?", ph: "Exemple : construire des cabanes, inventer des histoires pour mes petits cousins, trier ma collection de pierres." },
      { k: 'voc-aide', q: "Pour quoi vient-on te chercher, au travail, en famille ou entre amis ?", ph: "Exemple : pour organiser les voyages, pour écouter quand ça ne va pas, pour réparer ce qui est cassé." },
      { k: 'voc-sens', q: "Qu’est-ce qui te semble vraiment important ou juste dans le monde ?", ph: "Exemple : que chaque enfant puisse apprendre à son rythme, et que personne ne soit laissé de côté." },
      { k: 'voc-libre', q: "Que ferais-tu de tes journées si l’argent et le regard des autres ne comptaient pas ?", ph: "Exemple : je travaillerais le bois dans un atelier, et j’apprendrais à des jeunes à le faire." },
      { k: 'voc-point', q: "Qu’est-ce qui ferait gagner un seul point à ton domaine travail d’ici la fin du mois ?", ph: "Exemple : passer une heure par semaine sur la partie de mon travail que j’aime vraiment, la formation des nouveaux." }
    ],
    enLigneTitre: 'Sur Genesolia',
    enLigne: "Si une voie t’attire et que tu te bloques chaque fois que tu t’en approches, ton [suivi « Je me libère »](mon-suivi.html) t’aide ce mois-ci à regarder les métiers et les rêves de ta lignée. Tu peux aussi lire [les métiers transmis dans les familles](metiers-transmis-genealogie.html), et regarder ton [thème numérologique](theme-numerologique.html), qui parle de tes talents.",
    outils: [
      ['theme-numerologique.html', 'Mon thème numérologique', 'Ton chemin de vie et tes nombres, pour mettre des mots sur tes talents et ce qui te fait vibrer.'],
      ['mon-guide.html', 'Mon guide du mois', 'Ton nombre du mois, ton ciel de septembre et tes dates clés, pour savoir quand oser ton pas.'],
      ['mon-suivi.html', 'Mon suivi « Je me libère »', 'Ce mois-ci : les métiers de ta lignée, les vocations empêchées et les phrases sur le travail.']
    ]
  },

  exercicesTitre: 'Retrouver, reconnaître, tester',
  exercicesIntro: "Trois exercices, un par semaine environ. Le premier te fait retrouver ce qui te fait vibrer depuis l’enfance, le deuxième t’aide à voir tes talents à travers les yeux des autres, le troisième te fait tester un petit pas concret. Commence par celui qui t’attire.",
  exercices: [
    { k: 'ex1', titre: 'Le fil de ce qui me fait vibrer', type: 'tableau', rangs: 3,
      etiquettes: ['Quand j’étais enfant', 'Quand j’étais adolescent·e', 'Aujourd’hui'],
      consigne: "Pour chacune de ces trois périodes de ta vie, note ce que tu aimais faire pendant des heures, ce que ça t’apportait, puis ce qu’il en reste aujourd’hui. Ne cherche pas de lien tout de suite : écris simplement ce qui vient.",
      pourquoi: "Ce qui nous fait vibrer change de forme avec les années, mais rarement de fond. En écrivant ces trois périodes l’une sous l’autre, tu vois apparaître le fil : créer, aider, comprendre, rassembler, embellir. Ce fil, c’est souvent le cœur de ta vocation.",
      colonnes: [
        { q: "Qu’aimais-tu faire pendant des heures ?", ph: ["Exemple : dessiner des plans de maisons imaginaires", "Exemple : décorer ma chambre, refaire celle de mes copines", "Exemple : réaménager les pièces de mes amis quand ils déménagent"] },
        { q: "Qu’est-ce que ça t’apportait ?", ph: ["Exemple : le plaisir de créer un monde où tout était à sa place", "Exemple : la fierté, et le sentiment d’être utile", "Exemple : de la joie, et l’impression de rendre les gens heureux chez eux"] },
        { q: "Qu’en reste-t-il dans ta vie aujourd’hui ?", ph: ["Exemple : rien, j’ai arrêté de dessiner à 15 ans", "Exemple : un peu, je change souvent les meubles de place", "Exemple : c’est ce que je fais de mes week-ends, sans l’appeler un talent"] }
      ],
      apres: { k: 'ex1-fil', q: "Relis tes trois lignes. Quel fil relie ce qui te fait vibrer depuis toujours ?", ph: "Exemple : j’aime transformer un lieu pour que les gens s’y sentent bien. C’est là que je me sens le plus vivant·e." } },

    { k: 'ex2', titre: 'Mes talents, vus par les autres', type: 'blocs', nb: 3,
      etiquettes: ['Une personne proche', 'Une personne de mon travail', 'Une personne qui me connaît depuis longtemps'],
      consigne: "Demande à trois personnes, par message ou de vive voix : « Pour quoi est-ce que je suis doué·e, selon toi ? Et à quel moment tu l’as vu ? » Note leurs réponses sans les discuter, même si elles te surprennent. Puis écris ce que tu en retiens.",
      pourquoi: "Nos talents nous semblent naturels, alors on ne les voit pas. Les autres, eux, les remarquent. Recevoir leur regard, c’est découvrir ce que tu offres déjà au monde, souvent sans le savoir.",
      astuce: "Si tu n’oses pas demander, explique que c’est un exercice de rentrée. La plupart des gens sont touchés qu’on leur pose la question, et répondent avec beaucoup de chaleur.",
      champs: [
        { q: "Qui as-tu interrogé ?", ph: ["Exemple : ma sœur Camille", "Exemple : Malik, mon collègue de bureau", "Exemple : ma marraine"] },
        { q: "Quel talent t’a-t-il ou elle reconnu ?", ph: ["Exemple : « Tu sais mettre les gens à l’aise »", "Exemple : « Tu expliques les choses compliquées très simplement »", "Exemple : « Tu as toujours su réparer ce qui était cassé »"] },
        { q: "Qu’est-ce que tu en retiens pour toi ?", ph: ["Exemple : j’ai un vrai talent d’accueil, je ne le savais pas", "Exemple : j’aime transmettre, je pourrais former d’autres personnes", "Exemple : j’ai des mains habiles, et je ne m’en sers presque plus"] }
      ] },

    { k: 'ex3', titre: 'Une heure pour ma vocation', type: 'texte',
      consigne: "Les vocations se découvrent en faisant, pas seulement en réfléchissant. Choisis un petit pas concret vers ce qui t’attire, que tu peux faire en une heure ou moins : une recherche, un appel, un essai, une rencontre. Fais-le, puis note chaque fois que tu as avancé, et ce que tu as ressenti.",
      pourquoi: "Tant qu’une envie reste dans ta tête, elle peut te faire rêver ou te faire peur. Dès que tu l’essaies, même un peu, tu reçois une vraie réponse : ton corps te dit si tu as envie d’aller plus loin. Un petit test vaut mieux que dix ans d’hésitation.",
      gestes: ["Chercher une formation courte qui t’attire", "Appeler quelqu’un qui fait le métier qui t’intrigue", "T’inscrire à un atelier d’essai", "Proposer ton aide à une association", "Ressortir ton ancien matériel de dessin, de musique, de couture", "Bloquer une heure par semaine pour ton projet"],
      q: "Ton pas de vocation : « Cette semaine, pour me rapprocher de ce qui me fait vibrer, je vais… »",
      ph: "Exemple : cette semaine, je vais appeler une amie de ma cousine qui est architecte d’intérieur, pour lui demander comment elle a commencé.",
      journal: { k: 'ex3-voc', n: 6, q: "Chaque fois que tu as avancé : quand, ce que tu as fait, ce que tu as ressenti", ph: "Exemple : jeudi, une heure au téléphone avec elle. J’avais le cœur qui battait, et plein d’idées en raccrochant." } }
  ],

  rituel: {
    titre: 'Le cahier neuf de l’équinoxe',
    intro: "Autour du 22 septembre, le jour et la nuit ont la même durée : c’est l’équinoxe d’automne, un moment d’équilibre avant que les jours raccourcissent. Ce petit rituel symbolique t’invite à ouvrir un cahier neuf, à remercier ce que tu as déjà accompli, et à écrire sur la première page ce que tu veux vivre dans ton travail. Il se fait en quinze minutes.",
    materiel: "Un cahier neuf ou un carnet que tu aimes, un stylo, une bougie, et un objet qui représente ce que tu sais faire : un outil, un pinceau, une photo, un livre.",
    quand: "Fais-le le jour de l’équinoxe, le 22 ou le 23 septembre, ou un soir de rentrée où tu as un peu de calme. Tu peux le refaire à chaque grand tournant professionnel : un nouveau poste, un projet, une reconversion.",
    etapes: [
      "Installe-toi au calme. Allume la bougie. Pose devant toi le cahier fermé et l’objet qui représente ton savoir-faire.",
      "Prends l’objet dans tes mains. Pense à tout ce que tu as appris, réussi, transmis depuis que tu travailles. Dis intérieurement : « Merci pour tout ce que je sais déjà faire. »",
      "Respire trois fois. Pense à l’équilibre de ce jour : autant de lumière que de nuit. Demande-toi ce qui, dans ta vie professionnelle, a besoin de plus d’équilibre.",
      "Ouvre le cahier. Sur la première page, écris en grand un mot qui représente ce que tu veux vivre dans ton travail : transmettre, créer, relier, libre, utile…",
      "Sous ce mot, écris une phrase au présent, comme si c’était déjà vrai : « Je mets mes talents au service de ce qui a du sens pour moi. »",
      "Laisse la bougie briller quelques minutes, puis éteins-la. Garde le cahier près de toi ce mois-ci, et note ici ce qui est venu."
    ],
    note: { k: 'rituel-cahier', q: "Quel mot as-tu écrit sur la première page, et qu’as-tu ressenti en l’écrivant ?", ph: "Exemple : « transmettre ». J’ai eu les larmes aux yeux, comme si je le savais depuis longtemps sans oser le dire." }
  },

  meditation: {
    titre: 'La source de ta vocation',
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés au sol. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens ton corps se poser. Laisse partir les listes, les rendez-vous, les mails de la rentrée. Pour quelques minutes, il n’y a rien à faire.",
      "Imagine que tu marches dans une forêt de fin d’été. La lumière filtre entre les feuilles, qui commencent tout juste à dorer. Tu entends, quelque part, le bruit d’une source.",
      "Suis ce bruit. Il te guide entre les arbres, sur un petit chemin de terre. Bientôt, tu arrives devant une source claire qui jaillit d’entre les pierres.",
      "[pause]",
      "Assieds-toi près d’elle. Regarde l’eau couler, sans effort, sans jamais s’arrêter. Cette source, c’est ce qui te fait vibrer. Elle coule en toi depuis toujours, même quand tu ne l’entends plus.",
      "Penche-toi au-dessus de l’eau. Laisse venir une image de toi enfant, en train de faire quelque chose que tu aimais. Regarde ses mains, son visage, sa concentration. Souris-lui.",
      "[longue pause]",
      "Maintenant, laisse venir une image de toi aujourd’hui, en train de faire quelque chose qui te rend vivant·e. Ce n’est peut-être pas ton métier. C’est peut-être un geste, une conversation, un moment volé. Regarde comme l’eau de la source coule aussi là.",
      "Bois une gorgée de cette eau, dans le creux de tes mains. Sens-la descendre en toi, fraîche, pleine d’élan. Tu n’as pas besoin de tout savoir de ta voie. Tu as seulement besoin de suivre ce bruit d’eau.",
      "[pause]",
      "Dis intérieurement : « Ma vocation coule en moi. Je l’écoute, je la suis, un pas après l’autre. »",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Fais-la un dimanche soir de septembre, avant la semaine, ou un matin tôt, avant que la maison s’éveille. Garde ton cahier de l’équinoxe à côté de toi : une idée vient souvent juste après.",
    note: { k: 'medit-source', q: "Quelle image de toi enfant, puis de toi aujourd’hui, est venue près de la source ?", ph: "Exemple : enfant, je construisais des cabanes. Aujourd’hui, je réaménageais le salon de mon amie. C’est le même plaisir." }
  },

  semaines: [
    { titre: 'Repérer mes moments de flow', texte: "Chaque soir, note un moment de la journée où tu as perdu la notion du temps, ou où tu t’es senti·e pleinement vivant·e, au travail ou ailleurs. Et un moment où tu regardais l’heure toutes les cinq minutes.",
      exemple: "Par exemple : « Mardi : flow en préparant la présentation pour les nouveaux. Ennui en remplissant les tableaux de suivi. » À la fin de la semaine, tu verras se dessiner ce qui te nourrit vraiment.",
      ph: "Exemple : mes moments de flow sont toujours ceux où j’explique ou je crée quelque chose. L’ennui arrive avec les tâches répétitives et solitaires." },
    { titre: 'Demander à trois personnes', texte: "Cette semaine, fais l’exercice des talents : demande à trois personnes pour quoi tu es doué·e selon elles. Reçois leurs réponses sans les minimiser, et remercie-les.",
      exemple: "Par exemple : un message à ta sœur, une question à ton collègue au café, un appel à une vieille amie. Si tu as envie de répondre « mais non, pas du tout », dis simplement « merci ».",
      ph: "Exemple : trois personnes m’ont parlé de ma patience pour expliquer. Je n’avais jamais vu ça comme un talent." },
    { titre: 'Tester une petite chose', texte: "Cette semaine, fais un petit test concret vers ce qui t’attire : un atelier, un appel, une heure de bénévolat, une recherche. Note ce que tu ressens avant, pendant et après.",
      exemple: "Par exemple : un atelier d’essai de céramique le samedi matin, ou une heure à aider une association de quartier. Avant, tu as peut-être le trac. Après, regarde si tu as envie de recommencer.",
      ph: "Exemple : j’ai fait un atelier de reliure. J’avais peur d’être ridicule, et j’ai adoré. Je m’inscris au cycle complet." },
    { titre: 'Refaire ma roue', texte: "En fin de semaine, refais ta roue de la vie dans ton bilan et compare-la avec celle du début du mois, en regardant surtout ton travail et ta joie. Tu peux aussi refaire le [test de l’arbre de vie](arbre-de-vie.html) et regarder ce qui a bougé dans [ton espace](login.html#mon-chemin).",
      exemple: "Par exemple : ton travail est passé de 4 à 5, ta joie de 3 à 5. Ton métier n’a pas changé, mais tu y as remis un morceau de toi. Remercie-toi pour ce que tu as osé ce mois-ci.",
      ph: "Exemple : ma joie a gagné deux points depuis que je dessine à nouveau le dimanche. Mon travail me pèse moins, parce que j’ai autre chose qui me nourrit." }
  ],

  bilanTitre: 'Ce que ce mois t’a apporté',
  bilan: [
    { k: 'fin-vibre', q: "Qu’as-tu découvert sur ce qui te fait vraiment vibrer ce mois-ci ?", ph: "Exemple : j’aime transmettre. Chaque fois que j’explique quelque chose à quelqu’un, je me sens à ma place." },
    { k: 'fin-talent', q: "Quel talent as-tu reconnu en toi, grâce aux autres ou à tes essais ?", ph: "Exemple : ma patience, et ma façon de mettre les gens à l’aise." },
    { k: 'fin-pas-voc', q: "Quel petit pas as-tu fait vers ta vocation, et qu’est-ce qu’il t’a appris ?", ph: "Exemple : j’ai appelé une formatrice. J’ai compris qu’une reconversion est possible, à mon rythme." },
    { k: 'fin-intention', q: "Quelle est ton intention pour octobre ?", ph: "Exemple : continuer à donner une heure par semaine à ce qui me fait vibrer, et faire le bilan de mon année.", court: true }
  ],

  /* Le côté libération du même mois, dans Mon suivi */
  suivi: {
    titre: 'Les métiers de la lignée',
    texte: "Pendant que ton carnet t’aide à retrouver ce qui te fait vibrer, ton suivi t’emmène vers le travail de ta famille : les métiers transmis, les rêves empêchés, les phrases sur l’argent et l’effort. Ce que tu y reconnais te laisse plus libre de choisir ta propre voie."
  },

  aVenir: [
    { mois: 'Octobre', titre: 'Mon bilan de l’année', texte: "Comparer tes roues, célébrer le chemin parcouru, relire ta lettre, et choisir la suite.", image: 'assets/cartes/a-mon-rythme-mini.jpg' },
    { mois: 'Novembre', titre: 'Une nouvelle année dans Le Cercle', texte: "Un nouveau tour de spirale, avec tout ce que tu as appris en chemin.", image: 'assets/guide/guide-spirale-or.webp' }
  ]
};
