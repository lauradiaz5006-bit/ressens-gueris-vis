/* Genesolia · textes du livret de l'arbre de vie (chargés seulement au moment de créer le livret) */
window.LIVRET_ARBRE = {
  origine: [
    "L'arbre de vie est l'un des plus anciens symboles de l'humanité. On le retrouve sur les sceaux de Mésopotamie, dans les temples d'Égypte, dans l'Yggdrasil des peuples du Nord qui relie le ciel, la terre et le monde d'en bas, dans le Ceiba sacré des Mayas, dans l'arbre de la Bodhi sous lequel le Bouddha s'est éveillé, et dans le jardin de la Genèse. Partout, la même intuition : une vie humaine pousse comme un arbre, avec des racines qui la nourrissent, un tronc qui la tient debout et des branches qui cherchent la lumière.",
    "La forme utilisée ici, dix sphères reliées par vingt-deux chemins, s'est fixée au Moyen Âge, notamment dans la tradition de la Kabbale, avant d'être reprise par la Renaissance, les philosophes, puis la psychologie et le développement personnel. Chaque sphère porte un nom hébreu ancien et décrit une manière d'être au monde : l'ancrage, les liens, la parole, la persévérance, le cœur, les limites, la générosité, la compréhension, l'intuition et le sens.",
    "Genesolia en propose une lecture symbolique et laïque, pensée pour réfléchir à ton histoire. Elle ne demande aucune croyance. Elle ne dit pas qui tu es : elle t'aide à voir où tu en es aujourd'hui, et où tu as envie d'aller."
  ],
  lire: [
    "L'arbre se lit de bas en haut. Les sphères du bas parlent de ce qui te tient debout : ta place, ta sécurité, tes liens, ta façon de dire et de persévérer. Ce sont les sphères du cycle de la racine. Au milieu, autour du cœur, se jouent l'amour que tu donnes, les limites que tu poses et l'équilibre entre les deux : c'est le cycle du cœur. En haut, les sphères de l'élan parlent de tes idées, de ta compréhension du monde et du sens que tu donnes à ta vie.",
    "Chaque sphère reçoit un score de 0 à 100 à partir de tes réponses. Un score n'est ni une note ni un jugement. Une sphère « lumineuse » est une ressource sur laquelle tu peux t'appuyer. Une sphère « en mouvement » est en train de changer. Une sphère « à nourrir » demande un peu d'attention, souvent parce qu'une vieille protection, parfois héritée de ta famille, l'a mise en veille.",
    "L'arbre bouge avec toi. Refais le test dans un mois, dans trois mois, après un événement important : ton espace garde chaque résultat avec sa date, pour que tu voies ton chemin."
  ],
  piliers: {
    intro: "Les sphères s'organisent en trois colonnes, que l'on appelle traditionnellement les piliers. Leur équilibre dit beaucoup de ta façon d'avancer.",
    gauche: { nom: 'Le pilier de la structure', spheres: ['bina', 'guevoura', 'hod'], texte: "Comprendre, poser des limites, mettre des mots. C'est la colonne de la forme et de la protection. Quand elle domine, on contrôle, on analyse, on se protège. Quand elle manque, on se laisse déborder." },
    droite: { nom: "Le pilier de l'élan", spheres: ['hokhma', 'hessed', 'netsah'], texte: "Les idées, la générosité, la persévérance. C'est la colonne du mouvement et du don. Quand elle domine, on donne et on fonce, parfois jusqu'à s'épuiser. Quand elle manque, on hésite à se lancer." },
    centre: { nom: "Le pilier de l'équilibre", spheres: ['keter', 'tiferet', 'yessod', 'malkhout'], texte: "Le sens, le cœur, les liens, l'ancrage. C'est la colonne qui relie le haut et le bas. Elle se nourrit quand les deux autres s'équilibrent." }
  },
  spheres: {
    malkhout: {
      sens: "Malkhout est la sphère du bas, celle qui touche la terre. Elle parle de ta place dans le monde concret : ton toit, ton argent, ton travail, ton rapport au quotidien. C'est la base de l'arbre : quand elle est solide, tout le reste peut pousser.",
      lumineuse: "Tu te sens globalement à ta place dans ta vie matérielle. Tu sais que tu peux faire face, et cette confiance te laisse de l'énergie pour le reste. C'est une ressource précieuse : elle te permet de prendre des risques mesurés et d'aider les autres sans te mettre en danger.",
      mouvement: "Ta sécurité matérielle bouge en ce moment. Peut-être un changement de travail, de logement, ou simplement une prise de conscience de ce qui te rassure vraiment. C'est un moment pour distinguer les peurs d'hier de la réalité d'aujourd'hui.",
      famille: ["Quelqu'un, dans ma lignée, a-t-il tout perdu : une maison, une terre, un pays ?", "Comment parlait-on d'argent chez moi : avec peur, avec honte, avec fierté, jamais ?", "Quelle phrase sur le travail ou l'argent ai-je entendue enfant ?"],
      exercice: "Pendant sept jours, chaque soir, note une chose concrète qui t'a fait te sentir en sécurité dans la journée : un repas, un salaire versé, une porte qui ferme bien, une personne sur qui compter.",
      phrase: "J'ai le droit d'être là, et d'avoir ce dont j'ai besoin."
    },
    yessod: {
      sens: "Yessod, juste au-dessus de Malkhout, est la sphère des liens et des émotions. Elle parle de la manière dont tu t'attaches, de ce que tu ressens dans tes relations, et des histoires qui se répètent d'une relation à l'autre.",
      lumineuse: "Tes relations te nourrissent. Tu sais t'entourer, et tu reconnais les liens qui te font du bien. C'est un socle affectif sur lequel tu peux t'appuyer quand la vie se complique.",
      mouvement: "Tes liens sont en train de changer. Tu remarques peut-être des schémas que tu ne voyais pas avant, ou tu prends tes distances avec des relations qui te coûtaient. Ce mouvement est souvent inconfortable, et souvent fécond.",
      famille: ["Comment mes parents se sont-ils aimés, et comment se sont-ils quittés ou retrouvés ?", "Qui, dans ma famille, est resté seul, ou a été quitté ?", "Quelle façon d'aimer ai-je vue autour de moi enfant ?"],
      exercice: "Écris tes trois dernières relations importantes, amoureuses ou amicales. Pour chacune, note comment elle a commencé, ce que tu y as donné, et comment elle a fini. Souligne ce qui revient.",
      phrase: "Je peux aimer sans rejouer la même histoire."
    },
    hod: {
      sens: "Hod est la sphère de la pensée et des mots. Elle parle de ta façon de comprendre ce qui t'arrive, de le nommer et de le dire aux autres. C'est aussi la sphère des non-dits, de ce qu'on garde pour soi.",
      lumineuse: "Tu trouves les mots pour dire ce que tu vis. Tu sais expliquer, nuancer, demander. Cette clarté protège tes relations : les malentendus durent moins longtemps avec toi.",
      mouvement: "Ta parole est en train de se libérer. Tu oses dire des choses que tu taisais, même maladroitement. Laisse-toi le droit de chercher tes mots : c'est en parlant qu'on apprend à parler.",
      famille: ["Qu'est-ce qui ne se disait pas, chez moi ?", "Y a-t-il un secret de famille, ou un sujet qui fâchait toujours ?", "Qui avait le droit de parler à table, et qui se taisait ?"],
      exercice: "Écris une lettre que tu n'enverras pas, à une personne à qui tu n'as jamais tout dit. Commence par « Ce que je n'ai jamais osé te dire, c'est… ». Garde-la ou brûle-la, comme tu le sens.",
      phrase: "Ce que je ressens a le droit d'être dit."
    },
    netsah: {
      sens: "Netsah est la sphère de la persévérance et du désir. Elle parle de ton énergie pour aller au bout, de ton envie, de ce qui te fait tenir quand le projet devient difficile.",
      lumineuse: "Tu vas au bout de ce que tu commences. Ton désir est vivant, et il te porte. Cette constance est une force rare : elle transforme les idées en réalisations.",
      mouvement: "Ton énergie se cherche. Tu sens peut-être que tes envies changent, ou que tu as besoin de projets qui te ressemblent davantage. C'est un bon moment pour faire le tri entre ce que tu veux vraiment et ce que tu dois.",
      famille: ["Qui, dans ma famille, a dû renoncer à son rêve ?", "Que disait-on de ceux qui voulaient « trop » ?", "Ai-je vu quelqu'un réussir, puis tout lâcher ?"],
      exercice: "Choisis un seul projet, même tout petit. Donne-lui cinq minutes par jour pendant quatorze jours, et coche chaque jour sur un calendrier. Ne vise pas la perfection, vise la régularité.",
      phrase: "J'ai le droit de désirer, et d'aller au bout."
    },
    tiferet: {
      sens: "Tiferet est au centre de l'arbre. C'est la sphère du cœur et de l'équilibre, là où se rejoignent toutes les autres. Elle parle de l'accord entre ce que tu fais et ce que tu es.",
      lumineuse: "Tu te sens en accord avec la vie que tu mènes. Tu sais qui tu es, et tes choix te ressemblent. Ce centre solide rayonne sur tout l'arbre.",
      mouvement: "Ton centre se réaligne. Tu remets peut-être en question un rôle, un métier, une façon de vivre. Ce n'est pas une crise : c'est le cœur qui cherche à prendre sa vraie place.",
      famille: ["Quel rôle avais-je dans ma famille : la sage, le rigolo, celle qui aide, celui qui répare ?", "Qui ai-je été « à la place de » ?", "Quel métier ou quel destin attendait-on de moi ?"],
      exercice: "Pendant une semaine, repère chaque jour un moment où tu te sens pleinement toi-même. Note où tu étais, avec qui, et ce que tu faisais. À la fin de la semaine, relis : c'est la carte de ton cœur.",
      phrase: "Je n'ai pas à jouer un rôle pour être aimé·e."
    },
    guevoura: {
      sens: "Guevoura est la sphère des limites et de la force. Elle parle de ta capacité à dire non, à te protéger, à choisir ce que tu laisses entrer dans ta vie.",
      lumineuse: "Tu poses tes limites sans culpabilité. Tu sais dire non, et ton non rend ton oui plus précieux. Les autres savent où tu en es, et c'est une forme de respect pour eux comme pour toi.",
      mouvement: "Tu apprends à dire non. Les premières fois sont souvent maladroites, trop douces ou trop brusques. C'est normal : une limite, ça se règle avec le temps.",
      famille: ["Qui avait le droit de dire non chez moi, et qui devait obéir ?", "Que se passait-il quand quelqu'un se mettait en colère ?", "Ai-je appris qu'il fallait faire plaisir pour être aimé·e ?"],
      exercice: "Choisis cette semaine une petite situation sans enjeu, et dis ce que tu préfères avec une phrase qui commence par « je » : « je préfère », « je n'ai pas envie », « je ne peux pas ce soir ». Observe ce qui se passe.",
      phrase: "Mon non protège ce à quoi je dis oui."
    },
    hessed: {
      sens: "Hessed est la sphère de la générosité. Elle parle de l'amour que tu donnes, de ta bienveillance, de ta façon de prendre soin des autres. Elle se nourrit aussi de ta capacité à recevoir.",
      lumineuse: "Tu donnes avec plaisir, sans attendre en retour. Ta générosité est libre, et elle fait du bien autour de toi. Tu sais aussi recevoir, ce qui garde l'échange vivant.",
      mouvement: "Ta façon de donner change. Tu remarques peut-être que tu donnais pour être aimé·e, et tu cherches une générosité plus juste, qui ne t'épuise pas.",
      famille: ["Qui, dans ma famille, s'est oublié pour les autres ?", "Recevait-on facilement des cadeaux, de l'aide, des compliments chez moi ?", "Qu'attendait-on en retour, sans le dire ?"],
      exercice: "Cette semaine, accepte trois fois de recevoir quelque chose (un compliment, une aide, un cadeau) en disant seulement « merci », sans te justifier ni rendre tout de suite.",
      phrase: "Je peux donner sans m'oublier, et recevoir sans me sentir redevable."
    },
    bina: {
      sens: "Bina est la sphère de la compréhension et de la structure. Elle parle de ta capacité à prendre du recul, à organiser, à donner une forme aux choses pour qu'elles deviennent claires.",
      lumineuse: "Tu prends le temps de comprendre avant d'agir. Tu sais mettre de l'ordre dans le chaos, et les autres viennent souvent chercher ton avis. Cette clarté est un phare.",
      mouvement: "Ta façon de comprendre le monde évolue. De vieilles certitudes tombent, d'autres arrivent. Laisse-toi le temps de reconstruire un cadre qui te ressemble.",
      famille: ["Comment ma famille expliquait-elle les malheurs : la faute à pas de chance, à quelqu'un, à soi ?", "Avait-on le droit de poser des questions chez moi ?", "Quelle histoire de famille ne comprends-je toujours pas ?"],
      exercice: "Prends la situation qui t'occupe le plus en ce moment, et écris-la en trois colonnes : les faits, ce que je ressens, ce que je peux faire. Relis-la le lendemain.",
      phrase: "Je peux comprendre sans tout contrôler."
    },
    hokhma: {
      sens: "Hokhma est la sphère de l'intuition et des idées qui jaillissent. Elle parle de ta créativité, de ta confiance dans tes inspirations, de cet éclair qui précède la réflexion.",
      lumineuse: "Tu fais confiance à tes intuitions. Les idées te viennent, et tu oses les suivre. Cette source créative nourrit tout ce que tu entreprends.",
      mouvement: "Ta créativité se réveille. Des idées reviennent, parfois anciennes. Note-les sans les juger : toutes ne sont pas à réaliser, mais toutes disent quelque chose de toi.",
      famille: ["Quelqu'un, dans ma famille, avait-il un talent qu'il n'a jamais exprimé ?", "Valorisait-on l'imagination chez moi, ou seulement le sérieux ?", "Quelle idée ai-je abandonnée parce qu'on m'a dit que ce n'était pas raisonnable ?"],
      exercice: "Pendant sept jours, garde un carnet près de toi et note chaque intuition, chaque idée, même la plus folle. Ne juge rien. À la fin de la semaine, entoure celle qui te fait sourire.",
      phrase: "Mes idées ont le droit d'exister avant d'être parfaites."
    },
    keter: {
      sens: "Kéter est la sphère du haut, la couronne de l'arbre. Elle parle du sens de ta vie, de ce qui te met en mouvement profondément, de cette part de toi qui dépasse le quotidien.",
      lumineuse: "Tu sais ce qui donne du sens à ta vie. Cette boussole intérieure t'oriente dans les choix difficiles et donne une cohérence à ton chemin.",
      mouvement: "Le sens de ta vie se redessine. Ce qui comptait hier compte peut-être moins aujourd'hui. Ce passage peut donner le vertige : il prépare souvent un élan plus juste.",
      famille: ["Pour quoi mes grands-parents vivaient-ils : la famille, la terre, la foi, le travail ?", "Quel idéal a-t-on transmis dans ma famille ?", "Qu'est-ce qui donnait de la joie à ma mère, à mon père ?"],
      exercice: "Écris la réponse à cette question, sans réfléchir trop longtemps : « Si personne ne m'attendait, que ferais-je de mes journées ? » Puis offre dix minutes cette semaine à l'une de ces réponses.",
      phrase: "Ma vie a un sens, même quand je ne le vois pas encore."
    }
  },
  semaines: [
    ["Semaine 1 · Observer", "Relis la sphère à nourrir en premier. Chaque soir, note un moment où tu l'as sentie en jeu dans ta journée. Ne cherche rien à changer : regarde seulement."],
    ["Semaine 2 · Comprendre", "Pose les trois questions de famille de cette sphère à une personne de ta lignée, ou réponds-y par écrit si ce n'est pas possible. Note ce qui te surprend."],
    ["Semaine 3 · Agir", "Fais l'exercice proposé pour cette sphère. Un petit geste répété vaut mieux qu'un grand changement qui ne tient pas."],
    ["Semaine 4 · Ancrer", "Relis tes notes du mois. Refais le test de l'arbre de vie, et compare dans ton espace. Choisis la sphère suivante à nourrir."]
  ]
};
