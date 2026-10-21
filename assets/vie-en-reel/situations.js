/* Genesolia · « Ta vie en réel » : toutes les situations, au même endroit.
   ─────────────────────────────────────────────────────────────────────
   POUR AJOUTER LA SITUATION DE LA SEMAINE : copie un bloc { … } de la liste NOUVELLES ci-dessous, colle-le en haut de la liste,
   et change les textes. La page affiche toute seule, en « Cette semaine », la situation dont la date « semaine » (un lundi)
   est la plus récente déjà arrivée. Tu peux donc en préparer plusieurs d'avance : elles apparaîtront chacune leur lundi.

   Les champs :
     id        : un mot unique, en minuscules, avec des tirets (il sert aussi au vote et au lien direct ta-vie-en-reel.html#id)
     semaine   : le lundi où elle devient « la situation de la semaine », au format 'AAAA-MM-JJ'
     themes    : un ou plusieurs parmi 'amour', 'parents', 'argent', 'travail', 'amitie', 'enfants', 'place'
     titre     : la phrase qu'on se dit, telle qu'on la pense
     sms       : l'échange type SMS : [['moi', '…'], ['autre', '…'], …]  ('moi' à droite, 'autre' à gauche)
     joue      : ce qui se joue
     lignee    : ce qui se rejoue peut-être dans la famille
     geste     : un geste pour aujourd'hui
     mots      : les mots pour le dire (copiables)
     famille   : une question à poser dans sa famille (copiable)
     question  : la question de la semaine (reliée au fil d'or)
     pratique  : (phase 2, laisser vide) un geste de 2 minutes
   Règles d'écriture : tutoiement, point médian, pas d'emoji, pas de flèche, aucun mot de santé (guérison, thérapie, soin, trauma…). */
(function () {
  var NOUVELLES = [
    {
      id: 'me-comparer', semaine: '2027-01-25', themes: ['place', 'amitie'],
      titre: 'Je me compare tout le temps aux autres, et je perds à chaque fois',
      sms: [['autre', 'Tu as vu ? Léa a acheté une maison et elle attend son deuxième.'], ['moi', 'Oui, j’ai vu. Génial pour elle.'], ['moi', '(et moi, je n’ai rien fait de ma vie)']],
      joue: 'Une photo, une nouvelle, et tout ce que tu as construit disparaît d’un coup. Tu ne te compares jamais à ce que tu étais il y a un an, toujours à ce que les autres montrent de mieux. Derrière cette comparaison, il y a souvent une vieille question : est-ce que je suis à la hauteur ?',
      lignee: 'Dans ta famille, on te comparait à qui ? Un frère, une sœur, une cousine « qui réussissait » ? Et tes parents, à qui les comparait-on, eux ? Les comparaisons se transmettent comme une mesure qu’on n’a pas choisie.',
      geste: 'Écris trois choses que tu sais faire aujourd’hui et que tu ne savais pas faire il y a un an. Même petites. Surtout petites.',
      mots: 'Je me rends compte que je me compare beaucoup en ce moment. Tu veux bien me dire ce que tu vois, toi, de ce que j’ai construit ?',
      famille: 'Maman, quand j’étais petite, est-ce qu’on me comparait à quelqu’un ? Et toi, on te comparait à qui ?',
      question: 'Dans ta lignée, qui a été comparé·e à un frère ou une sœur, et qu’est-ce que ça a laissé ?',
      pratique: ''
    },
    {
      id: 'oui-a-tout-au-travail', semaine: '2027-01-18', themes: ['travail', 'place'],
      titre: 'Je dis oui à tout au travail, et je n’en peux plus',
      sms: [['autre', 'Tu pourrais reprendre le dossier de Marc ? Il est débordé.'], ['moi', 'Oui, pas de souci.'], ['moi', '(c’est le troisième cette semaine)']],
      joue: 'Dire non te paraît impossible, comme si ta place dépendait de ta disponibilité. Alors tu acceptes, tu rattrapes, tu restes tard. Ce n’est pas de la gentillesse en trop : c’est la peur de décevoir, et de ne plus être utile donc plus aimée.',
      lignee: 'Qui, dans ta famille, ne disait jamais non ? Une mère qui portait tout, un père qui travaillait sans compter ? « Chez nous, on ne se plaint pas, on travaille » : ces phrases-là font des adultes qui s’oublient.',
      geste: 'La prochaine fois qu’on te demande quelque chose, réponds : « Je regarde et je te dis. » Rien de plus. Ce temps entre la demande et ta réponse, c’est ta liberté.',
      mots: 'Je voudrais t’aider, mais je suis déjà à pleine charge. Si je prends ce dossier, qu’est-ce que je peux laisser de côté ?',
      famille: 'Papa, est-ce que tu as déjà dit non à ton chef ? Comment ça se passait, le travail, à ton époque ?',
      question: 'Dans ta famille, qui s’est oublié·e à force de dire oui, et pour qui le faisait-il ou elle ?',
      pratique: ''
    },
    {
      id: 'je-crie-sur-mes-enfants', semaine: '2027-01-11', themes: ['enfants', 'parents'],
      titre: 'Je crie sur mes enfants, et je m’en veux juste après',
      sms: [['moi', 'J’ai encore hurlé ce matin pour les chaussures.'], ['autre', 'Ça arrive à tout le monde, tu sais.'], ['moi', 'Oui, mais j’avais juré que je ne serais jamais comme ma mère.']],
      joue: 'La fatigue, l’heure, une chaussure introuvable, et c’est comme si quelqu’un d’autre parlait à ta place. Ce cri n’est souvent pas pour l’enfant devant toi : il vient d’un endroit plus ancien, quand toi-même tu n’avais pas le droit d’être débordée.',
      lignee: 'Comment on parlait aux enfants chez toi ? Est-ce que ta mère criait, ou se taisait ? Et sa mère à elle ? Les colères qu’on se promet de ne pas transmettre reviennent souvent quand on est seule et à bout.',
      geste: 'Ce soir, retourne voir ton enfant et dis-lui simplement : « Ce matin, j’ai crié. Ce n’était pas de ta faute, j’étais fatiguée. » Réparer compte plus que ne jamais crier.',
      mots: 'Ce matin j’ai crié, et ce n’était pas juste pour toi. J’étais fatiguée. Je t’aime, et je vais essayer de faire autrement.',
      famille: 'Maman, quand tu étais à bout avec nous, tu faisais comment ? Et ta mère, comment elle faisait avec toi ?',
      question: 'Quelle colère de ta lignée as-tu juré de ne pas transmettre, et d’où venait-elle ?',
      pratique: ''
    },
    {
      id: 'relation-qui-ne-nourrit-plus', semaine: '2027-01-04', themes: ['amour'],
      titre: 'Je reste dans une histoire qui ne me rend plus heureuse',
      sms: [['autre', 'Alors, ce Nouvel An ?'], ['moi', 'Comme d’habitude. On ne s’est presque pas parlé.'], ['moi', 'Je ne sais même plus pourquoi je reste.']],
      joue: 'Tu sais que quelque chose ne va plus, et pourtant tu restes. Par peur d’être seule, par habitude, pour les autres, ou parce que partir ressemblerait à un échec. C’est le cycle du cœur : préférer un manque connu à un vide inconnu.',
      lignee: 'Dans ta famille, est-ce qu’on restait « pour les enfants », « parce que c’est comme ça » ? Une grand-mère qui n’a jamais pu partir ? Rester par loyauté à ce modèle, c’est parfois vivre la vie d’une autre.',
      geste: 'Écris deux colonnes : ce qui te fait rester, ce qui te donne envie de partir. Ne décide rien. Regarde seulement de quel côté il y a de la peur, et de quel côté il y a de l’envie. Si l’autre te fait peur, te surveille ou te menace, ce n’est plus une question de schéma : parles-en (en France, le 3919, gratuit et anonyme ; au Québec, SOS violence conjugale, 1 800 363-9010).',
      mots: 'Je ne suis pas heureuse en ce moment dans notre histoire, et j’ai besoin qu’on en parle vraiment. Pas pour se reprocher des choses : pour savoir où on en est.',
      famille: 'Mamie, à ton époque, est-ce qu’une femme pouvait partir quand elle n’était plus heureuse ? Tu en as connu ?',
      question: 'Dans ta lignée, quelle femme est restée alors qu’elle aurait voulu partir ? Qu’est-ce qui l’en empêchait ?',
      pratique: ''
    },
    {
      id: 'encore-une-annee', semaine: '2026-12-28', themes: ['place'],
      titre: 'Encore une année où je n’ai pas fait ce que je voulais',
      sms: [['autre', 'Tes bonnes résolutions pour 2027 ?'], ['moi', 'Les mêmes que l’an dernier.'], ['moi', 'Et que l’année d’avant.']],
      joue: 'Chaque fin d’année, la même liste revient, et la même déception avec. Ce n’est pas un manque de volonté. Souvent, une part de toi a peur de ce qui changerait si tu le faisais vraiment : déranger, réussir mieux que les tiens, ne plus être celle qu’on connaît.',
      lignee: 'Dans ta famille, qui a renoncé à ce qu’il ou elle voulait faire ? Un rêve mis de côté, des études arrêtées, un départ jamais fait ? On porte parfois, sans le savoir, l’interdiction de dépasser celles et ceux qui n’ont pas pu.',
      geste: 'Choisis une seule chose de ta liste. Écris le plus petit pas possible, faisable en 10 minutes, et fais-le avant dimanche.',
      mots: 'Cette année, j’ai envie de m’engager sur une seule chose qui compte pour moi. Tu veux bien me demander de temps en temps où j’en suis ?',
      famille: 'Papa, est-ce qu’il y a quelque chose que tu as voulu faire dans ta vie et que tu n’as pas fait ?',
      question: 'Quel rêve de ta lignée a été mis de côté, et est-ce que tu le portes un peu aujourd’hui ?',
      pratique: ''
    },
    {
      id: 'noel-boule-au-ventre', semaine: '2026-12-21', themes: ['parents'],
      titre: 'Noël approche, et j’ai déjà la boule au ventre',
      sms: [['autre', 'Vous venez à quelle heure le 24 ?'], ['moi', 'Vers 19 h.'], ['moi', '(je compte déjà les heures avant de repartir)']],
      joue: 'Tout le monde parle de fête, et toi tu redoutes la remarque, le silence pesant, la vieille dispute qui ressort au dessert. Les repas de fin d’année réunissent tout ce qui ne s’est jamais dit. Ce n’est pas toi qui es « trop sensible » : tu sens ce qui flotte.',
      lignee: 'Qu’est-ce qui ne se dit jamais à ce repas ? Un oncle fâché, une absente dont on ne parle pas, un héritage, un secret ? Les fêtes sont souvent l’endroit où les non-dits d’une famille se retrouvent autour de la même table.',
      geste: 'Avant d’y aller, décide de deux choses : l’heure à laquelle tu peux partir si c’est trop, et une personne avec qui tu te sens bien sur place. Avoir une porte de sortie change tout.',
      mots: 'Je viens avec plaisir, et je repartirai vers 23 h. J’ai besoin de garder un peu d’énergie pour moi.',
      famille: 'Maman, quand tu étais petite, comment ça se passait, Noël, chez tes parents ? Il y avait des tensions, toi aussi ?',
      question: 'Quel sujet évite-t-on toujours aux repas de famille, et depuis quand ?',
      pratique: ''
    },
    {
      id: 'repas-de-famille-petite', semaine: '2026-12-14', themes: ['parents', 'place'],
      titre: 'À chaque repas de famille, je redeviens la petite',
      sms: [['moi', 'J’ai 34 ans, deux enfants, un métier.'], ['moi', 'Et il suffit que mon frère fasse une blague pour que je me taise comme à 8 ans.'], ['autre', 'Pareil chez moi. On reprend tous nos places.']],
      joue: 'Dès que tu passes la porte, tu retrouves ta place d’enfant : celle qui ne dit rien, celle qui arrange tout, celle dont on se moque. Dans une famille, chacun a un rôle, et le groupe pousse sans le vouloir chacun à le rejouer.',
      lignee: 'Quelle place as-tu dans ta fratrie ? Aînée responsable, petite dernière qu’on ne prend pas au sérieux, celle du milieu qu’on oublie ? Et tes parents, quelle place avaient-ils dans la leur ? Les places se répètent souvent d’une génération à l’autre.',
      geste: 'Au prochain repas, change un seul détail de ton rôle habituel : t’asseoir ailleurs, donner ton avis une fois, ou ne pas te lever pour débarrasser. Observe ce qui se passe, en toi et autour.',
      mots: 'Je sais que c’est pour rire, mais cette blague-là me blesse depuis longtemps. J’aimerais qu’on arrête.',
      famille: 'Maman, toi, dans ta famille, tu avais quelle place entre tes frères et sœurs ? Tu la sens encore aujourd’hui ?',
      question: 'Quelle place occupais-tu dans ta fratrie, et qui l’occupait avant toi dans la génération d’avant ?',
      pratique: ''
    },
    {
      id: 'dire-mon-prix', semaine: '2026-12-07', themes: ['argent', 'travail'],
      titre: 'Je n’ose pas demander ce que je vaux',
      sms: [['autre', 'Alors, tu lui as demandé ton augmentation ?'], ['moi', 'Non… j’ai eu peur de passer pour une profiteuse.'], ['autre', 'Ça fait trois ans que tu fais le travail de deux personnes.']],
      joue: 'Parler d’argent pour toi-même te serre la gorge. Tu as peur de paraître exigeante, d’être refusée, ou pire, qu’on se dise que tu ne le mérites pas. Alors tu attends qu’on remarque ta valeur à ta place, et ça n’arrive presque jamais.',
      lignee: 'Que disait-on chez toi de ceux qui demandaient ? « Il ne faut pas faire de vagues », « On n’est pas de ce monde-là », « L’argent, c’est sale » ? Dans beaucoup de familles, les femmes n’avaient pas le droit de parler d’argent. Ce silence peut encore te tenir.',
      geste: 'Écris le montant que tu voudrais demander, puis dis-le à voix haute trois fois, seule. Le dire avant de le demander rend la vraie demande beaucoup plus simple.',
      mots: 'J’aimerais qu’on fasse le point sur ma rémunération. Depuis trois ans, mes missions ont beaucoup évolué, et je souhaite que mon salaire suive.',
      famille: 'Maman, est-ce que tu as déjà demandé une augmentation ? Est-ce qu’on parlait de salaire à la maison ?',
      question: 'Dans ta lignée, qui a eu le droit de demander, et qui a dû se contenter de ce qu’on lui donnait ?',
      pratique: ''
    },
    {
      id: 'm-effacer-en-couple', semaine: '2026-11-30', themes: ['amour'],
      titre: 'Dès que je suis en couple, je m’efface',
      sms: [['autre', 'Tu viens samedi ? Ça fait des semaines qu’on ne t’a pas vue.'], ['moi', 'Je ne sais pas, il n’aime pas trop sortir.'], ['autre', 'Et toi, tu aimes ?']],
      joue: 'Au début, tu adaptes un peu tes goûts, tes sorties, tes envies. Puis un jour, tu ne sais plus très bien ce que tu aimes, toi. C’est le cycle du cœur : croire qu’il faut se faire petite pour être gardée.',
      lignee: 'Les femmes de ta famille, avaient-elles une vie à elles dans leur couple ? Une mère qui suivait toujours, une grand-mère qui avait arrêté de travailler, de chanter, de voir ses amies ? S’effacer par amour a souvent été la seule façon d’être une « bonne épouse ».',
      geste: 'Écris trois choses que tu aimais faire avant cette relation. Choisis-en une, et refais-la cette semaine, seule ou avec une amie.',
      mots: 'J’ai envie de retrouver des moments rien qu’à moi, avec mes amies, et ça ne veut pas dire que je t’aime moins.',
      famille: 'Mamie, quand tu t’es mariée, est-ce que tu as dû arrêter des choses que tu aimais ?',
      question: 'Quelle femme de ta lignée a renoncé à une part d’elle-même pour son couple ?',
      pratique: ''
    },
    {
      id: 'toujours-celle-qui-appelle', semaine: '2026-11-23', themes: ['amitie'],
      titre: 'C’est toujours moi qui appelle, qui organise, qui propose',
      sms: [['moi', 'On se fait un resto la semaine prochaine ?'], ['autre', 'Oui carrément, dis-moi quand !'], ['moi', '(comme d’habitude, c’est moi qui vais tout organiser)']],
      joue: 'Si tu n’appelles pas, personne n’appelle. Alors tu tiens les liens à bout de bras, et une petite voix se demande si on t’aime vraiment ou si on te garde parce que tu fais l’effort. C’est le cycle du cœur : avoir peur que le lien disparaisse si tu arrêtes de le porter.',
      lignee: 'Qui, dans ta famille, tenait le lien entre tout le monde ? Celle qui appelait les cousines, organisait les anniversaires, rappelait les dates ? Souvent, ce rôle passe d’une femme à l’autre, sans qu’on le choisisse.',
      geste: 'Cette semaine, n’organise rien. Observe qui revient vers toi, et comment. Ce n’est pas un test : c’est une façon de voir ce que tu portes.',
      mots: 'J’ai remarqué que c’est souvent moi qui propose qu’on se voie. Ça me ferait plaisir que, parfois, ce soit toi.',
      famille: 'Maman, dans la famille, qui gardait le contact avec tout le monde ? Est-ce que c’était fatigant pour elle ?',
      question: 'Dans ta lignée, qui portait les liens de toute la famille, et qui s’occupait d’elle ou de lui en retour ?',
      pratique: ''
    },
    {
      id: 'enfant-comme-moi', semaine: '2026-11-16', themes: ['enfants', 'parents'],
      titre: 'Mon enfant réagit exactement comme moi à son âge',
      sms: [['autre', 'Maman, j’ai encore raté mon contrôle. Je suis nulle, de toute façon.'], ['moi', 'Mais non, ne dis pas ça…'], ['moi', '(et dans ma tête : c’est exactement ce que je me disais à 12 ans)']],
      joue: 'Tu te reconnais dans ses mots, ses colères ou ses peurs, et ça te serre le ventre. Ce n’est pas une fatalité : c’est un écho. Ce que tu n’as pas pu dire ou entendre à son âge revient souvent quand ton enfant l’atteint.',
      lignee: 'Remonte d’une génération : comment ta mère ou ton père réagissait quand tu disais « je suis nulle » ? Et eux, qu’avaient-ils entendu à cet âge ? Les phrases qui blessent ou qui rassurent se transmettent souvent sans qu’on les choisisse.',
      geste: 'Ce soir, dis à ton enfant la phrase que tu aurais aimé entendre à son âge. Une seule, simple, sans conseil derrière.',
      mots: 'Je me reconnais beaucoup en toi. Moi aussi, je me disais que j’étais nulle. Tu n’es pas nulle : tu as raté un contrôle. Ce n’est pas pareil.',
      famille: 'Maman, quand j’avais 12 ans et que je rentrais déçue, qu’est-ce que tu ressentais ? Et toi, à mon âge, qui te rassurait ?',
      question: 'Quelle phrase de ton enfance aimerais-tu ne pas transmettre, et qui te l’a transmise ?',
      pratique: ''
    },
    {
      id: 'invisible-au-travail', semaine: '2026-11-09', themes: ['travail', 'place'],
      titre: 'Au travail, je fais tout et on ne me voit pas',
      sms: [['autre', 'Super présentation hier ! Bravo à Julien pour le dossier.'], ['moi', '…'], ['moi', '(c’est moi qui ai fait le dossier)']],
      joue: 'Tu travailles dur, tu rends service, tu rattrapes les oublis des autres, et c’est quelqu’un d’autre qu’on remercie. Te rendre indispensable sans prendre la lumière, c’est une façon de rester à l’abri. Mais à force, tu disparais.',
      lignee: 'Dans ta famille, qui faisait tout sans qu’on le voie ? Une mère, une grand-mère, une tante qui portait la maison ? Souvent, on reprend la place de celle ou celui qui « ne demandait rien ».',
      geste: 'Écris trois choses concrètes que tu as faites ce mois-ci au travail et que personne n’a remarquées. Choisis-en une et dis-la, simplement, à la bonne personne cette semaine.',
      mots: 'Je voulais te dire que c’est moi qui ai préparé le dossier pour la présentation. Je suis contente qu’il ait servi, et j’aimerais qu’on le sache.',
      famille: 'Dans la famille, qui faisait tout sans jamais qu’on lui dise merci ? Comment elle ou il le vivait ?',
      question: 'Qui, dans ta lignée, a porté beaucoup sans être vu·e ? Qu’aurait-elle ou il voulu qu’on reconnaisse ?',
      pratique: ''
    },
    {
      id: 'argent-qui-file', semaine: '2026-11-02', themes: ['argent'],
      titre: 'L’argent file toujours, même quand je gagne plus',
      sms: [['moi', 'Je ne comprends pas, on est le 18 et je suis déjà à découvert.'], ['autre', 'Encore ? Tu avais eu une augmentation, non ?'], ['moi', 'Oui… et je ne sais même pas où il passe.']],
      joue: 'Tu gagnes plus, et pourtant le compte se vide au même moment du mois. Ce n’est pas qu’une question de calcul : l’argent porte souvent une histoire. Le garder peut faire peur, comme s’il ne t’était pas vraiment destiné.',
      lignee: 'Que disait-on de l’argent chez toi ? « L’argent, ça ne fait pas le bonheur », « On n’est pas des riches », « Il faut en profiter tant qu’on l’a » ? Une faillite, un héritage disputé, une période de manque ont pu laisser une loyauté : ne pas avoir plus que les siens.',
      geste: 'Note sur un papier les trois phrases sur l’argent que tu as le plus entendues petite. À côté de chacune, écris si tu y crois encore aujourd’hui.',
      mots: 'Je crois que j’ai un drôle de rapport à l’argent, hérité de la famille. Tu veux bien qu’on en parle sans jugement ?',
      famille: 'Papa, quand tu étais jeune, comment ça se passait avec l’argent à la maison ? Est-ce qu’on en manquait, est-ce qu’on en parlait ?',
      question: 'Dans ta famille, qui a manqué d’argent, ou l’a perdu ? Et qu’est-ce que ça a laissé aux générations suivantes ?',
      pratique: ''
    },
    {
      id: 'mere-jamais-assez', semaine: '2026-10-26', themes: ['parents'],
      titre: 'Ma mère me fait toujours sentir que ce n’est pas assez',
      sms: [['moi', 'J’ai eu le poste !'], ['autre', 'Bravo. Et le salaire, c’est mieux qu’avant au moins ?'], ['moi', '…']],
      joue: 'Tu as 20, 35 ou 50 ans, et une seule phrase de ta mère suffit à te ramener à tes 10 ans. Tu attends encore un « je suis fière de toi » qui ne vient pas. Ce besoin d’être reconnue par elle est légitime, et il pèse lourd tant qu’il reste en attente.',
      lignee: 'Et ta mère, qui la reconnaissait, elle ? Souvent, une mère qui ne sait pas dire « bravo » ne l’a jamais entendu elle-même. Ce n’est pas une excuse : c’est une piste pour comprendre d’où vient ce manque, et arrêter de le prendre pour une vérité sur toi.',
      geste: 'Écris la phrase exacte que tu aimerais entendre de ta mère. Puis lis-la à voix haute, en te l’adressant à toi. C’est étrange au début, et c’est une façon de reprendre la main.',
      mots: 'Maman, quand je t’annonce une bonne nouvelle, j’ai juste besoin que tu sois contente avec moi. Le reste, on peut en parler après.',
      famille: 'Maman, est-ce que ta mère te disait qu’elle était fière de toi ? Comment tu le savais ?',
      question: 'Qu’est-ce que ta mère a attendu de sa propre mère, sans jamais le recevoir ?',
      pratique: ''
    },
    {
      id: 'couple-qui-s-use', semaine: '2026-10-19', themes: ['amour'],
      titre: 'On ne se parle plus que pour l’organisation',
      sms: [['autre', 'Tu prends les enfants mercredi ?'], ['moi', 'Oui. Pense au pain.'], ['autre', 'Ok.']],
      joue: 'Le couple tient, mais il est devenu une équipe logistique. On évite les vraies conversations parce qu’on a peur de ce qu’elles pourraient ouvrir. C’est le cycle du cœur : rester ensemble sans plus vraiment se rencontrer.',
      lignee: 'Comment tes parents ou tes grands-parents parlaient-ils entre eux ? Beaucoup de couples d’avant « faisaient tourner la maison » sans jamais se dire ce qu’ils ressentaient. Ce silence-là se transmet souvent sans qu’on le remarque.',
      geste: 'Envoie un message qui ne parle ni des enfants, ni des courses, ni du planning. Juste une phrase sur lui, sur elle, ou sur vous deux.',
      mots: 'Je me rends compte qu’on ne se parle plus que d’organisation. Tu me manques. On se garde un moment rien que pour nous cette semaine ?',
      famille: 'Maman, avec papa (ou avant), vous vous parliez de quoi, le soir, quand tout était fait ?',
      question: 'Dans ta famille, quel couple a duré sans se parler vraiment ? Qu’est-ce qu’il n’osait pas se dire ?',
      pratique: ''
    }
  ];

  /* Les situations du premier lot (ex-espace « Jeune femme », 18-25 ans) : toujours visibles dans la bibliothèque et sur tes-20-ans.html */
  var PREMIER_LOT = 
[
    {
      id: 'silence', jeunes: true, themes: ['amour'], groupe: 'amour', possible: "Tu peux apprendre à rester calme dans l'attente, et à demander plutôt qu'imaginer. C'est une force qui te servira dans toutes tes relations.", theme: 'Amour', cycle: 'coeur', avant: true,
      titre: 'Il ou elle ne répond plus, et je tourne en boucle',
      joue: "Le silence de l'autre réveille une question plus ancienne que cette histoire : est-ce que je compte ? C'est le cycle du cœur, celui de la peur d'être quitté·e. Plus tu attends, plus ce silence prend de place, et tu finis par lui faire dire des choses que personne n'a dites.",
      question: 'Qu\'est-ce que ce silence me dit sur moi, que je crois déjà un peu ?',
      geste: "Pose ton téléphone dans une autre pièce pendant 15 minutes. Sur un papier, écris ce que tu as peur que ce silence veuille dire. En dessous, trouve trois autres explications possibles.",
      mots: "Hello, je n'ai pas eu de nouvelles depuis quelques jours. Je préfère te demander plutôt qu'imaginer : tu as envie qu'on continue à se parler ?",
      famille: "Maman, quand tu avais mon âge, est-ce que tu as déjà attendu des nouvelles de quelqu'un qui ne répondait plus ? Tu faisais comment ?",
      liens: ['amour', 'methode']
    },
    {
      id: 'pas-ensemble', jeunes: true, themes: ['amour'], groupe: 'amour', possible: "Oser demander ce que tu veux, c'est te traiter avec respect. Quelle que soit la réponse, tu sauras où tu en es, et tu pourras choisir.", theme: 'Amour', cycle: 'coeur', avant: true,
      titre: "On n'est pas vraiment ensemble, et je n'ose pas demander",
      joue: "Tu as peur qu'une question claire fasse tout s'arrêter, alors tu prends le moins de place possible. C'est le cycle du cœur : accepter moins que ce que tu veux, pour rester choisi·e quand même. Pourtant, ne pas savoir où tu en es, c'est déjà une réponse que tu subis.",
      question: 'Si la réponse ne changeait rien à ce que je vaux, qu\'est-ce que je demanderais ?',
      geste: "Écris en une phrase ce que tu veux vraiment dans cette relation. Pas ce que tu penses pouvoir obtenir : ce que tu veux. Garde-la dans tes notes et relis-la avant de le ou la revoir.",
      mots: "J'aime ce qu'on vit, et j'ai besoin de savoir où on en est. Pour toi, c'est quoi, nous deux ?",
      famille: "Mamie, quand tu avais mon âge, comment on savait qu'on était vraiment ensemble ? Est-ce qu'on osait le demander ?",
      liens: ['amour', 'arbre']
    },
    {
      id: 'meme-genre', jeunes: true, themes: ['amour'], groupe: 'amour', possible: "Un schéma que tu vois est déjà un schéma qui s'affaiblit. La prochaine fois, tu reconnaîtras les premiers signes, et tu pourras choisir autrement.", theme: 'Amour', cycle: 'coeur', avant: true,
      titre: 'Je retombe toujours sur le même genre de personne',
      joue: "Les personnes changent, le scénario reste. Souvent, on est attiré·e par ce qui nous est familier, pas par ce qui nous fait du bien. C'est le cycle du cœur : une histoire qui revient tant qu'elle n'a pas été regardée en face.",
      question: 'Qu\'est-ce que ces personnes ont en commun, et à qui ça me fait penser ?',
      geste: "Écris les prénoms de tes deux ou trois dernières histoires. À côté de chacun, trois mots : comment ça a commencé, ce que tu ressentais au milieu, comment ça s'est fini. Entoure ce qui revient.",
      mots: "Je crois que je rejoue toujours le même scénario. Tu veux bien me dire ce que tu remarques, toi, chez les personnes que je choisis ?",
      famille: "Comment tu as rencontré mon père (ou ma mère) ? Qu'est-ce qui t'a plu au tout début ?",
      liens: ['amour', 'geno']
    },
    {
      id: 'dire-non', jeunes: true, themes: ['amitie'], groupe: 'amities', possible: "Les amitiés qui restent après un non sont souvent les plus solides. Chaque petit non t'apprend que tu peux être aimé·e comme tu es.", theme: 'Amitiés', cycle: 'coeur',
      titre: "Je n'arrive pas à dire non à mes amies",
      joue: "Dire oui à tout, c'est souvent une façon de garder ta place dans le groupe. Derrière, il y a une peur : si je dis non, on va moins m'aimer. C'est le cycle du cœur, celui où l'on donne tout pour être choisi·e.",
      question: 'À quoi j\'ai dit oui cette semaine, alors que je pensais non ?',
      geste: "Pense à la prochaine demande qui risque d'arriver (un service, une sortie, un prêt). Prépare ta réponse maintenant : un non court et gentil, sans te justifier trois fois.",
      mots: "Merci d'avoir pensé à moi. Cette fois, je ne vais pas pouvoir, mais j'ai vraiment envie qu'on se voie bientôt.",
      famille: "Maman, quand tu avais mon âge, est-ce que tu arrivais à dire non à tes amies ? Et à tes parents ?",
      liens: ['methode', 'famille']
    },
    {
      id: 'etudes', jeunes: true, themes: ['parents', 'place'], groupe: 'famille', possible: "Beaucoup de parents finissent par soutenir un choix qu'ils ne comprenaient pas, quand ils voient qu'il est réfléchi et qu'il te ressemble.", theme: 'Parents', cycle: 'racine',
      titre: 'Mes parents veulent que je fasse des études qui ne me ressemblent pas',
      joue: "Le projet de tes parents pour toi parle souvent de leur propre histoire : ce qui leur a manqué, ce qui les a rassurés. C'est le cycle de la racine, celui de la sécurité et de la place. Eux cherchent à te mettre à l'abri ; toi, tu cherches ta place à toi.",
      question: 'Si personne ne pouvait être déçu, qu\'est-ce que je choisirais ?',
      geste: "Fais deux colonnes : ce que mes parents veulent pour moi, ce que moi je veux. Dans leur colonne, entoure tout ce qui parle d'une peur (manquer, ne pas trouver de travail, être jugé·e).",
      mots: "Je sais que tu veux que je sois à l'abri, et je t'en remercie. J'ai besoin que tu m'écoutes cinq minutes sur ce que moi, j'ai envie de faire, sans me répondre tout de suite.",
      famille: "Papa, à mon âge, tu voulais faire quoi ? Est-ce que tes parents étaient d'accord ?",
      liens: ['famille', 'geno']
    },
    {
      id: 'partir', jeunes: true, themes: ['parents'], groupe: 'famille', possible: "Partir peut rapprocher. Quand chacun a sa place, les liens deviennent souvent plus libres et plus vrais.", theme: 'Parents', cycle: 'racine',
      titre: "Je culpabilise de partir de chez mes parents (ou je n'arrive pas à partir)",
      joue: "Partir, c'est prendre ta place ailleurs. Si, dans ta famille, partir a voulu dire abandonner, perdre ou trahir, ton départ réveille tout ça, même si personne n'en parle. C'est le cycle de la racine : avoir le droit d'exister par toi-même, sans que les autres s'écroulent.",
      question: 'Qu\'est-ce que j\'ai peur qu\'il arrive à ma famille si je pars ? Et à moi, si je reste ?',
      geste: "Note une seule chose concrète que tu peux faire cette semaine pour ton autonomie : regarder trois annonces, faire ton budget du mois, ouvrir un compte à ton nom. Pas tout. Une seule.",
      mots: "Partir, ce n'est pas vous quitter. J'ai besoin de faire ma vie, et j'ai envie qu'on reste proches. On pourrait garder un moment rien qu'à nous chaque semaine ?",
      famille: "Mamie, tu avais quel âge quand tu as quitté la maison de tes parents ? Comment ça s'est passé ?",
      liens: ['methode', 'geno']
    },
    {
      id: 'retard', jeunes: true, themes: ['place'], groupe: 'place', possible: "Il n'y a pas de bon âge pour ta vie. Ce que tu vis maintenant construit quelque chose que personne d'autre ne peut construire à ta place.", theme: 'Ta place', cycle: 'racine',
      titre: "Je compare ma vie à celle des autres et j'ai l'impression d'être en retard",
      joue: "En retard par rapport à quoi, et selon qui ? Souvent, une horloge familiale tourne dans ta tête : l'âge où il « fallait » avoir un diplôme, un couple, un travail. C'est le cycle de la racine : sentir que tu as ta place, même à ton rythme.",
      question: 'Cette horloge, elle vient de moi, ou de quelqu\'un dans ma famille ?',
      geste: "Ferme les réseaux pendant 15 minutes. Écris trois choses que tu as traversées ou apprises cette année et que personne ne voit sur ton profil.",
      mots: "Je me sens en retard en ce moment. Tu as déjà ressenti ça ? J'ai plus besoin d'en parler que d'un conseil.",
      famille: "Maman, à mon âge, tu en étais où ? Est-ce que tu te sentais en avance ou en retard ?",
      liens: ['arbre', 'methode']
    },
    {
      id: 'ma-place', jeunes: true, themes: ['place', 'travail'], groupe: 'place', possible: "Ta place se construit aussi par petites touches : une personne, un moment, une réussite à la fois.", theme: 'Ta place', cycle: 'racine',
      titre: "Je ne me sens pas à ma place à l'école ou au travail",
      joue: "Ne pas se sentir à sa place, c'est le centre du cycle de la racine. Parfois, ça vient vraiment du lieu. Parfois, c'est une impression plus ancienne : celle d'être de trop, ou de devoir mériter d'être là.",
      question: 'Où, et avec qui, est-ce que j\'ai déjà eu l\'impression d\'être à ma place ?',
      geste: "Repère une personne, dans cet endroit, avec qui tu te sens un peu plus à l'aise. Envoie-lui un message simple ou propose-lui un café cette semaine.",
      mots: "Je me sens un peu perdu·e ici en ce moment. Tu te souviens comment tu as trouvé tes marques, toi ?",
      famille: "Papa, est-ce qu'il t'est arrivé de ne pas te sentir à ta place, à l'école ou au travail ? Qu'est-ce que tu as fait ?",
      liens: ['arbre', 'geno']
    },
    {
      id: 'argent', jeunes: true, themes: ['argent'], groupe: 'place', possible: "Une peur transmise peut se transformer : tu peux garder la prudence de ta famille, et laisser la peur.", theme: 'Argent', cycle: 'racine',
      titre: "L'argent me stresse, même quand j'en ai assez",
      joue: "Quand la peur de manquer reste là même quand ton compte va bien, elle ne vient pas forcément de toi. Elle a pu être vécue avant toi, et transmise sans un mot. C'est le cycle de la racine : la sécurité, un toit, de quoi vivre.",
      question: "Quelle phrase sur l'argent j'ai le plus entendue chez moi ?",
      geste: "Ouvre ton appli bancaire et regarde ton solde, simplement, sans rien juger. Puis écris « Aujourd'hui, j'ai de quoi… » et complète avec trois choses vraies.",
      mots: "L'argent me stresse souvent, même quand ça va. Ça te dit qu'on fasse nos budgets ensemble un soir ?",
      famille: "Maman, quand tu étais petite, est-ce qu'on manquait d'argent à la maison ? Comment on en parlait ?",
      liens: ['methode', 'famille']
    },
    {
      id: 'ma-mere', jeunes: true, themes: ['parents'], groupe: 'famille', possible: "Tu peux garder le meilleur de ce qu'elle t'a donné, et inventer le reste. C'est souvent comme ça qu'une famille avance d'une génération à l'autre.", theme: 'Ta mère', cycle: 'coeur',
      titre: "Je ressemble à ma mère, et ça m'énerve (ou je fais tout pour ne pas lui ressembler)",
      joue: "Lui ressembler ou tout faire pour ne pas lui ressembler, c'est la même chose vue de deux côtés : dans les deux cas, c'est elle qui sert de repère. C'est le cycle du cœur, parce que ta mère a été ton premier modèle de ce que veut dire aimer et être aimé·e.",
      question: "Qu'est-ce que je refuse chez elle, et qu'est-ce que je voudrais garder ?",
      geste: "Fais deux listes rapides : trois choses de ta mère que tu veux garder, trois que tu choisis de laisser. Tu as le droit d'avoir les deux listes.",
      mots: "Je peux lui ressembler sur certaines choses et faire autrement sur d'autres. C'est moi qui choisis.",
      famille: "Maman, qu'est-ce que tu as pris de ta propre mère, et qu'est-ce que tu as voulu faire autrement ?",
      liens: ['famille', 'geno']
    },
    {
      id: "conflit-couple", jeunes: true, themes: ['amour'],
      groupe: "amour",
      theme: "Conflit",
      cycle: "coeur",
      avant: true,
      titre: "On s'est disputés, et on ne se comprend plus",
      joue: "Dans une dispute, on se bat rarement pour le sujet du jour. On se bat pour être compris·e et pris·e en compte. C'est le cycle du cœur : derrière les reproches, chacun demande au fond la même chose, être aimé·e tel qu'il est.",
      question: "Qu'est-ce que j'avais vraiment besoin qu'il ou elle comprenne ?",
      geste: "Écris en une phrase ce que tu as ressenti (pas ce que l'autre a fait). Puis écris ce que, d'après toi, l'autre a ressenti. Garde les deux phrases pour la discussion.",
      mots: "Je n'aime pas comment on s'est quittés. Je crois qu'on ne s'est pas compris. Tu veux bien qu'on en reparle calmement, quand tu es dispo ?",
      famille: "Maman, comment vous faisiez pour vous réconcilier après une dispute, papa et toi (ou avant) ?",
      possible: "Un couple qui apprend à se réconcilier devient plus solide qu'un couple qui ne se dispute jamais. Chaque malentendu bien traversé vous apprend à mieux vous parler.",
      liens: ["conflit", "amour"]
    },
    {
      id: "conflit-famille", jeunes: true, themes: ['parents'],
      groupe: "famille",
      theme: "Conflit",
      cycle: "racine",
      titre: "Avec mes parents, chaque discussion finit en dispute",
      joue: "Tu grandis, et la place de chacun change. Tes parents cherchent encore à te protéger, toi tu cherches à être reconnu·e comme adulte. C'est le cycle de la racine : trouver ta place dans la famille, sans devoir te battre pour l'avoir.",
      question: "Sur quel sujet ça explose toujours, et qu'est-ce que je voudrais qu'ils reconnaissent ?",
      geste: "Choisis un seul sujet, pas tous. Prépare une phrase qui commence par « Je » et une question pour comprendre leur point de vue.",
      mots: "Je n'ai pas envie qu'on se dispute à chaque fois. Je voudrais comprendre ce qui t'inquiète, et que tu entendes aussi ce que moi je ressens. On essaie ?",
      famille: "Papa, à mon âge, tu te disputais avec tes parents ? Sur quoi ?",
      possible: "La relation avec tes parents peut devenir une relation entre adultes. Ça prend du temps, et chaque discussion calme y contribue.",
      liens: ["conflit", "famille"]
    },
    {
      id: "amies-eloignent", jeunes: true, themes: ['amitie'],
      groupe: "amities",
      theme: "Amitiés",
      cycle: "coeur",
      titre: "Mes amies s'éloignent, et je ne sais pas comment le vivre",
      joue: "Après le lycée ou les études, les chemins se séparent et certaines amitiés changent. Ça peut réveiller une vieille peur d'être laissé·e de côté. C'est le cycle du cœur : apprendre que le lien peut changer de forme sans disparaître.",
      question: "Quelle amitié j'ai envie de garder, et qu'est-ce que je peux faire pour elle cette semaine ?",
      geste: "Envoie un message à une amie qui te manque, sans reproche : juste un souvenir ou une photo de vous, et une proposition simple.",
      mots: "Tu me manques. Je sais qu'on a des vies plus remplies maintenant, mais j'ai envie qu'on se garde. Un appel ce week-end ?",
      famille: "Maman, tu as encore des amies de quand tu avais mon âge ? Comment vous avez fait pour rester proches ?",
      possible: "Les amitiés qui traversent ces années-là deviennent souvent celles de toute une vie. Et de nouvelles personnes arrivent aussi, qui te ressembleront peut-être davantage.",
      liens: ["methode", "arbre"]
    },
    {
      id: "parents-separes", jeunes: true, themes: ['parents'],
      groupe: "famille",
      theme: "Famille",
      cycle: "racine",
      titre: "Mes parents se disputent ou se séparent, et je suis au milieu",
      joue: "Quand tes parents vont mal ensemble, tu peux te retrouver à jouer un rôle qui n'est pas le tien : messager·e, confident·e, arbitre. C'est le cycle de la racine : ta place, c'est celle d'enfant de tes deux parents, pas celle de leur médiateur ou médiatrice.",
      question: "Quel rôle est-ce que je joue entre eux, et est-ce que je l'ai choisi ?",
      geste: "Écris une phrase pour sortir de ce rôle, par exemple : « Je vous aime tous les deux, et je ne veux pas porter vos messages. » Garde-la prête.",
      mots: "Je vous aime tous les deux. J'ai besoin de ne pas être au milieu de vos histoires d'adultes. Vous pouvez en parler entre vous ?",
      famille: "Mamie, est-ce qu'il y a déjà eu des séparations dans la famille ? Comment les enfants l'avaient vécu ?",
      possible: "Tu as le droit d'aimer tes deux parents sans choisir. En reprenant ta place, tu les aides aussi à reprendre la leur.",
      liens: ["geno", "famille"]
    },
    {
      id: "sais-pas", jeunes: true, themes: ['place'],
      groupe: "place",
      theme: "Ta place",
      cycle: "racine",
      titre: "Je ne sais pas ce que je veux faire de ma vie",
      joue: "À 20 ans, ne pas savoir est normal, même si tout le monde semble avoir un plan. Parfois, on n'ose pas savoir, parce que ce qu'on veut ne ressemble pas à ce qu'on attend de nous. C'est le cycle de la racine : trouver ta place à toi.",
      question: "Quand est-ce que j'oublie l'heure, tellement je suis dedans ?",
      geste: "Fais la liste de cinq moments de ta vie où tu t'es senti·e vivant·e ou fier·e. Cherche ce qu'ils ont en commun : une ambiance, une activité, des gens.",
      mots: "Je ne sais pas encore ce que je veux faire, et j'ai besoin d'essayer des choses pour trouver. Tu peux me faire confiance là-dessus ?",
      famille: "Papa, à mon âge, tu savais ce que tu voulais faire ? Comment tu as choisi ?",
      possible: "Tu n'as pas besoin de tout savoir, seulement du prochain pas. La plupart des chemins se dessinent en marchant.",
      liens: ["arbre", "methode"]
    },
    {
      id: "seule", jeunes: true, themes: ['amitie'],
      groupe: "non-dits",
      theme: "Ce qu'on ne dit pas",
      cycle: "coeur",
      titre: "Je me sens seule, même entourée",
      joue: "On peut être entouré·e et ne pas se sentir vraiment vu·e. Souvent, c'est qu'on montre une version de soi qui rassure les autres. C'est le cycle du cœur : le besoin d'être aimé·e pour ce qu'on est vraiment, pas pour ce qu'on montre.",
      question: "Avec qui est-ce que j'ai l'impression de pouvoir être moi, même un peu ?",
      geste: "Envoie un message vrai à une seule personne. Pas « ça va », mais une chose que tu vis vraiment en ce moment.",
      mots: "Je me rends compte que je te dis toujours que ça va. En vrai, j'aimerais te parler de quelque chose. Tu as un moment cette semaine ?",
      famille: "Mamie, à mon âge, est-ce que tu avais une amie à qui tu pouvais tout dire ?",
      possible: "Il suffit souvent d'une seule relation vraie pour que tout change. Et en te montrant un peu plus, tu donnes aux autres la permission de le faire aussi.",
      liens: ["methode", "arbre"]
    },
    {
      id: "semblant", jeunes: true, themes: ['place'],
      groupe: "non-dits",
      theme: "Ce qu'on ne dit pas",
      cycle: "coeur",
      titre: "Je fais semblant que tout va bien",
      joue: "Dire que tout va bien, c'est parfois une façon de protéger les autres, ou de ne pas déranger. Si, dans ta famille, on ne se plaignait pas, tu as peut-être appris à tout porter seul·e. C'est le cycle du cœur : avoir le droit d'être aimé·e même quand ça ne va pas.",
      question: "Qui, dans ma famille, a aussi appris à faire semblant ?",
      geste: "Écris trois phrases qui commencent par « En vrai, en ce moment… ». Tu n'as pas à les montrer. Juste à les écrire.",
      mots: "Je dis souvent que ça va, mais en ce moment c'est un peu plus compliqué. Je n'ai pas besoin de solution, juste que tu le saches.",
      famille: "Maman, chez tes parents, est-ce qu'on avait le droit de dire quand ça n'allait pas ?",
      possible: "Arrêter de faire semblant, même avec une seule personne, allège énormément. Tu découvriras souvent que les gens qui t'aiment préfèrent la vérité.",
      liens: ["famille", "methode"]
    },
    {
      id: "honte-origines", jeunes: true, themes: ['parents'],
      groupe: "non-dits",
      theme: "Ce qu'on ne dit pas",
      cycle: "racine",
      titre: "J'ai un peu honte de ma famille, ou de là d'où je viens",
      joue: "Quand on change de milieu (études, ville, amis), on peut se sentir entre deux mondes. La honte arrive souvent là, et elle s'accompagne parfois de culpabilité. C'est le cycle de la racine : avoir le droit d'exister partout, sans renier d'où l'on vient.",
      question: "Qu'est-ce que ma famille a traversé pour que je sois là où je suis aujourd'hui ?",
      geste: "Écris trois forces que tu as reçues de ta famille ou de ton milieu, même si tu ne les vois pas tout de suite : le courage, l'humour, le sens du travail, la débrouille…",
      mots: "Je viens d'un endroit dont je suis aussi fier·e, même si je ne le dis pas souvent. Tu veux que je te raconte ?",
      famille: "Papa, qu'est-ce que tes parents ont dû traverser pour qu'on en soit là aujourd'hui ?",
      possible: "Tes racines peuvent devenir une force. Celles et ceux qui changent de monde sans renier le leur deviennent souvent des ponts précieux entre les gens.",
      liens: ["geno", "famille"]
    }
  ];

  window.GENESOLIA_SITUATIONS = NOUVELLES.concat(PREMIER_LOT);
  window.GENESOLIA_THEMES = { amour: 'Amour', parents: 'Parents', argent: 'Argent', travail: 'Travail', amitie: 'Amitié', enfants: 'Enfants', place: 'Ta place' };
})();
