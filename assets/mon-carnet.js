/* Genesolia · Le carnet du mois, version interactive (le moteur, commun à tous les mois)
   - Contenu : window.GENESOLIA_CARNET (assets/carnets/AAAA-MM.js). Tout ce qui est propre au mois est là-bas.
   - Format livre : sur ordinateur, un livre ouvert dont on tourne les pages (flèches du clavier) ;
     sur téléphone, une page à la fois, en glissant du doigt. Les onglets mènent directement à une page.
   - Ouverture et clôture du mois : « Ma météo intérieure », enregistrée dans Mon chemin (table resultats, outil « meteo »).
   - Réponses : dans l'espace (table carnets) si la personne est connectée ; sinon dans le navigateur,
     effacées à sa fermeture (règle commune du site : window.GenesoliaDonnees dans site.js).
   - Impression au choix : « Simple » (texte et réponses) ou « Avec le décor ». Chaque page sur une nouvelle feuille.
   - Rappels : un fichier .ics (4 rappels hebdomadaires et le bilan), sans aucun e-mail automatique. */
(function () {
  'use strict';
  var C = window.GENESOLIA_CARNET; if (!C) return;
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CLE_LOCALE = 'genesolia-carnet-' + C.mois;
  var sb = null, user = null, prenom = '', D = { v: {} }, minuteur = null, historique = [];
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var racine = document.getElementById('carnet');
  var DECOR = C.decor || {}, IMG = DECOR.pages || {}, MOTS = C.mots || {};
  var NOM_MOIS = String(C.nomMois || '').split(' ')[0];
  var ORNEMENT = '<svg class="mc-orn" viewBox="0 0 120 12" aria-hidden="true"><path d="M2 6h46M72 6h46" stroke="currentColor" stroke-width="1"/><circle cx="60" cy="6" r="3.2" fill="none" stroke="currentColor"/><circle cx="52" cy="6" r="1.3" fill="currentColor"/><circle cx="68" cy="6" r="1.3" fill="currentColor"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(t) {
    return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([a-z0-9\-]+\.html(?:#[a-z\-]+)?)\)/g, '<a href="$2">$1</a>');
  }
  function paras(l) { return (l || []).map(function (x) { return '<p>' + md(x) + '</p>'; }).join(''); }
  function de(mot) { return /^[aeiouyhéèêâîôû]/i.test(mot) ? 'd’' + mot : 'de ' + mot; }
  function q(x) { return typeof x === 'string' ? { q: x } : (x || {}); }
  function ex(ph, i) { return Array.isArray(ph) ? ph[i || 0] : ph; }

  /* ───── Champs : chaque consigne est une phrase complète, avec un exemple dans le champ ───── */
  function zone(k, question, opts) {
    opts = opts || {};
    var ph = opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '';
    return '<label class="mc-champ"><span class="mc-q">' + esc(question) + '</span>' +
      (opts.court ? '<input type="text" data-k="' + k + '"' + ph + '>' : '<textarea data-k="' + k + '" rows="' + (opts.lignes || 3) + '"' + ph + '></textarea>') +
      (opts.aide ? '<small class="mc-aide" data-aide="' + k + '">' + esc(opts.aide) + '</small>' : '') + '</label>';
  }
  function curseur(k, question, bas, haut) {
    return '<div class="mc-curseur mc-vide" data-curseur="' + k + '"><span class="mc-q">' + esc(question) + '</span><div class="mc-ligne"><span class="mc-min">' + esc(bas || '0') + '</span>' +
      '<input type="range" min="0" max="10" step="1" value="5" data-k="' + k + '" aria-label="' + esc(question) + '"><span class="mc-max">' + esc(haut || '10') + '</span></div>' +
      '<b class="mc-val" data-val="' + k + '" aria-live="polite">Place le curseur</b></div>';
  }
  function choix(k, question, options, multiple) {
    return '<fieldset class="mc-choix"><legend class="mc-q">' + esc(question) + '</legend>' + options.map(function (o, i) {
      return '<label><input type="' + (multiple ? 'checkbox' : 'radio') + '" name="' + k + '" value="' + esc(o) + '" data-k="' + k + (multiple ? '-' + i : '') + '"' + (multiple ? '' : ' data-radio') + '><span>' + esc(o) + '</span></label>';
    }).join('') + '</fieldset>';
  }
  function encadre(titre, corps, classe) { return '<aside class="mc-encadre ' + (classe || '') + '">' + (titre ? '<p class="mc-encadre-t">' + esc(titre) + '</p>' : '') + corps + '</aside>'; }
  function plus(id, titre, corps) {
    return '<details class="mc-plus" data-plus="' + id + '"><summary><span class="mc-plus-sur">Pour aller plus loin · facultatif</span>' + esc(titre) + '</summary><div class="mc-plus-corps">' + corps + '</div></details>';
  }

  /* ───── Ma météo intérieure ───── */
  var ECHELLES = [
    ['energie', 'Énergie', 'Quel est ton niveau d’énergie en ce moment ?'],
    ['humeur', 'Humeur', 'Comment est ton humeur, ces jours-ci ?'],
    ['confiance', 'Confiance', 'Quelle confiance as-tu en toi ?'],
    ['serenite', 'Sérénité', 'À quel point te sens-tu serein·e, apaisé·e ?'],
    ['liens', 'Entourage', 'À quel point te sens-tu entouré·e, soutenu·e ?'],
    ['elan', 'Élan', 'À quel point sens-tu que tu avances dans ta vie ?']
  ];
  var METEOS = ['Grand soleil', 'Éclaircies', 'Nuageux', 'Brouillard', 'Pluie', 'Orage', 'Arc-en-ciel'];
  var COUL_DEBUT = '#7E3A6E', COUL_FIN = '#B7833F';
  function blocEchelles(prefixe) {
    return '<div class="mc-echelles">' + ECHELLES.map(function (e) { return curseur(prefixe + '-' + e[0], e[2], 'au plus bas', 'au plus haut'); }).join('') + '</div>' +
      choix(prefixe + '-meteo', 'Si ton état intérieur était une météo, ce serait…', METEOS) +
      zone(prefixe + '-mot', 'En un mot, comment te sens-tu ?', { court: true, ph: 'Exemple : fatigué·e, curieux·se, impatient·e…' });
  }

  /* ───── La page de gauche : illustration, titre, mot de la coach, rappel de l'objectif ───── */
  function gauche(id, sur, titre, intro, extra) {
    var img = IMG[id];
    return '<div class="mc-g-in">' +
      (img ? '<img class="mc-illu" src="' + esc(img) + '" alt="" width="320" height="320" loading="lazy">' : '') +
      '<p class="mc-sur">' + esc(sur) + '</p><h2>' + esc(titre) + '</h2>' + ORNEMENT +
      (intro || '') +
      (MOTS[id] ? '<p class="mc-mot"><span>Le mot de ta coach</span>' + md(MOTS[id]) + '</p>' : '') +
      (id !== 'ouverture' ? '<div class="mc-rappel-obj" data-rappel-obj hidden></div>' : '') +
      (extra || '') + '</div>';
  }

  var PAGES = [];
  PAGES.push({ id: 'ouverture', nom: 'Ma météo du début', g: function () {
    return gauche('ouverture', 'Pour commencer le mois · 10 minutes', 'Ma météo du début de mois',
      '<p class="mc-intro">Avant d’ouvrir le thème, prends le temps de te poser. Ces questions viennent de l’autocoaching et de la PNL : elles t’aident à savoir où tu en es, à donner une direction claire à ton mois, et à mesurer ensuite le chemin parcouru.</p>' +
      '<p>Il n’y a pas de bonne réponse, seulement la tienne, aujourd’hui. Si tu as cinq minutes, remplis la météo et ton objectif. Le reste peut attendre.</p>');
  }, d: function () {
    return '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment te sens-tu ?</h3><p class="mc-consigne">Place chaque curseur sans réfléchir longtemps : la première réponse est souvent la plus juste. 0, c’est au plus bas ; 10, au plus haut. Par exemple, si tu dors mal depuis une semaine, ton énergie est peut-être à 3, et c’est très bien de le voir.</p>' + blocEchelles('md') + '</section>' +
      '<section class="mc-etape"><h3><span>2</span> Ton objectif du mois, bien formulé</h3><p class="mc-consigne">Un objectif clair met ton énergie en mouvement. On le formule en positif (ce que tu veux, pas ce que tu ne veux plus), il dépend de toi, et tu sais à quoi tu reconnaîtras qu’il est atteint. Par exemple, « ne plus me laisser marcher dessus » devient « dire calmement ce dont j’ai besoin ».</p>' +
        zone('obj-quoi', 'Qu’est-ce que tu veux pour toi ce mois-ci ? Commence ta phrase par « Je veux… »', { court: true, ph: 'Exemple : je veux dire ce dont j’ai besoin au moment où je le ressens', aide: 'Formule ce que tu veux à la place de ce que tu ne veux plus.' }) +
        choix('obj-depend', 'Est-ce que cet objectif dépend de toi ?', ['Oui, entièrement', 'En partie', 'Pas vraiment']) +
        zone('obj-part', 'Quelle part de cet objectif dépend vraiment de toi ?', { court: true, ph: 'Exemple : je ne peux pas changer ma cheffe, mais je peux choisir ma réponse' }) +
        zone('obj-contexte', 'Où, quand et avec qui veux-tu que ça change ?', { court: true, ph: 'Exemple : au travail le lundi, et le soir au téléphone avec ma sœur' }) +
        '<div class="mc-trois"><p class="mc-q">À quoi sauras-tu que tu l’as atteint ? Imagine la scène avec tes sens.</p>' +
          zone('obj-voir', 'Qu’est-ce que tu verras ?', { lignes: 2, ph: 'Exemple : des soirées libres dans mon agenda' }) +
          zone('obj-entendre', 'Qu’est-ce que tu entendras, ou te diras ?', { lignes: 2, ph: 'Exemple : « Merci de m’avoir prévenu·e. »' }) +
          zone('obj-ressentir', 'Qu’est-ce que tu ressentiras dans ton corps ?', { lignes: 2, ph: 'Exemple : les épaules plus légères' }) + '</div>' +
        zone('obj-ecologie', 'Qu’est-ce que ça va changer pour toi et pour tes proches ? Y a-t-il quelque chose que tu risques de perdre ?', { lignes: 2, ph: 'Exemple : j’aurai plus de temps pour moi. Au début, je risque de décevoir un peu.' }) +
        zone('obj-ressources', 'Sur quoi peux-tu t’appuyer ? Ce que tu as déjà, qui peut t’aider, une fois où tu as réussi quelque chose de semblable.', { lignes: 3, ph: 'Exemple : mon amie Claire, ma patience, la fois où j’ai osé demander un congé.' }) +
        zone('obj-pas', 'Quel est ton tout premier pas, à faire dans les 48 heures ?', { court: true, ph: 'Exemple : bloquer jeudi soir dans mon agenda, rien que pour moi' }) +
        curseur('obj-croyance', 'À quel point crois-tu pouvoir y arriver ?', 'pas du tout', 'complètement') +
        zone('obj-un-point', 'Qu’est-ce qui te ferait gagner un point de plus sur ce curseur ?', { court: true, ph: 'Exemple : en parler à une amie qui m’encouragera' }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>3</span> Te projeter</h3><p class="mc-consigne">Ferme les yeux quelques secondes et imagine-toi à la fin du mois, ton objectif atteint. Où es-tu ? Qu’est-ce que tu vois, qu’est-ce que tu entends, comment te sens-tu dans ton corps ? Puis écris.</p>' +
        zone('proj-mois', 'À la fin du mois, que vois-tu, qu’entends-tu, que ressens-tu ?', { lignes: 4, ph: 'Exemple : je suis sur mon canapé un mardi soir, le téléphone éteint, et je me sens à ma place.' }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>4</span> Ta phrase du mois</h3>' + zone('phrase', 'Quelle phrase veux-tu te redire tout le mois ?', { court: true, ph: 'Exemple : ' + C.citation }) + '</section>' +
      plus('lettre', 'Ta lettre de dans un an',
        '<p class="mc-consigne">Écris à la personne que tu es aujourd’hui, comme si tu étais déjà un an plus tard. Raconte-lui ce qui a changé, ce que tu as compris, ce que tu veux lui dire pour l’encourager.</p>' +
        zone('proj-an', 'Ta lettre, écrite depuis ' + C.nomMois.replace(/\d+/, function (a) { return +a + 1; }) + ', à la personne que tu es aujourd’hui', { lignes: 7, ph: 'Exemple : Je t’écris depuis l’an prochain. Je sais que tu doutes en ce moment…' }) +
        '<p class="mc-note">Si tu as un compte et que tu enregistres ta météo du début, ta lettre est gardée dans ton espace. Dans un an, elle t’y attendra.</p>') +
      plus('ancrage', 'Ton ancrage ressource',
        '<p class="mc-consigne">Repense à un moment où tu t’es senti·e fort·e, calme ou fier·e de toi. Revis-le : ce que tu voyais, ce que tu entendais, ce que tu ressentais. Quand la sensation est au plus fort, presse doucement ton pouce contre ton index pendant quelques secondes. Refais-le trois fois. Ce geste devient ton ancre : tu pourras la retrouver quand ta boucle démarre, par exemple juste avant un rendez-vous difficile.</p>' +
        zone('ancre-souvenir', 'Quel moment ressource choisis-tu ? Raconte-le en quelques mots.', { lignes: 2, ph: 'Exemple : le jour où j’ai fini ma première course de 10 km, sous la pluie, en riant.' }) +
        zone('ancre-mot', 'Quel mot résume ce moment ?', { court: true, ph: 'Exemple : vivant·e' })) +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="debut">Enregistrer ma météo du début</button><p class="mc-retour" data-retour="debut" aria-live="polite"></p></div>';
  } });

  PAGES.push({ id: 'theme', nom: 'Le thème', g: function () {
    var T = C.theme;
    return gauche('theme', 'Le thème du mois', T.titre, paras(T.texte));
  }, d: function () {
    var T = C.theme, carte = (DECOR.cartes || {}).theme;
    return '<h3 class="mc-h">' + esc(T.sousTitre) + '</h3>' +
      (carte ? '<figure class="mc-carte"><img src="' + esc(carte[0]) + '" alt="' + esc(carte[1]) + '" width="270" height="338" loading="lazy"></figure>' : '') +
      paras(T.texte2) +
      (T.exemples ? encadre(T.exemplesTitre || 'Au quotidien', '<ul class="mc-liste">' + T.exemples.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>') : '') +
      (T.exempleSpirale ? encadre('Et la spirale ?', '<p>' + md(T.exempleSpirale) + '</p>', 'mc-encadre-or') : '') +
      (T.question ? zone(T.question.k, T.question.q, { lignes: 2, ph: T.question.ph }) : '') +
      citation();
  } });

  PAGES.push({ id: 'comprendre', nom: 'Comprendre', g: function () {
    var K = C.comprendre;
    return gauche('comprendre', 'Comprendre', K.titre, paras(K.texte.slice(0, 1)));
  }, d: function () {
    var K = C.comprendre;
    return paras(K.texte.slice(1)) +
      (K.reperes ? '<div class="mc-reperes">' + K.reperes.map(function (r) { return '<div><p class="mc-encadre-t">' + esc(r.titre) + '</p><ul class="mc-liste">' + r.points.map(function (p) { return '<li>' + md(p) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>' : '') +
      choix(K.choix.k, K.choix.q, K.choix.options) +
      encadre('Dans ton arbre, regarde', (K.regarderIntro ? '<p>' + md(K.regarderIntro) + '</p>' : '') + K.regarder.map(function (r) {
        r = Array.isArray(r) ? { k: r[0], q: r[1] } : r; return zone(r.k, r.q, { lignes: 2, ph: r.ph });
      }).join(''), 'mc-encadre-rose') +
      (K.enLigne ? encadre(K.enLigneTitre || 'Dans ton arbre en ligne', '<p>' + md(K.enLigne) + '</p>') : '') +
      '<div class="mc-outils">' + K.outils.map(function (o) { return '<a class="mc-outil" href="' + o[0] + '" target="_blank" rel="noopener"><b>' + esc(o[1]) + '</b><span>' + esc(o[2]) + '</span></a>'; }).join('') + '</div>';
  } });

  PAGES.push({ id: 'exercices', nom: 'Les exercices', g: function () {
    return gauche('exercices', 'Les exercices du mois', 'Voir, entendre, essayer', C.exercicesIntro ? '<p class="mc-intro">' + md(C.exercicesIntro) + '</p>' : '',
      '<ol class="mc-sommaire">' + C.exercices.map(function (x, i) { return '<li><span>' + (i + 1) + '</span>' + esc(x.titre) + '</li>'; }).join('') + '</ol>');
  }, d: function () {
    return C.exercices.map(function (x, i) {
      var corps = '';
      if (x.type === 'tableau') {
        corps = '<div class="mc-tableau">' + Array.apply(null, { length: x.rangs }).map(function (_, r) {
          return '<div class="mc-rang"><p class="mc-rang-t"><span>' + (r + 1) + '</span>' + esc((x.etiquettes || [])[r] || ('Fois ' + (r + 1))) + '</p>' +
            x.colonnes.map(function (c, j) { c = q(c); return zone(x.k + '-' + r + '-' + j, c.q, { lignes: 2, ph: ex(c.ph, r) }); }).join('') + '</div>';
        }).join('') + '</div>' + (x.apres ? zone(x.apres.k, x.apres.q, { lignes: 2, ph: x.apres.ph }) : '');
      } else if (x.type === 'blocs') {
        corps = Array.apply(null, { length: x.nb }).map(function (_, b) {
          return '<div class="mc-bloc"><p class="mc-rang-t"><span>' + (b + 1) + '</span>Phrase ' + (b + 1) + '</p>' + x.champs.map(function (c, j) { c = q(c); return zone(x.k + '-' + b + '-' + j, c.q, { court: true, ph: ex(c.ph, b) }); }).join('') + '</div>';
        }).join('');
      } else {
        corps = (x.gestes ? '<p class="mc-q">Des idées de gestes, pour t’inspirer :</p><ul class="mc-pastilles">' + x.gestes.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>' : '') +
          zone(x.k, x.q || 'Ton geste', { lignes: 4, ph: x.ph || x.debut }) +
          (x.journal ? '<div class="mc-journal"><p class="mc-q">' + esc(x.journal.q) + '</p>' + Array.apply(null, { length: x.journal.n }).map(function (_, j) {
            return '<label class="mc-essai"><span>Essai ' + (j + 1) + '</span><input type="text" data-k="' + x.journal.k + '-' + j + '"' + (j === 0 && x.journal.ph ? ' placeholder="' + esc(x.journal.ph) + '"' : '') + '></label>';
          }).join('') + '</div>' : '');
      }
      return '<section class="mc-exercice" id="mc-exercice-' + (i + 1) + '"><p class="mc-sur">Exercice ' + (i + 1) + '</p><h3 class="mc-h">' + esc(x.titre) + '</h3><p class="mc-consigne">' + md(x.consigne) + '</p>' +
        (x.pourquoi ? '<p class="mc-pourquoi"><b>Pourquoi cet exercice ?</b> ' + md(x.pourquoi) + '</p>' : '') +
        (x.astuce ? '<p class="mc-pourquoi"><b>Une astuce :</b> ' + md(x.astuce) + '</p>' : '') + corps + '</section>';
    }).join('');
  } });

  PAGES.push({ id: 'rituel', nom: 'Rituel et méditation', g: function () {
    var R = C.rituel;
    return gauche('rituel', 'Le rituel du mois', R.titre, '<p class="mc-intro">' + md(R.intro) + '</p>');
  }, d: function () {
    var R = C.rituel, M = C.meditation;
    return (R.materiel ? encadre('Ce qu’il te faut', '<p>' + md(R.materiel) + '</p>', 'mc-encadre-or') : '') +
      '<ol class="mc-etapes">' + R.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
      (R.quand ? encadre('Quand t’en servir', '<p>' + md(R.quand) + '</p>') : '') +
      zone(R.note.k, R.note.q, { lignes: 3, ph: R.note.ph }) +
      '<div class="mc-separe">' + ORNEMENT + '</div>' +
      '<p class="mc-sur">La méditation du mois</p><h3 class="mc-h">' + esc(M.titre) + '</h3>' +
      lecteur(C.audio, 'Écouter la méditation guidée') + lecteur(C.audioCourt, 'La version courte, 2 minutes') +
      '<p class="mc-note">Lis ce texte lentement, à voix basse ou dans ta tête, en t’arrêtant aux pauses. Tu peux aussi l’enregistrer avec ta propre voix et l’écouter les yeux fermés.</p>' +
      (M.conseil ? '<p class="mc-pourquoi">' + md(M.conseil) + '</p>' : '') +
      '<div class="mc-medit"' + (DECOR.meditation ? ' style="--fond:url(\'' + esc(DECOR.meditation) + '\')"' : '') + '><div class="mc-medit-in">' + M.texte.map(function (x) { return /^\[/.test(x) ? '<p class="mc-pause">' + esc(x.slice(1, -1)) + '</p>' : '<p>' + md(x) + '</p>'; }).join('') + '</div></div>' +
      zone(M.note.k, M.note.q, { lignes: 3, ph: M.note.ph });
  } });
  function lecteur(src, titre) {
    if (!src) return '';
    return '<div class="mc-audio" data-audio hidden><p class="mc-q">' + esc(titre) + '</p><audio controls preload="metadata" src="' + esc(src) + '"></audio></div>';
  }
  function citation() {
    return '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(DECOR.citation) + '\')"' : '') + '><span>' + esc(C.citation) + '</span></blockquote>';
  }

  PAGES.push({ id: 'semaines', nom: 'Mes 4 semaines', g: function () {
    var carte = (DECOR.cartes || {}).semaines;
    return gauche('semaines', 'Un pas par semaine', 'Mes quatre semaines',
      '<p class="mc-intro">Chaque semaine, une petite action, et trois questions d’autocoaching pour voir ce qui avance. Les petites victoires comptent : ce sont elles qui transforment une boucle en spirale.</p>',
      (carte ? '<figure class="mc-carte mc-carte-g"><img src="' + esc(carte[0]) + '" alt="' + esc(carte[1]) + '" width="270" height="338" loading="lazy"></figure>' : '') +
      '<p><button type="button" class="btn btn-trait mc-btn-ics" data-ics>Ajouter mes rappels à mon agenda</button></p><p class="mc-note">Un rappel chaque semaine et un pour ton bilan, dans ton propre agenda. Aucun e-mail ne t’est envoyé.</p>');
  }, d: function () {
    return C.semaines.map(function (s, i) {
      var k = 'sem' + (i + 1); if (Array.isArray(s)) s = { titre: s[0], texte: s[1] };
      return '<section class="mc-semaine" id="mc-semaine-' + (i + 1) + '"><div class="mc-sem-tete"><span class="mc-sem-n">Semaine ' + (i + 1) + '</span><h3>' + esc(s.titre) + '</h3><label class="mc-fait"><input type="checkbox" data-k="' + k + '-fait"> C’est fait</label></div><p>' + md(s.texte) + '</p>' +
        (s.exemple ? '<p class="mc-pourquoi">' + md(s.exemple) + '</p>' : '') +
        zone(k + '-notes', 'Qu’as-tu remarqué, essayé ou ressenti cette semaine ?', { lignes: 3, ph: s.ph }) +
        zone(k + '-victoire', 'Quelle est ta victoire de la semaine, même toute petite ?', { court: true, ph: 'Exemple : j’ai remarqué la boucle avant de réagir' }) +
        zone(k + '-appris', 'Qu’as-tu appris sur toi cette semaine ?', { court: true, ph: 'Exemple : quand je suis fatigué·e, je dis oui plus vite' }) +
        curseur(k + '-elan', 'Quel a été ton élan cette semaine ?', 'à plat', 'plein élan') + '</section>';
    }).join('');
  } });

  PAGES.push({ id: 'cloture', nom: 'Mon bilan du mois', g: function () {
    return gauche('cloture', 'Pour clore le mois · 10 minutes', 'Ma météo de fin de mois',
      '<p class="mc-intro">Prends ce temps à la fin du mois, même si tout n’a pas été fait. Tu vas comparer avec ton début de mois : c’est souvent là que l’on voit tout le chemin parcouru.</p><p>Un point gagné sur un curseur, c’est un vrai mouvement. Un point perdu, c’est une information, pas un échec : le mois a peut-être été chargé.</p>');
  }, d: function () {
    return '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment te sens-tu ?</h3>' + blocEchelles('mf') + '<div class="mc-graphes" id="mc-graphes"></div></section>' +
      '<section class="mc-etape"><h3><span>2</span> Ton objectif</h3><div class="mc-rappel" id="mc-rappel-obj"></div>' +
        curseur('fin-obj', 'Où en es-tu de ton objectif ?', 'pas commencé', 'atteint') +
        zone('fin-preuves', 'Qu’as-tu vu, entendu ou ressenti qui te montre que tu as avancé ?', { lignes: 3, ph: 'Exemple : ma sœur m’a dit que j’avais l’air plus détendu·e.' }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>3</span> ' + esc(C.bilanTitre || 'Ce que ce mois t’a apporté') + '</h3>' +
        (C.bilan || []).map(function (b) { return zone(b.k, b.q, { lignes: b.court ? 0 : 3, court: b.court, ph: b.ph }); }).join('') +
        zone('fin-fiertes', 'Quelles sont les trois choses dont tu es fier·e ce mois-ci ?', { lignes: 3, ph: 'Exemple : avoir dit non une fois, avoir appelé ma tante, avoir ouvert ce carnet chaque semaine.' }) +
        zone('fin-recadrage', 'Quelle difficulté as-tu rencontrée, et qu’est-ce qu’elle t’a appris ?', { lignes: 3, ph: 'Exemple : j’ai cédé deux fois. J’ai compris que la fatigue rend ma boucle plus forte.' }) +
        '<div class="mc-deux">' + zone('fin-garder', 'Qu’est-ce que tu gardes de ce mois ?', { lignes: 2, ph: 'Exemple : la main suspendue' }) + zone('fin-laisser', 'Qu’est-ce que tu laisses derrière toi ?', { lignes: 2, ph: 'Exemple : l’idée que je dois tout porter' }) + '</div>' +
        zone('fin-merci', 'Pour quoi te remercies-tu ?', { lignes: 2, ph: 'Exemple : pour avoir essayé, même quand j’avais peur.' }) +
      '</section>' +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="fin">Enregistrer mon bilan du mois</button><p class="mc-retour" data-retour="fin" aria-live="polite"></p></div>' +
      aVenir() +
      '<p class="mc-note mc-mention">Ce carnet propose une démarche symbolique de réflexion et de développement personnel. Il ne remplace pas un accompagnement médical ou psychologique.</p>';
  } });
  function aVenir() {
    if (!C.aVenir || !C.aVenir.length) return '';
    return '<section class="mc-avenir"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le Cercle continue</p><h3 class="mc-h">Les prochains carnets</h3>' +
      '<div class="mc-avenir-l">' + C.aVenir.map(function (a) {
        return '<article class="mc-av">' + (a.image ? '<img src="' + esc(a.image) + '" alt="" loading="lazy" width="120" height="120">' : '') + '<div><p class="mc-sem-n">' + esc(a.mois) + '</p><p class="mc-av-t">' + esc(a.titre) + '</p><p>' + esc(a.texte) + '</p></div></article>';
      }).join('') + '</div><p class="mc-av-lien"><a class="btn btn-trait" href="mon-mois.html">Mes carnets précédents</a></p></section>';
  }

  /* ───── Construction ───── */
  var courante = 0, enCours = false;
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function modeLivre() { return window.matchMedia('(min-width: 1000px)').matches; }
  function construire() {
    var fond = DECOR.couverture ? ' style="--fond:url(\'' + esc(DECOR.couverture) + '\')"' : '';
    racine.innerHTML =
      '<header class="mc-tete"' + fond + '><p class="mc-sur">Le Cercle · Le carnet ' + esc(de(NOM_MOIS)) + ' ' + esc(String(C.nomMois).split(' ')[1] || '') + '</p>' +
        '<p class="mc-perso" id="mc-perso" hidden></p><h1>' + esc(C.titre) + '</h1><p>' + esc(C.sousTitre) + '</p>' +
        '<div class="mc-barre"><div class="mc-progres" aria-label="Avancement du carnet"><span id="mc-progres-barre"></span></div><span id="mc-progres-texte"></span><span class="mc-etat" id="mc-etat" aria-live="polite"></span></div>' +
        '<div class="mc-boutons"><div class="mc-imp-zone"><button type="button" class="btn btn-trait" id="mc-imprimer" aria-expanded="false" aria-controls="mc-imp-choix">Imprimer mon carnet rempli</button>' +
          '<div class="mc-imp-choix" id="mc-imp-choix" hidden><p>Quelle version veux-tu imprimer ?</p>' +
            '<button type="button" data-imprimer="simple"><b>Simple</b><span>Le texte et tes réponses, sans images : économe en encre.</span></button>' +
            '<button type="button" data-imprimer="decor"><b>Avec le décor</b><span>Les illustrations, les couleurs et les ornements.</span></button></div></div>' +
          '<a class="btn btn-trait" href="' + esc(C.pdf) + '" download>Version papier vierge (PDF)</a>' +
          '<button type="button" class="btn btn-trait" data-ics>Ajouter mes rappels à mon agenda</button></div>' +
        '<div class="mc-compte" id="mc-compte" hidden></div></header>' +
      '<nav class="mc-onglets" aria-label="Pages du carnet">' + PAGES.map(function (p, i) { return '<button type="button" data-page="' + i + '"><span>' + (i + 1) + '</span>' + esc(p.nom) + '</button>'; }).join('') + '</nav>' +
      '<div class="mc-livre" id="mc-livre">' + PAGES.map(function (p, i) {
        return '<article class="mc-page" id="page-' + p.id + '" data-p="' + i + '"' + (i ? ' hidden' : '') + ' aria-label="Page ' + (i + 1) + ' : ' + esc(p.nom) + '">' +
          '<div class="mc-g">' + p.g() + '<span class="mc-folio">' + (2 * i + 1) + '</span></div>' +
          '<div class="mc-d">' + p.d() +
            '<div class="mc-nav">' + (i ? '<button type="button" class="btn btn-trait" data-page="' + (i - 1) + '">Page précédente</button>' : '<span></span>') + (i < PAGES.length - 1 ? '<button type="button" class="btn btn-plein" data-page="' + (i + 1) + '">Page suivante</button>' : '') + '</div>' +
            '<span class="mc-folio">' + (2 * i + 2) + '</span></div></article>';
      }).join('') + '</div>' +
      '<p class="mc-aide-livre">Astuce : sur ordinateur, tourne les pages avec les flèches du clavier. Sur téléphone, glisse du doigt vers la gauche ou la droite.</p>';

    racine.addEventListener('click', function (e) {
      var t = e.target;
      var imp = t.closest('[data-imprimer]'); if (imp) { imprimer(imp.getAttribute('data-imprimer')); return; }
      if (t.closest('#mc-imprimer')) { basculerChoix(); return; }
      if (!t.closest('.mc-imp-choix')) basculerChoix(false);
      var b = t.closest('[data-page]'); if (b) { aller(+b.getAttribute('data-page')); return; }
      var m = t.closest('[data-meteo]'); if (m) { enregistrerMeteo(m.getAttribute('data-meteo'), m); return; }
      if (t.closest('[data-ics]')) { telechargerRappels(); return; }
    });
    racine.addEventListener('input', changement);
    racine.addEventListener('change', changement);
    /* Un curseur touché sans le bouger (clic sur sa position) compte aussi comme une réponse */
    racine.addEventListener('pointerup', function (e) { if (e.target.type === 'range') changement({ target: e.target }); });
    racine.addEventListener('keyup', function (e) { if (e.target.type === 'range' && /^(Arrow|Home|End|Page)/.test(e.key)) changement({ target: e.target }); });
    document.addEventListener('keydown', clavier);
    glisser();
    racine.querySelectorAll('[data-audio] audio').forEach(function (a) {
      a.addEventListener('loadedmetadata', function () { a.parentNode.hidden = false; });
      a.addEventListener('error', function () { a.parentNode.remove(); });
    });
    window.addEventListener('resize', collant);
    window.addEventListener('hashchange', function () { var c = cible(); if (c.p !== courante) aller(c.p, { ancre: c.ancre }); });
    var c = cible();
    aller(c.p, { initial: true, ancre: c.ancre });
  }
  function basculerChoix(ouvrir) {
    var z = document.getElementById('mc-imp-choix'), b = document.getElementById('mc-imprimer'); if (!z) return;
    var o = ouvrir === undefined ? z.hidden : ouvrir;
    z.hidden = !o; b.setAttribute('aria-expanded', o ? 'true' : 'false');
  }
  /* #semaines-2 ouvre la page des semaines sur la semaine 2 (liens des rappels d'agenda) */
  function cible() {
    var h = (location.hash || '').replace('#', ''), ids = PAGES.map(function (p) { return p.id; });
    var i = ids.indexOf(h); if (i >= 0) return { p: i };
    var m = /^([a-z]+)-(\d)$/.exec(h);
    if (m && ids.indexOf(m[1]) >= 0) return { p: ids.indexOf(m[1]), ancre: m[1] === 'semaines' ? 'mc-semaine-' + m[2] : null };
    return { p: 0 };
  }
  function hautFixe() {
    var en = document.querySelector('.entete'), ong = racine.querySelector('.mc-onglets');
    var h = en && getComputedStyle(en).position === 'sticky' ? en.offsetHeight : 0;
    racine.style.setProperty('--haut', h + 'px');
    racine.style.setProperty('--haut-livre', (h + (ong ? ong.offsetHeight : 0) + 12) + 'px');
    return h + (ong ? ong.offsetHeight : 0);
  }
  function defiler(el, instant) {
    var y = el.getBoundingClientRect().top + window.pageYOffset - hautFixe() - 8;
    if (Math.abs(window.pageYOffset - y) > 4 && (instant || window.pageYOffset > y)) window.scrollTo({ top: y, behavior: instant || reduit ? 'auto' : 'smooth' });
  }
  function montrer(i) {
    courante = i;
    racine.querySelectorAll('.mc-page').forEach(function (p) { p.hidden = +p.getAttribute('data-p') !== i; });
    racine.querySelectorAll('.mc-onglets [data-page]').forEach(function (b) { var a = +b.getAttribute('data-page') === i; b.classList.toggle('actif', a); if (a) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    try { history.replaceState(null, '', '#' + PAGES[i].id); } catch (e) {}
    if (PAGES[i].id === 'cloture') comparer();
    var ong = racine.querySelector('.mc-onglets'), act = ong.querySelector('.actif');
    if (act) ong.scrollLeft = act.offsetLeft - (ong.clientWidth - act.offsetWidth) / 2;
    collant();
  }
  function aller(i, o) {
    o = o || {};
    if (i < 0 || i >= PAGES.length || enCours) return;
    var avant = courante, livre = document.getElementById('mc-livre');
    hautFixe();
    if (o.initial || i === avant || reduit) {
      montrer(i);
      if (!o.initial) defiler(livre, true);
    } else if (modeLivre()) {
      defiler(livre, true);
      tourner(avant, i);
    } else {
      defiler(livre, true);
      montrer(i);
      var pg = racine.querySelector('.mc-page[data-p="' + i + '"]');
      pg.classList.remove('mc-glisse-g', 'mc-glisse-d'); void pg.offsetWidth;
      pg.classList.add(i > avant ? 'mc-glisse-g' : 'mc-glisse-d');
    }
    if (o.ancre) setTimeout(function () { var a = document.getElementById(o.ancre); if (a) defiler(a, true); }, o.initial ? 300 : 750);
  }

  /* ───── La page qui tourne (ordinateur) ─────
     On photographie les deux pages actuelles (copies inertes), on affiche la nouvelle page dessous,
     puis une feuille tourne autour de la reliure : recto = ancienne page, verso = nouvelle page. */
  function copie(el) {
    var c = el.cloneNode(true);
    var src = el.querySelectorAll('textarea, input'), dst = c.querySelectorAll('textarea, input');
    for (var n = 0; n < src.length; n++) { if (src[n].type === 'checkbox' || src[n].type === 'radio') dst[n].checked = src[n].checked; else dst[n].value = src[n].value; }
    c.querySelectorAll('[id]').forEach(function (x) { x.removeAttribute('id'); });
    c.querySelectorAll('[name]').forEach(function (x) { x.removeAttribute('name'); });
    c.querySelectorAll('[data-k]').forEach(function (x) { x.removeAttribute('data-k'); });
    c.querySelectorAll('[data-val],[data-page],[data-meteo],[data-ics],[data-rappel-obj],[data-curseur]').forEach(function (x) { ['data-val', 'data-page', 'data-meteo', 'data-ics', 'data-rappel-obj', 'data-curseur'].forEach(function (a) { x.removeAttribute(a); }); });
    c.querySelectorAll('audio').forEach(function (x) { x.remove(); });
    c.removeAttribute('id');
    return c;
  }
  function volet(cote, contenu, hauteur) {
    var v = document.createElement('div');
    v.className = 'mc-volet mc-volet-' + cote; v.style.height = hauteur + 'px';
    v.setAttribute('aria-hidden', 'true'); v.setAttribute('inert', '');
    if (contenu) v.appendChild(contenu);
    return v;
  }
  function tourner(avant, apres) {
    var livre = document.getElementById('mc-livre');
    var vieux = racine.querySelector('.mc-page[data-p="' + avant + '"]'), neuf = racine.querySelector('.mc-page[data-p="' + apres + '"]');
    var vg = copie(vieux.querySelector('.mc-g')), vd = copie(vieux.querySelector('.mc-d'));
    enCours = true;
    montrer(apres);
    var ng = copie(neuf.querySelector('.mc-g')), nd = copie(neuf.querySelector('.mc-d'));
    var r = livre.getBoundingClientRect();
    var h = Math.max(320, Math.min(livre.offsetHeight, window.innerHeight - Math.max(0, r.top)));
    var suivant = apres > avant;
    var fixe = volet(suivant ? 'g' : 'd', suivant ? vg : vd, h);
    var feuille = document.createElement('div');
    feuille.className = 'mc-feuille mc-feuille-' + (suivant ? 'suiv' : 'prec'); feuille.style.height = h + 'px';
    feuille.setAttribute('aria-hidden', 'true');
    var recto = volet(suivant ? 'd' : 'g', suivant ? vd : vg, h), verso = volet(suivant ? 'g' : 'd', suivant ? ng : nd, h);
    recto.classList.add('mc-recto'); verso.classList.add('mc-verso');
    feuille.appendChild(recto); feuille.appendChild(verso);
    livre.appendChild(fixe); livre.appendChild(feuille);
    requestAnimationFrame(function () { requestAnimationFrame(function () { feuille.classList.add('mc-tourne'); }); });
    var fini = false;
    function finir() { if (fini) return; fini = true; fixe.remove(); feuille.remove(); enCours = false; collant(); }
    feuille.addEventListener('transitionend', finir);
    setTimeout(finir, 1100);
  }

  function clavier(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT' || (tag === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio') || (t && t.isContentEditable)) return;
    if (tag === 'INPUT') return; /* les boutons radio utilisent déjà les flèches */
    e.preventDefault();
    aller(courante + (e.key === 'ArrowRight' ? 1 : -1));
  }
  function glisser() {
    var livre = document.getElementById('mc-livre'), x0 = null, y0 = 0, t0 = 0;
    livre.addEventListener('touchstart', function (e) {
      if (modeLivre() || e.touches.length !== 1 || e.target.closest('input, textarea, select, audio, .mc-onglets')) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
    }, { passive: true });
    livre.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy) && Date.now() - t0 < 900) aller(courante + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
  /* La page de gauche reste visible pendant qu'on remplit la droite, si elle tient dans l'écran */
  function collant() {
    var pg = racine.querySelector('.mc-page[data-p="' + courante + '"]'); if (!pg) return;
    var g = pg.querySelector('.mc-g-in'); if (!g) return;
    var dispo = window.innerHeight - hautFixe() - 24;
    g.classList.toggle('mc-collant', modeLivre() && g.offsetHeight < dispo);
  }

  /* ───── Valeurs ───── */
  function valeurDe(el) { return el.type === 'checkbox' ? el.checked : el.hasAttribute('data-radio') ? (el.checked ? el.value : undefined) : el.value; }
  function appliquer() {
    racine.querySelectorAll('.mc-livre [data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k'), v = D.v[k];
      if (v === undefined) { if (el.type === 'range') afficherVal(el); return; }
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.hasAttribute('data-radio')) el.checked = el.value === v;
      else el.value = v;
      if (el.type === 'range') afficherVal(el);
    });
    racine.querySelectorAll('details[data-plus]').forEach(function (d) {
      var cles = d.getAttribute('data-plus') === 'lettre' ? ['proj-an'] : ['ancre-souvenir', 'ancre-mot'];
      if (cles.some(function (k) { return (D.v[k] || '').toString().trim(); })) d.open = true;
    });
    progres(); verifierObjectif(); perso();
  }
  function afficherVal(el) {
    var k = el.getAttribute('data-k'), b = racine.querySelector('[data-val="' + k + '"]'), c = racine.querySelector('[data-curseur="' + k + '"]');
    var touche = typeof D.v[k] === 'number';
    if (c) c.classList.toggle('mc-vide', !touche);
    if (b) b.textContent = touche ? el.value + ' sur 10' : 'Place le curseur';
    el.style.setProperty('--pc', (el.value * 10) + '%');
  }
  function changement(e) {
    var el = e.target; if (!el.hasAttribute || !el.hasAttribute('data-k')) return;
    var v = valeurDe(el); if (v === undefined) return;
    var k = el.getAttribute('data-k'), nv = el.type === 'range' ? +v : v;
    if (D.v[k] === nv && el.type === 'range' && e.type === undefined && !racine.querySelector('[data-curseur="' + k + '"].mc-vide')) return;
    D.v[k] = nv;
    if (el.type === 'range') afficherVal(el);
    if (k === 'obj-quoi') { verifierObjectif(); perso(); }
    if (/^(md|mf|sem\d)-/.test(k) && PAGES[courante].id === 'cloture') comparer();
    progres(); sauver();
  }
  function verifierObjectif() {
    var a = racine.querySelector('[data-aide="obj-quoi"]'); if (!a) return;
    var t = (D.v['obj-quoi'] || '').toLowerCase();
    var negatif = /\bne\s+\S+\s+(pas|plus|jamais)\b|\bn['’]\S+\s+(pas|plus|jamais)\b|\barr[êe]ter\b|\bmoins\b|\béviter\b|\bne plus\b/.test(t);
    a.classList.toggle('mc-alerte', negatif);
    a.textContent = negatif ? 'Ton objectif parle de ce que tu ne veux plus. Qu’est-ce que tu veux à la place ? On avance mieux vers une image positive.' : 'Formule ce que tu veux à la place de ce que tu ne veux plus.';
  }
  function progres() {
    var champs = racine.querySelectorAll('.mc-livre textarea[data-k], .mc-livre input[type=text][data-k]'), n = 0;
    champs.forEach(function (c) { if ((D.v[c.getAttribute('data-k')] || '').toString().trim()) n++; });
    var p = champs.length ? Math.round(n / champs.length * 100) : 0;
    var b = document.getElementById('mc-progres-barre'); if (b) b.style.width = p + '%';
    var t = document.getElementById('mc-progres-texte'); if (t) t.textContent = p + ' % rempli';
  }
  /* Prénom (si connectée) et rappel de l'objectif en haut des pages suivantes */
  function perso() {
    var z = document.getElementById('mc-perso');
    if (z) { z.hidden = !prenom; z.textContent = prenom ? 'Ton carnet ' + de(NOM_MOIS) + ', ' + prenom : ''; }
    var obj = (D.v['obj-quoi'] || '').trim();
    racine.querySelectorAll('.mc-livre [data-rappel-obj]').forEach(function (r) {
      r.hidden = !obj;
      r.innerHTML = obj ? '<span>Ton objectif du mois</span>« ' + esc(obj) + ' »' : '';
    });
  }

  /* ───── Enregistrement ───── */
  function etat(t) { var e = document.getElementById('mc-etat'); if (e) e.textContent = t; }
  function sauver() {
    try { localStorage.setItem(CLE_LOCALE, JSON.stringify(D)); } catch (e) {}
    clearTimeout(minuteur);
    if (!user || !sb) { etat('Gardé jusqu’à la fermeture du navigateur'); return; }
    etat('Enregistrement…');
    minuteur = setTimeout(function () {
      sb.from('carnets').upsert({ user_id: user.id, mois: C.mois, data: D, maj: new Date().toISOString() }, { onConflict: 'user_id,mois' })
        .then(function (r) { etat(r.error ? 'Pas enregistré, réessaie plus tard' : 'Enregistré dans ton espace'); }, function () { etat('Pas enregistré, réessaie plus tard'); });
    }, 900);
  }
  function fusion(a, b) { var r = { v: {} }; [a, b].forEach(function (x) { if (x && x.v) Object.keys(x.v).forEach(function (k) { r.v[k] = x.v[k]; }); }); return r; }
  function charger() {
    var local = null; try { local = JSON.parse(localStorage.getItem(CLE_LOCALE) || 'null'); } catch (e) {}
    if (!sb) { D = local || D; appliquer(); invitation(); return; }
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { D = local || D; appliquer(); invitation(); return; }
      user = s.user;
      prenom = String((user.user_metadata && user.user_metadata.full_name) || '').trim().slice(0, 40);
      perso();
      sb.from('carnets').select('data').eq('user_id', user.id).eq('mois', C.mois).maybeSingle().then(function (x) {
        D = fusion(x && x.data, local);
        appliquer(); etat('Enregistré dans ton espace');
        if (local && Object.keys(local.v || {}).length) sauver();
      });
      sb.from('resultats').select('titre,donnees,cree_le').eq('outil', 'meteo').order('cree_le', { ascending: false }).limit(24).then(function (x) {
        historique = (x && x.data) || [];
        if (PAGES[courante].id === 'cloture') comparer();
      });
    }).catch(function () { D = local || D; appliquer(); invitation(); });
  }
  /* Sans compte : le texte décrit exactement la règle de site.js (window.GenesoliaDonnees) */
  function invitation() {
    var z = document.getElementById('mc-compte'); if (!z) return;
    etat('Gardé jusqu’à la fermeture du navigateur');
    z.hidden = false;
    z.innerHTML = '<p><b>Sans compte, tes réponses restent dans ce navigateur tant qu’il est ouvert. Quand tu le fermes, elles sont effacées, comme sur les autres sites.</b> Crée ton espace gratuit pour garder ton carnet, ta météo et ta lettre de dans un an, et les retrouver sur tous tes appareils.</p><a class="btn btn-plein" href="login.html?inscription&amp;retour=mon-carnet.html">Créer mon espace</a> <a href="login.html?retour=mon-carnet.html">J’ai déjà un compte</a>';
  }

  /* ───── Météo : enregistrée dans Mon chemin ───── */
  function echelles(prefixe) { var o = {}; ECHELLES.forEach(function (e) { var v = D.v[prefixe + '-' + e[0]]; if (typeof v === 'number') o[e[0]] = v; }); return o; }
  function moyenne(o) { var k = Object.keys(o); return k.length ? Math.round(k.reduce(function (s, x) { return s + o[x]; }, 0) / k.length * 10) / 10 : null; }
  function enregistrerMeteo(moment, bouton) {
    var p = moment === 'debut' ? 'md' : 'mf', e = echelles(p), ret = racine.querySelector('[data-retour="' + moment + '"]');
    if (Object.keys(e).length < ECHELLES.length) { ret.textContent = 'Place les six curseurs avant d’enregistrer.'; return; }
    var donnees = { moment: moment, mois: C.mois, echelles: e, moyenne: moyenne(e), meteo: D.v[p + '-meteo'] || '', mot: D.v[p + '-mot'] || '' };
    if (moment === 'debut') { donnees.objectif = D.v['obj-quoi'] || ''; donnees.croyance = D.v['obj-croyance']; donnees.lettre = D.v['proj-an'] || ''; donnees.phrase = D.v.phrase || ''; }
    else { donnees.objectif_avance = D.v['fin-obj']; donnees.intention = D.v['fin-intention'] || ''; }
    var resume = ECHELLES.map(function (x) { return x[1] + ' ' + e[x[0]]; }).join(' · ');
    var titre = (moment === 'debut' ? 'Début ' : 'Fin ') + C.nomMois + (donnees.meteo ? ' · ' + donnees.meteo : '');
    bouton.disabled = true;
    var fait = window.GenesoliaChemin ? window.GenesoliaChemin.enregistrer({ outil: 'meteo', titre: titre, resume: resume, donnees: donnees }) : Promise.resolve(false);
    fait.then(function (ok) {
      bouton.disabled = false;
      ret.textContent = ok ? 'C’est enregistré dans ton espace, avec la date. Tu pourras comparer mois après mois.' : (user ? 'L’enregistrement n’a pas fonctionné, réessaie.' : 'Crée ton espace pour garder ta météo et la comparer chaque mois.');
      if (ok) { historique.unshift({ titre: titre, donnees: donnees, cree_le: new Date().toISOString() }); if (moment === 'fin') comparer(); }
      if (ok && window.umami) try { window.umami.track('carnet-meteo-' + moment, { mois: C.mois }); } catch (x) {}
    });
  }

  /* ───── Graphiques : avant / après, l'élan des 4 semaines, et mois après mois ───── */
  function barres(a, b) {
    var W = 600, H = 240, g = 36, base = H - 46, haut = 22, n = ECHELLES.length, larg = (W - 2 * g) / n, bw = Math.min(26, larg / 3);
    var y = function (v) { return base - v / 10 * (base - haut); };
    var s = '<svg class="mc-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Ta météo du début et de la fin du mois, curseur par curseur">';
    [0, 5, 10].forEach(function (t) { s += '<line x1="' + g + '" x2="' + (W - 8) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="#EBCFD5"' + (t ? ' stroke-dasharray="3 4"' : '') + '/><text x="' + (g - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="mc-svg-ax">' + t + '</text>'; });
    ECHELLES.forEach(function (e, i) {
      var cx = g + larg * i + larg / 2;
      [[a[e[0]], COUL_DEBUT, -1, 'Début'], [b[e[0]], COUL_FIN, 1, 'Fin']].forEach(function (v) {
        if (typeof v[0] !== 'number') return;
        var x = cx + (v[2] < 0 ? -bw - 1 : 1), yy = y(v[0]), hh = Math.max(2, base - yy);
        s += '<g><title>' + esc(e[1]) + ', ' + v[3].toLowerCase() + ' du mois : ' + v[0] + ' sur 10</title><path d="M' + x + ' ' + base + 'V' + (yy + 4) + 'q0 -4 4 -4h' + (bw - 8) + 'q4 0 4 4V' + base + 'Z" fill="' + v[1] + '"/>' +
          '<text x="' + (x + bw / 2) + '" y="' + (yy - 6) + '" text-anchor="middle" class="mc-svg-val">' + v[0] + '</text></g>';
        void hh;
      });
      s += '<text x="' + cx + '" y="' + (base + 20) + '" text-anchor="middle" class="mc-svg-lab">' + esc(e[1]) + '</text>';
    });
    return s + '</svg>';
  }
  function courbe(points, aria, couleur) {
    var W = 600, H = 170, g = 36, d = 30, base = H - 36, haut = 20, n = points.length;
    var x = function (i) { return n === 1 ? W / 2 : g + d + i * (W - 2 * g - 2 * d) / (n - 1); }, y = function (v) { return base - v / 10 * (base - haut); };
    var s = '<svg class="mc-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(aria) + '">';
    [0, 5, 10].forEach(function (t) { s += '<line x1="' + g + '" x2="' + (W - 8) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="#EBCFD5"' + (t ? ' stroke-dasharray="3 4"' : '') + '/><text x="' + (g - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="mc-svg-ax">' + t + '</text>'; });
    var pleins = points.map(function (p, i) { return typeof p.v === 'number' ? [x(i), y(p.v)] : null; }).filter(Boolean);
    if (pleins.length > 1) s += '<polyline fill="none" stroke="' + couleur + '" stroke-width="2" stroke-linejoin="round" points="' + pleins.map(function (p) { return p.join(','); }).join(' ') + '"/>';
    points.forEach(function (p, i) {
      if (typeof p.v === 'number') s += '<g><title>' + esc(p.titre || p.l) + ' : ' + p.v + ' sur 10</title><circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="5" fill="' + (p.c || couleur) + '" stroke="#fff" stroke-width="2"/><text x="' + x(i) + '" y="' + (y(p.v) - 10) + '" text-anchor="middle" class="mc-svg-val">' + String(p.v).replace('.', ',') + '</text></g>';
      s += '<text x="' + x(i) + '" y="' + (base + 20) + '" text-anchor="middle" class="mc-svg-lab">' + esc(p.l) + '</text>';
    });
    return s + '</svg>';
  }
  function comparer() {
    var z = document.getElementById('mc-graphes'), r = document.getElementById('mc-rappel-obj');
    if (r) r.innerHTML = D.v['obj-quoi'] ? '<p class="mc-q">Ton objectif du début de mois</p><p class="mc-cite">' + esc(D.v['obj-quoi']) + '</p>' + (D.v['obj-voir'] || D.v['obj-ressentir'] ? '<p class="mc-note">Tu sauras que tu l’as atteint quand : ' + esc([D.v['obj-voir'], D.v['obj-entendre'], D.v['obj-ressentir']].filter(Boolean).join(' · ')) + '</p>' : '') : '<p class="mc-note">Tu n’as pas noté d’objectif en début de mois : tu peux le faire le mois prochain.</p>';
    if (!z) return;
    var a = echelles('md'), b = echelles('mf'), h = '';
    h += '<div class="mc-graphe"><p class="mc-graphe-t">Ta météo, avant et après</p>';
    if (!Object.keys(a).length && !Object.keys(b).length) h += '<p class="mc-note">Place tes curseurs ici et dans ta météo du début de mois : les deux apparaîtront côte à côte.</p>';
    else {
      h += '<p class="mc-legende"><span><i style="background:' + COUL_DEBUT + '"></i>Début du mois</span><span><i style="background:' + COUL_FIN + '"></i>Fin du mois</span></p>' + barres(a, b);
      if (!Object.keys(a).length) h += '<p class="mc-note">Remplis aussi ta météo du début de mois pour voir l’écart.</p>';
      h += '<details class="mc-tableau-chiffres"><summary>Voir les chiffres</summary><table><thead><tr><th scope="col">Curseur</th><th scope="col">Début</th><th scope="col">Fin</th><th scope="col">Écart</th></tr></thead><tbody>' + ECHELLES.map(function (x) {
        var d = (b[x[0]] !== undefined && a[x[0]] !== undefined) ? b[x[0]] - a[x[0]] : null;
        return '<tr><th scope="row">' + esc(x[1]) + '</th><td>' + (a[x[0]] !== undefined ? a[x[0]] : 'à remplir') + '</td><td>' + (b[x[0]] !== undefined ? b[x[0]] : 'à remplir') + '</td><td>' + (d === null ? '' : d > 0 ? '+' + d : d < 0 ? '−' + Math.abs(d) : '=') + '</td></tr>';
      }).join('') + '</tbody></table></details>';
    }
    h += '</div>';
    var elan = C.semaines.map(function (s, i) { var v = D.v['sem' + (i + 1) + '-elan']; return { l: 'Semaine ' + (i + 1), v: typeof v === 'number' ? v : null }; });
    h += '<div class="mc-graphe"><p class="mc-graphe-t">Ton élan, semaine après semaine</p>' + (elan.some(function (p) { return p.v !== null; }) ? courbe(elan, 'Ton élan sur les quatre semaines', COUL_DEBUT) : '<p class="mc-note">Place le curseur « élan » à la fin de chaque semaine : ta courbe se dessinera ici.</p>') + '</div>';
    if (user) {
      var pts = historique.filter(function (x) { return x.donnees && typeof x.donnees.moyenne === 'number'; }).slice(0, 12).reverse();
      h += '<div class="mc-graphe"><p class="mc-graphe-t">Ta météo, mois après mois</p>' + (pts.length ? '<p class="mc-legende"><span><i style="background:' + COUL_DEBUT + '"></i>Début de mois</span><span><i style="background:' + COUL_FIN + '"></i>Fin de mois</span></p>' +
        courbe(pts.map(function (x) { var m = String(x.donnees.mois || '').split('-'); var nom = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'][+m[1] - 1] || ''; return { l: (x.donnees.moment === 'fin' ? 'fin ' : 'début ') + nom, v: x.donnees.moyenne, c: x.donnees.moment === 'fin' ? COUL_FIN : COUL_DEBUT, titre: x.titre }; }), 'Ta météo intérieure mois après mois', '#C9A9C0') +
        '<p class="mc-note">Chaque point est la moyenne de tes six curseurs, enregistrée avec le bouton « Enregistrer ». Tout l’historique est dans <a href="login.html#mon-chemin">Mon chemin</a>.</p>'
        : '<p class="mc-note">Enregistre ta météo du début et de la fin du mois : ta courbe se construira ici, mois après mois.</p>') + '</div>';
    }
    z.innerHTML = h;
  }

  /* ───── Rappels dans l'agenda (.ics) : 4 semaines + le bilan ───── */
  function telechargerRappels() {
    var p = String(C.mois).split('-'), an = +p[0], mo = +p[1] - 1;
    var auj = new Date(); auj.setHours(0, 0, 0, 0);
    var debut = new Date(an, mo, 1), demain = new Date(auj.getTime() + 864e5);
    if (demain > debut) debut = demain;
    var fin = new Date(an, mo + 1, 0), quatre = new Date(debut.getTime()); quatre.setDate(quatre.getDate() + 28);
    if (quatre > fin) fin = quatre;
    function d8(d) { return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2); }
    function txt(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
    function plier(l) { var r = [], s = l; while (s.length > 70) { r.push(s.slice(0, 70)); s = ' ' + s.slice(70); } r.push(s); return r.join('\r\n'); }
    function brut(s) { return String(s).replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); }
    var base = 'https://genesolia.fr/mon-carnet.html?mois=' + C.mois, stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var ev = C.semaines.map(function (s, i) {
      if (Array.isArray(s)) s = { titre: s[0], texte: s[1] };
      var d = new Date(debut.getTime()); d.setDate(d.getDate() + 7 * i);
      return { d: d, titre: 'Carnet du Cercle · Semaine ' + (i + 1) + ' : ' + s.titre, texte: brut(s.texte), url: base + '#semaines-' + (i + 1) };
    });
    ev.push({ d: fin, titre: 'Carnet du Cercle · Mon bilan ' + de(NOM_MOIS), texte: 'Prends dix minutes pour ta météo de fin de mois et ton bilan.', url: base + '#cloture' });
    var l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Genesolia//Carnet du Cercle//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Mon carnet du Cercle'];
    ev.forEach(function (e, i) {
      l.push('BEGIN:VEVENT', 'UID:carnet-' + C.mois + '-' + (i + 1) + '-' + stamp + '@genesolia.fr', 'DTSTAMP:' + stamp, 'DTSTART:' + d8(e.d) + 'T190000', 'DURATION:PT15M',
        plier('SUMMARY:' + txt(e.titre)), plier('DESCRIPTION:' + txt(e.texte + '\nOuvrir mon carnet : ' + e.url)), plier('URL:' + e.url),
        'BEGIN:VALARM', 'ACTION:DISPLAY', plier('DESCRIPTION:' + txt(e.titre)), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
    });
    l.push('END:VCALENDAR');
    var blob = new Blob([l.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rappels-carnet-' + C.mois + '.ics';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (window.umami) try { window.umami.track('carnet-rappels', { mois: C.mois }); } catch (x) {}
  }

  /* ───── Impression : « Simple » ou « Avec le décor » ───── */
  var ouverts = [];
  function preparerImpression(mode) {
    finImpression();
    basculerChoix(false);
    racine.querySelectorAll('textarea[data-k], input[type=text][data-k]').forEach(function (el) {
      var d = document.createElement('div'); d.className = 'mc-imp'; d.textContent = el.value || ' '; el.parentNode.insertBefore(d, el.nextSibling);
    });
    racine.querySelectorAll('input[type=range][data-k]').forEach(function (el) {
      var d = document.createElement('span'); d.className = 'mc-imp mc-imp-court'; d.textContent = typeof D.v[el.getAttribute('data-k')] === 'number' ? el.value + ' sur 10' : 'à remplir'; el.closest('.mc-curseur').querySelector('.mc-q').appendChild(d);
    });
    ouverts = [];
    racine.querySelectorAll('details').forEach(function (d) { if (!d.open) { ouverts.push(d); d.open = true; } });
    comparer();
    document.documentElement.classList.add('mc-imprime', 'mc-imprime-' + (mode === 'decor' ? 'decor' : 'simple'));
    racine.classList.add('mc-impression');
  }
  function finImpression() {
    document.documentElement.classList.remove('mc-imprime', 'mc-imprime-simple', 'mc-imprime-decor');
    racine.classList.remove('mc-impression');
    racine.querySelectorAll('.mc-imp').forEach(function (x) { x.remove(); });
    ouverts.forEach(function (d) { d.open = false; }); ouverts = [];
  }
  function imprimer(mode) {
    preparerImpression(mode);
    if (window.umami) try { window.umami.track('carnet-imprimer', { mois: C.mois, version: mode }); } catch (x) {}
    setTimeout(function () { window.print(); }, 250);
  }
  window.addEventListener('afterprint', finImpression);
  window.GenesoliaCarnet = { aller: aller, preparerImpression: preparerImpression, finImpression: finImpression };

  construire();
  charger();
})();
