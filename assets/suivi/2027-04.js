/* Genesolia · Le Cercle · Mon suivi « Je me libère » d'avril 2027 : « Quelles phrases me guident ? »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-04',
  cle: 'suivi-2027-04',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-04-0df5f051e5.pdf',
  nomMois: 'avril 2027',
  moisSuivant: 'mai',
  titre: "Quelles phrases me guident ?",
  sousTitre: "Branches de ton arbre de vie · Écouter les « Chez nous, on… » de ta famille, voir les croyances et les loyautés qu’ils portent, et choisir les mots qui guident ta vie.",
  citation: "On peut remercier une règle de famille, et choisir ses propres mots.",
  audio: '',
  audioCourt: '',
  saisonLien: "Avril, c’est la floraison. Les bourgeons s’ouvrent, les fenêtres aussi, on secoue les tapis et on laisse entrer l’air du printemps. Ce mois-ci, tu peux ouvrir une autre fenêtre : celle qui laisse entrer tes propres mots. Les vieilles règles de la maison, les « chez nous, on… », peuvent rester un moment sur le rebord, le temps de les regarder. Une fleur s’ouvre à son rythme, et tes phrases aussi.",
  intensiteQ: "À quel point les règles de ta famille, les « Chez nous, on… », décident-elles encore à ta place aujourd’hui ?",
  souhaitPh: "Exemple : ce « chez nous, on ne se plaint pas » qui m’empêche de dire à mon chef que je suis à bout.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-arbre.webp',
      theme: 'assets/guide/guide-coffret.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-transmission.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/ecrire-la-mienne-mini.jpg', "Je choisis les mots qui guident ma vie."]
    }
  },

  mots: {
    saison: "Commence par respirer. Ce mois-ci, tu n’as rien à renier : tu écoutes simplement les mots de ta famille, comme une chanson connue par cœur.",
    theme: "Lis cette page comme une lettre. Si une phrase de ton enfance te revient, avec la voix de quelqu’un, note-la quelque part : elle te servira toute l’étape.",
    voir: "Cette semaine, tu ramasses les règles de ta famille comme des cailloux sur un chemin. Tu n’as encore rien à en faire.",
    source: "Chaque règle a eu sa raison d’être. Cette semaine, tu cherches ce qu’elle protégeait, avec respect pour ceux qui la disaient.",
    liberer: "Ranger une règle ne veut pas dire trahir ta famille. Tu peux la remercier, garder ce qui te soutient et laisser le reste.",
    remplacer: "Dire vrai, c’est souvent minuscule : une phrase, un « non », un « j’ai besoin ». Et le lien tient presque toujours mieux que tu ne le crois.",
    meditation: "Une fois dans l’étape, un moment tranquille. Si une émotion monte, reviens à ton souffle : tu peux t’arrêter à tout moment.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Tu as écouté les règles de ta famille et choisi quelques mots à toi : c’est déjà beaucoup."
  },

  theme: {
    titre: "Les règles de ta famille",
    texte: [
      "Chaque famille a ses règles. Certaines sont dites à voix haute : « Chez nous, on finit son assiette », « On ne pleure pas pour si peu ». D’autres ne sont jamais prononcées, et tout le monde les respecte quand même : on ne parle pas d’argent à table, on ne contredit pas le grand-père, on arrive toujours en avance. Tu les as apprises avant de savoir lire, et beaucoup guident encore tes choix.",
      "Ce mois-ci, tu écoutes ces « Chez nous, on… », et aussi les phrases sur ce que tu devais être : « Une femme, ça ne se met pas en avant », « Un homme, ça ne pleure pas », « Sois une fille sage », « Un garçon, ça doit être fort ». Tu regardes ce qu’elles portent, et tu choisis celles que tu gardes.",
      "Tu continues le deuxième temps de ton année de suivi : **Traverser**. Après la peur, le projet posé sur toi et les émotions permises, tu regardes ce mois-ci le fil qui relie toutes les autres : les mots qui guident ta lignée, de génération en génération."
    ],
    sousTitre: "Comment une règle de famille se transmet",
    texte2: [
      "En psychogénéalogie, on observe qu’une règle de famille se transmet rarement par une explication. Elle passe par une phrase répétée, un regard, un soupir, un compliment, une porte qui claque. L’enfant comprend vite ce qui lui vaut d’être aimé·e et ce qui fait froncer les sourcils, et il ajuste sa conduite. Des années plus tard, l’adulte suit encore la règle, sans se souvenir de l’avoir apprise.",
      "Derrière chaque règle, il y a souvent une **croyance** (« l’argent ne tombe pas du ciel », « les autres vont te juger ») et une **loyauté** : rester fidèle à ceux qui l’ont transmise, comme si faire autrement revenait à les trahir. Ces règles ont presque toujours protégé quelqu’un. Dans une famille qui a connu la guerre, le manque ou l’exil, « on ne se fait pas remarquer » pouvait être une question de survie. Pour aller plus loin : [la loyauté familiale invisible](loyaute-familiale-invisible.html).",
      "Ce mois-ci, tu vas **voir** les règles de ta famille, remonter à leur **source**, **libérer** celles qui ne te vont plus en regardant ce qu’elles te font ressentir, dire et faire, puis les **remplacer** par tes propres mots, avec un geste « dire vrai » au quotidien.",
      "Un mot important : tu ne rejettes personne. Une règle peut avoir été précieuse pour ta grand-mère et trop étroite pour toi. Tu peux garder l’amour de ceux qui la disaient, et changer de mots."
    ],
    exemplesTitre: "À quoi ressemble une règle de famille, au quotidien",
    exemples: [
      "**Les émotions** : « Chez nous, on ne fait pas de scène. » Nadia sourit en réunion alors qu’elle bouillonne, puis pleure seule dans sa voiture.",
      "**L’argent** : « On ne demande pas, on attend qu’on nous donne. » En douze ans, Julien n’a jamais négocié son salaire.",
      "**Le travail** : « Le repos, c’est pour les fainéants. » Sylvie range la cuisine à minuit plutôt que de s’asseoir dix minutes.",
      "**La place des filles et des garçons** : « Une fille, ça aide sa mère », « Un garçon, ça ne se plaint pas ». Chez Marc, sa sœur débarrassait, lui partait au foot. Aujourd’hui, il ne sait pas dire qu’il est fatigué.",
      "**Le corps et l’apparence** : « Chez nous, on ne sort pas en jogging. » Léa se change trois fois avant d’aller chercher le pain."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Au repas de famille, ton oncle lance : « Chez nous, on ne se plaint pas. » Il y a quelques années, tu aurais ravalé ta phrase sur ton travail épuisant, et souri. Cette fois, tu sens la règle arriver, tu respires, et tu dis simplement : « Moi, en ce moment, je suis fatigué·e, et j’ai le droit de le dire. » Ton oncle hausse les épaules, ta cousine te regarde avec soulagement. La règle est encore là, mais ce n’est plus elle qui parle à ta place.",
    question: { k: 'theme-ph', q: "En une phrase, quelle règle « Chez nous, on… » guide le plus ta vie aujourd’hui ?", ph: "Exemple : « Chez nous, on se débrouille seul. » Je n’arrive pas à demander de l’aide, même quand je suis débordée." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "Les « Chez nous, on… », sous tes yeux",
      intro: "Cette semaine, tu poses sur la table les règles de ta famille. Tu ne cherches pas encore à les juger ni à les changer : tu les écris, domaine par domaine, avec la voix de ceux qui les disaient, et tu remarques où elles agissent encore dans tes journées.",
      texte: "Commence par la collecte, au calme, une vingtaine de minutes. Puis, pendant la semaine, remarque les moments où une règle décide à ta place. Tu retrouves ici l’outil « attraper la phrase » du module 3 : écoute ce qui se dit dans ta tête juste avant de faire comme d’habitude.",
      exercices: [
        { k: 'ex1-ph', titre: "La collecte des « Chez nous, on… »", type: 'tableau', rangs: 6,
          etiquettes: ['Les émotions', 'L’argent', 'Le travail', 'L’amour', 'Le corps et l’apparence', 'La place des filles et des garçons'],
          consigne: "Pour chaque domaine, écris une règle de ta famille, en commençant si tu peux par « Chez nous, on… ». Note qui la disait, ou la vivait sans la dire, puis ce que tu en fais aujourd’hui : tu l’appliques, tu la combats, ou tu l’as laissée. Si rien ne vient pour un domaine, laisse la ligne vide : elle se remplira peut-être dans la semaine.",
          pourquoi: "Rangées par domaine, les règles montrent leur forme : on voit vite celles qui reviennent partout, celles qui viennent du même côté de la famille, et celles qui touchent surtout les filles ou surtout les garçons. Les écrire avec la voix de quelqu’un, c’est déjà les remettre à leur place : des mots reçus, pas des vérités.",
          colonnes: [
            { q: "Quelle est la règle, en « Chez nous, on… » ?", ph: ["Exemple : « Chez nous, on ne pleure pas devant les autres »", "Exemple : « Chez nous, on ne parle pas d’argent, c’est vulgaire »", "Exemple : « Chez nous, on ne s’arrête que quand tout est fini »", "Exemple : « Chez nous, on reste ensemble, quoi qu’il arrive »", "Exemple : « Chez nous, on se tient droit et on ne se plaint pas »", "Exemple : « Une fille, ça aide à la cuisine, un garçon, ça porte les courses »"] },
            { q: "Qui la disait, ou la vivait ?", ph: ["Exemple : mon père, et sa mère avant lui", "Exemple : ma grand-mère maternelle", "Exemple : mon grand-père, à la ferme", "Exemple : ma mère, surtout après le départ de mon oncle", "Exemple : ma tante Josiane", "Exemple : toute la famille, sans jamais le dire"] },
            { q: "Et toi, aujourd’hui ?", ph: ["Exemple : je l’applique, je pleure seule dans la salle de bains", "Exemple : je la combats, j’en parle avec tout le monde, et je me sens gênée après", "Exemple : je l’applique, je finis mes dossiers à 22 h", "Exemple : je l’applique, je suis resté·e huit ans dans une relation finie", "Exemple : je l’ai laissée, je dis quand j’ai mal au dos", "Exemple : je la combats, mais c’est toujours moi qui cuisine chez mes parents"] }
          ],
          apres: { k: 'ex1-ph-relire', q: "Relis ta collecte. Quelle règle revient dans plusieurs domaines, ou quelle personne en a transmis le plus ?", ph: "Exemple : « on se débrouille seul » revient partout, pour l’argent, le travail et l’amour. Et presque tout vient du côté de mon père." } },
        { k: 'voir-journal-ph', titre: "Quand une règle décide à ma place", type: 'texte',
          consigne: "Cette semaine, chaque fois qu’une règle de famille décide à ta place, note-le le jour même : la situation, la règle que tu as entendue dans ta tête, ce que tu as fait, et ce que tu aurais voulu faire. Vise au moins trois moments. Ce sont souvent de petites scènes : dire oui alors que tu pensais non, ne pas oser rappeler un ami, finir le travail d’un·e collègue.",
          pourquoi: "Une règle de famille agit vite, en une seconde, avant même que tu aies choisi. La noter après coup, c’est apprendre à la reconnaître, puis un jour à l’entendre arriver. C’est le début du choix.",
          q: "Ce que tu remarques, en général, quand une règle décide à ta place",
          ph: "Exemple : j’entends la voix de ma mère, très nette, et je dis oui avant même d’avoir réfléchi.",
          journal: { k: 'voir-sit-ph', n: 6, q: "Chaque moment : le jour, la scène, la règle entendue, ce que tu as fait, ce que tu aurais voulu faire", ph: "Exemple : mardi, ma voisine m’a demandé de garder son chien tout le week-end. « Chez nous, on rend service. » J’ai dit oui. J’aurais voulu dire : pas ce week-end." } }
      ],
      conseil: "Tu n’as rien à corriger cette semaine : remarquer suffit. Si une règle te met en colère contre quelqu’un, note-le aussi, sans t’y attarder. La colère dit souvent qu’une règle a été trop étroite pour toi, pas que la personne ne t’aimait pas." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "Ce que la règle protégeait",
      intro: "Une règle de famille naît presque toujours d’une histoire : un manque, une guerre, un exil, une honte qu’il fallait éviter. Cette semaine, tu remontes à la source de deux ou trois règles, pour voir ce qu’elles protégeaient, et pourquoi il est parfois si difficile de faire autrement.",
      texte: [
        "Les règles touchent souvent les deux cycles. Le **cycle de la racine** parle de sécurité : « on ne gaspille rien », « on ne se fait pas remarquer », « on garde un emploi stable » viennent souvent d’une famille qui a manqué, qui a dû partir, ou qui a eu peur d’être rejetée. Le **cycle du cœur** parle de lien : « une fille sage ne répond pas », « on ne contredit pas papa ». On obéissait à la règle pour être aimé·e, pour garder sa place.",
        "C’est là que naît la **loyauté** : faire autrement donne l’impression de trahir ceux qui t’ont transmis la règle, de les juger, ou de quitter la famille. Pourtant, tu peux remercier une règle pour ce qu’elle a protégé, et choisir d’autres mots. Le lien reste."
      ],
      exercices: [
        { k: 'source-ph', titre: "D’où vient la règle", type: 'questions',
          consigne: "Choisis deux ou trois règles de ta collecte, celles qui décident le plus souvent à ta place. Prends ces questions une par une, à ton rythme. Si une réponse ne vient pas, écris ce que tu imagines : ton intuition compte aussi.",
          pourquoi: "Quand on voit ce qu’une règle protégeait, elle change de visage : ce n’est plus un ordre absurde, c’est une solution trouvée par quelqu’un, un jour, dans une vie difficile. On peut alors la respecter, et voir qu’elle ne correspond plus forcément à ta vie d’aujourd’hui.",
          choix: { k: 'cycle-ph', q: "Aujourd’hui, les règles de ta famille touchent surtout…", options: ['La racine : la sécurité, l’argent, ne pas manquer, ne pas se faire remarquer', 'Le cœur : être aimé·e, garder sa place, ne pas décevoir', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-histoire-ph', q: "Dans quelle histoire de ta lignée cette règle a-t-elle pu naître ?", ph: "Exemple : « on ne gaspille rien » vient de mon grand-père, qui a eu faim enfant, pendant la guerre, en Italie." },
            { k: 'source-protege-ph', q: "Qu’est-ce qu’elle protégeait ? De quoi gardait-elle la famille ?", ph: "Exemple : « on ne se fait pas remarquer » protégeait ma grand-mère, arrivée d’Espagne à douze ans, des moqueries du village." },
            { k: 'source-aime-ph', q: "Enfant, que se passait-il quand tu suivais la règle ? Et quand tu ne la suivais pas ?", ph: "Exemple : quand j’étais sage et discrète à table, on me disait « tu es une bonne petite ». Quand je répondais, mon père quittait la pièce." },
            { k: 'source-etre-ph', q: "Quelles phrases te disaient ce que tu devais être, en tant que fille ou garçon, femme ou homme ?", ph: "Exemple : « Une femme, ça tient sa maison », « Sois belle et tais-toi ». Dit en riant, mais tout le monde le pensait un peu." },
            { k: 'source-loyaute-ph', q: "Si tu fais autrement, as-tu l’impression de les trahir ? Qui, et comment ?", ph: "Exemple : si je me repose le dimanche, j’ai l’impression de trahir ma mère, qui n’a jamais pu le faire. Comme si je lui disais qu’elle s’est épuisée pour rien." }
          ] },
        { k: 'source-question-ph', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur l’origine d’une règle : « Pourquoi, chez nous, on disait toujours… ? », « Ta mère te disait déjà ça ? ». Par téléphone, à table, ou par message. Note sa réponse, même courte. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html). Si personne ne peut te répondre, note ce que tu imagines de la vie de la personne qui disait la règle.",
          questions: [
            { k: 'source-qui-ph', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma tante : « Pourquoi mamie disait toujours qu’on ne parle pas d’argent ? »", court: true },
            { k: 'source-reponse-ph', q: "Qu’as-tu appris ? Qu’est-ce que ça change pour toi ?", ph: "Exemple : mon arrière-grand-père avait tout perdu en prêtant à un cousin. Depuis, l’argent était un sujet dangereux. Je comprends mieux ma gêne quand je dois parler de mes tarifs.", lignes: 3 }
          ] }
      ],
      conseil: "Note dans [ton arbre familial](genosociogramme.html) qui disait chaque règle : tu verras peut-être qu’une même phrase passe de génération en génération, du même côté. Et si tu découvres une histoire difficile, prends le temps de la laisser se poser avant d’aller plus loin." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "Ta carte ressens, dis, fais",
      intro: "Une règle qui ne te va plus crée souvent un décalage : tu ressens une chose, tu en dis une autre, et tu en fais une troisième. Cette semaine, tu dessines ta carte ressens / dis / fais pour trois règles, tu vois la croyance et la loyauté qu’elles portent, puis tu ranges symboliquement celles que tu laisses, avec respect.",
      exercices: [
        { k: 'carte-rdf-ph', titre: "Ma carte ressens / dis / fais", type: 'blocs', nb: 3,
          etiquettes: ['Première règle', 'Deuxième règle', 'Troisième règle'],
          consigne: "Choisis trois règles de ta collecte. Pour chacune, pense à une scène précise de ces derniers jours. Note ce que tu ressentais vraiment, ce que tu as dit, ce que tu as fait. Puis écris la croyance ou la loyauté que la règle porte, et ce que tu choisis : la garder, l’adoucir, ou la laisser.",
          pourquoi: "Regarder une règle dans une scène réelle montre qui décide vraiment : toi, ou les mots de ta lignée. Quand ce que tu ressens, ce que tu dis et ce que tu fais commencent à se rejoindre, tu sens souvent un soulagement dans le corps, comme une respiration plus large.",
          astuce: "Une règle n’est pas forcément à laisser. « Chez nous, on s’entraide » peut rester précieuse : tu peux simplement y ajouter « et j’ai le droit de demander aussi ».",
          champs: [
            { q: "La règle, et la scène où elle a agi", ph: ["Exemple : « Chez nous, on ne se plaint pas ». Lundi, quand mon chef m’a donné un dossier de plus", "Exemple : « Une fille sage ne contredit pas ». Dimanche, quand mon père a critiqué mon choix de métier", "Exemple : « On ne parle pas d’argent ». Hier, quand ma sœur m’a demandé de lui prêter 500 euros"] },
            { q: "Je ressens… Je dis… Je fais…", ph: ["Exemple : je ressens de l’épuisement. Je dis « pas de souci ». Je fais le dossier jusqu’à 21 h.", "Exemple : je ressens de la colère. Je dis « tu as sans doute raison ». Je change de sujet.", "Exemple : je ressens de la gêne et l’envie de refuser. Je dis « bien sûr ». Je fais le virement le soir même."] },
            { q: "La croyance ou la loyauté qu’elle porte", ph: ["Exemple : si je me plains, on me trouvera faible, comme mon grand-père le disait de son frère", "Exemple : si je contredis papa, je perds son amour", "Exemple : parler d’argent abîme les liens, comme chez mes arrière-grands-parents"] },
            { q: "Ce que je choisis : la garder, l’adoucir ou la laisser", ph: ["Exemple : je la laisse. Je garde le courage de mon grand-père, pas son habitude de cacher sa fatigue.", "Exemple : je l’adoucis : je peux aimer mon père et penser autrement.", "Exemple : je la laisse. Je peux parler d’argent avec douceur, et poser mes limites."] }
          ] }
      ],
      rituel: {
        titre: "La boîte des règles rendues",
        intro: "Ce rituel symbolique marque ton choix de laisser une ou plusieurs vieilles règles, en remerciant ce qu’elles ont protégé. Il est différent de l’atelier de réécriture du protocole : ici, tu ne réécris rien, tu remercies et tu ranges. Fais-le une fois cette semaine, après ta carte ressens / dis / fais. Il dure une dizaine de minutes.",
        materiel: "Quelques petits papiers, un stylo, une boîte ou une enveloppe que tu peux fermer, et un ruban ou un élastique.",
        etapes: [
          "Choisis un moment calme. Pose la boîte devant toi, ouverte, et respire trois fois profondément.",
          "Sur chaque papier, écris une règle que tu laisses, telle que tu l’entendais : « Chez nous, on… ». Ajoute en dessous le prénom de la personne qui la disait, si tu le connais.",
          "Prends le premier papier dans tes mains. Lis la règle à voix basse, puis dis : « Merci. Tu as protégé ma famille, un jour. Aujourd’hui, je te range. »",
          "Plie le papier et pose-le dans la boîte. Fais de même avec chacun des autres, sans te presser.",
          "Ferme la boîte, entoure-la du ruban, et pose ta main dessus. Dis : « Je garde l’amour de ceux qui me les ont transmises. Je choisis mes propres mots. »",
          "Range la boîte en hauteur ou au fond d’un placard, loin de ton regard quotidien. Puis note ci-dessous ce que tu as ressenti."
        ],
        note: { k: 'rituel-note-ph', q: "Après le rituel, note ce qui s’est passé : les règles que tu as rangées, ce que tu as ressenti, où tu as posé la boîte.", ph: "Exemple : j’ai rangé trois règles, dont « on ne pleure pas pour si peu ». En remerciant ma grand-mère, j’ai eu les larmes aux yeux. La boîte est en haut de l’armoire." }
      },
      conseil: "Si ranger une règle te donne l’impression de trahir quelqu’un, c’est la loyauté qui parle, et c’est normal. Tu peux garder un papier hors de la boîte quelques jours, le temps de te sentir prêt·e. Rien ne presse." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: "Dire vrai, et rester en lien",
      intro: "Tu as collecté les règles, vu ce qu’elles protégeaient, rangé celles que tu laisses. Cette semaine, tu essaies tes propres mots dans la vraie vie : un petit geste « dire vrai » chaque jour, pour découvrir que tu peux déplaire un peu, et que le lien tient.",
      texte: [
        "**La première pause.** Quand tu sens une vieille règle arriver (te taire, dire oui, sourire alors que tu bouillonnes), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis-toi : « Je te reconnais, tu viens de chez nous. Aujourd’hui, je choisis mes mots. »",
        "**Dire vrai, en petit.** Commence par une situation sans grand enjeu : dire que tu préfères un autre film, que tu n’as pas le temps ce soir, que tu ne partages pas un avis. Ta séance audio « Je peux déplaire et rester en sécurité » t’accompagne : la peur du conflit monte, tu la laisses passer, et tu vois que la relation reste là."
      ],
      exercices: [
        { k: 'dire-vrai-ph', titre: "Mon geste « dire vrai »", type: 'texte',
          consigne: "Choisis un geste « dire vrai » à la place d’une règle que tu as rangée. Écris-le, puis essaie-le chaque jour, même en tout petit. Note chaque essai et ce qui s’est passé dans le lien : souvent, bien moins que ce que tu craignais. Ce geste rejoint ton carnet « J’avance » : dire vrai, c’est parler avec tes mots plutôt qu’avec ceux de la lignée.",
          pourquoi: "Une règle de famille se change par l’expérience, pas seulement par la réflexion. Chaque fois que tu dis vrai et que le lien tient, ton corps apprend une nouvelle règle : je peux être moi, et rester aimé·e. C’est cette découverte, répétée, qui remplace les vieux « Chez nous, on… ».",
          gestes: ["Dire « non, pas cette fois » à une demande", "Dire « je ne suis pas d’accord », calmement, une fois", "Dire « j’ai besoin d’aide » au lieu de tout faire seul·e", "Dire « je suis fatigué·e » quand c’est vrai", "Dire « ça m’a fait de la peine » au lieu de sourire", "Parler d’argent simplement, sans t’excuser"],
          q: "Ton geste : « Là où la règle disait…, moi je vais… »",
          ph: "Exemple : là où la règle disait « on ne se plaint pas », moi je vais dire à mon compagnon, chaque soir, une chose qui a été dure dans ma journée.",
          journal: { k: 'dire-vrai-essais-ph', n: 6, q: "Chaque essai : quand, ce que tu as dit, et ce qui s’est passé dans le lien", ph: "Exemple : jeudi, j’ai dit à ma mère que je ne viendrais pas dimanche. Elle a soupiré, puis elle m’a demandé si j’allais bien. On a parlé dix minutes, vraiment." } }
      ],
      conseil: "Si quelqu’un réagit mal, ce n’est pas la preuve que tu avais tort : c’est souvent la règle qui proteste chez l’autre aussi. Respire, reste doux·ce et clair·e, et laisse le temps faire. Et si un jour tu reviens à l’ancienne règle, remarque-le simplement : la prochaine fois sera plus facile." }
  ],

  meditation: {
    titre: "Les mots gravés, les mots choisis",
    intro: "Une séance guidée pour retrouver les mots anciens gravés dans ta maison intérieure, les remercier, et laisser tes mots choisis prendre leur place.",
    texte: [
      "Je m’installe confortablement, le dos soutenu, les pieds bien posés. Je ferme les yeux, ou je laisse mon regard se poser doucement devant moi. Je respire profondément, trois fois… Mon corps se pose.",
      "[pause]",
      "Je sens mon corps sur le siège, mes pieds sur le sol. Je suis en sécurité, ici et maintenant. Je peux revenir à mon souffle, et ouvrir les yeux, à tout moment.",
      "J’entre dans une maison de famille. L’air est tiède, la lumière douce. Je traverse l’entrée, la cuisine, le salon. Sur les murs, sur les poutres, sur le bois de la table, des mots sont gravés. Des mots anciens, écrits par des mains que je connais, et par d’autres mains, venues de très loin dans ma lignée.",
      "Je m’approche. Je les lis doucement : « Chez nous, on… ». Je reconnais peut-être la voix de ma mère, de mon père, d’une grand-mère, d’un grand-père. Je laisse chaque phrase résonner, simplement, comme un écho.",
      "[pause]",
      "Je pose ma main sur l’un de ces mots gravés. Je sens le bois sous mes doigts, les lettres creusées par les années. Ces mots ont protégé quelqu’un, un jour. Ils ont aidé ma famille à traverser la faim, la peur, le départ, la honte. Je leur dis intérieurement : « Merci. Je vois ce que vous avez gardé. »",
      "Certains de ces mots me soutiennent aujourd’hui encore. Ils me donnent du courage, de la tendresse, de la fidélité. Je les garde près de moi, comme des amis.",
      "D’autres mots appartiennent à une autre époque. Je les effleure une dernière fois, et le bois redevient lisse, doucement, comme le sable après la marée. Ces mots restent dans ma mémoire, à leur juste place, derrière moi.",
      "[longue pause]",
      "Au centre de la table, une surface claire m’attend. Je tiens un outil léger dans ma main. J’y écris mes propres mots, ceux que je choisis : « Je dis ce que je vis. » « J’ai le droit de demander. » « Je peux déplaire et rester aimé·e. » J’accueille les mots qui viennent, les miens.",
      "Je les regarde briller dans la lumière. Ils ont ma voix, mon rythme, ma couleur. Ils guident ma vie à partir d’aujourd’hui, et je reste libre de les changer en chemin.",
      "[pause]",
      "Je me dis intérieurement : « Je remercie les mots de ma lignée. Je choisis les mots qui guident ma vie. » Je respire profondément. Je sens à nouveau mon corps, le sol, l’air autour de moi. Je bouge doucement les doigts, les épaules. Et quand je suis prêt·e, j’ouvre les yeux."
    ],
    conseil: "Choisis un moment calme, dix minutes pour toi seul·e, avec ton carnet posé à côté de toi pour noter tes mots choisis juste après. Si une émotion forte monte, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux arrêter la séance et la reprendre un autre jour.",
    note: { k: 'medit-note-ph', q: "Qu’est-ce qui t’est venu pendant la séance ? Un mot gravé, une voix, une pièce, les mots que tu as écrits…", ph: "Exemple : sur la poutre de la cuisine, j’ai lu « on serre les dents », avec la voix de mon grand-père. Sur la table, j’ai écrit « je demande ». J’ai senti mes mâchoires se détendre." }
  },

  /* Le protocole du mois, cycle 2 « Mon arbre de vie » (version 3) : Explorer, Transformer, Intégrer.
     Affiché en semaine 3 (Libérer), après les exercices. Clé de champ : arbre-note. */
  protocole: {
    titre: "Branches · Quelles phrases me guident ?",
    intro: "**Objectif :** remplacer les phrases héritées par mes propres phrases. **Sous-objectif :** collecter les phrases de ma famille, voir où elles agissent, et les réécrire. **Intensité douce.**",
    materiel: "Quelques cartes ou petits cartons. Ton carnet, des crayons de couleur, et ton affiche [« Mon arbre de vie »](arbre-de-vie-affiche.html). Le cadre du suivi est dans [le mode d’emploi](mode-emploi-suivi.html).",
    etapes: [
      {
        titre: "**Explorer** · 20 min",
        etapes: [
          "**La collecte (10 min).** « Chez nous, on… », « Il faut… », « Une femme, ça… », « Un homme, ça… ». Note qui les disait.",
          "**Où elles agissent (10 min).** Pour 3 phrases, une situation récente : « Je ressens… Je dis… Je fais… »"
        ]
      },
      {
        titre: "**Transformer** · 45 min",
        etapes: [
          "**L’atelier de réécriture (25 min).** Trois colonnes : la phrase héritée, ce qu’elle protégeait (et merci à elle), ma version choisie. Par exemple : « Chez nous, on serre les dents » devient « Je dis ce que je vis, et je demande du soutien ». « L’argent se gagne à la sueur du front » devient « Mon argent peut venir avec joie ». « Il faut être sage » devient « J’ai le droit d’être vivant·e et joyeux·se ».",
          "**Mes 3 phrases (10 min).** Choisis tes 3 préférées et écris-les en grand sur des cartes.",
          "**Les afficher (10 min).** Place-les là où tu les vois chaque jour : le miroir, le frigo, ton téléphone. Lien : l’outil « Crée ton fond d’écran », en semaine 4 de ton [carnet du mois](mon-carnet.html)."
        ]
      },
      {
        titre: "**Intégrer** · 15 min",
        etapes: [
          "**Clôture commune (3 min).** Lis à voix haute [le texte de fin de rituel et de réunification intérieure](mode-emploi-suivi.html#cloture).",
          "**Sur mon arbre (7 min).** Tes nouvelles phrases sur les branches.",
          "**Chaque jour (5 min la première fois).** Choisis une petite action qui va avec l’une de tes phrases."
        ]
      }
    ],
    questions: [
      {
        k: "arbre-note",
        q: "Ce que j’ai posé sur mon arbre ce mois-ci",
        ph: "Exemple : sur les branches : « Je dis ce que je vis », « Mon argent peut venir avec joie », « J’ai le droit d’être joyeuse »."
      }
    ]
  },

  bilanTitre: "Les mots que je garde, les mots que je choisis",
  bilan: [
    { k: 'fin-regle', q: "Quelle règle de ta famille as-tu reconnue le plus clairement ce mois-ci ?", ph: "Exemple : « Chez nous, on se débrouille seul », du côté de mon père." },
    { k: 'fin-source-ph', q: "Qu’as-tu compris de ce qu’elle protégeait, et de la loyauté qui te la faisait suivre ?", ph: "Exemple : mon grand-père a été placé chez un oncle à dix ans. Ne compter sur personne, c’était sa façon de tenir. En suivant sa règle, je lui restais fidèle." },
    { k: 'fin-garde-ph', q: "Quels mots de ta lignée gardes-tu avec gratitude ?", ph: "Exemple : « Chez nous, on tient parole. » Celle-là, je la garde, elle me ressemble." },
    { k: 'fin-dire-vrai', q: "Quel geste « dire vrai » as-tu osé, et qu’as-tu découvert du lien ?", ph: "Exemple : j’ai dit à ma sœur que je ne pouvais pas lui prêter d’argent. Elle a été déçue deux jours, puis elle m’a appelée comme d’habitude. Le lien a tenu." },
    { k: 'fin-intention-ph', q: "Qu’aimerais-tu continuer à libérer à ta prochaine étape ?", ph: "Exemple : continuer à dire vrai chaque jour, et regarder ce que j’ai reçu de ma mère.", court: true }
  ],

  carnet: {
    titre: "Dire vrai",
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. Les règles de ta famille t’ont souvent appris à taire ce que tu ressens : ton carnet t’aide ce mois-ci à le nommer, à le dire en quatre temps et à oser un mot vrai chaque jour. Reporte ton geste « dire vrai » et tes mots choisis dans ton carnet, ils deviennent des appuis."
  },

  aVenir: [
    { mois: 'Mai', titre: "Comment ai-je appris à aimer ?", texte: "Regarder ce que tu as reçu de ta mère et des femmes de ta lignée, garder le meilleur et faire autrement.", image: 'assets/cartes/ma-mere-mini.jpg' },
    { mois: 'Juin', titre: "Ai-je le droit d’aller plus loin ?", texte: "Regarder ce que tu as reçu de ton père et des hommes de ta lignée, et trouver ta propre façon d’avancer.", image: 'assets/cartes/deux-parents-mini.jpg' },
    { mois: 'Juillet', titre: "Combien je m’autorise à recevoir ?", texte: "Regarder ce que ta lignée t’a transmis sur l’argent, et t’autoriser ta juste valeur.", image: 'assets/guide/guide-coffret.webp' }
  ]
};
