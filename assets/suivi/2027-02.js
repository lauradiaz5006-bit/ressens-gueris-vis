/* Genesolia · Le Cercle · Mon suivi « Je me libère » de février 2027 : « Le couple et les schémas amoureux »
   Le suivi est le côté libération du Cercle : voir ce qui se rejoue, remonter à la source, libérer, remplacer.
   Il utilise le même livre que le carnet (assets/mon-carnet.js, type 'suivi'). La saison vient de assets/saisons.js.
   Chaque question : { k: clé d'enregistrement (ne jamais la changer une fois le mois ouvert), q: la question en phrase complète, ph: l'exemple }.
   Les clés doivent être uniques dans tout le mois. */
window.GENESOLIA_CARNET = {
  type: 'suivi',
  mois: '2027-02',
  cle: 'suivi-2027-02',
  page: 'mon-suivi-mois.html',
  pdf: 'assets/cercle/cercle-2027-02-0d10ec64c2.pdf',
  nomMois: 'février 2027',
  moisSuivant: 'mars',
  titre: 'Le couple et les schémas amoureux',
  sousTitre: "Regarder les couples de ta lignée, repérer ce qui se répète en amour, et choisir l’amour que tu veux vivre.",
  citation: "Tu peux aimer autrement que celles et ceux qui t’ont précédé·e.",
  audio: '',
  audioCourt: '',
  saisonLien: "En février, la lumière revient discrètement : chaque soir, le jour gagne quelques minutes sans bruit. C’est le bon moment pour éclairer doucement les histoires d’amour de ta famille, celles qu’on raconte et celles qu’on tait, et laisser entrer un peu de clarté dans ta propre façon d’aimer.",
  intensiteQ: "À quel point ce qui se répète dans ta vie amoureuse pèse-t-il aujourd’hui ?",
  souhaitPh: "Exemple : cette habitude de choisir des personnes qui ne sont jamais vraiment disponibles.",

  decor: {
    couverture: 'assets/formation/spirale.jpg',
    citation: 'assets/formation/montagne.jpg',
    meditation: 'assets/formation/spirale.jpg',
    pages: {
      saison: 'assets/guide/guide-etoiles.webp',
      theme: 'assets/guide/guide-boucle.webp',
      voir: 'assets/guide/guide-repete.webp',
      source: 'assets/guide/guide-arbre.webp',
      liberer: 'assets/guide/guide-pause.webp',
      remplacer: 'assets/guide/guide-spirale-or.webp',
      meditation: 'assets/guide/guide-reves.webp',
      bilan: 'assets/guide/guide-livre-lumineux.webp'
    },
    cartes: {
      theme: ['assets/cartes/aimer-et-choisir-mini.jpg', "On peut aimer sa famille et choisir autre chose."]
    }
  },

  mots: {
    saison: "Commence par respirer avec la saison. Que tu sois en couple, seul·e ou entre deux, ce mois-ci est pour toi.",
    theme: "Lis cette page comme une lettre. Si une histoire de ta famille te revient, laisse-la simplement venir.",
    voir: "Cette semaine, tu observes les couples, les tiens et ceux de ta lignée, sans juger personne. Voir, c’est déjà commencer à choisir.",
    source: "Certaines réponses viendront tout de suite, d’autres dans quelques jours. Tu n’as rien à forcer.",
    liberer: "Rendre une histoire d’amour qui n’est pas la tienne, ce n’est pas renier ta famille. C’est garder l’amour et laisser le poids.",
    remplacer: "L’amour que tu veux vivre commence par un petit geste, envers toi ou envers quelqu’un. Un seul suffit cette semaine.",
    meditation: "Une fois dans le mois, un soir tranquille. Si une émotion monte, reviens à ton souffle : tu peux t’arrêter à tout moment.",
    bilan: "Prends ce moment même si tout n’a pas été fait. Tu as regardé l’amour en face, et c’est courageux."
  },

  theme: {
    titre: "Regarder les couples de ta lignée",
    texte: [
      "Février met l’amour à l’honneur. Cœurs en vitrine, dîners en tête-à-tête, déclarations et cartes postales : on parle beaucoup du couple. Que tu sois en couple, seul·e, en train de te séparer ou de rencontrer quelqu’un, cette période réveille parfois des questions, des manques ou des souvenirs.",
      "Ta façon d’aimer ne vient pas de nulle part. Tu as grandi au milieu des couples de ta famille, de leurs gestes tendres, de leurs disputes, de leurs silences. Ce mois-ci t’invite à les regarder sans les juger, pour mieux comprendre tes propres choix, et ouvrir la porte à l’amour qui te ressemble.",
      "Tu es maintenant dans le deuxième temps de ton année de suivi. Après **Voir**, d’octobre à décembre, où tu as appris à repérer ce qui revient, voici **Traverser**, de janvier à juin : tu regardes de plus près les grands fils de ta lignée, un par un, pour les traverser avec douceur. Ce mois-ci, c’est le fil de l’amour."
    ],
    sousTitre: "Les loyautés amoureuses",
    texte2: [
      "En psychogénéalogie, on observe que les histoires d’amour se transmettent elles aussi. Des femmes qui élèvent seules leurs enfants, des hommes qui partent, des mariages de raison, des amours interdites, des veuvages précoces : ces scènes peuvent se rejouer d’une génération à l’autre. Une grand-mère mariée à vingt ans contre son gré, une mère qui a renoncé à un premier amour, une fille qui n’arrive pas à s’engager : le fil est parfois visible.",
      "Une loyauté, c’est un lien invisible qui nous pousse à faire comme les nôtres, par amour pour eux. On ne s’autorise pas à être plus heureux·se que ses parents, on choisit le même type de partenaire, ou on fuit le couple pour ne pas revivre ce qu’on a vu. Ces croyances ont protégé ta famille à une époque où divorcer était mal vu, où l’on se mariait pour survivre, où l’on taisait ses sentiments. Elles avaient un sens. Elles ne sont pas forcément les tiennes. Pour aller plus loin : [les schémas répétitifs en amour](schemas-repetitifs-en-amour.html).",
      "Ce mois-ci, tu vas **voir** les couples de ta lignée, **remonter** aux phrases et aux histoires qui ont façonné ta façon d’aimer, **rendre** ce qui ne t’appartient pas, et **choisir** un geste qui ressemble à l’amour que tu veux vivre.",
      "Un mot important : ce travail ne sert jamais à t’aider à supporter une relation où tu as peur. Si tu te sens rabaissé·e, contrôlé·e, menacé·e ou en danger, ta sécurité passe avant tout exercice. Parles-en à une personne de confiance. En France, le **3919** est gratuit et anonyme, et le **17** répond en cas d’urgence."
    ],
    exemplesTitre: "À quoi ressemble un schéma amoureux, au quotidien",
    exemples: [
      "**Le même type de personne** : tes trois dernières histoires étaient avec quelqu’un de brillant, drôle et toujours ailleurs. Comme ton père, qui rentrait tard et partait tôt.",
      "**La fuite avant la fin** : dès que la relation devient sérieuse, tu trouves un défaut, puis un autre, et tu pars la première, avant d’être quittée.",
      "**Tout donner pour être choisi·e** : tu organises, tu offres, tu t’adaptes, et tu attends en silence qu’on te le rende un jour.",
      "**La phrase de famille** : à chaque dispute, tu entends ta grand-mère : « Les hommes, il faut savoir les supporter. » Et tu te tais.",
      "**Le bonheur qui fait peur** : tout va bien avec ton ou ta partenaire, et pourtant tu attends la catastrophe, comme si le bonheur ne durait jamais chez vous."
    ],
    exempleSpirale: "La spirale, c’est la même scène, un cran plus haut. Ton nouveau compagnon annule votre dîner pour la deuxième fois. La boucle aurait dit « ce n’est rien » en souriant, puis pleuré seule. La spirale reconnaît la vieille sensation de passer après, respire, et dit : « J’ai été déçue. J’ai besoin qu’on se voie cette semaine. » Le thème est le même, ta place a changé.",
    question: { k: 'theme-amour', q: "En une phrase, qu’est-ce qui se répète dans ta vie amoureuse, ou dans ta façon d’aimer ?", ph: "Exemple : je m’attache toujours à des personnes qui ne sont pas prêtes à s’engager, et j’attends." }
  },

  semaines: [
    { cle: 'voir', nom: 'Voir', etape: 'Voir', titre: "Les couples sous tes yeux",
      intro: "Cette semaine, tu poses sur la table les couples de ta famille, et tes propres histoires. Tu ne cherches pas encore à comprendre : tu regardes comment on s’est aimé chez toi, ce qui a duré, ce qui s’est défait, et ce qui revient.",
      texte: "Commence par le tableau des couples, au calme, une vingtaine de minutes, avec un thé. Puis, pendant la semaine, observe les couples autour de toi et ta propre façon d’aimer, et note ce qui te rappelle ta famille.",
      exercices: [
        { k: 'ex1', titre: "Les couples de ma lignée", type: 'tableau', rangs: 4,
          etiquettes: ['Mes parents', 'Mes grands-parents maternels', 'Mes grands-parents paternels', 'Mes propres histoires'],
          consigne: "Pour chacun de ces couples, note en quelques mots comment ils se sont rencontrés, comment a vécu leur couple (durée, séparation, non-dits, tendresse), puis ce qui te semble se répéter. Si tu ne sais pas, écris « je ne sais pas » : c’est aussi une information. Tu peux ajouter un oncle, une tante ou un couple qui t’a marqué·e dans la dernière ligne.",
          pourquoi: "Quand on écrit les couples l’un sous l’autre, le fil apparaît souvent tout seul : des femmes qui portent seules, des rencontres très jeunes, des amours qu’on n’a pas pu vivre. Ce n’est pas une fatalité, c’est une carte qui t’aide à voir d’où tu pars.",
          colonnes: [
            { q: "Comment se sont-ils rencontrés, et à quel âge ?", ph: ["Exemple : au bal du village, ma mère avait 19 ans, mon père 24", "Exemple : un mariage arrangé entre deux familles de fermiers", "Exemple : je ne sais pas, on n’en parle jamais", "Exemple : sur une application, à 30 ans, puis à 36 au travail"] },
            { q: "Comment a vécu leur couple : durée, séparation, non-dits, tendresse ?", ph: ["Exemple : séparés quand j’avais 8 ans, beaucoup de silences avant", "Exemple : 52 ans de mariage, mais ils faisaient chambre à part", "Exemple : mon grand-père est parti, ma grand-mère n’en a jamais reparlé", "Exemple : deux histoires de quatre ans, chaque fois je suis partie"] },
            { q: "Qu’est-ce qui te semble se répéter ?", ph: ["Exemple : la femme qui tient tout et l’homme qui s’éloigne", "Exemple : rester ensemble par devoir, pas par envie", "Exemple : un homme qui part sans explication", "Exemple : je pars avant d’être quittée, comme pour me protéger"] }
          ],
          apres: { k: 'ex1-repete', q: "Relis ton tableau. Qu’est-ce qui se répète d’un couple à l’autre, même un détail : un âge, un rôle, une façon de partir ou de rester ?", ph: "Exemple : dans chaque couple, c’est la femme qui porte la famille et l’homme qui est absent, d’une façon ou d’une autre." } },
        { k: 'voir-journal', titre: "Mon journal amoureux de la semaine", type: 'texte',
          consigne: "Chaque jour de la semaine, observe un couple autour de toi (dans ta famille, chez des amis, dans un film, dans la rue) ou ta propre façon d’aimer. Note la scène, ce qu’elle t’a fait ressentir, et si elle te rappelle quelque chose de ta famille. Vise au moins trois observations.",
          pourquoi: "Nos réactions face aux couples des autres, l’envie, l’agacement, la tristesse, parlent souvent de ce que l’on a vu enfant. Les noter t’aide à repérer tes vieux réflexes amoureux avant qu’ils ne décident pour toi.",
          q: "Ce que tu remarques, en général, dans ta façon d’aimer ou de réagir aux couples",
          ph: "Exemple : je me sens mal à l’aise quand un couple se montre très tendre en public, comme si c’était un peu interdit.",
          journal: { k: 'voir-sit', n: 6, q: "Chaque observation : le jour, la scène, ce que tu as ressenti, ce qu’elle te rappelle", ph: "Exemple : mercredi, au restaurant, un couple ne se parlait pas. J’ai eu un pincement : mes parents dînaient comme ça." } }
      ],
      conseil: "Si tu es seul·e en ce moment, ce mois est tout autant pour toi : tes histoires passées, ton célibat et tes envies font partie du tableau. Si un souvenir pèse trop, fais une pause, sors marcher, et reprends un autre jour." },

    { cle: 'source', nom: 'La source', etape: 'Remonter à la source', titre: "D’où vient ta façon d’aimer",
      intro: "Ta façon d’aimer s’est construite très tôt, au milieu des couples qui t’entouraient et des phrases que tu entendais. Cette semaine, tu remontes le fil, avec douceur, pour voir ce qui vient de toi et ce qui vient d’avant.",
      texte: [
        "En amour, les deux cycles se rencontrent souvent. Le **cycle de la racine** parle de sécurité : rester par peur de manquer, se marier pour avoir un toit, ne pas oser partir, ou au contraire ne jamais s’installer. Le **cycle du cœur** parle de lien : se sentir digne d’être aimé·e, faire confiance, poser ses limites sans peur de perdre l’autre.",
        "Un schéma de la racine ressemble souvent à « je reste parce que je n’ai pas le choix » ou « je ne m’installe jamais, au cas où ». Un schéma du cœur ressemble à « je donne tout pour être choisi·e » ou « je pars avant d’être quitté·e ». Les deux se mêlent, et c’est normal. On commence par la racine : tant qu’on ne se sent pas en sécurité, il est difficile d’aimer librement."
      ],
      exercices: [
        { k: 'source-arbre', titre: "Dans ton arbre, regarde les amours", type: 'questions',
          consigne: "Prends ces questions une par une. Si une réponse ne vient pas, passe à la suivante : elle viendra peut-être dans la semaine, en marchant ou sous la douche.",
          pourquoi: "Souvent, on découvre que notre histoire d’amour a déjà été vécue par quelqu’un avant nous, au même âge ou de la même façon. Le voir change tout : ce n’est plus « je ne sais pas aimer », c’est une histoire que je peux regarder et choisir de ne pas reprendre.",
          choix: { k: 'cycle', q: "Aujourd’hui, ton schéma amoureux touche surtout…", options: ['La racine : ma sécurité, rester ou partir', 'Le cœur : me sentir aimé·e, faire confiance', 'Les deux', 'Je ne sais pas encore'] },
          questions: [
            { k: 'source-parents', q: "Comment se sont rencontrés tes parents, et qu’est-ce qu’on t’en a raconté ?", ph: "Exemple : on m’a toujours dit qu’ils s’étaient mariés vite « parce qu’il le fallait ». Je n’ai jamais su pourquoi." },
            { k: 'source-durer', q: "Quels couples de ta famille ont duré, lesquels se sont défaits, et comment ?", ph: "Exemple : mes grands-parents paternels sont restés 50 ans, mais ma tante et ma mère ont divorcé toutes les deux vers 40 ans." },
            { k: 'source-phrases', q: "Quelles phrases sur l’amour as-tu entendues enfant, dites ou sous-entendues ?", ph: "Exemple : « Il faut se contenter de ce qu’on a. » « Les hommes ne restent pas. »" },
            { k: 'source-premier', q: "Y a-t-il dans ta lignée un premier amour oublié, une histoire qu’on n’a pas pu vivre ?", ph: "Exemple : ma grand-mère aimait un garçon parti à la guerre. Elle en a épousé un autre à son retour." },
            { k: 'source-protege', q: "Ta façon d’aimer t’a-t-elle protégé·e, à un moment ? De quoi ?", ph: "Exemple : partir la première m’a évité de revivre la douleur de ma mère quand mon père est parti." }
          ] },
        { k: 'source-question', titre: "Une question à ta famille", type: 'questions',
          consigne: "Pose une seule question à un membre de ta famille sur un couple de la lignée : comment ils se sont rencontrés, ce qu’ils aimaient faire ensemble, comment ils se parlaient. Par téléphone, à table ou par message. Choisis une question légère et chaleureuse. Pour t’aider : [les questions à poser à ta famille](questions-a-poser-a-sa-famille.html).",
          questions: [
            { k: 'source-qui', q: "À qui as-tu posé ta question, et laquelle ?", ph: "Exemple : à ma mère : « Comment as-tu rencontré papa, la toute première fois ? »", court: true },
            { k: 'source-reponse', q: "Qu’as-tu appris ? Qu’est-ce que ça te fait ?", ph: "Exemple : elle m’a dit qu’elle avait hésité avec un autre garçon qui voulait partir à Paris. Elle a choisi de rester. J’ai compris pourquoi elle me pousse tant à partir.", lignes: 3 }
          ] }
      ],
      conseil: "Tu peux ajouter dans [ton arbre familial](genosociogramme.html) les unions, séparations et premiers amours de ta lignée : l’outil repère les répétitions de dates et d’âges. Si une découverte te bouleverse, pose le stylo, respire, et reviens-y quand tu te sens prêt·e." },

    { cle: 'liberer', nom: 'Libérer', etape: 'Libérer', titre: "Rendre les histoires qui ne sont pas les tiennes",
      intro: "Chaque schéma amoureux a ses petites phrases, souvent entendues enfant, à table ou dans la cuisine. Cette semaine, tu attrapes tes phrases sur l’amour, tu regardes ce qu’elles ont protégé, et tu rends symboliquement aux couples d’avant toi ce qui leur appartient.",
      exercices: [
        { k: 'ex2', titre: "Les phrases sur l’amour", type: 'blocs', nb: 3,
          etiquettes: ['Première phrase', 'Deuxième phrase', 'Troisième phrase'],
          consigne: "Retrouve trois phrases sur l’amour ou le couple entendues dans ta famille, dites ou sous-entendues : « Les hommes ne restent pas », « Il faut savoir se sacrifier », « On ne divorce pas chez nous »… Pour chacune, note qui la disait et ce qu’elle protégeait à son époque. Puis écris la phrase que tu choisis aujourd’hui, avec tes mots.",
          pourquoi: "Ces phrases décident souvent à notre place, sans qu’on les entende. Comprendre ce qu’elles protégeaient permet de les remercier au lieu de les combattre, puis de les remplacer par une phrase vraie pour toi.",
          astuce: "Une bonne phrase de remplacement est vraie pour toi aujourd’hui. Pas « Je vais trouver l’amour parfait », mais « J’ai le droit d’être aimé·e sans tout donner ».",
          champs: [
            { q: "Quelle phrase sur l’amour as-tu entendue dans ta famille ?", ph: ["Exemple : « Les hommes, il ne faut pas trop compter dessus. »", "Exemple : « Dans la vie, on se contente de ce qu’on a. »", "Exemple : « L’amour, ça passe, ce qui reste c’est le devoir. »"] },
            { q: "Qui la disait, et que protégeait-elle à son époque ?", ph: ["Exemple : ma grand-mère, restée seule avec quatre enfants. Elle la protégeait de nouvelles déceptions.", "Exemple : ma mère, qui n’avait pas fait d’études. Elle la protégeait de la peur de manquer.", "Exemple : mon arrière-grand-mère, mariée sans amour. Elle la protégeait de ses regrets."] },
            { q: "Quelle phrase choisis-tu aujourd’hui, avec tes mots ?", ph: ["Exemple : « Je peux compter sur quelqu’un, et sur moi aussi. »", "Exemple : « J’ai le droit de vouloir un amour qui me rend heureuse. »", "Exemple : « L’amour peut durer, et le choix aussi. »"] }
          ] }
      ],
      rituel: {
        titre: "Le fil dénoué",
        intro: "Ce rituel symbolique marque le moment où tu rends aux couples de ta lignée leurs histoires, pour garder la liberté d’écrire la tienne. Fais-le une fois cette semaine, dans un moment calme, après avoir écrit tes phrases. Il dure environ dix minutes.",
        materiel: "Un fil de laine ou un ruban avec un nœud bien serré, ton carnet et un stylo. Si tu veux, une bougie allumée à côté de toi.",
        etapes: [
          "Installe-toi au calme et tiens le fil noué entre tes mains. Respire trois fois, lentement.",
          "Pense aux couples de ta lignée, ceux que tu connais et ceux que tu ignores, et dis : « Je vous reconnais, avec vos joies et vos peines. »",
          "Défais doucement le nœud, en prenant ton temps, en disant : « Je vous laisse votre histoire, avec respect. »",
          "Quand le fil est libre, dis : « Je garde ce que vous m’avez transmis de beau en amour : votre courage, votre fidélité, votre tendresse. »",
          "Tiens le fil libre dans ta main ouverte et dis : « Je choisis l’amour que je veux vivre. »",
          "Range le fil dans ton carnet ou dans une petite boîte, et note ci-dessous ce qui est venu."
        ],
        note: { k: 'rituel-note', q: "Après le rituel, note ce qui s’est passé : ce que tu as ressenti en défaisant le nœud, et ce que tu as choisi de garder.", ph: "Exemple : le nœud résistait, j’ai eu envie de tirer fort. J’ai pris mon temps. Je garde la fidélité de mes grands-parents, et je laisse la résignation." }
      },
      conseil: "Si le rituel réveille une tristesse ou une colère, c’est normal : tu touches à des histoires d’amour qui comptent. Fais une pause, bois un verre d’eau, sors respirer. Tu peux finir un autre jour. Ce qui compte, c’est d’avoir commencé." },

    { cle: 'remplacer', nom: 'Remplacer', etape: 'Remplacer', titre: "L’amour que tu choisis",
      intro: "Tu as vu les couples de ta lignée, tu sais d’où viennent certaines de tes façons d’aimer, tu as rendu ce qui ne t’appartenait pas. Cette semaine, tu écris l’amour que tu veux vivre, et tu poses un premier geste qui lui ressemble.",
      texte: [
        "**La première pause.** Quand tu sens la vieille réaction amoureuse arriver (te taire, te sur-adapter, fuir, attendre), respire : inspire lentement par le nez en comptant jusqu’à 5, retiens 2 secondes, expire par la bouche en comptant jusqu’à 7. Trois fois. Puis dis-toi intérieurement : « Je te reconnais. Ce n’est pas mon histoire. Aujourd’hui, je peux aimer autrement. »",
        "**Le geste qui ressemble à l’amour que tu veux.** Pas besoin d’un grand changement : un mot dit au lieu d’être tu, une demande, une limite douce, un moment de tendresse envers toi. Si tu es seul·e, le geste peut être pour toi, ou pour une relation d’amitié."
      ],
      exercices: [
        { k: 'remplacer-lettre', titre: "La lettre à l’amour", type: 'questions',
          consigne: "Écris une lettre à l’amour que tu veux vivre, que tu sois en couple ou non. Commence par « Cher amour que je veux vivre… ». Dis-lui ce que tu laisses aux couples d’avant toi, ce que tu gardes de beau, et ce que tu souhaites désormais. Termine par une phrase qui commence par « Je m’autorise à… ».",
          pourquoi: "On avance mieux vers une image claire qu’en fuyant ce qu’on ne veut plus. Écrire l’amour que tu souhaites lui donne une forme, et t’aide à le reconnaître quand il se présente, ou à le construire dans ta relation actuelle.",
          questions: [
            { k: 'lettre-laisse', q: "Que laisses-tu aux couples d’avant toi ?", ph: "Exemple : l’idée qu’il faut tout supporter pour garder quelqu’un.", court: true },
            { k: 'lettre-texte', q: "Ta lettre : ce que tu laisses, ce que tu gardes de beau, ce que tu souhaites, et ta phrase « Je m’autorise à… »", ph: "Exemple : Cher amour que je veux vivre, je laisse à ma grand-mère la peur d’être abandonnée. Je garde sa fidélité et sa force. Je te souhaite tendre, joyeux, et assez solide pour qu’on se dise les choses. Je m’autorise à être aimée sans avoir à tout donner.", lignes: 7 }
          ] },
        { k: 'ex3', titre: "Mon geste d’amour différent", type: 'texte',
          consigne: "Choisis un geste concret qui ressemble à l’amour que tu veux vivre, envers toi ou envers quelqu’un. Écris-le, puis note chaque fois que tu l’as posé, même maladroitement, et ce qui a changé. Ce geste rejoint aussi ton carnet « J’avance » : s’aimer d’abord, c’est déjà aimer autrement.",
          pourquoi: "Un schéma amoureux ne change pas avec une grande décision, mais avec de petits gestes répétés au moment précis où l’ancien réflexe se présente. Chaque essai affaiblit la vieille habitude.",
          gestes: ["Dire « j’ai été blessé·e » au lieu de faire comme si de rien n’était", "Demander ce dont tu as besoin, clairement", "Recevoir un geste tendre sans le rendre tout de suite", "Dire non à ce qui ne te convient pas, avec douceur", "T’offrir le dîner que tu attends qu’on t’offre", "Rester un peu, au lieu de partir à la première inquiétude"],
          q: "Ton geste : « La prochaine fois que mon vieux schéma amoureux démarre, au lieu de…, je vais… »",
          ph: "Exemple : au lieu de dire « ce n’est rien » quand il annule, je vais dire « je suis déçue, j’ai besoin qu’on se voie cette semaine ».",
          journal: { k: 'ex3-essais', n: 6, q: "Chaque fois que tu l’as essayé : quand, et qu’est-ce qui a changé ?", ph: "Exemple : samedi, j’ai dit à mon compagnon que j’avais besoin d’un câlin. Il me l’a donné tout de suite. Je n’avais jamais osé demander." } }
      ],
      conseil: "Si tu oublies et que le vieux schéma se rejoue, ce n’est pas raté : remarque-le après coup, c’est déjà un pas. Et rappelle-toi : aimer autrement ne veut jamais dire rester là où tu as peur. Si tu te sens en danger, ta sécurité passe d’abord : le 3919 est gratuit et anonyme." }
  ],

  meditation: {
    titre: "Le jardin des couples",
    intro: "Une séance guidée pour saluer les couples de ta lignée, leur laisser leurs histoires avec respect, et découvrir l’espace où pousse l’amour que tu veux vivre.",
    texte: [
      "Installe-toi confortablement, le dos soutenu, les pieds bien posés. Ferme les yeux, ou laisse ton regard se poser doucement devant toi. Respire profondément, trois fois…",
      "[pause]",
      "Sens le poids de ton corps sur le siège. Sens tes pieds sur le sol. Tu es en sécurité, ici et maintenant. Tu peux revenir à ton souffle à chaque instant.",
      "Imagine un grand jardin à la fin de l’hiver. L’air est frais, mais la lumière est plus douce qu’avant. Les premiers bourgeons apparaissent. Le long d’une allée, des couples se tiennent côte à côte : ce sont les couples de ta lignée.",
      "Tes parents, tes grands-parents, et plus loin, des couples que tu ne connais pas. Certains se tiennent la main, d’autres sont un peu éloignés, d’autres encore se tournent le dos. Certaines personnes sont seules : leur partenaire est parti, ou n’est jamais venu.",
      "[pause]",
      "Avance doucement dans l’allée. Salue chaque couple d’un regard. Tu n’as pas à les juger, ni à les comprendre entièrement. Ils ont aimé comme ils ont pu, avec ce qu’ils avaient reçu, à leur époque.",
      "Tu peux leur dire intérieurement : « Merci pour la vie. Je garde ce que vous avez vécu de beau. Je vous laisse vos histoires, et je vais vers la mienne. »",
      "[longue pause]",
      "Au bout de l’allée, un espace libre t’attend, baigné de lumière. C’est là que se dessine l’amour que tu veux vivre. Observe ce qui y pousse : des fleurs, un arbre, une herbe tendre. Il n’y a rien à forcer.",
      "Sens la douceur, la confiance, la place que tu y prends. Tu as le droit d’aimer à ta façon, et d’être aimé·e comme tu le souhaites. Tu as aussi le droit de partir de tout endroit où tu ne te sens pas bien.",
      "[pause]",
      "Respire profondément. Sens à nouveau ton corps, le sol, l’air autour de toi. Bouge doucement les doigts, les épaules. Et quand tu es prêt·e, ouvre les yeux."
    ],
    conseil: "Choisis un moment où personne ne te dérangera pendant dix minutes, le soir avant de dormir ou un dimanche matin. Si une émotion forte monte, ouvre les yeux, pose tes pieds bien à plat et respire : tu peux arrêter la séance à tout moment et la reprendre un autre jour.",
    note: { k: 'medit-note', q: "Qu’est-ce qui t’est venu pendant la séance ? Un couple, une image, une sensation, un mot…", ph: "Exemple : mes grands-parents se tenaient la main, alors que je ne les ai jamais vus faire. Dans mon espace, il y avait un cerisier." }
  },

  bilanTitre: "Ce que ce mois a libéré en amour",
  bilan: [
    { k: 'fin-schema', q: "Quel schéma amoureux as-tu repéré ce mois-ci ?", ph: "Exemple : partir avant d’être quittée, dès que la relation devient sérieuse." },
    { k: 'fin-origine', q: "Qu’as-tu compris de son origine, dans les couples de ta lignée ?", ph: "Exemple : ma grand-mère et ma mère ont toutes les deux été quittées vers 40 ans. J’ai appris à partir la première pour ne pas vivre ça." },
    { k: 'fin-laisse-couples', q: "Qu’as-tu laissé aux couples de ta lignée, et qu’est-ce que tu ressens depuis ?", ph: "Exemple : la peur d’être abandonnée. Je me sens plus calme quand mon compagnon est en retard." },
    { k: 'fin-garde-beau', q: "Qu’as-tu choisi de garder de beau en amour ?", ph: "Exemple : la fidélité de mes grands-parents, et l’humour de mon père." },
    { k: 'fin-intention', q: "Qu’aimerais-tu continuer à libérer en mars ?", ph: "Exemple : continuer à dire ce que je ressens au lieu de me taire, et regarder ma place parmi mes sœurs.", court: true }
  ],

  carnet: {
    titre: "M’aimer d’abord",
    texte: "Ce que tu libères ici nourrit ce que tu construis là-bas. On aime souvent les autres comme on a appris à s’aimer : ton carnet t’aide ce mois-ci à te traiter avec tendresse, à écouter tes besoins, et à t’offrir chaque jour un geste qui te dit que tu comptes. Reporte ton geste d’amour différent dans ton carnet, il devient un appui."
  },

  aVenir: [
    { mois: 'Mars', titre: 'Ta place dans la fratrie', texte: "Regarder la place que tu as reçue parmi tes frères et sœurs, et choisir celle que tu veux habiter aujourd’hui.", image: 'assets/cartes/ma-place-mini.jpg' },
    { mois: 'Avril', titre: 'Les secrets et les non-dits', texte: "Écouter les silences de ta famille, repérer les indices, et oser, à ton rythme, poser une question.", image: 'assets/cartes/ce-silence-mini.jpg' },
    { mois: 'Mai', titre: 'Ta mère, tes mères', texte: "Regarder ce que tu as reçu de ta mère et des femmes de ta lignée, garder le meilleur et faire autrement.", image: 'assets/cartes/ma-mere-mini.jpg' }
  ]
};
