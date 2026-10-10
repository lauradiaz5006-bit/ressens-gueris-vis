/* Genesolia · Le carnet des deux cycles, en ligne.
   Huit pages, une à la fois ; tout s'imprime d'un coup. Les réponses restent dans ce navigateur
   (localStorage « genesolia-deux-cycles »), rien n'est envoyé. Seul le résultat (cycle et étape, jamais les textes)
   part avec l'e-mail, si la personne le demande et donne son accord. */
(function () {
  'use strict';
  var CLE = 'genesolia-deux-cycles', PDF = 'assets/carnet-des-deux-cycles-8a44d6c993.pdf';
  var D = { v: {}, t: {} };
  try { D = JSON.parse(localStorage.getItem(CLE) || 'null') || D; } catch (e) {}
  D.v = D.v || {}; D.t = D.t || {};
  var zone = document.getElementById('dc-pages'), onglets = document.getElementById('dc-onglets');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function v(k) { return D.v[k]; }
  function texte(k) { return String(D.v[k] || '').trim(); }

  /* ───── Les contenus ───── */
  var RACINE = [
    'J’ai peur de manquer, même quand tout va bien.',
    'Je travaille beaucoup sans jamais me sentir à l’abri.',
    'J’ai du mal à prendre ma place ou à demander.',
    'J’ai besoin de tout contrôler, de tout prévoir.',
    'Je me méfie, comme si quelque chose pouvait tout emporter.'
  ];
  var COEUR = [
    'Mes relations se ressemblent, même avec des personnes différentes.',
    'Je donne beaucoup pour être aimé·e, et je m’épuise.',
    'J’ai peur d’être quitté·e, ou je pars avant de l’être.',
    'J’ai besoin d’être rassuré·e, choisi·e, validé·e.',
    'Je change tout, mais la même histoire revient.'
  ];
  var PHRASES_R = ['« Ai-je le droit d’être là ? »', '« Il ne faut jamais baisser la garde. »'];
  var PHRASES_C = ['« Je ne suis pas assez. »', '« Je dois tout donner pour être aimé·e. »'];
  var ETAPES = [
    ['Émergence', 'Quelque chose attire ton attention : un même schéma semble à l’œuvre.', 'Cette semaine, note chaque fois que tu remarques le schéma, sans chercher à rien changer. Juste le voir, c’est déjà commencer.'],
    ['Initiation', 'Tu commences à observer ce qui déclenche la répétition.', 'Repère ce qui se passe juste avant : un mot, un regard, une situation. Ce déclencheur est ta porte d’entrée.'],
    ['Rencontre avec l’ombre', 'Ce que tu évitais de regarder apparaît clairement.', 'Écris la phrase intérieure qui accompagne la répétition. La nommer lui enlève déjà un peu de son pouvoir.'],
    ['Épreuves', 'La situation se rejoue, parfois plus fort, comme pour être enfin vue.', 'Quand la situation revient, prends trois respirations avant de répondre. Tu n’as pas à réagir tout de suite.'],
    ['Lâcher l’ancien', 'L’ancienne façon de réagir n’a plus de sens. Tu la laisses partir.', 'Choisis un petit geste pour dire au revoir à l’ancienne façon de faire : une lettre que tu n’envoies pas, un objet rangé, une phrase dite à voix haute.'],
    ['Transformation', 'Ce que tu as vécu devient une compréhension, et non plus un poids.', 'Écris ce que cette répétition t’a appris sur toi. Ce qui pesait devient une connaissance.'],
    ['Élévation', 'Tu agis autrement, naturellement, sans avoir à te forcer.', 'Note les moments où tu agis autrement sans effort : ils montrent le chemin parcouru, et te le rappelleront les jours plus difficiles.'],
    ['Transmission', 'Ce que tu as compris profite à ceux qui t’entourent et à ceux qui viennent après toi.', 'Partage ce que tu as compris avec une personne proche, à ta façon, sans chercher à la convaincre.'],
    ['Renaissance', 'Le thème n’est plus une question. Le cycle est complet.', 'Prends un temps pour célébrer ce cycle refermé, puis regarde quel thème demande maintenant ton attention.']
  ];
  var RESULTATS = {
    racine: { titre: 'Ta boucle prend racine dans ta sécurité', court: 'la racine',
      texte: 'Ce qui revient chez toi touche d’abord le droit d’avoir ta place et de te sentir à l’abri. Tant que ce socle tremble, aimer librement demande beaucoup d’énergie : c’est souvent par la racine qu’on commence.',
      aide: 'Ce qui t’aide maintenant : repérer ce qui te donne déjà un sentiment de sécurité, même petit, et le nourrir un peu chaque jour.' },
    coeur: { titre: 'Ta boucle se joue dans ta façon d’aimer', court: 'le cœur',
      texte: 'Ce qui revient chez toi touche le lien : être choisi·e, ne pas être quitté·e, donner pour être aimé·e. Ton socle tient debout ; c’est dans la relation que l’ancienne histoire se rejoue.',
      aide: 'Ce qui t’aide maintenant : observer le moment précis où tu commences à trop donner, ou à partir avant d’être quitté·e.' },
    deux: { titre: 'Tes deux cycles se répondent', court: 'les deux cycles',
      texte: 'Chez toi, la sécurité et l’amour sont liés : quand l’un vacille, l’autre se rejoue. On commence en général par la racine, parce qu’il est plus simple d’aimer librement quand on se sent à l’abri.',
      aide: 'Ce qui t’aide maintenant : remarquer, quand la boucle revient, si c’est d’abord ta place ou ton lien qui se sent menacé.' }
  };

  function nbCoches(p) { var n = 0; for (var i = 1; i <= 5; i++) if (v(p + i) === true) n++; return n; }
  function resultat() {
    var r = nbCoches('r'), c = nbCoches('c');
    if (!r && !c) return null;
    var cle = r > c ? 'racine' : c > r ? 'coeur' : 'deux';
    var phrases = [];
    function prend(pref, L) { L.forEach(function (p, i) { if (v(pref + (i + 1)) === true) phrases.push(p); }); }
    if (cle === 'coeur') { prend('cp', PHRASES_C); prend('rp', PHRASES_R); } else { prend('rp', PHRASES_R); prend('cp', PHRASES_C); }
    return { cle: cle, r: r, c: c, R: RESULTATS[cle], phrase: phrases[0] || '', famille: texte(cle === 'coeur' ? 'c-famille' : 'r-famille') || texte(cle === 'coeur' ? 'r-famille' : 'c-famille') };
  }
  function prenom() { var p = texte('prenom').split(/\s+/)[0] || ''; return p ? p.charAt(0).toUpperCase() + p.slice(1, 30) : ''; }

  /* ───── Les champs ───── */
  function champ(k, q, o) {
    o = o || {};
    var val = esc(v(k) || '');
    return '<label class="dc-champ"><span>' + q + '</span>' + (o.aide ? '<small>' + o.aide + '</small>' : '') +
      (o.ligne ? '<input type="text" data-k="' + k + '" value="' + val + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + (o.auto ? ' autocomplete="' + o.auto + '"' : '') + '>'
        : '<textarea data-k="' + k + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>' + val + '</textarea>') + '</label>';
  }
  function coches(pref, liste, classe) {
    return '<div class="dc-coches' + (classe ? ' ' + classe : '') + '">' + liste.map(function (t, i) {
      return '<label><input type="checkbox" data-k="' + pref + (i + 1) + '"' + (v(pref + (i + 1)) === true ? ' checked' : '') + '><span>' + t + '</span></label>';
    }).join('') + '</div>';
  }

  /* ───── Les huit pages ───── */
  var PAGES = [
    { id: 'debut', nom: 'Avant de commencer', cles: ['prenom'], h: function () {
      return '<p class="dc-sur">Avant de commencer</p><h1>Le carnet des deux cycles</h1>' +
        '<p class="dc-intro">Ce carnet t’accompagne pour regarder ce qui revient dans ta vie : une situation, une émotion, un type de relation, une peur. Il ne cherche pas à tout expliquer. Il t’aide à poser des mots, à faire des liens, et à voir d’où viennent certaines répétitions.</p>' +
        '<h3>Comment l’utiliser</h3><ul class="dc-liste"><li>Remplis-le ici, ou imprime-le et écris à la main.</li><li>Prends ton temps : une page par jour suffit.</li><li>Écris sans te juger. Si une question te bouscule trop, passe à la suivante et reviens-y plus tard.</li></ul>' +
        '<h3>Ce que tu vas trouver</h3><ul class="dc-liste"><li>La boucle et la spirale : deux façons de vivre une répétition.</li><li>Le cycle de la racine (ta sécurité, ta place) et le cycle du cœur (ta façon d’aimer et d’être aimé·e).</li><li>Ton résultat, calculé avec tes réponses.</li><li>Les neuf étapes d’un cycle, pour savoir où tu en es.</li><li>Les questions à poser à ta famille, et ton arbre à remplir.</li></ul>' +
        champ('prenom', 'Ton prénom', { ligne: true, auto: 'given-name', aide: 'Pour que ton carnet s’adresse à toi.' }) +
        '<p class="dc-note">Tes réponses restent dans ce navigateur : rien n’est envoyé, personne d’autre ne les lit. Sans compte, elles s’effacent quand tu fermes le navigateur ; tu peux imprimer ton carnet ou recevoir ton résultat par e-mail à la fin.</p>' +
        '<p class="dc-note" style="background:#fff">Une grille de lecture, pas une vérité : prends ce qui te parle, laisse le reste. Ce carnet propose une lecture symbolique de ton histoire. Il ne remplace pas l’accompagnement d’un professionnel quand tu en as besoin.</p>';
    } },
    { id: 'spirale', nom: 'La boucle et la spirale', cles: ['revient', 'derniere', 'autrement'], h: function () {
      return '<p class="dc-sur">Page 2</p><h2>De la boucle à la spirale</h2><p>Le même thème peut revenir toute une vie. Ce qui change tout, c’est la façon dont tu le traverses.</p>' +
        '<div class="dc-duo"><div><b>La boucle</b><p>La même situation revient, avec les mêmes réactions. On croit avoir changé, puis le scénario se rejoue sous une autre forme.</p></div><div><b>La spirale</b><p>Le thème revient encore, mais tu le reconnais plus vite et tu réagis autrement. À chaque passage, tu montes d’un cran.</p></div></div>' +
        champ('revient', 'Ce qui revient dans ma vie, encore et encore', { aide: 'Une situation, une émotion, un type de relation, une peur.' }) +
        champ('derniere', 'La dernière fois que c’est arrivé', { aide: 'Qu’est-ce qui s’est passé ? Comment as-tu réagi ?' }) +
        champ('autrement', 'Ce que j’aimerais faire autrement la prochaine fois');
    } },
    { id: 'racine', nom: 'La racine', cles: ['r1', 'r2', 'r3', 'r4', 'r5', 'rp1', 'rp2', 'r-famille', 'r-securite'], h: function () {
      return '<p class="dc-sur">Cycle 1</p><h2>La racine</h2><p>Le besoin le plus fondamental : avoir le droit d’exister, sa place, un toit, de quoi vivre. C’est souvent ici que l’histoire familiale pèse le plus.</p>' +
        '<h3>Je le reconnais quand…</h3><p>Coche ce qui te ressemble.</p>' + coches('r', RACINE) +
        '<h3>Les phrases intérieures</h3><p>Coche celle que tu entends parfois en toi.</p>' + coches('rp', PHRASES_R.map(function (p) { return '<span class="dc-phrase">' + p + '</span>'; })) +
        champ('r-famille', 'Dans ma famille, qui a perdu sa maison, sa terre, son pays ou son travail ?') +
        champ('r-securite', 'Ce qui me donne un sentiment de sécurité aujourd’hui');
    } },
    { id: 'coeur', nom: 'Le cœur', cles: ['c1', 'c2', 'c3', 'c4', 'c5', 'cp1', 'cp2', 'c-points', 'c-famille'], h: function () {
      return '<p class="dc-sur">Cycle 2</p><h2>Le cœur</h2><p>Il ne s’agit plus seulement de tenir debout, mais d’aimer et d’être aimé·e. C’est là que se forment les blessures de rejet, d’abandon, d’incompréhension.</p>' +
        '<h3>Je le reconnais quand…</h3><p>Coche ce qui te ressemble.</p>' + coches('c', COEUR) +
        '<h3>Les phrases intérieures</h3><p>Coche celle que tu entends parfois en toi.</p>' + coches('cp', PHRASES_C.map(function (p) { return '<span class="dc-phrase">' + p + '</span>'; })) +
        champ('c-points', 'Le point commun des personnes qui ont compté le plus pour moi') +
        champ('c-famille', 'Dans ma famille, quelles histoires d’amour, de séparation ou d’absence se racontent ?');
    } },
    { id: 'resultat', nom: 'Ton résultat', cles: ['res-note'], h: function () {
      var r = resultat();
      if (!r) return '<p class="dc-sur">Ton résultat</p><h2>Ton résultat t’attend</h2><p>Coche, dans la racine et dans le cœur, les phrases qui te ressemblent : ton résultat se calcule avec tes réponses.</p><p><button type="button" class="btn btn-plein" data-vers="racine">Aller à la racine</button></p>';
      return '<p class="dc-sur">Ton résultat' + (prenom() ? ', ' + esc(prenom()) : '') + '</p><h2>' + r.R.titre + '</h2>' +
        '<div class="dc-resultat"><p class="dc-sur">Ce que tu as coché</p>' +
        '<div class="dc-jauge"><span>La racine</span><b><i style="width:' + (r.r * 20) + '%"></i></b><span>' + r.r + ' / 5</span></div>' +
        '<div class="dc-jauge c"><span>Le cœur</span><b><i style="width:' + (r.c * 20) + '%"></i></b><span>' + r.c + ' / 5</span></div>' +
        '<p style="margin:.8rem 0 0">' + r.R.texte + '</p></div>' +
        (r.phrase ? '<h3>La phrase qui te parle le plus</h3><p class="dc-citation">' + r.phrase + '</p>' : '') +
        (r.famille ? '<p>Dans ta famille, tu as noté : « ' + esc(r.famille.slice(0, 220)) + (r.famille.length > 220 ? '…' : '') + ' »</p>' : '') +
        '<div class="dc-geste"><p>' + r.R.aide + '</p></div>' +
        champ('res-note', 'Ce que ce résultat m’évoque');
    } },
    { id: 'etapes', nom: 'Les neuf étapes', cles: ['etape', 'e-aide'], h: function () {
      var e = +v('etape') || 0;
      return '<p class="dc-sur">Où tu en es</p><h2>Les neuf étapes d’un cycle</h2><p>Chaque cycle se traverse en neuf étapes. Certaines durent quelques semaines, d’autres des années. Choisis celle où tu te sens aujourd’hui.</p>' +
        '<div class="dc-coches dc-etapes" role="radiogroup" aria-label="Les neuf étapes">' + ETAPES.map(function (x, i) {
          return '<label><input type="radio" name="dc-etape" data-k="etape" value="' + (i + 1) + '"' + (e === i + 1 ? ' checked' : '') + '><b>' + (i + 1) + '</b><span><strong>' + x[0] + '.</strong> ' + x[1] + '</span></label>';
        }).join('') + '</div>' +
        '<div class="dc-geste" id="dc-geste"' + (e ? '' : ' hidden') + '><p class="dc-sur" style="margin-bottom:.3rem">Pour passer à l’étape suivante</p><p id="dc-geste-t">' + (e ? ETAPES[e - 1][2] : '') + '</p></div>' +
        champ('e-aide', 'Ce qui m’aiderait à passer à l’étape suivante');
    } },
    { id: 'famille', nom: 'Ta famille', cles: ['f-appris', 'a-gp1', 'a-gm1', 'a-gp2', 'a-gm2', 'a-pere', 'a-mere', 'a-moi', 'e1q', 'e1a', 'e1r', 'e2q', 'e2a', 'e2r', 'e3q', 'e3a', 'e3r'], h: function () {
      function case_(k, nom, cl) { return '<label class="dc-champ' + (cl ? ' ' + cl : '') + '"><span>' + nom + '</span><textarea data-k="' + k + '" placeholder="Prénom, années, métier, un événement">' + esc(v(k) || '') + '</textarea></label>'; }
      function echo(n) { return '<input type="text" data-k="e' + n + 'q" aria-label="Qui" placeholder="Qui" value="' + esc(v('e' + n + 'q') || '') + '"><input type="text" data-k="e' + n + 'a" aria-label="Âge" placeholder="Âge" value="' + esc(v('e' + n + 'a') || '') + '"><input class="r" type="text" data-k="e' + n + 'r" aria-label="Ce qui se ressemble" placeholder="Ce qui se ressemble" value="' + esc(v('e' + n + 'r') || '') + '">'; }
      return '<p class="dc-sur">Ton histoire</p><h2>Les questions à poser à ta famille</h2><p>À tes parents, grands-parents, oncles, tantes. Choisis un moment calme, et commence par les questions les plus simples. Les silences et les hésitations font aussi partie des réponses.</p>' +
        '<h3>Les faits</h3><ul class="dc-liste"><li>Où et quand sont nés tes parents, tes grands-parents ?</li><li>Quels métiers ont-ils exercés ? Ont-ils dû déménager, partir, recommencer ?</li><li>Qui portait le même prénom que moi avant moi ?</li><li>Y a-t-il eu des enfants dont on parle peu ?</li></ul>' +
        '<h3>Les histoires</h3><ul class="dc-liste"><li>Comment tes parents se sont-ils rencontrés ? Et tes grands-parents ?</li><li>Quelle a été la période la plus dure pour la famille ?</li><li>De quoi avait-on peur, chez toi, quand tu étais petit·e ?</li><li>Y a-t-il des sujets dont on ne parlait jamais ?</li></ul>' +
        champ('f-appris', 'Ce que j’ai appris') +
        '<h3>Mon arbre sur trois générations</h3><p>Prénom, années de naissance et de décès, métier, un événement marquant.</p>' +
        '<div class="dc-arbre">' + case_('a-gp1', 'Grand-père') + case_('a-gm1', 'Grand-mère') + case_('a-gp2', 'Grand-père') + case_('a-gm2', 'Grand-mère') +
        case_('a-pere', 'Père', 'p2') + case_('a-mere', 'Mère', 'p2') + case_('a-moi', 'Moi', 'moi') + '</div>' +
        '<h3>Les échos que je remarque</h3><p>Prénoms, âges, dates, métiers, départs, ruptures qui reviennent.</p>' +
        '<div class="dc-echos"><span class="t">Qui</span><span class="t">Âge</span><span class="t r">Ce qui se ressemble</span>' + echo(1) + echo(2) + echo(3) + '</div>' +
        '<p class="dc-note">Pour aller plus loin, <a href="genosociogramme.html">dessine ton arbre en ligne</a> : il repère tout seul les prénoms, les âges et les dates qui reviennent.</p>';
    } },
    { id: 'suite', nom: 'Pour continuer', cles: ['retiens', 'geste'], h: function () {
      var r = resultat(), e = +v('etape') || 0, p = prenom();
      return '<p class="dc-sur">Pour continuer</p><h2>' + (p ? esc(p) + ', ta' : 'Ta') + ' prochaine étape est déjà prête</h2>' +
        '<p>Tu as regardé ta boucle en face. C’est le premier pas, et souvent le plus difficile. La suite se fait semaine après semaine.</p>' +
        champ('retiens', 'Ce que je retiens de ce carnet') + champ('geste', 'Un petit geste que je choisis pour cette semaine') +
        '<div class="dc-offre"><p class="dc-sur">Ton suivi « Je me libère »</p><h3>Il commence exactement là où tu t’es arrêté·e</h3>' +
        '<div class="dc-sem"><div class="on">Sem. 1<b>Voir</b></div><div>Sem. 2<b>Source</b></div><div>Sem. 3<b>Libérer</b></div><div>Sem. 4<b>Remplacer</b></div></div>' +
        '<p>' + (r ? 'Ton bilan de départ reprend ton prénom et ton résultat (' + r.R.court + (e ? ', étape ' + e + ' : ' + ETAPES[e - 1][0].toLowerCase() : '') + '). ' : '') + 'Ensuite, chaque semaine, un exercice d’un quart d’heure pour voir ta boucle à l’œuvre, remonter à sa source, la libérer et la remplacer par un geste nouveau.</p>' +
        '<p><a class="btn btn-plein" href="essai.html">Commencer mon mois gratuit</a></p>' +
        '<p class="dc-petit">Le suivi fait partie du Cercle : 1\u00a0mois gratuit, rien n’est prélevé pendant 30\u00a0jours. Ensuite 29\u00a0€ par mois sans engagement, ou 24,90\u00a0€ par mois sur 12 mois. Ton carnet « J’avance », ton guide du mois et l’appli Le Cercle sont compris. <a href="abonnement.html" style="color:#F3DCC0">Tout savoir sur Le Cercle</a></p></div>' +
        '<div class="dc-garder" id="dc-garder"><h3>Garder ton carnet</h3>' +
        '<p>Reçois ton résultat par e-mail, avec le lien de ton carnet et sa version à imprimer. Tes réponses écrites restent sur ton appareil : elles ne sont pas envoyées.</p>' +
        (lireInscrite() ? '<p class="dc-merci">C’est noté, ton résultat t’attend dans ta boîte mail.</p>' :
        '<form class="dc-form" id="dc-form" novalidate>' +
          '<label class="dc-champ"><span>Ton e-mail</span><input type="email" name="email" autocomplete="email" required></label>' +
          '<label class="dc-accord"><input type="checkbox" name="accord" required><span>J’accepte de recevoir mon résultat et quelques e-mails de Genesolia pour continuer. Je peux me désinscrire à tout moment. <a href="confidentialite.html">Mes données</a></span></label>' +
          '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">' +
          '<button class="btn btn-plein" type="submit">Recevoir mon résultat</button><p class="dc-erreur" role="alert"></p></form>') +
        '<div class="dc-actions"><button type="button" class="btn btn-trait" id="dc-imprimer">Imprimer mon carnet rempli</button><a class="btn btn-trait" href="' + PDF + '" download="carnet-des-deux-cycles-genesolia.pdf">Le carnet vierge (PDF)</a></div></div>' +
        '<p class="dc-note" style="margin-top:1rem;background:#fff">Ce carnet propose une lecture symbolique de ton histoire. Il ne remplace pas un avis médical ou psychologique. Si tu traverses une période très difficile, parles-en à un professionnel ou à une personne de confiance.</p>';
    } }
  ];
  function lireInscrite() { try { return localStorage.getItem('deux-cycles-envoye') === 'oui'; } catch (e) { return false; } }

  /* ───── Affichage ───── */
  var courante = 0;
  function pageDepuisAdresse() { var h = (location.hash || '').replace('#', ''); for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === h) return i; return 0; }
  function faite(p) { return p.cles.some(function (k) { var x = D.v[k]; return x === true || (typeof x === 'string' && x.trim() !== ''); }); }
  function contenu(i) {
    return PAGES[i].h() + '<div class="dc-nav">' + (i > 0 ? '<button type="button" class="btn btn-trait" data-aller="' + (i - 1) + '">Précédente</button>' : '<span></span>') +
      (i < PAGES.length - 1 ? '<button type="button" class="btn btn-plein" data-aller="' + (i + 1) + '">Suivante</button>' : '') + '</div>';
  }
  function construire() {
    zone.innerHTML = PAGES.map(function (p, i) {
      return '<section class="dc-page" id="page-' + p.id + '" aria-label="' + esc(p.nom) + '"' + (i === courante ? '' : ' hidden') + '>' + contenu(i) + '</section>';
    }).join('');
    onglets.innerHTML = PAGES.map(function (p, i) { return '<button type="button" data-aller="' + i + '">' + (i + 1) + '. ' + esc(p.nom) + '</button>'; }).join('');
    brancher();
    etat();
    if (window.GenesoliaTypo) window.GenesoliaTypo(document.getElementById('dc'));
  }
  function etat() {
    PAGES.forEach(function (p, i) {
      var b = onglets.querySelector('[data-aller="' + i + '"]'); if (!b) return;
      b.classList.toggle('fait', faite(p));
      if (i === courante) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.getElementById('dc-numero').textContent = 'Page ' + (courante + 1) + ' sur ' + PAGES.length;
    document.getElementById('dc-barre').style.width = Math.round(PAGES.filter(faite).length / PAGES.length * 100) + '%';
  }
  function aller(i, sansDefiler) {
    i = Math.max(0, Math.min(PAGES.length - 1, i));
    /* les pages qui dépendent des réponses se recalculent en y arrivant */
    if (PAGES[i].id === 'resultat' || PAGES[i].id === 'suite') {
      var s = document.getElementById('page-' + PAGES[i].id);
      s.innerHTML = contenu(i);
      brancher(s);
      if (window.GenesoliaTypo) window.GenesoliaTypo(s);
    }
    courante = i;
    zone.querySelectorAll('.dc-page').forEach(function (s, n) { s.hidden = n !== i; });
    if (location.hash.replace('#', '') !== PAGES[i].id) history.replaceState(null, '', '#' + PAGES[i].id);
    etat();
    var b = onglets.querySelector('[aria-current]'); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' });
    if (!sansDefiler) { var top = document.getElementById('dc').getBoundingClientRect().top + window.pageYOffset - 80; window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' }); }
  }
  var minuteur = null;
  function sauver() {
    D.maj = new Date().toISOString();
    try { localStorage.setItem(CLE, JSON.stringify(D)); } catch (e) {}
    clearTimeout(minuteur);
    var t = document.getElementById('dc-etat'); t.textContent = 'Gardé dans ce navigateur';
    minuteur = setTimeout(function () { t.textContent = ''; }, 1800);
    etat();
  }
  function brancher(racine) {
    racine = racine || zone;
    racine.querySelectorAll('[data-k]').forEach(function (el) {
      if (el.getAttribute('data-branche')) return; el.setAttribute('data-branche', '1');
      var k = el.getAttribute('data-k');
      el.addEventListener(el.type === 'checkbox' || el.type === 'radio' ? 'change' : 'input', function () {
        D.v[k] = el.type === 'checkbox' ? el.checked : el.value; D.t[k] = Date.now();
        if (k === 'etape') { var g = document.getElementById('dc-geste'); g.hidden = false; document.getElementById('dc-geste-t').textContent = ETAPES[+el.value - 1][2]; if (window.GenesoliaTypo) window.GenesoliaTypo(g); }
        sauver();
      });
    });
    var f = racine.querySelector('#dc-form'); if (f && !f.getAttribute('data-branche')) { f.setAttribute('data-branche', '1'); f.addEventListener('submit', envoyer); }
    var im = racine.querySelector('#dc-imprimer'); if (im && !im.getAttribute('data-branche')) { im.setAttribute('data-branche', '1'); im.addEventListener('click', function () { window.print(); }); }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-aller]'); if (a) { aller(+a.getAttribute('data-aller')); return; }
    var w = e.target.closest('[data-vers]'); if (w) { for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === w.getAttribute('data-vers')) aller(i); }
  });
  window.addEventListener('hashchange', function () { var i = pageDepuisAdresse(); if (i !== courante) aller(i); });

  /* ───── Le résultat par e-mail (jamais les textes écrits) ───── */
  function envoyer(ev) {
    ev.preventDefault();
    var f = ev.target, err = f.querySelector('.dc-erreur'), bt = f.querySelector('button');
    var email = f.email.value.trim();
    if (f._gotcha.value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Vérifie ton adresse e-mail.'; f.email.focus(); return; }
    if (!f.accord.checked) { err.textContent = 'Coche la case d’accord pour recevoir ton résultat.'; return; }
    err.textContent = ''; bt.disabled = true; bt.textContent = 'Envoi en cours…';
    var r = resultat(), e = +v('etape') || 0;
    var data = new FormData();
    data.append('prenom', prenom()); data.append('email', email);
    data.append('cycle', r ? r.cle : 'non calculé'); data.append('resultat', r ? r.R.titre : '');
    data.append('etape', e ? e + ' · ' + ETAPES[e - 1][0] : 'non choisie');
    data.append('geste_etape', e ? ETAPES[e - 1][2] : '');
    data.append('lien', 'https://genesolia.fr/carnet-des-deux-cycles.html');
    data.append('fichier', 'https://genesolia.fr/' + PDF);
    data.append('source', 'carnet-des-deux-cycles.html');
    data.append('_subject', 'Carnet des deux cycles en ligne : résultat');
    (window.GenesoliaEnvoyer ? window.GenesoliaEnvoyer('Carnet des deux cycles en ligne', data, 'genesolia-deux-cycles') : Promise.reject())
      .then(function () {
        try { localStorage.setItem('deux-cycles-envoye', 'oui'); localStorage.setItem('carnet-inscrit', 'oui'); } catch (x) {}
        f.outerHTML = '<p class="dc-merci">Merci' + (prenom() ? ' ' + esc(prenom()) : '') + '. Ton résultat part dans ta boîte mail, avec le lien de ton carnet.</p>';
        if (window.umami) try { window.umami.track('deux-cycles-resultat'); } catch (x) {}
      })
      .catch(function () { bt.disabled = false; bt.textContent = 'Recevoir mon résultat'; err.textContent = 'L’envoi n’a pas fonctionné. Réessaie dans un instant.'; });
  }

  /* Pour le bilan de départ de Mon suivi : le résultat seul, sans les textes */
  function partagerResultat() {
    var r = resultat(); if (!r) return;
    try { localStorage.setItem('genesolia-deux-cycles-resultat', JSON.stringify({ cycle: r.cle, etape: +v('etape') || 0, prenom: prenom(), date: new Date().toISOString().slice(0, 10) })); } catch (e) {}
  }
  window.addEventListener('pagehide', partagerResultat);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') partagerResultat(); });

  courante = pageDepuisAdresse();
  construire();
  document.addEventListener('change', partagerResultat);
})();
