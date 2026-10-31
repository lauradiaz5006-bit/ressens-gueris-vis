/* Genesolia · Le Cercle · « Mon corps » : une pratique du corps chaque semaine, sur les 12 étapes du carnet Renaissance.
   Le moteur est dans assets/mon-carnet.js (page « Mon corps », avant « Mon bilan du mois »).
   Écrire une étape : etapes[N] = 4 semaines { titre, pourquoi, pratique: [étapes], ecoute, magie }.
   Vocabulaire : libérer, relâcher, apaiser, mémoire du corps. Jamais de mots de soin. */
window.CORPS_CERCLE = {
  objectif: 'Au bout d’un an : reconnaître ton corps, écouter ton intuition, sentir les énergies autour de toi et faire la différence avec les tiennes, avoir un vrai discernement.',
  principe: 'Ton corps garde la mémoire de ce que tu as vécu, et parfois de ce que ta lignée a vécu. Comprendre ouvre la porte ; ton corps, lui, la traverse. Chaque semaine, tu l’écoutes, tu le comprends, puis tu le libères, un petit geste chaque jour.',
  phases: [
    { de: 1, a: 3, nom: 'Reconnaître', texte: 'Sentir ton corps, repérer où il se tend, faire la différence entre fatigue, émotion et tension.' },
    { de: 4, a: 6, nom: 'Écouter', texte: 'Relier une sensation à une émotion, entendre ce que ton corps sait avant toi.' },
    { de: 7, a: 9, nom: 'Libérer', texte: 'Laisser partir ce qui ne t’appartient plus : à toi ou à ta lignée.' },
    { de: 10, a: 12, nom: 'Discerner', texte: 'Sentir tes énergies et celles des autres, et suivre ton intuition comme une boussole.' }
  ],
  zones: ['La tête', 'La mâchoire', 'La gorge', 'Les épaules', 'La poitrine', 'Le plexus', 'Le ventre', 'Le dos', 'Les bras et les mains', 'Les jambes et les pieds', 'Partout', 'Je ne sens rien de précis'],
  emotions: ['Calme', 'Fatigue', 'Tristesse', 'Peur', 'Colère', 'Honte', 'Vide', 'Joie', 'Je ne sais pas'],
  tropPlein: {
    titre: 'Libérer un trop-plein',
    intro: 'Quand ça déborde, quand ton corps est trop chargé, à n’importe quel moment de la semaine. Deux façons, prends celle qui te parle.',
    demander: 'Pose la main là où ça pèse. Respire trois fois, lentement. Puis demande, à voix basse ou dans ton cœur : « Je demande à mon guide, à ma lumière, ou à ce en quoi je crois, de libérer ce trop-plein de mon corps, avec douceur. » Reste quelques instants, et laisse faire.',
    concret: 'Debout, souffle longuement par la bouche, plusieurs fois, en imaginant que ce trop-plein descend par tes jambes et s’en va dans la terre. Secoue tes mains, puis passe-les sous l’eau fraîche quelques secondes.'
  },
  etapes: {
    1: [
      { titre: 'Sentir que j’ai un corps',
        pourquoi: 'On vit souvent dans sa tête. Le corps, lui, parle tout bas, et on ne l’entend que quand il crie. Cette semaine, tu lui donnes rendez-vous chaque soir.',
        pratique: ['Le soir, allongé·e ou assis·e, ferme les yeux.', 'Promène ton attention des pieds jusqu’à la tête, lentement, comme une lumière douce qui remonte.', 'Arrête-toi là où c’est tendu, lourd ou serré. Juste le remarquer, sans rien changer.', 'Note la zone la plus tendue de la journée.'],
        ecoute: 'Quelle zone t’a appelé·e le plus souvent cette semaine ?' },
      { titre: 'Le souffle long',
        pourquoi: 'Quand l’expiration est plus longue que l’inspiration, le corps reçoit un message simple : tu peux te poser. C’est le chemin du calme, celui que l’on relie au nerf vague.',
        pratique: ['Pose une main sur ton cœur.', 'Inspire par le nez sur 4 temps.', 'Expire doucement par la bouche sur 8 temps, comme si tu soufflais sur une bougie sans l’éteindre.', 'Recommence pendant 3 minutes, le soir ou dès que tu te sens en alerte.'],
        ecoute: 'Qu’est-ce qui change dans ton corps après ces 3 minutes ?',
        magie: 'Imagine que ta main sur le cœur envoie une chaleur douce qui se répand dans ta poitrine.' },
      { titre: 'Fatigue, émotion ou tension ?',
        pourquoi: 'Tout se mélange quand on ne sait pas lire son corps. Apprendre à faire la différence, c’est déjà savoir de quoi tu as besoin : du repos, de l’écoute, ou du mouvement.',
        pratique: ['Chaque soir, demande-toi ce que tu sens vraiment.', 'Un corps lourd, qui veut s’allonger : c’est de la **fatigue**. Il a besoin de repos.', 'Un serrement, une boule, une vague : c’est une **émotion**. Elle a besoin d’être accueillie.', 'Une raideur, un muscle dur, une mâchoire serrée : c’est une **tension**. Elle a besoin de bouger.', 'Note ce qui dominait aujourd’hui.'],
        ecoute: 'Qu’est-ce qui revenait le plus : la fatigue, l’émotion ou la tension ?' },
      { titre: 'Les pieds et les jambes',
        pourquoi: 'Les jambes et les pieds portent tout le poids de la journée, et souvent l’envie de fuir ou de tenir bon. Les détendre, c’est dire à ton corps qu’il peut lâcher.',
        pratique: ['Le soir, assis·e, pose sous ton pied une balle de tennis, un ballon de motricité à picots, ou un rouleau.', 'Fais-le rouler doucement sous toute la plante du pied, une minute par pied.', 'Puis passe-le sur tes mollets et tes jambes, en appuyant juste ce qu’il faut.', 'Respire longuement pendant ce temps, 5 minutes en tout.'],
        ecoute: 'Que ressens-tu dans tout ton corps quand tes jambes se relâchent ?' }
    ],
    2: [
      { titre: 'L’ancrage et ta bulle de lumière',
        pourquoi: 'S’ancrer, c’est revenir ici, dans ton corps, sur le sol. Et quand tu es bien ancré·e, tu peux te sentir protégé·e, comme dans une bulle à toi.',
        pratique: ['Le matin, debout pieds nus, sens le sol sous tes pieds pendant 2 minutes. Ton poids descend, tu es porté·e.', 'Lève lentement les bras sur les côtés, puis au-dessus de ta tête, comme pour dessiner une grande bulle autour de toi.', 'Imagine cette bulle remplie d’une lumière douce, qui te protège et te laisse respirer.', 'Redescends les bras doucement, et garde la sensation de ta bulle pour la journée.'],
        ecoute: 'Comment te sens-tu dans ta bulle ? Plus calme, plus forte, plus présente ?',
        magie: 'Choisis la couleur de ta bulle : celle qui te vient en premier est souvent la bonne.' },
      { titre: 'Mes zones ressources',
        pourquoi: 'Le corps n’est pas seulement là où ça fait mal. Il a aussi des zones qui vont bien, calmes, solides. Les trouver, c’est te donner des appuis.',
        pratique: ['Chaque jour, cherche une partie de ton corps qui va bien : tes mains, tes pieds, ton ventre, ton front.', 'Pose la main dessus et sens ce qui est calme, chaud, solide.', 'Respire trois fois en laissant cette sensation s’étendre un peu plus loin.'],
        ecoute: 'Quelle est ta zone ressource préférée ?' },
      { titre: 'Le dos et ce que je porte',
        pourquoi: 'On dit « en avoir plein le dos ». Le dos porte les charges, les siennes et parfois celles de la famille. Cette semaine, tu lui offres un peu de douceur.',
        pratique: ['Allongé·e sur le dos, genoux pliés, pieds à plat.', 'Berce doucement ton bassin de droite à gauche, comme une vague, pendant 2 minutes.', 'Puis ramène tes genoux contre ta poitrine, et respire dans ton dos.', 'Demande-toi : qu’est-ce que je porte qui n’est pas à moi ?'],
        ecoute: 'Qu’est-ce que ton dos porte, à toi ou à ta lignée ?' },
      { titre: 'Secouer pour relâcher',
        pourquoi: 'Après un danger, les animaux tremblent pour évacuer la peur, puis repartent. Nous, nous l’avons oublié : la peur reste dans le corps. Secouer, c’est la laisser sortir.',
        pratique: ['Debout, les genoux souples.', 'Secoue tes mains, puis tes bras, tes épaules, tes jambes, comme si tu voulais faire tomber des gouttes d’eau.', 'Pendant 2 minutes, laisse ton corps bouger comme il veut, même en souriant.', 'Puis arrête-toi, ferme les yeux, et sens ce qui circule.'],
        ecoute: 'Que sens-tu circuler dans ton corps quand tu t’arrêtes ?',
        magie: 'Ce qui circule après, c’est ton énergie qui se remet en mouvement.' }
    ],
    3: [
      { titre: 'Sentir l’énergie entre mes mains',
        pourquoi: 'Avant de sentir l’énergie des autres, on commence par sentir la sienne. C’est simple, et souvent surprenant.',
        pratique: ['Frotte tes mains l’une contre l’autre pendant 20 secondes, jusqu’à ce qu’elles soient chaudes.', 'Écarte-les doucement de quelques centimètres, paumes face à face.', 'Rapproche-les et éloigne-les très lentement : sens la chaleur, les picotements, comme une petite boule entre elles.', 'Pose ensuite tes mains là où ton corps en a besoin.'],
        ecoute: 'Qu’as-tu senti entre tes mains ? Chaleur, picotements, rien encore ?',
        magie: 'Ce que tu sens entre tes mains, c’est ton énergie. Elle grandit à mesure que tu la remarques.' },
      { titre: 'Ce qui est à moi, ce qui ne l’est pas',
        pourquoi: 'Après certaines rencontres, on se sent lourd·e, triste ou énervé·e sans raison. Parfois, ce n’est pas à toi : ton corps a pris l’émotion de l’autre.',
        pratique: ['Avant une rencontre, note comment tu te sens dans ton corps, de 0 à 10.', 'Après, note-le de nouveau. Si quelque chose a changé, demande-toi : est-ce à moi ?', 'Si ce n’est pas à toi, secoue tes mains, passe-les sous l’eau fraîche et dis : « Je rends ce qui ne m’appartient pas. »'],
        ecoute: 'Avec qui ton corps change-t-il le plus ?' },
      { titre: 'La mâchoire et les épaules',
        pourquoi: 'La mâchoire serre ce qu’on ne dit pas, les épaules montent sous ce qu’on porte. Les relâcher, c’est faire de la place à ta parole.',
        pratique: ['Ouvre grand la bouche, comme pour bâiller, trois fois.', 'Masse doucement tes mâchoires du bout des doigts, en petits cercles.', 'Monte les épaules jusqu’aux oreilles en inspirant, puis laisse-les tomber d’un coup en soupirant.', 'Recommence cinq fois.'],
        ecoute: 'Qu’est-ce que tu retiens de dire, en ce moment ?' },
      { titre: 'Le oui et le non dans le corps',
        pourquoi: 'Ton corps sait avant toi. Face à une demande, ton cœur, ton plexus et ta posture s’ouvrent ou se ferment. Apprendre à le sentir, c’est le début du discernement.',
        pratique: ['Pense à une demande qu’on t’a faite. Pose une main sur ton cœur, l’autre sur ton plexus (le creux sous la poitrine).', 'Sens : est-ce que ça s’ouvre, s’élargit, se réchauffe ? Ou est-ce que ça se serre, se ferme, se rétracte ?', 'Regarde aussi ta posture : tu te penches vers l’avant, ou tu recules ? Tes bras s’ouvrent, ou se croisent ?', 'Puis dis « non » à voix haute en poussant doucement les mains devant toi. Sens comme ton corps se redresse.'],
        ecoute: 'Ton corps et ta réponse étaient-ils d’accord cette semaine ?',
        magie: 'Cette ouverture ou cette fermeture dans ta poitrine, c’est ton intuition qui te parle. Plus tu l’écoutes, plus elle devient claire.' }
    ]
  }
};
