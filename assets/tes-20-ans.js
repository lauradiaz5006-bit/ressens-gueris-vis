/* Genesolia — espace « Tes 20 ans » : outil « Je suis dans la situation… »,
   exercice des phrases transmises et questions du mini-arbre.
   Tout reste dans le navigateur (localStorage), aucun envoi. */
(function () {
  'use strict';

  /* ---------- Stockage local, toujours protégé ---------- */
  function lire(cle, defaut) {
    try {
      var v = localStorage.getItem(cle);
      return v ? JSON.parse(v) : defaut;
    } catch (e) { return defaut; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) {}
  }
  function effacerCle(cle) {
    try { localStorage.removeItem(cle); } catch (e) {}
  }
  /* Échappe le texte et pose les espaces insécables de la typographie française */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    }).replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
  }

  var ICONES = {
    fleche: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    coche: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    retour: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copier: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10h.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };

  /* ---------- Copier : presse-papiers, avec repli ---------- */
  function copierTexte(texte) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texte).catch(function () { return repli(texte); });
    }
    return repli(texte);
  }
  function repli(texte) {
    return new Promise(function (ok, ko) {
      var zone = document.createElement('textarea');
      zone.value = texte;
      zone.setAttribute('readonly', '');
      zone.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
      document.body.appendChild(zone);
      zone.select();
      try { zone.setSelectionRange(0, texte.length); } catch (e) {}
      var reussi = false;
      try { reussi = document.execCommand('copy'); } catch (e) {}
      zone.remove();
      reussi ? ok() : ko();
    });
  }
  function brancherCopie(racine) {
    racine.querySelectorAll('[data-copier]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cible = document.getElementById(btn.getAttribute('data-copier'));
        var texte = cible ? (cible.getAttribute('data-texte') || cible.textContent).replace(/\u00a0/g, ' ').trim() : '';
        var libelle = btn.querySelector('span');
        copierTexte(texte).then(function () {
          btn.classList.add('ok');
          libelle.textContent = 'Copié';
        }, function () {
          libelle.textContent = 'Sélectionne le texte pour le copier';
          if (cible && window.getSelection) {
            var r = document.createRange(); r.selectNodeContents(cible);
            var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          }
        });
        clearTimeout(btn._minuteur);
        btn._minuteur = setTimeout(function () {
          btn.classList.remove('ok');
          libelle.textContent = btn.getAttribute('data-libelle') || 'Copier';
        }, 2400);
      });
    });
  }
  function boutonCopier(id, libelle) {
    libelle = libelle || 'Copier';
    return '<button class="copier" type="button" data-copier="' + id + '" data-libelle="' + esc(libelle) + '">' +
      ICONES.copier + '<span aria-live="polite">' + esc(libelle) + '</span></button>';
  }

  /* ---------- Les liens « Aller plus loin » ---------- */
  var LIENS = {
    methode: ['methode.html', 'La méthode des deux cycles', 'Comprendre la racine et le cœur, et où tu en es.'],
    arbre: ['arbre-de-vie.html', "Le test de l'arbre de vie", 'Cinq minutes pour voir où ça se rejoue aujourd\'hui.'],
    geno: ['genosociogramme.html', 'Ton arbre familial en ligne', 'Dessiner ta famille et repérer ce qui revient.'],
    amour: ['schemas-repetitifs-en-amour.html', 'Ce qui se rejoue en amour', 'Pourquoi on retombe sur les mêmes histoires.'],
    conflit: ['#conflit', 'Le guide pour régler un conflit', 'Cinq étapes, et les mots pour chacune.'],
    famille: ['questions-a-poser-a-sa-famille.html', 'Les questions à poser à ta famille', 'Pour oser demander, sans brusquer personne.']
  };

  var AVANT = [
    "Qu'est-ce que j'espère qu'il ou elle me réponde ?",
    'Est-ce que je l\'enverrais pareil demain matin ?',
    "Qu'est-ce que je ressens, là, juste avant d'écrire ?"
  ];

  /* ---------- Les dix situations ---------- */
  var SITUATIONS = [
    {
      id: 'silence', groupe: 'amour', possible: "Tu peux apprendre à rester calme dans l'attente, et à demander plutôt qu'imaginer. C'est une force qui te servira dans toutes tes relations.", theme: 'Amour', cycle: 'coeur', avant: true,
      titre: 'Il ou elle ne répond plus, et je tourne en boucle',
      joue: "Le silence de l'autre réveille une question plus ancienne que cette histoire : est-ce que je compte ? C'est le cycle du cœur, celui de la peur d'être quitté·e. Plus tu attends, plus ce silence prend de place, et tu finis par lui faire dire des choses que personne n'a dites.",
      question: 'Qu\'est-ce que ce silence me dit sur moi, que je crois déjà un peu ?',
      geste: "Pose ton téléphone dans une autre pièce pendant 15 minutes. Sur un papier, écris ce que tu as peur que ce silence veuille dire. En dessous, trouve trois autres explications possibles.",
      mots: "Hello, je n'ai pas eu de nouvelles depuis quelques jours. Je préfère te demander plutôt qu'imaginer : tu as envie qu'on continue à se parler ?",
      famille: "Maman, quand tu avais mon âge, est-ce que tu as déjà attendu des nouvelles de quelqu'un qui ne répondait plus ? Tu faisais comment ?",
      liens: ['amour', 'methode']
    },
    {
      id: 'pas-ensemble', groupe: 'amour', possible: "Oser demander ce que tu veux, c'est te traiter avec respect. Quelle que soit la réponse, tu sauras où tu en es, et tu pourras choisir.", theme: 'Amour', cycle: 'coeur', avant: true,
      titre: "On n'est pas vraiment ensemble, et je n'ose pas demander",
      joue: "Tu as peur qu'une question claire fasse tout s'arrêter, alors tu prends le moins de place possible. C'est le cycle du cœur : accepter moins que ce que tu veux, pour rester choisi·e quand même. Pourtant, ne pas savoir où tu en es, c'est déjà une réponse que tu subis.",
      question: 'Si la réponse ne changeait rien à ce que je vaux, qu\'est-ce que je demanderais ?',
      geste: "Écris en une phrase ce que tu veux vraiment dans cette relation. Pas ce que tu penses pouvoir obtenir : ce que tu veux. Garde-la dans tes notes et relis-la avant de le ou la revoir.",
      mots: "J'aime ce qu'on vit, et j'ai besoin de savoir où on en est. Pour toi, c'est quoi, nous deux ?",
      famille: "Mamie, quand tu avais mon âge, comment on savait qu'on était vraiment ensemble ? Est-ce qu'on osait le demander ?",
      liens: ['amour', 'arbre']
    },
    {
      id: 'meme-genre', groupe: 'amour', possible: "Un schéma que tu vois est déjà un schéma qui s'affaiblit. La prochaine fois, tu reconnaîtras les premiers signes, et tu pourras choisir autrement.", theme: 'Amour', cycle: 'coeur', avant: true,
      titre: 'Je retombe toujours sur le même genre de personne',
      joue: "Les personnes changent, le scénario reste. Souvent, on est attiré·e par ce qui nous est familier, pas par ce qui nous fait du bien. C'est le cycle du cœur : une histoire qui revient tant qu'elle n'a pas été regardée en face.",
      question: 'Qu\'est-ce que ces personnes ont en commun, et à qui ça me fait penser ?',
      geste: "Écris les prénoms de tes deux ou trois dernières histoires. À côté de chacun, trois mots : comment ça a commencé, ce que tu ressentais au milieu, comment ça s'est fini. Entoure ce qui revient.",
      mots: "Je crois que je rejoue toujours le même scénario. Tu veux bien me dire ce que tu remarques, toi, chez les personnes que je choisis ?",
      famille: "Comment tu as rencontré mon père (ou ma mère) ? Qu'est-ce qui t'a plu au tout début ?",
      liens: ['amour', 'geno']
    },
    {
      id: 'dire-non', groupe: 'amities', possible: "Les amitiés qui restent après un non sont souvent les plus solides. Chaque petit non t'apprend que tu peux être aimé·e comme tu es.", theme: 'Amitiés', cycle: 'coeur',
      titre: "Je n'arrive pas à dire non à mes amies",
      joue: "Dire oui à tout, c'est souvent une façon de garder ta place dans le groupe. Derrière, il y a une peur : si je dis non, on va moins m'aimer. C'est le cycle du cœur, celui où l'on donne tout pour être choisi·e.",
      question: 'À quoi j\'ai dit oui cette semaine, alors que je pensais non ?',
      geste: "Pense à la prochaine demande qui risque d'arriver (un service, une sortie, un prêt). Prépare ta réponse maintenant : un non court et gentil, sans te justifier trois fois.",
      mots: "Merci d'avoir pensé à moi. Cette fois, je ne vais pas pouvoir, mais j'ai vraiment envie qu'on se voie bientôt.",
      famille: "Maman, quand tu avais mon âge, est-ce que tu arrivais à dire non à tes amies ? Et à tes parents ?",
      liens: ['methode', 'famille']
    },
    {
      id: 'etudes', groupe: 'famille', possible: "Beaucoup de parents finissent par soutenir un choix qu'ils ne comprenaient pas, quand ils voient qu'il est réfléchi et qu'il te ressemble.", theme: 'Parents', cycle: 'racine',
      titre: 'Mes parents veulent que je fasse des études qui ne me ressemblent pas',
      joue: "Le projet de tes parents pour toi parle souvent de leur propre histoire : ce qui leur a manqué, ce qui les a rassurés. C'est le cycle de la racine, celui de la sécurité et de la place. Eux cherchent à te mettre à l'abri ; toi, tu cherches ta place à toi.",
      question: 'Si personne ne pouvait être déçu, qu\'est-ce que je choisirais ?',
      geste: "Fais deux colonnes : ce que mes parents veulent pour moi, ce que moi je veux. Dans leur colonne, entoure tout ce qui parle d'une peur (manquer, ne pas trouver de travail, être jugé·e).",
      mots: "Je sais que tu veux que je sois à l'abri, et je t'en remercie. J'ai besoin que tu m'écoutes cinq minutes sur ce que moi, j'ai envie de faire, sans me répondre tout de suite.",
      famille: "Papa, à mon âge, tu voulais faire quoi ? Est-ce que tes parents étaient d'accord ?",
      liens: ['famille', 'geno']
    },
    {
      id: 'partir', groupe: 'famille', possible: "Partir peut rapprocher. Quand chacun a sa place, les liens deviennent souvent plus libres et plus vrais.", theme: 'Parents', cycle: 'racine',
      titre: "Je culpabilise de partir de chez mes parents (ou je n'arrive pas à partir)",
      joue: "Partir, c'est prendre ta place ailleurs. Si, dans ta famille, partir a voulu dire abandonner, perdre ou trahir, ton départ réveille tout ça, même si personne n'en parle. C'est le cycle de la racine : avoir le droit d'exister par toi-même, sans que les autres s'écroulent.",
      question: 'Qu\'est-ce que j\'ai peur qu\'il arrive à ma famille si je pars ? Et à moi, si je reste ?',
      geste: "Note une seule chose concrète que tu peux faire cette semaine pour ton autonomie : regarder trois annonces, faire ton budget du mois, ouvrir un compte à ton nom. Pas tout. Une seule.",
      mots: "Partir, ce n'est pas vous quitter. J'ai besoin de faire ma vie, et j'ai envie qu'on reste proches. On pourrait garder un moment rien qu'à nous chaque semaine ?",
      famille: "Mamie, tu avais quel âge quand tu as quitté la maison de tes parents ? Comment ça s'est passé ?",
      liens: ['methode', 'geno']
    },
    {
      id: 'retard', groupe: 'place', possible: "Il n'y a pas de bon âge pour ta vie. Ce que tu vis maintenant construit quelque chose que personne d'autre ne peut construire à ta place.", theme: 'Ta place', cycle: 'racine',
      titre: "Je compare ma vie à celle des autres et j'ai l'impression d'être en retard",
      joue: "En retard par rapport à quoi, et selon qui ? Souvent, une horloge familiale tourne dans ta tête : l'âge où il « fallait » avoir un diplôme, un couple, un travail. C'est le cycle de la racine : sentir que tu as ta place, même à ton rythme.",
      question: 'Cette horloge, elle vient de moi, ou de quelqu\'un dans ma famille ?',
      geste: "Ferme les réseaux pendant 15 minutes. Écris trois choses que tu as traversées ou apprises cette année et que personne ne voit sur ton profil.",
      mots: "Je me sens en retard en ce moment. Tu as déjà ressenti ça ? J'ai plus besoin d'en parler que d'un conseil.",
      famille: "Maman, à mon âge, tu en étais où ? Est-ce que tu te sentais en avance ou en retard ?",
      liens: ['arbre', 'methode']
    },
    {
      id: 'ma-place', groupe: 'place', possible: "Ta place se construit aussi par petites touches : une personne, un moment, une réussite à la fois.", theme: 'Ta place', cycle: 'racine',
      titre: "Je ne me sens pas à ma place à l'école ou au travail",
      joue: "Ne pas se sentir à sa place, c'est le centre du cycle de la racine. Parfois, ça vient vraiment du lieu. Parfois, c'est une impression plus ancienne : celle d'être de trop, ou de devoir mériter d'être là.",
      question: 'Où, et avec qui, est-ce que j\'ai déjà eu l\'impression d\'être à ma place ?',
      geste: "Repère une personne, dans cet endroit, avec qui tu te sens un peu plus à l'aise. Envoie-lui un message simple ou propose-lui un café cette semaine.",
      mots: "Je me sens un peu perdu·e ici en ce moment. Tu te souviens comment tu as trouvé tes marques, toi ?",
      famille: "Papa, est-ce qu'il t'est arrivé de ne pas te sentir à ta place, à l'école ou au travail ? Qu'est-ce que tu as fait ?",
      liens: ['arbre', 'geno']
    },
    {
      id: 'argent', groupe: 'place', possible: "Une peur transmise peut se transformer : tu peux garder la prudence de ta famille, et laisser la peur.", theme: 'Argent', cycle: 'racine',
      titre: "L'argent me stresse, même quand j'en ai assez",
      joue: "Quand la peur de manquer reste là même quand ton compte va bien, elle ne vient pas forcément de toi. Elle a pu être vécue avant toi, et transmise sans un mot. C'est le cycle de la racine : la sécurité, un toit, de quoi vivre.",
      question: "Quelle phrase sur l'argent j'ai le plus entendue chez moi ?",
      geste: "Ouvre ton appli bancaire et regarde ton solde, simplement, sans rien juger. Puis écris « Aujourd'hui, j'ai de quoi… » et complète avec trois choses vraies.",
      mots: "L'argent me stresse souvent, même quand ça va. Ça te dit qu'on fasse nos budgets ensemble un soir ?",
      famille: "Maman, quand tu étais petite, est-ce qu'on manquait d'argent à la maison ? Comment on en parlait ?",
      liens: ['methode', 'famille']
    },
    {
      id: 'ma-mere', groupe: 'famille', possible: "Tu peux garder le meilleur de ce qu'elle t'a donné, et inventer le reste. C'est souvent comme ça qu'une famille avance d'une génération à l'autre.", theme: 'Ta mère', cycle: 'coeur',
      titre: "Je ressemble à ma mère, et ça m'énerve (ou je fais tout pour ne pas lui ressembler)",
      joue: "Lui ressembler ou tout faire pour ne pas lui ressembler, c'est la même chose vue de deux côtés : dans les deux cas, c'est elle qui sert de repère. C'est le cycle du cœur, parce que ta mère a été ton premier modèle de ce que veut dire aimer et être aimé·e.",
      question: "Qu'est-ce que je refuse chez elle, et qu'est-ce que je voudrais garder ?",
      geste: "Fais deux listes rapides : trois choses de ta mère que tu veux garder, trois que tu choisis de laisser. Tu as le droit d'avoir les deux listes.",
      mots: "Je peux lui ressembler sur certaines choses et faire autrement sur d'autres. C'est moi qui choisis.",
      famille: "Maman, qu'est-ce que tu as pris de ta propre mère, et qu'est-ce que tu as voulu faire autrement ?",
      liens: ['famille', 'geno']
    },
    {
      id: "conflit-couple",
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
      id: "conflit-famille",
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
      id: "amies-eloignent",
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
      id: "parents-separes",
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
      id: "sais-pas",
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
      id: "seule",
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
      id: "semblant",
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
      id: "honte-origines",
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

  var ORDRE = ['silence','pas-ensemble','meme-genre','conflit-couple','conflit-famille','dire-non','amies-eloignent','etudes','partir','parents-separes','ma-mere','retard','ma-place','sais-pas','argent','seule','semblant','honte-origines'];
  SITUATIONS.sort(function (a, b) { return ORDRE.indexOf(a.id) - ORDRE.indexOf(b.id); });

  /* ---------- L'outil ---------- */
  var CLE_VUES = 'vingt-ans-vues';
  var grille = document.getElementById('grille-vt');
  var ecranGrille = document.getElementById('ecran-grille');
  var ecranReponse = document.getElementById('ecran-reponse');
  var outil = document.getElementById('outil');
  var vues = lire(CLE_VUES, []);
  if (!Array.isArray(vues)) vues = [];
  var derniere = null;

  var filtre = 'tout';
  function dessinerGrille() {
    grille.innerHTML = SITUATIONS.filter(function (s) { return filtre === 'tout' || s.groupe === filtre; }).map(function (s) {
      var vue = vues.indexOf(s.id) !== -1;
      return '<li><button class="carte-vt' + (vue ? ' vue' : '') + '" type="button" data-id="' + s.id + '">' +
        '<span class="theme">' + esc(s.theme) + '</span>' +
        '<span class="phrase">« ' + esc(s.titre) + ' »</span>' +
        '<span class="fleche"><span class="va">' + ICONES.fleche + '</span><span class="coche">' + ICONES.coche + '</span></span>' +
        (vue ? '<span class="visuel-cache"> (déjà consultée)</span>' : '') +
        '</button></li>';
    }).join('');
  }

  function lienHTML(cle) {
    var l = LIENS[cle];
    return '<a href="' + l[0] + '"><strong>' + esc(l[1]) + '</strong><span>' + esc(l[2]) + '</span>' + ICONES.fleche + '</a>';
  }

  function nomCycle(c) { return c === 'racine' ? 'Cycle de la racine' : 'Cycle du cœur'; }

  function afficher(id) {
    var s = SITUATIONS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    derniere = id;
    if (vues.indexOf(id) === -1) { vues.push(id); ecrire(CLE_VUES, vues); }

    ecranReponse.innerHTML =
      '<div class="apparait">' +
        '<div class="rep-haut">' +
          '<button class="retour" type="button" data-retour>' + ICONES.retour + 'Choisir une autre situation</button>' +
        '</div>' +
        '<span class="cycle-tag ' + s.cycle + '">' + nomCycle(s.cycle) + '</span>' +
        '<h2 class="rep-titre" id="rep-titre" tabindex="-1" style="margin-top:.8rem">« ' + esc(s.titre) + ' »</h2>' +
        '<div class="rep-bloc"><h3>Ce qui se joue</h3><p>' + esc(s.joue) + '</p></div>' +
        '<div class="rep-bloc question"><h3>La question à te poser</h3><p>' + esc(s.question) + '</p></div>' +
        '<div class="rep-bloc geste"><h3>Ce que tu peux faire aujourd\'hui</h3><p>' + esc(s.geste) + '</p><span class="duree">Moins de 15 minutes</span></div>' +
        '<div class="rep-bloc possible"><h3>Ce qui devient possible</h3><p>' + esc(s.possible) + '</p></div>' +
        '<div class="carte-partage" id="carte-partage"><h3>Ta carte à partager</h3><p class="petit">Cette phrase, rien que pour toi, ou pour quelqu\'un qui en a besoin.</p><div class="carte-apercu" aria-hidden="true"></div><div class="carte-actions"><button class="btn btn-plein" type="button" data-carte="partager">Partager ma carte</button><button class="btn btn-trait" type="button" data-carte="telecharger">Télécharger l\'image</button></div><p class="petit carte-statut" aria-live="polite"></p></div>' +
        (s.avant
          ? '<div class="avant"><h3>Avant d\'envoyer ce message</h3><ol>' +
              AVANT.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') +
            '</ol><p class="alerte">Si cette personne te fait peur, te surveille ou te menace, ce n\'est pas un schéma à comprendre : protège-toi et parles-en. En France, le <a href="tel:3919">3919</a> (gratuit, anonyme) ; au Québec, SOS violence conjugale au <a href="tel:18003639010">1 800 363-9010</a>.</p></div>'
          : '') +
        '<div class="rep-bloc"><h3>Les mots pour le dire</h3><p class="a-copier" id="mots-' + s.id + '">' + esc(s.mots) + '</p>' + boutonCopier('mots-' + s.id) + '</div>' +
        '<div class="rep-bloc"><h3>Et dans ta famille ?</h3><p class="a-copier" id="famille-' + s.id + '">' + esc(s.famille) + '</p>' + boutonCopier('famille-' + s.id) +
          '<p class="petit">À envoyer à ta mère, ton père ou ta grand-mère, en changeant les mots si besoin. Seulement si tu te sens en sécurité pour le faire.</p></div>' +
        '<div class="plus-loin"><h3>Aller plus loin</h3>' + s.liens.map(lienHTML).join('') + '</div>' +
        '<div class="rep-bas"><button class="btn btn-trait" type="button" data-retour>Choisir une autre situation</button></div>' +
      '</div>';

    ecranGrille.hidden = true;
    ecranReponse.hidden = false;
    brancherCopie(ecranReponse);
    preparerCarte(s);
    ecranReponse.querySelectorAll('[data-retour]').forEach(function (b) { b.addEventListener('click', retour); });
    outil.scrollIntoView({ block: 'start' });
    var titre = document.getElementById('rep-titre');
    titre.focus({ preventScroll: true });
  }

  function preparerCarte(s) {
    var zone = document.getElementById('carte-partage');
    if (!zone || !window.GenesoliaCarte) { if (zone) zone.hidden = true; return; }
    var nom = 'genesolia-' + s.id + '.png', canvasPret = null;
    var statut = zone.querySelector('.carte-statut');
    window.GenesoliaCarte.dessiner({ phrase: s.possible, sur: 'Ce qui devient possible', style: s.cycle === 'racine' ? 'champagne' : 'rose' }).then(function (c) {
      canvasPret = c;
      var img = new Image(); img.src = c.toDataURL('image/png'); img.alt = '';
      zone.querySelector('.carte-apercu').appendChild(img);
    });
    zone.addEventListener('click', function (e) {
      var b = e.target.closest('[data-carte]');
      if (!b || !canvasPret) return;
      if (b.getAttribute('data-carte') === 'partager') {
        window.GenesoliaCarte.partager(canvasPret, nom, 'Trouvé sur genesolia.fr').then(function (r) {
          statut.textContent = r === 'telechargement' ? 'Ton téléphone ne permet pas le partage direct : l\'image a été téléchargée.' : r === 'partage' ? 'Merci de faire circuler la douceur.' : '';
        });
      } else {
        window.GenesoliaCarte.telecharger(canvasPret, nom).then(function () { statut.textContent = 'Image téléchargée.'; });
      }
    });
  }

  function retour() {
    ecranReponse.hidden = true;
    ecranReponse.innerHTML = '';
    ecranGrille.hidden = false;
    dessinerGrille();
    var carte = grille.querySelector('[data-id="' + derniere + '"]');
    if (!carte && filtres) { filtres.querySelector('[data-filtre="tout"]').click(); carte = grille.querySelector('[data-id="' + derniere + '"]'); }
    if (carte) {
      carte.scrollIntoView({ block: 'center' });
      carte.focus({ preventScroll: true });
    }
  }

  var filtres = document.getElementById('filtres-vt');
  if (filtres) filtres.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filtre]');
    if (!b) return;
    filtre = b.getAttribute('data-filtre');
    filtres.querySelectorAll('[data-filtre]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    dessinerGrille();
  });

  grille.addEventListener('click', function (e) {
    var b = e.target.closest('.carte-vt');
    if (b) afficher(b.getAttribute('data-id'));
  });
  dessinerGrille();

  /* ---------- Les phrases transmises ---------- */
  var PHRASES = [
    'Il ne faut compter que sur soi.',
    "L'argent ne fait pas le bonheur.",
    'Les hommes partent toujours.',
    'Sois sage et ne fais pas de vagues.',
    'Il faut souffrir pour réussir.',
    'Une fille bien ne se fait pas remarquer.',
    "On ne parle pas d'argent.",
    'Le travail d\'abord, le reste après.',
    'Ce qui se passe à la maison reste à la maison.',
    "Il ne faut pas trop en demander."
  ];
  var CLE_PHRASES = 'vingt-ans-phrases';
  var etat = lire(CLE_PHRASES, null);
  if (!etat || typeof etat !== 'object') etat = {};
  if (!etat.choix || typeof etat.choix !== 'object') etat.choix = {};
  if (typeof etat.nouvelle !== 'string') etat.nouvelle = '';

  var liste = document.getElementById('phrases-vt');
  var recap = document.getElementById('recap');
  var champ = document.getElementById('ma-phrase');
  var statut = document.getElementById('phrases-statut');

  function choixDe(i) { return etat.choix[i] || {}; }
  function sauver() { ecrire(CLE_PHRASES, etat); }

  function dessinerPhrases() {
    liste.innerHTML = PHRASES.map(function (p, i) {
      var c = choixDe(i);
      var cls = c.sort === 'garde' ? ' garde' : c.sort === 'laisse' ? ' laisse' : '';
      return '<li class="phrase-vt' + cls + '" data-i="' + i + '">' +
        '<p class="texte" id="ph-' + i + '">« ' + esc(p) + ' »</p>' +
        '<div class="choix" role="group" aria-labelledby="ph-' + i + '">' +
          '<button type="button" class="b-entendue" data-action="entendue" aria-pressed="' + (c.entendue ? 'true' : 'false') + '">Je l\'ai entendue</button>' +
          '<button type="button" class="b-garde" data-action="garde" aria-pressed="' + (c.sort === 'garde' ? 'true' : 'false') + '">Je la garde</button>' +
          '<button type="button" class="b-laisse" data-action="laisse" aria-pressed="' + (c.sort === 'laisse' ? 'true' : 'false') + '">Je la laisse</button>' +
        '</div></li>';
    }).join('');
  }

  function dessinerRecap() {
    var garde = [], laisse = [], entendues = 0;
    PHRASES.forEach(function (p, i) {
      var c = choixDe(i);
      if (c.entendue) entendues++;
      if (c.sort === 'garde') garde.push(p);
      if (c.sort === 'laisse') laisse.push(p);
    });
    function lst(t, vide) {
      return t.length ? '<ul>' + t.map(function (p) { return '<li>« ' + esc(p) + ' »</li>'; }).join('') + '</ul>' : '<p class="vide">' + vide + '</p>';
    }
    recap.innerHTML =
      '<p class="recap-compte">' + (entendues
        ? 'Tu as reconnu ' + entendues + (entendues > 1 ? ' phrases' : ' phrase') + ' sur ' + PHRASES.length + '.'
        : 'Ton récapitulatif se remplit au fil de tes choix.') + '</p>' +
      '<div class="r-garde"><h3>Ce que tu choisis de garder</h3>' + lst(garde, 'Rien pour l\'instant.') + '</div>' +
      '<div class="r-laisse"><h3>Ce que tu choisis de laisser</h3>' + lst(laisse, 'Rien pour l\'instant.') + '</div>';
  }

  liste.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-action]');
    if (!b) return;
    var li = b.closest('.phrase-vt');
    var i = li.getAttribute('data-i');
    var c = etat.choix[i] || {};
    var a = b.getAttribute('data-action');
    if (a === 'entendue') c.entendue = !c.entendue;
    else c.sort = c.sort === a ? null : a;
    etat.choix[i] = c;
    sauver();
    /* Mise à jour sur place, pour garder le focus sur le bouton */
    li.className = 'phrase-vt' + (c.sort === 'garde' ? ' garde' : c.sort === 'laisse' ? ' laisse' : '');
    li.querySelector('[data-action="entendue"]').setAttribute('aria-pressed', c.entendue ? 'true' : 'false');
    li.querySelector('[data-action="garde"]').setAttribute('aria-pressed', c.sort === 'garde' ? 'true' : 'false');
    li.querySelector('[data-action="laisse"]').setAttribute('aria-pressed', c.sort === 'laisse' ? 'true' : 'false');
    dessinerRecap();
  });

  champ.value = etat.nouvelle;
  champ.addEventListener('input', function () { etat.nouvelle = champ.value; sauver(); });

  document.getElementById('effacer').addEventListener('click', function () {
    etat = { choix: {}, nouvelle: '' };
    effacerCle(CLE_PHRASES);
    champ.value = '';
    dessinerPhrases();
    dessinerRecap();
    statut.textContent = 'Tout est effacé.';
    setTimeout(function () { statut.textContent = ''; }, 3000);
  });

  dessinerPhrases();
  dessinerRecap();

  /* ---------- Les trois questions du mini-arbre ---------- */
  var QS = [
    ['Tu peux me dire les prénoms de tes parents et de tes grands-parents, et d\'où ils venaient ?', 'Pour placer les noms sur ton arbre.'],
    ["Qu'est-ce que tu faisais à mon âge ? Tu vivais où, avec qui ?", 'Pour comparer vos vingt ans.'],
    ["Quelle histoire de la famille tu aimerais que je connaisse ?", 'Pour laisser la personne choisir ce qu\'elle raconte.']
  ];
  var ol = document.getElementById('qs');
  ol.innerHTML = QS.map(function (q, i) {
    return '<li><p class="q" id="mq-' + i + '">« ' + esc(q[0]) + ' »</p><p class="pour">' + esc(q[1]) + '</p>' + boutonCopier('mq-' + i, 'Copier la question') + '</li>';
  }).join('');
  /* On copie la question sans les guillemets */
  ol.querySelectorAll('.q').forEach(function (p, i) { p.setAttribute('data-texte', QS[i][0]); });
  brancherCopie(ol);
})();

/* ---------- Le guide « Régler un conflit » ---------- */
(function () {
  var zone = document.getElementById('conflit-etapes');
  var choix = document.getElementById('conflit-avec');
  if (!zone || !choix) return;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var AVEC = {
    couple: {
      calme: "J'ai besoin qu'on en reparle, mais pas à chaud. Ce soir, ça te va ?",
      je: "Quand tu as annulé à la dernière minute, je me suis senti·e mis·e de côté. J'ai besoin de compter pour toi.",
      ecoute: "Si je comprends bien, toi tu t'es senti·e sous pression. C'est ça ?",
      accord: "La prochaine fois que l'un de nous ne peut pas, on se prévient avant. Ça te va ?"
    },
    parent: {
      calme: "Je n'ai pas envie qu'on se dispute. On peut en reparler demain, au calme ?",
      je: "Quand tu critiques mes choix devant tout le monde, je me sens petit·e, et j'ai envie de me fermer.",
      ecoute: "Si je comprends bien, tu as peur que je me trompe et que je galère. C'est ça ?",
      accord: "Tu peux me dire tes inquiétudes, et moi je te tiens au courant de mes projets. On essaie comme ça ?"
    },
    amie: {
      calme: "Je tiens à toi, et je n'ai pas aimé comment ça s'est passé. On s'appelle demain ?",
      je: "Quand j'ai vu que vous étiez sorties sans moi, je me suis senti·e laissé·e de côté.",
      ecoute: "Si je comprends bien, tu pensais que je n'étais pas dispo. C'est ça ?",
      accord: "La prochaine fois, on se pose la question franchement, même si l'une de nous dit non."
    },
    fratrie: {
      calme: "On s'est énervés tous les deux. On en reparle quand on sera calmés ?",
      je: "Quand tu prends mes affaires sans demander, j'ai l'impression que rien n'est à moi.",
      ecoute: "Si je comprends bien, tu as l'impression que les parents te passent moins de choses qu'à moi. C'est ça ?",
      accord: "On se demande avant de prendre quelque chose à l'autre, et on arrête de se comparer devant les parents."
    }
  };
  function copier(btn) {
    var p = document.getElementById(btn.getAttribute('data-cible'));
    var txt = p ? p.textContent.replace(/ | /g, ' ') : '';
    var fin = function () { btn.classList.add('ok'); btn.lastChild.textContent = 'Copié'; setTimeout(function () { btn.classList.remove('ok'); btn.lastChild.textContent = 'Copier'; }, 1800); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(fin, function () { repli(txt); fin(); });
    else { repli(txt); fin(); }
  }
  function repli(txt) {
    var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove();
  }
  function phrase(id, txt) {
    return '<p class="a-copier" id="' + id + '">' + esc(txt) + '</p><button class="copier" type="button" data-cible="' + id + '"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="5" width="8" height="9" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M3 11V4a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><span>Copier</span></button>';
  }
  function dessiner(qui) {
    var d = AVEC[qui];
    zone.innerHTML =
      '<li><h3>Laisse retomber la température</h3><p>Ne règle rien à chaud, ni par un long message. Attends quelques heures et propose un moment pour en parler, de vive voix si possible.</p>' + phrase('c-calme', d.calme) + '</li>' +
      '<li><h3>Trouve ce qui t\'a vraiment touché·e</h3><p>Sépare ce qui s\'est passé de ce que ça a réveillé en toi. Est-ce que ça touche ta place et ta sécurité (la racine) ? Ou le fait de te sentir aimé·e et compris·e (le cœur) ? Souvent, c\'est là que se trouve le vrai sujet.</p></li>' +
      '<li><h3>Parle en « je »</h3><p>Dis ce que tu as ressenti plutôt que ce que l\'autre a fait de mal. Un « je me suis senti·e » s\'entend beaucoup mieux qu\'un « tu ne penses qu\'à toi ».</p>' + phrase('c-je', d.je) + '</li>' +
      '<li><h3>Écoute pour comprendre</h3><p>Laisse l\'autre parler jusqu\'au bout, sans préparer ta réponse. Puis redis avec tes mots ce que tu as compris. C\'est souvent là que le malentendu se dénoue.</p>' + phrase('c-ecoute', d.ecoute) + '</li>' +
      '<li><h3>Cherchez un petit accord</h3><p>Pas besoin de tout régler d\'un coup. Mettez-vous d\'accord sur une seule chose pour la prochaine fois, et revoyez-la ensemble dans quelques semaines.</p>' + phrase('c-accord', d.accord) + '</li>';
    zone.querySelectorAll('.copier').forEach(function (b) { b.addEventListener('click', function () { copier(b); }); });
  }
  choix.addEventListener('click', function (e) {
    var b = e.target.closest('[data-avec]');
    if (!b) return;
    choix.querySelectorAll('[data-avec]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    dessiner(b.getAttribute('data-avec'));
  });
  dessiner('couple');
})();
