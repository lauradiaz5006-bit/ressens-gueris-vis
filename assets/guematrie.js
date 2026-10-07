/* Genesolia · la valeur des lettres anciennes et l'arbre de vie
   Transcription phonétique d'un prénom vers les 22 lettres anciennes, valeur totale, sphère de l'arbre de vie, chemins des lettres. */
(function () {
  'use strict';

  /* Les 22 lettres : nom usuel, valeur, image traditionnelle, chemin sur l'arbre (sphères reliées, attribution occidentale classique), caractère */
  var LETTRES = {
    aleph: { nom: 'Aleph', v: 1, h: 'א', image: 'le bœuf', chemin: [1, 2], texte: "Le souffle premier, l'élan avant toute chose. Il invite à faire confiance et à oser commencer." },
    beth: { nom: 'Beth', v: 2, h: 'ב', image: 'la maison', chemin: [1, 3], texte: "La maison qui accueille et abrite. Elle parle de ton foyer, de ce que tu construis pour toi et pour les tiens." },
    guimel: { nom: 'Guimel', v: 3, h: 'ג', image: 'le chameau', chemin: [1, 6], texte: "Le voyageur qui traverse le désert et porte. Il parle de don, de passage, de ce que l'on transmet d'un lieu à l'autre." },
    daleth: { nom: 'Daleth', v: 4, h: 'ד', image: 'la porte', chemin: [2, 3], texte: "La porte qui s'ouvre ou se ferme. Elle parle des seuils de ta vie et du courage de les franchir." },
    he: { nom: 'Hé', v: 5, h: 'ה', image: 'la fenêtre, le souffle', chemin: [2, 6], texte: "La fenêtre par où entre la lumière, le souffle qui anime. Elle parle de ta façon de respirer la vie et de l'exprimer." },
    vav: { nom: 'Vav', v: 6, h: 'ו', image: 'le crochet, le lien', chemin: [2, 4], texte: "Le crochet qui relie deux choses. Il parle des liens, de ce qui attache le ciel et la terre, les générations entre elles." },
    zain: { nom: 'Zaïn', v: 7, h: 'ז', image: "l'outil, l'épée", chemin: [3, 6], texte: "L'outil qui tranche et choisit. Il parle de discernement, de la capacité à décider ce qui est juste pour toi." },
    heth: { nom: 'Heth', v: 8, h: 'ח', image: "l'enclos", chemin: [3, 5], texte: "L'enclos qui protège et délimite. Il parle de tes limites, de ce que tu protèges et de ce que tu enfermes." },
    teth: { nom: 'Teth', v: 9, h: 'ט', image: 'le serpent, le panier', chemin: [4, 5], texte: "Le serpent lové ou le panier qui contient. Il parle de force intérieure et de ce qui mûrit en secret." },
    yod: { nom: 'Yod', v: 10, h: 'י', image: 'la main', chemin: [4, 6], texte: "La plus petite des lettres, la main qui agit. Elle parle de ce que tu fais de tes mains, des petits gestes qui changent tout." },
    kaf: { nom: 'Kaf', v: 20, h: 'כ', image: 'la paume', chemin: [4, 7], texte: "La paume ouverte qui reçoit et donne. Elle parle de ta façon d'accueillir ce que la vie t'offre." },
    lamed: { nom: 'Lamed', v: 30, h: 'ל', image: "l'aiguillon", chemin: [5, 6], texte: "L'aiguillon qui pousse à avancer, la plus haute des lettres. Il parle d'apprendre, d'enseigner et de se dépasser." },
    mem: { nom: 'Mem', v: 40, h: 'מ', image: "l'eau", chemin: [5, 8], texte: "L'eau, les eaux d'où naît la vie. Elle parle de tes émotions, de la mémoire et de ce qui coule d'une génération à l'autre." },
    noun: { nom: 'Noun', v: 50, h: 'נ', image: 'le poisson', chemin: [6, 7], texte: "Le poisson qui vit dans les profondeurs. Il parle de fidélité, de continuité et de ce qui se perpétue." },
    samekh: { nom: 'Samekh', v: 60, h: 'ס', image: "l'appui", chemin: [6, 9], texte: "L'appui, le soutien, le cercle qui entoure. Il parle de ce sur quoi tu t'appuies et de la confiance." },
    ayin: { nom: 'Ayin', v: 70, h: 'ע', image: "l'œil, la source", chemin: [6, 8], texte: "L'œil et la source. Il parle de ta façon de voir, et de ce qui jaillit quand tu regardes vraiment." },
    pe: { nom: 'Pé', v: 80, h: 'פ', image: 'la bouche', chemin: [7, 8], texte: "La bouche qui parle. Elle parle de la parole, des mots dits et des mots tus dans ta famille." },
    tsade: { nom: 'Tsadé', v: 90, h: 'צ', image: "l'hameçon, le juste", chemin: [7, 9], texte: "L'hameçon et la figure du juste. Il parle de droiture, et de ce que tu vas chercher en profondeur." },
    qof: { nom: 'Qof', v: 100, h: 'ק', image: 'la nuque', chemin: [7, 10], texte: "La nuque, l'arrière de la tête. Il parle de ce qui se joue derrière toi, de ce que tu portes sans le voir." },
    resh: { nom: 'Resh', v: 200, h: 'ר', image: 'la tête', chemin: [8, 9], texte: "La tête, le commencement, le chef. Elle parle de ta pensée et de la place que tu prends." },
    shin: { nom: 'Shin', v: 300, h: 'ש', image: 'la dent, le feu', chemin: [8, 10], texte: "La dent et le feu qui transforment. Il parle de changement, de ce qui brûle l'ancien pour laisser venir le nouveau." },
    tav: { nom: 'Tav', v: 400, h: 'ת', image: 'la marque, le signe', chemin: [9, 10], texte: "La dernière lettre, la marque, le sceau. Elle parle d'accomplissement et de ce que tu laisses comme trace." }
  };

  /* Les dix sphères de l'arbre de vie */
  var SPHERES = {
    1: { nom: 'La Couronne', ancien: 'Kéter', mots: ['élan', 'sens', 'unité'], essence: "La sphère du sommet, la source de tout l'arbre. Un prénom qui y conduit parle d'élan premier et de quête de sens : le besoin de savoir pourquoi tu es là.", force: "Une grande capacité à donner une direction, à inspirer, à voir l'ensemble.", defi: "Rester en lien avec le concret, et ne pas te sentir seul·e au sommet.", famille: "Dans une lignée, la Couronne évoque la personne qui a ouvert la voie, ou celle par qui une question de sens arrive.", question: "Qu'est-ce qui donne du sens à ta vie aujourd'hui, et d'où te vient cette quête ?" },
    2: { nom: 'La Sagesse', ancien: 'Hokhma', mots: ['intuition', 'idée', 'jaillissement'], essence: "La sphère de l'éclair, de l'idée qui jaillit avant d'avoir une forme. Un prénom qui y conduit parle d'intuition et de créativité.", force: "Les idées, les intuitions, la capacité à voir ce qui n'existe pas encore.", defi: "Prendre le temps de donner forme à ce qui te traverse.", famille: "Dans une lignée, la Sagesse évoque les esprits créatifs, parfois incompris, qui ont eu une longueur d'avance.", question: "Quelle intuition as-tu laissée de côté, et que se passerait-il si tu l'écoutais ?" },
    3: { nom: "L'Intelligence", ancien: 'Bina', mots: ['compréhension', 'structure', 'matrice'], essence: "La sphère qui reçoit l'idée et lui donne une forme, comme une matrice. Un prénom qui y conduit parle de compréhension profonde et de patience.", force: "Comprendre, structurer, faire mûrir ce qui t'est confié.", defi: "Ne pas porter seul·e le poids de tout comprendre, et accueillir aussi ce qui échappe.", famille: "Dans une lignée, l'Intelligence évoque les mères et les figures qui ont porté, structuré, tenu la famille.", question: "Qu'as-tu porté et fait mûrir pour les autres, et que veux-tu faire mûrir pour toi ?" },
    4: { nom: 'La Bonté', ancien: 'Hessed', mots: ['générosité', 'amour', 'ouverture'], essence: "La sphère de la générosité sans limite, de l'amour qui se donne. Un prénom qui y conduit parle d'ouverture et de chaleur.", force: "Donner, accueillir, aimer largement.", defi: "Donner sans t'épuiser, et accepter de recevoir à ton tour.", famille: "Dans une lignée, la Bonté évoque celles et ceux qui ont tout donné, parfois au prix de leurs propres besoins.", question: "À qui donnes-tu sans compter, et qui prend soin de te donner à toi ?" },
    5: { nom: 'La Force', ancien: 'Guevoura', mots: ['rigueur', 'limite', 'courage'], essence: "La sphère de la limite juste, de la rigueur qui protège. Un prénom qui y conduit parle de courage et de la capacité à dire non.", force: "Le courage, la clarté, le sens de la justice et des limites.", defi: "Ne pas te durcir, et laisser de la place à la douceur.", famille: "Dans une lignée, la Force évoque les règles transmises, les sévérités, mais aussi ceux qui ont su protéger.", question: "Quelle limite as-tu besoin de poser aujourd'hui, et pour protéger quoi ?" },
    6: { nom: 'La Beauté', ancien: 'Tiferet', mots: ['harmonie', 'cœur', 'équilibre'], essence: "La sphère du centre, le cœur de l'arbre, où tout s'équilibre. Un prénom qui y conduit parle d'harmonie et d'authenticité.", force: "Relier les contraires, trouver l'équilibre, être fidèle à toi-même.", defi: "Ne pas chercher à tout concilier au point de t'oublier.", famille: "Dans une lignée, la Beauté évoque les personnes qui ont fait le lien, réconcilié, tenu le centre de la famille.", question: "Quand ce que tu fais rejoint-il vraiment ce que tu es ?" },
    7: { nom: 'La Victoire', ancien: 'Netsah', mots: ['persévérance', 'désir', 'élan vital'], essence: "La sphère de la persévérance et du désir qui dure. Un prénom qui y conduit parle d'endurance et de passion.", force: "Tenir dans la durée, aller au bout de ce que tu désires.", defi: "Savoir t'arrêter, et ne pas confondre persévérance et acharnement.", famille: "Dans une lignée, la Victoire évoque celles et ceux qui ont tenu bon dans les épreuves, et transmis cette ténacité.", question: "Quel désir t'anime depuis longtemps, et qu'est-ce qui t'empêche de le vivre ?" },
    8: { nom: 'La Gloire', ancien: 'Hod', mots: ['pensée', 'parole', 'reconnaissance'], essence: "La sphère de la pensée, des mots et de la forme. Un prénom qui y conduit parle de communication et de clarté.", force: "Nommer, expliquer, transmettre par la parole et l'écrit.", defi: "Ne pas rester dans la tête, et laisser parler le cœur.", famille: "Dans une lignée, la Gloire évoque les mots qui ont compté : les récits, mais aussi les phrases qui enferment.", question: "Quelle phrase entendue dans ta famille t'accompagne encore, et veux-tu la garder ?" },
    9: { nom: 'Le Fondement', ancien: 'Yessod', mots: ['lien', 'mémoire', 'imaginaire'], essence: "La sphère des liens, de l'imaginaire et de la mémoire, juste au-dessus de la terre. Un prénom qui y conduit parle de relations et de rêves.", force: "Créer du lien, imaginer, sentir ce qui relie les êtres.", defi: "Distinguer tes propres émotions de celles que tu as reçues.", famille: "Dans une lignée, le Fondement est la sphère de la mémoire familiale : ce qui se transmet sans être dit, d'une génération à l'autre.", question: "Quel lien de ta famille aimerais-tu mieux comprendre ?" },
    10: { nom: 'Le Royaume', ancien: 'Malkhout', mots: ['ancrage', 'matière', 'présence'], essence: "La sphère de la terre, du corps et du quotidien, où tout l'arbre prend racine. Un prénom qui y conduit parle d'ancrage et de présence.", force: "Être là, concrètement, et faire exister les choses.", defi: "Te souvenir que le quotidien a aussi besoin de sens et de rêve.", famille: "Dans une lignée, le Royaume évoque la terre, la maison, ce que les ancêtres ont bâti de leurs mains.", question: "Où te sens-tu vraiment chez toi, et qu'as-tu reçu de ceux qui ont bâti avant toi ?" }
  };

  var VOY = 'aeiouyàâäéèêëîïôöùûü';
  function estVoy(c) { return !!c && VOY.indexOf(c) >= 0; }
  var GARDER_S = ['lucas', 'marcus', 'jonas', 'mathis', 'yanis', 'elias', 'ilias', 'iris', 'doris', 'boris', 'cyrus', 'agnes', 'ines', 'anais', 'lilas', 'thais', 'lois', 'nils', 'jules'];
  var GARDER_X = ['felix', 'max', 'alex', 'maxence'];
  function sansAccent(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  /* prénom (un seul mot) vers une suite de clés de lettres */
  function transcrire(prenom) {
    var s = String(prenom || '').toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüçœæ-]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
    s = s.split('-')[0].replace(/^h(?=[aeiouyàâäéèêëîïôöùûü])/, '');
    if (!s) return [];
    var base = sansAccent(s);
    // finales muettes
    var der = s.slice(-1), avant = s.charAt(s.length - 2);
    if (/er$/.test(base) && base.length > 3 && base !== 'esther') s = s.slice(0, -2) + 'é';
    else if (/ez$/.test(base) && base.length > 3) s = s.slice(0, -2) + 'é';
    else if ('stdz'.indexOf(der) >= 0 && s.length > 2 && GARDER_S.indexOf(base) < 0 && 'èëï'.indexOf(avant) < 0 && (estVoy(avant) || (avant === 'r' && der !== 's') || (avant === 'n' && 'td'.indexOf(der) >= 0))) {
      s = s.slice(0, -1);
    } else if (der === 'x' && GARDER_X.indexOf(base) < 0 && estVoy(avant)) s = s.slice(0, -1);
    if (/[^aeiouyàâéèêëîïôû]es$/.test(s) && GARDER_S.indexOf(base) < 0) s = s.slice(0, -2);
    var out = [], i = 0, n = s.length;
    function a(k) { out.push(k); }
    while (i < n) {
      var c = s[i], c2 = s.substr(i, 2), c3 = s.substr(i, 3), prev = s[i - 1], next = s[i + 1], debut = i === 0;
      if (c3 === 'eau') { if (debut) a('aleph'); a('vav'); i += 3; continue; }
      if (c2 === 'ch') { a('lr'.indexOf(s[i + 2]) >= 0 ? 'kaf' : 'shin'); i += 2; continue; }
      if (c2 === 'cq') { i++; continue; }
      if (c2 === 'ph') { a('pe'); i += 2; continue; }
      if (c2 === 'th') { a('tav'); i += 2; continue; }
      if (c2 === 'ts' || c2 === 'tz') { a('tsade'); i += 2; continue; }
      if (c2 === 'qu') { a('qof'); i += 2; continue; }
      if (c2 === 'ck') { a('kaf'); i += 2; continue; }
      if (c2 === 'gn') { a('noun'); a('yod'); i += 2; continue; }
      if (c2 === 'gu' && 'eéèêi'.indexOf(s[i + 2]) >= 0) { a('guimel'); i += 2; continue; }
      if (c2 === 'ou' || c2 === 'où' || c2 === 'au') { if (debut) a('aleph'); a('vav'); i += 2; continue; }
      if (c2 === 'oi' || c2 === 'oî') { if (debut) a('aleph'); a('vav'); a('aleph'); i += 2; continue; }
      if ((c2 === 'ai' || c2 === 'ei') && i + 2 < n) { if (debut) a('aleph'); i += 2; continue; }
      if (c === next && !estVoy(c)) { i++; continue; } // consonnes doubles
      if (estVoy(c)) {
        var finale = i === n - 1;
        if (debut) { a('aleph'); if ('ouôûù'.indexOf(c) >= 0) a('vav'); else if ('iîïy'.indexOf(c) >= 0) a('yod'); i++; continue; }
        if ('iîïy'.indexOf(c) >= 0) { a('yod'); i++; continue; }
        if ('oôöuûüù'.indexOf(c) >= 0) { a('vav'); i++; continue; }
        if ('aàâäéèêë'.indexOf(c) >= 0) { if (finale) a('he'); else if (estVoy(prev) || (estVoy(next) && 'éèêë'.indexOf(c) >= 0)) a('aleph'); i++; continue; }
        i++; continue; // e muet ou intérieur
      }
      switch (c) {
        case 'b': a('beth'); break;
        case 'c': case 'ç': a(c === 'ç' || 'eéèêiîy'.indexOf(next) >= 0 ? 'samekh' : 'kaf'); break;
        case 'd': a('daleth'); break;
        case 'f': a('pe'); break;
        case 'g': case 'j': a('guimel'); break;
        case 'h': break;
        case 'k': a('kaf'); break;
        case 'l': a('lamed'); break;
        case 'm': a('mem'); break;
        case 'n': a('noun'); break;
        case 'p': a('pe'); break;
        case 'q': a('qof'); break;
        case 'r': a('resh'); break;
        case 's': a(estVoy(prev) && estVoy(next) ? 'zain' : 'samekh'); break;
        case 't': a('teth'); break;
        case 'v': case 'w': a('vav'); break;
        case 'x': a('kaf'); a('samekh'); break;
        case 'z': a('zain'); break;
      }
      i++;
    }
    return out;
  }
  function sphereDe(total) { var x = total; while (x > 10) x = String(x).split('').reduce(function (s, d) { return s + +d; }, 0); return x || 10; }
  function lire(cles) {
    var total = cles.reduce(function (s, k) { return s + LETTRES[k].v; }, 0);
    var sp = total ? sphereDe(total) : null;
    var chemins = {}; cles.forEach(function (k) { chemins[k] = 1; });
    return { lettres: cles, total: total, sphere: sp, chemins: Object.keys(chemins) };
  }
  function prenom(p) { return lire(transcrire(p)); }

  window.Guematrie = { LETTRES: LETTRES, SPHERES: SPHERES, transcrire: transcrire, lire: lire, prenom: prenom, sphereDe: sphereDe };
})();
